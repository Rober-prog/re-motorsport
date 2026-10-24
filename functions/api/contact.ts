import brand from '../../src/config/brand.json';
import { contactSchema } from '../../src/lib/contactSchema';
interface RateDatabase {
  prepare(sql: string): {
    bind(...values: (string | number)[]): {
      first<T>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
}
interface Env {
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
  ALLOWED_ORIGIN?: string;
  CONTACT_RATE_DB?: RateDatabase;
  RATE_LIMIT_SALT?: string;
}
interface Context {
  request: Request;
  env: Env;
}
const json = (body: object, status = 200) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
export async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (
    !brand.contact.submissionEnabled ||
    !brand.legal.privacyApproved ||
    !env.RESEND_API_KEY ||
    !env.CONTACT_FROM ||
    !env.CONTACT_TO ||
    !env.ALLOWED_ORIGIN ||
    !env.CONTACT_RATE_DB ||
    !env.RATE_LIMIT_SALT
  )
    return json({ ok: false, code: 'NOT_CONFIGURED' }, 503);
  if (
    request.headers.get('Origin') !== env.ALLOWED_ORIGIN ||
    new URL(request.url).origin !== env.ALLOWED_ORIGIN
  )
    return json({ ok: false, code: 'ORIGIN' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    return json({ ok: false, code: 'CONTENT_TYPE' }, 415);
  // Check bytes while streaming; do not trust Content-Length on a public endpoint.
  const reader = request.body?.getReader();
  if (!reader) return json({ ok: false }, 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const result = await reader.read();
    if (result.done) break;
    size += result.value.byteLength;
    if (size > 16384) {
      await reader.cancel();
      return json({ ok: false, code: 'TOO_LARGE' }, 413);
    }
    chunks.push(result.value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let input: unknown;
  try {
    input = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json({ ok: false, code: 'INVALID_JSON' }, 400);
  }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return json({ ok: false, code: 'VALIDATION' }, 400);
  const data = parsed.data;
  if (data.website) return json({ ok: false, code: 'SPAM' }, 400);
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return json({ ok: false, code: 'RATE_CONFIGURATION' }, 503);
  const now = Date.now();
  const windowStart = Math.floor(now / 60000);
  const day = Math.floor(now / 86400000);
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${env.RATE_LIMIT_SALT}:${day}:${ip}`),
  );
  const key = Array.from(new Uint8Array(digest))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
  try {
    await env.CONTACT_RATE_DB.prepare('DELETE FROM contact_rate_limits WHERE window_start < ?')
      .bind(windowStart - 1)
      .run();
    const row = await env.CONTACT_RATE_DB.prepare(
      'INSERT INTO contact_rate_limits (key, window_start, requests) VALUES (?, ?, 1) ON CONFLICT(key, window_start) DO UPDATE SET requests = requests + 1 RETURNING requests',
    )
      .bind(key, windowStart)
      .first<{ requests: number }>();
    if (!row) return json({ ok: false, code: 'RATE_CONFIGURATION' }, 503);
    if (row.requests > 5) return json({ ok: false, code: 'RATE_LIMIT' }, 429);
  } catch {
    return json({ ok: false, code: 'RATE_CONFIGURATION' }, 503);
  }
  const fields = [
    ['Nombre', data.name],
    ['Correo', data.email],
    ['Teléfono', data.phone],
    ['Tipo', data.type],
    ['Categoría', data.category],
    ['Empresa', data.company],
    ['Marca', data.brand],
    ['Modelo', data.model],
    ['Año', data.year],
    ['Motorización', data.engine],
    ['Pieza', data.part],
    ['Referencia', data.reference],
    ['Idioma', data.locale],
    ['Mensaje', data.message],
  ];
  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: data.email,
        subject: `Consulta web · ${data.type}`,
        text: fields
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n\n'),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) return json({ ok: false, code: 'DELIVERY' }, 502);
    const accepted = (await result.json()) as { id?: string };
    if (!accepted.id) return json({ ok: false, code: 'DELIVERY' }, 502);
    // Provider acceptance is confirmed; delivery to the inbox is subject to the mail service.
    return json({ ok: true });
  } catch {
    return json({ ok: false, code: 'DELIVERY' }, 502);
  }
}
export function onRequestGet() {
  return json({ ok: false, code: 'METHOD' }, 405);
}

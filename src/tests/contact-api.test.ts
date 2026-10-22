// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestPost } from '../../functions/api/contact';
const payload = {
  locale: 'es',
  name: 'Cliente de prueba',
  email: 'test@example.com',
  type: 'general',
  category: 'frenos',
  message: 'Necesito información sobre una pieza para mi vehículo.',
  consent: true,
  website: '',
};
const counter = vi.fn().mockResolvedValue({ requests: 1 });
const env = {
  RESEND_API_KEY: 'test-key',
  CONTACT_FROM: 'test@example.com',
  CONTACT_TO: 'team@example.com',
  ALLOWED_ORIGIN: 'https://rmartorell.com',
  RATE_LIMIT_SALT: 'test-only-not-a-real-secret',
  CONTACT_RATE_DB: {
    prepare: () => ({ bind: () => ({ first: counter, run: vi.fn().mockResolvedValue({}) }) }),
  },
};
const request = (data: unknown = payload, origin = 'https://rmartorell.com') =>
  new Request('https://rmartorell.com/api/contact', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '192.0.2.1',
    },
    body: JSON.stringify(data),
  });
afterEach(() => {
  vi.unstubAllGlobals();
  counter.mockResolvedValue({ requests: 1 });
});
describe('Cloudflare contact Function', () => {
  it('falla cerrada cuando faltan credenciales o rate limiting', async () => {
    expect((await onRequestPost({ request: request(), env: {} })).status).toBe(503);
    expect(
      (await onRequestPost({ request: request(), env: { ...env, CONTACT_RATE_DB: undefined } }))
        .status,
    ).toBe(503);
  });
  it('rechaza origen cruzado, entradas inválidas y honeypot', async () => {
    expect(
      (await onRequestPost({ request: request(payload, 'https://evil.example'), env })).status,
    ).toBe(403);
    expect(
      (await onRequestPost({ request: request({ ...payload, email: 'bad' }), env })).status,
    ).toBe(400);
    expect(
      (await onRequestPost({ request: request({ ...payload, website: 'spam' }), env })).status,
    ).toBe(400);
  });
  it('limita el tamaño del cuerpo aunque no haya Content-Length', async () => {
    expect(
      (await onRequestPost({ request: request({ ...payload, message: 'a'.repeat(18000) }), env }))
        .status,
    ).toBe(413);
  });
  it('devuelve 429 antes de llamar al proveedor', async () => {
    counter.mockResolvedValue({ requests: 6 });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await onRequestPost({ request: request(), env })).status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('solo confirma éxito cuando el proveedor devuelve identificador de aceptación', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ id: 'test-accepted' })));
    const result = await onRequestPost({ request: request(), env });
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({ ok: true });
  });
  it('no muestra éxito ante errores del proveedor ni respuestas sin id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Failed', { status: 500 })));
    expect((await onRequestPost({ request: request(), env })).status).toBe(502);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({})));
    expect((await onRequestPost({ request: request(), env })).status).toBe(502);
  });
});

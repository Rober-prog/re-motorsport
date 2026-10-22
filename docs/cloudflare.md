# Cloudflare Pages — preparación, sin despliegue

Este documento describe acciones futuras. No se han creado recursos remotos, contratado servicios, publicado versiones ni modificado DNS.

## Build y rutas

1. Utilizar el repositorio completo, con `functions/` en su raíz y `wrangler.jsonc`.
2. Seleccionar Node 24 LTS en el entorno de build.
3. Build command: `npm run build`. Output directory: `dist`.
4. El generador crea HTML en cada ruta, `/ca` y sus equivalentes, además de `404.html`. No añadir un rewrite global `/* /index.html 200`: eliminaría la ventaja de las páginas estáticas.
5. `_routes.json` limita las invocaciones de Functions a `/api/*`. `_headers` configura CSP, tipos, permisos, HSTS y caché de assets. La CSP permite WebAssembly local para Meshopt y contiene el hash del JSON-LD fijo.
6. Verificar entradas directas, cambio de idioma, 404 con status real, assets y endpoint en una revisión aprobada antes de abrir al público.

Referencias oficiales: [rutas](https://developers.cloudflare.com/pages/functions/routing/), [configuración](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [bindings de Pages](https://developers.cloudflare.com/pages/functions/bindings/).

## Correo

El adaptador usa la API oficial de [Resend](https://resend.com/docs/api-reference/emails/send-email). El usuario debe escoger y aprobar el proveedor, sus condiciones y el tratamiento de datos. El código no contrata el servicio.

Configurar solo en el servidor:

| Variable/binding  | Uso                                                  |
| ----------------- | ---------------------------------------------------- |
| `RESEND_API_KEY`  | Credencial de Resend                                 |
| `CONTACT_FROM`    | Remitente del dominio verificado                     |
| `CONTACT_TO`      | Destinatario real de consultas                       |
| `ALLOWED_ORIGIN`  | Origen exacto, inicialmente `https://rmartorell.com` |
| `RATE_LIMIT_SALT` | Secreto aleatorio de al menos 32 caracteres          |
| `CONTACT_RATE_DB` | Binding D1 para contadores atómicos                  |

`VITE_CONTACT_ENABLED=true` es una variable pública de build y únicamente activa la interfaz de envío. No poner credenciales con prefijo `VITE_`. Mantenerla en `false` hasta validar privacidad, destinatario y envío real. Las previews no deben utilizar el destinatario de producción sin aprobación.

Para desarrollo de Functions, copiar valores del servidor a `.dev.vars` (ignorado por Git). Reconstruir con la variable pública habilitada solo cuando la configuración esté lista y ejecutar `npm run dev:cloudflare`. Vite y la previsualización estática no ejecutan Pages Functions.

En la prueba local, usar `ALLOWED_ORIGIN=http://127.0.0.1:8788` y un destinatario de pruebas autorizado. El origen debe coincidir exactamente con la URL utilizada en el navegador; el valor de producción no habilita envíos desde localhost.

## Antispam y límites

Pages no documenta el binding nativo Rate Limiting de Workers entre sus bindings soportados. Se utiliza **D1**, compatible con Pages, en lugar de depender de un binding no confirmado.

Después de que el usuario autorice y aprovisione una base, añadir a `wrangler.jsonc`:

```json
{
  "d1_databases": [
    {
      "binding": "CONTACT_RATE_DB",
      "database_name": "NOMBRE_REAL",
      "database_id": "ID_REAL",
      "migrations_dir": "migrations"
    }
  ]
}
```

Aplicar `migrations/0001_contact_rate.sql` a la base autorizada antes de habilitar envíos. Para ensayar localmente tras configurar el binding: `npx wrangler d1 migrations apply NOMBRE_REAL --local`. La aplicación remota de la migración requiere la autorización correspondiente para ese recurso.

Se permiten cinco intentos válidos por minuto e IP mediante UPSERT atómico. Se almacena una clave SHA-256 salada que rota cada día, ventana y contador; nunca nombre, correo, mensaje ni IP en claro. Cada consulta elimina ventanas anteriores a la vigente y la anterior. Si no hay nuevas consultas, pueden permanecer contadores caducados: definir una limpieza programada si se exige un plazo máximo absoluto. El responsable debe reflejar este tratamiento mínimo de prevención de abuso en la privacidad definitiva. Una IP compartida puede agrupar usuarios.

También se valida el origen, Content-Type, consentimiento, tipo, categoría y longitud de campos. El cuerpo se limita a 16 KiB incluso sin Content-Length; honeypot y errores sin datos personales. El correo se construye en texto plano. Si faltan configuración, base, tabla o control de abuso, el endpoint devuelve 503. Si Resend rechaza o no devuelve un ID, devuelve 502. Un 200 significa aceptación por el proveedor, no una confirmación de lectura o entrega en bandeja.

## Conexión del dominio: solo después de autorización

1. Completar licencia de modelo/capturas, datos de negocio y textos legales.
2. Ejecutar y revisar todas las pruebas, incluidos envíos de prueba a un destinatario autorizado.
3. Con aprobación explícita, crear/configurar el proyecto Pages y el entorno de producción.
4. Añadir `rmartorell.com` en **Custom domains** y seguir los registros exactos que indique Cloudflare para la zona real. No se han inferido ni aplicado registros DNS.
5. Decidir si `www.rmartorell.com` se redirige al dominio canónico. Verificar TLS y ausencia de contenido mixto.
6. Configurar el dominio del proveedor de correo con los registros SPF/DKIM que este facilite; no inventar valores.
7. Volver a medir con tráfico y dispositivos representativos. Mantener una versión aprobada para rollback.

No hay un script automático de deploy en `package.json`, para evitar publicaciones accidentales durante desarrollo.

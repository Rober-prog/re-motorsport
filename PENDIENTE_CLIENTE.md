# Pendiente de validar antes de publicar

- [x] Logo del negocio aportado por el usuario e integrado; rojo, negro y blanco extraídos del JPEG.
- [ ] Revisar la reconstrucción de alta resolución y, si existe, aportar el archivo vectorial y la carta de color oficiales. Confirmar los derechos para publicación. Los tonos de interfaz y grises de apoyo son adaptaciones web documentadas.
- [ ] Sociedad titular de esta web, NIF, domicilio legal, datos registrales y responsable del tratamiento. No se ha atribuido el NIF de ninguna tienda al grupo.
- [ ] Confirmación directa de las tiendas de Esparreguera y Piera, teléfonos y horarios. Las fuentes públicas coinciden, pero no sustituyen al negocio.
- [ ] Asociación de Olesa a la marca/grupo. Oculta en configuración; no aparece como sucursal pública.
- [ ] Vigencia de `info@re-motorsport.es` y WhatsApp `+34 692 50 83 55`. No están activados ni enlazados.
- [ ] Dominio autorizado. Definir `VITE_SITE_URL=https://dominio-confirmado` y reconstruir; no se ha utilizado ninguno de los dominios históricos como canónico.
- [ ] Catálogo real, marcas representadas, disponibilidad, condiciones, recogida, entregas, devoluciones y posibles servicios de taller. No se publican stock, precios ni promesas comerciales no acreditadas.
- [ ] Confirmar neumáticos, llantas, herramientas y limpieza antes de añadir esas familias. La navegación actual es orientativa.
- [ ] Revisar los derechos de las imágenes de categorías y aprobar las escenas ilustrativas generadas del Nissan GT-R. El antiguo modelo 3D se ha retirado y no se publica. Aportar fotografías reales de tiendas si se desean publicar.
- [ ] Aviso legal y privacidad definitivos, base jurídica, proveedores, conservación y canal para ejercer derechos.
- [ ] Configurar correo y backend solamente tras aprobar privacidad. `submissionEnabled` y `privacyApproved` están desactivados en el maestro central; también se requiere `VITE_CONTACT_ENABLED=true` y las credenciales/D1 del servidor. Una bandera de frontend por sí sola no habilita el envío.
- [ ] Probar entrega real de correo con autorización; las pruebas actuales usan dobles y no envían mensajes.
- [ ] Revisión final por la empresa y autorización expresa antes de cualquier publicación, cambio de DNS o servicio externo.

El sitio se mantiene en desarrollo local, con `noindex`, robots que bloquea rastreo y el flujo de publicación heredado desactivado. No se han cambiado servicios externos.

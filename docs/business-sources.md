# Información del negocio

Datos aportados por el propietario y contrastados con las tres páginas enlazadas. El registro central está en `src/data/business.json`; su presentación compartida, en `src/lib/business.ts`.

| Campo                        | Valor incorporado                                                                          | Fuente y alcance                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre comercial             | Recanvis Martorell                                                                         | [Directorio municipal](https://moliempresa.martorell.cat/directori-empreses/recanvis-martorell/)                                                               |
| Razón social                 | RECANVIS MARTORELL SL                                                                      | [Iberinform](https://www.iberinform.es/empresa/1388746/recanvis-martorell) y [condiciones de la tienda](https://recambiosclasicos.com/terminos-y-condiciones/) |
| NIF                          | B60408010                                                                                  | Mismas fuentes                                                                                                                                                 |
| Forma jurídica               | Sociedad limitada                                                                          | Iberinform                                                                                                                                                     |
| Constitución                 | 2 de enero de 1994                                                                         | Iberinform. Se presenta como constitución de la sociedad; no como inicio de actividad ni antigüedad comercial.                                                 |
| Actividad publicada          | Comercio al por mayor de repuestos y accesorios de vehículos de motor; CNAE publicado 4672 | Iberinform. Se conserva el carácter de clasificación publicada.                                                                                                |
| Dirección publicada          | Carretera de Piera, 4, 08760 Martorell, Barcelona                                          | Directorio municipal y datos aportados; Iberinform coincide con el número 4.                                                                                   |
| Variante                     | Carretera de Piera, 4A                                                                     | Las condiciones de la tienda la denominan domicilio social. La numeración y el acceso exactos siguen pendientes de confirmar.                                  |
| Datos registrales publicados | Registro Mercantil de Barcelona; tomo 26389, folio 39, hoja B-102056, inscripción 3        | Condiciones de la tienda y localización del registro en Iberinform. No se ha obtenido certificación registral actual.                                          |
| Web corporativa              | https://www.rmartorell.com                                                                 | Datos aportados e Iberinform. Se mantiene el canonical previsto del proyecto, https://rmartorell.com.                                                          |
| Tienda especializada         | https://recambiosclasicos.com                                                              | Sus condiciones identifican a Recanvis Martorell SL. Se incorpora un enlace externo en la página de clásicos.                                                  |

## Aplicación en la web

Empresa muestra la actividad, ubicación publicada y fecha de constitución. Contacto muestra la dirección y su variante, con la cautela correspondiente. El aviso legal incorpora titular, NIF, actividad y registro publicado; la privacidad identifica al responsable y conserva sus demás apartados provisionales. El pie incluye razón social y NIF. Todo se presenta en español y catalán.

Los datos estructurados incorporan razón social, NIF, logo, tienda vinculada y localidad/provincia/código postal. Se omite el número de calle mientras `streetNumberConfirmed` sea falso. No se utiliza la constitución como `foundingDate`.

## Pendientes

Confirmar 4/4A y acceso, vigencia registral, teléfono/WhatsApp, correo comercial y horario actuales; completar privacidad, proveedor de correo, D1 y textos legales definitivos. Las páginas consultadas publican canales y horarios adicionales, con diferencias entre el directorio y la tienda; no se han convertido automáticamente en contactos vigentes de esta web.

Se conserva el bloqueo de envío de formularios: disponer de razón social y NIF no configura ni valida por sí solo el servicio de correo. No se ha contactado a la empresa, enviado correo ni publicado la web.

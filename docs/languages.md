# Español y catalán

El español es el idioma inicial: `/`, `/catalogo`, `/contacto`, etc. El catalán utiliza `/ca`, `/ca/catalogo`, `/ca/contacto`, etc. Los enlaces `/es/...` siguen mostrando español como alias.

El selector ES/CA está en la barra superior y conserva página, parámetros de consulta y ancla. No utiliza cookies ni almacenamiento local; recargar o abrir un enlace directo mantiene el idioma de la URL. Funciona también sin JavaScript con los enlaces y páginas prerenderizadas.

Textos completos en `src/locales/es.json` y `ca.json`, con 250 claves por idioma. Las categorías y familias catalanas están en `src/data/categories.ca.json`. Se traducen portada, navegación, categorías, tiendas, formularios, errores, textos alternativos, aria-labels, pie y avisos. Nombres de marca, localidades y calles se conservan.

El atributo `html lang`, títulos, descripciones y Open Graph siguen el idioma. Cuando se configure el dominio autorizado, las páginas llevan canónicos y alternativos es/ca con x-default español. Mientras el dominio esté pendiente, la indexación permanece bloqueada.

El botón «Consultar un recambio» queda únicamente en la cabecera; se han retirado sus duplicados de la portada y la banda inferior. La cabecera móvil dispone el botón en una segunda fila y mantiene visibles el selector y el menú.

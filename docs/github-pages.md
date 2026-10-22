# Revisar la web en el móvil con GitHub Pages

El repositorio incluye todo el código, imágenes, modelos, pruebas y un workflow que compila y publica la web al subir cambios a `main`.

## Subir este repositorio

Desde PowerShell, dentro de la carpeta del proyecto:

```powershell
gh auth login
gh repo create recanvis-martorell --public --source=. --remote=origin --push
```

Si ya tienes un repositorio vacío en GitHub, usa su dirección:

```powershell
git remote add origin https://github.com/TU_USUARIO/recanvis-martorell.git
git push -u origin main
```

## Activar la página

1. En el repositorio de GitHub, abre **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Abre **Actions → Publicar en GitHub Pages → Run workflow → main → Run workflow**. Esto permite iniciar la publicación si el primer push ocurrió antes de activar Pages.
4. Cuando termine, abre el enlace del despliegue desde el móvil. Para un repositorio llamado `recanvis-martorell`, normalmente será `https://TU_USUARIO.github.io/recanvis-martorell/`.

El workflow obtiene la ruta base de Pages automáticamente. La navegación en español y catalán, los enlaces directos a páginas interiores y las imágenes funcionan dentro de esa ruta. La portada usa una fotografía fija, sin modelos ni controles 3D. Cada nuevo push a `main` vuelve a publicar.

GitHub Pages sirve la web estática. El formulario está desactivado en esta previsualización porque el endpoint de correo requiere Cloudflare Functions y su configuración. El resto de la web se puede revisar desde el móvil.

## Guardar cambios posteriores

```powershell
git add .
git commit -m "Actualizar la web"
git push
```

## Copias portátiles

`recanvis-martorell.bundle` contiene el repositorio y su historial. Se puede restaurar con:

```powershell
git clone recanvis-martorell.bundle recanvis-martorell
```

`recanvis-martorell-github.zip` contiene los archivos del proyecto, incluida la carpeta `.github`, sin dependencias, archivos temporales ni secretos. La forma recomendada de subirlo es mediante Git, como se indica arriba; el cargador web de GitHub limita el tamaño de cada archivo.

Documentación oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

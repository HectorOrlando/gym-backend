# skeleton-api-rest-full


Pasos para arrancar un proyecto clonado desde GitHub:

1. **Clonar el repositorio:**

   ```bash
   git@github.com:HectorOrlando/gym-backend.git
   ```

   

2. **Navegar al directorio del proyecto:**

   ```bash
   cd gym-backend
   ```

3. **Instalar dependencias:**

   ```bash
   npm install
   ```

   Esto instalará todas las dependencias necesarias que están definidas en el archivo `package.json`.

4. **Configurar las variables de entorno:**

   Modificar el archivo `.env.template` a `.env` en la raíz del proyecto y configura las variables de entorno según las necesidades de tu aplicación.

5. **Compilar el código TypeScript:**

   ```bash
   npm run build
   ```

   Esto compilará el código TypeScript y generará los archivos JavaScript en el directorio `dist/`.

6. **Iniciar la aplicación:**

   ```bash
   npm start
   ```

   Esto arrancará la aplicación con Node.js, utilizando los archivos JavaScript generados en el paso anterior.

   O, si prefieres utilizar nodemon en modo de desarrollo:

   ```bash
   npm run dev
   ```

   Esto arrancará la aplicación con nodemon, lo que reiniciará automáticamente la aplicación cuando detecte cambios en los archivos.

7. **Acceder a la aplicación:**

   Abre tu navegador y accede a la aplicación a través de la URL y el puerto configurados en tu archivo `.env` o en el código del servidor.

8. **Probar la aplicación:**

   Realiza pruebas en las rutas y funcionalidades de tu aplicación para asegurarte de que todo funcione como se espera.

Estos pasos deberían proporcionarte una guía básica para arrancar un proyecto clonado. Asegúrate de revisar el archivo `package.json` del proyecto clonado para conocer cualquier configuración específica de scripts o dependencias. Además, ten en cuenta que estos pasos pueden variar ligeramente dependiendo de la configuración específica del proyecto.



---


### Pasos para agregar colecciones y entornos en Postman:

1. **Importar Colecciones:**
   - Abre Postman.
   - Haz clic en el botón "Import" en la parte superior izquierda.
   - Selecciona la opción "Import From Link".
   - Copia y pega la URL de la colección de GitHub y haz clic en "Import".

2. **Importar Entornos:**
   - Repite el mismo proceso para importar el archivo de entorno desde la URL de GitHub.

3. **Configurar Variables de Entorno:**
   - En la interfaz de Postman, ve a la esquina superior derecha y selecciona el entorno que importaste.
   - Haz clic en el ojo de cerradura para editar el entorno.
   - Ajusta las variables según sea necesario, como cambiar la URL de desarrollo o producción.

4. **Modificar Solicitudes:**
   - Abre cada solicitud en la colección y asegúrate de que estén utilizando las variables de entorno para las URL. En tu caso, parece que estás usando `{{url}}` en las URL de las solicitudes.

5. **Ejecutar Pruebas:**
   - Ejecuta cada solicitud individualmente para asegurarte de que estén funcionando correctamente.

6. **Exportar Colecciones y Entornos:**
   - En Postman, selecciona las colecciones y el entorno que has importado.
   - Haz clic en el botón "Export" y elige exportar como archivos JSON.# gym-backend

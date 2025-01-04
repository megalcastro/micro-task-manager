# Micro Task Manager

## Descripción

Este proyecto es una aplicación de gestión de tareas que permite crear, editar y eliminar tareas. La aplicación está construida utilizando **NestJS** para los microservicios y **Docker** para la contenerización, con un monorepo gestionado con **NX**.

## Requisitos previos

Asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Colima](https://github.com/abiosoft/colima) (Si usas MacOS para ejecutar Docker con Colima)
- [NX CLI](https://nx.dev/) (para gestionar el monorepo)

## Instalación

1. **Clona el repositorio:**

    ```bash
    git clone https://github.com/megalcastro/micro-task-manager.git
    cd micro-task-manager
    ```

2. **Instala las dependencias:**

    Si estás usando **Node.js** directamente:
    
    ```bash
    npm install
    ```

    Si estás trabajando dentro de un monorepo gestionado con **NX**, puedes instalar todas las dependencias necesarias:

    ```bash
    npx nx install
    ```

## Configuración de Docker

1. **Inicia Colima (si estás en MacOS):**

    ```bash
    colima start --runtime docker
    ```

2. **Construye e inicia los contenedores:**

    Utiliza **Docker Compose** para construir y ejecutar los servicios. Asegúrate de estar en la raíz del proyecto y de tener el archivo `docker-compose.yml` configurado correctamente.

    ```bash
    docker-compose up --build
    ```

    Esto iniciará los servicios, incluyendo los microservicios de la aplicación, como `tasks-create`, `auth-service`,`task-update`,`task-delete`,`task-read` y cualquier otro que esté configurado en el archivo **docker-compose.yml**.

## Ejecución local (sin Docker)

Si prefieres ejecutar la aplicación sin Docker, sigue estos pasos:

1. **Inicia el servidor de desarrollo de NestJS:**

    ```bash
    npm run start:dev
    ```

2. **Accede a la aplicación en:**
    
    - `http://localhost:3000/api` para el servicio de tareas.
    - `http://localhost:3001/api` para el servicio de autenticación (si se tiene configurado).

## Pruebas

1. **Pruebas unitarias:**

    Ejecuta las pruebas unitarias para cada microservicio de la siguiente manera:

    ```bash
    npx nx test <nombre-del-servicio>
    ```

    Asegúrate de reemplazar `<nombre-del-servicio>` por el nombre del microservicio que deseas probar, por ejemplo: `tasks-create`.

2. **Pruebas de integración:**

    También puedes ejecutar pruebas de integración si has configurado pruebas para los endpoints de la API:

    ```bash
    npx nx e2e <nombre-del-servicio>-e2e
    ```

## Scripts útiles

- `npm run build`: Construye la aplicación para producción.
- `npm run start:dev`: Inicia la aplicación en modo desarrollo.
- `npm run lint`: Ejecuta el linter para comprobar la calidad del código.
- `npm run test`: Ejecuta las pruebas unitarias.

## Contribuciones

Si deseas contribuir al proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu nueva característica o corrección de errores.
3. Realiza tus cambios y asegúrate de que el código siga las convenciones de estilo del proyecto.
4. Envía un **pull request** para que revisemos tus cambios.

## Licencia

Este proyecto está licenciado bajo la **MIT License**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

¡Gracias por contribuir y usar el Micro Task Manager! 🚀

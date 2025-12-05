# El Sello Dorado - Frontend

Este proyecto es el frontend para la aplicación de e-commerce "El Sello Dorado", especializada en la venta de perfumes. Está construido con React y Vite, y se integra con una API REST para gestionar productos, usuarios y autenticación.

## Funcionalidades Principales

### 1. Catálogo de Productos (`Home.jsx`)
- **Visualización**: Muestra una grilla de perfumes con su imagen, nombre, marca, precio y estado de stock.
- **Filtrado**: Permite filtrar productos por nombre, marca, género, concentración, precio y más.
- **Gestión (Admin)**: Los usuarios autenticados pueden ver botones para "Actualizar" o "Eliminar" productos directamente desde la tarjeta del producto.

### 2. Detalle de Producto (`GetPerfume.jsx`)
- **Información Completa**: Muestra todos los detalles de un perfume específico.
- **Carrito de Compras**: Permite agregar el producto al carrito. Si el usuario no está logueado, lo redirige al login.
- **Gestión (Admin)**: Opciones para editar o eliminar el producto si el usuario tiene permisos.

### 3. Carrito de Compras (`Cart.jsx` y `CartContext.jsx`)
- **Gestión de Estado**: Utiliza un Contexto (`CartContext`) para manejar el estado global del carrito.
- **Persistencia**: El carrito se guarda en `localStorage` para no perder los productos al recargar la página.
- **Funciones**: Agregar productos, eliminar productos, modificar cantidades y ver el total de la compra.

### 4. Autenticación (`AuthContext.jsx`, `Login.jsx`, `Register.jsx`)
- **JWT**: Manejo de tokens JWT para la autenticación.
- **Protección de Rutas**: Componentes como `PrivateRoute` aseguran que solo usuarios autenticados accedan a ciertas vistas (ej. Agregar Producto).
- **Persistencia**: El token se guarda en `localStorage` para mantener la sesión iniciada.

### 5. Gestión de Productos (`AddProduct.jsx`, `UpdatePerfume.jsx`)
- **Creación**: Formulario para agregar nuevos perfumes, incluyendo la subida de imágenes.
- **Edición**: Modal para actualizar la información de un producto existente.

### 6. Contacto (`Contact.jsx`)
- **Formulario**: Permite a los usuarios enviar mensajes de contacto que son procesados por el backend.

## Tecnologías Utilizadas

- **React**: Librería principal para la interfaz de usuario.
- **Vite**: Empaquetador y servidor de desarrollo.
- **React Router**: Para la navegación y enrutamiento.
- **CSS Modules / Global CSS**: Estilos personalizados con variables CSS para mantener la consistencia del diseño (colores dorados y negros).

## Instalación y Ejecución

1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Ejecutar el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Construir para producción:
    ```bash
    npm run build
    ```

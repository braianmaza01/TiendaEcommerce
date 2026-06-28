# URBX - Tienda de Ropa Urbana

## Descripción
Tienda e-commerce completa para negocios de ropa con panel de administración integrado.

## Tecnologías
**Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router
**Backend:** Node.js, Express, MongoDB, JWT
**Servicios:** Cloudinary (imágenes), MongoDB Atlas

## Características
- Catálogo de productos con filtros por categoría y género
- Carrito de compras con persistencia
- Checkout con retiro en local o envío a domicilio
- Notificación de pedidos por WhatsApp
- Panel admin con CRUD de productos y gestión de pedidos
- Subida de imágenes a Cloudinary
- Diseño responsive mobile/desktop
- Animaciones con Framer Motion

## Instalación

### Backend
```
cd backend
npm install
```
Crear archivo `.env` con las variables necesarias
```
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Variables de entorno necesarias (backend/.env)
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
ADMIN_USUARIO=
ADMIN_CONTRASENA=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
WHATSAPP_TIENDA=
```

## Deploy
Frontend: Netlify
Backend: Render

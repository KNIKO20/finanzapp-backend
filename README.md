# FinanzApp – Backend 🖥️  

API REST para la gestión de finanzas personales.  
Construida con **Node.js, Express y PostgreSQL**, maneja la autenticación de usuarios, operaciones financieras y seguridad de las peticiones.  

---

## 🚀 Características  

- 👤 Registro e inicio de sesión de usuarios (JWT).  
- 🔐 Manejo de sesión con cookies seguras.  
- 📊 CRUD completo de operaciones financieras.  
- 🗄️ Base de datos PostgreSQL.  
- ⚡ Integración lista para frontend en React.  

---

## 🛠️ Tecnologías  

- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/)  
- [PostgreSQL](https://www.postgresql.org/)  
- [pg](https://node-postgres.com/)  
- [JWT](https://jwt.io/)  
- [bcrypt](https://www.npmjs.com/package/bcrypt)  
- [dotenv](https://github.com/motdotla/dotenv)  

---

## 📂 Estructura del proyecto  

```bash
finanzapp-backend/
│── src/
│   ├── controllers/   # Controladores (auth, operations, etc.)
│   ├── middleware/    # Middlewares (auth, error handling)
│   ├── routes/        # Rutas de la API
│   ├── server.ts      # Configuración del servidor
│── docker-compose.yml # Entorno de PostgreSQL + PgAdmin
│── .env.example       # Variables de entorno (ejemplo)
│── package.json
│── README.md
```

## Instalación y uso
1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/finanzapp-backend.git
cd finanzapp-backend
```
2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
Crea un archivo .env en la raíz con algo como:

```.env
DB_USER=admin
DB_PASS=admin123
DB_NAME=finanzapp
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=tu_secreto_seguro
```
4. Levantar PostgreSQL con Docker
```bash
docker-compose up -d
```
5. Iniciar el backend
```bash
npx tsx watch .\server.js
```
El servidor estará disponible en:
http://localhost:8000

## 📌 Endpoints principales
Auth
POST /auth/register → Registrar usuario.

POST /auth/login → Iniciar sesión.

POST /auth/logout → Cerrar sesión.

Operaciones
GET /operations/show → Listar operaciones.

GET /operations/details/:id → Obtener una operación.

POST /operations/add → Crear operación.

PUT /operations/update/:id → Actualizar operación.

DELETE /operations/delete/:id → Eliminar operación.

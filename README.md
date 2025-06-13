# TicketNow
Proyecto de semestre para Sistemas Distribuidos
1. Requisitos previos
Git

Node.js (v16+) y npm

Python (v3.9+) y pip

Docker (y Docker Compose)

PostgreSQL, MongoDB y RabbitMQ (preferiblemente desplegados en Docker)

Editor de código (VS Code, etc.)

🕒 Tiempo estimado de instalación inicial: 15 min

2. Clonar el repositorio
bash
Copiar
Editar
git clone https://github.com/Andresqss/TicketNow.git
cd TicketNow
3. Levantar infraestructuras con Docker Compose
En la raíz crea (o verifica) un docker-compose.yml como este:

yaml
Copiar
Editar
version: '3.8'
services:
  postgres:
    image: postgres:17
    container_name: postgres_ticketnow
    env_file:
      - ./docker/.env.postgres
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongo_reservations:
    image: mongo:6
    container_name: mongo_reservations
    environment:
      MONGO_INITDB_DATABASE: reservations_db
    ports:
      - '27017:27017'
    volumes:
      - mongo_reservations_data:/data/db

  mongo_notifications:
    image: mongo:6
    container_name: mongo_notifications
    environment:
      MONGO_INITDB_DATABASE: notifications_db
    ports:
      - '27018:27017'
    volumes:
      - mongo_notifications_data:/data/db

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq_ticketnow
    ports:
      - '5672:5672'
      - '15672:15672'

volumes:
  postgres_data:
  mongo_reservations_data:
  mongo_notifications_data:
Y en docker/.env.postgres define:

dotenv
Copiar
Editar
POSTGRES_USER=ticketnow
POSTGRES_PASSWORD=ticketnow123
POSTGRES_DB=event_management
Luego:

bash
Copiar
Editar
docker-compose up -d
Verifica:

PostgreSQL en localhost:5432

MongoDB en localhost:27017 y 27018

RabbitMQ Management UI en http://localhost:15672 (user: guest, pass: guest)

4. Configurar variables de entorno
Crea un archivo .env en cada servicio según este ejemplo.

4.1. Backend (Node.js + Prisma + Express)
Ubicado en ticketnow_backend/.env:

dotenv
Copiar
Editar
DATABASE_URL=postgresql://ticketnow:ticketnow123@localhost:5432/event_management
JWT_SECRET=TuSecretoJWTaquí
PORT=3001
4.2. API de Reservaciones (FastAPI + MongoDB)
Ubicado en services/reservations/.env:

dotenv
Copiar
Editar
MONGO_URI=mongodb://localhost:27017/reservations_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672
PORT=8001
4.3. API de Notificaciones (FastAPI + MongoDB + RabbitMQ)
Ubicado en services/notifications/.env:

dotenv
Copiar
Editar
MONGO_URI=mongodb://localhost:27018/notifications_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672
PORT=8002
4.4. Front-end (Next.js / Vite)
Ubicado en ticketnow_frontend/.env:

dotenv
Copiar
Editar
VITE_API_URL=http://localhost:3001/api
5. Inicializar y migrar la base de datos PostgreSQL
bash
Copiar
Editar
cd ticketnow_backend
npm install
npx prisma generate
npx prisma migrate deploy     # o `npx prisma migrate dev --name init`
Confirma que en event_management existen las tablas de Prisma.

6. Levantar los microservicios
6.1. Backend principal (Express + Prisma)
bash
Copiar
Editar
cd ticketnow_backend
npm run dev                   # o `npm start` para producción
URL base: http://localhost:3001

Swagger UI: http://localhost:3001/api/docs

6.2. API Reservaciones (FastAPI)
bash
Copiar
Editar
cd services/reservations
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
Docs: http://localhost:8001/docs

6.3. API Notificaciones (FastAPI)
bash
Copiar
Editar
cd services/notifications
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8002
Docs: http://localhost:8002/docs

7. Levantar front-end
bash
Copiar
Editar
cd ticketnow_frontend
npm install
npm run dev
Next.js por defecto en http://localhost:3000

Vite por defecto en http://localhost:5173

Asegúrate de que la variable VITE_API_URL apunte al puerto del backend de Express.

8. Poblar datos de prueba (opcional)
Si incluyes scripts de seed:

Prisma:

bash
Copiar
Editar
cd ticketnow_backend
npx prisma db seed
MongoDB:

bash
Copiar
Editar
mongo --port 27017 reservations_db seed_reservations.js
mongo --port 27018 notifications_db seed_notifications.js
9. Pruebas y validación
Usuarios y sesiones: regístrate y autentícate vía tu front-end.

Reservas: crea, lista y elimina reservas usando la UI.

Notificaciones: comprueba que las notificaciones se envían (revisa RabbitMQ Management).

Reportes/Eventos: usa los endpoints Swagger para revisar datos de eventos.

10. Despliegue en producción
Build del front-end:

bash
Copiar
Editar
cd ticketnow_frontend
npm run build
# luego servir con `serve -s dist` o configurarlo en tu servidor web
Build del backend:

bash
Copiar
Editar
cd ticketnow_backend
npm run build        # si usas TypeScript/compilación
NODE_ENV=production npm start
Dockerización (opcional):

Crea un Dockerfile para cada servicio.

Ajusta tu docker-compose.yml con imágenes custom.

Usa un proxy (Nginx) para servir front y balancear APIs.


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    reservation_router,
    ticket_type_router,
    payment_log_router,
    waiting_queue_router
)

app = FastAPI(
    title="API de Reservaciones para Conciertos",
    description="Microservicio RESTful para la gestión de reservaciones, tickets, pagos y colas de espera.",
    version="1.0.0"
)

# CORS settings (ajusta según frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar por dominios específicos en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(reservation_router.router)
app.include_router(ticket_type_router.router)
app.include_router(payment_log_router.router)
app.include_router(waiting_queue_router.router)

@app.get("/")
async def root():
    return {"message": "API de Reservaciones activa"}

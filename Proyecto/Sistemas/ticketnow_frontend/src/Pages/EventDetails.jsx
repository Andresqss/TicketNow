import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VenueMap from "../components/VenueMap";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestData, setGuestData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/events/${id}`
        );
        const data = await response.json();
        setEvent(data);

        if (data.event_schedules && data.event_schedules.length === 1) {
          setSelectedSchedule(data.event_schedules[0]);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar los detalles del evento");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      let response;
      const totalPrice = selectedSeats
        ? ticketQuantity * selectedSeats.price
        : ticketQuantity * event.base_price;

      if (user) {
        response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/ticket-reservations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              event_id: event.event_id,
              quantity: ticketQuantity,
              total_price: totalPrice,
              user_id: user.user_id,
              selectedSeats: selectedSeats,
            }),
          }
        );
      } else {
        // Invitado
        response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/guest-reservations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event_id: event.event_id,
              quantity: ticketQuantity,
              guest_email: guestData.email,
              guest_name: guestData.name,
              guest_phone: guestData.phone,
              selectedSeats: selectedSeats,
            }),
          }
        );
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al realizar la reserva");
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/events");
      }, 5000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log({
      user: !!user,
      selectedSchedule: !!selectedSchedule,
      selectedSeats: !!selectedSeats,
      isSubmitting,
    });
  }, [user, selectedSchedule, selectedSeats, isSubmitting]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600">
          Evento no encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {event.event_name}
            </h1>

            <div className="mb-8">
              <VenueMap
                onSeatSelect={setSelectedSeats}
                selectedSeats={selectedSeats}
              />
            </div>

            {selectedSeats && (
              <div className="mb-6 p-4 bg-cyan-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Tu selección:</h3>
                <p>Zona: {selectedSeats.name}</p>
                <p>Precio por ticket: ${selectedSeats.price}</p>
                <p>Total: ${selectedSeats.price * ticketQuantity}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Fecha</h3>
                <p>{formatDate(event.start_datetime)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Capacidad</h3>
                <p>{event.capacity} personas</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Precio base
                </h3>
                <p className="text-cyan-600 font-bold">${event.base_price}</p>
              </div>
            </div>

            {event.event_schedules && event.event_schedules.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Horarios disponibles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.event_schedules.map((schedule) => (
                    <div
                      key={schedule.schedule_id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedSchedule?.schedule_id === schedule.schedule_id
                          ? "border-cyan-600 bg-cyan-50"
                          : "border-gray-200 hover:border-cyan-600"
                      }`}
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        console.log("Horario seleccionado:", schedule);
                      }}
                    >
                      <p className="font-semibold">
                        {formatDate(schedule.schedule_date)}
                      </p>
                      <p className="text-gray-600">
                        {formatTime(schedule.start_time)} -{" "}
                        {formatTime(schedule.end_time)}
                      </p>
                      {schedule.description && (
                        <p className="text-sm text-gray-500 mt-2">
                          {schedule.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <p className="text-red-500">
                  No hay horarios disponibles para este evento
                </p>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Add guest mode toggle button */}
              {!user && (
                <div className="w-full md:w-auto mb-4 md:mb-0">
                  <button
                    onClick={() => setIsGuestMode(!isGuestMode)}
                    className="text-cyan-600 underline hover:text-cyan-700"
                  >
                    {isGuestMode ? "Iniciar sesión" : "Continuar como invitado"}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="font-semibold">
                  Cantidad de tickets:
                </label>
                <select
                  id="quantity"
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(Number(e.target.value))}
                  className="border rounded-lg px-3 py-2"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="bg-cyan-600 text-white px-8 py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !selectedSchedule ||
                  !selectedSeats ||
                  isSubmitting ||
                  (!user && !isGuestMode)
                }
                onClick={handleReservation}
              >
                {isSubmitting ? "Reservando..." : "Reservar tickets"}
              </button>

              {/* Update validation messages */}
              {!user && !isGuestMode ? (
                <p className="text-cyan-600 text-sm">
                  Inicia sesión o continúa como invitado para reservar
                </p>
              ) : (
                <>
                  {!selectedSchedule && (
                    <p className="text-red-500 text-sm">
                      Selecciona un horario
                    </p>
                  )}
                  {!selectedSeats && (
                    <p className="text-red-500 text-sm">Selecciona una zona</p>
                  )}
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            {selectedSchedule && (
              <div className="mt-4 p-4 bg-cyan-50 rounded-lg">
                <h3 className="font-bold mb-2">Horario seleccionado:</h3>
                <p>{formatDate(selectedSchedule.schedule_date)}</p>
                <p>
                  {formatTime(selectedSchedule.start_time)} -{" "}
                  {formatTime(selectedSchedule.end_time)}
                </p>
              </div>
            )}

            {!user && isGuestMode && (
              <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
                <h3 className="font-bold text-2xl mb-6 text-gray-800">
                  Completa tus datos para reservar
                </h3>
                <form onSubmit={handleReservation} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      id="guest_name"
                      value={guestData.name}
                      onChange={(e) =>
                        setGuestData({ ...guestData, name: e.target.value })
                      }
                      className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 placeholder-transparent transition-colors"
                      placeholder="Nombre completo"
                    />
                    <label
                      htmlFor="guest_name"
                      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all
                      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5
                      peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-500"
                    >
                      Nombre completo
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      required
                      id="guest_email"
                      value={guestData.email}
                      onChange={(e) =>
                        setGuestData({ ...guestData, email: e.target.value })
                      }
                      className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 placeholder-transparent transition-colors"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="guest_email"
                      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all
                      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5
                      peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-500"
                    >
                      Email
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      required
                      id="guest_phone"
                      value={guestData.phone}
                      onChange={(e) =>
                        setGuestData({ ...guestData, phone: e.target.value })
                      }
                      className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 placeholder-transparent transition-colors"
                      placeholder="Teléfono"
                    />
                    <label
                      htmlFor="guest_phone"
                      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all
                      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5
                      peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-500"
                    >
                      Teléfono
                    </label>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                ¡Reserva exitosa!
              </h3>

              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {user ? (
                    "Tu reserva ha sido confirmada."
                  ) : (
                    <>
                      Hemos enviado un comprobante de reserva a tu correo
                      electrónico:{" "}
                      <span className="font-medium text-cyan-600">
                        {guestData.email}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm text-gray-500">
                  Serás redirigido en 5 segundos...
                </p>
                <button
                  onClick={() => navigate("/events")}
                  className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:text-sm"
                >
                  Ir a eventos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;

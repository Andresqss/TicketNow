import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReservation, setEditingReservation] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const { user } = useAuth();

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/my-reservations`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setError("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("¿Estás seguro de cancelar esta reserva?")) {
      return;
    }
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/ticket-reservations/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al cancelar la reserva");
      }
      await fetchReservations();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownloadPDF = async (reservationId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/ticket-reservations/${reservationId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al descargar el PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reserva-${reservationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateReservation = async (reservationId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/ticket-reservations/${reservationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            quantity: parseInt(newQuantity),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la reserva");
      }

      setEditingReservation(null);
      await fetchReservations();
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Reservas</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No tienes reservas activas</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((reservation) => (
              <div
                key={reservation.reservation_id}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {reservation.events.event_name}
                    </h2>
                    {editingReservation === reservation.reservation_id ? (
                      <div className="mt-2">
                        <input
                          type="number"
                          min="1"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(e.target.value)}
                          className="w-20 px-2 py-1 border rounded-lg mr-2"
                        />
                        <button
                          onClick={() =>
                            handleUpdateReservation(reservation.reservation_id)
                          }
                          className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition-colors mr-2"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingReservation(null)}
                          className="bg-gray-500 text-white px-4 py-1 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600 mt-1">
                          Cantidad de tickets: {reservation.quantity}
                        </p>
                        <p className="text-cyan-600 font-semibold mt-1">
                          Total: ${reservation.total_price}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Reservado el:{" "}
                          {new Date(reservation.reserved_at).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {editingReservation !== reservation.reservation_id && (
                      <button
                        onClick={() => {
                          setEditingReservation(reservation.reservation_id);
                          setNewQuantity(reservation.quantity);
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        Editar Cantidad
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleCancelReservation(reservation.reservation_id)
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(reservation.reservation_id)}
                      className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                      Descargar Comprobante
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReservations;

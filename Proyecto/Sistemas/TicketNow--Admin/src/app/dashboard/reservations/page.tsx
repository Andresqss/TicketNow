'use client';

import { useEffect, useState } from 'react';
import { getAllReservations } from '@/services/reservations/api';
import { Reservation } from '@/services/reservations/type';
import Link from 'next/link';
import Pagination from '@/components/utils/Pagination';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 5;

  const totalPages = Math.ceil(reservations.length / perPage);

  const paginatedReservations = reservations.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAllReservations();
        setReservations(data);
      } catch (error) {
        console.error('Error al obtener las reservaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Listado de Reservaciones</h2>
        <Link
          href="/dashboard/reservations/new"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          + Nueva Reservación
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-300">Cargando reservaciones...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-400">No se encontraron reservaciones.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-gray-800 text-white">
              <thead className="bg-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Usuario</th>
                  <th className="px-4 py-2 text-left">Evento</th>
                  <th className="px-4 py-2 text-left">Monto Total</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReservations.map((r) => (
                  <tr key={r.id} className="border-b border-gray-600 hover:bg-gray-700">
                    <td className="px-4 py-2">{r.user_id}</td>
                    <td className="px-4 py-2">{r.event_id}</td>
                    <td className="px-4 py-2">${Number(r.total_amount).toFixed(2)}</td>
                    <td className="px-4 py-2">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/dashboard/reservations/${r.id}`}
                        className="text-blue-400 hover:underline mr-3"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/dashboard/reservations/${r.id}/edit`}
                        className="text-yellow-400 hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { format, parseISO } from 'date-fns';

import {
  getPaymentLogs,
  deletePaymentLog,
} from '@/services/payments/api';
import { PaymentLog } from '@/services/payments/type';
import { getAllReservations } from '@/services/reservations/api';
import { Reservation } from '@/services/reservations/type';
import Pagination from '@/components/utils/Pagination';
import ErrorMessage from '@/components/utils/ErrorMessage';

export default function PaymentLogsPage() {
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PaymentLog | 'guest_name';
    direction: 'asc' | 'desc';
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 10;

  // Función de carga
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plogs, rsvs] = await Promise.all([
        getPaymentLogs(),
        getAllReservations(),
      ]);
      setPayments(plogs);
      setReservations(rsvs);
    } catch {
      setError('Error al cargar los registros de pago o reservaciones.');
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchData();
  }, []);

  // Eliminar
  const handleDelete = async (id: string) => {
    const res = await Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      theme: 'dark',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (res.isConfirmed) {
      try {
        await deletePaymentLog(id);
        setPayments((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
          theme: 'dark',
          icon: 'success',
          title: 'Eliminado',
          text: 'Registro de pago eliminado.',
        });
      } catch {
        Swal.fire({
          theme: 'dark',
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el registro.',
        });
      }
    }
  };

  // Ordenar columnas
  const handleSort = (key: keyof PaymentLog | 'guest_name') => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  // Mapea para mostrar guest_name
  const merged = payments.map((p) => ({
    ...p,
    guest_name:
      reservations.find(
        (r) => r.id.toString() === p.reservation_id.toString()
      )?.user_id ?? p.reservation_id,
  }));

  // Filtrado
  const filtered = merged.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.guest_name.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  });

  // Ordenación
  const sorted = sortConfig
    ? [...filtered].sort((a, b) => {
        const { key, direction } = sortConfig;
        const aV = a[key as keyof typeof a];
        const bV = b[key as keyof typeof b];

        if (typeof aV === 'string' && typeof bV === 'string') {
          // Detecta fechas ISO
          if (/\d{4}-\d{2}-\d{2}T/.test(aV)) {
            const at = new Date(aV).getTime();
            const bt = new Date(bV).getTime();
            return direction === 'asc' ? at - bt : bt - at;
          }
          return direction === 'asc'
            ? aV.localeCompare(bV)
            : bV.localeCompare(aV);
        }
        if (typeof aV === 'number' && typeof bV === 'number') {
          return direction === 'asc' ? aV - bV : bV - aV;
        }
        return 0;
      })
    : filtered;

  // Paginación
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  return (
    <div>
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-white">
          Registros de Pago
        </h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
            className="flex-1 max-w-xs px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none"
          />
          <button
            onClick={fetchData}
            className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
          >
            <ArrowPathIcon className="h-5 w-5 text-white" />
          </button>
          <Link
            href="/dashboard/payment/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo
          </Link>
        </div>
      </div>

      {/* Estado de carga / error */}
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <p className="text-gray-300">Cargando registros…</p>
      ) : sorted.length === 0 ? (
        <p className="text-gray-400">No hay registros de pago.</p>
      ) : (
        <>
          {/* Tabla */}
          <div className="overflow-auto rounded-lg shadow">
            <table className="min-w-full bg-gray-800 text-white">
              <thead className="bg-gray-700 text-sm uppercase">
                <tr>
                  {[
                    { key: 'guest_name', label: 'Reserva' },
                    { key: 'status', label: 'Estado' },
                    { key: 'amount', label: 'Monto' },
                    { key: 'registered_at', label: 'Registrado' },
                    { key: 'created_at', label: 'Actualizado' },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left cursor-pointer select-none"
                      onClick={() => handleSort(key as any)}
                    >
                      {label}{' '}
                      {sortConfig?.key === key && (
                        <span>
                          {sortConfig.direction === 'asc' ? '⬆️' : '⬇️'}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-600 hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{p.guest_name}</td>
                    <td className="px-4 py-2">{p.status}</td>
                    <td className="px-4 py-2">{p.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      {p.created_at
                        ? format(parseISO(p.created_at), 'dd/MM/yyyy HH:mm')
                        : ''}
                    </td>
                    <td className="px-4 py-2">
                      {p.updated_at
                        ? format(parseISO(p.updated_at), 'dd/MM/yyyy HH:mm')
                        : ''}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/dashboard/payment/edit?paymentLogId=${p.id}`}
                        className="text-blue-400 hover:underline mr-3"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
}

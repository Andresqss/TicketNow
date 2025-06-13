'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { format, parseISO } from 'date-fns';

import {
  getAllEvents,
  deleteEvent,
} from '@/services/events/api';                // :contentReference[oaicite:3]{index=3}
import {
  getAllEventTypes,
} from '@/services/event-types/api';             // :contentReference[oaicite:4]{index=4}

import { Event } from '@/services/events/type';
import { EventType } from '@/services/event-types/type';
import Pagination from '@/components/utils/Pagination';
import ErrorMessage from '@/components/utils/ErrorMessage';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [types, setTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Event | 'type_name';
    direction: 'asc'|'desc';
  }|null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 10;

  // Carga inicial
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [evs, tps] = await Promise.all([
        getAllEvents(),
        getAllEventTypes(),
      ]);
      setEvents(evs);
      setTypes(tps);
    } catch {
      setError('Error al cargar los eventos o tipos de evento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Eliminar
  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: '¿Eliminar evento?',
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
        await deleteEvent(id);
        setEvents((prev) => prev.filter((e) => e.event_id !== id));
        Swal.fire({
          theme: 'dark',
          icon: 'success',
          title: 'Eliminado',
          text: 'Evento eliminado.',
        });
      } catch {
        Swal.fire({
          theme: 'dark',
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el evento.',
        });
      }
    }
  };

  // Ordenar
  const handleSort = (key: keyof Event | 'type_name') => {
    setSortConfig((cur) => {
      if (cur?.key === key) {
        return { key, direction: cur.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Prepara datos para render
  const merged = events.map((e) => ({
    ...e,
    type_name: types.find((t) => t.event_type_id === e.event_type_id)
      ?.type_name ?? '—',
  }));

  const filtered = merged.filter((e) => {
    const term = search.toLowerCase();
    return (
      e.event_name.toLowerCase().includes(term) ||
      (e.description?.toLowerCase().includes(term)) ||
      e.type_name.toLowerCase().includes(term)
    );
  });

  const sorted = sortConfig
    ? [...filtered].sort((a, b) => {
        const { key, direction } = sortConfig;
        let aV = a[key as keyof typeof a];
        let bV = b[key as keyof typeof b];

        // strings
        if (typeof aV === 'string' && typeof bV === 'string') {
          return direction === 'asc'
            ? aV.localeCompare(bV)
            : bV.localeCompare(aV);
        }
        // dates
        if (key === 'start_datetime' || key === 'end_datetime' || key === 'created_at' || key === 'updated_at') {
          const at = new Date(aV as string).getTime();
          const bt = new Date(bV as string).getTime();
          return direction === 'asc' ? at - bt : bt - at;
        }
        // numbers / booleans
        return direction === 'asc'
          ? Number(aV) - Number(bV)
          : Number(bV) - Number(aV);
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  return (
    <div>
      {/* Controles superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-white">Eventos</h1>
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
            href="/dashboard/events/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo
          </Link>
        </div>
      </div>

      {/* Feedback */}
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <p className="text-gray-300">Cargando eventos…</p>
      ) : sorted.length === 0 ? (
        <p className="text-gray-400">No hay eventos.</p>
      ) : (
        <>
          {/* Tabla */}
          <div className="overflow-auto rounded-lg shadow">
            <table className="min-w-full bg-gray-800 text-white">
              <thead className="bg-gray-700 text-sm uppercase">
                <tr>
                  {[
                    { key: 'event_name', label: 'Nombre' },
                    { key: 'description', label: 'Descripción' },
                    { key: 'type_name', label: 'Tipo' },
                    { key: 'start_datetime', label: 'Inicio' },
                    { key: 'end_datetime', label: 'Fin' },
                    { key: 'capacity', label: 'Capacidad' },
                    { key: 'base_price', label: 'Precio' },
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
                {paginated.map((e) => (
                  <tr
                    key={e.event_id}
                    className="border-b border-gray-600 hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{e.event_name}</td>
                    <td className="px-4 py-2">{e.description}</td>
                    <td className="px-4 py-2">{e.type_name}</td>
                    <td className="px-4 py-2">
                      {format(parseISO(e.start_datetime), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-2">
                      {format(parseISO(e.end_datetime), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-2">{e.capacity}</td>
                    <td className="px-4 py-2">{e.base_price ?? '0.00'}</td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/dashboard/events/edit?eventId=${e.event_id}`}
                        className="text-blue-400 hover:underline mr-3"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(e.event_id)}
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
            onPageChange={(p) => setCurrentPage(p)}
          />
        </>
      )}
    </div>
  );
}

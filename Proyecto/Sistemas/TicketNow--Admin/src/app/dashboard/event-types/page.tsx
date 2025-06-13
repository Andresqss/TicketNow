'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { format, parseISO } from 'date-fns';
import {
  getAllEventTypes,
  deleteEventType,
} from '@/services/event-types/api';
import { EventType } from '@/services/event-types/type';
import Pagination from '@/components/utils/Pagination';
import ErrorMessage from '@/components/utils/ErrorMessage';

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof EventType;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 10;

  // 1) Función de carga
  const fetchEventTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEventTypes();
      setEventTypes(data);
    } catch {
      setError('Error al cargar los tipos de evento.');
    } finally {
      setLoading(false);
    }
  };

  // 2) Carga inicial
  useEffect(() => {
    fetchEventTypes();
  }, []);

  // 3) Borrar
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      theme: 'dark',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteEventType(id);
        setEventTypes((prev) =>
          prev.filter((et) => et.event_type_id !== id)
        );
        Swal.fire({
          theme: 'dark',
          icon: 'success',
          title: 'Eliminado',
          text: 'El tipo de evento ha sido eliminado.',
        });
      } catch {
        Swal.fire({
          theme: 'dark',
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el tipo de evento.',
        });
      }
    }
  };

  // 4) Ordenar columnas
  const handleSort = (key: keyof EventType) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  // 5) Filtrado y ordenación
  const filtered = eventTypes.filter((et) =>
    [et.type_name, et.description || '']
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const sorted = sortConfig
    ? [...filtered].sort((a, b) => {
        const { key, direction } = sortConfig;
        let aVal = a[key];
        let bVal = b[key];

        // cadenas
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        // booleanos
        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          return direction === 'asc'
            ? Number(aVal) - Number(bVal)
            : Number(bVal) - Number(aVal);
        }

        // fechas (ISO string)
        const aTime = new Date(aVal as any).getTime();
        const bTime = new Date(bVal as any).getTime();
        return direction === 'asc' ? aTime - bTime : bTime - aTime;
      })
    : filtered;

  // 6) Paginación
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  return (
    <div>
      {/* --- controles superiores --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-white">
          Tipos de Evento
        </h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
            className="flex-1 max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none"
          />

          {/* Refrescar */}
          <button
            onClick={fetchEventTypes}
            className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
          >
            <ArrowPathIcon className="h-5 w-5 text-white" />
          </button>

          {/* Nuevo */}
          <Link
            href="/dashboard/event-types/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo
          </Link>
        </div>
      </div>

      {/* --- estado de carga / error --- */}
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <p className="text-gray-300">Cargando tipos de evento...</p>
      ) : sorted.length === 0 ? (
        <p className="text-gray-400">No se encontraron tipos.</p>
      ) : (
        <>
          {/* --- tabla --- */}
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-gray-800 text-white">
              <thead className="bg-gray-700 text-sm uppercase">
                <tr>
                  {[
                    { key: 'type_name', label: 'Nombre' },
                    { key: 'description', label: 'Descripción' },
                    { key: 'created_at', label: 'Creación' },
                    { key: 'updated_at', label: 'Actualización' },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left cursor-pointer select-none"
                      onClick={() => handleSort(key as keyof EventType)}
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
                {paginated.map((et) => (
                  <tr
                    key={et.event_type_id}
                    className="border-b border-gray-600 hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{et.type_name}</td>
                    <td className="px-4 py-2">{et.description}</td>
                    <td className="px-4 py-2">
                      {et.created_at
                        ? format(parseISO(et.created_at), 'dd/MM/yyyy HH:mm:ss')
                        : ''}
                    </td>
                    <td className="px-4 py-2">
                      {et.updated_at
                        ? format(parseISO(et.updated_at), 'dd/MM/yyyy HH:mm:ss')
                        : ''}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/dashboard/event-types/edit?eventTypeId=${et.event_type_id}`}
                        className="text-blue-400 hover:underline mr-3"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(et.event_type_id)}
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

          {/* --- paginador --- */}
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

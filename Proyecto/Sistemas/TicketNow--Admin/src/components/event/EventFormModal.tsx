'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
} from '@/services/events/api';
import { getAllEventTypes } from '@/services/event-types/api';
import { Event, CreateEventPayload, UpdateEventPayload } from '@/services/events/type';

interface Props {
  id?: number;
}

export default function EventFormModal({ id }: Props) {
  const router = useRouter();
  const isEdit = typeof id !== 'undefined';

  useEffect(() => {
    const open = async () => {
      // 1) Carga inicial de tipos y, si edito, del evento
      let types = [];
      let initial: Partial<CreateEventPayload & UpdateEventPayload> = {
        event_name: '',
        description: '',
        short_description: '',
        event_type_id: undefined,
        start_datetime: '',
        end_datetime: '',
        capacity: 0,
        base_price: 0,
        is_active: true,
      };

      try {
        types = await getAllEventTypes();
      } catch {
        await Swal.fire({
          theme: 'dark',
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los tipos de evento.',
        });
        return router.back();
      }

      if (isEdit) {
        try {
          const ev: Event = await getEventById(id!);
          initial = {
            event_name: ev.event_name,
            description: ev.description || '',
            short_description: ev.short_description || '',
            event_type_id: ev.event_type_id!,
            // convierte a formato datetime-local: yyyy-MM-DDThh:mm
            start_datetime: ev.start_datetime
              ? new Date(ev.start_datetime).toISOString().slice(0, 16)
              : '',
            end_datetime: ev.end_datetime
              ? new Date(ev.end_datetime).toISOString().slice(0, 16)
              : '',
            capacity: ev.capacity,
            base_price: Number(ev.base_price ?? 0),
            is_active: ev.is_active ?? true,
          };
        } catch {
          await Swal.fire({
            theme: 'dark',
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el evento.',
          });
          return router.back();
        }
      }

      // 2) Modal SweetAlert2
      const result = await Swal.fire<Partial<CreateEventPayload & UpdateEventPayload>>({
        title: isEdit ? 'Editar Evento' : 'Nuevo Evento',
        width: 600,
        background: '#1f2937', // bg-gray-800
        color: '#fff',
        html: `
            <div class="grid grid-cols-2 gap-4 text-base">
            <!-- Nombre (full width) -->
            <div class="flex flex-col">
                <label for="swal-input-name" class="mb-1 text-gray-300 text-start">Nombre</label>
                <input
                id="swal-input-name"
                class="w-full max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
                placeholder="Nombre del evento"
                value="${initial.event_name || ''}"
                />
            </div>

            <!-- Tipo -->
            <div class="flex flex-col">
                <label for="swal-input-type" class="mb-1 text-gray-300 text-start">Tipo</label>
                <select
                id="swal-input-type"
                class="w-full max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
                >
                <option value="" disabled ${!initial.event_type_id ? 'selected' : ''}>
                    Selecciona tipo
                </option>
                ${types.map(t => `
                    <option value="${t.event_type_id}"
                    ${t.event_type_id === initial.event_type_id ? 'selected' : ''}>
                    ${t.type_name}
                    </option>
                `).join('')}
                </select>
            </div>

            <!-- Descripción (full width) -->
            <div class="flex flex-col">
                <label for="swal-input-desc" class="mb-1 text-gray-300 text-start">Descripción</label>
                <textarea
                id="swal-input-desc"
                class="w-full max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
                placeholder="Descripción completa"
                rows="2"
                >${initial.description || ''}</textarea>
            </div>

            <!-- Descripción corta (full width) -->
            <div class="flex flex-col">
                <label for="swal-input-short" class="mb-1 text-gray-300 text-start">Descripción corta</label>
                <textarea
                id="swal-input-short"
                class="w-full max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
                placeholder="Breve descripción"
                rows="1"
                >${initial.short_description || ''}</textarea>
            </div>

            

            <!-- Fecha y hora inicio -->
            <div class="flex flex-col">
                <label for="swal-input-start" class="mb-1 text-gray-300 text-start">Fecha y hora inicio</label>
                <input
                id="swal-input-start"
                type="datetime-local"
                class="bg-gray-700 text-white rounded-lg border border-gray-600 py-2 px-3"
                value="${initial.start_datetime || ''}"
                />
            </div>

            <!-- Fecha y hora fin -->
            <div class="flex flex-col">
                <label for="swal-input-end" class="mb-1 text-gray-300 text-start">Fecha y hora fin</label>
                <input
                id="swal-input-end"
                type="datetime-local"
                class="bg-gray-700 text-white rounded-lg border border-gray-600 py-2 px-3"
                value="${initial.end_datetime || ''}"
                />
            </div>

            <!-- Capacidad -->
            <div class="flex flex-col">
                <label for="swal-input-capacity" class="mb-1 text-gray-300 text-start">Capacidad</label>
                <input
                id="swal-input-capacity"
                type="number"
                class="w-full max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
                placeholder="0"
                value="${initial.capacity ?? 0}"
                />
            </div>

            <!-- Precio base -->
            <div class="flex flex-col">
                <label for="swal-input-price" class="mb-1 text-gray-300 text-start">Precio base</label>
                <input
                id="swal-input-price"
                type="number"
                step="0.01"
                class="w-full max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
                placeholder="0.00"
                value="${initial.base_price?.toFixed(2) ?? '0.00'}"
                />
            </div>

            </div>
        `,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Actualizar' : 'Crear',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'p-6 rounded-2xl',
            confirmButton: 'bg-green-600 hover:bg-green-700 text-base px-4 py-2',
            cancelButton: 'bg-gray-600 hover:bg-gray-700 text-base px-4 py-2 ml-2',
        },
        focusConfirm: false,
         preConfirm: () => {
          const event_name = (document.getElementById('swal-input-name') as HTMLInputElement)
            .value.trim();
          if (!event_name) {
            Swal.showValidationMessage('El nombre es obligatorio');
            return;
          }
          const description = (document.getElementById('swal-input-desc') as HTMLTextAreaElement)
            .value.trim();
          const short_description = (document.getElementById('swal-input-short') as HTMLTextAreaElement)
            .value.trim();
          const etid = (document.getElementById('swal-input-type') as HTMLSelectElement)
            .value;
          if (!etid) {
            Swal.showValidationMessage('Selecciona un tipo de evento');
            return;
          }
          const start = (document.getElementById('swal-input-start') as HTMLInputElement)
            .value;
          const end = (document.getElementById('swal-input-end') as HTMLInputElement)
            .value;
          const capacity = (document.getElementById('swal-input-capacity') as HTMLInputElement)
            .value;
          const price = (document.getElementById('swal-input-price') as HTMLInputElement)
            .value;

          return {
            event_name,
            description,
            short_description,
            event_type_id: Number(etid),
            start_datetime: start,
            end_datetime: end,
            capacity: Number(capacity),
            base_price: parseFloat(price),
          };
        },
      });
      // 3) Envío a la API
      if (result.isConfirmed && result.value) {
        try {
          if (isEdit) {
            await updateEvent({ event_id: id!, ...result.value } as UpdateEventPayload);
            await Swal.fire({
              theme: 'dark',
              icon: 'success',
              title: 'Actualizado',
              text: 'Evento actualizado.',
            });
          } else {
            await createEvent(result.value as CreateEventPayload);
            await Swal.fire({
              theme: 'dark',
              icon: 'success',
              title: 'Creado',
              text: 'Evento creado.',
            });
          }
          // Navega y refresca la tabla
          router.push('/dashboard/events');
          window.location.reload();
        } catch {
          await Swal.fire({
            theme: 'dark',
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al guardar.',
          });
        }
      } else {
        // canceló o hubo error de carga
        router.push('/dashboard/events');
      }
    };

    open();
  }, [id, isEdit, router]);

  return null;
}

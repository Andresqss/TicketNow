'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  CreateEventTypePayload,
  UpdateEventTypePayload,
  EventType,
} from '@/services/event-types/type';
import {
  createEventType,
  getEventTypeById,
  updateEventType,
} from '@/services/event-types/api';
import { getHmrRefreshHash } from 'next/dist/server/app-render/work-unit-async-storage.external';
import PageLoader from 'next/dist/client/page-loader';

interface Props {
  id?: number;
}

export default function EventTypeFormModal({ id }: Props) {
  const router = useRouter();
  const isEdit = typeof id !== 'undefined';

  useEffect(() => {
    const openModal = async () => {
      // 1) Carga datos si estamos editando
      let initial = { type_name: '', description: '' };
      if (isEdit) {
        try {
          const data: EventType = await getEventTypeById(id!);
          initial = {
            type_name: data.type_name,
            description: data.description || '',
          };
        } catch {
          await Swal.fire({
            theme: 'dark',
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el tipo de evento.',
          });
          return router.back();
        }
      }

      // 2) Abre el SweetAlert2 con inputs y tema oscuro
      const result = await Swal.fire<{
  type_name: string;
  description: string;
      }>({
        title: isEdit ? 'Editar Tipo de Evento' : 'Nuevo Tipo de Evento',
        width: 450,
        background: '#1f2937', // bg-gray-800
        color: '#fff',
        html: `
          <div class="flex flex-col items-center gap-4">
            <input
              id="swal-input1"
              class="w-full max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
              placeholder="Nombre"
              value="${initial.type_name}"
            />
            <textarea
              id="swal-input2"
              class="w-full max-w-xs px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
              placeholder="Descripción"
              rows="4"
            >${initial.description}</textarea>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Actualizar' : 'Crear',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'p-6 rounded-2xl',
          confirmButton: 'bg-green-600 hover:bg-green-700',
          cancelButton: 'bg-gray-600 hover:bg-gray-700 ml-2',
        },
        preConfirm: () => {
          const type_name = (
            document.getElementById('swal-input1') as HTMLInputElement
          ).value.trim();
          if (!type_name) {
            Swal.showValidationMessage('El nombre es requerido');
            return;
          }
          const description = (
            document.getElementById('swal-input2') as HTMLTextAreaElement
          ).value.trim();
          return { type_name, description };
        }
      });
      // 3) Si confirma, llama a la API
      if (result.isConfirmed && result.value) {
        try {
          if (isEdit) {
            const payload: UpdateEventTypePayload = {
              event_type_id: id!,
              ...result.value,
            };
            await updateEventType(payload);
            await Swal.fire({
              theme: 'dark',
              icon: 'success',
              title: 'Actualizado',
              text: 'Tipo de evento actualizado.',
            });
          } else {
            await createEventType(result.value as CreateEventTypePayload);
            await Swal.fire({
              theme: 'dark',
              icon: 'success',
              title: 'Creado',
              text: 'Nuevo tipo de evento creado.',
            });
          }
          router.push('/dashboard/event-types');
          window.location.reload();
        } catch {
          await Swal.fire({
            theme: 'dark',
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar.',
          });
        }
      } else {
        // Si cancela, volvemos atrás
        router.push("/dashboard/event-types");
      }
    };

    openModal();
  }, [id, isEdit, router]);

  // No renderizamos nada en la página, todo es el modal
  return null;
}

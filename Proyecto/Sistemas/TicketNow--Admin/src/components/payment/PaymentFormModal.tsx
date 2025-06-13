
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  getPaymentLogById,
  createPaymentLog,
  updatePaymentLog,
} from '@/services/payments/api';
import { getAllReservations } from '@/services/reservations/api';
import { PaymentLog } from '@/services/payments/type';
import { Reservation } from '@/services/reservations/type';

interface Props {
  id?: number;
}

export default function PaymentFormModal({ id }: Props) {
  const router = useRouter();
  const isEdit = typeof id !== 'undefined';

  useEffect(() => {
    const openModal = async () => {
      // 1) Cargar reservaciones y datos iniciales
      let reservations: Reservation[] = [];
      let initial: Partial<PaymentLog> = {
        reservation_id: '',
        status: undefined,
        amount: 0,
      };

      try {
        reservations = await getAllReservations();
      } catch {
        await Swal.fire({
          theme: 'dark',
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las reservaciones.',
        });
        return router.back();
      }

      if (isEdit) {
        try {
          const pl = await getPaymentLogById(id.toString());
          initial = {
            reservation_id: pl.reservation_id.toString(),
            status: pl.status,
            amount: Number(pl.amount),
          };
        } catch {
          await Swal.fire({
            theme: 'dark',
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el registro.',
          });
          return router.back();
        }
      }

      // 2) Mostrar SweetAlert2 en dos columnas
      const result = await Swal.fire<Partial<PaymentLog>>({
        title: isEdit ? 'Editar Registro de Pago' : 'Nuevo Registro de Pago',
        width: 600,
        background: '#1f2937',
        color: '#fff',
        html: `
          <div class="grid text-start gap-4">
            <div class="flex flex-col">
              <label for="swal-input-reservation" class="mb-1 text-gray-300">Reserva</label>
              <select id="swal-input-reservation"
                class="w-full max-w-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600">
                <option value="" disabled ${!initial.reservation_id ? 'selected' : ''}>
                  Selecciona reserva
                </option>
                ${reservations
                  .map(r => `
                    <option value="${r.id}"
                      ${r.id.toString() === initial.reservation_id ? 'selected' : ''}>
                      ${r.guest_email} (${r.user_id})
                    </option>`)
                  .join('')}
              </select>
            </div>

            <!-- Estado -->
            <div class="flex flex-col">
              <label for="swal-input-status" class="mb-1 text-gray-300">Estado</label>
              <select id="swal-input-status"
                class="w-full max-w-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600">
                <option value="" disabled ${!initial.status ? 'selected' : ''}>
                  Selecciona estado
                </option>
                ${['pending','approved','failed','refunded']
                  .map(s => `
                    <option value="${s}"
                      ${s === initial.status ? 'selected' : ''}>
                      ${s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>`)
                  .join('')}
              </select>
            </div>

            <!-- Monto -->
            <div class="flex flex-col">
              <label for="swal-input-amount" class="mb-1 text-gray-300">Monto</label>
              <input id="swal-input-amount" type="number" step="0.01"
                class="w-full max-w-lg px-3 py-2 bg-gray-700 text-white placeholder-gray-400 text-sm rounded-lg border border-gray-600"
                placeholder="0.00"
                value="${initial.amount?.toFixed(2) ?? '0.00'}"/>
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
          const reservation_id = (
            document.getElementById('swal-input-reservation') as HTMLSelectElement
          ).value;
          if (!reservation_id) {
            Swal.showValidationMessage('Selecciona una reserva');
            return;
          }
          const status = (
            document.getElementById('swal-input-status') as HTMLSelectElement
          ).value;
          if (!status) {
            Swal.showValidationMessage('Selecciona un estado');
            return;
          }
          const amount = (
            document.getElementById('swal-input-amount') as HTMLInputElement
          ).value;
          if (!amount || parseFloat(amount) <= 0) {
            Swal.showValidationMessage('Ingresa un monto válido');
            return;
          }
          return {
            reservation_id,
            status,
            amount: parseFloat(amount),
            
          };
        },
      });

      // 3) Enviar a la API y refrescar
      if (result.isConfirmed && result.value) {
        try {
          if (isEdit) {
            await updatePaymentLog(id!.toString(), result.value);
            await Swal.fire({
              theme: 'dark',
              icon: 'success',
              title: 'Actualizado',
              text: 'Registro actualizado.',
            });
          } else {
            await createPaymentLog(result.value as any);
            await Swal.fire({
              theme: 'dark',
              icon: 'success',
              title: 'Creado',
              text: 'Registro creado.',
            });
          }
          router.push('/dashboard/payment');
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
        router.push('/dashboard/payment');
      }
    };

    openModal();
  }, [id, isEdit, router]);

  return null;
}

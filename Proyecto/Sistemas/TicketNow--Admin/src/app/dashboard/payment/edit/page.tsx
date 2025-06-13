'use client';

import { useSearchParams } from 'next/navigation';
import PaymentFormModal from '@/components/payment/PaymentFormModal';

export default function EditPaymentPage() {
  const params = useSearchParams();
  const idParam = params.get('paymentLogId');
  const paymentLogId = idParam ? Number(idParam) : undefined;

  return <PaymentFormModal id={paymentLogId} />;
}
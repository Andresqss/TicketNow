'use client';

import { useSearchParams } from 'next/navigation';
import EventFormModal from '@/components/event/EventFormModal';

export default function EditEventPage() {
  const params = useSearchParams();
  const idParam = params.get('eventId');
  const eventId = idParam ? Number(idParam) : undefined;

  return <EventFormModal id={eventId} />;
}
// src/app/dashboard/event-types/edit.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import EventTypeForm from '@/components/event-type/EventTypeForm';

export default function EditEventTypePage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('eventTypeId');
  const eventTypeId = idParam ? Number(idParam) : undefined;

  return <EventTypeForm id={eventTypeId} />;
}

import { AppShell } from '@/shared/ui/AppShell';
import { EventsPage } from '../../domains/events/EventsPage';

export default function Page() {
  return (
    <AppShell>
      <EventsPage />
    </AppShell>
  );
}

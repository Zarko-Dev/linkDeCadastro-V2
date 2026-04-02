import { AppShell } from '@/shared/ui/AppShell';
import { EventsAdminPage } from '../../../domains/admin/EventsAdminPage';

export default function Page() {
  return (
    <AppShell>
      <EventsAdminPage />
    </AppShell>
  );
}

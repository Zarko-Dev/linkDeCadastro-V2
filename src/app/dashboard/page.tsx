import { AppShell } from '@/shared/ui/AppShell';
import { DashboardPage } from '../../domains/dashboard/DashboardPage';

export default function Page() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}

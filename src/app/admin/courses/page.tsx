import { AppShell } from '@/shared/ui/AppShell';
import { CoursesAdminPage } from '../../../domains/admin/CoursesAdminPage';

export default function Page() {
  return (
    <AppShell>
      <CoursesAdminPage />
    </AppShell>
  );
}

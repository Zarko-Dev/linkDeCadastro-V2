import { AppShell } from '@/shared/ui/AppShell';
import { CoursesPage } from '../../domains/courses/CoursesPage';

export default function Page() {
  return (
    <AppShell>
      <CoursesPage />
    </AppShell>
  );
}

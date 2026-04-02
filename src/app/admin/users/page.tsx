import { AppShell } from '@/shared/ui/AppShell';
import { UsersPage } from '../../../domains/users/UsersPage';

export default function Page() {
  return (
    <AppShell>
      <UsersPage />
    </AppShell>
  );
}

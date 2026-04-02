import { AppShell } from '@/shared/ui/AppShell';
import { LoginPage } from '../../domains/auth/LoginPage';

export default function Page() {
  return (
    <AppShell>
      <LoginPage />
    </AppShell>
  );
}

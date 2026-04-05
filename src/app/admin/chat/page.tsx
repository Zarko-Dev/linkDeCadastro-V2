import { AppShell } from '@/shared/ui/AppShell';
import { ChatInboxPage } from '@/domains/chat/ChatInboxPage';

export default function Page() {
  return (
    <AppShell>
      <ChatInboxPage />
    </AppShell>
  );
}

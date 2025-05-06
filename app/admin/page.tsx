// app/admin/page.tsx
'use client';

import Admin from './components/Admin';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const handleSelectUser = (userId: string | null) => {
    if (userId === 'new') {
      router.push('/onboarding');
    } else if (userId) {
      router.push('/');
    }
  };

  // Remove the redundant wrapper div
  return <Admin onSelectUser={handleSelectUser} />;
}
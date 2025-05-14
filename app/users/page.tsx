// app/users/page.tsx
'use client';

import Users from './components/Users';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();

  const handleSelectUser = (userId: string | null) => {
    if (userId === 'new') {
      router.push('/onboarding');
    } else if (userId) {
      router.push('/');
    }
  };

  // Remove the redundant wrapper div
  return <Users onSelectUser={handleSelectUser} />;
}

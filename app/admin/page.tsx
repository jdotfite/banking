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

  return (
    <div className="min-h-screen bg-gray-900">
      <Admin onSelectUser={handleSelectUser} />
    </div>
  );
}

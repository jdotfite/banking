'use client';

import React from 'react';
import More from '@/components/screens/More';
import BottomNav from '@/components/ui/navigation/BottomNav';
import { NavItemType } from '@/lib/types';

const navItems: NavItemType[] = [
  { name: 'Home', icon: 'home', href: '/' },
  { name: 'Insights', icon: 'insights', href: '/insights' },
  { name: 'Add', icon: 'add', href: '/new' },
  { name: 'Wallet', icon: 'wallet', href: '/wallet' },
  { name: 'More', icon: 'more', href: '/more' },
];

export default function MorePage() {
  return (
    <main className="relative min-h-screen">
      <More />
      <BottomNav />
    </main>
  );
}


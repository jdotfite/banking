import { ReactNode } from 'react';

export type AuthViewType = 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter' | 'faq';

export interface ViewProps {
  setView: (view: AuthViewType) => void;
}

export interface AuthHeaderProps {
  currentView: AuthViewType;
  onBack: () => void;
  title?: string;
}

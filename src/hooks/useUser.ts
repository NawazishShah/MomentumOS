'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthProvider';

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
}

export default useUser;

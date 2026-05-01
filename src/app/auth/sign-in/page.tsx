import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <AuthCard
      title="⚡ Life OS"
      subtitle="Your personal operating system"
    >
      <SignInForm />
    </AuthCard>
  );
}

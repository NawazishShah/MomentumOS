import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthCard
      title="⚡ Life OS"
      subtitle="Your personal operating system"
    >
      <SignUpForm />
    </AuthCard>
  );
}

import { AuthLayout } from '@/components/_layouts/auth-layout';
import { SignupForm } from './_components/signup-form';

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}

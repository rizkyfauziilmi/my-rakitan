'use client';

import { Eye, EyeOff, PcCase } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const signUpSchema = z
  .object({
    email: z.email('Email tidak valid'),
    username: z
      .string('Username diperlukan')
      .min(3, 'Username minimal 3 karakter')
      .max(20, 'Username maksimal 20 karakter'),
    password: z.string('Password diperlukan').min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string('Konfirmasi password diperlukan'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak sesuai',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const signInSocial = async (provider: 'google') => {
    await authClient.signIn.social({
      provider,
    });
  };

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(dataForm: SignupFormValues) {
    const { email, username, password } = dataForm;

    await authClient.signUp.email(
      {
        email,
        password,
        name: username,
      },
      {
        onSuccess: () => {
          toast.success('Akun berhasil dibuat! Silakan periksa email Anda untuk verifikasi.');
          router.push('/login');
        },
        onError: (ctx) => {
          toast.error(`Gagal membuat akun!`, {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <div className={cn('bg-card flex max-w-lg flex-col gap-6 p-8', className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <PcCase className="size-6" />
              </div>
              <span className="sr-only">MyRakitan.id</span>
            </a>
            <h1 className="text-xl font-bold">Selamat datang di MyRakitan.id</h1>
            <FieldDescription>
              Sudah punya akun? <a href="/login">Masuk</a>
            </FieldDescription>
          </div>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email-signup">Email</FieldLabel>
                <Input
                  {...field}
                  id="email-signup"
                  aria-invalid={fieldState.invalid}
                  placeholder="m@example.com"
                  type="email"
                  required
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username-signup">Nama Pengguna</FieldLabel>
                <Input
                  {...field}
                  id="username-signup"
                  aria-invalid={fieldState.invalid}
                  placeholder="username123"
                  type="text"
                  required
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password-signup">Kata Sandi</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="password-signup"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    type={showPassword ? 'text' : 'password'}
                    required
                  />
                  <Button
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirm-password-signup">Konfirmasi Kata Sandi</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="confirm-password-signup"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                  />
                  <Button
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner />}
              {isLoading ? 'Membuat Akun...' : 'Buat Akun'}
            </Button>
          </Field>
          <FieldSeparator>Atau</FieldSeparator>
          <Field>
            <Button variant="outline" type="button" onClick={() => signInSocial('google')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Masuk dengan Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Dengan mendaftar, Anda menyetujui <a href="#">Syarat Layanan</a> dan{' '}
        <a href="#">Kebijakan Privasi</a>.
      </FieldDescription>
    </div>
  );
}

"use client";

import { Eye, EyeOff, GalleryVerticalEnd, PcCase } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import z from "zod";

const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string("Password diperlukan"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const signInSocial = async (provider: "google") => {
    await authClient.signIn.social({
      provider,
    });
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(dataForm: LoginFormValues) {
    await authClient.signIn.email(
      {
        email: dataForm.email,
        password: dataForm.password,
        callbackURL: "/",
      },
      {
        onError: (ctx) => {
          toast.error("Gagal masuk!", {
            description: ctx.error.message,
          });
        },
        onSuccess: (ctx) => {
          toast.success(`Selamat datang, ${ctx.data.user.name}!`);
          router.push("/");
        },
      }
    );
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <div
      className={cn("bg-card max-w-lg p-8 flex flex-col gap-6", className)}
      {...props}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <PcCase className="size-6" />
              </div>
              <span className="sr-only">MyRakitan.id</span>
            </a>
            <h1 className="text-xl font-bold">
              Selamat datang di MyRakitan.id
            </h1>
            <FieldDescription>
              Belum punya akun? <a href="/signup">Daftar</a>
            </FieldDescription>
          </div>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email-login">Email</FieldLabel>
                <Input
                  {...field}
                  id="email-login"
                  aria-invalid={fieldState.invalid}
                  placeholder="m@example.com"
                  type="email"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password-login">Kata Sandi</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="password-login"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner />}
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </Field>
          <FieldSeparator>Atau</FieldSeparator>
          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={() => signInSocial("google")}
            >
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
        Dengan masuk, Anda menyetujui <br />
        <a href="#">Syarat Layanan</a> dan <a href="#">Kebijakan Privasi</a>{" "}
        kami.
      </FieldDescription>
    </div>
  );
}

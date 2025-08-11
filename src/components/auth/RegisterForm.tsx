import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthFormSkeleton } from "./AuthFormSkeleton";
import { Link } from "@/components/ui/link";

const registerSchema = z
  .object({
    email: z.string().email("Nieprawidłowy format adresu e-mail"),
    password: z
      .string()
      .min(6, "Hasło musi mieć minimum 6 znaków")
      .regex(
        /(?=.*\d)(?=.*[!@#$%^&*])/,
        "Hasło musi zawierać minimum 1 cyfrę i 1 znak specjalny",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Implementation will be added later
    console.log(data);
  };

  return (
    <AuthFormSkeleton title="Rejestracja">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="E-mail"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Hasło"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Potwierdź hasło"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="text-center">
          <Link href="/login" className="text-sm text-muted-foreground">
            Masz już konto? Zaloguj się
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Rejestracja..." : "Zarejestruj się"}
        </Button>
      </form>
    </AuthFormSkeleton>
  );
}

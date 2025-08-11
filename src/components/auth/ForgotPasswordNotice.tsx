import { AuthFormSkeleton } from "./AuthFormSkeleton";
import { Link } from "../ui/link";

export function ForgotPasswordNotice() {
  return (
    <AuthFormSkeleton title="Odzyskiwanie hasła">
      <div className="space-y-6 text-center">
        <p className="text-muted-foreground">
          Aby zresetować hasło, skontaktuj się z administratracja.
        </p>

        <Link href="/login" className="text-sm text-muted-foreground">
          Powrót do logowania
        </Link>
      </div>
    </AuthFormSkeleton>
  );
}

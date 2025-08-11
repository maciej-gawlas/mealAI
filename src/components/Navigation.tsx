import { Button } from "./ui/button";
import { toast } from "sonner";

export function Navigation() {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas wylogowywania");
      }

      toast.success("Wylogowano pomyślnie!");
      window.location.href = "/login";
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <nav className="w-full p-4 flex justify-end">
      <Button variant="ghost" onClick={handleLogout} className="cursor-pointer">
        Wyloguj się
      </Button>
    </nav>
  );
}

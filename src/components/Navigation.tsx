import { Button } from "./ui/button";
import { Link } from "./ui/link";
import { toast } from "sonner";
import { Settings, LogOut, BookOpen } from "lucide-react";

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
    <nav className="w-full p-4 flex items-center">
      <div className="flex-1">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-xl font-bold no-underline hover:opacity-80"
        >
          <BookOpen size={24} />
          HealthyMeal
        </Link>
      </div>
      <div className="flex gap-2">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 text-base no-underline py-2 px-4 hover:bg-gray-100 rounded-md"
        >
          <Settings size={18} />
          Ustawienia
        </Link>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="cursor-pointer inline-flex items-center gap-1"
        >
          <LogOut size={18} />
          Wyloguj się
        </Button>
      </div>
    </nav>
  );
}

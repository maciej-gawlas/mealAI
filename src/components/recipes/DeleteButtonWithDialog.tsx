import { useState } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface DeleteButtonWithDialogProps {
  recipeId: string;
  onSuccess: () => void;
  isDeleting: boolean;
  setIsDeleting: (value: boolean) => void;
}

export function DeleteButtonWithDialog({
  recipeId,
  onSuccess,
  isDeleting,
  setIsDeleting,
}: DeleteButtonWithDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Unauthorized - Please log in again");
      }

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized - Please log in again");
        }
        throw new Error("Failed to delete recipe");
      }

      setIsOpen(false);
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        if (error.message.includes("Unauthorized")) {
          // Redirect to login page after a short delay
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        }
      } else {
        toast.error("Failed to delete recipe");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Usuń przepis</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz usunąć?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej operacji nie można cofnąć. Przepis zostanie trwale usunięty.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Usuwanie..." : "Usuń"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteButtonWithDialog;

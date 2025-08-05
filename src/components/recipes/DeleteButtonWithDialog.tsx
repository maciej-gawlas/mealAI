import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import React from "react";

interface Props {
  recipeId: string;
  recipeName: string;
}

const DeleteButtonWithDialog: React.FC<Props> = ({ recipeId, recipeName }) => (
  <DeleteConfirmationDialog
    recipeId={recipeId}
    recipeName={recipeName}
    trigger={
      <Button size="icon" variant="destructive">
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Usuń przepis</span>
      </Button>
    }
  />
);

export default DeleteButtonWithDialog;

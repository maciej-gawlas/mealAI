import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { CreateRecipeCommand, ManualRecipeFormViewModel } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PreferenceCheckboxGroup } from "./PreferenceCheckboxGroup";

const recipeFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  ingredients: z.string().min(10, "Ingredients must be at least 10 characters"),
  instructions: z
    .string()
    .min(10, "Instructions must be at least 10 characters"),
  preference_ids: z.array(z.string()),
});

interface ManualRecipeFormProps {
  initialData?: Partial<ManualRecipeFormViewModel>;
}

export default function ManualRecipeForm({
  initialData,
}: ManualRecipeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof recipeFormSchema>>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      ingredients: initialData?.ingredients ?? "",
      instructions: initialData?.instructions ?? "",
      preference_ids: initialData?.preference_ids ?? [],
    },
  });

  const handleSubmit = async (data: z.infer<typeof recipeFormSchema>) => {
    startTransition(async () => {
      try {
        const recipeData: CreateRecipeCommand = {
          name: data.name,
          ingredients: data.ingredients,
          instructions: data.instructions,
          preference_ids: data.preference_ids,
          is_ai_generated: initialData ? true : false,
        };

        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipeData),
        });

        if (!response.ok) {
          throw new Error("Failed to create recipe");
        }

        toast.success("Recipe created successfully!");
        setTimeout(() => {
          window.location.href = "/recipes";
        }, 1000);
      } catch (error) {
        toast.error("Failed to create recipe. Please try again.");
        console.error("Failed to create recipe:", error);
      }
    });
  };

  return (
    <Card>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nazwa przepisu
            </label>
            <input
              id="name"
              {...form.register("name")}
              className="w-full rounded-md border border-input px-3 py-2"
              placeholder="Wpisz nazwę przepisu"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="ingredients" className="text-sm font-medium">
              Składniki
            </label>
            <textarea
              id="ingredients"
              {...form.register("ingredients")}
              className="w-full rounded-md border border-input px-3 py-2 min-h-[100px]"
              placeholder="Wpisz składniki"
            />
            {form.formState.errors.ingredients && (
              <p className="text-sm text-destructive">
                {form.formState.errors.ingredients.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="instructions" className="text-sm font-medium">
              Instrukcje
            </label>
            <textarea
              id="instructions"
              {...form.register("instructions")}
              className="w-full rounded-md border border-input px-3 py-2 min-h-[150px]"
              placeholder="Wpisz instrukcje przygotowania"
            />
            {form.formState.errors.instructions && (
              <p className="text-sm text-destructive">
                {form.formState.errors.instructions.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="preference-checkbox-group"
              className="text-sm font-medium"
            >
              Preferencje dietetyczne
            </label>
            <PreferenceCheckboxGroup
              id="preference-checkbox-group"
              value={form.watch("preference_ids")}
              onChange={(value) => form.setValue("preference_ids", value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="hover:bg-primary/90 hover:text-white transition duration-150 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isPending ? (
                <>
                  <Spinner size="sm" className="border-current" />
                  <span>Zapisywanie...</span>
                </>
              ) : (
                "Zapisz przepis"
              )}
            </span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

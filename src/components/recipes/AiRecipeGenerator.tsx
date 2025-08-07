import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { PreferenceCheckboxGroup } from "./PreferenceCheckboxGroup";
import type { AIRecipeDTO, GenerateRecipeCommand } from "@/types";
import { useState } from "react";

const generatorFormSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
  preferences: z.array(z.string()),
});

interface AiRecipeGeneratorProps {
  onRecipeGenerated: (recipe: AIRecipeDTO, preferences: string[]) => void;
}

export default function AiRecipeGenerator({
  onRecipeGenerated,
}: AiRecipeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<z.infer<typeof generatorFormSchema>>({
    resolver: zodResolver(generatorFormSchema),
    defaultValues: {
      description: "",
      preferences: [],
    },
  });

  const handleSubmit = async (data: z.infer<typeof generatorFormSchema>) => {
    setIsGenerating(true);
    try {
      const generateData: GenerateRecipeCommand = {
        description: data.description,
        preferences: data.preferences,
      };

      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generateData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const result = await response.json();
      onRecipeGenerated(result.recipe, data.preferences);
      toast.success("Recipe generated successfully!");
    } catch (error) {
      toast.error("Failed to generate recipe. Please try again.");
      console.error("Failed to generate recipe:", error);
    }
    setIsGenerating(false);
  };

  return (
    <Card>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Opis przepisu
            </label>
            <textarea
              id="description"
              {...form.register("description")}
              className="w-full rounded-md border border-input px-3 py-2 min-h-[100px]"
              placeholder="Opisz przepis, który chcesz wygenerować..."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Preferencje dietetyczne
            </label>
            <PreferenceCheckboxGroup
              value={form.watch("preferences")}
              onChange={(value) => form.setValue("preferences", value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={!form.formState.isValid || isGenerating}
            className="hover:bg-primary/90 hover:text-white transition duration-150 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isGenerating ? (
                <>
                  <Spinner size="sm" className="border-current" />
                  <span>Generowanie...</span>
                </>
              ) : (
                "Wygeneruj przepis"
              )}
            </span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PreferenceCheckboxGroup } from "@/components/recipes/PreferenceCheckboxGroup";

// Schema for the form data
const preferencesSchema = z.object({
  preferences: z
    .array(z.string().uuid())
    .min(1, "Wybierz co najmniej jedną preferencję"),
});

type PreferenceFormData = z.infer<typeof preferencesSchema>;

export function UserPreferencesForm() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<PreferenceFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferences: [],
    },
  });

  const selectedPreferences = watch("preferences");

  // Fetch user's current preferences
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await fetch("/api/users/me/preferences");
        if (!response.ok) {
          if (response.status !== 401) {
            throw new Error("Nie udało się pobrać twoich preferencji");
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        const preferenceIds = data.data.map(
          (pref: { preference_id: string }) => pref.preference_id,
        );
        setValue("preferences", preferenceIds);
      } catch (_) {
        toast.error("Nie udało się pobrać twoich preferencji");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPreferences();
  }, [setValue]);

  const onSubmit = async (data: PreferenceFormData) => {
    try {
      const response = await fetch("/api/users/me/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaktualizować preferencji");
      }

      toast.success("Preferencje zaktualizowane pomyślnie!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Twoje preferencje żywieniowe</CardTitle>
        <CardDescription>
          Wybierz swoje preferencje żywieniowe, które zostaną uwzględnione przy
          generowaniu przepisów.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm font-medium mb-2">
              Preferencje dietetyczne
            </div>
            <PreferenceCheckboxGroup
              value={selectedPreferences}
              onChange={(value) => setValue("preferences", value)}
            />
            {errors.preferences && (
              <p className="text-sm text-destructive">
                {errors.preferences.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 mt-5">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz preferencje"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

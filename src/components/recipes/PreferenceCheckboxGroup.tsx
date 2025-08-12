import { useState, useEffect } from "react";
import type { PreferenceDTO } from "@/types";

interface PreferenceCheckboxGroupProps {
  value: string[];
  onChange: (selectedIds: string[]) => void;
}

export function PreferenceCheckboxGroup({
  value,
  onChange,
}: PreferenceCheckboxGroupProps) {
  const [preferences, setPreferences] = useState<PreferenceDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/preferences");
        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }
        const data = await response.json();
        setPreferences(data.data);
      } catch (_err) {
        setError("Unable to load preferences. Please try again later.");
      }
    };

    fetchPreferences();
  }, []);

  if (error) {
    return <div className="text-destructive text-sm">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {preferences.map((preference) => (
        <div key={preference.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={preference.id}
            checked={value.includes(preference.id)}
            onChange={(e) => {
              const isChecked = e.target.checked;
              const newValue = isChecked
                ? [...value, preference.id]
                : value.filter((id) => id !== preference.id);
              onChange(newValue);
            }}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor={preference.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {preference.name}
          </label>
        </div>
      ))}
    </div>
  );
}

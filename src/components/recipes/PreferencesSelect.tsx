"use client";

import * as React from "react";
import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PreferencesSelectProps {
  value: string;
  onChange: (value: string) => void;
}

interface Preference {
  id: string;
  name: string;
}

export function PreferencesSelect({ value, onChange }: PreferencesSelectProps) {
  const id = useId();
  const [preferences, setPreferences] = React.useState<Preference[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/preferences");
        if (!response.ok) throw new Error("Failed to fetch preferences");
        const data = await response.json();
        // Upewniamy się, że data.data jest tablicą, jeśli nie - używamy pustej tablicy
        setPreferences(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleChange = React.useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[180px]" id={id}>
        <SelectValue placeholder={isLoading ? "Loading..." : "Wszystkie"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Wszystkie</SelectItem>
        {preferences.map((pref) => (
          <SelectItem key={pref.id} value={pref.id}>
            {pref.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

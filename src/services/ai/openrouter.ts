import type { AIRecipeDTO } from "../../types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenerateRecipeInput } from "../../schemas/generateRecipe";
import OpenAI from "openai";
import { z } from "zod";

// Schema do walidacji odpowiedzi z OpenRouter
const recipeResponseSchema = z.object({
  name: z.string(),
  ingredients: z.union([z.string(), z.array(z.string())]),
  instructions: z.union([z.string(), z.array(z.string())]),
});

const baseURL = "https://openrouter.ai/api/v1";

// Inicjalizacja klienta OpenAI z konfiguracją dla OpenRouter
const client = new OpenAI({
  baseURL,
  apiKey: import.meta.env.OPENROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "https://mealai.example.com",
    "X-Title": "MealAI Recipe Generator",
  },
});

// Funkcja budująca prompt na podstawie preferencji użytkownika
const buildPrompt = (input: GenerateRecipeInput): string => {
  const { preferences, description } = input;

  return `Generate a recipe that matches the following description: ${description}
      Please consider these dietary preferences and restrictions: ${JSON.stringify(preferences)}

      Format the response as a JSON object with the following fields:
      {
        "name": "Recipe name",
        "ingredients": "Ingredients list (one per line)",
        "instructions": "Step by step instructions"
      }`;
};

export async function generateRecipeWithAI(
  input: GenerateRecipeInput,
): Promise<AIRecipeDTO> {
  try {
    // Wysłanie zapytania do API
    const response = await client.chat.completions.create({
      model: "openai/gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef specialized in creating recipes that match specific dietary requirements.",
        },
        {
          role: "user",
          content: buildPrompt(input),
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Pobranie wygenerowanej odpowiedzi
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parsowanie JSON z odpowiedzi
    const jsonResponse = JSON.parse(content);

    // Walidacja odpowiedzi przez schemat Zod
    const validatedResponse = recipeResponseSchema.parse(jsonResponse);

    // Convert arrays to strings with line breaks if needed
    const formattedResponse = {
      ...validatedResponse,
      ingredients: Array.isArray(validatedResponse.ingredients)
        ? validatedResponse.ingredients.join("\n")
        : validatedResponse.ingredients,
      instructions: Array.isArray(validatedResponse.instructions)
        ? validatedResponse.instructions.join("\n")
        : validatedResponse.instructions,
    };

    return formattedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid AI response format: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON in AI response");
    }
    throw error;
  }
}

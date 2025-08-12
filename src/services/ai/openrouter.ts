import type { AIRecipeDTO } from "../../types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenerateRecipeInput } from "../../schemas/generateRecipe";
import { z } from "zod";

// Types
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ModelParams {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    schema: {
      type: "object";
      required?: string[];
      properties: Record<string, { type: string }>;
    };
  };
}

interface OpenRouterConfig {
  apiKey: string;
  endpoint?: string;
  modelName: string;
  systemMessage?: ChatMessage;
  defaultParams?: ModelParams;
  responseFormat?: ResponseFormat;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  response_format?: ResponseFormat;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface RawApiResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Error classes
class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class ResponseFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResponseFormatError";
  }
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

class OpenRouterService<T> {
  private readonly apiKey: string;
  private readonly endpoint: string;
  private readonly modelName: string;
  public readonly params: ModelParams;
  public readonly systemMessage: ChatMessage;
  public readonly responseFormat?: ResponseFormat;

  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey;
    this.endpoint =
      config.endpoint || "https://openrouter.ai/api/v1/chat/completions";
    this.modelName = config.modelName;
    this.params = config.defaultParams || {
      temperature: 0.7,
      max_tokens: 800,
      top_p: 1.0,
    };
    this.systemMessage = config.systemMessage || {
      role: "system",
      content: "You are a helpful assistant.",
    };
    this.responseFormat = config.responseFormat;
  }

  private _buildPayload(userMessage: string): ChatCompletionRequest {
    return {
      model: this.modelName,
      messages: [this.systemMessage, { role: "user", content: userMessage }],
      response_format: this.responseFormat,
      ...this.params,
    };
  }

  private async _callApi(
    payload: ChatCompletionRequest,
  ): Promise<RawApiResponse> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": `${import.meta.env.PUBLIC_APP_URL}`,
          "X-Title": "10Dev MealAI",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new NetworkError(
          `Expected JSON response but got ${contentType}. Response: ${text.substring(0, 100)}...`,
        );
      }

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          throw new AuthenticationError(
            `Invalid API key: ${errorData.error?.message || "No error message provided"}`,
          );
        }
        if (response.status === 504) {
          throw new TimeoutError("Request timed out");
        }
        throw new NetworkError(
          `API request failed (${response.status}): ${
            errorData.error?.message || response.statusText
          }`,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new NetworkError("Network request failed: " + String(error));
    }
  }

  private _validateSchema(raw: RawApiResponse): T {
    if (!raw.choices?.[0]?.message?.content) {
      throw new ValidationError("Invalid API response format");
    }

    try {
      const content = raw.choices[0].message.content;
      const parsed = JSON.parse(content);

      if (this.responseFormat?.json_schema) {
        const schema = z.object(
          Object.fromEntries(
            Object.entries(
              this.responseFormat.json_schema.schema.properties,
            ).map(([key, value]) => [key, z.string()]),
          ),
        );
        return schema.parse(parsed) as T;
      }

      return parsed as T;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ResponseFormatError(
          `Response validation failed: ${error.message}`,
        );
      }
      throw new ResponseFormatError("Failed to parse response as JSON");
    }
  }

  public async sendMessage(userMessage: string): Promise<T> {
    const payload = this._buildPayload(userMessage);
    const response = await this._callApi(payload);
    return this._validateSchema(response);
  }
}

export async function generateRecipeWithAI(
  input: GenerateRecipeInput,
): Promise<AIRecipeDTO> {
  const openRouter = new OpenRouterService<AIRecipeDTO>({
    apiKey: import.meta.env.OPENROUTER_API_KEY,
    modelName: "openai/gpt-4o",
    defaultParams: {
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9,
    },
    systemMessage: {
      role: "system",
      content:
        "You are a helpful cooking assistant that specializes in generating recipes. " +
        "Always provide detailed, clear, and practical recipes with exact measurements " +
        "and step-by-step instructions. Format ingredients as a bulleted list and " +
        "instructions as numbered steps.",
    },
    responseFormat: {
      type: "json_schema",
      json_schema: {
        name: "Recipe",
        schema: {
          type: "object",
          required: ["name", "ingredients", "instructions"],
          properties: {
            name: { type: "string" },
            ingredients: { type: "string" },
            instructions: { type: "string" },
          },
        },
      },
    },
  });

  const preferencesText = input.preferences.length
    ? `Consider these dietary preferences and restrictions: ${input.preferences.join(", ")}.`
    : "";

  const prompt = `Generate a detailed recipe based on this description: "${input.description}"
    ${preferencesText}

    Format the response as follows:
    1. Give the recipe a descriptive name
    2. List all ingredients with exact measurements as a bulleted list
    3. Provide numbered step-by-step cooking instructions

    Make sure the recipe is practical, achievable, and uses commonly available ingredients.`;

  return await openRouter.sendMessage(prompt);
}


import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RecipeData } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Creative name of the dish" },
    description: { type: Type.STRING, description: "A short, appetizing description (max 2 sentences)" },
    cookingTime: { type: Type.STRING, description: "Total time e.g., '45 mins'" },
    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
    calories: { type: Type.NUMBER, description: "Approximate calories per serving" },
    cuisine: { type: Type.STRING, description: "Type of cuisine e.g., Italian, Mexican" },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of ingredients with quantities"
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step by step cooking instructions"
    },
    nutrition: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, enum: ["Protein", "Carbs", "Fat"] },
          value: { type: Type.NUMBER, description: "Amount in grams" },
          unit: { type: Type.STRING, enum: ["g"] },
          fill: { type: Type.STRING, description: "Hex color code for chart (Protein: #8884d8, Carbs: #82ca9d, Fat: #ffc658)" }
        },
        required: ["name", "value", "unit", "fill"]
      }
    }
  },
  required: ["title", "description", "cookingTime", "difficulty", "calories", "ingredients", "instructions", "nutrition", "cuisine"]
};

export async function generateRecipe(prompt: string, imageBase64?: string): Promise<RecipeData> {
  const model = "gemini-2.5-flash"; // Efficient for multimodal and structured data

  let contents: any = prompt;

  if (imageBase64) {
    contents = {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg", // Assuming jpeg for simplicity in this demo context
            data: imageBase64
          }
        },
        {
          text: `Identify the food items or dish in this image. Based on that, generate a detailed recipe. User extra context: ${prompt}`
        }
      ]
    };
  } else {
    contents = `Generate a creative recipe based on these ingredients or request: ${prompt}`;
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeResponseSchema,
      systemInstruction: "You are a world-class Michelin star chef. Create recipes that are accurate, delicious, and easy to follow. Ensure nutrition data is realistic.",
      temperature: 0.7
    }
  });

  if (!response.text) {
    throw new Error("No recipe generated");
  }

  return JSON.parse(response.text) as RecipeData;
}

export async function generateRecipeImage(description: string): Promise<string> {
  // Using Imagen for high-quality food photography
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `Professional food photography of ${description}, overhead shot, studio lighting, 8k resolution, highly detailed, appetizing presentation, garnish`,
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
      outputMimeType: 'image/jpeg'
    }
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error("Failed to generate image");
  }

  // The new SDK returns imageBytes directly
  const base64String = response.generatedImages[0].image.imageBytes;
  return `data:image/jpeg;base64,${base64String}`;
}

export async function generateVirtualTryOn(garmentDescription: string, sizeContext: string = "fitted"): Promise<string> {
  // Simulating VTO by generating an image of a model wearing the clothes.
  // We incorporate the sizeContext to simulate the "Perfect Fit" visual.
  
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `A photorealistic mirror selfie of a person wearing ${garmentDescription}. The garment is size ${sizeContext}, fitting perfectly on the body. Retail fashion photography, fitting room lighting, 4k, highly detailed texture.`,
    config: {
      numberOfImages: 1,
      aspectRatio: '9:16', 
      outputMimeType: 'image/jpeg'
    }
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error("Failed to generate VTO image");
  }

  const base64String = response.generatedImages[0].image.imageBytes;
  return `data:image/jpeg;base64,${base64String}`;
}

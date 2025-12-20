
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RecipeData } from "../types";

// Always initialize inside functions or ensure process.env.API_KEY is available
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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
          fill: { type: Type.STRING, description: "Hex color code for chart" }
        },
        required: ["name", "value", "unit", "fill"]
      }
    }
  },
  required: ["title", "description", "cookingTime", "difficulty", "calories", "ingredients", "instructions", "nutrition", "cuisine"]
};

export async function generateRecipe(prompt: string, imageBase64?: string): Promise<RecipeData> {
  const ai = getAI();
  const model = "gemini-3-flash-preview"; 

  let contents: any;

  if (imageBase64) {
    contents = {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg", 
            data: imageBase64
          }
        },
        {
          text: `Identify the food items in this image and generate a professional recipe. Context: ${prompt}`
        }
      ]
    };
  } else {
    contents = { parts: [{ text: `Generate a creative recipe based on: ${prompt}` }] };
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeResponseSchema,
      systemInstruction: "You are a world-class Michelin star chef. Create recipes that are accurate and delicious.",
      temperature: 0.7
    }
  });

  if (!response.text) {
    throw new Error("No recipe generated");
  }

  return JSON.parse(response.text) as RecipeData;
}

export async function generateVirtualTryOn(garmentDescription: string, sizeContext: string = "fitted"): Promise<string> {
  const ai = getAI();
  // Using gemini-2.5-flash-image as per guidelines for image generation/editing
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `High-end fashion photography, professional model in a studio wearing ${garmentDescription}. The fit is ${sizeContext}. Soft lighting, ultra-detailed fabric, 4k resolution, editorial style.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "9:16",
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate virtual look");
}

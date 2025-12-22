
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { RecipeData } from "../types";

// Always initialize inside functions or ensure process.env.API_KEY is available
const getAI = () => new GoogleGenerativeAI(process.env.API_KEY || '');

const recipeResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: "Creative name of the dish" },
    description: { type: SchemaType.STRING, description: "A short, appetizing description (max 2 sentences)" },
    cookingTime: { type: SchemaType.STRING, description: "Total time e.g., '45 mins'" },
    difficulty: { type: SchemaType.STRING, enum: ["Easy", "Medium", "Hard"] },
    calories: { type: SchemaType.NUMBER, description: "Approximate calories per serving" },
    cuisine: { type: SchemaType.STRING, description: "Type of cuisine e.g., Italian, Mexican" },
    ingredients: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of ingredients with quantities"
    },
    instructions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Step by step cooking instructions"
    },
    nutrition: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING, enum: ["Protein", "Carbs", "Fat"] },
          value: { type: SchemaType.NUMBER, description: "Amount in grams" },
          unit: { type: SchemaType.STRING, enum: ["g"] },
          fill: { type: SchemaType.STRING, description: "Hex color code for chart" }
        },
        required: ["name", "value", "unit", "fill"]
      }
    }
  },
  required: ["title", "description", "cookingTime", "difficulty", "calories", "ingredients", "instructions", "nutrition", "cuisine"]
};

export async function generateRecipe(prompt: string, imageBase64?: string): Promise<RecipeData> {
  const ai = getAI();
  const model = ai.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: recipeResponseSchema,
      temperature: 0.7
    },
    systemInstruction: "You are a world-class Michelin star chef. Create recipes that are accurate and delicious."
  });

  let parts: any[];

  if (imageBase64) {
    parts = [
      {
        inlineData: {
          mimeType: "image/jpeg", 
          data: imageBase64
        }
      },
      {
        text: `Identify the food items in this image and generate a professional recipe. Context: ${prompt}`
      }
    ];
  } else {
    parts = [{ text: `Generate a creative recipe based on: ${prompt}` }];
  }

  const response = await model.generateContent(parts);
  const text = response.response.text();

  if (!text) {
    throw new Error("No recipe generated");
  }

  return JSON.parse(text) as RecipeData;
}

export async function generateVirtualTryOn(garmentDescription: string, sizeContext: string = "fitted"): Promise<string> {
  const ai = getAI();
  const model = ai.getGenerativeModel({ 
    model: 'gemini-1.5-flash'
  });

  const response = await model.generateContent([
    {
      text: `High-end fashion photography, professional model in a studio wearing ${garmentDescription}. The fit is ${sizeContext}. Soft lighting, ultra-detailed fabric, 4k resolution, editorial style.`,
    }
  ]);

  // Note: Image generation might not be available in this version
  // This is a placeholder that returns a text-based response
  const text = response.response.text();
  
  // Return placeholder for now
  throw new Error("Image generation not available in this API version");
}

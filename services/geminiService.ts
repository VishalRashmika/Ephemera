
import { GoogleGenAI, Type } from "@google/genai";

// API Key management
const API_KEY_STORAGE_KEY = 'ephemera_gemini_api_key';

export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

// Create AI client with user's API key
const getAIClient = (): GoogleGenAI => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('No Gemini API key configured. Please set your API key in Settings.');
  }
  return new GoogleGenAI({ apiKey });
};

// Validate API key by making a simple test request
export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const testAI = new GoogleGenAI({ apiKey });
    
    // Make a minimal test request
    const response = await testAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Say 'valid' if you can read this.",
      config: {
        responseMimeType: "text/plain"
      }
    });
    
    if (response.text) {
      return { valid: true };
    } else {
      return { valid: false, error: 'Invalid response from API' };
    }
  } catch (error: any) {
    console.error('API key validation error:', error);
    
    // Check for common error types
    if (error.message?.includes('API key')) {
      return { valid: false, error: 'Invalid API key. Please check your key and try again.' };
    } else if (error.message?.includes('quota')) {
      return { valid: false, error: 'API quota exceeded. Please check your Google AI Studio quota.' };
    } else if (error.message?.includes('permission')) {
      return { valid: false, error: 'Permission denied. Make sure the API key has proper permissions.' };
    }
    
    return { valid: false, error: error.message || 'Failed to validate API key' };
  }
}

export async function fetchUrlMetadata(url: string) {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract or suggest metadata for this URL: ${url}. 
      If you cannot visit the site, use your internal knowledge to provide a high-quality title, description, relevant tags, and a representative image URL.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            domain: { type: Type.STRING },
            favicon: { type: Type.STRING, description: "Suggest a likely favicon URL or clear icon" },
            image: { type: Type.STRING, description: "Suggest a representative preview image URL for this website" }
          },
          required: ["title", "description", "tags", "domain"]
        }
      }
    });

    const metadata = JSON.parse(response.text);
    
    // Fallback: Use screenshot/preview service if no image provided
    if (!metadata.image) {
      const domain = new URL(url).hostname;
      metadata.image = `https://api.microlink.io/screenshot?url=${encodeURIComponent(url)}&viewport.width=1200&viewport.height=630`;
    }
    
    return metadata;
  } catch (error) {
    console.error("Error fetching metadata with Gemini:", error);
    // Return graceful fallback
    const domain = new URL(url).hostname;
    return {
      title: domain,
      description: "A website bookmarked on Ephemera",
      tags: ["general"],
      domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      image: `https://api.microlink.io/screenshot?url=${encodeURIComponent(url)}&viewport.width=1200&viewport.height=630`
    };
  }
}

export async function generateSmartCategories(bookmarks: any[]) {
  try {
    const ai = getAIClient();
    const context = bookmarks.map(b => `${b.title}: ${b.url}`).join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these bookmarks, suggest 5 logical hierarchical categories.
      
      Bookmarks:
      ${context}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              icon: { type: Type.STRING, description: "Lucide icon name" },
              color: { type: Type.STRING, description: "Hex color code" }
            },
            required: ["name", "icon", "color"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating categories:", error);
    return [];
  }
}

export async function suggestCategory(
  bookmark: { title: string; url: string; description?: string; tags: string[] },
  availableCategories: { id: string; name: string }[]
) {
  try {
    const ai = getAIClient();
    const categoriesList = availableCategories.map(c => c.name).join(', ');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given this bookmark, suggest the most appropriate category from the available list.
      
      Bookmark:
      - Title: ${bookmark.title}
      - URL: ${bookmark.url}
      - Description: ${bookmark.description || 'N/A'}
      - Tags: ${bookmark.tags.join(', ') || 'N/A'}
      
      Available Categories: ${categoriesList}
      
      Choose the single best matching category name from the list above. If none match well, return "uncategorized".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "The best matching category name" },
            confidence: { type: Type.STRING, description: "high, medium, or low confidence" },
            reason: { type: Type.STRING, description: "Brief explanation for the choice" }
          },
          required: ["category", "confidence", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Find the category ID from the name
    const matchedCategory = availableCategories.find(
      c => c.name.toLowerCase() === result.category.toLowerCase()
    );
    
    return {
      categoryId: matchedCategory?.id || null,
      categoryName: result.category,
      confidence: result.confidence,
      reason: result.reason
    };
  } catch (error) {
    console.error("Error suggesting category:", error);
    return {
      categoryId: null,
      categoryName: "uncategorized",
      confidence: "low",
      reason: "Error occurred during categorization"
    };
  }
}

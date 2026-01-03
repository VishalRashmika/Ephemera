
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchUrlMetadata(url: string) {
  try {
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

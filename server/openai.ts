import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AIContentRequest {
  contentType: "headline" | "description" | "services" | "cta";
  businessContext: string;
  tone: "professional" | "friendly" | "creative" | "authoritative";
  additionalContext?: string;
}

export interface AIContentResponse {
  suggestions: string[];
  contentType: string;
}

export async function generateContent(request: AIContentRequest): Promise<AIContentResponse> {
  const { contentType, businessContext, tone, additionalContext } = request;
  
  let prompt = "";
  let systemPrompt = "";

  switch (contentType) {
    case "headline":
      systemPrompt = `You are an expert copywriter specializing in compelling headlines. Generate 3 different headline variations that are attention-grabbing and ${tone}. Respond with JSON in this format: { "suggestions": ["headline1", "headline2", "headline3"] }`;
      prompt = `Create headlines for a business with this context: ${businessContext}. ${additionalContext || ""}`;
      break;
    
    case "description":
      systemPrompt = `You are an expert content writer. Generate 3 different description variations that are engaging and ${tone}. Each should be 2-3 sentences long. Respond with JSON in this format: { "suggestions": ["description1", "description2", "description3"] }`;
      prompt = `Create descriptions for a business with this context: ${businessContext}. ${additionalContext || ""}`;
      break;
    
    case "services":
      systemPrompt = `You are an expert at describing business services. Generate 3 different service offerings that would be relevant for this business. Each should have a title and brief description. Be ${tone} in tone. Respond with JSON in this format: { "suggestions": ["Service Name: Description", "Service Name: Description", "Service Name: Description"] }`;
      prompt = `Create service offerings for a business with this context: ${businessContext}. ${additionalContext || ""}`;
      break;
    
    case "cta":
      systemPrompt = `You are an expert at creating compelling call-to-action text. Generate 3 different CTA button text variations that are action-oriented and ${tone}. Keep them short (2-4 words). Respond with JSON in this format: { "suggestions": ["cta1", "cta2", "cta3"] }`;
      prompt = `Create call-to-action text for a business with this context: ${businessContext}. ${additionalContext || ""}`;
      break;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      suggestions: result.suggestions || [],
      contentType
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI content: " + (error as Error).message);
  }
}

export async function generateColorScheme(businessContext: string): Promise<{ primary: string; secondary: string; accent: string; }> {
  const systemPrompt = `You are a color theory expert. Based on the business context, suggest a professional color scheme with primary, secondary, and accent colors. Consider psychology of colors and brand perception. Respond with JSON in this format: { "primary": "#hexcode", "secondary": "#hexcode", "accent": "#hexcode" }`;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Suggest colors for: ${businessContext}` }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      primary: result.primary || "#6366F1",
      secondary: result.secondary || "#8B5CF6", 
      accent: result.accent || "#10B981"
    };
  } catch (error) {
    console.error("OpenAI color generation error:", error);
    // Return default colors if AI fails
    return {
      primary: "#6366F1",
      secondary: "#8B5CF6",
      accent: "#10B981"
    };
  }
}

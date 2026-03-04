import { analyzeText, parseGeminiJson } from './geminiClient.js';

export async function detectOpportunity(inputText) {
    const prompt = `
  Analyze this text and determine if there is a business automation or software opportunity.
  You are an expert AI Client Acquisition Assistant.

  Return ONLY a valid JSON object with the following fields:
  - problem: string (summarize the pain point or manual process detected)
  - automationOpportunity: string (what kind of automation they need)
  - solutionSuggestion: string (what you propose to build; e.g. "automated booking system")
  - opportunityScore: number (0-100 based on automation potential and urgency)
  - urgency: string ("low", "medium", or "high")
  - hasOpportunity: boolean (true if an opportunity exists, false otherwise)
  - estimatedRevenueRange: string (e.g. "$10,000 - $30,000/mo")

  Text:
  ${inputText}
  `;

    const rawResult = await analyzeText(prompt);
    return parseGeminiJson(rawResult);
}

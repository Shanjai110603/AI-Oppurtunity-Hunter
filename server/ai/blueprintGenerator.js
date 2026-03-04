import { analyzeText, parseGeminiJson } from './geminiClient.js';

export async function generateBlueprint(problem, solution) {
    const prompt = `
  You are an expert Automation Architect. Generate an implementation plan for the following problem and solution.

  Problem: ${problem}
  Suggested Solution: ${solution}

  Return ONLY a valid JSON object with:
  - components: string (comma-separated list of technical components, e.g., "Webflow, Make.com, Airtable, OpenAI API")
  - estimatedBuildHours: number (an integer representing the total hours to develop strings)
  - outreachMessage: string (a short, personalized cold email/message offering to build this specific solution)

  JSON format:
  `;

    const rawResult = await analyzeText(prompt);
    return parseGeminiJson(rawResult);
}

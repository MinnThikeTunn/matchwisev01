import { createFileRoute } from '@tanstack/react-router';

function ruleBasedCriteria(prompt: string) {
  const lower = prompt.toLowerCase();
  const requiredRoles: { role: string; count: number }[] = [];
  const requiredSkills: string[] = [];

  if (lower.includes('python') || lower.includes('backend')) {
    requiredRoles.push({ role: 'Backend Engineer', count: lower.includes('2') ? 2 : 1 });
    requiredSkills.push('Python', 'Distributed Systems', 'PostgreSQL');
  }
  if (lower.includes('designer') || lower.includes('ux') || lower.includes('ui')) {
    requiredRoles.push({ role: 'UI/UX Designer', count: 1 });
    requiredSkills.push('Figma', 'Design Systems', 'Creative Prototyping');
  }
  if (lower.includes('lead') || lower.includes('architect') || lower.includes('frontend')) {
    requiredRoles.push({ role: 'Lead Architect', count: 1 });
    requiredSkills.push('React / TypeScript', 'System Design');
  }
  if (requiredRoles.length === 0) {
    requiredRoles.push({ role: 'Core Collaborator', count: 2 });
    requiredSkills.push('Full-Stack Development', 'Problem Solving');
  }

  return {
    targetSubMode: 'CUSTOM_AI_MATCH',
    targetTeamSize: requiredRoles.reduce((a, r) => a + r.count, 0) || 3,
    requiredRoles,
    requiredSkills,
    minExecutionDrive: lower.includes('high execution') ? 85 : 75,
    preferredTimezone: 'UTC-8 to UTC+1 (Flexible)',
    domainFocus: 'Design Systems & Scalable AI Infrastructure',
  };
}

export const Route = createFileRoute('/api/parse-custom-match')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { prompt?: string } | null;
        const prompt = body?.prompt;
        if (!prompt || typeof prompt !== 'string') {
          return Response.json({ error: 'Prompt string is required' }, { status: 400 });
        }

        const apiKey = process.env['GEMINI_API_KEY'];
        if (apiKey) {
          try {
            const systemInstruction = `You are the Matchwise Prism criteria schema parser. Convert the user's natural language matching request into a structured JSON Criteria Card.
Return ONLY valid JSON matching this schema:
{
  "targetSubMode": "HACKATHON_TEAMS" | "PROJECT_GROUPS" | "CUSTOM_AI_MATCH" | "NETWORKING" | "MENTORSHIP",
  "targetTeamSize": number,
  "requiredRoles": [{"role": string, "count": number}],
  "requiredSkills": string[],
  "minExecutionDrive": number,
  "preferredTimezone": string,
  "domainFocus": string
}`;
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { systemInstruction, responseMimeType: 'application/json' },
            });
            if (response.text) {
              return Response.json({ success: true, source: 'gemini', criteria: JSON.parse(response.text) });
            }
          } catch (err) {
            console.warn('Gemini parser fallback triggered:', err);
          }
        }

        return Response.json({
          success: true,
          source: 'rule-based-fallback',
          criteria: ruleBasedCriteria(prompt),
        });
      },
    },
  },
});

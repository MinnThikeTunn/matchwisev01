import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/explain-match')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as
          | { userA?: any; userB?: any; matchResult?: any }
          | null;
        const { userA, userB, matchResult } = body ?? {};
        if (!userA || !userB || !matchResult) {
          return Response.json(
            { error: 'userA, userB and matchResult are required' },
            { status: 400 },
          );
        }

        const apiKey = process.env['GEMINI_API_KEY'];
        if (apiKey) {
          try {
            const prompt = `You are the Matchwise Prism Explainable AI (XAI) engine.
Explain the synergy match between ${userA.name} (${userA.title}) and ${userB.name} (${userB.title}).
Final Match Score is strictly deterministic: ${matchResult.finalMatchScore}%.
Prism Synergy Label: "${matchResult.synergyLabel}".
Generate a concise, high-craft explanation with 3 specific Key Drivers.
Return ONLY valid JSON with format:
{
  "synergyDescription": string,
  "keyDrivers": [
    { "title": string, "description": string, "type": "technical" | "communication" | "risk" | "values", "scoreImpact": number }
  ]
}`;
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { responseMimeType: 'application/json' },
            });
            if (response.text) {
              return Response.json({
                success: true,
                source: 'gemini',
                explanation: JSON.parse(response.text),
              });
            }
          } catch (err) {
            console.warn('Gemini explanation fallback triggered:', err);
          }
        }

        return Response.json({
          success: true,
          source: 'deterministic-template',
          explanation: {
            synergyDescription: matchResult.synergyDescription,
            keyDrivers: matchResult.keyDrivers,
          },
        });
      },
    },
  },
});

// Vercel serverless function: proxies requests to Google Gemini's free tier.
// Why this exists: keeps your API key secret (it stays on the server, never sent to browsers).
//
// Deploy: this file goes at /api/generate.js in your Vercel project.
// Set environment variable GEMINI_API_KEY in Vercel dashboard before deploying.
// Free tier: 1,500 requests/day on gemini-1.5-flash. More than enough to validate.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobDesc, bg, tone, length } = req.body || {};
  if (!jobDesc || !bg) {
    return res.status(400).json({ error: 'Job description and background required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured. Set GEMINI_API_KEY in Vercel.' });
  }

  const toneInstruction = {
    'warm-confident': 'Warm, confident, human. Reads like a thoughtful note from a smart professional.',
    'sharp-direct': 'Sharp and direct. Minimal warmth, maximum signal. For senior or executive roles.',
    'enthusiastic': 'Enthusiastic and energetic — for early-career, startup, or creative roles.',
    'formal': 'Traditional and formal — for law, finance, government, or academic roles.',
  }[tone] || 'Warm and confident.';

  const lengthInstruction = {
    short: 'Strictly 180–230 words. Tight and punchy.',
    medium: 'Strictly 280–340 words. The sweet spot for most applications.',
    long: 'Strictly 380–450 words. Use only when the role is senior and demands depth.',
  }[length] || '280–340 words.';

  const prompt = `You are a senior career coach and copywriter who has helped candidates land offers at top companies. Write a cover letter for the following job application.

NON-NEGOTIABLE RULES:
1. Open with a specific, earned hook tied to the role or company — NEVER "I am writing to apply for..."
2. Show real understanding of what the role actually needs (read between the lines of the job description).
3. Connect 2–3 specific experiences from the candidate's background to the job's actual requirements. Be concrete with examples, numbers, or outcomes where the candidate gave them.
4. Confident, human language. NO clichés: no "team player", "results-driven", "passionate about", "proven track record", "synergy", "wear many hats", "go-getter".
5. End with a clear, low-pressure call to action.
6. Format as a real letter: 3–4 paragraphs, no bullet points, no headers, no signature, no "Dear Hiring Manager" preamble.
7. TONE: ${toneInstruction}
8. LENGTH: ${lengthInstruction}

JOB DESCRIPTION:
${jobDesc}

CANDIDATE BACKGROUND:
${bg}

Write only the cover letter body. Start directly with the opening line. No commentary before or after.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', errText);
      return res.status(502).json({ error: 'AI service error. Try again in a moment.' });
    }

    const data = await geminiRes.json();
    const letter = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!letter) {
      return res.status(502).json({ error: 'No letter generated. Try again.' });
    }

    return res.status(200).json({ letter });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Try again.' });
  }
}

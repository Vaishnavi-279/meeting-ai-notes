export async function summarizeTranscript(transcript, apiKey) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert meeting note taker. Analyze the transcript and return ONLY a valid JSON object with no markdown, no backticks, no extra text. The JSON must have exactly these fields:
{
  "title": "short descriptive meeting title (max 8 words)",
  "overview": "2-3 sentence summary of the meeting",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "actionItems": ["action 1", "action 2"]
}
Return only the JSON object, nothing else.`,
        },
        {
          role: "user",
          content: `Summarize this transcript:\n\n${transcript}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Groq API error");
  }

  const data = await response.json();
  const text = data.choices[0].message.content.trim();

  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON if there's extra text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse AI response. Please try again.");
  }
}

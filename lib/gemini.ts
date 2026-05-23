import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_KEY!
  );

export async function readScoreImage(base64Image: string) {
  // remove "data:image/png;base64,"
  const cleanBase64 = base64Image.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are a strict JSON-only system.

TASK:
Extract student score table from image.

RULES:
- Output ONLY valid JSON array
- No markdown
- No explanation
- No extra text
- Fix OCR errors (97 → 9.7)
- "Quốc phòng" is always last subject
IMPORTANT:
- All "subject" names must be in Vietnamese
- All text output must be in Vietnamese
- Do NOT use English

FORMAT:
[
  {
    "subject": "Math",
    "hk1": 8.5,
    "hk2": 9.0,
    "avg": 8.8
  }
]
`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const text = result.response.text();

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}
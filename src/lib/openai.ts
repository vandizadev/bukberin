import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEventDescription(
    eventName: string,
    context?: string
): Promise<string> {
    // Fallback if no API key
    if (!process.env.OPENAI_API_KEY) {
        return `Yuk ikutan acara buka bersama "${eventName}"! 🌙 Mari kita pererat silaturahmi sambil berbagi kebahagiaan di bulan suci Ramadan. Jangan lupa daftar dan vote tempat favorit kamu! ✨`;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Kamu adalah copywriter yang ceria dan hangat. Tulis dalam Bahasa Indonesia yang santai dan ramah. Gunakan 1-2 emoji yang relevan.",
                },
                {
                    role: "user",
                    content: `Buatkan deskripsi singkat dan menarik untuk acara buka bersama (bukber) bernama "${eventName}". ${context ? `Konteks tambahan: ${context}. ` : ""
                        }Maksimal 3 kalimat.`,
                },
            ],
            max_tokens: 200,
            temperature: 0.8,
        });

        return (
            response.choices[0]?.message?.content ||
            `Acara bukber "${eventName}" akan segera dimulai! 🌙`
        );
    } catch (error) {
        console.error("OpenAI API error:", error);
        return `Yuk ikutan acara buka bersama "${eventName}"! 🌙 Mari kita pererat silaturahmi sambil berbagi kebahagiaan di bulan suci Ramadan.`;
    }
}

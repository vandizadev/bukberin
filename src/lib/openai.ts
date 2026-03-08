export async function generateEventDescription(
    eventName: string,
    context?: string
): Promise<string> {
    // Artificial delay to simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (context) {
        return `Asyik, mari kumpul di acara bukber "${eventName}"! 🌙 Dengan tema "${context}", pastinya momen silaturahmi kita bakal makin seru dan penuh berkah. Jangan sampai kelewatan ya! ✨`;
    }

    const templates = [
        `Yuk ikutan acara buka bersama "${eventName}"! 🌙 Mari kita pererat silaturahmi sambil berbagi kebahagiaan di bulan suci Ramadan. ✨`,
        `Siapkan perut dan momen seru! Bukber "${eventName}" bakal jadi ajang kumpul-kumpul paling pecah tahun ini! 🍽️ Ayo daftar sekarang! 🎉`,
        `Rindu sapaan teman lama? Saatnya lepas kangen di acara "${eventName} "! 🕌 Momen pas buat ngobrol santai sambil nikmatin hidangan lezat. 🥘`,
        `Jangan biarkan wacana tetap jadi wacana! Hadiri kemeriahan "${eventName}" biar puasamu makin afdol dan pertemanan makin solid! 🙌✨`
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate;
}

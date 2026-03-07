/**
 * Environment validation — imported on app start to ensure
 * all required environment variables are set.
 */

const requiredVars = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const;

const optionalVars = [
    "OPENAI_API_KEY",
    "MAYAR_API_KEY",
    "MAYAR_WEBHOOK_SECRET",
    "MAYAR_API_URL",
    "NEXT_PUBLIC_APP_URL",
] as const;

export function validateEnv() {
    const missing: string[] = [];

    for (const key of requiredVars) {
        if (!process.env[key]) {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables:\n${missing.map((v) => `  - ${v}`).join("\n")}\n\nCopy .env.example to .env and fill in the values.`
        );
    }

    // Warn about optional but recommended vars
    if (process.env.NODE_ENV === "production") {
        for (const key of optionalVars) {
            if (!process.env[key]) {
                console.warn(`⚠️  Optional env var ${key} is not set`);
            }
        }

        // Production safety checks
        if (process.env.MAYAR_API_KEY?.startsWith("mock-key")) {
            console.warn(
                "⚠️  MAYAR_API_KEY is set to mock mode. Payment will NOT work in production!"
            );
        }

        if (process.env.NEXTAUTH_SECRET === "your-super-secret-key-change-this") {
            throw new Error(
                "❌ NEXTAUTH_SECRET must be changed from the default value in production!"
            );
        }
    }
}

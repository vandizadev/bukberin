import { createHmac } from "crypto";

interface CreateCheckoutParams {
    name: string;
    amount: number;
    description: string;
    redirectUrl: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    mayarApiKey: string;
}

interface CheckoutResult {
    checkoutUrl: string;
    transactionId: string;
}

const MAYAR_API_URL = process.env.MAYAR_API_URL || "https://api.mayar.id/hl/v1";

export function isMockMode(apiKey?: string): boolean {
    // If no key is provided, or it's explicitly a mock key, use mock mode
    return !apiKey || apiKey.startsWith("mock-key");
}

export async function createCheckoutLink(
    params: CreateCheckoutParams
): Promise<CheckoutResult> {
    // Validate amount
    if (params.amount <= 0 || params.amount > 50000000) {
        throw new Error("Amount harus antara 1 dan Rp 50.000.000");
    }

    // Mock mode for development without Mayar account
    if (isMockMode(params.mayarApiKey)) {
        const fakeTransactionId = `mock_txn_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`;

        console.log("[Mayar Mock] Generated mock checkout:", {
            ...params,
            transactionId: fakeTransactionId,
        });

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        return {
            checkoutUrl: `${appUrl}/mock-payment?txn=${encodeURIComponent(fakeTransactionId)}&amount=${params.amount}&name=${encodeURIComponent(params.customerName)}`,
            transactionId: fakeTransactionId,
        };
    }

    // Live mode - actual Mayar API call
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
        const response = await fetch(`${MAYAR_API_URL}/payment/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${params.mayarApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: params.name.substring(0, 200),
                amount: params.amount,
                description: params.description.substring(0, 500),
                redirectUrl: params.redirectUrl,
                customerName: params.customerName.substring(0, 100),
                email: params.customerEmail || "peserta@bukberin.local",
                mobile: params.customerPhone || "080000000000",
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Mayar API Error ${response.status}:`, errorData);
            throw new Error(`Mayar API Error: ${response.status}`);
        }

        const data = await response.json();

        const checkoutUrl = data.data?.link || data.data?.checkoutUrl || "";
        const transactionId = data.data?.id || data.data?.transactionId || "";

        if (!checkoutUrl || !transactionId) {
            throw new Error("Mayar returned incomplete response");
        }

        return { checkoutUrl, transactionId };
    } finally {
        clearTimeout(timeout);
    }
}

export function verifyWebhookSignature(
    payload: string,
    signature: string,
    webhookSecret: string
): boolean {
    // If webhookSecret is explicitly a mock, skip verification
    if (isMockMode(webhookSecret)) return true;

    if (!webhookSecret || !signature) return false;

    try {
        const expectedSignature = createHmac("sha256", webhookSecret)
            .update(payload)
            .digest("hex");

        // Constant-time comparison to prevent timing attacks
        if (signature.length !== expectedSignature.length) return false;

        let result = 0;
        for (let i = 0; i < signature.length; i++) {
            result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
        }
        return result === 0;
    } catch {
        console.error("Webhook signature verification failed");
        return false;
    }
}

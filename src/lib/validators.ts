import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(100),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

export const createEventSchema = z.object({
    name: z.string().min(3, "Nama acara minimal 3 karakter").max(100),
    description: z.string().min(10, "Deskripsi minimal 10 karakter").max(1000),
    budgetPerPerson: z.number().min(10000, "Budget minimal Rp 10.000"),
    dateOptions: z.array(z.string()).min(1, "Minimal 1 opsi tanggal"),
    locationOptions: z.array(z.string().min(2)).min(1, "Minimal 1 opsi lokasi"),
});

export const joinEventSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(100),
    phone: z
        .string()
        .min(10, "Nomor HP minimal 10 digit")
        .max(15, "Nomor HP maksimal 15 digit")
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Format nomor HP Indonesia tidak valid"),
});

export const voteSchema = z.object({
    participantId: z.string().min(1),
    selectedDateId: z.string().min(1, "Pilih satu tanggal"),
    selectedLocationId: z.string().min(1, "Pilih satu lokasi"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type JoinEventInput = z.infer<typeof joinEventSchema>;
export type VoteInput = z.infer<typeof voteSchema>;

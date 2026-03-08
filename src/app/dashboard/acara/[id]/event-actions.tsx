"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit2, Ban, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface EventData {
    id: string;
    name: string;
    description: string | null;
    budgetPerPerson: number;
    status: string;
}

interface Props {
    event: EventData;
}

export default function EventActions({ event }: Props) {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    // Edit Form State
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description || "");
    const [budgetPerPerson, setBudgetPerPerson] = useState(event.budgetPerPerson);

    const isLocked = event.status === "COMPLETED" || event.status === "CANCELLED";

    const handleUpdate = async (updatedData: Partial<EventData>) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/events/${event.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Gagal memperbarui acara");
                return;
            }

            toast.success("Acara berhasil diperbarui!");
            setShowEdit(false);
            router.refresh(); // Refresh page to get latest server component data
        } catch {
            toast.error("Terjadi kesalahan server");
        } finally {
            setLoading(false);
            setOpenMenu(false);
        }
    };

    const handleCancelEvent = async () => {
        if (!confirm("Apakah Anda yakin ingin membatalkan acara ini? Aksi ini tidak dapat diubah kembali.")) {
            return;
        }
        await handleUpdate({ status: "CANCELLED" });
    };

    return (
        <div className="relative">
            {/* Action Menu Trigger */}
            {!isLocked && (
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="btn btn-ghost px-2 text-[var(--text-muted)] hover:text-gray-900 absolute top-0 right-0 sm:relative"
                    aria-label="Opsi Acara"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
            )}

            {/* Dropdown Menu */}
            {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                    <button
                        onClick={() => {
                            setShowEdit(true);
                            setOpenMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" /> Edit Detail
                    </button>
                    <button
                        onClick={handleCancelEvent}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <Ban className="w-4 h-4" /> Batalkan Acara
                    </button>
                </div>
            )}

            {/* Backdrop for dropdown */}
            {openMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setOpenMenu(false)}
                />
            )}

            {/* Edit Modal */}
            {showEdit && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-slide-up shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Edit Acara</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="label">Nama Acara</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label">Deskripsi</label>
                                <textarea
                                    className="input min-h-[100px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label">Budget per Orang</label>
                                <input
                                    type="number"
                                    className="input"
                                    min={10000}
                                    step={1000}
                                    value={budgetPerPerson}
                                    onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => setShowEdit(false)}
                                className="btn btn-ghost"
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleUpdate({ name, description, budgetPerPerson })}
                                disabled={loading || !name}
                                className="btn btn-primary"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

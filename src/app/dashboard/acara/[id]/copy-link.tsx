"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function CopyLinkButton({ link }: { link: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Link berhasil disalin! 📋");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-2 shrink-0">
            <button onClick={handleCopy} className="btn btn-outline btn-sm">
                {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
                {copied ? "Tersalin!" : "Copy Link"}
            </button>
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
            >
                <ExternalLink className="w-4 h-4" />
            </a>
        </div>
    );
}

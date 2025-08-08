"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, Copy, Mail, X, MessageCircle, Send, Twitter, Facebook, Linkedin } from "lucide-react";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  shareText: string;
  shareUrl: string;
}

const isMobileLike = () => {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const ShareSheet: React.FC<ShareSheetProps> = ({ isOpen, onClose, title, shareText, shareUrl }) => {
  const [copied, setCopied] = useState<"" | "link" | "text">("");

  useEffect(() => {
    if (!isOpen) setCopied("");
  }, [isOpen]);

  // Lock body scroll while open to avoid background misalignment/shift
  useEffect(() => {
    if (!isOpen) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  const fullText = useMemo(() => `🔗 Play: ${shareUrl}\n\n${shareText}`, [shareText, shareUrl]);
  const xTweet = useMemo(() => {
    const header = `🔗 Play: ${shareUrl}`;
    const limit = 280;
    const sep = '\n\n';
    const room = limit - (header.length + sep.length);
    if (room <= 0) return header;
    const body = shareText.length <= room ? shareText : `${shareText.slice(0, Math.max(0, room - 1)).trimEnd()}…`;
    return `${header}${sep}${body}`;
  }, [shareText, shareUrl]);
  const xLength = xTweet.length;
  const xOk = xLength <= 280;

  const platforms = useMemo(
    () => [
      {
        key: "whatsapp",
        label: "WhatsApp",
        href: `https://wa.me/?text=${encodeURIComponent(fullText)}`,
        icon: <MessageCircle size={18} />,
      },
      {
        key: "telegram",
        label: "Telegram",
        href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        icon: <Send size={18} />,
      },
      {
        key: "x",
        label: "Post on X",
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(xTweet)}`,
        icon: <Twitter size={18} />,
      },
      {
        key: "facebook",
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        icon: <Facebook size={18} />,
      },
      {
        key: "linkedin",
        label: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        icon: <Linkedin size={18} />,
      },
      {
        key: "email",
        label: "Email",
        href: `mailto:?subject=${encodeURIComponent(title || "Check this out")}&body=${encodeURIComponent(fullText)}`,
        icon: <Mail size={18} />,
      },
    ], [fullText, shareText, shareUrl, title]
  );

  // Silently copy share content on desktop before opening a new tab
  const silentCopyDesktop = (text: string) => {
    if (isMobileLike()) return;
    try {
      // Best-effort; no UI feedback needed here
      void navigator.clipboard.writeText(text);
    } catch (_) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {}
    }
  };

  const copy = async (text: string, type: "link" | "text") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
    } catch (e) {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div aria-modal="true" role="dialog" className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* sheet/modal */}
          <motion.div
            initial={{ y: isMobileLike() ? "100%" : 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: isMobileLike() ? "100%" : 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative z-10 w-full max-w-[560px] max-h-[85vh] overflow-y-auto bg-stone-900 border border-stone-800 shadow-2xl p-5 ${
              isMobileLike()
                ? "rounded-t-3xl"
                : "rounded-2xl"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Share your score</h3>
              <button onClick={onClose} aria-label="Close share sheet" className="p-2 rounded hover:bg-stone-800">
                <X size={18} className="text-stone-400" />
              </button>
            </div>

            {/* preview of share content */}
            <div className="mb-4">
              <div className="text-xs text-stone-400 mb-1">Preview</div>
              <pre className="whitespace-pre-wrap break-words text-sm font-mono rounded-2xl border border-stone-800 bg-stone-900/60 p-3 text-stone-100">
                <span className="text-emerald-300">🔗 Play: {shareUrl}</span>
                {"\n\n"}
                {shareText}
              </pre>
              <div className="mt-1 text-[11px] text-stone-400">
                X length: {xLength}/280 {xOk ? '✅' : '⚠️ will truncate'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {platforms.map((p) => (
                <a
                  key={p.key}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => silentCopyDesktop(fullText)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-stone-800 bg-stone-800/40 hover:bg-stone-800 transition-colors"
                >
                  {p.icon}
                  <span className="text-sm text-white">{p.label}</span>
                </a>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => copy(shareUrl, "link")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-800 bg-stone-800/40 hover:bg-stone-800 text-white"
              >
                <LinkIcon size={18} />
                {copied === "link" ? "Link Copied!" : "Copy Link"}
              </button>
              <button
                onClick={() => copy(fullText, "text")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-800 bg-stone-800/40 hover:bg-stone-800 text-white"
              >
                <Copy size={18} />
                {copied === "text" ? "Results Copied!" : "Copy Results"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareSheet;

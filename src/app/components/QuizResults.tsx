"use client";
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Answer, Question } from '@/app/types';
import { Share2, Repeat, X as CloseIcon, MessageCircle, Twitter, Copy, Link as LinkIcon } from 'lucide-react';
import ShareSheet from './ShareSheet';
import ConfettiBurst from './ConfettiBurst';

interface QuizResultsProps {
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ answers, questions, onRestart }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showShareNudge, setShowShareNudge] = useState(true);
  const [copied, setCopied] = useState(false);
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (score === 100) return "🥇 Flawless Victory! You’re an MCP legend. Share it and flex that brain!";
    if (score >= 90) return "🔥 Elite status unlocked! Tag a friend who can’t beat this.";
    if (score >= 80) return "🚀 Crushing it! You’re on fire—share and challenge your squad.";
    if (score >= 70) return "✨ Strong game! One more round and you’ll hit elite.";
    if (score >= 60) return "⚡ Nice! You’ve got momentum, share and try to beat your score.";
    if (score >= 40) return "😎 Not bad! Warm up the neurons and take another shot.";
    return "🤓 Tough round! Share your score and dare your friends to beat it.";
  };

  const shareText = useMemo(() => {
    // Build a Wordle‑style grid grouped by difficulty
    const byDiff: Record<'easy' | 'medium' | 'hard', string[]> = { easy: [], medium: [], hard: [] };
    for (const q of questions) {
      const a = answers.find((ans) => ans.questionId === q.id);
      const emoji = a?.isCorrect ? '🟩' : '🟥';
      byDiff[q.difficulty].push(emoji);
    }
    const lines: string[] = [];
    if (byDiff.easy.length) lines.push(`E: ${byDiff.easy.join('')}`);
    if (byDiff.medium.length) lines.push(`M: ${byDiff.medium.join('')}`);
    if (byDiff.hard.length) lines.push(`H: ${byDiff.hard.join('')}`);
    const grid = lines.join('\n');

    const header =
      score === 100
        ? `🏆 CanYouMCP — ${correctAnswers}/${totalQuestions} • ${score}%`
        : `CanYouMCP — ${correctAnswers}/${totalQuestions} • ${score}%`;

    const cta =
      score >= 90
        ? 'Think you can beat this?'
        : score >= 70
        ? 'Can you top my score?'
        : 'Your move.';

    const hashtags = '#CanYouMCP #MCP #AIQuiz';

    return `${header}\n\n${grid}\n\n${cta}\n${hashtags}`;
  }, [answers, questions, correctAnswers, totalQuestions, score]);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  // Make URL prominent at the top for chat apps and copy
  const fullText = useMemo(() => `🔗 Play: ${shareUrl}\n\n${shareText}`, [shareText, shareUrl]);
  // Do the same for mobile native share
  const mobileShareText = useMemo(() => `🔗 Play: ${shareUrl}\n\n${shareText}`, [shareText, shareUrl]);

  // Treat mobile differently: use native share only on mobile; desktop always uses our ShareSheet
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Optimize text for X: include URL at top and keep within 280 chars
  const xTweet = useMemo(() => {
    const limit = 280;
    const header = `🔗 Play: ${shareUrl}`;

    const within = (body: string) => (header + '\n\n' + body).length <= limit;

    if (within(shareText)) return `${header}\n\n${shareText}`;

    // Work on the body only
    const lines = shareText.split('\n');
    const stripTags = (ls: string[]) => ls.filter((l) => !l.trim().startsWith('#'));

    // 1) Remove hashtags lines entirely
    let candidateLines = stripTags(lines);
    let candidate = candidateLines.join('\n').trim();
    if (within(candidate)) return `${header}\n\n${candidate}`;

    // 2) Remove a CTA-like line (last non-grid, non-header line)
    const isGridLine = (l: string) => /^\s*[EMH]:/.test(l);
    const isHeader = (l: string) => l.includes('CanYouMCP') && l.includes('%');
    for (let i = candidateLines.length - 1; i >= 0; i--) {
      const l = candidateLines[i];
      if (!isGridLine(l) && !isHeader(l) && l.trim().length > 0) {
        candidateLines.splice(i, 1);
        break;
      }
    }
    candidate = candidateLines.join('\n').trim();
    if (within(candidate)) return `${header}\n\n${candidate}`;

    // 3) Remove trophy emoji
    candidate = candidate.replace(/^🏆\s*/, '');
    if (within(candidate)) return `${header}\n\n${candidate}`;

    // 4) Remove difficulty labels to compress grid
    candidate = candidate.replace(/(^|\n)[EMH]:\s?/g, '$1');
    if (within(candidate)) return `${header}\n\n${candidate}`;

    // 5) Collapse multiple newlines and trim
    candidate = candidate.replace(/\n{2,}/g, '\n').trim();
    if (within(candidate)) return `${header}\n\n${candidate}`;

    // 6) Hard truncate body with ellipsis
    const maxBodyLen = Math.max(0, limit - (header.length + 2) - 1);
    const sliced = candidate.slice(0, maxBodyLen).trimEnd();
    return `${header}\n\n${sliced}…`;
  }, [shareText, shareUrl]);

  const waHref = useMemo(() => `https://wa.me/?text=${encodeURIComponent(fullText)}`, [fullText]);
  const xHref = useMemo(
    () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(xTweet)}`,
    [xTweet]
  );

  const confettiIntensity = useMemo(() => {
    if (score === 100) return 'ultra' as const;
    if (score >= 90) return 'high' as const;
    if (score >= 70) return 'medium' as const;
    return 'low' as const;
  }, [score]);

  const confettiEmojis = useMemo(() => {
    if (score >= 90) return ['🎉', '✨', '🏆', '🎊', '💥', '⭐️'];
    if (score >= 70) return ['🎉', '✨', '⭐️'];
    return ['✨', '⭐️'];
  }, [score]);

  const handleShare = async () => {
    if (isMobile) {
      const data: ShareData = { title: 'CanYouMCP Quiz', text: mobileShareText };
      try {
        // @ts-ignore canShare may be missing in TS lib
        if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
          await navigator.share(data);
          return;
        }
      } catch (_) {
        // ignore and fall back
      }
    }
    // Desktop or unsupported mobile: open our ShareSheet
    setIsShareOpen(true);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {
      try {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        // no-op
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center bg-stone-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-stone-700"
    >
      <ConfettiBurst intensity={confettiIntensity} emojis={confettiEmojis} />
      <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">Quiz Complete!</h2>
      <p className="text-8xl font-bold my-4">{score}<span className="text-4xl text-stone-400">%</span></p>
      <p className="text-lg text-stone-300 mb-6">{getPerformanceMessage()}</p>

      {showShareNudge && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="mb-2 flex items-center gap-2 rounded-2xl border border-stone-700/60 bg-stone-800/40 px-3 py-2 backdrop-blur"
        >
          <span className="hidden sm:inline text-sm text-stone-300">Challenge your friends</span>
          <div className="flex items-center gap-1.5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-700/60 bg-stone-800/60 text-stone-200 hover:bg-stone-800"
              title="Share on WhatsApp"
            >
              <MessageCircle size={16} />
              <span className="sr-only">WhatsApp</span>
            </a>
            <a
              href={xHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-700/60 bg-stone-800/60 text-stone-200 hover:bg-stone-800"
              title="Post on X"
            >
              <Twitter size={16} />
              <span className="sr-only">X</span>
            </a>
            <button
              onClick={copyLink}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-700/60 bg-stone-800/60 text-stone-200 hover:bg-stone-800"
              title={copied ? 'Copied!' : 'Copy link'}
            >
              {copied ? <Copy size={16} /> : <LinkIcon size={16} />}
              <span className="sr-only">Copy Link</span>
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-700/40 bg-emerald-600/30 text-emerald-200 hover:bg-emerald-600/40"
              title="More ways to share"
            >
              <Share2 size={16} />
              <span className="sr-only">More</span>
            </button>
          </div>
          <button
            onClick={() => setShowShareNudge(false)}
            className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-stone-400 hover:text-white hover:bg-stone-800/70"
            aria-label="Dismiss share suggestions"
          >
            <CloseIcon size={14} />
          </button>
        </motion.div>
      )}



      <div className="flex flex-col items-center gap-4 mt-8">
        <motion.button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition-colors w-full max-w-xs shadow-lg hover:shadow-emerald-500/25"
          whileHover={{ scale: 1.05 }}
        >
          <Share2 size={18} />
          Share Your Score
        </motion.button>
                <motion.button
          onClick={onRestart}
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          <Repeat size={16} />
          Try Again
        </motion.button>
      </div>

      {/* ShareSheet fallback for desktop/unsupported environments */}
      <ShareSheet
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share your score"
        shareText={shareText}
        shareUrl={shareUrl}
      />
    </motion.div>
  );
};

export default QuizResults;

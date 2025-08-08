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
    if (score === 100) return `🥇 I ACED the CanYouMCP quiz with 100%! Think you can beat that? 💪`;
    if (score >= 90) return `🔥 I scored ${score}% on the CanYouMCP quiz! Bet you can’t top it.`;
    if (score >= 80) return `🚀 I scored ${score}% on the CanYouMCP quiz! Challenge accepted?`;
    if (score >= 70) return `✨ I got ${score}% on the CanYouMCP quiz! Can you beat me?`;
    if (score >= 60) return `⚡ I scored ${score}% on the CanYouMCP quiz! Your turn.`;
    if (score >= 40) return `😅 I got ${score}% on the CanYouMCP quiz—ok your move!`;
    return `🤓 I only scored ${score}% on the CanYouMCP quiz. Flex your MCP skills!`;
  }, [score]);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const fullText = useMemo(() => `${shareText}\n${shareUrl}`, [shareText, shareUrl]);

  // Treat mobile differently: use native share only on mobile; desktop always uses our ShareSheet
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const waHref = useMemo(() => `https://wa.me/?text=${encodeURIComponent(fullText)}`, [fullText]);
  const xHref = useMemo(
    () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    [shareText, shareUrl]
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
      const data: ShareData = { title: 'CanYouMCP Quiz', text: shareText, url: shareUrl };
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
      className="text-center bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700"
    >
      <ConfettiBurst intensity={confettiIntensity} emojis={confettiEmojis} />
      <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Quiz Complete!</h2>
      <p className="text-8xl font-bold my-4">{score}<span className="text-4xl text-gray-400">%</span></p>
      <p className="text-lg text-gray-300 mb-6">{getPerformanceMessage()}</p>

      {showShareNudge && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="mb-2 flex items-center gap-2 rounded-2xl border border-gray-700/60 bg-gray-800/40 px-3 py-2 backdrop-blur"
        >
          <span className="hidden sm:inline text-sm text-gray-300">Challenge your friends</span>
          <div className="flex items-center gap-1.5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700/60 bg-gray-800/60 text-gray-200 hover:bg-gray-800"
              title="Share on WhatsApp"
            >
              <MessageCircle size={16} />
              <span className="sr-only">WhatsApp</span>
            </a>
            <a
              href={xHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700/60 bg-gray-800/60 text-gray-200 hover:bg-gray-800"
              title="Post on X"
            >
              <Twitter size={16} />
              <span className="sr-only">X</span>
            </a>
            <button
              onClick={copyLink}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700/60 bg-gray-800/60 text-gray-200 hover:bg-gray-800"
              title={copied ? 'Copied!' : 'Copy link'}
            >
              {copied ? <Copy size={16} /> : <LinkIcon size={16} />}
              <span className="sr-only">Copy Link</span>
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-purple-700/40 bg-purple-600/30 text-purple-200 hover:bg-purple-600/40"
              title="More ways to share"
            >
              <Share2 size={16} />
              <span className="sr-only">More</span>
            </button>
          </div>
          <button
            onClick={() => setShowShareNudge(false)}
            className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-gray-800/70"
            aria-label="Dismiss share suggestions"
          >
            <CloseIcon size={14} />
          </button>
        </motion.div>
      )}



      <div className="flex flex-col items-center gap-4 mt-8">
        <motion.button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-colors w-full max-w-xs"
          whileHover={{ scale: 1.05 }}
        >
          <Share2 size={18} />
          Share Your Score
        </motion.button>
                <motion.button
          onClick={onRestart}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
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

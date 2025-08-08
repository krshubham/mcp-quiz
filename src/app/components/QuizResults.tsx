"use client";
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Answer, Question } from '@/app/types';
import { Check, X, Share2, Repeat } from 'lucide-react';
import ShareSheet from './ShareSheet';
import ConfettiBurst from './ConfettiBurst';

interface QuizResultsProps {
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ answers, questions, onRestart }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
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

  // Treat mobile differently: use native share only on mobile; desktop always uses our ShareSheet
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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

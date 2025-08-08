import { motion } from 'framer-motion';

interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;

  return (
        <div className="w-full max-w-2xl h-1 bg-gray-700 rounded-full">
      <motion.div
        className="h-1 bg-purple-600 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default QuizProgress;

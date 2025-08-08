import { motion } from 'framer-motion';

interface QuizWelcomeProps {
  onStart: () => void;
}

const QuizWelcome: React.FC<QuizWelcomeProps> = ({ onStart }) => {
  return (
    <div className="text-center">
      <motion.h1
        className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        CanYouMCP?
      </motion.h1>
      <motion.p
        className="text-lg text-gray-300 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Test your knowledge of the Model Context Protocol.
      </motion.p>
      <motion.button
        onClick={onStart}
        className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Quiz
      </motion.button>
    </div>
  );
};

export default QuizWelcome;

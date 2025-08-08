import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/app/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onSubmit: (selectedOption: number) => Promise<{ isCorrect: boolean; explanation: string }>;
  onNext: () => void;
  isSubmitting?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSubmit, onNext, isSubmitting = false }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

  const handleSelectOption = useCallback((index: number) => {
    if (!submitted && !isSubmitting) {
      setSelectedOption(index);
    }
  }, [submitted, isSubmitting]);

  const handleSubmit = useCallback(async () => {
    if (selectedOption === null || isSubmitting) return;
    setSubmitted(true);
    try {
      const res = await onSubmit(selectedOption);
      setResult(res);
    } catch (error) {
      // Reset submitted state if there's an error
      setSubmitted(false);
      console.error('Error submitting answer:', error);
    }
  }, [selectedOption, onSubmit, isSubmitting]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Enter key: submit if possible, or go to next if already submitted
      if (event.key === 'Enter' || event.key === 'NumpadEnter') {
        event.preventDefault();
        if (!submitted && selectedOption !== null && !isSubmitting) {
          handleSubmit();
        } else if (submitted && !isSubmitting) {
          onNext();
        }
        return;
      }

      // Numeric keys: select option if not submitted and not submitting
      if (submitted || isSubmitting) return;
      const key = parseInt(event.key);
      if (!isNaN(key) && key > 0 && key <= question.options.length) {
        handleSelectOption(key - 1);
      }
    },
    [submitted, selectedOption, question.options.length, handleSelectOption, onNext, handleSubmit, isSubmitting]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    setSelectedOption(null);
    setSubmitted(false);
    setResult(null);
  }, [question.id]);

  

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <p className="text-sm text-stone-400 mb-2">{question.category} - {question.difficulty}</p>
            <h2 className="text-3xl font-bold mb-8 text-stone-100">{question.question}</h2>
            <div className="space-y-3">
        {question.options.map((option, index) => (
                    <motion.button
            key={index}
            onClick={() => handleSelectOption(index)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 ${selectedOption === index ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-transparent border border-stone-600 hover:bg-stone-800/50'} ${(submitted || isSubmitting) ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={submitted || isSubmitting}
            whileHover={{ scale: (submitted || isSubmitting) ? 1 : 1.02 }}
          >
            <div className="flex items-center">
              <span className="border border-stone-500 rounded mr-4 w-6 h-6 flex items-center justify-center text-xs">{index + 1}</span>
              <span className="font-medium">{option}</span>
            </div>
            {submitted && result && selectedOption === index && (
              result.isCorrect ? <CheckCircle className="text-green-400" /> : <XCircle className="text-red-400" />
            )}
          </motion.button>
        ))}
      </div>
      {submitted && result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg ${result.isCorrect ? 'bg-emerald-900/50 border border-emerald-700/30' : 'bg-orange-900/50 border border-orange-700/30'}`}
        >
          <p className="font-bold">{result.isCorrect ? 'Correct!' : 'Incorrect'}</p>
          <p className="text-sm">{result.explanation}</p>
        </motion.div>
      )}
      <div className="mt-6 text-right">
        {submitted ? (
          <motion.button
            onClick={onNext}
            className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/25"
            whileHover={{ scale: 1.05 }}
          >
            Next
          </motion.button>
        ) : (
          <motion.button
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitting}
            className="bg-stone-600 text-white font-bold py-2 px-6 rounded-full hover:bg-stone-500 disabled:bg-stone-800 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            whileHover={{ scale: (selectedOption !== null && !isSubmitting) ? 1.05 : 1 }}
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;

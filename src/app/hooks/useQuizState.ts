import { useState, useEffect, useCallback } from 'react';
import { QuizState, Question, Answer } from '@/app/types';

const useQuizState = () => {
  const [state, setState] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('quizState');
      if (savedState) {
        setState(JSON.parse(savedState));
      } else {
        fetch('/api/quiz/questions')
          .then((res) => res.json())
          .then((questions: Question[]) => {
            const newState: QuizState = {
              questions,
              answers: [],
              currentQuestionIndex: 0,
              quizCompleted: false,
            };
            setState(newState);
            localStorage.setItem('quizState', JSON.stringify(newState));
          })
          .catch(() => setError('Failed to fetch questions.'));
      }
    } catch (e) {
      setError('Failed to initialize quiz.');
      console.error(e);
    }
    setLoading(false);
  }, []);

  const updateState = (newState: QuizState) => {
    setState(newState);
    localStorage.setItem('quizState', JSON.stringify(newState));
  };

  const submitAnswer = useCallback(
    async (questionId: number, selectedOption: number) => {
      if (!state || state.quizCompleted || submitting) return;

      setSubmitting(true);
      try {
        const res = await fetch('/api/quiz/check-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, selectedOption }),
        });

        const result = await res.json();

        const newAnswer: Answer = {
          questionId,
          selectedOption,
          isCorrect: result.isCorrect,
        };

        const newState: QuizState = {
          ...state,
          answers: [...state.answers, newAnswer],
        };

        updateState(newState);
        return result;
      } catch (error) {
        console.error('Failed to submit answer:', error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [state, submitting]
  );

  const nextQuestion = useCallback(() => {
    if (!state) return;

    if (state.currentQuestionIndex < state.questions.length - 1) {
      const newState = {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
      updateState(newState);
    } else {
      const newState = { ...state, quizCompleted: true };
      updateState(newState);
    }
  }, [state]);

  const resetQuiz = useCallback(async () => {
    setLoading(true);
    localStorage.removeItem('quizState');
    try {
      const res = await fetch('/api/quiz/questions');
      const questions: Question[] = await res.json();
      const newState: QuizState = {
        questions,
        answers: [],
        currentQuestionIndex: 0,
        quizCompleted: false,
      };
      updateState(newState);
    } catch (e) {
      setError('Failed to reset quiz.');
    }
    setLoading(false);
  }, []);

  return { state, loading, submitting, error, submitAnswer, nextQuestion, resetQuiz };
};

export default useQuizState;

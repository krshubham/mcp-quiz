'use client';

import { useState } from 'react';
import useQuizState from '@/app/hooks/useQuizState';
import QuizWelcome from './QuizWelcome';
import QuestionCard from './QuestionCard';
import QuizProgress from './QuizProgress';
import QuizResults from './QuizResults';
import { AnimatePresence } from 'framer-motion';

const Quiz = () => {
  const { state, loading, submitting, error, submitAnswer, nextQuestion, resetQuiz } = useQuizState();
  const [quizStarted, setQuizStarted] = useState(false);

  if (loading) {
    return <div className="text-stone-100">Loading Quiz...</div>;
  }

  if (error) {
    return <div className="text-orange-400">Error: {error}</div>;
  }

  if (!state) {
    return <div className="text-stone-100">Could not initialize quiz state.</div>;
  }

  const handleStart = () => {
    if (state.quizCompleted) {
      resetQuiz().then(() => setQuizStarted(true));
    } else {
      setQuizStarted(true);
    }
  };

  const currentQuestion = state.questions[state.currentQuestionIndex];

  return (
    <div className="w-full flex flex-col items-center gap-8 p-4">
      <AnimatePresence mode="wait">
        {!quizStarted ? (
          <QuizWelcome key="welcome" onStart={handleStart} />
        ) : state.quizCompleted ? (
          <QuizResults
            key="results"
            answers={state.answers}
            questions={state.questions}
            onRestart={() => {
              resetQuiz().then(() => setQuizStarted(true));
            }}
          />
        ) : (
          currentQuestion && (
            <div key="question-view" className="w-full flex flex-col items-center gap-8">
              <QuizProgress
                current={state.currentQuestionIndex}
                total={state.questions.length}
              />
              <QuestionCard
                question={currentQuestion}
                onSubmit={(selectedOption) => submitAnswer(currentQuestion.id, selectedOption)}
                onNext={nextQuestion}
                isSubmitting={submitting}
              />
            </div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;

import { NextResponse } from 'next/server';
import { quizQuestions } from '@/app/data/questions';
import { Question } from '@/app/types';

export async function GET() {
  try {
    const questions: Question[] = quizQuestions.map(
      ({ id, question, options, difficulty, category }) => ({
        id,
        question,
        options,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        category,
      })
    );
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

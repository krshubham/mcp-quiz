import { NextResponse } from 'next/server';
import { quizQuestions } from '@/app/data/questions';

export async function POST(req: Request) {
  try {
    const { questionId, selectedOption } = await req.json();

    const question = quizQuestions.find((q) => q.id === questionId);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = question.correctAnswer === selectedOption;

    return NextResponse.json({
      isCorrect,
      explanation: question.explanation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check answer' },
      { status: 500 }
    );
  }
}

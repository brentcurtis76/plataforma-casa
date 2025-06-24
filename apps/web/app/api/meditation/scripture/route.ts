import { NextRequest, NextResponse } from 'next/server';
import { findScripture } from '@/lib/ai/scripture-selector';

export async function POST(request: NextRequest) {
  try {
    const { emotion, context, language = 'es' } = await request.json();

    if (!emotion) {
      return NextResponse.json(
        { error: 'Emotion is required' },
        { status: 400 }
      );
    }

    const scripture = await findScripture(emotion, context, language);

    return NextResponse.json(scripture);
  } catch (error) {
    console.error('Error in scripture API:', error);
    return NextResponse.json(
      { error: 'Failed to generate scripture meditation' },
      { status: 500 }
    );
  }
}
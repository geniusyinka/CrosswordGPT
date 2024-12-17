import { NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { field, difficulty } = await request.json();

    const prompt = `Generate a crossword puzzle about ${field} with ${difficulty} difficulty level. 
    Create exactly 10 clues and answers that can fit in an 8x8 grid. The answers should be between 3-8 letters.
    Format as JSON: {
      "clues": [
        {
          "clue": "clue text",
          "answer": "answer",
          "direction": "across or down"
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const data = JSON.parse(content);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error generating crossword' },
      { status: 500 }
    );
  }
}
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.envOPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, header, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          header,
          message,
        },
        { status }
      );
    } else {
      console.error("unexpected error", error);
      throw error;
    }
  }
}

import 'dotenv/config';

import fs from 'fs';

function loadEnvVar(key) {
  const env = fs.readFileSync('.env', 'utf8');
  const match = env.match(new RegExp(`^${key}="?([^"\n]+)"?`, 'm'));
  return match ? match[1] : null;
}

const OPENAI_API_KEY = loadEnvVar('OPENAI_API_KEY');


async function callOpenAI({
  messages,
  model = "gpt-4.1",
  temperature = 0.7,
  maxTokens = 1024,
}) {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      max_output_tokens: maxTokens,
      input: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    let err;
    try {
      err = JSON.parse(errText);
    } catch {
      err = { error: { message: errText } };
    }

    throw new Error(
      `OpenAI API error ${res.status}: ${
        err?.error?.message || res.statusText
      }`
    );
  }

  const data = await res.json();

  const text =
    data?.output?.[0]?.content?.[0]?.text ||
    "No response text returned from OpenAI.";

  return text;
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: "Invalid JSON body.",
    };
  }

  const { messages, model, temperature, maxTokens } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return {
      statusCode: 400,
      body: "messages must be a non-empty array.",
    };
  }

  try {
    const reply = await callOpenAI({
      messages,
      model,
      temperature,
      maxTokens,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err.message || "Internal Server Error",
      }),
    };
  }
};
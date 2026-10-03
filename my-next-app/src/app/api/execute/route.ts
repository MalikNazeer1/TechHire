import { type NextRequest, NextResponse } from "next/server";

interface ExecuteRequestBody {
  language: string;
  code: string;
}

/** Response from TechHire Express executor (POST /api/execute) */
interface ExecutorResponse {
  success?: boolean;
  output?: string;
  error?: string;
  stderr?: string;
  time?: number;
}

function getExecutorExecuteUrl(): string | null {
  const full = process.env.CODE_EXECUTION_URL?.trim();
  if (full) {
    return full.replace(/\/$/, "");
  }
  const origin = process.env.CODE_EXECUTION_SERVICE_URL?.trim();
  if (origin) {
    return `${origin.replace(/\/$/, "")}/api/execute`;
  }
  return null;
}

export async function POST(request: NextRequest) {
  const executeUrl = getExecutorExecuteUrl();
  if (!executeUrl) {
    return NextResponse.json(
      {
        error:
          "Code executor URL is not configured. Set CODE_EXECUTION_URL (full URL to POST /api/execute) or CODE_EXECUTION_SERVICE_URL (origin only, e.g. http://127.0.0.1:3001) in .env.local.",
      },
      { status: 503 }
    );
  }

  try {
    const body: ExecuteRequestBody = await request.json();
    const { language, code } = body;

    if (!language || !code) {
      return NextResponse.json(
        { error: "Language and code are required" },
        { status: 400 }
      );
    }

    const timeLimit = Number(process.env.CODE_EXECUTION_TIME_LIMIT) || 5000;

    const response = await fetch(executeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
        stdin: "",
        timeLimit,
      }),
    });

    const rawText = await response.text();
    let data: ExecutorResponse;
    try {
      data = JSON.parse(rawText) as ExecutorResponse;
    } catch {
      return NextResponse.json(
        { error: `Executor returned invalid JSON: ${rawText.slice(0, 500)}` },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const msg =
        typeof data.error === "string"
          ? data.error
          : rawText || response.statusText;
      return NextResponse.json(
        { error: `Executor error: ${msg}` },
        { status: response.status >= 400 ? response.status : 502 }
      );
    }

    if (data.success === false) {
      const parts = [data.error, data.stderr].filter(Boolean);
      return NextResponse.json(
        { error: parts.join("\n") || "Execution failed" },
        { status: 400 }
      );
    }

    const output = data.output ?? "";
    return NextResponse.json({ output: String(output) });
  } catch (error) {
    console.error("Error executing code:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to reach code executor",
      },
      { status: 500 }
    );
  }
}

import { describe, expect, it } from "vitest";
import { mapJudge0StatusId } from "@/lib/execution/judge0-status";
import { Judge0Provider } from "@/lib/execution/judge0";
import { LANGUAGE_SEED } from "@/lib/languages/seed";
import { requireLanguageBySlug } from "@/lib/languages/lookup";

const python = requireLanguageBySlug(LANGUAGE_SEED, "python");

describe("mapJudge0StatusId", () => {
  it("maps Judge0 CE statuses onto the domain taxonomy", () => {
    expect(mapJudge0StatusId(3)).toBe("succeeded");
    expect(mapJudge0StatusId(5)).toBe("timeout");
    expect(mapJudge0StatusId(6)).toBe("compile_error");
    expect(mapJudge0StatusId(11)).toBe("runtime_error");
    expect(mapJudge0StatusId(13)).toBe("provider_unavailable");
    expect(mapJudge0StatusId(1)).toBe("provider_unavailable");
  });
});

describe("Judge0Provider", () => {
  it("posts to Judge0 with the language execution id", async () => {
    const fetches: { url: string; init: RequestInit }[] = [];
    const original = globalThis.fetch;
    globalThis.fetch = (async (url, init) => {
      fetches.push({ url: String(url), init: init ?? {} });
      return new Response(
        JSON.stringify({
          stdout: "7\n",
          stderr: null,
          compile_output: null,
          message: null,
          time: "0.02",
          exit_code: 0,
          status: { id: 3, description: "Accepted" },
        }),
        { status: 200 },
      );
    }) as typeof fetch;

    try {
      const provider = new Judge0Provider({
        baseUrl: "http://127.0.0.1:2358",
        apiKey: "secret-token",
      });
      const result = await provider.execute({
        language: python,
        source: "print(7)",
        stdin: "",
        timeoutMs: 5000,
      });

      expect(result.status).toBe("succeeded");
      expect(result.stdout).toBe("7\n");
      expect(result.runtimeMs).toBe(20);
      expect(fetches).toHaveLength(1);
      expect(fetches[0]?.url).toContain("/submissions?base64_encoded=false&wait=true");
      const headers = new Headers(fetches[0]?.init.headers);
      expect(headers.get("X-Auth-Token")).toBe("secret-token");
      const body = JSON.parse(String(fetches[0]?.init.body)) as {
        language_id: number;
        source_code: string;
      };
      expect(body.language_id).toBe(71);
      expect(body.source_code).toBe("print(7)");
    } finally {
      globalThis.fetch = original;
    }
  });

  it("returns provider_unavailable when Judge0 is down", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error("connect ECONNREFUSED");
    }) as typeof fetch;

    try {
      const provider = new Judge0Provider({
        baseUrl: "http://127.0.0.1:2358",
        apiKey: "secret-token",
      });
      const result = await provider.execute({
        language: python,
        source: "print(7)",
        stdin: "",
        timeoutMs: 5000,
      });
      expect(result.status).toBe("provider_unavailable");
      expect(result.stderr).toBe("");
    } finally {
      globalThis.fetch = original;
    }
  });
});

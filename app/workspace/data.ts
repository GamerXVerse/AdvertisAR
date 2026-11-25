export const platforms = ["Instagram", "LinkedIn", "Facebook", "Bluesky"] as const;
export const tones = ["Bold", "Friendly", "Professional", "Playful"] as const;
export type Platform = typeof platforms[number];
export type PublishingPlatform = Exclude<Platform, "Instagram">;
export type Brief = {
  company: string;
  description: string;
  objective: string;
  audience: string;
  channel: Platform;
  tone: typeof tones[number];
};
export type Content = { title: string; caption: string; headline: string; summary: string; cta: string; cta_url?: string; plan?: string };
export type Campaign = {
  id: string;
  brief: Brief;
  content: Content;
  status: "Draft" | "Published";
  shared: boolean;
  updated_at: string;
  external_id?: string;
};
export type Connection = { platform: PublishingPlatform; account: string; expires_at?: string };

export const emptyBrief: Brief = {
  company: "", description: "", objective: "", audience: "", channel: "Instagram", tone: "Bold",
};
export async function api<T>(path: string, method?: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new Error("The workspace service is unavailable. Please try again.");
  }
  if (response.status === 204) return undefined as T;
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = typeof result?.detail === "string" ? result.detail :
      Array.isArray(result?.detail) ? "Check the required fields and character limits." :
      "The workspace service is unavailable. Please try again.";
    throw new Error(detail);
  }
  return result as T;
}

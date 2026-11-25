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
export type Content = { title: string; caption: string; headline: string; summary: string; cta: string; cta_url?: string };
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
export const exampleBrief: Brief = {
  company: "Northline Running",
  description: "An outdoor running brand building gear for people who take the long way home.",
  objective: "Introduce our new trail collection and inspire runners to get outside.",
  audience: "Trail runners and weekend adventurers",
  channel: "Instagram",
  tone: "Bold",
};
export const exampleContent: Content = {
  title: "The Trail Collection",
  headline: "The long way looks good on you.",
  summary: "Meet the Trail Collection. Built for early starts, steep climbs, and the miles you take just because.",
  cta: "Explore the collection",
  caption: "The long way looks good on you. Meet the Trail Collection, built for early starts, steep climbs, and the miles you take just because.\n\n#NorthlineRunning #FindYourTrail #TrailRunning",
};

export function generateSample(brief: Brief): Content {
  if (JSON.stringify(brief) === JSON.stringify(exampleBrief)) return exampleContent;
  const introductions = {
    Bold: "Make your next move with", Friendly: "Get to know",
    Professional: "Introducing", Playful: "Say hello to",
  };
  const headline = `${introductions[brief.tone]} ${brief.company}`.slice(0, 110);
  const summary = brief.description.slice(0, 600);
  const caption = `${headline}.\n\n${summary}\n\n${brief.objective}`.slice(0, brief.channel === "Bluesky" ? 300 : 2200);
  return { title: `${brief.company} Campaign`, caption, headline, summary, cta: "Learn more" };
}

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

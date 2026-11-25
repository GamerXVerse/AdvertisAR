"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../workspace/data";

type PageContent = { company: string; title: string; headline: string; summary: string; cta: string; cta_url: string };

export default function PublicCampaign({ id }: { id: string }) {
  const [page, setPage] = useState<PageContent | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api<PageContent>(`/pages/${encodeURIComponent(id)}`).then(data => {
      if (active) setPage(data);
    }).catch((reason: Error) => {
      if (active) setError(reason.message);
    });
    return () => { active = false; };
  }, [id]);
  return <main className="public-wrap">
    <article className="public-campaign">
      {page ? <><p className="eyebrow">{page.company}</p><h1>{page.headline}</h1>
        <p>{page.summary}</p>
        {page.cta_url && <a className="button hero-button public-cta" href={page.cta_url}>{page.cta}</a>}</> :
        <><h1>{error ? "Page unavailable" : "Loading campaign…"}</h1>
          {error && <><p>{error}</p><Link href="/">AdvertisAR</Link></>}</>}
    </article>
  </main>;
}

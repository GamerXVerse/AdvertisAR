"use client";

import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines,
  Building2, Check, ChevronDown, ChevronRight, CircleHelp, Copy, Ellipsis,
  ExternalLink, Eye, Facebook, FileText, FolderOpen, Globe2, Heart, Instagram, Linkedin,
  Link2, LoaderCircle, LogIn, LogOut, Menu, MessageCircle, PenLine, Plus, Radio, Send,
  Target, Trash2, TriangleAlert, X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  api, Brief, Campaign, Connection, Content, emptyBrief, exampleBrief, exampleContent,
  generateSample, Platform, platforms, tones,
} from "./data";

type View = "studio" | "campaigns" | "channels";
type Modal = "signin" | "bluesky" | "facebook" | "help" | "publish" | "delete" | null;
type Notice = { text: string; error: boolean };
const nav = [
  { id: "studio", label: "Campaign Studio", icon: PenLine },
  { id: "campaigns", label: "My Campaigns", icon: FolderOpen },
  { id: "channels", label: "Connections", icon: Link2 },
] as const;
const channelIcons = { Instagram, LinkedIn: Linkedin, Facebook, Bluesky: Radio };

function Brand() {
  return <span className="brand">
    <span className="brand-mark"><AudioLines size={20} strokeWidth={2.5} /></span>
    Advertis<span className="brand-accent">AR</span>
  </span>;
}

function Hero({ onStart }: { onStart: () => void }) {
  const art = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = hero.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const parallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = Math.max(-36, Math.min(0, element.getBoundingClientRect().top * 0.12));
        art.current?.style.setProperty("--scroll-y", `${offset}px`);
      });
    };
    window.addEventListener("scroll", parallax, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", parallax); };
  }, []);
  return <section className="hero" ref={hero}
    onPointerMove={(event) => {
      if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      art.current?.style.setProperty("--pointer-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 12}px`);
      art.current?.style.setProperty("--pointer-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 10}px`);
    }}
    onPointerLeave={() => {
      art.current?.style.removeProperty("--pointer-x");
      art.current?.style.removeProperty("--pointer-y");
    }}>
    <div className="hero-copy">
      <span className="hero-kicker">FROM BRIEF TO CAMPAIGN</span>
      <h1>Make your next<br />campaign <em>take off.</em></h1>
      <p>Turn a simple brief into social content that sounds like your brand. Create, refine, and publish in one workspace.</p>
      <button className="button hero-button" onClick={onStart}>Start creating <ArrowDown size={15} /></button>
    </div>
    <div className="hero-art" ref={art} aria-hidden="true">
      <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
      <div className="hero-card">
        <div className="hero-card-top"><div className="mini-brand">N</div><div><strong>Northline Running</strong><small>Example campaign</small></div><Ellipsis size={19} /></div>
        <div className="hero-photo"><span>GO THE<br />LONG WAY.</span></div>
        <div className="hero-card-bottom"><Heart size={14}/><MessageCircle size={14}/><Send size={13}/><span /></div>
      </div>
      <span className="hero-tag"><Instagram size={23} /></span>
    </div>
  </section>;
}

function Preview({ brief, content, generated, readOnly, onEdit, onCopy }: {
  brief: Brief; content: Content; generated: boolean; readOnly: boolean;
  onEdit: (key: keyof Content, value: string) => void; onCopy: () => void;
}) {
  const [tab, setTab] = useState<"post" | "page">("post");
  const PlatformIcon = channelIcons[brief.channel];
  return <section className="panel preview-panel">
    <div className="panel-heading preview-heading">
      <span className="section-icon"><Eye size={19} /></span>
      <div><h2>Campaign preview</h2><p>See how your content comes together.</p></div>
    </div>
    <div className="preview-body">
      <div className="segments" role="group" aria-label="Preview format">
        <button className={tab === "post" ? "active" : ""} aria-pressed={tab === "post"} onClick={() => setTab("post")}><PlatformIcon size={15} /> Social post</button>
        <button className={tab === "page" ? "active" : ""} aria-pressed={tab === "page"} onClick={() => setTab("page")}><Globe2 size={15} /> Landing page</button>
      </div>
      {tab === "post" ? <div className="post-preview">
        <div className="post-heading"><div className="mini-brand">{(brief.company || "N")[0].toUpperCase()}</div><div><strong>{brief.company || "Northline Running"}</strong><small>{brief.channel}</small></div><Ellipsis size={18} /></div>
        {!generated && <div className="preview-photo"><span>GO THE<br />LONG WAY.</span></div>}
        {generated ? <label className="editor-label">Caption<textarea readOnly={readOnly} rows={6} maxLength={2200} value={content.caption} onChange={event => onEdit("caption", event.target.value)} /></label> :
          <p className="sample-caption"><strong>Northline Running</strong> {content.caption.split("\n")[0]}</p>}
      </div> : <div className="page-preview">
        <p className="eyebrow">{brief.company || "Northline Running"}</p>
        {generated ? <div className="page-fields">
          <label>Headline<input readOnly={readOnly} value={content.headline} maxLength={110} onChange={event => onEdit("headline", event.target.value)} /></label>
          <label>Body<textarea readOnly={readOnly} value={content.summary} maxLength={600} rows={3} onChange={event => onEdit("summary", event.target.value)} /></label>
          <label>Call to action<input readOnly={readOnly} value={content.cta} maxLength={50} onChange={event => onEdit("cta", event.target.value)} /></label>
          <label>Call-to-action link (optional)<input type="url" readOnly={readOnly} placeholder="https://your-company.com" value={content.cta_url || ""} maxLength={2000} onChange={event => onEdit("cta_url", event.target.value)} /></label>
        </div> : <><h3>{content.headline}</h3><p>{content.summary}</p><span className="landing-cta">{content.cta} <ArrowUpRight size={14}/></span></>}
      </div>}
      <div className="preview-foot"><span><i /> {generated ? (readOnly ? "Published campaign" : "Editable draft") : "Example campaign"}</span>{generated && <button className="text-button" onClick={onCopy}><Copy size={14}/> Copy caption</button>}</div>
    </div>
  </section>;
}

export default function Studio() {
  const [view, setView] = useState<View>("studio");
  const [brief, setBrief] = useState<Brief>(emptyBrief);
  const [content, setContent] = useState<Content | null>(null);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [email, setEmail] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [busy, setBusy] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [handle, setHandle] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [pageToken, setPageToken] = useState("");
  const [filter, setFilter] = useState("All campaigns");
  const [filterOpen, setFilterOpen] = useState(false);
  const [failedSave, setFailedSave] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);
  const activeModal = useRef<HTMLDialogElement>(null);
  const draftMode = !email;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("view") === "channels") setView("channels");
    if (params.get("connection") === "success") setNotice({ text: "LinkedIn connected.", error: false });
    if (params.get("connection") === "failed") setNotice({ text: "LinkedIn could not be connected. Try again.", error: true });
    try { setCampaigns(JSON.parse(localStorage.getItem("advertisar-demo") || "[]")); } catch { /* A clean demo can still open. */ }
    api<{ email: string }>("/auth/session").then(({ email }) => {
      setCampaigns([]);
      setEmail(email);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!email) return;
    let active = true;
    Promise.allSettled([api<Campaign[]>("/campaigns"), api<Connection[]>("/connections")]).then(([saved, social]) => {
      if (!active) return;
      if (saved.status === "fulfilled") setCampaigns(saved.value);
      if (social.status === "fulfilled") setConnections(social.value);
      if (saved.status === "rejected" || social.status === "rejected") {
        setNotice({ error: true, text: "Some workspace data could not be loaded. Refresh to try again." });
      }
    });
    return () => { active = false; };
  }, [email]);

  useEffect(() => {
    if (modal && !activeModal.current?.open) activeModal.current?.showModal();
    if (!modal && activeModal.current?.open) activeModal.current?.close();
  }, [modal]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6500);
    return () => clearTimeout(timer);
  }, [notice]);

  function notify(text: string, error = false) { setNotice({ text, error }); }
  function jumpToBrief() {
    requestAnimationFrame(() => briefRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  function navigate(next: View) {
    setView(next);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function newCampaign() {
    setBrief(emptyBrief);
    setContent(null);
    setSelected(null);
    setFailedSave(false);
    setView("studio");
    jumpToBrief();
  }
  function openCampaign(campaign: Campaign) {
    setSelected(campaign);
    setContent(campaign.content);
    setBrief(campaign.brief);
    setFailedSave(false);
    setView("studio");
    jumpToBrief();
  }
  async function run(name: string, action: () => Promise<void>) {
    setBusy(name);
    try { await action(); } catch (error) {
      notify(error instanceof Error ? error.message : "Something went wrong. Try again.", true);
    } finally { setBusy(""); }
  }
  function updateBrief<K extends keyof Brief>(key: K, value: Brief[K]) {
    setBrief(current => ({ ...current, [key]: value }));
  }
  function storeDemo(items: Campaign[]) {
    localStorage.setItem("advertisar-demo", JSON.stringify(items));
    setCampaigns(items);
  }
  function upsert(campaign: Campaign) {
    setSelected(campaign);
    setCampaigns(items => [campaign, ...items.filter(item => item.id !== campaign.id)]);
  }
  async function save(post: Content) {
    if (!post.title.trim() || !post.caption.trim() || !post.headline.trim() || !post.summary.trim() || !post.cta.trim()) {
      throw new Error("Fill in the campaign name, caption, and landing page copy before saving.");
    }
    if (post.cta_url) {
      let url: URL;
      try { url = new URL(post.cta_url); } catch { throw new Error("Enter a valid HTTPS call-to-action link."); }
      if (url.protocol !== "https:" || url.username) throw new Error("Enter a valid HTTPS call-to-action link.");
    }
    if (draftMode) {
      const campaign: Campaign = {
        id: selected?.id || crypto.randomUUID(), brief, content: post,
        status: "Draft", shared: false, updated_at: new Date().toISOString(),
      };
      storeDemo([campaign, ...campaigns.filter(item => item.id !== campaign.id)]);
      setSelected(campaign);
      setFailedSave(false);
      return campaign;
    }
    const campaign = await api<Campaign>(selected ? `/campaigns/${selected.id}` : "/campaigns",
      selected ? "PATCH" : "POST", { brief, content: post });
    upsert(campaign);
    setFailedSave(false);
    return campaign;
  }
  function generate(event: FormEvent) {
    event.preventDefault();
    void run("generate", async () => {
      const post = draftMode ? generateSample(brief) : await api<Content>("/generate", "POST", brief);
      setContent(post);
      setFailedSave(true);
      await save(post);
      notify(draftMode ? "Demo draft saved in this browser." : "Campaign generated and saved.");
    });
  }
  function submitSignIn(event: FormEvent) {
    event.preventDefault();
    void run("signin", async () => {
      if (!codeSent) {
        await api("/auth/request", "POST", { email: authEmail });
        setCodeSent(true);
        return;
      }
      const signed = await api<{ email: string }>("/auth/verify", "POST", { email: authEmail, code });
      setCampaigns([]);
      newCampaign();
      setEmail(signed.email);
      setModal(null);
      notify("You’re signed in.");
    });
  }
  function openSignIn() {
    setAuthEmail("");
    setCode("");
    setCodeSent(false);
    setModal("signin");
  }
  function signOut() {
    void run("logout", async () => {
      await api("/auth/logout", "POST");
      setEmail("");
      setConnections([]);
      setCampaigns(JSON.parse(localStorage.getItem("advertisar-demo") || "[]"));
      newCampaign();
      notify("Signed out.");
    });
  }
  function connect(platform: Platform) {
    if (draftMode) { openSignIn(); return; }
    if (platform === "Bluesky") { setHandle(""); setAppPassword(""); setModal("bluesky"); return; }
    if (platform === "Facebook") { setPageToken(""); setModal("facebook"); return; }
    void run("LinkedIn", async () => {
      const result = await api<{ url: string }>("/connections/linkedin", "POST");
      location.assign(result.url);
    });
  }
  function connectBluesky(event: FormEvent) {
    event.preventDefault();
    void run("bluesky", async () => {
      const connection = await api<Connection>("/connections/bluesky", "POST", { handle, password: appPassword });
      setConnections(items => [connection, ...items.filter(item => item.platform !== connection.platform)]);
      setAppPassword("");
      setModal(null);
      notify("Bluesky connected.");
    });
  }
  function connectFacebook(event: FormEvent) {
    event.preventDefault();
    void run("facebook", async () => {
      const connection = await api<Connection>("/connections/facebook", "POST", { token: pageToken });
      setConnections(items => [connection, ...items.filter(item => item.platform !== connection.platform)]);
      setPageToken("");
      setModal(null);
      notify("Facebook Page connected.");
    });
  }
  function copy(text: string, message: string) {
    void run("copy", async () => {
      await navigator.clipboard.writeText(text);
      notify(message);
    });
  }
  function setPageVisibility() {
    if (!selected || !content) return;
    if (draftMode) { openSignIn(); return; }
    void run("page", async () => {
      if (selected.status === "Draft") await save(content);
      const campaign = await api<Campaign>(`/campaigns/${selected.id}/page`, "PATCH", { shared: !selected.shared });
      upsert(campaign);
      notify(campaign.shared ? "Your landing page is live." : "Your landing page is now private.");
    });
  }
  function confirmPublish() {
    if (!selected || !content) return;
    void run("publish", async () => {
      await save(content);
      upsert(await api<Campaign>(`/campaigns/${selected.id}/publish`, "POST"));
      setModal(null);
      notify(`Published to ${brief.channel}.`);
    });
  }
  function confirmDelete() {
    if (!selected) return;
    void run("delete", async () => {
      if (draftMode) storeDemo(campaigns.filter(item => item.id !== selected.id));
      else {
        await api(`/campaigns/${selected.id}`, "DELETE");
        setCampaigns(items => items.filter(item => item.id !== selected.id));
      }
      setSelected(null);
      setBrief(emptyBrief);
      setContent(null);
      setModal(null);
      navigate("campaigns");
      notify("Draft deleted.");
    });
  }

  const readOnly = selected?.status === "Published";
  const directPublish = brief.channel !== "Instagram";
  const publicLink = selected?.shared ? `/p/${selected.id}` : "";
  const visibleCampaigns = campaigns.filter(item => filter === "All campaigns" || item.status === filter);
  const previewBrief = content ? brief : exampleBrief;
  const viewTitle = nav.find(item => item.id === view)?.label;

  return <div className="shell">
    {mobileNav && <button className="mobile-overlay" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
    <aside id="workspace-sidebar" className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <button className="brand-button" onClick={() => navigate("studio")}><Brand /></button>
      <div className="sidebar-area">
        <span className="sidebar-label">WORKSPACE</span>
        <nav aria-label="Workspace">
          {nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} aria-current={view === id ? "page" : undefined} className={view === id ? "nav-active" : ""}>
            <Icon size={18} /> {label} {view === id && <span className="nav-indicator" />}
          </button>)}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <button className="help-link" onClick={() => setModal("help")}><CircleHelp size={18}/> Help &amp; support <ArrowUpRight size={14}/></button>
        <div className="built-by"><span>BUILT BY</span><img src="/2alabz.png" alt="2ALabz Tech Consulting" width="113" height="38" /></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div className="breadcrumbs"><button className="icon-button menu-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation" aria-expanded={mobileNav} aria-controls="workspace-sidebar"><Menu size={20}/></button><span>Workspace</span><ChevronRight size={14}/><strong>{viewTitle}</strong><div className="mobile-brand"><Brand /></div></div>
        <div className="header-actions">
          {email ? <button className="button secondary signin" onClick={signOut} disabled={Boolean(busy)} title={email}><LogOut size={15} /> Sign out</button> :
            <button className="button secondary signin" onClick={openSignIn}>Sign in <ArrowUpRight size={14}/></button>}
          <button className="button primary" onClick={newCampaign}><Plus size={17}/> New campaign</button>
        </div>
      </header>

      <div className="main-content">
        {view === "studio" && <>
          <Hero onStart={jumpToBrief} />
          <div className="studio-intro" ref={briefRef}>
            <div><h2>Campaign Studio</h2><p>Start with a brief. Build something worth sharing.</p></div>
            {!draftMode && <span className="mode"><i /> Live workspace</span>}
          </div>
          <div className="studio-grid">
            <section className="panel form-panel">
              <div className="panel-heading"><span className="section-icon"><FileText size={19}/></span><div><h2>Campaign brief</h2><p>Tell us what you want to create.</p></div>
                <button className="text-button example-button" type="button" disabled={Boolean(busy) || readOnly}
                  onClick={() => { setBrief(exampleBrief); notify("Example brief filled in."); }}>Example</button>
              </div>
              <form className="brief-form" onSubmit={generate}>
                <fieldset disabled={Boolean(busy) || readOnly}>
                  <label htmlFor="company"><Building2 size={15}/> Company name <span>*</span></label>
                  <input id="company" required minLength={2} maxLength={100} placeholder="e.g. Northline Running" value={brief.company} onChange={event => updateBrief("company", event.target.value)} />
                  <label htmlFor="description">About your company <span>*</span></label>
                  <textarea id="description" required minLength={5} maxLength={1600} rows={2} placeholder="What do you do, and what makes your brand different?" value={brief.description} onChange={event => updateBrief("description", event.target.value)} />
                  <label htmlFor="objective"><Target size={15}/> Campaign goal <span>*</span></label>
                  <textarea id="objective" required minLength={5} maxLength={1200} rows={2} placeholder="e.g. Launch a product, drive sign-ups, or announce an event" value={brief.objective} onChange={event => updateBrief("objective", event.target.value)} />
                  <label htmlFor="audience">Target audience <small>Optional</small></label>
                  <input id="audience" maxLength={600} placeholder="Who are you trying to reach?" value={brief.audience} onChange={event => updateBrief("audience", event.target.value)} />
                  <div className="form-options">
                    <label htmlFor="channel">Social platform<div className="select-wrap"><select id="channel" value={brief.channel} onChange={event => updateBrief("channel", event.target.value as Platform)}>{platforms.map(platform => <option key={platform}>{platform}</option>)}</select><ChevronDown size={15}/></div></label>
                    <label htmlFor="tone">Brand voice<div className="select-wrap"><select id="tone" value={brief.tone} onChange={event => updateBrief("tone", event.target.value as Brief["tone"])}>{tones.map(tone => <option key={tone}>{tone}</option>)}</select><ChevronDown size={15}/></div></label>
                  </div>
                  {content && <label className="campaign-title">Campaign name<input required maxLength={120} value={content.title} onChange={event => setContent({ ...content, title: event.target.value })}/></label>}
                </fieldset>
                {!readOnly && <div className="form-bottom"><button type="submit" className="button primary generate" disabled={Boolean(busy)}>
                  {busy === "generate" && <LoaderCircle className="spin" size={17}/>}
                  {busy === "generate" ? "Generating…" : content ? "Regenerate campaign" : "Generate campaign"}
                </button></div>}
              </form>
            </section>
            <div className="preview-column">
              <Preview brief={previewBrief} content={content || exampleContent} generated={Boolean(content)} readOnly={Boolean(readOnly)}
                onEdit={(key, value) => { if (!readOnly) setContent(current => current && ({ ...current, [key]: value })); }}
                onCopy={() => content && copy(content.caption, "Caption copied.")} />
              {content && <section className="panel action-panel">
                <h3>Manage campaign</h3>
                {failedSave && <p>The current draft still needs to be saved.</p>}
                <div className="action-buttons">
                  {!readOnly && <button className="button secondary" disabled={Boolean(busy)} onClick={() => run("save", async () => { await save(content); notify("Draft saved."); })}><Check size={16}/> Save draft</button>}
                  {publicLink && <a className="button secondary" href={publicLink} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Open page</a>}
                  {(selected || !draftMode) && <button className="button secondary" disabled={Boolean(busy) || !selected} onClick={setPageVisibility}><Globe2 size={16}/> {publicLink ? "Unpublish page" : "Publish page"}</button>}
                  {!readOnly && directPublish && <button className="button primary" disabled={Boolean(busy) || !selected} onClick={() => draftMode ? openSignIn() : setModal("publish")}><Send size={15}/> Publish to {brief.channel}</button>}
                  {!readOnly && selected && <button className="button danger-quiet" disabled={Boolean(busy)} onClick={() => setModal("delete")}><Trash2 size={15}/> Delete draft</button>}
                </div>
                {!directPublish && <p>Copy your caption to post it on {brief.channel}.</p>}
                {readOnly && <p><Check size={15}/> Published to {brief.channel}</p>}
              </section>}
            </div>
          </div>
          <div className="bottom-link"><button className="text-button" onClick={() => navigate("campaigns")}>View my campaigns <ArrowRight size={16}/></button></div>
        </>}

        {view === "campaigns" && <section className="inner-view">
          <div className="view-banner"><span className="section-icon"><FolderOpen size={22}/></span><h1>My Campaigns</h1><p>Find drafts and published campaigns in one place.</p></div>
          <div className="list-controls"><h2>Campaigns <span>{campaigns.length}</span></h2><div className="filter-wrap"><button className="button secondary" onClick={() => setFilterOpen(!filterOpen)} aria-expanded={filterOpen}>{filter}<ChevronDown size={15}/></button>
            {filterOpen && <div className="filter-menu">{["All campaigns", "Draft", "Published"].map(item => <button key={item} onClick={() => { setFilter(item); setFilterOpen(false); }}>{item}</button>)}</div>}</div>
          </div>
          {visibleCampaigns.length ? <div className="campaign-list">{visibleCampaigns.map(campaign => {
            const Icon = channelIcons[campaign.brief.channel];
            return <button className="campaign-row" key={campaign.id} onClick={() => openCampaign(campaign)}>
              <span className="section-icon"><Icon size={20}/></span><span className="campaign-row-copy"><strong>{campaign.content.title}</strong><small>{campaign.brief.company} · {campaign.brief.channel}</small></span>
              <span className={`status-pill ${campaign.status === "Published" ? "published" : ""}`}>{campaign.status}</span><ChevronRight className="row-arrow" size={18}/>
            </button>;
          })}</div> : <div className="panel empty-state"><span className="section-icon"><FolderOpen size={24}/></span><h3>No campaigns here yet</h3><p>{filter === "All campaigns" ? "Create your first campaign in the studio." : "Choose another filter to see more campaigns."}</p>
            <button className="button primary" onClick={filter === "All campaigns" ? newCampaign : () => setFilter("All campaigns")}>
              {filter === "All campaigns" ? <><Plus size={17}/> New campaign</> : "Show all campaigns"}</button></div>}
        </section>}

        {view === "channels" && <section className="inner-view">
          <div className="view-banner"><span className="section-icon"><Link2 size={22}/></span><h1>Connections</h1><p>Connect publishing accounts and see which channels support caption export.</p></div>
          <div className="channel-grid">{platforms.map(platform => {
            const Icon = channelIcons[platform];
            const connection = connections.find(item => item.platform === platform);
            const supportsPublishing = platform !== "Instagram";
            return <article className="panel channel-card" key={platform}>
              <span className="section-icon"><Icon size={23}/></span>
              <h2>{platform}</h2>
              <p>{connection ? `Connected as ${connection.account}` : platform === "LinkedIn" ? "Publish to your LinkedIn member profile." :
                platform === "Bluesky" ? "Publish to your Bluesky account with an app password." :
                platform === "Facebook" ? "Publish to a Facebook Page using a Page access token." : "Generate channel-ready copy and publish it using the Instagram app."}</p>
              {supportsPublishing ? connection ? <button className="button secondary" disabled={Boolean(busy)} onClick={() => run(platform, async () => {
                await api(`/connections/${platform}`, "DELETE");
                setConnections(items => items.filter(item => item.platform !== platform));
                notify(`${platform} disconnected.`);
              })}>Disconnect</button> : <button className="button secondary" disabled={Boolean(busy)} onClick={() => connect(platform)}><Link2 size={15}/> Connect {platform}</button> : <span className="status-pill">Caption export</span>}
            </article>;
          })}</div>
        </section>}
        <footer><span>© {new Date().getFullYear()} AdvertisAR</span><button onClick={() => setModal("help")}>Help &amp; support <ArrowUpRight size={13}/></button></footer>
      </div>
    </main>

    <dialog aria-label={modal === "signin" ? "Sign in" : modal === "publish" ? "Publish campaign" : modal === "delete" ? "Delete draft" : modal === "help" ? "Workspace help" : "Connect social account"} ref={activeModal} onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}>
      {modal && <div className="dialog-inner">
        <button type="button" className="icon-button dialog-close" aria-label="Close dialog" onClick={() => setModal(null)}><X size={20}/></button>
        {modal === "signin" && <form onSubmit={submitSignIn}><span className="section-icon"><LogIn size={21}/></span><h2>{codeSent ? "Check your email" : "Sign in to AdvertisAR"}</h2>
          <p>{codeSent ? `If ${authEmail} has access, a six-digit sign-in code is on its way.` : "Use your invited email to access Groq generation, cloud drafts, and publishing."}</p>
          {codeSent ? <label>Sign-in code<input autoComplete="one-time-code" value={code} required pattern="[0-9]{6}" inputMode="numeric" onChange={event => setCode(event.target.value)} maxLength={6} placeholder="000000"/></label> :
            <label>Email address<input type="email" autoComplete="email" required value={authEmail} onChange={event => setAuthEmail(event.target.value)} placeholder="you@company.com"/></label>}
          <button className="button primary" disabled={Boolean(busy)}>{busy === "signin" ? <LoaderCircle className="spin" size={16}/> : null}{codeSent ? "Verify and sign in" : "Email me a code"}<ArrowRight size={16}/></button>
          {codeSent && <button className="text-button" type="button" onClick={() => { setCodeSent(false); setCode(""); }}><ArrowLeft size={14}/> Use a different email</button>}
        </form>}
        {modal === "bluesky" && <form onSubmit={connectBluesky}><span className="section-icon"><Radio size={21}/></span><h2>Connect Bluesky</h2><p>Create an app password in Bluesky under Settings → Privacy and security → App passwords.</p>
          <label>Handle<input required value={handle} onChange={event => setHandle(event.target.value)} placeholder="yourname.bsky.social"/></label>
          <label>App password<input type="password" required autoComplete="off" value={appPassword} onChange={event => setAppPassword(event.target.value)} placeholder="xxxx-xxxx-xxxx-xxxx"/></label>
          <button className="button primary" disabled={Boolean(busy)}>Connect account <ArrowRight size={16}/></button></form>}
        {modal === "facebook" && <form onSubmit={connectFacebook}><span className="section-icon"><Facebook size={21}/></span><h2>Connect a Facebook Page</h2><p>Enter a Page access token issued by the configured Meta app with permission to publish posts.</p>
          <label>Page access token<input type="password" required minLength={20} maxLength={3000} autoComplete="off" value={pageToken} onChange={event => setPageToken(event.target.value)}/></label>
          <button className="button primary" disabled={Boolean(busy)}>Connect Page <ArrowRight size={16}/></button></form>}
        {modal === "help" && <><span className="section-icon"><CircleHelp size={21}/></span><h2>Workspace help</h2><p>Use the example brief to try the studio. Demo drafts stay in this browser. Sign in with an invited email to generate with Groq, save to your account, or publish.</p><p>Connect a Facebook Page, LinkedIn profile, or Bluesky account to publish directly. Use Copy caption for Instagram.</p></>}
        {modal === "publish" && <><span className="section-icon"><Send size={21}/></span><h2>Publish to {brief.channel}?</h2><p>{connections.some(item => item.platform === brief.channel) ? "Your current caption will be posted publicly to your connected account." : `Connect a ${brief.channel} account before publishing this campaign.`}</p>
          {connections.some(item => item.platform === brief.channel) ? <button className="button primary" disabled={Boolean(busy)} onClick={confirmPublish}>{busy === "publish" ? "Publishing…" : "Publish now"}</button> :
            <button className="button primary" onClick={() => { setModal(null); navigate("channels"); }}>Go to connections <ArrowRight size={16}/></button>}</>}
        {modal === "delete" && <><span className="section-icon"><Trash2 size={21}/></span><h2>Delete this draft?</h2><p>{selected?.content.title} will be removed from your workspace.</p><button className="button danger" disabled={Boolean(busy)} onClick={confirmDelete}>Delete draft</button></>}
        {notice?.error && <p className="dialog-error" role="alert"><TriangleAlert size={16}/> {notice.text}</p>}
      </div>}
    </dialog>
    {notice && !(modal && notice.error) && <div className={`toast ${notice.error ? "toast-error" : ""}`} role={notice.error ? "alert" : "status"}>
      {notice.error ? <TriangleAlert size={17}/> : <Check size={17}/>}<span>{notice.text}</span><button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification"><X size={16}/></button>
    </div>}
  </div>;
}

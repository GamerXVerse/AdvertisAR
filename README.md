# AdvertisAR

AdvertisAR is a campaign workspace for small businesses. Its Next.js studio collects a brand brief, creates an editable marketing plan, social post, and landing page with Groq, and saves the campaign through FastAPI to Postgres. Campaign generation requires an invited account.

## Run locally

Install Node.js 24, Python 3.13, and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 to view the studio. Follow the backend setup below to sign in and generate campaigns.

For the full flow, copy `.env.example` to `.env.local` and fill in the variables below. Then run the following from the root, alongside the frontend.

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
python -m backend.main migrate
uvicorn backend.main:app --port 8000
```

Use `http://localhost:3000` to match the configured origin. For a local Postgres URL, set `LOCAL_EMAIL_CODES=1` to print one-time codes in the FastAPI terminal during development. Codes are delivered by Resend on Vercel.

## Deploy on Vercel

1. Import this project into Vercel and select the **Services** framework preset. The root `vercel.json` routes `/api/*` to FastAPI and the remaining paths to Next.js. [Vercel Services guide](https://vercel.com/kb/guide/vercel-services)
2. Connect a Neon Postgres database through the Vercel Marketplace and make its pooled `DATABASE_URL` available in the deployment environment. Use a separate Neon branch for previews that handle workspace data. [Neon integration](https://vercel.com/marketplace/neon)
3. Add the backend variables below for the deployment environment and redeploy after changes. Set `APP_ORIGIN` to the exact frontend URL where users sign in.
4. With that environment loaded in an authorized shell, apply the SQL schema and seed the developer allowlist using `python -m backend.main migrate`. Rerun this command when inviting new emails through `ALLOWED_EMAILS`. Removing an email and redeploying revokes its existing sessions.
5. Open `/api/health`, then sign in using an invited address and create a draft to verify the live flow.

| Variable | Value |
| --- | --- |
| `APP_ORIGIN` | Frontend origin, for example `https://advertisar.example.com` |
| `DATABASE_URL` | Pooled Neon URL with TLS enabled |
| `ALLOWED_EMAILS` | Comma-separated developer-managed email allowlist |
| `AUTH_SECRET` | Random secret for code hashing, generated with `openssl rand -hex 32` |
| `RESEND_API_KEY` | Server-side Resend key |
| `AUTH_FROM_EMAIL` | Verified Resend sender, for example `AdvertisAR <login@example.com>` |
| `GROQ_API_KEY` | GroqCloud API key |
| `GROQ_MODEL` | Optional JSON-mode model override. Defaults to `qwen/qwen3.8-27b` |
| `TOKEN_ENCRYPTION_KEY` | Fernet key for social credentials, generated with `python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'` |
| `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` | Required for the LinkedIn connection |
| `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` | Required for Facebook Page token verification |

## Publishing

- LinkedIn uses OAuth for member profiles. Enable **Sign In with LinkedIn using OpenID Connect** and **Share on LinkedIn**. Register `<APP_ORIGIN>/api/connections/linkedin/callback` as a redirect URL. [LinkedIn sharing](https://learn.microsoft.com/linkedin/consumer/integrations/self-serve/share-on-linkedin)
- Facebook uses a Page access token issued by your configured Meta app. The Page administrator needs the required Page access and a token with `pages_manage_posts` and `pages_read_engagement`. The Meta app needs the relevant permissions for its audience. [Meta Pages API](https://developers.facebook.com/docs/pages-api/posts)
- Bluesky supports accounts on `bsky.social`. Create an app password in Bluesky and enter it in **Connections**. [Bluesky posting guide](https://docs.bsky.app/docs/tutorials/creating-a-post)
- Instagram supports caption export for manual posting.

Landing pages become public when the owner selects **Publish page**. Add an optional HTTPS link to make the call-to-action button clickable. Social publishing requires a separate confirmation and sends the saved caption to the selected connected account.

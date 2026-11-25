CREATE TABLE IF NOT EXISTS members (
  email text PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS login_challenges (
  email text PRIMARY KEY REFERENCES members(email),
  code_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  email text NOT NULL REFERENCES members(email),
  expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY,
  owner text NOT NULL REFERENCES members(email),
  brief jsonb NOT NULL,
  content jsonb NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  shared boolean NOT NULL DEFAULT false,
  external_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaigns_owner_updated ON campaigns (owner, updated_at DESC);
CREATE TABLE IF NOT EXISTS social_connections (
  owner text NOT NULL REFERENCES members(email),
  platform text NOT NULL,
  account text NOT NULL,
  secret text NOT NULL,
  expires_at timestamptz,
  PRIMARY KEY (owner, platform)
);

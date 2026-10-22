-- Anti-abuse counters only. No name, email, message or raw IP is stored.
CREATE TABLE IF NOT EXISTS contact_rate_limits (
  key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  requests INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (key, window_start)
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS contact_rate_limits_expiry ON contact_rate_limits(window_start);

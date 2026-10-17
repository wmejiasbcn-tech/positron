#!/usr/bin/env node
/**
 * Build-time database migrator: runs `prisma migrate deploy` against the
 * project's Postgres using a DIRECT (non-pooled) connection when available.
 *
 * - Never prints connection strings, hosts or credentials (output is redacted).
 * - No database env configured -> skip (exit 0).
 * - Migration failure -> loud warning but exit 0, so a DB outage cannot turn the
 *   daily deploy red; /api/db/status (authenticated) reports the live state.
 *   Set POSITRON_MIGRATE_STRICT=1 to make failures break the build.
 */
import { spawnSync } from 'node:child_process';

const CANDIDATES = ['DATABASE_URL_UNPOOLED', 'POSTGRES_URL_NON_POOLING', 'DATABASE_URL'];
const present = CANDIDATES.filter((k) => (process.env[k] || '').trim() !== '');
console.log(`[migrate] DB env present: ${CANDIDATES.map((k) => `${k}=${present.includes(k) ? 'yes' : 'no'}`).join(', ')}`);

if (present.length === 0) {
  console.log('[migrate] no database URL configured — skipping.');
  process.exit(0);
}

const source = present[0];
const redact = (s) =>
  String(s || '')
    .replace(/postgres(ql)?:\/\/[^\s"'`]+/gi, '<redacted-url>')
    .replace(/[A-Za-z0-9.-]+\.(neon\.tech|supabase\.(co|com)|vercel-storage\.com|aws\.neon\.build)(:\d+)?/gi, '<redacted-host>')
    .replace(/(password|user(name)?)=[^&\s]+/gi, '$1=<redacted>')
    .replace(/(\bat\s+[`"])[^`"]+([`"])/gi, '$1<redacted-host>$2');

// Migrations that are fully idempotent (only CREATE ... IF NOT EXISTS) and may be
// safely marked rolled-back and re-applied if a previous attempt failed (P3009).
const SAFE_TO_RETRY = ['0001_init'];

const env = { ...process.env, DATABASE_URL: process.env[source] };
const prisma = (args) => {
  const r = spawnSync('npx', ['prisma', ...args], { env, encoding: 'utf8' });
  const text = redact(`${r.stdout || ''}\n${r.stderr || ''}`).trim();
  if (text) console.log(text.split('\n').map((l) => `[migrate] ${l}`).join('\n'));
  return { status: r.status, out: text };
};

console.log(`[migrate] running prisma migrate deploy using ${source}`);
let res = prisma(['migrate', 'deploy']);
let out = res.out;
if (res.status !== 0 && /\bP3009\b/.test(out)) {
  const failed = SAFE_TO_RETRY.filter((m) => out.includes(m));
  for (const m of failed) {
    console.log(`[migrate] previous failed attempt of idempotent migration ${m} — marking rolled back and retrying`);
    prisma(['migrate', 'resolve', '--rolled-back', m]);
  }
  if (failed.length) {
    res = prisma(['migrate', 'deploy']);
    out = res.out;
  }
}

if (res.status === 0) {
  console.log('[migrate] OK');
  process.exit(0);
}
const code = (out.match(/\bP\d{4}\b/) || ['unknown'])[0];
console.warn(`[migrate] WARNING: migrate deploy failed (exit ${res.status}, prisma code ${code}).`);
process.exit(process.env.POSITRON_MIGRATE_STRICT === '1' ? 1 : 0);

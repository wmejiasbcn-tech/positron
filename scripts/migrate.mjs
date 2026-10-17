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

console.log(`[migrate] running prisma migrate deploy using ${source}`);
const res = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
  env: { ...process.env, DATABASE_URL: process.env[source] },
  encoding: 'utf8',
});
const out = redact(`${res.stdout || ''}\n${res.stderr || ''}`).trim();
if (out) console.log(out.split('\n').map((l) => `[migrate] ${l}`).join('\n'));

if (res.status === 0) {
  console.log('[migrate] OK');
  process.exit(0);
}
const code = (out.match(/\bP\d{4}\b/) || ['unknown'])[0];
console.warn(`[migrate] WARNING: migrate deploy failed (exit ${res.status}, prisma code ${code}).`);
process.exit(process.env.POSITRON_MIGRATE_STRICT === '1' ? 1 : 0);

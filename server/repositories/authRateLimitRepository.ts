import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { authLoginAttempts } from "@shared/schema";

const MAX_FAILURES = 5;

export async function getLoginBlock(key: string): Promise<Date | null> {
  const [attempt] = await db
    .select({ blockedUntil: authLoginAttempts.blockedUntil })
    .from(authLoginAttempts)
    .where(eq(authLoginAttempts.key, key))
    .limit(1);

  return attempt?.blockedUntil && attempt.blockedUntil > new Date()
    ? attempt.blockedUntil
    : null;
}

export async function recordLoginFailure(key: string): Promise<Date | null> {
  const result = await db.execute(sql`
    INSERT INTO auth_login_attempts (
      key,
      failure_count,
      window_started_at,
      blocked_until,
      updated_at
    )
    VALUES (${key}, 1, NOW(), NULL, NOW())
    ON CONFLICT (key) DO UPDATE SET
      failure_count = CASE
        WHEN auth_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes'
          THEN 1
        ELSE auth_login_attempts.failure_count + 1
      END,
      window_started_at = CASE
        WHEN auth_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes'
          THEN NOW()
        ELSE auth_login_attempts.window_started_at
      END,
      blocked_until = CASE
        WHEN (
          CASE
            WHEN auth_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes'
              THEN 1
            ELSE auth_login_attempts.failure_count + 1
          END
        ) >= ${MAX_FAILURES}
          THEN NOW() + INTERVAL '15 minutes'
        ELSE NULL
      END,
      updated_at = NOW()
    RETURNING blocked_until
  `);

  const blockedUntil = result.rows[0]?.blocked_until;
  return blockedUntil ? new Date(String(blockedUntil)) : null;
}

export async function clearLoginFailures(key: string): Promise<void> {
  await db.delete(authLoginAttempts).where(eq(authLoginAttempts.key, key));
}
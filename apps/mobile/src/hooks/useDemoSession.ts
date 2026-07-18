import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Silent demo sign-in - a prototype stand-in for real auth.
 *
 * Every install shares one account (`demo_user`) whose credentials ship in the
 * bundle. It exists for exactly one reason: the `threads` insert policy is
 * `auth.uid() = author_id`, so a write needs *some* session. There is no login
 * screen and the user never sees this happen.
 *
 * Replace with per-user auth before any public release.
 */

export type DemoSession = { userId: string | null; error: string | null };

// One in-flight sign-in for the whole app. Both the root layout and the ask
// screen call `ensureDemoSession()`; they share this promise rather than each
// firing their own request. Empty-dep effects + this singleton are what keep
// re-renders from re-signing in.
let pending: Promise<DemoSession> | null = null;

async function signInAsDemoUser(): Promise<DemoSession> {
  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user) {
    return { userId: existing.session.user.id, error: null };
  }

  // Expo inlines EXPO_PUBLIC_* at build time, so these must be static reads.
  const email = process.env.EXPO_PUBLIC_DEMO_EMAIL;
  const password = process.env.EXPO_PUBLIC_DEMO_PASSWORD;
  if (!email || !password) {
    return {
      userId: null,
      error:
        "Demo account is not configured - set EXPO_PUBLIC_DEMO_EMAIL and EXPO_PUBLIC_DEMO_PASSWORD in apps/mobile/.env",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { userId: null, error: error.message };
  return { userId: data.session?.user.id ?? null, error: null };
}

/**
 * Resolves the demo session, signing in only if there isn't one already.
 * Safe to call any number of times. Never throws - failures come back as
 * `error` so callers can surface them without crashing the app.
 */
export function ensureDemoSession(): Promise<DemoSession> {
  pending ??= signInAsDemoUser().catch((err: unknown) => ({
    userId: null,
    error: err instanceof Error ? err.message : "Could not start demo session",
  }));

  return pending.then((result) => {
    // A failed attempt shouldn't be cached forever - clear it so the next
    // submit genuinely retries. Successes stay cached.
    if (result.userId === null) pending = null;
    return result;
  });
}

/**
 * Kicks off the sign-in and reports the user id once it lands. Purely
 * informational - nothing should block rendering or navigation on this.
 */
export function useDemoSession(): DemoSession {
  const [state, setState] = useState<DemoSession>({
    userId: null,
    error: null,
  });

  useEffect(() => {
    let active = true;
    ensureDemoSession().then((result) => {
      if (active) setState(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

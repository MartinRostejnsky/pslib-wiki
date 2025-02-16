"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode, useEffect } from "react";
import { Provider } from "jotai";
import { useAuth, useUser } from "@clerk/nextjs";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "always",
  });
}

export function CSPostHogProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && userId && user && !posthog._isIdentified()) {
      posthog.identify(userId, {
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username,
      });
    }

    if (!isSignedIn && posthog._isIdentified()) {
      posthog.reset();
    }
  }, [isSignedIn, user, userId]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export function JotaiProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}

"use client";
import { usePostHog } from "posthog-js/react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const posthog = usePostHog();
  posthog?.capture("$exception", {
    message: error.message,
    cause: error.cause,
    digest: error.digest,
  });

  return (
    <div>
      <h1>There was an error</h1>
    </div>
  );
}

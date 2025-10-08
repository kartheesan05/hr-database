// app/providers.js
"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import PostHogPageView from "./PostHogPageView";

export function PostHogProvider({ children }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_riPwEwyU7lDiadmxJvzgOWS64vT3BRC6zz69dhg4nQg", {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}

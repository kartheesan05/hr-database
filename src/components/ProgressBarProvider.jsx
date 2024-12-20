"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarProvider({ children }) {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        // color="#1e40af"
        color="#00ff00"
        options={{ showSpinner: false }}
        shallowRouting={true}
      />
    </>
  );
}

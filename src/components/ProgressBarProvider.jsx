"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarProvider({ children }) {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="#1e40af"
        options={{ showSpinner: false }}
        shallowRouting={true}
      />
    </>
  );
}

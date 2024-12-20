import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


export const metadata = {
  title: "Forese HR Database",
  description: "Forese HR Database used for keeping track of HR contacts",
};

import ProgressBarProvider from "@/components/ProgressBarProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
      </head>
      <body className="bg-blue-50">
        <ProgressBarProvider>
          {children}
          <Toaster richColors theme="light" />
        </ProgressBarProvider>
      </body>
    </html>
  );
}

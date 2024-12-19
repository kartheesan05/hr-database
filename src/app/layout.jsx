import "./globals.css";

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
        <ProgressBarProvider>{children}</ProgressBarProvider>
      </body>
    </html>
  );
}

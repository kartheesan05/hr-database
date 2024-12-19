import "./globals.css";

export const metadata = {
  title: "Forese HR Database",
  description: "Forese HR Database used for keeping track of HR contacts",
};


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/forese-logo.png" type="image/png" sizes="128x128" />
      </head>
      <body className="bg-blue-50">
        {children}
      </body>
    </html>
  );
}

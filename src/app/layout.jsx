import "./globals.css";

export const metadata = {
  title: "HR Database",
  description: "HR Database for Forese Task",
};


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

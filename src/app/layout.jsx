import "./globals.css";

export const metadata = {
  title: "HR Database",
  description: "HR Database for Forese Task",
};


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="bg-blue-50">
        {children}
      </body>
    </html>
  );
}

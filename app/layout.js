import "./globals.css";

export const metadata = {
  title: "A Surprise for Sowmya",
  description: "A little birthday surprise, made with love",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

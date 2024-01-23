import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "./context/AuthContext";
import ToasterProvider from "./context/ToasterContext";
import ActiveStatus from "./components/ActiveStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Messenger - Chat Now",
  description:
    "Messenger is an Application to chat with your friends in realtime. Never stay away from your loved ones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterProvider />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}

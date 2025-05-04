/*
 * Project: LMSS - Lumina
 * Author: Jayamuni Rashminda
 *
 * Description:
 * Lumina is a user-friendly and efficient learning management platform
 * designed for students and lecturers. It enables students to enroll in
 * courses, learn at their own pace, and engage in meaningful discussions.
 * Lecturers can effectively manage course content, monitor student progress,
 * and provide timely feedback. By incorporating intelligent tools and real-time
 * insights, Lumina enhances the overall learning experience, supports diverse
 * learning styles, and fosters collaboration within an academic environment.
 *
 * License: © Jayamuni Rashminda. All rights reserved.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina",
  description: "Learning Management and Support System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

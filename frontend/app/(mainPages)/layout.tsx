"use client";
import { useEffect } from "react";
import ContactPage from "../(auth)/(routes)/(pages)/contact";
import SubNavbar from "./(routes)/(pages)/subNavbar";
import { useUser, useClerk } from "@clerk/clerk-react";

const MainPagesLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (user === null) {
      signOut({ redirectUrl: "/" });
    }
  }, [user, signOut]);

  return (
    <div className="h-auto">
      <div className="h-[50px] fixed inset-y-0 w-full z-50">
        <SubNavbar />
      </div>

      <main className="pt-[70px] h-full">{children}</main>

      <section id="contact">
        <ContactPage />
      </section>
    </div>
  );
};

export default MainPagesLayout;

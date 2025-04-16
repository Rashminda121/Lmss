import ContactPage from "../(auth)/(routes)/(pages)/contact";
import SubNavbar from "./(routes)/(pages)/subNavbar";

const MainPagesLayout = ({ children }: { children: React.ReactNode }) => {
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

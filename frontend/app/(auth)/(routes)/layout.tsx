import MainNavbar from "./(pages)/mainNavbar";
import About from "./(pages)/about";
import Articles from "./(pages)/articles";
import Home from "./(pages)/home";
import ContactPage from "./(pages)/contact";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-auto">
      <div className="h-[50px] fixed inset-y-0 w-full z-50">
        <MainNavbar />
      </div>
      <section id="home">
        <Home />
      </section>
      <section
        id="signIn"
        className="flex items-center justify-center py-20 bg-gray-50"
        style={{
          backgroundImage: `url('/lines.png')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div>{children}</div>
      </section>
      <section id="articles">
        <Articles />
      </section>

      <section id="about">
        <About />
      </section>
      <section id="contact">
        <ContactPage />
      </section>
    </div>
  );
};

export default AuthLayout;

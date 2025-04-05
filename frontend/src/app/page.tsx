import Navbar from "@/components/navbar";
import Main from "@/components/main";
import Footer from "@/components/footer";
import About from "./about/page";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Main />
      <About />
      <Footer />
    </div>
  );
}

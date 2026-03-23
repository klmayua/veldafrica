import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Newsletter } from "@/components/sections/Newsletter";
import { Partners } from "@/components/sections/Partners";
import { Podcast } from "@/components/sections/Podcast";
import { Properties } from "@/components/sections/Properties";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Properties />
      <About />
      <Podcast />
      <Newsletter />
      <Partners />
      <Footer />
    </main>
  );
}

import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { BlogPreview } from "@/components/BlogPreview";
import { SocialLinks } from "@/components/SocialLinks";
import { ContactForm } from "@/components/ContactForm";
import { AudioPlayer } from "@/components/AudioPlayer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <BlogPreview />
      <SocialLinks />
      <ContactForm />
      <AudioPlayer />
    </main>
  );
};

export default Index;
import Hero from '@/components/Hero';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <HowItWorks />
      <Benefits />
      <FAQ />
    </div>
  );
}

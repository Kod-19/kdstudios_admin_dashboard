import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesOverview from '../components/ServicesOverview';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-(--dark-bg) text-(--text-color)">
      <Navbar />
      <main>
        <Hero />
        <ServicesOverview />
      </main>
    </div>
  );
}
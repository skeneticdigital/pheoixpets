import Hero from '../components/Hero';
import CategorySlider from '../components/CategorySlider';
import FeaturedProducts from '../components/FeaturedProducts';
import FAQ from '../components/home/FAQ';

export default function Home() {
  return (
    <main>
      <Hero />
      <CategorySlider />
      <FeaturedProducts />
      <FAQ />
    </main>
  );
}

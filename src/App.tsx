import useLenis from './hooks/useLenis';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySlider from './components/CategorySlider';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';

function App() {
  useLenis();

  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <CategorySlider />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}

export default App;

import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import CategorySection from '@/components/CategorySection';
import Bestsellers from '@/components/Bestsellers';
import BrandStory from '@/components/BrandStory';
import Testimonials from '@/components/Testimonials';
import InstagramGallery from '@/components/InstagramGallery';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategorySection name="Shirts" />
      <CategorySection name="Pants" />
      <CategorySection name="T-Shirts" />
      <CategorySection name="Hoodies" />
      <CategorySection name="Tracks" />
      <Bestsellers />
      <BrandStory />
      <Testimonials />
      <InstagramGallery />
    </>
  );
}

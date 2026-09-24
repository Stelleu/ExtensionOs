import type { SalonProfile } from "@/types/salon";
import { Header } from "./Header";
import { Marquee } from "./Marquee";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { Gallery } from "./Gallery";
import { Reviews } from "./Reviews";
import { InstagramStrip } from "./InstagramStrip";
import { FAQ } from "./FAQ";
import { Policies } from "./Policies";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingWidget } from "./BookingWidget";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { BackToTopButton } from "@/components/templates/BackToTopButton";

interface BoldAfroTemplateProps {
  salon: SalonProfile;
}

/**
 * Bold energy structure (distinct from luxury + soft-editorial):
 * typographic full-bleed hero → bento services → stacked gallery → about band
 * → marquee → review strip → booking → FAQ → policies → contact → Instagram
 */
export function BoldAfroTemplate({ salon }: BoldAfroTemplateProps) {
  return (
    <div className="overflow-x-clip bg-[#FFF8F0] font-[family-name:var(--font-nunito)] text-[#2C1810]">
      <Header salon={salon} />
      <main>
        <Hero salon={salon} />
        <Services salon={salon} />
        {salon.gallery.length > 0 && <Gallery salon={salon} />}
        <About salon={salon} />
        <Marquee />
        {salon.reviews.length > 0 && <Reviews salon={salon} />}
        <div className="relative bg-[#1B4332]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[#FFF8F0]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 100%)" }}
            aria-hidden
          />
          <div className="relative pt-8">
            {salon.id ? (
              <BookingForm salon={salon} />
            ) : (
              <BookingWidget salon={salon} />
            )}
          </div>
        </div>
        {salon.faqs.length > 0 && <FAQ salon={salon} />}
        <Policies salon={salon} />
        <Contact salon={salon} />
        <InstagramStrip salon={salon} />
      </main>
      <Footer salon={salon} />
      <BackToTopButton variant="bold" />
    </div>
  );
}

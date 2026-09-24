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

interface SoftEditorialTemplateProps {
  salon: SalonProfile;
}

/**
 * Magazine structure (distinct from luxury-black-gold):
 * split hero → menu services → pull-quote reviews → about → masonry gallery
 * → quiet marquee → booking → FAQ → policies → contact
 */
export function SoftEditorialTemplate({ salon }: SoftEditorialTemplateProps) {
  return (
    <div className="overflow-x-clip bg-[#FAF6F1] font-sans text-[#2C2825]">
      <Header salon={salon} />
      <main>
        <Hero salon={salon} />
        <Services salon={salon} />
        {salon.reviews.length > 0 && <Reviews salon={salon} />}
        <About salon={salon} />
        {salon.gallery.length > 0 && <Gallery salon={salon} />}
        <Marquee />
        <div className="border-t border-[#E5DDD4] bg-[#FAF6F1]">
          {salon.id ? (
            <BookingForm salon={salon} />
          ) : (
            <BookingWidget salon={salon} />
          )}
        </div>
        {salon.faqs.length > 0 && <FAQ salon={salon} />}
        <Policies salon={salon} />
        <Contact salon={salon} />
        <InstagramStrip salon={salon} />
      </main>
      <Footer salon={salon} />
      <BackToTopButton variant="soft" />
    </div>
  );
}

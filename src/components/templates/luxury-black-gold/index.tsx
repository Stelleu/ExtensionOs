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

interface LuxuryBlackGoldTemplateProps {
  salon: SalonProfile;
}

export function LuxuryBlackGoldTemplate({ salon }: LuxuryBlackGoldTemplateProps) {
  return (
    <div className="bg-[#FAF8F5] text-[#1A1614]">
      <Header salon={salon} />
      <main>
        <Hero salon={salon} />
        <Marquee />
        <About salon={salon} />
        <Services salon={salon} />
        {salon.gallery.length > 0 && <Gallery salon={salon} />}
        {salon.reviews.length > 0 && <Reviews salon={salon} />}
        <InstagramStrip salon={salon} />
        {salon.id ? <BookingForm salon={salon} /> : <BookingWidget salon={salon} />}
        {salon.faqs.length > 0 && <FAQ salon={salon} />}
        <Policies salon={salon} />
        <Contact salon={salon} />
      </main>
      <Footer salon={salon} />
    </div>
  );
}

import SetAnimation from "../components/Set/SetAnimation";
import { TicketCard } from "@/components/tickets/TicketCard";
import Sponsors from "@/components/Sponsors";
import { Hero } from "@/components/sections/home/Hero";
import Calendar from "@/components/sections/home/Calendar";
import GetInvolved from "@/components/sections/home/GetInvolved";
import SpeakersWrapper from "@/components/sections/home/SpeakersWrapper";
import { ContactUs } from "@/components/sections/home/ContactUs";
import HomePageWrapper from "@/components/HomePageWrapper";
import PacmanAnimation from "@/components/PacmanAnimation";

export default function Home() {
  return (
    <HomePageWrapper>
      <main className="dark:text-white">
        <div className="container mx-auto px-4">
          <Hero />
          <Calendar />
          <GetInvolved />
          <SpeakersWrapper />
          <Sponsors />
          <div id="set-animation">
            <SetAnimation />
          </div>
          <section className="mb-8 bg-dark-500 mt-4" id="tickets">
            <div className="container mx-auto">
              <h2 className="mb-8 text-3xl font-bold text-center">
                Grab a ticket!
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 pb-20">
                <TicketCard ticketTypeId="npc"/>
                <TicketCard ticketTypeId="player"/>
                <TicketCard ticketTypeId="supporter"/>
              </div>
            </div>
          </section>
        </div>
        <PacmanAnimation />
        <div className="container mx-auto px-4">
          <ContactUs />
        </div>
      </main>
    </HomePageWrapper>
  );
}
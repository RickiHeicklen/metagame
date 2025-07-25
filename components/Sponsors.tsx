import { getSponsors } from '@/lib/content';
import PartnerCard from './PartnerCard';

export default async function Sponsors() {
  const sponsors = await getSponsors();
  
  const platinumSponsors = sponsors.filter((s) => s.tier === "platinum");
  const goldSponsors = sponsors.filter((s) => s.tier === "gold");
  const silverSponsors = sponsors.filter((s) => s.tier === "silver");

  return (
    <section className="mb-20 bg-dark-500 flex flex-col" id="sponsors">
      <div className="w-full flex flex-col items-center justify-center">
        <h2 className="mb-8 text-3xl font-bold">Sponsors</h2>
        
        {platinumSponsors.length > 0 && (
          <div className="w-full mb-16 flex flex-col items-center">
            <h3 className="text-2xl text-center font-bold mb-8 text-secondary-300">Platinum</h3>
            <div className="grid grid-cols-1 gap-8 max-w-2xl">
              {platinumSponsors
                .sort((a, b) => a.id - b.id)
                .map((sponsor) => (
                  <PartnerCard
                    key={sponsor.id}
                    imgClass="h-32 sm:h-40 lg:h-48 w-auto max-w-full object-contain"
                    partner={sponsor}
                  />
                ))}
            </div>
          </div>
        )}

        {goldSponsors.length > 0 && (
          <div className="w-full mb-12 flex flex-col items-center">
            <h3 className="text-2xl text-center font-bold mb-8 text-yellow-400">Gold</h3>
            <div className={`grid gap-12 ${
              goldSponsors.length === 1 
                ? 'grid-cols-1 max-w-3xl' 
                : 'grid-cols-1 md:grid-cols-2 max-w-4xl'
            }`}>
              {goldSponsors
                .sort((a, b) => a.id - b.id)
                .map((sponsor) => (
                  <PartnerCard
                    key={sponsor.id}
                    imgClass="h-48 w-full lg:w-auto lg:h-64 max-w-full object-contain"
                    partner={sponsor}
                  />
                ))}
            </div>
          </div>
        )}

        {silverSponsors.length > 0 && (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-2xl text-center font-bold mb-2 text-gray-400">Silver</h3>
            <div className={`grid md:gap-16 ${
              silverSponsors.length === 1 
                ? 'grid-cols-1 max-w-md' 
                : silverSponsors.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl'
            }`}>
              {silverSponsors
                .sort((a, b) => a.id - b.id)
                .map((sponsor) => (
                  <PartnerCard
                    key={sponsor.id}
                    imgClass="h-20 sm:h-24 md:h-28 lg:h-28 max-w-full object-contain"
                    partner={sponsor}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 
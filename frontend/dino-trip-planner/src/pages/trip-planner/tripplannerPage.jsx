import HeroSection from "./components/HeroSection";
import TravelInfoCard from "./components/TravelInfoCard";
import PreferenceSection from "./components/PreferenceSection.jsx";
import BudgetSection from "./components/BudgetSection";
import DestinationSearch from "./components/DestinationSearch";
import NextButton from "./components/NextButton";

function TripPlannerPage() {
  return (
   <div className="bg-gray-50 min-h-screen pb-12">
  <HeroSection />

  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-8">
    <div className="space-y-6">
      <TravelInfoCard />
      <PreferenceSection />
      <BudgetSection />
      <DestinationSearch />
      <div className="pt-4">
        <NextButton />
      </div>
    </div>
  </div>
</div>

  );
}

export default TripPlannerPage;

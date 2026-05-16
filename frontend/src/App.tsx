import { useRef } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { RecruitmentDisclaimerDialog } from "@/components/layout/RecruitmentDisclaimerDialog";
import { TravelWizard } from "@/wizard/TravelWizard";
import { CountriesProvider } from "@/hooks/use-countries";

function App() {
  const goHomeRef = useRef<() => void>(() => {});

  return (
    <CountriesProvider>
      <RecruitmentDisclaimerDialog />
      <div className="flex h-full min-h-0 flex-col">
        <AppHeader onHomeClick={() => goHomeRef.current()} />
        <main className="flex-1 p-4">
          <TravelWizard goHomeRef={goHomeRef} />
        </main>
      </div>
    </CountriesProvider>
  );
}

export default App;

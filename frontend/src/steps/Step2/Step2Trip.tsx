import { Card, CardContent } from "@/components/ui/card";
import { CountrySelector } from "./CountrySelector";
import { DeviceSelector } from "./DeviceSelector";
import { TripDaysSelector } from "./TripDaysSelector";

export function Step2Trip() {
  return (
    <section className="text-left">
      <header className="mb-5 text-center">
        <h2 className="text-2xl font-semibold md:text-xl">Tell us about your trip</h2>
        <p className="mt-2 text-base text-pretty text-muted-foreground md:text-sm">
          Choose your destinations, trip length, and who&apos;s coming along
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-col gap-6">
          <CountrySelector />
          <TripDaysSelector />
          <DeviceSelector />
        </CardContent>
      </Card>
    </section>
  );
}

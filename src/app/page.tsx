"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { IndiaMap } from "@/components/map/IndiaMap";
import { MapLegend } from "@/components/map/MapLegend";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { StateDetailDrawer } from "@/components/state-panel/StateDetailDrawer";
import { visitedStates as initialData } from "@/constants/visitedData";
import { StateVisitData } from "@/types/travel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatMonthYear } from "@/lib/utils";

export default function Home() {
  const [selectedState, setSelectedState] = useState<StateVisitData | null>(
    null,
  );
  const [showOnlyVisited, setShowOnlyVisited] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-8">
          {/* Header & Controls */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-headline font-bold text-foreground mb-3">
                Track Aadil's journeys <br />
                <span className="text-primary">across India</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Relive my memories from the Himalayas to the backwaters of
                Kerala. Visualise my travel progress and plan my next big Indian
                adventure.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border shadow-sm">
                <Switch
                  id="show-visited"
                  checked={showOnlyVisited}
                  onCheckedChange={setShowOnlyVisited}
                />
                <Label
                  htmlFor="show-visited"
                  className="text-sm font-medium cursor-pointer"
                >
                  Focus on visited states
                </Label>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <StatsOverview states={initialData} />

          {/* Map and Legend Section */}
          <section className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <IndiaMap
                visitedStates={initialData}
                onStateSelect={setSelectedState}
                showOnlyVisited={showOnlyVisited}
              />
            </div>

            {/* Sidebar List - desktop only preview */}
            <aside className="hidden lg:flex w-full lg:w-1/3 flex-col gap-6 h-full">
              <div className="bg-white p-6 rounded-2xl shadow-md border">
                <h3 className="text-lg font-headline font-bold text-primary mb-4">
                  Recent Destinations
                </h3>
                <div className="space-y-4">
                  {initialData
                    .filter((s) => s.visited && s.visitMonthYear)
                    .sort((a, b) =>
                      a.visitMonthYear! > b.visitMonthYear! ? -1 : 1,
                    )
                    .slice(0, 5)
                    .map((state) => (
                      <div
                        key={state.id}
                        className="group flex items-center gap-4 cursor-pointer hover:bg-muted/30 p-2 rounded-xl transition-colors"
                        onClick={() => setSelectedState(state)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {state.name.charAt(0)}
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {state.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatMonthYear(state.visitMonthYear)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
                <h3 className="text-emerald-700 font-headline font-bold mb-2">
                  Did you know?
                </h3>
                <p className="text-sm text-emerald-600/80 italic">
                  India has 28 states and 8 Union Territories, each with its own
                  unique culture, language, and cuisine. How many more pages of
                  Bharat will you read?
                </p>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="font-headline font-bold text-primary">
              BharatTravels
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BharatTravels. Explore the Incredible
            India.
          </p>
        </div>
      </footer>

      {/* State Details Panel */}
      <StateDetailDrawer
        state={selectedState}
        onClose={() => setSelectedState(null)}
      />
    </div>
  );
}

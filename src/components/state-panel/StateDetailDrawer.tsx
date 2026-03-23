import { StateVisitData } from "@/types/travel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Notebook, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatMonthYear } from "@/lib/utils";

interface StateDetailDrawerProps {
  state: StateVisitData | null;
  onClose: () => void;
}

export function StateDetailDrawer({ state, onClose }: StateDetailDrawerProps) {
  if (!state) return null;

  return (
    <Sheet open={!!state} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <Badge
              variant={state.visited ? "default" : "outline"}
              className={state.visited ? "bg-accent" : ""}
            >
              {state.visited ? "Visited" : "Not Visited Yet"}
            </Badge>
          </div>
          <SheetTitle className="text-3xl font-headline font-bold text-primary mt-2">
            {state.name}
          </SheetTitle>
          {state.visitMonthYear && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Visited in {formatMonthYear(state.visitMonthYear)}</span>
            </div>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-8">
            {state.visited && (
              <section>
                <div className="flex items-center gap-2 font-headline font-semibold text-foreground mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  Cities Explored
                </div>
                {state.cities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {state.cities.map((city) => (
                      <div
                        key={city.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50"
                      >
                        <span className="font-medium">{city.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No cities recorded for this state yet.
                  </p>
                )}
              </section>
            )}

            {state.notes && (
              <section>
                <div className="flex items-center gap-2 font-headline font-semibold text-foreground mb-4">
                  <Notebook className="w-5 h-5 text-primary" />
                  Travel Notes
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border text-sm text-muted-foreground leading-relaxed">
                  {state.notes}
                </div>
              </section>
            )}

            {!state.visited && (
              <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <h4 className="font-headline font-bold text-primary mb-2">
                  Want to visit?
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add {state.name} to your wishlist and plan your next big
                  adventure to the heart of India.
                </p>
                <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Plan Trip
                </button>
              </section>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

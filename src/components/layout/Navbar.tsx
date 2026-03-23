import { MapPin } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl text-white">
            <MapPin className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-headline font-bold tracking-tight text-primary">
            BharatTravels
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-muted-foreground hidden sm:block">
            Aadil's Travel Map of India
          </span>
        </div>
      </div>
    </nav>
  );
}

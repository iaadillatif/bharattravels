export interface City {
  name: string;
  visited: boolean;
  date?: string;
}

export interface StateVisitData {
  id: string; // ISO or similar identifier
  name: string;
  visited: boolean;
  cities: City[];
  visitMonthYear?: string; // Format: MM-YYYY (e.g., "07-2024")
  notes?: string;
}

export interface MapData {
  states: StateVisitData[];
}

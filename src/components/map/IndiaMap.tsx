"use client";

import { useState, useMemo, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { StateVisitData } from "@/types/travel";
import { cn } from "@/lib/utils";
import indiaGeoJsonRaw from "@/constants/india_state.geojson?raw";

interface IndiaMapProps {
  visitedStates: StateVisitData[];
  onStateSelect: (state: StateVisitData) => void;
  showOnlyVisited: boolean;
}

interface TooltipState {
  visible: boolean;
  name: string;
  x: number;
  y: number;
}

interface MapDimensions {
  width: number;
  height: number;
  scale: number;
  containerHeight: string;
  paddingTop: string;
}

// Map state names from GeoJSON to our state IDs
const STATE_NAME_MAP: Record<string, string> = {
  "Andaman and Nicobar": "AN",
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CT",
  Chandigarh: "CH",
  "Dadra and Nagar Haveli": "DD",
  "Daman and Diu": "DD",
  Delhi: "DL",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  Kerela: "KL",
  Ladakh: "LD",
  Lakshadweep: "LS",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OR",
  Puducherry: "PY",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TG",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UT",
  "West Bengal": "WB",
};

// Get responsive dimensions based on screen width
const getMapDimensions = (screenWidth: number): MapDimensions => {
  if (screenWidth < 480) {
    // Small mobile: < 480px (account for p-2 padding: 8px × 2)
    const mapWidth = Math.max(screenWidth - 16, 280);
    return {
      width: mapWidth,
      height: 350,
      scale: 450,
      containerHeight: "430px",
      paddingTop: "50px",
    };
  } else if (screenWidth < 640) {
    // Mobile: 480px - 640px (account for p-2 padding: 8px × 2)
    const mapWidth = Math.max(screenWidth - 16, 320);
    return {
      width: mapWidth,
      height: 400,
      scale: 500,
      containerHeight: "480px",
      paddingTop: "60px",
    };
  } else if (screenWidth < 1024) {
    // Tablet: 640px - 1024px (account for sm:p-4 padding: 16px × 2)
    const mapWidth = Math.max(screenWidth - 32, 400);
    return {
      width: mapWidth,
      height: 450,
      scale: 700,
      containerHeight: "540px",
      paddingTop: "70px",
    };
  } else {
    // Desktop: >= 1024px (UNCHANGED)
    return {
      width: 800,
      height: 550,
      scale: 850,
      containerHeight: "650px",
      paddingTop: "80px",
    };
  }
};

export function IndiaMap({
  visitedStates,
  onStateSelect,
  showOnlyVisited,
}: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    name: "",
    x: 0,
    y: 0,
  });
  // Initialize with mobile default (400px) to prevent hydration mismatch
  // Will be updated immediately in useLayoutEffect
  const [mapDimensions, setMapDimensions] = useState<MapDimensions>(
    getMapDimensions(400),
  );

  // Use useLayoutEffect to set correct dimensions BEFORE first paint
  // This prevents the hydration mismatch when loading directly on small screens
  useEffect(() => {
    // Set initial dimensions immediately
    if (typeof window !== "undefined") {
      setMapDimensions(getMapDimensions(window.innerWidth));
    }
  }, []);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setMapDimensions(getMapDimensions(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parse GeoJSON from raw import
  const indiaGeoJson = useMemo(() => {
    try {
      const parsed = JSON.parse(indiaGeoJsonRaw);
      return parsed;
    } catch (error) {
      console.error("Failed to parse GeoJSON:", error);
      return { type: "FeatureCollection", features: [] };
    }
  }, []);

  const getStateIdFromName = (geoName: string): string => {
    return STATE_NAME_MAP[geoName] || geoName.substring(0, 2).toUpperCase();
  };

  const getVisitData = (stateId: string) =>
    visitedStates.find((s) => s.id === `IN-${stateId}`);

  const handleMouseEnter = (event: React.MouseEvent, geo: any) => {
    const geoName = geo.properties.NAME_1;
    const stateId = getStateIdFromName(geoName);

    setHoveredState(stateId);
    setTooltip({
      visible: true,
      name: geoName,
      x: event.clientX + 10,
      y: event.clientY + 10,
    });
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
    setTooltip({ ...tooltip, visible: false });
  };

  const handleClick = (geo: any) => {
    const geoName = geo.properties.NAME_1;
    const stateId = getStateIdFromName(geoName);
    const visitData = getVisitData(stateId);

    if (visitData) {
      onStateSelect(visitData);
    }
  };

  return (
    <div className="w-full mx-auto p-2 sm:p-4 bg-white rounded-3xl shadow-xl border border-white overflow-hidden relative group">
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
        <h2 className="text-lg sm:text-xl font-headline font-bold text-primary">
          Map of India
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Click on a state to view details
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: mapDimensions.containerHeight,
          paddingTop: mapDimensions.paddingTop,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: mapDimensions.scale,
            center: [78.9629, 22.5],
          }}
          width={mapDimensions.width}
          height={mapDimensions.height}
        >
          <Geographies geography={indiaGeoJson}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const geoName = geo.properties.NAME_1;
                const stateId = getStateIdFromName(geoName);
                const visitData = getVisitData(stateId);
                const isVisited = visitData?.visited ?? false;
                const isHovered = hoveredState === stateId;

                const defaultStyle = {
                  default: {
                    fill: isVisited ? "#ff9800" : "#e0e0e0",
                    stroke: "#fff",
                    strokeWidth: 0.75,
                    outline: "none" as const,
                    cursor: "pointer" as const,
                    transition: "all 0.3s ease-in-out",
                  },
                  hover: {
                    fill: isVisited ? "#f57c00" : "#bdbdbd",
                    stroke: "#fff",
                    strokeWidth: 1,
                    outline: "none" as const,
                    cursor: "pointer" as const,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    transition: "all 0.3s ease-in-out",
                  },
                  pressed: {
                    fill: isVisited ? "#e65100" : "#9e9e9e",
                    stroke: "#fff",
                    strokeWidth: 1,
                    outline: "none" as const,
                    cursor: "pointer" as const,
                  },
                };

                if (showOnlyVisited && !isVisited) {
                  return null;
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={defaultStyle}
                    onMouseEnter={(e: React.MouseEvent) =>
                      handleMouseEnter(e, geo)
                    }
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(geo)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltip.visible && (
          <div
            style={{
              position: "fixed",
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              pointerEvents: "none",
              zIndex: 50,
            }}
            className="bg-slate-900 text-white px-2 py-1 rounded text-xs sm:text-sm shadow-lg"
          >
            {tooltip.name}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 sm:mt-4 px-2 sm:px-4 pb-2 sm:pb-4 flex flex-wrap gap-3 sm:gap-4 justify-center border-t border-gray-200 pt-3 sm:pt-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded"
            style={{ backgroundColor: "#ff9800" }}
          ></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Visited
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded"
            style={{ backgroundColor: "#e0e0e0" }}
          ></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Not Visited
          </span>
        </div>
      </div>
    </div>
  );
}

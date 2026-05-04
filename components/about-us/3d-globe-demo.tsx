"use client";
import { Globe3D, GlobeMarker } from "@/components/about-us/3d-globe";

const sampleMarkers: GlobeMarker[] = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "London",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Tokyo",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Paris",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "New Delhi",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Moscow",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Rio de Janeiro",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Shanghai",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Dubai",
  },
  {
    lat: -34.6037,
    lng: -58.3816,
    src: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Buenos Aires",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Singapore",
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Seoul",
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Los Angeles",
  },
  {
    lat: 52.52,
    lng: 13.405,
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Berlin",
  },
  {
    lat: 41.9028,
    lng: 12.4964,
    src: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Rome",
  },
  {
    lat: 19.4326,
    lng: -99.1332,
    src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Mexico City",
  },
  {
    lat: 59.3293,
    lng: 18.0686,
    src: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Stockholm",
  },
  {
    lat: 50.1109,
    lng: 8.6821,
    src: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Frankfurt",
  },
  {
    lat: 14.5995,
    lng: 120.9842,
    src: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Manila",
  },
  {
    lat: -1.2921,
    lng: 36.8219,
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Nairobi",
  },
  {
    lat: 41.0082,
    lng: 28.9784,
    src: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Istanbul",
  },
  {
    lat: 43.6532,
    lng: -79.3832,
    src: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Toronto",
  },
  {
    lat: 30.0444,
    lng: 31.2357,
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Cairo",
  },
  {
    lat: -26.2041,
    lng: 28.0473,
    src: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Johannesburg",
  },
  {
    lat: 13.7563,
    lng: 100.5018,
    src: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Bangkok",
  },
  {
    lat: 22.3193,
    lng: 114.1694,
    src: "https://images.unsplash.com/photo-1528892952291-009c663ce843?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Hong Kong",
  },
  {
    lat: 45.4642,
    lng: 9.19,
    src: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=256&h=256&fit=crop&crop=faces",
    label: "Milan",
  },
];

export default function Globe3DDemo() {
  return (
    <Globe3D
      className="h-full min-h-0"
      markers={sampleMarkers}
      config={{
        globeColor: "#102a46",
        showAtmosphere: false,
        atmosphereColor: "#4da6ff",
        atmosphereIntensity: 0.38,
        atmosphereBlur: 3,
        bumpScale: 2.4,
        autoRotateSpeed: 0.3,
        markerSize: 0.06,
        showWireframe: true,
        wireframeColor: "#60A5FA",
        ambientIntensity: 0.8,
        pointLightIntensity: 1.35,
        initialRotation: { x: -0.12, y: -0.65 },
      }}
      onMarkerClick={(marker) => {
        console.log("Clicked marker:", marker.label);
      }}
      onMarkerHover={(marker) => {
        if (marker) {
          console.log("Hovering:", marker.label);
        }
      }}
    />
  );
}

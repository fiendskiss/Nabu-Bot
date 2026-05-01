"use client";
import { Globe3D, GlobeMarker } from "@/components/about-us/3d-globe";

const sampleMarkers: GlobeMarker[] = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Tokyo",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Paris",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "New Delhi",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Moscow",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Rio de Janeiro",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Shanghai",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dubai",
  },
  {
    lat: -34.6037,
    lng: -58.3816,
    src: "https://assets.aceternity.com/avatars/11.webp",
    label: "Buenos Aires",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Seoul",
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    src: "https://assets.aceternity.com/avatars/14.webp",
    label: "Los Angeles",
  },
  {
    lat: 52.52,
    lng: 13.405,
    src: "https://assets.aceternity.com/avatars/15.webp",
    label: "Berlin",
  },
  {
    lat: 41.9028,
    lng: 12.4964,
    src: "https://assets.aceternity.com/avatars/16.webp",
    label: "Rome",
  },
  {
    lat: 19.4326,
    lng: -99.1332,
    src: "https://assets.aceternity.com/avatars/17.webp",
    label: "Mexico City",
  },
  {
    lat: 59.3293,
    lng: 18.0686,
    src: "https://assets.aceternity.com/avatars/18.webp",
    label: "Stockholm",
  },
  {
    lat: 50.1109,
    lng: 8.6821,
    src: "https://assets.aceternity.com/avatars/19.webp",
    label: "Frankfurt",
  },
  {
    lat: 14.5995,
    lng: 120.9842,
    src: "https://assets.aceternity.com/avatars/20.webp",
    label: "Manila",
  },
  {
    lat: -1.2921,
    lng: 36.8219,
    src: "https://assets.aceternity.com/avatars/21.webp",
    label: "Nairobi",
  },
  {
    lat: 41.0082,
    lng: 28.9784,
    src: "https://assets.aceternity.com/avatars/22.webp",
    label: "Istanbul",
  },
  {
    lat: 43.6532,
    lng: -79.3832,
    src: "https://assets.aceternity.com/avatars/23.webp",
    label: "Toronto",
  },
  {
    lat: 30.0444,
    lng: 31.2357,
    src: "https://assets.aceternity.com/avatars/24.webp",
    label: "Cairo",
  },
  {
    lat: -26.2041,
    lng: 28.0473,
    src: "https://assets.aceternity.com/avatars/25.webp",
    label: "Johannesburg",
  },
  {
    lat: 13.7563,
    lng: 100.5018,
    src: "https://assets.aceternity.com/avatars/26.webp",
    label: "Bangkok",
  },
  {
    lat: 22.3193,
    lng: 114.1694,
    src: "https://assets.aceternity.com/avatars/27.webp",
    label: "Hong Kong",
  },
  {
    lat: 45.4642,
    lng: 9.19,
    src: "https://assets.aceternity.com/avatars/28.webp",
    label: "Milan",
  },
];

export default function Globe3DDemo() {
  return (
    <Globe3D
      className="h-full min-h-0"
      markers={sampleMarkers}
      config={{
        globeColor: "#0b1830",
        showAtmosphere: false,
        atmosphereColor: "#4da6ff",
        atmosphereIntensity: 0.5,
        bumpScale: 5,
        autoRotateSpeed: 0.3,
        markerSize: 0.06,
        showWireframe: false,
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

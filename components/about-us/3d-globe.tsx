"use client";
import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label?: string;
  size?: number;
}

export interface Globe3DConfig {
  /** Globe radius */
  radius?: number;
  /** Globe base color (used as fallback or tint) */
  globeColor?: string;
  /** URL to the Earth texture map */
  textureUrl?: string | null;
  /** URL to the bump/elevation map for terrain */
  bumpMapUrl?: string | null;
  /** Whether to show atmosphere glow */
  showAtmosphere?: boolean;
  /** Atmosphere color */
  atmosphereColor?: string;
  /** Atmosphere intensity */
  atmosphereIntensity?: number;
  /** Atmosphere blur/softness (higher = more diffuse, default 3) */
  atmosphereBlur?: number;
  /** Terrain bump scale (0 = flat, higher = more pronounced) */
  bumpScale?: number;
  /** Auto rotate speed (0 = disabled) */
  autoRotateSpeed?: number;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Min zoom distance */
  minDistance?: number;
  /** Max zoom distance */
  maxDistance?: number;
  /** Initial rotation */
  initialRotation?: { x: number; y: number };
  /** Marker default size */
  markerSize?: number;
  /** Show wireframe overlay */
  showWireframe?: boolean;
  /** Wireframe color */
  wireframeColor?: string;
  /** Ambient light intensity */
  ambientIntensity?: number;
  /** Point light intensity */
  pointLightIntensity?: number;
  /** Background color (null for transparent) */
  backgroundColor?: string | null;
}

interface Globe3DProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Globe configuration */
  config?: Globe3DConfig;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a marker is clicked */
  onMarkerClick?: (marker: GlobeMarker) => void;
  /** Callback when a marker is hovered */
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Marker Component (static - rotation handled by parent group)
// ============================================================================

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  defaultSize: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({
  marker,
  radius,
  defaultSize,
  onClick,
  onHover,
}: MarkerProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const surfaceAnchorRef = useRef<THREE.Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const surfaceWorldPosition = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);
  const frontFacingRef = useRef(true);

  // Surface position (where the line starts)
  const surfacePosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.001);
  }, [marker.lat, marker.lng, radius]);

  // Top of the line (where the image is) - positioned further out to prevent going inside globe
  const topPosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.18);
  }, [marker.lat, marker.lng, radius]);

  const lineHeight = topPosition.distanceTo(surfacePosition);

  const markerPixelSize = Math.max(14, (marker.size ?? defaultSize) * 220);

  // Calculate line center and orientation
  const { lineCenter, lineQuaternion } = useMemo(() => {
    const center = surfacePosition.clone().lerp(topPosition, 0.5);

    // Calculate rotation to align cylinder with the direction from surface to top
    const direction = topPosition.clone().sub(surfacePosition).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return { lineCenter: center, lineQuaternion: quaternion };
  }, [surfacePosition, topPosition]);

  useFrame(({ camera }) => {
    if (!groupRef.current || !surfaceAnchorRef.current || !htmlRef.current) {
      return;
    }

    surfaceAnchorRef.current.getWorldPosition(surfaceWorldPosition);
    normal.copy(surfaceWorldPosition).normalize();
    toCamera.copy(camera.position).sub(surfaceWorldPosition).normalize();

    const isFrontFacing = normal.dot(toCamera) > 0.12;

    if (frontFacingRef.current !== isFrontFacing) {
      frontFacingRef.current = isFrontFacing;
      groupRef.current.visible = isFrontFacing;
      htmlRef.current.style.opacity = isFrontFacing ? "1" : "0";
      htmlRef.current.style.visibility = isFrontFacing ? "visible" : "hidden";
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(marker);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover?.(marker);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover?.(null);
      }}
    >
      {/* Pin line from surface to image - properly oriented */}
      <mesh position={lineCenter} quaternion={lineQuaternion}>
        <cylinderGeometry args={[0.003, 0.003, lineHeight, 8]} />
        <meshBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Pin point at the surface */}
      <group ref={surfaceAnchorRef} position={surfacePosition}>
        <mesh quaternion={lineQuaternion}>
          <coneGeometry args={[0.015, 0.04, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Circular image at the top */}
      <group position={topPosition}>
        <Html
          center
          zIndexRange={[120, 0]}
          style={{ pointerEvents: "none", opacity: 1 }}
        >
          <div
            ref={htmlRef}
            className={cn(
              "flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-neutral-900/95 shadow-lg transition-transform duration-200",
            )}
            style={{
              width: `${markerPixelSize}px`,
              height: `${markerPixelSize}px`,
              pointerEvents: "none",
              opacity: 1,
              visibility: "visible",
              boxShadow:
                "0 0 0 2px rgba(255,255,255,0.06), 0 0 8px rgba(124,58,237,0.2), 0 0 14px rgba(96,165,250,0.12)",
            }}
          >
            {!imageFailed ? (
              <img
                src={marker.src}
                alt={marker.label || "Marker"}
                className="h-full w-full object-cover"
                draggable={false}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="bg-[linear-gradient(135deg,#60A5FA_0%,#A855F7_100%)] bg-clip-text text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-transparent">
                {(marker.label || "N").slice(0, 2)}
              </span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

function GlobeGrid({
  radius,
  color,
}: {
  radius: number;
  color: string;
}) {
  const latitudes = [-60, -30, 0, 30, 60];
  const longitudes = Array.from({ length: 12 }, (_, index) => index * 15);

  return (
    <group>
      {latitudes.map((latitude) => {
        const latitudeRadians = THREE.MathUtils.degToRad(latitude);
        const ringRadius = Math.cos(latitudeRadians) * radius * 1.006;
        const y = Math.sin(latitudeRadians) * radius * 1.006;

        return (
          <mesh
            key={`latitude-${latitude}`}
            position={[0, y, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[ringRadius, 0.003, 6, 128]} />
            <meshBasicMaterial color={color} transparent opacity={0.24} />
          </mesh>
        );
      })}

      {longitudes.map((longitude) => (
        <mesh
          key={`longitude-${longitude}`}
          rotation={[0, THREE.MathUtils.degToRad(longitude), 0]}
        >
          <torusGeometry args={[radius * 1.008, 0.0025, 6, 128]} />
          <meshBasicMaterial color={color} transparent opacity={0.14} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// Rotating Globe with Markers (all rotate together)
// ============================================================================

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
  textured?: boolean;
}

function TexturedGlobeMaterial({
  config,
  textureUrl,
  bumpMapUrl,
}: {
  config: Required<Globe3DConfig>;
  textureUrl: string;
  bumpMapUrl: string;
}) {
  const [earthTexture, bumpTexture] = useTexture([
    textureUrl,
    bumpMapUrl,
  ]);

  const configuredEarthTexture = useMemo(() => {
    const texture = earthTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    return texture;
  }, [earthTexture]);

  const configuredBumpTexture = useMemo(() => {
    const texture = bumpTexture.clone();
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [bumpTexture]);

  return (
    <meshStandardMaterial
      color="#ffffff"
      map={configuredEarthTexture}
      bumpMap={configuredBumpTexture}
      bumpScale={config.bumpScale * 0.05}
      roughness={0.72}
      metalness={0}
    />
  );
}

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
  textured = true,
}: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.set(
      config.initialRotation.x,
      config.initialRotation.y,
      0,
    );
  }, [config.initialRotation.x, config.initialRotation.y]);

  useFrame((_, delta) => {
    if (!groupRef.current || config.autoRotateSpeed <= 0) {
      return;
    }

    groupRef.current.rotation.y += delta * config.autoRotateSpeed * 0.25;
  });

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 64, 64);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  const shouldUseTexture =
    textured && Boolean(config.textureUrl && config.bumpMapUrl);

  return (
    <group ref={groupRef}>
      {/* Main globe mesh with Earth texture */}
      <mesh geometry={geometry}>
        {textured && config.textureUrl && config.bumpMapUrl ? (
          <TexturedGlobeMaterial
            config={config}
            textureUrl={config.textureUrl}
            bumpMapUrl={config.bumpMapUrl}
          />
        ) : (
          <meshStandardMaterial
            color={config.globeColor}
            emissive={config.globeColor}
            emissiveIntensity={0.08}
            roughness={0.88}
            metalness={0.08}
          />
        )}
      </mesh>

      {/* Wireframe overlay */}
      {!shouldUseTexture && config.showWireframe && (
        <>
          <mesh geometry={wireframeGeometry}>
            <meshBasicMaterial
              color={config.wireframeColor}
              wireframe
              transparent
              opacity={0.08}
            />
          </mesh>
          <GlobeGrid radius={config.radius} color={config.wireframeColor} />
        </>
      )}

      {/* Markers - now inside the rotating group */}
      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          defaultSize={config.markerSize}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Atmosphere Component (stays static - doesn't rotate)
// ============================================================================

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  // blur controls the fresnel exponent: lower = more diffuse, higher = sharper edge
  // We invert it so higher blur value = more diffuse (lower exponent)
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function Scene({ markers, config, onMarkerClick, onMarkerHover }: SceneProps) {
  const { camera } = useThree();

  // Set initial camera position (pulled back to accommodate markers)
  React.useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.5);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      {/* Rotating Globe with Markers */}
      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
        textured
      />

      {/* Atmosphere (static) */}
      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      {/* Controls */}
      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

function FallbackScene({
  markers,
  config,
  onMarkerClick,
  onMarkerHover,
}: SceneProps) {
  return (
    <>
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
        textured={false}
      />

      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

class GlobeErrorBoundary extends React.Component<
  {
    fallback: React.ReactNode;
    children: React.ReactNode;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-xs uppercase tracking-[0.3em] text-white/35">
        Loading globe
      </div>
    </Html>
  );
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  globeColor: "#0b1830",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: false,
  atmosphereColor: "#4da6ff",
  atmosphereIntensity: 0.5,
  atmosphereBlur: 2,
  bumpScale: 1,
  autoRotateSpeed: 0.3,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0, y: 0 },
  markerSize: 0.06,
  showWireframe: false,
  wireframeColor: "#4a9eff",
  ambientIntensity: 0.6,
  pointLightIntensity: 1.5,
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  return (
    <div className={cn("relative h-full min-h-[320px] w-full", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.5],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <GlobeErrorBoundary
          fallback={
            <FallbackScene
              markers={markers}
              config={mergedConfig}
              onMarkerClick={onMarkerClick}
              onMarkerHover={onMarkerHover}
            />
          }
        >
          <Suspense fallback={<LoadingFallback />}>
            <Scene
              markers={markers}
              config={mergedConfig}
              onMarkerClick={onMarkerClick}
              onMarkerHover={onMarkerHover}
            />
          </Suspense>
        </GlobeErrorBoundary>
      </Canvas>
    </div>
  );
}

export default Globe3D;

'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Center, 
  useGLTF, 
  ContactShadows, 
  Html, 
  useProgress 
} from '@react-three/drei';
import * as THREE from 'three';

// Premium glassmorphic loader overlay inside the WebGL canvas
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-bg/95 p-6 rounded-[4px] border border-cream/10 backdrop-blur-md min-w-[220px] text-center shadow-2xl">
        <div className="w-10 h-10 border-2 border-wood border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-mono text-cream-bright uppercase tracking-[0.2em] font-semibold">
          Loading Model: {progress.toFixed(0)}%
        </span>
        <div className="w-full bg-cream/10 h-1 rounded-full overflow-hidden mt-3 max-w-[150px]">
          <div 
            className="bg-wood h-full transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </Html>
  );
}

interface ModelProps {
  url: string;
  timberId: string;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

function ConfiguratorModel({ url, timberId, scaleX, scaleY, scaleZ }: ModelProps) {
  // Load GLTF / GLB model
  const { scene } = useGLTF(url);

  // Apply PBR texture parameters and colors based on timberId
  useEffect(() => {
    let woodColor = '#C99A63'; // Oak (Natural)
    let roughness = 0.65;
    let metalness = 0.15;

    if (timberId === 'walnut') {
      woodColor = '#50311D'; // American Walnut
      roughness = 0.55;
    } else if (timberId === 'teak') {
      woodColor = '#8A5229'; // Burmese Teak
      roughness = 0.6;
    } else if (timberId === 'espresso') {
      woodColor = '#2B1E16'; // Espresso Stained
      roughness = 0.7;
    } else if (timberId === 'charcoal') {
      woodColor = '#1C1917'; // Charcoal Oak
      roughness = 0.8;
      metalness = 0.05;
    } else if (timberId === 'maple') {
      woodColor = '#E3D2BC'; // Hard Maple
      roughness = 0.5;
    } else if (timberId === 'cherry') {
      woodColor = '#873B28'; // American Cherry
      roughness = 0.6;
    }

    const threeColor = new THREE.Color(woodColor);

    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        if (mesh.material) {
          // If the material is an array or single material, handle it
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          
          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              // Apply color tint to standard materials (preserves texture shadows/grain if any)
              mat.color.copy(threeColor);
              mat.roughness = roughness;
              mat.metalness = metalness;
              mat.needsUpdate = true;
            } else {
              // Upgrade basic materials to Standard for premium lighting
              const newMat = new THREE.MeshStandardMaterial({
                color: threeColor,
                roughness: roughness,
                metalness: metalness,
              });
              mesh.material = newMat;
            }
          });
        }
      }
    });
  }, [scene, timberId]);

  return (
    <primitive 
      object={scene} 
      scale={[scaleX, scaleY, scaleZ]} 
      castShadow 
      receiveShadow 
    />
  );
}

interface Configurator3DProps {
  modelUrl: string;
  timberId: string;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  showGrid?: boolean;
}

export default function Configurator3D({
  modelUrl,
  timberId,
  scaleX,
  scaleY,
  scaleZ,
  showGrid = true,
}: Configurator3DProps) {
  return (
    <div className="w-full h-full relative min-h-[400px]">
      <Canvas
        shadows
        camera={{ position: [3, 2.5, 4], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }} // preserveDrawingBuffer enables taking screenshots of the canvas
        className="w-full h-full bg-cream/[0.005]"
      >
        {/* Soft atmospheric lighting */}
        <ambientLight intensity={0.7} />
        
        {/* Main highlight light with shadow casting */}
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        
        {/* Fill lighting to prevent dark spots */}
        <directionalLight
          position={[-6, 4, -4]}
          intensity={0.6}
        />
        
        {/* Warm floor bounce light */}
        <directionalLight
          position={[0, -5, 0]}
          intensity={0.2}
          color="#C99A63"
        />

        <Suspense fallback={<Loader />}>
          <Center>
            <ConfiguratorModel
              url={modelUrl}
              timberId={timberId}
              scaleX={scaleX}
              scaleY={scaleY}
              scaleZ={scaleZ}
            />
          </Center>
          
          {/* Soft drop shadows beneath the object */}
          <ContactShadows
            position={[0, -0.9, 0]}
            opacity={0.65}
            scale={6}
            blur={1.8}
            far={3.5}
          />
        </Suspense>

        {/* 3D Placement Floor Grid */}
        {showGrid && (
          <gridHelper 
            args={[12, 12, '#C99A63', '#2A2520']} 
            position={[0, -0.9, 0]} 
          />
        )}

        {/* Orbit controls for rotation and zoom */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.06}
          minDistance={1.5}
          maxDistance={9}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the floor
        />
      </Canvas>
    </div>
  );
}

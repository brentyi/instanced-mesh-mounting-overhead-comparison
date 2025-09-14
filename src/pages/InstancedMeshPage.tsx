import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GLBLoader from "../GLBLoader";
import { Group, Mesh, InstancedMesh as InstancedMesh } from "three";
import { assetFiles } from "../assetFiles";
function InstancedMeshContent({ loadedMeshes }: { loadedMeshes: Group[] }) {
  // Log frame times
  const startTime = performance.now();
  const counter = useRef(0);
  useFrame(() => {
    if (counter.current > 10) return;
    counter.current++;
    console.log(
      `InstancedMesh: frame ${counter.current} after ${(performance.now() - startTime).toFixed(2)} ms`,
    );
  });

  // Create InstancedMesh2 instances
  const meshObjects: InstancedMesh[] = [];
  loadedMeshes.forEach((group) => {
    group.traverse((child) => {
      if (child instanceof Mesh) {
        const geometry = child.geometry;
        const material = child.material;

        // Create InstancedMesh2 with 1 instance for initial testing
        const instanceCount = 1;

        const instancedMesh2 = new InstancedMesh(
          geometry,
          material,
          instanceCount,
        );
        meshObjects.push(instancedMesh2);
      }
    });
  });

  return meshObjects.map((m, i) => <primitive key={i} object={m} />);
}

function InstancedMeshPage() {
  const [loadedMeshes, setLoadedMeshes] = useState<Group[]>([]);

  return (
    <div className="page-container">
      <h1 className="page-title">THREE.InstancedMesh</h1>
      <div className="canvas-container">
        <Canvas camera={{ position: [1, 1, 1], fov: 60 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <InstancedMeshContent loadedMeshes={loadedMeshes} />
          <OrbitControls enableDamping={false} />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
      <GLBLoader glbFiles={assetFiles} onMeshesLoaded={setLoadedMeshes} />
    </div>
  );
}

export default InstancedMeshPage;

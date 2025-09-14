import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GLBLoader from "../GLBLoader";
import { Group, Mesh } from "three";
import { assetFiles } from "../assetFiles";

function NonBatchedContent({ loadedMeshes }: { loadedMeshes: Group[] }) {
  // Log frame times
  const startTime = performance.now();
  const counter = useRef(0);
  useFrame(() => {
    if (counter.current > 10) return;
    counter.current++;
    console.log(
      `NonBatched: frame ${counter.current} after ${(performance.now() - startTime).toFixed(2)} ms`,
    );
  });

  // Create non-batched meshes
  const meshObjects: Mesh[] = [];
  loadedMeshes.forEach((group) => {
    group.traverse((child) => {
      if (child instanceof Mesh) {
        const geometry = child.geometry;
        const material = child.material;

        // Create a single instance for initial testing
        const instanceCount = 1;

        for (let i = 0; i < instanceCount; i++) {
          const clonedGeometry = geometry.clone();
          const clonedMaterial = Array.isArray(material)
            ? material.map((m) => m.clone())
            : material.clone();

          const mesh = new Mesh(clonedGeometry, clonedMaterial);

          // Place at origin
          mesh.position.set(0, 0, 0);
          mesh.rotation.set(0, 0, 0);
          mesh.scale.set(1, 1, 1);

          meshObjects.push(mesh);
        }
      }
    });
  });

  return meshObjects.map((mesh, i) => <primitive key={i} object={mesh} />);
}

function NonBatchedPage() {
  const [loadedMeshes, setLoadedMeshes] = useState<Group[]>([]);

  return (
    <div className="page-container">
      <h1 className="page-title">Non-batched Meshes</h1>
      <div className="canvas-container">
        <Canvas camera={{ position: [1, 1, 1], fov: 60 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <NonBatchedContent loadedMeshes={loadedMeshes} />
          <OrbitControls enableDamping={false} />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
      <GLBLoader glbFiles={assetFiles} onMeshesLoaded={setLoadedMeshes} />
    </div>
  );
}

export default NonBatchedPage;

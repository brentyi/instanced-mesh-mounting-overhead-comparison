import { useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GLBLoader from "../GLBLoader";
import { Group, Mesh } from "three";
import { InstancedMesh2 } from "@three.ez/instanced-mesh";
import { assetFiles } from "../assetFiles";

function InstancedMesh2Content({ loadedMeshes }: { loadedMeshes: Group[] }) {
  const { gl } = useThree();

  // Log frame times
  const startTime = performance.now();
  const counter = useRef(0);
  useFrame(() => {
    if (counter.current > 10) return;
    counter.current++;
    console.log(
      `InstancedMesh2: frame ${counter.current} after ${(performance.now() - startTime).toFixed(2)} ms`,
    );
  });

  // Create InstancedMesh2 instances
  const meshObjects: InstancedMesh2[] = [];
  loadedMeshes.forEach((group) => {
    group.traverse((child) => {
      if (child instanceof Mesh) {
        const geometry = child.geometry;
        const material = child.material;

        // Create InstancedMesh2 with 1 instance for initial testing
        const instanceCount = 1;

        const instancedMesh2 = new InstancedMesh2(geometry.clone(), material, {
          capacity: instanceCount,
          renderer: gl,
        });

        // Add instances with default transform at origin
        instancedMesh2.addInstances(instanceCount, () => {});

        meshObjects.push(instancedMesh2);
      }
    });
  });

  return meshObjects.map((m, i) => <primitive key={i} object={m} />);
}

function InstancedMesh2Page() {
  const [loadedMeshes, setLoadedMeshes] = useState<Group[]>([]);

  return (
    <div className="page-container">
      <h1 className="page-title">InstancedMesh2</h1>
      <div className="canvas-container">
        <Canvas camera={{ position: [1, 1, 1], fov: 60 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <InstancedMesh2Content loadedMeshes={loadedMeshes} />
          <OrbitControls enableDamping={false} />
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
      <GLBLoader glbFiles={assetFiles} onMeshesLoaded={setLoadedMeshes} />
    </div>
  );
}

export default InstancedMesh2Page;

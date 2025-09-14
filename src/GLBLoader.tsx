import { useEffect, useRef } from "react";
import { Group } from "three";
import { GLTFLoader } from "three-stdlib";

interface GLBLoaderProps {
  glbFiles: string[];
  onMeshesLoaded: (meshes: Group[]) => void;
  onLoadingChange?: (loading: boolean) => void;
}

function GLBLoader({
  glbFiles,
  onMeshesLoaded,
  onLoadingChange,
}: GLBLoaderProps) {
  const loaderRef = useRef(new GLTFLoader());
  const loadedMeshesRef = useRef<Group[]>([]);

  useEffect(() => {
    if (glbFiles.length === 0) {
      onMeshesLoaded([]);
      return;
    }

    if (onLoadingChange) onLoadingChange(true);
    loadedMeshesRef.current = [];

    const loadPromises = glbFiles.map((url) => {
      return new Promise<Group>((resolve, reject) => {
        loaderRef.current.load(
          url,
          (gltf) => {
            console.log(`Loaded GLB: ${url}`, gltf);
            resolve(gltf.scene);
          },
          (progress) => {
            console.log(
              `Loading ${url}: ${((progress.loaded / progress.total) * 100).toFixed(2)}%`,
            );
          },
          (error) => {
            console.error(`Error loading ${url}:`, error);
            reject(error);
          },
        );
      });
    });

    Promise.all(loadPromises)
      .then((meshes) => {
        loadedMeshesRef.current = meshes;
        onMeshesLoaded(meshes);
        if (onLoadingChange) onLoadingChange(false);
        console.log(`Successfully loaded ${meshes.length} GLB files`);
      })
      .catch((error) => {
        console.error("Error loading GLB files:", error);
        if (onLoadingChange) onLoadingChange(false);
      });

    return () => {
      // Cleanup loaded meshes on unmount
      loadedMeshesRef.current.forEach((mesh) => {
        mesh.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });
    };
  }, [glbFiles, onMeshesLoaded, onLoadingChange]);

  return null;
}

export default GLBLoader;

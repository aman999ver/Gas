import { Mesh, Object3D } from 'three';
import { ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: {
        ref?: React.RefObject<Mesh>;
        children?: ReactNode;
        position?: [number, number, number];
        rotation?: [number, number, number];
      };
      sphereGeometry: {
        args?: [radius?: number, widthSegments?: number, heightSegments?: number];
        attach?: string;
      };
      meshStandardMaterial: {
        color?: string | number;
        metalness?: number;
        roughness?: number;
        attach?: string;
      };
      ambientLight: {
        intensity?: number;
        children?: ReactNode;
      };
      pointLight: {
        position?: [number, number, number];
        intensity?: number;
        children?: ReactNode;
      };
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: JSX.IntrinsicElements['mesh'];
    sphereGeometry: JSX.IntrinsicElements['sphereGeometry'];
    meshStandardMaterial: JSX.IntrinsicElements['meshStandardMaterial'];
    ambientLight: JSX.IntrinsicElements['ambientLight'];
    pointLight: JSX.IntrinsicElements['pointLight'];
  }
}

export {}; 
import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import anPlatoform from '../assets/3d/rigged_sci-fi_lift_-_mobile_platform_-_elevator.glb';

const AnimatedPlatform = (props) => {
  const platRef = useRef();
  const { scene, animations } = useGLTF(anPlatoform);
  const { actions } = useAnimations(animations, platRef);
  const mixerRef = useRef(null);

  useEffect(() => {
    const demoAction = actions['Demo'];
    if (demoAction) {
      demoAction.clampWhenFinished = true;
      demoAction.play();
      demoAction.paused = true;
      mixerRef.current = new THREE.AnimationMixer(scene);
      mixerRef.current.clipAction(demoAction.getClip()).play();
      console.log('Demo animation found and ready to respond to scrolling');
    } else {
      console.warn('Demo animation not found in the GLB file');
    }
  }, [actions, scene]);

  useEffect(() => {
    const handleWheel = (event) => {
      if (!mixerRef.current) return;

      const deltaY = event.deltaY;
      const demoAction = actions['Demo'];
      if (demoAction) {
        const animationDuration = demoAction.getClip().duration;
        const newTime = demoAction.time + (deltaY / 1000) * animationDuration;
        
        demoAction.time = THREE.MathUtils.clamp(newTime, 0, animationDuration);
        demoAction.play();
      }
    };

    const container = platRef.current;
    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [actions]);

  return (
    <group ref={platRef} {...props} dispose={null} position={[-1, -2, 4]} scale={[0.3, 0.3, 0.3]}>
      <primitive object={scene} />
    </group>
  );
};

export default AnimatedPlatform;

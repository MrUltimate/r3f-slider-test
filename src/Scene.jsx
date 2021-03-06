import React, { useCallback, useEffect, useRef, useState } from "react";
import { Plane, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import "./materials/deformMaterial";
import "./materials/noiseMaterial";

import { useDrag, useScroll, useWheel } from "react-use-gesture";
import { useSpring, a } from "@react-spring/three";
import { useAspect, Text } from "@react-three/drei";

import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useStore = create(
  subscribeWithSelector((set) => ({
    intensity: 0,
  }))
);

function Pl({ map, ...props }) {
  const mat = useRef();
  useEffect(() => {
    useStore.subscribe(
      (state) => state.intensity,
      (i) => {
        mat.current.uniforms.intensity.value = i;
      }
    );
  }, []);

  const [, set] = useSpring(() => ({
    hover: 0,
    mouse: [0, 0],
    config: { mass: 5, friction: 40, tension: 200 },
    onChange: {
      hover: (val) => {
        mat.current.uniforms.hover.value = val;
      },
      mouse: (val) => {
        mat.current.uniforms.mouse.value = val;
      },
    },
  }));

  const handleMove = useCallback((e) => set({ mouse: e.uv }), [set]);
  const handlePointerOver = useCallback(() => set({ hover: 1 }), [set]);
  const handlePointerOut = useCallback(() => set({ hover: 0 }), [set]);

  return (
    <Plane
      args={[16, 9, 64, 32]}
      {...props}
      onPointerMove={handleMove}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <deformMaterial map={map} ref={mat} />
    </Plane>
  );
}

const clamp = (a, min, max) => Math.min(Math.max(a, min), max);

function Slider() {
  const ts = useTexture([
    "https://picsum.photos/seed/aegaeg/800/450",
    "https://picsum.photos/seed/geagaeda/800/450",
    "https://picsum.photos/seed/aqefaef/800/450",
    "https://picsum.photos/seed/4gfiepaf/800/450",
    "https://picsum.photos/seed/124picn/800/450",
    "https://picsum.photos/seed/12oi3/800/450",
  ]);

  const { viewport } = useThree();

  const [prevX, setPrevX] = useState(0);
  const [spring, set] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 5, friction: 100, tension: 800 },
    onChange: (position) => {
      const delta = prevX - position.value.position[0];
      // console.log("Delta", delta);
      // console.log("prevX", prevX);
      useStore.setState({
        intensity: delta,
      });

      setPrevX(position.value.position[0]);
    },
  }));

  const bind = useDrag(
    ({ offset: [x, y], vxvy: [vx, vy], down, ...props }) => {
      console.log("X:", x);
      set({
        position: [(x / viewport.width) * 2, 0, 0],
      });
    },
    {
      eventOptions: { pointer: true },
      bounds: {
        right: 0,
      },
    }
  );

  const noise = useRef();

  const scale = useAspect("cover", 16, 9);
  useFrame(({ clock }) => {
    noise.current.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <>
      {/* <Plane scale={scale} visible={true} /> */}
      <group {...bind()}>
        <a.group {...spring}>
          {ts.map((t, i) => (
            <Pl key={i} map={t} position-x={16 * i + i} />
          ))}
        </a.group>
      </group>
      <Plane args={[20, 12]} scale={scale} position-z={-10}>
        <noiseMaterial opacity={0.1} transparent ref={noise} />
      </Plane>
    </>
  );
}

export default Slider;

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Text } from "@react-three/drei";
// import Effects from "./Effects";
import Scene from "./Scene";

import "./style.css";

function App() {
  return (
    <Canvas shadowMap={true} colorManagement camera={{ position: [0, 0, 20], zoom: 1 }} concurrent>
      <color args={["#010101"]} attach="background" />
      <Suspense fallback="Loading">
        <Scene />
      </Suspense>
    </Canvas>
  );
}

export default App;

import React from "react";

const SceneLights = React.memo(() => (
  <>
    <ambientLight intensity={0.9} color="#ffffff" />
    <directionalLight position={[0, 10, 0]} intensity={1.1} castShadow={false} />
    <pointLight position={[0, 3, 0]} intensity={0.7} color="#ffffff" distance={10} />
  </>
));

export default SceneLights;

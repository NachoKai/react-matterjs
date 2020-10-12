import React from "react";
import styled from "styled-components";

import Scene from "./Scene";
import Catapult from "./components/Catapult";

const Container = styled.div``;

const App = () => {
  return (
    <Container>
      <Scene />
      {/* <Catapult /> */}
    </Container>
  );
};

export default App;

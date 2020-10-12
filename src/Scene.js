import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Matter from "matter-js";

const Container = styled.div``;

const Scene = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create({
      // the higher the value, the higher quality the simulation will be at the expense of performance
      positionIterations: 10, // default: 6
      velocityIterations: 10, // default: 4
    });

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 1600,
        height: 800,
        wireframes: false,
      },
    });

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 1600, y: 800 },
    });

    // balls
    const ball = Bodies.circle(0, 0, 30, { restitution: 0.5 });
    const square = Bodies.rectangle(900, 50, 40, 40, { restitution: 0.7 });

    World.add(engine.world, [
      // top wall
      Bodies.rectangle(0, 0, 4000, 50, { isStatic: true }),
      // bottom wall
      Bodies.rectangle(0, 800, 4000, 50, { isStatic: true }),
      // left wall
      Bodies.rectangle(0, 800, 50, 2000, { isStatic: true }),
      // center wall
      Bodies.rectangle(800, 0, 50, 2000, { isStatic: true }),
      // right wall
      Bodies.rectangle(1600, 0, 50, 2000, { isStatic: true }),
    ]);

    World.add(engine.world, [ball, square]);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    World.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "mousedown", function (event) {
      // add circles on click
      World.add(engine.world, Bodies.circle(100, 50, 30, { restitution: 0.7 }));

      // add squares on click
      World.add(engine.world, Bodies.rectangle(900, 50, 40, 40, { restitution: 0.7 }));
    });

    Engine.run(engine);
    Render.run(render);
  }, []);

  return (
    <Container>
      <div ref={sceneRef} />
    </Container>
  );
};

export default Scene;

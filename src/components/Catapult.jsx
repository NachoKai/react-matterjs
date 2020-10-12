import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const Catapult = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composites = Matter.Composites,
      Constraint = Matter.Constraint,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Vector = Matter.Vector;

    // create engine
    const engine = Engine.create(),
      world = engine.world;

    // create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 1600,
        height: 800,
        wireframes: false,
      },
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    const group = Body.nextGroup(true);

    const stack = Composites.stack(250, 255, 1, 6, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 30, 30);
    });

    const catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });

    World.add(world, [
      stack,
      catapult,
      Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
      Bodies.rectangle(250, 555, 20, 50, { isStatic: true }),
      Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group } }),
      Bodies.circle(530, 100, 40, { density: 0.005 }),
      Constraint.create({
        bodyA: catapult,
        pointB: Vector.clone(catapult.position),
        stiffness: 1,
        length: 0,
      }),
    ]);

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

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });

    // context for MatterTools.Demo
    return {
      engine: engine,
      runner: runner,
      render: render,
      canvas: render.canvas,
      stop: function () {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
      },
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default Catapult;

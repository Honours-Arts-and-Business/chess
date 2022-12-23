import React from "react";

const Test = (props) => {
  const { game } = props;

  const test = () => {
    game.toggleTurnLogic();
  };

  return (
    <div>
      <button onClick={test}>Test</button>
    </div>
  );
};

export default Test;

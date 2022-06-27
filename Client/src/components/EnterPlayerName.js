import React from "react";

export default function EnterPlayerName({ highLevelDispatch }) {

  function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { player1 } = Object.fromEntries(formData);
    if (player1 !== "") {
      console.log("player1: ", player1);
      highLevelDispatch({
        type: "ENTER_NAME",
        payload: {
          player1,
        },
      });
    }
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Your Name:
        <input type="text" name="player1" placeholder="Enter your name" />
      </label>
      <input type="submit" value="Submit"/>
    </form>
  );
}

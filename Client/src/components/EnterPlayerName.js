import React from 'react'


export default function EnterPlayerName(handleFormSubmit, handleNameChange) {
  return (
    <form onSubmit={() => handleFormSubmit()}> 
        <label>
            Your Name:
            <input type="text" name="player1" placeholder='Enter your name' />
        </label>
        <input type="submit" value="Submit" onChange={(e) => handleNameChange(e)}/>
    </form>

  )
}

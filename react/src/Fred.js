import React from 'react';

const doFred = (src) => {
    // log src
    console.log(src);
  };

function Fred() {
    
    return (
        <div className="App">
         this is fred
        <button onClick={() => doFred(this)}>FRED</button>

       </div>
    );

}

export default Fred;
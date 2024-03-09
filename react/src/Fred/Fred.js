import React from 'react';

const doFred = (src) => {
    // log src
    console.log(`doFred ... ${src}`);
  };


function Fred() {

    return (
        <div >
         this is fred
        <button onClick={() => doFred(this)}>FRED</button>

       </div>
    );
}

export default Fred;
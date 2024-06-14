import React from 'react';

//  %PUBLIC_URL%

async function get_data() {

  console.log(`Data.js get_data ...`);  
  
  // log date time
  let d = new Date();
  console.log(`Data.js  date time ... ${d}`);

  //  fetch resume.json
  let data = await fetch('public/data/resume.json').then(response => response.json())

  // log data
  console.log(`Data.js get_data ... ${data}`);


  return "";
}


// function Data() {
    
//     return (
//         <div></div>
//     );

// }

export default get_data;

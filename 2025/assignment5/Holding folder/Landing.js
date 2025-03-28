import React { useEffect, useState } from 'react';
const nano = require('nano')(process.env.COUCHDB_URL || 'http://admin:password@a5cdb1:5984');

nano.use('postdb').insert({type:'test',topic:'test',data:'fur reel'}, function(err, body) {
  if(!err)
    console.log(body);
});

const fetchData = async () => {
  try {
    const response = await db.list({ include_docs: true });
    return response.rows.map(row => row.doc);
  } catch (error) {
    console.error('Error fetching data from CouchDB:', error);
    return [];
  }
};

const Landing = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };
    getData();
  }, []);

  return (
    <div className="Landing">
      <h1>Welcome to CMPT 353 Project forum board</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Landing;

// const serverURL="http://localhost:3000"

// function Landing() {
//   return (
//     <div className="Landing">
//       <h1>
//           Welcome to CMPT 353 Project forum board
//       </h1>
//     </div>
//   );
// }

  
//   export default Landing;
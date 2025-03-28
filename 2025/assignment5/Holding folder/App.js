import './App.css';
import Landing from './pages/Landing'

const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano');

//Env Var
const COUCHDB_URL = process.env.COUCHDB_URL || 'http://admin:password@a5cdb1:5984';
const COUCHDB_DB = process.env.COUCHDB_DB || 'postdb';
const PORT = process.env.PORT || 3000;

//CouchDB connection
const couch = nano(COUCHDB_URL);
const app = express();
app.use(bodyParser.json());

//Check for DB, create if !DB
(async () => {
  try{
    const dbList = await couch.db.list();
    if (!dbList.includes(COUCHDB_DB)) {
      await couch.db.create(COUCHDB_DB);
      console.log(`Database ${COUCHDB_DB} created.`);
    }else{
      console.log(`Database ${COUCHDB_DB} already exists.`);
    }
  }catch(err){
    console.error('Error creating/checking DB:',err);
  }
})();

//DB reference
const postDB = couch.db.use(COUCHDB_DB);

function App() {
  return (
    <div className="App">
      <Landing/>
    </div>
  );
}

export default App;

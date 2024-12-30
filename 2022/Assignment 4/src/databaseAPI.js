const checkDatabaseTable = (databaseName, tableName) => {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: databaseName
      });
      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to database:', err);
          reject(err);
        } else {
          const sql = `SELECT 1 FROM ${tableName} LIMIT 1`;
          connection.query(sql, (err, result) => {
            if (err) {
              console.error('Error checking table:', err);
              reject(err);
            } else {
              resolve(result.length > 0);
            }
            connection.end();
          });
        }
      });
    });
  };

  
  checkDatabaseTable('my_database', 'my_table')
  .then(tableExists => {
    if (tableExists) {
      console.log('Table exists');
    } else {
      console.log('Table does not exist');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

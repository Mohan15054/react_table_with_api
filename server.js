const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line

const app = express();
const port = 3001;

app.use(cors()); // Add this line
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./daq_config.db');

// CRUD operations
app.get('/api/opc', (req, res) => {
  db.all('SELECT * FROM opc', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

app.post('/api/opc', (req, res) => {
  const { Tag_name, Tag_path, Neo_enable, Tag_name_type, Neo_IID, Neo_Schema } = req.body;
  db.run(
    'INSERT INTO opc (Tag_name, Tag_path, Neo_enable, Tag_name_type, Neo_IID, Neo_Schema) VALUES (?, ?, ?, ?, ?, ?)',
    [Tag_name, Tag_path, Neo_enable, Tag_name_type, Neo_IID, Neo_Schema],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});


app.put('/api/opc/:id', (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const { Tag_name, Tag_path, Neo_enable, Tag_name_type, Neo_IID, Neo_Schema } = req.body;
    db.run(
        'UPDATE opc SET Tag_name=?, Tag_path=?, Neo_enable=?, Tag_name_type=?, Neo_IID=?, Neo_Schema=? WHERE s_no=?',
      [Tag_name, Tag_path, Neo_enable, Tag_name_type, Neo_IID, Neo_Schema, id],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          console.log(err.message);
          return;
        }
        res.json({ message: 'Tag updated successfully' });
      }
    );
  });
app.delete('/api/opc/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM opc WHERE s_no=?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Tag deleted successfully' });
  });
});


app.delete('/api/opc/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM opc WHERE s_no=?', [id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Tag deleted successfully' });
    });
  });
  
  
// Similar implementations for update and delete operations

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


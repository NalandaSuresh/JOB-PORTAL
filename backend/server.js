const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());



const pool = new Pool({
    user: 'nalanda',
    host: '192.168.5.9',
    database: 'job_portal',
    password: '@thira@p9lexu$',
    port: 5432
});



app.post('/users/register', (req, res) => {
    const { fname, lname, phone, education,  gender,email, password, password2 } = req.body;

    if (password !== password2) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    const query = {
        text: 'INSERT INTO users (fname, lname, phone, education, gender, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        values: [fname, lname,  phone, education, gender, email, password]
    };
    pool.query(query)
        .then(() => {
            res.json({ message: 'User created successfully' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: 'An error occurred '});
        });
});

app.post('/users/login', (req, res) => {
    const { email, password } = req.body;



    const query = {
        text: 'SELECT * FROM users WHERE email = $1 AND password = $2',
        values: [email, password]
    };

    pool.query(query)
        .then(result => {
            if (result.rows.length === 0) {
                res.status(401).json({ message: 'Invalid credentials' });
            } else {
                res.json({ message: 'Login successful' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: 'An error occurred' });
        });
});

app.get('/users/jobpage', (req, res) => {
    pool.query('SELECT * FROM job', (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal server error');
      } else {
        res.json(result.rows);
        console.log(res)
      }
    });
  });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
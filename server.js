const express = require('express');
const app = express();
const connection = require('./config/db');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');

app.set("view engine","ejs");
// No express.static() for views
app.set('views', __dirname + '/views');

dotenv.config();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//CREATE
app.post('/create', function (req, res) {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;

  try {
    connection.query(
      'INSERT INTO crud_table (name, email) VALUES (?, ?)',
      [name, email],
      function (err, rows) {
        if (err) {
          console.log('Database error:', err);
          return res.status(500).send('Failed to insert data');
        }
        console.log('Insert success:', rows);
        res.redirect("/data");
      }
    );
  } catch (err) {
    console.log('Unexpected error:', err);
    res.status(500).send('Server error');
  }
});

// Checking connected database
// connection.query('SELECT DATABASE() AS db', (err, results) => {
//   if (err) console.error(err);
//   else console.log('Connected to database:', results[0].db);
// });

app.get('/', function (req, res) {
  res.redirect('/create.html');
});

//Read
app.get('/data',function(req,res)
{
    connection.query("select * from crud_table",(err, rows)=>{
    if(err) {
        console.log('Database error:', err);
        return res.status(500).send('Failed to insert data');
      }
      res.render("read.ejs",{users:rows});
    });
});

//Delete
app.get("/delete-data",function(req,res)
{
  const deletequery =  "delete from crud_table where id=?";
  connection.query(deletequery,[req.query.id],(err,rows) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/data");
  });
});


//UPDATE
app.get("/update-data",function(req,res)
{
  connection.query("select * from crud_table where id =?",[req.query.id],(err,user) => {
    if (err) {
      console.log(err);
    }
    result = JSON.parse(JSON.stringify(user[0]));
    console.log(result);
    res.render("Edit.ejs",{result});
  });
})

app.post('/final-update', function (req, res) {
  console.log(req.body);
  const id =req.body.hidden_id;
  const name = req.body.name;
  const email = req.body.email;

  const updatequery = "update crud_table set name=?, email=? where id=?";
  try {
    connection.query(updatequery,[name, email,id],function (err, rows){
        if (err) {
          console.log( err);
        }
        res.redirect("/data");
      });
      } catch (err) {
    console.log( err);
      }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Server running on port ${PORT}`);
});

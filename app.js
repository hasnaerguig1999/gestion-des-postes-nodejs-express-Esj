const express = require('express');
const multer = require('multer');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const dbconnected = require('./DB');
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const categoriesData = [
//   { id: 1, name: 'Category 1' },
//   { id: 2, name: 'Category 2' },
//   // Add more categories as needed
// ];


//get all categories
app.get('/category', (req, res) => {
  dbconnected.query('SELECT * FROM category', (err, rows, fields) => {
    if (!err) { 
      
      res.render('category.ejs', { categories: rows });
    } else {
      console.log(err);
      res.status(500).send('Une erreur est survenue lors de la récupération des catégories.');
    }
  });
});

//get an category
app.get('/category/:id', (req, res) => {
  dbconnected.query('SELECT * FROM category WHERE id =?',[req.params.id],(err, rows, fields) => {
    if (!err) { 
      res.json(rows);     
    } else {
      console.log(err);
    }
  });
});

//delete category
app.delete('/category/:id', (req, res) => {
  dbconnected.query('DELETE FROM category WHERE id =?',[req.params.id],(err, rows, fields) => {
    if (!err) {
      res.send('deleted successfully');     
    } else {
      console.log(err);
    }
  });
});

//insert category

app.post('/category', (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send('Le champ "name" est requis.');
    return;
  }

  const query = 'INSERT INTO category (name) VALUES (?)';

  dbconnected.query(query, [name], (error, results) => {
    if (error) {
      console.error('Erreur SQL :', error);
      res.status(500).send('Erreur lors de l\'insertion en base de données.');
    } else {
      console.log('Enregistrement inséré avec succès.');
      res.redirect('/category');
    }
  });
});





//update category

app.put('/category/:id', (req, res) => {
  const categoryId = req.params.id; 
  const { name } = req.body;

  const query = 'UPDATE category SET name=? WHERE id=?';

  dbconnected.query(query, [name, categoryId], (error, results) => {
    if (error) {
      console.error('Erreur SQL :', error);
      res.status(500).send('Erreur lors de la mise à jour en base de données.');
    } else {
      console.log('Catégorie mise à jour avec succès.');
      // res.status(200).send('Catégorie mise à jour avec succès.');
      res.redirect('/category');
    }
  });
});


//get all poste

app.get('/article', (req, res) => {
  dbconnected.query('SELECT * FROM poste', (err, rows, fields) => {
    if (!err) {
    
      res.render('article.ejs', { postes: rows });
    } else {
      console.log(err);
      res.status(500).send('An error occurred while retrieving posts.');
    }
  });
});


//get an poste
app.get('/poste/:id', (req, res) => {
  dbconnected.query('SELECT * FROM poste WHERE id =?',[req.params.id],(err, rows, fields) => {
    if (!err) { 
      // console.log(rows[0]);
      res.render('show',{poste:rows[0]})     
    } else {
      console.log(err);
    }
  });
});


//insert category

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle form submission
// Handle form submission for adding a post with categories
app.post('/poste', upload.single('image'), (req, res) => {
  const { title, contenu, date_publication, categories } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !contenu || !date_publication || !image || !categories) {
    return res.status(400).send('All fields are required.');
  }

  const queryPost = 'INSERT INTO poste (title, contenu, date_publication, image) VALUES (?, ?, ?, ?)';
  dbconnected.query(queryPost, [title, contenu, date_publication, image], (error, results) => {
    if (error) {
      console.error('SQL Error:', error.sqlMessage);
      console.error('Query Attempted:', queryPost);
      console.error('Data:', [title, contenu, date_publication, image]);
      return res.status(500).send('Error inserting into the database.');
    }

    const postId = results.insertId;
    req.body.categories.forEach((element) => {
      const sql = 'INSERT INTO poste_category SET ?';
      dbconnected.query(sql,{poste_id:postId,category_id:element})
    });
    res.redirect(`poste/${postId}`)
    // Insert selected categories for the post
    // const insertCategoryQuery = 'INSERT INTO poste_category (poste_id, category_id) VALUES ?';
    // const values = categories.map(categoryId => [postId, categoryId]);

    // dbconnected.query(insertCategoryQuery, [values], (error) => {
    //   if (error) {
    //     console.error('SQL Error:', error.sqlMessage);
    //     console.error('Query Attempted:', insertCategoryQuery);
    //     console.error('Data:', values);
    //     return res.status(500).send('Error inserting categories into the database.');
    //   }

    //   console.log('Record inserted successfully.');
    //   return res.redirect(`/poste/${postId}`);
    // });
  });
});


// // Update a post - Get the update form
// app.get('/updatepost/:id', (req, res) => {
//   const postId = req.params.id;

//   // Fetch the post details based on the postId
//   dbconnected.query('SELECT * FROM poste WHERE id = ?', [postId], (err, rows, fields) => {
//     if (!err) {
//       // Render the update form with the post details
//       res.render('updatepost', { title: 'Update Post', layout: './layouts/sidebar', post: rows[0] });
//     } else {
//       console.log(err);
//       res.status(500).send('An error occurred while retrieving the post for updating.');
//     }
//   });
// });


app.get('/updatepost/:id', (req, res) => {
  const postId = req.params.id;

  // Fetch the post details based on the postId
  dbconnected.query('SELECT * FROM poste WHERE id = ?', [postId], (err, postRows, fields) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred while retrieving the post for updating.');
          return;
      }

      // Fetch all categories
      dbconnected.query('SELECT * FROM category', (err, categoryRows, fields) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred while retrieving categories.');
              return;
          }

          // Render the update form with the post details and categories
          res.render('updatepost', { title: 'Update Post', layout: './layouts/sidebar', post: postRows[0], categories: categoryRows });
      });
  });
});







// Update a post
app.put('/updatepost/:id', upload.single('image'), (req, res) => {
  const postId = req.params.id;
  const { title, contenu, date_publication, categories } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !contenu || !date_publication || !categories) {
    return res.status(400).send('All fields are required.');
  }

  const queryPost = 'UPDATE poste SET title=?, contenu=?, date_publication=?, image=? WHERE id=?';
  dbconnected.query(queryPost, [title, contenu, date_publication, image, postId], (error) => {
    if (error) {
      console.error('SQL Error:', error.sqlMessage);
      console.error('Query Attempted:', queryPost);
      console.error('Data:', [title, contenu, date_publication, image, postId]);
      return res.status(500).send('Error updating the database.');
    }

    // Delete existing categories for the post
    const deleteCategoryQuery = 'DELETE FROM poste_category WHERE poste_id=?';
    dbconnected.query(deleteCategoryQuery, [postId], (deleteError) => {
      if (deleteError) {
        console.error('SQL Error:', deleteError.sqlMessage);
        console.error('Query Attempted:', deleteCategoryQuery);
        console.error('Data:', [postId]);
        return res.status(500).send('Error deleting categories from the database.');
      }

      // Insert selected categories for the post
      const insertCategoryQuery = 'INSERT INTO poste_category (poste_id, category_id) VALUES ?';
      const values = categories.map(categoryId => [postId, categoryId]);

      dbconnected.query(insertCategoryQuery, [values], (insertError) => {
        if (insertError) {
          console.error('SQL Error:', insertError.sqlMessage);
          console.error('Query Attempted:', insertCategoryQuery);
          console.error('Data:', values);
          return res.status(500).send('Error inserting categories into the database.');
        }

        console.log('Record updated successfully.');
        return res.redirect(`/poste/${postId}`);
      });
    });
  });
});





















// navigation
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use( express.static(__dirname + 'uploads'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));


app.use(expressLayouts);
app.set('layout', './layouts/full-width');
app.set('view engine', 'ejs');

app.get('/index', (req, res) => {
  res.render('index', { title: 'Home Page', layout: './layouts/sidebar' });
});

app.get('/article', (req, res) => {
  res.render('article', { title: 'Article Page', layout: './layouts/sidebar' });
});

app.get('/category', (req, res) => {
  res.render('category', { title: 'category Page', layout: './layouts/sidebar' });
});

app.get('/addcategory', (req, res) => {
  res.render('addcategory', { title: 'add category Page', layout: './layouts/sidebar' });
});

app.get('/editecategory', (req, res) => {
  res.render('editecategory', { title: 'edite category Page', layout: './layouts/sidebar' });
});

app.get('/addpost',  (req, res) => {
  dbconnected.query('SELECT * FROM category', (err, rows, fields) => {
    if (!err) {
    console.log(rows);
      
      res.render('addpost', { title: 'Add post Page', layout: './layouts/sidebar', categories: rows  });
    } else {
      console.log(err);
      res.status(500).send('An error occurred while retrieving posts.');
    }
  })
});

app.get('/updatepost ', (req, res) => {
  res.render('updatepost', { title: 'update post Page', layout: './layouts/sidebar' });
});


module.exports = dbconnected;
// module.exports=queryFunctions;

app.listen(port, () => console.info(`App Listening on port ${port}`));

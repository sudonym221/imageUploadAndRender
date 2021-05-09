const express = require('express');
var multer = require('multer');
var Image = require('./models/image.js')
const {
  randomNumber
} = require('./helpers/random.js');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Mongoose config
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/imageApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('DB connected');
});
// Multer storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/tmp/my-uploads')
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error('Please upload a image file'));
    }
    cb(undefined, true);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({
  storage: storage
});

// Middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Site routes
app.get('/', (req, res) => {
  Image.find({})
    .then(result => {
      res.render('index.ejs', {
        image: result
      })
    })
    .catch(err => {
      throw new Error
    })
})

app.get('/about', (req, res) => {
  res.render('about.ejs');
})

app.get('/upload', (req, res) => {
  res.render('upload.ejs');
});

app.post('/upload', upload.single('photo'), (req, res, next) => {
  const saveimage = () => {
    const tempImagePath = req.file.path;
    const imageUrl = randomNumber();
    const ext = path.extname(req.file.originalname).toLowerCase();
    const targetPath = path.resolve(`public/tmp/my-uploads/${imageUrl}${ext}`);

    if (ext == '.png' || ext == '.svg' || ext == '.jpg' || ext == '.jpeg') {
      fs.rename(tempImagePath, targetPath, (err) => {
        if (err) throw err;
        console.log('Upload complete!');
      });

      const image = new Image({
        caption: req.body.caption,
        path: imageUrl + ext
      })

      image.save();
    }
  }

  saveimage();
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
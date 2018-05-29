let express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  path = require('path'),
  methodOverride = require('method-override'),
  expressSanitizer = require('express-sanitizer');
  

mongoose.connect('mongodb://localhost/blog');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
// app.use(express.static(path.join(__dirname,'public')))

let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

let Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//   title: 'Test blog',
//   image: 'js.jpg',
//   body: 'This is the best blog ever!!!'
// }, (err, blog) => {
//   if(err) console.log('AN ERROR OCCURED WHILE CREATING THIS BLOG');
//   else { console.log('BLOG WAS SUCESSFULLY CREATED!')
//    console.log(blog);}
// });

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) console.log('AN ERROR OCCURED WHILE FINDING THE BLOGS');
    else {
      console.log('BLOGS WERE SUCESSFULLY FOUND')
      res.render('index',{blogs: blogs});
    }
  })
});

app.get('/blogs/new', (req, res) => {
  res.render('new');
});

app.post('/blogs', (req, res) => {
  req.body.body = req.sanitize(req.body.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      console.log('AN ERROR OCCURED WHILE SAVING BLOG TO DB');
      res.redirect('/blogs/new');
    } else {
      console.log('BLOGS WERE SUCESSFULLY SAVED TO DB')
      res.redirect('/blogs');
    }
  });
});

app.listen(3000, () => {
  console.log('Blog server is listening on port 3000');
});
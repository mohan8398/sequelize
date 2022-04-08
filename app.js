const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product=require('./models/product');
const User=require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); 

app.use((req,res,next)=>{
  User.findById(1)
  .then(user=>{
      req.user =user;
      next();
  })
  .catch(err=>{console.log(err)});
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize
  .sync({force: true})
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .then(user=>{
    if(!user){
        return User.create({name: 'mohan', email:'mohan@gmail.com'});
    }
    return user;
})
  .catch(err => {
    console.log(err);
  });

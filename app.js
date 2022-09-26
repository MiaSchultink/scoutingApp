require('dotenv').config()

const path = require('path');

const mongoose = require('mongoose')
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');


const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions'
});

const csrfProtection = csrf();


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.set('view engine', 'ejs')
app.set('views', 'views')

//const favicon = require('serve-favicon');

const userController = require('./controllers/user')
const errorController = require('./controllers/error')
const adminController = require('./controllers/admin')

const User = require('./models/user');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.user = req.session.user;
    next();
});

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const teamRoutes = require('./routes/team');
const gameRoutes = require('./routes/game')

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/team', teamRoutes)
app.use('/game',gameRoutes)

app.get('/', (req, res, next) => {
    res.render('home');
})


module.exports = app
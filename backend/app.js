require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

const saucesRoutes = require('./routes/sauce');
const userRoutes = require ('./routes/user');

// ----- Connection à MongoDB ----- // 

mongoose.connect(process.env.MONGO_URI,
  { useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// ----- Réglage des erreurs de Cross Origin Resource Sharing ----- //
// ----- Permet au Front et au Back de communiquer en sécurité ----- //

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

 // ----- Analyse le texte URL des données codées et expose l'objet résultant, req.body  ----- //
app.use(bodyParser.urlencoded({ extended: true }));  
 // ----- Analyse le texte JSON et expose l'objet résultant sur req.body ----- // 
app.use(bodyParser.json());
app.use(helmet());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
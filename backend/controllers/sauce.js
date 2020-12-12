// ----- Nous donne accès au fonctions de modifier le système de fichier ----- //
const fs = require('fs');

// ----- importe notre modèle de sauce ----- // 
const Sauce = require('../models/Sauce');

// ----- Créer une sauce ----- //
exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);

  delete sauceObjet._id;

  const sauce = new Sauce({
    ...sauceObjet,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

// ----- Récupérer UNE sauce par l'ID ----- // 
exports.getOneSauce =  (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

// ----- Récupérer TOUTE les sauces ----- //
exports.listSauces =  (req, res, next) => {
  Sauce.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
};

// ----- Modifier une sauce ----- // 
exports.updateSauce =  (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//----- Supprimer une sauce ----- //
exports.deleteSauce =  (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// ----- Fonction like ----- //
exports.likeSauces = (req, res, next) => {
  if (req.body.like == 1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $inc: { likes: 1 },
      $push: { usersLiked: req.body.userId },
      _id: req.params.id
    })
      .then(() => { res.status(201).json({ message: 'Like ajouté' }); })
      .catch((error) => { res.status(400).json({ error: error }); });
  }
  // ----- Fonction dislike ----- //
  else if (req.body.like == -1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $inc: { dislikes: 1 },
      $push: { usersDisliked: req.body.userId },
      _id: req.params.id
    })
      .then(() => { res.status(201).json({ message: 'Dislike ajouté' }); })
      .catch((error) => { res.status(400).json({ error: error }); });
  }
  // ----- Possibilité de retirer le like ou dislike ----- //
  else if (req.body.like == 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.find(user => user === req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
            _id: req.params.id
          })
            .then(() => { res.status(201).json({ message: 'Like retiré' }); })
            .catch((error) => { res.status(400).json({ error: error }); });
        } 
        if (sauce.usersDisliked.find(user => user === req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
            _id: req.params.id
          })
            .then(() => { res.status(201).json({ message: 'Dislike retiré' }); })
            .catch((error) => { res.status(400).json({ error: error }); });
        }
      })
      .catch((error) => { res.status(404).json({ error: error }); });
  }
};
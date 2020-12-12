const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
try {
    // ----- Extrait le TOKEN du header ----- //
    const token = req.headers.authorization.split(' ')[1];
    // ----- Décode le TOKEN ----- //
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // ----- Extrait l'ID utilisateur du TOKEN ----- //
    const userId = decodedToken.userId;
    // ----- Si la demande contient un ID il est comparé ----- // 
        // ----- si il est différent => erreur ----- // 
    if (req.body.userId && req.body.userId !== userId) {
        throw 'user ID non valide';
        // ----- Si il est identique => Utilisateur identifié ----- // 
    } else {
        next();
    }
    // ----- les erreurs sont générées dans le bloc catch ----- // 
} catch (error) {
    res.status(401).json({ error: error | 'Requete non authentifiée'});
    };
}
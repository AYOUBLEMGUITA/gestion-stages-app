const db = require("../config/db");

exports.getStats = (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  if (role === "stagiaire") {
    const sql = `
      SELECT
        (SELECT COUNT(*) 
         FROM candidatures 
         JOIN stagiaires ON candidatures.stagiaire_id = stagiaires.id
         WHERE stagiaires.user_id = ?) AS candidatures,

        (SELECT COUNT(*) 
         FROM documents
         JOIN stagiaires ON documents.stagiaire_id = stagiaires.id
         WHERE stagiaires.user_id = ?) AS documents,

        (SELECT COUNT(*) FROM offres WHERE statut = 'active') AS offres,

        (SELECT COUNT(*) FROM notifications WHERE user_id = ? AND lu = 0) AS notifications
    `;

    db.query(sql, [userId, userId, userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      return res.json(results[0]);
    });
  }

  else if (role === "entreprise") {
    const sql = `
      SELECT
        (SELECT COUNT(*) 
         FROM offres 
         JOIN entreprises ON offres.entreprise_id = entreprises.id
         WHERE entreprises.user_id = ?) AS offres,

        (SELECT COUNT(*) 
         FROM candidatures
         JOIN offres ON candidatures.offre_id = offres.id
         JOIN entreprises ON offres.entreprise_id = entreprises.id
         WHERE entreprises.user_id = ?) AS candidatures,

        (SELECT COUNT(*) 
         FROM candidatures
         JOIN offres ON candidatures.offre_id = offres.id
         JOIN entreprises ON offres.entreprise_id = entreprises.id
         WHERE entreprises.user_id = ? AND candidatures.statut = 'acceptee') AS acceptes,

        (SELECT COUNT(*) 
         FROM evaluations
         JOIN entreprises ON evaluations.entreprise_id = entreprises.id
         WHERE entreprises.user_id = ?) AS evaluations
    `;

    db.query(sql, [userId, userId, userId, userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      return res.json(results[0]);
    });
  }

  else if (role === "admin") {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM users) AS utilisateurs,
        (SELECT COUNT(*) FROM documents WHERE statut = 'en_attente') AS documents_attente,
        (SELECT COUNT(*) FROM entreprises) AS entreprises,
        (SELECT COUNT(*) FROM rapports) AS rapports
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      return res.json(results[0]);
    });
  }

  else if (role === "formateur") {
    return res.json({
      stagiaires: 0,
      rapports: 0,
      evaluations: 0,
      alertes: 0,
    });
  }

  else {
    return res.status(400).json({ message: "Rôle inconnu" });
  }
};
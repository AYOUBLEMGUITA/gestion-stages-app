const db = require("../config/db");

// Entreprise: liste stagiaires acceptés chez elle
exports.getStagiairesAcceptes = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      stagiaires.id AS stagiaire_id,
      users.nom,
      users.email,
      users.telephone,
      stagiaires.niveau,
      stagiaires.specialite,
      stagiaires.competences,
      offres.titre AS offre_titre,
      candidatures.id AS candidature_id
    FROM candidatures
    JOIN stagiaires ON candidatures.stagiaire_id = stagiaires.id
    JOIN users ON stagiaires.user_id = users.id
    JOIN offres ON candidatures.offre_id = offres.id
    JOIN entreprises ON offres.entreprise_id = entreprises.id
    WHERE entreprises.user_id = ?
    AND candidatures.statut = 'acceptee'
    ORDER BY users.nom ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Entreprise: ajouter évaluation
exports.addEvaluation = (req, res) => {
  const userId = req.user.id;
  const { stagiaire_id, note, commentaire } = req.body;

  if (!stagiaire_id || note === undefined) {
    return res.status(400).json({ message: "Stagiaire et note requis" });
  }

  const findEntrepriseSql = "SELECT id FROM entreprises WHERE user_id = ?";

  db.query(findEntrepriseSql, [userId], (err, entrepriseResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (entrepriseResults.length === 0) {
      return res.status(404).json({ message: "Profil entreprise introuvable" });
    }

    const entrepriseId = entrepriseResults[0].id;

    const sql = `
      INSERT INTO evaluations 
      (stagiaire_id, entreprise_id, date_eval, note, commentaire, valide)
      VALUES (?, ?, CURDATE(), ?, ?, 0)
    `;

    db.query(sql, [stagiaire_id, entrepriseId, note, commentaire], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur ajout évaluation" });
      }

      res.status(201).json({
        message: "Évaluation ajoutée avec succès",
        evaluationId: result.insertId,
      });
    });
  });
};

// Tous: afficher évaluations
exports.getEvaluations = (req, res) => {
  const sql = `
    SELECT 
      evaluations.id,
      evaluations.date_eval,
      evaluations.note,
      evaluations.commentaire,
      evaluations.valide,
      users.nom AS stagiaire_nom,
      users.email AS stagiaire_email,
      stagiaires.specialite,
      entreprises.nom_societe
    FROM evaluations
    JOIN stagiaires ON evaluations.stagiaire_id = stagiaires.id
    JOIN users ON stagiaires.user_id = users.id
    LEFT JOIN entreprises ON evaluations.entreprise_id = entreprises.id
    ORDER BY evaluations.date_eval DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Admin/Formateur: valider évaluation
exports.validerEvaluation = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE evaluations
    SET valide = 1
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur validation évaluation" });
    }

    res.json({ message: "Évaluation validée avec succès" });
  });
};
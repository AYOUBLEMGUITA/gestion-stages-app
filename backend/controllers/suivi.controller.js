const db = require("../config/db");

exports.getStagiaires = (req, res) => {
  const sql = `
    SELECT
      stagiaires.id AS stagiaire_id,
      users.nom,
      users.email,
      users.telephone,
      stagiaires.niveau,
      stagiaires.specialite,
      stagiaires.localisation,
      stagiaires.competences,
      stagiaires.statut_stage
    FROM stagiaires
    JOIN users ON stagiaires.user_id = users.id
    ORDER BY users.nom ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    return res.json(results);
  });
};

exports.addSuivi = (req, res) => {
  const userId = req.user.id;
  const {
    stagiaire_id,
    mission,
    taches,
    competences_acquises,
    remarque,
    date_suivi,
  } = req.body;

  if (!stagiaire_id || !remarque) {
    return res.status(400).json({ message: "Stagiaire et remarque requis" });
  }

  const findFormateurSql = "SELECT id FROM formateurs WHERE user_id = ?";

  db.query(findFormateurSql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (results.length > 0) {
      return insertSuivi(results[0].id);
    }

    const createFormateurSql = `
      INSERT INTO formateurs (user_id, telephone)
      SELECT id, telephone
      FROM users
      WHERE id = ? AND role = 'formateur'
    `;

    db.query(createFormateurSql, [userId], (createErr, createResult) => {
      if (createErr) {
        console.error(createErr);
        return res.status(500).json({ message: "Erreur creation profil formateur" });
      }

      if (createResult.affectedRows === 0) {
        return res.status(404).json({ message: "Profil formateur introuvable." });
      }

      return insertSuivi(createResult.insertId);
    });
  });

  function insertSuivi(formateurId) {
    const sql = `
      INSERT INTO suivis
      (stagiaire_id, formateur_id, mission, taches, competences_acquises, remarque, date_suivi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        stagiaire_id,
        formateurId,
        mission || null,
        taches || null,
        competences_acquises || null,
        remarque,
        date_suivi || new Date(),
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Erreur lors de l'ajout du suivi" });
        }

        return res.status(201).json({
          message: "Suivi ajoute avec succes",
          suiviId: result.insertId,
        });
      }
    );
  }
};

exports.getSuivisByStagiaire = (req, res) => {
  const { stagiaire_id } = req.params;

  const sql = `
    SELECT
      suivis.*,
      users.nom AS formateur_nom
    FROM suivis
    JOIN formateurs ON suivis.formateur_id = formateurs.id
    JOIN users ON formateurs.user_id = users.id
    WHERE suivis.stagiaire_id = ?
    ORDER BY suivis.date_suivi DESC
  `;

  db.query(sql, [stagiaire_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    return res.json(results);
  });
};

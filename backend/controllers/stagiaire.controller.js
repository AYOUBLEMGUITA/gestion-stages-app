const db = require("../config/db");

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      users.id AS user_id,
      users.nom,
      users.email,
      users.telephone,
      users.role,
      stagiaires.id AS stagiaire_id,
      stagiaires.cv,
      stagiaires.niveau,
      stagiaires.specialite,
      stagiaires.localisation,
      stagiaires.competences,
      stagiaires.statut_stage
    FROM users
    LEFT JOIN stagiaires ON users.id = stagiaires.user_id
    WHERE users.id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Profil introuvable" });
    }

    res.json(results[0]);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { nom, telephone, niveau, specialite, localisation, competences } = req.body;

  const updateUserSql = `
    UPDATE users 
    SET nom = ?, telephone = ?
    WHERE id = ?
  `;

  db.query(updateUserSql, [nom, telephone, userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur modification utilisateur" });
    }

    const checkSql = "SELECT * FROM stagiaires WHERE user_id = ?";

    db.query(checkSql, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (results.length === 0) {
        const insertSql = `
          INSERT INTO stagiaires 
          (user_id, niveau, specialite, localisation, competences)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [userId, niveau, specialite, localisation, competences],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Erreur création profil stagiaire" });
            }

            res.json({ message: "Profil stagiaire créé avec succès" });
          }
        );
      } else {
        const updateSql = `
          UPDATE stagiaires 
          SET niveau = ?, specialite = ?, localisation = ?, competences = ?
          WHERE user_id = ?
        `;

        db.query(
          updateSql,
          [niveau, specialite, localisation, competences, userId],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Erreur modification profil stagiaire" });
            }

            res.json({ message: "Profil stagiaire mis à jour avec succès" });
          }
        );
      }
    });
  });
};
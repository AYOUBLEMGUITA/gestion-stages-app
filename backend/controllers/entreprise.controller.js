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
      entreprises.id AS entreprise_id,
      entreprises.nom_societe,
      entreprises.secteur,
      entreprises.adresse,
      entreprises.contact,
      entreprises.description
    FROM users
    LEFT JOIN entreprises ON users.id = entreprises.user_id
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

  const {
    nom,
    telephone,
    nom_societe,
    secteur,
    adresse,
    contact,
    description,
  } = req.body;

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

    const checkSql = "SELECT * FROM entreprises WHERE user_id = ?";

    db.query(checkSql, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (results.length === 0) {
        const insertSql = `
          INSERT INTO entreprises 
          (user_id, nom_societe, secteur, adresse, contact, description)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [userId, nom_societe, secteur, adresse, contact, description],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Erreur création profil entreprise" });
            }

            res.json({ message: "Profil entreprise créé avec succès" });
          }
        );
      } else {
        const updateSql = `
          UPDATE entreprises 
          SET nom_societe = ?, secteur = ?, adresse = ?, contact = ?, description = ?
          WHERE user_id = ?
        `;

        db.query(
          updateSql,
          [nom_societe, secteur, adresse, contact, description, userId],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Erreur modification profil entreprise" });
            }

            res.json({ message: "Profil entreprise mis à jour avec succès" });
          }
        );
      }
    });
  });
};
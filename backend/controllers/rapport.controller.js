const db = require("../config/db");

// Stagiaire: uploader rapport
exports.uploadRapport = (req, res) => {
  const userId = req.user.id;
  const { titre, type } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier envoyé" });
  }

  if (!titre || !type) {
    return res.status(400).json({ message: "Titre et type requis" });
  }

  const findStagiaireSql = "SELECT id FROM stagiaires WHERE user_id = ?";

  db.query(findStagiaireSql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Profil stagiaire introuvable. Complétez votre profil d'abord.",
      });
    }

    const stagiaireId = results[0].id;
    const fichier = req.file.filename;

    const sql = `
      INSERT INTO rapports (stagiaire_id, titre, fichier, type, statut)
      VALUES (?, ?, ?, ?, 'depose')
    `;

    db.query(sql, [stagiaireId, titre, fichier, type], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur ajout rapport" });
      }

      res.status(201).json({
        message: "Rapport déposé avec succès",
        rapportId: result.insertId,
      });
    });
  });
};

// Stagiaire: mes rapports
exports.getMesRapports = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT rapports.*
    FROM rapports
    JOIN stagiaires ON rapports.stagiaire_id = stagiaires.id
    WHERE stagiaires.user_id = ?
    ORDER BY rapports.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Formateur/Admin: tous les rapports
exports.getAllRapports = (req, res) => {
  const sql = `
    SELECT 
      rapports.id,
      rapports.titre,
      rapports.fichier,
      rapports.type,
      rapports.statut,
      rapports.created_at,
      users.nom AS stagiaire_nom,
      users.email AS stagiaire_email,
      stagiaires.specialite,
      stagiaires.niveau
    FROM rapports
    JOIN stagiaires ON rapports.stagiaire_id = stagiaires.id
    JOIN users ON stagiaires.user_id = users.id
    ORDER BY rapports.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Formateur/Admin: changer statut rapport
exports.updateRapportStatus = (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  const allowed = ["depose", "valide", "refuse"];

  if (!allowed.includes(statut)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  const sql = `
    UPDATE rapports
    SET statut = ?
    WHERE id = ?
  `;

  db.query(sql, [statut, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur modification statut" });
    }

    res.json({ message: "Statut du rapport mis à jour" });
  });
};

// Stagiaire: supprimer rapport
exports.deleteRapport = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM rapports WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur suppression rapport" });
    }

    res.json({ message: "Rapport supprimé avec succès" });
  });
};
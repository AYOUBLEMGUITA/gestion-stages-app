const db = require("../config/db");

// Upload document
exports.uploadDocument = (req, res) => {
  const userId = req.user.id;
  const { nom, type } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier envoyé" });
  }

  if (!nom || !type) {
    return res.status(400).json({ message: "Nom et type du document requis" });
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
    const cheminFichier = req.file.filename;

    const sql = `
      INSERT INTO documents (stagiaire_id, nom, type, chemin_fichier, statut)
      VALUES (?, ?, ?, ?, 'en_attente')
    `;

    db.query(sql, [stagiaireId, nom, type, cheminFichier], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Erreur lors de l'ajout du document",
        });
      }

      res.status(201).json({
        message: "Document uploadé avec succès",
        documentId: result.insertId,
        fichier: cheminFichier,
      });
    });
  });
};

// Afficher documents du stagiaire connecté
exports.getMesDocuments = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT documents.*
    FROM documents
    JOIN stagiaires ON documents.stagiaire_id = stagiaires.id
    WHERE stagiaires.user_id = ?
    ORDER BY documents.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Afficher tous les documents pour l'admin
exports.getAllDocuments = (req, res) => {
  const sql = `
    SELECT
      documents.*,
      users.nom AS stagiaire_nom,
      users.email AS stagiaire_email
    FROM documents
    JOIN stagiaires ON documents.stagiaire_id = stagiaires.id
    JOIN users ON stagiaires.user_id = users.id
    ORDER BY documents.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Modifier le statut d'un document par l'admin
exports.updateDocumentStatus = (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  if (!statut) {
    return res.status(400).json({ message: "Statut requis" });
  }

  const allowedStatuses = ["en_attente", "valide", "refuse", "manquant"];

  if (!allowedStatuses.includes(statut)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  const sql = "UPDATE documents SET statut = ? WHERE id = ?";

  db.query(sql, [statut, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur modification document" });
    }

    res.json({ message: "Statut du document mis a jour" });
  });
};

// Supprimer document
exports.deleteDocument = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `
    DELETE documents
    FROM documents
    JOIN stagiaires ON documents.stagiaire_id = stagiaires.id
    WHERE documents.id = ? AND stagiaires.user_id = ?
  `;

  db.query(sql, [id, userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur suppression document" });
    }

    res.json({ message: "Document supprimé avec succès" });
  });
};
// Admin: afficher tous les documents
exports.getAllDocuments = (req, res) => {
  const sql = `
    SELECT 
      documents.id,
      documents.nom,
      documents.type,
      documents.chemin_fichier,
      documents.statut,
      documents.created_at,
      users.nom AS stagiaire_nom,
      users.email AS stagiaire_email,
      stagiaires.specialite,
      stagiaires.niveau
    FROM documents
    JOIN stagiaires ON documents.stagiaire_id = stagiaires.id
    JOIN users ON stagiaires.user_id = users.id
    ORDER BY documents.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Admin: changer statut document
exports.updateDocumentStatus = (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  const allowedStatus = ["manquant", "en_attente", "valide", "refuse"];

  if (!allowedStatus.includes(statut)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  const sql = `
    UPDATE documents
    SET statut = ?
    WHERE id = ?
  `;

  db.query(sql, [statut, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur modification statut" });
    }

    res.json({ message: "Statut du document mis à jour" });
  });
};

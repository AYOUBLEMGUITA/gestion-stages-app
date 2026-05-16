const db = require("../config/db");

// Stagiaire: créer demande convention
exports.createConvention = (req, res) => {
  const userId = req.user.id;
  const { entreprise_id } = req.body;

  if (!entreprise_id) {
    return res.status(400).json({ message: "Entreprise requise" });
  }

  const findStagiaireSql = "SELECT id FROM stagiaires WHERE user_id = ?";

  db.query(findStagiaireSql, [userId], (err, stagiaireResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (stagiaireResults.length === 0) {
      return res.status(404).json({
        message: "Profil stagiaire introuvable. Complétez votre profil d'abord.",
      });
    }

    const stagiaireId = stagiaireResults[0].id;

    const checkSql = `
      SELECT * FROM conventions
      WHERE stagiaire_id = ? AND entreprise_id = ?
    `;

    db.query(checkSql, [stagiaireId, entreprise_id], (err, exists) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (exists.length > 0) {
        return res.status(400).json({
          message: "Une convention existe déjà avec cette entreprise",
        });
      }

      const sql = `
        INSERT INTO conventions 
        (stagiaire_id, entreprise_id, statut, signature_elec)
        VALUES (?, ?, 'en_attente', 0)
      `;

      db.query(sql, [stagiaireId, entreprise_id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Erreur création convention" });
        }

        res.status(201).json({
          message: "Demande de convention créée avec succès",
          conventionId: result.insertId,
        });
      });
    });
  });
};

// Stagiaire: afficher mes conventions
exports.getMesConventions = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      conventions.id,
      conventions.date_signature,
      conventions.statut,
      conventions.signature_elec,
      conventions.fichier_pdf,
      entreprises.nom_societe,
      entreprises.secteur,
      entreprises.adresse,
      entreprises.contact
    FROM conventions
    JOIN stagiaires ON conventions.stagiaire_id = stagiaires.id
    JOIN entreprises ON conventions.entreprise_id = entreprises.id
    WHERE stagiaires.user_id = ?
    ORDER BY conventions.id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Admin: afficher toutes les conventions
exports.getAllConventions = (req, res) => {
  const sql = `
    SELECT 
      conventions.id,
      conventions.date_signature,
      conventions.statut,
      conventions.signature_elec,
      conventions.fichier_pdf,
      stagiaire_user.nom AS stagiaire_nom,
      stagiaire_user.email AS stagiaire_email,
      stagiaires.specialite,
      entreprises.nom_societe,
      entreprises.secteur,
      entreprises.adresse,
      entreprises.contact
    FROM conventions
    JOIN stagiaires ON conventions.stagiaire_id = stagiaires.id
    JOIN users AS stagiaire_user ON stagiaires.user_id = stagiaire_user.id
    JOIN entreprises ON conventions.entreprise_id = entreprises.id
    ORDER BY conventions.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Admin: modifier statut convention
exports.updateConventionStatus = (req, res) => {
  const { id } = req.params;
  const { statut, signature_elec } = req.body;

  const allowed = ["en_attente", "signee", "validee", "refusee"];

  if (!allowed.includes(statut)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  const dateSignature = statut === "signee" || statut === "validee" ? new Date() : null;

  const sql = `
    UPDATE conventions
    SET statut = ?, signature_elec = ?, date_signature = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [statut, signature_elec ? 1 : 0, dateSignature, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur modification convention" });
      }

      res.json({ message: "Convention mise à jour avec succès" });
    }
  );
};

// Admin/Stagiaire: supprimer convention
exports.deleteConvention = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM conventions WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur suppression convention" });
    }

    res.json({ message: "Convention supprimée avec succès" });
  });
};

// Pour formulaire: afficher entreprises
exports.getEntreprisesList = (req, res) => {
  const sql = `
    SELECT id, nom_societe, secteur, adresse, contact
    FROM entreprises
    ORDER BY nom_societe ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};
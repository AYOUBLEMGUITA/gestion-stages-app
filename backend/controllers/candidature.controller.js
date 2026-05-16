const db = require("../config/db");

// Stagiaire postule à une offre
exports.postuler = (req, res) => {
  const userId = req.user.id;
  const { offre_id } = req.body;

  if (!offre_id) {
    return res.status(400).json({ message: "offre_id est requis" });
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

    const checkSql =
      "SELECT * FROM candidatures WHERE stagiaire_id = ? AND offre_id = ?";

    db.query(checkSql, [stagiaireId, offre_id], (err, exists) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (exists.length > 0) {
        return res.status(400).json({
          message: "Vous avez déjà postulé à cette offre",
        });
      }

      const insertSql = `
        INSERT INTO candidatures (stagiaire_id, offre_id, statut)
        VALUES (?, ?, 'en_attente')
      `;

      db.query(insertSql, [stagiaireId, offre_id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Erreur lors de la candidature",
          });
        }

        const candidatureId = result.insertId;

const notifSql = `
  INSERT INTO notifications (user_id, message, type)
  SELECT entreprises.user_id, ?, 'candidature'
  FROM offres
  JOIN entreprises ON offres.entreprise_id = entreprises.id
  WHERE offres.id = ?
`;

db.query(
  notifSql,
  [`Nouvelle candidature reçue pour votre offre`, offre_id],
  (notifErr) => {
    if (notifErr) {
      console.error("Erreur notification:", notifErr);
    }

    res.status(201).json({
      message: "Candidature envoyée avec succès",
      candidatureId: candidatureId,
    });
  }
);
      });
    });
  });
};

// Stagiaire voit ses candidatures
exports.mesCandidatures = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      candidatures.id,
      candidatures.date_candidature,
      candidatures.statut,
      candidatures.motif_refus,
      offres.titre,
      offres.localisation,
      entreprises.nom_societe
    FROM candidatures
    JOIN stagiaires ON candidatures.stagiaire_id = stagiaires.id
    JOIN offres ON candidatures.offre_id = offres.id
    JOIN entreprises ON offres.entreprise_id = entreprises.id
    WHERE stagiaires.user_id = ?
    ORDER BY candidatures.date_candidature DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Entreprise voit les candidatures reçues
exports.candidaturesEntreprise = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      candidatures.id,
      candidatures.date_candidature,
      candidatures.statut,
      candidatures.motif_refus,
      offres.titre AS offre_titre,
      users.nom AS stagiaire_nom,
      users.email AS stagiaire_email,
      users.telephone AS stagiaire_telephone,
      stagiaires.niveau,
      stagiaires.specialite,
      stagiaires.localisation,
      stagiaires.competences
    FROM candidatures
    JOIN offres ON candidatures.offre_id = offres.id
    JOIN entreprises ON offres.entreprise_id = entreprises.id
    JOIN stagiaires ON candidatures.stagiaire_id = stagiaires.id
    JOIN users ON stagiaires.user_id = users.id
    WHERE entreprises.user_id = ?
    ORDER BY candidatures.date_candidature DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Entreprise accepte/refuse candidature
exports.updateStatut = (req, res) => {
  const { id } = req.params;
  const { statut, motif_refus } = req.body;

  if (!statut) {
    return res.status(400).json({ message: "Statut requis" });
  }

  const sql = `
    UPDATE candidatures
    SET statut = ?, motif_refus = ?
    WHERE id = ?
  `;

  db.query(sql, [statut, motif_refus || null, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur modification statut" });
    }

    const notifSql = `
  INSERT INTO notifications (user_id, message, type)
  SELECT users.id, ?, 'statut_candidature'
  FROM candidatures
  JOIN stagiaires ON candidatures.stagiaire_id = stagiaires.id
  JOIN users ON stagiaires.user_id = users.id
  WHERE candidatures.id = ?
`;

db.query(
  notifSql,
  [`Le statut de votre candidature est maintenant: ${statut}`, id],
  (notifErr) => {
    if (notifErr) {
      console.error("Erreur notification:", notifErr);
    }

    res.json({ message: "Statut de candidature mis à jour" });
  }
);
  });
};
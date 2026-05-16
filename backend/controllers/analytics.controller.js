const db = require("../config/db");

// Admin: statistiques générales
exports.getAnalytics = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM stagiaires) AS total_stagiaires,
      (SELECT COUNT(*) FROM entreprises) AS total_entreprises,
      (SELECT COUNT(*) FROM formateurs) AS total_formateurs,
      (SELECT COUNT(*) FROM offres) AS total_offres,
      (SELECT COUNT(*) FROM candidatures) AS total_candidatures,
      (SELECT COUNT(*) FROM documents) AS total_documents,
      (SELECT COUNT(*) FROM rapports) AS total_rapports,
      (SELECT COUNT(*) FROM conventions) AS total_conventions,
      (SELECT COUNT(*) FROM evaluations) AS total_evaluations
  `;

  db.query(sql, (err, mainStats) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur statistiques générales" });
    }

    const usersByRoleSql = `
      SELECT role, COUNT(*) AS total
      FROM users
      GROUP BY role
    `;

    const candidaturesByStatusSql = `
      SELECT statut, COUNT(*) AS total
      FROM candidatures
      GROUP BY statut
    `;

    const documentsByStatusSql = `
      SELECT statut, COUNT(*) AS total
      FROM documents
      GROUP BY statut
    `;

    const offresByStatusSql = `
      SELECT statut, COUNT(*) AS total
      FROM offres
      GROUP BY statut
    `;

    db.query(usersByRoleSql, (err, usersByRole) => {
      if (err) return res.status(500).json({ message: "Erreur users stats" });

      db.query(candidaturesByStatusSql, (err, candidaturesByStatus) => {
        if (err) return res.status(500).json({ message: "Erreur candidatures stats" });

        db.query(documentsByStatusSql, (err, documentsByStatus) => {
          if (err) return res.status(500).json({ message: "Erreur documents stats" });

          db.query(offresByStatusSql, (err, offresByStatus) => {
            if (err) return res.status(500).json({ message: "Erreur offres stats" });

            res.json({
              main: mainStats[0],
              usersByRole,
              candidaturesByStatus,
              documentsByStatus,
              offresByStatus,
            });
          });
        });
      });
    });
  });
};

// Admin: données export CSV
exports.exportData = (req, res) => {
  const sql = `
    SELECT 
      users.id,
      users.nom,
      users.email,
      users.role,
      users.telephone,
      users.statut,
      users.created_at
    FROM users
    ORDER BY users.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur export" });
    }

    res.json(results);
  });
};
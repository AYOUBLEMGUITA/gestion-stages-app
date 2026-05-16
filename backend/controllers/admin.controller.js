const db = require("../config/db");

// Admin: afficher tous les utilisateurs
exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT id, nom, email, role, telephone, statut, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Admin: changer statut user
exports.updateUserStatus = (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  if (!["actif", "inactif"].includes(statut)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  const sql = `
    UPDATE users 
    SET statut = ?
    WHERE id = ?
  `;

  db.query(sql, [statut, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur modification statut" });
    }

    res.json({ message: "Statut utilisateur mis à jour" });
  });
};

// Admin: supprimer user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur suppression utilisateur" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  });
};
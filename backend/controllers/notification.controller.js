const db = require("../config/db");

// Afficher notifications user connecté
exports.getMyNotifications = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY date_envoi DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Marquer une notification comme lue
exports.markAsRead = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const sql = `
    UPDATE notifications
    SET lu = 1
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [id, userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json({ message: "Notification marquée comme lue" });
  });
};

// Marquer toutes comme lues
exports.markAllAsRead = (req, res) => {
  const userId = req.user.id;

  const sql = `
    UPDATE notifications
    SET lu = 1
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json({ message: "Toutes les notifications sont marquées comme lues" });
  });
};

// Supprimer notification
exports.deleteNotification = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const sql = `
    DELETE FROM notifications
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [id, userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json({ message: "Notification supprimée" });
  });
};
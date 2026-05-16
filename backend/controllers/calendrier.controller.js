const db = require("../config/db");

// Afficher événements ديال user connecté
exports.getMyEvents = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM calendrier
    WHERE user_id = ?
    ORDER BY date_event ASC, heure ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Ajouter événement
exports.addEvent = (req, res) => {
  const userId = req.user.id;
  const { titre, description, date_event, heure, type } = req.body;

  if (!titre || !date_event) {
    return res.status(400).json({
      message: "Titre et date sont requis",
    });
  }

  const sql = `
    INSERT INTO calendrier (user_id, titre, description, date_event, heure, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [userId, titre, description || null, date_event, heure || null, type || "autre"],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur ajout événement" });
      }

      res.status(201).json({
        message: "Événement ajouté avec succès",
        eventId: result.insertId,
      });
    }
  );
};

// Supprimer événement
exports.deleteEvent = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const sql = `
    DELETE FROM calendrier
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [id, userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur suppression événement" });
    }

    res.json({ message: "Événement supprimé avec succès" });
  });
};
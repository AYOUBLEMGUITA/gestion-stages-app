const db = require("../config/db");

// Afficher utilisateurs باش نختارو destinataire
exports.getUsersForMessaging = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT id, nom, email, role
    FROM users
    WHERE id != ? AND statut = 'actif'
    ORDER BY nom ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

// Envoyer message
exports.sendMessage = (req, res) => {
  const expediteurId = req.user.id;
  const { destinataire_id, contenu } = req.body;

  if (!destinataire_id || !contenu) {
    return res.status(400).json({
      message: "Destinataire et contenu requis",
    });
  }

  const sql = `
    INSERT INTO messages (expediteur_id, destinataire_id, contenu)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [expediteurId, destinataire_id, contenu], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur envoi message" });
    }

    const notifSql = `
      INSERT INTO notifications (user_id, message, type)
      VALUES (?, ?, 'message')
    `;

    db.query(
      notifSql,
      [destinataire_id, "Vous avez reçu un nouveau message"],
      (notifErr) => {
        if (notifErr) {
          console.error("Erreur notification:", notifErr);
        }

        res.status(201).json({
          message: "Message envoyé avec succès",
          messageId: result.insertId,
        });
      }
    );
  });
};

// Conversation avec un utilisateur
exports.getConversation = (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  const sql = `
    SELECT 
      messages.*,
      expediteur.nom AS expediteur_nom,
      destinataire.nom AS destinataire_nom
    FROM messages
    JOIN users AS expediteur ON messages.expediteur_id = expediteur.id
    JOIN users AS destinataire ON messages.destinataire_id = destinataire.id
    WHERE 
      (messages.expediteur_id = ? AND messages.destinataire_id = ?)
      OR
      (messages.expediteur_id = ? AND messages.destinataire_id = ?)
    ORDER BY messages.created_at ASC
  `;

  db.query(sql, [userId, otherUserId, otherUserId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    const markReadSql = `
      UPDATE messages
      SET lu = 1
      WHERE expediteur_id = ? AND destinataire_id = ?
    `;

    db.query(markReadSql, [otherUserId, userId], () => {
      res.json(results);
    });
  });
};

// Inbox conversations
exports.getInbox = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      m.id,
      m.contenu,
      m.created_at,
      m.lu,
      CASE 
        WHEN m.expediteur_id = ? THEN m.destinataire_id
        ELSE m.expediteur_id
      END AS other_user_id,
      u.nom AS other_user_nom,
      u.email AS other_user_email,
      u.role AS other_user_role
    FROM messages m
    JOIN users u ON u.id = CASE 
      WHEN m.expediteur_id = ? THEN m.destinataire_id
      ELSE m.expediteur_id
    END
    WHERE m.id IN (
      SELECT MAX(id)
      FROM messages
      WHERE expediteur_id = ? OR destinataire_id = ?
      GROUP BY 
        LEAST(expediteur_id, destinataire_id),
        GREATEST(expediteur_id, destinataire_id)
    )
    ORDER BY m.created_at DESC
  `;

  db.query(sql, [userId, userId, userId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};
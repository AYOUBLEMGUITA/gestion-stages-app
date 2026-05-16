const db = require("../config/db");

// Chatbot simple basé على keywords
exports.chatbot = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message requis" });
  }

  const msg = message.toLowerCase();

  let reply =
    "Je peux vous aider concernant les stages, les documents, les candidatures, les conventions et les rapports.";

  if (msg.includes("document") || msg.includes("documents")) {
    reply =
      "Les documents nécessaires sont généralement : CV, lettre de motivation, CIN, assurance, convention, diplômes, relevés et rapport de stage.";
  } else if (msg.includes("candidature") || msg.includes("postuler")) {
    reply =
      "Pour postuler, allez dans la page Offres, choisissez une offre puis cliquez sur Postuler. Vous pouvez suivre l’état dans Mes candidatures.";
  } else if (msg.includes("convention")) {
    reply =
      "Pour créer une convention, allez dans Mes conventions, choisissez l’entreprise puis envoyez une demande. L’admin pourra ensuite la valider.";
  } else if (msg.includes("rapport")) {
    reply =
      "Vous pouvez déposer un rapport intermédiaire ou final dans la page Mes rapports. Le formateur ou l’admin peut ensuite le valider.";
  } else if (msg.includes("stage")) {
    reply =
      "Le suivi du stage passe par les candidatures, les documents, la convention, les rapports et l’évaluation finale.";
  } else if (msg.includes("admin")) {
    reply =
      "L’administrateur peut gérer les utilisateurs, valider les documents, suivre les conventions, consulter les rapports et voir les statistiques.";
  }

  res.json({
    reply,
  });
};

// Recommandation offres selon profil stagiaire
exports.recommendations = (req, res) => {
  const userId = req.user.id;

  const profileSql = `
    SELECT specialite, competences, localisation
    FROM stagiaires
    WHERE user_id = ?
  `;

  db.query(profileSql, [userId], (err, profileResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (profileResults.length === 0) {
      return res.status(404).json({
        message: "Profil stagiaire introuvable",
      });
    }

    const profile = profileResults[0];

    const sql = `
      SELECT 
        offres.*,
        entreprises.nom_societe,
        entreprises.secteur
      FROM offres
      JOIN entreprises ON offres.entreprise_id = entreprises.id
      WHERE offres.statut = 'active'
      AND (
        offres.competences LIKE ?
        OR offres.description LIKE ?
        OR offres.localisation LIKE ?
        OR entreprises.secteur LIKE ?
      )
      ORDER BY offres.created_at DESC
      LIMIT 6
    `;

    const specialite = `%${profile.specialite || ""}%`;
    const competences = `%${profile.competences || ""}%`;
    const localisation = `%${profile.localisation || ""}%`;

    db.query(
      sql,
      [competences, specialite, localisation, specialite],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Erreur recommandations" });
        }

        res.json(results);
      }
    );
  });
};
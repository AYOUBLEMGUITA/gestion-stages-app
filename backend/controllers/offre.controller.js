const db = require("../config/db");

const normalizeOffreInput = (body) => ({
  titre: body.titre,
  description: body.description,
  competences: body.competences || null,
  localisation: body.localisation,
  date_debut: body.date_debut || null,
  date_fin: body.date_fin || null,
  nombre_places: Number(body.nombre_places) || 1,
  statut: body.statut || "active",
});

async function getOrCreateEntrepriseId(userId) {
  let [entreprises] = await db.query("SELECT id FROM entreprises WHERE user_id = ?", [userId]);

  if (entreprises.length === 0) {
    await db.query(
      `
        INSERT INTO entreprises (user_id, nom_societe, contact)
        SELECT id, nom, telephone
        FROM users
        WHERE id = ?
      `,
      [userId] 
    );

    [entreprises] = await db.query("SELECT id FROM entreprises WHERE user_id = ?", [userId]);
  }

  return entreprises[0]?.id;
}

exports.createOffre = async (req, res) => {
  const userId = req.user.id;
  const {
    titre,
    description,
    competences,
    localisation,
    date_debut,
    date_fin,
    nombre_places,
  } = normalizeOffreInput(req.body);

  if (!titre || !description || !localisation) {
    return res.status(400).json({ message: "Titre, description et localisation sont requis" });
  }

  if (req.user.role !== "entreprise" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Seules les entreprises peuvent publier des offres" });
  }

  try {
    const entrepriseId = await getOrCreateEntrepriseId(userId);

    if (!entrepriseId) {
      return res.status(404).json({ message: "Profil entreprise introuvable" });
    }

    const [result] = await db.query(
      `
        INSERT INTO offres
          (entreprise_id, titre, description, competences, localisation, date_debut, date_fin, nombre_places)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        entrepriseId,
        titre,
        description,
        competences,
        localisation,
        date_debut,
        date_fin,
        nombre_places,
      ]
    );

    res.status(201).json({
      message: "Offre creee avec succes",
      offreId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la creation de l'offre" });
  }
};

exports.getAllOffres = (req, res) => {
  const sql = `
    SELECT
      offres.*,
      entreprises.nom_societe,
      entreprises.secteur
    FROM offres
    JOIN entreprises ON offres.entreprise_id = entreprises.id
    ORDER BY offres.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};

exports.getOffreById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      offres.*,
      entreprises.nom_societe,
      entreprises.secteur,
      entreprises.adresse,
      entreprises.contact
    FROM offres
    JOIN entreprises ON offres.entreprise_id = entreprises.id
    WHERE offres.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Offre introuvable" });
    }

    res.json(results[0]);
  });
};

exports.updateOffre = (req, res) => {
  const { id } = req.params;
  const {
    titre,
    description,
    competences,
    localisation,
    date_debut,
    date_fin,
    nombre_places,
    statut,
  } = normalizeOffreInput(req.body);

  const sql = `
    UPDATE offres
    SET titre = ?, description = ?, competences = ?, localisation = ?,
        date_debut = ?, date_fin = ?, nombre_places = ?, statut = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      titre,
      description,
      competences,
      localisation,
      date_debut,
      date_fin,
      nombre_places,
      statut,
      id,
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur modification offre" });
      }

      res.json({ message: "Offre modifiee avec succes" });
    }
  );
};

exports.deleteOffre = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM offres WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur suppression offre" });
    }

    res.json({ message: "Offre supprimee avec succes" });
  });
};
// Afficher les offres de l'entreprise connectée فقط
exports.getMesOffres = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      offres.*,
      entreprises.nom_societe,
      entreprises.secteur
    FROM offres
    JOIN entreprises ON offres.entreprise_id = entreprises.id
    WHERE entreprises.user_id = ?
    ORDER BY offres.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(results);
  });
};
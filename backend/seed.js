require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "gestion_stages",
  });

  const password = await bcrypt.hash("123456", 10);

  const users = [
    {
      nom: "Admin Principal",
      email: "admin@test.com",
      role: "admin",
      telephone: "0600000001",
    },
    {
      nom: "Ayoub Stagiaire",
      email: "stagiaire@test.com",
      role: "stagiaire",
      telephone: "0600000002",
    },
    {
      nom: "Tech Solutions",
      email: "entreprise@test.com",
      role: "entreprise",
      telephone: "0600000003",
    },
    {
      nom: "Prof Formateur",
      email: "formateur@test.com",
      role: "formateur",
      telephone: "0600000004",
    },
  ];

  for (const user of users) {
    await db.execute(
      `
      INSERT INTO users (nom, email, password, role, telephone, statut)
      VALUES (?, ?, ?, ?, ?, 'actif')
      ON DUPLICATE KEY UPDATE
        nom = VALUES(nom),
        role = VALUES(role),
        telephone = VALUES(telephone),
        statut = 'actif'
      `,
      [user.nom, user.email, password, user.role, user.telephone]
    );
  }

  const [stagiaireRows] = await db.execute(
    "SELECT id FROM users WHERE email = ?",
    ["stagiaire@test.com"]
  );
  const stagiaireUserId = stagiaireRows[0].id;

  await db.execute(
    `
    INSERT INTO stagiaires 
    (user_id, niveau, specialite, localisation, competences, statut_stage)
    SELECT ?, 'Technicien Spécialisé', 'Développement Digital', 'Agadir', 'React, Node.js, MySQL, Docker', 'en_recherche'
    WHERE NOT EXISTS (
      SELECT 1 FROM stagiaires WHERE user_id = ?
    )
    `,
    [stagiaireUserId, stagiaireUserId]
  );

  const [entrepriseRows] = await db.execute(
    "SELECT id FROM users WHERE email = ?",
    ["entreprise@test.com"]
  );
  const entrepriseUserId = entrepriseRows[0].id;

  await db.execute(
    `
    INSERT INTO entreprises 
    (user_id, nom_societe, secteur, adresse, contact, description)
    SELECT ?, 'Tech Solutions', 'Informatique', 'Agadir', '0611111111', 'Entreprise spécialisée en développement web'
    WHERE NOT EXISTS (
      SELECT 1 FROM entreprises WHERE user_id = ?
    )
    `,
    [entrepriseUserId, entrepriseUserId]
  );

  const [formateurRows] = await db.execute(
    "SELECT id FROM users WHERE email = ?",
    ["formateur@test.com"]
  );
  const formateurUserId = formateurRows[0].id;

  await db.execute(
    `
    INSERT INTO formateurs 
    (user_id, departement, specialite, nb_stagiaires)
    SELECT ?, 'Développement Digital', 'Web Full Stack', 0
    WHERE NOT EXISTS (
      SELECT 1 FROM formateurs WHERE user_id = ?
    )
    `,
    [formateurUserId, formateurUserId]
  );

  console.log("Demo accounts created successfully!");
  console.log("admin@test.com / 123456");
  console.log("stagiaire@test.com / 123456");
  console.log("entreprise@test.com / 123456");
  console.log("formateur@test.com / 123456");

  await db.end();
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
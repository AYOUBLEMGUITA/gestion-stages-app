const mysql = require("mysql2/promise");
require("dotenv").config();

const dbName = process.env.DB_NAME || "gestion_stages";

const connectionConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

const pool = mysql.createPool({
  ...connectionConfig,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let initialized = false;

async function ensureDatabase() {
  if (initialized) {
    return;
  }

  const connection = await mysql.createConnection(connectionConfig);

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(dbName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        telephone VARCHAR(30),
        statut VARCHAR(50) NOT NULL DEFAULT 'actif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stagiaires (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        cv VARCHAR(255),
        niveau VARCHAR(100),
        specialite VARCHAR(150),
        localisation VARCHAR(150),
        competences TEXT,
        statut_stage VARCHAR(50) DEFAULT 'en_recherche',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_stagiaires_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS formateurs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        specialite VARCHAR(150),
        telephone VARCHAR(30),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_formateurs_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS entreprises (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        nom_societe VARCHAR(150) NOT NULL,
        secteur VARCHAR(150),
        adresse VARCHAR(255),
        contact VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_entreprises_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS offres (
        id INT AUTO_INCREMENT PRIMARY KEY,
        entreprise_id INT NOT NULL,
        titre VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        competences TEXT,
        localisation VARCHAR(150) NOT NULL,
        date_debut DATE,
        date_fin DATE,
        nombre_places INT NOT NULL DEFAULT 1,
        statut VARCHAR(50) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_offres_entreprise
          FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidatures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stagiaire_id INT NOT NULL,
        offre_id INT NOT NULL,
        statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
        motif_refus TEXT,
        date_candidature TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_candidature (stagiaire_id, offre_id),
        CONSTRAINT fk_candidatures_stagiaire
          FOREIGN KEY (stagiaire_id) REFERENCES stagiaires(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_candidatures_offre
          FOREIGN KEY (offre_id) REFERENCES offres(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stagiaire_id INT NOT NULL,
        nom VARCHAR(150) NOT NULL,
        type VARCHAR(50) NOT NULL,
        chemin_fichier VARCHAR(255) NOT NULL,
        statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
        commentaire TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_documents_stagiaire
          FOREIGN KEY (stagiaire_id) REFERENCES stagiaires(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'info',
        lu TINYINT(1) NOT NULL DEFAULT 0,
        date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_notifications_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS calendrier (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        titre VARCHAR(150) NOT NULL,
        description TEXT,
        date_event DATE NOT NULL,
        heure TIME,
        type VARCHAR(50) NOT NULL DEFAULT 'autre',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_calendrier_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        expediteur_id INT NOT NULL,
        destinataire_id INT NOT NULL,
        contenu TEXT NOT NULL,
        lu TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_messages_expediteur
          FOREIGN KEY (expediteur_id) REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_messages_destinataire
          FOREIGN KEY (destinataire_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS suivis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stagiaire_id INT NOT NULL,
        formateur_id INT NOT NULL,
        mission VARCHAR(255),
        taches TEXT,
        competences_acquises TEXT,
        remarque TEXT NOT NULL,
        date_suivi DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_suivis_stagiaire
          FOREIGN KEY (stagiaire_id) REFERENCES stagiaires(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_suivis_formateur
          FOREIGN KEY (formateur_id) REFERENCES formateurs(id)
          ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        entreprise_id INT NOT NULL,
        stagiaire_id INT,
        date_eval DATE,
        note INT,
        commentaire TEXT,
        valide TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_evaluations_entreprise
          FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_evaluations_stagiaire
          FOREIGN KEY (stagiaire_id) REFERENCES stagiaires(id)
          ON DELETE SET NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS rapports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stagiaire_id INT,
        titre VARCHAR(150) NOT NULL,
        fichier VARCHAR(255),
        type VARCHAR(50),
        chemin_fichier VARCHAR(255),
        statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_rapports_stagiaire
          FOREIGN KEY (stagiaire_id) REFERENCES stagiaires(id)
          ON DELETE SET NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS conventions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stagiaire_id INT NOT NULL,
        entreprise_id INT NOT NULL,
        statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
        signature_elec TINYINT(1) NOT NULL DEFAULT 0,
        fichier_pdf VARCHAR(255),
        date_signature DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_convention (stagiaire_id, entreprise_id),
        CONSTRAINT fk_conventions_stagiaire
          FOREIGN KEY (stagiaire_id) REFERENCES stagiaires(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_conventions_entreprise
          FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
          ON DELETE CASCADE
      )
    `);

    await ensureColumn("notifications", "type", "VARCHAR(50) NOT NULL DEFAULT 'info'");
    await ensureColumn("notifications", "date_envoi", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("notifications", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("formateurs", "telephone", "VARCHAR(30)");
    await ensureColumn("formateurs", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("formateurs", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    await ensureColumn("rapports", "fichier", "VARCHAR(255)");
    await ensureColumn("rapports", "type", "VARCHAR(50)");
    await ensureColumn("rapports", "chemin_fichier", "VARCHAR(255)");
    await ensureColumn("evaluations", "date_eval", "DATE");
    await ensureColumn("evaluations", "valide", "TINYINT(1) NOT NULL DEFAULT 0");
    await ensureColumn("evaluations", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("stagiaires", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("stagiaires", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    await ensureColumn("entreprises", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("entreprises", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    await ensureColumn("offres", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    await ensureColumn("candidatures", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("candidatures", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    await ensureColumn("documents", "commentaire", "TEXT");
    await ensureColumn("documents", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    await ensureColumn("calendrier", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("calendrier", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    await ensureColumn("suivis", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("suivis", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    await ensureColumn("conventions", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn("conventions", "updated_at", "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

    initialized = true;
  } finally {
    await connection.end();
  }
}

async function ensureColumn(tableName, columnName, definition) {
  const [columns] = await pool.query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `,
    [dbName, tableName, columnName]
  );

  if (columns.length === 0) {
    await pool.query(
      `ALTER TABLE ${mysql.escapeId(tableName)} ADD COLUMN ${mysql.escapeId(columnName)} ${definition}`
    );
  }
}

function query(sql, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = [];
  }

  if (typeof callback === "function") {
    pool
      .query(sql, params)
      .then(([results]) => callback(null, results))
      .catch((error) => callback(error));
    return;
  }

  return pool.query(sql, params);
}

module.exports = {
  pool,
  query,
  ensureDatabase,
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.register = async (req, res) => {
  const { nom, email, password, role, telephone } = req.body;

  if (!nom || !email || !password || !role) {
    return res.status(400).json({ message: "Tous les champs obligatoires sont requis" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (nom, email, password, role, telephone)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nom, email, hashedPassword, role, telephone], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de l'inscription" });
      }

      if (role === "entreprise") {
        const entrepriseSql = `
          INSERT INTO entreprises (user_id, nom_societe, contact)
          VALUES (?, ?, ?)
        `;

        db.query(entrepriseSql, [result.insertId, nom, telephone], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erreur creation profil entreprise" });
          }

          res.status(201).json({
            message: "Utilisateur cree avec succes",
            userId: result.insertId,
          });
        });

        return;
      }

      if (role === "formateur") {
        const formateurSql = `
          INSERT INTO formateurs (user_id, telephone)
          VALUES (?, ?)
        `;

        db.query(formateurSql, [result.insertId, telephone], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erreur creation profil formateur" });
          }

          res.status(201).json({
            message: "Utilisateur cree avec succes",
            userId: result.insertId,
          });
        });

        return;
      }

      res.status(201).json({
        message: "Utilisateur cree avec succes",
        userId: result.insertId,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const user = results[0];
    let isMatch = false;

    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.error("Erreur verification mot de passe:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    if (user.statut === "inactif") {
      return res.status(403).json({
        message: "Votre compte est désactivé. Contactez l'administrateur.",
      });
    }

    let token;

    try {
      token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
    } catch (error) {
      console.error("Erreur creation token:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    return res.status(200).json({
      message: "Connexion reussie",
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        statut: user.statut,
      },
    });
  });
};

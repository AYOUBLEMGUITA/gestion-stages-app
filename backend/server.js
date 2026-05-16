const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const stagiaireRoutes = require("./routes/stagiaire.routes");
const { ensureDatabase } = require("./config/db");
const offreRoutes = require("./routes/offre.routes");
const candidatureRoutes = require("./routes/candidature.routes");
const documentRoutes = require("./routes/document.routes");
const adminRoutes = require("./routes/admin.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const entrepriseRoutes = require("./routes/entreprise.routes");
const notificationRoutes = require("./routes/notification.routes");
const suiviRoutes = require("./routes/suivi.routes");
const evaluationRoutes = require("./routes/evaluation.routes");
const rapportRoutes = require("./routes/rapport.routes");
const calendrierRoutes = require("./routes/calendrier.routes");
const messageRoutes = require("./routes/message.routes");
const conventionRoutes = require("./routes/convention.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const app = express();
const uploadsDir = path.join(__dirname, "uploads");
const aiRoutes = require("./routes/ai.routes");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/entreprise", entrepriseRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/suivis", suiviRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/rapports", rapportRoutes);
app.use("/api/calendrier", calendrierRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conventions", conventionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/uploads", express.static(uploadsDir));
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stagiaire", stagiaireRoutes);
app.use("/api/offres", offreRoutes);
app.use("/api/candidatures", candidatureRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Gestion des Stages fonctionne" });
});

const PORT = process.env.PORT || 5000;

ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur lance sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erreur initialisation base de donnees:", error);
    process.exit(1);
  });

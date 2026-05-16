import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        console.log("Erreur stats:", err.response?.data || err.message);
      }
    };

    fetchStats();
  }, [token]);

  const cardsByRole = {
    stagiaire: [
      { title: "Candidatures", value: stats.candidatures || 0 },
      { title: "Documents", value: stats.documents || 0 },
      { title: "Offres disponibles", value: stats.offres || 0 },
      { title: "Notifications", value: stats.notifications || 0 },
    ],

    entreprise: [
      { title: "Offres publiées", value: stats.offres || 0 },
      { title: "Candidatures reçues", value: stats.candidatures || 0 },
      { title: "Stagiaires acceptés", value: stats.acceptes || 0 },
      { title: "Évaluations", value: stats.evaluations || 0 },
    ],

    admin: [
      { title: "Utilisateurs", value: stats.utilisateurs || 0 },
      { title: "Documents à valider", value: stats.documents_attente || 0 },
      { title: "Entreprises", value: stats.entreprises || 0 },
      { title: "Rapports", value: stats.rapports || 0 },
    ],

    formateur: [
      { title: "Stagiaires suivis", value: stats.stagiaires || 0 },
      { title: "Rapports reçus", value: stats.rapports || 0 },
      { title: "Évaluations", value: stats.evaluations || 0 },
      { title: "Alertes", value: stats.alertes || 0 },
    ],
  };

  const cards = cardsByRole[user?.role] || [];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Bienvenue {user?.nom || "utilisateur"}, voici un aperçu de votre
            espace {user?.role}.
          </p>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={logout}
            className="w-fit rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            Déconnexion
          </button>
        )}
      </div>
      
<button
  onClick={() => navigate("/assistant-ia")}
  className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
>
  Assistant IA
</button>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <h2 className="mt-3 text-3xl font-bold text-blue-600">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-800">
          Espace {user?.role}
        </h2>
        <p className="mt-2 text-slate-500">
          Cette interface affiche uniquement les fonctionnalités adaptées à
          votre rôle.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;

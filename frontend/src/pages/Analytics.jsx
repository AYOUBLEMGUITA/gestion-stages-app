import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Analytics() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
    } catch (err) {
      setError("Impossible de charger les statistiques");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const exportUsersCSV = async () => {
    try {
      const res = await api.get("/analytics/export-users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rows = res.data;

      if (!rows.length) {
        alert("Aucune donnée à exporter");
        return;
      }

      const headers = Object.keys(rows[0]);

      const csvContent = [
        headers.join(";"),
        ...rows.map((row) =>
          headers
            .map((header) => {
              const value = row[header] ?? "";
              return `"${String(value).replace(/"/g, '""')}"`;
            })
            .join(";")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "utilisateurs_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Erreur lors de l'export CSV");
    }
  };

  const statCards = stats
    ? [
        { label: "Utilisateurs", value: stats.main.total_users },
        { label: "Stagiaires", value: stats.main.total_stagiaires },
        { label: "Entreprises", value: stats.main.total_entreprises },
        { label: "Formateurs", value: stats.main.total_formateurs },
        { label: "Offres", value: stats.main.total_offres },
        { label: "Candidatures", value: stats.main.total_candidatures },
        { label: "Documents", value: stats.main.total_documents },
        { label: "Rapports", value: stats.main.total_rapports },
        { label: "Conventions", value: stats.main.total_conventions },
        { label: "Évaluations", value: stats.main.total_evaluations },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Rapports & Statistiques
          </h1>
          <p className="text-sm text-slate-500">
            Tableau analytique global de la plateforme
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportUsersCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Export CSV
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        {!stats && !error && (
          <div className="bg-white rounded-2xl shadow p-8 text-slate-500">
            Chargement des statistiques...
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {statCards.map((card, index) => (
                <div key={index} className="bg-white rounded-2xl shadow p-6">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <h2 className="text-3xl font-bold text-blue-600 mt-2">
                    {card.value}
                  </h2>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Utilisateurs par rôle
                </h2>

                <div className="space-y-3">
                  {stats.usersByRole.map((item) => (
                    <div
                      key={item.role}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="capitalize text-slate-700">
                        {item.role}
                      </span>
                      <span className="font-bold text-blue-600">
                        {item.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Candidatures par statut
                </h2>

                <div className="space-y-3">
                  {stats.candidaturesByStatus.map((item) => (
                    <div
                      key={item.statut}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="text-slate-700">{item.statut}</span>
                      <span className="font-bold text-purple-600">
                        {item.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Documents par statut
                </h2>

                <div className="space-y-3">
                  {stats.documentsByStatus.map((item) => (
                    <div
                      key={item.statut}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="text-slate-700">{item.statut}</span>
                      <span className="font-bold text-green-600">
                        {item.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Offres par statut
                </h2>

                <div className="space-y-3">
                  {stats.offresByStatus.map((item) => (
                    <div
                      key={item.statut}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="text-slate-700">{item.statut}</span>
                      <span className="font-bold text-orange-600">
                        {item.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
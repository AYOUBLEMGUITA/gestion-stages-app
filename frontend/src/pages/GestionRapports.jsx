import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function GestionRapports() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [rapports, setRapports] = useState([]);
  const [error, setError] = useState("");

  const fetchRapports = async () => {
    try {
      const res = await api.get("/rapports/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRapports(res.data);
    } catch (err) {
      setError("Impossible de charger les rapports");
    }
  };

  useEffect(() => {
    fetchRapports();
  }, []);

  const updateStatus = async (id, statut) => {
    try {
      await api.put(
        `/rapports/${id}/status`,
        { statut },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchRapports();
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  const badgeColor = (statut) => {
    if (statut === "valide") return "bg-green-100 text-green-700";
    if (statut === "refuse") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Gestion des rapports
          </h1>
          <p className="text-sm text-slate-500">
            Validation des rapports intermédiaires et finaux des stagiaires
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4">Stagiaire</th>
                <th className="p-4">Email</th>
                <th className="p-4">Spécialité</th>
                <th className="p-4">Rapport</th>
                <th className="p-4">Type</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Fichier</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rapports.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-4 font-medium">{r.stagiaire_nom}</td>
                  <td className="p-4">{r.stagiaire_email}</td>
                  <td className="p-4">{r.specialite || "-"}</td>
                  <td className="p-4">{r.titre}</td>
                  <td className="p-4">{r.type}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${badgeColor(r.statut)}`}>
                      {r.statut}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={`http://localhost:5000/uploads/${r.fichier}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Voir
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateStatus(r.id, "valide")}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Valider
                      </button>

                      <button
                        onClick={() => updateStatus(r.id, "refuse")}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Refuser
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rapports.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucun rapport trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionRapports;
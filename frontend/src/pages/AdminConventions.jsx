import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminConventions() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [conventions, setConventions] = useState([]);
  const [error, setError] = useState("");

  const fetchConventions = async () => {
    try {
      const res = await api.get("/conventions/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConventions(res.data);
    } catch (err) {
      setError("Impossible de charger les conventions");
    }
  };

  useEffect(() => {
    fetchConventions();
  }, []);

  const updateStatus = async (id, statut) => {
    try {
      await api.put(
        `/conventions/${id}/status`,
        {
          statut,
          signature_elec: statut === "signee" || statut === "validee",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchConventions();
    } catch (err) {
      alert("Erreur modification convention");
    }
  };

  const deleteConvention = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette convention ?")) return;

    try {
      await api.delete(`/conventions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchConventions();
    } catch (err) {
      alert("Erreur suppression convention");
    }
  };

  const badgeColor = (statut) => {
    if (statut === "validee") return "bg-green-100 text-green-700";
    if (statut === "signee") return "bg-blue-100 text-blue-700";
    if (statut === "refusee") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Gestion des conventions
          </h1>
          <p className="text-sm text-slate-500">
            Validation administrative des conventions de stage
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
                <th className="p-4">Entreprise</th>
                <th className="p-4">Secteur</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Signature</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {conventions.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-4 font-medium">{c.stagiaire_nom}</td>
                  <td className="p-4">{c.stagiaire_email}</td>
                  <td className="p-4">{c.nom_societe}</td>
                  <td className="p-4">{c.secteur || "-"}</td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${badgeColor(c.statut)}`}>
                      {c.statut}
                    </span>
                  </td>

                  <td className="p-4">
                    {c.signature_elec ? "Signée" : "Non signée"}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateStatus(c.id, "signee")}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Signer
                      </button>

                      <button
                        onClick={() => updateStatus(c.id, "validee")}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Valider
                      </button>

                      <button
                        onClick={() => updateStatus(c.id, "refusee")}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Refuser
                      </button>

                      <button
                        onClick={() => deleteConvention(c.id)}
                        className="bg-slate-700 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {conventions.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucune convention trouvée.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConventions;
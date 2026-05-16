import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function MesConventions() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [entreprises, setEntreprises] = useState([]);
  const [conventions, setConventions] = useState([]);
  const [entrepriseId, setEntrepriseId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchEntreprises = useCallback(async () => {
    try {
      const res = await api.get("/conventions/entreprises", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEntreprises(res.data);
    } catch (err) {
      setError("Impossible de charger les entreprises");
    }
  }, [token]);

  const fetchConventions = useCallback(async () => {
    try {
      const res = await api.get("/conventions/mes-conventions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConventions(res.data);
    } catch (err) {
      setError("Impossible de charger vos conventions");
    }
  }, [token]);

  useEffect(() => {
    fetchEntreprises();
    fetchConventions();
  }, [fetchEntreprises, fetchConventions]);

  const createConvention = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post(
        "/conventions",
        { entreprise_id: entrepriseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Demande de convention créée avec succès");
      setEntrepriseId("");
      fetchConventions();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur création convention");
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
          <h1 className="text-xl font-bold text-slate-800">Mes conventions</h1>
          <p className="text-sm text-slate-500">
            Demandes et suivi des conventions de stage
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Nouvelle demande
          </h2>

          {message && (
            <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={createConvention} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Entreprise
              </label>
              <select
                required
                value={entrepriseId}
                onChange={(e) => setEntrepriseId(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Choisir une entreprise</option>
                {entreprises.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nom_societe} — {e.secteur || "Secteur non précisé"}
                  </option>
                ))}
              </select>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Créer demande
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4">Entreprise</th>
                <th className="p-4">Secteur</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Signature</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {conventions.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-4 font-medium">{c.nom_societe}</td>
                  <td className="p-4">{c.secteur || "-"}</td>
                  <td className="p-4">{c.contact || "-"}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${badgeColor(c.statut)}`}>
                      {c.statut}
                    </span>
                  </td>
                  <td className="p-4">
                    {c.signature_elec ? "Signée électroniquement" : "Non signée"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteConvention(c.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Supprimer
                    </button>
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

export default MesConventions;

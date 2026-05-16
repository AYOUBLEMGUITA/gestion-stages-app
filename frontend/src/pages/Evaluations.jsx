import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

function Evaluations() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  const [stagiaires, setStagiaires] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    stagiaire_id: "",
    note: "",
    commentaire: "",
  });

  const fetchStagiairesAcceptes = useCallback(async () => {
    if (user?.role !== "entreprise") return;

    try {
      const res = await api.get("/evaluations/stagiaires-acceptes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStagiaires(res.data);
    } catch (err) {
      setError("Impossible de charger les stagiaires acceptés");
    }
  }, [token, user?.role]);

  const fetchEvaluations = useCallback(async () => {
    try {
      const res = await api.get("/evaluations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvaluations(res.data);
    } catch (err) {
      setError("Impossible de charger les évaluations");
    }
  }, [token]);

  useEffect(() => {
    fetchStagiairesAcceptes();
    fetchEvaluations();
  }, [fetchStagiairesAcceptes, fetchEvaluations]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addEvaluation = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/evaluations", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Évaluation ajoutée avec succès");
      setForm({
        stagiaire_id: "",
        note: "",
        commentaire: "",
      });

      fetchEvaluations();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  const validerEvaluation = async (id) => {
    try {
      await api.put(
        `/evaluations/${id}/valider`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchEvaluations();
    } catch (err) {
      alert("Erreur lors de la validation");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Évaluations des stagiaires
          </h1>
          <p className="text-sm text-slate-500">
            Gestion des notes et commentaires de fin de stage
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>

      <div className="p-8 space-y-6">
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        {user?.role === "entreprise" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Ajouter une évaluation
            </h2>

            <form
              onSubmit={addEvaluation}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Stagiaire
                </label>
                <select
                  name="stagiaire_id"
                  value={form.stagiaire_id}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">Choisir un stagiaire</option>
                  {stagiaires.map((s) => (
                    <option key={s.stagiaire_id} value={s.stagiaire_id}>
                      {s.nom} — {s.offre_titre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Note /20
                </label>
                <input
                  type="number"
                  name="note"
                  min="0"
                  max="20"
                  step="0.5"
                  value={form.note}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm text-slate-600 mb-1">
                  Commentaire
                </label>
                <textarea
                  name="commentaire"
                  value={form.commentaire}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  rows="3"
                  placeholder="Commentaire sur le stagiaire..."
                />
              </div>

              <div className="md:col-span-3">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Enregistrer l’évaluation
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4">Stagiaire</th>
                <th className="p-4">Entreprise</th>
                <th className="p-4">Spécialité</th>
                <th className="p-4">Note</th>
                <th className="p-4">Commentaire</th>
                <th className="p-4">Date</th>
                <th className="p-4">Validation</th>
                {(user?.role === "admin" || user?.role === "formateur") && (
                  <th className="p-4">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {evaluations.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-4 font-medium">{e.stagiaire_nom}</td>
                  <td className="p-4">{e.nom_societe || "-"}</td>
                  <td className="p-4">{e.specialite || "-"}</td>
                  <td className="p-4">{e.note}/20</td>
                  <td className="p-4">{e.commentaire || "-"}</td>
                  <td className="p-4">
                    {e.date_eval
                      ? new Date(e.date_eval).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        e.valide
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {e.valide ? "validée" : "en attente"}
                    </span>
                  </td>

                  {(user?.role === "admin" || user?.role === "formateur") && (
                    <td className="p-4">
                      {!e.valide && (
                        <button
                          onClick={() => validerEvaluation(e.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Valider
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {evaluations.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucune évaluation trouvée.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Evaluations;

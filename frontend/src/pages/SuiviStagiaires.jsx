import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

function SuiviStagiaires() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getStoredUser();
  const canAddSuivi = user?.role === "formateur";

  const [stagiaires, setStagiaires] = useState([]);
  const [selected, setSelected] = useState(null);
  const [suivis, setSuivis] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    mission: "",
    taches: "",
    competences_acquises: "",
    remarque: "",
    date_suivi: "",
  });

  const fetchStagiaires = useCallback(async () => {
    try {
      const res = await api.get("/suivis/stagiaires", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStagiaires(res.data);
    } catch {
      setError("Impossible de charger les stagiaires");
    }
  }, [token]);

  const fetchSuivis = async (stagiaireId) => {
    try {
      const res = await api.get(`/suivis/stagiaire/${stagiaireId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuivis(res.data);
    } catch {
      setError("Impossible de charger l'historique");
    }
  };

  useEffect(() => {
    fetchStagiaires();
  }, [fetchStagiaires]);

  const selectStagiaire = (stagiaire) => {
    setSelected(stagiaire);
    fetchSuivis(stagiaire.stagiaire_id);
    setMessage("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addSuivi = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!canAddSuivi) {
      setError("Seul un formateur peut ajouter un suivi");
      return;
    }

    if (!selected) {
      setError("Veuillez choisir un stagiaire");
      return;
    }

    try {
      await api.post(
        "/suivis",
        {
          stagiaire_id: selected.stagiaire_id,
          ...form,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Suivi ajouté avec succès");
      setForm({
        mission: "",
        taches: "",
        competences_acquises: "",
        remarque: "",
        date_suivi: "",
      });

      fetchSuivis(selected.stagiaire_id);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout du suivi");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Suivi des stagiaires</h1>
          <p className="text-sm text-slate-500">
            Ajoutez des remarques et suivez l’avancement des stagiaires
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
            Liste des stagiaires
          </h2>

          <div className="space-y-3">
            {stagiaires.map((s) => (
              <button
                key={s.stagiaire_id}
                onClick={() => selectStagiaire(s)}
                className={`w-full text-left p-4 rounded-xl border ${
                  selected?.stagiaire_id === s.stagiaire_id
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="font-semibold text-slate-800">{s.nom}</p>
                <p className="text-sm text-slate-500">{s.specialite || "-"}</p>
                <p className="text-xs text-slate-400">{s.email}</p>
              </button>
            ))}

            {stagiaires.length === 0 && (
              <p className="text-slate-500 text-sm">Aucun stagiaire trouvé.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selected && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold text-slate-800">
                Fiche stagiaire
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                <p><b>Nom:</b> {selected.nom}</p>
                <p><b>Email:</b> {selected.email}</p>
                <p><b>Téléphone:</b> {selected.telephone || "-"}</p>
                <p><b>Niveau:</b> {selected.niveau || "-"}</p>
                <p><b>Spécialité:</b> {selected.specialite || "-"}</p>
                <p><b>Localisation:</b> {selected.localisation || "-"}</p>
                <p><b>Statut:</b> {selected.statut_stage || "-"}</p>
                <p><b>Compétences:</b> {selected.competences || "-"}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Ajouter un suivi
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

            <form onSubmit={addSuivi} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Mission</label>
                <input
                  name="mission"
                  value={form.mission}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Mission réalisée"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Date suivi</label>
                <input
                  type="date"
                  name="date_suivi"
                  value={form.date_suivi}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-600 mb-1">Tâches</label>
                <textarea
                  name="taches"
                  value={form.taches}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  rows="3"
                  placeholder="Tâches confiées au stagiaire"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-600 mb-1">
                  Compétences acquises
                </label>
                <textarea
                  name="competences_acquises"
                  value={form.competences_acquises}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  rows="3"
                  placeholder="Compétences développées"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-600 mb-1">Remarque</label>
                <textarea
                  name="remarque"
                  required
                  value={form.remarque}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  rows="3"
                  placeholder="Remarque du formateur"
                />
              </div>

              <div className="md:col-span-2">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Enregistrer le suivi
                </button>
              </div>
            </form>
          </div>

          {selected && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Historique du suivi
              </h2>

              <div className="space-y-4">
                {suivis.map((suivi) => (
                  <div key={suivi.id} className="border rounded-xl p-4">
                    <div className="flex justify-between">
                      <p className="font-semibold text-slate-800">
                        {suivi.mission || "Suivi"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {suivi.date_suivi
                          ? new Date(suivi.date_suivi).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 mt-2">
                      <b>Tâches:</b> {suivi.taches || "-"}
                    </p>

                    <p className="text-sm text-slate-600 mt-2">
                      <b>Compétences:</b> {suivi.competences_acquises || "-"}
                    </p>

                    <p className="text-sm text-slate-600 mt-2">
                      <b>Remarque:</b> {suivi.remarque || "-"}
                    </p>
                  </div>
                ))}

                {suivis.length === 0 && (
                  <p className="text-slate-500 text-sm">
                    Aucun suivi enregistré pour ce stagiaire.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuiviStagiaires;

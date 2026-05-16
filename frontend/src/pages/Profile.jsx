import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    niveau: "",
    specialite: "",
    localisation: "",
    competences: "",
    statut_stage: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/stagiaire/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setForm({
          nom: res.data.nom || "",
          email: res.data.email || "",
          telephone: res.data.telephone || "",
          niveau: res.data.niveau || "",
          specialite: res.data.specialite || "",
          localisation: res.data.localisation || "",
          competences: res.data.competences || "",
          statut_stage: res.data.statut_stage || "",
        });
      } catch {
        setError("Impossible de charger le profil");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.put("/stagiaire/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Profil mis à jour avec succès");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Mon profil</h1>
          <p className="text-sm text-slate-500">
            Gérez vos informations personnelles et académiques
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
        <div className="max-w-3xl bg-white rounded-2xl shadow p-8">
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Nom</label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Téléphone</label>
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Niveau</label>
              <input
                name="niveau"
                value={form.niveau}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Technicien Spécialisé"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Spécialité</label>
              <input
                name="specialite"
                value={form.specialite}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Développement Digital"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Localisation</label>
              <input
                name="localisation"
                value={form.localisation}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Agadir"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Compétences</label>
              <textarea
                name="competences"
                value={form.competences}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                rows="4"
                placeholder="React, Node.js, MySQL..."
              />
            </div>

            <div className="md:col-span-2">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;

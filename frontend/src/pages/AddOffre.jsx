import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AddOffre() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    titre: "",
    description: "",
    competences: "",
    localisation: "",
    date_debut: "",
    date_fin: "",
    nombre_places: 1,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      await api.post("/offres", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Offre ajoutée avec succès");

      setTimeout(() => {
        navigate("/offres");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Publier une offre</h1>
          <p className="text-sm text-slate-500">
            Ajouter une nouvelle offre de stage
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
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Titre</label>
              <input
                name="titre"
                required
                value={form.titre}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Développeur React stagiaire"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Description</label>
              <textarea
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                rows="4"
                placeholder="Description de l'offre..."
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Compétences</label>
              <input
                name="competences"
                value={form.competences}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="React, Node.js, MySQL"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Localisation</label>
              <input
                name="localisation"
                required
                value={form.localisation}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Agadir"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Date début</label>
              <input
                type="date"
                name="date_debut"
                value={form.date_debut}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Date fin</label>
              <input
                type="date"
                name="date_fin"
                value={form.date_fin}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Nombre de places</label>
              <input
                type="number"
                name="nombre_places"
                value={form.nombre_places}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Publier l'offre
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddOffre;
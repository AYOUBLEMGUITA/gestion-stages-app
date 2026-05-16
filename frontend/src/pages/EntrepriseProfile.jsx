import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function EntrepriseProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    nom_societe: "",
    secteur: "",
    adresse: "",
    contact: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/entreprise/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setForm({
          nom: res.data.nom || "",
          email: res.data.email || "",
          telephone: res.data.telephone || "",
          nom_societe: res.data.nom_societe || "",
          secteur: res.data.secteur || "",
          adresse: res.data.adresse || "",
          contact: res.data.contact || "",
          description: res.data.description || "",
        });
      } catch {
        setError("Impossible de charger le profil entreprise");
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
      await api.put("/entreprise/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Profil entreprise mis à jour avec succès");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Profil entreprise
          </h1>
          <p className="text-sm text-slate-500">
            Gérez les informations de votre entreprise
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
        <div className="max-w-4xl bg-white rounded-2xl shadow p-8">
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

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Nom responsable
              </label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Email
              </label>
              <input
                name="email"
                value={form.email}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Téléphone
              </label>
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Nom société
              </label>
              <input
                name="nom_societe"
                required
                value={form.nom_societe}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Tech Solutions"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Secteur
              </label>
              <input
                name="secteur"
                value={form.secteur}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Informatique"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Adresse
              </label>
              <input
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Agadir"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Contact
              </label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="0611111111"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                rows="4"
                placeholder="Description de l'entreprise..."
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

export default EntrepriseProfile;

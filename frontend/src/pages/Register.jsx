import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    role: "stagiaire",
    telephone: "",
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
      await api.post("/auth/register", form);
      setMessage("Compte créé avec succès");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          Créer un compte
        </h1>
        <p className="text-slate-500 text-center mt-2">
          Inscrivez-vous à la plateforme
        </p>

        {message && (
          <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Rôle</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="stagiaire">Stagiaire</option>
              <option value="entreprise">Entreprise</option>
              <option value="formateur">Formateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Téléphone
            </label>
            <input
              type="text"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0600000000"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            S'inscrire
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
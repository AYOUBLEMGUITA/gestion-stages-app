import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data?.token || !res.data?.user) {
        setError("Reponse de connexion invalide");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          Gestion des Stages
        </h1>
        <p className="text-slate-500 text-center mt-2">
          Connectez-vous à votre espace
        </p>

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
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
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

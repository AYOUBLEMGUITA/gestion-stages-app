import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function MesRapports() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [rapports, setRapports] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    type: "intermediaire",
    fichier: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchRapports = async () => {
    try {
      const res = await api.get("/rapports/mes-rapports", {
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

  const handleChange = (e) => {
    if (e.target.name === "fichier") {
      setForm({
        ...form,
        fichier: e.target.files[0],
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const uploadRapport = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.fichier) {
      setError("Veuillez choisir un fichier PDF");
      return;
    }

    const formData = new FormData();
    formData.append("titre", form.titre);
    formData.append("type", form.type);
    formData.append("fichier", form.fichier);

    try {
      await api.post("/rapports/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Rapport déposé avec succès");
      setForm({
        titre: "",
        type: "intermediaire",
        fichier: null,
      });

      document.getElementById("rapportFile").value = "";
      fetchRapports();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du dépôt");
    }
  };

  const deleteRapport = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce rapport ?")) return;

    try {
      await api.delete(`/rapports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchRapports();
    } catch (err) {
      alert("Erreur lors de la suppression");
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
          <h1 className="text-xl font-bold text-slate-800">Mes rapports</h1>
          <p className="text-sm text-slate-500">
            Déposez vos rapports intermédiaires et finaux
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
            Déposer un rapport
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

          <form onSubmit={uploadRapport} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Titre
              </label>
              <input
                name="titre"
                required
                value={form.titre}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Rapport de stage"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="intermediaire">Intermédiaire</option>
                <option value="final">Final</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Fichier PDF
              </label>
              <input
                id="rapportFile"
                type="file"
                name="fichier"
                accept=".pdf"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Déposer
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4">Titre</th>
                <th className="p-4">Type</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Fichier</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {rapports.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-4 font-medium">{r.titre}</td>
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
                    <button
                      onClick={() => deleteRapport(r.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rapports.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucun rapport déposé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MesRapports;
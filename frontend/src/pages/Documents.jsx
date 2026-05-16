import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Documents() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    type: "cv",
    fichier: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    api
      .get("/documents/mes-documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (!ignore) {
          setDocuments(res.data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Impossible de charger les documents");
        }
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const reloadDocuments = async () => {
    const res = await api.get("/documents/mes-documents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDocuments(res.data);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.fichier) {
      setError("Veuillez choisir un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("nom", form.nom);
    formData.append("type", form.type);
    formData.append("fichier", form.fichier);

    try {
      await api.post("/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Document ajouté avec succès");
      setForm({
        nom: "",
        type: "cv",
        fichier: null,
      });

      document.getElementById("fichier").value = "";
      await reloadDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'upload");
    }
  };

  const deleteDocument = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce document ?")) return;

    try {
      await api.delete(`/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await reloadDocuments();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const badgeColor = (statut) => {
    if (statut === "valide") return "bg-green-100 text-green-700";
    if (statut === "refuse") return "bg-red-100 text-red-700";
    if (statut === "manquant") return "bg-gray-100 text-gray-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Mes documents</h1>
          <p className="text-sm text-slate-500">
            Déposez et suivez vos documents administratifs
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
            Ajouter un document
          </h2>

          {message && (
            <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Nom du document
              </label>
              <input
                name="nom"
                required
                value={form.nom}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Mon CV"
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
                <option value="cv">CV</option>
                <option value="lettre_motivation">Lettre de motivation</option>
                <option value="convention">Convention</option>
                <option value="cin">CIN</option>
                <option value="assurance">Assurance</option>
                <option value="diplome">Diplôme</option>
                <option value="releve">Relevé</option>
                <option value="rapport">Rapport</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Fichier PDF/Image
              </label>
              <input
                id="fichier"
                type="file"
                name="fichier"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Uploader
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Liste des documents
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4">Nom</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Fichier</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-t">
                    <td className="p-4 font-medium">{doc.nom}</td>
                    <td className="p-4">{doc.type}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${badgeColor(doc.statut)}`}>
                        {doc.statut}
                      </span>
                    </td>
                    <td className="p-4">
                      <a
                        href={`http://localhost:5000/uploads/${doc.chemin_fichier}`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Voir
                      </a>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {documents.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                Aucun document ajouté.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documents;

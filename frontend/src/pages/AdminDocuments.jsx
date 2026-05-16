import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminDocuments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    api
      .get("/documents/admin/all", {
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
    const res = await api.get("/documents/admin/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDocuments(res.data);
  };

  const updateStatus = async (id, statut) => {
    try {
      await api.put(
        `/documents/admin/${id}/status`,
        { statut },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await reloadDocuments();
    } catch {
      alert("Erreur lors de la modification du statut");
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
          <h1 className="text-xl font-bold text-slate-800">
            Validation des documents
          </h1>
          <p className="text-sm text-slate-500">
            Espace administrateur pour valider les dossiers des stagiaires
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
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4">Stagiaire</th>
                <th className="p-4">Email</th>
                <th className="p-4">Document</th>
                <th className="p-4">Type</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Fichier</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t">
                  <td className="p-4 font-medium">{doc.stagiaire_nom}</td>
                  <td className="p-4">{doc.stagiaire_email}</td>
                  <td className="p-4">{doc.nom}</td>
                  <td className="p-4">{doc.type}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${badgeColor(
                        doc.statut
                      )}`}
                    >
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
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateStatus(doc.id, "valide")}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Valider
                      </button>

                      <button
                        onClick={() => updateStatus(doc.id, "refuse")}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Refuser
                      </button>

                      <button
                        onClick={() => updateStatus(doc.id, "manquant")}
                        className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Manquant
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {documents.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucun document trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDocuments;

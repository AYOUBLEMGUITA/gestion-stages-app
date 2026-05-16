import { useEffect, useState } from "react";
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

function Offres() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  const canAddOffre = user?.role === "entreprise";
  const canManageOffres = user?.role === "entreprise" || user?.role === "admin";
  const canPostuler = user?.role === "stagiaire";
  const endpoint = user?.role === "entreprise" ? "/offres/mes-offres" : "/offres";

  const [offres, setOffres] = useState([]);
  const [error, setError] = useState("");

  const loadOffres = async () => {
    const res = await api.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOffres(res.data);
  };

  useEffect(() => {
    let ignore = false;

    api
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (!ignore) {
          setOffres(res.data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Impossible de charger les offres");
        }
      });

    return () => {
      ignore = true;
    };
  }, [endpoint, token]);

  const postuler = async (offreId) => {
    try {
      await api.post(
        "/candidatures/postuler",
        { offre_id: offreId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Candidature envoyee avec succes");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la candidature");
    }
  };

  const deleteOffre = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    try {
      await api.delete(`/offres/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadOffres();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {user?.role === "entreprise" ? "Mes offres publiees" : "Offres de stage"}
          </h1>
          <p className="text-sm text-slate-500">
            {user?.role === "entreprise"
              ? "Gerez les offres publiees par votre entreprise"
              : "Consultez les offres disponibles"}
          </p>
        </div>

        <div className="flex gap-3">
          {canAddOffre && (
            <button
              onClick={() => navigate("/add-offre")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Ajouter offre
            </button>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offres.map((offre) => (
            <div key={offre.id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-start gap-3">
                <h2 className="text-lg font-bold text-slate-800">
                  {offre.titre}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    offre.statut === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {offre.statut}
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-2">
                {offre.nom_societe} - {offre.localisation}
              </p>

              <p className="text-sm text-slate-600 mt-4 line-clamp-3">
                {offre.description}
              </p>

              <div className="mt-4">
                <p className="text-xs text-slate-500">Competences</p>
                <p className="text-sm text-slate-700">{offre.competences}</p>
              </div>

              <div className="mt-5 flex gap-2 flex-wrap justify-between items-center">
                <span className="text-sm text-slate-500">
                  Places: {offre.nombre_places}
                </span>

                {canPostuler && (
                  <button
                    onClick={() => postuler(offre.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Postuler
                  </button>
                )}

                {canManageOffres && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/offres/${offre.id}/edit`)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => deleteOffre(offre.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {offres.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
            Aucune offre disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

export default Offres;

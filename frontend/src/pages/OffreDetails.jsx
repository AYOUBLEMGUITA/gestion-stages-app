import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

function OffreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = getStoredUser();

  const [offre, setOffre] = useState(null);
  const [error, setError] = useState("");

  const fetchOffre = useCallback(async () => {
    try {
      const res = await api.get(`/offres/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOffre(res.data);
    } catch {
      setError("Impossible de charger les détails de l'offre");
    }
  }, [id, token]);

  useEffect(() => {
    fetchOffre();
  }, [fetchOffre]);

  const postuler = async () => {
    try {
      await api.post(
        "/candidatures/postuler",
        { offre_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Candidature envoyée avec succès");
      navigate("/mes-candidatures");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la candidature");
    }
  };

  const deleteOffre = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    try {
      await api.delete(`/offres/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/offres");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>

        <button
          onClick={() => navigate("/offres")}
          className="mt-4 bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Détails de l'offre
          </h1>
          <p className="text-sm text-slate-500">
            Consultez les informations complètes de cette offre
          </p>
        </div>

        <button
          onClick={() => navigate("/offres")}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {offre.titre}
              </h2>

              <p className="text-slate-500 mt-2">
                {offre.nom_societe} — {offre.localisation}
              </p>
            </div>

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

          <div className="mt-8">
            <h3 className="font-bold text-slate-800 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">
              {offre.description}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-slate-800 mb-2">Compétences requises</h3>
            <p className="text-slate-600">{offre.competences || "Non précisé"}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Date début</p>
              <p className="font-semibold text-slate-800">
                {offre.date_debut
                  ? new Date(offre.date_debut).toLocaleDateString()
                  : "Non précisé"}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Date fin</p>
              <p className="font-semibold text-slate-800">
                {offre.date_fin
                  ? new Date(offre.date_fin).toLocaleDateString()
                  : "Non précisé"}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Nombre de places</p>
              <p className="font-semibold text-slate-800">
                {offre.nombre_places}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3 flex-wrap">
            {user?.role === "stagiaire" && (
              <button
                onClick={postuler}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Postuler maintenant
              </button>
            )}

            {user?.role === "entreprise" && (
              <>
                <button
                  onClick={() => navigate(`/offres/${offre.id}/edit`)}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Modifier
                </button>

                <button
                  onClick={deleteOffre}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Supprimer
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Informations entreprise
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-slate-500">Société</p>
              <p className="font-semibold text-slate-800">
                {offre.nom_societe || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Secteur</p>
              <p className="font-semibold text-slate-800">
                {offre.secteur || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Adresse</p>
              <p className="font-semibold text-slate-800">
                {offre.adresse || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Contact</p>
              <p className="font-semibold text-slate-800">
                {offre.contact || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OffreDetails;

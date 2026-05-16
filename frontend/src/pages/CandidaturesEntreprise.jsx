import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CandidaturesEntreprise() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [candidatures, setCandidatures] = useState([]);

  useEffect(() => {
    let ignore = false;

    api
      .get("/candidatures/entreprise", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (!ignore) {
          setCandidatures(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const updateStatut = async (id, statut) => {
    await api.put(
      `/candidatures/${id}/statut`,
      { statut },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const res = await api.get("/candidatures/entreprise", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCandidatures(res.data);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Candidatures reçues
          </h1>
          <p className="text-sm text-slate-500">
            Gérez les candidats de vos offres
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>

      <div className="p-8 space-y-4">
        {candidatures.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {c.stagiaire_nom}
                </h2>
                <p className="text-sm text-slate-500">{c.stagiaire_email}</p>
                <p className="text-sm text-slate-500">{c.stagiaire_telephone}</p>

                <div className="mt-4 text-sm text-slate-700">
                  <p><b>Offre:</b> {c.offre_titre}</p>
                  <p><b>Niveau:</b> {c.niveau}</p>
                  <p><b>Spécialité:</b> {c.specialite}</p>
                  <p><b>Compétences:</b> {c.competences}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                  {c.statut}
                </span>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => updateStatut(c.id, "acceptee")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Accepter
                  </button>

                  <button
                    onClick={() => updateStatut(c.id, "refusee")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {candidatures.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
            Aucune candidature reçue.
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidaturesEntreprise;

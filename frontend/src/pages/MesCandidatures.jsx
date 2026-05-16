import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function MesCandidatures() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [candidatures, setCandidatures] = useState([]);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const res = await api.get("/candidatures/mes-candidatures", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCandidatures(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCandidatures();
  }, [token]);

  const badgeColor = (statut) => {
    if (statut === "acceptee") return "bg-green-100 text-green-700";
    if (statut === "refusee") return "bg-red-100 text-red-700";
    if (statut === "validee") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Mes candidatures</h1>
          <p className="text-sm text-slate-500">
            Suivez l’état de vos candidatures
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
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4">Offre</th>
                <th className="p-4">Entreprise</th>
                <th className="p-4">Localisation</th>
                <th className="p-4">Date</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>

            <tbody>
              {candidatures.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-4 font-medium">{c.titre}</td>
                  <td className="p-4">{c.nom_societe}</td>
                  <td className="p-4">{c.localisation}</td>
                  <td className="p-4">
                    {new Date(c.date_candidature).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${badgeColor(c.statut)}`}>
                      {c.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {candidatures.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Vous n’avez encore envoyé aucune candidature.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MesCandidatures;
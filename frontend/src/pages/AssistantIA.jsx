import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AssistantIA() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      from: "bot",
      text: "Bonjour 👋 Je suis votre assistant IA. Posez-moi une question sur les stages, les documents, les candidatures ou les conventions.",
    },
  ]);

  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = useCallback(async () => {
    if (user?.role !== "stagiaire") return;

    try {
      const res = await api.get("/ai/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecommendations(res.data);
    } catch (err) {
      console.log("Aucune recommandation");
    }
  }, [token, user?.role]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = message;

    setChat((prev) => [...prev, { from: "user", text: userMessage }]);
    setMessage("");

    try {
      const res = await api.post(
        "/ai/chatbot",
        { message: userMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChat((prev) => [...prev, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Désolé, une erreur est survenue. Veuillez réessayer.",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Assistant IA</h1>
          <p className="text-sm text-slate-500">
            Aide intelligente pour la gestion des stages
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
        <div className="lg:col-span-2 bg-white rounded-2xl shadow flex flex-col h-[650px]">
          <div className="border-b px-6 py-4">
            <h2 className="font-bold text-slate-800">Chatbot</h2>
            <p className="text-sm text-slate-500">
              Posez une question concernant la procédure de stage
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {chat.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    item.from === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="border-t p-4 flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Ex: Quels documents dois-je déposer ?"
            />

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              Envoyer
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Offres recommandées
          </h2>

          {user?.role !== "stagiaire" && (
            <p className="text-slate-500 text-sm">
              Les recommandations sont disponibles pour les stagiaires.
            </p>
          )}

          {user?.role === "stagiaire" && recommendations.length === 0 && (
            <p className="text-slate-500 text-sm">
              Aucune recommandation disponible pour le moment. Complétez votre
              profil pour améliorer les suggestions.
            </p>
          )}

          <div className="space-y-4">
            {recommendations.map((offre) => (
              <div key={offre.id} className="border rounded-xl p-4">
                <h3 className="font-bold text-slate-800">{offre.titre}</h3>

                <p className="text-sm text-slate-500 mt-1">
                  {offre.nom_societe} — {offre.localisation}
                </p>

                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {offre.description}
                </p>

                <button
                  onClick={() => navigate(`/offres/${offre.id}`)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Voir détail
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssistantIA;

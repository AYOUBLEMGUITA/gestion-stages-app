import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

function Messagerie() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  const [users, setUsers] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [contenu, setContenu] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/messages/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (err) {
      setError("Impossible de charger les utilisateurs");
    }
  };

  const fetchInbox = async () => {
    try {
      const res = await api.get("/messages/inbox", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInbox(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchConversation = async (otherUser) => {
    try {
      setSelectedUser(otherUser);

      const res = await api.get(`/messages/conversation/${otherUser.id || otherUser.other_user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConversation(res.data);
      fetchInbox();
    } catch (err) {
      setError("Impossible de charger la conversation");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchInbox();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert("Veuillez choisir un utilisateur");
      return;
    }

    if (!contenu.trim()) {
      return;
    }

    const destinataireId = selectedUser.id || selectedUser.other_user_id;

    try {
      await api.post(
        "/messages",
        {
          destinataire_id: destinataireId,
          contenu,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContenu("");

      const other = {
        id: destinataireId,
        nom: selectedUser.nom || selectedUser.other_user_nom,
        email: selectedUser.email || selectedUser.other_user_email,
        role: selectedUser.role || selectedUser.other_user_role,
      };

      fetchConversation(other);
      fetchInbox();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Messagerie</h1>
          <p className="text-sm text-slate-500">
            Communication interne entre stagiaires, entreprises, formateurs et admin
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-slate-800 mb-4">Conversations</h2>

          <div className="space-y-2">
            {inbox.map((item) => (
              <button
                key={item.id}
                onClick={() => fetchConversation(item)}
                className={`w-full text-left p-3 rounded-xl border ${
                  selectedUser?.other_user_id === item.other_user_id ||
                  selectedUser?.id === item.other_user_id
                    ? "bg-blue-50 border-blue-600"
                    : "bg-white border-slate-200"
                }`}
              >
                <p className="font-semibold text-slate-800">
                  {item.other_user_nom}
                </p>
                <p className="text-xs text-slate-400">
                  {item.other_user_role}
                </p>
                <p className="text-sm text-slate-500 truncate mt-1">
                  {item.contenu}
                </p>
              </button>
            ))}

            {inbox.length === 0 && (
              <p className="text-sm text-slate-500">Aucune conversation.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-slate-800 mb-4">Nouveau message</h2>

          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => fetchConversation(u)}
                className={`w-full text-left p-3 rounded-xl border ${
                  selectedUser?.id === u.id || selectedUser?.other_user_id === u.id
                    ? "bg-blue-50 border-blue-600"
                    : "bg-white border-slate-200"
                }`}
              >
                <p className="font-semibold text-slate-800">{u.nom}</p>
                <p className="text-xs text-slate-400">
                  {u.role} — {u.email}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow flex flex-col h-[650px]">
          <div className="border-b px-6 py-4">
            {selectedUser ? (
              <>
                <h2 className="font-bold text-slate-800">
                  {selectedUser.nom || selectedUser.other_user_nom}
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedUser.role || selectedUser.other_user_role}
                </p>
              </>
            ) : (
              <h2 className="font-bold text-slate-800">
                Choisissez une conversation
              </h2>
            )}
          </div>

          {error && (
            <div className="m-4 bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {conversation.map((msg) => {
              const isMine = msg.expediteur_id === user?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      isMine
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-sm">{msg.contenu}</p>
                    <p
                      className={`text-xs mt-2 ${
                        isMine ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}

            {selectedUser && conversation.length === 0 && (
              <div className="text-center text-slate-500 mt-20">
                Aucun message. Commencez la conversation.
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t p-4 flex gap-3">
            <input
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              disabled={!selectedUser}
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder={
                selectedUser
                  ? "Écrire un message..."
                  : "Choisissez un utilisateur d'abord"
              }
            />

            <button
              disabled={!selectedUser}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-slate-300"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Messagerie;
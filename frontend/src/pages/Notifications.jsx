import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Notifications() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data);
    } catch {
      setError("Impossible de charger les notifications");
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.put(
        `/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch {
      alert("Erreur lors de la modification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(
        "/notifications/read-all/all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch {
      alert("Erreur lors de la modification");
    }
  };

  const deleteNotification = async (id) => {
    if (!confirm("Supprimer cette notification ?")) return;

    try {
      await api.delete(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotifications();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500">
            Consultez les dernières notifications de votre compte
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Tout marquer comme lu
          </button>

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

        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-2xl shadow p-6 border-l-4 ${
                notif.lu ? "border-slate-300" : "border-blue-600"
              }`}
            >
              <div className="flex justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-800">
                      {notif.type || "notification"}
                    </h2>

                    {!notif.lu && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 mt-2">{notif.message}</p>

                  <p className="text-xs text-slate-400 mt-3">
                    {new Date(notif.date_envoi).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                  {!notif.lu && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Marquer lu
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
              Aucune notification pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;

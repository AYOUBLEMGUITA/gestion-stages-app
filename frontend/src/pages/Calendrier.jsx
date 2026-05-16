import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Calendrier() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    date_event: "",
    heure: "",
    type: "autre",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get("/calendrier", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(res.data);
    } catch (err) {
      setError("Impossible de charger le calendrier");
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addEvent = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/calendrier", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Événement ajouté avec succès");
      setForm({
        titre: "",
        description: "",
        date_event: "",
        heure: "",
        type: "autre",
      });

      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet événement ?")) return;

    try {
      await api.delete(`/calendrier/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEvents();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const typeColor = (type) => {
    if (type === "reunion") return "bg-blue-100 text-blue-700";
    if (type === "visite") return "bg-green-100 text-green-700";
    if (type === "deadline") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Calendrier</h1>
          <p className="text-sm text-slate-500">
            Planifiez vos réunions, visites et deadlines
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
            Ajouter un événement
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

          <form onSubmit={addEvent} className="space-y-4">
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
                placeholder="Réunion de suivi"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                rows="3"
                placeholder="Détails de l'événement..."
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date_event"
                required
                value={form.date_event}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Heure
              </label>
              <input
                type="time"
                name="heure"
                value={form.heure}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
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
                <option value="reunion">Réunion</option>
                <option value="visite">Visite</option>
                <option value="deadline">Deadline</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Ajouter
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Mes événements
          </h2>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border rounded-xl p-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800">
                      {event.titre}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${typeColor(
                        event.type
                      )}`}
                    >
                      {event.type}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mt-2">
                    {event.description || "Aucune description"}
                  </p>

                  <p className="text-sm text-slate-500 mt-3">
                    📅{" "}
                    {event.date_event
                      ? new Date(event.date_event).toLocaleDateString()
                      : "-"}{" "}
                    {event.heure ? `à ${event.heure}` : ""}
                  </p>
                </div>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}

            {events.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                Aucun événement planifié.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendrier;

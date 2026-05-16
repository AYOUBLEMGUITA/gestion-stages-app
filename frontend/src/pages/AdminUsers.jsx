import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminUsers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    api
      .get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (!ignore) {
          setUsers(res.data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Impossible de charger les utilisateurs");
        }
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const reloadUsers = async () => {
    const res = await api.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);
  };

  const updateStatus = async (id, statut) => {
    try {
      await api.put(
        `/admin/users/${id}/status`,
        { statut },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await reloadUsers();
    } catch {
      alert("Erreur lors de la modification du statut");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      await api.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await reloadUsers();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const roleColor = (role) => {
    if (role === "admin") return "bg-slate-800 text-white";
    if (role === "entreprise") return "bg-green-100 text-green-700";
    if (role === "formateur") return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  const statutColor = (statut) => {
    if (statut === "actif") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Gestion des utilisateurs
          </h1>
          <p className="text-sm text-slate-500">
            Espace administrateur pour gérer les comptes utilisateurs
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
                <th className="p-4">Nom</th>
                <th className="p-4">Email</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date création</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-4 font-medium">{u.nom}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.telephone || "-"}</td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${roleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${statutColor(u.statut)}`}>
                      {u.statut}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateStatus(u.id, "actif")}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Activer
                      </button>

                      <button
                        onClick={() => updateStatus(u.id, "inactif")}
                        className="bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Désactiver
                      </button>

                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucun utilisateur trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;

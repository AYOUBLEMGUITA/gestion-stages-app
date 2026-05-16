import { useLocation, useNavigate } from "react-router-dom";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const sidebarItemsByRole = {
  stagiaire: [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Mon profil", path: "/profile" },
    { label: "Offres", path: "/offres" },
    { label: "Mes candidatures", path: "/mes-candidatures" },
    { label: "Documents", path: "/documents" },
    { label: "Mes rapports", path: "/mes-rapports" },
    { label: "Mes conventions", path: "/mes-conventions" },
  ],

  entreprise: [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Profil entreprise", path: "/entreprise/profile" },
    { label: "Mes offres", path: "/offres" },
    { label: "Publier une offre", path: "/add-offre" },
    { label: "Candidatures reçues", path: "/candidatures-entreprise" },
    { label: "Évaluations", path: "/evaluations" },
  ],

  formateur: [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Suivi stagiaires", path: "/suivi-stagiaires" },
    { label: "Rapports", path: "/gestion-rapports" },
    { label: "Évaluations", path: "/evaluations" },
  ],

  admin: [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Gestion utilisateurs", path: "/admin/users" },
    { label: "Suivi stagiaires", path: "/suivi-stagiaires" },
    { label: "Validation documents", path: "/admin/documents" },
    { label: "Évaluations", path: "/evaluations" },
    { label: "Offres", path: "/offres" },
    { label: "Rapports", path: "/gestion-rapports" },
    { label: "Conventions", path: "/admin/conventions" },
    { label: "Rapports statistiques", path: "/analytics" },
  ],
};

const sharedSidebarItems = [
  { label: "Notifications", path: "/notifications" },
  { label: "Calendrier", path: "/calendrier" },
  { label: "Messagerie", path: "/messagerie" },
];

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  const roleItems = sidebarItemsByRole[user?.role] || [];
  const sidebarItems = [...roleItems, ...sharedSidebarItems];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="flex min-h-screen w-full flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm lg:fixed lg:inset-y-0 lg:left-0 lg:w-72">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">StageFlow</h1>
          <p className="mt-1 text-sm text-slate-500">Gestion des stages</p>
        </div>

        <div className="mb-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            {user?.nom || "Utilisateur"}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
            {user?.role || "connecté"}
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={`${item.path}-${item.label}`}
              onClick={() => navigate(item.path)}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-6 w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          Déconnexion
        </button>
      </aside>

      <main className="min-h-screen flex-1 p-6 lg:ml-72 lg:p-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;

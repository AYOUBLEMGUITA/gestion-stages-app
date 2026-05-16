import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Gestion des offres",
      desc: "Publiez, consultez et gérez les offres de stage facilement.",
    },
    {
      title: "Candidatures en ligne",
      desc: "Les stagiaires peuvent postuler et suivre l’état de leurs demandes.",
    },
    {
      title: "Documents administratifs",
      desc: "Centralisation des CV, conventions, rapports et autres documents.",
    },
    {
      title: "Suivi pédagogique",
      desc: "Les formateurs peuvent suivre les stagiaires et ajouter des remarques.",
    },
    {
      title: "Messagerie interne",
      desc: "Communication simple entre stagiaires, entreprises, formateurs et admin.",
    },
    {
      title: "Statistiques & rapports",
      desc: "Tableaux de bord et exports pour l’administration.",
    },
  ];

  const roles = [
    "Stagiaire",
    "Entreprise",
    "Formateur",
    "Administrateur",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">StageFlow</h1>
          <p className="text-xs text-slate-500">Gestion intelligente des stages</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Se connecter
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Créer un compte
          </button>
        </div>
      </nav>

      <section className="px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div>
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            Plateforme Web Full Stack
          </span>

          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mt-6 leading-tight">
            Gérez les stages et les stagiaires en toute simplicité
          </h2>

          <p className="text-slate-600 text-lg mt-6 leading-relaxed">
            StageFlow centralise les offres, les candidatures, les documents,
            les conventions, les rapports, le suivi pédagogique et la communication
            entre les stagiaires, les entreprises et l’administration.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow"
            >
              Commencer maintenant
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-white border px-6 py-3 rounded-xl hover:bg-slate-100"
            >
              Accéder à la plateforme
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-2xl font-bold text-blue-600">4</h3>
              <p className="text-sm text-slate-500">Rôles utilisateurs</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-2xl font-bold text-green-600">10+</h3>
              <p className="text-sm text-slate-500">Modules intégrés</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-2xl font-bold text-purple-600">100%</h3>
              <p className="text-sm text-slate-500">Responsive</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="bg-slate-100 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-slate-500">Tableau de bord</p>
                <h3 className="font-bold text-slate-800">Gestion des stages</h3>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-slate-500">Candidatures</p>
                <h4 className="text-3xl font-bold text-blue-600">128</h4>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-slate-500">Offres</p>
                <h4 className="text-3xl font-bold text-green-600">42</h4>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-slate-500">Documents</p>
                <h4 className="text-3xl font-bold text-orange-600">320</h4>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-slate-500">Stagiaires</p>
                <h4 className="text-3xl font-bold text-purple-600">85</h4>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-800 mb-3">
                Dernières activités
              </p>

              <div className="space-y-3 text-sm text-slate-600">
                <p>✅ Document validé par l’administration</p>
                <p>📩 Nouvelle candidature reçue</p>
                <p>📅 Réunion de suivi planifiée</p>
                <p>📄 Rapport final déposé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">
              Fonctionnalités principales
            </h2>
            <p className="text-slate-500 mt-3">
              Une plateforme complète pour digitaliser le processus de stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <h3 className="font-bold text-slate-800 mt-5">
                  {feature.title}
                </h3>

                <p className="text-slate-500 text-sm mt-2">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Une interface pour chaque acteur
            </h2>
            <p className="text-slate-500 mt-3">
              Chaque utilisateur accède uniquement aux fonctionnalités adaptées à son rôle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {roles.map((role) => (
              <div
                key={role}
                className="bg-white rounded-2xl shadow p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center text-xl font-bold">
                  {role.charAt(0)}
                </div>

                <h3 className="font-bold text-slate-800 mt-4">{role}</h3>

                <p className="text-sm text-slate-500 mt-2">
                  Espace personnalisé et sécurisé.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold">
          Prêt à digitaliser la gestion des stages ?
        </h2>

        <p className="mt-3 text-blue-100">
          Connectez-vous ou créez un compte pour commencer.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium"
          >
            Créer un compte
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 text-center py-6">
        <p>© 2026 StageFlow — Application de gestion des stages</p>
      </footer>
    </div>
  );
}

export default LandingPage;
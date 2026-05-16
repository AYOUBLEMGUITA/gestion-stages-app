import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Offres from "./pages/Offres";
import AddOffre from "./pages/AddOffre";
import MesCandidatures from "./pages/MesCandidatures";
import CandidaturesEntreprise from "./pages/CandidaturesEntreprise";
import Documents from "./pages/Documents";
import AdminDocuments from "./pages/AdminDocuments";
import AdminUsers from "./pages/AdminUsers";
import EntrepriseProfile from "./pages/EntrepriseProfile";
import EditOffre from "./pages/EditOffre";
import OffreDetails from "./pages/OffreDetails";
import Notifications from "./pages/Notifications";
import SuiviStagiaires from "./pages/SuiviStagiaires";
import Evaluations from "./pages/Evaluations";
import MesRapports from "./pages/MesRapports";
import GestionRapports from "./pages/GestionRapports";
import Calendrier from "./pages/Calendrier";
import Messagerie from "./pages/Messagerie";
import MesConventions from "./pages/MesConventions";
import AdminConventions from "./pages/AdminConventions";
import Analytics from "./pages/Analytics";
import AssistantIA from "./pages/AssistantIA";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
<Route
  path="/assistant-ia"
  element={
    <ProtectedRoute>
      <AssistantIA />
    </ProtectedRoute>
  }
/>
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["stagiaire"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/offres"
          element={
            <ProtectedRoute roles={["stagiaire", "entreprise", "admin"]}>
              <Offres />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-offre"
          element={
            <ProtectedRoute roles={["entreprise"]}>
              <AddOffre />
            </ProtectedRoute>
          }
        />

        <Route
          path="/offres/:id"
          element={
            <ProtectedRoute roles={["stagiaire", "entreprise", "admin"]}>
              <OffreDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/offres/:id/edit"
          element={
            <ProtectedRoute roles={["entreprise"]}>
              <EditOffre />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mes-candidatures"
          element={
            <ProtectedRoute roles={["stagiaire"]}>
              <MesCandidatures />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidatures-entreprise"
          element={
            <ProtectedRoute roles={["entreprise"]}>
              <CandidaturesEntreprise />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute roles={["stagiaire"]}>
              <Documents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/documents"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDocuments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/entreprise/profile"
          element={
            <ProtectedRoute roles={["entreprise"]}>
              <EntrepriseProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suivi-stagiaires"
          element={
            <ProtectedRoute roles={["formateur", "admin"]}>
              <SuiviStagiaires />
            </ProtectedRoute>
          }
        />

        <Route
          path="/evaluations"
          element={
            <ProtectedRoute roles={["entreprise", "formateur", "admin"]}>
              <Evaluations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mes-rapports"
          element={
            <ProtectedRoute roles={["stagiaire"]}>
              <MesRapports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gestion-rapports"
          element={
            <ProtectedRoute roles={["formateur", "admin"]}>
              <GestionRapports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendrier"
          element={
            <ProtectedRoute>
              <Calendrier />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messagerie"
          element={
            <ProtectedRoute>
              <Messagerie />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mes-conventions"
          element={
            <ProtectedRoute roles={["stagiaire"]}>
              <MesConventions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/conventions"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminConventions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

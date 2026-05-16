-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2026 at 06:56 PM
-- Server version: 11.4.8-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestion_stages`
--

-- --------------------------------------------------------

--
-- Table structure for table `calendrier`
--

CREATE TABLE `calendrier` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titre` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `date_event` date DEFAULT NULL,
  `heure` time DEFAULT NULL,
  `type` enum('reunion','visite','deadline','autre') DEFAULT 'autre',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidatures`
--

CREATE TABLE `candidatures` (
  `id` int(11) NOT NULL,
  `stagiaire_id` int(11) NOT NULL,
  `offre_id` int(11) NOT NULL,
  `date_candidature` timestamp NULL DEFAULT current_timestamp(),
  `statut` enum('en_attente','acceptee','refusee','en_cours','validee') DEFAULT 'en_attente',
  `motif_refus` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conventions`
--

CREATE TABLE `conventions` (
  `id` int(11) NOT NULL,
  `stagiaire_id` int(11) NOT NULL,
  `entreprise_id` int(11) NOT NULL,
  `date_signature` date DEFAULT NULL,
  `statut` enum('en_attente','signee','validee','refusee') DEFAULT 'en_attente',
  `signature_elec` tinyint(1) DEFAULT 0,
  `fichier_pdf` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `stagiaire_id` int(11) NOT NULL,
  `nom` varchar(150) NOT NULL,
  `type` enum('cv','lettre_motivation','convention','cin','assurance','diplome','releve','rapport','autre') NOT NULL,
  `chemin_fichier` varchar(255) NOT NULL,
  `statut` enum('manquant','en_attente','valide','refuse') DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `commentaire` text DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `stagiaire_id`, `nom`, `type`, `chemin_fichier`, `statut`, `created_at`, `commentaire`, `updated_at`) VALUES
(1, 1, 'AYOUB LEMGUITA', 'cv', '1778752567105-206756526.pdf', 'valide', '2026-05-14 09:56:07', NULL, '2026-05-14 13:06:17');

-- --------------------------------------------------------

--
-- Table structure for table `entreprises`
--

CREATE TABLE `entreprises` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nom_societe` varchar(150) NOT NULL,
  `secteur` varchar(100) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `entreprises`
--

INSERT INTO `entreprises` (`id`, `user_id`, `nom_societe`, `secteur`, `adresse`, `contact`, `description`, `created_at`, `updated_at`) VALUES
(1, 4, 'Tech Solutions', 'Informatique', 'Agadir', '0611111111', 'Entreprise spécialisée en développement web', '2026-05-14 13:06:16', '2026-05-14 13:06:16'),
(2, 1, 'Tech Solutions', 'Informatique', 'Agadir', '0611111111', 'Entreprise spécialisée en développement web', '2026-05-14 13:06:16', '2026-05-14 13:06:16'),
(3, 13, 'entreprise', 'IT', 'maroc', '0619940820', 'grrgrgrgr', '2026-05-14 13:06:16', '2026-05-14 13:06:16'),
(4, 15, 'AYOUB LEMGUITA', NULL, NULL, '0619940820', NULL, '2026-05-14 13:15:49', '2026-05-14 13:15:49'),
(5, 19, 'AYOUB LEMGUITA', NULL, NULL, '0619940820', NULL, '2026-05-16 17:29:21', '2026-05-16 17:29:21');

-- --------------------------------------------------------

--
-- Table structure for table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` int(11) NOT NULL,
  `stagiaire_id` int(11) NOT NULL,
  `entreprise_id` int(11) DEFAULT NULL,
  `formateur_id` int(11) DEFAULT NULL,
  `date_eval` date DEFAULT NULL,
  `note` float DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `valide` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `formateurs`
--

CREATE TABLE `formateurs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `departement` varchar(100) DEFAULT NULL,
  `specialite` varchar(100) DEFAULT NULL,
  `nb_stagiaires` int(11) DEFAULT 0,
  `telephone` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `formateurs`
--

INSERT INTO `formateurs` (`id`, `user_id`, `departement`, `specialite`, `nb_stagiaires`, `telephone`, `created_at`, `updated_at`) VALUES
(1, 16, NULL, NULL, 0, '0619940820', '2026-05-14 13:16:22', '2026-05-14 13:16:22');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `expediteur_id` int(11) NOT NULL,
  `destinataire_id` int(11) NOT NULL,
  `contenu` text NOT NULL,
  `fichier` varchar(255) DEFAULT NULL,
  `lu` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `lu` tinyint(1) DEFAULT 0,
  `date_envoi` timestamp NULL DEFAULT current_timestamp(),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offres`
--

CREATE TABLE `offres` (
  `id` int(11) NOT NULL,
  `entreprise_id` int(11) NOT NULL,
  `titre` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `competences` text DEFAULT NULL,
  `localisation` varchar(100) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `nombre_places` int(11) DEFAULT 1,
  `statut` enum('active','fermee') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `offres`
--

INSERT INTO `offres` (`id`, `entreprise_id`, `titre`, `description`, `competences`, `localisation`, `date_debut`, `date_fin`, `nombre_places`, `statut`, `created_at`, `updated_at`) VALUES
(1, 3, 'gggg', 'hhhh', 'node', 'agadir', '2026-05-19', '2026-05-29', 10, 'active', '2026-05-14 11:36:23', '2026-05-14 13:06:16');

-- --------------------------------------------------------

--
-- Table structure for table `rapports`
--

CREATE TABLE `rapports` (
  `id` int(11) NOT NULL,
  `stagiaire_id` int(11) NOT NULL,
  `titre` varchar(150) DEFAULT NULL,
  `fichier` varchar(255) DEFAULT NULL,
  `type` enum('intermediaire','final') DEFAULT 'intermediaire',
  `statut` enum('depose','valide','refuse') DEFAULT 'depose',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `chemin_fichier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stagiaires`
--

CREATE TABLE `stagiaires` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cv` varchar(255) DEFAULT NULL,
  `niveau` varchar(100) DEFAULT NULL,
  `specialite` varchar(100) DEFAULT NULL,
  `localisation` varchar(100) DEFAULT NULL,
  `competences` text DEFAULT NULL,
  `statut_stage` enum('en_recherche','candidature_envoyee','accepte','en_stage','termine','valide') DEFAULT 'en_recherche',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `stagiaires`
--

INSERT INTO `stagiaires` (`id`, `user_id`, `cv`, `niveau`, `specialite`, `localisation`, `competences`, `statut_stage`, `created_at`, `updated_at`) VALUES
(1, 9, NULL, 'techinicein spicialisé', 'dev digital', 'agadir', 'hhhh', 'en_recherche', '2026-05-14 13:06:16', '2026-05-14 13:06:16');

-- --------------------------------------------------------

--
-- Table structure for table `suivis`
--

CREATE TABLE `suivis` (
  `id` int(11) NOT NULL,
  `stagiaire_id` int(11) NOT NULL,
  `formateur_id` int(11) NOT NULL,
  `mission` text DEFAULT NULL,
  `taches` text DEFAULT NULL,
  `competences_acquises` text DEFAULT NULL,
  `remarque` text DEFAULT NULL,
  `date_suivi` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('stagiaire','entreprise','formateur','admin') NOT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `statut` enum('actif','inactif') DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `password`, `role`, `telephone`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Ayoub Stagiaire', 'ayoub@test.com', '$2b$10$CzO89VdSFDDH4Zf/bXeAw.4o60CzQXyNf0cRaFH76cexSyyBhXU8C', 'stagiaire', '0600000000', 'actif', '2026-05-11 10:51:52', '2026-05-11 10:51:52'),
(2, 'AYOUB LEMGUITA', 'ayoublemguita06@gmail.com', '$2b$10$OYEVg4pzh4ZbXKH28TzPYe0uMzteA1HUIRDFhQciPcmq7NS1nQnEe', 'stagiaire', '0619940820', 'actif', '2026-05-11 11:55:07', '2026-05-11 11:55:07'),
(3, 'AYOUB LEMGUITA', 'ayoublemguita10@gmail.com', '$2b$10$djv70TD.Eg.fgaOIBMyhzOWTYVqqE68vBj2LS2YDeJkxYS85MHwgy', 'stagiaire', '0619940820', 'actif', '2026-05-14 08:05:37', '2026-05-14 08:05:37'),
(4, 'entreprise', 'entreprise@test.com', '$2b$10$1Z4C9xZi.JFAu5YMa4cxe.4RiiMe5RRsLLj65og0Olo0tmDQMbK02', 'entreprise', '0619940820', 'actif', '2026-05-14 08:39:55', '2026-05-14 08:39:55'),
(5, 'AYOUB LEMGUITA', 'ayoublemguita0@gmail.com', '$2b$10$MawowRPJBqs6HjAth23yeex44YUQrGPYg3cUgyVVyJvwP8r37xzaq', 'formateur', '0619940820', 'actif', '2026-05-14 09:25:50', '2026-05-14 09:25:50'),
(9, 'AYOUB LEMGUITA', 'ayoublemguita1@gmail.com', '$2b$10$QwSLdKxQ6/cKKNbKFnSAGOsMhh/Uzpijagj2TpIowflOuvske/2s2', 'stagiaire', '0619940820', 'actif', '2026-05-14 09:40:14', '2026-05-14 09:40:14'),
(11, 'AYOUB LEMGUITA', 'ayoublemguita@gmail.com', '$2b$10$moS35BVOOumltyDdSFylPOT6cNhX/TbAZbuEDNHcW2.8HSISE9w8y', 'admin', '0619940820', 'actif', '2026-05-14 10:54:17', '2026-05-14 10:54:17'),
(13, 'entreprise', 'entreprise1@gmail.com', '$2b$10$UP6e3U9CiJrsAeswu/4qs.TwnVtNH017kxMbbQYqTHvRlYDaY43CK', 'entreprise', '0619940820', 'actif', '2026-05-14 11:35:28', '2026-05-14 11:35:28'),
(14, 'AYOUB LEMGUITA', 'ayoub@gmail.com', '$2b$10$s3V6yi/JSyYzHgwPO9qz3efu6bmPd0TKY6wXQsNwv5KkAg.7b9JM2', 'admin', '0619940820', 'actif', '2026-05-14 12:08:33', '2026-05-14 12:08:33'),
(15, 'AYOUB LEMGUITA', 'bbbbbb@gmail.com', '$2b$10$ODEoiibivBmt2wlCqobJiuY8lPRMBcC.9ijC5bDrxhABgr2CdrZd.', 'entreprise', '0619940820', 'actif', '2026-05-14 12:15:49', '2026-05-14 12:15:49'),
(16, 'nnnnnn', 'nnnnnnnn@gmail.com', '$2b$10$5Q4jHO6lx.WEkFXMrHjymeTjvfiLq4kLFqEt7wH//GhCrGpOxmHLW', 'formateur', '0619940820', 'actif', '2026-05-14 12:16:22', '2026-05-14 12:16:22'),
(17, 'tchtch', 'tchtch@gmail.com', '$2b$10$sNSgwd60ISqYT3fhzoMXfOjmdf84fI4vyiHNT6m733Sm47MEjuCLC', 'admin', '0619940820', 'actif', '2026-05-16 16:23:10', '2026-05-16 16:23:10'),
(19, 'AYOUB LEMGUITA', 'ayoublemguita11@gmail.com', '$2b$10$ljl7dh5dP6OTmDnib.9UwuWDQkMlBxwIT.zQPWX5CI3Z0Ifn873hS', 'entreprise', '0619940820', 'actif', '2026-05-16 16:29:21', '2026-05-16 16:29:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calendrier`
--
ALTER TABLE `calendrier`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `candidatures`
--
ALTER TABLE `candidatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stagiaire_id` (`stagiaire_id`),
  ADD KEY `offre_id` (`offre_id`);

--
-- Indexes for table `conventions`
--
ALTER TABLE `conventions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stagiaire_id` (`stagiaire_id`),
  ADD KEY `entreprise_id` (`entreprise_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stagiaire_id` (`stagiaire_id`);

--
-- Indexes for table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stagiaire_id` (`stagiaire_id`),
  ADD KEY `entreprise_id` (`entreprise_id`),
  ADD KEY `formateur_id` (`formateur_id`);

--
-- Indexes for table `formateurs`
--
ALTER TABLE `formateurs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expediteur_id` (`expediteur_id`),
  ADD KEY `destinataire_id` (`destinataire_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `offres`
--
ALTER TABLE `offres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entreprise_id` (`entreprise_id`);

--
-- Indexes for table `rapports`
--
ALTER TABLE `rapports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stagiaire_id` (`stagiaire_id`);

--
-- Indexes for table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `suivis`
--
ALTER TABLE `suivis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stagiaire_id` (`stagiaire_id`),
  ADD KEY `formateur_id` (`formateur_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calendrier`
--
ALTER TABLE `calendrier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `candidatures`
--
ALTER TABLE `candidatures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `conventions`
--
ALTER TABLE `conventions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `entreprises`
--
ALTER TABLE `entreprises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `formateurs`
--
ALTER TABLE `formateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offres`
--
ALTER TABLE `offres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rapports`
--
ALTER TABLE `rapports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stagiaires`
--
ALTER TABLE `stagiaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `suivis`
--
ALTER TABLE `suivis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `calendrier`
--
ALTER TABLE `calendrier`
  ADD CONSTRAINT `calendrier_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidatures`
--
ALTER TABLE `candidatures`
  ADD CONSTRAINT `candidatures_ibfk_1` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidatures_ibfk_2` FOREIGN KEY (`offre_id`) REFERENCES `offres` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conventions`
--
ALTER TABLE `conventions`
  ADD CONSTRAINT `conventions_ibfk_1` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conventions_ibfk_2` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `entreprises`
--
ALTER TABLE `entreprises`
  ADD CONSTRAINT `entreprises_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_2` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `evaluations_ibfk_3` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `formateurs`
--
ALTER TABLE `formateurs`
  ADD CONSTRAINT `formateurs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`expediteur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`destinataire_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `offres`
--
ALTER TABLE `offres`
  ADD CONSTRAINT `offres_ibfk_1` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rapports`
--
ALTER TABLE `rapports`
  ADD CONSTRAINT `rapports_ibfk_1` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD CONSTRAINT `stagiaires_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `suivis`
--
ALTER TABLE `suivis`
  ADD CONSTRAINT `suivis_ibfk_1` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `suivis_ibfk_2` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 11 oct. 2023 à 15:56
-- Version du serveur : 10.4.25-MariaDB
-- Version de PHP : 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `blog_nodejs`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(21, 'sport'),
(22, 'food'),
(23, 'TEST36E3E');

-- --------------------------------------------------------

--
-- Structure de la table `poste`
--

CREATE TABLE `poste` (
  `id` int(11) NOT NULL,
  `title` varchar(80) NOT NULL,
  `contenu` text NOT NULL,
  `image` varchar(80) NOT NULL,
  `date_publication` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `poste`
--

INSERT INTO `poste` (`id`, `title`, `contenu`, `image`, `date_publication`) VALUES
(95, 'react', 'jgcuysdbchsbbh', '1697021417011-png-transparent-react-react-native-logos-brands-in-colors-icon-thu', '2023-10-14'),
(96, 'react js', 'jgcuysdbchsbbh', '1697022122072-png-transparent-react-react-native-logos-brands-in-colors-icon-thu', '0000-00-00'),
(97, 'node js', 'gyuggcyvgfuyuygggyi', '1697022197115-png-transparent-react-react-native-logos-brands-in-colors-icon-thu', '2023-10-12'),
(98, 'node js', 'guygugyg', '1697022287469-png-transparent-react-react-native-logos-brands-in-colors-icon-thu', '2023-10-12'),
(99, 'VUE', 'guygugyg', '1697022392688-png-transparent-react-react-native-logos-brands-in-colors-icon-thu', '0000-00-00');

-- --------------------------------------------------------

--
-- Structure de la table `poste_category`
--

CREATE TABLE `poste_category` (
  `poste_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `poste_category`
--

INSERT INTO `poste_category` (`poste_id`, `category_id`) VALUES
(95, 22),
(95, 23),
(96, 21),
(96, 22),
(96, 23),
(98, 21),
(98, 23);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `poste`
--
ALTER TABLE `poste`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `poste_category`
--
ALTER TABLE `poste_category`
  ADD PRIMARY KEY (`poste_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `poste`
--
ALTER TABLE `poste`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `poste_category`
--
ALTER TABLE `poste_category`
  ADD CONSTRAINT `poste_category_ibfk_1` FOREIGN KEY (`poste_id`) REFERENCES `poste` (`id`),
  ADD CONSTRAINT `poste_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

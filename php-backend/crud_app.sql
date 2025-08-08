-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2025 at 05:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crud_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `debates`
--

DROP TABLE IF EXISTS `debates`;
CREATE TABLE IF NOT EXISTS `debates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `debate_type` enum('Public','Private') NOT NULL,
  `deadline` datetime NOT NULL,
  `state` enum('Ongoing','Finished') DEFAULT 'Ongoing',
  `is_locked` tinyint(1) DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `result` enum('For','Against','Tie','Pending') DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `debates`
--

INSERT INTO `debates` (`id`, `title`, `description`, `category`, `debate_type`, `deadline`, `state`, `is_locked`, `created_by`, `created_at`, `result`) VALUES
(1, 'sasasas', 'asasas', 'sasasas', 'Public', '2025-06-26 20:51:00', 'Ongoing', 0, 1, '2025-06-22 15:21:34', 'Pending'),
(4, 'gggggg', 'ggggggg', 'ggggggg', 'Public', '2025-06-22 21:10:00', 'Finished', 0, 2, '2025-06-22 15:40:23', 'Tie'),
(5, 'hhhhh', 'hhhhhhhh', 'hhhhhhhh', 'Public', '2025-06-22 21:11:00', 'Finished', 0, 1, '2025-06-22 15:42:00', 'Tie'),
(6, 'zzzzzz', 'zzzzzzzz', 'zzzzzz', 'Public', '2025-06-22 21:15:00', 'Finished', 0, 1, '2025-06-22 15:42:31', 'For');

-- --------------------------------------------------------

--
-- Table structure for table `debate_arguments`
--

DROP TABLE IF EXISTS `debate_arguments`;
CREATE TABLE IF NOT EXISTS `debate_arguments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `debate_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `argument` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_archived` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `debate_id` (`debate_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `debate_arguments`
--

INSERT INTO `debate_arguments` (`id`, `debate_id`, `user_id`, `argument`, `created_at`, `is_archived`) VALUES
(1, 1, 1, 'dfsdfsdf', '2025-06-22 15:27:35', 1),
(2, 1, 2, 'fsdfsdfsdf', '2025-06-22 15:28:39', 1),
(3, 1, 1, 'dhfghfghfgh', '2025-06-22 15:41:38', 0),
(4, 6, 1, 'gfghfghfgh', '2025-06-22 15:42:42', 0),
(5, 6, 2, 'gfghfghfgh', '2025-06-22 15:43:08', 0);

-- --------------------------------------------------------

--
-- Table structure for table `debate_votes`
--

DROP TABLE IF EXISTS `debate_votes`;
CREATE TABLE IF NOT EXISTS `debate_votes` (
  `debate_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `side` enum('For','Against') NOT NULL,
  PRIMARY KEY (`debate_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `debate_votes`
--

INSERT INTO `debate_votes` (`debate_id`, `user_id`, `side`) VALUES
(1, 1, 'Against'),
(1, 2, 'For'),
(6, 1, 'For'),
(6, 2, 'For');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','Resolved') DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `subject`, `description`, `created_at`, `status`) VALUES
(1, 2, 'sdsdsdf', 'sdfsdfsdf', '2025-06-22 15:31:03', 'Pending'),
(2, 2, 'sdsdsdf', 'sdfsdfsdf', '2025-06-22 15:31:37', 'Resolved');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `full_name` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `is_blocked` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `full_name`, `bio`, `profile_picture`, `date_of_birth`, `location`, `is_blocked`) VALUES
(1, 'ccc', 'ccc@gmail.com', '$2y$10$/74d/eL3.EDghHXyCRIEveuWOFkYuPIOHBJkQeMvpVT0Dc8J/sDrG', '2025-06-22 15:03:41', 'ccc', 'ccc', 'uploads/profile_pictures/68581b4dc8b64.webp', '2025-06-09', 'ccc', 0),
(2, 'aaa', 'aaa@gmail.com', '$2y$10$Ei7yekdVAVM3cSIbPC0BsObj5EJTEulTZBSeY.EVz.JQvx7ue8dC.', '2025-06-22 15:28:15', 'aaa', 'aaa', 'uploads/profile_pictures/6858210fbc627.webp', '2025-06-14', 'aaa', 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `debates`
--
ALTER TABLE `debates`
  ADD CONSTRAINT `debates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `debate_arguments`
--
ALTER TABLE `debate_arguments`
  ADD CONSTRAINT `debate_arguments_ibfk_1` FOREIGN KEY (`debate_id`) REFERENCES `debates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `debate_arguments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `debate_votes`
--
ALTER TABLE `debate_votes`
  ADD CONSTRAINT `debate_votes_ibfk_1` FOREIGN KEY (`debate_id`) REFERENCES `debates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `debate_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

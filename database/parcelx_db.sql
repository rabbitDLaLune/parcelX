-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: parcelx_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `branch_id` int NOT NULL AUTO_INCREMENT,
  `branch_code` varchar(50) NOT NULL,
  `branch_name` varchar(150) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `postcode` varchar(20) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`branch_id`),
  UNIQUE KEY `branch_code` (`branch_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'PNG-HUB-01','Penang Sorting Hub','Bayan Lepas Industrial Area','Bayan Lepas','Penang','11900','04-600 1122',5.2948000,100.2592000,'Active','2026-05-13 05:02:28'),(2,'PNG-BR-02','Georgetown Branch','Jalan Transfer, Georgetown','Georgetown','Penang','10050','04-222 8899',5.4141000,100.3288000,'Active','2026-05-13 05:02:28'),(3,'KL-HUB-01','Kuala Lumpur Main Hub','Taman Perindustrian KL','Kuala Lumpur','Kuala Lumpur','50400','03-8899 2200',3.1390000,101.6869000,'Active','2026-05-13 05:02:28'),(4,'JHR-HUB-01','Johor Bahru Hub','Tebrau Industrial Park','Johor Bahru','Johor','81100','07-330 7788',1.4927000,103.7414000,'Active','2026-05-13 05:02:28');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `driver_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `branch_id` int DEFAULT NULL,
  `vehicle_type` enum('Motorcycle','Van','Lorry') DEFAULT 'Motorcycle',
  `vehicle_number` varchar(50) DEFAULT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `availability_status` enum('Available','On Delivery','Offline','Inactive') DEFAULT 'Available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`driver_id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_drivers_branch` (`branch_id`),
  CONSTRAINT `fk_drivers_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,'Daniel Tan','daniel.driver@parcelx.test','012-456 7890',2,'Motorcycle','PNA 2381','D1234567','On Delivery','2026-05-13 05:02:28'),(2,'Ravi Kumar','ravi.driver@parcelx.test','013-888 1212',4,'Van','JQB 9001','D7654321','Available','2026-05-13 05:02:28'),(3,'David Lee','david.driver@parcelx.test','017-222 4455',1,'Motorcycle','PJK 6612','D9988776','Available','2026-05-13 05:02:28');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parcels`
--

DROP TABLE IF EXISTS `parcels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parcels` (
  `parcel_id` int NOT NULL AUTO_INCREMENT,
  `tracking_number` varchar(50) NOT NULL,
  `sender_name` varchar(150) NOT NULL,
  `sender_phone` varchar(30) NOT NULL,
  `sender_address` text NOT NULL,
  `receiver_name` varchar(150) NOT NULL,
  `receiver_phone` varchar(30) NOT NULL,
  `receiver_address` text NOT NULL,
  `origin_branch_id` int DEFAULT NULL,
  `destination_branch_id` int DEFAULT NULL,
  `current_branch_id` int DEFAULT NULL,
  `assigned_driver_id` int DEFAULT NULL,
  `parcel_weight` decimal(8,2) NOT NULL,
  `parcel_size` enum('Small','Medium','Large') DEFAULT 'Small',
  `parcel_category` varchar(100) DEFAULT NULL,
  `delivery_type` enum('Standard Delivery','Express Delivery','Same-Day Delivery') DEFAULT 'Standard Delivery',
  `delivery_fee` decimal(10,2) DEFAULT '0.00',
  `current_status` enum('CREATED','PENDING_PICKUP','PICKED_UP','ARRIVED_ORIGIN_HUB','DEPARTED_ORIGIN_HUB','ARRIVED_SORTING_HUB','IN_TRANSIT','ARRIVED_DESTINATION_HUB','ASSIGNED_TO_DRIVER','OUT_FOR_DELIVERY','DELIVERED','DELIVERY_FAILED','RETURNED_TO_HUB','RETURNED_TO_SENDER','CANCELLED') DEFAULT 'CREATED',
  `estimated_delivery_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`parcel_id`),
  UNIQUE KEY `tracking_number` (`tracking_number`),
  KEY `fk_parcels_origin_branch` (`origin_branch_id`),
  KEY `fk_parcels_destination_branch` (`destination_branch_id`),
  KEY `fk_parcels_current_branch` (`current_branch_id`),
  KEY `fk_parcels_driver` (`assigned_driver_id`),
  CONSTRAINT `fk_parcels_current_branch` FOREIGN KEY (`current_branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_parcels_destination_branch` FOREIGN KEY (`destination_branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_parcels_driver` FOREIGN KEY (`assigned_driver_id`) REFERENCES `drivers` (`driver_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_parcels_origin_branch` FOREIGN KEY (`origin_branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcels`
--

LOCK TABLES `parcels` WRITE;
/*!40000 ALTER TABLE `parcels` DISABLE KEYS */;
INSERT INTO `parcels` VALUES (1,'PXL202605120001','Ahmad Hakim','012-345 6789','Bayan Lepas, Penang','Nur Aisyah','011-234 5678','Georgetown, Penang',1,2,3,1,2.40,'Medium','Electronics','Express Delivery',11.00,'IN_TRANSIT','2026-05-13','2026-05-13 05:02:59','2026-05-13 16:41:53'),(2,'PXL202605120002','Lim Wei Jian','012-888 9911','Bukit Mertajam, Penang','Siti Hajar','013-456 7890','Shah Alam, Selangor',1,3,3,NULL,4.80,'Large','Home Appliance','Standard Delivery',14.60,'IN_TRANSIT','2026-05-15','2026-05-13 05:02:59','2026-05-13 05:02:59'),(3,'PXL202605120003','ParcelX Walk-In Customer','014-222 1111','Georgetown, Penang','Muhammad Irfan','019-345 1212','Johor Bahru, Johor',2,4,4,2,1.20,'Small','Document','Express Delivery',9.40,'DELIVERED','2026-05-13','2026-05-13 05:02:59','2026-05-13 05:02:59');
/*!40000 ALTER TABLE `parcels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracking_events`
--

DROP TABLE IF EXISTS `tracking_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tracking_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `parcel_id` int NOT NULL,
  `status` enum('CREATED','PENDING_PICKUP','PICKED_UP','ARRIVED_ORIGIN_HUB','DEPARTED_ORIGIN_HUB','ARRIVED_SORTING_HUB','IN_TRANSIT','ARRIVED_DESTINATION_HUB','ASSIGNED_TO_DRIVER','OUT_FOR_DELIVERY','DELIVERED','DELIVERY_FAILED','RETURNED_TO_HUB','RETURNED_TO_SENDER','CANCELLED') NOT NULL,
  `title` varchar(150) NOT NULL,
  `location_name` varchar(150) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `remarks` text,
  `updated_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `fk_tracking_events_parcel` (`parcel_id`),
  KEY `fk_tracking_events_branch` (`branch_id`),
  CONSTRAINT `fk_tracking_events_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tracking_events_parcel` FOREIGN KEY (`parcel_id`) REFERENCES `parcels` (`parcel_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracking_events`
--

LOCK TABLES `tracking_events` WRITE;
/*!40000 ALTER TABLE `tracking_events` DISABLE KEYS */;
INSERT INTO `tracking_events` VALUES (1,1,'CREATED','Parcel Created','Bayan Lepas, Penang',1,5.2948000,100.2592000,'Shipment request has been created.','Customer','2026-05-11 06:45:00'),(2,1,'PICKED_UP','Parcel Picked Up','Bayan Lepas, Penang',1,5.2948000,100.2592000,'Parcel has been picked up from sender.','Staff','2026-05-11 07:15:00'),(3,1,'ARRIVED_SORTING_HUB','Arrived at Sorting Hub','Penang Sorting Hub',1,5.4141000,100.3288000,'Parcel arrived at Penang Sorting Hub.','Staff','2026-05-12 12:30:00'),(4,1,'ASSIGNED_TO_DRIVER','Assigned to Driver','Georgetown Branch',2,5.4141000,100.3288000,'Parcel has been assigned to Daniel Tan.','Admin','2026-05-13 00:30:00'),(5,1,'OUT_FOR_DELIVERY','Out for Delivery','Georgetown Branch',2,5.4141000,100.3288000,'Parcel is out for delivery with driver.','Driver','2026-05-13 01:10:00'),(6,2,'CREATED','Parcel Created','Bukit Mertajam, Penang',1,5.3630000,100.4667000,'Shipment request has been created.','Customer','2026-05-12 02:20:00'),(7,2,'PICKED_UP','Parcel Picked Up','Bukit Mertajam, Penang',1,5.3630000,100.4667000,'Parcel has been picked up from sender.','Staff','2026-05-12 06:00:00'),(8,2,'ARRIVED_SORTING_HUB','Arrived at Sorting Hub','Penang Sorting Hub',1,5.4141000,100.3288000,'Parcel arrived at origin sorting hub.','Staff','2026-05-12 11:40:00'),(9,2,'IN_TRANSIT','In Transit','Kuala Lumpur Main Hub',3,3.1390000,101.6869000,'Parcel is moving to destination hub.','Staff','2026-05-12 22:25:00'),(10,3,'CREATED','Parcel Created','Georgetown Branch',2,5.4141000,100.3288000,'Parcel has been registered by staff.','Staff','2026-05-11 01:30:00'),(11,3,'PICKED_UP','Parcel Accepted','Georgetown Branch',2,5.4141000,100.3288000,'Parcel accepted at ParcelX branch.','Staff','2026-05-11 01:45:00'),(12,3,'IN_TRANSIT','In Transit','Kuala Lumpur Main Hub',3,3.1390000,101.6869000,'Parcel is moving through logistics network.','Staff','2026-05-11 17:25:00'),(13,3,'OUT_FOR_DELIVERY','Out for Delivery','Johor Bahru Hub',4,1.4927000,103.7414000,'Parcel is out for delivery with driver.','Driver','2026-05-13 02:15:00'),(14,3,'DELIVERED','Delivered','Johor Bahru, Johor',4,1.4927000,103.7414000,'Parcel has been delivered to receiver.','Driver','2026-05-13 05:40:00'),(15,1,'IN_TRANSIT','In Transit','Kuala Lumpur Main Hub',3,NULL,NULL,'Parcel movement has been updated by staff.','Staff','2026-05-13 16:41:53');
/*!40000 ALTER TABLE `tracking_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','staff','driver','customer') NOT NULL DEFAULT 'customer',
  `phone` varchar(30) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ParcelX Admin','admin@parcelx.com','$2b$10$pylZrv1/i39VlPkvwQAlk.4AYb27Ix2gukOHwdyASEz8fOuD0z7EK','admin','012-000 0001','active','2026-05-13 07:09:21'),(2,'ParcelX Driver','driver@parcelx.com','$2b$10$u.sMFWTdpf0.9JmenpwHPeM9/ZukmMP4EsRBkv4rV8eV467fx5C82','driver','012-000 0002','active','2026-05-13 07:09:21'),(3,'ParcelX Staff','staff@parcelx.com','$2b$10$KYFwydNUWHtyW/7TPEsi1.m0wojhiryxCJCUkoBOSPdD3Sfhp5LjS','staff','012-000 0003','active','2026-05-13 07:09:21'),(4,'ParcelX Customer','customer@parcelx.com','$2b$10$CbnWmvgz.JZ90wYBkhHDq.RTgL3KPjZG2bciDx1FsXu4rS5By0JrC','customer','012-000 0004','active','2026-05-13 07:09:21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14  8:55:40

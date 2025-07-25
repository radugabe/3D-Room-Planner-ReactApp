CREATE DATABASE  IF NOT EXISTS `room_planner` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `room_planner`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: room_planner
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `texture_path` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,'Wood 1','floors/WoodFloor1'),(2,'Wood 2','floors/WoodFloor2'),(3,'Wood 3','floors/WoodFloor3'),(4,'Tiles 1','floors/TilesFloor1'),(5,'Onyx 1','floors/OnyxFloor1'),(6,'Tiles 2','floors/TilesFloor2'),(11,'Wood 4','floors/WoodFloor4'),(12,'Grass 1','floors/GrassFloor1'),(13,'Concrete 1','floors/ConcreteFloor1');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `texture_path` varchar(255) DEFAULT NULL,
  `color_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31234 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,'Wood1','/textures/wood1',''),(2,'Wood2','/textures/wood2',NULL),(3,'Marble1','/textures/marble1',''),(4,'Metal1','/textures/metal1',NULL),(5,'Leather1','/textures/leather1',NULL),(6,'Leather2','/textures/leather2',NULL),(7,'Grass1','/textures/grass1',NULL);
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_materials`
--

DROP TABLE IF EXISTS `model_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_materials` (
  `model_id` int NOT NULL,
  `material_id` int NOT NULL,
  PRIMARY KEY (`model_id`,`material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `model_materials_ibfk_1` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`) ON DELETE CASCADE,
  CONSTRAINT `model_materials_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_materials`
--

LOCK TABLES `model_materials` WRITE;
/*!40000 ALTER TABLE `model_materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `modelPath` varchar(255) DEFAULT NULL,
  `default_scale_x` float DEFAULT '1',
  `default_scale_y` float DEFAULT '1',
  `default_scale_z` float DEFAULT '1',
  `thumbnailPath` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT 'uncategorized',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (8,'Chair1','/models/chairs/chair1/chair1.glb',2,2,2,'/models/chairs/chair1/chair1.png','/models/chairs/chair1','chairs'),(9,'Table 1','/models/tables/table1/table1.glb',1,1,1,'/models/tables/table1/table1.png','/models/tables/table1','tables'),(10,'Cat 1','/models/animals/cat1/cat1.glb',0.6,0.6,0.6,'','/models/animals/cat1','animals'),(12,'Macbook','/models/other/macbook/macbook.glb',1.1,1.1,1.1,NULL,'/models/other/macbook','other'),(13,'Cabinet 1','/models/cabinets/cabinet1/cabinet1.glb',1.2,1.2,1.2,NULL,'/models/cabinets/cabinet1','cabinets'),(14,'Kitchen 1','/models/kitchen/kitchen1/kitchen1.glb',1,1,1,NULL,'/models/kitchen/kitchen1','kitchen'),(15,'Tv 1','/models/tvs/tv1/tv1.glb',1,1,1,NULL,'/models/tvs/tv1','tvs'),(16,'Kitchen 2','/models/kitchen/kitchen2/kitchen2.glb',1,1,1,NULL,'/models/kitchen/kitchen2','kitchen'),(18,'Plant 4','/models/other/plant4/plant4.glb',0.3,0.3,0.3,NULL,'/models/plants/plant4','plants'),(19,'Kitchen 3','/models/kitchen/kitchen3/kitchen3.glb',0.7,0.7,0.7,NULL,'/models/kitchen/kitchen3','kitchen'),(21,'Table 2','/models/tables/table2/table2.glb',1,1,1,'/models/tables/table2/table2.png','/models/tables/table2','tables'),(22,'Car 1','/models/cars/car1/car1.glb',2,2,2,'/models/cars/car1/car1.png','/models/cars/car1','cars'),(23,'Chair 2','/models/chairs/chair2/chair2.glb',1,1,1,'/models/chairs/chair2/chair2.png','/models/chairs/chair2','chairs'),(26,'Dog 1','/models/animals/dog1/dog1.glb',1,1,1,'/models/animals/dog1/dog1.png','/models/animals/dog1','animals'),(29,'Table 3','/models/tables/table3/table3.glb',1,1,1,'/models/tables/table3/table3.png','/models/tables/table3','tables'),(30,'Table 4','/models/tables/table4/table4.glb',1,1,1,'/models/tables/table4/table4.png','/models/tables/table4','tables'),(31,'Shelf 1','/models/shelves/shelf1/shelf1.glb',1,1,1,'/models/shelves/shelf1/shelf1.png','/models/shelves/shelf1','shelves'),(32,'Shelf 2','/models/shelves/shelf2/shelf2.glb',1,1,1,'/models/shelves/shelf2/shelf2.png','/models/shelves/shelf2','shelves'),(33,'Shelf 3','/models/shelves/shelf3/shelf3.glb',1,1,1,'/models/shelves/shelf3/shelf3.png','/models/shelves/shelf3','shelves'),(35,'Doormate 1','/models/carpets/doormate1/doormate1.glb',1,1,1,'/models/carpets/doormate1/doormate1.png','/models/carpets/doormate1','carpets'),(36,'Carpet 1','/models/carpets/carpet1/carpet1.glb',1,1,1,'/models/carpets/carpet1/carpet1.png','/models/carpets/carpet1','carpets'),(37,'Plant 1','/models/plants/plant1/plant1.glb',0.25,0.25,0.25,'/models/plants/plant1/plant1.png','/models/plants/plant1','plants'),(38,'Plant 2','/models/plants/plant2/plant2.glb',1,1,1,'/models/plants/plant2/plant2.png','/models/plants/plant2','plants'),(39,'Plant 3','/models/plants/plant3/plant3.glb',1,1,1,'/models/plants/plant3/plant3.png','/models/plants/plant3','plants'),(40,'Welcomesign','/models/other/welcomesign/welcomesign.glb',1,1,1,'/models/other/welcomesign/welcomesign.png','/models/other/welcomesign','other'),(44,'Window 2','/models/windows/window2/window2.glb',1,1,1,'/models/windows/window1/window2.png','/models/windows/window2','windows'),(45,'Door 1','/models/doors/door1/door1.glb',1,1,1,'/models/doors/door1/door1.png','/models/doors/door1','doors'),(46,'Outlets','/models/other/outlets/outlets.glb',1,1,1,'/models/other/outlets/outlets.png','/models/other/outlets','other'),(47,'Lamp 1','/models/lamps/lamp1/lamp1.glb',1,1,1,'/models/lamps/lamp1/lamp1.png','/models/lamps/lamp1','lamps'),(48,'Lamp 2','/models/lamps/lamp2/lamp2.glb',1,1,1,'/models/lamps/lamp2/lamp2.png','/models/lamps/lamp2','lamps'),(49,'Lamp 3','/models/lamps/lamp3/lamp3.glb',1,1,1,'/models/lamps/lamp3/lamp3.png','/models/lamps/lamp3','lamps'),(50,'Lamp 4','/models/lamps/lamp4/lamp4.glb',1,1,1,'/models/lamps/lamp4/lamp4.png','/models/lamps/lamp4','lamps'),(53,'Cabinet 2','/models/cabinets/cabinet2/cabinet2.glb',1,1,1,'/models/cabinets/cabinet2/cabinet2.png','/models/cabinets/cabinet2','cabinets'),(54,'Kitchen 4','/models/kitchen/kitchen4/kitchen4.glb',1,1,1,'/models/kitchen/kitchen4/kitchen4.png','/models/kitchen/kitchen4','kitchen'),(55,'Cabinet 3','/models/cabinets/cabinet3/cabinet3.glb',1,1,1,'/models/cabinets/cabinet3/cabinet3.png','/models/cabinets/cabinet3','cabinets'),(57,'Tv 2','/models/tvs/tv2/tv2.glb',1,1,1,'/models/tvs/tv2/tv2.png','/models/tvs/tv2','tvs'),(58,'Tv 3','/models/tvs/tv3/tv3.glb',1,1,1,'/models/tvs/tv3/tv3.png','/models/tvs/tv3','tvs'),(59,'Bed 1','/models/beds/bed1/bed1.glb',1,1,1,'/models/beds/bed1/bed1.png','/models/beds/bed1','beds'),(60,'Bathtube 1','/models/bath/bathtube1/bathtube1.glb',1,1,1,'/models/bath/bathtube1/bathtube1.png','/models/bath/bathtube1','bath'),(61,'Showertube 1','/models/bath/showertube1/showertube1.glb',1,1,1,'/models/bath/showertube1/showertube1.png','/models/bath/showertube1','bath'),(63,'Toiletrollholder','/models/other/toiletrollholder/toiletrollholder.glb',1,1,1,'/models/other/toiletrollholder/toiletrollholder.png','/models/other/toiletrollholder','other'),(66,'Toilet 1','/models/bath/toilet1/toilet1.glb',1,1,1,'/models/bath/toilet1/toilet1.png','/models/bath/toilet1','bath'),(67,'Toilet 2','/models/bath/toilet2/toilet2.glb',1,1,1,'/models/bath/toilet2/toilet2.png','/models/bath/toilet2','bath'),(68,'Sink 1','/models/bath/sink1/sink1.glb',1,1,1,'/models/bath/sink1/sink1.png','/models/bath/sink1','bath'),(69,'Sink 2','/models/bath/sink2/sink2.glb',1,1,1,'/models/bath/sink2/sink2.png','/models/bath/sink2','bath'),(70,'Bed 2','/models/beds/bed2/bed2.glb',1,1,1,'/models/beds/bed2/bed2.png','/models/beds/bed2','beds'),(71,'Bed 3','/models/beds/bed3/bed3.glb',1,1,1,'/models/beds/bed3/bed3.png','/models/beds/bed3','beds'),(72,'Bed 4','/models/beds/bed4/bed4.glb',1,1,1,'/models/beds/bed4/bed4.png','/models/beds/bed4','beds'),(73,'Bed 5','/models/beds/bed5/bed5.glb',1,1,1,'/models/beds/bed5/bed5.png','/models/beds/bed5','beds'),(74,'Bed 6','/models/beds/bed6/bed6.glb',1,1,1,'/models/beds/bed6/bed6.png','/models/beds/bed6','beds'),(75,'Bed 7','/models/beds/bed7/bed7.glb',1,1,1,'/models/beds/bed7/bed7.png','/models/beds/bed7','beds'),(77,'Chair 3','/models/chairs/chair3/chair3.glb',1,1,1,'/models/chairs/chair3/chair3.png','/models/chairs/chair3','chairs'),(78,'Chair 4','/models/chairs/chair4/chair4.glb',1,1,1,'/models/chairs/chair4/chair4.png','/models/chairs/chair4','chairs'),(80,'Chair 5','/models/chairs/chair5/chair5.glb',1,1,1,'/models/chairs/chair5/chair5.png','/models/chairs/chair5','chairs'),(81,'Chair 6','/models/chairs/chair6/chair6.glb',1,1,1,'/models/chairs/chair6/chair6.png','/models/chairs/chair6','chairs'),(82,'Chair 7','/models/chairs/chair7/chair7.glb',1,1,1,'/models/chairs/chair7/chair7.png','/models/chairs/chair7','chairs'),(83,'Chair 8','/models/chairs/chair8/chair8.glb',1,1,1,'/models/chairs/chair8/chair8.png','/models/chairs/chair8','chairs'),(84,'Sofa 1','/models/sofas/sofa1/sofa1.glb',1,1,1,'/models/sofas/sofa1/sofa1.png','/models/sofas/sofa1','sofas'),(85,'Chair 9','/models/chairs/chair9/chair9.glb',1,1,1,'/models/chairs/chair9/chair9.png','/models/chairs/chair9','chairs'),(86,'Chair 10','/models/chairs/chair10/chair10.glb',1,1,1,'/models/chairs/chair10/chair10.png','/models/chairs/chair10','chairs'),(87,'Chair 11','/models/chairs/chair11/chair11.glb',1,1,1,'/models/chairs/chair11/chair11.png','/models/chairs/chair11','chairs'),(88,'Sofa 2','/models/sofas/sofa2/sofa2.glb',1,1,1,'/models/sofas/sofa2/sofa2.png','/models/sofas/sofa2','sofas'),(91,'Sofa 3','/models/sofas/sofa3/sofa3.glb',1,1,1,'/models/sofas/sofa3/sofa3.png','/models/sofas/sofa3','sofas'),(92,'Sofa 4','/models/sofas/sofa4/sofa4.glb',1,1,1,'/models/sofas/sofa4/sofa4.png','/models/sofas/sofa4','sofas'),(93,'Sofa 5','/models/sofas/sofa5/sofa5.glb',1,1,1,'/models/sofas/sofa5/sofa5.png','/models/sofas/sofa5','sofas'),(94,'Sofa 6','/models/sofas/sofa6/sofa6.glb',1,1,1,'/models/sofas/sofa6/sofa6.png','/models/sofas/sofa6','sofas'),(95,'Sofa 7','/models/sofas/sofa7/sofa7.glb',1,1,1,'/models/sofas/sofa7/sofa7.png','/models/sofas/sofa7','sofas'),(96,'Table 5','/models/tables/table5/table5.glb',1,1,1,'/models/tables/table5/table5.png','/models/tables/table5','tables'),(97,'Table 6','/models/tables/table6/table6.glb',1,1,1,'/models/tables/table6/table6.png','/models/tables/table6','tables'),(98,'Table 7','/models/tables/table7/table7.glb',1,1,1,'/models/tables/table7/table7.png','/models/tables/table7','tables'),(99,'Table 8','/models/tables/table8/table8.glb',1,1,1,'/models/tables/table8/table8.png','/models/tables/table8','tables'),(100,'Table 9','/models/tables/table9/table9.glb',1,1,1,'/models/tables/table9/table9.png','/models/tables/table9','tables'),(101,'Table 10','/models/tables/table10/table10.glb',1,1,1,'/models/tables/table10/table10.png','/models/tables/table10','tables'),(102,'Table 11','/models/tables/table11/table11.glb',1,1,1,'/models/tables/table11/table11.png','/models/tables/table11','tables'),(103,'Table 12','/models/tables/table12/table12.glb',1,1,1,'/models/tables/table12/table12.png','/models/tables/table12','tables'),(104,'Table 13','/models/tables/table13/table13.glb',1,1,1,'/models/tables/table13/table13.png','/models/tables/table13','tables'),(105,'Woodenplank','/models/other/woodenplank/woodenplank.glb',1,1,1,NULL,'/models/other/woodenplank','other'),(106,'Tree 1','/models/plants/tree1/tree1.glb',1,1,1,'/models/plants/tree1/tree1.png','/models/plants/tree1','plants');
/*!40000 ALTER TABLE `models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `walls`
--

DROP TABLE IF EXISTS `walls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `walls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `texture_path` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `walls`
--

LOCK TABLES `walls` WRITE;
/*!40000 ALTER TABLE `walls` DISABLE KEYS */;
INSERT INTO `walls` VALUES (1,'Plaster1','/walls/Plaster1'),(2,'Bricks1','/walls/Bricks1'),(3,'Plaster2','/walls/Plaster2'),(4,'Bricks2','/walls/Bricks2'),(5,'Wood1','/walls/Wood1');
/*!40000 ALTER TABLE `walls` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-10  9:32:07

CREATE DATABASE IF NOT EXISTS parcelx_db;
USE parcelx_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS tracking_events;
DROP TABLE IF EXISTS parcels;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'driver', 'customer') NOT NULL DEFAULT 'customer',
  phone VARCHAR(30) DEFAULT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE branches (
  branch_id INT NOT NULL AUTO_INCREMENT,
  branch_code VARCHAR(50) NOT NULL,
  branch_name VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  latitude DECIMAL(10, 7) DEFAULT NULL,
  longitude DECIMAL(10, 7) DEFAULT NULL,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (branch_id),
  UNIQUE KEY branch_code (branch_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE drivers (
  driver_id INT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  branch_id INT DEFAULT NULL,
  vehicle_type ENUM('Motorcycle', 'Van', 'Lorry') DEFAULT 'Motorcycle',
  vehicle_number VARCHAR(50) DEFAULT NULL,
  license_number VARCHAR(100) DEFAULT NULL,
  availability_status ENUM('Available', 'On Delivery', 'Offline', 'Inactive') DEFAULT 'Available',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (driver_id),
  UNIQUE KEY email (email),
  KEY fk_drivers_branch (branch_id),

  CONSTRAINT fk_drivers_branch
    FOREIGN KEY (branch_id)
    REFERENCES branches (branch_id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE parcels (
  parcel_id INT NOT NULL AUTO_INCREMENT,
  tracking_number VARCHAR(50) NOT NULL,

  sender_name VARCHAR(150) NOT NULL,
  sender_phone VARCHAR(30) NOT NULL,
  sender_address TEXT NOT NULL,

  receiver_name VARCHAR(150) NOT NULL,
  receiver_phone VARCHAR(30) NOT NULL,
  receiver_address TEXT NOT NULL,

  origin_branch_id INT DEFAULT NULL,
  destination_branch_id INT DEFAULT NULL,
  current_branch_id INT DEFAULT NULL,
  assigned_driver_id INT DEFAULT NULL,

  parcel_weight DECIMAL(8, 2) NOT NULL,
  parcel_size ENUM('Small', 'Medium', 'Large') DEFAULT 'Small',
  parcel_category VARCHAR(100) DEFAULT NULL,
  delivery_type ENUM('Standard Delivery', 'Express Delivery', 'Same-Day Delivery') DEFAULT 'Standard Delivery',
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00,

  current_status ENUM(
    'CREATED',
    'PENDING_PICKUP',
    'PICKED_UP',
    'ARRIVED_ORIGIN_HUB',
    'DEPARTED_ORIGIN_HUB',
    'ARRIVED_SORTING_HUB',
    'IN_TRANSIT',
    'ARRIVED_DESTINATION_HUB',
    'ASSIGNED_TO_DRIVER',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'DELIVERY_FAILED',
    'RETURNED_TO_HUB',
    'RETURNED_TO_SENDER',
    'CANCELLED'
  ) DEFAULT 'CREATED',

  estimated_delivery_date DATE DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (parcel_id),
  UNIQUE KEY tracking_number (tracking_number),
  KEY fk_parcels_origin_branch (origin_branch_id),
  KEY fk_parcels_destination_branch (destination_branch_id),
  KEY fk_parcels_current_branch (current_branch_id),
  KEY fk_parcels_driver (assigned_driver_id),

  CONSTRAINT fk_parcels_origin_branch
    FOREIGN KEY (origin_branch_id)
    REFERENCES branches (branch_id)
    ON DELETE SET NULL,

  CONSTRAINT fk_parcels_destination_branch
    FOREIGN KEY (destination_branch_id)
    REFERENCES branches (branch_id)
    ON DELETE SET NULL,

  CONSTRAINT fk_parcels_current_branch
    FOREIGN KEY (current_branch_id)
    REFERENCES branches (branch_id)
    ON DELETE SET NULL,

  CONSTRAINT fk_parcels_driver
    FOREIGN KEY (assigned_driver_id)
    REFERENCES drivers (driver_id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE tracking_events (
  event_id INT NOT NULL AUTO_INCREMENT,
  parcel_id INT NOT NULL,

  status ENUM(
    'CREATED',
    'PENDING_PICKUP',
    'PICKED_UP',
    'ARRIVED_ORIGIN_HUB',
    'DEPARTED_ORIGIN_HUB',
    'ARRIVED_SORTING_HUB',
    'IN_TRANSIT',
    'ARRIVED_DESTINATION_HUB',
    'ASSIGNED_TO_DRIVER',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'DELIVERY_FAILED',
    'RETURNED_TO_HUB',
    'RETURNED_TO_SENDER',
    'CANCELLED'
  ) NOT NULL,

  title VARCHAR(150) NOT NULL,
  location_name VARCHAR(150) DEFAULT NULL,
  branch_id INT DEFAULT NULL,
  latitude DECIMAL(10, 7) DEFAULT NULL,
  longitude DECIMAL(10, 7) DEFAULT NULL,
  remarks TEXT,
  updated_by VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (event_id),
  KEY fk_tracking_events_parcel (parcel_id),
  KEY fk_tracking_events_branch (branch_id),

  CONSTRAINT fk_tracking_events_parcel
    FOREIGN KEY (parcel_id)
    REFERENCES parcels (parcel_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_tracking_events_branch
    FOREIGN KEY (branch_id)
    REFERENCES branches (branch_id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO branches
(
  branch_code,
  branch_name,
  address,
  city,
  state,
  postcode,
  phone,
  latitude,
  longitude,
  status
)
VALUES
(
  'PNG-HUB-01',
  'Penang Sorting Hub',
  'Bayan Lepas Industrial Area',
  'Bayan Lepas',
  'Penang',
  '11900',
  '04-600 1122',
  5.2948000,
  100.2592000,
  'Active'
),
(
  'PNG-BR-02',
  'Georgetown Branch',
  'Jalan Transfer, Georgetown',
  'Georgetown',
  'Penang',
  '10050',
  '04-222 8899',
  5.4141000,
  100.3288000,
  'Active'
),
(
  'KL-HUB-01',
  'Kuala Lumpur Main Hub',
  'Taman Perindustrian KL',
  'Kuala Lumpur',
  'Kuala Lumpur',
  '50400',
  '03-8899 2200',
  3.1390000,
  101.6869000,
  'Active'
),
(
  'JHR-HUB-01',
  'Johor Bahru Hub',
  'Tebrau Industrial Park',
  'Johor Bahru',
  'Johor',
  '81100',
  '07-330 7788',
  1.4927000,
  103.7414000,
  'Active'
);

INSERT INTO drivers
(
  full_name,
  email,
  phone,
  branch_id,
  vehicle_type,
  vehicle_number,
  license_number,
  availability_status
)
VALUES
(
  'Daniel Tan',
  'daniel.driver@parcelx.test',
  '012-456 7890',
  2,
  'Motorcycle',
  'PNA 2381',
  'D1234567',
  'On Delivery'
),
(
  'Ravi Kumar',
  'ravi.driver@parcelx.test',
  '013-888 1212',
  4,
  'Van',
  'JQB 9001',
  'D7654321',
  'Available'
),
(
  'David Lee',
  'david.driver@parcelx.test',
  '017-222 4455',
  1,
  'Motorcycle',
  'PJK 6612',
  'D9988776',
  'Available'
);

INSERT INTO parcels
(
  tracking_number,
  sender_name,
  sender_phone,
  sender_address,
  receiver_name,
  receiver_phone,
  receiver_address,
  origin_branch_id,
  destination_branch_id,
  current_branch_id,
  assigned_driver_id,
  parcel_weight,
  parcel_size,
  parcel_category,
  delivery_type,
  delivery_fee,
  current_status,
  estimated_delivery_date
)
VALUES
(
  'PXL202605120001',
  'Ahmad Hakim',
  '012-345 6789',
  'Bayan Lepas, Penang',
  'Nur Aisyah',
  '011-234 5678',
  'Georgetown, Penang',
  1,
  2,
  2,
  1,
  2.40,
  'Medium',
  'Electronics',
  'Express Delivery',
  11.00,
  'OUT_FOR_DELIVERY',
  '2026-05-13'
),
(
  'PXL202605120002',
  'Lim Wei Jian',
  '012-888 9911',
  'Bukit Mertajam, Penang',
  'Siti Hajar',
  '013-456 7890',
  'Shah Alam, Selangor',
  1,
  3,
  3,
  NULL,
  4.80,
  'Large',
  'Home Appliance',
  'Standard Delivery',
  14.60,
  'IN_TRANSIT',
  '2026-05-15'
),
(
  'PXL202605120003',
  'ParcelX Walk-In Customer',
  '014-222 1111',
  'Georgetown, Penang',
  'Muhammad Irfan',
  '019-345 1212',
  'Johor Bahru, Johor',
  2,
  4,
  4,
  2,
  1.20,
  'Small',
  'Document',
  'Express Delivery',
  9.40,
  'DELIVERED',
  '2026-05-13'
);

INSERT INTO tracking_events
(
  parcel_id,
  status,
  title,
  location_name,
  branch_id,
  latitude,
  longitude,
  remarks,
  updated_by,
  created_at
)
VALUES
(
  1,
  'CREATED',
  'Parcel Created',
  'Bayan Lepas, Penang',
  1,
  5.2948000,
  100.2592000,
  'Shipment request has been created.',
  'Customer',
  '2026-05-11 14:45:00'
),
(
  1,
  'PICKED_UP',
  'Parcel Picked Up',
  'Bayan Lepas, Penang',
  1,
  5.2948000,
  100.2592000,
  'Parcel has been picked up from sender.',
  'Staff',
  '2026-05-11 15:15:00'
),
(
  1,
  'ARRIVED_SORTING_HUB',
  'Arrived at Sorting Hub',
  'Penang Sorting Hub',
  1,
  5.4141000,
  100.3288000,
  'Parcel arrived at Penang Sorting Hub.',
  'Staff',
  '2026-05-12 20:30:00'
),
(
  1,
  'ASSIGNED_TO_DRIVER',
  'Assigned to Driver',
  'Georgetown Branch',
  2,
  5.4141000,
  100.3288000,
  'Parcel has been assigned to Daniel Tan.',
  'Admin',
  '2026-05-13 08:30:00'
),
(
  1,
  'OUT_FOR_DELIVERY',
  'Out for Delivery',
  'Georgetown Branch',
  2,
  5.4141000,
  100.3288000,
  'Parcel is out for delivery with driver.',
  'Driver',
  '2026-05-13 09:10:00'
),
(
  2,
  'CREATED',
  'Parcel Created',
  'Bukit Mertajam, Penang',
  1,
  5.3630000,
  100.4667000,
  'Shipment request has been created.',
  'Customer',
  '2026-05-12 10:20:00'
),
(
  2,
  'PICKED_UP',
  'Parcel Picked Up',
  'Bukit Mertajam, Penang',
  1,
  5.3630000,
  100.4667000,
  'Parcel has been picked up from sender.',
  'Staff',
  '2026-05-12 14:00:00'
),
(
  2,
  'ARRIVED_SORTING_HUB',
  'Arrived at Sorting Hub',
  'Penang Sorting Hub',
  1,
  5.4141000,
  100.3288000,
  'Parcel arrived at origin sorting hub.',
  'Staff',
  '2026-05-12 19:40:00'
),
(
  2,
  'IN_TRANSIT',
  'In Transit',
  'Kuala Lumpur Main Hub',
  3,
  3.1390000,
  101.6869000,
  'Parcel is moving to destination hub.',
  'Staff',
  '2026-05-13 06:25:00'
),
(
  3,
  'CREATED',
  'Parcel Created',
  'Georgetown Branch',
  2,
  5.4141000,
  100.3288000,
  'Parcel has been registered by staff.',
  'Staff',
  '2026-05-11 09:30:00'
),
(
  3,
  'PICKED_UP',
  'Parcel Accepted',
  'Georgetown Branch',
  2,
  5.4141000,
  100.3288000,
  'Parcel accepted at ParcelX branch.',
  'Staff',
  '2026-05-11 09:45:00'
),
(
  3,
  'IN_TRANSIT',
  'In Transit',
  'Kuala Lumpur Main Hub',
  3,
  3.1390000,
  101.6869000,
  'Parcel is moving through logistics network.',
  'Staff',
  '2026-05-12 01:25:00'
),
(
  3,
  'OUT_FOR_DELIVERY',
  'Out for Delivery',
  'Johor Bahru Hub',
  4,
  1.4927000,
  103.7414000,
  'Parcel is out for delivery with driver.',
  'Driver',
  '2026-05-13 10:15:00'
),
(
  3,
  'DELIVERED',
  'Delivered',
  'Johor Bahru, Johor',
  4,
  1.4927000,
  103.7414000,
  'Parcel has been delivered to receiver.',
  'Driver',
  '2026-05-13 13:40:00'
);

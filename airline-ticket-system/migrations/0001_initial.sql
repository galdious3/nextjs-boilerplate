-- Create airlines table
CREATE TABLE IF NOT EXISTS airlines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Create flight_prices table
CREATE TABLE IF NOT EXISTS flight_prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_city_id INTEGER,
  to_city_id INTEGER,
  price REAL,
  FOREIGN KEY (from_city_id) REFERENCES cities(id),
  FOREIGN KEY (to_city_id) REFERENCES cities(id)
);

-- Create flight_schedules table
CREATE TABLE IF NOT EXISTS flight_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  airline_id INTEGER,
  from_city_id INTEGER,
  to_city_id INTEGER,
  day_of_week INTEGER,
  departure_time TEXT,
  arrival_time TEXT,
  FOREIGN KEY (airline_id) REFERENCES airlines(id),
  FOREIGN KEY (from_city_id) REFERENCES cities(id),
  FOREIGN KEY (to_city_id) REFERENCES cities(id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  passenger_name TEXT,
  flight_schedule_id INTEGER,
  travel_class TEXT,
  bags_count INTEGER,
  medical_discount BOOLEAN,
  final_price REAL,
  booking_date TEXT,
  FOREIGN KEY (flight_schedule_id) REFERENCES flight_schedules(id)
);

-- Insert initial airlines data
INSERT INTO airlines (name) VALUES 
  ('الخطوط الجوية العراقية'),
  ('طيران الإمارات'),
  ('الخطوط الجوية القطرية'),
  ('الخطوط الجوية التركية'),
  ('الاتحاد للطيران'),
  ('الخطوط الجوية الملكية الأردنية');

-- Insert initial cities data
INSERT INTO cities (name) VALUES 
  ('بغداد'), ('لندن'), ('دبي'), ('القاهرة'), ('إسطنبول'), ('باريس'),
  ('روما'), ('برلين'), ('مدريد'), ('الدوحة'), ('أبوظبي'), ('عمّان');

-- Insert flight prices (Baghdad is always the departure city)
INSERT INTO flight_prices (from_city_id, to_city_id, price) VALUES
  (1, 2, 2000), -- Baghdad to London
  (1, 3, 1800), -- Baghdad to Dubai
  (1, 4, 1500), -- Baghdad to Cairo
  (1, 5, 2200), -- Baghdad to Istanbul
  (1, 6, 2500), -- Baghdad to Paris
  (1, 7, 1900), -- Baghdad to Rome
  (1, 8, 2100), -- Baghdad to Berlin
  (1, 9, 1700), -- Baghdad to Madrid
  (1, 10, 1600), -- Baghdad to Doha
  (1, 11, 2300), -- Baghdad to Abu Dhabi
  (1, 12, 2400); -- Baghdad to Amman

-- Insert some sample flight schedules
-- For each airline, create flights to different destinations on different days
-- Airline 1 (Iraqi Airways)
INSERT INTO flight_schedules (airline_id, from_city_id, to_city_id, day_of_week, departure_time, arrival_time) VALUES
  (1, 1, 2, 0, '09:00', '13:00'), -- Baghdad to London on Sunday
  (1, 1, 3, 1, '10:00', '12:00'), -- Baghdad to Dubai on Monday
  (1, 1, 4, 2, '08:00', '10:00'), -- Baghdad to Cairo on Tuesday
  (1, 1, 5, 3, '11:00', '13:00'); -- Baghdad to Istanbul on Wednesday

-- Airline 2 (Emirates)
INSERT INTO flight_schedules (airline_id, from_city_id, to_city_id, day_of_week, departure_time, arrival_time) VALUES
  (2, 1, 3, 0, '08:00', '10:00'), -- Baghdad to Dubai on Sunday
  (2, 1, 6, 2, '09:00', '13:00'), -- Baghdad to Paris on Tuesday
  (2, 1, 10, 4, '10:00', '11:30'); -- Baghdad to Doha on Friday

-- Airline 3 (Qatar Airways)
INSERT INTO flight_schedules (airline_id, from_city_id, to_city_id, day_of_week, departure_time, arrival_time) VALUES
  (3, 1, 10, 1, '09:00', '10:30'), -- Baghdad to Doha on Monday
  (3, 1, 7, 3, '10:00', '13:00'), -- Baghdad to Rome on Wednesday
  (3, 1, 8, 5, '11:00', '14:00'); -- Baghdad to Berlin on Friday

-- Insert some sample bookings
INSERT INTO bookings (passenger_name, flight_schedule_id, travel_class, bags_count, medical_discount, final_price, booking_date) VALUES
  ('أحمد محمد', 1, 'الدرجة الاقتصادية', 2, 0, 2100, '2025-03-15 10:30:00'),
  ('سارة علي', 3, 'درجة رجال الأعمال', 1, 1, 1800, '2025-03-16 14:45:00'),
  ('محمد حسين', 5, 'الدرجة الأولى', 3, 0, 5000, '2025-03-17 09:15:00');

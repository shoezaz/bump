-- Sample Data for Watch Passport
-- This is for development and testing purposes only

-- Insert sample users
INSERT INTO users (id, email, password, first_name, last_name, kyc_status, user_type, city, country_code) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'collector@example.com', '$2b$10$YourHashedPasswordHere', 'Jean', 'Dupont', 'verified', 'collector', 'Paris', 'FR'),
('550e8400-e29b-41d4-a716-446655440002', 'dealer@example.com', '$2b$10$YourHashedPasswordHere', 'Marie', 'Martin', 'verified', 'dealer', 'Geneva', 'CH'),
('550e8400-e29b-41d4-a716-446655440003', 'expert@example.com', '$2b$10$YourHashedPasswordHere', 'Pierre', 'Bernard', 'verified', 'expert', 'Zurich', 'CH');

-- Insert sample watches
INSERT INTO watches (id, serial_number, brand, model, reference, year, current_value, purchase_price, status, current_owner_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', '8273X92L', 'Rolex', 'Cosmograph Daytona', '116500LN', 2021, 28500.00, 14500.00, 'certified', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'PP-992811', 'Patek Philippe', 'Nautilus', '5711/1A', 2019, 115000.00, 29000.00, 'certified', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440003', 'J-44291', 'Audemars Piguet', 'Royal Oak', '15500ST', 2022, 42000.00, 42000.00, 'warning', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample watch history
INSERT INTO watch_history (watch_id, event_type, event_date, description, entity_name) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'purchase', '2021-12-10', 'Achat Boutique', 'Rolex Champs-Élysées'),
('660e8400-e29b-41d4-a716-446655440001', 'transfer', '2023-01-14', 'Transfert de propriété', 'Jean D.'),
('660e8400-e29b-41d4-a716-446655440001', 'service', '2025-11-22', 'Contrôle d''étanchéité', 'Atelier Certifié Paris'),
('660e8400-e29b-41d4-a716-446655440002', 'purchase', '2019-02-12', 'Première mise en circulation', 'Salons Patek'),
('660e8400-e29b-41d4-a716-446655440002', 'service', '2022-03-05', 'Polissage complet', 'Patek Philippe Geneva'),
('660e8400-e29b-41d4-a716-446655440003', 'purchase', '2022-06-02', 'Achat', 'Revendeur Tiers'),
('660e8400-e29b-41d4-a716-446655440003', 'alert', '2024-10-10', 'Signalement: Cadran suspect', 'Expert Veritas');

-- Note: Password hashes are placeholders. In production, use proper bcrypt hashes.
-- The sample password for all users is: "password123"
-- To generate a real hash: await bcrypt.hash('password123', 10)

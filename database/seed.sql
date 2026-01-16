-- Seed Data for Mahber Iddir

-- Settings
INSERT INTO app_settings (key, value) VALUES 
('hero_bg_url', 'https://images.unsplash.com/photo-1489712310660-3162b7405e6b?q=80&w=2000&auto=format&fit=crop'),
('login_bg_url', 'https://images.unsplash.com/photo-1542642831-255e2c595088?q=80&w=2000');

-- Members
INSERT INTO members (id, full_name, email, phone, role, status, join_date, balance, avatar_url, gender, password_hash) VALUES
('m00001', 'Brhane Berihu', 'brhaneb@gmail.com.com', '+251 914 41 15 67', 'ADMIN', 'ACTIVE', CURRENT_DATE - INTERVAL '180 days', 2200.00, 'https://picsum.photos/100/100?random=1', 'MALE', '123456'),
('m00002', 'Abebe Kebede', 'abebe.treasurer@example.com', '+251 911 22 33 44', 'TREASURER', 'ACTIVE', CURRENT_DATE - INTERVAL '150 days', 1500.00, 'https://picsum.photos/100/100?random=3', 'MALE', '123456'),
('m00003', 'Aster Mulugeta', 'aster.secretary@example.com', '+251 922 44 55 66', 'SECRETARY', 'ACTIVE', CURRENT_DATE - INTERVAL '120 days', 1800.00, 'https://picsum.photos/100/100?random=4', 'FEMALE', '123456'),
('m00008', 'Temesgen G/michael', 'tmacbel12@gmail.com.com', '+251 914 82 51 74', 'MEMBER', 'ACTIVE', CURRENT_DATE - INTERVAL '60 days', 2200.00, 'https://picsum.photos/100/100?random=2', 'MALE', '123456');

-- Transactions
INSERT INTO transactions (id, member_id, amount, type, description, transaction_date) VALUES
('t1', 'm00001', 100.00, 'CONTRIBUTION', 'Monthly Dues', CURRENT_DATE - INTERVAL '30 days'),
('t2', 'm00002', 100.00, 'CONTRIBUTION', 'Monthly Dues', CURRENT_DATE - INTERVAL '25 days'),
('t3', 'm00001', 100.00, 'CONTRIBUTION', 'Monthly Dues', CURRENT_DATE - INTERVAL '1 day');

-- Claims
INSERT INTO claims (id, member_id, type, description, amount_requested, status, date_filed) VALUES
('c1', 'm00002', 'FUNERAL', 'Passing of aunt', 5000.00, 'PENDING', CURRENT_DATE - INTERVAL '3 days');

-- Gallery
INSERT INTO gallery_items (id, url, category, title, year) VALUES
('g1', 'https://images.unsplash.com/photo-1542642831-255e2c595088?q=80&w=1000', 'MEETINGS', 'Monthly Assembly', 2024),
('g2', 'https://images.unsplash.com/photo-1489712310660-3162b7405e6b?q=80&w=1000', 'FEASTS', 'Annual Feast', 2023),
('g3', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000', 'MEETINGS', 'Committee Discussion', 2024),
('g4', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000', 'SERVICE', 'Community Cleaning', 2023),
('g5', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000', 'FEASTS', 'Traditional Holiday', 2024),
('g6', 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=1000', 'SERVICE', 'Youth Volunteering', 2023);

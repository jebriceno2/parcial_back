-- ============================================================
-- SEED DATA: Roles y usuario admin inicial
-- Ejecutar después de las migraciones:
--   psql -U postgres -d parcial_db -f scripts/seed.sql
-- ============================================================

-- 1. Roles base
INSERT INTO roles (id, role_name, description) VALUES
  (gen_random_uuid(), 'admin', 'Administrador del sistema'),
  (gen_random_uuid(), 'user',  'Usuario regular'),
  (gen_random_uuid(), 'doctor', 'Doctor')
ON CONFLICT (role_name) DO NOTHING;

-- 2. Usuario admin de prueba
-- La password está hasheada con bcrypt (saltRounds=10) y corresponde a "admin123".
INSERT INTO users (id, email, password, name, phone, is_active)
VALUES (
  gen_random_uuid(),
  'admin@test.com',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin Principal',
  NULL,
  true
)
ON CONFLICT (email) DO NOTHING;

-- 3. Asociar admin@test.com con el rol "admin"
INSERT INTO user_roles ("usersId", "rolesId")
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@test.com' AND r.role_name = 'admin'
ON CONFLICT DO NOTHING;

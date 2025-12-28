-- Migration: Add Administrative Division Tables
-- Date: 2025-12-28

-- 1. Create provinces table
CREATE TABLE IF NOT EXISTS provinces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Create wards table
CREATE TABLE IF NOT EXISTS wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province_id UUID NOT NULL REFERENCES provinces(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Create neighborhood_groups table
CREATE TABLE IF NOT EXISTS neighborhood_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id UUID NOT NULL REFERENCES wards(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    to_truong_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Add new columns to households table
ALTER TABLE households 
ADD COLUMN IF NOT EXISTS ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS neighborhood_group_id UUID REFERENCES neighborhood_groups(id) ON DELETE SET NULL;

-- 5. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wards_province_id ON wards(province_id);
CREATE INDEX IF NOT EXISTS idx_neighborhood_groups_ward_id ON neighborhood_groups(ward_id);
CREATE INDEX IF NOT EXISTS idx_households_ward_id ON households(ward_id);
CREATE INDEX IF NOT EXISTS idx_households_neighborhood_group_id ON households(neighborhood_group_id);

-- 6. Insert sample data (optional - can be removed)
-- INSERT INTO provinces (name, code) VALUES ('Hà Nội', 'HN');
-- INSERT INTO wards (province_id, name, code) 
--     SELECT id, 'Phường Bách Khoa', 'BK' FROM provinces WHERE code = 'HN';

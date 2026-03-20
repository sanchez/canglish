-- Add user_id column for cross-device sync
-- This migration adds user_id to progress_entries and flags tables
-- and creates unique constraints on (user_id, item_id)

-- Add user_id to progress_entries
ALTER TABLE progress_entries
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add user_id to flags
ALTER TABLE flags
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Drop existing device_id based constraints
ALTER TABLE progress_entries DROP CONSTRAINT IF EXISTS progress_entries_device_id_item_id_key;
ALTER TABLE flags DROP CONSTRAINT IF EXISTS flags_device_id_item_id_key;

-- Create unique constraints on user_id + item_id
ALTER TABLE progress_entries
ADD CONSTRAINT progress_entries_user_id_item_id_key UNIQUE (user_id, item_id);

ALTER TABLE flags
ADD CONSTRAINT flags_user_id_item_id_key UNIQUE (user_id, item_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_id ON progress_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_flags_user_id ON flags(user_id);

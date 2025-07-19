-- Add rejection_reason column to businesses table
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
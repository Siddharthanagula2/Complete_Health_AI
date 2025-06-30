/*
  # Add medication reminders table

  1. New Tables
    - `medication_reminders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `medication_name` (text)
      - `dosage` (text)
      - `frequency` (text)
      - `time_of_day` (text[])
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `medication_reminders` table
    - Add policies for CRUD operations
*/

-- Create medication_reminders table
CREATE TABLE IF NOT EXISTS medication_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  medication_name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  time_of_day text[] NOT NULL,
  start_date date NOT NULL,
  end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_medication_reminders_updated_at'
  ) THEN
    CREATE TRIGGER update_medication_reminders_updated_at
    BEFORE UPDATE ON medication_reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own medication reminders"
  ON medication_reminders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medication reminders"
  ON medication_reminders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication reminders"
  ON medication_reminders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication reminders"
  ON medication_reminders
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS medication_reminders_user_id_idx ON medication_reminders(user_id);
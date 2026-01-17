-- ============================================================================
-- ARKA-ED Initial Database Schema
-- ============================================================================
-- This migration creates the complete database schema for ARKA-ED
-- including enums, tables, indexes, functions, triggers, and RLS policies.
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'resident', 'attending', 'admin');
CREATE TYPE specialty_track AS ENUM ('em', 'im', 'fm', 'surgery', 'peds');
CREATE TYPE case_category AS ENUM (
  'low-back-pain',
  'headache',
  'chest-pain',
  'abdominal-pain',
  'extremity-trauma'
);
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE modality AS ENUM (
  'xray',
  'ct',
  'mri',
  'ultrasound',
  'nuclear',
  'fluoroscopy',
  'mammography',
  'pet'
);
CREATE TYPE acr_category AS ENUM (
  'usually-appropriate',
  'may-be-appropriate',
  'usually-not-appropriate'
);
CREATE TYPE attempt_mode AS ENUM ('practice', 'assessment', 'learning');
CREATE TYPE assessment_status AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'abandoned'
);
CREATE TYPE achievement_category AS ENUM (
  'completion',
  'accuracy',
  'streak',
  'speed',
  'specialty',
  'milestone'
);
CREATE TYPE clinical_pearl_category AS ENUM (
  'clinical-pearl',
  'high-yield',
  'common-mistake',
  'board-favorite'
);
CREATE TYPE patient_sex AS ENUM ('male', 'female');
CREATE TYPE temperature_unit AS ENUM ('celsius', 'fahrenheit');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student',
  institution TEXT,
  specialty_track specialty_track,
  training_year INTEGER CHECK (training_year >= 1 AND training_year <= 10),
  streak_count INTEGER NOT NULL DEFAULT 0 CHECK (streak_count >= 0),
  last_activity_date DATE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cases
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  chief_complaint TEXT NOT NULL,
  clinical_vignette TEXT NOT NULL,
  patient_age INTEGER NOT NULL CHECK (patient_age >= 0 AND patient_age <= 150),
  patient_sex patient_sex NOT NULL,
  patient_history TEXT[] NOT NULL DEFAULT '{}',
  vital_signs JSONB,
  physical_exam TEXT,
  lab_results JSONB,
  category case_category NOT NULL,
  specialty_tags specialty_track[] NOT NULL DEFAULT '{}',
  difficulty difficulty_level NOT NULL,
  acr_topic TEXT NOT NULL,
  optimal_imaging UUID[] NOT NULL DEFAULT '{}',
  explanation TEXT NOT NULL,
  teaching_points TEXT[] NOT NULL DEFAULT '{}',
  clinical_pearls JSONB,
  hints TEXT[],
  references JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Imaging Options
CREATE TABLE imaging_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  modality modality NOT NULL,
  body_region TEXT NOT NULL,
  with_contrast BOOLEAN NOT NULL DEFAULT false,
  typical_cost_usd NUMERIC(10, 2) NOT NULL CHECK (typical_cost_usd >= 0),
  radiation_msv NUMERIC(6, 2) NOT NULL CHECK (radiation_msv >= 0),
  description TEXT NOT NULL,
  common_indications TEXT[] NOT NULL DEFAULT '{}',
  contraindications TEXT[] NOT NULL DEFAULT '{}',
  duration TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case Imaging Ratings
CREATE TABLE case_imaging_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  imaging_option_id UUID NOT NULL REFERENCES imaging_options(id) ON DELETE CASCADE,
  acr_rating INTEGER NOT NULL CHECK (acr_rating >= 1 AND acr_rating <= 9),
  rating_category acr_category NOT NULL,
  rationale TEXT NOT NULL,
  acr_reference TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(case_id, imaging_option_id)
);

-- User Case Attempts
CREATE TABLE user_case_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  selected_imaging UUID[] NOT NULL DEFAULT '{}',
  acr_rating_received INTEGER CHECK (acr_rating_received IS NULL OR (acr_rating_received >= 1 AND acr_rating_received <= 9)),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER NOT NULL CHECK (time_spent_seconds >= 0),
  mode attempt_mode NOT NULL,
  assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
  hints_used INTEGER NOT NULL DEFAULT 0 CHECK (hints_used >= 0),
  feedback_viewed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  case_ids UUID[] NOT NULL DEFAULT '{}',
  time_limit_minutes INTEGER CHECK (time_limit_minutes IS NULL OR time_limit_minutes > 0),
  passing_score INTEGER NOT NULL CHECK (passing_score >= 0 AND passing_score <= 100),
  specialty_track specialty_track,
  difficulty difficulty_level,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Assessments
CREATE TABLE user_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  status assessment_status NOT NULL DEFAULT 'not_started',
  current_case_index INTEGER NOT NULL DEFAULT 0 CHECK (current_case_index >= 0),
  score INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  passed BOOLEAN,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_remaining_seconds INTEGER CHECK (time_remaining_seconds IS NULL OR time_remaining_seconds >= 0),
  answers JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category achievement_category NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL CHECK (requirement_value >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_specialty_track ON profiles(specialty_track);

-- Cases indexes
CREATE INDEX idx_cases_category ON cases(category);
CREATE INDEX idx_cases_specialty_tags ON cases USING GIN(specialty_tags);
CREATE INDEX idx_cases_difficulty ON cases(difficulty);
CREATE INDEX idx_cases_is_published ON cases(is_published) WHERE is_published = true;
CREATE INDEX idx_cases_slug ON cases(slug);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);

-- Imaging Options indexes
CREATE INDEX idx_imaging_options_modality ON imaging_options(modality);
CREATE INDEX idx_imaging_options_is_active ON imaging_options(is_active) WHERE is_active = true;
CREATE INDEX idx_imaging_options_body_region ON imaging_options(body_region);

-- Case Imaging Ratings indexes
CREATE INDEX idx_case_imaging_ratings_case_id ON case_imaging_ratings(case_id);
CREATE INDEX idx_case_imaging_ratings_imaging_option_id ON case_imaging_ratings(imaging_option_id);
CREATE INDEX idx_case_imaging_ratings_acr_rating ON case_imaging_ratings(acr_rating);

-- User Case Attempts indexes
CREATE INDEX idx_user_case_attempts_user_id ON user_case_attempts(user_id);
CREATE INDEX idx_user_case_attempts_case_id ON user_case_attempts(case_id);
CREATE INDEX idx_user_case_attempts_created_at ON user_case_attempts(created_at DESC);
CREATE INDEX idx_user_case_attempts_mode ON user_case_attempts(mode);
CREATE INDEX idx_user_case_attempts_assessment_id ON user_case_attempts(assessment_id) WHERE assessment_id IS NOT NULL;
CREATE INDEX idx_user_case_attempts_user_case ON user_case_attempts(user_id, case_id);

-- Assessments indexes
CREATE INDEX idx_assessments_specialty_track ON assessments(specialty_track) WHERE specialty_track IS NOT NULL;
CREATE INDEX idx_assessments_difficulty ON assessments(difficulty) WHERE difficulty IS NOT NULL;
CREATE INDEX idx_assessments_is_published ON assessments(is_published) WHERE is_published = true;
CREATE INDEX idx_assessments_is_custom ON assessments(is_custom) WHERE is_custom = true;
CREATE INDEX idx_assessments_created_by ON assessments(created_by) WHERE created_by IS NOT NULL;

-- User Assessments indexes
CREATE INDEX idx_user_assessments_user_id ON user_assessments(user_id);
CREATE INDEX idx_user_assessments_assessment_id ON user_assessments(assessment_id);
CREATE INDEX idx_user_assessments_status ON user_assessments(status);
CREATE INDEX idx_user_assessments_user_status ON user_assessments(user_id, status);

-- Achievements indexes
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_is_active ON achievements(is_active) WHERE is_active = true;
CREATE INDEX idx_achievements_slug ON achievements(slug);

-- User Achievements indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_achieved_at ON user_achievements(achieved_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate user progress
CREATE OR REPLACE FUNCTION calculate_user_progress(p_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  total_cases_attempted BIGINT,
  total_cases_completed BIGINT,
  overall_accuracy NUMERIC,
  current_streak INTEGER,
  longest_streak INTEGER,
  total_time_spent BIGINT,
  category_progress JSONB,
  specialty_progress JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH attempt_stats AS (
    SELECT
      COUNT(DISTINCT case_id) as attempted,
      COUNT(DISTINCT CASE WHEN is_correct THEN case_id END) as completed,
      AVG(score) as avg_score,
      SUM(time_spent_seconds) as total_time
    FROM user_case_attempts
    WHERE user_id = p_user_id
  ),
  streak_data AS (
    SELECT
      streak_count as current,
      (SELECT MAX(streak_count) FROM profiles WHERE id = p_user_id) as longest
    FROM profiles
    WHERE id = p_user_id
  ),
  category_stats AS (
    SELECT
      c.category,
      COUNT(DISTINCT uca.case_id) as attempted,
      COUNT(DISTINCT CASE WHEN uca.is_correct THEN uca.case_id END) as completed,
      AVG(uca.score) as accuracy
    FROM user_case_attempts uca
    JOIN cases c ON c.id = uca.case_id
    WHERE uca.user_id = p_user_id
    GROUP BY c.category
  ),
  specialty_stats AS (
    SELECT
      unnest(c.specialty_tags) as specialty,
      COUNT(DISTINCT uca.case_id) as attempted,
      COUNT(DISTINCT CASE WHEN uca.is_correct THEN uca.case_id END) as completed,
      AVG(uca.score) as accuracy
    FROM user_case_attempts uca
    JOIN cases c ON c.id = uca.case_id
    WHERE uca.user_id = p_user_id
    GROUP BY unnest(c.specialty_tags)
  )
  SELECT
    p_user_id,
    COALESCE(attempt_stats.attempted, 0)::BIGINT,
    COALESCE(attempt_stats.completed, 0)::BIGINT,
    COALESCE(ROUND(attempt_stats.avg_score, 2), 0)::NUMERIC,
    COALESCE(streak_data.current, 0),
    COALESCE(streak_data.longest, 0),
    COALESCE(attempt_stats.total_time, 0)::BIGINT,
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'category', category_stats.category,
        'attempted', category_stats.attempted,
        'completed', category_stats.completed,
        'accuracy', ROUND(category_stats.accuracy, 2)
      )
    ) FILTER (WHERE category_stats.category IS NOT NULL), '[]'::jsonb),
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'specialty', specialty_stats.specialty,
        'cases_attempted', specialty_stats.attempted,
        'cases_completed', specialty_stats.completed,
        'accuracy', ROUND(specialty_stats.accuracy, 2)
      )
    ) FILTER (WHERE specialty_stats.specialty IS NOT NULL), '[]'::jsonb)
  FROM attempt_stats
  CROSS JOIN streak_data
  LEFT JOIN category_stats ON true
  LEFT JOIN specialty_stats ON true
  GROUP BY attempt_stats.attempted, attempt_stats.completed, attempt_stats.avg_score,
           attempt_stats.total_time, streak_data.current, streak_data.longest;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at on all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_imaging_options_updated_at
  BEFORE UPDATE ON imaging_options
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_case_imaging_ratings_updated_at
  BEFORE UPDATE ON case_imaging_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_assessments_updated_at
  BEFORE UPDATE ON user_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_imaging_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_case_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Cases policies
CREATE POLICY "Anyone can view published cases"
  ON cases FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all cases"
  ON cases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Imaging Options policies
CREATE POLICY "Anyone can view active imaging options"
  ON imaging_options FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage imaging options"
  ON imaging_options FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Case Imaging Ratings policies
CREATE POLICY "Anyone can view case imaging ratings"
  ON case_imaging_ratings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage case imaging ratings"
  ON case_imaging_ratings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- User Case Attempts policies
CREATE POLICY "Users can manage own case attempts"
  ON user_case_attempts FOR ALL
  USING (auth.uid() = user_id);

-- Assessments policies
CREATE POLICY "Anyone can view published assessments"
  ON assessments FOR SELECT
  USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Users can create custom assessments"
  ON assessments FOR INSERT
  WITH CHECK (
    is_custom = true
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update own custom assessments"
  ON assessments FOR UPDATE
  USING (
    is_custom = true
    AND created_by = auth.uid()
  );

CREATE POLICY "Admins can manage all assessments"
  ON assessments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- User Assessments policies
CREATE POLICY "Users can manage own assessments"
  ON user_assessments FOR ALL
  USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Anyone can view active achievements"
  ON achievements FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage achievements"
  ON achievements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- User Achievements policies
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert user achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (true); -- Achievement system will insert via service role

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles extending auth.users';
COMMENT ON TABLE cases IS 'Clinical case studies with patient information';
COMMENT ON TABLE imaging_options IS 'Available imaging modalities and options';
COMMENT ON TABLE case_imaging_ratings IS 'ACR appropriateness ratings for imaging options per case';
COMMENT ON TABLE user_case_attempts IS 'User attempts at solving cases';
COMMENT ON TABLE assessments IS 'Assessment definitions with case collections';
COMMENT ON TABLE user_assessments IS 'User assessment attempts and progress';
COMMENT ON TABLE achievements IS 'Achievement definitions';
COMMENT ON TABLE user_achievements IS 'User achievement unlocks';

COMMENT ON FUNCTION calculate_user_progress IS 'Calculates comprehensive user progress statistics';
COMMENT ON FUNCTION handle_new_user IS 'Creates profile when new user signs up';
COMMENT ON FUNCTION update_updated_at IS 'Updates updated_at timestamp on row update';

-- CareerPath Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with authentication
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  age INTEGER CHECK (age >= 16 AND age <= 65),
  education VARCHAR(100),
  city VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Test results table  
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_type VARCHAR(50) DEFAULT 'personality',
  answers JSONB NOT NULL,
  personality_scores JSONB,
  ai_analysis TEXT,
  recommended_careers JSONB,
  match_scores JSONB,
  completion_time INTEGER, -- in seconds
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat sessions table for AI counseling
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_title VARCHAR(255) DEFAULT 'Career Chat',
  messages JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Career feedback table
CREATE TABLE career_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  career_id VARCHAR(50) NOT NULL,
  career_title VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  is_interested BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User sessions for analytics
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_data JSONB,
  page_views INTEGER DEFAULT 0,
  test_completed BOOLEAN DEFAULT false,
  duration_minutes INTEGER,
  device_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Career recommendations cache
CREATE TABLE career_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personality_hash VARCHAR(255) UNIQUE,
  recommendations JSONB NOT NULL,
  ai_analysis TEXT,
  cache_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_created_at ON test_results(created_at);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_career_feedback_user_id ON career_feedback(user_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_career_cache_hash ON career_cache(personality_hash);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Test results policies
CREATE POLICY "Users can view own test results" ON test_results
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own test results" ON test_results
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Chat sessions policies
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Career feedback policies
CREATE POLICY "Users can manage own feedback" ON career_feedback
    FOR ALL USING (auth.uid()::text = user_id::text);

-- User sessions policies
CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Insert some sample career data
INSERT INTO career_cache (personality_hash, recommendations, ai_analysis) VALUES 
('sample_high_openness', 
 '[{"id": "1", "title": "Frontend Developer", "match": 85}, {"id": "2", "title": "UX Designer", "match": 78}]',
 'Bu shaxs ijodiy va yangi texnologiyalarga ochiq, shuning uchun IT sohasida yaxshi natija beradi.');

-- Analytics view
CREATE VIEW user_analytics AS
SELECT 
    u.id,
    u.name,
    u.city,
    u.education,
    COUNT(tr.id) as tests_completed,
    COUNT(cs.id) as chat_sessions_count,
    MAX(tr.created_at) as last_test_date
FROM users u
LEFT JOIN test_results tr ON u.id = tr.user_id
LEFT JOIN chat_sessions cs ON u.id = cs.user_id
GROUP BY u.id, u.name, u.city, u.education;

-- Usage: Run this entire script in Supabase SQL Editor
-- After running, your database will be ready for CareerPath application
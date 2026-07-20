-- =========================================================================
-- UPZEAL FULL SUPABASE DATABASE SCHEMA
-- Copy and run this script in the Supabase SQL Editor (SQL Scratchpad)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. USERS TABLE (Linked to Supabase Auth)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'developer', -- 'developer', 'recruiter', 'admin'
    auth_provider VARCHAR(50) DEFAULT 'email', -- 'email', 'google', 'github'
    onboarding_phase VARCHAR(50) DEFAULT 'phase_1', -- 'phase_1', 'phase_2', 'phase_3'
    dashboard_config JSONB DEFAULT '{}'::jsonb,
    profile_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 2. COMPANIES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    description TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 3. PROJECTS TABLE (Challenges, Bounties, or Jobs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget VARCHAR(100),
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'completed'
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 4. APPLICATIONS TABLE (Developers applying to Projects)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    developer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'shortlisted', 'hired', 'rejected'
    resume_url VARCHAR(500),
    cover_letter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, developer_id) -- Prevent duplicate applications
);

-- =========================================================================
-- 5. SKILL SCORES TABLE (Verified or self-reported scores)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.skill_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_name)
);

-- =========================================================================
-- 6. REQUIRED SKILLS TABLE (Project requirements)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.required_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    min_score INTEGER DEFAULT 0 CHECK (min_score >= 0 AND min_score <= 100),
    UNIQUE(project_id, skill_name)
);

-- =========================================================================
-- 7. REVIEWS TABLE (Post-project feedback)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- TRIGGERS & FUNCTIONS
-- =========================================================================

-- Trigger to automatically create a public.users row upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id, 
        email, 
        username,
        first_name, 
        last_name, 
        auth_provider,
        role
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'username', ''),
        COALESCE(new.raw_user_meta_data->>'first_name', ''),
        COALESCE(new.raw_user_meta_data->>'last_name', ''),
        COALESCE(new.raw_app_meta_data->>'provider', 'email'),
        COALESCE(new.raw_user_meta_data->>'role', 'developer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger to automatically update 'updated_at' columns on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind updated_at trigger to tables
CREATE OR REPLACE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_skill_scores_updated_at BEFORE UPDATE ON public.skill_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.required_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
-- 1. USERS POLICIES
DROP POLICY IF EXISTS "Allow public read access to users" ON public.users;
DROP POLICY IF EXISTS "Allow users to update their own data" ON public.users;
CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 2. COMPANIES POLICIES
DROP POLICY IF EXISTS "Allow public read access to companies" ON public.companies;
DROP POLICY IF EXISTS "Allow recruiters to insert companies" ON public.companies;
DROP POLICY IF EXISTS "Allow company owner to update" ON public.companies;
CREATE POLICY "Allow public read access to companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow recruiters to insert companies" ON public.companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow company owner to update" ON public.companies FOR UPDATE USING (auth.uid() = created_by);

-- 3. PROJECTS POLICIES
DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow recruiters to insert projects" ON public.projects;
DROP POLICY IF EXISTS "Allow project creator to update" ON public.projects;
CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow recruiters to insert projects" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow project creator to update" ON public.projects FOR UPDATE USING (auth.uid() = created_by);

-- 4. APPLICATIONS POLICIES
DROP POLICY IF EXISTS "Allow applicants and project owners to read applications" ON public.applications;
DROP POLICY IF EXISTS "Allow developers to submit applications" ON public.applications;
DROP POLICY IF EXISTS "Allow applicant or project owner to update applications" ON public.applications;
CREATE POLICY "Allow applicants and project owners to read applications" 
    ON public.applications FOR SELECT 
    USING (
        auth.uid() = developer_id OR 
        auth.uid() IN (SELECT created_by FROM public.projects WHERE id = project_id)
    );
CREATE POLICY "Allow developers to submit applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = developer_id);
CREATE POLICY "Allow applicant or project owner to update applications" 
    ON public.applications FOR UPDATE 
    USING (
        auth.uid() = developer_id OR 
        auth.uid() IN (SELECT created_by FROM public.projects WHERE id = project_id)
    );

-- 5. SKILL SCORES POLICIES
DROP POLICY IF EXISTS "Allow public read access to skill scores" ON public.skill_scores;
DROP POLICY IF EXISTS "Allow developers to update own skill scores" ON public.skill_scores;
CREATE POLICY "Allow public read access to skill scores" ON public.skill_scores FOR SELECT USING (true);
CREATE POLICY "Allow developers to update own skill scores" ON public.skill_scores FOR ALL USING (auth.uid() = user_id);

-- 6. REQUIRED SKILLS POLICIES
DROP POLICY IF EXISTS "Allow public read access to required skills" ON public.required_skills;
DROP POLICY IF EXISTS "Allow project owner to manage required skills" ON public.required_skills;
CREATE POLICY "Allow public read access to required skills" ON public.required_skills FOR SELECT USING (true);
CREATE POLICY "Allow project owner to manage required skills" 
    ON public.required_skills FOR ALL 
    USING (auth.uid() = (SELECT created_by FROM public.projects WHERE id = project_id));

-- 7. REVIEWS POLICIES
DROP POLICY IF EXISTS "Allow public read access to reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated users to write reviews" ON public.reviews;
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to write reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =========================================================================
-- 8. PERSISTENT MESSAGES TABLE (Real-time Peer-to-Peer Chat)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existences to prevent duplicate policies errors
DROP POLICY IF EXISTS "Allow users to read their own messages" ON public.messages;
DROP POLICY IF EXISTS "Allow users to insert their own messages" ON public.messages;

-- RLS Policies
CREATE POLICY "Allow users to read their own messages" 
    ON public.messages FOR SELECT 
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Allow users to insert their own messages" 
    ON public.messages FOR INSERT 
    WITH CHECK (auth.uid() = sender_id);

-- Enable Supabase Realtime for messages table
alter publication supabase_realtime add table public.messages;

-- =========================================================================
-- 9. HIGH-PERFORMANCE B-TREE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_applications_dev_proj ON public.applications (developer_id, project_id);
CREATE INDEX IF NOT EXISTS idx_skill_scores_user ON public.skill_scores (user_id, skill_name);
CREATE INDEX IF NOT EXISTS idx_projects_company ON public.projects (company_id, status);
CREATE INDEX IF NOT EXISTS idx_required_skills_proj ON public.required_skills (project_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages (sender_id, receiver_id, created_at);


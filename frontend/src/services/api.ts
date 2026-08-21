import { supabase } from '../supabaseClient';
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const API_BASE_URL = rawApiUrl.endsWith('/api/v1') || rawApiUrl.endsWith('/api/v1/')
  ? rawApiUrl
  : rawApiUrl.replace(/\/$/, '') + '/api/v1';

class ClientCache {
  private cache: Record<string, { val: any; expiresAt: number }> = {};
  
  get(key: string): any {
    const item = this.cache[key];
    if (item) {
      if (Date.now() < item.expiresAt) {
        return item.val;
      }
      delete this.cache[key];
    }
    return null;
  }

  set(key: string, val: any, ttlMs: number = 15000): void {
    this.cache[key] = { val, expiresAt: Date.now() + ttlMs };
  }

  invalidate(key: string): void {
    delete this.cache[key];
  }
}

const clientCache = new ClientCache();

class ApiService {
  private async getAuthHeader(): Promise<Record<string, string>> {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  }

  async getMe(): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/users/me`, { headers });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend API unavailable, falling back to direct client session:", err);
    }
    return null;
  }

  async updateProfile(profile: { bio?: string; location?: string; avatar_url?: string }): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/users/me/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profile)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend API unavailable, executing via Supabase client:", err);
    }
    return null;
  }

  async getChallenges(): Promise<any[]> {
    const cacheKey = 'challenges_list';
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/challenges/`, { headers });
      if (res.ok) {
        const data = await res.json();
        clientCache.set(cacheKey, data, 15000); // Cache for 15 seconds
        return data;
      }
    } catch (err) {
      console.warn("Backend API unavailable, falling back to client fetch:", err);
    }
    return [];
  }

  async joinChallenge(projectId: string): Promise<any> {
    clientCache.invalidate('challenges_list');
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/challenges/join`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ project_id: projectId })
      });
      if (res.ok) return await res.json();
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Server error (Status ${res.status})`);
    } catch (err: any) {
      console.warn("Backend API issue:", err);
      throw err;
    }
  }

  async acceptApplication(appId: string): Promise<any> {
    clientCache.invalidate('challenges_list');
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/applications/${appId}/accept`, {
        method: 'POST',
        headers
      });
      if (res.ok) return await res.json();
      throw new Error(`Failed to accept application (Status ${res.status})`);
    } catch (err) {
      console.error("Error accepting application:", err);
      throw err;
    }
  }

  getWsBaseUrl(): string {
    const isLocal = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');
    const wsProtocol = isLocal ? 'ws://' : 'wss://';
    return API_BASE_URL.replace(/^https?:\/\//, wsProtocol);
  }

  async askMentor(query: string): Promise<string | null> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/mentor/ask`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch (err) {
      console.warn("Backend AI mentor unavailable:", err);
    }
    return null;
  }

  async getCompanyProfile(): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/company/me`, { headers });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend company service unavailable:", err);
    }
    return null;
  }

  async saveCompanyProfile(company: { name: string; logo_url?: string; website?: string; description?: string }): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/company/profile`, {
        method: 'POST',
        headers,
        body: JSON.stringify(company)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend company update unavailable:", err);
    }
    return null;
  }

  async getEvaluation(): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/evaluation/my-evaluation`, { headers });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend evaluation fetch failed:", err);
    }
    return null;
  }

  async triggerEvaluation(userId?: string): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const queryParams = userId ? `?target_user_id=${userId}` : '';
      const res = await fetch(`${API_BASE_URL}/evaluation/evaluate${queryParams}`, {
        method: 'POST',
        headers
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend trigger evaluation failed:", err);
    }
    return null;
  }

  async getDevelopers(): Promise<any[]> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/skills/developers`, { headers });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend developers list fetch failed:", err);
    }
    return [];
  }
  async onboardDeveloper(developerId: string, projectId: string): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/applications/onboard`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ developer_id: developerId, project_id: projectId })
      });
      if (res.ok) return await res.json();
      else {
        const errText = await res.text();
        let errMsg = "Failed to onboard candidate";
        try {
          const errData = JSON.parse(errText);
          errMsg = errData.detail || errMsg;
        } catch {
          errMsg = errText || errMsg;
        }
        throw new Error(errMsg);
      }
    } catch (err: any) {
      console.warn("Backend onboard developer failed:", err);
      throw err;
    }
  }

  async getOngoingProjects(): Promise<any[]> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/ongoing-projects/list`, { headers });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend get ongoing projects failed:", err);
    }
    return [];
  }

  async getProjectSubmissions(projectId: string): Promise<any[]> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/ongoing-projects/${projectId}/submissions`, { headers });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend get project submissions failed:", err);
    }
    return [];
  }

  async submitProjectFile(projectId: string, level: string, fileName: string, fileContent: string): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/ongoing-projects/${projectId}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ level, file_name: fileName, file_content: fileContent })
      });
      if (res.ok) return await res.json();
      else {
        const errText = await res.text();
        throw new Error(errText);
      }
    } catch (err: any) {
      console.warn("Backend submit project file failed:", err);
      throw err;
    }
  }

  async submitSubmissionFeedback(submissionId: string, feedback: string): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/ongoing-projects/submissions/${submissionId}/feedback`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ feedback })
      });
      if (res.ok) return await res.json();
      else {
        const errText = await res.text();
        throw new Error(errText);
      }
    } catch (err: any) {
      console.warn("Backend submit feedback failed:", err);
      throw err;
    }
  }
}

export const apiService = new ApiService();

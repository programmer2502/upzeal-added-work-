import { supabase } from '../supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/challenges/`, { headers });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend API unavailable, falling back to client fetch:", err);
    }
    return [];
  }

  async joinChallenge(projectId: string): Promise<any> {
    try {
      const headers = await this.getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/challenges/join`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ project_id: projectId })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend API unavailable, executing join client side:", err);
    }
    return null;
  }

  async acceptApplication(appId: string): Promise<any> {
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
}

export const apiService = new ApiService();

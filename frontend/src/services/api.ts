// ERE-TN Unified API Client Service

const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const getToken = (): string | null => {
  return localStorage.getItem('ere_tn_token') || localStorage.getItem('edunova_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('ere_tn_token', token);
  localStorage.setItem('edunova_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('ere_tn_token');
  localStorage.removeItem('edunova_token');
};

/** Returns the active UI language stored by LanguageContext */
export const getActiveLang = (): string => {
  const lang = localStorage.getItem('ere_tn_lang') || localStorage.getItem('edunova_lang') || 'en';
  return ['en', 'ta', 'hi'].includes(lang) ? lang : 'en';
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const lang = getActiveLang();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': lang,
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Append lang query param to GET requests that don't already have it
  let resolvedEndpoint = endpoint;
  if (!endpoint.includes('lang=')) {
    const separator = endpoint.includes('?') ? '&' : '?';
    resolvedEndpoint = `${endpoint}${separator}lang=${lang}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${resolvedEndpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      localStorage.removeItem('ere_tn_user');
      localStorage.removeItem('edunova_user');
      window.location.href = '/login';
      return {} as T;
    }

    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  // Handle empty 204 or 200 responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return {} as T;
}

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: any) =>
    apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerMentor: (data: any) =>
    apiRequest<any>('/auth/mentor/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => apiRequest<any>('/auth/me'),
};

export const studentApi = {
  getProfile: () => apiRequest<any>('/students/profile'),
  updateProfile: (data: any) =>
    apiRequest<any>('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const mentorApi = {
  getApprovedMentors: () => apiRequest<any[]>('/mentors'),
  getMentorById: (id: string) => apiRequest<any>(`/mentors/${id}`),
  getOwnProfile: () => apiRequest<any>('/mentor/profile'),
  updateOwnProfile: (data: any) =>
    apiRequest<any>('/mentor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateAvailability: (slots: any[]) =>
    apiRequest<any>('/mentor/availability', {
      method: 'PUT',
      body: JSON.stringify(slots),
    }),
  getStats: () => apiRequest<any>('/mentor/stats'),
};

export const adminApi = {
  getPendingMentors: () => apiRequest<any[]>('/admin/mentors/pending'),
  getAllMentors: () => apiRequest<any[]>('/admin/mentors'),
  updateMentorStatus: (id: string, status: 'APPROVED' | 'REJECTED', adminNotes?: string) =>
    apiRequest<any>(`/admin/mentors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    }),
  getPendingMeetings: () => apiRequest<any[]>('/admin/meetings/pending'),
  getAllMeetings: () => apiRequest<any[]>('/admin/meetings'),
  updateMeetingStatus: (id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) =>
    apiRequest<any>(`/admin/meetings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, rejectionReason }),
    }),
  getStats: () => apiRequest<any>('/admin/stats'),
  createOpportunity: (data: any) =>
    apiRequest<any>('/admin/opportunities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOpportunity: (id: string, data: any) =>
    apiRequest<any>(`/admin/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateOpportunityStatus: (id: string, status: string, adminNotes?: string) =>
    apiRequest<any>(`/admin/opportunities/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    }),
  deleteOpportunity: (id: string) =>
    apiRequest<void>(`/admin/opportunities/${id}`, {
      method: 'DELETE',
    }),
};

export const opportunitiesApi = {
  getAll: (params?: { query?: string; type?: string; state?: string; verification?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append('query', params.query);
    if (params?.type && params.type !== 'ALL') searchParams.append('type', params.type);
    if (params?.state && params.state !== 'ALL') searchParams.append('state', params.state);
    if (params?.verification && params.verification !== 'ALL') searchParams.append('verification', params.verification);
    const queryString = searchParams.toString();
    return apiRequest<any[]>(`/opportunities${queryString ? '?' + queryString : ''}`);
  },
  getById: (id: string) => apiRequest<any>(`/opportunities/${id}`),
  getRecommended: () => apiRequest<any[]>('/opportunities/recommended'),
  checkEligibility: (data: any) =>
    apiRequest<any>('/eligibility/check', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSaved: () => apiRequest<any[]>('/saved-opportunities'),
  save: (id: string) =>
    apiRequest<void>(`/saved-opportunities/${id}`, {
      method: 'POST',
    }),
  unsave: (id: string) =>
    apiRequest<void>(`/saved-opportunities/${id}`, {
      method: 'DELETE',
    }),
};

export const providersApi = {
  getAll: () => apiRequest<any[]>('/providers'),
  getById: (id: string) => apiRequest<any>(`/providers/${id}`),
};

export const institutionsApi = {
  getAll: () => apiRequest<any[]>('/institutions'),
};

export const meetingsApi = {
  getApprovedUpcoming: () => apiRequest<any[]>('/meetings'),
  getRegistered: () => apiRequest<any[]>('/meetings/registered'),
  getMentorMeetings: () => apiRequest<any[]>('/meetings/mentor'),
  getById: (id: string) => apiRequest<any>(`/meetings/${id}`),
  create: (data: any) =>
    apiRequest<any>('/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resubmit: (id: string, data: any) =>
    apiRequest<any>(`/meetings/${id}/resubmit`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  register: (id: string) =>
    apiRequest<any>(`/meetings/${id}/register`, {
      method: 'POST',
    }),
  cancelRegistration: (id: string) =>
    apiRequest<any>(`/meetings/${id}/cancel-registration`, {
      method: 'POST',
    }),
  getRoomDetails: (roomCode: string) => apiRequest<any>(`/meetings/room/${roomCode}`),
};

export const counsellingApi = {
  bookSession: (data: { mentorId: string; sessionDate: string; startTime: string; sessionType?: string; notes?: string }) =>
    apiRequest<any>('/counselling/book', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getStudentSessions: () => apiRequest<any[]>('/counselling/student'),
  getMentorSessions: () => apiRequest<any[]>('/counselling/mentor'),
  updateStatus: (id: string, status: string) =>
    apiRequest<any>(`/counselling/${id}/status?status=${status}`, {
      method: 'PUT',
    }),
};

export const chatApi = {
  getConversations: () => apiRequest<any[]>('/chat/conversations'),
  getMessages: (conversationId: string) => apiRequest<any[]>(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (recipientId: string, body: string) =>
    apiRequest<any>('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ recipientId, body }),
    }),
};

export const coursesApi = {
  getAll: () => apiRequest<any[]>('/courses'),
  getById: (id: string) => apiRequest<any>(`/courses/${id}`),
  enroll: (id: string) =>
    apiRequest<any>(`/courses/${id}/enroll`, {
      method: 'POST',
    }),
  updateLessonProgress: (lessonId: string, completed: boolean) =>
    apiRequest<void>(`/courses/lessons/${lessonId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    }),
};

export const futureTalksApi = {
  getAll: () => apiRequest<any[]>('/future-talks'),
  getById: (id: string) => apiRequest<any>(`/future-talks/${id}`),
  register: (id: string) =>
    apiRequest<any>(`/future-talks/${id}/register`, {
      method: 'POST',
    }),
};

export const notificationsApi = {
  getAll: () => apiRequest<any[]>('/notifications'),
  markRead: (id: string) =>
    apiRequest<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
};

export const novaApi = {
  chat: (data: { message: string; conversationId?: string; sessionToken?: string; language?: string }) =>
    apiRequest<any>('/nova/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getConversations: () => apiRequest<any[]>('/nova/conversations'),
  getMessages: (conversationId: string) => apiRequest<any[]>(`/nova/conversations/${conversationId}`),
  deleteConversation: (conversationId: string) =>
    apiRequest<void>(`/nova/conversations/${conversationId}`, {
      method: 'DELETE',
    }),
  saveRoadmap: (data: { title: string; goal: string; roadmapJson: string }) =>
    apiRequest<any>('/nova/roadmaps', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSavedRoadmaps: () => apiRequest<any[]>('/nova/roadmaps'),
};

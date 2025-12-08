import axiosClient from '@/config/axiosClient';
import type { Event, EventFormData, EventListResponse } from '@/types/event.types';

const eventApi = {
  /**
   * Get all events with pagination and filters
   */
  getAll: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    branchId?: string;
  }): Promise<EventListResponse> => {
    const response = await axiosClient.get('/api/events', { params });
    return response.data;
  },

  /**
   * Get event by ID
   */
  getById: async (id: string): Promise<Event> => {
    const response = await axiosClient.get(`/api/events/${id}`);
    return response.data;
  },

  /**
   * Create new event
   */
  create: async (data: EventFormData): Promise<Event> => {
    const response = await axiosClient.post('/api/events', data);
    return response.data;
  },

  /**
   * Update existing event
   */
  update: async (id: string, data: EventFormData): Promise<Event> => {
    const response = await axiosClient.put(`/api/events/${id}`, data);
    return response.data;
  },

  /**
   * Delete event (only SCHEDULED events can be deleted)
   */
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/events/${id}`);
  },

  /**
   * Cancel event
   */
  cancel: async (id: string): Promise<Event> => {
    const response = await axiosClient.put(`/api/events/${id}/cancel`);
    return response.data;
  },

  /**
   * Get active events for a specific branch
   */
  getActiveEventsByBranch: async (branchId: string): Promise<Event[]> => {
    const response = await axiosClient.get(`/api/events/active`, {
      params: { branchId },
    });
    return response.data;
  },
};

export default eventApi;

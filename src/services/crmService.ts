// CRM Service - API Integration
import api from './authService';
import {
  Contact,
  CreateContactData,
  UpdateContactData,
  AddNoteData,
  ContactNote,
  ContactFilters
} from '../types/crm';

export const crmService = {
  /**
   * Get all contacts for a circle with optional filtering
   */
  getContacts: async (
    circleId: number,
    filters?: ContactFilters
  ): Promise<{ count: number; results: Contact[] }> => {
    try {
      const params: Record<string, any> = { circle_id: circleId };
      
      if (filters?.status) params.status = filters.status;
      if (filters?.funnelStage) params.funnel_stage = filters.funnelStage;
      if (filters?.search) params.search = filters.search;

      const response = await api.get(`/crm/contacts/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  /**
   * Get a single contact with full details
   */
  getContact: async (contactId: string): Promise<Contact> => {
    try {
      const response = await api.get(`/crm/contacts/${contactId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  },

  /**
   * Create a new contact
   */
  createContact: async (contactData: CreateContactData): Promise<Contact> => {
    try {
      const payload = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        company: contactData.company || null,
        status: contactData.status,
        funnel_stage: contactData.funnelStage,
        notes: contactData.notes || '',
        circle: contactData.circleId
      };
      
      const response = await api.post(`/crm/contacts/`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  /**
   * Update a contact
   */
  updateContact: async (
    contactId: string,
    contactData: UpdateContactData
  ): Promise<Contact> => {
    try {
      const payload: Record<string, any> = {};
      
      if (contactData.name !== undefined) payload.name = contactData.name;
      if (contactData.email !== undefined) payload.email = contactData.email;
      if (contactData.phone !== undefined) payload.phone = contactData.phone;
      if (contactData.company !== undefined) payload.company = contactData.company;
      if (contactData.status !== undefined) payload.status = contactData.status;
      if (contactData.funnelStage !== undefined) payload.funnel_stage = contactData.funnelStage;
      if (contactData.notes !== undefined) payload.notes = contactData.notes;

      const response = await api.put(`/crm/contacts/${contactId}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  /**
   * Add a note to a contact
   */
  addNote: async (contactId: string, noteData: AddNoteData): Promise<ContactNote> => {
    try {
      const response = await api.post(`/crm/contacts/${contactId}/notes/`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  /**
   * Get all notes for a contact
   */
  getContactNotes: async (contactId: string): Promise<ContactNote[]> => {
    try {
      const response = await api.get(`/crm/contacts/${contactId}/notes/`);
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching contact notes:', error);
      throw error;
    }
  },

  /**
   * Delete a contact
   */
  deleteContact: async (contactId: string): Promise<void> => {
    try {
      await api.delete(`/crm/contacts/${contactId}/`);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
};

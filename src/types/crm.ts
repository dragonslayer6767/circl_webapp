// CRM Type Definitions

export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'partner';
export type FunnelStage = 
  | 'needs_outreach' 
  | 'contacted' 
  | 'meeting_set' 
  | 'proposal_sent' 
  | 'negotiation' 
  | 'blocked' 
  | 'closed_won' 
  | 'closed_lost';

export interface ContactNote {
  id: string;
  note: string;
  createdAt: string;
  createdBy?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: ContactStatus;
  funnelStage: FunnelStage;
  notes: string;
  notesHistory?: ContactNote[];
  lastContact: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  circleId?: number;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: ContactStatus;
  funnelStage: FunnelStage;
  notes?: string;
  circleId: number;
}

export interface UpdateContactData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: ContactStatus;
  funnelStage?: FunnelStage;
  notes?: string;
}

export interface AddNoteData {
  note: string;
}

export interface ContactFilters {
  status?: ContactStatus;
  funnelStage?: FunnelStage;
  search?: string;
}

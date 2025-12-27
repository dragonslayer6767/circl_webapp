import { useState } from 'react';
import { COLORS } from '../../../utils/colors';
import CreateContactModal, { ContactFormData } from './CreateContactModal';
import ContactDetailModal from './ContactDetailModal';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: 'lead' | 'prospect' | 'customer' | 'partner';
  funnelStage: 'needs_outreach' | 'contacted' | 'meeting_set' | 'proposal_sent' | 'negotiation' | 'blocked' | 'closed_won' | 'closed_lost';
  lastContact: Date;
  notes: string;
  notesHistory?: { date: Date; note: string }[];
}

interface CRMManagerProps {
  circleId: number;
  isModerator: boolean;
}

type FilterStatus = 'all' | 'lead' | 'prospect' | 'customer' | 'partner';
type ViewMode = 'list' | 'funnel';

const FUNNEL_STAGES = [
  { id: 'needs_outreach', label: 'Needs Outreach', color: '#EF4444' },
  { id: 'contacted', label: 'Contacted', color: '#F59E0B' },
  { id: 'meeting_set', label: 'Meeting Set', color: '#3B82F6' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: '#8B5CF6' },
  { id: 'negotiation', label: 'Negotiation', color: '#EC4899' },
  { id: 'blocked', label: 'Blocked', color: '#DC2626' },
  { id: 'closed_won', label: 'Closed Won', color: '#10B981' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#6B7280' }
] as const;

export default function CRMManager({ circleId: _circleId, isModerator }: CRMManagerProps) {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'contact-1',
      name: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      company: 'TechCorp Inc.',
      phone: '+1 (555) 123-4567',
      status: 'customer',
      funnelStage: 'closed_won',
      lastContact: new Date('2025-12-20'),
      notes: 'Interested in premium package',
      notesHistory: [
        { date: new Date('2025-12-15'), note: 'Initial contact made, very interested' },
        { date: new Date('2025-12-18'), note: 'Sent pricing information' }
      ]
    },
    {
      id: 'contact-2',
      name: 'Michael Chen',
      email: 'mchen@startup.io',
      company: 'Startup.io',
      phone: '+1 (555) 987-6543',
      status: 'prospect',
      funnelStage: 'meeting_set',
      lastContact: new Date('2025-12-22'),
      notes: 'Follow up next week'
    },
    {
      id: 'contact-3',
      name: 'Emma Wilson',
      email: 'emma.w@design.co',
      company: 'Design Co.',
      status: 'lead',
      funnelStage: 'needs_outreach',
      lastContact: new Date('2025-12-18'),
      notes: 'Met at networking event'
    },
    {
      id: 'contact-4',
      name: 'David Brown',
      email: 'dbrown@partners.com',
      company: 'Partners LLC',
      phone: '+1 (555) 456-7890',
      status: 'partner',
      funnelStage: 'negotiation',
      lastContact: new Date('2025-12-25'),
      notes: 'Strategic partnership discussion'
    },
    {
      id: 'contact-5',
      name: 'Lisa Anderson',
      email: 'landerson@corp.com',
      company: 'Corp Solutions',
      phone: '+1 (555) 234-5678',
      status: 'prospect',
      funnelStage: 'contacted',
      lastContact: new Date('2025-12-23'),
      notes: 'Initial call went well'
    },
    {
      id: 'contact-6',
      name: 'James Miller',
      email: 'jmiller@venture.io',
      company: 'Venture Capital',
      status: 'lead',
      funnelStage: 'proposal_sent',
      lastContact: new Date('2025-12-24'),
      notes: 'Awaiting feedback on proposal'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      lead: '#F59E0B',
      prospect: '#3B82F6',
      customer: '#10B981',
      partner: '#8B5CF6'
    };
    return colors[status] || COLORS.primary;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lead':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        );
      case 'prospect':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        );
      case 'customer':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'partner':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getContactStatusCount = (status: FilterStatus) => {
    if (status === 'all') return contacts.length;
    return contacts.filter(c => c.status === status).length;
  };

  const moveContactToStage = (contactId: string, newStage: Contact['funnelStage']) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId
        ? { ...contact, funnelStage: newStage, lastContact: new Date() }
        : contact
    ));
  };

  const getContactsByStage = (stage: Contact['funnelStage']) => {
    return filteredContacts.filter(contact => contact.funnelStage === stage);
  };

  const handleCreateContact = (contactData: ContactFormData) => {
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      ...contactData,
      lastContact: new Date()
    };
    setContacts(prev => [...prev, newContact]);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleAddNote = (contactId: string, note: string) => {
    setContacts(prev => prev.map(contact => {
      if (contact.id === contactId) {
        const noteEntry = { date: new Date(), note };
        return {
          ...contact,
          notes: note, // Update current note
          notesHistory: [...(contact.notesHistory || []), noteEntry],
          lastContact: new Date()
        };
      }
      return contact;
    }));
    
    // Update selected contact to reflect changes
    setSelectedContact(prev => {
      if (prev && prev.id === contactId) {
        const noteEntry = { date: new Date(), note };
        return {
          ...prev,
          notes: note,
          notesHistory: [...(prev.notesHistory || []), noteEntry],
          lastContact: new Date()
        };
      }
      return prev;
    });
  };

  const handleUpdateContact = (contactId: string, updatedFields: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => {
      if (contact.id === contactId) {
        return { ...contact, ...updatedFields };
      }
      return contact;
    }));
    
    // Update selected contact to reflect changes
    setSelectedContact(prev => {
      if (prev && prev.id === contactId) {
        return { ...prev, ...updatedFields };
      }
      return prev;
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">CRM - Contact Management</h3>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('funnel')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'funnel' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Funnel
            </button>
          </div>
          
          {isModerator && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: COLORS.primary }}
              title="Add contact"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'lead', 'prospect', 'customer', 'partner'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: filterStatus === status ? getStatusColor(status === 'all' ? 'lead' : status) : undefined
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({getContactStatusCount(status)})
            </button>
          ))}
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <p className="text-sm">No contacts found</p>
          </div>
        ) : viewMode === 'list' ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => handleContactClick(contact)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{contact.name}</h4>
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getStatusColor(contact.status) }}
                    >
                      {getStatusIcon(contact.status)}
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{contact.email}</span>
                    </div>
                    
                    {contact.company && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        <span>{contact.company}</span>
                      </div>
                    )}
                    
                    {contact.phone && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {contact.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">{contact.notes}</p>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 ml-2">
                  {new Date(contact.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          ))
        ) : null}
      </div>

      {/* Funnel View */}
      {viewMode === 'funnel' && filteredContacts.length > 0 && (
        <div className="mt-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {FUNNEL_STAGES.map((stage) => {
              const stageContacts = getContactsByStage(stage.id as Contact['funnelStage']);
              return (
                <div key={stage.id} className="flex-shrink-0 w-64">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <h4 className="text-sm font-semibold text-gray-900">{stage.label}</h4>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {stageContacts.length}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 min-h-[200px] max-h-96 overflow-y-auto space-y-2">
                    {stageContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleContactClick(contact)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h5 className="text-sm font-semibold text-gray-900 truncate flex-1">
                            {contact.name}
                          </h5>
                          <span
                            className="flex-shrink-0 w-2 h-2 rounded-full ml-1 mt-1"
                            style={{ backgroundColor: getStatusColor(contact.status) }}
                            title={contact.status}
                          />
                        </div>
                        
                        {contact.company && (
                          <p className="text-xs text-gray-600 mb-1 truncate">{contact.company}</p>
                        )}
                        
                        <p className="text-xs text-gray-500 truncate mb-2">{contact.email}</p>
                        
                        {/* Move to stage dropdown */}
                        <select
                          value={contact.funnelStage}
                          onChange={(e) => moveContactToStage(contact.id, e.target.value as Contact['funnelStage'])}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {FUNNEL_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move to {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                    {stageContacts.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs">No contacts</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <CreateContactModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateContact}
      />

      <ContactDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        contact={selectedContact}
        onAddNote={handleAddNote}
        onUpdateContact={handleUpdateContact}
      />
    </div>
  );
}

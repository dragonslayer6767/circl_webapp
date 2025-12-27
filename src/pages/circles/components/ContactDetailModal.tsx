import { useState } from 'react';
import { COLORS } from '../../../utils/colors';

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

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onAddNote?: (contactId: string, note: string) => void;
  onUpdateContact?: (contactId: string, updates: Partial<Contact>) => void;
}

export default function ContactDetailModal({ isOpen, onClose, contact, onAddNote, onUpdateContact }: ContactDetailModalProps) {
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);

  // Update editedContact when contact changes
  useState(() => {
    if (contact) {
      setEditedContact(contact);
    }
  });

  if (!isOpen || !contact) return null;

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      lead: '#F59E0B',
      prospect: '#3B82F6',
      customer: '#10B981',
      partner: '#8B5CF6'
    };
    return colors[status] || COLORS.primary;
  };

  const getFunnelStageLabel = (stage: string) => {
    const labels: { [key: string]: string } = {
      needs_outreach: 'Needs Outreach',
      contacted: 'Contacted',
      meeting_set: 'Meeting Set',
      proposal_sent: 'Proposal Sent',
      negotiation: 'Negotiation',
      blocked: 'Blocked',
      closed_won: 'Closed Won',
      closed_lost: 'Closed Lost'
    };
    return labels[stage] || stage;
  };

  const getFunnelStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      needs_outreach: '#EF4444',
      contacted: '#F59E0B',
      meeting_set: '#3B82F6',
      proposal_sent: '#8B5CF6',
      negotiation: '#EC4899',
      blocked: '#DC2626',
      closed_won: '#10B981',
      closed_lost: '#6B7280'
    };
    return colors[stage] || '#6B7280';
  };

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(contact.id, newNote.trim());
      setNewNote('');
    }
  };

  const handleSaveEdit = () => {
    if (editedContact && onUpdateContact) {
      onUpdateContact(contact.id, {
        name: editedContact.name,
        email: editedContact.email,
        company: editedContact.company,
        phone: editedContact.phone,
        status: editedContact.status,
        funnelStage: editedContact.funnelStage
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContact(contact);
    setIsEditing(false);
  };

  const displayContact = isEditing && editedContact ? editedContact : contact;

  const allNotes = contact.notesHistory || [];
  if (contact.notes) {
    allNotes.unshift({ date: contact.lastContact, note: contact.notes });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className={`bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          showAllNotes ? 'w-full max-w-4xl' : 'w-full max-w-lg'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getStatusColor(displayContact.status) }}
                >
                  {displayContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedContact?.name || ''}
                      onChange={(e) => setEditedContact(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="text-xl font-bold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-gray-900">{displayContact.name}</h2>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {isEditing ? (
                      <>
                        <select
                          value={editedContact?.status || 'lead'}
                          onChange={(e) => setEditedContact(prev => prev ? { ...prev, status: e.target.value as Contact['status'] } : null)}
                          className="px-2 py-0.5 rounded-full text-xs font-medium text-white border-0 focus:ring-2 focus:ring-blue-500"
                          style={{ backgroundColor: getStatusColor(editedContact?.status || 'lead') }}
                        >
                          <option value="lead">Lead</option>
                          <option value="prospect">Prospect</option>
                          <option value="customer">Customer</option>
                          <option value="partner">Partner</option>
                        </select>
                        <select
                          value={editedContact?.funnelStage || 'needs_outreach'}
                          onChange={(e) => setEditedContact(prev => prev ? { ...prev, funnelStage: e.target.value as Contact['funnelStage'] } : null)}
                          className="px-2 py-0.5 rounded-full text-xs font-medium text-white border-0 focus:ring-2 focus:ring-blue-500"
                          style={{ backgroundColor: getFunnelStageColor(editedContact?.funnelStage || 'needs_outreach') }}
                        >
                          <option value="needs_outreach">Needs Outreach</option>
                          <option value="contacted">Contacted</option>
                          <option value="meeting_set">Meeting Set</option>
                          <option value="proposal_sent">Proposal Sent</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="blocked">Blocked</option>
                          <option value="closed_won">Closed Won</option>
                          <option value="closed_lost">Closed Lost</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getStatusColor(displayContact.status) }}
                        >
                          {displayContact.status.charAt(0).toUpperCase() + displayContact.status.slice(1)}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getFunnelStageColor(displayContact.funnelStage) }}
                        >
                          {getFunnelStageLabel(displayContact.funnelStage)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contact Information */}
          <div className={`${showAllNotes ? 'grid grid-cols-2 gap-6' : ''}`}>
            <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedContact?.email || ''}
                        onChange={(e) => setEditedContact(prev => prev ? { ...prev, email: e.target.value } : null)}
                        className="text-sm text-blue-600 border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <a href={`mailto:${displayContact.email}`} className="text-sm text-blue-600 hover:underline">
                        {displayContact.email}
                      </a>
                    )}
                  </div>
                </div>

                {(displayContact.phone || isEditing) && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedContact?.phone || ''}
                          onChange={(e) => setEditedContact(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          placeholder="+1 (555) 123-4567"
                          className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <a href={`tel:${displayContact.phone}`} className="text-sm text-gray-900">
                          {displayContact.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {(displayContact.company || isEditing) && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedContact?.company || ''}
                          onChange={(e) => setEditedContact(prev => prev ? { ...prev, company: e.target.value } : null)}
                          placeholder="Company name"
                          className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{displayContact.company}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Last Contact</p>
                    <p className="text-sm text-gray-900">
                      {new Date(contact.lastContact).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Notes</h3>
                {!showAllNotes && allNotes.length > 0 && (
                  <button
                    onClick={() => setShowAllNotes(true)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 underline"
                  >
                    See All Notes ({allNotes.length})
                  </button>
                )}
              </div>
              
              {contact.notes && !showAllNotes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              )}

              {/* Add Note Input */}
              <div className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>

            {/* All Notes Panel - Shows when expanded */}
            {showAllNotes && (
              <div className="border-l border-gray-200 pl-6 space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">All Notes History</h3>
                  <button
                    onClick={() => setShowAllNotes(false)}
                    className="text-xs font-medium text-gray-600 hover:text-gray-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allNotes.length > 0 ? (
                    allNotes.map((noteEntry, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">
                            {new Date(noteEntry.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{noteEntry.note}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">No notes yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Edit Contact
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

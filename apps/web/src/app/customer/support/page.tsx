import React, { useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { mockDb } from '@lootupspace/database';
import { TicketPriority, TicketStatus, UserRole } from '@lootupspace/shared';
import { formatDate } from '../../../lib/utils';
import { MessageSquare, Plus, Send, Phone, X } from 'lucide-react';

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(mockDb.tickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(mockDb.tickets[0] || null);
  const [replyText, setReplyText] = useState('');
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Booking & Pickup');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [message, setMessage] = useState('');

  const modalRef = useRef<HTMLDialogElement>(null);
  const formId = useId();
  const replyInputId = `${formId}-reply`;
  const modalHeadingId = `${formId}-modal-heading`;
  const subjectInputId = `${formId}-subject`;
  const categorySelectId = `${formId}-category`;
  const prioritySelectId = `${formId}-priority`;
  const messageTextareaId = `${formId}-message`;

  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    if (newTicketModalOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [newTicketModalOpen]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || 'user_cust_001',
      senderName: user?.name || 'Customer',
      senderRole: UserRole.CUSTOMER,
      message: replyText,
      createdAt: new Date().toISOString()
    };

    selectedTicket.messages.push(newMsg);
    setSelectedTicket({ ...selectedTicket, messages: [...selectedTicket.messages] });
    setTickets([...mockDb.tickets]);
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTkt = {
      id: `tkt_${Date.now()}`,
      ticketNumber,
      userId: user?.id || 'user_cust_001',
      userName: user?.name || 'Customer',
      subject,
      category,
      priority,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: user?.id || 'user_cust_001',
          senderName: user?.name || 'Customer',
          senderRole: UserRole.CUSTOMER,
          message,
          createdAt: new Date().toISOString()
        }
      ]
    };

    mockDb.tickets.unshift(newTkt);
    setTickets([...mockDb.tickets]);
    setSelectedTicket(newTkt);
    setNewTicketModalOpen(false);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-lootup-600">Help &amp; Resolution</span>
          <h1 id="main-content" tabIndex={-1} className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-0.5 text-balance">
            Customer Support &amp; Grievance
          </h1>
          <p className="text-xs text-slate-500 text-pretty">
            Dedicated SLA assistance for pickups, delivery adjustments, and warehouse vault access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/919876543210?text=Hi%20Lootupspace%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors duration-150"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>WhatsApp Live Chat</span>
          </a>

          <button
            type="button"
            onClick={() => setNewTicketModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors duration-150"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Raise Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tickets List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
          <h2 className="text-xs font-bold text-slate-600 px-2 block">
            Your Support Threads ({tickets.length})
          </h2>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedTicket(t)}
                  className={`w-full text-left cursor-pointer p-3.5 rounded-2xl border transition-colors duration-150 ${
                    isSelected ? 'border-lootup-600 bg-lootup-50/60 shadow-sm' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-600">{t.ticketNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-lootup-100 text-lootup-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs mt-1 truncate">{t.subject}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                    <span>{t.category}</span>
                    <span>{formatDate(t.createdAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Ticket Conversation Thread */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-lootup-600">{selectedTicket.ticketNumber}</span>
                    <h2 className="font-semibold text-slate-900 text-base">{selectedTicket.subject}</h2>
                    <span className="text-xs text-slate-500">{selectedTicket.category} • Priority: {selectedTicket.priority}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {selectedTicket.status}
                  </span>
                </div>

                {/* Messages stream */}
                <div className="space-y-3 py-4 max-h-80 overflow-y-auto pr-1">
                  {selectedTicket.messages.map((msg: any) => {
                    const isStaff = msg.senderRole === UserRole.ADMIN || msg.senderRole === UserRole.WAREHOUSE;
                    return (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl text-xs space-y-1 max-w-[85%] ${
                          isStaff
                            ? 'bg-slate-100 text-slate-800 mr-auto border border-slate-200'
                            : 'bg-lootup-600 text-white ml-auto shadow-sm'
                        }`}
                      >
                        <div className={`text-[10px] font-bold ${isStaff ? 'text-lootup-700' : 'text-lootup-200'}`}>
                          {msg.senderName}
                        </div>
                        <p className="leading-relaxed text-pretty">{msg.message}</p>
                        <div className={`text-[9px] text-right ${isStaff ? 'text-slate-500' : 'text-lootup-200'}`}>
                          {formatDate(msg.createdAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex gap-2">
                <label htmlFor={replyInputId} className="visually-hidden">
                  Reply to support ticket
                </label>
                <input
                  id={replyInputId}
                  type="text"
                  placeholder="Type your response to the support team..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors duration-150 flex items-center gap-1 shadow"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" aria-hidden="true" />
              <p className="text-xs">Select a ticket on the left to view the thread</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Native Dialog */}
      <dialog
        ref={modalRef}
        className="modal-dialog max-w-lg"
        aria-labelledby={modalHeadingId}
        onCancel={(e) => {
          e.preventDefault();
          setNewTicketModalOpen(false);
        }}
        onClose={() => {
          if (newTicketModalOpen) setNewTicketModalOpen(false);
        }}
        onClick={(e) => {
          if (e.target === modalRef.current) setNewTicketModalOpen(false);
        }}
        {...({ closedby: 'any' } as any)}
      >
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 mx-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 id={modalHeadingId} className="font-semibold text-slate-900 text-base">Raise a Support Ticket</h2>
            <button
              type="button"
              aria-label="Close new ticket modal"
              onClick={() => setNewTicketModalOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-900 rounded"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div>
              <label htmlFor={subjectInputId} className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                id={subjectInputId}
                required
                type="text"
                placeholder="e.g. Need to add extra carton to tomorrow pickup"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={categorySelectId} className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  id={categorySelectId}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
                >
                  <option value="Booking & Pickup">Booking &amp; Pickup</option>
                  <option value="Digital Inventory">Digital Inventory</option>
                  <option value="Return Delivery">Return Delivery</option>
                  <option value="Billing & Invoices">Billing &amp; Invoices</option>
                </select>
              </div>

              <div>
                <label htmlFor={prioritySelectId} className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  id={prioritySelectId}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
                >
                  <option value={TicketPriority.LOW}>Low</option>
                  <option value={TicketPriority.MEDIUM}>Medium</option>
                  <option value={TicketPriority.HIGH}>High</option>
                  <option value={TicketPriority.URGENT}>Urgent (Same Day)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor={messageTextareaId} className="block font-semibold text-slate-700 mb-1">Message Description</label>
              <textarea
                id={messageTextareaId}
                required
                rows={4}
                placeholder="Describe your issue or request in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-lootup-500 focus:outline-2 focus:outline-transparent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewTicketModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow transition-colors duration-150"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}


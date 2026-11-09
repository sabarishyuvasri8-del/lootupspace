import { mockDb } from '@lootupspace/database';
import { TicketPriority, TicketStatus, UserRole } from '@lootupspace/shared';

export class TicketsService {
  static async createTicket(userId: string, input: any): Promise<any> {
    const user = mockDb.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const ticketId = `tkt_${Date.now()}`;
    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: ticketId,
      ticketNumber,
      userId,
      userName: user.name || 'Valued Customer',
      subject: input.subject,
      category: input.category || 'General Storage Inquiry',
      priority: input.priority || TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: userId,
          senderName: user.name || 'Customer',
          senderRole: user.role,
          message: input.message,
          createdAt: new Date().toISOString()
        }
      ]
    };

    mockDb.tickets.unshift(newTicket);
    return newTicket;
  }

  static async getTickets(userId?: string): Promise<any[]> {
    if (userId) {
      return mockDb.tickets.filter(t => t.userId === userId);
    }
    return mockDb.tickets;
  }

  static async getTicketById(ticketId: string): Promise<any> {
    const ticket = mockDb.tickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
    if (!ticket) throw new Error('Support ticket not found');
    return ticket;
  }

  static async addMessage(ticketId: string, senderId: string, message: string): Promise<any> {
    const ticket = await this.getTicketById(ticketId);
    const sender = mockDb.users.find(u => u.id === senderId);

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName: sender?.name || 'Support Agent',
      senderRole: sender?.role || UserRole.ADMIN,
      message,
      createdAt: new Date().toISOString()
    };

    ticket.messages.push(newMessage);
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }
}


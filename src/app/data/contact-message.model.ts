export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export type NewContactMessage = Pick<ContactMessage, 'name' | 'email' | 'subject' | 'message'>;

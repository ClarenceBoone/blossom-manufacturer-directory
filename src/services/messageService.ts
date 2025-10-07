import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientEmail: string;
  subject: string;
  content: string;
  attachments: string[];
  timestamp: Date;
}

export const logMessage = async (message: Omit<ChatMessage, 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...message,
      timestamp: serverTimestamp()
    });

    console.log('✅ Message logged to Firebase with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error logging message to Firebase:', error);
    throw error;
  }
};

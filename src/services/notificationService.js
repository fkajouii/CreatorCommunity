import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

/**
 * Sends a notification to a creator or admin.
 * In a real app, this would trigger a Firebase Extension (like "Trigger Email from Firestore")
 * or a Cloud Function to send an email via SendGrid/Mailgun.
 */
export const sendNotification = async (recipientId, type, data) => {
  try {
    const notification = {
      recipientId,
      type,
      data,
      status: 'pending',
      createdAt: Timestamp.now()
    };
    
    // Adding to a 'mail' collection for the "Trigger Email" extension
    await addDoc(collection(db, 'mail'), {
      to: data.email,
      message: {
        subject: getSubject(type),
        text: getText(type, data),
        html: getHtml(type, data)
      },
      metadata: {
        type,
        recipientId
      }
    });
    
    console.log(`Notification of type ${type} queued for ${data.email}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const getSubject = (type) => {
  switch (type) {
    case 'AGREEMENT_SIGNED': return 'Welcome to Pok Pok Community! 🎉';
    case 'PAYOUT_ISSUED': return 'Your Payout is on the Way! 💰';
    case 'VIDEO_APPROVED': return 'Your Video was Approved! ✅';
    default: return 'Notification from Pok Pok';
  }
};

const getText = (type, data) => {
  switch (type) {
    case 'AGREEMENT_SIGNED': return `Hi ${data.name}, thank you for joining our community!`;
    case 'PAYOUT_ISSUED': return `Hi ${data.name}, we just issued a payout of $${data.amount}.`;
    default: return 'You have a new message from Pok Pok.';
  }
};

const getHtml = (type, data) => {
  return `<div><p>${getText(type, data)}</p></div>`; // Simple wrapper
};

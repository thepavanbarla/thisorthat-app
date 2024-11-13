import firestore from '@react-native-firebase/app';

class FirebaseMessagingService {
  messageRef = firestore().collection('messages');

  async fetchMessages() {
    const messages = await this.messageRef
      .orderBy('created_at', 'desc')
      .limit(10)
      .get();
    return messages.docs;
  }

  async createMessage(message, uid) {
    await this.messageRef.add({
      message: message,
      user_id: uid,
      created_at: new Date(),
    });
  }
}

const firebaseMessagingService = new FirebaseMessagingService();
export {firebaseMessagingService};

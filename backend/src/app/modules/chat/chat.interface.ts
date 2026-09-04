export interface IStartConversation {
  otherProfileId: string;
}

export interface INotifyMessage {
  conversationId: string;
  otherProfileId: string;
  text: string;
}

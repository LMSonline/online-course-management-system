import { chatbotAxios } from "@/lib/api/chatbotAxios";
import { ChatSendRequest, ChatSendResponse } from "./chatbot.types";

const CHATBOT_PREFIX = "/api/v1/chat";

export const chatbotService = {
  /**
   * Send a message to the chatbot
   */
  sendMessage: async (payload: ChatSendRequest): Promise<ChatSendResponse> => {
    const response = await chatbotAxios.post<ChatSendResponse>(
      `${CHATBOT_PREFIX}/messages`,
      payload
    );

    return response.data;
  },
};


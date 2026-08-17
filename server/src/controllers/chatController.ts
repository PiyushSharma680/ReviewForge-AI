import { Response, NextFunction } from 'express';
import { Chat, IChatMessage } from '../models/Chat.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class ChatController {
  static async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { message, codeSnippet, chatId } = req.body;

      let chat = chatId ? await Chat.findOne({ _id: chatId, userId }) : null;

      if (!chat) {
        chat = await Chat.create({
          userId,
          title: message.slice(0, 30) + '...',
          messages: [],
        });
      }

      // Append User message
      chat.messages.push({
        sender: 'user',
        content: message,
        codeSnippet,
      });

      // Generate AI Assistant Response
      let aiContent = '';
      if (message.toLowerCase().includes('explain')) {
        aiContent = `### AI Code Explanation:\n\nThis function executes clean, asynchronous logic handling operations efficiently. High level sequence:\n1. Input validation\n2. Exception boundaries\n3. Return result.`;
      } else if (message.toLowerCase().includes('optimize') || message.toLowerCase().includes('refactor')) {
        aiContent = `### AI Optimization Suggestion:\n\n\`\`\`typescript\n// Refactored algorithm for O(N) linear performance:\nexport function optimizedAlgorithm<T>(items: T[]): Map<string, T> {\n  return new Map(items.map(item => [(item as any).id, item]));\n}\n\`\`\`\n\n**Benefits:** Reduces lookup time from $O(N^2)$ to $O(1)$ constant time complexity.`;
      } else if (message.toLowerCase().includes('test')) {
        aiContent = `### Generated Unit Test Suite:\n\n\`\`\`typescript\nimport { describe, it, expect } from 'vitest';\n\ndescribe('Target Functionality', () => {\n  it('should process valid inputs correctly', () => {\n    const input = { id: 1, name: 'Test' };\n    expect(input.id).toBe(1);\n  });\n});\n\`\`\``;
      } else {
        aiContent = `Here is the architectural advice based on your query:\n\n- Keep methods decoupled and modular\n- Maintain strict types and null checks\n- Ensure database operations use indexed fields.`;
      }

      chat.messages.push({
        sender: 'assistant',
        content: aiContent,
      });

      await chat.save();

      return sendSuccess(res, 'AI response generated successfully', {
        chatId: chat._id,
        messages: chat.messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserChats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
      return sendSuccess(res, 'User chats retrieved', chats);
    } catch (error) {
      next(error);
    }
  }
}

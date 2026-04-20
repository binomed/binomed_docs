import { ChatComponent } from './chat-component.js';

export class ChatController {
    /**
     * @type {Map<string, ChatComponent>}
     */
    #chatInstances = new Map();

    constructor() {
        this.#setupChatComponents();
    }

    /**
     * Find all chat components on the page and register them
     */
    #setupChatComponents() {
        const chats = document.querySelectorAll('chat-component');
        chats.forEach(chat => {
            const dataId = chat.getAttribute('data-id');
            if (dataId) {
                this.#chatInstances.set(dataId, chat);
            }
        });
    }

    /**
     * Get a chat component by its data-id
     * @param {string} dataId - The data-id attribute of the chat component
     * @returns {ChatComponent|null}
     */
    getChat(dataId) {
        const chat = this.#chatInstances.get(dataId);
        if (!chat) {
            log(`Chat component with id "${dataId}" not found`, 'error');
            return null;
        }
        return chat;
    }

    /**
     * Add a user message to a specific chat
     * @param {string} dataId - The data-id of the chat component
     * @param {string} text - The message text
     */
    addUserMessage(dataId, text) {
        const chat = this.getChat(dataId);
        if (chat) {
            chat.addUserMessage(text);
        }
    }

    /**
     * Add a complete assistant message to a specific chat
     * @param {string} dataId - The data-id of the chat component
     * @param {string} text - The message text
     */
    addAssistantMessage(dataId, text) {
        const chat = this.getChat(dataId);
        if (chat) {
            chat.addMessage(text, 'assistant');
        }
    }

    /**
     * Start streaming a message (for progressive text updates)
     * @param {string} dataId - The data-id of the chat component
     * @param {string} id - Optional: unique id for this stream message
     * @returns {string} The message id for use with appendToStream and finishStream
     */
    startStream(dataId, id = null) {
        const chat = this.getChat(dataId);
        if (chat) {
            return chat.startStreamingMessage(id);
        }
        return null;
    }

    /**
     * Append text chunk to a streaming message
     * @param {string} dataId - The data-id of the chat component
     * @param {string} messageId - The id returned from startStream
     * @param {string} chunk - The text chunk to append
     */
    appendToStream(dataId, messageId, chunk) {
        const chat = this.getChat(dataId);
        if (chat) {
            chat.appendToStreamingMessage(messageId, chunk);
        }
    }

    /**
     * Finish streaming a message (will emit 'stream-complete' event)
     * @param {string} dataId - The data-id of the chat component
     * @param {string} messageId - The id from startStream
     */
    finishStream(dataId, messageId) {
        const chat = this.getChat(dataId);
        if (chat) {
            chat.finishStreamingMessage(messageId);
        }
    }

    /**
     * Clear all messages from a chat
     * @param {string} dataId - The data-id of the chat component
     */
    clearChat(dataId) {
        const chat = this.getChat(dataId);
        if (chat) {
            chat.clearMessages();
        }
    }

    /**
     * Listen for user messages from a specific chat
     * @param {string} dataId - The data-id of the chat component
     * @param {Function} callback - Called with {text: string} when user sends a message
     * @returns {Function} Unsubscribe function
     */
    onUserMessage(dataId, callback) {
        const chat = this.getChat(dataId);
        if (chat) {
            const handler = (event) => {
                callback(event.detail?.text);
            };
            chat.addEventListener('user-message', handler);

            // Return unsubscribe function
            return () => {
                chat.removeEventListener('user-message', handler);
            };
        }
        return () => {};
    }

    /**
     * Listen for stream completion events from a specific chat
     * @param {string} dataId - The data-id of the chat component
     * @param {Function} callback - Called with {messageId: string} when stream completes
     * @returns {Function} Unsubscribe function
     */
    onStreamComplete(dataId, callback) {
        const chat = this.getChat(dataId);
        if (chat) {
            const handler = (event) => {
                callback(event.detail);
            };
            chat.addEventListener('stream-complete', handler);

            // Return unsubscribe function
            return () => {
                chat.removeEventListener('stream-complete', handler);
            };
        }
        return () => {};
    }

    /**
     * Re-scan the DOM for new chat components (useful if components are added dynamically)
     */
    refreshChatInstances() {
        this.#setupChatComponents();
    }

    /**
     * Set the active chat component on the PromptControler
     * @param {string} dataId - The data-id of the active chat
     * @param {PromptControler} promptControler - The PromptControler instance
     */
    setActiveChat(dataId, promptControler) {
        const chat = this.getChat(dataId);
        if (chat && promptControler) {
            promptControler.setActiveChatComponent(chat);
        }
    }
}

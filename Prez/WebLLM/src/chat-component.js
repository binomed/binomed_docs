import { LitElement, html, css } from 'lit';

export class ChatComponent extends LitElement {
    static properties = {
        messages: { type: Array },
        dataId: { type: String, attribute: 'data-id' },
        isStreaming: { type: Boolean },
        contextRemaining: { type: Number },
        contextTotal: { type: Number }
    };

    static styles = css`
        :host {
            flex-grow:1;
            --chat-primary: #a855f7;
            --chat-secondary: #22c55e;
            --chat-bg: #0b0f1a;
            --chat-text: #f8fafc;
            --chat-border: rgba(255, 255, 255, 0.1);
            --chat-radius: 12px;
        }

        .chat-container {
            width: 100%;
            height: 600px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(168, 85, 247, 0.05) 100%);
            border: 1px solid var(--chat-border);
            border-radius: var(--chat-radius);
            display: flex;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            color: var(--chat-text);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .context-header {
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid var(--chat-border);
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .context-label {
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .context-bar-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .context-bar {
            flex: 1;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
        }

        .context-bar-fill {
            height: 100%;
            background: #3b82f6;
            transition: width 0.3s ease;
        }

        .context-tokens {
            font-size: 12px;
            font-weight: 700;
            color: white;
            white-space: nowrap;
            min-width: 60px;
            text-align: right;
        }

        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 2rem;
        }

        .message {
            display: flex;
            animation: slideIn 0.3s ease-out;
        }

        .message.user {
            justify-content: flex-end;
        }

        .message.assistant {
            justify-content: flex-start;
        }

        .message-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 8px;
            word-wrap: break-word;
            white-space: pre-wrap;
        }

        .message.user .message-bubble {
            background: var(--chat-primary);
            color: white;
            border-left: 3px solid var(--chat-primary);
        }

        .message.assistant .message-bubble {
            background: rgba(168, 85, 247, 0.1);
            border: 1px solid var(--chat-primary);
            border-left: 3px solid var(--chat-primary);
        }

        .message.streaming .message-bubble::after {
            content: '▌';
            animation: blink 0.8s infinite;
        }

        @keyframes blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .input-container {
            border-top: 1px solid var(--chat-border);
            padding: 12px;
            display: flex;
            gap: 8px;
        }

        .input-field {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--chat-border);
            border-radius: 6px;
            padding: 10px 12px;
            color: var(--chat-text);
            font-family: 'Inter', sans-serif;
            font-size: 14px;
        }

        .input-field::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .input-field:focus {
            outline: none;
            border-color: var(--chat-primary);
            box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
        }

        .send-btn {
            background: linear-gradient(135deg, var(--chat-primary), #c084fc);
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            padding: 10px 16px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .send-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }

        .send-btn:active {
            transform: translateY(0);
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar {
            width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb {
            background: var(--chat-primary);
            border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
            background: #c084fc;
        }
    `;

    constructor() {
        super();
        this.messages = [];
        this.dataId = '';
        this.isStreaming = false;
        this.contextRemaining = 0;
        this.contextTotal = 0;
    }

    render() {
        const contextPercentage = this.contextTotal > 0 ? Math.min((this.contextRemaining / this.contextTotal) * 100, 100) : 0;
        const remaining = isNaN(this.contextRemaining) || this.contextRemaining === undefined ? '?' : this.contextRemaining;
        const total = isNaN(this.contextTotal) || this.contextTotal === undefined ? '?' : this.contextTotal;

        return html`
            <div class="chat-container">
                <div class="context-header">
                    <div class="context-label">Context</div>
                    <div class="context-bar-container">
                        <div class="context-bar">
                            <div class="context-bar-fill" style="width: ${contextPercentage}%"></div>
                        </div>
                        <div class="context-tokens">
                            ${remaining} / ${total}
                        </div>
                    </div>
                </div>
                <div class="messages-container">
                    ${this.messages.map((msg, idx) => html`
                        <div class="message ${msg.role} ${msg.streaming ? 'streaming' : ''}">
                            <div class="message-bubble">${msg.content}</div>
                        </div>
                    `)}
                </div>
                <div class="input-container">
                    <input
                        type="text"
                        class="input-field"
                        placeholder="Type your message..."
                        @keydown=${(e) => e.stopPropagation()}
                        @keyup=${(e) => e.stopPropagation()}
                        @keypress=${this.#handleKeyPress}
                    />
                    <button class="send-btn" @click=${this.#handleSend}>Send</button>
                </div>
            </div>
        `;
    }

    updated() {
        const container = this.shadowRoot.querySelector('.messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    #handleKeyPress(event) {
        event.stopPropagation();
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.#handleSend();
        }
    }

    #handleSend() {
        const input = this.shadowRoot.querySelector('.input-field');
        const message = input.value.trim();

        if (message) {
            this.dispatchEvent(new CustomEvent('user-message', {
                detail: { text: message },
                bubbles: true,
                composed: true
            }));
            input.value = '';
        }
    }

    /**
     * Add a user message to the chat
     * @param {string} text
     */
    addUserMessage(text) {
        this.messages = [...this.messages, { role: 'user', content: text, streaming: false }];
    }

    /**
     * Start streaming a message
     * @param {string} id - unique id for this message
     */
    startStreamingMessage(id = null) {
        const msgId = id || `stream-${Date.now()}`;
        this.messages = [...this.messages, { role: 'assistant', content: '', streaming: true, id: msgId }];
        return msgId;
    }

    /**
     * Append chunk to streaming message
     * @param {string} msgId - id of the streaming message
     * @param {string} chunk - text chunk to append
     */
    appendToStreamingMessage(msgId, chunk) {
        const msgIndex = this.messages.findIndex(m => m.id === msgId);
        if (msgIndex !== -1) {
            const updated = [...this.messages];
            updated[msgIndex].content += chunk;
            this.messages = updated;
        }
    }

    /**
     * Finish streaming a message
     * @param {string} msgId - id of the streaming message
     */
    finishStreamingMessage(msgId) {
        const msgIndex = this.messages.findIndex(m => m.id === msgId);
        if (msgIndex !== -1) {
            const updated = [...this.messages];
            updated[msgIndex].streaming = false;
            this.messages = updated;
            this.dispatchEvent(new CustomEvent('stream-complete', {
                detail: { messageId: msgId },
                bubbles: true,
                composed: true
            }));
        }
    }

    /**
     * Add a complete message (not streaming)
     * @param {string} text
     * @param {string} role - 'user' or 'assistant'
     */
    addMessage(text, role = 'assistant') {
        this.messages = [...this.messages, { role, content: text, streaming: false }];
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        this.messages = [];
    }

    /**
     * Update context information
     * @param {number} remaining - Tokens restants
     * @param {number} total - Tokens totaux
     */
    updateContext(remaining, total) {
        this.contextRemaining = remaining;
        this.contextTotal = total;
    }
}

customElements.define('chat-component', ChatComponent);

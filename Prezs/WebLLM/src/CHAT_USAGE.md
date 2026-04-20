# Chat Component & Controller Usage

## Overview
The chat system consists of two parts:
- **ChatComponent**: A Lit Web Component that displays messages
- **ChatController**: A controller that manages chat instances and communication

## Setup

### 1. Add chat component to your HTML/Markdown slide:
```html
<chat-component data-id="unique-chat-id"></chat-component>
```

### 2. Access the controller globally:
```javascript
const controller = window.chatController;
```

## API Usage

### Add Messages
```javascript
// Add user message
controller.addUserMessage('unique-chat-id', 'Hello!');

// Add assistant message
controller.addAssistantMessage('unique-chat-id', 'Hi there!');
```

### Streaming Messages (Progressive Text Updates)
```javascript
// Start a stream
const messageId = controller.startStream('unique-chat-id');

// Append chunks as they arrive
controller.appendToStream('unique-chat-id', messageId, 'Hello ');
controller.appendToStream('unique-chat-id', messageId, 'World');

// Finish the stream (triggers 'stream-complete' event)
controller.finishStream('unique-chat-id', messageId);
```

### Listen for User Input
```javascript
const unsubscribe = controller.onUserMessage('unique-chat-id', (detail) => {
    console.log('User sent:', detail.text);
    // Handle user message here
});

// Later, to stop listening:
unsubscribe();
```

### Listen for Stream Completion
```javascript
const unsubscribe = controller.onStreamComplete('unique-chat-id', (detail) => {
    console.log('Stream completed:', detail.messageId);
});
```

### Clear Chat
```javascript
controller.clearChat('unique-chat-id');
```

## Example: Using with Built-In API

```javascript
// In your controller or event handler
const chatId = 'lema-chat';

// User sends message
window.chatController.onUserMessage(chatId, async (detail) => {
    const userText = detail.text;
    
    // Add user message to chat
    window.chatController.addUserMessage(chatId, userText);
    
    // Stream API response
    const messageId = window.chatController.startStream(chatId);
    
    try {
        const { stream } = await builtInController.prompt({ text: userText });
        
        for await (const chunk of stream) {
            window.chatController.appendToStream(chatId, messageId, chunk);
        }
    } finally {
        window.chatController.finishStream(chatId, messageId);
    }
});
```

## Styling

The component uses CSS custom properties that match the Lema theme:
- `--chat-primary`: #a855f7 (Purple)
- `--chat-secondary`: #22c55e (Green)
- `--chat-bg`: #0b0f1a (Dark background)
- `--chat-text`: #f8fafc (Light text)

You can override these in your CSS:
```css
chat-component {
    --chat-primary: #your-color;
}
```

## Component Properties

- `data-id`: Unique identifier for targeting with the controller (required)
- `messages`: Array of message objects (internal)
- `isStreaming`: Boolean indicating if a stream is active (internal)

## Events

### user-message
Fired when the user types and sends a message
```javascript
detail: { text: string }
```

### stream-complete
Fired when a streaming message is finished
```javascript
detail: { messageId: string }
```

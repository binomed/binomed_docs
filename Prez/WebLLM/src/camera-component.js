import { LitElement, html, css } from 'lit';

export class CameraComponent extends LitElement {
    static properties = {
        stream: { type: Object },
        capturedImage: { type: Object },
        isCapturing: { type: Boolean }
    };

    static styles = css`
        :host {
            flex-grow: 1;
            --camera-primary: #a855f7;
            --camera-secondary: #22c55e;
            --camera-bg: #0b0f1a;
            --camera-text: #f8fafc;
            --camera-border: rgba(255, 255, 255, 0.1);
            --camera-radius: 12px;
        }

        .camera-container {
            width: 100%;
            height: 600px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(168, 85, 247, 0.05) 100%);
            border: 1px solid var(--camera-border);
            border-radius: var(--camera-radius);
            display: flex;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            color: var(--camera-text);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }

        .video-container {
            flex: 1;
            position: relative;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        canvas {
            display: none;
        }

        .controls {
            padding: 16px;
            border-top: 1px solid var(--camera-border);
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }

        .btn {
            background: linear-gradient(135deg, var(--camera-primary), #c084fc);
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            padding: 10px 16px;
            font-weight: 500;
            transition: all 0.2s;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .thumbnail-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .thumbnail {
            width: 60px;
            height: 60px;
            border-radius: 4px;
            border: 2px solid var(--camera-primary);
            object-fit: cover;
        }

        .status-text {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
        }
    `;

    constructor() {
        super();
        this.stream = null;
        this.capturedImage = null;
        this.isCapturing = false;
        this.#videoRef = null;
        this.#canvasRef = null;
    }

    #videoRef;
    #canvasRef;

    render() {
        return html`
            <div class="camera-container">
                <div class="video-container">
                    <video
                        autoplay
                        playsinline
                        @click=${this.#capturePhoto}
                        style="cursor: ${this.isCapturing ? 'pointer' : 'default'};"
                    ></video>
                    <canvas></canvas>
                </div>
                <div class="controls">
                    <button
                        class="btn"
                        @click=${this.#toggleCamera}
                        style="background: ${this.stream ? 'linear-gradient(135deg, #ef4444, #f87171)' : 'var(--camera-primary)'}"
                    >
                        ${this.stream ? '🛑 Stop Camera' : '🎥 Start Camera'}
                    </button>
                    <button
                        class="btn"
                        @click=${this.#capturePhoto}
                        ?disabled=${!this.stream}
                    >
                        📸 Take Photo
                    </button>
                    <div class="thumbnail-container">
                        ${this.capturedImage ? html`
                            <img src="${this.#canvasToDataUrl()}" class="thumbnail" alt="captured" />
                            <span class="status-text">✓ Photo captured</span>
                        ` : html`
                            <span class="status-text">No photo yet</span>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    updated() {
        const video = this.shadowRoot.querySelector('video');
        if (video && !video.srcObject && this.stream) {
            video.srcObject = this.stream;
            this.#videoRef = video;
        }

        this.#canvasRef = this.shadowRoot.querySelector('canvas');
    }

    /**
     * Toggles the webcam stream on and off
     */
    async #toggleCamera() {
        if (this.stream) {
            this.stopCamera();
        } else {
            await this.startCamera();
        }
    }

    /**
     * Start the webcam stream
     */
    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            this.isCapturing = true;
            this.requestUpdate();
            log('Camera started');
        } catch (error) {
            log(`Error accessing camera: ${error.message}`, 'error');
            this.isCapturing = false;
        }
    }

    /**
     * Stop the webcam stream
     */
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.isCapturing = false;
            this.requestUpdate();
            log('Camera stopped');
        }
    }

    /**
     * Capture the current video frame
     */
    #capturePhoto() {
        if (!this.#videoRef || !this.#canvasRef) return;

        const ctx = this.#canvasRef.getContext('2d');
        this.#canvasRef.width = this.#videoRef.videoWidth;
        this.#canvasRef.height = this.#videoRef.videoHeight;

        ctx.drawImage(this.#videoRef, 0, 0);
        this.capturedImage = this.#canvasRef;

        this.dispatchEvent(new CustomEvent('photo-captured', {
            detail: { image: this.#canvasRef },
            bubbles: true,
            composed: true
        }));

        this.requestUpdate();
        log('Photo captured');
    }

    /**
     * Get the last captured photo canvas
     */
    getLastPhoto() {
        return this.capturedImage;
    }

    /**
     * Convert canvas to data URL for preview
     */
    #canvasToDataUrl() {
        if (!this.capturedImage) return '';
        return this.capturedImage.toDataURL('image/jpeg');
    }
}

customElements.define('camera-component', CameraComponent);

export class CameraController {
    /**
     * @type {HTMLElement}
     */
    #cameraInstance = null;

    constructor() {}

    /**
     * Setup camera: find component and start stream
     */
    async setup() {
        this.#cameraInstance = document.querySelector('camera-component');
        if (this.#cameraInstance) {
            await this.#cameraInstance.startCamera();
        } else {
            log('Camera component not found in DOM', 'error');
        }
    }

    /**
     * Teardown: stop camera stream
     */
    teardown() {
        if (this.#cameraInstance) {
            this.#cameraInstance.stopCamera();
        }
    }

    /**
     * Get the last captured photo
     * @returns {HTMLCanvasElement|null}
     */
    getLastPhoto() {
        if (!this.#cameraInstance) return null;
        return this.#cameraInstance.getLastPhoto();
    }

    /**
     * Listen for photo capture events
     * @param {Function} callback - Called with {image: HTMLCanvasElement}
     * @returns {Function} Unsubscribe function
     */
    onPhotoCapture(callback) {
        if (!this.#cameraInstance) return () => {};

        const handler = (event) => {
            callback(event.detail?.image);
        };
        this.#cameraInstance.addEventListener('photo-captured', handler);

        return () => {
            this.#cameraInstance.removeEventListener('photo-captured', handler);
        };
    }
}

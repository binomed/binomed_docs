import { html, render } from '../node_modules/lit-html/lit-html.js';

/**
 * Badge de statut pour une API
 * @param {string} label - Nom de l'API
 * @param {string} status - 'available' | 'unavailable' | 'downloadable'
 */
function statusBadge(label, status) {
    const statusConfig = {
        'available': { color: '#22c55e', icon: '✓' },
        'downloadable': { color: '#f59e0b', icon: '⬇' },
        'unavailable': { color: '#ef4444', icon: '✗' }
    };

    const config = statusConfig[status] || statusConfig['unavailable'];

    return html`
        <div style="
            display:flex;align-items:center;gap:8px;
            padding:8px 12px;
            background:${config.color}20;
            border:1px solid ${config.color}40;
            border-radius:8px;
            font-size:12px;font-weight:600;color:${config.color}">
            <span style="font-weight:800">${config.icon}</span>
            <span>${label}</span>
        </div>
    `;
}

class APIStatusWidget extends HTMLElement {
    constructor() {
        super();
        this._stateAPIS = {};
        this._collapsed = false;
        this._contextInfo = {
            remaining: 0,
            total: 0
        };
    }

    connectedCallback() {
        this._render();
    }

    /**
     * Mettre à jour l'état des APIs
     * @param {Object} stateAPIS - État des APIs { key: 'status', ... }
     */
    updateAPIs(stateAPIS) {
        this._stateAPIS = stateAPIS;
        this._render();
    }

    /**
     * Mettre à jour les infos du contexte
     * @param {number} remaining - Tokens restants
     * @param {number} total - Tokens totaux
     */
    updateContext(remaining, total) {
        this._contextInfo = { remaining, total };
        this._render();
    }

    _render() {
        render(this._tpl(), this);
    }

    _tpl() {
        const APIS_LABELS = {
            'LanguageDetector': 'Language Detector',
            'Translator': 'Translator',
            'Summarizer': 'Summarizer',
            'LanguageModel': 'Language Model',
            'Writer': 'Writer',
            'Rewriter': 'Rewriter',
            'Proofreader': 'Proofreader'
        };

        const apiEntries = Object.entries(this._stateAPIS).map(([key, status]) => ({
            label: APIS_LABELS[key] || key,
            status
        }));

        return html`
            <div style="
                background:rgba(255,255,255,0.97);
                backdrop-filter:blur(12px);
                border:1px solid #e2e8f0;
                border-radius:14px;
                box-shadow:0 6px 30px rgba(0,0,0,0.16);
                width:340px;
                font-family:system-ui,'Segoe UI',sans-serif;
                overflow:hidden;
            ">
                <!-- En-tête -->
                <div style="
                    display:flex;justify-content:space-between;align-items:center;
                    padding:10px 16px;
                    background:#f1f5f9;border-bottom:1px solid #e2e8f0;
                    cursor:move;user-select:none"
                    @mousedown="${(e) => this._drag(e)}">
                    <span style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#8b5cf6">
                        ◈ APIs Status
                    </span>
                    <button style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:14px;padding:0;line-height:1"
                        @click="${() => { this._collapsed = !this._collapsed; this._render(); }}">
                        ${this._collapsed ? '▼' : '▲'}
                    </button>
                </div>

                ${!this._collapsed ? html`
                    <div style="padding:14px 16px;display:flex;flex-direction:column;gap:12px">
                        <!-- APIs Status -->
                        ${apiEntries.length > 0 ? apiEntries.map(api => statusBadge(api.label, api.status)) : html`
                            <div style="text-align:center;color:#94a3b8;font-size:14px;padding:20px 0">
                                Aucune API à afficher
                            </div>
                        `}

                        <!-- Séparateur -->
                        ${this._contextInfo.total ? html`
                            <div style="height:1px;background:#e2e8f0"></div>

                            <!-- Context Info -->
                            <div style="display:flex;flex-direction:column;gap:6px">
                                <span style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px">
                                    Context
                                </span>
                                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                                    <div style="flex:1">
                                        <div style="
                                            height:6px;
                                            background:#e2e8f0;
                                            border-radius:3px;
                                            overflow:hidden">
                                            <div style="
                                                height:100%;
                                                background:#3b82f6;
                                                width:${this._contextInfo.total > 0 ? Math.min((this._contextInfo.remaining / this._contextInfo.total) * 100, 100) : 0}%;
                                                transition:width 0.3s ease">
                                            </div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px;font-weight:700;color:#1e293b;white-space:nowrap">
                                        ${isNaN(this._contextInfo.remaining) ? '-' : this._contextInfo.remaining} / ${this._contextInfo.total}
                                    </span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    _drag(e) {
        const rect = this.getBoundingClientRect();
        const dx   = e.clientX - rect.left;
        const dy   = e.clientY - rect.top;
        const move = (ev) => {
            this.style.left   = (ev.clientX - dx) + 'px';
            this.style.top    = (ev.clientY - dy) + 'px';
            this.style.right  = 'auto';
            this.style.bottom = 'auto';
        };
        const up = () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    }
}
customElements.define('api-status-widget', APIStatusWidget);

class APIStatusOverlay {
    #overlayWidget;
    #apiStates = {}; // État temporaire des APIs

    constructor() {
    }

    /**
     * Ajoute le widget d'état des APIs
     */
    addOverlayWidget() {
        try {
            if (this.#overlayWidget) {
                log('API Status Overlay already exists');
                return;
            }

            this.#overlayWidget = document.createElement('api-status-widget');
            Object.assign(this.#overlayWidget.style, {
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                zIndex: '10000',
            });
            document.body.appendChild(this.#overlayWidget);
            this.#overlayWidget.updateAPIs(this.#apiStates);

            log('API Status Overlay added successfully');
        } catch (error) {
            log('Error adding API Status Overlay:', 'error', error);
        }
    }

    /**
     * Retire le widget d'état des APIs
     */
    removeOverlayWidget() {
        try {
            if (this.#overlayWidget) {
                document.body.removeChild(this.#overlayWidget);
            }
            this.#overlayWidget = null;
            log('API Status Overlay removed successfully');
        } catch (error) {
            log('Error removing API Status Overlay:', 'error', error);
        }
    }

    /**
     * Mettre à jour l'état d'une API et rafraîchir l'affichage
     * @param {string} apiKey - Clé de l'API
     * @param {string} status - Statut de l'API
     */
    updateAPIStatus(apiKey, status) {
        this.#apiStates[apiKey] = status;
        if (this.#overlayWidget) {
            this.#overlayWidget.updateAPIs(this.#apiStates);
        }
    }

    /**
     * Obtient l'état temporaire des APIs
     */
    getAPIsState() {
        return this.#apiStates;
    }

    /**
     * Mettre à jour les infos du contexte
     * @param {number} remaining - Tokens restants
     * @param {number} total - Tokens totaux
     */
    updateContextInfo(remaining, total) {
        if (this.#overlayWidget) {
            this.#overlayWidget.updateContext(remaining, total);
        }
    }
}

export class PromptControler{
    #apiStatusOverlay;
    #builtInControler;

    constructor(builtInControler = null){
        this.#builtInControler = builtInControler;
        this.#apiStatusOverlay = new APIStatusOverlay();
    }

    /**
     * Définir le BuiltInControler après création (si nécessaire)
     */
    setBuiltInControler(builtInControler) {
        this.#builtInControler = builtInControler;
    }

    /**
     * Callback à passer au BuiltInControler pour écouter les événements
     * Exemple: new BuiltInControler(promptControler.handleBuiltInStateChange.bind(promptControler))
     */
    handleBuiltInStateChange(event) {
        const { state, api, msg } = event;

        if (state === 'check') {
            // Mise à jour de l'état lors du check
            this.#apiStatusOverlay.updateAPIStatus(api, msg);
        } else if (state === 'downloadModel' || state === 'readyModel') {
            // Mise à jour lors du téléchargement
            this.#apiStatusOverlay.updateAPIStatus(api, msg);
        }
    }

    /**
     * Vérifie s'il y a des APIs à télécharger et les télécharge automatiquement
     */
    async downloadMissingAPIsIfNeeded() {
        if (!this.#builtInControler) return;

        const apiStates = this.#apiStatusOverlay.getAPIsState();
        const hasDownloadable = Object.values(apiStates).some(status => status === 'downloadable');

        if (hasDownloadable) {
            log('Lancement du téléchargement des APIs...');
            await this.#builtInControler.downloadMissingAPIs();
        }
    }

    /**
     * Affiche le widget d'état des APIs
     */
    showAPIStatus() {
        this.#apiStatusOverlay.addOverlayWidget();
    }

    /**
     * Masque le widget d'état des APIs
     */
    hideAPIStatus() {
        this.#apiStatusOverlay.removeOverlayWidget();
    }

    /**
     * Mettre à jour l'affichage du contexte dans le widget
     */
    updateContextDisplay() {
        if (this.#builtInControler) {
            const contextInfo = this.#builtInControler.getContextInfo();
            log('Context Info:', 'debug', contextInfo);
            this.#apiStatusOverlay.updateContextInfo(contextInfo.remaining, contextInfo.total);
        }
    }
}
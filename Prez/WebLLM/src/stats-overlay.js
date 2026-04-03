import { html, render } from '../node_modules/lit-html/lit-html.js';


function accentColor(pct, type = 'default') {
    if (pct > 85) return '#ef4444';
    if (pct > 65) return '#f59e0b';
    return type === 'cpu' ? '#22c55e' : '#3b82f6';
}

/**
 * Jauge circulaire SVG paramétrable.
 * @param {string} label     - Libellé sous la jauge
 * @param {number} pct       - Valeur en % (0-100)
 * @param {number} r         - Rayon (grand = 36, petit = 26)
 * @param {string} sublabel  - Texte optionnel sous le label (ex: "13.5 / 16 GB")
 * @param {string} colorType - 'default' | 'cpu'
 */
function gauge(label, pct, r = 36, sublabel = '', colorType = 'default') {
    const sz        = (r + 9) * 2;
    const circ      = 2 * Math.PI * r;
    const offset    = circ * (1 - Math.min(pct, 100) / 100);
    const sw        = Math.round(r * 0.18);
    const pctFont   = Math.round(r * 0.44);
    const labelFont = r >= 34 ? 13 : 11;
    const c         = accentColor(pct, colorType);

    return html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:5px">
            <div style="position:relative;width:${sz}px;height:${sz}px">
                <svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}"
                    style="display:block;transform:rotate(-90deg)">
                    <circle cx="${sz / 2}" cy="${sz / 2}" r="${r}"
                        fill="none" stroke="#e2e8f0" stroke-width="${sw}"/>
                    <circle cx="${sz / 2}" cy="${sz / 2}" r="${r}"
                        fill="none"
                        stroke="${c}"
                        stroke-width="${sw}"
                        stroke-linecap="round"
                        stroke-dasharray="${circ}"
                        stroke-dashoffset="${offset}"
                        style="transition:stroke-dashoffset 0.4s ease"/>
                </svg>
                <div style="
                    position:absolute;inset:0;
                    display:flex;align-items:center;justify-content:center;
                    font-size:${pctFont}px;font-weight:800;color:#1e293b;
                    letter-spacing:-0.5px">
                    ${pct}%
                </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:1px">
                <span style="
                    font-size:${labelFont}px;font-weight:700;
                    color:#475569;text-transform:uppercase;letter-spacing:1px">
                    ${label}
                </span>
                ${sublabel ? html`
                    <span style="font-size:11px;color:#94a3b8;font-weight:500">${sublabel}</span>
                ` : ''}
            </div>
        </div>
    `;
}

class StatsWidget extends HTMLElement {
    constructor() {
        super();
        this._data = null;
        this._collapsed = false;
        this._es = null;
    }

    connectedCallback() {
        this._connectSSE();
        this._render();
    }

    disconnectedCallback() {
        this._es?.close();
    }

    _connectSSE() {
        if (this._es) this._es.close();
        this._es = new EventSource('http://localhost:3000/stats');
        this._es.onmessage = (e) => {
            this._data = JSON.parse(e.data);
            this._render();
        };
        this._es.onerror = () => {
            this._es.close();
            setTimeout(() => this._connectSSE(), 5000);
        };
    }

    _render() {
        render(this._tpl(), this);
    }

    _tpl() {
        const d      = this._data;
        const memPct = d ? Math.round((d.memory.used / d.memory.total) * 100) : 0;
        const cpuPct = d ? Math.round(parseFloat(d.cpu.load)) : 0;

        return html`
            <div style="
                background:rgba(255,255,255,0.97);
                backdrop-filter:blur(12px);
                border:1px solid #e2e8f0;
                border-radius:14px;
                box-shadow:0 6px 30px rgba(0,0,0,0.16);
                width:320px;
                font-family:system-ui,'Segoe UI',sans-serif;
                overflow:hidden;
            ">
                <!-- En-tête / poignée de déplacement -->
                <div style="
                    display:flex;justify-content:space-between;align-items:center;
                    padding:10px 16px;
                    background:#f1f5f9;border-bottom:1px solid #e2e8f0;
                    cursor:move;user-select:none"
                    @mousedown="${(e) => this._drag(e)}">
                    <span style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#3b82f6">
                        ◈ Stats machine
                    </span>
                    <button style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:14px;padding:0;line-height:1"
                        @click="${() => { this._collapsed = !this._collapsed; this._render(); }}">
                        ${this._collapsed ? '▼' : '▲'}
                    </button>
                </div>

                ${!this._collapsed ? html`
                    <div style="padding:14px 16px 12px">
                        ${d ? html`

                            <!-- RAM + CPU : grandes jauges -->
                            <div style="display:flex;justify-content:space-around;margin-bottom:16px">
                                ${gauge('RAM', memPct, 36, `${d.memory.used} / ${d.memory.total} GB`)}
                                ${gauge('CPU', cpuPct, 36, `${d.cpu.load}%`, 'cpu')}
                            </div>

                            <!-- Séparateur -->
                            <div style="height:1px;background:#f1f5f9;margin-bottom:14px"></div>

                            <!-- GPU : 3 jauges moyennes -->
                            <div style="margin-bottom:14px">
                                <div style="
                                    display:flex;justify-content:space-between;align-items:center;
                                    margin-bottom:10px">
                                    <span style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px">
                                        GPU
                                    </span>
                                    <span style="font-size:12px;color:#3b82f6;font-weight:700">${d.gpu.model}</span>
                                </div>
                                <div style="display:flex;justify-content:space-around">
                                    ${gauge('Renderer', d.gpu.renderer, 26)}
                                    ${gauge('Tiler',    d.gpu.tiler,    26)}
                                    ${gauge('Device',   d.gpu.device,   26)}
                                </div>
                            </div>

                            <!-- Séparateur -->
                            <div style="height:1px;background:#f1f5f9;margin-bottom:12px"></div>

                            <!-- Réseau : texte large -->
                            <div style="display:flex;justify-content:space-around">
                                <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                                    <span style="font-size:20px;font-weight:800;color:#1e293b">
                                        ${d.network.rx}
                                    </span>
                                    <span style="font-size:11px;color:#94a3b8;font-weight:500">KB/s</span>
                                    <span style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px">
                                        ↓ Réseau
                                    </span>
                                </div>
                                <div style="width:1px;background:#f1f5f9"></div>
                                <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                                    <span style="font-size:20px;font-weight:800;color:#1e293b">
                                        ${d.network.tx}
                                    </span>
                                    <span style="font-size:11px;color:#94a3b8;font-weight:500">KB/s</span>
                                    <span style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px">
                                        ↑ Envoi
                                    </span>
                                </div>
                            </div>

                        ` : html`
                            <div style="text-align:center;color:#94a3b8;font-size:14px;padding:20px 0">
                                Connexion au serveur...
                            </div>
                        `}
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
customElements.define('stats-widget', StatsWidget);

export class OverlayStats{
    #overlayWidget;

    constructor(){
    }

    /**
     * Ajoute le bouton micro avec les listeners
     * Crée un bouton circulaire avec emoji micro et ombre portée
     */
    addOverlayWidget() {
        try {
            // Éviter les doublons
            if (this.#overlayWidget) {
                log('Overlay already exists', undefined);
                return;
            }

            // Auto-injection en overlay fixe dans la présentation
            this.#overlayWidget = document.createElement('stats-widget');
            Object.assign(this.#overlayWidget.style, {
                position: 'fixed',
                top: '16px',
                right: '16px',
                zIndex: '10000',
            });
            document.body.appendChild(this.#overlayWidget);

            
            log('Overlay added successfully', undefined);
        } catch (error) {
            log('Error adding overlay:', undefined, 'error', error);
        }
    }

    /**
     * Retire le overlay widget
     * Supprime complètement le widget
     */
    removeOverlayWidget() {
        try {
            
            // Retrait du widget du DOM
            if (this.#overlayWidget) {
                document.body.removeChild(this.#overlayWidget);
            }
            
            // Reset des variables
            this.#overlayWidget = null;
            
            log('Overlay removed successfully', undefined);
        } catch (error) {
            log('Error removing micro button:', undefined, 'error', error);
        }
    }
}


/**
 * Gère l'extraction et l'exécution des actions fragmentées
 * Reconstruit les actions `[[ACTION:NAME]]` qui peuvent être fragmentées sur plusieurs chunks
 */
export class ActionHandler {
    #handlers = new Map();        // Map<actionName, callback>
    #buffer = '';                 // Buffer pour reconstituer les actions fragmentées
    #completedActions = [];       // Actions complètes trouvées

    /**
     * Enregistre un handler pour une action
     * @param {string} actionName - Nom de l'action (ex: NEXT_SLIDE)
     * @param {Function} callback - Fonction à exécuter quand l'action est trouvée
     */
    registerActionHandler(actionName, callback) {
        this.#handlers.set(actionName, callback);
    }

    /**
     * Traite un chunk et extrait les actions complètes
     * Gère les actions fragmentées sur plusieurs chunks
     * @param {string} chunk - Chunk de texte à traiter
     * @returns {Object} {cleanText: string, completedActions: string[]}
     */
    processChunk(chunk) {
        // Ajouter le chunk au buffer
        this.#buffer += chunk;

        // Regex pour trouver les actions complètes: [[ACTION:NAME]]
        const actionRegex = /\[\[ACTION:([A-Z_]+)\]\]/g;
        let cleanText = this.#buffer;
        let match;
        const actions = [];

        // Extraire toutes les actions complètes
        while ((match = actionRegex.exec(this.#buffer)) !== null) {
            actions.push(match[1]);
        }

        // Supprimer les actions du texte
        cleanText = cleanText.replace(actionRegex, '');

        // Vérifier s'il y a des fragments d'action incomplets à la fin du buffer
        // Un fragment incomplet commencerait par [ ou [[ ou [[A etc
        const lastBracketIndex = Math.max(
            this.#buffer.lastIndexOf('['),
            this.#buffer.lastIndexOf('[['),
            this.#buffer.lastIndexOf('[[ACTION')
        );

        let remainingBuffer = '';
        if (lastBracketIndex > -1) {
            // Vérifier si c'est potentiellement le début d'une action
            const potentialStart = this.#buffer.substring(lastBracketIndex);

            // Si ça ressemble au début d'une action mais n'est pas complet
            if (potentialStart.match(/^\[\[?(?:ACTION)?(?::)?[A-Z_]*$/) &&
                !potentialStart.includes(']]')) {
                remainingBuffer = potentialStart;
                cleanText = cleanText.substring(0, cleanText.lastIndexOf(potentialStart));
            }
        }

        // Mettre à jour le buffer avec les fragments incomplets
        this.#buffer = remainingBuffer;

        return {
            cleanText: cleanText,
            completedActions: actions
        };
    }

    /**
     * Force l'exécution de toutes les actions en attente
     * À appeler à la fin du stream
     */
    flushActions() {
        const actions = this.#completedActions;
        this.#completedActions = [];
        this.#buffer = '';
        return actions;
    }

    /**
     * Exécute les callbacks associés aux actions
     * @param {string[]} actionNames - Noms des actions à exécuter
     */
    executeActions(actionNames) {
        for (const actionName of actionNames) {
            if (this.#handlers.has(actionName)) {
                try {
                    this.#handlers.get(actionName)();
                } catch (error) {
                    log(`Erreur lors de l'exécution de l'action ${actionName}:`, 'error', error);
                }
            } else {
                log(`Action non enregistrée: ${actionName}`, 'warn');
            }
        }
    }

    /**
     * Ajoute une action complétée à la liste des actions à exécuter
     * @param {string} actionName - Nom de l'action
     */
    addCompletedAction(actionName) {
        this.#completedActions.push(actionName);
    }

    /**
     * Récupère toutes les actions complétées en attente d'exécution
     * @returns {string[]}
     */
    getCompletedActions() {
        return [...this.#completedActions];
    }

    /**
     * Réinitialise le handler (nouveau stream)
     */
    reset() {
        this.#buffer = '';
        this.#completedActions = [];
    }
}

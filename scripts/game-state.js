// Game state management
const gameState = {
    scu: 10,
    selectedConstellation: null,
    lockedToken: null,
    foundErrors: [],
    correctedErrors: [],
    usedActions: [],
    
    reset() {
        this.foundErrors = [];
        this.correctedErrors = [];
        this.lockedToken = null;
    },
    
    updateSCU(delta) {
        this.scu = Math.max(0, this.scu + delta);
        document.getElementById('scuValue').textContent = this.scu;
        document.getElementById('scuDisplay').textContent = this.scu;
        
        if (this.scu === 0) {
            setTimeout(() => {
                showFeedback(`
                    <h3 style="color: #f44336;">💀 SCU Esauriti!</h3>
                    <p style="margin-top: 20px;">Capitale semantico terminato. Ricarica per ricominciare.</p>
                    <button class="btn-primary" onclick="location.reload()" 
                            style="width: 100%; margin-top: 20px; background: linear-gradient(135deg, #f44336, #e57373);">
                        🔄 Ricarica
                    </button>
                `, 'error');
            }, 500);
        }
    },
    
    allErrorsCorrected() {
        if (!this.selectedConstellation) return false;
        const constellation = CONSTELLATIONS[this.selectedConstellation];
        return this.correctedErrors.length === constellation.errors.length;
    }
};

// Grounding Actions logic

function showActionInfo(actionId) {
    const action = GROUNDING_ACTIONS.find(a => a.id === actionId);
    const modal = document.getElementById('cardModal');
    const content = document.getElementById('cardModalContent');
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 4em; margin-bottom: 10px;">${action.icon}</div>
            <h2 style="color: #64b5f6; margin: 0;">${action.title} Grounding</h2>
        </div>
        
        <div style="background: ${action.color}; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p style="line-height: 1.8; color: #e0e0e0; font-size: 1.05em;">${action.info.explanation}</p>
        </div>
        
        <div style="background: rgba(100, 181, 246, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 25px;">
            <h3 style="color: #90caf9; margin-bottom: 10px;">🔍 Keywords</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${action.info.keywords.map(kw => `
                    <span style="background: rgba(100, 181, 246, 0.2); padding: 5px 12px; border-radius: 15px; color: #64b5f6;">
                        ${kw}
                    </span>
                `).join('')}
            </div>
        </div>
        
        <button class="btn-primary" onclick="useAction('${action.id}')" 
                style="width: 100%; background: linear-gradient(135deg, #4caf50, #66bb6a); font-size: 1.1em; padding: 15px;">
            ✓ Use This Grounding Action
        </button>
    `;
    
    modal.classList.add('show');
}

function useAction(actionId) {
    const actionEl = document.querySelector(`[data-action="${actionId}"]`);
    if (actionEl.classList.contains('used')) {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ Action Already Used</h3>
            <p style="margin-top: 15px;">This grounding action has already been used!</p>
        `, "error");
        return;
    }
    
    const c = CONSTELLATIONS[gameState.selectedConstellation];
    const errorToCorrect = gameState.foundErrors.find(idx => {
        const err = c.errors[idx];
        return err.card === actionId && !gameState.correctedErrors.includes(idx);
    });
    
    if (errorToCorrect !== undefined) {
        // CORRECT ACTION!
        gameState.correctedErrors.push(errorToCorrect);
        gameState.usedActions.push(actionId);
        actionEl.classList.add('used');
        
        // Change token from red to green
        document.querySelectorAll(`[data-idx="${errorToCorrect}"]`).forEach(t => {
            t.classList.remove('token-error'); // Remove red
            t.classList.add('token-corrected'); // Add green
        });
        
        closeModal('cardModal');
        
        // Update latent space
        updateLatentSpace();
        
        // Check if all errors corrected
        if (gameState.allErrorsCorrected()) {
            // Don't show feedback, go straight to completion
            updateStats();
            setTimeout(() => {
                triggerKnowledgeGeneration();
            }, 500);
        } else {
            // Show normal feedback for non-final corrections
            showFeedback(`
                <h3 style="color: #4caf50;">✅ Grounding Applied!</h3>
                <p style="margin-top: 15px;">Semantic capital used correctly!</p>
                <p style="margin-top: 10px; color: #90caf9;">
                    Error corrected: <strong>${c.errors[errorToCorrect].text}</strong> → 
                    <strong>${c.errors[errorToCorrect].correct}</strong>
                </p>
            `, "feedback");
            
            updateStats();
        }
    } else {
        // WRONG ACTION - but check if there are uncorrected errors of OTHER types
        const uncorrectedErrors = gameState.foundErrors.filter(idx => !gameState.correctedErrors.includes(idx));
        
        if (uncorrectedErrors.length > 0) {
            // There ARE uncorrected errors, but wrong grounding type!
            const wrongErrors = uncorrectedErrors.map(idx => {
                const err = c.errors[idx];
                return `<strong>"${err.text}"</strong> richiede <strong>${GROUNDING_ACTIONS.find(a => a.id === err.card)?.title || err.card}</strong>`;
            }).join('<br>');
            
            gameState.updateSCU(-1);
            closeModal('cardModal');
            
            showFeedback(`
                <h3 style="color: #f44336;">❌ Grounding Action Sbagliata! -1 SCU</h3>
                <p style="margin-top: 15px;">Hai trovato errori, ma <strong>${GROUNDING_ACTIONS.find(a => a.id === actionId)?.title || actionId}</strong> non è la Grounding Action corretta per correggerli!</p>
                <p style="margin-top: 15px; color: #64b5f6;">
                    <strong>Errori trovati (in rosso) che richiedono altre Grounding Actions:</strong>
                </p>
                <p style="margin-top: 10px; color: #90caf9; line-height: 1.8;">
                    ${wrongErrors}
                </p>
                <p style="margin-top: 15px; color: #ffa726; font-size: 0.9em;">
                    💡 Usa la Grounding Action corretta che corrisponde al tipo di errore trovato!
                </p>
            `, "error");
        } else {
            // No errors found at all
            gameState.updateSCU(-1);
            closeModal('cardModal');
            
            showFeedback(`
                <h3 style="color: #f44336;">❌ Nessun Errore Trovato! -1 SCU</h3>
                <p style="margin-top: 15px;">Non hai ancora trovato nessun errore che richiede <strong>${GROUNDING_ACTIONS.find(a => a.id === actionId)?.title || actionId}</strong>.</p>
                <p style="margin-top: 10px; color: #64b5f6;">
                    <strong>Procedura corretta:</strong>
                </p>
                <ol style="line-height: 2; margin-left: 20px; margin-top: 10px; color: #90caf9;">
                    <li>Trova un errore nel testo e marcalo come ❌ Errore</li>
                    <li>Il token diventa <span style="color: #f44336; font-weight: bold;">rosso</span></li>
                    <li>Poi usa la Grounding Action corretta per correggerlo</li>
                </ol>
            `, "error");
        }
    }
}

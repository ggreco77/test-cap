// Token interaction logic

function renderText() {
    const c = CONSTELLATIONS[gameState.selectedConstellation];
    let text = c.text;
    
    // Mark errors with placeholders
    c.errors.forEach((e, i) => {
        text = text.replace(`{{${e.text}}}`, `__E${i}A__`);
        text = text.replace(`{{${e.context}}}`, `__E${i}B__`);
    });
    
    // Split into syntactic phrases (sentences, clauses)
    // Updated regex to include em dash (—) as separator, capturing surrounding spaces
    const phrases = text.split(/([.!?,;]\s+|\s+—\s+)/);
    let html = '';
    
    phrases.forEach(phrase => {
        // Skip empty phrases but preserve single spaces
        if (!phrase.trim() && !phrase.match(/\s+—\s+/)) {
            html += phrase;
            return;
        }
        
        // Handle em dash with spaces as separate token
        if (phrase.match(/\s+—\s+/)) {
            html += `<span class="hover-token" data-err="false"> — </span>`;
            return;
        }
        
        // Trim leading/trailing spaces for token content
        const trimmedPhrase = phrase.trim();
        if (!trimmedPhrase) {
            html += phrase;
            return;
        }
        
        // Check if phrase contains error markers
        if (phrase.includes('__E')) {
            // Split by error markers while keeping them
            const parts = phrase.split(/(__E\d+[AB]__)/);
            parts.forEach(part => {
                const match = part.match(/__E(\d+)([AB])__/);
                if (match) {
                    const idx = match[1];
                    const e = c.errors[parseInt(idx)];
                    const txt = match[2] === 'A' ? e.text : e.context;
                    html += `<span class="hover-token" data-idx="${idx}" data-err="true">${txt}</span>`;
                } else if (part.trim()) {
                    html += `<span class="hover-token" data-err="false">${part.trim()}</span>`;
                } else {
                    html += part;
                }
            });
        } else {
            // Entire phrase is one token
            html += `<span class="hover-token" data-err="false">${trimmedPhrase}</span>`;
        }
    });
    
    document.getElementById('llmText').innerHTML = html;
    attachHoverListeners();
}

let hoverTimeout;
function attachHoverListeners() {
    document.querySelectorAll('.hover-token').forEach(el => {
        el.onmouseover = () => {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => highlight(el), 100);
        };
        el.onclick = () => lock(el);
    });
}

function highlight(el) {
    if (gameState.lockedToken) return;
    showPanel(el);
}

function lock(el) {
    if (gameState.lockedToken) {
        gameState.lockedToken.classList.remove('token-locked');
    }
    gameState.lockedToken = el;
    el.classList.add('token-locked');
    showPanel(el);
}

function showPanel(el) {
    const panel = document.getElementById('decisionPanel');
    
    // Check if there are uncorrected errors - block interaction
    const uncorrectedErrors = gameState.foundErrors.filter(i => !gameState.correctedErrors.includes(i));
    if (uncorrectedErrors.length > 0) {
        panel.style.display = 'block';
        panel.innerHTML = `
            <div style="margin-bottom: 10px; color: #90caf9;">
                <strong>Token:</strong> "${el.textContent}"
            </div>
            <div style="background: rgba(255, 152, 0, 0.2); padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800;">
                <p style="color: #ff9800; margin: 0; line-height: 1.6;">
                    🔒 <strong>Selezione bloccata!</strong><br>
                    Correggi prima gli errori in rosso usando le Grounding Actions.
                </p>
            </div>
        `;
        return;
    }
    
    panel.style.display = 'block';
    panel.innerHTML = `
        <div style="margin-bottom: 15px; color: #90caf9; text-align: center;">
            <strong>Sequenza token:</strong> "${el.textContent}"
        </div>
        <p style="text-align: center; color: #ffa726; font-size: 0.9em; margin-bottom: 15px;">
            ⚠️ Se sbagli classificazione perdi 1 SCU
        </p>
        <div style="display: flex; gap: 10px;">
            <button class="btn-primary" onclick="markError()" style="flex: 1; background: linear-gradient(135deg, #f44336, #e57373);">
                ❌ Errore
            </button>
            <button class="btn-primary" onclick="markCorrect()" style="flex: 1; background: linear-gradient(135deg, #4caf50, #66bb6a);">
                ✓ Corretto
            </button>
        </div>
    `;
}

function markError() {
    const el = gameState.lockedToken;
    if (!el) {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ Seleziona Prima un Token!</h3>
            <p style="margin-top: 15px;">Prima di classificare come errore, devi selezionare una sequenza di token nel testo LLM.</p>
            <p style="margin-top: 10px; color: #64b5f6;">
                <strong>Come fare:</strong>
            </p>
            <ol style="line-height: 2; margin-left: 20px; margin-top: 10px; color: #90caf9;">
                <li>Clicca su una sequenza di token nel testo</li>
                <li>Apparirà il pannello "Decidi: ❌ Errore o ✓ Corretto"</li>
                <li>Scegli se la sequenza è corretta o contiene un errore</li>
            </ol>
            <p style="margin-top: 15px; color: #ffa726; font-size: 0.9em;">
                💡 Leggi attentamente il testo generato dall'LLM e cerca le sequenze sbagliate!
            </p>
        `, "error");
        return;
    }
    
    if (el.dataset.err === 'true') {
        const idx = parseInt(el.dataset.idx);
        
        if (gameState.foundErrors.includes(idx)) {
            showFeedback("Hai già trovato questo errore!", "error");
            return;
        }
        
        // Check if there are uncorrected errors blocking progress
        const uncorrectedErrors = gameState.foundErrors.filter(i => !gameState.correctedErrors.includes(i));
        if (uncorrectedErrors.length > 0) {
            showFeedback(`
                <h3 style="color: #ff9800;">⚠️ Errore Ancora in Rosso!</h3>
                <p style="margin-top: 15px;">Hai ${uncorrectedErrors.length} errore/i già trovato/i (in rosso) ma non ancora corretto/i.</p>
                <p style="margin-top: 10px; color: #64b5f6;"><strong>Usa una Grounding Action</strong> per correggere gli errori in rosso prima di cercarne altri!</p>
                <p style="margin-top: 10px; color: #ff9800; font-size: 0.9em;">🔒 La selezione di nuovi token è bloccata finché non correggi quelli in rosso.</p>
            `, "error");
            return;
        }
        
        const c = CONSTELLATIONS[gameState.selectedConstellation];
        const err = c.errors[idx];
        const hallType = HALLUCINATION_TYPES[err.hallType];
        
        gameState.foundErrors.push(idx);
        
        document.querySelectorAll(`[data-idx="${idx}"]`).forEach(t => {
            t.classList.remove('token-locked');
            t.classList.add('token-error'); // Red until corrected
        });
        
        gameState.lockedToken = null;
        
        // Update latent space
        updateLatentSpace();
        
        showFeedback(`
            <h3 style="color: #4caf50;">🎯 Errore Trovato!</h3>
            <p style="margin-top: 15px;"><strong>Errato:</strong> ${err.text}</p>
            <p style="margin-top: 10px;"><strong>Corretto:</strong> ${err.correct}</p>
            
            <div style="background: rgba(255, 152, 0, 0.1); padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ff9800;">
                <h4 style="color: #ff9800; margin-bottom: 10px;">
                    📚 ${hallType.name}
                </h4>
                <p style="font-size: 0.9em; color: #90caf9; margin-bottom: 10px;">
                    <strong>Fonte:</strong> ${hallType.paper}
                </p>
                <p style="line-height: 1.8; margin-bottom: 15px;">
                    <strong>Definizione:</strong> ${hallType.definition}
                </p>
                <p style="line-height: 1.8; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    <strong>Spiegazione dal paper:</strong><br>
                    <em>${hallType.example_from_paper}</em>
                </p>
                <p style="line-height: 1.8;">
                    <strong>Perché l'LLM sbaglia:</strong> ${err.why}
                </p>
                <p style="margin-top: 10px; font-size: 0.85em; color: #64b5f6;">
                    <strong>Rilevamento:</strong> ${hallType.detection}
                </p>
            </div>
            
            <div style="background: rgba(33, 150, 243, 0.15); padding: 15px; border-radius: 8px; margin-top: 20px; border: 2px solid #2196f3;">
                <p style="color: #64b5f6; font-weight: bold; text-align: center;">
                    ⚡ Ora usa una Grounding Action per correggere questo errore!
                </p>
            </div>
        `, "feedback");
        
        updateStats();
    } else {
        // WRONG! Marked correct token as error - LOSE 1 SCU
        gameState.scu = Math.max(0, gameState.scu - 1);
        
        el.classList.remove('token-locked');
        gameState.lockedToken = null;
        
        showFeedback(`
            <h3 style="color: #f44336;">❌ Sbagliato! -1 SCU</h3>
            <p style="margin-top: 15px;">Questo token è <strong>corretto</strong>, non è un errore!</p>
            <p style="margin-top: 10px; color: #ff9800; font-weight: bold;">Hai perso 1 SCU per classificazione errata.</p>
            <p style="margin-top: 10px; color: #90caf9;">SCU rimanenti: ${gameState.scu}</p>
        `, "error");
        
        updateStats();
    }
}

function markCorrect() {
    const el = gameState.lockedToken;
    if (!el) {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ Seleziona Prima un Token!</h3>
            <p style="margin-top: 15px;">Prima di classificare come corretto, devi selezionare una sequenza di token nel testo LLM.</p>
            <p style="margin-top: 10px; color: #64b5f6;">
                <strong>Come fare:</strong>
            </p>
            <ol style="line-height: 2; margin-left: 20px; margin-top: 10px; color: #90caf9;">
                <li>Clicca su una sequenza di token nel testo</li>
                <li>Apparirà il pannello "Decidi: ❌ Errore o ✓ Corretto"</li>
                <li>Scegli se la sequenza è corretta o contiene un errore</li>
            </ol>
            <p style="margin-top: 15px; color: #ffa726; font-size: 0.9em;">
                💡 Leggi attentamente il testo generato dall'LLM e cerca le sequenze sbagliate!
            </p>
        `, "error");
        return;
    }
    
    if (el.dataset.err === 'false') {
        // CORRECT! Token is correct and user marked it correctly
        el.classList.remove('token-locked');
        el.classList.add('token-verified');
        gameState.lockedToken = null;
        
        showFeedback(`
            <h3 style="color: #4caf50;">✓ Corretto!</h3>
            <p style="margin-top: 15px;">Token verificato correttamente.</p>
            <p style="margin-top: 10px; color: #90caf9;">Continua a cercare gli errori!</p>
        `, "feedback");
    } else {
        // WRONG! This is an error but user marked it as correct - LOSE 1 SCU
        const idx = parseInt(el.dataset.idx);
        const c = CONSTELLATIONS[gameState.selectedConstellation];
        const err = c.errors[idx];
        
        gameState.scu = Math.max(0, gameState.scu - 1);
        
        el.classList.remove('token-locked');
        gameState.lockedToken = null;
        
        showFeedback(`
            <h3 style="color: #f44336;">❌ Sbagliato! -1 SCU</h3>
            <p style="margin-top: 15px;">Questo token contiene un <strong>errore</strong>!</p>
            <p style="margin-top: 10px;"><strong>Errore:</strong> ${err.text}</p>
            <p style="margin-top: 5px;"><strong>Dovrebbe essere:</strong> ${err.correct}</p>
            <p style="margin-top: 15px; color: #ff9800; font-weight: bold;">Hai perso 1 SCU per classificazione errata.</p>
            <p style="margin-top: 10px; color: #90caf9;">SCU rimanenti: ${gameState.scu}</p>
        `, "error");
        
        updateStats();
    }
}

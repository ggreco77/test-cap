// UI Management

let savedData = {
    enriched: '',
    prompt: '',
    ethics: ''
};

function selectConstellation(key) {
    gameState.selectedConstellation = key;
    gameState.reset();
    
    const c = CONSTELLATIONS[key];
    
    document.querySelectorAll('.constellation-btn').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');
    
    document.getElementById('mythBtn').style.display = 'block';
    document.getElementById('llmToggleBtn').style.display = 'block';
    
    // Reset action cards
    document.querySelectorAll('.card').forEach(card => card.classList.remove('used'));
    gameState.usedActions = [];
    
    // Show objects in Arricchimento section
    document.getElementById('objectsList').innerHTML = c.objects.map((obj, idx) =>
        `<div class="object-card" onclick="showObject(${idx})">
            <strong style="color: #4caf50;">${obj.name}</strong>
            <div style="font-size: 0.9em; color: #b0b0b0; margin-top: 5px;">${obj.description}</div>
        </div>`
    ).join('');
    
    // Initialize enriched text
    updateEnrichedText();
    
    // Hide LLM text initially
    document.getElementById('llmText').style.display = 'none';
    document.getElementById('llmTextPlaceholder').style.display = 'block';
    
    updateLatentSpace();
    updateStats();
}

function updateEnrichedText() {
    const c = CONSTELLATIONS[gameState.selectedConstellation];
    if (!c) return;
    
    let text = `📖 ${c.name} - Testo Corretto e Verificato\n\n`;
    text += `🔭 OGGETTI:\n`;
    c.objects.forEach(obj => {
        text += `\n• ${obj.name}\n`;
        text += `  ${obj.description}\n`;
    });
    
    text += `\n\n📜 MITO ORIGINALE:\n${c.myth}\n`;
    
    text += `\n\n📄 TESTO CORRETTO:\n`;
    
    // Generate corrected text by replacing errors
    let correctedText = c.text;
    c.errors.forEach((e, i) => {
        correctedText = correctedText.replace(`{{${e.text}}}`, e.correct);
        correctedText = correctedText.replace(`{{${e.context}}}`, '');
    });
    // Remove remaining markers
    correctedText = correctedText.replace(/{{|}}/g, '');
    
    text += correctedText;
    
    text += `\n\n✅ Fonti verificate: NASA, ESA, Cataloghi Messier/NGC\n`;
    text += `Data verifica: ${new Date().toLocaleDateString('it-IT')}\n`;
    
    document.getElementById('enrichedTextBox').value = text;
}

function toggleLLMText() {
    const llmText = document.getElementById('llmText');
    const placeholder = document.getElementById('llmTextPlaceholder');
    const btn = document.getElementById('llmToggleBtn');
    
    if (llmText.style.display === 'none') {
        renderText();
        llmText.style.display = 'block';
        placeholder.style.display = 'none';
        btn.innerHTML = '🙈 Nascondi Testo LLM';
        btn.style.background = 'linear-gradient(135deg, #f44336, #e57373)';
    } else {
        llmText.style.display = 'none';
        placeholder.style.display = 'block';
        btn.innerHTML = '👁️ Mostra Testo LLM';
        btn.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
    }
}

function saveEnrichedText() {
    savedData.enriched = document.getElementById('enrichedTextBox').value;
    
    // Show modal to guide to Section 3
    const modal = document.getElementById('feedbackModal');
    const content = document.getElementById('feedbackContent');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.className = 'modal-content feedback-modal';
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 4em; margin-bottom: 10px;">💾✨</div>
            <h2 style="color: #4caf50; margin: 0;">Capitale Semantico Salvato!</h2>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2)); padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 2px solid #4caf50;">
            <p style="line-height: 1.8; font-size: 1.05em; text-align: center;">
                Il tuo <strong>capitale semantico arricchito</strong> è stato salvato con successo!
            </p>
        </div>
        
        <div style="background: rgba(33, 150, 243, 0.15); padding: 25px; border-radius: 10px; border-left: 4px solid #2196f3; margin-bottom: 20px;">
            <h3 style="color: #64b5f6; margin-bottom: 15px;">🎨 Prossimo Passo: Crea un'Immagine!</h3>
            <p style="line-height: 1.8; font-size: 1.05em;">
                Ora puoi usare il tuo <strong>capitale semantico</strong> per creare un prompt e generare un'immagine con GenAI.
            </p>
            <p style="line-height: 1.8; margin-top: 15px; color: #90caf9;">
                Vai alla <strong style="color: #64b5f6;">Sezione 3 (Blu) - Creazione Prompt</strong> per trovare suggerimenti di prompt su onde gravitazionali, LISA, Einstein Telescope e molto altro!
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 25px;">
            <button class="btn-primary" onclick="document.getElementById('feedbackModal').classList.remove('show'); document.getElementById('section-prompt').scrollIntoView({behavior: 'smooth', block: 'start'});" style="padding: 15px 40px; font-size: 1.1em; background: linear-gradient(135deg, #2196f3, #42a5f5);">
                Vai alla Sezione 3
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

function usePromptSuggestion(type) {
    const prompts = {
        lisa: `Crea un'immagine artistica di LISA, il rivelatore spaziale di onde gravitazionali. Tre satelliti collegati da laser verdi formano un triangolo di 2.5 milioni di km nello spazio profondo. Sullo sfondo, onde gravitazionali visualizzate come increspature dello spazio-tempo.

[AGGIUNGI QUI IL TUO CAPITALE SEMANTICO su LISA]

Stile: scientific visualization, colori blu e verde, spazio profondo realistico.`,
        
        fusion: `Illustrazione scientifica di due buchi neri in fase di fusione. Mostra le orbite spiralizzanti, il disco di accrescimento luminoso, e le onde gravitazionali che si propagano come cerchi concentrici nello spazio-tempo deformato.

[AGGIUNGI QUI IL TUO CAPITALE SEMANTICO su fusioni e buchi neri]

Stile: visualizzazione scientifica con colori blu e arancio, dettagli fisicamente accurati.`,
        
        virgo: `Vista aerea dell'interferometro Virgo vicino a Pisa, Italia. Due bracci lunghi 3 km formano una L perfetta nella campagna toscana. Raggi laser visibili nei tunnel, struttura high-tech.

[AGGIUNGI QUI IL TUO CAPITALE SEMANTICO su Virgo]

Stile: fotografico realistico, luce del tramonto, prospettiva aerea.`,
        
        einstein: `Albert Einstein alla lavagna nel 1916, scrivendo le equazioni della relatività generale che predicono le onde gravitazionali. Sullo sfondo, visualizzazione artistica moderna di onde gravitazionali.

[AGGIUNGI QUI IL TUO CAPITALE SEMANTICO su Einstein e onde gravitazionali]

Stile: ritratto storico incontro arte scientifica moderna, bianco e nero con accenti colorati.`,
        
        et: `Concept art dell'Einstein Telescope, rivelatore sotterraneo di terza generazione. Struttura triangolare di 10 km per lato, 200-300 metri sottoterra. Tecnologia futuristica, tunnel illuminati, sensori avanzati. Vista isometrica cutaway che mostra la struttura interna.

[AGGIUNGI QUI IL TUO CAPITALE SEMANTICO su Einstein Telescope]

Stile: concept art futuristico, cutaway tecnico, illuminazione blu tecnologica.`
    };
    
    const promptBox = document.getElementById('promptBox');
    promptBox.value = prompts[type] || '';
    promptBox.focus();
    
    showFeedback(`
        <h3 style="color: #64b5f6;">💡 Suggerimento Caricato!</h3>
        <p style="margin-top: 15px; line-height: 1.8;">
            Il prompt suggerito è stato caricato nel box. 
        </p>
        <p style="margin-top: 10px; color: #ffa726;">
            📝 Ora aggiungi le informazioni dal tuo <strong>capitale semantico</strong> nella sezione indicata per rendere il prompt più accurato e ricco di dettagli verificati!
        </p>
    `, 'feedback');
}

function copyEnrichedText() {
    const text = document.getElementById('enrichedTextBox').value;
    navigator.clipboard.writeText(text).then(() => {
        showFeedback(`
            <h3 style="color: #4caf50;">📋 Copiato!</h3>
            <p style="margin-top: 15px;">Capitale semantico copiato negli appunti.</p>
            <p style="margin-top: 10px; color: #90caf9;">Incollalo come contesto nei tuoi prompt!</p>
        `, 'feedback');
    });
}

function savePrompt() {
    savedData.prompt = document.getElementById('promptBox').value;
    showFeedback(`
        <h3 style="color: #2196f3;">💾 Prompt Salvato!</h3>
        <p style="margin-top: 15px;">Il tuo prompt è stato salvato.</p>
        <p style="margin-top: 10px; color: #90caf9;">Puoi inviarlo agli strumenti GenAI usando i bottoni sotto.</p>
    `, 'feedback');
}

function saveEthics() {
    const textarea = document.getElementById('ethicsTextBox');
    if (textarea) {
        savedData.ethics = textarea.value;
        showFeedback(`
            <h3 style="color: #9c27b0;">💾 Caption Salvata!</h3>
            <p style="margin-top: 15px;">La tua caption etica è stata salvata.</p>
            <p style="margin-top: 10px; color: #90caf9;">Usala come didascalia per le tue immagini generate!</p>
        `, 'feedback');
    }
}

function sendToService(service) {
    const prompt = document.getElementById('promptBox').value;
    
    if (!prompt.trim()) {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ Prompt Vuoto</h3>
            <p style="margin-top: 15px;">Scrivi prima un prompt nella box sopra!</p>
        `, 'error');
        return;
    }
    
    const urls = {
        'chatgpt': 'https://chat.openai.com/',
        'claude': 'https://claude.ai/',
        'gemini': 'https://gemini.google.com/',
        'midjourney': 'https://www.midjourney.com/',
        'dalle': 'https://labs.openai.com/'
    };
    
    // Copy prompt to clipboard
    navigator.clipboard.writeText(prompt).then(() => {
        showFeedback(`
            <h3 style="color: #4caf50;">📋 Prompt Copiato!</h3>
            <p style="margin-top: 15px;">Aprirò ${service.toUpperCase()} in una nuova scheda.</p>
            <p style="margin-top: 10px; color: #90caf9;">Il prompt è negli appunti - incollalo (Ctrl+V / Cmd+V) nella chat!</p>
        `, 'feedback');
        
        // Open service in new tab
        setTimeout(() => {
            window.open(urls[service], '_blank');
        }, 1000);
    });
}

function showMyth() {
    const c = CONSTELLATIONS[gameState.selectedConstellation];
    
    // Check if source is a URL to embed
    if (c.source && c.source.startsWith('http')) {
        showFeedback(`
            <h3 style="color: #ffd700;">📖 Fonte Verificata: ${c.name}</h3>
            <div style="margin: 20px 0;">
                <iframe src="${c.source}" 
                        style="width: 100%; height: 600px; border: 2px solid #64b5f6; border-radius: 10px; background: white;"
                        title="Fonte verificata">
                </iframe>
            </div>
            <p style="margin-top: 15px; text-align: center; color: #90caf9; font-size: 0.9em;">
                <a href="${c.source}" target="_blank" style="color: #64b5f6; text-decoration: underline;">
                    🔗 Apri in una nuova finestra
                </a>
            </p>
            <p style="margin-top: 10px; text-align: center; color: #90caf9; font-size: 0.9em;">
                ℹ️ Usa questa fonte verificata per identificare errori nel testo LLM
            </p>
        `, "feedback");
    } else {
        // Show text content
        showFeedback(`
            <h3 style="color: #ffd700;">📖 Fonte Verificata: ${c.name}</h3>
            ${c.source ? `<div style="background: rgba(100, 181, 246, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #64b5f6; margin: 20px 0;">
                <p style="color: #90caf9; margin: 0; line-height: 1.8; font-size: 0.95em;">
                    <strong>Riferimento:</strong> ${c.source}
                </p>
            </div>` : ''}
            <p style="line-height: 2; margin-top: 20px; text-align: justify; white-space: pre-line;">${c.originalText}</p>
            <p style="margin-top: 20px; text-align: center; color: #90caf9; font-size: 0.9em;">
                ℹ️ Usa questo testo verificato per identificare errori nel testo LLM
            </p>
        `, "feedback");
    }
}

function showObject(idx) {
    const c = CONSTELLATIONS[gameState.selectedConstellation];
    const obj = c.objects[idx];
    
    // Open Wikipedia source in new tab
    if (obj.source) {
        window.open(obj.source, '_blank');
    }
    
    // Highlight keyword in the enriched text by wrapping with markers
    const enrichedTextBox = document.getElementById('enrichedTextBox');
    if (enrichedTextBox && obj.keyword) {
        const text = enrichedTextBox.value;
        const keyword = obj.keyword;
        
        // Find the keyword (case insensitive)
        const regex = new RegExp(`(${keyword})`, 'gi');
        
        // Wrap keyword with bold markers ***keyword***
        const highlightedText = text.replace(regex, '***$1***');
        enrichedTextBox.value = highlightedText;
        
        // Focus and scroll to top
        enrichedTextBox.focus();
        enrichedTextBox.scrollTop = 0;
        
        // Show feedback
        showFeedback(`
            <h3 style="color: #4caf50;">📚 Fonte Aperta!</h3>
            <p style="margin-top: 15px; line-height: 1.8;">
                La fonte Wikipedia per <strong>${obj.name}</strong> è stata aperta in una nuova scheda.
            </p>
            <p style="margin-top: 15px; color: #64b5f6; line-height: 1.8;">
                La keyword <strong>"${obj.keyword}"</strong> è stata evidenziata nel testo con <strong>***asterischi***</strong> in grassetto.
            </p>
            <p style="margin-top: 15px; color: #ffa726; font-size: 0.95em;">
                💡 Leggi la fonte Wikipedia e aggiungi le nuove informazioni vicino alla keyword evidenziata per accrescere il capitale semantico!
            </p>
        `, "feedback");
    } else {
        // Fallback if no keyword
        showFeedback(`
            <h3 style="color: #4caf50;">📚 Fonte Aperta!</h3>
            <p style="margin-top: 15px; line-height: 1.8;">
                La fonte Wikipedia per <strong>${obj.name}</strong> è stata aperta in una nuova scheda.
            </p>
            <p style="margin-top: 15px; color: #ffa726; font-size: 0.95em;">
                💡 Leggi la fonte e aggiungi le nuove informazioni nel testo verificato!
            </p>
        `, "feedback");
    }
}

function showFeedback(html, type) {
    const modal = document.getElementById('feedbackModal');
    const content = document.getElementById('feedbackContent');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.className = `modal-content ${type}-modal`;
    content.innerHTML = html;
    modal.classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function updateStats() {
    document.getElementById('errorsFound').textContent = gameState.foundErrors.length;
    document.getElementById('errorsCorrected').textContent = gameState.correctedErrors.length;
    document.getElementById('actionsUsed').textContent = gameState.usedActions.length;
    
    // Update top-right SCU circle
    const scuCircle = document.getElementById('scuValue');
    if (scuCircle) scuCircle.textContent = gameState.scu;
    
    // Sync to Section 1 (Ascolto)
    const sec1Found = document.getElementById('errorsFoundSection1');
    const sec1Corrected = document.getElementById('errorsCorrectedSection1');
    const sec1SCU = document.getElementById('scuSection1');
    const gameStatus = document.getElementById('gameStatusMessage');
    
    if (sec1Found) sec1Found.textContent = gameState.foundErrors.length;
    if (sec1Corrected) sec1Corrected.textContent = gameState.correctedErrors.length;
    if (sec1SCU) sec1SCU.textContent = gameState.scu;
    
    if (gameStatus && gameState.selectedConstellation) {
        const c = CONSTELLATIONS[gameState.selectedConstellation];
        const totalErrors = c.errors.length;
        const found = gameState.foundErrors.length;
        const corrected = gameState.correctedErrors.length;
        
        if (corrected === totalErrors) {
            gameStatus.innerHTML = `
                🎉 <strong>Tutti gli errori corretti!</strong><br>
                Passa alla <strong>Sezione 2 (Verde)</strong> per arricchire il testo!
            `;
            gameStatus.style.color = '#4caf50';
        } else if (found > corrected) {
            gameStatus.innerHTML = `
                ⚡ <strong>Hai trovato ${found} errori ma ne hai corretti solo ${corrected}!</strong><br>
                Usa le <strong>Grounding Actions</strong> per correggere gli errori trovati.
            `;
            gameStatus.style.color = '#ffa726';
        } else if (found > 0) {
            gameStatus.innerHTML = `
                ✓ <strong>${corrected}/${totalErrors} errori corretti!</strong><br>
                Continua a cercare gli errori rimanenti nel testo LLM.
            `;
            gameStatus.style.color = '#64b5f6';
        } else {
            gameStatus.innerHTML = `
                👀 <strong>Analizza il testo LLM</strong> e identifica le allucinazioni!<br>
                Clicca sui token sospetti e marcali come <strong>Errore</strong>.
            `;
            gameStatus.style.color = '#ffcdd2';
        }
    }
}

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Image upload functions
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        displayImage(file);
    } else {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ Formato Non Valido</h3>
            <p style="margin-top: 15px;">
                Carica un'immagine in formato PNG, JPG, JPEG o WebP.
            </p>
        `, 'error');
    }
}

function handleImageDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('imageDropZone');
    dropZone.style.background = 'rgba(10, 14, 39, 0.5)';
    dropZone.style.borderColor = '#64b5f6';
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        displayImage(file);
    } else {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ Formato Non Valido</h3>
            <p style="margin-top: 15px;">
                Carica un'immagine in formato PNG, JPG, JPEG o WebP.
            </p>
        `, 'error');
    }
}

function displayImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImg = document.getElementById('previewImg');
        const imagePreview = document.getElementById('imagePreview');
        const scuRewardSection = document.getElementById('scuRewardSection');
        const dropZoneContent = document.getElementById('dropZoneContent');
        
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
        scuRewardSection.style.display = 'block';
        
        dropZoneContent.innerHTML = `
            <div style="font-size: 2.5em; margin-bottom: 10px;">✅</div>
            <p style="color: #4caf50; font-size: 1.1em; font-weight: 600;">
                Immagine caricata con successo!
            </p>
            <p style="color: #90caf9; font-size: 0.9em; margin-top: 10px;">
                Clicca per cambiare immagine
            </p>
        `;
        
        showFeedback(`
            <h3 style="color: #4caf50;">📸 Immagine Caricata!</h3>
            <p style="margin-top: 15px; line-height: 1.8;">
                La tua immagine generata è stata caricata con successo.
            </p>
            <p style="margin-top: 10px; color: #ffc107; font-weight: 600;">
                💰 Confrontala con i colleghi e poi inserisci i punti SCU assegnati!
            </p>
        `, 'feedback');
    };
    reader.readAsDataURL(file);
}

function addSemanticCapitalSCU() {
    const addScuBtn = document.getElementById('addScuBtn');
    const scuInput = document.getElementById('scuInputValue');
    
    if (addScuBtn.disabled) {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ SCU Già Aggiunti</h3>
            <p style="margin-top: 15px;">
                Hai già ricevuto i punti SCU per il capitale semantico!
            </p>
        `, 'error');
        return;
    }
    
    const scuToAdd = parseInt(scuInput.value) || 5;
    
    if (scuToAdd < 0 || scuToAdd > 20) {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ Valore Non Valido</h3>
            <p style="margin-top: 15px;">
                I punti SCU devono essere tra 0 e 20.
            </p>
        `, 'error');
        return;
    }
    
    gameState.scu += scuToAdd;
    document.getElementById('scuValue').textContent = gameState.scu;
    
    addScuBtn.disabled = true;
    addScuBtn.style.opacity = '0.5';
    addScuBtn.style.cursor = 'not-allowed';
    addScuBtn.innerHTML = `✅ SCU Aggiunti (+${scuToAdd})`;
    scuInput.disabled = true;
    scuInput.style.opacity = '0.5';
    
    showFeedback(`
        <h3 style="color: #4caf50;">💰 +${scuToAdd} SCU Aggiunti!</h3>
        <p style="margin-top: 15px; line-height: 1.8;">
            Complimenti! Hai guadagnato <strong>${scuToAdd} SCU</strong> grazie al tuo capitale semantico verificato.
        </p>
        <p style="margin-top: 15px; color: #ffc107; line-height: 1.8;">
            Il tuo capitale semantico ha reso unico il tuo prodotto! 
            Le differenze con i colleghi dimostrano il valore della conoscenza verificata.
        </p>
        <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(186, 104, 200, 0.2)); border-radius: 10px; border: 2px solid #9c27b0;">
            <p style="color: #ce93d8; font-weight: 600; margin-bottom: 15px;">
                ⚖️ <strong>Prossimo Passo: Responsabilità Etica</strong>
            </p>
            <p style="color: #e1bee7; line-height: 1.8; margin-bottom: 20px;">
                Ora spostiamoci alla <strong>Sezione 4 (Viola)</strong> per riflettere sulle responsabilità etiche dell'uso dell'AI generativa.
            </p>
            <button onclick="closeModal('feedbackModal'); document.getElementById('section-etica').scrollIntoView({behavior: 'smooth', block: 'start'});" 
                    style="padding: 12px 30px; background: linear-gradient(135deg, #9c27b0, #ba68c8); border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; font-size: 1em;">
                Vai alla Sezione 4 ⚖️
            </button>
        </div>
    `, 'feedback');
}

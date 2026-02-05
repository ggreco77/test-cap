// Knowledge Generation System

function triggerKnowledgeGeneration() {
    const c = CONSTELLATIONS[gameState.selectedConstellation];
    
    // Add 5 SCU bonus for completing all corrections
    gameState.scu += 5;
    updateStats();
    
    // Populate corrected text in Section 2 automatically
    const enrichedTextBox = document.getElementById('enrichedTextBox');
    if (enrichedTextBox && c.correctedText) {
        // Format the corrected text nicely
        let formattedText = `📖 ${c.name} - Testo Corretto e Verificato\n\n`;
        formattedText += `✅ Tutte le allucinazioni sono state corrette!\n\n`;
        formattedText += `🔭 TESTO CORRETTO:\n\n`;
        formattedText += c.correctedText;
        formattedText += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        formattedText += `📚 FONTI:\n\n`;
        formattedText += `Fonte originale: ${c.source}\n`;
        
        enrichedTextBox.value = formattedText;
        savedData.enriched = formattedText;
    }
    
    // Show simplified completion message
    showCompletionMessage(c);
}

function showCompletionMessage(constellation) {
    const modal = document.getElementById('knowledgeModal');
    const content = document.getElementById('knowledgeContent');
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 5em; margin-bottom: 10px;">🎉✅</div>
            <h2 style="color: #4caf50; margin: 0;">Tutte le Allucinazioni Corrette!</h2>
            <p style="color: #90caf9; margin-top: 10px; font-size: 1.1em;">
                Ottimo lavoro! Hai identificato e corretto tutti i ${constellation.errors.length} errori.
            </p>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2)); padding: 30px; border-radius: 10px; margin-bottom: 25px; border: 2px solid #4caf50; text-align: center;">
            <div style="font-size: 3em; margin-bottom: 15px;">💰</div>
            <h3 style="color: #4caf50; margin-bottom: 15px; font-size: 1.5em;">Capitale Semantico Aumentato!</h3>
            <p style="line-height: 1.8; font-size: 1.1em; margin-bottom: 20px;">
                Hai correttamente applicato il <strong>grounding</strong> alle allucinazioni trovate.
            </p>
            <div style="background: rgba(255, 215, 0, 0.3); padding: 20px; border-radius: 8px; display: inline-block;">
                <p style="color: #ffd700; font-size: 1.8em; font-weight: bold; margin: 0;">
                    +5 SCU
                </p>
                <p style="color: #e0e0e0; margin-top: 10px; font-size: 0.95em;">
                    Bonus per completamento
                </p>
            </div>
        </div>
        
        <div style="background: rgba(33, 150, 243, 0.15); padding: 25px; border-radius: 10px; border-left: 4px solid #2196f3;">
            <h3 style="color: #64b5f6; margin-bottom: 15px;">📖 Prossimo Passo</h3>
            <p style="line-height: 1.8; font-size: 1.05em;">
                Il <strong>testo corretto</strong> è stato automaticamente caricato nella <strong style="color: #66bb6a;">Sezione 2 (Verde) - Arricchimento</strong>.
            </p>
            <p style="line-height: 1.8; margin-top: 15px;">
                Vai alla Sezione 2 per visualizzare il testo corretto e arricchire ulteriormente il contenuto.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn-primary" onclick="document.getElementById('knowledgeModal').style.display='none'; document.getElementById('section-arricchimento').scrollIntoView({behavior: 'smooth', block: 'start'});" style="padding: 15px 40px; font-size: 1.1em;">
                Vai alla Sezione 2
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showSourceDateWarning() {
    showFeedback(`
        <h3 style="color: #ff9800;">⚠️ Attenzione: Fonte Obsoleta!</h3>
        
        <div style="background: rgba(255, 152, 0, 0.15); padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ff9800;">
            <p style="line-height: 1.8; margin-bottom: 15px;">
                La fonte INFN utilizzata in questo gioco riporta <strong>"circa 90 segnali"</strong> osservati da LIGO/Virgo.
            </p>
            <p style="line-height: 1.8; margin-bottom: 15px; color: #4caf50; font-weight: bold;">
                📊 Dato aggiornato: Il catalogo GWOSC contiene <strong>219 eventi</strong> al 2026.
            </p>
            <p style="line-height: 1.8; margin-bottom: 15px; color: #64b5f6;">
                🔗 Verifica: <a href="https://gwosc.org/eventapi/html/GWTC/" target="_blank" style="color: #90caf9; text-decoration: underline;">https://gwosc.org/eventapi/html/GWTC/</a>
            </p>
        </div>
        
        <div style="background: rgba(33, 150, 243, 0.15); padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #2196f3;">
            <h4 style="color: #64b5f6; margin-bottom: 15px;">📚 Lezione Importante</h4>
            <p style="line-height: 1.8; margin-bottom: 15px;">
                <strong>Verificare sempre con attenzione:</strong>
            </p>
            <ul style="line-height: 2; margin-left: 20px; color: #90caf9;">
                <li><strong>La data delle fonti</strong> utilizzate per verificare informazioni</li>
                <li><strong>La data dell'ultimo training del modello LLM</strong> che si sta usando</li>
            </ul>
            <p style="line-height: 1.8; margin-top: 15px; color: #e0e0e0;">
                Per avere informazioni aggiornate in <strong>real-time</strong>, gli LLM necessitano di tecnologie come la <strong>RAG (Retrieval-Augmented Generation)</strong>, che recupera informazioni da database aggiornati durante la generazione della risposta.
            </p>
        </div>
        
        <div style="background: rgba(156, 39, 176, 0.15); padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
            <p style="color: #ce93d8; font-size: 0.95em; margin: 0;">
                💡 <strong>In questo gioco:</strong> Hai correttamente identificato "90 segnali" come dato presente nella fonte INFN, 
                ma ricorda che la fonte stessa è del 2023 e quindi obsoleta rispetto ai dati reali del 2026.
            </p>
        </div>
    `, "feedback");
}

function generateInsight(errorTypes, constellationName) {
    // Advanced insights based on cross-pattern analysis
    const insights = {
        entity_error: {
            pattern: "Messier Object Confusion Network",
            observation: `In ${constellationName}, l'LLM ha confuso M13/M52 - entrambi ammassi ma in costellazioni diverse (Ercole vs Cassiopea, 60° di distanza angolare).`,
            hypothesis: `**Scoperta interessante**: Gli LLM costruiscono un "confusion graph" degli oggetti Messier dove la probabilità di confusione P(Ma|Mb) è proporzionale alla similarity degli attributi fisici ma INVERSAMENTE proporzionale alla distanza spaziale. Formula ipotizzata:
            
            P(confusion) ∝ cos_sim(attr_a, attr_b) / angular_distance(Ra, Rb)
            
            Questo spiega perché M31 e M42 (entrambi "visibili ad occhio nudo, famosi") vengono confusi nonostante siano galassia vs nebulosa.`,
            verification: `Test critico: Creare dataset di triple (oggetto_corretto, oggetto_confuso, distanza_angolare) da output LLM su tutte le 88 costellazioni. Se l'ipotesi è vera, dovremmo vedere clustering di confusioni per coppie con alta similarity semantica E bassa distanza angolare. Predizione: M33 (Galassia del Triangolo) sarà confusa con M31 più spesso di quanto M87 sia confusa con M31, nonostante tutte e tre siano galassie.`,
            breakthrough: "🔥 Se confermato, questo suggerisce che gli LLM usano una rappresentazione spaziale-semantica IBRIDA ma con grave deficit nel grounding spaziale. Possibile soluzione: injection di coordinate celesti come embeddings espliciti durante fine-tuning.",
            paperSection: "Anh-Hoang D, Tran V, Nguyen LM, 2025 - Entity-Level Hallucination + estensione con spatial grounding"
        },
        numerical_hallucination: {
            pattern: "Stochastic Collapse Syndrome",
            observation: `In ${constellationName}, TUTTE le stelle variabili (Betelgeuse 0.0-1.6, Gamma Cas 1.6-3.0) sono state ridotte a valori singoli fissi.`,
            hypothesis: `**Insight profondo**: Gli LLM hanno una "probabilistic bottleneck" nel layer di output. Durante sampling con temperature T, la probabilità di generare una SEQUENZA come "varia tra X e Y" è:
            
            P("varia tra X e Y") = P("varia") × P("tra"|"varia") × P("X"|context) × P("e"|context) × P("Y"|context)
            
            vs generare un singolo numero:
            P("magnitudine Z") = P("magnitudine") × P("Z"|"magnitudine")
            
            La prima ha complessità O(n) tokens, la seconda O(1). Con temperature standard (0.7-1.0), il modello preferisce PATH PIÙ BREVI anche se meno accurati.`,
            verification: `Esperimento decisivo: Fine-tune LLM con loss function modificata che PENALIZZA deterministic outputs per variabili note variabili. Formula: L = L_standard + λ × Δ(output_variance, true_variance). Misurare se questo riduce il collasso deterministico senza degradare performance generale. Testare su: stelle variabili, orbite eccentriche, distanze con errore di misura.`,
            breakthrough: "💡 Questo rivela un trade-off fondamentale: Gli LLM sono ottimizzati per BREVITÀ (token efficiency) non per ACCURATEZZA EPISTEMICA. La soluzione richiede riscrivere la loss function per includere penalità su information loss.",
            paperSection: "Anh-Hoang D, Tran V, Nguyen LM, 2025 - Numerical Hallucination + analisi information-theoretic"
        },
        relation_error: {
            pattern: "Narrative Arc Inversion",
            observation: `In ${constellationName}, relazioni negative (Orione→ucciso, Cassiopea→punita) sono state sistematicamente invertite in positive (Orione→trionfò, Cassiopea→ricompensata).`,
            hypothesis: `**Pattern critico**: Analizzando il training corpus, ipotizziamo che gli LLM hanno appreso una "narrative completion heuristic":
            
            IF [protagonist] AND [conflict] THEN P(positive_resolution) > P(negative_resolution)
            
            Questo bias è rinforzato da tre fattori:
            1. **Modern storytelling bias**: 80%+ delle narrative moderne hanno risoluzioni positive (Hollywood effect)
            2. **RLHF preference data**: Gli umani preferiscono output "upliftiting" durante labeling
            3. **Imbalanced training**: Miti tragici sono sotto-rappresentati vs. storie moderne nel corpus
            
            Formula quantitativa: P(invert_relation) ≈ sentiment_score(protagonist) × corpus_frequency(happy_endings)`,
            verification: `Test multi-culturale: Applicare l'LLM a miti di culture NON occidentali (giapponesi, africani, nativi americani) che hanno diversi rapporti tragedia/trionfo. Se l'ipotesi è corretta, dovremmo vedere MENO inversioni per culture con più narrazioni tragiche nel training corpus. Controllo: Misurare distribution di positive/negative resolutions in dataset by-culture.`,
            breakthrough: "🎭 Scoperta: Gli LLM non hanno solo 'positivity bias' - hanno LEARNED NARRATIVE TEMPLATES che sovra-generalizzano. Questo implica che il debiasing richiede non solo re-weighting dei dati ma STRUCTURAL changes nel modo in cui gli LLM rappresentano archi narrativi.",
            paperSection: "Ji et al. (2023) - Section 3.1: Relation-Level Hallucination + narrative structure analysis"
        },
        intrinsic_factual: {
            pattern: "Knowledge Graph Disconnection",
            observation: `In ${constellationName}, l'LLM ha generato fatti che CONTRADDICONO esplicitamente la knowledge base verificata (es. "M42 è in Andromeda" quando KG dice "M42 in Orione").`,
            hypothesis: `**Meccanismo scoperto**: Durante inference, gli LLM fanno un "knowledge source selection" tra:
            1. Parametric memory (pesi del modello)
            2. Retrieved context (RAG, knowledge base)
            
            Il problema: Quando parametric prior P(fact|params) è STRONG (alta confidence da training), domina sul retrieved context anche quando retrieved è CORRETTO. Formula:
            
            P(output) = α × P_parametric + (1-α) × P_retrieved
            
            dove α aumenta con confidence parametrica. Per fatti astronomici comuni (M42, Betelgeuse), α → 1, causando IGNORANCE del retrieval.`,
            verification: `Esperimento con probe: Iniettare CONTRADICTING context deliberatamente nel prompt (es. "Dato che M42 è in Andromeda...") e misurare con quale frequenza l'LLM lo accetta vs. lo corregge. Se α >> 0.5 per fatti common, l'LLM IGNORA il context. Test su gradienti di commonality: oggetti oscuri (NGC 7789) vs famosi (M42).`,
            breakthrough: "⚡ Implicazione: Il problema NON è mancanza di knowledge ma FAILURE nel grounding mechanism. Gli LLM hanno i fatti ma non sanno QUANDO fidarsi della knowledge base vs. parametric memory. Fix: attention mechanism modificato che aumenta peso retrieval quando source è high-confidence (es. peer-reviewed catalog).",
            paperSection: "Ji et al. (2023) - Table 1: Intrinsic Hallucination + RAG failure analysis"
        },
        extrinsic_factual: {
            pattern: "Plausibility Cascade",
            observation: `In ${constellationName}, l'LLM ha AGGIUNTO dettagli mai menzionati nella fonte (distanze, magnitudini, scoperte) ma che suonano plausibili.`,
            hypothesis: `**Fenomeno: "Semantic Infilling"**: Gli LLM riempiono gaps informativi con token ad alta probabilità condizionale. Processo:
            
            1. Context fornisce slot: "Betelgeuse ha magnitudine ___"
            2. LLM samples da P(magnitude|"Betelgeuse", context)
            3. Se source NON specifica, LLM genera MOST LIKELY value dal training
            4. Problema: "most likely" ≠ "factually correct"
            
            Insight: Gli LLM non distinguono tra:
            - "Non so" (epistemic uncertainty)
            - "Probabilmente X" (high P but unverified)
            - "Certamente X" (verified fact)`,
            verification: `Test con uncertainty quantification: Modificare LLM per output confidence scores. Predizione: Per extrinsic hallucinations, confidence sarà ALTA (>0.8) perché il modello è "convinto" delle sue invenzioni. Testare con: forced abstention training ("Rispondere 'non specificato' se incerto") e misurare se riduce extrinsic hallucinations senza danneggiare recall.`,
            breakthrough: "🎯 Rivelazione: Il problema è epistemologico, non tecnico. Gli LLM non hanno concetto di 'fonte di verità'. Ogni generazione è equivalente (parametric = retrieved = invented). Soluzione radicale: Architettura con EXPLICIT SOURCE TRACKING per ogni token generato.",
            paperSection: "Ji et al. (2023) - Table 1: Extrinsic Hallucination + epistemic uncertainty"
        }
    };
    
    // Find dominant error type
    const dominantType = errorTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    
    const mainType = Object.keys(dominantType).sort((a, b) => dominantType[b] - dominantType[a])[0];
    
    return {
        ...insights[mainType],
        errorCount: errorTypes.length,
        correctionCount: gameState.correctedErrors.length,
        constellation: constellationName,
        types: errorTypes,
        crossConstellationPrediction: generateCrossConstellationPrediction(mainType)
    };
}

function generateCrossConstellationPrediction(errorType) {
    const predictions = {
        entity_error: "Predizione testabile: Se passi a Orsa Maggiore, l'LLM confonderà M81 (galassia) con M51 (galassia Whirlpool) più spesso di quanto confonda M81 con M13 (ammasso globulare in Ercole), nonostante M13 sia più famoso.",
        numerical_hallucination: "Predizione: In Lyra, Vega (stella stabile, mag 0.03) verrà descritta correttamente con valore fisso, ma RR Lyrae (variabile prototipo) verrà probabilmente descritta con magnitudine fissa errata. Test: verificare!",
        relation_error: "Predizione: Nel mito di Perseo-Andromeda, l'LLM probabilmente descriverà Perseo come 'liberatore eroico' invece che come 'responsible for Medusa's death' - stesso pattern di inversione morale.",
        intrinsic_factual: "Predizione: Per NGC objects oscuri, l'LLM farà MENO intrinsic errors perché parametric memory è debole. Test: NGC 7789 vs M42 - quale ha più contraddizioni?",
        extrinsic_factual: "Predizione: Stelle binarie avranno più extrinsic hallucinations (periodi orbitali inventati) perché sono parametri comuni ma specifici a ogni sistema."
    };
    return predictions[errorType] || "Test altre costellazioni per pattern simili.";
}


function showKnowledgeGeneration(insight) {
    const modal = document.getElementById('knowledgeModal');
    const content = document.getElementById('knowledgeContent');
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 5em; margin-bottom: 10px;">🎉✅</div>
            <h2 style="color: #4caf50; margin: 0;">Tutte le Allucinazioni Corrette!</h2>
            <p style="color: #90caf9; margin-top: 10px; font-size: 1.1em;">
                Ottimo lavoro! Hai identificato e corretto tutti gli ${insight.errorCount} errori.
            </p>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2)); padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 2px solid #4caf50;">
            <h3 style="color: #4caf50; margin-bottom: 15px; text-align: center;">✨ Capitale Semantico Aumentato!</h3>
            <p style="line-height: 1.8; text-align: center; font-size: 1.05em;">
                Hai correttamente applicato il <strong>grounding</strong> alle allucinazioni trovate.
                Il testo LLM è stato trasformato da contenuto con errori a conoscenza verificata.
            </p>
        </div>
        
        <div style="background: rgba(33, 150, 243, 0.15); padding: 25px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
            <h3 style="color: #64b5f6; margin-bottom: 15px;">📖 Prossimo Passo</h3>
            <p style="line-height: 1.8; font-size: 1.05em;">
                Ora il <strong>testo corretto</strong> è stato automaticamente caricato nella <strong style="color: #66bb6a;">Sezione 2 (Verde) - Arricchimento</strong>.
            </p>
            <p style="line-height: 1.8; margin-top: 15px;">
                Vai alla Sezione 2 per:
            </p>
            <ul style="line-height: 2; margin-left: 20px; margin-top: 10px; color: #90caf9;">
                <li>Visualizzare il testo corretto con gli oggetti celesti</li>
                <li>Arricchire ulteriormente il contenuto</li>
                <li>Aumentare il tuo capitale semantico</li>
            </ul>
        </div>
        
        <div style="background: rgba(255, 193, 7, 0.15); padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px dashed #ffc107;">
            <h3 style="color: #ffa726; margin-bottom: 15px;">🧠 Insight Scientifico Generato</h3>
            <p style="color: #b0b0b0; font-size: 0.95em; line-height: 1.8;">
                <strong>Pattern:</strong> ${insight.pattern}<br>
                <strong>Da:</strong> ${insight.constellation} (${insight.errorCount} errori corretti)
            </p>
        </div>
        
        <div style="background: rgba(100, 181, 246, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #64b5f6; margin-bottom: 15px;">🔍 Osservazione Dettagliata</h3>
            <p style="line-height: 1.8;">${insight.observation}</p>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(139, 195, 74, 0.15)); padding: 25px; border-radius: 10px; margin-bottom: 20px; border: 2px solid rgba(76, 175, 80, 0.5);">
            <h3 style="color: #4caf50; margin-bottom: 15px;">💡 Ipotesi & Meccanismo</h3>
            <div style="line-height: 2; white-space: pre-line;">${insight.hypothesis}</div>
        </div>
        
        <div style="background: rgba(255, 87, 34, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ff5722;">
            <h3 style="color: #ff5722; margin-bottom: 15px;">🔥 Breakthrough Implication</h3>
            <p style="line-height: 1.8; font-size: 1.05em; font-weight: 500;">${insight.breakthrough}</p>
        </div>
        
        <div style="background: rgba(255, 152, 0, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #ff9800; margin-bottom: 15px;">✓ Esperimento di Verifica</h3>
            <p style="line-height: 1.8;">${insight.verification}</p>
        </div>
        
        <div style="background: rgba(156, 39, 176, 0.15); padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px dashed #9c27b0;">
            <h3 style="color: #ce93d8; margin-bottom: 15px;">🎯 Predizione Cross-Constellation</h3>
            <p style="line-height: 1.8; font-style: italic;">${insight.crossConstellationPrediction}</p>
        </div>
        
        <div style="background: rgba(156, 39, 176, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 3px solid #9c27b0;">
            <p style="color: #ce93d8; font-size: 0.9em;">
                <strong>📚 Riferimento:</strong> ${insight.paperSection}
            </p>
        </div>
        
        <div style="background: rgba(33, 150, 243, 0.1); padding: 15px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <p style="color: #64b5f6; font-size: 0.95em; line-height: 1.6;">
                <strong>⚡ Capitale Semantico Espanso!</strong><br>
                Questa conoscenza predice errori in altre costellazioni e può guidare fix architetturali.
            </p>
        </div>
        
        <div style="margin-top: 25px; display: flex; gap: 10px;">
            <button class="btn-primary" onclick="validateKnowledge(true)" 
                    style="flex: 1; background: linear-gradient(135deg, #4caf50, #66bb6a);">
                ✓ Valida & Salva Insight
            </button>
            <button class="btn-primary" onclick="validateKnowledge(false)" 
                    style="flex: 1; background: linear-gradient(135deg, #f44336, #e57373);">
                ✗ Necessita Ulteriore Verifica
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

function validateKnowledge(accepted) {
    if (accepted) {
        showFeedback(`
            <h3 style="color: #4caf50;">✅ Conoscenza Validata!</h3>
            <p style="margin-top: 15px;">
                Il pattern è stato aggiunto al capitale semantico.
            </p>
            <p style="margin-top: 10px; color: #90caf9;">
                Ora puoi applicare questa conoscenza ad altre costellazioni!
            </p>
        `, 'feedback');
    } else {
        showFeedback(`
            <h3 style="color: #ff9800;">⚠️ Conoscenza Rifiutata</h3>
            <p style="margin-top: 15px;">
                Il pattern necessita ulteriore verifica.
            </p>
        `, 'error');
    }
    
    closeModal('knowledgeModal');
    
    // Update stats
    if (accepted) {
        const stats = document.querySelector('.stat-value[style*="color: #ffd700"]');
        if (stats && stats.id !== 'scuDisplay') {
            const current = parseInt(stats.textContent) || 0;
            stats.textContent = current + 1;
        }
    }
}

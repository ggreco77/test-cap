// Balance Game for Ethical Responsibility

const ethicalStatements = [
    // TRUE STATEMENTS (have weight)
    { id: 1, text: "Dichiarare sempre quando si usa un LLM", weight: 20, isTrue: true, category: "Trasparenza" },
    { id: 2, text: "Verificare informazioni critiche con fonti primarie", weight: 25, isTrue: true, category: "Verifica" },
    { id: 3, text: "Citare le fonti del capitale semantico", weight: 20, isTrue: true, category: "Attribuzione" },
    { id: 4, text: "Assumere responsabilità dell'output finale", weight: 25, isTrue: true, category: "Responsabilità" },
    { id: 5, text: "Fornire capitale semantico verificato come contesto", weight: 10, isTrue: true, category: "Grounding" },
    
    // FALSE STATEMENTS (no weight - balloons)
    { id: 6, text: "Gli LLM sono sempre affidabili", weight: 0, isTrue: false, category: "Misconcezione" },
    { id: 7, text: "Non serve verificare output di GPT-4", weight: 0, isTrue: false, category: "Misconcezione" },
    { id: 8, text: "L'AI è neutrale e senza bias", weight: 0, isTrue: false, category: "Misconcezione" },
    { id: 9, text: "La responsabilità è solo di chi sviluppa l'AI", weight: 0, isTrue: false, category: "Misconcezione" },
    { id: 10, text: "I contenuti generati da AI sono sempre originali", weight: 0, isTrue: false, category: "Misconcezione" }
];

const balanceState = {
    leftWeight: 0,
    rightWeight: 0,
    placedStatements: {
        left: [],
        right: []
    }
};

function initBalanceGame() {
    const pool = document.getElementById('statementPool');
    if (!pool) return;
    
    // Shuffle statements
    const shuffled = [...ethicalStatements].sort(() => Math.random() - 0.5);
    
    pool.innerHTML = shuffled.map(stmt => `
        <div class="statement-card ${stmt.isTrue ? 'true-statement' : 'false-statement'}" 
             data-id="${stmt.id}"
             draggable="true"
             ondragstart="dragStart(event)">
            <div style="font-size: 0.95em; line-height: 1.5; color: #e0e0e0; margin-bottom: 8px;">
                ${stmt.text}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85em;">
                <span style="color: #90caf9;">${stmt.category}</span>
                ${stmt.weight > 0 ? `<span class="statement-weight">⚖️ ${stmt.weight}kg</span>` : `<span class="statement-weight">🎈 0kg</span>`}
            </div>
        </div>
    `).join('');
    
    // Setup drop zones
    document.getElementById('leftPlate').addEventListener('dragover', dragOver);
    document.getElementById('leftPlate').addEventListener('drop', (e) => dropOnPlate(e, 'left'));
    
    document.getElementById('rightPlate').addEventListener('dragover', dragOver);
    document.getElementById('rightPlate').addEventListener('drop', (e) => dropOnPlate(e, 'right'));
}

let draggedStatement = null;

function dragStart(event) {
    const card = event.target.closest('.statement-card');
    if (card.classList.contains('placed')) {
        event.preventDefault();
        return;
    }
    
    draggedStatement = parseInt(card.dataset.id);
    event.dataTransfer.effectAllowed = 'move';
    card.style.opacity = '0.5';
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function dropOnPlate(event, side) {
    event.preventDefault();
    
    if (!draggedStatement) return;
    
    const statement = ethicalStatements.find(s => s.id === draggedStatement);
    if (!statement) return;
    
    // Add to plate
    balanceState.placedStatements[side].push(statement);
    
    // Update weights
    if (side === 'left') {
        balanceState.leftWeight += statement.weight;
    } else {
        balanceState.rightWeight += statement.weight;
    }
    
    // Mark card as placed
    const card = document.querySelector(`[data-id="${draggedStatement}"]`);
    card.classList.add('placed');
    card.style.opacity = '0.5';
    card.draggable = false;
    
    // Add to plate content
    const plateContent = document.getElementById(`${side}PlateContent`);
    const statementEl = document.createElement('div');
    statementEl.className = 'placed-statement';
    statementEl.style.color = statement.isTrue ? '#4caf50' : '#f44336';
    statementEl.textContent = statement.text;
    plateContent.appendChild(statementEl);
    
    draggedStatement = null;
    updateBalance();
}

function updateBalance() {
    const totalWeight = balanceState.leftWeight + balanceState.rightWeight;
    const maxWeight = 100; // Sum of all true statement weights
    
    // Calculate balance percentage
    const balancePercent = Math.min(100, Math.round((totalWeight / maxWeight) * 100));
    
    // Calculate tilt angle (-15 to +15 degrees)
    const weightDiff = balanceState.leftWeight - balanceState.rightWeight;
    const angle = Math.max(-15, Math.min(15, weightDiff / 5));
    
    // Update beam rotation
    const beam = document.getElementById('balanceBeam');
    beam.style.transform = `translateX(-50%) rotate(${-angle}deg)`;
    
    // Update percentage display
    document.getElementById('balancePercent').textContent = `${balancePercent}%`;
    
    // Update emoji based on balance
    const emoji = document.getElementById('balanceEmoji');
    if (balancePercent === 100 && Math.abs(angle) < 3) {
        emoji.textContent = '🎉';
        unlockEthicsBox();
    } else if (balancePercent >= 80) {
        emoji.textContent = '😊';
    } else if (balancePercent >= 50) {
        emoji.textContent = '🤔';
    } else {
        emoji.textContent = '😟';
    }
    
    // Color based on progress
    const percentEl = document.getElementById('balancePercent');
    if (balancePercent === 100) {
        percentEl.style.color = '#4caf50';
    } else if (balancePercent >= 70) {
        percentEl.style.color = '#ffd700';
    } else {
        percentEl.style.color = '#f44336';
    }
}

function unlockEthicsBox() {
    const box = document.getElementById('ethicsBox');
    if (box && box.style.display === 'none') {
        box.style.display = 'block';
        
        // Generate summary of ethical statements
        const summary = balanceState.placedStatements.left
            .concat(balanceState.placedStatements.right)
            .filter(s => s.isTrue)
            .map(s => `- ${s.text} (${s.category})`)
            .join('\n');
        
        const textarea = document.getElementById('ethicsTextBox');
        if (textarea) {
            textarea.value = textarea.placeholder.replace('${generateEthicalSummary()}', summary);
        }
        
        showFeedback(`
            <h3 style="color: #4caf50;">🎉 Bilancia Equilibrata!</h3>
            <p style="margin-top: 15px;">Hai dimostrato comprensione delle responsabilità etiche.</p>
            <p style="margin-top: 10px; color: #90caf9;">
                La caption etica è stata sbloccata! Modificala e salvala per le tue immagini generate.
            </p>
        `, 'feedback');
        
        // Scroll to ethics box
        setTimeout(() => {
            box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }
}

function generateEthicalSummary() {
    return balanceState.placedStatements.left
        .concat(balanceState.placedStatements.right)
        .filter(s => s.isTrue)
        .map(s => `- ${s.text} (${s.category})`)
        .join('\n');
}

// Initialize when section is visible
document.addEventListener('DOMContentLoaded', () => {
    initBalanceGame();
});

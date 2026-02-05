// Manifesto Management

// Save manifesto to localStorage
function saveManifesto() {
    const text = document.getElementById('manifestoText').value.trim();
    
    if (!text) {
        showManifestoFeedback('⚠️ Scrivi il tuo manifesto prima di salvare!', 'warning');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('semantic_manifesto', text);
    localStorage.setItem('semantic_manifesto_date', new Date().toISOString());
    
    showManifestoFeedback('✅ Manifesto salvato con successo!', 'success');
}

// Download manifesto as TXT file
function downloadManifesto() {
    const text = document.getElementById('manifestoText').value.trim();
    
    if (!text) {
        showManifestoFeedback('⚠️ Scrivi il tuo manifesto prima di scaricarlo!', 'warning');
        return;
    }
    
    // Create file content with header
    const date = new Date().toLocaleDateString('it-IT', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const fileContent = `MANIFESTO DELL'INGEGNERIA SEMANTICA
${date}
Capitale Semantico - Progetto Educativo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questo manifesto è stato creato dopo aver completato il percorso 
"Il Capitale Semantico - Dal prompt alla responsabilità etica"

Scopri di più su: https://capitale-semantico.org
`;
    
    // Create blob and download
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifesto-ingegneria-semantica-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showManifestoFeedback('📥 Manifesto scaricato!', 'success');
}

// Clear manifesto
function clearManifesto() {
    if (confirm('Vuoi davvero cancellare il tuo manifesto? Questa azione non può essere annullata.')) {
        document.getElementById('manifestoText').value = '';
        localStorage.removeItem('semantic_manifesto');
        localStorage.removeItem('semantic_manifesto_date');
        showManifestoFeedback('🔄 Manifesto cancellato. Inizia da capo!', 'info');
    }
}

// Show feedback message
function showManifestoFeedback(message, type) {
    const feedback = document.getElementById('manifestoFeedback');
    feedback.style.display = 'block';
    feedback.textContent = message;
    
    // Set colors based on type
    const colors = {
        success: { bg: 'rgba(76, 175, 80, 0.2)', border: '#4caf50', text: '#4caf50' },
        warning: { bg: 'rgba(255, 152, 0, 0.2)', border: '#ff9800', text: '#ff9800' },
        error: { bg: 'rgba(244, 67, 54, 0.2)', border: '#f44336', text: '#f44336' },
        info: { bg: 'rgba(33, 150, 243, 0.2)', border: '#2196f3', text: '#2196f3' }
    };
    
    const color = colors[type] || colors.info;
    feedback.style.background = color.bg;
    feedback.style.border = `2px solid ${color.border}`;
    feedback.style.color = color.text;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// Load saved manifesto on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedManifesto = localStorage.getItem('semantic_manifesto');
    if (savedManifesto) {
        document.getElementById('manifestoText').value = savedManifesto;
        
        const savedDate = localStorage.getItem('semantic_manifesto_date');
        if (savedDate) {
            const date = new Date(savedDate).toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            showManifestoFeedback(`📂 Manifesto caricato (salvato il ${date})`, 'info');
        }
    }
});

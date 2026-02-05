// Semantic Search Space Visualization

let canvas, ctx;
let searchSpace = {
    semanticQuery: { x: 0, y: 0, text: '' },
    candidates: [],
    groundedResults: [],
    searchPath: []
};

function initLatentSpace() {
    canvas = document.getElementById('latentSpace');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    drawLatentSpace();
}

function updateLatentSpace() {
    if (!canvas || !ctx) return;
    
    const c = CONSTELLATIONS[gameState.selectedConstellation];
    if (!c) return;
    
    const totalErrors = c.errors.length;
    
    // Semantic query (what LLM is searching for)
    searchSpace.semanticQuery = {
        x: canvas.width * 0.1,
        y: canvas.height * 0.5,
        text: 'Query LLM',
        color: '#ff9800'
    };
    
    // Candidate results (what LLM retrieves from memory)
    searchSpace.candidates = c.errors.map((err, i) => {
        const found = gameState.foundErrors.includes(i);
        return {
            x: canvas.width * (0.35 + i * 0.12),
            y: canvas.height * (0.3 + Math.sin(i) * 0.15),
            text: err.text,
            correct: err.correct,
            isFound: found,
            color: found ? '#ff5722' : '#90caf9',
            size: found ? 20 : 15
        };
    });
    
    // Grounded results (corrected with semantic capital)
    searchSpace.groundedResults = gameState.correctedErrors.map((errorIdx, i) => {
        const err = c.errors[errorIdx];
        return {
            x: canvas.width * 0.85,
            y: canvas.height * (0.25 + i * 0.2),
            text: err.correct,
            color: '#4caf50',
            size: 18
        };
    });
    
    // Search path (query → candidates → grounded)
    searchSpace.searchPath = [];
    if (gameState.foundErrors.length > 0) {
        const lastFound = gameState.foundErrors[gameState.foundErrors.length - 1];
        searchSpace.searchPath.push({
            from: searchSpace.semanticQuery,
            to: searchSpace.candidates[lastFound],
            color: '#ff9800',
            label: 'Retrieval'
        });
    }
    
    if (gameState.correctedErrors.length > 0) {
        gameState.correctedErrors.forEach((errorIdx, i) => {
            searchSpace.searchPath.push({
                from: searchSpace.candidates[errorIdx],
                to: searchSpace.groundedResults[i],
                color: '#4caf50',
                label: i === 0 ? 'Grounding' : null
            });
        });
    }
    
    drawLatentSpace();
}

function drawLatentSpace() {
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw three columns with labels
    // Left: Query Space
    ctx.fillStyle = 'rgba(255, 152, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width * 0.2, canvas.height);
    ctx.fillStyle = '#ff9800';
    ctx.font = 'bold 12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('🔍 QUERY', canvas.width * 0.1, 25);
    ctx.font = '10px Segoe UI';
    ctx.fillText('Ricerca LLM', canvas.width * 0.1, 40);
    
    // Middle: Candidate Space
    ctx.fillStyle = 'rgba(144, 202, 249, 0.05)';
    ctx.fillRect(canvas.width * 0.2, 0, canvas.width * 0.5, canvas.height);
    ctx.fillStyle = '#90caf9';
    ctx.font = 'bold 12px Segoe UI';
    ctx.fillText('📚 FONTI VERIFICATE', canvas.width * 0.45, 25);
    ctx.font = '10px Segoe UI';
    ctx.fillText('Articoli peer-reviewed, Papers con referee', canvas.width * 0.45, 40);
    
    // Right: Grounded Space
    ctx.fillStyle = 'rgba(76, 175, 80, 0.05)';
    ctx.fillRect(canvas.width * 0.7, 0, canvas.width * 0.3, canvas.height);
    ctx.fillStyle = '#4caf50';
    ctx.font = 'bold 12px Segoe UI';
    ctx.fillText('✓ GROUNDED', canvas.width * 0.85, 25);
    ctx.font = '10px Segoe UI';
    ctx.fillText('Capitale Semantico', canvas.width * 0.85, 40);
    
    // Draw search paths
    searchSpace.searchPath.forEach(path => {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        
        // Curved path
        ctx.beginPath();
        ctx.moveTo(path.from.x, path.from.y);
        
        const midX = (path.from.x + path.to.x) / 2;
        const midY = (path.from.y + path.to.y) / 2 - 30;
        ctx.quadraticCurveTo(midX, midY, path.to.x, path.to.y);
        ctx.stroke();
        
        // Arrow
        const angle = Math.atan2(path.to.y - midY, path.to.x - midX);
        drawArrow(path.to.x, path.to.y, angle, path.color);
        
        // Label
        if (path.label) {
            ctx.fillStyle = path.color;
            ctx.font = 'italic 11px Segoe UI';
            ctx.textAlign = 'center';
            ctx.fillText(path.label, midX, midY - 5);
        }
    });
    
    // Draw query node
    if (searchSpace.semanticQuery.x > 0) {
        drawNode(
            searchSpace.semanticQuery.x,
            searchSpace.semanticQuery.y,
            searchSpace.semanticQuery.color,
            25,
            searchSpace.semanticQuery.text,
            true
        );
    }
    
    // Draw candidate nodes
    searchSpace.candidates.forEach(node => {
        drawNode(node.x, node.y, node.color, node.size, node.text, false);
        
        // Show if found but not corrected
        if (node.isFound && !searchSpace.groundedResults.find(g => g.text === node.correct)) {
            // Pulsing red border
            const pulse = Math.sin(Date.now() / 300) * 3;
            ctx.strokeStyle = '#f44336';
            ctx.lineWidth = 2 + pulse;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size + 8, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
    
    // Draw grounded results
    searchSpace.groundedResults.forEach(node => {
        drawNode(node.x, node.y, node.color, node.size, node.text, false);
        
        // Success glow
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    });
    
    // Draw progress indicator
    const progress = searchSpace.groundedResults.length;
    const total = searchSpace.candidates.length;
    
    if (progress > 0) {
        ctx.fillStyle = 'rgba(76, 175, 80, 0.2)';
        ctx.fillRect(0, canvas.height - 30, (canvas.width * progress) / total, 30);
        
        ctx.fillStyle = '#4caf50';
        ctx.font = 'bold 14px Segoe UI';
        ctx.textAlign = 'left';
        ctx.fillText(`Grounding Progress: ${progress}/${total}`, 10, canvas.height - 10);
    }
}

function drawNode(x, y, color, size, text, pulse = false) {
    if (!ctx) return;
    
    // Pulsing effect
    if (pulse) {
        const p = Math.sin(Date.now() / 400) * 3;
        size = size + p;
    }
    
    // Outer ring
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, size + 2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Main circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Highlight
    ctx.beginPath();
    ctx.arc(x - size/3, y - size/3, size/3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
    
    // Text label
    if (text) {
        ctx.fillStyle = '#fff';
        ctx.font = '11px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y + size + 15);
    }
}

function drawArrow(x, y, angle, color) {
    const size = 10;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
        x - size * Math.cos(angle - Math.PI / 6),
        y - size * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        x - size * Math.cos(angle + Math.PI / 6),
        y - size * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}

// Animation
let animationFrame;
function animateLatentSpace() {
    if (!canvas) return;
    drawLatentSpace();
    animationFrame = requestAnimationFrame(animateLatentSpace);
}

window.addEventListener('load', () => {
    initLatentSpace();
    animateLatentSpace();
});



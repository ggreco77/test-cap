// Main initialization

document.addEventListener('DOMContentLoaded', () => {
    // Render constellations (disable multimessenger for now)
    document.getElementById('constellations').innerHTML = Object.keys(CONSTELLATIONS).map(key => {
        const isDisabled = key === 'multimessenger';
        const disabledClass = isDisabled ? ' disabled' : '';
        const disabledAttr = isDisabled ? ' style="opacity: 0.4; cursor: not-allowed; pointer-events: none;"' : '';
        const label = isDisabled ? ' (In arrivo)' : '';
        return `<div class="constellation-btn${disabledClass}" onclick="selectConstellation('${key}')"${disabledAttr}>${CONSTELLATIONS[key].name}${label}</div>`;
    }).join('');

    // Render grounding actions
    document.getElementById('cards').innerHTML = GROUNDING_ACTIONS.map(action =>
        `<div class="card" data-action="${action.id}" onclick="showActionInfo('${action.id}')">
            <div class="card-icon">${action.icon}</div>
            <div style="font-weight: bold; margin: 5px 0; color: #90caf9;">${action.title}</div>
            <div style="font-size: 0.85em; color: #b0b0b0;">${action.description}</div>
        </div>`
    ).join('');
    
    // Initialize latent space
    initLatentSpace();
    
    console.log('🌌 Semantic Capital Game initialized');
    console.log('✅ NO SCU loss for identifying tokens correctly!');
    console.log('❌ SCU loss ONLY when using wrong Grounding Action');
});

// Theme Toggle (Dark/Light Mode)
let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (isDarkMode) {
        // Switch to Light Mode
        body.style.background = 'linear-gradient(180deg, #f5f5f5, #ffffff)';
        body.style.color = '#1a1a1a';
        themeIcon.textContent = '☀️';
        
        // Update header
        const header = document.querySelector('header');
        if (header) {
            // Update background overlay
            const overlay = header.querySelector('div > div:last-child');
            if (overlay) {
                overlay.style.background = 'linear-gradient(135deg, rgba(227, 242, 253, 0.95), rgba(187, 222, 251, 0.92))';
            }
        }
        
        // Update all panels - HIGH CONTRAST
        document.querySelectorAll('.panel').forEach(panel => {
            panel.style.background = '#ffffff';
            panel.style.color = '#1a1a1a';
            panel.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            panel.style.border = '1px solid #e0e0e0';
        });
        
        // Update all headings to dark
        document.querySelectorAll('h2, h3, h4, h5').forEach(h => {
            if (!h.closest('.section-header')) {
                h.style.color = '#1a1a1a';
            }
        });
        
        // Update all paragraphs to dark
        document.querySelectorAll('p').forEach(p => {
            if (!p.style.color || p.style.color.includes('rgb(144, 202, 249)')) {
                p.style.color = '#424242';
            }
        });
        
        // Update sections with better contrast
        document.querySelectorAll('.educational-section').forEach(section => {
            const content = section.querySelector('.section-content');
            if (section.classList.contains('section-red')) {
                content.style.background = '#ffebee';
                content.style.color = '#1a1a1a';
            } else if (section.classList.contains('section-green')) {
                content.style.background = '#e8f5e9';
                content.style.color = '#1a1a1a';
            } else if (section.classList.contains('section-blue')) {
                content.style.background = '#e3f2fd';
                content.style.color = '#1a1a1a';
            } else if (section.classList.contains('section-purple')) {
                content.style.background = '#f3e5f5';
                content.style.color = '#1a1a1a';
            } else if (section.classList.contains('section-semantic')) {
                content.style.background = '#fff3e0';
                content.style.color = '#1a1a1a';
            }
            
            // Fix all text in sections - AGGRESSIVE
            content.querySelectorAll('p, li, div, span, strong, h4, h5').forEach(el => {
                // Skip buttons
                if (el.closest('button')) return;
                
                const currentColor = el.style.color || window.getComputedStyle(el).color;
                
                // Force dark colors for ALL light text
                if (currentColor.includes('#90caf9') || currentColor.includes('#64b5f6') || 
                    currentColor.includes('#ef5350') || currentColor.includes('#f44336') ||
                    currentColor.includes('#ffa726') || currentColor.includes('#ff9800') ||
                    currentColor.includes('#ce93d8') || currentColor.includes('#81c784') ||
                    currentColor.includes('#ffb74d') || currentColor.includes('#ffcc80') ||
                    currentColor.includes('144, 202, 249') || currentColor.includes('100, 181, 246') ||
                    currentColor.includes('239, 83, 80') || currentColor.includes('255, 167, 38') ||
                    currentColor.includes('206, 147, 216') || currentColor.includes('129, 199, 132') ||
                    currentColor === 'rgb(224, 224, 224)') {
                    el.style.color = '#1a1a1a !important';
                } else if (!el.style.color) {
                    el.style.color = '#424242';
                }
            });
            
            // Fix instruction boxes inside sections
            content.querySelectorAll('div[style*="background"]').forEach(box => {
                box.querySelectorAll('p, span, strong, li').forEach(text => {
                    if (!text.closest('button')) {
                        text.style.color = '#1a1a1a';
                    }
                });
            });
        });
        
        // Fix statement cards
        document.querySelectorAll('.statement-card').forEach(card => {
            card.style.background = '#ffffff';
            card.style.color = '#1a1a1a';
            card.style.border = '2px solid #1976d2';
        });
        
        // Fix constellation buttons
        document.querySelectorAll('.constellation-btn').forEach(btn => {
            btn.style.background = '#ffffff';
            btn.style.color = '#1a1a1a';
            btn.style.border = '2px solid #1976d2';
        });
        
        // Fix editable boxes
        document.querySelectorAll('.editable-box').forEach(box => {
            box.style.background = '#ffffff';
            const textarea = box.querySelector('textarea');
            if (textarea) {
                textarea.style.color = '#1a1a1a';
                textarea.style.background = '#ffffff';
            }
        });
        
        // Fix footer GenAI
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.background = 'linear-gradient(135deg, #e3f2fd, #bbdefb)';
            footer.style.borderTop = '3px solid #1976d2';
            footer.querySelectorAll('h2, h3, h4, p, li, div, summary, strong').forEach(el => {
                const computedColor = window.getComputedStyle(el).color;
                // Only change light colors to dark
                if (computedColor.includes('144, 202, 249') || computedColor.includes('100, 181, 246') || computedColor.includes('176, 176, 176')) {
                    el.style.color = '#1a1a1a';
                }
            });
            // Fix details text
            footer.querySelectorAll('details').forEach(detail => {
                detail.style.color = '#1a1a1a';
            });
        }
        
        // Fix Hesiod quote box
        document.querySelectorAll('blockquote').forEach(q => {
            q.style.color = '#e65100'; // Dark orange for readability
            q.parentElement.style.background = 'linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 193, 7, 0.1))';
        });
        
    } else {
        // Switch back to Dark Mode
        body.style.background = 'linear-gradient(180deg, #0a0e27, #1a1f3a)';
        body.style.color = '#e0e0e0';
        themeIcon.textContent = '🌙';
        
        // Restore dark header
        const header = document.querySelector('header');
        if (header) {
            const overlay = header.querySelector('div > div:last-child');
            if (overlay) {
                overlay.style.background = 'linear-gradient(135deg, rgba(10, 14, 39, 0.92), rgba(26, 31, 58, 0.88))';
            }
        }
        
        // Restore dark panels
        document.querySelectorAll('.panel').forEach(panel => {
            panel.style.background = 'rgba(26, 31, 58, 0.95)';
            panel.style.color = '#e0e0e0';
            panel.style.boxShadow = '';
            panel.style.border = '';
        });
        
        // Restore headings
        document.querySelectorAll('h2, h3, h4, h5').forEach(h => {
            h.style.color = '';
        });
        
        // Restore paragraphs
        document.querySelectorAll('p').forEach(p => {
            p.style.color = '';
        });
        
        // Restore dark sections
        document.querySelectorAll('.educational-section').forEach(section => {
            const content = section.querySelector('.section-content');
            if (section.classList.contains('section-red')) {
                content.style.background = 'linear-gradient(180deg, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.05))';
                content.style.color = '';
            } else if (section.classList.contains('section-green')) {
                content.style.background = 'linear-gradient(180deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.05))';
                content.style.color = '';
            } else if (section.classList.contains('section-blue')) {
                content.style.background = 'linear-gradient(180deg, rgba(33, 150, 243, 0.15), rgba(33, 150, 243, 0.05))';
                content.style.color = '';
            } else if (section.classList.contains('section-purple')) {
                content.style.background = 'linear-gradient(180deg, rgba(156, 39, 176, 0.15), rgba(156, 39, 176, 0.05))';
                content.style.color = '';
            } else if (section.classList.contains('section-semantic')) {
                content.style.background = 'linear-gradient(180deg, rgba(255, 152, 0, 0.15), rgba(255, 152, 0, 0.05))';
                content.style.color = '';
            }
            
            // Restore text colors
            content.querySelectorAll('p, li, div').forEach(el => {
                el.style.color = '';
            });
        });
        
        // Restore statement cards
        document.querySelectorAll('.statement-card').forEach(card => {
            card.style.background = '';
            card.style.color = '';
            card.style.border = '';
        });
        
        // Restore constellation buttons
        document.querySelectorAll('.constellation-btn').forEach(btn => {
            btn.style.background = '';
            btn.style.color = '';
            btn.style.border = '';
        });
        
        // Restore editable boxes
        document.querySelectorAll('.editable-box').forEach(box => {
            box.style.background = '';
            const textarea = box.querySelector('textarea');
            if (textarea) {
                textarea.style.color = '';
                textarea.style.background = '';
            }
        });
        
        // Restore footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.background = '';
            footer.style.borderTop = '';
            footer.querySelectorAll('h2, h3, h4, p, li, div, summary, strong, details').forEach(el => {
                el.style.color = '';
            });
        }
        
        // Restore Hesiod quote
        document.querySelectorAll('blockquote').forEach(q => {
            q.style.color = '';
            if (q.parentElement) {
                q.parentElement.style.background = '';
            }
        });
    }
}

// PDF Download Function
function downloadPDF() {
    // Show loading message
    showFeedback(`
        <h3 style="color: #4caf50;">📄 Generazione PDF...</h3>
        <p style="margin-top: 15px;">Sto preparando il documento per la stampa.</p>
        <p style="margin-top: 10px; color: #90caf9;">Questo potrebbe richiedere alcuni secondi...</p>
    `, 'feedback');
    
    // Use browser's print function which allows saving as PDF
    setTimeout(() => {
        window.print();
    }, 500);
}

// Print-specific styles
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        body {
            background: white !important;
            color: black !important;
        }
        
        header {
            page-break-after: avoid;
        }
        
        .educational-section {
            page-break-inside: avoid;
            page-break-before: auto;
        }
        
        .panel {
            page-break-inside: avoid;
            background: white !important;
            border: 1px solid #ddd !important;
        }
        
        button {
            display: none !important;
        }
        
        .modal {
            display: none !important;
        }
        
        canvas {
            page-break-inside: avoid;
        }
        
        .constellation-btn {
            border: 1px solid #333 !important;
        }
        
        @page {
            margin: 2cm;
            size: A4;
        }
    }
`;
document.head.appendChild(printStyles);

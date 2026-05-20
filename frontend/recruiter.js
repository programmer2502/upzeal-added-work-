document.addEventListener("DOMContentLoaded", () => {

    const candidateData = {
        'liam': {
            name: "Liam Chen",
            traits: [
                { label: "Refactored Legacy Code", score: 85, isPositive: true },
                { label: "Optimal Architecture Choice", score: 92, isPositive: true },
                { label: "Zero-Downtime Deployments", score: 78, isPositive: true },
                { label: "Missed Security Linting", score: 40, isPositive: false },
                { label: "Over-engineered Auth Logic", score: 55, isPositive: false }
            ]
        },
        'olivia': {
            name: "Olivia Martin",
            traits: [
                { label: "Flawless Data Pipelines", score: 88, isPositive: true },
                { label: "Comprehensive Test Coverage", score: 75, isPositive: true },
                { label: "Delayed PR Reviews", score: 35, isPositive: false },
                { label: "Complex Model Debugging", score: 90, isPositive: true },
                { label: "Poor Docstrings", score: 60, isPositive: false }
            ]
        }
    };

    window.renderMatrix = (candidateId) => {
        const container = document.getElementById('matrix-graph');
        const headerTarget = document.querySelector('.explainability-panel .text-muted');
        const data = candidateData[candidateId];

        if(!container || !data) return;

        headerTarget.textContent = `Target: ${data.name}`;
        
        // Clear existing bars except axis
        const axis = container.querySelector('.matrix-axis');
        container.innerHTML = '';
        if(axis) container.appendChild(axis);

        data.traits.forEach((trait, index) => {
            const row = document.createElement('div');
            row.className = 'matrix-row';

            // HTML Structure
            row.innerHTML = `
                <div class="matrix-label-left ${trait.isPositive ? '' : 'text-muted'}" style="color: ${trait.isPositive ? 'var(--primary)' : 'var(--text-muted)'}">
                    ${trait.isPositive ? trait.label : ''}
                </div>
                
                <div class="bar-track">
                    <div class="bar-side">
                        ${!trait.isPositive ? `<div class="bar-fill bar-neg" data-target="${trait.score}%"></div>` : ''}
                    </div>
                    <div class="bar-side">
                        ${trait.isPositive ? `<div class="bar-fill bar-pos" data-target="${trait.score}%"></div>` : ''}
                    </div>
                </div>

                <div class="matrix-label-right ${!trait.isPositive ? '' : 'text-muted'}" style="color: ${!trait.isPositive ? 'var(--secondary)' : 'var(--text-muted)'}">
                    ${!trait.isPositive ? trait.label : ''}
                </div>
            `;
            
            container.appendChild(row);

            // Animate after brief delay
            setTimeout(() => {
                const fill = row.querySelector('.bar-fill');
                if(fill) {
                    fill.style.width = fill.getAttribute('data-target');
                }
            }, 100 + (index * 150));
        });
    };

    // Global expose for onclick
    window.selectCandidate = (id) => {
        // Update active state
        document.querySelectorAll('.candidate-card').forEach(card => {
            card.classList.remove('active-select');
        });
        
        const clickedCard = document.querySelector(`[onclick="selectCandidate('${id}')"]`);
        if(clickedCard) clickedCard.classList.add('active-select');

        // Render matrix
        window.renderMatrix(id);
    };

    // Initial render
    window.renderMatrix('liam');
});

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Create and handle Custom Cursor
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow
    const renderCursor = () => {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover state expansion
    const interactiveElements = document.querySelectorAll('a, button, .candidate-card, .ticket-card, input');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // 2. Page Wipe Transitions
    // Create wipe overlay
    const wipeOverlay = document.createElement('div');
    wipeOverlay.id = 'page-wipe';
    const wipeLogo = document.createElement('div');
    wipeLogo.className = 'wipe-logo';
    wipeLogo.textContent = '[VIP]';
    wipeOverlay.appendChild(wipeLogo);
    document.body.appendChild(wipeOverlay);

    // Wipe in on initial page load
    setTimeout(() => {
        wipeOverlay.classList.add('wipe-in');
        setTimeout(() => {
            wipeOverlay.style.transform = 'translateY(-100%)';
            wipeOverlay.classList.remove('wipe-in');
        }, 800);
    }, 100);

    // Single Page Application View Switching
    window.switchView = (viewId) => {
        // Trigger wipe out
        wipeOverlay.style.transform = 'translateY(100%)';
        wipeOverlay.classList.add('wipe-out');
        wipeLogo.classList.add('wipe-logo-fade');
        
        setTimeout(() => {
            // Hide all views
            document.querySelectorAll('.view-container').forEach(v => {
                v.classList.remove('active');
            });
            // Show target view
            document.getElementById(viewId).classList.add('active');
            
            // Re-trigger visual scripts if needed (e.g. radar chart animation)
            if (viewId === 'view-student' && window.renderRadarChart) {
                // Remove SVG to force re-render
                const radarContainer = document.getElementById('radar-chart');
                if (radarContainer) radarContainer.innerHTML = '';
                window.renderRadarChart();
            }
            if (viewId === 'view-recruiter' && window.renderMatrix) {
                window.renderMatrix('liam');
            }

            // Trigger wipe in
            wipeOverlay.style.transform = 'translateY(0%)';
            wipeOverlay.classList.remove('wipe-out');
            wipeLogo.classList.remove('wipe-logo-fade');
            wipeOverlay.classList.add('wipe-in');
            
            setTimeout(() => {
                wipeOverlay.style.transform = 'translateY(-100%)';
                wipeOverlay.classList.remove('wipe-in');
            }, 800);
        }, 800); // Wait for wipe-out to cover screen
    };

});

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. AI Mentor Toggle (CMD+K or Ctrl+K)
    const aiPanel = document.getElementById("ai-panel");
    const aiOverlay = document.getElementById("ai-overlay");
    const closeBtn = document.getElementById("ai-close");
    const aiInput = document.getElementById("ai-input-field");
    const cmdHint = document.getElementById("cmd-k-hint");

    const togglePanel = () => {
        if (!aiPanel || !aiOverlay) return;
        const isActive = aiPanel.classList.toggle("active");
        aiOverlay.classList.toggle("active");
        if (isActive) {
            aiInput?.focus();
        }
    };

    // Keyboard shortcut listener
    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            togglePanel();
        }
        if (e.key === 'Escape' && aiPanel?.classList.contains("active")) {
            togglePanel();
        }
    });

    if(closeBtn){
    closeBtn.addEventListener("click", togglePanel);
}

if(aiOverlay){
    aiOverlay.addEventListener("click", togglePanel);
}

if(cmdHint){
    cmdHint.addEventListener("click", togglePanel);
}

    // 2. Draw Radar Chart dynamically
    window.renderRadarChart = () => {
        const container = document.getElementById("radar-chart");
        if(!container) return;

        // Data & configuration
        const data = [
            { label: "Maintainability", score: 85 },
            { label: "Logic", score: 90 },
            { label: "Security", score: 95 },
            { label: "Documentation", score: 65 }
        ];

        const globalAvg = [70, 75, 60, 60]; // Global average scores

        const size = 250;
        const center = size / 2;
        const radius = size / 2 - 40;
        const numAxes = data.length;
        const angleStep = (Math.PI * 2) / numAxes;

        // SVG Namespace
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

        // Helper to get coordinates
        const getPoint = (value, angle) => {
            const r = (value / 100) * radius;
            return {
                x: center + r * Math.cos(angle - Math.PI / 2),
                y: center + r * Math.sin(angle - Math.PI / 2)
            };
        };

        // Draw web (concentric polygons)
        for (let level = 1; level <= 5; level++) {
            const levelRadius = (level / 5) * radius;
            let points = "";
            for (let i = 0; i < numAxes; i++) {
                const angle = i * angleStep;
                const x = center + levelRadius * Math.cos(angle - Math.PI / 2);
                const y = center + levelRadius * Math.sin(angle - Math.PI / 2);
                points += `${x},${y} `;
            }
            const polygon = document.createElementNS(svgNS, "polygon");
            polygon.setAttribute("points", points);
            polygon.setAttribute("fill", "none");
            polygon.setAttribute("stroke", "rgba(255, 255, 255, 0.1)");
            polygon.setAttribute("stroke-width", "1");
            svg.appendChild(polygon);
        }

        // Draw axes and labels
        for (let i = 0; i < numAxes; i++) {
            const angle = i * angleStep;
            const endPoint = getPoint(100, angle);

            // Axis line
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", center);
            line.setAttribute("y1", center);
            line.setAttribute("x2", endPoint.x);
            line.setAttribute("y2", endPoint.y);
            line.setAttribute("stroke", "rgba(255, 255, 255, 0.2)");
            line.setAttribute("stroke-width", "1");
            svg.appendChild(line);

            // Label
            const labelPoint = getPoint(120, angle);
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", labelPoint.x);
            text.setAttribute("y", labelPoint.y);
            text.setAttribute("fill", "var(--text-muted)");
            text.setAttribute("font-size", "10");
            text.setAttribute("font-family", "var(--font-body)");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.textContent = data[i].label;
            svg.appendChild(text);
        }

        // Function to draw data polygon
        const drawDataPolygon = (scores, color, strokeColor, isFilled) => {
            let points = "";
            for (let i = 0; i < numAxes; i++) {
                const p = getPoint(scores[i], i * angleStep);
                points += `${p.x},${p.y} `;
            }
            const polygon = document.createElementNS(svgNS, "polygon");
            polygon.setAttribute("points", points);
            polygon.setAttribute("fill", isFilled ? color : "none");
            polygon.setAttribute("stroke", strokeColor);
            polygon.setAttribute("stroke-width", "2");
            // Simple enter animation
            polygon.innerHTML = `<animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze" />`;
            svg.appendChild(polygon);

            // Draw points
            for (let i = 0; i < numAxes; i++) {
                const p = getPoint(scores[i], i * angleStep);
                const circle = document.createElementNS(svgNS, "circle");
                circle.setAttribute("cx", p.x);
                circle.setAttribute("cy", p.y);
                circle.setAttribute("r", "4");
                circle.setAttribute("fill", strokeColor);
                svg.appendChild(circle);
            }
        };

        // Draw Global Avg
        drawDataPolygon(globalAvg, "rgba(255,255,255,0.05)", "rgba(255, 255, 255, 0.3)", false);

        // Draw User Data
        const userScores = data.map(d => d.score);
        drawDataPolygon(userScores, "rgba(0, 255, 187, 0.2)", "var(--primary)", true);

        container.appendChild(svg);
    };

    window.renderRadarChart();
});

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Scroll Reveal Observer
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Parallax Timeline & Data Stream Effect
    const timelineMockups = document.querySelectorAll('.mockup');
    const dataStream = document.getElementById('data-stream-bg');

    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        
        // Data stream parallax
        if(dataStream) {
            dataStream.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        }

        // Timeline mockups parallax
        timelineMockups.forEach((mockup, index) => {
            const speed = (index % 2 === 0) ? 0.05 : -0.05;
            const yOffset = scrolled * speed;
            mockup.style.transform = `translateY(${yOffset}px) ${mockup.closest('.reverse') ? 'rotateY(10deg) rotateX(5deg)' : 'rotateY(-10deg) rotateX(5deg)'}`;
        });
    });

    // 3. Kinetic Typography Glitch effect on Hero Load
    const kineticText = document.querySelector('.kinetic-text');
    if(kineticText) {
        // We will just do a simple glitch effect on the text content if needed,
        // but for now, we're relying on CSS and a simple split for text if required.
        // Given we have HTML inside (br tags, spans), we will glitch text nodes only.
        
        const textNodes = [];
        const walk = document.createTreeWalker(kineticText, NodeFilter.SHOW_TEXT, null, false);
        let n;
        while(n = walk.nextNode()) {
            if(n.nodeValue.trim() !== '') {
                textNodes.push({
                    node: n,
                    original: n.nodeValue
                });
            }
        }

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_>";
        let iterations = 0;
        
        const interval = setInterval(() => {
            let done = true;
            textNodes.forEach(item => {
                item.node.nodeValue = item.original
                    .split("")
                    .map((letter, index) => {
                        if(index < iterations) return item.original[index];
                        done = false;
                        if(item.original[index] === ' ' || item.original[index] === '\n') return item.original[index];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");
            });
            
            if(done) {
                clearInterval(interval);
                // Ensure exact match at the end
                textNodes.forEach(item => { item.node.nodeValue = item.original; });
            }
            iterations += 1/3; 
        }, 30);
    }

    // 4. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 5. Hover Effects reset for Mockups to avoid conflict with parallax
    timelineMockups.forEach(mockup => {
        mockup.addEventListener('mouseenter', () => {
            mockup.style.transform = 'rotateY(0) rotateX(0)';
        });
        mockup.addEventListener('mouseleave', () => {
            const scrolled = window.scrollY;
            const index = Array.from(timelineMockups).indexOf(mockup);
            const speed = (index % 2 === 0) ? 0.05 : -0.05;
            const yOffset = scrolled * speed;
            mockup.style.transform = `translateY(${yOffset}px) ${mockup.closest('.reverse') ? 'rotateY(10deg) rotateX(5deg)' : 'rotateY(-10deg) rotateX(5deg)'}`;
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }

    // Scroll Reveal Animation with Intersection Observer
    const revealElements = document.querySelectorAll(
        '.benefits-section, .gallery-section, .brands-section, .final-cta-section, .benefit-card'
    );

    const revealObserverOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing after the element is visible
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);

    revealElements.forEach(el => {
        // A classe .reveal-on-scroll é adicionada diretamente no HTML
        revealObserver.observe(el);
    });

    // Botão Voltar ao Topo
    const backToTopButton = document.getElementById("backToTopBtn");

    if (backToTopButton) { // Verifica se o botão existe no DOM
        window.onscroll = function() {
            scrollFunction();
        };

        function scrollFunction() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopButton.classList.add("show");
            } else {
                backToTopButton.classList.remove("show");
            }
        }

        backToTopButton.addEventListener("click", function(e) {
            e.preventDefault(); // Prevenir comportamento padrão do link '#'
            window.scrollTo({top: 0, behavior: 'smooth'}); // Rolagem suave para o topo
        });
    }
});

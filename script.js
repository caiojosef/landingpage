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
    const revealObserverOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);
    revealElements.forEach(el => { revealObserver.observe(el); });

    // Botão Voltar ao Topo
    const backToTopButton = document.getElementById("backToTopBtn");
    if (backToTopButton) { 
        window.onscroll = function() { scrollFunction(); };
        function scrollFunction() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopButton.classList.add("show");
            } else {
                backToTopButton.classList.remove("show");
            }
        }
        backToTopButton.addEventListener("click", function(e) {
            e.preventDefault(); 
            window.scrollTo({top: 0, behavior: 'smooth'}); 
        });
    }

    // --- CONTADORES DINÂMICOS COM localStorage ---
    function formatCurrency(value) {
        return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function formatNumber(value) {
        return Math.floor(value).toLocaleString('pt-BR');
    }

    function animateDisplayValue(element, startValue, endValue, duration, formatter, onCompleteCallback, valueTracker, storageKey) {
        if (!element) {
            console.error("Elemento do contador não fornecido para animateDisplayValue");
            return;
        }
        let startTime = null;
        startValue = parseFloat(startValue) || 0;
        endValue = parseFloat(endValue) || 0; // Garante que endValue também seja numérico

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const value = progress * (endValue - startValue) + startValue;
            element.textContent = formatter(value);

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                element.textContent = formatter(endValue);
                valueTracker.current = endValue; 
                if (storageKey) {
                    localStorage.setItem(storageKey, valueTracker.current.toString());
                }
                if (onCompleteCallback) {
                    onCompleteCallback(); 
                }
            }
        }
        requestAnimationFrame(animation);
    }

    // --- Contador de Economia ---
    const economyCounterElement = document.getElementById('economyCounter');
    const economyLocalStorageKey = 'allpromoUserEconomy';
    const defaultInitialEconomy = 300; // Começa do zero para novos usuários
    let economyValueTracker = { current: defaultInitialEconomy }; // Inicializa com o default

    if (economyCounterElement) {
        console.log('LocalStorage Economia (antes):', localStorage.getItem(economyLocalStorageKey)); // Debug
        const savedEconomy = parseFloat(localStorage.getItem(economyLocalStorageKey));
        let animateEconomyTo = defaultInitialEconomy;

        if (savedEconomy && !isNaN(savedEconomy) && savedEconomy > 0) {
            animateEconomyTo = savedEconomy;
            economyValueTracker.current = savedEconomy; // Define o valor atual se encontrado no localStorage
        } else {
            // Se não tem nada salvo, ou inválido, o economyValueTracker.current já é defaultInitialEconomy (0)
            // e animateEconomyTo também é 0.
            localStorage.removeItem(economyLocalStorageKey); // Limpa qualquer valor inválido
        }
        
        console.log('Economia - Animando de 0 para:', animateEconomyTo); // Debug
        // A animação visual sempre começa de 0 para o usuário ver a subida
        animateDisplayValue(economyCounterElement, 0, animateEconomyTo, 2000, formatCurrency, function() {
            setInterval(function() {
                const minAmount = 0.13;
                const maxAmount = 5.77;
                const randomAmount = parseFloat((Math.random() * (maxAmount - minAmount) + minAmount).toFixed(2));
                const newEconomyValue = economyValueTracker.current + randomAmount;
                // Anima do valor atual para o novo valor
                animateDisplayValue(economyCounterElement, economyValueTracker.current, newEconomyValue, 1000, formatCurrency, null, economyValueTracker, economyLocalStorageKey);
            }, 3000); // Seu intervalo: 2 * 30 * 50 = 3000ms (3 segundos)
        }, economyValueTracker, economyLocalStorageKey);
    }

    // --- Contador de Pessoas ---
    const peopleCounterElement = document.getElementById('peopleCounter');
    const peopleLocalStorageKey = 'allpromoUserPeople';
    const defaultInitialPeople = 200; 
    let peopleValueTracker = { current: defaultInitialPeople }; // Inicializa com o default

    if (peopleCounterElement) {
        console.log('LocalStorage Pessoas (antes):', localStorage.getItem(peopleLocalStorageKey)); // Debug
        const savedPeople = parseInt(localStorage.getItem(peopleLocalStorageKey), 10);
        let animatePeopleTo = defaultInitialPeople;
        let animatePeopleFrom = Math.max(0, defaultInitialPeople - 50); // Ponto de partida visual da animação

        if (savedPeople && !isNaN(savedPeople) && savedPeople >= defaultInitialPeople) {
            animatePeopleTo = savedPeople;
            animatePeopleFrom = Math.max(0, savedPeople - 50);
            peopleValueTracker.current = savedPeople;
        } else {
            // Se não tem nada salvo, ou inválido, peopleValueTracker.current já é defaultInitialPeople (200)
            // e animatePeopleTo também é 200.
            localStorage.removeItem(peopleLocalStorageKey); // Limpa qualquer valor inválido
        }

        console.log('Pessoas - Animando de', animatePeopleFrom, 'para:', animatePeopleTo); // Debug
        animateDisplayValue(peopleCounterElement, animatePeopleFrom, animatePeopleTo, 2000, formatNumber, function() {
            setInterval(function() {
                const minPeople = 1;
                const maxPeople = 7;
                const randomPeople = Math.floor(Math.random() * (maxPeople - minPeople + 1)) + minPeople;
                const newPeopleValue = peopleValueTracker.current + randomPeople;
                animateDisplayValue(peopleCounterElement, peopleValueTracker.current, newPeopleValue, 1000, formatNumber, null, peopleValueTracker, peopleLocalStorageKey);
            }, 4500); // Seu intervalo: 3 * 30 * 50 = 4500ms (4.5 segundos)
        }, peopleValueTracker, peopleLocalStorageKey);
    }
});

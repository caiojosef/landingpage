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
        endValue = parseFloat(endValue) || 0;

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
    // MODIFICAÇÃO AQUI: Novo valor inicial padrão para a economia
    const defaultInitialEconomy = 3575.05; // <<<< VALOR INICIAL PADRÃO ALTERADO
    let economyValueTracker = { current: defaultInitialEconomy }; 

    if (economyCounterElement) {
        console.log('LocalStorage Economia (antes):', localStorage.getItem(economyLocalStorageKey)); 
        const savedEconomy = parseFloat(localStorage.getItem(economyLocalStorageKey));
        let animateEconomyTo = defaultInitialEconomy;

        if (savedEconomy && !isNaN(savedEconomy) && savedEconomy >= defaultInitialEconomy) { // Comparar com default para garantir que não comece menor que o novo default
            animateEconomyTo = savedEconomy;
            economyValueTracker.current = savedEconomy; 
        } else {
            economyValueTracker.current = defaultInitialEconomy; // Garante que o valor base para incrementos seja o default
            localStorage.removeItem(economyLocalStorageKey); 
        }
        
        console.log('Economia - Animando de 0 para:', animateEconomyTo); 
        // A animação visual sempre começa de 0 para o usuário ver a subida
        animateDisplayValue(economyCounterElement, 0, animateEconomyTo, 2000, formatCurrency, function() { // Duração da animação inicial pode ser ajustada
            setInterval(function() {
                const minAmount = 0.13;
                const maxAmount = 5.77;
                const randomAmount = parseFloat((Math.random() * (maxAmount - minAmount) + minAmount).toFixed(2));
                const newEconomyValue = economyValueTracker.current + randomAmount;
                animateDisplayValue(economyCounterElement, economyValueTracker.current, newEconomyValue, 1000, formatCurrency, null, economyValueTracker, economyLocalStorageKey);
            }, 3000); // Seu intervalo: 3 segundos
        }, economyValueTracker, economyLocalStorageKey);
    }

    // --- Contador de Pessoas ---
    const peopleCounterElement = document.getElementById('peopleCounter');
    const peopleLocalStorageKey = 'allpromoUserPeople';
    const defaultInitialPeople = 1437; 
    let peopleValueTracker = { current: defaultInitialPeople }; 

    if (peopleCounterElement) {
        console.log('LocalStorage Pessoas (antes):', localStorage.getItem(peopleLocalStorageKey)); 
        const savedPeople = parseInt(localStorage.getItem(peopleLocalStorageKey), 10);
        let animatePeopleTo = defaultInitialPeople;
        let animatePeopleFrom = Math.max(0, defaultInitialPeople - 100); // Ponto de partida visual da animação (ex: 100 a menos)

        if (savedPeople && !isNaN(savedPeople) && savedPeople >= defaultInitialPeople) {
            animatePeopleTo = savedPeople;
            animatePeopleFrom = Math.max(0, savedPeople - 100); // Anima de um pouco antes do valor salvo
            peopleValueTracker.current = savedPeople;
        } else {
            peopleValueTracker.current = defaultInitialPeople; // Garante que o valor base para incrementos seja o default
            localStorage.removeItem(peopleLocalStorageKey); 
        }

        console.log('Pessoas - Animando de', animatePeopleFrom, 'para:', animatePeopleTo); 
        animateDisplayValue(peopleCounterElement, animatePeopleFrom, animatePeopleTo, 2000, formatNumber, function() {
            setInterval(function() {
                const minPeople = 1;
                const maxPeople = 12;
                const randomPeople = Math.floor(Math.random() * (maxPeople - minPeople + 1)) + minPeople;
                const newPeopleValue = peopleValueTracker.current + randomPeople;
                animateDisplayValue(peopleCounterElement, peopleValueTracker.current, newPeopleValue, 1000, formatNumber, null, peopleValueTracker, peopleLocalStorageKey);
            }, 4500); // Seu intervalo: 4.5 segundos
        }, peopleValueTracker, peopleLocalStorageKey);
    }
});

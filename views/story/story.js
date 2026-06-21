document.addEventListener('DOMContentLoaded', () => {
    
    // Animation d'apparition au scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); // Arrête de surveiller cet élément
            }   
        });
    }, observerOptions);

    // On cible les éléments à animer
    const animateElements = document.querySelectorAll('.value-card, .text-block, .image-block');
    
    animateElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s ease-out";
        observer.observe(el);
    });

    // Petit message console pour le fun
    console.log("Mode 'Story' activé. Prêt pour la collection.");
});
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contact');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulation d'envoi
        const formData = new FormData(form);
        console.log("Message envoyé par :", formData.get('nom'));
        
        alert("Merci ! Votre message a bien été envoyé.");
        form.reset();
    });
});
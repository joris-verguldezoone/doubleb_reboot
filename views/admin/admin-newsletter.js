// admin-newsletter.js (Fichier Front-End pour le navigateur)

class NewsletterFormManager {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        
        this.inputs = {
            subject: document.getElementById('newsletter-subject'),
            title: document.getElementById('newsletter-title'),
            image: document.getElementById('newsletter-image'),
            content: document.getElementById('newsletter-content'),
            cta: document.getElementById('newsletter-cta'),
            link: document.getElementById('newsletter-link')
        };

        this.preview = {
            subject: document.getElementById('preview-envelope-subject'),
            title: document.getElementById('preview-email-title'),
            image: document.getElementById('preview-email-image'),
            imageWrapper: document.getElementById('preview-image-wrapper'),
            content: document.getElementById('preview-email-text'),
            cta: document.getElementById('preview-email-cta'),
            ctaWrapper: document.getElementById('preview-cta-wrapper')
        };

        this.initEventListeners();
    }

    initEventListeners() {
        this.inputs.subject.addEventListener('input', () => this.updateTextField(this.inputs.subject.value, this.preview.subject, "(Pas d'objet)"));
        this.inputs.title.addEventListener('input', () => this.updateTextField(this.inputs.title.value, this.preview.title, "TITRE DE VOTRE NEWSLETTER"));
        this.inputs.content.addEventListener('input', () => this.updateTextField(this.inputs.content.value, this.preview.content, "Le corps de votre message s'affichera ici..."));
        this.inputs.image.addEventListener('input', () => this.updateImageField());
        this.inputs.cta.addEventListener('input', () => this.updateCtaField());
        this.inputs.link.addEventListener('input', () => this.updateCtaField());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    updateTextField(value, targetElement, defaultValue) {
        targetElement.textContent = value.trim() !== "" ? value : defaultValue;
    }

    updateImageField() {
        const url = this.inputs.image.value.trim();
        if (url !== "") {
            this.preview.image.src = url;
            this.preview.imageWrapper.style.display = "block";
        } else {
            this.preview.imageWrapper.style.display = "none";
            this.preview.image.src = "";
        }
    }

    updateCtaField() {
        const text = this.inputs.cta.value.trim();
        const url = this.inputs.link.value.trim();

        if (text !== "" && url !== "") {
            this.preview.cta.textContent = text;
            this.preview.cta.href = url;
            this.preview.ctaWrapper.style.display = "block";
        } else {
            this.preview.ctaWrapper.style.display = "none";
        }
    }

    // C'EST CETTE MÉTHODE QUI AVAIT LE MAUVAIS CODE COPIÉ
    async handleSubmit(event) {
        event.preventDefault();

        const btnSubmit = this.form.querySelector('.btn-submit');
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Envoi en cours...";

        const newsletterPayload = {
            subject: this.inputs.subject.value.trim(),
            title: this.inputs.title.value.trim(),
            imageUrl: this.inputs.image.value.trim() || null,
            content: this.inputs.content.value.trim(),
            ctaText: this.inputs.cta.value.trim() || null,
            ctaUrl: this.inputs.link.value.trim() || null
        };

        try {
            const response = await fetch('http://localhost:3000/api/send-newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newsletterPayload)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Succès : " + result.message);
                this.resetFormAndPreview();
            } else {
                alert("Erreur : " + result.error);
            }
        } catch (error) {
            console.error("[ADMIN ERROR] Impossible de joindre le serveur :", error);
            alert("Erreur critique : Le serveur d'envoi ne répond pas.");
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Planifier et Envoyer la Newsletter";
        }
    }

    resetFormAndPreview() {
        this.form.reset();
        this.preview.subject.textContent = "(Pas d'objet)";
        this.preview.title.textContent = "TITRE DE VOTRE NEWSLETTER";
        this.preview.content.textContent = "Le corps de votre message s'affichera ici au fur et à mesure de votre saisie...";
        this.preview.imageWrapper.style.display = "none";
        this.preview.image.src = "";
        this.preview.ctaWrapper.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NewsletterFormManager();
    console.log("[ADMIN INITIALIZED] Module de gestion de newsletter charge.");
});
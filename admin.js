// Données simulées (pourraient être en LocalStorage)
let templates = {
    welcome: { subject: "Bienvenue chez FABBENE", content: "Salut ! Merci de nous rejoindre..." },
    preorder: { subject: "Confirmation de votre commande", content: "Votre veste est en route..." },
    newsletter: { subject: "Les nouveautés de la semaine", content: "Découvrez nos nouveaux patchs..." }
};

// Switch d'onglets
function showTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.getElementById('tab-' + tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}

// Preview image locale
function previewImg(id) {
    const file = document.getElementById('file-' + id).files[0];
    const preview = document.getElementById('prev-' + id);
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) { preview.style.backgroundImage = `url(${e.target.result})`; }
        reader.readAsDataURL(file);
    }
}

// Simulation Upload
function uploadImg(id) {
    const file = document.getElementById('file-' + id).files[0];
    if(!file) return alert("Choisissez un fichier d'abord.");
    alert(`Image home-${id}.png remplacée avec succès (Simulation).`);
}

// Gestion des Mails
function loadMailTemplate() {
    const type = document.getElementById('mail-selector').value;
    document.getElementById('mail-subject').value = templates[type].subject;
    document.getElementById('mail-content').value = templates[type].content;
}

function saveMail() {
    const type = document.getElementById('mail-selector').value;
    templates[type].subject = document.getElementById('mail-subject').value;
    templates[type].content = document.getElementById('mail-content').value;
    alert("Template '" + type + "' mis à jour !");
}

// Init
loadMailTemplate();
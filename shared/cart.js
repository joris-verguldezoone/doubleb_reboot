document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner les éléments
    const cartIcon = document.querySelector('.cart-icon');
    const cartCountElement = document.querySelector('.cart-count');
    // Simuler l'ajout au panier sur un élément (ici l'icône de panier elle-même pour l'exemple)
    
    // Initialiser le compteur de panier (pourrait venir d'un LocalStorage)
    let cartItemCount = 0;

    // Fonction pour mettre à jour l'affichage du panier
    function updateCartDisplay() {
        cartCountElement.textContent = cartItemCount;
    }

    // Fonction simulée d'ajout au panier
    function addToCart() {
        cartItemCount++;
        updateCartDisplay();
        // Optionnel : un petit message de confirmation
        console.log('Produit ajouté au panier (simulé). Nouveau total :', cartItemCount);
    }

    // Écouteur d'événement sur l'icône de panier pour simuler l'action
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            addToCart();
            alert('Vous avez cliqué sur le panier. Cette action pourrait simuler l\'ajout d\'un produit par défaut ou l\'ouverture du panier.');
        });
    }
});
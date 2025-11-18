// assets/js/components/header.js
import { showToast } from '../utils/helpers.js';

export function initHeader() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const closeMenu = document.querySelector('.close-menu');

    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', () => {
            navMobile.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMenu.addEventListener('click', () => {
            navMobile.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Fechar menu ao clicar em links
        const mobileLinks = navMobile.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Adicionar classe active ao link atual
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const currentPath = window.location.hash.replace('#', '') || 'home';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').replace('#', '');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Atualizar navegação quando a página mudar
window.addEventListener('pageChanged', () => {
    updateActiveNavLink();
});
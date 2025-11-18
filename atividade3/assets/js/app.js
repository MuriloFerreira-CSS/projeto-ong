// assets/js/app.js (CORRIGIDO)
import Router from './router.js';
import { initHeader } from './components/header.js';
import { initForms } from './components/forms.js';
import { modalManager } from './components/modal.js';

class ONGApp {
    constructor() {
        this.router = new Router();
        this.modalManager = modalManager;
        this.currentPage = 'home';
        this.init();
    }

    init() {
        // Configurar roteamento primeiro
        this.setupRouting();
        
        // Carregar a página inicial baseada na URL atual
        this.loadInitialPage();
        
        // Inicializar componentes
        initHeader();
        initForms();
        
        // Configurar eventos globais de modal
        this.setupModalEvents();
        
        console.log('ONG Brasil App inicializado');
    }

    setupRouting() {
        // Navegação via SPA
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hasAttribute('data-route')) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigateTo(route);
            }
        });

        // Navegação do browser (avançar/voltar)
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                this.router.renderPage(e.state.route);
            }
        });
    }

    loadInitialPage() {
        // Determinar a rota inicial baseada na URL
        let initialRoute = 'home';
        
        // Verificar hash na URL
        if (window.location.hash) {
            initialRoute = window.location.hash.replace('#', '');
        }
        
        // Verificar se a rota existe
        if (!this.router.routes[initialRoute]) {
            initialRoute = 'home';
        }
        
        // Renderizar a página inicial
        this.router.renderPage(initialRoute);
        
        // Atualizar estado do histórico
        window.history.replaceState({ route: initialRoute }, '', `#${initialRoute}`);
    }

    setupModalEvents() {
        // Evento quando um modal é aberto
        window.addEventListener('modalOpened', (e) => {
            console.log(`Modal aberto: ${e.detail.modalId}`);
        });

        // Evento quando um modal é fechado
        window.addEventListener('modalClosed', (e) => {
            console.log(`Modal fechado: ${e.detail.modalId}`);
        });
    }

    // Método para abrir modal globalmente
    openModal(modalName, options = {}) {
        return this.modalManager.showModal(modalName, options);
    }

    // Método para fechar modal globalmente
    closeModal(modalName) {
        return this.modalManager.closeModal(modalName);
    }

    // Método para mudar de página
    navigateTo(route) {
        this.router.navigate(route);
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.ONGApp = new ONGApp();
});

export default ONGApp;
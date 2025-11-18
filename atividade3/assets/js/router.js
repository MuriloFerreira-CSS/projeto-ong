// assets/js/router.js (CORRIGIDO)
import { renderTemplate } from './templates.js';
import { showLoading, hideLoading } from './utils/helpers.js';

class Router {
    constructor() {
        this.routes = {
            'home': {
                template: 'home-template',
                title: 'ONG Brasil - Conectando Causas Sociais',
                description: 'Plataforma digital para ONGs brasileiras'
            },
            'projetos': {
                template: 'projetos-template',
                title: 'Projetos Sociais - ONG Brasil',
                description: 'Conheça nossos projetos de voluntariado e doações'
            },
            'cadastro': {
                template: 'cadastro-template',
                title: 'Cadastro - ONG Brasil',
                description: 'Cadastre-se como voluntário ou doador'
            },
            'contato': {
                template: 'contato-template',
                title: 'Contato - ONG Brasil',
                description: 'Entre em contato conosco'
            }
        };
        
        this.currentRoute = 'home';
    }

    async navigate(route) {
        if (this.routes[route]) {
            showLoading();
            
            // Atualizar estado do browser
            window.history.pushState({ route }, '', `#${route}`);
            
            await this.renderPage(route);
            this.currentRoute = route;
            
            hideLoading();
            
            // Rolar para o topo após navegação
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Rota não encontrada, redirecionar para home
            this.navigate('home');
        }
    }

    async renderPage(route) {
        const routeConfig = this.routes[route];
        
        if (!routeConfig) {
            console.error(`Rota não encontrada: ${route}`);
            return;
        }
        
        // Atualizar meta tags
        document.title = routeConfig.title;
        this.updateMetaDescription(routeConfig.description);
        
        // Renderizar template
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            try {
                const content = await renderTemplate(routeConfig.template);
                mainContent.innerHTML = content;
                
                // Disparar evento personalizado para notificar mudança de página
                window.dispatchEvent(new CustomEvent('pageChanged', {
                    detail: { route, config: routeConfig }
                }));
                
                // Re-inicializar componentes específicos da página
                this.initializePageComponents(route);
                
            } catch (error) {
                console.error('Erro ao renderizar template:', error);
                mainContent.innerHTML = `
                    <div class="alert alert-error">
                        <h2>Erro ao carregar a página</h2>
                        <p>Desculpe, ocorreu um erro ao carregar o conteúdo.</p>
                        <button class="btn" onclick="window.ONGApp.navigateTo('home')">
                            Voltar para o Início
                        </button>
                    </div>
                `;
            }
        }
    }

    initializePageComponents(route) {
        // Inicializar componentes específicos de cada página
        switch (route) {
            case 'projetos':
                this.initializeProjetosPage();
                break;
            case 'cadastro':
                this.initializeCadastroPage();
                break;
            case 'contato':
                this.initializeContatoPage();
                break;
        }
    }

    initializeProjetosPage() {
        // Configurar interações específicas da página de projetos
        const reportsBtn = document.getElementById('show-reports');
        if (reportsBtn) {
            reportsBtn.addEventListener('click', () => {
                window.ONGApp.openModal('reports');
            });
        }

        // Botões de detalhes do projeto
        const projectDetailBtns = document.querySelectorAll('.project-details-btn');
        projectDetailBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectIndex = parseInt(btn.getAttribute('data-project'));
                this.showProjectDetails(projectIndex);
            });
        });

        // Botões de doação
        const donationBtns = document.querySelectorAll('.donation-btn');
        donationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.ONGApp.openModal('donation');
            });
        });
    }

    initializeCadastroPage() {
        // Configurar campos condicionais do formulário de cadastro
        const tipoParticipacao = document.getElementById('tipo-participacao');
        const voluntarioFields = document.getElementById('voluntario-fields');
        
        if (tipoParticipacao && voluntarioFields) {
            tipoParticipacao.addEventListener('change', () => {
                if (tipoParticipacao.value === 'voluntario' || tipoParticipacao.value === 'ambos') {
                    voluntarioFields.style.display = 'block';
                } else {
                    voluntarioFields.style.display = 'none';
                }
            });
            
            // Trigger change event para estado inicial
            tipoParticipacao.dispatchEvent(new Event('change'));
        }
    }

    initializeContatoPage() {
        // Configurar formulário de contato
        const formContato = document.getElementById('form-contato');
        if (formContato) {
            formContato.addEventListener('submit', (e) => {
                e.preventDefault();
                window.ONGApp.openModal('confirmation', {
                    title: 'Mensagem Enviada',
                    content: `
                        <div class="confirmation-content">
                            <p>Sua mensagem foi enviada com sucesso!</p>
                            <p>Entraremos em contato em breve.</p>
                        </div>
                    `,
                    showConfirm: false,
                    showCancel: false
                });
                formContato.reset();
            });
        }
    }

    showProjectDetails(projectIndex) {
        const projects = [
            {
                title: 'Educação',
                image: 'assets/images/voluntariado-educacao.jpg',
                badge: 'Popular',
                volunteers: 85,
                impact: 1200,
                duration: 18,
                description: 'Projeto de reforço escolar e alfabetização de adultos que já impactou mais de mil pessoas. Atuamos em comunidades carentes com metodologias inovadoras de ensino.',
                requirements: [
                    'Disponibilidade de 4 horas semanais',
                    'Paciente e com vontade de ensinar',
                    'Experiência com educação é um diferencial'
                ]
            },
            {
                title: 'Meio Ambiente',
                image: 'assets/images/voluntariado-ambiental.jpg', 
                badge: 'Novo',
                volunteers: 42,
                impact: 3500,
                duration: 8,
                description: 'Ações de reflorestamento e conscientização ambiental em áreas urbanas e rurais. Já plantamos mais de 3.500 árvores nativas.',
                requirements: [
                    'Gostar de atividades ao ar livre',
                    'Disponibilidade para fins de semana',
                    'Interesse em causas ambientais'
                ]
            },
            {
                title: 'Assistência Social',
                image: 'assets/images/voluntariado-assistencia.jpg',
                badge: 'Urgente',
                volunteers: 63,
                impact: 800,
                duration: 24,
                description: 'Trabalho em abrigos e distribuição de alimentos para pessoas em situação de vulnerabilidade. Atendimento humanizado e acolhedor.',
                requirements: [
                    'Empatia e compaixão',
                    'Disponibilidade noturna ou de fim de semana',
                    'Respeito pela diversidade'
                ]
            }
        ];

        const project = projects[projectIndex];
        if (!project) return;

        window.ONGApp.openModal('project-details', {
            title: project.title,
            content: `
                <div class="project-details">
                    <div class="project-hero">
                        <img src="${project.image}" alt="${project.title}" class="project-image">
                        <div class="project-badges">
                            <span class="badge badge-secondary">${project.badge}</span>
                        </div>
                    </div>
                    
                    <div class="project-info">
                        <div class="project-stats">
                            <div class="stat">
                                <span class="stat-number">${project.volunteers}</span>
                                <span class="stat-label">Voluntários</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${project.impact}</span>
                                <span class="stat-label">Pessoas Impactadas</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${project.duration}</span>
                                <span class="stat-label">Meses</span>
                            </div>
                        </div>
                        
                        <div class="project-description">
                            ${project.description}
                        </div>
                        
                        <div class="project-requirements">
                            <h5>Requisitos para Participar</h5>
                            <ul>
                                ${project.requirements.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `
        });
    }

    handlePopState(event) {
        if (event.state && event.state.route) {
            this.renderPage(event.state.route);
        }
    }

    updateMetaDescription(description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;
    }
}

// Configuração SPA básica
export function setupSPA() {
    // Interceptar clicks em links internos
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes(window.location.origin)) {
            e.preventDefault();
            const route = link.getAttribute('href').split('/').pop().replace('.html', '').replace('#', '');
            window.ONGApp.navigateTo(route);
        }
    });
}

export default Router;
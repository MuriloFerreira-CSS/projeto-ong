// assets/js/templates.js (atualizado)
import { getFromStorage, saveToStorage } from './storage.js';
import { showModal } from './components/modal.js';

// ... código anterior mantido ...

async function renderProjetosTemplate(html) {
    // Renderizar cards de voluntariado
    const voluntariadoHtml = templateData.voluntariado.map((project, index) => `
        <article class="card">
            <img src="${project.image}" alt="${project.title}">
            <div class="card-content">
                ${project.badge ? `<span class="badge badge-secondary">${project.badge}</span>` : ''}
                <h3>${project.title}</h3>
                <p>${project.content}</p>
                <div class="card-footer">
                    <button class="btn btn-outline btn-sm project-details-btn" data-project="${index}">
                        Ver Detalhes
                    </button>
                    <a href="#cadastro" class="btn btn-sm" data-route="cadastro">Quero Participar</a>
                </div>
            </div>
        </article>
    `).join('');

    // Renderizar cards de doação
    const doacoesHtml = templateData.doacoes.map(doacao => `
        <article class="card">
            <div class="card-content text-center">
                <div style="font-size: 2rem; margin-bottom: 1rem;">${doacao.icon}</div>
                <h3>${doacao.title}</h3>
                <p>${doacao.content}</p>
                <button class="btn btn-outline btn-sm donation-btn">
                    Doar Agora
                </button>
            </div>
        </article>
    `).join('');

    const updatedHtml = html
        .replace('<!-- Cards de voluntariado serão renderizados dinamicamente -->', voluntariadoHtml)
        .replace('<!-- Cards de doação serão renderizados dinamicamente -->', doacoesHtml);

    // Configurar event listeners após o render
    setTimeout(() => {
        setupProjetosInteractions();
    }, 100);

    return updatedHtml;
}

function setupProjetosInteractions() {
    // Botão de relatórios
    const reportsBtn = document.getElementById('show-reports');
    if (reportsBtn) {
        reportsBtn.addEventListener('click', () => {
            showModal('reports');
        });
    }

    // Botões de detalhes do projeto
    const projectDetailBtns = document.querySelectorAll('.project-details-btn');
    projectDetailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectIndex = parseInt(btn.getAttribute('data-project'));
            showProjectDetails(projectIndex);
        });
    });

    // Botões de doação
    const donationBtns = document.querySelectorAll('.donation-btn');
    donationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showModal('donation');
        });
    });
}

function showProjectDetails(projectIndex) {
    const project = templateData.voluntariado[projectIndex];
    if (!project) return;

    // Dados simulados para o projeto
    const projectDetails = {
        volunteers: Math.floor(Math.random() * 100) + 50,
        impact: Math.floor(Math.random() * 1000) + 500,
        duration: Math.floor(Math.random() * 24) + 6,
        description: `${project.content} Este projeto tem como objetivo transformar realidades através de ações concretas e impacto social mensurável. Contamos com uma equipe dedicada e processos bem estabelecidos para garantir o máximo de eficiência e transparência.`,
        requirements: [
            'Disponibilidade de pelo menos 4 horas semanais',
            'Comprometimento com a causa social',
            'Vontade de aprender e contribuir',
            'Boa comunicação e trabalho em equipe'
        ]
    };

    showModal('project-details', {
        title: project.title,
        content: `
            <div class="project-details">
                <div class="project-hero">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <div class="project-badges">
                        ${project.badge ? `<span class="badge badge-secondary">${project.badge}</span>` : ''}
                    </div>
                </div>
                
                <div class="project-info">
                    <div class="project-stats">
                        <div class="stat">
                            <span class="stat-number">${projectDetails.volunteers}</span>
                            <span class="stat-label">Voluntários</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${projectDetails.impact}</span>
                            <span class="stat-label">Pessoas Impactadas</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${projectDetails.duration}</span>
                            <span class="stat-label">Meses</span>
                        </div>
                    </div>
                    
                    <div class="project-description">
                        ${projectDetails.description}
                    </div>
                    
                    <div class="project-requirements">
                        <h5>Requisitos para Participar</h5>
                        <ul>
                            ${projectDetails.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `
    });
    // assets/js/templates.js (GARANTIR TEMPLATE HOME)
const templates = {
    'home-template': `
        <article>
            <section class="hero">
                <h1>Conectando Causas Sociais com Pessoas que se Importam</h1>
                <p>Transforme realidades através do voluntariado e da doação</p>
                <a href="#projetos" class="btn" data-route="projetos">Conhecer Projetos</a>
            </section>

            <section>
                <h2>Sobre Nossa Organização</h2>
                <p>A ONG Brasil nasceu da necessidade de conectar organizações sociais com pessoas dispostas a fazer a diferença. Atuamos como uma ponte entre causas sociais e aqueles que desejam contribuir com tempo, recursos ou habilidades.</p>
                
                <div class="cards-container" id="about-cards">
                    <!-- Cards serão renderizados dinamicamente -->
                </div>
            </section>

            <section>
                <h2>Nossa História e Conquistas</h2>
                <p>Fundada em 2015, a ONG Brasil já facilitou a conexão de mais de 500 organizações com milhares de voluntários e doadores. Nossos números falam por si:</p>
                
                <div class="cards-container" id="stats-cards">
                    <!-- Estatísticas serão renderizadas dinamicamente -->
                </div>
            </section>

            <section>
                <h2>Entre em Contato</h2>
                <div class="contact-info">
                    <div class="contact-item">
                        <h3>Endereço</h3>
                        <p>Rua das Organizações, 123<br>Centro, São Paulo - SP<br>CEP: 01234-567</p>
                    </div>
                    
                    <div class="contact-item">
                        <h3>Telefone</h3>
                        <p>(11) 3456-7890</p>
                    </div>
                    
                    <div class="contact-item">
                        <h3>E-mail</h3>
                        <p>contato@ongbrasil.org.br</p>
                    </div>
                    
                    <div class="contact-item">
                        <h3>Horário de Atendimento</h3>
                        <p>Segunda a Sexta: 9h às 18h<br>Sábado: 9h às 13h</p>
                    </div>
                </div>
            </section>
        </article>
    `,
    // ... outros templates mantidos ...
};
}
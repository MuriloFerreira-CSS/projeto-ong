// assets/js/components/modal.js
import { showToast } from '../utils/helpers.js';

export class Modal {
    constructor(options = {}) {
        this.id = options.id || `modal-${Date.now()}`;
        this.title = options.title || '';
        this.content = options.content || '';
        this.size = options.size || 'md'; // sm, md, lg, xl
        this.onClose = options.onClose || null;
        this.onConfirm = options.onConfirm || null;
        this.confirmText = options.confirmText || 'Confirmar';
        this.cancelText = options.cancelText || 'Cancelar';
        this.showConfirm = options.showConfirm !== false;
        this.showCancel = options.showCancel !== false;
        this.closeOnBackdrop = options.closeOnBackdrop !== false;
        this.closeOnEscape = options.closeOnEscape !== false;
        
        this.modalElement = null;
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div class="modal-overlay" id="${this.id}-overlay">
                <div class="modal-container modal-${this.size}">
                    <div class="modal-header">
                        <h3 class="modal-title">${this.title}</h3>
                        <button type="button" class="modal-close" aria-label="Fechar">
                            &times;
                        </button>
                    </div>
                    <div class="modal-body">
                        ${this.content}
                    </div>
                    ${this.showConfirm || this.showCancel ? `
                    <div class="modal-footer">
                        ${this.showCancel ? `
                            <button type="button" class="btn btn-outline modal-cancel">
                                ${this.cancelText}
                            </button>
                        ` : ''}
                        ${this.showConfirm ? `
                            <button type="button" class="btn btn-primary modal-confirm">
                                ${this.confirmText}
                            </button>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Criar elemento modal
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal';
        modalContainer.id = this.id;
        modalContainer.innerHTML = modalHTML;
        
        document.body.appendChild(modalContainer);
        this.modalElement = modalContainer;
    }

    setupEventListeners() {
        // Botão fechar
        const closeBtn = this.modalElement.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Botão cancelar
        const cancelBtn = this.modalElement.querySelector('.modal-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        // Botão confirmar
        const confirmBtn = this.modalElement.querySelector('.modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.handleConfirm());
        }

        // Fechar no backdrop
        if (this.closeOnBackdrop) {
            const overlay = this.modalElement.querySelector('.modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.close();
                    }
                });
            }
        }

        // Fechar com ESC
        if (this.closeOnEscape) {
            this.escapeHandler = (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            };
            document.addEventListener('keydown', this.escapeHandler);
        }
    }

    open() {
        if (this.isOpen) return;
        
        this.modalElement.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        // Animar entrada
        setTimeout(() => {
            this.modalElement.classList.add('active');
        }, 10);

        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('modalOpened', {
            detail: { modalId: this.id }
        }));
    }

    close() {
        if (!this.isOpen) return;
        
        this.modalElement.classList.remove('active');
        
        setTimeout(() => {
            this.modalElement.style.display = 'none';
            document.body.style.overflow = '';
            this.isOpen = false;
            
            if (this.onClose) {
                this.onClose();
            }

            // Disparar evento personalizado
            window.dispatchEvent(new CustomEvent('modalClosed', {
                detail: { modalId: this.id }
            }));
        }, 300);
    }

    handleConfirm() {
        if (this.onConfirm) {
            const result = this.onConfirm();
            if (result !== false) {
                this.close();
            }
        } else {
            this.close();
        }
    }

    updateContent(newContent) {
        const modalBody = this.modalElement.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = newContent;
        }
    }

    updateTitle(newTitle) {
        const modalTitle = this.modalElement.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = newTitle;
        }
    }

    destroy() {
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
        }
        
        if (this.modalElement && this.modalElement.parentNode) {
            this.modalElement.parentNode.removeChild(this.modalElement);
        }
    }
}

// Modal Manager para gerenciar múltiplos modals
export class ModalManager {
    constructor() {
        this.modals = new Map();
        this.init();
    }

    init() {
        // Configurar modais globais
        this.setupGlobalModals();
    }

    setupGlobalModals() {
        // Modal de relatórios (para a página de projetos)
        this.createReportsModal();
        
        // Modal de confirmação de doação
        this.createDonationModal();
        
        // Modal de detalhes do projeto
        this.createProjectDetailsModal();
    }

    createReportsModal() {
        const reportsModal = new Modal({
            id: 'reports-modal',
            title: 'Relatórios de Transparência',
            size: 'lg',
            content: `
                <div class="reports-content">
                    <div class="alert alert-info">
                        <strong>Transparência Total:</strong> Acreditamos que a prestação de contas é fundamental para manter a confiança de nossos apoiadores.
                    </div>
                    
                    <div class="reports-list">
                        <div class="report-item">
                            <h4>Relatório Anual 2023</h4>
                            <p>Relatório completo de atividades, finanças e impactos do ano de 2023.</p>
                            <div class="report-meta">
                                <span class="badge">PDF</span>
                                <span class="file-size">2.4 MB</span>
                            </div>
                            <button class="btn btn-sm btn-outline download-report" data-report="2023">
                                📥 Baixar Relatório
                            </button>
                        </div>
                        
                        <div class="report-item">
                            <h4>Prestação de Contas - 1º Trimestre 2024</h4>
                            <p>Detalhamento financeiro e de atividades do primeiro trimestre de 2024.</p>
                            <div class="report-meta">
                                <span class="badge">PDF</span>
                                <span class="file-size">1.8 MB</span>
                            </div>
                            <button class="btn btn-sm btn-outline download-report" data-report="2024-q1">
                                📥 Baixar Relatório
                            </button>
                        </div>
                        
                        <div class="report-item">
                            <h4>Auditoria Independente 2023</h4>
                            <p>Relatório de auditoria externa realizada por empresa independente.</p>
                            <div class="report-meta">
                                <span class="badge">PDF</span>
                                <span class="file-size">3.1 MB</span>
                            </div>
                            <button class="btn btn-sm btn-outline download-report" data-report="auditoria-2023">
                                📥 Baixar Relatório
                            </button>
                        </div>
                    </div>
                </div>
            `,
            showConfirm: false,
            showCancel: false
        });

        this.modals.set('reports', reportsModal);
    }

    createDonationModal() {
        const donationModal = new Modal({
            id: 'donation-modal',
            title: 'Fazer Doação',
            size: 'md',
            content: `
                <form id="donation-form" class="donation-form">
                    <div class="form-group">
                        <label for="donation-amount">Valor da Doação (R$)</label>
                        <input type="number" id="donation-amount" name="amount" min="10" value="50" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="donation-type">Tipo de Doação</label>
                        <select id="donation-type" name="type" class="form-control" required>
                            <option value="unica">Doação Única</option>
                            <option value="mensal">Doação Mensal</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="donation-project">Projeto Destino</label>
                        <select id="donation-project" name="project" class="form-control" required>
                            <option value="">Onde for mais necessário</option>
                            <option value="educacao">Educação</option>
                            <option value="meio-ambiente">Meio Ambiente</option>
                            <option value="assistencia">Assistência Social</option>
                        </select>
                    </div>
                    
                    <div class="payment-methods">
                        <h5>Método de Pagamento</h5>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="payment-method" value="pix" checked>
                                <span class="payment-icon">📱</span>
                                <span class="payment-text">PIX</span>
                            </label>
                            
                            <label class="payment-option">
                                <input type="radio" name="payment-method" value="cartao">
                                <span class="payment-icon">💳</span>
                                <span class="payment-text">Cartão</span>
                            </label>
                            
                            <label class="payment-option">
                                <input type="radio" name="payment-method" value="boleto">
                                <span class="payment-icon">📄</span>
                                <span class="payment-text">Boleto</span>
                            </label>
                        </div>
                    </div>
                </form>
            `,
            confirmText: 'Confirmar Doação',
            cancelText: 'Cancelar',
            onConfirm: () => this.handleDonation()
        });

        this.modals.set('donation', donationModal);
    }

    createProjectDetailsModal() {
        const projectModal = new Modal({
            id: 'project-details-modal',
            title: 'Detalhes do Projeto',
            size: 'lg',
            content: `
                <div class="project-details">
                    <div class="project-hero">
                        <img id="project-detail-image" src="" alt="" class="project-image">
                        <div class="project-badges" id="project-badges"></div>
                    </div>
                    
                    <div class="project-info">
                        <div class="project-stats">
                            <div class="stat">
                                <span class="stat-number" id="stat-volunteers">0</span>
                                <span class="stat-label">Voluntários</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number" id="stat-impact">0</span>
                                <span class="stat-label">Pessoas Impactadas</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number" id="stat-duration">0</span>
                                <span class="stat-label">Meses</span>
                            </div>
                        </div>
                        
                        <div class="project-description" id="project-description"></div>
                        
                        <div class="project-requirements">
                            <h5>Requisitos para Participar</h5>
                            <ul id="project-requirements"></ul>
                        </div>
                    </div>
                </div>
            `,
            confirmText: 'Quero Participar',
            cancelText: 'Fechar',
            onConfirm: () => {
                window.ONGApp.navigateTo('cadastro');
                return true;
            }
        });

        this.modals.set('project-details', projectModal);
    }

    handleDonation() {
        const form = document.getElementById('donation-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simular processamento de doação
        showToast(`Doação de R$ ${data.amount} processada com sucesso!`, 'success');
        
        // Em uma aplicação real, aqui iria a integração com o gateway de pagamento
        console.log('Dados da doação:', data);
        
        return true;
    }

    showModal(modalName, options = {}) {
        const modal = this.modals.get(modalName);
        if (modal) {
            if (options.content) {
                modal.updateContent(options.content);
            }
            if (options.title) {
                modal.updateTitle(options.title);
            }
            modal.open();
            return modal;
        }
        return null;
    }

    closeModal(modalName) {
        const modal = this.modals.get(modalName);
        if (modal) {
            modal.close();
        }
    }

    createQuickModal(options) {
        const modal = new Modal(options);
        modal.open();
        return modal;
    }
}

// Inicializar e exportar instância global
export const modalManager = new ModalManager();

// Funções de conveniência para uso global
export function showModal(modalName, options = {}) {
    return modalManager.showModal(modalName, options);
}

export function closeModal(modalName) {
    return modalManager.closeModal(modalName);
}

export function createModal(options) {
    return modalManager.createQuickModal(options);
}
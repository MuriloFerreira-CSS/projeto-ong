// assets/js/components/forms.js (atualizado)
import { FormValidator } from '../validation.js';
import { FormDraftManager } from '../storage.js';
import { debounce, showToast } from '../utils/helpers.js';
import { showModal } from './modal.js';

export function initForms() {
    // Inicializar validação de formulários
    initFormValidation();
    
    // Configurar salvamento automático de rascunhos
    setupAutoSave();
    
    // Configurar campos condicionais
    setupConditionalFields();
    
    // Configurar modais de formulário
    setupFormModals();
}

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id) {
            new FormValidator(form.id);
        }
    });
}

function setupAutoSave() {
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        // Carregar rascunho salvo
        loadDraft(formCadastro);
        
        // Salvar rascunho automaticamente
        const saveDraft = debounce(() => {
            const formData = new FormData(formCadastro);
            const data = Object.fromEntries(formData.entries());
            FormDraftManager.saveDraft('cadastro', data);
        }, 1000);
        
        formCadastro.addEventListener('input', saveDraft);
    }
}

function loadDraft(form) {
    const draft = FormDraftManager.getDraft('cadastro');
    if (draft && draft.data) {
        Object.keys(draft.data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field && draft.data[key]) {
                field.value = draft.data[key];
            }
        });
        
        // Mostrar notificação de rascunho carregado
        if (Object.values(draft.data).some(value => value)) {
            showToast('Rascunho do formulário carregado', 'info');
        }
    }
}

function setupConditionalFields() {
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
    }
}

function setupFormModals() {
    // Modal de confirmação antes de enviar formulários importantes
    setupConfirmationModals();
    
    // Modal de ajuda para campos complexos
    setupHelpModals();
}

function setupConfirmationModals() {
    const forms = document.querySelectorAll('form[data-confirm]');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.hasAttribute('data-confirmed')) {
                e.preventDefault();
                
                const message = form.getAttribute('data-confirm') || 'Tem certeza que deseja enviar este formulário?';
                
                showModal('confirmation', {
                    title: 'Confirmação',
                    content: `
                        <div class="confirmation-content">
                            <p>${message}</p>
                            <div class="alert alert-info">
                                <strong>Importante:</strong> Após o envio, não será possível alterar os dados.
                            </div>
                        </div>
                    `,
                    confirmText: 'Sim, Enviar',
                    cancelText: 'Cancelar',
                    onConfirm: () => {
                        form.setAttribute('data-confirmed', 'true');
                        form.submit();
                    }
                });
            }
        });
    });
}

function setupHelpModals() {
    // Adicionar ícones de ajuda aos campos
    const helpFields = document.querySelectorAll('[data-help]');
    
    helpFields.forEach(field => {
        const helpText = field.getAttribute('data-help');
        const helpIcon = document.createElement('span');
        helpIcon.className = 'help-icon';
        helpIcon.textContent = '?';
        helpIcon.title = 'Clique para ajuda';
        
        helpIcon.addEventListener('click', () => {
            showModal('help', {
                title: 'Ajuda',
                content: `
                    <div class="help-content">
                        <h4>${field.previousElementSibling?.textContent || 'Ajuda'}</h4>
                        <p>${helpText}</p>
                    </div>
                `,
                showConfirm: false,
                showCancel: false
            });
        });
        
        field.parentNode.appendChild(helpIcon);
    });
}
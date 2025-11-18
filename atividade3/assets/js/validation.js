
// assets/js/validation.js
import { showToast } from './utils/helpers.js';

export class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.errors = {};
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        // Configurar validação em tempo real
        this.setupRealTimeValidation();
        
        // Configurar submit do formulário
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Configurar máscaras
        this.setupMasks();
    }

    setupRealTimeValidation() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
            
            // Validação especial para alguns campos
            if (field.type === 'email') {
                field.addEventListener('input', () => this.validateEmail(field));
            }
            
            if (field.name === 'cpf') {
                field.addEventListener('input', () => this.validateCPF(field));
            }
        });
    }

    setupMasks() {
        // Máscara para CPF
        const cpfField = this.form.querySelector('#cpf');
        if (cpfField) {
            cpfField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                
                if (value.length > 9) {
                    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                } else if (value.length > 3) {
                    value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                }
                
                e.target.value = value;
            });
        }

        // Máscara para telefone
        const telefoneField = this.form.querySelector('#telefone');
        if (telefoneField) {
            telefoneField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                
                if (value.length > 10) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else if (value.length > 0) {
                    value = value.replace(/(\d{0,2})/, '($1');
                }
                
                e.target.value = value;
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const pattern = field.getAttribute('pattern');
        
        // Limpar erro anterior
        this.clearFieldError(field);
        
        // Validar campo obrigatório
        if (isRequired && !value) {
            this.showFieldError(field, 'Este campo é obrigatório');
            return false;
        }
        
        // Validar padrão específico
        if (pattern && value) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                this.showFieldError(field, 'Formato inválido');
                return false;
            }
        }
        
        // Validações específicas por tipo
        switch (field.type) {
            case 'email':
                if (!this.validateEmail(field)) return false;
                break;
            case 'tel':
                if (!this.validateTelefone(field)) return false;
                break;
        }
        
        // Validações específicas por nome
        switch (field.name) {
            case 'cpf':
                if (!this.validateCPF(field)) return false;
                break;
            case 'email':
                if (!this.validateEmail(field)) return false;
                break;
        }
        
        return true;
    }

    validateEmail(field) {
        const value = field.value.trim();
        if (!value) return true; // Não validar se estiver vazio (a menos que seja required)
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.showFieldError(field, 'Por favor, insira um e-mail válido');
            return false;
        }
        
        return true;
    }

    validateCPF(field) {
        const value = field.value.replace(/\D/g, '');
        if (!value) return true;
        
        if (value.length !== 11) {
            this.showFieldError(field, 'CPF deve ter 11 dígitos');
            return false;
        }
        
        // Validação básica de CPF (pode ser expandida)
        if (/^(\d)\1+$/.test(value)) {
            this.showFieldError(field, 'CPF inválido');
            return false;
        }
        
        return true;
    }

    validateTelefone(field) {
        const value = field.value.replace(/\D/g, '');
        if (!value) return true;
        
        if (value.length < 10 || value.length > 11) {
            this.showFieldError(field, 'Telefone deve ter 10 ou 11 dígitos');
            return false;
        }
        
        return true;
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
        
        // Adicionar aos erros
        this.errors[field.name] = message;
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        delete this.errors[field.name];
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        // Validar todos os campos
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showToast('Por favor, corrija os erros no formulário', 'error');
            this.showSummaryErrors();
            return;
        }
        
        // Se tudo estiver válido, processar o formulário
        await this.processForm();
    }

    showSummaryErrors() {
        const errorCount = Object.keys(this.errors).length;
        if (errorCount > 0) {
            const summary = document.createElement('div');
            summary.className = 'alert alert-error';
            summary.innerHTML = `
                <strong>Erros no formulário:</strong>
                <ul>
                    ${Object.values(this.errors).map(error => `<li>${error}</li>`).join('')}
                </ul>
            `;
            
            // Inserir no início do formulário
            this.form.insertBefore(summary, this.form.firstChild);
            
            // Remover após 5 segundos
            setTimeout(() => {
                summary.remove();
            }, 5000);
        }
    }

    async processForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simular envio para API
            await this.submitToAPI(data);
            
            // Mostrar sucesso
            this.showSuccess();
            
            // Limpar formulário
            this.form.reset();
            
        } catch (error) {
            showToast('Erro ao processar cadastro. Tente novamente.', 'error');
            console.error('Erro no cadastro:', error);
        }
    }

    async submitToAPI(data) {
        // Simular requisição API
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular falha aleatória para teste
                if (Math.random() < 0.1) { // 10% de chance de falha
                    reject(new Error('Erro de conexão'));
                } else {
                    resolve({ success: true, id: Math.random().toString(36).substr(2, 9) });
                }
            }, 1000);
        });
    }

    showSuccess() {
        const successElement = document.getElementById('cadastro-success');
        if (successElement) {
            successElement.style.display = 'block';
            
            // Rolar para o topo para mostrar a mensagem
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Esconder após 5 segundos
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 5000);
        }
        
        showToast('Cadastro realizado com sucesso!', 'success');
    }
}

// Inicializar validadores para todos os formulários
export function initFormValidators() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        new FormValidator(form.id);
    });
}
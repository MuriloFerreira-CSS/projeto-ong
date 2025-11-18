// assets/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Máscaras de formulário
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
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
    
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
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
    
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }

    // Validação do formulário de cadastro
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Limpar erros anteriores
            clearErrors();
            
            let isValid = true;
            
            // Validar campos obrigatórios
            const requiredFields = formCadastro.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showFieldError(field, 'Este campo é obrigatório');
                    isValid = false;
                }
            });
            
            // Validações específicas
            const cpf = document.getElementById('cpf');
            if (cpf && cpf.value && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value)) {
                showFieldError(cpf, 'Por favor, insira um CPF válido.');
                isValid = false;
            }
            
            const telefone = document.getElementById('telefone');
            if (telefone && telefone.value && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone.value)) {
                showFieldError(telefone, 'Por favor, insira um telefone válido.');
                isValid = false;
            }
            
            const cep = document.getElementById('cep');
            if (cep && cep.value && !/^\d{5}-\d{3}$/.test(cep.value)) {
                showFieldError(cep, 'Por favor, insira um CEP válido.');
                isValid = false;
            }
            
            const email = document.getElementById('email');
            if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                showFieldError(email, 'Por favor, insira um e-mail válido.');
                isValid = false;
            }
            
            if (!isValid) {
                showToast('Por favor, corrija os erros no formulário', 'error');
                return;
            }
            
            // Se tudo estiver válido, mostrar sucesso
            showSuccess();
        });
    }
    
    // Botão de relatórios
    const reportsBtn = document.getElementById('show-reports');
    if (reportsBtn) {
        reportsBtn.addEventListener('click', function() {
            showReportsModal();
        });
    }

    // Funções de validação
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearErrors() {
        const errorFields = document.querySelectorAll('.is-invalid');
        errorFields.forEach(field => {
            field.classList.remove('is-invalid');
        });
        
        const errorMessages = document.querySelectorAll('.invalid-feedback');
        errorMessages.forEach(message => {
            message.remove();
        });
    }
    
    function showSuccess() {
        const successElement = document.getElementById('cadastro-success');
        if (successElement) {
            successElement.style.display = 'block';
            formCadastro.reset();
            
            // Rolar para mostrar a mensagem de sucesso
            successElement.scrollIntoView({ behavior: 'smooth' });
            
            showToast('Cadastro realizado com sucesso!', 'success');
        }
    }
    
    function showToast(message, type = 'info') {
        // Criar elemento toast
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
        
        // Adicionar estilos de animação se não existirem
        if (!document.querySelector('#toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'toast-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    function showReportsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h2>Relatórios de Transparência</h2>
                <div class="reports-content">
                    <div class="alert alert-success">
                        <strong>Transparência Total:</strong> Acreditamos que a prestação de contas é fundamental para manter a confiança.
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
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar modal
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            modal.remove();
        });
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Botões de download
        const downloadBtns = modal.querySelectorAll('.download-report');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const report = btn.getAttribute('data-report');
                showToast(`Download do relatório ${report} iniciado`, 'success');
                // Simular download
                setTimeout(() => {
                    showToast(`Relatório ${report} baixado com sucesso!`, 'success');
                }, 2000);
            });
        });
    }

    // Validação em tempo real
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
                const errorMessage = this.parentNode.querySelector('.invalid-feedback');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });
});
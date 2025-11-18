// assets/js/script.js
document.addEventListener('DOMContentLoaded', function() {
  // Elementos da navegação mobile
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const closeMenu = document.querySelector('.close-menu');
  
  // Abrir menu mobile
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navMobile.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Fechar menu mobile
  if (closeMenu) {
    closeMenu.addEventListener('click', function() {
      navMobile.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Fechar menu ao clicar em um link
  const mobileLinks = document.querySelectorAll('.nav-mobile a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMobile.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Máscaras de formulário (mantido do código original)
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

  // Validação do formulário de cadastro aprimorada
  const formCadastro = document.getElementById('form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Remover mensagens de erro anteriores
      clearErrors();
      
      let isValid = true;
      
      // Validação de campos obrigatórios
      const requiredFields = formCadastro.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          showError(field, 'Este campo é obrigatório');
          isValid = false;
        }
      });
      
      // Validação específica de campos com máscara
      const cpf = document.getElementById('cpf');
      if (cpf && cpf.value && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value)) {
        showError(cpf, 'Por favor, insira um CPF válido.');
        isValid = false;
      }
      
      const telefone = document.getElementById('telefone');
      if (telefone && telefone.value && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone.value)) {
        showError(telefone, 'Por favor, insira um telefone válido.');
        isValid = false;
      }
      
      const cep = document.getElementById('cep');
      if (cep && cep.value && !/^\d{5}-\d{3}$/.test(cep.value)) {
        showError(cep, 'Por favor, insira um CEP válido.');
        isValid = false;
      }
      
      const email = document.getElementById('email');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Por favor, insira um e-mail válido.');
        isValid = false;
      }
      
      // Se tudo estiver válido, mostrar modal de sucesso
      if (isValid) {
        showSuccessModal();
      }
    });
  }
  
  // Função para mostrar erros de validação
  function showError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
  }
  
  // Função para limpar erros
  function clearErrors() {
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
      field.classList.remove('error');
    });
    
    const errorMessages = document.querySelectorAll('.alert-error');
    errorMessages.forEach(message => {
      message.remove();
    });
  }
  
  // Modal de sucesso
  function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <h2>Cadastro Realizado com Sucesso!</h2>
        <p>Obrigado por se cadastrar na ONG Brasil. Em breve entraremos em contato para dar continuidade ao seu processo.</p>
        <div style="margin-top: 1.5rem;">
          <button class="btn btn-primary" id="close-success-modal">Fechar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    const closeModal = modal.querySelector('.close-modal');
    const closeBtn = modal.querySelector('#close-success-modal');
    
    function closeSuccessModal() {
      modal.remove();
      formCadastro.reset();
    }
    
    closeModal.addEventListener('click', closeSuccessModal);
    closeBtn.addEventListener('click', closeSuccessModal);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeSuccessModal();
      }
    });
  }
  
  // Adicionar classes de validação em tempo real
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.hasAttribute('required') && !this.value.trim()) {
        this.classList.add('error');
      } else {
        this.classList.remove('error');
      }
    });
    
    input.addEventListener('input', function() {
      if (this.classList.contains('error') && this.value.trim()) {
        this.classList.remove('error');
        const errorMessage = this.parentNode.querySelector('.alert-error');
        if (errorMessage) {
          errorMessage.remove();
        }
      }
    });
  });
  
  // Toast notifications (exemplo)
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '1001';
    toast.style.maxWidth = '300px';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
});
// Script para máscaras de formulário
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para CPF
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
    
    // Máscara para telefone
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
    
    // Máscara para CEP
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
            
            // Validação básica - você pode adicionar mais validações aqui
            const cpf = document.getElementById('cpf').value;
            const telefone = document.getElementById('telefone').value;
            const cep = document.getElementById('cep').value;
            
            // Verificar se os campos com máscara estão preenchidos corretamente
            if (cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
                alert('Por favor, insira um CPF válido.');
                return;
            }
            
            if (telefone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone)) {
                alert('Por favor, insira um telefone válido.');
                return;
            }
            
            if (cep && !/^\d{5}-\d{3}$/.test(cep)) {
                alert('Por favor, insira um CEP válido.');
                return;
            }
            
            // Se tudo estiver válido, pode enviar o formulário
            alert('Cadastro realizado com sucesso! Em breve entraremos em contato.');
            formCadastro.reset();
        });
    }
});
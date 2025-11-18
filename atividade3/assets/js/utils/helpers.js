// assets/js/utils/helpers.js
export function showToast(message, type = 'info', duration = 5000) {
    // Remover toasts anteriores
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `custom-toast alert alert-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        animation: slideIn 0.3s ease-out;
    `;
    
    toast.innerHTML = `
        <div class="toast-content">
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${message}
        </div>
        <button class="toast-close" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Botão de fechar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    // Remover automaticamente após a duração
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, duration);
    
    // Adicionar estilos de animação se não existirem
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .custom-toast {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .toast-close {
                margin-left: 1rem;
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0.7;
            }
            .toast-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(styles);
    }
}

export function showLoading() {
    let loading = document.getElementById('global-loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'global-loading';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loading.innerHTML = `
            <div class="spinner" style="
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #2E8B57;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        `;
        document.body.appendChild(loading);
        
        // Adicionar estilos de animação
        if (!document.querySelector('#loading-styles')) {
            const styles = document.createElement('style');
            styles.id = 'loading-styles';
            styles.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }
    }
    loading.style.display = 'flex';
}

export function hideLoading() {
    const loading = document.getElementById('global-loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

export function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

export function formatCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(phone) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
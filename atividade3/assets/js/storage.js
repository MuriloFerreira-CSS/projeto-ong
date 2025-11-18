// assets/js/storage.js
const STORAGE_KEYS = {
    USER_DATA: 'ong_user_data',
    FORM_DRAFTS: 'ong_form_drafts',
    PREFERENCES: 'ong_preferences'
};

export class StorageManager {
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    static getFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return defaultValue;
        }
    }

    static removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    static clearStorage() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }
}

// Gerenciador específico para dados de usuário
export class UserDataManager {
    static saveUserData(userData) {
        return StorageManager.saveToStorage(STORAGE_KEYS.USER_DATA, userData);
    }

    static getUserData() {
        return StorageManager.getFromStorage(STORAGE_KEYS.USER_DATA, {});
    }

    static clearUserData() {
        return StorageManager.removeFromStorage(STORAGE_KEYS.USER_DATA);
    }
}

// Gerenciador para rascunhos de formulários
export class FormDraftManager {
    static saveDraft(formId, data) {
        const drafts = StorageManager.getFromStorage(STORAGE_KEYS.FORM_DRAFTS, {});
        drafts[formId] = {
            data,
            timestamp: new Date().toISOString()
        };
        return StorageManager.saveToStorage(STORAGE_KEYS.FORM_DRAFTS, drafts);
    }

    static getDraft(formId) {
        const drafts = StorageManager.getFromStorage(STORAGE_KEYS.FORM_DRAFTS, {});
        return drafts[formId] || null;
    }

    static clearDraft(formId) {
        const drafts = StorageManager.getFromStorage(STORAGE_KEYS.FORM_DRAFTS, {});
        delete drafts[formId];
        return StorageManager.saveToStorage(STORAGE_KEYS.FORM_DRAFTS, drafts);
    }

    static clearAllDrafts() {
        return StorageManager.removeFromStorage(STORAGE_KEYS.FORM_DRAFTS);
    }
}

// Funções de conveniência para export
export function saveToStorage(key, data) {
    return StorageManager.saveToStorage(key, data);
}

export function getFromStorage(key, defaultValue = null) {
    return StorageManager.getFromStorage(key, defaultValue);
}

export function removeFromStorage(key) {
    return StorageManager.removeFromStorage(key);
}
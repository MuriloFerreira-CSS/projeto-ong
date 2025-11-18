// assets/js/utils/constants.js
export const VALIDATION_RULES = {
    REQUIRED: 'required',
    EMAIL: 'email',
    CPF: 'cpf',
    PHONE: 'phone',
    MIN_LENGTH: 'minLength',
    MAX_LENGTH: 'maxLength',
    PATTERN: 'pattern'
};

export const ERROR_MESSAGES = {
    REQUIRED: 'Este campo é obrigatório',
    EMAIL: 'Por favor, insira um e-mail válido',
    CPF: 'Por favor, insira um CPF válido',
    PHONE: 'Por favor, insira um telefone válido',
    MIN_LENGTH: 'O campo deve ter pelo menos {min} caracteres',
    MAX_LENGTH: 'O campo deve ter no máximo {max} caracteres',
    PATTERN: 'Formato inválido'
};

export const STORAGE_KEYS = {
    USER_PREFERENCES: 'ong_user_preferences',
    FORM_DATA: 'ong_form_data',
    SESSION: 'ong_session'
};

export const API_ENDPOINTS = {
    BASE: '/api',
    USERS: '/users',
    PROJECTS: '/projects',
    DONATIONS: '/donations'
};
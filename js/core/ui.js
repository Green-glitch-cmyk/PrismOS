// ============================================================
// UI: тосты и модалки вместо alert/confirm/prompt
// ============================================================

const UI = {
    _backdrop: null,
    _toastContainer: null,
    _modalKeyHandler: null,

    init: function() {
        this._backdrop = document.getElementById('modal-backdrop');
        this._toastContainer = document.getElementById('toast-container');
    },

    // ---------- ТОСТЫ ----------
    toast: function(message, opts = {}) {
        if (!this._toastContainer) this.init();
        if (!this._toastContainer) return;

        const type = opts.type || 'info';        // info | success | warning | error
        const icon = opts.icon || {
            info:    'fa-circle-info',
            success: 'fa-circle-check',
            warning: 'fa-triangle-exclamation',
            error:   'fa-circle-xmark',
        }[type] || 'fa-circle-info';

        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.innerHTML = `
            <i class="fas ${icon} toast-icon"></i>
            <div>${message}</div>
        `;
        this._toastContainer.appendChild(el);

        const timeout = opts.timeout ?? 3000;
        setTimeout(() => {
            el.classList.add('out');
            setTimeout(() => el.remove(), 300);
        }, timeout);
    },

    notify: function(message, opts = {}) {
        Sounds.notify();
        this.toast(message, { type: opts.type || 'info', ...opts });
    },

    error: function(message, opts = {}) {
        Sounds.error();
        return this.alert(message, {
            title: opts.title || 'Ошибка',
            icon: 'fa-circle-xmark',
            iconColor: '#e74c3c',
            ...opts,
        });
    },

    // ---------- МОДАЛКИ ----------
    _openModal: function({ title, message, icon, iconColor, buttons, input }) {
        return new Promise((resolve) => {
            if (!this._backdrop) this.init();
            this._backdrop.innerHTML = '';

            const modal = document.createElement('div');
            modal.className = 'modal';

            const headerIcon = icon
                ? `<i class="fas ${icon} modal-icon" style="color:${iconColor || '#f1c40f'};"></i>`
                : '';

            modal.innerHTML = `
                <div class="modal-header">
                    ${headerIcon}
                    <div class="modal-title">${title}</div>
                </div>
                <div class="modal-body">
                    ${message}
                    ${input ? `<input class="modal-input" type="${input.type || 'text'}"
                                    placeholder="${input.placeholder || ''}"
                                    value="${input.value || ''}">` : ''}
                </div>
                <div class="modal-actions"></div>
            `;

            const actions = modal.querySelector('.modal-actions');
            const inputEl = modal.querySelector('.modal-input');

            buttons.forEach((b, i) => {
                const btn = document.createElement('button');
                btn.className = `modal-btn ${b.variant || ''}`;
                btn.textContent = b.label;
                btn.addEventListener('click', () => {
                    const value = input ? (inputEl.value || '') : undefined;
                    this._closeModal();
                    resolve(b.value !== undefined ? b.value : value);
                });
                actions.appendChild(btn);
            });

            this._backdrop.appendChild(modal);
            this._backdrop.classList.add('show');

            setTimeout(() => {
                if (inputEl) inputEl.focus();
                else actions.querySelector('.primary, .danger, .modal-btn')?.focus();
            }, 50);

            // Esc закрывает
            this._modalKeyHandler = (e) => {
                if (e.key === 'Escape') {
                    this._closeModal();
                    resolve(input ? null : false);
                } else if (e.key === 'Enter' && inputEl) {
                    this._closeModal();
                    resolve(inputEl.value || '');
                }
            };
            document.addEventListener('keydown', this._modalKeyHandler);
        });
    },

    _closeModal: function() {
        if (!this._backdrop) return;
        this._backdrop.classList.remove('show');
        this._backdrop.innerHTML = '';
        if (this._modalKeyHandler) {
            document.removeEventListener('keydown', this._modalKeyHandler);
            this._modalKeyHandler = null;
        }
    },

    alert: function(message, opts = {}) {
        return this._openModal({
            title: opts.title || 'Сообщение',
            message,
            icon: opts.icon,
            iconColor: opts.iconColor,
            buttons: [{ label: opts.okText || 'ОК', variant: 'primary', value: true }],
        });
    },

    confirm: function(message, opts = {}) {
        return this._openModal({
            title: opts.title || 'Подтверждение',
            message,
            icon: opts.icon || 'fa-circle-question',
            iconColor: opts.iconColor || '#f1c40f',
            buttons: [
                { label: opts.cancelText || 'Отмена', variant: '',       value: false },
                { label: opts.okText     || 'Да',     variant: 'primary', value: true  },
            ],
        });
    },

    prompt: function(message, defaultValue = '', opts = {}) {
        return this._openModal({
            title: opts.title || 'Ввод',
            message,
            icon: opts.icon,
            iconColor: opts.iconColor,
            input: {
                value: defaultValue,
                placeholder: opts.placeholder || '',
                type: opts.type || 'text',
            },
            buttons: [
                { label: 'Отмена', variant: '',        value: null },
                { label: 'ОК',     variant: 'primary' },
            ],
        });
    },
};

document.addEventListener('DOMContentLoaded', function() {
    UI.init();
});
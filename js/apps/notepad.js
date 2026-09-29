const NotepadApp = {
    id: 'notepad',
    title: 'Блокнот',

    getContent: function() {
        return `
            <div style="display:flex; flex-direction:column; gap:12px; height:100%;">
                <textarea id="notepad-area"
                    style="flex:1; min-height:160px; width:100%; border:2px solid #aaa; padding:10px;
                           font-family:inherit; resize:none; border-radius:4px;"
                    placeholder="Пиши здесь..."></textarea>
                <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                    <button class="btn-metro" id="notepad-save">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="btn-metro" id="notepad-clear">
                        <i class="fas fa-eraser"></i> Очистить
                    </button>
                    <span id="notepad-status" style="font-size:13px; color:#666; margin-left:auto;">
                        0 символов
                    </span>
                </div>
            </div>
        `;
    },

    init: function(winElement) {
        const area = winElement.querySelector('#notepad-area');
        const status = winElement.querySelector('#notepad-status');
        const saveBtn = winElement.querySelector('#notepad-save');
        const clearBtn = winElement.querySelector('#notepad-clear');

        area.value = localStorage.getItem('prismos.notepad') || '';

        const updateStatus = () => {
            status.textContent = `${area.value.length} символов`;
        };
        updateStatus();

        area.addEventListener('input', updateStatus);

        saveBtn.addEventListener('click', () => {
            localStorage.setItem('prismos.notepad', area.value);
            status.textContent = `Сохранено · ${area.value.length} символов`;
        });

        clearBtn.addEventListener('click', () => {
            if (!confirm('Очистить текст?')) return;
            area.value = '';
            localStorage.removeItem('prismos.notepad');
            updateStatus();
        });
    }
};
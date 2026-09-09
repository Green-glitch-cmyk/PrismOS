const NotepadApp = {
    id: 'notepad',
    title: 'Блокнот',
    
    getContent: function() {
        return `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="border:2px solid #999; background:#fff; padding:12px;">
                    <textarea style="width:100%; height:120px; border:2px solid #aaa; padding:8px; font-family:inherit; resize:vertical;">Привет, PrismOS! ✨</textarea>
                </div>
                <div style="display:flex; gap:12px;">
                    <button class="btn-metro" onclick="alert('Сохранено (демо)')">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="btn-metro" onclick="alert('Очищено')">
                        <i class="fas fa-eraser"></i> Очистить
                    </button>
                </div>
            </div>
        `;
    }
};
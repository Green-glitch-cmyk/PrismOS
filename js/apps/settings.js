const SettingsApp = {
    id: 'settings',
    title: 'Параметры',
    
    getContent: function() {
        return `
            <div class="metro-panel">
                <h3><i class="fas fa-sliders-h" style="color:#2ecc71;"></i> Параметры PrismOS</h3>
                <ul class="metro-list">
                    <li><i class="fas fa-palette" style="font-size:20px; width:28px; color:#f39c12;"></i> Тема: <strong>Metro</strong></li>
                    <li><i class="fas fa-desktop" style="font-size:20px; width:28px; color:#3498db;"></i> Разрешение: <strong>1920x1080</strong></li>
                    <li><i class="fas fa-volume-up" style="font-size:20px; width:28px; color:#2ecc71;"></i> Звук: <strong>Включён</strong></li>
                    <li><i class="fas fa-sync" style="font-size:20px; width:28px; color:#9b59b6;"></i> Обновления: <strong>включены</strong></li>
                </ul>
                <button class="btn-metro" onclick="alert('Настройки сохранены (демо)')">
                    <i class="fas fa-check"></i> Применить
                </button>
            </div>
        `;
    }
};
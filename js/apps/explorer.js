const ExplorerApp = {
    id: 'explorer',
    title: 'Проводник',
    
    getContent: function() {
        return `
            <div class="metro-panel">
                <h3><i class="fas fa-folder-open" style="color:#f1c40f;"></i> Проводник PrismOS</h3>
                <ul class="metro-list">
                    <li><i class="fas fa-desktop" style="font-size:20px; width:28px; color:#3498db;"></i> Этот компьютер</li>
                    <li><i class="fas fa-folder" style="font-size:20px; width:28px; color:#f1c40f;"></i> Документы</li>
                    <li><i class="fas fa-images" style="font-size:20px; width:28px; color:#2ecc71;"></i> Изображения</li>
                    <li><i class="fas fa-music" style="font-size:20px; width:28px; color:#e74c3c;"></i> Музыка</li>
                </ul>
                <button class="btn-metro" onclick="AppLauncher.launch('explorer')">
                    <i class="fas fa-hdd"></i> Открыть диск C:
                </button>
            </div>
        `;
    }
};
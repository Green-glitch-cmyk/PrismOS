const AppLauncher = {
    apps: {
        explorer: ExplorerApp,
        notepad: NotepadApp,
        settings: SettingsApp,
        about: AboutApp
    },

    launch: function(appId) {
        const app = this.apps[appId];
        if (!app) return;
        
        const existing = WindowManager.windows.find(w => w.app === appId && !w.element.classList.contains('hidden'));
        if (existing) {
            WindowManager._bringToFront(existing.id);
            return;
        }
        
        WindowManager.create(app.id, app.title, app.getContent());
    }
};

document.addEventListener('DOMContentLoaded', function() {
    DesktopManager.init();
    
    document.getElementById('start-button').addEventListener('click', () => {
        AppLauncher.launch('explorer');
    });
    
    setTimeout(() => {
        const welcomeContent = `
            <div style="padding: 4px 0;">
                <h2 style="font-weight:300; font-size:26px;">👋 Добро пожаловать</h2>
                <p style="font-size:16px; margin: 12px 0; border-left: 6px solid #f1c40f; padding-left: 16px;">
                    PrismOS — веб-система с плоским Metro интерфейсом.
                </p>
                <div style="display:flex; gap:12px; flex-wrap:wrap;">
                    <button class="btn-metro" onclick="AppLauncher.launch('explorer')">
                        <i class="fas fa-folder-open"></i> Проводник
                    </button>
                    <button class="btn-metro" onclick="AppLauncher.launch('notepad')">
                        <i class="fas fa-note-sticky"></i> Блокнот
                    </button>
                    <button class="btn-metro" onclick="AppLauncher.launch('settings')">
                        <i class="fas fa-sliders-h"></i> Параметры
                    </button>
                </div>
            </div>
        `;
        WindowManager.create('welcome', 'Приветствие', welcomeContent);
    }, 200);
    
    console.log('✨ PrismOS загружена!');
});
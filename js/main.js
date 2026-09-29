const AppLauncher = {
    apps: {
        explorer:   ExplorerApp,
        notepad:    NotepadApp,
        settings:   SettingsApp,
        about:      AboutApp,
        terminal:   TerminalApp,
        calculator: CalculatorApp,
    },

    launch: function(appId) {
        const app = this.apps[appId];
        if (!app) return;

        const existing = WindowManager.windows.find(
            w => w.app === appId && !w.element.classList.contains('hidden')
        );
        if (existing) {
            WindowManager._bringToFront(existing.id);
            return;
        }

        const winId = WindowManager.create(app.id, app.title, app.getContent());
        if (typeof app.init === 'function') {
            const winEl = WindowManager.windows.find(w => w.id === winId).element;
            app.init(winEl);
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    DesktopManager.init();

    // Восстановление обоев
    const savedWp = localStorage.getItem('prismos.wallpaper');
    if (savedWp) {
        document.getElementById('workspace').style.backgroundImage = `url('wallpapers/${savedWp}')`;
    }

    document.getElementById('start-button').addEventListener('click', () => {
        AppLauncher.launch('explorer');
    });

    setTimeout(() => {
        const welcomeContent = `
            <div style="padding: 4px 0;">
                <h2 style="font-weight:300; font-size:26px;">👋 Добро пожаловать в Alpha 1</h2>
                <p style="font-size:16px; margin: 12px 0; border-left: 6px solid #f1c40f; padding-left: 16px;">
                    PrismOS — веб-система с Metro-интерфейсом и лёгким 3D.
                </p>
                <div style="display:flex; gap:12px; flex-wrap:wrap;">
                    <button class="btn-metro" onclick="AppLauncher.launch('explorer')">
                        <i class="fas fa-folder-open"></i> Проводник
                    </button>
                    <button class="btn-metro" onclick="AppLauncher.launch('notepad')">
                        <i class="fas fa-note-sticky"></i> Блокнот
                    </button>
                    <button class="btn-metro" onclick="AppLauncher.launch('terminal')">
                        <i class="fas fa-terminal"></i> Терминал
                    </button>
                    <button class="btn-metro" onclick="AppLauncher.launch('calculator')">
                        <i class="fas fa-calculator"></i> Калькулятор
                    </button>
                </div>
            </div>
        `;
        WindowManager.create('welcome', 'Приветствие', welcomeContent);
    }, 200);

    console.log('✨ PrismOS Alpha 1 загружена!');
});
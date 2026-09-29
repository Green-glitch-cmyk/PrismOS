const TaskbarManager = {
    container: null,

    init: function() {
        this.container = document.getElementById('taskbarApps');
    },

    // windows — массив открытых окон (для подсветки активных)
    update: function(windows) {
        if (!this.container) {
            this.container = document.getElementById('taskbarApps');
        }
        if (!this.container) return;

        const apps = (window.AppLauncher && AppLauncher.apps) ? AppLauncher.apps : {};
        const openAppIds = new Set((windows || []).map(w => w.app));
        const activeWin = (windows || []).find(w => w.isActive);
        const activeAppId = activeWin ? activeWin.app : null;

        this.container.innerHTML = '';

        Object.keys(apps).forEach(appId => {
            const app = apps[appId];
            const icon = this._iconFor(appId);

            const item = document.createElement('div');
            item.className = 'taskbar-item';
            item.dataset.app = appId;
            item.title = app.title || appId;

            if (openAppIds.has(appId)) item.classList.add('active');
            if (appId === activeAppId) item.classList.add('focused');

            item.innerHTML = `
                <i class="fas ${icon}"></i>
                <span class="dock-tooltip">${app.title || appId}</span>
            `;

            item.addEventListener('click', () => this._onClick(appId));

            this.container.appendChild(item);
        });
    },

    _onClick: function(appId) {
        const openWin = WindowManager.windows.find(w => w.app === appId);

        // Нет открытого окна — запускаем
        if (!openWin) {
            AppLauncher.launch(appId);
            return;
        }

        // Окно свёрнуто — разворачиваем и на передний план
        if (openWin.element.classList.contains('hidden')) {
            openWin.element.classList.remove('hidden');
            WindowManager._bringToFront(openWin.id);
            return;
        }

        // Окно активно — сворачиваем
        if (openWin.isActive) {
            openWin.element.classList.add('hidden');
            openWin.isActive = false;
            TaskbarManager.update(WindowManager.windows);
            return;
        }

        // Иначе — просто на передний план
        WindowManager._bringToFront(openWin.id);
    },

    _iconFor: function(appId) {
        const icons = {
            explorer:   'fa-folder-open',
            notepad:    'fa-note-sticky',
            terminal:   'fa-terminal',
            calculator: 'fa-calculator',
            settings:   'fa-sliders-h',
            about:      'fa-circle-info',
        };
        return icons[appId] || 'fa-window-maximize';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    TaskbarManager.init();
});
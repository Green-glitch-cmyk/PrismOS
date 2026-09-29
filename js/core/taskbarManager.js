const TaskbarManager = {
    container: null,

    init: function() {
        this.container = document.getElementById('taskbarApps');
        // Кнопки в закреплённой зоне
        const startBtn = document.getElementById('start-button');
        if (startBtn) {
            startBtn.addEventListener('click', () => AppLauncher.launch('explorer'));
        }
        const searchBtn = document.getElementById('tb-search');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                // Заглушка — потом сюда придёт меню Пуск с поиском
                UI.notify('Поиск появится в Alpha 3', { type: 'info' });
            });
        }
        const explorerBtn = document.getElementById('tb-explorer');
        if (explorerBtn) {
            explorerBtn.addEventListener('click', () => AppLauncher.launch('explorer'));
        }
        const taskView = document.getElementById('tb-taskview');
        if (taskView) {
            taskView.addEventListener('click', () => {
                UI.notify('Представление задач появится позже', { type: 'info' });
            });
        }
        const notify = document.getElementById('tb-notify');
        if (notify) {
            notify.addEventListener('click', () => {
                UI.notify('Центр уведомлений появится позже', { type: 'info' });
            });
        }
    },

    update: function(windows) {
        if (!this.container) {
            this.container = document.getElementById('taskbarApps');
        }
        if (!this.container) return;

        this.container.innerHTML = '';

        // Показываем только ОТКРЫТЫЕ окна, не все приложения
        const seen = new Set();
        (windows || []).forEach(win => {
            // Если окно одного и того же приложения открыто несколько раз —
            // (пока не бывает, но на будущее) — пропускаем дубликаты
            if (seen.has(win.app)) return;
            seen.add(win.app);

            const item = document.createElement('button');
            item.className = 'taskbar-item';
            item.dataset.app = win.app;
            item.title = win.title;
            if (win.isActive) item.classList.add('focused');
            if (!win.element.classList.contains('hidden')) item.classList.add('active');

            item.innerHTML = `<i class="fas ${this._iconFor(win.app)}"></i>`;

            item.addEventListener('click', () => this._onClick(win.app));

            this.container.appendChild(item);
        });
    },

    _onClick: function(appId) {
        const openWin = WindowManager.windows.find(w => w.app === appId);
        if (!openWin) {
            AppLauncher.launch(appId);
            return;
        }
        if (openWin.element.classList.contains('hidden')) {
            openWin.element.classList.remove('hidden');
            WindowManager._bringToFront(openWin.id);
            return;
        }
        if (openWin.isActive) {
            openWin.element.classList.add('hidden');
            openWin.isActive = false;
            TaskbarManager.update(WindowManager.windows);
            return;
        }
        WindowManager._bringToFront(openWin.id);
    },

    _iconFor: function(appId) {
        const icons = {
            explorer:   'fa-folder',
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
    setTimeout(() => TaskbarManager.update([]), 0);
});
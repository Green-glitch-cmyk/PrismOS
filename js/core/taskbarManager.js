const TaskbarManager = {
    container: document.getElementById('taskbarApps'),

    update: function(windows) {
        this.container.innerHTML = '';
        windows.forEach(win => {
            const item = document.createElement('div');
            item.className = 'taskbar-item' + (win.isActive ? ' active' : '');
            item.textContent = win.title;
            item.dataset.windowId = win.id;
            item.addEventListener('click', () => {
                if (win.element.classList.contains('hidden')) {
                    win.element.classList.remove('hidden');
                }
                WindowManager._bringToFront(win.id);
            });
            this.container.appendChild(item);
        });
    }
};
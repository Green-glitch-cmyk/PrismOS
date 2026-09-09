const DesktopManager = {
    container: document.getElementById('desktopIcons'),
    apps: [
        { id: 'explorer', icon: 'fa-folder-open', label: 'Проводник' },
        { id: 'notepad', icon: 'fa-note-sticky', label: 'Блокнот' },
        { id: 'settings', icon: 'fa-sliders-h', label: 'Параметры' },
        { id: 'about', icon: 'fa-circle-info', label: 'О системе' }
    ],

    init: function() {
        this.apps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.dataset.app = app.id;
            icon.innerHTML = `
                <span class="icon"><i class="fas ${app.icon}"></i></span>
                <span class="label">${app.label}</span>
            `;
            
            let clickTimer = null;
            icon.addEventListener('dblclick', () => {
                AppLauncher.launch(app.id);
            });
            icon.addEventListener('click', () => {
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    return;
                }
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                }, 250);
            });
            
            this.container.appendChild(icon);
        });
    }
};
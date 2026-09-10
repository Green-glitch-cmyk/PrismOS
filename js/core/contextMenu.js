// ============================================================
// КОНТЕКСТНОЕ МЕНЮ
// ============================================================

const ContextMenu = {
    menu: null,
    isOpen: false,

    init: function() {
        this.menu = document.getElementById('context-menu');
        this.bindEvents();
        this.bindActions();
    },

    bindEvents: function() {
        const workspace = document.getElementById('workspace');

        // ПКМ на рабочем столе
        workspace.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            // Проверяем, что клик не по иконке
            if (!e.target.closest('.desktop-icon')) {
                this.open(e.clientX, e.clientY);
            }
        });

        // Закрытие по клику вне меню
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target)) {
                this.close();
            }
        });

        // Закрытие по Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Закрытие при скролле
        document.addEventListener('scroll', () => {
            if (this.isOpen) {
                this.close();
            }
        });

        // Закрытие при изменении размера окна
        window.addEventListener('resize', () => {
            if (this.isOpen) {
                this.close();
            }
        });
    },

    bindActions: function() {
        // Обработка кликов по пунктам меню
        this.menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                this.handleAction(action);
                this.close();
            });
        });
    },

    open: function(x, y) {
        // Корректировка позиции, чтобы меню не выходило за экран
        const menuWidth = 220;
        const menuHeight = this.menu.offsetHeight || 150;
        
        let left = x;
        let top = y;
        
        // Если меню не помещается справа
        if (x + menuWidth > window.innerWidth) {
            left = window.innerWidth - menuWidth - 10;
        }
        
        // Если меню не помещается снизу
        if (y + menuHeight > window.innerHeight) {
            top = window.innerHeight - menuHeight - 10;
        }
        
        // Если меню не помещается слева
        if (left < 10) {
            left = 10;
        }
        
        // Если меню не помещается сверху
        if (top < 10) {
            top = 10;
        }

        this.menu.style.left = left + 'px';
        this.menu.style.top = top + 'px';
        this.menu.classList.add('show');
        this.isOpen = true;
    },

    close: function() {
        this.menu.classList.remove('show');
        this.isOpen = false;
    },

    handleAction: function(action) {
        switch(action) {
            case 'create-folder':
                this.createFolder();
                break;
            case 'settings':
                this.openSettings();
                break;
            case 'refresh':
                this.refreshDesktop();
                break;
            default:
                console.warn('Неизвестное действие:', action);
        }
    },

    createFolder: function() {
        // Генерация имени папки
        const folderCount = document.querySelectorAll('.desktop-icon[data-app="folder"]').length + 1;
        const folderName = `Новая папка (${folderCount})`;
        
        // Создаём иконку папки
        const iconsContainer = document.getElementById('desktopIcons');
        const folderIcon = document.createElement('div');
        folderIcon.className = 'desktop-icon';
        folderIcon.dataset.app = 'folder';
        folderIcon.innerHTML = `
            <span class="icon"><i class="fas fa-folder" style="color:#f1c40f;"></i></span>
            <span class="label">${folderName}</span>
        `;
        
        // Двойной клик для открытия (имитация)
        folderIcon.addEventListener('dblclick', () => {
            alert(`📁 Открыта папка "${folderName}"`);
        });
        
        // Добавляем в конец
        iconsContainer.appendChild(folderIcon);
        
        // Уведомление
        this.showNotification('📁 Папка создана', folderName);
    },

    openSettings: function() {
        if (window.AppLauncher) {
            window.AppLauncher.launch('settings');
        } else {
            alert('⚙️ Открытие настроек...');
        }
    },

    refreshDesktop: function() {
        // Анимация обновления
        const workspace = document.getElementById('workspace');
        workspace.style.transition = 'opacity 0.2s';
        workspace.style.opacity = '0.5';
        
        setTimeout(() => {
            workspace.style.opacity = '1';
            this.showNotification('🔄 Рабочий стол обновлён', '');
        }, 300);
    },

    showNotification: function(title, subtitle) {
        // Простое уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a1a;
            color: white;
            padding: 12px 24px;
            border: 2px solid #555;
            box-shadow: 4px 4px 0 rgba(0,0,0,0.5);
            z-index: 2000;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            text-align: center;
            animation: contextFadeIn 0.3s ease-out;
            max-width: 400px;
        `;
        notification.innerHTML = `<div style="font-weight:600;">${title}</div>${subtitle ? `<div style="font-weight:300; font-size:12px; color:#aaa; margin-top:4px;">${subtitle}</div>` : ''}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
};

// Автозапуск
document.addEventListener('DOMContentLoaded', function() {
    ContextMenu.init();
});
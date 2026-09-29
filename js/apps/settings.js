const SettingsApp = {
    id: 'settings',
    title: 'Параметры',

    _wallpapers: ['img0.jpg', 'img1.jpg', 'img2.jpg'],
    _accents:    ['#f1c40f', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6'],

    _sections: [
        { group: 'Система', items: [
            { id: 'display',  icon: 'fa-desktop',          label: 'Дисплей' },
            { id: 'sound',    icon: 'fa-volume-high',      label: 'Звук' },
            { id: 'notifications', icon: 'fa-comment',     label: 'Уведомления и действия' },
            { id: 'power',    icon: 'fa-power-off',        label: 'Питание и спящий режим' },
            { id: 'battery',  icon: 'fa-battery-half',     label: 'Батарея' },
            { id: 'storage',  icon: 'fa-hard-drive',       label: 'Память' },
        ]},
        { group: 'Персонализация', items: [
            { id: 'background', icon: 'fa-image',          label: 'Фон' },
            { id: 'colors',     icon: 'fa-palette',        label: 'Цвета' },
        ]},
        { group: 'Устройства', items: [
            { id: 'keyboard', icon: 'fa-keyboard',         label: 'Клавиатура' },
            { id: 'mouse',    icon: 'fa-computer-mouse',   label: 'Мышь' },
        ]},
        { group: 'Сеть и Интернет', items: [
            { id: 'wifi',   icon: 'fa-wifi',               label: 'Wi-Fi' },
            { id: 'ethernet', icon: 'fa-network-wired',    label: 'Ethernet' },
        ]},
        { group: 'Обновление и безопасность', items: [
            { id: 'update', icon: 'fa-rotate',             label: 'Центр обновления' },
            { id: 'about',  icon: 'fa-circle-info',        label: 'О системе' },
        ]},
    ],

    getContent: function() {
        return `
            <div class="win-settings">
                <aside class="win-settings__nav">
                    <div class="win-settings__nav-header">
                        <button class="win-settings__back" id="settings-back" title="Назад">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <span>Параметры</span>
                    </div>
                    <div class="win-settings__search">
                        <input id="settings-search" type="text" placeholder="Найти параметр">
                        <i class="fas fa-search"></i>
                    </div>
                    <div id="settings-nav-list"></div>
                </aside>
                <main class="win-settings__content" id="settings-content"></main>
            </div>
        `;
    },

    init: function(winElement) {
        const winDiv = winElement.closest('.window');
        if (winDiv) {
            winDiv.style.width = '860px';
            winDiv.style.height = '560px';
        }
        this.win = winElement;
        this.nav  = winElement.querySelector('#settings-nav-list');
        this.content = winElement.querySelector('#settings-content');
        this.searchInput = winElement.querySelector('#settings-search');

        this._renderNav();
        this._bindSearch();
        this._bindBack();

        // Открываем «Дисплей» по умолчанию
        this.open('display');
    },

    _renderNav: function(filter = '') {
        this.nav.innerHTML = '';
        const f = filter.trim().toLowerCase();

        this._sections.forEach(section => {
            const items = section.items.filter(it =>
                !f || it.label.toLowerCase().includes(f)
            );
            if (items.length === 0) return;

            const group = document.createElement('div');
            group.className = 'win-settings__group';

            const title = document.createElement('div');
            title.className = 'win-settings__group-title';
            title.textContent = section.group;
            group.appendChild(title);

            items.forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'win-settings__item';
                btn.dataset.page = item.id;
                btn.innerHTML = `<i class="fas ${item.icon}"></i><span>${item.label}</span>`;
                btn.addEventListener('click', () => this.open(item.id));
                group.appendChild(btn);
            });

            this.nav.appendChild(group);
        });

        // Подсветка активного
        this._highlightCurrent();
    },

    _bindSearch: function() {
        this.searchInput.addEventListener('input', () => {
            this._renderNav(this.searchInput.value);
        });
    },

    _bindBack: function() {
        const back = this.win.querySelector('#settings-back');
        back.addEventListener('click', () => {
            // В реальном Win10 возвращает на «Главная», у нас — на «Дисплей»
            this.open('display');
        });
    },

    open: function(pageId) {
        this.currentPage = pageId;
        this.content.innerHTML = this._renderPage(pageId);
        this._highlightCurrent();
        this._bindPageControls(pageId);
    },

    _highlightCurrent: function() {
        this.nav.querySelectorAll('.win-settings__item').forEach(el => {
            el.classList.toggle('active', el.dataset.page === this.currentPage);
        });
    },

    _renderPage: function(pageId) {
        switch (pageId) {
            case 'display':       return this._pageDisplay();
            case 'sound':         return this._pageSound();
            case 'notifications': return this._pageNotifications();
            case 'power':         return this._pagePower();
            case 'battery':       return this._pageBattery();
            case 'storage':       return this._pageStorage();
            case 'background':    return this._pageBackground();
            case 'colors':        return this._pageColors();
            case 'keyboard':      return this._pageKeyboard();
            case 'mouse':         return this._pageMouse();
            case 'wifi':          return this._pageWifi();
            case 'ethernet':      return this._pageEthernet();
            case 'update':        return this._pageUpdate();
            case 'about':         return this._pageAbout();
            default:
                return `<h1>Параметры</h1><p>Выберите раздел слева.</p>`;
        }
    },

    _pageDisplay: function() {
        const brightness = localStorage.getItem('prismos.brightness') || '100';
        return `
            <h1>Дисплей</h1>
            <h2>Яркость и цвет</h2>
            <p>Измените яркость встроенного дисплея</p>
            <input type="range" min="20" max="100" value="${brightness}"
                   class="win-slider" id="set-brightness">
            <p style="text-align:right;">${brightness}%</p>
            <h2>Ночной свет</h2>
            <div class="win-settings__row">
                <div>Ночной свет</div>
                <label class="win-toggle">
                    <input type="checkbox" id="set-nights">
                    <span class="win-toggle__track"></span>
                </label>
            </div>
        `;
    },

    _pageSound: function() {
        const volume = localStorage.getItem('prismos.volume') || '70';
        return `
            <h1>Звук</h1>
            <h2>Громкость</h2>
            <input type="range" min="0" max="100" value="${volume}"
                   class="win-slider" id="set-volume">
            <p style="text-align:right;">${volume}%</p>
            <div class="win-settings__row">
                <div>Звуки системы</div>
                <label class="win-toggle">
                    <input type="checkbox" id="set-sounds" checked>
                    <span class="win-toggle__track"></span>
                </label>
            </div>
        `;
    },

    _pageNotifications: function() {
        const enabled = localStorage.getItem('prismos.notifications') !== '0';
        return `
            <h1>Уведомления и действия</h1>
            <div class="win-settings__row">
                <div>Показывать уведомления</div>
                <label class="win-toggle">
                    <input type="checkbox" id="set-notify" ${enabled ? 'checked' : ''}>
                    <span class="win-toggle__track"></span>
                </label>
            </div>
            <div class="win-settings__row">
                <div>Звук уведомлений</div>
                <label class="win-toggle">
                    <input type="checkbox" id="set-notify-sound" checked>
                    <span class="win-toggle__track"></span>
                </label>
            </div>
            <h2>Проверка</h2>
            <p>Нажмите, чтобы проверить уведомление:</p>
            <button class="btn-metro" id="set-test-notify">
                <i class="fas fa-bell"></i> Показать уведомление
            </button>
        `;
    },

    _pagePower: function() {
        return `
            <h1>Питание и спящий режим</h1>
            <h2>Экран</h2>
            <p>Отключать экран через:</p>
            <select id="set-screen-off" style="padding:6px 10px; border:1px solid #c8c8c8; border-radius:2px;">
                <option>5 минут</option>
                <option selected>10 минут</option>
                <option>15 минут</option>
                <option>30 минут</option>
                <option>Никогда</option>
            </select>
            <h2>Спящий режим</h2>
            <p>Переходить в спящий режим через:</p>
            <select id="set-sleep" style="padding:6px 10px; border:1px solid #c8c8c8; border-radius:2px;">
                <option>15 минут</option>
                <option selected>30 минут</option>
                <option>1 час</option>
                <option>Никогда</option>
            </select>
        `;
    },

    _pageBattery: function() {
        // Заглушка — в вебе нет реального API батареи (кроме Battery Status API в некоторых браузерах)
        const percent = 43;
        const timeLeft = '0 ч 45 мин';
        const eco = localStorage.getItem('prismos.battery.eco') || '20';
        return `
            <h1>Батарея</h1>
            <div class="win-settings__big-value">${percent}%</div>
            <div class="win-settings__bar"><span style="width:${percent}%"></span></div>
            <p>Ожидаемое время до полной зарядки: ${timeLeft}</p>

            <h2>Уведомления об аккумуляторе</h2>
            <p><a>Просмотрите, какие приложения влияют на время работы от аккумулятора.</a></p>
            <p>Для яркости экрана установлено значение 100% при питании от аккумулятора.
               <a>Параметры дисплея</a></p>

            <h2>Экономия заряда</h2>
            <p>Увеличьте время работы аккумулятора, ограничив фоновые действия и push-уведомления
               при низком уровне заряда.</p>

            <label class="win-checkbox">
                <input type="checkbox" id="set-eco-auto" checked>
                <span class="win-checkbox__box"><i class="fas fa-check"></i></span>
                <span>Автоматически включать экономию заряда при уровне заряда ниже:</span>
            </label>

            <input type="range" min="5" max="50" value="${eco}"
                   class="win-slider" id="set-eco-level">
            <p style="text-align:right; margin-top:-6px;">${eco}%</p>

            <p style="margin-top:20px;">Состояние экономии заряда до следующей зарядки</p>
            <div class="win-settings__row" style="border:none;">
                <label class="win-toggle">
                    <input type="checkbox" id="set-eco-now">
                    <span class="win-toggle__track"></span>
                </label>
                <div>Откл.</div>
            </div>
        `;
    },

    _pageStorage: function() {
        return `
            <h1>Память</h1>
            <p>Хранилище этого устройства</p>
            <div class="win-settings__bar"><span style="width:38%"></span></div>
            <p>38 ГБ из 100 ГБ занято</p>
            <h2>Локальный диск (C:)</h2>
            <div class="win-settings__row"><div>Система и зарезервировано</div><div>18 ГБ</div></div>
            <div class="win-settings__row"><div>Приложения</div><div>12 ГБ</div></div>
            <div class="win-settings__row"><div>Документы</div><div>5 ГБ</div></div>
            <div class="win-settings__row"><div>Изображения</div><div>3 ГБ</div></div>
        `;
    },

    _pageBackground: function() {
        const current = localStorage.getItem('prismos.wallpaper') || 'img0.jpg';
        const wpButtons = this._wallpapers.map(wp => `
            <button class="oobe-grid-btn ${wp === current ? 'selected' : ''}"
                    data-wp="${wp}"
                    style="width:120px; height:76px; border:2px solid ${wp === current ? '#0078d7' : '#c8c8c8'};
                           border-radius:4px; cursor:pointer;
                           background: url('wallpapers/${wp}') center/cover;">
            </button>
        `).join('');
        return `
            <h1>Фон</h1>
            <h2>Выберите изображение</h2>
            <div id="set-bg-list" style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px;">
                ${wpButtons}
            </div>
        `;
    },

    _pageColors: function() {
        const current = localStorage.getItem('prismos.accent') || '#f1c40f';
        const accentButtons = this._accents.map(color => `
            <button data-accent="${color}"
                style="width:44px; height:44px; border-radius:50%;
                       background:${color};
                       border:3px solid ${color === current ? '#1a1a1a' : 'transparent'};
                       cursor:pointer;"
                title="${color}">
            </button>
        `).join('');
        return `
            <h1>Цвета</h1>
            <h2>Выберите акцентный цвет</h2>
            <div id="set-accent-list" style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:24px;">
                ${accentButtons}
            </div>
            <p>Акцентный цвет используется в подсветке элементов интерфейса.</p>
        `;
    },

    _pageKeyboard: function() {
        return `
            <h1>Клавиатура</h1>
            <p>Настройки клавиатуры недоступны в веб-версии PrismOS.</p>
        `;
    },

    _pageMouse: function() {
        return `
            <h1>Мышь</h1>
            <h2>Скорость курсора</h2>
            <input type="range" min="1" max="20" value="10" class="win-slider">
            <div class="win-settings__row">
                <div>Основная кнопка — левая</div>
                <label class="win-toggle">
                    <input type="checkbox" checked>
                    <span class="win-toggle__track"></span>
                </label>
            </div>
        `;
    },

    _pageWifi: function() {
        return `
            <h1>Wi-Fi</h1>
            <p>Веб-версия PrismOS не имеет доступа к реальным сетевым настройкам.</p>
            <div class="win-settings__row">
                <div>Wi-Fi</div>
                <label class="win-toggle">
                    <input type="checkbox" checked>
                    <span class="win-toggle__track"></span>
                </label>
            </div>
            <div class="win-settings__row"><div>Доступные сети</div><div>—</div></div>
        `;
    },

    _pageEthernet: function() {
        return `
            <h1>Ethernet</h1>
            <p>Нет доступных проводных подключений.</p>
        `;
    },

    _pageUpdate: function() {
        return `
            <h1>Центр обновления</h1>
            <p>Обновления не требуются.</p>
            <div class="win-settings__row">
                <div>Последняя проверка</div>
                <div>только что</div>
            </div>
            <div class="win-settings__row">
                <div>Версия</div>
                <div>Alpha 2</div>
            </div>
            <button class="btn-metro" style="margin-top:16px;" id="set-check-update">
                <i class="fas fa-rotate"></i> Проверить обновления
            </button>
        `;
    },

    _pageAbout: function() {
        return `
            <h1>О системе</h1>
            <div class="win-settings__row"><div>Устройство</div><div>${navigator.platform || '—'}</div></div>
            <div class="win-settings__row"><div>Браузер</div><div>${navigator.userAgent.split(' ').slice(-2).join(' ')}</div></div>
            <div class="win-settings__row"><div>Язык</div><div>${navigator.language}</div></div>
            <div class="win-settings__row"><div>PrismOS</div><div>Alpha 2</div></div>
            <div class="win-settings__row"><div>Лицензия</div><div>MIT</div></div>
        `;
    },

    _bindPageControls: function(pageId) {
        // Ползунок яркости
        const brightness = this.content.querySelector('#set-brightness');
        if (brightness) {
            brightness.addEventListener('input', (e) => {
                const v = e.target.value;
                const p = e.target.nextElementSibling;
                if (p) p.textContent = v + '%';
                localStorage.setItem('prismos.brightness', v);
                document.documentElement.style.filter = `brightness(${Math.max(0.4, v / 100)})`;
            });
        }

        // Громкость
        const vol = this.content.querySelector('#set-volume');
        if (vol) {
            vol.addEventListener('input', (e) => {
                const v = e.target.value;
                const p = e.target.nextElementSibling;
                if (p) p.textContent = v + '%';
                localStorage.setItem('prismos.volume', v);
            });
        }

        // Тест уведомления
        const testNotify = this.content.querySelector('#set-test-notify');
        if (testNotify) {
            testNotify.addEventListener('click', () => {
                UI.notify('Это тестовое уведомление', { type: 'success' });
            });
        }

        // Ползунок экономии
        const eco = this.content.querySelector('#set-eco-level');
        if (eco) {
            eco.addEventListener('input', (e) => {
                const v = e.target.value;
                localStorage.setItem('prismos.battery.eco', v);
                const p = e.target.nextElementSibling;
                if (p) p.textContent = v + '%';
            });
        }

        // Обои
        const bgList = this.content.querySelector('#set-bg-list');
        if (bgList) {
            bgList.querySelectorAll('button[data-wp]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const wp = btn.dataset.wp;
                    localStorage.setItem('prismos.wallpaper', wp);
                    document.getElementById('workspace').style.backgroundImage = `url('wallpapers/${wp}')`;
                    bgList.querySelectorAll('button').forEach(b => b.style.borderColor = '#c8c8c8');
                    btn.style.borderColor = '#0078d7';
                    UI.notify('Обои обновлены', { type: 'success' });
                });
            });
        }

        // Акцент
        const accentList = this.content.querySelector('#set-accent-list');
        if (accentList) {
            accentList.querySelectorAll('button[data-accent]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const color = btn.dataset.accent;
                    localStorage.setItem('prismos.accent', color);
                    document.documentElement.style.setProperty('--accent', color);
                    accentList.querySelectorAll('button').forEach(b => b.style.borderColor = 'transparent');
                    btn.style.borderColor = '#1a1a1a';
                    UI.notify('Акцентный цвет изменён', { type: 'success' });
                });
            });
        }

        // Проверка обновлений
        const check = this.content.querySelector('#set-check-update');
        if (check) {
            check.addEventListener('click', () => {
                check.disabled = true;
                check.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
                setTimeout(() => {
                    check.disabled = false;
                    check.innerHTML = '<i class="fas fa-rotate"></i> Проверить обновления';
                    UI.notify('Обновления не найдены', { type: 'info' });
                }, 1500);
            });
        }
    },
};
const ExplorerApp = {
    id: 'explorer',
    title: 'Проводник',

    _cwd: '/',
    _history: ['/'],
    _historyIdx: 0,
    _selected: null,
    _sort: { column: 'name', dir: 1 },

    getContent: function() {
        return `
            <div class="win-explorer">
                <!-- Лента (упрощённая) -->
                <div class="win-explorer__ribbon">
                    <button class="win-explorer__tab active" data-tab="file">Файл</button>
                    <button class="win-explorer__tab" data-tab="home">Главная</button>
                    <button class="win-explorer__tab" data-tab="share">Поделиться</button>
                    <button class="win-explorer__tab" data-tab="view">Вид</button>
                </div>

                <!-- Адресная строка -->
                <div class="win-explorer__address">
                    <button class="win-explorer__nav-btn" id="exp-back" title="Назад">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <button class="win-explorer__nav-btn" id="exp-forward" title="Вперёд" disabled>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="win-explorer__nav-btn" id="exp-up" title="Вверх">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <div class="win-explorer__breadcrumbs" id="exp-breadcrumbs"></div>
                    <div class="win-explorer__search">
                        <input id="exp-search" type="text" placeholder="Поиск: Этот компьютер">
                        <i class="fas fa-search"></i>
                    </div>
                </div>

                <!-- Тело: дерево + файлы -->
                <div class="win-explorer__body">
                    <aside class="win-explorer__sidebar">
                        <ul class="win-explorer__tree" id="exp-tree"></ul>
                    </aside>
                    <main class="win-explorer__content" id="exp-content"></main>
                </div>

                <!-- Строка состояния -->
                <div class="win-explorer__statusbar">
                    <span id="exp-status">Элементов: 0</span>
                    <span id="exp-selection"></span>
                </div>
            </div>
        `;
    },

    init: function(winElement) {
        const winDiv = winElement.closest('.window');
        if (winDiv) {
            winDiv.style.width = '920px';
            winDiv.style.height = '580px';
        }

        this.win = winElement;
        this.tree = winElement.querySelector('#exp-tree');
        this.crumbs = winElement.querySelector('#exp-breadcrumbs');
        this.content = winElement.querySelector('#exp-content');
        this.status = winElement.querySelector('#exp-status');
        this.selection = winElement.querySelector('#exp-selection');

        this._renderTree();
        this._bindNav();
        this.navigate(this._cwd, false);
    },

    // ---------- Дерево слева ----------
    _renderTree: function() {
        const items = [
            { icon: 'fa-star',           label: 'Быстрый доступ', active: false },
            { icon: 'fa-desktop',        label: 'Рабочий стол',    path: '/Рабочий стол' },
            { icon: 'fa-download',       label: 'Загрузки',        path: '/Загрузки' },
            { icon: 'fa-file-lines',     label: 'Документы',       path: '/Документы' },
            { icon: 'fa-image',          label: 'Изображения',     path: '/Изображения' },
            { icon: 'fa-music',          label: 'Музыка',          path: '/Музыка' },
            { icon: 'fa-video',          label: 'Видео',           path: '/Видео' },
            { icon: 'fa-cube',           label: 'Объемные объекты',path: '/Объемные объекты' },
            { icon: 'fa-hard-drive',     label: 'Локальный диск (C:)', path: '/' },
            { icon: 'fa-network-wired',  label: 'Сеть' },
        ];

        this.tree.innerHTML = items.map(it => `
            <li>
                <button class="win-explorer__tree-item" ${it.path ? `data-path="${it.path}"` : ''}>
                    <i class="fas ${it.icon}"></i>
                    <span>${it.label}</span>
                </button>
            </li>
        `).join('');

        this.tree.querySelectorAll('.win-explorer__tree-item[data-path]').forEach(btn => {
            btn.addEventListener('click', () => this.navigate(btn.dataset.path));
        });
    },

    // ---------- Навигация ----------
    _bindNav: function() {
        this.win.querySelector('#exp-back').addEventListener('click', () => {
            if (this._historyIdx > 0) {
                this._historyIdx--;
                this.navigate(this._history[this._historyIdx], false);
                this._updateNavButtons();
            }
        });
        this.win.querySelector('#exp-forward').addEventListener('click', () => {
            if (this._historyIdx < this._history.length - 1) {
                this._historyIdx++;
                this.navigate(this._history[this._historyIdx], false);
                this._updateNavButtons();
            }
        });
        this.win.querySelector('#exp-up').addEventListener('click', () => {
            if (this._cwd === '/') return;
            const parts = this._cwd.split('/').filter(Boolean);
            parts.pop();
            this.navigate(parts.length ? '/' + parts.join('/') : '/');
        });

        const search = this.win.querySelector('#exp-search');
        search.addEventListener('input', () => {
            this._renderFiles(this._cwd, search.value);
        });
    },

    _updateNavButtons: function() {
        this.win.querySelector('#exp-back').disabled = this._historyIdx <= 0;
        this.win.querySelector('#exp-forward').disabled = this._historyIdx >= this._history.length - 1;
        this.win.querySelector('#exp-up').disabled = this._cwd === '/';
    },

    navigate: function(path, pushHistory = true) {
        if (!FileSystem.get(path) || FileSystem.get(path).type !== 'folder') return;
        this._cwd = path;
        this._selected = null;

        if (pushHistory) {
            this._history = this._history.slice(0, this._historyIdx + 1);
            this._history.push(path);
            this._historyIdx = this._history.length - 1;
        }

        this._renderBreadcrumbs();
        this._renderFiles(path);
        this._highlightTree();
        this._updateNavButtons();
    },

    // ---------- Хлебные крошки ----------
    _renderBreadcrumbs: function() {
        const parts = this._cwd.split('/').filter(Boolean);
        const crumbs = [{ label: 'Этот компьютер', path: '/' }];

        if (parts.length === 0) {
            crumbs[0].label = 'Этот компьютер';
        } else {
            let acc = '';
            parts.forEach((p, i) => {
                acc += '/' + p;
                crumbs.push({ label: p, path: acc });
            });
        }

        this.crumbs.innerHTML = crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            const sep = i > 0 ? '<span class="win-explorer__crumb-sep">›</span>' : '';
            const item = isLast
                ? `<span class="win-explorer__crumb">${c.label}</span>`
                : `<span class="win-explorer__crumb" data-path="${c.path}">${c.label}</span>`;
            return sep + item;
        }).join('');

        this.crumbs.querySelectorAll('.win-explorer__crumb[data-path]').forEach(el => {
            el.addEventListener('click', () => this.navigate(el.dataset.path));
        });
    },

    // ---------- Файлы ----------
    _renderFiles: function(path, filter = '') {
        let items = FileSystem.list(path);

        if (filter.trim()) {
            const f = filter.trim().toLowerCase();
            items = items.filter(i => i.name.toLowerCase().includes(f));
        }

        // Сортировка
        const col = this._sort.column;
        const dir = this._sort.dir;
        items.sort((a, b) => {
            // Папки всегда выше файлов
            if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
            let r = 0;
            if (col === 'name')     r = a.name.localeCompare(b.name, 'ru');
            if (col === 'modified') r = String(a.modified).localeCompare(String(b.modified));
            if (col === 'type')     r = a.type.localeCompare(b.type);
            if (col === 'size')     r = (a.size || 0) - (b.size || 0);
            return r * dir;
        });

        if (items.length === 0) {
            this.content.innerHTML = `
                <div class="win-explorer__empty">
                    ${filter ? 'Ничего не найдено' : 'Эта папка пуста'}
                </div>`;
            this._updateStatus(0);
            return;
        }

        this.content.innerHTML = `
            <table class="win-files-table">
                <thead>
                    <tr>
                        <th data-col="name">Имя</th>
                        <th data-col="modified" style="width:160px;">Дата изменения</th>
                        <th data-col="type" style="width:120px;">Тип</th>
                        <th data-col="size" style="width:90px; text-align:right;">Размер</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;

        const tbody = this.content.querySelector('tbody');

        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.path = item.path;
            tr.dataset.type = item.type;

            const icon = item.type === 'folder' ? 'fa-folder' : 'fa-file-lines';
            const typeLabel = item.type === 'folder' ? 'Папка с файлами' : this._fileType(item.name);
            const sizeLabel = item.type === 'folder' ? '' : this._formatSize(item.size);

            tr.innerHTML = `
                <td class="col-name"><i class="fas ${icon}"></i><span>${item.name}</span></td>
                <td>${item.modified}</td>
                <td>${typeLabel}</td>
                <td style="text-align:right;">${sizeLabel}</td>
            `;

            // Клик — выделение
            tr.addEventListener('click', (e) => {
                e.stopPropagation();
                tbody.querySelectorAll('tr').forEach(t => t.classList.remove('selected'));
                tr.classList.add('selected');
                this._selected = item;
                this.selection.textContent = `Выбран 1 элемент`;
            });

            // Двойной клик — открыть
            tr.addEventListener('dblclick', () => {
                if (item.type === 'folder') {
                    this.navigate(item.path);
                } else {
                    this._openFile(item);
                }
            });

            tbody.appendChild(tr);
        });

        // Сортировка по клику на заголовок
        this.content.querySelectorAll('thead th').forEach(th => {
            th.addEventListener('click', () => {
                const col = th.dataset.col;
                if (this._sort.column === col) this._sort.dir *= -1;
                else { this._sort.column = col; this._sort.dir = 1; }
                this._renderFiles(path, filter);
            });
        });

        // Клик по пустому месту — снять выделение
        this.content.addEventListener('click', () => {
            tbody.querySelectorAll('tr').forEach(t => t.classList.remove('selected'));
            this._selected = null;
            this.selection.textContent = '';
        }, { once: true });

        this._updateStatus(items.length);
    },

    _updateStatus: function(count) {
        this.status.textContent = `Элементов: ${count}`;
    },

    _formatSize: function(bytes) {
        if (!bytes) return '0 КБ';
        if (bytes < 1024) return bytes + ' Б';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' КБ';
        return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
    },

    _fileType: function(name) {
        const ext = (name.split('.').pop() || '').toLowerCase();
        const map = {
            txt: 'Текстовый документ',
            md:  'Документ Markdown',
            json:'Файл JSON',
            jpg: 'Изображение JPEG',
            png: 'Изображение PNG',
            mp3: 'Аудиофайл MP3',
            exe: 'Приложение',
            zip: 'Архив ZIP',
        };
        return map[ext] || 'Файл';
    },

    _openFile: function(item) {
        const ext = (item.name.split('.').pop() || '').toLowerCase();
        if (['txt', 'md', 'json'].includes(ext)) {
            AppLauncher.launch('notepad');
            UI.notify(`Открыт ${item.name}`, { type: 'info' });
        } else {
            UI.alert(`Не удалось открыть файл «${item.name}».\nПриложение не найдено.`, {
                title: 'Открытие файла',
                icon: 'fa-triangle-exclamation',
                iconColor: '#e74c3c',
            });
        }
    },

    _highlightTree: function() {
        this.tree.querySelectorAll('.win-explorer__tree-item').forEach(el => {
            el.classList.toggle('active', el.dataset.path === this._cwd);
        });
    },
};
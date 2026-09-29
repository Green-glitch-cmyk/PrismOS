const WindowManager = {
    windows: [],
    activeWindowId: null,
    workspace: document.getElementById('workspace'),

    create: function(appId, title, contentHTML) {
        const id = Helpers.generateId();
        const winDiv = document.createElement('div');
        winDiv.className = 'window';
        winDiv.dataset.windowId = id;

        const offset = (this.windows.length % 6) * 28;
        winDiv.style.left = (60 + offset) + 'px';
        winDiv.style.top = (40 + offset) + 'px';
        winDiv.style.width = '480px';
        winDiv.style.height = '320px';
        winDiv.style.zIndex = 10 + this.windows.length;

        // Запоминаем исходные размеры для восстановления после maximize
        winDiv._prevRect = {
            w: '480px',
            h: '320px',
            l: winDiv.style.left,
            t: winDiv.style.top,
        };
        winDiv.dataset.maximized = 'false';

        const header = document.createElement('div');
        header.className = 'window-header';
        header.innerHTML = `
            <span class="window-title">${title}</span>
            <div class="window-controls">
                <span class="min-btn" title="Свернуть">─</span>
                <span class="max-btn" title="Развернуть">⬜</span>
                <span class="close-btn" title="Закрыть">✕</span>
            </div>
        `;

        const body = document.createElement('div');
        body.className = 'window-body';
        body.innerHTML = contentHTML;

        winDiv.appendChild(header);
        winDiv.appendChild(body);

        this._setupControls(winDiv, id);
        this._setupDragging(winDiv, header, id);
        this._setupFocus(winDiv, id);

        this.workspace.appendChild(winDiv);

        const winObj = { id, app: appId, title, element: winDiv, isActive: true };
        this.windows.push(winObj);

        this.windows.forEach(w => {
            if (w.id !== id) w.isActive = false;
        });
        this.activeWindowId = id;

        TaskbarManager.update(this.windows);
        this._bringToFront(id);

        return id;
    },

    close: function(id) {
        const idx = this.windows.findIndex(w => w.id === id);
        if (idx === -1) return;

        const win = this.windows[idx];
        win.element.remove();
        this.windows.splice(idx, 1);

        if (this.activeWindowId === id) {
            this.activeWindowId = this.windows.length > 0
                ? this.windows[this.windows.length - 1].id
                : null;
            if (this.activeWindowId) {
                const activeWin = this.windows.find(w => w.id === this.activeWindowId);
                if (activeWin) activeWin.isActive = true;
            }
        }

        TaskbarManager.update(this.windows);
        this.windows.forEach((w, i) => {
            w.element.style.zIndex = 10 + i;
        });
    },

    _setupControls: function(winDiv, id) {
        const closeBtn = winDiv.querySelector('.close-btn');
        const minBtn = winDiv.querySelector('.min-btn');
        const maxBtn = winDiv.querySelector('.max-btn');

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close(id);
        });

        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            winDiv.classList.toggle('hidden');
            if (winDiv.classList.contains('hidden')) {
                const win = this.windows.find(w => w.id === id);
                if (win) win.isActive = false;
                TaskbarManager.update(this.windows);
            }
        });

        maxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isMax = winDiv.dataset.maximized === 'true';
            if (isMax) {
                const r = winDiv._prevRect;
                winDiv.style.width = r.w;
                winDiv.style.height = r.h;
                winDiv.style.left = r.l;
                winDiv.style.top = r.t;
                winDiv.dataset.maximized = 'false';
            } else {
                winDiv._prevRect = {
                    w: winDiv.style.width,
                    h: winDiv.style.height,
                    l: winDiv.style.left,
                    t: winDiv.style.top,
                };
                winDiv.style.width = '100%';
                winDiv.style.height = '100%';
                winDiv.style.left = '0';
                winDiv.style.top = '0';
                winDiv.dataset.maximized = 'true';
            }
        });
    },

    _setupDragging: function(winDiv, header, id) {
        let isDragging = false;
        let dragOffsetX, dragOffsetY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            isDragging = true;
            const rect = winDiv.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            winDiv.style.cursor = 'grabbing';
            this._bringToFront(id);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newX = e.clientX - dragOffsetX;
            const newY = e.clientY - dragOffsetY;
            winDiv.style.left = Math.max(0, newX) + 'px';
            winDiv.style.top = Math.max(0, newY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                winDiv.style.cursor = 'default';
            }
        });
    },

    _setupFocus: function(winDiv, id) {
        winDiv.addEventListener('mousedown', () => {
            this._bringToFront(id);
        });
    },

    _bringToFront: function(id) {
        const win = this.windows.find(w => w.id === id);
        if (!win) return;

        this.windows.forEach(w => w.isActive = false);
        win.isActive = true;
        this.activeWindowId = id;

        this.windows.forEach((w, i) => {
            w.element.style.zIndex = 10 + i;
        });
        win.element.style.zIndex = 10 + this.windows.length;

        TaskbarManager.update(this.windows);
    }
};
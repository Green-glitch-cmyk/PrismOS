const SettingsApp = {
    id: 'settings',
    title: 'Параметры',

    _wallpapers: ['img0.jpg', 'img1.jpg', 'img2.jpg'],

    getContent: function() {
        return `
            <div class="metro-panel">
                <h3><i class="fas fa-palette" style="color:#f39c12;"></i> Обои</h3>
                <div id="settings-wallpapers" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;"></div>
            </div>
            <div class="metro-panel">
                <h3><i class="fas fa-tint" style="color:#3498db;"></i> Акцентный цвет</h3>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn-metro" data-accent="#f1c40f" style="background:#f1c40f; color:#000;">Жёлтый</button>
                    <button class="btn-metro" data-accent="#3498db" style="background:#3498db;">Синий</button>
                    <button class="btn-metro" data-accent="#2ecc71" style="background:#2ecc71; color:#000;">Зелёный</button>
                    <button class="btn-metro" data-accent="#e74c3c" style="background:#e74c3c;">Красный</button>
                </div>
            </div>
        `;
    },

    init: function(winElement) {
        const wpContainer = winElement.querySelector('#settings-wallpapers');
        const current = localStorage.getItem('prismos.wallpaper') || 'img0.jpg';

        this._wallpapers.forEach(wp => {
            const btn = document.createElement('button');
            btn.className = 'btn-metro';
            btn.style.cssText = `
                width:80px; height:50px; padding:0;
                background: url('wallpapers/${wp}') center/cover;
                border: 2px solid ${wp === current ? '#f1c40f' : '#333'};
            `;
            btn.title = wp;
            btn.addEventListener('click', () => {
                localStorage.setItem('prismos.wallpaper', wp);
                document.getElementById('workspace').style.backgroundImage = `url('wallpapers/${wp}')`;
                winElement.querySelectorAll('#settings-wallpapers button')
                    .forEach(b => b.style.borderColor = '#333');
                btn.style.borderColor = '#f1c40f';
            });
            wpContainer.appendChild(btn);
        });

        winElement.querySelectorAll('[data-accent]').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.accent;
                document.documentElement.style.setProperty('--glow-accent', `0 0 12px ${color}`);
            });
        });
    }
};
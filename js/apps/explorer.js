const ExplorerApp = {
    id: 'explorer',
    title: 'Проводник',

    _fs: {
        '/': ['Документы', 'Изображения', 'Музыка', 'readme.txt'],
        '/Документы': ['заметки.txt', 'план.md'],
        '/Изображения': ['wallpaper.jpg', 'screenshot.png'],
        '/Музыка': ['track1.mp3'],
    },
    _cwd: '/',

    getContent: function() {
        return `
            <div style="display:flex; flex-direction:column; gap:12px; height:100%;">
                <div style="display:flex; gap:8px; align-items:center;">
                    <button class="btn-metro" id="explorer-back" style="padding:6px 14px;">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <input id="explorer-path" value="${this._cwd}"
                        style="flex:1; padding:6px 10px; border:2px solid #aaa; border-radius:4px; font-family:inherit;"
                        readonly>
                </div>
                <ul class="metro-list" id="explorer-list" style="flex:1; overflow:auto;"></ul>
            </div>
        `;
    },

    init: function(winElement) {
        const list = winElement.querySelector('#explorer-list');
        const path = winElement.querySelector('#explorer-path');
        const back = winElement.querySelector('#explorer-back');

        const render = () => {
            path.value = this._cwd;
            const items = this._fs[this._cwd] || [];
            list.innerHTML = items.map(name => {
                const isDir = name in this._fs;
                const icon = isDir ? 'fa-folder' : 'fa-file-lines';
                const color = isDir ? '#f1c40f' : '#888';
                return `
                    <li data-name="${name}" data-dir="${isDir}" style="cursor:pointer;">
                        <i class="fas ${icon}" style="font-size:20px; width:28px; color:${color};"></i>
                        ${name}
                    </li>
                `;
            }).join('');
        };

        list.addEventListener('dblclick', (e) => {
            const li = e.target.closest('li');
            if (!li) return;
            const name = li.dataset.name;
            const isDir = li.dataset.dir === 'true';
            if (!isDir) return;
            const newPath = this._cwd === '/' ? '/' + name : this._cwd + '/' + name;
            if (this._fs[newPath]) {
                this._cwd = newPath;
                render();
            }
        });

        back.addEventListener('click', () => {
            if (this._cwd === '/') return;
            const parts = this._cwd.split('/').filter(Boolean);
            parts.pop();
            this._cwd = parts.length ? '/' + parts.join('/') : '/';
            render();
        });

        render();
    }
};
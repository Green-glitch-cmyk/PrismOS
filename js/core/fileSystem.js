// ============================================================
// Виртуальная файловая система PrismOS
// ============================================================

const FileSystem = {
    _key: 'prismos.fs',

    // Структура: { path: { type: 'folder'|'file', children: [...], size, modified } }
    data: {},

    init: function() {
        const saved = localStorage.getItem(this._key);
        if (saved) {
            try { this.data = JSON.parse(saved); } catch { this.data = this._default(); }
        } else {
            this.data = this._default();
            this.save();
        }
    },

    save: function() {
        localStorage.setItem(this._key, JSON.stringify(this.data));
    },

    reset: function() {
        this.data = this._default();
        this.save();
    },

    _default: function() {
        const folders = [
            'Видео', 'Документы', 'Загрузки', 'Изображения',
            'Музыка', 'Объемные объекты', 'Рабочий стол',
        ];
        const files = ['readme.txt', 'notes.md', 'config.json'];

        return {
            '/': { type: 'folder', children: folders.concat(files), modified: this._now() },

            '/Документы': { type: 'folder', children: ['заметки.txt', 'план.md'], modified: this._now() },
            '/Изображения': { type: 'folder', children: ['wallpaper.jpg', 'screenshot.png'], modified: this._now() },
            '/Музыка': { type: 'folder', children: ['track1.mp3', 'track2.mp3'], modified: this._now() },
            '/Видео': { type: 'folder', children: [], modified: this._now() },
            '/Загрузки': { type: 'folder', children: ['setup.exe'], modified: this._now() },
            '/Объемные объекты': { type: 'folder', children: [], modified: this._now() },
            '/Рабочий стол': { type: 'folder', children: [], modified: this._now() },

            '/readme.txt': { type: 'file', size: 1024, modified: this._now() },
            '/notes.md':   { type: 'file', size: 512,  modified: this._now() },
            '/config.json': { type: 'file', size: 256, modified: this._now() },
        };
    },

    _now: function() {
        return new Date().toISOString().slice(0, 16).replace('T', ' ');
    },

    // Список дочерних элементов по пути
    list: function(path) {
        const node = this.data[path];
        if (!node || node.type !== 'folder') return [];

        return node.children.map(name => {
            const childPath = path === '/' ? '/' + name : path + '/' + name;
            const child = this.data[childPath];
            return {
                name,
                path: childPath,
                type: child ? child.type : 'file',
                size: child ? (child.size || 0) : 0,
                modified: child ? (child.modified || '—') : '—',
            };
        });
    },

    mkdir: function(parent, name) {
        if (!this.data[parent] || this.data[parent].type !== 'folder') return false;
        if (this.data[parent].children.includes(name)) return false;
        const newPath = parent === '/' ? '/' + name : parent + '/' + name;
        if (this.data[newPath]) return false;

        this.data[parent].children.push(name);
        this.data[newPath] = { type: 'folder', children: [], modified: this._now() };
        this.data[parent].modified = this._now();
        this.save();
        return true;
    },

    writeFile: function(parent, name, size = 0) {
        if (!this.data[parent] || this.data[parent].type !== 'folder') return false;
        const newPath = parent === '/' ? '/' + name : parent + '/' + name;
        if (this.data[parent].children.includes(name)) return false;

        this.data[parent].children.push(name);
        this.data[newPath] = { type: 'file', size, modified: this._now() };
        this.data[parent].modified = this._now();
        this.save();
        return true;
    },

    remove: function(path) {
        if (path === '/') return false;
        const parent = path.substring(0, path.lastIndexOf('/')) || '/';
        const name   = path.substring(path.lastIndexOf('/') + 1);

        if (!this.data[parent] || !this.data[parent].children.includes(name)) return false;

        // Удаляем рекурсивно
        const deleteRec = (p) => {
            const node = this.data[p];
            if (!node) return;
            if (node.type === 'folder') {
                node.children.forEach(child => {
                    const cp = p === '/' ? '/' + child : p + '/' + child;
                    deleteRec(cp);
                });
            }
            delete this.data[p];
        };

        deleteRec(path);
        this.data[parent].children = this.data[parent].children.filter(c => c !== name);
        this.data[parent].modified = this._now();
        this.save();
        return true;
    },

    rename: function(oldPath, newName) {
        if (oldPath === '/') return false;
        const parent = oldPath.substring(0, oldPath.lastIndexOf('/')) || '/';
        const oldName = oldPath.substring(oldPath.lastIndexOf('/') + 1);
        const newPath = parent === '/' ? '/' + newName : parent + '/' + newName;

        if (this.data[newPath]) return false;
        if (!this.data[parent].children.includes(oldName)) return false;

        this.data[parent].children = this.data[parent].children.map(c => c === oldName ? newName : c);

        // Перенос узла и всех вложенных
        const moveRec = (from, to) => {
            const node = this.data[from];
            if (!node) return;
            this.data[to] = node;
            delete this.data[from];
            if (node.type === 'folder') {
                node.children.forEach(child => {
                    moveRec(
                        from === '/' ? '/' + child : from + '/' + child,
                        to   === '/' ? '/' + child : to   + '/' + child
                    );
                });
            }
        };
        moveRec(oldPath, newPath);

        this.data[parent].modified = this._now();
        this.save();
        return true;
    },

    get: function(path) {
        return this.data[path] || null;
    },
};

document.addEventListener('DOMContentLoaded', function() {
    FileSystem.init();
});
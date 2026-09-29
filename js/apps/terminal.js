const TerminalApp = {
    id: 'terminal',
    title: 'Терминал',

    getContent: function() {
        return `
            <div style="display:flex; flex-direction:column; height:100%; background:#0d0d0d; color:#0f0; font-family:'Consolas','Courier New',monospace; border-radius:4px; padding:8px;">
                <div id="terminal-output" style="flex:1; overflow:auto; white-space:pre-wrap; font-size:13px;"></div>
                <div style="display:flex; gap:6px; align-items:center; border-top:1px solid #333; padding-top:6px;">
                    <span style="color:#0f0;">&gt;</span>
                    <input id="terminal-input"
                        style="flex:1; background:transparent; border:none; outline:none; color:#0f0; font-family:inherit; font-size:13px;"
                        autocomplete="off">
                </div>
            </div>
        `;
    },

    _commands: {
        help:   () => 'Доступно: help, ls, open <app>, clear, echo <text>, about',
        ls:     () => Object.keys(AppLauncher.apps).join('  '),
        open:   (args) => {
            const appId = args[0];
            if (!appId || !AppLauncher.apps[appId]) return `Приложение не найдено: ${appId || '?'}`;
            AppLauncher.launch(appId);
            return `Запуск ${appId}...`;
        },
        clear:  () => { document.getElementById('terminal-output').innerHTML = ''; return ''; },
        echo:   (args) => args.join(' '),
        about:  () => 'PrismOS Alpha 1 · MIT License · 2026',
    },

    init: function(winElement) {
        const out = winElement.querySelector('#terminal-output');
        const input = winElement.querySelector('#terminal-input');

        const print = (text, cls = '') => {
            const line = document.createElement('div');
            if (cls) line.style.color = cls;
            line.textContent = text;
            out.appendChild(line);
            out.scrollTop = out.scrollHeight;
        };

        print('PrismOS Terminal · Alpha 1');
        print('Введи "help" для списка команд.');
        print('');

        input.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const raw = input.value.trim();
            input.value = '';
            if (!raw) return;
            print('> ' + raw, '#888');

            const [cmd, ...args] = raw.split(/\s+/);
            const fn = this._commands[cmd];
            if (!fn) {
                print(`Команда не найдена: ${cmd}`, '#e74c3c');
                return;
            }
            const result = fn(args);
            if (result) print(result);
        });

        input.focus();
    }
};
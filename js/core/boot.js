const BootScreen = {
    totalDuration: 5000,   // ровно 5 сек
    stages: [
        { label: 'Инициализация ядра…',           at: 0     },
        { label: 'Проверка оборудования…',         at: 0.12  },
        { label: 'Загрузка драйверов…',            at: 0.25  },
        { label: 'Запуск оконного менеджера…',     at: 0.40  },
        { label: 'Загрузка приложений…',           at: 0.55  },
        { label: 'Восстановление рабочего стола…', at: 0.70  },
        { label: 'Подготовка интерфейса…',         at: 0.83  },
        { label: 'Почти готово…',                  at: 0.93  },
        { label: 'Готово',                         at: 1.00  },
    ],

    init: function() {
        this.el     = document.getElementById('boot-screen');
        this.bar    = document.getElementById('boot-progress-bar');
        this.status = document.getElementById('boot-status');
        if (!this.el || !this.bar || !this.status) return;
        this.run();
    },

    run: function() {
        const start = performance.now();
        const total = this.totalDuration;

        const tick = (now) => {
            const t = Math.min(1, (now - start) / total);

            // Прогресс-бар
            this.bar.style.width = (t * 100).toFixed(1) + '%';

            // Текст этапа
            let current = this.stages[0];
            for (const s of this.stages) {
                if (t >= s.at) current = s;
            }
            if (this.status.textContent !== current.label) {
                this.status.textContent = current.label;
            }

            if (t < 1) {
                requestAnimationFrame(tick);
            } else {
                setTimeout(() => this.finish(), 200);
            }
        };

        requestAnimationFrame(tick);
    },

    finish: function() {
        this.el.classList.add('hidden');

        // Пробуем проиграть startup сразу после boot
        if (typeof Sounds !== 'undefined') {
            Sounds.startup();

            // Если браузер заблокировал автоплей — играем при первом клике
            this._ensureStartupPlayed();
        }

        setTimeout(() => this.el.remove(), 700);
    },

    _ensureStartupPlayed: function() {
        const audio = Sounds._get('startup');
        // Если через 100мс не заиграло — вешаем разовый обработчик на первый клик
        setTimeout(() => {
            if (!audio.paused && audio.currentTime > 0) return;   // играет, ок
            const unlock = () => {
                Sounds.startup();
                document.removeEventListener('click',     unlock);
                document.removeEventListener('keydown',   unlock);
                document.removeEventListener('mousedown', unlock);
            };
            document.addEventListener('click',     unlock);
            document.addEventListener('keydown',   unlock);
            document.addEventListener('mousedown', unlock);
        }, 100);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    BootScreen.init();
});
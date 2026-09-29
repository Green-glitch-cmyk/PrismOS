const CalculatorApp = {
    id: 'calculator',
    title: 'Калькулятор',

    getContent: function() {
        return `
            <div style="display:flex; flex-direction:column; gap:10px; height:100%;">
                <input id="calc-display" readonly value="0"
                    style="padding:12px; font-size:24px; text-align:right; border:2px solid #aaa; border-radius:4px; font-family:inherit; background:#fff;">
                <div id="calc-grid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; flex:1;"></div>
            </div>
        `;
    },

    init: function(winElement) {
        const display = winElement.querySelector('#calc-display');
        const grid = winElement.querySelector('#calc-grid');

        const buttons = [
            'C','←','%','/',
            '7','8','9','*',
            '4','5','6','-',
            '1','2','3','+',
            '0','.','=',''
        ];

        let expr = '';

        const update = () => { display.value = expr || '0'; };

        buttons.forEach(label => {
            if (!label) return;
            const btn = document.createElement('button');
            btn.className = 'btn-metro';
            btn.textContent = label;
            btn.style.cssText = 'padding:12px; font-size:18px; width:100%;';

            btn.addEventListener('click', () => {
                if (label === 'C') { expr = ''; update(); return; }
                if (label === '←') { expr = expr.slice(0, -1); update(); return; }
                if (label === '=') {
                    try {
                        // Только цифры и операторы — без eval на произвольном коде
                        if (!/^[0-9+\-*/.%() ]+$/.test(expr)) throw new Error();
                        const result = Function('"use strict";return (' + expr + ')')();
                        expr = String(result);
                    } catch {
                        expr = 'Ошибка';
                    }
                    update();
                    return;
                }
                expr += label;
                update();
            });

            grid.appendChild(btn);
        });

        update();
    }
};
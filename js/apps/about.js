const AboutApp = {
    id: 'about',
    title: 'О системе',

    getContent: function() {
        const username = localStorage.getItem('prismos.username') || 'Пользователь';
        const build = 'a2-2909';
        const version = 'Alpha 2';

        return `
            <div style="
                padding: 4px 0;
                font-size: 13px;
                color: #1a1a1a;
                background: #fff;
                height: 100%;
                display: flex;
                flex-direction: column;
            ">
                <!-- Логотип и название -->
                <div style="display:flex; align-items:center; gap:16px; margin: 8px 0 16px;">
                    <i class="fas fa-cube" style="
                        font-size: 56px;
                        color: #0078d7;
                        line-height: 1;
                    "></i>
                    <div>
                        <div style="font-size: 32px; font-weight: 300; color: #0078d7; line-height: 1;">
                            PrismOS
                        </div>
                        <div style="font-size: 16px; color: #0078d7; margin-top: 4px;">
                            ${version}
                        </div>
                    </div>
                </div>

                <!-- Разделитель -->
                <hr style="border: none; border-top: 1px solid #d0d0d0; margin: 0 0 14px;">

                <!-- Текстовые блоки -->
                <div style="line-height: 1.55; font-size: 12.5px;">
                    <p style="margin-bottom: 8px;">
                        PrismOS ${version} (сборка ${build})
                    </p>
                    <p style="margin-bottom: 8px;">
                        © 2026 PrismOS Team. Все права защищены.
                    </p>
                    <p style="margin-bottom: 16px;">
                        Операционная система PrismOS и пользовательский интерфейс
                        защищены авторским правом и распространяются под лицензией MIT.
                    </p>
                    <p style="margin-bottom: 6px;">
                        Продукт лицензирован в соотв. с
                        <a href="#" style="color:#0078d7; text-decoration:none;"
                           onclick="UI.alert('Полный текст лицензии — в файле LICENSE в репозитории.', {title:'Условия использования'}); return false;">
                            усл. лиц. соглашения на исп. ПО PrismOS
                        </a>,
                        выданного:
                    </p>
                    <p style="margin-left: 20px; margin-bottom: 4px;">
                        <strong>${username}</strong>
                    </p>
                </div>

                <!-- Кнопка OK -->
                <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 12px;">
                    <button class="btn-metro" id="about-ok" style="
                        padding: 5px 28px;
                        font-size: 13px;
                        min-width: 84px;
                    ">
                        ОК
                    </button>
                </div>
            </div>
        `;
    },

    init: function(winElement) {
        const winDiv = winElement.closest('.window');
        if (winDiv) {
            winDiv.style.width  = '440px';
            winDiv.style.height = '380px';
            // Запрещаем resize — winver не растягивается
            winDiv.style.resize = 'none';
        }

        const ok = winElement.querySelector('#about-ok');
        if (ok) {
            ok.addEventListener('click', () => {
                const id = winDiv.dataset.windowId;
                if (id) WindowManager.close(id);
            });
        }
    }
};
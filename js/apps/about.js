const AboutApp = {
    id: 'about',
    title: 'О системе',

    getContent: function() {
        return `
            <div style="padding: 8px 0;">
                <div style="text-align:center; padding:24px 0; border-bottom:2px solid #ddd;">
                    <i class="fas fa-cube" style="font-size:64px; color:#f1c40f; margin-bottom:12px; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.3));"></i>
                    <h2 style="font-weight:300; letter-spacing:2px; font-size:32px;">PrismOS</h2>
                    <p style="color:#666; font-size:14px;">Alpha 1 · 2026</p>
                </div>
                <div class="metro-panel" style="margin-top:12px;">
                    <h3><i class="fas fa-list" style="color:#9b59b6;"></i> Что нового в Alpha 1</h3>
                    <ul class="metro-list">
                        <li><i class="fas fa-cube" style="width:28px; color:#f1c40f;"></i> 3D-эффекты интерфейса</li>
                        <li><i class="fas fa-terminal" style="width:28px; color:#2ecc71;"></i> Терминал</li>
                        <li><i class="fas fa-calculator" style="width:28px; color:#3498db;"></i> Калькулятор</li>
                        <li><i class="fas fa-note-sticky" style="width:28px; color:#e74c3c;"></i> Блокнот с сохранением</li>
                    </ul>
                </div>
            </div>
        `;
    }
};
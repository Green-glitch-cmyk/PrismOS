const AboutApp = {
    id: 'about',
    title: 'О системе',
    
    getContent: function() {
        return `
            <div style="padding: 8px 0;">
                <div style="text-align:center; padding:20px 0; border-bottom:2px solid #ddd;">
                    <i class="fas fa-cube" style="font-size:64px; color:#f1c40f; margin-bottom:12px;"></i>
                    <h2 style="font-weight:300; letter-spacing:2px; font-size:32px;">PrismOS</h2>
                    <p style="color:#666; font-size:14px;">Версия 1.0 · 2026</p>
                </div>
                <div style="padding:16px 0;">
                    <p style="font-size:14px; line-height:1.8;">
                        <i class="fas fa-check-circle" style="color:#2ecc71;"></i> Веб-ОС в стиле Metro UI<br>
                        <i class="fas fa-square" style="color:#f1c40f;"></i> Все края плоские, без скруглений<br>
                        <i class="fas fa-rocket" style="color:#3498db;"></i> Быстрая и лёгкая<br>
                        <i class="fas fa-code" style="color:#e74c3c;"></i> Сделано с ❤️
                    </p>
                </div>
            </div>
        `;
    }
};
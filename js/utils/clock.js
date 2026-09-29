(function() {
    const timeEl = document.getElementById('tb-clock-time');
    const dateEl = document.getElementById('tb-clock-date');
    if (!timeEl) return;

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const mo = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();

        timeEl.textContent = `${h}:${m}`;
        if (dateEl) dateEl.textContent = `${d}.${mo}.${y}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
})();
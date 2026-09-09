(function() {
    const clockEl = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        clockEl.innerHTML = `<i class="far fa-clock"></i> ${h}:${m}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
})();
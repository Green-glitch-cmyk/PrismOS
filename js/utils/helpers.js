const Helpers = {
    generateId: function() {
        return Date.now() + Math.floor(Math.random() * 1000);
    },

    formatDate: function(date) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }
};
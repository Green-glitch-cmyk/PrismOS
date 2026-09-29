const Sounds = {
    _cache: {},

    _get: function(name) {
        if (!this._cache[name]) {
            this._cache[name] = new Audio(`assets/sounds/${name}.mp3`);
            this._cache[name].preload = 'auto';
        }
        return this._cache[name];
    },

    play: function(name, volume = 0.6) {
        try {
            const a = this._get(name);
            a.volume = volume;
            a.currentTime = 0;
            const p = a.play();
            if (p && p.catch) p.catch(() => { /* автоплей заблокирован до первого клика */ });
        } catch (e) {
            // тихо игнорируем — звук не критичен
        }
    },

    startup: function() { this.play('startup', 0.5); },
    error:   function() { this.play('error',   0.5); },
    notify:  function() { this.play('notify',  0.4); },
};
const path = require("path");

class _RequireUtil {
    get cacheArray() {
        return Object.values(require.cache);
    }

    filterModules(q, strict = false, lr = false) {
        let qr = q;
        while (qr.startsWith("."))
            qr = qr.replace(".", "");

        const a = [];

        const Q1 = require.cache[q];
        if (Q1) return a.push(Q1);

        const Q2 = require.cache[path.resolve(q)];
        if (Q2) return a.push(Q2);

        const Q3 = require.cache[qr];
        if (Q3) return a.push(Q3);

        const Q4 = require.cache[path.resolve(qr)];
        if (Q4) return a.push(Q4);

        if (!strict) {
            const Q5 = this.cacheArray.filter(mod=>{
                const mQ1 = mod.id.startsWith(qr);
                if (mQ1)
                    return true;

                const mQ2 = mod.id.endsWith(qr);
                if (mQ2)
                    return true;

                if (lr)
                    return mod.id.includes(qr);

                return false;
            });
            for (const mod of Q5)
                a.push(mod);
        }
        
        return a;
    }

    uncacheModule(mod) {
        delete require.cache[mod.id];
    }

    uncachePath(path, strict = false, lr = false) {
        const mod = require.cache[path];
        if (mod)
            this.uncacheModule(mod);
        else {
            this.uncacheFiltered(path, strict, lr);
        }
    }

    uncacheFiltered(query, strict = false, lr = false) {
        const mods = this.filterModules(query, strict, lr);
        for (const mod in mods)
            this.uncachePath(mod);
    }

    uncacheAll() {
        for (const mod in require.cache)
            delete require.cache[mod];
    }

    reloadModule(mod) {
        this.uncacheModule(mod);
        return require(mod.id);
    }

    reloadPath(path, strict = false, lr = false) {
        const mod = require.cache[path];
        if (mod) {
            this.uncacheModule(mod);
            return require(mod.id);
        } else
            return null;
    }

    reloadFiltered(query, strict = false, lr = false) {
        const a = [];

        const mods = this.filterModules(query, strict, lr);      
        for (const mod in mods) {
            this.uncachePath(mod);
            a.push(require(mod));
        }

        return a;
    }
}

global.RUtil = new _RequireUtil();
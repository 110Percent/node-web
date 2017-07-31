const lconfig = config.get("Logger").entries;

Object.defineProperty(String.prototype, "color", {
    get: function(){ return (c)=>{
        return "\033[38;5;"+c+"m"+this.toString()+"\033[0m";
    }}
});

Object.defineProperty(String.prototype, "bgColor", {
    get: function(){ return (c)=>{
        return "\033[48;5;"+c+"m"+this.toString()+"\033[0m";
    }}
});

class Logger {
    constructor() {
        this.logtypes = {};

        this._loadLogtypes();
    }

    _loadLogtypes() {
        for (const t in lconfig)
            this.logtypes[t] = lconfig[t].raw;
    }

    log(msg = "", type = "") {
        let t = null;
        let s = msg;

        if (type in this.logtypes) {
            t =  this.logtypes[type];

            let preInsert = "";
            
            if (t.prefix)
                preInsert += t.prefix;

            if (t.prefixBgColor)
                preInsert = preInsert.bgColor(t.prefixBgColor)
            else if (t.bgColor)
                preInsert = preInsert.bgColor(t.bgColor);
            
            if (t.prefixColor)
                preInsert = preInsert.color(t.prefixColor);
            else if (t.color)
                preInsert = preInsert.color(t.color);
            
            if (t.bgColor)
                s = s.bgColor(t.bgColor);

            if (t.color)
                s = s.color(t.color);

            s = preInsert+(t.postPrefix?t.postPrefix:"")+s;
        }

        console.log(s);
    }
}

global.logger = new Logger();
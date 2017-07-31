class Connection {
    constructor(i, id = new Date().getTime()) {
        this.i = i;
        this.id = id;

        this.invalidated = false;
    }

    get ip() {
        return CMeta.IP(this.i);
    }

    LogConnection() {
        // For security and debugging purposes. //

        const dir = this.i.headers["x-forwarded-host"];

        logger.log(`${this.ip}: Requesting ${dir}${this.i.url}`, "site");
        
        let content = "";
        content += `Connection:\n ${this.ip}`;
        content += `\n\nPath:\n ${this.i.method} ${this.i.url}`;
        content += `\n\nTimestamp:\n ${this.id}`
        content += "\n\nHeaders:";
        for (const header in this.i.headers)
            content += `\n ${header} = ${this.i.headers[header]}`;

        if (!fs.existsSync(`./logs/${dir}`))
            fs.mkdirSync(`./logs/${dir}`);

        fs.writeFileSync(`./logs/${this.log}`, content);
    }

    Invalidate(reason) {
        this.invalidated = reason;

        const path = `../logs/${this.log}`;

        if (fs.existsSync(path)) {
            fs.appendFileSync(path, `\n\nINVALIDATED:\n ${reason}`)
        }
    }

    get log() {
        return `${this.i.headers["x-forwarded-host"]}/${this.ip}@${this.id}.log`;
    }
}

class _CMeta {
    constructor() {
        this.connections = new Map();
    }

    connection(i) {
        const _ = new Connection(i);
        _.LogConnection();
        return _;
    }

    IP(i) {
        return i.headers["cf-connecting-ip"] || i.headers["x-forwarded-for"].split(",")[0]
    }
}

global.CMeta = new _CMeta();
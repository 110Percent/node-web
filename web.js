const Express = require("express");
const express = Express();
const fs = require("fs");

require("./utility/config.js");  // config //

logger.log("Initialisation finished.", "info");

express.get("*", (i, o)=>{
    const iMeta = CMeta.connection(i);

    const site = i.headers["x-forwarded-host"];

    const bl = config.get("Blacklist").raw;
    if (Object.keys(bl).includes(iMeta.ip) || `${site}${i.url}` === "this-is-a.site/_block") {
        const r = bl[iMeta.ip];

        logger.log(`${iMeta.ip}: Blocked request; blacklisted.`, "warn");

        iMeta.Invalidate(`BLACKLISTED: "${r}"`);

        let content = "<b>Global ban from sites on port:</b>";
        content += `<br/> ${r}`;
        content += `<br/><br/>IP: ${iMeta.ip}`;
        content += `<br/>Log: ${iMeta.log}`;
        content += `<br/>iMeta: CMeta.connections.get("${iMeta.id}")`;
        content += `<br/>Time: ${new Date().getTime()}`;
        content += "<br/><br/>If you believe this is in error, email bubb1e@protonmail.ch";

        return o.status(403).send(content);
    }

    //o.send("<p>help me</p>");

    const sites = config.get("Sites").raw;
    const static = config.get("Listener").get("static").values;

    if (!(site in sites)) {
        const r = `Invalid request to ${site}${i.url}`;

        logger.log(`${iMeta.ip}: ${r}`, "warn");

        iMeta.Invalidate(r);
        o.status(404).send(r);

        return;
    }

    const rootPath = `./sites/${sites[site]}`;

    let path = `${rootPath}${i.url}`;

    let pathStat = null;
    try {
        pathStat = fs.statSync(path);
    } catch(e) {
        //o.writeHead(404, `Invalid or non-existent path.`);
    }
    if (pathStat === null) return;

    let r = false;

    if (pathStat.isDirectory()) {
        const files = fs.readdirSync(path);

        const f = files.includes("index.html");

        if (f)
            path = `${path.endsWith("/")?path:`${path}/`}index.html`;
        else {
            let content = `Contents of <b><a href="${i.url}">${i.url}</a></b>`;
            for (const file of files)
                content += `<br><a href="${i.url}${file}">${site}${i.url}${file}</a>`;
            r = true;
            o.send(content);
        }
    }

    if (r)
        return;

    const ext = path.slice(path.lastIndexOf("."));

    if (static.includes(ext))
        o.sendFile(`${__dirname}${path.replace(".", "")}`);
    else {
        const content = fs.readFileSync(path, {encoding:"utf8"});
        const d = DJS.Apply(content);
        o.send(d);
    }
});

const port = config.get("Listener").get("port").raw;
express.listen(port, ()=>{
    logger.log(`Ready for requests on port ${port}.`, "site");
});
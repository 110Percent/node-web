// Misc //

// Tags //

function _DJSC(i) {
    let r = i;
    let ch = r.split("");

    for (const c in ch) {
        const roll = Math.floor(Math.random()*100);
        ch[c] = roll/2===Math.floor(roll/2)?ch[c].toUpperCase():ch[c].toLowerCase()
    }

    r = ch.join("");

    return r;
}

function _DJSF(i) {
    let r = i;
    let ch = r.split("");

    for (const c in ch)
        ch[c] = `<span style="font-size:${Math.floor(Math.random()*(50 - 35 + 1)+35)}">${ch[c]}</span>`;

    r = ch.join("");

    return `<nobr>${r}</nobr>`;
}

function _DJSCF(i) {
    i = _DJSC(i);
    i = _DJSF(i);
    return i;
}

const tags = {
    "DJS:F" : _DJSF,
    "DJS:CF": _DJSCF,
    "DJS:C" : _DJSC,
}

// Dynamic Page //

function _dPageTREP(c, o, oC, R) {
    while (c.includes(o)) {
        const i = c.indexOf(o)+o.length;
        const e = c.slice(i).indexOf(oC);
        const _ = c.substr(i, e);
        const _x = R?R(_):"";
        c = c.replace(o, "");
        c = c.replace(oC, "");
        c = `${c.substr(0, i-o.length)}${_x}${c.slice(i-o.length+e)}`;
    }
    return c;
}

function _dPageJS(c) {
    return _dPageTREP(c, "<?js", "?>", _eval);
}

function _dPageTags(c) {
    let r = c;
    for (const tag in tags) {
        const tfunc = tags[tag];
        r = _dPageTREP(r, `<${tag}>`, `</${tag}>`, tfunc);
    }
    return r;
}

function _dPage(c) {
    let r = c;

    r = _dPageJS(r);
    r = _dPageTags(r);

    return r;
}

// Code Eval //

function _eval(c) {
    let r = "";
    print = ((m)=>{
        r += m;
    });
    eval(c);
    delete print;
    return r;
}

// Class/Init //

class _DJS {
    Apply(c) {
        return _dPage(c);
    }
}

global.DJS = new _DJS();
/**
 * @see https://github.com/ZitRos/domUtils
 * @author ZitRo
 * @licence MIT
 * Creates an element.
 * @param {string} element - Tag Name
 * @param {string|object} [className] - CSS class name
 * @param {string} [textContent] - Optional content
 * @param {Array} [children] - Optional array of children, which are attached to the block.
 * @returns {Element}
 */
export function block (element = "div", className, textContent, children) {

    let el = document.createElement(element || "div"),
        c = children || [];

    if (className instanceof Array) {
        c = className;
    } else if (typeof className === "string") {
        el.className = className;
    } else if (typeof className === "object") {
        if (className.style) el.setAttribute("style", className.style);
        if (className.class) el.className = className.class;
        if (className.textContent) el.textContent = className.textContent;
        if (typeof className["onClick"] === "function")
            el.addEventListener("click", className["onClick"]);
    }

    if (textContent instanceof Array) {
        c = textContent;
    } else if (typeof textContent === "string")
        el.textContent = textContent;

    c.forEach(a => { if (a) el.appendChild(a) });

    return el;
}

let loader = block(`div`, {
    class: `central loading`,
    style: `position:fixed`
}, [
    block(`div`, [
        block(`div`, [
            block(`div`, `loader`, [
                block(`div`, `inner one`),
                block(`div`, `inner two`),
                block(`div`, `inner three`)
            ])
        ])
    ])
]);

/**
 * Make input auto-sizable.
 * @param {HTMLInputElement} input
 * @param {number=30} minWidth
 */
export function makeAutosizable (input, minWidth = 30) {
    function updateInput () {
        let style = window.getComputedStyle(input),
            ghost = document.createElement(`span`);
        ghost.style.cssText = `box-sizing:content-box;display:inline-block;height:0;`
            + `overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:nowrap;`
            + `font-family:${ style.fontFamily };font-size:${ style.fontSize };`
            + `padding:${ style.padding }`;
        ghost.textContent = input.value;
        document.body.appendChild(ghost);
        input.style.width = ghost.offsetWidth + 4
            + (input.getAttribute("type") === "number" ? 20 : 0) + "px";
        document.body.removeChild(ghost);
    }
    input.style.minWidth = `${ minWidth }px`;
    input.style.maxWidth = "90%";
    input.addEventListener(`input`, () => updateInput());
    updateInput();
}

/**
 * @param {string} theUrl
 * @param {function} callback
 */
export function httpGet (theUrl, callback)  {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            let data;
            if (xmlHttp.status !== 200) {
                callback({ error: `Request to ${ theUrl } returned status ${ xmlHttp.status }` });
                return;
            }
            try {
                data = JSON.parse(xmlHttp.responseText);
            } catch (e) {
                console.error(e, xmlHttp.responseText);
                callback({ error: e });
                return;
            }
            callback(data);
        }
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

/**
 * Show the loader over the page.
 * @param {boolean} [on]
 */
export function toggleLoader (on = true) {
    if (on) {
        document.body.appendChild(loader);
    } else if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
    }
}

/**
 * @param {object} obj
 * @param {*[]} props
 */
export function getObjProp (obj, props) {
    let o = obj, nil = {};
    for (let p of props)
        o = typeof o[p] === "undefined" ? nil : o[p];
    return o === nil ? undefined : o;
}
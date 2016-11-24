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
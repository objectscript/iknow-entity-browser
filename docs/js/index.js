/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.uiState = undefined;
exports.update = update;
exports.getGraphData = getGraphData;
exports.onModelUpdate = onModelUpdate;
exports.init = init;
exports.unfold = unfold;
exports.dropDescendants = dropDescendants;
exports.dropNodes = dropNodes;

var _sample_output = __webpack_require__(18);

var _sample_output2 = _interopRequireDefault(_sample_output);

var _source = __webpack_require__(13);

var _values = __webpack_require__(1);

var _utils = __webpack_require__(2);

var _history = __webpack_require__(10);

var history = _interopRequireWildcard(_history);

var _toasterJs = __webpack_require__(17);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SIZE_CRITERIA = "frequency",
    FOLDING_CRITERIA = "frequency",
    MAX_CHILDREN = 20,
    MIN_RADIUS = 5,
    graph = null,
    additionalNodeId = -1,
    updateCallbacks = [];

function fold(tree) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = tree.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cld = _step.value;

            fold(cld);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (tree.children && tree.children.length > MAX_CHILDREN) {
        var rest = tree.children.splice(MAX_CHILDREN);
        tree._children = rest;
        tree.children.push({
            label: rest.length + " more",
            type: "folder",
            edgeType: rest[0].edgeType,
            children: [],
            radius: 10,
            entities: [],
            id: additionalNodeId--,
            parent: tree
        });
    }
    return tree;
}

/**
 * Converts flat input data into a tree using implicit parent-children relationships. This
 * function also sorts the children data by relevance.
 * @param graph
 * @param parent
 * @returns {*}
 */
function toTree(graph, parent) {

    parent.children = [];

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = graph.edges[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var edge = _step2.value;

            if (edge.source !== parent.id) continue;
            var t = null;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = graph.nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var node = _step3.value;

                    if (node.id === edge.target) {
                        t = node;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (t) {
                t.edgeType = edge.type;
                parent.children.push(toTree(graph, t));
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    try {
        parent.children.sort(function (a, b) {
            return a.entities[0][FOLDING_CRITERIA] > b.entities[0][FOLDING_CRITERIA] ? -1 : 1;
        }).forEach(function (e) {
            return e.parent = parent;
        });
    } catch (e) {
        console.error("Error! Most likely, one of the graph nodes does not has any entities." + " The folding criteria displayed on the diagram will be random.");
    }

    return parent;
}

/**
 * This function converts graph model data to internal application's format.
 * @param graph
 * @returns {{graph: *, tree: *, foldedTree: *}}
 */
function preprocess(graph) {

    var zeroID = null,
        maxSizeCriteria = 1;

    graph.nodes.forEach(function (node) {
        if (!zeroID && node.id === 0) zeroID = node;
    });
    graph.nodes.forEach(function (node) {
        node.radius = MIN_RADIUS + Math.sqrt(node.entities[0][SIZE_CRITERIA] / 4 || 25);
        if (node.entities[0][SIZE_CRITERIA] > maxSizeCriteria) maxSizeCriteria = node.entities[0][SIZE_CRITERIA];
    });
    if (!zeroID) {
        graph.nodes.unshift(zeroID = {
            id: 0,
            label: (0, _values.getOption)("seed"),
            type: "entity",
            edgeType: "root",
            radius: MIN_RADIUS + Math.sqrt((maxSizeCriteria + 1) / 4 || 25),
            entities: [_defineProperty({
                id: -1,
                value: (0, _values.getOption)("seed"),
                score: 9999,
                spread: 0,
                frequency: 9999
            }, SIZE_CRITERIA, maxSizeCriteria + 1)]
        });
    }
    // console.log(`Graph:`, graph);
    var tree = toTree(graph, zeroID);
    // console.log(`Tree:`, tree);

    return fold(tree);
}

/**
 * Updates the data from a server.
 */
function update() {
    (0, _utils.toggleLoader)();
    (0, _source.getData)(function (data) {
        (0, _utils.toggleLoader)(false);
        if (data.error || !data.graph) {
            new _toasterJs.Toast(data.error || "No graph data returned", _toasterJs.Toast.TYPE_ERROR);
        } else {
            graph = preprocess(data.graph);
            dataUpdated(true);
        }
    });
}

function dataUpdated() {
    var reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (reset) history.reset();
    updateCallbacks.forEach(function (cb) {
        return cb(graph, reset);
    });
}

function getGraphData() {
    return graph;
}

/**
 * This callback is invoked when graph is updated.
 * @callback modelUpdate
 * @param {*} graph
 * @param {boolean} force - Determines whether graph changed completely.
 */

/**
 * Model update handler.
 * @param {modelUpdate} callback
 */
function onModelUpdate(callback) {
    if (typeof callback !== "function") throw new Error("Expecting function as a callback.");
    updateCallbacks.push(callback);
    if (graph) callback(graph, true);
}

var uiState = exports.uiState = {
    tabularToggled: false,
    detailsToggled: false,
    settingsToggled: false
};

function init() {
    graph = preprocess(_sample_output2.default.graph);
    history.init();
    dataUpdated(true);
}

function resetChildrenPosition(folder) {
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!children || !children.length) return;
    var xd = folder.x - folder.parent.x,
        yd = folder.y - folder.parent.y,
        angle = Math.atan2(yd, xd),
        d = Math.sqrt(xd * xd + yd * yd),
        spread = Math.PI / 2;
    for (var i = 0; i < children.length; i++) {
        var c = children[i],
            spd = -spread / 2 + spread * i / (children.length - 1 || 0.5),
            dx = Math.cos(angle + spd) * d,
            dy = Math.sin(angle + spd) * d;
        c.x = folder.parent.x + dx || 0;
        c.y = folder.parent.y + dy || 0;
        if (c.children) resetChildrenPosition({ x: c.x + dx, y: c.y + dy, parent: { x: c.x, y: c.y } }, c.children);
    }
}

/**
 * Unfold the folder by specified amount of nodes.
 * @param folderNode - Node representing a folder
 * @param node - Node to unfold
 * @param [children=20] - Number of nodes to unfold
 * @returns {number} - Number of nodes left to unfold
 */
function unfold(folderNode, node) {
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

    if (folderNode.type !== "folder" || !node._children || !node._children.length) return 0;
    var newId = additionalNodeId--,
        oldId = folderNode.id,
        f = function f() {
        var next = node._children.slice(0, children);
        node._children = node._children.slice(children);
        var left = node._children.length;
        folderNode.id = newId;
        node.children = node.children.concat(next);
        folderNode.label = left > 0 ? left + " more" : "Others";
        resetChildrenPosition(folderNode, next);
        dataUpdated();
        return {
            unfolded: next.length,
            left: left
        };
    },
        res = f();
    history.createState({
        redo: f,
        undo: function undo() {
            var part = node.children.slice(-res.unfolded);
            node.children = node.children.slice(0, node.children.length - part.length);
            node._children = part.concat(node._children);
            folderNode.id = oldId;
            folderNode.label = node._children.length > 0 ? node._children.length + " more" : "Others";
            dataUpdated();
        }
    });
    return res.left;
}

/**
 * Delete all node's descendants.
 * @param {Array|*} nodes - Node to unfold
 * @returns {number} - Number of nodes unlinked
 */
function dropDescendants(nodes) {

    if (!(nodes instanceof Array)) nodes = [nodes];

    var toDrop = 0;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var node = _step4.value;

            toDrop += node.children ? node.children.length : 0;
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    if (toDrop === 0) return 0;

    var restore = nodes.slice().map(function (node) {
        return {
            node: node,
            children: node.children
        };
    });

    function f() {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = nodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var node = _step5.value;

                node.children = [];
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        dataUpdated();
    }
    f();

    history.createState({
        redo: f,
        undo: function undo() {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = restore[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var res = _step6.value;

                    res.node.children = res.children;
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            dataUpdated();
        }
    });

    return toDrop;
}

/**
 * Delete all nodes and their descendants.
 * @param {Array|*} nodes - Node to delete
 * @returns {number} - Number of nodes deleted
 */
function dropNodes(nodes) {

    if (!(nodes instanceof Array)) nodes = [nodes];

    var restore = nodes.filter(function (n) {
        return !!n.parent;
    }).map(function (node) {
        return {
            node: node.parent,
            children: node.parent.children.slice()
        };
    });

    if (restore.length === 0) return 0;

    function f() {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = nodes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var node = _step7.value;

                if (!node.parent) // unable to drop root node
                    continue;
                var i = node.parent.children.indexOf(node);
                if (i === -1) {
                    console.error("There is a mess occurred with the tree model structure while dropping nodes: " + "node's parent is pointing to a node which doesn't have this node as a child.");
                    continue;
                }
                var temp = node.parent.children.slice();
                temp.splice(i, 1);
                node.parent.children = temp;
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }

        dataUpdated();
    }
    f();

    history.createState({
        redo: f,
        undo: function undo() {
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = restore[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var res = _step8.value;

                    res.node.children = res.children;
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            dataUpdated();
        }
    });

    return nodes.length;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.applyChanges = applyChanges;
exports.getChanges = getChanges;
exports.getOption = getOption;
exports.setOption = setOption;
exports.applyFixedClasses = applyFixedClasses;
exports.setInputValue = setInputValue;
exports.init = init;

var _storage = __webpack_require__(5);

var storage = _interopRequireWildcard(_storage);

var _utils = __webpack_require__(2);

var _url = __webpack_require__(15);

var url = _interopRequireWildcard(_url);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var STORAGE_KEY = "settings";

var settingsTypes = {
    compact: Boolean,
    host: String,
    port: Number,
    webAppName: String,
    domain: String,
    queryType: new Set(["similar", "related"]),
    seed: String,
    keepQueryTypeInView: Boolean,
    keepSeedInView: Boolean,
    tabularShowHiddenNodes: Boolean
};

// List of settings that cannot be saved to local storage, but can be set explicitly
// (f.e. URL params).
var unsaveableSettings = new Set([]);

// defaults are assigned here
var settings = {
    compact: false,
    host: "",
    port: +location.port || 57772,
    webAppName: "EntityBrowser",
    domain: "1",
    queryType: "related",
    seed: "crew",
    keepQueryTypeInView: true,
    keepSeedInView: false,
    tabularShowHiddenNodes: false,
    tabularColumns: [{
        label: "ID",
        property: ["id"]
    }, {
        label: "Type",
        property: ["edgeType"],
        class: true
    }, {
        label: "Label",
        property: ["label"]
    }, {
        label: "Score",
        property: ["entities", 0, "score"]
    }, {
        label: "Spread",
        property: ["entities", 0, "spread"]
    }, {
        label: "Frequency",
        property: ["entities", 0, "frequency"]
    }, {
        label: "Parent",
        property: ["parent", "label"],
        default: "root"
    }]
};
var changes = [];

var initialStorage = storage.load(STORAGE_KEY);
for (var option in initialStorage) {
    settings[option] = initialStorage[option];
}

/**
 * This function "applies" settings so that getChanges() will return empty array until
 */
function applyChanges() {
    changes = [];
}

/**
 * @returns {string[]} of changed keys.
 */
function getChanges() {
    return changes;
}

function getOption(opt) {
    return settings[opt];
}

function setOption(options, value) {
    var opts = settings,
        opt = options;
    if (options instanceof Array) {
        opts = (0, _utils.getObjProp)(settings, options.slice(0, -1));
        opt = options[options.length - 1];
    }
    opts[opt] = value;
    changes.push([options, value]);
    saveSettings();
}

var preservedToolbarElement = null,
    querySettingElement = null,
    seedSettingElement = null,
    uiState = null,
    lastApply = "";
function applyFixedClasses() {
    var qt = !uiState.settingsToggled && settings["keepQueryTypeInView"],
        s = !uiState.settingsToggled && settings["keepSeedInView"],
        queryParent = qt ? preservedToolbarElement : querySettingElement,
        seedParent = s ? preservedToolbarElement : seedSettingElement;
    if (qt + "|" + s === lastApply) return;
    lastApply = qt + "|" + s;
    queryParent.appendChild(document.getElementById("settings.queryType"));
    seedParent.appendChild(document.getElementById("settings.seed"));
}

function saveSettings() {
    applyFixedClasses();
    var sts = Object.assign({}, settings);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = unsaveableSettings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            delete sts[s];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    storage.save(STORAGE_KEY, sts);
}

function setInputValue() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var isEvent = !(e instanceof HTMLElement),
        id = void 0,
        el = isEvent ? e.target || e.srcElement : e;
    if (!el) return e;
    if ((id = el.getAttribute("id")).indexOf("settings.") === 0) {
        var key = id.replace(/^settings\./, ""),
            prop = el.getAttribute("type") === "checkbox" ? "checked" : "value";
        if (isEvent) {
            settings[key] = el[prop];
            changes.push([key, el[prop]]);
            saveSettings();
        } else {
            el[prop] = settings[key];
        }
    }
    return e;
}

function init(uiSt) {
    var params = url.getSearchString();
    for (var param in params) {
        var type = (0, _utils.getObjProp)(settingsTypes, param.split(".")),
            v = params[param];
        if (typeof type === "undefined") continue;
        settings[param] = type === String ? v : type === Number ? parseFloat(v) : type === Boolean ? v === "false" ? false : v === "" ? true : !!v : type instanceof Set ? type.has(v) ? v : settings[param] : settings[param];
    }
    uiState = uiSt;
    preservedToolbarElement = document.getElementById("preservedToolbar");
    querySettingElement = document.getElementById("querySetting");
    seedSettingElement = document.getElementById("seedSetting");
    applyFixedClasses();
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.block = block;
exports.makeAutosizable = makeAutosizable;
exports.httpGet = httpGet;
exports.toggleLoader = toggleLoader;
exports.getObjProp = getObjProp;
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
function block() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "div";
    var className = arguments[1];
    var textContent = arguments[2];
    var children = arguments[3];


    var el = document.createElement(element || "div"),
        c = children || [];

    if (className instanceof Array) {
        c = className;
    } else if (typeof className === "string") {
        el.className = className;
    } else if ((typeof className === "undefined" ? "undefined" : _typeof(className)) === "object") {
        if (className.style) el.setAttribute("style", className.style);
        if (className.class) el.className = className.class;
        if (className.textContent) el.textContent = className.textContent;
        if (typeof className["onClick"] === "function") el.addEventListener("click", className["onClick"]);
    }

    if (textContent instanceof Array) {
        c = textContent;
    } else if (typeof textContent === "string") el.textContent = textContent;

    c.forEach(function (a) {
        if (a) el.appendChild(a);
    });

    return el;
}

var loader = block("div", {
    class: "central loading",
    style: "position:fixed"
}, [block("div", [block("div", [block("div", "loader", [block("div", "inner one"), block("div", "inner two"), block("div", "inner three")])])])]);

/**
 * Make input auto-sizable.
 * @param {HTMLInputElement} input
 * @param {number=30} minWidth
 */
function makeAutosizable(input) {
    var minWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;

    function updateInput() {
        var style = window.getComputedStyle(input),
            ghost = document.createElement("span");
        ghost.style.cssText = "box-sizing:content-box;display:inline-block;height:0;" + "overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:nowrap;" + ("font-family:" + style.fontFamily + ";font-size:" + style.fontSize + ";") + ("padding:" + style.padding);
        ghost.textContent = input.value;
        document.body.appendChild(ghost);
        input.style.width = ghost.offsetWidth + 4 + (input.getAttribute("type") === "number" ? 20 : 0) + "px";
        document.body.removeChild(ghost);
    }
    input.style.minWidth = minWidth + "px";
    input.style.maxWidth = "90%";
    input.addEventListener("input", function () {
        return updateInput();
    });
    updateInput();
}

/**
 * @param {string} theUrl
 * @param {function} callback
 */
function httpGet(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            var data = void 0;
            if (xmlHttp.status !== 200) {
                callback({ error: "Request to " + theUrl + " returned status " + xmlHttp.status });
                return;
            }
            try {
                data = JSON.parse(xmlHttp.responseText);
            } catch (e) {
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
function toggleLoader() {
    var on = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

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
function getObjProp(obj, props) {
    var o = obj,
        nil = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            o = typeof o[p] === "undefined" ? nil : o[p];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return o === nil ? undefined : o;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.translateBy = translateBy;
exports.focusOn = focusOn;
exports.scaleBy = scaleBy;
exports.resetZoom = resetZoom;
exports.updateSelected = updateSelected;
exports.init = init;
exports.update = update;

var _model = __webpack_require__(0);

var _selection = __webpack_require__(4);

var shiftKey = void 0,
    ctrlKey = void 0,
    width = window.innerWidth,
    height = window.innerHeight,
    lastGraph = null;

var currentZoomLevel = 1,
    svg = null,
    brush = null,
    node = void 0,
    link = void 0,
    links = void 0,
    nodes = void 0,
    zoomer = d3.zoom().scaleExtent([1 / 6, 100]).on("zoom", function () {
    currentZoomLevel = d3.event.transform.k;
    view.attr("transform", d3.event.transform);
}),
    dragger = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended),
    simulation = newSimulation(),
    brusher = d3.brush().extent([[-9999999, -9999999], [9999999, 9999999]]).on("start.brush", function () {
    if (!d3.event.sourceEvent) return;
    node.each(function (d) {
        d.wasSelected = ctrlKey && d.selected;
    });
}).on("brush.brush", function () {
    if (!d3.event.sourceEvent) return;
    var extent = d3.event.selection;
    if (!extent) return;
    node.classed("selected", function (d) {
        var selected = extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1];
        return d.selected = d.wasSelected ^ selected;
    });
}).on("end.brush", function () {
    if (!d3.event.sourceEvent) return;
    setTimeout(function () {
        brush.call(brusher.move, null);
        (0, _selection.updateSelection)();
    }, 25);
}),
    view = null;

window.addEventListener("resize", function () {
    width = window.innerWidth;
    height = window.innerHeight;
});

function translateBy() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    svg.transition().duration(300).call(zoomer.translateBy, x / currentZoomLevel, y / currentZoomLevel);
}

function focusOn() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    svg.transition().duration(300).call(zoomer.transform, d3.zoomIdentity.translate(width / 2 + getViewDX(), height / 2).scale(currentZoomLevel).translate(-x, -y));
}

function scaleBy() {
    var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    svg.transition().duration(300).call(zoomer.scaleBy, delta);
}

function getViewDX() {
    return _model.uiState.tabularToggled ? -document.getElementById("table").getBoundingClientRect().width / 2 : 0;
}

function resetZoom() {
    svg.transition().duration(300).call(zoomer.transform, d3.zoomIdentity.translate(getViewDX(), 0));
}

function updateSelected() {
    node.classed("selected", function (p) {
        return p.selected;
    });
}

function newSimulation() {
    return d3.forceSimulation().force("link", d3.forceLink().distance(function (d) {
        return 30 + (d.source.radius + d.target.radius) * 2;
    }).strength(function (d) {
        return 1;
    }).id(function (d) {
        return d.id;
    })).force("charge", d3.forceManyBody().strength(function (d) {
        return -7 * d.radius;
    })).force("center", d3.forceCenter(width / 2, height / 2)).on("tick", ticked);
}

var ARROW_FWD = 2;

function ticked() {
    if (!link) return;
    link.attr("x1", function (d) {
        d.dir = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
        return d.source.x + Math.cos(d.dir) * d.source.radius;
    }).attr("y1", function (d) {
        return d.source.y + Math.sin(d.dir) * d.source.radius;
    }).attr("x2", function (d) {
        return d.target.x - Math.cos(d.dir) * (d.target.radius + ARROW_FWD);
    }).attr("y2", function (d) {
        return d.target.y - Math.sin(d.dir) * (d.target.radius + ARROW_FWD);
    });
    node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function keyDown() {
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
    ctrlKey = d3.event.ctrlKey;

    if (d3.event.keyCode == 67) {// the 'c' key
        // do stuff
    }

    if (ctrlKey) {
        brush.select('.overlay').style('cursor', 'crosshair');
        brush.call(brusher);
        d3.event.preventDefault();
    }
}

function keyUp() {
    shiftKey = d3.event.shiftKey || d3.event.metaKey;
    ctrlKey = d3.event.ctrlKey;

    brush.call(brusher).on(".brush", null);

    brush.select('.overlay').style('cursor', 'auto');
}

function init() {
    svg = d3.select("#graph").call(zoomer);
    view = svg.append("g").attr("class", "view");
    brush = view.append("g").datum(function () {
        return { selected: false, wasSelected: false };
    }).attr("class", "brush");
    links = view.append("g").attr("class", "links");
    nodes = view.append("g").attr("class", "nodes");
    link = links.selectAll("line");
    node = nodes.selectAll(".node");
    d3.select(window).on("keydown", keyDown).on("keyup", keyUp);
}

function flatten(root) {

    var nodes = [];

    function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        // if (!node.id) node.id = ++i;
        nodes.push(node);
    }

    recurse(root);

    return nodes;
}

function flattenEdges(root) {

    var edges = [];

    function recurse(node) {
        if (!node.children) return;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = node.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var c = _step.value;

                recurse(c);
                edges.push({ source: node, target: c, type: c.edgeType });
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    recurse(root);

    return edges;
}

(0, _model.onModelUpdate)(function (graph, force) {
    return update(graph, force);
});

function update() {
    var g = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : lastGraph;
    var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    if (!reset) {
        // g = JSON.parse(JSON.stringify(g));
        // g.id = -100;
    }

    var fl = flatten(g);

    var graph = {
        nodes: fl,
        edges: flattenEdges(g)
    };

    lastGraph = g;

    if (reset) {
        link = link.data([]);
        link.exit().remove();
        node = node.data([]);
        node.exit().remove();
    }

    link = links.selectAll("line").data(graph.edges, function (d) {
        return d.target.id;
    });
    link.exit().remove();
    var linkEnter = link.enter().append("line").attr("class", function (d) {
        return d.type === "similar" ? "similar" : d.type === "related" ? "related" : "other";
    }).attr("marker-end", function (d) {
        return "url(#svgLineArrow-" + d.type + ")";
    });
    link = linkEnter.merge(link);

    node = nodes.selectAll(".node").data(graph.nodes, function (d) {
        return this._id || d.id;
    });
    node.exit().remove();
    var nodeEnter = node.enter().append("g").each(function (d) {
        this._id = d.id;d.element = this;
    }).attr("class", function (d) {
        return "node" + (d.id === 0 ? " root" : "") + " " + (d.type || "unknown");
    }).classed("selected", function (p) {
        return p.selected;
    }).call(dragger).on("click", function (d) {
        if (d.type === "folder") {
            d3.event.stopPropagation();
            var left = void 0;
            if (d.parent && (left = (0, _model.unfold)(d, d.parent))) {
                d.fx = d.x;d.fy = d.y;
                if (d._clickTimeout) clearTimeout(d._clickTimeout);
                d._clickTimeout = setTimeout(function () {
                    d.fx = d.fy = null;
                    d._clickTimeout = 0;
                }, 1000);
            }
            if (left === 0) {
                (0, _model.dropNodes)(d);
            }
            return;
        }
        if (d3.event.defaultPrevented) return;
        if (shiftKey) {
            if (d.selected) (0, _selection.deselectAll)(d);else (0, _selection.selectAll)(d);
        } else {
            d3.select(this).classed("selected", d.selected = !d.selected); // (!prevSel)
        }
        (0, _selection.updateSelection)();
    });

    nodeEnter.append("circle").attr("r", function (d) {
        return d.radius;
    });

    nodeEnter.append("text").attr("dy", ".3em").attr("style", function (d) {
        return "font-size:" + Math.round(d.radius / 2) + "px";
    }).text(function (d) {
        return d.label;
    });

    nodeEnter.each(function (d) {
        if (d.type !== "folder") return;
        d3.select(this).append("text").classed("tooltip", function () {
            return true;
        }).attr("dy", "-0.7em").attr("style", function (d) {
            return "font-size:" + Math.round(d.radius / 2) + "px";
        }).text(function (d) {
            return "Click to display more";
        });
    });
    node = nodeEnter.merge(node);

    if (reset) simulation = newSimulation();

    simulation.nodes(graph.nodes).force("link").links(graph.edges);

    simulation.alpha(reset ? 1 : 0.4).restart();

    brush.call(brusher).on(".brush", null);

    brush.select('.overlay').style('cursor', 'auto');

    if (reset) {
        for (var i = 100; i > 0; --i) {
            simulation.tick();
        }(0, _selection.updateSelection)();
        resetZoom();
    }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateSelection = updateSelection;
exports.getSelection = getSelection;
exports.getOthers = getOthers;
exports.getHidden = getHidden;
exports.selectAll = selectAll;
exports.deselectAll = deselectAll;
exports.onSelectionUpdate = onSelectionUpdate;
exports.init = init;

var _model = __webpack_require__(0);

var model = _interopRequireWildcard(_model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var selection = [],
    others = [],
    hidden = [],
    callbacks = [];

function updateSelection() {

    var tree = model.getGraphData();
    selection = [];
    others = [];
    hidden = [];

    function findHidden(node) {
        if (node.selected) hidden.push(node);else hidden.push(node);
        if (node.children) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = node.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _n = _step.value;
                    findHidden(_n);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }if (node._children) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = node._children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _n2 = _step2.value;
                    findHidden(_n2);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }

    function findSelected(node) {
        if (node.selected) selection.push(node);else others.push(node);
        if (node.children) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = node.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _n3 = _step3.value;
                    findSelected(_n3);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }if (node._children) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = node._children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _n4 = _step4.value;
                    findHidden(_n4);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }

    findSelected(tree);

    callbacks.forEach(function (c) {
        return c(selection);
    });
}

function getSelection() {
    return selection;
}

function getOthers() {
    return others;
}

function getHidden() {
    return hidden;
}

function selectAll(node) {
    var nodeItself = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (!node) return;
    if (node.children) node.children.forEach(function (c) {
        return selectAll(c);
    });
    if (nodeItself) d3.select(node.element).classed("selected", node.selected = true);
}

function deselectAll(node) {
    var nodeItself = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (!node) return;
    if (node.children) node.children.forEach(function (c) {
        return deselectAll(c);
    });
    if (nodeItself) d3.select(node.element).classed("selected", node.selected = false);
}

/**
 * The callback is invoked when selection changes.
 * @param {selectionCallback} callback
 */
function onSelectionUpdate(callback) {

    callbacks.push(callback);
}

function init() {
    model.onModelUpdate(function () {
        return updateSelection();
    });
}

/**
 * This callback is invoked when selection changes.
 * @callback selectionCallback
 * @param {*[]} nodes - Currently selected nodes.
 * @param {*} lastNodeSelected - The last node selected by user.
 */

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.save = save;
exports.load = load;
exports.reset = reset;
var STORAGE_NAME = "iKnowEntityBrowser";
var storage = JSON.parse(localStorage.getItem(STORAGE_NAME)) || {};

function save(key, value) {
    storage[key] = value;
    updateLocalStorage();
}

function load(key) {
    return storage[key];
}

function reset() {
    localStorage.removeItem(STORAGE_NAME);
}

function updateLocalStorage() {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

var _selection = __webpack_require__(4);

var _model = __webpack_require__(0);

var _graph = __webpack_require__(3);

var dropChildrenButton = null,
    removeButton = null,
    resetSelectionButton = null,
    zoomInButton = null,
    resetViewButton = null,
    zoomOutButton = null,
    selection = []; /**
                     * This file describes on-screen controls like UI link/remove buttons, etc.
                     */


(0, _selection.onSelectionUpdate)(function (sel) {
    selection = sel;
    updateButtons();
});

function updateButtons() {
    var toDrop = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = selection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var node = _step.value;

            toDrop += node.children ? node.children.length : 0;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    removeButton.classList[selection.length > 0 ? "remove" : "add"]("disabled");
    dropChildrenButton.classList[toDrop > 0 ? "remove" : "add"]("disabled");
    resetSelectionButton.classList[selection.length > 0 ? "remove" : "add"]("icon-outline");
    resetSelectionButton.classList[selection.length == 0 ? "remove" : "add"]("icon-filled");
    resetSelectionButton.classList[selection.length > 0 ? "remove" : "add"]("disabled");
}

function resetSelection() {
    selection.forEach(function (n) {
        return n.selected = n.wasSelected = false;
    });
    (0, _selection.updateSelection)();
    (0, _graph.updateSelected)();
}

function deleteSelection() {
    if (!selection.length) return;
    (0, _model.dropNodes)(selection);
    // updateSelection();
}

function dropChildren() {
    if (!selection.length) return;
    (0, _model.dropDescendants)(selection);
    // updateSelection();
}

function init() {
    dropChildrenButton = document.getElementById("dropChildrenButton");
    dropChildrenButton.addEventListener("click", dropChildren);
    removeButton = document.getElementById("removeButton");
    removeButton.addEventListener("click", deleteSelection);
    resetSelectionButton = document.getElementById("resetSelectionButton");
    resetSelectionButton.addEventListener("click", resetSelection);
    zoomInButton = document.getElementById("zoomInButton");
    zoomInButton.addEventListener("click", function () {
        return (0, _graph.scaleBy)(1.5);
    });
    resetViewButton = document.getElementById("resetZoomButton");
    resetViewButton.addEventListener("click", function () {
        return (0, _graph.resetZoom)();
    });
    zoomOutButton = document.getElementById("zoomOutButton");
    zoomOutButton.addEventListener("click", function () {
        return (0, _graph.scaleBy)(0.75);
    });
    updateButtons();
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

var _model = __webpack_require__(0);

var model = _interopRequireWildcard(_model);

var _graph = __webpack_require__(3);

var graph = _interopRequireWildcard(_graph);

var _sourceSettings = __webpack_require__(11);

var sourceSettings = _interopRequireWildcard(_sourceSettings);

var _tabularViewSettings = __webpack_require__(12);

var tabularViewSettings = _interopRequireWildcard(_tabularViewSettings);

var _storage = __webpack_require__(5);

var storage = _interopRequireWildcard(_storage);

var _values = __webpack_require__(1);

var _utils = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function toggleSettings(uiStateModel) {
    uiStateModel.settingsToggled = !uiStateModel.settingsToggled;
    d3.select("#settings").classed("active", uiStateModel.settingsToggled);
    d3.select("#windows").classed("offScreen", uiStateModel.settingsToggled);
    (0, _values.applyFixedClasses)();
    if (!uiStateModel.settingsToggled && (0, _values.getChanges)().length !== 0) {
        (0, _values.applyChanges)();
        model.update(function () {
            return graph.update(true);
        });
    }
}

function init() {

    d3.select("#settingsToggle").data([model.uiState]).on("click", toggleSettings);

    d3.select("#closeSettingsToggle").data([model.uiState]).on("click", toggleSettings);

    tabularViewSettings.init();
    (0, _values.init)(model.uiState);
    sourceSettings.init();

    // make inputs auto-sizable
    [].slice.call(document.querySelectorAll("input[autosize]")).forEach(function (i) {
        return (0, _utils.makeAutosizable)(i);
    });
    document.getElementById("settings.resetSettings").addEventListener("click", function () {
        if (!confirm("Do you want to set all the settings to defaults?")) return;
        storage.reset();
        location.reload();
    });

    document.getElementById("expandViewButton").addEventListener("click", function () {
        (0, _values.setOption)("compact", false);
        updateCompactView();
    });
    document.getElementById("collapseCompactViewButton").addEventListener("click", function () {
        (0, _values.setOption)("compact", true);
        console.log((0, _values.getOption)("compact"));
        updateCompactView();
    });
    updateCompactView();
}

function updateCompactView() {

    var compact = !!(0, _values.getOption)("compact");

    function toggle(element) {
        var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        element.classList.toggle("hidden", !flag);
    }

    toggle(document.getElementById("rightTopIcons"), !compact);
    toggle(document.getElementById("rightTopExpandButton"), compact);
    toggle(document.getElementById("toolbarIcons"), !compact);
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

var _export = __webpack_require__(14);

var _model = __webpack_require__(0);

var model = _interopRequireWildcard(_model);

var _selection = __webpack_require__(4);

var _values = __webpack_require__(1);

var _utils = __webpack_require__(2);

var _graph = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var sorting = {
    properties: ["entities", "0", "frequency"],
    order: -1
};

var sorter = function sorter(a, b) {
    var i = 0;
    while (i < sorting.properties.length && typeof (a = a[sorting.properties[i]]) !== "undefined" && typeof (b = b[sorting.properties[i]]) !== "undefined") {
        ++i;
    }
    return a > b ? sorting.order : a === b ? 0 : -sorting.order;
};

/**
 * this: node
 */
function switchSelected() {
    if (!this.element) return;
    this.element.classList.remove("highlighted");
    d3.select(this.element).classed("selected", this.selected = !this.selected);
    (0, _selection.updateSelection)();
}

/**
 * this: node
 */
function toggleChildrenSelected(e) {
    var nodeItself = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var sel = false,
        el = e.target || e.srcElement;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var o = _step.value;
            if (o.selected) {
                sel = true;break;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (sel) (0, _selection.deselectAll)(this, nodeItself);else (0, _selection.selectAll)(this, nodeItself);
    el.className = "icon-" + (!sel ? "filled" : "outline");
    this.element.classList.remove("highlighted");
    (0, _selection.updateSelection)();
}

function getFolded(initialNode) {
    var node = initialNode;
    do {
        if (!node.parent) return initialNode;
        if (node.parent.children.indexOf(node) === -1) return node.parent;
    } while (node = node.parent);
    return initialNode;
}

function insertRows(data, table, selected) {
    var columns = (0, _values.getOption)("tabularColumns");

    var _loop = function _loop(i) {
        var row = table.insertRow(i),
            node = data[i];
        for (var col = 0; col < columns.length; col++) {
            var _cell = row.insertCell(col),
                cVal = (0, _utils.getObjProp)(node, columns[col].property),
                val = typeof cVal === "undefined" ? columns[col].default || "" : cVal;
            _cell.textContent = val;
            if (columns[col].class) _cell.className = val;
        }
        var cell = row.insertCell(columns.length);
        var ee = document.createElement("i"),
            ei = document.createElement("i"),
            sel = false;
        if (selected !== null) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = node.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var o = _step2.value;

                    if (o.selected) {
                        sel = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            ei.className = "icon-" + (sel ? "filled" : "outline");
            ei.setAttribute("title", (sel ? "Deselect" : "Select") + " node and children");
            ei.addEventListener("click", toggleChildrenSelected.bind(node));
            ee.className = "icon-" + (selected ? "close" : "add");
            ee.setAttribute("title", (selected ? "Remove from" : "Add to") + " selection");
            ee.addEventListener("click", switchSelected.bind(node));
            cell.appendChild(ee);
            if (node.children.length) cell.appendChild(ei);
            row.addEventListener("mouseover", function () {
                return node.element.classList.add("highlighted");
            });
            row.addEventListener("mouseout", function () {
                return node.element.classList.remove("highlighted");
            });
        }
        row.addEventListener("click", function () {
            var n = getFolded(node);
            (0, _graph.focusOn)(n.x, n.y);
        });
    };

    for (var i = 0; i < data.length; i++) {
        _loop(i);
    }
}

function updateSelected() {
    var data = (0, _selection.getSelection)().filter(function (node) {
        return node.type === "entity";
    }).sort(sorter),
        table = document.querySelector("#tabular-selected");
    table.textContent = "";
    insertRows(data, table, true);
}

function updateOthers() {
    var data = (0, _selection.getOthers)().filter(function (node) {
        return node.type === "entity";
    }).sort(sorter),
        table = document.querySelector("#tabular-others");
    table.textContent = "";
    insertRows(data, table, false);
}

function updateHidden() {
    var data = (0, _selection.getHidden)().filter(function (node) {
        return node.type === "entity";
    }).sort(sorter),
        table = document.querySelector("#tabular-hidden");
    table.textContent = "";
    if ((0, _values.getOption)("tabularShowHiddenNodes")) insertRows(data, table, null);
}

function updateAll() {
    updateHeaders();
    updateSelected();
    updateOthers();
    updateHidden();
}

(0, _selection.onSelectionUpdate)(function () {
    if (!model.uiState.tabularToggled) return;
    updateAll();
});

/**
 * @this {HTMLElement} TH
 */
function columnClicked() {
    var attr = this.getAttribute("data-prop"),
        arr = attr.split(".");
    if (attr === sorting.properties.join(".")) sorting.order = sorting.order === -1 ? 1 : sorting.order === 1 ? 0 : -1;else sorting.order = -1;
    sorting.properties = arr;
    updateHeaders(attr);
    updateAll();
}

function updateHeaders() {
    var dataProp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : sorting.properties.join(".");

    var head = document.querySelector("#tabular thead tr");
    while (head.firstChild) {
        head.removeChild(head.firstChild);
    }(0, _values.getOption)("tabularColumns").forEach(function (h) {
        var el = document.createElement("th");
        el.textContent = h.label;
        el.setAttribute("data-prop", h.property.join("."));
        el.addEventListener("click", columnClicked);
        if (h.property.join(".") === dataProp) el.classList.toggle("sort-" + (sorting.order === 1 ? "up" : "down"), sorting.order !== 0);
        head.appendChild(el);
    });
    head.appendChild(document.createElement("th"));
}

function updateToolbarsWidth() {
    document.getElementById("preservedToolbar").style.width = document.getElementById("toolbarIcons").style.width = document.body.getBoundingClientRect().width - (model.uiState.tabularToggled ? document.getElementById("table").getBoundingClientRect().width : 0) + "px";
}

function init() {

    window.addEventListener("resize", updateToolbarsWidth);
    updateToolbarsWidth();

    d3.select("#tableToggle").data([model.uiState]).on("click", function (d) {
        d.tabularToggled = !d.tabularToggled;
        d3.select(this).classed("toggled", d.tabularToggled);
        d3.select("#table").classed("active", d.tabularToggled);
        if (d.tabularToggled) updateAll();
        updateToolbarsWidth();
        var w = document.getElementById("table").getBoundingClientRect().width / 2;
        (0, _graph.translateBy)(d.tabularToggled ? -w : w);
    });

    d3.select("#exportCSV").on("click", function () {
        (0, _export.csv)([].slice.call(document.querySelector("#table table").rows).map(function (row) {
            return [].slice.call(row.cells).map(function (cell) {
                return cell.textContent;
            });
        }));
    });

    updateHeaders();
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _graph = __webpack_require__(3);

var graph = _interopRequireWildcard(_graph);

var _tabular = __webpack_require__(8);

var tabular = _interopRequireWildcard(_tabular);

var _settings = __webpack_require__(7);

var settings = _interopRequireWildcard(_settings);

var _model = __webpack_require__(0);

var model = _interopRequireWildcard(_model);

var _controls = __webpack_require__(6);

var controls = _interopRequireWildcard(_controls);

var _selection = __webpack_require__(4);

var selection = _interopRequireWildcard(_selection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.init = function () {

    tabular.init();
    settings.init();
    graph.init();
    controls.init();
    model.init();
    selection.init();
    model.update(function () {
        return graph.update(true);
    });
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createState = createState;
exports.undo = undo;
exports.redo = redo;
exports.reset = reset;
exports.init = init;
var history = [],
    redoHistory = [],
    undoButton = null,
    redoButton = null;

function createState() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        undo = _ref.undo,
        redo = _ref.redo;

    if (typeof undo !== "function" || typeof redo !== "function") throw new Error("Undo and Redo must be both functions");
    redoHistory = [];
    history.push({ undo: undo, redo: redo });
    updateButtons();
}

function undo() {
    var undoed = history.pop();
    if (!undoed) return;
    redoHistory.push(undoed);
    undoed.undo();
}

function redo() {
    var redoed = redoHistory.pop();
    if (!redoed) return;
    history.push(redoed);
    redoed.redo();
}

function reset() {
    history = [];
    redoHistory = [];
    updateButtons();
}

function updateButtons() {
    undoButton.classList[history.length ? "remove" : "add"]("disabled");
    redoButton.classList[redoHistory.length ? "remove" : "add"]("disabled");
}

function init() {
    undoButton = document.getElementById("undoButton");
    redoButton = document.getElementById("redoButton");
    undoButton.addEventListener("click", function () {
        undo();updateButtons();
    });
    redoButton.addEventListener("click", function () {
        redo();updateButtons();
    });
    updateButtons();
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

var _values = __webpack_require__(1);

var _model = __webpack_require__(0);

var model = _interopRequireWildcard(_model);

var _graph = __webpack_require__(3);

var graph = _interopRequireWildcard(_graph);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function bind(elements) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var e = _step.value;

            var el = document.getElementById(e);
            (0, _values.setInputValue)(el);
            if (el.getAttribute("type") === "text") el.addEventListener("input", _values.setInputValue);else el.addEventListener("change", _values.setInputValue);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

function init() {

    bind(["settings.host", "settings.port", "settings.domain", "settings.queryType", "settings.seed", "settings.webAppName", "settings.keepQueryTypeInView", "settings.keepSeedInView", "settings.tabularShowHiddenNodes"]);

    function apply() {
        if ((0, _values.getChanges)().length !== 0) {
            (0, _values.applyChanges)();
            model.update(function () {
                return graph.update(true);
            });
        }
    }

    document.getElementById("settings.queryType").addEventListener("change", function () {
        if (!(0, _values.getOption)("keepQueryTypeInView") || model.uiState.settingsToggled) return;
        apply();
    });

    document.getElementById("settings.seed").addEventListener("blur", function () {
        if (!(0, _values.getOption)("keepSeedInView") || model.uiState.settingsToggled) return;
        apply();
    });
    document.getElementById("settings.seed").addEventListener("keydown", function (e) {
        if (e.keyCode !== 13) return;
        document.getElementById("settings.seed").blur();
    });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

var _values = __webpack_require__(1);

var _utils = __webpack_require__(2);

var element = null;

var properties = [["id"], ["edgeType"], ["label"], ["entities", 0, "score"], ["entities", 0, "spread"], ["entities", 0, "frequency"], ["parent", "label"], ["parent", "id"]];

function init() {
    element = document.getElementById("settings.tabularColumns");
    updateColumnSettings();
}

function moveColumn(opts, index) {
    var inc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    if (index + inc < 0 || index + inc >= opts.length) return;
    var opt = opts.splice(index, 1)[0];
    opts.splice(index + inc, 0, opt);
    (0, _values.setOption)("tabularColumns", opts);
    updateColumnSettings();
}

function updateColumnSettings() {
    var cols = (0, _values.getOption)("tabularColumns");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }cols.forEach(function (column, index) {
        var el = document.createElement("span"),
            inp = document.createElement("input"),
            propSelect = document.createElement("select"),
            close = document.createElement("i"),
            left = document.createElement("i"),
            right = document.createElement("i"),
            text = document.createTextNode(":");
        left.className = "icon-arrow-left";
        left.addEventListener("click", function () {
            return moveColumn(cols.slice(), index, -1);
        });
        right.className = "icon-arrow-right";
        right.addEventListener("click", function () {
            return moveColumn(cols.slice(), index, 1);
        });
        close.className = "icon-close";
        close.addEventListener("click", function () {
            var opts = cols.slice();
            opts.splice(index, 1);
            (0, _values.setOption)("tabularColumns", opts);
            updateColumnSettings();
        });
        inp.setAttribute("type", "text");
        inp.value = column.label || "";
        (0, _utils.makeAutosizable)(inp);
        inp.addEventListener("change", function () {
            (0, _values.setOption)(["tabularColumns", index, "label"], inp.value);
        });
        propSelect.setAttribute("title", "Node Property");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var p = _step.value;

                var opt = document.createElement("option"),
                    val = p.join(".");
                opt.setAttribute("value", opt.textContent = val);
                if (column.property.join(".") === val) opt.selected = true;
                propSelect.appendChild(opt);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        propSelect.addEventListener("change", function () {
            (0, _values.setOption)(["tabularColumns", index, "property"], propSelect.options[propSelect.selectedIndex].value.split("."));
        });
        el.className = "column";
        el.appendChild(left);
        el.appendChild(inp);
        el.appendChild(text);
        el.appendChild(propSelect);
        el.appendChild(close);
        el.appendChild(right);
        element.appendChild(el);
    });
    var add = document.createElement("span"),
        icon = document.createElement("i");
    add.className = "column";
    add.style.paddingLeft = "4px";
    add.style.paddingRight = "5px";
    icon.className = "icon-add";
    add.addEventListener("click", function () {
        (0, _values.setOption)("tabularColumns", cols.concat({
            label: "ID",
            property: ["id"]
        }));
        updateColumnSettings();
    });
    add.appendChild(icon);
    element.appendChild(add);
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getData = getData;

var _utils = __webpack_require__(2);

var _values = __webpack_require__(1);

function getData(callback) {
    var https = ((0, _values.getOption)("host") || location.href).indexOf("https:") === 0,
        port = (0, _values.getOption)("port") || +location.port || 57772;
    (0, _utils.httpGet)("" + ((0, _values.getOption)("host") || "http://" + location.hostname) + (port === (https ? 443 : 80) ? "" : ":" + port) + "/" + ((0, _values.getOption)("webAppName") || "EntityBrowser") + "/api/domain/" + encodeURIComponent((0, _values.getOption)("domain")) + "/" + encodeURIComponent((0, _values.getOption)("queryType")) + "/" + encodeURIComponent((0, _values.getOption)("seed")), callback);
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.csv = csv;
/**
 * @param {*[][]} dataArray - Table to be exported.
 */
function csv() {
    var dataArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


    console.log(dataArray);
    var csvContent = "data:text/csv;charset=utf-8,";

    dataArray.forEach(function (infoArray, index) {

        var dataString = infoArray.join(",");
        csvContent += index < dataArray.length ? dataString + "\n" : dataString;
    });

    var encodedUri = encodeURI(csvContent),
        link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "entityGraph.csv");
    document.body.appendChild(link);
    link.click();

    setTimeout(function () {
        return link.parentNode.removeChild(link);
    }, 10);
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getSearchString = getSearchString;
var getParams = function getParams(query) {
    if (!query) {
        return {};
    }
    return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce(function (params, param) {
        var _param$split = param.split('='),
            _param$split2 = _slicedToArray(_param$split, 2),
            key = _param$split2[0],
            value = _param$split2[1];

        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
    }, {});
};

var params = getParams(location.search);

function getSearchString() {
    return params;
}

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return toaster; });
//! Do not import this module to the application! Import index.js instead.

/**
 * @type {Toaster}
 */
let toaster = new Toaster();

/**
 * Toasts controller. Controls toasts that appear on the screen.
 * @constructor
 * @private
 */
function Toaster () {

    /**
     * @type {Toast[]}
     */
    this.toasts = [];

}

/**
 * @param {Toast} toast
 * @param {number} timeout
 */
Toaster.prototype.push = function (toast, timeout) {

    requestAnimationFrame(() => {
        let height = toast.attach(0),
            self = this;

        this.toasts.forEach((toast) => {
            toast.seek(height);
        });
        this.toasts.push(toast);

        setTimeout(() => {
            self.toasts.splice(0, 1)[0].detach();
        }, timeout);
    });

};

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Toaster_js__ = __webpack_require__(16);
/* harmony export (immutable) */ __webpack_exports__["configureToasts"] = configureToasts;
/* harmony export (immutable) */ __webpack_exports__["Toast"] = Toast;


Toast.TYPE_INFO = "info";
Toast.TYPE_MESSAGE = "message";
Toast.TYPE_WARNING = "warning";
Toast.TYPE_ERROR = "error";
Toast.TYPE_DONE = "done";

Toast.TIME_SHORT = 2000;
Toast.TIME_NORMAL = 4000;
Toast.TIME_LONG = 8000;

let options = {
    topOrigin: 0
};

/**
 * Allows you to configure Toasts options during the application setup.
 * @param newOptions
 */
function configureToasts (newOptions = {}) {
    options = Object.assign(options, newOptions);
}

/**
 * On-screen toast message.
 * @param {string} text - Message text.
 * @param {string} [type] - Toast.TYPE_*
 * @param {number} [timeout] - Toast.TIME_*
 * @constructor
 */
function Toast (text = `No text!`, type = Toast.TYPE_INFO, timeout = Toast.TIME_LONG) {

    let el1 = document.createElement("div"),
        el2 = document.createElement("div");

    el1.className = "toast";
    el2.className = `body ${type}`;
    el1.appendChild(el2);
    el2.innerHTML = `${text}`;
    el1.style.opacity = 0;

    this.element = el1;
    this.position = 0;

    __WEBPACK_IMPORTED_MODULE_0__Toaster_js__["a" /* toaster */].push(this, timeout);

}

/**
 * Attaches toast to GUI and returns the height of the element.
 */
Toast.prototype.attach = function (position) {

    this.position = position;
    this.updateVisualPosition();
    document.body.appendChild(this.element);
    requestAnimationFrame(() => {
        this.element.style.opacity = 1;
    });

    return this.element.offsetHeight;

};

/**
 * Seek the toast message by Y coordinate.
 * @param delta
 */
Toast.prototype.seek = function (delta) {

    this.position += delta;
    this.updateVisualPosition();

};

/**
 * @private
 */
Toast.prototype.updateVisualPosition = function () {

    requestAnimationFrame(() => {
        this.element.style.bottom = -options.topOrigin + this.position + "px"
    });

};

Toast.prototype.detach = function () {

    let self = this;

    if (!this.element.parentNode) return;

    requestAnimationFrame(() => {
        this.element.style.opacity = 0;
    });
    setTimeout(() => {
        requestAnimationFrame(() => {
            self.element.parentNode.removeChild(self.element);
        });
    }, 300);

};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = {
	"graph": {
		"nodes": [
			{
				"id": 0,
				"label": "medicine",
				"type": "entity",
				"entities": [
					{
						"frequency": 317,
						"id": 8378,
						"score": 3626,
						"spread": 214,
						"value": "medicine"
					}
				]
			},
			{
				"id": 1,
				"label": "patient",
				"type": "entity",
				"entities": [
					{
						"frequency": 317,
						"id": 8378,
						"score": 3626,
						"spread": 214,
						"value": "patient"
					}
				]
			},
			{
				"id": 2,
				"label": "patient's family",
				"type": "entity",
				"entities": [
					{
						"frequency": 9,
						"id": 8411,
						"score": 192,
						"spread": 6,
						"value": "patient's family"
					}
				]
			},
			{
				"id": 4,
				"label": "patient's son",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 8446,
						"score": 96,
						"spread": 3,
						"value": "patient's son"
					}
				]
			},
			{
				"id": 5,
				"label": "patient's wife",
				"type": "entity",
				"entities": [
					{
						"frequency": 4,
						"id": 8452,
						"score": 96,
						"spread": 3,
						"value": "patient's wife"
					}
				]
			},
			{
				"id": 6,
				"label": "patient's name",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8430,
						"score": 85,
						"spread": 1,
						"value": "patient's name"
					}
				]
			},
			{
				"id": 7,
				"label": "patient's healthcare proxy",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8416,
						"score": 64,
						"spread": 1,
						"value": "patient's healthcare proxy"
					}
				]
			},
			{
				"id": 9,
				"label": "patient identity",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8384,
						"score": 42,
						"spread": 1,
						"value": "patient identity"
					}
				]
			},
			{
				"id": 10,
				"label": "patient's identity",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 8421,
						"score": 106,
						"spread": 2,
						"value": "patient's identity"
					}
				]
			},
			{
				"id": 11,
				"label": "documenting patient identity",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 3641,
						"score": 42,
						"spread": 1,
						"value": "documenting patient identity"
					}
				]
			},
			{
				"id": 12,
				"label": "patient's cardiac event",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8404,
						"score": 42,
						"spread": 1,
						"value": "patient's cardiac event"
					}
				]
			},
			{
				"id": 13,
				"label": "patient's sister",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8444,
						"score": 42,
						"spread": 1,
						"value": "patient's sister"
					}
				]
			},
			{
				"id": 14,
				"label": "patient's skin",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 8445,
						"score": 36,
						"spread": 2,
						"value": "patient's skin"
					}
				]
			},
			{
				"id": 15,
				"label": "patient's chart",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8405,
						"score": 32,
						"spread": 1,
						"value": "patient's chart"
					}
				]
			},
			{
				"id": 21,
				"label": "present",
				"type": "entity",
				"entities": [
					{
						"frequency": 142,
						"id": 8985,
						"score": 1658,
						"spread": 121,
						"value": "present"
					}
				]
			},
			{
				"id": 23,
				"label": "xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 382,
						"id": 13207,
						"score": 1640,
						"spread": 324,
						"value": "xyz123"
					}
				]
			},
			{
				"id": 24,
				"label": "dr. xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 99,
						"id": 3682,
						"score": 2057,
						"spread": 71,
						"value": "dr. xyz123"
					}
				]
			},
			{
				"id": 25,
				"label": "dr. xyz123 xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 47,
						"id": 3683,
						"score": 1050,
						"spread": 30,
						"value": "dr. xyz123 xyz123"
					}
				]
			},
			{
				"id": 26,
				"label": "dr. xyz123 xyz123 xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 3685,
						"score": 51,
						"spread": 1,
						"value": "dr. xyz123 xyz123 xyz123"
					}
				]
			},
			{
				"id": 27,
				"label": "dr. xyz123 xyz123 d'othee",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 3684,
						"score": 42,
						"spread": 2,
						"value": "dr. xyz123 xyz123 d'othee"
					}
				]
			},
			{
				"id": 28,
				"label": "attending radiologist dr. xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1982,
						"score": 32,
						"spread": 1,
						"value": "attending radiologist dr. xyz123"
					}
				]
			},
			{
				"id": 29,
				"label": "drs. xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 20,
						"id": 18498,
						"score": 1154,
						"spread": 20,
						"value": "drs. xyz123"
					}
				]
			},
			{
				"id": 30,
				"label": "drs. xyz123 xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 6,
						"id": 18499,
						"score": 220,
						"spread": 6,
						"value": "drs. xyz123 xyz123"
					}
				]
			},
			{
				"id": 31,
				"label": "xyz123 xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 27,
						"id": 13236,
						"score": 351,
						"spread": 20,
						"value": "xyz123 xyz123"
					}
				]
			},
			{
				"id": 32,
				"label": "doctors xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 3640,
						"score": 64,
						"spread": 1,
						"value": "doctors xyz123"
					}
				]
			},
			{
				"id": 33,
				"label": "drxyz123 xyz123",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 3703,
						"score": 64,
						"spread": 1,
						"value": "drxyz123 xyz123"
					}
				]
			},
			{
				"id": 34,
				"label": "xyz123-xyz123 tube",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 13256,
						"score": 64,
						"spread": 1,
						"value": "xyz123-xyz123 tube"
					}
				]
			},
			{
				"id": 35,
				"label": "xyz123 present",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 13226,
						"score": 42,
						"spread": 2,
						"value": "xyz123 present"
					}
				]
			},
			{
				"id": 36,
				"label": "benefits",
				"type": "entity",
				"entities": [
					{
						"frequency": 31,
						"id": 2111,
						"score": 1444,
						"spread": 31,
						"value": "benefits"
					}
				]
			},
			{
				"id": 37,
				"label": "supervising",
				"type": "entity",
				"entities": [
					{
						"frequency": 32,
						"id": 11260,
						"score": 1313,
						"spread": 32,
						"value": "supervising"
					}
				]
			},
			{
				"id": 38,
				"label": "supervising staff",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11261,
						"score": 28,
						"spread": 1,
						"value": "supervising staff"
					}
				]
			},
			{
				"id": 42,
				"label": "alternatives",
				"type": "entity",
				"entities": [
					{
						"frequency": 10,
						"id": 1255,
						"score": 576,
						"spread": 10,
						"value": "alternatives"
					}
				]
			},
			{
				"id": 43,
				"label": "detail",
				"type": "entity",
				"entities": [
					{
						"frequency": 9,
						"id": 3392,
						"score": 576,
						"spread": 9,
						"value": "detail"
					}
				]
			},
			{
				"id": 44,
				"label": "detail telephonically",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 3393,
						"score": 64,
						"spread": 1,
						"value": "detail telephonically"
					}
				]
			},
			{
				"id": 45,
				"label": "details",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 3395,
						"score": 64,
						"spread": 1,
						"value": "details"
					}
				]
			},
			{
				"id": 50,
				"label": "full",
				"type": "entity",
				"entities": [
					{
						"frequency": 10,
						"id": 4434,
						"score": 420,
						"spread": 10,
						"value": "full"
					}
				]
			},
			{
				"id": 51,
				"label": "indications",
				"type": "entity",
				"entities": [
					{
						"frequency": 14,
						"id": 5082,
						"score": 388,
						"spread": 14,
						"value": "indications"
					}
				]
			},
			{
				"id": 52,
				"label": "site",
				"type": "entity",
				"entities": [
					{
						"frequency": 22,
						"id": 10531,
						"score": 384,
						"spread": 19,
						"value": "site"
					}
				]
			},
			{
				"id": 53,
				"label": "catheter entry site",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 2587,
						"score": 51,
						"spread": 1,
						"value": "catheter entry site"
					}
				]
			},
			{
				"id": 54,
				"label": "puncture site",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 9304,
						"score": 42,
						"spread": 2,
						"value": "puncture site"
					}
				]
			},
			{
				"id": 55,
				"label": "end",
				"type": "entity",
				"entities": [
					{
						"frequency": 5,
						"id": 3831,
						"score": 362,
						"spread": 5,
						"value": "end"
					}
				]
			},
			{
				"id": 58,
				"label": "addendum",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1070,
						"score": 51,
						"spread": 1,
						"value": "addendum"
					}
				]
			},
			{
				"id": 59,
				"label": "attending",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1978,
						"score": 42,
						"spread": 1,
						"value": "attending"
					}
				]
			},
			{
				"id": 60,
				"label": "attending radiologist",
				"type": "entity",
				"entities": [
					{
						"frequency": 39,
						"id": 1981,
						"score": 1076,
						"spread": 39,
						"value": "attending radiologist"
					}
				]
			},
			{
				"id": 61,
				"label": "attending physician",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 1980,
						"score": 136,
						"spread": 7,
						"value": "attending physician"
					}
				]
			},
			{
				"id": 67,
				"label": "supine",
				"type": "entity",
				"entities": [
					{
						"frequency": 34,
						"id": 11262,
						"score": 280,
						"spread": 34,
						"value": "supine"
					}
				]
			},
			{
				"id": 68,
				"label": "uneventful",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 12071,
						"score": 212,
						"spread": 2,
						"value": "uneventful"
					}
				]
			},
			{
				"id": 69,
				"label": "catheter",
				"type": "entity",
				"entities": [
					{
						"frequency": 146,
						"id": 2585,
						"score": 202,
						"spread": 63,
						"value": "catheter"
					}
				]
			},
			{
				"id": 70,
				"label": "both foley catheters",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 2323,
						"score": 85,
						"spread": 1,
						"value": "both foley catheters"
					}
				]
			},
			{
				"id": 71,
				"label": "mikaelsson catheter",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 6844,
						"score": 85,
						"spread": 1,
						"value": "mikaelsson catheter"
					}
				]
			},
			{
				"id": 72,
				"label": "unasyn",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 12009,
						"score": 195,
						"spread": 1,
						"value": "unasyn"
					}
				]
			},
			{
				"id": 74,
				"label": "angiographic table",
				"type": "entity",
				"entities": [
					{
						"frequency": 22,
						"id": 1494,
						"score": 180,
						"spread": 22,
						"value": "angiographic table"
					}
				]
			},
			{
				"id": 76,
				"label": "3 grams",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 403,
						"score": 169,
						"spread": 1,
						"value": "3 grams"
					}
				]
			},
			{
				"id": 77,
				"label": "no evidence",
				"type": "entity",
				"entities": [
					{
						"frequency": 264,
						"id": 7548,
						"score": 160,
						"spread": 185,
						"value": "no evidence"
					}
				]
			},
			{
				"id": 78,
				"label": "no radiogrpahic evidence",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 7760,
						"score": 64,
						"spread": 1,
						"value": "no radiogrpahic evidence"
					}
				]
			},
			{
				"id": 79,
				"label": "sheath",
				"type": "entity",
				"entities": [
					{
						"frequency": 58,
						"id": 10373,
						"score": 136,
						"spread": 31,
						"value": "sheath"
					}
				]
			},
			{
				"id": 80,
				"label": "5 french angiographic sheath",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 605,
						"score": 42,
						"spread": 1,
						"value": "5 french angiographic sheath"
					}
				]
			},
			{
				"id": 81,
				"label": "6 mmhg",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 721,
						"score": 128,
						"spread": 2,
						"value": "6 mmhg"
					}
				]
			},
			{
				"id": 82,
				"label": "duration",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 3726,
						"score": 128,
						"spread": 2,
						"value": "duration"
					}
				]
			},
			{
				"id": 83,
				"label": "entirety",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 3894,
						"score": 128,
						"spread": 2,
						"value": "entirety"
					}
				]
			},
			{
				"id": 84,
				"label": "type",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 11982,
						"score": 128,
						"spread": 2,
						"value": "type"
					}
				]
			},
			{
				"id": 85,
				"label": "appropriate requisition",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1651,
						"score": 121,
						"spread": 1,
						"value": "appropriate requisition"
					}
				]
			},
			{
				"id": 86,
				"label": "consent",
				"type": "entity",
				"entities": [
					{
						"frequency": 6,
						"id": 2981,
						"score": 117,
						"spread": 5,
						"value": "consent"
					}
				]
			},
			{
				"id": 87,
				"label": "informed consent",
				"type": "entity",
				"entities": [
					{
						"frequency": 28,
						"id": 5145,
						"score": 465,
						"spread": 28,
						"value": "informed consent"
					}
				]
			},
			{
				"id": 88,
				"label": "written informed consent",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 18730,
						"score": 212,
						"spread": 7,
						"value": "written informed consent"
					}
				]
			},
			{
				"id": 89,
				"label": "appropriate informed consent",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 18420,
						"score": 79,
						"spread": 1,
						"value": "appropriate informed consent"
					}
				]
			},
			{
				"id": 90,
				"label": "signed informed consent",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 18666,
						"score": 42,
						"spread": 1,
						"value": "signed informed consent"
					}
				]
			},
			{
				"id": 91,
				"label": "general anesthesia",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 4504,
						"score": 106,
						"spread": 7,
						"value": "general anesthesia"
					}
				]
			},
			{
				"id": 92,
				"label": "general intubation anesthesia",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 4507,
						"score": 64,
						"spread": 1,
						"value": "general intubation anesthesia"
					}
				]
			},
			{
				"id": 93,
				"label": "second liter",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 10194,
						"score": 106,
						"spread": 1,
						"value": "second liter"
					}
				]
			},
			{
				"id": 94,
				"label": "family",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 4114,
						"score": 102,
						"spread": 2,
						"value": "family"
					}
				]
			},
			{
				"id": 95,
				"label": "alternative management",
				"type": "entity",
				"entities": [
					{
						"frequency": 4,
						"id": 1254,
						"score": 100,
						"spread": 4,
						"value": "alternative management"
					}
				]
			},
			{
				"id": 96,
				"label": "22 mmhg",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 353,
						"score": 96,
						"spread": 1,
						"value": "22 mmhg"
					}
				]
			},
			{
				"id": 97,
				"label": "sedation",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 10210,
						"score": 96,
						"spread": 3,
						"value": "sedation"
					}
				]
			},
			{
				"id": 98,
				"label": "conscious sedation",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 2979,
						"score": 78,
						"spread": 7,
						"value": "conscious sedation"
					}
				]
			},
			{
				"id": 99,
				"label": "no intravenous sedation",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 7638,
						"score": 64,
						"spread": 1,
						"value": "no intravenous sedation"
					}
				]
			},
			{
				"id": 100,
				"label": "active participant",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1024,
						"score": 92,
						"spread": 1,
						"value": "active participant"
					}
				]
			},
			{
				"id": 101,
				"label": "beginning",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 2100,
						"score": 89,
						"spread": 3,
						"value": "beginning"
					}
				]
			},
			{
				"id": 102,
				"label": "adequate resuscitation",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1098,
						"score": 85,
						"spread": 1,
						"value": "adequate resuscitation"
					}
				]
			},
			{
				"id": 103,
				"label": "approximately 3 liters",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1685,
						"score": 85,
						"spread": 1,
						"value": "approximately 3 liters"
					}
				]
			},
			{
				"id": 104,
				"label": "fentanyl",
				"type": "entity",
				"entities": [
					{
						"frequency": 15,
						"id": 4153,
						"score": 84,
						"spread": 15,
						"value": "fentanyl"
					}
				]
			},
			{
				"id": 105,
				"label": "specifically",
				"type": "entity",
				"entities": [
					{
						"frequency": 10,
						"id": 10848,
						"score": 84,
						"spread": 10,
						"value": "specifically"
					}
				]
			},
			{
				"id": 106,
				"label": "staff radiologist",
				"type": "entity",
				"entities": [
					{
						"frequency": 6,
						"id": 10918,
						"score": 84,
						"spread": 6,
						"value": "staff radiologist"
					}
				]
			},
			{
				"id": 107,
				"label": "timeout",
				"type": "entity",
				"entities": [
					{
						"frequency": 4,
						"id": 11621,
						"score": 79,
						"spread": 4,
						"value": "timeout"
					}
				]
			},
			{
				"id": 108,
				"label": "preprocedure timeout",
				"type": "entity",
				"entities": [
					{
						"frequency": 8,
						"id": 8982,
						"score": 189,
						"spread": 8,
						"value": "preprocedure timeout"
					}
				]
			},
			{
				"id": 109,
				"label": "pre- procedure timeout",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8940,
						"score": 42,
						"spread": 1,
						"value": "pre- procedure timeout"
					}
				]
			},
			{
				"id": 110,
				"label": "pre-procedural timeout",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8949,
						"score": 32,
						"spread": 1,
						"value": "pre-procedural timeout"
					}
				]
			},
			{
				"id": 111,
				"label": "pre-procedure timeout",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8951,
						"score": 32,
						"spread": 1,
						"value": "pre-procedure timeout"
					}
				]
			},
			{
				"id": 112,
				"label": "preprocedural timeout",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8980,
						"score": 32,
						"spread": 1,
						"value": "preprocedural timeout"
					}
				]
			},
			{
				"id": 113,
				"label": "entire procedure",
				"type": "entity",
				"entities": [
					{
						"frequency": 24,
						"id": 3891,
						"score": 78,
						"spread": 24,
						"value": "entire procedure"
					}
				]
			},
			{
				"id": 115,
				"label": "m.d.",
				"type": "entity",
				"entities": [
					{
						"frequency": 11,
						"id": 6580,
						"score": 76,
						"spread": 8,
						"value": "m.d."
					}
				]
			},
			{
				"id": 116,
				"label": "standard sterile fashion",
				"type": "entity",
				"entities": [
					{
						"frequency": 30,
						"id": 10932,
						"score": 69,
						"spread": 29,
						"value": "standard sterile fashion"
					}
				]
			},
			{
				"id": 117,
				"label": "portosystemic pressure gradient drop",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8803,
						"score": 67,
						"spread": 1,
						"value": "portosystemic pressure gradient drop"
					}
				]
			},
			{
				"id": 118,
				"label": "stroke",
				"type": "entity",
				"entities": [
					{
						"frequency": 16,
						"id": 11077,
						"score": 67,
						"spread": 16,
						"value": "stroke"
					}
				]
			},
			{
				"id": 119,
				"label": "150 mcg",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 243,
						"score": 64,
						"spread": 2,
						"value": "150 mcg"
					}
				]
			},
			{
				"id": 120,
				"label": "all coils",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1223,
						"score": 64,
						"spread": 1,
						"value": "all coils"
					}
				]
			},
			{
				"id": 121,
				"label": "all critical aspects",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1224,
						"score": 64,
						"spread": 1,
						"value": "all critical aspects"
					}
				]
			},
			{
				"id": 122,
				"label": "completion",
				"type": "entity",
				"entities": [
					{
						"frequency": 4,
						"id": 2935,
						"score": 64,
						"spread": 4,
						"value": "completion"
					}
				]
			},
			{
				"id": 123,
				"label": "complication",
				"type": "entity",
				"entities": [
					{
						"frequency": 6,
						"id": 2941,
						"score": 64,
						"spread": 6,
						"value": "complication"
					}
				]
			},
			{
				"id": 124,
				"label": "complications",
				"type": "entity",
				"entities": [
					{
						"frequency": 4,
						"id": 2942,
						"score": 306,
						"spread": 4,
						"value": "complications"
					}
				]
			},
			{
				"id": 125,
				"label": "immediate complications",
				"type": "entity",
				"entities": [
					{
						"frequency": 5,
						"id": 4974,
						"score": 234,
						"spread": 5,
						"value": "immediate complications"
					}
				]
			},
			{
				"id": 126,
				"label": "no immediate post- procedural complications",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 7608,
						"score": 64,
						"spread": 1,
						"value": "no immediate post- procedural complications"
					}
				]
			},
			{
				"id": 127,
				"label": "no complications",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 7488,
						"score": 221,
						"spread": 7,
						"value": "no complications"
					}
				]
			},
			{
				"id": 128,
				"label": "possible complications",
				"type": "entity",
				"entities": [
					{
						"frequency": 10,
						"id": 8818,
						"score": 32,
						"spread": 10,
						"value": "possible complications"
					}
				]
			},
			{
				"id": 129,
				"label": "immediate complication",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 4973,
						"score": 64,
						"spread": 1,
						"value": "immediate complication"
					}
				]
			},
			{
				"id": 130,
				"label": "no immediate complication",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 7604,
						"score": 64,
						"spread": 1,
						"value": "no immediate complication"
					}
				]
			},
			{
				"id": 131,
				"label": "concern",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 2956,
						"score": 64,
						"spread": 5,
						"value": "concern"
					}
				]
			},
			{
				"id": 132,
				"label": "continuous monitoring",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 3034,
						"score": 64,
						"spread": 1,
						"value": "continuous monitoring"
					}
				]
			},
			{
				"id": 133,
				"label": "continuous hemodynamic monitoring",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 3033,
						"score": 16,
						"spread": 2,
						"value": "continuous hemodynamic monitoring"
					}
				]
			},
			{
				"id": 134,
				"label": "course",
				"type": "entity",
				"entities": [
					{
						"frequency": 6,
						"id": 3168,
						"score": 64,
						"spread": 6,
						"value": "course"
					}
				]
			},
			{
				"id": 135,
				"label": "etiology",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 3937,
						"score": 64,
						"spread": 2,
						"value": "etiology"
					}
				]
			},
			{
				"id": 136,
				"label": "evident",
				"type": "entity",
				"entities": [
					{
						"frequency": 13,
						"id": 3955,
						"score": 64,
						"spread": 12,
						"value": "evident"
					}
				]
			},
			{
				"id": 137,
				"label": "finding",
				"type": "entity",
				"entities": [
					{
						"frequency": 9,
						"id": 4205,
						"score": 64,
						"spread": 9,
						"value": "finding"
					}
				]
			},
			{
				"id": 139,
				"label": "findings",
				"type": "entity",
				"entities": [
					{
						"frequency": 78,
						"id": 4206,
						"score": 25,
						"spread": 74,
						"value": "findings"
					}
				]
			},
			{
				"id": 140,
				"label": "procedure/findings",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 9141,
						"score": 170,
						"spread": 2,
						"value": "procedure/findings"
					}
				]
			},
			{
				"id": 141,
				"label": "fluoroscopic guidance",
				"type": "entity",
				"entities": [
					{
						"frequency": 60,
						"id": 4275,
						"score": 64,
						"spread": 41,
						"value": "fluoroscopic guidance"
					}
				]
			},
			{
				"id": 142,
				"label": "guarded condition",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 4585,
						"score": 64,
						"spread": 1,
						"value": "guarded condition"
					}
				]
			},
			{
				"id": 143,
				"label": "kefzol iv",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 5736,
						"score": 64,
						"spread": 1,
						"value": "kefzol iv"
					}
				]
			},
			{
				"id": 144,
				"label": "mac anesthesia",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 6588,
						"score": 64,
						"spread": 1,
						"value": "mac anesthesia"
					}
				]
			},
			{
				"id": 145,
				"label": "medical necessity",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 6743,
						"score": 64,
						"spread": 1,
						"value": "medical necessity"
					}
				]
			},
			{
				"id": 146,
				"label": "mr compatible",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 7096,
						"score": 64,
						"spread": 1,
						"value": "mr compatible"
					}
				]
			},
			{
				"id": 147,
				"label": "nature",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 7261,
						"score": 64,
						"spread": 7,
						"value": "nature"
					}
				]
			},
			{
				"id": 148,
				"label": "neuro intensive care unit",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 7313,
						"score": 64,
						"spread": 1,
						"value": "neuro intensive care unit"
					}
				]
			},
			{
				"id": 149,
				"label": "pelvis",
				"type": "entity",
				"entities": [
					{
						"frequency": 79,
						"id": 8482,
						"score": 64,
						"spread": 71,
						"value": "pelvis"
					}
				]
			},
			{
				"id": 150,
				"label": "persistent",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 8584,
						"score": 64,
						"spread": 2,
						"value": "persistent"
					}
				]
			},
			{
				"id": 151,
				"label": "right common carotid artery",
				"type": "entity",
				"entities": [
					{
						"frequency": 17,
						"id": 9715,
						"score": 64,
						"spread": 16,
						"value": "right common carotid artery"
					}
				]
			},
			{
				"id": 152,
				"label": "several hours",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 10329,
						"score": 64,
						"spread": 1,
						"value": "several hours"
					}
				]
			},
			{
				"id": 153,
				"label": "start",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 10939,
						"score": 64,
						"spread": 1,
						"value": "start"
					}
				]
			},
			{
				"id": 155,
				"label": "surgical intensive care unit",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11298,
						"score": 64,
						"spread": 1,
						"value": "surgical intensive care unit"
					}
				]
			},
			{
				"id": 156,
				"label": "termination",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11460,
						"score": 64,
						"spread": 1,
						"value": "termination"
					}
				]
			},
			{
				"id": 157,
				"label": "two options",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11950,
						"score": 64,
						"spread": 1,
						"value": "two options"
					}
				]
			},
			{
				"id": 158,
				"label": "versed",
				"type": "entity",
				"entities": [
					{
						"frequency": 11,
						"id": 12258,
						"score": 64,
						"spread": 11,
						"value": "versed"
					}
				]
			},
			{
				"id": 159,
				"label": "wife",
				"type": "entity",
				"entities": [
					{
						"frequency": 4,
						"id": 13140,
						"score": 64,
						"spread": 2,
						"value": "wife"
					}
				]
			},
			{
				"id": 160,
				"label": "chylous ascites",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 2780,
						"score": 63,
						"spread": 1,
						"value": "chylous ascites"
					}
				]
			},
			{
				"id": 161,
				"label": "abdomen",
				"type": "entity",
				"entities": [
					{
						"frequency": 97,
						"id": 933,
						"score": 56,
						"spread": 83,
						"value": "abdomen"
					}
				]
			},
			{
				"id": 162,
				"label": "transjugular intrahepatic portosystemic shunt",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 11842,
						"score": 53,
						"spread": 2,
						"value": "transjugular intrahepatic portosystemic shunt"
					}
				]
			},
			{
				"id": 163,
				"label": "ascitic fluid",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 1906,
						"score": 51,
						"spread": 2,
						"value": "ascitic fluid"
					}
				]
			},
			{
				"id": 164,
				"label": "local hemostasis",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 6438,
						"score": 51,
						"spread": 1,
						"value": "local hemostasis"
					}
				]
			},
			{
				"id": 165,
				"label": "subsequent",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11142,
						"score": 51,
						"spread": 1,
						"value": "subsequent"
					}
				]
			},
			{
				"id": 166,
				"label": "1 l",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 81,
						"score": 50,
						"spread": 1,
						"value": "1 l"
					}
				]
			},
			{
				"id": 167,
				"label": "successful creation",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11171,
						"score": 43,
						"spread": 1,
						"value": "successful creation"
					}
				]
			},
			{
				"id": 168,
				"label": "102 degrees fahrenheit",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 153,
						"score": 42,
						"spread": 1,
						"value": "102 degrees fahrenheit"
					}
				]
			},
			{
				"id": 169,
				"label": "2 grams",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 299,
						"score": 42,
						"spread": 1,
						"value": "2 grams"
					}
				]
			},
			{
				"id": 170,
				"label": "2 mg",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 301,
						"score": 42,
						"spread": 7,
						"value": "2 mg"
					}
				]
			},
			{
				"id": 171,
				"label": "43 year old woman",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 547,
						"score": 42,
						"spread": 1,
						"value": "43 year old woman"
					}
				]
			},
			{
				"id": 173,
				"label": "absolute",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 982,
						"score": 42,
						"spread": 1,
						"value": "absolute"
					}
				]
			},
			{
				"id": 174,
				"label": "blood-tinged fluid",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 2272,
						"score": 42,
						"spread": 1,
						"value": "blood-tinged fluid"
					}
				]
			},
			{
				"id": 175,
				"label": "contrast",
				"type": "entity",
				"entities": [
					{
						"frequency": 100,
						"id": 3049,
						"score": 42,
						"spread": 60,
						"value": "contrast"
					}
				]
			},
			{
				"id": 176,
				"label": "injection",
				"type": "entity",
				"entities": [
					{
						"frequency": 80,
						"id": 5191,
						"score": 42,
						"spread": 25,
						"value": "injection"
					}
				]
			},
			{
				"id": 177,
				"label": "intubation",
				"type": "entity",
				"entities": [
					{
						"frequency": 10,
						"id": 5396,
						"score": 42,
						"spread": 9,
						"value": "intubation"
					}
				]
			},
			{
				"id": 179,
				"label": "place",
				"type": "entity",
				"entities": [
					{
						"frequency": 40,
						"id": 8657,
						"score": 42,
						"spread": 35,
						"value": "place"
					}
				]
			},
			{
				"id": 180,
				"label": "pre-procedure note",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8950,
						"score": 42,
						"spread": 1,
						"value": "pre-procedure note"
					}
				]
			},
			{
				"id": 181,
				"label": "radiology",
				"type": "entity",
				"entities": [
					{
						"frequency": 6,
						"id": 9341,
						"score": 42,
						"spread": 6,
						"value": "radiology"
					}
				]
			},
			{
				"id": 182,
				"label": "source",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 10845,
						"score": 42,
						"spread": 3,
						"value": "source"
					}
				]
			},
			{
				"id": 183,
				"label": "stable",
				"type": "entity",
				"entities": [
					{
						"frequency": 54,
						"id": 10891,
						"score": 42,
						"spread": 45,
						"value": "stable"
					}
				]
			},
			{
				"id": 184,
				"label": "stable condition",
				"type": "entity",
				"entities": [
					{
						"frequency": 4,
						"id": 10896,
						"score": 78,
						"spread": 4,
						"value": "stable condition"
					}
				]
			},
			{
				"id": 185,
				"label": "stage",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 10920,
						"score": 42,
						"spread": 2,
						"value": "stage"
					}
				]
			},
			{
				"id": 186,
				"label": "stenosis",
				"type": "entity",
				"entities": [
					{
						"frequency": 27,
						"id": 11024,
						"score": 42,
						"spread": 15,
						"value": "stenosis"
					}
				]
			},
			{
				"id": 187,
				"label": "writing",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 13202,
						"score": 42,
						"spread": 1,
						"value": "writing"
					}
				]
			},
			{
				"id": 188,
				"label": "gauze",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 4495,
						"score": 36,
						"spread": 1,
						"value": "gauze"
					}
				]
			},
			{
				"id": 189,
				"label": "images",
				"type": "entity",
				"entities": [
					{
						"frequency": 61,
						"id": 4971,
						"score": 36,
						"spread": 41,
						"value": "images"
					}
				]
			},
			{
				"id": 190,
				"label": "5 mm axial images",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 625,
						"score": 42,
						"spread": 1,
						"value": "5 mm axial images"
					}
				]
			},
			{
				"id": 191,
				"label": "manual compression",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 6626,
						"score": 36,
						"spread": 3,
						"value": "manual compression"
					}
				]
			},
			{
				"id": 192,
				"label": "approximately 900 cc",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 1705,
						"score": 32,
						"spread": 1,
						"value": "approximately 900 cc"
					}
				]
			},
			{
				"id": 193,
				"label": "coil embolization",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 2844,
						"score": 32,
						"spread": 3,
						"value": "coil embolization"
					}
				]
			},
			{
				"id": 194,
				"label": "continuous divided doses",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 3030,
						"score": 32,
						"spread": 1,
						"value": "continuous divided doses"
					}
				]
			},
			{
				"id": 195,
				"label": "explanation",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 4001,
						"score": 32,
						"spread": 1,
						"value": "explanation"
					}
				]
			},
			{
				"id": 196,
				"label": "complete explanation",
				"type": "entity",
				"entities": [
					{
						"frequency": 10,
						"id": 2921,
						"score": 640,
						"spread": 10,
						"value": "complete explanation"
					}
				]
			},
			{
				"id": 198,
				"label": "manual pressure",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 6627,
						"score": 32,
						"spread": 7,
						"value": "manual pressure"
					}
				]
			},
			{
				"id": 199,
				"label": "no extravasation",
				"type": "entity",
				"entities": [
					{
						"frequency": 7,
						"id": 7551,
						"score": 32,
						"spread": 7,
						"value": "no extravasation"
					}
				]
			},
			{
				"id": 200,
				"label": "patietn",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8453,
						"score": 32,
						"spread": 1,
						"value": "patietn"
					}
				]
			},
			{
				"id": 201,
				"label": "risk",
				"type": "entity",
				"entities": [
					{
						"frequency": 20,
						"id": 10071,
						"score": 32,
						"spread": 11,
						"value": "risk"
					}
				]
			},
			{
				"id": 202,
				"label": "risks",
				"type": "entity",
				"entities": [
					{
						"frequency": 39,
						"id": 10073,
						"score": 1196,
						"spread": 36,
						"value": "risks"
					}
				]
			},
			{
				"id": 203,
				"label": "septic shock",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 10296,
						"score": 32,
						"spread": 1,
						"value": "septic shock"
					}
				]
			},
			{
				"id": 204,
				"label": "son",
				"type": "entity",
				"entities": [
					{
						"frequency": 2,
						"id": 10837,
						"score": 32,
						"spread": 1,
						"value": "son"
					}
				]
			},
			{
				"id": 205,
				"label": "person",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8631,
						"score": 42,
						"spread": 1,
						"value": "person"
					}
				]
			},
			{
				"id": 206,
				"label": "temperature",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11436,
						"score": 32,
						"spread": 1,
						"value": "temperature"
					}
				]
			},
			{
				"id": 207,
				"label": "hemorrhage",
				"type": "entity",
				"entities": [
					{
						"frequency": 30,
						"id": 4758,
						"score": 28,
						"spread": 25,
						"value": "hemorrhage"
					}
				]
			},
			{
				"id": 208,
				"label": "subarachnoid hemorrhage",
				"type": "entity",
				"entities": [
					{
						"frequency": 6,
						"id": 11093,
						"score": 64,
						"spread": 6,
						"value": "subarachnoid hemorrhage"
					}
				]
			},
			{
				"id": 209,
				"label": "right groin",
				"type": "entity",
				"entities": [
					{
						"frequency": 21,
						"id": 9761,
						"score": 28,
						"spread": 17,
						"value": "right groin"
					}
				]
			},
			{
				"id": 210,
				"label": "telephone",
				"type": "entity",
				"entities": [
					{
						"frequency": 3,
						"id": 11434,
						"score": 28,
						"spread": 3,
						"value": "telephone"
					}
				]
			},
			{
				"id": 211,
				"label": "dissection",
				"type": "entity",
				"entities": [
					{
						"frequency": 24,
						"id": 3554,
						"score": 25,
						"spread": 15,
						"value": "dissection"
					}
				]
			},
			{
				"id": 212,
				"label": "icu team",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 4928,
						"score": 25,
						"spread": 1,
						"value": "icu team"
					}
				]
			},
			{
				"id": 213,
				"label": "manipulating",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 6625,
						"score": 25,
						"spread": 1,
						"value": "manipulating"
					}
				]
			},
			{
				"id": 214,
				"label": "operator supervision",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 8133,
						"score": 25,
						"spread": 1,
						"value": "operator supervision"
					}
				]
			},
			{
				"id": 215,
				"label": "proceedure",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 9142,
						"score": 25,
						"spread": 1,
						"value": "proceedure"
					}
				]
			},
			{
				"id": 216,
				"label": "subsegment",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11138,
						"score": 25,
						"spread": 1,
						"value": "subsegment"
					}
				]
			},
			{
				"id": 217,
				"label": "infection",
				"type": "entity",
				"entities": [
					{
						"frequency": 16,
						"id": 5100,
						"score": 23,
						"spread": 16,
						"value": "infection"
					}
				]
			},
			{
				"id": 218,
				"label": "treatment plan",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 11880,
						"score": 23,
						"spread": 1,
						"value": "treatment plan"
					}
				]
			},
			{
				"id": 219,
				"label": "angiography table",
				"type": "entity",
				"entities": [
					{
						"frequency": 9,
						"id": 1497,
						"score": 21,
						"spread": 9,
						"value": "angiography table"
					}
				]
			},
			{
				"id": 220,
				"label": "clot",
				"type": "entity",
				"entities": [
					{
						"frequency": 12,
						"id": 2822,
						"score": 21,
						"spread": 9,
						"value": "clot"
					}
				]
			},
			{
				"id": 221,
				"label": "death",
				"type": "entity",
				"entities": [
					{
						"frequency": 11,
						"id": 3259,
						"score": 21,
						"spread": 11,
						"value": "death"
					}
				]
			},
			{
				"id": 222,
				"label": "nursing staff",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 7997,
						"score": 21,
						"spread": 1,
						"value": "nursing staff"
					}
				]
			},
			{
				"id": 223,
				"label": "icu nursing staff",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 4927,
						"score": 32,
						"spread": 1,
						"value": "icu nursing staff"
					}
				]
			},
			{
				"id": 224,
				"label": "members",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 6750,
						"score": 18,
						"spread": 1,
						"value": "members"
					}
				]
			},
			{
				"id": 225,
				"label": "portal vein",
				"type": "entity",
				"entities": [
					{
						"frequency": 27,
						"id": 8787,
						"score": 18,
						"spread": 14,
						"value": "portal vein"
					}
				]
			},
			{
				"id": 226,
				"label": "witness",
				"type": "entity",
				"entities": [
					{
						"frequency": 1,
						"id": 13172,
						"score": 16,
						"spread": 1,
						"value": "witness"
					}
				]
			}
		],
		"edges": [
			{
				"source": 0,
				"target": 1,
				"type": "related"
			},
			{
				"source": 1,
				"target": 2,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 4,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 5,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 6,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 7,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 9,
				"type": "similar"
			},
			{
				"source": 9,
				"target": 10,
				"type": "similar"
			},
			{
				"source": 9,
				"target": 11,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 12,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 13,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 14,
				"type": "similar"
			},
			{
				"source": 1,
				"target": 15,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 21,
				"type": "related"
			},
			{
				"source": 0,
				"target": 23,
				"type": "related"
			},
			{
				"source": 23,
				"target": 24,
				"type": "similar"
			},
			{
				"source": 24,
				"target": 25,
				"type": "similar"
			},
			{
				"source": 25,
				"target": 26,
				"type": "similar"
			},
			{
				"source": 26,
				"target": 27,
				"type": "similar"
			},
			{
				"source": 26,
				"target": 28,
				"type": "similar"
			},
			{
				"source": 23,
				"target": 29,
				"type": "similar"
			},
			{
				"source": 29,
				"target": 30,
				"type": "similar"
			},
			{
				"source": 23,
				"target": 31,
				"type": "similar"
			},
			{
				"source": 31,
				"target": 32,
				"type": "similar"
			},
			{
				"source": 31,
				"target": 33,
				"type": "similar"
			},
			{
				"source": 31,
				"target": 34,
				"type": "similar"
			},
			{
				"source": 31,
				"target": 35,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 36,
				"type": "related"
			},
			{
				"source": 0,
				"target": 37,
				"type": "related"
			},
			{
				"source": 37,
				"target": 38,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 42,
				"type": "related"
			},
			{
				"source": 0,
				"target": 43,
				"type": "related"
			},
			{
				"source": 43,
				"target": 44,
				"type": "similar"
			},
			{
				"source": 43,
				"target": 45,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 50,
				"type": "related"
			},
			{
				"source": 0,
				"target": 51,
				"type": "related"
			},
			{
				"source": 0,
				"target": 52,
				"type": "related"
			},
			{
				"source": 52,
				"target": 53,
				"type": "similar"
			},
			{
				"source": 52,
				"target": 54,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 55,
				"type": "related"
			},
			{
				"source": 55,
				"target": 58,
				"type": "similar"
			},
			{
				"source": 55,
				"target": 59,
				"type": "similar"
			},
			{
				"source": 59,
				"target": 60,
				"type": "similar"
			},
			{
				"source": 59,
				"target": 61,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 67,
				"type": "related"
			},
			{
				"source": 0,
				"target": 68,
				"type": "related"
			},
			{
				"source": 0,
				"target": 69,
				"type": "related"
			},
			{
				"source": 69,
				"target": 70,
				"type": "similar"
			},
			{
				"source": 69,
				"target": 71,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 72,
				"type": "related"
			},
			{
				"source": 0,
				"target": 74,
				"type": "related"
			},
			{
				"source": 0,
				"target": 76,
				"type": "related"
			},
			{
				"source": 0,
				"target": 77,
				"type": "related"
			},
			{
				"source": 77,
				"target": 78,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 79,
				"type": "related"
			},
			{
				"source": 79,
				"target": 80,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 81,
				"type": "related"
			},
			{
				"source": 0,
				"target": 82,
				"type": "related"
			},
			{
				"source": 0,
				"target": 83,
				"type": "related"
			},
			{
				"source": 0,
				"target": 84,
				"type": "related"
			},
			{
				"source": 0,
				"target": 85,
				"type": "related"
			},
			{
				"source": 0,
				"target": 86,
				"type": "related"
			},
			{
				"source": 86,
				"target": 87,
				"type": "similar"
			},
			{
				"source": 87,
				"target": 88,
				"type": "similar"
			},
			{
				"source": 87,
				"target": 89,
				"type": "similar"
			},
			{
				"source": 87,
				"target": 90,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 91,
				"type": "related"
			},
			{
				"source": 91,
				"target": 92,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 93,
				"type": "related"
			},
			{
				"source": 0,
				"target": 94,
				"type": "related"
			},
			{
				"source": 0,
				"target": 95,
				"type": "related"
			},
			{
				"source": 0,
				"target": 96,
				"type": "related"
			},
			{
				"source": 0,
				"target": 97,
				"type": "related"
			},
			{
				"source": 97,
				"target": 98,
				"type": "similar"
			},
			{
				"source": 97,
				"target": 99,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 100,
				"type": "related"
			},
			{
				"source": 0,
				"target": 101,
				"type": "related"
			},
			{
				"source": 0,
				"target": 102,
				"type": "related"
			},
			{
				"source": 0,
				"target": 103,
				"type": "related"
			},
			{
				"source": 0,
				"target": 104,
				"type": "related"
			},
			{
				"source": 0,
				"target": 105,
				"type": "related"
			},
			{
				"source": 0,
				"target": 106,
				"type": "related"
			},
			{
				"source": 0,
				"target": 107,
				"type": "related"
			},
			{
				"source": 107,
				"target": 108,
				"type": "similar"
			},
			{
				"source": 107,
				"target": 109,
				"type": "similar"
			},
			{
				"source": 107,
				"target": 110,
				"type": "similar"
			},
			{
				"source": 107,
				"target": 111,
				"type": "similar"
			},
			{
				"source": 107,
				"target": 112,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 113,
				"type": "related"
			},
			{
				"source": 0,
				"target": 115,
				"type": "related"
			},
			{
				"source": 0,
				"target": 116,
				"type": "related"
			},
			{
				"source": 0,
				"target": 117,
				"type": "related"
			},
			{
				"source": 0,
				"target": 118,
				"type": "related"
			},
			{
				"source": 0,
				"target": 119,
				"type": "related"
			},
			{
				"source": 0,
				"target": 120,
				"type": "related"
			},
			{
				"source": 0,
				"target": 121,
				"type": "related"
			},
			{
				"source": 0,
				"target": 122,
				"type": "related"
			},
			{
				"source": 0,
				"target": 123,
				"type": "related"
			},
			{
				"source": 123,
				"target": 124,
				"type": "similar"
			},
			{
				"source": 124,
				"target": 125,
				"type": "similar"
			},
			{
				"source": 125,
				"target": 126,
				"type": "similar"
			},
			{
				"source": 124,
				"target": 127,
				"type": "similar"
			},
			{
				"source": 124,
				"target": 128,
				"type": "similar"
			},
			{
				"source": 123,
				"target": 129,
				"type": "similar"
			},
			{
				"source": 129,
				"target": 130,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 131,
				"type": "related"
			},
			{
				"source": 0,
				"target": 132,
				"type": "related"
			},
			{
				"source": 132,
				"target": 133,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 134,
				"type": "related"
			},
			{
				"source": 0,
				"target": 135,
				"type": "related"
			},
			{
				"source": 0,
				"target": 136,
				"type": "related"
			},
			{
				"source": 0,
				"target": 137,
				"type": "related"
			},
			{
				"source": 137,
				"target": 139,
				"type": "similar"
			},
			{
				"source": 139,
				"target": 140,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 141,
				"type": "related"
			},
			{
				"source": 0,
				"target": 142,
				"type": "related"
			},
			{
				"source": 0,
				"target": 143,
				"type": "related"
			},
			{
				"source": 0,
				"target": 144,
				"type": "related"
			},
			{
				"source": 0,
				"target": 145,
				"type": "related"
			},
			{
				"source": 0,
				"target": 146,
				"type": "related"
			},
			{
				"source": 0,
				"target": 147,
				"type": "related"
			},
			{
				"source": 0,
				"target": 148,
				"type": "related"
			},
			{
				"source": 0,
				"target": 149,
				"type": "related"
			},
			{
				"source": 0,
				"target": 150,
				"type": "related"
			},
			{
				"source": 0,
				"target": 151,
				"type": "related"
			},
			{
				"source": 0,
				"target": 152,
				"type": "related"
			},
			{
				"source": 0,
				"target": 153,
				"type": "related"
			},
			{
				"source": 0,
				"target": 155,
				"type": "related"
			},
			{
				"source": 0,
				"target": 156,
				"type": "related"
			},
			{
				"source": 0,
				"target": 157,
				"type": "related"
			},
			{
				"source": 0,
				"target": 158,
				"type": "related"
			},
			{
				"source": 0,
				"target": 159,
				"type": "related"
			},
			{
				"source": 0,
				"target": 160,
				"type": "related"
			},
			{
				"source": 0,
				"target": 161,
				"type": "related"
			},
			{
				"source": 0,
				"target": 162,
				"type": "related"
			},
			{
				"source": 0,
				"target": 163,
				"type": "related"
			},
			{
				"source": 0,
				"target": 164,
				"type": "related"
			},
			{
				"source": 0,
				"target": 165,
				"type": "related"
			},
			{
				"source": 0,
				"target": 166,
				"type": "related"
			},
			{
				"source": 0,
				"target": 167,
				"type": "related"
			},
			{
				"source": 0,
				"target": 168,
				"type": "related"
			},
			{
				"source": 0,
				"target": 169,
				"type": "related"
			},
			{
				"source": 0,
				"target": 170,
				"type": "related"
			},
			{
				"source": 0,
				"target": 171,
				"type": "related"
			},
			{
				"source": 0,
				"target": 173,
				"type": "related"
			},
			{
				"source": 0,
				"target": 174,
				"type": "related"
			},
			{
				"source": 0,
				"target": 175,
				"type": "related"
			},
			{
				"source": 0,
				"target": 176,
				"type": "related"
			},
			{
				"source": 0,
				"target": 177,
				"type": "related"
			},
			{
				"source": 0,
				"target": 179,
				"type": "related"
			},
			{
				"source": 0,
				"target": 180,
				"type": "related"
			},
			{
				"source": 0,
				"target": 181,
				"type": "related"
			},
			{
				"source": 0,
				"target": 182,
				"type": "related"
			},
			{
				"source": 0,
				"target": 183,
				"type": "related"
			},
			{
				"source": 183,
				"target": 184,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 185,
				"type": "related"
			},
			{
				"source": 0,
				"target": 186,
				"type": "related"
			},
			{
				"source": 0,
				"target": 187,
				"type": "related"
			},
			{
				"source": 0,
				"target": 188,
				"type": "related"
			},
			{
				"source": 0,
				"target": 189,
				"type": "related"
			},
			{
				"source": 189,
				"target": 190,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 191,
				"type": "related"
			},
			{
				"source": 0,
				"target": 192,
				"type": "related"
			},
			{
				"source": 0,
				"target": 193,
				"type": "related"
			},
			{
				"source": 0,
				"target": 194,
				"type": "related"
			},
			{
				"source": 0,
				"target": 195,
				"type": "related"
			},
			{
				"source": 195,
				"target": 196,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 198,
				"type": "related"
			},
			{
				"source": 0,
				"target": 199,
				"type": "related"
			},
			{
				"source": 0,
				"target": 200,
				"type": "related"
			},
			{
				"source": 0,
				"target": 201,
				"type": "related"
			},
			{
				"source": 201,
				"target": 202,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 203,
				"type": "related"
			},
			{
				"source": 0,
				"target": 204,
				"type": "related"
			},
			{
				"source": 204,
				"target": 205,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 206,
				"type": "related"
			},
			{
				"source": 0,
				"target": 207,
				"type": "related"
			},
			{
				"source": 207,
				"target": 208,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 209,
				"type": "related"
			},
			{
				"source": 0,
				"target": 210,
				"type": "related"
			},
			{
				"source": 0,
				"target": 211,
				"type": "related"
			},
			{
				"source": 0,
				"target": 212,
				"type": "related"
			},
			{
				"source": 0,
				"target": 213,
				"type": "related"
			},
			{
				"source": 0,
				"target": 214,
				"type": "related"
			},
			{
				"source": 0,
				"target": 215,
				"type": "related"
			},
			{
				"source": 0,
				"target": 216,
				"type": "related"
			},
			{
				"source": 0,
				"target": 217,
				"type": "related"
			},
			{
				"source": 0,
				"target": 218,
				"type": "related"
			},
			{
				"source": 0,
				"target": 219,
				"type": "related"
			},
			{
				"source": 0,
				"target": 220,
				"type": "related"
			},
			{
				"source": 0,
				"target": 221,
				"type": "related"
			},
			{
				"source": 0,
				"target": 222,
				"type": "related"
			},
			{
				"source": 222,
				"target": 223,
				"type": "similar"
			},
			{
				"source": 0,
				"target": 224,
				"type": "related"
			},
			{
				"source": 0,
				"target": 225,
				"type": "related"
			},
			{
				"source": 0,
				"target": 226,
				"type": "related"
			}
		]
	}
};

/***/ })
/******/ ]);
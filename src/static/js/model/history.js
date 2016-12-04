let history = [],
    redoHistory = [],
    undoButton = null,
    redoButton = null;

export function createState ({ undo, redo } = {}) {
    if (typeof undo !== "function" || typeof redo !== "function")
        throw new Error("Undo and Redo must be both functions");
    redoHistory = [];
    history.push({ undo, redo });
    updateButtons();
}

export function undo () {
    let undoed = history.pop();
    if (!undoed)
        return;
    redoHistory.push(undoed);
    undoed.undo();
}

export function redo () {
    let redoed = redoHistory.pop();
    if (!redoed)
        return;
    history.push(redoed);
    redoed.redo();
}

export function reset () {
    history = [];
    redoHistory = [];
    updateButtons();
}

function updateButtons () {
    undoButton.classList[history.length ? `remove` : `add`](`disabled`);
    redoButton.classList[redoHistory.length ? `remove` : `add`](`disabled`);
}

export function init () {
    undoButton = document.getElementById(`undoButton`);
    redoButton = document.getElementById(`redoButton`);
    undoButton.addEventListener(`click`, () => { undo(); updateButtons(); });
    redoButton.addEventListener(`click`, () => { redo(); updateButtons(); });
    updateButtons();
}
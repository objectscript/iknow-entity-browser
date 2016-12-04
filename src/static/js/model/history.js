let history = [],
    redoHistory = [];

export function createState ({ undo, redo } = {}) {
    if (typeof undo !== "function" || typeof redo !== "function")
        throw new Error("Undo and Redo must be both functions");
    redoHistory = [];
    history.push({ undo, redo });
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

window.undo = undo;
window.redo = redo;
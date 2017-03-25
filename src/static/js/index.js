import * as graph from "./graph";
import * as tabular from "./tabular";
import * as settings from "./settings";
import * as model from "./model";
import * as controls from "./controls";
import * as selection from "./selection";

window.init = () => {

    tabular.init();
    settings.init();
    graph.init();
    controls.init();
    model.init();
    selection.init();
    model.update(() => graph.update(true));

};
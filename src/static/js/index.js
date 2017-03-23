import * as graph from "./graph";
import * as tabular from "./tabular";
import * as settings from "./settings";
import * as model from "./model";
import * as controls from "./controls";

window.init = () => {

    tabular.init();
    settings.init();
    graph.init();
    controls.init();
    model.init();
    model.update(() => graph.update(true));

};
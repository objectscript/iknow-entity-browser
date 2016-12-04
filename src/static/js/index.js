import * as graph from "./graph";
import * as tabular from "./tabular";
import * as details from "./details";
import * as settings from "./settings";
import * as source from "./source";
import * as model from "./model";
import * as controls from "./controls";

window.init = () => {

    tabular.init();
    details.init();
    settings.init();
    source.init();
    graph.init();
    controls.init();
    model.init();
    model.update(() => graph.update(true));

};
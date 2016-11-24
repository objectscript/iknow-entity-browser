import * as graph from "./graph";
import * as tabular from "./tabular";
import * as details from "./details";
import * as settings from "./settings";
import * as source from "./source";
import * as model from "./model";

window.init = () => {

    tabular.init();
    details.init();
    settings.init();
    source.init();
    graph.init();
    model.update(() => graph.update());

};
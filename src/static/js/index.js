import { update } from "./graph";
import * as tabular from "./tabular";
import * as details from "./details";
import * as settings from "./settings";

window.init = () => {

    update();
    tabular.init();
    details.init();
    settings.init();

};
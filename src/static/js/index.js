import { update } from "./graph";
import * as tabular from "./tabular";
import * as details from "./details";

window.init = () => {

    update();
    tabular.init();
    details.init();

};
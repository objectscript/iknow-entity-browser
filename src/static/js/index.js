import { update } from "./graph";
import * as tabular from "./tabular";

window.init = () => {

    update();
    tabular.init();

};
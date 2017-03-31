import { httpGet } from "../utils";
import { getOption } from "../settings/values";

export function getData (callback) {
    let https = (getOption("host") || "").indexOf("https://") === 0;
    httpGet(`${ getOption("host") || `http://${ location.hostname }` }${
        getOption("port") === (https ? 443 : 80) ? "" : ":" + getOption("port") 
    }/${ getOption("webAppName") }/api/domain/${ encodeURIComponent(getOption("domain")) }/${
        encodeURIComponent(getOption("queryType"))
    }/${
        encodeURIComponent(getOption("seed")) 
    }`, callback);
}
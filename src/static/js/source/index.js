import { httpGet } from "../utils";
import { getOption } from "../settings/values";

export function getData (callback) {
    let https = (getOption("host") || location.href).indexOf("https:") === 0,
        port = getOption("port") || +location.port || 57772;
    httpGet(`${ getOption("host") || `http://${ location.hostname }` }${
        port === (https ? 443 : 80) ? "" : ":" + port 
    }/${ getOption("webAppName") || "EntityBrowser" }/api/domain/${ 
        encodeURIComponent(getOption("domain")) }/${ encodeURIComponent(getOption("queryType")) }/${
        encodeURIComponent(getOption("seed")) 
    }`, callback);
}
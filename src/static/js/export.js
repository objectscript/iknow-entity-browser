/**
 * @param {*[][]} dataArray - Table to be exported.
 */
export function csv (dataArray = []) {

    console.log(dataArray);
    let csvContent = "data:text/csv;charset=utf-8,";

    dataArray.forEach((infoArray, index) => {

        let dataString = infoArray.join(",");
        csvContent += index < dataArray.length ? dataString + "\n" : dataString;

    });

    let encodedUri = encodeURI(csvContent),
        link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "entityGraph.csv");
    document.body.appendChild(link);
    link.click();

    setTimeout(() => link.parentNode.removeChild(link), 10);

}
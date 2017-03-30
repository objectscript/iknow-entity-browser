/// Class that serves the static data encoded in Base64 and stored in this class in XData blocks.
Class EntityBrowser.REST.ServeXData Extends %CSP.REST
{

/// Index file name which will be served when requesting "/".
Parameter IndexFile = "index.html";

/// Identifies the compilation time, which is used to form "Last-Modified" HTTP header.
Parameter CompileTime = {"""" _ $zd($h, 11) _ ", "_ $zdt($NOW(0), 2,1) _ " GMT"""};

/// $LB of pairs $LB("fileName1", "XDataName1", "FileName2", ...)
/// Generated in GenerateFiles generator.
Parameter Files As CONFIGVALUE;

/// Copy the <Route> definition to the URLMap XData of your class.
XData UrlMap
{
<Routes>
    <Route Url="/(.*)" Method="GET" Call="StaticDelivery"/>
</Routes>
}

/// A generator for Files parameter.
ClassMethod FillFiles() As %Status [ CodeMode = objectgenerator, ForceGenerate ]
{
	set list = $LB()
	set (ind, j) = 0
	for i=1:1:%compiledclass.XDatas.Count() {
        set xd = %compiledclass.XDatas.GetAt(i)
        set:(xd.Description = ..#IndexFile) ind = i
        continue:($FIND(xd.Name,"File")=0)
        set $LIST(list, j*2+1) = xd.Description
        set $LIST(list, j*2+2) = xd.Name
        set j = j + 1
    }
    if (ind '= 0) { // add index file
	    set xd = %compiledclass.XDatas.GetAt(ind)
	    set $LIST(list, j*2+1) = ""
        set $LIST(list, j*2+2) = xd.Name
    }
	do $system.OBJ.UpdateConfigParam("EntityBrowser.REST.ServeXData", "Files", list)
	return $$$OK
}

ClassMethod GetXData(fileName As %String) As %Dictionary.CompiledXData
{
	set xdn = ""
	for i=1:2:$LISTLENGTH(..#Files) {
		continue:($LISTGET(..#Files, i) '= fileName)
		set xdn = $LISTGET(..#Files, i + 1)
	}
	return:(xdn="") ""
	return ##class(%Dictionary.CompiledXData).%OpenId($ClassName()_"||"_xdn)
}

ClassMethod StaticDelivery(file As %String) As %Status
{
    set xdata = ..GetXData(file)
    return:(xdata = "") ..Http404()

    set cTime = $PARAMETER($ClassName(), "CompileTime")
    set %response.ContentType = xdata.MimeType
    do %response.SetHeader("Last-Modified", cTime)
    if (%request.GetCgiEnv("HTTP_IF_MODIFIED_SINCE") = cTime) {
        set %response.Status = "304 Not Modified"
        return $$$OK
    }

    write $System.Encryption.Base64Decode(xdata.Data.Read(xdata.Data.Size))

	return $$$OK
}

}

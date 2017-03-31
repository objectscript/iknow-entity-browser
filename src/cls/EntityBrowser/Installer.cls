Class EntityBrowser.Installer Extends %Projection.AbstractProjection [ DependsOn = Router ]
{

Projection Reference As Installer;

Parameter AppName = "EntityBrowser";

Parameter DispatchClass = "EntityBrowser.Router";

Parameter VERSION = "<!-- @echo package.version -->";

/// This method is invoked when this class is compiling.
ClassMethod CreateProjection(cls As %String, ByRef params) As %Status
{
    write !, "Registering web application /" _ ..#AppName
    return ##class(WebAppManager).Register("/" _ ..#AppName, {
        "Description": ("A web application for Cache Entity Browser Project. You can change any "
            _ "properties of this application except of Dispatch Class property. To delete the "
            _ "application simply delete " _ ..#AppName _ " package, the web application will be "
            _ "deleted automatically."),
        "IsNameSpaceDefault": ($$$NO),
        "DispatchClass": (..#DispatchClass)
    })
}

/// This method is invoked when a class is 'uncompiled'.
ClassMethod RemoveProjection(cls As %String, ByRef params, recompile As %Boolean) As %Status
{
    return:recompile $$$OK
    write !, "Removing web application /" _ ..#AppName
    return ##class(WebAppManager).Delete("/" _ ..#AppName, {
        "DispatchClass": (..#DispatchClass)
    })
}

}
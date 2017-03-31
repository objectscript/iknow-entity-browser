/// This class simplifies work with web applications.
/// For Caché 2016.2+
/// @author ZitRo
Class EntityBrowser.WebAppManager
{

/// Registers new or updates existing web application with new config (as JSON dynamic object).
/// List the properties you can assign to JSON object with the next command:
/// %SYS > do ##class(Security.Applications).Get("/csp/user", .props) zw props
///
/// Usage example: ##class(EntityBrowser.WebAppManager).Register("/name", { "NameSpace": "USER" })
ClassMethod Register(name As %String, config As %DynamicObject = {{}}) As %Status
{
    set ns = $Namespace
    new $Namespace
    try {
        set $Namespace = "%SYS"
    } catch (e) {
        return e.AsSystemError()
    }
    set st = $$$OK
    set spec("AutheEnabled") = $$$AutheCache // defaults
    set spec("NameSpace") = ns
    set iter = config.%GetIterator()
	while iter.%GetNext(.key, .value) {
	    set spec(key) = value
	}
    if ('##class(Security.Applications).Exists(name)) {
        return ##class(Security.Applications).Create(name, .spec)
    }
    return ##class(Security.Applications).Modify(name, .spec)
}

/// Deletes the specified application only if it matches matchingConfig.
/// If matchingConfig object is empty, deletes the application. You can specify only those matches
/// you need to check.
ClassMethod Delete(name As %String, matchingConfig As %DynamicObject = {{}})
{
    new $Namespace
    try {
        set $Namespace = "%SYS"
    } catch (e) {
        return e.AsSystemError()
    }
    set st = $$$OK
    return:'##class(Security.Applications).Exists(name)
    do ##class(Security.Applications).Get(name, .spec)
    set iter = matchingConfig.%GetIterator()
    while iter.%GetNext(.key, .value) {
        return:($get(spec(key)) '= value) st
    }
    return ##class(Security.Applications).Delete(name)
}

}
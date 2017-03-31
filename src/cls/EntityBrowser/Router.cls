/// Application entry point.
Class EntityBrowser.Router Extends (ServeXData, StaticData)
{

XData UrlMap
{
<Routes>
    <Map Prefix="/api" Forward="EntityBrowser.API"/>
    <Route Url="/(.*)" Method="GET" Call="Serve"/>
</Routes>
}

}
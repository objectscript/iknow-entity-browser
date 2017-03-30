/// Application entry point.
Class EntityBrowser.REST.Router Extends (ServeXData, StaticData)
{

XData UrlMap
{
<Routes>
    <Map Prefix="/api" Forward="EntityBrowser.REST.API"/>
    <Route Url="/(.*)" Method="GET" Call="StaticDelivery"/>
</Routes>
}

}
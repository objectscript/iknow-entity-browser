/// <example language="swagger">
/// swagger: '2.0'
/// 
/// info:
///   version: "1.0.0"
///   title: iKnow REST APIs
///   description: |
///     This is the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
///     of the iKnow REST API for the Entity Browser module.
///     Use [swagger-ui](https://github.com/swagger-api/swagger-ui/blob/master/README.md)
///     or a similar tool to conveniently browse and test these APIs.
///     For more information on iKnow, visit [intersystems.com](http://www.intersystems.com)
/// 
///   contact:
///     name: InterSystems
///     url: http://wrc.intersystems.com
///     email: support@intersystems.com
/// 
/// consumes:
///   - application/json
/// produces:
///   - application/json
/// 
/// 
/// parameters:
///   domainParam:
///     name: domain
///     type: integer
///     in: path
///     description: the ID of the domain to query
///     required: true
/// 
/// definitions:
///   RequestObject:
///     type: object
///     properties:
///       filter:
///         description: filter object restricting the sources to be considered in this query
///         $ref: '#/definitions/Filter'
///       filterMode:
///         description: filter mode to use for optionally recalculating certain metrics. Defaults to recalculating all and re-sorting the results (15).
///         type: integer
///         default: 15
///         example: 15
///         enum: [1, 3, 5, 7, 11, 13, 15]
///       blacklists:
///         description: array of blacklist IDs or names to use for limiting query results, OR a valid SELECT clause retrieving entity values outright
///         type: array
///         default: []
///         items:
///           type: integer
/// 
///   Filter:
///     # TODO: move into proper hierarchy once swagger-ui supports it
///     type: object
///     example:
///       { "operator": "OR",
///         "filters": [ { "ids": [ 123 ] },
///                      {"field": "Year", "operator": ">", "value": 2016 } ] }
///     properties:
///       ids:
///         description: for use with source-ID-based filters
///         type: array
///         items:
///           type: integer
///       extIds:
///         description: for use with external-ID-based filters
///         type: array
///         items:
///           type: string
///       operator:
///         description: for use with group filters ("AND"|"OR") or metadata-based filters (any other value)
///         type: string
///         enum: ["AND", "OR", "=", "!=", "<", ">", ">=", "<=", "BETWEEN", "IS NULL", "IS NOT NULL"]
///       field:
///         description: for use with metadata-based filters
///         type: string
///       value:
///         description: for use with metadata-based filters
///         type: string
///       negate:
///         description: for use with group filters
///         type: boolean
///         default: false
///       filters:
///         description: for use with group filters
///         type: array
///         items:
///           $ref: '#/definitions/Filter'
///       className:
///         description: use for filters not covered by other shorthands
///         type: string
///         example: '%iKnow.Filters.ContainsEntityFilter'
///       arguments:
///         description: for use with 'className' property, any arguments to be passed to the filter's %New() method (except domain ID)
///         type: array
///         items:
///           type: string
/// </example>
Class EntityBrowser.API Extends (%iKnow.REST.Base, %iKnow.REST.Utils)
{

Parameter PAGESIZE = 50;

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>
<Route Url="/swagger" Method="GET" Call="GetSwagger" />
<Route Url="/domain/:domain/similar/:string" Method="GET" Call="GetSimilarGET" Cors="true"/>
<Route Url="/domain/:domain/similar" Method="POST" Call="GetSimilar" Cors="true"/>
<Route Url="/domain/:domain/related/:entity" Method="GET" Call="GetRelatedGET" Cors="true"/>
<Route Url="/domain/:domain/related" Method="POST" Call="GetRelated" Cors="true"/>
</Routes>
}

/// Extend the timeout for the long queries up to 2 hours
ClassMethod OnPreDispatch(pUrl As %String, pMethod As %String, ByRef pContinue As %Boolean) As %Status
{
	set %response.Timeout = 60 * 60 * 2 // 2 hours at max
	return ##class(%iKnow.REST.Base).OnPreDispatch(pUrl, pMethod, pContinue)
}

/// <example language="swagger">
///       summary: |
///         Retrieves the graph representation of all entities similar to a seed string
///       parameters:
///         - $ref: '#/parameters/domainParam'
///         - name: string
///           in: path
///           description: seed string
///           type: string
///           required: true
///           example: bananas
///       responses:
///         200:
///           description: Successful response
/// </example>
ClassMethod GetSimilarGET(pDomainId As %Integer, pString As %String = "") As %Status [ Internal ]
{
	quit ..GetSimilar(pDomainId, pString)
}

/// <example language="swagger">
///       summary: |
///         Retrieves the graph representation of all entities similar to a seed string
///       parameters:
///         - $ref: '#/parameters/domainParam'
///         - name: requestObject
///           description: JSON object with a list of query-specific arguments
///           in: body
///           schema:
///             allOf:
///               - $ref: '#/definitions/RequestObject'
///               - type: object
///                 properties:
///                   string:
///                     description: seed string to start from
///                     type: string
///                     example: "banana"
///       responses:
///         200:
///           description: Successful response
/// </example>
ClassMethod GetSimilar(pDomainId As %Integer, pString As %String = "") As %Status
{

	set tSC = $$$OK
	$$$IKRESTINITDEBUG
	try {
		do ..ResolveDomainId(.pDomainId)
		set:%request.Content.%IsDefined("string") pString = %request.Content.string

		set tSC = ..ParseArgs(pDomainId,,, .tFilter, .tFilterMode, .tBlacklists)
		quit:$$$ISERR(tSC)

		set tSC = ##class(%iKnow.Queries.EntityAPI).GetSimilar(.tEntities, pDomainId, pString, 1, ..#PAGESIZE, tFilter, tFilterMode,, tBlacklists)
		quit:$$$ISERR(tSC)

		do ..TokenizeArray(.tEntityTokens, .tEntities, pString, .tSeedIndex, $lb("id","value","frequency","spread"), pDomainId, tFilter)
		if 'tSeedIndex {
			do ..TokenizeString(.tSeedTokens, pString)
			merge tEntityTokens(0) = tSeedTokens
			set tSeedIndex = 0
		} else {
			set tGraph(0,"ch",tSeedIndex)=""
		}
		set tAncestry(tSeedIndex)="",
			tGraph = 0
		set tSC = ..BuildGraph(.tGraph, .tEntityTokens, tSeedIndex, 0, 1, .tAncestry)
		quit:$$$ISERR(tSC)

		//k ^bdb
		//s ^bdb($i(^bdb)) = pString
		//m ^bdb("g") = tGraph
		//m ^bdb("t") = tEntities

		set tObjects = { "nodes": [], "edges": [] }
		set tSC = ..AppendChildObjects(.tObjects, .tGraph, .tEntityTokens, 0, 1)
		quit:$$$ISERR(tSC)
		
		set tSC = ..UpdateRelated(pDomainId, .tObjects, pString)
		
		set tResult = { "graph": (tObjects) }

	} catch (ex) {
		set tSC = ex.AsStatus()
	}
	quit ..%ProcessResult(tSC, $g(tResult))
}

/// <example language="swagger">
///       summary: |
///         Retrieves the graph representation of all entities related to a seed entity
///       parameters:
///         - $ref: '#/parameters/domainParam'
///         - name: entity
///           in: path
///           description: seed enitity
///           type: string
///           required: true
///           example: bananas
///       responses:
///         200:
///           description: Successful response
/// </example>
ClassMethod GetRelatedGET(pDomainId As %Integer, pEntity As %String = "") As %Status [ Internal ]
{
	quit ..GetRelated(pDomainId, pEntity)
}

/// <example language="swagger">
///       summary: |
///         Retrieves the graph representation of all entities related to a seed entity
///       parameters:
///         - $ref: '#/parameters/domainParam'
///         - name: requestObject
///           description: JSON object with a list of query-specific arguments
///           in: body
///           schema:
///             allOf:
///               - $ref: '#/definitions/RequestObject'
///               - type: object
///                 properties:
///                   entity:
///                     description: seed entity to start from
///                     type: string
///                     example: 'bananas'
///                   mode:
///                     type: string
///                     enum: ['proximity','direct']
///                     default: 'proximity'
///       responses:
///         200:
///           description: Successful response
/// </example>
ClassMethod GetRelated(pDomainId As %Integer, pEntity As %String = "") As %Status
{

	set tSC = $$$OK
	$$$IKRESTINITDEBUG
	try {
		do ..ResolveDomainId(.pDomainId)
		set:%request.Content.%IsDefined("entity") pEntity = %request.Content.entity
		set:'%request.Content.%IsDefined("mode") %request.Content.mode = "proximity"

		set tSC = ..ParseArgs(pDomainId,,, .tFilter, .tFilterMode, .tBlacklists)
		quit:$$$ISERR(tSC)

		if (%request.Content.mode = "proximity") {
			set tSC = ##class(%iKnow.Semantics.ProximityAPI).GetProfile(.tEntities, pDomainId, pEntity, 1, ..#PAGESIZE, tFilter, tBlacklists)
			quit:$$$ISERR(tSC)
		} else {
			set tSC = ##class(%iKnow.Queries.EntityAPI).GetRelated(.tEntities, pDomainId, pEntity, 1, ..#PAGESIZE, tFilter, tFilterMode,,,,, tBlacklists)
			quit:$$$ISERR(tSC)
		}

		do ..TokenizeArray(.tEntityTokens, .tEntities,,, $lb("id","value","score"), pDomainId, tFilter)
		set tGraph = 0
		set tSC = ..BuildGraph(.tGraph, .tEntityTokens, -1, 0, 1, .tAncestry)
		quit:$$$ISERR(tSC)

		//k ^bdb
		//s ^bdb($i(^bdb)) = pEntity
		//m ^bdb("g") = tGraph
		//m ^bdb("t") = tEntities

		set tObjects = { "nodes": [], "edges": [] }
		set tSC = ..AppendChildObjects(.tObjects, .tGraph, .tEntityTokens, 0, 1)
		quit:$$$ISERR(tSC)
		
		set tSC = ..UpdateRelated(pDomainId, .tObjects, pEntity)
		
		set tResult = { "graph": (tObjects) }

	} catch (ex) {
		set tSC = ex.AsStatus()
	}
	quit ..%ProcessResult(tSC, $g(tResult))
}

ClassMethod UpdateRelated(pDomainId As %Integer, ByRef pObjects As %DynamicObject, pEntity) As %Status
{
	#dim edges As %DynamicArray = pObjects.edges
	#dim nodes As %DynamicArray = pObjects.nodes
	
	set size = edges.%Size()-2 
	set i=0
	
	for
	{	
		quit:i>size
		
		set edge = edges.%Get(i)
		
		set nextEdge = edges.%Get(i+1)
		
		set sourceEdge = edge.source
		set targetEdge = edge.target
		
		set sourceNode = ..GetObjIdBySourceID(nodes, sourceEdge)
		set targetNode = ..GetObjIdBySourceID(nodes, targetEdge)
		
		set sourceNode = nodes.%Get(sourceNode)
		set targetNode = nodes.%Get(targetNode)
		
		set lableSource = $select(sourceEdge=0:pEntity, 1:sourceNode.label)
		set lableTarget = targetNode.label
		
		set stemSource = ##class(%iKnow.Queries.EntityAPI).GetStem(pDomainId, lableSource, "ru")
		set stemTarget = ##class(%iKnow.Queries.EntityAPI).GetStem(pDomainId, lableTarget, "ru")

		if stemSource = stemTarget
		{
			if (nextEdge.source '= targetEdge) && (i'=0)
			{
				do edges.%Remove(i)
				do nodes.%Remove(targetNode)
				set size = size - 1
				set i = i - 1
			}
			elseif (targetEdge '= nextEdge.source) && (sourceEdge = 0)
			{
				do edges.%Remove(i)
				do nodes.%Remove(targetNode)
				set size = size - 1
				set i = i - 1
			}
			elseif (targetEdge = nextEdge.source)
			{
				set obj = {
					"source": (sourceEdge),
					"target": (nextEdge.target),
					"type": "similar"
					}

				do edges.%Remove(i)
				do nodes.%Remove(targetNode)
				do edges.%Push(obj)
				set size = size - 1
				set i = i - 1

				do ..ChangeEdges(.edges, targetEdge, sourceEdge, i, size)
			}
		}
		set i = i + 1
	}
	do pObjects.%Set("edges",edges)
	do pObjects.%Set("nodes",nodes)
	
	quit $$$OK
}

ClassMethod ChangeEdges(ByRef Edges As %DynamicArray, target As %Integer, source As %Integer, i As %Integer, size As %Integer) As %Status
{
	while (i>size)
	{		
		set edge = Edges.%Get(i)
		
		set sourceEdge = edge.source
		set targetEdge = edge.target
		
		if (sourceEdge = target)
		{
			set obj = {
				"source": (source),
				"target": (targetEdge),
				"type": "similar"
		  	}	
			
			do Edges.%Remove(i)
			do Edges.%Push(obj)
			set size = size - 1
		}
		set i = i + 1
	}
	quit $$$OK
}

ClassMethod GetObjIdBySourceID(Nodes As %DynamicArray, source) As %Integer
{
	set iter = Nodes.%GetIterator()
	
	while iter.%GetNext(.key , .value ) 
	{
	      return:value.id=source key
	}
	
	return 0
}

ClassMethod AppendChildObjects(ByRef pObjects, ByRef pGraph, ByRef pEntityTokens, pParentNodeID As %Integer = 0, pLevel As %Integer = 1) As %Status
{
	set tSC = $$$OK
	try {
		set tNodeID = ""
		for {
			set tNodeID = $order(pGraph(pParentNodeID, "ch", tNodeID), 1, tEdgeType)
			quit:tNodeID=""

			set tEntIDx = pGraph(tNodeID)

			// skip if we already cover this further down in the tree
			continue:($g(pGraph("l",tEntIDx)) > pLevel)

			//s ^bdb($i(^bdb)) = $justify(" ",pLevel*2)_$e(tEdgeType)_" > "_pEntityTokens(tEntIDx)

			set tEntObj = {}
			set tProp = pEntityTokens(tEntIDx,0)
			for {
				set tProp = $order(pEntityTokens(tEntIDx,tProp),1,tPropValue)
				quit:tProp=""
				do tEntObj.%Set(tProp, tPropValue)
			}
			//set lable = ##class(%iKnow.Queries.EntityAPI).GetStem(1, pEntityTokens(tEntIDx), "ru")
			set tNodeObj = {"id": (tNodeID), "label": (pEntityTokens(tEntIDx)), "type": "entity", "entities": [ (tEntObj) ]}
			do pObjects.nodes.%Push(tNodeObj)
			set tEdgeObj = {"source": (pParentNodeID), "target": (tNodeID), "type": (tEdgeType)}
			do pObjects.edges.%Push(tEdgeObj)

			set tSC = ..AppendChildObjects(.pObjects, .pGraph, .pEntityTokens, tNodeID, pLevel+1)
			quit:$$$ISERR(tSC)
		}

	} catch (ex) {
		set tSC = ex.AsStatus()
	}
	quit tSC
}

/// builds the following graph structure:
/// graph = $i
/// graph(node_id) = ent_idx
/// graph("l", ent_idx) = highest level for this ent_idx
/// graph(node_id,"ch",child_node_id) = ""
ClassMethod BuildGraph(ByRef pGraph, ByRef pEntityTokens, pSeedIndex As %Integer = 0, pSeedID As %Integer = 0, pLevel As %Integer = 1, ByRef pAncestry) As %Status
{
	set tSC = $$$OK
	try {
		set i = ""
		for {
			set i = $order(pEntityTokens(i))
			quit:i=""
			continue:i=pSeedIndex
			continue:$d(pAncestry(i))

			if pSeedIndex<0 {
				set tEdge = "related"
			} elseif $$IsSimilar(pSeedIndex, i) {
				set tEdge = "similar"
			} else {
				// not similar, not root-related
				continue
			}

			if ($g(pGraph("l",i)) < pLevel) {
				set pGraph("l",i) = pLevel
			} else {
				// there's already a more deeply nested instance of this
				// entity, so we can skip
				continue
			}

			// add as child node
			set pGraph = pGraph+1
			set pGraph(pGraph) = i
			set pGraph(pSeedID,"ch",pGraph) = tEdge

			// look for children further down
			set pAncestry(i)=""
			set tSC = ..BuildGraph(.pGraph, .pEntityTokens, i, pGraph, pLevel+1, .pAncestry)
			quit:$$$ISERR(tSC)
			kill pAncestry(i)
		}
		quit:$$$ISERR(tSC)

	} catch (ex) {
		set tSC = ex.AsStatus()
	}
	quit tSC

IsSimilar(tOriginIndex, tDestIndex, mode="")
	if (mode="") {

		// if the origin has more words, it'll never match
		quit:pEntityTokens(tOriginIndex,0)>pEntityTokens(tDestIndex,0) 0

		// if the origin is not shorter, it'll never match
		// note that this also excludes identical strings
		quit:$l(pEntityTokens(tOriginIndex))>=$l(pEntityTokens(tDestIndex)) 0

		set similar = 1
		for posO = 1:1:pEntityTokens(tOriginIndex,0) {
			set similar = 0, length = $l(pEntityTokens(tOriginIndex,posO))
			for posD = 1:1:pEntityTokens(tDestIndex,0) {
				
				// for single-character tokens, require starting position
				if length=1 {
					set similar = ($e(pEntityTokens(tDestIndex,posD),1,length)=pEntityTokens(tOriginIndex,posO))
				} else {
					set similar = ''$find(pEntityTokens(tDestIndex,posD),pEntityTokens(tOriginIndex,posO))
				}
				
				quit:similar
			}
			quit:'similar
		}
		quit similar
	} else {
		quit 0
	}
}

ClassMethod TokenizeArray(Output pTokens, ByRef pEntities, pSeedString As %String = "", Output pSeedIndex As %Integer, pDescriptor As %List = {$lb("id","value","frequency","spread")}, pDomainId As %Integer = 0, pFilter As %iKnow.Filters.Filter = "") [ Internal, Private ]
{
	kill pTokens
	set pSeedIndex = 0
	set tDescriptor = $ll(pDescriptor)
	for i = 1:1:tDescriptor {
		if $ld(pDescriptor,i,tLabel) && (tLabel'="") {
			set:tLabel="value" tValueIndex = i
			set tDescriptor(i) = tLabel
		}
	}
	set i = ""
	for {
		set i = $order(pEntities(i), 1, tEntity)
		quit:i=""

		set ptr=0, j=0
		while $listnext(tEntity,ptr,tValue) {
			set j=j+1
			continue:'$d(tDescriptor(j),tLabel)
			set pTokens(i,tLabel) = tValue
		}

		if pDomainId && $g(pTokens(i,"id")) {
			if '$d(pTokens(i,"frequency")) {
				set pTokens(i,"frequency") = ##class(%iKnow.Queries.EntityAPI).GetFrequency(pDomainId, pTokens(i,"id"),,, pFilter)
			}
			if '$d(pTokens(i,"spread")) {
				set pTokens(i,"spread") = ##class(%iKnow.Queries.EntityAPI).GetSpread(pDomainId, pTokens(i,"id"),, pFilter)
			}
		}

		set pTokens(i) = $lg(tEntity,tValueIndex),
			pTokens(i,0) = $l(pTokens(i)," ")
		for j = 1:1:pTokens(i,0) {
			set pTokens(i,j) = $p(pTokens(i)," ",j)
		}
		set:pTokens(i)=pSeedString pSeedIndex = i
	}
}

ClassMethod TokenizeString(Output pTokens, pString As %String)
{
	kill pTokens
	set pTokens = pString,
		pTokens(0) = $l(pString," ")
	for j = 1:1:pTokens(0) {
		set pTokens(j) = $p(pString," ",j)
	}
}

/// Enforce utf-8
ClassMethod %ProcessResult(pSC As %Status, pResult As %DynamicObject = "") As %Status [ Internal ]
{
	set %response.CharSet = "utf-8"
	quit ##super(pSC, pResult)
}

}

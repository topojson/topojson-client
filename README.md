# TopoJSON Client

**TopoJSON** is an extension of GeoJSON that encodes topology. Rather than representing geometries discretely, geometries in TopoJSON files are stitched together from shared line segments called *arcs*. This technique is similar to [Matt Bloch’s MapShaper](http://www.cartogis.org/docs/proceedings/2006/bloch_harrower.pdf
) and the [Arc/Info Export format, .e00](http://indiemaps.com/blog/2009/02/e00parser-an-actionscript-3-parser-for-the-arcinfo-export-topological-gis-format/).

TopoJSON eliminates redundancy, allowing related geometries to be stored efficiently in the same file. For example, the shared boundary between California and Nevada is represented only once, rather than being duplicated for both states. A single TopoJSON file can contain multiple feature collections without duplication, such as states and counties. Or, a TopoJSON file can efficiently represent both polygons (for fill) and boundaries (for stroke) as two feature collections that share the same arc mesh.

As a result, TopoJSON is substantially more compact than GeoJSON. The above shapefile of U.S. counties is 2.2M as a GeoJSON file, but only [436K](https://bl.ocks.org/mbostock/4090870) as a boundary mesh, a reduction of 80.4% even without simplification. TopoJSON can also be more efficient to render since shared control points need only be projected once. To further reduce file size, TopoJSON uses fixed-precision delta-encoding for integer coordinates rather than floats. This is similar to rounding coordinate values (e.g., [LilJSON](https://github.com/migurski/LilJSON)), but with greater precision. Like GeoJSON, TopoJSON files are easily modified in a text editor and amenable to gzip compression.

Lastly, encoding topology has numerous useful applications for maps and visualization. It allows [topology-preserving shape simplification](https://bost.ocks.org/mike/simplify/), which ensures that adjacent features remain connected after simplification; this applies even across feature collections, such as simultaneous consistent simplification of state and county boundaries. Topology can also be used for [Dorling](http://www.ncgia.ucsb.edu/projects/Cartogram_Central/types.html) or [hexagonal cartograms](http://pitchinteractive.com/latest/tilegrams-more-human-maps/), as well as other techniques that need shared boundary information such as [automatic map coloring](https://bl.ocks.org/4188334).

## Installing

If you use NPM, `npm install topojson-client`. Otherwise, download the [latest release](https://github.com/topojson/topojson-client/releases/latest). You can also load directly from [d3js.org](https://d3js.org) as a [standalone library](https://d3js.org/topojson.v1.min.js). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `topojson` global is exported:

```html
<script src="https://d3js.org/topojson.v1.min.js"></script>
<script>

var feature = topojson.feature(topology, topology.objects.foo);

</script>
```

The TopoJSON client API is implemented using ES2015 modules. In compatible environments, you can import the library as a namespace, like so:

```js
import * as topojson from "topojson";
```

[Try topojson-client in your browser.](https://tonicdev.com/npm/topojson-client)

# API Reference

<a name="feature" href="#feature">#</a> topojson.<b>feature</b>(<i>topology</i>, <i>object</i>) [<>](https://github.com/topojson/topojson-client/blob/master/src/feature.js "Source")

Returns the GeoJSON Feature or FeatureCollection for the specified *object* in the given *topology*. If the specified object is a GeometryCollection, a FeatureCollection is returned, and each geometry in the collection is mapped to a Feature. Otherwise, a Feature is returned.

Some examples:

* A point is mapped to a feature with a geometry object of type “Point”.
* Likewise for line strings, polygons, and other simple geometries.
* A null geometry object (of type null in TopoJSON) is mapped to a feature with a null geometry object.
* A geometry collection of points is mapped to a feature collection of features, each with a point geometry.
* A geometry collection of geometry collections is mapped to a feature collection of features, each with a geometry collection.

See [feature-test.js](https://github.com/topojson/topojson-client/blob/master/test/feature-test.js) for more examples.

<a name="merge" href="#merge">#</a> topojson.<b>merge</b>(<i>topology</i>, <i>objects</i>) [<>](https://github.com/topojson/topojson-client/blob/master/src/merge.js#L5 "Source")

Returns the GeoJSON MultiPolygon geometry object representing the union for the specified array of Polygon and MultiPolygon *objects* in the given *topology*. Interior borders shared by adjacent polygons are removed. See [Merging States](https://bl.ocks.org/mbostock/5416405) for an example.

<a name="mergeArcs" href="#mergeArcs">#</a> topojson.<b>mergeArcs</b>(<i>topology</i>, <i>objects</i>) [<>](https://github.com/topojson/topojson-client/blob/master/src/merge.js#L9 "Source")

Equivalent to [topojson.merge](#merge), but returns TopoJSON rather than GeoJSON.

<a name="mesh" href="#mesh">#</a> topojson.<b>mesh</b>(<i>topology</i>[, <i>object</i>[, <i>filter</i>]]) [<>](https://github.com/topojson/topojson-client/blob/master/src/mesh.js#L4 "Source")

Returns the GeoJSON MultiLineString geometry object representing the mesh for the specified *object* in the given *topology*. This is useful for rendering strokes in complicated objects efficiently, as edges that are shared by multiple features are only stroked once.

If *object* is not specified, a mesh of the entire topology is returned.

An optional *filter* function may be specified to prune arcs from the returned mesh using the topology. The filter function is called once for each candidate arc and takes two arguments, *a* and *b*, two geometry objects that share that arc. Each arc is only included in the resulting mesh if the filter function returns true. For typical map topologies the geometries *a* and *b* are adjacent polygons and the candidate arc is their boundary. If an arc is only used by a single geometry then *a* and *b* are identical. This property is useful for separating interior and exterior boundaries; an easy way to produce a mesh of interior boundaries is:

```js
var interiors = topojson.mesh(topology, object, function(a, b) { return a !== b; });
```

See this [county choropleth](https://bl.ocks.org/mbostock/4060606) for example. Note: the *a* and *b* objects are TopoJSON objects (pulled directly from the topology), and not automatically converted to GeoJSON features as by [topojson.feature](#feature).

<a name="meshArcs" href="#meshArcs">#</a> topojson.<b>meshArcs</b>(<i>topology</i>[, <i>object</i>[, <i>filter</i>]]) [<>](https://github.com/topojson/topojson-client/blob/master/src/mesh.js#L8 "Source")

Equivalent to [topojson.mesh](#mesh), but returns TopoJSON rather than GeoJSON.

<a name="neighbors" href="#neighbors">#</a> topojson.<b>neighbors</b>(<i>objects</i>) [<>](https://github.com/topojson/topojson-client/blob/master/src/neighbors.js "Source")

Returns an array representing the set of neighboring objects for each object in the specified *objects* array. The returned array has the same number of elements as the input array; each element *i* in the returned array is the array of indexes for neighbors of object *i* in the input array. For example, if the specified objects array contains the features *foo* and *bar*, and these features are neighbors, the returned array will be \[\[1\], \[0\]\], indicating that *foo* is a neighbor of *bar* and *vice versa*. Each array of neighbor indexes for each object is guaranteed to be sorted in ascending order.

For a practical example, see the [world map](https://bl.ocks.org/mbostock/4180634) with topological coloring.

<a name="presimplify" href="#presimplify">#</a> topojson.<b>presimplify</b>(<i>topojson</i>[, <i>triangleArea</i>]) [<>](https://github.com/topojson/topojson-client/blob/master/src/presimplify.js "Source")

… See the [dynamic simplification](https://bl.ocks.org/mbostock/6245977) example.

## Command Line Reference

<a name="topo2geo" href="#topo2geo">#</a> <b>topo2geo</b> [<i>options…</i>] &lt;name=file&gt;… [<>](https://github.com/topojson/topojson-client/blob/master/bin/topo2geo "Source")

Converts one or more TopoJSON objects from an input topology to one or more GeoJSON features. For example, to convert the “states” TopoJSON GeometryCollection object in us-10m.json to a GeoJSON feature collection in us-states-10m.json:

```
topo2geo states=us-states-10m.json < us-10m.json
```

For convenience, you can omit the file name and specify only the object *name*; the output file will be *name*.json. For example, to output to states.json:

```
topo2geo states < us-10m.json
```

To list the available object names, use [--list](#topo2geo_list).

<a name="topo2geo_help" href="#topo2geo_help">#</a> topo2geo <b>-h</b>
<br><a href="#topo2geo_help">#</a> topo2geo <b>--help</b>

Output usage information.

<a name="topo2geo_version" href="#topo2geo_version">#</a> topo2geo <b>-V</b>
<br><a href="#topo2geo_version">#</a> topo2geo <b>--version</b>

Output the version number.

<a name="topo2geo_newline_delimited" href="#topo2geo_newline_delimited">#</a> topo2geo <b>-n</b>
<br><a href="#topo2geo_newline_delimited">#</a> topo2geo <b>--newline-delimited</b>

Output [newline-delimited JSON](http://ndjson.org/), with one feature per line.

<a name="topo2geo_in" href="#topo2geo_in">#</a> topo2geo <b>-i</b> <i>file</i>
<br><a href="#topo2geo_in">#</a> topo2geo <b>--in</b> <i>file</i>

Specify the input TopoJSON file name. Defaults to “-” for stdin.

<a name="topo2geo_list" href="#topo2geo_list">#</a> topo2geo <b>-l</b>
<br><a href="#topo2geo_list">#</a> topo2geo <b>--list</b>

List the names of the objects in the input topology, and then exit. For example, this:

```
topo2geo -l < us-10m.json
```

Will output this:

```
counties
states
land
```

'use strict';

let container;
let pickedColor = '0xff0000';
let v, rawData;
let vertexViz=true, edgeViz=true, facetViz = true; 


function updatePickedColor() {
	$('#colorpicker').farbtastic(function(color) {
		pickedColor = color.replace('#','0x');
    });
}

function switchRotation() {
	v.rotate = !v.rotate
}

function vertexVisible() {
	vertexViz = !vertexViz;
	v.setVisible(v.vertices,vertexViz)
}

function edgeVisible() {
	edgeViz = !edgeViz;
	v.setVisible(v.edges,edgeViz)
}

function facetVisible() {
	facetViz = !facetViz;
	v.setVisible(v.facets,facetViz);
}

function resetPolytope() {
	for (let face of v.facets) {
		face.color = face.abstract.color;
		face.defaultColor();
	}
	v.setVisible(v.vertices,true);
	v.setVisible(v.edges,true);
	v.setVisible(v.facets,true);
}

function savePolytope() {
	//convert to JSON format
	let vertices, edges = [];
	let facets = [];
	let colors = [];
	let ids;
	for (let facet of v.facets) {
		colors.push(facet.color!==v.facetColor ? facet.color : null)
		ids = [];
		for (let vertex of facet.abstract.vertices) {
			ids.push(vertex.id)
		}
		facets.push(ids)	
	}
	
	let json = 
		{ 	"vertices": rawData.vertices,
			"edges":	rawData.edges,
			"facets":	facets,
			"colors":	colors 
		}
		console.log(json)
}



function initViewer(data, mobile) {
	rawData = Object.assign({},data);
    let coordinates = createData(data);
    container = document.getElementById("viewer");
    let viewer = new PolytopeViewer(container,mobile);
    v = viewer;
    viewer.rotate=true;

    //add polytope to viewer
    viewer.setPolytope(coordinates.vertices, coordinates.edges, coordinates.facets);
    for(let vertex of viewer.vertices) {
		vertex.active = false 
	}
	
	for(let edge of viewer.edges) {
		edge.active = false
	}
    viewer.selection = false;
    

    viewer.onObjectHover(function(object) {
        viewer.highlightColor = pickedColor;
    });
    
    viewer.onObjectClick(function(object) {
        object.color = pickedColor
        object.defaultColor();
    });
    
    

	

}


function createViewer(id,mobile) {
    $.ajax({
        url: "src/json/Polyhedron_"+id+".json",
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown){alert(errorThrown)}  
    }).done(function ( data ) { initViewer(data,mobile) } );
}


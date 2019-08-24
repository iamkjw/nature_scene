var canvas, gl, program;

var NumVertices = 36;

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.2, 0.0, 1.0 ),  // darker
    vec4( 0.0, 0.2, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 0.5, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.2, 0.0, 1.0 ),  // blue
    vec4( 0.0, 0.2, 0.0, 1.0 ),  // magenta
    vec4( 0.0, 0.3, 0.0, 1.0 ),  // dark green
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 0.5, 0.35, 0.05, 1.0), // brown
    vec4( 0.4, 0.25, 0.05, 1.0),  // dark brown
    vec4( 1.0, 1.0, 0.0, 1.0)//yellow
];

var cone_vertices = [
    vec4(1.0,  0.0,  0.0,  1.0),
    vec4(0.0,  0.0, -1.0,  1.0),
    vec4(1.0,  0.0, -1.0,  1.0),
    vec4(0.0,  0.0,  0.0,  1.0),
    vec4(0.5,  1.0, -0.5,  1.0)
];

var BASE_HEIGHT      = 1.0;
var BASE_WIDTH       = 10.0;

var TREE_HEIGHT      = 1.0;
var TREE_WIDTH       = 0.3;

var CONE_HEIGHT      = 3.0;
var CONE_WIDTH       = 1.0;

var SUN_HEIGHT       = 1.0;
var SUN_WIDTH        = 1.0;

// Shader transformation matrices

var modelViewMatrix = mat4();
var projectionMatrix;

var angle = 0;
var angle2 = 0;
var angle3 = 1;

var sun_loc = 0.0;

var brightness = vec4(0.0, 0.0, 0.0, 1.0);

function quad(  a,  b,  c,  d,  e) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}

function quade(  a,  b,  c,  d,  e) {
    colors.push(vertexColors[e]);
    points.push(vertices[a]);
    colors.push(vertexColors[e]);
    points.push(vertices[b]);
    colors.push(vertexColors[e]);
    points.push(vertices[c]);
    colors.push(vertexColors[e]);
    points.push(vertices[a]);
    colors.push(vertexColors[e]);
    points.push(vertices[c]);
    colors.push(vertexColors[e]);
    points.push(vertices[d]);
}

function triangle ( a, b, c, d){
    colors.push(vertexColors[d]);
    points.push(cone_vertices[a]);
    colors.push(vertexColors[d]);
    points.push(cone_vertices[b]);
    colors.push(vertexColors[d]);
    points.push(cone_vertices[c]);
}

function push() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    quade( 1, 0, 3, 2, 8 );
    quade( 2, 3, 7, 6, 9 );
    quade( 3, 0, 4, 7, 8 );
    quade( 6, 5, 1, 2, 9 );
    quade( 4, 5, 6, 7, 8 );
    quade( 5, 4, 0, 1, 9 );

    triangle(0, 1, 2, 3);
    triangle(0, 2, 3, 3);
    triangle(0, 1, 4, 6);
    triangle(0, 3, 4, 3);
    triangle(2, 3, 4, 6);
    triangle(1, 2, 4, 3);

    quade( 1, 0, 3, 2, 10 );
    quade( 2, 3, 7, 6, 10 );
    quade( 3, 0, 4, 7, 10 );
    quade( 6, 5, 1, 2, 10 );
    quade( 4, 5, 6, 7, 10 );
    quade( 5, 4, 0, 1, 10 );
}


window.addEventListener("keydown", getKey, false);

function getKey(key){
  if (key.key == "ArrowRight"){
    angle += 3;
  }
  if (key.key == "ArrowLeft"){
    angle -= 3;
  }
  if (key.key == "ArrowUp"){
    angle2 += 0.1;
  }
  if (key.key == "ArrowDown"){
    angle2 -= 0.1;
  }
  if (key.key == "z"){
    if(sun_loc < 5){
      sun_loc += 1.2;
      brightness[0] += 0.05;
      brightness[1] += 0.05;
      brightness[2] += 0.05;
    }
  }
  if (key.key == "x"){
    if(sun_loc > -5){
      sun_loc -= 1.2;
      brightness[0] -= 0.05;
      brightness[1] -= 0.05;
      brightness[2] -= 0.05;
    }
  }
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    push();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    a = gl.getUniformLocation(program,"brightness");

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    modelViewMatrix = rotate(angle, 0, 1, 0 );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}

function base() {
    var s = scalem(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function trunk(x, y) {
    var s = scalem(TREE_WIDTH, TREE_HEIGHT, TREE_WIDTH);
    var instanceMatrix = mult(translate( x * 2, 0.5 * TREE_HEIGHT, y * 2 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, NumVertices, 36 );
}

function cone(x, y) {
  var s = scalem(CONE_WIDTH, CONE_HEIGHT, CONE_WIDTH);
  var instanceMatrix = mult( translate( x * 2, 0.5 * CONE_HEIGHT, y * 2 ), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays( gl.TRIANGLES, 72, 18 );
}

function sun() {
    var s = scalem(SUN_WIDTH, SUN_HEIGHT, SUN_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * SUN_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 90, NumVertices );
}

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.uniform4fv(a, flatten(brightness));

    modelViewMatrix = rotate(angle, angle2, angle3, 0 );

    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));

    for (var i = -2; i < 3; i++){
      for (var j = -2; j < 3; j++){
        trunk(i, j);
      }
    }

    modelViewMatrix  = mult(modelViewMatrix, translate(-0.5, -0.5, 0.5));

    for (var i = -2; i < 3; i++){
      for (var j = -2; j < 3; j++){
        cone(i, j);
      }
    }

    modelViewMatrix = mat4();
    modelViewMatrix  = mult(modelViewMatrix, translate(-0.5, sun_loc, -6.0));

    if(sun_loc > -1){
      sun();
    }

    requestAnimFrame(render);
}

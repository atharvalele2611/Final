'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // GLSL programs
  let gP;
  let tP;
  let grP;
    // textures
    let woodTex;
    let skyTex;
    let baseTex;
    let ballTex;

  let nowShowing = 'Vertex';
  // VAOs for the objects
  var head = null;
  var sky = null;
  var base = null;
  var floor = null;
  var lampRods = null;
  var attachment = null;
  var lampHead = null;

  // rotation
  var angles = [90.0, 90.0, 0.0];
 
//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {
    head = new Sphere( 40, 40);
    sky = new Cube( 30 );
    base = new Cube( 10 );
    lampRods = new Cylinder(40,40);
    attachment = new Cylinder(40,40);
    lampHead = new Cone(20, 20);
    floor = new Cube( 10 );
    head.VAO = bindVAO (head, tP);
    sky.VAO = bindVAO( sky, tP );
    base.VAO = bindVAO( base, tP );
    floor.VAO = bindVAO( floor, tP );
    lampHead.VAO = bindVAO(lampHead, tP);
    attachment.VAO = bindVAO(attachment, tP);
}

//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
    gl.useProgram (program);
    let projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projMatrix, radians(70), 1, 3, 100);
    gl.uniformMatrix4fv (program.uProjT, false, projMatrix);
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [2.4, 2, -11], [0, 2, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
}


function fetchWoodTx(){
  woodTex = gl.createTexture();
  var woodImage = document.getElementById ('wood-texture')
  woodImage.crossOrigin = "";
  let lvl = 0;
  let type = gl.UNSIGNED_BYTE;
  let border = 0;
  let intFormat = gl.RGBA;
  let width = woodImage.width;
  let height = woodImage.height;
  let format = gl.RGBA;
  gl.bindTexture(gl.TEXTURE_2D, woodTex );
   gl.texImage2D(
    gl.TEXTURE_2D,
    lvl,
    intFormat,
    width,
    height,
    border,
    format,
    type,
    woodImage
  );
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}


function fetchSkyTx(){
  skyTex = gl.createTexture();
  var skyImg = document.getElementById('sky-texture');
  skyImg.crossOrigin = "";

  let lvl = 0;
  let type = gl.UNSIGNED_BYTE;
  let intFormat = gl.RGBA;
  let width = skyImg.width;
  let height = skyImg.height;
  let format = gl.RGBA;
  let border = 0;
  gl.bindTexture(gl.TEXTURE_2D, skyTex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    lvl,
    intFormat,
    width,
    height,
    border,
    format,
    type,
    skyImg
  );    

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

function fetchBaseTx(){
  baseTex = gl.createTexture();
  var baseImg = document.getElementById('base-texture');
  baseImg.crossOrigin = "";
  let lvl = 0;
  let type = gl.UNSIGNED_BYTE;
  let intFormat = gl.RGBA;
  let width = baseImg.width;
  let height = baseImg.height;
  let format = gl.RGBA;
  let border = 0;
  gl.bindTexture(gl.TEXTURE_2D, baseTex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    lvl,
    intFormat,
    width,
    height,
    border,
    format,
    type,
    baseImg
  );    

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

function fetchHeadTx(){
  ballTex = gl.createTexture();
  var ballImg = document.getElementById('head-texture');
  ballImg.crossOrigin = "";
  let lvl = 0;
  let type = gl.UNSIGNED_BYTE;
  let intFormat = gl.RGBA;
  let width = ballImg.width;
  let height = ballImg.height;
  let border = 0;
  let format = gl.RGBA;
  gl.bindTexture(gl.TEXTURE_2D, ballTex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    lvl,
    intFormat,
    width,
    height,
    border,
    format,
    type,
    ballImg
  );    
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures(){
    
    // flip Y for WebGL
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
    getAllTextures();
}

function getAllTextures(){
  fetchWoodTx();
  fetchSkyTx();
  fetchBaseTx();
  fetchHeadTx();
}

function transformWithType( mIn, mO, type, x, y, z, rad ) {
  if ( type == 't' ) {
    glMatrix.mat4.translate( mO, mIn, [x, y, z]);
  } else if( type == 's' ) {
        glMatrix.mat4.scale( mO, mIn, [x, y, z] );
    }   else if( type == 'rx' ) {
        glMatrix.mat4.rotateX( mO, mIn, rad );
    } else if( type == 'ry' ) {
        glMatrix.mat4.rotateY( mO, mIn, rad );
    } else if( type == 'rz' ) {
        glMatrix.mat4.rotateZ( mO, mIn, rad );
    }
    return mO;
}

//
//  This function draws all of the shapes required for your scene
//
    function drawShapes() {
        let hM = glMatrix.mat4.create();
        let bM = glMatrix.mat4.create();
        let sM = glMatrix.mat4.create();
        let baM = glMatrix.mat4.create();
        let cM = glMatrix.mat4.create();
        let aM = glMatrix.mat4.create();
        let coM = glMatrix.mat4.create();
        var program;
        program = tP;
        gl.useProgram(program);
        bindFloor(bM,program)
        bindBall(hM,program);
        bindSky(sM,program)
        bindCylinder(cM,program)
        bindAttachement(aM,program)
        bindCone(coM,program);
        bindBase(baM,program);
  }

  function bindBall(hM,program){
    transformWithType(hM, hM, 't', 0.1, -1.0, -5);
    transformWithType(hM, hM, 's', 1, 1, 1, 0);
    gl.activeTexture (gl.TEXTURE3);
    gl.bindTexture (gl.TEXTURE_2D, ballTex);
    gl.uniform1i (program.uTheTexture, 3);
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.uniformMatrix4fv (program.uModelT, false, hM);
    gl.uniform4fv (program.colorChange, [.3,.3,.4,1]);
    gl.bindVertexArray(head.VAO);
    gl.drawElements(gl.TRIANGLES, head.indices.length, gl.UNSIGNED_SHORT, 0);

  }

  function bindFloor(bM,program){
    transformWithType( bM, bM, 'ry', 0, 0, 0, radians(165) );
    transformWithType( bM, bM, 't', 5, -2.5, 4, 1);
    transformWithType( bM, bM, "s", 50, 0.21, 10, 5);   
    gl.activeTexture (gl.TEXTURE0);
    gl.bindTexture (gl.TEXTURE_2D, woodTex);
    gl.uniform1i (program.uTheTexture, 0);
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.uniformMatrix4fv (program.uModelT, false, bM);
    gl.uniform4fv (program.colorChange, [.4,.4,.4,1]);
    gl.bindVertexArray(floor.VAO);
    gl.drawElements(gl.TRIANGLES, floor.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function bindSky(sM,program){
    transformWithType( sM, sM, 'rx', 0,0,0, radians(0));
    transformWithType(sM, sM, 't', 0,10,20,0);
    transformWithType(sM, sM, 's', 50,70,10,0);
    transformWithType( sM, sM, 'rz', 0,0,0, radians(-180));
    gl.activeTexture (gl.TEXTURE1);
    gl.bindTexture (gl.TEXTURE_2D, skyTex);
    gl.uniform1i (program.uTheTexture, 1);
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.uniformMatrix4fv (program.uModelT, false, sM);
    gl.uniform4fv (program.colorChange, [.3,.3,.4,1]);
    gl.bindVertexArray(sky.VAO);
    gl.drawElements(gl.TRIANGLES, sky.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function bindCylinder(cM,program){
    transformWithType(cM, cM, "t", 3,-1.25,-5);
    transformWithType(cM, cM, "s", 2.5,-0.750, 0,0);
    transformWithType(cM, cM, "ry", 0,0,0, radians(-9))
    transformWithType(cM, cM, "rz", 0,0,0, radians(-12))

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture (gl.TEXTURE_2D, baseTex);
    gl.uniform1i (program.uTheTexture, 3);
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.uniformMatrix4fv (program.uModelT, false, cM);
    gl.uniform4fv (program.colorChange, [.3,.3,.4,1]);
    gl.bindVertexArray(lampRods.VAO);
    gl.drawElements(gl.TRIANGLES, lampRods.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function bindAttachement(aM,program){
    transformWithType(aM, aM, "t",1.5,5.0,0.0);
    transformWithType(aM, aM, "s", 2.5,-0.750, 0,0);
    transformWithType( aM, aM, 'rx', 0,0,0, radians(45));
    transformWithType(aM, aM, "ry", 0,0,0, radians(-45));
    transformWithType(aM, aM, "rz", 0,0,0, radians(-45));
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture (gl.TEXTURE_2D, baseTex);
    gl.uniform1i (program.uTheTexture, 3);
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.uniformMatrix4fv (program.uModelT, false, aM);
    gl.uniform4fv (program.colorChange, [.3,.3,.4,1]);
    gl.bindVertexArray(attachment.VAO);
    gl.drawElements(gl.TRIANGLES, attachment.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function bindCone(coM,program){
    transformWithType(coM, coM, 't', 1, 3.0, -4.5);
    transformWithType(coM, coM, 's', 2, 2, 1, 0);
    transformWithType(coM, coM, "rx", 0,0,0,radians(-20));
    transformWithType(coM, coM, "rz", 0,0,0,radians(-15));
    gl.activeTexture (gl.TEXTURE3);
    gl.bindTexture (gl.TEXTURE_2D, baseTex);
    gl.uniform1i (program.uTheTexture, 3);
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.uniformMatrix4fv (program.uModelT, false, coM);
    gl.uniform4fv (program.colorChange, [.3,.3,.4,1]);
    gl.bindVertexArray(lampHead.VAO);
    gl.drawElements(gl.TRIANGLES, lampHead.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function bindBase(baM,program){
    transformWithType( baM, baM, 't', 2.85,-.65, -1,0);
    transformWithType( baM, baM, 's', 1,3.5,2,0);
    gl.activeTexture (gl.TEXTURE2);
    gl.bindTexture (gl.TEXTURE_2D, baseTex);
    gl.uniform1i (program.uTheTexture, 2);
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.uniformMatrix4fv (program.uModelT, false, baM);
    gl.uniform4fv (program.colorChange, [.4,.4,.5,1]);
    gl.bindVertexArray(base.VAO);
    gl.drawElements(gl.TRIANGLES, base.indices.length, gl.UNSIGNED_SHORT, 0);
    transformWithType( baM, baM, 't', -0.1,1.0, -1.2);
    transformWithType( baM, baM, 's', 0.5,0.8,0.2);
    transformWithType(baM, baM, "rx", 0,0,0,radians(0));
    transformWithType(baM, baM, "ry", 0,0,0,radians(-135));
    transformWithType(baM, baM, "rz", 0,0,0,radians(-180));
    gl.activeTexture (gl.TEXTURE2);
    gl.bindTexture (gl.TEXTURE_2D, baseTex);
    gl.uniform1i (program.uTheTexture, 2);
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    gl.uniformMatrix4fv (program.uModelT, false, baM);
    gl.uniform4fv (program.colorChange, [.4,.4,.5,1]);
    gl.bindVertexArray(base.VAO);
    gl.drawElements(gl.TRIANGLES, base.indices.length, gl.UNSIGNED_SHORT, 0);
  }


  //
  // Use this function to create all the programs that you need
  // You can make use of the auxillary function initProgram
  // which takes the name of a vertex shader and fragment shader
  //
  // Note that after successfully obtaining a program using the initProgram
  // function, you will beed to assign locations of attribute and unifirm variable
  // based on the in variables to the shaders.   This will vary from program
  // to program.
  //
  function initPrograms() {
      gP = initProgram( "vertex-shader", "fragment-shader");
      grP = initProgram('sphereMap-V', 'gradientMap-F');
      tP = initProgram('sphereMap-V', 'sphereMap-F');
  }

  // creates a VAO and returns its ID
  function bindVAO (shape, program) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      bindBuffer(shape,program);
      clean();
      return theVAO;
  }

  function clean(){
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

function bindBuffer(shape,program){
  let myVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  if(program == grP){
    let b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aNormal);
    gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
  }
  else if( program == tP ) {
    let b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aNormal);
    gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
    let ub = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ub);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aUV);
    gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);
  } 
  else if( program == gP) {
    // create and bind bary buffer
    let b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aNormal);
    gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
  } 

  let myIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);
}

function setUpPhong(program, color, lightPosition) {
    gl.useProgram (program);
    var lightPos = [lightPosition[0], lightPosition[1], lightPosition[2]];
    var ambLight = [10, .6, .8];
    var lightClr = [color[0], color[1], color[2]];
    var baseClr = [.1, .2, .2];
    var Ka = 1;
    var Kd = 2;
    var Ks = 2;
    var Ke = .4;
    
    gl.uniform3fv( program.ambientLight, ambLight);
    gl.uniform3fv( program.lightPosition, lightPos );
    gl.uniform3fv( program.lightColor, lightClr );
    gl.uniform3fv( program.baseColor, baseClr );
    gl.uniform1f( program.ka, Ka);
    gl.uniform1f( program.kd, Kd);
    gl.uniform1f( program.ks, Ks);
    gl.uniform1f( program.ke, Ke); 
}

function setUpTexturePhong(program) {
    gl.useProgram (program);
    var lightPos = [-3, 4, 4];
    var ambLight = [.4, .4, .4];
    var lightClr = [1, 1, 1];
    var baseClr = [.4, .4, .4];
    var Ka = 1;
    var Kd = 2;
    var Ks = 2;
    var Ke = .4;
    gl.uniform3fv( program.ambientLight, ambLight);
    gl.uniform3fv( program.lightPosition, lightPos );
    gl.uniform3fv( program.lightColor, lightClr );
    gl.uniform3fv( program.baseColor, baseClr );
    gl.uniform1f( program.ka, Ka);
    gl.uniform1f( program.kd, Kd);
    gl.uniform1f( program.ks, Ks);
    gl.uniform1f( program.ke, Ke); 
}

/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

  // Given an id, extract the content's of a shader script
  // from the DOM and return the compiled shader
  function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }


  //
  // compiles, loads, links and returns a program (vertex/fragment shader pair)
  //
  // takes in the id of the vertex and fragment shaders (as given in the HTML file)
  // and returns a program object.
  //
  // will return null if something went wrong
  //
  function initProgram(vertex_id, fragment_id) {
    const vertexShader = getShader(vertex_id);
    const fragmentShader = getShader(fragment_id);

    // Create a program
    let program = gl.createProgram();
      
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }

    gl.useProgram(program);
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aNormal = gl.getAttribLocation(program, 'aNormal');
    program.aUV = gl.getAttribLocation( program, 'aUV');
    program.uTheTexture = gl.getUniformLocation (program, 'theTexture');
    program.uTheta = gl.getUniformLocation (program, 'theta');
    program.colorChange = gl.getUniformLocation( program, 'colorChange');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
    program.ambientLight = gl.getUniformLocation (program, 'ambientLight');
    program.lightPosition = gl.getUniformLocation (program, 'lightPosition');
    program.lightColor = gl.getUniformLocation (program, 'lightColor');
    program.baseColor = gl.getUniformLocation (program, 'baseColor');
    program.specHighlightColor = gl.getUniformLocation (program, 'specHighlightColor');
    program.ka = gl.getUniformLocation (program, 'ka');
    program.kd = gl.getUniformLocation (program, 'kd');
    program.ks = gl.getUniformLocation (program, 'ks');
    program.ke = gl.getUniformLocation (program, 'ke');
    return program;
  }
  

  //
  // We call draw to render to our canvas
  //
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    

      // draw your shapes
      drawShapes();
    
    
    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    initPrograms();
    
  

    // create and bind your current object
    createShapes();
      
    setUpTextures();
      
    setUpCamera(gP);
    setUpCamera(tP);
   
    // setUpCamera(perVertexProgram);
    // setUpCamera(perFragmentProgram);
      
    // set up Phong parameters (light Color, light Position)
    setUpPhong(gP, [.2, .4, .6], [20, -2, 10]);
    
    // setUpPhong(perVertexProgram);
    // setUpPhong(perFragmentProgram);

    setUpTexturePhong(tP);
    
    // do a draw
    draw();
  }

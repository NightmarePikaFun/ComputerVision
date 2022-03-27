var cubeRotationY = 0.0;
var cubeRotationZ = 0.0;
var bright1 = 1.0;
var bright2 = 0.0;
var colorBright= 0.0;
var cubeNumber = 0;

main();

function main() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const vsSource = `
    attribute float firstBright;
    attribute float secondBright;
    attribute float colorBright;
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec2 textCord;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;

    varying highp vec2 vTextCord;
    varying highp float fB;
    varying highp float sB;
    varying highp float cB; 
    
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextCord = textCord;
      vColor = aVertexColor;
      fB = firstBright;
      sB = secondBright;
      cB = colorBright;
    }
    `;

    const fsSource = `
    varying lowp vec4 vColor;
    varying highp vec2 vTextCord;
    varying highp float fB;
    varying highp float sB;
    varying highp float cB; 
    
    uniform sampler2D uSampler;
    uniform sampler2D uSampler2;
    
    void main(void) {
        //vec4 color0 = texture2D(uSampler2,vTextCord);
        //vec4 color1 = texture2D(uSampler, vTextCord);
        gl_FragColor = normalize(texture2D(uSampler,vTextCord)*fB+
        texture2D(uSampler2,vTextCord)*sB+
        vec4(0.1,0.5,0.8,1.0)*cB);//color0 * color1;
    }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            textCord: gl.getAttribLocation(shaderProgram,'textCord'),
            br1: gl.getAttribLocation(shaderProgram,'firstBright'),
            br2: gl.getAttribLocation(shaderProgram,'secondBright'),
            br3: gl.getAttribLocation(shaderProgram,'colorBright'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram,'uSampler'),
            uSampler2: gl.getUniformLocation(shaderProgram,'uSampler2'),
        }
    };

    const buffers = initBuffers(gl,programInfo);

    var then = 0;

    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let fieldOfView = 45 * Math.PI / 180;   // in radians
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let zNear = 0.1;
    let zFar = 100.0;
    let projectionMatrix = mat4.create();
    let myX = -6;
    let myZ = -20;
    //center

    //Green

    projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix,
        modelViewMatrix,
        [0.0, 0.0, -10.0]);
    mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        cubeRotationY,
        [0, 1, 0]);
    mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        cubeRotationZ,
        [1, 0, 0]);

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    let b1 = programInfo.attribLocations.br1;
    let b2 = programInfo.attribLocations.br2;
    let b3 = programInfo.attribLocations.br3;
    gl.vertexAttrib1f(b1,bright1);
    gl.vertexAttrib1f(b2,bright2);
    gl.vertexAttrib1f(b3, colorBright);

    ///Texture
    let textureCord = programInfo.attribLocations.textCord;//gl.getAttribLocation(shaderProgram,'textCord');
    gl.enableVertexAttribArray(textureCord);
    gl.vertexAttribPointer(textureCord, 2, gl.FLOAT, false, 0, 0);
    setTexcoords(gl);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 255]));
    let image = loadImage("https://psv4.userapi.com/c505536/u135594925/docs/d27/2de1ee283b55/1.png?extra=aAZeGlPyS5SDA3mOLhi-QMhFcs_gQRRxqiP3W9tgFxYEyUurn5RAdAmtcVSJJvgkjBgLC8ZWgWx-MD34NwZ3QqXGkUs8LpMVuD5v_HokNKJ46aQhxb35g3g30cNfD-fiVgjpjs0Jh2sfpdGDk4mF3i9_y0w");//("texture.png");//new Image();
   //"https://webglfundamentals.org/webgl/resources/f-texture.png";
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.uniform1i(programInfo.uniformLocations.uSampler,0);

    let texture2 = gl.createTexture();
    //gl.bindTexture(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,
       // new Uint8Array([0,0,0,255]));
    let image2 = loadImage("https://psv4.userapi.com/c505536/u135594925/docs/d20/500009153bd3/texture2.png?extra=F01j7xtTjx7tn9-XS31-khYXwp8KlJw0_AjAhQmff4r3y-3yFMtyq1fJjHS0pEq8sCJOTPX4o2rfomV7Y0FRtMLPwxRDTLOFlzNBC9GH81bdBpt0N1znmjHoB_4IbSCxrmzQPH4VCVMoCq-7s9YrJ15Ick4");
    gl.bindTexture(gl.TEXTURE_2D,texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,image2);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.uniform1i(programInfo.uniformLocations.uSampler2,1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function alertKey(e)
{
    switch (e.key){
        case "ArrowLeft":
                cubeRotationY -= 0.05;
            break;
        case "ArrowRight":
                cubeRotationY += 0.05;
                break;
        case "ArrowUp":
            cubeRotationZ -= 0.05;
            break;
        case "ArrowDown":
            cubeRotationZ += 0.05;
            break;
        case "Home":
                cubeRotationZ =0.0;
                cubeRotationY =0.0;
                break;
    }
}

addEventListener("keydown", alertKey);

function initBuffers(gl,programInfo) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const faceColors = [
        [0.0,  0.3,  0.8,  1.0],    // Front face: white
        [0.0,  0.3,  0.8,  1.0],    // Back face: red
        [0.0,  0.3,  0.8,  1.0],    // Top face: green
        [0.0,  0.3,  0.8,  1.0],    // Bottom face: blue
        [0.0,  0.3,  0.8,  1.0],    // Right face: yellow
        [0.0,  0.3,  0.8,  1.0],    // Left face: purple
    ];

    var colors = [];
    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    /*gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);*/

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    };
}

function setTexcoords(gl){
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // Front
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
            // Back
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,
            // Bottom
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
            // Right
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
            0.0,  1.0,
            // Left
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,
            0.0,  0.0,
        ]),
        gl.STATIC_DRAW
    );
}

function loadImage(url)
{
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    return image;
}

function changeFirstBright()
{
    var rng = document.getElementById("firstBrightness");
    bright1 = rng.value;
}

function changeSecondBright()
{
    var rng = document.getElementById("secondBrightness");
    bright2 = rng.value;
}

function changeColorBright()
{
    var rng = document.getElementById("colorBrightness");
    colorBright = rng.value;
}
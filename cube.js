"use strict";
let angleX =-0.5;
let angleY=-0.5;
let zV = 0.9;
let bright = 0.9;
let typeProg = "lambertProgram";
let typeShade = "Guro";
let typeZatuh = false;

const vsSourceGuro = `#version 300 es 
// Координаты вершины. Атрибут, инициализируется через буфер.
in vec3 vertexPosition;
in vec3 angle;
in vec3 lightWordPos;
in float zatuhValue;
in float brightVal;
in float typeShader;

in vec4 uMVMatrix;
in vec4 uPMatrix;
in vec4 uNMatrix;


// Выходной параметр с координатами вершины, интерполируется и передётся во фрагментный шейдер 
out vec3 vPosition;
out vec3 uColorG;
out vec3 toLight;
out float brightValue;
out vec3 uColor;
void main() {
    // Захардкодим углы поворота
    float x_angle = angle.y;
    float y_angle = angle.x;//0.5;
    mat3 transform = mat3(
        1, 0, 0,
        0, cos(x_angle),  sin(x_angle),
        0, -sin(x_angle), cos(x_angle)
    ) * mat3(
        cos(y_angle), 0, sin(y_angle),
        0, 1, 0,
        -sin(y_angle), 0, cos(y_angle)
    );

    // Поворачиаем вершину и присваиваем волшебной переменной gl_Position
    gl_Position = vec4(vertexPosition * transform, 1.0);
    
    float ambientStrength = 0.5;
    vec3 ambient = ambientStrength*vec3(0.2,0.3,0.7); 
    
    // Передаём непреобразованную координату во фрагментный шейдер
    vPosition = vertexPosition*transform;
    vec3 norm = normalize(vPosition.zyx);
    vec3 lightDir = normalize(toLight-vPosition);
    
    float diff = max(dot(lightDir,norm),0.0);
    vec3 diffuse = diff*vec3(0.2,0.3,0.7);
    
    float specStrength = 0.8;
    vec3 viewDir = normalize(toLight);
    vec3 reflectDir = reflect(-toLight,norm);
    
    float spec = pow(max(dot(viewDir,reflectDir),0.0),32.0);
    vec3 specular = specStrength*spec*vec3(0.2,0.3,0.7);
    
    toLight = vPosition-lightWordPos*1.0;//vPosition.zyx-lightDir;
    uColor = ambient +diffuse+specular;
    //uColor = vec3(0.2, 0.3, 0.7);
    brightValue = brightVal;
}`

const fsSourceGuro =`#version 300 es
// WebGl требует явно установить точность флоатов, так что ставим 32 бита
precision mediump float;

// Интерполированные координаты вершины, передаются из вершинного шейдера
in vec3 vPosition;
in vec3 uColorG;
in vec3 uColor;
in vec3 toLight;
in float brightValue;
// Цвет, который будем отрисовывать
out vec4 color; 

void main() {
    color = vec4(uColor,1.0);
    }
`

// Исходный код вершинного шейдера
const vsSource = `#version 300 es

// Координаты вершины. Атрибут, инициализируется через буфер.
in vec3 vertexPosition;
in vec3 angle;
in vec3 lightWordPos;
in float zatuhValue;
in float brightVal;
in float typeShader;

in vec4 uMVMatrix;
in vec4 uPMatrix;
in vec4 uNMatrix;


// Выходной параметр с координатами вершины, интерполируется и передётся во фрагментный шейдер 
out vec3 vPosition;
out vec3 uColor;
out vec3 toLight;
out float brightValue;
void main() {
    // Захардкодим углы поворота
    float x_angle = angle.y;
    float y_angle = angle.x;//0.5;
    mat3 transform = mat3(
        1, 0, 0,
        0, cos(x_angle),  sin(x_angle),
        0, -sin(x_angle), cos(x_angle)
    ) * mat3(
        cos(y_angle), 0, sin(y_angle),
        0, 1, 0,
        -sin(y_angle), 0, cos(y_angle)
    );

    // Поворачиаем вершину и присваиваем волшебной переменной gl_Position
    gl_Position = vec4(vertexPosition * transform, 1.0);

    // Передаём непреобразованную координату во фрагментный шейдер
    vPosition = vertexPosition*transform;
    uColor = vec3(0.2, 0.3, 0.7);
    //Light sample
    brightValue = brightVal;
    //if(typeShader == 2.0)
    //{
         toLight = vPosition-lightWordPos*1.0;
    //}
    //else{
    //toLight = vPosition-lightWordPos;}//lightWordPos * N -> N радиус освещения чем меньше n тем больше зона освещения - сила затухания
}
`;

const fsSourceCell = `#version 300 es
// WebGl требует явно установить точность флоатов, так что ставим 32 бита
precision mediump float;

// Интерполированные координаты вершины, передаются из вершинного шейдера
in vec3 vPosition;
in vec3 uColor;
in vec3 toLight;
in float brightValue;
// Цвет, который будем отрисовывать
out vec4 color; 

void main(){
    vec3 normal = normalize(vPosition)*brightValue;//*n - яркость освещения
    vec3 surfaceToLight = normalize(toLight);
    
    float light = dot(normal,surfaceToLight);
    //fragment shaidng
    if(light>0.9){
        light = 0.9;
    }
    else if(light>0.7){
        light = 0.7;
    }
    else if(light>0.5){
        light = 0.5;
    }
    else if(light>0.3){
        light = 0.3;
    }
    else if(light>0.0){
        light = 0.2;
    }
    color = vec4(uColor.xyz*light,1);
    }
`

// Исходный код фрагментного шейдера
const fsSource = `#version 300 es
// WebGl требует явно установить точность флоатов, так что ставим 32 бита
precision mediump float;

// Интерполированные координаты вершины, передаются из вершинного шейдера
in vec3 vPosition;
in vec3 uColor;
in vec3 toLight;
in float brightValue;
// Цвет, который будем отрисовывать
out vec4 color; 

void main() {
    //if(uColor>=0.0){
    //color = vec4(0.2, 0.3, 0.7,1);}
    //else{
    //color = vec4(0.7, 0.3, 0.7,1);}
    vec3 normal = normalize(vPosition)*brightValue;//*n - яркость освещения
    vec3 surfaceToLight = normalize(toLight);
    
    float light = dot(normal,surfaceToLight);
    color = vec4(uColor.xyz*light,1);
    }
`;

// Исходный код фрагментного шейдера
const fsSourcePhong = `#version 300 es
// WebGl требует явно установить точность флоатов, так что ставим 32 бита
precision mediump float;

// Интерполированные координаты вершины, передаются из вершинного шейдера
in vec3 vPosition;
in vec3 uColor;
in vec3 toLight;
in float brightValue;
// Цвет, который будем отрисовывать
out vec4 color; 

void main() {
    float shiness = 100.0;
    vec3 ambientLightColor = vec3(0.2,0.3,0.7)*1.0;
    vec3 vP = normalize(toLight);
    vec4 lightLoc = vec4(vP,1.0);
    vec3 lightDir = lightLoc.xyz+vPosition;
    
    vec3 L = normalize(lightDir);
    
    vec3 N = normalize(vPosition); //R==N
    
    float lambertComp = max(dot(N,-L),0.0);
    vec3 diffLight = vec3((0.7,0.7,0.7)*lambertComp);
    //блик
    vec3 eyeVec = -vPosition;
    vec3 R = normalize(eyeVec);
    vec3 E = reflect(L,N);
    
    float light = dot(N,L)*brightValue;
    
    float specular = pow(max(dot(E,R),0.0),shiness);
    vec3 specularLight = vec3((uColor.xyz)*specular);
    
    color = vec4((ambientLightColor+diffLight+specularLight)*((light+lambertComp)*0.9),1.0);
    
    }
`;

function main() {
    // Получаем канвас из html
    const canvas = document.querySelector("#gl_canvas");
    // Получаем контекст webgl2
    const gl = canvas.getContext("webgl2");

    // Обработка ошибок
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    // Устанавливаем размер вьюпорта
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Включаем z-buffer
    gl.enable(gl.DEPTH_TEST);
    let shade = vsSource;
    if(typeShade=="Guro")
    {
        shade = vsSourceGuro;
    }
    else if(typeShade=="Phong")
    {
        shade=vsSource;
    }
    let shaderProgram;
    if(typeProg == "lambertProgram")
    {
        shaderProgram = initShaderProgram(gl, shade, fsSource);
    }
    else if(typeProg == "phongProgram")
    {
        shaderProgram = initShaderProgram(gl, shade, fsSourcePhong);
    }
    else if(typeProg == "celShading")
    {
        shaderProgram = initShaderProgram(gl, shade, fsSourceCell);
    }
    else if(typeProg == "guroProgram")
    {
        shaderProgram = initShaderProgram(gl, shade,fsSourceGuro);
    }
    // Создаём шейдерную программу


    // Для удобства создадим объект с информацией о программе
    const programInfo = {
        // Сама программа
        program: shaderProgram,
        // Расположение параметров-аттрибутов в шейдере
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'vertexPosition'),
            //vertexNormal: gl.getAttribLocation(shaderProgram, 'VertexNormal'),
            //angle: gl.getAttribLocation(shaderProgram,'angle'),
        },
    };
    var v_angle = gl.getAttribLocation(shaderProgram,'angle');
    var light = gl.getAttribLocation(shaderProgram,'lightWordPos');
    var zatuhValue = gl.getAttribLocation(shaderProgram,'zatuhValue');
    var brightValue = gl.getAttribLocation(shaderProgram,'brightVal');
    gl.vertexAttrib3f(light,0.0,0.0,20.75);
    gl.vertexAttrib3f(v_angle,angleX,angleY,0);
    gl.vertexAttrib1f(zatuhValue,zV);
    gl.vertexAttrib1f(brightValue,bright)

    //----------
    var mvM = gl.getAttribLocation(shaderProgram,'uMVMatrix');
    var mvP = gl.getAttribLocation(shaderProgram,'uPMatrix');
    var mvN = gl.getAttribLocation(shaderProgram,'uNMatrix');
    gl.vertexAttrib4f(mvM, 0.0,0.0,0.0,0.0);
    gl.vertexAttrib4f(mvP, 0.0,0.0,0.0,0.0);
    gl.vertexAttrib4f(mvN, 0.0,0.0,0.0,0.0);
    //-----------

    // Инициализируем буфер
    const buffers = initBuffer(gl)

    drawScene(gl, programInfo, buffers);
}

window.onload = main();

// Функция загрузки шейдера
function loadShader(gl, type, source) {
    // Создаём шейдер
    const shader = gl.createShader(type);

    // Компилируем шейдер
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Обрабатываем ошибки
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Функция инициализации шейдерной программы
function initShaderProgram(gl, vsSource, fsSource) {
    // Загружаем вершинный шейдер
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    // Загружаем фрагментный шейдер
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    //Создаём программу и прикрепляем шейдеры к ней
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Обрабатываем ошибки
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Инициализируем и заполняем буфер вершин кубика
function initBuffer(gl) {
    // Координаты вершин кубика
    let p000 = [-0.5, -0.5, -0.5]
    let p001 = [-0.5, -0.5, +0.5]
    let p010 = [-0.5, +0.5, -0.5]
    let p011 = [-0.5, +0.5, +0.5]
    let p100 = [+0.5, -0.5, -0.5]
    let p101 = [+0.5, -0.5, +0.5]
    let p110 = [+0.5, +0.5, -0.5]
    let p111 = [+0.5, +0.5, +0.5]

    // Треугольники, из которых состоит кубик
    const positions = [
        // Нижняя грань
        [p101, p001, p000],
        [p100, p101, p000],
        // Передняя грань
        [p001, p011, p111],
        [p001, p111, p101],
        // Верхняя грань
        [p011, p010, p110],
        [p011, p110, p111],
        // Задняя грань
        [p000, p010, p110],
        [p000, p110, p100],
        // Левая грань
        [p000, p010, p011],
        [p000, p011, p001],
        // Правая грань
        [p110, p111, p101],
        [p110, p101, p100],
    ].flat(2) // Превращаем в плоский массив

    const positionBuffer = makeF32ArrayBuffer(gl, positions);

    return {
        positionBuffer,
        bufferLength: positions.length,
    };
}

function makeF32ArrayBuffer(gl, array) {
    // Создаём буфер
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Заполняем буффер массивом флоатов
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(array),
        gl.STATIC_DRAW
    );

    return buffer
}


function drawScene(gl, programInfo, buffers) {
    // Чистим экран
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Подключаем VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
    // Указываем формат данных, содержащихся в буфере
    gl.vertexAttribPointer(
        // Позиция параметра в шейдере, которую вы сохранили заранее
        programInfo.attribLocations.vertexPosition,
        // Количество компонент. У нас 3, потому что мы передаём только координаты x, y, z.
        3,
        // Тип элемента. У нас 32-битный флоат.
        gl.FLOAT,
        // Нормализация нужна только для целочисленных параметров
        false,
        // Расстояние между компонентами нулевое
        0,
        // Сдвиг от начала не нужен
        0,
    );
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition,
    );

    // Устанавливаем используемую программу
    gl.useProgram(programInfo.program);

    gl.drawArrays(
        // Рисуем по треугольникам
        gl.TRIANGLES,
        // Сдвиг от начала не нужен
        0,
        // Количество вершин в буфере
        buffers.bufferLength
    );
}

function rangeZath(){
    var rng = document.getElementById("Zatuh");
    zV = rng.value;
    if(typeZatuh) {
        zV = zV*zV; // сюда изменение
    }
    zV = 1.0 -zV;
    console.log(zV);
    main();
    //alert(rng.value);
}

function rangeBrightness(){
    var rng = document.getElementById("Brightness");
    bright = rng.value;
    //bright = bright*bright;
    main();

}

function changeProgram(value){
        typeProg = value;
    main();
}

function changeType(value){
    typeShade=value;
    main();
}

function alertKey(e)
{
    if (e.key == "ArrowLeft") {
        angleX+=0.1;
    }
    if(e.key==="ArrowRight") {
        angleX-=0.1;
    }
    if(e.key==="ArrowUp") {
        angleY-=0.1;
    }
    if(e.key==="ArrowDown") {
        angleY+=0.1;
    }
    main();
}

function selectStep(){
    if(typeZatuh)
    {
        typeZatuh = false;
    }
    else{
        typeZatuh = true;
    }
    //alert(typeZatuh);
    rangeZath();
}

addEventListener("keydown", alertKey);
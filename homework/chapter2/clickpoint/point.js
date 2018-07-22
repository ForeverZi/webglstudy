var _downFlag = false;

function main(){
    let VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute float a_PointSize;
        void main(){
            gl_Position = a_Position;
            gl_PointSize = a_PointSize;
        }
    `;

    let FSHADER_SOURCE = `
        void main(){
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl');
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('faild to initialize shaders');
        return;
    }
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 5);
    canvas.onmousedown = function (ev) {
        _downFlag = true;
    };
    canvas.onmouseup = function(ev){
        _downFlag = false;
    };
    canvas.onmouseout = ()=>{
        _downFlag = false;
    };
    canvas.onmousemove = function (ev) {
        if(!_downFlag){
            return;
        }
        click(ev, gl, canvas, a_Position); 
    };
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var points = [];

function click(ev, gl, canvas, a_Position){
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    points.push({x:x, y:y});
    points.push({x:-x, y: -y});
    gl.clear(gl.COLOR_BUFFER_BIT);
    for(const point of points){
        gl.vertexAttrib3f(a_Position, point.x, point.y, 0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
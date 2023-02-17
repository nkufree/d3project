    //背景
    //以下代码大部分来源于网络：https://thenewcode.com/1159/Create-a-Dynamic-Point-Mesh-Animation-with-HTML5-Canvas
    //跟随鼠标动画，鼠标吸附动画为自制
   var particles = [];
   var mypar;
   let resizeReset = function() {
    w = canvasBody.width = window.innerWidth;
    h = canvasBody.height = window.innerHeight;
   }
   var opts = { 
        particleColor: "rgb(200,200,200)",
        lineColor: "rgb(200,200,200)",
        particleAmount: 60,
        defaultSpeed: 1,
        variantSpeed: 1,
        defaultRadius: 2,
        variantRadius: 2,
        linkRadius: 200,
   }
 
   window.addEventListener("resize", function(){
        deBouncer();
   });
 
let deBouncer = function() {
    clearTimeout(tid);
    tid = setTimeout(function() {
        resizeReset();
    }, delay);
};
Particle = function(xPos, yPos){ 
    this.x = xPos||Math.random() * w; 
    this.y = yPos||Math.random() * h;
    this.dx = 0;
    this.dy = 0;
    this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed; 
    this.directionAngle = Math.floor(Math.random() * 360); 
    this.color = opts.particleColor;
    this.radius = opts.defaultRadius + Math.random() * opts. variantRadius; 
    this.vector = {
        x: Math.cos(this.directionAngle) * this.speed,
        y: Math.sin(this.directionAngle) * this.speed
    };
    this.update = function(){ 
      this.border(); 
      this.x += this.dx;
      this.y += this.dy;
      this.x += this.vector.x; 
      this.y += this.vector.y; 
      this.dy = 0;
      this.dx = 0;
    };
    this.border = function(){ 
        if (this.x >= w || this.x <= 0) { 
            this.vector.x *= -1;
        }
        if (this.y >= h || this.y <= 0) {
            this.vector.y *= -1;
        }
        if (this.x > w) this.x = w;
        if (this.y > h) this.y = h;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0; 
    };
    this.draw = function(){ 
        drawArea.beginPath();
        drawArea.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        drawArea.closePath();
        drawArea.fillStyle = this.color;
        drawArea.fill();
    };
};

function setup(){ 
  opts.particleAmount = parseInt(window.innerWidth*window.innerHeight/15000);
  for (let i = 0; i < opts.particleAmount; i++){
    particles.push( new Particle() );
  }
  
  //console.log(particles);
  window.requestAnimationFrame(loop);
}
const canvasBody = document.getElementById("canvasbg"),
drawArea = canvasBody.getContext("2d");
let delay = 200, tid;
//获取鼠标位置，构造以鼠标所在位置为圆心的点
window.onmousemove = function(event){
  mypar = new Particle(event.offsetX,event.offsetY);
}
resizeReset();
setup();
function loop(){ 
    window.requestAnimationFrame(loop);
    drawArea.clearRect(0,0,w,h);
    //console.log(mypar);
    mypar.draw();
    for (let i = 0; i < particles.length; i++){
        particles[i].update();
        particles[i].draw();
    }
    for (let i = 0; i < particles.length; i++){
        linkPoints(particles[i], particles);
    }
    changeSpeed(mypar,particles);
}
let checkDistance = function(x1, y1, x2, y2){ 
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
let rgb = opts.lineColor.match(/\d+/g);
let linkPoints = function(point1, hubs){ 
    for (let i = 0; i < hubs.length; i++) {
        let distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y);
        let opacity = 1 - distance / opts.linkRadius;
        if (opacity > 0) { 
            drawArea.lineWidth = 0.5;
            drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
            drawArea.beginPath();
            drawArea.moveTo(point1.x, point1.y);
            drawArea.lineTo(hubs[i].x, hubs[i].y);
            drawArea.closePath();
            drawArea.stroke();
        }
    }
}
//绘制路径并改变朝向,做出一种牵扯的效果
let changeSpeed = function(point1, hubs){
  for (let i = 0; i < hubs.length; i++) {
        let distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y);
        let opacity = 1 - distance / opts.linkRadius;
        if (opacity > 0) { 
          hubs[i].dx = (point1.x - hubs[i].x)/distance*hubs[i].speed*0.4;
          hubs[i].dy = (point1.y - hubs[i].y)/distance*hubs[i].speed*0.4;
          drawArea.lineWidth = 0.5;
          drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
          drawArea.beginPath();
          drawArea.moveTo(point1.x, point1.y);
          drawArea.lineTo(hubs[i].x, hubs[i].y);
          drawArea.closePath();
          drawArea.stroke();
        }
    }
}
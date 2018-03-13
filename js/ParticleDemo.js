$(document).ready(function(){
    var Particle = {
        init:function(){
            var t = this;
            t.zr = zrender.init(document.getElementById('panel'));
            var circle = new zrender.Rect({
                shape: {
                    width:t.panelW,
                    height:t.panelH
                },
                style: {
                    fill: 'none',
                    stroke: 'none'
                }
            });
            t.zr.add(circle);
            t.getAtoms();
            //t.startLight();
        },
        randomSort: function (a, b) {
            return Math.random() > 0.5 ? -1 : 1;
        },
        startLight:function(){
            var t = this;
            var canvas = document.getElementById('CaosAppDrawLight');
            var context = canvas.getContext("2d");
            var radius = 0;
            //画圆
            var drawCircle = function() {
                context.beginPath();
                context.arc(t.Particles[t.userInfo.index].disx+t.atomW/2, t.Particles[t.userInfo.index].disy+t.atomH/2, radius, 0, Math.PI * 2);
                context.closePath();
                context.lineWidth = 2; //线条宽度
                context.strokeStyle = 'rgba(250,250,50,1)'; //颜色
                context.stroke();
                radius += 0.5; //每一帧半径增加0.5

                //半径radius大于30时，重置为0
                if (radius > 10) {
                    radius = 0;
                }
            };

            //创建一个临时canvas来缓存主canvas的历史图像
            var backCanvas = document.createElement('canvas'),
                backCtx = backCanvas.getContext('2d');
            backCanvas.width = canvas.width;
            backCanvas.height = canvas.height;

            //设置主canvas的绘制透明度
            context.globalAlpha = 0.95;

            //显示即将绘制的图像，忽略临时canvas中已存在的图像
            backCtx.globalCompositeOperation = 'copy';
            var render = function() {
                //默认值为source-over
                var prev = context.globalCompositeOperation;

                //只显示canvas上原图像的重叠部分
                context.globalCompositeOperation = 'destination-in';

                //设置主canvas的绘制透明度
                context.globalAlpha = 0.95;

                //这一步目的是将canvas上的图像变的透明
                context.fillRect(0, 0, canvas.width, canvas.height);

                //在原图像上重叠新图像
                context.globalCompositeOperation = prev;

                //在主canvas上画新圆
                drawCircle();
            };

            var timer = setInterval(function(){
                if(t.lightOnOff){
                    render();
                }else{
                    context.clearRect(0,0,canvas.width, canvas.height);
                    backCtx.clearRect(0,0,canvas.width, canvas.height);
                    clearInterval(timer);
                }
            },60)

        },
        startAnimate:function(){
          var t = this;
          var sumTime = 0;
            if(t.play){
                switch (t.sequence) {
                    case 0:
                        for (var num = 0; num < t.Particles.length; num++) {
                            var item = t.Particles[num];
                            t.zr.add(item.rect);
                            item.rect.animateTo({
                                style: {
                                    width: t.atomW, height: t.atomH,
                                    x: item.x, y: item.y
                                }
                            }, 3000, 10, 'linear', function (e) {
                                // done
                                sumTime++;
                                if(sumTime===t.Particles.length){
                                    sumTime = 0;
                                    t.sequence++;
                                    t.startAnimate();
                                }

                            });

                        }
                        break;
                    case 1:
                        for(var numA = 0;numA<t.Particles.length;numA++){
                            var itemA = t.Particles[numA];
                            itemA.rect.animateTo(
                                {
                                    style: {
                                        width:itemA.w,height:itemA.h,
                                        x: itemA.locx, y: itemA.locy
                                    }
                                }, 3000, 10, 'linear', function () {
                                    // done
                                    sumTime++;
                                    if(sumTime===t.Particles.length){
                                        sumTime = 0;
                                        t.sequence++;
                                        t.startAnimate();
                                    }
                                }
                            );
                        }
                        break;
                    case 2:
                        t.Particles[0].rect.hide();
                        for(var numB = 0;numB<t.Particles.length;numB++){
                            var itemB = t.Particles[numB];
                            itemB.rect.animateTo(
                                {
                                    style: {
                                        width:t.atomW,height:t.atomH,
                                        x: itemB.disx, y: itemB.disy
                                    }
                                }, 3000, 10, 'linear', function () {
                                    // done
                                    sumTime++;
                                    if(sumTime===t.Particles.length){
                                        sumTime = 0;
                                        t.sequence++;
                                        t.startAnimate();
                                        t.startLight();
                                    }
                                }
                            );
                        }
                        break;
                    case 3:
                        for(var numD = 0;numD<t.Particles.length;numD++){
                            var itemD = t.Particles[numD];
                            itemD.rect.animateTo(
                                {
                                    style: {
                                        width:t.atomW*1.5,
                                        height:t.atomH*1.5,
                                        x:1.5*(itemD.disx-t.Particles[t.userInfo.index].disx)+t.centerImg.x, y: 1.5*(itemD.disy-t.Particles[t.userInfo.index].disy+t.centerImg.y)
                                    }
                                }, 3000, 10, 'linear', function () {
                                    // done
                                    sumTime++;
                                    if(sumTime===t.Particles.length){
                                        sumTime = 0;
                                        t.sequence++;
                                        t.startAnimate();
                                        t.play = false;
                                    }
                                }
                            );
                        }
                }
            }else{
                return false;
            }
        },
        getCenterDis:function(){
            var t = this;
            t.centerImg.x = t.panelW/2-t.centerImg.w;
            t.centerImg.y = t.panelH/2-t.centerImg.h;
            t.centerImg.z = 10;//z的数值越大，起点越小
            var atom ={
                x: t.centerImg.x,
                y: t.centerImg.y ,
                z: t.centerImg.z,
                locx: t.centerImg.x,
                locy: t.centerImg.y,
                locz: t.centerImg.z,
                w: t.centerImg.w*10,
                h: t.centerImg.h*10,
                rect:new zrender.Image(
                    {
                        'style': { x: t.centerImg.x, y: t.centerImg.y,width:0,height:0, image:t.centerImg.imgSrc}
                    }
                )
            } ;
            t.Particles.unshift(atom);
        },
        getAtoms:function(){
          var t = this;
            for (var i = 0; i < t.panelW; i += t.atomW) {
                for (var j = 0; j < t.panelH; j += t.atomH) {
                    var atom = t.createAtoms(i - t.atomW/2, j - t.atomH/2, 10,t.atomW, t.atomH);
                    t.Particles.push(atom);
                }
            }
            t.Particles = t.Particles.sort(t.randomSort);
            t.Particles = t.Particles .slice(0,300);
            t.getLogoDis();
        },
        getLogoDis:function(){
            var t = this;
            var image = new Image(); //定义一个图片对象
            image.src = 'image/1b2f38b4ecfe4c69aa7f97769b6c76f1.PNG';
            image.onload = function () {
                var nowCanvas = document.createElement("canvas");
                var ctx = nowCanvas.getContext("2d");
                nowCanvas.width = t.panelW;
                nowCanvas.height = t.panelH;
                ctx.clearRect(0, 0, nowCanvas.width, nowCanvas.height);
                ctx.drawImage(image, 0, 0, nowCanvas.width, nowCanvas.height);//将图片从Canvas画布的左上角(0,0)位置开始绘制，大小默认为图片实际大小
                var imgData = ctx.getImageData(0, 0, nowCanvas.width, nowCanvas.height);
                var temArr = [];
                for (var i = 0; i < imgData.width; i += 6) {
                    for (var j = 0; j < imgData.height; j += 6) {
                        var num = (j * imgData.width + i) * 4;
                        if (imgData.data[num] < 128) {
                            var dataJson = {
                                disx: i - 3,
                                disy: j - 3,
                                disz: 0
                            };
                            temArr.push(dataJson);
                        }

                    }
                }
                temArr = temArr.sort(t.randomSort);
                t.getCenterDis();
                for(var sNum = 0;sNum<temArr.length;sNum++){
                    if(t.Particles[sNum]){
                        t.Particles[sNum].disx = temArr[sNum].disx;
                        t.Particles[sNum].disy = temArr[sNum].disy;
                        t.Particles[sNum].disz = temArr[sNum].disz;
                    }else{
                    }
                }
                t.userInfo.index = t.randomNum(0,t.Particles.length);
                t.userInfo.disx = t.Particles[t.userInfo.index].disx;
                t.userInfo.disy = t.Particles[t.userInfo.index].disy;
                t.Particles[t.userInfo.index].rect.style.image = t.userInfo.imgSrc;
                t.startAnimate();
            };
        },
        randomNum:function(minNum,maxNum){
            switch(arguments.length){
                case 1:
                    return parseInt(Math.random()*minNum+1,10);
                    break;
                case 2:
                    return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                    break;
                default:
                    return 0;
                    break;
            }
        },
        createAtoms:function(x,y,z,w,h){
            var t = this;
            var radius = t.focallength / (Math.random() * t.focallength * 3);
            return {
                x: x,
                y: y,
                z: z,
                locx: parseInt(Math.random() * t.panelW),
                locy: parseInt(Math.random() * t.panelW),
                locz: Math.random() * t.focallength * 2 - t.focallength,
                w: w*radius*.2,
                h: h*radius*.2,
                rect:new zrender.Image(
                    {
                        'style': { x: x, y: y,width:0,height:0, image:"image/home.jpg"}
                    }
                    )
            }
        },
        userInfo:{
          imgSrc:'image/junyong02.jpg',
            disx:0,
            disy:0,
            index:0
        },
        centerImg:{
            imgSrc: "image/junyong02.jpg",
            w: 32,
            h: 23,
            x:0,
            y:0
        },
        lightOnOff:true,
        play:true,
        sequence:0,
        animateTimer:null,
        zr:null,
        focallength:250,
        panelW:600,
        panelH:270,
        Particles:[],
        atomW:8,
        atomH:8
    };
    Particle.init();
});
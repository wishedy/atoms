var Particle = {
    init: function (opt) {
        var t = this;
        t.opt = opt;
        t.initPanel();

    },
    initPanel: function () {
        var t = this;
        t.zr = zrender.init(document.getElementById(t.opt.particlePanel));
        t.panel = new zrender.Rect({
            shape: {
                width: t.panelW,
                height: t.panelH
            },
            style: {
                fill: 'none',
                stroke: 'none'
            }
        });
        t.zr.add(t.panel);
        t.getAtoms();
    },
    createAtoms: function (x, y, z, w, h) {
        var t = this;
        var radius = t.focallength / (Math.random() * t.focallength * 2);
        if(radius>500){
            radius = 500;
        }
        return {
            x: x,
            y: y,
            z: z,
            locx: parseInt(Math.random() * t.panelW),
            locy: parseInt(Math.random() * t.panelW),
            locz: Math.random() * t.focallength * 2 - t.focallength,
            w: w * radius*.3,
            h: h * radius*.3,
            rect: new zrender.Image(
                {
                    'style': {x: x, y: y, width: 0, height: 0, image: "image/home.jpg"}
                }
            )
        }
    },
    getAtoms: function () {
        var t = this;
        for (var i = 0; i < t.panelW; i += t.atomW) {
            for (var j = 0; j < t.panelH; j += t.atomH) {
                var atom = t.createAtoms(i - t.atomW / 2, j - t.atomH / 2, 10, t.atomW, t.atomH);
                t.Particles.push(atom);
            }
        }
        t.Particles = t.Particles.sort(t.randomSort);
        t.Particles = t.Particles.slice(0, t.nowSum);
        t.opt.beginFun && t.opt.beginFun();
        t.getCenterDis();
    },
    randomSort: function (a, b) {
        return Math.random() > 0.5 ? -1 : 1;
    },
    startLight: function () {
        var t = this;
        $("#Particle").append("<section class=\"allinmdCaosAppLight\" id=\"Light\">" +
            "                    <canvas id=\"CaosAppDrawLight\" width=\"550\" height=\"300\"></canvas>" +
            "                </section>");
        var canvas = document.getElementById('CaosAppDrawLight');
        var context = canvas.getContext("2d");
        canvas.width = t.logoImg.w;
        canvas.height = t.logoImg.h;
        var radius = 0;
        //画圆
        var drawCircle = function () {
            context.beginPath();
            context.arc(t.userInfo.disx + t.atomW / 2, t.userInfo.disy + t.atomH / 2, radius, 0, Math.PI * 2);
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
        var render = function () {
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

        var timer = setInterval(function () {
            if (t.lightOnOff) {
                render();
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);
                backCtx.clearRect(0, 0, canvas.width, canvas.height);
                clearInterval(timer);
            }
        }, 60)

    },
    max:0,
    startAnimate: function () {
        var t = this;
        var sumTime = 0;
        if (t.Play) {
            if (t.section) {
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
                                if (sumTime === t.Particles.length) {
                                    sumTime = 0;
                                    t.section = false;
                                    t.startAnimate();
                                }

                            });
                        }
                        break;
                    case 1:
                        for (var numA = 0; numA < t.Particles.length; numA++) {
                            var itemA = t.Particles[numA];
                                itemA.rect.animateTo(
                                    {
                                        style: {
                                            width: itemA.w, height: itemA.h,
                                            x: itemA.locx, y: itemA.locy
                                        }
                                    }, 3000, 10, 'linear', function () {
                                        // done
                                        sumTime++;
                                        if (sumTime === t.Particles.length) {
                                            sumTime = 0;
                                            t.section = false;
                                            t.startAnimate();
                                        }
                                    }
                                );
                        }
                        break;
                    case 2:
                        t.zr.resize({
                            width: t.logoImg.w,
                            height: t.logoImg.h
                        });
                        $(".allinmdCaosAppParticle").height(t.logoImg.h).css({top: -300});
                        for (var numB = 0; numB < t.Particles.length; numB++) {
                            var itemB = t.Particles[numB];
                            if (itemB.disx && itemB.disy) {
                                itemB.rect.animateTo(
                                    {
                                        style: {
                                            width: t.atomW, height: t.atomH,
                                            x: itemB.disx, y: itemB.disy
                                        }
                                    }, 3000, 10, 'linear', function () {
                                        // done
                                        sumTime++;
                                        if (sumTime === t.Particles.length) {
                                            sumTime = 0;
                                            t.sequence++;
                                            t.startAnimate();
                                            t.startLight();
                                            t.startScale();
                                        }
                                    }
                                );
                            } else {
                                sumTime++;
                                itemB.rect.hide();
                            }

                        }
                        break;
                }
            } else {
                if (t.sequence === t.lastSequence) {
                    return false;
                } else {
                    t.sequence++;
                    t.section = true;
                    t.startAnimate();
                }
            }
        }
    },
    startScale: function () {
        var t = this;
        $(".allinmdCaosAppDes").show();
        $(".allinmdCaosAppSee").off("touchstart").on("touchstart", function () {
            $(".allinmdCaosAppSee").hide();
            $(".allinmdCaosAppNum").hide();
            if (t.scaleOnOff) {
                t.scaleOnOff = false;
                for (var numD = 0; numD < t.Particles.length; numD++) {
                    var itemD = t.Particles[numD];
                    if (itemD.disx && itemD.disy) {
                        itemD.rect.animateTo(
                            {
                                style: {
                                    width: t.atomW * t.scaleNum,
                                    height: t.atomH * t.scaleNum,
                                    x: t.scaleNum * (itemD.disx - t.Particles[t.userInfo.index].disx) + t.centerImg.x,
                                    y: t.scaleNum * (itemD.disy - t.Particles[t.userInfo.index].disy + t.centerImg.y)
                                }
                            }, 1500, 10, 'linear', function () {
                                // done
                                $("#Light").hide(500);
                                $(".allinmdCaosAppSee").delay(1000).html("回看全景").show();
                            }
                        );
                    } else {
                        itemD.rect.hide();
                    }
                }

            } else {
                t.scaleOnOff = true;
                for (var numE = 0; numE < t.Particles.length; numE++) {
                    var itemE = t.Particles[numE];
                    itemE.rect.animateTo(
                        {
                            style: {
                                width: t.atomW,
                                height: t.atomH,
                                x: itemE.disx, y: itemE.disy
                            }
                        }, 1500, 10, 'linear', function () {
                            // done
                            $("#Light").show(500);
                            $(".allinmdCaosAppNum").show();
                            $(".allinmdCaosAppSee").delay(1000).html("查看我的头像位置").show();
                        }
                    );
                }
            }

        });
    },
    calLog: function () {
        var t = this;
        var image = new Image(); //定义一个图片对象
        image.src = t.logoImg.imgSrc;
        image.onload = function () {
            var nowCanvas = document.createElement("canvas");
            var ctx = nowCanvas.getContext("2d");
            nowCanvas.width = t.logoImg.w;
            nowCanvas.height = t.logoImg.h;
            ctx.clearRect(0, 0, nowCanvas.width, nowCanvas.height);
            ctx.drawImage(image, 0, 0, nowCanvas.width, nowCanvas.height);//将图片从Canvas画布的左上角(0,0)位置开始绘制，大小默认为图片实际大小
            var imgData = ctx.getImageData(0, 0, nowCanvas.width, nowCanvas.height);
            var temArr = [];
            for (var i = 0; i < imgData.width; i += t.atomW) {
                for (var j = 0; j < imgData.height; j += t.atomH) {
                    var num = (j * imgData.width + i) * 4;
                    if (imgData.data[num] < 128) {
                        var dataJson = {
                            disx: i - t.atomW / 2,
                            disy: j - t.atomW / 2,
                            disz: 0
                        };
                        temArr.push(dataJson);
                    }

                }
            }
            temArr = temArr.sort(t.randomSort);
            if (temArr.length > t.Particles.length) {
                for (var sNum = 0; sNum < temArr.length; sNum++) {
                    if (t.Particles[sNum]) {
                        t.Particles[sNum].disx = temArr[sNum].disx;
                        t.Particles[sNum].disy = temArr[sNum].disy;
                        t.Particles[sNum].disz = temArr[sNum].disz;
                    }
                }
            } else {
                for (var numRan = 0; numRan < t.Particles.length; numRan++) {
                    if (temArr[numRan]) {
                        t.Particles[numRan].disx = temArr[numRan].disx;
                        t.Particles[numRan].disy = temArr[numRan].disy;
                        t.Particles[numRan].disz = temArr[numRan].disz;
                    }
                }
            }
            t.userInfo.disx = t.Particles[t.userInfo.index].disx;
            t.userInfo.disy = t.Particles[t.userInfo.index].disy;
            /*x: t.centerImg.x - scale * t.centerImg.w / 2,
                y: t.centerImg.y - scale * t.centerImg.h / 2,
                z: t.centerImg.z,
                w: t.centerImg.w * scale,
                h: t.centerImg.h * scale,*/
            var scale = 40;
            t.Particles[t.userInfo.index].locx = t.Particles[t.userInfo.index].disx - scale * t.atomW / 2;
            t.Particles[t.userInfo.index].locy = t.Particles[t.userInfo.index].disy - scale * t.atomH / 2;
            t.Particles[t.userInfo.index].w = t.atomW*scale;
            t.Particles[t.userInfo.index].h = t.atomH* scale;
            t.Particles[t.userInfo.index].rect.style.image = t.userInfo.imgSrc;
            t.startAnimate();
        };
    },
    randomNum: function (minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    },
    getCenterDis: function () {
        var t = this;
        t.centerImg.x = t.panelW / 2 - t.centerImg.w / 2;
        t.centerImg.y = t.panelH / 2 - t.centerImg.h / 2;
        t.centerImg.z = 10;//z的数值越大，起点越小
        var scale = 5;
        var atom = {
            x: t.centerImg.x - scale * t.centerImg.w / 2,
            y: t.centerImg.y - scale * t.centerImg.h / 2,
            z: t.centerImg.z,
            w: t.centerImg.w * scale,
            h: t.centerImg.h * scale,
            rect: new zrender.Image(
                {
                    'style': {
                        x: t.centerImg.x,
                        y: t.centerImg.y,
                        width: t.atomW,
                        height: t.atomH,
                        image: t.centerImg.imgSrc
                    }
                }
            )
        };
        t.centerImg = atom;
        t.zr.add(atom.rect);
        atom.rect.animateTo(
            {
                style: {
                    width: atom.w,
                    height: atom.h,
                    x: atom.x,
                    y: atom.y
                }
            }, 2000, 10, 'linear', function () {
                atom.rect.hide();
            }
        );
        setTimeout(function () {
            t.calLog();
        }, 1500);

    },
    centerImg: {
        imgSrc: "image/Cgp3O1axmBmAMh2nAAAyeN0wTns199.png",
        w: 32,
        h: 23,
        x: 0,
        y: 0
    },
    logoImg: {
        imgSrc: 'image/logo.png',
        w: 550,
        h: 570
    },
    userInfo: {
        imgSrc: 'image/349724189257526722.png',
        disx: 0,
        disy: 0,
        index: 0
    },
    scaleNum: 3,
    scaleOnOff: true,
    section: true,
    panel: null,
    lastSequence: 2,
    lightOnOff: true,
    sequence: 0,
    centerRect: null,
    focallength: 250,
    Particles: [],
    atomW: 8,
    atomH: 8,
    nowSum: 800,
    panelW: 550,
    panelH: 300,
    opt: null,
    zr: null,
    Play: true
};
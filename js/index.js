$(document).ready(function(){
    var caosApp = {
        init:function(){
            var t = this;
            console.log('执行');
            t.startWord();
            setTimeout(function(){
                Particle.init({
                    beginFun:function(){
                        $(".caosAppWelcome").hide();
                        $(".caosAppDraw").show();
                        clearInterval(t.wordTimer);
                    },
                    endFun:function(){
                        $(".caosAppBg").fadeIn(100);
                    },
                    lightEle:'Light',
                    maskParticle:"ParticleMask",
                    particlePanel:'Particle',
                    largeMask:"largeMask"
                });
            },8000);

        },
        startWord:function(){
            var t = this;
            var num = 0;
            var wordStr = '';
            t.wordTimer = setInterval(function(){
                wordStr+=t.word[num++];
                if(num>t.word.length){
                    clearInterval(t.wordTimer);
                    num = 0;
                    t.wordTimer = setInterval(function(){
                        t.ellipsis+='.';
                        num++;
                        if(num>3){
                            t.ellipsis='';
                            num=0;
                        }else{
                            $(".caosAppOnLoad").html(t.ellipsis);
                        }
                    },300);
                }else{
                    $(".caosAppOnOpen").html(wordStr);
                }
            },300);
        },
        word:'正在开启您的CAOS"杭州之旅"',
        ellipsis:'',
        wordTimer:null
    };
    caosApp.init();
});
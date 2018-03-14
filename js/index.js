$(document).ready(function(){
    var caosApp = {
        init:function(){
            var t = this;
            t.startWord();
            setTimeout(function(){
                Particle.init({
                    beginFun:function(){
                        $(".caosAppWelcome").hide();
                        $(".caosAppDraw").show();
                        clearInterval(t.wordTimer);
                    },
                    lightEle:'Light',
                    particlePanel:'Particle'
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
                            $(".caosAppWelDot").html(t.ellipsis);
                        }
                    },300);
                }else{
                    $(".caosAppWelDes").html(wordStr);
                }
            },300);
        },
        word:'正在开启您的CAOS"杭州之旅"',
        ellipsis:'',
        wordTimer:null
    };
    caosApp.init();
});
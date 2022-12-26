// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D01 = typeof BlackHole3D01 !== "undefined" ? BlackHole3D01 : {};
BlackHole3D01["canvas"] = (function () {
    var canvas01 = document.getElementById('canvas01');
    return canvas01;
})();

BlackHole3D02 = typeof BlackHole3D02 !== "undefined" ? BlackHole3D02 : {};
BlackHole3D02["canvas"] = (function () {
    var canvas02 = document.getElementById('canvas02');
    return canvas02;
})();

//图形窗口改变时，需实时传递给引擎，否则模型会变形
window.onresize = function (event) {
    BlackHole3D01["m_re_em_window_width"] = window.innerWidth;
    BlackHole3D01["m_re_em_window_height"] = window.innerHeight;

    BlackHole3D02["m_re_em_window_width"] = window.innerWidth;
    BlackHole3D02["m_re_em_window_height"] = window.innerHeight;
}
// 刷新页面时需要卸载GPU内存
window.onbeforeunload = function (event) {
    if (typeof BlackHole3D01.REreleaseEngine != 'undefined') {
        BlackHole3D01.REreleaseEngine();
    }
    if (typeof BlackHole3D01.ctx != 'undefined') {
        if (BlackHole3D01.ctx.getExtension('WEBGL_lose_context') != null) {
            BlackHole3D01.ctx.getExtension('WEBGL_lose_context').loseContext();
        }
    }

    if (typeof BlackHole3D02.REreleaseEngine != 'undefined') {
        BlackHole3D02.REreleaseEngine();
    }
    if (typeof BlackHole3D02.ctx != 'undefined') {
        if (BlackHole3D02.ctx.getExtension('WEBGL_lose_context') != null) {
            BlackHole3D02.ctx.getExtension('WEBGL_lose_context').loseContext();
        }
    }
};

// 页面加载时添加相关监听事件
window.onload = function (event) {
    console.log("=========================== window.load()");
    if (typeof RE2SDKCreateModule != 'undefined') {
        console.log("======== RE2SDKCreateModule 存在");
        BlackHole3D01 = RE2SDKCreateModule(BlackHole3D01);
        BlackHole3D02 = RE2SDKCreateModule(BlackHole3D02);
    } else {
        console.log("======== RE2SDKCreateModule 不存在");
        document.addEventListener("RealEngineToBeReady", function () { BlackHole3D01 = RE2SDKCreateModule(BlackHole3D01); });
        document.addEventListener("RealEngineToBeReady", function () { BlackHole3D02 = RE2SDKCreateModule(BlackHole3D02); });
    }

    console.log("======== 添加监听事件");
    BlackHole3D01.canvas.addEventListener("RealEngineReady", RealBIMInitSys01);
    BlackHole3D01.canvas.addEventListener("RealBIMInitSys", RealBIMLoadMainSce01);
    BlackHole3D01.canvas.addEventListener("RealBIMLoadMainSce", MainSceDown01);
    BlackHole3D01.canvas.addEventListener("RealEngineRenderReady", showCanvas01);
    BlackHole3D01.canvas.addEventListener("RealBIMLoadProgress", LoadingProgress01);

    BlackHole3D02.canvas.addEventListener("RealEngineReady", RealBIMInitSys02);
    BlackHole3D02.canvas.addEventListener("RealBIMInitSys", RealBIMLoadMainSce02);
    BlackHole3D02.canvas.addEventListener("RealBIMLoadMainSce", MainSceDown02);
    BlackHole3D02.canvas.addEventListener("RealEngineRenderReady", showCanvas02);
    BlackHole3D02.canvas.addEventListener("RealBIMLoadProgress", LoadingProgress02);


    if ((typeof BlackHole3D01["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D01["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D01.RealBIMWeb != 'undefined')) {
        console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
        RealBIMInitSys01();
    }

    if ((typeof BlackHole3D02["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D02["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D02.RealBIMWeb != 'undefined')) {
        console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
        RealBIMInitSys02();
    }
}



//场景初始化，需正确传递相关参数
function RealBIMInitSys01() {
    console.log("=========================== 【01】  引擎底层初始化完成");
    progressFn(0.5, "RealEngine/WorkerJS Begin Init", "canvas01");

    var workerjspath = "javascript/RealBIMWeb_Worker.js";
    var width = window.innerWidth; var height = window.innerHeight;
    var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
    var username = "admin"; var password = "xiyangyang";

    BlackHole3D01.REinitSys(workerjspath, width, height, commonurl, username, password);
    BlackHole3D01.REsetUseWebCache(false);//是否允许使用浏览器缓存
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce01(e) {
    console.log("=========================== 【01】  场景初始化完成");
    var isSuccess = e.detail.succeed;

    if (isSuccess) {
        console.log("=========================== 【01】   场景初始化 --> 成功！！！");
        //倾斜摄影proj1的测试场景
        var projInfo = [
            {
                "projName": "pro01",
                "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
                "projResName": "res_jifang",
                "useNewVer": true,
                "verInfo": 0,
                "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
                "projCRS": "",
                "projNorth": 0.0
            }
        ];
        BlackHole3D01.REloadMainSce_projs(projInfo);
        // 设置全局渲染性能控制参数
        BlackHole3D01.REsetMaxResMemMB(5500);
        BlackHole3D01.REsetExpectMaxInstMemMB(4500);
        BlackHole3D01.REsetExpectMaxInstDrawFaceNum(20000000);
        BlackHole3D01.REsetPageLoadLev(2);

    } else {
        console.log("=========================== 【01】   场景初始化 --> 失败！！！");
    }

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown01(e) {
    console.log("=========================== 【01】  引擎主场景模型加载完成");
    if (e.detail.succeed) {
        console.log("=========================== 【01】  引擎主场景模型加载 --> 成功！！！");
    } else {
        console.log("=========================== 【01】   引擎主场景模型加载 --> 部分模型加载失败！！！");
    }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas01() {
    console.log("=========================== 【01】  引擎渲染器初始化完成");
    document.getElementById('canvas01').style.display = "block";
    BlackHole3D01.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function LoadingProgress01(e) {
    var percent = e.detail.progress; var info = e.detail.info;
    progressFn(percent, info, "canvas01");
}












//场景初始化，需正确传递相关参数
function RealBIMInitSys02() {
    console.log("=========================== 【02】  引擎底层初始化完成");
    progressFn(0.5, "RealEngine/WorkerJS Begin Init", "canvas02");

    var workerjspath = "javascript/RealBIMWeb_Worker.js";
    var width = window.innerWidth; var height = window.innerHeight;
    var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
    var username = "admin"; var password = "xiyangyang";

    BlackHole3D02.REinitSys(workerjspath, width, height, commonurl, username, password);
    BlackHole3D02.REsetUseWebCache(false);//是否允许使用浏览器缓存
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce02(e) {
    console.log("=========================== 【02】  场景初始化完成");
    var isSuccess = e.detail.succeed;
    
    if (isSuccess) {
        console.log("=========================== 【02】   场景初始化 --> 成功！！！");
        //倾斜摄影proj1的测试场景
        var projInfo = [
            {
                "projName": "pro02",
                "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
                "projResName": "res_youeryuanpd",
                "useNewVer": true,
                "verInfo": 0,
                "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
                "projCRS": "",
                "projNorth": 0.0
            }
        ];
        BlackHole3D02.REloadMainSce_projs(projInfo);
        // 设置全局渲染性能控制参数
        BlackHole3D02.REsetMaxResMemMB(5500);
        BlackHole3D02.REsetExpectMaxInstMemMB(4500);
        BlackHole3D02.REsetExpectMaxInstDrawFaceNum(20000000);
        BlackHole3D02.REsetPageLoadLev(2);

    } else {
        console.log("=========================== 【02】   场景初始化 --> 失败！！！");
    }

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown02(e) {
    console.log("=========================== 【02】 引擎主场景模型加载完成");
    if (e.detail.succeed) {
        console.log("=========================== 【02】  引擎主场景模型加载 --> 成功！！！");
    } else {
        console.log("=========================== 【02】   引擎主场景模型加载 --> 部分模型加载失败！！！");
    }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas02() {
    console.log("=========================== 【02】  引擎渲染器初始化完成");

    document.getElementById('canvas02').style.display = "block";
    BlackHole3D02.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function LoadingProgress02(e) {
    var percent = e.detail.progress; var info = e.detail.info;
    progressFn(percent, info, "canvas02");
}
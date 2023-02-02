// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D = typeof BlackHole3D !== "undefined" ? BlackHole3D : {};
BlackHole3D["canvas"] = (function () {
    var canvas = document.getElementById('canvas');
    return canvas;
})();

//图形窗口改变时，需实时传递给引擎，否则模型会变形
window.onresize = function (event) {
    BlackHole3D["m_re_em_window_width"] = BlackHole3D.canvas.clientWidth;
    BlackHole3D["m_re_em_window_height"] = BlackHole3D.canvas.clientHeight;
}
// 刷新页面时需要卸载GPU内存
window.onbeforeunload = function (event) {
    if (typeof BlackHole3D.REreleaseEngine != 'undefined') {
        BlackHole3D.REreleaseEngine();
    }
    if (typeof BlackHole3D.ctx != 'undefined') {
        if (BlackHole3D.ctx.getExtension('WEBGL_lose_context') != null) {
            BlackHole3D.ctx.getExtension('WEBGL_lose_context').loseContext();
        }
    }
};

// 页面加载时添加相关监听事件
window.onload = function (event) {
    console.log("=========================== window.load()");
    if (typeof CreateBlackHoleWebSDK != 'undefined') {
        console.log("======== RE2SDKCreateModule 存在");
        BlackHole3D = CreateBlackHoleWebSDK(BlackHole3D);
    } else {
        console.log("======== RE2SDKCreateModule 不存在");
        document.addEventListener("RealEngineToBeReady", function () { BlackHole3D = CreateBlackHoleWebSDK(BlackHole3D); });
    }

    console.log("======== 添加监听事件");
    document.addEventListener("RealEngineReady", RealBIMInitSys);
    document.addEventListener("RealBIMInitSys", RealBIMLoadMainSce);
    document.addEventListener("RealBIMLoadMainSce", MainSceDown);
    document.addEventListener("RealEngineRenderReady", showCanvas);
    document.addEventListener("RealBIMLoadProgress", LoadingProgress);

    document.addEventListener("RealBIMPolyClipping", RealBIMPolyClipping);


    if ((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')) {
        console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
        RealBIMInitSys();
    }
}

function RealBIMPolyClipping(e) {
    console.log(e);
}


//场景初始化，需正确传递相关参数
function RealBIMInitSys() {
    console.log("=========================== 引擎底层初始化完成");
    progressFn(0.5, "RealEngine/WorkerJS Begin Init");

    var sysModel = new BlackHole3D.RESysModel();
    sysModel.workerjsPath = "javascript/RealBIMWeb_Worker.js";
    sysModel.renderWidth = BlackHole3D.canvas.clientWidth;
    sysModel.renderHieght = BlackHole3D.canvas.clientHeight;
    sysModel.commonUrl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
    sysModel.userName = "admin";
    sysModel.passWord = "xiyangyang";
    BlackHole3D.initEngineSys(sysModel);
    BlackHole3D.REsetUseWebCache(false);//是否允许使用浏览器缓存
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce(e) {
    console.log("当前 WebSDK 运行版本", BlackHole3D.getVersion());
    console.log(BlackHole3D.RE_ViewportType.BIM);


    console.log("=========================== 场景初始化完成");
    var isSuccess = e.detail.succeed;

    if (isSuccess) {
        console.log("===========================  场景初始化 --> 成功！！！");
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
        BlackHole3D.REloadMainSce_projs(projInfo);
        // 设置全局渲染性能控制参数
        BlackHole3D.REsetMaxResMemMB(5500);
        BlackHole3D.REsetExpectMaxInstMemMB(4500);
        BlackHole3D.REsetExpectMaxInstDrawFaceNum(20000000);
        BlackHole3D.REsetPageLoadLev(2);
    } else {
        console.log("===========================  场景初始化 --> 失败！！！");
    }

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(e) {
    console.log("=========================== 引擎主场景模型加载完成 ");
    if (e.detail.succeed) {
        console.log("=========================== 引擎主场景模型加载 --> 成功！！！");
    } else {
        console.log("===========================  引擎主场景模型加载 --> 部分模型加载失败！！！");
    }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas() {
    console.log("=========================== 引擎渲染器初始化完成 ");
    document.getElementById('canvas').style.display = "block";
    BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function LoadingProgress(e) {
    var percent = e.detail.progress; var info = e.detail.info;
    progressFn(percent, info);
}






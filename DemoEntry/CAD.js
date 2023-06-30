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
    if (typeof BlackHole3D.releaseEngine != 'undefined') {
        BlackHole3D.releaseEngine();
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

    addREListener();//添加监听事件
}

function addREListener() {
    console.log("======== 添加监听事件");
    //系统监听
    document.addEventListener("RESystemReady", RESystemReady);//系统初始化完成回调
    document.addEventListener("RESystemEngineCreated", RESystemEngineCreated);//系统引擎创建完成回调
    document.addEventListener("RESystemRenderReady", RESystemRenderReady);//数据集模型加载进度反馈
    document.addEventListener("REDataSetLoadProgress", REDataSetLoadProgress);//数据集模型加载进度反馈

    //探测
    document.addEventListener("RESystemSelElement", RESystemSelElement);//鼠标探测模型事件（左键单击和右键单击）
    document.addEventListener("RESystemSelShpElement", RESystemSelShpElement);//鼠标探测矢量元素事件
    document.addEventListener("RECADSelElement", RECADSelElement);//二维图元点击事件
    document.addEventListener("RECADSelAnchor", RECADSelAnchor);//二维图元锚点点击事件
    document.addEventListener("RECADSelShpAnchor", RECADSelShpAnchor);//二维图元矢量锚点点击事件

    //操作
    document.addEventListener("RELocateCam", RELocateCam);//调整相机方位完成事件

    //加载
    document.addEventListener("RECADLoadFinish", RECADLoadFinish);//二维图纸加载完成事件
}

//场景初始化，需正确传递相关参数
function RESystemReady() {
    console.log("=========================== 引擎底层初始化完成");
    progressFn(0.5, "RealEngine/WorkerJS Begin Init");

    var sysInfo = new BlackHole3D.RESysInfo();
    sysInfo.workerjsPath = "javascript/RealBIMWeb_Worker.js";
    sysInfo.renderWidth = BlackHole3D.canvas.clientWidth;
    sysInfo.renderHieght = BlackHole3D.canvas.clientHeight;
    sysInfo.commonUrl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
    sysInfo.userName = "admin";
    sysInfo.passWord = "xiyangyang";
    sysInfo.mainWndName = "BlackHole3D";
    BlackHole3D.initEngineSys(sysInfo);
    BlackHole3D.Common.setUseWebCache(false);//是否允许使用浏览器缓存
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RESystemEngineCreated(e) {
    console.log("当前 WebSDK 运行版本", BlackHole3D.getVersion());
    console.log("=========================== 场景初始化完成");
    var isSuccess = e.detail.succeed;

    if (isSuccess) {
        console.log("===========================  场景初始化 --> 成功！！！");

        loadCAD();//加载CAD

        // 设置全局渲染性能控制参数
        BlackHole3D.Common.setMaxResMemMB(5500);
        BlackHole3D.Common.setExpectMaxInstMemMB(4500);
        BlackHole3D.Common.setExpectMaxInstDrawFaceNum(20000000);
        BlackHole3D.Common.setPageLoadLev(2);
    } else {
        console.log("===========================  场景初始化 --> 失败！！！");
    }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function RESystemRenderReady() {
    console.log("=========================== 引擎渲染器初始化完成 ");
    document.getElementById('canvas').style.display = "block";
    BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function REDataSetLoadProgress(e) {
    var percent = e.detail.progress; var info = e.detail.info;
    progressFn(percent, info);
}

function RESystemSelShpElement(e) {
    console.log('-- 鼠标探测矢量元素事件 --', BlackHole3D.Probe.getCurCombProbeRet());
}

function RECADSelElement(e) {
    console.log("-- 二维图元点击事件 --", e.detail);
}

function RECADLoadFinish(e) {
    console.log("-- CAD加载完成事件 --");
    progressFn(100, "CAD Load Finish");
}

function RESystemSelElement(e) {
    console.log('-- 鼠标探测模型事件 --', BlackHole3D.Probe.getCurCombProbeRet());
}

function RELocateCam(e) {
    console.log("-- 相机运动完成事件 --", e.detail);
}

function RECADSelAnchor(e) {
    console.log("-- 二维图元锚点点击事件 --", e.detail);
}

function RECADSelShpAnchor(e) {
    console.log("-- 二维图元矢量锚点点击事件 --", e.detail);
}

//加载CAD
function loadCAD() {
    BlackHole3D.setViewMode(BlackHole3D.REVpTypeEm.None, BlackHole3D.REVpTypeEm.CAD, 0);
    BlackHole3D.CAD.loadCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_cad/103-Floor Plan - 三层建筑平面图.dwg", BlackHole3D.RECadUnitEm.CAD_UNIT_Millimeter, 1.0);
}

//添加CAD锚点
function addCADAnc() {
    var ancList = [];
    var anc = new BlackHole3D.RECADAnc();
    anc.anchorId = "anchor";
    anc.pos = [15, 15];
    anc.style = 2;
    anc.innerClr = new BlackHole3D.REColor(255, 0, 0, 255);
    anc.extClr = new BlackHole3D.REColor(0, 255, 0, 255);
    ancList.push(anc);
    BlackHole3D.CAD.addAnc(ancList);
}


//添加CAD矢量锚点
function addCADShpAnc() {
    //添加矢量锚点
    var arrCadAnc = [];
    var model = new BlackHole3D.RECADShpAnc();
    model.pos = [1, 0];
    model.text = "test";
    model.textClr = new BlackHole3D.REColor(255, 0, 255, 255);
    model.textSize = 16;
    model.shpPath = "https://demo.bjblackhole.com/BlackHole3.0/imgs/1.svg";
    model.groupId = "group01";
    model.anchorId = "anchor001";
    model.textAlign = [0, 0];

    arrCadAnc.push(model);
    BlackHole3D.CAD.addShpAnc(arrCadAnc);
}





















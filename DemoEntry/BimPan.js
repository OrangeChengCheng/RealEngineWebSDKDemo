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
    document.addEventListener("REDataSetLoadFinish", REDataSetLoadFinish);//场景模型加载完成回调
    document.addEventListener("RESystemRenderReady", RESystemRenderReady);//数据集模型加载进度反馈
    document.addEventListener("REDataSetLoadProgress", REDataSetLoadProgress);//数据集模型加载进度反馈

    //探测
    document.addEventListener("RESystemSelElement", RESystemSelElement);//鼠标探测模型事件（左键单击和右键单击）
    document.addEventListener("RESystemSelShpElement", RESystemSelShpElement);//鼠标探测矢量元素事件

    //加载
    document.addEventListener("REDataSetLoadPanFinish", REDataSetLoadPanFinish);//全景场景加载完成事件
    document.addEventListener("REPanLoadSingleFinish", REPanLoadSingleFinish);//全景场景中某一帧全景图设置成功的事件
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

        loadModel()//加载模型
        loadPan();//加载360全景
        // loadCAD();//加载CAD

        // 设置全局渲染性能控制参数
        BlackHole3D.Common.setMaxResMemMB(5500);
        BlackHole3D.Common.setExpectMaxInstMemMB(4500);
        BlackHole3D.Common.setExpectMaxInstDrawFaceNum(20000000);
        BlackHole3D.Common.setPageLoadLev(2);
    } else {
        console.log("===========================  场景初始化 --> 失败！！！");
    }
}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function REDataSetLoadFinish(e) {
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

function RESystemSelElement(e) {
    console.log('-- 鼠标探测模型事件 --', BlackHole3D.Probe.getCurCombProbeRet());
}

//全景场景加载完成，此时可获取全部点位信息
function REDataSetLoadPanFinish(e) {
    console.log("-- 全景场景加载完成事件 --", e.detail);
    var isSuccess = e.detail.succeed;
    if (isSuccess) {
        console.log("===========================  360全景加载成功");
        BlackHole3D.setViewSyn(true);
        BlackHole3D.Panorama.setCamLocateTo(BlackHole3D.RECamDirEm.CAM_DIR_LEFT, 0);
        // 设置窗口模式
        BlackHole3D.setViewMode(BlackHole3D.REVpTypeEm.Panorama, BlackHole3D.REVpTypeEm.BIM, BlackHole3D.REVpRankEm.LR);
        // 获取全部帧信息
        var pandata = BlackHole3D.Panorama.getElemInfo("pan01");
        // 设置360显示信息
        BlackHole3D.Panorama.loadPanPic(pandata[0].elemId, 0);
    } else {
        console.log("===========================  360全景加载失败");
    }
}
//全景场景图片设置成功
function REPanLoadSingleFinish(e) {
    console.log("-- 全景场景中某一帧全景图设置成功的事件 --", e.detail);
    var isSuccess = e.detail.succeed;
    if (isSuccess) {
        console.log("===========================  图片设置成功");
    } else {
        console.log("===========================  图片设置失败");
    }
}

// 加载模型
function loadModel() {
    var dataSetList = [
        {
            "dataSetId": "厂房",
            "resourcesAddress": "https://isuse.bjblackhole.com/default.aspx?dir=blackhole_res13&path=862ad9a07106441da8f2a677e0e35ff9",
            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [10, 10, 10]],
            "dataSetCRS": "", "dataSetCRSNorth": 0.0
        },
    ];
    BlackHole3D.Model.loadDataSet(dataSetList);
}


//加载360
function loadPan() {
    var dataSetList = [
        {
            "dataSetId": "pan01",
            "resourcesAddress": "https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078ce7d766a927f0f4147af5ebe82e",
        }
    ];
    BlackHole3D.Panorama.loadPan(dataSetList);
}

















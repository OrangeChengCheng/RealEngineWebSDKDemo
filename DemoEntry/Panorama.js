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
    document.addEventListener("REPanSelShpElement", REPanSelShpElement);//全景场景鼠标拾取事件
    document.addEventListener("REMiniMapCADSelShpAnchor", REMiniMapCADSelShpAnchor);//小地图中的CAD锚点点击事件

    //加载
    document.addEventListener("REDataSetLoadPanFinish", REDataSetLoadPanFinish);//全景场景加载完成事件
    document.addEventListener("REPanLoadSingleFinish", REPanLoadSingleFinish);//全景场景中某一帧全景图设置成功的事件
    document.addEventListener("REMiniMapLoadCAD", REMiniMapLoadCAD);//小地图中的CAD数据加载完成事件
    document.addEventListener("REPanCamAutoForwardFinish", REPanCamAutoForwardFinish);//全景图的自动前进后退完成回调事件
}

//场景初始化，需正确传递相关参数
function RESystemReady() {
    // BlackHole3D.addAuthorPath("RealEngineInitAuthorPath", "http://realbim.bjblackhole.cn:18080/author/author_path02.txt");
    // BlackHole3D.addPathIndex("RealEngineInitPathIndex", "http://realbim.bjblackhole.cn:18080/res/", "http://realbim.bjblackhole.cn:18080/pathindex/res/index.xml");    
    console.log("=========================== 引擎底层初始化完成");
    progressFn(0.5, "RealEngine/WorkerJS Begin Init");

    var sysInfo = new BlackHole3D.RESysInfo();
    sysInfo.workerjsPath = "javascript/RealBIMWeb_Worker.js";
    sysInfo.renderWidth = BlackHole3D.canvas.clientWidth;
    sysInfo.renderHieght = BlackHole3D.canvas.clientHeight;
    sysInfo.commonUrl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
    //sysInfo.commonUrl = "http://realbim.bjblackhole.cn:18080/res/res_gol006";
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

        loadPan();//加载360全景

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

function REPanSelShpElement(e) {
    console.log("-- 全景场景鼠标拾取事件 --", e.detail);
}

function REMiniMapCADSelShpAnchor(e) {
    console.log("-- 小地图中的CAD锚点点击事件 --", e.detail);
}

function REPanCamAutoForwardFinish(e) {
    console.log("-- 全景图的自动前进后退完成回调事件 --", e.detail);
}

//全景场景加载完成，此时可获取全部点位信息
function REDataSetLoadPanFinish(e) {
    console.log("-- 全景场景加载完成事件 --", e.detail);
    progressFn(100, "Panorama Load Finish");
    var isSuccess = e.detail.succeed;
    if (isSuccess) {
        console.log("===========================  360全景加载成功");
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
        // 设置窗口模式
        BlackHole3D.setViewMode(BlackHole3D.REVpTypeEm.Panorama, BlackHole3D.REVpTypeEm.None, BlackHole3D.REVpRankEm.Single);
        //加载概略图CAD数据  
        // setOverViewSize();
        // addCADData();
    } else {
        console.log("===========================  图片设置失败");
    }
}

function REMiniMapLoadCAD(e) {
    console.log("-- 小地图中的CAD数据加载完成事件 --", e.detail);
    BlackHole3D.MiniMap.setVisible(true);//设置概略图显示状态
    BlackHole3D.MiniMap.setShowRangeRefresh();//调整CAD小地图显示，缩放到当前小地图展示范围
}

//加载360
function loadPan() {
    var dataSetList = [
        {
            "dataSetId": "pan01",
            // "resourcesAddress": "https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078ce7d766a927f0f4147af5ebe82e",
            "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res14&path=3a0c13733a5a99e08f2b94ff8f593c39",
        },
        // {
        //     "dataSetId": "pan01",
        //     "resourcesAddress": "http://realbim.bjblackhole.cn:18080/res/3a0aaaf8c13ea016ade7fde73533b739",
        // },
    ];
    BlackHole3D.Panorama.loadPan(dataSetList);
}

//设置全景相机
function setPanCam() {
    var panInfoList = BlackHole3D.Panorama.getElemInfo("pan01");
    var panElem1 = panInfoList[1];
    var panElem2 = panInfoList[2];
    BlackHole3D.Panorama.setCamLocateToDestPos(panElem1.pos, panElem2.pos, 0);
}

// 添加360锚点
function addPanAnc() {
    var panInfoList = BlackHole3D.Panorama.getElemInfo("pan01");
    var panAncList = [];
    for (let j = 0; j < panInfoList.length; j++) {
        var panElem = panInfoList[j];

        var model = new BlackHole3D.REPanAnc();
        //model.panWindow = 0;//选填
        model.ancName = "锚点:" + j;
        model.pos = panElem.pos;
        model.picPath = "https://demo.bjblackhole.com/imgs/bubbley.png";
        model.picSize = [60, 60];
        model.texFocus = [-1, -1];
        model.text = "前进";
        model.textClr = new BlackHole3D.REColor(0, 255, 255);
        model.useTexPos = false;
        model.texBias = [-1, -1];
        model.texPos = [30, 30];

        panAncList.push(model);
    }
    BlackHole3D.Panorama.addAnc(panAncList);
}

//设置概略图尺寸
function setOverViewSize() {
    BlackHole3D.MiniMap.setMaxRegion([300, 300]);//设置概略图最大的宽高
    var scaleOrigin = [0, 0];//原点相对于主界面宽高的比例 [0,0]  取值范围0-1
    var scaleDiagonal = [0.5, 0.5];//对角点相对于主界面宽高的比例 [0.3,0.3]  取值范围0-1
    BlackHole3D.MiniMap.setRegion(scaleOrigin, scaleDiagonal);//设置概略图占据主界面宽高比例
}

//加载概略图CAD数据
function addCADData() {
    BlackHole3D.MiniMap.loadCAD("https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078cdabb2e98a3b98e1960acfa15c6/1/638041974736297275.dwg", BlackHole3D.RECadUnitEm.CAD_UNIT_Millimeter, 1.0);
}

















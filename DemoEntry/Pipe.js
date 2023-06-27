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

    //操作
    document.addEventListener("REAddContPipeSuccessEvent", REAddContPipeSuccessEvent);//连续管道编辑右键结束编辑回调事件
    document.addEventListener("REGenPipeCenterLineProgress", REGenPipeCenterLineProgress);//连续管道生成中心线进度回调事件
}

//场景初始化，需正确传递相关参数
function RESystemReady() {
    console.log("=========================== 引擎底层初始化完成");
    progressFn(0.5, "RealEngine/WorkerJS Begin Init");

    var sysInfo = new BlackHole3D.RESysInfo();
    sysInfo.workerjsPath = "javascript/RealBIMWeb_Worker.js";
    sysInfo.renderWidth = BlackHole3D.canvas.clientWidth;
    sysInfo.renderHieght = BlackHole3D.canvas.clientHeight;
    sysInfo.commonUrl = "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_gol001";
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

        loadModel()//加载模型

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
        console.log("=========================== 引擎主场景模型加载 --> 成功！！！")

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

function RESystemSelElement(e) {
    console.log('-- 鼠标探测模型事件 --', BlackHole3D.Probe.getCurCombProbeRet());
}

function REAddContPipeSuccessEvent(e) {
    console.log('-- 连续管道编辑右键结束编辑回调事件 --', e);
}

function REGenPipeCenterLineProgress(e) {
    console.log('-- 连续管道生成中心线进度回调事件 --', e);
}


// 加载模型
function loadModel() {
    var dataSetList = [
        {
            "dataSetId": "机房01",
            "resourcesAddress": "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_jifang",
            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            "dataSetCRS": "", "dataSetCRSNorth": 0.0
        },
        {
            "dataSetId": "机房02",
            "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [10, 10, 10]],
            "dataSetCRS": "", "dataSetCRSNorth": 0.0
        },
    ];
    BlackHole3D.Model.loadDataSet(dataSetList);
}


// 添加连续管道
function addPipe() {
    var pipeInfo = new BlackHole3D.REPipeInfo();
    pipeInfo.dataSetId = "机房01";
    pipeInfo.pipeId = "pipe01";
    pipeInfo.elemIdList = [728, 735, 749, 757, 751, 731, 729];
    BlackHole3D.Pipe.addContPipe(pipeInfo);
}


//显示中心线
function showCenterLine() {
    //矢量文字信息
    var shpTextInfo = new BlackHole3D.REShpTextInfo();
    shpTextInfo.text = "测试画线";
    shpTextInfo.texBias = [1, 0];
    shpTextInfo.fontName = "RealBIMFont001";
    shpTextInfo.textClr = new BlackHole3D.REColor(255, 255, 255, 255);
    shpTextInfo.textBorderClr = new BlackHole3D.REColor(0, 0, 0, 128);
    shpTextInfo.textBackMode = 2;
    shpTextInfo.textBackBorder = 2;
    shpTextInfo.textBackClr = new BlackHole3D.REColor(0, 0, 0, 128);
    //矢量线信息
    var lineShpInfo = new BlackHole3D.RELineShpInfo();
    lineShpInfo.shpName = "lineShp001";
    lineShpInfo.potList = [[7.1701436042785645, 48.223918914794922, 4.2983889579772949],
    [11.831266403198242, 48.225959777832031, 4.3002581596374512],
    [12.217000007629395, 48.347602844238281, 4.3000001907348633],
    [12.33899974822998, 49.225601196289062, 4.3000001907348633],
    [12.461000442504883, 50.103599548339844, 4.3000001907348633],
    [14.504650115966797, 50.225601196289062, 4.3000001907348633],
    [16.548299789428711, 50.347602844238281, 4.3000001907348633],
    [16.670528411865234, 50.733585357666016, 4.300051212310791],
    [16.670173645019531, 58.365646362304688, 4.2994098663330078]];
    lineShpInfo.fillState = 0;
    lineShpInfo.lineClr = new BlackHole3D.REColor(255, 0, 0, 255);
    lineShpInfo.fillClr = new BlackHole3D.REColor(255, 255, 255, 128);
    lineShpInfo.textPos = -2;
    lineShpInfo.scrASDist = -1.0;
    lineShpInfo.scrVisDist = 300.0;
    lineShpInfo.contactSce = false;
    lineShpInfo.lineWidth = 2;
    lineShpInfo.textInfo = shpTextInfo;

    var addlineShpBool = BlackHole3D.Geometry.addPolylineShp(lineShpInfo);
    console.log(addlineShpBool);
}




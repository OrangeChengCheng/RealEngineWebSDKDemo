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
    document.addEventListener("RELocateCam", RELocateCam);//调整相机方位完成事件
    // document.addEventListener("REClipFinish", REClipFinish);//裁剪完成回调事件

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

function RESystemSelElement(e) {
    console.log('-- 鼠标探测模型事件 --', BlackHole3D.Probe.getCurCombProbeRet());
}

function RELocateCam(e) {
    console.log("-- 相机运动完成事件 --", e.detail);
}

// function REClipFinish(e) {
//     console.log("-- 裁剪完成回调事件 --", e.detail);
// }


// 加载模型
function loadModel() {
    var dataSetList = [
        {
            "dataSetId": "机房01",
            "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            "dataSetCRS": "", "dataSetCRSNorth": 0.0
        },
        // {
        //     "dataSetId": "机房02",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [10, 10, 10]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "天台",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_lunkuoxian",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "厂房",
        //     "resourcesAddress": "https://isuse.bjblackhole.com/default.aspx?dir=blackhole_res13&path=862ad9a07106441da8f2a677e0e35ff9",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [10, 10, 10]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "小房子",
        //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a0960059327a3a6b63933ed6fb956cc",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "桥",
        //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a09611aa1c3c4a7d1624c205c42c7af",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "长地形缩小百倍",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_osgbmerge01",
        //     "useTransInfo": true, "transInfo": [[0.01, 0.01, 0.01], [0, 0, 0, 1], [0, 0, 0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "长地形原始比例",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_osgbmerge01",
        //     "useTransInfo": true, "transInfo": [[0.1, 0.1, 0.1], [0, 0, 0, 1], [0, 0, 0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "地图",
        //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a096c1a61a7e6545c97e8a1cc6ca1be",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "WMTS",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0a104eddec7ef18b3032cdd64bd6f1",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "版本比对",
        //     "resourcesAddress": "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_version01",
        //     "useAssginVer": true, "assginVer": 1,
        //     "useAssginVer2": true, "assginVer2": 0x7fffffff,
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        // },
        // {
        //     "dataSetId": "白膜房子",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0a100ac716dd9cf6b7902a647a402f",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "收费站",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0a100acd1f3f95c49237d217930cf0",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "遥感影像",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0a103c21c2baf731084972b86062b4",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "倾斜摄影",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0a103d9ced4377fc191fc9e628d642",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "点云",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0a104240a67efb614a08cbe5bed24d",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "河流地形",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0a104eddec7ef18b3032cdd64bd6f1",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "大片房子",
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res08&path=3a09b3f0eee81543b873bb5a004d2717",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "管道",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/engineres/requestengineres?dir=url_res17&path=3a0a48e70c36a81e8c8dc5e15024bd0d",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "社区楼房",
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/engineres/requestengineres?dir=url_res08&path=3a0a4409fd840205a66b4d2ee7f5288a",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "地形桥",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a09f5926b4c7b2cd091d90c5cc5bfd3",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "花园",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res17&path=3a0a6795f0b2d41f358b67e6ef572ed4",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        {
            "dataSetId": "楼房+地形",
            "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_nanhuiskp",
            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            "dataSetCRS": "", "dataSetCRSNorth": 0.0
        },
    ];
    BlackHole3D.Model.loadDataSet(dataSetList);
}




function setSky() {
    var skyInfo = new BlackHole3D.RESkyInfo();
    skyInfo.skyTexPaths = [
        "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=skybox/right.jpg",
        "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=skybox/left.jpg",
        "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=skybox/front.jpg",
        "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=skybox/back.jpg",
        "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=skybox/top.jpg",
        "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=skybox/bottom.jpg"
    ];
    skyInfo.sunMode = 1;
    skyInfo.sunDir = [-0.707005, 0.700468, -0.097413];
    skyInfo.isNight = true;
    skyInfo.exposeScale = 1.0;
    BlackHole3D.SkyBox.setSkyInfo(skyInfo);

}



//添加锚点
function addAnc() {
    var ancList = [
        {
            "groupName": "camera",
            "ancName": "anc01",
            "pos": [-20, -20, 10],
            "picPath": "",
            "textInfo": "未拆迁",
            "picWidth": 32,
            "picHeight": 32,
            "useLod": true,
            "linePos": [0, 100],
            "lineClr": new BlackHole3D.REColor(255, 0, 0, 255),//红色
            "ancSize": 60,
            "selfAutoScaleDist": -1,
            "selfVisDist": -1,
            "textBias": [1, 0],
            "textFocus": [0, 0]
        }, {
            "ancName": "anc02",
            "pos": [70.8, 76.481, 0],
            "picPath": "",
            "textInfo": "已拆迁",
            "picWidth": 32,
            "picHeight": 32,
            "useLod": true,
            "linePos": [0, 50],
            "lineClr": { red: 255, green: 0, blue: 0, alpha: 255 },//红色
            "ancSize": 60,
            "selfAutoScaledist": -1,
            "selfVisDist": -1,
            "textBias": [1, 0],
            "textFocus": [0, 0]
        }
    ];
    BlackHole3D.Anchor.addAnc(ancList);
}


//添加闪烁锚点
function addAncAnim() {
    var ancList = [
        {
            "ancName": "anc01",
            "pos": [-25, -26, 10],
            "picPath": "",
            "picWidth": 32,
            "picHeight": 32,
            "textInfo": "张三",
            "picNum": 3,
            "playFrame": 2
        }
    ];
    BlackHole3D.Anchor.addAnimAnc(ancList);
}

//设置聚合锚点
function addAncLOD() {
    //锚点样式信息
    var mergestyle = new BlackHole3D.REAncInfo();
    mergestyle.picPath = "";
    mergestyle.picWidth = 60;
    mergestyle.picHeight = 60;
    mergestyle.textBias = [1, 0];
    mergestyle.fontName = "RealBIMFont001";
    mergestyle.textColor = new BlackHole3D.REColor(255, 255, 255, 255);
    mergestyle.textBorderColor = new BlackHole3D.REColor(0, 0, 0, 128);
    //聚合信息
    var ancLODInfo = new BlackHole3D.REAncLODInfo();
    ancLODInfo.groupName = "group01";
    ancLODInfo.lodLevel = 10;
    ancLODInfo.useCustomBV = true;
    ancLODInfo.customBV = [[100, 100, -100], [500, 500, 500]];
    ancLODInfo.lodMergePxl = 300.0;
    ancLODInfo.lodMergeCap = 3;
    ancLODInfo.mergeStyle = mergestyle;
    //设置聚合锚点信息
    BlackHole3D.Anchor.setAncLODInfo(ancLODInfo);
}


//添加矢量点
function addPointShp() {
    //矢量文字信息
    var shpTextInfo = new BlackHole3D.REShpTextInfo();
    shpTextInfo.text = "未拆迁";
    shpTextInfo.textBias = [1, 0];
    shpTextInfo.fontName = "RealBIMFont001";
    shpTextInfo.textClr = new BlackHole3D.REColor(255, 255, 255, 255);
    shpTextInfo.textBorderClr = new BlackHole3D.REColor(0, 0, 0, 204);
    shpTextInfo.textBackMode = 2;
    shpTextInfo.textBackBorder = 2;
    shpTextInfo.textBackClr = new BlackHole3D.REColor(0, 0, 0, 204);
    //矢量点信息
    var potShpInfo = new BlackHole3D.REPotShpInfo();
    potShpInfo.shpName = "potShp001";
    potShpInfo.pos = [5.394, 14.598, 0.0];
    potShpInfo.potSize = 4;
    potShpInfo.potClr = new BlackHole3D.REColor(255, 0, 0, 255);
    potShpInfo.scrASDist = -1.0;
    potShpInfo.scrVisDist = -1.0;
    potShpInfo.contactSce = false;
    potShpInfo.textInfo = shpTextInfo;

    var addPosShpBool = BlackHole3D.Geometry.addPotShp(potShpInfo);
    console.log(addPosShpBool);
}

// 添加矢量折线
function addLineShp() {
    //矢量文字信息
    var shpTextInfo = new BlackHole3D.REShpTextInfo();
    shpTextInfo.text = "测试画线";
    shpTextInfo.textBias = [1, 0];
    shpTextInfo.fontName = "RealBIMFont001";
    shpTextInfo.textClr = new BlackHole3D.REColor(255, 255, 255, 255);
    shpTextInfo.textBorderClr = new BlackHole3D.REColor(0, 0, 0, 128);
    shpTextInfo.textBackMode = 2;
    shpTextInfo.textBackBorder = 2;
    shpTextInfo.textBackClr = new BlackHole3D.REColor(0, 0, 0, 128);
    //矢量线信息
    var lineShpInfo = new BlackHole3D.RELineShpInfo();
    lineShpInfo.shpName = "lineShp001";
    lineShpInfo.potList = [[15.821551318975999, 17.619940136002967, 0.000018728150966040857],
    [15.821551745332034, 18.969940110334004, 0.00001945166156147593],
    [13.771586103520088, 17.619892309623157, -0.00000452473561729505]];
    lineShpInfo.fillState = 1;
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

//添加多边形围栏
function addFenceShp() {
    //矢量围栏信息
    var fenceShpInfo = new BlackHole3D.REFenceShpInfo();
    fenceShpInfo.shpName = "fenceShp001";
    fenceShpInfo.potList = [[14.717769348031592, 57.95791001082713, -0.000030016697266432857, 3],
    [11.833832403710415, 57.88562541960681, -0.000031201471490049926, 4],
    [12.011666543451309, 54.24507412739243, -0.00003062040975443381, 2],
    [14.82709974581475, 54.341189629415496, -0.00003190398601304878, 2]];
    fenceShpInfo.isClose = true;
    fenceShpInfo.fenceClr = new BlackHole3D.REColor(255, 255, 255, 128);
    fenceShpInfo.scrASDist = -1.0;
    fenceShpInfo.scrVisDist = 300.0;
    fenceShpInfo.contactSce = true;

    var addFenceeShpBool = BlackHole3D.Geometry.addPolyFenceShp(fenceShpInfo);
    console.log(addFenceeShpBool);
}


//改变构件颜色
function changeElemClr() {
    var dataSetId = "dataSet01";
    var elemIdList = [1062, 1014];
    var clr = new BlackHole3D.REColor(255, 0, 0, -1);
    BlackHole3D.BIM.setElemClr(dataSetId, elemIdList, clr);
}


//设置构件混合属性
function changeElemBlendAttr() {
    // 设置构件发光
    var elemBlendAttr = new BlackHole3D.REElemBlendAttr();
    elemBlendAttr.dataSetId = "dataSet01";
    elemBlendAttr.elemIdList = [1062, 1014];
    elemBlendAttr.elemClr = new BlackHole3D.REColor(255, 0, 0, 255);
    elemBlendAttr.elemEmis = 255;
    elemBlendAttr.elemEmisPercent = 255;
    elemBlendAttr.elemSmooth = 0;
    elemBlendAttr.elemMetal = 0;
    elemBlendAttr.elemSmmePercent = 0;
    BlackHole3D.BIM.setElemBlendAttr(elemBlendAttr);
}


//添加动态墙
function addAnimWall() {
    var animWallInfo = new BlackHole3D.REAnimWallInfo();
    animWallInfo.groupName = "wall";
    animWallInfo.name = "wall01";
    animWallInfo.potList = [[14.717769348031592, 57.95791001082713, -0.000030016697266432857, 3],
    [11.833832403710415, 57.88562541960681, -0.000031201471490049926, 3],
    [12.011666543451309, 54.24507412739243, -0.00003062040975443381, 3],
    [14.82709974581475, 54.341189629415496, -0.00003190398601304878, 3]];
    animWallInfo.texPath = "http://realbim.bjblackhole.cn:8000/TestPages/RealBIMWeb_Test_UV01/dynamic01.png";
    animWallInfo.normalDir = false;
    animWallInfo.isClose = true;
    BlackHole3D.BIM.addAnimationWall(animWallInfo);
    BlackHole3D.REsetShapeAnimStyle("wall", ["wall01"], "00ffff", 255, [2.0, 0.0, -0.5, 0.0]);
}


//创建一个扫描面
function addAnimPlane() {
    var animPlaneInfo = new BlackHole3D.REAnimWallInfo();
    animPlaneInfo.groupName = "plane";
    animPlaneInfo.name = "plane01";
    animPlaneInfo.potList = [[14.717769348031592, 57.95791001082713, 2],
    [11.833832403710415, 57.88562541960681, 2],
    [12.011666543451309, 54.24507412739243, 2],
    [14.82709974581475, 54.341189629415496, 2]];
    animPlaneInfo.texPath = "http://realbim.bjblackhole.cn:8000/TestPages/RealBIMWeb_Test_UV01/dynamic01.png";
    BlackHole3D.BIM.addAnimationPlane(animPlaneInfo);
    BlackHole3D.REsetShapeAnimStyle("plane", ["plane01"], "00ffff", 255, [2.0, 0.0, -0.5, 0.0]);
}


//创建一个扫描球面
function addAnimSphere() {
    var animSphereInfo = new BlackHole3D.REAnimSphereInfo();
    animSphereInfo.groupName = "sphere";
    animSphereInfo.nameList = ["sphere01", "sphere02"];
    animSphereInfo.potCenterList = [[14.717769348031592, 57.95791001082713, 2],
    [12.98287890648843, 34.08362504945755, 1]];
    animSphereInfo.radius = 10;
    animSphereInfo.texPath = "http://realbim.bjblackhole.cn:8000/TestPages/RealBIMWeb_Test_UV01/dynamic01.png";
    BlackHole3D.BIM.addAnimationSpheres(animSphereInfo);
    BlackHole3D.REsetShapeAnimStyle("sphere", [], "00ffff", 255, [0.0, 0.0, 0.5, 0.0]);
}


//创建一个多边形
function addAnimPolygon() {
    var animPolygonInfo = new BlackHole3D.REAnimPolygonInfo();
    animPolygonInfo.groupName = "polygon";
    animPolygonInfo.nameList = ["polygon01", "polygon02"];
    animPolygonInfo.potCenterList = [[14.717769348031592, 57.95791001082713, 2],
    [12.98287890648843, 34.08362504945755, 1]];
    animPolygonInfo.radius = 10;
    animPolygonInfo.radarScan = false;
    animPolygonInfo.isRing = false;
    animPolygonInfo.edgeNum = 6;
    animPolygonInfo.texPath = "http://realbim.bjblackhole.cn:8000/TestPages/RealBIMWeb_Test_UV01/dynamic01.png";
    BlackHole3D.BIM.addAnimationPolygons(animPolygonInfo);
    BlackHole3D.REsetShapeAnimStyle("polygon", [], "00ffff", 255, [0.0, 0.0, 0.5, 0.0]);
}


//创建一个多边形动态墙
function addAnimPolyWall() {
    var animPolyWallInfo = new BlackHole3D.REAnimPolyWallInfo();
    animPolyWallInfo.groupName = "polyWall";
    animPolyWallInfo.nameList = ["polyWall01", "polyWall02"];
    animPolyWallInfo.potCenterList = [[14.717769348031592, 57.95791001082713, 2],
    [12.98287890648843, 34.08362504945755, 1]];
    animPolyWallInfo.radius = 10;
    animPolyWallInfo.height = 5;
    animPolyWallInfo.isRing = false;
    animPolyWallInfo.edgeNum = 6;
    animPolyWallInfo.normalDir = true;
    animPolyWallInfo.texPath = "http://realbim.bjblackhole.cn:8000/TestPages/RealBIMWeb_Test_UV01/dynamic01.png";
    BlackHole3D.BIM.addAnimationPolygonWalls(animPolyWallInfo);
    BlackHole3D.BIM.setShapeAnimStyle("polyWall", [], new BlackHole3D.REColor(0, 255, 255, 255), [0.0, 0.0, 0.5, 0.0]);
}


//添加一种全局字体
function addGolFont() {
    var fontInfo = new BlackHole3D.REFontInfo();
    fontInfo.fontId = "font01";
    fontInfo.width = 20;
    fontInfo.height = 20;
    fontInfo.weight = 20;
    BlackHole3D.Common.addGolFont(fontInfo);
}

//坐标偏移
function changeTransform() {
    var locInfo = new BlackHole3D.RELocInfo();
    locInfo.scale = [1, 1, 1];
    locInfo.rotate = [0, 0, 0, 1];
    locInfo.offset = [10, 0, 0];
    BlackHole3D.Coordinate.setDataSetTransform("dataSet01", locInfo);
}

//转换坐标
function convCoords() {
    //先设置参考坐标系为EPSG:3857
    var worldCRS = "EPSG:3857";
    BlackHole3D.Coordinate.setEngineWorldCRS(worldCRS);
    //例如当前项目设置的参考坐标系为EPSG:3857 ，以下示例可以得到EPSG:3857和EPSG:4326的坐标换算值
    var forward = true;
    var destCRS = "EPSG:4326";
    var coordList = [[18001530, -18091018, -4.03480005264282]];
    var trans01 = BlackHole3D.Coordinate.getTransEngineCoords(forward, destCRS, coordList);
    console.log(trans01);
    var forward = false;
    var destCRS = "EPSG:4326";
    var coordList = [[161.71049536536088, -83.28852470887807, -0.4731102113037381]];
    var trans02 = BlackHole3D.Coordinate.getTransEngineCoords(forward, destCRS, coordList);
    console.log(trans02);
}


//转换坐标
function convGeoCoords() {
    var srcCRS = "EPSG:4326";
    var destCRS = "EPSG:3857";
    var coordList = [[12.0, 55.0, 0.0, 0.0], [13.0, 58.987, 0.0, 0.0]];
    var trans01 = BlackHole3D.Coordinate.getTransGeoCoords(srcCRS, destCRS, coordList);
    console.log(trans01);

    var srcCRS = "EPSG:3857";
    var destCRS = "EPSG:4326";
    var coordList = [[1335833.8895192828, 7361866.113051185, 0, 0]];
    var trans02 = BlackHole3D.Coordinate.getTransGeoCoords(srcCRS, destCRS, coordList);
    console.log(trans02);
}


//添加多行标签
function addTag() {
    var tagInfoList = [
        {
            "tagName": "tag01",
            "pos": [-151, -95, 67],
            "infoList": [{
                "picPath": "",
                "text": "测试文字"
            }, {
                "picPath": "",
                "text": "tag002测试文字"
            }, {
                "picPath": "",
                "text": "tag003测试文字"
            }, {
                "picPath": "",
                "text": "tag004测试文字"
            }
            ]
        }, {
            "tagName": "tag012",
            "pos": [-246, 18, 16],
            "infoList": [{
                "picPath": "",
                "text": "测试文字"
            }, {
                "picPath": "",
                "text": "tag0012测试文字"
            }, {
                "picPath": "",
                "text": "tag0013测试文字"
            }, {
                "picPath": "",
                "text": "tag0014测试文字"
            }
            ]
        }
    ];
    BlackHole3D.Tag.addTags(tagInfoList);
}


// 添加元素全部自定义的行标签
function addLineTag() {
    var contents = [
        { type: "text", width: 30, height: 16, border: 10, text: "01#" },
        { type: "tex", width: 20, height: 20, border: 0, picPath: "https://demo.bjblackhole.com/demopage/examplesImgs/greenpot.png" },
        { type: "text", width: 16, height: 16, border: 0, elemClr: new BlackHole3D.REColor(0, 0, 0, 0), text: "" },
        { type: "tex", width: 20, height: 20, border: 2, picPath: "https://demo.bjblackhole.com/demopage/examplesImgs/shandian.png" },
        { type: "text", width: 50, height: 16, border: 0, elemClr: new BlackHole3D.REColor(255, 255, 0, 255), text: "50000" },
        { type: "text", width: 30, height: 16, border: 0, text: "kWh" },
        { type: "tex", width: 16, height: 16, border: 0, elemClr: new BlackHole3D.REColor(0, 0, 0, 0), picPath: "" },
        { type: "tex", width: 20, height: 20, border: 2, picPath: "https://demo.bjblackhole.com/demopage/examplesImgs/feng.png" },
        { type: "text", width: 50, height: 16, border: 0, elemClr: new BlackHole3D.REColor(255, 255, 0, 255), text: "9.56" },
        { type: "text", width: 30, height: 16, border: 0, text: "m/s" },
        { type: "tex", width: 20, height: 16, border: 0, elemClr: new BlackHole3D.REColor(0, 0, 0, 0), picPath: "" },
        { type: "tex", width: 20, height: 20, border: 2, picPath: "https://demo.bjblackhole.com/demopage/examplesImgs/dianbo.png" },
        { type: "text", width: 50, height: 16, border: 0, elemClr: new BlackHole3D.REColor(255, 255, 0, 255), text: "1086" },
        { type: "text", width: 30, height: 16, border: 0, text: "kw" },
    ];
    var lineInfo = new BlackHole3D.RELineTagInfo();
    lineInfo.tagName = "lineTag01";//标签的名称(唯一标识)
    lineInfo.pos = [4.028, 44.462, 4.561];//标签的位置
    lineInfo.contents = contents;//标签的内容（包含 RELineTagCont 类型）
    lineInfo.tagMinWidth = 16;//表示要添加的标签最小宽度
    lineInfo.tagMinHeight = 16;//表示要添加的标签最小高度
    lineInfo.fontName = "";//表示要添加的标签内容字体样式
    lineInfo.backClr = new BlackHole3D.REColor(70, 130, 180, 180);//表示要添加的标签背景颜色（REColor 类型）
    lineInfo.frameClr = new BlackHole3D.REColor(0, 255, 255, 0);//表示要添加的标签边框颜色（REColor 类型）
    BlackHole3D.Tag.addLineTags(lineInfo);
}


//骨骼爆炸动画
function animBone() {
    var dataSetId = "dataSet01";
    var elemIdList = [];
    var boneId = 1;
    BlackHole3D.BIM.setElemToBone(dataSetId, elemIdList, boneId);
    var aabbarr = BlackHole3D.Coordinate.getElemTotalBV(dataSetId, elemIdList); //数组形式：[Xmin, Xmax, Ymin, Ymax,Zmin, Zmax]
    var centerx = (aabbarr[0] + aabbarr[1]) / 2;
    var centery = (aabbarr[2] + aabbarr[3]) / 2;
    var centerz = (aabbarr[4] + aabbarr[5]) / 2;
    //骨骼的目标方位
    var destLoc = new BlackHole3D.REBoneLoc();
    destLoc.autoScale = [0, 0, 0];
    destLoc.localScale = [1.0, 1.0, 1.0];
    destLoc.localRotate = [0.0, 0.0, 0.0];
    destLoc.centerVirOrig = [centerx, centery, centerz];
    destLoc.centerVirScale = [3.0, 3.0, 3.0];
    destLoc.centerVirRotate = [0.0, 0.0, 0.0];
    destLoc.centerVirOffset = [0.0, 0.0, 0.0];
    //骨骼方位信息
    var boneLocInfo = new BlackHole3D.REGolBoneLocInfo();
    boneLocInfo.boneId = boneId;
    boneLocInfo.interval = 1
    boneLocInfo.procBatch = 0
    boneLocInfo.sendPostEvent = true;
    boneLocInfo.destLoc = destLoc;
    BlackHole3D.BIM.setGolElemBoneDestLoc(boneLocInfo);
}




// 添加轴网
function addAxisGrid() {
    var infoList = [];

    var info1 = new BlackHole3D.REAxisGridInfo();
    info1.guid = "001";
    info1.name = "A";
    info1.lineClr = new BlackHole3D.REColor(0, 0, 0, 255);
    info1.pos = [[4.288069845977211, 33.87103682291651, 1], [4.285024254261444, 15.658603008473774, 1]];
    infoList.push(info1);

    var info2 = new BlackHole3D.REAxisGridInfo();
    info2.guid = "002";
    info2.name = "B";
    info2.lineClr = new BlackHole3D.REColor(255, 0, 0, 255);
    info2.pos = [[4.57677965923796, 14.677213563853854, 1], [15.71787952403888, 15.487131187284342, 1]];
    infoList.push(info2);

    BlackHole3D.AxisGrid.setData("AxisGrid01", infoList);
}



// 添加标高
function addElevation() {
    var infoList = [];

    var info1 = new BlackHole3D.REElevationInfo();
    info1.guid = "001";
    info1.name = "D";
    info1.lineClr = new BlackHole3D.REColor(255, 0, 0, 255);
    info1.height = 2.0;
    info1.topHeight = 0.0;
    info1.bottomHeight = 0.0;
    infoList.push(info1);

    var info2 = new BlackHole3D.REElevationInfo();
    info2.guid = "002";
    info2.name = "G";
    info2.lineClr = new BlackHole3D.REColor(0, 255, 0, 255);
    info2.height = 1.0;
    info2.topHeight = 1.0;
    info2.bottomHeight = 0.0;
    infoList.push(info2);

    BlackHole3D.Elevation.setData("Elevation01", "", infoList);
}


//添加电子围栏信息
function addFence() {
    var fencePotList = [];
    var pot1 = new BlackHole3D.REFencePot();
    pot1.pos = [6.271010875701904, 15.429169654846191, 0.00003434607060626149];
    pot1.height = 10;
    pot1.potClr = new BlackHole3D.REColor(255, 0, 0, 255);
    pot1.endPotType = 0;
    fencePotList.push(pot1);

    var pot2 = new BlackHole3D.REFencePot();
    pot2.pos = [18.30353212782401, 28.97581500616011, -0.00002419808805242951];
    pot2.height = 10;
    pot2.potClr = new BlackHole3D.REColor(255, 0, 0, 255);
    pot2.endPotType = 0;
    fencePotList.push(pot2);

    var pot3 = new BlackHole3D.REFencePot();
    pot3.pos = [4.643471112809078, 29.62842330772714, -0.000019446589980987028];
    pot3.height = 10;
    pot3.potClr = new BlackHole3D.REColor(255, 0, 0, 255);
    pot3.endPotType = 1;//最后一个点且闭合
    fencePotList.push(pot3);

    BlackHole3D.Fence.addFenceByPot(fencePotList);
}


//添加剖切面并进入剖切状态
function addDataInfoClip() {
    var clipInfo = new BlackHole3D.REClipInfo();
    clipInfo.rotate = [0.7084946217059984, 8.390326549300259e-16, -0, 0.7057162113864709];
    clipInfo.offset = [15.504221856771613, 15.504221856771613, 15.504221856771613];
    clipInfo.scale = [4.922421215950646, 38.9365141233854, -0.13028221393203876];
    clipInfo.isSingleSurfaceClip = true;
    clipInfo.pot1 = [3.922421215950676, 13.61446768408492, 0.7702278847577326];
    clipInfo.pot2 = [5.922421215950676, 13.618396942057574, -0.2297643956783637];
    clipInfo.pot3 = [4.922421215950676, 13.622326200030225, -1.22975667611446];

    BlackHole3D.Clip.setDataIntoClip(clipInfo);
}


//根据轴网进行剖切
function setAxisGridClip() {
    //添加轴网
    var infoList = [];
    var info1 = new BlackHole3D.REAxisGridInfo();
    info1.guid = "001";
    info1.name = "B-10";
    info1.lineClr = new BlackHole3D.REColor(255, 0, 0, 255);
    info1.pos = [[10.0, 50.0, 0.0], [53.0, 7.0, 0.0]];
    infoList.push(info1);

    var info2 = new BlackHole3D.REAxisGridInfo();
    info2.guid = "002";
    info2.name = "B-1";
    info2.lineClr = new BlackHole3D.REColor(255, 0, 0, 255);
    info2.pos = [[-20.0, 20.0, 0.0], [23.0, -23.0, 0.0]];
    infoList.push(info2);

    var info3 = new BlackHole3D.REAxisGridInfo();
    info3.guid = "003";
    info3.name = "A-1";
    info3.lineClr = new BlackHole3D.REColor(255, 0, 0, 255);
    info3.pos = [[53.0, 7.0, 0.0], [23.0, -23.0, 0.0]];
    infoList.push(info3);

    var info4 = new BlackHole3D.REAxisGridInfo();
    info4.guid = "004";
    info4.name = "A-10";
    info4.lineClr = new BlackHole3D.REColor(255, 0, 0, 255);
    info4.pos = [[10.0, 50.0, 0.0], [-20.0, 20.0, 0.0]];
    infoList.push(info4);

    BlackHole3D.AxisGrid.setData("AxisGrid01", infoList);

    //添加剖切信息
    var clipInfo = new BlackHole3D.REAxisGridClipInfo();
    clipInfo.dataSetId = "dataSet01";
    clipInfo.gridGroupName = "AxisGrid01";
    clipInfo.gridNameList = ["B-10", "B-1", "A-1", "A-10",];
    clipInfo.offset = [0, 0, 0, 0];
    clipInfo.minHeight = 0.0;
    clipInfo.maxHeight = 50.0;
    clipInfo.onlyVisible = true;
    clipInfo.includeInter = true;

    BlackHole3D.Clip.setClipAxisGrid(clipInfo);

    //添加剖切监听回调
    document.addEventListener("REClipFinish", REClipFinish);
    function REClipFinish(e) {
        console.log("剖切完成回调");
        BlackHole3D.BIM.setElemsValidState("dataSet01", [], false);//全部置为无效
        BlackHole3D.BIM.setElemsValidState("dataSet01", e.detail.elemids, true);//选出的对象置为有效        
    }
}



// 设置阴影信息
function setShadow() {
    var shadowInfo = new BlackHole3D.REShadowInfo();
    shadowInfo.quality = 1;
    shadowInfo.dynSMSize = 1024;
    shadowInfo.staticSMSize = 1024;
    shadowInfo.maxDynSMNum = 3;
    shadowInfo.maxStaticSMNum = 5;
    shadowInfo.minDynSMUpdateLen = 1;
    shadowInfo.minStaticSMUpdateLen = 1;
    shadowInfo.hiResoDist = 6.1;
    shadowInfo.filterKernelSize = 2.0;
    shadowInfo.depthBiasRatio = 0.001;
    BlackHole3D.Common.setShadowInfo(shadowInfo);
}



// 添加锚点适用聚合锚点
function addAncLODDemo() {
    // 添加100个两种类型的锚点
    var arrancinfo = [];
    for (var i = 0; i < 10; ++i) {
        for (var j = 0; j < 10; ++j) {
            var ancInfo = new BlackHole3D.REAncInfo();
            ancInfo.groupName = (j % 2 == 0) ? "group01" : "group02";
            ancInfo.ancName = (i * 100 + j).toString();
            ancInfo.pos = (j % 2 == 0) ? [400 + i * 40, -100 + j * 40, 0] : [400 + i * 40, 200 + j * 40, 0];;
            ancInfo.picPath = (j % 2 == 0) ? "https://demo.bjblackhole.com/demopage/examplesImgs/tag.png" : "https://demo.bjblackhole.com/demopage/examplesImgs/anc.png";
            ancInfo.textInfo = "标记" + (i * 100 + j).toString();
            ancInfo.picWidth = 32;
            ancInfo.picHeight = 32;
            ancInfo.useLod = true;
            ancInfo.linePos = [0, 50];
            ancInfo.lineClr = new BlackHole3D.REColor(0, 255, 0, 255);
            ancInfo.ancSize = 60;
            ancInfo.selfAutoScaleDist = -1;
            ancInfo.selfVisDist = -1;
            ancInfo.textBias = [1, 0];
            ancInfo.textFocus = [5, 2];
            ancInfo.fontName = "RealBIMFont001";
            ancInfo.textColor = new BlackHole3D.REColor(255, 255, 255, 255);
            ancInfo.textBorderColor = new BlackHole3D.REColor(0, 0, 0, 128);

            arrancinfo.push(ancInfo);
        }
    }
    BlackHole3D.Anchor.addAnc(arrancinfo);
}

// 聚合锚点设置通用样式
function addAncLODStyle() {
    // 设置锚点聚合,锚点数量多的时候效果比较明显
    var mergestyle01 = new BlackHole3D.REAncInfo();
    mergestyle01.picPath = "https://demo.bjblackhole.com/demopage/examplesImgs/bubbler.png";
    mergestyle01.picWidth = 60;
    mergestyle01.picHeight = 60;
    mergestyle01.textBias = [1, 0];
    mergestyle01.fontName = "RealBIMFont001";
    mergestyle01.textColor = new BlackHole3D.REColor(255, 255, 255, 255);
    mergestyle01.textBorderColor = new BlackHole3D.REColor(0, 0, 0, 128);

    var mergestyle02 = new BlackHole3D.REAncInfo();
    mergestyle02.picPath = "https://demo.bjblackhole.com/demopage/examplesImgs/bubbley.png";
    mergestyle02.picWidth = 60;
    mergestyle02.picHeight = 60;
    mergestyle02.textBias = [1, 0];
    mergestyle02.fontName = "RealBIMFont001";
    mergestyle02.textColor = new BlackHole3D.REColor(255, 255, 255, 255);
    mergestyle02.textBorderColor = new BlackHole3D.REColor(0, 0, 0, 128);

    //聚合信息
    var bbBV = [[-2001.0, -2001.0, -500.0], [2001.0, 2001.0, -500.0]];
    var ancLODInfo1 = new BlackHole3D.REAncLODInfo();
    ancLODInfo1.groupName = "group01";
    ancLODInfo1.lodLevel = 10;
    ancLODInfo1.useCustomBV = true;
    ancLODInfo1.customBV = bbBV;
    ancLODInfo1.lodMergePxl = 300.0;
    ancLODInfo1.lodMergeCap = 3;
    ancLODInfo1.mergeStyle = mergestyle01;

    var ancLODInfo2 = new BlackHole3D.REAncLODInfo();
    ancLODInfo2.groupName = "group02";
    ancLODInfo2.lodLevel = 10;
    ancLODInfo2.useCustomBV = true;
    ancLODInfo2.customBV = bbBV;
    ancLODInfo2.lodMergePxl = 300.0;
    ancLODInfo2.lodMergeCap = 3;
    ancLODInfo2.mergeStyle = mergestyle02;

    BlackHole3D.Anchor.setAncLODInfo(ancLODInfo1);
    BlackHole3D.Anchor.setAncLODInfo(ancLODInfo2);
}









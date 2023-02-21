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

    console.log("======== 添加监听事件");
    document.addEventListener("RESystemReady", RESystemReady);
    document.addEventListener("RESystemEngineCreated", RESystemEngineCreated);
    document.addEventListener("REDataSetLoadFinish", REDataSetLoadFinish);
    document.addEventListener("RESystemRenderReady", RESystemRenderReady);
    document.addEventListener("REDataSetLoadProgress", REDataSetLoadProgress);

    document.addEventListener("RELocateCam", RELocateCam);
    document.addEventListener("RESystemSelElement", RESystemSelElement);
    // document.addEventListener("RealBIMSelShape", RealBIMSelShape);


    document.addEventListener("REDataSetLoadPanFinish", function (e) { REDataSetLoadPanFinish(e.detail.succeed) });
    document.addEventListener("REPanLoadSingleFinish", function (e) { REPanLoadSingleFinish(e.detail.succeed) });


    if ((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')) {
        console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
        RESystemReady();
    }
}

function RESystemSelElement(e) {
    console.log('getCurCombProbeRet', BlackHole3D.Probe.getCurCombProbeRet());
}
function RealBIMSelShape(e) {
    console.log(e);
    console.log('getCurCombProbeRet', BlackHole3D.Probe.getCurCombProbeRet());
}

function RELocateCam(e) {
    console.log(e);

    // var color = new BlackHole3D.REColor();
    // color.red = 128;
    // color.green = 255;
    // color.blue = 204;
    // BlackHole3D.SkyBox.setBackClr(color);
}


//全景场景加载完成，此时可获取全部点位信息
function REDataSetLoadPanFinish(isSuccess) {
    if (isSuccess) {
        console.log("360全景加载成功!！！！！！！！！！！！！！！！！！！！！！！！");
        // 获取全部帧信息
        var pandata = BlackHole3D.Panorama.getElemInfo("pan01");
        console.log(pandata);
        // 设置360显示信息
        BlackHole3D.Panorama.loadPanPic(pandata[0].elemId, 0);
        console.log(pandata[0].elemId);

        // 设置窗口模式
        // BlackHole3D.setViewMode(BlackHole3D.RE_ViewportType.Panorama, BlackHole3D.RE_ViewportType.CAD, 0);
        // BlackHole3D.setViewMode(BlackHole3D.RE_ViewportType.BIM, BlackHole3D.RE_ViewportType.Panorama, 1);
        BlackHole3D.setViewMode(BlackHole3D.RE_ViewportType.CAD, BlackHole3D.RE_ViewportType.Panorama, 1);
        BlackHole3D.CAD.loadCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_cad/103-Floor Plan - 三层建筑平面图.dwg", BlackHole3D.RE_CADUnit.Mile, 100);
    } else {
        console.log("360全景加载失败！！！！！！！！！！！！！！！！！！！！！！！");
    }
}
//全景场景图片设置成功
function REPanLoadSingleFinish(isSuccess) {
    if (isSuccess) {
        console.log("图片设置成功!！！！！！！！！！！！！！！！！！！！！！！！");
        //   setOverViewSize();
        //   //加载概略图CAD数据
        //   addCADData();
    } else {
        console.log("图片设置失败！！！！！！！！！！！！！！！！！！！！！！！");
    }
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

        // BlackHole3D.setViewMode(BlackHole3D.RE_ViewportType.BIM, BlackHole3D.RE_ViewportType.CAD, 1);
        // BlackHole3D.CAD.loadCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_cad/103-Floor Plan - 三层建筑平面图.dwg", BlackHole3D.RE_CADUnit.Millimeter, 1.0);
        // BlackHole3D.CAD.loadCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_cad/103-Floor Plan - 三层建筑平面图.dwg", BlackHole3D.RE_CADUnit.Mile, 100);
        // return;


        // 倾斜摄影proj1的测试场景
        var dataSetList = [
            // {
            //     "dataSetId": "dataSet01",
            //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
            //     "resRootPath": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
            //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
            // },
            // {
            //     "dataSetId": "dataSet02",
            //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
            //     "resRootPath": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
            //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [10, 10, 10]],
            //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
            // },
            // {
            //     "dataSetId": "3a0960059327a3a6b63933ed6fb956cc",
            //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a0960059327a3a6b63933ed6fb956cc",
            //     "resRootPath": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=",
            //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]],
            //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
            // },
            // {
            //     "dataSetId": "3a09611a1526f880503fa7c8bfe10b27",
            //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a09611a1526f880503fa7c8bfe10b27",
            //     "resRootPath": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=",
            //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]],
            //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
            // },
            // {
            //     "dataSetId": "3a09611aa1c3c4a7d1624c205c42c7af",
            //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a09611aa1c3c4a7d1624c205c42c7af",
            //     "resRootPath": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=",
            //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]],
            //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
            // },
            // {
            //     "dataSetId": "dataSet03",
            //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_osgbmerge01",
            //     "resRootPath": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
            //     "useAssginVer": true,
            //     "assginVer": 0,
            //     "useTransInfo": false,
            //     "transInfo": ""
            // },
            // {
            //     "dataSetId": "3a095bf75602ca925fc87a7974565d9e",
            //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a095bf75602ca925fc87a7974565d9e",
            //     "resRootPath": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=",
            //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
            // },
            // {
            //     "dataSetId": "3a096c1a61a7e6545c97e8a1cc6ca1be",
            //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a096c1a61a7e6545c97e8a1cc6ca1be",
            //     "resRootPath": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=",
            //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
            // },
            {
                "dataSetId": "3a0960059327a3a6b63933ed6fb956cc",
                "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a0960059327a3a6b63933ed6fb956cc",
                "resRootPath": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=",
                "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
                "dataSetCRS": "", "dataSetCRSNorth": 0.0
            },
        ];
        BlackHole3D.Model.loadDataSet(dataSetList);


        //加载360全景
        // var dataSetList = [
        //     {
        //         "dataSetId": "pan01",
        //         "resourcesAddress": "https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078ce7d766a927f0f4147af5ebe82e",
        //     }
        // ];
        // BlackHole3D.Panorama.loadPan(dataSetList);


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
        // BlackHole3D.setViewMode(BlackHole3D.RE_ViewportType.BIM, BlackHole3D.RE_ViewportType.CAD, 1);
        // BlackHole3D.CAD.loadCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_cad/103-Floor Plan - 三层建筑平面图.dwg", BlackHole3D.RE_CADUnit.Mile, 100);
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



//添加标签
function addTags() {
    var tagInfo = [
        {
            "tagname": "tag01",
            "pos": [-151, -95, 67],
            "info": [{
                "picpath": "common",
                "textinfo": "测试文字"
            }, {
                "picpath": "",
                "textinfo": "tag002测试文字"
            }, {
                "picpath": "",
                "textinfo": "tag003测试文字"
            }, {
                "picpath": "",
                "textinfo": "tag004测试文字"
            }
            ]
        }, {
            "tagname": "tag012",
            "pos": [-246, 18, 16],
            "info": [{
                "picpath": "common",
                "textinfo": "测试文字"
            }, {
                "picpath": "",
                "textinfo": "tag0012测试文字"
            }, {
                "picpath": "",
                "textinfo": "tag0013测试文字"
            }, {
                "picpath": "",
                "textinfo": "tag0014测试文字"
            }
            ]
        }
    ];
    BlackHole3D.REaddTags(tagInfo);
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
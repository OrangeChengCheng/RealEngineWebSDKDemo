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

    document.addEventListener("RealBIMLocateCam", RealBIMLocateCam);
    document.addEventListener("RealBIMSelModel", RealBIMSelModel);
    // document.addEventListener("RealBIMSelShape", RealBIMSelShape);


    if ((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')) {
        console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
        RealBIMInitSys();
    }
}

function RealBIMSelModel(e) {
    console.log('getCurCombProbeRet', BlackHole3D.Probe.getCurCombProbeRet());
}
function RealBIMSelShape(e) {
    console.log(e);
    console.log('getCurCombProbeRet', BlackHole3D.Probe.getCurCombProbeRet());
}

function RealBIMLocateCam(e) {
    console.log(e);

    // var color = new BlackHole3D.REColor();
    // color.red = 128;
    // color.green = 255;
    // color.blue = 204;
    // BlackHole3D.SkyBox.setBackClr(color);
}


//场景初始化，需正确传递相关参数
function RealBIMInitSys() {
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
function RealBIMLoadMainSce(e) {
    console.log("当前 WebSDK 运行版本", BlackHole3D.getVersion());


    console.log("=========================== 场景初始化完成");
    var isSuccess = e.detail.succeed;

    if (isSuccess) {
        console.log("===========================  场景初始化 --> 成功！！！");
        //倾斜摄影proj1的测试场景
        var dataSetList = [
            {
                "dataSetId": "dataSet01",
                "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang/total.xml",
                "resRootPath": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
                "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
                "dataSetCRS": "", "dataSetCRSNorth": 0.0
            },
            {
                "dataSetId": "dataSet02",
                "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang/total.xml",
                "resRootPath": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
                "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [10, 10, 10]],
                "dataSetCRS": "", "dataSetCRSNorth": 0.0
            }
        ];
        BlackHole3D.Model.loadDataSet(dataSetList);
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
    shpTextInfo.textbias = [1, 0];
    shpTextInfo.fontname = "RealBIMFont001";
    shpTextInfo.textclr = new BlackHole3D.REColor(255,255,255,255);
    shpTextInfo.textborderclr = new BlackHole3D.REColor(0,0,0,204);
    shpTextInfo.textbackmode = 2;
    shpTextInfo.textbackborder = 2;
    shpTextInfo.textbackclr = new BlackHole3D.REColor(0,0,0,204);
    //矢量点信息
    var potShpInfo = new BlackHole3D.REPotShpInfo();
    potShpInfo.shpName = "potShp001";
    potShpInfo.pos = [5.394, 14.598, 0.0];
    potShpInfo.potSize = 4;
    potShpInfo.potClr = new BlackHole3D.REColor(255,0,0,255);
    potShpInfo.scrASDist = -1.0;
    potShpInfo.scrVisDist = -1.0;
    potShpInfo.contactSce = false;
    potShpInfo.textInfo = shpTextInfo;

    var addPosShpBool = BlackHole3D.Geometry.addPotShp(potShpInfo);
    console.log(addPosShpBool);
}
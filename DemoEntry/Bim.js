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

    //加载
    document.addEventListener("REDataSetLoadPanFinish", REDataSetLoadPanFinish);//全景场景加载完成事件
    document.addEventListener("REPanLoadSingleFinish", REPanLoadSingleFinish);//全景场景中某一帧全景图设置成功的事件

    //探测
    document.addEventListener("RESystemSelElement", RESystemSelElement);//鼠标探测模型事件（左键单击和右键单击）
    document.addEventListener("RESystemSelShpElement", RESystemSelShpElement);//鼠标探测矢量元素事件

    //操作
    document.addEventListener("RELocateCam", RELocateCam);//调整相机方位完成事件
    document.addEventListener("REElevationUpdateFinish", REElevationUpdateFinish);//标高更新完成事件
    document.addEventListener("REAxisGridUpdateFinish", REAxisGridUpdateFinish);//轴网更新完成事件
    document.addEventListener("REAddEntityFinish", REAddEntityFinish);//裁剪完成回调事件

}

//场景初始化，需正确传递相关参数
function RESystemReady() {
    // BlackHole3D.addAuthorPath("RealEngineInitAuthorPath", "http://10.218.51.104:9999/api/ecx-gateway/author/author_path02.txt");
    // BlackHole3D.addPathIndex("RealEngineInitPathIndex", "http://10.218.51.104:9999/api/ecx-gateway/res/", "http://10.218.51.104:9999/api/ecx-gateway/pathindex/res/index.xml");
    // BlackHole3D.addAuthorPath("RealEngineInitAuthorPath", "https://www.cim.xaxcsz.com:18000/author/author_path02.txt");
    // BlackHole3D.addPathIndex("RealEngineInitPathIndex", "https://www.cim.xaxcsz.com:18000/res/", "https://www.cim.xaxcsz.com:18000/pathindex/res/index.xml");
    // BlackHole3D.addAuthorPath("RealEngineInitAuthorPath", "https://www.cim.xaxcsz.com/api/ecx-gateway/author/author_path02.txt");
    // BlackHole3D.addPathIndex("RealEngineInitPathIndex", "https://www.cim.xaxcsz.com/api/ecx-gateway/res/", "https://www.cim.xaxcsz.com/api/ecx-gateway/pathindex/res/index.xml");
    // BlackHole3D.addAuthorPath("RealEngineInitAuthorPath", "http://realbim.bjblackhole.cn:18080/author/author_path02.txt");
    // BlackHole3D.addPathIndex("RealEngineInitPathIndex", "http://realbim.bjblackhole.cn:18080/res/", "http://realbim.bjblackhole.cn:18080/pathindex/res/index.xml");

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


    // window.BlackHole3D.addAuthorPath("RealEngineInitAuthorPath", 'https://www.cim.xaxcsz.com/api/ecx-gateway/author/author_path02.txt');
    //   window.BlackHole3D.addPathIndex("RealEngineInitPathIndex", 'https://www.cim.xaxcsz.com/api/ecx-gateway/res/', 'https://www.cim.xaxcsz.com/api/ecx-gateway/pathindex/res/index.xml');
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RESystemEngineCreated(e) {
    console.log("当前 WebSDK 运行版本", BlackHole3D.getVersion());
    console.log("=========================== 场景初始化完成");
    var isSuccess = e.detail.succeed;
    //设置世界坐标系
    // var worldCRS = 'PROJCS["CGCS2000_3_Degree_GK_CM_116E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",116.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]';
    var worldCRS = 'EPSG:3857';
    BlackHole3D.Coordinate.setEngineWorldCRS(worldCRS);//设置引擎参考坐标系
    if (isSuccess) {
        console.log("===========================  场景初始化 --> 成功！！！");
        // setTimeout(() => {
        //     loadModel()//加载模型
        // }, 1);
        loadModel()//加载模型
        // loadCAD();

        // 设置全局渲染性能控制参数
        BlackHole3D.Common.setMaxResMemMB(5500);
        BlackHole3D.Common.setExpectMaxInstMemMB(4500);
        BlackHole3D.Common.setExpectMaxInstDrawFaceNum(20000000);
        BlackHole3D.Common.setPageLoadLev(2);

        // BlackHole3D.setViewMode(BlackHole3D.REVpTypeEm.BIM, BlackHole3D.REVpTypeEm.BIM, BlackHole3D.REVpRankEm.LR);
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

//加载CAD
function loadCAD() {
    BlackHole3D.setViewMode(BlackHole3D.REVpTypeEm.BIM, BlackHole3D.REVpTypeEm.CAD, 1);
    BlackHole3D.CAD.loadCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_cad/103-Floor Plan - 三层建筑平面图.dwg", BlackHole3D.RECadUnitEm.CAD_UNIT_Millimeter, 1.0);
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

    // var probe = BlackHole3D.Probe.getCurCombProbeRet();
    // var coordList = [(probe.elemType !== '' ? probe.elemPos : probe.selPos)];

    // var forward = true;
    // var destCRS = "EPSG:4326";
    // var trans = BlackHole3D.Coordinate.getTransEngineCoords(forward, destCRS, coordList);
    // var trans2 = BlackHole3D.Coordinate.getTransEngineCoords(forward, destCRS, coordList);
    // console.log("-----------------trans", trans);
    // console.log("-----------------trans2", trans2);
    // var trans01 = BlackHole3D.Coordinate.getTransEngineCoords(forward, destCRS, coordList);
}

function RELocateCam(e) {
    console.log("-- 相机运动完成事件 --", e.detail);
}

function REElevationUpdateFinish(e) {
    console.log("-- 标高更新完成事件 --", e.detail);
}

function REAxisGridUpdateFinish(e) {
    console.log("-- 轴网更新完成事件 --", e.detail);
}

function REAddEntityFinish(e) {
    console.log("-- 裁剪完成回调事件 --", e.detail);
}

//加载360
function loadPan() {
    var dataSetList = [
        {
            "dataSetId": "pan01",
            // "resourcesAddress": "https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078ce7d766a927f0f4147af5ebe82e",
            "resourcesAddress": "http://192.168.31.13:8088/blackhole3D/EngineRes/RequestEngineRes?dir=url_res02&path=3a0d619987e9a46137e5f8d917031aa8",
        },
        // {
        //     "dataSetId": "pan01",
        //     "resourcesAddress": "http://realbim.bjblackhole.cn:18080/res/3a0aaaf8c13ea016ade7fde73533b739",
        // },
    ];
    BlackHole3D.Panorama.loadPan(dataSetList);
}


// 加载模型
function loadModel() {
    // 设置窗口模式
    BlackHole3D.setViewMode(BlackHole3D.REVpTypeEm.BIM, BlackHole3D.REVpTypeEm.None, BlackHole3D.REVpRankEm.Single);

    // BlackHole3D.addUrlExtParam("https://www.cim.xaxcsz.com/api/ecx-gateway/res*", "serviceid=1714135161618042881");
    // BlackHole3D.addUrlExtParam("http://10.218.51.104:9999/api/ecx-gateway/res*", "serviceid=1714135161618042881&token=123123");

    var dataSetList = [
        // { //天地图
        //     dataSetId: "天地图",
        //     resourcesAddress: "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0e7d54a427f08ffa38ee829199163c"
        // },
        // { //BIM
        //     dataSetId: "BIM1",
        //     resourcesAddress: "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0e5915cf59744cc2b10848c98b112a",
        //     dataSetCRS: `PROJCS["Transverse_Mercator",GEOGCS["GCS_WGS_1984",DATUM["D_WGS84",SPHEROID["WGS84",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Transverse_Mercator"],PARAMETER["scale_factor",1],PARAMETER["central_meridian",114.3333],PARAMETER["latitude_of_origin",0],PARAMETER["false_easting",800000],PARAMETER["false_northing",0],UNIT["Meter",1]]`,
        //     engineOrigin: [-800000, -3400000, 0.0]
        // },
        // { //BIM
        //     dataSetId: "BIM2",
        //     resourcesAddress: "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0e5915cf59744cc2b10848c98b112a",
        //     dataSetCRS: `PROJCS["Transverse_Mercator",GEOGCS["GCS_WGS_1984",DATUM["D_WGS84",SPHEROID["WGS84",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Transverse_Mercator"],PARAMETER["scale_factor",1],PARAMETER["central_meridian",114.3333],PARAMETER["latitude_of_origin",0],PARAMETER["false_easting",800000],PARAMETER["false_northing",0],UNIT["Meter",1]]`,
        //     engineOrigin: [-800000, -3400000, 0.0],transInfo: [[1, 1, 1], [0, 0, 0, 1], [100000, 0, 50]],useTransInfo: true,
        // },
        // { //倾斜摄影
        //     dataSetId: "倾斜摄影",
        //     resourcesAddress: "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0e71b7ada9d754726e12cdcbd606a4",
        //     dataSetCRS: "EPSG:4547",
        //     engineOrigin: [569478, 3375298, 0.0]
        // }
        // {
        //     dataSetId: "3a0d9efd-46f2-bea2-a85a-21b35fef5f72",
        //     resourcesAddress:
        //         "http://139.9.128.140:8088/blackhole3d/EngineRes/RequestEngineRes?dir=url_res02&path=3a0d9efd46f2bea2a85a21b35fef5f72",
        //     dataSetCRS:
        //         'PROJCS["CGCS2000_3_Degree_GK_CM_116E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",116.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
        //     useAssginVer: true,
        //     useTransInfo: true,
        //     transInfo: [[1, 1, 1], [0, 0, 0, 1], [0, 0, 20]],
        // },
        // {
        //     dataSetId: '3a0e78ad-72d6-e592-8662-40094604b5b3',
        //     resourcesAddress:
        //         'http://139.9.128.140:8088/blackhole3d/engineres/requestengineres?dir=url_res02&path=3a0e78ad72d6e592866240094604b5b3',
        //     useTransInfo: false,
        //     transInfo: '',
        //     dataSetCRS:
        //         'PROJCS["CGCS2000_3_Degree_GK_CM_116E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",116.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
        //     useAssginVer: true,
        // },
        // {
        //     "dataSetId": "3a0e4892-c6a7-fbc6-0000-d56d21ef9720",
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res14&path=3a0e4892c6a7fbc60000d56d21ef9720",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "EPSG:3857", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "3a0e6c44-8b86-667c-29e5-4c2528170c3f",
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res16&path=3a0e6c448b86667c29e54c2528170c3f",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": 'PROJCS["CGCS2000_3_degree_Gauss_Kruger_CM_91.9E",GEOGCS["GCS_China Geodetic Coordinate System 2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",91.9],PARAMETER["scale_factor",1],PARAMETER["false_easting",500000],PARAMETER["false_northing",289],UNIT["Meter",1]]', "dataSetCRSNorth": 0.0,
        //     "engineOrigin": [491154.03125, 4717785, 0.0]

        // }
        // {
        //     "dataSetId": "机房01",
        //     // "resourcesAddress": "https://www.cim.xaxcsz.com/api/ecx-gateway/res/3a0e4de41350c1ec3994ef491b0f7793",
        //     // "resourcesAddress": "https://www.cim.xaxcsz.com/api/ecx-gateway/res/3a0e4de3aa656cf466f41f959cf7d981",
        //     // "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=3a0a58909668b31b5360ebde89f6eb2c",
        //     "resourcesAddress": "https://www.cim.xaxcsz.com:18000/res/7e28fcef34434cb4b168aa1eeb5c1be8",
        //     // "resourcesAddress": "https://www.cim.xaxcsz.com:18000/res/res_entity_anim_test02",
        //     // "resourcesAddress": "http://10.218.51.104:9999/api/ecx-gateway/res/3a0e3402b0437ff0dba647d1bfcdc1f6",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        {
            "dataSetId": "机房01",
            "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            "dataSetCRS": "", "dataSetCRSNorth": 0.0
        },
        // {
        //     "dataSetId": "机房03",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 15.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "房间面积",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=3a0c75ad4137854250a4c5f0e462408a",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "useAssginVer2": true, "assginVer2": 0x7fffffff,
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "房间面积2",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=3a0c75ad4137854250a4c5f0e462408a",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 100.0]],
        //     "useAssginVer": false, "assginVer": -1,
        //     "useAssginVer2": true, "assginVer2": 0x7fffffff,
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "机房02",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [10, 10, 10]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "版本对比花园",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0b67f04da31dd122ba409ef7fa08a9",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]],
        //     "useAssginVer": true, "assginVer": 2,
        //     "useAssginVer2": false, "assginVer2": 3,
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "版本对比花园2",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0b67f04da31dd122ba409ef7fa08a9",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 100]],
        //     "useAssginVer": true, "assginVer": 2,
        //     "useAssginVer2": false, "assginVer2": 3,
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
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res15&path=3a0bef666513080b3b52aa9fc18cf17f",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 10]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "小房子2",
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res15&path=3a0bef666513080b3b52aa9fc18cf17f",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 100]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "桥",
        //     "resourcesAddress": "http://192.168.31.7:8008/blackhole3D/EngineRes/RequestEngineRes?dir=url_res13&path=3a09611aa1c3c4a7d1624c205c42c7af",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "长地形超大",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_nantong",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "长地形缩小百倍",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_osgbmerge01",
        //     "useTransInfo": true, "transInfo": [[0.01, 0.01, 0.01], [0, 0, 0, 1], [5, 20, -30]],
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
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0b69e5273db783bfcf52ae9269a30b",
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
        // {
        //     "dataSetId": "楼房+地形",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_nanhuiskp",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "MiniIO小房子",
        //     "resourcesAddress": "http://realbim.bjblackhole.cn:18080/res/3a0a66aee93946924f81713d912ed7e4",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0,
        // },
        // {
        //     "dataSetId": "长管道",
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res14&path=3a0aa997146ecdfee87474edef3fb335",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "金属属性车",
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/engineres/requestengineres?dir=url_res15&path=3a0abf5ec59380c163b403c1180a57d7",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
        // {
        //     "dataSetId": "版本对比楼房",
        //     "resourcesAddress": "https://enginegraph-test.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res04&path=3a0ac47c6ed2ff3f469802152fc9c97e",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0,
        //     "useAssginVer": true, "assginVer": 0,
        //     "useAssginVer2": true, "assginVer2": 1,
        // },
        // {
        //     "dataSetId": "双大楼",
        //     "resourcesAddress": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res14&path=3a088db50b8506bf1d8eda9f7c0563d0",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0,
        // },
        // {
        //     "dataSetId": "OSGB_山路",
        //     "resourcesAddress": "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_osgbmerge02",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0,
        // },
        // {
        //     "dataSetId": "地形_雄安建筑进度",
        //     "resourcesAddress": "http://121.229.18.166:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=69cfccd5b8b24fd1a223fe883393d716",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0,
        // },
        // {
        //     "dataSetId": "管道UV动画",
        //     "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=3a0c84a3ebe43139f2b1990518e22980",
        //     "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        //     "dataSetCRS": "", "dataSetCRSNorth": 0.0
        // },
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
            "texBias": [1, 0],
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
            "texBias": [1, 0],
            "textFocus": [0, 0]
        }
    ];
    BlackHole3D.Anchor.addAnc(ancList);
}

function addAnc2() {
    var anc = new BlackHole3D.REAncInfo();
    anc.ancName = "bim-anc-01";
    anc.pos = [5.589634942790777, 15.313709638911453, 0.000028675116826804015];
    anc.textInfo = "aaaaaaaaaaaaaaaaaaaaaaaaa";
    anc.picPath = "https://demo.bjblackhole.com/demopage/examplesImgs/bubbler.png";
    anc.picWidth = 30;
    anc.picHeight = 30;
    anc.ancSize = 60;
    anc.texBias = [0, 1];
    anc.texFocus = [-30, 0];
    anc.fontName = "RealBIMFont001";
    anc.textColor = new BlackHole3D.REColor(255, 255, 255, 255);
    anc.textBorderColor = new BlackHole3D.REColor(0, 0, 0, 128);

    var ancList = [];
    ancList.push(anc);
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

//创建一个规则的路径平面
function addAnimAreaBuffer() {
    var animAreaBufferInfo = new BlackHole3D.REAnimAreaBufferInfo();
    animAreaBufferInfo.groupName = "Area";
    animAreaBufferInfo.name = "Area01";
    animAreaBufferInfo.potList = [
        [16.8049, 48.3428, 4.7014],
        [16.8049, 46.3428, 4.7014],
        [16.8049, 44.3428, 4.7014],
        [16.8049, 42.3428, 4.7014],
        [16.8049, 40.3428, 4.7014],
        [16.8478, 38.3428, 4.7014],
        [16.7265, 36.3428, 3.9596],
        [16.7265, 34.3428, 3.9596],
        [16.7265, 32.3428, 3.9596],
        [16.7265, 30.3428, 3.9596],
        [16.6537, 28.3428, 3.9596],
        [16.6537, 26.3428, 3.9596],
    ];
    animAreaBufferInfo.texPath = "http://realbim.bjblackhole.cn:8000/TestPages/RealBIMWeb_Test_UV01/dynamic01.png";
    animAreaBufferInfo.width = 0.5;
    BlackHole3D.Animation.addAnimAreaBuffer(animAreaBufferInfo);

    var animStyle = new BlackHole3D.REShpAnimStyle();
    animStyle.groupName = "Area";
    animStyle.nameList = [];
    animStyle.animClr = new BlackHole3D.REColor(0, 255, 255);
    animStyle.clrWeight = 0;
    animStyle.scaleAndOffset = [0.0, 0.0, -0.5, 0.0];
    BlackHole3D.Animation.setShapeAnimStyle(animStyle);
}

//添加矢量管线动画
function addAnimCylinder() {
    var animCylinderInfo = new BlackHole3D.REAnimCylinderInfo();
    animCylinderInfo.groupName = "Cylinder";
    animCylinderInfo.name = "Cylinder01";
    animCylinderInfo.potList = [
        [9.1430188185162677, 20.725476954872974, 4.2981972694396973],
        [9.1483041387047521, 35.597678617132431, 4.3007271089769965],
        [9.2690000534057617, 35.983598709106445, 4.2999999523162842],
        [9.654764235573321, 36.105368770864011, 4.295461189498031],
        [17.264230213985602, 36.107975503022303, 4.3012027364956316],
    ];
    animCylinderInfo.texPath = "http://realbim.bjblackhole.cn:8000/TestPages/RealBIMWeb_Test_UV01/dynamic01.png";
    animCylinderInfo.radius = 0.5;
    BlackHole3D.Animation.addAnimCylinder(animCylinderInfo);

    var animStyle = new BlackHole3D.REShpAnimStyle();
    animStyle.groupName = "Cylinder";
    animStyle.nameList = [];
    animStyle.animClr = new BlackHole3D.REColor(0, 255, 255);
    animStyle.clrWeight = 0;
    animStyle.scaleAndOffset = [0.0, 0.0, -0.5, 0.0];
    BlackHole3D.Animation.setShapeAnimStyle(animStyle);
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

//添加多行标签
function addTags() {
    var tagInfo1 = new BlackHole3D.RETagInfo();
    tagInfo1.tagName = "tag01";
    tagInfo1.pos = [60, 50, 20];

    var tagCont1 = new BlackHole3D.RETagContent();
    tagCont1.picPath = "https://demo.bjblackhole.com/demopage/examplesImgs/shandian.png";
    tagCont1.text = "测试文字";
    var tagCont2 = new BlackHole3D.RETagContent();
    tagCont2.picPath = "https://demo.bjblackhole.com/demopage/examplesImgs/greenpot.png";
    tagCont2.text = "tag002测试文字";
    tagInfo1.infoList = [tagCont1, tagCont2];

    var tagInfoList = [tagInfo1];
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


//根据轴网获取轴网范围内的构件id
function getSelAxisGridRegElem() {
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

    //添加轴网范围信息
    var regInfo = new BlackHole3D.RESelAxisGridRegInfo();
    regInfo.dataSetId = "dataSet01";
    regInfo.gridGroupName = "AxisGrid01";
    regInfo.gridNameList = ["B-10", "B-1", "A-1", "A-10",];
    regInfo.offset = [0, 0, 0, 0];
    regInfo.minHeight = 0.0;
    regInfo.maxHeight = 50.0;
    regInfo.onlyVisible = true;
    regInfo.includeInter = true;

    BlackHole3D.BIM.getAxisGridRegElem(regInfo);

    //添加选择范围监听回调
    document.addEventListener("REElemSelRegFinish", REElemSelRegFinish);
    function REElemSelRegFinish(e) {
        console.log("获取范围内的构件回调完成");
        BlackHole3D.BIM.setElemsValidState("dataSet01", [], false);//全部置为无效
        BlackHole3D.BIM.setElemsValidState("dataSet01", e.detail.elemids, true);//选出的对象置为有效        
    }
}

//根据多边形获取范围内的构件id
function getSelPolyFenceRegElem() {
    //添加多边形范围信息
    var regInfo = new BlackHole3D.RESelPolyFenceRegInfo();
    regInfo.dataSetId = "机房01";
    regInfo.pointList = [
        [-20, 20, 0],
        [23, -23, 0],
        [53, 7, 0],
        [10, 50, 0],
    ];
    regInfo.minHeight = 0.0;
    regInfo.maxHeight = 50.0;
    regInfo.onlyVisible = true;
    regInfo.includeInter = true;

    BlackHole3D.BIM.getPolyFenceRegElem(regInfo);

    //添加选择范围监听回调
    document.addEventListener("REElemSelRegFinish", REElemSelRegFinish);
    function REElemSelRegFinish(e) {
        console.log("获取范围内的构件回调完成", e.detail);
        BlackHole3D.BIM.setElemsValidState("机房01", [], false);//全部置为无效
        BlackHole3D.BIM.setElemsValidState("机房01", e.detail.elemids, true);//选出的对象置为有效        
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


//设置UV动画属性
function addUVAnim() {
    var anim = new BlackHole3D.REElemUVAnim();
    anim.dataSetId = "dataSet01";
    anim.elemIdList = [37, 133];
    anim.scale = [1.0, 1.0];
    anim.speed = [-1.0, 0.0];

    BlackHole3D.BIM.setElemUVAnimAttr(anim);
}

//使用数据进行剖切
function useDataClip() {
    var dataList = [
        {
            dataSetId: "机房01",
            elemIdList: [787]
        },
        {
            dataSetId: "机房02",
            elemIdList: [785, 1065]
        }
    ];
    BlackHole3D.Clip.setBoxClip(dataList);
}




//添加一组测量数据
function addMeasureData() {
    var measureInfo = new BlackHole3D.REMeasureInfo();
    measureInfo.measureType = 1;
    measureInfo.dataShowType = 1;
    measureInfo.groupId = 100;
    measureInfo.pointList = [
        [5.2774847810884005, 20.279251129164138, 1.35592204225739],
        [9.208837486233602, 19.28688892897917, 1.6398539371733278],
    ];
    BlackHole3D.Measure.addGroupData(measureInfo);
}

//相机漫游
function camRoam() {
    var camLoc1 = new BlackHole3D.RECamLoc();
    camLoc1.camPos = [-14.087076187133789, 11.930473327636719, 28.941125869750977];
    camLoc1.camRotate = [0.36398818531917354, -0.17635701787344926, -0.398772547926534, 0.8230378230768128];

    var camLoc2 = new BlackHole3D.RECamLoc();
    camLoc2.camPos = [0.34126381084613344, 16.134409179738974, 11.219432115073792];
    camLoc2.camRotate = [0.36398818531917354, -0.17635701787344926, -0.398772547926534, 0.8230378230768128];

    var camLoc3 = new BlackHole3D.RECamLoc();
    camLoc3.camPos = [7.1471613011448785, 27.16452603519661, 6.7370463930408];
    camLoc3.camRotate = [0.5820258287219049, -0.11894105041097136, -0.16106109691864468, 0.7881359554588774];

    var camLocList = [camLoc1, camLoc2, camLoc3];

    var taskList = [];
    for (let i = 0; i < camLocList.length; i++) {
        taskList.push(
            () => {
                const element = camLocList[i];
                var locDelay = 0;
                var locTime = 2;
                BlackHole3D.Camera.setCamLocateTo(element, locDelay, locTime);
            }
        );
    }

    let index = 0;
    const intervalId = setInterval(() => {
        if (index < taskList.length) {
            taskList[index](); // 执行任务
            index++;
        } else {
            clearInterval(intervalId); // 所有任务完成，清除计时器
        }
    }, 2000); // 每隔 1 秒执行一次

}


// 已知两个点坐标，求以这两个点为对角线的矩形另外两个点的坐标值
function getRectPos() {
    // 假设有两个三维点 (x1, y1, z1) 和 (x2, y2, z2)
    // 求以这两个点为对角线的矩形另外两个三维点的坐标值
    const x1 = 5.553109325749929;
    const y1 = 14.738651250323581;
    // const z1 = 0.000033230290977570576;
    const x2 = 8.341317300600794;
    const y2 = 15.607180413525267;
    // const z2 = 4.359456477505427;
    // const dx = x2 - x1;
    // const dy = y2 - y1;
    // const dz = z2 - z1;

    // 假设有两个点 A(x1, y1) 和 B(x2, y2)
    // 求以这两个点为对角线的矩形的另外两个点的坐标值

    const AB = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));  // 对角线长度

    const v_AB = [(x2 - x1) / AB, (y2 - y1) / AB];  // 对角线方向向量

    const C1 = [x1, y2];  // 第一个解 C 点坐标
    const D1 = [x2, y1];  // 第一个解 D 点坐标

    const C2 = [x2, y1];  // 第二个解 C 点坐标
    const D2 = [x1, y2];  // 第二个解 D 点坐标

    // 检查第一个解是否符合矩形的形状要求
    const CD1 = Math.sqrt((D1[0] - C1[0]) * (D1[0] - C1[0]) + (D1[1] - C1[1]) * (D1[1] - C1[1]));  // CD 长度
    const cos1 = (D1[0] - C1[0]) * (x2 - x1) + (D1[1] - C1[1]) * (y2 - y1);  // CD 与 AB 的夹角余弦值
    if (Math.abs(CD1 - AB) > 1e-6 || Math.abs(cos1) > 1e-6) {
        // 如果不符合矩形的形状要求，则使用第二个解
        console.log("11111111111111");
        console.log(C2, D2)
    } else {
        console.log("22222222222222");
        console.log(C1, D1)
    }


}


// 添加连续管道
function addPipe() {
    var pipeInfo = new BlackHole3D.REPipeInfo();
    pipeInfo.dataSetId = "机房01";
    pipeInfo.pipeId = "pipe01";
    pipeInfo.elemIdList = [728, 735, 749, 757, 751, 731, 729];
    BlackHole3D.Pipe.addContPipe(pipeInfo);
}


//开启动画
function startAnim() {
    var anim = new BlackHole3D.REElemUVAnim();
    anim.dataSetId = "管道UV动画";
    anim.elemIdList = [2, 3, 4, 5, 6, 10, 11, 14, 15, 17, 18, 19, 20, 25, 26, 29];
    anim.scale = [0.1, 1.0];
    anim.speed = [1.0, 0.0];
    BlackHole3D.BIM.setElemUVAnimAttr(anim);

    var anim = new BlackHole3D.REElemUVAnim();
    anim.dataSetId = "管道UV动画";
    anim.elemIdList = [1, 7, 8, 9, 12, 13, 16, 21, 22, 23, 24, 27, 28, 30];
    anim.scale = [1.0, 1.0];
    anim.speed = [1.0, 0.0];
    BlackHole3D.BIM.setElemUVAnimAttr(anim);

    var anim = new BlackHole3D.REElemUVAnim();
    anim.dataSetId = "管道UV动画";
    anim.elemIdList = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
    anim.scale = [0.5, 1.0];
    anim.speed = [1.0, 0.0];
    BlackHole3D.BIM.setElemUVAnimAttr(anim);
}
//结束动画
function stopAnim() {
    var anim = new BlackHole3D.REElemUVAnim();
    anim.dataSetId = "管道UV动画";
    anim.elemIdList = [];
    anim.scale = [1.0, 1.0];
    anim.speed = [0.0, 0.0];
    BlackHole3D.BIM.setElemUVAnimAttr(anim);
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








const GISCRS = 'PROJCS["CGCS2000_3_Degree_GK_CM_116E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",116.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]';
const BIMCRS = "EPSG:4326";

function camRoam() {
    let gisCamList = [
        {
            "id": 20665,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370685968,
            "format_time": "2023-10-27T09:38:05.968",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 1.335667,
            "elevation": 0.8,
            "attitude_head": -18.4,
            "attitude_pitch": 1.3,
            "attitude_roll": 0,
            "mode_code": 4,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370690399,
            "update_time": 1698370690399
        },
        {
            "id": 20666,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370687969,
            "format_time": "2023-10-27T09:38:07.969",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 2.135667,
            "elevation": 1.6,
            "attitude_head": -18.1,
            "attitude_pitch": 1.2,
            "attitude_roll": -0.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370692388,
            "update_time": 1698370692388
        },
        {
            "id": 20667,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370689969,
            "format_time": "2023-10-27T09:38:09.969",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 10.035669,
            "elevation": 9.5,
            "attitude_head": -18,
            "attitude_pitch": 0.9,
            "attitude_roll": -0.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370694373,
            "update_time": 1698370694373
        },
        {
            "id": 20668,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370691970,
            "format_time": "2023-10-27T09:38:11.97",
            "longitude": 115.847907,
            "latitude": 39.042782,
            "height": 19.935669,
            "elevation": 19.4,
            "attitude_head": -18,
            "attitude_pitch": 1,
            "attitude_roll": -1.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370696393,
            "update_time": 1698370696393
        },
        {
            "id": 20669,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370693971,
            "format_time": "2023-10-27T09:38:13.971",
            "longitude": 115.847906,
            "latitude": 39.042782,
            "height": 29.935667,
            "elevation": 29.4,
            "attitude_head": -18,
            "attitude_pitch": 0.7,
            "attitude_roll": -1.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370698433,
            "update_time": 1698370698433
        },
        {
            "id": 20670,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370695973,
            "format_time": "2023-10-27T09:38:15.973",
            "longitude": 115.847906,
            "latitude": 39.042781,
            "height": 40.035667,
            "elevation": 39.5,
            "attitude_head": -18,
            "attitude_pitch": 0,
            "attitude_roll": -0.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370700370,
            "update_time": 1698370700370
        },
        {
            "id": 20671,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370697969,
            "format_time": "2023-10-27T09:38:17.969",
            "longitude": 115.847908,
            "latitude": 39.042783,
            "height": 50.035667,
            "elevation": 49.5,
            "attitude_head": -18,
            "attitude_pitch": 0.2,
            "attitude_roll": -2.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370702387,
            "update_time": 1698370702387
        },
        {
            "id": 20672,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370699972,
            "format_time": "2023-10-27T09:38:19.972",
            "longitude": 115.847907,
            "latitude": 39.042783,
            "height": 60.035667,
            "elevation": 59.5,
            "attitude_head": -18,
            "attitude_pitch": 0.3,
            "attitude_roll": -2.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370704383,
            "update_time": 1698370704383
        },
        {
            "id": 20673,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370701972,
            "format_time": "2023-10-27T09:38:21.972",
            "longitude": 115.847905,
            "latitude": 39.042782,
            "height": 70.135667,
            "elevation": 69.6,
            "attitude_head": -18,
            "attitude_pitch": 0.6,
            "attitude_roll": -1.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370706448,
            "update_time": 1698370706448
        },
        {
            "id": 20674,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370703970,
            "format_time": "2023-10-27T09:38:23.97",
            "longitude": 115.847905,
            "latitude": 39.042782,
            "height": 80.135667,
            "elevation": 79.6,
            "attitude_head": -18,
            "attitude_pitch": 0.5,
            "attitude_roll": -1.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370708368,
            "update_time": 1698370708368
        },
        {
            "id": 20675,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370705972,
            "format_time": "2023-10-27T09:38:25.972",
            "longitude": 115.847904,
            "latitude": 39.042782,
            "height": 90.235667,
            "elevation": 89.7,
            "attitude_head": -18,
            "attitude_pitch": 0.4,
            "attitude_roll": -1.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370710402,
            "update_time": 1698370710402
        },
        {
            "id": 20676,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370707969,
            "format_time": "2023-10-27T09:38:27.969",
            "longitude": 115.847904,
            "latitude": 39.042782,
            "height": 98.435667,
            "elevation": 97.9,
            "attitude_head": -18.1,
            "attitude_pitch": 0.6,
            "attitude_roll": -2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370712413,
            "update_time": 1698370712413
        },
        {
            "id": 20677,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370709970,
            "format_time": "2023-10-27T09:38:29.97",
            "longitude": 115.847903,
            "latitude": 39.042782,
            "height": 100.135667,
            "elevation": 99.6,
            "attitude_head": -18,
            "attitude_pitch": 0.2,
            "attitude_roll": -2.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -18.1,
            "payload_index": "66-0-0",
            "create_time": 1698370714362,
            "update_time": 1698370714362
        },
        {
            "id": 20678,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370711970,
            "format_time": "2023-10-27T09:38:31.97",
            "longitude": 115.847901,
            "latitude": 39.042781,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": -94.9,
            "attitude_pitch": -12.3,
            "attitude_roll": -6.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -104.6,
            "payload_index": "66-0-0",
            "create_time": 1698370716382,
            "update_time": 1698370716382
        },
        {
            "id": 20679,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370713972,
            "format_time": "2023-10-27T09:38:33.972",
            "longitude": 115.847831,
            "latitude": 39.042744,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": -121.9,
            "attitude_pitch": -1.3,
            "attitude_roll": 1.7,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -116.3,
            "payload_index": "66-0-0",
            "create_time": 1698370718437,
            "update_time": 1698370718438
        },
        {
            "id": 20680,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370715970,
            "format_time": "2023-10-27T09:38:35.97",
            "longitude": 115.847747,
            "latitude": 39.042706,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -121.8,
            "attitude_pitch": 6.3,
            "attitude_roll": -2.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -115.1,
            "payload_index": "66-0-0",
            "create_time": 1698370720392,
            "update_time": 1698370720393
        },
        {
            "id": 20681,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370717970,
            "format_time": "2023-10-27T09:38:37.97",
            "longitude": 115.847725,
            "latitude": 39.042695,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": -121.6,
            "attitude_pitch": 0,
            "attitude_roll": 0.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -114.2,
            "payload_index": "66-0-0",
            "create_time": 1698370722387,
            "update_time": 1698370722387
        },
        {
            "id": 20682,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370719971,
            "format_time": "2023-10-27T09:38:39.971",
            "longitude": 115.847722,
            "latitude": 39.042694,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": -121.6,
            "attitude_pitch": -1.3,
            "attitude_roll": 0.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -114.2,
            "payload_index": "66-0-0",
            "create_time": 1698370724367,
            "update_time": 1698370724367
        },
        {
            "id": 20683,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370721969,
            "format_time": "2023-10-27T09:38:41.969",
            "longitude": 115.847721,
            "latitude": 39.042695,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": -121.6,
            "attitude_pitch": -0.8,
            "attitude_roll": 0.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -114.2,
            "payload_index": "66-0-0",
            "create_time": 1698370726372,
            "update_time": 1698370726372
        },
        {
            "id": 20684,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370723979,
            "format_time": "2023-10-27T09:38:43.979",
            "longitude": 115.847721,
            "latitude": 39.042695,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -121.5,
            "attitude_pitch": -0.8,
            "attitude_roll": 0.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -6.8,
            "gimbal_yaw": -114.2,
            "payload_index": "66-0-0",
            "create_time": 1698370728412,
            "update_time": 1698370728413
        },
        {
            "id": 20685,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370725972,
            "format_time": "2023-10-27T09:38:45.972",
            "longitude": 115.847721,
            "latitude": 39.042705,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -9.7,
            "attitude_pitch": -17.4,
            "attitude_roll": 2.5,
            "mode_code": 5,
            "gimbal_roll": -0.3,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -7.7,
            "payload_index": "66-0-0",
            "create_time": 1698370730392,
            "update_time": 1698370730393
        },
        {
            "id": 20686,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370727975,
            "format_time": "2023-10-27T09:38:47.975",
            "longitude": 115.84772,
            "latitude": 39.042789,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": 1.1,
            "attitude_roll": -0.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 7.1,
            "payload_index": "66-0-0",
            "create_time": 1698370732413,
            "update_time": 1698370732413
        },
        {
            "id": 20687,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370729972,
            "format_time": "2023-10-27T09:38:49.972",
            "longitude": 115.847721,
            "latitude": 39.042877,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -4.2,
            "attitude_roll": -1.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370734368,
            "update_time": 1698370734368
        },
        {
            "id": 20688,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370731974,
            "format_time": "2023-10-27T09:38:51.974",
            "longitude": 115.847721,
            "latitude": 39.042967,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.3,
            "attitude_roll": -1.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370736377,
            "update_time": 1698370736377
        },
        {
            "id": 20689,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370733972,
            "format_time": "2023-10-27T09:38:53.972",
            "longitude": 115.847721,
            "latitude": 39.043057,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.4,
            "attitude_roll": -0.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370738373,
            "update_time": 1698370738373
        },
        {
            "id": 20690,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370735970,
            "format_time": "2023-10-27T09:38:55.97",
            "longitude": 115.847721,
            "latitude": 39.043146,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.7,
            "attitude_roll": -0.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370740372,
            "update_time": 1698370740372
        },
        {
            "id": 20691,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370737971,
            "format_time": "2023-10-27T09:38:57.971",
            "longitude": 115.847721,
            "latitude": 39.043236,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3,
            "attitude_roll": -1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370742367,
            "update_time": 1698370742368
        },
        {
            "id": 20692,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370739972,
            "format_time": "2023-10-27T09:38:59.972",
            "longitude": 115.847721,
            "latitude": 39.043326,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -2.9,
            "attitude_roll": -1.7,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370744393,
            "update_time": 1698370744393
        },
        {
            "id": 20693,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370741971,
            "format_time": "2023-10-27T09:39:01.971",
            "longitude": 115.84772,
            "latitude": 39.043415,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.8,
            "attitude_roll": -0.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370746512,
            "update_time": 1698370746512
        },
        {
            "id": 20694,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370743972,
            "format_time": "2023-10-27T09:39:03.972",
            "longitude": 115.84772,
            "latitude": 39.043506,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.3,
            "attitude_roll": -0.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370748392,
            "update_time": 1698370748392
        },
        {
            "id": 20695,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370745971,
            "format_time": "2023-10-27T09:39:05.971",
            "longitude": 115.84772,
            "latitude": 39.043595,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.5,
            "attitude_roll": -0.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370750372,
            "update_time": 1698370750372
        },
        {
            "id": 20696,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370747972,
            "format_time": "2023-10-27T09:39:07.972",
            "longitude": 115.84772,
            "latitude": 39.043685,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -2.9,
            "attitude_roll": -0.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370752387,
            "update_time": 1698370752387
        },
        {
            "id": 20697,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370749971,
            "format_time": "2023-10-27T09:39:09.971",
            "longitude": 115.84772,
            "latitude": 39.043774,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": -4.2,
            "attitude_roll": -0.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370754377,
            "update_time": 1698370754377
        },
        {
            "id": 20698,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370751974,
            "format_time": "2023-10-27T09:39:11.974",
            "longitude": 115.84772,
            "latitude": 39.043865,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": -3.8,
            "attitude_roll": -0.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370756382,
            "update_time": 1698370756382
        },
        {
            "id": 20699,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370753972,
            "format_time": "2023-10-27T09:39:13.972",
            "longitude": 115.84772,
            "latitude": 39.043954,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": 6.7,
            "attitude_roll": 0,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370758387,
            "update_time": 1698370758387
        },
        {
            "id": 20700,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370755972,
            "format_time": "2023-10-27T09:39:15.972",
            "longitude": 115.847721,
            "latitude": 39.044007,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": -0.1,
            "attitude_pitch": 13.3,
            "attitude_roll": -1.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.4,
            "payload_index": "66-0-0",
            "create_time": 1698370760387,
            "update_time": 1698370760387
        },
        {
            "id": 20701,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370757973,
            "format_time": "2023-10-27T09:39:17.973",
            "longitude": 115.847721,
            "latitude": 39.044014,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": 1.3,
            "attitude_roll": -0.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 7.3,
            "payload_index": "66-0-0",
            "create_time": 1698370762367,
            "update_time": 1698370762367
        },
        {
            "id": 20702,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370759971,
            "format_time": "2023-10-27T09:39:19.971",
            "longitude": 115.847718,
            "latitude": 39.044015,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -70.5,
            "attitude_pitch": -10.4,
            "attitude_roll": -4.6,
            "mode_code": 5,
            "gimbal_roll": 0.5,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -56.7,
            "payload_index": "66-0-0",
            "create_time": 1698370764383,
            "update_time": 1698370764383
        },
        {
            "id": 20703,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370761973,
            "format_time": "2023-10-27T09:39:21.973",
            "longitude": 115.847638,
            "latitude": 39.044014,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -90.9,
            "attitude_pitch": -2.5,
            "attitude_roll": 0.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -83.2,
            "payload_index": "66-0-0",
            "create_time": 1698370766382,
            "update_time": 1698370766382
        },
        {
            "id": 20704,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370763970,
            "format_time": "2023-10-27T09:39:23.97",
            "longitude": 115.847539,
            "latitude": 39.044014,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -90.9,
            "attitude_pitch": 6.7,
            "attitude_roll": -0.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -83.4,
            "payload_index": "66-0-0",
            "create_time": 1698370768402,
            "update_time": 1698370768402
        },
        {
            "id": 20705,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370765970,
            "format_time": "2023-10-27T09:39:25.97",
            "longitude": 115.847513,
            "latitude": 39.044013,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -90.9,
            "attitude_pitch": 0.3,
            "attitude_roll": 0.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -83.5,
            "payload_index": "66-0-0",
            "create_time": 1698370770377,
            "update_time": 1698370770378
        },
        {
            "id": 20706,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370767972,
            "format_time": "2023-10-27T09:39:27.972",
            "longitude": 115.84751,
            "latitude": 39.044012,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -106.3,
            "attitude_pitch": -1.5,
            "attitude_roll": -2,
            "mode_code": 5,
            "gimbal_roll": 0.5,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -106.4,
            "payload_index": "66-0-0",
            "create_time": 1698370772382,
            "update_time": 1698370772383
        },
        {
            "id": 20707,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370769973,
            "format_time": "2023-10-27T09:39:29.973",
            "longitude": 115.847509,
            "latitude": 39.043983,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 179.9,
            "attitude_pitch": -19.9,
            "attitude_roll": 1.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -172.1,
            "payload_index": "66-0-0",
            "create_time": 1698370774372,
            "update_time": 1698370774372
        },
        {
            "id": 20708,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370771974,
            "format_time": "2023-10-27T09:39:31.974",
            "longitude": 115.84751,
            "latitude": 39.04389,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 179.6,
            "attitude_pitch": -4,
            "attitude_roll": 0.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370776387,
            "update_time": 1698370776387
        },
        {
            "id": 20709,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370773971,
            "format_time": "2023-10-27T09:39:33.971",
            "longitude": 115.84751,
            "latitude": 39.043801,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -4.2,
            "attitude_roll": 1.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370778367,
            "update_time": 1698370778367
        },
        {
            "id": 20710,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370775971,
            "format_time": "2023-10-27T09:39:35.971",
            "longitude": 115.847511,
            "latitude": 39.043711,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -4.2,
            "attitude_roll": 1.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370780373,
            "update_time": 1698370780373
        },
        {
            "id": 20711,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370777972,
            "format_time": "2023-10-27T09:39:37.972",
            "longitude": 115.847511,
            "latitude": 39.043621,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -4.1,
            "attitude_roll": 1.7,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370782377,
            "update_time": 1698370782377
        },
        {
            "id": 20712,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370779973,
            "format_time": "2023-10-27T09:39:39.973",
            "longitude": 115.847511,
            "latitude": 39.043531,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -3.6,
            "attitude_roll": 1.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370784367,
            "update_time": 1698370784367
        },
        {
            "id": 20713,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370781975,
            "format_time": "2023-10-27T09:39:41.975",
            "longitude": 115.847512,
            "latitude": 39.043441,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -4.3,
            "attitude_roll": 1.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370786377,
            "update_time": 1698370786377
        },
        {
            "id": 20714,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370783973,
            "format_time": "2023-10-27T09:39:43.973",
            "longitude": 115.847513,
            "latitude": 39.043352,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -4.8,
            "attitude_roll": 1.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370788372,
            "update_time": 1698370788373
        },
        {
            "id": 20715,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370785972,
            "format_time": "2023-10-27T09:39:45.972",
            "longitude": 115.847513,
            "latitude": 39.043262,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -4.4,
            "attitude_roll": 2.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370790382,
            "update_time": 1698370790382
        },
        {
            "id": 20716,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370787969,
            "format_time": "2023-10-27T09:39:47.969",
            "longitude": 115.847514,
            "latitude": 39.043172,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -4.2,
            "attitude_roll": 1.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370792373,
            "update_time": 1698370792373
        },
        {
            "id": 20717,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370789970,
            "format_time": "2023-10-27T09:39:49.97",
            "longitude": 115.847514,
            "latitude": 39.043082,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -4,
            "attitude_roll": 0.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370794413,
            "update_time": 1698370794413
        },
        {
            "id": 20718,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370791970,
            "format_time": "2023-10-27T09:39:51.97",
            "longitude": 115.847514,
            "latitude": 39.042992,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -3.7,
            "attitude_roll": 1.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370796382,
            "update_time": 1698370796382
        },
        {
            "id": 20719,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370793972,
            "format_time": "2023-10-27T09:39:53.972",
            "longitude": 115.847515,
            "latitude": 39.042904,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -4.3,
            "attitude_roll": 1.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370798372,
            "update_time": 1698370798372
        },
        {
            "id": 20720,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370795973,
            "format_time": "2023-10-27T09:39:55.973",
            "longitude": 115.847515,
            "latitude": 39.042813,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -4.4,
            "attitude_roll": 1.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -172.8,
            "payload_index": "66-0-0",
            "create_time": 1698370800402,
            "update_time": 1698370800402
        },
        {
            "id": 20721,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370797972,
            "format_time": "2023-10-27T09:39:57.972",
            "longitude": 115.847516,
            "latitude": 39.042727,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": 9,
            "attitude_roll": 0.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -172.9,
            "payload_index": "66-0-0",
            "create_time": 1698370802372,
            "update_time": 1698370802372
        },
        {
            "id": 20722,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370799969,
            "format_time": "2023-10-27T09:39:59.969",
            "longitude": 115.847516,
            "latitude": 39.042691,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 179.4,
            "attitude_pitch": 2.7,
            "attitude_roll": 2.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173,
            "payload_index": "66-0-0",
            "create_time": 1698370804382,
            "update_time": 1698370804382
        },
        {
            "id": 20723,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370801973,
            "format_time": "2023-10-27T09:40:01.973",
            "longitude": 115.847515,
            "latitude": 39.042688,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 179.7,
            "attitude_pitch": -0.3,
            "attitude_roll": 2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -172.9,
            "payload_index": "66-0-0",
            "create_time": 1698370806388,
            "update_time": 1698370806388
        },
        {
            "id": 20724,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370803973,
            "format_time": "2023-10-27T09:40:03.973",
            "longitude": 115.847516,
            "latitude": 39.042687,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 136.9,
            "attitude_pitch": -2.9,
            "attitude_roll": -1.8,
            "mode_code": 5,
            "gimbal_roll": 0.5,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 150.9,
            "payload_index": "66-0-0",
            "create_time": 1698370808372,
            "update_time": 1698370808372
        },
        {
            "id": 20725,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370805971,
            "format_time": "2023-10-27T09:40:05.971",
            "longitude": 115.847573,
            "latitude": 39.042686,
            "height": 100.535667,
            "elevation": 100,
            "attitude_head": 90.1,
            "attitude_pitch": -0.1,
            "attitude_roll": 1.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 97.7,
            "payload_index": "66-0-0",
            "create_time": 1698370810392,
            "update_time": 1698370810392
        },
        {
            "id": 20726,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370807970,
            "format_time": "2023-10-27T09:40:07.97",
            "longitude": 115.847638,
            "latitude": 39.042686,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 90,
            "attitude_pitch": 14.8,
            "attitude_roll": 1.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 97.2,
            "payload_index": "66-0-0",
            "create_time": 1698370812397,
            "update_time": 1698370812397
        },
        {
            "id": 20727,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370809973,
            "format_time": "2023-10-27T09:40:09.973",
            "longitude": 115.847644,
            "latitude": 39.042686,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 89.9,
            "attitude_pitch": 2.1,
            "attitude_roll": 1.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 97.3,
            "payload_index": "66-0-0",
            "create_time": 1698370814412,
            "update_time": 1698370814412
        },
        {
            "id": 20728,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370811981,
            "format_time": "2023-10-27T09:40:11.981",
            "longitude": 115.847646,
            "latitude": 39.042686,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 89.5,
            "attitude_pitch": 2.7,
            "attitude_roll": 1.9,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 97.3,
            "payload_index": "66-0-0",
            "create_time": 1698370816372,
            "update_time": 1698370816372
        },
        {
            "id": 20729,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370813969,
            "format_time": "2023-10-27T09:40:13.969",
            "longitude": 115.847646,
            "latitude": 39.042686,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 68.4,
            "attitude_pitch": 0.2,
            "attitude_roll": 0.1,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 76.1,
            "payload_index": "66-0-0",
            "create_time": 1698370818452,
            "update_time": 1698370818452
        },
        {
            "id": 20730,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370815970,
            "format_time": "2023-10-27T09:40:15.97",
            "longitude": 115.84766,
            "latitude": 39.042692,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 65.6,
            "attitude_pitch": -5.5,
            "attitude_roll": -0.2,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 73.2,
            "payload_index": "66-0-0",
            "create_time": 1698370820417,
            "update_time": 1698370820417
        },
        {
            "id": 20731,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370817974,
            "format_time": "2023-10-27T09:40:17.974",
            "longitude": 115.847715,
            "latitude": 39.042712,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 65.2,
            "attitude_pitch": -5.2,
            "attitude_roll": 1,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 72.8,
            "payload_index": "66-0-0",
            "create_time": 1698370822397,
            "update_time": 1698370822398
        },
        {
            "id": 20732,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370819977,
            "format_time": "2023-10-27T09:40:19.977",
            "longitude": 115.847799,
            "latitude": 39.042742,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 65.1,
            "attitude_pitch": -0.6,
            "attitude_roll": -0.6,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 72.7,
            "payload_index": "66-0-0",
            "create_time": 1698370824392,
            "update_time": 1698370824392
        },
        {
            "id": 20733,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370821973,
            "format_time": "2023-10-27T09:40:21.973",
            "longitude": 115.847873,
            "latitude": 39.042769,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 65,
            "attitude_pitch": 2.6,
            "attitude_roll": -1.1,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 72.6,
            "payload_index": "66-0-0",
            "create_time": 1698370826372,
            "update_time": 1698370826372
        },
        {
            "id": 20734,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370823969,
            "format_time": "2023-10-27T09:40:23.969",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 65.1,
            "attitude_pitch": 3,
            "attitude_roll": -0.2,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 72.6,
            "payload_index": "66-0-0",
            "create_time": 1698370828383,
            "update_time": 1698370828383
        },
        {
            "id": 20735,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370825969,
            "format_time": "2023-10-27T09:40:25.969",
            "longitude": 115.847907,
            "latitude": 39.04278,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": 5.3,
            "attitude_pitch": 0.4,
            "attitude_roll": -1.2,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 13.2,
            "payload_index": "66-0-0",
            "create_time": 1698370830432,
            "update_time": 1698370830432
        },
        {
            "id": 20736,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370827971,
            "format_time": "2023-10-27T09:40:27.971",
            "longitude": 115.847908,
            "latitude": 39.04278,
            "height": 100.435667,
            "elevation": 99.9,
            "attitude_head": -19.9,
            "attitude_pitch": 0,
            "attitude_roll": -1.2,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -12.5,
            "payload_index": "66-0-0",
            "create_time": 1698370832377,
            "update_time": 1698370832377
        },
        {
            "id": 20737,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370829972,
            "format_time": "2023-10-27T09:40:29.972",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 96.635667,
            "elevation": 96.1,
            "attitude_head": -22.6,
            "attitude_pitch": -0.1,
            "attitude_roll": -1.1,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -15.3,
            "payload_index": "66-0-0",
            "create_time": 1698370834372,
            "update_time": 1698370834372
        },
        {
            "id": 20738,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370831971,
            "format_time": "2023-10-27T09:40:31.971",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 84.635667,
            "elevation": 84.1,
            "attitude_head": -22.6,
            "attitude_pitch": 1.4,
            "attitude_roll": 1.3,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -15.5,
            "payload_index": "66-0-0",
            "create_time": 1698370836392,
            "update_time": 1698370836393
        },
        {
            "id": 20739,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370833970,
            "format_time": "2023-10-27T09:40:33.97",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 72.735667,
            "elevation": 72.2,
            "attitude_head": -23,
            "attitude_pitch": 0.6,
            "attitude_roll": -2.6,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -15.8,
            "payload_index": "66-0-0",
            "create_time": 1698370838392,
            "update_time": 1698370838392
        },
        {
            "id": 20740,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370835973,
            "format_time": "2023-10-27T09:40:35.973",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 60.635667,
            "elevation": 60.1,
            "attitude_head": -22.9,
            "attitude_pitch": 2,
            "attitude_roll": 0,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -15.8,
            "payload_index": "66-0-0",
            "create_time": 1698370840383,
            "update_time": 1698370840383
        },
        {
            "id": 20741,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370837971,
            "format_time": "2023-10-27T09:40:37.971",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 48.635667,
            "elevation": 48.1,
            "attitude_head": -22.9,
            "attitude_pitch": -0.8,
            "attitude_roll": 0.5,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -15.8,
            "payload_index": "66-0-0",
            "create_time": 1698370842378,
            "update_time": 1698370842378
        },
        {
            "id": 20742,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370839973,
            "format_time": "2023-10-27T09:40:39.973",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 37.835667,
            "elevation": 37.3,
            "attitude_head": -23,
            "attitude_pitch": 2.7,
            "attitude_roll": -0.7,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -15.8,
            "payload_index": "66-0-0",
            "create_time": 1698370844377,
            "update_time": 1698370844378
        },
        {
            "id": 20743,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370841974,
            "format_time": "2023-10-27T09:40:41.974",
            "longitude": 115.847908,
            "latitude": 39.042782,
            "height": 29.835667,
            "elevation": 29.3,
            "attitude_head": -23,
            "attitude_pitch": 2.1,
            "attitude_roll": -2.2,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -16.1,
            "payload_index": "66-0-0",
            "create_time": 1698370846373,
            "update_time": 1698370846373
        },
        {
            "id": 20744,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370843971,
            "format_time": "2023-10-27T09:40:43.971",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 21.835667,
            "elevation": 21.3,
            "attitude_head": -23.6,
            "attitude_pitch": 3.4,
            "attitude_roll": -2.4,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370848413,
            "update_time": 1698370848413
        },
        {
            "id": 20745,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370845977,
            "format_time": "2023-10-27T09:40:45.977",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 16.135667,
            "elevation": 15.6,
            "attitude_head": -24,
            "attitude_pitch": 3.7,
            "attitude_roll": -2.1,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370850362,
            "update_time": 1698370850362
        },
        {
            "id": 20746,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370847970,
            "format_time": "2023-10-27T09:40:47.97",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 11.835667,
            "elevation": 11.3,
            "attitude_head": -23.2,
            "attitude_pitch": 1.4,
            "attitude_roll": -1.2,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370852372,
            "update_time": 1698370852373
        },
        {
            "id": 20747,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370849973,
            "format_time": "2023-10-27T09:40:49.973",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 8.735666,
            "elevation": 8.2,
            "attitude_head": -23.2,
            "attitude_pitch": 1.7,
            "attitude_roll": -0.5,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370854377,
            "update_time": 1698370854377
        },
        {
            "id": 20748,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370851972,
            "format_time": "2023-10-27T09:40:51.972",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 6.335667,
            "elevation": 5.8,
            "attitude_head": -23.2,
            "attitude_pitch": 1.3,
            "attitude_roll": -0.3,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370856372,
            "update_time": 1698370856372
        },
        {
            "id": 20749,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370853971,
            "format_time": "2023-10-27T09:40:53.971",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 4.335667,
            "elevation": 3.8,
            "attitude_head": -23.2,
            "attitude_pitch": 0,
            "attitude_roll": 1.2,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370858368,
            "update_time": 1698370858368
        },
        {
            "id": 20750,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370855974,
            "format_time": "2023-10-27T09:40:55.974",
            "longitude": 115.847908,
            "latitude": 39.042781,
            "height": 2.735667,
            "elevation": 2.2,
            "attitude_head": -23.4,
            "attitude_pitch": 1.4,
            "attitude_roll": 0,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370860387,
            "update_time": 1698370860387
        },
        {
            "id": 20751,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370857972,
            "format_time": "2023-10-27T09:40:57.972",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 2.435667,
            "elevation": 1.9,
            "attitude_head": -23.3,
            "attitude_pitch": 1,
            "attitude_roll": 0.2,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370862372,
            "update_time": 1698370862373
        },
        {
            "id": 20752,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370859969,
            "format_time": "2023-10-27T09:40:59.969",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 2.035667,
            "elevation": 1.5,
            "attitude_head": -23.4,
            "attitude_pitch": 1.1,
            "attitude_roll": 0,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370864393,
            "update_time": 1698370864393
        },
        {
            "id": 20753,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370861970,
            "format_time": "2023-10-27T09:41:01.97",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 1.635667,
            "elevation": 1.1,
            "attitude_head": -23.2,
            "attitude_pitch": 0.8,
            "attitude_roll": 0,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370866382,
            "update_time": 1698370866382
        },
        {
            "id": 20754,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370863973,
            "format_time": "2023-10-27T09:41:03.973",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 1.135667,
            "elevation": 0.6,
            "attitude_head": -23.4,
            "attitude_pitch": 0.5,
            "attitude_roll": -0.1,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370868383,
            "update_time": 1698370868383
        },
        {
            "id": 20755,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370865971,
            "format_time": "2023-10-27T09:41:05.971",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 0.735667,
            "elevation": 0.2,
            "attitude_head": -23.2,
            "attitude_pitch": 0.7,
            "attitude_roll": -0.7,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370870388,
            "update_time": 1698370870388
        },
        {
            "id": 20756,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698370867969,
            "format_time": "2023-10-27T09:41:07.969",
            "longitude": 115.847907,
            "latitude": 39.042781,
            "height": 0.535667,
            "elevation": 0,
            "attitude_head": -23.5,
            "attitude_pitch": 4.7,
            "attitude_roll": 0.7,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -16.2,
            "payload_index": "66-0-0",
            "create_time": 1698370872477,
            "update_time": 1698370872477
        },
        {
            "id": 20757,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371411327,
            "format_time": "2023-10-27T09:50:11.327",
            "longitude": 115.847751,
            "latitude": 39.042789,
            "height": 1.053846,
            "elevation": 0.6,
            "attitude_head": -26.3,
            "attitude_pitch": 2.1,
            "attitude_roll": -0.2,
            "mode_code": 4,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371415662,
            "update_time": 1698371415662
        },
        {
            "id": 20758,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371413327,
            "format_time": "2023-10-27T09:50:13.327",
            "longitude": 115.847751,
            "latitude": 39.04279,
            "height": 1.553843,
            "elevation": 1.1,
            "attitude_head": -26,
            "attitude_pitch": 3,
            "attitude_roll": 0.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371417652,
            "update_time": 1698371417652
        },
        {
            "id": 20759,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371415327,
            "format_time": "2023-10-27T09:50:15.327",
            "longitude": 115.847751,
            "latitude": 39.04279,
            "height": 7.453844,
            "elevation": 7,
            "attitude_head": -26.1,
            "attitude_pitch": 1.8,
            "attitude_roll": 0,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371419652,
            "update_time": 1698371419652
        },
        {
            "id": 20760,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371417328,
            "format_time": "2023-10-27T09:50:17.328",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 17.553846,
            "elevation": 17.1,
            "attitude_head": -26.1,
            "attitude_pitch": -0.7,
            "attitude_roll": -0.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371421651,
            "update_time": 1698371421651
        },
        {
            "id": 20761,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371419330,
            "format_time": "2023-10-27T09:50:19.33",
            "longitude": 115.847753,
            "latitude": 39.04279,
            "height": 28.553842,
            "elevation": 28.1,
            "attitude_head": -26,
            "attitude_pitch": -0.3,
            "attitude_roll": -0.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371423656,
            "update_time": 1698371423656
        },
        {
            "id": 20762,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371421330,
            "format_time": "2023-10-27T09:50:21.33",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 37.553846,
            "elevation": 37.1,
            "attitude_head": -26,
            "attitude_pitch": -0.5,
            "attitude_roll": -1.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371425661,
            "update_time": 1698371425661
        },
        {
            "id": 20763,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371423329,
            "format_time": "2023-10-27T09:50:23.329",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 48.553846,
            "elevation": 48.1,
            "attitude_head": -26.1,
            "attitude_pitch": 0.2,
            "attitude_roll": -0.7,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371427653,
            "update_time": 1698371427653
        },
        {
            "id": 20764,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371425326,
            "format_time": "2023-10-27T09:50:25.326",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 57.653846,
            "elevation": 57.2,
            "attitude_head": -26,
            "attitude_pitch": -0.3,
            "attitude_roll": -0.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371429651,
            "update_time": 1698371429651
        },
        {
            "id": 20765,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371427328,
            "format_time": "2023-10-27T09:50:27.328",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 68.65385,
            "elevation": 68.2,
            "attitude_head": -26.1,
            "attitude_pitch": 0.2,
            "attitude_roll": -1.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371431665,
            "update_time": 1698371431665
        },
        {
            "id": 20766,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371429328,
            "format_time": "2023-10-27T09:50:29.328",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 77.65385,
            "elevation": 77.2,
            "attitude_head": -26,
            "attitude_pitch": -0.5,
            "attitude_roll": -1.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371433651,
            "update_time": 1698371433651
        },
        {
            "id": 20767,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371431330,
            "format_time": "2023-10-27T09:50:31.33",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 88.653842,
            "elevation": 88.2,
            "attitude_head": -26.1,
            "attitude_pitch": -0.5,
            "attitude_roll": -1.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371435661,
            "update_time": 1698371435661
        },
        {
            "id": 20768,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371433331,
            "format_time": "2023-10-27T09:50:33.331",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 97.35385,
            "elevation": 96.9,
            "attitude_head": -26.1,
            "attitude_pitch": -0.6,
            "attitude_roll": -1.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371437662,
            "update_time": 1698371437662
        },
        {
            "id": 20769,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371435328,
            "format_time": "2023-10-27T09:50:35.328",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 99.95385,
            "elevation": 99.5,
            "attitude_head": -26,
            "attitude_pitch": -1,
            "attitude_roll": -1.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -26,
            "payload_index": "66-0-0",
            "create_time": 1698371439661,
            "update_time": 1698371439661
        },
        {
            "id": 20770,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371437328,
            "format_time": "2023-10-27T09:50:37.328",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": -66.2,
            "attitude_pitch": -0.1,
            "attitude_roll": -5.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -72,
            "payload_index": "66-0-0",
            "create_time": 1698371442267,
            "update_time": 1698371442267
        },
        {
            "id": 20771,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371439327,
            "format_time": "2023-10-27T09:50:39.327",
            "longitude": 115.847742,
            "latitude": 39.042746,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": -164.4,
            "attitude_pitch": 0.5,
            "attitude_roll": 5.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -160.1,
            "payload_index": "66-0-0",
            "create_time": 1698371443664,
            "update_time": 1698371443664
        },
        {
            "id": 20772,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371441329,
            "format_time": "2023-10-27T09:50:41.329",
            "longitude": 115.847724,
            "latitude": 39.0427,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": -164.9,
            "attitude_pitch": 8.7,
            "attitude_roll": 2.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -159.4,
            "payload_index": "66-0-0",
            "create_time": 1698371445674,
            "update_time": 1698371445674
        },
        {
            "id": 20773,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371443327,
            "format_time": "2023-10-27T09:50:43.327",
            "longitude": 115.847721,
            "latitude": 39.042695,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": -164.8,
            "attitude_pitch": 0.2,
            "attitude_roll": 2.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -158.6,
            "payload_index": "66-0-0",
            "create_time": 1698371447653,
            "update_time": 1698371447653
        },
        {
            "id": 20774,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371445328,
            "format_time": "2023-10-27T09:50:45.328",
            "longitude": 115.847721,
            "latitude": 39.042695,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": -164.8,
            "attitude_pitch": -0.1,
            "attitude_roll": 2.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -158.5,
            "payload_index": "66-0-0",
            "create_time": 1698371449661,
            "update_time": 1698371449661
        },
        {
            "id": 20775,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371447329,
            "format_time": "2023-10-27T09:50:47.329",
            "longitude": 115.847721,
            "latitude": 39.042696,
            "height": 100.453842,
            "elevation": 100,
            "attitude_head": -164.7,
            "attitude_pitch": 0,
            "attitude_roll": 2.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -158.5,
            "payload_index": "66-0-0",
            "create_time": 1698371451657,
            "update_time": 1698371451657
        },
        {
            "id": 20776,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371449326,
            "format_time": "2023-10-27T09:50:49.326",
            "longitude": 115.847721,
            "latitude": 39.042704,
            "height": 100.453842,
            "elevation": 100,
            "attitude_head": -55.2,
            "attitude_pitch": -11.6,
            "attitude_roll": 14.9,
            "mode_code": 5,
            "gimbal_roll": -0.5,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -40.4,
            "payload_index": "66-0-0",
            "create_time": 1698371453655,
            "update_time": 1698371453655
        },
        {
            "id": 20777,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371451329,
            "format_time": "2023-10-27T09:50:51.329",
            "longitude": 115.847721,
            "latitude": 39.042786,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": 0.5,
            "attitude_roll": -0.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 5.9,
            "payload_index": "66-0-0",
            "create_time": 1698371455657,
            "update_time": 1698371455657
        },
        {
            "id": 20778,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371453329,
            "format_time": "2023-10-27T09:50:53.329",
            "longitude": 115.847721,
            "latitude": 39.042875,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -4,
            "attitude_roll": -1.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 6.3,
            "payload_index": "66-0-0",
            "create_time": 1698371457657,
            "update_time": 1698371457657
        },
        {
            "id": 20779,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371455327,
            "format_time": "2023-10-27T09:50:55.327",
            "longitude": 115.847721,
            "latitude": 39.042965,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.5,
            "attitude_roll": -1.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371459666,
            "update_time": 1698371459666
        },
        {
            "id": 20780,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371457328,
            "format_time": "2023-10-27T09:50:57.328",
            "longitude": 115.84772,
            "latitude": 39.043054,
            "height": 100.453842,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -4.1,
            "attitude_roll": -0.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371461664,
            "update_time": 1698371461664
        },
        {
            "id": 20781,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371459327,
            "format_time": "2023-10-27T09:50:59.327",
            "longitude": 115.847721,
            "latitude": 39.043153,
            "height": 100.453842,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -4.2,
            "attitude_roll": -1.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371463662,
            "update_time": 1698371463662
        },
        {
            "id": 20782,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371461330,
            "format_time": "2023-10-27T09:51:01.33",
            "longitude": 115.847721,
            "latitude": 39.043243,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": -4.2,
            "attitude_roll": -1.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371465652,
            "update_time": 1698371465652
        },
        {
            "id": 20783,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371463327,
            "format_time": "2023-10-27T09:51:03.327",
            "longitude": 115.847721,
            "latitude": 39.043324,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": -5.2,
            "attitude_roll": -0.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371467654,
            "update_time": 1698371467654
        },
        {
            "id": 20784,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371465328,
            "format_time": "2023-10-27T09:51:05.328",
            "longitude": 115.847721,
            "latitude": 39.043414,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": -4.4,
            "attitude_roll": -0.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371469657,
            "update_time": 1698371469657
        },
        {
            "id": 20785,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371467327,
            "format_time": "2023-10-27T09:51:07.327",
            "longitude": 115.847721,
            "latitude": 39.043513,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": -4.4,
            "attitude_roll": -0.7,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371471651,
            "update_time": 1698371471651
        },
        {
            "id": 20786,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371469329,
            "format_time": "2023-10-27T09:51:09.329",
            "longitude": 115.847721,
            "latitude": 39.043594,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.6,
            "attitude_roll": -0.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371473671,
            "update_time": 1698371473671
        },
        {
            "id": 20787,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371471327,
            "format_time": "2023-10-27T09:51:11.327",
            "longitude": 115.847721,
            "latitude": 39.043684,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -4.1,
            "attitude_roll": -0.7,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371475651,
            "update_time": 1698371475651
        },
        {
            "id": 20788,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371473328,
            "format_time": "2023-10-27T09:51:13.328",
            "longitude": 115.847721,
            "latitude": 39.043783,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": -3.8,
            "attitude_roll": -1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371477654,
            "update_time": 1698371477654
        },
        {
            "id": 20789,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371475327,
            "format_time": "2023-10-27T09:51:15.327",
            "longitude": 115.847721,
            "latitude": 39.043863,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": -3.8,
            "attitude_roll": -0.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371479665,
            "update_time": 1698371479665
        },
        {
            "id": 20790,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371477327,
            "format_time": "2023-10-27T09:51:17.327",
            "longitude": 115.847721,
            "latitude": 39.043953,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 0,
            "attitude_pitch": 3.7,
            "attitude_roll": -1.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 6.4,
            "payload_index": "66-0-0",
            "create_time": 1698371481663,
            "update_time": 1698371481664
        },
        {
            "id": 20791,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371479326,
            "format_time": "2023-10-27T09:51:19.326",
            "longitude": 115.847722,
            "latitude": 39.044007,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 0.2,
            "attitude_pitch": 11.5,
            "attitude_roll": -2.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 6.5,
            "payload_index": "66-0-0",
            "create_time": 1698371483650,
            "update_time": 1698371483650
        },
        {
            "id": 20792,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371481328,
            "format_time": "2023-10-27T09:51:21.328",
            "longitude": 115.847721,
            "latitude": 39.044014,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 0,
            "attitude_pitch": 0.5,
            "attitude_roll": -1.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 6.5,
            "payload_index": "66-0-0",
            "create_time": 1698371485654,
            "update_time": 1698371485654
        },
        {
            "id": 20793,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371483328,
            "format_time": "2023-10-27T09:51:23.328",
            "longitude": 115.847718,
            "latitude": 39.044016,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": -76.2,
            "attitude_pitch": -13.1,
            "attitude_roll": -4.2,
            "mode_code": 5,
            "gimbal_roll": 0.5,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -61.4,
            "payload_index": "66-0-0",
            "create_time": 1698371487653,
            "update_time": 1698371487653
        },
        {
            "id": 20794,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371485327,
            "format_time": "2023-10-27T09:51:25.327",
            "longitude": 115.847635,
            "latitude": 39.044015,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": -90.8,
            "attitude_pitch": -3,
            "attitude_roll": 0.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -84.1,
            "payload_index": "66-0-0",
            "create_time": 1698371489662,
            "update_time": 1698371489662
        },
        {
            "id": 20795,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371487329,
            "format_time": "2023-10-27T09:51:27.329",
            "longitude": 115.847544,
            "latitude": 39.044013,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": -90.9,
            "attitude_pitch": 4.7,
            "attitude_roll": 0.7,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -84.4,
            "payload_index": "66-0-0",
            "create_time": 1698371491660,
            "update_time": 1698371491660
        },
        {
            "id": 20796,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371489326,
            "format_time": "2023-10-27T09:51:29.326",
            "longitude": 115.847514,
            "latitude": 39.044013,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": -90.9,
            "attitude_pitch": -0.2,
            "attitude_roll": 0.6,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -84.5,
            "payload_index": "66-0-0",
            "create_time": 1698371493699,
            "update_time": 1698371493699
        },
        {
            "id": 20797,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371491327,
            "format_time": "2023-10-27T09:51:31.327",
            "longitude": 115.84751,
            "latitude": 39.044013,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": -90.9,
            "attitude_pitch": -0.8,
            "attitude_roll": 1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -84.5,
            "payload_index": "66-0-0",
            "create_time": 1698371495671,
            "update_time": 1698371495671
        },
        {
            "id": 20798,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371493330,
            "format_time": "2023-10-27T09:51:33.33",
            "longitude": 115.847509,
            "latitude": 39.044009,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": -170.8,
            "attitude_pitch": -11.6,
            "attitude_roll": -0.5,
            "mode_code": 5,
            "gimbal_roll": 0.4,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -156.2,
            "payload_index": "66-0-0",
            "create_time": 1698371497658,
            "update_time": 1698371497658
        },
        {
            "id": 20799,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371495328,
            "format_time": "2023-10-27T09:51:35.328",
            "longitude": 115.84751,
            "latitude": 39.043941,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": 179.8,
            "attitude_pitch": 1.3,
            "attitude_roll": 1.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -173.4,
            "payload_index": "66-0-0",
            "create_time": 1698371499664,
            "update_time": 1698371499664
        },
        {
            "id": 20800,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371497326,
            "format_time": "2023-10-27T09:51:37.326",
            "longitude": 115.84751,
            "latitude": 39.04386,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -3.6,
            "attitude_roll": 0.9,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371501654,
            "update_time": 1698371501654
        },
        {
            "id": 20801,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371499327,
            "format_time": "2023-10-27T09:51:39.327",
            "longitude": 115.84751,
            "latitude": 39.043762,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -3.4,
            "attitude_roll": 1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371503664,
            "update_time": 1698371503664
        },
        {
            "id": 20802,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371501329,
            "format_time": "2023-10-27T09:51:41.329",
            "longitude": 115.847511,
            "latitude": 39.043681,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -4,
            "attitude_roll": 1.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371505659,
            "update_time": 1698371505659
        },
        {
            "id": 20803,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371503325,
            "format_time": "2023-10-27T09:51:43.325",
            "longitude": 115.847511,
            "latitude": 39.043591,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -3.3,
            "attitude_roll": 1.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371507659,
            "update_time": 1698371507659
        },
        {
            "id": 20804,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371505329,
            "format_time": "2023-10-27T09:51:45.329",
            "longitude": 115.847512,
            "latitude": 39.043501,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -3.7,
            "attitude_roll": 0.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371509659,
            "update_time": 1698371509659
        },
        {
            "id": 20805,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371507326,
            "format_time": "2023-10-27T09:51:47.326",
            "longitude": 115.847512,
            "latitude": 39.043411,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 179.6,
            "attitude_pitch": -3.2,
            "attitude_roll": 1.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371511629,
            "update_time": 1698371511629
        },
        {
            "id": 20806,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371509330,
            "format_time": "2023-10-27T09:51:49.33",
            "longitude": 115.847513,
            "latitude": 39.043313,
            "height": 100.453842,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -4.6,
            "attitude_roll": 1.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371513654,
            "update_time": 1698371513654
        },
        {
            "id": 20807,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371511327,
            "format_time": "2023-10-27T09:51:51.327",
            "longitude": 115.847513,
            "latitude": 39.043232,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 179.6,
            "attitude_pitch": -3.1,
            "attitude_roll": 1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371515651,
            "update_time": 1698371515651
        },
        {
            "id": 20808,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371513328,
            "format_time": "2023-10-27T09:51:53.328",
            "longitude": 115.847514,
            "latitude": 39.043133,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 179.6,
            "attitude_pitch": -3.3,
            "attitude_roll": 1.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371517658,
            "update_time": 1698371517658
        },
        {
            "id": 20809,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371515329,
            "format_time": "2023-10-27T09:51:55.329",
            "longitude": 115.847514,
            "latitude": 39.043053,
            "height": 100.45385,
            "elevation": 100,
            "attitude_head": 179.7,
            "attitude_pitch": -4.6,
            "attitude_roll": 0.8,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371519654,
            "update_time": 1698371519654
        },
        {
            "id": 20810,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371517327,
            "format_time": "2023-10-27T09:51:57.327",
            "longitude": 115.847515,
            "latitude": 39.042962,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 179.6,
            "attitude_pitch": -3.6,
            "attitude_roll": 1.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371521654,
            "update_time": 1698371521654
        },
        {
            "id": 20811,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371519326,
            "format_time": "2023-10-27T09:51:59.326",
            "longitude": 115.847516,
            "latitude": 39.042863,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 179.6,
            "attitude_pitch": -3.6,
            "attitude_roll": 2.2,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371523629,
            "update_time": 1698371523629
        },
        {
            "id": 20812,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371521326,
            "format_time": "2023-10-27T09:52:01.326",
            "longitude": 115.847516,
            "latitude": 39.042783,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": 179.6,
            "attitude_pitch": -3.9,
            "attitude_roll": 2.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -173.8,
            "payload_index": "66-0-0",
            "create_time": 1698371525652,
            "update_time": 1698371525652
        },
        {
            "id": 20813,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371523329,
            "format_time": "2023-10-27T09:52:03.329",
            "longitude": 115.847517,
            "latitude": 39.042709,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 179.7,
            "attitude_pitch": 7.3,
            "attitude_roll": 3.1,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -173.9,
            "payload_index": "66-0-0",
            "create_time": 1698371527677,
            "update_time": 1698371527678
        },
        {
            "id": 20814,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371525327,
            "format_time": "2023-10-27T09:52:05.327",
            "longitude": 115.847516,
            "latitude": 39.04269,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 179.6,
            "attitude_pitch": 0.8,
            "attitude_roll": 1.4,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -174,
            "payload_index": "66-0-0",
            "create_time": 1698371529651,
            "update_time": 1698371529651
        },
        {
            "id": 20815,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371527328,
            "format_time": "2023-10-27T09:52:07.328",
            "longitude": 115.847516,
            "latitude": 39.042687,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 144.5,
            "attitude_pitch": -1.1,
            "attitude_roll": -1.4,
            "mode_code": 5,
            "gimbal_roll": 0.5,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 159.8,
            "payload_index": "66-0-0",
            "create_time": 1698371531649,
            "update_time": 1698371531649
        },
        {
            "id": 20816,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371529329,
            "format_time": "2023-10-27T09:52:09.329",
            "longitude": 115.847557,
            "latitude": 39.042686,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": 90.1,
            "attitude_pitch": -18.5,
            "attitude_roll": 0,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 96.8,
            "payload_index": "66-0-0",
            "create_time": 1698371533663,
            "update_time": 1698371533663
        },
        {
            "id": 20817,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371531329,
            "format_time": "2023-10-27T09:52:11.329",
            "longitude": 115.847635,
            "latitude": 39.042686,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 90.1,
            "attitude_pitch": 10.9,
            "attitude_roll": 0.3,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 96.4,
            "payload_index": "66-0-0",
            "create_time": 1698371535665,
            "update_time": 1698371535665
        },
        {
            "id": 20818,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371533327,
            "format_time": "2023-10-27T09:52:13.327",
            "longitude": 115.847644,
            "latitude": 39.042686,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 90,
            "attitude_pitch": 2.6,
            "attitude_roll": -0.5,
            "mode_code": 5,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 96.4,
            "payload_index": "66-0-0",
            "create_time": 1698371537684,
            "update_time": 1698371537684
        },
        {
            "id": 20819,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371535329,
            "format_time": "2023-10-27T09:52:15.329",
            "longitude": 115.847646,
            "latitude": 39.042687,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 90,
            "attitude_pitch": 2.8,
            "attitude_roll": 0.5,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": 96.6,
            "payload_index": "66-0-0",
            "create_time": 1698371539663,
            "update_time": 1698371539663
        },
        {
            "id": 20820,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371537326,
            "format_time": "2023-10-27T09:52:17.326",
            "longitude": 115.847646,
            "latitude": 39.042686,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 45,
            "attitude_pitch": -6.7,
            "attitude_roll": -2.5,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 50.2,
            "payload_index": "66-0-0",
            "create_time": 1698371541659,
            "update_time": 1698371541659
        },
        {
            "id": 20821,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371539331,
            "format_time": "2023-10-27T09:52:19.331",
            "longitude": 115.847679,
            "latitude": 39.042719,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": 39.3,
            "attitude_pitch": -5.2,
            "attitude_roll": -1.4,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 46,
            "payload_index": "66-0-0",
            "create_time": 1698371543663,
            "update_time": 1698371543663
        },
        {
            "id": 20822,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371541329,
            "format_time": "2023-10-27T09:52:21.329",
            "longitude": 115.847724,
            "latitude": 39.042763,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": 38.7,
            "attitude_pitch": 2.8,
            "attitude_roll": -1.9,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 45.6,
            "payload_index": "66-0-0",
            "create_time": 1698371545657,
            "update_time": 1698371545657
        },
        {
            "id": 20823,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371543328,
            "format_time": "2023-10-27T09:52:23.328",
            "longitude": 115.847751,
            "latitude": 39.042789,
            "height": 100.353842,
            "elevation": 99.9,
            "attitude_head": 38.5,
            "attitude_pitch": 9.4,
            "attitude_roll": -1,
            "mode_code": 9,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": 45.5,
            "payload_index": "66-0-0",
            "create_time": 1698371547658,
            "update_time": 1698371547658
        },
        {
            "id": 20824,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371545327,
            "format_time": "2023-10-27T09:52:25.327",
            "longitude": 115.847751,
            "latitude": 39.042789,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": -8.7,
            "attitude_pitch": 0.5,
            "attitude_roll": -1.7,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -5.2,
            "payload_index": "66-0-0",
            "create_time": 1698371549649,
            "update_time": 1698371549649
        },
        {
            "id": 20825,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371547329,
            "format_time": "2023-10-27T09:52:27.329",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 100.35385,
            "elevation": 99.9,
            "attitude_head": -28.3,
            "attitude_pitch": -0.7,
            "attitude_roll": -1.7,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -22.3,
            "payload_index": "66-0-0",
            "create_time": 1698371551662,
            "update_time": 1698371551662
        },
        {
            "id": 20826,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371549327,
            "format_time": "2023-10-27T09:52:29.327",
            "longitude": 115.847751,
            "latitude": 39.042789,
            "height": 94.55385,
            "elevation": 94.1,
            "attitude_head": -29.9,
            "attitude_pitch": 0,
            "attitude_roll": -0.9,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -23.2,
            "payload_index": "66-0-0",
            "create_time": 1698371553659,
            "update_time": 1698371553659
        },
        {
            "id": 20827,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371551326,
            "format_time": "2023-10-27T09:52:31.326",
            "longitude": 115.847751,
            "latitude": 39.042789,
            "height": 82.753842,
            "elevation": 82.3,
            "attitude_head": -30,
            "attitude_pitch": 1.9,
            "attitude_roll": 2.3,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -23.2,
            "payload_index": "66-0-0",
            "create_time": 1698371555650,
            "update_time": 1698371555651
        },
        {
            "id": 20828,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371553329,
            "format_time": "2023-10-27T09:52:33.329",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 70.753842,
            "elevation": 70.3,
            "attitude_head": -29.8,
            "attitude_pitch": -1.2,
            "attitude_roll": -1.9,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -23.2,
            "payload_index": "66-0-0",
            "create_time": 1698371557653,
            "update_time": 1698371557653
        },
        {
            "id": 20829,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371555328,
            "format_time": "2023-10-27T09:52:35.328",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 58.753846,
            "elevation": 58.3,
            "attitude_head": -29.5,
            "attitude_pitch": 0.4,
            "attitude_roll": 1.4,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -23.5,
            "payload_index": "66-0-0",
            "create_time": 1698371559658,
            "update_time": 1698371559658
        },
        {
            "id": 20830,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371557328,
            "format_time": "2023-10-27T09:52:37.328",
            "longitude": 115.847753,
            "latitude": 39.04279,
            "height": 46.753846,
            "elevation": 46.3,
            "attitude_head": -30,
            "attitude_pitch": 1.1,
            "attitude_roll": -1.4,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -23.5,
            "payload_index": "66-0-0",
            "create_time": 1698371562301,
            "update_time": 1698371562301
        },
        {
            "id": 20831,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371559330,
            "format_time": "2023-10-27T09:52:39.33",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 36.353846,
            "elevation": 35.9,
            "attitude_head": -31,
            "attitude_pitch": 0.1,
            "attitude_roll": 10.4,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371564024,
            "update_time": 1698371564024
        },
        {
            "id": 20832,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371561328,
            "format_time": "2023-10-27T09:52:41.328",
            "longitude": 115.847754,
            "latitude": 39.04279,
            "height": 27.853844,
            "elevation": 27.4,
            "attitude_head": -30.5,
            "attitude_pitch": 1.3,
            "attitude_roll": -3.9,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371565659,
            "update_time": 1698371565660
        },
        {
            "id": 20833,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371563327,
            "format_time": "2023-10-27T09:52:43.327",
            "longitude": 115.847754,
            "latitude": 39.042789,
            "height": 20.853844,
            "elevation": 20.4,
            "attitude_head": -30.9,
            "attitude_pitch": 0.5,
            "attitude_roll": -4.7,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371567651,
            "update_time": 1698371567651
        },
        {
            "id": 20834,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371565327,
            "format_time": "2023-10-27T09:52:45.327",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 15.353844,
            "elevation": 14.9,
            "attitude_head": -31.3,
            "attitude_pitch": -1,
            "attitude_roll": -0.5,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371569662,
            "update_time": 1698371569662
        },
        {
            "id": 20835,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371567332,
            "format_time": "2023-10-27T09:52:47.332",
            "longitude": 115.847751,
            "latitude": 39.042789,
            "height": 11.253844,
            "elevation": 10.8,
            "attitude_head": -31.3,
            "attitude_pitch": -0.5,
            "attitude_roll": -6.5,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371571658,
            "update_time": 1698371571658
        },
        {
            "id": 20836,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371569329,
            "format_time": "2023-10-27T09:52:49.329",
            "longitude": 115.847753,
            "latitude": 39.042789,
            "height": 8.253844,
            "elevation": 7.8,
            "attitude_head": -30.5,
            "attitude_pitch": 0.1,
            "attitude_roll": -1.7,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -40,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371573650,
            "update_time": 1698371573650
        },
        {
            "id": 20837,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371571341,
            "format_time": "2023-10-27T09:52:51.341",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 5.853846,
            "elevation": 5.4,
            "attitude_head": -30.9,
            "attitude_pitch": 0,
            "attitude_roll": -1.3,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371575662,
            "update_time": 1698371575662
        },
        {
            "id": 20838,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371573328,
            "format_time": "2023-10-27T09:52:53.328",
            "longitude": 115.847751,
            "latitude": 39.042789,
            "height": 4.253846,
            "elevation": 3.8,
            "attitude_head": -30.8,
            "attitude_pitch": 0.7,
            "attitude_roll": 4,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371577649,
            "update_time": 1698371577649
        },
        {
            "id": 20839,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371575327,
            "format_time": "2023-10-27T09:52:55.327",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 2.753845,
            "elevation": 2.3,
            "attitude_head": -30.8,
            "attitude_pitch": 1.5,
            "attitude_roll": 2.2,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": -39.9,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371579630,
            "update_time": 1698371579630
        },
        {
            "id": 20840,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371577329,
            "format_time": "2023-10-27T09:52:57.329",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 2.353845,
            "elevation": 1.9,
            "attitude_head": -30.8,
            "attitude_pitch": 0.6,
            "attitude_roll": 1.6,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371581653,
            "update_time": 1698371581653
        },
        {
            "id": 20841,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371579326,
            "format_time": "2023-10-27T09:52:59.326",
            "longitude": 115.847752,
            "latitude": 39.04279,
            "height": 1.953845,
            "elevation": 1.5,
            "attitude_head": -30.7,
            "attitude_pitch": 1.2,
            "attitude_roll": 0.8,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371583687,
            "update_time": 1698371583687
        },
        {
            "id": 20842,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371581330,
            "format_time": "2023-10-27T09:53:01.33",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 1.653846,
            "elevation": 1.2,
            "attitude_head": -30.8,
            "attitude_pitch": 0.6,
            "attitude_roll": 1.3,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371585661,
            "update_time": 1698371585662
        },
        {
            "id": 20843,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371583328,
            "format_time": "2023-10-27T09:53:03.328",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 1.253845,
            "elevation": 0.8,
            "attitude_head": -30.8,
            "attitude_pitch": 0.2,
            "attitude_roll": 1.5,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371587650,
            "update_time": 1698371587650
        },
        {
            "id": 20844,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371585334,
            "format_time": "2023-10-27T09:53:05.334",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 0.853847,
            "elevation": 0.4,
            "attitude_head": -30.9,
            "attitude_pitch": 0.3,
            "attitude_roll": 1.5,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371589653,
            "update_time": 1698371589654
        },
        {
            "id": 20845,
            "device_sn": "1581F5FHD233E00DZ0XR",
            "flight_time": 1698371587329,
            "format_time": "2023-10-27T09:53:07.329",
            "longitude": 115.847752,
            "latitude": 39.042789,
            "height": 0.453845,
            "elevation": 0,
            "attitude_head": -30.7,
            "attitude_pitch": 0.6,
            "attitude_roll": 0.6,
            "mode_code": 10,
            "gimbal_roll": 0,
            "gimbal_pitch": 0,
            "gimbal_yaw": -24.2,
            "payload_index": "66-0-0",
            "create_time": 1698371591662,
            "update_time": 1698371591662
        }
    ];

    let roamIndex = 0;
    let interval = setInterval(() => {
        let gisCamItem = gisCamList[roamIndex];
        gisCamItem.lon = gisCamItem.longitude;
        gisCamItem.lat = gisCamItem.latitude;
        gisCamItem.roll = 0;
        gisCamItem.pitch = gisCamItem.gimbal_pitch + 90;
        if (gisCamItem.attitude_head <= 180) {
            gisCamItem.heading = gisCamItem.attitude_head * -1.0;
        } else {
            gisCamItem.heading = gisCamItem.attitude_head + 180.0;
        }
        let bimCam = BlackHole3D.Camera.getCamLocByGISCoord(BIMCRS, GISCRS, gisCamItem);
        BlackHole3D.Camera.setCamLocateTo(bimCam, 0, 2.0);
        roamIndex++;
        if (roamIndex > gisCamList.length) {
            clearInterval(interval)
        }
    }, 500);
}
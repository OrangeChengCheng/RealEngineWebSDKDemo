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
    document.addEventListener("RESystemUIEvent", RESystemUIEvent);//鼠标点击图形界面系统按钮监听事件
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

function RESystemUIEvent(e) {
    console.log('-- 鼠标点击图形界面系统按钮监听事件 --', e.detail);

    if (e.detail.btnname == "Setting_Effect_UIClr_Style_Dark") {
        console.log('-- 点击了系统设置（暗色主题） --');
        if (e.detail.btnstate == 1) {
            BlackHole3D.Graphics.setBtnStatePicPath("btn_001", 0, "!(RealBIMAppFileCache)/webui/dark/settings_nor.png");
            BlackHole3D.Graphics.setSysPanelBtnClrStyle("btn_001", 1);
        }
    }
    if (e.detail.btnname == "Setting_Effect_UIClr_Style_Light") {
        console.log('-- 点击了系统设置（浅色主题） --');
        if (e.detail.btnstate == 1) {
            BlackHole3D.Graphics.setBtnStatePicPath("btn_001", 0, "!(RealBIMAppFileCache)/webui/light/settings_nor.png");
            BlackHole3D.Graphics.setSysPanelBtnClrStyle("btn_001", 0);
        }
    }

    if (e.detail.btnname == "btn_001") {
        if (e.detail.btnstate == 0) {
            BlackHole3D.Graphics.setBtnActiveState("btn_001", 1);
        } else {
            BlackHole3D.Graphics.setBtnActiveState("btn_001", 0);
        }
    }
}

// 加载模型
function loadModel() {
    var dataSetList = [
        {
            "dataSetId": "机房01",
            "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            "dataSetCRS": "", "dataSetCRSNorth": 0.0
        },
    ];
    BlackHole3D.Model.loadDataSet(dataSetList);
}



// 添加一个自定义按钮到系统UI 面板
function addBtnForPanlUI() {
    var btnInfo = new BlackHole3D.REUIBtnInfo();
    btnInfo.uiID = "btn_001";
    btnInfo.size = [48, 48];
    btnInfo.activeStateId = 0;
    btnInfo.visible = true;

    var statePar1 = new BlackHole3D.REUIBtnStateInfo();
    statePar1.text = "";
    statePar1.hintText = "自定义按钮";
    statePar1.texPath = "!(RealBIMAppFileCache)/webui/light/settings_nor.png";
    statePar1.clrStyle = "CS_BTN_WHITETEXT_NOBG";
    statePar1.sizeStyle = "SS_WND_HAVE_THIN_BORDER";

    var statePar2 = new BlackHole3D.REUIBtnStateInfo();
    statePar2.text = "";
    statePar2.hintText = "自定义按钮";
    statePar2.texPath = "!(RealBIMAppFileCache)/webui/light/settings_sel.png";
    statePar2.clrStyle = "CS_BTN_WHITETEXT_BLUEBG";
    statePar2.sizeStyle = "SS_WND_HAVE_THIN_BORDER";

    btnInfo.stateParList = [statePar1, statePar2];

    BlackHole3D.Graphics.createBtn(btnInfo);
    BlackHole3D.Graphics.addChildWidget("BuiltIn_Wnd_Panel", "btn_001");
}


//直接添加按钮到系统UI面板
function addPanelBtn() {
    var btnInfo = new BlackHole3D.REUIBtnInfo();
    btnInfo.uiID = "btn_001";

    var statePar1 = new BlackHole3D.REUIBtnStateInfo();
    statePar1.text = "";
    statePar1.hintText = "自定义按钮";
    statePar1.texPath = "!(RealBIMAppFileCache)/webui/light/settings_nor.png";

    var statePar2 = new BlackHole3D.REUIBtnStateInfo();
    statePar2.text = "";
    statePar2.hintText = "自定义按钮2";
    statePar2.texPath = "!(RealBIMAppFileCache)/webui/light/settings_sel.png";

    btnInfo.stateParList = [statePar1, statePar2];
    BlackHole3D.Graphics.createSysPanelBtn(btnInfo);
}



//直接添加图片到系统UI面板
function addPanelImg() {
    var uiID = "img_001";
    var picPath = "!(RealBIMAppFileCache)/webui/light/settings_nor.png";

    BlackHole3D.Graphics.createSysPanelImage(uiID, picPath);
}








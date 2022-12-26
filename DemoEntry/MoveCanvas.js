// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D01 = typeof BlackHole3D01 !== "undefined" ? BlackHole3D01 : {};
BlackHole3D01["canvas"] = (function () {
    var canvas01 = document.getElementById('canvas01');
    return canvas01;
})();

BlackHole3D02 = typeof BlackHole3D02 !== "undefined" ? BlackHole3D02 : {};
BlackHole3D02["canvas"] = (function () {
    var canvas02 = document.getElementById('canvas02');
    return canvas02;
})();

//图形窗口改变时，需实时传递给引擎，否则模型会变形
window.onresize = function (event) {
    BlackHole3D01["m_re_em_window_width"] = BlackHole3D01.canvas.clientWidth;
    BlackHole3D01["m_re_em_window_height"] = BlackHole3D01.canvas.clientHeight;

    BlackHole3D02["m_re_em_window_width"] = BlackHole3D02.canvas.clientWidth;
    BlackHole3D02["m_re_em_window_height"] = BlackHole3D02.canvas.clientHeight;
}
// 刷新页面时需要卸载GPU内存
window.onbeforeunload = function (event) {
    if (typeof BlackHole3D01.REreleaseEngine != 'undefined') {
        BlackHole3D01.REreleaseEngine();
    }
    if (typeof BlackHole3D01.ctx != 'undefined') {
        if (BlackHole3D01.ctx.getExtension('WEBGL_lose_context') != null) {
            BlackHole3D01.ctx.getExtension('WEBGL_lose_context').loseContext();
        }
    }

    if (typeof BlackHole3D02.REreleaseEngine != 'undefined') {
        BlackHole3D02.REreleaseEngine();
    }
    if (typeof BlackHole3D02.ctx != 'undefined') {
        if (BlackHole3D02.ctx.getExtension('WEBGL_lose_context') != null) {
            BlackHole3D02.ctx.getExtension('WEBGL_lose_context').loseContext();
        }
    }
};

// 页面加载时添加相关监听事件
window.onload = function (event) {
    console.log("=========================== window.load()");
    if (typeof RE2SDKCreateModule != 'undefined') {
        console.log("======== RE2SDKCreateModule 存在");
        BlackHole3D01 = RE2SDKCreateModule(BlackHole3D01);
        BlackHole3D02 = RE2SDKCreateModule(BlackHole3D02);
    } else {
        console.log("======== RE2SDKCreateModule 不存在");
        document.addEventListener("RealEngineToBeReady", function () { BlackHole3D01 = RE2SDKCreateModule(BlackHole3D01); });
        document.addEventListener("RealEngineToBeReady", function () { BlackHole3D02 = RE2SDKCreateModule(BlackHole3D02); });
    }

    console.log("======== 添加监听事件");
    document.addEventListener("RealEngineReady", RealBIMInitSys);
    document.addEventListener("RealBIMInitSys", RealBIMLoadMainSce);
    document.addEventListener("RealBIMLoadMainSce", MainSceDown);
    document.addEventListener("RealEngineRenderReady", showCanvas);
    document.addEventListener("RealBIMLoadProgress", LoadingProgress);

    document.addEventListener("RealBIMLoadMinMapCAD", RealBIMLoadMinMapCAD);

    document.addEventListener("RealBIMLoadPanSce", PanSceDown);
    document.addEventListener("RealBIMLoadPan", SetMode);
    document.addEventListener("RealBIMSelShape", SelShape);
    document.addEventListener("RealBIMSelCADMinMapShpAnchor", RealBIMSelCADMinMapShpAnchor);


    if ((typeof BlackHole3D01["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D01["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D01.RealBIMWeb != 'undefined')) {
        console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
        RealBIMInitSys({detail: {canvasid: BlackHole3D01.canvas.id}});
    }

    if ((typeof BlackHole3D02["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D02["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D02.RealBIMWeb != 'undefined')) {
        console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
        RealBIMInitSys({detail: {canvasid: BlackHole3D02.canvas.id}});
    }
}



//场景初始化，需正确传递相关参数
function RealBIMInitSys(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D01.canvas.id) {
        console.log("=========================== 【01】  引擎底层初始化完成");
        progressFn(0.5, "RealEngine/WorkerJS Begin Init", BlackHole3D01.canvas.id);

        var workerjspath = "javascript/RealBIMWeb_Worker.js";
        var width = BlackHole3D01.canvas.clientWidth; var height = BlackHole3D01.canvas.clientHeight;
        var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
        var username = "admin"; var password = "xiyangyang";

        BlackHole3D01.REinitSys(workerjspath, width, height, commonurl, username, password);
        BlackHole3D01.REsetUseWebCache(false);//是否允许使用浏览器缓存
    }
    else if (canvasID == BlackHole3D02.canvas.id) {
        console.log("=========================== 【02】  引擎底层初始化完成");
        progressFn(0.5, "RealEngine/WorkerJS Begin Init", BlackHole3D02.canvas.id);

        var workerjspath = "javascript/RealBIMWeb_Worker.js";
        var width = BlackHole3D02.canvas.clientWidth; var height = BlackHole3D02.canvas.clientHeight;
        var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
        var username = "admin"; var password = "xiyangyang";

        BlackHole3D02.REinitSys(workerjspath, width, height, commonurl, username, password);
        BlackHole3D02.REsetUseWebCache(false);//是否允许使用浏览器缓存
    }
    
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D01.canvas.id) {
        console.log("=========================== 【01】  场景初始化完成");
        var isSuccess = e.detail.succeed;

        if (isSuccess) {
            console.log("=========================== 【01】   场景初始化 --> 成功！！！");
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
            BlackHole3D01.REloadMainSce_projs(projInfo);
            // 设置全局渲染性能控制参数
            BlackHole3D01.REsetMaxResMemMB(5500);
            BlackHole3D01.REsetExpectMaxInstMemMB(4500);
            BlackHole3D01.REsetExpectMaxInstDrawFaceNum(20000000);
            BlackHole3D01.REsetPageLoadLev(2);

        } else {
            console.log("=========================== 【01】   场景初始化 --> 失败！！！");
        }
    }
    else if (canvasID == BlackHole3D02.canvas.id) {
        console.log("=========================== 【02】  场景初始化完成");
        var isSuccess = e.detail.succeed;

        if (isSuccess) {
            console.log("=========================== 【02】   场景初始化 --> 成功！！！");
            //加载360全景
            var panProjInfo = [
                {
                    "projName": "pro360",
                    "urlRes": "https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=",
                    "projResName": "3a078ce7d766a927f0f4147af5ebe82e"
                }
            ];
            BlackHole3D02.REaddPanSceData(panProjInfo);
            // 设置全局渲染性能控制参数
            BlackHole3D02.REsetMaxResMemMB(5500);
            BlackHole3D02.REsetExpectMaxInstMemMB(4500);
            BlackHole3D02.REsetExpectMaxInstDrawFaceNum(20000000);
            BlackHole3D02.REsetPageLoadLev(2);

        } else {
            console.log("=========================== 【02】   场景初始化 --> 失败！！！");
        }
    }
    

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D01.canvas.id) {
        console.log("=========================== 【01】  引擎主场景模型加载完成");
        if (e.detail.succeed) {
            console.log("=========================== 【01】  引擎主场景模型加载 --> 成功！！！");
        } else {
            console.log("=========================== 【01】   引擎主场景模型加载 --> 部分模型加载失败！！！");
        }
    }
    else if (canvasID == BlackHole3D02.canvas.id) {
        console.log("=========================== 【02】 引擎主场景模型加载完成");
        if (e.detail.succeed) {
            console.log("=========================== 【02】  引擎主场景模型加载 --> 成功！！！");
        } else {
            console.log("=========================== 【02】   引擎主场景模型加载 --> 部分模型加载失败！！！");
        }
    }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D01.canvas.id) {
        console.log("=========================== 【01】  引擎渲染器初始化完成");
        document.getElementById('canvas01').style.display = "block";
        BlackHole3D01.canvas.focus(); //为了解决键盘事件的冲突
    }
    else if (canvasID == BlackHole3D02.canvas.id) {
        console.log("=========================== 【02】  引擎渲染器初始化完成");
        document.getElementById('canvas02').style.display = "block";
        BlackHole3D02.canvas.focus(); //为了解决键盘事件的冲突
    }
}

// 加载进度条
function LoadingProgress(e) {
    var percent = e.detail.progress; var info = e.detail.info; var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D01.canvas.id) {
        progressFn(percent, info, BlackHole3D01.canvas.id);
    }
    else if (canvasID == BlackHole3D02.canvas.id) {
        progressFn(percent, info, BlackHole3D02.canvas.id);
    }
    
}












//概略图中的CAD数据加载 回调监听
function RealBIMLoadMinMapCAD(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        if (e.detail.succeed == 1) {
            console.log('------【02】 概略图中的CAD数据 加载成功');
            BlackHole3D02.REsetMiniMapVisible(true);//设置概略图显示状态
            BlackHole3D02.REadjustCADMiniMapShowRange();//调整CAD小地图显示，缩放到当前小地图展示范围
            var pandata = BlackHole3D02.REgetPanSceElemInfos("pro360");
            addOverViewShpAnchor(pandata);
        }
    }
}

//添加锚点
function addOverViewShpAnchor(pandata) {
    var _anchorList = [];
    for (let i = 0; i < pandata.length; i++) {
        let anchorObj = {};
        anchorObj.re_AnchorID = pandata[i].m_strId;
        anchorObj.re_Postion = [pandata[i].m_vPos[0], pandata[i].m_vPos[1]];
        anchorObj.re_ShpPath = "https://yingshi.blob.core.chinacloudapi.cn/insite-blob/common/icon/a2698bbc07482b806df7c9c5e7d952fa.svg";
        anchorObj.re_Text = "666";
        anchorObj.re_TextColor = "0xF56C6CFF";
        anchorObj.re_TextSize = 20;
        anchorObj.re_TextAlign = "Grid_MM";
        if (i < 10) {
            anchorObj.re_GroupID = 'GroupID_' + 001;
        } else if (i >= 10 && i < 20) {
            anchorObj.re_GroupID = 'GroupID_' + 002;
        } else {
            anchorObj.re_GroupID = 'GroupID_' + 003;
        }
        _anchorList.push(anchorObj);
    }
    console.log('-----------');
    console.log(_anchorList);
    console.log('-----------');
    BlackHole3D02.REaddMiniMapShpAnchorForCAD(_anchorList);
}




//全景场景加载完成，此时可获取全部点位信息
function PanSceDown(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        if (e.detail.succeed) {
            console.log("---------- 【02】 360全景加载成功!");
            // 获取全部帧信息
            var pandata = BlackHole3D02.REgetPanSceElemInfos("pro360");
            console.log(pandata);
            // 设置360显示信息
            BlackHole3D02.REloadPan(pandata[0].m_strId, 0);
            console.log(pandata[0].m_strId);

            // 设置窗口模式
            BlackHole3D02.REsetViewMode("360", "", 0);
        } else {
            console.log("---------- 【02】 360全景加载失败!");
        }
    }
}



//全景场景图片设置成功
function SetMode(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        if (e.detail.succeed) {
            console.log("---------- 【02】 360全景图片设置成功!");
            setOverViewSize();
            //加载概略图CAD数据
            addCADData();
        } else {
            console.log("---------- 【02】 360全景图片设置失败!");
        }
    }
}


 
//设置概略图尺寸
function setOverViewSize() {
    BlackHole3D02.REsetMiniMapMaxRegion([400, 400]);//设置概略图最大的宽高
    var re_ScaleOrigin = [0, 0];//原点相对于主界面宽高的比例 [0,0]  取值范围0-1
    var re_ScaleDiagonal = [0.5, 0.4];//对角点相对于主界面宽高的比例 [0.3,0.3]  取值范围0-1
    BlackHole3D02.REsetMiniMapRegion(re_ScaleOrigin, re_ScaleDiagonal);//设置概略图占据主界面宽高比例
}


//加载概略图CAD数据
function addCADData() {
    BlackHole3D02.REloadMiniMapForCAD("https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078cdabb2e98a3b98e1960acfa15c6/1/638041974736297275.dwg", "RE_CAD_UNIT.Millimeter", 1.0);
}





function SelShape(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        console.log("----------【02】 点击了图形")
        var data = BlackHole3D02.REgetCurPanShpProbeRet();
        console.log(data)
        var texpos = BlackHole3D02.REgetPicPosBySelPos(data.m_vSelPos, data.m_strSelShpObjName);
        console.log(texpos)
    }
}




//概略图中的CAD锚点点击回调
function RealBIMSelCADMinMapShpAnchor(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        BlackHole3D02.REloadPan(e.detail.elemid, 0);
    }
}
  
  
  

  
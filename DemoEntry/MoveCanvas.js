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
    if (typeof BlackHole3D01.releaseEngine != 'undefined') {
        BlackHole3D01.releaseEngine();
    }

    if (typeof BlackHole3D02.releaseEngine != 'undefined') {
        BlackHole3D02.releaseEngine();
    }
};

// 页面加载时添加相关监听事件
window.onload = function (event) {
    console.log("=========================== window.load()");
    if (typeof CreateBlackHoleWebSDK != 'undefined') {
        console.log("======== CreateBlackHoleWebSDK 存在");
        BlackHole3D01 = CreateBlackHoleWebSDK(BlackHole3D01);
        BlackHole3D02 = CreateBlackHoleWebSDK(BlackHole3D02);
    } else {
        console.log("======== CreateBlackHoleWebSDK 不存在");
        document.addEventListener("RealEngineToBeReady", function () { BlackHole3D01 = CreateBlackHoleWebSDK(BlackHole3D01); });
        document.addEventListener("RealEngineToBeReady", function () { BlackHole3D02 = CreateBlackHoleWebSDK(BlackHole3D02); });
    }

    addREListener();
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
    document.addEventListener("RESystemSelShpElement", RESystemSelShpElement);//鼠标探测矢量元素事件
    document.addEventListener("REMiniMapCADSelShpAnchor", REMiniMapCADSelShpAnchor);//小地图中的CAD锚点点击事件

    //加载
    document.addEventListener("REDataSetLoadPanFinish", REDataSetLoadPanFinish);//全景场景加载完成事件
    document.addEventListener("REPanLoadSingleFinish", REPanLoadSingleFinish);//全景场景中某一帧全景图设置成功的事件
    document.addEventListener("REMiniMapLoadCAD", REMiniMapLoadCAD);//小地图中的CAD数据加载完成事件

}



//场景初始化，需正确传递相关参数
function RESystemReady(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D01.canvas.id) {
        console.log("=========================== 【01】  引擎底层初始化完成");
        progressFn(0.5, "RealEngine/WorkerJS Begin Init", BlackHole3D01.canvas.id);

        var sysInfo1 = new BlackHole3D01.RESysInfo();
        sysInfo1.workerjsPath = "javascript/RealBIMWeb_Worker.js";
        sysInfo1.renderWidth = BlackHole3D01.canvas.clientWidth;
        sysInfo1.renderHieght = BlackHole3D01.canvas.clientHeight;
        sysInfo1.commonUrl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
        sysInfo1.userName = "admin";
        sysInfo1.passWord = "xiyangyang";
        sysInfo1.mainWndName = "BlackHole3D1";
        BlackHole3D01.initEngineSys(sysInfo1);
        BlackHole3D01.Common.setUseWebCache(false);//是否允许使用浏览器缓存
    }
    else if (canvasID == BlackHole3D02.canvas.id) {
        console.log("=========================== 【02】  引擎底层初始化完成");
        progressFn(0.5, "RealEngine/WorkerJS Begin Init", BlackHole3D02.canvas.id);

        var sysInfo2 = new BlackHole3D02.RESysInfo();
        sysInfo2.workerjsPath = "javascript/RealBIMWeb_Worker.js";
        sysInfo2.renderWidth = BlackHole3D02.canvas.clientWidth;
        sysInfo2.renderHieght = BlackHole3D02.canvas.clientHeight;
        sysInfo2.commonUrl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
        sysInfo2.userName = "admin";
        sysInfo2.passWord = "xiyangyang";
        sysInfo2.mainWndName = "BlackHole3D2";
        BlackHole3D02.initEngineSys(sysInfo2);
        BlackHole3D02.Common.setUseWebCache(false);//是否允许使用浏览器缓存
    }

}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RESystemEngineCreated(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D01.canvas.id) {
        console.log("=========================== 【01】  场景初始化完成");
        var isSuccess = e.detail.succeed;

        if (isSuccess) {
            console.log("=========================== 【01】   场景初始化 --> 成功！！！");
            var dataSetList = [
                {
                    "dataSetId": "机房01",
                    "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
                    "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
                    "dataSetCRS": "", "dataSetCRSNorth": 0.0
                },
            ];
            BlackHole3D01.Model.loadDataSet(dataSetList);
            // 设置全局渲染性能控制参数
            BlackHole3D01.Common.setMaxResMemMB(5500);
            BlackHole3D01.Common.setExpectMaxInstMemMB(4500);
            BlackHole3D01.Common.setExpectMaxInstDrawFaceNum(20000000);
            BlackHole3D01.Common.setPageLoadLev(2);

        } else {
            console.log("=========================== 【01】   场景初始化 --> 失败！！！");
        }
    }
    else if (canvasID == BlackHole3D02.canvas.id) {
        console.log("=========================== 【02】  场景初始化完成");
        var isSuccess = e.detail.succeed;

        if (isSuccess) {
            console.log("=========================== 【02】   场景初始化 --> 成功！！！");
            var dataSetList = [
                {
                    "dataSetId": "pan01",
                    "resourcesAddress": "https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078ce7d766a927f0f4147af5ebe82e",
                }
            ];
            BlackHole3D02.Panorama.loadPan(dataSetList);
            // 设置全局渲染性能控制参数
            BlackHole3D02.Common.setMaxResMemMB(5500);
            BlackHole3D02.Common.setExpectMaxInstMemMB(4500);
            BlackHole3D02.Common.setExpectMaxInstDrawFaceNum(20000000);
            BlackHole3D02.Common.setPageLoadLev(2);

        } else {
            console.log("=========================== 【02】   场景初始化 --> 失败！！！");
        }
    }


}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function REDataSetLoadFinish(e) {
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
function RESystemRenderReady(e) {
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
function REDataSetLoadProgress(e) {
    var percent = e.detail.progress; var info = e.detail.info; var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D01.canvas.id) {
        progressFn(percent, info, BlackHole3D01.canvas.id);
    }
    else if (canvasID == BlackHole3D02.canvas.id) {
        progressFn(percent, info, BlackHole3D02.canvas.id);
    }

}












//概略图中的CAD数据加载 回调监听
function REMiniMapLoadCAD(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        if (e.detail.succeed == 1) {
            console.log('------【02】 概略图中的CAD数据 加载成功');
            BlackHole3D02.MiniMap.setVisible(true);//设置概略图显示状态
            BlackHole3D02.MiniMap.setShowRangeRefresh();//调整CAD小地图显示，缩放到当前小地图展示范围
            addMiniMapShpAnc();
        }
    }
}


function addMiniMapShpAnc() {
    var panInfoList = BlackHole3D02.Panorama.getElemInfo("pan01");
    var _anchorList = [];
    for (let i = 0; i < panInfoList.length; i++) {
        let panElem = panInfoList[i];
        let shpAnc = new BlackHole3D02.RECADShpAnc();
        shpAnc.anchorId = panElem.elemId;
        shpAnc.pos = [panElem.pos[0], panElem.pos[1]];
        shpAnc.shpPath = "https://yingshi.blob.core.chinacloudapi.cn/insite-blob/common/icon/a2698bbc07482b806df7c9c5e7d952fa.svg";
        shpAnc.text = "666";
        shpAnc.textClr = new BlackHole3D02.REColor(255, 0, 0, 204);
        shpAnc.textSize = 20.0;
        shpAnc.textAlign = BlackHole3D02.REGridPosEm.MM;
        if (i < 10) {
            shpAnc.groupId = 'GroupID_' + 001;
        } else if (i >= 10 && i < 20) {
            shpAnc.groupId = 'GroupID_' + 002;
        } else {
            shpAnc.groupId = 'GroupID_' + 003;
        }
        _anchorList.push(shpAnc);
    }
    BlackHole3D02.MiniMap.addCADShpAnc(_anchorList);
}



//全景场景加载完成，此时可获取全部点位信息
function REDataSetLoadPanFinish(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        if (e.detail.succeed) {
            console.log("---------- 【02】 360全景加载成功!");
            // 获取全部帧信息
            var pandata = BlackHole3D02.Panorama.getElemInfo("pan01");
            // 设置360显示信息
            BlackHole3D02.Panorama.loadPanPic(pandata[0].elemId, 0);
            // 设置窗口模式
            BlackHole3D02.setViewMode(BlackHole3D02.REVpTypeEm.Panorama, BlackHole3D02.REVpTypeEm.None, BlackHole3D02.REVpRankEm.Single);
        } else {
            console.log("---------- 【02】 360全景加载失败!");
        }
    }
}



//全景场景图片设置成功
function REPanLoadSingleFinish(e) {
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
    BlackHole3D02.MiniMap.setMaxRegion([300, 300]);//设置概略图最大的宽高
    var scaleOrigin = [0, 0];//原点相对于主界面宽高的比例 [0,0]  取值范围0-1
    var scaleDiagonal = [0.5, 0.5];//对角点相对于主界面宽高的比例 [0.3,0.3]  取值范围0-1
    BlackHole3D02.MiniMap.setRegion(scaleOrigin, scaleDiagonal);//设置概略图占据主界面宽高比例
}


//加载概略图CAD数据
function addCADData() {
    BlackHole3D02.MiniMap.loadCAD("https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078cdabb2e98a3b98e1960acfa15c6/1/638041974736297275.dwg", BlackHole3D02.RECadUnitEm.CAD_UNIT_Millimeter, 1.0);
}





function RESystemSelShpElement(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        console.log("----------【02】 点击了图形")
        var data = BlackHole3D02.Probe.getCurShpProbeRet();
        console.log(data)
        var texpos = BlackHole3D02.Panorama.getTexPos(data.elemPos, data.elemId);
        console.log(texpos)
    }
}




//概略图中的CAD锚点点击回调
function REMiniMapCADSelShpAnchor(e) {
    var canvasID = e.detail.canvasid;
    if (canvasID == BlackHole3D02.canvas.id) {
        BlackHole3D02.Panorama.loadPanPic(e.detail.elemid, 0);
    }
}





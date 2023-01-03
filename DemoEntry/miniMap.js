

// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D = typeof BlackHole3D !== "undefined" ? BlackHole3D : {};
BlackHole3D["canvas"] = (function () {
  var canvas = document.getElementById('canvas');
  return canvas;
})();

//图形窗口改变时，需实时传递给引擎，否则模型会变形
window.onresize = function (event) {
  BlackHole3D["m_re_em_window_width"] = window.innerWidth;
  BlackHole3D["m_re_em_window_height"] = window.innerHeight;
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
  if (typeof RE2SDKCreateModule != 'undefined') {
    console.log("======== RE2SDKCreateModule 存在");
    BlackHole3D = RE2SDKCreateModule(BlackHole3D);
  } else {
    console.log("======== RE2SDKCreateModule 不存在");
    document.addEventListener("RealEngineToBeReady", function () { BlackHole3D = RE2SDKCreateModule(BlackHole3D); });
  }

  console.log("======== 添加监听事件  ");
  document.addEventListener("RealEngineReady", RealBIMInitSys);
  document.addEventListener("RealBIMInitSys", RealBIMLoadMainSce);
  document.addEventListener("RealBIMLoadMainSce", MainSceDown);
  document.addEventListener("RealEngineRenderReady", showCanvas);
  document.addEventListener("RealBIMLoadProgress", LoadingProgress, true);

  document.addEventListener("RealBIMLoadMinMapCAD", RealBIMLoadMinMapCAD);

  document.addEventListener("RealBIMLoadPanSce", function (e) { PanSceDown(e.detail.succeed) });
  document.addEventListener("RealBIMLoadPan", function (e) { setMode(e.detail.succeed) });
  document.addEventListener("RealBIMSelShape", testpansel);

  document.addEventListener("RealBIMLoadCAD", function (e) { console.log(e.detail.succeed); });
  document.addEventListener("RealBIMSelCAD", function (e) { console.log(e.detail); });
  // document.addEventListener("RealBIMSelCADAnchor", RealBIMSelCADAnchor);
  document.addEventListener("RealBIMSelCADMinMapShpAnchor", RealBIMSelCADMinMapShpAnchor);


  if ((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')) {
    console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
    RealBIMInitSys();
  }
}



//场景初始化，需正确传递相关参数
function RealBIMInitSys() {
  console.log("=========================== 引擎底层初始化完成 ");
  progressFn(0.5, "RealEngine/WorkerJS Begin Init");

  var workerjspath = "javascript/RealBIMWeb_Worker.js";
  var width = window.innerWidth; var height = window.innerHeight;
  var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
  var username = "admin"; var password = "xiyangyang";

  BlackHole3D.REinitSys(workerjspath, width, height, commonurl, username, password);
  BlackHole3D.REsetUseWebCache(false);//是否允许使用浏览器缓存
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce(e) {
  console.log("=========================== 场景初始化完成 ");
  var isSuccess = e.detail.succeed;

  if (isSuccess) {
    console.log("===========================  场景初始化 --> 成功！！！");
    //加载Bim模型
    var projInfo = [
      {
        "projName": "3a076d73713f7d48d9f7f79dc4126573",
        "urlRes": "https://engine3.bjblackhole.com/engineweb/api/autoconvert/engineres/requestengineres?dir=url_res14&path=",
        "projResName": "3a076d73713f7d48d9f7f79dc4126573",
        "useNewVer": true,
        "verInfo": 0,
        "useTransInfo": false,
        "transInfo": ""
      }
    ];
    BlackHole3D.REloadMainSce_projs(projInfo);

    // //加载360全景
    // var panProjInfo = [
    //   {
    //     "projName": "pro360",
    //     "urlRes": "https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=",
    //     "projResName": "3a078ce7d766a927f0f4147af5ebe82e"
    //   }
    // ];
    // BlackHole3D.REaddPanSceData(panProjInfo);

    // 设置全局渲染性能控制参数
    BlackHole3D.REsetMaxResMemMB(5500);
    BlackHole3D.REsetExpectMaxInstMemMB(4500);
    BlackHole3D.REsetExpectMaxInstDrawFaceNum(20000000);
    BlackHole3D.REsetPageLoadLev(2);
  } else {
    console.log("===========================  场景初始化 --> 失败！！！  ================================");
  }

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(e) {
  console.log("=========================== 引擎主场景模型加载完成 ================================");
  if (e.detail.succeed) {
    console.log("=========================== 引擎主场景模型加载 --> 成功！！！ ================================");

    // loadBIMMiniMapForCAD();

    loadBIMMiniMapForImage();

  } else {
    console.log("===========================  引擎主场景模型加载 --> 部分模型加载失败！！！");
  }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas() {
  console.log("=========================== 引擎渲染器初始化完成");
  document.getElementById('canvas').style.display = "block";
  BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function LoadingProgress(e) {
  var percent = e.detail.progress; var info = e.detail.info;
  progressFn(percent, info);
}


//全景场景加载完成，此时可获取全部点位信息
function PanSceDown(isSuccess) {
  if (isSuccess) {
    console.log("360全景加载成功!！！！！！！！！！！！！！！！！！！！！！！！");
    // 获取全部帧信息
    var pandata = BlackHole3D.REgetPanSceElemInfos("pro360");
    console.log(pandata);
    // 设置360显示信息
    BlackHole3D.REloadPan(pandata[0].m_strId, 0);
    console.log(pandata[0].m_strId);
    
    // 设置窗口模式
    BlackHole3D.REsetViewMode("360","",0);
  } else {
    console.log("360全景加载失败！！！！！！！！！！！！！！！！！！！！！！！");
  }
}
//全景场景图片设置成功
function setMode(isSuccess) {
  if (isSuccess) {
    console.log("图片设置成功!！！！！！！！！！！！！！！！！！！！！！！！");
    
    load360MiniMapForCAD();

  } else {
    console.log("图片设置失败！！！！！！！！！！！！！！！！！！！！！！！");
  }
}




//加载BIM-miniMap
function loadBIMMiniMapForCAD() {
  setOverViewSize();
  BlackHole3D.REloadMiniMapForCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_cad/103-Floor Plan - 三层建筑平面图.dwg", "RE_CAD_UNIT.Millimeter", 1.0);
//   BlackHole3D.REloadMiniMapForCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_temp/dwg/BF00-AR01-01(1).dwg","RE_CAD_UNIT.Millimeter", 1.0);
}

//加载BIM-MiniMap-Image
function loadBIMMiniMapForImage() {
    setOverViewSize();
    var re_TexPath = "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_temp/pics/a04.png";
    var re_PicSize = [60,40];
    var re_TexSize = [860,500];
    var re_InsertPos = [0,0];
    var re_Alpha = 255;
    BlackHole3D.REloadMiniMapForImage(re_TexPath,re_PicSize,re_TexSize,re_InsertPos,re_Alpha);
    BlackHole3D.REsetMiniMapVisible(true);//设置概略图显示状态
    BlackHole3D.REadjustCADMiniMapShowRange();//调整CAD小地图显示，缩放到当前小地图展示范围
}



//加载360-miniMap
function load360MiniMapForCAD() {
  setOverViewSize();
  BlackHole3D.REloadMiniMapForCAD("https://yingshi-bim-demo-api.bosch-smartlife.com:8088/api/autoconvert/EngineRes/RequestEngineRes?dir=url_res02&path=3a078cdabb2e98a3b98e1960acfa15c6/1/638041974736297275.dwg", "RE_CAD_UNIT.Millimeter", 1.0);
  
}





//设置概略图尺寸
function setOverViewSize() {
  BlackHole3D.REsetMiniMapMaxRegion([500, 500]);//设置概略图最大的宽高
  var re_ScaleOrigin = [0, 0];//原点相对于主界面宽高的比例 [0,0]  取值范围0-1
  var re_ScaleDiagonal = [0.5, 0.5];//对角点相对于主界面宽高的比例 [0.3,0.3]  取值范围0-1
  BlackHole3D.REsetMiniMapRegion(re_ScaleOrigin, re_ScaleDiagonal);//设置概略图占据主界面宽高比例
}


//概略图中的CAD数据加载 回调监听
function RealBIMLoadMinMapCAD(e) {
  if (e.detail.succeed == 1) {
    console.log('------ 概略图中的CAD数据 加载成功 ------');
    BlackHole3D.REsetMiniMapVisible(true);//设置概略图显示状态
    BlackHole3D.REadjustCADMiniMapShowRange();//调整CAD小地图显示，缩放到当前小地图展示范围

    // BIM-MiniMap
    setBIMMiniMapInfo();

    //360-MiniMap
    // set360MiniMapInfo();
  }
}


// BIM-MiniMap 设置顶点映射
function setBIMMiniMapInfo() {
  var re_BIMPoints = [
    [-260.9, 136.1, 0],
    [-241.5, 104.1, 0],
    [-186.5, 138.1, 0]
  ];//BIM顶点 至少大于三个点数据
  var re_CADPoints = [
    [-152231.4198, 252077.9952],
    [-152231.4198, 214377.9952],
    [-87531.4198, 214377.9952]
  ];//CAD顶点 至少大于三个点数据
  var re_CADUnit = "RE_CAD_UNIT.Millimeter";//CAD单位  枚举值
  BlackHole3D.REsetMiniMapCamTransformInfoByPots(re_BIMPoints, re_CADPoints, re_CADUnit);//设置概略图相机变换数据 (通过顶点映射)
}

// 360-MiniMap 设置锚点
function set360MiniMapInfo() {
  var pandata = BlackHole3D.REgetPanSceElemInfos("pro360");
  addOverViewShpAnchor(pandata);
}








//概略图中的CAD锚点点击回调
function RealBIMSelCADMinMapShpAnchor(e) {
  BlackHole3D.REloadPan(e.detail.elemid, 0);
}



//添加锚点
function addOverViewShpAnchor(pandata) {
  var _anchorList = [];
  for (let i = 0; i < pandata.length; i++) {
    let anchorObj = {};
    anchorObj.re_AnchorID = pandata[i].m_strId;
    anchorObj.re_Postion = [pandata[i].m_vPos[0],pandata[i].m_vPos[1]];
    anchorObj.re_ShpPath = "https://yingshi.blob.core.chinacloudapi.cn/insite-blob/common/icon/a2698bbc07482b806df7c9c5e7d952fa.svg";
    anchorObj.re_Text = "666";
    anchorObj.re_TextColor = "ff0000";
    anchorObj.re_TextAlpha = 204;
    anchorObj.re_TextSize = 20;
    anchorObj.re_TextAlign = "Grid_MM";
    if (i < 10) {
      anchorObj.re_GroupID = 'GroupID_' + 001;
    } else if (i >= 10 && i <20) {
      anchorObj.re_GroupID = 'GroupID_' + 002;
    } else {
      anchorObj.re_GroupID = 'GroupID_' + 003;
    }
    _anchorList.push(anchorObj);
  }
  console.log('-----------');
  console.log(_anchorList);
  console.log('-----------');
  BlackHole3D.REaddMiniMapShpAnchorForCAD(_anchorList);
}








//删除全景标签
function delPanAnchor() {
  BlackHole3D.REdelPanAnchor("pananc01", "dest360_1641521507");
}
function testpansel() {
  console.log("dianjileaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  var data = BlackHole3D.REgetCurPanShpProbeRet();
  console.log(data)
  var texpos = BlackHole3D.REgetPicPosBySelPos(data.m_vSelPos, data.m_strSelShpObjName);
  console.log(texpos)
}







//添加全景标签
function addPanAnchor() {

  var panancs = [
    {
      "strPanId": "dest360_1641521507",
      "strPanAncName": "pananc03",
      "arrPicPos": [3343, 1680],
      "bUsePicPos": true,
      "strPicPath": "https://yingshi.blob.core.chinacloudapi.cn/insite-blob/common/icon/a2698bbc07482b806df7c9c5e7d952fa.svg",
      "picSize": [32, 32],
      "textFocus": [0, 0],
      "strTextInfo": "全景锚点3",
      "strTextClr": [255, 0, 0],
      "textBias": [1, -1]
    }
  ]
  BlackHole3D.REaddPanAnchor(panancs);

  var panancs = [
    {
      "strPanId": "dest360_1641521507",
      "strPanAncName": "pananc04",
      "arrPos": [-212.320000, 162.685000, 512.211000],
      "bUsePicPos": false,
      "strPicPath": "https://yingshi.blob.core.chinacloudapi.cn/insite-blob/common/icon/a2698bbc07482b806df7c9c5e7d952fa.svg",
      "picSize": [32, 32],
      "textFocus": [0, 0],
      "strTextInfo": "全景锚点4",
      "strTextClr": [255, 0, 0],
      "textBias": [1, -1]
    }
  ]
  BlackHole3D.REaddPanAnchor(panancs);
}






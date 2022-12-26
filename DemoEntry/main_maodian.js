// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D =typeof BlackHole3D!=="undefined" ? BlackHole3D : {};
BlackHole3D["canvas"] =(function() {
    var canvas = document.getElementById('canvas');
    return canvas;
  })();

//页面加载时添加监听事件RealEngineReady，触发RealBIMInitSys初始化
window.addEventListener('load', function() {
  if(typeof RE2SDKCreateModule != 'undefined'){
    BlackHole3D =RE2SDKCreateModule(BlackHole3D);
  }else{
    document.addEventListener("RealEngineToBeReady", function(){BlackHole3D =RE2SDKCreateModule(BlackHole3D);});
  }

  // 页面实时反馈窗口宽高给引擎
  document.addEventListener("RealEngineReady", RealBIMInitSys);
  document.addEventListener("RealBIMInitSys", function(e){RealBIMLoadMainSce(e.detail.succeed)});
  document.addEventListener("RealBIMLoadMainSce", function(e){MainSceDown(e.detail.succeed)});
  document.addEventListener("RealBIMSelModel",getselmodelinfo);
  document.addEventListener("RealEngineRenderReady", showCanvas);

  document.addEventListener("RealBIMLoadProgress", function(e){LoadingProgress(e.detail.progress,e.detail.info);});
  if((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')){
    console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
    RealBIMInitSys();
  }
});

//场景初始化，需正确传递相关参数
function RealBIMInitSys(isSuccess){
  console.log("Listen RealEngineReady!！！！！！！！！！！！！！！！！！！！！！！！！");
  var workerjspath = "javascript/RealBIMWeb_Worker.js";
  var width = window.innerWidth; var height = window.innerHeight;
  // var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res360&path=res_gol001";
  var commonurl = "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_gol001";
  var username = "admin"; var password = "xiyangyang";
  BlackHole3D.REinitSys(workerjspath,width,height,commonurl,username,password);
}
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas(){
  console.log("addEventListener RealEngineRenderReady!！！！！！！！！！！！！！！！！！！！！！！！");
  document.getElementById('canvas').style.display="block";
  // BlackHole3D.canvas.focus();
}

//初始化完成后，开始加载场景，需正确传递相关参数
function RealBIMLoadMainSce(isSuccess){
  if(isSuccess){
    //加载rvt模型
    var projInfo = [
          {
            "projName":"pro01",
            "urlRes":"https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=",
            "projResName":"res_xiongan_02_rongdong",
            "useNewVer":true,
            "verInfo":0,
            "useTransInfo":false,
            "transInfo":""
          }
    ];

    BlackHole3D.REloadMainSce_projs(projInfo);
    //设置渲染参数
    BlackHole3D.REsetMaxResMemMB(5500);
    BlackHole3D.REsetExpectMaxInstMemMB(4500);
    BlackHole3D.REsetExpectMaxInstDrawFaceNum(50000000);
    BlackHole3D.REsetPageLoadLev(2);

  }else{
    console.log("场景初始化失败！！！！！！！！！！！！！！！！！！！！！！！！");
  }
}
//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(isSuccess){
  if(isSuccess){
    console.log("模型加载成功!！！！！！！！！！！！！！！！！！！！！！！！");
    // BlackHole3D.REsetEngineWorldCRS("EPSG:3857");
  }else{
    console.log("模型没有完全加载成功！！！！！！！！！！！！！！！！！！！！！！！");
  }
}

// 以下为加载进度条的示例代码，仅供参考
function LoadingProgress(percent,info){
  console.log("进度百分比:"+percent+"info:"+info);
}

//图形窗口改变时，需实时传递给引擎，否则模型会变形
window.addEventListener('resize', function() {
  // console.log("hhhhhhhhhhhh")
    BlackHole3D["m_re_em_window_width"] = window.innerWidth;
    BlackHole3D["m_re_em_window_height"] = window.innerHeight;
});
// 刷新页面时需要卸载GPU内存
window.addEventListener('beforeunload', function() {
  if(typeof BlackHole3D.REreleaseEngine != 'undefined'){
    BlackHole3D.REreleaseEngine();
  }
  if(typeof BlackHole3D.ctx != 'undefined'){
    if(BlackHole3D.ctx.getExtension('WEBGL_lose_context') != null){
      BlackHole3D.ctx.getExtension('WEBGL_lose_context').loseContext();
    }
  }  
});
window.addEventListener('unload', function() {
  if(typeof BlackHole3D.REreleaseEngine != 'undefined'){
    BlackHole3D.REreleaseEngine();
  }
  if(typeof BlackHole3D.ctx != 'undefined'){
    if(BlackHole3D.ctx.getExtension('WEBGL_lose_context') != null){
      BlackHole3D.ctx.getExtension('WEBGL_lose_context').loseContext();
    }
  }  
});

//获取点击的构件信息
function getselmodelinfo(){
  // var proberet = REgetCurProbeRet();  //获取当前选中点相关参数
  // console.log(proberet);
  // REresetElemClr([],"pro01");
  var proberet = BlackHole3D.REgetCurCombProbeRet();
  console.log(proberet)
  // console.log(proberet.m_strProjName+"构件id"+proberet.m_uElemID)
  // var objarr=[]; objarr.push(proberet.m_uElemID);
  // var aabb = BlackHole3D.REgetTotalBoxByElemIDs_projs(proberet.m_strProjName,objarr);
  // console.log(aabb)
  // var objarr = []; objarr.push(proberet.m_uElemID);
  // BlackHole3D.REsetElemClr(objarr, "00ff00", 255, 100, 255, proberet.m_strProjName)
  
}
// 点击获取锚点信息
function getselshapeinfo(){
  // var shpProbeRet_norm = BlackHole3D.REgetCurShpProbeRet(); 
//获取当前拾取到的矢量(锚点、标签)相关信息
  // console.log(shpProbeRet_norm);
  // BlackHole3D.REfocusCamToAnchor(shpProbeRet_norm.m_strSelShpObjName,5);//点击锚点实现相机定位
}

// 添加聚合锚点
function addlodanchor(){
   var arrancinfo = [];
   for (var i = 0; i < 10; ++i) {
     for (var j = 0; j < 10; ++j) {
       var ancName = (i * 100 + j).toString();
       var pos = (j % 2 == 0) ? [489812 + i * 300, 4323456 + j * 300, 10] : [489812 + i * 300, 4323556 + j * 300, 10];
       var groupName = (j % 2 == 0) ? "group01" : "group02";
       var picPath = (j % 2 == 0) ? "http://localhost:10086/demo/demoweb/css/img/tag.png" : "http://localhost:10086/demo/demoweb/css/img/anc.png";
       var textInfo = "标记" + (i * 100 + j).toString();
       var picWidth = 32; var picHeight = 32; var useLod = true;
       var linePos = [0, 50]; var lineClr = 0xff00ff00; var ancSize = 60;
       var selfAutoScaleDist = -1; var selfVisDist = -1; var textBias = [1, 0]; var textFocus = [5, 2];
       var fontName = "RealBIMFont001"; var textColor = 0xffffffff; var textBorderColor = 0x80000000;
       var tempanc = {
         "groupName": groupName,
         "ancName": ancName,
         "pos": pos,
         "picPath": picPath,
         "textInfo": textInfo,
         "picWidth": picWidth,
         "picHeight": picHeight,
         "useLod": useLod,
         "linePos": linePos,
         "lineClr": lineClr,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
         "ancSize": ancSize,
         "selfAutoScaleDist": selfAutoScaleDist,
         "selfVisDist": selfVisDist,
         "textBias": textBias,
         "textFocus": textFocus,
         "fontName": fontName,
         "textColor": textColor,
         "textBorderColor": textBorderColor
       };
       arrancinfo.push(tempanc);
     }
   }
   BlackHole3D.REaddAnchors(arrancinfo);
}
// 设置聚合
function setlodanchor(){
  var bbBV = [[489000.0, 4323000.0, -50.0], [492812.0, 4326456.0, 50.0]];
  var mergestyle01 = {
    "picPath": "https://findicons.com/files/icons/656/rounded_world_flags/128/barbados.png", //聚合锚点的图片路径
    "picWidth": 60, //聚合锚点的图片宽度
    "picHeight": 60, //聚合锚点的图片高度
    "textBias": [1, 0], //聚合锚点文字和图片的对齐方式
    "fontName": "RealBIMFont001", //聚合锚点文字样式
    "textColor": 0xffffffff, //聚合锚点文字颜色
    "textBorderColor": 0x80000000 //聚合锚点文字边框颜色
  };
  var mergestyle02 = {
    "picPath": "http://localhost:10086/demo/demoweb/css/img/bubbley.png", //聚合锚点的图片路径
    "picWidth": 60, //聚合锚点的图片宽度
    "picHeight": 60, //聚合锚点的图片高度
    "textBias": [1, 0], //聚合锚点文字和图片的对齐方式
    "fontName": "RealBIMFont001", //聚合锚点文字样式
    "textColor": 0xffffffff, //聚合锚点文字颜色
    "textBorderColor": 0x80000000 //聚合锚点文字边框颜色
  };
  BlackHole3D.REsetAnchorLODInfo("group01", 10, true, bbBV, 300.0, 3, mergestyle01);
  BlackHole3D.REsetAnchorLODInfo("group02", 10, true, bbBV, 300.0, 3, mergestyle02);
}
// 取消锚点聚合
function reselodanchor(){
  BlackHole3D.REresetAnchorLODInfo("")
}



// 添加普通锚点
function addanchor(){
  var ancinfo =[
    {
      "groupName":"camera",
      "ancName":"anc01", 
      "pos":[493551, 4324771, 6.4],
      "picPath":"http://localhost:10086/demo/demoweb/css/img/bubbley.png",
      "textInfo":"相机",
      "picWidth":60,
      "picHeight":60,
      "useLod":false,
      "linePos":[0,0],
      "lineClr":0xff0000ff,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
      "ancSize":60,
      "selfAutoScaleDist":-1,
      "selfVisDist":-1,
      "textBias":[0,0],
      "texFocus":[5,2] 
    }];
  BlackHole3D.REaddAnchors(ancinfo);




    var ancinfo =[
    {
      "groupName":"camera",
      "ancName":"anc01", 
      "pos":[493551, 4324771, 6.4],
      "picPath":"http://localhost:10086/demo/demoweb/css/img/bubbley.png",
      "textInfo":"相机",
      "picWidth":60,
      "picHeight":60,
      "useLod":false,
      "linePos":[0,0],
      "lineClr":0xff0000ff,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
      "ancSize":60,
      "selfAutoScaleDist":-1,
      "selfVisDist":-1,
      "textBias":[0,0],
      "texFocus":[5,2] 
    },{
      "groupName":"tag",
      "ancName":"anc02", 
      "pos":[493409, 4324731, 6.4],
      "picPath":"http://localhost:10086/demo/demoweb/css/img/bubbley.png",
      "textInfo":"标签",
      "picWidth":60,
      "picHeight":60,
      "useLod":false,
      "linePos":[0,0],
      "lineClr":0xff0000ff,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
      "ancSize":60,
      "selfAutoScaleDist":-1,
      "selfVisDist":-1,
      "textBias":[0,0],
      "texFocus":[5,2] 
    }];
  BlackHole3D.REaddAnchors(ancinfo);
}



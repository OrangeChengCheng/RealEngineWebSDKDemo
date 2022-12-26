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
  
  document.addEventListener("RealBIMSelShape",getselshapeinfo);
  
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
  var commonurl = "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_gol001";
  var username = "admin"; var password = "xiyangyang";
  BlackHole3D.REinitSys(workerjspath,width,height,commonurl,username,password);
}
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas(){
  console.log("addEventListener RealEngineRenderReady!！！！！！！！！！！！！！！！！！！！！！！！");
  document.getElementById('canvas').style.display="block";
  BlackHole3D.canvas.focus();
}

//初始化完成后，开始加载场景，需正确传递相关参数
function RealBIMLoadMainSce(isSuccess){
  if(isSuccess){
    console.log("Listen RealBIMInitSys!！！！！！！！！！！！！！！！！！！！！！！！");
    //加载rvt模型
    var projInfo = [
     {
        "projName": "pro01",
        "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
        "projResName": "res_zhengshangguoji",
        "useNewVer": true,
        "verInfo": 0,
        "useTransInfo": false,
        "transInfo": ""
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

function getselshapeinfo(){
  // var proberet = REgetCurProbeRet();  //获取当前选中点相关参数
  // console.log(proberet);
  // REresetElemClr([],"pro01");
  var proberet = BlackHole3D.REgetCurCombProbeRet();
  console.log(proberet)
  // console.log(proberet.m_strProjName+"构件id"+proberet.m_uElemID)
  // var objarr=[]; objarr.push(proberet.m_uElemID);
  // var aabb = REgetTotalBoxByElemIDs_projs(proberet.m_strProjName,objarr);
  // console.log(aabb)
  // var objarr = []; objarr.push(proberet.m_uElemID);
  // REsetElemClr(objarr, "00ff00", 255, 100, 255, proberet.m_strProjName)
  
}

//添加2组轴网
function setgrid(){
  var griddata = [{
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684a6",
    "name": "A",
    "color": "ff0000",
    "alpha": 255,
    "pos": [[-182.65852,140.81303,10.0],[-243.75598,103.65058,10.0]]
  },
  {
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684b2",
    "name": "1",
    "color": "ff0000",
    "alpha": 255,
    "pos": [[-263.46043,141.84199,10.0],[-239.0002,101.6278,10.0]]
  }];
  BlackHole3D.REsetGridData("test",griddata)

  var griddata2 = [{
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684a8",
    "name": "2",
    "color": "ff0000",
    "alpha": 255,
    "pos": [[-255.77111,146.519,10.0],[-231.31089,106.30482,10.0]]
  },
  {
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684a9",
    "name": "3",
    "color": "ff0000",
    "alpha": 255,
    "pos": [[-248.0818,151.19602,10.0],[-223.62158,110.98183,10.0]]
  }];
  BlackHole3D.REsetGridData("test2",griddata2)
}

//添加2组标高
function setlevel(){
  var leveldata = [{
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684ec",
    "name": "屋顶机房自动喷淋平面图",
    "color": "000000",
    "alpha": 255,
    "height": 19.0,
    "height_top": 23.0,
    "height_bottom": 19.0
  },
  {
    "guid": "a0579b7b-bf24-40c5-9b78-0a212ded99bd-00231870",
    "name": "一层管综平面图",
    "color": "000000",
    "alpha": 255,
    "height": 0.0,
    "height_top": 5.0,
    "height_bottom": -2.0
  }];
  BlackHole3D.REsetLevelData("test",leveldata,"pro01")

  var leveldata2 = [{
    "guid": "a0579b7b-bf24-40c5-9b78-0a212ded99bd-002318e8",
    "name": "二层管综平面图",
    "color": "000000",
    "alpha": 255,
    "height": 5.0,
    "height_top": 5.0,
    "height_bottom": 5.5
  },
  {
    "guid": "3db99485-2f80-4659-b554-f76497fd758f-002319ad",
    "name": "三层弱电平面图",
    "color": "000000",
    "alpha": 255,
    "height": 10.0,
    "height_top": 12.3,
    "height_bottom": 10.0
  }];
  BlackHole3D.REsetLevelData("test2",leveldata2,"")
}





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
  document.addEventListener("RealBIMLoadMainSce", function(e){MainSceDown(e.detail)});
  document.addEventListener("RealBIMSelModel",testpansel);
  // document.addEventListener("RealBIMFrameSel",testboxselend);
  document.addEventListener("RealEngineRenderReady", showCanvas);
  document.addEventListener("RealBIMPolyClipping", PolyClipRetFunc);

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
  console.log("hahahahahahahahhhahhahahah")
  if(isSuccess){
    // BlackHole3D.REsetEngineWorldCRS("EPSG:3857");
    console.log("Listen RealBIMInitSys!！！！！！！！！！！！！！！！！！！！！！！！");
    // var crs = "EPSG:3857";
    //加载rvt模型
    var projInfo = [
     // {
     //    "projName": "pro01",
     //    "urlRes": "https://isuse.bjblackhole.co/default.aspx?dir=blackhole_res12&path=",
     //    "projResName": "a0f17cbd76544a659f2ae11c12052bca",  //bim数据
     //    "useNewVer": true,
     //    "verInfo": 0,
     //    "useTransInfo": false,
     //    "transInfo": ""
     //  },

     // {
     //        "projName":"jifang",
     //        "urlRes":"https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
     //        "projResName":"res_jifang",
     //        "useNewVer":true,
     //        "verInfo":0,
     //        "useTransInfo":false,
     //        "transInfo":[[1.0,1.0,1.0],[0.0,0.0,0.0,1.0],[0.0,0.0,100.0]]
     //    }

      {
        "projName": "pro02",
        "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
        "projResName": "res_nantong",  //bim数据
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
function MainSceDown(detail){
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  console.log(detail)
  if(detail.succeed){
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
  console.log("hhhhhhhhhhhh")
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

function PolyClipRetFunc(e){
  console.log("hahahahahahahahh")
  console.log(e.detail);
}

function test(){

  // BlackHole3D.REpolyclipHugeObjSubElems("jifang", "" , [[19,57],[15,57],[15,48],[19,48]], 0, 2, true, true, 1);
  var suntime=0;
  // 模拟日出和日落
  function sunshine(){
    if(suntime<12){
      suntime += 1; console.log(suntime);
      var sundir=[];
      sundir[0] = -Math.cos(suntime/12*(Math.PI));
      sundir[1] = 0.6319452524185181;
      sundir[2] = -Math.sin(suntime/12*(Math.PI));
      BlackHole3D.REsetLightDir(sundir);
      setTimeout("sunshine()",1000);
    }
  }

  var clipdata={
  "m_bSingleSurfaceClipping":true,
  "m_qRotation":[-2.131548898657652e-7, -7.27778448062882e-8, 0, 0.9999999999999746],
  "m_vScale":[0.1810171287693922, 0.1810171287693922, 0.1810171287693922],
  "m_vTranslation":[-5.615203663252196, 0.5146679731276314, 0.8759842888382137],
  "m_vVer0":[-5.673651730523429, 0.42105172641403743, 1.0500445244968282],
  "m_vVer1":[-5.559331643796144, 0.5191921717262453, 1.0500444992985356],
  "m_vVer2":[-5.6126276914433735, 0.6037602438533135, 1.0500444554887964]
  };
  BlackHole3D.REsetClipData(clipdata)


  var clipdata={
  "m_bSingleSurfaceClipping":true,
  "m_qRotation":[-2.131548898657652e-7, -7.27778448062882e-8, 0, 0.9999999999999746],
  "m_vScale":[0.1810171287693922, 0.1810171287693922, 0.1810171287693922],
  "m_vTranslation":[-5.615203663252196, 0.5146679731276314, 0.8759842888382137],
  "m_vVer0":[-5.673651730523429, 0.42105172641403743, 1.0500445244968282],
  "m_vVer1":[-5.559331643796144, 0.5191921717262453, 1.0500444992985356],
  "m_vVer2":[-5.6126276914433735, 0.6037602438533135, 1.0500444554887964]
  };
  BlackHole3D.REsetClipDataEdit(clipdata)

  BlackHole3D.REclipByHeight(12.3,10.0,false,"",true,"default",1.0)

BlackHole3D.RElocateCamToMainDir("up")


  BlackHole3D.REsetElemClr([257], "FF0000", 255, 80, 255,"pro01");
  BlackHole3D.REsetElemClr([25], "000000", 255, 80, 255,"pro01");
  BlackHole3D.REsetElemClr([2], "ffffff", 255, 80, 255,"pro01");
  BlackHole3D.REsetElemClr([185], "FF0000", 255, 80, 255,"pro01");

  BlackHole3D.REgetElemClr()

parseInt((4283498495).toString(16).substring(2,4))




  
}

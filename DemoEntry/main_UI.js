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
  document.addEventListener("RealBIMLoadPanSce", function(e){PanSceDown(e.detail.succeed)});
  
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
  var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res360&path=res_gol001";
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
        "urlRes": "https://isuse.bjblackhole.com/default.aspx?dir=blackhole_res13&path=",
        "projResName": "69ff8b14d9604d079a75edb4f7bbb8c4",
        "useNewVer": true,
        "verInfo": 0,
        "useTransInfo": false,
        "transInfo": ""
      }
    ];
    BlackHole3D.REloadMainSce_projs(projInfo);
    //加载360全景
    var panProjInfo = [
     {
        "projName": "pro02",
        "urlRes": "http://blackhole.f3322.net:8008/default.aspx?dir=url_res02&path=",
        "projResName": "886464uhht"
      }
    ];
    BlackHole3D.REloadPanSce(panProjInfo);
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
//全景场景加载完成，此时可获取全部点位信息
function PanSceDown(isSuccess){
  if(isSuccess){
    console.log("360全景加载成功!！！！！！！！！！！！！！！！！！！！！！！！");
    // BlackHole3D.REsetRTMode(0,0,1); //设置窗口模式
    // var pandata = BlackHole3D.REgetPanSceElemInfos("pro02");
    // console.log(pandata);
    // console.log(pandata[0].m_strId);
    // BlackHole3D.REsetCurPan(pandata[0].m_strId,1);
  }else{
    console.log("360全景加载失败！！！！！！！！！！！！！！！！！！！！！！！");
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

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
  document.addEventListener("RESystemReady", RESystemReady);
  document.addEventListener("RESystemEngineCreated", function(e){RESystemEngineCreated(e.detail.succeed)});
  document.addEventListener("REDataSetLoadFinish", function(e){REDataSetLoadFinish(e.detail.succeed)});
  document.addEventListener("RESystemSelElement",function(e){console.log(e.detail);});

  document.addEventListener("RECADLoadFinish", RECADLoadFinish);
  document.addEventListener("RealBIMSelCAD", function(e){console.log(e.detail);});
  document.addEventListener("RealBIMSelCADAnchor", function(e){console.log(e.detail);});

  document.addEventListener("RESystemRenderReady", RESystemRenderReady);

  document.addEventListener("REDataSetLoadProgress", REDataSetLoadProgress);

 



  if((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')){
    console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
    RESystemReady();
  }
});


function RECADLoadFinish(e) {
  

  BlackHole3D.REaddCADAnchors([
    {
         id: "anc001", 
         pos: [-120.0, 240.0], 
         innerClr: "00ff00", 
         innerAlpha: 255,
         extClr: "ffffff",  
         extAlpha: 255,
         style: 2
    }
  ]);
  BlackHole3D.REaddCADShpAnchors([
    {
         id: "anchor", 
         pos: [-100, 240], 
         picPath: "https://demo.bjblackhole.com/BlackHole3.0/imgs/1.svg", 
         groupName: "group1",
         strText: "test",  
         textClr: "ff0000",
         textAlpha: 255,
         textSize: 16,
         textBias: [0,0]
    }
  ]);
}


//场景初始化，需正确传递相关参数
function RESystemReady(isSuccess){
  console.log("Listen RealEngineReady!！！！！！！！！！！！！！！！！！！！！！！！！");
  progressFn(0.5, "RealEngine/WorkerJS Begin Init");
  var workerjspath = "javascript/RealBIMWeb_Worker.js";
  var width = window.innerWidth; var height = window.innerHeight;
  var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res360&path=res_gol001";
  // var commonurl = "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_gol001";
  var username = "admin"; var password = "xiyangyang";
  BlackHole3D.REinitSys(workerjspath,width,height,commonurl,username,password);
}
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function RESystemRenderReady(){
  console.log("addEventListener RealEngineRenderReady!！！！！！！！！！！！！！！！！！！！！！！！");
  document.getElementById('canvas').style.display="block";
  // BlackHole3D.canvas.focus();
}

//初始化完成后，开始加载场景，需正确传递相关参数
function RESystemEngineCreated(isSuccess){
  if(isSuccess){
    // BlackHole3D.REsetEngineWorldCRS("EPSG:3857");
    console.log("Listen RealBIMInitSys!！！！！！！！！！！！！！！！！！！！！！！！");
    //加载rvt模型
    // var projInfo = [
    //  {
    //     "projName": "pro01",
    //     "urlRes": "https://isuse.bjblackhole.com/default.aspx?dir=blackhole_res12&path=",
    //     "projResName": "a0f17cbd76544a659f2ae11c12052bca",  //bim数据
    //     "useNewVer": true,
    //     "verInfo": 0,
    //     "useTransInfo": false,
    //     "transInfo": ""
    //   }
    // ];
    // BlackHole3D.REloadMainSce_projs(projInfo);
    //设置渲染参数
    // BlackHole3D.REsetMaxResMemMB(5500);
    // BlackHole3D.REsetExpectMaxInstMemMB(4500);
    // BlackHole3D.REsetExpectMaxInstDrawFaceNum(50000000);
    // BlackHole3D.REsetPageLoadLev(2);

    BlackHole3D.REsetViewMode("", "CAD", 0);
    // BlackHole3D.REloadCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_temp/dwg/BF00-AR01-01(1).dwg", BlackHole3D.RE_CAD_UNIT.Millimeter, 1.0);
    BlackHole3D.REloadCAD("http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_cad/103-Floor Plan - 三层建筑平面图.dwg", BlackHole3D.RE_CAD_UNIT.Millimeter, 1.0);

    // BlackHole3D.REloadCAD("https://bjrealbim.bjblackhole.cn/engineweb/default.aspx?dir=url_res04&path=cad/a102-plans.dwg", BlackHole3D.RE_CAD_UNIT.Millimeter, 1.0);

  }else{
    console.log("场景初始化失败！！！！！！！！！！！！！！！！！！！！！！！！");
  }
}
//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function REDataSetLoadFinish(isSuccess){
  if(isSuccess){
    console.log("模型加载成功!！！！！！！！！！！！！！！！！！！！！！！！");
  }else{
    console.log("模型没有完全加载成功！！！！！！！！！！！！！！！！！！！！！！！");
  }
}

// 加载进度条
function REDataSetLoadProgress(e) {
  var percent = e.detail.progress; var info = e.detail.info;
  progressFn(percent, info);
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

//加载默认样式锚点
function addanchor(){
  // 加载4个样式
  BlackHole3D.REaddCADAnchors([
    {
         id: "anc001", 
         pos: [-23000.0, 300.0], 
         innerClr: "00ff00", 
         innerAlpha: 255,
         extClr: "ffffff",  
         extAlpha: 255,
         style: 0
    },{
         id: "anc002", 
         pos: [-22000.0, 300.0], 
         innerClr: "00ff00", 
         innerAlpha: 255,
         extClr: "ffffff",  
         extAlpha: 255,
         style: 1
    },{
         id: "anc003", 
         pos: [-21000.0, 100.0], 
         innerClr: "00ff00", 
         innerAlpha: 255,
         extClr: "ffffff",  
         extAlpha: 255,
         style: 2
    },{
         id: "anc004", 
         pos: [-20000.0, 100.0], 
         innerClr: "00ff00", 
         innerAlpha: 255,
         extClr: "ffffff",  
         extAlpha: 255,
         style: 3
    }
  ]);
// 获取一个锚点信息
  BlackHole3D.REgetCADAnchor("anc001");
// 获取锚点个数
  BlackHole3D.REgetCADAnchorNum();
// 获取全部锚点信息
  BlackHole3D.REgetAllCADAnchors();
// 删除一个锚点
  BlackHole3D.REdelCADAnchors("anc001");
  // 删除全部
  BlackHole3D.REdelAllCADAnchors();
    // 选中一个图元
  BlackHole3D.REselCADElem("d0");
    // 相机定位到图元
  BlackHole3D.REfocusToCADElem("d0", 1.0);
}

//加载SVG格式锚点
function addshpanchor(){
  // 加载2个svg锚点
  BlackHole3D.REaddCADShpAnchors([
    {
         id: "svg001", 
         pos: [-7, 0], 
         picPath: "http://realbim.bjblackhole.cn:8008/img/test01.svg", 
         groupName: "group1",
         strText: "8",  
         textClr: "ffffff",
         textAlpha: 255,
         textSize: 16,
         textBias: [0,0]
    },{
         id: "svg002", 
         pos: [5, -3], 
         picPath: "http://realbim.bjblackhole.cn:8008/img/test02.svg", 
         groupName: "group1",
         strText: "6",  
         textClr: "ffffff",
         textAlpha: 255,
         textSize: 16,
         textBias: [0,0]
    }
  ]);
// 获取一个svg锚点信息
  BlackHole3D.REgetCADShpAnchor("svg001");
// 获取svg锚点个数
  BlackHole3D.REgetCADShpAnchorNum();
// 获取全部svg锚点信息
  BlackHole3D.REgetAllCADShpAnchors();
// 批量删除svg锚点
  BlackHole3D.REdelCADShpAnchors(["svg001"]);
// 删除全部svg锚点
  BlackHole3D.REdelAllCADShpAnchors();
// 获取所有的svg锚点组名称
  BlackHole3D.REgetAllCADShpAnchorGroupIDs();
// 获取某一组svg锚点信息
  BlackHole3D.REgetGroupCADShpAnchors("group1");
// 删除一组svg锚点
  BlackHole3D.REdelGroupCADShpAnchors("group1");
// 设置一组svg锚点的缩放边界值
  BlackHole3D.REsetCADShpAnchorScale("group1",60,80);
}

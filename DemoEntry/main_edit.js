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
  document.addEventListener("AffineTransModeWndClose",testeditwindowclose);
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
  console.log("hahahahahahahahhhahhahahah")
  if(isSuccess){
    // BlackHole3D.REsetEngineWorldCRS("EPSG:3857");
    console.log("Listen RealBIMInitSys!！！！！！！！！！！！！！！！！！！！！！！！");
    // var crs = "EPSG:3857";
    //加载rvt模型
    var projInfo = [
     {
        "projName": "pro01",
        "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
        "projResName": "res_taizhou",  
        "useNewVer": true,
        "verInfo": 0,
        "useTransInfo": true,
        "transInfo":[[1.0,1.0,1.0],[0.0,0.0,0.0,1.0],[0.0,1000.0,20.0]]
      }
      ,
     {
            "projName":"pro02",
            "urlRes":"https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
            "projResName":"res_jifang",
            "useNewVer":true,
            "verInfo":0,
            "useTransInfo":true,
            "transInfo":[[1.0,1.0,1.0],[0.0,0.0,0.0,1.0],[0.0,0.0,0.0]]
        }
    ];

    // var projInfo = [
    //  {
    //     "projName": "pro01",
    //     "urlRes": "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
    //     "projResName": "res_edit2022090101",  //多个节点
    //     "useNewVer": true,
    //     "verInfo": 0,
    //     "useTransInfo": false,
    //     "transInfo": ""
    //   }
    // ];

    // var projInfo = [
    //   {
    //     "projName": "pro01",
    //     "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
    //     "projResName": "res_osgbmerge01",  
    //     "useNewVer": true,
    //     "verInfo": 0,
    //     "useTransInfo": false,
    //     "transInfo": ""
      // },{
      //   "projName": "pro02",
      //   "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
      //   "projResName": "res_taizhou",  
      //   "useNewVer": true,
      //   "verInfo": 0,
      //   "useTransInfo": true,
      //   "transInfo":[[1.0,1.0,1.0],[0.0,0.0,0.0,1.0],[0.0,1000.0,20.0]]
      // }
    // ];

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
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
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

function testeditwindowclose(){
  console.log("位置编辑窗口关闭，编辑状态自动退出")
}
//获取点击的构件信息
function getselmodelinfo(){
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

function test(){
  // 进入位置编辑状态
  BlackHole3D.REenterSceneNodeEditMode();
  // 设置位置编辑级别为HModel级
  BlackHole3D.REsetEditNodeLevel(1);
  // 打开gizmo窗口
  BlackHole3D.REsetUIWgtVisible("AffineTransModeWnd",true);
  // 查询当前数据集所有pak的id
  BlackHole3D.REgetAllHugeGroupIDs("pro01");
  // 开始pak位置编辑，编辑完成后，获取当前数据集某个pak的位置信息
  BlackHole3D.REgetPakTransLeftCoord("pro01","3a05e1ea0a86e8832e1f3102357ab6f4");
  BlackHole3D.REgetPakTransLeftCoord("pro01","3a05e1ea1ba87ebe3ea9008a9b77bc29");
  BlackHole3D.REgetPakTransLeftCoord("pro01","3a05e1ea25ffeab22a6bc029044a38e9");
  BlackHole3D.REgetPakTransRightCoord("pro01","3a05e1ea0a86e8832e1f3102357ab6f4");
  // 设置pak的位置偏移信息
  BlackHole3D.REsetPakTransRightCoord("pro01","3a05e1ea0a86e8832e1f3102357ab6f4",[[1,1,1],[0,0,0,1],[0, 0, 120.48853492736816]]);
  // 退出位置编辑状态
  BlackHole3D.REexitSceneNodeEditMode();
  // 关闭gizmo窗口，界面点击X号关闭时，默认退出编辑状态，同时触发AffineTransModeWndClose事件
  BlackHole3D.REsetUIWgtVisible("AffineTransModeWnd",false);
  // 将pro01数据集中的某一个pak节点添加到选择集
  BlackHole3D.REaddEditPakID("pro01","3a05e1ea0a86e8832e1f3102357ab6f4");
  BlackHole3D.REaddEditPakID("pro02","<hugemodel><test>_sce_1");
  

  BlackHole3D.REremoveEditPakID("pro02","<hugemodel><test>_sce_1");


  BlackHole3D.REgetEditPakIDs();
  BlackHole3D.REclearEditPakID();





  // 进入位置编辑状态
  BlackHole3D.REenterSceneNodeEditMode();
  // 设置位置编辑级别为数据集级
  BlackHole3D.REsetEditNodeLevel(0);
  // 打开gizmo窗口
  BlackHole3D.REsetUIWgtVisible("AffineTransModeWnd",true);
  // 退出位置编辑状态
  BlackHole3D.REexitSceneNodeEditMode();
  // 关闭gizmo窗口，界面点击X号关闭时，默认退出编辑状态，同时触发AffineTransModeWndClose事件
  BlackHole3D.REsetUIWgtVisible("AffineTransModeWnd",false);
  // 将pro01数据集添加到选择集
  BlackHole3D.REaddEditProjID("pro02");
  BlackHole3D.REremoveEditProjID("pro02");
  BlackHole3D.REclearEditProjID();
  
  //获取某个数据集的位置变换信息
  BlackHole3D.REgetMainSceTransform("pro02");
  // 设置某个数据集的位置信息
  BlackHole3D.REsetMainSceTransform("pro02", [[1, 1, 1],
    [0, 0, 0.629259852971355, 0.7771949803224855],
    [46.822954538935505, -3.840818740142936, 30.7832200527191]]);

BlackHole3D.REsetMainSceTransform("pro02", [[1, 1, 1],[0, 0, 0, 1],[0, 0, 0]]);




  BlackHole3D.REsetElemClr([], "FF0000", 255, 100, 255,"pro02");







}

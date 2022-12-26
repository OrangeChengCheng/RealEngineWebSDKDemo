// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D =typeof BlackHole3D!=="undefined" ? BlackHole3D : {};
BlackHole3D["canvas"] =(function() {
    var canvas = document.getElementById('canvas');
    return canvas;
  })();

// 加载进度条
function LoadingProgress(e) {
  var percent = e.detail.progress; var info = e.detail.info;
  progressFn(percent, info);
}
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
  document.addEventListener("RealEngineRenderReady", showCanvas);

  document.addEventListener("RealBIMLoadProgress", LoadingProgress);
  if((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')){
    console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
    RealBIMInitSys();
  }
});

//场景初始化，需正确传递相关参数
function RealBIMInitSys(){
    console.log("Listen RealEngineReady!！！！！！！！！！！！！！！！！！！！！！！！！");
    progressFn(0.5, "RealEngine/WorkerJS Begin Init");
    var workerjspath = "javascript/RealBIMWeb_Worker.js";
    var width = window.innerWidth; var height = window.innerHeight;
    var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
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
    var projInfo = [
     {
        "projName": "pro01",
        "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=",
        "projResName": "res_xiongan_02_rongdong",
        "useNewVer": true,
        "verInfo": 0,
        "useTransInfo": false,
        "transInfo": ""
      }
      // {
      //   "projName": "pro01",//gim变电站
      //   "urlRes": "https://isuse.bjblackhole.com/default.aspx?dir=blackhole_res14&path=",
      //   "projResName": "f99a0f7218644a5b9105b6a82cffb001",
      //   "useNewVer": true,
      //   "verInfo": 0,
      //   "useTransInfo": false,
      //   "transInfo": ""
      // }
    ];
    BlackHole3D.REloadMainSce_projs(projInfo);
    BlackHole3D.REsetMaxResMemMB(5500);
    BlackHole3D.REsetExpectMaxInstMemMB(4500);
    BlackHole3D.REsetExpectMaxInstDrawFaceNum(50000000);
    BlackHole3D.REsetPageLoadLev(2);
  }else{
    console.log("初始化失败!！！！！！！！！！！！！！！！！！！！！！！！！");
  }
}
//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(isSuccess){
  if(isSuccess){
    console.log("Listen RealBIMLoadMainSce!！！！！！！！！！！！！！！！！！！！！！！！");
  }else{
    console.log("模型没有完全加载成功！！！！！！！！！！！！！！！！！！！！！！！");
  }
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

//动画与特效测试示例
// 动态墙(变化不大，REsetShapeAnimStyle可以批量设置)
// 添加3个不规则动态墙
function add3wall(){
  //名称、路径、纹理路径、是否法向量方向
  var shpName = "WallShape01";
  var arrPots = [[494676.17220853764, 4326005.831873055, 5.818193162958622,5.0],
                 [494468.32057946554, 4325999.353224661, 11.628162425655162,50.0],
                 [494457.6331963151, 4326274.070055754, 11.493287567094853,50.0],
                 [494681.6301692397, 4326273.861231729, 11.679900674603175,50.0]]
  var strTexPath ="http://localhost:10086/demo/demonew/css/img/dynamic01.png";
  var bNormalDir =true;
  BlackHole3D.REaddAnimationWall("wall",shpName,arrPots,strTexPath,bNormalDir,false);

  var shpName = "WallShape02";
  var arrPots = [[492758.44193916477, 4324383.808096653, 8.680750090585505,30.0],
                 [492608.6915985543, 4324766.185119614, 11.21732556427557,30.0],
                 [492780.7628429464, 4324834.230912504, 12.582772175856817,30.0],
                 [492935.91909659095, 4324451.772063671, 10.872941819247686,30.0]];
  var strTexPath ="http://localhost:10086/demo/demonew/css/img/dynamic01.png";
  
  var bNormalDir =false;
  BlackHole3D.REaddAnimationWall("wall",shpName,arrPots,strTexPath,bNormalDir,true);

  //分组、名称、颜色（ABGR）、正负是方向、xy是重复度、zw是速度
  BlackHole3D.REsetShapeAnimStyle("wall",["WallShape01","WallShape02"], "00ffff", 255, [2.0,0.0,-0.5,0.0]);
}

// 不规则扫描面
function addplane(){
  //名称、路径、纹理路径、是否法向量方向
  var arrPots = [[494691.16097027954, 4325716.8740812605, 12.785127540817712],
                [494938.15892436786, 4325708.275473775, 12.193479578529661],
                [494935.4211817747, 4325509.379708176, 12.20851146380403],
                [494690.6729155745, 4325511.047923017, 12.829989964552055]];
  var strTexPath ="http://localhost:10086/demo/demonew/css/img/dynamic01.png";
  BlackHole3D.REaddAnimationPlane("plane","plane01",arrPots,strTexPath);
  //分组、名称、颜色（ABGR）、正负是方向、xy是重复度、zw是速度
  BlackHole3D.REsetShapeAnimStyle("plane",["plane01"], "00ffff", 255, [2.0,0.0,-0.5,0.0]);
}

// 扩散与扫描（变化较大，可批量添加与设置样式）
function add4polygon(){
  //名称、中心点、半径、纹理路径、是否扫描、是否圆、边数
  var arrshpname = ["polygon01","polygon02","polygon03","polygon04"];
  var arrpots=[[493880.4643731248, 4325495.404982001, 13.946804621855676],
               [494456.94709662517, 4325061.542319998, 13.248950013671788],
               [492857.38443414273, 4325496.343069075, 14.085354512641118],
               [493796.7264210746, 4326537.47669464, 14.167011711740884]
              ];
  var strTexPath ="http://localhost:10086/demo/demonew/css/img/dynamic01.png";
  BlackHole3D.REaddAnimationPolygons("polygon",arrshpname,arrpots,500.0,strTexPath,false,true,6);
  BlackHole3D.REsetShapeAnimStyle("polygon",[], "ffffff", 255, [0.0,0.0, 0.5,0.0]);
}

// 球体（变化较大，可批量添加与设置样式）
// 添加3个半球
function add3boll(){
  var arrshpname = ["Ball01","Ball02","Ball03"];
  var arrpots=[[492854.2609314331, 4325925.662148798, 120.60068580304278],
               [494056.4216874238, 4325848.586117894, 12.341185555393707],
               [491996.6266379895, 4324438.02680961, 2.6906566073980684]
              ];
  var strTexPath ="http://localhost:10086/demo/demonew/css/img/dynamic01.png";
  BlackHole3D.REaddAnimationSpheres("ball",arrshpname,arrpots,250.0,false,strTexPath);
  BlackHole3D.REsetShapeAnimStyle("ball",[], "ff00ff", 255, [0.0,0.0, 0.5,0.0]);
}

// 规则多边形动态墙
function addPolygonWalls(){
  var arrshpname = ["wall01","wall02","wall03"];
  var arrpots=[[492854.2609314331, 4325925.662148798, 120.60068580304278],
               [494056.4216874238, 4325848.586117894, 12.341185555393707],
               [491996.6266379895, 4324438.02680961, 2.6906566073980684]
              ];
  var strTexPath ="http://localhost:10086/demo/demonew/css/img/dynamic01.png";
  BlackHole3D.REaddAnimationPolygonWalls("pwall",arrshpname,arrpots,50,20,strTexPath,false,6,true);
  BlackHole3D.REsetShapeAnimStyle("pwall",[], "ff00ff", 255, [0.0,0.0, 0.5,0.0]);
}
// 删除
function delshps(){
  BlackHole3D.REdelShpAnimation("",[]);
}

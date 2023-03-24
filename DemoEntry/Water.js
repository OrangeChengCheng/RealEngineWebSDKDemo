// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D = typeof BlackHole3D !== "undefined" ? BlackHole3D : {};
BlackHole3D["canvas"] = (function () {
  var canvas = document.getElementById('canvas');
  return canvas;
})();

//图形窗口改变时，需实时传递给引擎，否则模型会变形
window.onresize = function (event) {
  BlackHole3D["m_re_em_window_width"] = BlackHole3D.canvas.clientWidth;
  BlackHole3D["m_re_em_window_height"] = BlackHole3D.canvas.clientHeight;
}
// 刷新页面时需要卸载GPU内存
window.onbeforeunload = function (event) {
  if (typeof BlackHole3D.releaseEngine != 'undefined') {
    BlackHole3D.releaseEngine();
  }
};

// 页面加载时添加相关监听事件
window.onload = function (event) {
  console.log("=========================== window.load()");
  if (typeof CreateBlackHoleWebSDK != 'undefined') {
    console.log("======== RE2SDKCreateModule 存在");
    BlackHole3D = CreateBlackHoleWebSDK(BlackHole3D);
  } else {
    console.log("======== RE2SDKCreateModule 不存在");
    document.addEventListener("RealEngineToBeReady", function () { BlackHole3D = CreateBlackHoleWebSDK(BlackHole3D); });
  }

  addREListener();//添加监听事件
}

function addREListener() {
  console.log("======== 添加监听事件");
  //系统监听
  document.addEventListener("RESystemReady", RESystemReady);//系统初始化完成回调
  document.addEventListener("RESystemEngineCreated", RESystemEngineCreated);//系统引擎创建完成回调
  document.addEventListener("REDataSetLoadFinish", REDataSetLoadFinish);//场景模型加载完成回调
  document.addEventListener("RESystemRenderReady", RESystemRenderReady);//数据集模型加载进度反馈
  document.addEventListener("REDataSetLoadProgress", REDataSetLoadProgress);//数据集模型加载进度反馈

  //加载
  document.addEventListener("AddWaterRgnSuccessEvent", AddWaterRgnSuccessEvent);//水面添加成功回调事件
}

//场景初始化，需正确传递相关参数
function RESystemReady() {
  console.log("=========================== 引擎底层初始化完成");
  progressFn(0.5, "RealEngine/WorkerJS Begin Init");

  var sysInfo = new BlackHole3D.RESysInfo();
  sysInfo.workerjsPath = "javascript/RealBIMWeb_Worker.js";
  sysInfo.renderWidth = BlackHole3D.canvas.clientWidth;
  sysInfo.renderHieght = BlackHole3D.canvas.clientHeight;
  sysInfo.commonUrl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
  sysInfo.userName = "admin";
  sysInfo.passWord = "xiyangyang";
  sysInfo.mainWndName = "BlackHole3D";
  BlackHole3D.initEngineSys(sysInfo);
  BlackHole3D.Common.setUseWebCache(false);//是否允许使用浏览器缓存
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RESystemEngineCreated(e) {
  console.log("当前 WebSDK 运行版本", BlackHole3D.getVersion());
  console.log("=========================== 场景初始化完成");
  var isSuccess = e.detail.succeed;

  if (isSuccess) {
    console.log("===========================  场景初始化 --> 成功！！！");

    loadModel()//加载模型

    // 设置全局渲染性能控制参数
    BlackHole3D.Common.setMaxResMemMB(5500);
    BlackHole3D.Common.setExpectMaxInstMemMB(4500);
    BlackHole3D.Common.setExpectMaxInstDrawFaceNum(20000000);
    BlackHole3D.Common.setPageLoadLev(2);
  } else {
    console.log("===========================  场景初始化 --> 失败！！！");
  }

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function REDataSetLoadFinish(e) {
  console.log("=========================== 引擎主场景模型加载完成 ");
  if (e.detail.succeed) {
    console.log("=========================== 引擎主场景模型加载 --> 成功！！！");
  } else {
    console.log("===========================  引擎主场景模型加载 --> 部分模型加载失败！！！");
  }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function RESystemRenderReady() {
  console.log("=========================== 引擎渲染器初始化完成 ");
  document.getElementById('canvas').style.display = "block";
  BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function REDataSetLoadProgress(e) {
  var percent = e.detail.progress; var info = e.detail.info;
  progressFn(percent, info);
}

function AddWaterRgnSuccessEvent(e) {
  console.log("-- 水面添加成功回调事件 --", e.detail);
  BlackHole3D.Water.setWaterName("water01");
}

// 加载模型
function loadModel() {
  var dataSetList = [
    {
      "dataSetId": "机房01",
      "resourcesAddress": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang",
      "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
      "dataSetCRS": "", "dataSetCRSNorth": 0.0
    },
  ];
  BlackHole3D.Model.loadDataSet(dataSetList);
}



//添加水面
function addWater() {
  var water1 = new BlackHole3D.REWaterInfo();
  water1.waterName = "water001";//水面名称
  water1.waterClr = new BlackHole3D.REColor(255, 0, 0, 255);//水面颜色
  water1.blendDist = 1;//混合系数
  water1.visible = true;//是否可见
  water1.cornerPoint = [[17, 47.136409, -11.528129], [17, 50.136409, -11.528129], [14, 50.136409, -11.528129]];//角点

  var water2 = new BlackHole3D.REWaterInfo();
  water2.waterName = "water002";//水面名称
  water2.waterClr = new BlackHole3D.REColor(0, 255, 0, 204);//水面颜色
  water2.blendDist = 1;//混合系数
  water2.visible = true;//是否可见
  water2.cornerPoint = [[28.07652, 47.543973, 3.214592], [28.07652, 50.543973, 3.214592], [25.07652, 50.543973, 3.214592]];//角点

  var water3 = new BlackHole3D.REWaterInfo();
  water3.waterName = "water003";//水面名称
  water3.waterClr = new BlackHole3D.REColor(0, 0, 255, 204);//水面颜色
  water3.blendDist = 1;//混合系数
  water3.visible = true;//是否可见
  water3.cornerPoint = [[28.361801, 54.391705, -0.61], [30.229191, 52.810488, -0.61], [28.219878, 52.207864, -0.61]];//角点

  var waterList = [water1, water2, water3];
  BlackHole3D.Water.loadData(waterList);
}



//设置水面角点
function setCorners() {
  BlackHole3D.Water.startEditState();
  BlackHole3D.Water.setCorners("water001", [[30, 60.136409, -11.528129], [17, 50.136409, -11.528129], [30, 50.136409, -11.528129]]);
}

//设置水面颜色
function setClr() {
  BlackHole3D.Water.setClr("water001", new BlackHole3D.REColor(255, 255, 0, 204));
}








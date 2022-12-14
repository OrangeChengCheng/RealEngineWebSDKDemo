// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D = typeof BlackHole3D !== "undefined" ? BlackHole3D : {};
BlackHole3D["canvas"] = (function () {
  var canvas = document.getElementById('canvas');
  return canvas;
})();
BlackHole3DPhone = false; //表示是否使用移动浏览器模式

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
  console.log("=========================== window.load() ================================");
  if (typeof RE2SDKCreateModule != 'undefined') {
    console.log("======== RE2SDKCreateModule 存在 =========");
    BlackHole3D = RE2SDKCreateModule(BlackHole3D);
  } else {
    console.log("======== RE2SDKCreateModule 不存在 =========");
    document.addEventListener("RealEngineToBeReady", function () { BlackHole3D = RE2SDKCreateModule(BlackHole3D); });
  }

  console.log("======== 添加监听事件 =========  ");
  document.addEventListener("RealEngineReady", RealBIMInitSys);
  document.addEventListener("RealBIMInitSys", RealBIMLoadMainSce);
  document.addEventListener("RealBIMLoadMainSce", MainSceDown);
  document.addEventListener("RealEngineRenderReady", showCanvas);
  document.addEventListener("RealBIMLoadProgress", LoadingProgress);
  document.addEventListener("AddWaterRgnFinishEvent", addWaterRgnFinish);


  if ((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')) {
    console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
    RealBIMInitSys();
  }
}

 

//场景初始化，需正确传递相关参数
function RealBIMInitSys() {
  console.log("=========================== 引擎底层初始化完成 ================================");
  progressFn(0.5, "RealEngine/WorkerJS Begin Init");

  var workerjspath = "javascript/RealBIMWeb_Worker.js";
  var width = window.innerWidth; var height = window.innerHeight;
  var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
  var username = "admin"; var password = "xiyangyang";
  if (BlackHole3DPhone) { BlackHole3D['m_re_em_force_threadnum'] = 1; } //强制将CPU核心数设为1，以避免浏览器创建多个WebWorker时造成内存耗尽

  BlackHole3D.REinitSys(workerjspath, width, height, commonurl, username, password);
  BlackHole3D.REsetUseWebCache(false);//是否允许使用浏览器缓存
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce(e) {
  console.log("=========================== 场景初始化完成 ================================");
  var isSuccess = e.detail.succeed;

  if (isSuccess) {
    console.log("===========================  场景初始化 --> 成功！！！  ================================");
    //倾斜摄影proj1的测试场景
    var projInfo = [
      {
        "projName": "pro01",
        "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
        "projResName": "res_jifang",
        "useNewVer": true,
        "verInfo": 0,
        "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
        "projCRS": "",
        "projNorth": 0.0
      }
    ];
    BlackHole3D.REloadMainSce_projs(projInfo);
    // 设置全局渲染性能控制参数
    if (BlackHole3DPhone) {
      BlackHole3D.REsetMaxResMemMB(500);
      BlackHole3D.REsetExpectMaxInstMemMB(400);
      BlackHole3D.REsetExpectMaxInstDrawFaceNum(1000000);
      BlackHole3D.REsetPageLoadLev(2);

      BlackHole3D.REsetShadowState(false);
      BlackHole3D.REsetGhostState(false);
      BlackHole3D.REsetAOState(false);
      BlackHole3D.REsetSceOITLev(0);
      BlackHole3D.REsetInputType(1);
    } else {
      BlackHole3D.REsetMaxResMemMB(5500);
      BlackHole3D.REsetExpectMaxInstMemMB(4500);
      BlackHole3D.REsetExpectMaxInstDrawFaceNum(20000000);
      BlackHole3D.REsetPageLoadLev(2);
    }
  } else {
    console.log("===========================  场景初始化 --> 失败！！！  ================================");
  }

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(e) {
  console.log("=========================== 引擎主场景模型加载完成 ================================");
  if (e.detail.succeed) {
    console.log("=========================== 引擎主场景模型加载 --> 成功！！！ ================================");
    editWater();
  } else {
    console.log("===========================  引擎主场景模型加载 --> 部分模型加载失败！！！  ================================");
  }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas() {
  console.log("=========================== 引擎渲染器初始化完成 ================================");
  document.getElementById('canvas').style.display = "block";
  BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function LoadingProgress(e) {
  var percent = e.detail.progress; var info = e.detail.info;
  progressFn(percent, info);
}





// MARK  编辑水面

function editWater() {
  //通过Json 创建水域对象
BlackHole3D.REloadWaterFromJSON('{"Waters":[{"WaterName":"MyWater001","Color":["334ccc","204"],"BlendDist":1,"Visible":true,"Corners":[[17,47.136409,-11.528129],[17,50.136409,-11.528129],[14,50.136409,-11.528129]]},{"WaterName":"MyWater002","Color":["33cccc","127"],"BlendDist":0.2,"Visible":true,"Corners":[[28.07652,47.543973,3.214592],[28.07652,50.543973,3.214592],[25.07652,50.543973,3.214592]]},{"WaterName":"Water01","Color":["ff00","255"],"BlendDist":0.5,"Visible":true,"Corners":[[22.172983,25.079871,0],[26.172983,25.079871,0],[26.172983,30.079871,0]]},{"WaterName":"Water02","Color":["ffff0","255"],"BlendDist":1,"Visible":true,"Corners":[[10,0,0],[15,0,0],[15,5,0]]},{"WaterName":"water_0004","Color":["193f4c","255"],"BlendDist":1,"Visible":true,"Corners":[[28.361801,54.391705,-0.61],[30.229191,52.810488,-0.61],[28.219878,52.207864,-0.61]]},{"WaterName":"water_005","Color":["334ccc","204"],"BlendDist":1,"Visible":true,"Corners":[[26.369429,6.870495,-6.385081],[26.369429,9.870134,-6.338464],[23.369429,9.870134,-6.338464]]}]}');
}


function actionFun() {
  //进入水面编辑状态
  BlackHole3D.REbeginWaterEdit();
  //退出水面编辑状态
  BlackHole3D.REendWaterEdit();
  //进入水面添加状态 
  BlackHole3D.REbeginAddWaterRgn();
  //退出水面添加状态
  BlackHole3D.REendAddWaterRgn();
  //创建水面对象 （使用参数进行创建,部分参数可以不传）
  const re_waterID_005 = 'water_005';
  var re_water_info_005 = {
    re_CornersSet: [
      [17, 58, -3],
      [17, 61, -3],
      [14, 61, -3],
    ],//水面点坐标集合 至少有三个点构成一个平面 [vec3,vec3,vec3]
    re_ColorHEX:'334ccc',//水面颜色 十六进制 HEX
    re_Alpha:204,//水面透明度  取值范围 0~255，0表示全透明，255表示不透明
    // re_BlendDist:1,//混合距离  取值范围 0-1
    // re_Visible:true,//是否可见
  };
  BlackHole3D.REcreateWaterRgn(re_waterID_005, re_water_info_005);
  //删除指定 ID 水面
  BlackHole3D.REdelWaterByID('water_004');
  //清空全部水面对象
  BlackHole3D.REdelAllWaters();
  //获取所有水面对象的名称
  BlackHole3D.REgetAllWaterIDs();
  //通过水面 ID 把水面加入选择集
  BlackHole3D.REaddWaterToSelSet('water_004');
  //通过水面 ID 把指定水面移出选择集
  BlackHole3D.REremoveWaterFromSelSet('water_004');
  //清空选择集
  BlackHole3D.REclearWaterSelSet();
  //获取选择集中的所有水面 ID 
  BlackHole3D.REgetAllWaterIDInSelSet();
  //删除当前选中的水面角点
  BlackHole3D.REdelWaterCornersInSelSet();
  //获取指定水面对象的可见性
  BlackHole3D.REgetWaterVisible('water_004');
  //设置指定水面对象的可见性
  BlackHole3D.REsetWaterVisible('water_004', true);
  //获取水体颜色 (HEX)
  BlackHole3D.REgetWaterColorHEX('water_004');
  //设置水体颜色 （HEX）
  BlackHole3D.REsetWaterColorHEX('water_004', '334ccc');
  //获取水体透明度
  BlackHole3D.REgetWaterAlpha('water_004');
  //设置水体透明度
  BlackHole3D.REsetWaterAlpha('water_004', 80);
  //获取水体跟模型混合系数
  BlackHole3D.REgetWaterBlendDist('water_004');
  //设置水体跟模型混合系数
  BlackHole3D.REsetWaterBlendDist('water_004', 0.5);
  //获取水面角点
  BlackHole3D.REgetWaterCorners('water_004');
  //设置水面角点
  var re_CornersSet = [
    [17, 58, -3],
    [17, 61, -3],
    [14, 61, -3],
  ]
  BlackHole3D.REsetWaterCorners('water_004', re_CornersSet);
  //通过Json 创建水域对象
  BlackHole3D.REloadWaterFromJSON('{"Waters":[{"WaterName":"MyWater001","Color":["334ccc","204"],"BlendDist":1,"Visible":true,"Corners":[[17,47.136409,-11.528129],[17,50.136409,-11.528129],[14,50.136409,-11.528129]]},{"WaterName":"MyWater002","Color":["33cccc","127"],"BlendDist":0.2,"Visible":true,"Corners":[[28.07652,47.543973,3.214592],[28.07652,50.543973,3.214592],[25.07652,50.543973,3.214592]]},{"WaterName":"Water01","Color":["ff00","255"],"BlendDist":0.5,"Visible":true,"Corners":[[22.172983,25.079871,0],[26.172983,25.079871,0],[26.172983,30.079871,0]]},{"WaterName":"Water02","Color":["ffff0","255"],"BlendDist":1,"Visible":true,"Corners":[[10,0,0],[15,0,0],[15,5,0]]},{"WaterName":"water_0004","Color":["193f4c","255"],"BlendDist":1,"Visible":true,"Corners":[[28.361801,54.391705,-0.61],[30.229191,52.810488,-0.61],[28.219878,52.207864,-0.61]]},{"WaterName":"water_005","Color":["334ccc","204"],"BlendDist":1,"Visible":true,"Corners":[[26.369429,6.870495,-6.385081],[26.369429,9.870134,-6.338464],[23.369429,9.870134,-6.338464]]}]}');
  //把当前场景中所有水域对象导出为一个Json字符串
  BlackHole3D.REserializeWaterToJSON();

}


//添加水面成功回调
function addWaterRgnFinish() {
  //为已添加的水面命名一个唯一名称（ AddWaterRgnFinishEvent 事件监听回调 水面添加成功）
  BlackHole3D.REsetNewAddedWaterID('water_004');
}

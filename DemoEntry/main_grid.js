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

  console.log("======== 添加监听事件");
  document.addEventListener("RealEngineReady", RealBIMInitSys);
  document.addEventListener("RealBIMInitSys", RealBIMLoadMainSce);
  document.addEventListener("RealBIMLoadMainSce", MainSceDown);
  document.addEventListener("RealEngineRenderReady", showCanvas);
  document.addEventListener("RealBIMLoadProgress", LoadingProgress);

  document.addEventListener("RealBIMSelShape", getselshapeinfo);
  document.addEventListener("RealBIMPolyClipping", RealBIMPolyClipping);


  if ((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')) {
    console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
    RealBIMInitSys();
  }
}



//场景初始化，需正确传递相关参数
function RealBIMInitSys() {
  console.log("=========================== 引擎底层初始化完成");
  progressFn(0.5, "RealEngine/WorkerJS Begin Init");

  var workerjspath = "javascript/RealBIMWeb_Worker.js";
  var width = BlackHole3D.canvas.clientWidth; var height = BlackHole3D.canvas.clientHeight;
  var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
  var username = "admin"; var password = "xiyangyang";

  BlackHole3D.REinitSys(workerjspath, width, height, commonurl, username, password);
  BlackHole3D.REsetUseWebCache(false);//是否允许使用浏览器缓存
}

//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce(e) {
  console.log("=========================== 场景初始化完成");
  var isSuccess = e.detail.succeed;

  if (isSuccess) {
    console.log("===========================  场景初始化 --> 成功！！！");
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
    // 设置全局渲染性能控制参数
    BlackHole3D.REsetMaxResMemMB(5500);
    BlackHole3D.REsetExpectMaxInstMemMB(4500);
    BlackHole3D.REsetExpectMaxInstDrawFaceNum(20000000);
    BlackHole3D.REsetPageLoadLev(2);
  } else {
    console.log("===========================  场景初始化 --> 失败！！！");
  }

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(e) {
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
function showCanvas() {
  console.log("=========================== 引擎渲染器初始化完成 ");
  document.getElementById('canvas').style.display = "block";
  BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function LoadingProgress(e) {
  var percent = e.detail.progress; var info = e.detail.info;
  progressFn(percent, info);
}







function getselshapeinfo() {
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






function RealBIMPolyClipping(e) {
  BlackHole3D.REsetElemsValidState("pro01", [], false);//全部置为无效
  BlackHole3D.REsetElemsValidState("pro01", e.detail.elemids, true);//选出的对象置为有效
}










//添加2组轴网
function setgrid() {
  var griddata = [{
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684a6",
    "name": "A",
    "color": "ff0000",
    "alpha": 255,
    "pos": [[-182.65852, 140.81303, 10.0], [-243.75598, 103.65058, 10.0]]
  },
  {
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684b2",
    "name": "1",
    "color": "ff0000",
    "alpha": 255,
    "pos": [[-263.46043, 141.84199, 10.0], [-239.0002, 101.6278, 10.0]]
  }];
  BlackHole3D.REsetGridData("test", griddata)

  var griddata2 = [{
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684a8",
    "name": "2",
    "color": "ff0000",
    "alpha": 255,
    "pos": [[-255.77111, 146.519, 10.0], [-231.31089, 106.30482, 10.0]]
  },
  {
    "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684a9",
    "name": "3",
    "color": "ff0000",
    "alpha": 255,
    "pos": [[-248.0818, 151.19602, 10.0], [-223.62158, 110.98183, 10.0]]
  }];
  BlackHole3D.REsetGridData("test2", griddata2)
}

//添加2组标高
function setlevel() {
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
  BlackHole3D.REsetLevelData("test", leveldata, "pro01")

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
  BlackHole3D.REsetLevelData("test2", leveldata2, "")
}





//轴网数据
function addGrid02() {
  var arrGrid = [
    {
      "guid": "460104fd-81fa-4e5f-bd1c-0346c81d3fb3-000708c9",
      "name": "B-10",
      "color": "ff0000",
      "alpha": 255,
      "pos": [[10.0, 50.0, 0.0],
      [53.0, 7.0, 0.0]]
    },
    {
      "guid": "460104fd-81fa-4e5f-bd1c-0346c81d3fb3-000708bf",
      "name": "B-1",
      "color": "ff0000",
      "alpha": 255,
      "pos": [[-20.0, 20.0, 0.0],
      [23.0, -23.0, 0.0]]
    },
    {
      "guid": "460104fd-81fa-4e5f-bd1c-0346c81d3fb3-00070822",
      "name": "A-1",
      "color": "ff0000",
      "alpha": 255,
      "pos": [[53.0, 7.0, 0.0],
      [23.0, -23.0, 0.0]]
    },
    {
      "guid": "460104fd-81fa-4e5f-bd1c-0346c81d3fb3-00070811",
      "name": "A-10",
      "color": "ff0000",
      "alpha": 255,
      "pos": [[10.0, 50.0, 0.0],
      [-20.0, 20.0, 0.0]]
    }
  ];

  BlackHole3D.REsetGridData("TestGroup", arrGrid);
}



//根据轴网对场景裁剪
function clipByGrid() {
  var re_Info = {
    "arrGridName": [
      "B-1",
      "B-10",
      "A-1",
      "A-10",
    ],
    "vOffset": [0,0,0,0],
    "dMinHeight" :0.0,
    "dMaxHeight" :50.0,
    "bOnlyVisible": true,
    "bIncludeInter": true,
  }

  BlackHole3D.REclipByGrid("pro01","TestGroup",re_Info);
}
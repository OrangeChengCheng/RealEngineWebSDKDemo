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
  // 一个新区域添加完成
  document.addEventListener("NewOBSectionFinish", function(e){addosgb(e.detail.sectionID,e.detail.flatten)});
  // 一个区域脚点拖动结束
  document.addEventListener("MoveOBSectionFinish", function(e){editosgb(e.detail.sectionID,e.detail.flatten)});

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
        "projResName": "res_osgbmerge01",  
        "useNewVer": true,
        "verInfo": 0,
        "useTransInfo": false,
        "transInfo": ""
      },{
        "projName": "pro02",
        "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
        "projResName": "res_taizhou",  
        "useNewVer": true,
        "verInfo": 0,
        "useTransInfo": true,
        "transInfo":[[1.0,1.0,1.0],[0.0,0.0,0.0,1.0],[0.0,1000.0,20.0]]
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
  var proberet = BlackHole3D.REgetCurCombProbeRet();
  console.log(proberet)
}

// 测试拍平区域
function testosgbproj(){
  var projData = [{
                      "regionID": 1,      
                      "projectionHeight": 500,
                      "regionVertex": [[66,-481,29.5],
                                       [63,-650,11],
                                       [257,-642,3.6],
                                       [238,-380,25.27]]
                    },{
                      "regionID": 2,
                      "projectionHeight": -500,
                      "regionVertex": [[-314,-396,41],
                                       [-309,-618,7.1],
                                       [-170,-593,18],
                                       [-198,-394,43]]
                    }];
  BlackHole3D.REsetUnverProjectData(projData);
  BlackHole3D.REremoveUnverProjectData([1]);
  BlackHole3D.REresetUnverProjectData([1]);
  BlackHole3D.REsetUnVerHugeGroupProjToGolShp("pro01", "", 0);
  

  var projName = "pro01";
  var projData = [{
                      "regionID": 1,      
                      "projectionHeight": 500,
                      "regionVertex": [[66,-481,29.5],
                                       [63,-650,11],
                                       [257,-642,3.6],
                                       [238,-380,25.27]]
                    },{
                      "regionID": 2,
                      "projectionHeight": -500,
                      "regionVertex": [[-314,-396,41],
                                       [-309,-618,7.1],
                                       [-170,-593,18],
                                       [-198,-394,43]]
                    }];
  BlackHole3D.REsetLocalProjRgnsInfo(projName, projData);
  BlackHole3D.REsetUnVerHugeGroupProjToLocalShp("pro01", "", 0);
}

// 测试单体化
function testosgbelem(){
  var unverElemData = [{
                "boxID": 1,
                "heightMin": 5,
                "heightMax": 20,
                "boxColor": "00ff00",
                "boxAlpha": 255,
                "pos": [[66,-481,29.5],
                        [63,-650,11],
                        [257,-642,3.6],
                        [238,-380,25.27]]
              },{
                "boxID": 2,
                "heightMin": 5,
                "heightMax": 10,
                "boxColor": "ff0000",
                "boxAlpha": 200,
                "pos": [[-314,-396,41],
                        [-309,-618,7.1],
                        [-170,-593,18],
                        [-198,-394,43]]
              },{
                "boxID": 3,
                "heightMin": 15,
                "heightMax": 25,
                "boxColor": "ff0000",
                "boxAlpha": 200,
                "pos": [[-314,-396,41],
                        [-309,-618,7.1],
                        [-170,-593,18],
                        [-198,-394,43]]
              }
  ];
  BlackHole3D.REsetUnverElemData(unverElemData);

  // 高亮所有单体化区域
  BlackHole3D.REshowUnverElemData([]);
  // 隐藏所有的单体化区域
  BlackHole3D.REhideUnverElemData([]);
  // 添加到选择集
  BlackHole3D.REaddToSelUElemIDs([1]);
  // 从选择集移除
  BlackHole3D.REremoveFromSelUElemIDs([]);
  // 获取当前选择集id
  var selId = BlackHole3D.REgetUnverElemIDs();  
  console.log(selId);
  // 设置选择集的颜色
  var clr = "ffff00"; 
  var alpha = 255; 
  BlackHole3D.REsetSelUnverElemClr(clr,alpha);

}

// 测试编辑功能
function testedit(){
  // 进入osgb编辑状态
  BlackHole3D.REbeginOSGBEdit();
  // 打开编辑窗口
  BlackHole3D.REsetUIWgtVisible("OBEditWnd",true);





  // 结束osgb编辑状态
  BlackHole3D.REendOSGBEdit();
  // 关闭编辑窗口
  BlackHole3D.REsetUIWgtVisible("OBEditWnd",false);
}






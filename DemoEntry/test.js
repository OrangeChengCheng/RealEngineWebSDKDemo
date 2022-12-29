// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
BlackHole3D =typeof BlackHole3D!=="undefined" ? BlackHole3D : {};
BlackHole3D["canvas"] =(function() {
    var canvas = document.getElementById('canvas');
    return canvas;
  })();
BlackHole3DPhone =false; //表示是否使用移动浏览器模式


// 页面加载时添加相关监听事件
window.onload = function(event){
  if(typeof RE2SDKCreateModule != 'undefined'){
    BlackHole3D =RE2SDKCreateModule(BlackHole3D);
  }else{
    document.addEventListener("RealEngineToBeReady", function(){BlackHole3D =RE2SDKCreateModule(BlackHole3D);});
  }
  document.addEventListener("RealEngineReady", RealBIMInitSys);
  document.addEventListener("RealBIMInitSys", RealBIMLoadMainSce);
  document.addEventListener("RealBIMLoadMainSce", MainSceDown);
  document.addEventListener("RealEngineRenderReady", showCanvas);
  document.addEventListener("RealEngineVisibleSwitch", function(e){console.log(e.detail.visible)});
  document.addEventListener("RealBIMSelModel", getselmodelinfo);
  document.addEventListener("RealBIMSelShape", getselshpinfo);
  document.addEventListener("RealBIMUIEvent", function(e){console.log(e.detail.btnname,e.detail.btnstate)});
  document.addEventListener("RealBIMLoadProgress", function(e){LoadingProgress(e.detail.progress,e.detail.info);});
  document.addEventListener("RealBIMPolyClipRet", PolyClipRetFunc);
  document.addEventListener("NewOBSectionFinish", function(e){console.log("NewOBSectionFinish:",e.detail.sectionID,e.detail.flatten)});
  document.addEventListener("MoveOBSectionFinish", function(e){console.log("MoveOBSectionFinish:",e.detail.sectionID,e.detail.flatten)});
  document.addEventListener("AffineTransModeWndClose", function(){console.log("AffineTransModeWndClose:")});
  //document.addEventListener("RealEngineSigReady", function(e){g_re_em_time1 =Date.now(); /*qt_init();*/});
  
  
  if((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')){
    console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
    RealBIMInitSys();
  }
}
//图形窗口改变时，需实时传递给引擎，否则模型会变形
window.onresize = function(event){
    BlackHole3D["m_re_em_window_width"] = window.innerWidth; 
    BlackHole3D["m_re_em_window_height"] = window.innerHeight;
}
// 刷新页面时需要卸载GPU内存
window.onbeforeunload = function(event){ 
  if(typeof BlackHole3D.REreleaseEngine != 'undefined'){
    BlackHole3D.REreleaseEngine();
  }
  if(typeof BlackHole3D.ctx != 'undefined'){
    if(BlackHole3D.ctx.getExtension('WEBGL_lose_context') != null){
      BlackHole3D.ctx.getExtension('WEBGL_lose_context').loseContext();
    }
  }  
};
//获取点击的构件信息
function getselmodelinfo(){
  var proberet = BlackHole3D.REgetCurCombProbeRet();  //获取当前选中点相关参数
  if(proberet.m_strType != "Shape"){
    console.log(proberet);
  }
}
//获取点击的矢量信息
function getselshpinfo() {
  var proberet = BlackHole3D.REgetCurCombProbeRet();  //获取当前选中点相关参数
  if(proberet.m_strType == "Shape"){
    console.log(proberet);
  }
}
//场景初始化，需正确传递相关参数
function RealBIMInitSys(){
	progressFn(0.5, "RealEngine/WorkerJS Begin Init");
  console.log("Listen RealEngineReady!");
  //document.getElementById('loading').style.display="block";
  var workerjspath = "javascript/RealBIMWeb_Worker.js";
  var width = window.innerWidth; var height = window.innerHeight;
  var commonurl = "https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001";
  //var commonurl = "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_gol001";
  //var commonurl = "http://www.bjblackhole.cn:8008/default.aspx?dir=url_res03&path=res_gol001";
  //var commonurl = "http://realbim.bjblackhole.cn:8012/res/res_gol001";
  var username = "admin"; var password = "xiyangyang"; 
  if(BlackHole3DPhone){BlackHole3D['m_re_em_force_threadnum'] =1;} //强制将CPU核心数设为1，以避免浏览器创建多个WebWorker时造成内存耗尽
  //BlackHole3D.RealBIMWeb.AddAURLPathCtrl_AuthorPath("RealEngineInitAuthorPath", "http://realbim.bjblackhole.cn:8012/author/author_path01.txt");
  //BlackHole3D.RealBIMWeb.AddAURLPathCtrl_PathIndex("RealEngineInitPathIndex", "http://realbim.bjblackhole.cn:8012/res/", "http://realbim.bjblackhole.cn:8012/pathindex/res/index.xml");
  BlackHole3D.REinitSys(workerjspath,width,height,commonurl,username,password);
  BlackHole3D.REsetUseWebCache(false);
  BlackHole3D.REsetPreferFPS(true);
  //if(BlackHole3DPhone){BlackHole3D.REsetScreenScale(1.0/window.devicePixelRatio);}
}
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas(){
  console.log("addEventListener RealEngineRenderReady!");
  document.getElementById('canvas').style.display="block";
  BlackHole3D.canvas.focus();
}
//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce(e){
  console.log("Listen RealBIMInitSys["+e.detail.succeed+"]!");
  //BlackHole3D.REsetMouseHoverEventParam(1.0);
  ////BlackHole3D.REsetMouseMoveEventParam(true);
  //document.addEventListener("RealEngineMouseHover", function(e){console.log("RealEngineMouseHover Rev !!!");});
  //document.addEventListener("RealEngineMouseMove", function(e){console.log("RealEngineMouseMove Rev !!!");});



  //var projInfo = [
  //          {
  //            "projName":"pro01",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_longchuang",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo":true,
  //            "transInfo":[[1,1,1],[0,0,0,1],[21001000.123, -20091000.3, 0.0]]
  //          },
		//	      {
  //            "projName":"pro02",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_nanhuiskp",
  //            "useNewVer":false,
  //            "verInfo":0,
  //            "useTransInfo":true,
  //            "transInfo":[[1,1,1],[0,0,0,1],[21001000.123, -20091000.3, 0.0]]
  //            //"transInfo":[[1,1,1],[0,0,0,1],[0.0, 0.0, 0.0]]
  //          }
  //       ];
  //BlackHole3D.REloadMainSce_projs(projInfo);



  //var projInfo = [
  //          {
  //            "projName":"pro01",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_nanhuiskp",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo":true,
  //            "transInfo":[[1,1,1],[0,0,0,1],[19001000.123, -19091000.3, 0.0]]
  //          },
  //          {
  //            "projName":"pro02",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_longchuang",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo":true,
  //            "transInfo":[[1,1,1],[0,0,0,1],[19001000.123, -19091000.3, 0.0]]
  //          }
  //       ];
  //BlackHole3D.REloadMainSce_projs(projInfo);


  //BlackHole3D.REsetEngineWorldCRS("EPSG:900913");
  //crs1 ='PROJCS["CGCS2000_3_Degree_GK_CM_116E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",116.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]';
  //var projInfo = [
  //           {
  //            "projName":"pro01",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_huiyizhongxin",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo":false,
  //            "transInfo":"",
  //            "projCRS":"EPSG:4548",
  //            "projNorth":0.0
  //          },
  //          {
  //            "projName":"pro02",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_116",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo":false,
  //            "transInfo":"",
  //            "projCRS":crs1,
  //            "projNorth":0.0
  //          },
  //           {
  //            "projName":"pro03",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_xiongan_wmts",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo":false,
  //            "transInfo":"",
  //            "projCRS":"EPSG:900913",
  //            "projNorth":0.0
  //          }
  //       ];
  //BlackHole3D.REloadMainSce_projs(projInfo);

  //var projInfo = [
  //           {
  //            "projName":"pro01",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            //"urlRes":"http://engine.bjblackhole.com/autoconvert/engineres/requestengineres?dir=url_res02&path=",
  //            //"urlRes":"https://www.bjblackhole.com/default.aspx?dir=url_res03&path=",
  //            //"urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res03&path=",
  //            //"projResName":"res_train_ref01",
  //            "projResName":"res_train_paths01",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            //"useTransInfo":false, "transInfo":"",
  //            //"useTransInfo":true, "transInfo":[[1,1,1],[0,0,0,1],[36772543.1234, 0.0, 0.0]],
  //            //"useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
  //            "useTransInfo": true, "transInfo": [[1, 1, 1], [0.000000, 0.000000, 0.024650, 0.999696], [1432847.250000, 2515671.000000, 56.616001]],
  //            "projCRS":"",
  //            "projNorth":0.0
  //          },
  //          {
  //            "projName":"pro02",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_train_cars01",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            //"useTransInfo":true, "transInfo":[[1,1,1],[0,0,0,1],[36772543.1234, 0.0, 0.0]],
  //            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
  //            "projCRS":"",
  //            "projNorth":0.0
  //          },
  //          {
  //            "projName":"pro03",
  //            "urlRes":"https://www.bjblackhole.com:15001/default.aspx?dir=url_res02&path=",
  //            "projResName":"26a493a7ad894720972321ffcba3db75",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
  //            "projCRS":"",
  //            "projNorth":0.0
  //          },
  //          {
  //            "projName":"pro04",
  //            "urlRes":"https://www.bjblackhole.com:15001/default.aspx?dir=url_res02&path=",
  //            "projResName":"983ecca369064c858ae76869c3a036e2",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
  //            "projCRS":"",
  //            "projNorth":0.0
  //          }
  //       ];
  //BlackHole3D.REloadMainSce_projs(projInfo);


  //  var projInfo = [
  //           {
  //            "projName":"pro01",
  //            "urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_xiongan_02_rongdong",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
  //            "projCRS":"",
  //            "projNorth":0.0
  //          },
  //           {
  //            "projName":"pro02",
  //            "urlRes":"http://localhost:8008/default.aspx?dir=url_res02&path=",
  //            "projResName":"res_xiongan_cars02",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
  //            "projCRS":"",
  //            "projNorth":0.0
  //          },
  //           {
  //            "projName":"pro03",
  //            "urlRes":"https://isuse.bjblackhole.com/default.aspx?dir=blackhole_res02&path=",
  //            "projResName":"5a4e6763821d42d7a358a953bc4fc534",
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
  //            "projCRS":"",
  //            "projNorth":0.0
  //          }
  //       ];
  //BlackHole3D.REloadMainSce_projs(projInfo);

  
  //arrProjNames =[
  //          "115679f12c694103a5f8c5ad2bc4459f",
		//				"2999448c1c484d2a8683582cb4fb03dd",
		//				"720344102af04c79a5cfe8b6ff0173b0",
		//				"a0a9704b90c045ba95f55b27380da9c9",
		//				"b90f50969e674d0fb19fede009b64b15",
		//				"ba4735c036d14191ade80e71522e49c3",
		//				"bc4355054910475a9c561d5d6514272c",
		//				"c00c233ae7f24b188525a8aabf0c042d",
		//				"d31f0068208b4d9da33d1984b402fa26",
		//				"eef5462675cc4abbadb46fe5d33455ee",
		//				"f538819313054011b2d8c9a3548a71f8",
		//				"fec88a82398c4527a0642013563feaa4"
		//			];
  //projInfo =[];
  //for(var projid =0; projid<arrProjNames.length; ++projid){
  //  projInfo.push({
  //            "projName":"pro"+projid,
  //            "urlRes":"http://61.129.64.154:8080/default.aspx?dir=url_res13&path=",
  //            "projResName":arrProjNames[projid],
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
  //            "projCRS":"",
  //            "projNorth":0.0
  //          });
  //}
  //BlackHole3D.REloadMainSce_projs(projInfo);

//倾斜摄影proj1的测试场景
  var projInfo = [ 
            { 
            "projName":"pro01",
            //"urlRes":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=",
			//"urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
            //"urlRes":"http://realbim.bjblackhole.cn:8010/default.aspx?dir=url_res02&path=",
            //"urlRes":"http://realbim.bjblackhole.cn:8012/res/",
            "urlRes":"https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
            //"urlRes":"https://isuse.bjblackhole.com/default.aspx?dir=blackhole_res14&path=",
			//"urlRes":"http://192.168.31.6:8088/default.aspx?dir=url_res06&path=",
			
            //"projResName":"79f93addc3364efebf802e5177b59de3",
            //"projResName":"e994dfeee9584739a8d6abba08ea57d2",
            //"projResName":"1b3c8109bc714f108a0a0d60747c958d",
            "projResName":"res_jifang",     
			//"projResName":"res_nantong",
			//"projResName":"a0f2e10036574d6b96f5bc97e69553fa",
            "useNewVer":true,
            "verInfo":0,
            "useTransInfo": true, "transInfo": [[1, 1, 1], [0, 0, 0, 1], [0.0, 0.0, 0.0]],
            "projCRS":"",
            "projNorth":0.0
          }
        ];
  BlackHole3D.REloadMainSce_projs(projInfo); 
 
  //电影院模型 + 机房
    // var projInfo = [
     // {
        // "projName": "pro01",
        // "urlRes": "http://192.168.31.6:8088/default.aspx?dir=url_res17&path=",
        // "projResName": "3a05e1e9bd1b13aa951d0ffd659d8183",  //多个节点
        // "useNewVer": true,
        // "verInfo": 0,
        // "useTransInfo": false,
        // "transInfo": ""
      // },{
        // "projName":"pro02",
        // "urlRes":"https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
        // "projResName":"res_jifang",
        // "useNewVer":true,
        // "verInfo":0,
        // "useTransInfo":false,
        // "transInfo":[[1.0,1.0,1.0],[0.0,0.0,0.0,1.0],[0.0,0.0,100.0]]
     // }];
	// BlackHole3D.REloadMainSce_projs(projInfo);


  //var projInfo = [
  //    {// 体育馆模型 Revit
  //            projName: "bim",
  //            projCatalog: 0,
  //            transInfo:[[1.0, 1.0, 1.0],[0.019940, -0.005890, -0.076130, 0.996881],[12192943.997565, 2781545.488907, 98.204286]],
  //            useTransInfo: true,
  //            urlRes: "http://58.48.52.178:8103/default.aspx?dir=url_res02&path=",
  //            projResName: "c8a0c22bf2c14dcc8df1a3b9f981e44b",
  //            useNewVer: true,
  //            verInfo: "",
  //            minLoadDist: 0,
  //            maxLoadDist: 5000000000
  //     },
  //    {// 天地图墨卡托影像**!!! 加载天地图影像，锚点高度不对***
  //        projName: "tdt",
  //        urlRes: "http://58.48.52.178:8103/default.aspx?dir=url_res02&path=",
  //        projResName: "ce4548d2ce0e49178fba4737b36288bc",
  //        useNewVer: true,
  //        verInfo: 0,
  //        useTransInfo: false
  //    }               
  //];
  //BlackHole3D.REloadMainSce_projs(projInfo);
  
  //两个倾斜摄影的集群项目
      // var projInfo = [
      // {
        // "projName": "pro01",
        // "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
        // "projResName": "res_osgbmerge01",  
        // "useNewVer": true,
        // "verInfo": 0,
        // "useTransInfo": false,
        // "transInfo": ""
      // },{
        // "projName": "pro02",
        // "urlRes": "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=",
        // "projResName": "res_taizhou",  
        // "useNewVer": true,
        // "verInfo": 0,
        // "useTransInfo": true,
        // "transInfo":[[1.0,1.0,1.0],[0.0,0.0,0.0,1.0],[0.0,1000.0,20.0]]
      // }
    // ];
	// BlackHole3D.REloadMainSce_projs(projInfo);

  //var crs116 ='PROJCS["CGCS2000_3_Degree_GK_CM_116E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",116.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]';
  //BlackHole3D.REsetEngineWorldCRS(crs116);
  ////var projnames =["00d7a567eee144c8bd1d8cb4dfb5500b", "040f903dbf4f4653a25b6f78c4ab0eab", "09d8634a6b704abfaaca49fcccf11c14", "0d99cf021f824fc9b0cb1290e0384562", "212176ed0c9b48fabcd3d1660ecdc11b", "21aa0980f22c44f49daa1707206eb127", "22448ca93e1c4cccac23576ff526baf2", "260aafd469494ed5bee1f946a985dd03", "320063a46279423d93a7e0063641c6cf", "3d9d6a61379a403194c35e2cd35b0ae4", "40b4d31adc424ed1b27d7f7e2d5a7c1f", "4a17324fdded42c5a676f9500b77e800", "4a8ad8a497a0416ea8effe892ddecb76", "4bb152af0dcd4506936dd0066fd695a3", "51db148d573741b796fddbfa43ff91e1", "5297b032ef004ba6b5d5e50bacef9b89", "5a1d767e91eb4666995bee76f7d63d05", "704f6fc27a9e480db1fc3aaf6b79fc90", "72352e4a02c74478b81b32d21ca45e9d", "7b9a2cb0913b454f8e22204bbee57ec2", "8c10e8f6e3d8492292c1c857f59fc8bf", "8e8a5163e4674afd90a620f756caf2eb", "9a23d4e39ffc411595cceed4f0507fa8", "9bb6737b5220493abcb4036b055e7976", "a7f8291f21b1432cbfeae05123f9e3c2", "ac0b642babf54db0a3f8fcdbfeb2b98d", "afc57ed1c55b4a9189199eb1f077eab9", "b5062b10279247919c400c44c1db097a", "b64a57601060452898954afc9caa92bf", "bdbb315c73884d7787d2c9391cfed09a", "c12f4f752b0840b9a4d3e435eb3f28ea", "c135b0876bde48a89ba4f33a314340db", "c6439b74352f46519d7a69c90d02d6b4", "c83f31cf08b94cbbb902008ffc048135", "ca24a3eb8d0f4649a8638963dc373a4d", "cf96ec783ef940b48ea8fbb531bbe1b0", "da8c64cc7600483da070f6b56a4c794e", "e15c9073f17d4c639810c842e3c4fab2", "e2af2614de5147b6901a8445481f1327", "eb4a037b517243e8a42b0c977289eb44", "ee20ec2dbfc04c658748344b8ac39f79", "f15782a55449432e82291f9a77d84241", "f19acc9e796b4dda87613fb56f736db0", "f378da0a84f14484be86ab134329d9ad", "fe9fca1af7134f8bbd4977e222026936"];
  //var projnames =["00d7a567eee144c8bd1d8cb4dfb5500b", "040f903dbf4f4653a25b6f78c4ab0eab", "09d8634a6b704abfaaca49fcccf11c14", "0d99cf021f824fc9b0cb1290e0384562", "212176ed0c9b48fabcd3d1660ecdc11b", "21aa0980f22c44f49daa1707206eb127", "22448ca93e1c4cccac23576ff526baf2", "260aafd469494ed5bee1f946a985dd03", "320063a46279423d93a7e0063641c6cf", "3d9d6a61379a403194c35e2cd35b0ae4", "40b4d31adc424ed1b27d7f7e2d5a7c1f", "4a17324fdded42c5a676f9500b77e800", "4a8ad8a497a0416ea8effe892ddecb76", "4bb152af0dcd4506936dd0066fd695a3", "51db148d573741b796fddbfa43ff91e1", "5297b032ef004ba6b5d5e50bacef9b89", "5a1d767e91eb4666995bee76f7d63d05", "704f6fc27a9e480db1fc3aaf6b79fc90", "72352e4a02c74478b81b32d21ca45e9d", "7b9a2cb0913b454f8e22204bbee57ec2", "8c10e8f6e3d8492292c1c857f59fc8bf", "8e8a5163e4674afd90a620f756caf2eb", "9a23d4e39ffc411595cceed4f0507fa8", "9bb6737b5220493abcb4036b055e7976", "a7f8291f21b1432cbfeae05123f9e3c2", "ac0b642babf54db0a3f8fcdbfeb2b98d", "afc57ed1c55b4a9189199eb1f077eab9", "b5062b10279247919c400c44c1db097a", "b64a57601060452898954afc9caa92bf", "bdbb315c73884d7787d2c9391cfed09a", "c12f4f752b0840b9a4d3e435eb3f28ea", "c135b0876bde48a89ba4f33a314340db", "c6439b74352f46519d7a69c90d02d6b4", "c83f31cf08b94cbbb902008ffc048135", "ca24a3eb8d0f4649a8638963dc373a4d", "cf96ec783ef940b48ea8fbb531bbe1b0", "da8c64cc7600483da070f6b56a4c794e", "e15c9073f17d4c639810c842e3c4fab2", "e2af2614de5147b6901a8445481f1327", "eb4a037b517243e8a42b0c977289eb44", "ee20ec2dbfc04c658748344b8ac39f79", "f15782a55449432e82291f9a77d84241", "f19acc9e796b4dda87613fb56f736db0", "fe9fca1af7134f8bbd4977e222026936"]; 
  //var projinfos =[];
  //for(var i =0; i<projnames.length; ++i){
  //  projinfos.push(
  //           {
  //            "projName": projnames[i],
  //            "urlRes":"http://rdcimen.hdec.com:8089/default.aspx?dir=url_res02&path=",
  //            "projResName": projnames[i],
  //            "useNewVer":true,
  //            "verInfo":0,
  //            "useTransInfo":false,
  //            "transInfo":"",
  //            "projCRS":crs116,
  //            "projNorth":0.0
  //          });
  //}
  //BlackHole3D.REloadMainSce_projs(projinfos);



  // 设置全局渲染性能控制参数
  if(BlackHole3DPhone){
    BlackHole3D.REsetMaxResMemMB(500);
    BlackHole3D.REsetExpectMaxInstMemMB(400);
    BlackHole3D.REsetExpectMaxInstDrawFaceNum(1000000);
    BlackHole3D.REsetPageLoadLev(2);

    BlackHole3D.REsetShadowState(false);
    BlackHole3D.REsetGhostState(false);
    BlackHole3D.REsetAOState(false);
    BlackHole3D.REsetSceOITLev(0);
    BlackHole3D.REsetInputType(1);
  }else{
    BlackHole3D.REsetMaxResMemMB(5500);
    BlackHole3D.REsetExpectMaxInstMemMB(4500);
    BlackHole3D.REsetExpectMaxInstDrawFaceNum(20000000);
    BlackHole3D.REsetPageLoadLev(2);
  }
  //shadowinfo_temp =BlackHole3D.RealBIMWeb.GetSceShadowInfo();
  //shadowinfo_temp.m_bShadowEnable =false;
  //shadowinfo_temp.m_uShadowMaxDynSMNum =1; shadowinfo_temp.m_uShadowMinDynSMUpdateLen =5; 
  //BlackHole3D.RealBIMWeb.SetSceShadowInfo(shadowinfo_temp);
}


//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(){
	
	//BlackHole3D.RealBIMWeb.SetBuiltInUIColorStyle(1);
  //BlackHole3D.REsetHugeObjBorderLineClr("", "", [0.0,0.0,0.0,1.0]);

  //BlackHole3D.RealBIMWeb.SetHugeObjSubElemShadowCaster("", "", 0xffffffff, 0, true);
  //BlackHole3D.RealBIMWeb.TestCommon01(21, 0xffffffff, 0, 0);

  //BlackHole3D.RealBIMWeb.SetCamProjType(1);


  ////初始化所有车辆
  //g_re_gpuranim_valid =1;
  //var trainnum =BlackHole3D.REtrain_GetTrainNum(); var pathnum =BlackHole3D.REtrain_GetPathNum();
  //var pathbias =[]; for(i =0; i<pathnum; ++i){pathbias.push(0.0);}
  //var curpath =0; 
  //for(i =0; i<trainnum; ++i){
  //  if(pathbias[curpath] > BlackHole3D.REtrain_GetPathLen(curpath)-BlackHole3D.REtrain_GetTrainLen(i)-20.0){++curpath;}
  //  if(curpath >= pathnum){break;}
	 // BlackHole3D.REtrain_PlayTrain_Repeat(i, curpath, 15.0, 0.0, BlackHole3D.REtrain_GetPathLen(curpath)-BlackHole3D.REtrain_GetTrainLen(i)-10.0, pathbias[curpath], true);
  //  pathbias[curpath] +=15.0+Math.random()*20.0;
  //}


  ////禁用所有车辆
  //g_re_gpuranim_valid =0;
  //var trainnum =BlackHole3D.REtrain_GetTrainNum(); var pathnum =BlackHole3D.REtrain_GetPathNum();
  //for(i =0; i<trainnum; ++i){
	 // BlackHole3D.REtrain_PlayTrain(i, 0, 15.0, 0.0, 0.0, true, 0);
	 // BlackHole3D.REtrain_SetTrainVisible(i, false);
  //}



  console.log("Listen RealBIMLoadMainSce!");
}


//多边形场景裁剪的消息响应函数
function PolyClipRetFunc(e){
  console.log(e.detail);
}

function OnNewOBSectionCreateComplete(e)
{
	console.log(e.detail.sectionID, e.detail.flatten);
}

function LoadingProgress(percent,info){
  progressFn(percent, info);
  //console.log("Load["+percent+"]["+info+"]");
}

// 添加带牵引线的锚点
function maodian(){
  //var ancinfo =[
  //              {
  //                "ancname":"anc01", 
  //                "pos":[36774915.952, 2700.646, -7.820],
  //                "picpath":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_temp/red/icon-其他.png",
  //                "textinfo":"未拆迁",
  //                "picwidth":32,
  //                "picheight":32,
  //                "uselod":false,
  //                "linepos":[0,0],
  //                "lineclr":0x00000000,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
  //                "selfautoscaledist":-1,
  //                "selfvisdist":1000,
  //                "selfAutoScaleDist":5000.0,
  //                "selfVisDist":1000000.0,
  //                "animObjName":"TrainAnim",
  //                "animBoneID":22,
  //                "texfocus":[16,0],
  //                "fontname":"RealBIMFont001",
  //                "textcolor":0xffffffff,
  //                "textbordercolor":0x80000000
  //              },{
  //                "ancname":"anc02", 
  //                "pos":[36774915.952, 2700.646, -7.820],
  //                "picpath":"http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_temp/red/icon-其他.png",
  //                "textinfo":"未拆迁",
  //                "picwidth":32,
  //                "picheight":32,
  //                "uselod":false,
  //                "linepos":[0,0],
  //                "lineclr":0x00000000,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
  //                "selfautoscaledist":-1,
  //                "selfvisdist":1000,
  //                "selfAutoScaleDist":5000.0,
  //                "selfVisDist":1000000.0,
  //                "animObjName":"TrainAnim",
  //                "animBoneID":27,
  //                "texfocus":[16,0],
  //                "fontname":"RealBIMFont001",
  //                "textcolor":0xffffffff,
  //                "textbordercolor":0x80000000
  //              }
  //             ];
  //BlackHole3D.REaddAnchors(ancinfo);




    //BlackHole3D.REsetAnchorLODInfo(10, true, [[-500,-500,-100],[500,500,100]], 300, 10, "http://realbim.bjblackhole.cn:8008/test/css/img/anclod.png", 32, 32);
    ////BlackHole3D.REsetAnchorLODInfo(10, false, [], 300, 10, "http://realbim.bjblackhole.cn:8008/test/css/img/anclod.png", 32, 32);
    //var ancinfo =[];
    //for (i = 0; i < 20; ++i) {
    //    for (j = 0; j < 20; ++j) {
    //        ancinfo.push({
    //            "ancname": "anc[" + i + "," + j + "]",
    //            "pos": [-500.0 + 1000.0 * i / 20, -500.0 + 1000.0 * j / 20, 0.0],
    //            "picpath": "http://realbim.bjblackhole.cn:8008/test/css/img/tag.png",
    //            "textinfo": "未拆迁",
    //            "picwidth": 32,
    //            "picheight": 32,
    //            "uselod": true,
    //            "linepos": [0, 60],
    //            "lineclr": 0xff0000ff,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
    //            "ancsize": 10.0,
    //            "selfautoscaledist": -1,
    //            "selfvisdist": 10000.0,
    //            "textbias": [1, 0],
    //            "texfocus": [16, 0],
    //            "fontname": "RealBIMFont001",
    //            "textcolor": 0xffffffff,
    //            "textbordercolor": 0x80000000
    //        });
    //    }
    //}
    //BlackHole3D.REaddAnchors(ancinfo);



}
// 设置锚点聚合,锚点数量多的时候效果比较明显
function anchortest(){
  var lodLevel = 10;
  var useCustomBV = false;
  var customBV = [];
  var mergedist = 10;
  var minMergeNum = 1;
  var strMergeTexPath = "http://realbim.bjblackhole.cn:8008/test/css/img/anclod.png";
  var texWidth = 64;
  var texHeight = 64;
  BlackHole3D.REsetAnchorLODInfo(lodLevel,useCustomBV,customBV,mergedist,minMergeNum,strMergeTexPath,texWidth,texHeight)
}

// 添加文字对象示例
function addText(){
  BlackHole3D.REcreateCustomTextShp("text01","提示文字",[393,-130,-3.5], "",0xff000000,0xff00ffff,100000);
}
// 添加多段线对象示例
function addLine(){
  BlackHole3D.REcreateCustomPolyline("line01",[[393,-130,-3.5],[562,-130,-3.5],[620,-130,-3.5]],0xff000000,100000);
}
// 添加矢量面对象示例
function addRgn(){
  BlackHole3D.RECreateCustomPolyRgn("rgn01",[[467,-1.3,-3.5],[450,-125,-3.5],[645,-127,-3.5]],0xff0000ff,100000);
}

// 设置模型的加载/卸载距离
function setloaddist(){
  BlackHole3D.REsetMainSceAutoLoadDist("pro01",5000,5300);
  BlackHole3D.REsetMainSceAutoLoadDist("pro02",2000,2200);
}

// 设置地形的高程投影到平面上
function projUnverSceToHeight(){
  BlackHole3D.REprojUnVerHugeGroupToHeight("pro01","<hugemodel><test>_unver",2,0);
  BlackHole3D.REprojUnVerHugeGroupToHeight("pro01","<hugemodel><test>_unver",0,0);
}


//拍平2个区域pro01
function paiping01(){
var projectdata = [{
  "regionID": 11,
  "projectionHeight": 28,
  "regionVertex": [{
                  "rvX": -85,
                  "rvY": -55,
                  "rvZ": 27
                }, {
                  "rvX": -18,
                  "rvY": -50,
                  "rvZ": 28
                }, {
                  "rvX": -22,
                  "rvY": 34,
                  "rvZ": 27
                }, {
                  "rvX": -98,
                  "rvY": 43,
                  "rvZ": 32
                }]
},{
  "regionID": 12,
  "projectionHeight": 28,
  "regionVertex": [{
                    "rvX": -12, 
                    "rvY": -19, 
                    "rvZ": 27
                }, 
                {
                    "rvX": 67, 
                    "rvY": -35, 
                    "rvZ": 27
                }, 
                {
                    "rvX": 53, 
                    "rvY": 50, 
                    "rvZ": 28
                }, 
                {
                    "rvX": -17, 
                    "rvY": 37, 
                    "rvZ": 28
                }]
}];
BlackHole3D.REsetLocalProjRgnsInfo("pro01", projectdata);
}



//拍平2个区域pro02
function paiping02(){
var projectdata = [{
  "regionID": 21,
  "projectionHeight": -100,
  "regionVertex": [{
                    "rvX": -85,
                    "rvY": -125,
                    "rvZ": -100
                  }, {
                    "rvX": -85,
                    "rvY": -160,
                    "rvZ": -100
                  }, {
                    "rvX": 4,
                    "rvY": -160,
                    "rvZ": -100
                  }, {
                    "rvX": 4,
                    "rvY": -125,
                    "rvZ": -100
                  }]
},{
  "regionID": 22,
  "projectionHeight": -100,
  "regionVertex": [{
                    "rvX": -85, 
                    "rvY": 32, 
                    "rvZ": -100
                }, 
                {
                    "rvX": 21, 
                    "rvY": 33, 
                    "rvZ": -100
                }, 
                {
                    "rvX": 21, 
                    "rvY": 91, 
                    "rvZ": -100
                }, 
                {
                    "rvX": -86, 
                    "rvY": 95, 
                    "rvZ": -100
                }]
}];
BlackHole3D.REsetLocalProjRgnsInfo("pro02", projectdata);
}




//创建自定义矢量01
function customshp01(){
  var arrPots =[
    [21001559.75060378, -20091037.177998625, -3.53481759008978], 
		[21001559.804146506, -20091020.742508937, -3.534819487695543], 
		[21001556.62521952, -20091015.434710402, -3.535072640479207], 
		[21001539.664617974, -20091013.005593244, -3.53507184860268], 
		[21001531.680727087, -20091035.878917348, -1.34154536465282], 
		[21001548.01155875, -20091023.784406953, -3.534515200947073],
		[21001555.416419413, -20091041.657161415, -3.5348201403919006]];
  var textinfo ={
    "textinfo":"未拆迁",
    "textbias":[1,0],
    "fontname":"RealBIMFont001",
    "textcolor":0xffffffff,
    "textbordercolor":0x80000000
  };
  var addlineShpBool = BlackHole3D.REaddCustomPolylineShp("shp001", arrPots, 1, 0xffffffff, 0x80ffff00, 2.5, textinfo, -1.0, 300.0, true);
  var addposShpBool = BlackHole3D.REaddCustomPotShp("shp002", [21001560.75060378, -20091037.177998625, -3.53481759008978], 4, 0xff0000ff, textinfo, -1.0, 300.0);
}

//创建自定义矢量02
function customshp02(){
  var textinfo ={
    "textinfo":"未拆迁",
    "textbias":[1,0],
    "fontname":"RealBIMFont001",
    "textcolor":0xffffffff,
    "textbordercolor":0x80000000,
    "textbackmode":2, "textbackborder":2, "textbackclr":0x80000000,
  };
  BlackHole3D.REaddCustomPotShp("shp002", [0.0, 0.0, 0.0], 4, 0xff0000ff, textinfo, -1.0, -1.0, false);
}


//创建自定义矢量02
function customshp03(){
  var re_Info = {
    "vPos": [5.394, 14.598, 0.0],
    "uPotSize": 4,
    "potColor": "ff0000",
    "potClrAlpha": 255,
    "cTextInfo": {
      "textinfo": "未拆迁",
      "textbias": [1, 0],
      "fontname": "RealBIMFont001",
      "textcolor": "ffffff",
      "textAlpha": 255,
      "textbordercolor": "000000",
      "textborderAlpha": 204,
      "textbackmode": 2, "textbackborder": 2,
      "textbackclr": "000000",
      "textbackAlpha": 204,
    },
    "fASDist": -1.0,
    "fVisDist": -1.0,
    "bContactSce": false,
  }

  var addposShpBool = BlackHole3D.REaddPotShp("shp002", re_Info);
  console.log(addposShpBool);
}

function customshp04() {
  var shpName = "shp001";
  var re_Info = {
    "arrPots": [[15.821551318975999, 17.619940136002967, 0.000018728150966040857],
    [15.821551745332034, 18.969940110334004, 0.00001945166156147593],
    [13.771586103520088, 17.619892309623157, -0.00000452473561729505]],
    "uFillState": 1,
    "lineColor": "ff0000",
    "lineClrAlpha": 255,
    "fillColor": "ffffff",
    "fillClrAlpha": 128,
    "fTextPos": -2,
    "cTextInfo": {
      "textinfo": "测试画线",
      "textbias": [1, 0],
      "fontname": "RealBIMFont001",
      "textcolor": "ffffff",
      "textAlpha": 255,
      "textbordercolor": "000000",
      "textborderAlpha": 128,
      "textbackmode": 2,
      "textbackborder": 2,
      "textbackclr": "000000",
      "textbackAlpha": 128,
    },
    "fASDist": -1.0,
    "fVisDist": 300.0,
    "bContactSce": 0,
    "uLineWidth": 2,
  }

  var addlineShpBool = BlackHole3D.REaddPolylineShp(shpName, re_Info);
  console.log(addlineShpBool);
}


function customshp05() {
  var projName = "pro01";
  var objArr = [684, 685, 686, 687];
  var arrPots = [[21001559.75060378, -20091037.177998625, -3.53481759008978],
    [21001559.804146506, -20091020.742508937, -3.534819487695543],
    [21001556.62521952, -20091015.434710402, -3.535072640479207],
    [21001539.664617974, -20091013.005593244, -3.53507184860268],
    [21001531.680727087, -20091035.878917348, -1.34154536465282],
    [21001548.01155875, -20091023.784406953, -3.534515200947073],
    [21001555.416419413, -20091041.657161415, -3.5348201403919006]];
  var potsNotInElems = BlackHole3D.REgetPotsNotInElems(projName, objArr, arrPots);
  console.log(potsNotInElems);
}


//测试锚点
function testanchors01(){
    // 添加100个两种类型的锚点
      var arrancinfo = [];
      for (var i = 0; i < 10; ++i) {
        for (var j = 0; j < 10; ++j) {
          var ancName = (i * 100 + j).toString();
          var pos = (j % 2 == 0) ? [400 + i * 40, -100 + j * 40, 0] : [400 + i * 40, 200 + j * 40, 0];
          // var pos = [400 + 40, -100 +  40, 0] ;
          var groupName = (j % 2 == 0) ? "group01" : "group02";
          var picPath = (j % 2 == 0) ? "https://www.bjblackhole.com/demopage/examplesImgs/tag.png" : "https://www.bjblackhole.com/demopage/examplesImgs/anc.png";
          var textInfo = "标记" + (i * 100 + j).toString();
          var picWidth = 32; var picHeight = 32; var useLod = true;
          var linePos = [0, 50]; var lineClr = 0xff00ff00; var ancSize = 60;
          var selfAutoScaleDist = -1; var selfVisDist = -1; var textBias = [1, 0]; var textFocus = [5, 2];
          var fontName = "RealBIMFont001"; var textColor = 0xffffffff; var textBorderColor = 0x80000000;
          var tempanc = {
            "groupName": groupName,
            "ancName": ancName,
            "pos": pos,
            "picPath": picPath,
            "textInfo": textInfo,
            "picWidth": picWidth,
            "picHeight": picHeight,
            "useLod": useLod,
            "linePos": linePos,
            "lineClr": lineClr,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
            "ancSize": ancSize,
            "selfAutoScaleDist": selfAutoScaleDist,
            "selfVisDist": selfVisDist,
            "textBias": textBias,
            "textFocus": textFocus,
            "fontName": fontName,
            "textColor": textColor,
            "textBorderColor": textBorderColor
          };
          arrancinfo.push(tempanc);
        }
      }
      // console.log(arrancinfo)
      BlackHole3D.REaddAnchors(arrancinfo);
}

//测试锚点
function testanchors02(){
  var ancinfo =[
                {
                  "groupName": "TrainAnchors",
                  "ancName": "anc01",
                  "pos": [1432847.250000, 2515671.000000, 56.616001],
                  //"pos": [2012.89549999904,2315.45749994267,-7.91955285593042],
                  "picPath": "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_temp/pics/sign3.png",
                  "textInfo": "",
                  "picWidth": 32,
                  "picHeight": 32,
                  "useLod": false,
                  "linePos": [0,0],
                  "lineClr": 0x00000000,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
                  "ancSize": 5.0,
                  "selfAutoScaleDist":10000.0,
                  "selfVisDist":1000000.0,
                  "animObjName":"TrainAnim",
                  "animBoneID":BlackHole3D.REtrain_GetTrainAnchorBoneID(0),
                  "textBias": [1,0],
                  "textFocus": [16,0],
                  "fontName": "RealBIMFont001",
                  "textColor": 0xffffffff,
                  "textBorderColor": 0x80000000
                },{
                  "groupName": "TrainAnchors",
                  "ancName": "anc02",
                  "pos": [1432847.250000, 2515671.000000, 56.616001],
                  //"pos": [2012.89549999904,2315.45749994267,-7.91955285593042],
                  "picPath": "http://realbim.bjblackhole.cn:8008/default.aspx?dir=url_res02&path=res_temp/pics/sign3.png",
                  "textInfo": "",
                  "picWidth": 32,
                  "picHeight": 32,
                  "useLod": false,
                  "linePos": [0,0],
                  "lineClr": 0x00000000,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
                  "ancSize": 5.0,
                  "selfAutoScaleDist":10000.0,
                  "selfVisDist":1000000.0,
                  "animObjName":"TrainAnim",
                  "animBoneID":BlackHole3D.REtrain_GetTrainAnchorBoneID(1),
                  "textBias": [1,0],
                  "textFocus": [16,0],
                  "fontName": "RealBIMFont001",
                  "textColor": 0xffffffff,
                  "textBorderColor": 0x80000000
                }
               ];
  BlackHole3D.REaddAnchors(ancinfo);
}










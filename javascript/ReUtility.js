//版本：v2.1.0.1611
var RE2SDKCreateModule =function(ExtModule){

  ExtModule = ExtModule || {};
  var Module=typeof ExtModule!=="undefined" ? ExtModule : {};

  CreateModuleRE2(ExtModule).then(instance => {
    ExtModule = instance;
  }); //创建引擎模块

//场景初始化
Module.REinitSys = function(strWorkerjsPath,uWidth,uHeight,strCommonUrl,strUserName,strPassWord){
  var _bPhoneMode =false;
  if(_bPhoneMode){
    Module['m_re_em_force_threadnum'] =1; //强制将CPU核心数设为1，以避免浏览器创建多个WebWorker时造成内存耗尽
  }else{
    Module['m_re_em_force_threadnum'] =8;
  }
  Module["m_re_em_window_width"] = uWidth; 
  Module["m_re_em_window_height"] = uHeight;
  var bool =Module.RealBIMWeb.CreateEmuMgr(strWorkerjsPath,"BlackHole",uWidth, uHeight, 
                                  false, 500, "", strCommonUrl, "/ModuleDir/TempFile/", "/WebCache0001/", 
                                  strUserName, strPassWord);
  if(_bPhoneMode){
    Module.REsetSkyAtmActive(false);
    Module.REsetReflState(false);
    Module.REsetShadowState(false);
    Module.REsetGhostState(false);
    Module.REsetAOState(false);
    Module.REsetSceOITLev(0);
  }
  return bool;
}

//获取当前js版本
Module.REgetJsVersion = function(){
  var ver =Module.RealBIMWeb.GetRealEngineVersion();
  return ver;
}

//设置渲染时引擎最大允许的内存占用空间(以MB为单位)
Module.REsetMaxResMemMB = function(val){
  Module.RealBIMWeb.SetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK, val);
}
//获取渲染时引擎最大允许的内存占用空间(以MB为单位)
Module.REgetMaxResMemMB = function(){
  var val =Module.RealBIMWeb.GetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK);
  return val;
}
//设置渲染时引擎建议分配的内存空间(以MB为单位)
Module.REsetExpectMaxInstMemMB = function(val){
  Module.RealBIMWeb.SetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, val);
}
//获取渲染时引擎建议分配的内存空间(以MB为单位)
Module.REgetExpectMaxInstMemMB = function(){
  var val =Module.RealBIMWeb.GetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
  return val;
}
//设置模型每帧最大渲染面数
Module.REsetExpectMaxInstDrawFaceNum = function(val){
  Module.RealBIMWeb.SetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, val);
}
//获取模型每帧最大渲染面数
Module.REgetExpectMaxInstDrawFaceNum = function(){
  var val =Module.RealBIMWeb.GetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
  return val;
}
//设置页面调度等级
Module.REsetPageLoadLev = function(val){
  Module.RealBIMWeb.SetPageLoadLev(val);
}
//获取页面调度等级
Module.REgetPageLoadLev = function(){
  var val =Module.RealBIMWeb.GetPageLoadLev();
  return val;
}
//设置每帧允许的最大资源加载总数
Module.REsetTotalResMaxLoadNum = function(val){
  if(val==0){
    Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0);
  }else if(val==1){
    Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0xffffffff);
  }
}
//获取每帧允许的最大资源加载总数
Module.REgetTotalResMaxLoadNum = function(){
  var val =Module.RealBIMWeb.GetTotalResMaxLoadNumPerFrame();
  return val;
}
//刷新场景数据
Module.RErefreshMainData = function(bLoadNewData){
  Module.RealBIMWeb.RefreshMainData(bLoadNewData);
}
  
//设置当前的操作模式(0:鼠标操作操作 1:触控操作)
Module.REsetInputType = function(uInputType){
  Module.RealBIMWeb.SetInputType((uInputType == 0) ? Module.RE_INPUT_TYPE.MOUSE : Module.RE_INPUT_TYPE.TOUCH);
}
//获取当前的操作模式(0:鼠标操作操作 1:触控操作)
Module.REgetInputType = function(){
  var _type =Module.RealBIMWeb.GetInputType();
  return (_type == Module.RE_INPUT_TYPE.MOUSE) ? 0 : 1;
}
//设置物理屏幕分辨率的缩放系数
Module.REsetScreenScale = function(fScale){
  Module.RealBIMWeb.SetScreenScale(fScale);
}
//获取物理屏幕分辨率的缩放系数
Module.REgetScreenScale = function(){
  return Module.RealBIMWeb.GetScreenScale();
}

//场景加载
Module.REloadMainSce = function(urlRes,projResName,verInfo,projName){
  var _projname = "DefaultProj"; if(typeof projName != 'undefined'){_projname = projName;}
  // var bool =Module.RealBIMWeb.LoadMainSce(urlRes, 
  //                                 "!(DefaultResRootDir)"+projResName+"/total.xml", 
  //                                 "!(RealBIMTempFileCache)/cam001.camera", false);
  Module.RealBIMWeb.LoadMainSceExt(_projname, true, "", 0.0, urlRes+projResName+"/total.xml",[1,1,1], [0,0,0,1], [0,0,0], 1e30, 1e30,
                                     urlRes, "", false);
  var intprojid = Module.RealBIMWeb.ConvGolStrID2IntID(_projname);
  if(verInfo==""){
    _ver ={m_sVer0:0x7fffffff, m_sVer1:-1, m_uVer0GolIDBias_L32:0, m_uVer0GolIDBias_H32:intprojid, m_uVer1GolIDBias_L32:0, m_uVer1GolIDBias_H32:0};
  }else{
    _ver ={m_sVer0:verInfo, m_sVer1:-1, m_uVer0GolIDBias_L32:0, m_uVer0GolIDBias_H32:intprojid, m_uVer1GolIDBias_L32:0, m_uVer1GolIDBias_H32:0};
  }
  Module.RealBIMWeb.SetSceVersionInfoExt(_projname,_ver);
}

//多个场景加载
//加载多个场景时，必须以第一个为主场景，加载主场景时会把前边的场景清空
// projInfo = [
//             {
//               "projName":"proj01",
//               "urlRes":"https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=",
//               "projResName":"res_test1",
//               "useNewVer":true,
//               "verInfo":0,
//               "useTransInfo":false,
//               "transInfo":"",
//               "minLoadDist"1000, 
//               "maxLoadDist":5000
//             },{
//               "projName":"proj02",
//               "urlRes":"https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=",
//               "projResName":"res_test2",
//               "useNewVer":true,
//               "verInfo":0,
//               "useTransInfo":false,
//               "transInfo":"",
//               "minLoadDist":-10,
//               "maxLoadDist":-50
//             }
//            ]
Module.REloadMainSce_projs = function(projInfo,preclear){
  var _l = projInfo.length; 
  for(var i=0; i<_l; ++i){
    var _defMainProjResRoot = ((i==0) ? projInfo[i].urlRes : ""); var _defMainProjCamFile = ""; 
    var _deftransinfo = [[1,1,1],[0,0,0,1],[0,0,0]];
    var _isMainProj = false;
    var _projCRS ="";
    var _projNorth =0.0;
    var _useCamPost = false;
    var _minLoadDist = 1e30;
    var _maxLoadDist = 1e30;
    var intprojid = Module.RealBIMWeb.ConvGolStrID2IntID(projInfo[i].projName);
    var _ver = {m_sVer0:0x7fffffff, m_sVer1:-1, m_uVer0GolIDBias_L32:0, m_uVer0GolIDBias_H32:intprojid, m_uVer1GolIDBias_L32:0, m_uVer1GolIDBias_H32:0};
    _isMainProj = (((((typeof preclear == 'undefined') || preclear) && (i==0))) ? true : false);
    if(typeof projInfo[i].projCRS != 'undefined'){_projCRS =projInfo[i].projCRS;}
    if(typeof projInfo[i].projNorth != 'undefined'){_projNorth =projInfo[i].projNorth;}
    if(!projInfo[i].useNewVer){
      _verInfo = projInfo[i].verInfo;
      _ver = {m_sVer0:_verInfo, m_sVer1:-1, m_uVer0GolIDBias_L32:0, m_uVer0GolIDBias_H32:intprojid, m_uVer1GolIDBias_L32:0, m_uVer1GolIDBias_H32:0};
    }
    if(projInfo[i].useTransInfo){_deftransinfo = projInfo[i].transInfo;}
    if((typeof projInfo[i].minLoadDist != 'undefined')&&(projInfo[i].minLoadDist!=0)){_minLoadDist = projInfo[i].minLoadDist;}
    if((typeof projInfo[i].maxLoadDist != 'undefined')&&(projInfo[i].maxLoadDist!=0)){_maxLoadDist = projInfo[i].maxLoadDist;}
    Module.RealBIMWeb.LoadMainSceExt(projInfo[i].projName, _isMainProj, _projCRS, _projNorth, projInfo[i].urlRes+projInfo[i].projResName+"/total.xml",
                                     _deftransinfo[0], _deftransinfo[1], _deftransinfo[2], _minLoadDist, _maxLoadDist,
                                     _defMainProjResRoot, _defMainProjCamFile, _useCamPost);
    var verbool =Module.RealBIMWeb.SetSceVersionInfoExt(projInfo[i].projName,_ver);
  }
}

// 项目集设置单项目的位置偏移
// 表示要处理的项目名称，为空串则表示处理所有项目
// 表示偏移信息（缩放旋转平移）[[1,1,1],[0,0,0,1],[0,0,0]]
Module.REsetMainSceTransform = function(projName,transInfo){
  var _transinfo={
    m_vScale:transInfo[0], m_qRotate:transInfo[1], m_vOffset:transInfo[2]
  }
  return Module.RealBIMWeb.SetMainSceTransform(projName,_transinfo);
}
// 项目集获取设置的单项目的位置偏移信息
Module.REgetMainSceTransform = function(projName){
  var _transinfo =Module.RealBIMWeb.GetMainSceTransform(projName);
  return [_transinfo.m_vScale, _transinfo.m_qRotate, _transinfo.m_vOffset];
}
//设置项目的自动加载/卸载距离阈值
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//vDist：<x,y>分别表示项目资源的最小/最大加载渲染距离阈值(>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，绝对值>1e20表示相机拉近/拉远后永不卸载)
Module.REsetMainSceAutoLoadDist = function(projName,minLoadDist,maxLoadDist){
  var distinfo=[minLoadDist,maxLoadDist];
  Module.RealBIMWeb.SetMainSceAutoLoadDist(projName,distinfo);
}
// 获取单项目的最大/最小加载距离阈值
Module.REgetMainSceAutoLoadDist = function(projName){
  return Module.RealBIMWeb.GetMainSceAutoLoadDist(projName);
}

// 获取当前加载的所有项目名称
Module.REgetAllMainSceNames = function(){
  var tempArr =Module.RealBIMWeb.GetAllMainSceNames();
  var nameArr = [];
  for(i =0; i<tempArr.size(); ++i){
    nameArr.push(tempArr.get(i));
  }
  return nameArr;
}
//卸载一个场景
Module.REunloadMainSce = function(projName){
  Module.RealBIMWeb.UnLoadMainSce(projName);
}
// 卸载所有场景
Module.REunloadAllMainSce = function(){
  var tempArr =Module.RealBIMWeb.GetAllMainSceNames();
  for(i =0; i<tempArr.size(); ++i){
    var tempProjName = tempArr.get(i);
    Module.RealBIMWeb.UnLoadMainSce(tempProjName);
  }
}
//退出引擎界面
//bClearWebWorker：表示是否要清除引擎相关WebWorker资源
Module.REreleaseEngine = function(bClearWebWorker){
  var _bClearWebWorker =false; if(typeof bClearWebWorker != 'undefined'){_bClearWebWorker = bClearWebWorker;}
  Module.RealBIMWeb.ReleaseEmuMgr(_bClearWebWorker);
}

//相机定位到构件ID集合
Module.REfocusCamTo = function(objArr,backDepth,projName){
  var _projname = "DefaultProj"; if(typeof projName != 'undefined'){_projname = projName;}
  var _s = objArr.length;
  var _s01 = (_s*8).toString();
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projname);
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = objArr[i];
    elemIds.set([eleid,projid], i*2);
  }
  Module.RealBIMWeb.FocusCamToSubElems("","",elemIds.byteLength,elemIds.byteOffset,backDepth); //backdepth表示相机后退的强度，可设置
}
//相机定位到构件ID集合多个项目
// projIdInfo = [
//               {"projName":"test1","objarr":[1,2,3]},
//               {"projName":"test2","objarr":[1,2,3]}
//              ]
Module.REfocusCamTo_projs = function(projIdInfo,backDepth){
  var obj_s = 0;
  var _offset=0;
  for(var i=0;i<projIdInfo.length;++i){
    obj_s += projIdInfo[i].objarr.length;
  }
  var _s01 = (obj_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(var i=0;i<projIdInfo.length;++i){
    var projname = projIdInfo[i].projName;
    var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projname);
    var tempobjarr = projIdInfo[i].objarr;
    for(var j=0;j<tempobjarr.length;++j){
      var eleid = tempobjarr[j];
      elemIds.set([eleid,projid],_offset);
      _offset+=2;
    }
  }
  Module.RealBIMWeb.FocusCamToSubElems("","",elemIds.byteLength,elemIds.byteOffset,backDepth); //backdepth表示相机后退的强度，可设置
}
//相机定位到场景节点
Module.REfocusCamToSce = function(projName,sceName,backDepth){
  var _projname = "";
  if(typeof projName != 'undefined'){_projname = projName;}
  Module.RealBIMWeb.FocusCamToSubElems(_projname,sceName,0,0,backDepth); //backdepth表示相机后退的强度，可设置
}

//由世界空间坐标转换到屏幕空间坐标
//vWorldPos：表示世界空间坐标
//返回值：<屏幕空间像素坐标x,屏幕空间像素坐标y,设备深度z>，当x/y超过窗口边界或z超过区间[0,1]时表示vWorldPos在屏幕上不可见
Module.REworldPosToScreenPos = function(vWorldPos){
  var vTempScreenPos = Module.RealBIMWeb.WorldPosToScreenPos(vWorldPos, 1e20);
  var vScreenPos = []; vScreenPos.push(vTempScreenPos[0],vTempScreenPos[1],vTempScreenPos[2]); 
  return vScreenPos;
}
//由世界空间坐标转换到屏幕空间坐标的扩展接口，返回当前三维坐标对应的三维矢量元素的缩放系数
//vWorldPos：表示世界空间坐标
//dScaleDist：表示与vWorldPos关联的某对象在世界空间中的最小缩放距离，当vWorldPos与相机的距离大于该值则对象开始缩放
//返回值：<屏幕空间像素坐标x,屏幕空间像素坐标y,设备深度z,对象缩放系数w>，当x/y超过窗口边界或z超过区间[0,1]时表示vWorldPos在屏幕上不可见
Module.REworldPosToScreenPos_Ext = function(vWorldPos, dScaleDist){
  return Module.RealBIMWeb.WorldPosToScreenPos(vWorldPos, dScaleDist);
}

//相机方位相关
// dirInfo:表示六个主视图方向
// bScanAllSce：表示是否定位到整个场景，true表示定位到整个场景，false表示相机原地调整方向
Module.RElocateCamToMainDir = function(dirInfo,bScanAllSce){
  var _camdir = true; 
  if(typeof bScanAllSce != 'undefined'){_camdir = bScanAllSce;}
  if(dirInfo=="default"){
    Module.RealBIMWeb.RestoreCamLocation();
  }else if(dirInfo=="down"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.TOP,_camdir);
  }else if(dirInfo=="up"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.BOTTOM,_camdir);
  }else if(dirInfo=="left"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.LEFT,_camdir);
  }else if(dirInfo=="right"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.RIGHT,_camdir);
  }else if(dirInfo=="front"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.FRONT,_camdir);
  }else if(dirInfo=="back"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.BACK,_camdir);
  }
}

//获取当前相机方位(四元数)
Module.REgetCamLocation = function(){
  var camloc = Module.RealBIMWeb.GetCamLocation();
  return camloc;
}

//调整相机到方位(四元数)
//delay：表示自动定位前的延迟时间(秒)
//time：表示自动定位的时长(>=0表示绝对时长(秒)；<0表示定位的运动速率(米/秒))
Module.RElocateCamTo = function(pos,dir,delay,time){
  var _time =1.0; if(typeof time != 'undefined'){_time =time;}
  Module.RealBIMWeb.LocateCamTo(pos,dir,delay,_time);
}

//设置是否固定主相机（BIM相机）
//bool:设为true，则固定当前场景BIM相机，false，不固定
//camPos：固定相机的位置，数组，例[0,0,0]
//camDir：固定相机的方向，四元数，例[0,0,0,1]，相机的位置和朝向均可通过获取当前相机方位接口REgetCamLocation获取
Module.REisFixMainCam = function(bool,camPos,camDir){
  Module.RealBIMWeb.IsFixMainCam(bool,camPos,camDir);
}

//获取当前相机方位
Module.REgetCamLocationDir = function(){
  var camloc = Module.RealBIMWeb.GetCamLocation_Dir();
  return camloc;
}

//调整相机到方位
//delay：表示自动定位前的延迟时间(秒)
//time：表示自动定位的时长(>=0表示绝对时长(秒)；<0表示定位的运动速率(米/秒))
Module.RElocateCamToDir = function(pos,dir,delay,time){
  var _time =1.0; if(typeof time != 'undefined'){_time =time;}
  Module.RealBIMWeb.LocateCamTo_Dir(pos,dir,delay,_time);
}

//生成屏幕快照
Module.REgetScreenPrintImage = function(){
  return Module.canvas.toDataURL();
}

//颜色转换工具函数
Module.REclrFix = function(clr,clrPercent){
  var newclr01 = clr.substring(0,2); 
  var newclr02 = clr.substring(2,4); 
  var newclr03 = clr.substring(4,6); 
  var newclr = newclr03+newclr02+newclr01; 
  var intclrper = Math.round(clrPercent);
  var newclrper =(intclrper>15 ? (intclrper.toString(16)) : ("0"+intclrper.toString(16))); 
  var clrinfo ="0x"+newclrper+newclr; 
  var clr = parseInt(clrinfo);
  return clr;
}

//透明度转换工具函数
Module.REalphaFix = function(alpha,alphaPercent){
  var intalphainfo =Math.round(alpha);
  var intalphaper =Math.round(alphaPercent);
  var newalphainfo =(intalphainfo>15 ? (intalphainfo.toString(16)) : ("0"+intalphainfo.toString(16)));
  var newalphaper =(intalphaper>15 ? (intalphaper.toString(16)) : ("0"+intalphaper.toString(16)));
  var alphainfo ="0x"+newalphaper+newalphainfo+"ffff"; 
  var alpha = parseInt(alphainfo); 
  return alpha;
}

//发光和PBR转换工具函数
Module.REpbrFix = function(newEmis,newEmisPercent,newSmooth,newMetal,newSmmePercent){
  var intemis =Math.round(newEmis);
  var intemisratio =Math.round(newEmisPercent);
  var intsmoothtemp =Math.round(newSmooth);
  var intmetaltemp =Math.round(newMetal);
  var intsmmeratio =Math.round(newSmmePercent);
  var intsmooth = Math.round(intsmoothtemp/255*63);
  var intmetal = Math.round(intmetaltemp/255*3);
  var pbrtemp = intemis+intemisratio*256+intsmooth*65536+intmetal*4194304+intsmmeratio*268435456;
  var pbr = Math.round(pbrtemp);
  return pbr;
}

//改变构件集合颜色(永久)
Module.REsetElemClr = function(objArr,newClr,newClrPercent,newAlpha,newAlphaPercent,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var clr = Module.REclrFix(newClr,newClrPercent); 
  var alpha = Module.REalphaFix(newAlpha,newAlphaPercent);
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    var _l = (16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,projid,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos(_projName,"", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      clrs.set([eleid,projid,alpha,clr], i*4);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos(_projName,"", clrs.byteLength, clrs.byteOffset);
  }
}

//批量获取当前构件设置的颜色
Module.REgetElemClr = function(projName,objArr){
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var _s = objArr.length;
  if(_s ==0){
    console.log("请输入有效的构件id");
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      clrs.set([eleid,projid,0x00000000,0x00000000], i*4);
    }
    var clrinfoarr = Module.RealBIMWeb.GetHugeObjSubElemClrInfos(projName,"", clrs.byteLength, clrs.byteOffset);
    var elemclrinfoarr=[];
    for(var i=0; i<clrinfoarr.length; i+=4){
      var curelemclrinfo={};
      curelemclrinfo["id"] = clrinfoarr[i];
      curelemclrinfo["alpha"] = parseInt((clrinfoarr[i+2]).toString(16).substring(2,4),16);
      curelemclrinfo["alphaWeight"] = parseInt((clrinfoarr[i+2]).toString(16).substring(0,2),16);
      curelemclrinfo["color"] = (clrinfoarr[i+3]).toString(16).substring(6,8)+(clrinfoarr[i+3]).toString(16).substring(4,6)+(clrinfoarr[i+3]).toString(16).substring(2,4);
      curelemclrinfo["colorWeight"] = parseInt((clrinfoarr[i+3]).toString(16).substring(0,2),16);
      elemclrinfoarr.push(curelemclrinfo);
    }
    // console.log(elemclrinfoarr);
    return elemclrinfoarr;
  }
}

//单独改变构件集合颜色信息，透明度保持不变
Module.REsetElemClrData = function(objArr,newClr,newClrPercent,projName){
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var clr = Module.REclrFix(newClr,newClrPercent); 
  var elemclrinfo = Module.REgetElemClr(projName,objArr);
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    console.log("请输入有效的构件id")
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var alpha = Module.REalphaFix(elemclrinfo[i].alpha,elemclrinfo[i].alphaWeight);
      clrs.set([objArr[i],projid,alpha,clr], i*4);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", clrs.byteLength, clrs.byteOffset);
  }
}

//单独改变构件集合透明度信息，颜色保持不变
Module.REsetElemAlphaData = function(objArr,newAlpha,newAlphaPercent,projName){
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var alpha = Module.REalphaFix(newAlpha,newAlphaPercent);
  var elemclrinfo = Module.REgetElemClr(projName,objArr);
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    console.log("请输入有效的构件id")
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var clr = Module.REclrFix(elemclrinfo[i].color,elemclrinfo[i].colorWeight);
      clrs.set([objArr[i],projid,alpha,clr], i*4);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", clrs.byteLength, clrs.byteOffset);
  }
}

//恢复构件集合颜色(永久)
Module.REresetElemClr = function(objArr,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var clr = 0x000000ff;
  var alpha = 0x0080ffff;
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    var _l = (16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,projid,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos(_projName,"", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      clrs.set([eleid,projid,alpha,clr], i*4);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos(_projName,"" ,clrs.byteLength, clrs.byteOffset);
  }
}

//多项目恢复构件集合颜色(永久)
Module.REresetElemClr_projs = function(projName,objArr){
  var clr = 0x000000ff;
  var alpha = 0x0080ffff;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var _s = objArr.length;
  if(projName==""){
    var _l = (16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("","", 0xffffffff, clrs.byteOffset);
  }else{
    if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (16).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0,projid,alpha,clr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", 0xffffffff, clrs.byteOffset);
    }else{
      var _s01 = (_s*16).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      for(i =0; i<_s; ++i)
      {
        var eleid = objArr[i];
        clrs.set([eleid,projid,alpha,clr], i*4);
      }
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", clrs.byteLength, clrs.byteOffset);
    }
  }
}
//多项目改变构件集合颜色(永久)
Module.REsetElemClr_projs = function(projName,objArr,newClr,newClrPercent,newAlpha,newAlphaPercent){
  var clr = Module.REclrFix(newClr,newClrPercent); 
  var alpha = Module.REalphaFix(newAlpha,newAlphaPercent);
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var _s = objArr.length;
  if(projName==""){
    var _l = (16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("","", 0xffffffff, clrs.byteOffset);
  }else{
    if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (16).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0,projid,alpha,clr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", 0xffffffff, clrs.byteOffset);
    }else{
      var _s01 = (_s*16).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      for(i =0; i<_s; ++i)
      {
        var eleid = objArr[i];
        clrs.set([eleid,projid,alpha,clr], i*4);
      }
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", clrs.byteLength, clrs.byteOffset);
    }
  }
}

//改变构件集合颜色(永久,增强版)
Module.REsetElemClrExt = function(objArr,newClr,newClrPercent,newAlpha,newAlphaPercent,
  newEmis,newEmisPercent,newSmooth,newMetal,newSmmePercent,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var clr = Module.REclrFix(newClr,newClrPercent); 
  var alpha = Module.REalphaFix(newAlpha,newAlphaPercent);
  var pbr = Module.REpbrFix(newEmis,newEmisPercent,newSmooth,newMetal,newSmmePercent);
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    var _l = (24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,projid,alpha,0,clr,pbr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(_projName,"", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      clrs.set([eleid,projid,alpha,0,clr,pbr], i*6);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(_projName,"", clrs.byteLength, clrs.byteOffset);
  }
}

//多项目改变构件集合颜色(永久,增强版)
Module.REsetElemClrExt_projs = function(projName,objArr,newClr,newClrPercent,newAlpha,newAlphaPercent,
  newEmis,newEmisPercent,newSmooth,newMetal,newSmmePercent){
  var clr = Module.REclrFix(newClr,newClrPercent); 
  var alpha = Module.REalphaFix(newAlpha,newAlphaPercent);
  var pbr = Module.REpbrFix(newEmis,newEmisPercent,newSmooth,newMetal,newSmmePercent);
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var _s = objArr.length;
  if(projName==""){
    var _l = (24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,0,clr,pbr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("","", 0xffffffff, clrs.byteOffset);
  }else{
    if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (24).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0,projid,alpha,0,clr,pbr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projName,"", 0xffffffff, clrs.byteOffset);
    }else{
      var _s01 = (_s*24).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      for(i =0; i<_s; ++i)
      {
        var eleid = objArr[i];
        clrs.set([eleid,projid,alpha,0,clr,pbr], i*6);
      }
      Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projName,"", clrs.byteLength, clrs.byteOffset);
    }
  }
}

//恢复构件集合颜色(永久,增强版)
Module.REresetElemClrExt = function(objArr,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var clr = 0x000000ff;  var alpha = 0x0080ffff;  var pbr = 0x00000000;
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    var _l = (24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,projid,alpha,0,clr,pbr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(_projName, "", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      clrs.set([eleid,projid,alpha,0,clr,pbr], i*6);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(_projName, "", clrs.byteLength, clrs.byteOffset);
  }
}
//多项目恢复构件集合颜色(永久,增强版)
Module.REresetElemClrExt_projs = function(projName,objArr){
  var clr = 0x000000ff;
  var alpha = 0x0080ffff;
  var pbr = 0x00000000;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var _s = objArr.length;
  if(projName==""){
    var _l = (24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,0,clr,pbr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("", "", 0xffffffff, clrs.byteOffset);
  }else{
    if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (24).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0,projid,alpha,0,clr,pbr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projName, "", 0xffffffff, clrs.byteOffset);
    }else{
      var _s01 = (_s*24).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      for(i =0; i<_s; ++i)
      {
        var eleid = objArr[i];
        clrs.set([eleid,projid,alpha,0,clr,pbr], i*6);
      }
      Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projName, "", clrs.byteLength, clrs.byteOffset);
    }
  }
}


//表示多边形区域场景裁剪的内部消息响应函数
REpolyclipHugeObjSubElems_innerlistener_inited =false;
Module.REpolyclipHugeObjSubElems_innerlistener = function(e){
  var finalprojs =[]; var curprojname =""; var curprojelemids =[]; var curprojid =0xffffffff; var id1, id2;
  for(i =0; i<e.detail.elemids.length/2; ++i){
    id1 =e.detail.elemids[i*2+0]; id2 =e.detail.elemids[i*2+1];
    if(id2 != curprojid){
      if(curprojid != 0xffffffff){finalprojs.push({name: curprojname, ids: curprojelemids});}
      curprojname =Module.RealBIMWeb.ConvGolIntID2StrID(id2); curprojelemids =[id1]; curprojid =id2;
    }else{
      curprojelemids.push(id1);
    }
  }
  if(curprojelemids.length > 0){
    finalprojs.push({name: curprojname, ids: curprojelemids}); 
  }
	var event = new CustomEvent("RealBIMPolyClipRet", {detail:{progress: e.detail.progress, projs: finalprojs, aabb: e.detail.aabb, userbatch: e.detail.userbatch}});
	document.dispatchEvent(event);
}

//进行多边形区域场景裁剪
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的场景节点名称，若为空串则表示处理所有的场景节点
//PolyPotsArray：表示XY平面的多边形裁剪区域(多边形首端点与末端点相连可构成一个封闭区域)
//dMinHeight,dMaxHeight：表示Z轴上多边形裁剪区域的最小/最大高度
//bOnlyVisible：表示是否仅包含可见元素
//bIncludeInter：表示是否包含与多边形区域边界相交的元素
//uUserBatch：表示用户自定义批次编号
Module.REpolyclipHugeObjSubElems = function(projName, sceName, PolyPotsArray, dMinHeight, dMaxHeight, bOnlyVisible, bIncludeInter, uUserBatch){
  if(Module.REpolyclipHugeObjSubElems_innerlistener_inited == false){
    Module.REpolyclipHugeObjSubElems_innerlistener_inited =true;
    document.addEventListener("RealBIMPolyClipping", Module.REpolyclipHugeObjSubElems_innerlistener);
  }
  var innerstr = (PolyPotsArray.length*16).toString();
  Module.RealBIMWeb.ReAllocHeapViews(innerstr); var polypots =Module.RealBIMWeb.GetHeapView_Double(0);
  for(var j =0; j<PolyPotsArray.length; ++j)
  {
    polypots[2*j+0] =PolyPotsArray[j][0]; polypots[2*j+1] =PolyPotsArray[j][1];
  }
  Module.RealBIMWeb.PolyClipHugeObjSubElems(projName, sceName, polypots.byteLength, polypots.byteOffset, dMinHeight, dMaxHeight, bOnlyVisible, bIncludeInter, uUserBatch);  
}


//获取列车总数
Module.REtrain_GetTrainNum = function()
{
  return Module.RealBIMWeb.Train_GetTrainNum();
}

//获取路线总数
Module.REtrain_GetPathNum = function()
{
  return Module.RealBIMWeb.Train_GetPathNum();
}

//获取路线的长度
Module.REtrain_GetPathLen = function(uPathID)
{
  return Module.RealBIMWeb.Train_GetPathLen(uPathID);
}

//启动一辆列车
//uTrainID：表示列车ID(列车ID若无效则表示与所有列车解绑)
//uPathID：表示列车要行驶的路线ID
//dExpectSpeed：表示列车的期望速度(米/秒)
//dStartPathPos,dEndPathPos：表示列车尾部在路线上的起始里程(米)和结束里程(米)
//bPreserveHead：表示列车在逆向行驶时车头是否进行反转
//uUserID：表示用户自定义ID
//cbEndCallback：表示列车到达终点的回调函数
Module.REtrain_PlayTrain = function(uTrainID, uPathID, dExpectSpeed, dStartPathPos, dEndPathPos, bPreserveHead, uUserID)
{
  return Module.RealBIMWeb.Train_PlayTrain(uTrainID, uPathID, dExpectSpeed, dStartPathPos, dEndPathPos, bPreserveHead, uUserID);
}

//启动一辆列车(重复行驶)
//dStartPathPos,dEndPathPos,dInitPathPos：表示列车尾部在路线上的起始里程(米)和结束里程(米)和初始里程(米)
Module.REtrain_PlayTrain_Repeat = function(uTrainID, uPathID, dExpectSpeed, dStartPathPos, dEndPathPos, dInitPathPos, bPreserveHead)
{
  return Module.RealBIMWeb.Train_PlayTrain_Repeat(uTrainID, uPathID, dExpectSpeed, dStartPathPos, dEndPathPos, dInitPathPos, bPreserveHead);
}

//暂停一辆列车
Module.REtrain_PauseTrain = function(uTrainID)
{
  return Module.RealBIMWeb.Train_PauseTrain(uTrainID);
}

//继续运行一辆列车
Module.REtrain_ResumeTrain = function(uTrainID)
{
  return Module.RealBIMWeb.Train_ResumeTrain(uTrainID);
}

//设置一辆列车的可见性
Module.REtrain_SetTrainVisible = function(uTrainID, bVisible)
{
  return Module.RealBIMWeb.Train_SetTrainVisible(uTrainID, bVisible);
}

//获取列车的类型标识
Module.REtrain_GetTrainType = function(uTrainID)
{
  return Module.RealBIMWeb.Train_GetTrainType(uTrainID);
}

//获取列车的总长度
Module.REtrain_GetTrainLen = function(uTrainID)
{
  return Module.RealBIMWeb.Train_GetTrainLen(uTrainID);
}

//获取列车当前的行驶状态(0->未行驶；1->行驶中；2->暂停行驶)
Module.REtrain_GetTrainState = function(uTrainID)
{
  return Module.RealBIMWeb.Train_GetTrainState(uTrainID);
}

//获取一辆列车的锚点对应的骨骼ID
Module.REtrain_GetTrainAnchorBoneID = function(uTrainID)
{
  return Module.RealBIMWeb.Train_GetTrainAnchorBoneID(uTrainID);
}

//绑定当前相机到一辆列车
//uTrainID：表示列车ID(列车ID若无效则表示与所有列车解绑)
//uTrainSide：1->绑定到列车行驶方向的头部；0->绑定到列车行驶方向的尾部
Module.REtrain_BindCamToTrain = function(uTrainID, uTrainSide)
{
  return Module.RealBIMWeb.Train_BindCamToTrain(uTrainID, uTrainSide);
}


//根据id判断一个构件是否被设为透明
Module.REisElemHide = function(elemId,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  Module.RealBIMWeb.ReAllocHeapViews("16"); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
  clrs.set([elemId,projid,0x00000000,0x00000000], 0); 
  var retarray =Module.RealBIMWeb.GetHugeObjSubElemClrInfos(_projName, "", clrs.byteLength, clrs.byteOffset);
  var alphainfo = retarray[2].toString(16);
  var isusenewalpha = alphainfo.substring(6,8); 
  var newalpha = alphainfo.substring(2,4); 
  var newalphapercent = alphainfo.substring(0,2); 
  var temp01 = parseInt(isusenewalpha,16);
  var temp02 = parseInt(newalpha,16)
  var temp03 = parseInt(newalphapercent,16)
  if(temp01>0 && temp02==0 && temp03==255){
    return true;
  }else{
    return false;
  }
}

//设置场景节点颜色
Module.REsetSceClr = function(sceArr,newClr,newClrPercent,newAlpha,newAlphapercent,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var clr = Module.REclrFix(newClr,newClrPercent); 
  var alpha = Module.REalphaFix(newAlpha,newAlphapercent);
  var _s = sceArr.length;
  if(_s ==0){  //如果场景ID集合为空，则默认为改变所有场景的信息
    Module.RealBIMWeb.ReAllocHeapViews("16"); clrs =Module.RealBIMWeb.GetHeapView_U32(0); clrs.set([0,projid,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos(_projName, "", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = sceArr[i];
      clrs.set([0,projid,alpha,clr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(_projName, eleid, 0xffffffff, clrs.byteOffset);
    }
  }
}
//恢复场景节点颜色
Module.REresetSceClr = function(sceArr,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var clr = 0x000000ff;  var alpha = 0x0080ffff;
  var _s = sceArr.length;
  if(_s ==0){  //如果场景ID集合为空，则默认为改变所有场景的信息
    Module.RealBIMWeb.ReAllocHeapViews("16"); clrs =Module.RealBIMWeb.GetHeapView_U32(0); clrs.set([0,projid,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos(_projName, "", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = sceArr[i];
      clrs.set([0,projid,alpha,clr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(_projName, eleid, 0xffffffff, clrs.byteOffset);
    }
  }
}

//获取当前构件的渲染状态
Module.REgetSysRenderState = function(){
  var renderdata = new Uint8Array(Module.RealBIMWeb.GetSysRenderState());
  return renderdata;
}
//设置构件的渲染状态
Module.REsetSysRenderState = function(renderData){
  var strrenderdata = renderData.byteLength.toString();
  Module.RealBIMWeb.ReAllocHeapViews(strrenderdata); data =Module.RealBIMWeb.GetHeapView_U8(0);
  data.set(renderData,0);
  Module.RealBIMWeb.SetSysRenderState(data.byteLength,data.byteOffset);
}

//设置构件的探测掩码
Module.REsetElemsProbeMask = function(objArr,bool,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为设置所有构件
    Module.RealBIMWeb.SetHugeObjSubElemProbeMasks(_projName,"",0xffffffff,0,bool);
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.SetHugeObjSubElemProbeMasks(_projName,"",elemIds.byteLength,elemIds.byteOffset,bool);
  }
}

//设置构件的有效性
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//objArr：表示该项目对应的构件id数组，为空则表示该项目下的全部构件
//bool：为true表示构件有效，为false表示构件无效，此时构件不可见
Module.REsetElemsValidState = function(projName,objArr,bool){
  var _s = objArr.length;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  if(_s ==0){  //如果构件ID集合为空，则默认为设置所有构件
    Module.RealBIMWeb.SetHugeObjSubElemValidStates(projName,"",0xffffffff,0,bool);
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.SetHugeObjSubElemValidStates(projName,"",elemIds.byteLength,elemIds.byteOffset,bool);
  }
}

//锚点设置相关
// 批量添加锚点
Module.REaddAnchors = function(ancInfo){
  var tempAnchors =new Module.RE_Vector_ANCHOR();
  for(i=0;i<ancInfo.length;++i){
    var _uselod = false; var _animobjname =""; var _animboneid =0; var _linepos = [0,0]; var _lineclr = 0x00000000; var _size = 0; var _selfASDist = -1; var _selfVisDist = -1;
    var _texfocus =[0,0]; var _textbias =[1,0]; var _GolFontID ="RealBIMFont001"; var _textcolor =0xffffffff; var _textbordercolor =0xff000000;
    var _textbackmode =0; var _textbackborder =0; var _textbackclr =0x00000000;
    var _groupname = "DefaultGroup";
    if(typeof ancInfo[i].groupName != 'undefined'){_groupname = ancInfo[i].groupName;}
    if(typeof ancInfo[i].useLod != 'undefined'){_uselod = ancInfo[i].useLod;}
    if(typeof ancInfo[i].animObjName != 'undefined'){_animobjname = ancInfo[i].animObjName;}
    if(typeof ancInfo[i].animBoneID != 'undefined'){_animboneid = ancInfo[i].animBoneID;}
    if(typeof ancInfo[i].linePos != 'undefined'){_linepos = ancInfo[i].linePos;}
    if(typeof ancInfo[i].lineClr != 'undefined'){_lineclr = ancInfo[i].lineClr;}
    if(typeof ancInfo[i].ancSize != 'undefined'){_size = ancInfo[i].ancSize;}
    if(typeof ancInfo[i].selfAutoScaleDist != 'undefined'){_selfASDist = ancInfo[i].selfAutoScaleDist;}
    if(typeof ancInfo[i].selfVisDist != 'undefined'){_selfVisDist = ancInfo[i].selfVisDist;}
    if(typeof ancInfo[i].textBias != 'undefined'){_textbias = ancInfo[i].textBias;}
    if(typeof ancInfo[i].textFocus != 'undefined'){_texfocus = ancInfo[i].textFocus;}
    if(typeof ancInfo[i].fontName != 'undefined'){_GolFontID = ancInfo[i].fontName;}
    if(typeof ancInfo[i].textColor != 'undefined'){_textcolor = ancInfo[i].textColor;}
    if(typeof ancInfo[i].textBorderColor != 'undefined'){_textbordercolor = ancInfo[i].textBorderColor;}
    if(typeof ancInfo[i].textBackMode != 'undefined'){_textbackmode = ancInfo[i].textBackMode;}
    if(typeof ancInfo[i].textBackBorder != 'undefined'){_textbackborder = ancInfo[i].textBackBorder;}
    if(typeof ancInfo[i].textBackClr != 'undefined'){_textbackclr = ancInfo[i].textBackClr;}

    var TempTextRect =[0, 0, 1, 1]; var TempTextFmtFlag =0x40/*TEXT_FMT_NOCLIP*/;
    if(_textbias[0] < 0){
        TempTextRect[0] =_linepos[0]-1-_texfocus[0]; TempTextRect[2] =_linepos[0]-_texfocus[0]; TempTextFmtFlag |=0x20/*TEXT_FMT_RIGHT*/;
    }else if(_textbias[0] == 0){
        //TempTextRect[0] =_linepos[0]-_texfocus[0]; TempTextRect[2] =_linepos[0]+1-_texfocus[0]; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
        TempTextRect[0] =_linepos[0]-_texfocus[0]; TempTextRect[2] =ancInfo[i].picWidth+_linepos[0]-_texfocus[0]; TempTextFmtFlag |=0x10/*TEXT_FMT_HCENTER*/;
   }else{
        TempTextRect[0] =ancInfo[i].picWidth+_linepos[0]-_texfocus[0]; TempTextRect[2] =ancInfo[i].picWidth+_linepos[0]+1-_texfocus[0]; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
    }
    if(_textbias[1] < 0){
        TempTextRect[1] =_linepos[1]-1-_texfocus[1]; TempTextRect[3] =_linepos[1]-_texfocus[1]; TempTextFmtFlag |=0x4/*TEXT_FMT_TOP*/;
    }else if(_textbias[1] == 0){
        //TempTextRect[1] =_linepos[1]-_texfocus[1]; TempTextRect[3] =_linepos[1]+1-_texfocus[1]; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
        TempTextRect[1] =_linepos[1]-_texfocus[1]; TempTextRect[3] =ancInfo[i].picHeight+_linepos[1]-_texfocus[1]; TempTextFmtFlag |=0x2/*TEXT_FMT_VCENTER*/;
    }else{
        TempTextRect[1] =ancInfo[i].picHeight+_linepos[1]-_texfocus[1]; TempTextRect[3] =ancInfo[i].picHeight+_linepos[1]+1-_texfocus[1]; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
    }

    var tempobj ={
     m_strGroupName:_groupname, 
     m_strName: ancInfo[i].ancName, 
     m_vPos: ancInfo[i].pos, 
     m_bUseLOD: _uselod,
     m_strAnimObjName: _animobjname,
     m_uAnimBoneID: _animboneid,
     m_vLineEnd: _linepos,
     m_uLineClr: _lineclr,
     m_fSize: _size,
     m_fSelfASDist: _selfASDist,
     m_fSelfVisDist: _selfVisDist,
     m_cTexRegion: {
       m_strTexPath: ancInfo[i].picPath,
       m_qTexRect: [_linepos[0]-_texfocus[0], _linepos[1]-_texfocus[1], ancInfo[i].picWidth+_linepos[0]-_texfocus[0], ancInfo[i].picHeight+_linepos[1]-_texfocus[1]],
       m_uTexClrMult: 0xffffffff,
       m_vMinTexUV: [0.0, 0.0],
       m_vMaxTexUV: [1.0, 1.0],
       m_uFrameNumU: 1,
       m_uFrameNumV: 1,
       m_uFrameStrideU: 30,
       m_uFrameStrideV: 30,
       m_fFrameFreq: 0.0,
     },
     m_cTextRegion: {
       m_strGolFontID: _GolFontID,
       m_bTextWeight: false,
       m_strText: ancInfo[i].textInfo,
       m_uTextClr: _textcolor,
       m_uTextBorderClr: _textbordercolor,
       m_qTextRect: TempTextRect,
       m_uTextFmtFlag: TempTextFmtFlag,
       m_uTextBackMode:_textbackmode, m_sTextBackBorder:_textbackborder, m_uTextBackClr:_textbackclr
     }
    };
    tempAnchors.push_back(tempobj);
  }
  var bool =Module.RealBIMWeb.AddAnchors(tempAnchors);
  return bool;
}
//获取所有的锚点分组名称
Module.REgetAllAnchorGroupNames = function(){
  var ancGroupName = Module.RealBIMWeb.GetAllAnchorGroupNames();
  var nameArr = [];
  for(i =0; i<ancGroupName.size(); ++i){
    nameArr.push(ancGroupName.get(i));
  }
  return nameArr;
}
//批量删除锚点
Module.REdelAnchors = function(arrAncName){
  var tempAnchors = new Module.RE_Vector_WStr();
  for(i=0;i<arrAncName.length;++i){
    tempAnchors.push_back(arrAncName[i]);
  }
  var bool =Module.RealBIMWeb.DelAnchors(tempAnchors);
  return bool;
}
//按组删除锚点
Module.REdelAnchorGroup = function(strAncGroupName){
  var bool =Module.RealBIMWeb.DelGroupAnchors(strAncGroupName);
  return bool;
}
//删除全部锚点
Module.REdelAllAnchors = function(){
  Module.RealBIMWeb.DelAllAnchors();
}
//获取系统中所有锚点总数
Module.REgetAnchorNum = function(){
  var ancnum =Module.RealBIMWeb.GetAnchorNum();
  return ancnum;
}
//获取某个锚点的信息
Module.REgetAnchorData = function(strAncName){
  var ancData =Module.RealBIMWeb.GetAnchor(strAncName);
  return ancData;
}
//获取某个锚点组包含的所有锚点信息
Module.REgetGroupAnchors = function(arrAncGroupName){
  var allAncData =Module.RealBIMWeb.GetGroupAnchors(arrAncGroupName);
  var arrAncData = [];
  for(var i=0;i <allAncData.size(); ++i){
    arrAncData.push(allAncData.get(i));
  }
  return arrAncData;
}
//获取系统中所有锚点信息
Module.REgetAllAnchorsData = function(){
  var allAncData =Module.RealBIMWeb.GetAllAnchors();
  var arrAncData = [];
  for(var i=0;i <allAncData.size(); ++i){
    arrAncData.push(allAncData.get(i));
  }
  return arrAncData;
}

// 批量添加闪烁锚点
Module.REaddAnimAnchors = function(ancInfo){
  var tempAnchors =new Module.RE_Vector_ANCHOR();
  for(i=0;i<ancInfo.length;++i){
    var _uselod = false; var _animobjname =""; var _animboneid =0; var _linepos = [0,0]; var _lineclr = 0x00000000; var _size = 0; var _selfASDist = -1; var _selfVisDist = -1;
    var _texfocus =[0,0]; var _textbias =[1,0]; var _GolFontID ="RealBIMFont001"; var _textcolor =0xff000000; var _textbordercolor =0xff000000;
    var _textbackmode =0; var _textbackborder =0; var _textbackclr =0x00000000;
    var _groupname = "DefaultGroup";
    if(typeof ancInfo[i].groupName != 'undefined'){_groupname = ancInfo[i].groupName;}
    if(typeof ancInfo[i].useLod != 'undefined'){_uselod = ancInfo[i].useLod;}
    if(typeof ancInfo[i].animObjName != 'undefined'){_animobjname = ancInfo[i].animObjName;}
    if(typeof ancInfo[i].animBoneID != 'undefined'){_animboneid = ancInfo[i].animBoneID;}
    if(typeof ancInfo[i].linePos != 'undefined'){_linepos = ancInfo[i].linePos;}
    if(typeof ancInfo[i].lineClr != 'undefined'){_lineclr = ancInfo[i].lineClr;}
    if(typeof ancInfo[i].ancSize != 'undefined'){_size = ancInfo[i].ancSize;}
    if(typeof ancInfo[i].selfAutoScaleDist != 'undefined'){_selfASDist = ancInfo[i].selfAutoScaleDist;}
    if(typeof ancInfo[i].selfVisDist != 'undefined'){_selfVisDist = ancInfo[i].selfVisDist;}
    if(typeof ancInfo[i].textBias != 'undefined'){_textbias = ancInfo[i].textBias;}
    if(typeof ancInfo[i].textFocus != 'undefined'){_texfocus = ancInfo[i].textFocus;}
    if(typeof ancInfo[i].fontName != 'undefined'){_GolFontID = ancInfo[i].fontName;}
    if(typeof ancInfo[i].textColor != 'undefined'){_textcolor = ancInfo[i].textColor;}
    if(typeof ancInfo[i].textBorderColor != 'undefined'){_textbordercolor = ancInfo[i].textBorderColor;}
    if(typeof ancInfo[i].textBackMode != 'undefined'){_textbackmode = ancInfo[i].textBackMode;}
    if(typeof ancInfo[i].textBackBorder != 'undefined'){_textbackborder = ancInfo[i].textBackBorder;}
    if(typeof ancInfo[i].textBackClr != 'undefined'){_textbackclr = ancInfo[i].textBackClr;}

    var TempTextRect =[0, 0, 1, 1]; var TempTextFmtFlag =0x40/*TEXT_FMT_NOCLIP*/;
    if(_textbias[0] < 0){
        TempTextRect[0] =_linepos[0]-1-_texfocus[0]; TempTextRect[2] =_linepos[0]-_texfocus[0]; TempTextFmtFlag |=0x20/*TEXT_FMT_RIGHT*/;
    }else if(_textbias[0] == 0){
        //TempTextRect[0] =_linepos[0]-_texfocus[0]; TempTextRect[2] =_linepos[0]+1-_texfocus[0]; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
        TempTextRect[0] =_linepos[0]-_texfocus[0]; TempTextRect[2] =ancInfo[i].picWidth+_linepos[0]-_texfocus[0]; TempTextFmtFlag |=0x10/*TEXT_FMT_HCENTER*/;
   }else{
        TempTextRect[0] =ancInfo[i].picWidth+_linepos[0]-_texfocus[0]; TempTextRect[2] =ancInfo[i].picWidth+_linepos[0]+1-_texfocus[0]; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
    }
    if(_textbias[1] < 0){
        TempTextRect[1] =_linepos[1]-1-_texfocus[1]; TempTextRect[3] =_linepos[1]-_texfocus[1]; TempTextFmtFlag |=0x4/*TEXT_FMT_TOP*/;
    }else if(_textbias[1] == 0){
        //TempTextRect[1] =_linepos[1]-_texfocus[1]; TempTextRect[3] =_linepos[1]+1-_texfocus[1]; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
        TempTextRect[1] =_linepos[1]-_texfocus[1]; TempTextRect[3] =ancInfo[i].picHeight+_linepos[1]-_texfocus[1]; TempTextFmtFlag |=0x2/*TEXT_FMT_VCENTER*/;
    }else{
        TempTextRect[1] =ancInfo[i].picHeight+_linepos[1]-_texfocus[1]; TempTextRect[3] =ancInfo[i].picHeight+_linepos[1]+1-_texfocus[1]; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
    }

    var tempobj ={
     m_strGroupName:_groupname, 
     m_strName: ancInfo[i].ancName, 
     m_vPos: ancInfo[i].pos, 
     m_bUseLOD: _uselod,
     m_strAnimObjName: _animobjname,
     m_uAnimBoneID: _animboneid,
     m_vLineEnd: _linepos,
     m_uLineClr: _lineclr,
     m_fSize: _size,
     m_fSelfASDist: _selfASDist,
     m_fSelfVisDist: _selfVisDist,
     m_cTexRegion: {
       m_strTexPath: ancInfo[i].picPath,
       m_qTexRect: [_linepos[0]-_texfocus[0], _linepos[1]-_texfocus[1], ancInfo[i].picWidth+_linepos[0]-_texfocus[0], ancInfo[i].picHeight+_linepos[1]-_texfocus[1]],
       m_uTexClrMult: 0xffffffff,
       m_vMinTexUV: [0.0, 0.0],
       m_vMaxTexUV: [1.0/ancInfo[i].picNum, 1.0],
       m_uFrameNumU: ancInfo[i].picNum,
       m_uFrameNumV: 1,
       m_uFrameStrideU: ancInfo[i].picWidth,
       m_uFrameStrideV: ancInfo[i].picHeight,
       m_fFrameFreq: ancInfo[i].playFrame,
     },
     m_cTextRegion: {
       m_strGolFontID: _GolFontID,
       m_bTextWeight: false,
       m_strText: ancInfo[i].textInfo,
       m_uTextClr: _textcolor,
       m_uTextBorderClr: _textbordercolor,
       m_qTextRect: TempTextRect,
       m_uTextFmtFlag: TempTextFmtFlag,
       m_uTextBackMode:_textbackmode, m_sTextBackBorder:_textbackborder, m_uTextBackClr:_textbackclr
     }
    };
    tempAnchors.push_back(tempobj);
  }
  Module.RealBIMWeb.AddAnchors(tempAnchors);
}
//停止闪烁
Module.REstopAncAnim = function(ancName){
  var bool =Module.RealBIMWeb.SetShpObjInfo(ancName, {m_uRGBBlendInfo:0x00ffffff, m_uAlpha:0, m_uAlphaAmp:0, m_uForceAnimFrame:0, m_uProbeMask:1});
  return bool;
}

//设置聚合锚点
//groupName:表示要聚合的锚点组的标识名，为空则表示所有的锚点对象
//lodLevel:表示聚合层级，范围1~10,默认为1，表示不聚合
//useCustomBV:是否用锚点的预估总包围盒，默认为false
//customBV:锚点的预估总包围盒，当useCustomBV为false时，此参数无效，填空数组即可，默认为场景的总包围盒
//lodMergePxl:表示锚点所在单元格进行LOD合并时的投影到屏幕的像素尺寸阈值
//lodMergeCap:表示锚点所在单元格进行LOD合并时的单元格容积阈值
//mergeStyle:表示锚点聚合后的样式，json对象
// {
//   "picPath":"http://bingjiang.f3322.net:8008/test/css/img/tag.png", //聚合锚点的图片路径
//   "picWidth":32, //聚合锚点的图片宽度
//   "picHeight":32, //聚合锚点的图片高度
//   "textBias":[1,0], //聚合锚点文字和图片的对齐方式
//   "fontName":"RealBIMFont001", //聚合锚点文字样式
//   "textColor":0xffffffff, //聚合锚点文字颜色
//   "textBorderColor":0x80000000 //聚合锚点文字边框颜色
// }
Module.REsetAnchorLODInfo = function(groupName,lodLevel,useCustomBV,customBV,lodMergePxl,lodMergeCap,mergeStyle){
  var _customBV = [[0,0,0],[0,0,0]];
  if(useCustomBV){_customBV=customBV;}
  var _linepos = [0,0];  var _texfocus =[0,0]; 
  var _textbias =mergeStyle.textBias; 
  var _GolFontID ="RealBIMFont001";
  if(mergeStyle.fontName != "") {_GolFontID=mergeStyle.fontName};
  //设置文字和图片的对齐方式
  var TempTextRect =[0, 0, 1, 1]; var TempTextFmtFlag =0x40/*TEXT_FMT_NOCLIP*/;
  if(_textbias[0] < 0){
      TempTextRect[0] =_linepos[0]-1-_texfocus[0]; TempTextRect[2] =_linepos[0]-_texfocus[0]; TempTextFmtFlag |=0x20/*TEXT_FMT_RIGHT*/;
  }else if(_textbias[0] == 0){
      TempTextRect[0] =_linepos[0]-_texfocus[0]; TempTextRect[2] =_linepos[0]+1-_texfocus[0]; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
  }else{
      TempTextRect[0] =mergeStyle.picWidth+_linepos[0]-_texfocus[0]; TempTextRect[2] =mergeStyle.picWidth+_linepos[0]+1-_texfocus[0]; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
  }
  if(_textbias[1] < 0){
      TempTextRect[1] =_linepos[1]-1-_texfocus[1]; TempTextRect[3] =_linepos[1]-_texfocus[1]; TempTextFmtFlag |=0x4/*TEXT_FMT_TOP*/;
  }else if(_textbias[1] == 0){
      TempTextRect[1] =_linepos[1]-_texfocus[1]; TempTextRect[3] =_linepos[1]+1-_texfocus[1]; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
  }else{
      TempTextRect[1] =mergeStyle.picHeight+_linepos[1]-_texfocus[1]; TempTextRect[3] =mergeStyle.picHeight+_linepos[1]+1-_texfocus[1]; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
  }
  //创建一个锚点对象样式
  var tempobj ={
        m_strGroupName:groupName, 
        m_strName: "", 
        m_vPos: [0,0,0], 
        m_bUseLOD: false,
        m_strAnimObjName: "",
        m_uAnimBoneID: 0,
        m_vLineEnd: _linepos,
        m_uLineClr: 0x00000000,
        m_fSize: 0,
        m_fSelfASDist: -1,
        m_fSelfVisDist: -1,
        m_cTexRegion: {
                       m_strTexPath: mergeStyle.picPath,
                       m_qTexRect: [_linepos[0]-_texfocus[0], _linepos[1]-_texfocus[1], mergeStyle.picWidth+_linepos[0]-_texfocus[0], mergeStyle.picHeight+_linepos[1]-_texfocus[1]],
                       m_uTexClrMult: 0xffffffff,
                       m_vMinTexUV: [0.0, 0.0],
                       m_vMaxTexUV: [1.0, 1.0],
                       m_uFrameNumU: 1,
                       m_uFrameNumV: 1,
                       m_uFrameStrideU: 30,
                       m_uFrameStrideV: 30,
                       m_fFrameFreq: 0.0,
                      },
        m_cTextRegion: {
                       m_strGolFontID: _GolFontID,
                       m_bTextWeight: false,
                       m_strText: "",
                       m_uTextClr: mergeStyle.textColor,
                       m_uTextBorderClr: mergeStyle.textBorderColor,
                       m_qTextRect: TempTextRect,
                       m_uTextFmtFlag: TempTextFmtFlag,
                       m_uTextBackMode:0, m_sTextBackBorder:0, m_uTextBackClr:0x00000000
                      }
  };
  Module.RealBIMWeb.SetAnchorLODInfo(groupName,lodLevel,useCustomBV,_customBV,lodMergePxl,lodMergeCap,tempobj);
}
//取消锚点聚合
Module.REresetAnchorLODInfo = function(groupName){
    var mergestyle ={
        m_strGroupName:"", 
        m_strName: "", 
        m_vPos: [0,0,0], 
        m_bUseLOD: false,
        m_strAnimObjName: "",
        m_uAnimBoneID: 0,
        m_vLineEnd: [0,0],
        m_uLineClr: 0x00000000,
        m_fSize: 0,
        m_fSelfASDist: -1,
        m_fSelfVisDist: -1,
        m_cTexRegion: {
                       m_strTexPath: "",
                       m_qTexRect: [0,0,0,0],
                       m_uTexClrMult: 0xffffffff,
                       m_vMinTexUV: [0.0, 0.0],
                       m_vMaxTexUV: [1.0, 1.0],
                       m_uFrameNumU: 1,
                       m_uFrameNumV: 1,
                       m_uFrameStrideU: 30,
                       m_uFrameStrideV: 30,
                       m_fFrameFreq: 0.0,
                      },
        m_cTextRegion: {
                       m_strGolFontID: "RealBIMFont001",
                       m_bTextWeight: false,
                       m_strText: "",
                       m_uTextClr: 0x00000000,
                       m_uTextBorderClr: 0x00000000,
                       m_qTextRect: [0,0,0,0],
                       m_uTextFmtFlag: 0,
                       m_uTextBackMode:0, m_sTextBackBorder:0, m_uTextBackClr:0x00000000
                      }
  };
  Module.RealBIMWeb.SetAnchorLODInfo(groupName,1,false,[[0,0,0],[0,0,0]],100,1,mergestyle);
}
//设置系统中锚点是否允许被场景遮挡
Module.REsetAnchorContactSce = function(groupName,bool){
  Module.RealBIMWeb.SetAnchorContactSce(groupName,bool);
}
//获取系统中锚点是否允许被场景遮挡
Module.REgetAnchorContactSce = function(groupName){
  return Module.RealBIMWeb.GetAnchorContactSce(groupName);
}
//设置系统中锚点的自动缩放距离
Module.REsetAnchorAutoScaleDist = function(groupName,dDist){
  Module.RealBIMWeb.SetAnchorAutoScaleDist(groupName,dDist);
}
//获取系统中锚点的自动缩放距离
Module.REgetAnchorAutoScaleDist = function(groupName){
  return Module.RealBIMWeb.GetAnchorAutoScaleDist(groupName);
}
//设置系统中锚点的最远可视距离
Module.REsetAnchorVisDist = function(groupName,dDist){
  Module.RealBIMWeb.SetAnchorVisDist(groupName,dDist);
}
//获取系统中锚点的最远可视距离
Module.REgetAnchorVisDist = function(groupName){
  return Module.RealBIMWeb.GetAnchorVisDist(groupName);
}
//聚焦相机到指定的锚点
//ancName：表示锚点的标识名
//dBackwardAmp：表示相机在锚点中心处向后退的强度
//        >=0.0 表示相机的后退距离相对于锚点覆盖范围的比例(若锚点覆盖范围无效则视为绝对后退距离)
//        <0.0 表示相机的后退距离的绝对值的负
Module.REfocusCamToAnchor = function(ancName,dBackwardAmp){
  Module.RealBIMWeb.FocusCamToAnchor(ancName,dBackwardAmp);
}


//标签相关
//生成一个标签内部对象
// TEXT_FMT_BOTTOM     =(1<<0)_0x1,  //表示文字底部对齐
// TEXT_FMT_VCENTER    =(1<<1)_0x2,  //表示文字竖向居中(优先级高于TEXT_FMT_BOTTOM)
// TEXT_FMT_TOP      =(1<<2)_0x4,  //表示文字顶部对齐(优先级高于TEXT_FMT_VCENTER)
// TEXT_FMT_LEFT     =(1<<3)_0x8,  //表示文字左对齐
// TEXT_FMT_HCENTER    =(1<<4)_0x10,  //表示文字横向居中(优先级高于TEXT_FMT_LEFT)
// TEXT_FMT_RIGHT      =(1<<5)_0x20,  //表示文字右对齐(优先级高于TEXT_FMT_HCENTER)
// TEXT_FMT_NOCLIP     =(1<<6)_0x40,  //表示不裁剪掉文字超出给定矩形区域外的部分
// TEXT_FMT_SINGLELINE   =(1<<7)_0x80,  //表示所有文字全部显示在一横行上，忽略所有的换行符以及TEXT_FMT_WORDBREAK属性
// TEXT_FMT_WORDBREAK    =(1<<8)_0x100,  //若当前字符有一部分在给定矩形区域外的话，则强制换行显示该字符，避免字符横向超出矩形区域外
Module.REgenATag = function(tagInfo){
  var temptexregions =new Module.RE_Vector_SHP_TEX();
  var temptextregions =new Module.RE_Vector_SHP_TEXT();
  var _l = tagInfo.info.length;
  var _h = 26; var _s = 3;
  for(i=0;i<_l;++i){
    temptexregions.push_back({
       m_strTexPath: tagInfo.info[i].picpath,
       m_qTexRect: [-50, _h*(_l-i-1)+_s, -30, _h*(_l-i)-_s], 
       m_uTexClrMult: 0xffffffff,
       m_vMinTexUV: [0.0, 0.0],
       m_vMaxTexUV: [1.0, 1.0],
       m_uFrameNumU: 1,
       m_uFrameNumV: 1,
       m_uFrameStrideU: 0,
       m_uFrameStrideV: 0,
       m_fFrameFreq: 0.0,
     })  //纹理矩形区域在2维像素裁剪空间(Y轴向上递增)下相对于定位点的覆盖区域<左，下，右，上>
  }
  for(i=0;i<_l;++i){
    temptextregions.push_back({
       m_strGolFontID: "RealBIMFont001",
       m_bTextWeight: false,
       m_strText: tagInfo.info[i].textinfo,
       m_uTextClr: 0xffffffff,
       m_uTextBorderClr: 0x80000000,
       m_qTextRect: [0, _h*(_l-i-1)+_s, 30, _h*(_l-i)-_s],
       m_uTextFmtFlag: ((1<<1)/*TEXT_FMT_VCENTER*/ | (1<<3)/*TEXT_FMT_LEFT*/ | (1<<6)/*TEXT_FMT_NOCLIP*/),
       m_uTextBackMode:0, m_sTextBackBorder:0, m_uTextBackClr:0x00000000
     });
  }
  var tempobj ={
   m_strName: tagInfo.tagname, 
   m_vPos: tagInfo.pos, 
   m_vBgMinSize: [150, 10],
   m_vBgPadding: [5, 5],
   m_uBgAlignX: 1,
   m_uBgAlignY: 1,
   m_vArrowOrigin: [0, 10],
   m_uBgColor: 0x80000000,
   m_arrTexContents: temptexregions,
   m_arrTextContents: temptextregions,
  };
  return tempobj;
}
// 批量添加标签
Module.REaddTags = function(tagInfo){
  var temptags =new Module.RE_Vector_TAG();
  for(var i =0; i<tagInfo.length; ++i){
    temptags.push_back(Module.REgenATag(tagInfo[i]));
  }
  var bool =Module.RealBIMWeb.AddTags(temptags);
  return bool;
}
//批量删除标签
Module.REdelTags = function(arrTagName){
  var temptags = new Module.RE_Vector_WStr();
  for(i=0;i<arrTagName.length;++i){
    temptags.push_back(arrTagName[i]);
  }
  var bool =Module.RealBIMWeb.DelTags(temptags);
  return bool;
}
//删除全部标签
Module.REdelAllTags = function(){
  Module.RealBIMWeb.DelAllTags();
}
//获取系统中所有标签总数
Module.REgetTagNum = function(){
  var tagNum =Module.RealBIMWeb.GetTagNum();
  return tagNum;
}
//获取某个标签的信息
Module.REgetTagData = function(tagName){
  var tagData =Module.RealBIMWeb.GetTag(tagName);
  return tagData;
}
//获取系统中所有标签信息
Module.REgetAllTagsData = function(){
  var allTagData =Module.RealBIMWeb.GetAllTags();
  return allTagData;
}
//设置系统中标签是否允许被场景遮挡
Module.REsetTagContactSce = function(bool){
  Module.RealBIMWeb.SetTagContactSce(bool);
}
//获取系统中标签是否允许被场景遮挡
Module.REgetTagContactSce = function(){
  return Module.RealBIMWeb.GetTagContactSce();
}
//设置系统中标签的自动缩放距离
Module.REsetTagAutoScaleDist = function(dDist){
  Module.RealBIMWeb.SetTagAutoScaleDist(dDist);
}
//获取系统中标签的自动缩放距离
Module.REgetTagAutoScaleDist = function(){
  return Module.RealBIMWeb.GetTagAutoScaleDist();
}
//设置系统中标签的最远可视距离
Module.REsetTagVisDist = function(dDist){
  Module.RealBIMWeb.SetTagVisDist(dDist);
}
//获取系统中标签的最远可视距离
Module.REgetTagVisDist = function(){
  return Module.RealBIMWeb.GetTagVisDist();
}

// 标注相关
//开始添加标注
Module.REaddMarkBegin = function(){
  var bool =Module.RealBIMWeb.BeginAddMark();  //进入创建标注的状态
  return bool;
}
//添加标注文字
Module.REaddMarkText = function(textData){
  Module.RealBIMWeb.SetMarkText(textData);
}
//获取当前标注信息
Module.REgetMarkData = function(){
  var markdata = new Uint8Array(Module.RealBIMWeb.GetMarkInfo());
  return markdata;
}
//结束添加标注
Module.REaddMarkEnd = function(){
  var bool =Module.RealBIMWeb.EndAddMark();
  return bool;  
}
//查看之前保存的标注信息，参数为之前保存的字符串
Module.REshowMark = function(markData){
  var strmarkdata = markData.byteLength.toString();
  Module.RealBIMWeb.ReAllocHeapViews(strmarkdata); data =Module.RealBIMWeb.GetHeapView_U8(0);
  data.set(markData,0);
  Module.RealBIMWeb.ShowMarkInfo(data.byteLength,data.byteOffset);
}

// 电子围栏相关
//进入电子围栏编辑状态
Module.REeditFenceBegin = function(){
  Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
}
Module.REaddFenceBegin = function(){
  var bool =Module.RealBIMWeb.BeginAddFence(); //开始添加电子围栏，进入电子围栏编辑状态后可添加多个电子围栏
  return bool;
}
Module.REaddFenceEnd = function(){
  var bool =Module.RealBIMWeb.EndAddFence();  //结束当前电子围栏的添加，如果没有退出电子围栏编辑状态，可继续添加下一个
  return bool;
}
Module.REeditFenceEnd = function(){
  Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
}
// 设置添加电子围栏时的小提示图标
Module.REsetFenceEditPic = function(picPath){
  var temptexregions={
    m_strTexPath: picPath,
    m_qTexRect: [-32, 0, 0, 32],
    m_uTexClrMult: 0xffffffff,
    m_vMinTexUV: [0.0, 0.0],
    m_vMaxTexUV: [1.0, 1.0],
    m_uFrameNumU: 1,
    m_uFrameNumV: 1,
    m_uFrameStrideU: 32,
    m_uFrameStrideV: 32,
    m_fFrameFreq: 0.0
  };
  Module.RealBIMWeb.SetFencePotUniformIcon(temptexregions);
}
//获取当前所有电子围栏的顶点信息
Module.REgetFencePot = function(){
  var fenceInfo = Module.RealBIMWeb.GetSceFenceInfos();
  return fenceInfo;
}
//根据电子围栏的顶点和线的名称返回围栏的名称
Module.REgetFenceName = function(childname){
  var fencedata = Module.RealBIMWeb.GetShpObjExtInfo(shpproberet_norm.m_strSelShpObjName);
  if((fencedata.m_eType.value==3)||(fencedata.m_eType.value==4)){
    var fencename = fencedata.m_strParent;
    return fencename;
  }
}
//设置电子围栏的顶点信息
Module.REaddFenceByPot = function(fenceInfo){
  Module.RealBIMWeb.ExitFenceEditMode(); //必须退出编辑电子围栏的状态，才可设置所有围栏的信息
  for(i=0;i<fenceInfo.length;++i){
    fenceInfo[i].m_uClr = Module.REclrFix(fenceInfo[i].m_uClr,fenceInfo[i].m_uAlpha);
    delete fenceInfo[i].m_uAlpha;
  }
  var tempfencepots = new Module.RE_Vector_FENCE_POT();
  for(i=0;i<fenceInfo.length;++i){
    tempfencepots.push_back(fenceInfo[i]);
  }
  var bool =Module.RealBIMWeb.SetSceFenceInfos(tempfencepots);
  return bool;
}
//删除一个围栏顶点
Module.REdelFencePot = function(fencePotName){
  Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
  var bool =Module.RealBIMWeb.DelFencePot(fencePotName);
  Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
  return bool;
}
//删除一个围栏
Module.REdelFence = function(fenceName){
  Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
  var bool =Module.RealBIMWeb.DelFence(fenceName);
  Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
  return bool;
}
//删除全部围栏
Module.REdelAllFences = function(){
  Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
  var bool =Module.RealBIMWeb.DelAllFences();
  Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
  return bool;
}

// 选择集合相关（选择集包含鼠标选中的构件ID集合，鼠标点击空白处，选择集自动清空）
// 设置选择集的颜色、透明度、探测掩码（即是否可以被选中）
// newClr: 表示新的颜色
// newClrPercent: 表示新的颜色所占的权重，255表示100%,0表示0%
// newAlpha: 表示新的透明度，255表示不透明，80表示半透明，0表示全透明
// newAlphaPercent: 表示新的透明度所占的权重，255表示100%，0表示0%
// probeMask : 0：表示选择集中的构件不可被选中，为1则表示可以被选中；
// attrvalid ：表示属性信息是否有效，若无效则选择集合将不采用该全局属性信息
Module.REsetSelElemsAttr = function(newClr,newClrPercent,newAlpha,newAlphaPercent,probeMask,attrValid){
  var tempclr01 = newClr.substring(0,2); var clr01 = (parseInt(tempclr01,16)/255);
  var tempclr02 = newClr.substring(2,4); var clr02 = (parseInt(tempclr02,16)/255);
  var tempclr03 = newClr.substring(4,6); var clr03 = (parseInt(tempclr03,16)/255);
  var clrper = (newClrPercent/255);
  var alphadata = (newAlpha/255);
  var alphaper = (newAlphaPercent/255);
  var _attrvalid = true; if(typeof attrValid != 'undefined'){_attrvalid = attrValid;}
  var bool =Module.RealBIMWeb.SetSelElemsAttr({m_bAttrValid:_attrvalid, m_qClrBlend:[clr01,clr02,clr03,clrper], m_vAlphaBlend:[alphadata,alphaper], m_uProbeMask:probeMask});
  return bool;
}
// 获取当前选择集的属性信息
Module.REgetSelElemsAttr = function(){
  var curattr =Module.RealBIMWeb.GetSelElemsAttr();
  var tempselclr=curattr.m_qClrBlend;
  var _clr01=parseInt(tempselclr[0]*255, 10).toString(16).padStart(2, '0');
  var _clr02=parseInt(tempselclr[1]*255, 10).toString(16).padStart(2, '0');
  var _clr03=parseInt(tempselclr[2]*255, 10).toString(16).padStart(2, '0');
  var _selClr=[_clr01,_clr02,_clr03].join('');
  var _selClrPercent = tempselclr[3]*255;
  var _selAlpha = curattr.m_vAlphaBlend[0]*255;
  var _selAlphaPercent = curattr.m_vAlphaBlend[1]*255;
  var _selProbeMask = curattr.m_uProbeMask/255;
  var selElemsAttr={selClr:_selClr, selClrPercent:_selClrPercent, selAlpha:_selAlpha, selAlphaPercent:_selAlphaPercent, selProbeMask:_selProbeMask, attrvalid:curattr.m_bAttrValid};
  return selElemsAttr;
}
Module.REresetSelElemsAttr = function(){
  var bool =Module.RealBIMWeb.SetSelElemsAttr({m_bAttrValid:true, m_qClrBlend:[1,0,0,0.8], m_vAlphaBlend:[0.29,1], m_uProbeMask:1});
  return bool;
}
// 单独设置选择集的颜色
// newClr: 表示新的颜色
// newClrPercent: 表示新的颜色所占的权重，255表示100%,0表示0%
Module.REsetSelElemsClr = function(newClr,newClrPercent){
  var tempclr01 = newClr.substring(0,2); var clr01 = (parseInt(tempclr01,16)/255);
  var tempclr02 = newClr.substring(2,4); var clr02 = (parseInt(tempclr02,16)/255);
  var tempclr03 = newClr.substring(4,6); var clr03 = (parseInt(tempclr03,16)/255);
  var clrper = (newClrPercent/255);
  var curattr =Module.RealBIMWeb.GetSelElemsAttr();
  var _attrvalid = curattr.m_bAttrValid;
  var _selAlpha = curattr.m_vAlphaBlend;
  var _selProbeMask = curattr.m_uProbeMask
  var bool =Module.RealBIMWeb.SetSelElemsAttr({m_bAttrValid:_attrvalid, m_qClrBlend:[clr01,clr02,clr03,clrper], m_vAlphaBlend:_selAlpha, m_uProbeMask:_selProbeMask});
  return bool;
}
// 单独设置选择集的透明度
// newAlpha: 表示新的透明度，255表示不透明，80表示半透明，0表示全透明
// newAlphaPercent: 表示新的透明度所占的权重，255表示100%，0表示0%
Module.REsetSelElemsAlpha = function(newAlpha,newAlphaPercent){
  var alphadata = (newAlpha/255);  var alphaper = (newAlphaPercent/255);
  var curattr =Module.RealBIMWeb.GetSelElemsAttr();
  var _attrvalid = curattr.m_bAttrValid;
  var _selClr = curattr.m_qClrBlend;
  var _selProbeMask = curattr.m_uProbeMask
  var bool =Module.RealBIMWeb.SetSelElemsAttr({m_bAttrValid:_attrvalid, m_qClrBlend:_selClr, m_vAlphaBlend:[alphadata,alphaper], m_uProbeMask:_selProbeMask});
  return bool;
}
// 获取当前选择集的构件ID集合,以数组形式返回，两两一组代表一个id的高32位和低32位
Module.REgetSelElemIDs = function(){
  var tempselids =new Uint32Array(Module.RealBIMWeb.GetSelElemIDs());
  var projidarr =[];
  if(tempselids.length<2){
    // alert("当前选择集为空");
    return[];
  }
  var curprojid = tempselids[1];
  var curprojelemarr = [];
  for(var i=0;i<tempselids.length;i+=2){
    if(tempselids[i+1]==curprojid){
      curprojelemarr.push(tempselids[i]);
    }else{
      if(curprojelemarr.length>0){
        var curprojinfo={};
        curprojinfo["projName"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
        curprojinfo["objArr"] = curprojelemarr;
        projidarr.push(curprojinfo);
        curprojelemarr=[];
      }
      curprojid=tempselids[i+1];
      curprojelemarr.push(tempselids[i]);
    }
  }
  if(curprojelemarr.length>0){
    var curprojinfo={};
    curprojinfo["projName"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
    curprojinfo["objArr"] = curprojelemarr;
    projidarr.push(curprojinfo);
    curprojelemarr=[];
  }
  return projidarr;
}
// 往当前选择集合添加构件，参数为要添加的构件id集合
Module.REaddToSelElemIDs = function(objArr,sceName,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var _sceName = ""; if(typeof sceName != 'undefined'){_sceName = sceName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var _s = objArr.length;
  if(_s ==0){
    var _objarr = Module.REgetEleIDsBySceID(_sceName,false,_projName);
    // console.log(_objarr.length);
    var _s01 = (_objarr.length*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_objarr.length; ++i)
    {
      var eleid = _objarr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.AddToSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.AddToSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }
}
//从当前选择集合删除构件，参数为要删除的构件id集合
Module.REremoveFromSelElemIDs = function(objArr,sceName,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var _sceName = ""; if(typeof sceName != 'undefined'){_sceName = sceName;}
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
  var _s = objArr.length;
  if(_s ==0){
    var _objarr = Module.REgetEleIDsBySceID(_sceName,false,_projName);
    // console.log(_objarr.length);
    var _s01 = (_objarr.length*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_objarr.length; ++i)
    {
      var eleid = _objarr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.RemoveFromSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.RemoveFromSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }
}
//清空选择集
Module.REclearSelElemIDs = function(){
  Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff,0);
}
// 往当前选择集合添加构件，多项目接口
Module.REaddToSelElemIDs_projs = function(projName,objArr){
  var _s = objArr.length;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  if((projName=="") || (_s==0)){
    // Module.RealBIMWeb.AddToSelElemIDs(0xffffffff,elemIds.byteOffset); //添加全部构件,目前暂不支持
    alert("不支持将整个项目的构件添加到选择集！");
    return;
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.AddToSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }
}
//从当前选择集合删除构件，多项目接口
Module.REremoveFromSelElemIDs_projs = function(projName,objArr){
  var _s = objArr.length;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  if(_s ==0){
    Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff,0); //删除全部构件
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.RemoveFromSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }
}
//获取元素集合的总包围盒信息
Module.REgetTotalBoxByElemIDs_projs = function(projName,objArr){
  var _s = objArr.length;
  var projId = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var tempbv;
  if(projName==""){
      tempbv = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("","",0xffffffff,0); //获取所有构件的包围盒信息
  }else{
    if(_s ==0){
      tempbv = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(projName,"",0xffffffff,0); //获取所有构件的包围盒信息
    }else{
      var temparr=[];
      for(var i=0;i<_s;++i){
        temparr.push(objArr[i]);
        temparr.push(projId);
      }
      var selids = new Uint32Array(temparr);
      var tempids;
      Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids =Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
      tempbv =Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(projName,"", tempids.byteLength, tempids.byteOffset);
    }
  }
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]);  //Xmin
  aabbarr.push(tempbv[1][0]);  //Xmax
  aabbarr.push(tempbv[0][1]);  //Ymin
  aabbarr.push(tempbv[1][1]);  //Ymax
  aabbarr.push(tempbv[0][2]);  //Zmin
  aabbarr.push(tempbv[1][2]);  //Zmax
  return aabbarr;
}
//获取元素集合的总包围盒信息
Module.REgetTotalBoxByElemIDs = function(objArr,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var _s = objArr.length;
  var tempbv;
  if(_s ==0){
    tempbv = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(_projName,"",0xffffffff,0); //获取所有构件的包围盒信息
  }else{
    var projid = Module.RealBIMWeb.ConvGolStrID2IntID(_projName);
    var temparr=[];
    for(var i=0;i<_s;++i){
      temparr.push(objArr[i]);
      temparr.push(projid);
    }
    var selids = new Uint32Array(temparr);
    var tempids;
    Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids =Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
    tempbv =Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(_projName,"", tempids.byteLength, tempids.byteOffset);
  }
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]);  //Xmin
  aabbarr.push(tempbv[1][0]);  //Xmax
  aabbarr.push(tempbv[0][1]);  //Ymin
  aabbarr.push(tempbv[1][1]);  //Ymax
  aabbarr.push(tempbv[0][2]);  //Zmin
  aabbarr.push(tempbv[1][2]);  //Zmax
  return aabbarr;
}
//根据场景组id获取总包围盒信息
// Module.REgetTotalBoxBySceID = function(sceId){
//   var _s = sceId.length;
//   var tempbv;
//   if(_s ==0){
//     tempbv = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("DefaultProj","",0xffffffff,0); //获取所有构件的包围盒信息
//   }else{
//     tempbv =Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("DefaultProj",sceId,0xffffffff,0);
//   }
//   var aabbarr = [];
//   aabbarr.push(tempbv[0][0]); aabbarr.push(tempbv[1][0]);  //Xmin、Xmax
//   aabbarr.push(tempbv[0][1]); aabbarr.push(tempbv[1][1]);  //Ymin、Ymax
//   aabbarr.push(tempbv[0][2]); aabbarr.push(tempbv[1][2]);  //Zmin、Zmax
//   return aabbarr;
// }
//获取模型的包围盒信息
Module.REgetTotalBoxBySceID = function(projName,sceName){
  var tempbv =Module.RealBIMWeb.GetHugeObjBoundingBox(projName,sceName);
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]); aabbarr.push(tempbv[1][0]);  //Xmin、Xmax
  aabbarr.push(tempbv[0][1]); aabbarr.push(tempbv[1][1]);  //Ymin、Ymax
  aabbarr.push(tempbv[0][2]); aabbarr.push(tempbv[1][2]);  //Zmin、Zmax
  return aabbarr;
}


//鼠标探测相关
//获取当前选中点相关参数
Module.REgetCurProbeRet = function(){
  var proberet = Module.RealBIMWeb.GetCurProbeRet(Module.RE_PROBE_TYPE.POT);
  //var projid = proberet.m_uSelActorSubID_H32;
  //var projname = Module.RealBIMWeb.ConvGolIntID2StrID(projid);
  //proberet["m_strProjName"] = projname;
  delete proberet.m_uSelActorSubID_H32;
  return proberet;
}
//获取当前拾取到的矢量(锚点、标签)相关信息
Module.REgetCurShpProbeRet = function(){
  var shpproberet_norm =Module.RealBIMWeb.GetCurShpProbeRet(Module.RE_SHP_PROBE_TYPE.NORM);
  return shpproberet_norm;
}
//获取当前拾取到的360矢量相关信息
Module.REgetCurPanShpProbeRet = function(){
  var panshpproberet_norm =Module.RealBIMWeb.GetCurPanShpProbeRet(Module.RE_PROBE_TYPE.NORM);
  return panshpproberet_norm;
}
//获取当前拾取到的UI相关信息(不常用)
Module.REgetCurUIShpProbeRet = function(){
  var shpproberet_ortho =Module.RealBIMWeb.GetCurShpProbeRet(Module.RE_SHP_PROBE_TYPE.ORTHO);
  return shpproberet_ortho;
}
//获取当前拾取到的复合场景信息
Module.REgetCurCombProbeRet = function(){
  var combret;
  var proberet1 =Module.REgetCurShpProbeRet();
  var proberet2 =Module.REgetCurProbeRet();
  if(proberet1.m_strSelShpObjName != ""){
    combret ={
      m_strType : "Shape",
      m_strSelObjName : proberet1.m_strSelShpObjName,
      m_bbSelBV : [[0,0,0],[0,0,0]],
      m_strProjName : "",
      m_uElemID : 0xffffffff,
      m_vSelCenter : proberet1.m_vSelPos,
      m_vSelPos : proberet1.m_vSelPos,
      m_vSelMoveDelta : proberet1.m_vSelMoveDelta,
      m_vSelScrPos : proberet1.m_vSelScrPos
    };
  }else if(proberet2.m_strSelActorName != ""){
    combret ={
      m_strType : (proberet2.m_uSelActorSubID_L32 >= 0xfffffffe) ? "UnverModel" : "Model",
      m_strSelObjName : proberet2.m_strSelActorName,
      m_bbSelBV : proberet2.m_bbSelBV,
      m_strProjName : proberet2.m_strProjName,
      m_uElemID : proberet2.m_uSelActorSubID_L32,
      m_vSelCenter : proberet2.m_vSelCenter,
      m_vSelPos : proberet2.m_vSelPos,
      m_vSelMoveDelta : proberet2.m_vSelMoveDelta,
      m_vSelScrPos : proberet2.m_vSelScrPos
    };
  }else{
    combret ={
      m_strType : "",
      m_strSelObjName : "",
      m_bbSelBV : [[0,0,0],[0,0,0]],
      m_strProjName : "",
      m_uElemID : 0xffffffff,
      m_vSelCenter : [0,0,0],
      m_vSelPos : [0,0,0],
      m_vSelMoveDelta : [0,0],
      m_vSelScrPos : [0,0]
    };
  }
  return combret;
}

//获取剖切后的构件ID
Module.REgetClipID = function(deleteCrossPart){
  var data = Module.RealBIMWeb.GetClippedElementIds(deleteCrossPart);
  return data;
}
//获取剖面信息
Module.REgetClipData = function(){
  var data = Module.RealBIMWeb.GetSceneClippingInfo();
  return data;
}
//设置剖面信息(进入剖切编辑状态)
Module.REsetClipDataEdit = function(clipdata){
  var bool = Module.RealBIMWeb.SetSceneClippingInfoEdit(clipdata);
  return bool;
}
//设置剖面信息(进入剖切完成状态)
Module.REsetClipData = function(clipdata){
  var bool = Module.RealBIMWeb.SetSceneClippingInfo(clipdata);
  return bool;
}
//退出剖切
Module.REexitClip = function(){
  Module.RealBIMWeb.EndSceneClipping();
}
//判断是否处于剖切浏览模式
Module.REisSceCliping = function(){
  var bool = Module.RealBIMWeb.IsSceneClippingBrowsing();
  return bool;
}
//根据指定高度进行剖切
//dTopHeight,dBottomHeight:顶高和底高
//bSingle是否仅用顶高剖切，false则同时使用顶高和底高剖切
//strProjName使用指定工程的剖切范围，默认使用整个场景的剖切范围
Module.REclipByHeight = function(dTopHeight, dBottomHeight, bSingle, strProjName){
  var bool = Module.RealBIMWeb.ClipByProj(dTopHeight, dBottomHeight, bSingle, strProjName);
  return bool;
}
//根据指定方向定位到剖切面并进行缩放
//strDirInfo：定位到剖切面的方向，字符串，分别包括"top"、"bottom"、"left"、"right"、"front"、"back"
//dScale：定位到剖切面以后，相机的缩放值，默认为1,该值越大，相机定位后距离模型越远
Module.REtargetToCilpElem = function(strDirInfo, dScale){
  var _strDirInfo = "top"; if(typeof strDirInfo != 'undefined'){_strDirInfo = strDirInfo;}
  var _dScale = 1; if(typeof dScale != 'undefined'){_dScale = dScale;}
  var bool = Module.RealBIMWeb.TargetToCilpElem(_strDirInfo, _dScale);
  return bool;
}

//设置项目局部可投射矢量区域信息
//projName：表示要处理的项目名称，不能为空串
//cRgnData：表示区域JSON数据
Module.REsetLocalProjRgnsInfo = function(projName, cRgnData){
  var jsonStr =JSON.stringify(cRgnData);
  return Module.RealBIMWeb.SetLocalProjRgnsInfo(projName, jsonStr);
}
//清空项目局部可投射矢量区域信息
//projName：表示要处理的项目名称，为空串表示清空所有项目的矢量区域信息
Module.REclearLocalProjRgnsInfo = function(projName){
  return Module.RealBIMWeb.SetLocalProjRgnsInfo(projName, "");
}

// 倾斜摄影单体化相关接口
// 设置倾斜摄影压平数据，参数为固定格式json字符串
Module.REsetUnverProjectData = function(unverProjectionData){
  var jsonStr = JSON.stringify(unverProjectionData);
  Module.RealBIMWeb.ParseUnverprojectInfo(jsonStr);
}
// 取消拍平区域，参数为要取消的拍平区域id集合
Module.REremoveUnverProjectData = function(elemArr){
  var _s = elemArr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.RemoveUnverprojectToSelection(elemIds.byteLength,elemIds.byteOffset);
}
// 重新拍平部分区域
Module.REresetUnverProjectData = function(elemArr){
  var _s = elemArr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.AddUnverprojectToSelection(elemIds.byteLength,elemIds.byteOffset);
}

//设置倾斜摄影单体化数据，参数为固定格式json字符串
Module.REsetUnverElemData = function(unverElemData){
  var jsonStr = JSON.stringify(unverElemData);
  Module.RealBIMWeb.ParseUnverelemInfo(jsonStr);
}
//高亮显示倾斜摄影单体化区域，参数为要查看的单体化id集合
Module.REshowUnverElemData = function(elemArr){
  var _s = elemArr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.HighlightUnverelem(elemIds.byteLength,elemIds.byteOffset);
}
//隐藏倾斜摄影单体化区域，参数为要隐藏的单体化id集合
Module.REhideUnverElemData = function(elemArr){
  var _s = elemArr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.CancelHighlightUnverelem(elemIds.byteLength,elemIds.byteOffset);
}
//向选择集添加单体化区域，参数为要添加的单体化id集合
Module.REaddToSelUElemIDs = function(elemArr){
  var _s = elemArr.length;
  var _s01 = (_s*4).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid], i);
  }
  Module.RealBIMWeb.AddUnverelemsToSelection(elemIds.byteLength,elemIds.byteOffset);
}
//从选择集移除单体化区域，参数为要移除的单体化id集合
Module.REremoveFromSelUElemIDs = function(elemArr){
  var _s = elemArr.length;
  var _s01 = (_s*4).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid], i);
  }
  Module.RealBIMWeb.RemoveUnverelemsToSelection(elemIds.byteLength,elemIds.byteOffset);
}
//获取单体化选择集ID
Module.REgetUnverElemIDs = function(){
  var selids =new Uint32Array(Module.RealBIMWeb.GetSelectedUnverelemId());
  var arrunverelemid=[];
  for(var i=0; i<selids.length; ++i){
    arrunverelemid.push(selids[i]);
  }
  return arrunverelemid;
}
//设置单体化区域选中颜色
//cn::u32 m_UnverelmSelectionColor = 0xff00ffff;
// clr ="FF0000"; //颜色
// alpha =25;  //透明度，255表示不透明，80表示半透明，0表示全透明
Module.REsetSelUnverElemClr = function(clr,alpha){
  var newclr01 = clr.substring(0,2); 
  var newclr02 = clr.substring(2,4); 
  var newclr03 = clr.substring(4,6); 
  var newclr = newclr03+newclr02+newclr01; 
  var clrinfo ="0xff"+newclr; 
  var clr = parseInt(clrinfo);
  Module.RealBIMWeb.SetUnverelemSelectionColor(clr, alpha, 0xff);
}
//设置单体化区域隐藏状态下的颜色
//cn::u32 m_UnverelmSelectionColor = 0xff00ffff;
// clr ="FF0000"; //颜色
// alpha =25;  //透明度，255表示不透明，80表示半透明，0表示全透明
Module.REsetUnverElemHideClr = function(clr,alpha){
  var newclr01 = clr.substring(0,2); 
  var newclr02 = clr.substring(2,4); 
  var newclr03 = clr.substring(4,6); 
  var newclr = newclr03+newclr02+newclr01; 
  if(alpha<2){alpha =2;}
  var intalphainfo =Math.round(alpha);
  var newalphainfo =(intalphainfo>15 ? (intalphainfo.toString(16)) : ("0"+intalphainfo.toString(16)));
  var clrinfo ="0x"+newalphainfo+newclr; 
  var clr = parseInt(clrinfo);
  Module.RealBIMWeb.SetUnverelemHideColor(clr);
}
//将非版本管理场景节点投射到指定高度
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的地形场景节点的名称，若为空串则表示处理所有的场景节点
//uHeightType,dHeight：  uHeightType==0：表示场景节点禁止投射到固定高度
//            uHeightType==1：dHeight表示世界空间绝对高度
//            uHeightType==2：dHeight表示非版本管理场景节点自身包围盒的相对高度范围(0~1)
//            uHeightType==3：dHeight表示整个场景的非版本复杂模型总包围盒的相对高度范围(0~1)
//dHeightAmp：表示场景节点投射到指定高度的投射强度(0~1)(uHeightType>0有效)
Module.REprojUnVerHugeGroupToHeight = function(projName,sceName,uHeightType,dHeight,dHeightAmp){
  Module.RealBIMWeb.ProjUnVerHugeGroupToHeight(projName,sceName,uHeightType,dHeight,dHeightAmp);
}

//设置非版本管理复杂模型组的区域过滤信息
//strProjName：表示要处理的项目名称，为空串则表示处理所有项目
//strGroupName：表示要处理的复杂模型组的名称标识，若为空串则表示处理所有的复杂模型组
//arrBounds：表示过滤区域的边界面序列
//bFilterInner：表示是否显示过滤区域内数据
Module.REsetUnVerHugeGroupRegionFilter = function(projName,sceName,arrBounds,bFilterInner){
  var temparray =new Module.RE_Vector_dvec4();
  for(var i=0;i<arrBounds.length;++i){
    temparray.push_back(arrBounds[i]);
  }
  return Module.RealBIMWeb.SetUnVerHugeGroupRegionFilter(projName,sceName,temparray,bFilterInner);
}

//设置非版本管理场景节点是否允许投射到项目局部可投射矢量
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的地形场景节点的名称，若为空串则表示处理所有的场景节点
Module.REsetUnVerHugeGroupProjToLocalShp = function(projName, sceName, bProjToLocalShp){
  return Module.RealBIMWeb.SetUnVerHugeGroupProjToLocalShp(projName, sceName, bProjToLocalShp);
}
//获取非版本管理场景节点是否允许投射到项目局部可投射矢量
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的地形场景节点的名称，若为空串则表示处理所有的场景节点
Module.REgetUnVerHugeGroupProjToLocalShp = function(projName, sceName){
  return Module.RealBIMWeb.GetUnVerHugeGroupProjToLocalShp(projName, sceName);
}

//设置非版本管理场景节点是否允许投射到全局可投射矢量
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的地形场景节点的名称，若为空串则表示处理所有的场景节点
Module.REsetUnVerHugeGroupProjToGolShp = function(projName, sceName, bProjToGolShp){
  return Module.RealBIMWeb.SetUnVerHugeGroupProjToGolShp(projName, sceName, bProjToGolShp);
}
//获取非版本管理场景节点是否允许投射到全局可投射矢量
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的地形场景节点的名称，若为空串则表示处理所有的场景节点
Module.REgetUnVerHugeGroupProjToGolShp = function(projName, sceName){
  return Module.RealBIMWeb.GetUnVerHugeGroupProjToGolShp(projName, sceName);
}

//设置非版本管理场景节点是否允许矢量数据投影到模型组自身
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的地形场景节点的名称，若为空串则表示处理所有的场景节点
Module.REsetUnVerHugeGroupProjToSelf = function(projName, sceName, bProjToSelf){
  return Module.RealBIMWeb.SetUnVerHugeGroupProjToSelf(projName, sceName, bProjToSelf);
}
//获取非版本管理场景节点是否允许矢量数据投影到模型组自身
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的地形场景节点的名称，若为空串则表示处理所有的场景节点
Module.REgetUnVerHugeGroupProjToSelf = function(projName, sceName){
  return Module.RealBIMWeb.GetUnVerHugeGroupProjToSelf(projName, sceName);
}


//设置鼠标悬停事件的参数
//dWaitTime：表示鼠标静止后等待多长时间才发送悬停事件
Module.REsetMouseHoverEventParam = function(dWaitTime){
  Module.RealBIMWeb.SetMouseHoverEventParam(dWaitTime);
}
//获取鼠标悬停事件的参数
Module.REgetMouseHoverEventParam = function(){
  return Module.RealBIMWeb.GetMouseHoverEventParam();
}
//设置鼠标移动事件的参数
//bEnable：表示是否向外界发送鼠标移动事件
Module.REsetMouseMoveEventParam = function(bEnable){
  Module.RealBIMWeb.SetMouseMoveEventParam(bEnable);
}
//获取鼠标悬停事件的参数
Module.REgetMouseMoveEventParam = function(){
  return Module.RealBIMWeb.GetMouseMoveEventParam();
}


//天空盒相关
//设置天空的启用状态
Module.REsetSkyEnable = function(bool){
  Module.RealBIMWeb.SetSkyEnable(bool);
}
//获取天空的启用状态
Module.REgetSkyEnable = function(){
  var bool = Module.RealBIMWeb.GetSkyEnable();
  return bool;
  var namearr = ["sce01","sce02"];
}

//设置天空盒的相关信息
Module.REsetSkyInfo = function(info){
  var temppaths = new Module.RE_Vector_Str();
  for(i=0;i<info.m_arrSkyTexPaths.length;++i){
    temppaths.push_back(info.m_arrSkyTexPaths[i]);
  }
  var _sunmode =1; var _sundir =[0.59215283, 0.63194525, -0.50000012]; var _isnight =false; var _exposescale =1.0;
  if(typeof info.m_uSunMode != 'undefined'){_sunmode =info.m_uSunMode;}
  if(typeof info.m_vSunDir != 'undefined'){_sundir =info.m_vSunDir;}
  if(typeof info.m_bIsNight != 'undefined'){_isnight =info.m_bIsNight;}
  if(typeof info.m_fExposeScale != 'undefined'){_exposescale =info.m_fExposeScale;}
  realengine_realbim_inner_skyinfo ={
    m_arrSkyTexPaths : info.m_arrSkyTexPaths,
    m_uSunMode : _sunmode,
    m_vSunDir : _sundir,
    m_bIsNight : _isnight,
    m_fExposeScale : _exposescale
  };
  var finalinfo ={
    m_arrSkyTexPaths : temppaths,
    m_bRightHand : true,
    m_bAutoSun : (_sunmode > 1) ? true : false,
    m_vDirectLDir : _sundir,
    m_vAmbLightClr : [2.0, 2.0, 2.0],
    m_vDirLightClr : ((_sunmode > 0) ? (_isnight ? [1.0, 1.0, 1.0] : [8.0, 8.0, 8.0]) : [0.0, 0.0, 0.0]),
    m_fDynExposeAmp : _isnight ? _exposescale*0.1 : _exposescale*1.0,
    m_fDynExposeRange : 10.0
  };
  Module.RealBIMWeb.SetSkyInfo(finalinfo);
}
//获取天空盒的相关信息
Module.REgetSkyInfo = function(){
  if(typeof realengine_realbim_inner_skyinfo == 'undefined'){
    realengine_realbim_inner_skyinfo ={
      m_arrSkyTexPaths : [],
      m_uSunMode : 1,
      m_vSunDir : [0.59215283, 0.63194525, -0.50000012],
      m_bIsNight : false,
      m_fExposeScale : 1.0
    };
  }
  return realengine_realbim_inner_skyinfo;
}

//设置天空盒的背景颜色
Module.REsetBackColor = function(clr){
  var tempclr01 = clr.substring(0,2); var clr01 = (parseInt(tempclr01,16)/255);
  var tempclr02 = clr.substring(2,4); var clr02 = (parseInt(tempclr02,16)/255);
  var tempclr03 = clr.substring(4,6); var clr03 = (parseInt(tempclr03,16)/255);
  var clrarr=[clr01,clr02,clr03];
  Module.RealBIMWeb.SetBackColor(clrarr);
}
//获取天空盒的背景颜色
Module.REgetBackColor = function(){
  var color= Module.RealBIMWeb.GetBackColor();
  return color;
}

//设置天空大气散射激活状态
//bActive：若激活则禁用静态天空盒及一系列相关光照参数；否则恢复静态天空盒及一系列光照参数
Module.REsetSkyAtmActive = function(bActive){
  Module.RealBIMWeb.SetSkyAtmActive(bActive);
}
//获取天空大气散射激活状态
Module.REgetSkyAtmActive = function(){
  return Module.RealBIMWeb.GetSkyAtmActive();
}
//设置天空大气散射的雾效强度
//范围0~10
Module.REsetSkyAtmFogAmp = function(fAmp){
  var tempamp = Math.max(0,Math.min(fAmp,10));
  Module.RealBIMWeb.SetSkyAtmFogAmp(tempamp);
}
//获取天空大气散射的雾效强度
Module.REgetSkyAtmFogAmp = function(){
  return Module.RealBIMWeb.GetSkyAtmFogAmp();
}

//获取场景所有地形和倾斜摄影模型的节点
Module.REgetAllUnVerHugeGroupIDs = function(projName) {
  var arr1 = Module.RealBIMWeb.GetAllUnVerHugeGroupNames((typeof projName != 'undefined') ? projName : "");
  var namearr = [];
  for(i =0; i<arr1.size(); ++i){
    namearr.push(arr1.get(i));
  }
  return namearr;
}
//设置非BIM模型的透明度
Module.REsetUnVerHugeGroupAlpha = function(projName,sceName,alpha){
  var _info = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(projName,sceName);
  if(_info.m_uDestAlpha==0 && _info.m_uDestAlphaAmp==0 && _info.m_uDestRGBBlendInfo==0){
    Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(projName,sceName, {m_uDestAlpha:alpha,m_uDestAlphaAmp:255,m_uDestRGBBlendInfo:0x00000000});
  }else{
    Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(projName,sceName, {m_uDestAlpha:alpha,m_uDestAlphaAmp:255,m_uDestRGBBlendInfo:_info.m_uDestRGBBlendInfo});
  }
}
//获取当前设置的非BIM模型的透明度
Module.REgetUnVerHugeGroupAlpha = function(projName,sceName){
  var alpha = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(projName,sceName);
  return alpha.m_uDestAlpha;
}
//设置非BIM模型的颜色
Module.REsetUnVerHugeGroupClr = function(projName,sceName,clr){
  var _clr = Module.REclrFix(clr,255); 
  var _info = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(projName,sceName);
  if(_info.m_uDestAlpha==0 && _info.m_uDestAlphaAmp==0 && _info.m_uDestRGBBlendInfo==0){
    Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(projName,sceName, {m_uDestAlpha:255,m_uDestAlphaAmp:255,m_uDestRGBBlendInfo:_clr});
  }else{
    Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(projName,sceName, {m_uDestAlpha:_info.m_uDestAlpha,m_uDestAlphaAmp:255,m_uDestRGBBlendInfo:_clr});
  }
}

//设置引擎UI按钮面板是否可见
Module.REsetUIPanelVisible = function(bool){
  Module.RealBIMWeb.SetBuiltInUIVisible(bool);
}
//设置引擎右上方ViewCube是否可见
Module.REsetViewCubeVisible = function(bool){
  Module.RealBIMWeb.SetViewCubeVisibility(bool);
}
//设置UI工具条的颜色风格
//usedarkui:0表示默认浅色风格，1表示深色风格
Module.REsetUIColorStyle = function(usedarkui){
  Module.RealBIMWeb.SetBuiltInUIColorStyle(usedarkui);
}
//设置地理坐标系UI是否允许显示
Module.REsetGeoCoordVisible = function(bool){
  Module.RealBIMWeb.SetGeoCoordDisplayable(bool);
}
//获取地理坐标系UI显示状态
Module.REgetGeoCoordVisible = function(){
  return Module.RealBIMWeb.GetGeoCoordDisplayable();
}
//重置所有元素的显示状态（弃用）
Module.REresetUserOperation = function(){
  Module.RealBIMWeb.ResetUserOperation(0);
}

//获取场景所有BIM模型的节点名称
Module.REgetAllHugeGroupIDs = function(projName){
  var arr1 =Module.RealBIMWeb.GetAllHugeObjNames((typeof projName != 'undefined') ? projName : "");
  var nameArr = [];
  for(i =0; i<arr1.size(); ++i){
    nameArr.push(arr1.get(i));
  }
  return nameArr;
}
//获取当前场景的所有可见元素id
Module.REgetEleIDsBySceID = function(sceName,visibalOnly,projName){
  var _projName = "DefaultProj"; if(typeof projName != 'undefined'){_projName = projName;}
  var tempelemids =new Uint32Array(Module.RealBIMWeb.GetHugeObjSubElemIDs(_projName,sceName,visibalOnly));
  var elemIds = [];
  for(i =0; i<tempelemids.length; i+=2){
    elemIds.push(tempelemids[i]);
  }
  return elemIds;
}

//正交投影下开始添加剖切线顶点
Module.REclipWithTwoPoint = function(clipDir){
  if(clipDir == "horizontal"){
    return Module.RealBIMWeb.OrthographicBeginAddClippingVertex(Module.RE_CLIP_DIR.HORIZONTAL);
  }else if(clipDir == "vertical"){
    return Module.RealBIMWeb.OrthographicBeginAddClippingVertex(Module.RE_CLIP_DIR.VERTICAL);
  }
}
//正交投影下退出剖切状态
Module.REexitClipWithTwoPoint = function(){
  Module.RealBIMWeb.OrthographicEndSceneClipping();
}
//进入单面剖切状态
Module.REbeginSingleClip = function(){
  Module.RealBIMWeb.OnSingleSurfaceClipClicked();
}
//设置剖切完成后是否自动聚焦到剖切面
Module.REisAutoFocusWithClip = function(bool){
  Module.RealBIMWeb.setTargetToClipPlane(bool);
}

//进入计算任意点到围栏最短距离的操作状态
Module.REbeginShowDis = function(){
  return Module.RealBIMWeb.EnterPotAndFenceDistMeasureState();
}
//退出计算任意点到围栏最短距离的操作状态
Module.REendShowDis = function(){
  Module.RealBIMWeb.ExitPotAndFenceDistMeasureState();
}
//在屏幕上显示两个点之间的距离
Module.REshowDistWithTwoPoint = function(point1,point2,text){
  Module.RealBIMWeb.DrawHoriMeasureData(point1,point2,text);
}
//清除屏幕上的两点之间信息的信息
Module.REclearDistWithTwoPoint = function(){
  Module.RealBIMWeb.ClearHoriMeasureData();
}
//在屏幕上显示两个点之间的距离（扩展接口）
//point1,point2,mode:线段的两个端点坐标
//mode:显示模式，可显示线段、水平线、铅锤线，其组合有以下几种有效值:
// 1:显示线段本身并显示线段长度
// 2:显示水平线并显示水平距离
// 3:同时显示1和2模式下的内容
// 4:显示铅锤线并显示垂直距离
// 5:同时显示1和4模式下的内容
// 6:同时显示2和4模式下的内容
// 7:同时显示1和2和4模式下的内容
Module.REshowDistWithTwoPointExt = function(point1,point2,mode){
  Module.RealBIMWeb.DrawMeasureDataOfLineSegment(point1,point2,mode);
}
//清除屏幕上的两点之间信息的信息（扩展接口）
Module.REclearDistWithTwoPointExt = function(){
  Module.RealBIMWeb.ClearMeasureDataOfLineSegment();
}


//设置测量线的颜色
//strShapeType为系统约定的字符串描述，合法值和意义如下:
//"BaseLine":设置基本测量线的颜色
//"Length_H":设置长度测量时水平线的颜色
//"Length_V":设置长度测量时垂直线的颜色
//"AreaEdge":设置面积测量区轮廓线的颜色
//"AreaFace":设置面积测量区面填充的颜色
//clr:十六进制例“ffffff”
//alpha:表示透明度，0~255，255表示不透,0表示全透
Module.REsetMeasureShapeColor = function(strShapeType,clr,alpha){
  var uclr = Module.REclrFix(clr,alpha);
  Module.RealBIMWeb.SetMeasureShapeColor(strShapeType,uclr);
}
//设置测量显示文字的样式
//strShapeType为系统约定的字符串描述，合法值和意义如下:
//"Length":设置每段长度文字的样式，包括字体样式和颜色透明度
//"Length_H":设置长度测量时水平距离文字的样式
//"Length_V":设置长度测量时垂直高度文字的样式
//"Total_Length":设置总长度文字的样式
//"Angle":设置角度测量时文字的样式
//"Area":设置面积测量时文字的样式
//"Slope":设置坡度显示的文字的样式
Module.REsetMeasureTextStyle = function(strShapeType,fontStyle,clr,alpha,isBorder){
  var uclr = Module.REclrFix(clr,alpha);
  var tempshapetype = isBorder?(strShapeType+"_Border"):strShapeType;
  var _fontStyle = "RealBIMFont001"; if(fontStyle != ""){_fontStyle = fontStyle;}
  Module.RealBIMWeb.SetMeasureTextColor(tempshapetype,uclr);
  Module.RealBIMWeb.SetMeasureTextFontName(tempshapetype,_fontStyle);
}
//重置测量样式为系统默认样式
Module.REresetMeasureShapeAppearance = function(){
  Module.RealBIMWeb.ResetMeasureShapeAppearance();
}
//坡度显示开关
Module.REsetSlopeVisible = function(bool){
  Module.RealBIMWeb.SetSlopeVisible(bool);
}


//获取相机自动动画启用状态
Module.REgetAutoCamAnimEnable = function(){
  return Module.RealBIMWeb.GetAutoCamAnimEnable();
}
//设置相机自动动画参数
Module.REsetAutoCamAnimParams = function(pot,speed,bool){
  var val = 2*3.1415/speed;
  Module.RealBIMWeb.SetAutoCamAnimParams(pot,val);
  Module.RealBIMWeb.SetAutoCamAnimEnable(bool);
}


//设置引擎世界空间对应的坐标参考系信息
//strCRS：表示引擎世界空间对应的坐标参考系描述符(标准PROJ坐标系字符串)，为空串表示无特殊地理信息坐标系
//返回值：返回是否设置成功
Module.REsetEngineWorldCRS = function(strCRS){
  return Module.RealBIMWeb.SetEngineWorldCRS(strCRS);
}
//获取引擎世界空间坐标系描述符
Module.REgetEngineWorldCRS = function(){
  return Module.RealBIMWeb.GetEngineWorldCRS();
}

//在引擎世界空间坐标与目标地理信息坐标间进行转换
//bForward：true->由引擎世界空间坐标转换到目标地理信息坐标；false->由目标地理信息坐标转换到引擎世界空间坐标
//strDestCRS：表示目标坐标系描述符，当引擎坐标系描述符和目标坐标系描述符均为空时则坐标无需转换成功返回，否则任一描述符为空将导致转换失败
//srcCoords：输入待转换的坐标数组
Module.REtransEngineCoords = function(bForward, strDestCRS, srcCoords){
  var _s = srcCoords.length;  var _s01 = (_s*24).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); var temparr1 =Module.RealBIMWeb.GetHeapView_Double(0);
  for(i =0; i<_s; ++i)
  {
    temparr1[i*3+0] =srcCoords[i][0]; temparr1[i*3+1] =srcCoords[i][1]; temparr1[i*3+2] =srcCoords[i][2];
  }
  var temparr2 =[];
  if(Module.RealBIMWeb.TransEngineCoords(bForward,strDestCRS,temparr1.byteLength,temparr1.byteOffset)){
   for(i =0; i<_s; ++i)
    {
      temparr2.push([temparr1[i*3+0], temparr1[i*3+1], temparr1[i*3+2]]); 
    }
  }
  return temparr2;
}

//进行地理信息坐标转换
//strSrcCRS：表示源坐标系描述符
//strDestCRS：表示目标坐标系描述符
//srcCoords：输入待转换的坐标数组，每个坐标是4个DOUBLE的数组[x,y,z,w]
//					   坐标顺序定义为：
//             1.经纬度坐标系：x:经度  y:纬度  z：高程  w:测绘时间
//             2.投影坐标系：x:东西方向坐标  y:南北方向投影
Module.REtransGeoCoords = function(strSrcCRS, strDestCRS, srcCoords){
  var _s = srcCoords.length;  var _s01 = (_s*32).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); var temparr1 =Module.RealBIMWeb.GetHeapView_Double(0);
  for(i =0; i<_s; ++i)
  {
    temparr1[i*4+0] =srcCoords[i][0]; temparr1[i*4+1] =srcCoords[i][1]; temparr1[i*4+2] =srcCoords[i][2]; temparr1[i*4+3] =srcCoords[i][3]; 
  }
  var temparr2 =[];
  if(Module.RealBIMWeb.TransGeoCoords(strSrcCRS,strDestCRS,temparr1.byteLength,temparr1.byteOffset)){
   for(i =0; i<_s; ++i)
    {
      temparr2.push([temparr1[i*4+0], temparr1[i*4+1], temparr1[i*4+2], temparr1[i*4+3]]); 
    }
  }
  return temparr2;
}

//地理坐标信息相关
//增加一套地理信息坐标系
//strName：表示地理坐标系的标识名
//strCRS:表示坐标系描述符
Module.REaddGeoCoord = function(strName,strCRS){
  return Module.RealBIMWeb.AddGeoCoord(strName,strCRS);
}
//地理坐标信息相关
//增加一套自定义坐标系
Module.REaddCustomCoord = function(name,refPointArr,targetPointArr){
  var ref01 = refPointArr[0];var ref02 = refPointArr[1];var ref03 = refPointArr[2];var ref04 = refPointArr[3];
  var target01 = targetPointArr[0];var target02 = targetPointArr[1];var target03 = targetPointArr[2];var target04 = targetPointArr[3];
  return Module.RealBIMWeb.AddCustomCoord(name,ref01,ref02,ref03,ref04,target01,target02,target03,target04);
}
//删除一套地理信息坐标
Module.REdelGeoCoordInfo = function(name){
  return Module.RealBIMWeb.DelGeoCoordInfo(name);
}


// 轴网相关
//设置一组的轴网数据
//strGroupName:组名称
//arrGridData:轴网数据集合
// [{
//     "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684a6",
//     "name": "A",
//     "color": "000000",
//     "alpha": 255,
//     "pos": [[-182.65852,140.81303,0.0],[-243.75598,103.65058,0.0]]
//   },
//   {
//     "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684b2",
//     "name": "E",
//     "color": "FF0000",
//     "alpha": 1,
//     "pos": [[-263.46043,141.84199,0.0],[-239.0002,101.6278,0.0]]
//   }]
Module.REsetGridData = function(strGroupName,arrGridData){
  var tempGrids =new BlackHole3D.RE_Vector_GRID();
  for(var i=0; i<arrGridData.length; ++i){
    var tempArrPos =new BlackHole3D.RE_Vector_vec3();
    tempArrPos.push_back(arrGridData[i].pos[0]);
    tempArrPos.push_back(arrGridData[i].pos[1]);
    var tempclr = Module.REclrFix(arrGridData[i].color,arrGridData[i].alpha);
    var tempobj ={
      m_strGuid: arrGridData[i].guid,
      m_strName: arrGridData[i].name,
      m_uColor: tempclr,
      m_arrPos: tempArrPos
    };
    tempGrids.push_back(tempobj);
  }
  Module.RealBIMWeb.SetGridData(strGroupName,tempGrids);
}
//获取当前添加的所有轴网组名称
Module.REgetAllGridGroupName = function(){
  var allgirdname = Module.RealBIMWeb.GetAllGridGroupName();
  var nameArr = [];
  for(var i =0; i<allgirdname.size(); ++i){
    nameArr.push(allgirdname.get(i));
  }
  return nameArr;
}
//根据组名称获取该组轴网的guid集合
//strGroupName:组名称
Module.REgetGridGuid = function(strGroupName){
  var allguidname = Module.RealBIMWeb.GetGridGuid(strGroupName);
  var nameArr = [];
  for(var i =0; i<allguidname.size(); ++i){
    nameArr.push(allguidname.get(i));
  }
  return nameArr;
}
//根据组名称删除该组轴网数据
//arrGroupName:组名称数组集合，为空数组表示删除全部
Module.REdelGridData = function(arrGroupName){
  var tempGridsName =new BlackHole3D.RE_Vector_WStr();
  for(var i=0;i<arrGroupName.length;++i){
    tempGridsName.push_back(arrGroupName[i]);
  }
  Module.RealBIMWeb.DelGridData(tempGridsName);
}
//设置轴网的显示颜色
//strGroupName:组名称
//arrStrGridID:轴网guid集合，如果size为0则设置组内所有轴网
//color:目标颜色
//alpha:目标透明度
Module.REsetGridColor = function(strGroupName,arrStrGridID,color,alpha){
  var tempGrids =new BlackHole3D.RE_Vector_WStr();
  for(var i=0;i<arrStrGridID.length;++i){
    tempGrids.push_back(arrStrGridID[i]);
  }
  var tempclr = Module.REclrFix(color,alpha);
  Module.RealBIMWeb.SetGridColor(strGroupName,tempGrids,tempclr);
}
//设置轴网是否可探测
//bEnable:true表示可以被鼠标点击拾取；false表示禁止
//arrStrGridID:轴网名称数组，如果size为0则设置所有轴网
Module.REsetGridProbeEnable = function(bEnable,arrGroupName){
  var tempGrids =new BlackHole3D.RE_Vector_WStr();
  for(var i=0;i<arrGroupName.length;++i){
    tempGrids.push_back(arrGroupName[i]);
  }
  Module.RealBIMWeb.SetGridProbeEnable(bEnable,tempGrids);
}
//设置轴网的可见性
//bEnable:true表示可见；false表示不可见
//arrStrGridID:轴网名称数组，如果size为0则设置所有轴网
Module.REsetGridVisible = function(bEnable,arrGroupName){
  var tempGrids =new BlackHole3D.RE_Vector_WStr();
  for(var i=0;i<arrGroupName.length;++i){
    tempGrids.push_back(arrGroupName[i]);
  }
  Module.RealBIMWeb.SetGridVisible(bEnable,tempGrids);
}
//设置轴网是否允许被模型遮挡
//bEnable:true表示允许；false表示不允许
Module.REsetGridContactSce = function(bEnable){
  Module.RealBIMWeb.SetGridContactSce(bEnable);
}
//获取当前设置的轴网是否被允许遮挡状态
Module.REgetGridContactSce = function(){
  Module.RealBIMWeb.GetGridContactSce();
}

//标高相关
//设置一组的标高数据
//strGroupName:组名称
//arrLevelData:标高数据集合
//projName：表示要处理的项目名称
// [{
//     "guid": "4ce36d02-761a-444e-8d94-5aebd1a2545e-001684ec",
//     "name": "屋顶机房自动喷淋平面图",
//     "color": "000000",
//     "alpha": 255,
//     "height": 19.0,
//     "height_top": 23.0,
//     "height_bottom": 19.0
//   },
//   {
//     "guid": "3db99485-2f80-4659-b554-f76497fd758f-002319b7",
//     "name": "四层弱电平面图",
//     "color": "000000",
//     "alpha": 255,
//     "height": 14.5,
//     "height_top": 16.8,
//     "height_bottom": 14.5
//   }]
Module.REsetLevelData = function(strGroupName,arrLevelData,projName){
  var tempLevels =new BlackHole3D.RE_Vector_LEVEL();
  for(var i=0; i<arrLevelData.length; ++i){
    var tempclr = Module.REclrFix(arrLevelData[i].color,arrLevelData[i].alpha);
    var tempobj ={
        m_strGuid: arrLevelData[i].guid,
        m_strName: arrLevelData[i].name,
        m_uColor:tempclr,
        m_dHeight:arrLevelData[i].height,
        m_dTopHeight:arrLevelData[i].height_top,
        m_dBottomHeight:arrLevelData[i].height_bottom
    };
    tempLevels.push_back(tempobj);
  }
  Module.RealBIMWeb.SetLevelData(strGroupName,tempLevels,projName);
}
//获取当前添加的所有标高组名称
Module.REgetAllLevelGroupName = function(){
  var alllevelname = Module.RealBIMWeb.GetAllLevelGroupName();
  var nameArr = [];
  for(var i =0; i<alllevelname.size(); ++i){
    nameArr.push(alllevelname.get(i));
  }
  return nameArr;
}
//根据组名称获取该组标高的guid集合
//strGroupName:组名称
Module.REgetLevelGuid = function(strGroupName){
  var allguidname = Module.RealBIMWeb.GetLevelGuid(strGroupName);
  var nameArr = [];
  for(var i =0; i<allguidname.size(); ++i){
    nameArr.push(allguidname.get(i));
  }
  return nameArr;
}
//根据组名称删除该组标高数据
//arrGroupName:组名称数组集合，为空数组表示删除全部
Module.REdelLevelData = function(arrGroupName){
  var tempLevelName =new BlackHole3D.RE_Vector_WStr();
  for(var i=0;i<arrGroupName.length;++i){
    tempLevelName.push_back(arrGroupName[i]);
  }
  Module.RealBIMWeb.DelLevelData(tempLevelName);
}
//设置标高的显示颜色
//strGroupName:组名称
//arrStrLevelID:标高guid集合，如果size为0则设置组内所有标高
//color:目标颜色
//alpha:目标透明度
Module.REsetLevelColor = function(strGroupName,arrStrLevelID,color,alpha){
  var tempLevels =new BlackHole3D.RE_Vector_WStr();
  for(var i=0;i<arrStrLevelID.length;++i){
    tempLevels.push_back(arrStrLevelID[i]);
  }
  var tempclr = Module.REclrFix(color,alpha);
  Module.RealBIMWeb.SetLevelColor(strGroupName,tempLevels,tempclr);
}
//设置标高是否可探测
//bEnable:true表示可以被鼠标点击拾取；false表示禁止
//arrStrLevelID:标高名称数组，如果size为0则设置所有标高
Module.REsetLevelProbeEnable = function(bEnable,arrGroupName){
  var tempLevels =new BlackHole3D.RE_Vector_WStr();
  for(var i=0;i<arrGroupName.length;++i){
    tempLevels.push_back(arrGroupName[i]);
  }
  Module.RealBIMWeb.SetLevelProbeEnable(bEnable,tempLevels);
}
//设置标高的可见性
//bEnable:true表示可见；false表示不可见
//arrStrLevelID:标高名称数组，如果size为0则设置所有标高
Module.REsetLevelVisible = function(bEnable,arrGroupName){
  var tempLevels =new BlackHole3D.RE_Vector_WStr();
  for(var i=0;i<arrGroupName.length;++i){
    tempLevels.push_back(arrGroupName[i]);
  }
  Module.RealBIMWeb.SetLevelVisible(bEnable,tempLevels);
}
//根据标高的guid获取三个高度值
//strGroupName:组名称
//arrStrLevelID:标高guid
Module.REgetLevelDataByGuid = function(strGroupName,arrStrLevelID){
  return Module.RealBIMWeb.GetLevelHeightInfo(strGroupName,arrStrLevelID);
}


//获取系统中的全局元素骨骼总数
Module.REgetGolElemBoneNum = function(){
  return Module.RealBIMWeb.GetGolElemBoneNum();
}
//设置场景内构件集合使用的全局骨骼索引
//要绑定到某一个骨骼上的元素ID集合，array类型，为空表示设置场景内的全部构件
//uBoneID：要设置的骨骼索引
Module.REbindElemToBoneID = function(uElemArr,uBoneID){
  var _s = uElemArr.length;
  if(_s ==0){
    Module.RealBIMWeb.SetHugeObjSubElemBoneIDs("","", 0xffffffff, 0, uBoneID); //绑定全部构件
  }else{
    var temparr=[];
    for(var i=0;i<_s;++i){
      temparr.push(uElemArr[i]);
      temparr.push(0);
    }
    var selids = new Uint32Array(temparr);
    var tempids;
    Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids =Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
    Module.RealBIMWeb.SetHugeObjSubElemBoneIDs("","", tempids.byteLength, tempids.byteOffset, uBoneID);
  }
}
//多项目设置场景内构件集合使用的全局骨骼索引
//projName:项目名称，为空字符串则表示所有项目
//uElemArr:要绑定到某一个骨骼上的元素ID集合，array类型，为空表示设置场景内的全部构件
//uBoneID：要设置的骨骼索引
Module.REbindElemToBoneID_projs = function(projName,uElemArr,uBoneID){
  if(projName==""){
    Module.RealBIMWeb.SetHugeObjSubElemBoneIDs("","", 0xffffffff, 0, uBoneID); //绑定全部构件
  }else{
    var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
    var _s = uElemArr.length;
    if(_s ==0){
      Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(projName,"", 0xffffffff, 0, uBoneID); //绑定全部构件
    }else{
      var temparr=[];
      for(var i=0;i<_s;++i){
        temparr.push(uElemArr[i]);
        temparr.push(projid);
      }
      var selids = new Uint32Array(temparr);
      Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); 
      var tempids =Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
      Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(projName,"", tempids.byteLength, tempids.byteOffset, uBoneID);
    }
  }
}
//设置全局元素骨骼的目标方位
//uBoneID：表示骨骼全局ID
//cDestLoc：表示骨骼的目标方位
//dInterval：表示骨骼从当前方位过渡到目标方位所需的时长
//uProcBatch：表示骨骼的方位过渡批次
//bSendPostEvent：表示骨骼方位过渡完毕后是否发送事件消息
Module.REsetGolElemBoneDestLoc = function(uBoneID,cDestLoc,dInterval,uProcBatch,bSendPostEvent){
  return Module.RealBIMWeb.SetGolElemBoneDestLoc(uBoneID,cDestLoc,dInterval,uProcBatch,bSendPostEvent);
}
//设置全局元素骨骼的目标方位扩展版,增加缩放系数
//uBoneID：表示骨骼全局ID
//cDestLoc：表示骨骼的目标方位
//dInterval：表示骨骼从当前方位过渡到目标方位所需的时长
//uProcBatch：表示骨骼的方位过渡批次
//bSendPostEvent：表示骨骼方位过渡完毕后是否发送事件消息
Module.REsetGolElemBoneDestLocExt = function(uBoneID,cDestLoc,dInterval,uProcBatch,bSendPostEvent){
  return Module.RealBIMWeb.SetGolElemBoneDestLocExt(uBoneID,cDestLoc,dInterval,uProcBatch,bSendPostEvent);
}
//重置所有全局元素骨骼为默认方位
Module.REresetAllGolElemBones = function(){
  Module.RealBIMWeb.ResetAllGolElemBones();
}


//暂停渲染主循环
Module.REpauseRenderLoop = function()
{
  Module.RealBIMWeb.PauseRenderLoop();
}
//恢复渲染主循环
Module.REresumeRenderLoop = function()
{
  Module.RealBIMWeb.ResumeRenderLoop();
}


//设置网络资源加载是否使用缓存
Module.REsetUseWebCache = function(bUseWebCache)
{
  Module.RealBIMWeb.SetUseWebCache(bUseWebCache);
}
//获取网络资源加载是否使用缓存
Module.REgetUseWebCache = function()
{
  return Module.RealBIMWeb.GetUseWebCache();
}


// 字体设置相关
// 增加一种全局字体
Module.REaddAGolFont = function(fontId,height,width,weight){
  var _fontId = fontId.toString();
  var _fontinfo={
    m_bAntialiased: false, 
    m_fItalicRatio: 0, 
    m_sSilhouetteAmp: -64, 
    m_sWeightAmp: weight*64, 
    m_uHeight: height, 
    m_uWidth: width, 
    m_strFontType: "宋体", 
    m_strGolFontID: _fontId,
    m_strTexAtlasName: ""
  };
  return Module.RealBIMWeb.AddAGolFont(_fontinfo);
}
// 删除一种全局字体
Module.REdelAGolFont = function(fontId){
  var _fontId=fontId.toString();
  return Module.RealBIMWeb.DelAGolFont(_fontId);
}
// 获取全局字体数量
Module.REgetGolFontNum = function(){
  return Module.RealBIMWeb.GetGolFontNum();
}
// 获取一种全局字体信息
Module.REgetAGolFont = function(fontId){
  var _fontId=fontId.toString();
  return Module.RealBIMWeb.GetAGolFont(_fontId);
}
//获取全部全局字体信息
Module.REgetAllGolFont = function(){
  return Module.RealBIMWeb.GetAllGolFonts();
}

//设置非版本管理模型的可剖切性
Module.REsetUnVerInstsClippable = function(bClippable){
  Module.RealBIMWeb.SetUnVerInstsClippable(bClippable);
}
//获取非版本管理模型的可剖切性
Module.REgetUnVerInstsClippable = function(){
  return Module.RealBIMWeb.GetUnVerInstsClippable();
}

//设置阴影开关状态
Module.REsetShadowState = function(bool){
  var sinfo = Module.RealBIMWeb.GetSceShadowInfo(); 
  sinfo.m_bShadowEnable = bool;
  Module.RealBIMWeb.SetSceShadowInfo(sinfo);
}
//获取当前阴影开关状态
Module.REgetShadowState = function(){
  var shadowinfo = Module.RealBIMWeb.GetSceShadowInfo();
  return shadowinfo.m_bShadowEnable;
}

//设置阴影详细信息
Module.REsetShadowInfo = function(info){
  Module.RealBIMWeb.SetSceShadowInfo(info);
}
//获取当前阴影详细信息
Module.REgetShadowInfo = function(){
  return Module.RealBIMWeb.GetSceShadowInfo();
}

//设置场景光源方向
Module.REsetLightDir = function(vDir){
  var sinfo = Module.RealBIMWeb.GetSceLightInfo(); 
  sinfo.m_vDirectLDir =vDir;
  Module.RealBIMWeb.SetSceLightInfo(sinfo);
}
//获取当前场景光源方向
Module.REgetLightDir = function(){
  return Module.RealBIMWeb.GetSceLightInfo().m_vDirectLDir;
}

//设置场景光晕开关状态
Module.REsetGhostState = function(bool){
  var sinfo = Module.RealBIMWeb.GetSceLightInfo(); 
  if(bool){sinfo.m_fGhostAmp = 0.5;}else{sinfo.m_fGhostAmp = 0;}
  Module.RealBIMWeb.SetSceLightInfo(sinfo);
}
//获取当前场景光晕开关状态
Module.REgetGhostState = function(){
  var ghostinfo = Module.RealBIMWeb.GetSceLightInfo();
  var _info = (ghostinfo.m_fGhostAmp==0)?0:1;
  return _info;
}

//设置场景环境遮蔽开关状态
Module.REsetAOState = function(bool){
  var _info = Module.RealBIMWeb.GetSceAOInfo(); 
  if(bool){_info.m_fMinLum = 0.1;}else{_info.m_fMinLum = 1.0;}
  Module.RealBIMWeb.SetSceAOInfo(_info);
}
//获取当前场景环境遮蔽开关状态
Module.REgetAOState = function(){
  var _info = Module.RealBIMWeb.GetSceAOInfo();
  return (_info.m_fMinLum < 0.999) ? true : false;
}

//设置场景实时反射开关状态
Module.REsetReflState = function(bool){
  var _info = Module.RealBIMWeb.GetSceReflInfo(); 
  if(bool){_info.m_uQuality = 1;}else{_info.m_uQuality = 0;}
  Module.RealBIMWeb.SetSceReflInfo(_info);
}
//获取当前场景实时反射开关状态
Module.REgetReflState = function(){
  var _info = Module.RealBIMWeb.GetSceReflInfo();
  return (_info.m_uQuality > 0) ? true : false;
}

//设置场景OIT渲染等级(0->关闭OIT；1->UI开启；2->场景矢量开启1；3->模型开启；4->场景矢量开启2)
Module.REsetSceOITLev = function(level){
  Module.RealBIMWeb.SetSceOITLev(level);
}
//获取场景OIT渲染等级
Module.REgetSceOITLev = function(){
  return Module.RealBIMWeb.GetSceOITLev();
}

//设置边缘高光效果的启用状态
Module.REsetHugeModelBorderEmisEnable = function(bool){
  Module.RealBIMWeb.SetHugeModelBorderEmisEnable(bool);
}
//获取边缘高光效果的启用状态
Module.REgetHugeModelBorderEmisEnable = function(){
  return Module.RealBIMWeb.GetHugeModelBorderEmisEnable();
}

//设置世界空间下的全局裁剪面的裁剪边界处的颜色混合信息
//blendinfo：<x,y,z>表示目标颜色，<w>表示目标颜色权重
Module.REsetGolClipPlanesBorderClrBlendInfo = function(blendinfo)
{
  var tempinfo = [blendinfo[0]/255,blendinfo[1]/255,blendinfo[2]/255,blendinfo[3]];
  Module.RealBIMWeb.SetGolClipPlanesBorderClrBlendInfo(tempinfo);
}
//获取世界空间下的全局裁剪面的裁剪边界处的颜色混合信息
Module.REgetGolClipPlanesBorderClrBlendInfo = function()
{
  var tempinfo = Module.RealBIMWeb.GetGolClipPlanesBorderClrBlendInfo();
  var blendinfo = [parseInt(tempinfo[0]*255),parseInt(tempinfo[1]*255),parseInt(tempinfo[2]*255),tempinfo[3]];
  return blendinfo;
}
//设置场景实时反射开关状态
Module.REsetReflState = function(bool){
  var _info = Module.RealBIMWeb.GetSceReflInfo(); 
  if(bool){_info.m_uQuality = 1;}else{_info.m_uQuality = 0;}
  Module.RealBIMWeb.SetSceReflInfo(_info);
}
//获取当前场景实时反射开关状态
Module.REgetReflState = function(){
  var _info = Module.RealBIMWeb.GetSceReflInfo();
  return (_info.m_uQuality > 0) ? true : false;
}
//设置地形边缘高光属性
Module.REsetUnVerHugeGroupBorderEmis = function(projName,sceName,amp,range){
  var emis = [amp,range];
  return Module.RealBIMWeb.SetUnVerHugeGroupBorderEmis(projName,sceName,emis);
}
//获取地形边缘高光属性
Module.REgetUnVerHugeGroupBorderEmis = function(projName,sceName){
  return Module.RealBIMWeb.GetUnVerHugeGroupBorderEmis(projName,sceName);
}
//设置模型边缘高光属性
Module.REsetHugeObjBorderEmis = function(projName,sceName,amp,range){
  var emis = [amp,range];
  return Module.RealBIMWeb.SetHugeObjBorderEmis(projName,sceName,emis);
}
//获取模型边缘高光属性
Module.REgetHugeObjBorderEmis = function(projName,sceName){
  return Module.RealBIMWeb.GetHugeObjBorderEmis(projName,sceName);
}


//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的场景节点名称，为空串则表示处理所有场景节点
//clrInfo：设置模型边界线颜色混合信息,RGBA,例[255,0,0,1](Alpha==-1表示禁用边界线；Alpha==0表示边界线启用但隐藏；Alpha为(0,1]表示边界线颜色的权重系数)
Module.REsetHugeObjBorderLineClr = function(projName,sceName,clrInfo){
  var tempclr =[clrInfo[0]/255,clrInfo[1]/255,clrInfo[2]/255,clrInfo[3]];
  return Module.RealBIMWeb.SetHugeObjBorderLineClr(projName,sceName,tempclr);
}
//获取模型边界线颜色混合信息
Module.REgetHugeObjBorderLineClr = function(projName,sceName){
  var tempclr = Module.RealBIMWeb.GetHugeObjBorderLineClr(projName,sceName);
  var clr = [tempclr[0]*255,tempclr[1]*255,tempclr[2]*255,tempclr[3]];
  return clr;
}


// 添加复杂标签样式1
Module.REaddCustomTag01 = function(tagName, pos, tag_w1, tag_w2, tag_h1, tag_h2, caption, contents, pics, captionClr, contentsClr, backClr, frameClr) {
  temptags = new Module.RE_Vector_TAG();
  temptexregions = new Module.RE_Vector_SHP_TEX();
  for (i = 0; i < pics.length; ++i) {
      temptexregions.push_back({
          m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0], m_uFrameNumU: 1, m_uFrameNumV: 1, m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
          m_strTexPath: pics[i]["path"], m_qTexRect: pics[i]["rect"], m_uTexClrMult: 0xe0ffffff,
      });
  }
  temptextregions = new Module.RE_Vector_SHP_TEXT();
  temptextregions.push_back({
      m_strGolFontID: "RealBIMFont002", m_bTextWeight: true, m_uTextClr: captionClr, m_uTextBorderClr: 0x00000000,
      m_strText: caption,
      m_qTextRect: [-tag_w1 / 2, 0, tag_w1 / 2, tag_h1],
      m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x10/*TEXT_FMT_HCENTER*/ /*| 0x40TEXT_FMT_NOCLIP*/ /*| 0x100TEXT_FMT_WORDBREAK*/),
      m_uTextBackMode:0, m_sTextBackBorder:0, m_uTextBackClr:0x00000000
  });
  for (i = 0; i < contents.length; ++i) {
      temptextregions.push_back({
          m_strGolFontID: "RealBIMFont001", m_bTextWeight: false, m_uTextClr: contentsClr, m_uTextBorderClr: 0x00000000,
          m_strText: contents[i],
          m_qTextRect: [-tag_w1 / 2, -(i + 1) * tag_h2, -tag_w1 / 2 + tag_w2, -i * tag_h2],
          m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x8/*TEXT_FMT_LEFT*/ | 0x40/*TEXT_FMT_NOCLIP*/ | 0x100/*TEXT_FMT_WORDBREAK*/),
          m_uTextBackMode:0, m_sTextBackBorder:0, m_uTextBackClr:0x00000000
      });
  }
  tempobj = {
      m_strName: tagName, m_vPos: pos,
      m_vBgMinSize: [50, 10], m_vBgPadding: [5, 5], m_uBgAlignX: 1, m_uBgAlignY: 1,
      m_vArrowOrigin: [-5, 20], m_uBgColor: backClr,
      m_arrTexContents: temptexregions, m_arrTextContents: temptextregions,
  };

  frameline ={
      m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0], m_uFrameNumU: 1, m_uFrameNumV: 1, m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
      m_strTexPath: "", m_qTexRect: [0, 0, 0, 0], m_uTexClrMult: frameClr,
  };
  var framelinewidth = 2; var framegap = 6;
  frameline["m_qTexRect"] = [-tag_w1/2-framegap, tag_h1, tag_w1/2+framegap, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [-tag_w1/2-framegap, -framelinewidth, tag_w1/2+framegap, 0]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [-tag_w1/2-framegap, -tag_h2*contents.length-framelinewidth, tag_w1/2+framegap, -tag_h2*contents.length]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [-tag_w1/2-framegap, -tag_h2*contents.length-framelinewidth, -tag_w1/2-framegap+framelinewidth, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [tag_w1/2+framegap-framelinewidth, -tag_h2*contents.length-framelinewidth, tag_w1/2+framegap, tag_h1+framelinewidth]; temptexregions.push_back(frameline);

  temptags.push_back(tempobj);
  Module.RealBIMWeb.AddTags(temptags);
}
// 添加复杂标签样式2
Module.REaddCustomTag02 = function(tagName, pos, tag_w, tag_h1, tag_h2, caption, contents, captionClr, contentsClr, backClr, frameClr) {
  temptags = new Module.RE_Vector_TAG();
  temptexregions = new Module.RE_Vector_SHP_TEX();
  temptextregions = new Module.RE_Vector_SHP_TEXT();
  temptextregions.push_back({
      m_strGolFontID: "RealBIMFont002", m_bTextWeight: true, m_uTextClr: captionClr, m_uTextBorderClr: 0x00000000,
      m_strText: caption,
      m_qTextRect: [-tag_w / 2, 0, tag_w / 2, tag_h1],
      m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x10/*TEXT_FMT_HCENTER*/ /*| 0x40TEXT_FMT_NOCLIP*/ /*| 0x100TEXT_FMT_WORDBREAK*/),
      m_uTextBackMode:0, m_sTextBackBorder:0, m_uTextBackClr:0x00000000
  });
  for (i = 0; i < contents.length; ++i) {
      sub_w = tag_w / contents[i].length; sub_base = -tag_w / 2;
      for (j = 0; j < contents[i].length; ++j) {
          temptextregions.push_back({
              m_strGolFontID: "RealBIMFont001", m_bTextWeight: false, m_uTextClr: contentsClr, m_uTextBorderClr: 0x00000000,
              m_strText: contents[i][j],
              m_qTextRect: [sub_base, -(i + 1) * tag_h2, sub_base + sub_w, -i * tag_h2],
              m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x8/*TEXT_FMT_LEFT*/ /*| 0x40TEXT_FMT_NOCLIP*/ | 0x100/*TEXT_FMT_WORDBREAK*/),
              m_uTextBackMode:0, m_sTextBackBorder:0, m_uTextBackClr:0x00000000
          });
          sub_base += sub_w;
      }
  }

  frameline ={
      m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0], m_uFrameNumU: 1, m_uFrameNumV: 1, m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
      m_strTexPath: "", m_qTexRect: [0, 0, 0, 0], m_uTexClrMult: frameClr,
  };
  var framelinewidth = 2; var framegap = 6;
  frameline["m_qTexRect"] = [-tag_w/2-framegap, tag_h1, tag_w/2+framegap, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [-tag_w/2-framegap, -tag_h2*contents.length-framelinewidth, tag_w/2+framegap, -tag_h2*contents.length]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [-tag_w/2-framegap, -tag_h2*contents.length-framelinewidth, -tag_w/2-framegap+framelinewidth, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [tag_w/2+framegap-framelinewidth, -tag_h2*contents.length-framelinewidth, tag_w/2+framegap, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
  for (i = 0; i < contents.length; ++i) {
      subline_w_hori = (i == 0) ? framelinewidth : framelinewidth / 2; subline_w_vert = framelinewidth / 2;
      frameline["m_qTexRect"] = [-tag_w/2-framegap, -subline_w_hori-i*tag_h2, tag_w/2+framegap, 0-i*tag_h2]; temptexregions.push_back(frameline);
      sub_w = tag_w / contents[i].length; sub_base = -tag_w / 2-2;
      for (j = 0; j + 1 < contents[i].length; ++j) {
          frameline["m_qTexRect"] = [sub_base+sub_w-subline_w_vert, -(i+1) * tag_h2, sub_base+sub_w, -i * tag_h2]; temptexregions.push_back(frameline);
          sub_base += sub_w;
      }
  }

  tempobj = {
      m_strName: tagName, m_vPos: pos,
      m_vBgMinSize: [50, 10], m_vBgPadding: [5, 5], m_uBgAlignX: 1, m_uBgAlignY: 1,
      m_vArrowOrigin: [-5, 20], m_uBgColor: backClr,
      m_arrTexContents: temptexregions, m_arrTextContents: temptextregions,
  };
  temptags.push_back(tempobj);
  Module.RealBIMWeb.AddTags(temptags);
}
// 添加复杂标签样式3
Module.REaddLineTag = function(tagName, pos, tagMinWidth, tagMinHeight, contents, contentfont, backClr, frameClr) {
  temptags = new Module.RE_Vector_TAG();
  temptexregions = new Module.RE_Vector_SHP_TEX();
  temptextregions = new Module.RE_Vector_SHP_TEXT();
  var cur_x =0; var cur_y =0; var max_y =tagMinHeight/2;
  var _backClr = 0x00000000; var _frameClr = 0x00000000;
  var _contentfont = ((contentfont =="")?"RealBIMFont001":contentfont);
  for (i = 0; i < contents.length; ++i) {
    var _elemtype ="tex"; var _elemwidth =1; var _elemheight =1; var _border =1; var _elemclr =0xffffffff; var _elemclrinfo ='ffffff'; 
    var _eleminfo =""; var cur =contents[i]; 
    if(typeof cur.type != 'undefined'){_elemtype =cur.type;}
    if(typeof cur.width != 'undefined'){_elemwidth =cur.width;}
    if(typeof cur.height != 'undefined'){_elemheight =cur.height;}
    if(typeof cur.border != 'undefined'){_border =cur.border;}
    if(typeof cur.color != 'undefined'){_elemclrinfo =cur.color;}
    if(typeof cur.info != 'undefined'){_eleminfo =cur.info;}
    if(_eleminfo==""){
      _elemclr = Module.REclrFix(_elemclrinfo, 0)
    }else{
      _elemclr = Module.REclrFix(_elemclrinfo, 255)
    }
    if(_elemtype == "tex"){
      temptexregions.push_back({
          m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0], m_uFrameNumU: 1, m_uFrameNumV: 1, m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
          m_strTexPath: _eleminfo, m_qTexRect: [cur_x+_border, cur_y-_elemheight/2-1, cur_x+_border+_elemwidth, cur_y+_elemheight/2-1], m_uTexClrMult: _elemclr,
      });
    }else{
      temptextregions.push_back({
          m_strGolFontID: _contentfont, m_bTextWeight: false, m_uTextClr: _elemclr, m_uTextBorderClr: 0x00000000,
          m_strText: _eleminfo,
          m_qTextRect: [cur_x+_border, cur_y-_elemheight/2+1, cur_x+_border+_elemwidth, cur_y+_elemheight/2+1],
          m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x10/*TEXT_FMT_HCENTER*/ /*| 0x40TEXT_FMT_NOCLIP*/ | 0x100/*TEXT_FMT_WORDBREAK*/),
          m_uTextBackMode:0, m_sTextBackBorder:0, m_uTextBackClr:0x00000000
      });
    }
    cur_x +=_elemwidth+_border*2;
    if(max_y < _elemheight/2){max_y =_elemheight/2;}
  }

  var framerange_xmin =0; var framerange_xmax =cur_x; 
  if(cur_x < tagMinWidth){
    framerange_xmin -=(tagMinWidth-cur_x)/2; framerange_xmax +=(tagMinWidth-cur_x)/2; 
  }
  _frameClr = Module.REclrFix(frameClr[0], frameClr[1])
  frameline ={
      m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0], m_uFrameNumU: 1, m_uFrameNumV: 1, m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
      m_strTexPath: "", m_qTexRect: [0, 0, 0, 0], m_uTexClrMult: _frameClr,
  };
  var framelinewidth = 2; var framegap = 6;
  frameline["m_qTexRect"] = [framerange_xmin-framegap, max_y+framegap, framerange_xmax+framegap, max_y+framegap+framelinewidth]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [framerange_xmin-framegap, -max_y-framegap-framelinewidth, framerange_xmax+framegap, -max_y-framegap]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [framerange_xmin-framegap, -max_y-framegap-framelinewidth, framerange_xmin-framegap+framelinewidth, max_y+framegap+framelinewidth]; temptexregions.push_back(frameline);
  frameline["m_qTexRect"] = [framerange_xmax+framegap-framelinewidth, -max_y-framegap-framelinewidth, framerange_xmax+framegap, max_y+framegap+framelinewidth]; temptexregions.push_back(frameline);
  
  _backClr = Module.REclrFix(backClr[0], backClr[1])
  tempobj = {
      m_strName: tagName, m_vPos: pos,
      m_vBgMinSize: [tagMinWidth, tagMinHeight], m_vBgPadding: [3, 3], m_uBgAlignX: 1, m_uBgAlignY: 1,
      m_vArrowOrigin: [-5, 20], m_uBgColor: _backClr,
      m_arrTexContents: temptexregions, m_arrTextContents: temptextregions,
  };
  temptags.push_back(tempobj);
  Module.RealBIMWeb.AddTags(temptags);
}

//获取地形的包围盒信息
Module.REgetUnVerHugeGroupBoundingBox = function(projName,sceName){
  var tempbv =Module.RealBIMWeb.GetUnVerHugeGroupBoundingBox(projName,sceName);
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]); aabbarr.push(tempbv[1][0]);  //Xmin、Xmax
  aabbarr.push(tempbv[0][1]); aabbarr.push(tempbv[1][1]);  //Ymin、Ymax
  aabbarr.push(tempbv[0][2]); aabbarr.push(tempbv[1][2]);  //Zmin、Zmax
  return aabbarr;
}
//设置地形场景节点的可见性
Module.REsetUnVerHugeGroupVisible = function(projName,sceName,bVisible){
  Module.RealBIMWeb.SetUnVerHugeGroupVisible(projName,sceName,bVisible);
}
//获取地形场景节点的可见性
Module.REgetUnVerHugeGroupVisible = function(projName,sceName){
  return Module.RealBIMWeb.GetUnVerHugeGroupVisible(projName,sceName);
}
//设置地形场景节点的深度偏移
//范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
Module.REsetUnVerHugeGroupDepthBias = function(projName,sceName,fDepthBias){
  Module.RealBIMWeb.SetUnVerHugeGroupDepthBias(projName,sceName,fDepthBias);
}
//设置地形的仿射变换信息
Module.REsetUnVerHugeGroupTransform = function(projName,sceName,arrScale,arrRotate,arrOffset){
  Module.RealBIMWeb.SetUnVerHugeGroupTransform(projName,sceName,arrScale,arrRotate,arrOffset);
}
//刷新地形模型，bLoadNewData：表示刷新主体数据后是否允许重新加载数据
Module.RErefreshUnVerHugeGroupMainData = function(projName,sceName,bLoadNewData){
  Module.RealBIMWeb.RefreshUnVerHugeGroupMainData(projName,sceName,bLoadNewData);
}

//设置复杂模型内子元素的深度偏移
//projName：表示要处理的项目名称，为空串则表示处理所有项目
//sceName：表示要处理的场景节点的名称标识，若为空串则表示处理所有的场景节点
//objArr：表示要处理的构件id数组，若为空串则表示处理所有的构件id
//fDepthBias:范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
Module.REsetHugeObjSubElemDepthBias = function(projName,sceName,objArr,fDepthBias){
  if(projName == ""){
    Module.RealBIMWeb.SetHugeObjSubElemDepthBias("", "", 0xffffffff, 0, fDepthBias);
  }else{
    var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
    var _s = objArr.length;
    if(_s == 0){
      Module.RealBIMWeb.SetHugeObjSubElemDepthBias(projName, sceName, 0xffffffff, 0, fDepthBias);
    }else{  
      var _s01 = (_s*8).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); var elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
      for(var i =0; i<_s; ++i){
        elemIds.set([objArr[i], projid], i*2);
      }
      Module.RealBIMWeb.SetHugeObjSubElemDepthBias(projName, sceName, elemIds.byteLength, elemIds.byteOffset, fDepthBias);
    }
  }
}

//设置模型场景节点的可见性
Module.REsetHugeObjVisible = function(projName,sceName,bVisible){
  Module.RealBIMWeb.SetHugeObjVisible(projName,sceName,bVisible);
}
//获取模型场景节点的可见性
Module.REgetHugeObjVisible = function(projName,sceName){
  return Module.RealBIMWeb.GetHugeObjVisible(projName,sceName);
}
//设置模型场景节点的仿射变换信息
Module.REsetHugeObjTransform = function(projName,sceName,arrScale,arrRotate,arrOffset){
  return Module.RealBIMWeb.SetHugeObjTransform(projName,sceName,arrScale,arrRotate,arrOffset);
}
//刷新模型，bLoadNewData：表示刷新主体数据后是否允许重新加载数据
Module.RErefreshHugeObjMainData = function(projName,sceName,bLoadNewData){
  Module.RealBIMWeb.RefreshHugeObjMainData(projName,sceName,bLoadNewData);
}

//创建自定义顶点矢量
//shpName：表示矢量标识名，若已有同名的矢量则覆盖之
//vPos：表示顶点位置
//uPotSize：表示顶点的像素大小
//uClr：表示顶点的颜色
//cTextInfo：表示顶点的文字标注信息
//fASDist：表示屏幕空间矢量的自动缩放起始距离
//fVisDist：表示屏幕空间矢量的可视距离
//bContactSce：表示矢量是否与场景发生深度遮挡
Module.REaddCustomPotShp = function(shpName, vPos, uPotSize, uClr, cTextInfo, fASDist, fVisDist, bContactSce){
  var _textbias =[0,0]; var _GolFontID ="RealBIMFont001"; var _textcolor =0xffffffff; var _textbordercolor =0xff000000;
  var _textbackmode =0; var _textbackborder =0; var _textbackclr =0x00000000;
  if(typeof cTextInfo.textbias != 'undefined'){_textbias = cTextInfo.textbias;}
  if(typeof cTextInfo.fontname != 'undefined'){_GolFontID = cTextInfo.fontname;}
  if(typeof cTextInfo.textcolor != 'undefined'){_textcolor = cTextInfo.textcolor;}
  if(typeof cTextInfo.textbordercolor != 'undefined'){_textbordercolor = cTextInfo.textbordercolor;}
  if(typeof cTextInfo.textbackmode != 'undefined'){_textbackmode = cTextInfo.textbackmode;}
  if(typeof cTextInfo.textbackborder != 'undefined'){_textbackborder = cTextInfo.textbackborder;}
  if(typeof cTextInfo.textbackclr != 'undefined'){_textbackclr = cTextInfo.textbackclr;}
  var TempTextRect =[-1, -1, 1, 1]; var TempTextFmtFlag =0x40/*TEXT_FMT_NOCLIP*/;
  if(_textbias[0] < 0){
      TempTextRect[0] =-uPotSize-2; TempTextRect[2] =-uPotSize-1; TempTextFmtFlag |=0x20/*TEXT_FMT_RIGHT*/;
  }else if(_textbias[0] == 0){
      TempTextRect[0] =-1; TempTextRect[2] =1; TempTextFmtFlag |=0x10/*TEXT_FMT_HCENTER*/;
  }else{
      TempTextRect[0] =uPotSize+1; TempTextRect[2] =uPotSize+2; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
  }
  if(_textbias[1] < 0){
      TempTextRect[1] =-uPotSize-2; TempTextRect[3] =-uPotSize-1; TempTextFmtFlag |=0x4/*TEXT_FMT_TOP*/;
  }else if(_textbias[1] == 0){
      TempTextRect[1] =-1; TempTextRect[3] =1; TempTextFmtFlag |=0x2/*TEXT_FMT_VCENTER*/;
  }else{
      TempTextRect[1] =uPotSize+1; TempTextRect[3] =uPotSize+2; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
  }
  var textobj ={
    m_strGolFontID: _GolFontID,
    m_bTextWeight: false,
    m_strText: cTextInfo.textinfo,
    m_uTextClr: _textcolor,
    m_uTextBorderClr: _textbordercolor,
    m_qTextRect: TempTextRect,
    m_uTextFmtFlag: TempTextFmtFlag,
    m_uTextBackMode:_textbackmode, m_sTextBackBorder:_textbackborder, m_uTextBackClr:_textbackclr
  };
  var _bContactSce =false;
  if(typeof bContactSce != 'undefined'){_bContactSce = bContactSce;}
  return Module.RealBIMWeb.AddCustomPotShp(shpName, vPos, uPotSize, uClr, textobj, fASDist, fVisDist, _bContactSce);
}
//创建自定义多边形折线矢量
//shpName：表示矢量标识名，若已有同名的矢量则覆盖之
//arrPots：表示多边形折线序列
//uFillState：0->多边形不填充；1->多边形首尾相连构成封闭区域进行填充；2->多边形首尾相连构成封闭区域进行填充(顶点高度自动修改为同一高度)
//uClr：表示多边形的颜色
//uFillClr：表示多边形的填充颜色
//fTextPos：表示多边形的文字标注的位置
//			>=0时整数部分i/小数部分j表示文字定位点在线段<i,i+1>上的偏移了长度百分比j
//			[-1,0)表示文字定位在折线上并从首端点偏移折线总长度的百分比
//			-2表示文字定位在多边形所有顶点的中心位置处
//cTextInfo：表示顶点的文字标注信息
//fASDist：表示屏幕空间矢量的自动缩放起始距离
//fVisDist：表示屏幕空间矢量的可视距离
//bContactSce：表示矢量是否与场景发生深度遮挡
//uLineWidth：表示多边形折线的线宽
Module.REaddCustomPolylineShp = function(shpName, arrPots, uFillState, uClr, uFillClr, fTextPos, cTextInfo, fASDist, fVisDist, bContactSce, uLineWidth){ 
  var temparrpos =new Module.RE_Vector_dvec3();
  for(var i=0;i<arrPots.length;++i){
    temparrpos.push_back(arrPots[i]);
  }
  var _textbias =[0,0]; var _GolFontID ="RealBIMFont001"; var _textcolor =0xffffffff; var _textbordercolor =0xff000000;
  var _textbackmode =0; var _textbackborder =0; var _textbackclr =0x00000000;
  if(typeof cTextInfo.textbias != 'undefined'){_textbias = cTextInfo.textbias;}
  if(typeof cTextInfo.fontname != 'undefined'){_GolFontID = cTextInfo.fontname;}
  if(typeof cTextInfo.textcolor != 'undefined'){_textcolor = cTextInfo.textcolor;}
  if(typeof cTextInfo.textbordercolor != 'undefined'){_textbordercolor = cTextInfo.textbordercolor;}
  if(typeof cTextInfo.textbackmode != 'undefined'){_textbackmode = cTextInfo.textbackmode;}
  if(typeof cTextInfo.textbackborder != 'undefined'){_textbackborder = cTextInfo.textbackborder;}
  if(typeof cTextInfo.textbackclr != 'undefined'){_textbackclr = cTextInfo.textbackclr;}
  var TempTextRect =[-1, -1, 1, 1]; var TempTextFmtFlag =0x40/*TEXT_FMT_NOCLIP*/;
  if(_textbias[0] < 0){
      TempTextRect[0] =-1; TempTextRect[2] =0; TempTextFmtFlag |=0x20/*TEXT_FMT_RIGHT*/;
  }else if(_textbias[0] == 0){
      TempTextRect[0] =-1; TempTextRect[2] =1; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
  }else{
      TempTextRect[0] =0; TempTextRect[2] =1; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
  }
  if(_textbias[1] < 0){
      TempTextRect[1] =-1; TempTextRect[3] =0; TempTextFmtFlag |=0x4/*TEXT_FMT_TOP*/;
  }else if(_textbias[1] == 0){
      TempTextRect[1] =-1; TempTextRect[3] =1; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
  }else{
      TempTextRect[1] =0; TempTextRect[3] =1; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
  }
  var textobj ={
    m_strGolFontID: _GolFontID,
    m_bTextWeight: false,
    m_strText: cTextInfo.textinfo,
    m_uTextClr: _textcolor,
    m_uTextBorderClr: _textbordercolor,
    m_qTextRect: TempTextRect,
    m_uTextFmtFlag: TempTextFmtFlag,
    m_uTextBackMode:_textbackmode, m_sTextBackBorder:_textbackborder, m_uTextBackClr:_textbackclr
  };
  var _bContactSce =false; var _linewidth =1;
  if(typeof bContactSce != 'undefined'){_bContactSce = bContactSce;}
  if(typeof uLineWidth != 'undefined'){_linewidth = uLineWidth;}
  return Module.RealBIMWeb.AddCustomPolylineShp(shpName, temparrpos, uFillState, uClr, uFillClr, fTextPos, textobj, fASDist, fVisDist, _bContactSce, _linewidth);
}
//创建自定义多边形围栏矢量
//shpName：表示矢量标识名，若已有同名的矢量则覆盖之
//arrPots：表示多边形折线序列，xyzw, w分量表示端点处的围栏高度
//bClose：表示是否闭合
//uClr：表示多边形围栏的颜色
//fASDist：表示屏幕空间矢量的自动缩放起始距离
//fVisDist：表示屏幕空间矢量的可视距离
//bContactSce：表示矢量是否与场景发生深度遮挡
Module.REaddCustomPolyFenceShp = function(shpName, arrPots, bClose, uClr, fASDist, fVisDist, bContactSce){
  var _bContactSce =false; if(typeof bContactSce != 'undefined'){_bContactSce = bContactSce;}
  var temparrpos =new Module.RE_Vector_dvec4();
  for(var i=0;i<arrPots.length;++i){
    temparrpos.push_back(arrPots[i]);
  }
  Module.RealBIMWeb.AddCustomPolyFenceShp(shpName, temparrpos, bClose, uClr, fASDist, fVisDist, bContactSce);
}
//删除某个自定义矢量对象
Module.REdelCustomShp = function(shpName){ 
  return Module.RealBIMWeb.DelCustomShp(shpName);
}
//清空所有的自定义矢量对象
Module.REdelAllCustomShps = function(){ 
  Module.RealBIMWeb.DelAllCustomShps();
}


//创建一个动态墙
//strGroupName 对象组名称
//strWallName 对象名称
//arrPath 动态墙路径及高度(x,y,z)表示位置 w表示高度
//strTexPath 动态墙纹理路径
//bNormalDir 是否法线方向，true为法线方向，false为切线方向
Module.REaddAnimationWall = function(strGroupName, strWallName, arrPath, strTexPath, bNormalDir)
{
  var temparr =new Module.RE_Vector_dvec4();
  for(var i=0;i<arrPath.length;++i){
    temparr.push_back(arrPath[i]);
  }
  return Module.RealBIMWeb.AddAnimationWall(strGroupName, strWallName, temparr, strTexPath, bNormalDir);
}
//创建一个扫描面
//strGroupName 对象组名称
//strName 对象名称
//arrPath 路径及高度(x,y,z)表示位置 w表示高度
//strTexPath 纹理路径
Module.REaddAnimationPlane = function(strGroupName, strName, arrPath, strTexPath)
{
  var temparr =new Module.RE_Vector_dvec3();
  for(var i=0;i<arrPath.length;++i){
    temparr.push_back(arrPath[i]);
  }
  return Module.RealBIMWeb.AddAnimationPlane(strGroupName, strName, temparr, strTexPath);
}
//创建一组半球体动画
//strGroupName 对象组名称
//arrStrName 对象名称集合
//arrCenters 中心点坐标数组
//dRadius 当前批次球的半径
//bSphere 是否为半球，false为半球，true为圆球
//strTexPath 纹理路径
Module.REaddAnimationSpheres = function(strGroupName, arrStrName, arrCenters, dRadius, bSphere, strTexPath)
{
  var temparr0 =new Module.RE_Vector_WStr();
  for(var i=0;i<arrStrName.length;++i){temparr0.push_back(arrStrName[i]);}
  var temparr =new Module.RE_Vector_dvec3();
  for(var i=0;i<arrCenters.length;++i){temparr.push_back(arrCenters[i]);}
  return Module.RealBIMWeb.AddAnimationSpheres(strGroupName, temparr0, temparr, dRadius, bSphere, strTexPath);
}
//创建一组规则平面多边形动画
//strGroupName 对象组名称
//arrNames 对象名称集合
//arrCenters 中心点坐标数组
//dRadius 当前批次规则多边形的半径
//strTexPath 纹理路径
//bRadarScan 动画效果是否为雷达扫描, true为扫描，false为扩散
//bRing 是否为圆形，如果是true，则边数不起作用；如果是false,uEdgeNumber起作用
//uEdgeNumber 边数
Module.REaddAnimationPolygons = function(strGroupName, arrNames, arrCenters, dRadius, strTexPath, bRadarScan, bRing, uEdgeNumber)
{
  var temparr0 =new Module.RE_Vector_WStr();
  for(var i=0;i<arrNames.length;++i){temparr0.push_back(arrNames[i]);}
  var temparr =new Module.RE_Vector_dvec3();
  for(var i=0;i<arrCenters.length;++i){temparr.push_back(arrCenters[i]);}
  return Module.RealBIMWeb.AddAnimationPolygons(strGroupName, temparr0, temparr, dRadius, strTexPath, bRadarScan, bRing, uEdgeNumber);
}
//创建一组规则多边形动态墙
//strGroupName 对象组名称
//arrNames 对象名称集合
//arrCenters 中心点坐标数组
//dRadius 当前批次规则多边形的半径
//fHeight 高度
//strTexPath 纹理路径
//bRing 是否为圆形，如果是true，则边数不起作用；如果是false,uEdgeNumber起作用
//uEdgeNumber 边数
//bNormalDir 贴图是否沿法线方向，true为法线方向，false为切线方向
Module.REaddAnimationPolygonWalls = function(strGroupName, arrNames, arrCenters, dRadius, fHeight, strTexPath, bRing, uEdgeNumber, bNormalDir)
{
  var temparr0 =new Module.RE_Vector_WStr();
  for(var i=0;i<arrNames.length;++i){temparr0.push_back(arrNames[i]);}
  var temparr =new Module.RE_Vector_dvec3();
  for(var i=0;i<arrCenters.length;++i){temparr.push_back(arrCenters[i]);}
  return Module.RealBIMWeb.AddAnimationPolygonWalls(strGroupName, temparr0, temparr, dRadius, fHeight, strTexPath, bRing, uEdgeNumber, bNormalDir);
}

//按组名称设置矢量动画的参数
//strGroupName 矢量动画组名称，此参数不能为空
//arrNames 矢量动画名称集合，如果arrNames为空,则设置该组下所有的矢量动画信息；
//strColor 期望的矢量动画颜色，字符串，例红色"ff0000"
//uColorPercent 期望的动画颜色所占的比重，0~255
//vScaleAndOffset 动画速度及方向，正负控制方向，数值控制速度
//返回值为是否设置成功
Module.REsetShapeAnimStyle = function(strGroupName, arrNames, strColor, uColorPercent, vScaleAndOffset)
{
  var temparr0 =new Module.RE_Vector_WStr();
  for(var i=0;i<arrNames.length;++i){temparr0.push_back(arrNames[i]);}
  var tempClr =Module.REclrFix(strColor,uColorPercent); 
  return Module.RealBIMWeb.SetShapeAnimStyle(strGroupName, temparr0, tempClr, vScaleAndOffset);
}
//删除矢量动画
//如果strGroupName为"",则清空所有矢量动画；
//如果strGroupName不为""且arrNames为[],则删除该组的所有矢量动画；
//如果strGroupName不为""且arrNames不为"",则删除该组下的某几个矢量动画
Module.REdelShpAnimation = function(strGroupName, arrNames)
{
  var temparr0 =new Module.RE_Vector_WStr();
  for(var i=0;i<arrNames.length;++i){temparr0.push_back(arrNames[i]);}
  return Module.RealBIMWeb.DelShpAnimation(strGroupName, temparr0);
}


//设置相机位置的世界空间范围
//[[Xmin、Ymin、Zmin],[Xmax、Ymax、Zmax]]
Module.REsetCamBound = function(arrCamBound){
  Module.RealBIMWeb.SetCamBound(arrCamBound);
}
//获取相机位置的世界空间范围
Module.REgetCamBound = function(){
  return Module.RealBIMWeb.GetCamBound();
}

//设置相机朝向是否允许头朝下
Module.REsetCamUpsideDown = function(bEnable){
  Module.RealBIMWeb.SetCamUpsideDown(bEnable);
}
//获取相机朝向是否允许头朝下
Module.REgetCamUpsideDown = function(){
  return Module.RealBIMWeb.GetCamUpsideDown();
}

//设置相机的强制近裁面/远裁面
//arrNearFar：<强制近裁面,强制远裁面>(小于0表示使用资源中的设置；0~1e37表示强制使用指定值；大于1e37表示强制使用自动计算值)
Module.REsetCamForcedNearFar = function(arrNearFar){
  Module.RealBIMWeb.SetCamForcedZNearFar(arrNearFar);
}
//获取相机的强制近裁面/远裁面
Module.REgetCamForcedNearFar = function(){
  return Module.RealBIMWeb.GetCamForcedZNearFar();
}

//设置当相机运动或模型运动时是否偏向于渲染流畅性(即是否允许相机运动的过程中加载模型，默认true，不加载模型，偏向渲染流畅)
Module.REsetPreferFPS = function(bPrefer){
  Module.RealBIMWeb.SetPreferFPS(bPrefer);
}
//获取当相机运动或模型运动时是否偏向于渲染流畅性(即是否允许相机运动的过程中加载模型，默认true，不加载模型，偏向渲染流畅)
Module.REgetPreferFPS = function(){
  return Module.RealBIMWeb.GetPreferFPS();
}

//设置主场景相机的投影类型
//uType：0->透视投影；1->正交投影
Module.REsetCamProjType = function(uType){
  Module.RealBIMWeb.SetCamProjType(uType);
}
//获取主场景相机的投影类型
Module.REgetCamProjType = function(){
  return Module.RealBIMWeb.GetCamProjType();
}

//加载一个或多个全景场景
// projInfo = [
//             {
//               "projName":"proj01",
//               "urlRes":"https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=",
//               "projResName":"res_test1",
//             },{
//               "projName":"proj02",
//               "urlRes":"https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=",
//               "projResName":"res_test2",
//             }
//            ]
Module.REaddPanSceData = function(projInfo){
  var _l = projInfo.length; 
  for(var i=0; i<_l; ++i){
    var _path = projInfo[i].urlRes+projInfo[i].projResName+"/360/total.xml";
    Module.RealBIMWeb.LoadPanSce(projInfo[i].projName, _path);
  }
}
//判断全景场景是否全部加载完成
Module.REisPanSceReady = function(){
  return Module.RealBIMWeb.IsPanSceReady();
}
//获取当前已加载的全部全景场景名称
Module.REgetAllPanSceNames = function(){
  var tempArr = Module.RealBIMWeb.GetAllPanSceNames();
  var nameArr = [];
  for(var i =0; i<tempArr.size(); ++i){
    nameArr.push(tempArr.get(i));
  }
  return nameArr;
}
//卸载一个或多个全景场景，传空数组时，卸载所有的全景场景
Module.REremovePanSceData = function(arrPanNames){
  Module.RealBIMWeb.UnLoadPanSce(arrPanNames);
}
//当所有的全景资源加载完成时，获取某一全景图资源的点位信息
//strPanSceID  全景资源唯一标识
//arrStrId 全景资源的点位标识集合
//arrPos 全景资源的点位位置集合
//arrRotate 全景资源的点位定位集合
Module.REgetPanSceElemInfos = function(strPanName){
  // return Module.RealBIMWeb.GetPanSceElemInfos(strPanName);
  var tempArr = Module.RealBIMWeb.GetPanSceElemInfos(strPanName);
  var nameArr = [];
  for(var i =0; i<tempArr.size(); ++i){
    nameArr.push(tempArr.get(i));
  }
  return nameArr;
}
//设置360全景窗口显示的图片信息
//strPanId:某一帧全景图的唯一标识
//uPanWindow:全景窗口标识，为0或1：
            // 仅有一个全景窗口的情况下填0即可；
            // 有两个全景窗口时，0表示第一个，1表示第二个
Module.REloadPan = function(strPanId,uPanWindow){
  Module.RealBIMWeb.LoadPan(strPanId,uPanWindow);
}
// 设置360相机与BIM相机是否同步
Module.REsetViewSyn = function(bool){
  Module.RealBIMWeb.SetViewSyn(bool);
}
//获取当前设置的360相机与BIM相机是否同步状态
Module.REgetViewSyn = function(){
  Module.RealBIMWeb.GetViewSyn();
}
//设置360相机的朝向
//camDir:360相机的朝向，7个有效值：
// “Default”，相机回到默认方位
// “top”，俯视图
// “bottom”，仰视图
// “left”，左视图
// “right”，右视图
// “front”，主视图
// “back”，后视图
// pancamid：360相机的id，如果当前场景仅有一个360场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
Module.RElocatePanCamToMainDir = function(dirInfo,pancamid){
  var _pancamid =0; if(typeof pancamid != 'undefined'){_pancamid = pancamid;}
  if(dirInfo=="top"){
    Module.RealBIMWeb.LocatePanCamToMainDir(Module.RE_CAM_DIR.TOP,_pancamid);
  }else if(dirInfo=="bottom"){
    Module.RealBIMWeb.LocatePanCamToMainDir(Module.RE_CAM_DIR.BOTTOM,_pancamid);
  }else if(dirInfo=="left"){
    Module.RealBIMWeb.LocatePanCamToMainDir(Module.RE_CAM_DIR.LEFT,_pancamid);
  }else if(dirInfo=="right"){
    Module.RealBIMWeb.LocatePanCamToMainDir(Module.RE_CAM_DIR.RIGHT,_pancamid);
  }else if(dirInfo=="front"){
    Module.RealBIMWeb.LocatePanCamToMainDir(Module.RE_CAM_DIR.FRONT,_pancamid);
  }else if(dirInfo=="back"){
    Module.RealBIMWeb.LocatePanCamToMainDir(Module.RE_CAM_DIR.BACK,_pancamid);
  }else{
    Module.RealBIMWeb.LocatePanCamToMainDir(Module.RE_CAM_DIR.DEFAULT,_pancamid);
  }
}
//根据相机点位置和目标点位置，设置全景场景相机方位
//curPos:当前相机的位置（当前帧图片扫描点位）
//destPos:目标点位，例[1,1,1]
// pancamid：360相机的id，如果当前场景仅有一个360场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
Module.RElocatePanCamToDestPos = function(curPos,destPos,pancamid){
  var _pancamid =0; if(typeof pancamid != 'undefined'){_pancamid = pancamid;}
  Module.RealBIMWeb.LocatePanCamToDestPos(curPos,destPos,_pancamid);
}
//获取360相机的朝向
// pancamid：360相机的id，如果当前场景仅有一个360场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
Module.REgetPanCamLocation = function(pancamid){
  return Module.RealBIMWeb.GetPanCamLocation(pancamid);
}
//添加全景场景的锚点
// panAncInfo = [
//             {
//               "strPanId":"886464uhht_1641521507",   //全景图的唯一标识（必填）
//               "strPanAncName":"pananc01",  //表示全景锚点的名称
//               "arrPos":[-200.355475159838, 100.69760032663632, 12.211],  //表示锚点的位置
//               "arrPicPos":[0, 0],  //表示锚点的二维像素位置（[0,0]为无效值）
//               "strPicPath":"http://localhost:10086/demo/demonew/css/img/tag.png",  //表示锚点的图片路径
//               "picSize":[32,32],  //表示锚点的图片大小,宽+高
//               "textFocus":[16,0]  //表示顶点的文字标注与图片的位置
//               "strTextInfo":"全景锚点",  //表示顶点的文字标注信息
//               "strTextClr":"000000",  //表示锚点的文字标注颜色
//               "textBias":[1,1]  //表示顶点的文字标注与图片的位置
//             },{
//               "strPanId":"886464uhht_1641521507",   
//               "strPanAncName":"pananc01",  
//               "arrPos":[0,0,0],  //表示锚点的三维位置（[0,0,0]为无效值）
//               "arrPicPos":[6960, 3616],  //表示锚点的二维像素位置（[0,0]为无效值）
//               "strPicPath":"http://localhost:10086/demo/demonew/css/img/tag.png",  
//               "picSize":[32,32], 
//               "textFocus":[0,0],   
//               "strTextInfo":"全景锚点",  
//               "strTextClr":"000000",  
//               "textBias":[1,1]  
//             }
//            ]
Module.REaddPanAnchor = function(panAncInfo){
  var tempPanAnchors = new Module.RE_Vector_PAN_ANC();
  for(var i=0; i<panAncInfo.length; ++i){
    var _arrPos = [0,0,0]; var _arrPicPos = [0,0]; var _bUsePicPos = false;
    if(typeof panAncInfo[i].arrPos != 'undefined'){_arrPos = panAncInfo[i].arrPos;}
    if(typeof panAncInfo[i].arrPicPos != 'undefined'){_arrPicPos = panAncInfo[i].arrPicPos;}
    if(typeof panAncInfo[i].bUsePicPos != 'undefined'){_bUsePicPos = panAncInfo[i].bUsePicPos;}
    var tempobj = {
      m_strPanId:panAncInfo[i].strPanId,
      m_strPanAncName:panAncInfo[i].strPanAncName,
      m_vPos:_arrPos,
      m_vTexPos:_arrPicPos,
      m_bUseTexPos:_bUsePicPos,
      m_strTexPath:panAncInfo[i].strPicPath,
      m_vTexSize:panAncInfo[i].picSize,
      m_vTexFocus:panAncInfo[i].textFocus,
      m_strTextInfo:panAncInfo[i].strTextInfo,
      m_vTextClr:panAncInfo[i].strTextClr,
      m_vTextBia:panAncInfo[i].textBias
    }
    tempPanAnchors.push_back(tempobj);
  }
  Module.RealBIMWeb.AddPanAnc(tempPanAnchors);
}
//获取某一全景场景的所有锚点名称
//strPanId 全景图的唯一标识（必填）
Module.REgetPanAnchor = function(strPanId){
  var tempArr = Module.RealBIMWeb.GetPanAnc(strPanId);
  var nameArr = [];
  for(var i =0; i<tempArr.size(); ++i){
    nameArr.push(tempArr.get(i));
  }
  return nameArr;
}
//删除某一全景场景中的锚点
//strPanName 全景场景名称,为空字符串""标识删除全部
//strPanAnchorName 锚点唯一标识，字符串，为空表示删除当前窗口全部锚点
Module.REdelPanAnchor = function(strPanName,strPanAnchorName){
  Module.RealBIMWeb.DelPanAnc(strPanAnchorName,strPanName);
}
//根据鼠标点击的360全景三维坐标点，计算对应的当前帧全景图片的二维像素值
//pos 当前鼠标点击的三维坐标，通过RealBIMSelShape事件+REgetCurPanShpProbeRet接口获取
//strPanId 全景图的唯一标识
Module.REgetPicPosBySelPos = function(pos,strPanId){
  return Module.RealBIMWeb.GetTexPos(pos,strPanId);
}

//设置当前窗口的显示模式
//viewport0/viewport1：分别表示第0/1个视图要显示的场景内容
//                      ""：该视图不显示任何内容
//                      "BIM"：该视图显示BIM场景模型
//                      "CAD"：该视图显示CAD图纸
//                      360全景图ID：该视图显示ID指定的360全景图
//screenMode：表示视图0与视图1在屏幕上的排列方式
//            视图0/视图1任一为空串""，或screenMode==0：屏幕中只显示一个内容有效的视图（第一个）
//            screenMode=1：屏幕自左向右依次显示视图0、视图1
//            screenMode=-1：屏幕自下向上依次显示视图0、视图1
//            视图组合为<"BIM","BIM">/<"CAD","CAD">/<"","">的情况，目前暂不支持
Module.REsetViewMode = function(viewport0, viewport1, screenMode){
  Module.RealBIMWeb.SetViewMode(viewport0, viewport1, screenMode);
}

  
//加载CAD文件
//strFilePath：表示CAD文件路径
//eCADUnit：表示CAD的单位
// RE_CAD_UNIT.Meter：米
// RE_CAD_UNIT.Millimeter：毫米
// RE_CAD_UNIT.Centimeter：厘米
// RE_CAD_UNIT.Decimeter：分米
// RE_CAD_UNIT.Decameter ：十米
// RE_CAD_UNIT.Hectometer：百米
// RE_CAD_UNIT.Kilometer：千米
// RE_CAD_UNIT.Inch：英寸
// RE_CAD_UNIT.Foot：英尺
// RE_CAD_UNIT.Mile：英里
// RE_CAD_UNIT.Microinch：微英寸
// RE_CAD_UNIT.Mil：毫英寸
// RE_CAD_UNIT.Nanometer：纳米
// RE_CAD_UNIT.Micron：微米
// RE_CAD_UNIT.Gigameter：百万公里
// RE_CAD_UNIT.Lightyear：光年
//dCADScale：表示CAD的比例尺
Module.REloadCAD = function(strFilePath, eCADUnit, dCADScale){
  var _unit= Module.RE_CAD_UNIT.Meter; var _scale = 1.0;
  if(typeof eCADUnit != 'undefined'){_unit = eCADUnit;}
  if(typeof dCADScale != 'undefined'){_scale = dCADScale;}
  Module.RealBIMWeb.LoadCAD(strFilePath, _unit, _scale);
}
//主动选中一个CAD元素
Module.REselCADElem = function(strElemID){
  Module.RealBIMWeb.SelCADElem(strElemID);
}
//聚焦到一个CAD元素
//dCamScale：表示相机聚焦后的视口缩放比例
Module.REfocusToCADElem = function(strElemID, dCamScale){
  Module.RealBIMWeb.FocusToCADElem(strElemID, dCamScale);
}

//添加一系列CAD锚点
// 每个锚点包含以下基本信息：
// id: 锚点的名称(字符串，唯一标识)
// pos：锚点的位置，二维数组
// style：锚点的样式，目前CAD锚点仅支持4种默认样式，分别以数字0~3表示
// innerClr: 内部元素颜色，例”ffffff”
// innerAlpha: 内部元素透明度，0~255，0表示全透明，255表示不透明
// extClr: 外部元素颜色，例”ffffff”
// extAlpha: 外部元素透明度，0~255，0表示全透明，255表示不透明
Module.REaddCADAnchors = function(ancInfo){
  var tempAnchors =new Module.RE_Vector_CAD_ANCHOR();
  for(i=0;i<ancInfo.length;++i){
    var _id = ""; var _pos =[0.0, 0.0]; var _innerClr ="ffffff"; var _innerAlpha =255; var _extClr ="00ff00"; var _extAlpha =255; var _style =0;
    if(typeof ancInfo[i].id != 'undefined'){_id = ancInfo[i].id;}
    if(typeof ancInfo[i].pos != 'undefined'){_pos = ancInfo[i].pos;}
    if(typeof ancInfo[i].innerClr != 'undefined'){_innerClr = ancInfo[i].innerClr;}
    if(typeof ancInfo[i].innerAlpha != 'undefined'){_innerAlpha = ancInfo[i].innerAlpha;}
    if(typeof ancInfo[i].extClr != 'undefined'){_extClr = ancInfo[i].extClr;}
    if(typeof ancInfo[i].extAlpha != 'undefined'){_extAlpha = ancInfo[i].extAlpha;}
    if(typeof ancInfo[i].style != 'undefined'){_style = ancInfo[i].style;}
    var _clr1 = Module.REclrFix(_extClr,_extAlpha);
    var _clr2 = Module.REclrFix(_innerClr,_innerAlpha);
    var tempobj ={
     m_strID: _id, 
     m_vPos: _pos, 
     m_uClr1: _clr1, 
     m_uClr2: _clr2,
     m_uStyleID: _style
    };
    tempAnchors.push_back(tempobj);
  }
  return Module.RealBIMWeb.AddCADAnchors(tempAnchors);
}
//获取一个CAD锚点的信息
Module.REgetCADAnchor = function(strID){
  var ancData =Module.RealBIMWeb.GetCADAnchor(strID);
  var _extClr= (ancData.m_uClr1).toString(16).substring(6,8)+(ancData.m_uClr1).toString(16).substring(4,6)+(ancData.m_uClr1).toString(16).substring(2,4);
  var _extAlpha= parseInt((ancData.m_uClr1).toString(16).substring(0,2),16);
  var _innerClr= (ancData.m_uClr2).toString(16).substring(6,8)+(ancData.m_uClr2).toString(16).substring(4,6)+(ancData.m_uClr2).toString(16).substring(2,4);
  var _innerAlpha= parseInt((ancData.m_uClr2).toString(16).substring(0,2),16);
  return {
     id: ancData.m_strID, 
     pos: ancData.m_vPos, 
     innerClr: _innerClr, 
     innerAlpha: _innerAlpha,
     extClr: _extClr, 
     extAlpha: _extAlpha,
     style: ancData.m_uStyleID
    };
}
//获取系统中的CAD锚点总数
Module.REgetCADAnchorNum = function(){
  return Module.RealBIMWeb.GetCADAnchorNum();
}
//获取系统中所有的CAD锚点信息
Module.REgetAllCADAnchors = function(){
  var allAncData =Module.RealBIMWeb.GetAllCADAnchors();
  if(allAncData.size()==0){
    return 0;
  }else{
    var arrAncData = [];
    for(var i=0;i <allAncData.size(); ++i){
      var tempobj =allAncData.get(i);
      var _extClr= (tempobj.m_uClr1).toString(16).substring(6,8)+(tempobj.m_uClr1).toString(16).substring(4,6)+(tempobj.m_uClr1).toString(16).substring(2,4);
      var _extAlpha= parseInt((tempobj.m_uClr1).toString(16).substring(0,2),16);
      var _innerClr= (tempobj.m_uClr2).toString(16).substring(6,8)+(tempobj.m_uClr2).toString(16).substring(4,6)+(tempobj.m_uClr2).toString(16).substring(2,4);
      var _innerAlpha= parseInt((tempobj.m_uClr2).toString(16).substring(0,2),16);
      arrAncData.push({
       id: tempobj.m_strID, 
       pos: tempobj.m_vPos, 
       innerClr: _innerClr, 
       innerAlpha: _innerAlpha,
       extClr: _extClr, 
       extAlpha: _extAlpha,
       style: tempobj.m_uStyleID
      });
    }
    return arrAncData;  
  }
}
//删除一系列CAD锚点
Module.REdelCADAnchors = function(arrIDs){
  var tempAnchors = new Module.RE_Vector_WStr();
  for(i=0;i<arrIDs.length;++i){
    tempAnchors.push_back(arrIDs[i]);
  }
  return Module.RealBIMWeb.DelCADAnchors(tempAnchors);
}
//删除系统所有的CAD锚点
Module.REdelAllCADAnchors = function(){
  Module.RealBIMWeb.DelAllCADAnchors();
}

// 自定义锚点
//添加一系列自定义CAD锚点
// 每个锚点包含以下基本信息：
// id: 锚点的名称(字符串，唯一标识)
// pos：锚点的位置，二维数组
// picPath：锚点引用的svg矢量文件路径
// groupName: 锚点所属的组名称
// strText: 锚点文字内容
// textClr: 锚点文字颜色,例红色“#ff0000”
// textAlpha: 锚点文字透明度，0~255，0表示全透
// textSize: 锚点文字大小
// textBias: 表示锚点文字与图片的相对位置，二维数组：
//             第一维-1、0、1分别表示文字在图片的左侧、中间、右侧；
//             第二维-1、0、1分别表示文字在图片的下侧、中间、上侧；
Module.REaddCADShpAnchors = function(ancInfo){
  var tempAnchors =new Module.RE_Vector_CAD_SHP_ANCHOR();
  for(i=0;i<ancInfo.length;++i){
    var _id =""; var _pos =[0.0, 0.0]; var _picPath =""; var _groupName =""; var _strText =""; var _textClr ="ffffff"; var _textAlpha =255; var _textSize =16; var _textBias =[0,0];
    if(typeof ancInfo[i].id != 'undefined'){_id = ancInfo[i].id;}
    if(typeof ancInfo[i].pos != 'undefined'){_pos = ancInfo[i].pos;}
    if(typeof ancInfo[i].picPath != 'undefined'){_picPath = ancInfo[i].picPath;}
    if(typeof ancInfo[i].groupName != 'undefined'){_groupName = ancInfo[i].groupName;}    
    if(typeof ancInfo[i].strText != 'undefined'){_strText = ancInfo[i].strText;}
    if(typeof ancInfo[i].textClr != 'undefined'){_textClr = ancInfo[i].textClr;}
    if(typeof ancInfo[i].textAlpha != 'undefined'){_textAlpha = ancInfo[i].textAlpha;}    
    if(typeof ancInfo[i].textSize != 'undefined'){_textSize = ancInfo[i].textSize;}
    if(typeof ancInfo[i].textBias != 'undefined'){_textBias = ancInfo[i].textBias;}
    var _clr = Module.REclrFix(_textClr,_textAlpha);
    var tempobj ={
                  m_strID: _id, 
                  m_vPos: _pos, 
                  m_strShpPath: _picPath, 
                  m_strGroupID: _groupName, 
                  m_strText: _strText, 
                  m_uTextClr: _clr, 
                  m_dTextSize: _textSize, 
                  m_vTextAlign: _textBias
    };
    tempAnchors.push_back(tempobj);
  }
  return Module.RealBIMWeb.AddCADShpAnchors(tempAnchors);
}
//获取一个自定义CAD锚点的信息
Module.REgetCADShpAnchor = function(strID){
  var ancData =Module.RealBIMWeb.GetCADShpAnchor(strID);
  var _textClr= (ancData.m_uTextClr).toString(16).substring(6,8)+(ancData.m_uTextClr).toString(16).substring(4,6)+(ancData.m_uTextClr).toString(16).substring(2,4);
  var _textAlpha= parseInt((ancData.m_uTextClr).toString(16).substring(0,2),16);
  return {
      id: ancData.m_strID, 
      pos: ancData.m_vPos, 
      picPath: ancData.m_strShpPath,  
      groupName: ancData.m_strGroupID,
      strText: ancData.m_strText, 
      textClr: _textClr,
      textAlpha: _textAlpha,
      textSize: ancData.m_dTextSize,
      textBias: ancData.m_vTextAlign
    };
}
//获取系统中的自定义CAD锚点总数
Module.REgetCADShpAnchorNum = function(){
  return Module.RealBIMWeb.GetCADShpAnchorNum();
}
//获取系统中所有的自定义CAD锚点信息
Module.REgetAllCADShpAnchors = function(){
  var allAncData =Module.RealBIMWeb.GetAllCADShpAnchors();
  if(allAncData.size()==0){
    return 0;
  }else{
    var arrAncData = [];
    for(var i=0;i <allAncData.size(); ++i){
      var tempobj =allAncData.get(i);
      var _textClr= (tempobj.m_uTextClr).toString(16).substring(6,8)+(tempobj.m_uTextClr).toString(16).substring(4,6)+(tempobj.m_uTextClr).toString(16).substring(2,4);
      var _textAlpha= parseInt((tempobj.m_uTextClr).toString(16).substring(0,2),16);
      arrAncData.push({
        id: tempobj.m_strID, 
        pos: tempobj.m_vPos, 
        picPath: tempobj.m_strShpPath,  
        groupName: tempobj.m_strGroupID,
        strText: tempobj.m_strText, 
        textClr: _textClr,
        textAlpha: _textAlpha,
        textSize: tempobj.m_dTextSize,
        textBias: tempobj.m_vTextAlign
      });
    }
    return arrAncData;
  }
}
//删除一系列自定义CAD锚点
Module.REdelCADShpAnchors = function(arrIDs){
  var tempAnchors = new Module.RE_Vector_WStr();
  for(i=0;i<arrIDs.length;++i){
    tempAnchors.push_back(arrIDs[i]);
  }
  return Module.RealBIMWeb.DelCADShpAnchors(tempAnchors);
}
//删除系统所有的自定义CAD锚点
Module.REdelAllCADShpAnchors = function(){
  Module.RealBIMWeb.DelAllCADShpAnchors();
}
//获取所有的自定义CAD锚点组名称
Module.REgetAllCADShpAnchorGroupIDs = function(){
  var _temparr = Module.RealBIMWeb.GetAllCADShpAnchorGroupIDs();
  if(_temparr.size()==0){
    return 0;
  }else{
    var arrgroupname = [];
    for(var i=0;i <_temparr.size(); ++i){
      var tempobj =_temparr.get(i);
      arrgroupname.push(tempobj);
    }
    return arrgroupname;
  }
}
//获取系统中某一组自定义CAD锚点信息
Module.REgetGroupCADShpAnchors = function(groupId){
  var groupAncData =Module.RealBIMWeb.GetGroupCADShpAnchors(groupId);
  if(groupAncData.size()==0){
    return 0;
  }else{
    var arrAncData = [];
    for(var i=0;i <groupAncData.size(); ++i){
      var tempobj =groupAncData.get(i);
      var _textClr= (tempobj.m_uTextClr).toString(16).substring(6,8)+(tempobj.m_uTextClr).toString(16).substring(4,6)+(tempobj.m_uTextClr).toString(16).substring(2,4);
      var _textAlpha= parseInt((tempobj.m_uTextClr).toString(16).substring(0,2),16);
      arrAncData.push({
        id: tempobj.m_strID, 
        pos: tempobj.m_vPos, 
        picPath: tempobj.m_strShpPath,  
        groupName: tempobj.m_strGroupID,
        strText: tempobj.m_strText, 
        textClr: _textClr,
        textAlpha: _textAlpha,
        textSize: tempobj.m_dTextSize,
        textBias: tempobj.m_vTextAlign
      });
    }
    return arrAncData;
  }
}
//删除某一组自定义CAD锚点
Module.REdelGroupCADShpAnchors = function(groupId){
  Module.RealBIMWeb.DelGroupCADShpAnchors(groupId);
}
//设置某一组自定义CAD锚点的缩放边界值
Module.REsetCADShpAnchorScale = function(groupId,minScaleSize,maxScaleSize){
  Module.RealBIMWeb.SetCADShpAnchorScale(groupId,minScaleSize,maxScaleSize);
}


// ========开始自定义UI相关接口========
// 设置UI按钮的可见性
Module.REsetUIWgtVisible = function(strId,bool){
  Module.RealBIMWeb.UIWgtSetVisible(strId,bool);
}
// 获取当前设置的UI按钮的可见性
Module.REgetUIWgtVisible = function(strId){
  Module.RealBIMWeb.UIWgtGetVisible(strId);
}



// ========开始模型编辑功能接口========
// 进入位置编辑状态
Module.REenterSceneNodeEditMode = function(){
  Module.RealBIMWeb.EnterSceneNodeEditMode();
}
// 退出位置编辑状态
Module.REexitSceneNodeEditMode = function(){
  Module.RealBIMWeb.ExitSceneNodeEditMode();
}
// 设置当前的编辑级别（ 0:数据集| 1:pak级| 2:构件级）
Module.REsetEditNodeLevel = function(uLevel){
  if(uLevel==0){
    Module.RealBIMWeb.SetCtrlLevel(Module.RE_CTRL_LEVEL.PROJ);
  }else if(uLevel==1){
    Module.RealBIMWeb.SetCtrlLevel(Module.RE_CTRL_LEVEL.HMODEL);
  }else if(uLevel==2){
    Module.RealBIMWeb.SetCtrlLevel(Module.RE_CTRL_LEVEL.ELEM);
  }
}
// 获取当前设置的编辑级别
Module.REgetEditNodeLevel = function(){
  var cureditlevel =Module.RealBIMWeb.GetCtrlLevel();
  console.log(cureditlevel);
  return cureditlevel;
}

// pak编辑状态下将pak加入到选择集
// {  "m_strProjID" : "pro01", "m_strHModelID" : "3a05e1ea0a86e8832e1f3102357ab6f4"    };//一个pak结构对象
Module.REaddEditPakID = function(strProjId,strPakId){
  var _pakvec = new Module.RE_Vector_SEL_NODE_ID(); //创建HModel选择集合对象
  var curpak={
    m_strProjID : strProjId, 
    m_strHModelID : strPakId
  };
  _pakvec.push_back(curpak);
  Module.RealBIMWeb.AddToCurSelHModelIDs(_pakvec);     //把1个pak加入选择集
}
// 将1个pak移除选择集
Module.REremoveEditPakID = function(strProjId,strPakId){
  var _pakvec = new Module.RE_Vector_SEL_NODE_ID(); //创建HModel选择集合对象
  var curpak={
    m_strProjID : strProjId, 
    m_strHModelID : strPakId
  };
  _pakvec.push_back(curpak);
  Module.RealBIMWeb.RemoveFromCurSelHModelIDs(_pakvec);     //把1个pak加入选择集 
}
// 获取当前pak选择集内所有对象
Module.REgetEditPakIDs = function(){
  var selpaks = Module.RealBIMWeb.GetCurSelHModelIDs(); //获取当前选中的HugeModel集合
  var pakarr=[];
  for(var i=0;i<selpaks.size();++i){
    pakarr.push(selpaks.get(i))
  };
  return pakarr;
}
// 清空pak选择集
Module.REclearEditPakID = function(){
  var selpaks= Module.REgetEditPakIDs();
  var _pakvec = new Module.RE_Vector_SEL_NODE_ID(); 
  for(var i=0;i<selpaks.length;++i){
    _pakvec.push_back(selpaks[i]);
  };
  Module.RealBIMWeb.RemoveFromCurSelHModelIDs(_pakvec);
}

// 数据集编辑状态下将数据集加入到选择集
Module.REaddEditProjID = function(strProjId){
  var _projvec = new Module.RE_Vector_WStr(); 
  _projvec.push_back(strProjId);
  Module.RealBIMWeb.AddToCurSelProjIDs(_projvec);     //把1个数据集加入选择集
}
// 将1个pak移除选择集
Module.REremoveEditProjID = function(strProjId){
  var _projvec = new Module.RE_Vector_WStr(); 
  _projvec.push_back(strProjId);
  Module.RealBIMWeb.RemoveFromCurSelProjIDs(_projvec);     //把1个数据集加入选择集 
}
// 获取当前pak选择集内所有对象
Module.REgetEditProjIDs = function(){
  var selprojs = Module.RealBIMWeb.GetCurSelProjIDs(); //获取当前选中的数据集集合
  var projarr=[];
  for(var i=0;i<selprojs.size();++i){
    projarr.push(selprojs.get(i))
  };
  return projarr;
}
// 清空pak选择集
Module.REclearEditProjID = function(){
  var selprojs= Module.REgetEditProjIDs();
  var _projvec = new Module.RE_Vector_WStr(); 
  for(var i=0;i<selprojs.length;++i){
    _projvec.push_back(selprojs[i]);
  };
  Module.RealBIMWeb.RemoveFromCurSelProjIDs(_projvec);
}

// 获取pak节点的仿射变换信息（右手坐标系，模型渲染参考右手坐标系）(编辑功能暂时用不到此接口)
//strProjId：表示pak节点所属的数据集id，必填项
//strPakId：表示pak节点id，必填项
Module.REgetPakTransRightCoord = function(strProjId,strPakId){
  var transinfo =Module.RealBIMWeb.GetHugeObjTransform(strProjId,strPakId);
  return transinfo;
}
//设置pak节点的仿射变换信息（右手坐标系，模型渲染参考右手坐标系,xyz）
//strProjId：表示pak节点所属的数据集id，必填项
//strPakId：表示pak节点id，必填项
//transInfo：表示目标位置信息：缩放旋转平移，单位为米，例：[[1,1,1],[0,0,0,1],[0,0,0]]
Module.REsetPakTransRightCoord = function(strProjId,strPakId,transInfo){
  Module.RealBIMWeb.SetHugeObjTransform(strProjId,strPakId,transInfo[0],transInfo[1],transInfo[2]);
}
// 获取pak节点的仿射变换信息（左手坐标系，模型转换参考左手坐标系,xzy）
//strProjId：表示pak节点所属的数据集id，必填项
//strPakId：表示pak节点id，必填项
Module.REgetPakTransLeftCoord = function(strProjId,strPakId){
  var transinfo =Module.RealBIMWeb.GetHugeObjTransform_LH(strProjId,strPakId);
  return transinfo;
}
// 获取地形节点的仿射变换信息（右手坐标系，模型渲染参考右手坐标系）
// (3.0版本地形数据集仅包括一个节点，编辑功能暂时用不到此接口，直接用数据集的接口即可)
//strProjId：表示地形节点所属的数据集id，必填项
//strPakId：表示地形节点id，必填项
Module.REgetUnverHugeGroupTransRightCoord = function(strProjId,strPakId){
  var transinfo =Module.RealBIMWeb.GetUnVerHugeGroupTransform(strProjId,strPakId);
  return transinfo;
}
// 获取地形节点的仿射变换信息（左手坐标系，模型转换参考左手坐标系）
// (3.0版本地形数据集仅包括一个节点，编辑功能暂时用不到此接口，直接用数据集的接口即可)
//strProjId：表示地形节点所属的数据集id，必填项
//strPakId：表示地形节点id，必填项
Module.REgetUnverHugeGroupTransLeftCoord = function(strProjId,strPakId){
  var transinfo =Module.RealBIMWeb.GetUnVerHugeGroupTransform_LH(strProjId,strPakId);
  return transinfo;
}
// 获取数据集的仿射变换信息（右手坐标系，模型渲染参考右手坐标系）
//strProjId：表示要处理的数据集id，不能为空
Module.REgetDataSetTransRightCoord = function(strProjId){
  var transinfo =Module.RealBIMWeb.GetMainSceTransform(strProjId);
  return transinfo;
}
// 设置数据集的仿射变换信息（右手坐标系，模型渲染参考右手坐标系）
//strProjId：表示要处理的数据集id，不能为空
Module.REgetMainSceTransform = function(strProjId){
  var transinfo =Module.RealBIMWeb.GetMainSceTransform(strProjId);
  return transinfo;
}
// 表示要处理的项目名称，为空串则表示处理所有项目
// 表示偏移信息（缩放旋转平移）[[1,1,1],[0,0,0,1],[0,0,0]]
Module.REsetMainSceTransform = function(strProjId,transInfo){
  var _transinfo={
    m_vScale:transInfo[0], m_qRotate:transInfo[1], m_vOffset:transInfo[2]
  }
  return Module.RealBIMWeb.SetMainSceTransform(strProjId,_transinfo);
}

// ========结束模型编辑功能接口========


// ========开始倾斜摄影编辑功能接口========
// （状态值枚举cpp没导出attentionattentionattentionattentionattentionattentionattentionattention）
// 获取当前矢量区编辑的操作状态
// NONE,
// MODIFY,  //倾斜摄影编辑状态
// VIEW, //预览状态
// EDIT_PLANE,  //创建区域角点状态
// MOVING_SECTION_CORNER,  //移动角点状态
Module.REgetCurObEditState = function(){
  var transinfo =Module.RealBIMWeb.GetCurObEditState(strProjId,strPakId);
  return transinfo;
}
// 进入osgb编辑状态
Module.REbeginOSGBEdit = function(){
  Module.RealBIMWeb.BeginOBBottomPlaneEdit();
}
// 退出osgb编辑状态
Module.REendOSGBEdit = function(){
  Module.RealBIMWeb.EndOBBottomPlaneEdit();
}






// MARK 水面编辑
  // =================== 水面编辑 相关
  /**
   * 进入水面编辑状态
   */
  Module.REBeginWaterEdit = function () {
    return Module.RealBIMWeb.BeginWaterEdit();
  }
  
  /**
   * 退出水面编辑状态
   */
  Module.REEndWaterEdit = function () {
    return Module.RealBIMWeb.EndWaterEdit();
  }

  /**
   * 进入水面添加状态
   * @returns 
   */
  Module.REEndWaterEdit = function () {

    return Module.RealBIMWeb.BeginAddWaterRgn();
  }





	// //进入水面添加状态
	// static bool BeginAddWaterRgn(std::wstring strWaterName);
	// //退出水面添加状态
	// static bool EndAddWaterRgn();












// MARK 自定义方法
  /**
   * 检查参数是否为空，并打印错误提示
   * @param {Object} param //参数
   * @param {String} paramName //参数名
   */
  function checkNull(param, paramName) {
    if (typeof param == 'undefined') {
      console.error("* errMsg: 传入参数格式不正确！-> " + paramName);
      return false;
    }
    return true;
  }
  /**
   * 检查参数是否为空，参数类型是否正确
   * @param {Object} param //参数
   * @param {String} paramName //参数名
   * @param {RE_Enum} re_type //枚举类型
   */
  function checkParamType(param, paramName, re_type) {
    if (!checkNull(param, paramName)) return false;

    switch (re_type) {
      case RE_Enum.RE_Check_String:
        {
          if ((typeof param != "string")) {
            console.error("* errMsg: 传入参数格式不正确！-> " + paramName);
            return false;
          }
        }
        break;
      case RE_Enum.RE_Check_Array:
        {
          if (!(param instanceof Array)) {
            console.error("* errMsg: 传入参数格式不正确！-> " + paramName);
            return false;
          }
        }
        break;
      default:
        break;
    }
    return true;
  }

  /**
   * 打印错误提示
   * @param {String} paramName //参数名
   */
  function logErrorWithPar(paramName) {
    console.error("* errMsg: 传入参数格式不正确！-> " + paramName);
  }






// MARK RE_Enum
  //枚举参数
  const RE_Enum = {
    RE_Check_String: 1,//检测字符串
    RE_Check_Array: 2,//检测数组
  }





   
  return ExtModule;
};


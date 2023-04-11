//版本：v2.1.0.1824
var RE2SDKCreateModule =function(ExtModule){

  ExtModule = ExtModule || {};
  var Module=typeof ExtModule!=="undefined" ? ExtModule : {};

  CreateModuleRE2(ExtModule).then(instance => {
    ExtModule = instance;
  }); //创建引擎模块


  

//设置物理屏幕分辨率的缩放系数
Module.REsetScreenScale = function(fScale){
  Module.RealBIMWeb.SetScreenScale(fScale);
}
//获取物理屏幕分辨率的缩放系数
Module.REgetScreenScale = function(){
  return Module.RealBIMWeb.GetScreenScale();
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













// MOD-- 创建矢量对象（点线面）相关
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
      TempTextRect[0] =-1; TempTextRect[2] =1; TempTextFmtFlag |=0x10/*TEXT_FMT_LEFT*/;
  }else{
      TempTextRect[0] =0; TempTextRect[2] =1; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
  }
  if(_textbias[1] < 0){
      TempTextRect[1] =-1; TempTextRect[3] =0; TempTextFmtFlag |=0x4/*TEXT_FMT_TOP*/;
  }else if(_textbias[1] == 0){
      TempTextRect[1] =-1; TempTextRect[3] =1; TempTextFmtFlag |=0x2/*TEXT_FMT_BOTTOM*/;
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
  Module.RealBIMWeb.AddCustomPolyFenceShp(shpName, temparrpos, bClose, uClr, fASDist, fVisDist, _bContactSce);
}










// MOD-- 模型编辑功能



 

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













// MOD-- 自定义UI
  // =================== 自定义UI相关接口
// MARK 窗口
  /**
   * 创建一个窗口容器
   * @param {String} re_UIID  //用来唯一标识一个窗口的字符串，如果创建时指定的该参数之前已用过，则创建失败
   * @param {object} wnd_Info //窗口基本信息 ！！！以下参数均包含在wnd_Info中
   * @param {String} wnd_Title //窗口标题，是否显示跟窗口的显示风格有关
   * @param {String} wnd_Visible //窗口是否可见
   * @param {String} wnd_SizeStyle //窗口的显示尺寸风格名称    (名称是通过UIWgtAddClrStyle函数加入风格池的）
   * @param {String} wnd_ClrStyle //窗口的显示颜色风格名称    (名称是通过UIWgtAddSizeStyle函数加入风格池的）
   * @param {Array[String]} wnd_Flags //窗口的风格标记 （是UIWGT_WND_FLAGS的成员的位或）  RE_WndFlagsEnum 枚举
   * @param {Number} wnd_DockRgn //窗口的停靠区域，是否在显示中停靠指定区域，还需要后边几个xxxPos相关参数的配合 WINDOW_REGION 类型  RE_WndRegionEnum 枚举
   * @param {Number} wnd_ChildLayoutType //窗口内部子部件布局方式 （0：按照布局标记布局  1：水平布局所有部件  2：垂直布局所有部件）
   * @param {Array[Number]} wnd_BaseScrPosType //表示窗口基准点的屏幕空间位置类型X/Y(0->屏幕空间相对位置(0~1)；1->相对低位边界的偏移像素；2->相对高位边界的偏移像素)
   * @param {Array[Number]} wnd_BaseScrPos //表示窗口基准点的屏幕空间位置
   * @param {Array[Number]} wnd_BaseLocalPos //表示窗口基准点的局部空间位置(0~1)
   * @param {Array[Number]} wnd_MaxRatio //表示窗口尺寸占屏幕尺寸的最大比例
   */
   Module.REUIWgtCreateWnd = function (re_UIID, wnd_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(wnd_Info, 'wnd_Info')) return;

    var _strUIID = re_UIID; var _strwnd_Title = re_UIID; var _Visible = true;
    var _strSizeStyleName = "SS_WND_HAVE_BORDER"; var _strClrStyleName = "CS_WND_LIGHT";
    var _wnd_Flags = 0; var _dockRgn = BlackHole3D.RE_UI_WINDOW_REGION.NO; var _ChildWgtLayoutType = 0;
    var _vBaseScrPosType = [0, 0]; var _vBaseScrPos = [0, 0]; var _vBaseLocalPos = [0, 0]; var _vMaxRatio = [1, 1];

    if (typeof wnd_Info.wnd_Title != 'undefined') { _strwnd_Title = wnd_Info.wnd_Title; }
    if (typeof wnd_Info.wnd_Visible != 'undefined') { _Visible = wnd_Info.wnd_Visible; }
    if (typeof wnd_Info.wnd_SizeStyle != 'undefined') { _strSizeStyleName = wnd_Info.wnd_SizeStyle; }
    if (typeof wnd_Info.wnd_ClrStyle != 'undefined') { _strClrStyleName = wnd_Info.wnd_ClrStyle; }

    if (typeof wnd_Info.wnd_Flags != 'undefined' && (wnd_Info.wnd_Flags instanceof Array) && wnd_Info.wnd_Flags.length > 0) {
      wnd_Info.wnd_Flags.forEach(value => {
        if (RE_WndFlagsEnum.includes(value)) _wnd_Flags = _wnd_Flags | eval("BlackHole3D." + value);
      });
    }
    if (typeof wnd_Info.wnd_DockRgn != 'undefined' && wnd_Info.wnd_DockRgn < RE_WndRegionEnum.length) {
      _dockRgn = eval("BlackHole3D.RE_UI_WINDOW_REGION." + RE_WndRegionEnum[wnd_Info.wnd_DockRgn]);
    }
    if (typeof wnd_Info.wnd_ChildLayoutType != 'undefined') { _ChildWgtLayoutType = wnd_Info.wnd_ChildLayoutType; }
    if (typeof wnd_Info.wnd_BaseScrPosType != 'undefined') { _vBaseScrPosType = wnd_Info.wnd_BaseScrPosType; }
    if (typeof wnd_Info.wnd_BaseScrPos != 'undefined') { _vBaseScrPos = wnd_Info.wnd_BaseScrPos; }
    if (typeof wnd_Info.wnd_BaseLocalPos != 'undefined') { _vBaseLocalPos = wnd_Info.wnd_BaseLocalPos; }
    if (typeof wnd_Info.wnd_MaxRatio != 'undefined') { _vMaxRatio = wnd_Info.wnd_MaxRatio; }
    
    return Module.RealBIMWeb.UIWgtCreateWnd(_strUIID, _strwnd_Title, _Visible, _strSizeStyleName, _strClrStyleName, _wnd_Flags, _dockRgn, _ChildWgtLayoutType, _vBaseScrPosType, _vBaseScrPos, _vBaseLocalPos, _vMaxRatio);
  }

  /**
   * 窗口的停靠位置
   * @param {String} re_UIID //用来唯一标识一个窗口的字符串，如果传入的 re_UIID 不存在，则返回false
   * @param {object} wnd_Info //控件基本信息 ！！！以下参数均包含在 wnd_Info 中
   * @param {Number} wnd_DockRgn //窗口的停靠区域，是否在显示中停靠指定区域，还需要后边几个xxxPos相关参数的配合 WINDOW_REGION 类型
   * @param {Array[Number]} wnd_BaseScrPosType //表示窗口基准点的屏幕空间位置类型X/Y(0->屏幕空间相对位置(0~1)；1->相对低位边界的偏移像素；2->相对高位边界的偏移像素)
   * @param {Array[Number]} wnd_BaseScrPos //表示窗口基准点的屏幕空间位置
   * @param {Array[Number]} wnd_BaseLocalPos //表示窗口基准点的局部空间位置(0~1)
   * @param {Array[Number]} wnd_MaxRatio //表示窗口尺寸占屏幕尺寸的最大比例
   */
  Module.REUIWgtSetWndDockArea = function (re_UIID, wnd_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(wnd_Info, 'wnd_Info')) return;

    var _strUIID = re_UIID;
    var _dockRgn = BlackHole3D.RE_UI_WINDOW_REGION.NO;
    var _vBaseScrPosType = [0, 0]; var _vBaseScrPos = [0, 0]; var _vBaseLocalPos = [0, 0]; var _vMaxRatio = [1, 1];

    if (typeof wnd_Info.wnd_DockRgn != 'undefined' && wnd_Info.wnd_DockRgn < RE_WndRegionEnum.length) {
      _dockRgn = eval("BlackHole3D.RE_UI_WINDOW_REGION." + RE_WndRegionEnum[wnd_Info.wnd_DockRgn]);
    }
    if (typeof wnd_Info.wnd_BaseScrPosType != 'undefined') { _vBaseScrPosType = wnd_Info.wnd_BaseScrPosType; }
    if (typeof wnd_Info.wnd_BaseScrPos != 'undefined') { _vBaseScrPos = wnd_Info.wnd_BaseScrPos; }
    if (typeof wnd_Info.wnd_BaseLocalPos != 'undefined') { _vBaseLocalPos = wnd_Info.wnd_BaseLocalPos; }
    if (typeof wnd_Info.wnd_MaxRatio != 'undefined') { _vMaxRatio = wnd_Info.wnd_MaxRatio; }

    return Module.RealBIMWeb.UIWgtSetWndDockArea(_strUIID, _dockRgn, _vBaseScrPosType, _vBaseScrPos, _vBaseLocalPos, _vMaxRatio);
  }

  /**
   * 获取窗口子部件的布局类型
   * @param {String} re_UIID //控件id
   */
  Module.REUIWgtGetChildWgtLayoutType = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetChildWgtLayoutType(re_UIID);
  }

  /**
   * 设置窗口子部件的布局类型
   * @param {String} re_UIID //控件id
   * @param {Number} el_LayoutType //布局类型（0：按照布局标记布局  1：水平布局所有部件  2：垂直布局所有部件）
   */
  Module.REUIWgtSetChildWgtLayoutType = function (re_UIID, el_LayoutType) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_LayoutType, 'el_LayoutType')) return;
    return Module.RealBIMWeb.UIWgtSetChildWgtLayoutType(re_UIID, el_LayoutType);
  }

  

  /**
   * 获取窗口的内部布局尺寸
   * @param {String} re_UIID //控件id
   */
  Module.REUIWgtGetWndSizeStyle = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetWndSizeStyle(re_UIID);
  }

  /**
   * 设置窗口的内部布局尺寸
   * @param {String} re_UIID //控件id
   * @param {String} el_ClrStyleName //尺寸风格名称 (名称是通过UIWgtAddSizeStyle函数加入风格池的）
   */
  Module.REUIWgtSetWndSizeStyle = function (re_UIID, el_SizeStyleName) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_SizeStyleName, 'el_SizeStyleName')) return;
    return Module.RealBIMWeb.UIWgtSetWndSizeStyle(re_UIID, el_SizeStyleName);
  }

// MARK Button
  // =================== Button Widget 相关
  

  

  

  /**
   * 获取按钮的某子状态使用的按钮文字
   * @param {String} re_UIID //控件id
   * @param {Number} el_StateID //按钮的子状态id	el_StateParams 对象列表 index 下标
   */
  Module.REUIWgtGetBtnSubStateText = function (re_UIID, el_StateID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_StateID, 'el_StateID')) return;
    return Module.RealBIMWeb.UIWgtGetBtnSubStateText(re_UIID, el_StateID);
  }

  /**
   * 设置按钮的某子状态使用的按钮文字（在存在纹理的情况下，文字不显示）
   * @param {String} re_UIID //控件id
   * @param {Number} el_StateID //按钮的子状态id	el_StateParams 对象列表 index 下标
   * @param {Number} el_TextureURL //按钮的子状态纹理路径
   */
  Module.REUIWgtSetBtnSubStateText = function (re_UIID, el_StateID, el_Text) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_StateID, 'el_StateID')) return;
    if (!checkNull(el_Text, 'el_Text')) return;
    return Module.RealBIMWeb.UIWgtSetBtnSubStateText(re_UIID, el_StateID, el_Text);
  }

  /**
   * 获取按钮的某子状态使用的Hover提示文字
   * @param {String} re_UIID //控件id
   * @param {Number} el_StateID //按钮的子状态id	el_StateParams 对象列表 index 下标
   */
  Module.REUIWgtGetBtnSubStateHint = function (re_UIID, el_StateID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_StateID, 'el_StateID')) return;
    return Module.RealBIMWeb.UIWgtGetBtnSubStateHint(re_UIID, el_StateID);
  }

  /**
   * 设置按钮的某子状态使用的Hover提示文字
   * @param {String} re_UIID //控件id
   * @param {Number} el_StateID //按钮的子状态id	el_StateParams 对象列表 index 下标
   * @param {Number} el_TextureURL //按钮的子状态纹理路径
   */
  Module.REUIWgtSetBtnSubStateHint = function (re_UIID, el_StateID, el_Hint) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_StateID, 'el_StateID')) return;
    if (!checkNull(el_Hint, 'el_Hint')) return;
    return Module.RealBIMWeb.UIWgtSetBtnSubStateHint(re_UIID, el_StateID, el_Hint);
  }

// MARK CheckBox
  // =================== CheckBox Widget 相关
  /**
   * 创建一个checkBox控件
   * @param {String} re_UIID //控件id
   * @param {Object} el_Info //控件基本信息 ！！！以下参数均包含在 el_Info 中
   * @param {Number} el_Text //显示文字
   * @param {Number} el_Visible //是否可见
   * @param {Number} el_isCheck //是否选择
   */
  Module.REUIWgtCreateCheckBox = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!checkNull(el_Info.el_Text, 'el_Text')) return;
    var _strUIID = re_UIID;
    var _Visible = true; var _strText = ""; var _bChecked = true;

    if (typeof el_Info.el_Visible != 'undefined') { _Visible = el_Info.el_Visible; }
    if (typeof el_Info.el_Text != 'undefined') { _strText = el_Info.el_Text; }
    if (typeof el_Info.el_isCheck != 'undefined') { _bChecked = el_Info.el_isCheck; }

    return Module.RealBIMWeb.UIWgtCreateCheckBox(_strUIID, _Visible, _strText, _bChecked);
  }

  /**
   * 获取CheckBox选择状态
   * @param {String} re_UIID //控件id
   */
  Module.REUIWgtGetCheckBoxState = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetCheckBoxState(re_UIID);
  }

  /**
   * 设置CheckBox选择状态
   * @param {String} re_UIID //控件id
   * @param {Number} el_isCheck //是否已经选择
   */
  Module.REUIWgtSetCheckBoxState = function (re_UIID, el_isCheck) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtSetCheckBoxState(re_UIID, el_isCheck);
  }

  /**
   * 设置CheckBox颜色
   * @param {String} re_UIID //控件id
   * @param {String} el_unCheckClrState //未选择时的颜色样式名称
   * @param {String} el_checkedClrState //选择时的颜色样式名称 
   */
  Module.REUIWgtSetCheckBoxClrStates = function (re_UIID, el_unCheckClrState, el_checkedClrState) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_unCheckClrState, 'el_unCheckClrState')) return;
    if (!checkNull(el_checkedClrState, 'el_checkedClrState')) return;

    var _unCheck = Module.RealBIMWeb.UIWgtGetClrStyle(el_unCheckClrState);
    var _checked = Module.RealBIMWeb.UIWgtGetClrStyle(el_checkedClrState);
    return Module.RealBIMWeb.UIWgtSetCheckBoxClrStates(re_UIID, _unCheck, _checked);
  }

  /**
   * 设置CheckBox尺寸
   * @param {String} re_UIID //控件id
   * @param {String} el_unCheckSizeStyle //未选择时的尺寸样式名称
   * @param {String} el_checkedSizeState //选择时的尺寸样式名称 
   */
  Module.REUIWgtSetCheckBoxSizeStates = function (re_UIID, el_unCheckSizeStyle, el_checkedSizeState) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_unCheckSizeStyle, 'el_unCheckSizeStyle')) return;
    if (!checkNull(el_checkedSizeState, 'el_checkedSizeState')) return;

    var _unCheck = Module.RealBIMWeb.UIWgtGetSizeStyle(el_unCheckSizeStyle);
    var _checked = Module.RealBIMWeb.UIWgtGetSizeStyle(el_checkedSizeState);
    return Module.RealBIMWeb.UIWgtSetCheckBoxSizeStates(re_UIID, _unCheck, _checked);
  }

// MARK Radio
  // =================== RadioButton Widget 相关
  /**
   * 创建一个RadioButton控件
   * @param {String} re_UIID //控件id
   * @param {Object} el_Info //控件基本信息 ！！！以下参数均包含在 el_Info 中
   * @param {Number} el_Text //显示文字
   * @param {Number} el_Visible //是否可见
   * @param {Number} el_isCheck //是否选择
   */
  Module.REUIWgtCreateRadioButton = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!checkNull(el_Info.el_Text, 'el_Text')) return;
    var _strUIID = re_UIID;
    var _Visible = true; var _strText = ""; var _bChecked = true;

    if (typeof el_Info.el_Visible != 'undefined') { _Visible = el_Info.el_Visible; }
    if (typeof el_Info.el_Text != 'undefined') { _strText = el_Info.el_Text; }
    if (typeof el_Info.el_isCheck != 'undefined') { _bChecked = el_Info.el_isCheck; }

    return Module.RealBIMWeb.UIWgtCreateRadioButton(_strUIID, _Visible, _strText, _bChecked);
  }

  /**
   * 获取RadioButton选择状态
   * @param {String} re_UIID //控件id
   */
  Module.REUIWgtGetRadioBtnSelState = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetRadioBtnSelState(re_UIID);
  }

  /**
   * 设置RadioButton选择状态
   * @param {String} re_UIID //控件id
   * @param {Number} el_isCheck //是否已经选择
   */
  Module.REUIWgtSetRadioBtnSelState = function (re_UIID, el_isCheck) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtSetRadioBtnSelState(re_UIID, el_isCheck);
  }

  /**
   * 设置RadioButton颜色
   * @param {String} re_UIID //控件id
   * @param {String} el_unCheckClrState //未选择时的颜色样式名称
   * @param {String} el_checkedClrState //选择时的颜色样式名称 
   */
  Module.REUIWgtSetRadioBtnClrStates = function (re_UIID, el_unCheckClrState, el_checkedClrState) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_unCheckClrState, 'el_unCheckClrState')) return;
    if (!checkNull(el_checkedClrState, 'el_checkedClrState')) return;

    var _unCheck = Module.RealBIMWeb.UIWgtGetClrStyle(el_unCheckClrState);
    var _checked = Module.RealBIMWeb.UIWgtGetClrStyle(el_checkedClrState);
    return Module.RealBIMWeb.UIWgtSetRadioBtnClrStates(re_UIID, _unCheck, _checked);
  }

  /**
   * 设置RadioButton尺寸
   * @param {String} re_UIID //控件id
   * @param {String} el_unCheckSizeStyle //未选择时的尺寸样式名称
   * @param {String} el_checkedSizeState //选择时的尺寸样式名称 
   */
  Module.REUIWgtSetRadioBtnSizeStates = function (re_UIID, el_unCheckSizeStyle, el_checkedSizeState) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_unCheckSizeStyle, 'el_unCheckSizeStyle')) return;
    if (!checkNull(el_checkedSizeState, 'el_checkedSizeState')) return;

    var _unCheck = Module.RealBIMWeb.UIWgtGetSizeStyle(el_unCheckSizeStyle);
    var _checked = Module.RealBIMWeb.UIWgtGetSizeStyle(el_checkedSizeState);
    return Module.RealBIMWeb.UIWgtSetRadioBtnSizeStates(re_UIID, _unCheck, _checked);
  }

// MARK Label
  // =================== Label 相关
  /**
   * 创建一个Label控件
   * @param {String} re_UIID //控件id
   * @param {Object} el_Info //控件基本信息 ！！！以下参数均包含在 el_Info 中
   * @param {String} el_Text //显示文字
   * @param {Boolean} el_Visible //是否可见
   * @param {Array[Number]} el_Size //期望大小 vec2
   */
  Module.REUIWgtCreateLabel = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!checkNull(el_Info.el_Text, 'el_Text')) return;
    if (!checkNull(el_Info.el_Size, 'el_Size')) return;

    var _Visible = true; if (typeof el_Info.el_Visible != 'undefined') { _Visible = el_Info.el_Visible; }

    return Module.RealBIMWeb.UIWgtCreateLabel(re_UIID, _Visible, el_Info.el_Size, el_Info.el_Text);
  }

  /**
   * 获取Label文字
   * @param {String} re_UIID //控件id
   */
  Module.REUIWgtGetLableText = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetLableText(re_UIID);
  }

  /**
   * 设置Label文字
   * @param {String} re_UIID //控件id
   * @param {String} el_Text //显示文字
   */
  Module.REUIWgtSetLableText = function (re_UIID, el_Text) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Text, 'el_Text')) return;
    return Module.RealBIMWeb.UIWgtSetLableText(re_UIID, el_Text);
  }



// MARK NumInput
  // =================== 数值编辑 相关
  /**
   * 创建一个NumberInput控件
   * @param {String} re_UIID //控件id
   * @param {Object} el_Info //控件基本信息 ！！！以下参数均包含在 el_Info 中
   * @param {Boolean} el_Visible //是否可见
   * @param {Boolean} el_CanEdit //是否可编辑
   * @param {Array[Number]} el_Size //期望大小 vec2
   * @param {String} el_Format //格式化标准   "%d"  "%.2f"
   * @param {RE_InputTypeEnum} el_InputType //输入类型 和有几位显示   UI_EDITBOX_NUMTYPE
   * @param {Array[Number]} el_Value //显示数据 vec4 最大四维数组
   */
   Module.REUIWgtCreateNumberInputWgt = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!checkParamType(el_Info.el_Size, 'el_Size', RE_Enum.RE_Check_Array)) return;
    if (!checkParamType(el_Info.el_InputType, 'el_InputType', RE_Enum.RE_Check_String)) return;
    if (!checkParamType(el_Info.el_Value, 'el_Value', RE_Enum.RE_Check_Array)) return;
    
    var _Visible = true; var _strFmt = "%f"; var _bEditable = true;

    if (!RE_InputTypeEnum.includes(el_Info.el_InputType)) {
      logErrorWithPar('el_InputType');
      return;
    }
    var _uEditBoxNumType = eval('Module.RE_UI_EDITBOX_NUMTYPE.' + el_Info.el_InputType);

    var _vNum = [];
    for (let i = 0; i < 4; i++) {
      if (i < el_Info.el_Value.length) {
        _vNum.push(el_Info.el_Value[i]);
        continue;
      }
      _vNum.push(0);
    }
    if (typeof el_Info.el_Visible != 'undefined') { _Visible = el_Info.el_Visible; }
    if (typeof el_Info.el_Format != 'undefined') { _strFmt = el_Info.el_Format; }
    if (typeof el_Info.el_CanEdit != 'undefined') { _bEditable = el_Info.el_CanEdit; }

    return Module.RealBIMWeb.UIWgtCreateNumberInputWgt(re_UIID, _Visible, el_Info.el_Size, _uEditBoxNumType, _vNum, _strFmt, _bEditable);
  }

  /**
   * 获取 NumInput 数值
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetNumberInputWgtValue = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetNumberInputWgtValue(re_UIID);
  }

  /**
   * 设置 NumInput 数值
   * @param {String} re_UIID //控件id
   * @param {Array[Number]} el_Value //显示数据 vec4 最大四维数组  无用数值用0代替 
   */
   Module.REUIWgtSetNumberInputWgtValue = function (re_UIID, el_Value) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkParamType(el_Value, 'el_Value', RE_Enum.RE_Check_Array)) return;
    
    var _vNum = [];
    for (let i = 0; i < 4; i++) {
      if (i < el_Value.length) {
        _vNum.push(el_Value[i]);
        continue;
      }
      _vNum.push(0);
    }
    return Module.RealBIMWeb.UIWgtSetNumberInputWgtValue(re_UIID, _vNum);
  }

  /**
   * 获取 NumInput 是否可以编辑
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetNumberInputWgtEditable = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetNumberInputWgtEditable(re_UIID);
  }

  /**
   * 设置 NumInput 是否可以编辑
   * @param {String} re_UIID //控件id
   * @param {Boolean} el_CanEdit //是否可编辑
   */
   Module.REUIWgtSetNumberInputWgtEditable = function (re_UIID,el_CanEdit) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtSetNumberInputWgtEditable(re_UIID,el_CanEdit);
  }

// MARK ComboBox
  // =================== ComboBox 相关
  /**
   * 创建一个ComboBox控件
   * @param {String} re_UIID //控件id
   * @param {Object} el_Info //控件基本信息 ！！！以下参数均包含在 el_Info 中
   * @param {Boolean} el_Visible //是否可见
   * @param {Array[Number]} el_Size //期望大小 vec2
   * @param {String} el_Text //ComboBox旁边的标签文字
   * @param {Number} el_CurrIndex //当前选中项索引
   * @param {Array[String]} el_DataList //内容列表
   */
   Module.REUIWgtCreateComboBox = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!checkParamType(el_Info.el_Size, 'el_Size', RE_Enum.RE_Check_Array)) return;
    if (!checkParamType(el_Info.el_DataList, 'el_DataList', RE_Enum.RE_Check_Array)) return;

    var _Visible = true; var _strLabel = ''; var _sCurrIndex = 0;
    
    var _arrItems = new Module.RE_Vector_WStr();
    el_Info.el_DataList.forEach(value => {
      _arrItems.push_back(value);
    });
    if (typeof el_Info.el_Visible != 'undefined') { _Visible = el_Info.el_Visible; }
    if (typeof el_Info.el_Text != 'undefined') { _strLabel = el_Info.el_Text; }
    if (typeof el_Info.el_CurrIndex != 'undefined') { _sCurrIndex = el_Info.el_CurrIndex; }
    
    return Module.RealBIMWeb.UIWgtCreateComboBox(re_UIID, _Visible, el_Info.el_Size, _strLabel, _arrItems, _sCurrIndex);
  }

  /**
   * 获取 ComboBox 的显示参数
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetComboBoxFlags = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    var _flagsEnum = Module.RealBIMWeb.UIWgtGetComboBoxFlags(re_UIID);
    if (_flagsEnum.value >= RE_ComboBoxTypeEnum.length) return;
    var el_typeName = RE_ComboBoxTypeEnum[_flagsEnum.value];
    return el_typeName;
  }

  /**
   * 设置 ComboBox 的显示参数
   * @param {String} re_UIID //控件id
   * @param {RE_ComboBoxTypeEnum} el_typeName //类型名称
   */
   Module.REUIWgtSetComboBoxFlags = function (re_UIID,el_type) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkParamType(el_typeName, 'el_typeName', RE_Enum.RE_Check_String)) return;

    if (!RE_ComboBoxTypeEnum.includes(el_Info.el_typeName)) {
      logErrorWithPar('el_typeName');
      return;
    }
    var _flags = eval('Module.RE_UI_COMBOBOX_FLAGS.' + el_typeName);
    return Module.RealBIMWeb.UIWgtSetComboBoxFlags(re_UIID, _flags);
  }

  /**
   * 获取 ComboBox 旁边的标签
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetComboBoxLabel = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetComboBoxLabel(re_UIID);
  }

  /**
   * 设置 ComboBox 旁边的标签
   * @param {String} re_UIID //控件id
   * @param {String} el_Text //标签内容
   */
   Module.REUIWgtSetComboBoxLabel = function (re_UIID,el_Text) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Text, 'el_Text')) return;
    return Module.RealBIMWeb.UIWgtSetComboBoxLabel(re_UIID,el_Text);
  }

  /**
   * 获取 ComboBox 在没有选择任何item时框里显示的内容
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetComboBoxPreviewValue = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetComboBoxPreviewValue(re_UIID);
  }

  /**
   * 设置 ComboBox 在没有选择任何item时框里显示的内容
   * @param {String} re_UIID //控件id
   * @param {String} el_Text //框里显示的内容
   */
   Module.REUIWgtSetComboBoxPreviewValue = function (re_UIID,el_Text) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Text, 'el_Text')) return;
    return Module.RealBIMWeb.UIWgtSetComboBoxPreviewValue(re_UIID,el_Text);
  }

  /**
   * 获取 ComboBox 列表内容
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetComboBoxItemList = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    var _dataListVector = Module.RealBIMWeb.UIWgtGetComboBoxItemList(re_UIID)
    
    var el_DataList = [];
    for (let i = 0; i < _dataListVector.size(); i++) {
      el_DataList.push(_dataListVector.get(i));
    }
    return el_DataList;
  }

  /**
   * 设置 ComboBox 列表内容
   * @param {String} re_UIID //控件id
   * @param {Array[String]} el_DataList //列表内容
   */
   Module.REUIWgtSetComboBoxItemList = function (re_UIID,el_DataList) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkParamType(el_DataList, 'el_DataList', RE_Enum.RE_Check_Array)) return;

    var _dataListVector = new Module.RE_Vector_WStr();
    try {
      el_DataList.forEach(value => {
        if (!checkParamType(value, 'el_DataList', RE_Enum.RE_Check_String)) {
          throw new Error('');
        }
        _dataListVector.push_back(value);
      });
    } catch (error) {
      return;
    }
    return Module.RealBIMWeb.UIWgtSetComboBoxItemList(re_UIID,_dataListVector);
  }

  /**
   * 获取 ComboBox 当前选中项的索引
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetComboBoxCurrIndex = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetComboBoxCurrIndex(re_UIID);
  }

  /**
   * 设置 ComboBox 当前选中项的索引   可以指定 el_CurrIndex == -1让ComboBox不选中任何项
   * @param {String} re_UIID //控件id
   * @param {Number} el_CurrIndex //当前选中项索引
   */
   Module.REUIWgtSetComboBoxCurrIndex = function (re_UIID,el_CurrIndex) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_CurrIndex, 'el_CurrIndex')) return;
    return Module.RealBIMWeb.UIWgtSetComboBoxCurrIndex(re_UIID,el_CurrIndex);
  }


// MARK SliderBar
  // =================== 滑动条控件 (SliderBar)相关
  /**
   * 创建一个 SliderBar 控件
   * @param {String} re_UIID //控件id
   * @param {Object} el_Info //控件基本信息 ！！！以下参数均包含在 el_Info 中
   * @param {Boolean} el_Visible //是否可见
   * @param {Array[Number]} el_Size //期望大小 vec2
   * @param {RE_InputTypeEnum} el_InputType //输入类型 和有几位显示 UI_EDITBOX_NUMTYPE
   * @param {Array[Number]} el_Value //显示数据 vec4 最大四维数组
   * @param {Array[Number]} el_ValueRange //滑动条的数值范围 vec2 [minValue,maxValue]
   * @param {String} el_Format //格式化标准   "%d"  "%.2f"
   * @param {Boolean} el_CanEdit //是否可编辑
   * @param {Boolean} el_IsVertical //是否为垂直滑动条
   */
   Module.REUIWgtCreateSliderBar = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!checkParamType(el_Info.el_Size, 'el_Size', RE_Enum.RE_Check_Array)) return;
    if (!checkParamType(el_Info.el_InputType, 'el_InputType', RE_Enum.RE_Check_String)) return;
    if (!checkParamType(el_Info.el_Value, 'el_Value', RE_Enum.RE_Check_Array)) return;
    if (!checkParamType(el_Info.el_ValueRange, 'el_ValueRange', RE_Enum.RE_Check_Array)) return;

    var _Visible = true; var _strFmt = "%f"; var _bEditable = true; var _bVertical = false;

    if (!RE_InputTypeEnum.includes(el_Info.el_InputType)) {
      logErrorWithPar('el_InputType');
      return;
    }
    var _uEditBoxNumType = eval('Module.RE_UI_EDITBOX_NUMTYPE.' + el_Info.el_InputType);

    var _vNum = [];
    for (let i = 0; i < 4; i++) {
      if (i < el_Info.el_Value.length) {
        _vNum.push(el_Info.el_Value[i]);
        continue;
      }
      _vNum.push(0);
    }
    if (typeof el_Info.el_Visible != 'undefined') { _Visible = el_Info.el_Visible; }
    if (typeof el_Info.el_Format != 'undefined') { _strFmt = el_Info.el_Format; }
    if (typeof el_Info.el_CanEdit != 'undefined') { _bEditable = el_Info.el_CanEdit; }
    if (typeof el_Info.el_IsVertical != 'undefined') { _bVertical = el_Info.el_IsVertical; }
    
    return Module.RealBIMWeb.UIWgtCreateSliderBar(re_UIID, _Visible, el_Info.el_Size, _uEditBoxNumType, _vNum, el_Info.el_ValueRange, _strFmt, _bEditable, _bVertical);
  }

  /**
   * 获取 SliderBar 数值
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetSliderBarValue = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetSliderBarValue(re_UIID);
  }

  /**
   * 设置 SliderBar 数值
   * @param {String} re_UIID //控件id
   * @param {Array[Number]} el_Value //显示数据 vec4 最大四维数组  无用数值用0代替 
   */
   Module.REUIWgtSetSliderBarValue = function (re_UIID, el_Value) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkParamType(el_Value, 'el_Value', RE_Enum.RE_Check_Array)) return;
    
    var _vNum = [];
    for (let i = 0; i < 4; i++) {
      if (i < el_Value.length) {
        _vNum.push(el_Value[i]);
        continue;
      }
      _vNum.push(0);
    }
    return Module.RealBIMWeb.UIWgtSetSliderBarValue(re_UIID, _vNum);
  }

  /**
   * 获取 SliderBar 数值范围
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetSliderBarValueRange = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetSliderBarValueRange(re_UIID);
  }

  /**
   * 设置 SliderBar 数值范围
   * @param {String} re_UIID //控件id
   * @param {Array[Number]} el_ValueRange //滑动条的数值范围 vec2 [minValue,maxValue]
   */
   Module.REUIWgtSetSliderBarValueRange = function (re_UIID, el_ValueRange) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkParamType(el_ValueRange, 'el_ValueRange', RE_Enum.RE_Check_Array)) return;
    return Module.RealBIMWeb.UIWgtSetSliderBarValueRange(re_UIID, el_ValueRange);
  }

  /**
   * 获取 NumInput 是否为垂直滑动条
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetSliderBarVertLayout = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetSliderBarVertLayout(re_UIID);
  }

  /**
   * 设置 NumInput 是否为垂直滑动条
   * @param {String} re_UIID //控件id
   * @param {Boolean} el_IsVertical //是否为垂直滑动条
   */
   Module.REUIWgtSetSliderBarVertLayout = function (re_UIID,el_IsVertical) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtSetSliderBarVertLayout(re_UIID,el_IsVertical);
  }



// MARK ColorEditer
  // =================== ColorEditer Widget 相关
  /**
   * 创建一个ColorEditer控件
   * @param {String} re_UIID //控件id
   * @param {Object} el_Info //控件基本信息 ！！！以下参数均包含在 el_Info 中
   * @param {String} el_Text //颜色控件支持在后边加一个文字标签
   * @param {Boolean} el_Visible //是否可见
   * @param {Array[Number]} el_color //初始颜色 四元数组  RGBA   0-1的取值范围
   * @param {Number} el_editStyle //颜色控件的显示类型，当前支持5种类型，其数值对应于 COLOR_EDITER_STYLE 枚举
   * @param {Array[Number]} el_btnSize //当颜色控件当一个颜色button显示时，指定其大小
   */
  Module.REUIWgtCreateColorEditer = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!checkParamType(el_Info.el_color, 'el_color', RE_Enum.RE_Check_Array)) return;

    var _bVisible = true; var _strLabel = ""; var _clrEditStyle = 0; var _vBtnSize = [0,0];

    if (typeof el_Info.el_Visible != 'undefined') { _bVisible = el_Info.el_Visible; }
    if (typeof el_Info.el_Text != 'undefined') { _strLabel = el_Info.el_Text; }
    if (typeof el_Info.el_isCheck != 'undefined') { _bChecked = el_Info.el_isCheck; }
    if (typeof el_Info.el_editStyle != 'undefined') { _clrEditStyle = el_Info.el_editStyle; }
    if (typeof el_Info.el_btnSize != 'undefined') { _vBtnSize = el_Info.el_btnSize; }

    return Module.RealBIMWeb.UIWgtCreateColorEditer(re_UIID, _bVisible, _strLabel, el_Info.el_color, _clrEditStyle, _vBtnSize);
  }

  /**
   * 获取 ColorEditer 旁边的标签内容
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetColorEditerLabel = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetColorEditerLabel(re_UIID);
  }

  /**
   * 设置 ColorEditer 旁边的标签内容
   * @param {String} re_UIID //控件id
   * @param {String} el_Text //标签内容
   */
   Module.REUIWgtSetColorEditerLabel = function (re_UIID,el_Text) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Text, 'el_Text')) return;
    return Module.RealBIMWeb.UIWgtSetColorEditerLabel(re_UIID,el_Text);
  }

  /**
   * 获取 ColorEditer 颜色控件的值  RGBA 类型值 vec4
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetColorEditerValueRGBA = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetColorEditerValueV4(re_UIID);
  }

  /**
   * 设置 ColorEditer 颜色控件的值  RGBA 类型值 vec4
   * @param {String} re_UIID //控件id
   * @param {Array[Number]} el_color //初始颜色 四元数组  RGBA   0-1的取值范围
   */
   Module.REUIWgtSetColorEditerValueRGBA = function (re_UIID,el_color) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkParamType(el_color, 'el_color', RE_Enum.RE_Check_Array)) return;
    return Module.RealBIMWeb.UIWgtSetColorEditerValueV4(re_UIID,el_color);
  }

  /**
   * 获取 ColorEditer 颜色控件的值  十六进制 类型值 
   * @param {String} re_UIID //控件id
   */
   Module.REUIWgtGetColorEditerValueHEX = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    var value = Module.RealBIMWeb.UIWgtGetColorEditerValueU(re_UIID);
    var _hex_reverse = value.toString(16);
    var count = _hex_reverse.length;
    for (let a = 0; a < (8 - count); a++) {
      _hex_reverse = '0' + _hex_reverse;
    }
    var _hex =  '0x' + _hex_reverse.split("").reverse().join("");
    return _hex;
  }

  /**
   * 设置 ColorEditer 颜色控件的值  十六进制 类型值 
   * @param {String} re_UIID //控件id
   * @param {String} el_color //颜色值 十六进制  0xFF00FF80   ABGR
   */
   Module.REUIWgtSetColorEditerValueHEX = function (re_UIID,el_color) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkParamType(el_color, 'el_color', RE_Enum.RE_Check_String)) return;

    var _el_ClrValue = el_color;
    if (_el_ClrValue.includes('0x')) {
      _el_ClrValue = _el_ClrValue.replace('0x','');
    }
    var _el_ClrValue_Reverse = '0x' + _el_ClrValue.split('').reverse().join('');//c++要地址位从低到高存储 ABGR

    return Module.RealBIMWeb.UIWgtSetColorEditerValueU(re_UIID, _el_ClrValue_Reverse);
  }



// MARK 便利函数
  // =================== 内建UI指定风格的便利函数
// MARK ClrStyle
  /**
   * 获取一种颜色风格的参数详情
   * @param {String} el_ClrStyleName //颜色风格名称
   */
  Module.REUIWgtGetClrStyle = function (el_ClrStyleName) {
    if (!checkNull(el_ClrStyleName, 'el_ClrStyleName')) return;

    var _ClrStyles = Module.RealBIMWeb.UIWgtGetClrStyle(el_ClrStyleName);
    var el_ClrStyles = [];
    for (let i = 0; i < _ClrStyles.size(); i++) {
      let value = _ClrStyles.get(i);
      console.log(value);
      let par = {};
      par.el_ClrStyleType = RE_ClrStyleEnum[value.m_uClrStyleEnum];
      let _hex_reverse = (value.m_uClrStyleValue).toString(16);;
      let count = _hex_reverse.length;
      for (let a = 0; a < (8 - count); a++) {
        _hex_reverse = '0' + _hex_reverse;
      }
      let _hex = _hex_reverse.split("").reverse().join("");
      par.el_ClrValue = '0x' + _hex;
      el_ClrStyles.push(par);
    }
    return el_ClrStyles;
  }

  /**
   * 添加一种颜色风格
   * @param {String} el_ClrStyleName //颜色风格名称
   * @param {Array} el_Info //颜色风格对象信息列表    ！！！以下参数均包含在 el_Info 中[{}]
   * @param {String} el_ClrStyleType //颜色风格类型
   * @param {String} el_ClrValue //颜色色值   十六进制 0xFF00FF80   ARGB
   */
  Module.REUIWgtAddClrStyle = function (el_ClrStyleName, el_Info) {
    if (!checkNull(el_ClrStyleName, 'el_ClrStyleName')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!(el_Info instanceof Array) || !el_Info.length) return;

    var _clrStyle = new Module.RE_Vector_UI_CLR_STYLE_ITEM();
    try {
      el_Info.forEach(value => {
        if (!checkNull(value.el_ClrStyleType, 'el_ClrStyleType')) return;
        if (!checkNull(value.el_ClrValue, 'el_ClrValue')) return;

        var _el_ClrValue = value.el_ClrValue;
        if (_el_ClrValue.includes('0x')) {
          _el_ClrValue = _el_ClrValue.replace('0x','');
        }
        var _el_ClrValue_Reverse = _el_ClrValue.split('').reverse().join('');//c++要地址位从低到高存储 ABGR

        let clrStylePar = {
          m_uClrStyleEnum: value.el_ClrStyleType.length ? eval('Module.' + value.el_ClrStyleType) : '',
          m_uClrStyleValue: '0x' + _el_ClrValue_Reverse
        }
        _clrStyle.push_back(clrStylePar);
      });
    } catch (error) { }

    return Module.RealBIMWeb.UIWgtAddClrStyle(el_ClrStyleName, _clrStyle);
  }

// MARK SizeStyle
  /**
   * 获取一种尺寸风格的参数详情
   * @param {String} el_SizeStyleName //尺寸风格名称
   */
   Module.REUIWgtGetSizeStyle = function (el_SizeStyleName) {
    if (!checkNull(el_SizeStyleName, 'el_SizeStyleName')) return;

    var _SizeStyles = Module.RealBIMWeb.UIWgtGetSizeStyle(el_SizeStyleName);
    var el_SizeStyles = [];
    for (let i = 0; i < _SizeStyles.size(); i++) {
      let value = _SizeStyles.get(i);
      let par = {};
      par.el_SizeStyleType = RE_SizeStyleEnum[value.m_uSizeStyleEnum];
      par.el_SizeValue = value.m_vecStyleData;
      el_SizeStyles.push(par);
    }
    return el_SizeStyles;
  }

  /**
   * 添加一种尺寸风格
   * @param {String} el_SizeStyleName //尺寸风格名称
   * @param {Array} el_Info //尺寸风格对象信息列表    ！！！以下参数均包含在 el_Info 中[{}]
   * @param {String} el_SizeStyleType //尺寸风格类型
   * @param {String} el_SizeValue //尺寸范围 [x,y] x y 宽度
   */
  Module.REUIWgtAddSizeStyle = function (el_SizeStyleName, el_Info) {
    if (!checkNull(el_SizeStyleName, 'el_SizeStyleName')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!(el_Info instanceof Array) || !el_Info.length) return;

    var _SizeStyle = new Module.RE_Vector_UI_SIZE_STYLE_ITEM();
    try {
      el_Info.forEach(value => {
        if (!checkNull(value.el_SizeStyleType, 'el_SizeStyleType')) return;
        if (!checkNull(value.el_SizeValue, 'el_SizeValue')) return;

        let sizeStylePar = {
          m_uSizeStyleEnum: value.el_SizeStyleType.length ? eval('Module.' + value.el_SizeStyleType) : '',
          m_vecStyleData: !(value.el_SizeValue instanceof Array) ? [value.el_SizeValue, 0] : value.el_SizeValue
        }
        _SizeStyle.push_back(sizeStylePar);
      });
    } catch (error) { }

    return Module.RealBIMWeb.UIWgtAddSizeStyle(el_SizeStyleName, _SizeStyle);
  }

  /**
   * 预先载入一个指定的UI纹理
   * @param {String} el_ImgURL //图片url
   */
  Module.REPreLoadGUIImgs = function (el_ImgURL) {
    if (!checkNull(el_ImgURL, 'el_ImgURL')) return;
    Module.RealBIMWeb.PreLoadGUIImgs(el_ImgURL);
  }

  /**
   * 设置内置Panel的显示风格
   * @param {Boolean} el_Type //风格类型 0:浅色风格  1：深色风格
   */
  Module.RESetBuiltInUIColorStyle = function (el_Type) {
    if (!checkNull(el_Type, 'el_Type')) return;
    Module.RealBIMWeb.SetBuiltInUIColorStyle(el_Type);
  }

  /** 
   * 获取内置Panel的显示风格
   */
  Module.REGetBuiltInUIColorStyle = function () {
    Module.RealBIMWeb.GetBuiltInUIColorStyle();
  }


  /**
   * 全部重置UI按钮和关联的状态
   */
  Module.REResetUserOperationOnUI = function () {
    Module.RealBIMWeb.ResetUserOperationOnUI();
  }



// MARK Layout
  // =================== Layout Widget 相关
  /**
   * 创建 Layout 布局  使后一个控件和前一个控件保持在同一行 < wnd_ChildLayoutType = 0|2 的情况> (需要在前一个控件添加父子关系和后一个控件创建之间使用,作用于后一个控件)
   * @param {String} re_UIID //控件id
   * @param {String} el_Space //间隔距离
   */
  Module.REUIWgtLayoutSameLine = function (re_UIID, el_Space) {
    if (!checkNull(re_UIID, 're_UIID')) return;

    var _eLayoutFlag = Module.RE_UI_LAYOUT_FLAG.SAMELINE;
    var _vDummySize = [0, 0]; var _fOffsetFromStart = 0; var _bVisible = true;
    var _fSpaceing = 0;
    if (typeof el_Space != 'undefined') { _fSpaceing = el_Space; }

    return Module.RealBIMWeb.UIWgtCreateLayoutFlag(re_UIID, _eLayoutFlag, _vDummySize, _fOffsetFromStart, _fSpaceing, _bVisible);
  }

  /**
   * 创建 Layout 布局  使后一个控件按照左侧和顶部间距自定义布局 <wnd_ChildLayoutType=1的情况  0|2的情况需要设置窗口REUIWgtSetExpectSize大小> (需要在前一个控件添加父子关系和后一个控件创建之间使用,作用于后一个控件)
   * @param {String} re_UIID //控件id
   * @param {Number} el_SpaceLeft //距离左侧的距离 （以控件左侧边界点计算 包含窗口内边距）
   * @param {Number} el_SpaceTop //距离顶部的距离 （以控件顶部边界点计算 包含窗口内边距）
   */
   Module.REUIWgtLayoutCustomPos = function (re_UIID, el_SpaceLeft, el_SpaceTop) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_SpaceLeft, 'el_SpaceLeft')) return;
    if (!checkNull(el_SpaceTop, 'el_SpaceTop')) return;

    var _eLayoutFlag = Module.RE_UI_LAYOUT_FLAG.CURSORPOS;
    var _vDummySize = [0, 0]; var _bVisible = true;
    var _fOffsetFromStart = el_SpaceLeft;
    var _fSpaceing = el_SpaceTop;

    return Module.RealBIMWeb.UIWgtCreateLayoutFlag(re_UIID, _eLayoutFlag, _vDummySize, _fOffsetFromStart, _fSpaceing, _bVisible);
  }





// MARK UI 通用
  

  /**
   * 获取指定部件的子控件个数
   * @param {String} re_UIID //组件id
   */
  Module.REUIWgtGetChildrenNum = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetChildrenNum(re_UIID);
  }

  /**
   * 判断指定控件ID的父子关系
   * @param {String} re_BaseUIID //父组件id
   * @param {Number} re_ChildUIID //子组件id
   */
  Module.REUIWgtIsChildWidget = function (re_BaseUIID, re_ChildUIID) {
    if (!checkNull(re_BaseUIID, 're_BaseUIID')) return;
    if (!checkNull(re_ChildUIID, 're_ChildUIID')) return;
    return Module.RealBIMWeb.UIWgtIsChildWidget(re_BaseUIID, re_ChildUIID);
  }

  

  /**
   * 获取控件父控件ID
   * @param {String} re_UIID //组件id
   */
  Module.REUIWgtGetParentWidgetID = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetParentWidgetID(re_UIID);
  }
  
  

  /**
   * 移除控件的所有子控件
   * @param {String} re_UIID //组件id
   */
  Module.REUIWgtRemoveAllChilden = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtRemoveAllChilden(re_UIID);
  }

  
// MARK UI可见性  
  /**
   * 获取对应系统UI的可见性
   * @param {String} re_UIID //控件id
   */
  Module.REgetUIWgtVisible = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!Object.keys(RE_SYSWnd_MateEnum).includes(re_UIID)) {
      logErrorWithPar('re_UIID');
      return;
    }
    var _uiid = RE_SYSWnd_MateEnum[re_UIID];
    return Module.RealBIMWeb.UIWgtGetVisible(_uiid);
  }

  /**
   * 设置对应系统UI的可见性
   * @param {String} re_UIID //控件id
   * @param {Boolean} el_Visible //是否显示
   */
  Module.REsetUIWgtVisible = function (re_UIID, el_Visible) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!Object.keys(RE_SYSWnd_MateEnum).includes(re_UIID)) {
      logErrorWithPar('re_UIID');
      return;
    }
    var _uiid = RE_SYSWnd_MateEnum[re_UIID];
    return Module.RealBIMWeb.UIWgtSetVisible(_uiid, el_Visible);
  }

  /**
   * 获取对应自定义UI的可见性
   * @param {String} re_UIID //控件id
   */
  Module.REgetCustomUIWgtVisible = function (re_UIID) {
    if (!checkParamType(re_UIID, 're_UIID',RE_Enum.RE_Check_String)) return;
    return Module.RealBIMWeb.UIWgtGetVisible(re_UIID);
  }

  /**
   * 设置对应自定义UI的可见性
   * @param {String} re_UIID //控件id
   * @param {Boolean} el_Visible //是否显示
   */
  Module.REsetCustomUIWgtVisible = function (re_UIID, el_Visible) {
    if (!checkParamType(re_UIID, 're_UIID',RE_Enum.RE_Check_String)) return;
    return Module.RealBIMWeb.UIWgtSetVisible(re_UIID, el_Visible);
  }
// MARK ExpectSize
  /**
   * 获取控件期望大小
   * @param {String} re_UIID //控件id
   */
  Module.REUIWgtGetExpectSize = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    return Module.RealBIMWeb.UIWgtGetExpectSize(re_UIID);
  }

  /**
   * 设置控件期望大小
   * @param {String} re_UIID //控件id
   * @param {Array} re_Size //控件大小 二元数据类型 
   */
  Module.REUIWgtSetExpectSize = function (re_UIID, re_Size) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(re_Size, 're_Size')) return;
    return Module.RealBIMWeb.UIWgtSetExpectSize(re_UIID, re_Size);
  }
// MARK 控件 ClrStyle
  /**
   * 获取一个控件的局部颜色配置
   * @param {String} re_UIID //控件id
   */
  Module.REUIWgtGetWgtClrStates = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;

    var _ClrStyles = Module.RealBIMWeb.UIWgtGetWgtClrStates(re_UIID);
    var el_ClrStyles = [];
    for (let i = 0; i < _ClrStyles.size(); i++) {
      let value = _ClrStyles.get(i);
      let par = {};
      par.el_ClrStyleType = RE_ClrStyleEnum[value.m_uClrStyleEnum];
      let _hex_reverse = (value.m_uClrStyleValue).toString(16);
      let count = _hex_reverse.length;
      for (let a = 0; a < (8 - count); a++) {
        _hex_reverse = '0' + _hex_reverse;
      }
      let _hex = _hex_reverse.split("").reverse().join("");
      par.el_ClrValue = '0x' + _hex;
      el_ClrStyles.push(par);
    }
    return el_ClrStyles;
  }

  /**
   * 设置一个控件的局部颜色配置
   * @param {String} re_UIID //控件id
   * @param {Array} el_Info //颜色风格对象信息列表    ！！！以下参数均包含在 el_Info 中[{}]
   * @param {String} el_ClrStyleType //颜色风格类型
   * @param {String} el_ClrValue //颜色色值   十六进制 0xFF00FF80   ARGB
   */
  Module.REUIWgtSetWgtClrStates = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!(el_Info instanceof Array) || !el_Info.length) return;

    var _clrStyle = new Module.RE_Vector_UI_CLR_STYLE_ITEM();
    try {
      el_Info.forEach(value => {
        if (!checkNull(value.el_ClrStyleType, 'el_ClrStyleType')) return;
        if (!checkNull(value.el_ClrValue, 'el_ClrValue')) return;

        var _el_ClrValue = value.el_ClrValue;
        if (_el_ClrValue.includes('0x')) {
          _el_ClrValue = _el_ClrValue.replace('0x','');
        }
        var _el_ClrValue_Reverse = _el_ClrValue.split('').reverse().join('');//c++要地址位从低到高存储 ABGR

        let clrStylePar = {
          m_uClrStyleEnum: value.el_ClrStyleType.length ? eval('Module.' + value.el_ClrStyleType) : '',
          m_uClrStyleValue: '0x' + _el_ClrValue_Reverse
        }
        _clrStyle.push_back(clrStylePar);
      });
    } catch (error) { }

    return Module.RealBIMWeb.UIWgtSetWgtClrStates(re_UIID, _clrStyle);
  }

  /**
   * 设置一个控件的局部颜色配置 (使用配置idname)
   * @param {String} re_UIID //控件id
   * @param {String} el_ClrStyleName //颜色风格id
   */
   Module.REUIWgtSetWgtClrStatesWithStyleID = function (re_UIID, el_ClrStyleName) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_ClrStyleName, 'el_ClrStyleName')) return;

    var _ClrStyleList = Module.REUIWgtGetClrStyle(el_ClrStyleName);

    return Module.REUIWgtSetWgtClrStates(re_UIID,_ClrStyleList);
  }
// MARK 控件 SizeStyle
  /**
   * 获取一个部件的局部尺寸配置
   * @param {String} re_UIID //控件id
   */
  Module.REUIWgtGetWgtSizeStates = function (re_UIID) {
    if (!checkNull(re_UIID, 're_UIID')) return;

    var _SizeStyles = Module.RealBIMWeb.UIWgtGetWgtSizeStates(re_UIID);
    var el_SizeStyles = [];
    for (let i = 0; i < _SizeStyles.size(); i++) {
      let value = _SizeStyles.get(i);
      let par = {};
      par.el_SizeStyleType = RE_SizeStyleEnum[value.m_uSizeStyleEnum];
      par.el_SizeValue = value.m_vecStyleData;
      el_SizeStyles.push(par);
    }
    return el_SizeStyles;
  }

  /**
   * 设置一个部件的局部尺寸配置
   * @param {String} re_UIID //控件id
   * @param {Array} el_Info //尺寸风格对象信息列表    ！！！以下参数均包含在 el_Info 中[{}]
   * @param {String} el_SizeStyleType //尺寸风格类型
   * @param {String} el_SizeValue //尺寸范围 [x,y] x y 宽度
   */
  Module.REUIWgtSetWgtSizeStates = function (re_UIID, el_Info) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_Info, 'el_Info')) return;
    if (!(el_Info instanceof Array) || !el_Info.length) return;

    var _SizeStyle = new Module.RE_Vector_UI_SIZE_STYLE_ITEM();
    try {
      el_Info.forEach(value => {
        if (!checkNull(value.el_SizeStyleType, 'el_SizeStyleType')) return;
        if (!checkNull(value.el_SizeValue, 'el_SizeValue')) return;

        let sizeStylePar = {
          m_uSizeStyleEnum: value.el_SizeStyleType.length ? eval('Module.' + value.el_SizeStyleType) : '',
          m_vecStyleData: !(value.el_SizeValue instanceof Array) ? [value.el_SizeValue, 0] : value.el_SizeValue
        }
        _SizeStyle.push_back(sizeStylePar);
      });
    } catch (error) { }

    return Module.RealBIMWeb.UIWgtSetWgtSizeStates(re_UIID, _SizeStyle);
  }

  /**
   * 设置一个部件的局部尺寸配置 (使用配置idname)
   * @param {String} re_UIID //控件id
   * @param {String} el_SizeStyleName //尺寸风格id
   */
   Module.REUIWgtSetWgtSizeStatesWithStyleID = function (re_UIID, el_SizeStyleName) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(el_SizeStyleName, 'el_SizeStyleName')) return;

    return Module.RealBIMWeb.UIWgtSetWgtSizeStates(re_UIID, Module.RealBIMWeb.UIWgtGetSizeStyle(el_SizeStyleName));
  }

  /**
   * 设置一个窗口的位置和对应窗口位置相关联
   * @param {String} re_UIID //关联窗口id
   * @param {String} re_UIID_Link //被关联窗口id
   */
   Module.REUIWgtSetLinkWndUIID = function (re_UIID, re_UIID_Link) {
    if (!checkNull(re_UIID, 're_UIID')) return;
    if (!checkNull(re_UIID_Link, 're_UIID_Link')) return;
    return Module.RealBIMWeb.UIWgtSetLinkWndUIID(re_UIID, re_UIID_Link);
  }









  

  

  

  

  

  

  

  

  

  


  

  















  

// MOD-- 自定义方法 (工具)
  /**
   * 检查参数是否为空，是否需要打印错误提示
   * @param {Object} param //参数
   * @param {String} paramName //参数名
   * @param {Boolean} needErrorLog //是否需要报错信息
   */
  function checkNullBy(param, paramName, needErrorLog) {
    if (typeof param == 'undefined') {
      if (needErrorLog) logErrorWithPar(paramName);
      return false;
    }
    return true;
  }

  /**
   * 检查参数是否为空，并打印错误提示
   * @param {Object} param //参数
   * @param {String} paramName //参数名
   */
  function checkNull(param, paramName) {
    return checkNullBy(param, paramName, true);
  }

  /**
   * 检查参数是否为空
   * @param {Object} param //参数
   */
   function checkParamNull(param) {
    return checkNullBy(param, '', false);
  }

  /**
   * 检查参数是否为空，参数类型是否正确,是否需要报错信息
   * @param {Object} param //参数
   * @param {String} paramName //参数名
   * @param {RE_Enum} re_type //枚举类型
   * @param {Boolean} needErrorLog //是否需要报错信息
   */
  function checkParamTypeBy(param, paramName, re_type, needErrorLog) {
    if (!checkNullBy(param, paramName, needErrorLog)) return false;

    switch (re_type) {
      case RE_Enum.RE_Check_String:
        {
          if ((typeof param != "string")) {
            if (needErrorLog) logErrorWithPar(paramName);
            return false;
          }
        }
        break;
      case RE_Enum.RE_Check_Array:
        {
          if (!(param instanceof Array)) {
            if (needErrorLog) logErrorWithPar(paramName);
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
   * 检查参数是否为空，参数类型是否正确 并打印报错
   * @param {Object} param //参数
   * @param {String} paramName //参数名
   * @param {RE_Enum} re_type //枚举类型
   */
  function checkParamType(param, paramName, re_type) {
    return checkParamTypeBy(param, paramName, re_type, true);
  }

  /**
   * 打印错误提示
   * @param {String} paramName //参数名
   */
  function logErrorWithPar(paramName) {
    console.error("【REError】: errMsg: 传入参数格式不正确！-> " + paramName);
  }

  /**
   * 判断是否是数组，且数组个数
   * @param {Object} param //参数名
   * @param {String} paramName //参数名
   * @param {Number} count //检查个数
   * @param {Boolean} needErrorLog //是否需要报错信息
   */
  function checkArrCountBy(param, paramName, count, needErrorLog) {
    var isArr = checkParamTypeBy(param, paramName, RE_Enum.RE_Check_Array, needErrorLog);
    if (isArr) {
      if (param.length == count) {
        return true;
      }
    }
    if (needErrorLog) logErrorWithPar(paramName);
    return false;
  }

  /**
   * 判断是否是数组，且数组个数，并打印报错
   * @param {Object} param //参数名
   * @param {String} paramName //参数名
   * @param {Number} count //检查个数
   */
  function checkArrCount(param, paramName, count) {
    return checkArrCountBy(param, paramName, count, true);
  }

  /**
   * 32位颜色转十六进制颜色 ABGR -> RBG_HEX
   * @param {Number} colorU32 //32位颜色值
   */
  function colorU32ToHEX(colorU32) {
    let _hexStr = (colorU32).toString(16);
    let count = _hexStr.length;
    for (let a = 0; a < (8 - count); a++) {
      _hexStr = '0' + _hexStr;
    }
    // ABGR -> RGBA
    var _hexStr_Reverse = _hexStr.split('').reverse().join('');
    return _hexStr_Reverse.substring(0, 6);
  }

  /**
   * 32位颜色转透明度 ABGR -> alpha (0~255)
   * @param {Number} colorU32 //32位颜色值
   */
  function colorU32ToAlpha(colorU32) {
    let _hexStr = (colorU32).toString(16);
    let count = _hexStr.length;
    for (let a = 0; a < (8 - count); a++) {
      _hexStr = '0' + _hexStr;
    }
    var hexAlpha = _hexStr.substring(0, 2);
    return (parseInt(hexAlpha, 16) / 255);
  }

  /**
   * 十六进制颜色转换RGB
   * @param {String} clrHEX //十六进制颜色
   */
  function clrHEXToRGB(clrHEX) {
    if (!checkParamTypeBy(clrHEX, '', RE_Enum.RE_Check_String, false)) return [];
    var _re_ColorHEX = deepClone(clrHEX);
    if (_re_ColorHEX.includes('0x')) {
      _re_ColorHEX = _re_ColorHEX.replace('0x', '');
    }
    if (_re_ColorHEX.length != 6)  return [];
    var _RTemp = _re_ColorHEX.substring(0, 2); var _R = (parseInt(_RTemp, 16) / 255);
    var _GTemp = _re_ColorHEX.substring(2, 4); var _G = (parseInt(_GTemp, 16) / 255);
    var _BTemp = _re_ColorHEX.substring(4, 6); var _B = (parseInt(_BTemp, 16) / 255);

    return [_R, _G, _B];
  }

  /**
   * 十六进制颜色+透明度->U32_ABGR
   * @param {String} clrHEX 
   * @param {Number} alpha 
   * @returns 
   */
  function clrHEXAToU32ABGR(clrHEX, alpha) {
    var _re_ColorHEX = deepClone(clrHEX);
    if (_re_ColorHEX.includes('0x')) {
      _re_ColorHEX = _re_ColorHEX.replace('0x', '');
    }
    if (_re_ColorHEX.length != 6)  return 0xFFFFFFFF;
    // RGB->BGR  c++要地址位从低到高存储 ABGR
    var clrHEX_R = _re_ColorHEX.substring(0, 2);
    var clrHEX_G = _re_ColorHEX.substring(2, 4);
    var clrHEX_B = _re_ColorHEX.substring(4, 6);
    var clrHEX_BGR = clrHEX_B + clrHEX_G + clrHEX_R;
    var _alphaNum = 255; if (checkParamNull(alpha)) _alphaNum = alpha;
    var intAlpha = Math.round(alpha);
    var alphaHEX = (intAlpha > 15 ? (intAlpha.toString(16)) : ("0" + intAlpha.toString(16)));
    var clrHEX_ABGR = "0x" + alphaHEX + clrHEX_BGR; 
    var intClr_ABGR = parseInt(clrHEX_ABGR);
    return intClr_ABGR;
  }

  /**
   * RBG颜色转换十六进制
   * @param {Array} clrRBG //RBG颜色
   */
  function clrRBGToHEX(clrRBG) {
    if (!checkParamTypeBy(clrRBG, '', RE_Enum.RE_Check_Array, false)) return '';
    var _re_ColorRGB = deepClone(clrRBG);
    if (_re_ColorRGB.length < 3)  return '';
    _r = Math.floor(_re_ColorRGB[0] * 255);
    _g = Math.floor(_re_ColorRGB[1] * 255);
    _b = Math.floor(_re_ColorRGB[2] * 255);
    var _clrHEX = _r.toString(16) + _g.toString(16) + _b.toString(16);
    
    return _clrHEX;
  }

  /**
   * 深拷贝
   * @param {Object} obj //拷贝数据
   */
  function deepClone(obj) {
    var _obj = JSON.stringify(obj); //  对象转成字符串
    var objClone = JSON.parse(_obj); //  字符串转成对象
    return objClone;
  }

  /**
   * 判断是否有重复值
   * @param {Array} array //列表
   * @param {String} paramName //需要判断的key 
   * @returns 
   */
  function isRepeat(array, paramName) {
    var objlist = [];
    for (const key in array) {
      if (Object.hasOwnProperty.call(array, key)) {
        const element = array[key];
        objlist.push(element[paramName]);
      }
      else {continue;}
    }

    var hash = {};
    for (const key in objlist) {
      const element = objlist[key];
      if (hash[element]) {
        return true;
      }
      // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
      hash[element] = true;
    }
    return false;
  }





// MOD-- 枚举类型
// MARK RE_ComboBoxTypeEnum
  //UI部件上可被指定尺寸的部分
  const RE_ComboBoxTypeEnum = [
    "NONE",
    "POPUP_ALIGNLEFT",	  // 让弹出框默认向左对齐
    "HEIGHT_SMALL",		    // 最多显示约4项
    "HEIGHT_REGULAR",		  // 最多显示约8项 (default)
    "HEIGHT_LARGE",		    // 最多显示约20项
    "HEIGHT_LARGEST",		  // 满足尽可能多的项的显示
    "NO_ARROW_BUTTON",		// 预览框上不显示正方形的箭头按钮
    "NO_PREVIEW",		      // 只显示一个箭头按钮
    ]
// MARK RE_InputTypeEnum
  //编辑控件 数值类型和数值数量
  const RE_InputTypeEnum = [
    "INT",		    //整型，1位输入
		"INT2",	      //整型，2位输入
		"INT3",	      //整型，3位输入
		"INT4",	      //整型，4位输入
		"FLOAT",	    //浮点型，1位输入
		"FLOAT2",	    //浮点型，2位输入
		"FLOAT3",	    //浮点型，3位输入
		"FLOAT4",	    //浮点型，4位输入
		"DOUBLE",	    //双精度浮点型，1位输入
		"DOUBLE2",    //双精度浮点型，2位输入
		"DOUBLE3",    //双精度浮点型，3位输入
		"DOUBLE4",    //双精度浮点型，4位输入
  ]
// MARK RE_WndRegionEnum
  //表示窗口区域类型，用于指定一个WindowWgt停靠的布局区域
  const RE_WndRegionEnum = [
    "LB",   //屏幕左下区域
    "MB",   //屏幕中下区域
    "RB",   //屏幕右下区域
    "LM",   //屏幕左中区域
    "MM",   //屏幕中中区域
    "RM",   //屏幕右中区域
    "LT",   //屏幕左上区域
    "MT",   //屏幕中上区域
    "RT",   //屏幕右上区域
    "NO",   //不指定屏幕停靠
  ]
// MARK RE_WndFlagsEnum
  //创建窗口时需要指定的窗口风格，可以是下边枚举值的位或（按该枚举值的定义特点，累加值和位或值等效）
  const RE_WndFlagsEnum = [
    "WINDOW_FLAGS_None",
    "WINDOW_FLAGS_NoTitleBar",						      // 禁用标题栏
    "WINDOW_FLAGS_NoResize",                    // 禁止通过右下角拖动来调整大小
    "WINDOW_FLAGS_NoMove",                      // 禁止用户移动窗口
    "WINDOW_FLAGS_NoScrollbar",                 // 禁用滚动条(窗口仍然可以用鼠标或编程方式滚动)
    "WINDOW_FLAGS_NoScrollWithMouse",           // 禁用用户用鼠标滚轮垂直滚动。在子窗口上，鼠标滚轮将被转发到父窗口，除非同时设置了NoScrollbar。
    "WINDOW_FLAGS_NoCollapse",                  // 禁止通过双击来折叠窗口 ，也称为窗口菜单按钮
    "WINDOW_FLAGS_AlwaysAutoResize",            // 根据每帧的内容重设窗口大小
    "WINDOW_FLAGS_NoBackground",                // 不绘制窗口背景色和外部边框. 
    "WINDOW_FLAGS_NoSavedSettings",             // （内部使用的标记）
    "WINDOW_FLAGS_NoMouseInputs",               // 不捕获鼠标消息
    "WINDOW_FLAGS_MenuBar",                     // 包含一个菜单栏
    "WINDOW_FLAGS_HorizontalScrollbar",         // 允许显示水平滚动条(默认关闭)
    "WINDOW_FLAGS_NoFocusOnAppearing",          // 当从隐藏状态转换为可见状态时禁用聚焦
    "WINDOW_FLAGS_NoBringToFrontOnFocus",       // 窗口即使获得焦点也不前置到上层
    "WINDOW_FLAGS_AlwaysVerticalScrollbar",     // 总是显示垂直滚动条
    "WINDOW_FLAGS_AlwaysHorizontalScrollbar",   // 总是显示水平滚动条
    "WINDOW_FLAGS_AlwaysUseWindowPadding",      // 保证没有边框的子窗口也应用WindowPadding尺寸特性 (默认是忽略的)
    "WINDOW_FLAGS_NoNavInputs",                 // 窗口内没有手柄/键盘导航 
    "WINDOW_FLAGS_NoNavFocus",                  // 使用手柄/键盘导航时不能聚焦此窗口(例如通过CTRL+TAB跳过) 
    "WINDOW_FLAGS_UnsavedDocument",             // 在标题旁边显示一个点
    "WINDOW_FLAGS_NoDocking",                   // 窗口不使用停靠
  ]
// MARK RE_ClrStyleEnum
  //UI部件上可被指定颜色的部分
  const RE_ClrStyleEnum = [
    "RE_UI_CLR_OF_Text",        				  // 文字颜色
    "RE_UI_CLR_OF_TextDisabled",        	// 文字禁用时的颜色
    "RE_UI_CLR_OF_WindowBg",        			// 正常窗口背景色
    "RE_UI_CLR_OF_ChildBg",     			    // 子窗口背景色
    "RE_UI_CLR_OF_PopupBg",     			    // 弹出窗口，菜单，提示框背景色
    "RE_UI_CLR_OF_Border",      				  // 边框的颜色
    "RE_UI_CLR_OF_BorderShadow",        	// 边框阴影色
    "RE_UI_CLR_OF_FrameBg",     			    // checkbox, radio button, plot, slider, 文字输入窗口的背景色
    "RE_UI_CLR_OF_FrameBgHovered",      	// checkbox, radio button, plot, slider, 文字输入窗口被悬停时的背景色
    "RE_UI_CLR_OF_FrameBgActive",       	// checkbox, radio button, plot, slider, 文字输入窗口被选中时的背景色
    "RE_UI_CLR_OF_TitleBg",     			    // 窗口标题栏的背景色
    "RE_UI_CLR_OF_TitleBgActive",       	// 窗口标题栏被选中时的背景色
    "RE_UI_CLR_OF_TitleBgCollapsed",      // 窗口标题栏被折叠时的背景色
    "RE_UI_CLR_OF_MenuBarBg",       			// 菜单栏的背景色
    "RE_UI_CLR_OF_ScrollbarBg",     		  // 滚动条的背景色
    "RE_UI_CLR_OF_ScrollbarGrab",       	// 滚动条滑块的颜色
    "RE_UI_CLR_OF_ScrollbarGrabHovered",  //滚动条滑块悬停的颜色
    "RE_UI_CLR_OF_ScrollbarGrabActive",   // 滚动条滑块被拖动时的颜色
    "RE_UI_CLR_OF_CheckMark",       			// check标记的颜色
    "RE_UI_CLR_OF_SliderGrab",      			// SliderBar的滑块的颜色
    "RE_UI_CLR_OF_SliderGrabActive",      // SliderBar的滑块被拖动时的颜色
    "RE_UI_CLR_OF_Button",      				  // 按钮的颜色
    "RE_UI_CLR_OF_ButtonHovered",       	// 按钮悬停的颜色
    "RE_UI_CLR_OF_ButtonActive",        	// 按钮被选中时的颜色
    "RE_UI_CLR_OF_Header",      				  // 用于CollapsingHeader, TreeNode, Selectable, MenuItem的标题栏（头部栏）颜色
    "RE_UI_CLR_OF_HeaderHovered",       	// 用于CollapsingHeader, TreeNode, Selectable, MenuItem的标题栏（头部栏）悬停时的颜色
    "RE_UI_CLR_OF_HeaderActive",        	// 用于CollapsingHeader, TreeNode, Selectable, MenuItem的标题栏（头部栏）选中时的颜色
    "RE_UI_CLR_OF_Separator",       			// Separator 的颜色
    "RE_UI_CLR_OF_SeparatorHovered",      // Separator 悬停时的颜色
    "RE_UI_CLR_OF_SeparatorActive",     	// Separator 选中时的颜色
    "RE_UI_CLR_OF_ResizeGrip",      			// 改变尺寸的拖动把手的颜色
    "RE_UI_CLR_OF_ResizeGripHovered",     // 改变尺寸的拖动把手悬停时的颜色
    "RE_UI_CLR_OF_ResizeGripActive",      // 改变尺寸的拖动把手选中时的颜色
    "RE_UI_CLR_OF_Tab",     				      // 标签栏悬停时的颜色
    "RE_UI_CLR_OF_TabHovered",      			// 标签栏选中时的颜色
    "RE_UI_CLR_OF_TabActive",       			// 标签栏激活时的颜色
    "RE_UI_CLR_OF_TabUnfocused",        	// 标签栏未获得焦点时的颜色
    "RE_UI_CLR_OF_TabUnfocusedActive",    // 标签栏未获得焦点并处于活动状态时的颜色
  ]
// MARK RE_SizeStyleEnum
  //UI部件上可被指定尺寸的部分
  const RE_SizeStyleEnum = [
    "RE_UI_SIZE_OF_Alpha",						    //float 作用于整个动态UI系统的全局透明度
    "RE_UI_SIZE_OF_DisabledAlpha",				//float 指定内部开始禁用时的透明度，跟Alpha的值相乘
    "RE_UI_SIZE_OF_WindowPadding",				//Vec2  指定窗口对象内边距（像素，x,y两个方向分别指定）
    "RE_UI_SIZE_OF_WindowRounding",			  //float 指定窗口对象的圆角尺寸，0表示创建矩形窗口，过大的值会导致各种外观异常，所以不建议取值过大
    "RE_UI_SIZE_OF_WindowBorderSize",			//float 指定窗口边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
    "RE_UI_SIZE_OF_WindowMinSize",        //Vec2  指定窗口最小尺寸，这是一个全局设置
    "RE_UI_SIZE_OF_WindowTitleAlign",     //Vec2	窗口标题的对齐比例，缺省值为（0.0,0.5）左对齐,垂直居中
    "RE_UI_SIZE_OF_ChildRounding",        //float 子窗口的圆角像素大小，0表示创建矩形窗口
    "RE_UI_SIZE_OF_ChildBorderSize",      //float	子窗口的边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
    "RE_UI_SIZE_OF_PopupRounding",        //float	弹出窗口的圆角像素大小，0表示创建矩形窗口
    "RE_UI_SIZE_OF_PopupBorderSize",      //float	弹出窗口的边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
    "RE_UI_SIZE_OF_FramePadding",         //Vec2  控件的框架矩形内的的边距
    "RE_UI_SIZE_OF_FrameRounding",        //float 控件的圆角像素大小，，0表示创建矩形外框
    "RE_UI_SIZE_OF_FrameBorderSize",      //float 控件的边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
    "RE_UI_SIZE_OF_ItemSpacing",          //Vec2  控件间距大小（x,y两个方向分别指定水平和垂直间距）
    "RE_UI_SIZE_OF_ItemInnerSpacing",     //Vec2  控件内间距大小（x,y两个方向分别指定水平和垂直间距）（对于包含多个组成元素--如SliderBar中的Slider和文字标签--的控件有效）
    "RE_UI_SIZE_OF_IndentSpacing",        //float 缩进大小（比如对于树节点会用到此特性，一般为 文字大小+FramePadding*2）
    "RE_UI_SIZE_OF_CellPadding",          //Vec2  表单元格的间距
    "RE_UI_SIZE_OF_ScrollbarSize",        //float 指定垂直滚动条的宽度 or 水平滚动条的高度
    "RE_UI_SIZE_OF_ScrollbarRounding",    //float 滚动条的滑块的圆角半径
    "RE_UI_SIZE_OF_GrabMinSize",          //float SliderBar / scrollbar 的滑块的最小宽度/高度
    "RE_UI_SIZE_OF_GrabRounding",         //float 滑块的圆角半径，设为0.0创建一个矩形滑块
    "RE_UI_SIZE_OF_SliderThickness",      //float 滑动条的宽度
    "RE_UI_SIZE_OF_SliderContrast",       //float 滑动条左右两侧的对比度
    "RE_UI_SIZE_OF_TabRounding",          //float tab页签的上部圆角半径
    "RE_UI_SIZE_OF_ButtonTextAlign",      //Vec2  button比文字区域大时，文字的对齐比例（0.5,0.5）居中对齐
    "RE_UI_SIZE_OF_SelectableTextAlign",  //Vec2  可选中文字的对齐方式，默认是(0.0f, 0.0f) (top-left aligned).如果你想把多个项目放在同一行上，通常保持左对齐是很重要的。
  ]










// MARK RE_Enum
  //枚举参数
  const RE_Enum = {
    RE_Check_String: 1,//检测字符串
    RE_Check_Array: 2,//检测数组
  }





   
  return ExtModule;
};


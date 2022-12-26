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
  console.log("=========================== window.load() ======");
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
  document.addEventListener("RealBIMUIEvent", CustomBtnHandler);


  if ((typeof BlackHole3D["m_re_em_window_width"] != 'undefined') && (typeof BlackHole3D["m_re_em_window_height"] != 'undefined') && (typeof BlackHole3D.RealBIMWeb != 'undefined')) {
    console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
    RealBIMInitSys();
  }
}



//场景初始化，需正确传递相关参数
function RealBIMInitSys() {
  console.log("=========================== 引擎底层初始化完成 =====");
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
  console.log("=========================== 场景初始化完成 =====");
  var isSuccess = e.detail.succeed;

  if (isSuccess) {
    console.log("========  场景初始化 --> 成功！！！  =======");
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
    console.log("======  场景初始化 --> 失败！！！  ======");
  }

}

//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(e) {
  console.log("=========================== 引擎主场景模型加载完成 ====");
  if (e.detail.succeed) {
    console.log("======= 引擎主场景模型加载 --> 成功！！！ =======");
    testCustomWnd();
    addCustomView();
    // BlackHole3D.RealBIMWeb.SetBuiltInUIVisible(false);
    // testCustomPanel();
    // testCustomBtn();
    testCustomBtnView();
    setTimeout(() => {
      BlackHole3D.RealBIMWeb.SetBuiltInUIVisible(false);
    }, 1);
  } else {
    console.log("========  引擎主场景模型加载 --> 部分模型加载失败！！！  =========");
  }
}

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas() {
  console.log("=========================== 引擎渲染器初始化完成 ======");
  document.getElementById('canvas').style.display = "block";
  BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
}

// 加载进度条
function LoadingProgress(e) {
  var percent = e.detail.progress; var info = e.detail.info;
  progressFn(percent, info);
}


function addCustomView() {
  console.log("=========================== 添加测试组件 =====");

  const UIID_wnd_custom = 'Custom_Wnd666';
  var wnd_Info = {
    wnd_Title: 'Custom_Wnd666测试窗口',
    wnd_Flags: ["WINDOW_FLAGS_NoDocking", "WINDOW_FLAGS_NoResize", "WINDOW_FLAGS_NoScrollbar"],
    wnd_DockRgn: 9,
    wnd_SizeStyle:'SS_WND_HAVE_BORDER',
    wnd_ClrStyle:'CS_WND_LIGHT',
    wnd_ChildLayoutType:0,
    wnd_BaseScrPosType:[0,0],
    wnd_BaseScrPos:[0,0],
    wnd_BaseLocalPos:[0,0],
    wnd_MaxRatio:[1,1],
  };
  BlackHole3D.REUIWgtCreateWnd(UIID_wnd_custom, wnd_Info);
  BlackHole3D.REUIWgtSetExpectSize(UIID_wnd_custom, [290, 700]);

  //创建Btn
  el_Info = {
    el_StateParams: [
      {
        "el_Hint": "",
        "el_Text": "999",
        "el_TextureURL":'!(RealBIMAppFileCache)/pics/normalterrain_nor.png',
        // "el_TextureURL": "",
        "el_ClrStates": "CS_BTN_BLUEFRAME_UNCHECK",
        "el_SizeStates": "SS_BTN_HAVE_FRAME"
      }
    ],
    el_Size: [100, 100],
    el_CanClick: 0
  }
  BlackHole3D.REUIWgtCreateButton("Custom_btn999", el_Info);
  BlackHole3D.REUIWgtAddChildWidget(UIID_wnd_custom, "Custom_btn999");

  //创建CheckBox
  el_Info_CheckBox = {
    el_Text: 'Custom_CheckBox444'
  }
  BlackHole3D.REUIWgtCreateCheckBox("Custom_CheckBox444", el_Info_CheckBox);
  BlackHole3D.REUIWgtAddChildWidget(UIID_wnd_custom, "Custom_CheckBox444");

  el_Info_Redio = {
    el_Text: 'Custom_Redio333'
  }
  BlackHole3D.REUIWgtCreateRadioButton('Custom_Redio333', el_Info_Redio);
  BlackHole3D.REUIWgtAddChildWidget(UIID_wnd_custom, "Custom_Redio333");


  //创建NumInput
  el_Info_NumInput = {
    el_Value:[20,30],
    el_InputType:'INT2',
    el_Format:'%.2f',
    el_Size:[150,40],
    el_CanEdit:true,
    el_Visible:true
  }
  BlackHole3D.REUIWgtCreateNumberInputWgt('Custom_NumInput222',el_Info_NumInput);
  BlackHole3D.REUIWgtAddChildWidget(UIID_wnd_custom,'Custom_NumInput222');


  //创建 ComboBox
  const UIID_ComboBox = 'UIID_ComboBox';
  var el_Info_ComboBox = {
    el_Size:[0,0],
    el_Text:'下拉框',
    el_DataList:["Black","White","Red","Green","Blue"]
  }

  BlackHole3D.REUIWgtCreateComboBox(UIID_ComboBox,el_Info_ComboBox);
  BlackHole3D.REUIWgtAddChildWidget(UIID_wnd_custom,UIID_ComboBox);


  //创建 SliderBar
  const UIID_SliderBar_01 = 'UIID_SliderBar_01';
  var el_Info_SliderBar = {
    el_Value:[20,30],
    el_ValueRange:[0,100],
    el_InputType:'INT2',
    el_Format:'%.2f',
    el_Size:[150,40],
    el_CanEdit:true,
    el_Visible:true,
    // el_IsVertical:true,
  }
  BlackHole3D.REUIWgtCreateSliderBar(UIID_SliderBar_01,el_Info_SliderBar);
  BlackHole3D.REUIWgtAddChildWidget(UIID_wnd_custom,UIID_SliderBar_01);



  //创建colorEditer
  const UIID_ColorEditer_01 = 'UIID_ColorEditer_01';
  var el_Info_ColorEditer = {
    el_Text:'颜色选取',
    el_Visible:true,
    el_color:[1,1,0.27,1],
    el_editStyle:3,
    el_btnSize:[50,50],
  }
  BlackHole3D.REUIWgtCreateColorEditer(UIID_ColorEditer_01,el_Info_ColorEditer);
  BlackHole3D.REUIWgtAddChildWidget(UIID_wnd_custom,UIID_ColorEditer_01);




  // var clrStyleWnd = new BlackHole3D.RE_Vector_UI_CLR_STYLE_ITEM();
  // clrStyleWnd.push_back({ "m_uClrStyleEnum": BlackHole3D.RE_UI_CLR_OF_FrameBg, "m_uClrStyleValue": 0xFFABE69A }); //background clr
  // clrStyleWnd.push_back({ "m_uClrStyleEnum": BlackHole3D.RE_UI_CLR_OF_Text, "m_uClrStyleValue": 0xFF000000 });   //Text clr   
  // BlackHole3D.RealBIMWeb.UIWgtAddClrStyle("ClrStyleMyCheckBox777", clrStyleWnd);
  // BlackHole3D.RealBIMWeb.UIWgtSetWgtClrStates("Custom_CheckBox444", BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("ClrStyleMyCheckBox777"));

}


function testCustomBtn () {
  //创建窗口风格   透明
  const wnd_ClrStyleName = 'wnd_ClrStyle';
  var el_Info_ClrStyle_wnd = [
    {
      el_ClrStyleType:'RE_UI_CLR_OF_WindowBg',
      el_ClrValue:0xfff6f5f8
    },
    { 
      el_ClrStyleType:'RE_UI_CLR_OF_Border',// 边框的颜色
      el_ClrValue:0xffb2b1b4
    },
  ];
  BlackHole3D.REUIWgtAddClrStyle(wnd_ClrStyleName,el_Info_ClrStyle_wnd);
  //创建窗口尺寸风格
  const wnd_SizeStyleName = 'wnd_SizeStyle';
  var el_Info_SizeStyle_wnd = [
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_WindowPadding',// 窗口对象内边距
      el_SizeValue:[10,10]
    },
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_WindowRounding',// 窗口对象的圆角尺寸
      el_SizeValue:10
    },
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_ItemSpacing',// 控件间距大小
      el_SizeValue:[8,8]
    },
    // {
    //   el_SizeStyleType:'RE_UI_SIZE_OF_ButtonTextAlign',// 控件间距大小
    //   el_SizeValue:[8,8]
    // },
  ];
  BlackHole3D.REUIWgtAddSizeStyle(wnd_SizeStyleName,el_Info_SizeStyle_wnd);
  //创建窗口
  var wnd_UIID = "Custom_Wnd";
  var wnd_Info = {
    wnd_Flags:["WINDOW_FLAGS_NoDocking","WINDOW_FLAGS_NoTitleBar","WINDOW_FLAGS_NoResize","WINDOW_FLAGS_NoScrollbar"],
    wnd_ClrStyle:wnd_ClrStyleName,
    wnd_SizeStyle:wnd_SizeStyleName,
    wnd_DockRgn:1,//屏幕中下
    wnd_BaseScrPosType:[0,1],
    wnd_BaseScrPos:[0.5,20],
    wnd_BaseLocalPos:[0.5,0.0],
    wnd_MaxRatio:[0.5,0.5]
  };
  BlackHole3D.REUIWgtCreateWnd(wnd_UIID, wnd_Info);


  //创建按钮尺寸风格
  var btnSizeStyleName = "btnSizeStyle";
  var el_Info_SizeStyle = [
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_FrameBorderSize',// 控件的边框尺寸
      el_SizeValue:1
    },
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_ButtonTextAlign',// 文字对齐比例
      el_SizeValue:[0.5,0.5]
    },
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_FrameRounding',// 控件的圆角像素大小
      el_SizeValue:0
    },
  ];
  BlackHole3D.REUIWgtAddSizeStyle(btnSizeStyleName,el_Info_SizeStyle);
  //创建按钮颜色风格
  var btnClrStyleName = "btnClrStyle";
  var el_Info_ClrStyle_Btn = [
    {
      el_ClrStyleType:'RE_UI_CLR_OF_Text',// 文字颜色
      el_ClrValue:0xFF000000
    },
    { 
      el_ClrStyleType:'RE_UI_CLR_OF_Border',// 边框的颜色
      el_ClrValue:0xff000000
    },
    {
      el_ClrStyleType:'RE_UI_CLR_OF_Button',// 按钮的颜色
      el_ClrValue:0xffffffff
    },
    {
      el_ClrStyleType:'RE_UI_CLR_OF_ButtonHovered',// 按钮悬停的颜色
      el_ClrValue:0xffffffff
    },
    {
      el_ClrStyleType:'RE_UI_CLR_OF_ButtonActive',// 按钮被选中时的颜色
      el_ClrValue:0xffffffff
    },
  ];
  BlackHole3D.REUIWgtAddClrStyle(btnClrStyleName,el_Info_ClrStyle_Btn);
  //创建Btn
  // var btnList = ["地形透明度","模型重置","隔离构建","隐藏构建","测量","刨切"];
  var btnList = ["地形透明度"];
  btnList.forEach((value,index,array) => {
    let el_Info = {
      el_StateParams: [
        {
          "el_Text": value,
          "el_ClrStates": btnClrStyleName,
          "el_SizeStates": btnSizeStyleName
        }
      ],
      el_Size: [100, 40],
    }
    let el_UIID = "Custom_btn" + index;
    BlackHole3D.REUIWgtCreateButton(el_UIID, el_Info);
    BlackHole3D.REUIWgtAddChildWidget(wnd_UIID, el_UIID);
    if (index < array.length - 1) {
      let sameLineID = 'SameLine' + index;
      BlackHole3D.REUIWgtLayoutSameLine(sameLineID,10);
	    BlackHole3D.REUIWgtAddChildWidget(wnd_UIID, sameLineID);
    }
  });
  


  // var clrStyleWnd = new BlackHole3D.RE_Vector_UI_CLR_STYLE_ITEM();
  // clrStyleWnd.push_back({ "m_uClrStyleEnum": BlackHole3D.RE_UI_CLR_OF_Text, "m_uClrStyleValue": 0xFF000000 });   //Text clr   
  // BlackHole3D.RealBIMWeb.UIWgtAddClrStyle("Custom_btn0_clrstyle", clrStyleWnd);
  // BlackHole3D.RealBIMWeb.UIWgtSetWgtClrStates("Custom_btn0", BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("Custom_btn0_clrstyle"));
  
}



function testCustomBtnView () {
  //创建窗口风格   透明
  const wnd_ClrStyleName = 'wnd_ClrStyle';
  var el_Info_ClrStyle_wnd = [
    {
      el_ClrStyleType:'RE_UI_CLR_OF_WindowBg',
      el_ClrValue:'0xffededed'
    },
    { 
      el_ClrStyleType:'RE_UI_CLR_OF_Border',// 边框的颜色
      // el_ClrValue:0xffb2b1b4
      el_ClrValue:'0x80000000'
    },
  ];
  BlackHole3D.REUIWgtAddClrStyle(wnd_ClrStyleName,el_Info_ClrStyle_wnd);
  //创建窗口尺寸风格
  const wnd_SizeStyleName = 'wnd_SizeStyle';
  var el_Info_SizeStyle_wnd = [
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_WindowPadding',// 窗口对象内边距
      el_SizeValue:[10,10]
    },
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_WindowRounding',// 窗口对象的圆角尺寸
      el_SizeValue:10
    },
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_ItemSpacing',// 控件间距大小
      el_SizeValue:[0,0]
    },
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_WindowBorderSize',// 窗口边框尺寸
      el_SizeValue:1
    },
    // {
    //   el_SizeStyleType:'RE_UI_SIZE_OF_ButtonTextAlign',// 对齐比例
    //   el_SizeValue:[0.5,0.5]
    // },
  ];
  BlackHole3D.REUIWgtAddSizeStyle(wnd_SizeStyleName,el_Info_SizeStyle_wnd);
  //创建按钮尺寸风格
  var btnSizeStyleName = "btnSizeStyle";
  var el_Info_SizeStyle = [
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_FrameBorderSize',// 控件的边框尺寸
      el_SizeValue:0
    },
    {
      el_SizeStyleType:'RE_UI_SIZE_OF_ButtonTextAlign',// 文字对齐比例
      el_SizeValue:[0.5,0.5]
    },
  ];
  BlackHole3D.REUIWgtAddSizeStyle(btnSizeStyleName,el_Info_SizeStyle);
  //创建按钮颜色风格
  var btnClrStyleName = "btnClrStyle";
  var el_Info_ClrStyle_Btn = [
    {
      el_ClrStyleType:'RE_UI_CLR_OF_Button',// 按钮的颜色
      el_ClrValue:'0xff3254ff'
    },
    {
      el_ClrStyleType:'RE_UI_CLR_OF_ButtonHovered',// 按钮悬停的颜色
      el_ClrValue:'0x00ffffff'
    },
    {
      el_ClrStyleType:'RE_UI_CLR_OF_ButtonActive',// 按钮被选中时的颜色
      el_ClrValue:'0x00ffffff'
    },
  ];
  BlackHole3D.REUIWgtAddClrStyle(btnClrStyleName,el_Info_ClrStyle_Btn);

  //创建窗口 01
  const wnd_UIID_01 = "Custom_Wnd_01";
  var wnd_Info_01 = {
    wnd_Flags:["WINDOW_FLAGS_NoDocking","WINDOW_FLAGS_NoTitleBar","WINDOW_FLAGS_NoResize","WINDOW_FLAGS_NoScrollbar"],
    // wnd_Title:wnd_UIID_01,
    wnd_ClrStyle:wnd_ClrStyleName,
    wnd_SizeStyle:wnd_SizeStyleName,
    wnd_ChildLayoutType:1,//水平布局
    wnd_DockRgn:1,//屏幕中下
    wnd_BaseScrPosType:[0,1],
    wnd_BaseScrPos:[0.5,20],
    wnd_BaseLocalPos:[0.5,0.0],
    wnd_MaxRatio:[0.5,0.5]
  };
  BlackHole3D.REUIWgtCreateWnd(wnd_UIID_01, wnd_Info_01);

  //创建Btn
  const el_UIID_btn_01 = "btn_01";
  var el_Info_btn_01 = {
    el_StateParams: [
      {
        "el_Text": '',
        "el_TextureURL":'!(RealBIMAppFileCache)/pics/normalterrain_nor.png',
        "el_ClrStates": btnClrStyleName,
        "el_SizeStates": btnSizeStyleName
      },
      {
        "el_Text": '',
        "el_TextureURL":'!(RealBIMAppFileCache)/pics/normalterrain_nor.png',
        "el_ClrStates": btnClrStyleName,
        "el_SizeStates": btnSizeStyleName
      }
    ],
    el_Size: [40, 40],
  }
  BlackHole3D.REUIWgtCreateButton(el_UIID_btn_01, el_Info_btn_01);
  BlackHole3D.REUIWgtAddChildWidget(wnd_UIID_01, el_UIID_btn_01);

  BlackHole3D.REUIWgtSetWgtClrStatesWithStyleID(el_UIID_btn_01,btnClrStyleName)

  BlackHole3D.REUIWgtLayoutCustomPos("sameLineID_01", 50, 20);
  BlackHole3D.REUIWgtAddChildWidget(wnd_UIID_01, "sameLineID_01");

  //创建image
  const el_UIID_img_01 = 'img_01';
  var el_Info_img_01 = {
    el_ImgURL:'!(RealBIMAppFileCache)/misc/vc_triangle_up.png',
    el_Size:[20,20]
  }
  BlackHole3D.REUIWgtCreateImage(el_UIID_img_01, el_Info_img_01);
  BlackHole3D.REUIWgtAddChildWidget(wnd_UIID_01, el_UIID_img_01);

  //创建窗口 02
  const wnd_UIID_02 = "Custom_Wnd_02";
  var wnd_Info_02 = {
    wnd_Flags:["WINDOW_FLAGS_NoDocking","WINDOW_FLAGS_NoTitleBar","WINDOW_FLAGS_NoResize","WINDOW_FLAGS_NoScrollbar"],
    // wnd_Title:wnd_UIID_02,
    wnd_ClrStyle:wnd_ClrStyleName,
    wnd_SizeStyle:wnd_SizeStyleName,
    wnd_DockRgn:1,//屏幕中下
    wnd_BaseScrPosType:[0,1],
    wnd_BaseScrPos:[0.56,20],//第二个窗口向右偏移，产生间距
    wnd_BaseLocalPos:[0.5,0.0],
    wnd_MaxRatio:[0.5,0.5]
  };
  BlackHole3D.REUIWgtCreateWnd(wnd_UIID_02, wnd_Info_02);

  //创建Btn
  const el_UIID_btn_02 = "btn_02";
  var el_Info_btn_02 = {
    el_StateParams: [
      {
        "el_Text": '',
        "el_TextureURL":'!(RealBIMAppFileCache)/pics/normalterrain_nor.png',
        "el_ClrStates": btnClrStyleName,
        "el_SizeStates": btnSizeStyleName
      }
    ],
    el_Size: [40, 40],
  }
  BlackHole3D.REUIWgtCreateButton(el_UIID_btn_02, el_Info_btn_02);
  BlackHole3D.REUIWgtAddChildWidget(wnd_UIID_02, el_UIID_btn_02);
}



//该窗口是展示用户指定风格的实现方式，对应的处理函数为 CustomPanelHandler(e)
function testCustomPanel()
{
	//创建一个自定义颜色风格（本示例中该风格指定了窗口的底色）
	var clrStyleWnd = new BlackHole3D.RE_Vector_UI_CLR_STYLE_ITEM();
	clrStyleWnd.push_back({"m_uClrStyleEnum":BlackHole3D.RE_UI_CLR_OF_WindowBg,"m_uClrStyleValue":0xFF985532}); //Window clr
	BlackHole3D.RealBIMWeb.UIWgtAddClrStyle("ClrStyleWnd",clrStyleWnd);
	
	//创建一个自定义颜色风格（本示例中该风格指定了按钮的底色和悬停色）
	var clrStyle = new BlackHole3D.RE_Vector_UI_CLR_STYLE_ITEM();
	clrStyle.push_back({"m_uClrStyleEnum":BlackHole3D.RE_UI_CLR_OF_Button,"m_uClrStyleValue":0xFF124532}); //button clr
	clrStyle.push_back({"m_uClrStyleEnum":BlackHole3D.RE_UI_CLR_OF_ButtonHovered,"m_uClrStyleValue":0xFFD08242}); //button on hover clr
	BlackHole3D.RealBIMWeb.UIWgtAddClrStyle("CusClrStyleBtn",clrStyle);
	
	
	//==================创建窗口====================
	var wndFlags = BlackHole3D.WINDOW_FLAGS_NoDocking | BlackHole3D.WINDOW_FLAGS_NoTitleBar | BlackHole3D.WINDOW_FLAGS_NoResize | BlackHole3D.WINDOW_FLAGS_NoScrollbar ;
	
	BlackHole3D.RealBIMWeb.UIWgtCreateWnd("Custom_Wnd01","Custom_Wnd01",true,"SS_WND_HAVE_BORDER", "ClrStyleWnd",wndFlags,
	BlackHole3D.RE_UI_WINDOW_REGION.MB,0,[0,1],[0.5,20],[0.5,0.0],[0.5,0.5]);
	
	
	//==================创建Home按钮===================
	var stateParams_of_Home = new BlackHole3D.RE_Vector_STATE_PARAMS()
	
	var P1 = { "m_strHint":"",	"m_strText":"",
			"m_strTextureURL":"",
			"m_vecClrStates": BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),
			"m_vecSizeStates": BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
	var P2 = {"m_strHint":"", "m_strText":"",
			"m_strTextureURL":"",
			"m_vecClrStates": BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),//CS_BTN_WHITETEXT_BLUEBG
			"m_vecSizeStates": BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
    stateParams_of_Home.push_back(P1);
	stateParams_of_Home.push_back(P2);

	//创建Btn
 	BlackHole3D.RealBIMWeb.UIWgtCreateButton("Custom_Btn_Home", stateParams_of_Home,[48,64], 0, true, true);
	BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Btn_Home");
	
	BlackHole3D.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine01",BlackHole3D.RE_UI_LAYOUT_FLAG.SAMELINE,[0,0],0,8,true);
	BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "SameLine01");
	
	//=====================创建地图按钮=====================
	var stateParams_of_map = new BlackHole3D.RE_Vector_STATE_PARAMS()
	
	var P1 = { "m_strHint":"",	"m_strText":"",
			"m_strTextureURL":"",
			"m_vecClrStates": BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),
			"m_vecSizeStates": BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
    stateParams_of_map.push_back(P1);

	//创建Btn
 	BlackHole3D.RealBIMWeb.UIWgtCreateButton("Custom_Btn_Map", stateParams_of_map,[48,64], 0, true, true);
	BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Btn_Map");
	
	BlackHole3D.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine02",BlackHole3D.RE_UI_LAYOUT_FLAG.SAMELINE,[0,0],0,8,true);
	BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "SameLine02");	
	
	//=======================创建漫游按钮=======================
	var stateParams_of_Travel = new BlackHole3D.RE_Vector_STATE_PARAMS()
	
	var P1 = { "m_strHint":"",	"m_strText":"",
			"m_strTextureURL":"",
			"m_vecClrStates": BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),
			"m_vecSizeStates": BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
    stateParams_of_Travel.push_back(P1);

	//创建Btn
 	BlackHole3D.RealBIMWeb.UIWgtCreateButton("Custom_Btn_Travel", stateParams_of_Travel,[48,64], 0, true, true);
	BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Btn_Travel");
	
	
	//##########################  创建另一相同停靠区域的窗口  #########################
	
	BlackHole3D.RealBIMWeb.UIWgtCreateWnd("Custom_Wnd02","Custom_Wnd02",true,"SS_WND_HAVE_BORDER", "ClrStyleWnd",wndFlags,
	BlackHole3D.RE_UI_WINDOW_REGION.MB,0,[0,1],[0.6,20],[0.5,0.0],[0.5,0.5]);
	
	//==================创建Home2按钮===================
	var stateParams_of_Home2 = new BlackHole3D.RE_Vector_STATE_PARAMS()
	
	var P1 = { "m_strHint":"",	"m_strText":"",
			"m_strTextureURL":"",
			"m_vecClrStates": BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),
			"m_vecSizeStates": BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
    stateParams_of_Home2.push_back(P1);
	//创建Btn
 	BlackHole3D.RealBIMWeb.UIWgtCreateButton("Custom_Btn_Home2", stateParams_of_Home2,[48,64], 0, true, true);
	BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd02", "Custom_Btn_Home2");
	BlackHole3D.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine03",BlackHole3D.RE_UI_LAYOUT_FLAG.SAMELINE,[0,0],0,8,true);
	BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd02", "SameLine03");
	
	//绑定监听事件处理函数
	// document.addEventListener("RealBIMUIEvent", CustomPanelHandler);
}



// function CustomPanelHandler(e){
// 	console.log(e.detail.btnname,e.detail.btnstate);
// 	if(e.detail.btnname == "Custom_Btn_Home"){
// 		if(e.detail.btnstate == 0){
// 			BlackHole3D.RealBIMWeb.UIWgtSetBtnActiveSubState("Custom_Btn_Home",1);
// 		}else{
// 			BlackHole3D.RealBIMWeb.UIWgtSetBtnActiveSubState("Custom_Btn_Home",0);
// 		}
// 	}
// }















//测试自定义窗口和按钮|图像部件 
//该窗口是展示主要控件用法的窗口，该窗口对应的消息处理函数是 上边的 function CustomBtnHandler(e)
function testCustomWnd() {
  console.log("=========================== 添加自定义窗口和按钮||图像部件 =====");

  var wndFlags = BlackHole3D.WINDOW_FLAGS_NoDocking | BlackHole3D.WINDOW_FLAGS_NoTitleBar | BlackHole3D.WINDOW_FLAGS_NoResize | BlackHole3D.WINDOW_FLAGS_NoScrollbar;
  BlackHole3D.RealBIMWeb.UIWgtCreateWnd("Custom_Wnd01", "Custom_Wnd01", true, "SS_WND_HAVE_BORDER", "CS_WND_LIGHT", wndFlags,
    BlackHole3D.RE_UI_WINDOW_REGION.NO, 0, [0, 0], [0.5, 0.5], [0.5, 0.0], [0.5, 0.5]);

  BlackHole3D.RealBIMWeb.UIWgtSetExpectSize("Custom_Wnd01", [290, 360]);

  var stateParams = new BlackHole3D.RE_Vector_STATE_PARAMS()

  var P1 = {
    "m_strHint": "暗色主题",
    "m_strText": "",
    "m_strTextureURL": "!(RealBIMAppFileCache)/pics/normalterrain_nor.png",
    "m_vecClrStates": BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CS_BTN_BLUEFRAME_UNCHECK"),
    "m_vecSizeStates": BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_HAVE_FRAME")
  };
  var P2 = {
    "m_strHint": "明亮主题",
    "m_strText": "",
    "m_strTextureURL": "!(RealBIMAppFileCache)/pics/hideterrain_nor.png",
    "m_vecClrStates": BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CS_BTN_BLUEFRAME_CHECKED"),
    "m_vecSizeStates": BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_HAVE_FRAME")
  };
  stateParams.push_back(P1);
  stateParams.push_back(P2);

  //创建Btn
  BlackHole3D.RealBIMWeb.UIWgtCreateButton("Custom_Btn01", stateParams, [50, 50], 1, true, true);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Btn01");

  //sameline 布局标记	
  BlackHole3D.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine01", BlackHole3D.RE_UI_LAYOUT_FLAG.SAMELINE, [0, 0], 0, 8, true);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "SameLine01");

  //创建img
  BlackHole3D.RealBIMWeb.UIWgtCreateImage("Custom_Img01", true, [200, 200], "!(RealBIMAppFileCache)/pics/watermark.png");
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Img01");

  //创建CheckBox
  BlackHole3D.RealBIMWeb.UIWgtCreateCheckBox("Custom_CheckBox01", true, "Check01", true);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_CheckBox01");

  //创建RadioBtn1
  BlackHole3D.RealBIMWeb.UIWgtCreateRadioButton("Custom_Radio01", true, "Radio01", true);  //创建单选框1
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Radio01");    	//放入窗口
  BlackHole3D.RealBIMWeb.UIWgtSetCheckBoxClrStates("Custom_Radio01", BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CS_RADIO_UNCHECK"), BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CS_RADIO_CHECKED")); //设置单选框的颜色和尺寸风格												
  BlackHole3D.RealBIMWeb.UIWgtSetCheckBoxSizeStates("Custom_Radio01", BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_RADIO_SMALL"), BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_RADIO_SMALL"));
  //sameline 布局标记	
  BlackHole3D.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine02", BlackHole3D.RE_UI_LAYOUT_FLAG.SAMELINE, [0, 0], 0, 8, true);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "SameLine02");

  //创建RadioBtn2
  BlackHole3D.RealBIMWeb.UIWgtCreateRadioButton("Custom_Radio02", true, "Radio02", false);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Radio02");
  BlackHole3D.RealBIMWeb.UIWgtSetCheckBoxClrStates("Custom_Radio02", BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CS_RADIO_UNCHECK"), BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("CS_RADIO_CHECKED"));	//设置单选框的颜色和尺寸风格																																					
  BlackHole3D.RealBIMWeb.UIWgtSetCheckBoxSizeStates("Custom_Radio02", BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_RADIO_SMALL"), BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_RADIO_SMALL"));

  //创建ColorEditor
  BlackHole3D.RealBIMWeb.UIWgtCreateColorEditer("Custom_ClrEdit", true, "MyClr1", [0.2, 0.4, 1.0, 1.0], 0, [0, 0]);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_ClrEdit");

  //修改颜色控件右侧的标签文字内容
  //BlackHole3D.RealBIMWeb.UIWgtGetColorEditerLabel("Custom_ClrEdit");
  //BlackHole3D.RealBIMWeb.UIWgtSetColorEditerLabel("Custom_ClrEdit","XXClr");

  //修改颜色控件的颜色值(以vec4类型来操作)
  //BlackHole3D.RealBIMWeb.UIWgtGetColorEditerValueV4("Custom_ClrEdit");
  //BlackHole3D.RealBIMWeb.UIWgtSetColorEditerValueV4("Custom_ClrEdit",[0.9,0.0,0.0,1.0]); //RGBA

  //修改颜色控件的颜色值(以u32类型来操作)
  //BlackHole3D.RealBIMWeb.UIWgtGetColorEditerValueU("Custom_ClrEdit");
  //BlackHole3D.RealBIMWeb.UIWgtSetColorEditerValueU("Custom_ClrEdit",0xffff0000); //ABGR

  //创建文字标签
  BlackHole3D.RealBIMWeb.UIWgtCreateLabel("Custom_Label", true, [0, 0], "标签1");
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Label");
  //BlackHole3D.RealBIMWeb.UIWgtGetLableText("Custom_Label");
  //BlackHole3D.RealBIMWeb.UIWgtSetLableText("Custom_Label","Label01");

  //创建ComboBox
  var itemList = new BlackHole3D.RE_Vector_WStr();
  itemList.push_back("Black");
  itemList.push_back("White");
  itemList.push_back("Red");
  itemList.push_back("Green");
  itemList.push_back("Blue");
  BlackHole3D.RealBIMWeb.UIWgtCreateComboBox("Custom_ComboBox", true, [0, 0], "组合框01", itemList, 2);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_ComboBox");

  //创建数值编辑控件
  BlackHole3D.RealBIMWeb.UIWgtCreateNumberInputWgt("CustomNumWgt", true, [150, 40], BlackHole3D.RE_UI_EDITBOX_NUMTYPE.INT3, [10, 20, 30, 40], "%.2f", true);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomNumWgt");

  BlackHole3D.RealBIMWeb.UIWgtCreateNumberInputWgt("CustomNumWgt2",true,[150,40],BlackHole3D.RE_UI_EDITBOX_NUMTYPE.FLOAT2,[10,0,0,0],"%.1f",true);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomNumWgt2"); 

  //创建SliderBar 创建原始高度的 int3 类型的silderBar 范围[-100,100]
  BlackHole3D.RealBIMWeb.UIWgtCreateSliderBar("CustomSlider", true, [250, 40], BlackHole3D.RE_UI_EDITBOX_NUMTYPE.INT3, [10, 20, 30, 0], [-100, 100], "%d", true, false);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomSlider");

  //创建不带数字显示的 int3 类型的SliderBar 去掉Format字符串 ,范围[0,100],同时，禁止Ctrl+Click输入
  BlackHole3D.RealBIMWeb.UIWgtCreateSliderBar("CustomSlider2", true, [250, 40], BlackHole3D.RE_UI_EDITBOX_NUMTYPE.INT3, [10, 20, 30, 0], [0, 100], "", false, false);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomSlider2");
  BlackHole3D.RealBIMWeb.UIWgtSetWgtSizeStates("CustomSlider2", BlackHole3D.RealBIMWeb.UIWgtGetSizeStyle("SS_SLIDER_THIN"));

  //创建原始高度的的 Float2 类型的SliderBar ,显示中保留2位小数
  BlackHole3D.RealBIMWeb.UIWgtCreateSliderBar("CustomSlider3", true, [250, 40], BlackHole3D.RE_UI_EDITBOX_NUMTYPE.FLOAT2, [10.5, 20.8, 0, 0], [-100, 100], "%.2f", true, false);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomSlider3");

  //创建原始高度的的 Double2 类型的SliderBar ,显示中保留3位小数,同时禁止编辑
  BlackHole3D.RealBIMWeb.UIWgtCreateSliderBar("CustomSlider4", true, [250, 40], BlackHole3D.RE_UI_EDITBOX_NUMTYPE.DOUBLE2, [10.5, 20.8, 0, 0], [-100, 100], "%.3f", false, false);
  BlackHole3D.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomSlider4");

  //指定一个颜色风格组合，用于SliderBar
  var clrStyleWnd = new BlackHole3D.RE_Vector_UI_CLR_STYLE_ITEM();
  clrStyleWnd.push_back({ "m_uClrStyleEnum": BlackHole3D.RE_UI_CLR_OF_FrameBg, "m_uClrStyleValue": 0xFFABE69A }); //background clr
  clrStyleWnd.push_back({ "m_uClrStyleEnum": BlackHole3D.RE_UI_CLR_OF_SliderGrab, "m_uClrStyleValue": 0xFF3F9625 }); //SliderGrab clr
  clrStyleWnd.push_back({ "m_uClrStyleEnum": BlackHole3D.RE_UI_CLR_OF_FrameBgActive, "m_uClrStyleValue": 0xFFD6F3CE }); //background clr Active
  clrStyleWnd.push_back({ "m_uClrStyleEnum": BlackHole3D.RE_UI_CLR_OF_SliderGrabActive, "m_uClrStyleValue": 0xFF5A74D9 }); //SliderGrab clr Active
  clrStyleWnd.push_back({ "m_uClrStyleEnum": BlackHole3D.RE_UI_CLR_OF_Text, "m_uClrStyleValue": 0xFF1AA3FB });   //Text clr   
  BlackHole3D.RealBIMWeb.UIWgtAddClrStyle("ClrStyleMySlider", clrStyleWnd);
  BlackHole3D.RealBIMWeb.UIWgtSetWgtClrStates("CustomSlider4", BlackHole3D.RealBIMWeb.UIWgtGetClrStyle("ClrStyleMySlider"));

  //直接指定SliderBar的值
  //BlackHole3D.RealBIMWeb.UIWgtSetSliderBarValue("CustomSlider4",[20,30,0,0]);
  //获取SliderBar的值
  //BlackHole3D.RealBIMWeb.UIWgtGetSliderBarValue("CustomSlider4");


  // document.addEventListener("RealBIMUIEvent", CustomBtnHandler);
}

//!(RealBIMAppFileCache)/pics/normalterrain_nor.png
//!(RealBIMAppFileCache)/pics/watermark.png
function CustomBtnHandler(e) {
  console.log("===== 点击事件 =====");
  console.log(e.detail.btnname, e.detail.btnstate);
  if (e.detail.btnname == "btn_01") {
    if (e.detail.btnstate == 0) {
      BlackHole3D.REUIWgtSetImageImgURL("img_01","!(RealBIMAppFileCache)/misc/vc_triangle_down.png");
      console.log("修改图片 -> 状态 1");
      BlackHole3D.REUIWgtSetBtnActiveSubState("btn_01", 1);
    } else {
      BlackHole3D.REUIWgtSetImageImgURL("img_01","!(RealBIMAppFileCache)/misc/vc_triangle_up.png");
      console.log("修改图片 -> 状态 0");
      BlackHole3D.REUIWgtSetBtnActiveSubState("btn_01", 0);
    }
  }
  else if (e.detail.btnname == "btn_02") {
    alert('btn_02 click');
  }
}
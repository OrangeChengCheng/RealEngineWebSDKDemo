
/*
//可操作的内置窗口ID列表

1. 下方主UI面板 "BuiltIn_Wnd_Panel": 
	主UI面板和其关联的子窗口，要求使用SetBuiltInUIVisible() 接口来控制其显示|隐藏，不可通过UIWgtSetVisible() 来直接控制单窗口的显示隐藏，会影响其内部的相互逻辑。
	
2.	实时坐标窗口："PickCoord_Wnd_MousePos"
	显示隐藏实时坐标窗口，也有专门的接口函数SetGeoCoordDisplayable / GetGeoCoordDisplayable 来操作，不可通过UIWgtSetVisible来直接控制该窗口的显示隐藏，以防影响内部关联逻辑
	
3.  Gizmo关联窗口：	"AffineTransModeWnd"  ，可以通过UIWgtSetVisible()控制窗口显隐

4.  倾斜摄影单体化 | 压平区域窗口： "OBEditWnd" 可以通过UIWgtSetVisible()控制窗口显隐
	


//dock area 枚举
//表示窗口区域类型，用于指定一个WindowWgt停靠的布局区域

enum WINDOW_REGION
{
	
	WINDOW_REGION_LB = 0, //屏幕左下区域
	WINDOW_REGION_MB = 1, //屏幕中下区域
	WINDOW_REGION_RB = 2, //屏幕右下区域
	WINDOW_REGION_LM = 3, //屏幕左中区域
	WINDOW_REGION_MM = 4, //屏幕中中区域
	WINDOW_REGION_RM = 5, //屏幕右中区域
	WINDOW_REGION_LT = 6, //屏幕左上区域
	WINDOW_REGION_MT = 7, //屏幕中上区域
	WINDOW_REGION_RT = 8,  //屏幕右上区域
	WINDOW_REGION_NO = 9, //不指定屏幕停靠
	WINDOW_REGION_COUNT		//END，用于u32向枚举转换时数值判断
};


//RE::RealBIMWeb::CLR_OF_ 的各个枚举项导出为常量(因引擎相关接口中会将其当做数字进行计算或传参)
	RE_UI_CLR_OF_Text				// 文字颜色
	RE_UI_CLR_OF_TextDisabled		// 文字禁用时的颜色
	RE_UI_CLR_OF_WindowBg			// 正常窗口背景色
	RE_UI_CLR_OF_ChildBg			// 子窗口背景色
	RE_UI_CLR_OF_PopupBg			// 弹出窗口，菜单，提示框背景色
	RE_UI_CLR_OF_Border				// 边框的颜色
	RE_UI_CLR_OF_BorderShadow		// 边框阴影色
	RE_UI_CLR_OF_FrameBg			// checkbox, radio button, plot, slider, 文字输入窗口的背景色
	RE_UI_CLR_OF_FrameBgHovered		// checkbox, radio button, plot, slider, 文字输入窗口被悬停时的背景色
	RE_UI_CLR_OF_FrameBgActive		// checkbox, radio button, plot, slider, 文字输入窗口被选中时的背景色
	RE_UI_CLR_OF_TitleBg			// 窗口标题栏的背景色
	RE_UI_CLR_OF_TitleBgActive		// 窗口标题栏被选中时的背景色
	RE_UI_CLR_OF_TitleBgCollapsed	// 窗口标题栏被折叠时的背景色
	RE_UI_CLR_OF_MenuBarBg			// 菜单栏的背景色
	RE_UI_CLR_OF_ScrollbarBg		// 滚动条的背景色
	RE_UI_CLR_OF_ScrollbarGrab		// 滚动条滑块的颜色
	RE_UI_CLR_OF_ScrollbarGrabHovered//滚动条滑块悬停的颜色
	RE_UI_CLR_OF_ScrollbarGrabActive// 滚动条滑块被拖动时的颜色
	RE_UI_CLR_OF_CheckMark			// check标记的颜色
	RE_UI_CLR_OF_SliderGrab			// SliderBar的滑块的颜色
	RE_UI_CLR_OF_SliderGrabActive	// SliderBar的滑块被拖动时的颜色
	RE_UI_CLR_OF_Button				// 按钮的颜色
	RE_UI_CLR_OF_ButtonHovered		// 按钮悬停的颜色
	RE_UI_CLR_OF_ButtonActive		// 按钮被选中时的颜色
	RE_UI_CLR_OF_Header				// 用于CollapsingHeader, TreeNode, Selectable, MenuItem的标题栏（头部栏）颜色
	RE_UI_CLR_OF_HeaderHovered		// 用于CollapsingHeader, TreeNode, Selectable, MenuItem的标题栏（头部栏）悬停时的颜色
	RE_UI_CLR_OF_HeaderActive		// 用于CollapsingHeader, TreeNode, Selectable, MenuItem的标题栏（头部栏）选中时的颜色
	RE_UI_CLR_OF_Separator			// Separator 的颜色
	RE_UI_CLR_OF_SeparatorHovered	// Separator 悬停时的颜色
	RE_UI_CLR_OF_SeparatorActive	// Separator 选中时的颜色
	RE_UI_CLR_OF_ResizeGrip			// 改变尺寸的拖动把手的颜色
	RE_UI_CLR_OF_ResizeGripHovered	// 改变尺寸的拖动把手悬停时的颜色
	RE_UI_CLR_OF_ResizeGripActive	// 改变尺寸的拖动把手选中时的颜色
	RE_UI_CLR_OF_Tab				// 标签栏悬停时的颜色
	RE_UI_CLR_OF_TabHovered			// 标签栏选中时的颜色
	RE_UI_CLR_OF_TabActive			// 标签栏激活时的颜色
	RE_UI_CLR_OF_TabUnfocused		// 标签栏未获得焦点时的颜色
	RE_UI_CLR_OF_TabUnfocusedActive // 标签栏未获得焦点并处于活动状态时的颜色

//RE::RealBIMWeb::SIZE_OF_ 的各个枚举项导出为常量(因引擎相关接口中会将其当做数字进行计算或传参)
	RE_UI_SIZE_OF_Alpha						//float 作用于整个动态UI系统的全局透明度
	RE_UI_SIZE_OF_DisabledAlpha				//float 指定内部开始禁用时的透明度，跟Alpha的值相乘
	RE_UI_SIZE_OF_WindowPadding				//Vec2  指定窗口对象内边距（像素，x,y两个方向分别指定）
	RE_UI_SIZE_OF_WindowRounding			//float 指定窗口对象的圆角尺寸，0表示创建矩形窗口，过大的值会导致各种外观异常，所以不建议取值过大
	RE_UI_SIZE_OF_WindowBorderSize			//float 指定窗口边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
	RE_UI_SIZE_OF_WindowMinSize           	//Vec2  指定窗口最小尺寸，这是一个全局设置
	RE_UI_SIZE_OF_WindowTitleAlign        	//Vec2	窗口标题的对齐比例，缺省值为（0.0,0.5）左对齐,垂直居中
	RE_UI_SIZE_OF_ChildRounding           	//float 子窗口的圆角像素大小，0表示创建矩形窗口
	RE_UI_SIZE_OF_ChildBorderSize         	//float	子窗口的边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
	RE_UI_SIZE_OF_PopupRounding           	//float	弹出窗口的圆角像素大小，0表示创建矩形窗口
	RE_UI_SIZE_OF_PopupBorderSize         	//float	弹出窗口的边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
	RE_UI_SIZE_OF_FramePadding            	//Vec2  控件的框架矩形内的的边距
	RE_UI_SIZE_OF_FrameRounding           	//float 控件的圆角像素大小，，0表示创建矩形外框
	RE_UI_SIZE_OF_FrameBorderSize         	//float 控件的边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
	RE_UI_SIZE_OF_ItemSpacing             	//Vec2  控件间距大小（x,y两个方向分别指定水平和垂直间距）
	RE_UI_SIZE_OF_ItemInnerSpacing        	//Vec2  控件内间距大小（x,y两个方向分别指定水平和垂直间距）（对于包含多个组成元素--如SliderBar中的Slider和文字标签--的控件有效）
	RE_UI_SIZE_OF_IndentSpacing           	//float 缩进大小（比如对于树节点会用到此特性，一般为 文字大小+FramePadding*2）
	RE_UI_SIZE_OF_CellPadding             	//Vec2  表单元格的间距
	RE_UI_SIZE_OF_ScrollbarSize           	//float 指定垂直滚动条的宽度 or 水平滚动条的高度
	RE_UI_SIZE_OF_ScrollbarRounding       	//float 滚动条的滑块的圆角半径
	RE_UI_SIZE_OF_GrabMinSize             	//float SliderBar / scrollbar 的滑块的最小宽度/高度
	RE_UI_SIZE_OF_GrabRounding            	//float 滑块的圆角半径，设为0.0创建一个矩形滑块
	RE_UI_SIZE_OF_SliderThickness         	//float 滑动条的宽度
	RE_UI_SIZE_OF_SliderContrast          	//float 滑动条左右两侧的对比度
	RE_UI_SIZE_OF_TabRounding             	//float tab页签的上部圆角半径
	RE_UI_SIZE_OF_ButtonTextAlign         	//Vec2  button比文字区域大时，文字的对齐比例（0.5,0.5）居中对齐
	RE_UI_SIZE_OF_SelectableTextAlign 		//Vec2  可选中文字的对齐方式，默认是(0.0f, 0.0f) (top-left aligned).如果你想把多个项目放在同一行上，通常保持左对齐是很重要的。



//RE::RealBIMWeb::WindowFlags_ 的各个枚举项导出为常量(因为引擎相关接口中会将其当做数字进行计算或传参)
	WINDOW_FLAGS_None
	WINDOW_FLAGS_NoTitleBar						// 禁用标题栏
	WINDOW_FLAGS_NoResize                       // 禁止通过右下角拖动来调整大小
	WINDOW_FLAGS_NoMove                         // 禁止用户移动窗口
	WINDOW_FLAGS_NoScrollbar                    // 禁用滚动条(窗口仍然可以用鼠标或编程方式滚动)
	WINDOW_FLAGS_NoScrollWithMouse              // 禁用用户用鼠标滚轮垂直滚动。在子窗口上，鼠标滚轮将被转发到父窗口，除非同时设置了NoScrollbar。
	WINDOW_FLAGS_NoCollapse                     // 禁止通过双击来折叠窗口 ，也称为窗口菜单按钮
	WINDOW_FLAGS_AlwaysAutoResize               // 根据每帧的内容重设窗口大小
	WINDOW_FLAGS_NoBackground                   // 不绘制窗口背景色和外部边框. 
	WINDOW_FLAGS_NoSavedSettings                // （内部使用的标记）
	WINDOW_FLAGS_NoMouseInputs                  // 不捕获鼠标消息
	WINDOW_FLAGS_MenuBar                        // 包含一个菜单栏
	WINDOW_FLAGS_HorizontalScrollbar            // 允许显示水平滚动条(默认关闭)
	WINDOW_FLAGS_NoFocusOnAppearing             // 当从隐藏状态转换为可见状态时禁用聚焦
	WINDOW_FLAGS_NoBringToFrontOnFocus          // 窗口即使获得焦点也不前置到上层
	WINDOW_FLAGS_AlwaysVerticalScrollbar        // 总是显示垂直滚动条
	WINDOW_FLAGS_AlwaysHorizontalScrollbar      // 总是显示水平滚动条
	WINDOW_FLAGS_AlwaysUseWindowPadding         // 保证没有边框的子窗口也应用WindowPadding尺寸特性 (默认是忽略的)
	WINDOW_FLAGS_NoNavInputs                    // 窗口内没有手柄/键盘导航 
	WINDOW_FLAGS_NoNavFocus                     // 使用手柄/键盘导航时不能聚焦此窗口(例如通过CTRL+TAB跳过) 
	WINDOW_FLAGS_UnsavedDocument                // 在标题旁边显示一个点
	WINDOW_FLAGS_NoDocking                      // 窗口不使用停靠



//----------内部定义的一些颜色风格
	"CS_WND_LIGHT"  //白色窗口风格
	"CS_WND_DARK"	//深色窗口风格

	"CS_BTN_BLUEFRAME_UNCHECK"	//蓝色边框按钮 unCheck
	"CS_BTN_BLUEFRAME_CHECKED"	//蓝色边框按钮 check
	"CS_BTN_DARKFRAME"			//黑框按钮
	"CS_BTN_WHITETEXT_NOBG"		//透明背景色的白色文字按钮
	"CS_BTN_WHITETEXT_BLUEBG"	//蓝色背景色的白色文字按钮

	"CS_RADIO_CHECKED"			//Radio Button uncheck  颜色为:  RE_UI_CLR_OF_FrameBg:0xFFFFFFFF   RE_UI_CLR_OF_Text:0xFFFD9542
	"CS_RADIO_UNCHECK"			//Radio Button checked	颜色为:  RE_UI_CLR_OF_FrameBg:0xFF969696   RE_UI_CLR_OF_Text:0xFFFD9542

	"BLACK_TEXT"				//...
	"WHITE_TEXT"
	"GRAY_TEXT"
	"DARKGRAY_TEXT"

	"ORANGE_TEXT"
	"RED_TEXT"
	"GREEN_TEXT"
	"BLUE_TEXT"
//--------------------------------------


//----------内部定义的一些尺寸风格

	"SS_WND_HAVE_BORDER"	// 窗口带边距的风格 8像素宽边
	"SS_WND_HAVE_THIN_BORDER"// 窗口带边距的风格 2像素宽边
	"SS_WND_NO_BORDER"	// 窗口无边距的风格
	"SS_BTN_HAVE_FRAME"	// 带边框按钮，未选中状态边框宽度	
	"SS_BTN_NO_FRAME"	// 无边框按钮，选中状态边框宽度
	"SS_SLIDER_THIN"	// SliderBar 的内置尺寸风格
	"SS_RADIO_SMALL"	// RadioButton 的尺寸风格（小）

//--------------------------------------
*/

//修改BuiltInPanel的docking位置
function testDockingArea(areaID)
{
	//内置面板便利接口,能够在内部处理所有子窗口的垂直 | 水平布局
	//g_module0.RealBIMWeb.SetBuiltInUIDockArea(areaID);
	
	//直接接口调用示例，如下的实例仅对"BuiltIn_Wnd_Panel"调整了布局方式和停靠方式，
	//其所含按钮的关联窗口的布局和停靠方式没有跟随变化
	if(areaID==0){
		g_module0.RealBIMWeb.UIWgtSetChildWgtLayoutType("BuiltIn_Wnd_Panel",1); //水平布局所有部件
		g_module0.RealBIMWeb.UIWgtSetWndDockArea("BuiltIn_Wnd_Panel", 1, [0,1],[0.5, 5], [0.5, 0.0], [1.0, 0.1]);
	}else{	
		g_module0.RealBIMWeb.UIWgtSetChildWgtLayoutType("BuiltIn_Wnd_Panel",2);//垂直布局所有部件
		g_module0.RealBIMWeb.UIWgtSetWndDockArea("BuiltIn_Wnd_Panel", 3, [1, 0], [5, 0.5], [0.0, 0.5], [0.1, 0.8]);
	}
}

//修改BuiltInPanel的预制风格
function testSetStyle(styleID)
{
	//内置面板便利接口设置整体的颜色风格
	g_module0.RealBIMWeb.SetBuiltInUIColorStyle(styleID);
	
	//内置面板便利接口获取整体的颜色风格
	g_module0.RealBIMWeb.GetBuiltInUIColorStyle();
	
}

//增加一个自定义颜色风格
function testAddCustomClrStyle()
{	
	var ClrParams = new g_module0.RE_Vector_UI_CLR_STYLE_ITEM();
	var param1 = {"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_WindowBg,	"m_uClrStyleValue": 0xFF101010};  ClrParams.push_back(param1);
	var param2 = {"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_Border,		"m_uClrStyleValue": 0xFF265C82};  ClrParams.push_back(param2);
	var param3 = {"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_Button,		"m_uClrStyleValue": 0x8F265C82};  ClrParams.push_back(param3);
	var param4 = {"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_ButtonHovered,	"m_uClrStyleValue": 0xFF21A3E8};  ClrParams.push_back(param4);
	var param5 = {"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_ButtonActive,	"m_uClrStyleValue": 0xFF358CC7};  ClrParams.push_back(param5);
	g_module0.RealBIMWeb.UIWgtAddClrStyle("BROWN",ClrParams);
	
}

//修改BuiltInPanel的风格   
//内置风格包括了"DARK","LIGHT"
function testClrStyleSetting(ClrStyleID)
{	
	//设置某窗口的颜色风格 
	g_module0.RealBIMWeb.UIWgtSetWndColorStyle("BuiltIn_Wnd_Panel",ClrStyleID);

}

//增加一个自定义尺寸风格
function testAddCustomSizeStyle()
{
	var SizeParams = new g_module0.RE_Vector_UI_SIZE_STYLE_ITEM();
	var param1 = {"m_uSizeStyleEnum":g_module0.RE_UI_SIZE_OF_WindowRounding,	"m_vecStyleData":[10.0, 0.0]};  	SizeParams.push_back(param1);
	var param2 = {"m_uSizeStyleEnum":g_module0.RE_UI_SIZE_OF_WindowPadding,	"m_vecStyleData":[40.0, 40.0]};  	SizeParams.push_back(param2);
	var param3 = {"m_uSizeStyleEnum":g_module0.RE_UI_SIZE_OF_ItemSpacing,"m_vecStyleData":[40.0, 40.0]};  	SizeParams.push_back(param3);
	
	g_module0.RealBIMWeb.UIWgtAddSizeStyle("VERY_WIDE",SizeParams);
}


//修改BuiltInPanel的预制风格  
//内置尺寸预设包括了"NO_BORDER","HAVE_BORDER"
function testSizeStyleSetting(SizeStyleID)
{	
	//设置某窗口的尺寸风格
	g_module0.RealBIMWeb.UIWgtSetWndSizeStyle("BuiltIn_Wnd_Panel",SizeStyleID);
}
	

//设置某个按钮的图片
function testBtnImgSetting(stateID,ImgURL)
{
	//"!(RealBIMAppFileCache)/pics/showcoord.png"
	//"!(RealBIMAppFileCache)/pics/hidecoord.png"
	g_module0.RealBIMWeb.UIWgtSetBtnSubStateImgURL("BuiltIn_Btn_VertexSnap",stateID,ImgURL);
}

//设置某个控件对象的可见性
function testBtnVisibility()
{
	//g_module0.RealBIMWeb.UIWgtSetVisible("BuiltIn_Btn_VertexSnap",false);
	
	g_module0.RealBIMWeb.UIWgtSetVisible("BuiltIn_Wnd_Panel",false);
}

//设置某个按钮是否可点击
function testBtnClickable(clickable)
{
	g_module0.RealBIMWeb.UIWgtSetBtnClickable("BuiltIn_Btn_VertexSnap",clickable);
}

function CustomBtnHandler(e){
	console.log(e.detail.btnname,e.detail.btnstate);
	if(e.detail.btnname == "Custom_Btn01"){
		if(e.detail.btnstate == 0){
			//g_module0.RealBIMWeb.UIWgtSetWndColorStyle("BuiltIn_Wnd_Panel","CS_WND_DARK");
			console.log("to dark color");
			g_module0.RealBIMWeb.UIWgtSetBtnActiveSubState("Custom_Btn01",1);
		}else{
			//g_module0.RealBIMWeb.UIWgtSetWndColorStyle("BuiltIn_Wnd_Panel","CS_WND_LIGHT");
			console.log("to light color");
			g_module0.RealBIMWeb.UIWgtSetBtnActiveSubState("Custom_Btn01",0);
		}
	}else if(e.detail.btnname == "Custom_Radio01"){
		if(e.detail.btnstate == 0){
			g_module0.RealBIMWeb.UIWgtSetRadioBtnSelState("Custom_Radio01",1);
			g_module0.RealBIMWeb.UIWgtSetRadioBtnSelState("Custom_Radio02",0);
		}else{
			//
		}
	}else if(e.detail.btnname == "Custom_Radio02"){
		if(e.detail.btnstate == 0){
			g_module0.RealBIMWeb.UIWgtSetRadioBtnSelState("Custom_Radio02",1);
			g_module0.RealBIMWeb.UIWgtSetRadioBtnSelState("Custom_Radio01",0);
		}else{
			//
		}
	}else if(e.detail.btnname == "CustomNumWgt"){
		var va = g_module0.RealBIMWeb.UIWgtGetNumberInputWgtValue("CustomNumWgt");
		console.log(va);
	}else if(e.detail.btnname == "CustomSlider4"){
		var va = g_module0.RealBIMWeb.UIWgtGetSliderBarValue("CustomSlider4");
		console.log(va);
	}
}



//测试自定义窗口和按钮|图像部件
//该窗口是展示主要控件用法的窗口，该窗口对应的消息处理函数是 上边的 function CustomBtnHandler(e)
function testCustomWnd(){
	
	var wndFlags = g_module0.WINDOW_FLAGS_NoDocking | g_module0.WINDOW_FLAGS_NoTitleBar | g_module0.WINDOW_FLAGS_NoResize | g_module0.WINDOW_FLAGS_NoScrollbar ;
	g_module0.RealBIMWeb.UIWgtCreateWnd("Custom_Wnd01","Custom_Wnd01",true,"SS_WND_HAVE_BORDER", "CS_WND_LIGHT",wndFlags,
	g_module0.RE_UI_WINDOW_REGION.NO,0,[0,0],[0.5,0.5],[0.5,0.0],[0.5,0.5]);
	
	g_module0.RealBIMWeb.UIWgtSetExpectSize("Custom_Wnd01", [290,360]);
	
	var stateParams = new g_module0.RE_Vector_STATE_PARAMS()
	
	var P1 = {
            "m_strHint":"暗色主题",
			"m_strText":"",
			"m_strTextureURL":"!(RealBIMAppFileCache)/pics/normalterrain_nor.png",
			"m_vecClrStates": g_module0.RealBIMWeb.UIWgtGetClrStyle("CS_BTN_BLUEFRAME_UNCHECK"),
			"m_vecSizeStates": g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_HAVE_FRAME")
        };
	var P2 = {
            "m_strHint":"明亮主题",
			"m_strText":"",
			"m_strTextureURL":"!(RealBIMAppFileCache)/pics/hideterrain_nor.png",
			"m_vecClrStates": g_module0.RealBIMWeb.UIWgtGetClrStyle("CS_BTN_BLUEFRAME_CHECKED"),
			"m_vecSizeStates": g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_HAVE_FRAME")
        };
    stateParams.push_back(P1);
	stateParams.push_back(P2);

	//创建Btn
 	g_module0.RealBIMWeb.UIWgtCreateButton("Custom_Btn01", stateParams,[50,50], 1, true, true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Btn01");
	
	//sameline 布局标记	
	g_module0.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine01",g_module0.RE_UI_LAYOUT_FLAG.SAMELINE,[0,0],0,8,true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "SameLine01");	
	
	//创建img
	g_module0.RealBIMWeb.UIWgtCreateImage("Custom_Img01", true, [200,200], "!(RealBIMAppFileCache)/pics/watermark.png");
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Img01"); 
	
	//创建CheckBox
	g_module0.RealBIMWeb.UIWgtCreateCheckBox("Custom_CheckBox01",true,"Check01",true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_CheckBox01"); 
	
	//创建RadioBtn1
	g_module0.RealBIMWeb.UIWgtCreateRadioButton("Custom_Radio01",true,"Radio01",true);  //创建单选框1
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Radio01");    	//放入窗口
	g_module0.RealBIMWeb.UIWgtSetCheckBoxClrStates("Custom_Radio01",g_module0.RealBIMWeb.UIWgtGetClrStyle("CS_RADIO_UNCHECK"),g_module0.RealBIMWeb.UIWgtGetClrStyle("CS_RADIO_CHECKED")); //设置单选框的颜色和尺寸风格												
	g_module0.RealBIMWeb.UIWgtSetCheckBoxSizeStates("Custom_Radio01",g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_RADIO_SMALL"),g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_RADIO_SMALL"));																																				
	//sameline 布局标记	
	g_module0.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine02",g_module0.RE_UI_LAYOUT_FLAG.SAMELINE,[0,0],0,8,true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "SameLine02");	
	
	//创建RadioBtn2
	g_module0.RealBIMWeb.UIWgtCreateRadioButton("Custom_Radio02",true,"Radio02",false);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Radio02"); 	
	g_module0.RealBIMWeb.UIWgtSetCheckBoxClrStates("Custom_Radio02",g_module0.RealBIMWeb.UIWgtGetClrStyle("CS_RADIO_UNCHECK"),g_module0.RealBIMWeb.UIWgtGetClrStyle("CS_RADIO_CHECKED"));	//设置单选框的颜色和尺寸风格																																					
	g_module0.RealBIMWeb.UIWgtSetCheckBoxSizeStates("Custom_Radio02",g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_RADIO_SMALL"),g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_RADIO_SMALL"));
																								
	//创建ColorEditor
	g_module0.RealBIMWeb.UIWgtCreateColorEditer("Custom_ClrEdit",true,"MyClr1",[0.2,0.4,1.0,1.0],0,[0,0]);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_ClrEdit"); 
	
	//修改颜色控件右侧的标签文字内容
	//g_module0.RealBIMWeb.UIWgtGetColorEditerLabel("Custom_ClrEdit");
	//g_module0.RealBIMWeb.UIWgtSetColorEditerLabel("Custom_ClrEdit","XXClr");
	
	//修改颜色控件的颜色值(以vec4类型来操作)
	//g_module0.RealBIMWeb.UIWgtGetColorEditerValueV4("Custom_ClrEdit");
	//g_module0.RealBIMWeb.UIWgtSetColorEditerValueV4("Custom_ClrEdit",[0.9,0.0,0.0,1.0]); //RGBA
	
	//修改颜色控件的颜色值(以u32类型来操作)
	//g_module0.RealBIMWeb.UIWgtGetColorEditerValueU("Custom_ClrEdit");
	//g_module0.RealBIMWeb.UIWgtSetColorEditerValueU("Custom_ClrEdit",0xffff0000); //ABGR
	
	//创建文字标签
	g_module0.RealBIMWeb.UIWgtCreateLabel("Custom_Label",true,[0,0],"标签1");        
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Label"); 
	//g_module0.RealBIMWeb.UIWgtGetLableText("Custom_Label");
	//g_module0.RealBIMWeb.UIWgtSetLableText("Custom_Label","Label01");
	
	//创建ComboBox
	var itemList = new g_module0.RE_Vector_WStr();
	itemList.push_back("Black"); 
	itemList.push_back("White");
	itemList.push_back("Red");
	itemList.push_back("Green");
	itemList.push_back("Blue");	
	g_module0.RealBIMWeb.UIWgtCreateComboBox("Custom_ComboBox",true,[0,0],"组合框01",itemList,2);  
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_ComboBox"); 
	
	//创建数值编辑控件
	g_module0.RealBIMWeb.UIWgtCreateNumberInputWgt("CustomNumWgt",true,[150,40],g_module0.RE_UI_EDITBOX_NUMTYPE.INT3,[10,20,30,40],"%.2f",true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomNumWgt"); 
	
	//g_module0.RealBIMWeb.UIWgtCreateNumberInputWgt("CustomNumWgt2",true,[150,40],g_module0.RE_UI_EDITBOX_NUMTYPE.INT2,[10],"",true);
	//g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomNumWgt2"); 
	
	//创建SliderBar 创建原始高度的 int3 类型的silderBar 范围[-100,100]
	g_module0.RealBIMWeb.UIWgtCreateSliderBar("CustomSlider",true,[250,40],g_module0.RE_UI_EDITBOX_NUMTYPE.INT3,[10,20,30,0],[-100,100],"%d",true,false);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomSlider"); 
	
	//创建不带数字显示的 int3 类型的SliderBar 去掉Format字符串 ,范围[0,100],同时，禁止Ctrl+Click输入
	g_module0.RealBIMWeb.UIWgtCreateSliderBar("CustomSlider2",true,[250,40],g_module0.RE_UI_EDITBOX_NUMTYPE.INT3,[10,20,30,0],[0,100],"",false,false);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomSlider2"); 
	g_module0.RealBIMWeb.UIWgtSetWgtSizeStates("CustomSlider2",g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_SLIDER_THIN"));
	
	//创建原始高度的的 Float2 类型的SliderBar ,显示中保留2位小数
	g_module0.RealBIMWeb.UIWgtCreateSliderBar("CustomSlider3",true,[250,40],g_module0.RE_UI_EDITBOX_NUMTYPE.FLOAT2,[10.5,20.8,0,0],[-100,100],"%.2f",true,false);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomSlider3"); 
	
	//创建原始高度的的 Double2 类型的SliderBar ,显示中保留3位小数,同时禁止编辑
	g_module0.RealBIMWeb.UIWgtCreateSliderBar("CustomSlider4",true,[250,40],g_module0.RE_UI_EDITBOX_NUMTYPE.DOUBLE2,[10.5,20.8,0,0],[-100,100],"%.3f",false,false);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "CustomSlider4"); 
	
	//指定一个颜色风格组合，用于SliderBar
	var clrStyleWnd = new g_module0.RE_Vector_UI_CLR_STYLE_ITEM();
	clrStyleWnd.push_back({"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_FrameBg,"m_uClrStyleValue":0xFFABE69A}); //background clr
	clrStyleWnd.push_back({"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_SliderGrab,"m_uClrStyleValue":0xFF3F9625}); //SliderGrab clr
	clrStyleWnd.push_back({"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_FrameBgActive,"m_uClrStyleValue":0xFFD6F3CE}); //background clr Active
	clrStyleWnd.push_back({"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_SliderGrabActive,"m_uClrStyleValue":0xFF5A74D9}); //SliderGrab clr Active
	clrStyleWnd.push_back({"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_Text,"m_uClrStyleValue":0xFF1AA3FB});   //Text clr   
	g_module0.RealBIMWeb.UIWgtAddClrStyle("ClrStyleMySlider",clrStyleWnd);
	g_module0.RealBIMWeb.UIWgtSetWgtClrStates("CustomSlider4",g_module0.RealBIMWeb.UIWgtGetClrStyle("ClrStyleMySlider"));
	
	//直接指定SliderBar的值
	//g_module0.RealBIMWeb.UIWgtSetSliderBarValue("CustomSlider4",[20,30,0,0]);
	//获取SliderBar的值
	//g_module0.RealBIMWeb.UIWgtGetSliderBarValue("CustomSlider4");
	
	
	document.addEventListener("RealBIMUIEvent", CustomBtnHandler);
}

testCustomWnd();




function CustomPanelHandler(e){
	console.log(e.detail.btnname,e.detail.btnstate);
	if(e.detail.btnname == "Custom_Btn_Home"){
		if(e.detail.btnstate == 0){
			g_module0.RealBIMWeb.UIWgtSetBtnActiveSubState("Custom_Btn_Home",1);
		}else{
			g_module0.RealBIMWeb.UIWgtSetBtnActiveSubState("Custom_Btn_Home",0);
		}
	}
}

//该窗口是展示用户指定风格的实现方式，对应的处理函数为 CustomPanelHandler(e)
function testCustomPanel()
{
	//创建一个自定义颜色风格（本示例中该风格指定了窗口的底色）
	var clrStyleWnd = new g_module0.RE_Vector_UI_CLR_STYLE_ITEM();
	clrStyleWnd.push_back({"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_WindowBg,"m_uClrStyleValue":0xFF985532}); //Window clr
	g_module0.RealBIMWeb.UIWgtAddClrStyle("ClrStyleWnd",clrStyleWnd);
	
	//创建一个自定义颜色风格（本示例中该风格指定了按钮的底色和悬停色）
	var clrStyle = new g_module0.RE_Vector_UI_CLR_STYLE_ITEM();
	clrStyle.push_back({"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_Button,"m_uClrStyleValue":0xFF985532}); //button clr
	clrStyle.push_back({"m_uClrStyleEnum":g_module0.RE_UI_CLR_OF_ButtonHovered,"m_uClrStyleValue":0xFFD08242}); //button on hover clr
	g_module0.RealBIMWeb.UIWgtAddClrStyle("CusClrStyleBtn",clrStyle);
	
	
	//==================创建窗口====================
	var wndFlags = g_module0.WINDOW_FLAGS_NoDocking | g_module0.WINDOW_FLAGS_NoTitleBar | g_module0.WINDOW_FLAGS_NoResize | g_module0.WINDOW_FLAGS_NoScrollbar ;
	
	g_module0.RealBIMWeb.UIWgtCreateWnd("Custom_Wnd01","Custom_Wnd01",true,"SS_WND_HAVE_BORDER", "ClrStyleWnd",wndFlags,
	g_module0.RE_UI_WINDOW_REGION.MB,0,[0,1],[0.5,20],[0.5,0.0],[0.5,0.5]);
	
	
	//==================创建Home按钮===================
	var stateParams_of_Home = new g_module0.RE_Vector_STATE_PARAMS()
	
	var P1 = { "m_strHint":"",	"m_strText":"",
			"m_strTextureURL":"http://192.168.31.25:10100/TestIcon/Home_Nor.png",
			"m_vecClrStates": g_module0.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),
			"m_vecSizeStates": g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
	var P2 = {"m_strHint":"", "m_strText":"",
			"m_strTextureURL":"http://192.168.31.25:10100/TestIcon/Home_Hov.png",
			"m_vecClrStates": g_module0.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),//CS_BTN_WHITETEXT_BLUEBG
			"m_vecSizeStates": g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
    stateParams_of_Home.push_back(P1);
	stateParams_of_Home.push_back(P2);

	//创建Btn
 	g_module0.RealBIMWeb.UIWgtCreateButton("Custom_Btn_Home", stateParams_of_Home,[48,64], 0, true, true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Btn_Home");
	
	g_module0.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine01",g_module0.RE_UI_LAYOUT_FLAG.SAMELINE,[0,0],0,8,true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "SameLine01");
	
	//=====================创建地图按钮=====================
	var stateParams_of_map = new g_module0.RE_Vector_STATE_PARAMS()
	
	var P1 = { "m_strHint":"",	"m_strText":"",
			"m_strTextureURL":"http://192.168.31.25:10100/TestIcon/Map_Nor.png",
			"m_vecClrStates": g_module0.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),
			"m_vecSizeStates": g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
    stateParams_of_map.push_back(P1);

	//创建Btn
 	g_module0.RealBIMWeb.UIWgtCreateButton("Custom_Btn_Map", stateParams_of_map,[48,64], 0, true, true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Btn_Map");
	
	g_module0.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine02",g_module0.RE_UI_LAYOUT_FLAG.SAMELINE,[0,0],0,8,true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "SameLine02");	
	
	//=======================创建漫游按钮=======================
	var stateParams_of_Travel = new g_module0.RE_Vector_STATE_PARAMS()
	
	var P1 = { "m_strHint":"",	"m_strText":"",
			"m_strTextureURL":"http://192.168.31.25:10100/TestIcon/Travel_Nor.png",
			"m_vecClrStates": g_module0.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),
			"m_vecSizeStates": g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
    stateParams_of_Travel.push_back(P1);

	//创建Btn
 	g_module0.RealBIMWeb.UIWgtCreateButton("Custom_Btn_Travel", stateParams_of_Travel,[48,64], 0, true, true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd01", "Custom_Btn_Travel");
	
	
	//##########################  创建另一相同停靠区域的窗口  #########################
	
	g_module0.RealBIMWeb.UIWgtCreateWnd("Custom_Wnd02","Custom_Wnd02",true,"SS_WND_HAVE_BORDER", "ClrStyleWnd",wndFlags,
	g_module0.RE_UI_WINDOW_REGION.MB,0,[0,1],[0.5,20],[0.5,0.0],[0.5,0.5]);
	
	//==================创建Home2按钮===================
	var stateParams_of_Home2 = new g_module0.RE_Vector_STATE_PARAMS()
	
	var P1 = { "m_strHint":"",	"m_strText":"",
			"m_strTextureURL":"http://192.168.31.25:10100/TestIcon/Home_Hov.png",
			"m_vecClrStates": g_module0.RealBIMWeb.UIWgtGetClrStyle("CusClrStyleBtn"),
			"m_vecSizeStates": g_module0.RealBIMWeb.UIWgtGetSizeStyle("SS_BTN_NO_FRAME")
        };
    stateParams_of_Home2.push_back(P1);
	//创建Btn
 	g_module0.RealBIMWeb.UIWgtCreateButton("Custom_Btn_Home2", stateParams_of_Home2,[48,64], 0, true, true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd02", "Custom_Btn_Home2");
	g_module0.RealBIMWeb.UIWgtCreateLayoutFlag("SameLine03",g_module0.RE_UI_LAYOUT_FLAG.SAMELINE,[0,0],0,8,true);
	g_module0.RealBIMWeb.UIWgtAddChildWidget("Custom_Wnd02", "SameLine03");
	
	//绑定监听事件处理函数
	document.addEventListener("RealBIMUIEvent", CustomPanelHandler);
}

testCustomPanel();
g_module0.RealBIMWeb.SetBuiltInUIVisible(false);



//测试按钮层级关系的查询|修改|移除
function testUIWgtHierarchy()
{
	var ChildrenCount = g_module0.RealBIMWeb.UIWgtGetChildrenNum("Custom_Wnd01");
	
	g_module0.RealBIMWeb.UIWgtIsChildWidget("Custom_Wnd01","Custom_Btn01");
	
	g_module0.RealBIMWeb.UIWgtIsChildWidget("Custom_Wnd01","BuiltIn_Btn_Area");
	
	g_module0.RealBIMWeb.UIWgtIsChildWidget("","BuiltIn_Btn_Area");
	
	g_module0.RealBIMWeb.UIWgtIsChildWidget("Custom_Wnd01","");
	
	g_module0.RealBIMWeb.UIWgtIsChildWidget("","");
	
	g_module0.RealBIMWeb.UIWgtGetChildrenNum("Custom_Wnd01");
	
	var arrChildName = g_module0.RealBIMWeb.UIWgtGetAllChildrensID("Custom_Wnd01");
	var nameArr = [];
	for(i =0; i<arrChildName.size(); ++i){
		nameArr.push(arrChildName.get(i));
		console.log(arrChildName.get(i));
	}
	
	g_module0.RealBIMWeb.UIWgtGetParentWidgetID("Custom_Wnd01");
	
	g_module0.RealBIMWeb.UIWgtRemoveChildWidget("Custom_Wnd01", "Custom_Img01");
	
	g_module0.RealBIMWeb.UIWgtRemoveAllChilden("");
	g_module0.RealBIMWeb.UIWgtRemoveAllChilden("xxx");
	g_module0.RealBIMWeb.UIWgtRemoveAllChilden("Custom_Img01");
	g_module0.RealBIMWeb.UIWgtRemoveAllChilden("Custom_Wnd01");
	
	g_module0.RealBIMWeb.UIWgtDeleteWidget("");
	g_module0.RealBIMWeb.UIWgtDeleteWidget("xxx");
	g_module0.RealBIMWeb.UIWgtDeleteWidget("Custom_Img01");
	g_module0.RealBIMWeb.UIWgtDeleteWidget("Custom_Wnd01");
}

function testGizmo_on()
{

	//调用进入编辑状态的接口，此时还不弹出仿射变换信息窗口
	g_module0.RealBIMWeb.EnterSceneNodeEditMode();
	//打开Gizmo关联的窗口
	g_module0.RealBIMWeb.UIWgtSetVisible("AffineTransModeWnd",true);
}


function testGizmo_off()
{
	//此为仅退出状态的接口，这种情况下，如果有自己创建的关联窗口，应当同时关闭
	g_module0.RealBIMWeb.ExitSceneNodeEditMode();

	//关闭Gizmo关联的窗口，内部不会自动退出编辑状态
	g_module0.RealBIMWeb.UIWgtSetVisible("AffineTransModeWnd",false);	//内部做了退出编辑状态的关联处理，但是，仅在点击X退出时才执行，同过UIWgtSetVisible关闭窗口时，是没有关联退出编辑状态的行为的
}

	
//----------设置编辑的级别，这里设置1：节点级----------
//g_module0.RealBIMWeb.SetCtrlLevel(g_module0.RE_CTRL_LEVEL.PROJ);
//g_module0.RealBIMWeb.SetCtrlLevel(g_module0.RE_CTRL_LEVEL.HMODEL);
//g_module0.RealBIMWeb.SetCtrlLevel(g_module0.RE_CTRL_LEVEL.ELEM);


//----------设置UnverElem 在编辑状态下是否可以被选中-----
// g_module0.RealBIMWeb.SetUnverElemPickupEnable(true);

//测试选择HugeModel层次的节点
function TestHModelSelSet()
{
	g_module0.RealBIMWeb.SetCtrlLevel(g_module0.RE_CTRL_LEVEL.HMODEL);	
	a = new g_module0.RE_Vector_SEL_NODE_ID(); //创建HModel选择集合对象
	
	var P1 = {  "m_strProjID" : "pro01", "m_strHModelID" : "3a05e1ea0a86e8832e1f3102357ab6f4"    };//一个HModelID结构对象
	var P2 = {	"m_strProjID" : "pro02", "m_strHModelID" : "<hugemodel><test>_sce_0" 	};	 
	a.push_back(P1);
	a.push_back(P2);
	g_module0.RealBIMWeb.AddToCurSelHModelIDs(a);  		//把两个HugeModel加入选择集

	b = new g_module0.RE_Vector_SEL_NODE_ID();
	b.push_back(P2);
	g_module0.RealBIMWeb.RemoveFromCurSelHModelIDs(b);  //从现有的HugeModel选择集中移除一个节点

	var re = g_module0.RealBIMWeb.GetCurSelHModelIDs(); //获取当前选中的HugeModel集合
	for(i=0;i<re.size();++i){  console.log(re.get(i));}

}


//测试选择Proj层次的节点
function TestProjSelSet()
{
	g_module0.RealBIMWeb.SetCtrlLevel(g_module0.RE_CTRL_LEVEL.PROJ);
	a = new g_module0.RE_Vector_WStr();
	a.push_back('pro01');	g_module0.RealBIMWeb.AddToCurSelProjIDs(a);  //向Proj选择集中加入一个节点
	a.push_back('pro02');	g_module0.RealBIMWeb.AddToCurSelProjIDs(a);	 //向Proj选择集中加入另一个节点
	
	b = new g_module0.RE_Vector_WStr();
	b.push_back('pro01');	g_module0.RealBIMWeb.RemoveFromCurSelProjIDs(b); //在Proj选择集中移除一个节点
	
	var re = g_module0.RealBIMWeb.GetCurSelProjIDs();		////获取当前选中的Proj集合
	for(i=0;i<re.size();++i){  console.log(re.get(i));}
}


//====================编辑倾斜摄影单体化 | 压平 相关的js代码===============

//导出倾斜摄影编辑操作的几个状态枚举
/*
emscripten::enum_<RE::IRealBIM::OBLIQUE_PHOTOGRAPH_SHAPE_EDIT_STATE>("RE_OBLIQUE_EDIT_STATE")
	.value("NONE", RE::IRealBIM::OBLIQUE_PHOTOGRAPH_SHAPE_EDIT_STATE::NONE)
	.value("MODIFY", RE::IRealBIM::OBLIQUE_PHOTOGRAPH_SHAPE_EDIT_STATE::MODIFY)  //倾斜摄影编辑状态
	.value("VIEW", RE::IRealBIM::OBLIQUE_PHOTOGRAPH_SHAPE_EDIT_STATE::VIEW)		//预览状态
	.value("EDIT_PLANE", RE::IRealBIM::OBLIQUE_PHOTOGRAPH_SHAPE_EDIT_STATE::EDIT_PLANE)	//创建区域角点状态
	.value("MOVING_SECTION_CORNER", RE::IRealBIM::OBLIQUE_PHOTOGRAPH_SHAPE_EDIT_STATE::MOVING_SECTION_CORNER)	//移动角点状态
	;

*/

function testObliqueEdit_on()
{
	//进入倾斜摄影单体化|压平区域的编辑状态
	g_module0.RealBIMWeb.BeginOBBottomPlaneEdit();	
	//打开窗口
	g_module0.RealBIMWeb.UIWgtSetVisible("OBEditWnd",true);
}

function testObliqueEdit_off()
{
	//进入倾斜摄影单体化|压平区域的编辑状态
	g_module0.RealBIMWeb.EndOBBottomPlaneEdit();	
	//关闭窗口
	g_module0.RealBIMWeb.UIWgtSetVisible("OBEditWnd",false);
}

//var event = new CustomEvent("NewOBSectionFinish",{ detail: {sectionID: $0, flatten : $1} });    //一个新区域添加完成的事件

//var event = new CustomEvent("MoveOBSectionFinish",{ detail: {sectionID: $0, flatten : $1} });	//一个区域角点拖动结束的事件

//

//获取当前选中的区域的数据（json字符串）字符串格式为data:[{}]
function getSelectedSectionJson()
{
	g_module0.RealBIMWeb.GetJsonStrOfOBEditInfo(0,0);
}


//根据一个json字符串，更新或新增一个区域对象
var projJson = '[{"regionID":1,"regionName":"UnVerProject[1]","shpType":"未分类","projectionHeight":110.309998,"regionVertex":[[-1398.223802,-2122.212046,110.843561],[-1400.800437,-2120.145568,110.917822],[-1396.932387,-2116.522013,110.650538],[-1394.717586,-2118.853034,110.310001]]}]';
g_module0.RealBIMWeb.ParseUnverprojectInfo(projJson,true);

var sepJson = '[{"boxID":2,"boxName":"UnVerElem[2]","shpType":"未分类","heightMax":125.827974,"heightMin":67.853336,"boxColor":"000000","boxAlpha":10,"pos":[[-1391.341548,-2114.409225,110.085922],[-1399.425813,-2101.374543,117.038349],[-1386.750934,-2082.385380,110.044393],[-1375.013593,-2096.421829,110.668990]],"param":[]}]';
g_module0.RealBIMWeb.ParseUnverelemInfo(sepJson,true);


//根据区域ID ，name把区域加入选择集

function selASection(elemArr){

  var _s = elemArr.length;
  var _s01 = (_s*4).toString();
  g_module0.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =g_module0.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid], i);
  }
  g_module0.RealBIMWeb.AddUnverelemsToSelection(elemIds.byteLength,elemIds.byteOffset);
}


//从选择集移除单体化区域，参数为要移除的单体化id集合
function unSelASection(elemArr){
  var _s = elemArr.length;
  var _s01 = (_s*4).toString();
  g_module0.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =g_module0.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid], i);
  }
  g_module0.RealBIMWeb.RemoveUnverelemsToSelection(elemIds.byteLength,elemIds.byteOffset);
}


function selAFlattenSection(elemArr){

  var _s = elemArr.length;
  var _s01 = (_s*4).toString();
  g_module0.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =g_module0.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid], i);
  }
  g_module0.RealBIMWeb.AddUnverprojectToSelection(elemIds.byteLength,elemIds.byteOffset);
}


//从选择集移除单体化区域，参数为要移除的单体化id集合
function unSelAFlattenSection(elemArr){
  var _s = elemArr.length;
  var _s01 = (_s*4).toString();
  g_module0.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =g_module0.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemArr[i];
    elemIds.set([eleid], i);
  }
  g_module0.RealBIMWeb.RemoveUnverprojectToSelection(elemIds.byteLength,elemIds.byteOffset);
}



			
			
			
			
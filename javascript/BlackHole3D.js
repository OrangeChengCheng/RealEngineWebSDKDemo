//版本：v3.1.0.2046
const isPhoneMode = false;
var CreateBlackHoleWebSDK = function (ExtModule) {

    ExtModule = ExtModule || {};
    var Module = typeof ExtModule !== "undefined" ? ExtModule : {};

    CreateModuleRE2(ExtModule).then(instance => {
        ExtModule = instance;
    }); //创建引擎模块


    // MOD-- 引擎模块
    class RESysInfo {
        // 引擎参数模型
        constructor() {
            this.workerjsPath = null;//相对于html页面的RealBIMWeb_Worker.js的路径
            this.renderWidth = 0;//初始化图形窗口的宽度
            this.renderHieght = 0;//初始化图形窗口的高度
            this.commonUrl = null;//引擎调用的公共资源的路径
            this.userName = "";//引擎资源发布服务配套的用户名
            this.passWord = "";//引擎资源发布服务配套的密码
            this.mainWndName = 'BlackHole';//表示主窗口的名称,对应document.title，默认值 "BlackHole"
        }
    }
    ExtModule.RESysInfo = RESysInfo;

    /**
     * 初始化引擎
     * @param {RESysInfo} sysInfo //引擎设置参数
     */
    Module.initEngineSys = function (sysInfo) {
        if (isEmptyLog(sysInfo, 'sysInfo')) return;
        if (isEmptyLog(sysInfo.workerjsPath, 'workerjsPath')) return;

        var _commonUrl = isEmpty(sysInfo.commonUrl) ? "" : sysInfo.commonUrl;
        // if (!isEmpty(sysInfo.commonUrl)) sessionStorage.setItem("RECommonUrl", sysInfo.commonUrl);//保存资源地址
        Module['m_re_em_force_threadnum'] = isPhoneMode ? 1 : 8;//移动端强制将CPU核心数设为1，以避免浏览器创建多个WebWorker时造成内存耗尽
        Module["m_re_em_window_width"] = sysInfo.renderWidth;
        Module["m_re_em_window_height"] = sysInfo.renderHieght;
        var _strMainWndName = "BlackHole"; if (!isEmpty(sysInfo.mainWndName)) _strMainWndName = sysInfo.mainWndName;
        var bool = Module.RealBIMWeb.CreateEmuMgr(sysInfo.workerjsPath, _strMainWndName, sysInfo.renderWidth, sysInfo.renderHieght,
            false, 500, "", _commonUrl, "/ModuleDir/TempFile/", "/WebCache0001/",
            sysInfo.userName, sysInfo.passWord);
        if (isPhoneMode) {
            Module.SkyBox.setSkyAtmActive(false);
            Module.Common.setReflState(false);
            Module.Common.setShadowState(false);
            Module.Common.setGhostState(false);
            Module.Common.setAOState(false);
            Module.Common.setSceOITLev(0);
            Module.setOperationMode(1);
        }
        return bool;
    }

    /**
     * 添加一个HTTP路径授权信息
     * @param {String} identifyName //表示信息的逻辑标识名（默认 RealEngineInitAuthorPath ）
     * @param {string} filePath //授权文件路径
     */
    Module.addAuthorPath = function (identifyName, filePath) {
        if (!checkTypeLog(identifyName, 'identifyName', RE_Enum.RE_Check_String)) return;
        if (!checkTypeLog(filePath, 'filePath', RE_Enum.RE_Check_String)) return;
        return Module.RealBIMWeb.AddAURLPathCtrl_AuthorPath(identifyName, filePath);
    }

    /**
     * 添加一个HTTP路径索引信息
     * @param {String} identifyName //表示信息的逻辑标识名（默认 RealEngineInitPathIndex ）
     * @param {string} rootURL //表示路径索引对应的跟文件夹
     * @param {string} filePath //授权文件路径
     */
    Module.addPathIndex = function (identifyName, rootURL, filePath) {
        if (!checkTypeLog(identifyName, 'identifyName', RE_Enum.RE_Check_String)) return;
        if (!checkTypeLog(rootURL, 'rootURL', RE_Enum.RE_Check_String)) return;
        if (!checkTypeLog(filePath, 'filePath', RE_Enum.RE_Check_String)) return;
        return Module.RealBIMWeb.AddAURLPathCtrl_PathIndex(identifyName, rootURL, filePath);
    }

    /**
     * 释放引擎所占用的浏览器资源
     * @param {Boolean} clearWebWorker //是否同步清除已创建的webWorker
     */
    Module.releaseEngine = function (clearWebWorker) {
        var _bClearWebWorker = false; if (!isEmpty(clearWebWorker)) _bClearWebWorker = clearWebWorker;
        Module.RealBIMWeb.ReleaseEmuMgr(_bClearWebWorker);
        //释放显存
        if (typeof Module.ctx != 'undefined') {
            if (Module.ctx.getExtension('WEBGL_lose_context') != null) {
                Module.ctx.getExtension('WEBGL_lose_context').loseContext();
            }
        }
    }

    /**
     * 获取当前SDK版本
     */
    Module.getVersion = function () {
        return Module.RealBIMWeb.GetRealEngineVersion();
    }

    /**
     * 设置窗口的显示模式，此接口适用于需要双屏显示，以及需要单双屏切换的应用场景。
     * @param {REVpTypeEm} viewport0 //第0个视图要显示的场景内容 REVpTypeEm 枚举类型
     * @param {REVpTypeEm} viewport1 //第1个视图要显示的场景内容 REVpTypeEm 枚举类型
     * @param {REVpRankEm} screenMode //视图0与视图1在屏幕上的排列方式 REVpRankEm 枚举类型
     */
    Module.setViewMode = function (viewport0, viewport1, screenMode) {
        Module.RealBIMWeb.SetViewMode(viewport0, viewport1, screenMode);
    }

    /**
     * 设置360相机与BIM相机是否同步
     * @param {Boolean} isSync //是否同步
     */
    Module.setViewSyn = function (isSync) {
        Module.RealBIMWeb.SetViewSyn(isSync);
    }

    /**
     * 获取当前设置的360相机与BIM相机是否同步状态
     */
    Module.getViewSyn = function () {
        return Module.RealBIMWeb.GetViewSyn();
    }

    /**
     * 获取鼠标是否翻转了左右相机拖动键操作
     */
    Module.getCamRevLR = function () {
        return Module.RealBIMWeb.CamRevLR();
    }

    /**
     * 设置是否翻转鼠标左右相机拖动键操作行为
     * @param {Boolean} reverseLR //是否翻转
     */
    Module.setCamRevLR = function (reverseLR) {
        Module.RealBIMWeb.SetCamRevLR(reverseLR);
    }

    /**
     * 获取是否允许ESC键退出测量/剖切操作
     */
    Module.getEscKeyExitOpEnable = function () {
        return Module.RealBIMWeb.EscKeyExitOpEnable();
    }

    /**
     * 设置是否允许ESC键退出测量/剖切操作
     * @param {Boolean} enable //是否允许
     */
    Module.setEscKeyExitOpEnable = function (enable) {
        Module.RealBIMWeb.SetEscKeyExitOpEnable(enable);
    }

    /**
     * 生成屏幕快照
     */
    Module.getScreenSnapshot = function () {
        return Module.canvas.toDataURL();
    }

    /**
     * 设置当前的操作模式
     * @param {Number} operationMode //模式类型 0:鼠标操作操作 1:触控操作
     */
    Module.setOperationMode = function (operationMode) {
        var _operationMode = Module.RE_INPUT_TYPE.MOUSE; if (!isEmpty(operationMode)) _operationMode = ((operationMode == 0) ? Module.RE_INPUT_TYPE.MOUSE : Module.RE_INPUT_TYPE.TOUCH);
        Module.RealBIMWeb.SetInputType(_operationMode);
    }
    //获取当前的操作模式(0:鼠标操作操作 1:触控操作)
    Module.getOperationMode = function () {
        var _type = Module.RealBIMWeb.GetInputType();
        return (_type == Module.RE_INPUT_TYPE.MOUSE) ? 0 : 1;
    }

    /**
     * 暂停渲染主循环
     */
    Module.pauseRenderLoop = function () {
        Module.RealBIMWeb.PauseRenderLoop();
    }

    /**
     * 恢复渲染主循环
     */
    Module.resumeRenderLoop = function () {
        Module.RealBIMWeb.ResumeRenderLoop();
    }











    // MOD-- 公共模块（Common）
    Module.Common = typeof Module.Common !== "undefined" ? Module.Common : {};//增加 Common 模块
    class REColor {
        //颜色公共模型
        constructor(red, green, blue, alpha) {
            this.red = !isEmpty(red) ? red : 255;//红色
            this.green = !isEmpty(green) ? green : 255;//绿色
            this.blue = !isEmpty(blue) ? blue : 255;//蓝色
            this.alpha = !isEmpty(alpha) ? alpha : 255;//透明度
        }
    }
    ExtModule.REColor = REColor;


    // MARK 性能
    /**
     * 设置渲染时引擎最大允许的内存占用空间(以MB为单位)
     * @param {Number} size //显存占用空间值(以MB为单位)
     */
    Module.Common.setMaxResMemMB = function (size) {
        Module.RealBIMWeb.SetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK, size);
    }

    /**
     * 获取渲染时引擎最大允许的内存占用空间(以MB为单位)
     */
    Module.Common.getMaxResMemMB = function () {
        return Module.RealBIMWeb.GetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK);
    }

    /**
     * 设置渲染时引擎建议分配的内存空间(以MB为单位)
     * @param {Number} size //显存占用空间值(以MB为单位)
     */
    Module.Common.setExpectMaxInstMemMB = function (size) {
        Module.RealBIMWeb.SetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, size);
    }

    /**
     * 获取渲染时引擎建议分配的内存空间(以MB为单位)
     */
    Module.Common.getExpectMaxInstMemMB = function () {
        return Module.RealBIMWeb.GetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
    }

    /**
     * 设置模型每帧最大渲染面数
     * @param {Number} size //每帧渲染的面数
     */
    Module.Common.setExpectMaxInstDrawFaceNum = function (size) {
        Module.RealBIMWeb.SetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, size);
    }

    /**
     * 获取模型每帧最大渲染面数
     */
    Module.Common.getExpectMaxInstDrawFaceNum = function () {
        return Module.RealBIMWeb.GetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
    }

    /**
     * 设置页面调度等级
     * @param {Number} level //页面调度等级
     */
    Module.Common.setPageLoadLev = function (level) {
        Module.RealBIMWeb.SetPageLoadLev(level);
    }

    /**
     * 获取页面调度等级
     */
    Module.Common.getPageLoadLev = function () {
        return Module.RealBIMWeb.GetPageLoadLev();
    }

    /**
     * 设置每帧允许的最大资源加载总数
     * @param {Number} count //每帧允许的资源加载设定参数
     */
    Module.Common.setTotalResMaxLoadNum = function (count) {
        if (count == 0) {
            Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0);
        } else if (count == 1) {
            Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0xffffffff);
        }
    }

    /**
     * 获取每帧允许的最大资源加载总数
     */
    Module.Common.getTotalResMaxLoadNum = function () {
        return Module.RealBIMWeb.GetTotalResMaxLoadNumPerFrame();
    }

    /**
     * 设置网络资源加载是否使用缓存
     * @param {Number} isUse //使用缓存状态
     */
    Module.Common.setUseWebCache = function (isUse) {
        Module.RealBIMWeb.SetUseWebCache(isUse);
    }

    /**
     * 获取网络资源加载是否使用缓存
     */
    Module.Common.getUseWebCache = function () {
        return Module.RealBIMWeb.GetUseWebCache();
    }


    // MARK 渲染效果


    /**
     * 设置边缘高光效果的启用状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setBorderEmisEnable = function (enable) {
        Module.RealBIMWeb.SetHugeModelBorderEmisEnable(enable);
    }

    /**
     * 获取边缘高光效果的启用状态
     */
    Module.Common.getBorderEmisEnable = function () {
        return Module.RealBIMWeb.GetHugeModelBorderEmisEnable();
    }

    /**
     * 设置阴影开关状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setShadowState = function (enable) {
        var sinfo = Module.RealBIMWeb.GetSceShadowInfo();
        sinfo.m_bShadowEnable = enable;
        Module.RealBIMWeb.SetSceShadowInfo(sinfo);
    }

    /**
     * 获取当前阴影开关状态
     */
    Module.Common.getShadowState = function () {
        var shadowinfo = Module.RealBIMWeb.GetSceShadowInfo();
        return shadowinfo.m_bShadowEnable;
    }

    /**
     * 设置场景光晕开关状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setGhostState = function (enable) {
        var sinfo = Module.RealBIMWeb.GetSceLightInfo();
        if (enable) { sinfo.m_fGhostAmp = 0.5; } else { sinfo.m_fGhostAmp = 0; }
        Module.RealBIMWeb.SetSceLightInfo(sinfo);
    }

    /**
     * 获取当前场景光晕开关状态
     */
    Module.Common.getGhostState = function () {
        var ghostinfo = Module.RealBIMWeb.GetSceLightInfo();
        var _info = (ghostinfo.m_fGhostAmp == 0) ? 0 : 1;
        return _info;
    }

    /**
     * 设置场景环境遮蔽开关状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setAOState = function (enable) {
        var _info = Module.RealBIMWeb.GetSceAOInfo();
        if (enable) { _info.m_fMinLum = 0.1; } else { _info.m_fMinLum = 1.0; }
        Module.RealBIMWeb.SetSceAOInfo(_info);
    }

    /**
     * 获取当前场景环境遮蔽开关状态
     */
    Module.Common.getAOState = function () {
        var _info = Module.RealBIMWeb.GetSceAOInfo();
        return (_info.m_fMinLum < 0.999) ? true : false;
    }

    /**
     * 设置场景实时反射开关状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setReflState = function (enable) {
        var _info = Module.RealBIMWeb.GetSceReflInfo();
        if (enable) { _info.m_uQuality = 1; } else { _info.m_uQuality = 0; }
        Module.RealBIMWeb.SetSceReflInfo(_info);
    }

    /**
     * 获取当前场景实时反射开关状态
     */
    Module.Common.getReflState = function () {
        var _info = Module.RealBIMWeb.GetSceReflInfo();
        return (_info.m_uQuality > 0) ? true : false;
    }

    /**
     * 设置场景OIT渲染等级
     * @param {Boolean} level //等级(0->关闭OIT；1->UI开启；2->场景矢量开启1；3->模型开启；4->场景矢量开启2)
     */
    Module.Common.setSceOITLev = function (level) {
        Module.RealBIMWeb.SetSceOITLev(level);
    }

    /**
     * 获取场景OIT渲染等级
     */
    Module.Common.getSceOITLev = function () {
        return Module.RealBIMWeb.GetSceOITLev();
    }

    /**
     * 获取当前的渲染元素属性状态数据
     */
    Module.Common.getCurRenderStateData = function () {
        return new Uint8Array(Module.RealBIMWeb.GetSysRenderState());
    }

    /**
     * 根据元素属性状态数据设置当前渲染的属性状态
     * @param {Uint8Array} renderData //渲染的元素属性状态数据
     */
    Module.Common.setCurRenderStateData = function (renderData) {
        var strrenderdata = renderData.byteLength.toString();
        Module.RealBIMWeb.ReAllocHeapViews(strrenderdata); data = Module.RealBIMWeb.GetHeapView_U8(0);
        data.set(renderData, 0);
        Module.RealBIMWeb.SetSysRenderState(data.byteLength, data.byteOffset);
    }


    class REShadowInfo {
        constructor() {
            this.enable = null;//表示是否启用阴影效果
            this.quality = null;//表示阴影质量等级(0~5)
            this.dynSMSize = null;//表示动态阴影图的尺寸
            this.staticSMSize = null;//表示静态阴影图的尺寸
            this.maxDynSMNum = null;//表示动态阴影图的最大个数
            this.maxStaticSMNum = null;//表示静态阴影图的最大个数
            this.minDynSMUpdateLen = null;//表示动态阴影图的最小更新帧间隔
            this.minStaticSMUpdateLen = null;//表示静态阴影图的最小更新帧间隔
            this.hiResoDist = null;//表示最高精度阴影的作用距离
            this.filterKernelSize = null;//表示软阴影的过滤半径相对于阴影图一个纹素尺寸的倍数
            this.depthBiasRatio = null;//表示阴影深度的偏移比例(用以消除自阴影)
        }
    }
    ExtModule.REShadowInfo = REShadowInfo;

    /**
     * 设置阴影详细信息
     * @param {REShadowInfo} shadowInfo //阴影信息 (REShadowInfo 类型)
     */
    Module.Common.setShadowInfo = function (shadowInfo) {
        if (isEmptyLog(shadowInfo)) return
        var _shadowInfoTemp = {
            m_bShadowEnable: isEmpty(shadowInfo.enable) ? true : shadowInfo.enable,
            m_uShadowQuality: isEmpty(shadowInfo.quality) ? 3 : shadowInfo.quality,
            m_uShadowDynSMSize: isEmpty(shadowInfo.dynSMSize) ? 1024 : shadowInfo.dynSMSize,
            m_uShadowStaticSMSize: isEmpty(shadowInfo.staticSMSize) ? 1024 : shadowInfo.staticSMSize,
            m_uShadowMaxDynSMNum: isEmpty(shadowInfo.maxDynSMNum) ? 3 : shadowInfo.maxDynSMNum,
            m_uShadowMaxStaticSMNum: isEmpty(shadowInfo.maxStaticSMNum) ? 5 : shadowInfo.maxStaticSMNum,
            m_uShadowMinDynSMUpdateLen: isEmpty(shadowInfo.minDynSMUpdateLen) ? 1 : shadowInfo.minDynSMUpdateLen,
            m_uShadowMinStaticSMUpdateLen: isEmpty(shadowInfo.minStaticSMUpdateLen) ? 1 : shadowInfo.minStaticSMUpdateLen,
            m_dShadowHiResoDist: isEmpty(shadowInfo.hiResoDist) ? 6.1 : shadowInfo.hiResoDist,
            m_dShadowFilterKernelSize: isEmpty(shadowInfo.filterKernelSize) ? 2.0 : shadowInfo.filterKernelSize,
            m_dDepthBiasRatio: isEmpty(shadowInfo.depthBiasRatio) ? 0.001 : shadowInfo.depthBiasRatio,
        };
        Module.RealBIMWeb.SetSceShadowInfo(_shadowInfoTemp);
    }

    /**
     * 获取当前阴影详细信息
     */
    Module.Common.getShadowInfo = function () {
        var _shadowInfoTemp = Module.RealBIMWeb.GetSceShadowInfo();
        var shadowInfo = new REShadowInfo();
        shadowInfo.enable = _shadowInfoTemp.m_bShadowEnable;
        shadowInfo.quality = _shadowInfoTemp.m_uShadowQuality;
        shadowInfo.dynSMSize = _shadowInfoTemp.m_uShadowDynSMSize;
        shadowInfo.staticSMSize = _shadowInfoTemp.m_uShadowStaticSMSize;
        shadowInfo.maxDynSMNum = _shadowInfoTemp.m_uShadowMaxDynSMNum;
        shadowInfo.maxStaticSMNum = _shadowInfoTemp.m_uShadowMaxStaticSMNum;
        shadowInfo.minDynSMUpdateLen = _shadowInfoTemp.m_uShadowMinDynSMUpdateLen;
        shadowInfo.minStaticSMUpdateLen = _shadowInfoTemp.m_uShadowMinStaticSMUpdateLen;
        shadowInfo.hiResoDist = _shadowInfoTemp.m_dShadowHiResoDist;
        shadowInfo.filterKernelSize = _shadowInfoTemp.m_dShadowFilterKernelSize;
        shadowInfo.depthBiasRatio = _shadowInfoTemp.m_dDepthBiasRatio;
        return shadowInfo;
    }

    /**
     * 获取整个场景的包围盒（BIM + Grid）
     */
    Module.Common.getSceBV = function () {
        var gridBV = Module.RealBIMWeb.GetUnVerHugeGroupBoundingBox("", "");
        var bimBV = Module.RealBIMWeb.GetHugeObjBoundingBox("", "");

        var newBV = [];
        //栅格和bim 求总包围盒合集 如果类型不存在，引擎会返回无效包围盒，即最小值填在最大值位置上，求和集不影响
        var newMinX = Math.min(gridBV[0][0], bimBV[0][0]);
        var newMinY = Math.min(gridBV[0][1], bimBV[0][1]);
        var newMinZ = Math.min(gridBV[0][2], bimBV[0][2]);
        var newMaxX = Math.max(gridBV[1][0], bimBV[1][0]);
        var newMaxY = Math.max(gridBV[1][1], bimBV[1][1]);
        var newMaxZ = Math.max(gridBV[1][2], bimBV[1][2]);
        newBV = [newMinX, newMaxX, newMinY, newMaxY, newMinZ, newMaxZ];
        return newBV;
    }










    // MARK 字体

    class REFontInfo {
        constructor() {
            this.fontId = null;//自定义的全局字体的id，不可重复
            this.fontType = null;//字体的逻辑类型名,系统目前支持的类型名为："宋体"
            this.width = null;//字体的宽
            this.height = null;//字体的高
            this.weight = null;//字体的粗细，0表示默认粗细； ==0：原始粗细，<0：文字变细，>0：文字变粗
        }
    }
    ExtModule.REFontInfo = REFontInfo;

    /**
     * 增加一种全局字体
     * @param {REFontInfo} fontInfo //字体信息
     */
    Module.Common.addGolFont = function (fontInfo) {
        if (isEmptyLog(fontInfo, 'fontInfo')) return;
        if (isEmptyLog(fontInfo.fontId, 'fontId')) return;

        var _fontinfo = {
            m_bAntialiased: false,
            m_fItalicRatio: 0,
            m_sSilhouetteAmp: -64,
            m_sWeightAmp: fontInfo.weight * 64,
            m_uHeight: fontInfo.height,
            m_uWidth: fontInfo.width,
            m_strFontType: "宋体",
            m_strGolFontID: fontInfo.fontId.toString(),
            m_strTexAtlasName: ""
        };
        return Module.RealBIMWeb.AddAGolFont(_fontinfo);
    }

    /**
     * 获取一种全局字体信息
     * @param {String} fontId //字体id
     */
    Module.Common.getGolFont = function (fontId) {
        if (isEmptyLog(fontId, 'fontId')) return;
        var _golfontInfo = Module.RealBIMWeb.GetAGolFont(fontId.toString());
        var fontInfo = new REFontInfo();
        fontInfo.fontId = _golfontInfo.m_strGolFontID;
        fontInfo.fontType = _golfontInfo.m_strFontType;
        fontInfo.width = _golfontInfo.m_uWidth;
        fontInfo.height = _golfontInfo.m_uHeight;
        fontInfo.weight = _golfontInfo.m_sWeightAmp / 64;
        return fontInfo;
    }

    /**
     * 删除一种全局字体
     * @param {String} fontId //字体id
     */
    Module.Common.delGolFont = function (fontId) {
        if (isEmptyLog(fontId, 'fontId')) return;
        return Module.RealBIMWeb.DelAGolFont(fontId.toString());
    }

    /**
     * 获取全局字体数量
     */
    Module.Common.getGolFontNum = function () {
        return Module.RealBIMWeb.GetGolFontNum();
    }

    /**
     * 获取全部全局字体信息
     */
    Module.Common.getAllGolFont = function () {
        var _fontList = Module.RealBIMWeb.GetAllGolFonts();
        var fontInfoList = [];
        for (let i = 0; i < _fontList.size(); i++) {
            let _fontInfo = _fontList.get(i);
            let fontInfo = new REFontInfo();
            fontInfo.fontId = _fontInfo.m_strGolFontID;
            fontInfo.fontType = _fontInfo.m_strFontType;
            fontInfo.texAtlasName = _fontInfo.m_strTexAtlasName;
            fontInfo.width = _fontInfo.m_uWidth;
            fontInfo.height = _fontInfo.m_uHeight;
            fontInfo.weight = _fontInfo.m_sWeightAmp / 64;
            fontInfo.weightAmp = _fontInfo.m_sWeightAmp;
            fontInfo.italicRatio = _fontInfo.m_fItalicRatio;
            fontInfo.silhouetteAmp = _fontInfo.m_sSilhouetteAmp;
            fontInfo.antialiased = _fontInfo.m_bAntialiased;
            fontInfoList.push(fontInfo);
        }
        return fontInfoList;
    }







    // MOD-- 模型加载（Model）
    Module.Model = typeof Module.Model !== "undefined" ? Module.Model : {};//增加 Model 模块

    /**
     * 加载数据集资源
     * @param {Boolean} clearLoaded //是否清除掉已经加载好的项目
     * @param {Array} dataSetList //数据集集合  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
     * @param {String} dataSetId //数据集的唯一标识名，不能为空不可重复，重复前边的数据集会被自动覆盖
     * @param {String} resourcesAddress //数据集资源包地址
     * @param {Boolean} useTransInfo //表示该项目是否需要调整位置，默认false
     * @param {Array} transInfo //项目的偏移信息，依次为缩放、旋转（四元数）、平移
     * @param {Number} minLoadDist //项目模型的最小加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
     * @param {Number} maxLoadDist //项目模型的最大加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载；
     * @param {String} dataSetCRS //当前子项的坐标系标识
     * @param {Number} dataSetCRSNorth //当前子项的项目北与正北方向的夹角（右手坐标系，逆时针为正）dataSetCRS 为空时此参数无定意义
     * @param {Boolean} useAssginVer  //表示是否加载指定版本，默认 false
     * @param {String} assginVer //指定版本号，加载指定版本的时候，会用此版本号
     * @param {Boolean} useAssginVer2  //表示是否加载指定版本2，默认 false
     * @param {String} assginVer2 //指定版本号2，加载指定版本的时候，会用此版本号
     * @param {Number} dividePrior //项目内模型的细分优先级(值越小优先级越高)
     * @param {dvec3} engineOrigin //表示项目局部空间的原点在项目参考坐标系dataSetCRS下的坐标（dataSetCRS为空时无定义）
     */
    Module.Model.loadDataSet = function (dataSetList, clearLoaded) {
        if (isRepeat(dataSetList, 'dataSetId')) {
            console.error('【REError】: dataSetId 唯一标识名，不能为空不可重复');
            return;
        }
        let count = dataSetList.length;
        for (let i = 0; i < count; i++) {
            let dataSetModel = dataSetList[i];
            var _deftransinfo = [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]]; if (dataSetModel.useTransInfo) _deftransinfo = dataSetModel.transInfo;
            var _useCamPost = false;
            var _minLoadDist = 1e30; if (!isEmpty(dataSetModel.minLoadDist)) _minLoadDist = dataSetModel.minLoadDist;
            var _maxLoadDist = 1e30; if (!isEmpty(dataSetModel.maxLoadDist)) _maxLoadDist = dataSetModel.maxLoadDist;
            var _projCRS = ""; if (!isEmpty(dataSetModel.dataSetCRS)) _projCRS = dataSetModel.dataSetCRS;
            var _projNorth = 0.0; if (!isEmpty(dataSetModel.dataSetCRSNorth)) _projNorth = dataSetModel.dataSetCRSNorth;
            var _defMainProjCamFile = "";
            var _dividePrior = isEmpty(dataSetModel.dividePrior) ? 1.0 : dataSetModel.dividePrior;
            var _originCRS = isEmpty(dataSetModel.engineOrigin) ? [0.0, 0.0, 0.0] : dataSetModel.engineOrigin;
            var _isMainProj = ((((typeof clearLoaded == 'undefined') || clearLoaded) && (i == 0)) ? true : false);
            var intprojid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetModel.dataSetId);
            var _ver = {
                m_sVer0: 0x7fffffff,
                m_sVer1: -1,
                m_uVer0GolIDBias_L32: 0,
                m_uVer0GolIDBias_H32: 0,
                m_uVer1GolIDBias_L32: 0,
                m_uVer1GolIDBias_H32: 0
            };
            if (dataSetModel.useAssginVer) {
                _ver.m_sVer0 = dataSetModel.assginVer; _ver.m_uVer0GolIDBias_H32 = intprojid;
            }
            if (dataSetModel.useAssginVer2) {
                _ver.m_sVer1 = dataSetModel.assginVer2; _ver.m_uVer1GolIDBias_H32 = intprojid;
            }
            Module.RealBIMWeb.LoadMainSceExt(
                dataSetModel.dataSetId,
                _isMainProj,
                _projCRS, _projNorth,
                dataSetModel.resourcesAddress + "/total.xml",
                _deftransinfo[0], _deftransinfo[1], _deftransinfo[2],
                _minLoadDist, _maxLoadDist,
                "",
                _defMainProjCamFile, _useCamPost,
                _dividePrior, _originCRS,
            );
            Module.RealBIMWeb.SetSceVersionInfoExt(dataSetModel.dataSetId, _ver);
        }

    }

    /**
     * 获取当前加载的所有数据集id
     */
    Module.Model.getAllDataSetId = function () {
        var tempArr = Module.RealBIMWeb.GetAllMainSceNames();
        var nameArr = [];
        for (i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    }


    /**
     * 卸载一个数据集
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Model.unloadDataSet = function (dataSetId) {
        Module.RealBIMWeb.UnLoadMainSce(dataSetId);
    }

    /**
     * 卸载所有数据集
     */
    Module.Model.unloadAllDataSet = function () {
        var tempArr = Module.RealBIMWeb.GetAllMainSceNames();
        for (i = 0; i < tempArr.size(); ++i) {
            var tempProjName = tempArr.get(i);
            Module.RealBIMWeb.UnLoadMainSce(tempProjName);
        }
    }

    /**
     * 刷新所有数据集模型
     * @param {Boolean} loadNewData //表示刷新主体数据后是否允许重新加载数据
     */
    Module.Model.refreshAllDataSet = function (loadNewData) {
        Module.RealBIMWeb.RefreshMainData(loadNewData);
    }

    /**
     * 获取项目所有数据集加载状态
     */
    Module.Model.getAllDataSetReady = function () {
        return Module.RealBIMWeb.IsMainSceReady();
    }

    /**
     * 获取指定数据集加载状态
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Model.getDataSetReady = function (dataSetId) {
        return Module.RealBIMWeb.IsMainSceAllResLoaded(dataSetId);
    }








    // MOD-- 相机（Camera）
    Module.Camera = typeof Module.Camera !== "undefined" ? Module.Camera : {};//增加 Camera 模块
    class RECamLoc {
        // 相机方位信息
        constructor() {
            this.camPos = null;//相机位置
            this.camRotate = [1e30, 1e30, 1e30, 1e30];//相机的朝向
            this.camDir = [1e30, 1e30, 1e30];//相机的朝向（欧拉角）
        }
    }
    ExtModule.RECamLoc = RECamLoc;

    class REForceCamLoc {
        // 相机方位信息
        constructor() {
            this.camPos = null;//相机位置
            this.camRotate = [1e30, 1e30, 1e30, 1e30];//相机的朝向
            this.camDir = [1e30, 1e30, 1e30];//相机的朝向（欧拉角）
            this.force = false;//是否强制相机初始方位
        }
    }
    ExtModule.REForceCamLoc = REForceCamLoc;

    /**
     * 获取当前加载的所有数据集id
     */
    Module.Camera.getCamLocate = function () {
        var camLoc = new RECamLoc();
        var _camLoc01 = Module.RealBIMWeb.GetCamLocation();
        var _camLoc02 = Module.RealBIMWeb.GetCamLocation_Dir();
        camLoc.camPos = _camLoc01.m_vCamPos;
        camLoc.camRotate = _camLoc01.m_qCamRotate;
        camLoc.camDir = _camLoc02.m_qCamDir;
        return camLoc;
    }

    // MARK 设置
    /**
     * 调整相机到目标方位
     * @param {RECamLoc} camLoc //相机方位信息
     * @param {Number} locDelay //转动相机前的延时时间（秒）默认0
     * @param {Number} locTime //相机的运动速度（秒） 默认1.0
     */
    Module.Camera.setCamLocateTo = function (camLoc, locDelay, locTime) {
        if (isEmptyLog(camLoc, "camLoc")) return;
        if (isEmptyLog(camLoc.camPos, "camPos")) return;

        var _delay = 0; if (!isEmpty(locDelay)) _delay = locDelay;
        var _time = 1.0; if (!isEmpty(locTime)) _time = locTime;
        if (camLoc.camRotate[0] != 1e30) {
            Module.RealBIMWeb.LocateCamTo(camLoc.camPos, camLoc.camRotate, _delay, _time);
            return;
        }
        if (camLoc.camDir[0] != 1e30) {
            Module.RealBIMWeb.LocateCamTo_Dir(camLoc.camPos, camLoc.camDir, _delay, _time);
        }
    }

    /**
     * 设置固定当前的相机方位（BIM相机）
     */
    Module.Camera.setFixCurCam = function () {
        Module.RealBIMWeb.IsFixMainCam(true);
    }

    /**
     * 调整相机到默认视角方位
     * @param {RECamDirEm} locType //表示26个方向 RECamDirEm 枚举值
     * @param {Boolean} scanAllDataSet //是否定位到整个数据集，默认true，true表示定位到整个场景，false表示相机原地调整方向
     */
    Module.Camera.setCamLocateDefault = function (locType, scanAllDataSet) {
        if (isEmptyLog(locType, "locType")) return;
        var _bScanAllSce = true; if (!isEmpty(scanAllDataSet)) _bScanAllSce = scanAllDataSet;
        if (locType === RECamDirEm.CAM_DIR_DEFAULT) {
            Module.RealBIMWeb.RestoreCamLocation();
        } else {
            var enumEval = eval(locType);
            Module.RealBIMWeb.ResetCamToTotalSce(enumEval, _bScanAllSce);
        }
    }

    /**
     * 调整相机方位到对准构件集合
     * @param {RECamDirEm} locType //相机朝向 RECamDirEm 枚举值
     * @param {Number} backDepth //相机后退强度（如果相机距离构件太近或太远，都可以通过此参数调整）
     * @param {Array} locIDList //目标ID集合 包含  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {Array} elemIdList //构件的标识名 集合
     */
    Module.Camera.setCamLocateToElem = function (locIDList, backDepth, locType) {
        if (isEmptyLog(locIDList, "locIDList")) return;
        var obj_s = 0;
        var _offset = 0;
        for (var i = 0; i < locIDList.length; ++i) {
            obj_s += locIDList[i].elemIdList.length;
        }
        var _s01 = (obj_s * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01); _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (var i = 0; i < locIDList.length; ++i) {
            var dataSetId = locIDList[i].dataSetId;
            var projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var tempobjarr = locIDList[i].elemIdList;
            for (var j = 0; j < tempobjarr.length; ++j) {
                var eleid = tempobjarr[j];
                _elemIds.set([eleid, projid], _offset);
                _offset += 2;
            }
        }
        var _locType = isEmpty(locType) ? eval(RECamDirEm.CAM_DIR_DEFAULT) : eval(locType);
        Module.RealBIMWeb.FocusCamToSubElems("", "", _elemIds.byteLength, _elemIds.byteOffset, backDepth, _locType);
    }

    /**
     * 调整相机定位到数据集
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {Number} backDepth //相机后退强度（如果相机距离构件太近或太远，都可以通过此参数调整）
     * @param {RECamDirEm} locType //相机朝向 RECamDirEm 枚举值
     */
    Module.Camera.setCamLocateToDataSet = function (dataSetId, backDepth, locType) {
        var _projname = ""; if (!isEmpty(dataSetId)) { _projname = dataSetId; }
        var _locType = isEmpty(locType) ? eval(RECamDirEm.CAM_DIR_DEFAULT) : eval(locType);
        Module.RealBIMWeb.FocusCamToSubElems(_projname, "", 0, 0, backDepth, _locType);
    }

    /**
     * 获取相机自动动画启用状态
     */
    Module.Camera.getAutoCamAnimEnable = function () {
        return Module.RealBIMWeb.GetAutoCamAnimEnable();
    }

    /**
     * 设置相机自动动画参数
     * @param {dvec3} point //自动旋转的参考中心点坐标，数组形式[x,y,z]
     * @param {Boolean} speed //旋转一周所用时间，单位为秒
     * @param {Boolean} rotateEnable //是否开启自动旋转
     */
    Module.Camera.setAutoCamAnimParams = function (point, speed, rotateEnable) {
        var _dRotSpeed = 2 * 3.1415 / speed;
        Module.RealBIMWeb.SetAutoCamAnimParams(point, _dRotSpeed);
        Module.RealBIMWeb.SetAutoCamAnimEnable(rotateEnable);
    }

    /**
     * 重置相机方位
     */
    Module.Camera.resetCamLocate = function () {
        Module.RealBIMWeb.RestoreCamLocation();
    }

    /**
     * 设置相机位置的世界空间范围
     * @param {Array} arrCamBound //表示相机的移动范围，[[Xmin、Ymin、Zmin],[Xmax、Ymax、Zmax]]
     */
    Module.Camera.setCamBound = function (arrCamBound) {
        Module.RealBIMWeb.SetCamBound(arrCamBound);
    }

    /**
     * 获取相机位置的世界空间范围
     */
    Module.Camera.getCamBound = function () {
        return Module.RealBIMWeb.GetCamBound();
    }

    /**
     * 重置相机位置的默认世界空间范围
     */
    Module.Camera.resetCamBound = function () {
        Module.RealBIMWeb.SetCamBound([[-1e30, -1e30, -1e30], [1e30, 1e30, 1e30]]);
    }

    /**
     * 设置相机的强制近裁面/远裁面
     * @param {Array} arrNearFar //二维数组[强制近裁面,强制远裁面](小于0表示使用资源中的设置；0~1e37表示强制使用指定值；大于1e37表示强制使用自动计算值)
     */
    Module.Camera.setCamForcedNearFar = function (arrNearFar) {
        Module.RealBIMWeb.SetCamForcedZNearFar(arrNearFar);
    }

    /**
     * 获取相机的强制近裁面/远裁面
     */
    Module.Camera.getCamForcedNearFar = function () {
        return Module.RealBIMWeb.GetCamForcedZNearFar();
    }

    /**
     * 设置相机朝向是否允许头朝下
     * @param {Boolean} enable //是否允许
     */
    Module.Camera.setCamUpsideDown = function (enable) {
        Module.RealBIMWeb.SetCamUpsideDown(enable);
    }

    /**
     * 获取相机朝向是否允许头朝下
     */
    Module.Camera.getCamUpsideDown = function () {
        return Module.RealBIMWeb.GetCamUpsideDown();
    }

    /**
     * 设置当相机运动或模型运动时是否偏向于渲染流畅性
     * @param {Boolean} prefer //是否偏向
     */
    Module.Camera.setCamPreferFPS = function (prefer) {
        Module.RealBIMWeb.SetPreferFPS(prefer);
    }

    /**
     * 获取当相机运动或模型运动时是否偏向于渲染流畅性
     */
    Module.Camera.getCamPreferFPS = function () {
        return Module.RealBIMWeb.GetPreferFPS();
    }

    /**
     * 设置主场景相机的投影类型
     * @param {Number} type //是否偏向
     */
    Module.Camera.setCamType = function (type) {
        Module.RealBIMWeb.SetCamProjType(type);
    }

    /**
     * 获取主场景相机的投影类型
     */
    Module.Camera.getCamType = function () {
        return Module.RealBIMWeb.GetCamProjType();
    }

    /**
     * 设置相机的强制初始方位 （可以在加载模型之前设置）
     * @param {REForceCamLoc} forceCamLoc //强制相机方位信息
     */
    Module.Camera.setCamForcedInitLoc = function (forceCamLoc) {
        if (isEmptyLog(forceCamLoc, "forceCamLoc")) return false;
        if (isEmptyLog(forceCamLoc.camPos, "camPos")) return false;
        if (isEmpty(forceCamLoc.camRotate) && isEmpty(forceCamLoc.camDir)) return false;

        var _force = isEmpty(forceCamLoc.force) ? false : forceCamLoc.force;

        if (forceCamLoc.camRotate[0] != 1e30) {
            return Module.RealBIMWeb.SetCamForcedInitLoc(_force, forceCamLoc.camPos, forceCamLoc.camRotate);
        }
        if (forceCamLoc.camDir[0] != 1e30) {
            var _camLocConv = Module.RealBIMWeb.GetCamLocConvert(forceCamLoc.camPos, forceCamLoc.camDir);
            return Module.RealBIMWeb.SetCamForcedInitLoc(_force, forceCamLoc.camPos, _camLocConv.m_qCamRotate);
        }
    }

    /**
     * 获取相机的强制初始方位信息
     */
    Module.Camera.getCamForcedInitLoc = function () {
        var _forceInitLoc = Module.RealBIMWeb.GetCamForcedInitLoc();
        var _camLocConv = Module.RealBIMWeb.GetCamLocConvert_Dir(_forceInitLoc.m_vCamPos, _forceInitLoc.m_qCamRotate);
        var forceCamLoc = new REForceCamLoc();
        forceCamLoc.force = _forceInitLoc.m_bForce;
        forceCamLoc.camPos = _forceInitLoc.m_vCamPos;
        forceCamLoc.camRotate = _forceInitLoc.m_qCamRotate;
        forceCamLoc.camDir = _camLocConv.m_qCamDir;
        return forceCamLoc;
    }

    /**
     * 获取相机在自由移动模式下的速度
     */
    Module.Camera.getFreeCamMoveSpeed = function () {
        return Module.RealBIMWeb.GetFreeCamMoveSpeed();
    }

    /**
     * 设置相机在自由移动模式下的速度
     * @param {Number} speed //速度
     */
    Module.Camera.setFreeCamMoveSpeed = function (speed) {
        Module.RealBIMWeb.SetFreeCamMoveSpeed(speed);
    }

    class REGisCamLoc {
        // gis相机方位信息
        constructor() {
            this.lon = 0;//经度
            this.lat = 0;//纬度
            this.height = 0;//高程
            this.heading = 0;//
            this.pitch = 0;//
            this.roll = 0;//
        }
    }
    ExtModule.REGisCamLoc = REGisCamLoc;

    /**
     * 获取gis相机在目标坐标下转换的相机数据
     * @param {String} srcCRS //表示源坐标系描述符
     * @param {String} destCRS //表示目标坐标系描述符
     * @param {REGisCamLoc} gisCamLoc //gis相机信息
     */
    Module.Camera.getCamLocByGISCoord = function (srcCRS, destCRS, gisCamLoc) {
        var _vGISCoord = [gisCamLoc.lon, gisCamLoc.lat, gisCamLoc.height, 0];
        var _vCamRotEuler = [gisCamLoc.heading, gisCamLoc.pitch, gisCamLoc.roll];
        var _camLoc = Module.RealBIMWeb.GetCamLocByGISCoord(srcCRS, destCRS, _vGISCoord, _vCamRotEuler);
        var _camLocConv = Module.RealBIMWeb.GetCamLocConvert_Dir(_camLoc.m_vCamPos, _camLoc.m_qCamRotate);

        var camLoc = new RECamLoc();
        camLoc.camPos = _camLoc.m_vCamPos;
        camLoc.camRotate = _camLoc.m_qCamRotate;
        camLoc.camDir = _camLocConv.m_qCamDir;
        return camLoc;
    }

    /**
     * 获取引擎相机在目标坐标下转换的gis相机数据
     * @param {String} srcCRS //表示源坐标系描述符
     * @param {String} destCRS //表示目标坐标系描述符
     * @param {RECamLoc} camLoc //相机信息
     */
    Module.Camera.getGISCoordByCamLoc = function (srcCRS, destCRS, camLoc) {
        var _camLoc = Module.RealBIMWeb.GetGISCoordByCamLoc(srcCRS, destCRS, camLoc.camPos, camLoc.camRotate);

        var gisCamLoc = new REGisCamLoc();
        gisCamLoc.lon = _camLoc.m_vCamPos[0];
        gisCamLoc.lat = _camLoc.m_vCamPos[1];
        gisCamLoc.height = _camLoc.m_vCamPos[2];
        gisCamLoc.heading = _camLoc.m_qCamDir[2];
        gisCamLoc.pitch = _camLoc.m_qCamDir[0];
        gisCamLoc.roll = _camLoc.m_qCamDir[1];
        return gisCamLoc;
    }

    /**
     * 获取当前相机的控制模式
     */
    Module.Camera.getCamMode = function () {
        return Module.RealBIMWeb.GetCamMode();
    }






    // MARK 碰撞检测
    /**
     * 获取碰撞检测的开启状态
     */
    Module.Camera.getCamCollideState = function () {
        return Module.RealBIMWeb.GetCamCollideState();
    }

    /**
     * 设置碰撞检测的开启状态
     * @param {Boolean} enable //是否开启
     */
    Module.Camera.setCamCollideState = function (enable) {
        Module.RealBIMWeb.SetCamCollideState(enable);
    }



    // MARK 重力模拟
    /**
     * 获取重力模拟的开启状态
     */
    Module.Camera.getCamGravityState = function () {
        return Module.RealBIMWeb.GetCamGravityState();
    }

    /**
     * 设置重力模拟的开启状态
     * @param {Boolean} enable //是否开启
     */
    Module.Camera.setCamGravityState = function (enable) {
        Module.RealBIMWeb.SetCamGravityState(enable);
    }

    /**
     * 获取重力模拟时的相机高度
     */
    Module.Camera.getCamGravityHeight = function () {
        return Module.RealBIMWeb.GetCamHeightOnGravOpen();
    }

    /**
     * 设置重力模拟时的相机高度
     * @param {Number} height //高度
     */
    Module.Camera.setCamGravityHeight = function (height) {
        Module.RealBIMWeb.SetCamHeightOnGravOpen(height);
    }













    // MOD-- 天空盒（SkyBox）
    Module.SkyBox = typeof Module.SkyBox !== "undefined" ? Module.SkyBox : {};//增加 SkyBox 模块

    class RESkyInfo {
        //天空信息
        constructor() {
            this.skyTexPaths = null;//天空盒图片路径，字符串数组，顺序分别为X+、X-、Z+、Z-、Y+、Y-，
            this.sunMode = 1;//光照模式 0：表示默认没有太阳 1：使用天空盒自带的太阳/月亮 2：根据光照方向arrSunDir自动生成太阳
            this.sunDir = null;//光源方向，设置方法为，将太阳放置屏幕空间中心位置，通过REgetCamLocationDir接口获取当前的相机方向m_qCamDir，取反即可，例如：获取到的方向m_qCamDir为[-0.59, -0.62, 0.5]，则此参数填[0.59, 0.62, -0.5]即可
            this.isNight = false;//表示是否晚上，true表示晚上，false表示白天
            this.exposeScale = 1.0;//曝光度，大于0，默认设为1即可，值越大，场景越亮
        }
    }
    ExtModule.RESkyInfo = RESkyInfo;


    /**
     * 设置天空的启用状态
     * @param {Boolean} enable //是否启用
     */
    Module.SkyBox.setEnable = function (enable) {
        Module.RealBIMWeb.SetSkyEnable(enable);
    }

    /**
     * 获取天空的启用状态
     */
    Module.SkyBox.getEnable = function () {
        return Module.RealBIMWeb.GetSkyEnable();
    }

    /**
     * 设置天空盒的背景颜色
     * @param {REColor} color //颜色
     */
    Module.SkyBox.setBackClr = function (color) {
        if (isEmptyLog(color, "color")) return;
        var _red = color.red / 255.0;
        var _green = color.green / 255.0;
        var _blue = color.blue / 255.0;
        var clrarr = [_red, _green, _blue];
        Module.RealBIMWeb.SetBackColor(clrarr);
    }

    /**
     * 获取天空盒的背景颜色
     */
    Module.SkyBox.getBackClr = function () {
        var _clrarr = Module.RealBIMWeb.GetBackColor();
        var color = new REColor();
        color.red = Math.round(_clrarr[0] * 255);
        color.green = Math.round(_clrarr[1] * 255);
        color.blue = Math.round(_clrarr[2] * 255);
        return color;
    }

    /**
     * 设置天空盒的相关信息
     * @param {RESkyInfo} skyInfo //天空信息
     */
    Module.SkyBox.setSkyInfo = function (skyInfo) {
        if (isEmptyLog(skyInfo, "skyInfo")) return;
        if (isEmptyLog(skyInfo.skyTexPaths, "skyTexPaths")) return;
        var _sunMode = 1; if (!isEmpty(skyInfo.sunMode)) _sunMode = skyInfo.sunMode;
        var _sunDir = [0.59215283, 0.63194525, -0.50000012];
        if (!isEmpty(skyInfo.sunDir)) {
            var v01 = skyInfo.sunDir[0]; if (v01 == 0) v01 = 0.00001;
            var v02 = skyInfo.sunDir[1]; if (v02 == 0) v02 = 0.00001;
            var v03 = skyInfo.sunDir[2];
            //光照方向Z不能为从下向上，故不能为正值
            if (v03 == 0) {
                v03 = -0.00001;
            } else if (v03 > 0) {
                v03 = v03 * -1;
            }
            _sunDir = [v01, v02, v03];
        }
        var _isNight = false; if (!isEmpty(skyInfo.isNight)) _isNight = skyInfo.isNight;
        var _exposeScale = 1.0; if (!isEmpty(skyInfo.exposeScale)) _exposeScale = skyInfo.exposeScale;

        var pathTemps = new Module.RE_Vector_Str();
        for (let i = 0; i < skyInfo.skyTexPaths.length; i++) {
            pathTemps.push_back(skyInfo.skyTexPaths[i]);
        }
        var _SkyInfo = {
            m_arrSkyTexPaths: pathTemps,
            m_bRightHand: true,
            m_bAutoSun: (_sunMode > 1) ? true : false,
            m_vDirectLDir: _sunDir,
            m_vAmbLightClr: [2.0, 2.0, 2.0],
            m_vDirLightClr: ((_sunMode > 0) ? (_isNight ? [1.0, 1.0, 1.0] : [8.0, 8.0, 8.0]) : [0.0, 0.0, 0.0]),
            m_fDynExposeAmp: _isNight ? _exposeScale * 0.1 : _exposeScale * 1.0,
            m_fDynExposeRange: 10.0
        };
        Module.RealBIMWeb.SetSkyInfo(_SkyInfo);
    }

    /**
     * 获取天空盒的相关信息
     */
    Module.SkyBox.getSkyInfo = function () {
        var _skyInfo = Module.RealBIMWeb.GetSkyInfo();
        var skyInfo = new RESkyInfo();
        var pathTemps = [];
        for (let i = 0; i < _skyInfo.m_arrSkyTexPaths.size(); i++) {
            pathTemps.push(_skyInfo.m_arrSkyTexPaths.get(i));
        }
        var _sunMode = _skyInfo.m_bAutoSun ? 2 : ((_skyInfo.m_vDirLightClr.toString() === [0, 0, 0].toString()) ? 0 : 1);
        var _isNight = (_skyInfo.m_vDirLightClr.toString() === [1, 1, 1].toString()) ? true : false;
        var _exposeScale = _isNight ? _skyInfo.m_fDynExposeAmp * 10 : _skyInfo.m_fDynExposeAmp;
        skyInfo.skyTexPaths = pathTemps;
        skyInfo.sunMode = _sunMode;
        skyInfo.sunDir = _skyInfo.m_vDirectLDir;
        skyInfo.isNight = _isNight;
        skyInfo.exposeScale = _exposeScale;
        return skyInfo;
    }

    /**
     * 获取天空盒的相关信息
     */
    Module.SkyBox.resetSkyInfo = function () {
        var defaultSkyInfo = new RESkyInfo();
        defaultSkyInfo.skyTexPaths = [
            "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang/skybox_default/picture/oasisday_right.jpg.dds",
            "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang/skybox_default/picture/oasisday_left.jpg.dds",
            "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang/skybox_default/picture/oasisday_front.jpg.dds",
            "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang/skybox_default/picture/oasisday_back.jpg.dds",
            "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang/skybox_default/picture/oasisday_top.jpg.dds",
            "https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=res_jifang/skybox_default/picture/oasisday_bottom.jpg.dds"
        ];
        console.log(defaultSkyInfo.skyTexPaths);
        defaultSkyInfo.sunMode = 1;
        defaultSkyInfo.sunDir = [0.59215283, 0.63194525, -0.50000012];
        defaultSkyInfo.isNight = false;
        defaultSkyInfo.exposeScale = 1.0;
        Module.SkyBox.setSkyInfo(defaultSkyInfo);
    }

    /**
     * 设置场景光源方向
     * @param {dvec3} sunDir //光源方向
     */
    Module.SkyBox.setLightLocate = function (sunDir) {
        if (isEmptyLog(sunDir, "sunDir")) return;
        var _lightInfo = Module.RealBIMWeb.GetSceLightInfo();
        _lightInfo.m_vDirectLDir = sunDir;
        Module.RealBIMWeb.SetSceLightInfo(_lightInfo);
    }

    /**
     * 获取当前场景光源方向
     */
    Module.SkyBox.getLightLocate = function () {
        return Module.RealBIMWeb.GetSceLightInfo().m_vDirectLDir;
    }

    /**
     * 设置天空大气散射激活状态
     * @param {Boolean} active //是否激活
     */
    Module.SkyBox.setSkyAtmActive = function (active) {
        Module.RealBIMWeb.SetSkyAtmActive(active);
    }

    /**
     * 获取天空大气散射激活状态
     */
    Module.SkyBox.getSkyAtmActive = function () {
        return Module.RealBIMWeb.GetSkyAtmActive();
    }

    /**
     * 设置天空大气散射的雾效强度
     * @param {Number} amp //强度，默认值为1，取值范围0~10
     */
    Module.SkyBox.setSkyAtmFogAmp = function (amp) {
        var _fAmp = 1.0; if (!isEmpty(amp)) _fAmp = Math.max(0, Math.min(amp, 10));
        Module.RealBIMWeb.SetSkyAtmFogAmp(_fAmp);
    }

    /**
     * 获取天空大气散射的雾效强度
     */
    Module.SkyBox.getSkyAtmFogAmp = function () {
        return Module.RealBIMWeb.GetSkyAtmFogAmp();
    }




    // MOD-- 坐标（Coordinate）
    Module.Coordinate = typeof Module.Coordinate !== "undefined" ? Module.Coordinate : {};//增加 Coordinate 模块

    class RELocInfo {
        constructor() {
            this.scale = null;//缩放
            this.rotate = null;//旋转
            this.offset = null;//平移
        }
    }
    ExtModule.RELocInfo = RELocInfo;

    /**
     * 增加一套地理信息坐标系
     * @param {String} name //坐标系的显示名称
     * @param {String} displayCRS //显示的坐标值的坐标参考系描述字符串
     */
    Module.Coordinate.addGeoCoord = function (name, displayCRS) {
        return Module.RealBIMWeb.AddGeoCoord(name, displayCRS);
    }

    /**
     * 增加一套自定义坐标系
     * @param {String} name //坐标系的显示名称
     * @param {Array} refPotList //表示引擎世界空间的4个标记点
     * @param {Array} targetPotList //表示与引擎世界空间4个标记点一一对应的自定义坐标系中的4个点
     */
    Module.Coordinate.addCustomCoord = function (name, refPotList, targetPotList) {
        if (isEmptyLog(name, "name")) return;
        if (isEmptyLog(refPotList, "refPotList")) return;
        if (isEmptyLog(targetPotList, "targetPotList")) return;
        var ref01 = refPotList[0]; var ref02 = refPotList[1]; var ref03 = refPotList[2]; var ref04 = refPotList[3];
        var target01 = targetPotList[0]; var target02 = targetPotList[1]; var target03 = targetPotList[2]; var target04 = targetPotList[3];
        return Module.RealBIMWeb.AddCustomCoord(name, ref01, ref02, ref03, ref04, target01, target02, target03, target04);
    }

    /**
     * 删除一套地理信息坐标
     * @param {String} name //坐标系的显示名称
     */
    Module.Coordinate.delGeoCoord = function (name) {
        return Module.RealBIMWeb.DelGeoCoordInfo(name);
    }

    /**
     * 设置某个项目的整体坐标偏移
     * @param {String} dataSetId //数据集标识
     * @param {RELocInfo} locInfo //表示偏移信息（RELocInfo 类型）
     */
    Module.Coordinate.setDataSetTransform = function (dataSetId, locInfo) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(locInfo, "locInfo")) return;

        var _scale = [1, 1, 1]; if (!isEmpty(locInfo.scale)) _scale = locInfo.scale;
        var _rotate = [0, 0, 0, 1]; if (!isEmpty(locInfo.rotate)) _rotate = locInfo.rotate;
        var _offset = [0, 0, 0,]; if (!isEmpty(locInfo.offset)) _offset = locInfo.offset;
        var _transinfo = {
            m_vScale: _scale, m_qRotate: _rotate, m_vOffset: _offset
        }
        return Module.RealBIMWeb.SetMainSceTransform(dataSetId, _transinfo);
    }

    /**
     * 获取某个项目的整体坐标偏移信息
     * @param {String} dataSetId //数据集标识
     */
    Module.Coordinate.getDataSetTransform = function (dataSetId) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        var _tranform = Module.RealBIMWeb.GetMainSceTransform(dataSetId);
        var locInfo = new RELocInfo();
        locInfo.scale = _tranform.m_vScale;
        locInfo.rotate = _tranform.m_qRotate;
        locInfo.offset = _tranform.m_vOffset;
        return locInfo;
    }

    /**
     * 设置引擎世界空间对应的坐标参考系信息
     * @param {String} worldCRS //表示引擎世界空间对应的坐标参考系描述符(标准PROJ坐标系字符串)，为空串表示无特殊地理信息坐标系
     */
    Module.Coordinate.setEngineWorldCRS = function (worldCRS) {
        return Module.RealBIMWeb.SetEngineWorldCRS(worldCRS);
    }

    /**
     * 获取引擎世界空间坐标系描述符
     */
    Module.Coordinate.getEngineWorldCRS = function () {
        var _info = Module.RealBIMWeb.GetEngineWorldCRS();
        return _info.m_strCRS;
    }

    /**
     * 在引擎世界空间坐标与目标地理信息坐标间进行转换
     * @param {Boolean} forward //转换顺序：true->由引擎世界空间坐标转换到目标地理信息坐标；false->由目标地理信息坐标转换到引擎世界空间坐标
     * @param {String} destCRS //表示目标坐标系描述符，当引擎坐标系描述符和目标坐标系描述符均为空时则坐标无需转换成功返回，否则任一描述符为空将导致转换失败
     * @param {Array} coordList //输入待转换的坐标数组
     */
    Module.Coordinate.getTransEngineCoords = function (forward, destCRS, coordList) {
        var _s = coordList.length; var _s01 = (_s * 24).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01); var temparr1 = Module.RealBIMWeb.GetHeapView_Double(0);
        for (i = 0; i < _s; ++i) {
            temparr1[i * 3 + 0] = coordList[i][0]; temparr1[i * 3 + 1] = coordList[i][1]; temparr1[i * 3 + 2] = coordList[i][2];
        }
        var temparr2 = [];
        var bool = Module.RealBIMWeb.TransEngineCoords(forward, destCRS, temparr1.byteLength, temparr1.byteOffset);
        if (bool) {
            var temparr3 = Module.RealBIMWeb.GetHeapView_Double(0);
            for (i = 0; i < _s; ++i) {
                temparr2.push([temparr3[i * 3 + 0], temparr3[i * 3 + 1], temparr3[i * 3 + 2]]);
            }
        }
        return temparr2;
    }

    /**
     * 进行任意两个标准地理信息坐标转换
     * @param {String} srcCRS //表示源坐标系描述符
     * @param {String} destCRS //表示目标坐标系描述符
     * @param {Array} coordList //输入待转换的坐标数组
     */
    Module.Coordinate.getTransGeoCoords = function (srcCRS, destCRS, coordList) {
        var _s = coordList.length; var _s01 = (_s * 32).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01); var temparr1 = Module.RealBIMWeb.GetHeapView_Double(0);
        for (i = 0; i < _s; ++i) {
            temparr1[i * 4 + 0] = coordList[i][0]; temparr1[i * 4 + 1] = coordList[i][1]; temparr1[i * 4 + 2] = coordList[i][2]; temparr1[i * 4 + 3] = coordList[i][3];
        }
        var temparr2 = [];
        var bool = Module.RealBIMWeb.TransGeoCoords(srcCRS, destCRS, temparr1.byteLength, temparr1.byteOffset);
        if (bool) {
            var temparr3 = Module.RealBIMWeb.GetHeapView_Double(0);
            for (i = 0; i < _s; ++i) {
                temparr2.push([temparr3[i * 4 + 0], temparr3[i * 4 + 1], temparr3[i * 4 + 2], temparr3[i * 4 + 3]]);
            }
        }
        return temparr2;
    }

    /**
     * 由世界空间坐标转换到屏幕空间坐标
     * @param {Array} worldPos //表示世界空间坐标
     * @param {Number} scaleDist //表示与worldPos关联的某对象在世界空间中的最小缩放距离
     */
    Module.Coordinate.getWorldPosToScreenPos = function (worldPos, scaleDist) {
        var _dScaleDist = 1e20; if (!isEmpty(scaleDist)) _dScaleDist = scaleDist;
        return Module.RealBIMWeb.WorldPosToScreenPos(worldPos, _dScaleDist);
    }

    /**
     * 获取坐标显示的精度
     */
    Module.Coordinate.getValueDispPrecision = function () {
        return Module.RealBIMWeb.GetFloatValueDispPrecision();
    }

    /**
     * 设置坐标显示的精度
     * @param {Number} precision //精度（正整数）
     */
    Module.Coordinate.setValueDispPrecision = function (precision) {
        Module.RealBIMWeb.SetFloatValueDispPrecision(precision);
    }















    // MOD-- 鼠标探测（Probe）
    Module.Probe = typeof Module.Probe !== "undefined" ? Module.Probe : {};//增加 Probe 模块

    class REProbeInfo {
        constructor() {
            this.dataSetId = null;//数据集唯一标识
            this.elemId = null;//构件标识
            this.elemPos = null;//选择构件坐标
            this.elemCenter = null;//选择构件几何中心点
            this.elemBV = null;//选择构件包围盒信息
            this.elemScrPos = null;//选择构件相对屏幕二维坐标（原点为屏幕左下角）
        }
    }
    ExtModule.REProbeInfo = REProbeInfo;

    class REProbeShpInfo {
        constructor() {
            this.elemId = null;//构件标识
            this.elemPos = null;//选择构件坐标
            this.elemScrPos = null;//选择构件相对屏幕二维坐标（原点为屏幕左下角）
        }
    }
    ExtModule.REProbeShpInfo = REProbeShpInfo;

    /**
     * 设置鼠标悬停事件的参数
     * @param {Number} waitTime //鼠标静止后等待多长时间才发送悬停事件
     */
    Module.Probe.setMouseHoverEventTime = function (waitTime) {
        Module.RealBIMWeb.SetMouseHoverEventParam(waitTime);
    }

    /**
     * 获取鼠标悬停事件的参数
     */
    Module.Probe.getMouseHoverEventTime = function () {
        return Module.RealBIMWeb.GetMouseHoverEventParam();
    }

    /**
     * 设置鼠标移动事件的参数
     * @param {Boolean} enable //是否向外界发送鼠标移动事件
     */
    Module.Probe.setMouseMoveEventEnable = function (enable) {
        Module.RealBIMWeb.SetMouseMoveEventParam(enable);
    }

    /**
     * 获取鼠标移动事件的参数
     */
    Module.Probe.getMouseMoveEventEnable = function () {
        return Module.RealBIMWeb.GetMouseMoveEventParam();
    }

    /**
     * 设置构件是否可探测
     * @param {String} dataSetId //数据集唯一标识
     * @param {Array} elemIdList //要设置的构件ID集合,为空则表示设置所有构件的可探测性
     * @param {Boolean} probeEnable //是否可以探测，为true,表示可被探测；设为false,表示不可被探测
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.Probe.setElemsCanProbe = function (dataSetId, elemIdList, probeEnable, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;

        // var _projName = "DefaultProj"; if (typeof projName != 'undefined') { _projName = projName; }
        var _elemScope = 0; if (!isEmpty(elemScope)) _elemScope = elemScope;
        var projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var _count = elemIdList.length;
        if (_count == 0) {  //如果构件ID集合为空，则默认为设置所有构件
            Module.RealBIMWeb.SetHugeObjSubElemProbeMasks(dataSetId, "", 0xffffffff, 0, probeEnable, _elemScope);
        } else {
            var _moemory = (_count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (i = 0; i < _count; ++i) {
                var eleid = elemIdList[i];
                _elemIds.set([eleid, projid], i * 2);
            }
            Module.RealBIMWeb.SetHugeObjSubElemProbeMasks(dataSetId, "", _elemIds.byteLength, _elemIds.byteOffset, probeEnable, _elemScope);
        }
    }

    /**
     * 获取当前选中点相关参数
     */
    Module.Probe.getCurProbeRet = function () {
        var _proberet = Module.RealBIMWeb.GetCurProbeRet(Module.RE_PROBE_TYPE.POT);
        var probeInfo = new REProbeInfo();
        probeInfo.dataSetId = _proberet.m_strProjName;
        probeInfo.elemId = _proberet.m_uSelActorSubID_L32;
        probeInfo.elemPos = _proberet.m_vSelPos;
        probeInfo.elemScrPos = _proberet.m_vSelScrPos;
        probeInfo.elemCenter = _proberet.m_vSelCenter;
        probeInfo.elemBV = _proberet.m_bbSelBV;
        return probeInfo;
    }

    /**
     * 获取当前拾取到的矢量(锚点、标签)相关信息
     */
    Module.Probe.getCurShpProbeRet = function () {
        var _shpProbeRet = Module.RealBIMWeb.GetCurShpProbeRet(Module.RE_SHP_PROBE_TYPE.NORM);
        var probeShpInfo = new REProbeShpInfo();
        probeShpInfo.elemId = _shpProbeRet.m_strSelShpObjName;
        probeShpInfo.elemPos = _shpProbeRet.m_vSelPos;
        probeShpInfo.elemScrPos = _shpProbeRet.m_vSelScrPos;
        return probeShpInfo;
    }


    /**
     * 获取当前拾取到的复合数据集信息
     */
    Module.Probe.getCurCombProbeRet = function () {
        var probeInfo = new REProbeInfo();
        var probeShpInfo = new REProbeShpInfo();
        var _probeRet = Module.RealBIMWeb.GetCurProbeRet(Module.RE_PROBE_TYPE.POT);
        var _probeShpRet = Module.RealBIMWeb.GetCurShpProbeRet(Module.RE_SHP_PROBE_TYPE.NORM);
        // console.log("_probeRet",_probeRet);
        // console.log("_probeShpRet",_probeShpRet);
        if (_probeShpRet.m_strSelShpObjName != "") {
            //矢量元素
            probeShpInfo.elemType = "ShapeElem";
            probeShpInfo.elemId = _probeShpRet.m_strSelShpObjName;
            probeShpInfo.elemPos = _probeShpRet.m_vSelPos;
            probeShpInfo.elemScrPos = _probeShpRet.m_vSelScrPos;
            return probeShpInfo;
        }
        else if (_probeRet.m_strSelActorName != "") {
            if (_probeRet.m_uSelActorSubID_L32 >= 0xfffffffe) {
                //栅格元素
                probeInfo.elemType = "GridElem";
            } else {
                //BIM元素
                probeInfo.elemType = "BIMElem";
            }
            probeInfo.dataSetId = _probeRet.m_strProjName;
            probeInfo.elemId = _probeRet.m_uSelActorSubID_L32;
            probeInfo.elemPos = _probeRet.m_vSelPos;
            probeInfo.elemScrPos = _probeRet.m_vSelScrPos;
            probeInfo.elemCenter = _probeRet.m_vSelCenter;
            probeInfo.elemBV = _probeRet.m_bbSelBV;
            return probeInfo;
        }
        else {
            //没有拾取到任何对象
            return { elemType: "", selPos: _probeRet.m_vSelPos, selScrPos: _probeRet.m_vSelScrPos }
        }
    }

    /**
     * 设置鼠标的拾取模式
     * @param {Number} type //拾取模式
     */
    Module.Probe.setProbeMode = function (type) {
        var _type = isEmpty(type) ? Module.RE_PROBE_TYPE.NORM : (type == 1 ? Module.RE_PROBE_TYPE.POT : Module.RE_PROBE_TYPE.NORM)
        Module.RealBIMWeb.SetExpectProbeMode(_type);
    }

    /**
     * 获取鼠标的拾取模式
     */
    Module.Probe.getProbeMode = function () {
        var _type = Module.RealBIMWeb.GetExpectProbeMode();
        return _type.value;
    }



    // MOD-- 图形显示（Graphics）
    Module.Graphics = typeof Module.Graphics !== "undefined" ? Module.Graphics : {};//增加 Graphics 模块

    // MARK 渲染设置
    /**
     * 设置引擎UI按钮面板是否可见
     * @param {Boolean} enable //是否可见
     */
    Module.Graphics.setSysUIPanelVisible = function (enable) {
        Module.RealBIMWeb.SetBuiltInUIVisible(enable);
    }

    /**
     * 设置引擎右上方ViewCube是否可见
     * @param {Boolean} enable //是否可见
     */
    Module.Graphics.setViewCubeVisible = function (enable) {
        Module.RealBIMWeb.SetViewCubeVisibility(enable);
    }

    /**
     * 设置UI工具条的颜色风格
     * @param {Boolean} useDark //是否使用深色风格，默认浅色
     */
    Module.Graphics.setSysUIColorStyle = function (useDark) {
        Module.RealBIMWeb.SetBuiltInUIColorStyle(useDark);
    }

    /**
     * 设置地理坐标系UI是否允许显示
     * @param {Boolean} enable //是否可见
     */
    Module.Graphics.setGeoCoordVisible = function (enable) {
        Module.RealBIMWeb.SetGeoCoordDisplayable(enable);
    }

    /**
     * 获取地理坐标系UI显示状态
     */
    Module.Graphics.getGeoCoordVisible = function () {
        return Module.RealBIMWeb.GetGeoCoordDisplayable();
    }

    /**
     * 设置对应系统UI的可见性
     * @param {RESysWndMateEm} uiType //控件类型（RESysWndMateEm 类型）
     * @param {Boolean} enable //是否显示
     */
    Module.Graphics.setSysUIWgtVisible = function (uiType, enable) {
        if (isEmptyLog(uiType, 'uiType')) return;
        return Module.RealBIMWeb.UIWgtSetVisible(uiType, enable);
    }

    /**
     * 获取对应系统UI的可见性
     * @param {RESysWndMateEm} uiType //控件类型（RESysWndMateEm 类型）
     */
    Module.Graphics.getSysUIWgtVisible = function (uiType) {
        if (isEmptyLog(uiType, 'uiType')) return;
        return Module.RealBIMWeb.UIWgtGetVisible(uiType);
    }

    /**
     * 恢复图形界面的模型、地形、按钮等为初始加载完成状态
     */
    Module.Graphics.resetInitialState = function () {
        Module.RealBIMWeb.ResetUserOperation(0);
    }

    /**
     * 设置系统UI面板的停靠方式
     * @param {Number} dockArea //停靠方式  0：下方停靠 1：左侧停靠  2：顶侧停靠  3：右侧停靠
     */
    Module.Graphics.setSysPanelUIDockArea = function (dockArea) {
        var _dockArea = 0; if (!isEmpty(dockArea)) _dockArea = dockArea;
        Module.RealBIMWeb.SetBuiltInUIDockArea(_dockArea);
    }

    /**
     * 预先载入一个指定的UI纹理
     * @param {String} picPath //图片地址
     */
    Module.Graphics.setPreLoadPicPath = function (picPath) {
        if (isEmptyLog(picPath, 'picPath')) return;
        return Module.RealBIMWeb.PreLoadGUIImgs(picPath);
    }

    /**
     * 全部重置系统面板UI按钮和关联的状态
     */
    Module.Graphics.resetSysOptStateAndUI = function () {
        Module.RealBIMWeb.ResetUserOperationOnUI();
    }





    // MARK 窗口（Wnd）
    /**
     * 获取窗口的颜色风格
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.getWndClrStyle = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtGetWndColorStyle(uiID);
    }

    /**
     * 设置窗口的颜色风格
     * @param {String} uiID //组件唯一标识
     * @param {String} clrStyleName //颜色风格名称
     */
    Module.Graphics.setWndClrStyle = function (uiID, clrStyleName) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(clrStyleName, 'clrStyleName')) return;
        return Module.RealBIMWeb.UIWgtSetWndColorStyle(uiID, clrStyleName);
    }






    // MARK 按钮（Button）
    class REUIBtnInfo {
        constructor() {
            this.uiID = null;//组件唯一标识，重复使用创建失败
            this.stateParList = null;//按钮各个子状态的状态相关参数集合（ REUIBtnStateInfo 类型）
            this.size = null;//按钮的期望尺寸, 二元数组
            this.activeStateId = 0;//按钮的初始子状态id, stateParList 对象列表 index 下标
            this.visible = true;//是否可见，默认可见
        }
    }
    ExtModule.REUIBtnInfo = REUIBtnInfo;

    class REUIBtnStateInfo {
        constructor() {
            this.text = null;//按钮部件的文字
            this.hintText = null;//鼠标悬浮提示
            this.texPath = null;//按钮图像路径
            this.clrStyle = null;//颜色风格名称
            this.sizeStyle = null;//尺寸风格名称
        }
    }
    ExtModule.REUIBtnStateInfo = REUIBtnStateInfo;

    /**
     * 创建一个按钮控件
     * @param {REUIBtnInfo} btnInfo //按钮信息
     */
    Module.Graphics.createBtn = function (btnInfo) {
        if (isEmptyLog(btnInfo, 'btnInfo')) return;

        var _strUIID = btnInfo.uiID;
        var _vExpectSize = btnInfo.size;
        var _uActiveStateID = 0; if (!isEmpty(btnInfo.activeStateId)) _uActiveStateID = btnInfo.activeStateId;
        var _bVisible = true; if (!isEmpty(btnInfo.visible)) _bVisible = btnInfo.visible;
        var _bClickable = true;

        var _arrStateParams = new Module.RE_Vector_STATE_PARAMS();
        for (let i = 0; i < btnInfo.stateParList.length; i++) {
            let statePar = btnInfo.stateParList[i];
            let _par = {
                m_strText: isEmpty(statePar.text) ? "" : statePar.text,
                m_strHint: isEmpty(statePar.hintText) ? "" : statePar.hintText,
                m_strTextureURL: isEmpty(statePar.texPath) ? "" : statePar.texPath,
                m_vecClrStates: isEmpty(statePar.clrStyle) ? Module.RealBIMWeb.UIWgtGetClrStyle("CS_BTN_WHITETEXT_NOBG") : Module.RealBIMWeb.UIWgtGetClrStyle(statePar.clrStyle),
                m_vecSizeStates: isEmpty(statePar.sizeStyle) ? Module.RealBIMWeb.UIWgtGetSizeStyle("SS_WND_HAVE_THIN_BORDER") : Module.RealBIMWeb.UIWgtGetSizeStyle(statePar.sizeStyle),
            };
            _arrStateParams.push_back(_par);
        }
        return Module.RealBIMWeb.UIWgtCreateButton(_strUIID, _arrStateParams, _vExpectSize, _uActiveStateID, _bVisible, _bClickable);
    }

    /**
     * 获取按钮当前的子状态
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.getBtnActiveState = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtGetBtnActiveSubState(uiID);
    }

    /**
     * 设置按钮当前的子状态
     * @param {String} uiID //组件唯一标识
     * @param {Number} activeStateId //按钮的初始子状态id, stateParList 对象列表 index 下标
     */
    Module.Graphics.setBtnActiveState = function (uiID, activeStateId) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(activeStateId, 'activeStateId')) return;
        return Module.RealBIMWeb.UIWgtSetBtnActiveSubState(uiID, activeStateId);
    }

    /**
     * 在系统的UI面板中添加按钮（统一样式, 只支持两种子按钮状态） 
     * @param {REUIBtnInfo} btnInfo //按钮信息 （REUIBtnInfo 类型）
     */
    Module.Graphics.createSysPanelBtn = function (btnInfo) {
        if (isEmptyLog(btnInfo, 'btnInfo')) return;

        var _strUIID = btnInfo.uiID;
        var _vExpectSize = [48, 48];
        var _uActiveStateID = 0; if (!isEmpty(btnInfo.activeStateId)) _uActiveStateID = btnInfo.activeStateId;
        var _bVisible = true; if (!isEmpty(btnInfo.visible)) _bVisible = btnInfo.visible;
        var _bClickable = true;
        var _wndClrStyle = Module.Graphics.getWndClrStyle == "CS_WND_DARK" ? 1 : 0;

        var _arrStateParams = new Module.RE_Vector_STATE_PARAMS();
        for (let i = 0; i < btnInfo.stateParList.length; i++) {
            _btnClrStyle = (_wndClrStyle == 1) ? ((i == 1) ? "CS_BTN_WHITETEXT_NOBG" : "CS_WND_DARK") : ((i == 1) ? "CS_BTN_WHITETEXT_BLUEBG" : "CS_BTN_WHITETEXT_NOBG");
            let statePar = btnInfo.stateParList[i];
            let _par = {
                m_strText: "",
                m_strHint: isEmpty(statePar.hintText) ? "" : statePar.hintText,
                m_strTextureURL: isEmpty(statePar.texPath) ? "" : statePar.texPath,
                m_vecClrStates: Module.RealBIMWeb.UIWgtGetClrStyle(_btnClrStyle),
                m_vecSizeStates: Module.RealBIMWeb.UIWgtGetSizeStyle("SS_WND_HAVE_THIN_BORDER"),
            };
            _arrStateParams.push_back(_par);
        }
        var createState = Module.RealBIMWeb.UIWgtCreateButton(_strUIID, _arrStateParams, _vExpectSize, _uActiveStateID, _bVisible, _bClickable);
        var addState = Module.Graphics.addSysPanelChildWidget(btnInfo.uiID);
        return createState && addState;
    }

    /**
     * 获取按钮的某子状态使用的纹理路径
     * @param {String} uiID //组件唯一标识
     * @param {Number} stateId //按钮的状态id, stateParList 对象列表 index 下标
     */
    Module.Graphics.getBtnStatePicPath = function (uiID, stateId) {
        if (isEmptyLog(uiID, 'uiID')) return;
        var curStateId = isEmpty(stateId) ? Module.RealBIMWeb.UIWgtGetBtnActiveSubState(uiID) : stateId;
        return Module.RealBIMWeb.UIWgtGetBtnSubStateImgURL(uiID, curStateId);
    }

    /**
     * 设置按钮的某子状态使用的纹理路径
     * @param {String} uiID //组件唯一标识
     * @param {Number} stateId //按钮的状态id, stateParList 对象列表 index 下标
     * @param {String} picPath //按钮的子状态纹理路径
     */
    Module.Graphics.setBtnStatePicPath = function (uiID, stateId, picPath) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(stateId, 'stateId')) return;
        if (isEmptyLog(picPath, 'picPath')) return;
        return Module.RealBIMWeb.UIWgtSetBtnSubStateImgURL(uiID, stateId, picPath);
    }

    /**
     * 设置按钮的某子状态使用的颜色配置
     * @param {String} uiID //组件唯一标识
     * @param {Number} stateId //按钮的状态id, stateParList 对象列表 index 下标
     * @param {String} clrStyleName //颜色风格名称
     */
    Module.Graphics.setBtnClrStyle = function (uiID, stateId, clrStyleName) {
        if (isEmptyLog(uiID, 'uiID')) return false;
        if (isEmptyLog(stateId, 'stateId')) return false;
        if (isEmptyLog(clrStyleName, 'clrStyleName')) return false;
        return Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, stateId, clrStyleName);
    }

    /**
     * 获取按钮的某子状态使用的颜色配置
     * @param {String} uiID //组件唯一标识
     * @param {Number} stateId //按钮的状态id, stateParList 对象列表 index 下标
     */
    Module.Graphics.getBtnClrStyle = function (uiID, stateId) {
        if (isEmptyLog(uiID, 'uiID')) return "";
        if (isEmptyLog(stateId, 'stateId')) return "";
        return Module.RealBIMWeb.UIWgtGetBtnColorStyle(uiID, stateId);
    }

    /**
     * 设置系统的UI面板按钮的主题颜色（只支持系统浅色和深色、只支持只有两种按钮子状态类型）
     * @param {String} uiID //组件唯一标识
     * @param {Number} clrStyle //颜色样式 0：浅色 1：深色
     */
    Module.Graphics.setSysPanelBtnClrStyle = function (uiID, clrStyle) {
        if (isEmptyLog(uiID, 'uiID')) return false;
        if (isEmptyLog(clrStyle, 'clrStyle')) return false;

        if (clrStyle == 1) {
            var state = Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, 0, "CS_WND_DARK");
            Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, 1, "CS_BTN_WHITETEXT_NOBG");
            return state;
        } else {
            var state = Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, 0, "CS_BTN_WHITETEXT_NOBG");
            Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, 1, "CS_BTN_WHITETEXT_BLUEBG");
            return state;
        }
    }





    // MARK 图片（Image）
    class REUIImageInfo {
        constructor() {
            this.uiID = null;//组件唯一标识，重复使用创建失败
            this.picPath = null;//图片地址
            this.size = null;//按钮的期望尺寸, 二元数组
            this.visible = true;//是否可见，默认可见
        }
    }
    ExtModule.REUIImageInfo = REUIImageInfo;


    /**
     * 创建一个Image控件
     * @param {REUIImageInfo} imageInfo //图片信息（REUIImageInfo 类型）
     */
    Module.Graphics.createImage = function (imageInfo) {
        if (isEmptyLog(imageInfo, 'imageInfo')) return;
        if (isEmptyLog(imageInfo.uiID, 'uiID')) return;
        if (isEmptyLog(imageInfo.picPath, 'picPath')) return;
        if (isEmptyLog(imageInfo.size, 'size')) return;

        var _visible = isEmpty(imageInfo.visible) ? true : imageInfo.visible;
        return Module.RealBIMWeb.UIWgtCreateImage(imageInfo.uiID, _visible, imageInfo.size, imageInfo.picPath);
    }

    /**
     * 获取图像UI控件所使用的图片资源的路径
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.getImagePicPath = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtGetImageImgURL(uiID);
    }

    /**
     * 设置图像UI控件所使用的图片资源的路径
     * @param {String} uiID //组件唯一标识
     * @param {String} picPath //图片地址
     */
    Module.Graphics.setImagePicPath = function (uiID, picPath) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(picPath, 'picPath')) return;
        return Module.RealBIMWeb.UIWgtSetImageImgURL(uiID, picPath);
    }

    /**
     * 创建一个系统UI面板上的Image控件
     * @param {String} uiID //组件唯一标识
     * @param {String} picPath //图片地址
     */
    Module.Graphics.createSysPanelImage = function (uiID, picPath) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(picPath, 'picPath')) return;

        var _size = [10, 48];
        var _visible = true;
        var createState = Module.RealBIMWeb.UIWgtCreateImage(uiID, _visible, _size, picPath);
        var addState = Module.Graphics.addSysPanelChildWidget(uiID);
        return createState && addState;
    }





    // MARK 通用

    /**
     * 获取指定组件的所有子组件ID
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.getAllChildIds = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        var _idList = Module.RealBIMWeb.UIWgtGetAllChildrensID(uiID);
        var _childIDList = [];
        for (let i = 0; i < _idList.size(); i++) {
            _childIDList.push(_idList.get(i));
        }
        return _childIDList;
    }

    /**
     * 获取系统UI面板所有子组件的ID
     */
    Module.Graphics.getSysPanelAllChildIds = function () {
        var _idList = Module.RealBIMWeb.UIWgtGetAllChildrensID("BuiltIn_Wnd_Panel");
        var _childIDList = [];
        for (let i = 0; i < _idList.size(); i++) {
            _childIDList.push(_idList.get(i));
        }
        return _childIDList;
    }

    /**
     * 添加组件到指定父组件上
     * @param {String} superUIID //父组件唯一标识
     * @param {String} childUIID //子组件唯一标识
     */
    Module.Graphics.addChildWidget = function (superUIID, childUIID) {
        if (isEmptyLog(superUIID, 'superUIID')) return;
        if (isEmptyLog(childUIID, 'childUIID')) return;
        return Module.RealBIMWeb.UIWgtAddChildWidget(superUIID, childUIID);
    }

    /**
     * 移除组件的某个子组件 （不删除子组件）
     * @param {String} superUIID //父组件唯一标识
     * @param {String} childUIID //子组件唯一标识
     */
    Module.Graphics.removeChildWidget = function (superUIID, childUIID) {
        if (isEmptyLog(superUIID, 'superUIID')) return;
        if (isEmptyLog(childUIID, 'childUIID')) return;
        return Module.RealBIMWeb.UIWgtRemoveChildWidget(superUIID, childUIID);
    }

    /**
     * 删除一个控件
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.delWidget = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtDeleteWidget(uiID);
    }

    /**
     * 移除系统UI面板的某个子组件 （不删除子组件）
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.removeSysPanelWidget = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtRemoveChildWidget("BuiltIn_Wnd_Panel", uiID);
    }

    /**
     * 将已经创建好的组件到系统UI面板 
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.addSysPanelChildWidget = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtAddChildWidget("BuiltIn_Wnd_Panel", uiID);
    }































    // MOD-- 标签（Tag）
    Module.Tag = typeof Module.Tag !== "undefined" ? Module.Tag : {};//增加 Tag 模块

    class RETagInfo {
        constructor() {
            this.tagName = null;//标签的名称(唯一标识)
            this.pos = null;//标签的位置
            this.infoList = null;//标签的内容（包含 RETagContent 类型）
        }
    }
    ExtModule.RETagInfo = RETagInfo;

    class RETagContent {
        constructor() {
            this.picPath = null;//标签每一行的纹理路径(要求32 * 32像素，png格式)
            this.text = null;//标签每一行的文字信息
        }
    }
    ExtModule.RETagContent = RETagContent;

    class RELineTagInfo {
        constructor() {
            this.tagName = null;//标签的名称(唯一标识)
            this.pos = null;//标签的位置
            this.contents = null;//标签的内容（包含 RELineTagCont 类型）
            this.tagMinWidth = null;//表示要添加的标签最小宽度
            this.tagMinHeight = null;//表示要添加的标签最小高度
            this.fontName = null;//表示要添加的标签内容字体样式
            this.backClr = null;//表示要添加的标签背景颜色（REColor 类型）
            this.frameClr = null;//表示要添加的标签边框颜色（REColor 类型）
        }
    }
    ExtModule.RELineTagInfo = RELineTagInfo;

    class RELineTagCont {
        constructor() {
            this.type = null;//元素类型，"text":文字，"tex":图片
            this.width = null;//元素宽度
            this.height = null;//元素高度
            this.border = null;//元素边框大小
            this.elemClr = null;//元素颜色（REColor 类型）type="text"代表文字颜色，type="tex"代表图片纹理颜色
            this.text = null;//文字内容，只有在 type="text"时才生效
            this.picPath = null;//图片路径，只有在 type="tex"时才生效
        }
    }
    ExtModule.RELineTagCont = RELineTagCont;


    /**
     * 添加标签
     * @param {Array} tagInfoList //标签信息集合（ RETagInfo 类型）
     */
    Module.Tag.addTags = function (tagInfoList) {
        if (isEmptyLog(tagInfoList, 'tagInfoList')) return;
        var _temptags = new Module.RE_Vector_TAG();
        for (let j = 0; j < tagInfoList.length; ++j) {
            let _tagInfo = tagInfoList[j];
            let _texRegions = new Module.RE_Vector_SHP_TEX();
            let _textRegions = new Module.RE_Vector_SHP_TEXT();
            let _lineCount = _tagInfo.infoList.length;
            let _lineHeight = 26; let _lineSpace = 3;
            for (let i = 0; i < _lineCount; ++i) {
                let obj_t = {
                    m_strTexPath: isEmpty(_tagInfo.infoList[i].picPath) ? "" : _tagInfo.infoList[i].picPath,
                    m_qTexRect: [-50, _lineHeight * (_lineCount - i - 1) + _lineSpace, -30, _lineHeight * (_lineCount - i) - _lineSpace],
                    m_uTexClrMult: 0xffffffff,
                    m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0],
                    m_uFrameNumU: 1, m_uFrameNumV: 1,
                    m_uFrameStrideU: 0, m_uFrameStrideV: 0,
                    m_fFrameFreq: 0.0,
                };
                _texRegions.push_back(obj_t);  //纹理矩形区域在2维像素裁剪空间(Y轴向上递增)下相对于定位点的覆盖区域<左，下，右，上>
            }
            for (let i = 0; i < _lineCount; ++i) {
                let obj_t = {
                    m_strGolFontID: "RealBIMFont001",
                    m_bTextWeight: false,
                    m_strText: _tagInfo.infoList[i].text,
                    m_uTextClr: 0xffffffff,
                    m_uTextBorderClr: 0x80000000,
                    m_qTextRect: [0, _lineHeight * (_lineCount - i - 1) + _lineSpace, 30, _lineHeight * (_lineCount - i) - _lineSpace],
                    m_uTextFmtFlag: ((1 << 1)/*TEXT_FMT_VCENTER*/ | (1 << 3)/*TEXT_FMT_LEFT*/ | (1 << 6)/*TEXT_FMT_NOCLIP*/),
                    m_uTextBackMode: 0, m_sTextBackBorder: 0, m_uTextBackClr: 0x00000000
                };
                _textRegions.push_back(obj_t);
            }
            let _tempobj = {
                m_strName: isEmpty(_tagInfo.tagName) ? "" : _tagInfo.tagName,
                m_vPos: _tagInfo.pos,
                m_vBgMinSize: [150, 10],
                m_vBgPadding: [5, 5],
                m_uBgAlignX: 1, m_uBgAlignY: 1,
                m_vArrowOrigin: [0, 10],
                m_uBgColor: 0x80000000,
                m_arrTexContents: _texRegions,
                m_arrTextContents: _textRegions,
            };
            _temptags.push_back(_tempobj);
        }
        return Module.RealBIMWeb.AddTags(_temptags);
    }

    /**
     * 添加行标签
     * @param {RELineTagInfo} lineTagInfo //行标签信息（RELineTagInfo 类型）
     */
    Module.Tag.addLineTags = function (lineTagInfo) {
        if (isEmptyLog(lineTagInfo, 'lineTagInfo')) return;
        if (isEmptyLog(lineTagInfo.contents, 'contents')) return;

        var _tagList = new Module.RE_Vector_TAG();
        var _texRegions = new Module.RE_Vector_SHP_TEX();
        var _textRegions = new Module.RE_Vector_SHP_TEXT();

        var _cur_x = 0;//当前计算x
        var _cur_y = 0;//当前计算y
        var _max_y = lineTagInfo.tagMinHeight / 2;//当前最大y
        var _backClr = 0x00000000; if (!isEmpty(lineTagInfo.backClr)) _backClr = clrToU32(lineTagInfo.backClr);
        var _frameClr = 0x00000000; if (!isEmpty(lineTagInfo.frameClr)) _frameClr = clrToU32(lineTagInfo.frameClr);
        var _fontName = "RealBIMFont001"; if (!isEmpty(lineTagInfo.fontName) && lineTagInfo.fontName != "") _fontName = lineTagInfo.fontName;

        for (let i = 0; i < lineTagInfo.contents.length; i++) {
            let _lineTagCont = lineTagInfo.contents[i];
            let _elemType = "tex"; if (!isEmpty(_lineTagCont.type)) _elemType = _lineTagCont.type;
            let _elemText = ""; if (!isEmpty(_lineTagCont.text) && _elemType != "tex") _elemText = _lineTagCont.text;
            let _elemPicPath = ""; if (!isEmpty(_lineTagCont.picPath) && _elemType != "text") _elemPicPath = _lineTagCont.picPath;
            let _elemWidth = 1; if (!isEmpty(_lineTagCont.width)) _elemWidth = _lineTagCont.width;
            let _elemHeight = 1; if (!isEmpty(_lineTagCont.height)) _elemHeight = _lineTagCont.height;
            let _elemBorder = 1; if (!isEmpty(_lineTagCont.border)) _elemBorder = _lineTagCont.border;
            let _elemClr = 0xffffffff;
            if (!isEmpty(_lineTagCont.elemClr)) {
                if (_elemType == "text") {
                    _elemClr = clrToU32(_lineTagCont.elemClr);
                } else {
                    let _clrT = deepClone(_lineTagCont.elemClr); _clrT.alpha = 0;
                    _elemClr = clrToU32(_clrT);
                }

            }
            if (_elemType == "tex") {
                _texRegions.push_back({
                    m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0],
                    m_uFrameNumU: 1, m_uFrameNumV: 1,
                    m_uFrameStrideU: 0, m_uFrameStrideV: 0,
                    m_fFrameFreq: 0.0,
                    m_strTexPath: _elemPicPath,
                    m_qTexRect: [_cur_x + _elemBorder, _cur_y - _elemHeight / 2 - 1, _cur_x + _elemBorder + _elemWidth, _cur_y + _elemHeight / 2 - 1],
                    m_uTexClrMult: _elemClr,
                });
            } else {
                _textRegions.push_back({
                    m_strGolFontID: _fontName,
                    m_bTextWeight: false,
                    m_uTextClr: _elemClr,
                    m_uTextBorderClr: 0x00000000,
                    m_strText: _elemText,
                    m_qTextRect: [_cur_x + _elemBorder, _cur_y - _elemHeight / 2 + 1, _cur_x + _elemBorder + _elemWidth, _cur_y + _elemHeight / 2 + 1],
                    m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x10/*TEXT_FMT_HCENTER*/ /*| 0x40TEXT_FMT_NOCLIP*/ | 0x100/*TEXT_FMT_WORDBREAK*/),
                    m_uTextBackMode: 0, m_sTextBackBorder: 0, m_uTextBackClr: 0x00000000
                });
            }
            _cur_x += _elemWidth + _elemBorder * 2;
            if (_max_y < _elemHeight / 2) { _max_y = _elemHeight / 2; }
        }

        var _frameRange_xMin = 0; var _frameRange_xMax = _cur_x;
        if (_cur_x < lineTagInfo.tagMinWidth) {
            _frameRange_xMin -= (lineTagInfo.tagMinWidth - _cur_x) / 2; _frameRange_xMax += (lineTagInfo.tagMinWidth - _cur_x) / 2;
        }
        var _frameLine = {
            m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0],
            m_uFrameNumU: 1, m_uFrameNumV: 1,
            m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
            m_strTexPath: "",
            m_qTexRect: [0, 0, 0, 0],
            m_uTexClrMult: _frameClr,
        };
        //边框
        var _frameLineWidth = 2; var _frameGap = 6;
        //边框-上
        _frameLine["m_qTexRect"] = [
            _frameRange_xMin - _frameGap, _max_y + _frameGap,
            _frameRange_xMax + _frameGap, _max_y + _frameGap + _frameLineWidth
        ]; _texRegions.push_back(_frameLine);
        //边框-下
        _frameLine["m_qTexRect"] = [
            _frameRange_xMin - _frameGap, -_max_y - _frameGap - _frameLineWidth,
            _frameRange_xMax + _frameGap, -_max_y - _frameGap
        ]; _texRegions.push_back(_frameLine);
        //边框-左
        _frameLine["m_qTexRect"] = [
            _frameRange_xMin - _frameGap, -_max_y - _frameGap - _frameLineWidth,
            _frameRange_xMin - _frameGap + _frameLineWidth, _max_y + _frameGap + _frameLineWidth
        ]; _texRegions.push_back(_frameLine);
        //边框-右
        _frameLine["m_qTexRect"] = [
            _frameRange_xMax + _frameGap - _frameLineWidth, -_max_y - _frameGap - _frameLineWidth,
            _frameRange_xMax + _frameGap, _max_y + _frameGap + _frameLineWidth
        ]; _texRegions.push_back(_frameLine);

        var _tempObj = {
            m_strName: lineTagInfo.tagName,
            m_vPos: lineTagInfo.pos,
            m_vBgMinSize: [lineTagInfo.tagMinWidth, lineTagInfo.tagMinHeight],
            m_vBgPadding: [3, 3],
            m_uBgAlignX: 1, m_uBgAlignY: 1,
            m_vArrowOrigin: [-5, 20],
            m_uBgColor: _backClr,
            m_arrTexContents: _texRegions,
            m_arrTextContents: _textRegions,
        };
        _tagList.push_back(_tempObj);
        return Module.RealBIMWeb.AddTags(_tagList);
    }

    /**
     * 获取某个标签的信息
     * @param {String} tagName //标签的名称(唯一标识)
     */
    Module.Tag.getTag = function (tagName) {
        if (isEmptyLog(tagName, 'tagName')) return;
        var _tagData = Module.RealBIMWeb.GetTag(tagName);
        // 多行标签和单行标签都是按照坐标添加的，在一个画布上，返回无法区分是单行还是多行，也无法确定添加的顺序，不返回图片和文字内容
        return { tagName: _tagData.m_strName, pos: _tagData.m_vPos };
    }

    /**
     * 获取系统中所有标签信息
     */
    Module.Tag.getAllTag = function () {
        var _allTagData = Module.RealBIMWeb.GetAllTags();
        var tagInfoList = [];
        for (let i = 0; i < _allTagData.size(); i++) {
            let _tagData = _allTagData.get(i);
            tagInfoList.push({ tagName: _tagData.m_strName, pos: _tagData.m_vPos });
        }
        return tagInfoList;
    }

    /**
     * 删除标签
     * @param {Array} tagNameList //标签的名称集合
     */
    Module.Tag.delTags = function (tagNameList) {
        if (!checkTypeLog(tagNameList, "tagNameList", RE_Enum.RE_Check_Array)) return false;
        var temptags = new Module.RE_Vector_WStr();
        for (i = 0; i < tagNameList.length; ++i) {
            temptags.push_back(tagNameList[i]);
        }
        return Module.RealBIMWeb.DelTags(temptags);
    }

    /**
     * 删除全部标签
     */
    Module.Tag.delAllTag = function () {
        return Module.RealBIMWeb.DelAllTags();
    }

    /**
     * 获取系统中所有标签总数
     */
    Module.Tag.getTagNum = function () {
        return Module.RealBIMWeb.GetTagNum();
    }

    /**
     * 设置系统中标签是否允许被场景遮挡
     * @param {Boolean} enable  //是否允许
     */
    Module.Tag.setTagCanOverlap = function (enable) {
        Module.RealBIMWeb.SetTagContactSce(enable);
    }

    /**
     * 获取系统中标签是否允许被场景遮挡
     */
    Module.Tag.getTagCanOverlap = function () {
        return Module.RealBIMWeb.GetTagContactSce();
    }

    /**
     * 设置系统中标签的自动缩放距离
     * @param {Number} dist  //自动缩放距离
     */
    Module.Tag.setTagAutoScaleDist = function (dist) {
        Module.RealBIMWeb.SetTagAutoScaleDist(dist);
    }

    /**
     * 获取系统中标签的自动缩放距离
     */
    Module.Tag.getTagAutoScaleDist = function () {
        return Module.RealBIMWeb.GetTagAutoScaleDist();
    }

    /**
     * 设置系统中标签的最远可视距离
     * @param {Number} dist  //自动缩放距离
     */
    Module.Tag.setTagVisDist = function (dist) {
        Module.RealBIMWeb.SetTagVisDist(dist);
    }

    /**
     * 获取系统中标签的最远可视距离
     */
    Module.Tag.getTagVisDist = function () {
        return Module.RealBIMWeb.GetTagVisDist();
    }





    // MOD-- 标注（Mark）
    Module.Mark = typeof Module.Mark !== "undefined" ? Module.Mark : {};//增加 Mark 模块


    /**
     * 开始添加标注
     */
    Module.Mark.startAdd = function () {
        return Module.RealBIMWeb.BeginAddMark();
    }

    /**
     * 添加标注文字
     * @param {String} markText //表示要添加的标注文字信息
     */
    Module.Mark.setText = function (markText) {
        Module.RealBIMWeb.SetMarkText(markText);
    }

    /**
     * 获取当前标注信息，包括添加标注时的相机方位、标注框、标注文字等
     */
    Module.Mark.getCurData = function () {
        return new Uint8Array(Module.RealBIMWeb.GetMarkInfo());
    }

    /**
     * 退出添加标注状态
     */
    Module.Mark.endAdd = function () {
        return Module.RealBIMWeb.EndAddMark();
    }

    /**
     * 查看之前保存的标注信息数据
     * @param {Uint8Array} markData //标注信息（Uint8Array 类型）
     */
    Module.Mark.showData = function (markData) {
        var strmarkdata = markData.byteLength.toString();
        Module.RealBIMWeb.ReAllocHeapViews(strmarkdata);
        var _data = Module.RealBIMWeb.GetHeapView_U8(0);
        _data.set(markData, 0);
        Module.RealBIMWeb.ShowMarkInfo(_data.byteLength, _data.byteOffset);
    }





    // MOD-- 锚点（Anchor）
    Module.Anchor = typeof Module.Anchor !== "undefined" ? Module.Anchor : {};//增加 Anchor 模块

    class REAncInfo {
        constructor() {
            this.groupName = null;//锚点组的标识，默认值 "DefaultGroup"
            this.ancName = null;//锚点的名称(唯一标识)
            this.pos = null;//锚点的位置
            this.picPath = null;//锚点的纹理路径
            this.textInfo = null;//锚点的文字
            this.picWidth = null;//锚点图片的宽度
            this.picHeight = null;//锚点图片的高度
            this.linePos = null;//锚点指引线的终点坐标(2维像素裁剪空间下相对于定位点的坐标) (Y轴向上递增)
            this.lineClr = null;//指引线的颜色
            this.ancSize = null;//锚点的覆盖范围参考值，大于等于0，可设为锚点图片的最大尺寸，该值越大，则相机定位到锚点时后退距离越大
            this.selfAutoScaleDist = null;//锚点自身自动缩放距离(<0.0f表示使用全局自动缩放距离)
            this.selfVisDist = null;//锚点自身可视距离(<0.0f表示使用全局可视距离)
            this.texBias = null;//锚点文字与图片的相对位置, 第一维: -1、0、1分别表示文字在图片的左侧、中间、右侧；第二维: -1、0、1分别表示文字在图片的下侧、中间、上侧；
            this.texFocus = null;//牵引线的顶点相对于图片的像素位置，[0,0]表示位于图片的左下角
            this.fontName = null;//锚点的字体样式
            this.textClr = null;//锚点的字体颜
            this.textBorderClr = null;//锚点的字体边框颜色
            this.textBackClr = null;//锚点的字体背景颜色
            this.textBackMode = null;//表示文字背景的处理模式 0：禁用文字背景 1：文字背景对应文字排版后返回的最终矩形区域 2：文字背景对应整体文字实际覆盖的矩形区域
            this.useLod = null;//是否允许聚合（只有uselod设为true，并且设置了有效的聚合参数 setAncLODInfo 后，锚点会自动聚合，同时锚点自动缩放和可视距离参数无效）
            this.animObjName = null;//锚点关联的动画对象名称(仅当 useLod==false时有效)
            this.animBoneID = null;//锚点关联的骨骼在动画对象内的ID(仅当 useLod==false时有效)
            this.picNum = null;//闪烁时循环播放的图片个数
            this.playFrame = null;//闪烁的帧率，即1秒钟闪几下

        }
    }
    ExtModule.REAncInfo = REAncInfo;

    /**
     * 添加锚点
     * @param {Array} ancList //锚点信息集合（REAncInfo 类型）
     */
    Module.Anchor.addAnc = function (ancList) {
        if (isEmptyLog(ancList, "ancList")) return false;
        var _tempAnchors = new Module.RE_Vector_ANCHOR();
        for (let i = 0; i < ancList.length; i++) {
            let ancInfo = ancList[i];

            var _groupname = "DefaultGroup"; if (!isEmpty(ancInfo.groupName)) { _groupname = ancInfo.groupName; }
            var _uselod = false; if (!isEmpty(ancInfo.useLod)) { _uselod = ancInfo.useLod; }
            var _animobjname = ""; if (!isEmpty(ancInfo.animObjName)) { _animobjname = ancInfo.animObjName; }
            var _animboneid = 0; if (!isEmpty(ancInfo.animBoneID)) { _animboneid = ancInfo.animBoneID; }
            var _linepos = [0, 0]; if (!isEmpty(ancInfo.linePos)) { _linepos = ancInfo.linePos; }
            var _lineclr = 0x00000000; if (!isEmpty(ancInfo.lineClr)) { _lineclr = clrToU32(ancInfo.lineClr); }
            var _size = 0; if (!isEmpty(ancInfo.ancSize)) { _size = ancInfo.ancSize; }
            var _selfASDist = -1; if (!isEmpty(ancInfo.selfAutoScaleDist)) { _selfASDist = ancInfo.selfAutoScaleDist; }
            var _selfVisDist = -1; if (!isEmpty(ancInfo.selfVisDist)) { _selfVisDist = ancInfo.selfVisDist; }
            var _textbias = [1, 0]; if (!isEmpty(ancInfo.texBias)) { _textbias = ancInfo.texBias; }
            var _texfocus = [0, 0]; if (!isEmpty(ancInfo.texFocus)) { _texfocus = ancInfo.texFocus; }
            var _GolFontID = "RealBIMFont001"; if (!isEmpty(ancInfo.fontName)) { _GolFontID = ancInfo.fontName; }
            var _textcolor = 0xffffffff; if (!isEmpty(ancInfo.textClr)) { _textcolor = clrToU32(ancInfo.textClr); }
            var _textbordercolor = 0xff000000; if (!isEmpty(ancInfo.textBorderClr)) { _textbordercolor = clrToU32(ancInfo.textBorderClr); }
            var _textBackMode = 0; if (!isEmpty(ancInfo.textBackMode)) { _textBackMode = ancInfo.textBackMode; }
            var _textBackBorder = 0; if (!isEmpty(ancInfo.textBackBorder)) { _textBackBorder = ancInfo.textBackBorder; }
            var _textBackClr = 0x00000000; if (!isEmpty(ancInfo.textBackClr)) { _textBackClr = clrToU32(ancInfo.textBackClr); }

            var TempTextRect = [0, 0, 1, 1]; var TempTextFmtFlag = 0x40/*TEXT_FMT_NOCLIP*/;
            if (_textbias[0] < 0) {
                TempTextRect[0] = _linepos[0] - 1 - _texfocus[0]; TempTextRect[2] = _linepos[0] - _texfocus[0]; TempTextFmtFlag |= 0x20/*TEXT_FMT_RIGHT*/;
            } else if (_textbias[0] == 0) {
                //TempTextRect[0] =_linepos[0]-_texfocus[0]; TempTextRect[2] =_linepos[0]+1-_texfocus[0]; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
                TempTextRect[0] = _linepos[0] - _texfocus[0]; TempTextRect[2] = ancInfo.picWidth + _linepos[0] - _texfocus[0]; TempTextFmtFlag |= 0x10/*TEXT_FMT_HCENTER*/;
            } else {
                TempTextRect[0] = ancInfo.picWidth + _linepos[0] - _texfocus[0]; TempTextRect[2] = ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0]; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
            }
            if (_textbias[1] < 0) {
                TempTextRect[1] = _linepos[1] - 1 - _texfocus[1]; TempTextRect[3] = _linepos[1] - _texfocus[1]; TempTextFmtFlag |= 0x4/*TEXT_FMT_TOP*/;
            } else if (_textbias[1] == 0) {
                //TempTextRect[1] =_linepos[1]-_texfocus[1]; TempTextRect[3] =_linepos[1]+1-_texfocus[1]; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
                TempTextRect[1] = _linepos[1] - _texfocus[1]; TempTextRect[3] = ancInfo.picHeight + _linepos[1] - _texfocus[1]; TempTextFmtFlag |= 0x2/*TEXT_FMT_VCENTER*/;
            } else {
                TempTextRect[1] = ancInfo.picHeight + _linepos[1] - _texfocus[1]; TempTextRect[3] = ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1]; TempTextFmtFlag |= 0x1/*TEXT_FMT_BOTTOM*/;
            }

            var tempobj = {
                m_strGroupName: _groupname,
                m_strName: ancInfo.ancName,
                m_vPos: ancInfo.pos,
                m_bUseLOD: _uselod,
                m_strAnimObjName: _animobjname,
                m_uAnimBoneID: _animboneid,
                m_vLineEnd: _linepos,
                m_uLineClr: _lineclr,
                m_fSize: _size,
                m_fSelfASDist: _selfASDist,
                m_fSelfVisDist: _selfVisDist,
                m_cTexRegion: {
                    m_strTexPath: ancInfo.picPath,
                    m_qTexRect: [_linepos[0] - _texfocus[0], _linepos[1] - _texfocus[1], ancInfo.picWidth + _linepos[0] - _texfocus[0], ancInfo.picHeight + _linepos[1] - _texfocus[1]],
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
                    m_strText: ancInfo.textInfo,
                    m_uTextClr: _textcolor,
                    m_uTextBorderClr: _textbordercolor,
                    m_qTextRect: TempTextRect,
                    m_uTextFmtFlag: TempTextFmtFlag,
                    m_uTextBackMode: _textBackMode, m_sTextBackBorder: _textBackBorder, m_uTextBackClr: _textBackClr
                }
            };
            _tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddAnchors(_tempAnchors);
    }

    /**
     * 删除锚点
     * @param {Array} ancNameList //锚点的名称集合
     */
    Module.Anchor.delAnc = function (ancNameList) {
        var tempAnchors = new Module.RE_Vector_WStr();
        for (i = 0; i < ancNameList.length; ++i) {
            tempAnchors.push_back(ancNameList[i]);
        }
        return Module.RealBIMWeb.DelAnchors(tempAnchors);
    }

    /**
     * 按组删除锚点
     * @param {String} ancGroupName //锚点的组名称
     */
    Module.Anchor.delGroupAnc = function (ancGroupName) {
        return Module.RealBIMWeb.DelGroupAnchors(ancGroupName);
    }

    /**
     * 删除全部锚点
     */
    Module.Anchor.delAllAnc = function () {
        Module.RealBIMWeb.DelAllAnchors();
    }

    /**
     * 获取锚点总数
     */
    Module.Anchor.getAncNum = function () {
        return Module.RealBIMWeb.GetAnchorNum();
    }

    /**
     * c++锚点模型转换
     * @param {String} ancData //锚点数据
     */
    function convertAncInfo(ancData) {
        var ancInfo = new REAncInfo();
        ancInfo.ancName = ancData.m_strName;
        ancInfo.groupName = ancData.m_strGroupName;
        ancInfo.pos = ancData.m_vPos;
        ancInfo.picPath = ancData.m_cTexRegion.m_strTexPath;
        ancInfo.textInfo = ancData.m_cTextRegion.m_strText;
        ancInfo.linePos = ancData.m_vLineEnd;
        if (!isEmpty(ancData.m_uLineClr) && ancData.m_uLineClr != 0) ancInfo.lineClr = clrU32ToClr(ancData.m_uLineClr);
        if (!isEmpty(ancData.m_cTextRegion.m_uTextClr) && ancData.m_cTextRegion.m_uTextClr != 0) ancInfo.textClr = clrU32ToClr(ancData.m_cTextRegion.m_uTextClr);
        ancInfo.textBorderClr = clrU32ToClr(ancData.m_cTextRegion.m_uTextBorderClr);
        if (!isEmpty(ancData.m_cTextRegion.m_uTextBackClr) && ancData.m_cTextRegion.m_uTextBackClr != 0) ancInfo.textBackClr = clrU32ToClr(ancData.m_cTextRegion.m_uTextBackClr);
        ancInfo.selfAutoScaleDist = ancData.m_fSelfASDist;
        ancInfo.selfVisDist = ancData.m_fSelfVisDist;
        ancInfo.useLod = ancData.m_bUseLOD;
        if (ancData.m_cTextRegion.m_strGolFontID != "RealBIMFont001") ancInfo.fontName = ancData.m_cTextRegion.m_strGolFontID;
        if (!isEmpty(ancData.m_strAnimObjName) && ancData.m_strAnimObjName != "") ancInfo.animObjName = ancData.m_strAnimObjName;
        if (!isEmpty(ancData.m_uAnimBoneID) && ancData.m_uAnimBoneID != 0) ancInfo.animBoneID = ancData.m_uAnimBoneID;
        if (!isEmpty(ancData.m_cTexRegion.m_uFrameNumU) && ancData.m_cTexRegion.m_fFrameFreq != 0) ancInfo.picNum = ancData.m_cTexRegion.m_uFrameNumU;
        if (!isEmpty(ancData.m_cTexRegion.m_fFrameFreq) && ancData.m_cTexRegion.m_fFrameFreq != 0) ancInfo.playFrame = ancData.m_cTexRegion.m_fFrameFreq;

        return removeEmptyProperty(ancInfo);
    }

    /**
     * 获取某个锚点的信息
     * @param {String} ancName //锚点的名称
     */
    Module.Anchor.getAnc = function (ancName) {
        var _ancData = Module.RealBIMWeb.GetAnchor(ancName);
        return convertAncInfo(_ancData);
    }

    /**
     * 获取某个锚点组包含的所有锚点信息
     * @param {String} ancGroupName //锚点的组名称
     */
    Module.Anchor.getGroupAnc = function (ancGroupName) {
        var _allAncData = Module.RealBIMWeb.GetGroupAnchors(ancGroupName);
        var ancInfoList = [];
        for (var i = 0; i < _allAncData.size(); ++i) {
            ancInfoList.push(convertAncInfo(_allAncData.get(i)));
        }
        return ancInfoList;
    }

    /**
     * 获取系统中所有锚点信息
     */
    Module.Anchor.getAllAnc = function () {
        var _allAncData = Module.RealBIMWeb.GetAllAnchors();
        var ancInfoList = [];
        for (var i = 0; i < _allAncData.size(); ++i) {
            ancInfoList.push(convertAncInfo(_allAncData.get(i)));
        }
        return ancInfoList;
    }

    /**
     * 添加闪烁锚点
     * @param {Array} ancList //锚点信息集合（REAncInfo 类型）
     */
    Module.Anchor.addAnimAnc = function (ancList) {
        if (isEmptyLog(ancList, "ancList")) return false;
        var _tempAnchors = new Module.RE_Vector_ANCHOR();
        for (let i = 0; i < ancList.length; i++) {
            let ancInfo = ancList[i];

            var _groupname = "DefaultGroup"; if (!isEmpty(ancInfo.groupName)) { _groupname = ancInfo.groupName; }
            var _uselod = false; if (!isEmpty(ancInfo.useLod)) { _uselod = ancInfo.useLod; }
            var _animobjname = ""; if (!isEmpty(ancInfo.animObjName)) { _animobjname = ancInfo.animObjName; }
            var _animboneid = 0; if (!isEmpty(ancInfo.animBoneID)) { _animboneid = ancInfo.animBoneID; }
            var _linepos = [0, 0]; if (!isEmpty(ancInfo.linePos)) { _linepos = ancInfo.linePos; }
            var _lineclr = 0x00000000; if (!isEmpty(ancInfo.lineClr)) { _lineclr = clrToU32(ancInfo.lineClr); }
            var _size = 0; if (!isEmpty(ancInfo.ancSize)) { _size = ancInfo.ancSize; }
            var _selfASDist = -1; if (!isEmpty(ancInfo.selfAutoScaleDist)) { _selfASDist = ancInfo.selfAutoScaleDist; }
            var _selfVisDist = -1; if (!isEmpty(ancInfo.selfVisDist)) { _selfVisDist = ancInfo.selfVisDist; }
            var _textbias = [1, 0]; if (!isEmpty(ancInfo.texBias)) { _textbias = ancInfo.texBias; }
            var _texfocus = [0, 0]; if (!isEmpty(ancInfo.texFocus)) { _texfocus = ancInfo.texFocus; }
            var _GolFontID = "RealBIMFont001"; if (!isEmpty(ancInfo.fontName)) { _GolFontID = ancInfo.fontName; }
            var _textcolor = 0xff000000; if (!isEmpty(ancInfo.textClr)) { _textcolor = clrToU32(ancInfo.textClr); }
            var _textbordercolor = 0xff000000; if (!isEmpty(ancInfo.textBorderClr)) { _textbordercolor = clrToU32(ancInfo.textBorderClr); }
            var _textBackMode = 0; if (!isEmpty(ancInfo.textBackMode)) { _textBackMode = ancInfo.textBackMode; }
            var _textBackBorder = 0; if (!isEmpty(ancInfo.textBackBorder)) { _textBackBorder = ancInfo.textBackBorder; }
            var _textBackClr = 0x00000000; if (!isEmpty(ancInfo.textBackClr)) { _textBackClr = clrToU32(ancInfo.textBackClr); }
            var _picNum = 1; if (!isEmpty(ancInfo.picNum)) { _picNum = ancInfo.picNum; }
            var _playFrame = 0; if (!isEmpty(ancInfo.playFrame)) { _playFrame = ancInfo.playFrame; }

            var TempTextRect = [0, 0, 1, 1]; var TempTextFmtFlag = 0x40/*TEXT_FMT_NOCLIP*/;
            if (_textbias[0] < 0) {
                TempTextRect[0] = _linepos[0] - 1 - _texfocus[0]; TempTextRect[2] = _linepos[0] - _texfocus[0]; TempTextFmtFlag |= 0x20/*TEXT_FMT_RIGHT*/;
            } else if (_textbias[0] == 0) {
                //TempTextRect[0] =_linepos[0]-_texfocus[0]; TempTextRect[2] =_linepos[0]+1-_texfocus[0]; TempTextFmtFlag |=0x8/*TEXT_FMT_LEFT*/;
                TempTextRect[0] = _linepos[0] - _texfocus[0]; TempTextRect[2] = ancInfo.picWidth + _linepos[0] - _texfocus[0]; TempTextFmtFlag |= 0x10/*TEXT_FMT_HCENTER*/;
            } else {
                TempTextRect[0] = ancInfo.picWidth + _linepos[0] - _texfocus[0]; TempTextRect[2] = ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0]; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
            }
            if (_textbias[1] < 0) {
                TempTextRect[1] = _linepos[1] - 1 - _texfocus[1]; TempTextRect[3] = _linepos[1] - _texfocus[1]; TempTextFmtFlag |= 0x4/*TEXT_FMT_TOP*/;
            } else if (_textbias[1] == 0) {
                //TempTextRect[1] =_linepos[1]-_texfocus[1]; TempTextRect[3] =_linepos[1]+1-_texfocus[1]; TempTextFmtFlag |=0x1/*TEXT_FMT_BOTTOM*/;
                TempTextRect[1] = _linepos[1] - _texfocus[1]; TempTextRect[3] = ancInfo.picHeight + _linepos[1] - _texfocus[1]; TempTextFmtFlag |= 0x2/*TEXT_FMT_VCENTER*/;
            } else {
                TempTextRect[1] = ancInfo.picHeight + _linepos[1] - _texfocus[1]; TempTextRect[3] = ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1]; TempTextFmtFlag |= 0x1/*TEXT_FMT_BOTTOM*/;
            }

            var tempobj = {
                m_strGroupName: _groupname,
                m_strName: ancInfo.ancName,
                m_vPos: ancInfo.pos,
                m_bUseLOD: _uselod,
                m_strAnimObjName: _animobjname,
                m_uAnimBoneID: _animboneid,
                m_vLineEnd: _linepos,
                m_uLineClr: _lineclr,
                m_fSize: _size,
                m_fSelfASDist: _selfASDist,
                m_fSelfVisDist: _selfVisDist,
                m_cTexRegion: {
                    m_strTexPath: ancInfo.picPath,
                    m_qTexRect: [_linepos[0] - _texfocus[0], _linepos[1] - _texfocus[1], ancInfo.picWidth + _linepos[0] - _texfocus[0], ancInfo.picHeight + _linepos[1] - _texfocus[1]],
                    m_uTexClrMult: 0xffffffff,
                    m_vMinTexUV: [0.0, 0.0],
                    m_vMaxTexUV: [1.0 / _picNum, 1.0],
                    m_uFrameNumU: _picNum,
                    m_uFrameNumV: 1,
                    m_uFrameStrideU: ancInfo.picWidth,
                    m_uFrameStrideV: ancInfo.picHeight,
                    m_fFrameFreq: _playFrame,
                },
                m_cTextRegion: {
                    m_strGolFontID: _GolFontID,
                    m_bTextWeight: false,
                    m_strText: ancInfo.textInfo,
                    m_uTextClr: _textcolor,
                    m_uTextBorderClr: _textbordercolor,
                    m_qTextRect: TempTextRect,
                    m_uTextFmtFlag: TempTextFmtFlag,
                    m_uTextBackMode: _textBackMode, m_sTextBackBorder: _textBackBorder, m_uTextBackClr: _textBackClr
                }
            };
            _tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddAnchors(_tempAnchors);
    }

    /**
     * 停止闪烁
     * @param {String} ancName //锚点的名称
     */
    Module.Anchor.setAncAnimStop = function (ancName) {
        var _shpObjInfo = {
            m_uRGBBlendInfo: 0x00ffffff,
            m_uAlpha: 0,
            m_uAlphaAmp: 0,
            m_uForceAnimFrame: 0,
            m_uProbeMask: 1
        }
        return Module.RealBIMWeb.SetShpObjInfo(ancName, _shpObjInfo);
    }

    /**
     * 聚焦相机到指定的锚点
     * @param {String} ancName //锚点的名称
     * @param {Number} backwardAmp //相机在锚点中心处向后退的强度
     */
    Module.Anchor.setCamToAnc = function (ancName, backwardAmp) {
        Module.RealBIMWeb.FocusCamToAnchor(ancName, backwardAmp);
    }

    /**
     * 相机定位到组锚点
     * @param {String} groupName //锚点组的标识
     * @param {Number} backwardAmp //相机在锚点中心处向后退的强度
     */
    Module.Anchor.setCamToGroupAnc = function (groupName, backwardAmp) {
        Module.RealBIMWeb.FocusCamToAnchorGroup(groupName, backwardAmp);
    }

    /**
     * 获取所有的锚点分组名称
     */
    Module.Anchor.getAllAncGroupNames = function () {
        var _ancGroupName = Module.RealBIMWeb.GetAllAnchorGroupNames();
        var groupNameList = [];
        for (i = 0; i < _ancGroupName.size(); ++i) {
            groupNameList.push(_ancGroupName.get(i));
        }
        return groupNameList;
    }

    class REAncLODInfo {
        constructor() {
            this.groupName = null;//要聚合的锚点组的标识名，为空则表示所有的锚点对象
            this.lodLevel = null;//聚合层级，范围1~10,默认为1，表示不聚合
            this.useCustomBV = null;//是否用锚点的预估总包围盒，默认为false
            this.customBV = null;//锚点的预估总包围盒,默认为当前场景的总包围盒，二维数组[[Xmin,Ymin,Zmin],[Xmax,Ymax,Zmax]]，当useCustomBV为false时，此参数无效，填空数组即可;
            this.lodMergePxl = null;//锚点所在单元格进行LOD合并时的投影到屏幕的像素尺寸阈值
            this.lodMergeCap = null;//锚点所在单元格进行LOD合并时的单元格容积阈值
            this.mergeStyle = null;//点聚合后的样式 (REAncInfo 类型 参数选填)
        }
    }
    ExtModule.REAncLODInfo = REAncLODInfo;

    /**
     * 设置聚合锚点
     * @param {REAncLODInfo} ancLODInfo //聚合锚点信息
     */
    Module.Anchor.setAncLODInfo = function (ancLODInfo) {
        if (isEmptyLog(ancLODInfo, "ancLODInfo")) return;
        if (isEmptyLog(ancLODInfo.mergeStyle, "mergeStyle")) return;

        var _groupName = ""; if (!isEmpty(ancLODInfo.groupName)) { _groupName = ancLODInfo.groupName; }
        var _lodLevel = 1; if (!isEmpty(ancLODInfo.lodLevel)) { _lodLevel = ancLODInfo.lodLevel; }
        var _lodMergePxl = 100; if (!isEmpty(ancLODInfo.lodMergePxl)) { _lodMergePxl = ancLODInfo.lodMergePxl; }
        var _lodMergeCap = 2; if (!isEmpty(ancLODInfo.lodMergeCap)) { _lodMergeCap = ancLODInfo.lodMergeCap; }
        var _customBV = [[0, 0, 0], [0, 0, 0]]; if (ancLODInfo.useCustomBV) { _customBV = ancLODInfo.customBV; }
        var _linepos = [0, 0]; var _texfocus = [0, 0];
        var _textbias = [1, 0]; if (!isEmpty(ancLODInfo.mergeStyle.texBias)) { _textbias = ancLODInfo.mergeStyle.texBias; }
        var _GolFontID = "RealBIMFont001"; if (!isEmpty(ancLODInfo.mergeStyle.fontName) || ancLODInfo.mergeStyle.fontName != "") { _GolFontID = ancLODInfo.mergeStyle.fontName; }
        var _textcolor = 0xff000000; if (!isEmpty(ancLODInfo.mergeStyle.textClr)) { _textcolor = clrToU32(ancLODInfo.mergeStyle.textClr); }
        var _textbordercolor = 0xff000000; if (!isEmpty(ancLODInfo.mergeStyle.textBorderClr)) { _textbordercolor = clrToU32(ancLODInfo.mergeStyle.textBorderClr); }
        //设置文字和图片的对齐方式
        var TempTextRect = [0, 0, 1, 1]; var TempTextFmtFlag = 0x40/*TEXT_FMT_NOCLIP*/;
        if (_textbias[0] < 0) {
            TempTextRect[0] = _linepos[0] - 1 - _texfocus[0]; TempTextRect[2] = _linepos[0] - _texfocus[0]; TempTextFmtFlag |= 0x20/*TEXT_FMT_RIGHT*/;
        } else if (_textbias[0] == 0) {
            // TempTextRect[0] = _linepos[0] - _texfocus[0]; TempTextRect[2] = _linepos[0] + 1 - _texfocus[0]; TempTextFmtFlag |= 0x10/*TEXT_FMT_LEFT*/;
            TempTextRect[0] = _linepos[0] - _texfocus[0]; TempTextRect[2] = ancLODInfo.mergeStyle.picWidth + _linepos[0] - _texfocus[0]; TempTextFmtFlag |= 0x10/*TEXT_FMT_HCENTER*/;
        } else {
            TempTextRect[0] = ancLODInfo.mergeStyle.picWidth + _linepos[0] - _texfocus[0]; TempTextRect[2] = ancLODInfo.mergeStyle.picWidth + _linepos[0] + 1 - _texfocus[0]; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
        }
        if (_textbias[1] < 0) {
            TempTextRect[1] = _linepos[1] - 1 - _texfocus[1]; TempTextRect[3] = _linepos[1] - _texfocus[1]; TempTextFmtFlag |= 0x4/*TEXT_FMT_TOP*/;
        } else if (_textbias[1] == 0) {
            // TempTextRect[1] = _linepos[1] - _texfocus[1]; TempTextRect[3] = _linepos[1] + 1 - _texfocus[1]; TempTextFmtFlag |= 0x2/*TEXT_FMT_BOTTOM*/;
            TempTextRect[1] = _linepos[1] - _texfocus[1]; TempTextRect[3] = ancLODInfo.mergeStyle.picHeight + _linepos[1] - _texfocus[1]; TempTextFmtFlag |= 0x2/*TEXT_FMT_VCENTER*/;
        } else {
            TempTextRect[1] = ancLODInfo.mergeStyle.picHeight + _linepos[1] - _texfocus[1]; TempTextRect[3] = ancLODInfo.mergeStyle.picHeight + _linepos[1] + 1 - _texfocus[1]; TempTextFmtFlag |= 0x1/*TEXT_FMT_BOTTOM*/;
        }

        //创建一个锚点对象样式
        var tempobj = {
            m_strGroupName: _groupName,
            m_strName: "",
            m_vPos: [0, 0, 0],
            m_bUseLOD: false,
            m_strAnimObjName: "",
            m_uAnimBoneID: 0,
            m_vLineEnd: _linepos,
            m_uLineClr: 0x00000000,
            m_fSize: 0,
            m_fSelfASDist: -1,
            m_fSelfVisDist: -1,
            m_cTexRegion: {
                m_strTexPath: ancLODInfo.mergeStyle.picPath,
                m_qTexRect: [_linepos[0] - _texfocus[0], _linepos[1] - _texfocus[1], ancLODInfo.mergeStyle.picWidth + _linepos[0] - _texfocus[0], ancLODInfo.mergeStyle.picHeight + _linepos[1] - _texfocus[1]],
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
                m_uTextClr: _textcolor,
                m_uTextBorderClr: _textbordercolor,
                m_qTextRect: TempTextRect,
                m_uTextFmtFlag: TempTextFmtFlag,
                m_uTextBackMode: 0, m_sTextBackBorder: 0, m_uTextBackClr: 0x00000000
            }
        };
        Module.RealBIMWeb.SetAnchorLODInfo(_groupName, _lodLevel, ancLODInfo.useCustomBV, _customBV, _lodMergePxl, _lodMergeCap, tempobj);
    }

    /**
     * 取消锚点聚合
     * @param {String} groupName //锚点的组标识
     */
    Module.Anchor.resetAncLODInfo = function (groupName) {
        var _groupName = ""; if (!isEmpty(groupName)) { _groupName = groupName; }
        var mergestyle = {
            m_strGroupName: "",
            m_strName: "",
            m_vPos: [0, 0, 0],
            m_bUseLOD: false,
            m_strAnimObjName: "",
            m_uAnimBoneID: 0,
            m_vLineEnd: [0, 0],
            m_uLineClr: 0x00000000,
            m_fSize: 0,
            m_fSelfASDist: -1,
            m_fSelfVisDist: -1,
            m_cTexRegion: {
                m_strTexPath: "",
                m_qTexRect: [0, 0, 0, 0],
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
                m_qTextRect: [0, 0, 0, 0],
                m_uTextFmtFlag: 0,
                m_uTextBackMode: 0, m_sTextBackBorder: 0, m_uTextBackClr: 0x00000000
            }
        };
        Module.RealBIMWeb.SetAnchorLODInfo(_groupName, 1, false, [[0, 0, 0], [0, 0, 0]], 100, 1, mergestyle);
    }

    /**
     * 设置系统中锚点是否允许被场景遮挡
     * @param {String} groupName //锚点的组标识
     * @param {Boolean} enable //是否允许
     */
    Module.Anchor.setAncCanOverlap = function (groupName, enable) {
        Module.RealBIMWeb.SetAnchorContactSce(groupName, enable);
    }

    /**
     * 获取系统中锚点是否允许被场景遮挡
     * @param {String} groupName //锚点的组标识
     */
    Module.Anchor.getAncCanOverlap = function (groupName) {
        return Module.RealBIMWeb.GetAnchorContactSce(groupName);
    }

    /**
     * 设置系统中锚点的自动缩放距离
     * @param {String} groupName //锚点的组标识
     * @param {Number} dist //距离
     */
    Module.Anchor.setAncAutoScaleDist = function (groupName, dist) {
        Module.RealBIMWeb.SetAnchorAutoScaleDist(groupName, dist);
    }

    /**
     * 获取系统中锚点的自动缩放距离
     * @param {String} groupName //锚点的组标识
     */
    Module.Anchor.getAncAutoScaleDist = function (groupName) {
        return Module.RealBIMWeb.GetAnchorAutoScaleDist(groupName);
    }

    /**
     * 设置系统中锚点的最远可视距离
     * @param {String} groupName //锚点的组标识
     * @param {Number} dist //距离
     */
    Module.Anchor.setAncVisDist = function (groupName, dist) {
        Module.RealBIMWeb.SetAnchorVisDist(groupName, dist);
    }

    /**
     * 获取系统中锚点的最远可视距离
     * @param {String} groupName //锚点的组标识
     */
    Module.Anchor.getAncVisDist = function (groupName) {
        return Module.RealBIMWeb.GetAnchorVisDist(groupName);
    }



    // MOD-- 几何图形（Geometry）
    Module.Geometry = typeof Module.Geometry !== "undefined" ? Module.Geometry : {};//增加 Geometry 模块

    class REShpTextInfo {
        constructor() {
            this.text = null;//表示文字的内容
            this.texBias = null;//表示锚点文字与图片的相对位置，二维数组： 第一维-1、0、1分别表示文字在点的左侧、中间、右侧； 第二维-1、0、1分别表示文字在点的下侧、中间、上侧
            this.fontName = null;//表示锚点的字体样式
            this.textClr = null;//文字颜色（REColor 类型）
            this.textBorderClr = null;//文字边框颜色（REColor 类型）
            this.textBackMode = null;//表示文字背景的处理模式： 0：表示禁用文字背景 1：表示启用文字背景，文字背景是文字所占的矩形区域
            this.textBackBorder = null;//表示文字背景的边界带的像素宽度
            this.textBackClr = null;//表示文本背景色（REColor 类型）
        }
    }
    ExtModule.REShpTextInfo = REShpTextInfo;

    class REPotShpInfo {
        constructor() {
            this.shpName = null;//矢量标识名，若已有同名的矢量则覆盖之
            this.pos = null;//表示顶点位置
            this.potSize = null;//示顶点的像素大小
            this.potClr = null;//顶点的颜色（REColor 类型）
            this.textInfo = null;//表示顶点的文字标注信息（REShpTextInfo 类型）
            this.scrASDist = null;//表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null;//表示屏幕空间矢量的可视距离
            this.contactSce = null;//表示矢量是否与场景发生深度遮挡
        }
    }
    ExtModule.REPotShpInfo = REPotShpInfo;

    /**
     * 创建自定义顶点矢量
     * @param {REPotShpInfo} potShpInfo //矢量点信息（REPotShpInfo 类型）
     */
    Module.Geometry.addPotShp = function (potShpInfo) {
        if (isEmptyLog(potShpInfo, "potShpInfo")) return;
        if (isEmptyLog(potShpInfo.shpName, "shpName")) return;
        if (isEmptyLog(potShpInfo.textInfo, "textInfo")) return;

        var _textInfo = potShpInfo.textInfo;

        var _texBias = [0, 0]; if (!isEmpty(_textInfo.texBias)) { _texBias = _textInfo.texBias; }
        var _GolFontID = "RealBIMFont001"; if (!isEmpty(_textInfo.fontName)) { _GolFontID = _textInfo.fontName; }
        var _textcolor = 0xffffffff; if (!isEmpty(_textInfo.textClr)) { _textcolor = clrToU32(_textInfo.textClr); }
        var _textbordercolor = 0xff000000; if (!isEmpty(_textInfo.textBorderClr)) { _textbordercolor = clrToU32(_textInfo.textBorderClr); }
        var _textBackMode = 0; if (!isEmpty(_textInfo.textBackMode)) { _textBackMode = _textInfo.textBackMode; }
        var _textBackBorder = 0; if (!isEmpty(_textInfo.textBackBorder)) { _textBackBorder = _textInfo.textBackBorder; }
        var _textBackClr = 0x00000000; if (!isEmpty(_textInfo.textBackClr)) { _textBackClr = clrToU32(_textInfo.textBackClr); }

        var TempTextRect = [-1, -1, 1, 1]; var TempTextFmtFlag = 0x40/*TEXT_FMT_NOCLIP*/;
        var uPotSize = 0; if (!isEmpty(potShpInfo.potSize)) uPotSize = potShpInfo.potSize;
        if (_texBias[0] < 0) {
            TempTextRect[0] = -uPotSize - 2; TempTextRect[2] = -uPotSize - 1; TempTextFmtFlag |= 0x20/*TEXT_FMT_RIGHT*/;
        } else if (_texBias[0] == 0) {
            TempTextRect[0] = -1; TempTextRect[2] = 1; TempTextFmtFlag |= 0x10/*TEXT_FMT_HCENTER*/;
        } else {
            TempTextRect[0] = uPotSize + 1; TempTextRect[2] = uPotSize + 2; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
        }
        if (_texBias[1] < 0) {
            TempTextRect[1] = -uPotSize - 2; TempTextRect[3] = -uPotSize - 1; TempTextFmtFlag |= 0x4/*TEXT_FMT_TOP*/;
        } else if (_texBias[1] == 0) {
            TempTextRect[1] = -1; TempTextRect[3] = 1; TempTextFmtFlag |= 0x2/*TEXT_FMT_VCENTER*/;
        } else {
            TempTextRect[1] = uPotSize + 1; TempTextRect[3] = uPotSize + 2; TempTextFmtFlag |= 0x1/*TEXT_FMT_BOTTOM*/;
        }

        var textobj = {
            m_strGolFontID: _GolFontID,
            m_bTextWeight: false,
            m_strText: _textInfo.text,
            m_uTextClr: _textcolor,
            m_uTextBorderClr: _textbordercolor,
            m_qTextRect: TempTextRect,
            m_uTextFmtFlag: TempTextFmtFlag,
            m_uTextBackMode: _textBackMode, m_sTextBackBorder: _textBackBorder, m_uTextBackClr: _textBackClr
        };

        var _bContactSce = false; if (!isEmpty(potShpInfo.contactSce)) _bContactSce = potShpInfo.contactSce;
        var _uClr = 0xFFFFFFFF; if (!isEmpty(potShpInfo.potClr)) _uClr = clrToU32(potShpInfo.potClr);

        return Module.RealBIMWeb.AddCustomPotShp(potShpInfo.shpName, potShpInfo.pos, uPotSize, _uClr, textobj, potShpInfo.scrASDist, potShpInfo.scrVisDist, _bContactSce);
    }



    class RELineShpInfo {
        constructor() {
            this.shpName = null;//矢量标识名，若已有同名的矢量则覆盖之
            this.potList = null;//表示多边形折线序列
            this.fillState = null;//表示折线的填充状态 0->多边形不填充； 1->多边形首尾相连构成封闭区域进行填充； 2->多边形首尾相连构成封闭区域进行填充(顶点高度自动修改为同一高度，默认为第一个顶点的高度)
            this.lineClr = null;//表示多边形的颜色（REColor 类型）
            this.fillClr = null;//表示多边形的填充颜色（REColor 类型）
            this.textPos = null;//表示多边形的文字标注的位置： >=0时，整数部分i/小数部分j：表示文字定位点在线段<i,i+1>上的偏移了长度百分比j [-1,0)表示文字定位在折线上并从首端点偏移折线总长度的百分比 -2表示文字定位在多边形所有顶点的中心位置处
            this.scrASDist = null;//表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null;//表示屏幕空间矢量的可视距离
            this.contactSce = null;//表示矢量是否与场景发生深度遮挡
            this.lineWidth = null;//选填项；表示线宽，可以设为1或2，单位为像素；默认线宽为1个像素
            this.textInfo = null;//表示顶点的文字标注信息（REShpTextInfo 类型）
        }
    }
    ExtModule.RELineShpInfo = RELineShpInfo;

    /**
     * 创建自定义多边形折线矢量
     * @param {RELineShpInfo} lineShpInfo //矢量线信息（RELineShpInfo 类型）
     */
    Module.Geometry.addPolylineShp = function (lineShpInfo) {
        if (isEmptyLog(lineShpInfo, "lineShpInfo")) return;
        if (isEmptyLog(lineShpInfo.shpName, "shpName")) return;
        if (!checkTypeLog(lineShpInfo.potList, "potList", RE_Enum.RE_Check_Array)) return;
        if (isEmptyLog(lineShpInfo.textInfo, "textInfo")) return;

        var _textInfo = lineShpInfo.textInfo;

        var _texBias = [0, 0]; if (!isEmpty(_textInfo.texBias)) { _texBias = _textInfo.texBias; }
        var _GolFontID = "RealBIMFont001"; if (!isEmpty(_textInfo.fontName)) { _GolFontID = _textInfo.fontName; }
        var _textcolor = 0xffffffff; if (!isEmpty(_textInfo.textClr)) { _textcolor = clrToU32(_textInfo.textClr); }
        var _textbordercolor = 0xff000000; if (!isEmpty(_textInfo.textBorderClr)) { _textbordercolor = clrToU32(_textInfo.textBorderClr); }
        var _textBackMode = 0; if (!isEmpty(_textInfo.textBackMode)) { _textBackMode = _textInfo.textBackMode; }
        var _textBackBorder = 0; if (!isEmpty(_textInfo.textBackBorder)) { _textBackBorder = _textInfo.textBackBorder; }
        var _textBackClr = 0x00000000; if (!isEmpty(_textInfo.textBackClr)) { _textBackClr = clrToU32(_textInfo.textBackClr); }

        var _temparrpos = new Module.RE_Vector_dvec3();
        for (var i = 0; i < lineShpInfo.potList.length; ++i) {
            _temparrpos.push_back(lineShpInfo.potList[i]);
        }

        var TempTextRect = [-1, -1, 1, 1]; var TempTextFmtFlag = 0x40/*TEXT_FMT_NOCLIP*/;
        if (_texBias[0] < 0) {
            TempTextRect[0] = -1; TempTextRect[2] = 0; TempTextFmtFlag |= 0x20/*TEXT_FMT_RIGHT*/;
        } else if (_texBias[0] == 0) {
            TempTextRect[0] = -1; TempTextRect[2] = 1; TempTextFmtFlag |= 0x10/*TEXT_FMT_LEFT*/;
        } else {
            TempTextRect[0] = 0; TempTextRect[2] = 1; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
        }
        if (_texBias[1] < 0) {
            TempTextRect[1] = -1; TempTextRect[3] = 0; TempTextFmtFlag |= 0x4/*TEXT_FMT_TOP*/;
        } else if (_texBias[1] == 0) {
            TempTextRect[1] = -1; TempTextRect[3] = 1; TempTextFmtFlag |= 0x2/*TEXT_FMT_BOTTOM*/;
        } else {
            TempTextRect[1] = 0; TempTextRect[3] = 1; TempTextFmtFlag |= 0x1/*TEXT_FMT_BOTTOM*/;
        }

        var textobj = {
            m_strGolFontID: _GolFontID,
            m_bTextWeight: false,
            m_strText: isEmpty(_textInfo.text) ? "" : _textInfo.text,
            m_uTextClr: _textcolor,
            m_uTextBorderClr: _textbordercolor,
            m_qTextRect: TempTextRect,
            m_uTextFmtFlag: TempTextFmtFlag,
            m_uTextBackMode: _textBackMode, m_sTextBackBorder: _textBackBorder, m_uTextBackClr: _textBackClr
        };

        var _bContactSce = false; if (!isEmpty(lineShpInfo.contactSce)) _bContactSce = lineShpInfo.contactSce;
        var _uClr = 0xFFFFFFFF; if (!isEmpty(lineShpInfo.lineClr)) _uClr = clrToU32(lineShpInfo.lineClr);
        var _uFillClr = 0xFFFFFFFF; if (!isEmpty(lineShpInfo.fillClr)) _uFillClr = clrToU32(lineShpInfo.fillClr);
        var _fillState = 0; if (!isEmpty(lineShpInfo.fillState)) _fillState = lineShpInfo.fillState;
        var _linewidth = 1; if (!isEmpty(lineShpInfo.lineWidth)) _linewidth = lineShpInfo.lineWidth;
        var _fTextPos = -2; if (!isEmpty(lineShpInfo.textPos)) _fTextPos = lineShpInfo.textPos;

        return Module.RealBIMWeb.AddCustomPolylineShp(lineShpInfo.shpName, _temparrpos, _fillState, _uClr, _uFillClr, _fTextPos, textobj, lineShpInfo.scrASDist, lineShpInfo.scrVisDist, _bContactSce, _linewidth);
    }

    class REFenceShpInfo {
        constructor() {
            this.shpName = null;//矢量标识名，若已有同名的矢量则覆盖之
            this.potList = null;//表示多边形折线序列 xyzw, w分量表示端点处的围栏高度
            this.isClose = null;//表示是否闭合
            this.fenceClr = null;//表示多边形围栏的颜色（REColor 类型）
            this.scrASDist = null;//表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null;//表示屏幕空间矢量的可视距离
            this.contactSce = null;//表示矢量是否与场景发生深度遮挡
        }
    }
    ExtModule.REFenceShpInfo = REFenceShpInfo;

    /**
     * 创建自定义多边形围栏矢量
     * @param {REFenceShpInfo} fenceShpInfo //矢量围栏信息（REFenceShpInfo 类型）
     */
    Module.Geometry.addPolyFenceShp = function (fenceShpInfo) {
        if (isEmptyLog(fenceShpInfo, "fenceShpInfo")) return;
        if (isEmptyLog(fenceShpInfo.shpName, "shpName")) return;
        if (!checkTypeLog(fenceShpInfo.potList, "potList", RE_Enum.RE_Check_Array)) return;

        var _temparrpos = new Module.RE_Vector_dvec4();
        for (var i = 0; i < fenceShpInfo.potList.length; ++i) {
            _temparrpos.push_back(fenceShpInfo.potList[i]);
        }

        var _bContactSce = false; if (!isEmpty(fenceShpInfo.contactSce)) _bContactSce = fenceShpInfo.contactSce;
        var _uClr = 0xFFFFFFFF; if (!isEmpty(fenceShpInfo.fenceClr)) _uClr = clrToU32(fenceShpInfo.fenceClr);

        return Module.RealBIMWeb.AddCustomPolyFenceShp(fenceShpInfo.shpName, _temparrpos, fenceShpInfo.isClose, _uClr, fenceShpInfo.scrASDist, fenceShpInfo.scrVisDist, _bContactSce);
    }

    /**
     * 删除某个自定义矢量对象
     * @param {String} shpName //矢量标识名
     */
    Module.Geometry.delShp = function (shpName) {
        return Module.RealBIMWeb.DelCustomShp(shpName);
    }

    /**
     * 清空所有的自定义矢量对象
     */
    Module.Geometry.delAllShps = function () {
        Module.RealBIMWeb.DelAllCustomShps();
    }

    /**
     * 设置自定义矢量对象的颜色
     * @param {String} shpName //矢量标识名
     * @param {REColor} shpClr //颜色（REColor 类型）
     */
    Module.Geometry.setShpClr = function (shpName, shpClr) {
        if (isEmptyLog(shpName, 'shpName')) return;
        if (isEmptyLog(shpClr, 'shpClr')) return;
        Module.RealBIMWeb.SetCustomShpColor(shpName, clrToU32(shpClr));
    }

    /**
     * 聚焦相机到指定的矢量对象
     * @param {String} shpName //矢量标识名
     * @param {Number} backwardAmp //表示相机在锚点中心处向后退的强度
     */
    Module.Geometry.setCamToShp = function (shpName, backwardAmp) {
        if (isEmptyLog(shpName, 'shpName')) return;
        Module.RealBIMWeb.FocusCamToCustomShp(shpName, backwardAmp);
    }

    /**
     * 设置矢量是否允许顶点捕捉
     * @param {Boolean} enable //是否允许
     */
    Module.Geometry.setShpPotCapture = function (enable) {
        Module.RealBIMWeb.SetShpPotCapture(enable);
    }

    /**
     * 获取矢量是否允许顶点捕捉
     */
    Module.Geometry.getShpPotCapture = function () {
        return Module.RealBIMWeb.GetShpPotCapture();
    }

    /**
     * 判断顶点集合是否在指定的构件集合内，并返还不在指定构件集合内的顶点集合
     * @param {String} dataSetId //表示要处理的数据集，为空串则表示处理所有数据集
     * @param {Array} elemIdList //表示要处理的构件id数组，若为空串则表示处理所有的构件id
     * @param {Array} potList //表示要判断的顶点集合
     */
    Module.Geometry.getPotsNotInElems = function (dataSetId, elemIdList, potList) {
        var _ObjCount = elemIdList.length;
        var projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        //处理顶点集合对应数据类型
        var _temparrpos = new Module.RE_Vector_dvec3();
        for (var i = 0; i < potList.length; ++i) {
            _temparrpos.push_back(potList[i]);
        }

        if (_ObjCount == 0) {
            //如果构件ID集合为空，则默认为所有构件
            Module.RealBIMWeb.GetPotsNotInHugeObjSubElems(dataSetId, 0xffffffff, 0, _temparrpos);
        }
        else {
            var _obgCountByte8 = (_ObjCount * 8).toString();//创建的观察窗口的字节大小
            Module.RealBIMWeb.ReAllocHeapViews(_obgCountByte8);//分配一系列堆内存块的观察窗口
            var elemIds = Module.RealBIMWeb.GetHeapView_U32(0);//获取一个堆内存块的观察窗口
            for (let i = 0; i < _ObjCount; i++) {
                var eleid = elemIdList[i];
                elemIds.set([eleid, projid], i * 2);
            }
            Module.RealBIMWeb.GetPotsNotInHugeObjSubElems(dataSetId, elemIds.byteLength, elemIds.byteOffset, _temparrpos);
        }

        //创建接收不在构件内的顶点集合
        var potsNotInElems = [];
        for (let i = 0; i < _temparrpos.size(); i++) {
            potsNotInElems.push(_temparrpos.get(i));
        }

        return potsNotInElems;
    }




    // MOD-- 填挖方（Earthwork）
    Module.Earthwork = typeof Module.Earthwork !== "undefined" ? Module.Earthwork : {};//增加 Earthwork 模块


    /**
     * 进入土方测量区域绘制状态
     */
    Module.Earthwork.startCreate = function () {
        Module.RealBIMWeb.EnterEarthworkCreateMode();
    }

    /**
     * 退出土方测量区域绘制状态
     */
    Module.Earthwork.endCreate = function () {
        Module.RealBIMWeb.ExitEarthworkCreateMode();
    }

    /**
     * 获取土方测量绘制区域的顶点数组, 监听到 REEarthworkRgnFinish 时间后即可获取，获取一次后系统会将顶点信息清除
     */
    Module.Earthwork.getCnrsOfEarthworkRgn = function () {
        var _pos = Module.RealBIMWeb.GetCnrsOfEarthworkRgn();
        var _cnrCoords = [];
        for (let i = 0; i < _pos.size(); ++i) {
            _cnrCoords.push(_pos.get(i));
        }
        return _cnrCoords;
    }

    /**
     * 进行指定区域的填挖方计算
     * @param {Array} potList //挖填方区域顶点信息
     * @param {Number} elevation //挖填方高度
     * @param {String} dataSetId //参与计算的数据集标识
     */
    Module.Earthwork.parseData = function (potList, elevation, dataSetId) {
        if (isEmptyLog(potList, 'potList')) return;
        if (isEmptyLog(elevation, 'elevation')) return;
        if (isEmptyLog(dataSetId, 'dataSetId')) return;

        var temparrpos = new Module.RE_Vector_dvec3();
        for (var i = 0; i < potList.length; ++i) {
            temparrpos.push_back(potList[i]);
        }
        Module.RealBIMWeb.CalcEarthworkValues(temparrpos, elevation, dataSetId, "", 9);
    }



    // MOD-- BIM（BIM）
    Module.BIM = typeof Module.BIM !== "undefined" ? Module.BIM : {};//增加 BIM 模块

    class REElemBlendAttr {
        constructor() {
            this.dataSetId = null;//数据集标识
            this.elemIdList = null;//构件id集合
            this.elemClr = null;//构件颜色（REColor 类型）
            this.clrWeight = null;//颜色权重
            this.alphaWeight = null;//透明度权重
            this.elemEmis = null;//	表示构件的自发光强度，0~255
            this.elemEmisPercent = null;//	表示构件自发光强度所占的权重，0~255
            this.elemSmooth = null;//	表示构件的光泽度，0~255
            this.elemMetal = null;//	表示构件的金属质感，0~255
            this.elemSmmePercent = null;//	表示光泽度和金属质感的权重，0~255
        }
    }
    ExtModule.REElemBlendAttr = REElemBlendAttr;

    class REElemAttr {
        constructor() {
            this.dataSetId = null;//数据集标识
            this.elemIdList = null;//构件id集合 
            this.elemClr = new REColor(-1, -1, -1, -1);//构件颜色（REColor 类型）alpha==-1代表只改变颜色不改变透明度
            this.clrWeight = 255;//颜色权重, 此权重要使用必须配合颜色值存在
            this.alphaWeight = 255;//透明度权重, 此权重要使用必须配合透明度值存在
            this.elemEmis = 0;//	表示构件的自发光强度，0~255
            this.elemEmisPercent = 0;//	表示构件自发光强度所占的权重，0~255
            this.elemSmooth = 0;//	表示构件的光泽度，0~255
            this.elemMetal = 0;//	表示构件的金属质感，0~255
            this.elemSmmePercent = 0;//	表示光泽度和金属质感的权重，0~255
        }
    }
    ExtModule.REElemAttr = REElemAttr;



    // MARK 构件属性
    /**
     * 设置构件混合属性
     * @param {REElemAttr} elemAttr //构件的属性
     */
    Module.BIM.setElemAttr = function (elemAttr) {
        if (isEmptyLog(elemAttr, "elemAttr")) return;
        if (isEmptyLog(elemAttr.dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemAttr.elemIdList, "elemIdList")) return;

        var _elemScope = 0; if (!isEmpty(elemAttr.elemScope)) { _elemScope = elemAttr.elemScope; }

        var _clr = 0x000000ff;
        var _alpha = 0x0080ffff;
        if (!isEmpty(elemAttr.elemClr)) {
            if (elemAttr.elemClr.red == -1 || elemAttr.elemClr.green == -1 || elemAttr.elemClr.blue == -1) {
                //不调整颜色
                _clr = 0x000000ff;
            } else {
                _clr = clrToU32_W_WBGR(elemAttr.elemClr, elemAttr.clrWeight);
            }

            if (elemAttr.elemClr.alpha == -1) {
                //不改变透明度
                _alpha = 0x0080ff00;
            } else {
                _alpha = alphaToU32_WA_UseCA(elemAttr.elemClr.alpha, elemAttr.alphaWeight, true, true);
            }
        }
        var _pbr = convPBR(elemAttr);

        if (elemAttr.dataSetId == "") {
            //多数据集设置
            var _moemory = (24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, 0, _clr, _pbr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("", "", 0xffffffff, _clrs.byteOffset, _elemScope);
        }
        else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(elemAttr.dataSetId);
            var _count = elemAttr.elemIdList.length;
            if (_count == 0) {
                //如果构件ID集合为空，则默认为改变所有构件的信息
                var _moemory = (24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                _clrs.set([0, _projid, _alpha, 0, _clr, _pbr], 0);
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(elemAttr.dataSetId, "", 0xffffffff, _clrs.byteOffset, _elemScope);
            }
            else {
                var _moemory = (_count * 24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                for (i = 0; i < _count; ++i) {
                    _clrs.set([elemAttr.elemIdList[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
                }
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(elemAttr.dataSetId, "", _clrs.byteLength, _clrs.byteOffset, _elemScope);
            }
        }
    }

    /**
     * 获取当前构件设置的混合属性
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     */
    Module.BIM.getElemAttr = function (dataSetId, elemIdList) {
        if (isEmpty(dataSetId) || dataSetId == "") { logParErr("dataSetId"); return; }
        if (isEmptyLog(elemIdList)) return;

        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var _elemIdListTemp = (elemIdList.length == 0) ? Module.BIM.getDataSetAllElemIDs(dataSetId, false) : elemIdList;
        var _count = _elemIdListTemp.length;
        var _moemory = (_count * 16).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
        var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _count; ++i) {
            var eleid = _elemIdListTemp[i];
            _clrs.set([eleid, _projid, 0x00000000, 0x00000000], i * 4);
        }
        var clrinfoarr = Module.RealBIMWeb.GetHugeObjSubElemClrInfos(dataSetId, "", _clrs.byteLength, _clrs.byteOffset);
        var elemAttrList = [];
        for (var i = 0; i < clrinfoarr.length; i += 4) {
            let elemAttrInfo = {};
            elemAttrInfo.elemId = clrinfoarr[i];
            let red = parseInt((clrinfoarr[i + 3]).toString(16).substring(6, 8), 16);
            let green = parseInt((clrinfoarr[i + 3]).toString(16).substring(4, 6), 16);
            let blue = parseInt((clrinfoarr[i + 3]).toString(16).substring(2, 4), 16);
            let alpha = parseInt((clrinfoarr[i + 2]).toString(16).substring(2, 4), 16);
            elemAttrInfo.elemClr = new REColor(red, green, blue, alpha);
            elemAttrInfo.alphaWeight = parseInt((clrinfoarr[i + 2]).toString(16).substring(0, 2), 16);
            elemAttrInfo.clrWeight = parseInt((clrinfoarr[i + 3]).toString(16).substring(0, 2), 16);
            elemAttrList.push(elemAttrInfo);
        }
        return elemAttrList;
    }



    /**
     * 设置构件颜色 ------------(新接口代替废弃)
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {REColor} elemClr //构件颜色（REColor 类型）
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.setElemClr = function (dataSetId, elemIdList, elemClr, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;
        if (isEmptyLog(elemClr, "elemClr")) return;
        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }
        var _clr = clrToU32_WBGR(elemClr);

        if (dataSetId == "") {
            //多数据集设置
            if (isEmpty(elemClr.alpha) || elemClr.alpha == -1) { logErr("设置所有数据集的构件颜色需要包含透明度！"); return; }
            var _alpha = alphaToU32_WA(elemClr.alpha);
            var _moemory = (16).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, _clr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfos("", "", 0xffffffff, _clrs.byteOffset, _elemScope);
        }
        else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                //如果构件ID集合为空，则默认为改变所有构件的信息
                if (isEmpty(elemClr.alpha) || elemClr.alpha == -1) { logErr("设置数据集内所有构件颜色需要包含透明度！"); return; }
                var _alpha = alphaToU32_WA(elemClr.alpha);
                var _moemory = (16).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                _clrs.set([0, _projid, _alpha, _clr], 0);
                Module.RealBIMWeb.SetHugeObjSubElemClrInfos(dataSetId, "", 0xffffffff, _clrs.byteOffset, _elemScope);
            }
            else {
                var _elemAttrInfo = Module.BIM.getElemClr(dataSetId, elemIdList);
                var _moemory = (_count * 16).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                for (i = 0; i < _count; ++i) {
                    var _alpha;
                    if (isEmpty(elemClr.alpha) || elemClr.alpha == -1) {
                        //单独设置颜色不改变透明度
                        _alpha = alphaToU32_WA(_elemAttrInfo[i].elemClr.alpha);
                    } else {
                        _alpha = alphaToU32_WA(elemClr.alpha);
                    }
                    _clrs.set([elemIdList[i], _projid, _alpha, _clr], i * 4);
                }
                Module.RealBIMWeb.SetHugeObjSubElemClrInfos(dataSetId, "", _clrs.byteLength, _clrs.byteOffset, _elemScope);
            }
        }
    }

    /**
     * 获取当前构件设置的颜色 ------------(新接口代替废弃)
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     */
    Module.BIM.getElemClr = function (dataSetId, elemIdList) {
        if (isEmpty(dataSetId) || dataSetId == "") { logParErr("dataSetId"); return; }
        if (isEmpty(elemIdList) || elemIdList.length == 0) { logParErr("elemIdList"); return; }

        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var _count = elemIdList.length;
        var _moemory = (_count * 16).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
        var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _count; ++i) {
            var eleid = elemIdList[i];
            _clrs.set([eleid, _projid, 0x00000000, 0x00000000], i * 4);
        }
        var clrinfoarr = Module.RealBIMWeb.GetHugeObjSubElemClrInfos(dataSetId, "", _clrs.byteLength, _clrs.byteOffset);
        var elemClrList = [];
        for (var i = 0; i < clrinfoarr.length; i += 4) {
            let elemClrInfo = {};
            elemClrInfo.elemId = clrinfoarr[i];
            let red = parseInt((clrinfoarr[i + 3]).toString(16).substring(6, 8), 16);
            let green = parseInt((clrinfoarr[i + 3]).toString(16).substring(4, 6), 16);
            let blue = parseInt((clrinfoarr[i + 3]).toString(16).substring(2, 4), 16);
            let alpha = parseInt((clrinfoarr[i + 2]).toString(16).substring(2, 4), 16);
            elemClrInfo.elemClr = new REColor(red, green, blue, alpha);
            elemClrList.push(elemClrInfo);
        }
        return elemClrList;
    }

    /**
     * 单独改变构件集合透明度信息，颜色保持不变
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} elemAlpha //构件透明度，取值范围0~255
     * @param {Number} alphaWeight //透明度权重，取值范围0~255
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.setElemAlpha = function (dataSetId, elemIdList, elemAlpha, alphaWeight, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;

        var _alphaWeight = 255; if (!isEmpty(alphaWeight)) _alphaWeight = alphaWeight;
        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }
        var _alpha = alphaToU32_WA_UseCA(elemAlpha, _alphaWeight, false, true);
        var _clr = 0x000000ff;
        var _pbr = 0x00000000;

        if (dataSetId == "") {
            //多数据集设置
            var _moemory = (24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, 0, _clr, _pbr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfos("", "", 0xffffffff, _clrs.byteOffset, _elemScope);
        }
        else {
            //指定数据集设置
            var _elemIdListTemp = (elemIdList.length == 0) ? Module.BIM.getDataSetAllElemIDs(dataSetId, false) : elemIdList;
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = _elemIdListTemp.length;
            var _moemory = (_count * 24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            for (i = 0; i < _count; ++i) {
                _clrs.set([_elemIdListTemp[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
            }
            Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, "", (_elemIdListTemp.length) ? _clrs.byteLength : 0xffffffff, _clrs.byteOffset, _elemScope);
        }
    }

    /**
     * 恢复构件的默认属性
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.resetElemAttr = function (dataSetId, elemIdList, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;

        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }
        var _clr = 0x000000ff;
        var _alpha = 0x0080ffff;
        var _pbr = 0x00000000;

        if (dataSetId == "") {
            //多数据集设置
            var _moemory = (24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);  //分配空间
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, 0, _clr, _pbr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("", "", 0xffffffff, _clrs.byteOffset, _elemScope);
        }
        else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                //如果构件ID集合为空，则默认为改变所有构件的信息
                var _moemory = (24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                _clrs.set([0, _projid, _alpha, 0, _clr, _pbr], 0);
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, "", 0xffffffff, _clrs.byteOffset, _elemScope);
            }
            else {
                var _moemory = (_count * 24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                for (i = 0; i < _count; ++i) {
                    _clrs.set([elemIdList[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
                }
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, "", _clrs.byteLength, _clrs.byteOffset, _elemScope);
            }
        }
    }

    /**
     * 设置构件混合属性 ------------(新接口代替废弃)
     * @param {REElemBlendAttr} elemBlendAttr //构件的混合属性
     */
    Module.BIM.setElemBlendAttr = function (elemBlendAttr) {
        if (isEmptyLog(elemBlendAttr, "elemBlendAttr")) return;
        if (isEmptyLog(elemBlendAttr.dataSetId, "dataSetId")) return;
        // if (isEmptyLog(elemBlendAttr.elemClr, "elemClr")) return;

        var _elemScope = 0; if (!isEmpty(elemBlendAttr.elemScope)) { _elemScope = elemBlendAttr.elemScope; }

        var _clr = clrToU32_W_WBGR(elemBlendAttr.elemClr, elemBlendAttr.clrWeight);
        var _alpha = alphaToU32_WA(elemBlendAttr.elemClr.alpha, elemBlendAttr.alphaWeight);
        var _pbr = convPBR(elemBlendAttr);

        if (elemBlendAttr.dataSetId == "") {
            //多数据集设置
            var _moemory = (24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, 0, _clr, _pbr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("", "", 0xffffffff, _clrs.byteOffset, _elemScope);
        }
        else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(elemBlendAttr.dataSetId);
            var _count = elemBlendAttr.elemIdList.length;
            if (_count == 0) {
                //如果构件ID集合为空，则默认为改变所有构件的信息
                var _moemory = (24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                _clrs.set([0, _projid, _alpha, 0, _clr, _pbr], 0);
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(elemBlendAttr.dataSetId, "", 0xffffffff, _clrs.byteOffset, _elemScope);
            }
            else {
                var _moemory = (_count * 24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                for (i = 0; i < _count; ++i) {
                    _clrs.set([elemBlendAttr.elemIdList[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
                }
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(elemBlendAttr.dataSetId, "", _clrs.byteLength, _clrs.byteOffset, _elemScope);
            }
        }
    }

    /**
     * 恢复构件的默认属性 ------------(新接口代替废弃)
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.resetElemBlendAttr = function (dataSetId, elemIdList, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;

        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }
        var _clr = 0x000000ff;
        var _alpha = 0x0080ffff;
        var _pbr = 0x00000000;

        if (dataSetId == "") {
            //多数据集设置
            var _moemory = (24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);  //分配空间
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, 0, _clr, _pbr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("", "", 0xffffffff, _clrs.byteOffset, _elemScope);
        }
        else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                //如果构件ID集合为空，则默认为改变所有构件的信息
                var _moemory = (24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                _clrs.set([0, _projid, _alpha, 0, _clr, _pbr], 0);
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, "", 0xffffffff, _clrs.byteOffset, _elemScope);
            }
            else {
                var _moemory = (_count * 24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                for (i = 0; i < _count; ++i) {
                    _clrs.set([elemIdList[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
                }
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, "", _clrs.byteLength, _clrs.byteOffset, _elemScope);
            }
        }
    }

    /**
     * 根据id判断一个构件是否被设为透明
     * @param {String} dataSetId //数据集标识
     * @param {Number} elemId //构件id
     */
    Module.BIM.getElemHideState = function (dataSetId, elemId) {
        if (isEmpty(dataSetId) || dataSetId == "") { logParErr("dataSetId"); return; }
        if (isEmptyLog(elemId, "elemId")) return;
        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        Module.RealBIMWeb.ReAllocHeapViews("16"); //分配空间
        _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
        _clrs.set([elemId, _projid, 0x00000000, 0x00000000], 0);
        var retarray = Module.RealBIMWeb.GetHugeObjSubElemClrInfos(dataSetId, "", _clrs.byteLength, _clrs.byteOffset);
        var alphainfo = retarray[2].toString(16);
        var isusenewalpha = alphainfo.substring(6, 8);
        var newalpha = alphainfo.substring(2, 4);
        var newalphapercent = alphainfo.substring(0, 2);
        var temp01 = parseInt(isusenewalpha, 16);
        var temp02 = parseInt(newalpha, 16)
        var temp03 = parseInt(newalphapercent, 16)
        if (temp01 > 0 && temp02 == 0 && temp03 == 255) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取元素集合的总包围盒信息
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.getElemTotalBV = function (dataSetId, elemIdList, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;
        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }
        var _bvTemp;
        if (dataSetId == "") {
            //多数据集设置
            _bvTemp = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("", "", 0xffffffff, 0, _elemScope); //获取所有构件的包围盒信息
        }
        else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                _bvTemp = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(dataSetId, "", 0xffffffff, 0, _elemScope); //获取所有构件的包围盒信息
            }
            else {
                var _temparr = [];
                for (var i = 0; i < _count; ++i) {
                    _temparr.push(elemIdList[i]);
                    _temparr.push(_projid);
                }
                var _selids = new Uint32Array(_temparr);
                Module.RealBIMWeb.ReAllocHeapViews(_selids.byteLength.toString());
                var _tempids = Module.RealBIMWeb.GetHeapView_U32(0);
                _tempids.set(_selids, 0);
                _bvTemp = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(dataSetId, "", _tempids.byteLength, _tempids.byteOffset, _elemScope);
            }
        }
        var aabbList = [];
        aabbList.push(_bvTemp[0][0]);  //Xmin
        aabbList.push(_bvTemp[1][0]);  //Xmax
        aabbList.push(_bvTemp[0][1]);  //Ymin
        aabbList.push(_bvTemp[1][1]);  //Ymax
        aabbList.push(_bvTemp[0][2]);  //Zmin
        aabbList.push(_bvTemp[1][2]);  //Zmax
        return aabbList;
    }

    /**
     * 获取模型的包围盒信息
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getTotalBV = function (dataSetId) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        var _tempbv = Module.RealBIMWeb.GetHugeObjBoundingBox(dataSetId, "");
        var aabbList = [];
        aabbList.push(_tempbv[0][0]); aabbList.push(_tempbv[1][0]);  //Xmin、Xmax
        aabbList.push(_tempbv[0][1]); aabbList.push(_tempbv[1][1]);  //Ymin、Ymax
        aabbList.push(_tempbv[0][2]); aabbList.push(_tempbv[1][2]);  //Zmin、Zmax
        return aabbList;
    }



    // MARK 选择集
    class RESelElemsBlendAttr {
        constructor() {
            this.elemClr = new REColor(255, 0, 0, 255);//元素颜色（REColor 类型）
            this.clrWeight = 255;//颜色权重, 此权重要使用必须配合颜色值存在
            this.alphaWeight = 255;//透明度权重, 此权重要使用必须配合透明度值存在
            this.probeMask = 1;//探测掩码（即是否可以被选中，为0不可被选中，为1可以被选中）
            this.attrValid = true;//表示属性信息是否有效，若无效则选择集合将不采用该全局属性信息；默认有效（true）
        }
    }
    ExtModule.RESelElemsBlendAttr = RESelElemsBlendAttr;

    /**
     * 设置选择集的混合信息
     * @param {RESelElemsBlendAttr} elemAttr //混合信息
     */
    Module.BIM.setSelElemsBlendAttr = function (elemAttr) {
        if (isEmptyLog(elemAttr, "elemAttr")) return;
        if (isEmptyLog(elemAttr.elemClr, "elemClr")) return;

        var _attrvalid = true; if (!isEmpty(elemAttr.attrValid)) { _attrvalid = elemAttr.attrValid; }
        var _probeMask = 1; if (!isEmpty(elemAttr.probeMask)) { _probeMask = elemAttr.probeMask; }
        var obj_attr = {
            m_bAttrValid: _attrvalid,
            m_qClrBlend: [(elemAttr.elemClr.red / 255), (elemAttr.elemClr.green / 255), (elemAttr.elemClr.blue / 255), ((isEmpty(elemAttr.clrWeight) ? 255 : elemAttr.clrWeight) / 255)],
            m_vAlphaBlend: [(elemAttr.elemClr.alpha / 255), ((isEmpty(elemAttr.alphaWeight) ? 255 : elemAttr.alphaWeight) / 255)],
            m_uProbeMask: _probeMask
        }
        Module.RealBIMWeb.SetSelElemsAttr(obj_attr);
    }

    /**
     *  获取当前选择集的混合信息
     */
    Module.BIM.getSelElemsBlendAttr = function () {
        var curattr = Module.RealBIMWeb.GetSelElemsAttr();
        var tempselclr = curattr.m_qClrBlend;
        var tempselAlpha = curattr.m_vAlphaBlend;
        var _clr_R = parseInt(tempselclr[0] * 255, 10);
        var _clr_G = parseInt(tempselclr[1] * 255, 10);
        var _clr_B = parseInt(tempselclr[2] * 255, 10);
        var _clr_W = parseInt(tempselclr[3] * 255, 10);

        var _clr_A = parseInt(tempselAlpha[0] * 255, 10);
        var _alpha_W = parseInt(tempselAlpha[1] * 255, 10);

        var blendAttr = new RESelElemsBlendAttr();
        blendAttr.elemClr = new REColor(_clr_R, _clr_G, _clr_B, _clr_A);
        blendAttr.clrWeight = _clr_W;
        blendAttr.alphaWeight = _alpha_W;
        blendAttr.probeMask = curattr.m_uProbeMask / 255;
        blendAttr.attrValid = curattr.m_bAttrValid;
        return blendAttr;
    }

    /**
     * 设置选择集的颜色、透明度、探测掩码（即是否可以被选中）
     * @param {REColor} elemClr //构件颜色（REColor 类型）
     * @param {Number} probeMask //探测掩码（即是否可以被选中，为0不可被选中，为1可以被选中）
     * @param {Boolean} attrValid //表示属性信息是否有效，若无效则选择集合将不采用该全局属性信息；默认有效（true）
     */
    Module.BIM.setSelElemsAttr = function (elemClr, probeMask, attrValid) {
        if (isEmptyLog(elemClr, "elemClr")) return;
        var _attrvalid = true; if (!isEmpty(attrValid)) { _attrvalid = attrValid; }
        var _probeMask = 1; if (!isEmpty(probeMask)) { _probeMask = probeMask; }
        var obj_attr = {
            m_bAttrValid: _attrvalid,
            m_qClrBlend: [(elemClr.red / 255), (elemClr.green / 255), (elemClr.blue / 255), 1.0],
            m_vAlphaBlend: [(elemClr.alpha / 255), 1.0],
            m_uProbeMask: _probeMask
        }
        Module.RealBIMWeb.SetSelElemsAttr(obj_attr);
    }

    /**
     * 单独设置选择集的颜色
     * @param {REColor} setSelElemsClr //构件颜色（REColor 类型）
     */
    Module.BIM.setSelElemsClr = function (elemClr) {
        if (isEmptyLog(elemClr, "elemClr")) return;
        var _curattr = Module.RealBIMWeb.GetSelElemsAttr();
        var _attrvalid = _curattr.m_bAttrValid;
        var _selAlpha = _curattr.m_vAlphaBlend;
        var _selProbeMask = _curattr.m_uProbeMask
        var obj_attr = {
            m_bAttrValid: _attrvalid,
            m_qClrBlend: [(elemClr.red / 255), (elemClr.green / 255), (elemClr.blue / 255), 1.0],
            m_vAlphaBlend: _selAlpha,
            m_uProbeMask: _selProbeMask
        }
        return Module.RealBIMWeb.SetSelElemsAttr(obj_attr);
    }

    /**
     * 单独设置选择集的透明度
     * @param {Number} elemAlpha //构件透明度，取值范围0-255
     */
    Module.BIM.setSelElemsAlpha = function (elemAlpha) {
        var _curattr = Module.RealBIMWeb.GetSelElemsAttr();
        var _attrvalid = _curattr.m_bAttrValid;
        var _selClr = _curattr.m_qClrBlend;
        var _selProbeMask = _curattr.m_uProbeMask
        var obj_attr = {
            m_bAttrValid: _attrvalid,
            m_qClrBlend: _selClr,
            m_vAlphaBlend: [(elemAlpha / 255), 1.0],
            m_uProbeMask: _selProbeMask
        }
        return Module.RealBIMWeb.SetSelElemsAttr(obj_attr);
    }

    /**
     *  获取当前选择集的属性信息
     */
    Module.BIM.getSelElemsAttr = function () {
        var curattr = Module.RealBIMWeb.GetSelElemsAttr();
        var tempselclr = curattr.m_qClrBlend;
        var tempselAlpha = curattr.m_vAlphaBlend;
        var _clr_R = parseInt(tempselclr[0] * 255, 10);
        var _clr_G = parseInt(tempselclr[1] * 255, 10);
        var _clr_B = parseInt(tempselclr[2] * 255, 10);
        var _clr_A = parseInt(tempselAlpha[0] * 255, 10);

        var objAttr = {
            elemClr: new REColor(_clr_R, _clr_G, _clr_B, _clr_A),
            probeMask: curattr.m_uProbeMask / 255,
            attrValid: curattr.m_bAttrValid,
        }
        return objAttr;
    }

    /**
     *  重置选择集的属性信息为默认值
     */
    Module.BIM.resetSelElemsAttr = function () {
        return Module.RealBIMWeb.SetSelElemsAttr({ m_bAttrValid: true, m_qClrBlend: [1, 0, 0, 0.8], m_vAlphaBlend: [0.29, 1], m_uProbeMask: 1 });
    }

    /**
     *  获取当前选择集的构件ID集合
     */
    Module.BIM.getSelElemIDs = function () {
        var tempselids = new Uint32Array(Module.RealBIMWeb.GetSelElemIDs());
        var projidarr = [];
        if (tempselids.length < 2) {
            return [];
        }
        var curprojid = tempselids[1];
        var curprojelemarr = [];
        for (var i = 0; i < tempselids.length; i += 2) {
            if (tempselids[i] == 4294967280) {
                //去除c++辅助局部元素的构件id （挖坑用的辅助元素）
                continue;
            }
            if (tempselids[i + 1] == curprojid) {
                curprojelemarr.push(tempselids[i]);
            } else {
                if (curprojelemarr.length > 0) {
                    var curprojinfo = {};
                    curprojinfo["dataSetId"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
                    curprojinfo["elemIdList"] = curprojelemarr;
                    projidarr.push(curprojinfo);
                    curprojelemarr = [];
                }
                curprojid = tempselids[i + 1];
                curprojelemarr.push(tempselids[i]);
            }
        }
        if (curprojelemarr.length > 0) {
            var curprojinfo = {};
            curprojinfo["dataSetId"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
            curprojinfo["elemIdList"] = curprojelemarr;
            projidarr.push(curprojinfo);
            curprojelemarr = [];
        }
        return projidarr;
    }

    /**
     * 往当前选择集合添加构件
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     */
    Module.BIM.addToSelElems = function (dataSetId, elemIdList) {
        if (isEmpty(dataSetId) || dataSetId == "") { logParErr("dataSetId"); return; }
        if (isEmptyLog(elemIdList, "elemIdList")) return;

        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var _count = elemIdList.length;
        if (_count == 0) {
            var _elemIdListTemp = Module.BIM.getDataSetAllElemIDs(dataSetId, false);
            var _moemory = (_elemIdListTemp.length * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);//分配空间
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (i = 0; i < _elemIdListTemp.length; ++i) {
                var eleid = _elemIdListTemp[i];
                _elemIds.set([eleid, _projid], i * 2);
            }
            Module.RealBIMWeb.AddToSelElemIDs(_elemIds.byteLength, _elemIds.byteOffset);
        } else {
            var _moemory = (_count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);//分配空间
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (i = 0; i < _count; ++i) {
                var eleid = elemIdList[i];
                _elemIds.set([eleid, _projid], i * 2);
            }
            Module.RealBIMWeb.AddToSelElemIDs(_elemIds.byteLength, _elemIds.byteOffset);
        }

    }

    /**
     * 从当前选择集合删除构件
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     */
    Module.BIM.delFromSelElems = function (dataSetId, elemIdList) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;
        var _count = elemIdList.length;
        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        if (_count == 0 || dataSetId == "") {
            Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff, 0); //删除全部构件
        } else {
            var _moemory = (_count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (i = 0; i < _count; ++i) {
                var eleid = elemIdList[i];
                _elemIds.set([eleid, _projid], i * 2);
            }
            Module.RealBIMWeb.RemoveFromSelElemIDs(_elemIds.byteLength, _elemIds.byteOffset);
        }
    }

    /**
     * 清空选择集
     */
    Module.BIM.delAllSelElems = function () {
        Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff, 0);
    }

    /**
     * 获取当前场景的所有可见元素id
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} visibalOnly //是否去除当前设置透明度为0的构件id
     */
    Module.BIM.getDataSetAllElemIDs = function (dataSetId, visibalOnly) {
        if (isEmpty(dataSetId) || dataSetId == "") { logParErr("dataSetId"); return; }
        var tempelemids = new Uint32Array(Module.RealBIMWeb.GetHugeObjSubElemIDs(dataSetId, "", visibalOnly));
        var elemIds = [];
        for (i = 0; i < tempelemids.length; i += 2) {
            if (tempelemids[i] == 4294967280) {
                //去除c++辅助局部元素的构件id （挖坑用的辅助元素）
                continue;
            }
            elemIds.push(tempelemids[i]);
        }
        return elemIds;
    }

    /**
     * 获取指定数据集内的子元素双版本比对的差异ID列表
     * @param {String} dataSetId //数据集标识
     * @param {Number} diffType //1/2/3->新版本相对于老版本的新增/删除/修改的元素
     */
    Module.BIM.getDiffVerElemIDs = function (dataSetId, diffType) {
        var _arr_id = Module.RealBIMWeb.GetHugeObjVerCmpDiffIDs(dataSetId, diffType);
        var elemIds = [];
        if (_arr_id >= 0) {
            var _arr = new Uint32Array(Module.m_re_em_golarraybuf[_arr_id].buffer);
            for (i = 0; i < _arr.length; ++i) {
                if (_arr[i] == 4294967280) {
                    //去除c++辅助局部元素的构件id （挖坑用的辅助元素）
                    continue;
                }
                elemIds.push(_arr[i]);
            }
        }
        return elemIds;
    }


    class RESelAxisGridRegInfo {
        constructor() {
            this.dataSetId = null;//数据集标识，为空串则表示处理所有数据集
            this.gridGroupName = null;//表示轴网所属组的唯一标识
            this.gridNameList = null;//表示轴网的集合，要求轴网等于四个，并能够形成闭合多边形
            this.offset = null;//表示四个轴网的偏移量，默认向多边形内部为负，多边形外部为正
            this.minHeight = null;//表示Z轴上多边形裁剪区域的最小高度
            this.maxHeight = null;//表示Z轴上多边形裁剪区域的最大高度
            this.onlyVisible = null;//表示是否仅包含可见元素
            this.includeInter = null;//表示是否包含与多边形区域边界相交的元素
        }
    }
    ExtModule.RESelAxisGridRegInfo = RESelAxisGridRegInfo;

    /**
     * 获取轴网范围内的构件
     * @param {RESelAxisGridRegInfo} regInfo //轴网范围信息（RESelAxisGridRegInfo 类型）
     */
    Module.BIM.getAxisGridRegElem = function (regInfo) {
        if (isEmpty(regInfo.dataSetId, 'dataSetId')) return;
        if (isEmpty(regInfo.gridGroupName, 'gridGroupName')) return;
        if (!checkTypeLog(regInfo.gridNameList, 'gridNameList', RE_Enum.RE_Check_Array)) return;

        var _tempArrGridName = new Module.RE_Vector_WStr();
        for (let i = 0; i < regInfo.gridNameList.length; i++) {
            _tempArrGridName.push_back(regInfo.gridNameList[i]);
        }
        Module.RealBIMWeb.ClipHugeObjSubElemsByGrid(regInfo.dataSetId, regInfo.gridGroupName, _tempArrGridName,
            regInfo.offset, regInfo.minHeight, regInfo.maxHeight,
            regInfo.onlyVisible, regInfo.includeInter);
    }

    class RESelPolyFenceRegInfo {
        constructor() {
            this.dataSetId = null;//数据集标识，为空串则表示处理所有数据集
            this.pointList = null;//多边形点集合（必须为多边形首尾端点构成闭合区域）
            this.minHeight = null;//表示Z轴上多边形裁剪区域的最小高度
            this.maxHeight = null;//表示Z轴上多边形裁剪区域的最大高度
            this.onlyVisible = null;//表示是否仅包含可见元素
            this.includeInter = null;//表示是否包含与多边形区域边界相交的元素
        }
    }
    ExtModule.RESelPolyFenceRegInfo = RESelPolyFenceRegInfo;

    /**
     * 获取多边形范围内的构件
     * @param {RESelPolyFenceRegInfo} regInfo //多边形范围信息（RESelPolyFenceRegInfo 类型）
     */
    Module.BIM.getPolyFenceRegElem = function (regInfo) {
        if (isEmpty(regInfo.dataSetId, 'dataSetId')) return;
        if (!checkTypeLog(regInfo.pointList, 'pointList', RE_Enum.RE_Check_Array)) return;

        var _count = regInfo.pointList.length;
        if (_count == 0) return;

        var _moemory = (_count * 16).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory);
        var _polypots = Module.RealBIMWeb.GetHeapView_Double(0);
        for (let i = 0; i < _count; i++) {
            let pot = regInfo.pointList[i];
            //只取xy的值z不需要，有限制的顶高和低高
            _polypots.set([pot[0], pot[1]], i * 2);
        }
        Module.RealBIMWeb.PolyClipHugeObjSubElems(regInfo.dataSetId, "", _polypots.byteLength, _polypots.byteOffset, regInfo.minHeight, regInfo.maxHeight, regInfo.onlyVisible, regInfo.includeInter);
    }




    // MARK 渲染设置

    /**
     * 设置构件的有效性
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Boolean} enable //是否有效
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.setElemsValidState = function (dataSetId, elemIdList, enable, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;

        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }
        var _count = elemIdList.length;
        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        if (_count == 0) {
            //如果构件ID集合为空，则默认为设置所有构件
            Module.RealBIMWeb.SetHugeObjSubElemValidStates(dataSetId, "", 0xffffffff, 0, enable, _elemScope);
        } else {
            var _moemory = (_count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (i = 0; i < _count; ++i) {
                var eleid = elemIdList[i];
                _elemIds.set([eleid, _projid], i * 2);
            }
            Module.RealBIMWeb.SetHugeObjSubElemValidStates(dataSetId, "", _elemIds.byteLength, _elemIds.byteOffset, enable, _elemScope);
        }
    }

    /**
     * 设置项目的自动加载/卸载距离阈值
     * @param {String} dataSetId //数据集标识
     * @param {Number} minLoadDist //项目模型的最小加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
     * @param {Number} maxLoadDist //项目模型的最大加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
     */
    Module.BIM.setAutoLoadDist = function (dataSetId, minLoadDist, maxLoadDist) {
        var _distinfo = [minLoadDist, maxLoadDist];
        Module.RealBIMWeb.SetMainSceAutoLoadDist(dataSetId, _distinfo);
    }

    /**
     * 获取单项目的最大/最小加载距离阈值
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getAutoLoadDist = function (dataSetId) {
        return Module.RealBIMWeb.GetMainSceAutoLoadDist(dataSetId);
    }

    /**
     * 设置复杂模型内子元素的深度偏移
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} depthBias //深度偏移值,范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.setElemDepthBias = function (dataSetId, elemIdList, depthBias, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;
        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }

        if (dataSetId == "") {
            Module.RealBIMWeb.SetHugeObjSubElemDepthBias("", "", 0xffffffff, 0, depthBias, _elemScope);
        } else {
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemDepthBias(dataSetId, "", 0xffffffff, 0, depthBias, _elemScope);
            } else {
                var _moemory = (_count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory);
                var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (var i = 0; i < _count; ++i) {
                    _elemIds.set([elemIdList[i], _projid], i * 2);
                }
                Module.RealBIMWeb.SetHugeObjSubElemDepthBias(dataSetId, "", _elemIds.byteLength, _elemIds.byteOffset, depthBias, _elemScope);
            }
        }
    }

    /**
     * 设置模型场景节点的仿射变换信息
     * @param {String} dataSetId //数据集标识
     * @param {dvec3} scale //模型的缩放系数，默认为[1,1,1]，xyz轴的缩放系数需保持一致
     * @param {dvec4} rotate //模型的旋转系数，四元数，默认为[0,0,0,1]
     * @param {dvec3} offset //模型的平移系数，默认为[0,0,0]
     */
    Module.BIM.setElemTransform = function (dataSetId, scale, rotate, offset) {
        return Module.RealBIMWeb.SetHugeObjTransform(dataSetId, "", scale, rotate, offset);
    }

    /**
     * 获取模型场景节点的仿射变换信息
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     */
    Module.BIM.getElemTransform = function (dataSetId) {
        var _COMMON_LOC = Module.RealBIMWeb.GetHugeObjTransform(dataSetId, "");
        let transFormInfo = {
            scale: _COMMON_LOC.m_vScale,
            rotate: _COMMON_LOC.m_qRotate,
            offset: _COMMON_LOC.m_vOffset,
        };
        return transFormInfo;
    }

    /**
     * 刷新数据集模型
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} loadNewData //表示刷新主体数据后是否允许重新加载数据
     */
    Module.BIM.refreshDataSet = function (dataSetId, loadNewData) {
        Module.RealBIMWeb.RefreshHugeObjMainData(dataSetId, "", loadNewData);
    }

    /**
     * 设置模型边缘高光属性
     * @param {String} dataSetId //数据集标识
     * @param {Number} amp //表示边缘发光强度，范围（0~1），建议设为0.1~0.3左右即可
     * @param {Number} range //表示边缘区域范围，（0~n），建议设为0.5~1左右即可
     */
    Module.BIM.setBorderEmis = function (dataSetId, amp, range) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        var emis = [amp, range];
        return Module.RealBIMWeb.SetHugeObjBorderEmis(dataSetId, "", emis);
    }

    /**
     * 获取模型边缘高光属性
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getBorderEmis = function (dataSetId) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        return Module.RealBIMWeb.GetHugeObjBorderEmis(dataSetId, "");
    }

    /**
     * 设置模型的最大光泽度
     * @param {String} dataSetId //数据集标识
     * @param {Number} smooth //最大光泽度 取值范围[0,1]
     */
    Module.BIM.setMaxSmooth = function (dataSetId, smooth) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        return Module.RealBIMWeb.SetHugeObjMaxSmooth(dataSetId, "", smooth);
    }

    /**
     * 获取模型的最大光泽度
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getMaxSmooth = function (dataSetId) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        return Module.RealBIMWeb.GetHugeObjMaxSmooth(dataSetId, "");
    }

    /**
     * 设置模型边界线是否启用法线光照的明暗效果
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {Boolean} enable //是否允许
     */
    Module.BIM.setBorderLineNorLight = function (dataSetId, enable) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        return Module.RealBIMWeb.SetHugeObjBorderLineNor(dataSetId, "", enable);
    }

    /**
     * 获取模型边界线是否启用法线光照的明暗效果
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     */
    Module.BIM.getBorderLineNorLight = function (dataSetId) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        return Module.RealBIMWeb.GetHugeObjBorderLineNor(dataSetId, "");
    }

    class REElemUVAnim {
        constructor() {
            this.dataSetId = null;//数据集标识，为空串则表示处理所有数据集
            this.elemIdList = null;//构件id集合,为空数组则表示处理所有构件
            this.scale = null;//UV缩放比例
            this.speed = null;//UV移动速度
        }
    }
    ExtModule.REElemUVAnim = REElemUVAnim;

    /**
     * 设置模型内构件的UV动画属性
     * @param {REElemUVAnim} elemUVAnim //构件UV动画信息
     */
    Module.BIM.setElemUVAnimAttr = function (elemUVAnim) {
        if (isEmptyLog(elemUVAnim, "elemUVAnim")) return;

        var _elemScope = isEmpty(elemUVAnim.elemScope) ? 0 : elemUVAnim.elemScope;
        var _scale = isEmpty(elemUVAnim.scale) ? [1.0, 1.0] : elemUVAnim.scale;
        var _speed = isEmpty(elemUVAnim.speed) ? [0.0, 0.0] : elemUVAnim.speed;
        var _lpUVAnimAttr = [_scale[0], _scale[1], _speed[0], _speed[1]];

        if (elemUVAnim.dataSetId == "") {
            //多数据集设置
            Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr("", "", 0xffffffff, 0, _lpUVAnimAttr, _elemScope);
        }
        else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(elemUVAnim.dataSetId);
            var _count = elemUVAnim.elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr(elemUVAnim.dataSetId, "", 0xffffffff, 0, _lpUVAnimAttr, _elemScope);
            }
            else {
                var _moemory = (_count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (i = 0; i < _count; ++i) {
                    _elemIds.set([elemUVAnim.elemIdList[i], _projid], i * 2);
                }
                Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr(elemUVAnim.dataSetId, "", _elemIds.byteLength, _elemIds.byteOffset, _lpUVAnimAttr, _elemScope);
            }
        }
    }









    // MARK 骨骼动画

    class REGolBoneLocInfo {
        constructor() {
            this.boneId = null;//表示骨骼全局ID
            this.interval = null;//表示骨骼从当前方位过渡到目标方位所需的时长
            this.procBatch = null;//表示骨骼的方位过渡批次
            this.sendPostEvent = null;//表示骨骼方位过渡完毕后是否发送事件消息
            this.destLoc = null;//表示骨骼的目标方位 (REBoneLoc 类型)
        }
    }
    ExtModule.REGolBoneLocInfo = REGolBoneLocInfo;

    class REBoneLoc {
        constructor() {
            this.autoScale = null;//表示元素的自动缩放系数
            this.localScale = null;//表示元素在以自身中心点为原点的局部世界空间中的缩放分量
            this.localRotate = null;//表示元素在以自身中心点为原点的局部世界空间中的旋转分量(欧拉角：绕X/Y/Z轴的旋转角度-360.0*k~360.0*j)
            this.centerVirOrig = null;//表示元素中心点的缩放/旋转/平移变换所在的虚拟坐标系坐标原点的世界空间位置
            this.centerVirScale = null;//表示元素中心点在虚拟坐标系下的缩放分量
            this.centerVirRotate = null;//表示元素中心点在虚拟坐标系下的旋转分量(欧拉角：绕X/Y/Z轴的旋转角度-360.0*k~360.0*j)
            this.centerVirOffset = null;//表示元素中心点在虚拟坐标系下的平移分量
        }
    }
    ExtModule.REBoneLoc = REBoneLoc;


    /**
     * 绑定一批构件到一个骨骼上
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} boneId //要设置的骨骼全局id
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.setElemToBone = function (dataSetId, elemIdList, boneId, elemScope) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(elemIdList, "elemIdList")) return;
        if (isEmptyLog(boneId, "boneId")) return;
        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }

        if (dataSetId == "") {
            Module.RealBIMWeb.SetHugeObjSubElemBoneIDs("", "", 0xffffffff, 0, boneId, _elemScope); //绑定全部构件
        } else {
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(dataSetId, "", 0xffffffff, 0, boneId, _elemScope); //绑定全部构件
            } else {
                var _temparr = [];
                for (var i = 0; i < _count; ++i) {
                    _temparr.push(elemIdList[i]);
                    _temparr.push(_projid);
                }
                var _selids = new Uint32Array(_temparr);
                Module.RealBIMWeb.ReAllocHeapViews(_selids.byteLength.toString());//分配空间
                var _tempids = Module.RealBIMWeb.GetHeapView_U32(0);
                _tempids.set(_selids, 0);
                Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(dataSetId, "", _tempids.byteLength, _tempids.byteOffset, boneId, _elemScope);
            }
        }
    }

    /**
     * 获取系统中的全局元素骨骼总数
     */
    Module.BIM.getGolElemBoneNum = function () {
        return Module.RealBIMWeb.GetGolElemBoneNum();
    }

    /**
     * 设置全局元素骨骼的目标方位
     * @param {REGolBoneLocInfo} boneLocInfo //骨骼方位信息
     */
    Module.BIM.setGolElemBoneDestLoc = function (boneLocInfo) {
        if (isEmptyLog(boneLocInfo, "boneLocInfo")) return;
        if (isEmptyLog(boneLocInfo.destLoc, "destLoc")) return;
        var _destLoc = {
            m_vAutoScale: boneLocInfo.destLoc.autoScale,
            m_vLocalScale: boneLocInfo.destLoc.localScale,
            m_vLocalRotate: boneLocInfo.destLoc.localRotate,
            m_vCenterVirOrig: boneLocInfo.destLoc.centerVirOrig,
            m_vCenterVirScale: boneLocInfo.destLoc.centerVirScale,
            m_vCenterVirRotate: boneLocInfo.destLoc.centerVirRotate,
            m_vCenterVirOffset: boneLocInfo.destLoc.centerVirOffset,
        }
        return Module.RealBIMWeb.SetGolElemBoneDestLocExt(boneLocInfo.boneId, _destLoc, boneLocInfo.interval, boneLocInfo.procBatch, boneLocInfo.sendPostEvent);
    }

    /**
     * 重置所有全局元素骨骼为默认方位
     */
    Module.BIM.resetAllGolElemBoneDestLoc = function () {
        Module.RealBIMWeb.ResetAllGolElemBones();
    }





    // MARK 轮廓线

    /**
     * 设置模型轮廓线
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {REColor} lineClr //模型边界线颜色（REColor 类型）(Alpha==-1表示禁用边界线；Alpha为[0,255]表示边界线颜色的权重系数)
     */
    Module.BIM.setContourLineClr = function (dataSetId, lineClr) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;
        if (isEmptyLog(lineClr, "lineClr")) return;
        var tempclr = [lineClr.red / 255, lineClr.green / 255, lineClr.blue / 255, lineClr.alpha < 0 ? -1 : lineClr.alpha / 255];
        return Module.RealBIMWeb.SetHugeObjBorderLineClr(dataSetId, "", tempclr);
    }

    /**
     * 获取模型边界线颜色混合信息
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getContourLineClr = function (dataSetId) {
        var _tempclr = Module.RealBIMWeb.GetHugeObjBorderLineClr(dataSetId, "");
        var lineClr = new REColor();
        lineClr.red = _tempclr[0] * 255;
        lineClr.green = _tempclr[1] * 255;
        lineClr.blue = _tempclr[2] * 255;
        lineClr.alpha = _tempclr[3] < 0 ? -1 : _tempclr[3] * 255;
        return lineClr;
    }

    /**
     * 设置世界空间下的全局裁剪面的裁剪边界处的颜色信息
     * @param {REColor} lineClr //轮廓线颜色（REColor 类型）
     */
    Module.BIM.setClipPlanesContourLineClr = function (lineClr) {
        if (isEmptyLog(lineClr, "lineClr")) return;
        var _tempclr = [lineClr.red / 255, lineClr.green / 255, lineClr.blue / 255, lineClr.alpha / 255];
        Module.RealBIMWeb.SetGolClipPlanesBorderClrBlendInfo(_tempclr);
    }

    /**
     * 获取世界空间下的全局裁剪面的裁剪边界处的颜色信息
     */
    Module.BIM.getClipPlanesContourLineClr = function () {
        var _tempclr = Module.RealBIMWeb.GetGolClipPlanesBorderClrBlendInfo();
        var lineClr = new REColor();
        lineClr.red = _tempclr[0] * 255;
        lineClr.green = _tempclr[1] * 255;
        lineClr.blue = _tempclr[2] * 255;
        lineClr.alpha = _tempclr[3] * 255;
        return lineClr;
    }















    // MOD-- CAD（CAD）
    Module.CAD = typeof Module.CAD !== "undefined" ? Module.CAD : {};//增加 CAD 模块


    // MARK 加载

    /**
     * 加载CAD文件
     * @param {String} filePath //图纸的资源发布路径
     * @param {RECadUnitEm} unit //图纸的单位 (RECadUnitEm 类型)
     * @param {Number} scale //图纸的比例尺信息
     */
    Module.CAD.loadCAD = function (filePath, unit, scale) {
        if (isEmptyLog(filePath, "filePath")) return;
        var _unit = RECadUnitEm.CAD_UNIT_Meter; if (!isEmpty(unit)) _unit = unit;
        var _scale = 1.0; if (!isEmpty(scale)) _scale = scale;
        Module.RealBIMWeb.LoadCAD(filePath, _unit, _scale);
    }

    /**
     * 添加颜色填充元素
     * @param {String} fillElemId //填充元素标识
     * @param {Array} pointList //多边形点集合（至少三个点构成面）
     * @param {REColor} fillClr //填充颜色（REColor 类型）
     */
    Module.CAD.addFillElem = function (fillElemId, pointList, fillClr) {
        if (isEmptyLog(fillElemId, "fillElemId")) return;
        if (isEmptyLog(pointList, "pointList")) return;

        var _vector_Points = new BlackHole3D.RE_Vector_dvec2();
        for (let i = 0; i < pointList.length; i++) {
            _vector_Points.push_back(pointList[i]);
        }

        var _fillClr = isEmpty(fillClr) ? 0xff0000ff : clrToU32(fillClr);
        Module.RealBIMWeb.AddCADColorHatch(fillElemId, _vector_Points, _fillClr);
    }

    /**
     * 删除颜色填充元素
     * @param {String} fillElemId //填充元素标识
     */
    Module.CAD.delFillElem = function (fillElemId) {
        if (isEmptyLog(fillElemId, "fillElemId")) return;
        Module.RealBIMWeb.DeleteCADColorHatchById(fillElemId);
    }


    // MARK 相机
    /**
     * 调整相机定位到一个二维图元
     * @param {String} elemId //二维图元的id
     * @param {Number} scale //表示相机聚焦后的视口缩放比例，默认为1.0，该值越大，相机距离图元越远
     */
    Module.CAD.setCamLocateToElem = function (elemId, scale) {
        Module.RealBIMWeb.FocusToCADElem(elemId, scale);
    }

    /**
     * 设置CAD矢量锚点的相机缩放边界值
     * @param {String} groupId //锚点组ID
     * @param {Number} minScale //缩放最小边界（像素）
     * @param {Number} maxScale //缩放最大边界（像素）
     */
    Module.CAD.setGroupShpAncScale = function (groupId, minScale, maxScale) {
        Module.RealBIMWeb.SetCADShpAnchorScale(groupId, minScale, maxScale);
    }



    // MARK 选择集
    /**
     * 选中一个二维图元
     * @param {String} elemId //二维图元的id
     */
    Module.CAD.selElem = function (elemId) {
        Module.RealBIMWeb.SelCADElem(elemId);
    }



    // MARK 锚点
    class RECADAnc {
        constructor() {
            this.anchorId = null;//	锚点的名称(字符串，唯一标识)
            this.pos = [0.0, 0.0];//	锚点的位置，默认值[0, 0]
            this.style = 0;//	锚点的样式，目前CAD锚点仅支持4种默认样式，分别以数字0~3表示
            this.innerClr = new REColor(255, 255, 255, 255);//	内部元素颜色
            this.extClr = new REColor(255, 255, 255, 255);//	外部部元素颜色
        }
    }
    ExtModule.RECADAnc = RECADAnc;

    class RECADShpAnc {
        constructor() {
            this.anchorId = null;//	锚点的名称(字符串，唯一标识)
            this.pos = null;//	锚点的位置，默认值 [0,0,0]
            this.shpPath = null;//	表示使用的矢量文件路径
            this.groupId = null;//	表示锚点所属的组名称ID
            this.text = null;//	表示锚点的文字内容
            this.textClr = null;//	表示锚点文字的颜色
            this.textSize = null;//	文字的高度
            this.textAlign = null;//	表示锚点文字相对矢量图标的对齐方式（九宫格：以图片为中心[0,0]）
        }
    }
    ExtModule.RECADShpAnc = RECADShpAnc;


    /**
     * 添加锚点
     * @param {RECADAnc} ancList //锚点信息集合（RECADAnc类型）
     */
    Module.CAD.addAnc = function (ancList) {
        if (isEmptyLog(ancList, "ancList")) return;
        var tempAnchors = new Module.RE_Vector_CAD_ANCHOR();
        for (i = 0; i < ancList.length; ++i) {
            var _ancInfo = ancList[i];
            let _id = ""; if (!isEmpty(_ancInfo.anchorId)) _id = _ancInfo.anchorId;
            let _pos = [0.0, 0.0]; if (!isEmpty(_ancInfo.pos)) _pos = _ancInfo.pos;
            let _innerClr = 0xffffffff; if (!isEmpty(_ancInfo.innerClr)) _innerClr = clrToU32(_ancInfo.innerClr);
            let _extClr = 0xff00ff00; if (!isEmpty(_ancInfo.extClr)) _extClr = clrToU32(_ancInfo.extClr);
            let _style = 0; if (!isEmpty(_ancInfo.style)) _style = _ancInfo.style;

            var tempobj = {
                m_strID: _id,
                m_vPos: _pos,
                m_uClr1: _extClr,
                m_uClr2: _innerClr,
                m_uStyleID: _style
            };
            tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddCADAnchors(tempAnchors);
    }

    /**
     * 根据锚点id获取当前锚点的信息
     * @param {String} anchorId //锚点id
     */
    Module.CAD.getAnc = function (anchorId) {
        var _ancData = Module.RealBIMWeb.GetCADAnchor(anchorId);
        var cadAnc = new RECADAnc();
        cadAnc.innerClr = clrU32ToClr(_ancData.m_uClr2);
        cadAnc.extClr = clrU32ToClr(_ancData.m_uClr1);
        cadAnc.anchorId = _ancData.m_strID;
        cadAnc.pos = _ancData.m_vPos;
        cadAnc.style = _ancData.m_uStyleID;
        return cadAnc;
    }

    /**
     * 获取当前添加的锚点总数
     */
    Module.CAD.getAncNum = function () {
        return Module.RealBIMWeb.GetCADAnchorNum();
    }

    /**
     * 获取当前添加的全部锚点信息
     */
    Module.CAD.getAllAnc = function () {
        var _allAncData = Module.RealBIMWeb.GetAllCADAnchors();

        var arrAncData = [];
        for (var i = 0; i < _allAncData.size(); ++i) {
            var tempobj = _allAncData.get(i);

            var cadAnc = new RECADAnc();
            cadAnc.innerClr = clrU32ToClr(tempobj.m_uClr2);
            cadAnc.extClr = clrU32ToClr(tempobj.m_uClr1);
            cadAnc.anchorId = tempobj.m_strID;
            cadAnc.pos = tempobj.m_vPos;
            cadAnc.style = tempobj.m_uStyleID;
            arrAncData.push(cadAnc);
        }
        return arrAncData;
    }

    /**
     * 删除锚点
     * @param {Array} anchorIdList //锚点id集合
     */
    Module.CAD.delAnc = function (anchorIdList) {
        var tempAnchors = new Module.RE_Vector_WStr();
        for (i = 0; i < anchorIdList.length; ++i) {
            tempAnchors.push_back(anchorIdList[i]);
        }
        return Module.RealBIMWeb.DelCADAnchors(tempAnchors);
    }

    /**
     * 删除所有锚点
     */
    Module.CAD.delAllAnc = function () {
        Module.RealBIMWeb.DelAllCADAnchors();
    }

    /**
     * 添加一系列CAD矢量锚点
     * @param {RECADShpAnc} shpAncList //矢量锚点信息集合（RECADShpAnc类型）
     */
    Module.CAD.addShpAnc = function (shpAncList) {
        if (isEmptyLog(shpAncList, "shpAncList")) return;

        var tempAnchors = new Module.RE_Vector_CAD_SHP_ANCHOR();
        for (i = 0; i < shpAncList.length; ++i) {
            let shpAnc = shpAncList[i];

            var _id = ""; if (!isEmpty(shpAnc.anchorId)) _id = shpAnc.anchorId;
            var _pos = [0.0, 0.0]; if (!isEmpty(shpAnc.pos)) _pos = shpAnc.pos;
            var _picPath = ""; if (!isEmpty(shpAnc.shpPath)) _picPath = shpAnc.shpPath;
            var _groupName = ""; if (!isEmpty(shpAnc.groupId)) _groupName = shpAnc.groupId;
            var _strText = ""; if (!isEmpty(shpAnc.text)) _strText = shpAnc.text;
            var _textClr = 0xffffffff; if (!isEmpty(shpAnc.textClr)) _textClr = clrToU32(shpAnc.textClr);
            var _textSize = 16; if (!isEmpty(shpAnc.textSize)) _textSize = shpAnc.textSize;
            var _textBias = [0, 0]; if (!isEmpty(shpAnc.textAlign)) _textBias = shpAnc.textAlign;

            var tempobj = {
                m_strID: _id,
                m_vPos: _pos,
                m_strShpPath: _picPath,
                m_strGroupID: _groupName,
                m_strText: _strText,
                m_uTextClr: _textClr,
                m_dTextSize: _textSize,
                m_vTextAlign: _textBias
            };
            tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddCADShpAnchors(tempAnchors);
    }

    /**
     * 获取矢量锚点信息
     * @param {String} anchorId //锚点id
     */
    Module.CAD.getShpAnc = function (anchorId) {
        var _ancData = Module.RealBIMWeb.GetCADShpAnchor(anchorId);
        var shpAnc = new RECADShpAnc();
        shpAnc.pos = _ancData.m_vPos;
        shpAnc.text = _ancData.m_strText;
        shpAnc.textClr = clrU32ToClr(_ancData.m_uTextClr);
        shpAnc.textSize = _ancData.m_dTextSize;
        shpAnc.shpPath = _ancData.m_strShpPath;
        shpAnc.groupId = _ancData.m_strGroupID;
        shpAnc.anchorId = _ancData.m_strID;
        shpAnc.textAlign = _ancData.m_vTextAlign;
        return shpAnc;
    }

    /**
     * 获取当前添加的矢量锚点总数
     */
    Module.CAD.getShpAncNum = function () {
        return Module.RealBIMWeb.GetCADShpAnchorNum();
    }

    /**
     * 获取当前添加的全部矢量锚点信息
     */
    Module.CAD.getAllShpAnc = function () {
        var _allAncData = Module.RealBIMWeb.GetAllCADShpAnchors();

        var arrAncData = [];
        for (let i = 0; i < _allAncData.size(); ++i) {
            let tempobj = _allAncData.get(i);

            let shpAnc = new RECADShpAnc();
            shpAnc.pos = tempobj.m_vPos;
            shpAnc.text = tempobj.m_strText;
            shpAnc.textClr = clrU32ToClr(tempobj.m_uTextClr);
            shpAnc.textSize = tempobj.m_dTextSize;
            shpAnc.shpPath = tempobj.m_strShpPath;
            shpAnc.groupId = tempobj.m_strGroupID;
            shpAnc.anchorId = tempobj.m_strID;
            shpAnc.textAlign = tempobj.m_vTextAlign;
            arrAncData.push(shpAnc);
        }
        return arrAncData;
    }

    /**
     * 删除矢量锚点
     * @param {Array} anchorIdList //锚点id集合
     */
    Module.CAD.delShpAnc = function (anchorIdList) {
        var tempAnchors = new Module.RE_Vector_WStr();
        for (i = 0; i < anchorIdList.length; ++i) {
            tempAnchors.push_back(anchorIdList[i]);
        }
        return Module.RealBIMWeb.DelCADShpAnchors(tempAnchors);
    }

    /**
     * 删除系统所有的CAD矢量锚点
     */
    Module.CAD.delAllShpAnc = function () {
        Module.RealBIMWeb.DelAllCADShpAnchors();
    }

    /**
     * 获取所有矢量锚点组名
     */
    Module.CAD.getAllShpAncGroupIDs = function () {
        var _temparr = Module.RealBIMWeb.GetAllCADShpAnchorGroupIDs();
        var arrgroupname = [];
        for (var i = 0; i < _temparr.size(); ++i) {
            var tempobj = _temparr.get(i);
            arrgroupname.push(tempobj);
        }
        return arrgroupname;
    }

    /**
     * 根据组名获取一系列矢量锚点
     * @param {String} groupId //锚点组ID
     */
    Module.CAD.getGroupShpAnc = function (groupId) {
        var _groupAncData = Module.RealBIMWeb.GetGroupCADShpAnchors(groupId);
        var arrAncData = [];
        for (let i = 0; i < _groupAncData.size(); ++i) {
            let tempobj = _groupAncData.get(i);

            let shpAnc = new RECADShpAnc();
            shpAnc.pos = tempobj.m_vPos;
            shpAnc.text = tempobj.m_strText;
            shpAnc.textClr = clrU32ToClr(tempobj.m_uTextClr);
            shpAnc.textSize = tempobj.m_dTextSize;
            shpAnc.shpPath = tempobj.m_strShpPath;
            shpAnc.groupId = tempobj.m_strGroupID;
            shpAnc.anchorId = tempobj.m_strID;
            shpAnc.textAlign = tempobj.m_vTextAlign;
            arrAncData.push(shpAnc);
        }
        return arrAncData;
    }

    /**
     * 根据组名删除一系列矢量锚点
     * @param {String} groupId //锚点组ID
     */
    Module.CAD.delGroupShpAnc = function (groupId) {
        Module.RealBIMWeb.DelGroupCADShpAnchors(groupId);
    }













    // MOD-- 栅格（Grid）
    Module.Grid = typeof Module.Grid !== "undefined" ? Module.Grid : {};//增加 Grid 模块


    // MARK 渲染设置

    /**
     * 设置某一块或全部的栅格模型的透明度
     * @param {String} dataSetId //数据集标识
     * @param {Number} alpha //透明度
     */
    Module.Grid.setDataSetAlpha = function (dataSetId, alpha) {
        var _info = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(dataSetId, "");
        if (_info.m_uDestAlpha == 0 && _info.m_uDestAlphaAmp == 0 && _info.m_uDestRGBBlendInfo == 0) {
            Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(dataSetId, "", { m_uDestAlpha: alpha, m_uDestAlphaAmp: 255, m_uDestRGBBlendInfo: 0x00000000 });
        } else {
            Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(dataSetId, "", { m_uDestAlpha: alpha, m_uDestAlphaAmp: 255, m_uDestRGBBlendInfo: _info.m_uDestRGBBlendInfo });
        }
    }

    /**
     * 获取当前设置的某一块或全部的栅格模型的透明度
     * @param {String} dataSetId //数据集标识
     */
    Module.Grid.getDataSetAlpha = function (dataSetId) {
        var alpha = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(dataSetId, "");
        return alpha.m_uDestAlpha;
    }

    /**
     * 设置地形场景节点的深度偏移
     * @param {String} dataSetId //数据集标识
     * @param {Number} depthBias //深度偏移范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
     */
    Module.Grid.setDataSetDepthBias = function (dataSetId, depthBias) {
        Module.RealBIMWeb.SetUnVerHugeGroupDepthBias(dataSetId, "", depthBias);
    }

    /**
     * 刷新数据集栅格模型
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} loadNewData //表示刷新后是否重新加载数据
     */
    Module.Grid.refreshDataSet = function (dataSetId, loadNewData) {
        Module.RealBIMWeb.RefreshUnVerHugeGroupMainData(dataSetId, "", loadNewData);
    }

    /**
     * 设置某一块或全部的栅格模型的颜色
     * @param {String} dataSetId //数据集标识
     * @param {REColor} clr //新的颜色信息
     */
    Module.Grid.setDataSetClr = function (dataSetId, clr) {
        var _clr = clrToU32_WBGR(clr);
        var _info = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(dataSetId, "");
        if (_info.m_uDestAlpha == 0 && _info.m_uDestAlphaAmp == 0 && _info.m_uDestRGBBlendInfo == 0) {
            Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(dataSetId, "", { m_uDestAlpha: 255, m_uDestAlphaAmp: 255, m_uDestRGBBlendInfo: _clr });
        } else {
            Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(dataSetId, "", { m_uDestAlpha: _info.m_uDestAlpha, m_uDestAlphaAmp: 255, m_uDestRGBBlendInfo: _clr });
        }
    }

    /**
     * 重置某一块或全部的栅格模型的颜色
     * @param {String} dataSetId //数据集标识
     */
    Module.Grid.resetDataSetClr = function (dataSetId) {
        var _dataSetId = ""; if (!isEmpty(dataSetId)) _dataSetId = dataSetId;
        Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(_dataSetId, "", { m_uDestAlpha: 0, m_uDestAlphaAmp: 0, m_uDestRGBBlendInfo: 0 });
    }

    /**
     * 设置栅格模型的可见性
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} visible //是否可见
     */
    Module.Grid.setDataSetVisible = function (dataSetId, visible) {
        Module.RealBIMWeb.SetUnVerHugeGroupVisible(dataSetId, "", visible);
    }

    /**
     * 获取栅格模型的可见性
     * @param {String} dataSetId //数据集标识
     */
    Module.Grid.getDataSetVisible = function (dataSetId) {
        return Module.RealBIMWeb.GetUnVerHugeGroupVisible(dataSetId, "");
    }

    /**
     * 设置栅格模型的仿射变换信息
     * @param {String} dataSetId //数据集标识
     * @param {dvec3} scale //缩放
     * @param {dvec4} rotate //旋转
     * @param {dvec3} offset //平移
     */
    Module.Grid.setDataSetTrans = function (dataSetId, scale, rotate, offset) {
        Module.RealBIMWeb.SetUnVerHugeGroupTransform(dataSetId, "", scale, rotate, offset);
    }

    /**
     * 获取栅格模型的仿射变换信息
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     */
    Module.Grid.getDataSetTrans = function (dataSetId) {
        var _COMMON_LOC = Module.RealBIMWeb.GetUnVerHugeGroupTransform(dataSetId, "");
        let transFormInfo = {
            scale: _COMMON_LOC.m_vScale,
            rotate: _COMMON_LOC.m_qRotate,
            offset: _COMMON_LOC.m_vOffset,
        };
        return transFormInfo;
    }

    /**
     * 根据数据集id获取总包围盒信息
     * @param {String} dataSetId //数据集标识
     */
    Module.Grid.getDataSetBV = function (dataSetId) {
        var tempbv = Module.RealBIMWeb.GetUnVerHugeGroupBoundingBox(dataSetId, "");
        var aabbarr = [];
        aabbarr.push(tempbv[0][0]); aabbarr.push(tempbv[1][0]);  //Xmin、Xmax
        aabbarr.push(tempbv[0][1]); aabbarr.push(tempbv[1][1]);  //Ymin、Ymax
        aabbarr.push(tempbv[0][2]); aabbarr.push(tempbv[1][2]);  //Zmin、Zmax
        return aabbarr;
    }

    /**
     * 将栅格投影到指定高度
     * @param {String} dataSetId //数据集标识
     * @param {Number} type //表示投影类型
     * @param {Number} height //type==0：表示地形组禁止投射到固定高度;  type==1：height表示世界空间绝对高度; type==2：height表示当前地形节点自身包围盒的相对高度范围(0~1); type==3：height表示整个场景的地形节点总包围盒的相对高度范围(0~1)
     * @param {Number} amp //表示将地形投射到指定高度的投射强度(0~1) 
     */
    Module.Grid.setDataSetToHeight = function (dataSetId, type, height, amp) {
        Module.RealBIMWeb.ProjUnVerHugeGroupToHeight(dataSetId, "", type, height, amp);
    }

    /**
     * 设置栅格的有效性
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {Boolean} enable //是否有效
     */
    Module.Grid.setValidState = function (dataSetId, enable) {
        if (isEmptyLog(dataSetId, "dataSetId")) return;

        Module.RealBIMWeb.SetUnVerHugeGroupValidStates(dataSetId, "", (enable ? 1 : 0));
    }





    // MARK 剖切

    /**
     * 设置地形模型是否可剖切
     * @param {Boolean} enable //是否允许
     */
    Module.Grid.setClipEnable = function (enable) {
        return Module.RealBIMWeb.SetUnVerInstsClippable(enable);
    }

    /**
     * 获取非版本管理模型的可剖切性
     */
    Module.Grid.getClipEnable = function () {
        return Module.RealBIMWeb.GetUnVerInstsClippable();
    }





    // MARK 倾斜摄影拍平


    /**
     * 设根据项目名称设置局部拍平区域，仅针对当前项目有效，且拍平位置为当前项目的原始位置，如果项目有发生偏移，则拍平区域应重设为偏移后的位置
     * @param {String} dataSetId //数据集标识
     * @param {Array} rgnInfoList //拍平区域信息  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
     * @param {String} regionID //当前拍平区域的id，此ID用作每个拍平区域的唯一标识
     * @param {Number} projectionHeight //拍平的高度
     * @param {Array} regionVertex //不规则闭合区域的顶点信息
    */
    Module.Grid.setDataSetFlatRegion = function (dataSetId, rgnInfoList) {
        if (isEmpty(dataSetId) || dataSetId == "") { logParErr("dataSetId"); return; }
        var jsonStr = JSON.stringify(rgnInfoList);
        return Module.RealBIMWeb.SetLocalProjRgnsInfo(dataSetId, jsonStr);
    }

    /**
     * 设置当前场景下的全局拍平区域，拍平区域默认对当前场景内的所有倾斜摄影数据均有效。
     * @param {Array} rgnInfoList //拍平区域信息  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
     * @param {String} regionID //当前拍平区域的id，此ID用作每个拍平区域的唯一标识
     * @param {Number} projectionHeight //拍平的高度
     * @param {Array} regionVertex //不规则闭合区域的顶点信息
     */
    Module.Grid.setFlatGolRegion = function (rgnInfoList) {
        var jsonStr = JSON.stringify(rgnInfoList);
        Module.RealBIMWeb.ParseUnverprojectInfo(jsonStr);
    }

    /**
     * 清除一组拍平区域
     * @param {Array} regionIdList //拍平区域id集合
     */
    Module.Grid.removeFlatRegion = function (regionIdList) {
        var _count = regionIdList.length;
        var _moemory = (_count * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory);
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _count; ++i) {
            var eleid = regionIdList[i];
            _elemIds.set([eleid, 0], i * 2);
        }
        Module.RealBIMWeb.RemoveUnverprojectToSelection(_elemIds.byteLength, _elemIds.byteOffset);
    }

    /**
     * 重置一组拍平区域
     * @param {Array} regionIdList //拍平区域id集合
     */
    Module.Grid.resetFlatRegion = function (regionIdList) {
        var _count = regionIdList.length;
        var _moemory = (_count * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory);
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _count; ++i) {
            var eleid = regionIdList[i];
            _elemIds.set([eleid, 0], i * 2);
        }
        Module.RealBIMWeb.AddUnverprojectToSelection(_elemIds.byteLength, _elemIds.byteOffset);
    }

    /**
     * 设置通过 setFlatGolRegion 接口设置的拍平数据是否有效
     * @param {String} dataSetId //数据集标识，为空字符串则表示处理所有数据集
     * @param {Number} effective //表示通过 setFlatGolRegion 接口设置的拍平数据是否有效：0表示无效；1表示有效
     */
    Module.Grid.setFlatRegionEffective = function (dataSetId, effective) {
        return Module.RealBIMWeb.SetUnVerHugeGroupProjToGolShp(dataSetId, "", effective);
    }

    /**
     * 获取通过 setFlatGolRegion 接口设置的拍平数据是否有效
     * @param {String} dataSetId //数据集标识，为空字符串则表示处理所有数据集
     */
    Module.Grid.getFlatRegionEffective = function (dataSetId) {
        return Module.RealBIMWeb.GetUnVerHugeGroupProjToGolShp(dataSetId, "");
    }

    /**
     * 清空 setDataSetFlatRegion 接口设置的局部拍平区域
     * @param {String} dataSetId //数据集标识，为空字符串则表示处理所有数据集
     */
    Module.Grid.clearLocalFlatRegion = function (dataSetId) {
        return Module.RealBIMWeb.SetLocalProjRgnsInfo(dataSetId, "");
    }

    /**
     * 设置通过 setDataSetFlatRegion 接口设置的拍平数据是否有效
     * @param {String} dataSetId //数据集标识，为空字符串则表示处理所有数据集
     * @param {Number} effective //表示通过 setDataSetFlatRegion 接口设置的拍平数据是否有效：0表示无效；1表示有效
     */
    Module.Grid.setLocalFlatRegionEffective = function (dataSetId, effective) {
        return Module.RealBIMWeb.SetUnVerHugeGroupProjToLocalShp(dataSetId, "", effective);
    }

    /**
     * 获取通过 setDataSetFlatRegion 接口设置的拍平数据是否有效
     * @param {String} dataSetId //数据集标识，为空字符串则表示处理所有数据集
     */
    Module.Grid.getLocalFlatRegionEffective = function (dataSetId) {
        return Module.RealBIMWeb.GetUnVerHugeGroupProjToLocalShp(dataSetId, "");
    }



    // MARK 倾斜摄影单体化
    class REMonomerInfo {
        constructor() {
            this.boxID = null;//倾斜摄影编辑对象的ID
            this.heightMin = null;//最小高度
            this.heightMax = null;//最大高度
            this.boxClr = null;//颜色（REColor类型）
            this.pos = null;//角点的位置
        }
    }
    ExtModule.REMonomerInfo = REMonomerInfo;

    /**
     * 设置倾斜摄影单体化数据
     * @param {REMonomerInfo} elemDataList //表示所有倾斜摄影单体化的数据集合 (REMonomerInfo 类型)
     * @param {Boolean} append //表示是否拼接到原来的数据上，（默认false 替换原始的数据）
     */
    Module.Grid.setMonomerElemData = function (elemDataList, append) {
        if (isEmptyLog(elemDataList, "elemDataList")) return;
        var _append = false; if (!isEmpty(append)) _append = append;

        var _elemDataListTemp = [];
        for (let i = 0; i < elemDataList.length; i++) {
            let elemData = elemDataList[i];
            let int_R = Math.round(elemData.boxClr.red); let clrHEX_R = (int_R > 15 ? (int_R.toString(16)) : ("0" + int_R.toString(16)));
            let int_G = Math.round(elemData.boxClr.green); let clrHEX_G = (int_G > 15 ? (int_G.toString(16)) : ("0" + int_G.toString(16)));
            let int_B = Math.round(elemData.boxClr.blue); let clrHEX_B = (int_B > 15 ? (int_B.toString(16)) : ("0" + int_B.toString(16)));
            let _clrHEX = clrHEX_R + clrHEX_G + clrHEX_B;
            let elemDataTemp = {
                boxID: elemData.boxID,
                heightMin: elemData.heightMin,
                heightMax: elemData.heightMax,
                pos: elemData.pos,
                boxColor: _clrHEX,
                boxAlpha: elemData.boxClr.alpha,
            };
            _elemDataListTemp.push(elemDataTemp);
        }
        var jsonStr = JSON.stringify(_elemDataListTemp);
        Module.RealBIMWeb.ParseUnverelemInfo(jsonStr, _append);
    }

    /**
     * 高亮显示部分或全部单体化区域，颜色为 setMonomerElemData 接口设置的颜色
     * @param {String} elemIdList //构件id集合
     */
    Module.Grid.setShowMonomerElemData = function (elemIdList) {
        var _s = elemIdList.length;
        var _s01 = (_s * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01);
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _s; ++i) {
            var eleid = elemIdList[i];
            _elemIds.set([eleid, 0], i * 2);
        }
        Module.RealBIMWeb.HighlightUnverelem(_elemIds.byteLength, _elemIds.byteOffset);
    }

    /**
     * 隐藏部分或全部单体化区域
     * @param {String} elemIdList //构件id集合
     */
    Module.Grid.setHideMonomerElemData = function (elemIdList) {
        var _s = elemIdList.length;
        var _s01 = (_s * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01);
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _s; ++i) {
            var eleid = elemIdList[i];
            _elemIds.set([eleid, 0], i * 2);
        }
        Module.RealBIMWeb.CancelHighlightUnverelem(_elemIds.byteLength, _elemIds.byteOffset);
    }

    /**
     * 高亮显示部分或全部单体化区域，颜色为单体化选择集设置的统一颜色（临时有效）
     * @param {String} elemIdList //构件id集合
     */
    Module.Grid.addToSelMonomerElemIDs = function (elemIdList) {
        var _s = elemIdList.length;
        var _s01 = (_s * 4).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01);
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _s; ++i) {
            var eleid = elemIdList[i];
            _elemIds.set([eleid], i);
        }
        Module.RealBIMWeb.AddUnverelemsToSelection(_elemIds.byteLength, _elemIds.byteOffset);
    }

    /**
     * 将单体化区域从选择集中移除
     * @param {String} elemIdList //构件id集合
     */
    Module.Grid.removeFromSelMonomerElemIDs = function (elemIdList) {
        var _s = elemIdList.length;
        var _s01 = (_s * 4).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01);
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _s; ++i) {
            var eleid = elemIdList[i];
            _elemIds.set([eleid], i);
        }
        Module.RealBIMWeb.RemoveUnverelemsToSelection(_elemIds.byteLength, _elemIds.byteOffset);
    }

    /**
     * 获取当前单体化选择集的ID集合
     */
    Module.Grid.getSelMonomerElemIDs = function () {
        var selids = new Uint32Array(Module.RealBIMWeb.GetSelectedUnverelemId());
        var arrunverelemid = [];
        for (var i = 0; i < selids.length; ++i) {
            if (selids[i] == 4294967280) {
                //去除c++辅助局部元素的构件id （挖坑用的辅助元素）
                continue;
            }
            arrunverelemid.push(selids[i]);
        }
        return arrunverelemid;
    }

    /**
     * 设置单体化选择集的颜色和透明度
     * @param {REColor} elemClr //颜色 (REColor 类型)
     */
    Module.Grid.setSelMonomerElemClr = function (elemClr) {
        var _clr = clrToU32_WBGR(elemClr);
        Module.RealBIMWeb.SetUnverelemSelectionColor(_clr, elemClr.alpha, 0xff);
    }

    /**
     * 设置单体化区域隐藏状态下的颜色
     * @param {REColor} elemClr //颜色 (REColor 类型)
     */
    Module.Grid.setMonomerElemHideClr = function (elemClr) {
        if (elemClr.alpha < 2) {
            elemClr.alpha = 2;
        }
        var _clr = clrToU32(elemClr);
        Module.RealBIMWeb.SetUnverelemHideColor(_clr);
    }






    // MOD-- 360全景（Panorama）
    Module.Panorama = typeof Module.Panorama !== "undefined" ? Module.Panorama : {};//增加 Panorama 模块


    // MARK 加载

    /**
     * 加载一个或多个360全景场景
     * @param {Array} dataSetList //数据集集合  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} resourcesAddress //数据集资源包地址
     */
    Module.Panorama.loadPan = function (dataSetList) {
        if (isRepeat(dataSetList, 'dataSetId')) {
            console.error('【REError】: dataSetId 唯一标识名，不能为空不可重复');
            return;
        }

        var _count = dataSetList.length;
        for (var i = 0; i < _count; ++i) {
            var _dataSetInfo = dataSetList[i];
            var _path = _dataSetInfo.resourcesAddress + "/360/total.xml";
            Module.RealBIMWeb.LoadPanSce(_dataSetInfo.dataSetId, _path);
        }
    }

    /**
     * 判断全景场景是否全部加载完成
     */
    Module.Panorama.getReadyState = function () {
        return Module.RealBIMWeb.IsPanSceReady();
    }

    /**
     * 获取当前已加载的全部全景场景名称
     */
    Module.Panorama.getAllDataSetNames = function () {
        var _tempArr = Module.RealBIMWeb.GetAllPanSceNames();
        var nameArr = [];
        for (var i = 0; i < _tempArr.size(); ++i) {
            nameArr.push(_tempArr.get(i));
        }
        return nameArr;
    }

    /**
     * 卸载一个或多个全景场景，传空数组时，卸载所有的全景场景
     * @param {Array} dataSetIdList //数据集id集合
     */
    Module.Panorama.unloadDataSet = function (dataSetIdList) {
        var _panNames = new Module.RE_Vector_WStr();
        for (i = 0; i < dataSetIdList.length; i++) {
            _panNames.push_back(dataSetIdList[i]);
        }
        Module.RealBIMWeb.UnLoadPanSce(_panNames);
    }

    /**
     * 当所有的全景资源加载完成时，获取某一全景图资源的点位信息
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Panorama.getElemInfo = function (dataSetId) {
        var _tempArr = Module.RealBIMWeb.GetPanSceElemInfos(dataSetId);
        var elemList = [];
        for (var i = 0; i < _tempArr.size(); ++i) {
            let _panElemInfo = _tempArr.get(i);
            elemList.push({
                elemId: _panElemInfo.m_strId,
                rotate: _panElemInfo.m_qRotate,
                pos: _panElemInfo.m_vPos,
            });
        }
        return elemList;
    }

    /**
     * 设置360全景窗口显示的图片信息
     * @param {String} elemId //某一帧全景图的唯一标识
     * @param {Number} panWindow //全景窗口标识
     */
    Module.Panorama.loadPanPic = function (elemId, panWindow) {
        Module.RealBIMWeb.LoadPan(elemId, panWindow);
    }






    // MARK 相机

    /**
     * 设置360相机的朝向
     * @param {String} locType //表示相机朝向（ RECamDirEm 枚举类型）
     * @param {Number} panWindow //360相机的id，如果当前场景仅有一个360场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.setCamLocateTo = function (locType, panWindow) {
        if (isEmptyLog(locType, "locType")) return;
        var _panCamId = 0; if (!isEmpty(panWindow)) { _panCamId = panWindow; }
        var enumEval = eval(locType);
        Module.RealBIMWeb.LocatePanCamToMainDir(enumEval, _panCamId);
    }

    /**
     * 设置全景场景相机方位
     * @param {dvec3} curPos //当前相机的位置（当前帧图片扫描点位）
     * @param {dvec3} destPos //目标点位
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.setCamLocateToDestPos = function (curPos, destPos, panWindow) {
        var _panCamId = 0; if (!isEmpty(panWindow)) { _panCamId = panWindow; }
        Module.RealBIMWeb.LocatePanCamToDestPos(curPos, destPos, _panCamId);
    }

    /**
     * 获取全景相机的方位信息
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.getCamLocate = function (panWindow) {
        var _panCamId = 0; if (!isEmpty(panWindow)) { _panCamId = panWindow; }
        var camLoc = new RECamLoc();
        var _camLoc01 = Module.RealBIMWeb.GetPanCamLocation(_panCamId);
        var _camLoc02 = Module.RealBIMWeb.GetPanCamLocation_Dir(_panCamId);
        camLoc.camPos = _camLoc01.m_vCamPos;
        camLoc.camRotate = _camLoc01.m_qCamRotate;
        camLoc.camDir = _camLoc02.m_qCamDir;
        return camLoc;
    }

    /**
     * 设置全景图的自动前进后退
     * @param {Number} threshold //阈值
     * @param {Number} MoveCoef //小于0则后退 ，否则前进
     * @param {Number} time //时长
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.setCamAutoForward = function (threshold, MoveCoef, time, panWindow) {
        var _panWindow = isEmpty(panWindow) ? 0 : panWindow;
        var _threshold = isEmpty(threshold) ? 80.0 : threshold;
        var _MoveCoef = isEmpty(MoveCoef) ? -1.0 : MoveCoef;
        var _time = isEmpty(time) ? 2.0 : time;
        Module.RealBIMWeb.SetPanCamAutoForward(_threshold, _MoveCoef, _time, _panWindow);
    }



    // MARK 探测

    /**
     * 获取当前探测全景信息
     */
    Module.Panorama.getCurShpProbeRet = function () {
        var _shp_probe_ret = Module.RealBIMWeb.GetCurPanShpProbeRet(Module.RE_PROBE_TYPE.NORM);
        var shp_probe = new REProbeShpInfo();
        shp_probe.elemId = _shp_probe_ret.m_strSelShpObjName;
        shp_probe.elemPos = _shp_probe_ret.m_vSelPos;
        shp_probe.elemScrPos = _shp_probe_ret.m_vSelScrPos;
        return shp_probe;
    }

    /**
     * 获取锚点在全景图上的像素坐标
     * @param {dvec3} pos //三维坐标点
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.getTexPos = function (pos, panWindow) {
        return Module.RealBIMWeb.GetTexPos(pos, panWindow);
    }




    // MARK 锚点
    class REPanAnc {
        constructor() {
            this.panWindow = 0;//	全景相机标识(默认值0)，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
            this.ancName = null;//	锚点的名称(唯一标识)，必填
            this.pos = [0, 0, 0];//	锚点的位置，默认值 [0,0,0]
            this.texPos = [0, 0];//	表示锚点在全景图上的像素位置
            this.useTexPos = false;//	表示是否使用像素位置添加锚点
            this.picPath = null;//	表示锚点的图片路径
            this.picSize = [0, 0];//	表示锚点的图片大小
            this.text = null;//	表示顶点的文字标注信息
            this.textClr = new REColor(0, 0, 0, 255);//	表示锚点的文字标注颜色
            this.texBias = [0, 0];//	表示锚点文字与图片的相对位置，二维坐标：以点为中心点，横轴为x，右侧为正方向，竖轴为y，向上为正方向, 例如（-1，-1）为文字在点的左下方，（1,1）为右上方
            this.texFocus = [0, 0];//	表示指定纹理图片中的像素坐标，对应对锚点的位置坐标               
        }
    }
    ExtModule.REPanAnc = REPanAnc;

    /**
     * 锚点信息集合（ REPanAnc 类型）
     * @param {REPanAnc} ancList //三维坐标点
     */
    Module.Panorama.addAnc = function (ancList) {
        var tempPanAnchors = new Module.RE_Vector_PAN_ANC();
        for (var i = 0; i < ancList.length; ++i) {
            var _panAncInfo = ancList[i];
            var _panCamId = 0; if (!isEmpty(_panAncInfo.panWindow)) _panCamId = _panAncInfo.panWindow;
            var _pos = [0, 0, 0]; if (!isEmpty(_panAncInfo.pos)) _pos = _panAncInfo.pos;
            var _texPos = [0, 0]; if (!isEmpty(_panAncInfo.texPos)) _texPos = _panAncInfo.texPos;
            var _useCamPost = false; if (!isEmpty(_panAncInfo.useTexPos)) _useCamPost = _panAncInfo.useTexPos;
            var tempobj = {
                m_uSlot: _panCamId,
                m_strPanAncName: _panAncInfo.ancName,
                m_vPos: _pos,
                m_vTexPos: _texPos,
                m_bUseTexPos: _useCamPost,
                m_strTexPath: _panAncInfo.picPath,
                m_vTexSize: _panAncInfo.picSize,
                m_vTexFocus: _panAncInfo.texFocus,
                m_strTextInfo: _panAncInfo.text,
                m_vTextClr: [_panAncInfo.textClr.red, _panAncInfo.textClr.green, _panAncInfo.textClr.blue],
                m_vTextBia: _panAncInfo.texBias,
            }
            tempPanAnchors.push_back(tempobj);
        }
        Module.RealBIMWeb.AddPanAnc(tempPanAnchors);
    }

    /**
     * 获取当前已加载的全景图锚点的唯一标识集合
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.getAllAncName = function (panWindow) {
        var _panCamId = 0; if (!isEmpty(panWindow)) _panCamId = panWindow;
        var tempArr = Module.RealBIMWeb.GetPanAnc(_panCamId);
        var nameArr = [];
        for (var i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    }

    /**
     * 删除锚点
     * @param {String} ancName //点的名称,如果为""删除所有全景图中的所有锚点
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.delAnc = function (ancName, panWindow) {
        var _panCamId = 0; if (!isEmpty(panWindow)) _panCamId = panWindow;
        Module.RealBIMWeb.DelPanAnc(_panCamId, ancName);
    }






    // MOD-- 模型编辑（Edit）
    Module.Edit = typeof Module.Edit !== "undefined" ? Module.Edit : {};//增加 Edit 模块

    /**
     * 设置当前的编辑级别
     * @param {Boolean} level //等级（ 0:数据集| 1:pak级| 2:构件级）
     */
    Module.Edit.setEditNodeLevel = function (level) {
        if (level == 0) {
            Module.RealBIMWeb.SetCtrlLevel(Module.RE_CTRL_LEVEL.PROJ);
        } else if (level == 1) {
            Module.RealBIMWeb.SetCtrlLevel(Module.RE_CTRL_LEVEL.HMODEL);
        } else if (level == 2) {
            Module.RealBIMWeb.SetCtrlLevel(Module.RE_CTRL_LEVEL.ELEM);
        }
    }

    /**
     * 获取当前设置的编辑级别
     */
    Module.Edit.getEditNodeLevel = function () {
        var cureditlevel = Module.RealBIMWeb.GetCtrlLevel();
        return cureditlevel.value;
    }

    /**
     * 进入位置编辑状态
     */
    Module.Edit.startEdit = function () {
        Module.RealBIMWeb.EnterSceneNodeEditMode();
    }

    /**
     * 退出位置编辑状态
     */
    Module.Edit.endEdit = function () {
        Module.RealBIMWeb.ExitSceneNodeEditMode();
    }

    /**
     * 打开位置编辑放射变换窗口 
     */
    Module.Edit.openAffineTransEditWnd = function () {
        return Module.RealBIMWeb.UIWgtSetVisible(RESysWndMateEm.SysWnd_AffineTransMode, true);
    }

    /**
     * 关闭位置编辑放射变换窗口
     */
    Module.Edit.closeAffineTransEditWnd = function () {
        return Module.RealBIMWeb.UIWgtSetVisible(RESysWndMateEm.SysWnd_AffineTransMode, false);
    }

    /**
     * 数据集编辑状态下将数据集加入到选择集
     * @param {String} dataSetId //数据集唯一标识
     */
    Module.Edit.addDataSetToSel = function (dataSetId) {
        var _projvec = new Module.RE_Vector_WStr();
        _projvec.push_back(dataSetId);
        Module.RealBIMWeb.AddToCurSelProjIDs(_projvec);     //把1个数据集加入选择集
    }










    // MOD-- 测量（Measure）
    Module.Measure = typeof Module.Measure !== "undefined" ? Module.Measure : {};//增加 Measure 模块

    // MARK 渲染设置
    /**
     * 设置测量线的颜色
     * @param {String} clrType //颜色类型
     * @param {REColor} lineClr //测量线颜色（REColor 类型）
     */
    Module.Measure.setLineClr = function (clrType, lineClr) {
        var uclr = clrToU32(lineClr);
        Module.RealBIMWeb.SetMeasureShapeColor(clrType, uclr);
    }

    /**
     * 设置测量显示文字的样式
     * @param {String} clrType //颜色类型
     * @param {String} fontName //字体样式名称，由REaddAGolFont接口创建的字体名称；填空字符串表示使用默认字体样式
     * @param {REColor} lineClr //测量线颜色（REColor 类型）
     * @param {Boolean} isBorder //表示本次设置该字体本身还是边框：true：表示设置边框颜色，false：表示设置字体本身
     */
    Module.Measure.setTextStyle = function (clrType, fontName, lineClr, isBorder) {
        var uclr = clrToU32(lineClr);
        var tempshapetype = isBorder ? (clrType + "_Border") : clrType;
        var _fontStyle = "RealBIMFont001"; if (fontName != "") { _fontStyle = fontName; }
        Module.RealBIMWeb.SetMeasureTextColor(tempshapetype, uclr);
        Module.RealBIMWeb.SetMeasureTextFontName(tempshapetype, _fontStyle);
    }

    /**
     * 重置测量样式为系统默认样式
     */
    Module.Measure.resetDefaultStyle = function () {
        Module.RealBIMWeb.ResetMeasureShapeAppearance();
    }

    /**
     * 获取测量显示的精度
     */
    Module.Measure.getValueDispPrecision = function () {
        return Module.RealBIMWeb.GetMeasureValueDispPrecision();
    }

    /**
     * 设置测量显示的精度
     * @param {Number} precision //精度（正整数）
     */
    Module.Measure.setValueDispPrecision = function (precision) {
        Module.RealBIMWeb.SetMeasureValueDispPrecision(precision);
    }

    /**
     * 获取坡度显示状态
     */
    Module.Measure.getSlopeVisible = function () {
        return Module.RealBIMWeb.GetGradeVisible();
    }

    /**
     * 设置长度测量时两点之间的坡度显示开关
     * @param {Boolean} enable //是否开启
     */
    Module.Measure.setSlopeVisible = function (enable) {
        Module.RealBIMWeb.SetGradeVisible(enable);
    }

    /**
     * 获取当前长度测量的数据显示模式
     */
    Module.Measure.getLengthDataShowType = function () {
        var _type = Module.RealBIMWeb.GetMeasureLockDir();
        return _type == 4 ? 3 : _type;
    }

    /**
     * 设置当前长度测量的数据显示模式
     * @param {Number} type //显示模式 1:沿线本身方向  2：测量线投射XY平面  3：测量线投射Z方向
     */
    Module.Measure.setLengthDataShowType = function (type) {
        var _type = type == 3 ? 4 : type;
        Module.RealBIMWeb.SetMeasureLockDir(_type);
    }

    /**
     * 获取当前面积测量的数据显示模式
     */
    Module.Measure.getAreaDataShowType = function () {
        return Module.RealBIMWeb.GetAreaProjLockDir();
    }

    /**
     * 设置当前面积测量的数据显示模式
     * @param {Number} type //显示模式 1:平面上  2：平面投射XY平面
     */
    Module.Measure.setAreaDataShowType = function (type) {
        Module.RealBIMWeb.SetAreaProjLockDir(type);
    }

    /**
     * 获取轴平行辅助线开启状态
     */
    Module.Measure.getAssistLineVisible = function () {
        return Module.RealBIMWeb.GetAssistLineVisible();
    }

    /**
     * 设置轴平行辅助线开启状态
     * @param {Boolean} enable //是否开启
     */
    Module.Measure.setAssistLineVisible = function (enable) {
        Module.RealBIMWeb.SetAssistLineVisible(enable);
    }





    // MARK 操作设置
    /**
     * 显示鼠标选中点到场景中电子围栏的最短距离
     */
    Module.Measure.startShowFenceMinDis = function () {
        return Module.RealBIMWeb.EnterPotAndFenceDistMeasureState();
    }

    /**
     * 关闭显示鼠标选中点到场景中电子围栏的最短距离
     */
    Module.Measure.endShowFenceMinDis = function () {
        Module.RealBIMWeb.ExitPotAndFenceDistMeasureState();
    }

    /**
     * 在屏幕上显示两个点之间的水平距离
     * @param {dvec3} point1 //表示第一个点的坐标,三元数组
     * @param {dvec3} point2 //表示第二个点的坐标,三元数组
     * @param {String} text //显示相应的文字
     */
    Module.Measure.drawHoriDisLine = function (point1, point2, text) {
        Module.RealBIMWeb.DrawHoriMeasureData(point1, point2, text);
    }

    /**
     * 清除屏幕上的两点之间水平距离的信息
     */
    Module.Measure.clearHoriDisLine = function () {
        Module.RealBIMWeb.ClearHoriMeasureData();
    }

    /**
     * 在图形窗口显示两点之间的直线距离、水平距离、垂直距离
     * @param {dvec3} point1 //表示第一个点的坐标,三元数组
     * @param {dvec3} point2 //表示第二个点的坐标,三元数组
     * @param {Number} mode //显示模式
     */
    Module.Measure.drawDisLine = function (point1, point2, mode) {
        Module.RealBIMWeb.DrawMeasureDataOfLineSegment(point1, point2, mode);
    }

    /**
     * 清除屏幕上的两点之间距离的信息
     */
    Module.Measure.clearDisLine = function () {
        Module.RealBIMWeb.ClearMeasureDataOfLineSegment();
    }

    /**
     * 获取当前操作的测量类型
     */
    Module.Measure.getMeasureType = function () {
        var _type = Module.RealBIMWeb.GetMeasureType();
        switch (_type) {
            case 4:
                _type = 3;
                break;
            case 8:
                _type = 4;
                break;
            default:
                break;
        }
        return _type;
    }

    /**
     * 设置当前操作的测量类型
     * @param {Number} type //操作的测量类型 1:长度测量  2：角度测量  3：面积测量  4:位置
     */
    Module.Measure.setMeasureType = function (type) {
        var _type = isEmpty(type) ? 1 : type;
        switch (_type) {
            case 3:
                _type = 4;
                break;
            case 4:
                _type = 8;
                break;
            default:
                break;
        }
        Module.RealBIMWeb.SetMeasureType(_type);
    }

    /**
     * 获取是否是单次测量模式
     */
    Module.Measure.getSingleStyleState = function () {
        return Module.RealBIMWeb.GetSingleMeasureMode();
    }

    /**
     * 设置是否是单次测量模式
     * @param {Boolean} enable //是否允许
     */
    Module.Measure.setSingleStyleState = function (enable) {
        return Module.RealBIMWeb.SetSingleMeasureMode(enable);
    }

    /**
     * 进入测量交互模式
     */
    Module.Measure.startMeasureState = function () {
        //接口进入测量模式和系统UI面板中的测量模式不联动，需要关闭系统UI面板(包含内联弹窗)
        Module.RealBIMWeb.SetBuiltInUIVisible(false);
        Module.RealBIMWeb.SetBuiltInUIEnable(false);
        var state = Module.RealBIMWeb.EnterMeasureMode();
        Module.RealBIMWeb.SetMeasureType(1);//默认进入长度测量
        return state;
    }

    /**
     * 结束测量交互模式
     * @param {Boolean} enable //之前是否允许系统UI面板展示(默认为展示系统UI面板)
     */
    Module.Measure.endMeasureState = function (enable) {
        var _enable = isEmpty(enable) ? true : enable;
        if (_enable) {
            //需要恢复关闭的系统UI面板(包含内联弹窗)
            Module.RealBIMWeb.SetBuiltInUIEnable(true);
            Module.RealBIMWeb.SetBuiltInUIVisible(true);
        }
        return Module.RealBIMWeb.ExitMeasureMode();
    }

    /**
     * 取消当前点选操作
     */
    Module.Measure.cancelCurPotOpt = function () {
        return Module.RealBIMWeb.TerminateMeasurePath();
    }

    /**
     * 获取当前是否处于测量交互模式
     */
    Module.Measure.getCurState = function () {
        return Module.RealBIMWeb.IsInMeasureMode();
    }

    class REMeasureInfo {
        constructor() {
            this.measureType = null;//测量类型 1:长度测量  2：角度测量  3：面积测量  4:位置
            this.dataShowType = null;//数据显示类型  1:沿线（面）本身方向  2：测量线（面）投射XY平面  3：测量线投射Z方向
            this.groupId = null;//组id
            this.pointList = null;//测量点集合
        }
    }
    ExtModule.REMeasureInfo = REMeasureInfo;

    /**
     * 添加一组测量数据
     * @param {REMeasureInfo} measureInfo //测量信息
     */
    Module.Measure.addGroupData = function (measureInfo) {
        if (!Module.RealBIMWeb.IsInMeasureMode()) return;//不处于测量模式下无效
        if (isEmptyLog(measureInfo, "measureInfo")) return;
        if (isEmptyLog(measureInfo.groupId, "groupId")) return;
        if (isEmptyLog(measureInfo.pointList, "pointList")) return;

        var _measureType = isEmpty(measureInfo.measureType) ? 1 : measureInfo.measureType;
        switch (_measureType) {
            case 3:
                _measureType = 4;
                break;
            case 4:
                _measureType = 8;
                break;
            default:
                break;
        }
        var _dataShowType = isEmpty(measureInfo.dataShowType) ? 1 : measureInfo.dataShowType;
        if (_measureType == 1) {
            _dataShowType = _dataShowType == 3 ? 4 : _dataShowType;
        } else if (_measureType == 3) {
            _dataShowType = _dataShowType == 3 ? 1 : _dataShowType;
        } else {
            _dataShowType = 1;
        }
        var _pointList = new Module.RE_Vector_dvec3();
        for (let i = 0; i < measureInfo.pointList.length; i++) {
            _pointList.push_back(measureInfo.pointList[i]);
        }
        Module.RealBIMWeb.AddAMeasureGroup(_measureType, _dataShowType, measureInfo.groupId, _pointList);
    }

    /**
     * 删除一组测量数据
     * @param {Number} groupId //组id
     */
    Module.Measure.delGroupData = function (groupId) {
        Module.RealBIMWeb.RemoveAMeasureGroup(groupId);
    }

    /**
     * 删除一类测量数据
     * @param {Number} type //测量类型 1:长度测量  2：角度测量  3：面积测量  4:位置
     */
    Module.Measure.delTypeData = function (type) {
        var _type = isEmpty(type) ? 1 : type;
        switch (_type) {
            case 3:
                _type = 4;
                break;
            case 4:
                _type = 8;
                break;
            default:
                break;
        }
        Module.RealBIMWeb.RemoveMeasureGroupByType(_type);
    }







    // MOD-- 电子围栏（Fence）
    Module.Fence = typeof Module.Fence !== "undefined" ? Module.Fence : {};//增加 Fence 模块


    /**
     * 进入编辑电子围栏状态
     */
    Module.Fence.startFenceEdit = function () {
        Module.RealBIMWeb.EnterFenceEditMode();
    }

    /**
     * 退出编辑电子围栏状态
     */
    Module.Fence.endFenceEdit = function () {
        Module.RealBIMWeb.ExitFenceEditMode();
    }

    /**
     * 开始添加电子围栏
     */
    Module.Fence.addFence = function () {
        return Module.RealBIMWeb.BeginAddFence();
    }

    /**
     * 结束添加电子围栏
     */
    Module.Fence.endAddFence = function () {
        return Module.RealBIMWeb.EndAddFence();
    }

    /**
     * 设置添加电子围栏时的小提示图标
     * @param {String} picPath //图片路径（32*32像素、png格式）
     */
    Module.Fence.setPicStyle = function (picPath) {
        var temptexregions = {
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

    class REFencePot {
        constructor() {
            this.pos = null;//顶点位置
            this.height = null;//顶点高度
            this.potClr = null;//顶点颜色
            this.endPotType = 0;//是否是当前围栏的最后一个顶点，0：不是最后一个顶点；1：最后一个顶点且围栏封闭；2：最后一个顶点且围栏不封闭
        }
    }
    ExtModule.REFencePot = REFencePot;

    /**
     * 获取当前所有电子围栏的顶点信息
     */
    Module.Fence.getAllPotInfo = function () {
        var _fenceInfoList = Module.RealBIMWeb.GetSceFenceInfos();
        var fencePotList = [];
        for (let i = 0; i < _fenceInfoList.size(); i++) {
            let _fenceInfo = _fenceInfoList.get(i);
            let fencePot = new REFencePot();
            fencePot.pos = _fenceInfo.m_vPos;
            fencePot.height = _fenceInfo.m_fHeight;
            fencePot.potClr = clrU32ToClr(_fenceInfo.m_uClr);
            fencePot.endPotType = _fenceInfo.m_uIsFenceEndPot;
            fencePotList.push(fencePot);
        }
        return fencePotList;
    }

    /**
     * 根据电子围栏的顶点的名称返回围栏的名称
     * @param {String} potName //顶点名称
     */
    Module.Fence.getFenceName = function (potName) {
        var fencedata = Module.RealBIMWeb.GetShpObjExtInfo(potName);
        if ((fencedata.m_eType.value == 3) || (fencedata.m_eType.value == 4)) {
            var fencename = fencedata.m_strParent;
            return fencename;
        }
    }

    /**
     * 删除一个围栏顶点
     * @param {String} potName //顶点名称
     */
    Module.Fence.delFencePot = function (potName) {
        Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
        var bool = Module.RealBIMWeb.DelFencePot(potName);
        Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
        return bool;
    }

    /**
     * 删除一个围栏
     * @param {String} fenceName //围栏名称
     */
    Module.Fence.delFence = function (fenceName) {
        Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
        var bool = Module.RealBIMWeb.DelFence(fenceName);
        Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
        return bool;
    }

    //删除全部围栏
    Module.Fence.delAllFence = function () {
        Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
        var bool = Module.RealBIMWeb.DelAllFences();
        Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
        return bool;
    }

    /**
     * 添加电子围栏的顶点信息集合
     * @param {REFencePot} fencePotInfoList //围栏的顶点信息集合 （REFencePot类型）
     */
    Module.Fence.addFenceByPot = function (fencePotInfoList) {
        Module.RealBIMWeb.ExitFenceEditMode(); //必须退出编辑电子围栏的状态，才可设置所有围栏的信息
        var _tempfencepots = new Module.RE_Vector_FENCE_POT();
        for (let i = 0; i < fencePotInfoList.length; i++) {
            let potInfo = fencePotInfoList[i];
            let _obj = {
                m_vPos: potInfo.pos,
                m_fHeight: potInfo.height,
                m_uClr: clrToU32(potInfo.potClr),
                m_uIsFenceEndPot: potInfo.endPotType,
            };
            _tempfencepots.push_back(_obj);
        }
        return Module.RealBIMWeb.SetSceFenceInfos(_tempfencepots);
    }











    // MOD-- 水面（Water）
    Module.Water = typeof Module.Water !== "undefined" ? Module.Water : {};//增加 Water 模块

    class REWaterInfo {
        constructor() {
            this.waterName = null;//水面名称
            this.waterClr = new REColor(255, 255, 255, 255);//水面颜色
            this.blendDist = 1;//混合系数
            this.visible = true;//是否可见
            this.cornerPoint = null;//角点
        }
    }
    ExtModule.REWaterInfo = REWaterInfo;


    // MARK 加载
    /**
     * 创建水域对象
     * @param {REWaterInfo} waterInfoList //水面数据集合
     */
    Module.Water.loadData = function (waterInfoList) {
        if (!checkTypeLog(waterInfoList, "waterInfoList", RE_Enum.RE_Check_Array)) return;

        var _waterList = [];
        for (let i = 0; i < waterInfoList.length; i++) {
            let obj = waterInfoList[i];
            if (isEmptyLog(obj.waterName, "waterName")) return false;
            if (isEmptyLog(obj.cornerPoint, "cornerPoint")) return false;
            let waterT = {
                WaterName: obj.waterName,
                Color: clrToRGBA_List(obj.waterClr),
                BlendDist: isEmpty(obj.blendDist) ? 1 : obj.blendDist,
                Visible: isEmpty(obj.visible) ? true : obj.visible,
                Corners: obj.cornerPoint,
            };
            _waterList.push(waterT);
        }
        var _waterJson = "";
        _waterObj = {};
        if (_waterList.length) {
            _waterObj.Waters = _waterList;
            _waterJson = JSON.stringify(_waterObj);
        }
        return Module.RealBIMWeb.LoadWaterFromJson(_waterJson);
    }

    /**
     * 获取当前场景中所有水域对象
     */
    Module.Water.getData = function () {
        var _waterJson = Module.RealBIMWeb.SerializeWaterToString();

        var jsonObj = JSON.parse(_waterJson);
        if (!checkTypeLog(jsonObj["Waters"], 'Waters', RE_Enum.RE_Check_Array, false)) return '';

        var waterInfoList = [];
        var count = jsonObj["Waters"].length;
        for (let i = 0; i < count; i++) {
            let _waterObj = jsonObj["Waters"][i];
            let waterInfo = new REWaterInfo();
            waterInfo.waterName = _waterObj["WaterName"];
            waterInfo.waterClr = rgbaListToClr(_waterObj["Color"]);
            waterInfo.blendDist = _waterObj["BlendDist"];
            waterInfo.visible = _waterObj["Visible"];
            waterInfo.cornerPoint = _waterObj["Corners"];

            waterInfoList.push(waterInfo);
        }
        return waterInfoList;
    }

    /**
     * 删除指定水面
     * @param {String} waterName //水面名称
     */
    Module.Water.delData = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.DelWaterByName(waterName);
    }

    /**
     * 清空全部水面对象
     */
    Module.Water.delAllData = function () {
        return Module.RealBIMWeb.DelAllWaters();
    }

    /**
     * 根据水面名称定位到水面
     * @param {String} waterName //水面名称
     */
    Module.Water.setCamToData = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.LocateToWater(waterName);
    }





    // MARK 编辑
    /**
     * 进入水面编辑状态
     */
    Module.Water.startEditState = function () {
        return Module.RealBIMWeb.BeginWaterEdit();
    }

    /**
     * 退出水面编辑状态
     */
    Module.Water.endEditState = function () {
        return Module.RealBIMWeb.EndWaterEdit();
    }

    /**
     * 进入水面添加状态
     */
    Module.Water.startAddWaterState = function () {
        return Module.RealBIMWeb.BeginAddWaterRgn();
    }

    /**
     * 退出水面添加状态
     */
    Module.Water.endAddWaterState = function () {
        return Module.RealBIMWeb.EndAddWaterRgn();
    }

    /**
     * 为已添加的水面命名一个唯一名称（ AddWaterRgnFinishEvent 事件监听回调 水面添加成功）
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.setWaterName = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.SetNewAddedWaterName(waterName);
    }

    /**
     * 获取所有水面对象的名称
     */
    Module.Water.getAllWaterNames = function () {
        var _vector = Module.RealBIMWeb.GetAllWaterNames();
        var waterIDs = [];
        for (let i = 0; i < _vector.size(); i++) {
            waterIDs.push(_vector.get(i));
        }
        return waterIDs;
    }

    /**
     * 把水面加入选择集
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.addToSelSet = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.AddWaterToSelSet(waterName);
    }

    /**
     * 把指定水面移出选择集
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.delFromSelSet = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.RemoveWaterFromSelSet(waterName);
    }

    /**
     * 清空选择集
     */
    Module.Water.clearSelSet = function () {
        return Module.RealBIMWeb.ClearWaterSelSet();
    }

    /**
     * 获取选择集中的所有水面标识
     */
    Module.Water.getAllSelWaterNames = function () {
        var _vector = Module.RealBIMWeb.GetAllWaterNamesInSelSet();
        var waterIDs = [];
        for (let i = 0; i < _vector.size(); i++) {
            waterIDs.push(_vector.get(i));
        }
        return waterIDs;
    }

    /**
     * 删除当前选中的水面角点
     */
    Module.Water.delSelCorners = function () {
        return Module.RealBIMWeb.DelWaterCornersInSelSet();
    }

    /**
     * 获取指定水面对象的可见性
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getVisible = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.GetWaterVisible(waterName);
    }

    /**
     * 设置指定水面对象的可见性
     * @param {String} waterName //水面唯一标识
     * @param {Boolean} enable //是否可见
     */
    Module.Water.setVisible = function (waterName, enable) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.SetWaterVisible(waterName, enable);
    }

    /**
     * 获取水体颜色
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getClr = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;

        var _clrarr = Module.RealBIMWeb.GetWaterColor(waterName);
        var _alpha = Module.RealBIMWeb.GetWaterAlpha(waterName);

        var waterClr = new BlackHole3D.REColor();
        waterClr.red = _clrarr[0] * 255;
        waterClr.green = _clrarr[1] * 255;
        waterClr.blue = _clrarr[2] * 255;
        waterClr.alpha = _alpha * 255;
        return waterClr;
    }

    /**
     * 设置水体颜色 （RGB）
     * @param {String} waterName //水面唯一标识
     * @param {REColor} waterClr //水面颜色 （REColor 类型）
     */
    Module.Water.setClr = function (waterName, waterClr) {
        if (isEmptyLog(waterName, 'waterName')) return;
        if (isEmptyLog(waterClr, 'waterClr')) return;
        var _R = Math.round(waterClr.red) / 255.0;
        var _G = Math.round(waterClr.green) / 255.0;
        var _B = Math.round(waterClr.blue) / 255.0;
        var _A = Math.round(waterClr.alpha) / 255.0;
        var _clrArr = [_R, _G, _B];

        var isClrSucc = Module.RealBIMWeb.SetWaterColor(waterName, _clrArr);
        var isAlphaSucc = Module.RealBIMWeb.SetWaterAlpha(waterName, _A);
        return isClrSucc && isAlphaSucc;
    }

    /**
     * 获取水体透明度
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getAlpha = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        var _alpha = Module.RealBIMWeb.GetWaterAlpha(waterName);
        return Math.floor(_alpha * 255);
    }

    /**
     * 设置水体透明度
     * @param {String} waterName //水面唯一标识
     * @param {Number} alpha //水面透明度  取值范围 0~255，0表示全透明，255表示不透明
     */
    Module.Water.setAlpha = function (waterName, alpha) {
        if (isEmptyLog(waterName, 'waterName')) return;
        var _a = (parseInt(alpha) / 255);
        return Module.RealBIMWeb.SetWaterAlpha(waterName, _a);
    }

    /**
     * 获取水体跟模型混合系数
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getBlendDist = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.GetWaterBlendDist(waterName);
    }

    /**
     * 设置水体跟模型混合系数
     * @param {String} waterName //水面唯一标识
     * @param {Number} blendDist //混合距离  取值范围 0-1
     */
    Module.Water.setBlendDist = function (waterName, blendDist) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.SetWaterBlendDist(waterName, blendDist);
    }

    /**
     * 获取水面角点
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getCorners = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;

        var _vector = Module.RealBIMWeb.GetWaterCorners(waterName);
        var crnersSet = [];
        for (let i = 0; i < _vector.size(); i++) {
            crnersSet.push(_vector.get(i));
        }
        return crnersSet
    }

    /**
     * 设置水面角点（要在编辑水面模式下实时起作用）
     * @param {String} waterName //水面唯一标识
     * @param {Array} potList //水面点坐标集合 至少有三个点构成一个平面
     */
    Module.Water.setCorners = function (waterName, potList) {
        if (isEmptyLog(waterName, 'waterName')) return;
        if (!checkTypeLog(potList, 'potList', RE_Enum.RE_Check_Array)) return;

        var _arrCorners = new Module.RE_Vector_dvec3();
        for (let i = 0; i < potList.length; i++) {
            let corners = potList[i];
            _arrCorners.push_back(corners);
        }
        return Module.RealBIMWeb.SetWaterCorners(waterName, _arrCorners);
    }

























    // MOD-- 有限元（FEM）
    Module.FEM = typeof Module.FEM !== "undefined" ? Module.FEM : {};//增加 FEM 模块

    /**
     * 加载FEM文件 (回调监听 RealBIMLoadFEM 用于接收加载文件是否成功)
     * @param {String} feId //有限元数据唯一标识
     * @param {String} filePath //FEM文件路径
     */
    Module.FEM.loadData = function (feId, filePath) {
        if (isEmptyLog(feId, 'feId')) return;
        if (isEmptyLog(filePath, 'filePath')) return;
        Module.RealBIMWeb.AddFEMData(feId, filePath);
    }

    /**
     * 移除指定标识的FEM数据
     * @param {String} feId //有限元数据唯一标识
     */
    Module.FEM.removeData = function (feId) {
        if (isEmptyLog(feId, 'feId')) return;
        return Module.RealBIMWeb.RemoveFEMData(feId);
    }

    /**
     * 获取所有的标量属性字段名称集合
     * @param {String} feId //有限元数据唯一标识
     */
    Module.FEM.getAllScalarParamName = function (feId) {
        if (isEmptyLog(feId, 'feId')) return;
        var _vector = Module.RealBIMWeb.GetAllScalarsName(feId);
        var scalarParamList = [];
        for (let i = 0; i < _vector.size(); i++) {
            scalarParamList.push(_vector.get(i));
        }
        return scalarParamList;
    }

    /**
     * 设置用于展示标量信息的属性字段
     * @param {String} feId //有限元数据唯一标识
     * @param {String} scarlarParamName //标量属性字段名称
     */
    Module.FEM.setActiveScalar = function (feId, scarlarParamName) {
        if (isEmptyLog(feId, 'feId')) return;
        if (isEmptyLog(scarlarParamName, 'scarlarParamName')) return;
        return Module.RealBIMWeb.SetActiveScalars(feId, scarlarParamName);
    }

    /**
     * 设置颜色查找表信息（按照HSV格式参数）
     * @param {String} feId //有限元数据唯一标识
     * @param {Vec2} hueRange //色调取值范围 [min,max]  0-1的取值范围
     * @param {Vec2} saturationRange //饱和度取值范围 [min,max]  0-1的取值范围
     * @param {Vec2} valueRange //明度取值范围 [min,max]  0-1的取值范围
     */
    Module.FEM.setCLUT = function (feId, hueRange, saturationRange, valueRange) {
        if (isEmptyLog(feId, 'feId')) return;
        return Module.RealBIMWeb.SetLookUpTableHSV(feId, hueRange, saturationRange, valueRange);
    }









    // MOD-- 轴网（AxisGrid）
    Module.AxisGrid = typeof Module.AxisGrid !== "undefined" ? Module.AxisGrid : {};//增加 AxisGrid 模块

    class REAxisGridInfo {
        constructor() {
            this.guid = null;  //轴线的唯一标识
            this.name = null;   //轴线的名称
            this.lineClr = null;  //轴线的颜色
            this.pos = null;  //轴线两个顶点坐标
        }
    }
    ExtModule.REAxisGridInfo = REAxisGridInfo;

    /**
     * 添加一组轴网数据
     * @param {String} groupName //组名称，该组轴网的唯一标识
     * @param {REAxisGridInfo} infoList //轴网数据集合（REAxisGridInfo 类型）
     */
    Module.AxisGrid.setData = function (groupName, infoList) {
        var _tempGrids = new Module.RE_Vector_GRID();
        for (let i = 0; i < infoList.length; i++) {
            let _info = infoList[i];
            let _tempArrPos = new Module.RE_Vector_vec3();
            for (let j = 0; j < _info.pos.length; j++) {
                _tempArrPos.push_back(_info.pos[j]);
            }
            let _clr = clrToU32(_info.lineClr);
            let _tempObj = {
                m_strGuid: _info.guid,
                m_strName: _info.name,
                m_uColor: _clr,
                m_arrPos: _tempArrPos,
            };
            _tempGrids.push_back(_tempObj);
        }
        return Module.RealBIMWeb.SetGridData(groupName, _tempGrids);
    }

    //获取当前添加的所有轴网组名称
    Module.AxisGrid.getAllGroupNames = function () {
        var allgirdname = Module.RealBIMWeb.GetAllGridGroupName();
        var nameArr = [];
        for (var i = 0; i < allgirdname.size(); ++i) {
            nameArr.push(allgirdname.get(i));
        }
        return nameArr;
    }

    /**
     * 根据轴网组名称获取对应的轴线guid集合
     * @param {String} groupName //组名称，该组轴网的唯一标识
     */
    Module.AxisGrid.getGuid = function (groupName) {
        var allguidname = Module.RealBIMWeb.GetGridGuid(groupName);
        var nameArr = [];
        for (var i = 0; i < allguidname.size(); ++i) {
            nameArr.push(allguidname.get(i));
        }
        return nameArr;
    }

    /**
     * 根据轴网组名称删除数据
     * @param {Array} groupNameList //组名称集合
     */
    Module.AxisGrid.delData = function (groupNameList) {
        var tempGridsName = new Module.RE_Vector_WStr();
        for (var i = 0; i < groupNameList.length; ++i) {
            tempGridsName.push_back(groupNameList[i]);
        }
        Module.RealBIMWeb.DelGridData(tempGridsName);
    }

    /**
     * 删除所有轴网数据
     */
    Module.AxisGrid.delAllData = function () {
        var tempGridsName = new Module.RE_Vector_WStr();
        Module.RealBIMWeb.DelGridData(tempGridsName);
    }

    /**
     * 设置轴线的显示颜色
     * @param {String} groupName //组名称，该组轴网的唯一标识
     * @param {Array} guidList //guid集合
     * @param {REColor} lineClr //轴线颜色（REColor类型）
     */
    Module.AxisGrid.setClr = function (groupName, guidList, lineClr) {
        var tempGrids = new Module.RE_Vector_WStr();
        for (var i = 0; i < guidList.length; ++i) {
            tempGrids.push_back(guidList[i]);
        }
        var tempclr = clrToU32(lineClr);
        Module.RealBIMWeb.SetGridColor(groupName, tempGrids, tempclr);
    }

    /**
     * 设置轴网是否可以被探测
     * @param {Array} groupNameList //组名称集合，空数组代表素有组集合
     * @param {Boolean} enable //是否允许探测
     */
    Module.AxisGrid.setProbeEnable = function (groupNameList, enable) {
        var tempGrids = new Module.RE_Vector_WStr();
        for (var i = 0; i < groupNameList.length; ++i) {
            tempGrids.push_back(groupNameList[i]);
        }
        Module.RealBIMWeb.SetGridProbeEnable(enable, tempGrids);
    }

    /**
     * 设置轴网是否可以被探测
     * @param {Array} groupNameList //组名称集合，空数组代表素有组集合
     * @param {Boolean} enable //是否可见
     */
    Module.AxisGrid.setVisible = function (groupNameList, enable) {
        var tempGrids = new Module.RE_Vector_WStr();
        for (var i = 0; i < groupNameList.length; ++i) {
            tempGrids.push_back(groupNameList[i]);
        }
        Module.RealBIMWeb.SetGridVisible(enable, tempGrids);
    }

    /**
     * 设置轴网是否允许被模型遮挡
     * @param {Boolean} enable //是否允许遮挡
     */
    Module.AxisGrid.setOverlap = function (enable) {
        Module.RealBIMWeb.SetGridContactSce(enable);
    }

    /**
     * 获取当前设置的轴网是否允许被模型遮挡状态
     */
    Module.AxisGrid.getOverlap = function () {
        return Module.RealBIMWeb.GetGridContactSce();
    }






    // MOD-- 标高（Elevation）
    Module.Elevation = typeof Module.Elevation !== "undefined" ? Module.Elevation : {};//增加 Elevation 模块

    class REElevationInfo {
        constructor() {
            this.guid = null;  //标高的唯一标识
            this.name = null;   //标高的名称
            this.lineClr = null;  //标高线颜色
            this.height = null;//高度
            this.topHeight = null;//顶高
            this.bottomHeight = null;//底高
        }
    }
    ExtModule.REElevationInfo = REElevationInfo;

    /**
     * 添加一组标高数据
     * @param {String} groupName //组名称，该组轴网的唯一标识
     * @param {String} dataSetId //数据集唯一标识
     * @param {REElevationInfo} infoList //标高数据集合（REElevationInfo 类型）
     */
    Module.Elevation.setData = function (groupName, dataSetId, infoList) {
        var _tempLevels = new Module.RE_Vector_LEVEL();
        for (let i = 0; i < infoList.length; i++) {
            let _info = infoList[i];
            let _clr = clrToU32(_info.lineClr);
            let _tempObj = {
                m_strGuid: _info.guid,
                m_strName: _info.name,
                m_uColor: _clr,
                m_dHeight: _info.height,
                m_dTopHeight: _info.topHeight,
                m_dBottomHeight: _info.bottomHeight,
            };
            _tempLevels.push_back(_tempObj);
        }
        return Module.RealBIMWeb.SetLevelData(groupName, _tempLevels, dataSetId);
    }

    /**
     * 获取当前添加的标高组名称集合
     */
    Module.Elevation.getAllGroupNames = function () {
        var alllevelname = Module.RealBIMWeb.GetAllLevelGroupName();
        var nameArr = [];
        for (var i = 0; i < alllevelname.size(); ++i) {
            nameArr.push(alllevelname.get(i));
        }
        return nameArr;
    }

    /**
     * 根据组名称获取对应的标高guid集合
     * @param {String} groupName //组名称，该组标高的唯一标识
     */
    Module.Elevation.getGuid = function (groupName) {
        var allguidname = Module.RealBIMWeb.GetLevelGuid(groupName);
        var nameArr = [];
        for (var i = 0; i < allguidname.size(); ++i) {
            nameArr.push(allguidname.get(i));
        }
        return nameArr;
    }

    /**
     * 根据标高组名称删除数据
     * @param {Array} groupNameList //组名称数组集合，为空数组表示删除全部
     */
    Module.Elevation.delData = function (groupNameList) {
        var tempLevelName = new Module.RE_Vector_WStr();
        for (var i = 0; i < groupNameList.length; ++i) {
            tempLevelName.push_back(groupNameList[i]);
        }
        Module.RealBIMWeb.DelLevelData(tempLevelName);
    }

    /**
     * 删除所有标高数据
     */
    Module.Elevation.delAllData = function () {
        var tempLevelName = new Module.RE_Vector_WStr();
        Module.RealBIMWeb.DelLevelData(tempLevelName);
    }

    /**
     * 设置标高的显示颜色
     * @param {String} groupName //组名称，该组标高的唯一标识
     * @param {Array} guidList //guid集合
     * @param {REColor} lineClr //标高颜色（REColor类型）
     */
    Module.Elevation.setClr = function (groupName, guidList, lineClr) {
        var tempLevels = new Module.RE_Vector_WStr();
        for (var i = 0; i < guidList.length; ++i) {
            tempLevels.push_back(guidList[i]);
        }
        var tempclr = clrToU32(lineClr);
        Module.RealBIMWeb.SetLevelColor(groupName, tempLevels, tempclr);
    }

    /**
     * 设置标高是否可以被探测
     * @param {Array} groupNameList //组名称集合，空数组代表所有组集合
     * @param {Boolean} enable //是否允许探测
     */
    Module.Elevation.setProbeEnable = function (groupNameList, enable) {
        var tempLevels = new Module.RE_Vector_WStr();
        for (var i = 0; i < groupNameList.length; ++i) {
            tempLevels.push_back(groupNameList[i]);
        }
        Module.RealBIMWeb.SetLevelProbeEnable(enable, tempLevels);
    }

    /**
     * 设置标高是否显示
     * @param {Array} groupNameList //组名称集合，空数组代表所有组集合
     * @param {Boolean} enable //是否可见
     */
    Module.Elevation.setVisible = function (groupNameList, enable) {
        var tempLevels = new Module.RE_Vector_WStr();
        for (var i = 0; i < groupNameList.length; ++i) {
            tempLevels.push_back(groupNameList[i]);
        }
        Module.RealBIMWeb.SetLevelVisible(enable, tempLevels);
    }

    /**
     * 根据标高的guid获取三个高度值
     * @param {String} groupName //组名称，该组标高的唯一标识
     * @param {String} guid //标高的唯一标识
     */
    Module.Elevation.getData = function (groupName, guid) {
        return Module.RealBIMWeb.GetLevelHeightInfo(groupName, guid);
    }

    /**
     * 设置标高是否允许被模型遮挡
     * @param {Boolean} enable //是否允许遮挡
     */
    Module.Elevation.setOverlap = function (enable) {
        Module.RealBIMWeb.SetLevelContactSce(enable);
    }

    /**
     * 获取当前设置的标高是否允许被模型遮挡状态
     */
    Module.Elevation.getOverlap = function () {
        return Module.RealBIMWeb.GetLevelContactSce();
    }








    // MOD-- 动画（Animation）
    Module.Animation = typeof Module.Animation !== "undefined" ? Module.Animation : {};//增加 Animation 模块

    class REAnimWallInfo {
        constructor() {
            this.groupName = null;//	动态墙组名称
            this.name = null;//	动态墙名称
            this.potList = null;//	动态墙路径顶点坐标及高度，(x, y, z)表示顶点坐标，w表示高度
            this.texPath = null;//	动态墙纹理路径
            this.normalDir = null;//	纹理动画方向是否为法线方向，true为发现方向，false为切线方向
            this.isClose = null;//	动态墙是否强制闭合，默认闭合
        }
    }
    ExtModule.REAnimWallInfo = REAnimWallInfo;

    /**
     * 创建一个动态墙
     * @param {REAnimWallInfo} animWallInfo //动态墙信息
     */
    Module.Animation.addAnimWall = function (animWallInfo) {
        if (isEmptyLog(animWallInfo, "animWallInfo")) return;
        var temparr = new Module.RE_Vector_dvec4();
        for (var i = 0; i < animWallInfo.potList.length; ++i) {
            temparr.push_back(animWallInfo.potList[i]);
        }
        var _bClose = true; if (!isEmpty(animWallInfo.isClose)) { _bClose = animWallInfo.isClose; }
        return Module.RealBIMWeb.AddAnimationWall(animWallInfo.groupName, animWallInfo.name, temparr, animWallInfo.texPath, animWallInfo.normalDir, _bClose);
    }

    class REAnimPlaneInfo {
        constructor() {
            this.groupName = null;//不规则平面组名称
            this.name = null;//不规则平面名称
            this.potList = null;//不规则平面路径顶点坐标 (x,y,z)表示位置 w表示高度
            this.texPath = null;//纹理路径
        }
    }
    ExtModule.REAnimPlaneInfo = REAnimPlaneInfo;

    /**
     * 创建一个扫描面
     * @param {REAnimPlaneInfo} animPlaneInfo //扫描面信息
     */
    Module.Animation.addAnimPlane = function (animPlaneInfo) {
        if (isEmptyLog(animPlaneInfo, "animPlaneInfo")) return;
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animPlaneInfo.potList.length; ++i) {
            temparr.push_back(animPlaneInfo.potList[i]);
        }
        return Module.RealBIMWeb.AddAnimationPlane(animPlaneInfo.groupName, animPlaneInfo.name, temparr, animPlaneInfo.texPath);
    }

    class REAnimSphereInfo {
        constructor() {
            this.groupName = null;//扫描球组名称
            this.nameList = null;//扫描球名称数组
            this.potCenterList = null;//扫描球中心点坐标数组
            this.radius = null;//当前批次扫描球半径
            this.sphere = null;//是否为圆球，true表示圆球，false表示半球
            this.texPath = null;//纹理路径
        }
    }
    ExtModule.REAnimSphereInfo = REAnimSphereInfo;

    /**
     * /创建一组半球体动画
     * @param {REAnimSphereInfo} animSphereInfo //球体信息
     */
    Module.Animation.addAnimSpheres = function (animSphereInfo) {
        if (isEmptyLog(animSphereInfo, "animSphereInfo")) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animSphereInfo.nameList.length; ++i) { temparr0.push_back(animSphereInfo.nameList[i]); }
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animSphereInfo.potCenterList.length; ++i) { temparr.push_back(animSphereInfo.potCenterList[i]); }
        var _isSphere = true; if (!isEmpty(animSphereInfo.sphere)) _isSphere = animSphereInfo.sphere;
        return Module.RealBIMWeb.AddAnimationSpheres(animSphereInfo.groupName, temparr0, temparr, animSphereInfo.radius, _isSphere, animSphereInfo.texPath);
    }

    class REAnimPolygonInfo {
        constructor() {
            this.groupName = null;//扫描平面组名称
            this.nameList = null;//扫描平面名称数组
            this.potCenterList = null;//扫描平面中心点坐标数组
            this.radius = null;//当前批次扫描平面半径
            this.radarScan = null;//扫描效果是否为雷达扫描，true为雷达扫描，false为扩散扫描
            this.isRing = null;//是否为圆形，true表示圆形，此时边数为默认值，false表示多边形
            this.edgeNum = null;//多边形的边数
            this.texPath = null;//纹理路径
        }
    }
    ExtModule.REAnimPolygonInfo = REAnimPolygonInfo;

    /**
     * 创建一组规则平面多边形动画
     * @param {REAnimPolygonInfo} animPolygonInfo //多边形信息
     */
    Module.Animation.addAnimPolygons = function (animPolygonInfo) {
        if (isEmptyLog(animPolygonInfo, "animPolygonInfo")) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animPolygonInfo.nameList.length; ++i) { temparr0.push_back(animPolygonInfo.nameList[i]); }
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animPolygonInfo.potCenterList.length; ++i) { temparr.push_back(animPolygonInfo.potCenterList[i]); }
        var _isRing = false; if (!isEmpty(animPolygonInfo.isRing)) _isRing = animPolygonInfo.isRing;
        var _radarScan = false; if (!isEmpty(animPolygonInfo.radarScan)) _radarScan = animPolygonInfo.radarScan;
        var _edgeNum = 3; if (!isEmpty(animPolygonInfo.edgeNum)) _edgeNum = animPolygonInfo.edgeNum;
        return Module.RealBIMWeb.AddAnimationPolygons(animPolygonInfo.groupName, temparr0, temparr, animPolygonInfo.radius, animPolygonInfo.texPath, _radarScan, _isRing, _edgeNum);
    }

    class REAnimPolyWallInfo {
        constructor() {
            this.groupName = null;//扫描多边形动态墙组名称
            this.nameList = null;//扫描多边形动态墙名称数组
            this.potCenterList = null;//扫描多边形动态墙中心点坐标数组
            this.radius = null;//当前批次扫描多边形动态墙半径
            this.isRing = null;//是否为圆形，true表示圆形，此时边数为默认值，false表示多边形
            this.edgeNum = null;//多边形的边数
            this.height = null;//高度
            this.texPath = null;//纹理路径
            this.normalDir = null;//贴图是否沿法线方向，true为法线方向，false为切线方向
        }
    }
    ExtModule.REAnimPolyWallInfo = REAnimPolyWallInfo;

    /**
     * 创建一组规则多边形动态墙
     * @param {REAnimPolyWallInfo} animPolyWallInfo //多边形动态墙信息
     */
    Module.Animation.addAnimPolygonWalls = function (animPolyWallInfo) {
        if (isEmptyLog(animPolyWallInfo, "animPolyWallInfo")) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animPolyWallInfo.nameList.length; ++i) { temparr0.push_back(animPolyWallInfo.nameList[i]); }
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animPolyWallInfo.potCenterList.length; ++i) { temparr.push_back(animPolyWallInfo.potCenterList[i]); }
        var _isRing = false; if (!isEmpty(animPolyWallInfo.isRing)) _isRing = animPolyWallInfo.isRing;
        var _radarScan = false; if (!isEmpty(animPolyWallInfo.radarScan)) _radarScan = animPolyWallInfo.radarScan;
        var _edgeNum = 4; if (!isEmpty(animPolyWallInfo.edgeNum)) _edgeNum = animPolyWallInfo.edgeNum;
        var _height = 0; if (!isEmpty(animPolyWallInfo.height)) _height = animPolyWallInfo.height;
        return Module.RealBIMWeb.AddAnimationPolygonWalls(animPolyWallInfo.groupName, temparr0, temparr, animPolyWallInfo.radius, _height, animPolyWallInfo.texPath, _isRing, _edgeNum, animPolyWallInfo.normalDir);
    }

    class REAnimAreaBufferInfo {
        constructor() {
            this.groupName = null;//路径平面组名称
            this.name = null;//路径平面名称
            this.potList = null;//中心线路径顶点坐标集合
            this.texPath = null;//纹理路径
            this.width = null;//平面宽度
            this.texLength = -1.0;//纹理对应的长度，默认为0 代表纹理采用等比缩放，使用纹理长度代表当模型超出设定纹理长度时，UV按照纹理长度拼贴扩展
        }
    }
    ExtModule.REAnimAreaBufferInfo = REAnimAreaBufferInfo;

    /**
     * 创建一个规则的路径平面
     * @param {REAnimAreaBufferInfo} animAreaBufferInfo //路径平面信息（REAnimAreaBufferInfo类型）
     */
    Module.Animation.addAnimAreaBuffer = function (animAreaBufferInfo) {
        if (isEmptyLog(animAreaBufferInfo, "animAreaBufferInfo")) return;

        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animAreaBufferInfo.potList.length; ++i) {
            temparr.push_back(animAreaBufferInfo.potList[i]);
        }
        var _texPath = isEmpty(animAreaBufferInfo.texPath) ? "" : animAreaBufferInfo.texPath;
        var _width = isEmpty(animAreaBufferInfo.width) ? 0 : animAreaBufferInfo.width;
        var _texLength = (isEmpty(animAreaBufferInfo.texLength) || animAreaBufferInfo.texLength <= 0) ? -1.0 : animAreaBufferInfo.texLength;
        return Module.RealBIMWeb.AddAnimationAreaBuffer(animAreaBufferInfo.groupName, animAreaBufferInfo.name, temparr, _texPath, _width, _texLength);
    }

    class REAnimCylinderInfo {
        constructor() {
            this.groupName = null;//路径管线组名称
            this.name = null;//路径管线名称
            this.potList = null;//中心线路径顶点坐标集合
            this.texPath = null;//纹理路径
            this.radius = null;//管线半径
        }
    }
    ExtModule.REAnimCylinderInfo = REAnimCylinderInfo;

    /**
     * 创建一个规则的路径管线
     * @param {REAnimCylinderInfo} animCylinderInfo //路径平面信息（REAnimCylinderInfo类型）
     */
    Module.Animation.addAnimCylinder = function (animCylinderInfo) {
        if (isEmptyLog(animCylinderInfo, "animCylinderInfo")) return;

        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animCylinderInfo.potList.length; ++i) {
            temparr.push_back(animCylinderInfo.potList[i]);
        }
        var _texPath = isEmpty(animCylinderInfo.texPath) ? "" : animCylinderInfo.texPath;
        var _radius = isEmpty(animCylinderInfo.radius) ? 0 : animCylinderInfo.radius;
        var _arrWidth = new Module.RE_Vector_dvec3();
        return Module.RealBIMWeb.AddAnimationCylinder(animCylinderInfo.groupName, animCylinderInfo.name, temparr, _texPath, true, _radius, 18, _arrWidth);
    }


    class REShpAnimStyle {
        constructor() {
            this.groupName = null; //矢量动画组名称，此参数不能为空
            this.nameList = []; //矢量动画名称集合，如果nameList为空,则设置该组下所有的矢量动画信息；
            this.animClr = null; //期望的矢量动画颜色（REColor 类型）
            this.clrWeight = 255; //颜色权重, 此权重要使用必须配合颜色值存在
            this.scaleAndOffset = null; //动画速度及方向，正负控制方向，数值控制速度,[]
        }
    }
    ExtModule.REShpAnimStyle = REShpAnimStyle;


    /**
     * 按组名称设置矢量动画的参数
     * @param {REShpAnimStyle} animStyleInfo //矢量动画参数
     */
    Module.Animation.setShapeAnimStyle = function (animStyleInfo) {
        if (isEmptyLog(animStyleInfo.groupName, "groupName")) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animStyleInfo.nameList.length; ++i) { temparr0.push_back(animStyleInfo.nameList[i]); }
        var tempClr = clrToU32_W_WBGR(animStyleInfo.animClr, (isEmpty(animStyleInfo.clrWeight) ? 255 : animStyleInfo.clrWeight));
        return Module.RealBIMWeb.SetShapeAnimStyle(animStyleInfo.groupName, temparr0, tempClr, animStyleInfo.scaleAndOffset);
    }

    /**
     * 删除矢量动画
     * @param {String} groupName //矢量动画组名称，为空字符串删除所有
     * @param {Array} nameList //矢量动画名称集合，如果nameList为空,则删除该组下所有的矢量动画信息；
     */
    Module.Animation.delShpAnimation = function (groupName, nameList) {
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < nameList.length; ++i) { temparr0.push_back(nameList[i]); }
        return Module.RealBIMWeb.DelShpAnimation(groupName, temparr0);
    }











    // MOD-- 剖切（Clip）
    Module.Clip = typeof Module.Clip !== "undefined" ? Module.Clip : {};//增加 Clip 模块

    // MARK 通用
    /**
     * 获取剖切完成后的可见元素ID集合
     * @param {Boolean} deleteCrossPart //是否去除与包围体相交叉部分的构件，只保留包含在包围体内的；false：表示包含交叉；true：表示去除交叉
     */
    Module.Clip.getSurplusID = function (deleteCrossPart) {
        var _deleteCrossPart = false; if (!isEmpty()) _deleteCrossPart = deleteCrossPart;
        var tempselids = new Uint32Array(Module.RealBIMWeb.GetClippedElementIds(_deleteCrossPart));
        var projidarr = [];
        if (tempselids.length < 2) {
            return [];
        }
        var curprojid = tempselids[1];
        var curprojelemarr = [];
        for (var i = 0; i < tempselids.length; i += 2) {
            if (tempselids[i] == 4294967280) {
                //去除c++辅助局部元素的构件id （挖坑用的辅助元素）
                continue;
            }
            if (tempselids[i + 1] == curprojid) {
                curprojelemarr.push(tempselids[i]);
            } else {
                if (curprojelemarr.length > 0) {
                    var curprojinfo = {};
                    curprojinfo["dataSetId"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
                    curprojinfo["elemIdList"] = curprojelemarr;
                    projidarr.push(curprojinfo);
                    curprojelemarr = [];
                }
                curprojid = tempselids[i + 1];
                curprojelemarr.push(tempselids[i]);
            }
        }
        if (curprojelemarr.length > 0) {
            var curprojinfo = {};
            curprojinfo["dataSetId"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
            curprojinfo["elemIdList"] = curprojelemarr;
            projidarr.push(curprojinfo);
            curprojelemarr = [];
        }
        return projidarr;
    }

    class REClipInfo {
        constructor() {
            this.scale = null;//缩放
            this.rotate = null;//旋转
            this.offset = null;//平移
            this.isSingleSurfaceClip = false;//是否是单面剖切
            this.pot1 = null;//三角面剖切顶点1
            this.pot2 = null;//三角面剖切顶点2
            this.pot3 = null;//三角面剖切顶点3
        }
    }
    ExtModule.REClipInfo = REClipInfo;

    /**
     * 获取当前的剖面信息
     */
    Module.Clip.getData = function () {
        var _clipInfoTemp = Module.RealBIMWeb.GetSceneClippingInfo();

        var clipInfo = new REClipInfo();
        clipInfo.rotate = _clipInfoTemp.m_qRotation;
        clipInfo.offset = _clipInfoTemp.m_vTranslation;
        clipInfo.scale = _clipInfoTemp.m_vScale;
        clipInfo.isSingleSurfaceClip = _clipInfoTemp.m_bSingleSurfaceClipping;
        clipInfo.pot1 = _clipInfoTemp.m_vVer0;
        clipInfo.pot2 = _clipInfoTemp.m_vVer1;
        clipInfo.pot3 = _clipInfoTemp.m_vVer2;
        return clipInfo;
    }

    /**
     * 设置剖面信息，设置后进入剖切编辑状态
     * @param {REClipInfo} clipInfo //剖面信息
     */
    Module.Clip.setDataIntoClip = function (clipInfo) {
        if (isEmptyLog(clipInfo, "clipInfo")) return;
        var _clipInfo = {
            m_qRotation: clipInfo.rotate,
            m_vTranslation: clipInfo.offset,
            m_vScale: clipInfo.scale,
            m_bSingleSurfaceClipping: clipInfo.isSingleSurfaceClip,
            m_vVer0: clipInfo.pot1,
            m_vVer1: clipInfo.pot2,
            m_vVer2: clipInfo.pot3,
        };
        return Module.RealBIMWeb.SetSceneClippingInfoEdit(_clipInfo);
    }

    /**
     * 设置剖面信息，设置后进入剖切完成状态
     * @param {REClipInfo} clipInfo //剖面信息
     */
    Module.Clip.setData = function (clipInfo) {
        if (isEmptyLog(clipInfo, "clipInfo")) return;
        var _clipInfo = {
            m_qRotation: clipInfo.rotate,
            m_vTranslation: clipInfo.offset,
            m_vScale: clipInfo.scale,
            m_bSingleSurfaceClipping: clipInfo.isSingleSurfaceClip,
            m_vVer0: clipInfo.pot1,
            m_vVer1: clipInfo.pot2,
            m_vVer2: clipInfo.pot3,
        };
        return Module.RealBIMWeb.SetSceneClippingInfo(_clipInfo);
    }

    /**
     * 退出剖切状态
     */
    Module.Clip.endClip = function () {
        Module.RealBIMWeb.EndSceneClipping();
    }

    /**
     * 判断是否处于剖切浏览模式
     */
    Module.Clip.getClipBrowseState = function () {
        return Module.RealBIMWeb.IsSceneClippingBrowsing();
    }

    /**
     * 设置反向显示剖切区域
     */
    Module.Clip.setReverseShowClipRgn = function () {
        Module.RealBIMWeb.ReverseShowClipRgn();
    }

    /**
     * 设置当前剖切状态为浏览模式
     */
    Module.Clip.setClipBrowseStyle = function () {
        Module.RealBIMWeb.ExecuteSceneClip(false);
    }

    /**
     * 设置当前剖切状态为编辑模式
     */
    Module.Clip.setClipEditStyle = function () {
        Module.RealBIMWeb.ExecuteSceneClip(true);
    }

    /**
     * 重置剖切操作
     */
    Module.Clip.resetClip = function () {
        if (!Module.RealBIMWeb.IsClipObjectValid()) return;//不在剖切模式下
        if (Module.RealBIMWeb.IsSinglePlaneClipping()) {
            // 是否是单面剖切
            Module.RealBIMWeb.ResetClipping(true);
        } else {
            Module.RealBIMWeb.ResetClipping(false);
        }
    }

    /**
     * 获取是否是在剖切模式下
     */
    Module.Clip.getClipState = function () {
        return Module.RealBIMWeb.IsClipObjectValid();
    }

    /**
     * 获取当前处于剖切模式的操作状态（单面剖切、体剖切）
     */
    Module.Clip.getClipOptState = function () {
        if (!Module.RealBIMWeb.IsClipObjectValid()) return 0;//不在剖切模式下
        return Module.RealBIMWeb.IsSinglePlaneClipping() ? 1 : 2;
    }



    // MARK 体剖切

    /**
     * 进入体剖切状态
     * @param {Array} dataList //构件集合（支持多数据集构件集合） [{dataSetId:"",elemIdList:[]}]
     */
    Module.Clip.setBoxClip = function (dataList) {
        if (isEmptyLog(dataList, "dataList")) return;

        if (!dataList.length) {
            Module.RealBIMWeb.BeginSceneClippingByElemSet(false, 0, 0);
        } else {
            var count = 0;
            for (let i = 0; i < dataList.length; i++) {
                let _obj = dataList[i];
                let _list = _obj["elemIdList"];
                count += _list.length;
            }

            var _moemory = (count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory)//分配空间
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (let i = 0; i < dataList.length; i++) {
                let _obj = dataList[i];
                let _list = _obj["elemIdList"];
                let _projid = Module.RealBIMWeb.ConvGolStrID2IntID(_obj["dataSetId"]);
                let elemid = _list[i];
                _elemIds.set([elemid, _projid], i * 2);
            }
            Module.RealBIMWeb.BeginSceneClippingByElemSet(false, _elemIds.byteLength, _elemIds.byteOffset);
        }
    }

    /**
     * 进入体剖切状态（数据集模式）
     * @param {Array} dataSetIdList //数据集标识集合,为空数组代表所有数据集
     */
    Module.Clip.setDataSetBoxClip = function (dataSetIdList) {
        if (isEmptyLog(dataSetIdList, "dataSetIdList")) return;

        var _vector_DataSetIds = new Module.RE_Vector_WStr();
        for (let i = 0; i < dataSetIdList.length; i++) {
            _vector_DataSetIds.push_back(dataSetIdList[i]);
        }
        Module.RealBIMWeb.BeginSceneClippingByProjSet(false, _vector_DataSetIds);
    }

    /**
     * 获取体剖切变换模式
     */
    Module.Clip.getBoxClipTransType = function () {
        return Module.RealBIMWeb.GetSceneClippingTransformMode();
    }

    /**
     * 设置体剖切变换模式
     * @param {Number} type //剖切变换模式(默认缩放) 0:位移 1:旋转 2:缩放  
     */
    Module.Clip.setBoxClipTransType = function (type) {
        var _type = isEmpty(type) ? 2 : type;
        Module.RealBIMWeb.SetSceneClippingTransformMode(_type);
    }

    /**
     * 根据指定高度进行单双面剖切
     * @param {String} dataSetId //数据集标识
     * @param {Number} topHeight //顶高
     * @param {Number} bottomHeight //底高
     * @param {Boolean} single //是否单侧剖切
     */
    Module.Clip.setClipSpecifyHeight = function (dataSetId, topHeight, bottomHeight, single) {
        return Module.RealBIMWeb.ClipByProj(topHeight, bottomHeight, single, dataSetId);
    }






    // MARK 单面剖切
    /**
     * 进入单面剖切状态
     */
    Module.Clip.setSingleClip = function () {
        Module.RealBIMWeb.BeginSceneClippingByElemSet(true, 0, 0);
    }

    /**
     * 获取单面剖切的创建方式
     */
    Module.Clip.getSingleClipCreateType = function () {
        return Module.RealBIMWeb.GetClipPlaneCreateMode();
    }

    /**
     * 设置单面剖切的创建方式（三点构面、鼠标拾取）
     * @param {Number} type //创建模式(默认三点构面) 0:三点构面 1:鼠标拾取  
     */
    Module.Clip.setSingleClipCreateType = function (type) {
        var _type = isEmpty(type) ? 0 : type;
        Module.RealBIMWeb.SetClipPlaneCreateMode(_type);
    }








    // MARK 相机
    /**
     * 根据指定方向定位到剖切面并进行缩放
     * @param {RECamDirEm} locType //定位方向信息（RECamDirEm 枚举类型）
     * @param {Number} scale //表示包围盒高度缩放系数
     */
    Module.Clip.setLocateToClipElem = function (locType, scale) {
        if (isEmptyLog(locType, "locType")) return;
        var _dScale = 1; if (!isEmpty(scale)) { _dScale = scale; }

        var strCamDir = "top";
        switch (locType) {
            case RECamDirEm.CAM_DIR_FRONT:
                strCamDir = "front";
                break;
            case RECamDirEm.CAM_DIR_BACK:
                strCamDir = "back";
                break;
            case RECamDirEm.CAM_DIR_LEFT:
                strCamDir = "left";
                break;
            case RECamDirEm.CAM_DIR_RIGHT:
                strCamDir = "right";
                break;
            case RECamDirEm.CAM_DIR_TOP:
                strCamDir = "top";
                break;
            case RECamDirEm.CAM_DIR_BOTTOM:
                strCamDir = "bottom";
                break;
            default:
                strCamDir = "top";
                break;
        }
        return Module.RealBIMWeb.TargetToCilpElem(strCamDir, _dScale)
    }

    /**
     * 定位相机到剖切面
     */
    Module.Clip.setLocateToClipPlane = function () {
        Module.RealBIMWeb.TargetToClipRegion();
    }







    // MARK 组合剖切













    // MOD-- 小地图（MiniMap）
    Module.MiniMap = typeof Module.MiniMap !== "undefined" ? Module.MiniMap : {};//增加 MiniMap 模块



    // MARK 加载
    /**
     * 加载小地图中的CAD数据（ REMiniMapLoadCAD 事件监听回调 CAD数据添加成功）
     * @param {String} filePath //图纸的资源发布路径
     * @param {RECadUnitEm} unit //CAD单位 RECadUnitEm 枚举值
     * @param {Number} scale //图纸的比例尺信息（默认为1:1）
     */
    Module.MiniMap.loadCAD = function (filePath, unit, scale) {
        if (isEmptyLog(filePath, "filePath")) return;

        var _CADUnit = RECadUnitEm.CAD_UNIT_Meter; if (!isEmpty) _CADUnit = unit;
        var _CADScale = 1.0; if (!isEmpty(scale)) { _CADScale = scale; }
        Module.RealBIMWeb.LoadOverViewCAD(filePath, _CADUnit, _CADScale);
    }

    /**
     * 加载小地图中的图片文件
     * @param {String} texPath //图片路径
     * @param {DVec2} picSize //图片尺寸
     * @param {DVec2} texSize //材质像素尺寸
     * @param {ivec2} insertPos //材质相对插入点
     * @param {Number} alpha //材质透明度 默认值：255， 取值范围 0~255，0表示全透明，255表示不透明
     */
    Module.MiniMap.loadImage = function (texPath, picSize, texSize, insertPos, alpha) {
        if (!checkTypeLog(texPath, 'texPath', RE_Enum.RE_Check_String)) return;

        var _a = 1.0; if (!isEmpty(alpha)) _a = (parseInt(alpha) / 255);
        return Module.RealBIMWeb.LoadOverViewImage(texPath, texSize[0], texSize[1], insertPos, picSize[0], picSize[1], _a);
    }

    /**
     * 调整CAD小地图显示，缩放到当前小地图展示范围
     */
    Module.MiniMap.setShowRangeRefresh = function () {
        return Module.RealBIMWeb.CADOverViewFocusToAll();
    }






    // MARK 渲染设置
    /**
     * 获取小地图的显示状态
     */
    Module.MiniMap.getVisible = function () {
        return Module.RealBIMWeb.GetOverViewShow();
    }

    /**
     * 设置小地图的显示状态
     * @param {Boolean} visible //是否显示
     */
    Module.MiniMap.setVisible = function (visible) {
        if (isEmptyLog(visible, 'visible')) return;
        return Module.RealBIMWeb.SetOverViewShow(visible);
    }

    /**
     * 设置小地图的背景颜色
     * @param {REColor} bgClr //背景颜（REColor 类型）
     */
    Module.MiniMap.setBackClr = function (bgClr) {
        if (isEmptyLog(bgClr, 'bgClr')) return false;
        var _clr = clrToRGBA_List(bgClr);
        Module.RealBIMWeb.SetOverViewBackColor(_clr);
        return true;
    }

    /**
     * 获取小地图的显示区域范围 (小地图显示的实际范围（像素）)
     */
    Module.MiniMap.getRegion = function () {
        return Module.RealBIMWeb.GetOverViewRegion();
    }

    /**
     * 设置小地图的显示区域比例（原点和对焦点相对主界面宽高的百分比）！！！显示范围限制在小地图最大的宽高设置
     * @param {Vec2} scaleOrigin //原点相对于主界面宽高的比例 [0,0]  取值范围0-1
     * @param {Vec2} scaleDiagonal //对角点相对于主界面宽高的比例 [0.3,0.3]  取值范围0-1
     */
    Module.MiniMap.setRegion = function (scaleOrigin, scaleDiagonal) {
        var _Region = scaleOrigin.concat(scaleDiagonal);
        return Module.RealBIMWeb.SetOverViewRegion(_Region);
    }

    /**
     * 获取小地图的最大宽高 (像素值, xy分别表示最大宽度和高度)
     */
    Module.MiniMap.getMaxRegion = function () {
        return Module.RealBIMWeb.GetOverViewMaxRegion();
    }

    /**
     * 设置小地图的最大宽高 (像素值, xy分别表示最大宽度和高度)
     * @param {Vec2} region //xy分别表示最大宽度和高度（像素值）
     */
    Module.MiniMap.setMaxRegion = function (region) {
        return Module.RealBIMWeb.SetOverViewMaxRegion(region);
    }

    /**
     * 获取小地图的最小宽高 (像素值, xy分别表示最小宽度和高度)
     */
    Module.MiniMap.getMinRegion = function () {
        return Module.RealBIMWeb.GetOverViewMinRegion();
    }

    /**
     * 设置小地图的最小宽高 (像素值, xy分别表示最小宽度和高度)
     * @param {Vec2} region //xy分别表示最小宽度和高度（像素值）
     */
    Module.MiniMap.setMinRegion = function (region) {
        return Module.RealBIMWeb.SetOverViewMinRegion(region);
    }

    /**
     * 设置小地图相机显示样式
     * @param {REColor} iconClr //图标颜色（REColor 类型）
     * @param {Number} iconSize //图标大小（按屏幕分辨率） 默认值20px
     */
    Module.MiniMap.setIconStyle = function (iconClr, iconSize) {
        if (isEmptyLog(iconClr, 'iconClr')) return;

        var _clr = clrToU32_W_WBGR(iconClr, iconClr.alpha);
        var _iconSize = 20; if (!isEmpty(iconSize)) _iconSize = iconSize;
        return Module.RealBIMWeb.SetOverViewCamStyle(_clr, _iconSize);
    }



    // MARK 相机
    /**
     * 设置小地图相机位置
     * @param {Vec2} camPos //位置坐标 必传
     * @param {Vec2} camDir //相机朝向 可不传
     */
    Module.MiniMap.setCamLocateTo = function (camPos, camDir) {
        if (isEmptyLog(camPos, "camPos")) return;
        var _dPosX = camPos[0]; var _dPosY = camPos[1];
        var _dDirX = 0; var _dDirY = 0;
        if (camPos.length = 2) {
            _dDirX = camDir[0];
            _dDirY = camDir[1];
        }
        return Module.RealBIMWeb.SetOverViewCamLocation(_dPosX, _dPosY, _dDirX, _dDirY);
    }

    class RECADTransInfo {
        constructor() {
            this.basePos = null;//	变换基点
            this.offset = null;//	偏移量
            this.scaleFactor = null;//	缩放比例
            this.angle = null;//	旋转角度
            this.normal = null;//	法向量
            this.axis = null;//	镜像轴向以基点为基准
        }
    }
    ExtModule.RECADTransInfo = RECADTransInfo;

    class RECADConvertInfo {
        constructor() {
            this.bimPoint = null;//	BIM顶点
            this.cadPoint = null;//	CAD顶点
        }
    }
    ExtModule.RECADConvertInfo = RECADConvertInfo;

    /**
     * 获取顶点映射信息转换为小地图相机相对模型相机的变换数据
     * @param {Array} pointList //对应的BIM和CAD点集合，最少大于等于3个数据 (RECADConvertInfo 类型)
     * @param {RECadUnitEm} unit //CAD单位 RECadUnitEm 枚举值
     */
    Module.MiniMap.getConvertCamTransInfo = function (pointList, unit) {
        if (!checkTypeLog(pointList, 'pointList', RE_Enum.RE_Check_Array)) return {};

        if (pointList.length < 3) {
            logErr("对应的BIM和CAD点集合, 最少大于等于3个数据");
            return;
        }
        var _vector_BIMPoints = new Module.RE_Vector_dvec3();
        var _vector_CADPoints = new Module.RE_Vector_dvec2();
        for (let i = 0; i < pointList.length; i++) {
            let convInfo = pointList[i];
            if (!checkArrCountLog(convInfo.bimPoint, 'bimPoint', 3)) return {};
            if (!checkArrCountLog(convInfo.cadPoint, 'cadPoint', 2)) return {};
            _vector_BIMPoints.push_back(convInfo.bimPoint);
            _vector_CADPoints.push_back(convInfo.cadPoint);
        }
        var _CADUnit = RECadUnitEm.CAD_UNIT_Meter; if (!isEmpty) _CADUnit = unit;

        var _vector_TransformInfo = Module.RealBIMWeb.GetOverViewCamTransformInfoByPosMap(_vector_BIMPoints, _vector_CADPoints, _CADUnit);

        var transInfo = new RECADTransInfo();
        transInfo.basePos = _vector_TransformInfo.m_vBasePos;//变换基点
        transInfo.offset = _vector_TransformInfo.m_vOffset;//偏移量
        transInfo.scaleFactor = _vector_TransformInfo.m_dScaleFactor;//缩放比例
        transInfo.angle = _vector_TransformInfo.m_dAngle;//旋转角度
        transInfo.normal = _vector_TransformInfo.m_vNormal;//法向量
        transInfo.axis = _vector_TransformInfo.m_vAxis;//镜像轴向以基点为基准
        return transInfo;
    }

    /**
     * 设置小地图相机变换数据 (通过顶点映射)
     * @param {Array} pointList //对应的BIM和CAD点集合，最少大于等于3个数据 (RECADConvertInfo 类型)
     * @param {RECadUnitEm} unit //CAD单位 RECadUnitEm 枚举值
     */
    Module.MiniMap.setConvertCamTransInfo = function (pointList, unit) {
        if (!checkTypeLog(pointList, 'pointList', RE_Enum.RE_Check_Array)) return false;

        if (pointList.length < 3) {
            logErr("对应的BIM和CAD点集合, 最少大于等于3个数据");
            return;
        }
        var _vector_BIMPoints = new Module.RE_Vector_dvec3();
        var _vector_CADPoints = new Module.RE_Vector_dvec2();
        for (let i = 0; i < pointList.length; i++) {
            let convInfo = pointList[i];
            if (!checkArrCountLog(convInfo.bimPoint, 'bimPoint', 3)) return {};
            if (!checkArrCountLog(convInfo.cadPoint, 'cadPoint', 2)) return {};
            _vector_BIMPoints.push_back(convInfo.bimPoint);
            _vector_CADPoints.push_back(convInfo.cadPoint);
        }
        var _CADUnit = RECadUnitEm.CAD_UNIT_Meter; if (!isEmpty) _CADUnit = unit;
        var _vector_TransformInfo = Module.RealBIMWeb.GetOverViewCamTransformInfoByPosMap(_vector_BIMPoints, _vector_CADPoints, _CADUnit);
        return Module.RealBIMWeb.SetOverViewCamTransformInfo(_vector_TransformInfo);
    }

    /**
     * 设置小地图相机变换数据 (通过 RECADTransInfo 对象)
     * @param {RECADTransInfo} cadTransInfo //变换信息 (RECADTransInfo 类型)
     */
    Module.MiniMap.setCamTransInfo = function (cadTransInfo) {
        if (isEmptyLog(cadTransInfo, 'cadTransInfo')) return;
        _TransformInfo = {
            m_vBasePos: cadTransInfo.basePos,
            m_vOffset: cadTransInfo.offset,
            m_dScaleFactor: cadTransInfo.scaleFactor,
            m_dAngle: cadTransInfo.angle,
            m_vNormal: cadTransInfo.normal,
            m_vAxis: cadTransInfo.axis,
        };
        return Module.RealBIMWeb.SetOverViewCamTransformInfo(_TransformInfo);
    }

    /**
     * 获取小地图相机变换数据
     */
    Module.MiniMap.getCamTransInfo = function () {
        var _vector_TransformInfo = Module.RealBIMWeb.GetOverViewCamTransformInfo();
        var transInfo = new RECADTransInfo();
        transInfo.basePos = _vector_TransformInfo.m_vBasePos;//变换基点
        transInfo.offset = _vector_TransformInfo.m_vOffset;//偏移量
        transInfo.scaleFactor = _vector_TransformInfo.m_dScaleFactor;//缩放比例
        transInfo.angle = _vector_TransformInfo.m_dAngle;//旋转角度
        transInfo.normal = _vector_TransformInfo.m_vNormal;//法向量
        transInfo.axis = _vector_TransformInfo.m_vAxis;//镜像轴向以基点为基准
        return transInfo;
    }

    /**
     * 设置指定组 CAD类型小地图矢量锚点的相机缩放边界值
     * @param {String} groupId //标识锚点组的标识ID
     * @param {Number} minScale //缩放最小边界
     * @param {Number} maxScale //缩放最大边界
     */
    Module.MiniMap.setCADGroupShpAncScale = function (groupId, minScale, maxScale) {
        if (isEmptyLog(groupId, 'groupId')) return;
        return Module.RealBIMWeb.SetCADOverViewShpAnchorScale(groupId, minScale, maxScale);
    }





    // MARK 锚点

    /**
     * 添加一系列CAD类型小地图矢量锚点 (要在CAD加载完成之后添加)
     * @param {RECADShpAnc} ancList //表示要添加的锚点信息集合（ RECADShpAnc 类型）
     */
    Module.MiniMap.addCADShpAnc = function (ancList) {
        if (isEmptyLog(ancList, 'ancList')) return false;

        var _vector_ShpAnchor = new Module.RE_Vector_CAD_SHP_ANCHOR();
        for (let i = 0; i < ancList.length; i++) {
            let cadShpAnc = ancList[i];

            var _obj = {
                m_strID: isEmpty(cadShpAnc.anchorId) ? "" : cadShpAnc.anchorId,
                m_vPos: isEmpty(cadShpAnc.pos) ? [0.0, 0.0] : cadShpAnc.pos,
                m_strShpPath: isEmpty(cadShpAnc.shpPath) ? "" : cadShpAnc.shpPath,
                m_strGroupID: isEmpty(cadShpAnc.groupId) ? "" : cadShpAnc.groupId,
                m_strText: isEmpty(cadShpAnc.text) ? "" : cadShpAnc.text,
                m_uTextClr: isEmpty(cadShpAnc.textClr) ? 0xffffffff : clrToU32(cadShpAnc.textClr),
                m_dTextSize: isEmpty(cadShpAnc.textSize) ? 16 : cadShpAnc.textSize,
                m_vTextAlign: isEmpty(cadShpAnc.textAlign) ? REGridPosEm.MM : cadShpAnc.textAlign,
            };
            _vector_ShpAnchor.push_back(_obj);
        }
        return Module.RealBIMWeb.AddCADOverViewShpAnchors(_vector_ShpAnchor);
    }


    /**
     * 获取系统中的CAD类型小地图矢量锚点总数
     */
    Module.MiniMap.getCADShpAncNum = function () {
        return Module.RealBIMWeb.GetCADOverViewShpAnchorNum();
    }

    /**
     * 获取系统中所有的CAD类型小地图矢量锚点信息
     */
    Module.MiniMap.getAllCADShpAnc = function () {
        var _vector_ShpAnchorList = Module.RealBIMWeb.GetAllCADOverViewShpAnchors();
        var _shpAnchors = [];
        for (let i = 0; i < _vector_ShpAnchorList.size(); i++) {
            let _shpAnchor = _vector_ShpAnchorList.get(i);

            let shpAnc = new RECADShpAnc();
            shpAnc.pos = _shpAnchor.m_vPos;
            shpAnc.text = _shpAnchor.m_strText;
            shpAnc.textClr = clrU32ToClr(_shpAnchor.m_uTextClr);
            shpAnc.textSize = _shpAnchor.m_dTextSize;
            shpAnc.shpPath = _shpAnchor.m_strShpPath;
            shpAnc.groupId = _shpAnchor.m_strGroupID;
            shpAnc.anchorId = _shpAnchor.m_strID;
            shpAnc.textAlign = _shpAnchor.m_vTextAlign;
            _shpAnchors.push(shpAnc);
        }
        return _shpAnchors;
    }

    /**
     * 获取一个CAD类型小地图矢量锚点的信息
     * @param {String} anchorId //CAD锚点ID  唯一id
     */
    Module.MiniMap.getCADShpAnc = function (anchorId) {
        if (isEmptyLog(anchorId, 'anchorId')) return;
        var _vector_ShpAnchor = Module.RealBIMWeb.GetCADOverViewShpAnchor(anchorId);

        var shpAnc = new RECADShpAnc();
        shpAnc.pos = _vector_ShpAnchor.m_vPos;
        shpAnc.text = _vector_ShpAnchor.m_strText;
        shpAnc.textClr = clrU32ToClr(_vector_ShpAnchor.m_uTextClr);
        shpAnc.textSize = _vector_ShpAnchor.m_dTextSize;
        shpAnc.shpPath = _vector_ShpAnchor.m_strShpPath;
        shpAnc.groupId = _vector_ShpAnchor.m_strGroupID;
        shpAnc.anchorId = _vector_ShpAnchor.m_strID;
        shpAnc.textAlign = _vector_ShpAnchor.m_vTextAlign;
        return shpAnc;
    }

    /**
     * 获取系统中所有CAD类型小地图矢量锚点组的名称
     */
    Module.MiniMap.getAllCADShpAncGroupIDs = function () {
        var _vector_GroupIDs = Module.RealBIMWeb.GetAllCADOverViewShpAnchorGroupIDs();
        var _groupIDs = [];
        for (let i = 0; i < _vector_GroupIDs.size(); i++) {
            _groupIDs.push(_vector_GroupIDs.get(i));
        }
        return _groupIDs;
    }

    /**
     * 获取系统中某个CAD类型小地图矢量锚点组包含的所有CAD矢量锚点信息
     * @param {String} groupId //锚点所属的组名称ID
     */
    Module.MiniMap.getCADGroupShpAnc = function (groupId) {
        if (isEmptyLog(groupId, 'groupId')) return;
        var _vector_ShpAnchorList = Module.RealBIMWeb.GetGroupCADOverViewShpAnchors(groupId);
        var _shpAnchors = [];
        for (let i = 0; i < _vector_ShpAnchorList.size(); i++) {
            let _shpAnchor = _vector_ShpAnchorList.get(i);

            let shpAnc = new RECADShpAnc();
            shpAnc.pos = _shpAnchor.m_vPos;
            shpAnc.text = _shpAnchor.m_strText;
            shpAnc.textClr = clrU32ToClr(_shpAnchor.m_uTextClr);
            shpAnc.textSize = _shpAnchor.m_dTextSize;
            shpAnc.shpPath = _shpAnchor.m_strShpPath;
            shpAnc.groupId = _shpAnchor.m_strGroupID;
            shpAnc.anchorId = _shpAnchor.m_strID;
            shpAnc.textAlign = _shpAnchor.m_vTextAlign;
            _shpAnchors.push(shpAnc);
        }
        return _shpAnchors;
    }

    /**
     * 删除系统所有的CAD类型小地图矢量锚点
     */
    Module.MiniMap.delAllCADShpAnc = function () {
        return Module.RealBIMWeb.DelAllCADOverViewShpAnchors();
    }

    /**
     * 删除对应ID列表的 CAD类型小地图矢量锚点
     * @param {Array} anchorIdList //锚点id数组
     */
    Module.MiniMap.delCADShpAnc = function (anchorIdList) {
        if (isEmptyLog(anchorIdList, 'anchorIdList')) return false;
        var _vector_AnchorIDs = new Module.RE_Vector_WStr();
        for (let i = 0; i < anchorIdList.length; i++) {
            let anc = anchorIdList[i];
            _vector_AnchorIDs.push_back(anc);
        }
        return Module.RealBIMWeb.DelCADOverViewShpAnchors(_vector_AnchorIDs);
    }

    /**
     * 删除对应组 包含的所有CAD矢量锚点
     * @param {String} groupId //锚点所属的组名称ID
     */
    Module.MiniMap.delCADGroupShpAnc = function (groupId) {
        if (isEmptyLog(groupId, 'groupId')) return;
        return Module.RealBIMWeb.DelGroupCADOverViewShpAnchors(groupId);
    }







    // MOD-- 管道（Pipe）
    Module.Pipe = typeof Module.Pipe !== "undefined" ? Module.Pipe : {};//增加 Pipe 模块


    // MARK 加载
    class REPipeInfo {
        constructor() {
            this.dataSetId = null;// 数据集标识
            this.pipeId = null;// 管道唯一标识
            this.elemIdList = null;// 连续的构件id集合
            this.texPath = null;// 纹理路径
            this.pipeClr = null;// 管道显示的颜色 （REColor 类型）
        }
    }
    ExtModule.REPipeInfo = REPipeInfo;

    /**
     * 添加一组连续管道
     * @param {REPipeInfo} pipeInfo //管道信息 （REPipeInfo 类型）
     */
    Module.Pipe.addContPipe = function (pipeInfo) {
        if (isEmptyLog(pipeInfo, 'pipeInfo')) return;
        if (isEmptyLog(pipeInfo.dataSetId, 'dataSetId')) return;
        if (isEmptyLog(pipeInfo.elemIdList, 'elemIdList')) return;
        if (isEmptyLog(pipeInfo.pipeId, 'pipeId')) return;

        var count = pipeInfo.elemIdList.length;
        var _moemory = (count * 4).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory);//分配空间
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < count; ++i) {
            var eleid = pipeInfo.elemIdList[i];
            _elemIds.set([eleid], i);
        }

        var _texPath = !isEmpty(pipeInfo.texPath) ? pipeInfo.texPath : "";
        var _pipeClr = !isEmpty(pipeInfo.pipeClr) ? clrToU32(pipeInfo.pipeClr) : 0xffffffff;
        Module.RealBIMWeb.AddContPipe(pipeInfo.dataSetId, pipeInfo.pipeId, _elemIds.byteLength, _elemIds.byteOffset, _texPath, _pipeClr);

    }

    /**
     * 删除连续管道
     * @param {Array} pipeIdList //管道id集合，空数组表示所有管道
     */
    Module.Pipe.delContPipe = function (pipeIdList) {
        var _vector_PipeIds = new Module.RE_Vector_WStr();
        for (let i = 0; i < pipeIdList.length; i++) {
            let pipeId = pipeIdList[i];
            _vector_PipeIds.push_back(pipeId);
        }
        Module.RealBIMWeb.DelContPipe(_vector_PipeIds);
    }

    /**
     * 获取连续管道的标识集合
     */
    Module.Pipe.getAllContPipeId = function () {
        var _temparr = Module.RealBIMWeb.GetAllContPipeID();
        var pipeIdList = [];
        for (var i = 0; i < _temparr.size(); ++i) {
            var tempobj = _temparr.get(i);
            pipeIdList.push(tempobj);
        }
        return pipeIdList;
    }

    /**
     * 获取连续管道信息中构件的ID集合
     * @param {String} pipeId //管道标识
     */
    Module.Pipe.getContPipeElemIDs = function (pipeId) {
        var tempselids = new Uint32Array(Module.RealBIMWeb.GetContPipeSubElemID(pipeId));
        var projidarr = [];
        if (tempselids.length < 2) {
            return [];
        }
        var curprojid = tempselids[1];
        var curprojelemarr = [];
        for (var i = 0; i < tempselids.length; i += 2) {
            if (tempselids[i + 1] == curprojid) {
                curprojelemarr.push(tempselids[i]);
            } else {
                if (curprojelemarr.length > 0) {
                    var curprojinfo = {};
                    curprojinfo["dataSetId"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
                    curprojinfo["elemIdList"] = curprojelemarr;
                    projidarr.push(curprojinfo);
                    curprojelemarr = [];
                }
                curprojid = tempselids[i + 1];
                curprojelemarr.push(tempselids[i]);
            }
        }
        if (curprojelemarr.length > 0) {
            var curprojinfo = {};
            curprojinfo["dataSetId"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
            curprojinfo["elemIdList"] = curprojelemarr;
            projidarr.push(curprojinfo);
            curprojelemarr = [];
        }
        return projidarr.length ? projidarr[0] : {};
    }

    /**
     * 获取连续管道信息
     * @param {Array} pipeIdList //管道标识集合, 为空数组代表所有管道
     */
    Module.Pipe.getContPipeInfoXMLStr = function (pipeIdList) {
        if (isEmptyLog(pipeIdList, 'pipeIdList')) return;
        var _vector_PipeIds = new Module.RE_Vector_WStr();
        for (let i = 0; i < pipeIdList.length; i++) {
            let pipeId = pipeIdList[i];
            _vector_PipeIds.push_back(pipeId);
        }
        return Module.RealBIMWeb.GetContPipe(_vector_PipeIds);
    }

    /**
     * 加载连续管道
     * @param {string} dataSetId //数据集标识
     * @param {string} pipeInfoXMLStr //管道信息xml字符串
     */
    Module.Pipe.setContPipeInfoXMLStr = function (dataSetId, pipeInfoXMLStr) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(pipeInfoXMLStr, 'pipeInfoXMLStr')) return;
        Module.RealBIMWeb.SetContPipe(dataSetId, pipeInfoXMLStr);
    }

    /**
     * 生成连续管道中心线
     * @param {Array} pipeIdList //管道标识集合, 为空数组代表所有管道
     */
    Module.Pipe.setGenContPipeCenterLine = function (pipeIdList) {
        if (isEmptyLog(pipeIdList, 'pipeIdList')) return;
        var _vector_PipeIds = new Module.RE_Vector_WStr();
        for (let i = 0; i < pipeIdList.length; i++) {
            let pipeId = pipeIdList[i];
            _vector_PipeIds.push_back(pipeId);
        }
        Module.RealBIMWeb.GenContPipeCenterLine(_vector_PipeIds);
    }





    // MARK 渲染设置
    /**
     * 设置连续管道的纹理
     * @param {String} pipeId //管道标识
     * @param {String} picPath //纹理地址
     */
    Module.Pipe.setContPipeTex = function (pipeId, picPath) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        if (isEmptyLog(picPath, 'picPath')) return;
        return Module.RealBIMWeb.SetContPipeTex(pipeId, picPath);
    }

    /**
     * 获取连续管道的纹理路径
     * @param {String} pipeId //管道标识
     */
    Module.Pipe.getContPipeTex = function (pipeId) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        return Module.RealBIMWeb.GetContPipeTex(pipeId);
    }

    /**
     * 设置连续管道的颜色
     * @param {String} pipeId //管道标识
     * @param {REColor} pipeClr //管道颜色
     */
    Module.Pipe.setContPipeClr = function (pipeId, pipeClr) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        var _pipeClr = !isEmpty(pipeClr) ? clrToU32(pipeClr) : 0xffffffff;
        Module.RealBIMWeb.SetContPipeClr(pipeId, _pipeClr);
    }

    /**
     * 获取连续管道的颜色
     * @param {String} pipeId //管道标识
     */
    Module.Pipe.getContPipeClr = function (pipeId) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        var _uPipeClr = Module.RealBIMWeb.GetContPipeClr(pipeId);
        return clrU32ToClr(_uPipeClr);
    }

    /**
     * 设置当前连续管道的颜色
     * @param {REColor} pipeClr //管道颜色
     */
    Module.Pipe.setCurContPipeClr = function (pipeClr) {
        var _pipeClr = !isEmpty(pipeClr) ? clrToU32(pipeClr) : 0xffffffff;
        Module.RealBIMWeb.SetCurContPipeClr(_pipeClr);
    }

    /**
     * 获取当前连续管道的颜色
     */
    Module.Pipe.getCurContPipeClr = function () {
        var _uPipeClr = Module.RealBIMWeb.GetCurContPipeClr();
        return clrU32ToClr(_uPipeClr);
    }

    /**
     * 设置连续管道是否显示
     * @param {Array} pipeIdList //管道标识集合
     * @param {Boolean} enable //是否显示
     * @param {Boolean} showAnc //是否显示锚点，仅在 enable 为true时设置才有效
     */
    Module.Pipe.setShowContPipe = function (pipeIdList, enable, showAnc) {
        if (isEmptyLog(pipeIdList, 'pipeIdList')) return;
        var _vector_PipeIds = new Module.RE_Vector_WStr();
        for (let i = 0; i < pipeIdList.length; i++) {
            let pipeId = pipeIdList[i];
            _vector_PipeIds.push_back(pipeId);
        }
        Module.RealBIMWeb.ShowContPipe(_vector_PipeIds, enable, showAnc);
    }



    // MARK 编辑
    /**
     * 开始进入连续管道交互状态
     */
    Module.Pipe.startEditContPipeMode = function () {
        Module.RealBIMWeb.EnterContPipeMode();
    }

    /**
     * 结束连续管道交互模式
     */
    Module.Pipe.endEditContPipeMode = function () {
        Module.RealBIMWeb.ExitContPipeMode();
    }

    /**
     * 获取是否在连续管道编辑状态
     */
    Module.Pipe.getContPipeMode = function () {
        return Module.RealBIMWeb.GetContPipeMode();
    }

    /**
     * 设置当前连续管道
     * @param {String} pipeId //管道标识
     */
    Module.Pipe.setCurContPipe = function (pipeId) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        Module.RealBIMWeb.SetCurContPipe(pipeId);
    }

    /**
     * 获取当前连续管道ID
     */
    Module.Pipe.getCurContPipe = function () {
        return Module.RealBIMWeb.GetCurContPipeID();
    }

    /**
     * 保存当前连续管道
     */
    Module.Pipe.saveCurContPipe = function () {
        Module.RealBIMWeb.SaveCurContPipe();
    }

    /**
     * 重置当前连续管道
     */
    Module.Pipe.resetCurContPipe = function () {
        Module.RealBIMWeb.ResetCurContPipe();
    }

    /**
     * 从当前操作的管道中移除构件
     * @param {string} dataSetId //数据集标识
     * @param {Array} elemIdList //构件标识集合, 为空数组代表所有构件
     */
    Module.Pipe.removeCurContPipeSubElem = function (dataSetId, elemIdList) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;

        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(elemUVAnim.dataSetId);
        var count = elemIdList.length;
        var _moemory = (count * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory);//分配空间
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < count; ++i) {
            var eleid = pipeInfo.elemIdList[i];
            _elemIds.set([eleid, _projid], i * 2);
        }
        Module.RealBIMWeb.RemoveCurContPipeSubElem(_elemIds.byteLength, _elemIds.byteOffset);
    }

    /**
     * 获取当前连续管道的构件ID集合
     */
    Module.Pipe.getCurContPipeAllElemIDs = function () {
        var tempselids = new Uint32Array(Module.RealBIMWeb.GetCurContPipeAllSubElemID());
        var projidarr = [];
        if (tempselids.length < 2) {
            return [];
        }
        var curprojid = tempselids[1];
        var curprojelemarr = [];
        for (var i = 0; i < tempselids.length; i += 2) {
            if (tempselids[i + 1] == curprojid) {
                curprojelemarr.push(tempselids[i]);
            } else {
                if (curprojelemarr.length > 0) {
                    var curprojinfo = {};
                    curprojinfo["dataSetId"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
                    curprojinfo["elemIdList"] = curprojelemarr;
                    projidarr.push(curprojinfo);
                    curprojelemarr = [];
                }
                curprojid = tempselids[i + 1];
                curprojelemarr.push(tempselids[i]);
            }
        }
        if (curprojelemarr.length > 0) {
            var curprojinfo = {};
            curprojinfo["dataSetId"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
            curprojinfo["elemIdList"] = curprojelemarr;
            projidarr.push(curprojinfo);
            curprojelemarr = [];
        }
        return projidarr.length ? projidarr[0] : {};
    }


















    // function getName() {
    //     let reg = /\s+at\s(\S+)\s\(/g
    //     let str = new Error().stack.toString()
    //     let res = reg.exec(str) && reg.exec(str)
    //     return res && res[1]
    // }
    // var name = getName().replace('CreateBlackHoleWebSDK.Module.','')

    // MOD-- 自定义方法 (工具)
    /**
     * 是不是空对象
     */
    function isEmpty(value) {
        if (typeof value == 'undefined') return true;
        if (value == null) return true;
        // if (!value) return true;
        if ((Object.keys(value).length === 0 && value.constructor === Object)) return true;
        return false;
    }

    /**
    * 是不是空对象，并打印错误
    */
    function isEmptyLog(value, name) {
        if (!isEmpty(value)) return false;
        logParErr(name);
        return true;
    }

    /**
     * 检查类型是否匹配
     */
    function checkType(value, type) {
        if (isEmpty(value)) return false;

        switch (type) {
            case RE_Enum.RE_Check_String:
                {
                    if ((typeof value != "string")) {
                        return false;
                    }
                }
                break;
            case RE_Enum.RE_Check_Array:
                {
                    if (!(value instanceof Array)) {
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
     * 检查类型是否匹配, 并打印
     */
    function checkTypeLog(value, name, type) {
        if (checkType(value, type)) return true;
        logErr("参数类型不匹配！-> ", name);
        return false;
    }

    /**
     * 检查类型是否是数组并且判断个数
     */
    function checkArrCount(value, count) {
        if (!checkType(value, RE_Enum.RE_Check_Array)) return false;
        if (value.length != count) return false;
        return true;
    }

    /**
     * 检查类型是否是数组并且判断个数, 并打印
     */
    function checkArrCountLog(value, name, count) {
        if (checkArrCount(value, count)) return true;
        logErr("参数类型不匹配！-> ", name);
        return false;
    }

    /**
     * 打印错误
     */
    function logErr(errStr) {
        console.error("【REError】: " + errStr);
    }

    /**
     * 打印参数格式错误
     */
    function logParErr(errStr) {
        console.error("【REError】: 参数格式不正确！-> " + errStr);
    }









    /**
     * 32位颜色转十六进制颜色 ABGR -> RBG_HEX
     * @param {Number} colorU32 //32位颜色值
    */
    function clrU32ToClr(colorU32) {
        let _hexStr = (colorU32).toString(16);
        let count = _hexStr.length;
        for (let a = 0; a < (8 - count); a++) {
            _hexStr = '0' + _hexStr;
        }
        // ABGR -> RGBA
        var _hexStr_Reverse = _hexStr.split('').reverse().join('');
        var _hex_R = _hexStr_Reverse.substring(0, 2); var int_R = Math.round(parseInt(_hex_R, 16));
        var _hex_G = _hexStr_Reverse.substring(2, 4); var int_G = Math.round(parseInt(_hex_G, 16));
        var _hex_B = _hexStr_Reverse.substring(4, 6); var int_B = Math.round(parseInt(_hex_B, 16));
        var _hex_A = _hexStr_Reverse.substring(6, 8); var int_A = Math.round(parseInt(_hex_A, 16));

        return new REColor(int_R, int_G, int_B, int_A);
    }

    /**
     * 颜色对象->U32_ABGR
     * @param {REColor} color
    */
    function clrToU32(color) {
        if (isEmpty(color.red) || isEmpty(color.green) || isEmpty(color.blue) || isEmpty(color.alpha)) return 0xFFFFFFFF;
        var int_R = Math.round(color.red); var clrHEX_R = (int_R > 15 ? (int_R.toString(16)) : ("0" + int_R.toString(16)));
        var int_G = Math.round(color.green); var clrHEX_G = (int_G > 15 ? (int_G.toString(16)) : ("0" + int_G.toString(16)));
        var int_B = Math.round(color.blue); var clrHEX_B = (int_B > 15 ? (int_B.toString(16)) : ("0" + int_B.toString(16)));
        var int_A = Math.round(color.alpha); var clrHEX_A = (int_A > 15 ? (int_A.toString(16)) : ("0" + int_A.toString(16)));
        var clrHEX_ABGR = "0x" + clrHEX_A + clrHEX_B + clrHEX_G + clrHEX_R;
        var intClr_ABGR = parseInt(clrHEX_ABGR);
        return intClr_ABGR;
    }

    /**
     * 颜色对象->U32_WBGR
     * @param {REColor} color
    */
    function clrToU32_WBGR(color) {
        if ((isEmpty(color.red) || color.red.toString() == "NaN")
            || (isEmpty(color.green) || color.green.toString() == "NaN")
            || (isEmpty(color.blue) || color.blue.toString() == "NaN")) return 0x00FFFFFF;
        var int_R = Math.round(color.red); var clrHEX_R = (int_R > 15 ? (int_R.toString(16)) : ("0" + int_R.toString(16)));
        var int_G = Math.round(color.green); var clrHEX_G = (int_G > 15 ? (int_G.toString(16)) : ("0" + int_G.toString(16)));
        var int_B = Math.round(color.blue); var clrHEX_B = (int_B > 15 ? (int_B.toString(16)) : ("0" + int_B.toString(16)));
        var clrHEX_W = (255).toString(16);
        var clrHEX_WBGR = "0x" + clrHEX_W + clrHEX_B + clrHEX_G + clrHEX_R;
        var intClr_WBGR = parseInt(clrHEX_WBGR);
        return intClr_WBGR;
    }

    function clrToU32_W_WBGR(color, weight) {
        if ((isEmpty(color.red) || color.red.toString() == "NaN")
            || (isEmpty(color.green) || color.green.toString() == "NaN")
            || (isEmpty(color.blue) || color.blue.toString() == "NaN")
        ) {
            var intclrper = Math.round(weight);
            var newclrper = (intclrper > 15 ? (intclrper.toString(16)) : ("0" + intclrper.toString(16)));
            var clrinfo = "0x" + newclrper + "0000ff";
            var clr = parseInt(clrinfo);
            return clr;
        }
        var int_R = Math.round(color.red); var clrHEX_R = (int_R > 15 ? (int_R.toString(16)) : ("0" + int_R.toString(16)));
        var int_G = Math.round(color.green); var clrHEX_G = (int_G > 15 ? (int_G.toString(16)) : ("0" + int_G.toString(16)));
        var int_B = Math.round(color.blue); var clrHEX_B = (int_B > 15 ? (int_B.toString(16)) : ("0" + int_B.toString(16)));
        var int_W = Math.round(weight); var clrHEX_W = (int_W > 15 ? (int_W.toString(16)) : ("0" + int_W.toString(16)));
        var clrHEX_WBGR = "0x" + clrHEX_W + clrHEX_B + clrHEX_G + clrHEX_R;
        var intClr_WBGR = parseInt(clrHEX_WBGR);
        return intClr_WBGR;
    }

    /**
     * 透明度->U32_WA
     * @param {Number} alpha
    */
    function alphaToU32_WA(alpha) {
        if (isEmpty(alpha)) return 0xFFFFFFFF;
        var int_A = Math.round(alpha); var clrHEX_A = (int_A > 15 ? (int_A.toString(16)) : ("0" + int_A.toString(16)));
        var clrHEX_W = (255).toString(16);
        var clrHEX_WA = "0x" + clrHEX_W + clrHEX_A + "ffff";
        var intClr_WA = parseInt(clrHEX_WA);
        return intClr_WA;
    }

    function alphaToU32_WA_UseCA(alpha, weight, useNewClr, useNewAlpha) {
        var _useNewClrHex = useNewClr ? "ff" : "00";//使用新的颜色
        var _useNewAlphaHex = useNewAlpha ? "ff" : "00";//使用新的透明度
        if (isEmpty(alpha)) {
            var clrHEX_W = (weight).toString(16);
            var clrHEX_WA = "0x" + clrHEX_W + "ff" + _useNewClrHex + _useNewAlphaHex;
            var intClr_WA = parseInt(clrHEX_WA);
            return intClr_WA;
        }
        var int_A = Math.round(alpha); var clrHEX_A = (int_A > 15 ? (int_A.toString(16)) : ("0" + int_A.toString(16)));
        var int_W = Math.round(weight); var clrHEX_W = (int_W > 15 ? (int_W.toString(16)) : ("0" + int_W.toString(16)));
        var clrHEX_WA = "0x" + clrHEX_W + clrHEX_A + _useNewClrHex + _useNewAlphaHex;
        var intClr_WA = parseInt(clrHEX_WA);
        return intClr_WA;
    }

    /**
     * 透明度权重->U32_WA
     * @param {Number} alpha_W
    */
    function alphaWToU32_WA(alpha_W) {
        if (isEmpty(alpha_W)) return 0xFFFFFFFF;
        var int_AW_r = 255 - Math.round(alpha_W);//设置透明度使用权重进行设置，不然会造成混合的异常（透明材质的情况）；透明值始终为0，想设置透明，即权重的比例增大；不透明，即权重的比例减少
        var clrHEX_AW = (int_AW_r > 15 ? (int_AW_r.toString(16)) : ("0" + int_AW_r.toString(16)));
        var clrHEX_WA = "0x" + clrHEX_AW + "00" + "ffff";
        var intClr_WA = parseInt(clrHEX_WA);
        return intClr_WA;
    }
    /**
     * 颜色对象->RGBA数组
     * @param {REColor} color
    */
    function clrToRGBA_List(color) {
        var _R = Math.round(color.red) / 255.0;
        var _G = Math.round(color.green) / 255.0;
        var _B = Math.round(color.blue) / 255.0;
        var _A = Math.round(color.alpha) / 255.0;
        var _rgba_list = [_R, _G, _B, _A];
        return _rgba_list;
    }
    /**
     * RGBA数组->颜色对象
     * @param {Array} rbga_list
    */
    function rgbaListToClr(rbga_list) {
        var _r = Math.floor(rbga_list[0] * 255);
        var _g = Math.floor(rbga_list[1] * 255);
        var _b = Math.floor(rbga_list[2] * 255);
        var _a = Math.floor(rbga_list[3] * 255);
        return new REColor(_r, _g, _b, _a);
    }


    /**
     * 发光和PBR转换工具函数
     * @param {REElemBlendAttr} elemBlendAttr //构件的混合属性
    */
    function convPBR(elemBlendAttr) {
        var intemis = (isEmpty(elemBlendAttr.elemEmis)) ? 0 : Math.round(elemBlendAttr.elemEmis);
        var intemisratio = (isEmpty(elemBlendAttr.elemEmisPercent)) ? 0 : Math.round(elemBlendAttr.elemEmisPercent);
        var intsmoothtemp = (isEmpty(elemBlendAttr.elemSmooth)) ? 0 : Math.round(elemBlendAttr.elemSmooth);
        var intmetaltemp = (isEmpty(elemBlendAttr.elemMetal)) ? 0 : Math.round(elemBlendAttr.elemMetal);
        var intsmmeratio = (isEmpty(elemBlendAttr.elemSmmePercent)) ? 0 : Math.round(elemBlendAttr.elemSmmePercent);
        var intsmooth = Math.round(intsmoothtemp / 255 * 63);
        var intmetal = Math.round(intmetaltemp / 255 * 3);
        var pbrtemp = intemis + intemisratio * 256 + intsmooth * 65536 + intmetal * 4194304 + intsmmeratio * 16777216;
        var pbr = Math.round(pbrtemp);
        return pbr;
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
    */
    function isRepeat(array, paramName) {
        var objlist = [];
        for (const key in array) {
            if (Object.hasOwnProperty.call(array, key)) {
                const element = array[key];
                objlist.push(element[paramName]);
            }
            else { continue; }
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

    /**
     * 删除所有空属性
     */
    function removeEmptyProperty(obj) {
        Object.keys(obj).forEach(item => {
            if (obj[item] === undefined || obj[item] === null || obj[item] === 'null') {
                delete obj[item];
            }
        })
        return obj
    }




    // MOD-- 枚举类型

    // MARK RE_Enum
    //枚举参数
    const RE_Enum = {
        RE_Check_String: 1,//检测字符串
        RE_Check_Array: 2,//检测数组
    }


    // MARK RE_Viewport
    //视图类型
    const REVpTypeEm = {
        None: '',//该视图不显示任何内容
        BIM: 'BIM',//该视图显示BIM场景模型
        CAD: 'CAD',//该视图显示CAD图纸
        Panorama: '360',//该视图显示360全景图
    }
    ExtModule.REVpTypeEm = REVpTypeEm;

    //视图排列方式
    const REVpRankEm = {
        Single: 0,//视图0/视图1任一为空字符串：屏幕中只显示一个内容有效的视图
        LR: 1,//屏幕自左向右依次显示视图0、视图1
        TB: -1,//屏幕自下向上依次显示视图0、视图1
    }
    ExtModule.REVpRankEm = REVpRankEm;

    // MARK CamLoc
    //表示ViewCude视图的类型
    const RECamDirEm = {
        CAM_DIR_FRONT: "Module.RE_CAM_DIR.FRONT",//面-主视图（前视图）
        CAM_DIR_BACK: "Module.RE_CAM_DIR.BACK",//面-后视图
        CAM_DIR_LEFT: "Module.RE_CAM_DIR.LEFT",//面-左视图
        CAM_DIR_RIGHT: "Module.RE_CAM_DIR.RIGHT",//面-右视图
        CAM_DIR_TOP: "Module.RE_CAM_DIR.TOP",//面-俯视图（上视图）
        CAM_DIR_BOTTOM: "Module.RE_CAM_DIR.BOTTOM",//面-仰视图（下视图）
        CAM_DIR_TOPFRONT: "Module.RE_CAM_DIR.TOPFRONT",//棱-上前
        CAM_DIR_TOPRIGHT: "Module.RE_CAM_DIR.TOPRIGHT",//棱-上右
        CAM_DIR_TOPBACK: "Module.RE_CAM_DIR.TOPBACK",//棱-上后
        CAM_DIR_TOPLEFT: "Module.RE_CAM_DIR.TOPLEFT",//棱-上左
        CAM_DIR_LEFTFRONT: "Module.RE_CAM_DIR.LEFTFRONT",//棱-左前
        CAM_DIR_RIGHTFRONT: "Module.RE_CAM_DIR.RIGHTFRONT",//棱-前右
        CAM_DIR_RIGHTBACK: "Module.RE_CAM_DIR.RIGHTBACK",//棱-右后
        CAM_DIR_LEFTBACK: "Module.RE_CAM_DIR.LEFTBACK",//棱-后左
        CAM_DIR_BOTTOMFRONT: "Module.RE_CAM_DIR.BOTTOMFRONT",//棱-下前
        CAM_DIR_BOTTOMRIGHT: "Module.RE_CAM_DIR.BOTTOMRIGHT",//棱-下右
        CAM_DIR_BOTTOMBACK: "Module.RE_CAM_DIR.BOTTOMBACK",//棱-下后
        CAM_DIR_BOTTOMLEFT: "Module.RE_CAM_DIR.BOTTOMLEFT",//棱-下左
        CAM_DIR_TOPRIGHTBACK: "Module.RE_CAM_DIR.TOPRIGHTBACK",//顶点-上右后
        CAM_DIR_TOPLEFTBACK: "Module.RE_CAM_DIR.TOPLEFTBACK",//顶点-上左后
        CAM_DIR_TOPLEFTFRONT: "Module.RE_CAM_DIR.TOPLEFTFRONT",//顶点-上左前
        CAM_DIR_TOPRIGHTFRONT: "Module.RE_CAM_DIR.TOPRIGHTFRONT",//顶点-上右前
        CAM_DIR_BOTTOMRIGHTBACK: "Module.RE_CAM_DIR.BOTTOMRIGHTBACK",//顶点-下右后
        CAM_DIR_BOTTOMLEFTBACK: "Module.RE_CAM_DIR.BOTTOMLEFTBACK",//顶点-下左后
        CAM_DIR_BOTTOMLEFTFRONT: "Module.RE_CAM_DIR.BOTTOMLEFTFRONT",//顶点-下左前
        CAM_DIR_BOTTOMRIGHTFRONT: "Module.RE_CAM_DIR.BOTTOMRIGHTFRONT",//顶点-下右前
        CAM_DIR_DEFAULT: "Module.RE_CAM_DIR.DEFAULT",//默认视角
    }
    ExtModule.RECamDirEm = RECamDirEm;





    // MARK UI
    //系统界面对应C++名称
    const RESysWndMateEm = {
        PanelBtn_TerrainAlpha: 'BuiltIn_Btn_TerrAlpha',//底部主工具栏-地形透明度
        PanelBtn_Reset: 'BuiltIn_Btn_ResetAll',//底部主工具栏-重置操作
        PanelBtn_IsolateBuild: 'BuiltIn_Btn_Isolate',//底部主工具栏-隔离构件
        PanelBtn_HideBuild: 'BuiltIn_Btn_Hide',//底部主工具栏-隐藏构件
        PanelBtn_RecoverDisplay: 'BuiltIn_Btn_ResetVisible',//底部主工具栏-恢复显示
        PanelBtn_Measure: 'BuiltIn_Btn_Measure',//底部主工具栏-测量
        PanelBtn_Cutting: 'BuiltIn_Btn_Cutting',//底部主工具栏-剖切
        PanelBtn_Setting: 'BuiltIn_Btn_Setting',//底部主工具栏-设置
        SysWnd_AffineTransMode_old: 'AffineTransModeWnd',//位置编辑仿射变换窗口(旧版，后期会移除)
        SysWnd_AffineTransMode: 'PositionMatchingWnd',//位置编辑仿射变换窗口
    }
    ExtModule.RESysWndMateEm = RESysWndMateEm;



    // MARK CAD
    //CAD单位
    const RECadUnitEm = {
        CAD_UNIT_Inch: 1,//英寸
        CAD_UNIT_Foot: 2,//英尺
        CAD_UNIT_Mile: 3,//英里
        CAD_UNIT_Millimeter: 4,//毫米
        CAD_UNIT_Centimeter: 5,//厘米
        CAD_UNIT_Meter: 6,//米
        CAD_UNIT_Kilometer: 7,//千米
        CAD_UNIT_Microinch: 8,//微英寸
        CAD_UNIT_Mil: 9,//毫英寸
        CAD_UNIT_Yard: 10,//码
        CAD_UNIT_Angstrom: 11,//埃
        CAD_UNIT_Nanometer: 12,//纳米
        CAD_UNIT_Micron: 13,//微米
        CAD_UNIT_Decimeter: 14,//分米
        CAD_UNIT_Decameter: 15, //十米
        CAD_UNIT_Hectometer: 16,//百米
        CAD_UNIT_Gigameter: 17,//百万公里
        CAD_UNIT_Astro: 18,//天文
        CAD_UNIT_Lightyear: 19,//光年
        CAD_UNIT_Parsec: 20,//天体
    }
    ExtModule.RECadUnitEm = RECadUnitEm;



    // MARK REGridPosEm
    //表示九宫格位置枚举
    const REGridPosEm = {
        LT: [-1, 1],   //左上区域
        MT: [0, 1],   //中上区域
        RT: [1, 1],   //右上区域
        LM: [-1, 0],   //左中区域
        MM: [0, 0],   //中中区域
        RM: [1, 0],   //右中区域
        LB: [-1, -1],   //左下区域
        MB: [0, -1],   //中下区域
        RB: [1, -1],   //右下区域
    }
    ExtModule.REGridPosEm = REGridPosEm;


























    return ExtModule;
};

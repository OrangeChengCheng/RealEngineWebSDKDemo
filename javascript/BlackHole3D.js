//版本：v3.1.0.1870
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
            this.workerjsPath = '';//相对于html页面的RealBIMWeb_Worker.js的路径
            this.renderWidth = 0;//初始化图形窗口的宽度
            this.renderHieght = 0;//初始化图形窗口的高度
            this.commonUrl = 0;//引擎调用的公共资源的路径
            this.userName = 0;//引擎资源发布服务配套的用户名
            this.passWord = 0;//引擎资源发布服务配套的密码
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
        if (isEmpty(sysInfo.workerjsPath) || isEmpty(sysInfo.commonUrl)) {
            logParErr('sysInfo');
            return;
        }
        // if (!isEmpty(sysInfo.commonUrl)) sessionStorage.setItem("RECommonUrl", sysInfo.commonUrl);//保存资源地址
        Module['m_re_em_force_threadnum'] = isPhoneMode ? 1 : 8;//移动端强制将CPU核心数设为1，以避免浏览器创建多个WebWorker时造成内存耗尽
        Module["m_re_em_window_width"] = sysInfo.renderWidth;
        Module["m_re_em_window_height"] = sysInfo.renderHieght;
        var _strMainWndName = "BlackHole"; if (!isEmpty(sysInfo.mainWndName)) _strMainWndName = sysInfo.mainWndName;
        var bool = Module.RealBIMWeb.CreateEmuMgr(sysInfo.workerjsPath, _strMainWndName, sysInfo.renderWidth, sysInfo.renderHieght,
            false, 500, "", sysInfo.commonUrl, "/ModuleDir/TempFile/", "/WebCache0001/",
            sysInfo.userName, sysInfo.passWord);
        if (isPhoneMode) {
            Module.REsetSkyAtmActive(false);
            Module.REsetReflState(false);
            Module.REsetShadowState(false);
            Module.REsetGhostState(false);
            Module.REsetAOState(false);
            Module.REsetSceOITLev(0);
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
        //卸载GPU内存
        if (typeof Module.GLctx != 'undefined') {
            if (Module.GLctx.getExtension('WEBGL_lose_context') != null) {
                Module.GLctx.getExtension('WEBGL_lose_context').loseContext();
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
                _defMainProjCamFile, _useCamPost
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
     * @param {Number} dataSetId //数据集的唯一标识名
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



    // MOD-- 相机（Camera）
    Module.Camera = typeof Module.Camera !== "undefined" ? Module.Camera : {};//增加 Camera 模块
    class RECamLoc {
        // 相机方位信息
        constructor() {
            this.camPos = [0, 0, 0];//相机位置
            this.camRotate = [0, 0, 0, 0];//相机的朝向
            this.camDir = [0, 0, 0];//相机的朝向（欧拉角）
        }
    }
    ExtModule.RECamLoc = RECamLoc;

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

    /**
     * 调整相机到目标方位
     * @param {RECamLoc} camLoc //相机方位信息
     * @param {Number} locDelay //转动相机前的延时时间（秒）默认0
     * @param {Number} locTime //相机的运动速度（秒） 默认1.0
     */
    Module.Camera.setCamLocateTo = function (camLoc, locDelay, locTime) {
        if (isEmptyLog(camLoc, "camLoc")) return;
        if (isEmptyLog(camLoc.camPos, "camPos")) return;
        if (isEmpty(camLoc.camRotate) && isEmpty(camLoc.camDir)) { logParErr('camRotate | camDir'); return; }
        var _delay = 0; if (!isEmpty(locDelay)) _delay = locDelay;
        var _time = 1.0; if (!isEmpty(locTime)) _delay = locTime;
        if (camLoc.camRotate) {
            Module.RealBIMWeb.LocateCamTo(camLoc.camPos, camLoc.camRotate, _delay, _time);
            return;
        }
        if (camLoc.camDir) {
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
        var enumEval = locType;
        Module.RealBIMWeb.ResetCamToTotalSce(enumEval, _bScanAllSce);
    }

    /**
     * 调整相机方位到对准构件集合
     * @param {Number} backDepth //相机后退强度（如果相机距离构件太近或太远，都可以通过此参数调整）
     * @param {Array} locIDList //目标ID集合 包含  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {Array} elemIdList //构件的标识名 集合
     */
    Module.Camera.setCamLocateToElem = function (locIDList, backDepth) {
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
        Module.RealBIMWeb.FocusCamToSubElems("", "", _elemIds.byteLength, _elemIds.byteOffset, backDepth);
    }

    /**
     * 调整相机定位到数据集
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {Number} backDepth //相机后退强度（如果相机距离构件太近或太远，都可以通过此参数调整）
     */
    Module.Camera.setCamLocateToDataSet = function (dataSetId, backDepth) {
        var _projname = ""; if (!isEmpty(dataSetId)) { _projname = dataSetId; }
        Module.RealBIMWeb.FocusCamToSubElems(_projname, "", 0, 0, backDepth);
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
    Module.Camera.setCamPreferFPS = function (type) {
        Module.RealBIMWeb.SetCamProjType(type);
    }

    /**
     * 获取主场景相机的投影类型
     */
    Module.Camera.getCamPreferFPS = function () {
        return Module.RealBIMWeb.GetCamProjType();
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
        var _sunDir = [0.59215283, 0.63194525, -0.50000012]; if (!isEmpty(skyInfo.sunDir)) _sunDir = skyInfo.sunDir;
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
        if (Module.RealBIMWeb.TransEngineCoords(forward, destCRS, temparr1.byteLength, temparr1.byteOffset)) {
            for (i = 0; i < _s; ++i) {
                temparr2.push([temparr1[i * 3 + 0], temparr1[i * 3 + 1], temparr1[i * 3 + 2]]);
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
        if (Module.RealBIMWeb.TransGeoCoords(srcCRS, destCRS, temparr1.byteLength, temparr1.byteOffset)) {
            for (i = 0; i < _s; ++i) {
                temparr2.push([temparr1[i * 4 + 0], temparr1[i * 4 + 1], temparr1[i * 4 + 2], temparr1[i * 4 + 3]]);
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
        console.log(_probeRet);
        var _probeShpRet = Module.RealBIMWeb.GetCurShpProbeRet(Module.RE_SHP_PROBE_TYPE.NORM);
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
            return { elemType: "" }
        }
    }



    // MOD-- 图形显示（Graphics）
    Module.Graphics = typeof Module.Graphics !== "undefined" ? Module.Graphics : {};//增加 Graphics 模块


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





    // MOD-- 标签（Tag）
    Module.Tag = typeof Module.Tag !== "undefined" ? Module.Tag : {};//增加 Tag 模块

    class RETagInfo {
        constructor() {
            this.tagName = null;//标签的名称(唯一标识)
            this.pos = null;//标签的位置
            this.infoList = null;//标签的内容（包含 Object 类型）{picPath:"",text:""}
        }
    }
    ExtModule.RETagInfo = RETagInfo;

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
     * @param {Array} tagInfoList //标签信息集合（RETagInfo 类型）
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
                _texRegions.push_back({
                    m_strTexPath: _tagInfo.infoList[i].picPath,
                    m_qTexRect: [-50, _lineHeight * (_lineCount - i - 1) + _lineSpace, -30, _lineHeight * (_lineCount - i) - _lineSpace],
                    m_uTexClrMult: 0xffffffff,
                    m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0],
                    m_uFrameNumU: 1, m_uFrameNumV: 1,
                    m_uFrameStrideU: 0, m_uFrameStrideV: 0,
                    m_fFrameFreq: 0.0,
                })  //纹理矩形区域在2维像素裁剪空间(Y轴向上递增)下相对于定位点的覆盖区域<左，下，右，上>
            }
            for (let i = 0; i < _lineCount; ++i) {
                _textRegions.push_back({
                    m_strGolFontID: "RealBIMFont001",
                    m_bTextWeight: false,
                    m_strText: _tagInfo.infoList[i].text,
                    m_uTextClr: 0xffffffff,
                    m_uTextBorderClr: 0x80000000,
                    m_qTextRect: [0, _lineHeight * (_lineCount - i - 1) + _lineSpace, 30, _lineHeight * (_lineCount - i) - _lineSpace],
                    m_uTextFmtFlag: ((1 << 1)/*TEXT_FMT_VCENTER*/ | (1 << 3)/*TEXT_FMT_LEFT*/ | (1 << 6)/*TEXT_FMT_NOCLIP*/),
                    m_uTextBackMode: 0, m_sTextBackBorder: 0, m_uTextBackClr: 0x00000000
                });
            }
            let _tempobj = {
                m_strName: _tagInfo.tagName,
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
            this.useLod = null;//是否允许聚合（只有uselod设为true，并且设置了有效的聚合参数 setAncLODInfo 后，锚点会自动聚合，同时锚点自动缩放和可视距离参数无效）
            this.animObjName = null;//锚点关联的动画对象名称(仅当 useLod==false时有效)
            this.animBoneID = null;//锚点关联的骨骼在动画对象内的ID(仅当 useLod==false时有效)
            this.picNum = null;//闪烁时循环播放的图片个数
            this.playFrame = null;//闪烁的帧率，即1秒钟闪几下

        }
    }
    ExtModule.REAncInfo = REAncInfo;

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
        var _lodMergeCap = 1; if (!isEmpty(ancLODInfo.lodMergeCap)) { _lodMergeCap = ancLODInfo.lodMergeCap; }
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
            TempTextRect[0] = _linepos[0] - _texfocus[0]; TempTextRect[2] = _linepos[0] + 1 - _texfocus[0]; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
        } else {
            TempTextRect[0] = ancLODInfo.mergeStyle.picWidth + _linepos[0] - _texfocus[0]; TempTextRect[2] = ancLODInfo.mergeStyle.picWidth + _linepos[0] + 1 - _texfocus[0]; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
        }
        if (_textbias[1] < 0) {
            TempTextRect[1] = _linepos[1] - 1 - _texfocus[1]; TempTextRect[3] = _linepos[1] - _texfocus[1]; TempTextFmtFlag |= 0x4/*TEXT_FMT_TOP*/;
        } else if (_textbias[1] == 0) {
            TempTextRect[1] = _linepos[1] - _texfocus[1]; TempTextRect[3] = _linepos[1] + 1 - _texfocus[1]; TempTextFmtFlag |= 0x1/*TEXT_FMT_BOTTOM*/;
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
            m_strText: _textInfo.text,
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

    class REAnimPlaneInfo {
        constructor() {
            this.groupName = null;//不规则平面组名称
            this.name = null;//不规则平面名称
            this.potList = null;//不规则平面路径顶点坐标 (x,y,z)表示位置 w表示高度
            this.texPath = null;//纹理路径
        }
    }
    ExtModule.REAnimPlaneInfo = REAnimPlaneInfo;

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
        if (isEmpty(dataSetId) || dataSetId == "") { logParErr("dataSetId"); return; }
        if (isEmptyLog(elemIdList, "elemIdList")) return;

        var _alphaWeight = 255; if (!isEmpty(alphaWeight)) _alphaWeight = alphaWeight;
        var _elemIdListTemp = (elemIdList.length == 0) ? Module.BIM.getDataSetAllElemIDs(dataSetId, false) : elemIdList;

        var _elemScope = 0; if (!isEmpty(elemScope)) { _elemScope = elemScope; }
        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var _alpha = alphaToU32_WA_UseCA(elemAlpha, _alphaWeight, false, true);
        var _clr = 0x000000ff;
        var _pbr = 0x00000000;

        var _count = _elemIdListTemp.length;
        var _moemory = (_count * 24).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
        var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _count; ++i) {
            _clrs.set([_elemIdListTemp[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
        }
        Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, "", _clrs.byteLength, _clrs.byteOffset, _elemScope);
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
        var _clr_R = parseInt(tempselclr[0] * 255, 10);
        var _clr_G = parseInt(tempselclr[1] * 255, 10);
        var _clr_B = parseInt(tempselclr[2] * 255, 10);
        var _clr_A = parseInt(tempselclr[3] * 255, 10);

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
                elemIds.push(_arr[i]);
            }
        }
        return elemIds;
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
     * 设置模型场景节点的可见性
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} enable //是否可见
     */
    Module.BIM.setElemVisible = function (dataSetId, enable) {
        Module.RealBIMWeb.SetHugeObjVisible(dataSetId, "", enable);
    }

    /**
     * 获取模型场景节点的可见性
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getElemVisible = function (dataSetId) {
        return Module.RealBIMWeb.GetHugeObjVisible(dataSetId, "");
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
     * 刷新数据集模型
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} loadNewData //表示刷新主体数据后是否允许重新加载数据
     */
    Module.BIM.refreshDataSet = function (dataSetId, loadNewData) {
        Module.RealBIMWeb.RefreshHugeObjMainData(dataSetId, "", loadNewData);
    }








    // MARK 动画与特效

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
     * 创建一个动态墙
     * @param {REAnimWallInfo} animWallInfo //动态墙信息
     */
    Module.BIM.addAnimationWall = function (animWallInfo) {
        if (isEmptyLog(animWallInfo, "animWallInfo")) return;
        var temparr = new Module.RE_Vector_dvec4();
        for (var i = 0; i < animWallInfo.potList.length; ++i) {
            temparr.push_back(animWallInfo.potList[i]);
        }
        var _bClose = true; if (!isEmpty(animWallInfo.isClose)) { _bClose = animWallInfo.isClose; }
        return Module.RealBIMWeb.AddAnimationWall(animWallInfo.groupName, animWallInfo.name, temparr, animWallInfo.texPath, animWallInfo.normalDir, _bClose);
    }

    /**
     * 创建一个扫描面
     * @param {REAnimPlaneInfo} animPlaneInfo //扫描面信息
     */
    Module.BIM.addAnimationPlane = function (animPlaneInfo) {
        if (isEmptyLog(animPlaneInfo, "animPlaneInfo")) return;
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animPlaneInfo.potList.length; ++i) {
            temparr.push_back(animPlaneInfo.potList[i]);
        }
        return Module.RealBIMWeb.AddAnimationPlane(animPlaneInfo.groupName, animPlaneInfo.name, temparr, animPlaneInfo.texPath);
    }

    /**
     * /创建一组半球体动画
     * @param {REAnimSphereInfo} animSphereInfo //球体信息
     */
    Module.BIM.addAnimationSpheres = function (animSphereInfo) {
        if (isEmptyLog(animSphereInfo, "animSphereInfo")) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animSphereInfo.nameList.length; ++i) { temparr0.push_back(animSphereInfo.nameList[i]); }
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animSphereInfo.potCenterList.length; ++i) { temparr.push_back(animSphereInfo.potCenterList[i]); }
        var _isSphere = true; if (!isEmpty(animSphereInfo.sphere)) _isSphere = animSphereInfo.sphere;
        return Module.RealBIMWeb.AddAnimationSpheres(animSphereInfo.groupName, temparr0, temparr, animSphereInfo.radius, _isSphere, animSphereInfo.texPath);
    }

    /**
     * 创建一组规则平面多边形动画
     * @param {REAnimPolygonInfo} animPolygonInfo //多边形信息
     */
    Module.BIM.addAnimationPolygons = function (animPolygonInfo) {
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

    /**
     * 创建一组规则多边形动态墙
     * @param {REAnimPolyWallInfo} animPolyWallInfo //多边形动态墙信息
     */
    Module.BIM.addAnimationPolygonWalls = function (animPolyWallInfo) {
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

    /**
     * 按组名称设置矢量动画的参数
     * @param {String} groupName //矢量动画组名称，此参数不能为空
     * @param {Array} nameList //矢量动画名称集合，如果nameList为空,则设置该组下所有的矢量动画信息；
     * @param {REColor} animClr //期望的矢量动画颜色（REColor 类型）
     * @param {dvec4} scaleAndOffset //动画速度及方向，正负控制方向，数值控制速度,[]
     */
    Module.BIM.setShapeAnimStyle = function (groupName, nameList, animClr, scaleAndOffset) {
        if (isEmptyLog(groupName, "groupName")) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < nameList.length; ++i) { temparr0.push_back(nameList[i]); }
        var tempClr = clrToU32(animClr);
        return Module.RealBIMWeb.SetShapeAnimStyle(groupName, temparr0, tempClr, scaleAndOffset);
    }

    /**
     * 删除矢量动画
     * @param {String} groupName //矢量动画组名称，此参数不能为空
     * @param {Array} nameList //矢量动画名称集合，如果nameList为空,则删除该组下所有的矢量动画信息；
     */
    Module.BIM.delShpAnimation = function (groupName, nameList) {
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < nameList.length; ++i) { temparr0.push_back(nameList[i]); }
        return Module.RealBIMWeb.DelShpAnimation(groupName, temparr0);
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






























    // MOD-- 栅格（Grid）
    Module.Grid = typeof Module.Grid !== "undefined" ? Module.Grid : {};//增加 Grid 模块


    // MARK 渲染设置

    /**
     * 设置某一块或全部的栅格模型的透明度
     * @param {String} dataSetId //数据集标识
     * @param {Number} alpha //透明度
     */
    Module.Grid.setGroupAlpha = function (dataSetId, alpha) {
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
    Module.Grid.getGroupAlpha = function (dataSetId) {
        var alpha = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(dataSetId, "");
        return alpha.m_uDestAlpha;
    }

    /**
     * 设置地形场景节点的深度偏移
     * @param {String} dataSetId //数据集标识
     * @param {Number} depthBias //深度偏移范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
     */
    Module.Grid.setGroupDepthBias = function (dataSetId, depthBias) {
        Module.RealBIMWeb.SetUnVerHugeGroupDepthBias(dataSetId, "", depthBias);
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
    /**
     * 设置倾斜摄影单体化数据
     * @param {String} elemData //表示所有倾斜摄影单体化的数据（json字符串）
     */
    Module.Grid.setMonomerElemData = function (elemData) {
        var jsonStr = JSON.stringify(elemData);
        Module.RealBIMWeb.ParseUnverelemInfo(jsonStr);
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
        var enumEval = locType;
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
            var _useCamPost = false; if (!isEmpty(_panAncInfo._useCamPost)) _useCamPost = _panAncInfo._useCamPost;
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


    /**
     * 坡度显示开关
     * @param {Boolean} enable //是否开启
     */
    Module.Measure.setSlopeVisible = function (enable) {
        Module.RealBIMWeb.SetSlopeVisible(enable);
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
        CAM_DIR_FRONT: 0,//面-主视图（前视图）	
        CAM_DIR_BACK: 1,//面-后视图	
        CAM_DIR_LEFT: 2,//面-左视图	
        CAM_DIR_RIGHT: 3,//面-右视图	
        CAM_DIR_TOP: 4,//面-俯视图（上视图）	
        CAM_DIR_BOTTOM: 5,//面-仰视图（下视图）	
        CAM_DIR_TOPFRONT: 6,//棱-上前	
        CAM_DIR_TOPRIGHT: 7,//棱-上右	
        CAM_DIR_TOPBACK: 8,//棱-上后	
        CAM_DIR_TOPLEFT: 9,//棱-上左	
        CAM_DIR_LEFTFRONT: 10,//棱-左前	
        CAM_DIR_RIGHTFRONT: 11,//棱-前右	
        CAM_DIR_RIGHTBACK: 12,//棱-右后	
        CAM_DIR_LEFTBACK: 13,//棱-后左	
        CAM_DIR_BOTTOMFRONT: 14,//棱-下前	
        CAM_DIR_BOTTOMRIGHT: 15,//棱-下右	
        CAM_DIR_BOTTOMBACK: 16,//棱-下后	
        CAM_DIR_BOTTOMLEFT: 17,//棱-下左	
        CAM_DIR_TOPRIGHTBACK: 18,//顶点-上右后	
        CAM_DIR_TOPLEFTBACK: 19,//顶点-上左后	
        CAM_DIR_TOPLEFTFRONT: 20,//顶点-上左前	
        CAM_DIR_TOPRIGHTFRONT: 21,//顶点-上右前	
        CAM_DIR_BOTTOMRIGHTBACK: 22,//顶点-下右后	
        CAM_DIR_BOTTOMLEFTBACK: 23,//顶点-下左后	
        CAM_DIR_BOTTOMLEFTFRONT: 24,//顶点-下左前	
        CAM_DIR_BOTTOMRIGHTFRONT: 25,//顶点-下右前	
        CAM_DIR_DEFAULT: 26,//默认视角
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
        SysWnd_AffineTransMode: 'AffineTransModeWnd',//位置编辑仿射变换窗口
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







    return ExtModule;
};

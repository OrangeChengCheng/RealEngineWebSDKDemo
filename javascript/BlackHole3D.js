//版本：v2.1.0.1816
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
    }

    /**
     * 获取当前SDK版本
     */
    Module.getVersion = function () {
        return Module.RealBIMWeb.GetRealEngineVersion();
    }

    /**
     * 设置窗口的显示模式，此接口适用于需要双屏显示，以及需要单双屏切换的应用场景。
     * @param {RE_ViewportType} viewport0 //第0个视图要显示的场景内容 RE_ViewportType 枚举类型
     * @param {RE_ViewportType} viewport1 //第1个视图要显示的场景内容 RE_ViewportType 枚举类型
     * @param {RE_ViewportRank} screenMode //视图0与视图1在屏幕上的排列方式 RE_ViewportRank 枚举类型
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



    // MOD-- 模型加载（Model）
    Module.Model = typeof Module.Model !== "undefined" ? Module.Model : {};//增加 Model 模块

    /**
     * 加载数据集资源
     * @param {Boolean} clearLoaded //是否清除掉已经加载好的项目
     * @param {Array} dataSetList //数据集集合  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
     * @param {String} dataSetId //数据集的唯一标识名，不能为空不可重复，重复前边的数据集会被自动覆盖
     * @param {String} resourcesAddress //数据集资源包地址
     * @param {String} resRootPath //数据集资源包root地址
     * @param {Boolean} useTransInfo //表示该项目是否需要调整位置，默认false
     * @param {Array} transInfo //项目的偏移信息，依次为缩放、旋转（四元数）、平移
     * @param {Number} minLoadDist //项目模型的最小加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
     * @param {Number} maxLoadDist //项目模型的最大加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载；
     * @param {String} dataSetCRS //当前子项的坐标系标识
     * @param {Number} dataSetCRSNorth //当前子项的项目北与正北方向的夹角（右手坐标系，逆时针为正）dataSetCRS 为空时此参数无定意义
     * @param {Boolean} useAssginVer  //表示是否加载指定版本，默认 false
     * @param {String} assginVer //指定版本号，加载指定版本的时候，会用此版本号
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
            let _defMainProjResRoot = ((i == 0) ? dataSetModel.resRootPath : "");
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
            if (dataSetModel.useNewVer2) {
                _ver.m_sVer1 = dataSetModel.assginVer2; _ver.m_uVer1GolIDBias_H32 = intprojid;
            }
            Module.RealBIMWeb.LoadMainSceExt(
                dataSetModel.dataSetId,
                _isMainProj,
                _projCRS, _projNorth,
                dataSetModel.resourcesAddress,
                _deftransinfo[0], _deftransinfo[1], _deftransinfo[2],
                _minLoadDist, _maxLoadDist,
                _defMainProjResRoot,
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
    Module.Camera.setCamLocateTo = function (camLoc) {
        if (isEmptyLog(camLoc, "camLoc")) return;
        if (isEmptyLog(camLoc.camPos, "camPos")) return;
        if (isEmpty(camLoc.camRotate) && isEmpty(camLoc.camDir)) { logParErr('camRotate | camDir'); return; }
        var _delay = 0; if (!isEmpty(camLoc.locDelay)) _delay = camLoc.locDelay;
        var _time = 1.0; if (!isEmpty(camLoc.locTime)) _delay = camLoc.locTime;
        if (camLoc.camRotate) {
            Module.RealBIMWeb.LocateCamTo(camLoc.camPos, camLoc.camRotate, _delay, _time);
            return;
        }
        if (camLoc.camDir) {
            Module.RealBIMWeb.LocateCamTo_Dir(camLoc.camPos, camLoc.camDir, _delay, _time);
        }
    }

    /**
     * 设置是否固定主相机的方位（BIM相机）
     * @param {dvec3} camPos //相机位置
     * @param {dvec4} camRotate //相机的朝向
     * @param {Boolean} toLoc //是否调整到设置方位，默认false
     */
    Module.Camera.setFixDataSetCam = function (camPos, camRotate, toLoc) {
        if (isEmptyLog(camPos, "camPos")) return;
        if (isEmptyLog(camRotate, "camRotate")) return;
        var _bFixMainCam = false; if (!isEmpty(toLoc)) _bFixMainCam = toLoc;
        Module.RealBIMWeb.IsFixMainCam(_bFixMainCam, camPos, camRotate);
    }

    /**
     * 调整相机到默认视角方位
     * @param {RE_ViewCudePerspective} locType //表示26个方向 RE_ViewCudePerspectiveEnum 枚举值
     * @param {Boolean} scanAllDataSet //是否定位到整个数据集，默认true，true表示定位到整个场景，false表示相机原地调整方向
     */
    Module.Camera.setCamLocateDefault = function (locType, scanAllDataSet) {
        if (isEmptyLog(locType, "locType")) return;
        var _bScanAllSce = true; if (!isEmpty(scanAllDataSet)) _bScanAllSce = scanAllDataSet;
        var enumEval = eval(locType);
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

    //设置相机朝向是否允许头朝下
    Module.REsetCamUpsideDown = function (bEnable) {
        Module.RealBIMWeb.SetCamUpsideDown(bEnable);
    }
    //获取相机朝向是否允许头朝下
    Module.REgetCamUpsideDown = function () {
        return Module.RealBIMWeb.GetCamUpsideDown();
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
     * @param {RE_SYSWnd_Mate} uiType //控件类型（RE_SYSWnd_Mate 类型）
     * @param {Boolean} enable //是否显示
     */
    Module.Graphics.setSysUIWgtVisible = function (uiType, enable) {
        if (isEmptyLog(uiType, 'uiType')) return;
        return Module.RealBIMWeb.UIWgtSetVisible(uiType, enable);
    }

    /**
     * 获取对应系统UI的可见性
     * @param {RE_SYSWnd_Mate} uiType //控件类型（RE_SYSWnd_Mate 类型）
     */
    Module.Graphics.getSysUIWgtVisible = function (uiType) {
        if (!checkNull(uiType, 'uiType')) return;
        return Module.RealBIMWeb.UIWgtGetVisible(uiType);
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
            this.textBias = null;//锚点文字与图片的相对位置, 第一维: -1、0、1分别表示文字在图片的左侧、中间、右侧；第二维: -1、0、1分别表示文字在图片的下侧、中间、上侧；
            this.textFocus = null;//牵引线的顶点相对于图片的像素位置，[0,0]表示位于图片的左下角
            this.fontName = null;//锚点的字体样式
            this.textColor = null;//锚点的字体颜
            this.textBorderColor = null;//锚点的字体边框颜色
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
            var _textbias = [1, 0]; if (!isEmpty(ancInfo.textBias)) { _textbias = ancInfo.textBias; }
            var _texfocus = [0, 0]; if (!isEmpty(ancInfo.textFocus)) { _texfocus = ancInfo.textFocus; }
            var _GolFontID = "RealBIMFont001"; if (!isEmpty(ancInfo.fontName)) { _GolFontID = ancInfo.fontName; }
            var _textcolor = 0xffffffff; if (!isEmpty(ancInfo.textColor)) { _textcolor = clrToU32(ancInfo.textColor); }
            var _textbordercolor = 0xff000000; if (!isEmpty(ancInfo.textBorderColor)) { _textbordercolor = clrToU32(ancInfo.textBorderColor); }
            var _textbackmode = 0; if (!isEmpty(ancInfo.textBackMode)) { _textbackmode = ancInfo.textBackMode; }
            var _textbackborder = 0; if (!isEmpty(ancInfo.textBackBorder)) { _textbackborder = ancInfo.textBackBorder; }
            var _textbackclr = 0x00000000; if (!isEmpty(ancInfo.textBackClr)) { _textbackclr = clrToU32(ancInfo.textBackClr); }

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
                    m_uTextBackMode: _textbackmode, m_sTextBackBorder: _textbackborder, m_uTextBackClr: _textbackclr
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
        if (!isEmpty(ancData.m_cTextRegion.m_uTextClr) && ancData.m_cTextRegion.m_uTextClr != 0) ancInfo.textColor = clrU32ToClr(ancData.m_cTextRegion.m_uTextClr);
        ancInfo.textBorderColor = clrU32ToClr(ancData.m_cTextRegion.m_uTextBorderClr);
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
            var _textbias = [1, 0]; if (!isEmpty(ancInfo.textBias)) { _textbias = ancInfo.textBias; }
            var _texfocus = [0, 0]; if (!isEmpty(ancInfo.textFocus)) { _texfocus = ancInfo.textFocus; }
            var _GolFontID = "RealBIMFont001"; if (!isEmpty(ancInfo.fontName)) { _GolFontID = ancInfo.fontName; }
            var _textcolor = 0xff000000; if (!isEmpty(ancInfo.textColor)) { _textcolor = clrToU32(ancInfo.textColor); }
            var _textbordercolor = 0xff000000; if (!isEmpty(ancInfo.textBorderColor)) { _textbordercolor = clrToU32(ancInfo.textBorderColor); }
            var _textbackmode = 0; if (!isEmpty(ancInfo.textBackMode)) { _textbackmode = ancInfo.textBackMode; }
            var _textbackborder = 0; if (!isEmpty(ancInfo.textBackBorder)) { _textbackborder = ancInfo.textBackBorder; }
            var _textbackclr = 0x00000000; if (!isEmpty(ancInfo.textBackClr)) { _textbackclr = clrToU32(ancInfo.textBackClr); }
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
                    m_uTextBackMode: _textbackmode, m_sTextBackBorder: _textbackborder, m_uTextBackClr: _textbackclr
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
    // this.groupName = null;//要聚合的锚点组的标识名，为空则表示所有的锚点对象
    //         this.lodLevel = null;//聚合层级，范围1~10,默认为1，表示不聚合
    //         this.useCustomBV = null;//是否用锚点的预估总包围盒，默认为false
    //         this.customBV = null;//锚点的预估总包围盒,默认为当前场景的总包围盒，二维数组[[Xmin,Ymin,Zmin],[Xmax,Ymax,Zmax]]，当useCustomBV为false时，此参数无效，填空数组即可;
    //         this.lodMergePxl = null;//锚点所在单元格进行LOD合并时的投影到屏幕的像素尺寸阈值
    //         this.lodMergeCap = null;//锚点所在单元格进行LOD合并时的单元格容积阈值
    //         this.mergeStyle = null;//点聚合后的样式 (REAncInfo 类型 参数选填)
    Module.Anchor.setAncLODInfo = function (ancLODInfo) {
        if (isEmptyLog(ancLODInfo, "ancLODInfo")) return;
        if (isEmptyLog(ancLODInfo.mergeStyle, "mergeStyle")) return;

        var _groupName = ""; if (!isEmpty(ancLODInfo.groupName)) { _groupName = ancLODInfo.groupName; }
        var _lodLevel = 1; if (!isEmpty(ancLODInfo.lodLevel)) { _lodLevel = ancLODInfo.lodLevel; }
        var _lodMergePxl = 100; if (!isEmpty(ancLODInfo.lodMergePxl)) { _lodMergePxl = ancLODInfo.lodMergePxl; }
        var _lodMergeCap = 1; if (!isEmpty(ancLODInfo.lodMergeCap)) { _lodMergeCap = ancLODInfo.lodMergeCap; }
        var _customBV = [[0, 0, 0], [0, 0, 0]]; if (ancLODInfo.useCustomBV) { _customBV = ancLODInfo.customBV; }
        var _linepos = [0, 0]; var _texfocus = [0, 0];
        var _textbias = [1, 0]; if (!isEmpty(ancLODInfo.mergeStyle.textBias)) { _textbias = ancLODInfo.mergeStyle.textBias; }
        var _GolFontID = "RealBIMFont001"; if (!isEmpty(ancLODInfo.mergeStyle.fontName) || ancLODInfo.mergeStyle.fontName != "") { _GolFontID = ancLODInfo.mergeStyle.fontName; }
        var _textcolor = 0xff000000; if (!isEmpty(ancLODInfo.mergeStyle.textColor)) { _textcolor = clrToU32(ancLODInfo.mergeStyle.textColor); }
        var _textbordercolor = 0xff000000; if (!isEmpty(ancLODInfo.mergeStyle.textBorderColor)) { _textbordercolor = clrToU32(ancLODInfo.mergeStyle.textBorderColor); }
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
            this.textbias = null;//表示锚点文字与图片的相对位置，二维数组： 第一维-1、0、1分别表示文字在点的左侧、中间、右侧； 第二维-1、0、1分别表示文字在点的下侧、中间、上侧
            this.fontname = null;//表示锚点的字体样式
            this.textclr = null;//文字颜色（REColor 类型）
            this.textborderclr = null;//文字边框颜色（REColor 类型）
            this.textbackmode = null;//表示文字背景的处理模式： 0：表示禁用文字背景 1：表示启用文字背景，文字背景是文字所占的矩形区域
            this.textbackborder = null;//表示文字背景的边界带的像素宽度
            this.textbackclr = null;//表示文本背景色（REColor 类型）
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
            this.arrPots = null;//表示多边形折线序列
            this.fillState = null;//示顶点的像素大小
            this.potClr = null;//顶点的颜色（REColor 类型）
            this.textInfo = null;//表示顶点的文字标注信息（REShpTextInfo 类型）
            this.scrASDist = null;//表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null;//表示屏幕空间矢量的可视距离
            this.contactSce = null;//表示矢量是否与场景发生深度遮挡
        }
    }
    ExtModule.RELineShpInfo = RELineShpInfo;
    // * @param {String} shpName //表示矢量标识名，若已有同名的矢量则覆盖之
    // * @param {Object} re_Info //标识顶点矢量信息  ↓ ↓ ↓ ↓ 以下参数均包含在 re_Info 中
    // * @param {Array} arrPots //表示多边形折线序列
    // * @param {Number} uFillState //表示折线的填充状态 0->多边形不填充； 1->多边形首尾相连构成封闭区域进行填充； 2->多边形首尾相连构成封闭区域进行填充(顶点高度自动修改为同一高度，默认为第一个顶点的高度)
    // * @param {String} lineColor //表示多边形的颜色 十六进制 HEX
    // * @param {Number} lineClrAlpha //多边形的颜色透明度，默认值：255， 取值范围 0~255，0表示全透明，255表示不透明
    // * @param {String} fillColor //表示多边形的填充颜色 十六进制 HEX
    // * @param {Number} fillClrAlpha //多边形的填充颜色透明度，默认值：255， 取值范围 0~255，0表示全透明，255表示不透明
    // * @param {Number} fTextPos //表示多边形折线填充样式： 0->多边形不填充； 1->多边形首尾相连构成封闭区域进行填充； 2->多边形首尾相连构成封闭区域进行填充(顶点高度自动修改为同一高度，默认为第一个顶点的高度)
    // * @param {Object} cTextInfo //表示顶点的文字标注信息 ↓ ↓ ↓ ↓ ↓ 以下参数包含在 cTextInfo 中  ↑ ↑ ↑ ↑ ↑

    /**
     * 创建自定义顶点矢量
     * @param {REPotShpInfo} potShpInfo //矢量点信息（REPotShpInfo 类型）
     */
    Module.Geometry.addPotShp = function (potShpInfo) {
        if (isEmptyLog(potShpInfo, "potShpInfo")) return;
        if (isEmptyLog(potShpInfo.shpName, "shpName")) return;
        if (isEmptyLog(potShpInfo.textInfo, "textInfo")) return;

        var _textInfo = potShpInfo.textInfo;

        var _textbias = [0, 0]; if (!isEmpty(_textInfo.textbias)) { _textbias = _textInfo.textbias; }
        var _GolFontID = "RealBIMFont001"; if (!isEmpty(_textInfo.fontname)) { _GolFontID = _textInfo.fontname; }
        var _textcolor = 0xffffffff; if (!isEmpty(_textInfo.textclr)) { _textcolor = clrToU32(_textInfo.textclr); }
        var _textbordercolor = 0xff000000; if (!isEmpty(_textInfo.textborderclr)) { _textbordercolor = clrToU32(_textInfo.textborderclr); }
        var _textbackmode = 0; if (!isEmpty(_textInfo.textbackmode)) { _textbackmode = _textInfo.textbackmode; }
        var _textbackborder = 0; if (!isEmpty(_textInfo.textbackborder)) { _textbackborder = _textInfo.textbackborder; }
        var _textbackclr = 0x00000000; if (!isEmpty(_textInfo.textbackclr)) { _textbackclr = clrToU32(_textInfo.textbackclr); }

        var TempTextRect = [-1, -1, 1, 1]; var TempTextFmtFlag = 0x40/*TEXT_FMT_NOCLIP*/;
        var uPotSize = 0; if (!isEmpty(potShpInfo.potSize)) uPotSize = potShpInfo.potSize;
        if (_textbias[0] < 0) {
            TempTextRect[0] = -uPotSize - 2; TempTextRect[2] = -uPotSize - 1; TempTextFmtFlag |= 0x20/*TEXT_FMT_RIGHT*/;
        } else if (_textbias[0] == 0) {
            TempTextRect[0] = -1; TempTextRect[2] = 1; TempTextFmtFlag |= 0x10/*TEXT_FMT_HCENTER*/;
        } else {
            TempTextRect[0] = uPotSize + 1; TempTextRect[2] = uPotSize + 2; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
        }
        if (_textbias[1] < 0) {
            TempTextRect[1] = -uPotSize - 2; TempTextRect[3] = -uPotSize - 1; TempTextFmtFlag |= 0x4/*TEXT_FMT_TOP*/;
        } else if (_textbias[1] == 0) {
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
            m_uTextBackMode: _textbackmode, m_sTextBackBorder: _textbackborder, m_uTextBackClr: _textbackclr
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

    }


    /**
     * 创建自定义多边形折线矢量
     * @param {String} shpName //表示矢量标识名，若已有同名的矢量则覆盖之
     * @param {Object} re_Info //标识顶点矢量信息  ↓ ↓ ↓ ↓ 以下参数均包含在 re_Info 中
     * @param {Array} arrPots //表示多边形折线序列
     * @param {Number} uFillState //表示折线的填充状态 0->多边形不填充； 1->多边形首尾相连构成封闭区域进行填充； 2->多边形首尾相连构成封闭区域进行填充(顶点高度自动修改为同一高度，默认为第一个顶点的高度)
     * @param {String} lineColor //表示多边形的颜色 十六进制 HEX
     * @param {Number} lineClrAlpha //多边形的颜色透明度，默认值：255， 取值范围 0~255，0表示全透明，255表示不透明
     * @param {String} fillColor //表示多边形的填充颜色 十六进制 HEX
     * @param {Number} fillClrAlpha //多边形的填充颜色透明度，默认值：255， 取值范围 0~255，0表示全透明，255表示不透明
     * @param {Number} fTextPos //表示多边形折线填充样式： 0->多边形不填充； 1->多边形首尾相连构成封闭区域进行填充； 2->多边形首尾相连构成封闭区域进行填充(顶点高度自动修改为同一高度，默认为第一个顶点的高度)
     * @param {Object} cTextInfo //表示顶点的文字标注信息 ↓ ↓ ↓ ↓ ↓ 以下参数包含在 cTextInfo 中  ↑ ↑ ↑ ↑ ↑
     * ↓ ↓ ↓ ↓ ↓
     * @param {DVec2} textbias //表示锚点文字与图片的相对位置，二维数组： 第一维-1、0、1分别表示文字在点的左侧、中间、右侧； 第二维-1、0、1分别表示文字在点的下侧、中间、上侧
     * @param {String} fontname //表示锚点的字体样式
     * @param {String} textcolor //文字颜色，十六进制
     * @param {Number} textAlpha //文字颜色的颜色透明度，默认值：255， 取值范围 0~255，0表示全透明，255表示不透明
     * @param {String} textbordercolor //文字边框颜色，十六进制
     * @param {Number} textborderAlpha //文字边框颜色的颜色透明度，默认值：255， 取值范围 0~255，0表示全透明，255表示不透明
     * @param {Number} textbackmode //表示文字背景的处理模式： 0：表示禁用文字背景 1：表示启用文字背景，文字背景是文字所占的矩形区域
     * @param {Number} textbackborder //表示文字背景的边界带的像素宽度
     * @param {String} textbackclr //表示文本背景色, 十六进制
     * @param {Number} textbackAlpha //文本背景色的颜色透明度，默认值：255， 取值范围 0~255，0表示全透明，255表示不透明
     * ↑ ↑ ↑ ↑ ↑
     * @param {Number} fASDist //表示屏幕空间矢量的自动缩放起始距离
     * @param {Number} fVisDist //表示屏幕空间矢量的可视距离
     * @param {Boolean} bContactSce //表示矢量是否与场景发生深度遮挡
     * @param {Number} uLineWidth //选填项；表示线宽，可以设为1或2，单位为像素；默认线宽为1个像素
     * @returns 
    */
    Module.REaddPolylineShp = function (shpName, re_Info) {
        if (!checkNull(shpName, 'shpName')) return;
        if (!checkNull(re_Info, 're_Info')) return;
        if (!checkParamType(re_Info.arrPots, 'arrPots', RE_Enum.RE_Check_Array)) return;

        var temparrpos = new Module.RE_Vector_dvec3();
        for (var i = 0; i < re_Info.arrPots.length; ++i) {
            temparrpos.push_back(re_Info.arrPots[i]);
        }
        var _textbias = [0, 0]; var _GolFontID = "RealBIMFont001"; var _textcolor = 0xffffffff; var _textbordercolor = 0xff000000;
        var _textbackmode = 0; var _textbackborder = 0; var _textbackclr = 0x00000000;
        var cTextInfo = {}; if (checkParamNull(re_Info.cTextInfo)) cTextInfo = re_Info.cTextInfo;

        if (typeof cTextInfo.textbias != 'undefined') { _textbias = cTextInfo.textbias; }
        if (typeof cTextInfo.fontname != 'undefined') { _GolFontID = cTextInfo.fontname; }
        if (typeof cTextInfo.textcolor != 'undefined') { _textcolor = clrHEXAToU32ABGR(cTextInfo.textcolor, cTextInfo.textAlpha); }
        if (typeof cTextInfo.textbordercolor != 'undefined') { _textbordercolor = clrHEXAToU32ABGR(cTextInfo.textbordercolor, cTextInfo.textborderAlpha); }
        if (typeof cTextInfo.textbackmode != 'undefined') { _textbackmode = cTextInfo.textbackmode; }
        if (typeof cTextInfo.textbackborder != 'undefined') { _textbackborder = cTextInfo.textbackborder; }
        if (typeof cTextInfo.textbackclr != 'undefined') { _textbackclr = clrHEXAToU32ABGR(cTextInfo.textbackclr, cTextInfo.textbackAlpha); }
        var TempTextRect = [-1, -1, 1, 1]; var TempTextFmtFlag = 0x40/*TEXT_FMT_NOCLIP*/;
        if (_textbias[0] < 0) {
            TempTextRect[0] = -1; TempTextRect[2] = 0; TempTextFmtFlag |= 0x20/*TEXT_FMT_RIGHT*/;
        } else if (_textbias[0] == 0) {
            TempTextRect[0] = -1; TempTextRect[2] = 1; TempTextFmtFlag |= 0x10/*TEXT_FMT_LEFT*/;
        } else {
            TempTextRect[0] = 0; TempTextRect[2] = 1; TempTextFmtFlag |= 0x8/*TEXT_FMT_LEFT*/;
        }
        if (_textbias[1] < 0) {
            TempTextRect[1] = -1; TempTextRect[3] = 0; TempTextFmtFlag |= 0x4/*TEXT_FMT_TOP*/;
        } else if (_textbias[1] == 0) {
            TempTextRect[1] = -1; TempTextRect[3] = 1; TempTextFmtFlag |= 0x2/*TEXT_FMT_BOTTOM*/;
        } else {
            TempTextRect[1] = 0; TempTextRect[3] = 1; TempTextFmtFlag |= 0x1/*TEXT_FMT_BOTTOM*/;
        }
        var textobj = {
            m_strGolFontID: _GolFontID,
            m_bTextWeight: false,
            m_strText: cTextInfo.textinfo,
            m_uTextClr: _textcolor,
            m_uTextBorderClr: _textbordercolor,
            m_qTextRect: TempTextRect,
            m_uTextFmtFlag: TempTextFmtFlag,
            m_uTextBackMode: _textbackmode, m_sTextBackBorder: _textbackborder, m_uTextBackClr: _textbackclr
        };

        var _bContactSce = false; if (checkParamNull(re_Info.bContactSce)) _bContactSce = re_Info.bContactSce;
        var _linewidth = 1; if (checkParamNull(re_Info.uLineWidth)) _linewidth = re_Info.uLineWidth;
        var _uClr = 0xFFFFFFFF; if (checkParamNull(re_Info.lineColor)) _uClr = clrHEXAToU32ABGR(re_Info.lineColor, re_Info.lineClrAlpha);
        var _uFillClr = 0xFFFFFFFF; if (checkParamNull(re_Info.fillColor)) _uFillClr = clrHEXAToU32ABGR(re_Info.fillColor, re_Info.fillClrAlpha);

        return Module.RealBIMWeb.AddCustomPolylineShp(shpName, temparrpos, re_Info.uFillState, _uClr, _uFillClr, re_Info.fTextPos, textobj, re_Info.fASDist, re_Info.fVisDist, _bContactSce, _linewidth);
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
                    if (!(param instanceof Array)) {
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
        if (_re_ColorHEX.length != 6) return [];
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
        if (_re_ColorHEX.length != 6) return 0xFFFFFFFF;
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
     * RBG颜色转换十六进制
     * @param {Array} clrRBG //RBG颜色
     */
    function clrRBGToHEX(clrRBG) {
        if (!checkParamTypeBy(clrRBG, '', RE_Enum.RE_Check_Array, false)) return '';
        var _re_ColorRGB = deepClone(clrRBG);
        if (_re_ColorRGB.length < 3) return '';
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
    const RE_ViewportType = {
        None: '',//该视图不显示任何内容
        BIM: 'BIM',//该视图显示BIM场景模型
        CAD: 'CAD',//该视图显示CAD图纸
        Panorama: '360',//该视图显示360全景图
    }
    ExtModule.RE_ViewportType = RE_ViewportType;

    //视图排列方式
    const RE_ViewportRank = {
        Single: 0,//视图0/视图1任一为空字符串：屏幕中只显示一个内容有效的视图
        LR: 1,//屏幕自左向右依次显示视图0、视图1
        TB: -1,//屏幕自下向上依次显示视图0、视图1
    }
    ExtModule.RE_ViewportRank = RE_ViewportRank;

    // MARK CamLoc
    //表示ViewCude视图的类型
    const RE_ViewCudePerspective = {
        RE_FACE_FR: "Module.RE_CAM_DIR.FRONT",//面-主视图（前视图）
        RE_FACE_BK: "Module.RE_CAM_DIR.BACK",//面-后视图
        RE_FACE_L: "Module.RE_CAM_DIR.LEFT",//面-左视图
        RE_FACE_R: "Module.RE_CAM_DIR.RIGHT",//面-右视图
        RE_FACE_T: "Module.RE_CAM_DIR.TOP",//面-俯视图（上视图）
        RE_FACE_B: "Module.RE_CAM_DIR.BOTTOM",//面-仰视图（下视图）
        RE_DEGE_T_FR: "Module.RE_CAM_DIR.TOPFRONT",//棱-上前
        RE_DEGE_T_R: "Module.RE_CAM_DIR.TOPRIGHT",//棱-上右
        RE_DEGE_T_BK: "Module.RE_CAM_DIR.TOPBACK",//棱-上后
        RE_DEGE_T_L: "Module.RE_CAM_DIR.TOPLEFT",//棱-上左
        RE_DEGE_L_FR: "Module.RE_CAM_DIR.LEFTFRONT",//棱-左前
        RE_DEGE_R_FR: "Module.RE_CAM_DIR.RIGHTFRONT",//棱-前右
        RE_DEGE_R_BK: "Module.RE_CAM_DIR.RIGHTBACK",//棱-右后
        RE_DEGE_L_BK: "Module.RE_CAM_DIR.LEFTBACK",//棱-后左
        RE_DEGE_B_FR: "Module.RE_CAM_DIR.BOTTOMFRONT",//棱-下前
        RE_DEGE_B_R: "Module.RE_CAM_DIR.BOTTOMRIGHT",//棱-下右
        RE_DEGE_B_BK: "Module.RE_CAM_DIR.BOTTOMBACK",//棱-下后
        RE_DEGE_B_L: "Module.RE_CAM_DIR.BOTTOMLEFT",//棱-下左
        RE_VERTEX_T_R_BK: "Module.RE_CAM_DIR.TOPRIGHTBACK",//顶点-上右后
        RE_VERTEX_T_L_BK: "Module.RE_CAM_DIR.TOPLEFTBACK",//顶点-上左后
        RE_VERTEX_T_L_FR: "Module.RE_CAM_DIR.TOPLEFTFRONT",//顶点-上左前
        RE_VERTEX_T_R_FR: "Module.RE_CAM_DIR.TOPRIGHTFRONT",//顶点-上右前
        RE_VERTEX_B_R_BK: "Module.RE_CAM_DIR.BOTTOMRIGHTBACK",//顶点-下右后
        RE_VERTEX_B_L_BK: "Module.RE_CAM_DIR.BOTTOMLEFTBACK",//顶点-下左后
        RE_VERTEX_B_L_FR: "Module.RE_CAM_DIR.BOTTOMLEFTFRONT",//顶点-下左前
        RE_VERTEX_B_R_FR: "Module.RE_CAM_DIR.BOTTOMRIGHTFRONT",//顶点-下右前
        RE_DEFAULT: "Module.RE_CAM_DIR.DEFAULT",//默认视角
    }
    ExtModule.RE_ViewCudePerspective = RE_ViewCudePerspective;


    // MARK UI
    //系统界面对应C++名称
    const RE_SYSWnd_Mate = {
        RE_PanelBtn_TerrainAlpha: 'BuiltIn_Btn_TerrAlpha',//底部主工具栏-地形透明度
        RE_PanelBtn_Reset: 'BuiltIn_Btn_ResetAll',//底部主工具栏-重置操作
        RE_PanelBtn_IsolateBuild: 'BuiltIn_Btn_Isolate',//底部主工具栏-隔离构件
        RE_PanelBtn_HideBuild: 'BuiltIn_Btn_Hide',//底部主工具栏-隐藏构件
        RE_PanelBtn_RecoverDisplay: 'BuiltIn_Btn_ResetVisible',//底部主工具栏-恢复显示
        RE_PanelBtn_Measure: 'BuiltIn_Btn_Measure',//底部主工具栏-测量
        RE_PanelBtn_Cutting: 'BuiltIn_Btn_Cutting',//底部主工具栏-剖切
        RE_PanelBtn_Setting: 'BuiltIn_Btn_Setting',//底部主工具栏-设置
        RE_SYSWnd_AffineTransMode: 'AffineTransModeWnd',//位置编辑仿射变换窗口
    }
    ExtModule.RE_SYSWnd_Mate = RE_SYSWnd_Mate;








    return ExtModule;
};

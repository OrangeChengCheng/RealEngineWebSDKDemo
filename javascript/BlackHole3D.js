//版本：v2.1.0.1816
const isPhoneMode = false;
var CreateBlackHoleWebSDK = function (ExtModule) {

    ExtModule = ExtModule || {};
    var Module = typeof ExtModule !== "undefined" ? ExtModule : {};

    CreateModuleRE2(ExtModule).then(instance => {
        ExtModule = instance;
    }); //创建引擎模块


    // MOD-- 引擎模块
    class RESysModel {
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
    ExtModule.RESysModel = RESysModel;

    /**
     * 初始化引擎
     * @param {RESysModel} sysModel //引擎设置参数
     */
    Module.initEngineSys = function (sysModel) {
        if (isEmptyLog(sysModel, 'sysModel')) return;
        if (isEmpty(sysModel.workerjsPath) || isEmpty(sysModel.commonUrl)) {
            logParErr('sysModel');
            return;
        }

        Module['m_re_em_force_threadnum'] = isPhoneMode ? 1 : 8;//移动端强制将CPU核心数设为1，以避免浏览器创建多个WebWorker时造成内存耗尽
        Module["m_re_em_window_width"] = sysModel.renderWidth;
        Module["m_re_em_window_height"] = sysModel.renderHieght;
        var _strMainWndName = "BlackHole"; if (!isEmpty(sysModel.mainWndName)) _strMainWndName = sysModel.mainWndName;
        var bool = Module.RealBIMWeb.CreateEmuMgr(sysModel.workerjsPath, _strMainWndName, sysModel.renderWidth, sysModel.renderHieght,
            false, 500, "", sysModel.commonUrl, "/ModuleDir/TempFile/", "/WebCache0001/",
            sysModel.userName, sysModel.passWord);
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
        if (isEmptyLog(camLoc)) return;
        if (isEmptyLog(camLoc.camPos)) return;
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
        if (isEmptyLog(camPos)) return;
        if (isEmptyLog(camRotate)) return;
        var _bFixMainCam = false; if (!isEmpty(toLoc)) _bFixMainCam = toLoc;
        Module.RealBIMWeb.IsFixMainCam(_bFixMainCam, camPos, camRotate);
    }

    /**
     * 调整相机到默认视角方位
     * @param {RE_ViewCudePerspective} locType //表示26个方向 RE_ViewCudePerspectiveEnum 枚举值
     * @param {Boolean} scanAllDataSet //是否定位到整个数据集，默认true，true表示定位到整个场景，false表示相机原地调整方向
     */
    Module.Camera.setCamLocateDefault = function (locType, scanAllDataSet) {
        if (isEmptyLog(locType)) return;
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
        if (isEmptyLog(locIDList)) return;
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



    //设置天空的启用状态
    Module.REsetSkyEnable = function (bool) {
        Module.RealBIMWeb.SetSkyEnable(bool);
    }
    //获取天空的启用状态
    Module.REgetSkyEnable = function () {
        var bool = Module.RealBIMWeb.GetSkyEnable();
        return bool;
        var namearr = ["sce01", "sce02"];
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


    // /**
    //  * 检查参数是否为空，是否需要打印错误提示
    //  * @param {Object} param //参数
    //  * @param {String} paramName //参数名
    //  * @param {Boolean} needErrorLog //是否需要报错信息
    //  */
    // function checkNullBy(param, paramName, needErrorLog) {
    //     if (typeof param == 'undefined') {
    //         if (needErrorLog) logErrorWithPar(paramName);
    //         return false;
    //     }
    //     return true;
    // }

    // /**
    //  * 检查参数是否为空，并打印错误提示
    //  * @param {Object} param //参数
    //  * @param {String} paramName //参数名
    //  */
    // function checkNull(param, paramName) {
    //     return checkNullBy(param, paramName, true);
    // }

    // /**
    //  * 检查参数是否为空
    //  * @param {Object} param //参数
    //  */
    // function checkParamNull(param) {
    //     return checkNullBy(param, '', false);
    // }

    // /**
    //  * 检查参数是否为空，参数类型是否正确,是否需要报错信息
    //  * @param {Object} param //参数
    //  * @param {String} paramName //参数名
    //  * @param {RE_Enum} re_type //枚举类型
    //  * @param {Boolean} needErrorLog //是否需要报错信息
    //  */
    // function checkParamTypeBy(param, paramName, re_type, needErrorLog) {
    //     if (!checkNullBy(param, paramName, needErrorLog)) return false;

    //     switch (re_type) {
    //         case RE_Enum.RE_Check_String:
    //             {
    //                 if ((typeof param != "string")) {
    //                     if (needErrorLog) logErrorWithPar(paramName);
    //                     return false;
    //                 }
    //             }
    //             break;
    //         case RE_Enum.RE_Check_Array:
    //             {
    //                 if (!(param instanceof Array)) {
    //                     if (needErrorLog) logErrorWithPar(paramName);
    //                     return false;
    //                 }
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    //     return true;
    // }

    // /**
    //  * 检查参数是否为空，参数类型是否正确 并打印报错
    //  * @param {Object} param //参数
    //  * @param {String} paramName //参数名
    //  * @param {RE_Enum} re_type //枚举类型
    //  */
    // function checkParamType(param, paramName, re_type) {
    //     return checkParamTypeBy(param, paramName, re_type, true);
    // }

    // /**
    //  * 打印错误提示
    //  * @param {String} paramName //参数名
    //  */
    // function logErrorWithPar(paramName) {
    //     console.error("【REError】: errMsg: 传入参数格式不正确！-> " + paramName);
    // }

    // /**
    //  * 判断是否是数组，且数组个数
    //  * @param {Object} param //参数名
    //  * @param {String} paramName //参数名
    //  * @param {Number} count //检查个数
    //  * @param {Boolean} needErrorLog //是否需要报错信息
    //  */
    // function checkArrCountBy(param, paramName, count, needErrorLog) {
    //     var isArr = checkParamTypeBy(param, paramName, RE_Enum.RE_Check_Array, needErrorLog);
    //     if (isArr) {
    //         if (param.length == count) {
    //             return true;
    //         }
    //     }
    //     if (needErrorLog) logErrorWithPar(paramName);
    //     return false;
    // }

    // /**
    //  * 判断是否是数组，且数组个数，并打印报错
    //  * @param {Object} param //参数名
    //  * @param {String} paramName //参数名
    //  * @param {Number} count //检查个数
    //  */
    // function checkArrCount(param, paramName, count) {
    //     return checkArrCountBy(param, paramName, count, true);
    // }

    // /**
    //  * 32位颜色转十六进制颜色 ABGR -> RBG_HEX
    //  * @param {Number} colorU32 //32位颜色值
    //  */
    // function colorU32ToHEX(colorU32) {
    //     let _hexStr = (colorU32).toString(16);
    //     let count = _hexStr.length;
    //     for (let a = 0; a < (8 - count); a++) {
    //         _hexStr = '0' + _hexStr;
    //     }
    //     // ABGR -> RGBA
    //     var _hexStr_Reverse = _hexStr.split('').reverse().join('');
    //     return _hexStr_Reverse.substring(0, 6);
    // }

    // /**
    //  * 32位颜色转透明度 ABGR -> alpha (0~255)
    //  * @param {Number} colorU32 //32位颜色值
    //  */
    // function colorU32ToAlpha(colorU32) {
    //     let _hexStr = (colorU32).toString(16);
    //     let count = _hexStr.length;
    //     for (let a = 0; a < (8 - count); a++) {
    //         _hexStr = '0' + _hexStr;
    //     }
    //     var hexAlpha = _hexStr.substring(0, 2);
    //     return (parseInt(hexAlpha, 16) / 255);
    // }

    // /**
    //  * 十六进制颜色转换RGB
    //  * @param {String} clrHEX //十六进制颜色
    //  */
    // function clrHEXToRGB(clrHEX) {
    //     if (!checkParamTypeBy(clrHEX, '', RE_Enum.RE_Check_String, false)) return [];
    //     var _re_ColorHEX = deepClone(clrHEX);
    //     if (_re_ColorHEX.includes('0x')) {
    //         _re_ColorHEX = _re_ColorHEX.replace('0x', '');
    //     }
    //     if (_re_ColorHEX.length != 6) return [];
    //     var _RTemp = _re_ColorHEX.substring(0, 2); var _R = (parseInt(_RTemp, 16) / 255);
    //     var _GTemp = _re_ColorHEX.substring(2, 4); var _G = (parseInt(_GTemp, 16) / 255);
    //     var _BTemp = _re_ColorHEX.substring(4, 6); var _B = (parseInt(_BTemp, 16) / 255);

    //     return [_R, _G, _B];
    // }

    // /**
    //  * 十六进制颜色+透明度->U32_ABGR
    //  * @param {String} clrHEX 
    //  * @param {Number} alpha 
    //  * @returns 
    //  */
    // function clrHEXAToU32ABGR(clrHEX, alpha) {
    //     var _re_ColorHEX = deepClone(clrHEX);
    //     if (_re_ColorHEX.includes('0x')) {
    //         _re_ColorHEX = _re_ColorHEX.replace('0x', '');
    //     }
    //     if (_re_ColorHEX.length != 6) return 0xFFFFFFFF;
    //     // RGB->BGR  c++要地址位从低到高存储 ABGR
    //     var clrHEX_R = _re_ColorHEX.substring(0, 2);
    //     var clrHEX_G = _re_ColorHEX.substring(2, 4);
    //     var clrHEX_B = _re_ColorHEX.substring(4, 6);
    //     var clrHEX_BGR = clrHEX_B + clrHEX_G + clrHEX_R;
    //     var _alphaNum = 255; if (checkParamNull(alpha)) _alphaNum = alpha;
    //     var intAlpha = Math.round(alpha);
    //     var alphaHEX = (intAlpha > 15 ? (intAlpha.toString(16)) : ("0" + intAlpha.toString(16)));
    //     var clrHEX_ABGR = "0x" + alphaHEX + clrHEX_BGR;
    //     var intClr_ABGR = parseInt(clrHEX_ABGR);
    //     return intClr_ABGR;
    // }

    // /**
    //  * RBG颜色转换十六进制
    //  * @param {Array} clrRBG //RBG颜色
    //  */
    // function clrRBGToHEX(clrRBG) {
    //     if (!checkParamTypeBy(clrRBG, '', RE_Enum.RE_Check_Array, false)) return '';
    //     var _re_ColorRGB = deepClone(clrRBG);
    //     if (_re_ColorRGB.length < 3) return '';
    //     _r = Math.floor(_re_ColorRGB[0] * 255);
    //     _g = Math.floor(_re_ColorRGB[1] * 255);
    //     _b = Math.floor(_re_ColorRGB[2] * 255);
    //     var _clrHEX = _r.toString(16) + _g.toString(16) + _b.toString(16);

    //     return _clrHEX;
    // }

    // /**
    //  * 深拷贝
    //  * @param {Object} obj //拷贝数据
    //  */
    // function deepClone(obj) {
    //     var _obj = JSON.stringify(obj); //  对象转成字符串
    //     var objClone = JSON.parse(_obj); //  字符串转成对象
    //     return objClone;
    // }

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












    return ExtModule;
};

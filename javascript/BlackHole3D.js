//版本：v2.1.0.1816
const isPhoneMode = false;
var CreateBlackHoleWebSDK = function (ExtModule) {

    ExtModule = ExtModule || {};
    var Module = typeof ExtModule !== "undefined" ? ExtModule : {};

    CreateModuleRE2(ExtModule).then(instance => {
        ExtModule = instance;
    }); //创建引擎模块


    // MOD-- 引擎模块
    // MARK 构造函数模型
    class RESysModel {
        // 引擎参数模型
        constructor() {
            this.workerjsPath = '';//相对于html页面的RealBIMWeb_Worker.js的路径
            this.renderWidth = 0;//初始化图形窗口的宽度
            this.renderHieght = 0;//初始化图形窗口的高度
            this.commonUrl = 0;//引擎调用的公共资源的路径
            this.userName = 0;//引擎资源发布服务配套的用户名
            this.passWord = 0;//引擎资源发布服务配套的密码
            this.mainWndName = 0;//表示主窗口的名称,对应document.title，默认值 "BlackHole"
        }
    }
    ExtModule.RESysModel = RESysModel;

    // MARK sdk函数
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
    // MARK sdk函数
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
    // MARK 构造函数模型
    class REDataSetModel {
        // 引擎参数模型
        constructor() {
            this.dataSetId = '';//数据集的唯一标识名，不能为空不可重复，重复前边的数据集会被自动覆盖
            this.resourcesAddress = '';//数据集资源包地址
            this.useNewVer = true; //表示是否加载最新版本，默认true
            this.assginVersion = '';//指定版本号，不加载最新版本的时候，会用此版本号
            this.useTransInfo = false;//表示该项目是否需要调整位置，默认false
            this.transInfo = [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]];//项目的偏移信息，依次为缩放、旋转（四元数）、平移
            this.minLoadDist = 1e30;//项目模型的最小加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
            this.maxLoadDist = 1e30;//项目模型的最大加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载；
            this.projCRS = '';//当前子项的坐标系标识
            this.projNorth = 0.0;//当前子项的项目北与正北方向的夹角（右手坐标系，逆时针为正）projCRS为空时此参数无定意义
        }
    }
    // MARK sdk函数

    Module.Model.loadDataSet = function () {

    }





    Module.REloadMainSce_projs = function (projInfo, preclear) {
        if (isRepeat(projInfo, 'projName')) {
            console.error('【REError】: projName 唯一标识名，不能为空不可重复');
            return;
        }
        var _l = projInfo.length;
        for (var i = 0; i < _l; ++i) {
            var _defMainProjResRoot = ((i == 0) ? projInfo[i].urlRes : ""); var _defMainProjCamFile = "";
            var _deftransinfo = [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]];
            var _isMainProj = false;
            var _projCRS = "";
            var _projNorth = 0.0;
            var _useCamPost = false;
            var _minLoadDist = 1e30;
            var _maxLoadDist = 1e30;
            var intprojid = Module.RealBIMWeb.ConvGolStrID2IntID(projInfo[i].projName);
            var _ver = { m_sVer0: 0x7fffffff, m_sVer1: -1, m_uVer0GolIDBias_L32: 0, m_uVer0GolIDBias_H32: 0, m_uVer1GolIDBias_L32: 0, m_uVer1GolIDBias_H32: 0 };
            _isMainProj = (((((typeof preclear == 'undefined') || preclear) && (i == 0))) ? true : false);
            if (typeof projInfo[i].projCRS != 'undefined') { _projCRS = projInfo[i].projCRS; }
            if (typeof projInfo[i].projNorth != 'undefined') { _projNorth = projInfo[i].projNorth; }
            if (typeof projInfo[i].useNewVer != 'undefined' && !projInfo[i].useNewVer) {
                _ver.m_sVer0 = projInfo[i].verInfo; _ver.m_uVer0GolIDBias_H32 = intprojid;
            }
            if (typeof projInfo[i].useNewVer2 != 'undefined' && !projInfo[i].useNewVer2) {
                _ver.m_sVer1 = projInfo[i].verInfo2; _ver.m_uVer1GolIDBias_H32 = intprojid;
            }
            if (projInfo[i].useTransInfo) { _deftransinfo = projInfo[i].transInfo; }
            if ((typeof projInfo[i].minLoadDist != 'undefined') && (projInfo[i].minLoadDist != 0)) { _minLoadDist = projInfo[i].minLoadDist; }
            if ((typeof projInfo[i].maxLoadDist != 'undefined') && (projInfo[i].maxLoadDist != 0)) { _maxLoadDist = projInfo[i].maxLoadDist; }
            Module.RealBIMWeb.LoadMainSceExt(projInfo[i].projName, _isMainProj, _projCRS, _projNorth, projInfo[i].urlRes + projInfo[i].projResName + "/total.xml",
                _deftransinfo[0], _deftransinfo[1], _deftransinfo[2], _minLoadDist, _maxLoadDist,
                _defMainProjResRoot, _defMainProjCamFile, _useCamPost);
            var verbool = Module.RealBIMWeb.SetSceVersionInfoExt(projInfo[i].projName, _ver);
        }
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
        if (!value) return true;
        if (typeof value == 'undefined') return true;
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

















    return ExtModule;
};

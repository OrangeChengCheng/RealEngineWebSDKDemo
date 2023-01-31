//版本：v2.1.0.1816
var CreateBlackHoleWebSDK = function (ExtModule) {

    ExtModule = ExtModule || {};
    var Module = typeof ExtModule !== "undefined" ? ExtModule : {};

    CreateModuleRE2(ExtModule).then(instance => {
        ExtModule = instance;
    }); //创建引擎模块


    // MOD-- 引擎模块
    /**
     * 场景初始化
     * @param {String} mainWndName //表示主窗口的名称,对应document.title
     * @returns 
     */
    //场景初始化
    Module.initEngineSys = function (strWorkerjsPath, uWidth, uHeight, strCommonUrl, strUserName, strPassWord, mainWndName) {
        var _bPhoneMode = false;
        if (_bPhoneMode) {
            Module['m_re_em_force_threadnum'] = 1; //强制将CPU核心数设为1，以避免浏览器创建多个WebWorker时造成内存耗尽
        } else {
            Module['m_re_em_force_threadnum'] = 8;
        }
        Module["m_re_em_window_width"] = uWidth;
        Module["m_re_em_window_height"] = uHeight;
        var _strMainWndName = "BlackHole"; if (checkParamNull(mainWndName)) _strMainWndName = mainWndName;
        var bool = Module.RealBIMWeb.CreateEmuMgr(strWorkerjsPath, _strMainWndName, uWidth, uHeight,
            false, 500, "", strCommonUrl, "/ModuleDir/TempFile/", "/WebCache0001/",
            strUserName, strPassWord);
        if (_bPhoneMode) {
            Module.REsetSkyAtmActive(false);
            Module.REsetReflState(false);
            Module.REsetShadowState(false);
            Module.REsetGhostState(false);
            Module.REsetAOState(false);
            Module.REsetSceOITLev(0);
        }
        return bool;
    }



    //退出引擎界面
    //bClearWebWorker：表示是否要清除引擎相关WebWorker资源
    Module.REreleaseEngine = function (bClearWebWorker) {
        var _bClearWebWorker = false; if (typeof bClearWebWorker != 'undefined') { _bClearWebWorker = bClearWebWorker; }
        Module.RealBIMWeb.ReleaseEmuMgr(_bClearWebWorker);
    }




    //设置网络资源加载是否使用缓存
    Module.REsetUseWebCache = function (bUseWebCache) {
        Module.RealBIMWeb.SetUseWebCache(bUseWebCache);
    }
    //获取网络资源加载是否使用缓存
    Module.REgetUseWebCache = function () {
        return Module.RealBIMWeb.GetUseWebCache();
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





    //获取当前js版本
    Module.REgetJsVersion = function () {
        var ver = Module.RealBIMWeb.GetRealEngineVersion();
        return ver;
    }

    //设置渲染时引擎最大允许的内存占用空间(以MB为单位)
    Module.REsetMaxResMemMB = function (val) {
        Module.RealBIMWeb.SetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK, val);
    }
    //获取渲染时引擎最大允许的内存占用空间(以MB为单位)
    Module.REgetMaxResMemMB = function () {
        var val = Module.RealBIMWeb.GetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK);
        return val;
    }
    //设置渲染时引擎建议分配的内存空间(以MB为单位)
    Module.REsetExpectMaxInstMemMB = function (val) {
        Module.RealBIMWeb.SetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, val);
    }
    //获取渲染时引擎建议分配的内存空间(以MB为单位)
    Module.REgetExpectMaxInstMemMB = function () {
        var val = Module.RealBIMWeb.GetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
        return val;
    }
    //设置模型每帧最大渲染面数
    Module.REsetExpectMaxInstDrawFaceNum = function (val) {
        Module.RealBIMWeb.SetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, val);
    }
    //获取模型每帧最大渲染面数
    Module.REgetExpectMaxInstDrawFaceNum = function () {
        var val = Module.RealBIMWeb.GetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
        return val;
    }
    //设置页面调度等级
    Module.REsetPageLoadLev = function (val) {
        Module.RealBIMWeb.SetPageLoadLev(val);
    }
    //获取页面调度等级
    Module.REgetPageLoadLev = function () {
        var val = Module.RealBIMWeb.GetPageLoadLev();
        return val;
    }
    //设置每帧允许的最大资源加载总数
    Module.REsetTotalResMaxLoadNum = function (val) {
        if (val == 0) {
            Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0);
        } else if (val == 1) {
            Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0xffffffff);
        }
    }
    //获取每帧允许的最大资源加载总数
    Module.REgetTotalResMaxLoadNum = function () {
        var val = Module.RealBIMWeb.GetTotalResMaxLoadNumPerFrame();
        return val;
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










    return ExtModule;
};

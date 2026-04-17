//版本：v3.2.0.3690
const isPhoneMode = false;
const hasNewEntity = false;
const hasEntityAniEdit = false;
const discardHint = true;
const sharding = true;
const funcLog = false;
var CreateBlackHoleWebSDK = function (ExtModule) {
    ExtModule = ExtModule || {};
    var Module = typeof ExtModule !== 'undefined' ? ExtModule : {};

    CreateModuleRE2(ExtModule).then((instance) => {
        ExtModule = instance;
    }); //创建引擎模块

    // MOD-- 引擎模块 <---

    class RESysInfo {
        // 引擎参数模型
        constructor() {
            this.workerjsPath = null; //相对于html页面的RealBIMWeb_Worker.js的路径
            this.renderWidth = 0; //初始化图形窗口的宽度
            this.renderHieght = 0; //初始化图形窗口的高度
            this.commonUrl = null; //引擎调用的公共资源的路径
            this.userName = ''; //引擎资源发布服务配套的用户名
            this.passWord = ''; //引擎资源发布服务配套的密码
            this.mainWndName = 'BlackHole'; //表示主窗口的名称,对应document.title，默认值 "BlackHole"
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

        var _commonUrl = isEmpty(sysInfo.commonUrl) ? '' : sysInfo.commonUrl;
        // if (!isEmpty(sysInfo.commonUrl)) sessionStorage.setItem("RECommonUrl", sysInfo.commonUrl);//保存资源地址
        Module['m_re_em_force_threadnum'] = isPhoneMode ? 1 : 8; //移动端强制将CPU核心数设为1，以避免浏览器创建多个WebWorker时造成内存耗尽
        Module['m_re_em_window_width'] = sysInfo.renderWidth;
        Module['m_re_em_window_height'] = sysInfo.renderHieght;
        var _strMainWndName = 'BlackHole';
        if (!isEmpty(sysInfo.mainWndName)) _strMainWndName = sysInfo.mainWndName;
        var bool = Module.RealBIMWeb.CreateEmuMgr(
            sysInfo.workerjsPath,
            _strMainWndName,
            sysInfo.renderWidth,
            sysInfo.renderHieght,
            false,
            500,
            '',
            _commonUrl,
            '/ModuleDir/TempFile/',
            '/WebCache0001/',
            sysInfo.userName,
            sysInfo.passWord
        );
        if (isPhoneMode) {
            if (isMobilDevice_ios() || isMobilDevice_HarmonyOS()) {
                Module.SkyBox.setSkyAtmActive(false);
                Module.Common.setReflState(false);
                Module.Common.setShadowState(false);
                Module.Common.setGhostState(false);
                Module.Common.setAOState(false);
                Module.Common.setSceOITLev(0);
            }
            Module.setOperationMode(1);
        }
        document.addEventListener('RESystemSel_Web', RESystemSel_Web); //引擎探测事件
        document.addEventListener('REWorldPosChange_Web', REWorldPosChange_Web); //监听世界坐标点变化触发回调事件
        document.addEventListener('REEditControlPosMatchFinish_Web', REEditControlPosMatchFinish_Web); //位置编辑的控制点配准模式匹配完成回调事件
        document.addEventListener('REAnimPlayScriptState_Web', REAnimPlayScriptState_Web); //动画播放脚本状态回调事件
        document.addEventListener('REMeasureFinish_Web', REMeasureFinish_Web); //测量完成回调事件
        document.addEventListener('REElemSelRegFinish_Web', REElemSelRegFinish_Web); //范围选择构件完成回调事件
        document.addEventListener('RECreateTPPFinish_Web', RECreateTPPFinish_Web); //创建单构件对象并进入第三人称漫游完成回调事件
        document.addEventListener('RECADCommentDrawFinish_Web', RECADCommentDrawFinish_Web); //创建CAD标注完成回调事件
        document.addEventListener('RECalcHeightRangeFinish_Web', RECalcHeightRangeFinish_Web); //获取闭合几何数据范围内高度最大最小值完成回调事件
        document.addEventListener('RECADSwitchLayoutFinished_Web', RECADSwitchLayoutFinished_Web); //CAD切换图层完成回调事件
        document.addEventListener('RESystemKeyDown_Web', RESystemKeyDown_Web); //键盘按键按下完成事件
        document.addEventListener('REAddWaterRgnFinish_Web', REAddWaterRgnFinish_Web); //水面添加区域完成回调事件
        document.addEventListener('REAddWaterRgnCheck_Web', REAddWaterRgnCheck_Web); //水面添加区域检查回调事件
        document.addEventListener('REEditWaterFinish_Web', REEditWaterFinish_Web); //编辑水面操作完成回调事件
        document.addEventListener('REAddExtrudeRgnFinish_Web', REAddExtrudeRgnFinish_Web); //挤出添加区域完成回调事件
        document.addEventListener('REAddExtrudeRgnCheck_Web', REAddExtrudeRgnCheck_Web); //挤出添加区域检查回调事件
        document.addEventListener('REEditExtrudeFinish_Web', REEditExtrudeFinish_Web); //编辑挤出操作完成回调事件
        document.addEventListener('REAddMonomerRgnFinish_Web', REAddMonomerRgnFinish_Web); //单体化添加区域完成回调事件
        document.addEventListener('REAddMonomerRgnCheck_Web', REAddMonomerRgnCheck_Web); //单体化添加区域检查回调事件
        document.addEventListener('REEditMonomerFinish_Web', REEditMonomerFinish_Web); //编辑单体化操作完成回调事件
        document.addEventListener('REEditShpFinish_Web', REEditShpFinish_Web); //编辑矢量操作完成回调事件
        document.addEventListener('REAddShpRgnFinish_Web', REAddShpRgnFinish_Web); //矢量添加区域完成回调事件
        document.addEventListener('REShpClipFinish_Web', REShpClipFinish_Web); //矢量切割完成回调事件
        document.addEventListener('REAddShpRgnCheck_Web', REAddShpRgnCheck_Web); //矢量添加区域检查回调事件
        document.addEventListener('REShpAddClipFace_Web', REShpAddClipFace_Web); //矢量添加切割面回调事件
        document.addEventListener('REPanLocateCam_Web', REPanLocateCam_Web); //360全景相机定位回调事件

        return bool;
    };

    function removeEventListener() {
        document.removeEventListener('RESystemSel_Web', RESystemSel_Web);
        document.removeEventListener('REWorldPosChange_Web', REWorldPosChange_Web);
        document.removeEventListener('REEditControlPosMatchFinish_Web', REEditControlPosMatchFinish_Web);
        document.removeEventListener('REAnimPlayScriptState_Web', REAnimPlayScriptState_Web);
        document.removeEventListener('REMeasureFinish_Web', REMeasureFinish_Web);
        document.removeEventListener('REElemSelRegFinish_Web', REElemSelRegFinish_Web);
        document.removeEventListener('RECreateTPPFinish_Web', RECreateTPPFinish_Web);
        document.removeEventListener('RECADCommentDrawFinish_Web', RECADCommentDrawFinish_Web);
        document.removeEventListener('RECalcHeightRangeFinish_Web', RECalcHeightRangeFinish_Web);
        document.removeEventListener('RECADSwitchLayoutFinished_Web', RECADSwitchLayoutFinished_Web);
        document.removeEventListener('RESystemKeyDown_Web', RESystemKeyDown_Web);
        document.removeEventListener('REAddWaterRgnFinish_Web', REAddWaterRgnFinish_Web);
        document.removeEventListener('REEditWaterFinish_Web', REEditWaterFinish_Web);
        document.removeEventListener('REAddWaterRgnCheck_Web', REAddWaterRgnCheck_Web);
        document.removeEventListener('REAddExtrudeRgnFinish_Web', REAddExtrudeRgnFinish_Web);
        document.removeEventListener('REAddExtrudeRgnCheck_Web', REAddExtrudeRgnCheck_Web);
        document.removeEventListener('REEditExtrudeFinish_Web', REEditExtrudeFinish_Web);
        document.removeEventListener('REAddMonomerRgnFinish_Web', REAddMonomerRgnFinish_Web);
        document.removeEventListener('REAddMonomerRgnCheck_Web', REAddMonomerRgnCheck_Web);
        document.removeEventListener('REEditMonomerFinish_Web', REEditMonomerFinish_Web);
        document.removeEventListener('REEditShpFinish_Web', REEditShpFinish_Web);
        document.removeEventListener('REAddShpRgnFinish_Web', REAddShpRgnFinish_Web);
        document.removeEventListener('REShpClipFinish_Web', REShpClipFinish_Web);
        document.removeEventListener('REAddShpRgnCheck_Web', REAddShpRgnCheck_Web);
        document.removeEventListener('REShpAddClipFace_Web', REShpAddClipFace_Web);
        document.removeEventListener('REPanLocateCam_Web', REPanLocateCam_Web);
    }

    // MARK 回调事件
    function RESystemSel_Web(e) {
        const re_event_RESystemSel = new CustomEvent('RESystemSel', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_RESystemSel);
    }

    function REWorldPosChange_Web(e) {
        const re_event_REWorldPosStates = new CustomEvent('REWorldPosChange', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REWorldPosStates);
    }

    function REEditControlPosMatchFinish_Web(e) {
        const re_event_REEditControlPosMatchFinish = new CustomEvent('REEditControlPosMatchFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REEditControlPosMatchFinish);
    }

    function REAnimPlayScriptState_Web(e) {
        const re_event_REAnimPlayScriptState = new CustomEvent('REAnimPlayScriptState', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAnimPlayScriptState);
    }
    function REMeasureFinish_Web(e) {
        let posData = e.detail;
        if (e.detail.canvasid.length) {
            let measure_res = Module.Measure.getResultData(e.detail.measureId);
            posData.measureData = measure_res;
            const re_event_REMeasureFinish = new CustomEvent('REMeasureFinish', {
                detail: posData,
            });
            document.dispatchEvent(re_event_REMeasureFinish);
        }
    }
    function REElemSelRegFinish_Web(e) {
        let posData = e.detail;
        if (e.detail.canvasid.length) {
            const elemids = Array.from(e.detail.elemids);
            posData.elemids = elemids;
            const re_event_REElemSelRegFinish = new CustomEvent('REElemSelRegFinish', {
                detail: posData,
            });
            document.dispatchEvent(re_event_REElemSelRegFinish);
        }
    }

    function RECreateTPPFinish_Web(e) {
        const re_event_RECreateTPPFinish = new CustomEvent('RECreateTPPFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_RECreateTPPFinish);
    }

    function RECADCommentDrawFinish_Web(e) {
        let commentData = e.detail;
        if (e.detail.canvasid.length) {
            const _style = e.detail.style;
            switch (_style) {
                case 4:
                    commentData.style = 2;
                    break;
                case 5:
                    commentData.style = 3;
                    break;
                case 7:
                    commentData.style = 4;
                    break;
                default:
                    break;
            }
        }
        const re_event_RECADCommentDrawFinish = new CustomEvent('RECADCommentDrawFinish', {
            detail: commentData,
        });
        document.dispatchEvent(re_event_RECADCommentDrawFinish);
    }

    function RECalcHeightRangeFinish_Web(e) {
        const re_event_RECalcHeightRangeFinish = new CustomEvent('RECalcHeightRangeFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_RECalcHeightRangeFinish);
    }

    function RECADSwitchLayoutFinished_Web(e) {
        const re_event_RECADSwitchLayoutFinished = new CustomEvent('RECADSwitchLayoutFinished', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_RECADSwitchLayoutFinished);
    }

    function RESystemKeyDown_Web(e) {
        const re_event_RESystemKeyDown = new CustomEvent('RESystemKeyDown', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_RESystemKeyDown);
    }

    function REAddWaterRgnFinish_Web(e) {
        const re_event_REAddWaterRgnFinish = new CustomEvent('REAddWaterRgnFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAddWaterRgnFinish);
    }

    function REAddWaterRgnCheck_Web(e) {
        const re_event_REAddWaterRgnCheck = new CustomEvent('REAddWaterRgnCheck', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAddWaterRgnCheck);
    }

    function REEditWaterFinish_Web(e) {
        const re_event_REEditWaterFinish = new CustomEvent('REEditWaterFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REEditWaterFinish);
    }

    function REAddExtrudeRgnFinish_Web(e) {
        const re_event_REAddExtrudeRgnFinish = new CustomEvent('REAddExtrudeRgnFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAddExtrudeRgnFinish);
    }

    function REAddExtrudeRgnCheck_Web(e) {
        const re_event_REAddExtrudeRgnCheck = new CustomEvent('REAddExtrudeRgnCheck', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAddExtrudeRgnCheck);
    }

    function REEditExtrudeFinish_Web(e) {
        const re_event_REEditExtrudeFinish = new CustomEvent('REEditExtrudeFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REEditExtrudeFinish);
    }

    function REAddMonomerRgnFinish_Web(e) {
        const re_event_REAddMonomerRgnFinish = new CustomEvent('REAddMonomerRgnFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAddMonomerRgnFinish);
    }

    function REAddMonomerRgnCheck_Web(e) {
        const re_event_REAddMonomerRgnCheck = new CustomEvent('REAddMonomerRgnCheck', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAddMonomerRgnCheck);
    }

    function REEditMonomerFinish_Web(e) {
        const re_event_REEditMonomerFinish = new CustomEvent('REEditMonomerFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REEditMonomerFinish);
    }

    function REEditShpFinish_Web(e) {
        const re_event_REEditShpFinish = new CustomEvent('REEditShpFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REEditShpFinish);
    }

    function REAddShpRgnFinish_Web(e) {
        const re_event_REAddShpRgnFinish = new CustomEvent('REAddShpRgnFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAddShpRgnFinish);
    }

    function REShpClipFinish_Web(e) {
        const re_event_REShpClipFinish = new CustomEvent('REShpClipFinish', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REShpClipFinish);
    }

    function REAddShpRgnCheck_Web(e) {
        const re_event_REAddShpRgnCheck = new CustomEvent('REAddShpRgnCheck', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REAddShpRgnCheck);
    }

    function REShpAddClipFace_Web(e) {
        const re_event_REShpAddClipFace = new CustomEvent('REShpAddClipFace', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REShpAddClipFace);
    }

    function REPanLocateCam_Web(e) {
        const re_event_REPanLocateCam = new CustomEvent('REPanLocateCam', {
            detail: e.detail,
        });
        document.dispatchEvent(re_event_REPanLocateCam);
    }

    // MARK 基础
    /**
     * 添加一个HTTP路径授权信息
     * @param {String} identifyName //表示信息的逻辑标识名（默认 RealEngineInitAuthorPath ）
     * @param {string} filePath //授权文件路径
     */
    Module.addAuthorPath = function (identifyName, filePath) {
        if (!checkTypeLog(identifyName, 'identifyName', RE_Enum.RE_Check_String)) return;
        if (!checkTypeLog(filePath, 'filePath', RE_Enum.RE_Check_String)) return;
        return Module.RealBIMWeb.AddAURLPathCtrl_AuthorPath(identifyName, filePath);
    };

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
    };

    /**
     * 添加一个URL自定义参数字段信息
     * @param {String} urlWildcard //表示要匹配的URL通配符
     * @param {String} paramStr //表示匹配的URL需要添加的自定义参数字段 字符串
     */
    Module.addUrlExtParam = function (urlWildcard, paramStr) {
        return Module.RealBIMWeb.AddAURLExtParam(urlWildcard, paramStr);
    };

    /**
     * 删除所有的URL自定义参数字段信息
     */
    Module.delAllURLExtParams = function () {
        Module.RealBIMWeb.DelAllURLExtParams();
    };

    /**
     * 添加一个URL自定义请求头信息
     * @param {String} urlWildcard //表示要匹配的URL通配符
     * @param {String} headerStr //表示匹配的URL需要添加的自定义请求头 字符串 "HeaderName0:HeaderValue0|HeaderName1:HeaderValue1|..."
     */
    Module.addUrlExtHeader = function (urlWildcard, headerStr) {
        return Module.RealBIMWeb.AddAURLExtHeader(urlWildcard, headerStr);
    };

    /**
     * 删除所有的URL自定义请求头信息
     */
    Module.delAllURLExtHeaders = function () {
        Module.RealBIMWeb.DelAllURLExtHeaders();
    };

    /**
     * 释放引擎所占用的浏览器资源
     * @param {Boolean} clearWebWorker //是否同步清除已创建的webWorker
     */
    Module.releaseEngine = function (clearWebWorker) {
        var _bClearWebWorker = false;
        if (!isEmpty(clearWebWorker)) _bClearWebWorker = clearWebWorker;
        Module.RealBIMWeb.ReleaseEmuMgr(_bClearWebWorker);
        //释放显存
        if (typeof Module.ctx != 'undefined') {
            if (Module.ctx.getExtension('WEBGL_lose_context') != null) {
                Module.ctx.getExtension('WEBGL_lose_context').loseContext();
            }
        }
        removeEventListener();
    };

    /**
     * 获取当前SDK版本
     */
    Module.getVersion = function () {
        return Module.RealBIMWeb.GetRealEngineVersion();
    };

    /**
     * 暂停渲染主循环
     */
    Module.pauseRenderLoop = function () {
        Module.RealBIMWeb.PauseRenderLoop();
    };

    /**
     * 恢复渲染主循环
     */
    Module.resumeRenderLoop = function () {
        Module.RealBIMWeb.ResumeRenderLoop();
    };

    // MARK 效果展示
    /**
     * 设置窗口的显示模式，此接口适用于需要双屏显示，以及需要单双屏切换的应用场景。
     * @param {REVpTypeEm} viewport0 //第0个视图要显示的场景内容 REVpTypeEm 枚举类型
     * @param {REVpTypeEm} viewport1 //第1个视图要显示的场景内容 REVpTypeEm 枚举类型
     * @param {REVpRankEm} screenMode //视图0与视图1在屏幕上的排列方式 REVpRankEm 枚举类型
     */
    Module.setViewMode = function (viewport0, viewport1, screenMode) {
        Module.RealBIMWeb.SetViewMode(viewport0, viewport1, screenMode);
    };

    /**
     * 设置360相机与BIM相机是否同步
     * @param {Boolean} isSync //是否同步
     */
    Module.setViewSyn = function (isSync) {
        Module.RealBIMWeb.SetViewSyn(isSync);
    };

    /**
     * 获取当前设置的360相机与BIM相机是否同步状态
     */
    Module.getViewSyn = function () {
        return Module.RealBIMWeb.GetViewSyn();
    };

    /**
     * 生成屏幕快照
     */
    Module.getScreenSnapshot = function () {
        return Module.canvas.toDataURL();
    };

    // MARK 操作
    /**
     * 获取鼠标是否翻转了左右相机拖动键操作
     */
    Module.getCamRevLR = function () {
        return Module.RealBIMWeb.GetCamRevLR();
    };

    /**
     * 设置是否翻转鼠标左右相机拖动键操作行为
     * @param {Boolean} reverseLR //是否翻转
     */
    Module.setCamRevLR = function (reverseLR) {
        Module.RealBIMWeb.SetCamRevLR(reverseLR);
    };

    /**
     * 获取是否允许ESC键退出测量/剖切操作
     */
    Module.getEscKeyExitOpEnable = function () {
        return Module.RealBIMWeb.EscKeyExitOpEnable();
    };

    /**
     * 设置是否允许ESC键退出测量/剖切操作
     * @param {Boolean} enable //是否允许
     */
    Module.setEscKeyExitOpEnable = function (enable) {
        Module.RealBIMWeb.SetEscKeyExitOpEnable(enable);
    };

    /**
     * 设置当前的操作模式
     * @param {Number} operationMode //模式类型 0:鼠标操作操作 1:触控操作
     */
    Module.setOperationMode = function (operationMode) {
        var _operationMode = Module.RE_INPUT_TYPE.MOUSE;
        if (!isEmpty(operationMode)) _operationMode = operationMode == 0 ? Module.RE_INPUT_TYPE.MOUSE : Module.RE_INPUT_TYPE.TOUCH;
        Module.RealBIMWeb.SetInputType(_operationMode);
    };

    //获取当前的操作模式(0:鼠标操作操作 1:触控操作)
    Module.getOperationMode = function () {
        var _type = Module.RealBIMWeb.GetInputType();
        return _type == Module.RE_INPUT_TYPE.MOUSE ? 0 : 1;
    };

    /**
     * 设置鼠标中键按下对应的相机操作
     * @param {Number} operationMode //模式类型  -1:相机空闲模式 0:相机围绕选择点旋转 1:相机以视点为中心旋转视角 2:相机平移
     */
    Module.setCamModeOnMidBtnDown = function (operationMode) {
        if (isEmpty(operationMode)) operationMode = 0;
        var _operationMode = Module.RE_CAM_MODE.M_ROT_AROUND;
        if (operationMode == -1) _operationMode = Module.RE_CAM_MODE.M_IDLE;
        if (operationMode == 0) _operationMode = Module.RE_CAM_MODE.M_ROT_AROUND;
        if (operationMode == 1) _operationMode = Module.RE_CAM_MODE.M_ROT_CAMERA;
        if (operationMode == 2) _operationMode = Module.RE_CAM_MODE.M_DRAG_MOVE;
        Module.RealBIMWeb.SetCamModeOnMidBtnDown(_operationMode);
    };

    //获取鼠标中键按下对应的相机操作
    Module.getCamModeOnMidBtnDown = function () {
        var _type = Module.RealBIMWeb.GetCamModeOnMidBtnDown();
        let numType = 0;
        if (_type == Module.RE_CAM_MODE.M_IDLE) numType = -1;
        if (_type == Module.RE_CAM_MODE.M_ROT_AROUND) numType = 0;
        if (_type == Module.RE_CAM_MODE.M_ROT_CAMERA) numType = 1;
        if (_type == Module.RE_CAM_MODE.M_DRAG_MOVE) numType = 2;
        return numType;
    };

    /**
     * 设置鼠标左键按下对应的相机操作
     * @param {Number} operationMode //模式类型  -1:相机空闲模式 0:相机围绕选择点旋转 1:相机以视点为中心旋转视角 2:相机平移
     */
    Module.setCamModeOnLeftBtnDown = function (operationMode) {
        if (isEmpty(operationMode)) operationMode = 2;
        var _operationMode = Module.RE_CAM_MODE.M_DRAG_MOVE;
        if (operationMode == -1) _operationMode = Module.RE_CAM_MODE.M_IDLE;
        if (operationMode == 0) _operationMode = Module.RE_CAM_MODE.M_ROT_AROUND;
        if (operationMode == 1) _operationMode = Module.RE_CAM_MODE.M_ROT_CAMERA;
        if (operationMode == 2) _operationMode = Module.RE_CAM_MODE.M_DRAG_MOVE;
        Module.RealBIMWeb.SetCamModeOnLBtnDown(_operationMode);
    };

    //获取鼠标左键按下对应的相机操作
    Module.getCamModeOnLeftBtnDown = function () {
        var _type = Module.RealBIMWeb.GetCamModeOnLBtnDown();
        let numType = 2;
        if (_type == Module.RE_CAM_MODE.M_IDLE) numType = -1;
        if (_type == Module.RE_CAM_MODE.M_ROT_AROUND) numType = 0;
        if (_type == Module.RE_CAM_MODE.M_ROT_CAMERA) numType = 1;
        if (_type == Module.RE_CAM_MODE.M_DRAG_MOVE) numType = 2;
        return numType;
    };

    /**
     * 设置鼠标右键按下对应的相机操作
     * @param {Number} operationMode //模式类型  -1:相机空闲模式 0:相机围绕选择点旋转 1:相机以视点为中心旋转视角 2:相机平移
     */
    Module.setCamModeOnRightBtnDown = function (operationMode) {
        if (isEmpty(operationMode)) operationMode = 1;
        var _operationMode = Module.RE_CAM_MODE.M_ROT_CAMERA;
        if (operationMode == -1) _operationMode = Module.RE_CAM_MODE.M_IDLE;
        if (operationMode == 0) _operationMode = Module.RE_CAM_MODE.M_ROT_AROUND;
        if (operationMode == 1) _operationMode = Module.RE_CAM_MODE.M_ROT_CAMERA;
        if (operationMode == 2) _operationMode = Module.RE_CAM_MODE.M_DRAG_MOVE;
        Module.RealBIMWeb.SetCamModeOnRBtnDown(_operationMode);
    };

    //获取鼠标右键按下对应的相机操作
    Module.getCamModeOnRightBtnDown = function () {
        var _type = Module.RealBIMWeb.GetCamModeOnRBtnDown();
        let numType = 1;
        if (_type == Module.RE_CAM_MODE.M_IDLE) numType = -1;
        if (_type == Module.RE_CAM_MODE.M_ROT_AROUND) numType = 0;
        if (_type == Module.RE_CAM_MODE.M_ROT_CAMERA) numType = 1;
        if (_type == Module.RE_CAM_MODE.M_DRAG_MOVE) numType = 2;
        return numType;
    };

    /**
     * 设置Ctrl+点选已选构件模式
     * @param {Number} operationMode //模式类型 0:反选构件 1:穿透构件
     */
    Module.setCtrlSelectedMode = function (operationMode) {
        var _operationMode = 0;
        if (!isEmpty(operationMode)) _operationMode = operationMode == 0 ? 0 : 1;
        Module.RealBIMWeb.SetCtrlSelectedMode(_operationMode);
    };

    //获取Ctrl+点选已选构件模式
    Module.getCtrlSelectedMode = function () {
        return Module.RealBIMWeb.GetCtrlSelectedMode();
    };

    /**
     * 设置相机操作固定中心点
     * @param {dvec3} centerPos //中心点坐标 [x,y,z]
     * @param {Boolean} enable //是否生效（默认有效）
     */
    Module.setCamFixCenterPos = function (centerPos, enable) {
        let _enable = isEmpty(enable) ? true : enable;
        Module.RealBIMWeb.SetFixCamProbePos(_enable, centerPos);
    };

    //获取相机操作固定中心点是否生效
    Module.getCamFixCenterPosEnable = function () {
        return Module.RealBIMWeb.GetIsFixCamProbePos();
    };

    /**
     * 设置屏幕的虚拟旋转
     * @param {Number} rotateType //旋转类型 0: 0度 1: 顺时针90度 2: 顺时针180度 3: 顺时针270度
     */
    Module.setScreenVirRotate = function (rotateType) {
        let _rotateType = isEmpty(rotateType) ? 0 : rotateType;
        Module.RealBIMWeb.SetScreenVirRot(_rotateType);
    };

    /**
     * 获取屏幕的虚拟旋转类型
     */
    Module.getScreenVirRotate = function () {
        return Module.RealBIMWeb.GetScreenVirRot();
    };

    /**
     * 获取当前的交互操作状态
     */
    Module.getCurInteractState = function () {
        const strState = Module.RealBIMWeb.GetCurState();
        return REInteractStateEm[strState];
    };

    // MOD-- 公共模块（Common） <---
    Module.Common = typeof Module.Common !== 'undefined' ? Module.Common : {}; //增加 Common 模块
    class REColor {
        //颜色公共模型
        constructor(red, green, blue, alpha) {
            this.red = !isEmpty(red) ? red : 255; //红色
            this.green = !isEmpty(green) ? green : 255; //绿色
            this.blue = !isEmpty(blue) ? blue : 255; //蓝色
            this.alpha = !isEmpty(alpha) ? alpha : 255; //透明度
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
    };

    /**
     * 获取渲染时引擎最大允许的内存占用空间(以MB为单位)
     */
    Module.Common.getMaxResMemMB = function () {
        return Module.RealBIMWeb.GetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK);
    };

    /**
     * 设置渲染时引擎建议分配的内存空间(以MB为单位)
     * @param {Number} size //显存占用空间值(以MB为单位)
     */
    Module.Common.setExpectMaxInstMemMB = function (size) {
        Module.RealBIMWeb.SetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, size);
    };

    /**
     * 获取渲染时引擎建议分配的内存空间(以MB为单位)
     */
    Module.Common.getExpectMaxInstMemMB = function () {
        return Module.RealBIMWeb.GetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
    };

    /**
     * 设置模型每帧最大渲染面数
     * @param {Number} size //每帧渲染的面数
     */
    Module.Common.setExpectMaxInstDrawFaceNum = function (size) {
        Module.RealBIMWeb.SetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, size);
    };

    /**
     * 获取模型每帧最大渲染面数
     */
    Module.Common.getExpectMaxInstDrawFaceNum = function () {
        return Module.RealBIMWeb.GetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
    };

    /**
     * 设置模型最大纹理组拼接纹理尺寸
     * @param {Number} size //最大纹理组拼接纹理尺寸
     */
    Module.Common.setMaxTexGroupAtlasSize = function (size) {
        Module.RealBIMWeb.SetMaxHugeTexGroupAtlasSize(size);
    };

    /**
     * 获取模型最大纹理组拼接纹理尺寸
     */
    Module.Common.getMaxTexGroupAtlasSize = function () {
        return Module.RealBIMWeb.GetMaxHugeTexGroupAtlasSize();
    };

    /**
     * 设置页面调度等级
     * @param {Number} level //页面调度等级
     */
    Module.Common.setPageLoadLev = function (level) {
        Module.RealBIMWeb.SetPageLoadLev(level);
    };

    /**
     * 获取页面调度等级
     */
    Module.Common.getPageLoadLev = function () {
        return Module.RealBIMWeb.GetPageLoadLev();
    };

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
    };

    /**
     * 获取每帧允许的最大资源加载总数
     */
    Module.Common.getTotalResMaxLoadNum = function () {
        return Module.RealBIMWeb.GetTotalResMaxLoadNumPerFrame();
    };

    /**
     * 设置网络资源加载是否使用缓存
     * @param {Number} isUse //使用缓存状态
     */
    Module.Common.setUseWebCache = function (isUse) {
        Module.RealBIMWeb.SetUseWebCache(isUse);
    };

    /**
     * 获取网络资源加载是否使用缓存
     */
    Module.Common.getUseWebCache = function () {
        return Module.RealBIMWeb.GetUseWebCache();
    };

    // MARK 渲染效果

    /**
     * 设置边缘高光效果的启用状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setBorderEmisEnable = function (enable) {
        Module.RealBIMWeb.SetHugeModelBorderEmisEnable(enable);
    };

    /**
     * 获取边缘高光效果的启用状态
     */
    Module.Common.getBorderEmisEnable = function () {
        return Module.RealBIMWeb.GetHugeModelBorderEmisEnable();
    };

    /**
     * 设置阴影开关状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setShadowState = function (enable) {
        var sinfo = Module.RealBIMWeb.GetSceShadowInfo();
        sinfo.m_bShadowEnable = enable;
        Module.RealBIMWeb.SetSceShadowInfo(sinfo);
    };

    /**
     * 获取当前阴影开关状态
     */
    Module.Common.getShadowState = function () {
        var shadowinfo = Module.RealBIMWeb.GetSceShadowInfo();
        return shadowinfo.m_bShadowEnable;
    };

    /**
     * 设置场景光晕开关状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setGhostState = function (enable) {
        var sinfo = Module.RealBIMWeb.GetSceLightInfo();
        if (enable) {
            sinfo.m_fGhostAmp = 0.5;
        } else {
            sinfo.m_fGhostAmp = 0;
        }
        Module.RealBIMWeb.SetSceLightInfo(sinfo);
    };

    /**
     * 获取当前场景光晕开关状态
     */
    Module.Common.getGhostState = function () {
        var ghostinfo = Module.RealBIMWeb.GetSceLightInfo();
        var _info = ghostinfo.m_fGhostAmp == 0 ? false : true;
        return _info;
    };

    /**
     * 设置场景环境遮蔽开关状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setAOState = function (enable) {
        var _info = Module.RealBIMWeb.GetSceAOInfo();
        if (enable) {
            _info.m_fMinLum = 0.1;
        } else {
            _info.m_fMinLum = 1.0;
        }
        Module.RealBIMWeb.SetSceAOInfo(_info);
    };

    /**
     * 获取当前场景环境遮蔽开关状态
     */
    Module.Common.getAOState = function () {
        var _info = Module.RealBIMWeb.GetSceAOInfo();
        return _info.m_fMinLum < 0.999 ? true : false;
    };

    class RESceAOInfo {
        //场景环境遮蔽信息
        constructor() {
            this.quality = 1; //表示环境遮蔽的质量等级(0->残影多，效率高；1->残影少，效率低)
            this.minLum = 0.1; //表示环境遮挡后的最小环境亮度系数(0~1)，若大于等于1则表示关闭环境遮挡效果
            this.cornerExpectAO = 0.9; //表示在模型直角褶皱处的期望被遮挡强度(0~1)
            this.sampRadius = 1.0; //表示环境遮挡的随机采样点在世界空间下的基准半径
            this.sampRadiusTrans = [0.0, 0.144337565]; //表示环境遮挡的随机采样点基准半径随相机距离的自动缩放系数
        }
    }
    ExtModule.RESceAOInfo = RESceAOInfo;

    /**
     * 设置场景环境遮蔽信息
     * @param {RESceAOInfo} sceAOInfo //场景环境遮蔽信息 (RESceAOInfo 类型)
     */
    Module.Common.setSceAOInfo = function (sceAOInfo) {
        if (isEmptyLog(sceAOInfo, 'sceAOInfo')) return;
        let _cInfo = {
            m_uQuality: isEmpty(sceAOInfo.quality) ? 1 : sceAOInfo.quality,
            m_fMinLum: isEmpty(sceAOInfo.minLum) ? 0.1 : sceAOInfo.minLum,
            m_fCornerExpectAO: isEmpty(sceAOInfo.cornerExpectAO) ? 0.9 : sceAOInfo.cornerExpectAO,
            m_fSampRadius: isEmpty(sceAOInfo.sampRadius) ? 1.0 : sceAOInfo.sampRadius,
            m_vSampRadiusTrans: isEmpty(sceAOInfo.sampRadiusTrans) ? [0.0, 0.144337565] : sceAOInfo.sampRadiusTrans,
        };
        Module.RealBIMWeb.SetSceAOInfo(_cInfo);
    };

    /**
     * 获取场景环境遮蔽信息
     */
    Module.Common.getSceAOInfo = function () {
        var _info = Module.RealBIMWeb.GetSceAOInfo();
        let _sceAOInfo = new Module.RESceAOInfo();
        _sceAOInfo.quality = _info.m_uQuality;
        _sceAOInfo.minLum = _info.m_fMinLum;
        _sceAOInfo.cornerExpectAO = _info.m_fCornerExpectAO;
        _sceAOInfo.sampRadius = _info.m_fSampRadius;
        _sceAOInfo.sampRadiusTrans = _info.m_vSampRadiusTrans;
        return _sceAOInfo;
    };

    /**
     * 设置场景实时反射开关状态
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setReflState = function (enable) {
        var _info = Module.RealBIMWeb.GetSceReflInfo();
        if (enable) {
            _info.m_uQuality = 1;
        } else {
            _info.m_uQuality = 0;
        }
        Module.RealBIMWeb.SetSceReflInfo(_info);
    };

    /**
     * 获取当前场景实时反射开关状态
     */
    Module.Common.getReflState = function () {
        var _info = Module.RealBIMWeb.GetSceReflInfo();
        return _info.m_uQuality > 0 ? true : false;
    };

    /**
     * 设置场景模型的OIT渲染等级
     * @param {Boolean} level //等级(0->关闭OIT；1->模型开启)
     */
    Module.Common.setSceOITLev = function (level) {
        Module.RealBIMWeb.SetSceOITLev(level);
    };

    /**
     * 获取场景模型的OIT渲染等级
     */
    Module.Common.getSceOITLev = function () {
        return Module.RealBIMWeb.GetSceOITLev();
    };

    /**
     * 设置场景矢量的OIT渲染等级
     * @param {Boolean} level //等级(0->关闭OIT；1->矢量OIT等级1；2->矢量OIT等级2；3->矢量OIT等级3)
     */
    Module.Common.setShpOITLev = function (level) {
        Module.RealBIMWeb.SetShpOITLev(level);
    };

    /**
     * 获取场景矢量的OIT渲染等级
     */
    Module.Common.getShpOITLev = function () {
        return Module.RealBIMWeb.GetShpOITLev();
    };

    /**
     * 获取当前的渲染元素属性状态数据
     */
    Module.Common.getCurRenderStateData = function () {
        return new Uint8Array(Module.RealBIMWeb.GetSysRenderState());
    };

    /**
     * 根据元素属性状态数据设置当前渲染的属性状态
     * @param {Uint8Array} renderData //渲染的元素属性状态数据
     */
    Module.Common.setCurRenderStateData = function (renderData) {
        var strrenderdata = renderData.byteLength.toString();
        Module.RealBIMWeb.ReAllocHeapViews(strrenderdata);
        data = Module.RealBIMWeb.GetHeapView_U8(0);
        data.set(renderData, 0);
        Module.RealBIMWeb.SetSysRenderState(data.byteLength, data.byteOffset);
    };

    class REShadowInfo {
        constructor() {
            this.enable = null; //表示是否启用阴影效果
            this.quality = null; //表示阴影质量等级(0~5)
            this.dynSMSize = null; //表示动态阴影图的尺寸
            this.staticSMSize = null; //表示静态阴影图的尺寸
            this.maxDynSMNum = null; //表示动态阴影图的最大个数
            this.maxStaticSMNum = null; //表示静态阴影图的最大个数
            this.minDynSMUpdateLen = null; //表示动态阴影图的最小更新帧间隔
            this.minStaticSMUpdateLen = null; //表示静态阴影图的最小更新帧间隔
            this.hiResoDist = null; //表示最高精度阴影的作用距离
            this.filterKernelSize = null; //表示软阴影的过滤半径相对于阴影图一个纹素尺寸的倍数
            this.depthBiasRatio = null; //表示阴影深度的偏移比例(用以消除自阴影)
        }
    }
    ExtModule.REShadowInfo = REShadowInfo;

    /**
     * 设置阴影详细信息
     * @param {REShadowInfo} shadowInfo //阴影信息 (REShadowInfo 类型)
     */
    Module.Common.setShadowInfo = function (shadowInfo) {
        if (isEmptyLog(shadowInfo)) return;
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
    };

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
    };

    /**
     * 获取整个场景的包围盒（BIM + Grid）
     */
    Module.Common.getSceBV = function () {
        var gridBV = Module.RealBIMWeb.GetUnVerHugeGroupBoundingBox('', '');
        var bimBV = Module.RealBIMWeb.GetHugeObjBoundingBox('', '');

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
    };

    /**
     * 设置自定义场景包围盒 注：影响右侧viewcube作用范围
     * @param {Array} arrBound //包围盒范围，[Xmin, Xmax, Ymin, Ymax, Zmin, Zmax]
     * @param {Boolean} enable //是否有效（默认有效）
     */
    Module.Common.setSceCustomBV = function (arrBound, enable) {
        let _enable = isEmpty(enable) ? true : enable;
        let _arrBound = [
            [0, 0, 0],
            [0, 0, 0],
        ];
        if (_enable) {
            _arrBound = [
                [arrBound[0], arrBound[2], arrBound[4]],
                [arrBound[1], arrBound[3], arrBound[5]],
            ];
        }
        Module.RealBIMWeb.SetSceCustomBV(_arrBound);
    };

    /**
     * 获取自定义场景包围盒
     */
    Module.Common.getSceCustomBV = function () {
        let _bvTemp = Module.RealBIMWeb.GetSceCustomBV();
        var aabbList = [];
        aabbList.push(_bvTemp[0][0]); //Xmin
        aabbList.push(_bvTemp[1][0]); //Xmax
        aabbList.push(_bvTemp[0][1]); //Ymin
        aabbList.push(_bvTemp[1][1]); //Ymax
        aabbList.push(_bvTemp[0][2]); //Zmin
        aabbList.push(_bvTemp[1][2]); //Zmax
        return aabbList;
    };

    /**
     * 设置场景是否进入伪球面模式
     * @param {Boolean} enable //是否开启
     */
    Module.Common.setFakeSphMode = function (enable) {
        if (enable) Module.Coordinate.setEngineWorldCRS('EPSG:3857'); //球面模式目前只支持EPSG:3857
        Module.RealBIMWeb.SetFakeSphMode(enable);
        Module.RealBIMWeb.SetSkyAtmFogAmp(enable ? 1.0 : 0.0);
    };

    /**
     * 获取场景是否进入伪球面模式
     */
    Module.Common.getFakeSphMode = function () {
        return Module.RealBIMWeb.GetFakeSphMode();
    };

    /**
     * 设置场景(环境光/方向光)光强的调节系数
     * @param {dvec2} coefficientRange //系数范围，二维数组 【背光面的强度，向光面的强度】，默认值【1, 1】
     */
    Module.Common.setSceLightAttenu = function (coefficientRange) {
        Module.RealBIMWeb.SetSceLightAttenu(coefficientRange);
    };

    /**
     * 获取置场景(环境光/方向光)光强的调节系数
     */
    Module.Common.getSceLightAttenu = function () {
        return Module.RealBIMWeb.GetSceLightAttenu();
    };

    /**
     * 设置矢量被不透明物体遮蔽的区域是否使用点阵图 注：锚点、标签的矢量元素不受该接口影响
     * @param {Boolean} enable //是否使用点阵图
     */
    Module.Common.setShpCoverDottedEnable = function (enable) {
        Module.RealBIMWeb.SetShpCoverDottedEnable(enable);
    };

    /**
     * 获取矢量被不透明物体遮蔽的区域是否使用点阵图
     */
    Module.Common.getShpCoverDottedEnable = function () {
        return Module.RealBIMWeb.GetShpCoverDottedEnable();
    };

    // MARK 字体

    class REFontInfo {
        constructor() {
            this.fontId = null; //自定义的全局字体的id，不可重复
            this.width = null; //字体的宽
            this.height = null; //字体的高
            this.weight = 0; //字体的粗细，0表示默认粗细； ==0：原始粗细，<0：文字变细，>0：文字变粗
            this.antiAliasing = false; //抗锯齿
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
            m_bAntialiased: isEmpty(fontInfo.antiAliasing) ? false : fontInfo.antiAliasing,
            m_fItalicRatio: 0,
            m_sSilhouetteAmp: -64,
            m_sWeightAmp: fontInfo.weight * 64,
            m_uHeight: fontInfo.height,
            m_uWidth: fontInfo.width,
            m_strFontType: '宋体',
            m_strGolFontID: fontInfo.fontId.toString(),
            m_strTexAtlasName: '',
        };
        return Module.RealBIMWeb.AddAGolFont(_fontinfo);
    };

    /**
     * 获取一种全局字体信息
     * @param {String} fontId //字体id
     */
    Module.Common.getGolFont = function (fontId) {
        if (isEmptyLog(fontId, 'fontId')) return;
        var _golfontInfo = Module.RealBIMWeb.GetAGolFont(fontId.toString());
        var fontInfo = new REFontInfo();
        fontInfo.fontId = _golfontInfo.m_strGolFontID;
        fontInfo.width = _golfontInfo.m_uWidth;
        fontInfo.height = _golfontInfo.m_uHeight;
        fontInfo.weight = _golfontInfo.m_sWeightAmp / 64;
        fontInfo.antiAliasing = _golfontInfo.m_bAntialiased;
        fontInfo.fontType = _golfontInfo.m_strFontType;
        return fontInfo;
    };

    /**
     * 删除一种全局字体
     * @param {String} fontId //字体id
     */
    Module.Common.delGolFont = function (fontId) {
        if (isEmptyLog(fontId, 'fontId')) return;
        return Module.RealBIMWeb.DelAGolFont(fontId.toString());
    };

    /**
     * 获取全局字体数量
     */
    Module.Common.getGolFontNum = function () {
        return Module.RealBIMWeb.GetGolFontNum();
    };

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
            fontInfo.width = _fontInfo.m_uWidth;
            fontInfo.height = _fontInfo.m_uHeight;
            fontInfo.weight = _fontInfo.m_sWeightAmp / 64;
            fontInfo.antiAliasing = _fontInfo.m_bAntialiased;
            fontInfo.fontType = _fontInfo.m_strFontType;
            fontInfoList.push(fontInfo);
        }
        return fontInfoList;
    };

    // MOD-- 灯光（Light） <---
    Module.Light = typeof Module.Light !== 'undefined' ? Module.Light : {}; //增加 Light 模块

    // MARK 聚光灯
    class RESpotLightInfo {
        constructor() {
            this.lightId = null; //表示光源的唯一标识名
            this.selfRotate = [1, 0, 0, 0]; //表示光源的自身旋转分量
            this.selfOffset = [0, 0, 0]; //表示光源的坐标点
            this.lightClr = new REColor(255, 255, 255); //表示光源的颜色 （REColor 类型）, 无法修改透明度
            this.brightness = 100.0; //表示光源的亮度
            this.emissionBodyRadius = 0.2; //表示光源的发光体半径，相同亮度在反射效果下发光体半径越大，反射光效果越发散，反之越聚集
            this.influenceRange = 15; //表示光源的最大影响半径（影响半径会受亮度影响衰减效果，暂不暴露给用户，以公式方式自动填入）
            this.openAngle = 180.0; //表示聚光灯相对于自身局部空间下-Z轴的开合角度(单位为角度0~180，以-z轴向两边分别打开的角度，180即为两边打开的360度点光源)，默认180度
            this.fadeAngle = 30.0; //表示聚光灯相对于自身局部空间下-Z轴的开合角度后的衰减角度(单位为角度0~180)，默认30度
            this.hasShadow = false; //是否需要阴影
        }
    }
    ExtModule.RESpotLightInfo = RESpotLightInfo;

    /**
     * 添加一组聚光灯
     * @param {String} dataSetId //聚光灯所属的数据集标识，为空串则表示为全局聚光灯
     * @param {Array} spotLights //聚光灯信息集合 （RESpotLightInfo 类型）
     */
    Module.Light.addSpotLights = function (dataSetId, spotLights) {
        // Module.Light.addSpotLights = function (dataSetId, spotLights, bLocalSpace) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return false;
        if (isEmpty(spotLights) || !spotLights.length) {
            logParErr('spotLights');
            return false;
        }

        let vector_SPOT_INFO = new Module.RE_Vector_SPOT_INFO();
        for (let i = 0; i < spotLights.length; i++) {
            const element = spotLights[i];
            if (isEmpty(element.lightId) || !element.lightId.length) {
                logParErr('lightId');
                return false;
            }
            // 根据亮度自动处理最大影响半径（栋哥推荐以亮度为100，最大影响半径为15的比例进行计算，即亮度为100的X倍对应的最大影响半径为15的X的开平方）
            let _influenceRange = isEmpty(element.influenceRange) ? 15 : element.influenceRange;
            if (isEmpty(element.influenceRange)) {
                _influenceRange = 15 * Math.sqrt((isEmpty(element.brightness) ? 100.0 : element.brightness) / 100);
            }
            let spot_info = {
                m_strName: element.lightId,
                m_qSelfRotate: isEmpty(element.selfRotate) ? [1, 0, 0, 0] : element.selfRotate,
                m_vSelfOffset: isEmpty(element.selfOffset) ? [0, 0, 0] : element.selfOffset,
                m_vClr: isEmpty(element.lightClr)
                    ? new REColor(255, 255, 255)
                    : [
                          Math.round(element.lightClr.red) / 255.0,
                          Math.round(element.lightClr.green) / 255.0,
                          Math.round(element.lightClr.blue) / 255.0,
                      ],
                m_fLum: isEmpty(element.brightness) ? 100.0 : element.brightness,
                m_fBodyRadius: isEmpty(element.emissionBodyRadius) ? 0.2 : element.emissionBodyRadius,
                m_fRange: _influenceRange,
                m_fOpenAngle: isEmpty(element.openAngle) ? 180.0 : element.openAngle,
                m_fFadeAngle: isEmpty(element.fadeAngle) ? 30.0 : element.fadeAngle,
                m_uShadowFreq: isEmpty(element.hasShadow) || !element.hasShadow ? 0xffffffff : 1,
                m_uShadowMask: 0x00ffffff,
            };
            vector_SPOT_INFO.push_back(spot_info);
        }
        return Module.RealBIMWeb.AddSpotLights(dataSetId, vector_SPOT_INFO, dataSetId === '' ? false : true);
        // return Module.RealBIMWeb.AddSpotLights(dataSetId, vector_SPOT_INFO, bLocalSpace);
    };

    /**
     * 获取聚光灯信息
     * @param {String} dataSetId //聚光灯所属的数据集标识，为空串则表示为全局聚光灯
     * @param {String} lightId //表示光源的标识名
     */
    Module.Light.getSpotLightInfo = function (dataSetId, lightId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return false;
        if (isEmpty(lightId) || !lightId.length) {
            logParErr('lightId');
            return false;
        }

        let _cSpotLightInfo = Module.RealBIMWeb.GetSpotLightInfo(dataSetId, lightId, dataSetId === '' ? false : true);
        if (
            _cSpotLightInfo.m_qSelfRotate[0] === 0 &&
            _cSpotLightInfo.m_qSelfRotate[1] === 0 &&
            _cSpotLightInfo.m_qSelfRotate[2] === 0 &&
            _cSpotLightInfo.m_qSelfRotate[3] === 0
        ) {
            return null;
        }
        let spot_info = new RESpotLightInfo();
        spot_info.lightId = _cSpotLightInfo.m_strName;
        spot_info.selfRotate = _cSpotLightInfo.m_qSelfRotate;
        spot_info.selfOffset = _cSpotLightInfo.m_vSelfOffset;
        spot_info.lightClr = new REColor(
            Math.round(_cSpotLightInfo.m_vClr[0] * 255),
            Math.round(_cSpotLightInfo.m_vClr[1] * 255),
            Math.round(_cSpotLightInfo.m_vClr[2] * 255)
        );
        spot_info.brightness = _cSpotLightInfo.m_fLum;
        spot_info.emissionBodyRadius = _cSpotLightInfo.m_fBodyRadius;
        // spot_info.influenceRange = _cSpotLightInfo.m_fRange; // 暂时只让用户设置亮度，最大影响范围自动设置，但用户可以直接填，获取不放出次参数
        spot_info.openAngle = _cSpotLightInfo.m_fOpenAngle;
        spot_info.fadeAngle = _cSpotLightInfo.m_fFadeAngle;
        spot_info.hasShadow =
            _cSpotLightInfo.m_uShadowFreq > 0 && _cSpotLightInfo.m_uShadowFreq !== 0xffffffff && _cSpotLightInfo.m_uShadowFreq !== 0x7fffffff
                ? true
                : false;

        return spot_info;
    };

    /**
     * 获取所有的聚光灯标识
     * @param {String} dataSetId //聚光灯所属的数据集标识，为空串则表示为全局聚光灯
     */
    Module.Light.getAllSpotLightIds = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return false;
        var tempArr = Module.RealBIMWeb.GetAllSpotLightNames(dataSetId);
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 删除一组聚光灯
     * @param {String} dataSetId //聚光灯所属的数据集标识，为空串则表示为全局聚光灯
     * @param {Array} lightIds //聚光灯标识集合
     */
    Module.Light.delSpotLights = function (dataSetId, lightIds) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return false;
        if (isEmpty(lightIds) || !lightIds.length) {
            logParErr('lightIds');
            return false;
        }
        let vector_Str_lightids = new Module.RE_Vector_Str();
        for (let i = 0; i < lightIds.length; i++) {
            vector_Str_lightids.push_back(lightIds[i]);
        }
        return Module.RealBIMWeb.DelSpotLights(dataSetId, vector_Str_lightids);
    };

    /**
     * 删除所有的聚光灯
     * @param {String} dataSetId //聚光灯所属的数据集标识，为空串则表示为全局聚光灯
     * @param {Boolean} isAll //表示是否删除系统中所有的全局和局部聚光灯
     */
    Module.Light.delAllSpotLights = function (dataSetId, isAll) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return false;
        let _isAll = isEmpty(isAll) ? false : isAll;
        return Module.RealBIMWeb.DelAllSpotLights(_isAll, dataSetId);
    };

    // MOD-- 模型加载（Model） <---
    Module.Model = typeof Module.Model !== 'undefined' ? Module.Model : {}; //增加 Model 模块

    class REDataSet {
        constructor() {
            this.dataSetId = null; //数据集的唯一标识名，不能为空不可重复，重复前边的数据集会被自动覆盖
            this.resourcesAddress = null; //数据集资源包地址
            this.useTransInfo = null; //表示该项目是否需要调整位置，默认false
            this.transInfo = null; //项目的偏移信息，依次为缩放、旋转（四元数）、平移
            this.minLoadDist = null; //项目模型的最小加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
            this.maxLoadDist = null; //项目模型的最大加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载；
            this.dataSetCRS = null; //当前子项的坐标系标识
            this.dataSetCRSNorth = null; //当前子项的项目北与正北方向的夹角（右手坐标系，逆时针为正）dataSetCRS 为空时此参数无定意义
            this.useAssginVer = null; //表示是否加载指定版本，默认 false
            this.assginVer = null; //指定版本号，加载指定版本的时候，会用此版本号
            this.useAssginVer2 = null; //表示是否加载指定版本2，默认 false
            this.assginVer2 = null; //指定版本号2，加载指定版本的时候，会用此版本号
            this.dividePrior = null; //项目内模型的细分优先级(值越小优先级越高)
            this.engineOrigin = null; //表示项目局部空间的原点在项目参考坐标系dataSetCRS下的坐标（dataSetCRS为空时无定义）
            this.preciseCRS = null; //表示在进行地理信息坐标系定位时是否采用精确计算模式
            this.groundDisplay = null; //表示项目中的地形矢量是否需要贴地显示(将禁用影像图片显示)
            this.terrSuffix = null; //表示项目中的地形系统标识后缀，同样投影参数/概览信息/标识后缀的地形数据将合并为一个地形系统进行显示（如果地形矢量为不贴地，那么这个参数不能为空，如果地形矢量允许可以独立编辑则此参数需要唯一，允许多个地形矢量同时编辑则此参数相同。如果地形矢量为贴地，那么这参数传空字符串）
            this.terrSph = null; //表示项目中的地形系统数据是否允许适配到球面地形
            this.dataSetSGContent = null; //表示项目对应的主场景组文件内容字符串
            this.useWMS = false; // 表示是否使用Web地图发布服务信息
            this.wmsInfo = null; // Web地图发布服务信息 （REWMSInfo 类型），useWMS=true有效
        }
    }
    ExtModule.REDataSet = REDataSet;

    class REWMSInfo {
        // Web地图发布服务信息
        constructor() {
            this.layerId = 0; // 表示图层标识
            this.selfCrs = 0; // 表示资源自身的地理投影坐标系
            this.layerName = null; // 表示图层名称
            this.reqFmt = null; // 表示资源请求模板
            this.layerType = 1; // 表示图层类型 1：表示影像 2：矢量标注
            this.revertResX = 0; // 表示资源索引水平翻转（0，1）
            this.revertResY = 1; // 表示资源索引垂直翻转（0，1）
            this.revertU = 0; // 表示资源内容水平翻转（0，1）
            this.revertV = 0; // 表示资源内容垂直翻转（0，1）
            this.lodRange = [0, 18]; // 表示资源层级范围（二元素数组类型）
            this.picTransp = false; // 表示资源是否支持透明通道
            this.resLonLatBound = [0, 0, 0, 0]; // 表示地图资源的经纬度范围（四元素数组类型）【lonMin, lonMax, latMin, latMax】
            this.tilingSchemeType = 1; // 切片方案类型（默认3857切片方案）  0：用户自定义  1：WebMercatorTilingScheme（3857切片方案）  2：GeoGraphicTilingScheme（4326切片方案（经纬度切片方案））  3：天地图切片方案
            this.customTilingScheme = null; // 表示用户自定义切片方案（RETilingScheme 类型），只有tilingSchemeType=0生效
        }
    }
    ExtModule.REWMSInfo = REWMSInfo;

    class RETilingScheme {
        // Web地图发布服务信息
        constructor() {
            this.base = null; // 表示资源基点，（二元素数组类型）
            this.size = null; // 表示资源大小，（二元素数组类型）
            this.worCRSScale = [1.0, 1.0]; // 表示引擎世界空间在 dataSetCRS 指定的参考坐标系下进行的二次缩放系数，（二元素数组类型）
            this.rootNum = null; // 表示顶级瓦片数量，（二元素数组类型）
            this.biasLOD = 1; // 表示统一资源ID中的lod索引的偏移
            this.lodRangeList = null; // 表示层级范围集合，层级范围和层级瓦片范围要对应数量，（二维二元素数组类型）
            this.boundList = null; // 表示层级瓦片范围集合，层级范围和层级瓦片范围要对应数量，（二维四元素数组类型）
            this.biasRootXY = [0, 0]; // 表示根节点索引偏移，（二元素数组类型）
        }
    }
    ExtModule.RETilingScheme = RETilingScheme;

    /**
     * 加载数据集资源
     * @param {Boolean} clearLoaded //是否清除掉已经加载好的项目
     * @param {Array} dataSetList //数据集集合 （REDataSet 类型）
     */
    Module.Model.loadDataSet = function (dataSetList, clearLoaded) {
        if (isRepeat(dataSetList, 'dataSetId')) {
            console.error('【REError】: dataSetId 唯一标识名，不能为空不可重复');
            return;
        }

        let count = dataSetList.length;
        for (let i = 0; i < count; i++) {
            let dataSetModel = dataSetList[i];
            var _deftransinfo = [
                [1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0],
            ];
            if (dataSetModel.useTransInfo) _deftransinfo = dataSetModel.transInfo;
            var _useCamPost = false;
            var _minLoadDist = 1e30;
            if (!isEmpty(dataSetModel.minLoadDist)) _minLoadDist = dataSetModel.minLoadDist;
            var _maxLoadDist = 1e30;
            if (!isEmpty(dataSetModel.maxLoadDist)) _maxLoadDist = dataSetModel.maxLoadDist;
            var _projCRS = '';
            if (!isEmpty(dataSetModel.dataSetCRS)) _projCRS = dataSetModel.dataSetCRS;
            var _projNorth = 0.0;
            if (!isEmpty(dataSetModel.dataSetCRSNorth)) _projNorth = dataSetModel.dataSetCRSNorth;
            var _defMainProjCamFile = '';
            var _dividePrior = isEmpty(dataSetModel.dividePrior) ? 1.0 : dataSetModel.dividePrior;
            var _originCRS = isEmpty(dataSetModel.engineOrigin) ? [0.0, 0.0, 0.0] : dataSetModel.engineOrigin;
            var _preciseCRS = isEmpty(dataSetModel.preciseCRS) ? true : dataSetModel.preciseCRS;
            var _terrImgShpAlone = isEmpty(dataSetModel.groundDisplay) ? false : !dataSetModel.groundDisplay;
            var _terrSuffix = isEmpty(dataSetModel.terrSuffix) ? '' : dataSetModel.terrSuffix;
            var _terrSph = isEmpty(dataSetModel.terrSph) ? true : dataSetModel.terrSph;
            let _dataSetSGContent = isEmpty(dataSetModel.dataSetSGContent) ? '' : dataSetModel.dataSetSGContent;
            var _isMainProj = (typeof clearLoaded == 'undefined' || clearLoaded) && i == 0 ? true : false;
            var intprojid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetModel.dataSetId);
            var _ver = {
                m_sVer0: -1,
                m_sVer1: -1,
                m_uVer0GolIDBias_L32: 0,
                m_uVer0GolIDBias_H32: 0,
                m_uVer1GolIDBias_L32: 0,
                m_uVer1GolIDBias_H32: 0,
            };
            if (dataSetModel.useAssginVer) {
                _ver.m_sVer0 = dataSetModel.assginVer;
                _ver.m_uVer0GolIDBias_H32 = intprojid;
            }
            if (dataSetModel.useAssginVer2) {
                _ver.m_sVer1 = dataSetModel.assginVer2;
                _ver.m_uVer1GolIDBias_H32 = intprojid;
            }
            if (!dataSetModel.useAssginVer && !dataSetModel.useAssginVer2) {
                // 没有使用版本默认第一个版本为最新
                _ver.m_sVer0 = 0x7fffffff;
            }
            const _useWMS = isEmpty(dataSetModel.useWMS) ? false : dataSetModel.useWMS; // 是否使用WMS信息
            if (!_useWMS) {
                if (_dataSetSGContent.length > 0) {
                    Module.RealBIMWeb.LoadMainSceExt2(
                        dataSetModel.dataSetId,
                        _isMainProj,
                        _projCRS,
                        _projNorth,
                        dataSetModel.resourcesAddress + '/total.xml',
                        _dataSetSGContent,
                        _deftransinfo[0],
                        _deftransinfo[1],
                        _deftransinfo[2],
                        _minLoadDist,
                        _maxLoadDist,
                        '',
                        _defMainProjCamFile,
                        _useCamPost,
                        _dividePrior,
                        _originCRS,
                        _preciseCRS,
                        _terrImgShpAlone,
                        _terrSuffix,
                        _terrSph
                    );
                } else {
                    Module.RealBIMWeb.LoadMainSceExt(
                        dataSetModel.dataSetId,
                        _isMainProj,
                        _projCRS,
                        _projNorth,
                        dataSetModel.resourcesAddress + '/total.xml',
                        _deftransinfo[0],
                        _deftransinfo[1],
                        _deftransinfo[2],
                        _minLoadDist,
                        _maxLoadDist,
                        '',
                        _defMainProjCamFile,
                        _useCamPost,
                        _dividePrior,
                        _originCRS,
                        _preciseCRS,
                        _terrImgShpAlone,
                        _terrSuffix,
                        _terrSph
                    );
                }
            } else {
                if (isEmptyLog(dataSetModel.wmsInfo, 'wmsInfo')) return;
                const _WMSInfo = dataSetModel.wmsInfo;
                if (isEmptyLog(_WMSInfo.layerId, 'layerId')) return;
                if (isEmptyLog(_WMSInfo.selfCrs, 'selfCrs')) return;
                if (isEmptyLog(_WMSInfo.layerName, 'layerName')) return;
                if (isEmptyLog(_WMSInfo.reqFmt, 'reqFmt')) return;
                const _layerType = isEmpty(_WMSInfo.layerType) ? 1 : _WMSInfo.layerType;
                const _revertResX = isEmpty(_WMSInfo.revertResX) ? 0 : _WMSInfo.revertResX;
                const _revertResY = isEmpty(_WMSInfo.revertResY) ? 1 : _WMSInfo.revertResY;
                const _revertU = isEmpty(_WMSInfo.revertU) ? 0 : _WMSInfo.revertU;
                const _revertV = isEmpty(_WMSInfo.revertV) ? 0 : _WMSInfo.revertV;
                const _lodRange = isEmpty(_WMSInfo.lodRange) ? [0, 18] : _WMSInfo.lodRange;
                const _picTransp = isEmpty(_WMSInfo.picTransp) ? false : _WMSInfo.picTransp;
                const _resLonLatBound = isEmpty(_WMSInfo.resLonLatBound) ? [0, 0, 0, 0] : _WMSInfo.resLonLatBound;
                const _tilingSchemeType = isEmpty(_WMSInfo.tilingSchemeType) ? 1 : _WMSInfo.tilingSchemeType;
                let _cCustomTilingScheme = {
                    m_vBase: [0, 0],
                    m_vSize: [0, 0],
                    m_vWorCRSScale: [1.0, 1.0],
                    m_arrLodRanges: new Module.RE_Vector_ivec2(),
                    m_arrBounds: new Module.RE_Vector_ivec4(),
                    m_vRootNum: [0, 0],
                    m_uBiasLOD: 1,
                    m_vBiasRootXY: [0, 0],
                }; //默认添加不然web.js自动解析报错
                if (_tilingSchemeType == 0 && _WMSInfo.customTilingScheme) {
                    const _tilingScheme = _WMSInfo.customTilingScheme;
                    if (isEmptyLog(_tilingScheme.base, 'base')) return;
                    if (isEmptyLog(_tilingScheme.size, 'size')) return;
                    if (!checkTypeLog(_tilingScheme.lodRangeList, 'lodRangeList', RE_Enum.RE_Check_Array)) return;
                    if (!checkTypeLog(_tilingScheme.boundList, 'boundList', RE_Enum.RE_Check_Array)) return;
                    if (isEmptyLog(_tilingScheme.rootNum, 'rootNum')) return;
                    if (_tilingScheme.lodRangeList.length != _tilingScheme.boundList.length) {
                        console.error('【REError】: lodRangeList 和 boundList 需要一一对应');
                        return;
                    }
                    const _worCRSScale = isEmpty(_tilingScheme.worCRSScale) ? [1.0, 1.0] : _tilingScheme.worCRSScale;
                    const _biasLOD = isEmpty(_tilingScheme.biasLOD) ? 1 : _tilingScheme.biasLOD;
                    const _biasRootXY = isEmpty(_tilingScheme.biasRootXY) ? [0, 0] : _tilingScheme.biasRootXY;
                    const _vector_lodRange = new Module.RE_Vector_ivec2();
                    _tilingScheme.lodRangeList.forEach((element) => {
                        _vector_lodRange.push_back(element);
                    });
                    const _vector_bound = new Module.RE_Vector_ivec4();
                    _tilingScheme.boundList.forEach((element) => {
                        _vector_bound.push_back(element);
                    });
                    _cCustomTilingScheme = {
                        m_vBase: _tilingScheme.base,
                        m_vSize: _tilingScheme.size,
                        m_vWorCRSScale: _worCRSScale,
                        m_arrLodRanges: _vector_lodRange,
                        m_arrBounds: _vector_bound,
                        m_vRootNum: _tilingScheme.rootNum,
                        m_uBiasLOD: _biasLOD,
                        m_vBiasRootXY: _biasRootXY,
                    };
                }
                let _m_eTilingSchemeType = Module.RE_TILING_SCHEME_TYPE.WEBMERCATORTILINGSCHEME;
                if (_tilingSchemeType == 0) {
                    _m_eTilingSchemeType = Module.RE_TILING_SCHEME_TYPE.CUSTOMTILINGSCHEME;
                } else if (_tilingSchemeType == 1) {
                    _m_eTilingSchemeType = Module.RE_TILING_SCHEME_TYPE.WEBMERCATORTILINGSCHEME;
                } else if (_tilingSchemeType == 2) {
                    _m_eTilingSchemeType = Module.RE_TILING_SCHEME_TYPE.GEOGRAPHICTILINGSCHEME;
                } else if (_tilingSchemeType == 3) {
                    _m_eTilingSchemeType = Module.RE_TILING_SCHEME_TYPE.TIANDITUTILINGSCHEME;
                }

                let cWMSInfo = {
                    m_strDataSetId: dataSetModel.dataSetId,
                    m_uLayerId: _WMSInfo.layerId,
                    m_strCRS: _WMSInfo.selfCrs,
                    m_strLayerName: _WMSInfo.layerName,
                    m_strFmtStr: _WMSInfo.reqFmt,
                    m_uLayerType: _layerType,
                    m_uRevertResX: _revertResX,
                    m_uRevertResY: _revertResY,
                    m_uRevertU: _revertU,
                    m_uRevertV: _revertV,
                    m_vLodRange: _lodRange,
                    m_bPicTransp: _picTransp,
                    m_vResLonLatBound: _resLonLatBound,
                    m_eTilingSchemeType: _m_eTilingSchemeType,
                    m_cCustomTilingScheme: _cCustomTilingScheme,
                };
                Module.RealBIMWeb.LoadWMS(cWMSInfo, _isMainProj);
            }
            Module.RealBIMWeb.SetSceVersionInfoExt(dataSetModel.dataSetId, _ver);
        }
    };

    /**
     * 获取当前加载的所有数据集id
     */
    Module.Model.getAllDataSetId = function () {
        var tempArr = Module.RealBIMWeb.GetAllMainSceNames();
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 卸载一个数据集
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Model.unloadDataSet = function (dataSetId) {
        Module.RealBIMWeb.UnLoadMainSce(dataSetId);
    };

    /**
     * 卸载所有数据集
     */
    Module.Model.unloadAllDataSet = function () {
        var tempArr = Module.RealBIMWeb.GetAllMainSceNames();
        for (let i = 0; i < tempArr.size(); ++i) {
            var tempProjName = tempArr.get(i);
            Module.RealBIMWeb.UnLoadMainSce(tempProjName);
        }
    };

    /**
     * 刷新所有数据集模型
     * @param {Boolean} loadNewData //表示刷新主体数据后是否允许重新加载数据
     */
    Module.Model.refreshAllDataSet = function (loadNewData) {
        Module.RealBIMWeb.RefreshMainData(loadNewData);
    };

    /**
     * 获取项目所有数据集加载状态
     */
    Module.Model.getAllDataSetReady = function () {
        return Module.RealBIMWeb.IsMainSceReady();
    };

    /**
     * 获取指定数据集加载状态
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Model.getDataSetReady = function (dataSetId) {
        return Module.RealBIMWeb.IsMainSceAllResLoaded(dataSetId);
    };

    // MOD-- 相机（Camera） <---
    Module.Camera = typeof Module.Camera !== 'undefined' ? Module.Camera : {}; //增加 Camera 模块

    // MARK 属性信息
    class RECamLoc {
        // 相机方位信息
        constructor() {
            this.camPos = null; //相机位置
            this.camRotate = [1e30, 1e30, 1e30, 1e30]; //相机的朝向
            this.camDir = [1e30, 1e30, 1e30]; //相机的朝向（欧拉角）
        }
    }
    ExtModule.RECamLoc = RECamLoc;

    /**
     * 获取当前相机的控制模式
     */
    Module.Camera.getCamMode = function () {
        return Module.RealBIMWeb.GetCamMode();
    };

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
    };

    class REGisCamLoc {
        // gis相机方位信息
        constructor() {
            this.lon = 0; //经度
            this.lat = 0; //纬度
            this.height = 0; //高程
            this.heading = 0; //
            this.pitch = 0; //
            this.roll = 0; //
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
        var _cam_rotate_d = Module.RealBIMWeb.ConvCamRotate_Q2D(_camLoc.m_qCamRotate);

        var camLoc = new RECamLoc();
        camLoc.camPos = _camLoc.m_vCamPos;
        camLoc.camRotate = _camLoc.m_qCamRotate;
        camLoc.camDir = _cam_rotate_d;
        return camLoc;
    };

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
    };

    class REAxisInfo {
        // 轴信息
        constructor() {
            this.up = [1e30, 1e30, 1e30]; //上轴向量
            this.viewLine = [1e30, 1e30, 1e30]; //视角方向
        }
    }
    ExtModule.REAxisInfo = REAxisInfo;

    /**
     * 获取轴信息转换四元数信息
     * @param {REAxisInfo} axisInfo //轴信息
     */
    Module.Camera.getQuatByAxis = function (axisInfo) {
        let cAxisInfo = {
            m_vUp: axisInfo.up,
            m_vViewLine: axisInfo.viewLine,
            // m_vViewLine: axisInfo.viewLine.map(item => item * -1.0),
        };
        let _qRotate = Module.RealBIMWeb.GetQuatByAxis(cAxisInfo);
        return _qRotate;
    };

    /**
     * 获取四元数信息转换轴信息
     * @param {dvec4} rotate //四元数信息
     */
    Module.Camera.getAxisByQuat = function (rotate) {
        let _cAxisInfo = Module.RealBIMWeb.GetAxisByQuat(rotate);
        let axisInfo = new REAxisInfo();
        axisInfo.up = _cAxisInfo.m_vUp;
        axisInfo.viewLine = _cAxisInfo.m_vViewLine;
        return axisInfo;
    };

    /**
     * 将相机四元数朝向转换为方向朝向
     * @param {dvec4} camRotate //相机朝向（四元素数组）
     */
    Module.Camera.getConvRotateQ2D = function (camRotate) {
        return Module.RealBIMWeb.ConvCamRotate_Q2D(camRotate);
    };

    /**
     * 将相机方向朝向转换为四元数朝向
     * @param {dvec4} camDir //相机朝向（三元素数组）
     */
    Module.Camera.getConvRotateD2Q = function (camDir) {
        return Module.RealBIMWeb.ConvCamRotate_D2Q(camDir);
    };

    /**
     * 获取当前北方向夹角（二维） 注：逆时针范围【0-360】
     */
    Module.Camera.getCurNorthAngleXOY = function () {
        return Module.RealBIMWeb.GetCurNorthAngleXOY();
    };

    // MARK 相机操作

    class REForceCamLoc {
        // 相机方位信息
        constructor() {
            this.camPos = null; //相机位置
            this.camRotate = [1e30, 1e30, 1e30, 1e30]; //相机的朝向
            this.camDir = [1e30, 1e30, 1e30]; //相机的朝向（欧拉角）
            this.force = false; //是否强制相机初始方位
        }
    }
    ExtModule.REForceCamLoc = REForceCamLoc;

    /**
     * 调整相机到目标方位
     * @param {RECamLoc} camLoc //相机方位信息
     * @param {Number} locDelay //转动相机前的延时时间（秒）默认0
     * @param {Number} locTime //相机的运动速度（秒） 默认1.0
     */
    Module.Camera.setCamLocateTo = function (camLoc, locDelay, locTime) {
        if (isEmptyLog(camLoc, 'camLoc')) return;
        if (isEmptyLog(camLoc.camPos, 'camPos')) return;

        var _delay = 0;
        if (!isEmpty(locDelay)) _delay = locDelay;
        var _time = 1.0;
        if (!isEmpty(locTime)) _time = locTime;
        if (camLoc.camRotate[0] != 1e30) {
            Module.RealBIMWeb.LocateCamTo(camLoc.camPos, camLoc.camRotate, _delay, _time);
            return;
        }
        if (camLoc.camDir[0] != 1e30) {
            Module.RealBIMWeb.LocateCamTo_Dir(camLoc.camPos, camLoc.camDir, _delay, _time);
        }
    };

    /**
     * 调整相机到默认视角方位
     * @param {RECamDirEm} locType //表示26个方向 RECamDirEm 枚举值
     * @param {Boolean} scanAllDataSet //是否定位到整个数据集，默认true，true表示定位到整个场景，false表示相机原地调整方向
     */
    Module.Camera.setCamLocateDefault = function (locType, scanAllDataSet) {
        if (isEmptyLog(locType, 'locType')) return;
        var _bScanAllSce = true;
        if (!isEmpty(scanAllDataSet)) _bScanAllSce = scanAllDataSet;
        if (locType === RECamDirEm.CAM_DIR_DEFAULT) {
            Module.RealBIMWeb.RestoreCamLocation();
        } else {
            var enumEval = eval(locType);
            Module.RealBIMWeb.ResetCamToTotalSce(enumEval, _bScanAllSce);
        }
    };

    /**
     * 调整相机方位到对准构件集合
     * @param {RECamDirEm} locType //相机朝向 RECamDirEm 枚举值
     * @param {Number} backDepth //相机后退强度（如果相机距离构件太近或太远，都可以通过此参数调整）
     * @param {Array} locIDList //目标ID集合 包含  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {Array} elemIdList //构件的标识名 集合
     */
    Module.Camera.setCamLocateToElem = function (locIDList, backDepth, locType) {
        if (isEmptyLog(locIDList, 'locIDList')) return;
        var obj_s = 0;
        var _offset = 0;
        for (var i = 0; i < locIDList.length; ++i) {
            obj_s += locIDList[i].elemIdList.length;
        }
        var _s01 = (obj_s * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01);
        let _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
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
        Module.RealBIMWeb.FocusCamToSubElems('', '', _elemIds.byteLength, _elemIds.byteOffset, backDepth, _locType);
    };

    /**
     * 调整相机定位到数据集
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {Number} backDepth //相机后退强度（如果相机距离构件太近或太远，都可以通过此参数调整）
     * @param {RECamDirEm} locType //相机朝向 RECamDirEm 枚举值
     */
    Module.Camera.setCamLocateToDataSet = function (dataSetId, backDepth, locType) {
        var _projname = '';
        if (!isEmpty(dataSetId)) {
            _projname = dataSetId;
        }
        var _locType = isEmpty(locType) ? eval(RECamDirEm.CAM_DIR_DEFAULT) : eval(locType);
        Module.RealBIMWeb.FocusCamToSubElems(_projname, '', 0, 0, backDepth, _locType);
    };

    /**
     * 重置相机方位
     */
    Module.Camera.resetCamLocate = function () {
        Module.RealBIMWeb.RestoreCamLocation();
    };

    /**
     * 调整相机定位到包围盒（枚举朝向）
     * @param {Array} arrBound //包围盒范围，[[Xmin、Ymin、Zmin],[Xmax、Ymax、Zmax]]
     * @param {Number} backDepth //相机后退强度（如果相机距离构件太近或太远，都可以通过此参数调整）
     * @param {RECamDirEm} locType //相机朝向 RECamDirEm 枚举值
     */
    Module.Camera.setCamLocateToBound = function (arrBound, backDepth = 1.0, locType) {
        let _useCustomDir = isEmpty(locType) ? false : true;
        var _locType = isEmpty(locType) ? eval(RECamDirEm.CAM_DIR_DEFAULT) : eval(locType);
        Module.RealBIMWeb.TargetToAABB(arrBound, backDepth, _useCustomDir, _locType);
    };

    /**
     * 调整相机定位到包围盒（相机朝向）
     * @param {Array} arrBound //包围盒范围，[[Xmin、Ymin、Zmin],[Xmax、Ymax、Zmax]]
     * @param {Number} backDepth //相机后退强度（如果相机距离构件太近或太远，都可以通过此参数调整）
     * @param {dvec3} camDir //相机朝向（三元素数组）
     */
    Module.Camera.setCamLocateToBoundByDir = function (arrBound, backDepth = 1.0, camDir) {
        let _useCustomDir = isEmpty(camDir) ? false : true;
        Module.RealBIMWeb.TargetToAABB_Dir(arrBound, backDepth, _useCustomDir, camDir);
    };

    /**
     * 设置相机的强制初始方位 （可以在加载模型之前设置）
     * @param {REForceCamLoc} forceCamLoc //强制相机方位信息
     */
    Module.Camera.setCamForcedInitLoc = function (forceCamLoc) {
        if (isEmptyLog(forceCamLoc, 'forceCamLoc')) return;
        if (isEmptyLog(forceCamLoc.camPos, 'camPos')) return;
        if (isEmpty(forceCamLoc.camRotate) && isEmpty(forceCamLoc.camDir)) return;

        var _force = isEmpty(forceCamLoc.force) ? false : forceCamLoc.force;

        if (forceCamLoc.camRotate[0] != 1e30) {
            Module.RealBIMWeb.SetCamForcedInitLoc(_force, forceCamLoc.camPos, forceCamLoc.camRotate);
            return;
        }
        if (forceCamLoc.camDir[0] != 1e30) {
            var _cam_rotate_q = Module.RealBIMWeb.ConvCamRotate_D2Q(forceCamLoc.camDir);
            Module.RealBIMWeb.SetCamForcedInitLoc(_force, forceCamLoc.camPos, _cam_rotate_q);
            return;
        }
    };

    /**
     * 获取相机的强制初始方位信息
     */
    Module.Camera.getCamForcedInitLoc = function () {
        var _forceInitLoc = Module.RealBIMWeb.GetCamForcedInitLoc();
        var _cam_rotate_d = Module.RealBIMWeb.ConvCamRotate_Q2D(_forceInitLoc.m_qCamRotate);
        var forceCamLoc = new REForceCamLoc();
        forceCamLoc.force = _forceInitLoc.m_bForce;
        forceCamLoc.camPos = _forceInitLoc.m_vCamPos;
        forceCamLoc.camRotate = _forceInitLoc.m_qCamRotate;
        forceCamLoc.camDir = _cam_rotate_d;
        return forceCamLoc;
    };

    /**
     * 设置相机自动动画参数
     * @param {dvec3} point //自动旋转的参考中心点坐标，数组形式[x,y,z]
     * @param {Boolean} speed //旋转一周所用时间，单位为秒
     * @param {Boolean} rotateEnable //是否开启自动旋转
     */
    Module.Camera.setAutoCamAnimParams = function (point, speed, rotateEnable) {
        var _dRotSpeed = (2 * 3.1415) / speed;
        Module.RealBIMWeb.SetAutoCamAnimParams(point, _dRotSpeed);
        Module.RealBIMWeb.SetAutoCamAnimEnable(rotateEnable);
    };

    /**
     * 获取相机自动动画启用状态
     */
    Module.Camera.getAutoCamAnimEnable = function () {
        return Module.RealBIMWeb.GetAutoCamAnimEnable();
    };

    /**
     * 退出当前的相机定位操作 注：Camera.setCamLocateTo接口调用方式有效
     * @param {Number} type //表示相机退出定位后的终止方位在哪（默认为0） 0: 当前方位 1: 定位起始方位 2: 定位最终结束方位
     */
    Module.Camera.exitCamLocating = function (type) {
        let _type = isEmpty(type) ? 0 : type;
        return Module.RealBIMWeb.ExitCamLocating(_type);
    };

    // MARK 相机效果

    /**
     * 设置固定当前的相机方位（BIM相机）
     */
    Module.Camera.setFixCurCam = function () {
        Module.RealBIMWeb.IsFixMainCam(true);
    };

    /**
     * 设置相机位置的世界空间范围
     * @param {Array} arrCamBound //表示相机的移动范围，[[Xmin、Ymin、Zmin],[Xmax、Ymax、Zmax]]
     */
    Module.Camera.setCamBound = function (arrCamBound) {
        Module.RealBIMWeb.SetCamBound(arrCamBound);
    };

    /**
     * 获取相机位置的世界空间范围
     */
    Module.Camera.getCamBound = function () {
        return Module.RealBIMWeb.GetCamBound();
    };

    /**
     * 重置相机位置的默认世界空间范围
     */
    Module.Camera.resetCamBound = function () {
        Module.RealBIMWeb.SetCamBound([
            [-1e30, -1e30, -1e30],
            [1e30, 1e30, 1e30],
        ]);
    };

    /**
     * 设置相机的强制近裁面/远裁面
     * @param {Array} arrNearFar //二维数组[强制近裁面,强制远裁面](小于0表示使用资源中的设置；0~1e37表示强制使用指定值；大于1e37表示强制使用自动计算值)
     */
    Module.Camera.setCamForcedNearFar = function (arrNearFar) {
        Module.RealBIMWeb.SetCamForcedZNearFar(arrNearFar);
    };

    /**
     * 获取相机的强制近裁面/远裁面
     */
    Module.Camera.getCamForcedNearFar = function () {
        return Module.RealBIMWeb.GetCamForcedZNearFar();
    };

    /**
     * 设置相机朝向是否允许头朝下
     * @param {Boolean} enable //是否允许
     */
    Module.Camera.setCamUpsideDown = function (enable) {
        Module.RealBIMWeb.SetCamUpsideDown(enable);
    };

    /**
     * 获取相机朝向是否允许头朝下
     */
    Module.Camera.getCamUpsideDown = function () {
        return Module.RealBIMWeb.GetCamUpsideDown();
    };

    /**
     * 设置当相机运动或模型运动时是否偏向于渲染流畅性
     * @param {Boolean} prefer //是否偏向
     */
    Module.Camera.setCamPreferFPS = function (prefer) {
        Module.RealBIMWeb.SetPreferFPS(prefer);
    };

    /**
     * 获取当相机运动或模型运动时是否偏向于渲染流畅性
     */
    Module.Camera.getCamPreferFPS = function () {
        return Module.RealBIMWeb.GetPreferFPS();
    };

    /**
     * 设置主场景相机的投影类型
     * @param {Number} type //是否偏向
     */
    Module.Camera.setCamType = function (type) {
        Module.RealBIMWeb.SetCamProjType(type);
    };

    /**
     * 获取主场景相机的投影类型
     */
    Module.Camera.getCamType = function () {
        return Module.RealBIMWeb.GetCamProjType();
    };

    /**
     * 获取相机在自由移动模式下的速度
     */
    Module.Camera.getFreeCamMoveSpeed = function () {
        return Module.RealBIMWeb.GetFreeCamMoveSpeed();
    };

    /**
     * 设置相机在自由移动模式下的速度
     * @param {Number} speed //速度
     */
    Module.Camera.setFreeCamMoveSpeed = function (speed) {
        Module.RealBIMWeb.SetFreeCamMoveSpeed(speed);
    };

    /**
     * 获取相机是否允许位于地形以下
     */
    Module.Camera.getCamBelowTerrain = function () {
        return Module.RealBIMWeb.GetCamBelowTerrain();
    };

    /**
     * 设置相机是否允许位于地形以下
     * @param {Boolean} enable //是否允许
     */
    Module.Camera.setCamBelowTerrain = function (enable) {
        Module.RealBIMWeb.SetCamBelowTerrain(enable);
    };

    /**
     * 获取相机是否锁定当前朝向
     */
    Module.Camera.getCamLockRotate = function () {
        return Module.RealBIMWeb.GetCamLockRotate();
    };

    /**
     * 设置相机是否锁定当前朝向
     * @param {Boolean} lock //是否锁定
     */
    Module.Camera.setCamLockRotate = function (lock) {
        Module.RealBIMWeb.SetCamLockRotate(lock);
    };

    /**
     * 设置相机是否与地形页面LOD切换相同步，以获取更好地形页面LOD切换效果
     * @param {Boolean} align //是否同步
     */
    Module.Camera.setCamAlignTerrainPage = function (align) {
        Module.RealBIMWeb.SetCamAlignTerrainPage(align);
    };

    /**
     * 获取相机是否与地形页面LOD切换相同步
     */
    Module.Camera.getCamAlignTerrainPage = function () {
        return Module.RealBIMWeb.GetCamAlignTerrainPage();
    };

    // MARK 第三人称漫游
    class RETPPInfo {
        // 第三人称漫游信息
        constructor() {
            this.dataSetId = ''; //数据集标识
            this.entityType = ''; //实例类型名称
            this.useEntityPos = false; //是否用自定义单构件位置
            this.entityPos = [0, 0, 0]; //自定义单构件位置
            this.useCustomCam = false; //是否用自定义相机信息
            this.camPos = [0, 0, 0]; //相机的位置（三元素数组）
            this.camRotate = [0, 0, 0, 1]; //相机朝向（四元素数组）
        }
    }
    ExtModule.RETPPInfo = RETPPInfo;

    /**
     * 创建单构件对象并进入第三人称漫游
     * @param {RETPPInfo} tppInfo //第三人称漫游信息（RETPPInfo 类型）
     */
    Module.Camera.createTpp = function (tppInfo) {
        if (isEmptyLog(tppInfo.dataSetId, 'dataSetId')) return;
        if (isEmptyLog(tppInfo.entityType, 'entityType')) return;

        let _useEntityPos = isEmpty(tppInfo.useEntityPos) ? false : tppInfo.useEntityPos;
        let _entityPos = isEmpty(tppInfo.entityPos) ? [0, 0, 0] : tppInfo.entityPos;
        let _useCustomCam = isEmpty(tppInfo.useCustomCam) ? false : tppInfo.useCustomCam;
        let _camPos = isEmpty(tppInfo.camPos) ? [0, 0, 0] : tppInfo.camPos;
        let _camRotate = isEmpty(tppInfo.camRotate) ? [0, 0, 0, 1] : tppInfo.camRotate;

        Module.RealBIMWeb.CreateTPP(tppInfo.dataSetId, tppInfo.entityType, _useEntityPos, _entityPos, _useCustomCam, _camPos, _camRotate);
    };

    /**
     * 退出第三人称漫游
     * @param {Boolean} delEntity //是否删除当前绑定的单构件
     */
    Module.Camera.delTPP = function (delEntity) {
        let _delEntity = isEmpty(delEntity) ? false : delEntity;
        Module.RealBIMWeb.DelTPP(_delEntity);
    };

    /**
     * 设置运动模式的动画名称
     * @param {String} animName //动画标识
     */
    Module.Camera.setTPPSportAnimName = function (animName) {
        return Module.RealBIMWeb.SetTPPSportAniName(animName);
    };

    /**
     * 获取运动模式的动画名称
     */
    Module.Camera.getTPPSportAnimName = function () {
        return Module.RealBIMWeb.GetTPPSportAniName();
    };

    /**
     * 设置空闲模式的动画名称
     * @param {String} animName //动画标识
     */
    Module.Camera.setTPPIdleAnimName = function (animName) {
        return Module.RealBIMWeb.SetTPPIdleAniName(animName);
    };

    /**
     * 获取空闲模式的动画名称
     */
    Module.Camera.getTPPIdleAnimName = function () {
        return Module.RealBIMWeb.GetTPPIdleAniName();
    };

    /**
     * 设置单构件的爬坡能力
     * @param {number} gradeAbility //表示单构件的爬升能力,>=0表示绝对高度；<0表示相对于视点包围球半径的倍数的负数
     */
    Module.Camera.setTPPGradeAbility = function (gradeAbility) {
        Module.RealBIMWeb.SetTPPGradeAbility(gradeAbility);
    };

    /**
     * 获取单构件的爬升能力
     */
    Module.Camera.getTPPGradeAbility = function () {
        return Module.RealBIMWeb.GetTPPGradeAbility();
    };

    class RETPPSphereColliderInfo {
        // 相机跟随碰撞球信息
        constructor() {
            this.radius = 0.5; //碰撞球半径
            this.useCustomPos = false; //是否自定义碰撞球的球心位置
            this.pos = [0, 0, 0]; //球心坐标 （三元素数组）
        }
    }
    ExtModule.RETPPSphereColliderInfo = RETPPSphereColliderInfo;

    /**
     * 设置碰撞球信息
     * @param {RETPPSphereColliderInfo} sphereColliderInfo //碰撞球信息（RETPPSphereColliderInfo 类型）
     */
    Module.Camera.setTPPSphereCollider = function (sphereColliderInfo) {
        let _radius = isEmpty(sphereColliderInfo.radius) ? 0.5 : sphereColliderInfo.radius;
        let _useCustomPos = isEmpty(sphereColliderInfo.useCustomPos) ? false : sphereColliderInfo.useCustomPos;
        let _pos = isEmpty(sphereColliderInfo.pos) ? [0, 0, 0] : sphereColliderInfo.pos;
        if (!_useCustomPos) {
            const cSphereColliderInfo = {
                m_dRadius: _radius,
                m_bUseCustom: _useCustomPos,
                m_vDir: [0, 0, 0],
                m_dOffset: 0,
            };
            Module.RealBIMWeb.SetTPPSphereCollider(cSphereColliderInfo);
        } else {
            const _cSphereColliderInfo = Module.RealBIMWeb.GetTPPSphereCollider();
            const _cTPPFollowInfo = Module.RealBIMWeb.GetTPPCurEntityInfo();
            const _arrEntityList = BlackHole3D.Entity.getEntitys(_cTPPFollowInfo.m_wstrProjName, '');
            const _cFindEntity = _arrEntityList.find((item) => item.elemId === _cTPPFollowInfo.m_uEntityID);
            const entityPos = _cFindEntity.offset;
            // 计算方向向量（从pos1到pos2）
            const dir = [_pos[0] - entityPos[0], _pos[1] - entityPos[1], _pos[2] - (entityPos[2] + _cSphereColliderInfo.m_dRadius)]; //高度需要处理半径
            // 计算偏移距离（两点之间的直线距离）
            const offset = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
            const cSphereColliderInfo = {
                m_dRadius: _radius,
                m_bUseCustom: _useCustomPos,
                m_vDir: dir,
                m_dOffset: offset,
            };
            Module.RealBIMWeb.SetTPPSphereCollider(cSphereColliderInfo);
        }
    };

    /**
     * 获取碰撞球信息
     */
    Module.Camera.getTPPSphereCollider = function () {
        const _cSphereColliderInfo = Module.RealBIMWeb.GetTPPSphereCollider();
        const _cTPPFollowInfo = Module.RealBIMWeb.GetTPPCurEntityInfo();
        const _arrEntityList = BlackHole3D.Entity.getEntitys(_cTPPFollowInfo.m_wstrProjName, '');
        const _cFindEntity = _arrEntityList.find((item) => item.elemId === _cTPPFollowInfo.m_uEntityID);

        if (_cFindEntity) {
            const dir = _cSphereColliderInfo.m_vDir;
            const offset = _cSphereColliderInfo.m_dOffset;
            const entityPos = _cFindEntity.offset;
            // 计算偏移向量（单位方向向量 × 偏移距离）
            const offsetVector = [dir[0] * offset, dir[1] * offset, dir[2] * offset];
            // 计算新坐标（原始坐标 + 偏移向量）高度需要处理半径
            const newPos = [
                entityPos[0] + offsetVector[0],
                entityPos[1] + offsetVector[1],
                entityPos[2] + offsetVector[2] + _cSphereColliderInfo.m_dRadius,
            ];

            let _sphereColliderInfo = new RETPPSphereColliderInfo();
            _sphereColliderInfo.radius = _cSphereColliderInfo.m_dRadius;
            _sphereColliderInfo.useCustomPos = _cSphereColliderInfo.m_bUseCustom;
            _sphereColliderInfo.pos = newPos;
            return _sphereColliderInfo;
        }

        return null;
    };

    class RETPPFollowInfo {
        // 相机跟随碰撞球信息
        constructor() {
            this.dataSetId = ''; //数据集标识
            this.elemId = 0; //构件标识
        }
    }
    ExtModule.RETPPFollowInfo = RETPPFollowInfo;

    /**
     * 设置相机跟随构件信息
     * @param {RETPPFollowInfo} tppFollowInfo //相机跟随信息（RETPPFollowInfo 类型）
     */
    Module.Camera.setCamTPPElem = function (tppFollowInfo) {
        if (isEmptyLog(tppFollowInfo.dataSetId, 'dataSetId')) return;
        if (isEmptyLog(tppFollowInfo.elemId, 'elemId')) return;
        const cTPPFollowInfo = {
            m_bFollow: true,
            m_wstrProjName: tppFollowInfo.dataSetId,
            m_uEntityID: tppFollowInfo.elemId,
        };
        return Module.RealBIMWeb.SetTPPEntityInfo(cTPPFollowInfo);
    };

    /**
     * 获取相机跟随构件信息
     */
    Module.Camera.getCamTPPElem = function () {
        const cTPPFollowInfo = Module.RealBIMWeb.GetTPPCurEntityInfo();
        let _tppFollowInfo = new RETPPFollowInfo();
        _tppFollowInfo.dataSetId = cTPPFollowInfo.m_wstrProjName;
        _tppFollowInfo.elemId = cTPPFollowInfo.m_uEntityID;
        return _tppFollowInfo;
    };

    /**
     * 获取是否在第三人称状态
     */
    Module.Camera.getIsTPP = function () {
        return Module.RealBIMWeb.GetIsTPP();
    };

    // MARK 碰撞检测
    /**
     * 获取碰撞检测的开启状态
     */
    Module.Camera.getCamCollideState = function () {
        return Module.RealBIMWeb.GetCamCollideState();
    };

    /**
     * 设置碰撞检测的开启状态
     * @param {Boolean} enable //是否开启
     */
    Module.Camera.setCamCollideState = function (enable) {
        Module.RealBIMWeb.SetCamCollideState(enable);
    };

    // MARK 重力模拟
    /**
     * 获取重力模拟的开启状态
     */
    Module.Camera.getCamGravityState = function () {
        return Module.RealBIMWeb.GetCamGravityState();
    };

    /**
     * 设置重力模拟的开启状态
     * @param {Boolean} enable //是否开启
     */
    Module.Camera.setCamGravityState = function (enable) {
        Module.RealBIMWeb.SetCamGravityState(enable);
    };

    /**
     * 获取重力模拟时的相机高度
     */
    Module.Camera.getCamGravityHeight = function () {
        return Module.RealBIMWeb.GetCamHeightOnGravOpen();
    };

    /**
     * 设置重力模拟时的相机高度
     * @param {Number} height //高度
     */
    Module.Camera.setCamGravityHeight = function (height) {
        Module.RealBIMWeb.SetCamHeightOnGravOpen(height);
    };

    // MARK 动画

    class RECamBindEntityBoneInfo {
        constructor() {
            this.dataSetId = null; // 数据集标识
            this.elemId = null; // 构件唯一标识
            this.initPos = null; // 相机基点位置
            this.lookDir = null; // 相机视线方向
            this.transTime = null; // 表示当前相机过渡到初始方位所需的时长，默认1s
        }
    }
    ExtModule.RECamBindEntityBoneInfo = RECamBindEntityBoneInfo;

    /**
     * 绑定主场景相机到一个单构件动画骨骼上
     * @param {RECamBindEntityBoneInfo} bindInfo //绑定信息（RECamBindEntityBoneInfo 类型）
     */
    Module.Camera.setCamBindEntityBone = function (bindInfo) {
        if (isEmptyLog(bindInfo, 'bindInfo')) return;
        if (isEmptyLog(bindInfo.dataSetId, 'dataSetId')) return;
        if (isEmptyLog(bindInfo.elemId, 'elemId')) return;
        if (isEmptyLog(bindInfo.initPos, 'initPos')) return;
        if (isEmptyLog(bindInfo.lookDir, 'lookDir')) return;
        let _transTime = isEmpty(bindInfo.transTime) ? 1.0 : bindInfo.transTime;
        Module.RealBIMWeb.BindCamToEntityBone_Dir(bindInfo.dataSetId, bindInfo.elemId, 0, bindInfo.initPos, bindInfo.lookDir, _transTime);
    };

    /**
     * 除主场景相机到动画骨骼上的绑定
     */
    Module.Camera.clearCamBindBone = function () {
        Module.RealBIMWeb.ClearBindCamToBone(true);
    };

    // MOD-- 天空盒（SkyBox） <---
    Module.SkyBox = typeof Module.SkyBox !== 'undefined' ? Module.SkyBox : {}; //增加 SkyBox 模块

    class RESkyInfo {
        //天空信息
        constructor() {
            this.skyTexPaths = null; //天空盒图片路径，字符串数组，顺序分别为X+、X-、Z+、Z-、Y+、Y-，
            this.sunMode = 1; //光照模式 0：表示默认没有太阳 1：使用天空盒自带的太阳/月亮 2：根据光照方向arrSunDir自动生成太阳
            this.sunDir = null; //光源方向，设置方法为，将太阳放置屏幕空间中心位置，通过REgetCamLocationDir接口获取当前的相机方向m_qCamDir，取反即可，例如：获取到的方向m_qCamDir为[-0.59, -0.62, 0.5]，则此参数填[0.59, 0.62, -0.5]即可
            this.isNight = false; //表示是否晚上，true表示晚上，false表示白天
            this.exposeScale = 1.0; //曝光度，大于0，默认设为1即可，值越大，场景越亮
        }
    }
    ExtModule.RESkyInfo = RESkyInfo;

    /**
     * 设置天空的启用状态
     * @param {Boolean} enable //是否启用
     */
    Module.SkyBox.setEnable = function (enable) {
        Module.RealBIMWeb.SetSkyEnable(enable);
    };

    /**
     * 获取天空的启用状态
     */
    Module.SkyBox.getEnable = function () {
        return Module.RealBIMWeb.GetSkyEnable();
    };

    /**
     * 设置天空盒的背景颜色
     * @param {REColor} color //颜色
     */
    Module.SkyBox.setBackClr = function (color) {
        if (isEmptyLog(color, 'color')) return;
        var _red = color.red / 255.0;
        var _green = color.green / 255.0;
        var _blue = color.blue / 255.0;
        var clrarr = [_red, _green, _blue];
        Module.RealBIMWeb.SetBackColor(clrarr);
    };

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
    };

    /**
     * 设置天空盒的相关信息
     * @param {RESkyInfo} skyInfo //天空信息
     */
    Module.SkyBox.setSkyInfo = function (skyInfo) {
        if (isEmptyLog(skyInfo, 'skyInfo')) return;
        if (isEmptyLog(skyInfo.skyTexPaths, 'skyTexPaths')) return;
        var _sunMode = 1;
        if (!isEmpty(skyInfo.sunMode)) _sunMode = skyInfo.sunMode;
        var _sunDir = [0.59215283, 0.63194525, -0.50000012];
        if (!isEmpty(skyInfo.sunDir)) {
            var v01 = skyInfo.sunDir[0];
            if (v01 == 0) v01 = 0.00001;
            var v02 = skyInfo.sunDir[1];
            if (v02 == 0) v02 = 0.00001;
            var v03 = skyInfo.sunDir[2];
            // 2596之前 光照方向Z不能为从下向上，故不能为正值
            // 2596版本之后放开限制，光源方向可以自下而上，作用于球面系统，在此状态下灯光效果最佳
            if (v03 == 0) {
                v03 = -0.00001;
            }
            // else if (v03 > 0) {
            //     v03 = v03 * -1;
            // }
            _sunDir = [v01, v02, v03];
        }
        var _isNight = false;
        if (!isEmpty(skyInfo.isNight)) _isNight = skyInfo.isNight;
        var _exposeScale = 1.0;
        if (!isEmpty(skyInfo.exposeScale)) _exposeScale = skyInfo.exposeScale;

        var pathTemps = new Module.RE_Vector_Str();
        for (let i = 0; i < skyInfo.skyTexPaths.length; i++) {
            pathTemps.push_back(skyInfo.skyTexPaths[i]);
        }
        var _SkyInfo = {
            m_arrSkyTexPaths: pathTemps,
            m_bRightHand: true,
            m_bAutoSun: _sunMode > 1 ? true : false,
            m_vDirectLDir: _sunDir,
            m_vAmbLightClr: [2.0, 2.0, 2.0],
            m_vDirLightClr: _sunMode > 0 ? (_isNight ? [1.0, 1.0, 1.0] : [8.0, 8.0, 8.0]) : [0.0, 0.0, 0.0],
            m_fDynExposeAmp: _isNight ? _exposeScale * 0.1 : _exposeScale * 1.0,
            m_fDynExposeRange: 10.0,
        };
        Module.RealBIMWeb.SetSkyInfo(_SkyInfo);
    };

    /**
     * 重置天空盒设置
     */
    Module.SkyBox.resetSkyInfo = function () {
        var _skyTexPaths = [
            '!(RealBIMAppFileCache)/skypics/oasisday_front.jpg.dds',
            '!(RealBIMAppFileCache)/skypics/oasisday_back.jpg.dds',
            '!(RealBIMAppFileCache)/skypics/oasisday_right.jpg.dds',
            '!(RealBIMAppFileCache)/skypics/oasisday_left.jpg.dds',
            '!(RealBIMAppFileCache)/skypics/oasisday_top.jpg.dds',
            '!(RealBIMAppFileCache)/skypics/oasisday_bottom.jpg.dds',
        ];
        var pathTemps = new Module.RE_Vector_Str();
        for (let i = 0; i < _skyTexPaths.length; i++) {
            pathTemps.push_back(_skyTexPaths[i]);
        }
        var _SkyInfo = {
            m_arrSkyTexPaths: pathTemps,
            m_bRightHand: false,
            m_bAutoSun: false,
            m_vDirectLDir: [0.59215283, 0.63194525, -0.50000012],
            m_vAmbLightClr: [2.0, 2.0, 2.0],
            m_vDirLightClr: [8.0, 8.0, 8.0],
            m_fDynExposeAmp: 1.0,
            m_fDynExposeRange: 10.0,
        };
        Module.RealBIMWeb.SetSkyInfo(_SkyInfo);
    };

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
        var _sunMode = _skyInfo.m_bAutoSun ? 2 : _skyInfo.m_vDirLightClr.toString() === [0, 0, 0].toString() ? 0 : 1;
        var _isNight = _skyInfo.m_vDirLightClr.toString() === [1, 1, 1].toString() ? true : false;
        var _exposeScale = _isNight ? _skyInfo.m_fDynExposeAmp * 10 : _skyInfo.m_fDynExposeAmp;
        skyInfo.skyTexPaths = pathTemps;
        skyInfo.sunMode = _sunMode;
        skyInfo.sunDir = _skyInfo.m_vDirectLDir;
        skyInfo.isNight = _isNight;
        skyInfo.exposeScale = _exposeScale;
        return skyInfo;
    };

    /**
     * 设置场景光源方向
     * @param {dvec3} sunDir //光源方向
     */
    Module.SkyBox.setLightLocate = function (sunDir) {
        if (isEmptyLog(sunDir, 'sunDir')) return;
        var _lightInfo = Module.RealBIMWeb.GetSceLightInfo();
        _lightInfo.m_vDirectLDir = sunDir;
        Module.RealBIMWeb.SetSceLightInfo(_lightInfo);
    };

    /**
     * 获取当前场景光源方向
     */
    Module.SkyBox.getLightLocate = function () {
        return Module.RealBIMWeb.GetSceLightInfo().m_vDirectLDir;
    };

    /**
     * 设置天空大气散射激活状态
     * @param {Boolean} active //是否激活
     */
    Module.SkyBox.setSkyAtmActive = function (active) {
        Module.RealBIMWeb.SetSkyAtmActive(active);
    };

    /**
     * 获取天空大气散射激活状态
     */
    Module.SkyBox.getSkyAtmActive = function () {
        return Module.RealBIMWeb.GetSkyAtmActive();
    };

    /**
     * 设置天空大气散射的雾效强度
     * @param {Number} amp //强度，默认值为1，取值范围0~10
     */
    Module.SkyBox.setSkyAtmFogAmp = function (amp) {
        var _fAmp = 1.0;
        if (!isEmpty(amp)) _fAmp = Math.max(0, Math.min(amp, 10));
        Module.RealBIMWeb.SetSkyAtmFogAmp(_fAmp);
    };

    /**
     * 获取天空大气散射的雾效强度
     */
    Module.SkyBox.getSkyAtmFogAmp = function () {
        return Module.RealBIMWeb.GetSkyAtmFogAmp();
    };

    /**
     * 设置背景图的启用状态
     * @param {Boolean} enable //是否启用
     */
    Module.SkyBox.setBackImgEnable = function (enable) {
        Module.RealBIMWeb.SetBackImgEnable(enable);
    };

    /**
     * 获取背景图的启用状态
     */
    Module.SkyBox.getBackImgEnable = function () {
        return Module.RealBIMWeb.GetBackImgEnable();
    };

    /**
     * 设置背景图片路径
     * @param {String} imgPath //图片路径
     */
    Module.SkyBox.setBackImgPath = function (imgPath) {
        if (isEmptyLog(imgPath, 'imgPath')) return false;
        return Module.RealBIMWeb.SetBackImgPath(imgPath);
    };

    /**
     * 获取背景图片路径
     */
    Module.SkyBox.getBackImgPath = function () {
        return Module.RealBIMWeb.GetBackImgPath();
    };

    /**
     * 设置背景图片填充方式
     * @param {Number} fillMode //填充方式,
     * 0: 拉伸 (让一张图片占满桌面 )
     * 1: 适应 (图片也是等比缩放，只不过图片的最大边放大到屏幕最小边时就不再放大，也就是能保持图片比例的同时最大化显示图片 )
     * 2: 填充 (图片也是等比缩放，按照图片的最小边来适应屏幕的最大边以达到填充屏幕效果，如果图片分辨率和屏幕的比例不一样的话，图片会有部分显示不了（超出屏幕之外）)
     */
    Module.SkyBox.setBackImgFillMode = function (fillMode) {
        return Module.RealBIMWeb.SetBackImgFillMode(fillMode, [0.0, 0.0, 1.0, 1.0]);
    };

    /**
     * 获取背景图片填充方式
     */
    Module.SkyBox.getBackImgFillMode = function () {
        return Module.RealBIMWeb.GetBackImgFillMode();
    };

    // MOD-- 坐标（Coordinate） <---
    Module.Coordinate = typeof Module.Coordinate !== 'undefined' ? Module.Coordinate : {}; //增加 Coordinate 模块

    class RELocInfo {
        constructor() {
            this.scale = null; //缩放
            this.rotate = null; //旋转
            this.offset = null; //平移
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
    };

    /**
     * 增加一套自定义坐标系
     * @param {String} name //坐标系的显示名称
     * @param {Array} refPotList //表示引擎世界空间的4个标记点
     * @param {Array} targetPotList //表示与引擎世界空间4个标记点一一对应的自定义坐标系中的4个点
     */
    Module.Coordinate.addCustomCoord = function (name, refPotList, targetPotList) {
        if (isEmptyLog(name, 'name')) return;
        if (isEmptyLog(refPotList, 'refPotList')) return;
        if (isEmptyLog(targetPotList, 'targetPotList')) return;
        var ref01 = refPotList[0];
        var ref02 = refPotList[1];
        var ref03 = refPotList[2];
        var ref04 = refPotList[3];
        var target01 = targetPotList[0];
        var target02 = targetPotList[1];
        var target03 = targetPotList[2];
        var target04 = targetPotList[3];
        return Module.RealBIMWeb.AddCustomCoord(name, ref01, ref02, ref03, ref04, target01, target02, target03, target04);
    };

    /**
     * 删除一套地理信息坐标
     * @param {String} name //坐标系的显示名称
     */
    Module.Coordinate.delGeoCoord = function (name) {
        return Module.RealBIMWeb.DelGeoCoordInfo(name);
    };

    /**
     * 设置当前选中展示的地理信息坐标
     * @param {String} name //坐标系的显示名称, 空字符串为默认地理信息坐标
     */
    Module.Coordinate.setCurrSelGeoCoord = function (name) {
        let _name = isEmpty(name) || name === '' ? '引擎坐标' : name;
        Module.RealBIMWeb.SetCurrentCoordSystemShapeName(_name);
    };

    /**
     * 设置某个项目的整体坐标偏移
     * @param {String} dataSetId //数据集标识
     * @param {RELocInfo} locInfo //表示偏移信息（RELocInfo 类型）
     */
    Module.Coordinate.setDataSetTransform = function (dataSetId, locInfo) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(locInfo, 'locInfo')) return;

        var _scale = [1, 1, 1];
        if (!isEmpty(locInfo.scale)) _scale = locInfo.scale;
        var _rotate = [0, 0, 0, 1];
        if (!isEmpty(locInfo.rotate)) _rotate = locInfo.rotate;
        var _offset = [0, 0, 0];
        if (!isEmpty(locInfo.offset)) _offset = locInfo.offset;
        var _transinfo = {
            m_vScale: _scale,
            m_qRotate: _rotate,
            m_vOffset: _offset,
        };
        return Module.RealBIMWeb.SetMainSceTransform(dataSetId, _transinfo);
    };

    /**
     * 获取某个项目的整体坐标偏移信息
     * @param {String} dataSetId //数据集标识
     */
    Module.Coordinate.getDataSetTransform = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        var _tranform = Module.RealBIMWeb.GetMainSceTransform(dataSetId);
        var locInfo = new RELocInfo();
        locInfo.scale = _tranform.m_vScale;
        locInfo.rotate = _tranform.m_qRotate;
        locInfo.offset = _tranform.m_vOffset;
        return locInfo;
    };

    /**
     * 设置引擎世界空间对应的坐标参考系信息
     * @param {String} worldCRS //表示引擎世界空间对应的坐标参考系描述符(标准PROJ坐标系字符串)，为空串表示无特殊地理信息坐标系
     */
    Module.Coordinate.setEngineWorldCRS = function (worldCRS) {
        return Module.RealBIMWeb.SetEngineWorldCRS(worldCRS);
    };

    /**
     * 获取引擎世界空间坐标系描述符
     */
    Module.Coordinate.getEngineWorldCRS = function () {
        var _info = Module.RealBIMWeb.GetEngineWorldCRS();
        return _info.m_strCRS;
    };

    /**
     * 在引擎世界空间坐标与目标地理信息坐标间进行转换
     * @param {Boolean} forward //转换顺序：true->由引擎世界空间坐标转换到目标地理信息坐标；false->由目标地理信息坐标转换到引擎世界空间坐标
     * @param {String} destCRS //表示目标坐标系描述符，当引擎坐标系描述符和目标坐标系描述符均为空时则坐标无需转换成功返回，否则任一描述符为空将导致转换失败
     * @param {Array} coordList //输入待转换的坐标数组
     */
    Module.Coordinate.getTransEngineCoords = function (forward, destCRS, coordList) {
        var _s = coordList.length;
        var _s01 = (_s * 24).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01);
        var temparr1 = Module.RealBIMWeb.GetHeapView_Double(0);
        for (let i = 0; i < _s; ++i) {
            temparr1[i * 3 + 0] = coordList[i][0];
            temparr1[i * 3 + 1] = coordList[i][1];
            temparr1[i * 3 + 2] = coordList[i][2];
        }
        var temparr2 = [];
        var bool = Module.RealBIMWeb.TransEngineCoords(forward, destCRS, temparr1.byteLength, temparr1.byteOffset);
        if (bool) {
            var temparr3 = Module.RealBIMWeb.GetHeapView_Double(0);
            for (let i = 0; i < _s; ++i) {
                temparr2.push([temparr3[i * 3 + 0], temparr3[i * 3 + 1], temparr3[i * 3 + 2]]);
            }
        }
        return temparr2;
    };

    /**
     * 进行任意两个标准地理信息坐标转换
     * @param {String} srcCRS //表示源坐标系描述符
     * @param {String} destCRS //表示目标坐标系描述符
     * @param {Array} coordList //输入待转换的坐标数组
     */
    Module.Coordinate.getTransGeoCoords = function (srcCRS, destCRS, coordList) {
        var _s = coordList.length;
        var _s01 = (_s * 32).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01);
        var temparr1 = Module.RealBIMWeb.GetHeapView_Double(0);
        for (let i = 0; i < _s; ++i) {
            temparr1[i * 4 + 0] = coordList[i][0];
            temparr1[i * 4 + 1] = coordList[i][1];
            temparr1[i * 4 + 2] = coordList[i][2];
            temparr1[i * 4 + 3] = coordList[i][3];
        }
        var temparr2 = [];
        var bool = Module.RealBIMWeb.TransGeoCoords(srcCRS, destCRS, temparr1.byteLength, temparr1.byteOffset);
        if (bool) {
            var temparr3 = Module.RealBIMWeb.GetHeapView_Double(0);
            for (let i = 0; i < _s; ++i) {
                temparr2.push([temparr3[i * 4 + 0], temparr3[i * 4 + 1], temparr3[i * 4 + 2], temparr3[i * 4 + 3]]);
            }
        }
        return temparr2;
    };

    /**
     * 由世界空间坐标转换到屏幕空间坐标
     * @param {Array} worldPos //表示世界空间坐标
     * @param {Number} scaleDist //表示与worldPos关联的某对象在世界空间中的最小缩放距离
     */
    Module.Coordinate.getWorldPosToScreenPos = function (worldPos, scaleDist) {
        var _dScaleDist = 1e20;
        if (!isEmpty(scaleDist)) _dScaleDist = scaleDist;
        return Module.RealBIMWeb.WorldPosToScreenPos(worldPos, _dScaleDist);
    };

    /**
     * 根据仿射变换信息进行坐标转换
     * @param {Array} coordList //输入待转换的坐标数组
     * @param {RELocInfo} tranInfo //依据的仿射变换信息（RELocInfo 类型）
     * @param {Boolean} forward //转换方式，true：空间坐标进行正向的仿射变换；false：对空间坐标进行逆向的仿射变换
     */
    Module.Coordinate.getTransCoords = function (coordList, tranInfo, forward) {
        var _s = coordList.length;
        var _s01 = (_s * 24).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_s01);
        var temparr1 = Module.RealBIMWeb.GetHeapView_Double(0);
        for (let i = 0; i < _s; ++i) {
            temparr1[i * 3 + 0] = coordList[i][0];
            temparr1[i * 3 + 1] = coordList[i][1];
            temparr1[i * 3 + 2] = coordList[i][2];
        }
        var temparr2 = [];
        let _forward = isEmpty(forward) ? true : forward;
        var bool = Module.RealBIMWeb.TransCoords(
            _forward,
            tranInfo.scale,
            tranInfo.rotate,
            tranInfo.offset,
            temparr1.byteLength,
            temparr1.byteOffset
        );
        if (bool) {
            var temparr3 = Module.RealBIMWeb.GetHeapView_Double(0);
            for (let i = 0; i < _s; ++i) {
                temparr2.push([temparr3[i * 3 + 0], temparr3[i * 3 + 1], temparr3[i * 3 + 2]]);
            }
        }
        return temparr2;
    };

    /**
     * 获取坐标显示的精度
     */
    Module.Coordinate.getValueDispPrecision = function () {
        return Module.RealBIMWeb.GetFloatValueDispPrecision();
    };

    /**
     * 设置坐标显示的精度
     * @param {Number} precision //精度（正整数）
     */
    Module.Coordinate.setValueDispPrecision = function (precision) {
        Module.RealBIMWeb.SetFloatValueDispPrecision(precision);
    };

    class REWorldPosInfo {
        constructor() {
            this.worldPosId = null; //表示世界空间坐标的标识名
            this.viewportId = 0; //表示世界空间坐标所归属的视口ID，默认为0单视口
            this.pos = null; //表示世界空间坐标
            this.scaleDist = 0.1; //表示与 worldPoint 关联的某对象在世界空间中的最小缩放距离，当 worldPoint 与相机的距离大于该值则对象开始缩放
        }
    }
    ExtModule.REWorldPosInfo = REWorldPosInfo;

    /**
     * 注册一个世界空间坐标标记（世界坐标信息变动将会通过监听事件 REWorldPosChange 进行返回）
     * @param {REWorldPosInfo} coordinateInfo //表示世界空间坐标信息
     */
    Module.Coordinate.registerWorldPos = function (coordinateInfo) {
        if (isEmptyLog(coordinateInfo, 'coordinateInfo')) return;
        if (isEmptyLog(coordinateInfo.worldPosId, 'worldPosId')) return;
        if (isEmptyLog(coordinateInfo.pos, 'pos')) return;
        return Module.RealBIMWeb.RegisterWorldPos(coordinateInfo.worldPosId, coordinateInfo.viewportId, coordinateInfo.pos, coordinateInfo.scaleDist);
    };

    /**
     * 注销一个世界空间坐标标记
     * @param {String} worldPosId //表示世界空间坐标的标识名
     */
    Module.Coordinate.unRegisterWorldPos = function (worldPosId) {
        if (isEmptyLog(worldPosId, 'worldPosId')) return;
        Module.RealBIMWeb.UnRegisterWorldPos(worldPosId);
    };

    /**
     * 注销所有世界空间坐标标记
     */
    Module.Coordinate.unRegisterAllWorldPos = function () {
        return Module.RealBIMWeb.UnRegisterAllWorldPos();
    };

    // MOD-- 鼠标探测（Probe） <---
    Module.Probe = typeof Module.Probe !== 'undefined' ? Module.Probe : {}; //增加 Probe 模块

    class REProbeInfo {
        constructor() {
            this.dataSetId = null; //数据集唯一标识
            this.dataSetIdList = null; //数据集唯一标识集合
            this.elemType = null; //表示拾取到的最上层渲染对象类型
            this.elemId = null; //构件标识
            this.elemPos = null; //选择构件坐标
            this.elemCenter = null; //选择构件几何中心点
            this.elemBV = null; //选择构件包围盒信息
            this.elemScrPos = null; //选择构件相对屏幕二维坐标（原点为屏幕左下角）
        }
    }
    ExtModule.REProbeInfo = REProbeInfo;

    class REProbeShpInfo {
        constructor() {
            this.elemId = null; //构件标识
            this.elemPos = null; //选择构件坐标
            this.elemScrPos = null; //选择构件相对屏幕二维坐标（原点为屏幕左下角）
        }
    }
    ExtModule.REProbeShpInfo = REProbeShpInfo;

    /**
     * 设置鼠标悬停事件的参数
     * @param {Number} waitTime //鼠标静止后等待多长时间才发送悬停事件
     */
    Module.Probe.setMouseHoverEventTime = function (waitTime) {
        Module.RealBIMWeb.SetMouseHoverEventParam(waitTime);
    };

    /**
     * 获取鼠标悬停事件的参数
     */
    Module.Probe.getMouseHoverEventTime = function () {
        return Module.RealBIMWeb.GetMouseHoverEventParam();
    };

    /**
     * 设置鼠标移动事件的参数
     * @param {Boolean} enable //是否向外界发送鼠标移动事件
     */
    Module.Probe.setMouseMoveEventEnable = function (enable) {
        Module.RealBIMWeb.SetMouseMoveEventParam(enable);
    };

    /**
     * 获取鼠标移动事件的参数
     */
    Module.Probe.getMouseMoveEventEnable = function () {
        return Module.RealBIMWeb.GetMouseMoveEventParam();
    };

    /**
     * 设置构件是否可探测
     * @param {String} dataSetId //数据集唯一标识
     * @param {Array} elemIdList //要设置的构件ID集合,为空则表示设置所有构件的可探测性
     * @param {Boolean} probeEnable //是否可以探测，为true,表示可被探测；设为false,表示不可被探测
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.Probe.setElemsCanProbe = function (dataSetId, elemIdList, probeEnable, elemScope) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;

        // var _projName = "DefaultProj"; if (typeof projName != 'undefined') { _projName = projName; }
        var _elemScope = 0;
        if (!isEmpty(elemScope)) _elemScope = elemScope;
        var projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var _count = elemIdList.length;
        if (_count == 0) {
            //如果构件ID集合为空，则默认为设置所有构件
            Module.RealBIMWeb.SetHugeObjSubElemProbeMasks(dataSetId, '', 0xffffffff, 0, probeEnable, _elemScope);
        } else {
            var _moemory = (_count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (let i = 0; i < _count; ++i) {
                var eleid = elemIdList[i];
                _elemIds.set([eleid, projid], i * 2);
            }
            Module.RealBIMWeb.SetHugeObjSubElemProbeMasks(dataSetId, '', _elemIds.byteLength, _elemIds.byteOffset, probeEnable, _elemScope);
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.Probe.setElemsCanProbe = sharding_createShardingConstuctor(Module.Probe.setElemsCanProbe, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 获取当前选中点相关参数
     */
    Module.Probe.getCurProbeRet = function () {
        var _probeRet = Module.RealBIMWeb.GetCurProbeRet(Module.RE_PROBE_TYPE.POT);
        var probeInfo = new REProbeInfo();

        let dataSetId = _probeRet.m_strProjName;
        if (_probeRet.m_uSelActorSubID_L32 >= 0xfffffffe) {
            if (dataSetId.length > 0) {
                //老地形数据
                probeInfo.elemType = 'GridElem';
                probeInfo.dataSetId = dataSetId;
            } else {
                //新地形数据
                probeInfo.elemType = 'TerrainElem';
                let dataSetIdList = Module.Terrain.getTerrSubAllDataSetId(_probeRet.m_strSelActorName);
                if (dataSetIdList.length > 0) {
                    probeInfo.dataSetIdList = dataSetIdList;
                } else {
                    probeInfo.dataSetId = dataSetId;
                }
            }
        } else if (_probeRet.m_uSelActorSubID_L32 == 0xfffffff0) {
            //辅助元素（包括挤出元素）
            probeInfo.elemType = 'AuxElem';
            probeInfo.dataSetId = dataSetId;
        } else {
            //BIM元素
            probeInfo.elemType = 'BIMElem';
            probeInfo.dataSetId = dataSetId;
        }

        probeInfo.elemId = _probeRet.m_uSelActorSubID_L32;
        probeInfo.elemPos = _probeRet.m_vSelPos;
        probeInfo.elemScrPos = _probeRet.m_vSelScrPos;
        probeInfo.elemCenter = _probeRet.m_vSelCenter;
        probeInfo.elemBV = _probeRet.m_bbSelBV;
        return removeEmptyProperty(probeInfo);
    };

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
    };

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
        if (_probeShpRet.m_strSelShpObjName != '') {
            //矢量元素
            probeShpInfo.elemType = 'ShapeElem';
            probeShpInfo.elemId = _probeShpRet.m_strSelShpObjName;
            probeShpInfo.elemPos = _probeShpRet.m_vSelPos;
            probeShpInfo.elemScrPos = _probeShpRet.m_vSelScrPos;
            return removeEmptyProperty(probeShpInfo);
        } else if (_probeRet.m_strSelActorName != '') {
            let dataSetId = _probeRet.m_strProjName;
            if (_probeRet.m_uSelActorSubID_L32 >= 0xfffffffe) {
                if (dataSetId.length > 0) {
                    //老地形数据
                    probeInfo.elemType = 'GridElem';
                    probeInfo.dataSetId = dataSetId;
                } else {
                    //新地形数据
                    probeInfo.elemType = 'TerrainElem';
                    let dataSetIdList = Module.Terrain.getTerrSubAllDataSetId(_probeRet.m_strSelActorName);
                    if (dataSetIdList.length > 0) {
                        probeInfo.dataSetIdList = dataSetIdList;
                    } else {
                        probeInfo.dataSetId = dataSetId;
                    }
                }
            } else if (_probeRet.m_uSelActorSubID_L32 == 0xfffffff0) {
                //辅助元素（包括挤出元素）
                probeInfo.elemType = 'AuxElem';
                probeInfo.dataSetId = dataSetId;
            } else {
                //BIM元素
                probeInfo.elemType = 'BIMElem';
                probeInfo.dataSetId = dataSetId;
            }

            probeInfo.elemId = _probeRet.m_uSelActorSubID_L32;
            probeInfo.elemPos = _probeRet.m_vSelPos;
            probeInfo.elemScrPos = _probeRet.m_vSelScrPos;
            probeInfo.elemCenter = _probeRet.m_vSelCenter;
            probeInfo.elemBV = _probeRet.m_bbSelBV;
            return removeEmptyProperty(probeInfo);
        } else {
            //没有拾取到任何对象
            return { elemType: '', selPos: _probeRet.m_vSelPos, selScrPos: _probeRet.m_vSelScrPos };
        }
    };

    class RESelInfo {
        constructor() {
            this.selType = null; //表示拾取到的最上层渲染对象类型
            this.selPos = null; //选择点坐标
            this.selScrPos = null; //选择点坐标相对屏幕二维坐标（原点为屏幕左下角）
            this.elemId = null; //构件标识
            this.shpId = null; //矢量标识
            this.dataSetId = null; //数据集唯一标识
            this.dataSetIdList = null; //数据集唯一标识集合
            this.selTargetCenter = null; //选择构件几何中心点
            this.selTargetBV = null; //选择构件包围盒信息
        }
    }
    ExtModule.RESelInfo = RESelInfo;

    /**
     * 获取当前探测选中的信息
     */
    Module.Probe.getCurSelInfo = function () {
        var selInfo = new RESelInfo();
        var _probeRet = Module.RealBIMWeb.GetCurProbeRet(Module.RE_PROBE_TYPE.POT);
        var _probeShpRet = Module.RealBIMWeb.GetCurShpProbeRet(Module.RE_SHP_PROBE_TYPE.NORM);
        // console.log("_probeRet",_probeRet);
        // console.log("_probeShpRet",_probeShpRet);
        if (_probeShpRet.m_strSelShpObjName != '') {
            //矢量元素
            selInfo.selType = 'ShapeElem';
            selInfo.shpId = _probeShpRet.m_strSelShpObjName;
            selInfo.selPos = _probeShpRet.m_vSelPos;
            selInfo.selScrPos = _probeShpRet.m_vSelScrPos;
            return removeEmptyProperty(selInfo);
        } else if (_probeRet.m_strSelActorName != '') {
            let dataSetId = _probeRet.m_strProjName;
            if (_probeRet.m_uSelActorSubID_L32 >= 0xfffffffe) {
                if (dataSetId.length > 0) {
                    //老地形数据
                    selInfo.selType = 'GridElem';
                    selInfo.dataSetId = dataSetId;
                } else {
                    //新地形数据
                    selInfo.selType = 'TerrainElem';
                    let dataSetIdList = Module.Terrain.getTerrSubAllDataSetId(_probeRet.m_strSelActorName);
                    if (dataSetIdList.length > 0) {
                        selInfo.dataSetIdList = dataSetIdList;
                    } else {
                        selInfo.dataSetId = dataSetId;
                    }
                }
            } else if (_probeRet.m_uSelActorSubID_L32 == 0xfffffff0) {
                //辅助元素（包括挤出元素）
                selInfo.selType = 'AuxElem';
                selInfo.dataSetId = dataSetId;
            } else {
                //BIM元素
                selInfo.selType = 'BIMElem';
                selInfo.dataSetId = dataSetId;
            }
            if (_probeRet.m_uSelActorSubID_L32 != 0xfffffffe) {
                selInfo.elemId = _probeRet.m_uSelActorSubID_L32;
            }
            selInfo.selPos = _probeRet.m_vSelPos;
            selInfo.selScrPos = _probeRet.m_vSelScrPos;
            selInfo.selTargetCenter = _probeRet.m_vSelCenter;
            selInfo.selTargetBV = _probeRet.m_bbSelBV;
            return removeEmptyProperty(selInfo);
        } else {
            //没有拾取到任何对象
            selInfo.selType = '';
            selInfo.selPos = _probeRet.m_vSelPos;
            selInfo.selScrPos = _probeRet.m_vSelScrPos;
            return removeEmptyProperty(selInfo);
        }
    };

    /**
     * 设置鼠标的拾取模式
     * @param {Number} type //拾取模式
     */
    Module.Probe.setProbeMode = function (type) {
        var _type = isEmpty(type) ? Module.RE_PROBE_TYPE.NORM : type == 1 ? Module.RE_PROBE_TYPE.POT : Module.RE_PROBE_TYPE.NORM;
        Module.RealBIMWeb.SetExpectProbeMode(_type);
    };

    /**
     * 获取鼠标的拾取模式
     */
    Module.Probe.getProbeMode = function () {
        var _type = Module.RealBIMWeb.GetExpectProbeMode();
        return _type.value;
    };

    /**
     * 设置一个自定义场景探测的指令 注：探测结果在 RECustomProbeFinish 监听事件中返回
     * @param {dvec3} rayPos //表示世界空间下探测射线的位置（xyz）
     * @param {dvec3} rayDir //表示世界空间下探测射线的朝向（欧拉朝向）
     * @param {Number} index //表示自定义探测对应的批次
     */
    Module.Probe.setCustomProbeExecute = function (rayPos, rayDir, index) {
        if (isEmptyLog(rayPos, 'rayPos')) return;
        if (isEmptyLog(rayDir, 'rayDir')) return;
        let _index = isEmpty(index) ? 0 : index;
        return Module.RealBIMWeb.PerformACustomProbe(rayPos, rayDir, _index);
    };

    // MOD-- 图形显示（Graphics） <---
    Module.Graphics = typeof Module.Graphics !== 'undefined' ? Module.Graphics : {}; //增加 Graphics 模块

    // MARK 渲染设置
    /**
     * 设置引擎UI按钮面板是否可见
     * @param {Boolean} enable //是否可见
     */
    Module.Graphics.setSysUIPanelVisible = function (enable) {
        Module.RealBIMWeb.SetToolBarUIVisible(enable);
    };

    /**
     * 设置引擎右上方ViewCube是否可见
     * @param {Boolean} enable //是否可见
     */
    Module.Graphics.setViewCubeVisible = function (enable) {
        Module.RealBIMWeb.SetViewCubeVisibility(enable);
    };

    /**
     * 设置UI工具条的颜色风格
     * @param {Boolean} useDark //是否使用深色风格，默认浅色
     */
    Module.Graphics.setSysUIColorStyle = function (useDark) {
        Module.RealBIMWeb.SetBuiltInUIColorStyle(useDark);
    };

    /**
     * 获取UI工具条的颜色风格
     */
    Module.Graphics.getSysUIColorStyle = function () {
        return Module.RealBIMWeb.GetBuiltInUIColorStyle();
    };

    /**
     * 设置地理坐标系UI是否允许显示
     * @param {Boolean} enable //是否可见
     */
    Module.Graphics.setGeoCoordVisible = function (enable) {
        Module.RealBIMWeb.SetGeoCoordDisplayable(enable);
    };

    /**
     * 获取地理坐标系UI显示状态
     */
    Module.Graphics.getGeoCoordVisible = function () {
        return Module.RealBIMWeb.GetGeoCoordDisplayable();
    };

    /**
     * 设置对应系统UI的可见性
     * @param {RESysWndMateEm} uiType //控件类型（RESysWndMateEm 类型）
     * @param {Boolean} enable //是否显示
     */
    Module.Graphics.setSysUIWgtVisible = function (uiType, enable) {
        if (isEmptyLog(uiType, 'uiType')) return;
        return Module.RealBIMWeb.UIWgtSetVisible(uiType, enable);
    };

    /**
     * 获取对应系统UI的可见性
     * @param {RESysWndMateEm} uiType //控件类型（RESysWndMateEm 类型）
     */
    Module.Graphics.getSysUIWgtVisible = function (uiType) {
        if (isEmptyLog(uiType, 'uiType')) return;
        return Module.RealBIMWeb.UIWgtGetVisible(uiType);
    };

    /**
     * 恢复图形界面的模型、地形、按钮等为初始加载完成状态
     */
    Module.Graphics.resetInitialState = function () {
        Module.RealBIMWeb.ResetUserOperation(0);
    };

    /**
     * 设置系统UI面板的停靠方式
     * @param {Number} dockArea //停靠方式  0：下方停靠 1：左侧停靠  2：顶侧停靠  3：右侧停靠
     */
    Module.Graphics.setSysPanelUIDockArea = function (dockArea) {
        var _dockArea = 0;
        if (!isEmpty(dockArea)) _dockArea = dockArea;
        Module.RealBIMWeb.SetBuiltInUIDockArea(_dockArea);
    };

    /**
     * 预先载入一个指定的UI纹理
     * @param {String} picPath //图片地址
     */
    Module.Graphics.setPreLoadPicPath = function (picPath) {
        if (isEmptyLog(picPath, 'picPath')) return;
        Module.RealBIMWeb.PreLoadGUIImgs(picPath);
    };

    /**
     * 全部重置系统面板UI按钮和关联的状态
     */
    Module.Graphics.resetSysOptStateAndUI = function () {
        Module.RealBIMWeb.ResetUserOperationOnUI();
    };

    /**
     * 设置 ViewCube 的区域位置
     * @param {dvec2} areaPos //ViewCube 区域位置，取值范围【-1，1】，在范围内可以按照取值范围内的值进行调整，最大比例数值为9宫格排布方式（-1，1）左上角 （1，1）右上角 （-1，-1）左下角 （1，-1）右下角 （0，1）上 （0，-1）下 （-1，0）左 （1，0）右 （0，0）中
     */
    Module.Graphics.setViewCubeArea = function (areaPos) {
        let _areaPos = isEmpty(areaPos) ? [1, 1] : areaPos;
        return Module.RealBIMWeb.SetViewCubeCenter(_areaPos);
    };

    /**
     * 获取 ViewCube 的区域位置
     */
    Module.Graphics.getViewCubeArea = function () {
        return Module.RealBIMWeb.GetViewCubeCenter();
    };

    /**
     * 设置语言环境 注：需要在引擎加载完成后调用，即 RESystemEngineCreated 回调
     * @param {Number} type //语言类型 0: 中文 1: 英文
     */
    Module.Graphics.setLocalLanguage = function (type) {
        let _type = isEmpty(type) ? 0 : type;
        Module.RealBIMWeb.SetLocalLanguage(_type);
    };

    /**
     * 获取语言环境
     */
    Module.Graphics.getLocalLanguage = function () {
        return Module.RealBIMWeb.GetLocalLanguage();
    };

    // MARK 窗口（Wnd）
    /**
     * 获取窗口的颜色风格
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.getWndClrStyle = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtGetWndColorStyle(uiID);
    };

    /**
     * 设置窗口的颜色风格
     * @param {String} uiID //组件唯一标识
     * @param {String} clrStyleName //颜色风格名称
     */
    Module.Graphics.setWndClrStyle = function (uiID, clrStyleName) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(clrStyleName, 'clrStyleName')) return;
        return Module.RealBIMWeb.UIWgtSetWndColorStyle(uiID, clrStyleName);
    };

    /**
     * 获取Tab窗口的显示状态
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.getTabItemVisable = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtGetTabItemOpenState(uiID);
    };

    /**
     * 设置Tab窗口的显示状态
     * @param {String} uiID //组件唯一标识
     * @param {Boolean} visable //是否显示
     */
    Module.Graphics.setTabItemVisable = function (uiID, visable) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtSetTabItemOpenState(uiID, visable);
    };

    // MARK 按钮（Button）
    class REUIBtnInfo {
        constructor() {
            this.uiID = null; //组件唯一标识，重复使用创建失败
            this.stateParList = null; //按钮各个子状态的状态相关参数集合（ REUIBtnStateInfo 类型）
            this.size = null; //按钮的期望尺寸, 二元数组
            this.activeStateId = 0; //按钮的初始子状态id, stateParList 对象列表 index 下标
            this.visible = true; //是否可见，默认可见
        }
    }
    ExtModule.REUIBtnInfo = REUIBtnInfo;

    class REUIBtnStateInfo {
        constructor() {
            this.text = null; //按钮部件的文字
            this.hintText = null; //鼠标悬浮提示
            this.texPath = null; //按钮图像路径
            this.clrStyle = null; //颜色风格名称
            this.sizeStyle = null; //尺寸风格名称
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
        var _uActiveStateID = 0;
        if (!isEmpty(btnInfo.activeStateId)) _uActiveStateID = btnInfo.activeStateId;
        var _bVisible = true;
        if (!isEmpty(btnInfo.visible)) _bVisible = btnInfo.visible;
        var _bClickable = true;

        var _arrStateParams = new Module.RE_Vector_STATE_PARAMS();
        for (let i = 0; i < btnInfo.stateParList.length; i++) {
            let statePar = btnInfo.stateParList[i];
            let _par = {
                m_strText: isEmpty(statePar.text) ? '' : statePar.text,
                m_strHint: isEmpty(statePar.hintText) ? '' : statePar.hintText,
                m_strTextureURL: isEmpty(statePar.texPath) ? '' : statePar.texPath,
                m_vecClrStates: isEmpty(statePar.clrStyle)
                    ? Module.RealBIMWeb.UIWgtGetClrStyle('CS_BTN_GRAYTEXT_NOBG')
                    : Module.RealBIMWeb.UIWgtGetClrStyle(statePar.clrStyle),
                m_vecSizeStates: isEmpty(statePar.sizeStyle)
                    ? Module.RealBIMWeb.UIWgtGetSizeStyle('SS_WND_HAVE_THIN_BORDER')
                    : Module.RealBIMWeb.UIWgtGetSizeStyle(statePar.sizeStyle),
            };
            _arrStateParams.push_back(_par);
        }
        return Module.RealBIMWeb.UIWgtCreateButton(_strUIID, _arrStateParams, _vExpectSize, _uActiveStateID, _bVisible, _bClickable);
    };

    /**
     * 获取按钮当前的子状态
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.getBtnActiveState = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtGetBtnActiveSubState(uiID);
    };

    /**
     * 设置按钮当前的子状态
     * @param {String} uiID //组件唯一标识
     * @param {Number} activeStateId //按钮的初始子状态id, stateParList 对象列表 index 下标
     */
    Module.Graphics.setBtnActiveState = function (uiID, activeStateId) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(activeStateId, 'activeStateId')) return;
        return Module.RealBIMWeb.UIWgtSetBtnActiveSubState(uiID, activeStateId);
    };

    /**
     * 在系统的UI面板中添加按钮（统一样式, 只支持两种子按钮状态）
     * @param {REUIBtnInfo} btnInfo //按钮信息 （REUIBtnInfo 类型）
     * @param {String} beforeUiID //在这个组件之前插入（默认在最后面）
     */
    Module.Graphics.createSysPanelBtn = function (btnInfo, beforeUiID) {
        if (isEmptyLog(btnInfo, 'btnInfo')) return;
        const _beforeUiID = isEmpty(beforeUiID) ? '' : beforeUiID;

        var _strUIID = btnInfo.uiID;
        var _vExpectSize = [48, 48];
        var _uActiveStateID = 0;
        if (!isEmpty(btnInfo.activeStateId)) _uActiveStateID = btnInfo.activeStateId;
        var _bVisible = true;
        if (!isEmpty(btnInfo.visible)) _bVisible = btnInfo.visible;
        var _bClickable = true;
        var _wndClrStyle = Module.Graphics.getWndClrStyle == 'CS_WND_DARK' ? 1 : 0;

        var _arrStateParams = new Module.RE_Vector_STATE_PARAMS();
        for (let i = 0; i < btnInfo.stateParList.length; i++) {
            let _btnClrStyle =
                _wndClrStyle == 1 ? (i == 1 ? 'CS_BTN_WHITETEXT_NOBG' : 'CS_WND_DARK') : i == 1 ? 'CS_BTN_GRAYTEXT_BLUEBG' : 'CS_BTN_GRAYTEXT_NOBG';
            let statePar = btnInfo.stateParList[i];
            let _par = {
                m_strText: '',
                m_strHint: isEmpty(statePar.hintText) ? '' : statePar.hintText,
                m_strTextureURL: isEmpty(statePar.texPath) ? '' : statePar.texPath,
                m_vecClrStates: Module.RealBIMWeb.UIWgtGetClrStyle(_btnClrStyle),
                m_vecSizeStates: Module.RealBIMWeb.UIWgtGetSizeStyle('SS_WND_HAVE_THIN_BORDER'),
            };
            _arrStateParams.push_back(_par);
        }
        var createState = Module.RealBIMWeb.UIWgtCreateButton(_strUIID, _arrStateParams, _vExpectSize, _uActiveStateID, _bVisible, _bClickable);
        var addState = Module.Graphics.addSysPanelChildWidget(btnInfo.uiID, _beforeUiID);
        return createState && addState;
    };

    /**
     * 获取按钮的某子状态使用的纹理路径
     * @param {String} uiID //组件唯一标识
     * @param {Number} stateId //按钮的状态id, stateParList 对象列表 index 下标
     */
    Module.Graphics.getBtnStatePicPath = function (uiID, stateId) {
        if (isEmptyLog(uiID, 'uiID')) return;
        var curStateId = isEmpty(stateId) ? Module.RealBIMWeb.UIWgtGetBtnActiveSubState(uiID) : stateId;
        return Module.RealBIMWeb.UIWgtGetBtnSubStateImgURL(uiID, curStateId);
    };

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
    };

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
    };

    /**
     * 获取按钮的某子状态使用的颜色配置
     * @param {String} uiID //组件唯一标识
     * @param {Number} stateId //按钮的状态id, stateParList 对象列表 index 下标
     */
    Module.Graphics.getBtnClrStyle = function (uiID, stateId) {
        if (isEmptyLog(uiID, 'uiID')) return '';
        if (isEmptyLog(stateId, 'stateId')) return '';
        return Module.RealBIMWeb.UIWgtGetBtnColorStyle(uiID, stateId);
    };

    /**
     * 设置系统的UI面板按钮的主题颜色（只支持系统浅色和深色、只支持只有两种按钮子状态类型）
     * @param {String} uiID //组件唯一标识
     * @param {Number} clrStyle //颜色样式 0：浅色 1：深色
     */
    Module.Graphics.setSysPanelBtnClrStyle = function (uiID, clrStyle) {
        if (isEmptyLog(uiID, 'uiID')) return false;
        if (isEmptyLog(clrStyle, 'clrStyle')) return false;

        if (clrStyle == 1) {
            var state = Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, 0, 'CS_WND_DARK');
            Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, 1, 'CS_BTN_WHITETEXT_NOBG');
            return state;
        } else {
            var state = Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, 0, 'CS_BTN_GRAYTEXT_NOBG');
            Module.RealBIMWeb.UIWgtSetBtnColorStyle(uiID, 1, 'CS_BTN_GRAYTEXT_BLUEBG');
            return state;
        }
    };

    // MARK 图片（Image）
    class REUIImageInfo {
        constructor() {
            this.uiID = null; //组件唯一标识，重复使用创建失败
            this.picPath = null; //图片地址
            this.size = null; //按钮的期望尺寸, 二元数组
            this.visible = true; //是否可见，默认可见
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
    };

    /**
     * 获取图像UI控件所使用的图片资源的路径
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.getImagePicPath = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtGetImageImgURL(uiID);
    };

    /**
     * 设置图像UI控件所使用的图片资源的路径
     * @param {String} uiID //组件唯一标识
     * @param {String} picPath //图片地址
     */
    Module.Graphics.setImagePicPath = function (uiID, picPath) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(picPath, 'picPath')) return;
        return Module.RealBIMWeb.UIWgtSetImageImgURL(uiID, picPath);
    };

    /**
     * 创建一个系统UI面板上的Image控件
     * @param {String} uiID //组件唯一标识
     * @param {String} picPath //图片地址
     * @param {String} beforeUiID //在这个组件之前插入（默认在最后面）
     */
    Module.Graphics.createSysPanelImage = function (uiID, picPath, beforeUiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        if (isEmptyLog(picPath, 'picPath')) return;
        const _beforeUiID = isEmpty(beforeUiID) ? '' : beforeUiID;

        var _size = [10, 48];
        var _visible = true;
        var createState = Module.RealBIMWeb.UIWgtCreateImage(uiID, _visible, _size, picPath);
        var addState = Module.Graphics.addSysPanelChildWidget(uiID, _beforeUiID);
        return createState && addState;
    };

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
    };

    /**
     * 获取系统UI面板所有子组件的ID
     */
    Module.Graphics.getSysPanelAllChildIds = function () {
        var _idList = Module.RealBIMWeb.UIWgtGetAllChildrensID('BuiltIn_Wnd_Panel');
        var _childIDList = [];
        for (let i = 0; i < _idList.size(); i++) {
            _childIDList.push(_idList.get(i));
        }
        return _childIDList;
    };

    /**
     * 添加组件到指定父组件上
     * @param {String} superUIID //父组件唯一标识
     * @param {String} childUIID //子组件唯一标识
     */
    Module.Graphics.addChildWidget = function (superUIID, childUIID) {
        if (isEmptyLog(superUIID, 'superUIID')) return;
        if (isEmptyLog(childUIID, 'childUIID')) return;
        return Module.RealBIMWeb.UIWgtAddChildWidget(superUIID, childUIID);
    };

    /**
     * 移除组件的某个子组件 （不删除子组件）
     * @param {String} superUIID //父组件唯一标识
     * @param {String} childUIID //子组件唯一标识
     */
    Module.Graphics.removeChildWidget = function (superUIID, childUIID) {
        if (isEmptyLog(superUIID, 'superUIID')) return;
        if (isEmptyLog(childUIID, 'childUIID')) return;
        return Module.RealBIMWeb.UIWgtRemoveChildWidget(superUIID, childUIID);
    };

    /**
     * 删除一个控件
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.delWidget = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtDeleteWidget(uiID);
    };

    /**
     * 移除系统UI面板的某个子组件 （不删除子组件）
     * @param {String} uiID //组件唯一标识
     */
    Module.Graphics.removeSysPanelWidget = function (uiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        return Module.RealBIMWeb.UIWgtRemoveChildWidget('BuiltIn_Wnd_Panel', uiID);
    };

    /**
     * 将已经创建好的组件到系统UI面板
     * @param {String} uiID //组件唯一标识
     * @param {String} beforeUiID //在这个组件之前插入（默认在最后面）
     */
    Module.Graphics.addSysPanelChildWidget = function (uiID, beforeUiID) {
        if (isEmptyLog(uiID, 'uiID')) return;
        const _beforeUiID = isEmpty(beforeUiID) ? '' : beforeUiID;
        return Module.RealBIMWeb.UIWgtAddChildWidget('BuiltIn_Wnd_Panel', uiID, _beforeUiID);
    };

    // MOD-- 标签（Tag） <---
    Module.Tag = typeof Module.Tag !== 'undefined' ? Module.Tag : {}; //增加 Tag 模块

    class RETagInfo {
        constructor() {
            this.tagName = null; //标签的名称(唯一标识)
            this.pos = null; //标签的位置
            this.infoList = null; //标签的内容（包含 RETagContent 类型）
        }
    }
    ExtModule.RETagInfo = RETagInfo;

    class RETagContent {
        constructor() {
            this.picPath = null; //标签每一行的纹理路径(要求32 * 32像素，png格式)
            this.text = null; //标签每一行的文字信息
            this.textClr = null; //文字颜色（REColor 类型）
            this.borderClr = null; //文字边框颜色（REColor 类型）
            this.onlyText = false; //是否只有文字， 不设置表示默认都有
        }
    }
    ExtModule.RETagContent = RETagContent;

    class RELineTagInfo {
        constructor() {
            this.tagName = null; //标签的名称(唯一标识)
            this.pos = null; //标签的位置
            this.contents = null; //标签的内容（包含 RELineTagCont 类型）
            this.tagMinWidth = null; //表示要添加的标签最小宽度
            this.tagMinHeight = null; //表示要添加的标签最小高度
            this.fontName = null; //表示要添加的标签内容字体样式
            this.backClr = null; //表示要添加的标签背景颜色（REColor 类型）
            this.frameClr = null; //表示要添加的标签边框颜色（REColor 类型）
        }
    }
    ExtModule.RELineTagInfo = RELineTagInfo;

    class RELineTagCont {
        constructor() {
            this.type = null; //元素类型，"text":文字，"tex":图片
            this.width = null; //元素宽度
            this.height = null; //元素高度
            this.border = null; //元素边框大小
            this.elemClr = null; //元素颜色（REColor 类型）type="text"代表文字颜色，type="tex"代表图片纹理颜色
            this.text = null; //文字内容，只有在 type="text"时才生效
            this.picPath = null; //图片路径，只有在 type="tex"时才生效
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
            const _tagInfo = tagInfoList[j];
            let _texRegions = new Module.RE_Vector_SHP_TEX();
            let _textRegions = new Module.RE_Vector_SHP_TEXT();
            let _lineCount = _tagInfo.infoList.length;
            let _lineHeight = 26;
            let _lineSpace = 3;
            for (let i = 0; i < _lineCount; ++i) {
                const _tagInfoItem = _tagInfo.infoList[i];
                let _picPath = isEmpty(_tagInfoItem.picPath) ? '' : _tagInfoItem.picPath;
                let _needPic = !isEmpty(_tagInfoItem.onlyText) ? !_tagInfoItem.onlyText : false;
                let _picDefClr = _needPic ? 0xffffffff : 0x00ffffff;
                let _left = _needPic ? -50 : 0;
                let _bottom = _lineHeight * (_lineCount - i - 1) + _lineSpace;
                let _right = _needPic ? -30 : 0;
                let _top = _lineHeight * (_lineCount - i) - _lineSpace;
                let obj_t = {
                    m_strTexPath: _picPath,
                    m_qTexRect: [_left, _bottom, _right, _top],
                    m_uTexClrMult: _picDefClr,
                    m_vMinTexUV: [0.0, 0.0],
                    m_vMaxTexUV: [1.0, 1.0],
                    m_uFrameNumU: 1,
                    m_uFrameNumV: 1,
                    m_uFrameStrideU: 0,
                    m_uFrameStrideV: 0,
                    m_fFrameFreq: 0.0,
                };
                _texRegions.push_back(obj_t); //纹理矩形区域在2维像素裁剪空间(Y轴向上递增)下相对于定位点的覆盖区域<左，下，右，上>
            }
            for (let i = 0; i < _lineCount; ++i) {
                const _tagInfoItem = _tagInfo.infoList[i];
                let _left = 0;
                let _bottom = _lineHeight * (_lineCount - i - 1) + _lineSpace;
                let _right = 30;
                let _top = _lineHeight * (_lineCount - i) - _lineSpace;
                let _text = isEmpty(_tagInfoItem.text) ? '' : _tagInfoItem.text;
                let _textClr = isEmpty(_tagInfoItem.textClr) ? 0xffffffff : clrToU32(_tagInfoItem.textClr);
                let _borderClr = isEmpty(_tagInfoItem.borderClr) ? 0x80000000 : clrToU32(_tagInfoItem.borderClr);
                let obj_t = {
                    m_strGolFontID: 'RealBIMFont001',
                    m_bTextWeight: true,
                    m_strText: _text,
                    m_uTextClr: _textClr,
                    m_uTextBorderClr: _borderClr,
                    m_qTextRect: [_left, _bottom, _right, _top],
                    m_uTextFmtFlag: (1 << 1) /*TEXT_FMT_VCENTER*/ | (1 << 3) /*TEXT_FMT_LEFT*/ | (1 << 6) /*TEXT_FMT_NOCLIP*/,
                    m_uTextBackMode: 0,
                    m_sTextBackBorder: 0,
                    m_uTextBackClr: 0x00000000,
                };
                _textRegions.push_back(obj_t);
            }
            let _tempobj = {
                m_strName: isEmpty(_tagInfo.tagName) ? '' : _tagInfo.tagName,
                m_vPos: _tagInfo.pos,
                m_vBgMinSize: [150, 10],
                m_vBgPadding: [5, 5],
                m_uBgAlignX: 1,
                m_uBgAlignY: 1,
                m_vArrowOrigin: [0, 10],
                m_uBgColor: 0x80000000,
                m_arrTexContents: _texRegions,
                m_arrTextContents: _textRegions,
            };
            _temptags.push_back(_tempobj);
        }
        return Module.RealBIMWeb.AddTags(_temptags);
    };

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

        var _cur_x = 0; //当前计算x
        var _cur_y = 0; //当前计算y
        var _max_y = lineTagInfo.tagMinHeight / 2; //当前最大y
        var _backClr = 0x00000000;
        if (!isEmpty(lineTagInfo.backClr)) _backClr = clrToU32(lineTagInfo.backClr);
        var _frameClr = 0x00000000;
        if (!isEmpty(lineTagInfo.frameClr)) _frameClr = clrToU32(lineTagInfo.frameClr);
        var _fontName = 'RealBIMFont001';
        if (!isEmpty(lineTagInfo.fontName) && lineTagInfo.fontName != '') _fontName = lineTagInfo.fontName;

        for (let i = 0; i < lineTagInfo.contents.length; i++) {
            let _lineTagCont = lineTagInfo.contents[i];
            let _elemType = 'tex';
            if (!isEmpty(_lineTagCont.type)) _elemType = _lineTagCont.type;
            let _elemText = '';
            if (!isEmpty(_lineTagCont.text) && _elemType != 'tex') _elemText = _lineTagCont.text;
            let _elemPicPath = '';
            if (!isEmpty(_lineTagCont.picPath) && _elemType != 'text') _elemPicPath = _lineTagCont.picPath;
            let _elemWidth = 1;
            if (!isEmpty(_lineTagCont.width)) _elemWidth = _lineTagCont.width;
            let _elemHeight = 1;
            if (!isEmpty(_lineTagCont.height)) _elemHeight = _lineTagCont.height;
            let _elemBorder = 1;
            if (!isEmpty(_lineTagCont.border)) _elemBorder = _lineTagCont.border;
            let _elemClr = 0xffffffff;
            if (!isEmpty(_lineTagCont.elemClr)) {
                if (_elemType == 'text') {
                    _elemClr = clrToU32(_lineTagCont.elemClr);
                }
            }
            if (_elemType == 'tex') {
                let obj_t = {
                    m_vMinTexUV: [0.0, 0.0],
                    m_vMaxTexUV: [1.0, 1.0],
                    m_uFrameNumU: 1,
                    m_uFrameNumV: 1,
                    m_uFrameStrideU: 0,
                    m_uFrameStrideV: 0,
                    m_fFrameFreq: 0.0,
                    m_strTexPath: _elemPicPath,
                    m_qTexRect: [_cur_x + _elemBorder, _cur_y - _elemHeight / 2 - 1, _cur_x + _elemBorder + _elemWidth, _cur_y + _elemHeight / 2 - 1],
                    m_uTexClrMult: _elemClr,
                };
                _texRegions.push_back(obj_t);
            } else {
                let obj_t = {
                    m_strGolFontID: _fontName,
                    m_bTextWeight: true,
                    m_uTextClr: _elemClr,
                    m_uTextBorderClr: 0x00000000,
                    m_strText: _elemText,
                    m_qTextRect: [
                        _cur_x + _elemBorder,
                        _cur_y - _elemHeight / 2 + 1,
                        _cur_x + _elemBorder + _elemWidth,
                        _cur_y + _elemHeight / 2 + 1,
                    ],
                    m_uTextFmtFlag: 0x2 /*TEXT_FMT_VCENTER*/ | 0x10 /*TEXT_FMT_HCENTER*/ /*| 0x40TEXT_FMT_NOCLIP*/ | 0x100 /*TEXT_FMT_WORDBREAK*/,
                    m_uTextBackMode: 0,
                    m_sTextBackBorder: 0,
                    m_uTextBackClr: 0x00000000,
                };
                _textRegions.push_back(obj_t);
            }
            _cur_x += _elemWidth + _elemBorder * 2;
            if (_max_y < _elemHeight / 2) {
                _max_y = _elemHeight / 2;
            }
        }

        var _frameRange_xMin = 0;
        var _frameRange_xMax = _cur_x;
        if (_cur_x < lineTagInfo.tagMinWidth) {
            _frameRange_xMin -= (lineTagInfo.tagMinWidth - _cur_x) / 2;
            _frameRange_xMax += (lineTagInfo.tagMinWidth - _cur_x) / 2;
        }
        var _frameLine = {
            m_vMinTexUV: [0.0, 0.0],
            m_vMaxTexUV: [1.0, 1.0],
            m_uFrameNumU: 1,
            m_uFrameNumV: 1,
            m_uFrameStrideU: 0,
            m_uFrameStrideV: 0,
            m_fFrameFreq: 0.0,
            m_strTexPath: '',
            m_qTexRect: [0, 0, 0, 0],
            m_uTexClrMult: _frameClr,
        };
        //边框
        var _frameLineWidth = 2;
        var _frameGap = 6;
        //边框-上
        _frameLine['m_qTexRect'] = [
            _frameRange_xMin - _frameGap,
            _max_y + _frameGap,
            _frameRange_xMax + _frameGap,
            _max_y + _frameGap + _frameLineWidth,
        ];
        _texRegions.push_back(_frameLine);
        //边框-下
        _frameLine['m_qTexRect'] = [
            _frameRange_xMin - _frameGap,
            -_max_y - _frameGap - _frameLineWidth,
            _frameRange_xMax + _frameGap,
            -_max_y - _frameGap,
        ];
        _texRegions.push_back(_frameLine);
        //边框-左
        _frameLine['m_qTexRect'] = [
            _frameRange_xMin - _frameGap,
            -_max_y - _frameGap - _frameLineWidth,
            _frameRange_xMin - _frameGap + _frameLineWidth,
            _max_y + _frameGap + _frameLineWidth,
        ];
        _texRegions.push_back(_frameLine);
        //边框-右
        _frameLine['m_qTexRect'] = [
            _frameRange_xMax + _frameGap - _frameLineWidth,
            -_max_y - _frameGap - _frameLineWidth,
            _frameRange_xMax + _frameGap,
            _max_y + _frameGap + _frameLineWidth,
        ];
        _texRegions.push_back(_frameLine);

        var _tempObj = {
            m_strName: lineTagInfo.tagName,
            m_vPos: lineTagInfo.pos,
            m_vBgMinSize: [lineTagInfo.tagMinWidth, lineTagInfo.tagMinHeight],
            m_vBgPadding: [3, 3],
            m_uBgAlignX: 1,
            m_uBgAlignY: 1,
            m_vArrowOrigin: [-5, 20],
            m_uBgColor: _backClr,
            m_arrTexContents: _texRegions,
            m_arrTextContents: _textRegions,
        };
        _tagList.push_back(_tempObj);
        return Module.RealBIMWeb.AddTags(_tagList);
    };

    /**
     * 获取某个标签的信息
     * @param {String} tagName //标签的名称(唯一标识)
     */
    Module.Tag.getTag = function (tagName) {
        if (isEmptyLog(tagName, 'tagName')) return;
        var _tagData = Module.RealBIMWeb.GetTag(tagName);
        // 多行标签和单行标签都是按照坐标添加的，在一个画布上，返回无法区分是单行还是多行，也无法确定添加的顺序，不返回图片和文字内容
        return { tagName: _tagData.m_strName, pos: _tagData.m_vPos };
    };

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
    };

    /**
     * 删除标签
     * @param {Array} tagNameList //标签的名称集合
     */
    Module.Tag.delTags = function (tagNameList) {
        if (!checkTypeLog(tagNameList, 'tagNameList', RE_Enum.RE_Check_Array)) return false;
        var temptags = new Module.RE_Vector_WStr();
        for (let i = 0; i < tagNameList.length; ++i) {
            temptags.push_back(tagNameList[i]);
        }
        return Module.RealBIMWeb.DelTags(temptags);
    };

    /**
     * 删除全部标签
     */
    Module.Tag.delAllTag = function () {
        return Module.RealBIMWeb.DelAllTags();
    };

    /**
     * 获取系统中所有标签总数
     */
    Module.Tag.getTagNum = function () {
        return Module.RealBIMWeb.GetTagNum();
    };

    /**
     * 设置系统中标签是否允许被场景遮挡
     * @param {Boolean} enable  //是否允许
     */
    Module.Tag.setTagCanOverlap = function (enable) {
        Module.RealBIMWeb.SetTagContactSce(enable);
    };

    /**
     * 获取系统中标签是否允许被场景遮挡
     */
    Module.Tag.getTagCanOverlap = function () {
        return Module.RealBIMWeb.GetTagContactSce();
    };

    /**
     * 设置系统中标签的自动缩放距离
     * @param {Number} dist  //自动缩放距离
     */
    Module.Tag.setTagAutoScaleDist = function (dist) {
        Module.RealBIMWeb.SetTagAutoScaleDist(dist);
    };

    /**
     * 获取系统中标签的自动缩放距离
     */
    Module.Tag.getTagAutoScaleDist = function () {
        return Module.RealBIMWeb.GetTagAutoScaleDist();
    };

    /**
     * 设置系统中标签的最远可视距离
     * @param {Number} dist  //自动缩放距离
     */
    Module.Tag.setTagVisDist = function (dist) {
        Module.RealBIMWeb.SetTagVisDist(dist);
    };

    /**
     * 获取系统中标签的最远可视距离
     */
    Module.Tag.getTagVisDist = function () {
        return Module.RealBIMWeb.GetTagVisDist();
    };

    // MOD-- 标注（Mark） <---
    Module.Mark = typeof Module.Mark !== 'undefined' ? Module.Mark : {}; //增加 Mark 模块

    /**
     * 开始添加标注
     */
    Module.Mark.startAdd = function () {
        return Module.RealBIMWeb.BeginAddMark();
    };

    /**
     * 添加标注文字
     * @param {String} markText //表示要添加的标注文字信息
     */
    Module.Mark.setText = function (markText) {
        Module.RealBIMWeb.SetMarkText(markText);
    };

    /**
     * 获取当前标注信息，包括添加标注时的相机方位、标注框、标注文字等
     */
    Module.Mark.getCurData = function () {
        return new Uint8Array(Module.RealBIMWeb.GetMarkInfo());
    };

    /**
     * 退出添加标注状态
     */
    Module.Mark.endAdd = function () {
        return Module.RealBIMWeb.EndAddMark();
    };

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
    };

    // MOD-- 锚点（Anchor） <---
    Module.Anchor = typeof Module.Anchor !== 'undefined' ? Module.Anchor : {}; //增加 Anchor 模块

    class REAncInfo {
        constructor() {
            this.groupName = null; //锚点组的标识，默认值 "DefaultGroup"
            this.ancName = null; //锚点的名称(唯一标识)
            this.pos = null; //锚点的位置
            this.picPath = null; //锚点的纹理路径
            this.textInfo = null; //锚点的文字
            this.picWidth = null; //锚点图片的宽度, 如果用于闪烁锚点效果，该值为闪烁锚点图片像素/闪烁个数
            this.picHeight = null; //锚点图片的高度, 如果用于闪烁锚点效果，该值为闪烁锚点图片像素/闪烁个数
            this.linePos = null; //锚点指引线的终点坐标(2维像素裁剪空间下相对于定位点的坐标) (Y轴向上递增)，即起始点相对pos点为[0,0], 最终点为相对[x,y]
            this.lineClr = null; //指引线的颜色
            this.ancSize = null; //锚点的覆盖范围参考值，大于等于0，可设为锚点图片的最大尺寸，该值越大，则相机定位到锚点时后退距离越大
            this.selfAutoScaleDist = null; //锚点自身自动缩放距离(<0.0f表示使用全局自动缩放距离)
            this.selfVisDist = null; //锚点自身可视距离(<0.0f表示使用全局可视距离)
            this.texBias = null; //锚点文字与图片的相对位置, 二元素数组[x，y], x取值（-1、0、1）分别表示文字在图片的左侧、中间、右侧；y取值（-1、0、1）分别表示文字在图片的下侧、中间、上侧；
            this.texFocus = null; //牵引线的最终顶点相对于图片的像素位置，需要配合ancSize使用，二元素数组[x，y], [0,0]表示位于图片的左下角, [picWidth/2,0]表示位于图片中下
            this.fontName = null; //锚点的字体样式
            this.textClr = null; //锚点的字体颜
            this.textBorderClr = null; //锚点的字体边框颜色
            this.textBackClr = null; //锚点的字体背景颜色
            this.textBackMode = null; //表示文字背景的处理模式 0：禁用文字背景 1：文字背景对应文字排版后返回的最终矩形区域 2：文字背景对应整体文字实际覆盖的矩形区域
            this.useLod = null; //是否允许聚合（只有uselod设为true，并且设置了有效的聚合参数 setAncLODInfo 后，锚点会自动聚合，同时锚点自动缩放和可视距离参数无效）
            this.animObjName = null; //锚点关联的动画对象名称(仅当 useLod==false时有效)
            this.animBoneID = null; //锚点关联的骨骼在动画对象内的ID(仅当 useLod==false时有效)
            this.picNum = null; //闪烁时循环播放的图片个数
            this.playFrame = null; //闪烁的帧率，即1秒钟闪几下
            this.textBackPadding = null; //锚点的字体背景内容边距，默认为0
            this.textBackRadius = null; //文字背景圆角半径的大小
            this.textBackPaddingRect = null; //文字背景边距，[left,bottom,right,top]
            this.textBackClrFadeDir = null; //文字背景颜色渐变方向 0: 不渐变 1: 从上往下渐变 2: 从左往右渐变
            this.textBackFadeFinalClr = null; //文字背景颜色最终的渐变色，起始渐变色为textBackClr, textBackClrFadeDir !=0 有效
            // this.textOffset = null;//文字偏移像素 [x,y] x:左右偏移，正数向右，负数向左， y:上下偏移，正数向上，负数向下
        }
    }
    ExtModule.REAncInfo = REAncInfo;

    // MARK 加载
    /**
     * 添加锚点
     * @param {Array} ancList //锚点信息集合（REAncInfo 类型）
     */
    Module.Anchor.addAnc = function (ancList) {
        if (isEmptyLog(ancList, 'ancList')) return false;
        var _tempAnchors = new Module.RE_Vector_ANCHOR();
        for (let i = 0; i < ancList.length; i++) {
            let ancInfo = ancList[i];

            var _groupname = isEmpty(ancInfo.groupName) ? 'DefaultGroup' : ancInfo.groupName;
            var _textInfo = isEmpty(ancInfo.textInfo) ? '' : ancInfo.textInfo;
            var _uselod = isEmpty(ancInfo.useLod) ? false : ancInfo.useLod;
            var _animobjname = isEmpty(ancInfo.animObjName) ? '' : ancInfo.animObjName;
            var _animboneid = isEmpty(ancInfo.animBoneID) ? 0 : ancInfo.animBoneID;
            var _linepos = isEmpty(ancInfo.linePos) ? [0, 0] : ancInfo.linePos;
            var _lineclr = isEmpty(ancInfo.lineClr) ? 0x00000000 : clrToU32(ancInfo.lineClr);
            var _size = isEmpty(ancInfo.ancSize) ? 0 : ancInfo.ancSize;
            var _selfASDist = isEmpty(ancInfo.selfAutoScaleDist) ? -1 : ancInfo.selfAutoScaleDist;
            var _selfVisDist = isEmpty(ancInfo.selfVisDist) ? -1 : ancInfo.selfVisDist;
            var _texBias = isEmpty(ancInfo.texBias) ? [1, 0] : ancInfo.texBias;
            var _texfocus = isEmpty(ancInfo.texFocus) ? [0, 0] : ancInfo.texFocus;
            var _GolFontID = isEmpty(ancInfo.fontName) ? 'RealBIMFont001' : ancInfo.fontName;
            var _textcolor = isEmpty(ancInfo.textClr) ? 0xffffffff : clrToU32(ancInfo.textClr);
            var _textbordercolor = isEmpty(ancInfo.textBorderClr) ? 0xff000000 : clrToU32(ancInfo.textBorderClr);
            var _textBackMode = isEmpty(ancInfo.textBackMode) ? 0 : ancInfo.textBackMode;
            var _textBackPadding = isEmpty(ancInfo.textBackPadding) ? 0 : ancInfo.textBackPadding;
            var _textBackClr = isEmpty(ancInfo.textBackClr) ? 0x00000000 : clrToU32(ancInfo.textBackClr);
            var _textBackRadius = isEmpty(ancInfo.textBackRadius) ? 0 : ancInfo.textBackRadius;
            var _textBackClrFadeDir = isEmpty(ancInfo.textBackClrFadeDir) ? 0 : ancInfo.textBackClrFadeDir;
            var _textBackFadeFinalClr = isEmpty(ancInfo.textBackFadeFinalClr) ? 0xffffffff : clrToU32(ancInfo.textBackFadeFinalClr);
            var _textBackPaddingRect = isEmpty(ancInfo.textBackPaddingRect) ? [0, 0, 0, 0] : ancInfo.textBackPaddingRect;
            if (!checkArrCountLog(_textBackPaddingRect, 'textBackPaddingRect', 4)) return false;

            const handle_rect = anc_layoutRect(ancInfo);

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
                m_uCornerRadius: _textBackRadius,
                m_qBackBorder: _textBackPaddingRect,
                m_uFadeDir: _textBackClrFadeDir,
                m_uFadeFinalClr: _textBackFadeFinalClr,
                m_cTexRegion: {
                    m_strTexPath: ancInfo.picPath,
                    m_qTexRect: [
                        _linepos[0] - _texfocus[0],
                        _linepos[1] - _texfocus[1],
                        ancInfo.picWidth + _linepos[0] - _texfocus[0],
                        ancInfo.picHeight + _linepos[1] - _texfocus[1],
                    ],
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
                    m_bTextWeight: true,
                    m_strText: _textInfo,
                    m_uTextClr: _textcolor,
                    m_uTextBorderClr: _textbordercolor,
                    m_qTextRect: handle_rect.m_qTextRect,
                    m_uTextFmtFlag: handle_rect.m_uTextFmtFlag,
                    m_uTextBackMode: _textBackMode,
                    m_sTextBackBorder: _textBackPadding,
                    m_uTextBackClr: _textBackClr,
                },
            };
            _tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddAnchors(_tempAnchors);
    };

    /**
     * 删除锚点
     * @param {Array} ancNameList //锚点的名称集合
     */
    Module.Anchor.delAnc = function (ancNameList) {
        var tempAnchors = new Module.RE_Vector_WStr();
        for (let i = 0; i < ancNameList.length; ++i) {
            tempAnchors.push_back(ancNameList[i]);
        }
        return Module.RealBIMWeb.DelAnchors(tempAnchors);
    };

    /**
     * 按组删除锚点
     * @param {String} ancGroupName //锚点的组名称
     */
    Module.Anchor.delGroupAnc = function (ancGroupName) {
        return Module.RealBIMWeb.DelGroupAnchors(ancGroupName);
    };

    /**
     * 删除全部锚点
     */
    Module.Anchor.delAllAnc = function () {
        Module.RealBIMWeb.DelAllAnchors();
    };

    /**
     * 获取锚点总数
     */
    Module.Anchor.getAncNum = function () {
        return Module.RealBIMWeb.GetAnchorNum();
    };

    /**
     * 获取某个锚点的信息
     * @param {String} ancName //锚点的名称
     */
    Module.Anchor.getAnc = function (ancName) {
        var _ancData = Module.RealBIMWeb.GetAnchor(ancName);
        return anc_convCpp2Json(_ancData);
    };

    /**
     * 获取某个锚点组包含的所有锚点信息
     * @param {String} ancGroupName //锚点的组名称
     */
    Module.Anchor.getGroupAnc = function (ancGroupName) {
        var _allAncData = Module.RealBIMWeb.GetGroupAnchors(ancGroupName);
        var ancInfoList = [];
        for (var i = 0; i < _allAncData.size(); ++i) {
            ancInfoList.push(anc_convCpp2Json(_allAncData.get(i)));
        }
        return ancInfoList;
    };

    /**
     * 获取系统中所有锚点信息
     */
    Module.Anchor.getAllAnc = function () {
        var _allAncData = Module.RealBIMWeb.GetAllAnchors();
        var ancInfoList = [];
        for (var i = 0; i < _allAncData.size(); ++i) {
            ancInfoList.push(anc_convCpp2Json(_allAncData.get(i)));
        }
        return ancInfoList;
    };

    /**
     * 添加闪烁锚点
     * @param {Array} ancList //锚点信息集合（REAncInfo 类型）
     */
    Module.Anchor.addAnimAnc = function (ancList) {
        if (isEmptyLog(ancList, 'ancList')) return false;
        var _tempAnchors = new Module.RE_Vector_ANCHOR();
        for (let i = 0; i < ancList.length; i++) {
            let ancInfo = ancList[i];

            var _groupname = isEmpty(ancInfo.groupName) ? 'DefaultGroup' : ancInfo.groupName;
            var _textInfo = isEmpty(ancInfo.textInfo) ? '' : ancInfo.textInfo;
            var _uselod = isEmpty(ancInfo.useLod) ? false : ancInfo.useLod;
            var _animobjname = isEmpty(ancInfo.animObjName) ? '' : ancInfo.animObjName;
            var _animboneid = isEmpty(ancInfo.animBoneID) ? 0 : ancInfo.animBoneID;
            var _linepos = isEmpty(ancInfo.linePos) ? [0, 0] : ancInfo.linePos;
            var _lineclr = isEmpty(ancInfo.lineClr) ? 0x00000000 : clrToU32(ancInfo.lineClr);
            var _size = isEmpty(ancInfo.ancSize) ? 0 : ancInfo.ancSize;
            var _selfASDist = isEmpty(ancInfo.selfAutoScaleDist) ? -1 : ancInfo.selfAutoScaleDist;
            var _selfVisDist = isEmpty(ancInfo.selfVisDist) ? -1 : ancInfo.selfVisDist;
            var _texBias = isEmpty(ancInfo.texBias) ? [1, 0] : ancInfo.texBias;
            var _texfocus = isEmpty(ancInfo.texFocus) ? [0, 0] : ancInfo.texFocus;
            var _GolFontID = isEmpty(ancInfo.fontName) ? 'RealBIMFont001' : ancInfo.fontName;
            var _textcolor = isEmpty(ancInfo.textClr) ? 0xff000000 : clrToU32(ancInfo.textClr);
            var _textbordercolor = isEmpty(ancInfo.textBorderClr) ? 0xff000000 : clrToU32(ancInfo.textBorderClr);
            var _textBackMode = isEmpty(ancInfo.textBackMode) ? 0 : ancInfo.textBackMode;
            var _textBackBorder = isEmpty(ancInfo.textBackBorder) ? 0 : ancInfo.textBackBorder;
            var _textBackPadding = isEmpty(ancInfo.textBackPadding) ? 0 : ancInfo.textBackPadding;
            var _textBackClr = isEmpty(ancInfo.textBackClr) ? 0x00000000 : clrToU32(ancInfo.textBackClr);
            var _picNum = isEmpty(ancInfo.picNum) ? 1 : ancInfo.picNum;
            var _playFrame = isEmpty(ancInfo.playFrame) ? 0 : ancInfo.playFrame;
            var _textOffset = (() => {
                const _textOffsetReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g'); //检测字符串中是否包含中文字符
                return _textOffsetReg.test(_textInfo) ? [0, 0] : [0, 2];
            })();

            // 文字相对区域对齐方式
            var _textFmtFlag = 128 + 64; /*TEXT_FMT_NOCLIP | TEXT_FMT_SINGLELINE*/
            // 文字区域
            var _texRect_min = [0, 0];
            var _texRect_max = [0, 0];
            {
                if (_texBias[0] < 0 && _texBias[1] > 0) {
                    // 文字在图片->左上
                    _texRect_min = [
                        _linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2,
                        ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                    ];
                    _texRect_max = [
                        _linepos[0] - _texfocus[0] - _textBackPadding,
                        ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2,
                    ];
                    _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                    _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
                } else if (_texBias[0] < 0 && _texBias[1] == 0) {
                    // 文字在图片->左中
                    _texRect_min = [_linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2, _linepos[1] - _texfocus[1] - _textBackPadding];
                    _texRect_max = [_linepos[0] - _texfocus[0] - _textBackPadding, ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding];
                    _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                    _textFmtFlag |= 2; /*TEXT_FMT_VCENTER*/
                } else if (_texBias[0] < 0 && _texBias[1] < 0) {
                    // 文字在图片->左下
                    _texRect_min = [_linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2, _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2];
                    _texRect_max = [_linepos[0] - _texfocus[0] - _textBackPadding, _linepos[1] - _texfocus[1] - _textBackPadding];
                    _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                    _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
                } else if (_texBias[0] == 0 && _texBias[1] > 0) {
                    // 文字在图片->中上
                    _texRect_min = [_linepos[0] - _texfocus[0] - _textBackPadding, ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding];
                    _texRect_max = [
                        ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                        ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2,
                    ];
                    _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                    _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
                } else if (_texBias[0] == 0 && _texBias[1] == 0) {
                    // 文字在图片->中中
                    _texRect_min = [_linepos[0] - _texfocus[0] - _textBackPadding, _linepos[1] - _texfocus[1] - _textBackPadding];
                    _texRect_max = [
                        ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                        ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                    ];
                    _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                    _textFmtFlag |= 2; /*TEXT_FMT_VCENTER*/
                } else if (_texBias[0] == 0 && _texBias[1] < 0) {
                    // 文字在图片->中下
                    _texRect_min = [_linepos[0] - _texfocus[0] - _textBackPadding, _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2];
                    _texRect_max = [ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding, _linepos[1] - _texfocus[1] - _textBackPadding];
                    _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                    _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
                } else if (_texBias[0] > 0 && _texBias[1] > 0) {
                    // 文字在图片->右上
                    _texRect_min = [
                        ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                        ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                    ];
                    _texRect_max = [
                        ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2,
                        ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2,
                    ];
                    _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                    _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
                } else if (_texBias[0] > 0 && _texBias[1] == 0) {
                    // 文字在图片->右中
                    _texRect_min = [ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding, _linepos[1] - _texfocus[1] - _textBackPadding];
                    _texRect_max = [
                        ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2,
                        ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                    ];
                    _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                } else if (_texBias[0] > 0 && _texBias[1] < 0) {
                    // 文字在图片->右下
                    _texRect_min = [
                        ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                        _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2,
                    ];
                    _texRect_max = [
                        ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2,
                        _linepos[1] - _texfocus[1] - _textBackPadding,
                    ];
                    _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                    _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
                }
            }
            var _textRect_combine = [..._texRect_min, ..._texRect_max];

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
                m_uCornerRadius: 0,
                m_qBackBorder: [0, 0, 0, 0],
                m_uFadeDir: 0,
                m_uFadeFinalClr: 0,
                m_cTexRegion: {
                    m_strTexPath: ancInfo.picPath,
                    m_qTexRect: [
                        _linepos[0] - _texfocus[0],
                        _linepos[1] - _texfocus[1],
                        ancInfo.picWidth + _linepos[0] - _texfocus[0],
                        ancInfo.picHeight + _linepos[1] - _texfocus[1],
                    ],
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
                    m_bTextWeight: true,
                    m_strText: _textInfo,
                    m_uTextClr: _textcolor,
                    m_uTextBorderClr: _textbordercolor,
                    m_qTextRect: [
                        _textRect_combine[0] + _textOffset[0],
                        _textRect_combine[1] + _textOffset[1],
                        _textRect_combine[2] + _textOffset[0],
                        _textRect_combine[3] + _textOffset[1],
                    ],
                    m_uTextFmtFlag: _textFmtFlag,
                    m_uTextBackMode: _textBackMode,
                    m_sTextBackBorder: _textBackBorder,
                    m_uTextBackClr: _textBackClr,
                },
            };
            _tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddAnchors(_tempAnchors);
    };

    /**
     * 闪烁动画控制
     * @param {String} ancName //锚点的名称
     * @param {Boolean} play //是否播放（默认播放）
     */
    Module.Anchor.setAncAnimPlay = function (ancName, play) {
        let _play = isEmpty(play) ? true : play ? 255 : 0;
        var _shpObjInfo = {
            m_uRGBBlendInfo: 0x00ffffff,
            m_uAlpha: 0,
            m_uAlphaAmp: 0,
            m_uForceAnimFrame: _play,
            m_uProbeMask: 1,
        };
        return Module.RealBIMWeb.SetShpObjInfo(ancName, _shpObjInfo);
    };

    /**
     * 获取所有的锚点分组名称
     */
    Module.Anchor.getAllAncGroupNames = function () {
        var _ancGroupName = Module.RealBIMWeb.GetAllAnchorGroupNames();
        var groupNameList = [];
        for (let i = 0; i < _ancGroupName.size(); ++i) {
            groupNameList.push(_ancGroupName.get(i));
        }
        return groupNameList;
    };

    class REAncLODInfo {
        constructor() {
            this.groupName = null; //要聚合的锚点组的标识名，为空则表示所有的锚点对象
            this.lodLevel = null; //聚合层级，范围1~10,默认为1，表示不聚合
            this.useCustomBV = null; //是否用锚点的预估总包围盒，默认为false
            this.customBV = null; //锚点的预估总包围盒,默认为当前场景的总包围盒，二维数组[[Xmin,Ymin,Zmin],[Xmax,Ymax,Zmax]]，当useCustomBV为false时，此参数无效，填空数组即可;
            this.lodMergePxl = null; //锚点所在单元格进行LOD合并时的投影到屏幕的像素尺寸阈值
            this.lodMergeCap = null; //锚点所在单元格进行LOD合并时的单元格容积阈值
            this.mergeStyle = null; //点聚合后的样式 (REAncInfo 类型 参数选填)
        }
    }
    ExtModule.REAncLODInfo = REAncLODInfo;

    /**
     * 设置聚合锚点
     * @param {REAncLODInfo} ancLODInfo //聚合锚点信息
     */
    Module.Anchor.setAncLODInfo = function (ancLODInfo) {
        if (isEmptyLog(ancLODInfo, 'ancLODInfo')) return;
        if (isEmptyLog(ancLODInfo.mergeStyle, 'mergeStyle')) return;

        var _groupName = '';
        if (!isEmpty(ancLODInfo.groupName)) {
            _groupName = ancLODInfo.groupName;
        }
        var _lodLevel = 1;
        if (!isEmpty(ancLODInfo.lodLevel)) {
            _lodLevel = ancLODInfo.lodLevel;
        }
        var _lodMergePxl = 100;
        if (!isEmpty(ancLODInfo.lodMergePxl)) {
            _lodMergePxl = ancLODInfo.lodMergePxl;
        }
        var _lodMergeCap = 2;
        if (!isEmpty(ancLODInfo.lodMergeCap)) {
            _lodMergeCap = ancLODInfo.lodMergeCap;
        }
        var _customBV = [
            [0, 0, 0],
            [0, 0, 0],
        ];
        if (ancLODInfo.useCustomBV) {
            _customBV = ancLODInfo.customBV;
        }
        var _linepos = [0, 0];
        var _texfocus = [0, 0];
        var _textbias = [1, 0];
        if (!isEmpty(ancLODInfo.mergeStyle.texBias)) {
            _textbias = ancLODInfo.mergeStyle.texBias;
        }
        var _GolFontID = 'RealBIMFont001';
        if (!isEmpty(ancLODInfo.mergeStyle.fontName) && ancLODInfo.mergeStyle.fontName != '') {
            _GolFontID = ancLODInfo.mergeStyle.fontName;
        }
        var _textcolor = 0xff000000;
        if (!isEmpty(ancLODInfo.mergeStyle.textClr)) {
            _textcolor = clrToU32(ancLODInfo.mergeStyle.textClr);
        }
        var _textbordercolor = 0xff000000;
        if (!isEmpty(ancLODInfo.mergeStyle.textBorderClr)) {
            _textbordercolor = clrToU32(ancLODInfo.mergeStyle.textBorderClr);
        }
        //设置文字和图片的对齐方式
        var TempTextRect = [0, 0, 1, 1];
        var TempTextFmtFlag = 0x40; /*TEXT_FMT_NOCLIP*/
        if (_textbias[0] < 0) {
            TempTextRect[0] = _linepos[0] - 1 - _texfocus[0];
            TempTextRect[2] = _linepos[0] - _texfocus[0];
            TempTextFmtFlag |= 0x20 /*TEXT_FMT_RIGHT*/;
        } else if (_textbias[0] == 0) {
            // TempTextRect[0] = _linepos[0] - _texfocus[0]; TempTextRect[2] = _linepos[0] + 1 - _texfocus[0]; TempTextFmtFlag |= 0x10/*TEXT_FMT_LEFT*/;
            TempTextRect[0] = _linepos[0] - _texfocus[0];
            TempTextRect[2] = ancLODInfo.mergeStyle.picWidth + _linepos[0] - _texfocus[0];
            TempTextFmtFlag |= 0x10 /*TEXT_FMT_HCENTER*/;
        } else {
            TempTextRect[0] = ancLODInfo.mergeStyle.picWidth + _linepos[0] - _texfocus[0];
            TempTextRect[2] = ancLODInfo.mergeStyle.picWidth + _linepos[0] + 1 - _texfocus[0];
            TempTextFmtFlag |= 0x8 /*TEXT_FMT_LEFT*/;
        }
        if (_textbias[1] < 0) {
            TempTextRect[1] = _linepos[1] - 1 - _texfocus[1];
            TempTextRect[3] = _linepos[1] - _texfocus[1];
            TempTextFmtFlag |= 0x4 /*TEXT_FMT_TOP*/;
        } else if (_textbias[1] == 0) {
            // TempTextRect[1] = _linepos[1] - _texfocus[1]; TempTextRect[3] = _linepos[1] + 1 - _texfocus[1]; TempTextFmtFlag |= 0x2/*TEXT_FMT_BOTTOM*/;
            TempTextRect[1] = _linepos[1] - _texfocus[1];
            TempTextRect[3] = ancLODInfo.mergeStyle.picHeight + _linepos[1] - _texfocus[1];
            TempTextFmtFlag |= 0x2 /*TEXT_FMT_VCENTER*/;
        } else {
            TempTextRect[1] = ancLODInfo.mergeStyle.picHeight + _linepos[1] - _texfocus[1];
            TempTextRect[3] = ancLODInfo.mergeStyle.picHeight + _linepos[1] + 1 - _texfocus[1];
            TempTextFmtFlag |= 0x1 /*TEXT_FMT_BOTTOM*/;
        }

        //创建一个锚点对象样式
        var tempobj = {
            m_strGroupName: _groupName,
            m_strName: '',
            m_vPos: [0, 0, 0],
            m_bUseLOD: false,
            m_strAnimObjName: '',
            m_uAnimBoneID: 0,
            m_vLineEnd: _linepos,
            m_uLineClr: 0x00000000,
            m_fSize: 0,
            m_fSelfASDist: -1,
            m_fSelfVisDist: -1,
            m_uCornerRadius: 0,
            m_qBackBorder: [0, 0, 0, 0],
            m_uFadeDir: 0,
            m_uFadeFinalClr: 0,
            m_cTexRegion: {
                m_strTexPath: ancLODInfo.mergeStyle.picPath,
                m_qTexRect: [
                    _linepos[0] - _texfocus[0],
                    _linepos[1] - _texfocus[1],
                    ancLODInfo.mergeStyle.picWidth + _linepos[0] - _texfocus[0],
                    ancLODInfo.mergeStyle.picHeight + _linepos[1] - _texfocus[1],
                ],
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
                m_bTextWeight: true,
                m_strText: '',
                m_uTextClr: _textcolor,
                m_uTextBorderClr: _textbordercolor,
                m_qTextRect: TempTextRect,
                m_uTextFmtFlag: TempTextFmtFlag,
                m_uTextBackMode: 0,
                m_sTextBackBorder: 0,
                m_uTextBackClr: 0x00000000,
            },
        };
        Module.RealBIMWeb.SetAnchorLODInfo(_groupName, _lodLevel, ancLODInfo.useCustomBV, _customBV, _lodMergePxl, _lodMergeCap, tempobj);
    };

    /**
     * 取消锚点聚合
     * @param {String} groupName //锚点的组标识
     */
    Module.Anchor.resetAncLODInfo = function (groupName) {
        var _groupName = '';
        if (!isEmpty(groupName)) {
            _groupName = groupName;
        }
        var mergestyle = {
            m_strGroupName: '',
            m_strName: '',
            m_vPos: [0, 0, 0],
            m_bUseLOD: false,
            m_strAnimObjName: '',
            m_uAnimBoneID: 0,
            m_vLineEnd: [0, 0],
            m_uLineClr: 0x00000000,
            m_fSize: 0,
            m_fSelfASDist: -1,
            m_fSelfVisDist: -1,
            m_uCornerRadius: 0,
            m_qBackBorder: [0, 0, 0, 0],
            m_uFadeDir: 0,
            m_uFadeFinalClr: 0,
            m_cTexRegion: {
                m_strTexPath: '',
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
                m_strGolFontID: 'RealBIMFont001',
                m_bTextWeight: true,
                m_strText: '',
                m_uTextClr: 0x00000000,
                m_uTextBorderClr: 0x00000000,
                m_qTextRect: [0, 0, 0, 0],
                m_uTextFmtFlag: 0,
                m_uTextBackMode: 0,
                m_sTextBackBorder: 0,
                m_uTextBackClr: 0x00000000,
            },
        };
        Module.RealBIMWeb.SetAnchorLODInfo(
            _groupName,
            1,
            false,
            [
                [0, 0, 0],
                [0, 0, 0],
            ],
            100,
            1,
            mergestyle
        );
    };

    // MARK 相机
    /**
     * 聚焦相机到指定的锚点
     * @param {String} ancName //锚点的名称
     * @param {Number} backwardAmp //相机在锚点中心处向后退的强度
     */
    Module.Anchor.setCamToAnc = function (ancName, backwardAmp) {
        Module.RealBIMWeb.FocusCamToAnchor(ancName, backwardAmp);
    };

    /**
     * 相机定位到组锚点
     * @param {String} groupName //锚点组的标识
     * @param {Number} backwardAmp //相机在锚点中心处向后退的强度
     */
    Module.Anchor.setCamToGroupAnc = function (groupName, backwardAmp) {
        Module.RealBIMWeb.FocusCamToAnchorGroup(groupName, backwardAmp);
    };

    // MARK 渲染设置
    /**
     * 设置系统中锚点是否允许被场景遮挡
     * @param {String} groupName //锚点的组标识
     * @param {Boolean} enable //是否允许
     */
    Module.Anchor.setAncCanOverlap = function (groupName, enable) {
        Module.RealBIMWeb.SetAnchorContactSce(groupName, enable);
    };

    /**
     * 获取系统中锚点是否允许被场景遮挡
     * @param {String} groupName //锚点的组标识
     */
    Module.Anchor.getAncCanOverlap = function (groupName) {
        return Module.RealBIMWeb.GetAnchorContactSce(groupName);
    };

    /**
     * 设置系统中锚点的自动缩放距离
     * @param {String} groupName //锚点的组标识
     * @param {Number} dist //距离
     */
    Module.Anchor.setAncAutoScaleDist = function (groupName, dist) {
        Module.RealBIMWeb.SetAnchorAutoScaleDist(groupName, dist);
    };

    /**
     * 获取系统中锚点的自动缩放距离
     * @param {String} groupName //锚点的组标识
     */
    Module.Anchor.getAncAutoScaleDist = function (groupName) {
        return Module.RealBIMWeb.GetAnchorAutoScaleDist(groupName);
    };

    /**
     * 设置系统中锚点的最远可视距离
     * @param {String} groupName //锚点的组标识
     * @param {Number} dist //距离
     */
    Module.Anchor.setAncVisDist = function (groupName, dist) {
        Module.RealBIMWeb.SetAnchorVisDist(groupName, dist);
    };

    /**
     * 获取系统中锚点的最远可视距离
     * @param {String} groupName //锚点的组标识
     */
    Module.Anchor.getAncVisDist = function (groupName) {
        return Module.RealBIMWeb.GetAnchorVisDist(groupName);
    };

    /**
     * 设置系统中锚点的最大自定义单体纹理尺寸 注：设置的是同一个组的尺寸信息，且需要在添加锚点之前进行设置，如果当前组已经被创建则设置无效
     * @param {String} groupName //锚点组的标识，若为空串则不处理
     * @param {Number} size //最大自定义单体纹理尺寸，0表示系统自动决定
     */
    Module.Anchor.setCustomMaxTexSize = function (groupName, size) {
        Module.RealBIMWeb.SetAnchorCustomMaxTexSize(groupName, size);
    };

    /**
     * 获取系统中锚点的最大自定义单体纹理尺寸
     * @param {String} groupName //锚点组的标识，若为空串则不处理
     */
    Module.Anchor.getCustomMaxTexSize = function (groupName) {
        return Module.RealBIMWeb.GetAnchorCustomMaxTexSize(groupName);
    };

    // MARK 辅助函数

    /**
     * 锚点 c++ 数据转换 json
     * @param {Object} cppAncData //锚点数据
     */
    function anc_convCpp2Json(cppAncData) {
        var ancInfo = new REAncInfo();
        if (!cppAncData.m_strName.length) {
            return null;
        }
        ancInfo.ancName = cppAncData.m_strName;
        ancInfo.groupName = cppAncData.m_strGroupName;
        ancInfo.pos = cppAncData.m_vPos;
        ancInfo.picPath = cppAncData.m_cTexRegion.m_strTexPath;
        ancInfo.textInfo = cppAncData.m_cTextRegion.m_strText;
        ancInfo.linePos = cppAncData.m_vLineEnd;
        if (!isEmpty(cppAncData.m_uLineClr) && cppAncData.m_uLineClr != 0) ancInfo.lineClr = clrU32ToClr(cppAncData.m_uLineClr);
        if (!isEmpty(cppAncData.m_cTextRegion.m_uTextClr) && cppAncData.m_cTextRegion.m_uTextClr != 0)
            ancInfo.textClr = clrU32ToClr(cppAncData.m_cTextRegion.m_uTextClr);
        ancInfo.textBorderClr = clrU32ToClr(cppAncData.m_cTextRegion.m_uTextBorderClr);
        if (!isEmpty(cppAncData.m_cTextRegion.m_uTextBackClr) && cppAncData.m_cTextRegion.m_uTextBackClr != 0)
            ancInfo.textBackClr = clrU32ToClr(cppAncData.m_cTextRegion.m_uTextBackClr);
        ancInfo.selfAutoScaleDist = cppAncData.m_fSelfASDist;
        ancInfo.selfVisDist = cppAncData.m_fSelfVisDist;
        ancInfo.useLod = cppAncData.m_bUseLOD;
        if (cppAncData.m_cTextRegion.m_strGolFontID != 'RealBIMFont001') ancInfo.fontName = cppAncData.m_cTextRegion.m_strGolFontID;
        if (!isEmpty(cppAncData.m_strAnimObjName) && cppAncData.m_strAnimObjName != '') ancInfo.animObjName = cppAncData.m_strAnimObjName;
        if (!isEmpty(cppAncData.m_uAnimBoneID) && cppAncData.m_uAnimBoneID != 0) ancInfo.animBoneID = cppAncData.m_uAnimBoneID;
        if (!isEmpty(cppAncData.m_cTexRegion.m_uFrameNumU) && cppAncData.m_cTexRegion.m_fFrameFreq != 0)
            ancInfo.picNum = cppAncData.m_cTexRegion.m_uFrameNumU;
        if (!isEmpty(cppAncData.m_cTexRegion.m_fFrameFreq) && cppAncData.m_cTexRegion.m_fFrameFreq != 0)
            ancInfo.playFrame = cppAncData.m_cTexRegion.m_fFrameFreq;

        ancInfo.textBackPadding = cppAncData.m_cTextRegion.m_sTextBackBorder;
        ancInfo.textBackRadius = cppAncData.m_uCornerRadius;
        ancInfo.textBackPaddingRect = cppAncData.m_qBackBorder;
        ancInfo.textBackClrFadeDir = cppAncData.m_uFadeDir;
        if (!isEmpty(cppAncData.m_uFadeFinalClr) && cppAncData.m_uFadeFinalClr != 0)
            ancInfo.textBackFadeFinalClr = clrU32ToClr(cppAncData.m_uFadeFinalClr);

        return removeEmptyProperty(ancInfo);
    }

    /**
     * 锚点布局设置
     * @param {Object} ancInfo //锚点数据
     */
    function anc_layoutRect(ancInfo) {
        var _textBackPadding = isEmpty(ancInfo.textBackPadding) ? 0 : ancInfo.textBackPadding;
        var _texBias = isEmpty(ancInfo.texBias) ? [1, 0] : ancInfo.texBias;
        var _texfocus = isEmpty(ancInfo.texFocus) ? [0, 0] : ancInfo.texFocus;
        var _linepos = isEmpty(ancInfo.linePos) ? [0, 0] : ancInfo.linePos;
        var _textBackPaddingRect = isEmpty(ancInfo.textBackPaddingRect) ? [0, 0, 0, 0] : ancInfo.textBackPaddingRect;
        var _textInfo = isEmpty(ancInfo.textInfo) ? '' : ancInfo.textInfo;
        var _textOffset = (() => {
            const _textOffsetReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g'); //检测字符串中是否包含中文字符
            return _textOffsetReg.test(_textInfo) ? [0, 0] : [0, 2];
        })();
        // 文字相对区域对齐方式
        var _textFmtFlag = 128 + 64; /*TEXT_FMT_NOCLIP | TEXT_FMT_SINGLELINE*/
        // 文字区域
        var _texRect_min = [0, 0];
        var _texRect_max = [0, 0];
        {
            const top = _textBackPaddingRect[3];
            const bottom = _textBackPaddingRect[1];
            const left = _textBackPaddingRect[0];
            const right = _textBackPaddingRect[2];
            // console.log(`top: ${top}, bottom: ${bottom}, left: ${left}, right: ${right}`);
            if (_texBias[0] < 0 && _texBias[1] > 0) {
                // 文字在图片->左上
                _texRect_min = [
                    _linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2 - right,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                ];
                _texRect_max = [
                    _linepos[0] - _texfocus[0] - _textBackPadding - right,
                    ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2,
                ];
                _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
            } else if (_texBias[0] < 0 && _texBias[1] == 0) {
                // 文字在图片->左中
                _texRect_min = [_linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2 - right, _linepos[1] - _texfocus[1] - _textBackPadding];
                _texRect_max = [
                    _linepos[0] - _texfocus[0] - _textBackPadding - right,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                ];
                _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                _textFmtFlag |= 2; /*TEXT_FMT_VCENTER*/
            } else if (_texBias[0] < 0 && _texBias[1] < 0) {
                // 文字在图片->左下
                _texRect_min = [_linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2 - right, _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2];
                _texRect_max = [_linepos[0] - _texfocus[0] - _textBackPadding - right, _linepos[1] - _texfocus[1] - _textBackPadding];
                _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
            } else if (_texBias[0] == 0 && _texBias[1] > 0) {
                // 文字在图片->中上
                _texRect_min = [
                    _linepos[0] - _texfocus[0] - _textBackPadding,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding + bottom,
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                    ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2 + (top + bottom),
                ];
                _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
            } else if (_texBias[0] == 0 && _texBias[1] == 0) {
                // 文字在图片->中中
                _texRect_min = [_linepos[0] - _texfocus[0] - _textBackPadding, _linepos[1] - _texfocus[1] - _textBackPadding - bottom];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding + top,
                ];
                _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                _textFmtFlag |= 2; /*TEXT_FMT_VCENTER*/
            } else if (_texBias[0] == 0 && _texBias[1] < 0) {
                // 文字在图片->中下
                _texRect_min = [
                    _linepos[0] - _texfocus[0] - _textBackPadding,
                    _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2 - (top + bottom),
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                    _linepos[1] - _texfocus[1] - _textBackPadding - top,
                ];
                _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
            } else if (_texBias[0] > 0 && _texBias[1] > 0) {
                // 文字在图片->右上
                _texRect_min = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding + left,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2 + left,
                    ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2,
                ];
                _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
            } else if (_texBias[0] > 0 && _texBias[1] == 0) {
                // 文字在图片->右中
                _texRect_min = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding + left,
                    _linepos[1] - _texfocus[1] - _textBackPadding,
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2 + left,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                ];
                _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                _textFmtFlag |= 2; /*TEXT_FMT_VCENTER*/
            } else if (_texBias[0] > 0 && _texBias[1] < 0) {
                // 文字在图片->右下
                _texRect_min = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding + left,
                    _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2,
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2 + left,
                    _linepos[1] - _texfocus[1] - _textBackPadding,
                ];
                _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
            }
        }

        var _textRect_combine = [..._texRect_min, ..._texRect_max];
        // console.log(`textRect_combine: ${_textRect_combine}`);
        if (!_textInfo.length) {
            _textRect_combine = [0, 0, 0, 0];
        }

        return {
            m_uTextFmtFlag: _textFmtFlag,
            m_qTextRect: [
                _textRect_combine[0] + _textOffset[0],
                _textRect_combine[1] + _textOffset[1],
                _textRect_combine[2] + _textOffset[0],
                _textRect_combine[3] + _textOffset[1],
            ],
        };
    }

    // MOD-- 几何图形（Geometry） <---
    Module.Geometry = typeof Module.Geometry !== 'undefined' ? Module.Geometry : {}; //增加 Geometry 模块

    // MARK 加载
    class REShpTextInfo {
        constructor() {
            this.text = null; //表示文字的内容
            this.texBias = null; //表示锚点文字与图片的相对位置，二维数组： 第一维-1、0、1分别表示文字在点的左侧、中间、右侧； 第二维-1、0、1分别表示文字在点的下侧、中间、上侧
            this.fontName = null; //表示锚点的字体样式
            this.textClr = null; //文字颜色（REColor 类型）
            this.textBorderClr = null; //文字边框颜色（REColor 类型）
            this.textBackMode = null; //表示文字背景的处理模式： 0：表示禁用文字背景 1：表示启用文字背景，文字背景是文字所占的矩形区域
            this.textBackBorder = null; //表示文字背景的边界带的像素宽度
            this.textBackClr = null; //表示文本背景色（REColor 类型）
        }
    }
    ExtModule.REShpTextInfo = REShpTextInfo;

    class REPotShpInfo {
        constructor() {
            this.shpName = null; //矢量标识名，若已有同名的矢量则覆盖之
            this.groupName = null; //矢量组名称
            this.pos = null; //表示顶点位置
            this.potSize = null; //示顶点的像素大小
            this.potClr = null; //顶点的颜色（REColor 类型）
            this.textInfo = null; //表示顶点的文字标注信息（REShpTextInfo 类型）
            this.scrASDist = null; //表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null; //表示屏幕空间矢量的可视距离
            this.contactSce = null; //表示矢量是否与场景发生深度遮挡
            this.useWorldDir = false; //表示是否使用二维平面映射到世界空间的方式
            this.worldRightDir = [0, 0, 0]; //表示二维平面的单位右轴在世界空间下的绝对投影向量
            this.worldUpDir = [0, 0, 0]; //表示二维平面的单位上轴在世界空间下的绝对投影向量
        }
    }
    ExtModule.REPotShpInfo = REPotShpInfo;

    /**
     * 创建自定义顶点矢量
     * @param {REPotShpInfo} potShpInfo //矢量点信息（REPotShpInfo 类型）
     */
    Module.Geometry.addPotShp = function (potShpInfo) {
        if (isEmptyLog(potShpInfo, 'potShpInfo')) return;
        if (isEmptyLog(potShpInfo.shpName, 'shpName')) return;

        const _textInfo = isEmpty(potShpInfo.textInfo) ? new REShpTextInfo() : potShpInfo.textInfo;
        var _texBias = isEmpty(_textInfo.texBias) ? [0, 0] : _textInfo.texBias;
        var _text = isEmpty(_textInfo.text) ? '' : _textInfo.text;
        var _GolFontID = isEmpty(_textInfo.fontName) ? 'RealBIMFont001' : _textInfo.fontName;
        var _textcolor = isEmpty(_textInfo.textClr) ? 0xffffffff : clrToU32(_textInfo.textClr);
        var _textbordercolor = isEmpty(_textInfo.textBorderClr) ? 0xff000000 : clrToU32(_textInfo.textBorderClr);
        var _textBackMode = isEmpty(_textInfo.textBackMode) ? 0 : _textInfo.textBackMode;
        var _textBackBorder = isEmpty(_textInfo.textBackBorder) ? 0 : _textInfo.textBackBorder;
        var _textBackClr = isEmpty(_textInfo.textBackClr) ? 0x00000000 : clrToU32(_textInfo.textBackClr);

        var TempTextRect = [-1, -1, 1, 1];
        var TempTextFmtFlag = 0x40; /*TEXT_FMT_NOCLIP*/
        var uPotSize = 0;
        if (!isEmpty(potShpInfo.potSize)) uPotSize = potShpInfo.potSize;
        if (_texBias[0] < 0) {
            TempTextRect[0] = -uPotSize - 2;
            TempTextRect[2] = -uPotSize - 1;
            TempTextFmtFlag |= 0x20 /*TEXT_FMT_RIGHT*/;
        } else if (_texBias[0] == 0) {
            TempTextRect[0] = -1;
            TempTextRect[2] = 1;
            TempTextFmtFlag |= 0x10 /*TEXT_FMT_HCENTER*/;
        } else {
            TempTextRect[0] = uPotSize + 1;
            TempTextRect[2] = uPotSize + 2;
            TempTextFmtFlag |= 0x8 /*TEXT_FMT_LEFT*/;
        }
        if (_texBias[1] < 0) {
            TempTextRect[1] = -uPotSize - 2;
            TempTextRect[3] = -uPotSize - 1;
            TempTextFmtFlag |= 0x4 /*TEXT_FMT_TOP*/;
        } else if (_texBias[1] == 0) {
            TempTextRect[1] = -1;
            TempTextRect[3] = 1;
            TempTextFmtFlag |= 0x2 /*TEXT_FMT_VCENTER*/;
        } else {
            TempTextRect[1] = uPotSize + 1;
            TempTextRect[3] = uPotSize + 2;
            TempTextFmtFlag |= 0x1 /*TEXT_FMT_BOTTOM*/;
        }

        var textobj = {
            m_strGolFontID: _GolFontID,
            m_bTextWeight: true,
            m_strText: _text,
            m_uTextClr: _textcolor,
            m_uTextBorderClr: _textbordercolor,
            m_qTextRect: TempTextRect,
            m_uTextFmtFlag: TempTextFmtFlag,
            m_uTextBackMode: _textBackMode,
            m_sTextBackBorder: _textBackBorder,
            m_uTextBackClr: _textBackClr,
        };

        var _groupName = isEmpty(potShpInfo.groupName) ? 'DefaultGroup' : potShpInfo.groupName;
        var _shpName = isEmpty(potShpInfo.shpName) ? '' : potShpInfo.shpName;
        var _pos = isEmpty(potShpInfo.pos) ? [0, 0, 0] : potShpInfo.pos;
        var _bContactSce = isEmpty(potShpInfo.contactSce) ? false : potShpInfo.contactSce;
        var _uClr = isEmpty(potShpInfo.potClr) ? 0xffffffff : clrToU32(potShpInfo.potClr);
        var _scrASDist = isEmpty(potShpInfo.scrASDist) ? -1 : potShpInfo.scrASDist;
        var _scrVisDist = isEmpty(potShpInfo.scrVisDist) ? -1 : potShpInfo.scrVisDist;

        let _vWorRight = [0, 0, 0];
        let _vWorUp = [0, 0, 0];
        if (!isEmpty(potShpInfo.useWorldDir) && potShpInfo.useWorldDir) {
            if (isEmptyLog(potShpInfo.worldRightDir, 'worldRightDir')) return;
            if (isEmptyLog(potShpInfo.worldUpDir, 'worldUpDir')) return;
            _vWorRight = potShpInfo.worldRightDir;
            _vWorUp = potShpInfo.worldUpDir;
        }

        return Module.RealBIMWeb.AddCustomPotShp(
            _shpName,
            _groupName,
            _pos,
            uPotSize,
            _uClr,
            textobj,
            _scrASDist,
            _scrVisDist,
            _bContactSce,
            _vWorRight,
            _vWorUp
        );
    };

    class RELineShpInfo {
        constructor() {
            this.shpName = null; //矢量标识名，若已有同名的矢量则覆盖之
            this.groupName = null; //矢量组名称
            this.potList = null; //表示多边形折线序列
            this.fillState = null; //表示折线的填充状态 0->多边形不填充； 1->多边形首尾相连构成封闭区域进行填充； 2->多边形首尾相连构成封闭区域进行填充(顶点高度自动修改为同一高度，默认为第一个顶点的高度)
            this.lineClr = null; //表示多边形的颜色（REColor 类型）
            this.fillClr = null; //表示多边形的填充颜色（REColor 类型）
            this.textPos = null; //表示多边形的文字标注的位置： >=0时，整数部分i/小数部分j：表示文字定位点在线段<i,i+1>上的偏移了长度百分比j [-1,0)表示文字定位在折线上并从首端点偏移折线总长度的百分比 -2表示文字定位在多边形所有顶点的中心位置处
            this.scrASDist = null; //表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null; //表示屏幕空间矢量的可视距离
            this.contactSce = null; //表示矢量是否与场景发生深度遮挡
            this.textInfo = null; //表示顶点的文字标注信息（REShpTextInfo 类型）
            this.projSce = null; //表示是否投影到地形，默认false
            this.proLineTex = null; //表示投影到地形线条的材质纹理, 默认不使用（仅投影有效可用）, 使用材质颜色lineClr参数不传递或者传递白色
            this.lineUnit = null; //表示线宽/线长使用的单位，默认像素长度（仅投影且使用材质纹理有效可用）, 0：表示像素长度, 1：表示世界空间长度(米)
            this.lineWidth = null; //表示线宽（仅投影且使用材质纹理有效可用）
            this.lineTexLength = null; //表示线条上所贴的纹理的单位长度（仅投影且使用材质纹理有效可用，实际线长大于单位长度则平铺效果，实际线长小于单位长度则裁切效果）
        }
    }
    ExtModule.RELineShpInfo = RELineShpInfo;

    /**
     * 创建自定义多边形折线矢量
     * @param {RELineShpInfo} lineShpInfo //矢量线信息（RELineShpInfo 类型）
     */
    Module.Geometry.addPolylineShp = function (lineShpInfo) {
        if (isEmptyLog(lineShpInfo, 'lineShpInfo')) return;
        if (isEmptyLog(lineShpInfo.shpName, 'shpName')) return;
        if (!checkTypeLog(lineShpInfo.potList, 'potList', RE_Enum.RE_Check_Array)) return;

        const _textInfo = isEmpty(lineShpInfo.textInfo) ? new REShpTextInfo() : lineShpInfo.textInfo;
        var _texBias = isEmpty(_textInfo.texBias) ? [0, 0] : _textInfo.texBias;
        var _text = isEmpty(_textInfo.text) ? '' : _textInfo.text;
        var _GolFontID = isEmpty(_textInfo.fontName) ? 'RealBIMFont001' : _textInfo.fontName;
        var _textcolor = isEmpty(_textInfo.textClr) ? 0xffffffff : clrToU32(_textInfo.textClr);
        var _textbordercolor = isEmpty(_textInfo.textBorderClr) ? 0xff000000 : clrToU32(_textInfo.textBorderClr);
        var _textBackMode = isEmpty(_textInfo.textBackMode) ? 0 : _textInfo.textBackMode;
        var _textBackBorder = isEmpty(_textInfo.textBackBorder) ? 0 : _textInfo.textBackBorder;
        var _textBackClr = isEmpty(_textInfo.textBackClr) ? 0x00000000 : clrToU32(_textInfo.textBackClr);
        var _temparrpos = new Module.RE_Vector_dvec3();
        for (var i = 0; i < lineShpInfo.potList.length; ++i) {
            _temparrpos.push_back(lineShpInfo.potList[i]);
        }

        var TempTextRect = [-1, -1, 1, 1];
        var TempTextFmtFlag = 0x40; /*TEXT_FMT_NOCLIP*/
        if (_texBias[0] < 0) {
            TempTextRect[0] = -1;
            TempTextRect[2] = 0;
            TempTextFmtFlag |= 0x20 /*TEXT_FMT_RIGHT*/;
        } else if (_texBias[0] == 0) {
            TempTextRect[0] = -1;
            TempTextRect[2] = 1;
            TempTextFmtFlag |= 0x10 /*TEXT_FMT_LEFT*/;
        } else {
            TempTextRect[0] = 0;
            TempTextRect[2] = 1;
            TempTextFmtFlag |= 0x8 /*TEXT_FMT_LEFT*/;
        }
        if (_texBias[1] < 0) {
            TempTextRect[1] = -1;
            TempTextRect[3] = 0;
            TempTextFmtFlag |= 0x4 /*TEXT_FMT_TOP*/;
        } else if (_texBias[1] == 0) {
            TempTextRect[1] = -1;
            TempTextRect[3] = 1;
            TempTextFmtFlag |= 0x2 /*TEXT_FMT_BOTTOM*/;
        } else {
            TempTextRect[1] = 0;
            TempTextRect[3] = 1;
            TempTextFmtFlag |= 0x1 /*TEXT_FMT_BOTTOM*/;
        }

        var textobj = {
            m_strGolFontID: _GolFontID,
            m_bTextWeight: true,
            m_strText: _text,
            m_uTextClr: _textcolor,
            m_uTextBorderClr: _textbordercolor,
            m_qTextRect: TempTextRect,
            m_uTextFmtFlag: TempTextFmtFlag,
            m_uTextBackMode: _textBackMode,
            m_sTextBackBorder: _textBackBorder,
            m_uTextBackClr: _textBackClr,
        };

        var _groupName = isEmpty(lineShpInfo.groupName) ? 'DefaultGroup' : lineShpInfo.groupName;
        var _shpName = isEmpty(lineShpInfo.shpName) ? '' : lineShpInfo.shpName;
        var _bContactSce = isEmpty(lineShpInfo.contactSce) ? false : lineShpInfo.contactSce;
        var _uClr = isEmpty(lineShpInfo.lineClr) ? 0xffffffff : clrToU32(lineShpInfo.lineClr);
        var _uFillClr = isEmpty(lineShpInfo.fillClr) ? 0xffffffff : clrToU32(lineShpInfo.fillClr);
        var _fillState = isEmpty(lineShpInfo.fillState) ? 0 : lineShpInfo.fillState;
        var _fTextPos = isEmpty(lineShpInfo.textPos) ? -2 : lineShpInfo.textPos;
        var _scrASDist = isEmpty(lineShpInfo.scrASDist) ? -1 : lineShpInfo.scrASDist;
        var _scrVisDist = isEmpty(lineShpInfo.scrVisDist) ? -1 : lineShpInfo.scrVisDist;
        var _projSce = isEmpty(lineShpInfo.projSce) ? false : lineShpInfo.projSce;
        var _proLineTex = '';
        var _lineWidth = 1;
        var _lineTexLength = 1;
        if (_projSce && _proLineTex.length) {
            _proLineTex = isEmpty(lineShpInfo.proLineTex) ? '' : lineShpInfo.proLineTex;
            var _lineUnit = isEmpty(lineShpInfo.lineUnit) ? 0 : lineShpInfo.lineUnit;
            _lineWidth = isEmpty(lineShpInfo.lineWidth) ? 1 : lineShpInfo.lineWidth;
            _lineTexLength = isEmpty(lineShpInfo.lineTexLength) ? 1 : lineShpInfo.lineTexLength;
            _lineWidth = _lineUnit ? -1 * Math.round(_lineWidth) : Math.round(_lineWidth);
            _lineTexLength = _lineUnit ? -1 * Math.round(_lineTexLength) : Math.round(_lineTexLength);
        }

        return Module.RealBIMWeb.AddCustomPolylineShp(
            _shpName,
            _groupName,
            _temparrpos,
            _fillState,
            _uClr,
            _uFillClr,
            _fTextPos,
            textobj,
            _scrASDist,
            _scrVisDist,
            _bContactSce,
            _lineWidth,
            _projSce,
            _proLineTex,
            _lineTexLength
        );
    };

    class REFenceShpInfo {
        constructor() {
            this.shpName = null; //矢量标识名，若已有同名的矢量则覆盖之
            this.groupName = null; //矢量组名称
            this.potList = null; //表示多边形折线序列 xyzw, w分量表示端点处的围栏高度
            this.isClose = null; //表示是否闭合
            this.fenceClr = null; //表示多边形围栏的颜色（REColor 类型）
            this.scrASDist = null; //表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null; //表示屏幕空间矢量的可视距离
            this.contactSce = null; //表示矢量是否与场景发生深度遮挡
            this.texPath = null; //表示纹理路径
        }
    }
    ExtModule.REFenceShpInfo = REFenceShpInfo;

    /**
     * 创建自定义多边形围栏矢量
     * @param {REFenceShpInfo} fenceShpInfo //矢量围栏信息（REFenceShpInfo 类型）
     */
    Module.Geometry.addPolyFenceShp = function (fenceShpInfo) {
        if (isEmptyLog(fenceShpInfo, 'fenceShpInfo')) return;
        if (isEmptyLog(fenceShpInfo.shpName, 'shpName')) return;
        if (!checkTypeLog(fenceShpInfo.potList, 'potList', RE_Enum.RE_Check_Array)) return;

        var _groupName = isEmpty(fenceShpInfo.groupName) ? 'DefaultGroup' : fenceShpInfo.groupName;
        var _temparrpos = new Module.RE_Vector_dvec4();
        for (var i = 0; i < fenceShpInfo.potList.length; ++i) {
            _temparrpos.push_back(fenceShpInfo.potList[i]);
        }

        var _bContactSce = false;
        if (!isEmpty(fenceShpInfo.contactSce)) _bContactSce = fenceShpInfo.contactSce;
        var _uClr = 0xffffffff;
        if (!isEmpty(fenceShpInfo.fenceClr)) _uClr = clrToU32(fenceShpInfo.fenceClr);
        var _texPath = isEmpty(fenceShpInfo.texPath) ? '' : fenceShpInfo.texPath;

        return Module.RealBIMWeb.AddCustomPolyFenceShp(
            fenceShpInfo.shpName,
            _groupName,
            _temparrpos,
            fenceShpInfo.isClose,
            _uClr,
            fenceShpInfo.scrASDist,
            fenceShpInfo.scrVisDist,
            _bContactSce,
            _texPath
        );
    };

    class REVolumeShpInfo {
        constructor() {
            this.shpName = null; //矢量标识名，若已有同名的矢量则覆盖之
            this.groupName = null; //矢量组名称
            this.potList = null; //表示多边形折线序列 xyzw, w分量表示端点处的高度
            this.fenceClr = null; //表示多边形体积面的颜色（REColor 类型）
            this.scrASDist = null; //表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null; //表示屏幕空间矢量的可视距离
            this.contactSce = null; //表示矢量是否与场景发生深度遮挡
            this.genLine = null; //表示是否生成线矢量
            this.lineClr = null; //表示线矢量颜色
            this.lineWidth = null; //表示线矢量宽度
        }
    }
    ExtModule.REVolumeShpInfo = REVolumeShpInfo;

    /**
     * 创建自定义多边形体积矢量
     * @param {REVolumeShpInfo} volumeShpInfo //体积矢量信息（REVolumeShpInfo 类型）
     */
    Module.Geometry.addPolyVolumeShp = function (volumeShpInfo) {
        if (isEmptyLog(volumeShpInfo, 'volumeShpInfo')) return;
        if (isEmptyLog(volumeShpInfo.shpName, 'shpName')) return;
        if (!checkTypeLog(volumeShpInfo.potList, 'potList', RE_Enum.RE_Check_Array)) return;

        var _groupName = isEmpty(volumeShpInfo.groupName) ? 'DefaultGroup' : volumeShpInfo.groupName;
        var _temparrpos = new Module.RE_Vector_dvec4();
        for (var i = 0; i < volumeShpInfo.potList.length; ++i) {
            _temparrpos.push_back(volumeShpInfo.potList[i]);
        }

        var _bContactSce = false;
        if (!isEmpty(volumeShpInfo.contactSce)) _bContactSce = volumeShpInfo.contactSce;
        var _uClr = 0xffffffff;
        if (!isEmpty(volumeShpInfo.fenceClr)) _uClr = clrToU32(volumeShpInfo.fenceClr);
        var _bGenLine = isEmpty(volumeShpInfo.genLine) ? false : volumeShpInfo.genLine;
        var _uLineClr = isEmpty(volumeShpInfo.lineClr) ? 0xff0000ff : clrToU32(volumeShpInfo.lineClr);
        var _uLineWidth = isEmpty(volumeShpInfo.lineWidth) ? 2 : volumeShpInfo.lineWidth;

        return Module.RealBIMWeb.AddCustomBVShp(
            volumeShpInfo.shpName,
            _groupName,
            _temparrpos,
            _uClr,
            volumeShpInfo.scrASDist,
            volumeShpInfo.scrVisDist,
            _bContactSce,
            _bGenLine,
            _uLineClr,
            _uLineWidth
        );
    };

    class REVolumeShpHorInfo {
        constructor() {
            this.shpName = null; //矢量标识名，若已有同名的矢量则覆盖之
            this.groupName = null; //矢量组名称
            this.potList = null; //表示多边形折线序列点（必须为多边形首尾端点构成闭合区域）
            this.minHeight = null; //表示Z轴上多边形体积的最小高度
            this.maxHeight = null; //表示Z轴上多边形体积的最大高度
            this.fenceClr = null; //表示多边形体积面的颜色（REColor 类型）
            this.scrASDist = null; //表示屏幕空间矢量的自动缩放起始距离
            this.scrVisDist = null; //表示屏幕空间矢量的可视距离
            this.contactSce = null; //表示矢量是否与场景发生深度遮挡
            this.genLine = null; //表示是否生成线矢量
            this.lineClr = null; //表示线矢量颜色
            this.lineWidth = null; //表示线矢量宽度
        }
    }
    ExtModule.REVolumeShpHorInfo = REVolumeShpHorInfo;

    /**
     * 创建自定义多边形体积矢量（水平）
     * @param {REVolumeShpHorInfo} volumeShpInfo //体积矢量信息（REVolumeShpHorInfo 类型）
     */
    Module.Geometry.addPolyVolumeShpHor = function (volumeShpInfo) {
        if (isEmptyLog(volumeShpInfo, 'volumeShpInfo')) return;
        if (isEmptyLog(volumeShpInfo.shpName, 'shpName')) return;
        if (!checkTypeLog(volumeShpInfo.potList, 'potList', RE_Enum.RE_Check_Array)) return;

        var _groupName = isEmpty(volumeShpInfo.groupName) ? 'DefaultGroup' : volumeShpInfo.groupName;
        var _minHeight = isEmpty(volumeShpInfo.minHeight) ? 0 : volumeShpInfo.minHeight;
        var _maxHeight = isEmpty(volumeShpInfo.maxHeight) ? 0 : volumeShpInfo.maxHeight;
        var _temparrpos = new Module.RE_Vector_dvec4();
        for (var i = 0; i < volumeShpInfo.potList.length; ++i) {
            let _point = volumeShpInfo.potList[i];
            _point[2] = _minHeight;
            _point[3] = _maxHeight - _minHeight;
            _temparrpos.push_back(_point);
        }

        var _bContactSce = false;
        if (!isEmpty(volumeShpInfo.contactSce)) _bContactSce = volumeShpInfo.contactSce;
        var _uClr = 0xffffffff;
        if (!isEmpty(volumeShpInfo.fenceClr)) _uClr = clrToU32(volumeShpInfo.fenceClr);
        var _bGenLine = isEmpty(volumeShpInfo.genLine) ? false : volumeShpInfo.genLine;
        var _uLineClr = isEmpty(volumeShpInfo.lineClr) ? 0xff0000ff : clrToU32(volumeShpInfo.lineClr);
        var _uLineWidth = isEmpty(volumeShpInfo.lineWidth) ? 2 : volumeShpInfo.lineWidth;

        return Module.RealBIMWeb.AddCustomBVShp(
            volumeShpInfo.shpName,
            _groupName,
            _temparrpos,
            _uClr,
            volumeShpInfo.scrASDist,
            volumeShpInfo.scrVisDist,
            _bContactSce,
            _bGenLine,
            _uLineClr,
            _uLineWidth
        );
    };

    /**
     * 删除某个自定义矢量对象
     * @param {String} shpName //矢量标识名
     */
    Module.Geometry.delShp = function (shpName) {
        return Module.RealBIMWeb.DelCustomShp(shpName);
    };

    /**
     * 清空所有的自定义矢量对象
     */
    Module.Geometry.delAllShps = function () {
        Module.RealBIMWeb.DelAllCustomShps();
    };

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
        } else {
            var _obgCountByte8 = (_ObjCount * 8).toString(); //创建的观察窗口的字节大小
            Module.RealBIMWeb.ReAllocHeapViews(_obgCountByte8); //分配一系列堆内存块的观察窗口
            var elemIds = Module.RealBIMWeb.GetHeapView_U32(0); //获取一个堆内存块的观察窗口
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
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.Geometry.getPotsNotInElems = sharding_createShardingConstuctor(Module.Geometry.getPotsNotInElems, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 删除某个组的所有自定义矢量对象
     * @param {String} groupName //矢量组标识
     */
    Module.Geometry.delGroupShp = function (groupName) {
        return Module.RealBIMWeb.DelCustomShpByGroup(groupName);
    };

    /**
     * 获取所有的组名
     */
    Module.Geometry.getAllGroupName = function () {
        let arrGroupName = Module.RealBIMWeb.GetCustomShpAllGroupName();
        let _groupNameList = [];
        for (let i = 0; i < arrGroupName.size(); i++) {
            _groupNameList.push(arrGroupName.get(i));
        }
        return _groupNameList;
    };

    // MARK 相机
    /**
     * 聚焦相机到指定的矢量对象
     * @param {String} shpName //矢量标识名
     * @param {Number} backwardAmp //表示相机在锚点中心处向后退的强度
     */
    Module.Geometry.setCamToShp = function (shpName, backwardAmp) {
        if (isEmptyLog(shpName, 'shpName')) return;
        var _arrStrName = new Module.RE_Vector_WStr();
        _arrStrName.push_back(shpName);
        Module.RealBIMWeb.FocusCamToCustomShp(_arrStrName, backwardAmp);
    };

    /**
     * 聚焦相机到指定的矢量对象集合
     * @param {Array} shpNameList //矢量标识名集合
     * @param {Number} backwardAmp //表示相机在锚点中心处向后退的强度
     */
    Module.Geometry.setCamToShpList = function (shpNameList, backwardAmp) {
        if (!checkTypeLog(shpNameList, 'shpNameList', RE_Enum.RE_Check_Array)) return;
        if (!shpNameList.length) {
            logParErr('shpNameList');
            return;
        }
        var _arrStrName = new Module.RE_Vector_WStr();
        for (let i = 0; i < shpNameList.length; i++) {
            _arrStrName.push_back(shpNameList[i]);
        }
        Module.RealBIMWeb.FocusCamToCustomShp(_arrStrName, backwardAmp);
    };

    /**
     * 聚焦相机到指定的矢量组
     * @param {String} groupName //矢量组标识
     * @param {Number} backwardAmp //表示相机在锚点中心处向后退的强度
     */
    Module.Geometry.setCamToGroupShp = function (groupName, backwardAmp) {
        if (isEmptyLog(groupName, 'groupName')) return;
        Module.RealBIMWeb.FocusCamToCustomShpGroup(groupName, backwardAmp);
    };

    // MARK 渲染设置
    /**
     * 设置矢量是否允许顶点捕捉
     * @param {Boolean} enable //是否允许
     */
    Module.Geometry.setShpPotCapture = function (enable) {
        Module.RealBIMWeb.SetShpPotCapture(enable);
    };

    /**
     * 设置自定义矢量对象的颜色
     * @param {String} shpName //矢量标识名
     * @param {REColor} shpClr //颜色（REColor 类型）
     */
    Module.Geometry.setShpClr = function (shpName, shpClr) {
        if (isEmptyLog(shpName, 'shpName')) return;
        if (isEmptyLog(shpClr, 'shpClr')) return;
        Module.RealBIMWeb.SetCustomShpColor(shpName, clrToU32(shpClr));
    };

    /**
     * 获取矢量是否允许顶点捕捉
     */
    Module.Geometry.getShpPotCapture = function () {
        return Module.RealBIMWeb.GetShpPotCapture();
    };

    /**
     * 设置一批自定义矢量的可见性
     * @param {Array} shpNameList //矢量标识集合
     * @param {Boolean} enable //是否允许
     */
    Module.Geometry.setShpVisible = function (shpNameList, enable) {
        if (!checkTypeLog(shpNameList, 'shpNameList', RE_Enum.RE_Check_Array)) return;
        if (!shpNameList.length) {
            logParErr('shpNameList');
            return;
        }
        var _arrStrName = new Module.RE_Vector_WStr();
        for (let i = 0; i < shpNameList.length; i++) {
            _arrStrName.push_back(shpNameList[i]);
        }
        Module.RealBIMWeb.SetCustomShpVisibleByName(_arrStrName, enable);
    };

    /**
     * 获取某个自定义矢量的可见性
     * @param {String} shpName //矢量标识
     */
    Module.Geometry.getShpVisible = function (shpName) {
        if (isEmptyLog(shpName, 'shpName')) return;
        return Module.RealBIMWeb.GetCustomShpVisibleByName(shpName);
    };

    /**
     * 设置某个组的自定义矢量的可见性
     * @param {String} groupName //矢量组标识
     * @param {Boolean} enable //是否允许
     */
    Module.Geometry.setGroupShpVisible = function (groupName, enable) {
        if (isEmptyLog(groupName, 'groupName')) return;
        let groupNameList = Module.Geometry.getAllGroupName();
        if (!groupNameList.includes(groupName)) {
            logErr('没有此矢量组');
            return;
        }
        Module.RealBIMWeb.SetCustomShpVisible(groupName, enable);
    };

    /**
     * 获取某个组的自定义矢量的可见性
     * @param {String} groupName //矢量组标识
     */
    Module.Geometry.getGroupShpVisible = function (groupName) {
        if (isEmptyLog(groupName, 'groupName')) return;
        let groupNameList = Module.Geometry.getAllGroupName();
        if (!groupNameList.includes(groupName)) {
            logErr('没有此矢量组');
            return;
        }
        return Module.RealBIMWeb.GetCustomShpVisible(groupName);
    };

    /**
     * 设置某个组矢量元素是否与主场景产生深度遮挡
     * @param {String} groupName //矢量组标识
     * @param {Boolean} enable //是否允许
     */
    Module.Geometry.setGroupShpCanOverlap = function (groupName, enable) {
        if (isEmptyLog(groupName, 'groupName')) return;
        let groupNameList = Module.Geometry.getAllGroupName();
        if (!groupNameList.includes(groupName)) {
            logErr('没有此矢量组');
            return;
        }
        Module.RealBIMWeb.SetCustomShpContactSce(groupName, enable);
    };

    /**
     * 获取某个组矢量元素是否与主场景产生深度遮挡
     * @param {String} groupName //矢量组标识
     */
    Module.Geometry.getGroupShpCanOverlap = function (groupName) {
        if (isEmptyLog(groupName, 'groupName')) return;
        let groupNameList = Module.Geometry.getAllGroupName();
        if (!groupNameList.includes(groupName)) {
            logErr('没有此矢量组');
            return;
        }
        return Module.RealBIMWeb.GetCustomShpContactSce(groupName);
    };

    /**
     * 设置某个组矢量元素的全局最大可视距离，超过该距离矢量会消失
     * @param {String} groupName //矢量组标识
     * @param {Number} dist //距离
     */
    Module.Geometry.setGroupShpVisDist = function (groupName, dist) {
        if (isEmptyLog(groupName, 'groupName')) return;
        let groupNameList = Module.Geometry.getAllGroupName();
        if (!groupNameList.includes(groupName)) {
            logErr('没有此矢量组');
            return;
        }
        Module.RealBIMWeb.SetCustomShpVisDist(groupName, dist);
    };

    /**
     * 获取某个组矢量元素的全局最大可视距离
     * @param {String} groupName //矢量组标识
     */
    Module.Geometry.getGroupShpVisDist = function (groupName) {
        if (isEmptyLog(groupName, 'groupName')) return;
        let groupNameList = Module.Geometry.getAllGroupName();
        if (!groupNameList.includes(groupName)) {
            logErr('没有此矢量组');
            return;
        }
        return Module.RealBIMWeb.GetCustomShpVisDist(groupName);
    };

    /**
     * 设置某个组矢量元素的全局最小自动缩放距离，超过该距离矢量会自动缩小
     * @param {String} groupName //矢量组标识
     * @param {Number} dist //距离
     */
    Module.Geometry.setGroupShpAutoScaleDist = function (groupName, dist) {
        if (isEmptyLog(groupName, 'groupName')) return;
        let groupNameList = Module.Geometry.getAllGroupName();
        if (!groupNameList.includes(groupName)) {
            logErr('没有此矢量组');
            return;
        }
        Module.RealBIMWeb.SetCustomShpAutoScaleDist(groupName, dist);
    };

    /**
     * 获取某个组矢量元素的全局最小自动缩放距离
     * @param {String} groupName //矢量组标识
     */
    Module.Geometry.getGroupShpAutoScaleDist = function (groupName) {
        if (isEmptyLog(groupName, 'groupName')) return;
        let groupNameList = Module.Geometry.getAllGroupName();
        if (!groupNameList.includes(groupName)) {
            logErr('没有此矢量组');
            return;
        }
        return Module.RealBIMWeb.GetCustomShpAutoScaleDist(groupName);
    };

    /**
     * 设置某个组矢量元素是否投影地形 注：仅线（面）矢量有效
     * @param {String} groupName //矢量组标识
     * @param {Boolean} projSce //是否投影地形
     */
    Module.Geometry.setGroupShpProjSce = function (groupName, projSce) {
        if (isEmptyLog(groupName, 'groupName')) return;
        Module.RealBIMWeb.SetCustomShpProjSce(groupName, projSce);
    };

    /**
     * 设置自定义矢量预设的可视距离 注：小于0时，表示无效；大于等于0时则统一使用该预设距离，如果设置了预设距离，且数值大于等于0，则表示自定义矢量接口中的可是距离参数无效
     * @param {Number} ptVisDist //点可视距离
     * @param {Number} textVisDist //文字可视距离
     * @param {Number} lineVisDist //线可视距离
     * @param {Number} faceVisDist //面可视距离
     */
    Module.Geometry.setCustomShpPresetVisDist = function (ptVisDist, textVisDist, lineVisDist, faceVisDist) {
        const _ptVisDist = isEmpty(ptVisDist) ? -1 : ptVisDist;
        const _textVisDist = isEmpty(textVisDist) ? -1 : textVisDist;
        const _lineVisDist = isEmpty(lineVisDist) ? -1 : lineVisDist;
        const _faceVisDist = isEmpty(faceVisDist) ? -1 : faceVisDist;

        Module.RealBIMWeb.SetCustomShpPresetVisDist(_ptVisDist, _textVisDist, _lineVisDist, _faceVisDist);
    };

    // MOD-- 填挖方（Earthwork） <---
    Module.Earthwork = typeof Module.Earthwork !== 'undefined' ? Module.Earthwork : {}; //增加 Earthwork 模块

    /**
     * 进入土方测量区域绘制状态
     */
    Module.Earthwork.startCreate = function () {
        Module.RealBIMWeb.EnterEarthworkCreateMode();
    };

    /**
     * 退出土方测量区域绘制状态
     */
    Module.Earthwork.endCreate = function () {
        Module.RealBIMWeb.ExitEarthworkCreateMode();
    };

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
    };

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
        Module.RealBIMWeb.CalcEarthworkValues(temparrpos, elevation, dataSetId, '', 9);
    };

    // MOD-- BIM（BIM） <---
    Module.BIM = typeof Module.BIM !== 'undefined' ? Module.BIM : {}; //增加 BIM 模块

    class REElemBlendAttr {
        constructor() {
            this.dataSetId = null; //数据集标识
            this.elemIdList = null; //构件id集合
            this.elemClr = null; //构件颜色（REColor 类型）
            this.clrWeight = null; //颜色权重
            this.alphaWeight = null; //透明度权重
            this.elemEmis = null; //	表示构件的自发光强度，0~255
            this.elemEmisPercent = null; //	表示构件自发光强度所占的权重，0~255
            this.elemSmooth = null; //	表示构件的光泽度，0~255
            this.elemMetal = null; //	表示构件的金属质感，0~255
            this.elemSmmePercent = null; //	表示光泽度和金属质感的权重，0~255
        }
    }
    ExtModule.REElemBlendAttr = REElemBlendAttr;

    class REElemAttr {
        constructor() {
            this.dataSetId = null; //数据集标识
            this.elemIdList = null; //构件id集合
            // this.elemClr = new REColor(0, 0, 0, 0); //构件颜色（REColor 类型）
            this.elemClr = null; //构件颜色（REColor 类型）
            this.clrWeight = null; //颜色权重, 此权重要使用必须配合颜色值存在
            this.alphaWeight = null; //透明度权重, 此权重要使用必须配合透明度值存在
            this.elemEmis = null; //	表示构件的自发光强度，0~255
            this.elemEmisPercent = null; //	表示构件自发光强度所占的权重，0~255
            this.elemSmooth = null; //	表示构件的光泽度，0~255
            this.elemMetal = null; //	表示构件的金属质感，0~255
            this.elemSmmePercent = null; //	表示光泽度和金属质感的权重，0~255
            this.useNewAlpha = true; // 是否作用设置的透明度信息，默认不使用
            this.useNewClr = true; // 是否作用设置的颜色信息，默认不使用
            this.useNewEmis = true; // 是否作用设置的自发光信息，默认不使用
            this.useNewSmoothMetal = true; // 是否作用设置的光泽度金属性信息，默认不使用
        }
    }
    ExtModule.REElemAttr = REElemAttr;

    // MARK 构件属性
    /**
     * 设置构件混合属性
     * @param {REElemAttr} elemAttr //构件的属性
     */
    Module.BIM.setElemAttr = function (elemAttr) {
        if (isEmptyLog(elemAttr, 'elemAttr')) return;
        if (isEmptyLog(elemAttr.dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemAttr.elemIdList, 'elemIdList')) return;

        var _elemScope = 0;
        if (!isEmpty(elemAttr.elemScope)) {
            _elemScope = elemAttr.elemScope;
        }

        var _clr = 0x00000000;
        var _alpha = 0x00000000;
        const _clrWeight = isEmpty(elemAttr.clrWeight) ? 255 : elemAttr.clrWeight;
        const _alphaWeight = isEmpty(elemAttr.alphaWeight) ? 255 : elemAttr.alphaWeight;

        var _useNewAlpha = isEmpty(elemAttr.useNewAlpha) ? true : elemAttr.useNewAlpha;
        var _useNewClr = isEmpty(elemAttr.useNewClr) ? true : elemAttr.useNewClr;
        var _useNewEmis = isEmpty(elemAttr.useNewEmis) ? true : elemAttr.useNewEmis;
        var _useNewSmoothMetal = isEmpty(elemAttr.useNewSmoothMetal) ? true : elemAttr.useNewSmoothMetal;
        if (isEmpty(elemAttr.elemClr)) {
            _useNewAlpha = false;
            _useNewClr = false;
        }
        if (isEmpty(elemAttr.elemEmis) && isEmpty(elemAttr.elemEmisPercent)) {
            _useNewEmis = false;
        }
        if (isEmpty(elemAttr.elemSmooth) && isEmpty(elemAttr.elemMetal) && isEmpty(elemAttr.elemSmmePercent)) {
            _useNewSmoothMetal = false;
        }

        if (!isEmpty(elemAttr.elemClr)) {
            _clr = clrToU32_W_WBGR(elemAttr.elemClr, _clrWeight);
            _alpha = clrToU32_AlphaW_Use_a_c_e_sm(elemAttr.elemClr.alpha, _alphaWeight, _useNewAlpha, _useNewClr, _useNewEmis, _useNewSmoothMetal);
        } else {
            _clr = clrToU32_W_WBGR(new REColor(0, 0, 0, 0), _clrWeight);
            _alpha = clrToU32_AlphaW_Use_a_c_e_sm(0, _alphaWeight, false, false, _useNewEmis, _useNewSmoothMetal);
        }
        var _pbr = convPBR(elemAttr);

        if (elemAttr.dataSetId == '') {
            //多数据集设置
            var _moemory = (24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, 0, _clr, _pbr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt('', '', 0xffffffff, _clrs.byteOffset, _elemScope);
        } else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(elemAttr.dataSetId);
            var _count = elemAttr.elemIdList.length;
            if (_count == 0) {
                //如果构件ID集合为空，则默认为改变所有构件的信息
                var _moemory = (24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                _clrs.set([0, _projid, _alpha, 0, _clr, _pbr], 0);
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(elemAttr.dataSetId, '', 0xffffffff, _clrs.byteOffset, _elemScope);
            } else {
                var _moemory = (_count * 24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < _count; ++i) {
                    _clrs.set([elemAttr.elemIdList[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
                }
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(elemAttr.dataSetId, '', _clrs.byteLength, _clrs.byteOffset, _elemScope);
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.setElemAttr = sharding_createShardingConstuctor(Module.BIM.setElemAttr, {
            idPath: 'elemIdList',
            argIndex: 'elemAttr',
        });
    }

    /**
     * 获取当前构件设置的混合属性
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     */
    Module.BIM.getElemAttr = function (dataSetId, elemIdList) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmptyLog(elemIdList)) return;

        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var _elemIdListTemp = elemIdList.length == 0 ? Module.BIM.getDataSetAllElemIDs(dataSetId, true) : elemIdList;
        var _count = _elemIdListTemp.length;
        var _moemory = (_count * 24).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
        var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
        for (let i = 0; i < _count; ++i) {
            var eleid = _elemIdListTemp[i];
            _clrs.set([eleid, _projid, 0x00000000, 0, 0x00000000, 0x00000000], i * 6);
        }
        var clrinfoarr = Module.RealBIMWeb.GetHugeObjSubElemClrInfosExt(dataSetId, '', _clrs.byteLength, _clrs.byteOffset);
        var elemAttrList = [];
        for (var i = 0; i < clrinfoarr.length; i += 6) {
            let elemAttrInfo = new REElemAttr();
            // let elemAttrInfo = {};
            elemAttrInfo.dataSetId = dataSetId;
            elemAttrInfo.elemId = clrinfoarr[i];
            let red = parseInt(conv32_hex16(clrinfoarr[i + 4]).substring(6, 8), 16);
            let green = parseInt(conv32_hex16(clrinfoarr[i + 4]).substring(4, 6), 16);
            let blue = parseInt(conv32_hex16(clrinfoarr[i + 4]).substring(2, 4), 16);
            let alpha = parseInt(conv32_hex16(clrinfoarr[i + 2]).substring(2, 4), 16);
            elemAttrInfo.elemClr = new REColor(red, green, blue, alpha);
            elemAttrInfo.alphaWeight = parseInt(conv32_hex16(clrinfoarr[i + 2]).substring(0, 2), 16);
            elemAttrInfo.clrWeight = parseInt(conv32_hex16(clrinfoarr[i + 4]).substring(0, 2), 16);
            elemAttrInfo.elemEmis = parseInt(conv32_hex16(clrinfoarr[i + 5]).substring(6, 8), 16);
            elemAttrInfo.elemEmisPercent = parseInt(conv32_hex16(clrinfoarr[i + 5]).substring(4, 6), 16);
            let elemSmme = parseInt(conv32_hex16(clrinfoarr[i + 5]).substring(2, 4), 16);
            let uElemSmooth = Math.round(((elemSmme & 0x3f) / 63.0) * 255.0);
            let uElemMeta = Math.round(((elemSmme >> 6) / 3.0) * 255.0);
            elemAttrInfo.elemSmooth = uElemSmooth;
            elemAttrInfo.elemMetal = uElemMeta;
            elemAttrInfo.elemSmmePercent = parseInt(conv32_hex16(clrinfoarr[i + 5]).substring(0, 2), 16);
            elemAttrInfo.useNewAlpha = null;
            elemAttrInfo.useNewClr = null;
            elemAttrInfo.useNewEmis = null;
            elemAttrInfo.useNewSmoothMetal = null;

            elemAttrList.push(removeEmptyProperty(elemAttrInfo));
        }
        return elemAttrList;
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.getElemAttr = sharding_createShardingConstuctor(Module.BIM.getElemAttr, {
            idPath: '',
            argIndex: 1,
            hasReturnValue: true,
        });
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
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;

        var _alphaWeight = 255;
        if (!isEmpty(alphaWeight)) _alphaWeight = alphaWeight;
        var _elemScope = 0;
        if (!isEmpty(elemScope)) {
            _elemScope = elemScope;
        }
        var _alpha = clrToU32_AlphaW_Use_a_c_e_sm(elemAlpha, _alphaWeight, true, false, false, false);
        var _clr = 0x000000ff;
        var _pbr = 0x00000000;

        if (dataSetId == '') {
            //多数据集设置
            var _moemory = (24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, 0, _clr, _pbr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfos('', '', 0xffffffff, _clrs.byteOffset, _elemScope);
        } else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                //如果构件ID集合为空，则默认为改变所有构件的信息
                var _moemory = (24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                _clrs.set([0, _projid, _alpha, 0, _clr, _pbr], 0);
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, '', 0xffffffff, _clrs.byteOffset, _elemScope);
            } else {
                var _moemory = (_count * 24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < _count; ++i) {
                    _clrs.set([elemIdList[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
                }
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, '', _clrs.byteLength, _clrs.byteOffset, _elemScope);
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.setElemAlpha = sharding_createShardingConstuctor(Module.BIM.setElemAlpha, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 恢复构件的默认属性
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.resetElemAttr = function (dataSetId, elemIdList, elemScope) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;

        var _elemScope = 0;
        if (!isEmpty(elemScope)) {
            _elemScope = elemScope;
        }
        var _clr = 0x000000ff;
        var _alpha = 0x0080ffff;
        var _pbr = 0x00000000;

        if (dataSetId == '') {
            //多数据集设置
            var _moemory = (24).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
            _clrs.set([0, 0, _alpha, 0, _clr, _pbr], 0);
            Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt('', '', 0xffffffff, _clrs.byteOffset, _elemScope);
        } else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                //如果构件ID集合为空，则默认为改变所有构件的信息
                var _moemory = (24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                _clrs.set([0, _projid, _alpha, 0, _clr, _pbr], 0);
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, '', 0xffffffff, _clrs.byteOffset, _elemScope);
            } else {
                var _moemory = (_count * 24).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < _count; ++i) {
                    _clrs.set([elemIdList[i], _projid, _alpha, 0, _clr, _pbr], i * 6);
                }
                Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(dataSetId, '', _clrs.byteLength, _clrs.byteOffset, _elemScope);
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.resetElemAttr = sharding_createShardingConstuctor(Module.BIM.resetElemAttr, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 根据id判断一个构件是否被设为透明
     * @param {String} dataSetId //数据集标识
     * @param {Number} elemId //构件id
     */
    Module.BIM.getElemHideState = function (dataSetId, elemId) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmptyLog(elemId, 'elemId')) return;
        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        Module.RealBIMWeb.ReAllocHeapViews('16'); //分配空间
        _clrs = Module.RealBIMWeb.GetHeapView_U32(0);
        _clrs.set([elemId, _projid, 0x00000000, 0x00000000], 0);
        var retarray = Module.RealBIMWeb.GetHugeObjSubElemClrInfos(dataSetId, '', _clrs.byteLength, _clrs.byteOffset);
        var alphainfo = retarray[2].toString(16);
        var isusenewalpha = alphainfo.substring(6, 8);
        var newalpha = alphainfo.substring(2, 4);
        var newalphapercent = alphainfo.substring(0, 2);
        var temp01 = parseInt(isusenewalpha, 16);
        var temp02 = parseInt(newalpha, 16);
        var temp03 = parseInt(newalphapercent, 16);
        if (temp01 > 0 && temp02 == 0 && temp03 == 255) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 获取元素集合的总包围盒信息
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.getElemTotalBV = function (dataSetId, elemIdList, elemScope) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;
        var _elemScope = 0;
        if (!isEmpty(elemScope)) {
            _elemScope = elemScope;
        }
        var _bvTemp;
        if (dataSetId == '') {
            //多数据集设置
            _bvTemp = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV('', '', 0xffffffff, 0, _elemScope); //获取所有构件的包围盒信息
        } else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                _bvTemp = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(dataSetId, '', 0xffffffff, 0, _elemScope); //获取所有构件的包围盒信息
            } else {
                var _temparr = [];
                for (var i = 0; i < _count; ++i) {
                    _temparr.push(elemIdList[i]);
                    _temparr.push(_projid);
                }
                var _selids = new Uint32Array(_temparr);
                Module.RealBIMWeb.ReAllocHeapViews(_selids.byteLength.toString());
                var _tempids = Module.RealBIMWeb.GetHeapView_U32(0);
                _tempids.set(_selids, 0);
                _bvTemp = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(dataSetId, '', _tempids.byteLength, _tempids.byteOffset, _elemScope);
            }
        }
        var aabbList = [];
        aabbList.push(_bvTemp[0][0]); //Xmin
        aabbList.push(_bvTemp[1][0]); //Xmax
        aabbList.push(_bvTemp[0][1]); //Ymin
        aabbList.push(_bvTemp[1][1]); //Ymax
        aabbList.push(_bvTemp[0][2]); //Zmin
        aabbList.push(_bvTemp[1][2]); //Zmax
        return aabbList;
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.getElemTotalBV = sharding_createShardingConstuctor(Module.BIM.getElemTotalBV, {
            idPath: '',
            argIndex: 1,
            hasReturnValue: true,
            mergeFn: (results) => {
                // 自定义合并逻辑，包围盒求和
                if (results.length === 0) {
                    return [0, 0, 0, 0, 0];
                }
                const merged = [...results[0]];
                for (let i = 1; i < results.length; i++) {
                    const current = results[i];
                    if (current.length !== 6) {
                        return [0, 0, 0, 0, 0];
                    }
                    merged[0] = Math.min(merged[0], current[0]); // xMin
                    merged[1] = Math.max(merged[1], current[1]); // xMax
                    merged[2] = Math.min(merged[2], current[2]); // yMin
                    merged[3] = Math.max(merged[3], current[3]); // yMax
                    merged[4] = Math.min(merged[4], current[4]); // zMin
                    merged[5] = Math.max(merged[5], current[5]); // zMax
                }
                return merged;
            },
        });
    }

    /**
     * 获取模型的包围盒信息
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getTotalBV = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        var _tempbv = Module.RealBIMWeb.GetHugeObjBoundingBox(dataSetId, '');
        var aabbList = [];
        aabbList.push(_tempbv[0][0]);
        aabbList.push(_tempbv[1][0]); //Xmin、Xmax
        aabbList.push(_tempbv[0][1]);
        aabbList.push(_tempbv[1][1]); //Ymin、Ymax
        aabbList.push(_tempbv[0][2]);
        aabbList.push(_tempbv[1][2]); //Zmin、Zmax
        return aabbList;
    };

    // MARK 选择集
    /**
     * 设置当前的选择类型
     * @param {Number} mode //类型（ 0:数据集| 1:构件级）
     */
    Module.BIM.setSelMode = function (mode) {
        if (mode == 0) {
            Module.RealBIMWeb.SetCtrlLevel(Module.RE_CTRL_LEVEL.PROJ);
        } else if (mode == 1) {
            Module.RealBIMWeb.SetCtrlLevel(Module.RE_CTRL_LEVEL.ELEM);
        }
    };

    /**
     * 获取当前的选择类型
     */
    Module.BIM.getSelMode = function () {
        let cureditlevel = Module.RealBIMWeb.GetCtrlLevel();
        let mode = cureditlevel.value != 0 ? 1 : 0; // 当前对外只有数据集和构件类型，单构件和构件都返回一个类型
        return mode;
    };

    class RESelElemsBlendAttr {
        constructor() {
            this.elemClr = new REColor(255, 0, 0, 255); //元素颜色（REColor 类型）
            this.clrWeight = 255; //颜色权重, 此权重要使用必须配合颜色值存在
            this.alphaWeight = 255; //透明度权重, 此权重要使用必须配合透明度值存在
            this.probeMask = 1; //探测掩码（是否可以穿透选中，1: 不能穿透，0: 允许穿透, 穿透模式需要配合Ctrl键或多选模式操作）
            this.attrValid = true; //表示属性信息是否有效，若无效则选择集合将不采用该全局属性信息；默认有效（true）
        }
    }
    ExtModule.RESelElemsBlendAttr = RESelElemsBlendAttr;

    /**
     * 设置选择集的混合信息
     * @param {RESelElemsBlendAttr} elemAttr //混合信息
     */
    Module.BIM.setSelElemsBlendAttr = function (elemAttr) {
        if (isEmptyLog(elemAttr, 'elemAttr')) return;
        if (isEmptyLog(elemAttr.elemClr, 'elemClr')) return;

        var _attrvalid = true;
        if (!isEmpty(elemAttr.attrValid)) {
            _attrvalid = elemAttr.attrValid;
        }
        var _probeMask = 1;
        if (!isEmpty(elemAttr.probeMask)) {
            _probeMask = elemAttr.probeMask > 0 ? 1 : 0;
        }
        var obj_attr = {
            m_bAttrValid: _attrvalid,
            m_qClrBlend: [
                elemAttr.elemClr.red / 255,
                elemAttr.elemClr.green / 255,
                elemAttr.elemClr.blue / 255,
                (isEmpty(elemAttr.clrWeight) ? 255 : elemAttr.clrWeight) / 255,
            ],
            m_vAlphaBlend: [elemAttr.elemClr.alpha / 255, (isEmpty(elemAttr.alphaWeight) ? 255 : elemAttr.alphaWeight) / 255],
            m_uProbeMask: _probeMask,
        };
        Module.RealBIMWeb.SetSelElemsAttr(obj_attr);
    };

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
        blendAttr.probeMask = curattr.m_uProbeMask > 0 ? 1 : 0;
        blendAttr.attrValid = curattr.m_bAttrValid;
        return blendAttr;
    };

    /**
     * 设置选择集的颜色、透明度、探测掩码（即是否可以穿透选中）
     * @param {REColor} elemClr //构件颜色（REColor 类型）
     * @param {Number} probeMask //探测掩码（是否可以穿透选中，1: 不能穿透，0: 允许穿透, 穿透模式需要配合Ctrl键或多选模式操作）
     * @param {Boolean} attrValid //表示属性信息是否有效，若无效则选择集合将不采用该全局属性信息；默认有效（true）
     */
    Module.BIM.setSelElemsAttr = function (elemClr, probeMask, attrValid) {
        if (isEmptyLog(elemClr, 'elemClr')) return;
        var _attrvalid = true;
        if (!isEmpty(attrValid)) {
            _attrvalid = attrValid;
        }
        var _probeMask = 1;
        if (!isEmpty(probeMask)) {
            _probeMask = probeMask;
        }
        var obj_attr = {
            m_bAttrValid: _attrvalid,
            m_qClrBlend: [elemClr.red / 255, elemClr.green / 255, elemClr.blue / 255, 1.0],
            m_vAlphaBlend: [elemClr.alpha / 255, 1.0],
            m_uProbeMask: _probeMask,
        };
        Module.RealBIMWeb.SetSelElemsAttr(obj_attr);
    };

    /**
     * 单独设置选择集的颜色
     * @param {REColor} setSelElemsClr //构件颜色（REColor 类型）
     */
    Module.BIM.setSelElemsClr = function (elemClr) {
        if (isEmptyLog(elemClr, 'elemClr')) return;
        var _curattr = Module.RealBIMWeb.GetSelElemsAttr();
        var _attrvalid = _curattr.m_bAttrValid;
        var _selAlpha = _curattr.m_vAlphaBlend;
        var _selProbeMask = _curattr.m_uProbeMask;
        let _clrWeight = 1.0;
        var obj_attr = {
            m_bAttrValid: _attrvalid,
            m_qClrBlend: [elemClr.red / 255, elemClr.green / 255, elemClr.blue / 255, _clrWeight],
            m_vAlphaBlend: [elemClr.alpha / 255, _selAlpha[1]],
            m_uProbeMask: _selProbeMask,
        };
        return Module.RealBIMWeb.SetSelElemsAttr(obj_attr);
    };

    /**
     * 单独设置选择集的透明度
     * @param {Number} elemAlpha //构件透明度，取值范围0-255
     */
    Module.BIM.setSelElemsAlpha = function (elemAlpha) {
        var _curattr = Module.RealBIMWeb.GetSelElemsAttr();
        var _attrvalid = _curattr.m_bAttrValid;
        var _selClr = _curattr.m_qClrBlend;
        var _selProbeMask = _curattr.m_uProbeMask;
        var obj_attr = {
            m_bAttrValid: _attrvalid,
            m_qClrBlend: _selClr,
            m_vAlphaBlend: [elemAlpha / 255, 1.0],
            m_uProbeMask: _selProbeMask,
        };
        return Module.RealBIMWeb.SetSelElemsAttr(obj_attr);
    };

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
            probeMask: curattr.m_uProbeMask > 0 ? 1 : 0,
            attrValid: curattr.m_bAttrValid,
        };
        return objAttr;
    };

    /**
     *  重置选择集的属性信息为默认值
     */
    Module.BIM.resetSelElemsAttr = function () {
        return Module.RealBIMWeb.SetSelElemsAttr({ m_bAttrValid: true, m_qClrBlend: [1, 0, 0, 0.8], m_vAlphaBlend: [0.29, 1], m_uProbeMask: 1 });
    };

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
                    curprojinfo['dataSetId'] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
                    curprojinfo['elemIdList'] = curprojelemarr;
                    projidarr.push(curprojinfo);
                    curprojelemarr = [];
                }
                curprojid = tempselids[i + 1];
                curprojelemarr.push(tempselids[i]);
            }
        }
        if (curprojelemarr.length > 0) {
            var curprojinfo = {};
            curprojinfo['dataSetId'] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
            curprojinfo['elemIdList'] = curprojelemarr;
            projidarr.push(curprojinfo);
            curprojelemarr = [];
        }
        return projidarr;
    };

    /**
     * 往当前选择集合添加构件
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     */
    Module.BIM.addToSelElems = function (dataSetId, elemIdList) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(elemIdList) || !elemIdList.length) {
            logParErr('elemIdList');
            return;
        }

        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var _count = elemIdList.length;
        // if (_count == 0) {
        //     var _elemIdListTemp = Module.BIM.getDataSetAllElemIDs(dataSetId, true);
        //     var _moemory = (_elemIdListTemp.length * 8).toString();
        //     Module.RealBIMWeb.ReAllocHeapViews(_moemory);//分配空间
        //     var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        //     for (let i = 0; i < _elemIdListTemp.length; ++i) {
        //         var eleid = _elemIdListTemp[i];
        //         _elemIds.set([eleid, _projid], i * 2);
        //     }
        //     Module.RealBIMWeb.AddToSelElemIDs(_elemIds.byteLength, _elemIds.byteOffset);
        // } else {
        var _moemory = (_count * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (let i = 0; i < _count; ++i) {
            var eleid = elemIdList[i];
            _elemIds.set([eleid, _projid], i * 2);
        }
        Module.RealBIMWeb.AddToSelElemIDs(_elemIds.byteLength, _elemIds.byteOffset);
        // }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.addToSelElems = sharding_createShardingConstuctor(Module.BIM.addToSelElems, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 从当前选择集合删除构件
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     */
    Module.BIM.delFromSelElems = function (dataSetId, elemIdList) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;
        var _count = elemIdList.length;
        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        if (_count == 0 || dataSetId == '') {
            Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff, 0); //删除全部构件
        } else {
            var _moemory = (_count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (let i = 0; i < _count; ++i) {
                var eleid = elemIdList[i];
                _elemIds.set([eleid, _projid], i * 2);
            }
            Module.RealBIMWeb.RemoveFromSelElemIDs(_elemIds.byteLength, _elemIds.byteOffset);
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.delFromSelElems = sharding_createShardingConstuctor(Module.BIM.delFromSelElems, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 清空选择集中的所有构件
     */
    Module.BIM.delAllSelElems = function () {
        Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff, 0);
    };

    /**
     * 获取当前选择集中所有的数据集id
     */
    Module.BIM.getSelDataSetIDs = function () {
        var tempArr = Module.RealBIMWeb.GetCurSelProjIDs();
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 往当前选择集合添加数据集
     * @param {String} dataSetId //数据集唯一标识
     */
    Module.BIM.addToSelDataSet = function (dataSetId) {
        var _projvec = new Module.RE_Vector_WStr();
        _projvec.push_back(dataSetId);
        Module.RealBIMWeb.AddToCurSelProjIDs(_projvec); //把1个数据集加入选择集
    };

    /**
     * 从当前选择集合删除数据集
     * @param {Array} dataSetIdList //数据集唯一标识集合
     */
    Module.BIM.delFromSelDateSets = function (dataSetIdList) {
        var _projvec = new Module.RE_Vector_WStr();
        for (let i = 0; i < dataSetIdList.length; i++) {
            _projvec.push_back(dataSetIdList[i]);
        }
        Module.RealBIMWeb.RemoveFromCurSelProjIDs(_projvec);
    };

    /**
     * 清空当前选择集中的所有数据集
     */
    Module.BIM.delAllSelDateSets = function () {
        var _projvec = new Module.RE_Vector_WStr();
        Module.RealBIMWeb.RemoveFromCurSelProjIDs(_projvec);
    };

    /**
     * 获取当前场景的所有可见元素id
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} visibalOnly //是否去除当前设置透明度为0的构件id
     */
    Module.BIM.getDataSetAllElemIDs = function (dataSetId, visibalOnly) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        var tempelemids = new Uint32Array(Module.RealBIMWeb.GetHugeObjSubElemIDs(dataSetId, '', visibalOnly));
        var elemIds = [];
        for (let i = 0; i < tempelemids.length; i += 2) {
            if (tempelemids[i] == 4294967280) {
                //去除c++辅助局部元素的构件id （挖坑用的辅助元素）
                continue;
            }
            elemIds.push(tempelemids[i]);
        }
        return elemIds;
    };

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
            for (let i = 0; i < _arr.length; ++i) {
                if (_arr[i] == 4294967280) {
                    //去除c++辅助局部元素的构件id （挖坑用的辅助元素）
                    continue;
                }
                elemIds.push(_arr[i]);
            }
        }
        return elemIds;
    };

    class RESelAxisGridRegInfo {
        constructor() {
            this.dataSetId = null; //数据集标识，为空串则表示处理所有数据集
            this.gridGroupName = null; //表示轴网所属组的唯一标识
            this.gridNameList = null; //表示轴网的集合，要求轴网等于四个，并能够形成闭合多边形
            this.offset = null; //表示四个轴网的偏移量，默认向多边形内部为负，多边形外部为正
            this.minHeight = null; //表示Z轴上多边形裁剪区域的最小高度
            this.maxHeight = null; //表示Z轴上多边形裁剪区域的最大高度
            this.onlyVisible = null; //表示是否仅包含可见元素
            this.includeInter = null; //表示是否包含与多边形区域边界相交的元素
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
        Module.RealBIMWeb.ClipHugeObjSubElemsByGrid(
            regInfo.dataSetId,
            regInfo.gridGroupName,
            _tempArrGridName,
            regInfo.offset,
            regInfo.minHeight,
            regInfo.maxHeight,
            regInfo.onlyVisible,
            regInfo.includeInter
        );
    };

    class RESelPolyFenceRegInfo {
        constructor() {
            this.dataSetId = null; //数据集标识，为空串则表示处理所有数据集
            this.pointList = null; //多边形点集合（必须为多边形首尾端点构成闭合区域）
            this.minHeight = null; //表示Z轴上多边形裁剪区域的最小高度
            this.maxHeight = null; //表示Z轴上多边形裁剪区域的最大高度
            this.onlyVisible = null; //表示是否仅包含可见元素
            this.includeInter = null; //表示是否包含与多边形区域边界相交的元素
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
        Module.RealBIMWeb.PolyClipHugeObjSubElems(
            regInfo.dataSetId,
            '',
            _polypots.byteLength,
            _polypots.byteOffset,
            regInfo.minHeight,
            regInfo.maxHeight,
            regInfo.onlyVisible,
            regInfo.includeInter
        );
    };

    /**
     * 设置选中标记的颜色和透明度
     * @param {REColor} markClr //标记颜色（REColor 类型）
     */
    Module.BIM.setSelMarkClr = function (markClr) {
        if (isEmptyLog(markClr, 'markClr')) return;

        let _markClr = isEmpty(markClr) ? [1.0, 1.0, 0.0, 0.5] : clrToRGBA_List(markClr);
        Module.RealBIMWeb.SetSelMarkClr(_markClr);
    };

    /**
     * 获取选中标记的颜色和透明度
     */
    Module.BIM.getSelMarkClr = function () {
        const arrClr = Module.RealBIMWeb.GetSelMarkClr();
        return clrRGBAListToClr(arrClr);
    };

    // MARK 渲染设置

    /**
     * 设置构件的有效性
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Boolean} enable //是否有效
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.setElemsValidState = function (dataSetId, elemIdList, enable, elemScope) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;

        var _elemScope = 0;
        if (!isEmpty(elemScope)) {
            _elemScope = elemScope;
        }
        var _count = elemIdList.length;
        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        if (_count == 0) {
            //如果构件ID集合为空，则默认为设置所有构件
            Module.RealBIMWeb.SetHugeObjSubElemValidStates(dataSetId, '', 0xffffffff, 0, enable, _elemScope);
        } else {
            var _moemory = (_count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory);
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (let i = 0; i < _count; ++i) {
                var eleid = elemIdList[i];
                _elemIds.set([eleid, _projid], i * 2);
            }
            Module.RealBIMWeb.SetHugeObjSubElemValidStates(dataSetId, '', _elemIds.byteLength, _elemIds.byteOffset, enable, _elemScope);
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.setElemsValidState = sharding_createShardingConstuctor(Module.BIM.setElemsValidState, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 设置项目的自动加载/卸载距离阈值
     * @param {String} dataSetId //数据集标识
     * @param {Number} minLoadDist //项目模型的最小加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
     * @param {Number} maxLoadDist //项目模型的最大加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
     */
    Module.BIM.setAutoLoadDist = function (dataSetId, minLoadDist, maxLoadDist) {
        let _minLoadDist = isEmpty(minLoadDist) ? 1e30 : minLoadDist;
        let _maxLoadDist = isEmpty(maxLoadDist) ? 1e30 : maxLoadDist;
        if (minLoadDist == 0) _minLoadDist = 1e30;
        if (maxLoadDist == 0) _maxLoadDist = 1e30;
        var _distinfo = [_minLoadDist, _maxLoadDist];
        Module.RealBIMWeb.SetMainSceAutoLoadDist(dataSetId, _distinfo);
    };

    /**
     * 获取单项目的最大/最小加载距离阈值
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getAutoLoadDist = function (dataSetId) {
        return Module.RealBIMWeb.GetMainSceAutoLoadDist(dataSetId);
    };

    /**
     * 设置复杂模型内子元素的深度偏移
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Number} depthBias //深度偏移值,范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.BIM.setElemDepthBias = function (dataSetId, elemIdList, depthBias, elemScope) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;
        var _elemScope = 0;
        if (!isEmpty(elemScope)) {
            _elemScope = elemScope;
        }

        if (dataSetId == '') {
            Module.RealBIMWeb.SetHugeObjSubElemDepthBias('', '', 0xffffffff, 0, depthBias, _elemScope);
        } else {
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemDepthBias(dataSetId, '', 0xffffffff, 0, depthBias, _elemScope);
            } else {
                var _moemory = (_count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory);
                var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (var i = 0; i < _count; ++i) {
                    _elemIds.set([elemIdList[i], _projid], i * 2);
                }
                Module.RealBIMWeb.SetHugeObjSubElemDepthBias(dataSetId, '', _elemIds.byteLength, _elemIds.byteOffset, depthBias, _elemScope);
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.setElemDepthBias = sharding_createShardingConstuctor(Module.BIM.setElemDepthBias, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 设置模型场景节点的仿射变换信息
     * @param {String} dataSetId //数据集标识
     * @param {dvec3} scale //模型的缩放系数，默认为[1,1,1]，xyz轴的缩放系数需保持一致
     * @param {dvec4} rotate //模型的旋转系数，四元数，默认为[0,0,0,1]
     * @param {dvec3} offset //模型的平移系数，默认为[0,0,0]
     */
    Module.BIM.setElemTransform = function (dataSetId, scale, rotate, offset) {
        return Module.RealBIMWeb.SetHugeObjTransform(dataSetId, '', scale, rotate, offset);
    };

    /**
     * 获取模型场景节点的仿射变换信息
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     */
    Module.BIM.getElemTransform = function (dataSetId) {
        var _COMMON_LOC = Module.RealBIMWeb.GetHugeObjTransform(dataSetId, '');
        let transFormInfo = {
            scale: _COMMON_LOC.m_vScale,
            rotate: _COMMON_LOC.m_qRotate,
            offset: _COMMON_LOC.m_vOffset,
        };
        return transFormInfo;
    };

    /**
     * 刷新数据集模型
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} loadNewData //表示刷新主体数据后是否允许重新加载数据
     */
    Module.BIM.refreshDataSet = function (dataSetId, loadNewData) {
        Module.RealBIMWeb.RefreshHugeObjMainData(dataSetId, '', loadNewData);
    };

    /**
     * 设置模型边缘高光属性
     * @param {String} dataSetId //数据集标识
     * @param {Number} amp //表示边缘发光强度，范围（0~1），建议设为0.1~0.3左右即可
     * @param {Number} range //表示边缘区域范围，（0~n），建议设为0.5~1左右即可
     */
    Module.BIM.setBorderEmis = function (dataSetId, amp, range) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        var emis = [amp, range];
        return Module.RealBIMWeb.SetHugeObjBorderEmis(dataSetId, '', emis);
    };

    /**
     * 获取模型边缘高光属性
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getBorderEmis = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.GetHugeObjBorderEmis(dataSetId, '');
    };

    /**
     * 设置模型的最大光泽度
     * @param {String} dataSetId //数据集标识
     * @param {Number} smooth //最大光泽度 取值范围[0,1]
     */
    Module.BIM.setMaxSmooth = function (dataSetId, smooth) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.SetHugeObjMaxSmooth(dataSetId, '', smooth);
    };

    /**
     * 获取模型的最大光泽度
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getMaxSmooth = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.GetHugeObjMaxSmooth(dataSetId, '');
    };

    /**
     * 设置模型边界线是否启用法线光照的明暗效果
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {Boolean} enable //是否允许
     */
    Module.BIM.setBorderLineNorLight = function (dataSetId, enable) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.SetHugeObjBorderLineNor(dataSetId, '', enable);
    };

    /**
     * 获取模型边界线是否启用法线光照的明暗效果
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     */
    Module.BIM.getBorderLineNorLight = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.GetHugeObjBorderLineNor(dataSetId, '');
    };

    class REElemUVAnim {
        constructor() {
            this.dataSetId = null; //数据集标识，为空串则表示处理所有数据集
            this.elemIdList = null; //构件id集合,为空数组则表示处理所有构件
            this.scale = null; //UV缩放比例
            this.speed = null; //UV移动速度
        }
    }
    ExtModule.REElemUVAnim = REElemUVAnim;

    /**
     * 设置模型内构件的UV动画属性
     * @param {REElemUVAnim} elemUVAnim //构件UV动画信息
     */
    Module.BIM.setElemUVAnimAttr = function (elemUVAnim) {
        if (isEmptyLog(elemUVAnim, 'elemUVAnim')) return;

        var _elemScope = isEmpty(elemUVAnim.elemScope) ? 0 : elemUVAnim.elemScope;
        var _scale = isEmpty(elemUVAnim.scale) ? [1.0, 1.0] : elemUVAnim.scale;
        var _speed = isEmpty(elemUVAnim.speed) ? [0.0, 0.0] : elemUVAnim.speed;
        var _lpUVAnimAttr = [_scale[0], _scale[1], -1.0 * _speed[0], -1.0 * _speed[1]];

        if (elemUVAnim.dataSetId == '') {
            //多数据集设置
            Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr('', '', 0xffffffff, 0, _lpUVAnimAttr, _elemScope);
        } else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(elemUVAnim.dataSetId);
            var _count = elemUVAnim.elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr(elemUVAnim.dataSetId, '', 0xffffffff, 0, _lpUVAnimAttr, _elemScope);
            } else {
                var _moemory = (_count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < _count; ++i) {
                    _elemIds.set([elemUVAnim.elemIdList[i], _projid], i * 2);
                }
                Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr(
                    elemUVAnim.dataSetId,
                    '',
                    _elemIds.byteLength,
                    _elemIds.byteOffset,
                    _lpUVAnimAttr,
                    _elemScope
                );
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.setElemUVAnimAttr = sharding_createShardingConstuctor(Module.BIM.setElemUVAnimAttr, {
            idPath: 'elemIdList',
            argIndex: 'elemUVAnim',
        });
    }

    /**
     * 设置构件UV的显示和隐藏
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Boolean} visible //显示类型
     */
    Module.BIM.setElemUVVisible = function (dataSetId, elemIdList, visible, elemScope) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;

        var _elemScope = isEmpty(elemScope) ? 0 : elemScope;
        var _scale = visible ? [1.0, 1.0] : [0, 0];
        var _speed = [0.0, 0.0];
        var _lpUVAnimAttr = [_scale[0], _scale[1], _speed[0], _speed[1]];

        if (dataSetId == '') {
            //多数据集设置
            Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr('', '', 0xffffffff, 0, _lpUVAnimAttr, _elemScope);
        } else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr(dataSetId, '', 0xffffffff, 0, _lpUVAnimAttr, _elemScope);
            } else {
                var _moemory = (_count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < _count; ++i) {
                    _elemIds.set([elemIdList[i], _projid], i * 2);
                }
                Module.RealBIMWeb.SetHugeObjSubElemUVAnimAttr(dataSetId, '', _elemIds.byteLength, _elemIds.byteOffset, _lpUVAnimAttr, _elemScope);
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.setElemUVVisible = sharding_createShardingConstuctor(Module.BIM.setElemUVVisible, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 设置模型的漫反射调节系数
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {dvec3} diffCoef //漫反射调节系数，【red通道，green通道，blue通道】，默认1.0，值越大越亮，值越小越暗
     */
    Module.BIM.setDiffCoef = function (dataSetId, diffCoef) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        let _diffCoef = isEmpty(diffCoef) ? [1.0, 1.0, 1.0] : diffCoef;
        return Module.RealBIMWeb.SetHugeObjDiffCoef(dataSetId, '', _diffCoef);
    };

    // MARK 骨骼动画

    class REGolBoneLocInfo {
        constructor() {
            this.boneId = null; //表示骨骼全局ID
            this.interval = null; //表示骨骼从当前方位过渡到目标方位所需的时长
            this.procBatch = null; //表示骨骼的方位过渡批次
            this.sendPostEvent = null; //表示骨骼方位过渡完毕后是否发送事件消息
            this.destLoc = null; //表示骨骼的目标方位 (REBoneLoc 类型)
        }
    }
    ExtModule.REGolBoneLocInfo = REGolBoneLocInfo;

    class REBoneLoc {
        constructor() {
            this.autoScale = null; //表示元素的自动缩放系数
            this.localScale = null; //表示元素在以自身中心点为原点的局部世界空间中的缩放分量
            this.localRotate = null; //表示元素在以自身中心点为原点的局部世界空间中的旋转分量(欧拉角：绕X/Y/Z轴的旋转角度-360.0*k~360.0*j)
            this.centerVirOrig = null; //表示元素中心点的缩放/旋转/平移变换所在的虚拟坐标系坐标原点的世界空间位置
            this.centerVirScale = null; //表示元素中心点在虚拟坐标系下的缩放分量
            this.centerVirRotate = null; //表示元素中心点在虚拟坐标系下的旋转分量(欧拉角：绕X/Y/Z轴的旋转角度-360.0*k~360.0*j)
            this.centerVirOffset = null; //表示元素中心点在虚拟坐标系下的平移分量
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
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;
        if (isEmptyLog(boneId, 'boneId')) return;
        var _elemScope = 0;
        if (!isEmpty(elemScope)) {
            _elemScope = elemScope;
        }

        if (dataSetId == '') {
            Module.RealBIMWeb.SetHugeObjSubElemBoneIDs('', '', 0xffffffff, 0, boneId, _elemScope); //绑定全部构件
        } else {
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(dataSetId, '', 0xffffffff, 0, boneId, _elemScope); //绑定全部构件
            } else {
                var _temparr = [];
                for (var i = 0; i < _count; ++i) {
                    _temparr.push(elemIdList[i]);
                    _temparr.push(_projid);
                }
                var _selids = new Uint32Array(_temparr);
                Module.RealBIMWeb.ReAllocHeapViews(_selids.byteLength.toString()); //分配空间
                var _tempids = Module.RealBIMWeb.GetHeapView_U32(0);
                _tempids.set(_selids, 0);
                Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(dataSetId, '', _tempids.byteLength, _tempids.byteOffset, boneId, _elemScope);
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.BIM.setElemToBone = sharding_createShardingConstuctor(Module.BIM.setElemToBone, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 获取系统中的全局元素骨骼总数
     */
    Module.BIM.getGolElemBoneNum = function () {
        return Module.RealBIMWeb.GetGolElemBoneNum();
    };

    /**
     * 设置全局元素骨骼的目标方位
     * @param {REGolBoneLocInfo} boneLocInfo //骨骼方位信息
     */
    Module.BIM.setGolElemBoneDestLoc = function (boneLocInfo) {
        if (isEmptyLog(boneLocInfo, 'boneLocInfo')) return;
        if (isEmptyLog(boneLocInfo.destLoc, 'destLoc')) return;
        var _destLoc = {
            m_vAutoScale: boneLocInfo.destLoc.autoScale,
            m_vLocalScale: boneLocInfo.destLoc.localScale,
            m_vLocalRotate: boneLocInfo.destLoc.localRotate,
            m_vCenterVirOrig: boneLocInfo.destLoc.centerVirOrig,
            m_vCenterVirScale: boneLocInfo.destLoc.centerVirScale,
            m_vCenterVirRotate: boneLocInfo.destLoc.centerVirRotate,
            m_vCenterVirOffset: boneLocInfo.destLoc.centerVirOffset,
        };
        return Module.RealBIMWeb.SetGolElemBoneDestLocExt(
            boneLocInfo.boneId,
            _destLoc,
            boneLocInfo.interval,
            boneLocInfo.procBatch,
            boneLocInfo.sendPostEvent
        );
    };

    /**
     * 重置所有全局元素骨骼为默认方位
     */
    Module.BIM.resetAllGolElemBoneDestLoc = function () {
        Module.RealBIMWeb.ResetAllGolElemBones();
    };

    // MARK 轮廓线

    /**
     * 设置模型轮廓线
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {REColor} lineClr //模型边界线颜色（REColor 类型）(Alpha==-1表示禁用边界线；Alpha为[0,255]表示边界线颜色的权重系数)
     */
    Module.BIM.setContourLineClr = function (dataSetId, lineClr) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(lineClr, 'lineClr')) return;
        var tempclr = [lineClr.red / 255, lineClr.green / 255, lineClr.blue / 255, lineClr.alpha < 0 ? -1 : lineClr.alpha / 255];
        return Module.RealBIMWeb.SetHugeObjBorderLineClr(dataSetId, '', tempclr);
    };

    /**
     * 获取模型边界线颜色混合信息
     * @param {String} dataSetId //数据集标识
     */
    Module.BIM.getContourLineClr = function (dataSetId) {
        var _tempclr = Module.RealBIMWeb.GetHugeObjBorderLineClr(dataSetId, '');
        var lineClr = new REColor();
        lineClr.red = _tempclr[0] * 255;
        lineClr.green = _tempclr[1] * 255;
        lineClr.blue = _tempclr[2] * 255;
        lineClr.alpha = _tempclr[3] < 0 ? -1 : _tempclr[3] * 255;
        return lineClr;
    };

    /**
     * 设置世界空间下的全局裁剪面的裁剪边界处的颜色信息
     * @param {REColor} lineClr //轮廓线颜色（REColor 类型）
     */
    Module.BIM.setClipPlanesContourLineClr = function (lineClr) {
        if (isEmptyLog(lineClr, 'lineClr')) return;
        var _tempclr = [lineClr.red / 255, lineClr.green / 255, lineClr.blue / 255, lineClr.alpha / 255];
        Module.RealBIMWeb.SetGolClipPlanesBorderClrBlendInfo(_tempclr);
    };

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
    };

    // MOD-- CAD（CAD） <---
    Module.CAD = typeof Module.CAD !== 'undefined' ? Module.CAD : {}; //增加 CAD 模块

    // MARK 加载

    /**
     * 加载CAD文件
     * @param {String} filePath //图纸的资源发布路径
     * @param {RECadUnitEm} unit //图纸的单位 (RECadUnitEm 类型)
     * @param {Number} scale //图纸的比例尺信息
     */
    Module.CAD.loadCAD = function (filePath, unit, scale) {
        if (isEmptyLog(filePath, 'filePath')) return;
        var _unit = isEmpty(unit) ? eval(RECadUnitEm.CAD_UNIT_Meter) : unit == '' ? eval(RECadUnitEm.CAD_UNIT_Meter) : eval(unit);
        var _scale = 1.0;
        if (!isEmpty(scale)) _scale = scale;
        Module.RealBIMWeb.LoadCAD(filePath, _unit, _scale);
    };

    /**
     * 卸载所有CAD文件
     */
    Module.CAD.unloadCAD = function () {
        Module.RealBIMWeb.UnLoadCAD();
    };

    // /**
    //  * 加载一个cad矢量资源
    //  * @param {Boolean} clearLoaded //是否清除掉已经加载好的项目 默认为false
    //  * @param {object} dataSetCadShp //数据  Object 类型   ↓ ↓ ↓ ↓ 以下参数均包含在 Object 中↓
    //  * @param {String} dataSetId //数据集的唯一标识名，不能为空不可重复，重复前边的数据集会被自动覆盖
    //  * @param {String} resourcesAddress //数据集资源包地址
    //  * @param {Boolean} useTransInfo //表示该项目是否需要调整位置，默认false
    //  * @param {Array} transInfo //项目的偏移信息，依次为缩放、旋转（四元数）、平移
    //  * @param {Number} minLoadDist //项目模型的最小加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载
    //  * @param {Number} maxLoadDist //项目模型的最大加载距离，>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示永不卸载；
    //  * @param {String} dataSetCRS //当前子项的坐标系标识
    //  * @param {Number} dataSetCRSNorth //当前子项的项目北与正北方向的夹角（右手坐标系，逆时针为正）dataSetCRS 为空时此参数无定意义
    //  * @param {Boolean} useAssginVer  //表示是否加载指定版本，默认 false
    //  * @param {String} assginVer //指定版本号，加载指定版本的时候，会用此版本号
    //  * @param {Boolean} useAssginVer2  //表示是否加载指定版本2，默认 false
    //  * @param {String} assginVer2 //指定版本号2，加载指定版本的时候，会用此版本号
    //  * @param {Number} dividePrior //项目内模型的细分优先级(值越小优先级越高)
    //  * @param {dvec3} engineOrigin //表示项目局部空间的原点在项目参考坐标系dataSetCRS下的坐标（dataSetCRS为空时无定义）
    //  * @param {Boolean} preciseCRS //表示在进行地理信息坐标系定位时是否采用精确计算模式
    //  * @param {Boolean} terrImgShpAlone //表示项目中的地形矢量是否需要独立镂空显示(将禁用影像图片显示)
    //  * @param {String} terrSuffix //表示项目中的地形系统标识后缀，同样投影参数/概览信息/标识后缀的地形数据将合并为一个地形系统进行显示
    //  * @param {Boolean} terrSph //表示项目中的地形系统数据是否允许适配到球面地形
    //  */
    // Module.CAD.loadCadShp = function (dataSetCadShp, clearLoaded) {
    //     if (isEmpty(dataSetCadShp.dataSetId)) {
    //         console.error('【REError】: dataSetId 唯一标识名，不能为空不可重复');
    //         return;
    //     }

    //     var _deftransinfo = [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]]; if (dataSetCadShp.useTransInfo) _deftransinfo = dataSetCadShp.transInfo;
    //     var _useCamPost = false;
    //     var _minLoadDist = 1e30; if (!isEmpty(dataSetCadShp.minLoadDist)) _minLoadDist = dataSetCadShp.minLoadDist;
    //     var _maxLoadDist = 1e30; if (!isEmpty(dataSetCadShp.maxLoadDist)) _maxLoadDist = dataSetCadShp.maxLoadDist;
    //     var _projCRS = ""; if (!isEmpty(dataSetCadShp.dataSetCRS)) _projCRS = dataSetCadShp.dataSetCRS;
    //     var _projNorth = 0.0; if (!isEmpty(dataSetCadShp.dataSetCRSNorth)) _projNorth = dataSetCadShp.dataSetCRSNorth;
    //     var _defMainProjCamFile = "";
    //     var _dividePrior = isEmpty(dataSetCadShp.dividePrior) ? 1.0 : dataSetCadShp.dividePrior;
    //     var _originCRS = isEmpty(dataSetCadShp.engineOrigin) ? [0.0, 0.0, 0.0] : dataSetCadShp.engineOrigin;
    //     var _preciseCRS = isEmpty(dataSetCadShp.preciseCRS) ? true : dataSetCadShp.preciseCRS;
    //     var _terrImgShpAlone = isEmpty(dataSetCadShp.terrImgShpAlone) ? true : dataSetCadShp.terrImgShpAlone;
    //     var _terrSuffix = isEmpty(dataSetCadShp.terrSuffix) ? "CADSHP" : dataSetCadShp.terrSuffix;
    //     var _terrSph = isEmpty(dataSetCadShp.terrSph) ? false : dataSetCadShp.terrSph;
    //     var _isMainProj = (((typeof clearLoaded == 'undefined') || clearLoaded) ? true : false);
    //     var intprojid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetCadShp.dataSetId);
    //     var _ver = {
    //         m_sVer0: -1,
    //         m_sVer1: -1,
    //         m_uVer0GolIDBias_L32: 0,
    //         m_uVer0GolIDBias_H32: 0,
    //         m_uVer1GolIDBias_L32: 0,
    //         m_uVer1GolIDBias_H32: 0
    //     };
    //     if (dataSetCadShp.useAssginVer) {
    //         _ver.m_sVer0 = dataSetCadShp.assginVer; _ver.m_uVer0GolIDBias_H32 = intprojid;
    //     }
    //     if (dataSetCadShp.useAssginVer2) {
    //         _ver.m_sVer1 = dataSetCadShp.assginVer2; _ver.m_uVer1GolIDBias_H32 = intprojid;
    //     }
    //     if (!dataSetCadShp.useAssginVer && !dataSetCadShp.useAssginVer2) {
    //         // 没有使用版本默认第一个版本为最新
    //         _ver.m_sVer0 = 0x7fffffff;
    //     }

    //     Module.RealBIMWeb.LoadMainSceExt(
    //         dataSetCadShp.dataSetId,
    //         _isMainProj,
    //         _projCRS, _projNorth,
    //         dataSetCadShp.resourcesAddress + "/total.xml",
    //         _deftransinfo[0], _deftransinfo[1], _deftransinfo[2],
    //         _minLoadDist, _maxLoadDist,
    //         "",
    //         _defMainProjCamFile, _useCamPost,
    //         _dividePrior, _originCRS,
    //         _preciseCRS, _terrImgShpAlone,
    //         _terrSuffix, _terrSph
    //     );
    //     Module.RealBIMWeb.SetSceVersionInfoExt(dataSetCadShp.dataSetId, _ver);
    // }

    /**
     * 添加颜色填充元素
     * @param {String} fillElemId //填充元素标识
     * @param {Array} pointList //多边形点集合（至少三个点构成面）
     * @param {REColor} fillClr //填充颜色（REColor 类型）
     */
    Module.CAD.addFillElem = function (fillElemId, pointList, fillClr) {
        if (isEmptyLog(fillElemId, 'fillElemId')) return;
        if (isEmptyLog(pointList, 'pointList')) return;

        var _vector_Points = new Module.RE_Vector_dvec2();
        for (let i = 0; i < pointList.length; i++) {
            _vector_Points.push_back(pointList[i]);
        }

        var _fillClr = isEmpty(fillClr) ? 0xff0000ff : clrToU32(fillClr);
        Module.RealBIMWeb.AddCADColorHatch(fillElemId, _vector_Points, _fillClr);
    };

    /**
     * 删除颜色填充元素
     * @param {String} fillElemId //填充元素标识
     */
    Module.CAD.delFillElem = function (fillElemId) {
        if (isEmptyLog(fillElemId, 'fillElemId')) return;
        Module.RealBIMWeb.DeleteCADColorHatchById(fillElemId);
    };

    class RECADAttr {
        constructor() {
            this.tag = ''; //表示属性名称
            this.value = ''; //表示属性值
        }
    }
    ExtModule.RECADAttr = RECADAttr;

    /**
     * 获取cad属性
     * @param {String} elemId //元素标识
     */
    Module.CAD.getElemAttrs = function (elemId) {
        if (isEmptyLog(elemId, 'elemId')) return;
        let arrAttris = Module.RealBIMWeb.GetCADAttributesByHandle(elemId);
        let _attrList = [];
        for (let i = 0; i < arrAttris.size(); i++) {
            const element = arrAttris.get(i);
            let _attr = new RECADAttr();
            _attr.tag = element.m_strTag;
            _attr.value = element.m_strValue;
            _attrList.push(_attr);
        }
        return _attrList;
    };

    /**
     * 根据cad属性查询cad图元标识
     * @param {RECADAttr} attr //属性
     */
    Module.CAD.getAttrElemIds = function (attr) {
        if (isEmptyLog(attr, 'attr')) return;
        let _cad_attrs = {
            m_strTag: attr.tag,
            m_strValue: attr.value,
        };

        let arrElemIds = Module.RealBIMWeb.GetCADHandlesByAttribute(_cad_attrs);
        let _elemIds = [];
        for (let i = 0; i < arrElemIds.size(); i++) {
            _elemIds.push(arrElemIds.get(i));
        }
        return _elemIds;
    };

    class RECADLayer {
        constructor() {
            this.layerName = null; //表示图层名称
            this.color = null; //表示图层颜色
            this.layerId = null; //图层标识
            this.layerHide = false; //表示图层是否隐藏
        }
    }
    ExtModule.RECADLayer = RECADLayer;

    /**
     * 获取cad当前所有图层信息
     */
    Module.CAD.getCurAllLayer = function () {
        let _vector_layer = Module.RealBIMWeb.GetCADAllLayer();
        let _layerList = [];
        for (let i = 0; i < _vector_layer.size(); i++) {
            const element = _vector_layer.get(i);
            let _layer = new RECADLayer();
            _layer.layerName = element.m_strLayerName;
            _layer.color = clrU32ToClr(element.m_uColor);
            _layer.layerId = element.m_strHandle;
            _layer.layerHide = element.m_bHide;
            _layerList.push(_layer);
        }
        return _layerList;
    };

    /**
     * 设置显示隐藏图层
     * @param {String} layerId //图层标识
     * @param {Boolean} visible //显示隐藏 true：显示 false：隐藏
     */
    Module.CAD.setLayerVisible = function (layerId, visible) {
        if (isEmptyLog(layerId, 'layerId')) return;
        if (visible) {
            Module.RealBIMWeb.CADShowLayer(layerId);
        } else {
            Module.RealBIMWeb.CADHideLayer(layerId);
        }
    };

    /**
     * 设置cad背景颜色
     * @param {REColor} color //颜色（REColor 类型）
     */
    Module.CAD.setBgClr = function (color) {
        Module.RealBIMWeb.CADSetBakClr([color.red / 255.0, color.green / 255.0, color.blue / 255.0]);
    };

    class RECADTextInfo {
        constructor() {
            this.elemId = null; //二维图元的id
            this.text = null; //文字信息
        }
    }
    ExtModule.RECADTextInfo = RECADTextInfo;

    /**
     * 通过文字进行构件检索
     * @param {String} searchText //搜索文字
     */
    Module.CAD.getElemsSearchText = function (searchText) {
        if (isEmpty(searchText) || searchText == '') {
            logParErr('searchText');
            return;
        }
        var _arrIds = new Module.RE_Vector_WStr();
        var _arrTextInfos = new Module.RE_Vector_WStr();
        Module.RealBIMWeb.CADSearchText(searchText, _arrIds, _arrTextInfos);
        let search_arr = [];
        for (let i = 0; i < _arrIds.size(); i++) {
            let textInfo = new RECADTextInfo();
            textInfo.elemId = _arrIds.get(i);
            textInfo.text = _arrTextInfos.get(i);
            search_arr.push(textInfo);
        }
        return search_arr;
    };

    /**
     * 获取cad资源指定布局的lod范围 注：可以从 CAD.getAllLayoutId 获取所有的布局标识
     * @param {String} layoutId //布局标识
     */
    Module.CAD.getLayoutLodRange = function (layoutId) {
        const _layoutId = isEmpty(layoutId) ? 'Model' : layoutId;
        return Module.RealBIMWeb.GetCADLayoutLodRange(_layoutId);
    };

    /**
     * 设置当前加载布局显示限制的lod范围 注：需要在 CAD.getLayoutLodRange 获取的范围内设置
     * @param {uvec2} range //级别范围，二元素数组 [最小级别,最大级别]
     */
    Module.CAD.setCurShowLodRange = function (range) {
        const _range = isEmpty(range) ? [0, 0] : range;
        Module.RealBIMWeb.SetCADCustomLodRange(_range);
    };

    /**
     * 获取当前加载布局显示限制的lod范围
     */
    Module.CAD.getCurShowLodRange = function () {
        return Module.RealBIMWeb.GetCADCustomLodRange();
    };

    // MARK 相机
    /**
     * 调整相机定位到一个二维图元
     * @param {String} elemId //二维图元的id
     * @param {Number} scale //表示相机聚焦后的视口缩放比例，默认为1.0，该值越大，相机距离图元越远
     */
    Module.CAD.setCamLocateToElem = function (elemId, scale) {
        Module.RealBIMWeb.FocusToCADElem(elemId, scale);
    };

    /**
     * 相机定位所有元素到当前屏幕
     */
    Module.CAD.setCamLocateToAllElem = function () {
        Module.RealBIMWeb.FocusToAllCADElem();
    };

    /**
     * 设置CAD矢量锚点的相机缩放边界值
     * @param {String} groupId //锚点组ID
     * @param {Number} minScale //缩放最小边界（像素）
     * @param {Number} maxScale //缩放最大边界（像素）
     */
    Module.CAD.setGroupShpAncScale = function (groupId, minScale, maxScale) {
        Module.RealBIMWeb.SetCADShpAnchorScale(groupId, minScale, maxScale);
    };

    /**
     * 获取当前视口范围（最大值最小值）dMinX,dMinY 视口左下角坐标，dMaxX,dMaxY：视口右上角坐标
     */
    Module.CAD.getCurViewportRange = function () {
        let _vector_range = Module.RealBIMWeb.GetCADCurViewport();
        let _currLayoutId = Module.RealBIMWeb.CADGetCurLayout();
        let range_obj = {};
        if (_vector_range.size()) {
            let _vMin = _vector_range.get(0);
            let _vMax = _vector_range.get(1);
            range_obj = {
                minPot: _vMin,
                maxPot: _vMax,
                currLayoutId: _currLayoutId,
            };
        }
        return range_obj;
    };

    /**
     * 获取图纸默认视口（最大值最小值）dMinX,dMinY 视口左下角坐标，dMaxX,dMaxY：视口右上角坐标
     */
    Module.CAD.getDefaultViewportRange = function () {
        let _vector_range = Module.RealBIMWeb.GetCADDefaultViewport();
        let range_obj = {};
        if (_vector_range.size()) {
            let _vMin = _vector_range.get(0);
            let _vMax = _vector_range.get(1);
            range_obj = {
                minPot: _vMin,
                maxPot: _vMax,
                currLayoutId: 'Model',
            };
        }
        return range_obj;
    };

    /**
     * 设置当前视口范围及相机定位
     * @param {Array} minPot //视口左下角坐标
     * @param {Array} maxPot //视口右上角坐标
     * @param {String} layoutId //布局标识
     */
    Module.CAD.setCurViewportRange = function (minPot, maxPot, layoutId) {
        let _layoutId = isEmpty(layoutId) ? 'Model' : layoutId;
        Module.RealBIMWeb.FocusToViewport(_layoutId, minPot, maxPot);
    };

    /**
     * 调整相机定位到一个区域标注
     * @param {String} areaCommentId //区域标注标识(字符串，唯一标识)
     * @param {Number} scale //表示相机聚焦后的视口缩放比例，默认为1.0，该值越大，相机距离图元越远
     */
    Module.CAD.setCamLocateToAreaComment = function (areaCommentId, scale) {
        if (isEmptyLog(areaCommentId, 'areaCommentId')) return;
        Module.RealBIMWeb.CADFocusToCustomComment(areaCommentId, scale);
    };

    // MARK 属性信息
    /**
     * 获取cad图元包围盒
     * @param {String} elemId //二维图元的id
     * @returns [vMin,vMax]
     */
    Module.CAD.getElemBV = function (elemId) {
        const cInfo = Module.RealBIMWeb.GetCadElemBox(elemId);
        return [cInfo.m_vDvec2Value1, cInfo.m_vDvec2Value2];
    };

    /**
     * 设置Bim-Cad对齐映射点
     * @param {Array} bimPointList //Bim顶点集合（三元素数组集合），需要三个点坐标构面
     * @param {Array} cadPointList //Cad顶点集合（二元素数组集合），需要三个点坐标构面
     */
    Module.CAD.setBimCadMapPoints = function (bimPointList, cadPointList) {
        if (!checkArrCountLog(bimPointList, 'bimPointList', 3)) return false;
        if (!checkArrCountLog(cadPointList, 'cadPointList', 3)) return false;

        var _vector_Points_bim = new Module.RE_Vector_dvec3();
        var _vector_Points_cad = new Module.RE_Vector_dvec3();

        for (let i = 0; i < bimPointList.length; i++) {
            _vector_Points_bim.push_back(bimPointList[i]);
        }

        for (let i = 0; i < cadPointList.length; i++) {
            if (cadPointList[i].length == 2) {
                cadPointList[i] = [cadPointList[i][0], cadPointList[i][1], 0]; // 补无效z值
            }
            _vector_Points_cad.push_back(cadPointList[i]);
        }

        Module.RealBIMWeb.SetBimCadMapPoints(_vector_Points_bim, _vector_Points_cad);
    };

    /**
     * 获取Bim映射Cad的相机朝向 注：需要先调用接口 setBimCadMapPoints 设置映射关系
     */
    Module.CAD.getBimToCadCamDir = function () {
        return Module.RealBIMWeb.GetBimToCadCamDir();
    };

    /**
     * 获取Bim顶点映射Cad点 注：需要先调用接口 setBimCadMapPoints 设置映射关系
     * @param {dvec3} bimPoint //Bim顶点（三元素数组）
     */
    Module.CAD.getBimToCadPoint = function (bimPoint) {
        if (!checkArrCountLog(bimPoint, 'bimPoint', 3)) return [0, 0];
        const cadPoint = Module.RealBIMWeb.BimToCad(bimPoint);
        return [cadPoint[0], cadPoint[1]];
    };

    /**
     * Cad顶点映射Bim点 注：需要先调用接口 setBimCadMapPoints 设置映射关系
     * @param {dvec3} cadPoint //Cad顶点（二元素数组）
     */
    Module.CAD.getCadToBimPoint = function (cadPoint) {
        if (!checkArrCountLog(cadPoint, 'cadPoint', 2)) return [0, 0, 0];
        const _cadPoint = [cadPoint[0], cadPoint[1], 0];
        const bimPoint = Module.RealBIMWeb.CadToBim(_cadPoint);
        return bimPoint;
    };

    /**
     * Cad包围盒信息映射Bim包围盒 注：需要先调用接口 setBimCadMapPoints 设置映射关系
     * @param {Array} cadBV //cad对应的包围盒信息 [[minx, miny], [maxx, maxy]]
     */
    Module.CAD.getCadToBimBV = function (cadBV) {
        if (!checkArrCountLog(cadBV, 'cadBV', 2)) return [];

        const vMin_cad = cadBV[0];
        const vMax_cad = cadBV[1];
        if (!checkArrCountLog(vMin_cad, 'cadBV', 2)) return [];
        if (!checkArrCountLog(vMax_cad, 'cadBV', 2)) return [];

        const vMin_bim = Module.CAD.getCadToBimPoint(vMin_cad);
        const vMax_bim = Module.CAD.getCadToBimPoint(vMax_cad);

        const [x1, y1, z1] = vMin_bim;
        const [x2, y2, z2] = vMax_bim;
        const vMin = [Math.min(x1, x2), Math.min(y1, y2), Math.min(z1, z2)];
        const vMax = [Math.max(x1, x2), Math.max(y1, y2), Math.max(z1, z2)];
        return [vMin, vMax];
    };

    /**
     * Bim包围盒信息映射Cad包围盒 注：需要先调用接口 setBimCadMapPoints 设置映射关系
     * @param {Array} bimBV //bim对应的包围盒信息 [[minx, miny, minz], [maxx, maxy, maxz]]
     */
    Module.CAD.getBimToCadBV = function (bimBV) {
        if (!checkArrCountLog(bimBV, 'bimBV', 2)) return [];

        const vMin_bim = bimBV[0];
        const vMax_bim = bimBV[1];
        if (!checkArrCountLog(vMin_bim, 'bimBV', 3)) return [];
        if (!checkArrCountLog(vMax_bim, 'bimBV', 3)) return [];

        const vMin_cad = Module.CAD.getBimToCadPoint(vMin_bim);
        const vMax_cad = Module.CAD.getBimToCadPoint(vMax_bim);

        const [x1, y1] = vMin_cad;
        const [x2, y2] = vMax_cad;
        const vMin = [Math.min(x1, x2), Math.min(y1, y2)];
        const vMax = [Math.max(x1, x2), Math.max(y1, y2)];
        return [vMin, vMax];
    };

    // MARK 选择集
    /**
     * 选中一个二维图元
     * @param {String} elemId //二维图元的id
     */
    Module.CAD.selElem = function (elemId) {
        Module.RealBIMWeb.SelCADElem(elemId);
    };

    // MARK 锚点
    class RECADAnc {
        constructor() {
            this.anchorId = null; //	锚点的名称(字符串，唯一标识)
            this.layoutId = 'Model'; // 布局标识(字符串，唯一标识)
            this.pos = [0.0, 0.0]; //	锚点的位置，默认值[0, 0]
            this.style = 0; //	锚点的样式，目前CAD锚点仅支持4种默认样式，分别以数字0~3表示
            this.innerClr = new REColor(255, 255, 255, 255); //	内部元素颜色
            this.extClr = new REColor(255, 255, 255, 255); //	外部部元素颜色
        }
    }
    ExtModule.RECADAnc = RECADAnc;

    class RECADShpAnc {
        constructor() {
            this.anchorId = null; //	锚点的名称(字符串，唯一标识)
            this.layoutId = 'Model'; // 布局标识(字符串，唯一标识)
            this.pos = null; //	锚点的位置，默认值 [0,0,0]
            this.shpPath = null; //	表示使用的矢量文件路径
            this.groupId = null; //	表示锚点所属的组名称ID
            this.text = null; //	表示锚点的文字内容
            this.textClr = null; //	表示锚点文字的颜色
            this.textSize = null; //	文字的高度
            this.textAlign = null; //	表示锚点文字相对矢量图标的对齐方式（九宫格：以图片为中心[0,0]）
        }
    }
    ExtModule.RECADShpAnc = RECADShpAnc;

    /**
     * 添加锚点
     * @param {RECADAnc} ancList //锚点信息集合（RECADAnc类型）
     */
    Module.CAD.addAnc = function (ancList) {
        if (isEmptyLog(ancList, 'ancList')) return;
        var tempAnchors = new Module.RE_Vector_CAD_ANCHOR();
        for (let i = 0; i < ancList.length; ++i) {
            var _ancInfo = ancList[i];
            let _id = '';
            if (!isEmpty(_ancInfo.anchorId)) _id = _ancInfo.anchorId;
            let _layoutId = 'Model';
            if (!isEmpty(_ancInfo.layoutId)) _layoutId = _ancInfo.layoutId;
            let _pos = [0.0, 0.0];
            if (!isEmpty(_ancInfo.pos)) _pos = _ancInfo.pos;
            let _innerClr = 0xffffffff;
            if (!isEmpty(_ancInfo.innerClr)) _innerClr = clrToU32(_ancInfo.innerClr);
            let _extClr = 0xff00ff00;
            if (!isEmpty(_ancInfo.extClr)) _extClr = clrToU32(_ancInfo.extClr);
            let _style = 0;
            if (!isEmpty(_ancInfo.style)) _style = _ancInfo.style;

            var tempobj = {
                m_strID: _id,
                m_strLayoutName: _layoutId,
                m_vPos: _pos,
                m_uClr1: _extClr,
                m_uClr2: _innerClr,
                m_uStyleID: _style,
            };
            tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddCADAnchors(tempAnchors);
    };

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
        cadAnc.layoutId = _ancData.m_strLayoutName;
        cadAnc.pos = _ancData.m_vPos;
        cadAnc.style = _ancData.m_uStyleID;
        return cadAnc;
    };

    /**
     * 获取当前添加的锚点总数
     */
    Module.CAD.getAncNum = function () {
        return Module.RealBIMWeb.GetCADAnchorNum();
    };

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
            cadAnc.layoutId = tempobj.m_strLayoutName;
            cadAnc.pos = tempobj.m_vPos;
            cadAnc.style = tempobj.m_uStyleID;
            arrAncData.push(cadAnc);
        }
        return arrAncData;
    };

    /**
     * 删除锚点
     * @param {Array} anchorIdList //锚点id集合
     */
    Module.CAD.delAnc = function (anchorIdList) {
        var tempAnchors = new Module.RE_Vector_WStr();
        for (let i = 0; i < anchorIdList.length; ++i) {
            tempAnchors.push_back(anchorIdList[i]);
        }
        return Module.RealBIMWeb.DelCADAnchors(tempAnchors);
    };

    /**
     * 删除所有锚点
     */
    Module.CAD.delAllAnc = function () {
        Module.RealBIMWeb.DelAllCADAnchors();
    };

    /**
     * 添加一系列CAD矢量锚点
     * @param {RECADShpAnc} shpAncList //矢量锚点信息集合（RECADShpAnc类型）
     */
    Module.CAD.addShpAnc = function (shpAncList) {
        if (isEmptyLog(shpAncList, 'shpAncList')) return;

        var tempAnchors = new Module.RE_Vector_CAD_SHP_ANCHOR();
        for (let i = 0; i < shpAncList.length; ++i) {
            let shpAnc = shpAncList[i];

            var _id = '';
            if (!isEmpty(shpAnc.anchorId)) _id = shpAnc.anchorId;
            let _layoutId = 'Model';
            if (!isEmpty(shpAnc.layoutId)) _layoutId = shpAnc.layoutId;
            var _pos = [0.0, 0.0];
            if (!isEmpty(shpAnc.pos)) _pos = shpAnc.pos;
            var _picPath = '';
            if (!isEmpty(shpAnc.shpPath)) _picPath = shpAnc.shpPath;
            var _groupName = '';
            if (!isEmpty(shpAnc.groupId)) _groupName = shpAnc.groupId;
            var _strText = '';
            if (!isEmpty(shpAnc.text)) _strText = shpAnc.text;
            var _textClr = 0xffffffff;
            if (!isEmpty(shpAnc.textClr)) _textClr = clrToU32(shpAnc.textClr);
            var _textSize = 16;
            if (!isEmpty(shpAnc.textSize)) _textSize = shpAnc.textSize;
            var _textBias = [0, 0];
            if (!isEmpty(shpAnc.textAlign)) _textBias = shpAnc.textAlign;

            var tempobj = {
                m_strID: _id,
                m_strLayoutName: _layoutId,
                m_vPos: _pos,
                m_strShpPath: _picPath,
                m_strGroupID: _groupName,
                m_strText: _strText,
                m_uTextClr: _textClr,
                m_dTextSize: _textSize,
                m_vTextAlign: _textBias,
            };
            tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddCADShpAnchors(tempAnchors);
    };

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
        shpAnc.layoutId = _ancData.m_strLayoutName;
        shpAnc.textAlign = _ancData.m_vTextAlign;
        return shpAnc;
    };

    /**
     * 获取当前添加的矢量锚点总数
     */
    Module.CAD.getShpAncNum = function () {
        return Module.RealBIMWeb.GetCADShpAnchorNum();
    };

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
            shpAnc.layoutId = tempobj.m_strLayoutName;
            shpAnc.textAlign = tempobj.m_vTextAlign;
            arrAncData.push(shpAnc);
        }
        return arrAncData;
    };

    /**
     * 删除矢量锚点
     * @param {Array} anchorIdList //锚点id集合
     */
    Module.CAD.delShpAnc = function (anchorIdList) {
        var tempAnchors = new Module.RE_Vector_WStr();
        for (let i = 0; i < anchorIdList.length; ++i) {
            tempAnchors.push_back(anchorIdList[i]);
        }
        return Module.RealBIMWeb.DelCADShpAnchors(tempAnchors);
    };

    /**
     * 删除系统所有的CAD矢量锚点
     */
    Module.CAD.delAllShpAnc = function () {
        Module.RealBIMWeb.DelAllCADShpAnchors();
    };

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
    };

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
            shpAnc.layoutId = tempobj.m_strLayoutName;
            shpAnc.textAlign = tempobj.m_vTextAlign;
            arrAncData.push(shpAnc);
        }
        return arrAncData;
    };

    /**
     * 根据组名删除一系列矢量锚点
     * @param {String} groupId //锚点组ID
     */
    Module.CAD.delGroupShpAnc = function (groupId) {
        Module.RealBIMWeb.DelGroupCADShpAnchors(groupId);
    };

    // MARK 标注
    /**
     * 开启标注绘制（初始默认-箭头）
     */
    Module.CAD.startCommentDraw = function () {
        Module.RealBIMWeb.StartCADCommentDraw();
    };

    /**
     * 结束标注绘制
     */
    Module.CAD.endCommentDraw = function () {
        Module.RealBIMWeb.EndCADCommentDraw();
    };

    /**
     * 保存当前绘制标注
     */
    Module.CAD.saveCurCommentDraw = function () {
        Module.RealBIMWeb.CADSaveCurCommentDraw();
    };

    /**
     * 取消当前绘制标注
     */
    Module.CAD.cancelCurCommentDraw = function () {
        Module.RealBIMWeb.CADCancekCurCommentDraw();
    };

    /**
     * 设置当前标注绘制样式
     * @param {Number} style //样式类型 0：箭头 1：云线框 2：矩形 3：椭圆 4：文字
     */
    Module.CAD.setDrawingCommentStyle = function (style) {
        let _uCommentStyle = isEmpty(style) ? 0 : style;
        switch (style) {
            case 2:
                _uCommentStyle = 4;
                break;
            case 3:
                _uCommentStyle = 5;
                break;
            case 4:
                _uCommentStyle = 7;
                break;
            default:
                break;
        }
        Module.RealBIMWeb.SetCADCurDrawingCommentStyle(_uCommentStyle);
    };

    /**
     * 设置文字标注内容
     * @param {String} text //文字内容 (换行请用\n表示)
     */
    Module.CAD.setTextCommentText = function (text) {
        let _text = isEmpty(text) ? '' : text;
        Module.RealBIMWeb.SetCADCurTextCommentText(_text);
    };

    /**
     * 设置标注线宽
     * @param {Number} width //线宽
     */
    Module.CAD.setCommentLineWidth = function (width) {
        let _width = isEmpty(width) ? 1.0 : width;
        Module.RealBIMWeb.SetCADCommentLinewidth(_width);
    };

    /**
     * 设置标注颜色
     * @param {REColor} color //颜色（REColor 类型）
     */
    Module.CAD.setCommentColor = function (color) {
        let _color_u32 = clrToU32_WBGR(color);
        Module.RealBIMWeb.SetCADCommentColor(_color_u32);
    };

    /**
     * 设置标注文字尺寸
     * @param {Number} size //尺寸
     */
    Module.CAD.setCommentTextSize = function (size) {
        let _size = isEmpty(size) ? 1.0 : size;
        Module.RealBIMWeb.SetCADCommentTextSize(_size);
    };

    class RECADAreaComment {
        constructor() {
            this.areaCommentId = null; //区域标注标识(字符串，唯一标识)
            this.pointList = null; //	二维顶点列表, 最少三个点，自动闭合
            this.lineWith = 0; //线宽, 0 :默认线宽
            this.lineClr = new REColor(255, 255, 255, 255); //	线条颜色
            this.needFill = false; //	是否需要填充
            this.fillClr = new REColor(255, 255, 255, 255); //	填充颜色，needFill=true 有效
        }
    }
    ExtModule.RECADAreaComment = RECADAreaComment;

    /**
     * 添加区域标注
     * @param {RECADAreaComment} areaComentInfo //区域标注对象，（RECADAreaComment 类型）
     */
    Module.CAD.addAreaComment = function (areaComentInfo) {
        if (isEmptyLog(areaComentInfo.areaCommentId, 'areaCommentId')) return;
        if (!checkTypeLog(areaComentInfo.pointList, 'pointList', RE_Enum.RE_Check_Array)) return;

        if (areaComentInfo.pointList.length < 3) {
            logErr('pointList 点集合, 最少大于等于3个数据');
            return;
        }
        var _vector_CADPoints = new Module.RE_Vector_dvec2();
        for (let i = 0; i < areaComentInfo.pointList.length; i++) {
            let point = areaComentInfo.pointList[i];
            if (!checkArrCountLog(point, 'pointList', 2)) return {};
            _vector_CADPoints.push_back(point);
        }
        let _lineWith = isEmpty(areaComentInfo.lineWith) ? 0 : areaComentInfo.lineWith;
        let _lineClr = isEmpty(areaComentInfo.lineClr) ? 0xff0000ff : clrToU32(areaComentInfo.lineClr);
        let _needFill = isEmpty(areaComentInfo.needFill) ? fasle : areaComentInfo.needFill;
        let _fillClr = isEmpty(areaComentInfo.lineWith) ? 0xff0000ff : clrToU32(areaComentInfo.fillClr);

        Module.RealBIMWeb.CADAddCustomComment(areaComentInfo.areaCommentId, _vector_CADPoints, _lineWith, _lineClr, _needFill, _fillClr);
    };

    /**
     * 删除区域标注
     * @param {String} areaCommentId //区域标注标识(字符串，唯一标识)
     */
    Module.CAD.delAreaComment = function (areaCommentId) {
        if (isEmptyLog(areaCommentId, 'areaCommentId')) return;
        Module.RealBIMWeb.CADDeleteCustomCommentById(areaCommentId);
    };

    // MARK 测量
    /**
     * 开启测量绘制
     */
    Module.CAD.startMeasurementDraw = function () {
        Module.RealBIMWeb.StartCADMeasurementDraw();
    };

    /**
     * 结束测量绘制
     */
    Module.CAD.endMeasurementDraw = function () {
        Module.RealBIMWeb.EndCADMeasurementDraw();
    };

    /**
     * 保存当前测量绘制
     */
    Module.CAD.saveCurMeasurementDraw = function () {
        Module.RealBIMWeb.CADSaveCurMeasurementDraw();
    };

    /**
     * 取消当前测量绘制
     */
    Module.CAD.cancelCurMeasurementDraw = function () {
        Module.RealBIMWeb.CADCancelCurMeasurementDraw();
    };

    /**
     * 删除所有测量
     */
    Module.CAD.delAllMeasurementDraw = function () {
        Module.RealBIMWeb.CADDeleteAllMeasurement();
    };

    /**
     * 设置测量样式
     * @param {Number} style //类型 0：单次长度测量 1：连续长度测量
     */
    Module.CAD.setMeasurementStyle = function (style) {
        let _style = isEmpty(style) ? 0 : style;
        Module.RealBIMWeb.SetCADMeasurementStyle(_style);
    };

    /**
     * 获取长度测量信息
     * @param {String} measureId //测量标识 通过绘制测量完成监听事件事件获取(RECADMeasurementDrawFinish) 只能返回单次测量，连续测量不支持返回
     */
    Module.CAD.getLengthMeasurementInfo = function (measureId) {
        if (isEmptyLog(measureId, 'measureId')) return;
        let _info = Module.RealBIMWeb.CADGetLengthMeasurementInfo(measureId);
        let info_obj = {
            totalLength: _info[2], //总长度
            differX: _info[0], //x轴差值
            differY: _info[1], //y轴差值
        };
        return info_obj;
    };

    // MARK 布局

    /**
     * 获取所有布局标识
     */
    Module.CAD.getAllLayoutId = function () {
        var tempArr = Module.RealBIMWeb.CADGetAllLayout();
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 获取当前显示布局标识
     */
    Module.CAD.getCurLayoutId = function () {
        return Module.RealBIMWeb.CADGetCurLayout();
    };

    /**
     * 获取默认布局标识
     */
    Module.CAD.getDefaultLayoutId = function () {
        return Module.RealBIMWeb.CADGetActiveLayout();
    };

    /**
     * 切换当前显示布局
     * @param {String} layoutId //布局标识
     */
    Module.CAD.setCurShowLayout = function (layoutId) {
        let _layoutId = isEmpty(layoutId) ? 'Model' : layoutId;
        Module.RealBIMWeb.CADSwitchLayout(_layoutId);
    };

    // MOD-- 栅格（Grid） <---
    Module.Grid = typeof Module.Grid !== 'undefined' ? Module.Grid : {}; //增加 Grid 模块

    // MARK 渲染设置

    /**
     * 设置某一块或全部的栅格模型的透明度
     * @param {String} dataSetId //数据集标识
     * @param {Number} alpha //透明度
     */
    Module.Grid.setDataSetAlpha = function (dataSetId, alpha) {
        if (!isEmpty(dataSetId) && dataSetId.length > 0) {
            if (Module.Terrain.getDataSetTerrId(dataSetId).length > 0) {
                logWarn('新版本转换工具处理数据无法使用该接口，请使用（Terrain.setUnitActive）接口处理！');
                return;
            }
        }
        var _info = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(dataSetId, '');
        if (_info.m_uDestAlpha == 0 && _info.m_uDestAlphaAmp == 0 && _info.m_uDestRGBBlendInfo == 0) {
            Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(dataSetId, '', {
                m_uUseNewRGB: 255,
                m_uUseNewAlpha: 255,
                m_uDestAlpha: alpha,
                m_uDestAlphaAmp: 255,
                m_uDestRGBBlendInfo: 0x00000000,
            });
        } else {
            Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(dataSetId, '', {
                m_uUseNewRGB: 255,
                m_uUseNewAlpha: 255,
                m_uDestAlpha: alpha,
                m_uDestAlphaAmp: 255,
                m_uDestRGBBlendInfo: _info.m_uDestRGBBlendInfo,
            });
        }
    };

    /**
     * 获取当前设置的某一块或全部的栅格模型的透明度
     * @param {String} dataSetId //数据集标识
     */
    Module.Grid.getDataSetAlpha = function (dataSetId) {
        var cClrInfo = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(dataSetId, '');
        if (cClrInfo.m_uDestAlpha == 0 && cClrInfo.m_uDestAlphaAmp == 0) {
            return 255;
        }
        return cClrInfo.m_uDestAlpha;
    };

    /**
     * 设置地形场景节点的深度偏移
     * @param {String} dataSetId //数据集标识
     * @param {Number} depthBias //深度偏移范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
     */
    Module.Grid.setDataSetDepthBias = function (dataSetId, depthBias) {
        Module.RealBIMWeb.SetUnVerHugeGroupDepthBias(dataSetId, '', depthBias);
    };

    /**
     * 刷新数据集栅格模型
     * @param {String} dataSetId //数据集标识
     * @param {Boolean} loadNewData //表示刷新后是否重新加载数据
     */
    Module.Grid.refreshDataSet = function (dataSetId, loadNewData) {
        Module.RealBIMWeb.RefreshUnVerHugeGroupMainData(dataSetId, '', loadNewData);
    };

    /**
     * 设置某一块或全部的栅格模型的颜色
     * @param {String} dataSetId //数据集标识
     * @param {REColor} clr //新的颜色信息
     */
    Module.Grid.setDataSetClr = function (dataSetId, clr) {
        var _clr = clrToU32_WBGR(clr);
        var _info = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(dataSetId, '');
        if (_info.m_uDestAlpha == 0 && _info.m_uDestAlphaAmp == 0 && _info.m_uDestRGBBlendInfo == 0) {
            Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(dataSetId, '', {
                m_uUseNewRGB: 255,
                m_uUseNewAlpha: 255,
                m_uDestAlpha: 255,
                m_uDestAlphaAmp: 255,
                m_uDestRGBBlendInfo: _clr,
            });
        } else {
            Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(dataSetId, '', {
                m_uUseNewRGB: 255,
                m_uUseNewAlpha: 255,
                m_uDestAlpha: _info.m_uDestAlpha,
                m_uDestAlphaAmp: 255,
                m_uDestRGBBlendInfo: _clr,
            });
        }
    };

    /**
     * 重置某一块或全部的栅格模型的颜色
     * @param {String} dataSetId //数据集标识
     */
    Module.Grid.resetDataSetClr = function (dataSetId) {
        var _dataSetId = '';
        if (!isEmpty(dataSetId)) _dataSetId = dataSetId;
        Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(_dataSetId, '', {
            m_uUseNewRGB: 255,
            m_uUseNewAlpha: 255,
            m_uDestAlpha: 0,
            m_uDestAlphaAmp: 0,
            m_uDestRGBBlendInfo: 0,
        });
    };

    /**
     * 设置栅格模型的仿射变换信息
     * @param {String} dataSetId //数据集标识
     * @param {dvec3} scale //缩放
     * @param {dvec4} rotate //旋转
     * @param {dvec3} offset //平移
     */
    Module.Grid.setDataSetTrans = function (dataSetId, scale, rotate, offset) {
        Module.RealBIMWeb.SetUnVerHugeGroupTransform(dataSetId, '', scale, rotate, offset);
    };

    /**
     * 获取栅格模型的仿射变换信息
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     */
    Module.Grid.getDataSetTrans = function (dataSetId) {
        var _COMMON_LOC = Module.RealBIMWeb.GetUnVerHugeGroupTransform(dataSetId, '');
        let transFormInfo = {
            scale: _COMMON_LOC.m_vScale,
            rotate: _COMMON_LOC.m_qRotate,
            offset: _COMMON_LOC.m_vOffset,
        };
        return transFormInfo;
    };

    /**
     * 根据数据集id获取总包围盒信息
     * @param {String} dataSetId //数据集标识
     */
    Module.Grid.getDataSetBV = function (dataSetId) {
        var tempbv = Module.RealBIMWeb.GetUnVerHugeGroupBoundingBox(dataSetId, '');
        var aabbarr = [];
        aabbarr.push(tempbv[0][0]);
        aabbarr.push(tempbv[1][0]); //Xmin、Xmax
        aabbarr.push(tempbv[0][1]);
        aabbarr.push(tempbv[1][1]); //Ymin、Ymax
        aabbarr.push(tempbv[0][2]);
        aabbarr.push(tempbv[1][2]); //Zmin、Zmax
        return aabbarr;
    };

    /**
     * 将栅格投影到指定高度
     * @param {String} dataSetId //数据集标识
     * @param {Number} type //表示投影类型
     * @param {Number} height //type==0：表示地形组禁止投射到固定高度;  type==1：height表示世界空间绝对高度; type==2：height表示当前地形节点自身包围盒的相对高度范围(0~1); type==3：height表示整个场景的地形节点总包围盒的相对高度范围(0~1)
     * @param {Number} amp //表示将地形投射到指定高度的投射强度(0~1)
     */
    Module.Grid.setDataSetToHeight = function (dataSetId, type, height, amp) {
        Module.RealBIMWeb.ProjUnVerHugeGroupToHeight(dataSetId, '', type, height, amp);
    };

    /**
     * 设置栅格的有效性
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {Boolean} enable //是否有效
     */
    Module.Grid.setValidState = function (dataSetId, enable) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (!isEmpty(dataSetId) && dataSetId.length > 0) {
            if (Module.Terrain.getDataSetTerrId(dataSetId).length > 0) {
                logWarn('新版本转换工具处理数据无法使用该接口，请使用（Terrain.setUnitActive）接口处理！');
                return;
            }
        }

        Module.RealBIMWeb.SetUnVerHugeGroupValidStates(dataSetId, '', enable ? 1 : 0);
    };

    /**
     * 获取栅格的有效性
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     */
    Module.Grid.getValidState = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (!isEmpty(dataSetId) && dataSetId.length > 0) {
            if (Module.Terrain.getDataSetTerrId(dataSetId).length > 0) {
                logWarn('新版本转换工具处理数据无法使用该接口，请使用（Terrain.getUnitActive）接口处理！');
                return;
            }
        }

        const uRes = Module.RealBIMWeb.GetUnVerHugeGroupValidStates(dataSetId, '');
        return uRes > 0 ? true : false;
    };

    /**
     * 设置栅格的裙带强度
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {Boolean} amp //表示将地形裙带强度(0~1)
     */
    Module.Grid.setTerrSkirtAmp = function (dataSetId, amp) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        let _amp = isEmpty(amp) ? 1 : amp;
        Module.RealBIMWeb.SetTerrSkirtAmp(dataSetId, _amp);
    };

    /**
     * 获取栅格的裙带强度
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     */
    Module.Grid.getTerrSkirtAmp = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.GetTerrSkirtAmp(dataSetId);
    };

    /**
     * 设置模型的漫反射调节系数
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有数据集
     * @param {dvec3} diffCoef //漫反射调节系数，【red通道，green通道，blue通道】，默认1.0，值越大越亮，值越小越暗
     */
    Module.Grid.setDiffCoef = function (dataSetId, diffCoef) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        let _diffCoef = isEmpty(diffCoef) ? [1.0, 1.0, 1.0] : diffCoef;
        return Module.RealBIMWeb.SetUnVerHugeGroupDiffCoef(dataSetId, '', _diffCoef);
    };

    // MARK 剖切

    /**
     * 设置地形模型是否可剖切
     * @param {Boolean} enable //是否允许
     */
    Module.Grid.setClipEnable = function (enable) {
        return Module.RealBIMWeb.SetUnVerInstsClippable(enable);
    };

    /**
     * 获取非版本管理模型的可剖切性
     */
    Module.Grid.getClipEnable = function () {
        return Module.RealBIMWeb.GetUnVerInstsClippable();
    };

    // MOD-- 地形（Terrain） <---
    Module.Terrain = typeof Module.Terrain !== 'undefined' ? Module.Terrain : {}; //增加 Terrain 模块

    // MARK 渲染设置
    /**
     * 获取项目内地形数据层单元是否需要独立镂空显示(将禁用影像图片显示)
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Terrain.getUnitImgShpAlone = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.GetTerrUnitImgShpAlone(dataSetId);
    };

    /**
     * 设置地形数据层单元的层级别
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {Number} layerLev //层级别（默认为1，作用于遮挡关系，建议级别不要过多，级别越多消耗资源越大）
     */
    Module.Terrain.setUnitLayerlev = function (dataSetId, unitId, resType, layerLev) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        let _layerLev = isEmpty(layerLev) ? 1 : layerLev;
        if (_layerLev < 1) {
            logParErr('layerLev');
            return;
        }
        return Module.RealBIMWeb.SetTerrUnitLayerID(dataSetId, unitId, _resType, _layerLev);
    };

    /**
     * 获取地形数据层单元的层级别
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} unitId //层单元标识（必填）
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitLayerlev = function (dataSetId, unitId, resType) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(unitId) || unitId == '') {
            logParErr('unitId');
            return;
        }
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        return Module.RealBIMWeb.GetTerrUnitLayerID(dataSetId, unitId, _resType);
    };

    /**
     * 设置地形数据层单元的激活状态
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {Boolean} active //是否激活
     */
    Module.Terrain.setUnitActive = function (dataSetId, unitId, resType, active) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        let _active = isEmpty(active) ? ture : active;
        return Module.RealBIMWeb.SetTerrUnitActive(dataSetId, unitId, _resType, _active);
    };

    /**
     * 获取地形数据层单元的激活状态
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} unitId //层单元标识（必填）
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitActive = function (dataSetId, unitId, resType) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(unitId) || unitId == '') {
            logParErr('unitId');
            return;
        }
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        return Module.RealBIMWeb.GetTerrUnitActive(dataSetId, unitId, _resType);
    };

    /**
     * 设置地形数据层单元的矢量样式标识名
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {String} shpStyleName //矢量样式标识名
     */
    Module.Terrain.setUnitShpStyleName = function (dataSetId, unitId, resType, shpStyleName) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        let _shpStyleName = isEmpty(shpStyleName) ? '' : shpStyleName;
        return Module.RealBIMWeb.SetTerrUnitShpStyleName(dataSetId, unitId, _resType, _shpStyleName);
    };

    /**
     * 获取地形数据层单元的矢量样式标识名
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} unitId //层单元标识（必填）
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitShpStyleName = function (dataSetId, unitId, resType) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(unitId) || unitId == '') {
            logParErr('unitId');
            return;
        }
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        return Module.RealBIMWeb.GetTerrUnitShpStyleName(dataSetId, unitId, _resType);
    };

    /**
     * 设置地形数据层单元的父级资源是否忽略重用
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {Boolean} omitParent //忽略父级重用
     */
    Module.Terrain.setUnitOmitParent = function (dataSetId, unitId, resType, omitParent) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        let _omitParent = isEmpty(omitParent) ? false : omitParent;
        return Module.RealBIMWeb.SetTerrUnitOmitParent(dataSetId, unitId, _resType, _omitParent);
    };

    /**
     * 获取地形数据层单元的父级资源是否忽略重用
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} unitId //层单元标识（必填）
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitOmitParent = function (dataSetId, unitId, resType) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(unitId) || unitId == '') {
            logParErr('unitId');
            return;
        }
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        return Module.RealBIMWeb.GetTerrUnitOmitParent(dataSetId, unitId, _resType);
    };

    /**
     * 设置地形数据层单元的矢量是否用于生成影像图片的孔洞
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {Boolean} enable //是否作用
     */
    Module.Terrain.setUnitShpHole = function (dataSetId, unitId, resType, enable) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        let _enable = isEmpty(enable) ? false : enable;
        return Module.RealBIMWeb.SetTerrUnitShpHole(dataSetId, unitId, _resType, _enable);
    };

    /**
     * 获取地形数据层单元的矢量是否用于生成影像图片的孔洞
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} unitId //层单元标识（必填）
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitShpHole = function (dataSetId, unitId, resType) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(unitId) || unitId == '') {
            logParErr('unitId');
            return;
        }
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        return Module.RealBIMWeb.GetTerrUnitShpHole(dataSetId, unitId, _resType);
    };

    /**
     * 设置地形数据层单元的显示范围
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {ivec2} range //级别范围，二维数组 [最小级别,最大级别]
     */
    Module.Terrain.setUnitLODLevRange = function (dataSetId, unitId, resType, range) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        let _range = isEmpty(range) ? [0, 21] : range;
        return Module.RealBIMWeb.SetTerrUnitLodRange(dataSetId, unitId, _resType, _range);
    };

    /**
     * 获取地形数据层单元的显示范围
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} unitId //层单元标识（必填）
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitLODLevRange = function (dataSetId, unitId, resType) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(unitId) || unitId == '') {
            logParErr('unitId');
            return;
        }
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        return Module.RealBIMWeb.GetTerrUnitLodRange(dataSetId, unitId, _resType);
    };

    /**
     * 设置地形数据层单元的透明度
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {Number} alpha //目标透明度，整型，范围0~255，0表示全透
     */
    Module.Terrain.setUnitLayerAlpha = function (dataSetId, unitId, resType, alpha) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        const terrId = Module.Terrain.getDataSetTerrId(dataSetId);
        const terrSub = Module.Terrain.getTerrSubAllDataSetId(terrId);
        if (terrSub.length == 1) {
            let cClrInfo = {
                m_uUseNewAlpha: 1,
                m_uUseNewRGB: 0,
                m_uDestAlpha: alpha,
                m_uDestAlphaAmp: 255,
                m_uDestRGBBlendInfo: 0,
            };
            Module.RealBIMWeb.SetTerrInstClrInfo(terrId, cClrInfo);
            return true;
        } else {
            let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
            let _alpha = isEmpty(alpha) ? 255 : alpha / 255;
            return Module.RealBIMWeb.SetTerrUnitFadeCoef(dataSetId, unitId, _resType, _alpha);
        }
    };

    /**
     * 获取地形数据层单元的透明度
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitLayerAlpha = function (dataSetId, unitId, resType) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        const terrId = Module.Terrain.getDataSetTerrId(dataSetId);
        const terrSub = Module.Terrain.getTerrSubAllDataSetId(terrId);
        if (terrSub.length == 1) {
            const cClrInfo = Module.RealBIMWeb.GetTerrInstClrInfo(terrId);
            return cClrInfo.m_uDestAlpha;
        } else {
            let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
            let _fadeCoef = Module.RealBIMWeb.GetTerrUnitFadeCoef(dataSetId, unitId, _resType);
            return _fadeCoef * 255;
        }
    };

    /**
     * 设置地形数据层单元的混合颜色
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {REColor} color //目标颜色（REColor 类型）
     */
    Module.Terrain.setUnitLayerClr = function (dataSetId, unitId, resType, color) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        let _clr = isEmpty(color) ? [0, 0, 0, 0] : clrToRGBA_List(color);
        return Module.RealBIMWeb.SetTerrUnitClrBlend(dataSetId, unitId, _resType, _clr);
    };

    /**
     * 获取地形数据层单元的混合颜色
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitLayerClr = function (dataSetId, unitId, resType) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        const _clr = Module.RealBIMWeb.GetTerrUnitClrBlend(dataSetId, unitId, _resType);
        return clrRGBAListToClr(_clr);
    };

    /**
     * 设置地形实例的透明度
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {Number} alpha //目标透明度，整型，范围0~255，0表示全透
     */
    Module.Terrain.setTerrInstAlpha = function (dataSetId, alpha) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return false;
        const terrId = Module.Terrain.getDataSetTerrId(dataSetId);
        if (!terrId.length) return false;
        let cClrInfo = {
            m_uUseNewAlpha: 1,
            m_uUseNewRGB: 0,
            m_uDestAlpha: alpha,
            m_uDestAlphaAmp: 255,
            m_uDestRGBBlendInfo: 0,
        };
        Module.RealBIMWeb.SetTerrInstClrInfo(terrId, cClrInfo);
        return true;
    };

    /**
     * 获取地形实例的透明度
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Terrain.getTerrInstAlpha = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        const terrId = Module.Terrain.getDataSetTerrId(dataSetId);
        if (!terrId.length) return;
        const cClrInfo = Module.RealBIMWeb.GetTerrInstClrInfo(terrId);
        if (cClrInfo.m_uDestAlpha == 0 && cClrInfo.m_uDestAlphaAmp == 0) {
            return 255;
        }
        return cClrInfo.m_uDestAlpha;
    };

    /**
     * 设置地形是否允许投射到其他模型对象表面
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {Number} mode //表示地形影像投射到其他模型对象表面的模式（默认2） 0: 不投射 1: 仅投射影像图片层 2: 仅投射影像矢量层 3: 同时投射影像图片和矢量层
     */
    Module.Terrain.setTerrProjectMode = function (dataSetId, mode) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        let _mode = isEmpty(mode) ? 0 : mode;
        Module.RealBIMWeb.SetTerrProjectMode(dataSetId, _mode);
    };

    /**
     * 获取地形是否允许投射到其他模型对象表面
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Terrain.getTerrProjectMode = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.GetTerrProjectMode(dataSetId);
    };

    /**
     * 设置地形数据层单元的虚拟像素不自动变化的最小缩放高度
     * @param {String} dataSetId //数据集的唯一标识名
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {Number} minVirPxlH //最小缩放高度
     */
    Module.Terrain.setUnitMinVirPxlH = function (dataSetId, unitId, resType, minVirPxlH) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        let _minVirPxlH = isEmpty(minVirPxlH) ? -1 : minVirPxlH;
        return Module.RealBIMWeb.SetTerrUnitMinVirPxlH(dataSetId, unitId, _resType, _minVirPxlH);
    };

    /**
     * 获取地形数据层单元的虚拟像素不自动变化的最小缩放高度
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} unitId //层单元标识（必填）
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     */
    Module.Terrain.getUnitMinVirPxlH = function (dataSetId, unitId, resType) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(unitId) || unitId == '') {
            logParErr('unitId');
            return;
        }
        let _resType = isEmpty(resType) ? Module.RE_TERR_RES_TYPE.ALL : eval(resType);
        return Module.RealBIMWeb.GetTerrUnitMinVirPxlH(dataSetId, unitId, _resType);
    };

    // MARK 加载属性
    /**
     * 获取数据集所有的地形数据层单元名称
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Terrain.getAllUnitNames = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        var tempArr = Module.RealBIMWeb.GetAllTerrUnitNames(dataSetId);
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 获取地形数据层单元的包围盒
     * @param {String} dataSetId //数据集标识
     * @param {String} unitId //层单元标识
     * @param {RETerrResEm} resType //地形资源数据类型 （RETerrResEm 类型）
     * @param {Boolean} activeOnly //是否仅处理已激活的地形数据层单元
     */
    Module.Terrain.getUnitBV = function (dataSetId, unitId, resType, activeOnly) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(unitId, 'unitId')) return;
        let _resType = isEmpty(resType) ? eval(Module.RE_TERR_RES_TYPE.ALL) : eval(resType);
        let _activeOnly = isEmpty(activeOnly) ? false : activeOnly;
        var _tempbv = Module.RealBIMWeb.GetTerrUnitBoundingBox(dataSetId, unitId, _resType, _activeOnly);
        var aabbList = [];
        aabbList.push(_tempbv[0][0]);
        aabbList.push(_tempbv[1][0]); //Xmin、Xmax
        aabbList.push(_tempbv[0][1]);
        aabbList.push(_tempbv[1][1]); //Ymin、Ymax
        aabbList.push(_tempbv[0][2]);
        aabbList.push(_tempbv[1][2]); //Zmin、Zmax
        return aabbList;
    };

    /**
     * 获取所有的地形矢量样式标识名
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Terrain.getAllShpStyleNames = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        var tempArr = Module.RealBIMWeb.GetAllTerrShpStyleNames(dataSetId);
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    class RETerrShpStyleInfo {
        constructor() {
            this.quadStyleList = []; //广告板样式序列 （RETerrShpQuadStyle 类型）
            this.textStyleList = []; //文本样式序列 （RETerrShpTextStyle 类型）
            this.lineStyleList = []; //线条样式序列 （RETerrShpLineStyle 类型）
            this.faceStyleList = []; //三角面样式序列 （RETerrShpFaceStyle 类型）
        }
    }
    ExtModule.RETerrShpStyleInfo = RETerrShpStyleInfo;

    class RETerrShpQuadStyle {
        constructor() {
            this.matchAttrName = ''; //表示样式要匹配的矢量原数据的属性字段名
            this.matchAttrVal = '*'; //表示样式要匹配的矢量原数据的属性值名(支持通配符)
            this.texPath = null; //表示纹理资源的路径，若为空则为全白纹理
            this.dispRect = [-8.0, -8.0, 8.0, 8.0]; //表示广告板在定位点(0,0)处的显示区域[左下x，左下y，右上x，右上y](单位为一个虚拟像素)
            this.texRect = [0.0, 0.0, 0.0, 0.0]; //表示广告板关联的纹理关联的纹理子区域上的相对UV[左下x，左下y，右上x，右上y](单位为一个虚拟像素)
            this.quadClr = null; //表示广告板颜色 （REColor 类型）不建议设置混合颜色不易掌控，建议获取值再返回
        }
    }
    ExtModule.RETerrShpQuadStyle = RETerrShpQuadStyle;

    class RETerrShpTextStyle {
        constructor() {
            this.matchAttrName = ''; //表示样式要匹配的矢量原数据的属性字段名
            this.matchAttrVal = '*'; //表示样式要匹配的矢量原数据的属性值名(支持通配符)
            this.weight = false; //表示文字是否采用粗体显示
            this.italic = false; //表示文字是否采用斜体显示
            this.textClr = null; //表示文本颜色 （REColor 类型）
            this.textBorderClr = null; //表示文本的轮廓颜色 （REColor 类型）
            this.dispRect = [-8.0, -8.0, 8.0, 8.0]; //表示文字在定位点(0,0)处的显示区域[左下x，左下y，右上x，右上y](单位为一个虚拟像素)
            this.fmtFlag = RETextFmtEm.MM; //文字在显示区域内的对齐方式 （RETextFmtEm 类型）
            this.charW = 16.0; //表示单个字符的宽(单位为一个虚拟像素)
            this.charH = 16.0; //表示单个字符的高(单位为一个虚拟像素)
        }
    }
    ExtModule.RETerrShpTextStyle = RETerrShpTextStyle;

    class RETerrShpLineStyle {
        constructor() {
            this.matchAttrName = ''; //表示样式要匹配的矢量原数据的属性字段名
            this.matchAttrVal = '*'; //表示样式要匹配的矢量原数据的属性值名(支持通配符)
            this.texPath = null; //表示纹理资源的路径，若为空则为全白纹理
            this.segLen = 32.0; //表示纹理的区间分段（进行纹理拼接限制长度）
            this.width = 4.0; //表示线条的宽度
            this.lineClr = null; //表示线条的统一颜色 （REColor 类型）
        }
    }
    ExtModule.RETerrShpLineStyle = RETerrShpLineStyle;

    class RETerrShpFaceStyle {
        constructor() {
            this.matchAttrName = ''; //表示样式要匹配的矢量原数据的属性字段名
            this.matchAttrVal = '*'; //表示样式要匹配的矢量原数据的属性值名(支持通配符)
            this.faceClr = null; //表示面的颜色 （REColor 类型）
        }
    }
    ExtModule.RETerrShpFaceStyle = RETerrShpFaceStyle;

    /**
     * 设置一个地形矢量样式（样式相同则覆盖，样式不同则新增）
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} shpStyleId //矢量样式的标识名（必填）
     * @param {RETerrShpStyleInfo} shpStyleInfo //矢量样式信息 （RETerrShpStyleInfo 类型）
     */
    Module.Terrain.setShpStyle = function (dataSetId, shpStyleId, shpStyleInfo) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(shpStyleId) || shpStyleId == '') {
            logParErr('shpStyleId');
            return;
        }
        if (isEmptyLog(shpStyleInfo, 'shpStyleInfo')) return;

        let _quadStyleList = new Module.RE_Vector_SHPSRC_STYLE_QUAD();
        let _textStyleList = new Module.RE_Vector_SHPSRC_STYLE_TEXT();
        let _lineStyleList = new Module.RE_Vector_SHPSRC_STYLE_LINE();
        let _faceStyleList = new Module.RE_Vector_SHPSRC_STYLE_FACE();

        // 广告版信息（标签）
        for (let i = 0; i < shpStyleInfo.quadStyleList.length; i++) {
            const element = shpStyleInfo.quadStyleList[i];
            let _tex = {
                m_strTexPath: isEmpty(element.texPath) ? '' : element.texPath,
                m_uMinTexW: 0,
                m_uMaxTexW: 120,
                m_uMinTexH: 0,
                m_uMaxTexH: 120,
                m_uBeginU: 0,
                m_uEndU: 0,
                m_uBeginV: 0,
                m_uEndV: 0,
            };
            let _quadStyle = {
                m_strMatchAttrName: isEmpty(element.matchAttrName) ? '' : element.matchAttrName,
                m_strMatchAttrVal: isEmpty(element.matchAttrVal) ? '*' : element.matchAttrVal,
                m_qDispRect: isEmpty(element.dispRect) ? [-8.0, -8.0, 8.0, 8.0] : element.dispRect,
                m_qTexRect: isEmpty(element.texRect) ? [0, 0, 0, 0] : element.texRect,
                m_uQuadClr: isEmpty(element.quadClr) ? 0xffffffff : clrToU32(element.quadClr),
                m_cTex: _tex,
            };
            _quadStyleList.push_back(_quadStyle);
        }
        // 文本信息
        for (let i = 0; i < shpStyleInfo.textStyleList.length; i++) {
            const element = shpStyleInfo.textStyleList[i];
            let _textStyle = {
                m_strMatchAttrName: isEmpty(element.matchAttrName) ? '' : element.matchAttrName,
                m_strMatchAttrVal: isEmpty(element.matchAttrVal) ? '*' : element.matchAttrVal,
                m_bWeight: isEmpty(element.weight) ? false : element.weight,
                m_bItalic: isEmpty(element.italic) ? false : element.italic,
                m_uTextClr: isEmpty(element.textClr) ? 0xffffffff : clrToU32(element.textClr),
                m_uTextBorderClr: isEmpty(element.textBorderClr) ? 0x00000000 : clrToU32(element.textBorderClr),
                m_qDispRect: isEmpty(element.dispRect) ? [-8.0, -8.0, 8.0, 8.0] : element.dispRect,
                m_uFmtFlag: isEmpty(element.fmtFlag) ? RETextFmtEm.MM : element.fmtFlag,
                m_fCharW: isEmpty(element.charW) ? 16.0 : element.charW,
                m_fCharH: isEmpty(element.charH) ? 16.0 : element.charH,
                m_strGolFontID: 'RealBIMFont001',
            };
            _textStyleList.push_back(_textStyle);
        }
        // 线条信息
        for (let i = 0; i < shpStyleInfo.lineStyleList.length; i++) {
            const element = shpStyleInfo.lineStyleList[i];
            let _tex = {
                m_strTexPath: isEmpty(element.texPath) ? '' : element.texPath,
                m_uMinTexW: 0,
                m_uMaxTexW: 120,
                m_uMinTexH: 0,
                m_uMaxTexH: 120,
                m_uBeginU: 0,
                m_uEndU: 0,
                m_uBeginV: 0,
                m_uEndV: 0,
            };
            let _lineStyle = {
                m_strMatchAttrName: isEmpty(element.matchAttrName) ? '' : element.matchAttrName,
                m_strMatchAttrVal: isEmpty(element.matchAttrVal) ? '*' : element.matchAttrVal,
                m_fSegLen: isEmpty(element.segLen) ? 32.0 : element.segLen,
                m_fWidth: isEmpty(element.width) ? 4.0 : element.width,
                m_uClr: isEmpty(element.lineClr) ? 0xffffffff : clrToU32(element.lineClr),
                m_cTex: _tex,
                m_bPixelLen: true,
            };
            _lineStyleList.push_back(_lineStyle);
        }
        // 三角面信息
        for (let i = 0; i < shpStyleInfo.faceStyleList.length; i++) {
            const element = shpStyleInfo.faceStyleList[i];
            let _tex = {
                m_strTexPath: isEmpty(element.texPath) ? '' : element.texPath,
                m_uMinTexW: 0,
                m_uMaxTexW: 120,
                m_uMinTexH: 0,
                m_uMaxTexH: 120,
                m_uBeginU: 0,
                m_uEndU: 0,
                m_uBeginV: 0,
                m_uEndV: 0,
            };
            let _faceStyle = {
                m_strMatchAttrName: isEmpty(element.matchAttrName) ? '' : element.matchAttrName,
                m_strMatchAttrVal: isEmpty(element.matchAttrVal) ? '*' : element.matchAttrVal,
                m_uClr: isEmpty(element.faceClr) ? 0xffffffff : clrToU32(element.faceClr),
                m_cTex: _tex,
            };
            _faceStyleList.push_back(_faceStyle);
        }
        let _shpStyleInfo = {
            m_arrStyleQuads: _quadStyleList,
            m_arrStyleTexts: _textStyleList,
            m_arrStyleLines: _lineStyleList,
            m_arrStyleFaces: _faceStyleList,
        };
        return Module.RealBIMWeb.AddTerrShpStyle(dataSetId, shpStyleId, _shpStyleInfo);
    };

    /**
     * 获取一个地形矢量样式
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} shpStyleId //矢量样式的标识名（必填）
     */
    Module.Terrain.getShpStyle = function (dataSetId, shpStyleId) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(shpStyleId) || shpStyleId == '') {
            logParErr('shpStyleId');
            return;
        }
        let _shpStyleInfo = Module.RealBIMWeb.GetTerrShpStyle(dataSetId, shpStyleId);

        let shpStyleInfo = new RETerrShpStyleInfo();
        for (let i = 0; i < _shpStyleInfo.m_arrStyleQuads.size(); i++) {
            let element = _shpStyleInfo.m_arrStyleQuads.get(i);
            let _quadStyle = new RETerrShpQuadStyle();
            _quadStyle.matchAttrName = element.m_strMatchAttrName;
            _quadStyle.matchAttrVal = element.m_strMatchAttrVal;
            _quadStyle.dispRect = element.m_qDispRect;
            _quadStyle.texRect = element.m_qTexRect;
            _quadStyle.quadClr = clrU32ToClr(element.m_uQuadClr);
            _quadStyle.texPath = element.m_cTex.m_strTexPath;
            shpStyleInfo.quadStyleList.push(_quadStyle);
        }
        for (let i = 0; i < _shpStyleInfo.m_arrStyleTexts.size(); i++) {
            let element = _shpStyleInfo.m_arrStyleTexts.get(i);
            let _textStyle = new RETerrShpTextStyle();
            _textStyle.matchAttrName = element.m_strMatchAttrName;
            _textStyle.matchAttrVal = element.m_strMatchAttrVal;
            _textStyle.weight = element.m_bWeight;
            _textStyle.italic = element.m_bItalic;
            _textStyle.charH = element.m_fCharH;
            _textStyle.charW = element.m_fCharW;
            _textStyle.dispRect = element.m_qDispRect;
            _textStyle.textClr = clrU32ToClr(element.m_uTextClr);
            _textStyle.textBorderClr = clrU32ToClr(element.m_uTextBorderClr);
            _textStyle.fmtFlag = element.m_uFmtFlag;
            shpStyleInfo.textStyleList.push(_textStyle);
        }
        for (let i = 0; i < _shpStyleInfo.m_arrStyleLines.size(); i++) {
            let element = _shpStyleInfo.m_arrStyleLines.get(i);
            let _lineStyle = new RETerrShpLineStyle();
            _lineStyle.matchAttrName = element.m_strMatchAttrName;
            _lineStyle.matchAttrVal = element.m_strMatchAttrVal;
            _lineStyle.segLen = element.m_fSegLen;
            _lineStyle.width = element.m_fWidth;
            _lineStyle.lineClr = clrU32ToClr(element.m_uClr);
            _lineStyle.texPath = element.m_cTex.m_strTexPath;
            shpStyleInfo.lineStyleList.push(_lineStyle);
        }
        for (let i = 0; i < _shpStyleInfo.m_arrStyleFaces.size(); i++) {
            let element = _shpStyleInfo.m_arrStyleFaces.get(i);
            console.log(' -- _shpStyleInfo.m_arrStyleFaces ---- ', element);
            let _faceStyle = new RETerrShpFaceStyle();
            _faceStyle.matchAttrName = element.m_strMatchAttrName;
            _faceStyle.matchAttrVal = element.m_strMatchAttrVal;
            _faceStyle.faceClr = clrU32ToClr(element.m_uClr);
            shpStyleInfo.faceStyleList.push(_faceStyle);
        }
        return shpStyleInfo;
    };

    /**
     * 删除一个地形矢量样式
     * @param {String} dataSetId //数据集的唯一标识名（必填）
     * @param {String} shpStyleId //矢量样式的标识名（必填）
     */
    Module.Terrain.delShpStyle = function (dataSetId, shpStyleId) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(shpStyleId) || shpStyleId == '') {
            logParErr('shpStyleId');
            return;
        }
        return Module.RealBIMWeb.DelTerrShpStyle(dataSetId, shpStyleId);
    };

    /**
     * 删除所有的地形矢量样式
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Terrain.delAllShpStyle = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.DelAllTerrShpStyles(dataSetId);
    };

    /**
     * 获取数据集所属的全局地形实例标识
     * @param {String} dataSetId //数据集的唯一标识名
     */
    Module.Terrain.getDataSetTerrId = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.GetTerrUnitOwnerName(dataSetId);
    };

    /**
     * 获取全局地形实例下包含数据集集合
     * @param {String} terrId //全局地形实例标识
     */
    Module.Terrain.getTerrSubAllDataSetId = function (terrId) {
        if (isEmptyLog(terrId, 'terrId')) return;
        var tempArr = Module.RealBIMWeb.GetProjNamesByTerrID(terrId);
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            if (tempArr.get(i) === 'RealBIMInnerDefaultSphProj') {
                continue;
            }
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    // MARK 数据处理

    /**
     * 注册一个地形自定义路径函数 注：加载wms数据时，可以动态的调整wms资源请求模板
     * @param {String} funId //函数标识
     * @param {Function} callback //函数体，参数必须为空，返回值必须为字符串
     */
    Module.Terrain.registerPathFunc = function (funId, callback) {
        if (isEmptyLog(funId, 'funId')) return;
        if (isEmptyLog(callback, 'callback')) return;

        if (typeof callback === 'function') {
            Module['m_re_em_rev_temp_terrain_path_func'] = callback;
        }
        Module.RealBIMWeb.RegisterATerrainPathFunc(funId);
    };

    /**
     * 注销一个地形自定义路径函数
     * @param {String} funId //函数标识
     */
    Module.Terrain.unRegisterPathFunc = function (funId) {
        if (isEmptyLog(funId, 'funId')) return;
        return Module.RealBIMWeb.UnRegisterATerrainPathFunc(funId);
    };

    /**
     * 注销系统中所有的地形自定义路径函数
     */
    Module.Terrain.unRegisterAllPathFunc = function () {
        Module.RealBIMWeb.UnRegisterAllTerrainPathFuncs();
    };

    // MARK 地形矢量锚点

    class RETerrainShpAncInfo {
        constructor() {
            this.groupName = null; //锚点组的标识，默认值 "DefaultGroup"
            this.ancName = null; //锚点的名称(唯一标识)
            this.pos = null; //锚点的位置
            this.picPath = null; //锚点的纹理路径
            this.textInfo = null; //锚点的文字
            this.picWidth = null; //锚点图片的宽度
            this.picHeight = null; //锚点图片的高度
            this.texBias = null; //锚点文字与图片的相对位置, 二元素数组[x，y], x取值（-1、0、1）分别表示文字在图片的左侧、中间、右侧；y取值（-1、0、1）分别表示文字在图片的下侧、中间、上侧；
            this.texFocus = null; //牵引线的最终顶点相对于图片的像素位置，需要配合ancSize使用，二元素数组[x，y], [0,0]表示位于图片的左下角, [picWidth/2,0]表示位于图片中下
            this.fontName = null; //锚点的字体样式
            this.textClr = null; //锚点的字体颜
            this.textBorderClr = null; //锚点的字体边框颜色
            this.textBackClr = null; //锚点的字体背景颜色
            this.textBackMode = null; //表示文字背景的处理模式 0：禁用文字背景 1：文字背景对应文字排版后返回的最终矩形区域 2：文字背景对应整体文字实际覆盖的矩形区域
            this.lodMax = null; //表示显示的最大lod级别
            this.lodMin = null; //表示显示的最小lod级别
            this.visible = null; //表示是否显示
        }
    }
    ExtModule.RETerrainShpAncInfo = RETerrainShpAncInfo;

    /**
     * 添加地形矢量锚点 注：地形矢量锚点必须添加在地形数据上
     * @param {String} dataSetId //数据集标识（地形数据）
     * @param {Array} terrShpAcnList //地形矢量锚点信息集合（RETerrainShpAncInfo 类型）
     */
    Module.Terrain.addTerrShpAnc = function (dataSetId, terrShpAcnList) {
        if (isEmpty(dataSetId) || !dataSetId.length) {
            logParErr('dataSetId');
            return false;
        }
        if (!checkTypeLog(terrShpAcnList, 'terrShpAcnList', RE_Enum.RE_Check_Array)) return false;

        var _tempAnchors = new Module.RE_Vector_RE_TERR_ANCHOR();
        for (let i = 0; i < terrShpAcnList.length; i++) {
            let ancInfo = terrShpAcnList[i];

            var _groupname = isEmpty(ancInfo.groupName) ? 'DefaultGroup' : ancInfo.groupName;
            var _textInfo = isEmpty(ancInfo.textInfo) ? '' : ancInfo.textInfo;
            var _picPath = isEmpty(ancInfo.picPath) ? '' : ancInfo.picPath;
            var _texfocus = isEmpty(ancInfo.texFocus) ? [0, 0] : ancInfo.texFocus;
            var _GolFontID = isEmpty(ancInfo.fontName) ? 'RealBIMFont001' : ancInfo.fontName;
            var _textcolor = isEmpty(ancInfo.textClr) ? 0xffffffff : clrToU32(ancInfo.textClr);
            var _textbordercolor = isEmpty(ancInfo.textBorderClr) ? 0xff000000 : clrToU32(ancInfo.textBorderClr);
            var _lodMax = isEmpty(ancInfo.lodMax) ? 31 : ancInfo.lodMax;
            var _lodMin = isEmpty(ancInfo.lodMin) ? 0 : ancInfo.lodMin;
            var _visible = isEmpty(ancInfo.visible) ? true : ancInfo.visible;
            var _linepos = [0, 0];

            const handle_rect = terrShpAnc_layoutRect(ancInfo);

            var tempobj = {
                m_strGroupName: _groupname,
                m_strName: ancInfo.ancName,
                m_vPos: ancInfo.pos,
                m_uLODMax: _lodMax,
                m_uLODMin: _lodMin,
                m_bVisible: _visible,
                m_cTexRegion: {
                    m_strTexPath: _picPath,
                    m_qTexRect: [
                        _linepos[0] - _texfocus[0],
                        _linepos[1] - _texfocus[1],
                        ancInfo.picWidth + _linepos[0] - _texfocus[0],
                        ancInfo.picHeight + _linepos[1] - _texfocus[1],
                    ],
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
                    m_bTextWeight: true,
                    m_strText: _textInfo,
                    m_uTextClr: _textcolor,
                    m_uTextBorderClr: _textbordercolor,
                    m_qTextRect: handle_rect.m_qTextRect,
                    m_uTextFmtFlag: handle_rect.m_uTextFmtFlag,
                    m_uTextBackMode: 0,
                    m_sTextBackBorder: 0,
                    m_uTextBackClr: 0x00000000,
                },
            };
            _tempAnchors.push_back(tempobj);
        }
        return Module.RealBIMWeb.AddTerrGolAnchors(dataSetId, _tempAnchors);
    };

    /**
     * 获取所有地形矢量锚点的信息
     * @param {String} dataSetId //数据集标识（地形数据）
     */
    Module.Terrain.getAllTerrShpAnc = function (dataSetId) {
        var _allAncData = Module.RealBIMWeb.GetTerrGolAnchors(dataSetId);
        var ancInfoList = [];
        for (var i = 0; i < _allAncData.size(); ++i) {
            ancInfoList.push(terrShpAnc_convCpp2Json(_allAncData.get(i)));
        }
        return ancInfoList;
    };

    /**
     * 删除地形数据上的地形矢量锚点
     * @param {String} dataSetId //数据集标识（地形数据），空字符串代表所有地形数据的所有地形矢量锚点
     * @param {Array} ancNameList //锚点名称集合
     */
    Module.Terrain.delTerrShpAnc = function (dataSetId, ancNameList) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return false;
        if (!checkTypeLog(ancNameList, 'ancNameList', RE_Enum.RE_Check_Array)) return false;
        var _arrStrName = new Module.RE_Vector_WStr();
        for (let i = 0; i < ancNameList.length; i++) {
            _arrStrName.push_back(ancNameList[i]);
        }
        if (dataSetId.length) {
            return Module.RealBIMWeb.DelTerrGolAnchors(dataSetId, _arrStrName);
        } else {
            return Module.RealBIMWeb.DelTerrGolAllAnchors();
        }
    };

    /**
     * 聚焦相机到指定的地形矢量锚点
     * @param {String} dataSetId //数据集标识（地形数据）
     * @param {Array} ancNameList //锚点名称集合
     * @param {Number} backwardAmp //相机在锚点中心处向后退的强度
     */
    Module.Terrain.setCamToTerrShpAnc = function (dataSetId, ancNameList, backwardAmp) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (!checkTypeLog(ancNameList, 'ancNameList', RE_Enum.RE_Check_Array)) return;
        var _arrStrName = new Module.RE_Vector_WStr();
        for (let i = 0; i < ancNameList.length; i++) {
            _arrStrName.push_back(ancNameList[i]);
        }
        let _backwardAmp = isEmpty(backwardAmp) ? 1.0 : backwardAmp;
        Module.RealBIMWeb.FocusCamToTerrGolAnchor(dataSetId, _arrStrName, _backwardAmp);
    };

    /**
     * 设置地形矢量锚点是否允许显示
     * @param {String} dataSetId //数据集标识
     * @param {String} ancName //锚点名称
     * @param {Boolean} visible //是否显示
     */
    Module.Terrain.setTerrShpAncVisible = function (dataSetId, ancName, visible) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(ancName, 'ancName')) return;
        let _visible = isEmpty(visible) ? true : visible;
        Module.RealBIMWeb.SetTerrGolAnchorVisible(dataSetId, ancName, _visible);
    };

    /**
     * 获取地形矢量锚点是否允许显示
     * @param {String} dataSetId //数据集标识
     * @param {String} ancName //锚点名称
     */
    Module.Terrain.getTerrShpAncVisible = function (dataSetId, ancName) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(ancName, 'ancName')) return;
        return Module.RealBIMWeb.GetTerrGolAnchorVisible(dataSetId, ancName);
    };

    /**
     * 设置全局地形矢量锚点文字和图片的可视层级范围
     * @param {Array} textLodRange // 表示文字资源层级范围（二元素数组类型）, 当值为[0,0]时表示不使用该预设值
     * @param {Array} picLodRange // 表示图片资源层级范围（二元素数组类型）, 当值为[0,0]时表示不使用该预设值
     */
    Module.Terrain.setGolTerrShpAncTextVisLodRange = function (textLodRange, picLodRange) {
        if (isEmptyLog(textLodRange, 'textLodRange')) return;
        if (isEmptyLog(picLodRange, 'picLodRange')) return;
        let _textLodRange = isEmpty(textLodRange) ? [0, 0] : textLodRange;
        let _picLodRange = isEmpty(picLodRange) ? [0, 0] : picLodRange;
        Module.RealBIMWeb.SetTerrGolAnchorLodSeg(_textLodRange, _picLodRange);
    };

    /**
     * 获取全局地形矢量锚点文字和图片的可视层级范围
     */
    Module.Terrain.getGolTerrShpAncTextVisLodRange = function () {
        const cInfo = Module.RealBIMWeb.GetTerrGolAnchorLodSeg();
        return { textLodRange: cInfo.m_vUvec2Value1, picLodRange: cInfo.m_vUvec2Value2 };
    };

    // MARK 地形矢量线

    class RETerrShpLineInfo {
        constructor() {
            this.shpName = null; //矢量标识名，若已有同名的矢量则覆盖之
            this.groupName = null; //矢量组名称
            this.potList = null; //表示多边形折线序列
            this.fillState = null; //表示折线的填充状态 0->多边形不填充； 1->多边形首尾相连构成封闭区域进行填充；
            this.lineClr = null; //表示多边形的颜色（REColor 类型）
            this.fillClr = null; //表示多边形的填充颜色（REColor 类型）
            this.textPos = null; //表示多边形的文字标注的位置： >=0时，整数部分i/小数部分j：表示文字定位点在线段<i,i+1>上的偏移了长度百分比j [-1,0)表示文字定位在折线上并从首端点偏移折线总长度的百分比 -2表示文字定位在多边形所有顶点的中心位置处
            this.textInfo = null; //表示顶点的文字标注信息（REShpTextInfo 类型）
            this.lineWidth = null; //表示多边形折线的线宽，线宽不要小于3，否则渲染消耗大，造成异常
            this.visible = null; //表示是否显示，默认true
        }
    }
    ExtModule.RETerrShpLineInfo = RETerrShpLineInfo;

    /**
     * 创建地形矢量线 注：地形矢量锚点必须添加在地形数据上
     * @param {String} dataSetId //数据集标识（地形数据）
     * @param {Array} terrShpLineList //矢量线信息集合（RETerrShpLineInfo 类型）
     */
    Module.Terrain.addTerrShpLine = function (dataSetId, terrShpLineList) {
        if (isEmpty(dataSetId) || !dataSetId.length) {
            logParErr('dataSetId');
            return false;
        }
        if (!checkTypeLog(terrShpLineList, 'terrShpLineList', RE_Enum.RE_Check_Array)) return false;

        var _arrTerrShpLine = new Module.RE_Vector_RE_TERR_SHP_INFO();
        for (let i = 0; i < terrShpLineList.length; i++) {
            const terrShpLine = terrShpLineList[i];

            // 文字信息
            var textobj = {};
            {
                const _textInfo = isEmpty(terrShpLine.textInfo) ? new REShpTextInfo() : terrShpLine.textInfo;
                var _texBias = isEmpty(_textInfo.texBias) ? [0, 0] : _textInfo.texBias;
                var _text = isEmpty(_textInfo.text) ? '' : _textInfo.text;
                var _GolFontID = isEmpty(_textInfo.fontName) ? 'RealBIMFont001' : _textInfo.fontName;
                var _textcolor = isEmpty(_textInfo.textClr) ? 0xffffffff : clrToU32(_textInfo.textClr);
                var _textbordercolor = isEmpty(_textInfo.textBorderClr) ? 0xff000000 : clrToU32(_textInfo.textBorderClr);

                // 文字相对区域对齐方式
                var TempTextRect = [-1, -1, 1, 1];
                var TempTextFmtFlag = 0x40; /*TEXT_FMT_NOCLIP*/
                {
                    if (_texBias[0] < 0) {
                        TempTextRect[0] = -1;
                        TempTextRect[2] = 0;
                        TempTextFmtFlag |= 0x20 /*TEXT_FMT_RIGHT*/;
                    } else if (_texBias[0] == 0) {
                        TempTextRect[0] = -1;
                        TempTextRect[2] = 1;
                        TempTextFmtFlag |= 0x10 /*TEXT_FMT_LEFT*/;
                    } else {
                        TempTextRect[0] = 0;
                        TempTextRect[2] = 1;
                        TempTextFmtFlag |= 0x8 /*TEXT_FMT_LEFT*/;
                    }
                    if (_texBias[1] < 0) {
                        TempTextRect[1] = -1;
                        TempTextRect[3] = 0;
                        TempTextFmtFlag |= 0x4 /*TEXT_FMT_TOP*/;
                    } else if (_texBias[1] == 0) {
                        TempTextRect[1] = -1;
                        TempTextRect[3] = 1;
                        TempTextFmtFlag |= 0x2 /*TEXT_FMT_BOTTOM*/;
                    } else {
                        TempTextRect[1] = 0;
                        TempTextRect[3] = 1;
                        TempTextFmtFlag |= 0x1 /*TEXT_FMT_BOTTOM*/;
                    }
                }

                textobj = {
                    m_strGolFontID: _GolFontID,
                    m_bTextWeight: true,
                    m_strText: _text,
                    m_uTextClr: _textcolor,
                    m_uTextBorderClr: _textbordercolor,
                    m_qTextRect: TempTextRect,
                    m_uTextFmtFlag: TempTextFmtFlag,
                    m_uTextBackMode: 0,
                    m_sTextBackBorder: 0,
                    m_uTextBackClr: 0x00000000,
                };
            }

            var _groupName = isEmpty(terrShpLine.groupName) ? '' : terrShpLine.groupName;
            var _shpName = isEmpty(terrShpLine.shpName) ? '' : terrShpLine.shpName;
            var _uClr = isEmpty(terrShpLine.lineClr) ? 0xffffffff : clrToU32(terrShpLine.lineClr);
            var _uFillClr = isEmpty(terrShpLine.fillClr) ? 0xffffffff : clrToU32(terrShpLine.fillClr);
            var _fillState = isEmpty(terrShpLine.fillState) ? 0 : terrShpLine.fillState;
            var _linewidth = isEmpty(terrShpLine.lineWidth) ? 3 : terrShpLine.lineWidth;
            var _visible = isEmpty(terrShpLine.visible) ? true : terrShpLine.visible;
            var _fTextPos = isEmpty(terrShpLine.textPos) ? -2 : terrShpLine.textPos;
            var _temparrpos = new Module.RE_Vector_dvec3();
            for (var k = 0; k < terrShpLine.potList.length; ++k) {
                _temparrpos.push_back(terrShpLine.potList[k]);
            }

            var terrShpLine_obj = {
                m_strShpName: _shpName,
                m_strGroupName: _groupName,
                m_arrPots: _temparrpos,
                m_uFillState: _fillState,
                m_uClr: _uClr,
                m_uFillClr: _uFillClr,
                m_fTextPos: _fTextPos,
                m_cTextInfo: textobj,
                m_uLineWidth: _linewidth,
                m_bVisible: _visible,
            };

            _arrTerrShpLine.push_back(terrShpLine_obj);
        }

        return Module.RealBIMWeb.AddTerrGolShp(dataSetId, _arrTerrShpLine);
    };

    /**
     * 删除地形数据上的地形矢量线
     * @param {String} dataSetId //数据集标识（地形数据），空字符串代表所有地形数据的所有地形矢量线
     * @param {Array} shpLineNameList //矢量线标识集合
     */
    Module.Terrain.delTerrShpLine = function (dataSetId, shpLineNameList) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return false;
        if (!checkTypeLog(shpLineNameList, 'shpLineNameList', RE_Enum.RE_Check_Array)) return false;
        var _arrStrName = new Module.RE_Vector_WStr();
        for (let i = 0; i < shpLineNameList.length; i++) {
            _arrStrName.push_back(shpLineNameList[i]);
        }
        if (dataSetId.length) {
            return Module.RealBIMWeb.DelTerrGolShp(dataSetId, _arrStrName);
        } else {
            return Module.RealBIMWeb.DelAllTerrGolShps();
        }
    };

    /**
     * 聚焦相机到指定的地形矢量线
     * @param {String} dataSetId //数据集标识（地形数据）
     * @param {Array} shpLineNameList //矢量线标识集合
     * @param {Number} backwardAmp //相机在锚点中心处向后退的强度
     */
    Module.Terrain.setCamToTerrShpLine = function (dataSetId, shpLineNameList, backwardAmp) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (!checkTypeLog(shpLineNameList, 'shpLineNameList', RE_Enum.RE_Check_Array)) return;
        var _arrStrName = new Module.RE_Vector_WStr();
        for (let i = 0; i < shpLineNameList.length; i++) {
            _arrStrName.push_back(shpLineNameList[i]);
        }
        let _backwardAmp = isEmpty(backwardAmp) ? 1.0 : backwardAmp;
        Module.RealBIMWeb.FocusCamToTerrGolShp(dataSetId, _arrStrName, _backwardAmp);
    };

    /**
     * 设置地形矢量线是否允许显示
     * @param {String} dataSetId //数据集标识
     * @param {String} shpLineName //矢量线标识
     * @param {Boolean} visible //是否显示
     */
    Module.Terrain.setTerrShpLineVisible = function (dataSetId, shpLineName, visible) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(shpLineName, 'shpLineName')) return;
        let _visible = isEmpty(visible) ? true : visible;
        Module.RealBIMWeb.SetTerrGolShpBVisible(dataSetId, shpLineName, _visible);
    };

    /**
     * 获取地形矢量线是否允许显示
     * @param {String} dataSetId //数据集标识
     * @param {String} shpLineName //矢量线标识
     */
    Module.Terrain.getTerrShpLineVisible = function (dataSetId, shpLineName) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(shpLineName, 'shpLineName')) return;
        return Module.RealBIMWeb.GetTerrGolShpBVisible(dataSetId, shpLineName);
    };

    /**
     * 设置全局地形矢量线文字的可视层级范围
     * @param {Array} textLodRange // 表示文字资源层级范围（二元素数组类型）, 当值为[0,0]时表示不使用该预设值
     */
    Module.Terrain.setGolTerrShpLineTextVisLodRange = function (textLodRange) {
        if (isEmptyLog(textLodRange, 'textLodRange')) return;
        let _textLodRange = isEmpty(textLodRange) ? [0, 0] : textLodRange;
        Module.RealBIMWeb.SetTerrGolShpTextLodSeg(_textLodRange);
    };

    /**
     * 获取全局地形矢量线文字的可视层级范围
     */
    Module.Terrain.getGolTerrShpLineTextVisLodRange = function () {
        return Module.RealBIMWeb.GetTerrGolShpTextLodSeg();
    };

    // MARK 辅助函数

    /**
     * 地形矢量锚点 c++ 数据转换 json
     * @param {Object} cppAncData //锚点数据
     */
    function terrShpAnc_convCpp2Json(cppAncData) {
        var ancInfo = new REAncInfo();
        if (!cppAncData.m_strName.length) {
            return null;
        }
        ancInfo.ancName = cppAncData.m_strName;
        ancInfo.groupName = cppAncData.m_strGroupName;
        ancInfo.pos = cppAncData.m_vPos;
        ancInfo.picPath = cppAncData.m_cTexRegion.m_strTexPath;
        ancInfo.textInfo = cppAncData.m_cTextRegion.m_strText;
        ancInfo.lodMax = cppAncData.m_uLODMax;
        ancInfo.lodMin = cppAncData.m_uLODMin;
        ancInfo.visible = cppAncData.m_bVisible;
        if (!isEmpty(cppAncData.m_cTextRegion.m_uTextClr) && cppAncData.m_cTextRegion.m_uTextClr != 0)
            ancInfo.textClr = clrU32ToClr(cppAncData.m_cTextRegion.m_uTextClr);
        ancInfo.textBorderClr = clrU32ToClr(cppAncData.m_cTextRegion.m_uTextBorderClr);
        if (!isEmpty(cppAncData.m_cTextRegion.m_uTextBackClr) && cppAncData.m_cTextRegion.m_uTextBackClr != 0)
            ancInfo.textBackClr = clrU32ToClr(cppAncData.m_cTextRegion.m_uTextBackClr);
        if (cppAncData.m_cTextRegion.m_strGolFontID != 'RealBIMFont001') ancInfo.fontName = cppAncData.m_cTextRegion.m_strGolFontID;

        return removeEmptyProperty(ancInfo);
    }

    /**
     * 地形矢量锚点布局设置
     * @param {Object} ancInfo //锚点数据
     */
    function terrShpAnc_layoutRect(ancInfo) {
        var _textBackPadding = isEmpty(ancInfo.textBackPadding) ? 0 : ancInfo.textBackPadding;
        var _texBias = isEmpty(ancInfo.texBias) ? [1, 0] : ancInfo.texBias;
        var _texfocus = isEmpty(ancInfo.texFocus) ? [0, 0] : ancInfo.texFocus;
        var _linepos = [0, 0];
        var _textBackPaddingRect = [0, 0, 0, 0];
        var _textInfo = isEmpty(ancInfo.textInfo) ? '' : ancInfo.textInfo;
        var _textOffset = (() => {
            const _textOffsetReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g'); //检测字符串中是否包含中文字符
            return _textOffsetReg.test(_textInfo) ? [0, 0] : [0, 2];
        })();
        // 文字相对区域对齐方式
        var _textFmtFlag = 128 + 64; /*TEXT_FMT_NOCLIP | TEXT_FMT_SINGLELINE*/
        // 文字区域
        var _texRect_min = [0, 0];
        var _texRect_max = [0, 0];
        {
            const top = _textBackPaddingRect[3];
            const bottom = _textBackPaddingRect[1];
            const left = _textBackPaddingRect[0];
            const right = _textBackPaddingRect[2];
            // console.log(`top: ${top}, bottom: ${bottom}, left: ${left}, right: ${right}`);
            if (_texBias[0] < 0 && _texBias[1] > 0) {
                // 文字在图片->左上
                _texRect_min = [
                    _linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2 - right,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                ];
                _texRect_max = [
                    _linepos[0] - _texfocus[0] - _textBackPadding - right,
                    ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2,
                ];
                _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
            } else if (_texBias[0] < 0 && _texBias[1] == 0) {
                // 文字在图片->左中
                _texRect_min = [_linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2 - right, _linepos[1] - _texfocus[1] - _textBackPadding];
                _texRect_max = [
                    _linepos[0] - _texfocus[0] - _textBackPadding - right,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                ];
                _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                _textFmtFlag |= 2; /*TEXT_FMT_VCENTER*/
            } else if (_texBias[0] < 0 && _texBias[1] < 0) {
                // 文字在图片->左下
                _texRect_min = [_linepos[0] - 1 - _texfocus[0] - _textBackPadding * 2 - right, _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2];
                _texRect_max = [_linepos[0] - _texfocus[0] - _textBackPadding - right, _linepos[1] - _texfocus[1] - _textBackPadding];
                _textFmtFlag |= 32; /*TEXT_FMT_RIGHT*/
                _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
            } else if (_texBias[0] == 0 && _texBias[1] > 0) {
                // 文字在图片->中上
                _texRect_min = [
                    _linepos[0] - _texfocus[0] - _textBackPadding,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding + bottom,
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                    ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2 + (top + bottom),
                ];
                _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
            } else if (_texBias[0] == 0 && _texBias[1] == 0) {
                // 文字在图片->中中
                _texRect_min = [_linepos[0] - _texfocus[0] - _textBackPadding, _linepos[1] - _texfocus[1] - _textBackPadding - bottom];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding + top,
                ];
                _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                _textFmtFlag |= 2; /*TEXT_FMT_VCENTER*/
            } else if (_texBias[0] == 0 && _texBias[1] < 0) {
                // 文字在图片->中下
                _texRect_min = [
                    _linepos[0] - _texfocus[0] - _textBackPadding,
                    _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2 - (top + bottom),
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding,
                    _linepos[1] - _texfocus[1] - _textBackPadding - top,
                ];
                _textFmtFlag |= 16; /*TEXT_FMT_HCENTER*/
                _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
            } else if (_texBias[0] > 0 && _texBias[1] > 0) {
                // 文字在图片->右上
                _texRect_min = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding + left,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2 + left,
                    ancInfo.picHeight + _linepos[1] + 1 - _texfocus[1] + _textBackPadding * 2,
                ];
                _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                _textFmtFlag |= 1; /*TEXT_FMT_BOTTOM*/
            } else if (_texBias[0] > 0 && _texBias[1] == 0) {
                // 文字在图片->右中
                _texRect_min = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding + left,
                    _linepos[1] - _texfocus[1] - _textBackPadding,
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2 + left,
                    ancInfo.picHeight + _linepos[1] - _texfocus[1] + _textBackPadding,
                ];
                _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                _textFmtFlag |= 2; /*TEXT_FMT_VCENTER*/
            } else if (_texBias[0] > 0 && _texBias[1] < 0) {
                // 文字在图片->右下
                _texRect_min = [
                    ancInfo.picWidth + _linepos[0] - _texfocus[0] + _textBackPadding + left,
                    _linepos[1] - 1 - _texfocus[1] - _textBackPadding * 2,
                ];
                _texRect_max = [
                    ancInfo.picWidth + _linepos[0] + 1 - _texfocus[0] + _textBackPadding * 2 + left,
                    _linepos[1] - _texfocus[1] - _textBackPadding,
                ];
                _textFmtFlag |= 8; /*TEXT_FMT_LEFT*/
                _textFmtFlag |= 4; /*TEXT_FMT_TOP*/
            }
        }

        var _textRect_combine = [..._texRect_min, ..._texRect_max];
        // console.log(`textRect_combine: ${_textRect_combine}`);
        if (!_textInfo.length) {
            _textRect_combine = [0, 0, 0, 0];
        }

        return {
            m_uTextFmtFlag: _textFmtFlag,
            m_qTextRect: [
                _textRect_combine[0] + _textOffset[0],
                _textRect_combine[1] + _textOffset[1],
                _textRect_combine[2] + _textOffset[0],
                _textRect_combine[3] + _textOffset[1],
            ],
        };
    }

    // MOD-- 360全景（Panorama） <---
    Module.Panorama = typeof Module.Panorama !== 'undefined' ? Module.Panorama : {}; //增加 Panorama 模块

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
            var _path = _dataSetInfo.resourcesAddress + '/360/total.xml';
            Module.RealBIMWeb.LoadPanSce(_dataSetInfo.dataSetId, _path);
        }
    };

    /**
     * 判断全景场景是否全部加载完成
     */
    Module.Panorama.getReadyState = function () {
        return Module.RealBIMWeb.IsPanSceReady();
    };

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
    };

    /**
     * 卸载一个或多个全景场景，传空数组时，卸载所有的全景场景
     * @param {Array} dataSetIdList //数据集id集合
     */
    Module.Panorama.unloadDataSet = function (dataSetIdList) {
        var _panNames = new Module.RE_Vector_WStr();
        for (let i = 0; i < dataSetIdList.length; i++) {
            _panNames.push_back(dataSetIdList[i]);
        }
        Module.RealBIMWeb.UnLoadPanSce(_panNames);
    };

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
    };

    /**
     * 设置360全景窗口显示的图片信息
     * @param {String} elemId //某一帧全景图的唯一标识
     * @param {Number} panWindow //全景窗口标识
     */
    Module.Panorama.loadPanPic = function (elemId, panWindow) {
        Module.RealBIMWeb.LoadPan(elemId, panWindow);
    };

    // MARK 相机

    /**
     * 设置360相机的朝向
     * @param {String} locType //表示相机朝向（ RECamDirEm 枚举类型）
     * @param {Number} panWindow //360相机的id，如果当前场景仅有一个360场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.setCamLocateTo = function (locType, panWindow) {
        if (isEmptyLog(locType, 'locType')) return;
        var _panCamId = 0;
        if (!isEmpty(panWindow)) {
            _panCamId = panWindow;
        }
        var enumEval = eval(locType);
        Module.RealBIMWeb.LocatePanCamToMainDir(enumEval, _panCamId);
    };

    /**
     * 自定义设置360相机的朝向
     * @param {dvec4} camRotate //相机的朝向（四元素数组）
     * @param {Number} panWindow //360相机的id，如果当前场景仅有一个360场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.setCamLocateToRotate = function (camRotate, panWindow) {
        if (isEmptyLog(camRotate, 'camRotate')) return;
        const _panCamId = isEmpty(panWindow) ? 0 : panWindow;
        const _camLoc = Module.RealBIMWeb.GetPanCamLocation(_panCamId);
        Module.RealBIMWeb.LocatePanCamTo(_camLoc.m_vCamPos, camRotate, _panCamId);
    };

    /**
     * 设置全景场景相机方位
     * @param {dvec3} curPos //当前相机的位置（当前帧图片扫描点位）
     * @param {dvec3} destPos //目标点位
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.setCamLocateToDestPos = function (curPos, destPos, panWindow) {
        var _panCamId = 0;
        if (!isEmpty(panWindow)) {
            _panCamId = panWindow;
        }
        Module.RealBIMWeb.LocatePanCamToDestPos(curPos, destPos, _panCamId);
    };

    /**
     * 获取全景相机的方位信息
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.getCamLocate = function (panWindow) {
        var _panCamId = 0;
        if (!isEmpty(panWindow)) {
            _panCamId = panWindow;
        }
        var camLoc = new RECamLoc();
        var _camLoc01 = Module.RealBIMWeb.GetPanCamLocation(_panCamId);
        var _camLoc02 = Module.RealBIMWeb.GetPanCamLocation_Dir(_panCamId);
        camLoc.camPos = _camLoc01.m_vCamPos;
        camLoc.camRotate = _camLoc01.m_qCamRotate;
        camLoc.camDir = _camLoc02.m_qCamDir;
        return camLoc;
    };

    /**
     * 设置全景图的自动前进后退
     * @param {Number} type //类型 0：前进 1：后退
     * @param {Number} time //时长
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.setCamAutoForward = function (type, time, panWindow) {
        var _type = isEmpty(type) ? 0 : type;
        var _panWindow = isEmpty(panWindow) ? 0 : panWindow;
        var _threshold = _type == 1 ? 70 : 30;
        var _MoveCoef = _type == 1 ? 1.0 : -1.0;
        var _time = isEmpty(time) ? 1.0 : time;
        Module.RealBIMWeb.SetPanCamAutoForward(_threshold, _MoveCoef, _time, _panWindow);
    };

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
    };

    /**
     * 获取锚点在全景图上的像素坐标
     * @param {dvec3} pos //三维坐标点
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.getTexPos = function (pos, panWindow) {
        return Module.RealBIMWeb.GetTexPos(pos, panWindow);
    };

    // MARK 锚点
    class REPanAnc {
        constructor() {
            this.panWindow = 0; //	全景相机标识(默认值0)，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
            this.ancName = null; //	锚点的名称(唯一标识)，必填
            this.pos = [0, 0, 0]; //	锚点的位置，默认值 [0,0,0]
            this.texPos = [0, 0]; //	表示锚点在全景图上的像素位置
            this.useTexPos = false; //	表示是否使用像素位置添加锚点
            this.picPath = null; //	表示锚点的图片路径
            this.picSize = [0, 0]; //	表示锚点的图片大小
            this.text = null; //	表示顶点的文字标注信息
            this.textClr = new REColor(0, 0, 0, 255); //	表示锚点的文字标注颜色
            this.texBias = [0, 0]; //	表示锚点文字与图片的相对位置，二维坐标：以点为中心点，横轴为x，右侧为正方向，竖轴为y，向上为正方向, 例如（-1，-1）为文字在点的左下方，（1,1）为右上方
            this.texFocus = [0, 0]; //	表示指定纹理图片中的像素坐标，对应对锚点的位置坐标
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
            var _panCamId = 0;
            if (!isEmpty(_panAncInfo.panWindow)) _panCamId = _panAncInfo.panWindow;
            var _pos = [0, 0, 0];
            if (!isEmpty(_panAncInfo.pos)) _pos = _panAncInfo.pos;
            var _texPos = [0, 0];
            if (!isEmpty(_panAncInfo.texPos)) _texPos = _panAncInfo.texPos;
            var _useCamPost = false;
            if (!isEmpty(_panAncInfo.useTexPos)) _useCamPost = _panAncInfo.useTexPos;
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
            };
            tempPanAnchors.push_back(tempobj);
        }
        Module.RealBIMWeb.AddPanAnc(tempPanAnchors);
    };

    /**
     * 获取当前已加载的全景图锚点的唯一标识集合
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.getAllAncName = function (panWindow) {
        var _panCamId = 0;
        if (!isEmpty(panWindow)) _panCamId = panWindow;
        var tempArr = Module.RealBIMWeb.GetPanAnc(_panCamId);
        var nameArr = [];
        for (var i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 删除锚点
     * @param {String} ancName //点的名称,如果为""删除所有全景图中的所有锚点
     * @param {Number} panWindow //全景相机标识，如果当前场景仅有一个全景场景，则填0即可，如果有两个，则0表示第一个，1表示第二个
     */
    Module.Panorama.delAnc = function (ancName, panWindow) {
        var _panCamId = 0;
        if (!isEmpty(panWindow)) _panCamId = panWindow;
        Module.RealBIMWeb.DelPanAnc(_panCamId, ancName);
    };

    // MOD-- 模型编辑（Edit） <---
    Module.Edit = typeof Module.Edit !== 'undefined' ? Module.Edit : {}; //增加 Edit 模块

    /**
     * 进入位置编辑状态
     * @param {Number} type //默认编辑操作类型 0:不在位置编辑匹配模式 1: 移动配准  2：控制点配准
     */
    Module.Edit.startEdit = function (type) {
        let _type = isEmpty(type) || type == 0 ? 1 : type;
        return Module.RealBIMWeb.EnterPosMatchMode(_type);
    };

    /**
     * 退出位置编辑状态
     */
    Module.Edit.endEdit = function () {
        Module.RealBIMWeb.ExitPosMatchMode();
    };

    /**
     * 获取位置编辑状态
     */
    Module.Edit.getEditState = function () {
        return Module.RealBIMWeb.GetPosMatchMode();
    };

    /**
     * 设置数据集是否可编辑，所有数据集默认是可编辑的
     * @param {Array} dataSetIdList //数据集唯一标识集合
     * @param {Boolean} enable //是否允许编辑
     */
    Module.Edit.setDataSetEditEnable = function (dataSetIdList, enable) {
        var _projvec = new Module.RE_Vector_WStr();
        for (let i = 0; i < dataSetIdList.length; i++) {
            _projvec.push_back(dataSetIdList[i]);
        }
        let _enable = isEmpty(enable) ? true : enable;
        Module.RealBIMWeb.SetSceneNodeEditable(_projvec, _enable);
    };

    /**
     * 获取数据集是否可编辑
     * @param {String} dataSetId //数据集唯一标识
     */
    Module.Edit.getDataSetEditEnable = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        return Module.RealBIMWeb.GetSceneNodeEditable(dataSetId);
    };

    // MOD-- 测量（Measure） <---
    Module.Measure = typeof Module.Measure !== 'undefined' ? Module.Measure : {}; //增加 Measure 模块

    // MARK 加载

    class REMeasureInfo {
        constructor() {
            this.measureType = null; //测量类型 1：单次长度测量  2：连续长度测量  3：单次角度测量  4：连续角度测量  5：面积测量  6：位置测量  7：面间距测量  8：面角度测量
            this.dataShowType = null; //数据显示类型  1：沿线（面）本身方向  2：测量线（面）投射XY平面  3：测量线投射Z方向（仅线可用）  4：测量线（面）贴地测量
            this.groupId = null; //组id, 1024以内的id为系统工具栏创建的测量数据的保有数值，如果传递1024以内的值则会对工具栏创建的测量数据进行覆盖
            this.pointList = null; //测量点集合
            this.norList = null; //测量点的法线集合（默认空数组，面间距，面夹角测量时有效，和测量点集合一一对应）
        }
    }
    ExtModule.REMeasureInfo = REMeasureInfo;

    /**
     * 添加一组测量数据
     * @param {Array} measureInfoList //测量信息集合 （REMeasureInfo 类型）
     */
    Module.Measure.addGroupData = function (measureInfoList) {
        if (isEmptyLog(measureInfoList, 'measureInfoList')) return;

        let _vevtor_groupList = new Module.RE_Vector_MEASURE_INFO();
        for (let i = 0; i < measureInfoList.length; i++) {
            const measureInfo = measureInfoList[i];
            if (isEmptyLog(measureInfo.groupId, 'groupId')) return;
            if (isEmptyLog(measureInfo.pointList, 'pointList')) return;
            if (measureInfo.groupId < 1024) {
                // 限制用户必须传递大于1024的参数，否则和内部工具参数重叠
                logParErr('groupId');
                return;
            }
            var _measureType = isEmpty(measureInfo.measureType) ? 1 : measureIntToEm(measureInfo.measureType);
            var _dataShowType = isEmpty(measureInfo.dataShowType) ? 1 : convIntToU32(measureInfo.dataShowType);
            var _pointList = new Module.RE_Vector_dvec3();
            for (let i = 0; i < measureInfo.pointList.length; i++) {
                _pointList.push_back(measureInfo.pointList[i]);
            }
            let _norList = new Module.RE_Vector_dvec3();
            let norList_count = isEmpty(measureInfo.norList) ? 0 : measureInfo.norList.length;
            for (let i = 0; i < norList_count; i++) {
                _norList.push_back(measureInfo.norList[i]);
            }
            _vevtor_groupList.push_back({
                m_eMeasureType: _measureType,
                m_uLockDir: _dataShowType,
                m_uGroupID: measureInfo.groupId,
                m_arrPts: _pointList,
                m_arrNors: _norList,
            });
            // Module.RealBIMWeb.AddAMeasureGroup(_measureType, _dataShowType, measureInfo.groupId, _pointList);
        }
        Module.RealBIMWeb.AddMeasureGroup(_vevtor_groupList);
    };

    /**
     * 删除一组测量数据
     * @param {Number} groupId //组id
     */
    Module.Measure.delGroupData = function (groupId) {
        Module.RealBIMWeb.RemoveAMeasureGroup(groupId);
    };

    /**
     * 删除一类测量数据
     * @param {Number} type //测量类型 1:单次长度测量  2：连续长度测量  3：单次角度测量  4：连续角度测量  5：面积测量  6：位置测量  7：面间距测量  8：面角度测量
     */
    Module.Measure.delTypeData = function (type) {
        let _type = isEmpty(type) ? 1 : measureIntToEm(type);
        Module.RealBIMWeb.RemoveMeasureGroupByType(_type);
    };

    /**
     * 根据测量类型获取测量数据
     * @param {Number} measureType //测量类型 1:单次长度测量  2：连续长度测量  3：单次角度测量  4：连续角度测量  5：面积测量  6：位置测量  7：面间距测量  8：面角度测量
     */
    Module.Measure.getGroupDataByType = function (measureType) {
        var _measureType = isEmpty(measureType) ? 1 : measureIntToEm(measureType);
        let _vList = Module.RealBIMWeb.GetMeasureGroupByType(_measureType);
        let dataList = [];
        for (let i = 0; i < _vList.size(); i++) {
            const _i_data = _vList.get(i);
            let _data = new Module.REMeasureInfo();
            _data.groupId = _i_data.m_uGroupID;
            _data.measureType = convU32ToInt(_i_data.m_eMeasureType.value);
            _data.dataShowType = convU32ToInt(_i_data.m_uLockDir);
            let _pointList_temp = [];
            for (let j = 0; j < _i_data.m_arrPts.size(); j++) {
                const _j_data = _i_data.m_arrPts.get(j);
                _pointList_temp.push(_j_data);
            }
            let _norList_temp = [];
            for (let j = 0; j < _i_data.m_arrNors.size(); j++) {
                const _j_data = _i_data.m_arrNors.get(j);
                _norList_temp.push(_j_data);
            }
            _data.pointList = _pointList_temp;
            _data.norList = _norList_temp;
            dataList.push(_data);
        }
        return dataList;
    };

    /**
     * 根据测量标识获取测量数据
     * @param {Array} groupIdList //测量标识集合
     */
    Module.Measure.getGroupDataByID = function (groupIdList) {
        var count = groupIdList.length;
        var _moemory = (count * 4).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
        var _idList = Module.RealBIMWeb.GetHeapView_U32(0);
        for (let i = 0; i < count; ++i) {
            var id = groupIdList[i];
            _idList.set([id], i);
        }
        let _vList = Module.RealBIMWeb.GetMeasureGroup(_idList.byteLength, _idList.byteOffset);
        let dataList = [];
        for (let i = 0; i < _vList.size(); i++) {
            const _i_data = _vList.get(i);
            let _data = new Module.REMeasureInfo();
            _data.groupId = _i_data.m_uGroupID;
            _data.measureType = convU32ToInt(_i_data.m_eMeasureType.value);
            _data.dataShowType = convU32ToInt(_i_data.m_uLockDir);
            let _pointList_temp = [];
            for (let j = 0; j < _i_data.m_arrPts.size(); j++) {
                const _j_data = _i_data.m_arrPts.get(j);
                _pointList_temp.push(_j_data);
            }
            let _norList_temp = [];
            for (let j = 0; j < _i_data.m_arrNors.size(); j++) {
                const _j_data = _i_data.m_arrNors.get(j);
                _norList_temp.push(_j_data);
            }
            _data.pointList = _pointList_temp;
            _data.norList = _norList_temp;
            dataList.push(_data);
        }
        return dataList;
    };

    /**
     * 获取测量结果
     * @param {String} measureId //测量对象标识
     */
    Module.Measure.getResultData = function (measureId) {
        if (isEmptyLog(measureId, 'measureId')) return {};
        const _cMesureResData = Module.RealBIMWeb.GetMeasureResult(measureId);
        const mesureType = convU32ToInt(_cMesureResData.m_eMeasureType.value);
        let posList = [];
        for (let i = 0; i < _cMesureResData.m_arrPts.size(); i++) {
            posList.push(_cMesureResData.m_arrPts.get(i));
        }
        let norList = [];
        for (let i = 0; i < _cMesureResData.m_arrNors.size(); i++) {
            norList.push(_cMesureResData.m_arrNors.get(i));
        }
        let resultData = {
            mesureType: mesureType,
            dataShowType: convU32ToInt(_cMesureResData.m_uLockDir),
            posList: posList,
            norList: norList,
            unit: _cMesureResData.m_strUnit,
        };
        switch (mesureType) {
            case 1:
                {
                    resultData.totalLength = _cMesureResData.m_dTotalLength;
                    resultData.horiLen = _cMesureResData.m_dHoriLen;
                    resultData.vertLen = _cMesureResData.m_dVertLen;
                    resultData.grade = _cMesureResData.m_dVertLen / _cMesureResData.m_dHoriLen;
                }
                break;
            case 2:
                {
                    resultData.totalLength = _cMesureResData.m_dTotalLength;
                    resultData.horiLen = _cMesureResData.m_dHoriLen;
                    resultData.vertLen = _cMesureResData.m_dVertLen;
                    resultData.grade = _cMesureResData.m_dVertLen / _cMesureResData.m_dHoriLen;
                }
                break;
            case 3:
                {
                    resultData.angleDegree = _cMesureResData.m_dAngleDegree;
                }
                break;
            case 4:
                {
                    resultData.angleDegree = _cMesureResData.m_dAngleDegree;
                }
                break;
            case 5:
                {
                    resultData.totalArea = _cMesureResData.m_dTotalArea;
                }
                break;
            case 6:
                {
                    resultData.position = _cMesureResData.m_vPosition;
                }
                break;
            case 7:
                {
                    resultData.planeDist = _cMesureResData.m_dPlaneDist;
                    resultData.planeAngle = _cMesureResData.m_dPlaneAngle;
                }
                break;
            case 8:
                {
                    resultData.planeAngle = _cMesureResData.m_dPlaneAngle;
                }
                break;
            default:
                break;
        }

        return resultData;
    };

    // MARK 渲染设置
    /**
     * 设置测量线的颜色
     * @param {String} clrType //颜色类型
     * @param {REColor} lineClr //测量线颜色（REColor 类型）
     */
    Module.Measure.setLineClr = function (clrType, lineClr) {
        var uclr = clrToU32(lineClr);
        Module.RealBIMWeb.SetMeasureShapeColor(clrType, uclr);
    };

    /**
     * 设置测量显示文字的样式
     * @param {String} clrType //颜色类型
     * @param {String} fontName //字体样式名称，由REaddAGolFont接口创建的字体名称；填空字符串表示使用默认字体样式
     * @param {REColor} lineClr //测量线颜色（REColor 类型）
     * @param {Boolean} isBorder //表示本次设置该字体本身还是边框：true：表示设置边框颜色，false：表示设置字体本身
     */
    Module.Measure.setTextStyle = function (clrType, fontName, lineClr, isBorder) {
        var uclr = clrToU32(lineClr);
        var tempshapetype = isBorder ? clrType + '_Border' : clrType;
        var _fontStyle = 'RealBIMFont001';
        if (fontName != '') {
            _fontStyle = fontName;
        }
        Module.RealBIMWeb.SetMeasureTextColor(tempshapetype, uclr);
        Module.RealBIMWeb.SetMeasureTextFontName(tempshapetype, _fontStyle);
    };

    /**
     * 重置测量样式为系统默认样式
     */
    Module.Measure.resetDefaultStyle = function () {
        Module.RealBIMWeb.ResetMeasureShapeAppearance();
    };

    /**
     * 获取测量显示的精度
     */
    Module.Measure.getValueDispPrecision = function () {
        return Module.RealBIMWeb.GetMeasureValueDispPrecision();
    };

    /**
     * 设置测量显示的精度
     * @param {Number} precision //精度（正整数）
     */
    Module.Measure.setValueDispPrecision = function (precision) {
        Module.RealBIMWeb.SetMeasureValueDispPrecision(precision);
    };

    /**
     * 获取坡度显示状态
     */
    Module.Measure.getSlopeVisible = function () {
        return Module.RealBIMWeb.GetGradeVisible();
    };

    /**
     * 设置长度测量时两点之间的坡度显示开关
     * @param {Boolean} enable //是否开启
     */
    Module.Measure.setSlopeVisible = function (enable) {
        Module.RealBIMWeb.SetGradeVisible(enable);
    };

    /**
     * 获取当前长度测量的数据显示模式
     */
    Module.Measure.getLengthDataShowType = function () {
        var _type = Module.RealBIMWeb.GetMeasureLockDir();
        return convU32ToInt(_type);
    };

    /**
     * 设置当前长度测量的数据显示模式
     * @param {Number} type //显示模式 1：沿线本身方向  2：测量线投射XY平面  3：测量线投射Z方向  4：测量线贴地模式
     */
    Module.Measure.setLengthDataShowType = function (type) {
        var _type = isEmpty(type) ? 1 : convIntToU32(type);
        Module.RealBIMWeb.SetMeasureLockDir(_type);
    };

    /**
     * 获取当前面积测量的数据显示模式
     */
    Module.Measure.getAreaDataShowType = function () {
        var _type = Module.RealBIMWeb.GetAreaProjLockDir();
        return convU32ToInt(_type);
    };

    /**
     * 设置当前面积测量的数据显示模式
     * @param {Number} type //显示模式 1：平面上  2：平面投射XY平面  4：平面贴地模式
     */
    Module.Measure.setAreaDataShowType = function (type) {
        var _type = isEmpty(type) ? 1 : convIntToU32(type);
        Module.RealBIMWeb.SetAreaProjLockDir(_type);
    };

    /**
     * 获取轴平行辅助线开启状态
     */
    Module.Measure.getAssistLineVisible = function () {
        return Module.RealBIMWeb.GetAssistLineVisible();
    };

    /**
     * 设置轴平行辅助线开启状态
     * @param {Boolean} enable //是否开启
     */
    Module.Measure.setAssistLineVisible = function (enable) {
        Module.RealBIMWeb.SetAssistLineVisible(enable);
    };

    // MARK 操作设置
    /**
     * 显示鼠标选中点到场景中电子围栏的最短距离
     */
    Module.Measure.startShowFenceMinDis = function () {
        return Module.RealBIMWeb.EnterPotAndFenceDistMeasureState();
    };

    /**
     * 关闭显示鼠标选中点到场景中电子围栏的最短距离
     */
    Module.Measure.endShowFenceMinDis = function () {
        Module.RealBIMWeb.ExitPotAndFenceDistMeasureState();
    };

    /**
     * 在屏幕上显示两个点之间的水平距离
     * @param {dvec3} point1 //表示第一个点的坐标, 三元素数组类型
     * @param {dvec3} point2 //表示第二个点的坐标, 三元素数组类型
     * @param {String} text //显示相应的文字
     */
    Module.Measure.drawHoriDisLine = function (point1, point2, text) {
        Module.RealBIMWeb.DrawHoriMeasureData(point1, point2, text);
    };

    /**
     * 清除屏幕上的两点之间水平距离的信息
     */
    Module.Measure.clearHoriDisLine = function () {
        Module.RealBIMWeb.ClearHoriMeasureData();
    };

    /**
     * 在图形窗口显示两点之间的直线距离、水平距离、垂直距离
     * @param {dvec3} point1 //表示第一个点的坐标, 三元素数组类型
     * @param {dvec3} point2 //表示第二个点的坐标, 三元素数组类型
     * @param {Number} mode //显示模式
     */
    Module.Measure.drawDisLine = function (point1, point2, mode) {
        Module.RealBIMWeb.DrawMeasureDataOfLineSegment(point1, point2, mode);
    };

    /**
     * 清除屏幕上的两点之间距离的信息
     */
    Module.Measure.clearDisLine = function () {
        Module.RealBIMWeb.ClearMeasureDataOfLineSegment();
    };

    /**
     * 获取当前操作的测量类型
     */
    Module.Measure.getMeasureType = function () {
        let _type = convU32ToInt(Module.RealBIMWeb.GetMeasureType());
        return _type;
    };

    /**
     * 设置当前操作的测量类型
     * @param {Number} type //操作的测量类型 1:单次长度测量  2：连续长度测量  3：单次角度测量  4：连续角度测量  5：面积测量  6：位置测量  7：面间距测量  8：面角度测量
     */
    Module.Measure.setMeasureType = function (type) {
        let _type = isEmpty(type) ? 1 : measureIntToEm(type);
        Module.RealBIMWeb.SetMeasureType(_type);
    };

    /**
     * 进入测量交互模式
     */
    Module.Measure.startMeasureState = function () {
        //接口进入测量模式和系统UI面板中的测量模式不联动，需要关闭系统UI面板(包含内联弹窗)
        Module.RealBIMWeb.SetToolBarUIVisible(false);
        Module.RealBIMWeb.SetBuiltInUIEnable(false);
        var state = Module.RealBIMWeb.EnterMeasureMode();
        Module.RealBIMWeb.SetMeasureType(measureIntToEm(1)); //默认进入长度测量
        return state;
    };

    /**
     * 结束测量交互模式
     * @param {Boolean} enable //之前是否允许系统UI面板展示(默认为展示系统UI面板)
     */
    Module.Measure.endMeasureState = function (enable) {
        var _enable = isEmpty(enable) ? true : enable;
        if (_enable) {
            //需要恢复关闭的系统UI面板(包含内联弹窗)
            Module.RealBIMWeb.SetBuiltInUIEnable(true);
            Module.RealBIMWeb.SetToolBarUIVisible(true);
        }
        return Module.RealBIMWeb.ExitMeasureMode();
    };

    /**
     * 取消当前点选操作
     */
    Module.Measure.cancelCurPotOpt = function () {
        return Module.RealBIMWeb.TerminateMeasurePath();
    };

    /**
     * 获取当前是否处于测量交互模式
     */
    Module.Measure.getCurState = function () {
        return Module.RealBIMWeb.IsInMeasureMode();
    };

    // MARK 辅助
    /**
     * c++ 测量类型转换 int->Em
     * @param {Number} type //测量类型
     */
    function measureIntToEm(type) {
        let _type = 1;

        switch (type) {
            case 1:
                _type = Module.RE_MEASURE_TYPE.MEASURE_LENGTH_ONCE; //单次长度测量
                break;
            case 2:
                _type = Module.RE_MEASURE_TYPE.MEASURE_LENGTH_CONTINUOUS; //连续长度测量
                break;
            case 3:
                _type = Module.RE_MEASURE_TYPE.MEASURE_ANGLE_ONCE; //单次角度测量
                break;
            case 4:
                _type = Module.RE_MEASURE_TYPE.MEASURE_ANGLE_CONTINUCOUS; //连续角度测量
                break;
            case 5:
                _type = Module.RE_MEASURE_TYPE.MEASURE_AREA; //面积测量
                break;
            case 6:
                _type = Module.RE_MEASURE_TYPE.MEASURE_POSITION; //位置测量
                break;
            case 7:
                _type = Module.RE_MEASURE_TYPE.MEASURE_PLANE_DIST; //面间距测量
                break;
            case 8:
                _type = Module.RE_MEASURE_TYPE.MEASURE_PLANE_ANGLE; //面角度测量
                break;
            default:
                break;
        }

        return _type;
    }

    // MOD-- 电子围栏（Fence） <---
    Module.Fence = typeof Module.Fence !== 'undefined' ? Module.Fence : {}; //增加 Fence 模块

    /**
     * 进入编辑电子围栏状态
     */
    Module.Fence.startFenceEdit = function () {
        Module.RealBIMWeb.EnterFenceEditMode();
    };

    /**
     * 退出编辑电子围栏状态
     */
    Module.Fence.endFenceEdit = function () {
        Module.RealBIMWeb.ExitFenceEditMode();
    };

    /**
     * 开始添加电子围栏
     */
    Module.Fence.addFence = function () {
        return Module.RealBIMWeb.BeginAddFence();
    };

    /**
     * 结束添加电子围栏
     */
    Module.Fence.endAddFence = function () {
        return Module.RealBIMWeb.EndAddFence();
    };

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
            m_fFrameFreq: 0.0,
        };
        Module.RealBIMWeb.SetFencePotUniformIcon(temptexregions);
    };

    class REFencePot {
        constructor() {
            this.pos = null; //顶点位置
            this.height = null; //顶点高度
            this.potClr = null; //顶点颜色
            this.endPotType = 0; //是否是当前围栏的最后一个顶点，0：不是最后一个顶点；1：最后一个顶点且围栏封闭；2：最后一个顶点且围栏不封闭
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
    };

    /**
     * 根据电子围栏的顶点的名称返回围栏的名称
     * @param {String} potName //顶点名称
     */
    Module.Fence.getFenceName = function (potName) {
        var fencedata = Module.RealBIMWeb.GetShpObjExtInfo(potName);
        if (fencedata.m_eType.value == 3 || fencedata.m_eType.value == 4) {
            var fencename = fencedata.m_strParent;
            return fencename;
        }
    };

    /**
     * 删除一个围栏顶点
     * @param {String} potName //顶点名称
     */
    Module.Fence.delFencePot = function (potName) {
        Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
        var bool = Module.RealBIMWeb.DelFencePot(potName);
        Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
        return bool;
    };

    /**
     * 删除一个围栏
     * @param {String} fenceName //围栏名称
     */
    Module.Fence.delFence = function (fenceName) {
        Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
        var bool = Module.RealBIMWeb.DelFence(fenceName);
        Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
        return bool;
    };

    //删除全部围栏
    Module.Fence.delAllFence = function () {
        Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
        var bool = Module.RealBIMWeb.DelAllFences();
        Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
        return bool;
    };

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
    };

    /**
     * 检测目标位置是否在任何一个围栏内
     * @param {dvec3} point //目标点坐标（三元素数组）
     */
    Module.Fence.getPotInAnyFence = function (point) {
        if (isEmptyLog(point, 'point')) return;
        return Module.RealBIMWeb.IsInAnyFences(point);
    };

    // MOD-- 水面（Water） <---
    Module.Water = typeof Module.Water !== 'undefined' ? Module.Water : {}; //增加 Water 模块

    class REWaterInfo {
        constructor() {
            this.waterName = null; //水面名称
            this.waterClr = new REColor(61, 158, 135, 255); //水面颜色
            this.blendDist = 1; //混合系数，值越大边缘混合效果越强  取值范围 0-1
            this.visible = true; //是否可见
            this.expandDist = 10.0; //表示水面区域的边界扩充距离
            this.depthBias = 0.0; //表示水面的深度偏移
            this.visDist = 200000.0; //表示水面的最远可视距离
            this.rgnList = null; //水面区域集合 （RECornerRgnInfo 类型）
        }
    }
    ExtModule.REWaterInfo = REWaterInfo;

    class RECornerRgnInfo {
        constructor() {
            this.pointList = []; //顶点集合
            this.indexList = []; //三角网顶点索引值集合，（根据索引值构面，空数组为引擎自动构面）
        }
    }
    ExtModule.RECornerRgnInfo = RECornerRgnInfo;

    class REWaterAttrInfo {
        constructor() {
            this.waterClr = new REColor(61, 158, 135, 255); //水面颜色
            this.blendDist = 1; //混合系数，值越大边缘混合效果越强  取值范围 0-1
            this.visible = true; //是否可见
            this.expandDist = 0.0; //表示水面区域的边界扩充距离
            this.depthBias = 0.0; //表示水面的深度偏移
            this.visDist = 200000.0; //表示水面的最远可视距离
        }
    }
    ExtModule.REWaterAttrInfo = REWaterAttrInfo;

    // MARK 加载
    /**
     * 创建水域对象
     * @param {REWaterInfo} waterInfoList //水面数据集合
     */
    Module.Water.setData = function (waterInfoList) {
        if (!checkTypeLog(waterInfoList, 'waterInfoList', RE_Enum.RE_Check_Array)) return;
        // if (!waterInfoList.length > 0) {
        //     logErr("waterInfoList 不能为空");
        //     return;
        // }

        let _vector_waterRgn = new Module.RE_Vector_WaterRgnInfo();
        for (let i = 0; i < waterInfoList.length; i++) {
            let obj = waterInfoList[i];
            if (isEmptyLog(obj.waterName, 'waterName')) return false;
            if (isEmptyLog(obj.rgnList, 'rgnList')) return false;

            let _vector_vector_m_arrCorners = new Module.RE_Vector_Vector_dvec3();
            let _vector_vector_m_arrIndices = new Module.RE_Vector_Vector_u32();
            const hasIndexRgnList = obj.rgnList.filter((item) => !isEmpty(item.indexList) && item.indexList.length > 0);
            const notHasIndexRgnList = obj.rgnList.filter((item) => isEmpty(item.indexList) || !item.indexList.length);

            hasIndexRgnList.forEach((rgn) => {
                let _vector_m_arrCorner = new Module.RE_Vector_dvec3();
                rgn.pointList.forEach((corner) => {
                    _vector_m_arrCorner.push_back(corner);
                });
                _vector_vector_m_arrCorners.push_back(_vector_m_arrCorner);

                let _vector_m_arrIndice = new Module.RE_Vector_u32();
                rgn.indexList.forEach((index) => {
                    _vector_m_arrIndice.push_back(index);
                });
                _vector_vector_m_arrIndices.push_back(_vector_m_arrIndice);
            });

            notHasIndexRgnList.forEach((rgn) => {
                let _vector_m_arrCorner = new Module.RE_Vector_dvec3();
                rgn.pointList.forEach((corner) => {
                    _vector_m_arrCorner.push_back(corner);
                });
                _vector_vector_m_arrCorners.push_back(_vector_m_arrCorner);
            });

            let waterT = {
                m_strName: obj.waterName,
                m_uClr: clrToU32(obj.waterClr),
                m_fBlendDist: isEmpty(obj.blendDist) ? 1 : obj.blendDist,
                m_bVisible: isEmpty(obj.visible) ? true : obj.visible,
                m_fExpandDist: isEmpty(obj.expandDist) ? 0.0 : obj.expandDist,
                m_fDepthBias: isEmpty(obj.depthBias) ? 0.0 : obj.depthBias,
                m_fVisDist: isEmpty(obj.visDist) ? 200000.0 : obj.visDist,
                m_arrCorners: _vector_vector_m_arrCorners,
                m_arrIndices: _vector_vector_m_arrIndices,
                m_bShowShp: false,
            };
            _vector_waterRgn.push_back(waterT);
        }
        Module.RealBIMWeb.SetWater(_vector_waterRgn);
    };

    /**
     * 获取当前场景中水面对象集合
     * @param {Array} waterNameList //水面名称标识集合
     */
    Module.Water.getData = function (waterNameList) {
        let _vector_water_name = new Module.RE_Vector_WStr();
        waterNameList.forEach((element) => {
            _vector_water_name.push_back(element);
        });

        const _vector_waterRgnInfo = Module.RealBIMWeb.GetWater(_vector_water_name);
        let waterInfoList = [];
        for (let i = 0; i < _vector_waterRgnInfo.size(); i++) {
            const _cWaterRgn = _vector_waterRgnInfo.get(i);

            let _rgn_list = [];
            let _rgn_count = _cWaterRgn.m_arrCorners.size();
            const successData = _cWaterRgn.m_arrCorners.size() === _cWaterRgn.m_arrIndices.size(); //构面成功必然会一对数据
            for (let j = 0; j < _rgn_count; j++) {
                const _arrCornerRgn = _cWaterRgn.m_arrCorners.get(j);

                let cornerRgnInfo = new Module.RECornerRgnInfo();
                for (let k = 0; k < _arrCornerRgn.size(); k++) {
                    const _cCorner = _arrCornerRgn.get(k);
                    cornerRgnInfo.pointList.push(_cCorner);
                }

                if (successData) {
                    const _arrIndexRgn = _cWaterRgn.m_arrIndices.get(j);
                    for (let k = 0; k < _arrIndexRgn.size(); k++) {
                        const _uIndex = _arrIndexRgn.get(k);
                        cornerRgnInfo.indexList.push(_uIndex);
                    }
                }
                _rgn_list.push(cornerRgnInfo);
            }

            let waterInfo = new Module.REWaterInfo();
            waterInfo.waterName = _cWaterRgn.m_strName;
            waterInfo.waterClr = clrU32ToClr(_cWaterRgn.m_uClr);
            waterInfo.blendDist = _cWaterRgn.m_fBlendDist;
            waterInfo.visible = _cWaterRgn.m_bVisible;
            waterInfo.expandDist = _cWaterRgn.m_fExpandDist;
            waterInfo.depthBias = _cWaterRgn.m_fDepthBias;
            waterInfo.visDist = _cWaterRgn.m_fVisDist;
            waterInfo.rgnList = _rgn_list;
            waterInfoList.push(waterInfo);
        }

        return waterInfoList;
    };

    /**
     * 删除指定水面
     * @param {Array} waterNameList //水面名称集合
     */
    Module.Water.delData = function (waterNameList) {
        if (!checkTypeLog(waterNameList, 'waterNameList', RE_Enum.RE_Check_Array)) return;
        var _vector_water_name = new Module.RE_Vector_WStr();
        waterNameList.forEach((element) => {
            _vector_water_name.push_back(element);
        });
        return Module.RealBIMWeb.DelWater(_vector_water_name);
    };

    /**
     * 获取所有水面对象的名称
     */
    Module.Water.getAllWaterName = function () {
        var _vector = Module.RealBIMWeb.GetAllWaterName();
        var waterIDs = [];
        for (let i = 0; i < _vector.size(); i++) {
            waterIDs.push(_vector.get(i));
        }
        return waterIDs;
    };

    // MARK 编辑
    /**
     * 进入水面编辑状态
     */
    Module.Water.startEditState = function () {
        return Module.RealBIMWeb.BeginWaterEdit();
    };

    /**
     * 退出水面编辑状态
     */
    Module.Water.endEditState = function () {
        return Module.RealBIMWeb.EndWaterEdit();
    };

    /**
     * 进入水面添加状态
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.startAddWaterState = function (waterName) {
        return Module.RealBIMWeb.BeginAddWater(waterName);
    };

    /**
     * 退出水面添加状态
     */
    Module.Water.endAddWaterState = function () {
        return Module.RealBIMWeb.EndAddWater();
    };

    /**
     * 获取当前水面的名称
     */
    Module.Water.getCurWaterName = function () {
        return Module.RealBIMWeb.GetCurWaterName();
    };

    // MARK 渲染设置
    /**
     * 设置指定水面显示状态  注：要在进入水面编辑状态之后有效, 只能改变当前已有的水面对象
     * @param {Array} waterNameList //水面标识集合，空数组代表所有
     * @param {Number} showState //显示状态（默认几何矢量状态），0：显示几何矢量  1：显示渲染效果
     */
    Module.Water.setShowState = function (waterNameList, showState) {
        if (!checkTypeLog(waterNameList, 'waterNameList', RE_Enum.RE_Check_Array)) return;
        var _vector_water_name = new Module.RE_Vector_WStr();
        waterNameList.forEach((element) => {
            _vector_water_name.push_back(element);
        });
        let _showState = isEmpty(showState) ? true : showState == 1 ? false : true;
        return Module.RealBIMWeb.SetWaterShowState(_vector_water_name, _showState);
    };

    /**
     * 获取指定水面状态的所有标识集合 注：要在进入水面编辑状态之后有效
     * @param {Number} showState //显示状态（默认几何矢量状态），0：显示几何矢量  1：显示渲染效果
     */
    Module.Water.getIdsByShowState = function (showState) {
        let _showState = isEmpty(showState) ? true : showState == 1 ? false : true;
        const _vector_water_name = Module.RealBIMWeb.GetWaterIDByShowState(_showState);
        let _waterNameList = [];
        for (let i = 0; i < _vector_water_name.size(); i++) {
            _waterNameList.push(_vector_water_name.get(i));
        }
        return _waterNameList;
    };

    /**
     * 获取指定水面对象的可见性
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getVisible = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.GetWaterVisible(waterName);
    };

    /**
     * 设置指定水面对象的可见性
     * @param {String} waterName //水面唯一标识
     * @param {Boolean} visible //是否可见
     */
    Module.Water.setVisible = function (waterName, visible) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.SetWaterVisible(waterName, visible);
    };

    /**
     * 获取水面颜色
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getClr = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;

        let _uClr = Module.RealBIMWeb.GetWaterColor(waterName);
        return clrU32ToClr(_uClr);
    };

    /**
     * 设置水面颜色
     * @param {String} waterName //水面唯一标识
     * @param {REColor} waterClr //水面颜色 （REColor 类型）
     */
    Module.Water.setClr = function (waterName, waterClr) {
        if (isEmptyLog(waterName, 'waterName')) return;
        if (isEmptyLog(waterClr, 'waterClr')) return;
        let _uClr = clrToU32(waterClr);

        return Module.RealBIMWeb.SetWaterColor(waterName, _uClr);
    };

    /**
     * 获取水面跟模型混合系数
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getBlendDist = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.GetWaterBlendDist(waterName);
    };

    /**
     * 设置水面跟模型混合系数
     * @param {String} waterName //水面唯一标识
     * @param {Number} blendDist //混合系数，值越大边缘混合效果越强  取值范围 0-1
     */
    Module.Water.setBlendDist = function (waterName, blendDist) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.SetWaterBlendDist(waterName, blendDist);
    };

    /**
     * 获取水体扩展距离
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getExpandDist = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.GetWaterExpandDist(waterName);
    };

    /**
     * 设置水体扩展距离
     * @param {String} waterName //水面唯一标识
     * @param {Number} expandDist //表示水面区域的边界扩充距离
     */
    Module.Water.setExpandDist = function (waterName, expandDist) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.SetWaterExpandDist(waterName, expandDist);
    };

    /**
     * 获取水体的深度偏移
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getDepthBias = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.GetWaterDepthBias(waterName);
    };

    /**
     * 设置水体的深度偏移
     * @param {String} waterName //水面唯一标识
     * @param {Number} depthBias //表示水面的深度偏移， 取值范围 【-0.0001，0.0001】
     */
    Module.Water.setDepthBias = function (waterName, depthBias) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.SetWaterDepthBias(waterName, depthBias);
    };

    /**
     * 获取水体的最远可视距离
     * @param {String} waterName //水面唯一标识
     */
    Module.Water.getVisDist = function (waterName) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.GetWaterVisDist(waterName);
    };

    /**
     * 设置水体的最远可视距离
     * @param {String} waterName //水面唯一标识
     * @param {Number} visDist //表示水面的最远可视距离
     */
    Module.Water.setVisDist = function (waterName, visDist) {
        if (isEmptyLog(waterName, 'waterName')) return;
        return Module.RealBIMWeb.SetWaterVisDist(waterName, visDist);
    };

    /**
     * 设置水面默认属性
     * @param {REWaterAttrInfo} attrInfo //水面属性信息 （REWaterAttrInfo 类型）
     */
    Module.Water.setDefaultAttr = function (attrInfo) {
        if (isEmptyLog(attrInfo, 'attrInfo')) return;
        let _uClr = isEmpty(attrInfo.waterClr) ? clrToU32(new Module.REColor(61, 158, 135, 255)) : clrToU32(attrInfo.waterClr);
        let _fBlendDist = isEmpty(attrInfo.blendDist) ? 1.0 : attrInfo.blendDist;
        let _bVisible = isEmpty(attrInfo.visible) ? true : attrInfo.visible;
        let _expandDist = isEmpty(attrInfo.expandDist) ? 10.0 : attrInfo.expandDist;
        let _depthBias = isEmpty(attrInfo.depthBias) ? 0.0 : attrInfo.depthBias;
        let _visDist = isEmpty(attrInfo.visDist) ? 200000.0 : attrInfo.visDist;
        Module.RealBIMWeb.SetDefaultWaterAttr(_uClr, _fBlendDist, _bVisible, _expandDist, _depthBias, _visDist);
    };

    /**
     * 获取错误绘制的水面区域的标识集合
     */
    Module.Water.getErrorDrawWaterIds = function () {
        const _vector_water_name = Module.RealBIMWeb.GetErrorWaterName();
        let _waterNameList = [];
        for (let i = 0; i < _vector_water_name.size(); i++) {
            _waterNameList.push(_vector_water_name.get(i));
        }
        return _waterNameList;
    };

    // MARK 相机
    /**
     * 根据水面名称定位到水面
     * @param {Array} waterNameList //水面名称
     */
    Module.Water.setCamToData = function (waterNameList) {
        if (!checkTypeLog(waterNameList, 'waterNameList', RE_Enum.RE_Check_Array)) return;
        var _vector_water_name = new Module.RE_Vector_WStr();
        waterNameList.forEach((element) => {
            _vector_water_name.push_back(element);
        });
        return Module.RealBIMWeb.LocateToWater(_vector_water_name);
    };

    // MOD-- 有限元（FEM） <---
    Module.FEM = typeof Module.FEM !== 'undefined' ? Module.FEM : {}; //增加 FEM 模块

    /**
     * 加载FEM文件 (回调监听 RealBIMLoadFEM 用于接收加载文件是否成功)
     * @param {String} feId //有限元数据唯一标识
     * @param {String} filePath //FEM文件路径
     */
    Module.FEM.loadData = function (feId, filePath) {
        if (isEmptyLog(feId, 'feId')) return;
        if (isEmptyLog(filePath, 'filePath')) return;
        Module.RealBIMWeb.AddFEMData(feId, filePath);
    };

    /**
     * 移除指定标识的FEM数据
     * @param {String} feId //有限元数据唯一标识
     */
    Module.FEM.removeData = function (feId) {
        if (isEmptyLog(feId, 'feId')) return;
        return Module.RealBIMWeb.RemoveFEMData(feId);
    };

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
    };

    /**
     * 设置用于展示标量信息的属性字段
     * @param {String} feId //有限元数据唯一标识
     * @param {String} scarlarParamName //标量属性字段名称
     */
    Module.FEM.setActiveScalar = function (feId, scarlarParamName) {
        if (isEmptyLog(feId, 'feId')) return;
        if (isEmptyLog(scarlarParamName, 'scarlarParamName')) return;
        return Module.RealBIMWeb.SetActiveScalars(feId, scarlarParamName);
    };

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
    };

    // MOD-- 轴网（AxisGrid） <---
    Module.AxisGrid = typeof Module.AxisGrid !== 'undefined' ? Module.AxisGrid : {}; //增加 AxisGrid 模块

    class REAxisGridInfo {
        constructor() {
            this.guid = null; //轴线的唯一标识
            this.name = null; //轴线的名称
            this.lineClr = null; //轴线的颜色
            this.pos = null; //轴线两个顶点坐标
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
    };

    //获取当前添加的所有轴网组名称
    Module.AxisGrid.getAllGroupNames = function () {
        var allgirdname = Module.RealBIMWeb.GetAllGridGroupName();
        var nameArr = [];
        for (var i = 0; i < allgirdname.size(); ++i) {
            nameArr.push(allgirdname.get(i));
        }
        return nameArr;
    };

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
    };

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
    };

    /**
     * 删除所有轴网数据
     */
    Module.AxisGrid.delAllData = function () {
        var tempGridsName = new Module.RE_Vector_WStr();
        Module.RealBIMWeb.DelGridData(tempGridsName);
    };

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
    };

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
    };

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
    };

    /**
     * 设置轴网是否允许被模型遮挡
     * @param {Boolean} enable //是否允许遮挡
     */
    Module.AxisGrid.setOverlap = function (enable) {
        Module.RealBIMWeb.SetGridContactSce(enable);
    };

    /**
     * 获取当前设置的轴网是否允许被模型遮挡状态
     */
    Module.AxisGrid.getOverlap = function () {
        return Module.RealBIMWeb.GetGridContactSce();
    };

    // MOD-- 标高（Elevation） <---
    Module.Elevation = typeof Module.Elevation !== 'undefined' ? Module.Elevation : {}; //增加 Elevation 模块

    class REElevationInfo {
        constructor() {
            this.guid = null; //标高的唯一标识
            this.name = null; //标高的名称
            this.lineClr = null; //标高线颜色
            this.height = null; //高度
            this.topHeight = null; //顶高
            this.bottomHeight = null; //底高
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
    };

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
    };

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
    };

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
    };

    /**
     * 删除所有标高数据
     */
    Module.Elevation.delAllData = function () {
        var tempLevelName = new Module.RE_Vector_WStr();
        Module.RealBIMWeb.DelLevelData(tempLevelName);
    };

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
    };

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
    };

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
    };

    /**
     * 根据标高的guid获取三个高度值
     * @param {String} groupName //组名称，该组标高的唯一标识
     * @param {String} guid //标高的唯一标识
     */
    Module.Elevation.getData = function (groupName, guid) {
        return Module.RealBIMWeb.GetLevelHeightInfo(groupName, guid);
    };

    /**
     * 设置标高是否允许被模型遮挡
     * @param {Boolean} enable //是否允许遮挡
     */
    Module.Elevation.setOverlap = function (enable) {
        Module.RealBIMWeb.SetLevelContactSce(enable);
    };

    /**
     * 获取当前设置的标高是否允许被模型遮挡状态
     */
    Module.Elevation.getOverlap = function () {
        return Module.RealBIMWeb.GetLevelContactSce();
    };

    // MOD-- 动画（Animation） <---
    Module.Animation = typeof Module.Animation !== 'undefined' ? Module.Animation : {}; //增加 Animation 模块

    // MARK 矢量动画
    class REAnimWallInfo {
        constructor() {
            this.groupName = null; //	动态墙组名称
            this.name = null; //	动态墙名称
            this.potList = null; //	动态墙路径顶点坐标及高度，(x, y, z)表示顶点坐标，w表示高度
            this.texPath = null; //	动态墙纹理路径
            this.normalDir = null; //	纹理动画方向是否为法线方向，true为发现方向，false为切线方向
            this.isClose = null; //	动态墙是否强制闭合，默认闭合
        }
    }
    ExtModule.REAnimWallInfo = REAnimWallInfo;

    /**
     * 创建一个动态墙
     * @param {REAnimWallInfo} animWallInfo //动态墙信息
     */
    Module.Animation.addAnimWall = function (animWallInfo) {
        if (isEmptyLog(animWallInfo, 'animWallInfo')) return;
        var temparr = new Module.RE_Vector_dvec4();
        for (var i = 0; i < animWallInfo.potList.length; ++i) {
            temparr.push_back(animWallInfo.potList[i]);
        }
        var _bClose = true;
        if (!isEmpty(animWallInfo.isClose)) {
            _bClose = animWallInfo.isClose;
        }
        return Module.RealBIMWeb.AddAnimationWall(
            animWallInfo.groupName,
            animWallInfo.name,
            temparr,
            animWallInfo.texPath,
            animWallInfo.normalDir,
            _bClose
        );
    };

    class REAnimPlaneInfo {
        constructor() {
            this.groupName = null; //不规则平面组名称
            this.name = null; //不规则平面名称
            this.potList = null; //不规则平面路径顶点坐标 (x,y,z)表示位置 w表示高度
            this.texPath = null; //纹理路径
        }
    }
    ExtModule.REAnimPlaneInfo = REAnimPlaneInfo;

    /**
     * 创建一个扫描面
     * @param {REAnimPlaneInfo} animPlaneInfo //扫描面信息
     */
    Module.Animation.addAnimPlane = function (animPlaneInfo) {
        if (isEmptyLog(animPlaneInfo, 'animPlaneInfo')) return;
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animPlaneInfo.potList.length; ++i) {
            temparr.push_back(animPlaneInfo.potList[i]);
        }
        return Module.RealBIMWeb.AddAnimationPlane(animPlaneInfo.groupName, animPlaneInfo.name, temparr, animPlaneInfo.texPath);
    };

    class REAnimSphereInfo {
        constructor() {
            this.groupName = null; //扫描球组名称
            this.nameList = null; //扫描球名称数组
            this.potCenterList = null; //扫描球中心点坐标数组
            this.radius = null; //当前批次扫描球半径
            this.sphere = null; //是否为圆球，true表示圆球，false表示半球
            this.texPath = null; //纹理路径
        }
    }
    ExtModule.REAnimSphereInfo = REAnimSphereInfo;

    /**
     * /创建一组半球体动画
     * @param {REAnimSphereInfo} animSphereInfo //球体信息
     */
    Module.Animation.addAnimSpheres = function (animSphereInfo) {
        if (isEmptyLog(animSphereInfo, 'animSphereInfo')) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animSphereInfo.nameList.length; ++i) {
            temparr0.push_back(animSphereInfo.nameList[i]);
        }
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animSphereInfo.potCenterList.length; ++i) {
            temparr.push_back(animSphereInfo.potCenterList[i]);
        }
        var _isSphere = true;
        if (!isEmpty(animSphereInfo.sphere)) _isSphere = animSphereInfo.sphere;
        return Module.RealBIMWeb.AddAnimationSpheres(
            animSphereInfo.groupName,
            temparr0,
            temparr,
            animSphereInfo.radius,
            _isSphere,
            animSphereInfo.texPath
        );
    };

    class REAnimPolygonInfo {
        constructor() {
            this.groupName = null; //扫描平面组名称
            this.nameList = null; //扫描平面名称数组
            this.potCenterList = null; //扫描平面中心点坐标数组
            this.radius = null; //当前批次扫描平面半径
            this.radarScan = null; //扫描效果是否为雷达扫描，true为雷达扫描，false为扩散扫描
            this.isRing = null; //是否为圆形，true表示圆形，此时边数为默认值，false表示多边形
            this.edgeNum = null; //多边形的边数
            this.texPath = null; //纹理路径
        }
    }
    ExtModule.REAnimPolygonInfo = REAnimPolygonInfo;

    /**
     * 创建一组规则平面多边形动画
     * @param {REAnimPolygonInfo} animPolygonInfo //多边形信息
     */
    Module.Animation.addAnimPolygons = function (animPolygonInfo) {
        if (isEmptyLog(animPolygonInfo, 'animPolygonInfo')) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animPolygonInfo.nameList.length; ++i) {
            temparr0.push_back(animPolygonInfo.nameList[i]);
        }
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animPolygonInfo.potCenterList.length; ++i) {
            temparr.push_back(animPolygonInfo.potCenterList[i]);
        }
        var _isRing = false;
        if (!isEmpty(animPolygonInfo.isRing)) _isRing = animPolygonInfo.isRing;
        var _radarScan = false;
        if (!isEmpty(animPolygonInfo.radarScan)) _radarScan = animPolygonInfo.radarScan;
        var _edgeNum = 3;
        if (!isEmpty(animPolygonInfo.edgeNum)) _edgeNum = animPolygonInfo.edgeNum;
        return Module.RealBIMWeb.AddAnimationPolygons(
            animPolygonInfo.groupName,
            temparr0,
            temparr,
            animPolygonInfo.radius,
            animPolygonInfo.texPath,
            _radarScan,
            _isRing,
            _edgeNum
        );
    };

    class REAnimPolyWallInfo {
        constructor() {
            this.groupName = null; //扫描多边形动态墙组名称
            this.nameList = null; //扫描多边形动态墙名称数组
            this.potCenterList = null; //扫描多边形动态墙中心点坐标数组
            this.radius = null; //当前批次扫描多边形动态墙半径
            this.isRing = null; //是否为圆形，true表示圆形，此时边数为默认值，false表示多边形
            this.edgeNum = null; //多边形的边数
            this.height = null; //高度
            this.texPath = null; //纹理路径
            this.normalDir = null; //贴图是否沿法线方向，true为法线方向，false为切线方向
        }
    }
    ExtModule.REAnimPolyWallInfo = REAnimPolyWallInfo;

    /**
     * 创建一组规则多边形动态墙
     * @param {REAnimPolyWallInfo} animPolyWallInfo //多边形动态墙信息
     */
    Module.Animation.addAnimPolygonWalls = function (animPolyWallInfo) {
        if (isEmptyLog(animPolyWallInfo, 'animPolyWallInfo')) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animPolyWallInfo.nameList.length; ++i) {
            temparr0.push_back(animPolyWallInfo.nameList[i]);
        }
        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animPolyWallInfo.potCenterList.length; ++i) {
            temparr.push_back(animPolyWallInfo.potCenterList[i]);
        }
        var _isRing = false;
        if (!isEmpty(animPolyWallInfo.isRing)) _isRing = animPolyWallInfo.isRing;
        var _radarScan = false;
        if (!isEmpty(animPolyWallInfo.radarScan)) _radarScan = animPolyWallInfo.radarScan;
        var _edgeNum = 4;
        if (!isEmpty(animPolyWallInfo.edgeNum)) _edgeNum = animPolyWallInfo.edgeNum;
        var _height = 0;
        if (!isEmpty(animPolyWallInfo.height)) _height = animPolyWallInfo.height;
        return Module.RealBIMWeb.AddAnimationPolygonWalls(
            animPolyWallInfo.groupName,
            temparr0,
            temparr,
            animPolyWallInfo.radius,
            _height,
            animPolyWallInfo.texPath,
            _isRing,
            _edgeNum,
            animPolyWallInfo.normalDir
        );
    };

    class REAnimAreaBufferInfo {
        constructor() {
            this.groupName = null; //路径平面组名称
            this.name = null; //路径平面名称
            this.potList = null; //中心线路径顶点坐标集合
            this.texPath = null; //纹理路径
            this.width = null; //平面宽度
            this.policy = 0; //拐点执行方案 0：贝塞尔曲线  1：线性折线
            this.projSce = false; //是否投影地形\倾斜摄影
        }
    }
    ExtModule.REAnimAreaBufferInfo = REAnimAreaBufferInfo;

    /**
     * 创建一个规则的路径平面
     * @param {REAnimAreaBufferInfo} animAreaBufferInfo //路径平面信息（REAnimAreaBufferInfo类型）
     */
    Module.Animation.addAnimAreaBuffer = function (animAreaBufferInfo) {
        if (isEmptyLog(animAreaBufferInfo, 'animAreaBufferInfo')) return;

        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animAreaBufferInfo.potList.length; ++i) {
            temparr.push_back(animAreaBufferInfo.potList[i]);
        }
        var _texPath = isEmpty(animAreaBufferInfo.texPath) ? '' : animAreaBufferInfo.texPath;
        var _width = isEmpty(animAreaBufferInfo.width) ? 0 : animAreaBufferInfo.width;
        var _policy = isEmpty(animAreaBufferInfo.policy) ? 0 : animAreaBufferInfo.policy;
        var _projSce = isEmpty(animAreaBufferInfo.projSce) ? 0 : animAreaBufferInfo.projSce;
        return Module.RealBIMWeb.AddAnimationAreaBuffer(
            animAreaBufferInfo.groupName,
            animAreaBufferInfo.name,
            temparr,
            _texPath,
            _width,
            _policy,
            _projSce
        );
    };

    class REAnimCylinderInfo {
        constructor() {
            this.groupName = null; //路径管线组名称
            this.name = null; //路径管线名称
            this.potList = null; //中心线路径顶点坐标集合
            this.texPath = null; //纹理路径
            this.radius = null; //管线半径
        }
    }
    ExtModule.REAnimCylinderInfo = REAnimCylinderInfo;

    /**
     * 创建一个规则的路径管线
     * @param {REAnimCylinderInfo} animCylinderInfo //路径平面信息（REAnimCylinderInfo类型）
     */
    Module.Animation.addAnimCylinder = function (animCylinderInfo) {
        if (isEmptyLog(animCylinderInfo, 'animCylinderInfo')) return;

        var temparr = new Module.RE_Vector_dvec3();
        for (var i = 0; i < animCylinderInfo.potList.length; ++i) {
            temparr.push_back(animCylinderInfo.potList[i]);
        }
        var _texPath = isEmpty(animCylinderInfo.texPath) ? '' : animCylinderInfo.texPath;
        var _radius = isEmpty(animCylinderInfo.radius) ? 0 : animCylinderInfo.radius;
        var _arrWidth = new Module.RE_Vector_dvec3();
        return Module.RealBIMWeb.AddAnimationCylinder(
            animCylinderInfo.groupName,
            animCylinderInfo.name,
            temparr,
            _texPath,
            true,
            _radius,
            18,
            _arrWidth
        );
    };

    class REShpAnimStyle {
        constructor() {
            this.groupName = null; //矢量动画组名称，此参数不能为空
            this.nameList = []; //矢量动画名称集合，如果nameList为空,则设置该组下所有的矢量动画信息；
            this.animClr = new REColor(255, 255, 255, 255); //期望的矢量动画颜色（REColor 类型）
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
        if (isEmptyLog(animStyleInfo.groupName, 'groupName')) return;
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < animStyleInfo.nameList.length; ++i) {
            temparr0.push_back(animStyleInfo.nameList[i]);
        }
        var tempClr = clrToU32_W_WBGR(animStyleInfo.animClr, isEmpty(animStyleInfo.clrWeight) ? 255 : animStyleInfo.clrWeight);
        // 将透明度权重的值放在了透明度的位置上，透明度默认取值0，用权重调节
        var _alpha = 0; //透明度为0，混合透明度0的强度控制，强度越大越透明度越为0，反之透明度的效果越小
        var _alphaWeight = 255 - (isEmpty(animStyleInfo.animClr) || isEmpty(animStyleInfo.animClr.alpha) ? 255 : animStyleInfo.animClr.alpha);
        var combinedAlpha = (_alphaWeight << 8) | _alpha;
        return Module.RealBIMWeb.SetShapeAnimStyle(animStyleInfo.groupName, temparr0, tempClr, animStyleInfo.scaleAndOffset, combinedAlpha);
    };

    /**
     * 删除矢量动画
     * @param {String} groupName //矢量动画组名称，为空字符串删除所有
     * @param {Array} nameList //矢量动画名称集合，如果nameList为空,则删除该组下所有的矢量动画信息；
     */
    Module.Animation.delShpAnimation = function (groupName, nameList) {
        var temparr0 = new Module.RE_Vector_WStr();
        for (var i = 0; i < nameList.length; ++i) {
            temparr0.push_back(nameList[i]);
        }
        return Module.RealBIMWeb.DelShpAnimation(groupName, temparr0);
    };

    // MOD-- 剖切（Clip） <---
    Module.Clip = typeof Module.Clip !== 'undefined' ? Module.Clip : {}; //增加 Clip 模块

    // MARK 通用
    /**
     * 获取剖切完成后的可见元素ID集合
     * @param {Boolean} deleteCrossPart //是否去除与包围体相交叉部分的构件，只保留包含在包围体内的；false：表示包含交叉；true：表示去除交叉
     */
    Module.Clip.getSurplusID = function (deleteCrossPart) {
        var _deleteCrossPart = false;
        if (!isEmpty()) _deleteCrossPart = deleteCrossPart;
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
                    curprojinfo['dataSetId'] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
                    curprojinfo['elemIdList'] = curprojelemarr;
                    projidarr.push(curprojinfo);
                    curprojelemarr = [];
                }
                curprojid = tempselids[i + 1];
                curprojelemarr.push(tempselids[i]);
            }
        }
        if (curprojelemarr.length > 0) {
            var curprojinfo = {};
            curprojinfo['dataSetId'] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
            curprojinfo['elemIdList'] = curprojelemarr;
            projidarr.push(curprojinfo);
            curprojelemarr = [];
        }
        return projidarr;
    };

    class REClipInfo {
        constructor() {
            this.scale = null; //缩放
            this.rotate = null; //旋转
            this.offset = null; //平移
            this.isSingleSurfaceClip = false; //是否是单面剖切
            this.pot1 = null; //三角面剖切顶点1
            this.pot2 = null; //三角面剖切顶点2
            this.pot3 = null; //三角面剖切顶点3
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
    };

    /**
     * 设置剖面信息，设置后进入剖切编辑状态
     * @param {REClipInfo} clipInfo //剖面信息
     */
    Module.Clip.setDataIntoClip = function (clipInfo) {
        if (isEmptyLog(clipInfo, 'clipInfo')) return;
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
    };

    /**
     * 设置剖面信息，设置后进入剖切完成状态
     * @param {REClipInfo} clipInfo //剖面信息
     */
    Module.Clip.setData = function (clipInfo) {
        if (isEmptyLog(clipInfo, 'clipInfo')) return;
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
    };

    /**
     * 退出剖切状态
     */
    Module.Clip.endClip = function () {
        Module.RealBIMWeb.EndSceneClipping();
    };

    /**
     * 判断是否处于剖切浏览模式
     */
    Module.Clip.getClipBrowseState = function () {
        return Module.RealBIMWeb.IsSceneClippingBrowsing();
    };

    /**
     * 设置反向显示剖切区域
     */
    Module.Clip.setReverseShowClipRgn = function () {
        Module.RealBIMWeb.ReverseShowClipRgn();
    };

    /**
     * 设置当前剖切状态为浏览模式
     */
    Module.Clip.setClipBrowseStyle = function () {
        Module.RealBIMWeb.ExecuteSceneClip(false);
    };

    /**
     * 设置当前剖切状态为编辑模式
     */
    Module.Clip.setClipEditStyle = function () {
        Module.RealBIMWeb.ExecuteSceneClip(true);
    };

    /**
     * 重置剖切操作
     */
    Module.Clip.resetClip = function () {
        if (!Module.RealBIMWeb.IsClipObjectValid()) return; //不在剖切模式下
        if (Module.RealBIMWeb.IsSinglePlaneClipping()) {
            // 是否是单面剖切
            Module.RealBIMWeb.ResetClipping(true);
        } else {
            Module.RealBIMWeb.ResetClipping(false);
        }
    };

    /**
     * 获取是否是在剖切模式下
     */
    Module.Clip.getClipState = function () {
        return Module.RealBIMWeb.IsClipObjectValid();
    };

    /**
     * 获取当前处于剖切模式的操作状态（单面剖切、体剖切）
     */
    Module.Clip.getClipOptState = function () {
        if (!Module.RealBIMWeb.IsClipObjectValid()) return 0; //不在剖切模式下
        return Module.RealBIMWeb.IsSinglePlaneClipping() ? 1 : 2;
    };

    // MARK 体剖切

    /**
     * 进入体剖切状态
     * @param {Array} dataList //构件集合（支持多数据集构件集合） [{dataSetId:"",elemIdList:[]}]
     */
    Module.Clip.setBoxClip = function (dataList) {
        if (isEmptyLog(dataList, 'dataList')) return;

        if (!dataList.length) {
            Module.RealBIMWeb.BeginSceneClippingByElemSet(false, 0, 0);
        } else {
            var count = 0;
            for (let i = 0; i < dataList.length; i++) {
                let _obj = dataList[i];
                let _list = _obj['elemIdList'];
                count += _list.length;
            }

            var _moemory = (count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (let i = 0; i < count; i++) {
                let _obj = dataList[i];
                let _list = _obj['elemIdList'];
                let _projid = Module.RealBIMWeb.ConvGolStrID2IntID(_obj['dataSetId']);
                let elemid = _list[i];
                _elemIds.set([elemid, _projid], i * 2);
            }
            Module.RealBIMWeb.BeginSceneClippingByElemSet(false, _elemIds.byteLength, _elemIds.byteOffset);
        }
    };

    /**
     * 进入体剖切状态（数据集模式）
     * @param {Array} dataSetIdList //数据集标识集合,为空数组代表所有数据集
     */
    Module.Clip.setDataSetBoxClip = function (dataSetIdList) {
        if (!checkTypeLog(dataSetIdList, 'dataSetIdList', RE_Enum.RE_Check_Array)) return;

        var _vector_DataSetIds = new Module.RE_Vector_WStr();
        for (let i = 0; i < dataSetIdList.length; i++) {
            _vector_DataSetIds.push_back(dataSetIdList[i]);
        }
        Module.RealBIMWeb.BeginSceneClippingByProjSet(false, _vector_DataSetIds);
    };

    /**
     * 获取体剖切变换模式
     */
    Module.Clip.getBoxClipTransType = function () {
        return Module.RealBIMWeb.GetSceneClippingTransformMode();
    };

    /**
     * 设置体剖切变换模式
     * @param {Number} type //剖切变换模式(默认缩放) 0:位移 1:旋转 2:缩放
     */
    Module.Clip.setBoxClipTransType = function (type) {
        var _type = isEmpty(type) ? 2 : type;
        Module.RealBIMWeb.SetSceneClippingTransformMode(_type);
    };

    /**
     * 根据指定高度进行单双面剖切
     * @param {String} dataSetId //数据集标识
     * @param {Number} topHeight //顶高
     * @param {Number} bottomHeight //底高
     * @param {Boolean} single //是否单侧剖切
     */
    Module.Clip.setClipSpecifyHeight = function (dataSetId, topHeight, bottomHeight, single) {
        return Module.RealBIMWeb.ClipByProj(topHeight, bottomHeight, single, dataSetId);
    };

    /**
     * 设置体剖切盒的面颜色和线颜色
     * @param {REColor} faceClr //面颜色
     * @param {REColor} lineClr //线颜色
     */
    Module.Clip.setClipBoxClr = function (faceClr, lineClr) {
        let _faceClr = isEmpty(faceClr) ? 268435455 : clrToU32(faceClr);
        let _lineClr = isEmpty(lineClr) ? 4293846272 : clrToU32(lineClr);
        Module.RealBIMWeb.SetClipBoxClrInfo(_faceClr, _lineClr);
    };

    /**
     * 获取体剖切盒的面颜色和线颜色
     */
    Module.Clip.getClipBoxClr = function () {
        let _vector_Clr = Module.RealBIMWeb.GetClipBoxClrInfo();
        let clr_list = [];
        if (_vector_Clr.size() > 0) {
            console.log(_vector_Clr.get(0));
            console.log(_vector_Clr.get(1));
            clr_list.push(clrU32ToClr(_vector_Clr.get(0)));
            clr_list.push(clrU32ToClr(_vector_Clr.get(1)));
        }
        return clr_list;
    };

    /**
     * 设置剖切盒鼠标悬停时的面颜色信息
     * @param {REColor} faceClr //面颜色
     * @param {Number} clrWeight //面颜色权重
     * @param {Number} alphaWeight //面透明度权重
     */
    Module.Clip.setClipBoxHoverClrInfo = function (faceClr, clrWeight, alphaWeight) {
        if (isEmptyLog(faceClr, 'faceClr')) return;
        const _clrWeight = isEmpty(clrWeight) ? 255 : clrWeight;
        const _alphaWeight = isEmpty(alphaWeight) ? 255 : alphaWeight;
        const _uHoverFaceClr = clrToU32_W_WBGR(faceClr, _clrWeight);
        const _uHoverFaceAlpha = alphaToU32_W_WA(faceClr.alpha, _alphaWeight);
        Module.RealBIMWeb.SetClipBoxHoverClrInfo(_uHoverFaceClr, _uHoverFaceAlpha);
    };

    /**
     * 获取剖切盒鼠标悬停时的面颜色信息
     */
    Module.Clip.getClipBoxHoverClrInfo = function () {
        const cInfo = Module.RealBIMWeb.GetClipBoxHoverClrInfo();

        const obj_w_rbg = clrU32ToObj_W_RBG(cInfo.m_u32Value1);
        const obj_w_a = clrU32ToObj_W_A(cInfo.m_u16Value1);

        return {
            faceClr: new REColor(obj_w_rbg.int_R, obj_w_rbg.int_G, obj_w_rbg.int_B, obj_w_a.int_A),
            clrWeight: obj_w_rbg.int_W,
            alphaWeight: obj_w_a.int_W,
        };
    };

    // MARK 单面剖切
    /**
     * 进入单面剖切状态
     */
    Module.Clip.setSingleClip = function () {
        Module.RealBIMWeb.BeginSceneClippingByElemSet(true, 0, 0);
    };

    /**
     * 获取单面剖切的创建方式
     */
    Module.Clip.getSingleClipCreateType = function () {
        return Module.RealBIMWeb.GetClipPlaneCreateMode();
    };

    /**
     * 设置单面剖切的创建方式（三点构面、鼠标拾取）
     * @param {Number} type //创建模式(默认三点构面) 0:三点构面 1:鼠标拾取
     */
    Module.Clip.setSingleClipCreateType = function (type) {
        var _type = isEmpty(type) ? 0 : type;
        Module.RealBIMWeb.SetClipPlaneCreateMode(_type);
    };

    /**
     * 设置单面剖切的面颜色和箭头颜色
     * @param {REColor} faceClr //面颜色
     * @param {REColor} arrowClr //箭头颜色
     */
    Module.Clip.setClipPlaneClr = function (faceClr, arrowClr) {
        let _faceClr = isEmpty(faceClr) ? 2147483647 : clrToU32(faceClr);
        let _arrowClr = isEmpty(arrowClr) ? 2147418112 : clrToU32(arrowClr);
        Module.RealBIMWeb.SetClipPlaneClrInfo(_faceClr, _arrowClr);
    };

    /**
     * 获取单面剖切的面颜色和箭头颜色
     */
    Module.Clip.getClipPlaneClr = function () {
        let _vector_Clr = Module.RealBIMWeb.GetClipPlaneClrInfo();
        let clr_list = [];
        if (_vector_Clr.size() > 0) {
            console.log(_vector_Clr.get(0));
            console.log(_vector_Clr.get(1));
            clr_list.push(clrU32ToClr(_vector_Clr.get(0)));
            clr_list.push(clrU32ToClr(_vector_Clr.get(1)));
        }
        return clr_list;
    };

    // MARK 相机
    /**
     * 根据指定方向定位到剖切面并进行缩放
     * @param {RECamDirEm} locType //定位方向信息（RECamDirEm 枚举类型）
     * @param {Number} scale //表示包围盒高度缩放系数
     */
    Module.Clip.setLocateToClipElem = function (locType, scale) {
        if (isEmptyLog(locType, 'locType')) return;
        var _dScale = 1;
        if (!isEmpty(scale)) {
            _dScale = scale;
        }

        var strCamDir = 'top';
        switch (locType) {
            case RECamDirEm.CAM_DIR_FRONT:
                strCamDir = 'front';
                break;
            case RECamDirEm.CAM_DIR_BACK:
                strCamDir = 'back';
                break;
            case RECamDirEm.CAM_DIR_LEFT:
                strCamDir = 'left';
                break;
            case RECamDirEm.CAM_DIR_RIGHT:
                strCamDir = 'right';
                break;
            case RECamDirEm.CAM_DIR_TOP:
                strCamDir = 'top';
                break;
            case RECamDirEm.CAM_DIR_BOTTOM:
                strCamDir = 'bottom';
                break;
            default:
                strCamDir = 'top';
                break;
        }
        return Module.RealBIMWeb.TargetToCilpElem(strCamDir, _dScale);
    };

    /**
     * 定位相机到剖切面
     */
    Module.Clip.setLocateToClipPlane = function () {
        Module.RealBIMWeb.TargetToClipRegion();
    };

    // MARK 组合剖切

    // MOD-- 小地图（MiniMap） <---
    Module.MiniMap = typeof Module.MiniMap !== 'undefined' ? Module.MiniMap : {}; //增加 MiniMap 模块

    // MARK 加载
    /**
     * 加载小地图中的CAD数据（ REMiniMapLoadCAD 事件监听回调 CAD数据添加成功）
     * @param {String} filePath //图纸的资源发布路径
     * @param {RECadUnitEm} unit //CAD单位 RECadUnitEm 枚举值
     * @param {Number} scale //图纸的比例尺信息（默认为1:1）
     */
    Module.MiniMap.loadCAD = function (filePath, unit, scale) {
        if (isEmptyLog(filePath, 'filePath')) return;
        var _CADUnit = isEmpty(unit) ? eval(RECadUnitEm.CAD_UNIT_Meter) : eval(unit);
        var _CADScale = 1.0;
        if (!isEmpty(scale)) {
            _CADScale = scale;
        }
        Module.RealBIMWeb.LoadOverViewCAD(filePath, _CADUnit, _CADScale);
    };

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

        var _a = 1.0;
        if (!isEmpty(alpha)) _a = parseInt(alpha) / 255;
        return Module.RealBIMWeb.LoadOverViewImage(texPath, texSize[0], texSize[1], insertPos, picSize[0], picSize[1], _a);
    };

    /**
     * 调整CAD小地图显示，缩放到当前小地图展示范围
     */
    Module.MiniMap.setShowRangeRefresh = function () {
        return Module.RealBIMWeb.CADOverViewFocusToAll();
    };

    // MARK 渲染设置
    /**
     * 获取小地图的显示状态
     */
    Module.MiniMap.getVisible = function () {
        return Module.RealBIMWeb.GetOverViewShow();
    };

    /**
     * 设置小地图的显示状态
     * @param {Boolean} visible //是否显示
     */
    Module.MiniMap.setVisible = function (visible) {
        if (isEmptyLog(visible, 'visible')) return;
        return Module.RealBIMWeb.SetOverViewShow(visible);
    };

    /**
     * 设置小地图的背景颜色
     * @param {REColor} bgClr //背景颜（REColor 类型）
     */
    Module.MiniMap.setBackClr = function (bgClr) {
        if (isEmptyLog(bgClr, 'bgClr')) return false;
        var _clr = clrToRGBA_List(bgClr);
        Module.RealBIMWeb.SetOverViewBackColor(_clr);
        return true;
    };

    /**
     * 获取小地图的显示区域范围 (小地图显示的实际范围（像素）)
     */
    Module.MiniMap.getRegion = function () {
        return Module.RealBIMWeb.GetOverViewRegion();
    };

    /**
     * 设置小地图的显示区域比例（原点和对焦点相对主界面宽高的百分比）！！！显示范围限制在小地图最大的宽高设置
     * @param {Vec2} scaleOrigin //原点相对于主界面宽高的比例 [0,0]  取值范围0-1
     * @param {Vec2} scaleDiagonal //对角点相对于主界面宽高的比例 [0.3,0.3]  取值范围0-1
     */
    Module.MiniMap.setRegion = function (scaleOrigin, scaleDiagonal) {
        var _Region = scaleOrigin.concat(scaleDiagonal);
        return Module.RealBIMWeb.SetOverViewRegion(_Region);
    };

    /**
     * 获取小地图的最大宽高 (像素值, xy分别表示最大宽度和高度)
     */
    Module.MiniMap.getMaxRegion = function () {
        return Module.RealBIMWeb.GetOverViewMaxRegion();
    };

    /**
     * 设置小地图的最大宽高 (像素值, xy分别表示最大宽度和高度)
     * @param {Vec2} region //xy分别表示最大宽度和高度（像素值）
     */
    Module.MiniMap.setMaxRegion = function (region) {
        return Module.RealBIMWeb.SetOverViewMaxRegion(region);
    };

    /**
     * 获取小地图的最小宽高 (像素值, xy分别表示最小宽度和高度)
     */
    Module.MiniMap.getMinRegion = function () {
        return Module.RealBIMWeb.GetOverViewMinRegion();
    };

    /**
     * 设置小地图的最小宽高 (像素值, xy分别表示最小宽度和高度)
     * @param {Vec2} region //xy分别表示最小宽度和高度（像素值）
     */
    Module.MiniMap.setMinRegion = function (region) {
        return Module.RealBIMWeb.SetOverViewMinRegion(region);
    };

    /**
     * 设置小地图相机显示样式
     * @param {REColor} iconClr //图标颜色（REColor 类型）
     * @param {Number} iconSize //图标大小（按屏幕分辨率） 默认值20px
     */
    Module.MiniMap.setIconStyle = function (iconClr, iconSize) {
        if (isEmptyLog(iconClr, 'iconClr')) return;

        var _clr = clrToU32_W_WBGR(iconClr, iconClr.alpha);
        var _iconSize = 20;
        if (!isEmpty(iconSize)) _iconSize = iconSize;
        return Module.RealBIMWeb.SetOverViewCamStyle(_clr, _iconSize);
    };

    // MARK 相机
    /**
     * 设置小地图相机位置
     * @param {Vec2} camPos //位置坐标 必传
     * @param {Vec2} camDir //相机朝向 可不传
     */
    Module.MiniMap.setCamLocateTo = function (camPos, camDir) {
        if (isEmptyLog(camPos, 'camPos')) return;
        var _dPosX = camPos[0];
        var _dPosY = camPos[1];
        var _dDirX = 0;
        var _dDirY = 0;
        if ((camPos.length = 2)) {
            _dDirX = camDir[0];
            _dDirY = camDir[1];
        }
        return Module.RealBIMWeb.SetOverViewCamLocation(_dPosX, _dPosY, _dDirX, _dDirY);
    };

    class RECADTransInfo {
        constructor() {
            this.basePos = null; //	变换基点
            this.offset = null; //	偏移量
            this.scaleFactor = null; //	缩放比例
            this.angle = null; //	旋转角度
            this.normal = null; //	法向量
            this.axis = null; //	镜像轴向以基点为基准
        }
    }
    ExtModule.RECADTransInfo = RECADTransInfo;

    class RECADConvertInfo {
        constructor() {
            this.bimPoint = null; //	BIM顶点
            this.cadPoint = null; //	CAD顶点
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
            logErr('对应的BIM和CAD点集合, 最少大于等于3个数据');
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
        var _CADUnit = isEmpty(unit) ? eval(RECadUnitEm.CAD_UNIT_Meter) : eval(unit);

        var _vector_TransformInfo = Module.RealBIMWeb.GetOverViewCamTransformInfoByPosMap(_vector_BIMPoints, _vector_CADPoints, _CADUnit);

        var transInfo = new RECADTransInfo();
        transInfo.basePos = _vector_TransformInfo.m_vBasePos; //变换基点
        transInfo.offset = _vector_TransformInfo.m_vOffset; //偏移量
        transInfo.scaleFactor = _vector_TransformInfo.m_dScaleFactor; //缩放比例
        transInfo.angle = _vector_TransformInfo.m_dAngle; //旋转角度
        transInfo.normal = _vector_TransformInfo.m_vNormal; //法向量
        transInfo.axis = _vector_TransformInfo.m_vAxis; //镜像轴向以基点为基准
        return transInfo;
    };

    /**
     * 设置小地图相机变换数据 (通过顶点映射)
     * @param {Array} pointList //对应的BIM和CAD点集合，最少大于等于3个数据 (RECADConvertInfo 类型)
     * @param {RECadUnitEm} unit //CAD单位 RECadUnitEm 枚举值
     */
    Module.MiniMap.setConvertCamTransInfo = function (pointList, unit) {
        if (!checkTypeLog(pointList, 'pointList', RE_Enum.RE_Check_Array)) return false;

        if (pointList.length < 3) {
            logErr('对应的BIM和CAD点集合, 最少大于等于3个数据');
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
        var _CADUnit = isEmpty(unit) ? eval(RECadUnitEm.CAD_UNIT_Meter) : eval(unit);
        var _vector_TransformInfo = Module.RealBIMWeb.GetOverViewCamTransformInfoByPosMap(_vector_BIMPoints, _vector_CADPoints, _CADUnit);
        return Module.RealBIMWeb.SetOverViewCamTransformInfo(_vector_TransformInfo);
    };

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
    };

    /**
     * 获取小地图相机变换数据
     */
    Module.MiniMap.getCamTransInfo = function () {
        var _vector_TransformInfo = Module.RealBIMWeb.GetOverViewCamTransformInfo();
        var transInfo = new RECADTransInfo();
        transInfo.basePos = _vector_TransformInfo.m_vBasePos; //变换基点
        transInfo.offset = _vector_TransformInfo.m_vOffset; //偏移量
        transInfo.scaleFactor = _vector_TransformInfo.m_dScaleFactor; //缩放比例
        transInfo.angle = _vector_TransformInfo.m_dAngle; //旋转角度
        transInfo.normal = _vector_TransformInfo.m_vNormal; //法向量
        transInfo.axis = _vector_TransformInfo.m_vAxis; //镜像轴向以基点为基准
        return transInfo;
    };

    /**
     * 设置指定组 CAD类型小地图矢量锚点的相机缩放边界值
     * @param {String} groupId //标识锚点组的标识ID
     * @param {Number} minScale //缩放最小边界
     * @param {Number} maxScale //缩放最大边界
     */
    Module.MiniMap.setCADGroupShpAncScale = function (groupId, minScale, maxScale) {
        if (isEmptyLog(groupId, 'groupId')) return;
        return Module.RealBIMWeb.SetCADOverViewShpAnchorScale(groupId, minScale, maxScale);
    };

    /**
     * 设置小地图当前视口范围及相机定位
     * @param {Array} minPot //视口左下角坐标
     * @param {Array} maxPot //视口右上角坐标
     * @param {String} layoutId //布局标识
     */
    Module.MiniMap.setCurViewportRange = function (minPot, maxPot, layoutId) {
        let _layoutId = isEmpty(layoutId) ? 'Model' : layoutId;
        Module.RealBIMWeb.CADOverViewFocusToViewport(_layoutId, minPot, maxPot);
    };

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
                m_strID: isEmpty(cadShpAnc.anchorId) ? '' : cadShpAnc.anchorId,
                m_strLayoutName: 'Model',
                m_vPos: isEmpty(cadShpAnc.pos) ? [0.0, 0.0] : cadShpAnc.pos,
                m_strShpPath: isEmpty(cadShpAnc.shpPath) ? '' : cadShpAnc.shpPath,
                m_strGroupID: isEmpty(cadShpAnc.groupId) ? '' : cadShpAnc.groupId,
                m_strText: isEmpty(cadShpAnc.text) ? '' : cadShpAnc.text,
                m_uTextClr: isEmpty(cadShpAnc.textClr) ? 0xffffffff : clrToU32(cadShpAnc.textClr),
                m_dTextSize: isEmpty(cadShpAnc.textSize) ? 16 : cadShpAnc.textSize,
                m_vTextAlign: isEmpty(cadShpAnc.textAlign) ? REGridPosEm.MM : cadShpAnc.textAlign,
            };
            _vector_ShpAnchor.push_back(_obj);
        }
        return Module.RealBIMWeb.AddCADOverViewShpAnchors(_vector_ShpAnchor);
    };

    /**
     * 获取系统中的CAD类型小地图矢量锚点总数
     */
    Module.MiniMap.getCADShpAncNum = function () {
        return Module.RealBIMWeb.GetCADOverViewShpAnchorNum();
    };

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
    };

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
    };

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
    };

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
    };

    /**
     * 删除系统所有的CAD类型小地图矢量锚点
     */
    Module.MiniMap.delAllCADShpAnc = function () {
        return Module.RealBIMWeb.DelAllCADOverViewShpAnchors();
    };

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
    };

    /**
     * 删除对应组 包含的所有CAD矢量锚点
     * @param {String} groupId //锚点所属的组名称ID
     */
    Module.MiniMap.delCADGroupShpAnc = function (groupId) {
        if (isEmptyLog(groupId, 'groupId')) return;
        return Module.RealBIMWeb.DelGroupCADOverViewShpAnchors(groupId);
    };

    // MOD-- 管道（Pipe） <---
    Module.Pipe = typeof Module.Pipe !== 'undefined' ? Module.Pipe : {}; //增加 Pipe 模块

    // MARK 加载
    class REPipeInfo {
        constructor() {
            this.dataSetId = null; // 数据集标识
            this.pipeId = null; // 管道唯一标识
            this.elemIdList = null; // 连续的构件id集合
            this.texPath = null; // 纹理路径
            this.pipeClr = null; // 管道显示的颜色 （REColor 类型）
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
        Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (let i = 0; i < count; ++i) {
            var eleid = pipeInfo.elemIdList[i];
            _elemIds.set([eleid], i);
        }

        var _texPath = !isEmpty(pipeInfo.texPath) ? pipeInfo.texPath : '';
        var _pipeClr = !isEmpty(pipeInfo.pipeClr) ? clrToU32(pipeInfo.pipeClr) : 0xffffffff;
        Module.RealBIMWeb.AddContPipe(pipeInfo.dataSetId, pipeInfo.pipeId, _elemIds.byteLength, _elemIds.byteOffset, _texPath, _pipeClr);
    };

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
    };

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
    };

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
                    curprojinfo['dataSetId'] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
                    curprojinfo['elemIdList'] = curprojelemarr;
                    projidarr.push(curprojinfo);
                    curprojelemarr = [];
                }
                curprojid = tempselids[i + 1];
                curprojelemarr.push(tempselids[i]);
            }
        }
        if (curprojelemarr.length > 0) {
            var curprojinfo = {};
            curprojinfo['dataSetId'] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
            curprojinfo['elemIdList'] = curprojelemarr;
            projidarr.push(curprojinfo);
            curprojelemarr = [];
        }
        return projidarr.length ? projidarr[0] : {};
    };

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
    };

    /**
     * 加载连续管道
     * @param {string} dataSetId //数据集标识
     * @param {string} pipeInfoXMLStr //管道信息xml字符串
     */
    Module.Pipe.setContPipeInfoXMLStr = function (dataSetId, pipeInfoXMLStr) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(pipeInfoXMLStr, 'pipeInfoXMLStr')) return;
        Module.RealBIMWeb.SetContPipe(dataSetId, pipeInfoXMLStr);
    };

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
    };

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
    };

    /**
     * 获取连续管道的纹理路径
     * @param {String} pipeId //管道标识
     */
    Module.Pipe.getContPipeTex = function (pipeId) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        return Module.RealBIMWeb.GetContPipeTex(pipeId);
    };

    /**
     * 设置连续管道的颜色
     * @param {String} pipeId //管道标识
     * @param {REColor} pipeClr //管道颜色
     */
    Module.Pipe.setContPipeClr = function (pipeId, pipeClr) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        var _pipeClr = !isEmpty(pipeClr) ? clrToU32(pipeClr) : 0xffffffff;
        Module.RealBIMWeb.SetContPipeClr(pipeId, _pipeClr);
    };

    /**
     * 获取连续管道的颜色
     * @param {String} pipeId //管道标识
     */
    Module.Pipe.getContPipeClr = function (pipeId) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        var _uPipeClr = Module.RealBIMWeb.GetContPipeClr(pipeId);
        return clrU32ToClr(_uPipeClr);
    };

    /**
     * 设置当前连续管道的颜色
     * @param {REColor} pipeClr //管道颜色
     */
    Module.Pipe.setCurContPipeClr = function (pipeClr) {
        var _pipeClr = !isEmpty(pipeClr) ? clrToU32(pipeClr) : 0xffffffff;
        Module.RealBIMWeb.SetCurContPipeClr(_pipeClr);
    };

    /**
     * 获取当前连续管道的颜色
     */
    Module.Pipe.getCurContPipeClr = function () {
        var _uPipeClr = Module.RealBIMWeb.GetCurContPipeClr();
        return clrU32ToClr(_uPipeClr);
    };

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
    };

    // MARK 编辑
    /**
     * 开始进入连续管道交互状态
     */
    Module.Pipe.startEditContPipeMode = function () {
        Module.RealBIMWeb.EnterContPipeMode();
    };

    /**
     * 结束连续管道交互模式
     */
    Module.Pipe.endEditContPipeMode = function () {
        Module.RealBIMWeb.ExitContPipeMode();
    };

    /**
     * 获取是否在连续管道编辑状态
     */
    Module.Pipe.getContPipeMode = function () {
        return Module.RealBIMWeb.GetContPipeMode();
    };

    /**
     * 设置当前连续管道
     * @param {String} pipeId //管道标识
     */
    Module.Pipe.setCurContPipe = function (pipeId) {
        if (isEmptyLog(pipeId, 'pipeId')) return;
        Module.RealBIMWeb.SetCurContPipe(pipeId);
    };

    /**
     * 获取当前连续管道ID
     */
    Module.Pipe.getCurContPipe = function () {
        return Module.RealBIMWeb.GetCurContPipeID();
    };

    /**
     * 保存当前连续管道
     */
    Module.Pipe.saveCurContPipe = function () {
        Module.RealBIMWeb.SaveCurContPipe();
    };

    /**
     * 重置当前连续管道
     */
    Module.Pipe.resetCurContPipe = function () {
        Module.RealBIMWeb.ResetCurContPipe();
    };

    /**
     * 从当前操作的管道中移除构件
     * @param {string} dataSetId //数据集标识
     * @param {Array} elemIdList //构件标识集合, 为空数组代表所有构件
     */
    Module.Pipe.removeCurContPipeSubElem = function (dataSetId, elemIdList) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;

        var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
        var count = elemIdList.length;
        if (count == 0) {
            Module.RealBIMWeb.RemoveCurContPipeSubElem(0xffffffff, 0);
            return;
        }
        var _moemory = (count * 8).toString();
        Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
        var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
        for (let i = 0; i < count; ++i) {
            var eleid = elemIdList[i];
            _elemIds.set([eleid, _projid], i * 2);
        }
        Module.RealBIMWeb.RemoveCurContPipeSubElem(_elemIds.byteLength, _elemIds.byteOffset);
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.Pipe.removeCurContPipeSubElem = sharding_createShardingConstuctor(Module.Pipe.removeCurContPipeSubElem, {
            idPath: '',
            argIndex: 1,
        });
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
                    curprojinfo['dataSetId'] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
                    curprojinfo['elemIdList'] = curprojelemarr;
                    projidarr.push(curprojinfo);
                    curprojelemarr = [];
                }
                curprojid = tempselids[i + 1];
                curprojelemarr.push(tempselids[i]);
            }
        }
        if (curprojelemarr.length > 0) {
            var curprojinfo = {};
            curprojinfo['dataSetId'] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
            curprojinfo['elemIdList'] = curprojelemarr;
            projidarr.push(curprojinfo);
            curprojelemarr = [];
        }
        return projidarr.length ? projidarr[0] : {};
    };

    // MOD-- 单构件（Entity） <---
    Module.Entity = typeof Module.Entity !== 'undefined' ? Module.Entity : {}; //增加 Entity 模块

    // MARK 加载
    /**
     * 获取所有构件类型的唯一标识集合
     * @param {String} dataSetId //数据集标识
     */
    Module.Entity.getAllTypeNames = function (dataSetId) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        let arrTypeName = Module.RealBIMWeb.GetEntityTypeNamesByProj(dataSetId);
        var nameArr = [];
        for (let i = 0; i < arrTypeName.size(); ++i) {
            nameArr.push(arrTypeName.get(i));
        }
        return nameArr;
    };

    class REEntityInfo {
        constructor() {
            this.dataSetId = null; // 数据集标识
            this.entityType = null; // 实例类型名称
            this.elemId = null; // 构件唯一标识，重复添加失败, 0代表引擎自增创建id
            this.scale = [1.0, 1.0, 1.0]; // 缩放
            this.rotate = [0.0, 0.0, 0.0, 1.0]; // 旋转
            this.offset = [0.0, 0.0, 0.0]; // 平移
            this.dataSetCRS = null; // 坐标系标识
        }
    }
    ExtModule.REEntityInfo = REEntityInfo;

    /**
     * 添加一系列实例对象 添加完成RECreateEntitiesFinish回调
     * @param {Array} entityList //实例信息集合 （REEntityInfo 类型）
     */
    Module.Entity.addEntities = function (entityList) {
        if (hasNullProt(entityList, 'dataSetId')) {
            console.error('【REError】: dataSetId 不能为空');
            return;
        }
        if (hasNullProt(entityList, 'entityType')) {
            console.error('【REError】: entityType 不能为空');
            return;
        }
        let _vector_entity = new Module.RE_Vector_ENTITY_INFO();
        let _count = entityList.length;
        for (let i = 0; i < _count; i++) {
            let cEntity = entityList[i];
            let cEntity_obj = {
                m_strProjName: cEntity.dataSetId,
                m_strTypeName: cEntity.entityType,
                m_uEntityID: isEmpty(cEntity.elemId) ? 0 : cEntity.elemId,
                m_vCustomScale: isEmpty(cEntity.scale) ? [1.0, 1.0, 1.0] : cEntity.scale,
                m_qCustomRotate: isEmpty(cEntity.rotate) ? [0.0, 0.0, 0.0, 1.0] : cEntity.rotate,
                m_vCustomOffset: isEmpty(cEntity.offset) ? [0.0, 0.0, 0.0] : cEntity.offset,
                m_strCRS: isEmpty(cEntity.dataSetCRS) ? '' : cEntity.dataSetCRS,
            };
            _vector_entity.push_back(cEntity_obj);
        }
        return Module.RealBIMWeb.AddEntities(_vector_entity);
    };

    /**
     * 获取项目中所有的实例信息集合
     * @param {String} dataSetId //数据集标识, 空字符串获取所有项目的实例信息
     * @param {String} entityType //实例类型名称, 空字符串获取当前项目所有类型的实例信息
     */
    Module.Entity.getEntitys = function (dataSetId, entityType) {
        let _dataSetId = isEmpty(dataSetId) ? '' : dataSetId;
        let _entityType = isEmpty(entityType) ? '' : entityType;
        let arrEntity = Module.RealBIMWeb.GetAllEntity(_dataSetId, _entityType);
        var entityList = [];
        for (let i = 0; i < arrEntity.size(); ++i) {
            let cEntity = arrEntity.get(i);
            let _entity = new REEntityInfo();
            _entity.dataSetId = cEntity.m_strProjName;
            _entity.entityType = cEntity.m_strTypeName;
            _entity.elemId = cEntity.m_uEntityID;
            _entity.scale = cEntity.m_vCustomScale;
            _entity.rotate = cEntity.m_qCustomRotate;
            _entity.offset = cEntity.m_vCustomOffset;
            _entity.dataSetCRS = cEntity.m_strCRS;
            entityList.push(_entity);
        }
        return entityList;
    };

    /**
     * 删除实例信息
     * @param {String} dataSetId //数据集标识, 空字符串删除所有数据集的实例信息
     * @param {String} entityType //实例类型名称, 空字符串删除指定数据集所有类型的实例信息
     * @param {Array} elemIdList //实例id集合, 空数组删除指定数据集指定类型下的所有实例id匹配实例
     */
    Module.Entity.delEntities = function (dataSetId, entityType, elemIdList) {
        let _dataSetId = isEmpty(dataSetId) ? '' : dataSetId;
        let _entityType = isEmpty(entityType) ? '' : entityType;
        let _elemIdList = isEmpty(elemIdList) ? [] : elemIdList;

        if (_dataSetId == '') {
            Module.RealBIMWeb.DelEntities('', '', 0xffffffff, 0);
        } else {
            if (!_elemIdList.length) {
                Module.RealBIMWeb.DelEntities(_dataSetId, _entityType, 0xffffffff, 0);
            } else {
                let _projid = Module.RealBIMWeb.ConvGolStrID2IntID(_dataSetId);
                let count = _elemIdList.length;
                let _moemory = (count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                let _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < count; ++i) {
                    var eleid = _elemIdList[i];
                    _elemIds.set([eleid, _projid], i * 2);
                }
                Module.RealBIMWeb.DelEntities(_dataSetId, _entityType, _elemIds.byteLength, _elemIds.byteOffset);
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.Entity.delEntities = sharding_createShardingConstuctor(Module.Entity.delEntities, {
            idPath: '',
            argIndex: 2,
        });
    }

    // MARK 编辑
    /**
     * 获取是否在实体编辑状态
     */
    Module.Entity.getEditMode = function () {
        return Module.RealBIMWeb.GetEntityEditMode();
    };

    /**
     * 开始进入实体交互状态
     */
    Module.Entity.enterEditMode = function () {
        Module.RealBIMWeb.EnterEntityEditMode();
    };

    /**
     * 结束交互交互模式
     */
    Module.Entity.exitEditMode = function () {
        Module.RealBIMWeb.ExitEntityEditMode();
    };

    /**
     * 开始进入实例添加状态
     * @param {Number} type //添加类型 0:点模式  1:线模式  2：面模式  3：复制模式
     */
    Module.Entity.startAddState = function (type) {
        let _type = Module.RE_ENTITY_EDIT_STATE.POINT;
        switch (type) {
            case 0:
                _type = Module.RE_ENTITY_EDIT_STATE.POINT;
                break;
            case 1:
                _type = Module.RE_ENTITY_EDIT_STATE.LINE;
                break;
            // case 2:
            //     _type = Module.RE_ENTITY_EDIT_STATE.POLYGON;
            //     break;
            case 3:
                _type = Module.RE_ENTITY_EDIT_STATE.COPY;
                break;
            default:
                return;
        }
        Module.RealBIMWeb.BeginAddEntity(_type, '');
    };

    /**
     * 结束实例添加状态
     */
    Module.Entity.endAddState = function () {
        Module.RealBIMWeb.EndAddEntity();
    };

    class REEntityTempTranInfo {
        constructor() {
            this.scale = [1.0, 1.0, 1.0]; // 缩放
            this.rotate = [0.0, 0.0, 0.0, 1.0]; // 旋转
        }
    }
    ExtModule.REEntityTempTranInfo = REEntityTempTranInfo;

    /**
     * 设置实例的模板信息
     * @param {String} dataSetId //数据集标识，必填
     * @param {String} entityType //实例类型名称，必填
     * @param {REEntityTempTranInfo} tranInfo //实例默认的对应系数信息
     */
    Module.Entity.setTemplateInfo = function (dataSetId, entityType, tranInfo) {
        let _tranInfo = {
            m_vScale: isEmpty(tranInfo) ? [1.0, 1.0, 1.0] : isEmpty(tranInfo.scale) ? [1.0, 1.0, 1.0] : tranInfo.scale,
            m_qRotate: isEmpty(tranInfo) ? [0.0, 0.0, 0.0, 1.0] : isEmpty(tranInfo.rotate) ? [0.0, 0.0, 0.0, 1.0] : tranInfo.rotate,
            m_vOffset: [0, 0, 0],
        };
        Module.RealBIMWeb.SetEntityTypeInfo(dataSetId, entityType, _tranInfo);
    };

    if (!hasNewEntity) {
        /**
         * 设置是否连续添加实例
         * @param {Boolean} multiAdd //true为连续添加， false为单次添加
         */
        Module.Entity.setMultiAddEntity = function (multiAdd) {
            Module.RealBIMWeb.SetIsMultiAddEntity(multiAdd);
        };

        /**
         * 设置鼠标操作添加实例的模板信息  REExitEntityEditMode 事件表示退出添加
         * @param {String} dataSetId //数据集标识，必填
         * @param {String} entityType //实例类型名称，必填
         */
        Module.Entity.setMouseAddEntity = function (dataSetId, entityType) {
            if (isEmpty(dataSetId) || dataSetId == '') {
                logParErr('dataSetId');
                return;
            }
            if (isEmpty(entityType) || entityType == '') {
                logParErr('entityType');
                return;
            }
            Module.RealBIMWeb.SetEntityType(dataSetId, entityType);
        };
    }

    /**
     * 获取实例的仿射变换信息
     * @param {String} dataSetId //数据集标识，必填
     * @param {Array} elemIdList //构件id集合，空数组表示获取全部
     */
    Module.Entity.getTransInfo = function (dataSetId, elemIdList) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;

        let _elemIdList = isEmpty(elemIdList) ? [] : elemIdList;
        let count = _elemIdList.length;
        if (!count) {
            let arrEntity = Module.RealBIMWeb.GetAllEntity(dataSetId, '');
            for (let i = 0; i < arrEntity.size(); i++) {
                let entity_obj = arrEntity.get(i);
                _elemIdList.push(entity_obj.m_uEntityID);
            }
        }

        let entityTransList = [];
        for (let i = 0; i < _elemIdList.length; i++) {
            let entityTrans_obj = Module.RealBIMWeb.GetEntityTransform(dataSetId, _elemIdList[i]);
            let _trans_obj = new RELocInfo();
            _trans_obj.scale = entityTrans_obj.m_vScale;
            _trans_obj.rotate = entityTrans_obj.m_qRotate;
            _trans_obj.offset = entityTrans_obj.m_vOffset;
            entityTransList.push(_trans_obj);
        }
        return entityTransList;
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.Entity.getTransInfo = sharding_createShardingConstuctor(Module.Entity.getTransInfo, {
            idPath: '',
            argIndex: 1,
        });
    }

    /**
     * 设置实例的仿射变换信息
     * @param {String} dataSetId //数据集标识，必填
     * @param {Number} elemId //构件id
     * @param {RELocInfo} locInfo //位置信息
     */
    Module.Entity.setTransInfo = function (dataSetId, elemId, locInfo) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        let _trans_obj = {
            m_vScale: locInfo.scale,
            m_qRotate: locInfo.rotate,
            m_vOffset: locInfo.offset,
        };
        return Module.RealBIMWeb.SetEntityTransform(dataSetId, elemId, _trans_obj);
    };

    /**
     * 设置模型内子元素集合的总包围盒矢量是否显示
     * @param {Boolean} visible //是否显示
     */
    Module.Entity.setBVShpVisiable = function (visible) {
        Module.RealBIMWeb.SetBVShpVisiable(visible);
    };

    class REEntityBVInfo {
        constructor() {
            this.lineClr = null; // 包围盒线颜色 （REColor 类型）
            this.lineWidth = null; // 包围盒线宽度
            this.faceClr = null; // 包围盒面颜色 （REColor 类型）
            this.visiableType = 0; // 显示类型 0：全部显示  1：只显示线  2：只显示面 （默认显示全部）
        }
    }
    ExtModule.REEntityBVInfo = REEntityBVInfo;

    /**
     * 设置包围盒矢量的样式
     * @param {REEntityBVInfo} entityBVInfo //包围盒信息
     */
    Module.Entity.setBVShpStyle = function (entityBVInfo) {
        let _lineClr = isEmpty(entityBVInfo.lineClr) ? 0xff00ffff : clrToU32(entityBVInfo.lineClr);
        let _lineWidth = isEmpty(entityBVInfo.lineWidth) ? 3 : entityBVInfo.lineWidth;
        let _faceClr = isEmpty(entityBVInfo.faceClr) ? 0x0fffffff : clrToU32(entityBVInfo.faceClr);
        let _visiableType = isEmpty(entityBVInfo.visiableType) ? 255 : entityBVInfo.visiableType ? entityBVInfo.visiableType : 255;

        Module.RealBIMWeb.SetBVShpStyle(_lineClr, _lineWidth, _faceClr, _visiableType);
    };

    /**
     * 设置包围盒展示的范围
     * @param {String} dataSetId //数据集标识，为空串则表示处理所有项目
     * @param {Array} elemIdList //构件id集合, 为空数组则表示处理所有构件
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.Entity.setBVShpRange = function (dataSetId, elemIdList, elemScope) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;
        var _elemScope = 0;
        if (!isEmpty(elemScope)) {
            _elemScope = elemScope;
        }

        if (dataSetId == '') {
            Module.RealBIMWeb.SetBVAttachHugeObjSubElems('', 0xffffffff, 0, _elemScope);
        } else {
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetBVAttachHugeObjSubElems(dataSetId, 0xffffffff, 0, _elemScope);
            } else {
                var _moemory = (_count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < _count; ++i) {
                    _elemIds.set([elemIdList[i], _projid], i * 2);
                }
                Module.RealBIMWeb.SetBVAttachHugeObjSubElems(dataSetId, _elemIds.byteLength, _elemIds.byteOffset, _elemScope);
            }
        }
    };

    // MARK 渲染效果
    /**
     * 设置单构件实例实时阴影偏好 注：动态单构件实例默认没有实时阴影效果，需要自行打开
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件id集合
     * @param {Boolean} preferRealtime //偏好实时阴影效果
     */
    Module.Entity.setShadowPrefer = function (dataSetId, elemIdList, preferRealtime, elemScope) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemIdList, 'elemIdList')) return;

        var _elemScope = isEmpty(elemScope) ? 0 : elemScope;
        var _preferRealtime = preferRealtime ? false : preferRealtime;

        if (dataSetId == '') {
            //多数据集设置
            Module.RealBIMWeb.SetHugeObjSubElemShadowPrefer('', '', 0xffffffff, 0, _preferRealtime, _elemScope);
        } else {
            //指定数据集设置
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            var _count = elemIdList.length;
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemShadowPrefer(dataSetId, '', 0xffffffff, 0, _preferRealtime, _elemScope);
            } else {
                var _moemory = (_count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
                var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < _count; ++i) {
                    _elemIds.set([elemIdList[i], _projid], i * 2);
                }
                Module.RealBIMWeb.SetHugeObjSubElemShadowPrefer(dataSetId, '', _elemIds.byteLength, _elemIds.byteOffset, _preferRealtime, _elemScope);
            }
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.Entity.setShadowPrefer = sharding_createShardingConstuctor(Module.Entity.setShadowPrefer, {
            idPath: '',
            argIndex: 1,
        });
    }

    // MARK 动画通用

    /**
     * 根据动画类型获取动画名称列表
     * @param {String} dataSetId //数据集标识，必填
     * @param {String} entityType //实例类型名称，必填
     */
    Module.Entity.getSelfAnimNameList = function (dataSetId, entityType) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmpty(entityType) || entityType == '') {
            logParErr('entityType');
            return;
        }
        let arrName = Module.RealBIMWeb.GetEntitySelfAnimNameList(dataSetId, entityType);
        let animNameList = [];
        for (let i = 0; i < arrName.size(); i++) {
            animNameList.push(arrName.get(i));
        }
        return animNameList;
    };

    class REEntityAnimPlayInfo {
        constructor() {
            this.dataSetId = null; // 数据集标识
            this.entityType = null; // 实例类型名称
            this.elemIdList = null; // 构件标识集合
            this.animPlayMode = 4; // 动画的播放模式 类型 REEntityAnimPlayModeEm 枚举
            this.animPlayState = 1; // 动画的播放状态 类型 REEntityAnimPlayStateEm 枚举
        }
    }
    ExtModule.REEntityAnimPlayInfo = REEntityAnimPlayInfo;

    /**
     * 设置实体动画的播放信息
     * @param {REEntityAnimPlayInfo} animPlayModeInfo //动画类型信息
     */
    Module.Entity.setAnimPlayMode = function (animPlayModeInfo) {
        if (isEmptyLog(animPlayModeInfo, 'animPlayModeInfo')) return;

        let _dataSetId = isEmpty(animPlayModeInfo.dataSetId) ? '' : animPlayModeInfo.dataSetId;
        let _entityType = isEmpty(animPlayModeInfo.entityType) ? '' : animPlayModeInfo.entityType;
        let _elemIdList = isEmpty(animPlayModeInfo.elemIdList) ? [] : animPlayModeInfo.elemIdList;
        let _animPlayMode = isEmpty(animPlayModeInfo.animPlayMode) ? eval(REEntityAnimPlayModeEm.REPEATTURN) : eval(animPlayModeInfo.animPlayMode);
        let _animPlayState = isEmpty(animPlayModeInfo.animPlayState) ? eval(REEntityAnimPlayStateEm.PAUSE) : eval(animPlayModeInfo.animPlayState);

        if (_dataSetId == '') {
            Module.RealBIMWeb.SetEntityAnimPlayMode('', '', 0xffffffff, 0, _animPlayState, '', _animPlayMode);
        } else {
            let _projid = Module.RealBIMWeb.ConvGolStrID2IntID(_dataSetId);
            let count = animPlayModeInfo.elemIdList.length;
            let _moemory = (count * 8).toString();
            Module.RealBIMWeb.ReAllocHeapViews(_moemory); //分配空间
            let _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
            for (let i = 0; i < count; ++i) {
                var eleid = _elemIdList[i];
                _elemIds.set([eleid, _projid], i * 2);
            }
            Module.RealBIMWeb.SetEntityAnimPlayMode(
                _dataSetId,
                _entityType,
                count ? _elemIds.byteLength : 0xffffffff,
                count ? _elemIds.byteOffset : 0,
                _animPlayState,
                '',
                _animPlayMode
            );
        }
    };
    if (sharding) {
        // 使用分片包装器处理接口
        Module.Entity.setAnimPlayMode = sharding_createShardingConstuctor(Module.Entity.setAnimPlayMode, {
            idPath: 'elemIdList',
            argIndex: 'animPlayModeInfo',
        });
    }

    class REEntitySingleAnimPlayInfo {
        constructor() {
            this.dataSetId = null; // 数据集标识
            this.elemId = null; // 构件标识
            this.animName = null; // 动画标识，世界空间动画类型，该字段无效
            this.animLevel = 0; // 动画级别 0：世界空间动画  1：自身动画
            this.animPlayMode = 4; // 动画的播放模式 类型 REEntityAnimPlayModeEm 枚举
            this.animPlayState = 1; // 动画的播放状态 类型 REEntityAnimPlayStateEm 枚举
        }
    }
    ExtModule.REEntitySingleAnimPlayInfo = REEntitySingleAnimPlayInfo;

    /**
     * 设置单一实体动画的播放状态信息
     * @param {REEntitySingleAnimPlayInfo} animPlayInfo //动画播放状态信息
     */
    Module.Entity.setAnimPlayModeSingle = function (animPlayInfo) {
        if (isEmptyLog(animPlayInfo, 'animPlayInfo')) return;

        let _dataSetId = isEmpty(animPlayInfo.dataSetId) ? '' : animPlayInfo.dataSetId;
        let _elemId = isEmpty(animPlayInfo.elemId) ? 1 : animPlayInfo.elemId;
        let _animName = isEmpty(animPlayInfo.animName) ? '' : animPlayInfo.animName;
        let _animLevel = isEmpty(animPlayInfo.animLevel) ? 0 : animPlayInfo.animLevel;
        let _animPlayMode = isEmpty(animPlayInfo.animPlayMode) ? eval(REEntityAnimPlayModeEm.REPEATTURN) : eval(animPlayInfo.animPlayMode);
        let _animPlayState = isEmpty(animPlayInfo.animPlayState) ? eval(REEntityAnimPlayStateEm.PAUSE) : eval(animPlayInfo.animPlayState);
        let _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.WOELD_LEVEL;
        if (_animLevel == 1) {
            _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.SELF_LEVEL;
        }
        Module.RealBIMWeb.SetEntityAniPlayState(_dataSetId, _elemId, _animName, _eAniLevel, _animPlayMode, _animPlayState);
    };

    /**
     * 获取单构件动画的播放时长
     * @param {String} dataSetId //数据集标识，必填
     * @param {Number} elemId //构件标识
     * @param {Number} animLevel //动画级别（默认为0） 0：世界空间动画  1：自身动画
     * @param {String} animName //动画标识，世界空间动画类型，该字段无效，可不传
     */
    Module.Entity.getAnimTimeLen = function (dataSetId, elemId, animLevel, animName) {
        if (isEmpty(dataSetId) || dataSetId == '') {
            logParErr('dataSetId');
            return;
        }
        if (isEmptyLog(elemId, 'elemId')) return;
        let _animName = isEmpty(animName) ? '' : animName;
        let _animLevel = isEmpty(animLevel) ? 0 : animLevel;
        let _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.WOELD_LEVEL;
        if (_animLevel == 1) {
            _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.SELF_LEVEL;
        }
        return Module.RealBIMWeb.GetEntityAniTimeLen(dataSetId, elemId, _eAniLevel, _animName);
    };

    // MARK 轨迹动画

    class REEntityTrackAnimInfo {
        // 单构件轨迹动画信息
        constructor() {
            this.dataSetId = null; // 数据集标识
            this.elemId = null; // 构件唯一标识
            //this.trackPointList = null; //表示轨迹顶点序列
            this.trackPointList = null; //表示轨迹顶点信息（RETrackPointInfo 类型）
            this.pathColsed = false; //表示路径是否闭合
            this.speed = 1.0; // 表示动画运动速度（单位m/s）
            this.selfVect = [0.0, 0.0, 0.0]; //表示单构件自身姿态正方向
        }
    }
    ExtModule.REEntityTrackAnimInfo = REEntityTrackAnimInfo;

    class RETrackPointInfo {
        // 轨迹顶点信息
        constructor() {
            this.pos = null; // 轨迹顶点坐标
            this.selfVect = null; // 轨迹顶点对应的单构件自身姿态正方向
        }
    }
    ExtModule.RETrackPointInfo = RETrackPointInfo;

    /**
     * 设置单构件轨迹动画信息
     * @param {REEntityTrackAnimInfo} trackAnimInfo // 单构件轨迹动画信息（REEntityTrackAnimInfo 类型）
     */
    Module.Entity.setTrackAnim = function (trackAnimInfo) {
        if (isEmptyLog(trackAnimInfo, 'trackAnimInfo')) return;
        if (isEmptyLog(trackAnimInfo.dataSetId, 'dataSetId')) return;
        if (isEmptyLog(trackAnimInfo.elemId, 'elemId')) return;
        if (!checkTypeLog(trackAnimInfo.trackPointList, 'trackPointList', RE_Enum.RE_Check_Array)) return;
        //if (!checkTypeLog(trackAnimInfo.selfVect, 'selfVect', RE_Enum.RE_Check_Array)) return;
        let _pathColsed = isEmpty(trackAnimInfo.pathColsed) ? false : trackAnimInfo.pathColsed;
        let _speed = isEmpty(trackAnimInfo.speed) ? 1.0 : trackAnimInfo.speed;
        //let _selfVect = isEmpty(trackAnimInfo.selfVect) ? [1.0, 0.0, 0.0] : trackAnimInfo.selfVect;

        let _vector_track = new Module.RE_Vector_dvec3();
        let _vector_selfVect = new Module.RE_Vector_dvec3();
        for (let i = 0; i < trackAnimInfo.trackPointList.length; i++) {
            const pointInfo = trackAnimInfo.trackPointList[i];
            let _pos = isEmpty(pointInfo.pos) ? [0.0, 0.0, 0.0] : pointInfo.pos;
            let _selfVect = isEmpty(pointInfo.selfVect) ? [1.0, 0.0, 0.0] : pointInfo.selfVect;
            _vector_track.push_back(_pos);
            _vector_selfVect.push_back(_selfVect);
        }
        let _cInfo = {
            m_arrTrackPionts: _vector_track,
            m_bPathClosed: _pathColsed,
            m_dSpeed: _speed,
            m_arrSelfVects: _vector_selfVect,
        };
        Module.RealBIMWeb.SetEntityTrackAni(trackAnimInfo.dataSetId, trackAnimInfo.elemId, _cInfo);
    };

    // MARK 动画脚本
    class REEntityAnimScriptInfo {
        // 单构件动画脚本信息
        constructor() {
            this.playScriptId = null; // 动画脚本标识
            this.playerSetList = null; // 动画播放器设置集合（REPlayerSetInfo 类型）
            this.totalTimeLen = 0; // 动画脚本总时长
        }
    }
    ExtModule.REEntityAnimScriptInfo = REEntityAnimScriptInfo;

    class REPlayerSetInfo {
        // 播放器设置信息
        constructor() {
            this.dataSetId = null; // 数据集标识
            this.elemId = null; // 构件标识
            this.animLevel = 0; // 动画级别 0：世界空间动画  1：自身动画
            this.animName = null; // 动画标识，世界空间动画类型，该字段无效
            this.animPlayMode = 4; // 动画的播放模式 类型 REEntityAnimPlayModeEm 枚举
            this.startTime = 0; // 动画播放开始时间
            this.timeLen = 0; // 动画播放时长
            this.playSetList = null; // 动画播放设置集合（REPlaySetInfo 类型）
        }
    }
    ExtModule.REPlayerSetInfo = REPlayerSetInfo;

    class REPlaySetInfo {
        // 播放设置信息
        constructor() {
            this.time = 0.0; // 播放位置（所在整个动画脚本的总时长）
            this.state = 1; // 当前时刻动画的播放状态 类型 REEntityAnimPlayStateEm 枚举
        }
    }
    ExtModule.REPlaySetInfo = REPlaySetInfo;

    /**
     * 增加一个动画脚本
     * @param {REEntityAnimScriptInfo} animScriptInfo //动画脚本信息
     */
    Module.Entity.addAnimScript = function (animScriptInfo) {
        if (isEmptyLog(animScriptInfo, 'animScriptInfo')) return;
        if (isEmptyLog(animScriptInfo.playScriptId, 'playScriptId')) return;
        if (!checkTypeLog(animScriptInfo.playerSetList, 'playerSetList', RE_Enum.RE_Check_Array)) return;

        let _vector_player_set = new Module.RE_Vector_PLAYER_SET_W();
        for (let i = 0; i < animScriptInfo.playerSetList.length; i++) {
            const playerSet = animScriptInfo.playerSetList[i];
            if (isEmptyLog(playerSet.dataSetId, 'dataSetId')) return;
            if (isEmptyLog(playerSet.elemId, 'elemId')) return;
            if (!checkTypeLog(playerSet.playSetList, 'playSetList', RE_Enum.RE_Check_Array)) return;

            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(playerSet.dataSetId);
            let _vector_ainm_play_set = new Module.RE_Vector_ANI_PLAY_SET();
            for (let j = 0; j < playerSet.playSetList.length; j++) {
                const playSet = playerSet.playSetList[j];
                let _animPlayState = isEmpty(playSet.state) ? eval(REEntityAnimPlayStateEm.PAUSE) : eval(playSet.state);
                let _cPlaySet = {
                    m_dTime: playSet.time,
                    m_eState: _animPlayState,
                };
                _vector_ainm_play_set.push_back(_cPlaySet);
            }
            let _animLevel = isEmpty(playerSet.animLevel) ? 0 : playerSet.animLevel;
            let _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.WOELD_LEVEL;
            if (_animLevel == 1) {
                _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.SELF_LEVEL;
            }
            let _animPlayMode = isEmpty(playerSet.animPlayMode) ? eval(REEntityAnimPlayModeEm.REPEATTURN) : eval(playerSet.animPlayMode);
            let _startTime = isEmpty(playerSet.startTime) ? 0 : playerSet.startTime;
            let _timeLen = isEmpty(playerSet.timeLen) ? 0 : playerSet.timeLen;
            let _cPlayerSet = {
                m_strProjName: playerSet.dataSetId,
                m_uEntityID_L32: playerSet.elemId,
                m_uEntityID_H32: _projid,
                m_eAniLevel: _eAniLevel,
                m_strAniName: isEmpty(playerSet.animName) ? '' : playerSet.animName,
                m_ePlayMode: _animPlayMode,
                m_dStartTime: _startTime,
                m_dTimeLen: _timeLen,
                m_arrPlaySets: _vector_ainm_play_set,
            };
            _vector_player_set.push_back(_cPlayerSet);
        }
        let _cAnimScript = {
            m_arrPlayerSets: _vector_player_set,
            m_dTotalTimeLen: animScriptInfo.totalTimeLen,
        };
        Module.RealBIMWeb.AddAnimPlayScript(animScriptInfo.playScriptId, _cAnimScript);
    };

    /**
     * 清除动画脚本
     */
    Module.Entity.delAnimScript = function () {
        Module.RealBIMWeb.ClearAnimPlayScript();
    };

    /**
     * 设置动画脚本播放状态
     * @param {String} playScriptId //动画脚本标识
     * @param {REEntityAnimPlayStateEm} animPlayState //动画脚本播放状态 类型 REEntityAnimPlayStateEm 枚举
     */
    Module.Entity.setAnimScriptPlayState = function (playScriptId, animPlayState) {
        if (isEmptyLog(playScriptId, 'playScriptId')) return;
        let _animPlayState = isEmpty(animPlayState) ? eval(REEntityAnimPlayStateEm.PAUSE) : eval(animPlayState);
        Module.RealBIMWeb.SetAnimPlayScriptState(playScriptId, _animPlayState);
    };

    /**
     * 激活一个动画脚本
     * @param {String} playScriptId //动画脚本标识
     */
    Module.Entity.setAnimScriptActive = function (playScriptId) {
        if (isEmptyLog(playScriptId, 'playScriptId')) return;
        Module.RealBIMWeb.ActiveAnimPlayScript(playScriptId);
    };

    /**
     * 停止一个动画脚本
     * @param {String} playScriptId //动画脚本标识
     */
    Module.Entity.setAnimScriptStop = function (playScriptId) {
        if (isEmptyLog(playScriptId, 'playScriptId')) return;
        Module.RealBIMWeb.StopAnimPlayScript(playScriptId);
    };

    // MARK 动画控制

    /**
     * 获取动画控制组名称
     * @param {String} dataSetId //数据集标识
     * @param {String} entityType //实例类型名称
     */
    Module.Entity.getAnimCtlGroupNames = function (dataSetId, entityType) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(entityType, 'entityType')) return;
        const arrGroupNames = Module.RealBIMWeb.GetEntityAnimCtlGroupNameList(dataSetId, entityType);
        let animCtlGroupNameList = [];
        for (let i = 0; i < arrGroupNames.size(); i++) {
            animCtlGroupNameList.push(arrGroupNames.get(i));
        }
        return animCtlGroupNameList;
    };

    class REAnimCtlInfo {
        // 单构件动画信息
        constructor() {
            this.dataSetId = null; // 数据集标识
            this.elemId = null; // 构件唯一标识
            this.groupName = null; // 组名称
            this.animPlayMode = 4; // 动画的播放模式 类型 REEntityAnimPlayModeEm 枚举
            this.animPlayState = 1; // 动画的播放状态 类型 REEntityAnimPlayStateEm 枚举
            this.bound = [0, 1]; //动画播放区间（二元素数组）
            this.speed = 1.0; //动画播放速度
        }
    }
    ExtModule.REAnimCtlInfo = REAnimCtlInfo;

    /**
     * 设置一组动画控制
     * @param {REAnimCtlInfo} animCtlInfo //动画控制信息（REAnimCtlInfo 类型）
     */
    Module.Entity.setAnimCtlByGroup = function (animCtlInfo) {
        if (isEmptyLog(animCtlInfo.dataSetId, 'dataSetId')) return;
        if (isEmptyLog(animCtlInfo.elemId, 'elemId')) return;
        if (isEmptyLog(animCtlInfo.groupName, 'groupName')) return;

        let _dataSetId = isEmpty(animCtlInfo.dataSetId) ? '' : animCtlInfo.dataSetId;
        let _elemId = isEmpty(animCtlInfo.elemId) ? 0 : animCtlInfo.elemId;
        let _groupName = isEmpty(animCtlInfo.groupName) ? '' : animCtlInfo.groupName;
        let _animPlayMode = isEmpty(animCtlInfo.animPlayMode) ? eval(REEntityAnimPlayModeEm.REPEATTURN) : eval(animCtlInfo.animPlayMode);
        let _animPlayState = isEmpty(animCtlInfo.animPlayState) ? eval(REEntityAnimPlayStateEm.PAUSE) : eval(animCtlInfo.animPlayState);
        let _bound = isEmpty(animCtlInfo.bound) ? [0, 1] : animCtlInfo.bound;
        let _speed = isEmpty(animCtlInfo.speed) ? 1.0 : animCtlInfo.speed;

        Module.RealBIMWeb.SetEntityAnimCtlByGroup(_dataSetId, _elemId, _groupName, _animPlayMode, _animPlayState, _bound, _speed);
    };

    /**
     * 设置一组动画位置
     * @param {String} dataSetId //数据集标识
     * @param {Number} elemId //构件唯一标识
     * @param {String} groupName //组名称
     * @param {Number} pos //动画播放位置
     */
    Module.Entity.setAnimPosByGroup = function (dataSetId, elemId, groupName, pos) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemId, 'elemId')) return;
        if (isEmptyLog(groupName, 'groupName')) return;

        let _dataSetId = isEmpty(dataSetId) ? '' : dataSetId;
        let _elemId = isEmpty(elemId) ? 0 : elemId;
        let _groupName = isEmpty(groupName) ? '' : groupName;
        let _pos = isEmpty(pos) ? 0 : pos;

        Module.RealBIMWeb.SetEntityAnimPosByGroup(_dataSetId, _elemId, _groupName, _pos);
    };

    /**
     * 获取一组动画位置
     * @param {String} dataSetId //数据集标识
     * @param {Number} elemId //构件唯一标识
     * @param {String} groupName //组名称
     */
    Module.Entity.getAnimPosByGroup = function (dataSetId, elemId, groupName) {
        if (isEmptyLog(dataSetId, 'dataSetId')) return;
        if (isEmptyLog(elemId, 'elemId')) return;
        if (isEmptyLog(groupName, 'groupName')) return;

        let _dataSetId = isEmpty(dataSetId) ? '' : dataSetId;
        let _elemId = isEmpty(elemId) ? 0 : elemId;
        let _groupName = isEmpty(groupName) ? '' : groupName;

        return Module.RealBIMWeb.GetEntityAnimPosByGroup(_dataSetId, _elemId, _groupName);
    };

    if (hasEntityAniEdit) {
        // MARK 骨骼动画
        class REEntityAnimInfo {
            // 单构件动画信息
            constructor() {
                this.dataSetId = null; // 数据集标识
                this.elemId = null; // 构件唯一标识
                this.animLevel = 0; // 动画级别 0：世界空间动画  1：自身动画
                this.boneInfoList = null; //骨骼信息集合（REBoneInfo 类型）
                this.selfAnimNameList = null; //自身动画名称标识列表，世界空间动画无效，自身关键帧序列集合的数量和自身动画名称标识列表数量相同，且顺序相同
            }
        }
        ExtModule.REEntityAnimInfo = REEntityAnimInfo;

        class REBoneInfo {
            // 骨骼信息
            constructor() {
                this.linkInstId = null; // 关联实例标识
                this.boneName = null; //骨骼标识名
                this.parentName = null; //父骨骼标识名
                this.trackSeqName = null; //骨骼关联的轨道序列信息标识名
                this.keySeqList = null; //骨骼关联的关键帧序列集合（REKeySeqInfo 类型）
                this.refTimeLen = null; //当前轨道的参考播放时长
            }
        }
        ExtModule.REBoneInfo = REBoneInfo;

        class REKeySeqInfo {
            // 关键帧序列信息
            constructor() {
                this.keyFrameList = null; //关键帧序列信息 (REKeyFrameInfo 类型)
            }
        }
        ExtModule.REKeySeqInfo = REKeySeqInfo;

        class REKeyFrameInfo {
            // 关键帧信息
            constructor() {
                this.pos = 0; // 该关键帧对应的相对播放位置(0~1)
                this.scale = [1.0, 1.0, 1.0]; //该关键帧对应缩放信息
                this.rotate = [0.0, 0.0, 0.0, 1.0]; //该关键帧对应旋转信息
                this.offset = [0.0, 0.0, 0.0]; //该关键帧对应平移信息
            }
        }
        ExtModule.REKeyFrameInfo = REKeyFrameInfo;

        /**
         * 设置单构件骨骼动画信息
         * @param {REEntityAnimInfo} animInfo // 单构件动画信息（REEntityAnimInfo 类型）
         */
        Module.Entity.setAniInfo = function (animInfo) {
            if (isEmptyLog(animInfo, 'animInfo')) return;
            if (isEmptyLog(animInfo.dataSetId, 'dataSetId')) return;
            if (isEmptyLog(animInfo.elemId, 'elemId')) return;
            if (!checkTypeLog(animInfo.boneInfoList, 'boneInfoList', RE_Enum.RE_Check_Array)) return;
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(animInfo.dataSetId);

            let _vector_bone = new Module.RE_Vector_ENTITY_BONE_INFO_W();
            for (let i = 0; i < animInfo.boneInfoList.length; i++) {
                const boneInfo = animInfo.boneInfoList[i];
                if (isEmptyLog(boneInfo.linkInstId, 'linkInstId')) return;
                if (isEmptyLog(boneInfo.boneName, 'boneName')) return;
                if (!checkTypeLog(boneInfo.keySeqList, 'keySeqList', RE_Enum.RE_Check_Array)) return;

                let _vector_key_seq = new Module.RE_Vector_KEY_SEQ();
                for (let j = 0; j < boneInfo.keySeqList.length; j++) {
                    const keySeq = boneInfo.keySeqList[j];
                    if (!checkTypeLog(keySeq.keyFrameList, 'keyFrameList', RE_Enum.RE_Check_Array)) return;

                    let _vector_key_frame = new Module.RE_Vector_KEY_FRAME();
                    for (let k = 0; k < keySeq.keyFrameList.length; k++) {
                        const keyFrame = keySeq.keyFrameList[k];
                        let cKeyFrame = {
                            m_dPos: keyFrame.pos,
                            m_vScale: keyFrame.scale,
                            m_qRotate: keyFrame.rotate,
                            m_vOffset: keyFrame.offset,
                        };
                        _vector_key_frame.push_back(cKeyFrame);
                    }
                    let _cKeySeq = { m_arrKeys: _vector_key_frame };
                    _vector_key_seq.push_back(_cKeySeq);
                }
                let cKeySeqSet = {
                    m_arrKeySeqs: _vector_key_seq,
                };
                let _cBoneInfo = {
                    m_uInstID_L32: boneInfo.linkInstId,
                    m_uInstID_H32: _projid,
                    m_strBoneName: boneInfo.boneName,
                    m_strParentName: isEmpty(boneInfo.parentName) ? '' : boneInfo.parentName,
                    m_strTrackSeqName: isEmpty(boneInfo.trackSeqName) ? '' : boneInfo.trackSeqName,
                    m_sKeySeqSet: cKeySeqSet,
                    m_dRefTimeLen: boneInfo.refTimeLen,
                };
                _vector_bone.push_back(_cBoneInfo);
            }
            let _vector_selfAnimName = new Module.RE_Vector_WStr();
            let _animLevel = isEmpty(animInfo.animLevel) ? 0 : animInfo.animLevel;
            let _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.WOELD_LEVEL;
            if (_animLevel == 1) {
                _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.SELF_LEVEL;
                if (!checkTypeLog(animInfo.selfAnimNameList, 'selfAnimNameList', RE_Enum.RE_Check_Array)) return;
                for (let i = 0; i < animInfo.selfAnimNameList.length; i++) {
                    _vector_selfAnimName.push_back(animInfo.selfAnimNameList[i]);
                }
            }
            let _cAniInfo = {
                m_arrBoneInfos: _vector_bone,
                m_arrSelfAniNames: _vector_selfAnimName,
            };

            Module.RealBIMWeb.EditEntityAni(animInfo.dataSetId, animInfo.elemId, _cAniInfo, _eAniLevel);
        };

        /**
         * 获取单构件骨骼动画信息
         * @param {String} dataSetId //数据集标识，必填
         * @param {Number} elemId //构件id，必填
         * @param {Number} animLevel // 动画级别 0：世界空间动画  1：自身动画
         */
        Module.Entity.getAniInfo = function (dataSetId, elemId, animLevel) {
            if (isEmptyLog(dataSetId, 'dataSetId')) return;
            if (isEmptyLog(elemId, 'elemId')) return;
            if (isEmptyLog(animLevel, 'animLevel')) return;
            let _animLevel = isEmpty(animLevel) ? 0 : animLevel;
            let _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.WOELD_LEVEL;
            if (_animLevel == 1) {
                _eAniLevel = Module.RE_ENTITY_ANI_LEVEL.SELF_LEVEL;
            }
            const _cAnimInfo = Module.RealBIMWeb.GetEntityAniInfo(dataSetId, elemId, _eAniLevel);
            let boneInfoList = [];
            for (let i = 0; i < _cAnimInfo.m_arrBoneInfos.size(); i++) {
                const _cBoneInfo = _cAnimInfo.m_arrBoneInfos.get(i);

                let keySeqList = [];
                for (let j = 0; j < _cBoneInfo.m_sKeySeqSet.m_arrKeySeqs.size(); j++) {
                    const _cKeySeq = _cBoneInfo.m_sKeySeqSet.m_arrKeySeqs.get(j);

                    let keyFrameList = [];
                    for (let k = 0; k < _cKeySeq.m_arrKeys.size(); k++) {
                        const _cKey = _cKeySeq.m_arrKeys.get(k);
                        let keyFrameInfo = new Module.REKeyFrameInfo();
                        keyFrameInfo.pos = _cKey.m_dPos;
                        keyFrameInfo.scale = _cKey.m_vScale;
                        keyFrameInfo.rotate = _cKey.m_qRotate;
                        keyFrameInfo.offset = _cKey.m_vOffset;
                        keyFrameList.push(keyFrameInfo);
                    }
                    let keySeqInfo = new Module.REKeySeqInfo();
                    keySeqInfo.keyFrameList = keyFrameList;

                    keySeqList.push(keySeqInfo);
                }

                let boneInfo = new Module.REBoneInfo();
                boneInfo.linkInstId = _cBoneInfo.m_uInstID_L32;
                boneInfo.boneName = _cBoneInfo.m_strBoneName;
                boneInfo.parentName = _cBoneInfo.m_strParentName;
                boneInfo.trackSeqName = _cBoneInfo.m_strTrackSeqName;
                boneInfo.keySeqList = keySeqList;
                boneInfo.refTimeLen = _cBoneInfo.m_dRefTimeLen;
                boneInfoList.push(boneInfo);
            }
            let selfAnimNameList = [];
            for (let i = 0; i < _cAnimInfo.m_arrSelfAniNames.size(); i++) {
                selfAnimNameList.push(_cAnimInfo.m_arrSelfAniNames.get(i));
            }

            let animInfo = new Module.REEntityAnimInfo();
            animInfo.dataSetId = dataSetId;
            animInfo.elemId = elemId;
            animInfo.animLevel = animLevel;
            animInfo.boneInfoList = boneInfoList;
            animInfo.selfAnimNameList = selfAnimNameList;
            return animInfo;
        };
    }

    // MOD-- 挤出（Extrude） <---
    Module.Extrude = typeof Module.Extrude !== 'undefined' ? Module.Extrude : {}; //增加 Extrude 模块

    // MARK 加载
    class REExtrudeInfo {
        constructor() {
            this.extrudeId = null; // 挤出标识
            this.dataSetIdList = null; //数据集标识集合，挤出作用有效的范围
            this.rgnList = null; // 挤出区域集合，每个区域由点集合构成（至少三个点），一个挤出表示可以由多个区域构成
            this.depthLimitRange = [-1e10, 1e10]; //挤出区域面Z值偏移范围，包含在偏移范围内的模型即为有效（只作用于挖坑效果，其余效果无用），[区域面下方，区域面上方]，负值为向下，正值为向上，例如：区域面的Z高度为2，偏移范围为[-2,3]，即为以这个区域面高度为基准，X值为向下偏移2和Y值向上偏移3的范围内的模型为有效模型，不在这个范围内的模型无效
            this.type = 2; //挤出类型 0：挖空（无封口） 1：拍平（简易投射） 2：挖坑（使用指定纹理封口）
            this.texId = null; // 纹理id 由 addExtrudeFaceTex 返回的id
            this.texPath = null; // 纹理路径
            this.texSize = null; // 纹理大小
        }
    }
    ExtModule.REExtrudeInfo = REExtrudeInfo;

    /**
     * 设置挤出区域对象集合
     * @param {Array} extrudeInfoList //挤出信息集合 （REExtrudeInfo 类型）
     */
    Module.Extrude.setData = function (extrudeInfoList) {
        if (!checkTypeLog(extrudeInfoList, 'extrudeInfoList', RE_Enum.RE_Check_Array)) return;

        let _vector_extrudeRgn = new Module.RE_Vector_ExtrudeRgnInfo();
        for (let i = 0; i < extrudeInfoList.length; i++) {
            let _extrude_obj = extrudeInfoList[i];
            if (isEmptyLog(_extrude_obj.extrudeId, 'extrudeId')) return false;
            if (isEmptyLog(_extrude_obj.rgnList, 'rgnList')) return false;
            if (isEmptyLog(_extrude_obj.dataSetIdList, 'dataSetIdList')) return false;

            let _vector_vector_m_arrCorners = new Module.RE_Vector_Vector_dvec3();
            _extrude_obj.rgnList.forEach((rgn) => {
                let _vector_m_arrCorner = new Module.RE_Vector_dvec3();
                rgn.forEach((corner) => {
                    _vector_m_arrCorner.push_back(corner);
                });
                _vector_vector_m_arrCorners.push_back(_vector_m_arrCorner);
            });

            let _vector_m_arrProjName = new Module.RE_Vector_WStr();
            _extrude_obj.dataSetIdList.forEach((dataSetId) => {
                _vector_m_arrProjName.push_back(dataSetId);
            });

            let _texId = isEmpty(_extrude_obj.texId) ? 0 : _extrude_obj.texId;
            if (!isEmpty(_extrude_obj.texPath)) {
                let _size = isEmpty(_extrude_obj.texSize) ? [0, 0] : _extrude_obj.texSize;
                _texId = Module.Extrude.addExtrudeFaceTex(_extrude_obj.texPath, _size);
            }

            let _m_uProjType = isEmpty(_extrude_obj.type) ? 0 : _extrude_obj.type;
            let _m_bSimpMode = _m_uProjType == 1 ? true : false;
            let _m_vMinMaxRange = [-1e10, 1e10];
            if (_m_uProjType == 0) {
                _m_vMinMaxRange = isEmpty(_extrude_obj.depthLimitRange) ? [-1e10, 1e10] : _extrude_obj.depthLimitRange;
            }

            let cExtrude = {
                m_strName: _extrude_obj.extrudeId,
                m_vProjDir: [0.0, 0.0, 1.0],
                m_bSimpMode: _m_bSimpMode,
                m_uTextID: _texId,
                m_vMinMaxRange: _m_vMinMaxRange,
                m_uProjType: _m_uProjType,
                m_arrCorners: _vector_vector_m_arrCorners,
                m_arrProjName: _vector_m_arrProjName,
                m_bShowShp: false,
            };
            _vector_extrudeRgn.push_back(cExtrude);
        }
        Module.RealBIMWeb.SetExtrudeRgn(_vector_extrudeRgn);
    };

    /**
     * 获取当前场景挤出区域对象集合
     * @param {Array} extrudeIdList // 挤出标识集合
     */
    Module.Extrude.getData = function (extrudeIdList) {
        let _vector_extrude_id = new Module.RE_Vector_WStr();
        extrudeIdList.forEach((element) => {
            _vector_extrude_id.push_back(element);
        });

        const _vector_extrudeRgnInfo = Module.RealBIMWeb.GetExtrudeRgn(_vector_extrude_id);
        let extrudeInfoList = [];
        for (let i = 0; i < _vector_extrudeRgnInfo.size(); i++) {
            const _cExtrudeRgn = _vector_extrudeRgnInfo.get(i);

            let _rgn_list = [];
            for (let j = 0; j < _cExtrudeRgn.m_arrCorners.size(); j++) {
                const _arrCornerRgn = _cExtrudeRgn.m_arrCorners.get(j);
                let cornerList = [];
                for (let k = 0; k < _arrCornerRgn.size(); k++) {
                    const _cCorner = _arrCornerRgn.get(k);
                    cornerList.push(_cCorner);
                }
                _rgn_list.push(cornerList);
            }
            let _dataSetIdList = [];
            for (let j = 0; j < _cExtrudeRgn.m_arrProjName.size(); j++) {
                _dataSetIdList.push(_cExtrudeRgn.m_arrProjName.get(j));
            }

            let extrudeInfo = new Module.REExtrudeInfo();
            extrudeInfo.extrudeId = _cExtrudeRgn.m_strName;
            extrudeInfo.dataSetIdList = _dataSetIdList;
            extrudeInfo.rgnList = _rgn_list;
            extrudeInfo.depthLimitRange = _cExtrudeRgn.m_vMinMaxRange;
            extrudeInfo.type = _cExtrudeRgn.m_uProjType;
            extrudeInfo.texId = _cExtrudeRgn.m_uTextID;
            extrudeInfoList.push(extrudeInfo);
        }

        return extrudeInfoList;
    };

    /**
     * 根据标识删除指定挤出区域
     * @param {Array} extrudeIdList // 挤出标识集合，空数组代表删除所有
     */
    Module.Extrude.delData = function (extrudeIdList) {
        if (!checkTypeLog(extrudeIdList, 'extrudeIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_extrude_id = new Module.RE_Vector_WStr();
        extrudeIdList.forEach((element) => {
            _vector_extrude_id.push_back(element);
        });
        return Module.RealBIMWeb.DelExtrudeRgn(_vector_extrude_id);
    };

    /**
     * 获取所有挤出区域标识
     */
    Module.Extrude.getAllExtrudeId = function () {
        const _vector_extrude_id = Module.RealBIMWeb.GetAllExtrudeRgnName();
        let _extrudeIdList = [];
        for (let i = 0; i < _vector_extrude_id.size(); i++) {
            _extrudeIdList.push(_vector_extrude_id.get(i));
        }
        return _extrudeIdList;
    };

    /**
     * 获取当前编辑的挤出区域标识
     */
    Module.Extrude.getCurExtrudeId = function () {
        return Module.RealBIMWeb.GetCurExtrudeRgnName();
    };

    /**
     * 添加挤出面上使用的纹理
     * @param {String} picPath //纹理路径
     * @param {Array} size //纹理大小
     */
    Module.Extrude.addExtrudeFaceTex = function (picPath, size) {
        if (isEmptyLog(picPath, 'picPath')) return;
        let _size = isEmpty(size) ? [0, 0] : size;
        return Module.RealBIMWeb.AddAExtrudeRgnFaceTex(picPath, _size);
    };

    /**
     * 清除挤出面使用的纹理
     */
    Module.Extrude.delAllExtrudeFaceTex = function () {
        return Module.RealBIMWeb.ClearExtrudeRgnFaceTex();
    };

    /**
     * 获取错误绘制的挤出区域的标识集合
     */
    Module.Extrude.getErrorDrawExtrudeIds = function () {
        const _vector_extrude_name = Module.RealBIMWeb.GetErrorExtrudeName();
        let _extrudeNameList = [];
        for (let i = 0; i < _vector_extrude_name.size(); i++) {
            _extrudeNameList.push(_vector_extrude_name.get(i));
        }
        return _extrudeNameList;
    };

    // MARK 编辑
    /**
     * 进入挤出编辑状态
     */
    Module.Extrude.startEditState = function () {
        return Module.RealBIMWeb.BeginExtrudeRgnEdit();
    };

    /**
     * 退出挤出编辑状态
     */
    Module.Extrude.endEditState = function () {
        return Module.RealBIMWeb.EndExtrudeRgnEdit();
    };

    /**
     * 进入挤出添加状态
     * @param {String} extrudeId //挤出唯一标识
     */
    Module.Extrude.startAddExtrudeState = function (extrudeId) {
        return Module.RealBIMWeb.BeginAddExtrudeRgn(extrudeId);
    };

    /**
     * 退出挤出添加状态
     */
    Module.Extrude.endAddExtrudeState = function () {
        return Module.RealBIMWeb.EndAddExtrudeRgn();
    };

    /**
     * 设置指定挤出区域使用的纹理标识
     * @param {String} extrudeId //挤出唯一标识
     * @param {Number} texId //纹理id 由 addExtrudeFaceTex 返回的id
     */
    Module.Extrude.setExtrudeTexId = function (extrudeId, texId) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        if (isEmptyLog(texId, 'texId')) return;
        return Module.RealBIMWeb.SetExtrudeRgnTexID(extrudeId, texId);
    };

    /**
     * 获取指定挤出区域使用的纹理标识
     * @param {String} extrudeId //挤出唯一标识
     */
    Module.Extrude.getExtrudeTexId = function (extrudeId) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        return Module.RealBIMWeb.GetExtrudeRgnTexID(extrudeId);
    };

    /**
     * 设置挤出深度限制范围
     * @param {String} extrudeId //挤出唯一标识
     * @param {ivec2} range //深度限制范围
     */
    Module.Extrude.setDepthLimitRange = function (extrudeId, range) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        if (isEmptyLog(range, 'range')) return;
        return Module.RealBIMWeb.SetExtrudeRgnMinMax(extrudeId, range);
    };

    /**
     * 获取挤出深度限制范围
     * @param {String} extrudeId //挤出唯一标识
     */
    Module.Extrude.getDepthLimitRange = function (extrudeId) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        return Module.RealBIMWeb.GetExtrudeRgnMinMax(extrudeId);
    };

    // MARK 渲染效果
    /**
     * 设置指定挤出显示类型  注：要在进入挤出编辑状态之后有效, 只能改变当前已有的挤出对象
     * @param {Array} extrudeIdList //挤出标识集合，空数组代表所有
     * @param {Number} showState //显示状态（默认几何矢量状态），0：显示几何矢量  1：显示渲染效果
     */
    Module.Extrude.setShowState = function (extrudeIdList, showState) {
        if (!checkTypeLog(extrudeIdList, 'extrudeIdList', RE_Enum.RE_Check_Array)) return;
        var _vector_extrudeId = new Module.RE_Vector_WStr();
        extrudeIdList.forEach((element) => {
            _vector_extrudeId.push_back(element);
        });
        let _showState = isEmpty(showState) ? true : showState == 1 ? false : true;
        return Module.RealBIMWeb.SetExtrudeRgnShowState(_vector_extrudeId, _showState);
    };

    /**
     * 获取指定挤出状态的所有标识集合 注：要在进入挤出编辑状态之后有效
     * @param {Number} showState //显示状态（默认几何矢量状态），0：显示几何矢量  1：显示渲染效果
     */
    Module.Extrude.getIdsByShowState = function (showState) {
        let _showState = isEmpty(showState) ? true : showState == 1 ? false : true;
        const _vector_extrudeId = Module.RealBIMWeb.GetExtrudeRgnIDByShowState(_showState);
        let _extrudeIdList = [];
        for (let i = 0; i < _vector_extrudeId.size(); i++) {
            _extrudeIdList.push(_vector_extrudeId.get(i));
        }
        return _extrudeIdList;
    };

    /**
     * 设置挤出区域作用的数据集集合
     * @param {String} extrudeId //挤出唯一标识，空字符串代表默认通用挤出区域
     * @param {Array} dataSetIdList // 数据集标识集合，挤出作用有效的范围，空数组代表所有数据集
     */
    Module.Extrude.setDataSetScope = function (extrudeId, dataSetIdList) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        if (!checkTypeLog(dataSetIdList, 'dataSetIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_dataSet_id = new Module.RE_Vector_WStr();
        dataSetIdList.forEach((element) => {
            _vector_dataSet_id.push_back(element);
        });
        if (extrudeId.length > 0) {
            Module.RealBIMWeb.SetExtrudeRgnApplyProj(extrudeId, _vector_dataSet_id);
        } else {
            Module.RealBIMWeb.SetExtrudeDefaultProjNames(_vector_dataSet_id);
        }
    };

    /**
     * 获取挤出区域作用的数据集集合
     * @param {String} extrudeId //挤出唯一标识，空字符串代表默认通用挤出区域
     */
    Module.Extrude.getDataSetScope = function (extrudeId) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        let _vector_dataSet_id = null;
        if (extrudeId.length > 0) {
            _vector_dataSet_id = Module.RealBIMWeb.GetExtrudeRgnApplyProj(extrudeId);
        } else {
            _vector_dataSet_id = Module.RealBIMWeb.GetExtrudeDefaultProjNames();
        }
        let _dataSetIdList = [];
        for (let i = 0; i < _vector_dataSet_id.size(); i++) {
            _dataSetIdList.push(_vector_dataSet_id.get(i));
        }
        return _dataSetIdList;
    };

    /**
     * 设置挤出展示的类型
     * @param {String} extrudeId //挤出标识
     * @param {Number} type //挤出类型 0：挖洞（挖空无封口） 1：拍平（简易投射） 2：挖坑（使用指定纹理封口）
     */
    Module.Extrude.setShowType = function (extrudeId, type) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        return Module.RealBIMWeb.SetExtrudeRgnType(extrudeId, type);
    };

    /**
     * 获取挤出展示的类型
     * @param {String} extrudeId //挤出标识
     */
    Module.Extrude.getShowType = function (extrudeId) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        return Module.RealBIMWeb.GetExtrudeRgnType(extrudeId);
    };

    /**
     * 设置指定挤出对象的可见性
     * @param {String} extrudeId //挤出标识
     * @param {Boolean} visible //是否可见
     */
    Module.Extrude.setVisible = function (extrudeId, visible) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        return Module.RealBIMWeb.SetExtrudeVisible(extrudeId, visible);
    };

    /**
     * 获取指定挤出对象的可见性
     * @param {String} extrudeId //挤出标识
     */
    Module.Extrude.getVisible = function (extrudeId) {
        if (isEmptyLog(extrudeId, 'extrudeId')) return;
        return Module.RealBIMWeb.GetExtrudeVisible(extrudeId);
    };

    // MARK 相机
    /**
     * 根据挤出标识定位到挤出区域
     * @param {Array} extrudeIdList // 挤出标识集合，空数组无效
     */
    Module.Extrude.setCamToData = function (extrudeIdList) {
        if (!checkTypeLog(extrudeIdList, 'extrudeIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_extrude_id = new Module.RE_Vector_WStr();
        extrudeIdList.forEach((element) => {
            _vector_extrude_id.push_back(element);
        });
        return Module.RealBIMWeb.LocateToExtrudeRgn(_vector_extrude_id);
    };

    // MOD-- 单体化（Monomer） <---
    Module.Monomer = typeof Module.Monomer !== 'undefined' ? Module.Monomer : {}; //增加 Monomer 模块

    // MARK 加载
    class REMonomerInfo {
        constructor() {
            this.monomerId = null; //单体化矢量标识
            this.dataSetId = null; //数据集标识
            this.rgnList = null; // 单体化区域集合，每个区域由点集合构成（至少三个点），一个单体化表示可以由多个区域构成
            this.heightMin = null; //包围体最小高度
            this.heightMax = null; //包围体最大高度
            this.faceClr = null; //面颜色（REColor类型）
            this.lineClr = null; //线颜色（REColor类型），仅盒子模式有效
            this.expandDist = null; //表示单体化区域的边界扩充距离
            this.showState = null; //显示类型（默认为1）, 0：显示几何矢量效果（仅在编辑模式下有效），1：显示贴合模型效果，2：显示包围盒效果
        }
    }
    ExtModule.REMonomerInfo = REMonomerInfo;

    /**
     * 设置单体化区域对象集合
     * @param {Array} monomerInfoList //单体化信息集合 （REMonomerInfo 类型）
     */
    Module.Monomer.setData = function (monomerInfoList) {
        if (!checkTypeLog(monomerInfoList, 'monomerInfoList', RE_Enum.RE_Check_Array)) return;

        let _vector_monomerRgn = new Module.RE_Vector_MonomerRgn();
        for (let i = 0; i < monomerInfoList.length; i++) {
            const _monomer_obj = monomerInfoList[i];
            if (isEmptyLog(_monomer_obj.monomerId, 'monomerId')) return false;
            if (isEmptyLog(_monomer_obj.rgnList, 'rgnList')) return false;
            if (isEmptyLog(_monomer_obj.dataSetId, 'dataSetId')) return false;

            let _vector_vector_m_arrCorners = new Module.RE_Vector_Vector_dvec3();
            _monomer_obj.rgnList.forEach((rgn) => {
                let _vector_m_arrCorner = new Module.RE_Vector_dvec3();
                rgn.forEach((corner) => {
                    _vector_m_arrCorner.push_back(corner);
                });
                _vector_vector_m_arrCorners.push_back(_vector_m_arrCorner);
            });

            let _faceClr = isEmpty(_monomer_obj.faceClr) ? 0x7fffffff : clrToU32(_monomer_obj.faceClr);
            let _lineClr = isEmpty(_monomer_obj.lineClr) ? 0x7fffffff : clrToU32(_monomer_obj.lineClr);
            let _expandDist = isEmpty(_monomer_obj.expandDist) ? 0 : _monomer_obj.expandDist;
            let _showState = isEmpty(_monomer_obj.showState) ? 1 : _monomer_obj.showState;

            let cMonomer = {
                m_strName: _monomer_obj.monomerId,
                m_strProjName: _monomer_obj.dataSetId,
                m_arrCorners: _vector_vector_m_arrCorners,
                m_dHeightMin: _monomer_obj.heightMin,
                m_dHeightMax: _monomer_obj.heightMax,
                m_uFaceClr: _faceClr,
                m_uLineClr: _lineClr,
                m_fExpandDist: _expandDist,
                m_uShowState: _showState,
            };
            _vector_monomerRgn.push_back(cMonomer);
        }
        Module.RealBIMWeb.SetMonomerRgn(_vector_monomerRgn);
    };

    /**
     * 获取当前场景单体化区域对象集合
     * @param {Array} monomerIdList // 单体化标识集合，空数组代表所有
     */
    Module.Monomer.getData = function (monomerIdList) {
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });

        const _vector_monomerRgnInfo = Module.RealBIMWeb.GetMonomerRgn(_vector_monomer_id);
        let monomerInfoList = [];
        for (let i = 0; i < _vector_monomerRgnInfo.size(); i++) {
            const _cMonomerRgn = _vector_monomerRgnInfo.get(i);

            let _rgn_list = [];
            for (let j = 0; j < _cMonomerRgn.m_arrCorners.size(); j++) {
                const _arrCornerRgn = _cMonomerRgn.m_arrCorners.get(j);
                let cornerList = [];
                for (let k = 0; k < _arrCornerRgn.size(); k++) {
                    const _cCorner = _arrCornerRgn.get(k);
                    cornerList.push(_cCorner);
                }
                _rgn_list.push(cornerList);
            }

            let monomerInfo = new Module.REMonomerInfo();
            monomerInfo.monomerId = _cMonomerRgn.m_strName;
            monomerInfo.dataSetId = _cMonomerRgn.m_strProjName;
            monomerInfo.rgnList = _rgn_list;
            monomerInfo.heightMin = _cMonomerRgn.m_dHeightMin;
            monomerInfo.heightMax = _cMonomerRgn.m_dHeightMax;
            monomerInfo.faceClr = clrU32ToClr(_cMonomerRgn.m_uFaceClr);
            monomerInfo.lineClr = clrU32ToClr(_cMonomerRgn.m_uLineClr);
            monomerInfo.expandDist = _cMonomerRgn.m_fExpandDist;
            monomerInfo.showState = _cMonomerRgn.m_uShowState;
            monomerInfoList.push(monomerInfo);
        }

        return monomerInfoList;
    };

    /**
     * 获取所有单体化标识
     */
    Module.Monomer.getAllMonomerId = function () {
        const _vector_monomer_id = Module.RealBIMWeb.GetAllMonomerRgnName();
        let _monomerIdList = [];
        for (let i = 0; i < _vector_monomer_id.size(); i++) {
            _monomerIdList.push(_vector_monomer_id.get(i));
        }
        return _monomerIdList;
    };

    /**
     * 根据标识删除指定单体化区域
     * @param {Array} monomerIdList // 单体化标识集合，空数组代表删除所有
     */
    Module.Monomer.delData = function (monomerIdList) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });
        Module.RealBIMWeb.DelMonomerRgn(_vector_monomer_id);
    };

    /**
     * 获取错误绘制的单体化区域的标识集合
     */
    Module.Monomer.getErrorDrawMonomerIds = function () {
        const _vector_monomer_name = Module.RealBIMWeb.GetErrorMonomerRgnName();
        let _monomerNameList = [];
        for (let i = 0; i < _vector_monomer_name.size(); i++) {
            _monomerNameList.push(_vector_monomer_name.get(i));
        }
        return _monomerNameList;
    };

    // MARK 编辑
    /**
     * 进入单体化编辑状态
     */
    Module.Monomer.startEditState = function () {
        return Module.RealBIMWeb.BeginMonomerEdit();
    };

    /**
     * 退出单体化编辑状态
     */
    Module.Monomer.endEditState = function () {
        return Module.RealBIMWeb.EndMonomerEdit();
    };

    /**
     * 进入单体化添加状态
     * @param {String} monomerId //单体化唯一标识
     */
    Module.Monomer.startAddMonomerState = function (monomerId) {
        return Module.RealBIMWeb.BeginAddMonomer(monomerId);
    };

    /**
     * 退出单体化添加状态
     */
    Module.Monomer.endAddMonomerState = function () {
        return Module.RealBIMWeb.EndAddMonomer();
    };

    /**
     * 获取当前编辑的单体化标识
     */
    Module.Monomer.getCurMonomerId = function () {
        return Module.RealBIMWeb.GetCurMonomer();
    };

    /**
     * 设置当前编辑单体化应用的数据集名称，在 startAddMonomerState 之前进行设置，设置后全局有效
     * @param {String} dataSetId //数据集标识
     */
    Module.Monomer.setEditApplyDataSetId = function (dataSetId) {
        Module.RealBIMWeb.SetMonomerLinkProj(dataSetId);
    };

    /**
     * 获取当前编辑单体化应用的数据集名称
     */
    Module.Monomer.getEditApplyDataSetId = function () {
        return Module.RealBIMWeb.GetMonomerLinkProj();
    };

    /**
     * 设置默认单体化编辑时包围体最小最大高度（设置表示使用自动计算包围体高度，如果需要改成自动需要调用 setEditAutoCalcMinMaxHeight），在 startAddMonomerState 之前进行设置
     * @param {dvec2} minMaxHeight //包围体最小最大高度, [最小高度，最大高度]
     */
    Module.Monomer.setDefaultEditMinMaxHeight = function (minMaxHeight) {
        if (isEmptyLog(minMaxHeight, 'minMaxHeight')) return;
        Module.RealBIMWeb.SetMonomerMinMaxHeight(false, minMaxHeight);
    };

    /**
     * 获取默认单体化编辑时包围体最小最大高度
     */
    Module.Monomer.getDefaultEditMinMaxHeight = function () {
        return Module.RealBIMWeb.GetMonomerMinMaxHeight();
    };

    /**
     * 设置使用自动计算包围体高度（在设置 setEditMinMaxHeight 后如果需要自动模式需要手动设置），在 startAddMonomerState 之前进行设置
     */
    Module.Monomer.setEditAutoCalcMinMaxHeight = function () {
        Module.RealBIMWeb.SetMonomerMinMaxHeight(true, [0, 0]);
    };

    /**
     * 获取是否使用自动计算包围体高度
     */
    Module.Monomer.getEditAutoCalcMinMaxHeight = function () {
        return Module.RealBIMWeb.GetIsAutoCalcMonomerMinMaxHeight();
    };

    // MARK 渲染效果
    /**
     * 设置指定水面显示状态 注：要在进入单体化编辑状态之后有效, 只能改变当前已有的单体化对象
     * @param {Array} monomerIdList //单体化标识集合，空数组代表所有
     * @param {Number} showState //显示状态（默认几何矢量状态），0：显示几何矢量效果  1：显示贴合模型效果  2：显示包围盒效果
     */
    Module.Monomer.setShowState = function (monomerIdList, showState) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        var _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });
        let _showState = isEmpty(showState) ? 0 : showState;
        return Module.RealBIMWeb.SetMonomerShowState(_vector_monomer_id, _showState);
    };

    /**
     * 获取指定单体化状态的所有标识集合 注：要在进入单体化编辑状态之后有效
     * @param {Number} showState //显示状态（默认几何矢量状态），0：显示几何矢量效果  1：显示贴合模型效果  2：显示包围盒效果
     */
    Module.Monomer.getIdsByShowState = function (showState) {
        let _showState = isEmpty(showState) ? 0 : showState;
        const _vector_monomer_id = Module.RealBIMWeb.GetMonomerIDByShowState(_showState);
        let _monomerIdList = [];
        for (let i = 0; i < _vector_monomer_id.size(); i++) {
            _monomerIdList.push(_vector_monomer_id.get(i));
        }
        return _monomerIdList;
    };

    /**
     * 设置单体化数据的默认颜色，在 startAddMonomerState 之前进行设置，设置后全局有效
     * @param {REColor} faceClr //面颜色（REColor类型）
     * @param {REColor} lineClr //线颜色（REColor类型）
     */
    Module.Monomer.setDefaultClr = function (faceClr, lineClr) {
        if (isEmptyLog(faceClr, 'faceClr')) return;
        if (isEmptyLog(lineClr, 'lineClr')) return;
        let _faceClr = clrToU32(faceClr);
        let _lineClr = clrToU32(lineClr);
        Module.RealBIMWeb.SetMonomerDefaultClr(_faceClr, _lineClr);
    };

    /**
     * 获取单体化数据的默认颜色
     */
    Module.Monomer.getDefaultClr = function () {
        const _cInfo = Module.RealBIMWeb.GetMonomerDefaultClr();
        return { faceClr: clrU32ToClr(_cInfo.m_u32Value1), lineClr: clrU32ToClr(_cInfo.m_u32Value2) };
    };

    /**
     * 设置单体化颜色
     * @param {Array} monomerIdList // 单体化标识集合，空数组代表设置所有区域
     * @param {REColor} faceClr //面颜色（REColor类型）
     * @param {REColor} lineClr //线颜色（REColor类型）
     */
    Module.Monomer.setClr = function (monomerIdList, faceClr, lineClr) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        if (isEmptyLog(faceClr, 'faceClr')) return;
        if (isEmptyLog(lineClr, 'lineClr')) return;
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });
        let _faceClr = clrToU32(faceClr);
        let _lineClr = clrToU32(lineClr);

        Module.RealBIMWeb.SetMonomerRgnClr(_vector_monomer_id, _faceClr, _lineClr);
    };

    /**
     * 获取单体化颜色
     * @param {String} monomerId //单体化唯一标识
     */
    Module.Monomer.getClr = function (monomerId) {
        if (isEmptyLog(monomerId, 'monomerId')) return;

        const _cInfo = Module.RealBIMWeb.GetMonomerRgnClr(monomerId);
        return { faceClr: clrU32ToClr(_cInfo.m_u32Value1), lineClr: clrU32ToClr(_cInfo.m_u32Value2) };
    };

    /**
     * 设置单体化的可见性
     * @param {Array} monomerIdList // 单体化标识集合，空数组代表设置所有
     * @param {Boolean} visible // 是否可见
     */
    Module.Monomer.setVisible = function (monomerIdList, visible) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });
        let _visible = isEmpty(visible) ? true : visible;

        return Module.RealBIMWeb.SetMonomerRgnVisible(_vector_monomer_id, _visible);
    };

    /**
     * 获取单体化的可见性
     * @param {String} monomerId //单体化标识
     */
    Module.Monomer.getVisible = function (monomerId) {
        if (isEmptyLog(monomerId, 'monomerId')) return;
        return Module.RealBIMWeb.GetMonomerRgnVisible(monomerId);
    };

    /**
     * 设置指定单体化包围体的最小最大高度
     * @param {Array} monomerIdList // 单体化标识集合，空数组代表设置所有区域
     * @param {dvec2} minMaxHeight //包围体最小最大高度, [最小高度，最大高度]
     */
    Module.Monomer.setMinMaxHeight = function (monomerIdList, minMaxHeight) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        if (isEmptyLog(minMaxHeight, 'minMaxHeight')) return;
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });
        Module.RealBIMWeb.SetMonomerRgnMinMaxHeight(_vector_monomer_id, minMaxHeight);
    };

    /**
     * 获取指定单体化包围体的最小最大高度
     * @param {String} monomerId //单体化标识
     */
    Module.Monomer.getMinMaxHeight = function (monomerId) {
        if (isEmptyLog(monomerId, 'monomerId')) return;
        return Module.RealBIMWeb.GetMonomerRgnMinMaxHeight(monomerId);
    };

    /**
     * 设置指定单体化包围体的扩展距离
     * @param {String} monomerId //单体化标识
     * @param {Number} expandDist //扩展距离
     */
    Module.Monomer.setExpandDist = function (monomerId, expandDist) {
        if (isEmptyLog(monomerId, 'monomerId')) return;
        let _expandDist = isEmpty(expandDist) ? 0 : expandDist;
        return Module.RealBIMWeb.SetMonomerRgnExpandDist(monomerId, _expandDist);
    };

    /**
     * 获取指定单体化包围体的扩展距离
     * @param {String} monomerId //单体化标识
     */
    Module.Monomer.getExpandDist = function (monomerId) {
        if (isEmptyLog(monomerId, 'monomerId')) return;
        return Module.RealBIMWeb.GetMonomerRgnExpandDist(monomerId);
    };

    // MARK 选择集
    /**
     * 添加单体化区域到选择集中
     * @param {Array} monomerIdList // 单体化标识集合
     */
    Module.Monomer.addToSel = function (monomerIdList) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });

        Module.RealBIMWeb.AddMonomerRgnToSelection(_vector_monomer_id);
    };

    /**
     * 从选择集中删除单体化区域
     * @param {Array} monomerIdList // 单体化标识集合，空数组代表移除所有
     */
    Module.Monomer.delFromSel = function (monomerIdList) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });

        Module.RealBIMWeb.RemoveMonomerRgnFromSelection(_vector_monomer_id);
    };

    /**
     * 获取当前的选择集单体化标识集合
     */
    Module.Monomer.getAllCurSel = function () {
        const _vector_monomer_id = Module.RealBIMWeb.GetSelectedMonomerRgnName();
        let _monomerIdList = [];
        for (let i = 0; i < _vector_monomer_id.size(); i++) {
            _monomerIdList.push(_vector_monomer_id.get(i));
        }
        return _monomerIdList;
    };

    class REMonomerClrAttr {
        constructor() {
            this.faceClr = new REColor(255, 255, 255, 255); //面颜色（REColor类型）
            this.faceClrWeight = 255; //面颜色权重, 此权重要使用必须配合面颜色值存在（选填）
            this.faceAlphaWeight = 255; //面透明度权重, 此权重要使用必须配合面透明度值存在（选填）
            this.lineClr = new REColor(255, 255, 255, 255); //线颜色（REColor类型）（仅包围盒效果模式下有效）
            this.lineClrWeight = 255; //线颜色权重, 此权重要使用必须配合线颜色值存在（选填）
            this.lineAlphaWeight = 255; //线透明度权重, 此权重要使用必须配合线透明度值存在（选填）
        }
    }
    ExtModule.REMonomerClrAttr = REMonomerClrAttr;

    /**
     * 设置单体化选择集属性
     * @param {REMonomerClrAttr} selAttrInfo //选择集属性信息（REMonomerClrAttr 类型）
     */
    Module.Monomer.setSelAttr = function (selAttrInfo) {
        if (isEmptyLog(selAttrInfo, 'selAttrInfo')) return;
        if (isEmptyLog(selAttrInfo.faceClr, 'faceClr')) return;
        if (isEmptyLog(selAttrInfo.lineClr, 'lineClr')) return;
        let _clrWeight_face = isEmpty(selAttrInfo.faceClrWeight) ? 255 : selAttrInfo.faceClrWeight;
        let _alphaWeight_face = isEmpty(selAttrInfo.faceAlphaWeight) ? 255 : selAttrInfo.faceAlphaWeight;
        let _wbgr_u32_face = clrToU32_W_WBGR(selAttrInfo.faceClr, _clrWeight_face);
        let _wa_u32_face = alphaToU32_W_WA(selAttrInfo.faceClr.alpha, _alphaWeight_face);

        let _clrWeight_line = isEmpty(selAttrInfo.lineClrWeight) ? 255 : selAttrInfo.lineClrWeight;
        let _alphaWeight_line = isEmpty(selAttrInfo.lineAlphaWeight) ? 255 : selAttrInfo.lineAlphaWeight;
        let _wbgr_u32_line = clrToU32_W_WBGR(selAttrInfo.lineClr, _clrWeight_line);
        let _wa_u32_line = alphaToU32_W_WA(selAttrInfo.lineClr.alpha, _alphaWeight_line);

        Module.RealBIMWeb.SetSelMonomerClrInfo(_wbgr_u32_face, _wa_u32_face, _wbgr_u32_line, _wa_u32_line);
    };

    /**
     * 获取单体化选择集属性
     */
    Module.Monomer.getSelAttr = function () {
        const _cInfo = Module.RealBIMWeb.GetSelMonomerClrInfo();

        const _u32_wa_face = _cInfo.m_u16Value1;
        const _u32_wbgr_face = _cInfo.m_u32Value1;
        const obj_w_a_face = clrU32ToObj_W_A(_u32_wa_face);
        const obj_w_rbg_face = clrU32ToObj_W_RBG(_u32_wbgr_face);

        const _u32_wa_line = _cInfo.m_u16Value2;
        const _u32_wbgr_line = _cInfo.m_u32Value2;
        const obj_w_a_line = clrU32ToObj_W_A(_u32_wa_line);
        const obj_w_rbg_line = clrU32ToObj_W_RBG(_u32_wbgr_line);

        let selAttr = new Module.REMonomerClrAttr();
        selAttr.faceClr = new REColor(obj_w_rbg_face.int_R, obj_w_rbg_face.int_G, obj_w_rbg_face.int_B, obj_w_a_face.int_A);
        selAttr.faceClrWeight = obj_w_rbg_face.int_W;
        selAttr.faceAlphaWeight = obj_w_a_face.int_W;
        selAttr.lineClr = new REColor(obj_w_rbg_line.int_R, obj_w_rbg_line.int_G, obj_w_rbg_line.int_B, obj_w_a_line.int_A);
        selAttr.lineClrWeight = obj_w_rbg_line.int_W;
        selAttr.lineAlphaWeight = obj_w_a_line.int_W;
        return selAttr;
    };

    /**
     * 设置是否支持多选（Ctrl+点击）
     * @param {Boolean} multiSel //是否支持多选，true表示支持多选，false表示单选
     */
    Module.Monomer.setMultiSel = function (multiSel) {
        Module.RealBIMWeb.SetMultiSelMonomer(multiSel);
    };

    /**
     * 获取是否支持多选
     */
    Module.Monomer.getMultiSel = function () {
        return Module.RealBIMWeb.GetIsMultiSelMonomer();
    };

    /**
     * 设置单体化是否可以被选中
     * @param {Array} monomerIdList // 单体化标识集合，空数组代表设置所有
     * @param {Boolean} probeEnable // 是否可以探测，为true,表示可被探测；设为false,表示不可被探测
     */
    Module.Monomer.setCanProbe = function (monomerIdList, probeEnable) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });
        let _probeEnable = isEmpty(probeEnable) ? 1 : probeEnable;

        Module.RealBIMWeb.SetMonomerRgnProbeMask(_vector_monomer_id, _probeEnable);
    };

    /**
     * 获取单体化是否可以被选中
     * @param {String} monomerId //单体化标识
     */
    Module.Monomer.getCanProbe = function (monomerId) {
        if (isEmptyLog(monomerId, 'monomerId')) return;
        let _uProbeMask = Module.RealBIMWeb.GetMonomerRgnProbeMask(monomerId);
        return _uProbeMask > 0 ? true : false;
    };

    // MARK 高亮标记
    /**
     * 设置单体化高亮标记属性
     * @param {Array} monomerIdList // 单体化标识集合，空数组代表设置所有
     * @param {REMonomerClrAttr} highlightAttrInfo //高亮标记属性信息（REMonomerClrAttr 类型）
     */
    Module.Monomer.setHighlightAttr = function (monomerIdList, highlightAttrInfo) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        if (isEmptyLog(highlightAttrInfo, 'highlightAttrInfo')) return;
        if (isEmptyLog(highlightAttrInfo.faceClr, 'faceClr')) return;
        if (isEmptyLog(highlightAttrInfo.lineClr, 'lineClr')) return;

        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });

        let _clrWeight_face = isEmpty(highlightAttrInfo.faceClrWeight) ? 255 : highlightAttrInfo.faceClrWeight;
        let _alphaWeight_face = isEmpty(highlightAttrInfo.faceAlphaWeight) ? 255 : highlightAttrInfo.faceAlphaWeight;
        let _wbgr_u32_face = clrToU32_W_WBGR(highlightAttrInfo.faceClr, _clrWeight_face);
        let _wa_u32_face = alphaToU32_W_WA(highlightAttrInfo.faceClr.alpha, _alphaWeight_face);

        let _clrWeight_line = isEmpty(highlightAttrInfo.lineClrWeight) ? 255 : highlightAttrInfo.lineClrWeight;
        let _alphaWeight_line = isEmpty(highlightAttrInfo.lineAlphaWeight) ? 255 : highlightAttrInfo.lineAlphaWeight;
        let _wbgr_u32_line = clrToU32_W_WBGR(highlightAttrInfo.lineClr, _clrWeight_line);
        let _wa_u32_line = alphaToU32_W_WA(highlightAttrInfo.lineClr.alpha, _alphaWeight_line);

        Module.RealBIMWeb.SetHighlightMonomerRgn(_vector_monomer_id, _wbgr_u32_face, _wa_u32_face, _wbgr_u32_line, _wa_u32_line);
    };

    /**
     * 获取单体化高亮标记属性
     * @param {String} monomerId //单体化标识
     */
    Module.Monomer.getHighlightAttr = function (monomerId) {
        const _cInfo = Module.RealBIMWeb.GetHighlightMonomerRgn(monomerId);

        const _u32_wa_face = _cInfo.m_u16Value1;
        const _u32_wbgr_face = _cInfo.m_u32Value1;
        const obj_w_a_face = clrU32ToObj_W_A(_u32_wa_face);
        const obj_w_rbg_face = clrU32ToObj_W_RBG(_u32_wbgr_face);

        const _u32_wa_line = _cInfo.m_u16Value2;
        const _u32_wbgr_line = _cInfo.m_u32Value2;
        const obj_w_a_line = clrU32ToObj_W_A(_u32_wa_line);
        const obj_w_rbg_line = clrU32ToObj_W_RBG(_u32_wbgr_line);

        let selAttr = new Module.REMonomerClrAttr();
        selAttr.faceClr = new REColor(obj_w_rbg_face.int_R, obj_w_rbg_face.int_G, obj_w_rbg_face.int_B, obj_w_a_face.int_A);
        selAttr.faceClrWeight = obj_w_rbg_face.int_W;
        selAttr.faceAlphaWeight = obj_w_a_face.int_W;
        selAttr.lineClr = new REColor(obj_w_rbg_line.int_R, obj_w_rbg_line.int_G, obj_w_rbg_line.int_B, obj_w_a_line.int_A);
        selAttr.lineClrWeight = obj_w_rbg_line.int_W;
        selAttr.lineAlphaWeight = obj_w_a_line.int_W;
        return selAttr;
    };

    // MARK 相机
    /**
     * 根据单体化标识定位到单体化区域
     * @param {Array} monomerIdList // 单体化标识集合，空数组无效
     */
    Module.Monomer.setCamToData = function (monomerIdList) {
        if (!checkTypeLog(monomerIdList, 'monomerIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_monomer_id = new Module.RE_Vector_WStr();
        monomerIdList.forEach((element) => {
            _vector_monomer_id.push_back(element);
        });
        return Module.RealBIMWeb.LocateToMonomerRgn(_vector_monomer_id);
    };

    // MOD-- 矢量编辑（ShpEdit） <---
    Module.ShpEdit = typeof Module.ShpEdit !== 'undefined' ? Module.ShpEdit : {}; //增加 ShpEdit 模块

    // MARK 加载
    class REShpInfo {
        // 矢量信息
        constructor() {
            this.shpId = null; //矢量唯一标识
            this.shpClr = null; //矢量面颜色（REColor 类型）
            this.visible = true; //是否显示，默认显示
            this.rgnList = null; // 矢量区域集合，每个区域由点集合构成（至少三个点），一个矢量表示可以由多个区域构成
        }
    }
    ExtModule.REShpInfo = REShpInfo;

    /**
     * 设置矢量区域对象集合
     * @param {Array} shpInfoList //矢量信息集合 （REShpInfo 类型）
     */
    Module.ShpEdit.setData = function (shpInfoList) {
        if (!checkTypeLog(shpInfoList, 'shpInfoList', RE_Enum.RE_Check_Array)) return;

        let _vector_shpInfo = new Module.RE_Vector_RE_ShpInfo();
        for (let i = 0; i < shpInfoList.length; i++) {
            const _shp_obj = shpInfoList[i];
            if (isEmptyLog(_shp_obj.shpId, 'shpId')) return;
            if (isEmptyLog(_shp_obj.rgnList, 'rgnList')) return;

            let _vector_vector_m_arrCorners = new Module.RE_Vector_Vector_dvec3();
            _shp_obj.rgnList.forEach((rgn) => {
                let _vector_m_arrCorner = new Module.RE_Vector_dvec3();
                rgn.forEach((corner) => {
                    _vector_m_arrCorner.push_back(corner);
                });
                _vector_vector_m_arrCorners.push_back(_vector_m_arrCorner);
            });

            let _shpClr = isEmpty(_shp_obj.shpClr) ? 0x7fffffff : clrToU32(_shp_obj.shpClr);
            let _visible = isEmpty(_shp_obj.visible) ? true : clrToU32(_shp_obj.visible);

            let cShpInfo = {
                m_strName: _shp_obj.shpId,
                m_uClr: _shpClr,
                m_bVisible: _visible,
                m_arrCorners: _vector_vector_m_arrCorners,
            };
            _vector_shpInfo.push_back(cShpInfo);
        }
        Module.RealBIMWeb.SetShpInfo(_vector_shpInfo);
    };

    /**
     * 获取当前场景矢量区域对象集合
     * @param {Array} shpIdList // 矢量标识集合，空数组代表所有
     */
    Module.ShpEdit.getData = function (shpIdList) {
        let _vector_shp_id = new Module.RE_Vector_WStr();
        shpIdList.forEach((element) => {
            _vector_shp_id.push_back(element);
        });

        const _vector_shpInfo = Module.RealBIMWeb.GetShpInfo(_vector_shp_id);
        let shpInfoList = [];
        for (let i = 0; i < _vector_shpInfo.size(); i++) {
            const _cShpInfo = _vector_shpInfo.get(i);

            let _rgn_list = [];
            for (let j = 0; j < _cShpInfo.m_arrCorners.size(); j++) {
                const _arrCornerRgn = _cShpInfo.m_arrCorners.get(j);
                let cornerList = [];
                for (let k = 0; k < _arrCornerRgn.size(); k++) {
                    const _cCorner = _arrCornerRgn.get(k);
                    cornerList.push(_cCorner);
                }
                _rgn_list.push(cornerList);
            }

            let shpInfo = new Module.REShpInfo();
            shpInfo.shpId = _cShpInfo.m_strName;
            shpInfo.shpClr = clrU32ToClr(_cShpInfo.m_uClr);
            shpInfo.visible = _cShpInfo.m_bVisible;
            shpInfo.rgnList = _rgn_list;
            shpInfoList.push(shpInfo);
        }
        return shpInfoList;
    };

    /**
     * 获取所有矢量标识
     */
    Module.ShpEdit.getAllShpId = function () {
        const _vector_shp_id = Module.RealBIMWeb.GetAllShpName();
        let _shpIdList = [];
        for (let i = 0; i < _vector_shp_id.size(); i++) {
            _shpIdList.push(_vector_shp_id.get(i));
        }
        return _shpIdList;
    };

    /**
     * 根据标识删除指定矢量区域
     * @param {Array} shpIdList // 矢量标识集合，空数组代表删除所有
     */
    Module.ShpEdit.delData = function (shpIdList) {
        if (!checkTypeLog(shpIdList, 'shpIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_shp_id = new Module.RE_Vector_WStr();
        shpIdList.forEach((element) => {
            _vector_shp_id.push_back(element);
        });
        return Module.RealBIMWeb.DelShpInfo(_vector_shp_id);
    };

    /**
     * 获取错误绘制的矢量区域的标识集合
     */
    Module.ShpEdit.getErrorDrawShpIds = function () {
        const _vector_shp_id = Module.RealBIMWeb.GetErrorShpName();
        let _shpIdList = [];
        for (let i = 0; i < _vector_shp_id.size(); i++) {
            _shpIdList.push(_vector_shp_id.get(i));
        }
        return _shpIdList;
    };

    // MARK 编辑
    /**
     * 进入矢量编辑状态
     */
    Module.ShpEdit.startShpEditState = function () {
        return Module.RealBIMWeb.BeginShpEdit();
    };

    /**
     * 退出矢量编辑状态
     */
    Module.ShpEdit.endShpEditState = function () {
        return Module.RealBIMWeb.EndShpEdit();
    };

    /**
     * 进入矢量添加状态 注：暂时不支持单个标识包含多个区域的功能
     * @param {String} shpId //矢量唯一标识
     */
    Module.ShpEdit.startAddShpState = function (shpId) {
        if (Module.ShpEdit.getAllShpId().includes(shpId)) {
            logWarn('温馨提示：当前使用接口（ShpEdit.startAddShpState）暂时不支持单个标识包含多个区域的功能！');
            return;
        }
        return Module.RealBIMWeb.BeginAddShp(shpId);
    };

    /**
     * 退出矢量添加状态
     */
    Module.ShpEdit.endAddShpState = function () {
        return Module.RealBIMWeb.EndAddShp();
    };

    /**
     * 获取当前编辑的矢量标识
     */
    Module.ShpEdit.getCurShpId = function () {
        return Module.RealBIMWeb.GetCurShpName();
    };

    /**
     * 进入矢量切割状态 注：两点连线构成切割线对矢量面进行切割，切割暂不允许多层区域切割，即单个矢量id含有多个区域的数据，多区域矢量切割无效
     */
    Module.ShpEdit.startClipShpState = function () {
        return Module.RealBIMWeb.BeginTwoPtClipShp('TwoPtClipMode');
    };

    /**
     * 退出矢量切割状态
     */
    Module.ShpEdit.endClipShpState = function () {
        return Module.RealBIMWeb.EndTwoPtClipShp();
    };

    // MARK 渲染效果
    /**
     * 设置矢量的可见性
     * @param {String} shpId // 矢量标识
     * @param {Boolean} visible // 是否可见
     */
    Module.ShpEdit.setVisible = function (shpId, visible) {
        if (isEmptyLog(shpId, 'shpId')) return;
        let _visible = isEmpty(visible) ? true : visible;
        return Module.RealBIMWeb.SetShpVisible(shpId, _visible);
    };

    /**
     * 获取矢量的可见性
     * @param {String} shpId //矢量标识
     */
    Module.ShpEdit.getVisible = function (shpId) {
        if (isEmptyLog(shpId, 'shpId')) return;
        return Module.RealBIMWeb.GetShpVisible(shpId);
    };

    /**
     * 设置矢量区域颜色
     * @param {String} shpId //矢量标识
     * @param {REColor} shpClr //矢量颜色（REColor类型）
     */
    Module.ShpEdit.setShpClr = function (shpId, shpClr) {
        if (isEmptyLog(shpId, 'shpId')) return;
        if (isEmptyLog(shpClr, 'shpClr')) return;
        let _uClr = clrToU32(shpClr);
        return Module.RealBIMWeb.SetShpColor(shpId, _uClr);
    };

    /**
     * 获取矢量区域颜色
     * @param {String} shpId //矢量标识
     */
    Module.ShpEdit.getShpClr = function (shpId) {
        if (isEmptyLog(shpId, 'shpId')) return;
        let _uClr = Module.RealBIMWeb.GetShpColor(shpId);
        return clrU32ToClr(_uClr);
    };

    /**
     * 设置矢量区域切割随机颜色的可用颜色池 注：如果设置了颜色池，随机颜色只会在颜色池内随机，如果不设置则颜色随机
     * @param {Array} randomClrList //随机颜色集合（REColor类型）
     */
    Module.ShpEdit.setShpClipClrPool = function (randomClrList) {
        if (!checkTypeLog(randomClrList, 'randomClrList', RE_Enum.RE_Check_Array)) return;
        let _vector_shp_clr = new Module.RE_Vector_u32();
        randomClrList.forEach((element) => {
            _vector_shp_clr.push_back(clrToU32(element));
        });
        return Module.RealBIMWeb.SetShpClrPool(_vector_shp_clr);
    };

    /**
     * 获取矢量区域切割随机颜色的可用颜色池
     */
    Module.ShpEdit.getShpClipClrPool = function () {
        let _vector_shp_clr = Module.RealBIMWeb.GetShpClrPool();
        let _clrList = [];
        for (let i = 0; i < _vector_shp_clr.size(); i++) {
            _clrList.push(clrU32ToClr(_vector_shp_clr.get(i)));
        }
        return _clrList;
    };

    /**
     * 删除矢量区域切割随机颜色的可用颜色池
     */
    Module.ShpEdit.delShpClipClrPool = function () {
        Module.RealBIMWeb.DelShpClrPool();
    };

    // MARK 相机
    /**
     * 根据矢量标识定位到矢量区域
     * @param {Array} shpIdList // 矢量标识集合，空数组无效
     */
    Module.ShpEdit.setCamToData = function (shpIdList) {
        if (!checkTypeLog(shpIdList, 'shpIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_shp_id = new Module.RE_Vector_WStr();
        shpIdList.forEach((element) => {
            _vector_shp_id.push_back(element);
        });
        return Module.RealBIMWeb.LocateToShp(_vector_shp_id);
    };

    // MOD-- 粒子效果（Particle） <---
    Module.Particle = typeof Module.Particle !== 'undefined' ? Module.Particle : {}; //增加 Particle 模块

    // MARK 天气系统
    /**
     * 设置天气系统纹理信息
     * @param {String} texGroupId //纹理组标识，由 Particle.addTexGroup 添加的纹理组标识
     */
    Module.Particle.setWeatherSysTex = function (texGroupId) {
        if (isEmptyLog(texGroupId, 'texGroupId')) return;
        return Module.RealBIMWeb.SetWeatherParticleSysTex(texGroupId);
    };

    class REWeatherSysInfo {
        // 天气系统信息
        constructor() {
            this.weatherSysId = null; //天气系统标识
            this.descendSpeedRange = [0.0, 0.0]; //下降速度范围，【最大值，最小值】，最大值最小值相同表示下降速度为定值，不同表示范围随机
            this.disperseSpeedRange = [0.0, 0.0]; //分散速度范围，【最大值，最小值】，最大值最小值相同表示分散速度为定值，不同表示范围随机，数值符号代表方向，＋为正向，-为反向
            this.sizeRange = [0.0, 1.0]; //粒子半径范围，【最小值，最大值】，最大值最小值相同表示粒子大小为定值，不同表示范围随机
            this.texId = null; //对应纹理id（已经添加的纹理数组内的索引）
            this.level = 1; //对应粒子数量等级，从1开始，数值越大，粒子越多，范围【1，50】
        }
    }
    ExtModule.REWeatherSysInfo = REWeatherSysInfo;

    /**
     * 创建天气系统
     * @param {Array} weatherSysInfoList //天气系统信息集合（REWeatherSysInfo 类型）
     */
    Module.Particle.createWeatherSys = function (weatherSysInfoList) {
        if (isEmptyLog(weatherSysInfoList, 'weatherSysInfoList')) return false;
        let _arrWeatherSys = new Module.RE_Vector_WEATHER_PARTICLE_INFO();
        for (let i = 0; i < weatherSysInfoList.length; i++) {
            const weatherSysInfo = weatherSysInfoList[i];
            if (isEmptyLog(weatherSysInfo.weatherSysId, 'weatherSysId')) return false;
            if (!checkArrCountLog(weatherSysInfo.descendSpeedRange, 'descendSpeedRange', 2)) return false;
            if (!checkArrCountLog(weatherSysInfo.disperseSpeedRange, 'disperseSpeedRange', 2)) return false;
            if (!checkArrCountLog(weatherSysInfo.sizeRange, 'sizeRange', 2)) return false;
            if (isEmptyLog(weatherSysInfo.texId, 'texId')) return false;

            let _m_strName = weatherSysInfo.weatherSysId;

            let __descend_speed_min = isEmpty(weatherSysInfo.descendSpeedRange[0]) ? 0 : weatherSysInfo.descendSpeedRange[0];
            let __descend_speed_max = isEmpty(weatherSysInfo.descendSpeedRange[1]) ? 0 : weatherSysInfo.descendSpeedRange[1];
            let _descend_speed_random = __descend_speed_min == __descend_speed_max ? false : true;
            let _descend_speed_random_dis = __descend_speed_max - __descend_speed_min;
            let _m_vZSpeedRange = [0, 0];
            if (_descend_speed_random) {
                _m_vZSpeedRange = [__descend_speed_min, _descend_speed_random_dis];
            } else {
                _m_vZSpeedRange = [__descend_speed_min, 0];
            }

            let _disperse_speed_min = isEmpty(weatherSysInfo.disperseSpeedRange[0]) ? 0 : weatherSysInfo.disperseSpeedRange[0];
            let _disperse_speed_max = isEmpty(weatherSysInfo.disperseSpeedRange[1]) ? 0 : weatherSysInfo.disperseSpeedRange[1];
            let _disperse_speed_random = _disperse_speed_min == _disperse_speed_max ? false : true;
            let _disperse_speed_random_dis = _disperse_speed_max - _disperse_speed_min;
            let _disperse_direction_random = _disperse_speed_min < 0 && _disperse_speed_max > 0 ? true : false; //方向随机
            let _m_vXSpeedRange = [0.0, 0.0];
            if (_disperse_speed_random) {
                if (_disperse_direction_random) {
                    _m_vXSpeedRange = [_disperse_speed_min, _disperse_speed_random_dis];
                } else {
                    _m_vXSpeedRange = [_disperse_speed_min, _disperse_speed_random_dis];
                }
            } else {
                if (_disperse_direction_random) {
                    logWarn(
                        '温馨提示：当前使用接口（Particle.createWeatherSys）不可以操作分散速度不随机，分散方向随机操作，如果需求请创建两个天气系统'
                    );
                    return false;
                } else {
                    _m_vXSpeedRange = [_disperse_speed_min, 0];
                }
            }
            let _size_min = isEmpty(weatherSysInfo.sizeRange[0]) ? 0 : weatherSysInfo.sizeRange[0];
            let _size_max = isEmpty(weatherSysInfo.sizeRange[1]) ? 0 : weatherSysInfo.sizeRange[1];
            let _size_random_dis = _size_max - _size_min;
            let _size_random = _size_min == _size_max ? false : true;
            let _m_vSizeRange = [0.0, 0.0];
            if (_size_random) {
                _m_vSizeRange = [_size_min, _size_random_dis];
            } else {
                _m_vSizeRange = [_size_min, 0];
            }
            let _m_uTexID = isEmpty(weatherSysInfo.texId) ? 0 : weatherSysInfo.texId;
            let _m_uLevel = isEmpty(weatherSysInfo.level) ? 1 : weatherSysInfo.level;
            let _cWeatherParticleSysInfo = {
                m_strName: _m_strName,
                m_vXSpeedRange: _m_vXSpeedRange,
                m_vZSpeedRange: _m_vZSpeedRange,
                m_vSizeRange: _m_vSizeRange,
                m_uTexID: _m_uTexID,
                m_uLevel: _m_uLevel,
            };
            _arrWeatherSys.push_back(_cWeatherParticleSysInfo);
        }
        return Module.RealBIMWeb.AddWeatherParticleSys(_arrWeatherSys);
    };

    /**
     * 获取指定天气系统的信息
     * @param {String} weatherSysId //天气系统标识
     */
    Module.Particle.getWeatherSysInfo = function (weatherSysId) {
        if (isEmptyLog(weatherSysId, 'weatherSysId')) return {};
        const _cWeatherParticleSysInfo = Module.RealBIMWeb.GetWeatherParticleSysInfo(weatherSysId);
        if (!_cWeatherParticleSysInfo.m_strName.length) return {};
        const _m_vXSpeedRange = _cWeatherParticleSysInfo.m_vXSpeedRange;
        const _m_vZSpeedRange = _cWeatherParticleSysInfo.m_vZSpeedRange;
        const _m_vSizeRange = _cWeatherParticleSysInfo.m_vSizeRange;
        let _descend_speed_random = _m_vZSpeedRange[1] == 0 ? false : true;
        let _descend_speed_random_range = [0.0, 0.0];
        if (_descend_speed_random) {
            _descend_speed_random_range = [_m_vZSpeedRange[0], _m_vZSpeedRange[0] + _m_vZSpeedRange[1]];
        } else {
            _descend_speed_random_range = [_m_vZSpeedRange[0], _m_vZSpeedRange[1]];
        }

        let _disperse_speed_random = _m_vXSpeedRange[1] == 0 ? false : true;
        let _disperse_direction_random = _m_vXSpeedRange[0] < 0 && _m_vXSpeedRange[1] + _m_vXSpeedRange[0] > 0 ? true : false;
        let _disperse_speed_random_range = [0.0, 0.0];
        if (_disperse_speed_random) {
            if (_disperse_direction_random) {
                _disperse_speed_random_range = [_m_vXSpeedRange[0], _m_vXSpeedRange[0] + _m_vXSpeedRange[1]];
            } else {
                _disperse_speed_random_range = [_m_vXSpeedRange[0], _m_vXSpeedRange[0] + _m_vXSpeedRange[1]];
            }
        } else {
            if (!_disperse_direction_random) {
                _disperse_speed_random_range = [_m_vXSpeedRange[0], _m_vXSpeedRange[0]];
            }
        }

        let _size_random = _m_vSizeRange[1] == 0 ? false : true;
        let _size_random_range = [0.0, 0.0];
        if (_size_random) {
            _size_random_range = [_m_vSizeRange[0], _m_vSizeRange[0] + _m_vSizeRange[1]];
        } else {
            _size_random_range = [_m_vSizeRange[0], _m_vSizeRange[1]];
        }

        let weatherSysInfo = new Module.REWeatherSysInfo();
        weatherSysInfo.weatherSysId = _cWeatherParticleSysInfo.m_strName;
        weatherSysInfo.descendSpeedRange = arrayNumFixed(_descend_speed_random_range);
        weatherSysInfo.disperseSpeedRange = arrayNumFixed(_disperse_speed_random_range);
        weatherSysInfo.sizeRange = arrayNumFixed(_size_random_range);
        weatherSysInfo.texId = _cWeatherParticleSysInfo.m_uTexID;
        weatherSysInfo.level = _cWeatherParticleSysInfo.m_uLevel;
        return weatherSysInfo;
    };

    /**
     * 获取所有的天气系统的名称
     */
    Module.Particle.getAllWeatherSysIds = function () {
        var tempArr = Module.RealBIMWeb.GetAllWeatherParticleSysNames();
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 删除天气系统
     * @param {Array} weatherSysIdList //天气系统标识集合，空数组代表删除所有
     */
    Module.Particle.delWeatherSys = function (weatherSysIdList) {
        if (isEmptyLog(weatherSysIdList, 'weatherSysIdList')) return false;
        let arrId = new Module.RE_Vector_WStr();
        for (let i = 0; i < weatherSysIdList.length; i++) {
            arrId.push_back(weatherSysIdList[i]);
        }
        return Module.RealBIMWeb.RemoveWeatherParticleSys(arrId);
    };

    // MARK 发射系统
    class REParticleInfo {
        // 粒子信息
        constructor() {
            this.texId = null; //对应纹理id（已经添加的纹理数组内的索引）
            this.num = 0; //粒子数量
            this.lifeTime = 1.0; //粒子生命周期
            this.speedRange = [0.0, 0.0]; //粒子速度范围，【最大值，最小值】，最大值最小值相同表示粒子速度为定值，不同表示范围随机
            this.sizeRange = [0.0, 1.0]; //粒子半径范围，【最小值，最大值】，最大值最小值相同表示粒子大小为定值，不同表示范围随机
            this.sizeChangeRange = [0.0, 1.0]; //粒子生命周期内粒子半径变化系数过度范围，粒子大小在粒子生命周期内过度的缩放系数范围，【初始值，结束值】，初始值结束值相同表示粒子大小变化为定值，不同表示生命周期过度
            this.gravity = 9.81; //重力系数
            this.dampingFactor = 0; //阻尼系数
            this.color = null; //粒子颜色（REColor 类型），没有alpha数值
            this.alphaRange = [0, 1.0]; //粒子生命周期内透明度过度范围，【初始值，结束值】，初始值结束值相同表示粒子透明度为定值，不同表示生命周期过度
            this.faceDirection = 0; //粒子面向方向，0：发射方向, 1: 相机方向， 默认为0
            this.texUVRotAngle = 0; //贴图UV旋转角度
        }
    }
    ExtModule.REParticleInfo = REParticleInfo;

    /**
     * 设置发射系统纹理信息
     * @param {String} texGroupId //纹理组标识，由 Particle.addTexGroup 添加的纹理组标识
     */
    Module.Particle.setTransmitSysTex = function (texGroupId) {
        if (isEmptyLog(texGroupId, 'texGroupId')) return;
        return Module.RealBIMWeb.SetTransmitParticleSysTex(texGroupId);
    };

    /**
     * 获取所有的发射系统的名称
     */
    Module.Particle.getAllTransmitSysIds = function () {
        var tempArr = Module.RealBIMWeb.GetAllTransmitParticleSysNames();
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 删除发射系统
     * @param {Array} transmitIdList //发射系统标识集合，空数组代表删除所有
     */
    Module.Particle.delTransmitSys = function (transmitIdList) {
        if (isEmptyLog(transmitIdList, 'transmitIdList')) return false;
        let arrId = new Module.RE_Vector_WStr();
        for (let i = 0; i < transmitIdList.length; i++) {
            arrId.push_back(transmitIdList[i]);
        }
        return Module.RealBIMWeb.RemoveTransmitParticleSys(arrId);
    };

    // MARK （点）发射系统
    class REPosTransmitSysInfo {
        // （点）发射系统信息
        constructor() {
            this.transmitSysId = null; //发射系统标识
            this.pos = null; //发射器位置
            this.planNormal = null; //发射器所在平面法向量，作用于发射方向，右手坐标系参照
            this.planDirectionAngleRange = [0.0, 0.0]; //限制发射朝向相对于发射器所在平面的角度范围，取值范围【0，360°】，【最大值，最小值】，最大值最小值相同表示限制粒子相对发射器所在平面的方向为定值，不同表示范围随机, planNormalIncludedAngle=0, 范围无效，粒子发射方向为延发射器平面法向量方向
            this.planNormalIncludedAngle = 0.0; //限制发射朝向相对于发射器所在平面法向量方向的夹角度数，取值范围【0，90°】，夹角数值是相对发射器平面法向量方向，实际粒子发射方向范围为 planDirectionAngleRange 限制角度范围内的所有与法向量夹角度数的空间范围， 夹角度数为0，planDirectionAngleRange参数无效，粒子发射方向为延发射器平面法向量方向
            this.particleInfo = null; //粒子信息（REParticleInfo 类型）
        }
    }
    ExtModule.REPosTransmitSysInfo = REPosTransmitSysInfo;

    /**
     * 创建（点）发射系统
     * @param {Array} posTransmitSysInfoList //（点）发射系统信息集合（REPosTransmitSysInfo 类型）
     */
    Module.Particle.createTransmitSysPos = function (posTransmitSysInfoList) {
        if (isEmptyLog(posTransmitSysInfoList, 'posTransmitSysInfoList')) return false;
        let _arrTransmitSys = new Module.RE_Vector_TRANSMIT_PARTICLE_INFO();
        for (let i = 0; i < posTransmitSysInfoList.length; i++) {
            const transmitSysInfo = posTransmitSysInfoList[i];
            if (isEmptyLog(transmitSysInfo.transmitSysId, 'transmitSysId')) return false;
            if (isEmptyLog(transmitSysInfo.particleInfo, 'particleInfo')) return false;
            const particleInfo = transmitSysInfo.particleInfo;
            if (!checkArrCountLog(transmitSysInfo.pos, 'pos', 3)) return false;
            if (!checkArrCountLog(transmitSysInfo.planNormal, 'planNormal', 3)) return false;
            if (!checkArrCountLog(transmitSysInfo.planDirectionAngleRange, 'planDirectionAngleRange', 2)) return false;
            if (!checkArrCountLog(particleInfo.sizeRange, 'sizeRange', 2)) return false;
            if (!checkArrCountLog(particleInfo.sizeChangeRange, 'sizeChangeRange', 2)) return false;
            if (!checkArrCountLog(particleInfo.alphaRange, 'alphaRange', 2)) return false;
            if (isEmptyLog(particleInfo.texId, 'texId')) return false;

            // 发射器信息
            let _m_strName = transmitSysInfo.transmitSysId;
            let _m_vPos = transmitSysInfo.pos;
            let _m_vWorNormal = transmitSysInfo.planNormal;
            // 发射方向范围
            let _plan_dir_angle_min = isEmpty(transmitSysInfo.planDirectionAngleRange[0]) ? 0 : transmitSysInfo.planDirectionAngleRange[0];
            let _plan_dir_angle_max = isEmpty(transmitSysInfo.planDirectionAngleRange[1]) ? 0 : transmitSysInfo.planDirectionAngleRange[1];
            let _plan_dir_angle_random = _plan_dir_angle_min == _plan_dir_angle_max ? false : true;
            let _plan_dir_angle_dis = _plan_dir_angle_max - _plan_dir_angle_min;
            let _plan_nor_inc_angle = isEmpty(transmitSysInfo.planNormalIncludedAngle) ? 0.0 : transmitSysInfo.planNormalIncludedAngle;
            let _m_vAngle = [0.0, 0.0, 0.0, 0.0];
            if (_plan_dir_angle_random) {
                _m_vAngle = [
                    _plan_dir_angle_min * (Math.PI / 180),
                    _plan_dir_angle_dis * (Math.PI / 180),
                    _plan_nor_inc_angle * (Math.PI / 180),
                    0.0,
                ];
            } else {
                _m_vAngle = [_plan_dir_angle_min * (Math.PI / 180), 0, _plan_nor_inc_angle * (Math.PI / 180), 0.0];
            }
            // 粒子信息
            let _m_uTexID = isEmpty(particleInfo.texId) ? 0 : particleInfo.texId;
            let _m_uLevel = isEmpty(particleInfo.num) ? 1 : particleInfo.num;
            let _m_fLifetime = isEmpty(particleInfo.lifeTime) ? 1.0 : particleInfo.lifeTime;
            let _m_fGravity = isEmpty(particleInfo.gravity) ? 9.81 : particleInfo.gravity;
            let _m_fDF = isEmpty(particleInfo.dampingFactor) ? 0.0 : particleInfo.dampingFactor;
            let _m_vSizeChangeRange = particleInfo.sizeChangeRange;
            let _m_vAlphaRange = particleInfo.alphaRange;
            let _m_bFacePlane = isEmpty(particleInfo.faceDirection) ? false : particleInfo.faceDirection == 1 ? true : false;
            let _m_fRotAngle = isEmpty(particleInfo.texUVRotAngle) ? 0.0 : particleInfo.texUVRotAngle;
            // 颜色
            let _m_uColor = 0x00ffffff;
            if (!isEmpty(particleInfo.color)) {
                particleInfo.color.alpha = 0;
                _m_uColor = clrToU32(particleInfo.color);
            }
            // 速度
            let _speed_min = isEmpty(particleInfo.speedRange[0]) ? 0 : particleInfo.speedRange[0];
            let _speed_max = isEmpty(particleInfo.speedRange[1]) ? 0 : particleInfo.speedRange[1];
            let _speed_random = _speed_min == _speed_max ? false : true;
            let _speed_dis = _speed_max - _speed_min;
            let _m_vSpeedRange = [0, 0];
            if (_speed_random) {
                _m_vSpeedRange = [_speed_min, _speed_dis];
            } else {
                _m_vSpeedRange = [_speed_min, 0];
            }
            // 大小
            let _size_min = isEmpty(particleInfo.sizeRange[0]) ? 0 : particleInfo.sizeRange[0];
            let _size_max = isEmpty(particleInfo.sizeRange[1]) ? 0 : particleInfo.sizeRange[1];
            let _size_random = _size_min == _size_max ? false : true;
            let _size_dis = _size_max - _size_min;
            let _m_vSizeRange = [0.0, 0.0];
            if (_size_random) {
                _m_vSizeRange = [_size_min, _size_dis];
            } else {
                _m_vSizeRange = [_size_min, 0];
            }
            // 构件引擎粒子结构体
            let _cTransmitParticleSysInfo = {
                m_strName: _m_strName,
                m_vPos: _m_vPos,
                m_vWorNormal: _m_vWorNormal,
                m_vWorRight: [1.0, 0.0, 0.0],
                m_fRightDist: 0.0,
                m_fUpDist: 0.0,
                m_vSizeRange: _m_vSizeRange,
                m_uTexID: _m_uTexID,
                m_uLevel: _m_uLevel,
                m_fLifetime: _m_fLifetime,
                m_vSpeedRange: _m_vSpeedRange,
                m_fGravity: _m_fGravity,
                m_fDF: _m_fDF,
                m_vAngle: _m_vAngle,
                m_vAlphaRange: _m_vAlphaRange,
                m_vSizeChangeRange: _m_vSizeChangeRange,
                m_fRotAngle: _m_fRotAngle,
                m_uColor: _m_uColor,
                m_bFacePlane: _m_bFacePlane,
            };
            _arrTransmitSys.push_back(_cTransmitParticleSysInfo);
        }
        return Module.RealBIMWeb.AddTransmitParticleSys(_arrTransmitSys);
    };

    /**
     * 获取指定（点）发射系统信息
     * @param {String} transmitSysId //发射系统标识
     */
    Module.Particle.getTransmitSysInfoPos = function (transmitSysId) {
        if (isEmptyLog(transmitSysId, 'transmitSysId')) return {};
        const _cTransmitParticleSysInfo = Module.RealBIMWeb.GetTransmitParticleSysInfo(transmitSysId);
        if (!_cTransmitParticleSysInfo.m_strName.length) return {};
        const _m_vAngle = _cTransmitParticleSysInfo.m_vAngle;
        const _m_vSizeRange = _cTransmitParticleSysInfo.m_vSizeRange;
        const _m_vSpeedRange = _cTransmitParticleSysInfo.m_vSpeedRange;

        // 速度
        let _speed_random = _m_vSpeedRange[1] == 0 ? false : true;
        let _speed_random_range = [0.0, 0.0];
        if (_speed_random) {
            _speed_random_range = [_m_vSpeedRange[0], _m_vSpeedRange[0] + _m_vSpeedRange[1]];
        } else {
            _speed_random_range = [_m_vSpeedRange[0], _m_vSpeedRange[1]];
        }
        // 大小
        let _size_random = _m_vSizeRange[1] == 0 ? false : true;
        let _size_random_range = [0.0, 0.0];
        if (_size_random) {
            _size_random_range = [_m_vSizeRange[0], _m_vSizeRange[0] + _m_vSizeRange[1]];
        } else {
            _size_random_range = [_m_vSizeRange[0], _m_vSizeRange[1]];
        }
        // 发射方向范围
        _plan_dir_angle_random = _m_vAngle[1] == 0 ? false : true;
        _plan_dir_angle_range = [0.0, 0.0];
        if (_plan_dir_angle_random) {
            _plan_dir_angle_range = [_m_vAngle[1] * (180 / Math.PI), (_m_vAngle[0] + _m_vAngle[1]) * (180 / Math.PI)];
        } else {
            _plan_dir_angle_range = [_m_vAngle[0], _m_vAngle[1]];
        }
        let _plan_nor_inc_angle = _m_vAngle[2] * (180 / Math.PI);

        let transmitSysInfo_pos = new Module.REPosTransmitSysInfo();
        transmitSysInfo_pos.transmitSysId = _cTransmitParticleSysInfo.m_strName;
        transmitSysInfo_pos.pos = _cTransmitParticleSysInfo.m_vPos;
        transmitSysInfo_pos.planNormal = _cTransmitParticleSysInfo.m_vWorNormal;
        transmitSysInfo_pos.planDirectionAngleRange = arrayNumFixed(_plan_dir_angle_range);
        transmitSysInfo_pos.planNormalIncludedAngle = numFixed(_plan_nor_inc_angle);
        transmitSysInfo_pos.texId = _cTransmitParticleSysInfo.m_uTexID;
        transmitSysInfo_pos.num = _cTransmitParticleSysInfo.m_uLevel;
        transmitSysInfo_pos.lifeTime = _cTransmitParticleSysInfo.m_fLifetime;
        transmitSysInfo_pos.speedRange = arrayNumFixed(_speed_random_range);
        transmitSysInfo_pos.sizeRange = arrayNumFixed(_size_random_range);
        transmitSysInfo_pos.sizeChangeRange = arrayNumFixed(_cTransmitParticleSysInfo.m_vSizeChangeRange);
        transmitSysInfo_pos.gravity = numFixed(_cTransmitParticleSysInfo.m_fGravity);
        transmitSysInfo_pos.dampingFactor = numFixed(_cTransmitParticleSysInfo.m_fDF);
        let _clr = clrU32ToClr(_cTransmitParticleSysInfo.m_uColor);
        _clr.alpha = -1;
        transmitSysInfo_pos.color = _clr;
        transmitSysInfo_pos.alphaRange = arrayNumFixed(_cTransmitParticleSysInfo.m_vAlphaRange);
        transmitSysInfo_pos.faceDirection = _cTransmitParticleSysInfo.m_bFacePlane ? 1 : 0;
        transmitSysInfo_pos.texUVRotAngle = numFixed(_cTransmitParticleSysInfo.m_fRotAngle);
        return transmitSysInfo_pos;
    };

    // MARK （矩形）发射系统
    class RERectTransmitSysInfo {
        // （矩形）发射系统信息
        constructor() {
            this.transmitSysId = null; //发射系统标识
            this.pos = null; //发射器位置
            this.planWidth = 0; // 发射器平面宽度
            this.planHeight = 0; // 发射器平面高度
            this.planNormal = null; //发射器所在平面法向量，作用于发射方向，右手坐标系参照
            this.planRightDirection = null; //发射器所在平面指定右方向，作用与确定平面空间位置形态
            this.planDirectionAngleRange = [0.0, 0.0]; //限制发射朝向相对于发射器所在平面的角度范围，取值范围【0，360°】，【最大值，最小值】，最大值最小值相同表示限制粒子相对发射器所在平面的方向为定值，不同表示范围随机, planNormalIncludedAngle=0, 范围无效，粒子发射方向为延发射器平面法向量方向
            this.planNormalIncludedAngle = 0.0; //限制发射朝向相对于发射器所在平面法向量方向的夹角度数，取值范围【0，90°】，夹角数值是相对发射器平面法向量方向，实际粒子发射方向范围为 planDirectionAngleRange 限制角度范围内的所有与法向量夹角度数的空间范围， 夹角度数为0，planDirectionAngleRange参数无效，粒子发射方向为延发射器平面法向量方向
            this.particleInfo = null; //粒子信息（REParticleInfo 类型）
        }
    }
    ExtModule.RERectTransmitSysInfo = RERectTransmitSysInfo;

    /**
     * 创建（矩形）发射系统
     * @param {Array} rectTransmitSysInfoList //（矩形）发射系统信息集合（RERectTransmitSysInfo 类型）
     */
    Module.Particle.createTransmitSysRect = function (posTransmitSysInfoList) {
        if (isEmptyLog(posTransmitSysInfoList, 'posTransmitSysInfoList')) return false;
        let _arrTransmitSys = new Module.RE_Vector_TRANSMIT_PARTICLE_INFO();
        for (let i = 0; i < posTransmitSysInfoList.length; i++) {
            const transmitSysInfo = posTransmitSysInfoList[i];
            if (isEmptyLog(transmitSysInfo.transmitSysId, 'transmitSysId')) return false;
            if (isEmptyLog(transmitSysInfo.particleInfo, 'particleInfo')) return false;
            const particleInfo = transmitSysInfo.particleInfo;
            if (!checkArrCountLog(transmitSysInfo.pos, 'pos', 3)) return false;
            if (isEmptyLog(transmitSysInfo.planWidth, 'planWidth')) return false;
            if (isEmptyLog(transmitSysInfo.planHeight, 'planHeight')) return false;
            if (!checkArrCountLog(transmitSysInfo.planNormal, 'planNormal', 3)) return false;
            if (!checkArrCountLog(transmitSysInfo.planRightDirection, 'planRightDirection', 3)) return false;
            if (!checkArrCountLog(transmitSysInfo.planDirectionAngleRange, 'planDirectionAngleRange', 2)) return false;
            if (!checkArrCountLog(particleInfo.sizeRange, 'sizeRange', 2)) return false;
            if (!checkArrCountLog(particleInfo.sizeChangeRange, 'sizeChangeRange', 2)) return false;
            if (!checkArrCountLog(particleInfo.alphaRange, 'alphaRange', 2)) return false;
            if (isEmptyLog(particleInfo.texId, 'texId')) return false;

            // 发射器信息
            let _m_strName = transmitSysInfo.transmitSysId;
            let _m_vPos = transmitSysInfo.pos;
            let _m_fUpDist = isEmpty(transmitSysInfo.planHeight) ? 0.05 : transmitSysInfo.planHeight;
            let _m_fRightDist = isEmpty(transmitSysInfo.planWidth) ? 0.05 : transmitSysInfo.planWidth;
            let _m_vWorNormal = transmitSysInfo.planNormal;
            let _m_vWorRight = transmitSysInfo.planRightDirection;
            // 发射方向范围
            let _plan_dir_angle_min = isEmpty(transmitSysInfo.planDirectionAngleRange[0]) ? 0 : transmitSysInfo.planDirectionAngleRange[0];
            let _plan_dir_angle_max = isEmpty(transmitSysInfo.planDirectionAngleRange[1]) ? 0 : transmitSysInfo.planDirectionAngleRange[1];
            let _plan_dir_angle_random = _plan_dir_angle_min == _plan_dir_angle_max ? false : true;
            let _plan_dir_angle_dis = _plan_dir_angle_max - _plan_dir_angle_min;
            let _plan_nor_inc_angle = isEmpty(transmitSysInfo.planNormalIncludedAngle) ? 0.0 : transmitSysInfo.planNormalIncludedAngle;
            let _m_vAngle = [0.0, 0.0, 0.0, 0.0];
            if (_plan_dir_angle_random) {
                _m_vAngle = [
                    _plan_dir_angle_min * (Math.PI / 180),
                    _plan_dir_angle_dis * (Math.PI / 180),
                    _plan_nor_inc_angle * (Math.PI / 180),
                    0.0,
                ];
            } else {
                _m_vAngle = [_plan_dir_angle_min * (Math.PI / 180), 0, _plan_nor_inc_angle * (Math.PI / 180), 0.0];
            }
            // 粒子信息
            let _m_uTexID = isEmpty(particleInfo.texId) ? 0 : particleInfo.texId;
            let _m_uLevel = isEmpty(particleInfo.num) ? 1 : particleInfo.num;
            let _m_fLifetime = isEmpty(particleInfo.lifeTime) ? 1.0 : particleInfo.lifeTime;
            let _m_fGravity = isEmpty(particleInfo.gravity) ? 9.81 : particleInfo.gravity;
            let _m_fDF = isEmpty(particleInfo.dampingFactor) ? 0.0 : particleInfo.dampingFactor;
            let _m_vSizeChangeRange = particleInfo.sizeChangeRange;
            let _m_vAlphaRange = particleInfo.alphaRange;
            let _m_bFacePlane = isEmpty(particleInfo.faceDirection) ? false : particleInfo.faceDirection == 1 ? true : false;
            let _m_fRotAngle = isEmpty(particleInfo.texUVRotAngle) ? 0.0 : particleInfo.texUVRotAngle;
            // 颜色
            let _m_uColor = 0x00ffffff;
            if (!isEmpty(particleInfo.color)) {
                particleInfo.color.alpha = 0;
                _m_uColor = clrToU32(particleInfo.color);
            }
            // 速度
            let _speed_min = isEmpty(particleInfo.speedRange[0]) ? 0 : particleInfo.speedRange[0];
            let _speed_max = isEmpty(particleInfo.speedRange[1]) ? 0 : particleInfo.speedRange[1];
            let _speed_random = _speed_min == _speed_max ? false : true;
            let _speed_dis = _speed_max - _speed_min;
            let _m_vSpeedRange = [0, 0];
            if (_speed_random) {
                _m_vSpeedRange = [_speed_min, _speed_dis];
            } else {
                _m_vSpeedRange = [_speed_min, 0];
            }
            // 大小
            let _size_min = isEmpty(particleInfo.sizeRange[0]) ? 0 : particleInfo.sizeRange[0];
            let _size_max = isEmpty(particleInfo.sizeRange[1]) ? 0 : particleInfo.sizeRange[1];
            let _size_random = _size_min == _size_max ? false : true;
            let _size_dis = _size_max - _size_min;
            let _m_vSizeRange = [0.0, 0.0];
            if (_size_random) {
                _m_vSizeRange = [_size_min, _size_dis];
            } else {
                _m_vSizeRange = [_size_min, 0];
            }
            // 构件引擎粒子结构体
            let _cTransmitParticleSysInfo = {
                m_strName: _m_strName,
                m_vPos: _m_vPos,
                m_vWorNormal: _m_vWorNormal,
                m_vWorRight: _m_vWorRight,
                m_fRightDist: _m_fRightDist,
                m_fUpDist: _m_fUpDist,
                m_vSizeRange: _m_vSizeRange,
                m_uTexID: _m_uTexID,
                m_uLevel: _m_uLevel,
                m_fLifetime: _m_fLifetime,
                m_vSpeedRange: _m_vSpeedRange,
                m_fGravity: _m_fGravity,
                m_fDF: _m_fDF,
                m_vAngle: _m_vAngle,
                m_vAlphaRange: _m_vAlphaRange,
                m_vSizeChangeRange: _m_vSizeChangeRange,
                m_fRotAngle: _m_fRotAngle,
                m_uColor: _m_uColor,
                m_bFacePlane: _m_bFacePlane,
            };
            _arrTransmitSys.push_back(_cTransmitParticleSysInfo);
        }
        return Module.RealBIMWeb.AddTransmitParticleSys(_arrTransmitSys);
    };

    /**
     * 获取指定（矩形）发射系统信息
     * @param {String} transmitSysId //发射系统标识
     */
    Module.Particle.getTransmitSysInfoRect = function (transmitSysId) {
        if (isEmptyLog(transmitSysId, 'transmitSysId')) return {};
        const _cTransmitParticleSysInfo = Module.RealBIMWeb.GetTransmitParticleSysInfo(transmitSysId);
        if (!_cTransmitParticleSysInfo.m_strName.length) return {};
        const _m_vAngle = _cTransmitParticleSysInfo.m_vAngle;
        const _m_vSizeRange = _cTransmitParticleSysInfo.m_vSizeRange;
        const _m_vSpeedRange = _cTransmitParticleSysInfo.m_vSpeedRange;

        // 速度
        let _speed_random = _m_vSpeedRange[1] == 0 ? false : true;
        let _speed_random_range = [0.0, 0.0];
        if (_speed_random) {
            _speed_random_range = [_m_vSpeedRange[0], _m_vSpeedRange[0] + _m_vSpeedRange[1]];
        } else {
            _speed_random_range = [_m_vSpeedRange[0], _m_vSpeedRange[1]];
        }
        // 大小
        let _size_random = _m_vSizeRange[1] == 0 ? false : true;
        let _size_random_range = [0.0, 0.0];
        if (_size_random) {
            _size_random_range = [_m_vSizeRange[0], _m_vSizeRange[0] + _m_vSizeRange[1]];
        } else {
            _size_random_range = [_m_vSizeRange[0], _m_vSizeRange[1]];
        }
        // 发射方向范围
        _plan_dir_angle_random = _m_vAngle[1] == 0 ? false : true;
        _plan_dir_angle_range = [0.0, 0.0];
        if (_plan_dir_angle_random) {
            _plan_dir_angle_range = [_m_vAngle[1] * (180 / Math.PI), (_m_vAngle[0] + _m_vAngle[1]) * (180 / Math.PI)];
        } else {
            _plan_dir_angle_range = [_m_vAngle[0], _m_vAngle[1]];
        }
        let _plan_nor_inc_angle = _m_vAngle[2] * (180 / Math.PI);

        let transmitSysInfo_rect = new Module.RERectTransmitSysInfo();
        transmitSysInfo_rect.transmitSysId = _cTransmitParticleSysInfo.m_strName;
        transmitSysInfo_rect.pos = _cTransmitParticleSysInfo.m_vPos;
        transmitSysInfo_rect.planWidth = numFixed(_cTransmitParticleSysInfo.m_fRightDist);
        transmitSysInfo_rect.planHeight = numFixed(_cTransmitParticleSysInfo.m_fUpDist);
        transmitSysInfo_rect.planNormal = arrayNumFixed(_cTransmitParticleSysInfo.m_vWorNormal);
        transmitSysInfo_rect.planRightDirection = arrayNumFixed(_cTransmitParticleSysInfo.m_vWorRight);
        transmitSysInfo_rect.planDirectionAngleRange = arrayNumFixed(_plan_dir_angle_range);
        transmitSysInfo_rect.planNormalIncludedAngle = numFixed(_plan_nor_inc_angle);
        transmitSysInfo_rect.texId = _cTransmitParticleSysInfo.m_uTexID;
        transmitSysInfo_rect.num = _cTransmitParticleSysInfo.m_uLevel;
        transmitSysInfo_rect.lifeTime = _cTransmitParticleSysInfo.m_fLifetime;
        transmitSysInfo_rect.speedRange = arrayNumFixed(_speed_random_range);
        transmitSysInfo_rect.sizeRange = arrayNumFixed(_size_random_range);
        transmitSysInfo_rect.sizeChangeRange = arrayNumFixed(_cTransmitParticleSysInfo.m_vSizeChangeRange);
        transmitSysInfo_rect.gravity = numFixed(_cTransmitParticleSysInfo.m_fGravity);
        transmitSysInfo_rect.dampingFactor = numFixed(_cTransmitParticleSysInfo.m_fDF);
        let _clr = clrU32ToClr(_cTransmitParticleSysInfo.m_uColor);
        _clr.alpha = -1;
        transmitSysInfo_rect.color = _clr;
        transmitSysInfo_rect.alphaRange = arrayNumFixed(_cTransmitParticleSysInfo.m_vAlphaRange);
        transmitSysInfo_rect.faceDirection = _cTransmitParticleSysInfo.m_bFacePlane ? 1 : 0;
        transmitSysInfo_rect.texUVRotAngle = numFixed(_cTransmitParticleSysInfo.m_fRotAngle);
        return transmitSysInfo_rect;
    };

    // MARK 纹理资源
    /**
     * 添加粒子纹理组
     * @param {String} texGroupId //纹理组标识
     * @param {Array} texPathList //纹理路径集合（每个纹理组最多添加 64 张图片，如果不过再增加纹理组）
     */
    Module.Particle.addTexGroup = function (texGroupId, texPathList) {
        if (isEmptyLog(texGroupId, 'texGroupId')) return;
        if (!checkTypeLog(texPathList, 'texPathList', RE_Enum.RE_Check_Array)) return;
        let arrPath = new Module.RE_Vector_WStr();
        let arrSize = new Module.RE_Vector_vec2();
        for (let i = 0; i < texPathList.length; i++) {
            arrPath.push_back(texPathList[i]);
            arrSize.push_back([128, 128]); // 固定纹理大小
        }
        return Module.RealBIMWeb.AddParticleTexArray(texGroupId, arrPath, 1024, 1024, arrSize);
    };

    /**
     * 获取粒子纹理组标识集合
     */
    Module.Particle.getTexGroupIds = function () {
        var tempArr = Module.RealBIMWeb.GetAllParticleTexArrays();
        var nameArr = [];
        for (let i = 0; i < tempArr.size(); ++i) {
            nameArr.push(tempArr.get(i));
        }
        return nameArr;
    };

    /**
     * 删除一个粒子纹理组
     * @param {String} texGroupId //纹理组标识
     */
    Module.Particle.delTexGroup = function (texGroupId) {
        if (isEmptyLog(texGroupId, 'texGroupId')) return false;
        return Module.RealBIMWeb.DelAParticleTexArray(texGroupId);
    };

    /**
     * 删除所有粒子纹理组
     */
    Module.Particle.delAllTexGroup = function () {
        Module.RealBIMWeb.DelAllParticleTexArrays();
    };

    // MOD-- 三维分析（Analysis3D） <---
    Module.Analysis3D = typeof Module.Analysis3D !== 'undefined' ? Module.Analysis3D : {}; //增加 Analysis3D 模块

    // MARK 天际线
    /**
     * 设置天际线颜色和透明度 注：需要配合地形限制，才有效果
     * @param {REColor} color //颜色（REColor 类型）, alpha=0 表示禁用
     */
    Module.Analysis3D.setSkylineClr = function (color) {
        if (isEmptyLog(color, 'color')) return;
        let _color = clrToRGBA_List(color);
        Module.RealBIMWeb.SetSkylineClr(_color);
    };

    /**
     * 获取天际线颜色和透明度
     */
    Module.Analysis3D.getSkylineClr = function () {
        let _color = Module.RealBIMWeb.GetSkylineClr();
        return clrRGBAListToClr(_color);
    };

    // MARK 可视域分析

    class REViewRegionFOVCamInfo {
        constructor() {
            this.fisheye = false; //是否为鱼眼球面相机，相机的可视球面可视半径将为farDis
            this.camPos = [0, 0, 0]; //相机的位置
            this.camRotate = [0, 0, 0, 1]; //相机的朝向
            this.camFovY = Math.PI / 6.0; //相机在视点空间Y轴上的视角(弧度)
            this.nearDis = 0.1; //近裁面距离
            this.farDis = 1; //远裁面距离
        }
    }
    ExtModule.REViewRegionFOVCamInfo = REViewRegionFOVCamInfo;

    /**
     * 设置可视域的相机参数 注：基于视场角的透视投影
     * @param {REViewRegionFOVCamInfo} camInfo //相机参数（REViewRegionFOVCamInfo 类型）
     */
    Module.Analysis3D.setViewRegionFovCam = function (camInfo) {
        if (isEmptyLog(camInfo, 'camInfo')) return;

        let _fisheye = isEmpty(camInfo.fisheye) ? false : camInfo.fisheye;
        let _camPos = isEmpty(camInfo.camPos) ? [0, 0, 0] : camInfo.camPos;
        let _camRotate = isEmpty(camInfo.camRotate) ? [0, 0, 0, 1] : camInfo.camRotate;
        let _camFovY = isEmpty(camInfo.camFovY) ? Math.PI / 6.0 : camInfo.camFovY;
        let _nearDis = isEmpty(camInfo.nearDis) ? 0.1 : camInfo.nearDis;
        let _farDis = isEmpty(camInfo.farDis) ? 1 : camInfo.farDis;
        let _qViewport = [0, 0, 1024, 512];
        let _dAspect = 2.0;
        Module.RealBIMWeb.SetViewRegionFovCam(_fisheye, _camPos, _camRotate, _qViewport, _camFovY, _dAspect, _nearDis, _farDis);
    };

    class REViewRegionFrustumCamInfo {
        constructor() {
            this.fisheye = false; //是否为鱼眼球面相机
            this.camPos = [0, 0, 0]; //相机的位置
            this.camRotate = [0, 0, 0, 1]; //相机的朝向
            this.nearRect = [0, 0, 0, 0]; //相机视锥体在近裁面上的矩形区域 【left,right,bottom,top】
            this.nearDis = 0.1; //近裁面距离
            this.farDis = 1; //远裁面距离
        }
    }
    ExtModule.REViewRegionFrustumCamInfo = REViewRegionFrustumCamInfo;

    /**
     * 设置可视域的相机参数 注：基于视椎体的透视投影
     * @param {REViewRegionFrustumCamInfo} camInfo //相机参数（REViewRegionFrustumCamInfo 类型）
     */
    Module.Analysis3D.setViewRegionFrustumCam = function (camInfo) {
        if (isEmptyLog(camInfo, 'camInfo')) return;

        let _fisheye = isEmpty(camInfo.fisheye) ? false : camInfo.fisheye;
        let _camPos = isEmpty(camInfo.camPos) ? [0, 0, 0] : camInfo.camPos;
        let _camRotate = isEmpty(camInfo.camRotate) ? [0, 0, 0, 1] : camInfo.camRotate;
        let _nearRect = isEmpty(camInfo.nearRect) ? [0, 0, 0, 0] : camInfo.nearRect;
        let _nearDis = isEmpty(camInfo.nearDis) ? 0.1 : camInfo.nearDis;
        let _farDis = isEmpty(camInfo.farDis) ? 1 : camInfo.farDis;
        let _qViewport = [0, 0, 1024, 512];
        Module.RealBIMWeb.SetViewRegionFrustumCam(_fisheye, _camPos, _camRotate, _qViewport, _nearRect, _nearDis, _farDis);
    };

    class REViewRegionOrthoCamInfo {
        constructor() {
            this.camPos = [0, 0, 0]; //相机的位置
            this.camRotate = [0, 0, 0, 1]; //相机的朝向
            this.nearRect = [0, 0, 0, 0]; //相机在近裁面上的矩形区域 【left,right,bottom,top】
            this.nearDis = 0.1; //近裁面距离
            this.farDis = 1; //远裁面距离
        }
    }
    ExtModule.REViewRegionOrthoCamInfo = REViewRegionOrthoCamInfo;

    /**
     * 设置可视域的相机参数 注：基于正交投影
     * @param {REViewRegionOrthoCamInfo} camInfo //相机参数（REViewRegionOrthoCamInfo 类型）
     */
    Module.Analysis3D.setViewRegionOrthoCam = function (camInfo) {
        if (isEmptyLog(camInfo, 'camInfo')) return;

        let _camPos = isEmpty(camInfo.camPos) ? [0, 0, 0] : camInfo.camPos;
        let _camRotate = isEmpty(camInfo.camRotate) ? [0, 0, 0, 1] : camInfo.camRotate;
        let _nearRect = isEmpty(camInfo.nearRect) ? [0, 0, 0, 0] : camInfo.nearRect;
        let _nearDis = isEmpty(camInfo.nearDis) ? 0.1 : camInfo.nearDis;
        let _farDis = isEmpty(camInfo.farDis) ? 1 : camInfo.farDis;
        let _qViewport = [0, 0, 1024, 512];
        Module.RealBIMWeb.SetViewRegionOrthoCam(_camPos, _camRotate, _qViewport, _nearRect, _nearDis, _farDis);
    };

    /**
     * 设置可视域的属性信息 注：设置属性之前效果不可见，属性设置即时生效
     * @param {REColor} visibleClr //可见区域颜色（REColor 类型）, alpha代表和模型的颜色混合权重，数值越大带代表颜色权重越大
     * @param {REColor} occludedClr //遮挡区域颜色（REColor 类型）, alpha代表和模型的颜色混合权重，数值越大带代表颜色权重越大
     */
    Module.Analysis3D.setViewRegionAttrs = function (visibleClr, occludedClr) {
        if (isEmptyLog(visibleClr, 'visibleClr')) return;
        if (isEmptyLog(occludedClr, 'occludedClr')) return;

        let _visibleClr = isEmpty(visibleClr) ? [0, 1, 0, 0.8] : clrToRGBA_List(visibleClr);
        let _occludedClr = isEmpty(occludedClr) ? [1, 0, 0, 0.8] : clrToRGBA_List(occludedClr);
        Module.RealBIMWeb.SetViewRegionAttrs(_visibleClr, _occludedClr);
    };

    // MARK 通视分析

    /**
     * 加入一个通视观察点 注：若已存在则更新位置信息，一个观察点可以对应多个目标点
     * @param {String} viewerId //通视观察点标识
     * @param {dvec3} pos //观察点位置（三元素数组）
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.addSightLineViewer = function (viewerId, pos, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        if (isEmptyLog(pos, 'pos')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        return Module.RealBIMWeb.SightL_AddAViewer(_viewport, viewerId, pos);
    };

    /**
     * 获取所有的通视观察点标识
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.getSightLineAllViewerId = function (viewport = 0) {
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        let _arrNames = Module.RealBIMWeb.SightL_GetAllViewerNames(_viewport);
        let viewerIdList = [];
        for (let i = 0; i < _arrNames.size(); ++i) {
            viewerIdList.push(_arrNames.get(i));
        }
        return viewerIdList;
    };

    /**
     * 获取一个通视观察点的位置信息 注：绝对值大于1e19表示无效信息
     * @param {String} viewerId //通视观察点标识
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.getSightLineViewerPos = function (viewerId, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        return Module.RealBIMWeb.SightL_GetAViewerPos(_viewport, viewerId);
    };

    /**
     * 删除一个通视观察点
     * @param {String} viewerId //通视观察点标识
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.delSightLineViewer = function (viewerId, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        return Module.RealBIMWeb.SightL_DelAViewer(_viewport, viewerId);
    };

    /**
     * 删除所有的通视观察点
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.delSightLineAllViewer = function (viewport = 0) {
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        Module.RealBIMWeb.SightL_DelAllViewers(_viewport);
    };

    /**
     * 加入一个通视目标点 注：若已存在则更新位置信息，一个观察点可以对应多个目标点
     * @param {String} viewerId //通视观察点标识
     * @param {String} targetId //通视目标点标识
     * @param {dvec3} pos //目标点位置（三元素数组）
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.addSightLineTarget = function (viewerId, targetId, pos, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        if (isEmptyLog(targetId, 'targetId')) return;
        if (isEmptyLog(pos, 'pos')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        return Module.RealBIMWeb.SightL_AddATarget(_viewport, viewerId, targetId, pos);
    };

    /**
     * 获取所有的通视目标点标识
     * @param {String} viewerId //通视观察点标识
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.getSightLineAllTargetId = function (viewerId, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        let _arrNames = Module.RealBIMWeb.SightL_GetAllTargetNames(_viewport, viewerId);
        let targetIdList = [];
        for (let i = 0; i < _arrNames.size(); ++i) {
            targetIdList.push(_arrNames.get(i));
        }
        return targetIdList;
    };

    /**
     * 获取一个通视目标点的位置信息 注：绝对值大于1e19表示无效信息
     * @param {String} viewerId //通视观察点标识
     * @param {String} targetId //通视目标点标识
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.getSightLineTargetPos = function (viewerId, targetId, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        if (isEmptyLog(targetId, 'targetId')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        return Module.RealBIMWeb.SightL_GetATargetPos(_viewport, viewerId, targetId);
    };

    /**
     * 获取一个通视目标点的被遮挡位置信息 注：绝对值大于1e19表示无效信息, 如果无遮挡点则返回数值和目标点位置一致，忽略精度问题
     * @param {String} viewerId //通视观察点标识
     * @param {String} targetId //通视目标点标识
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.getSightLineTargetOccPos = function (viewerId, targetId, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        if (isEmptyLog(targetId, 'targetId')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        return Module.RealBIMWeb.SightL_GetATargetOccPos(_viewport, viewerId, targetId);
    };

    /**
     * 删除一个通视目标点
     * @param {String} viewerId //通视观察点标识
     * @param {String} targetId //通视目标点标识
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.delSightLineTarget = function (viewerId, targetId, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        if (isEmptyLog(targetId, 'targetId')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        return Module.RealBIMWeb.SightL_DelATarget(_viewport, viewerId, targetId);
    };

    /**
     * 删除所有的通视观察点
     * @param {String} viewerId //通视观察点标识
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.delSightLineAllTarget = function (viewerId, viewport = 0) {
        if (isEmptyLog(viewerId, 'viewerId')) return;
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        return Module.RealBIMWeb.SightL_DelAllTargets(_viewport, viewerId);
    };

    /**
     * 设置通视线的属性信息 注：设置属性之前效果不可见，属性设置即时生效
     * @param {REColor} visibleClr //可见线颜色（REColor 类型）
     * @param {REColor} occludedClr //遮挡线颜色（REColor 类型）
     * @param {Number} viewport //视口索引，默认为0，可不传，多视口模式下可以调节，不同视口的通视分析独立
     */
    Module.Analysis3D.setSightLineAttrs = function (visibleClr, occludedClr, viewport = 0) {
        if (isEmptyLog(visibleClr, 'visibleClr')) return;
        if (isEmptyLog(occludedClr, 'occludedClr')) return;
        let _visibleClr = isEmpty(visibleClr) ? [0, 1, 0, 0.8] : clrToRGBA_List(visibleClr);
        let _occludedClr = isEmpty(occludedClr) ? [1, 0, 0, 0.8] : clrToRGBA_List(occludedClr);
        let _viewport = isEmpty(viewport) ? 0 : viewport;
        Module.RealBIMWeb.SightL_SetAttrs(_viewport, _visibleClr, _occludedClr);
    };

    // MARK 限高分析
    class REHeightLimitInfo {
        constructor() {
            this.centerX = 0; //限高中心点X
            this.centerY = 0; //限高中心点Y
            this.radius = 1.0; //限高作用半径
            this.criticalZ = 1e20; //限高临界高度Z
        }
    }
    ExtModule.REHeightLimitInfo = REHeightLimitInfo;

    /**
     * 设置限高分析信息
     * @param {REHeightLimitInfo} heightlimitInfo //限高信息（REHeightLimitInfo 类型）
     */
    Module.Analysis3D.setHeightLimitInfo = function (heightlimitInfo) {
        if (isEmptyLog(heightlimitInfo, 'heightlimitInfo')) return;

        let _centerX = isEmpty(heightlimitInfo.centerX) ? 0 : heightlimitInfo.centerX;
        let _centerY = isEmpty(heightlimitInfo.centerY) ? 0 : heightlimitInfo.centerY;
        let _radius = isEmpty(heightlimitInfo.radius) ? 1.0 : heightlimitInfo.radius;
        let _criticalZ = isEmpty(heightlimitInfo.criticalZ) ? 1e20 : heightlimitInfo.criticalZ;
        Module.RealBIMWeb.SetHeightLimitInfo([_centerX, _centerY, _radius, _criticalZ]);
    };

    /**
     * 获取限高分析信息
     */
    Module.Analysis3D.getHeightLimitInfo = function () {
        let _cLimitHeight = Module.RealBIMWeb.GetHeightLimitInfo();
        let limitHeight = new REHeightLimitInfo();
        limitHeight.centerX = _cLimitHeight[0];
        limitHeight.centerY = _cLimitHeight[1];
        limitHeight.radius = _cLimitHeight[2];
        limitHeight.criticalZ = _cLimitHeight[3];
        return limitHeight;
    };

    /**
     * 删除限高分析
     */
    Module.Analysis3D.delHeightLimit = function () {
        Module.RealBIMWeb.SetHeightLimitInfo([0, 0, 1.0, 1e20]);
        Module.RealBIMWeb.SetHeightLClr([0, 0, 0, 0]);
    };

    /**
     * 设置超出限高临界高度后的颜色
     * @param {REColor} color //颜色（REColor 类型）
     */
    Module.Analysis3D.setHeightLimitClr = function (color) {
        if (isEmptyLog(color, 'color')) return;
        let _color = clrToRGBA_List(color);
        Module.RealBIMWeb.SetHeightLClr(_color);
    };

    /**
     * 获取超出限高临界高度后的颜色
     */
    Module.Analysis3D.getHeightLimitClr = function () {
        let _color = Module.RealBIMWeb.GetHeightLClr();
        return clrRGBAListToClr(_color);
    };

    // MOD-- 投射（Projection） <---
    Module.Projection = typeof Module.Projection !== 'undefined' ? Module.Projection : {}; //增加 Projection 模块

    // MARK 加载

    class REProjectionInfo {
        // 投射信息
        constructor() {
            this.projectionId = null; //投射标识
            this.camPos = null; //投射相机的位置信息（三元素数组）
            this.targetPos = null; //目标点的位置信息（三元素数组）
            this.type = 0; //投射模式 0：正交投影 1：透视投影
            this.planeNormal = [0.0, 1.0, 0.0]; //投射平面法向量（三元素数组）
            this.planeRight = [-1.0, 0.0, 0.0]; //投射平面右方向（三元素数组）
            this.nearFarPlaneOffset = [0, 0]; //表示近远裁面相对于目标点的偏倚，正数表示远离相机点方向，负数表示靠近相机点方向
            this.planeFarRectMin = [-10.0, -10.0]; //近平面范围最小值（二元素数组），仅正交投影模式有效
            this.planeFarRectMax = [10.0, 10.0]; //近平面范围最大值（二元素数组），仅正交投影模式有效
            this.aspectRatio = 16.0 / 9.0; //宽高比，默认（16.0 / 9.0），仅透视投影模式有效
            this.fieldAngle = 60; //视场角，默认（60°），仅透视投影模式有效
            this.texPath = ''; //投射纹理路径，空字符串默认全白纹理
            this.texType = 0; //纹理类型 0：大资源图片纹理（占用更多的显存，效果好）  1：小资源图片纹理（占用较小的显存，效果一般）  2：视频纹理
            this.texClrMult = null; //纹理的颜色乘积（REColor 类型）
            this.minUV = [0.0, 0.0]; //对应的纹理UV坐标区域最小值（二元素数组），取值范围 [0.0, 1.0]
            this.maxUV = [1.0, 1.0]; //对应的纹理UV坐标区域最大值（二元素数组），取值范围 [0.0, 1.0]
            this.uvMapPtNum = [0, 0]; //表示纹理UV坐标区域的U、V方向的映射点个数，默认[0, 0]为保持UV不变,[n,m]二元素数组
            this.uvMapPtPosList = null; ////表示映射点对应的UV映射表点位集合,[x,y,a,b]四元素数组,(x,y)代表点阵点位置信息，(a,b)代表点位数值，点阵左下角位置(0,0)数值(0,0),右上角位置(n,m)数值(1,1)，uvMapPtNum=[0,0]无效，且uvMapPtNum.n*uvMapPtNum.m===uvMapPtPosList.length
            this.showState = 0; //表示显示矢量数据的类型, 0表示不显示几何信息， 1表示显示视锥体几何，2表示显示裁剪面
            this.clipPlaneValid = null; //表示投射裁剪面限制范围有效性，投射效果会作用于各裁剪面构成的包围体内，如果某一面无效，则代表这个面的方向范围不做限制，默认限制范围（REProjectionClipPlaneInfo 类型）
            this.localClipPlanes = null; //表示视椎体关联的所有局部空间有向裁切面
        }
    }
    ExtModule.REProjectionInfo = REProjectionInfo;

    class REProjectionClipPlaneInfo {
        // 投射裁剪面信息
        constructor() {
            this.topValid = true; //裁剪包围体（上面）限制区域有效
            this.bottomValid = true; //裁剪包围体（下面）限制区域有效
            this.leftValid = true; //裁剪包围体（左面）限制区域有效
            this.rightValid = true; //裁剪包围体（右面）限制区域有效
            this.frontValid = true; //裁剪包围体（前面）限制区域有效
            this.backValid = true; //裁剪包围体（后面）限制区域有效
        }
    }
    ExtModule.REProjectionClipPlaneInfo = REProjectionClipPlaneInfo;

    /**
     * 设置投射默认信息
     * @param {REProjectionInfo} projectionInfo //投射信息（REProjectionInfo 类型）
     */
    Module.Projection.setDefaultInfo = function (projectionInfo) {
        if (isEmptyLog(projectionInfo, 'projectionInfo')) return;

        const _cInfo = projectionData_js2c_conv(projectionInfo);
        Module.RealBIMWeb.SetDefaultFrustumProjInfo(_cInfo);
    };

    /**
     * 获取投射默认信息
     */
    Module.Projection.getDefaultInfo = function () {
        const _cInfo = Module.RealBIMWeb.GetDefaultFrustumProjInfo();
        return projectionData_c2js_conv(_cInfo);
    };

    /**
     * 设置投射对象集合
     * @param {Array} projectionInfoList //投射信息集合 （REProjectionInfo 类型）
     */
    Module.Projection.setData = function (projectionInfoList) {
        if (!checkTypeLog(projectionInfoList, 'projectionInfoList', RE_Enum.RE_Check_Array)) return;

        let _vector_projectionInfo = new Module.RE_Vector_FRUSTUM_PROJ_INFO();
        for (let i = 0; i < projectionInfoList.length; i++) {
            const _projection_obj = projectionInfoList[i];
            const _cInfo = projectionData_js2c_conv(_projection_obj);
            _vector_projectionInfo.push_back(_cInfo);
        }
        Module.RealBIMWeb.SetFrustumProjInfo(_vector_projectionInfo);
    };

    /**
     * 获取当前场景投射对象集合
     * @param {Array} projectionIdList //投射标识集合，空数组代表所有
     */
    Module.Projection.getData = function (projectionIdList) {
        let _vector_projection_id = new Module.RE_Vector_WStr();
        projectionIdList.forEach((element) => {
            _vector_projection_id.push_back(element);
        });

        const _vector_projectionInfo = Module.RealBIMWeb.GetFrustumProjInfo(_vector_projection_id);
        let projectionInfoList = [];
        for (let i = 0; i < _vector_projectionInfo.size(); i++) {
            const _cProjection = _vector_projectionInfo.get(i);
            projectionInfoList.push(projectionData_c2js_conv(_cProjection));
        }

        return projectionInfoList;
    };

    /**
     * 获取所有投射标识
     */
    Module.Projection.getAllProjectionId = function () {
        const _vector_projection_id = Module.RealBIMWeb.GetAllFrustumProjInfoName();
        let _projectionIdList = [];
        for (let i = 0; i < _vector_projection_id.size(); i++) {
            _projectionIdList.push(_vector_projection_id.get(i));
        }
        return _projectionIdList;
    };

    /**
     * 根据标识删除指定投射
     * @param {Array} projectionIdList //投射标识集合，空数组代表所有
     */
    Module.Projection.delData = function (projectionIdList) {
        if (!checkTypeLog(projectionIdList, 'projectionIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_projection_id = new Module.RE_Vector_WStr();
        projectionIdList.forEach((element) => {
            _vector_projection_id.push_back(element);
        });
        return Module.RealBIMWeb.DelFrustumProjInfo(_vector_projection_id);
    };

    /**
     * 转换数据辅助接口（c++ -> js）
     */
    function projectionData_c2js_conv(projection_c) {
        const _info_js = new Module.REProjectionInfo();

        let texType = 1;
        let m_strTexPath = projection_c.m_strTexPath;
        if (m_strTexPath.includes('Single:')) {
            m_strTexPath = m_strTexPath.replace('Single:', '');
            texType = 0;
        } else if (m_strTexPath.includes('Single:Video:')) {
            m_strTexPath = m_strTexPath.replace('Single:Video:', '');
            texType = 2;
        }
        // 处理剖切面相关数据
        const _clipPlaneValid = new Module.REProjectionClipPlaneInfo();
        _clipPlaneValid.topValid = (projection_c.m_uClipPlaneValid & 1) !== 0;
        _clipPlaneValid.bottomValid = (projection_c.m_uClipPlaneValid & 2) !== 0;
        _clipPlaneValid.leftValid = (projection_c.m_uClipPlaneValid & 4) !== 0;
        _clipPlaneValid.rightValid = (projection_c.m_uClipPlaneValid & 8) !== 0;
        _clipPlaneValid.frontValid = (projection_c.m_uClipPlaneValid & 16) !== 0;
        _clipPlaneValid.backValid = (projection_c.m_uClipPlaneValid & 32) !== 0;

        const _localClipPlanes = [];
        for (let i = 0; i < projection_c.m_arrLocalClipPlanes.size(); i++) {
            _localClipPlanes.push(projection_c.m_arrLocalClipPlanes.get(i));
        }

        // 处理UV映射数据
        const _uvMapPtPosList_temp = [];
        for (let i = 0; i < projection_c.m_arrUVMapPots.size(); i++) {
            _uvMapPtPosList_temp.push(projection_c.m_arrUVMapPots.get(i));
        }
        const [n, m] = projection_c.m_vUVMapPtNum;
        const _uvMapPtPosList = _uvMapPtPosList_temp.map((item, idx) => [idx % (n + 1), Math.floor(idx / (n + 1)), item[0] / 65535, item[1] / 65535]);

        // 构造数据
        _info_js.projectionId = projection_c.m_strName;
        _info_js.camPos = projection_c.m_vPos;
        _info_js.targetPos = projection_c.m_vDstPos;
        _info_js.type = projection_c.m_uProjType;
        _info_js.planeNormal = projection_c.m_vWorNormal;
        _info_js.planeRight = projection_c.m_vWorRight;
        _info_js.nearFarPlaneOffset = projection_c.m_vOffset;
        _info_js.planeFarRectMin = [projection_c.m_qZNearRect[0], projection_c.m_qZNearRect[2]];
        _info_js.planeFarRectMax = [projection_c.m_qZNearRect[1], projection_c.m_qZNearRect[3]];
        _info_js.aspectRatio = projection_c.m_dAspect;
        _info_js.fieldAngle = projection_c.m_dFovY * (180 / Math.PI);
        _info_js.texPath = m_strTexPath;
        _info_js.texType = texType;
        _info_js.texClrMult = clrU32ToClr(projection_c.m_uClrMult);
        _info_js.minUV = [projection_c.m_sUMin / 32767, projection_c.m_sVMin / 32767];
        _info_js.maxUV = [projection_c.m_sUMax / 32767, projection_c.m_sVMax / 32767];
        _info_js.uvMapPtNum = projection_c.m_vUVMapPtNum;
        _info_js.uvMapPtPosList = _uvMapPtPosList;
        _info_js.showState = projection_c.m_uShowState;
        _info_js.clipPlaneValid = _clipPlaneValid;
        _info_js.localClipPlanes = _localClipPlanes;

        return _info_js;
    }

    /**
     * 转换数据辅助接口（js -> c++）
     */
    function projectionData_js2c_conv(projection_js) {
        if (isEmptyLog(projection_js.projectionId, 'projectionId')) return null;
        if (!checkArrCountLog(projection_js.camPos, 'camPos', 3)) return null;
        if (!checkArrCountLog(projection_js.targetPos, 'targetPos', 3)) return null;

        let _planeFarRectMin = isEmpty(projection_js.planeFarRectMin) ? [-10.0, -10.0] : projection_js.planeFarRectMin;
        let _planeFarRectMax = isEmpty(projection_js.planeFarRectMax) ? [10.0, 10.0] : projection_js.planeFarRectMax;
        let _minUV = isEmpty(projection_js.minUV) ? [0.0, 0.0] : projection_js.minUV;
        let _maxUV = isEmpty(projection_js.maxUV) ? [1.0, 1.0] : projection_js.maxUV;
        let _texType = isEmpty(projection_js.texType) ? 0 : projection_js.texType;
        let m_strTexPath = isEmpty(projection_js.texPath) ? '' : projection_js.texPath;
        if (_texType == 0) {
            // 纹理独立参与渲染，不合并到拼接大纹理，可以放大一点的资源，占用显存
            m_strTexPath = 'Single:' + m_strTexPath;
        } else if (_texType == 2) {
            // 视频纹理
            m_strTexPath = 'Single:Video:' + m_strTexPath;
        } else {
            // 拼接到大纹理上的纹理资源，需要小资源，会共用工具栏等纹理大小
        }
        // 处理剖切面相关数据
        let _m_uClipPlaneValid = 0;
        if (!isEmpty(projection_js.clipPlaneValid)) {
            _m_uClipPlaneValid = 0b00111111;
        } else {
            if (projection_js.clipPlaneValid.topValid) _m_uClipPlaneValid |= 1 << 0;
            if (projection_js.clipPlaneValid.bottomValid) _m_uClipPlaneValid |= 1 << 1;
            if (projection_js.clipPlaneValid.leftValid) _m_uClipPlaneValid |= 1 << 2;
            if (projection_js.clipPlaneValid.rightValid) _m_uClipPlaneValid |= 1 << 3;
            if (projection_js.clipPlaneValid.frontValid) _m_uClipPlaneValid |= 1 << 4;
            if (projection_js.clipPlaneValid.backValid) _m_uClipPlaneValid |= 1 << 5;
        }
        let _arrLocalClipPlanes = new Module.RE_Vector_dvec4();
        projection_js.localClipPlanes.forEach((el) => {
            _arrLocalClipPlanes.push_back(el);
        });

        // 处理UV映射数据
        let _arrUVMapPots = new Module.RE_Vector_ivec2();
        const _uvMapPtNum = isEmpty(projection_js.uvMapPtNum) ? [0, 0] : projection_js.uvMapPtNum;
        if (!checkArrCount(_uvMapPtNum, 2)) {
            logParErr('uvMapPtNum');
            return null;
        }
        const [n, m] = _uvMapPtNum;
        if (n * m != 0 && n * m == projection_js.uvMapPtPosList.length) {
            const sorted = [...projection_js.uvMapPtPosList].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
            const resList = sorted.map((i) => [i[2] * 65535, i[3] * 65535]);
            resList.forEach((el) => {
                _arrUVMapPots.push_back(el);
            });
        }

        const _info_c = {
            m_strName: projection_js.projectionId,
            m_vPos: projection_js.camPos,
            m_vDstPos: projection_js.targetPos,
            m_uProjType: isEmpty(projection_js.type) ? 0 : projection_js.type,
            m_vWorNormal: isEmpty(projection_js.planeNormal) ? [0.0, 1.0, 0.0] : projection_js.planeNormal,
            m_vWorRight: isEmpty(projection_js.planeRight) ? [1.0, 0.0, 0.0] : projection_js.planeRight,
            m_vOffset: isEmpty(projection_js.nearFarPlaneOffset) ? [0, 0] : projection_js.nearFarPlaneOffset,
            m_qZNearRect: [_planeFarRectMin[0], _planeFarRectMax[0], _planeFarRectMin[1], _planeFarRectMax[1]],
            m_dAspect: isEmpty(projection_js.aspectRatio) ? 16.0 / 9.0 : projection_js.aspectRatio,
            m_dFovY: isEmpty(projection_js.fieldAngle) ? 60 * (Math.PI / 180) : projection_js.fieldAngle * (Math.PI / 180),
            m_strTexPath: m_strTexPath,
            m_uClrMult: isEmpty(projection_js.texClrMult) ? 0xffffffff : clrToU32(projection_js.texClrMult),
            m_sUMin: Math.round(_minUV[0] * 32767),
            m_sUMax: Math.round(_maxUV[0] * 32767),
            m_sVMin: Math.round(_minUV[1] * 32767),
            m_sVMax: Math.round(_maxUV[1] * 32767),
            m_vUVMapPtNum: _uvMapPtNum,
            m_arrUVMapPots: _arrUVMapPots,
            m_uShowState: isEmpty(projection_js.showState) ? 0 : projection_js.showState,
            m_uClipPlaneValid: _m_uClipPlaneValid,
            m_arrLocalClipPlanes: _arrLocalClipPlanes,
        };

        return _info_c;
    }

    // MARK 编辑

    /**
     * 进入投射编辑状态
     */
    Module.Projection.startEditState = function () {
        return Module.RealBIMWeb.BeginFrustumProjEdit();
    };

    /**
     * 退出投射编辑状态
     */
    Module.Projection.endEditState = function () {
        return Module.RealBIMWeb.EndFrustumProjEdit();
    };

    /**
     * 进入投射添加状态
     * @param {String} projectionId ///投射唯一标识
     */
    Module.Projection.startAddProjectionState = function (projectionId) {
        return Module.RealBIMWeb.BeginAddFrustumProj(projectionId);
    };

    /**
     * 退出投射添加状态
     */
    Module.Projection.endAddProjectionState = function () {
        return Module.RealBIMWeb.EndAddFrustumProj();
    };

    /**
     * 获取当前投射的标识
     */
    Module.Projection.getCurProjectionId = function () {
        return Module.RealBIMWeb.GetCurFrustumProjName();
    };

    /**
     * 设置投射裁剪面编辑类型
     * @param {number} type //编辑类型 0:表示整体编辑  1:表示局部编辑
     */
    Module.Projection.setClipPlaneEditType = function (type) {
        const _type = isEmpty(type) ? 0 : type;
        Module.RealBIMWeb.SetClipPlaneEditType(_type);
    };

    /**
     * 获取投射裁剪面编辑类型
     */
    Module.Projection.getClipPlaneEditType = function () {
        return Module.RealBIMWeb.GetClipPlaneEditType();
    };

    /**
     * 设置视锥体的翻滚角度 注：翻滚方向为相机点到目标点方向
     * @param {String} projectionId ///投射唯一标识
     * @param {number} angle //翻滚角度 >0:顺时针翻滚角度  <0:逆时针翻滚角度
     */
    Module.Projection.setPitch = function (projectionId, angle) {
        const _angle = isEmpty(angle) ? 0 : angle;
        return Module.RealBIMWeb.SetFrustumProjPitch(projectionId, _angle);
    };

    /**
     * 重置裁剪面效果
     * @param {String} projectionId ///投射唯一标识
     */
    Module.Projection.resetClipPlane = function (projectionId) {
        Module.RealBIMWeb.ResetClipPlane(projectionId);
    };

    // MARK 渲染效果

    /**
     * 设置指定投射显示状态 注：要在进入投射编辑状态之后有效, 只能改变当前已有的投射对象
     * @param {Array} projectionIdList //投射标识集合，空数组代表所有
     * @param {number} type //显示的状态 0：不显示几何信息 1：显示视锥体几何 2：显示裁剪面
     */
    Module.Projection.setShowState = function (projectionIdList, type) {
        if (!checkTypeLog(projectionIdList, 'projectionIdList', RE_Enum.RE_Check_Array)) return;
        var _vector_projectionI_id = new Module.RE_Vector_WStr();
        projectionIdList.forEach((element) => {
            _vector_projectionI_id.push_back(element);
        });
        let _type = isEmpty(type) ? 0 : type;
        Module.RealBIMWeb.SetFrustumProjShowState(_vector_projectionI_id, _type);
    };

    /**
     * 获取指定投射状态的所有标识集合 注：要在进入投射编辑状态之后有效
     * @param {number} type //显示的状态 0：不显示几何信息 1：显示视锥体几何 2：显示裁剪面
     */
    Module.Projection.getIdsByShowState = function (type) {
        let _type = isEmpty(type) ? 0 : type;
        const _vector_projectionI_id = Module.RealBIMWeb.GetFrustumProjIDByShowState(_type);
        let _projectionIdList = [];
        for (let i = 0; i < _vector_projectionI_id.size(); i++) {
            _projectionIdList.push(_vector_projectionI_id.get(i));
        }
        return _projectionIdList;
    };

    /**
     * 设置投射的可见性
     * @param {Array} projectionIdList //投射标识集合，空数组代表所有
     * @param {Boolean} visible // 是否可见
     */
    Module.Projection.setVisible = function (projectionIdList, visible) {
        if (!checkTypeLog(projectionIdList, 'projectionIdList', RE_Enum.RE_Check_Array)) return;
        let _vector_projectionI_id = new Module.RE_Vector_WStr();
        projectionIdList.forEach((element) => {
            _vector_projectionI_id.push_back(element);
        });
        let _visible = isEmpty(visible) ? true : visible;

        return Module.RealBIMWeb.SetFrustumProjInfoVisible(_vector_projectionI_id, _visible);
    };

    /**
     * 获取指定效果的投射标识集合
     * @param {Boolean} visible // 是否可见
     */
    Module.Projection.getProjectionIdByVisible = function (visible) {
        let _visible = isEmpty(visible) ? true : visible;
        const _vector_projectionI_id = Module.RealBIMWeb.GetFrustumProjInfoVisible(_visible);
        let _projectionIdList = [];
        for (let i = 0; i < _vector_projectionI_id.size(); i++) {
            _projectionIdList.push(_vector_projectionI_id.get(i));
        }
        return _projectionIdList;
    };

    /**
     * 设置裁剪面的有效性
     * @param {String} projectionId ///投射唯一标识
     * @param {REProjectionClipPlaneInfo} clipPlaneValid //有效性信息（REProjectionClipPlaneInfo 类型）
     */
    Module.Projection.setClipPlaneValid = function (projectionId, clipPlaneValid) {
        let _m_uClipPlaneValid = 0;
        if (!isEmpty(clipPlaneValid)) {
            _m_uClipPlaneValid = 0b00111111;
        } else {
            if (clipPlaneValid.topValid) _m_uClipPlaneValid |= 1 << 0;
            if (clipPlaneValid.bottomValid) _m_uClipPlaneValid |= 1 << 1;
            if (clipPlaneValid.leftValid) _m_uClipPlaneValid |= 1 << 2;
            if (clipPlaneValid.rightValid) _m_uClipPlaneValid |= 1 << 3;
            if (clipPlaneValid.frontValid) _m_uClipPlaneValid |= 1 << 4;
            if (clipPlaneValid.backValid) _m_uClipPlaneValid |= 1 << 5;
        }
        return Module.RealBIMWeb.SetClipPlaneValid(projectionId, _m_uClipPlaneValid);
    };

    /**
     * 获取裁剪面的有效性
     * @param {String} projectionId ///投射唯一标识
     */
    Module.Projection.getClipPlaneValid = function (projectionId) {
        const uValid = Module.RealBIMWeb.GetClipPlaneValid(projectionId);
        const _clipPlaneValid = new Module.REProjectionClipPlaneInfo();
        _clipPlaneValid.topValid = (uValid & 1) !== 0;
        _clipPlaneValid.bottomValid = (uValid & 2) !== 0;
        _clipPlaneValid.leftValid = (uValid & 4) !== 0;
        _clipPlaneValid.rightValid = (uValid & 8) !== 0;
        _clipPlaneValid.frontValid = (uValid & 16) !== 0;
        _clipPlaneValid.backValid = (uValid & 32) !== 0;
        return _clipPlaneValid;
    };

    /**
     * 设置指定投射的纹理（视频）路径
     * @param {String} projectionId ///投射唯一标识
     * @param {string} texPath //投射纹理路径，空字符串默认全白纹理
     */
    Module.Projection.setTexPath = function (projectionId, texPath) {
        if (isEmptyLog(projectionId, 'projectionId')) return false;
        if (isEmptyLog(texPath, 'texPath')) return false;
        const strTexPath = Module.RealBIMWeb.GetFrustumProjTexPath(projectionId);
        const _texPath = strTexPath.replace(/^(Single:|Single:Video:).*/, '$1' + texPath);

        return Module.RealBIMWeb.SetFrustumProjTexPath(projectionId, _texPath);
    };

    /**
     * 获取指定投射的纹理（视频）路径
     * @param {String} projectionId ///投射唯一标识
     */
    Module.Projection.getTexPath = function (projectionId) {
        if (isEmptyLog(projectionId, 'projectionId')) return '';
        const strTexPath = Module.RealBIMWeb.GetFrustumProjTexPath(projectionId);
        const texPath = strTexPath.replace(/Single:Video:|Single:/g, '');
        return texPath;
    };

    /**
     * 设置指定投射的投射类型
     * @param {String} projectionId ///投射唯一标识
     * @param {number} type //投射类型 0：表示正交投影 1：表示透视投影
     */
    Module.Projection.setType = function (projectionId, number) {
        if (isEmptyLog(projectionId, 'projectionId')) return false;
        const _number = isEmpty(number) ? 1 : number;
        return Module.RealBIMWeb.SetFrustumProjType(projectionId, _number);
    };

    /**
     * 获取指定投射的投射类型
     * @param {String} projectionId ///投射唯一标识
     */
    Module.Projection.setType = function (projectionId) {
        if (isEmptyLog(projectionId, 'projectionId')) return null;
        return Module.RealBIMWeb.GetFrustumProjType(projectionId);
    };



    /**
     * 设置投射效果是否被允许
     * @param {String} dataSetId //数据集标识
     * @param {Array} elemIdList //构件标识集合，只有BIM、单构件数据有效，瓦片、地形无效
     * @param {Boolean} enable // 是否允许投射，默认允许
     * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
     */
    Module.Projection.setProjectionMask = function (dataSetId, elemIdList, enable, elemScope) {
        if (isEmpty(dataSetId) || !dataSetId.length) {
            logParErr('dataSetId');
            return;
        }

        var _elemScope = isEmpty(elemScope) ? 0 : elemScope;
        let _enable = isEmpty(enable) ? true : enable;
        const uProjWriteMask = 0b00000100;
        const uMask = _enable ? 0b00000100 : 0b00000000;

        const dataSetType = Module.RealBIMWeb.GetSceType(dataSetId);
        if (dataSetType == 1) {
            // BIM
            if (isEmptyLog(elemIdList, 'elemIdList')) return;

            var _count = elemIdList.length;
            var _projid = Module.RealBIMWeb.ConvGolStrID2IntID(dataSetId);
            if (_count == 0) {
                Module.RealBIMWeb.SetHugeObjSubElemProjMasks(dataSetId, '', 0xffffffff, 0, uMask, uProjWriteMask, _elemScope);
            } else {
                var _moemory = (_count * 8).toString();
                Module.RealBIMWeb.ReAllocHeapViews(_moemory);
                var _elemIds = Module.RealBIMWeb.GetHeapView_U32(0);
                for (let i = 0; i < _count; ++i) {
                    var eleid = elemIdList[i];
                    _elemIds.set([eleid, _projid], i * 2);
                }
                Module.RealBIMWeb.SetHugeObjSubElemProjMasks(
                    dataSetId,
                    '',
                    _elemIds.byteLength,
                    _elemIds.byteOffset,
                    uMask,
                    uProjWriteMask,
                    _elemScope
                );
            }
        } else if (dataSetType == 2) {
            // 倾斜摄影
            Module.RealBIMWeb.SetUnVerHugeGroupProjMask(dataSetId, '', uMask, uProjWriteMask);
        } else if (dataSetType == 3) {
            // 地形
            Module.RealBIMWeb.SetTerrProjMask(dataSetId, uMask, uProjWriteMask);
        } else {
            // 未知
        }
    };

    // function getName() {
    //     let reg = /\s+at\s(\S+)\s\(/g
    //     let str = new Error().stack.toString()
    //     let res = reg.exec(str) && reg.exec(str)
    //     return res && res[1]
    // }
    // var name = getName().replace('CreateBlackHoleWebSDK.Module.','')

    // MOD-- 数学计算（Math） <---
    Module.Math = typeof Module.Math !== 'undefined' ? Module.Math : {}; //增加 Math 模块

    /**
     * 获取旋转特定弧度计算后的偏移、旋转分量
     * @param {dvec3} offset //初始偏移分量
     * @param {Number} radian //旋转弧度
     * @param {dvec3} rotatePos //旋转基点
     * @param {dvec3} axis //旋转轴向量
     */
    Module.Math.getTranAfterRotate = function (offset, radian, rotatePos, axis) {
        let cTran = Module.RealBIMWeb.GetTranAfterRotate(offset, radian, rotatePos, axis);
        return { offset: cTran.m_vOffset, rotate: cTran.m_qRotate };
    };

    /**
     * 获取两个向量相减值
     * @param {dvec3} vector1 //向量减数
     * @param {dvec3} vector2 //向量被减数
     */
    Module.Math.getVectorSubtract = function (vector1, vector2) {
        return [vector1[0] - vector2[0], vector1[1] - vector2[1], vector1[2] - vector2[2]];
    };

    /**
     * 获取两个向量相加值
     * @param {dvec3} vector1 //向量加数
     * @param {dvec3} vector2 //向量被加数
     */
    Module.Math.getVectorAdd = function (vector1, vector2) {
        return [vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2]];
    };

    /**
     * 获取两个向量相乘值
     * @param {dvec3} vector1 //向量乘数
     * @param {dvec3} vector2 //向量被乘数
     */
    Module.Math.getVectorMultiply = function (vector1, vector2) {
        return [vector1[0] * vector2[0], vector1[1] * vector2[1], vector1[2] * vector2[2]];
    };

    /**
     * 获取两个向量叉乘
     * @param {dvec3} vector1 //向量1
     * @param {dvec3} vector2 //向量2
     */
    Module.Math.getVectorCross = function (vector1, vector2) {
        const x = vector1[1] * vector2[2] - vector1[2] * vector2[1];
        const y = vector1[2] * vector2[0] - vector1[0] * vector2[2];
        const z = vector1[0] * vector2[1] - vector1[1] * vector2[0];
        return [x, y, z];
    };

    /**
     * 从点from 指向 点to 的单位方向向量
     * @param {Array<number>} from // 起点 [x,y,z]
     * @param {Array<number>} to // 终点 [x,y,z]
     * @return {Array<number>} 单位方向向量（长度=1）
     */
    Module.Math.getDirection = function (from, to) {
        // 1. 向量相减：to - from
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const dz = to[2] - from[2];

        // 2. 计算向量长度
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // 3. 归一化（单位向量）
        return [dx / length, dy / length, dz / length];
    };

    /**
     * 获取有序点序列构成线的信息 注：只有曲线才会返回曲线点序列
     * @param {Array} pointList //点序列
     * @param {Number} curveType //曲线类型 0: 折线, 1: Bezier曲线, 2: Hermite曲线
     */
    Module.Math.getLineInfo = function (pointList, curveType) {
        if (isEmptyLog(pointList, 'pointList')) return 0;
        let _arrPoint = new Module.RE_Vector_dvec3();
        for (let i = 0; i < pointList.length; i++) {
            _arrPoint.push_back(pointList[i]);
        }
        let _curveType = isEmpty(curveType) ? 0 : curveType;
        if (pointList.length == 2) {
            _curveType = 0;
        }
        const cStruct = Module.RealBIMWeb.GenCurveInfo(_arrPoint, _curveType);
        let curvePointList = [];
        if (_curveType != 0) {
            for (let i = 0; i < cStruct.m_arrDvec3Value1.size(); i++) {
                curvePointList.push(cStruct.m_arrDvec3Value1.get(i));
            }
        }
        return { dist: cStruct.m_dValue1, curveList: curvePointList };
    };

    /**
     * 获取自定义面扩展后的点序列
     * @param {Array} pointList //点序列
     * @param {Number} expandDist //扩展距离
     */
    Module.Math.getCustomFaceExpand = function (pointList, expandDist) {
        if (isEmptyLog(pointList, 'pointList')) return 0;
        let _arrPoint = new Module.RE_Vector_dvec3();
        for (let i = 0; i < pointList.length; i++) {
            _arrPoint.push_back(pointList[i]);
        }
        let _expandDist = isEmpty(expandDist) ? 0 : expandDist;
        const cStruct = Module.RealBIMWeb.ExpandTriangles(_arrPoint, _expandDist);
        if (!cStruct.m_bValue1) return [];
        let pointList_ret = [];
        for (let i = 0; i < cStruct.m_arrDvec3Value1.size(); i++) {
            pointList_ret.push(cStruct.m_arrDvec3Value1.get(i));
        }
        return pointList_ret;
    };

    /**
     * 根据封闭几何数据，获取当前范围中高程的最大和最小值 注：计算需要耗时，数据结果通过回调事件 RECalcHeightRangeFinish 获取
     * @param {Array} pointList //点序列
     */
    Module.Math.calcHeightRangeOfSection = function (pointList) {
        if (isEmptyLog(pointList, 'pointList')) return 0;
        let _arrPoint = new Module.RE_Vector_dvec3();
        for (let i = 0; i < pointList.length; i++) {
            _arrPoint.push_back(pointList[i]);
        }
        Module.RealBIMWeb.CalcHeightRangeOfSection(_arrPoint);
    };

    /**
     * 获取两个轴对齐包围盒（AABB）的空间关系
     * 注：参照对象的包围盒数据需保证有效性
     * @param {aabbarr} referenceAABB //参照轴对齐包围盒 [[minx,miny,minz],[maxx,maxy,maxz]]
     * @param {aabbarr} targetAABB //目标轴对齐包围盒 [[minx,miny,minz],[maxx,maxy,maxz]]
     * @return {number} 空间关系枚举值： -2: 参照包围盒数据错误（格式/数值非法）； -1: 目标包围盒数据错误（格式/数值非法）； 0: 目标包围盒完全包含于参照包围盒内部； 1: 两个包围盒相交（部分重叠）； 2: 两个包围盒相离（无交集）
     */
    Module.Math.getAABBSpatialRelation = function (referenceAABB, targetAABB) {
        if (isEmptyLog(referenceAABB, 'referenceAABB')) return 0x7fffffff;
        if (isEmptyLog(targetAABB, 'targetAABB')) return 0x7fffffff;
        return Module.RealBIMWeb.CheckRelLoc_AABB_AABB(referenceAABB, targetAABB);
    };

    /**
     * 获取点序列相对于轴对齐包围盒（AABB）的空间关系
     * 注：参照对象的数据需要保证有效性
     * @param {aabbarr} referenceAABB //参照轴对齐包围盒 [[minx,miny,minz],[maxx,maxy,maxz]]
     * @param {Array} targetPtList //目标对象点序列 [[x,y,z],...]
     * @return {number} 空间关系枚举值： -1: 参照包围盒数据错误（格式/数值非法）；0: 所有目标点均在参照包围盒内部；1: 部分目标点在包围盒内、部分在外（相交）；2: 所有目标点均在参照包围盒外部（相离）
     */
    Module.Math.getAABBToPtListRelation = function (referenceAABB, targetPtList) {
        if (isEmptyLog(referenceAABB, 'referenceAABB')) return 0x7fffffff;
        if (isEmptyLog(targetPtList, 'targetPtList')) return 0x7fffffff;
        let _arrPt = new Module.RE_Vector_dvec3();
        targetPtList.forEach((element) => {
            _arrPt.push_back(element);
        });
        return Module.RealBIMWeb.CheckRelLoc_AABB_POTS(referenceAABB, _arrPt);
    };

    /**
     * 获取两个点序列的空间关系（基于点序列构面后的相交判断）
     * 注：参照对象的数据需要保证有效性，如果需要上下无穷的空间关系，需要将两序列做投影，即z值相同
     * @param {Array} referencePtList //参照对象点序列 [[x,y,z],...]
     * @param {Array} targetPtList //目标对象点序列 [[x,y,z],...]
     * @return {number} 空间关系枚举值： -1: 参照点序列数据错误（构面失败）；0: 两个点序列对应的几何对象相交；1: 两个点序列对应的几何对象相离（无交集）
     */
    Module.Math.getPtListSpatialRelation = function (referencePtList, targetPtList) {
        if (isEmptyLog(referencePtList, 'referencePtList')) return 0x7fffffff;
        if (isEmptyLog(targetPtList, 'targetPtList')) return 0x7fffffff;
        let _arrRefPt = new Module.RE_Vector_dvec3();
        referencePtList.forEach((element) => {
            _arrRefPt.push_back(element);
        });

        let _arrDstPt = new Module.RE_Vector_dvec3();
        targetPtList.forEach((element) => {
            _arrDstPt.push_back(element);
        });
        return Module.RealBIMWeb.CheckRelLoc_POTS_POTS(_arrRefPt, _arrDstPt);
    };

    /**
     * 获取点序列的轴对齐包围盒（AABB）
     * @param {Array} ptList //点序列 [[x,y,z],...]
     * @return {aabbarr} 轴对齐包围盒 [[minx,miny,minz],[maxx,maxy,maxz]]
     */
    Module.Math.getPtListAABB = function (ptList) {
        if (isEmptyLog(ptList, 'ptList'))
            return [
                [0, 0, 0],
                [0, 0, 0],
            ];
        let _arrPt = new Module.RE_Vector_dvec3();
        ptList.forEach((element) => {
            _arrPt.push_back(element);
        });
        return Module.RealBIMWeb.GetAABB_POTS(_arrPt);
    };

    /**
     * 判断三维点是否在三角形面（A-B-C）内部/面上
     * @param {Array<number>} ptP // 待判断点 [x,y,z]
     * @param {Array<number>} ptA // 三角形顶点A [x,y,z]
     * @param {Array<number>} ptB // 三角形顶点B [x,y,z]
     * @param {Array<number>} ptC // 三角形顶点C [x,y,z]
     * @return {boolean} true: 点在三角形内部/面上；false: 点在三角形外部
     */
    Module.Math.isPtInTriangle = function (ptP, ptA, ptB, ptC) {
        if (isEmptyLog(ptP, 'ptP')) return false;
        if (isEmptyLog(ptA, 'ptA')) return false;
        if (isEmptyLog(ptB, 'ptB')) return false;
        if (isEmptyLog(ptC, 'ptC')) return false;
        return Module.RealBIMWeb.IsInside_Triangles(ptA, ptB, ptC, ptP);
    };

    /**
     * 判断三维点是否在多边形的柱形空间内部
     * 注：多边形所在平面垂直延伸，上下无穷
     * @param {Array<number>} targetPt // 待检测三维点 [x,y,z]
     * @param {Array<Array<number>>} polyPtList // 多边形顶点序列 [[x,y,z],...]
     * @return {boolean} true: 点在多边形柱形空间内部；false: 点在外部
     */
    Module.Math.isPtInPolygonCylindricalRegion = function (targetPt, polyPtList) {
        if (isEmptyLog(targetPt, 'targetPt')) return false;
        if (isEmptyLog(polyPtList, 'polyPtList')) return false;
        let _arrPolyPt = new Module.RE_Vector_dvec3();
        polyPtList.forEach((element) => {
            _arrPolyPt.push_back(element);
        });
        return Module.RealBIMWeb.IsInPolygon(targetPt, _arrPolyPt);
    };

    /**
     * 获取指定点到多边形边界的最短距离对应的交点坐标
     * @param {Array<number>} sourcePt // 源点 [x,y,z]
     * @param {Array<Array<number>>} polyPtList // 多边形顶点序列 [[x,y,z],...]
     * @return {Array<number>} 最短距离交点坐标 [x,y,z]；无交点返回[]
     */
    Module.Math.getPtToPolyEdgeShortestIntersect = function (sourcePt, polyPtList) {
        if (isEmptyLog(sourcePt, 'sourcePt')) return [];
        if (isEmptyLog(polyPtList, 'polyPtList')) return [];
        let _arrPolyPt = new Module.RE_Vector_dvec3();
        polyPtList.forEach((element) => {
            _arrPolyPt.push_back(element);
        });
        return Module.RealBIMWeb.GetNearestDistIntersect(sourcePt, _arrPolyPt);
    };

    /**
     * 获取两组顶点间对应转换的仿射变换信息 注：用于两个数据集做对应的仿射变换操作，实现两个数据集的对齐效果
     * @param {Array<Array<number>>} fromPtList // 原始顶点序列 [[x,y,z],...]，限制三个点坐标
     * @param {Array<Array<number>>} toPtList // 目标顶点序列 [[x,y,z],...]，限制三个点坐标
     * @return {any} 仿射变换信息
     */
    Module.Math.getPtListTran = function (fromPtList, toPtList) {
        if (!checkArrCountLog(fromPtList, 'fromPtList', 3)) return null;
        if (!checkArrCountLog(toPtList, 'toPtList', 3)) return null;
        let _arrFromPoints = new Module.RE_Vector_dvec3();
        fromPtList.forEach((el) => {
            _arrFromPoints.push_back(el);
        });
        let _arrToPoints = new Module.RE_Vector_dvec3();
        toPtList.forEach((el) => {
            _arrToPoints.push_back(el);
        });
        const cInfo = Module.RealBIMWeb.CalcTransform(_arrFromPoints, _arrToPoints);
        var tranInfo = new RELocInfo();
        tranInfo.scale = cInfo.m_vScale;
        tranInfo.rotate = cInfo.m_qRotate;
        tranInfo.offset = cInfo.m_vOffset;
        return tranInfo;
    };

    // MOD-- 工具函数（Tool） <---
    Module.Tool = typeof Module.Tool !== 'undefined' ? Module.Tool : {}; //增加 Tool 模块

    /**
     * 将扁平式AABB包围盒数据转换为双数组式AABB包围盒数据
     * @param {Array<number>} flatAABB // 扁平式包围盒 [minx,maxx,miny,maxy,minz,maxz]
     * @return {Array<Array<number>>} 双数组式包围盒 [[minx,miny,minz],[maxx,maxy,maxz]]
     */
    Module.Tool.convertAABBFlatToDoubleArr = function (flatAABB) {
        if (!checkArrCountLog(flatAABB, 'flatAABB', 6)) return [];
        const doubleArr = [
            [flatAABB[0], flatAABB[2], flatAABB[4]],
            [flatAABB[1], flatAABB[3], flatAABB[5]],
        ];
        return doubleArr;
    };

    /**
     * 将双数组式AABB包围盒数据转换为扁平式AABB包围盒数据
     * @param {Array<Array<number>>} doubleArrAABB // 双数组式包围盒 [[minx,miny,minz],[maxx,maxy,maxz]]
     * @return {Array<number>} 扁平式包围盒 [minx,maxx,miny,maxy,minz,maxz]
     */
    Module.Tool.convertAABBDoubleArrToFlat = function (doubleArrAABB) {
        if (!checkArrCountLog(doubleArrAABB, 'doubleArrAABB', 2)) return [];
        if (!checkArrCountLog(doubleArrAABB[0], 'doubleArrAABB', 3)) return [];
        if (!checkArrCountLog(doubleArrAABB[1], 'doubleArrAABB', 3)) return [];
        let flat = [];
        flat.push(doubleArrAABB[0][0]);
        flat.push(doubleArrAABB[1][0]); //Xmin、Xmax
        flat.push(doubleArrAABB[0][1]);
        flat.push(doubleArrAABB[1][1]); //Ymin、Ymax
        flat.push(doubleArrAABB[0][2]);
        flat.push(doubleArrAABB[1][2]); //Zmin、Zmax
        return flat;
    };

    // MOD-- 废弃替换接口 <---
    if (discardHint) {
        /**
         * 设置构件混合属性
         * @param {REElemBlendAttr} elemBlendAttr //构件的混合属性
         */
        Module.BIM.setElemBlendAttr = function (elemBlendAttr) {
            logWarn('温馨提示：当前使用接口（BIM.setElemBlendAttr）功能已替换为BIM.setElemAttr，请调整使用');
        };
        /**
         * 恢复构件的默认属性
         * @param {String} dataSetId //数据集标识
         * @param {Array} elemIdList //构件id集合
         * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
         */
        Module.BIM.resetElemBlendAttr = function (dataSetId, elemIdList, elemScope) {
            logWarn('温馨提示：当前使用接口（BIM.resetElemBlendAttr）功能已替换为BIM.resetElemAttr，请调整使用');
        };
        /**
         * 设置构件颜色
         * @param {String} dataSetId //数据集标识
         * @param {Array} elemIdList //构件id集合
         * @param {REColor} elemClr //构件颜色（REColor 类型）
         * @param {Number} elemScope //表示处理所有构件时的构件搜索范围(0->全局所有构件范围；1/2/3->项目内版本比对的新加构件/删除构件/修改构件)
         */
        Module.BIM.setElemClr = function (dataSetId, elemIdList, elemClr, elemScope) {
            logWarn('温馨提示：当前使用接口（BIM.setElemClr）功能已替换为BIM.setElemAttr，请调整使用');
        };
        /**
         * 获取当前构件设置的颜色
         * @param {String} dataSetId //数据集标识
         * @param {Array} elemIdList //构件id集合
         */
        Module.BIM.getElemClr = function (dataSetId, elemIdList) {
            logWarn('温馨提示：当前使用接口（BIM.getElemClr）功能已替换为BIM.getElemAttr，请调整使用');
        };
        /**
         * 停止闪烁
         * @param {String} ancName //锚点的名称
         */
        Module.Anchor.setAncAnimStop = function (ancName) {
            logWarn('温馨提示：当前使用接口（Anchor.setAncAnimStop）功能已替换为Anchor.setAncAnimPlay，请调整使用');
        };

        /**
         * 打开位置编辑放射变换窗口
         */
        Module.Edit.openAffineTransEditWnd = function () {
            logWarn('温馨提示：当前使用接口（Edit.openAffineTransEditWnd）功能已替换为Edit.startEdit，请调整使用');
        };

        /**
         * 关闭位置编辑放射变换窗口
         */
        Module.Edit.closeAffineTransEditWnd = function () {
            logWarn('温馨提示：当前使用接口（Edit.openAffineTransEditWnd）功能已替换为Edit.endEdit，请调整使用');
        };

        /**
         * 设置位置编辑放射变换窗口扩展按钮的可见性（重置|退出|保存）
         * @param {Boolean} visible //是否显示
         */
        Module.Edit.setExtendBtnVisible = function (visible) {
            logWarn('温馨提示：当前使用接口（Edit.openAffineTransEditWnd）功能已替换为Edit.startEdit，请调整使用');
        };
        /**
         * 获取是否是单次测量模式
         */
        Module.Measure.getSingleStyleState = function () {
            logWarn('温馨提示：当前使用接口（Measure.getSingleStyleState）功能已废弃，功能已合并到Measure.getMeasureType，请调整使用');
        };

        /**
         * 设置是否是单次测量模式
         * @param {Boolean} enable //是否允许
         */
        Module.Measure.setSingleStyleState = function (enable) {
            logWarn('温馨提示：当前使用接口（Measure.setSingleStyleState）功能已废弃，功能已合并到Measure.setMeasureType，请调整使用');
        };
    }

    // MOD-- 自定义方法 (工具) <---
    /**
     * 是不是空对象
     */
    function isEmpty(value) {
        if (typeof value == 'undefined') return true;
        if (value == null) return true;
        // if (!value) return true;
        if (Object.keys(value).length === 0 && value.constructor === Object) return true;
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
                    if (typeof value != 'string') {
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
        logErr('参数类型不匹配！-> ' + name);
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
        logErr('参数类型不匹配！-> ' + name);
        return false;
    }

    /**
     * 打印错误
     */
    function logErr(errStr) {
        console.error('【REError】: ' + errStr);
    }

    /**
     * 打印警告
     */
    function logWarn(warnStr) {
        console.warn('【REWarn】: ' + warnStr);
    }

    /**
     * 打印参数格式错误
     */
    function logParErr(errStr) {
        console.error('【REError】: 参数格式不正确！-> ' + errStr);
    }

    /**
     * 32位颜色转十六进制颜色 ABGR -> RBG_HEX
     * @param {Number} colorU32 //32位颜色值
     */
    function clrU32ToClr(colorU32) {
        let _hexStr = colorU32.toString(16);
        let count = _hexStr.length;
        for (let a = 0; a < 8 - count; a++) {
            _hexStr = '0' + _hexStr;
        }
        // ABGR -> RGBA
        // var _hexStr_Reverse = _hexStr.split('').reverse().join('');
        var _hex_R = _hexStr.substring(6, 8);
        var int_R = Math.round(parseInt(_hex_R, 16));
        var _hex_G = _hexStr.substring(4, 6);
        var int_G = Math.round(parseInt(_hex_G, 16));
        var _hex_B = _hexStr.substring(2, 4);
        var int_B = Math.round(parseInt(_hex_B, 16));
        var _hex_A = _hexStr.substring(0, 2);
        var int_A = Math.round(parseInt(_hex_A, 16));

        return new REColor(int_R, int_G, int_B, int_A);
    }

    /**
     * 颜色对象->U32_ABGR
     * @param {REColor} color
     */
    function clrToU32(color) {
        if (isEmpty(color.red) || isEmpty(color.green) || isEmpty(color.blue) || isEmpty(color.alpha)) return 0xffffffff;
        var int_R = Math.round(color.red);
        var clrHEX_R = int_R > 15 ? int_R.toString(16) : '0' + int_R.toString(16);
        var int_G = Math.round(color.green);
        var clrHEX_G = int_G > 15 ? int_G.toString(16) : '0' + int_G.toString(16);
        var int_B = Math.round(color.blue);
        var clrHEX_B = int_B > 15 ? int_B.toString(16) : '0' + int_B.toString(16);
        var int_A = Math.round(color.alpha);
        var clrHEX_A = int_A > 15 ? int_A.toString(16) : '0' + int_A.toString(16);
        var clrHEX_ABGR = '0x' + clrHEX_A + clrHEX_B + clrHEX_G + clrHEX_R;
        var intClr_ABGR = parseInt(clrHEX_ABGR);
        return intClr_ABGR;
    }

    /**
     * 颜色对象->U32_WBGR
     * @param {REColor} color
     */
    function clrToU32_WBGR(color) {
        if (
            isEmpty(color.red) ||
            color.red.toString() == 'NaN' ||
            isEmpty(color.green) ||
            color.green.toString() == 'NaN' ||
            isEmpty(color.blue) ||
            color.blue.toString() == 'NaN'
        )
            return 0x00ffffff;
        var int_R = Math.round(color.red);
        var clrHEX_R = int_R > 15 ? int_R.toString(16) : '0' + int_R.toString(16);
        var int_G = Math.round(color.green);
        var clrHEX_G = int_G > 15 ? int_G.toString(16) : '0' + int_G.toString(16);
        var int_B = Math.round(color.blue);
        var clrHEX_B = int_B > 15 ? int_B.toString(16) : '0' + int_B.toString(16);
        var clrHEX_W = (255).toString(16);
        var clrHEX_WBGR = '0x' + clrHEX_W + clrHEX_B + clrHEX_G + clrHEX_R;
        var intClr_WBGR = parseInt(clrHEX_WBGR);
        return intClr_WBGR;
    }

    function clrToU32_W_WBGR(color, weight) {
        if (
            isEmpty(color.red) ||
            color.red.toString() == 'NaN' ||
            isEmpty(color.green) ||
            color.green.toString() == 'NaN' ||
            isEmpty(color.blue) ||
            color.blue.toString() == 'NaN'
        ) {
            var intclrper = Math.round(weight);
            var newclrper = intclrper > 15 ? intclrper.toString(16) : '0' + intclrper.toString(16);
            var clrinfo = '0x' + newclrper + '000000';
            var clr = parseInt(clrinfo);
            return clr;
        }
        var int_R = Math.round(color.red);
        var clrHEX_R = int_R > 15 ? int_R.toString(16) : '0' + int_R.toString(16);
        var int_G = Math.round(color.green);
        var clrHEX_G = int_G > 15 ? int_G.toString(16) : '0' + int_G.toString(16);
        var int_B = Math.round(color.blue);
        var clrHEX_B = int_B > 15 ? int_B.toString(16) : '0' + int_B.toString(16);
        var int_W = Math.round(weight);
        var clrHEX_W = int_W > 15 ? int_W.toString(16) : '0' + int_W.toString(16);
        var clrHEX_WBGR = '0x' + clrHEX_W + clrHEX_B + clrHEX_G + clrHEX_R;
        var intClr_WBGR = parseInt(clrHEX_WBGR);
        return intClr_WBGR;
    }
    /**
     * U32_WBGR -> OBJ_W_RBG
     * @param {Number} clrU32_wbgr //32位颜色值
     */
    function clrU32ToObj_W_RBG(clrU32_wbgr) {
        let _hexStr = clrU32_wbgr.toString(16);
        let count = _hexStr.length;
        for (let a = 0; a < 8 - count; a++) {
            _hexStr = '0' + _hexStr;
        }

        var _hex_R = _hexStr.substring(6, 8);
        var int_R = Math.round(parseInt(_hex_R, 16));
        var _hex_G = _hexStr.substring(4, 6);
        var int_G = Math.round(parseInt(_hex_G, 16));
        var _hex_B = _hexStr.substring(2, 4);
        var int_B = Math.round(parseInt(_hex_B, 16));
        var _hex_W = _hexStr.substring(0, 2);
        var int_W = Math.round(parseInt(_hex_W, 16));

        return { int_R, int_G, int_B, int_W };
    }

    /**
     * 透明度->U32_WA
     * @param {Number} alpha
     */
    function alphaToU32_WA(alpha) {
        if (isEmpty(alpha)) return 0xffffffff;
        var int_A = Math.round(alpha);
        var clrHEX_A = int_A > 15 ? int_A.toString(16) : '0' + int_A.toString(16);
        var clrHEX_W = (255).toString(16);
        var clrHEX_WA = '0x' + clrHEX_W + clrHEX_A + 'ffff';
        var intClr_WA = parseInt(clrHEX_WA);
        return intClr_WA;
    }

    function alphaToU32_W_WA(alpha, weight) {
        if (isEmpty(alpha)) return 0x000000ff;
        var int_A = Math.round(alpha);
        var clrHEX_A = int_A > 15 ? int_A.toString(16) : '0' + int_A.toString(16);
        var int_W = Math.round(weight);
        var clrHEX_W = int_W > 15 ? int_W.toString(16) : '0' + int_W.toString(16);
        var clrHEX_WA = '0x0000' + clrHEX_W + clrHEX_A;
        var intClr_WA = parseInt(clrHEX_WA);
        return intClr_WA;
    }
    /**
     * U32_WA -> OBJ_W_A
     * @param {Number} clrU32_wa //32位颜色值
     */
    function clrU32ToObj_W_A(clrU32_wa) {
        let _hexStr = clrU32_wa.toString(16);
        let count = _hexStr.length;
        for (let a = 0; a < 8 - count; a++) {
            _hexStr = '0' + _hexStr;
        }

        var _hex_A = _hexStr.substring(6, 8);
        var int_A = Math.round(parseInt(_hex_A, 16));
        var _hex_W = _hexStr.substring(4, 6);
        var int_W = Math.round(parseInt(_hex_W, 16));

        return { int_A, int_W };
    }

    /**
     * 透明度及是否使用参数->U32
     * @param {Number} alpha_W
     */
    function clrToU32_AlphaW_Use_a_c_e_sm(alpha, weight, useNewAlpha, useNewClr, useNewEmis, useNewSmoothMetal) {
        // function alphaToU32_WA_UseCA(alpha, weight, useNewClr, useNewAlpha, useNewEmis, useNewSmoothMetal) {
        var _useNewAlphaHex = useNewAlpha ? 'ff' : '00'; //使用新的透明度
        var _useNewAtrr_c_e_sm = '00'; //默认使用新颜色、新自发光、新光泽度金属性
        if (useNewClr && !useNewEmis && !useNewSmoothMetal) {
            _useNewAtrr_c_e_sm = '01';
        } else if (!useNewClr && useNewEmis && !useNewSmoothMetal) {
            _useNewAtrr_c_e_sm = '02';
        } else if (useNewClr && useNewEmis && !useNewSmoothMetal) {
            _useNewAtrr_c_e_sm = '03';
        } else if (!useNewClr && !useNewEmis && useNewSmoothMetal) {
            _useNewAtrr_c_e_sm = '04';
        } else if (useNewClr && !useNewEmis && useNewSmoothMetal) {
            _useNewAtrr_c_e_sm = '05';
        } else if (!useNewClr && useNewEmis && useNewSmoothMetal) {
            _useNewAtrr_c_e_sm = '06';
        } else if (useNewClr && useNewEmis && useNewSmoothMetal) {
            _useNewAtrr_c_e_sm = '07';
        }

        if (isEmpty(alpha)) {
            var clrHEX_W = weight.toString(16);
            var clrHEX_WA = '0x' + clrHEX_W + 'ff' + _useNewAtrr_c_e_sm + _useNewAlphaHex;
            var intClr_WA = parseInt(clrHEX_WA);
            return intClr_WA;
        }
        var int_A = Math.round(alpha);
        var clrHEX_A = int_A > 15 ? int_A.toString(16) : '0' + int_A.toString(16);
        var int_W = Math.round(weight);
        var clrHEX_W = int_W > 15 ? int_W.toString(16) : '0' + int_W.toString(16);
        var clrHEX_WA = '0x' + clrHEX_W + clrHEX_A + _useNewAtrr_c_e_sm + _useNewAlphaHex;
        var intClr_WA = parseInt(clrHEX_WA);
        return intClr_WA;
    }

    /**
     * 透明度权重->U32_WA
     * @param {Number} alpha_W
     */
    function alphaWToU32_WA(alpha_W) {
        if (isEmpty(alpha_W)) return 0xffffffff;
        var int_AW_r = 255 - Math.round(alpha_W); //设置透明度使用权重进行设置，不然会造成混合的异常（透明材质的情况）；透明值始终为0，想设置透明，即权重的比例增大；不透明，即权重的比例减少
        var clrHEX_AW = int_AW_r > 15 ? int_AW_r.toString(16) : '0' + int_AW_r.toString(16);
        var clrHEX_WA = '0x' + clrHEX_AW + '00' + 'ffff';
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
    function clrRGBAListToClr(rbga_list) {
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
        var intemis = isEmpty(elemBlendAttr.elemEmis) ? 0 : Math.round(elemBlendAttr.elemEmis);
        var intemisratio = isEmpty(elemBlendAttr.elemEmisPercent) ? 0 : Math.round(elemBlendAttr.elemEmisPercent);
        var intsmoothtemp = isEmpty(elemBlendAttr.elemSmooth) ? 0 : Math.round(elemBlendAttr.elemSmooth);
        var intmetaltemp = isEmpty(elemBlendAttr.elemMetal) ? 0 : Math.round(elemBlendAttr.elemMetal);
        var intsmmeratio = isEmpty(elemBlendAttr.elemSmmePercent) ? 0 : Math.round(elemBlendAttr.elemSmmePercent);
        var intsmooth = Math.round((intsmoothtemp / 255) * 63);
        var intmetal = Math.round((intmetaltemp / 255) * 3);
        var pbrtemp = intemis + intemisratio * 256 + intsmooth * 65536 + intmetal * 4194304 + intsmmeratio * 16777216;
        var pbr = Math.round(pbrtemp);
        return pbr;
    }

    /**
     * 32位整数转换位16进制字符串，在前导的零被省略的情况下进行补充
     * @param {Number} num_32 //32位数值
     */
    function conv32_hex16(num_32) {
        // 将整数转换为十六进制字符串
        let hex = num_32.toString(16);
        // 检查转换后的字符串长度，并用'0'填充到8个字符（即32位的一半）
        // 这是因为每个十六进制位代表4个二进制位，所以32位需要8个十六进制字符
        while (hex.length < 8) {
            hex = '0' + hex;
        }
        return hex;
    }

    /**
     * 处理数值小数点后位数
     * @param {Number} num //数值
     * @param {Number} fixed //限制位数
     */
    function numFixed(num, fixed = 6) {
        return parseFloat(num.toFixed(fixed).replace(/\.?0+$/, ''));
    }

    /**
     * 处理数组中的每个数值的小数点后位数（返回新数组）
     * @param {Array} arr 数值数组
     * @param {Number} fixed 限制位数（默认2位）
     */
    function arrayNumFixed(arr, fixed = 6) {
        return arr.map((num) => numFixed(num, fixed));
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
            } else {
                continue;
            }
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
     * 判断是否有空值
     * @param {Array} array //列表
     * @param {String} paramName //需要判断的key
     */
    function hasNullProt(array, paramName) {
        for (const key in array) {
            if (Object.hasOwnProperty.call(array, key)) {
                const element = array[key];
                let isHas = isEmpty(element[paramName]);
                if (isHas) return true;
            } else {
                continue;
            }
        }
        return false;
    }

    /**
     * 删除所有空属性
     */
    function removeEmptyProperty(obj) {
        Object.keys(obj).forEach((item) => {
            if (obj[item] === undefined || obj[item] === null || obj[item] === 'null') {
                delete obj[item];
            }
        });
        return obj;
    }

    /**
     * c++ 类型转换 int->U32
     * @param {Number} type
     */
    function convIntToU32(type) {
        let _type = 1;
        switch (type) {
            case 1:
                _type = 1; //1<<0
                break;
            case 2:
                _type = 2; //1<<1
                break;
            case 3:
                _type = 4; //1<<2
                break;
            case 4:
                _type = 8; //1<<3
                break;
            case 5:
                _type = 16; //1<<4
                break;
            case 6:
                _type = 32; //1<<5
                break;
            case 7:
                _type = 64; //1<<6
                break;
            case 8:
                _type = 128; //1<<7
                break;
        }
        return _type;
    }

    /**
     * c++ 类型转换 u32->int
     * @param {Number} type
     */
    function convU32ToInt(type) {
        let _type = 1;
        switch (type) {
            case 1:
                _type = 1; //1<<0
                break;
            case 2:
                _type = 2; //1<<1
                break;
            case 4:
                _type = 3; //1<<2
                break;
            case 8:
                _type = 4; //1<<3
                break;
            case 16:
                _type = 5; //1<<4
                break;
            case 32:
                _type = 6; //1<<5
                break;
            case 64:
                _type = 7; //1<<6
                break;
            case 128:
                _type = 8; //1<<7
                break;
            default:
                break;
        }
        return _type;
    }

    /**
     * 创建支持嵌套ID列表分片处理的函数包装器
     * @param {Function} originalFn - 需要被包装的原始函数
     * @param {Object} options - 配置选项
     * @param {string} [options.idPath=''] - ID列表的路径（如'param.ids'）
     *                                      - 当ID列表是函数的直接参数时，留空
     *                                      - 当ID列表嵌套在对象中时，使用点号表示路径
     * @param {number} [options.batchSize=500000] - 每批处理的ID数量 默认50万构件
     * @param {number|string} [options.argIndex=0] - 目标参数的位置或名称
     *                                            - 数字表示参数索引（从0开始）
     *                                            - 字符串表示参数名称（需函数定义有明确名称）
     * @param {boolean} [options.hasReturnValue=true] - 函数是否有返回值
     *                                                - 对于SET类型接口，通常为false
     *                                                - 对于GET类型接口，通常为true
     * @param {Function} [options.mergeFn=defaultMergeFn] - 结果合并函数
     *                                                    - 用于合并多个批次的返回值
     *                                                    - 仅在hasReturnValue为true时生效
     * @returns {Function} - 包装后的函数，调用方式与原函数完全一致
     */
    function sharding_createShardingConstuctor(originalFn, options) {
        const { idPath = '', batchSize = 500000, argIndex = 0, hasReturnValue = true, mergeFn = sharding_defaultMergeFn } = options;

        return function (...args) {
            // 获取目标参数（根据索引或名称）
            let targetArg;
            if (typeof argIndex === 'number') {
                targetArg = args[argIndex]; // 通过索引获取参数
            } else {
                const paramNames = sharding_getParamNames(originalFn);
                const index = paramNames.indexOf(argIndex);
                if (index === -1) {
                    console.warn(`未找到名为 "${argIndex}" 的参数`);
                    return originalFn(...args);
                }
                targetArg = args[index]; // 通过名称获取参数
            }

            // 获取ID列表（支持直接参数和嵌套对象）
            let idList;
            if (idPath === '') {
                idList = targetArg; // 直接参数场景
            } else {
                idList = sharding_getNestedProperty(targetArg, idPath); // 嵌套参数场景
            }

            // 如果ID列表不存在或无需分片，直接调用原函数
            if (!idList || !Array.isArray(idList) || idList.length <= batchSize) {
                return originalFn(...args);
            }

            // 分片处理ID列表
            const batches = [];
            for (let i = 0; i < idList.length; i += batchSize) {
                batches.push(idList.slice(i, i + batchSize));
            }

            // 保存原始ID列表，用于后续恢复
            const originalIdList = idList.slice();

            // 用于存储各批次的返回值（仅在有返回值时使用）
            const results = [];

            // 依次处理每个批次
            for (const batch of batches) {
                // 更新当前批次的ID列表
                if (idPath === '') {
                    args[argIndex] = batch; // 直接参数场景
                } else {
                    sharding_setNestedProperty(targetArg, idPath, batch); // 嵌套参数场景
                }

                // 调用原函数并获取结果
                const result = originalFn(...args);

                // 仅在需要返回值时收集结果
                if (hasReturnValue) {
                    results.push(result);
                }
            }

            // 恢复原始参数，确保不影响后续调用
            if (idPath === '') {
                args[argIndex] = originalIdList;
            } else {
                sharding_setNestedProperty(targetArg, idPath, originalIdList);
            }

            // 根据配置决定是否返回合并后的结果
            if (!hasReturnValue) {
                return; // 无返回值（如SET类型接口）
            }

            // 合并所有批次的结果并返回
            return mergeFn(results);
        };
    }

    /**
     * 默认的结果合并函数
     * @param {Array} results - 各批次的返回值数组
     * @returns {*} - 合并后的结果
     *              - 布尔值数组：所有为true时返回true，否则false
     *              - 对象数组：合并为一个对象（后面的覆盖前面的）
     *              - 其他类型：返回最后一个结果
     */
    function sharding_defaultMergeFn(results) {
        // 处理布尔值结果（所有为true才返回true）
        if (results.every((result) => typeof result === 'boolean')) {
            return results.every(Boolean);
        }

        // 处理数组结果（合并为一个数组）
        if (results.every((result) => Array.isArray(result))) {
            return results.flat();
        }

        // 处理对象结果（合并为一个对象）
        if (results.every((result) => typeof result === 'object' && result !== null)) {
            return Object.assign({}, ...results);
        }

        // 其他情况返回最后一个结果
        return results[results.length - 1];
    }

    /**
     * 辅助函数：获取函数的参数名称
     * @param {Function} fn - 目标函数
     * @returns {Array<string>} - 参数名称数组
     */
    function sharding_getParamNames(fn) {
        const funcStr = fn.toString();
        const paramMatch = funcStr.match(/\(([^)]*)\)/);
        if (!paramMatch || !paramMatch[1]) return [];

        return paramMatch[1]
            .split(',')
            .map((param) =>
                param
                    .trim()
                    .replace(/\/\*.*\*\//, '')
                    .trim()
            )
            .filter((param) => param);
    }

    /**
     * 辅助函数：通过路径获取嵌套对象的属性
     * @param {Object} obj - 目标对象
     * @param {string} path - 属性路径（如'parent.child.key'）
     * @returns {*} - 属性值，若路径不存在则返回undefined
     */
    function sharding_getNestedProperty(obj, path) {
        if (!obj || typeof obj !== 'object') return undefined;

        return path.split('.').reduce((current, key) => {
            return current && current[key];
        }, obj);
    }

    /**
     * 辅助函数：通过路径设置嵌套对象的属性
     * @param {Object} obj - 目标对象
     * @param {string} path - 属性路径（如'parent.child.key'）
     * @param {*} value - 要设置的值
     */
    function sharding_setNestedProperty(obj, path, value) {
        if (!obj || typeof obj !== 'object') return;

        const keys = path.split('.');
        const lastKey = keys.pop();

        keys.reduce((current, key) => {
            current[key] = current[key] || {};
            return current[key];
        }, obj)[lastKey] = value;
    }

    /**
     * 获取当前时间
     * 格式化结果：时:分:秒.毫秒（例如：14:30:25.123）
     */
    function getCurrTime() {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const milliseconds = date.getMilliseconds();
        const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds, 3)}`;
        return formattedTime;
    }

    /**
     * 补零函数（支持指定长度，默认2位）
     */
    const padZero = (num, length = 2) => {
        let str = num.toString();
        while (str.length < length) str = `0${str}`;
        return str;
    };

    /**
     * 判断是否是移动端设备
     */
    function isMobilDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const patterns = [/ipad/i, /iphone os/i, /midp/i, /rv:1.2.3.4/i, /ucweb/i, /android/i, /windows ce/i, /windows mobil/i, /HarmonyOS/i];
        return patterns.some((pattern) => pattern.test(userAgent));
    }

    /**
     * 判断是否是 ios 移动端设备
     */
    function isMobilDevice_ios() {
        const userAgent = navigator.userAgent.toLowerCase();
        const patterns = [/ipad/i, /iphone os/i];
        return patterns.some((pattern) => pattern.test(userAgent));
    }

    /**
     * 判断是否是 鸿蒙 移动端设备
     */
    function isMobilDevice_HarmonyOS() {
        const userAgent = navigator.userAgent.toLowerCase();
        const patterns = [/HarmonyOS/i];
        return patterns.some((pattern) => pattern.test(userAgent));
    }

    // MOD-- 枚举类型 <---

    // MARK RE_Enum
    //枚举参数
    const RE_Enum = {
        RE_Check_String: 1, //检测字符串
        RE_Check_Array: 2, //检测数组
    };

    // MARK RE_Viewport
    //视图类型
    const REVpTypeEm = {
        None: '', //该视图不显示任何内容
        BIM: 'BIM', //该视图显示BIM场景模型
        CAD: 'CAD', //该视图显示CAD图纸
        Panorama: '360', //该视图显示360全景图
    };
    ExtModule.REVpTypeEm = REVpTypeEm;

    //视图排列方式
    const REVpRankEm = {
        Single: 0, //视图0/视图1任一为空字符串：屏幕中只显示一个内容有效的视图
        LR: 1, //屏幕自左向右依次显示视图0、视图1
        TB: -1, //屏幕自下向上依次显示视图0、视图1
    };
    ExtModule.REVpRankEm = REVpRankEm;

    // MARK CamLoc
    //表示ViewCude视图的类型
    const RECamDirEm = {
        CAM_DIR_FRONT: 'Module.RE_CAM_DIR.FRONT', //面-主视图（前视图）
        CAM_DIR_BACK: 'Module.RE_CAM_DIR.BACK', //面-后视图
        CAM_DIR_LEFT: 'Module.RE_CAM_DIR.LEFT', //面-左视图
        CAM_DIR_RIGHT: 'Module.RE_CAM_DIR.RIGHT', //面-右视图
        CAM_DIR_TOP: 'Module.RE_CAM_DIR.TOP', //面-俯视图（上视图）
        CAM_DIR_BOTTOM: 'Module.RE_CAM_DIR.BOTTOM', //面-仰视图（下视图）
        CAM_DIR_TOPFRONT: 'Module.RE_CAM_DIR.TOPFRONT', //棱-上前
        CAM_DIR_TOPRIGHT: 'Module.RE_CAM_DIR.TOPRIGHT', //棱-上右
        CAM_DIR_TOPBACK: 'Module.RE_CAM_DIR.TOPBACK', //棱-上后
        CAM_DIR_TOPLEFT: 'Module.RE_CAM_DIR.TOPLEFT', //棱-上左
        CAM_DIR_LEFTFRONT: 'Module.RE_CAM_DIR.LEFTFRONT', //棱-左前
        CAM_DIR_RIGHTFRONT: 'Module.RE_CAM_DIR.RIGHTFRONT', //棱-前右
        CAM_DIR_RIGHTBACK: 'Module.RE_CAM_DIR.RIGHTBACK', //棱-右后
        CAM_DIR_LEFTBACK: 'Module.RE_CAM_DIR.LEFTBACK', //棱-后左
        CAM_DIR_BOTTOMFRONT: 'Module.RE_CAM_DIR.BOTTOMFRONT', //棱-下前
        CAM_DIR_BOTTOMRIGHT: 'Module.RE_CAM_DIR.BOTTOMRIGHT', //棱-下右
        CAM_DIR_BOTTOMBACK: 'Module.RE_CAM_DIR.BOTTOMBACK', //棱-下后
        CAM_DIR_BOTTOMLEFT: 'Module.RE_CAM_DIR.BOTTOMLEFT', //棱-下左
        CAM_DIR_TOPRIGHTBACK: 'Module.RE_CAM_DIR.TOPRIGHTBACK', //顶点-上右后
        CAM_DIR_TOPLEFTBACK: 'Module.RE_CAM_DIR.TOPLEFTBACK', //顶点-上左后
        CAM_DIR_TOPLEFTFRONT: 'Module.RE_CAM_DIR.TOPLEFTFRONT', //顶点-上左前
        CAM_DIR_TOPRIGHTFRONT: 'Module.RE_CAM_DIR.TOPRIGHTFRONT', //顶点-上右前
        CAM_DIR_BOTTOMRIGHTBACK: 'Module.RE_CAM_DIR.BOTTOMRIGHTBACK', //顶点-下右后
        CAM_DIR_BOTTOMLEFTBACK: 'Module.RE_CAM_DIR.BOTTOMLEFTBACK', //顶点-下左后
        CAM_DIR_BOTTOMLEFTFRONT: 'Module.RE_CAM_DIR.BOTTOMLEFTFRONT', //顶点-下左前
        CAM_DIR_BOTTOMRIGHTFRONT: 'Module.RE_CAM_DIR.BOTTOMRIGHTFRONT', //顶点-下右前
        CAM_DIR_DEFAULT: 'Module.RE_CAM_DIR.DEFAULT', //默认视角
        CAM_DIR_CURRENT: 'Module.RE_CAM_DIR.CURRENT', //当前视角
    };
    ExtModule.RECamDirEm = RECamDirEm;

    // MARK UI
    //系统界面对应C++名称
    const RESysWndMateEm = {
        PanelBtn_TerrainAlpha: 'BuiltIn_Btn_TerrAlpha', //底部主工具栏-地形透明度
        PanelBtn_FocusBoxSel: 'BuiltIn_Btn_FocusBoxSel', //底部主工具栏-框选放大
        PanelBtn_Reset: 'BuiltIn_Btn_ResetAll', //底部主工具栏-重置操作
        PanelBtn_IsolateBuild: 'BuiltIn_Btn_Isolate', //底部主工具栏-隔离构件
        PanelBtn_HideBuild: 'BuiltIn_Btn_Hide', //底部主工具栏-隐藏构件
        PanelBtn_RecoverDisplay: 'BuiltIn_Btn_ResetVisible', //底部主工具栏-恢复显示
        PanelBtn_Measure: 'BuiltIn_Btn_Measure', //底部主工具栏-测量
        PanelBtn_Cutting: 'BuiltIn_Btn_Cutting', //底部主工具栏-剖切
        PanelBtn_Setting: 'BuiltIn_Btn_Setting', //底部主工具栏-设置
        SysWnd_AffineTransMode: 'PositionMatchingWnd', //位置编辑仿射变换窗口
    };
    ExtModule.RESysWndMateEm = RESysWndMateEm;

    // MARK CAD
    //CAD单位
    const RECadUnitEm = {
        CAD_UNIT_Inch: 'Module.RE_CAD_UNIT.Inch', //英寸
        CAD_UNIT_Foot: 'Module.RE_CAD_UNIT.Foot', //英尺
        CAD_UNIT_Mile: 'Module.RE_CAD_UNIT.Mile', //英里
        CAD_UNIT_Millimeter: 'Module.RE_CAD_UNIT.Millimeter', //毫米
        CAD_UNIT_Centimeter: 'Module.RE_CAD_UNIT.Centimeter', //厘米
        CAD_UNIT_Meter: 'Module.RE_CAD_UNIT.Meter', //米
        CAD_UNIT_Kilometer: 'Module.RE_CAD_UNIT.Kilometer', //千米
        CAD_UNIT_Microinch: 'Module.RE_CAD_UNIT.Microinch', //微英寸
        CAD_UNIT_Mil: 'Module.RE_CAD_UNIT.Mil', //毫英寸
        CAD_UNIT_Yard: 'Module.RE_CAD_UNIT.Yard', //码
        CAD_UNIT_Angstrom: 'Module.RE_CAD_UNIT.Angstrom', //埃
        CAD_UNIT_Nanometer: 'Module.RE_CAD_UNIT.Nanometer', //纳米
        CAD_UNIT_Micron: 'Module.RE_CAD_UNIT.Micron', //微米
        CAD_UNIT_Decimeter: 'Module.RE_CAD_UNIT.Decimeter', //分米
        CAD_UNIT_Decameter: 'Module.RE_CAD_UNIT.Decameter', //十米
        CAD_UNIT_Hectometer: 'Module.RE_CAD_UNIT.Hectometer', //百米
        CAD_UNIT_Gigameter: 'Module.RE_CAD_UNIT.Gigameter', //百万公里
        CAD_UNIT_Astro: 'Module.RE_CAD_UNIT.Astro', //天文
        CAD_UNIT_Lightyear: 'Module.RE_CAD_UNIT.Lightyear', //光年
        CAD_UNIT_Parsec: 'Module.RE_CAD_UNIT.Parsec', //天体
    };
    ExtModule.RECadUnitEm = RECadUnitEm;

    // MARK REGridPosEm
    //表示九宫格位置枚举
    const REGridPosEm = {
        LT: [-1, 1], //左上区域
        MT: [0, 1], //中上区域
        RT: [1, 1], //右上区域
        LM: [-1, 0], //左中区域
        MM: [0, 0], //中中区域
        RM: [1, 0], //右中区域
        LB: [-1, -1], //左下区域
        MB: [0, -1], //中下区域
        RB: [1, -1], //右下区域
    };
    ExtModule.REGridPosEm = REGridPosEm;

    // MARK RETextFmtEm
    //表示文字排版类型枚举
    const RETextFmtEm = {
        LT: (1 << 2) /*TEXT_FMT_TOP*/ | (1 << 3) /*TEXT_FMT_LEFT*/, //左上区域
        MT: (1 << 2) /*TEXT_FMT_TOP*/ | (1 << 4) /*TEXT_FMT_HCENTER*/, //中上区域
        RT: (1 << 5) /*TEXT_FMT_RIGHT*/ | (1 << 2) /*TEXT_FMT_TOP*/, //右上区域
        LM: (1 << 3) /*TEXT_FMT_LEFT*/ | (1 << 1) /*TEXT_FMT_VCENTER*/, //左中区域
        MM: (1 << 4) /*TEXT_FMT_HCENTER*/ | (1 << 1) /*TEXT_FMT_VCENTER*/, //中中区域
        RM: (1 << 5) /*TEXT_FMT_RIGHT*/ | (1 << 1) /*TEXT_FMT_VCENTER*/, //右中区域
        LB: (1 << 3) /*TEXT_FMT_LEFT*/ | (1 << 0) /*TEXT_FMT_BOTTOM*/, //左下区域
        MB: (1 << 1) /*TEXT_FMT_VCENTER*/ | (1 << 0) /*TEXT_FMT_BOTTOM*/, //中下区域
        RB: (1 << 5) /*TEXT_FMT_RIGHT*/ | (1 << 0) /*TEXT_FMT_BOTTOM*/, //右下区域
    };
    ExtModule.RETextFmtEm = RETextFmtEm;

    // MARK Entity
    //表示单构件动画播放模式
    const REEntityAnimPlayModeEm = {
        ONCE: 'Module.RE_ANIM_PLAY.ONCE', //表示仅播放一次，播放到边界处时停止，位置/方向保持不变
        ONCETURN: 'Module.RE_ANIM_PLAY.ONCETURN', //表示仅播放一次，播放到边界处时停止，位置不变，方向调转
        ONCERESET: 'Module.RE_ANIM_PLAY.ONCERESET', //表示仅播放一次，播放到边界处时停止，位置移到另一边界，方向不变
        REPEAT: 'Module.RE_ANIM_PLAY.REPEAT', //表示重复播放，当播放到边界处时方向不变从另一边界处继续播放
        REPEATTURN: 'Module.RE_ANIM_PLAY.REPEATTURN', //表示重复播放，当播放到边界处时方向调转继续播放
    };
    ExtModule.REEntityAnimPlayModeEm = REEntityAnimPlayModeEm;

    //表示单构件动画播放状态
    const REEntityAnimPlayStateEm = {
        PLAY: 'Module.RE_ANIM_STATE.PLAY', //表示当前正处于播放状态
        PAUSE: 'Module.RE_ANIM_STATE.PAUSE', //表示当前正处于暂停状态
        STOPMIN: 'Module.RE_ANIM_STATE.STOPMIN', //表示当前正处于停止状态，播放位置在最小边界处
        STOPMAX: 'Module.RE_ANIM_STATE.STOPMAX', //表示当前正处于停止状态，播放位置在最大边界处
        FORCEDWORD: 'Module.RE_ANIM_STATE.FORCEDWORD', //0x7fffffff
    };
    ExtModule.REEntityAnimPlayStateEm = REEntityAnimPlayStateEm;

    // MARK Terrain
    //表示地形资源数据的类型
    const RETerrResEm = {
        HEIGHT: 'Module.RE_TERR_RES_TYPE.HEIGHT', //高程图
        EXTRUDE: 'Module.RE_TERR_RES_TYPE.EXTRUDE', //挤出矢量
        IMG_PIC: 'Module.RE_TERR_RES_TYPE.IMG_PIC', //影像图片
        IMG_SHP: 'Module.RE_TERR_RES_TYPE.IMG_SHP', //影像矢量
        ALL: 'Module.RE_TERR_RES_TYPE.ALL', //表示所有类型的资源数据
        FORCE_DWORD: 'Module.RE_TERR_RES_TYPE.FORCE_DWORD', //
    };
    ExtModule.RETerrResEm = RETerrResEm;

    // MARK System
    //当前的交互操作状态
    const REInteractStateEm = {
        INSIDE: -1, //内部交互状态
        NORMAL: 0, //正常浏览状态
        MARK_EDIT: 1, //标注编辑状态
        MARK_SHOW_MARK: 2, //显示标注框状态
        VIEWCUBE_HOLDING: 3, //ViewCube操作状态
        SCENE_CLIPPING: 4, //场景剖切
        SCENE_CLIPPING_TRANSFORM: 5, //场景剖切包围体变换操作
        MEASURE_PATH_EDIT: 6, //测量线编辑状态
        SEL_REGION_DRAG: 7, //框选框拖动状态
        FOCUS_SEL: 8, //框选放大状态
        SCENENODE_EDIT: 9, //位置编辑状态
        CONTROL_MATCH: 10, //控制配准状态
        EXTRUDE_EDIT: 11, //挤出操作区域的编辑状态
        OBLIQUE_EDIT: 12, //单体化操作区域的编辑状态
        WATER_EDIT: 13, //水面区域的编辑状态
        CONTPIPE_EDIT: 14, //连续管道编辑状态
        ENTITY_EDIT: 15, //实例编辑模式
        COMMON_SHAPE: 16, //通用矢量编辑状态
        PARTICLE_EDIT: 17, //粒子编辑状态
        SPOT_LIGHT_EDIT: 18, //点光源编辑状态
    };
    ExtModule.REInteractStateEm = REInteractStateEm;

    // MOD-- 函数执行打印 <---
    Module.Log = typeof Module.Log !== 'undefined' ? Module.Log : {}; //增加 Log 模块

    /**
     * 暴露全局日志开关函数
     */
    Module.Log.enableLog = function () {
        // 【新增】排除C++绑定的常量/对象，避免包装时访问
        function isCPPBindingProp(key) {
            return /^RE_/.test(key) || ['RealBIMWeb'].includes(key);
        }
        // 判断是否为类构造函数（首字母大写的函数）
        function isClassConstructor(func) {
            if (typeof func !== 'function') return false;
            const funcName = func.name;
            // 类名通常首字母大写，且不为空（排除匿名函数）
            return funcName && funcName[0] === funcName[0].toUpperCase();
        }
        // -------------------------- 定义所有需要监控的模块列表（新增模块只需加在这里） --------------------------
        const modulesToMonitor = [
            'Common',
            'Light',
            'Model',
            'Camera',
            'SkyBox',
            'Coordinate',
            'Probe',
            'Graphics',
            'Tag',
            'Mark',
            'Anchor',
            'Geometry',
            'Earthwork',
            'BIM',
            'CAD',
            'Grid',
            'Terrain',
            'Panorama',
            'Edit',
            'Measure',
            'ShpEdit',
            'Water',
            'FEM',
            'AxisGrid',
            'Elevation',
            'Fence',
            'Clip',
            'Animation',
            'MiniMap',
            'Pipe',
            'Entity',
            'Analysis3D',
            'Extrude',
            'Monomer',
            'Particle',
            'Math',
        ]; // 这里放所有要处理的模块名

        // -------------------------- 安全包装方法：仅包装调用逻辑，不解析内部变量 --------------------------
        function safeWrapMethod(target, methodName, fullFuncName) {
            const originalMethod = target[methodName];
            // 筛选条件：函数 + 非类构造 + 未包装 + 非C++绑定属性
            if (
                typeof originalMethod === 'function' &&
                !isClassConstructor(originalMethod) &&
                !originalMethod.__isWrapped &&
                !isCPPBindingProp(methodName)
            ) {
                const wrappedMethod = function (...args) {
                    try {
                        // 仅打印调用日志，不访问方法内部的变量
                        console.log(`【RELog】 time: ${getCurrTime()}  func: ${fullFuncName}`);
                        // 【关键】保持原方法的this和参数，异常不阻断原逻辑
                        return originalMethod.apply(this, args);
                    } catch (err) {
                        console.warn(`【RELog】 调用 ${fullFuncName} 异常:`, err);
                        throw err; // 抛出异常，不影响原逻辑执行
                    }
                };
                wrappedMethod.__isWrapped = true;
                target[methodName] = wrappedMethod;
            }
        }

        // -------------------------- 包装子模块方法 --------------------------
        function wrapModuleMethodsForLog(moduleName) {
            Module[moduleName] = Module[moduleName] || {};
            const targetModule = Module[moduleName];

            Object.keys(targetModule).forEach((methodName) => {
                safeWrapMethod(targetModule, methodName, `${moduleName}.${methodName}`);
            });
        }

        // -------------------------- 包装根模块方法 --------------------------
        function wrapRootMethodsForLog() {
            Object.keys(Module).forEach((key) => {
                // 排除子模块、C++绑定属性
                if (!modulesToMonitor.includes(key) && !isCPPBindingProp(key)) {
                    safeWrapMethod(Module, key, key);
                }
            });
        }

        // -------------------------- 执行所有包装逻辑 --------------------------
        // 处理子模块
        modulesToMonitor.forEach((moduleName) => {
            wrapModuleMethodsForLog(moduleName);
        });
        // 处理根方法
        wrapRootMethodsForLog();
    };
    if (funcLog) {
        Module.Log.enableLog();
    }

    return ExtModule;
};

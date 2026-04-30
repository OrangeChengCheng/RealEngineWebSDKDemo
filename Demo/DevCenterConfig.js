var localDataSetList = [];

var re_canvas_size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

function getTopHeight() {
    let isHeader = document.getElementsByClassName('btnNew')?.[0]?.clientHeight === 54 || document.getElementById('btnNew'); //若有头部header栏，则减去54px
    let isHeader_2 = document.getElementsByClassName('btnNew-2')?.[0]?.clientHeight === 54 || document.getElementById('btnNew-2'); //若有头部header栏，则减去54px
    return isHeader ? (isHeader_2 ? 54 + 54 : 54) : 0;
}

// 页面加载时添加相关监听事件
window.onload = function () {
    // 若资源未准备好，则等待资源加载完成后再初始化
    if (!CreateBlackHoleWebSDK) {
        return;
    }
    // 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口, 初始化BlackHole3D
    BlackHole3D = typeof BlackHole3D !== 'undefined' ? BlackHole3D : {};
    BlackHole3D['canvas'] = (function () {
        var canvas = document.getElementById('canvas');
        return canvas;
    })();
    BlackHole3D = CreateBlackHoleWebSDK(BlackHole3D);
    // let re_css_isHeader = document.getElementsByClassName('btnNew')?.[0]?.clientHeight === 54 || document.getElementById('btnNew'); //若有头部header栏，则减去54px
    let topHeight = getTopHeight();
    // 目标宽高window.innerWidth，window.innerHeight，这里可结合实际场景设置canvas窗口大小
    if (BlackHole3D) {
        re_canvas_size.width = window.innerWidth;
        re_canvas_size.height = window.innerHeight - topHeight;
    }
    onResize(); // 初始化时调用一次，防止页面加载时出现比例问题
    // 开始监听模型加载
    addEngineListener(); //开启监听

    createLoading();
};

// 卸载模型资源
function onBeforeUnload() {
    if (BlackHole3D) {
        if (BlackHole3D.Model.getAllDataSetId()?.length > 0) {
            BlackHole3D.Model.unloadAllDataSet();
        }
        // 释放模型资源
        BlackHole3D.releaseEngine();
        // 重置BlackHole3D
        BlackHole3D = undefined;
    }
}

// 图形窗口改变时，需实时传递给引擎，否则模型会变形
function onResize() {
    // let isHeader = document.getElementsByClassName('btnNew')?.[0]?.clientHeight === 54 || document.getElementById('btnNew'); //若有头部header栏，则减去54px
    // 目标宽高window.innerWidth，window.innerHeight，这里可结合实际场景设置canvas窗口大小
    let topHeight = getTopHeight();
    if (BlackHole3D) {
        BlackHole3D.m_re_em_window_width = window.innerWidth;
        BlackHole3D.m_re_em_window_height = window.innerHeight - topHeight;
    }
}
// 模型加载的监听
function addEngineListener() {
    document.addEventListener('RESystemReady', RESystemReady); //系统初始化监听
    document.addEventListener('RESystemEngineCreated', RESystemEngineCreated); //场景初始化监听
    document.addEventListener('REDataSetLoadProgress', REDataSetLoadProgress); //模型加载进度监听
    document.addEventListener('REDataSetLoadFinish', REDataSetLoadFinish); //模型加载完成状态
    document.addEventListener('REDataSetLoadPanFinish', REDataSetLoadPanFinish);
    document.addEventListener('REPanLoadSingleFinish', REPanLoadSingleFinish);
    document.addEventListener('RECADLoadFinish', RECADLoadFinish);
    document.addEventListener('REMiniMapLoadCAD', REMiniMapLoadCAD); // 小地图加载完成监听
    document.addEventListener('RESystemSel', RESystemSel);
    document.addEventListener('RESystemSelElement', RESystemSelElement);
    document.addEventListener('RESystemSelShpElement', RESystemSelShpElement); //鼠标探测矢量元素事件
    document.addEventListener('RECADSelElement', RECADSelElement);
    window.addEventListener('beforeunload', onBeforeUnload); // 模型卸载监听
    window.addEventListener('resize', onResize); // 窗口大小变化实时调整canvas大小

    if (typeof addListener === 'function') {
        addListener(); // 确认存在后调用
    }
}
// 移除加载的监听
function removeEngineListener() {
    document.removeEventListener('RESystemReady', RESystemReady); //系统初始化监听
    document.removeEventListener('RESystemEngineCreated', RESystemEngineCreated); //场景初始化监听
    document.removeEventListener('REDataSetLoadProgress', REDataSetLoadProgress); //模型加载进度监听
    document.removeEventListener('REDataSetLoadFinish', REDataSetLoadFinish); //模型加载完成状态
    document.removeEventListener('REDataSetLoadPanFinish', REDataSetLoadPanFinish);
    document.removeEventListener('REPanLoadSingleFinish', REPanLoadSingleFinish);
    document.removeEventListener('RECADLoadFinish', RECADLoadFinish);
    document.removeEventListener('REMiniMapLoadCAD', REMiniMapLoadCAD); // 小地图加载完成监听
    document.removeEventListener('RESystemSel', RESystemSel);
    document.removeEventListener('RESystemSelElement', RESystemSelElement);
    document.removeEventListener('RESystemSelShpElement', RESystemSelShpElement); //鼠标探测矢量元素事件
    document.removeEventListener('RECADSelElement', RECADSelElement);
    window.removeEventListener('beforeunload', onBeforeUnload); // 模型卸载监听
    window.removeEventListener('resize', onResize); // 窗口大小变化实时调整canvas大小
}
//场景初始化，需正确传递相关参数,相关参数详见sdk文档注释
function RESystemReady() {
    var sysInfo = new BlackHole3D.RESysInfo();
    sysInfo.workerjsPath = 'https://demo.bjblackhole.com/BlackHole3.0/sdk/RealBIMWeb_Worker.js';
    sysInfo.renderWidth = re_canvas_size.width;
    sysInfo.renderHieght = re_canvas_size.height;
    BlackHole3D.initEngineSys(sysInfo);
    BlackHole3D.Common.setUseWebCache(true); //是否允许使用浏览器缓存
}
//初始化完成后，加载项目
function RESystemEngineCreated(e) {
    var isSuccess = e.detail.succeed;
    if (isSuccess) {
        //场景初始化成功，执行模型加载
        if (typeof RESystemEngineCreatedCallBack !== 'undefined') {
            RESystemEngineCreatedCallBack();
        } else if (window.vm && typeof window.vm.RESystemEngineCreatedCallBack !== 'undefined') {
            window.vm.RESystemEngineCreatedCallBack();
        } else {
            let _dataSetList = typeof dataSetList !== 'undefined' ? dataSetList : localDataSetList; //若已指定资源数据，则用指定的
            BlackHole3D.Model.loadDataSet(_dataSetList, true);
            BlackHole3D.Common.setMaxResMemMB(5500);
            BlackHole3D.Common.setExpectMaxInstMemMB(4500);
            BlackHole3D.Common.setExpectMaxInstDrawFaceNum(20000000);
            BlackHole3D.Common.setPageLoadLev(2);
        }
    } else {
        console.log('===========================  场景初始化 --> 失败！！！');
    }
}
// 以下为加载进度条的示例代码，仅供参考
function REDataSetLoadProgress(e) {
    if (typeof REDataSetLoadProgressCallBack !== 'undefined') {
        REDataSetLoadProgressCallBack(e);
    } else if (window.vm && typeof window.vm.REDataSetLoadProgressCallBack !== 'undefined') {
        window.vm.REDataSetLoadProgressCallBack(e);
    } else {
        var progBoxCntr = document.querySelector('.custom-loading-container');
        var progBox = document.querySelector('.progress-bar-inner');
        var progTxt = document.querySelector('.custom-text');
        var progInfo = document.querySelector('.process-info-box');
        if (progBox && progBoxCntr) {
            var percent = e.detail.progress;
            var processInfo = e.detail.info;
            if (percent < 100) {
                progBox.style.width = `${percent}%`;
                progBoxCntr.style.display = 'flex';
                progTxt.innerHTML = `${percent}%`;
                progInfo.innerHTML = processInfo;
            } else {
                progBoxCntr.style.display = 'none';
            }
        }
    }
}
// 场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function REDataSetLoadFinish(e) {
    console.log('REDataSetLoadFinish: ', e.detail);
    if (typeof REDataSetLoadFinishCallBack !== 'undefined') {
        REDataSetLoadFinishCallBack(e);
    } else if (window.vm && typeof window.vm.REDataSetLoadFinishCallBack !== 'undefined') {
        window.vm.REDataSetLoadFinishCallBack(e);
    } else {
        if (e.detail.succeed) {
            //模型加载完成,这里最适合执行模型加载完后需要执行的事件
            document.getElementById('canvas').style.display = 'block';
            BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
        } else {
            //模型加载失败！！！
            let dataSetIdList = BlackHole3D.Model.getAllDataSetId(); // 获取所有加载的模型数据集标识
            dataSetIdList.forEach((dataSetId) => {
                if (BlackHole3D.Model.getDataSetReady(dataSetId)) {
                    // 获取加载失败的数据集标识
                    console.log('模型加载失败：', dataSetId);
                }
            });
        }
    }
}
//全景场景加载完成，需要设置图形窗口显示全景图
function REDataSetLoadPanFinish(isSuccess) {
    if (isSuccess) {
        if (typeof REDataSetLoadPanFinishCallBack !== 'undefined') {
            REDataSetLoadPanFinishCallBack();
        } else if (window.vm && typeof window.vm.REDataSetLoadPanFinishCallBack !== 'undefined') {
            window.vm.REDataSetLoadPanFinishCallBack(e);
        }
    } else {
        console.log('360全景加载失败！！！！！！！！！！！！！！！！！！！！！！！');
    }
}

//全景场景图片设置成功
function REPanLoadSingleFinish(isSuccess) {
    if (isSuccess) {
        if (typeof REPanLoadSingleFinishCallBack !== 'undefined') {
            REPanLoadSingleFinishCallBack();
        } else if (window.vm && typeof window.vm.REPanLoadSingleFinishCallBack !== 'undefined') {
            window.vm.REPanLoadSingleFinishCallBack(e);
        }
        console.log('图片设置成功!！！！！！！！！！！！！！！！！！！！！！！！');
    } else {
        console.log('图片设置失败！！！！！！！！！！！！！！！！！！！！！！！');
    }
}
// CAD加载完成
function RECADLoadFinish(isSuccess) {
    if (isSuccess) {
        if (typeof RECADLoadFinishCallBack !== 'undefined') {
            RECADLoadFinishCallBack();
        } else if (window.vm && typeof window.vm.RECADLoadFinishCallBack !== 'undefined') {
            window.vm.RECADLoadFinishCallBack(e);
        }
        document.getElementById('canvas').style.display = 'block';
        BlackHole3D.canvas.focus(); //涓轰簡瑙ｅ喅閿洏浜嬩欢鐨勫啿绐�
        console.log('CAD加载完成');
    } else {
        console.log('CAD加载失败');
    }
}
//概略图中的CAD数据加载 回调监听
function REMiniMapLoadCAD(e) {
    if (e.detail.succeed == 1) {
        if (typeof REMiniMapLoadCADCallBack !== 'undefined') {
            REMiniMapLoadCADCallBack();
        } else if (window.vm && typeof window.vm.REMiniMapLoadCADCallBack !== 'undefined') {
            window.vm.REMiniMapLoadCADCallBack(e);
        }
        console.log('------ 概略图中的CAD数据 加载成功 ------');
    }
}

//获取当前探测结果
function RESystemSel(e) {
    if (typeof RESystemSelCallBack !== 'undefined') {
        RESystemSelCallBack(e);
    } else if (window.vm && typeof window.vm.RESystemSelCallBack !== 'undefined') {
        window.vm.RESystemSelCallBack(e);
    }
    console.log('-- 引擎探测事件 --', BlackHole3D.Probe.getCurSelInfo(), e);
}

//获取当前探测结果
function RESystemSelElement(e) {
    if (typeof RESystemSelElementCallBack !== 'undefined') {
        RESystemSelElementCallBack(e);
    } else if (window.vm && typeof window.vm.RESystemSelElementCallBack !== 'undefined') {
        window.vm.RESystemSelElementCallBack(e);
    } else {
        console.log('-- 鼠标探测模型事件 --', BlackHole3D.Probe.getCurCombProbeRet());
    }
}

//鼠标探测矢量元素事件
function RESystemSelShpElement(e) {
    if (typeof RESystemSelShpElementCallBack !== 'undefined') {
        RESystemSelShpElementCallBack(e);
    } else if (window.vm && typeof window.vm.RESystemSelShpElementCallBack !== 'undefined') {
        window.vm.RESystemSelShpElementCallBack(e);
    } else {
        console.log('-- 鼠标探测矢量模型事件 --', BlackHole3D.Probe.getCurCombProbeRet());
    }
}

//获取当前探测结果
function RECADSelElement(e) {
    if (typeof RECADSelElementCallBack !== 'undefined') {
        RECADSelElementCallBack(e);
    } else if (window.vm && typeof window.vm.RECADSelElementCallBack !== 'undefined') {
        window.vm.RECADSelElementCallBack(e);
    } else {
        console.log('CAD探测监听', e);
    }
}

// 动态创建 loading 结构的函数
function createLoading() {
    // 创建最外层容器
    const container = document.createElement('div');
    container.className = 'custom-loading-container';
    container.style.display = 'none'; // 初始隐藏

    // 创建 loading 主盒子
    const loadingBox = document.createElement('div');
    loadingBox.className = 'loading-box';

    // 创建图标盒子（包含 loading.gif）
    const iconBox = document.createElement('div');
    iconBox.className = 'icon-box';
    const img = document.createElement('img');
    img.src = 'https://demo.bjblackhole.com/BlackHole3.0/imgs/loading.gif';
    iconBox.appendChild(img);

    // 创建进度条容器
    const progressBox = document.createElement('div');
    progressBox.className = 'common-global-progress-box';

    // 创建进度条结构
    const customProgress = document.createElement('div');
    customProgress.className = 'custom-progress-box';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    const progressOuter = document.createElement('div');
    progressOuter.className = 'progress-bar-outer';
    const progressInner = document.createElement('div');
    progressInner.className = 'progress-bar-inner';
    progressInner.style.width = '0%'; // 初始进度 0%

    // 嵌套进度条元素
    progressOuter.appendChild(progressInner);
    progressBar.appendChild(progressOuter);
    customProgress.appendChild(progressBar);

    // 创建进度文本
    const progressText = document.createElement('div');
    progressText.className = 'custom-text';
    progressText.textContent = '0%';

    // 嵌套进度条容器
    progressBox.appendChild(customProgress);
    progressBox.appendChild(progressText);

    // 创建过程信息盒子
    const infoBox = document.createElement('div');
    infoBox.className = 'process-info-box';

    // 组装整个 loading 结构
    loadingBox.appendChild(iconBox);
    loadingBox.appendChild(progressBox);
    loadingBox.appendChild(infoBox);
    container.appendChild(loadingBox);

    // 添加到 #app 元素
    const app = document.getElementById('app');
    if (app) {
        app.appendChild(container);
    }
}

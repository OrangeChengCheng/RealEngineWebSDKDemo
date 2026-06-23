var re_canvas_firstP_size = {
    width: 0,
    height: 0,
};

var re_canvas_thirdP_size = {
    width: 0,
    height: 0,
};

var BlackHole3D_firstP = typeof BlackHole3D_firstP !== 'undefined' ? BlackHole3D_firstP : {};
var BlackHole3D_thirdP = typeof BlackHole3D_thirdP !== 'undefined' ? BlackHole3D_thirdP : {};

var re_canvas_size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// 页面加载时添加相关监听事件
window.onload = function () {
    createLoading();
    // 若资源未准备好，则等待资源加载完成后再初始化
    if (!CreateBlackHoleWebSDK) {
        return;
    }
    // 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口, 初始化BlackHole3D
    var canvas_firstP = document.getElementById('canvas_firstP');
    var canvas_thirdP = document.getElementById('canvas_thirdP');
    BlackHole3D_firstP['canvas'] = (function () {
        return canvas_firstP;
    })();
    BlackHole3D_thirdP['canvas'] = (function () {
        return canvas_thirdP;
    })();
    BlackHole3D_firstP = CreateBlackHoleWebSDK(BlackHole3D_firstP);
    BlackHole3D_thirdP = CreateBlackHoleWebSDK(BlackHole3D_thirdP);

    if (BlackHole3D_firstP) {
        re_canvas_firstP_size.width = canvas_firstP.innerWidth;
        re_canvas_firstP_size.height = canvas_firstP.innerHeight;
    }
    if (BlackHole3D_thirdP) {
        re_canvas_thirdP_size.width = canvas_thirdP.innerWidth;
        re_canvas_thirdP_size.height = canvas_thirdP.innerHeight;
    }
    onResize(); // 初始化时调用一次，防止页面加载时出现比例问题
    // 开始监听模型加载
    addEngineListener(); //开启监听

    
};

// 卸载模型资源
function onBeforeUnload() {
    if (BlackHole3D_firstP) {
        if (BlackHole3D_firstP.Model.getAllDataSetId()?.length > 0) {
            BlackHole3D_firstP.Model.unloadAllDataSet();
        }
        // 释放模型资源
        BlackHole3D_firstP.releaseEngine();
        // 重置BlackHole3D
        BlackHole3D_firstP = undefined;
    }
    if (BlackHole3D_thirdP) {
        if (BlackHole3D_thirdP.Model.getAllDataSetId()?.length > 0) {
            BlackHole3D_thirdP.Model.unloadAllDataSet();
        }
        // 释放模型资源
        BlackHole3D_thirdP.releaseEngine();
        // 重置BlackHole3D
        BlackHole3D_thirdP = undefined;
    }
}

// 图形窗口改变时，需实时传递给引擎，否则模型会变形
function onResize() {
    if (BlackHole3D_firstP) {
        const canvas_firstP = document.getElementById('canvas_firstP');
        BlackHole3D_firstP.m_re_em_window_width = canvas_firstP.innerWidth;
        BlackHole3D_firstP.m_re_em_window_height = canvas_firstP.innerHeight;
    }
    if (BlackHole3D_thirdP) {
        const canvas_thirdP = document.getElementById('canvas_firstP');
        BlackHole3D_thirdP.m_re_em_window_width = canvas_thirdP.innerWidth;
        BlackHole3D_thirdP.m_re_em_window_height = canvas_thirdP.innerHeight;
    }
}
// 模型加载的监听
function addEngineListener() {
    document.addEventListener('RESystemReady', RESystemReady); //系统初始化监听
    document.addEventListener('RESystemEngineCreated', RESystemEngineCreated); //场景初始化监听
    document.addEventListener('REDataSetLoadProgress', REDataSetLoadProgress); //模型加载进度监听
    document.addEventListener('REDataSetLoadFinish', REDataSetLoadFinish); //模型加载完成状态
    window.addEventListener('beforeunload', onBeforeUnload); // 模型卸载监听
    window.addEventListener('resize', onResize); // 窗口大小变化实时调整canvas大小
}
// 移除加载的监听
function removeEngineListener() {
    document.removeEventListener('RESystemReady', RESystemReady); //系统初始化监听
    document.removeEventListener('RESystemEngineCreated', RESystemEngineCreated); //场景初始化监听
    document.removeEventListener('REDataSetLoadProgress', REDataSetLoadProgress); //模型加载进度监听
    document.removeEventListener('REDataSetLoadFinish', REDataSetLoadFinish); //模型加载完成状态
    window.removeEventListener('beforeunload', onBeforeUnload); // 模型卸载监听
    window.removeEventListener('resize', onResize); // 窗口大小变化实时调整canvas大小
}
//场景初始化，需正确传递相关参数,相关参数详见sdk文档注释
function RESystemReady(e) {
    console.log('RESystemReady: ', e.detail);
    if (e.detail.canvasid == 'canvas_firstP') {
        var sysInfo = new BlackHole3D_firstP.RESysInfo();
        sysInfo.workerjsPath = 'https://demo.bjblackhole.com/BlackHole3.0/sdk/RealBIMWeb_Worker.js';
        sysInfo.renderWidth = re_canvas_size.width;
        sysInfo.renderHieght = re_canvas_size.height;
        BlackHole3D_firstP.initEngineSys(sysInfo);
        BlackHole3D_firstP.Common.setUseWebCache(true); //是否允许使用浏览器缓存
    } else if (e.detail.canvasid == 'canvas_thirdP') {
        var sysInfo = new BlackHole3D_thirdP.RESysInfo();
        sysInfo.workerjsPath = 'https://demo.bjblackhole.com/BlackHole3.0/sdk/RealBIMWeb_Worker.js';
        sysInfo.renderWidth = re_canvas_size.width;
        sysInfo.renderHieght = re_canvas_size.height;
        BlackHole3D_thirdP.initEngineSys(sysInfo);
        BlackHole3D_thirdP.Common.setUseWebCache(true); //是否允许使用浏览器缓存
    }
}
//初始化完成后，加载项目
function RESystemEngineCreated(e) {
    console.log('RESystemEngineCreated: ', e.detail);
    if (e.detail.canvasid == 'canvas_firstP') {
        var isSuccess = e.detail.succeed;
        if (isSuccess) {
            //场景初始化成功，执行模型加载
            if (window.vm && typeof window.vm.RESystemEngineCreatedCallBack !== 'undefined') {
                window.vm.RESystemEngineCreatedCallBack(e);
                BlackHole3D_firstP.Common.setMaxResMemMB(5500);
                BlackHole3D_firstP.Common.setExpectMaxInstMemMB(4500);
                BlackHole3D_firstP.Common.setExpectMaxInstDrawFaceNum(20000000);
                BlackHole3D_firstP.Common.setPageLoadLev(2);
            }
        }
    } else if (e.detail.canvasid == 'canvas_thirdP') {
        var isSuccess = e.detail.succeed;
        if (isSuccess) {
            //场景初始化成功，执行模型加载
            if (window.vm && typeof window.vm.RESystemEngineCreatedCallBack !== 'undefined') {
                window.vm.RESystemEngineCreatedCallBack(e);
                BlackHole3D_thirdP.Common.setMaxResMemMB(5500);
                BlackHole3D_thirdP.Common.setExpectMaxInstMemMB(4500);
                BlackHole3D_thirdP.Common.setExpectMaxInstDrawFaceNum(20000000);
                BlackHole3D_thirdP.Common.setPageLoadLev(2);
            }
        }
    }
}
// 以下为加载进度条的示例代码，仅供参考
function REDataSetLoadProgress(e) {
    if (e.detail.canvasid == 'canvas_firstP') {
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
    } else if (e.detail.canvasid == 'canvas_thirdP') {
        // var progBoxCntr = document.querySelector('.custom-loading-container');
        // var progBox = document.querySelector('.progress-bar-inner');
        // var progTxt = document.querySelector('.custom-text');
        // var progInfo = document.querySelector('.process-info-box');
        // if (progBox && progBoxCntr) {
        //     var percent = e.detail.progress;
        //     var processInfo = e.detail.info;
        //     if (percent < 100) {
        //         progBox.style.width = `${percent}%`;
        //         progBoxCntr.style.display = 'flex';
        //         progTxt.innerHTML = `${percent}%`;
        //         progInfo.innerHTML = processInfo;
        //     } else {
        //         progBoxCntr.style.display = 'none';
        //     }
        // }
    }
}
// 场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function REDataSetLoadFinish(e) {
    console.log('REDataSetLoadFinish: ', e.detail);
    if (e.detail.canvasid == 'canvas_firstP') {
        if (window.vm && typeof window.vm.REDataSetLoadFinishCallBack !== 'undefined') {
            window.vm.REDataSetLoadFinishCallBack(e);
        }
    } else if (e.detail.canvasid == 'canvas_thirdP') {
        if (window.vm && typeof window.vm.REDataSetLoadFinishCallBack !== 'undefined') {
            window.vm.REDataSetLoadFinishCallBack(e);
        }
    }
}

// 动态创建 loading 结构的函数
function createLoading() {
    // 创建最外层容器
    const container = document.createElement('div');
    container.className = 'custom-loading-container';
    container.style.display = 'flex'; // 初始隐藏
    container.style.zIndex = '999';
    container.style.background = 'rgba(0, 0, 0, 1)';

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

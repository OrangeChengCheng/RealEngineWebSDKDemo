var localDataSetList = [
    {
        dataSetId: '3a1302ebf45d985e13bab65cce241ff2',
        resourcesAddress: 'https://demo.bjblackhole.com/default.aspx?dir=url_res03&path=3a1302ebf45d985e13bab65cce241ff2',
    },
];

var re_canvas_size = {
    width: window.innerWidth,
    height: window.innerHeight,
};
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
    let re_css_isHeader = document.getElementsByClassName('btnNew')?.[0]?.clientHeight === 54 || document.getElementById('btnNew'); //若有头部header栏，则减去54px
    // 目标宽高window.innerWidth，window.innerHeight，这里可结合实际场景设置canvas窗口大小
    if (BlackHole3D) {
        re_canvas_size.width = window.innerWidth;
        re_canvas_size.height = window.innerHeight - (re_css_isHeader ? 54 : 0);
    }
    onResize(); // 初始化时调用一次，防止页面加载时出现比例问题
    // 开始监听模型加载
    addEngineListener(); //开启监听
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
    // // 目标宽高window.innerWidth，window.innerHeight，这里可结合实际场景设置canvas窗口大小
    // if (BlackHole3D) {
    //     BlackHole3D.m_re_em_window_width = window.innerWidth;
    //     BlackHole3D.m_re_em_window_height = window.innerHeight - (isHeader ? 54 : 0);
    // }
    BlackHole3D.m_re_em_window_height = window.innerHeight - 54;
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
    document.addEventListener('RESystemSelElement', RESystemSelElement);
    document.addEventListener('RESystemSelShpElement', RESystemSelShpElement); //鼠标探测矢量元素事件
    document.addEventListener('RECADSelElement', RECADSelElement);
    window.addEventListener('beforeunload', onBeforeUnload); // 模型卸载监听
    window.addEventListener('resize', onResize); // 窗口大小变化实时调整canvas大小
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
        REDataSetLoadProgressCallBack();
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
    if (e.detail.succeed) {
        if (typeof REDataSetLoadFinishCallBack !== 'undefined') {
            REDataSetLoadFinishCallBack();
        }
        //模型加载完成,这里最适合执行模型加载完后需要执行的事件
        document.getElementById('canvas').style.display = 'block';
        BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
    } else {
        //模型加载失败！！！
    }
}
//全景场景加载完成，需要设置图形窗口显示全景图
function REDataSetLoadPanFinish(isSuccess) {
    if (isSuccess) {
        if (typeof REDataSetLoadPanFinishCallBack !== 'undefined') {
            REDataSetLoadPanFinishCallBack();
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
        }
        console.log('------ 概略图中的CAD数据 加载成功 ------');
    }
}

//获取当前探测结果
function RESystemSelElement(e) {
    if (typeof RESystemSelElementCallBack !== 'undefined') {
        RESystemSelElementCallBack(e);
    } else {
        console.log('-- 鼠标探测模型事件 --', BlackHole3D.Probe.getCurCombProbeRet());
    }
}

//鼠标探测矢量元素事件
function RESystemSelShpElement(e) {
    if (typeof RESystemSelShpElementCallBack !== 'undefined') {
        RESystemSelShpElementCallBack(e);
    } else {
        console.log('-- 鼠标探测矢量模型事件 --', BlackHole3D.Probe.getCurCombProbeRet());
    }
}

//获取当前探测结果
function RECADSelElement(e) {
    if (typeof RECADSelElementCallBack !== 'undefined') {
        RECADSelElementCallBack(e);
    } else {
        console.log('CAD探测监听');
    }
}

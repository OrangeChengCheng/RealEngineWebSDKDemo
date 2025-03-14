/*
 * @Author: Lemon C
 * @Date: 2024-06-28 11:19:39
 * @LastEditTime: 2025-03-13 18:27:02
 */
BlackHole3D = typeof BlackHole3D !== 'undefined' ? BlackHole3D : {};
BlackHole3D['canvas'] = (function () {
    var canvas = document.getElementById('canvas');
    return canvas;
})();
window.onresize = function (event) {
    let isHeader = document.getElementsByClassName('btnNew')?.[0]?.clientHeight === 54 || document.getElementById('btnNew'); //若有头部header栏，则减去54px
    // 目标宽高window.innerWidth，window.innerHeight，这里可结合实际场景设置canvas窗口大小
    if (BlackHole3D) {
        BlackHole3D.m_re_em_window_width = window.innerWidth;
        BlackHole3D.m_re_em_window_height = window.innerHeight - (isHeader ? 54 : 0);
    }
};
window.onbeforeunload = function (event) {
    if (typeof BlackHole3D.releaseEngine != 'undefined') {
        BlackHole3D.releaseEngine();
    }
};
window.onload = function (event) {
    if (typeof CreateBlackHoleWebSDK != 'undefined') {
        BlackHole3D = CreateBlackHoleWebSDK(BlackHole3D);
    } else {
        document.addEventListener('RealEngineToBeReady', function () {
            BlackHole3D = CreateBlackHoleWebSDK(BlackHole3D);
        });
    }
    document.addEventListener('RESystemReady', RESystemReady); //系统初始化完成回调
    document.addEventListener('RESystemEngineCreated', RESystemEngineCreated); //系统引擎创建完成回调
    document.addEventListener('REDataSetLoadFinish', REDataSetLoadFinish); //场景模型加载完成回调
    document.addEventListener('RESystemRenderReady', RESystemRenderReady); //数据集模型加载进度反馈
    document.addEventListener('REDataSetLoadProgress', REDataSetLoadProgress); //数据集模型加载进度反馈
    if (typeof addListener === 'function') {
        obj.addListener(); // 确认存在后调用
    }
    if (
        typeof BlackHole3D['m_re_em_window_width'] != 'undefined' &&
        typeof BlackHole3D['m_re_em_window_height'] != 'undefined' &&
        typeof BlackHole3D.RealBIMWeb != 'undefined'
    ) {
        console.log("(typeof m_re_em_window_width != 'undefined') && (typeof m_re_em_window_height != 'undefined')");
        RESystemReady();
    }
};
function RESystemReady() {
    var sysInfo = new BlackHole3D.RESysInfo();
    sysInfo.workerjsPath = 'https://demo.bjblackhole.com/BlackHole3.0/sdk/RealBIMWeb_Worker.js';
    sysInfo.renderWidth = BlackHole3D.canvas.clientWidth;
    sysInfo.renderHieght = BlackHole3D.canvas.clientHeight;
    // sysInfo.renderWidth = window.innerWidth;
    // sysInfo.renderHieght = window.innerHeight;
    sysInfo.commonUrl = 'https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001';
    sysInfo.userName = '';
    sysInfo.passWord = '';
    BlackHole3D.initEngineSys(sysInfo);
    BlackHole3D.Common.setUseWebCache(true);
}

function RESystemEngineCreated(e) {
    console.log('当前 WebSDK 运行版本', BlackHole3D.getVersion());
    console.log('=========================== 场景初始化完成');
    var isSuccess = e.detail.succeed;
    if (isSuccess) {
        console.log('===========================  场景初始化 --> 成功！！！');
        loadDataSet(); //加载模型
        // 设置全局渲染性能控制参数
        BlackHole3D.Common.setMaxResMemMB(5500);
        BlackHole3D.Common.setExpectMaxInstMemMB(4500);
        BlackHole3D.Common.setExpectMaxInstDrawFaceNum(20000000);
        BlackHole3D.Common.setPageLoadLev(2);
    } else {
        console.log('===========================  场景初始化 --> 失败！！！');
    }
}

function REDataSetLoadProgress(e) {
    var progBoxCntr = document.querySelector('.custom-loading-container');
    var progBox = document.querySelector('.progress-bar-inner');
    var progTxt = document.querySelector('.custom-text');
    var progInfo = document.querySelector('.process-info-box');
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

//为了浏览效果，初始canvas是display:none;
//监听到该事件，表示引擎天空盒资源加载完成，此时才显示canvas比较合适
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function RESystemRenderReady() {
    console.log('=========================== 引擎渲染器初始化完成 ');
    document.getElementById('canvas').style.display = 'block';
    BlackHole3D.canvas.focus(); //为了解决键盘事件的冲突
}

function REDataSetLoadFinish(e) {
    console.log('=========================== 引擎主场景模型加载完成 ');
    if (e.detail.succeed) {
        console.log('=========================== 引擎主场景模型加载 --> 成功！！！');
    } else {
        console.log('===========================  引擎主场景模型加载 --> 部分模型加载失败！！！');
        let dataSetIdList = BlackHole3D.Model.getAllDataSetId(); // 获取所有加载的模型数据集标识
        dataSetIdList.forEach((dataSetId) => {
            if (BlackHole3D.Model.getDataSetReady(dataSetId)) {
                // 获取加载失败的数据集标识
                console.log('模型加载失败：', dataSetId);
            }
        });
    }
    // if (e.detail.succeed) {
    //     document.getElementById('canvas').style.display = 'block';
    //     BlackHole3D.canvas.focus();
    // } else {
    //     console.log('===========================  引擎主场景模型加载 --> 部分模型加载失败！！！');
    //     let dataSetIdList = BlackHole3D.Model.getAllDataSetId(); // 获取所有加载的模型数据集标识
    //     dataSetIdList.forEach((dataSetId) => {
    //         if (BlackHole3D.Model.getDataSetReady(dataSetId)) {
    //             // 获取加载失败的数据集标识
    //             console.log('模型加载失败：', dataSetId);
    //         }
    //     });
    // }

    // console.log('\n');
    // console.log('\n');
    // console.log('\n');
    // let canvasDiv = document.getElementById('canvas');
    // let canvasWidth = canvasDiv.offsetWidth;
    // let canvasHeight = canvasDiv.offsetHeight;
    // console.log(' 【原始】 window.innerWidth: ' + window.innerWidth + '  window.innerHeight: ' + window.innerHeight);
    // console.log(' 【原始】 canvasWidth: ' + canvasWidth + '  canvasHeight: ' + canvasHeight);
    // canvasDiv.addEventListener('click', function (event) {
    //     // 获取鼠标点击的相对于元素本身的坐标
    //     var x = event.offsetX;
    //     var y = event.offsetY;
    //     // 更新显示坐标的元素文本
    //     console.log('x = ' + x + '  y = ' + y);
    // });
}

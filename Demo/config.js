/*
 * @Author: Lemon C
 * @Date: 2024-06-28 11:19:39
 * @LastEditTime: 2024-12-02 15:46:28
 */
BlackHole3D = typeof BlackHole3D !== 'undefined' ? BlackHole3D : {};
BlackHole3D['canvas'] = (function () {
    var canvas = document.getElementById('canvas');
    return canvas;
})();
window.onresize = function (event) {
    // BlackHole3D['m_re_em_window_width'] = BlackHole3D.canvas.clientWidth;
    // BlackHole3D['m_re_em_window_height'] = BlackHole3D.canvas.clientHeight;
    BlackHole3D['m_re_em_window_width'] = window.innerWidth;
    BlackHole3D['m_re_em_window_height'] = window.innerHeight;
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
    document.addEventListener('RESystemReady', RESystemReady); //绯荤粺鍒濆鍖栫洃鍚�
    document.addEventListener('RESystemEngineCreated', RESystemEngineCreated); //鍦烘櫙鍒濆鍖栫洃鍚�
    document.addEventListener('REDataSetLoadProgress', REDataSetLoadProgress); //妯″瀷鍔犺浇杩涘害鐩戝惉
    document.addEventListener('REDataSetLoadFinish', REDataSetLoadFinish); //妯″瀷鍔犺浇瀹屾垚鐘舵€�
    addListener();
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
    // sysInfo.renderWidth = BlackHole3D.canvas.clientWidth;
    // sysInfo.renderHieght = BlackHole3D.canvas.clientHeight;
    sysInfo.renderWidth = window.innerWidth;
    sysInfo.renderHieght = window.innerHeight;
    sysInfo.commonUrl = 'https://demo.bjblackhole.com/default.aspx?dir=url_res02&path=res_gol001';
    sysInfo.userName = '';
    sysInfo.passWord = '';
    BlackHole3D.initEngineSys(sysInfo);
    BlackHole3D.Common.setUseWebCache(true); //鏄惁鍏佽浣跨敤娴忚鍣ㄧ紦瀛�
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
//妯″瀷鍔犺浇瀹屾垚鐘舵€�
function REDataSetLoadFinish(e) {
    if (e.detail.succeed) {
        //妯″瀷鍔犺浇瀹屾垚锛侊紒锛�
        document.getElementById('canvas').style.display = 'block';
        BlackHole3D.canvas.focus(); //涓轰簡瑙ｅ喅閿洏浜嬩欢鐨勫啿绐�
    } else {
        //妯″瀷鍔犺浇澶辫触锛侊紒锛�
    }


    console.log("\n");
    console.log("\n");
    console.log("\n");
    let canvasDiv = document.getElementById('canvas');
    let canvasWidth = canvasDiv.offsetWidth;
    let canvasHeight = canvasDiv.offsetHeight;
    console.log(' 【原始】 window.innerWidth: ' + window.innerWidth + '  window.innerHeight: ' + window.innerHeight);
    console.log(' 【原始】 canvasWidth: ' + canvasWidth + '  canvasHeight: ' + canvasHeight);
    canvasDiv.addEventListener('click', function (event) {
        // 获取鼠标点击的相对于元素本身的坐标
        var x = event.offsetX;
        var y = event.offsetY;
        // 更新显示坐标的元素文本
        console.log('x = ' + x + '  y = ' + y);
    });
}

function RESystemEngineCreated(e) {
    console.log('褰撳墠 WebSDK 杩愯鐗堟湰', BlackHole3D.getVersion());
    console.log('=========================== 鍦烘櫙鍒濆鍖栧畬鎴�');
    var isSuccess = e.detail.succeed;
    if (isSuccess) {
        console.log('===========================  鍦烘櫙鍒濆鍖� --> 鎴愬姛锛侊紒锛�');
        loadDataSet();
    } else {
        console.log('===========================  鍦烘櫙鍒濆鍖� --> 澶辫触锛侊紒锛�');
    }
}

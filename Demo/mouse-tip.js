/**
 * 终极优化版鼠标跟随Tip
 * 核心特性：
 * 1. 开启时直接传递目标div的id，无需提前绑定
 * 2. 关闭时自动解绑事件+清除状态，完全释放资源
 * 3. 无延迟跟随，进入div立即显示，离开立即隐藏
 *
 * 公开 API：
 * - openMouseTip(divId, text)：开启Tip（divId为目标div的id，text为初始文字）
 * - closeMouseTip()：关闭Tip（自动解绑事件）
 * - setMouseTipText(text)：动态更新Tip文字
 */
(function () {
    const state = {
        isOpen: false, // 是否开启
        tipText: '提示文字',
        offsetX: 10, // 鼠标右侧偏移
        offsetY: 10, // 鼠标下方偏移
        targetDiv: null, // 当前绑定的目标div
        tipElem: null, // Tip元素
        isInDiv: false, // 鼠标是否在目标div内
    };

    // -------------------------- 公开 API --------------------------
    /**
     * 开启鼠标跟随Tip
     * @param {string} divId - 目标div的id（必须存在）
     * @param {string} [text] - 初始显示的文字（可选）
     */
    window.REWebSDK_openMouseTip = function (divId, text) {
        // 若已开启，先关闭并清理
        if (state.isOpen) closeMouseTip();

        // 验证目标div
        const target = document.getElementById(divId);
        if (!target) {
            console.error(`[MouseTip] 未找到id为"${divId}"的div，请检查id`);
            return;
        }

        // 初始化状态
        state.isOpen = true;
        state.targetDiv = target;
        state.tipText = text || '提示文字';
        state.isInDiv = false;

        // 创建Tip元素（首次使用或已被清除时）
        if (!state.tipElem) createTipElem();
        state.tipElem.textContent = state.tipText;

        // 绑定目标div的事件（进入/移动/离开）
        state.targetDiv.addEventListener('mouseenter', handleMouseEnter);
        state.targetDiv.addEventListener('mousemove', handleMouseMove);
        state.targetDiv.addEventListener('mouseleave', handleMouseLeave);

        console.log(`[MouseTip] 已开启，绑定div：${divId}`);
    };

    /** 关闭Tip并自动解绑所有资源 */
    window.REWebSDK_closeMouseTip = function () {
        if (!state.isOpen) return;

        // 解绑事件
        if (state.targetDiv) {
            state.targetDiv.removeEventListener('mouseenter', handleMouseEnter);
            state.targetDiv.removeEventListener('mousemove', handleMouseMove);
            state.targetDiv.removeEventListener('mouseleave', handleMouseLeave);
        }

        // 隐藏并清理状态
        if (state.tipElem) {
            state.tipElem.style.display = 'none';
            state.tipElem.style.left = '-100px';
            state.tipElem.style.top = '-100px';
        }
        state.isOpen = false;
        state.targetDiv = null;
        state.isInDiv = false;

        console.log('[MouseTip] 已关闭，资源已释放');
    };

    /** 动态更新Tip显示的文字 */
    window.REWebSDK_setMouseTipText = function (text) {
        if (!state.isOpen) {
            console.warn('[MouseTip] 请先开启Tip（调用openMouseTip）');
            return;
        }
        state.tipText = text || '提示文字';
        if (state.tipElem) state.tipElem.textContent = state.tipText;
    };

    // -------------------------- 内部核心逻辑 --------------------------
    /** 创建Tip元素（仅在首次开启时执行） */
    function createTipElem() {
        const tip = document.createElement('div');
        Object.assign(tip.style, {
            position: 'fixed',
            left: '-100px',
            top: '-100px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: '#ffffff',
            fontSize: '12px',
            borderRadius: '3px',
            pointerEvents: 'none', // 不干扰鼠标操作
            zIndex: '99999', // 顶层显示
            transition: 'none', // 无过渡，零延迟
        });
        state.tipElem = tip;
        document.body.appendChild(tip);
    }

    /** 鼠标进入目标div时触发 */
    function handleMouseEnter(e) {
        if (!state.isOpen) return;
        state.isInDiv = true;
        // 立即显示并定位到当前鼠标位置
        state.tipElem.style.display = 'block';
        updateTipPosition(e.clientX, e.clientY);
    }

    /** 鼠标在目标div内移动时触发 */
    function handleMouseMove(e) {
        if (!state.isOpen || !state.isInDiv) return;
        // 实时更新位置（零延迟）
        updateTipPosition(e.clientX, e.clientY);
    }

    /** 鼠标离开目标div时触发 */
    function handleMouseLeave() {
        if (!state.isOpen) return;
        state.isInDiv = false;
        // 立即隐藏
        state.tipElem.style.display = 'none';
    }

    /** 无延迟更新Tip位置 */
    function updateTipPosition(clientX, clientY) {
        const x = clientX + state.offsetX;
        const y = clientY + state.offsetY;
        state.tipElem.style.left = `${x}px`;
        state.tipElem.style.top = `${y}px`;
    }
})();

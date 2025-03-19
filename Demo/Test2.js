/*
 * @Author: Lemon C
 * @Date: 2025-03-18 16:14:49
 * @LastEditTime: 2025-03-18 17:40:16
 */

this.particleId = null; //发射粒子标识
this.pos = null; //发射器位置，三维空间坐标
this.planNormal = null; //发射器所在平面法向量，作用于发射方向
this.speedRange = [0.0, 0.0]; //粒子速度范围，【最大值，最小值】，最大值最小值相同表示粒子速度为定值，不同表示范围随机
this.sizeRange = [0.0, 1.0]; //粒子半径范围，【最小值，最大值】，最大值最小值相同表示粒子大小为定值，不同表示范围随机
this.sizeChangeRange = [0.0, 1.0]; //粒子半径变化范围，【最小值，最大值】，最大值最小值相同表示粒子大小变化为定值，不同表示范围随机
this.num = 1; //粒子数量
this.lifeTime = 1.0; //粒子生命周期
this.gravity = 9.81; //重力系数
this.dampingFactor = 0; //阻尼系数
this.color = null; //粒子颜色（REColor 类型）
this.alphaRange = [0.0, 1.0]; //粒子透明度范围，【最大值，最小值】，最大值最小值相同表示粒子透明度为定值，不同表示范围随机
this.planDirectionAngleRange = [0.0, 0.0]; //限制发射朝向相对于发射器所在平面的角度范围，取值范围【0，360°】，【最大值，最小值】，最大值最小值相同表示限制粒子相对发射器所在平面的方向为定值，不同表示范围随机, planNormalIncludedAngle=0, 范围无效，粒子发射方向为延发射器平面法向量方向
this.planNormalIncludedAngle = 0.0; //限制发射朝向相对于发射器所在平面法向量方向的夹角度数，取值范围【0，90°】，夹角数值是相对发射器平面法向量方向，实际粒子发射方向范围为 planDirectionAngleRange 限制角度范围内的所有与法向量夹角度数的空间范围， 夹角度数为0，planDirectionAngleRange参数无效，粒子发射方向为延发射器平面法向量方向
this.texId = null; //对应纹理id（已经添加的纹理数组内的索引）
this.faceDirection = 0; //粒子面向方向，0：发射方向, 1: 相机方向， 默认为0
this.texUVRotAngle = 0; //贴图UV旋转角度
if (isEmptyLog(posTransmitSysInfoList, 'posTransmitSysInfoList')) return false;
let _arrTransmitSys = new Module.RE_Vector_TRANSMIT_PARTICLE_INFO();
for (let i = 0; i < posTransmitSysInfoList.length; i++) {
    const transmitSysInfo = posTransmitSysInfoList[i];
    if (isEmptyLog(transmitSysInfo.particleId, 'particleId')) return false;
    if (!checkArrCountLog(transmitSysInfo.pos, 'pos', 3)) return false;
    if (!checkArrCountLog(transmitSysInfo.planNormal, 'planNormal', 3)) return false;
    if (!checkArrCountLog(transmitSysInfo.sizeRange, 'sizeRange', 2)) return false;
    if (!checkArrCountLog(transmitSysInfo.sizeChangeRange, 'sizeChangeRange', 2)) return false;
    if (!checkArrCountLog(transmitSysInfo.alphaRange, 'alphaRange', 2)) return false;
    if (!checkArrCountLog(transmitSysInfo.planDirectionAngleRange, 'planDirectionAngleRange', 2)) return false;
    if (isEmptyLog(transmitSysInfo.texId, 'texId')) return false;

    let _m_strName = transmitSysInfo.particleId;
    let _m_uTexID = isEmpty(transmitSysInfo.texId) ? 0 : transmitSysInfo.texId;
    let _m_vPos = transmitSysInfo.pos;
    let _m_vWorNormal = transmitSysInfo.planNormal;
    let _m_uLevel = isEmpty(transmitSysInfo.num) ? 1 : transmitSysInfo.num;
    let _m_fLifetime = isEmpty(transmitSysInfo.lifeTime) ? 1.0 : transmitSysInfo.lifeTime;
    let _m_fGravity = isEmpty(transmitSysInfo.gravity) ? 9.81 : transmitSysInfo.gravity;
    let _m_fDF = isEmpty(transmitSysInfo.dampingFactor) ? 0.0 : transmitSysInfo.dampingFactor;
    let _m_uColor = isEmpty(transmitSysInfo.color) ? 0x00ffffff : clrToU32(transmitSysInfo.color);
    let _m_bFacePlane = isEmpty(transmitSysInfo.faceDirection) ? false : transmitSysInfo.faceDirection == 1 ? true : false;
    let _m_fRotAngle = isEmpty(transmitSysInfo.texUVRotAngle) ? 0.0 : transmitSysInfo.texUVRotAngle;
    // 速度
    let _speed_min = isEmpty(transmitSysInfo.speedRange[0]) ? 0 : transmitSysInfo.speedRange[0];
    let _speed_max = isEmpty(transmitSysInfo.speedRange[1]) ? 0 : transmitSysInfo.speedRange[1];
    let _speed_random = _speed_min == _speed_max ? false : true;
    let _speed_dis = _speed_max - _speed_min;
    let _m_vSpeedRange = [0, 0];
    if (_speed_random) {
        _m_vSpeedRange = [_speed_min, _speed_dis];
    } else {
        _m_vSpeedRange = [_speed_min, 0];
    }
    // 大小
    let _size_min = isEmpty(transmitSysInfo.sizeRange[0]) ? 0 : transmitSysInfo.sizeRange[0];
    let _size_max = isEmpty(transmitSysInfo.sizeRange[1]) ? 0 : transmitSysInfo.sizeRange[1];
    let _size_random = _size_min == _size_max ? false : true;
    let _size_dis = _size_max - _size_min;
    let _m_vSizeRange = [0.0, 0.0];
    if (_size_random) {
        _m_vSizeRange = [_size_min, _size_dis];
    } else {
        _m_vSizeRange = [_size_min, 0];
    }
    // 大小变化
    let _size_change_min = isEmpty(transmitSysInfo.sizeChangeRange[0]) ? 0 : transmitSysInfo.sizeChangeRange[0];
    let _size_change_max = isEmpty(transmitSysInfo.sizeChangeRange[1]) ? 0 : transmitSysInfo.sizeChangeRange[1];
    let _size_change_random = _size_change_min == _size_change_max ? false : true;
    let _size_change_dis = _size_change_max - _size_change_min;
    let _m_vSizeChangeRange = [0.0, 0.0];
    if (_size_change_random) {
        _m_vSizeChangeRange = [_size_change_min, _size_change_dis];
    } else {
        _m_vSizeChangeRange = [_size_change_min, 0];
    }
    // 透明度
    let _alpha_min = isEmpty(transmitSysInfo.alphaRange[0]) ? 0 : transmitSysInfo.alphaRange[0];
    let _alpha_max = isEmpty(transmitSysInfo.alphaRange[1]) ? 0 : transmitSysInfo.alphaRange[1];
    let _alpha_random = _alpha_min == _alpha_max ? false : true;
    let _alpha_dis = _alpha_max - _alpha_min;
    let _m_vAlphaRange = [0.0, 0.0];
    if (_alpha_random) {
        _m_vAlphaRange = [_alpha_min, _alpha_dis];
    } else {
        _m_vAlphaRange = [_alpha_min, 0];
    }
    // 发射方向范围
    let _plan_dir_angle_min = isEmpty(transmitSysInfo.planDirectionAngleRange[0]) ? 0 : transmitSysInfo.planDirectionAngleRange[0];
    let _plan_dir_angle_max = isEmpty(transmitSysInfo.planDirectionAngleRange[1]) ? 0 : transmitSysInfo.planDirectionAngleRange[1];
    let _plan_dir_angle_random = _plan_dir_angle_min == _plan_dir_angle_max ? false : true;
    let _plan_dir_angle_dis = _plan_dir_angle_max - _plan_dir_angle_min;
    let _plan_nor_inc_angle = isEmpty(transmitSysInfo.planNormalIncludedAngle) ? 0.0 : transmitSysInfo.planNormalIncludedAngle;
    let _m_vAngle = [0.0, 0.0, 0.0, 0.0];
    if (_plan_dir_angle_random) {
        _m_vAngle = [_plan_dir_angle_min * (Math.PI / 180), _plan_dir_angle_dis * (Math.PI / 180), _plan_nor_inc_angle * (Math.PI / 180), 0.0];
    } else {
        _m_vAlphaRange = [_plan_dir_angle_min * (Math.PI / 180), 0, _plan_nor_inc_angle * (Math.PI / 180), 0.0];
    }

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

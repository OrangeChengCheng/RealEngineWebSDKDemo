
var creatModel = function() {
  var model = {};
  model.test = function() {
      console.log('test()->',arguments.callee.name);
      console.log('test()->',arguments.callee.caller.name);
      console.log('test()->',model.test.caller.name);
      logName();
      console.log(SizeStyleEnum[5])
      console.log(TypeS.TypeS_a)
  }
  const SizeStyleEnum = [
      "RE_UI_SIZE_OF_Alpha",						//float 作用于整个动态UI系统的全局透明度
      "RE_UI_SIZE_OF_DisabledAlpha",				//float 指定内部开始禁用时的透明度，跟Alpha的值相乘
      "RE_UI_SIZE_OF_WindowPadding",				//Vec2  指定窗口对象内边距（像素，x,y两个方向分别指定）
      "RE_UI_SIZE_OF_WindowRounding",			    //float 指定窗口对象的圆角尺寸，0表示创建矩形窗口，过大的值会导致各种外观异常，所以不建议取值过大
      "RE_UI_SIZE_OF_WindowBorderSize",			//float 指定窗口边框尺寸，一般取值为0或1，其它值可能会导致未定义问题并对性能造成影响
      "RE_UI_SIZE_OF_WindowMinSize",           	//Vec2  指定窗口最小尺寸，这是一个全局设置
      "RE_UI_SIZE_OF_WindowTitleAlign",        	//Vec2	窗口标题的对齐比例，缺省值为（0.0,0.5）左对齐,垂直居中
  ]
  const TypeS = {
      TypeS_a: 1,
      TypeS_b: 2,
      TypeS_c: 3,
  }
  function logName() {
      console.log('logName()->',arguments.callee.name);
      console.log('logName()->',arguments.callee.caller.name);
  }
  return model;
}

ModelT = creatModel();

function fnTest() {
  ModelT.test();
}

// fnTest();




function REclrFix(clr, clrPercent) {
  var newclr01 = clr.substring(0, 2);
  var newclr02 = clr.substring(2, 4);
  var newclr03 = clr.substring(4, 6);
  var newclr = newclr03 + newclr02 + newclr01;
  var intclrper = Math.round(clrPercent);
  var newclrper = (intclrper > 15 ? (intclrper.toString(16)) : ("0" + intclrper.toString(16)));
  var clrinfo = "0x" + newclrper + newclr;
  var clr = parseInt(clrinfo);
  return clr;
}


function REalphaFix(alpha, alphaPercent) {  
  var intalphainfo = Math.round(alpha);
  var intalphaper = Math.round(alphaPercent);
  var newalphainfo = (intalphainfo > 15 ? (intalphainfo.toString(16)) : ("0" + intalphainfo.toString(16)));
  var newalphaper = (intalphaper > 15 ? (intalphaper.toString(16)) : ("0" + intalphaper.toString(16)));
  var alphainfo = "0x" + newalphaper + newalphainfo + "ffff";
  var alpha = parseInt(alphainfo);
  return alpha;
}

function REsetBackColor(clr) {
  var _clrT = clr;
  if (clr.includes('0x')) {
    _clrT = _clrT.replace('0x','');
    console.log(_clrT);
    
  }
  var tempclr01 = clr.substring(0, 2); var clr01 = (parseInt(tempclr01, 16) / 255);
  var tempclr02 = clr.substring(2, 4); var clr02 = (parseInt(tempclr02, 16) / 255);
  var tempclr03 = clr.substring(4, 6); var clr03 = (parseInt(tempclr03, 16) / 255);

  var clrarr = [Math.floor(clr01 * 100) / 100, Math.floor(clr02 * 100) / 100, Math.floor(clr03 * 100) / 100];
  return clrarr;
}


// console.log(REclrFix('FF00FF80', 255));
// console.log(REalphaFix(255, 255));
// console.log(REsetBackColor('0x4523FF'));
// console.log(REsetBackColor('FF4523'));
// console.log(REsetBackColor('FFFF45'));
// console.log(parseInt(0xFF4523FF));
// console.log(parseInt(0xFFFF4523));
// console.log(parseInt('ff',16));
// console.log((4281488639).toString(16));
// console.log(Math.round(255));



function test() {
  var tt = [1,2,3,4];
  var _vNum = [];
  for (let i = 0; i < 4; i++) {
    if (i < tt.length) {
      _vNum.push(tt[i]);
      continue;
    }
    _vNum.push(0);
  }
  console.log(_vNum);
  
}
// test()


function colorChange(color) {
  let arr = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');
  let a = parseFloat(arr[3] || 1),
      r = Math.floor(a * parseInt(arr[0]) + (1 - a) * 255),
      g = Math.floor(a * parseInt(arr[1]) + (1 - a) * 255),
      b = Math.floor(a * parseInt(arr[2]) + (1 - a) * 255);
  return "0x" +
    ("0" + r.toString(16)).slice(-2) +
    ("0" + g.toString(16)).slice(-2) +
    ("0" + b.toString(16)).slice(-2);
}
function colorConversion () {
  let myHex = colorChange('rgba(11, 161, 148, 0.3)')
  console.log(myHex);
}


// colorConversion();







function parseIntTest() {
  var clr = '80'
  var intClr = parseInt(clr);
  var intClr255 = parseInt(clr, 16)
  var intClrDouble = (parseInt(clr, 16) / 255)
  console.log(clr);
  console.log(intClr);
  console.log(intClr255);
  console.log(intClrDouble);
  console.log((intClr).toString(16));
}

parseIntTest();


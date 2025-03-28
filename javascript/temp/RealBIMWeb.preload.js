
var re_em_script_dir ="";
if(typeof document != "undefined" && document.currentScript){
	re_em_script_dir = document.currentScript.src;
}
if (re_em_script_dir.indexOf("blob:") !== 0) {
	re_em_script_dir = re_em_script_dir.substr(0, re_em_script_dir.replace(/[?#].*/, "").lastIndexOf("/") + 1);
} else {
	re_em_script_dir = "";
}

var re_em_xhr_wasm = new XMLHttpRequest;
re_em_xhr_wasm.open("GET", re_em_script_dir+"RealBIMWeb.wasm", true);
re_em_xhr_wasm.send(null);

var re_em_xhr_bin_0 = new XMLHttpRequest;
re_em_xhr_bin_0.open("GET", re_em_script_dir+"assets.bin", true);
re_em_xhr_bin_0.send(null);

var re_em_xhr_bin_1 = new XMLHttpRequest;
re_em_xhr_bin_1.open("GET", re_em_script_dir+"assets1.bin", true);
re_em_xhr_bin_1.send(null);

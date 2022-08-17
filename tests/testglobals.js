'use strict';

var dom;

let sDetail = {}

// css
let s0 = " <span class='",
	sb = s0+"bad'>",
	sg = s0+"good'>",
	sf = s0+"faint'>",
	sn = s0+"neutral'>",
	snc = s0+"no_color'>",
	s1 = s0+"s1'>",
	s2 = s0+"s2'>",
	s3 = s0+"s3'>",
	s4 = s0+"s4'>",
	s5 = s0+"s5'>",
	s6 = s0+"s6'>",
	s7 = s0+"s7'>",
	s8 = s0+"s8'>",
	s9 = s0+"s9'>",
	s10 = s0+"s10'>",
	s11 = s0+"s11'>",
	s12 = s0+"s12'>",
	s13 = s0+"s13'>",
	s14 = s0+"s14'>",
	s15 = s0+"s15'>",
	s16 = s0+"s16'>",
	s17 = s0+"s17'>",
	s18 = s0+"s18'>",
	s99 = s0+"s99'>",
	sc = "</span>",
	green_tick = "<span style='font-size: 10px;'><b>" + s9.trim() +" \u2713"+ sc + "</b></span>",
	red_cross = "<span style='font-size: 10px;'><b>" + sb.trim() +" \u2715"+ sc + "</b></span>",
	yellow_block = "<span style='font-size: 10px;'><b>" + s4.trim() +" \u2715"+ sc + "</b></span>",
	white_na =  "<span style='font-size: 10px;'><b>" + snc.trim() +" \u2715"+ sc + "</b></span>",
// show/hide text colors
	zhide = "#161b22",
	zshow = "#b3b3b3",
// common results
	zB0 = "blocked",
	zD = "disabled",
	zE = "enabled",
	zErr = "error",
	zNS = "not supported",
	zNA = "n/a",
	zS = "success",
	zF = "failed",
	zU = "undefined",
	zUQ = "\"undefined\"",
	zNEW = sb+"[NEW]"+sc,
// notes
	rfp_green = sg+"[RFP]"+sc,
	rfp_red = sb+"[RFP]"+sc,
	enUS_green = sg+"[en-US]</span> ",
	enUS_red = sb+"[en-US]</span> ",
	note_ttc = sf+"test to come"+sc,
	note_file = "",
// error notes
	se = sb+"[test error: ",
	error_file_404 = se+"file not found]"+sc,
	error_file_cors = sn+"[file:] [Cross-Origin Request Blocked]"+sc,
	error_file_xhr = se+"xhr]"+sc,
	error_iframe = se+"iframe]"+sc,
	error_image = se+"image]"+sc,
	error_global_os = se+"global variable not set]"+sc,
// other
	canPerf = false,
	is95 = false,
	isBrave = false,
	isEngine = "",
	isEnginePretty = "", // results string with perf
	isFF = false,
	isFFpretty = "", // results string with perf
	isFFvalid = false, // no errors
	isFile = false,
	isOS = "",
	isRFP = false,
	isSecure = false,
	isTB = false,
	isVer = ""

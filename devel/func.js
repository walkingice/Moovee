function renderCal()
{
	var calMov = $(".calMov");
	for(i = 0, j = calMov.length; i < j; i++) $(calMov[i]).appendTo('#d_' + calMov[i].id.split('_')[1]).show();
	window.print();
	if(isIProduct() == false) window.location.replace(window.location.href.replace("cal.php", ""));
}

function render()
{
	$("#tabs > .description > a").bind("click", function() {
		void(window.open($(this).attr("href")));
		return false;
	});

	$("#dropBox").droppable({
		hoverClass: 'dropBoxHover',
		drop: function(event, ui) {addMov(ui.draggable.attr("id"));}
	});

	addMov("none-none");

	if(isIProduct() != false)
	{
		iProductForceApp();

		$("body").append("<script src=\"../iscroll-min.js\" type=\"text/javascript\" />");
		if(isIProduct() == "iPad") $("body").append("<script src=\"../dbltap-min.js\" type=\"text/javascript\" />");
		$("body").append("<span id=\"iLayerTop\" class=\"hidden\"></span>");
		document.addEventListener('touchmove', function(e) { e.preventDefault(); });
	}

	resizeDiv();
	$(window).bind("resize", function() {resizeDiv();});

	if(jQuery.browser.msie == true) $("div.fb_like:first").empty().html("<iframe src=\"http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fcornguo.atcity.org%2Ftest%2Fmoovee%2F&amp;layout=button_count&amp;show_faces=true&amp;width=100&amp;action=like&amp;colorscheme=light&amp;height=21\" style=\"border:none; overflow:hidden; width:100px; height:21px;\" frameborder=\"0\" scrolling=\"no\" allowTransparency=\"true\" />");
}

function resizeDiv()
{
	if(isIProduct() != false && isIProduct() != "iPad")
	{
		iProductInit();
		return false;
	}

	var docSize = getDocSize();

	refineDiv("groupBox", docSize['width']*0.55, docSize['height']*0.4-30);
	refineDiv("titleBox", docSize['width']*0.43, docSize['height']*0.4-30);
	refineDiv("lPanel", docSize['width']*0.43, docSize['height']*0.6-80);
	refineDiv("dropBox", docSize['width']*0.53, docSize['height']*0.6-80);

	if(jQuery.browser.msie == true) $("#dragBox").css({"height": parseInt($("#lPanel").css("height")) - 67 + "px"});
	else $("#dragBox").css({"height": parseInt($("#lPanel").css("height")) - 56 + "px"});
}

function iProductInit()
{
	document.title = "Moovee";
	var docSize = getDocSize();

	$("body").css("padding-top", "15px");

	if($("#tabs").width() != 1280)
	{
		$("#tabs").width(1280).height(40);
		tabsScroll = new iScroll("tabs");
		if(isIProduct() != false && isIProduct() != "iPad")
			$("#tabs").prepend("<span id=\"iBack\" onclick=\"iBack();\" class=\"tab\">&lt; BACK</span>&nbsp;<span id=\"iList\" onclick=\"iList();\" class=\"tab\">LIST</span>");
	}

	refineDiv("groupBox", docSize['width']-10, docSize['height']-115);
	refineDiv("titleBox", docSize['width']-10, docSize['height']-115);
	refineDiv("dropBox", docSize['width']-20, docSize['height']-125);
	refineDiv("lPanel", docSize['width']-20, docSize['height']-125);

	$("#groupBox").css({
		"position": "absolute",
		"top": "55px",
		"z-index": "4"
	});
	$("#titleBox").css({
		"position": "absolute",
		"top": "55px",
		"z-index": "3"
	});
	$("#dropBox").css({
		"position": "absolute",
		"top": "55px",
		"z-index": "2"
	});
	$("#dropBox > #seledMovList").css({
		"background-color": "#EEF"
	});
	$("#lPanel").css({
		"position": "absolute",
		"top": "55px",
		"z-index": "1"
	});
	if(isIProduct() == "iPad") $("#remarkDesc").css("margin-top", "110px");
	else $("#remarkDesc").addClass("hidden");
}

function refineDiv(divId, width, height)
{
	//document.getElementById(divId).style['MozBorderRadius'] = "10px";
	//document.getElementById(divId).style['WebkitBorderRadius'] = "10px";

	if(width) $("#" + divId).width(parseInt(width));
	if(height) $("#" + divId).height(parseInt(height));
}

function getDocSize()
{
	var myWidth = 0, myHeight = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}

	if($(window).width() != myWidth) myWidth = $(window).width() - 10;
	if($(window).height() != myHeight) myHeight = $(window).height();

	return {"width": myWidth, "height": myHeight};
}

var groupCache = new Array();

function getGroup(obj)
{
	if(isIProduct() != false && isIProduct() != "iPad")
	{
		iProductInit();
		$("#groupBox").css("z-index", "5");
		$("#iLayerTop").text("#groupBox");
	}

	if($(obj).hasClass("itemSeled")) return;
	$(".tab").removeClass("itemSeled");
	$(obj).addClass("itemSeled");
	if($("#groupBox > #groupList").is(":visible")) $("#groupBox > #groupList").hide("drop", {}, "fast");
	if($("#titleBox").children(":first").is(":visible")) $("#titleBox").children().hide("drop", {}, "fast", function(){$("#titleBox").empty();});
	if($("#dragBox").children(":first").is(":visible")) $("#dragBox").children().hide("drop", {}, "fast", function(){$("#dragBox").empty();});

	var field = obj.id.split("-")[1];

	if(groupCache[field] != undefined) refreshGroupBox(field, groupCache[field]);
	else
	{
		$("#groupBox").addClass("greyBox");
		$.ajax({
			"type": "POST",
			"url": "getData.php",
			"dataType": "jsonp",
			"data": {
				"getGroup": field
			},
			"jsonp": "refreshGroupBox"
		});
	}
}

function refreshGroupBox(field, data)
{
	$("#groupBox").html("<ul id=\"groupList\"></ul>");
	$("#filter").html(field + ":");

	for(i = 0, j = data.length; i < j; i++)
		$("#groupBox > #groupList").append("<li id=\"" + field + "-" + i + "\" onclick=\"getMovieTitles(this);\">" + data[i] + "</li>");

	$("#groupBox").removeClass("greyBox");

	if($.browser.msie == true || isIProduct() != false) $("#groupBox > #groupList").show();
	else $("#groupBox > #groupList").show("drop", {}, "fast");

	if(groupCache[field] == undefined) groupCache[field] = data;

	if(isIProduct() != false)
	{
		if(isIProduct() != "iPad") $("#groupList > li").css("padding", "5px 0");
		groupListScroll = new iScroll("groupList");
	}
}

var movieTitlesCache = new Array();

function getMovieTitles(obj)
{
	if(isIProduct() != false && isIProduct() != "iPad")
	{
		if($("#titleBox").css("z-index") != "5")
		{
			iProductInit();
			$("#titleBox").css("z-index", "5");
			$("#iLayerTop").text("#titleBox")
		}
	}

	if($(obj).hasClass("itemSeled")) return;
	$("#groupBox li").removeClass("itemSeled");
	$(obj).addClass("itemSeled");
	$("#filter").html($("#filter").text().split(":")[0] + ":" + $(obj).text());
	if($("#titleBox").children(":first").is(":visible")) $("#titleBox").children().hide("drop", {}, "fast");
	if($("#dragBox").children(":first").is(":visible")) $("#dragBox").children().hide("drop", {}, "fast", function(){$("#dragBox").empty();});

	if(movieTitlesCache[obj.id] != undefined) refreshTitleBox(obj.id, movieTitlesCache[obj.id]);
	else
	{
		$("#titleBox").addClass("greyBox");
		$.ajax({
			"type": "POST",
			"url": "getData.php",
			"dataType": "jsonp",
			"data": {
				"getMovList": obj.id
			},
			"jsonp": "refreshTitleBox"
		});
	}
}

function refreshTitleBox(objid, data)
{
	$("#titleBox").html("<div class=\"description\">(括號後數字為節目手冊頁數)</div><ul id=\"titleList\"></ul>");

	for(i = 0, j = data.length; i < j; i++)
	    $("#titleBox > #titleList").append("<li id=\"mov-" + data[i]['KEY'] + "\">"
			+ "<span class=\"movTitle plainText\">" + data[i]['CTITLE'] + "</span>"
			+ "<span class=\"movETitle hidden\">" + data[i]['ETITLE'] + "</span>"
			+ "<span class=\"movPageNo\">(" + data[i]['PAGE'] + ")</span></li>");
/*
	$("#titleBox > #titleList > li").bind("mouseover", function() {
		$(this).children("span.movTitle").toggleClass("hidden");
		$(this).children("span.movETitle").toggleClass("hidden");
	});

	$("#titleBox > #titleList > li").bind("mouseout", function() {
		$(this).children("span.movTitle").toggleClass("hidden");
		$(this).children("span.movETitle").toggleClass("hidden");
	});
*/

	$("#titleBox > #titleList > li").bind("dblclick", function() {
		imdbWindow(this);
		return false;
	});

	if(isIProduct() == "iPad")
	{
		$("#titleBox > #titleList > li").doubletap(function() {
			imdbWindow($("#titleBox > #titleList > li:hover").get());
			return false;
		}, function() {
			return false;
		}, 400);
	}

	$("#titleBox > #titleList > li").bind("click", function() {
		getMovieTime(this);
		return false;
	});

	$("#titleBox").removeClass("greyBox");
	if($.browser.msie == true || isIProduct() != false) $("#titleBox").children().show();
	else $("#titleBox").children().show("drop", {}, "fast");

	if(movieTitlesCache[objid] == undefined) movieTitlesCache[objid] = data;

	if(isIProduct() != false)
	{
		$("#titleBox > #titleList").height($("#titleBox > #titleList").height() + data.length * 10 + 20);
		if(isIProduct() != "iPad") $("#titleList > li").css("padding", "5px 0");
		titleListScroll = new iScroll("titleList");
	}
}

var movieTimeCache = new Array();

function getMovieTime(obj)
{
	if(isIProduct() != false && isIProduct() != "iPad")
	{
		if($("#lPanel").css("z-index") != "5")
		{
			iProductInit();
			$("#lPanel").css("z-index", "5");
			$("#iLayerTop").text("#lPanel");
		}
	}
	if($(obj).hasClass("itemSeled")) return;
	$("#titleBox li").removeClass("itemSeled");
	$(obj).addClass("itemSeled");
	if($("#dragBox").children(":first").is(":visible")) $("#dragBox").children().hide("drop", {}, "fast");

	var movTitle = $(obj).children(".movTitle").text();

	if(movieTimeCache[movTitle] != undefined) refreshDragBox(movieTimeCache[movTitle]);
	else
	{
		$("#lPanel").addClass("greyBox");
		$.ajax({
			"type": "POST",
			"url": "getData.php",
			"dataType": "jsonp",
			"data": {
				"movTitle": movTitle
			},
			"jsonp": "refreshDragBox"
		});
	}
}

function refreshDragBox(data)
{
	var desc = "(點選或拖曳至右方區塊)";
	var showETitle = true;

	if(isIProduct() != false)
	{
		desc = "(點選加入我的片單)";
		if(isIProduct() != "iPad") showETitle = false;
	}

	$("#dragBox").html("<div id=\"infoBox\"><img id=\"imdbBtn\" src=\"../icon/IMDb.png\" alt=\"Lookup this movie in IMDb\" onclick=\"imdbWindow($(this).parent());\" /></div>");
	$("#dragBox > #infoBox").append("<h1 class=\"movTitle\">" + data[0]['CTITLE'] + "</h1>");

	if(data[0]['GRADE']) $("#infoBox > h1").append(" (" + data[0]['GRADE'] + ")");

	if(showETitle) $("#infoBox").append("<h2 class=\"movETitle\">" + data[0]['ETITLE'] + "</h2>");
	else $("#infoBox").append("<h2 class=\"movETitle hidden\">" + data[0]['ETITLE'] + "</h2>");

	$("#infoBox").append("<div class=\"description\">" + desc + "</div>");
	$("#dragBox").append("<ul id=\"movList\"></ul>");

	var filterVar = $("#filter").text();
	var slicePos = filterVar.indexOf(":");
	filterVar = [filterVar.slice(0, slicePos), filterVar.slice(slicePos+1)];

	for(i = 0, j = data.length; i < j; i++)
	{
		var endTime = getEndTime(data[i]['START'], data[i]['END']);
		appendObj = $("<li id=\"mov-" + data[i]['KEY'] + "\" class=\"movObj\">"
			+ "<span class=\"movTime\">" + data[i]['START'] + " -- " + endTime + "</span>"
			+ "<span class=\"movPlace\">" + data[i]['PLACE'] + "</span>"
			+ "<span class=\"movRemark\">" + data[i]['REMARK'] + "</span></li>");
		appendObj.children().addClass("plainText");
		if(data[i][filterVar[0]] != filterVar[1]) appendObj.children().addClass("notMatch");
		$("#dragBox > #movList").append(appendObj);
	}

	$("#dragBox > #movList > .movObj").draggable({opacity: 0.7, revert: 'invalid', helper: 'clone'});
	$("#dragBox > #movList > .movObj").bind("click", function() {
		addMov($(this).attr("id"));
		return false;
	});
	$("#lPanel").removeClass("greyBox");
	if($.browser.msie == true) $("#dragBox").children().show();
	else $("#dragBox").children().show('drop', {}, 'fast');

	if(movieTimeCache[data[0]['CTITLE']] == undefined) movieTimeCache[data[0]['CTITLE']] = data;

	if(isIProduct() != false && isIProduct() != "iPad")
	{
		$("#movList > li").css("padding", "5px 0");
	}
}

function addMov(movId)
{
	var movIdAdd = movId.split('-')[1];
	var varStor = $("#varStor").text();

	$.ajax({
		"type": "POST",
		"url": "getData.php",
		"dataType": "jsonp",
		"data": {
			"varStor": varStor,
			"movIdAdd": movIdAdd
		},
		"jsonp": "refreshDropBox"
	});
}

function refreshDropBox(data)
{
	if(data.toString().charAt(0) == 'e') msgBox("error", data);
	else
	{
		$("#dropBox").html("<h1></h1><div class=\"description\">(點選可移除項目)</div><ol id=\"seledMovList\"></ol>");
		$("#varStor").empty();

		var error = false;
		for(i = 0, j = data.length; i < j; i++)
		{
			if(data[i] != null)
			{
				var endTime = getEndTime(data[i]['START'], data[i]['END']);
				var appendObj = $("<li id=\"smov-" + data[i]['KEY'] + "\" class=\"seledMovObj\" onclick=\"removeMov(this.id);\">"
						+ "<span class=\"movTime\">" + data[i]['START'] + " -- " + endTime + "</span>"
						+ "<span class=\"movPlace\">" + data[i]['PLACE'] + "</span>"
						+ "<span class=\"movTitle\">" + data[i]['CTITLE'] + "</span>"
						+ "<span class=\"movETitle hidden\">" + data[i]['ETITLE'] + "</span>"
						+ "<span class=\"movRemark\">" + data[i]['REMARK'] + "</span>"
						+ "<span class=\"movPageNo\">(" + data[i]['PAGE'] + ")</span></li>");
				if(data[i]['CTITLE'].indexOf('(取消)') != -1)
				{
					appendObj.addClass("redBox");
					if(!error) msgBox("error", "注意: 片單中有取消場次");
					error = true;
				}
				$("#dropBox > #seledMovList").append(appendObj);
				$("#varStor").append(data[i]['KEY'] + ",");
			}
		}
		updateSeledCount();
	}
}

function removeMov(movId)
{
	msgBox("remove", "<p>移除 \"" + $("#" + movId).children(".movTitle").text() + "\"?</p>",
		function() {
			var movIdRemove = movId.split('-')[1];
			var varStor = $("#varStor").text();
			$("#varStor").text(varStor.replace(movIdRemove + ",", ""));
			$("#" + movId).hide("drop", {}, "fast", function() {$("#" + movId).remove()});
			$("#seledMovList").height($("#seledMovList").height() - 80);
			updateSeledCount();
		},
		function() {
			imdbWindow($("#" + movId).get());
		});
}

function updateSeledCount()
{
	var varStor = $("#varStor").text();
	$("#dropBox > h1").html("我的片單 (" + $("#seledMovList > li").length + ") "
				+ "<span id=\"listLink\">["
				+ "<a href=\"javascript:share('link');\" title=\"與好友分享你的片單\">片單連結</a> "
				+ "<a href=\"javascript:share('twitter');\" class=\"shareBtn\" title=\"twitter\">推</a> "
				+ "<a href=\"javascript:share('plurk');\" class=\"shareBtn\" title=\"plurk\">噗</a> "
				+ "<a href=\"javascript:share('facebook');\" class=\"shareBtn\" title=\"facebook\">臉</a> / "
				+ "<a href=\"javascript:window.print();\" title=\"以條列式列印片單\">列印片單</a> / "
				+ "<a href=\"cal.php?movs=" + varStor + "\" title=\"以月曆模式列印片單\">月曆列印</a>]</span>"
	);
	if($.browser.msie == true) $("#dropBox > h1").show();
	else $("#dropBox > h1").show("highlight", {}, "slow");

	if(isIProduct() != false)
	{
		iProductInit();
		$("#dropBox").css("z-index", "5");
		$("#iLayerTop").text("#dropBox");

		$("#seledMovList").height($("#seledMovList").height() + $("#seledMovList > li").length * 10 + 80);
		$("#seledMovList > li").css("padding", "5px 0");
		seledMovListScroll = new iScroll("seledMovList");
	}
}

function share(site)
{
	var varStor = $("#varStor").text();
	var link = window.location.href.split('?')[0] + "?movs=" + varStor;

	// http://api.bit.ly/shorten?version=2.0.1&longUrl=[link]&login=cornguo&apiKey=R_4976efdab985f8bddaa1c25495000f53

	$.ajax({
		"type": "GET",
		"url": "http://api.bit.ly/shorten",
		"dataType": "jsonp",
		"data": {
			"version": "2.0.1",
			"longUrl": link,
			"login": "cornguo",
			"apiKey": "R_4976efdab985f8bddaa1c25495000f53"
		},
		"success": function(data) {sharePost(site, data["results"][link]["shortUrl"]);}
	});
}


function sharePost(site, link)
{
	switch(site)
	{
	case "plurk":
		void(window.open('http://www.plurk.com/?qualifier=shares&status='
			+ encodeURIComponent(link) + ' (' + encodeURIComponent(document.title + ' - 我的片單)')));
	break;
	case "twitter":
		void(window.open('http://twitter.com/share?url=' + encodeURIComponent(link)
			+ '&text=' + encodeURIComponent(document.title + ' - 我的片單'), "twitter", "width=800,height=420,dependent=yes"));
	break;
	case "facebook":
		void(window.open('http://www.facebook.com/sharer.php?u='
			+ encodeURIComponent(link) + '&t=' + encodeURIComponent(document.title + ' - 我的片單'), "facebook", "width=800,height=420,dependent"));
	break;
	case "link":
		msgBox('plain', "連結到這份片單的網址<br /><a id=\"shareLink\" href=\"" + link + "\">" + link + "</a>");
	break;
	}
}

function getEndTime(startTime, endTime)
{
	if(endTime.split(" ")[2].split(":")[0] < startTime.split(" ")[2].split(":")[0])
		return parseInt(endTime.split(" ")[2].split(":")[0])+24 + ":" + endTime.split(" ")[2].split(":")[1] + "*";
	else return endTime.split(" ")[2];
}

function msgBox(msgType, msg, callback, callback2)
{
	var msgBox = $("<div />");
	var buttonParm = "";

	switch(msgType)
	{
	case "plain":
		buttonParm = {
			"確定": function() {$(this).dialog('close'); $(this).remove();}
		};
	case "error":
		buttonParm = {
			"確定": function() {$(this).dialog('close'); $(this).remove();}
		};
		break;
	case "confirm":
		buttonParm = {
			"確定": function() {$(this).dialog('close'); $(this).remove(); callback();},
			"取消": function() {$(this).dialog('close'); $(this).remove();}
		};
		break;
	case "remove":
		buttonParm = {
			"確定": function() {$(this).dialog('close'); $(this).remove(); callback();},
			"取消": function() {$(this).dialog('close'); $(this).remove();},
			"IMDb": function() {$(this).dialog('close'); $(this).remove(); callback2();}
		};
		break;
	case "collision":
		buttonParm = {
			"確定": function() {$(this).dialog('close'); $(this).remove();},
			"忽略": function() {$(this).dialog('close'); $(this).remove(); callback();}
		};
		break;
	}
	msgBox.html(msg);
	msgBox.dialog({
		"autoOpen": false,
		"bgiframe": true,
		"modal": true,
		"buttons": buttonParm,
		"open": function() {
			$(".ui-widget-overlay").css({"opacity": 0.5, "filter": "alpha(opacity=50)"}, 300);
		}
	});
	if(msgType == "error" || msgType == "collision")
	{
		$(".ui-dialog").css({"background-color": "#FCC", "border-color": "#600"});
		$(".ui-dialog-content").css({"background-color": "#FEE"});
	}
	msgBox.dialog("open");
}

function imdbWindow(movTitleObj)
{
	var eTitle = $(movTitleObj).children(".movETitle:first").text().split("+");
	if(eTitle == "") return;
	if(eTitle.length > 1)
	{
		var movOpt = "<ul id=\"movOpt\">";
		$.each(eTitle, function(idx, text) {
			movOpt += "<li>" + trim(text) + "</li>";
		});
		movOpt += "</ul>";
		msgBox("plain", "<strong>Which movie?</strong>" + movOpt);
		$("#movOpt > li").bind("click", function() {
			void(window.open("http://www.imdb.com/find?s=all&q=" + escape($(this).text()), "imdbWindow"));
			return false;
		});
	}
	else void(window.open("http://www.imdb.com/find?s=all&q=" + escape(eTitle[0]), "imdbWindow"));
}

function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}


function isIProduct()
{
	var iPad = navigator.userAgent.match(/iPad/i);
	var iPhone = navigator.userAgent.match(/iPhone/i);
	var iPod = navigator.userAgent.match(/iPod/i);
	var android = navigator.userAgent.match(/Android/i);
	var webOs = navigator.userAgent.match(/WebOS/i);

	if(iPad) return "iPad";
	if(iPhone || android || webOs) return "iPhone";
	if(iPod) return "iPod";
	return false;
}

function iProductForceApp()
{
//	return;
	var movs = gup("movs");
	if(movs != null && movs != "")
	{
		window.location = "cal.php?movs=" + movs;
		return;
	}

	if(navigator.userAgent.match(/Android/i)) return;
	if(window.navigator.standalone != true) window.location = "..";

}

function iBack()
{
	if($("#groupBox").text() == "") return;

	var backTo = null;

	if($("#iLayerTop").text()[0] == "-")
	{
		backTo = $("#iLayerTop").text().replace(/^-/gi,"");
		iProductInit();
		$(backTo).css("z-index", "5");
		$("#iLayerTop").text(backTo);
		return;
	}

	if($("#iLayerTop").text() == "#dropBox") backTo = "#lPanel";
	if($("#iLayerTop").text() == "#lPanel") backTo = "#titleBox";
	if($("#iLayerTop").text() == "#titleBox") backTo = "#groupBox";

	if(backTo == null) return;

	iProductInit();
	$(backTo).css("z-index", "5");
	$("#iLayerTop").text(backTo);
	return;
}

function iList()
{
	iProductInit();
	if($("#iLayerTop").text()[0] != "-") $("#iLayerTop").text("-" + $("#iLayerTop").text());
	$("#dropBox").css("z-index", "5");
}

function gup(name)
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null ) return null;
	else return results[1];
}

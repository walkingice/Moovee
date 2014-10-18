<!DOCTYPE html>
<html>
<head>
<title><?php echo $title;?></title>
<meta name="description" content="<?php echo $description;?>" />
<meta name="keywords" content="<?php echo $keywords;?>" />
<?php include("../includes/header.test.inc.php"); ?>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js"></script>
</head>
<body onload="render();">
<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container-fluid">
            <a class="brand" href="."><?php echo $title;?></a>
            <p id="extlinks" class="navbar-text pull-right"><?php echo $extlinks;?></p>
        </div>
    </div>
</div>

<div class="container-fluid">
    <div id="breadcrumb" class="well well-small dropdown">
        <div class="btn-group">
            <span class="btn btn-primary">點此開始</span><span id="bCat-dropdown" class="dropdown-toggle btn btn-primary" data-toggle="dropdown"><b class="caret"></b></span>
            <ul id="tabs" class="dropdown-menu" role="menu" aria-labelledby="bCat-dropdown">
                <li role="menuitem"><a id="by-CATEGORY" class="tab" onclick="getGroup(this);return false;" href="#CATEGORY">影展分類</a></li>
                <li role="menuitem"><a id="by-DATE" class="tab" onclick="getGroup(this);return false;" href="#DATE">播映日期</a></li>
                <li role="menuitem"><a id="by-PLACE" class="tab" onclick="getGroup(this);return false;" href="#PLACE">播映影廳</a></li>
                <li role="menuitem"><a id="by-GRADE" class="tab" onclick="getGroup(this);return false;" href="#GRADE">電影分級</a></li>
                <li role="menuitem"><a id="by-REMARK" class="tab" onclick="getGroup(this);return false;" href="#REMARK">場次備註</a></li>
            </ul>
        </div>
    </div>
</div>

<div class="container-fluid">
    <div class="row-fluid">
        <div id="lPanel" class="span5 well well-small">
            <div id="dragBox"></div>
            <div id="remarkDesc"><?php echo $remarkDesc;?></div>
        </div>
        <div id="dropBox" class="span7 well well-small"></div>
        <!--<div id="calendar" class="span5 well well-small" style="height: 600px;"></div>-->
    </div>

    <?php include("footer.inc.php");?>
</div>
<div id="varStor" class="hidden"><?php if(strlen($movs) > 0) echo $movs;?></div>
<div id="filter" class="hidden"></div>
</body>
</html>

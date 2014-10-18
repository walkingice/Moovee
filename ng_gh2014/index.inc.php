<!DOCTYPE html>
<html>
<head>
<title><?php echo $title;?></title>
<meta name="description" content="<?php echo $description;?>" />
<meta name="keywords" content="<?php echo $keywords;?>" />
<?php include("../includes/header.test.inc.php"); ?>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js"></script>
</head>
<body ng-app="mooveeApp">
<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container-fluid">
            <a class="brand" href="."><?php echo $title;?></a>
            <p id="extlinks" class="navbar-text pull-right"><?php echo $extlinks;?></p>
        </div>
    </div>
</div>

<div class="container-fluid" ng-controller="ItemsCtrl">
    <div class="row-fluid">
        <div class="span6">
            <div>
                排序清單
                <select ng-model="predicate">
                    <option value="">無</option>
                    <option value="CATEGORY">依照 分類</option>
                    <option value="PLACE">依照 地點</option>
                    <option value="START_DATETIME">依照 時間</option>
                </select>
            </div>
            <div>
                過濾清單
                <select ng-model="filterStr">
                    <option value="{{f}}" ng-repeat="f in filterOpts">{{f}}</option>
                </select>
                <button class="btn" ng-disabled="!filterStr" ng-click="filterStr=''">不過濾</button>
            </div>
            <div class="fixed-height">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <td>片名</td>
                            <td>分類</td>
                            <td>地點</td>
                            <td>時間</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="item in items | orderBy:predicate | filter: filterStr">
                            <td>{{item.CTITLE}}</td>
                            <td>{{item.CATEGORY}}</td>
                            <td>{{item.PLACE}}</td>
                            <td>{{item.START_DATETIME | date:'M/dd H:mm'}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="remarkDesc"></div>
        </div>
        <div class="span6 block-bordered fixed-height"></div>
        <!--<div id="calendar" class="span5 well well-small" style="height: 600px;"></div>-->
    </div>
</div>
<div class="container-fluid">
    <div class="">
        <dl class="dl-horizontal">
            <dt>★ </dt><dd>影人出席，詳情請見網站及現場公告</dd>
            <dt>▲</dt><dd>影片非英語發音且無英文字幕</dd>
            <dt>◎ </dt><dd>非售票之活動場次；入場方式請見活動頁</dd>
            <dt></dt><dd>(跨日場次將以大於 24 小時方式表示)</dd>
        </dl>
    </div>
</div>

<div class="container-fluid">
    <?php include("footer.inc.php");?>
</div>


<div id="varStor" class="hidden"><?php if(strlen($movs) > 0) echo $movs;?></div>
<div id="filter" class="hidden"></div>
</body>
<script src="app.js"></script>
</html>

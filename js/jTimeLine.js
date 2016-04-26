/**
@Description: JQuery Timeline Plugin
@Date:2014-6-16
@Author:Robin.Shen
@Version:v0.1
@About: http://www.websxh.com
**/
(function ($) {
    $.extend($.fn, {
        JTimeline: function (options) {
            if (!filter(options)) { //参数格式错误
                return this;
            }

            var box = $(this); //容器
            var options = $.extend({}, $.fn.JTimeline.defaults, options); //覆盖原有参数
            var dataSource = options.dataSource;
            var nodeStatus = { "Past": 1, "Now": 2, "Future": 3 }; //流程节点的三种状态
            var tmlineStrFirst = '<div id="@0" class="tmlineVLine @1" style="height: 42px;"></div><div class="tmlineNode @1"></div><div id="@2" class="tmlineHLine @1 @3"></div>'; //时间线模版 @0:首层ID; @1:流程线样式; @2:横线ID; @3:横线左右样式
            var tmlineStrNotFirst = '<div id="@0" class="tmlineVLine tmlineVLinePlus @1" style="height: 42px;"></div><div class="tmlineNode tmlineNodePlus @1"></div><div id="@2" class="tmlineHLine @1 @3"></div>'; //时间线模版 @0:首层ID; @1:流程线样式; @2:横线ID;  @3:横线左右样式
            //流程项模版  @0:ID; @1:时态; @2:边框时态; @3:左右结构  @4:workflowItem 填充内容
            var nodeItemStrOld = '<div id="@0" class="workflowItem @1 @2 @3" style="top: 20px;">' +
            '<table cellpadding="0" cellspacing="0" id="@4" >' +
                '<tr class="workflowItemTr">' +
                    '<td class="workflowItemTd1">' +
                        '<i class="workflowItemIcon workflowItemPersonImg"></i>' +
                    '</td>' +
                    '<td class="workflowItemTd2">' +
                        '<span class="workflowItemPersonName">Gavin Hu</span> <span class="workflowItemDoing">' +
                            'Enter a project information</span>' +
                    '</td>' +
                    '<td class="workflowItemTd3">' +
                        '<i class="workflowItemIcon workflowItemEditImg"></i>' +
                    '</td>' +
                '</tr></table></div>';
            var nodeItemStr = '<div id="@0" class="workflowItem @1 @2 @3" style="top: 20px;"><table cellpadding="0" cellspacing="0" id="@4" ></table></div>';
            //流程项说明模版   @0:ID;  @1:左右结构  @2:左右TD1; @3:左右对话框;  @4:左右TD2; @5:字体时态; @6:说明标题; @7:说明时间;
            var nodeDescStrRight = '<div id="@0" class="workflowDesc @1" style="top: 23px;">' +
            '<table cellpadding="0" cellspacing="0"><tr>' +
                    '<td class="@2"><i class="workflowDescImg @3"></i></td>' +
                    '<td class="@4"><span class="@5 workflowDescTitle" id="@6" >Project information</span><br /><span id="@7">On June 11,2014 8:20</span></td>' +
                '</tr></table></div>';
            var nodeDescStrLeft = '<div id="@0" class="workflowDesc @1" style="top: 23px;">' +
            '<table cellpadding="0" cellspacing="0"><tr>' +
                    '<td class="@2"><span class="@5 workflowDescTitle" id="@6">Project information</span><br /><span id="@7">On June 11,2014 8:20</span></td>' +
                    '<td class="@4"><i class="workflowDescImg @3"></i></td>' +
                '</tr></table></div>';
            var $Timeline = {
                Init: function () {  //初始化处理数据
                    //                    if (options.bProcessing) {
                    //                        box.mask("Waiting...");
                    //                    }
                    //                    if (options.bProcessing) {
                    //                        box.unmask();
                    //                    }
                    if (dataSource != null) {
                        $Timeline.GeneralNav();
                        $Timeline.GetContents();
                        $Timeline.CacluElePosition();
                    }

                },
                //生成时间轴
                GeneralNav: function () { //生成时间线
                    box.append("<div class='tmlineNav'><div class='tmlineContent'></div></div>");
                    var tmline = $(".tmlineContent");
                    if (isArray(dataSource)) {
                        for (var i = 0; i < dataSource.length; i++) {
                            var dataObj = dataSource[i];
                            var tmlineStrs = i == 0 ? tmlineStrFirst : tmlineStrNotFirst;
                            if (dataObj.Status == nodeStatus.Past) {  //过去时
                                tmlineStrs = tmlineStrs.replace(/@1/g, "tmlinePast");
                            } else if (dataObj.Status == nodeStatus.Now) { //现在时
                                tmlineStrs = tmlineStrs.replace(/@1/g, "tmlineNow");
                            } else { //将来时
                                tmlineStrs = tmlineStrs.replace(/@1/g, "tmlineFuture");
                            }
                            if (i % 2 == 0) {
                                tmlineStrs = tmlineStrs.replace(/@3/g, "tmlineHLineLeft");
                            } else {
                                tmlineStrs = tmlineStrs.replace(/@3/g, "tmlineHLineRight");
                            }
                            //替换ID
                            tmlineStrs = tmlineStrs.replace("@0", "tmlineV" + i);
                            tmlineStrs = tmlineStrs.replace("@2", "tmlineH" + i);
                            tmline.append(tmlineStrs);
                        }
                        //加上最后竖线
                        var endtmLine = '<div class="tmlineFuture tmlineVLine tmlineVLinePlus" style="height: ' + $("#tmlineV0").height() + 'px;"></div>';
                        tmline.append(endtmLine);
                    } else {
                        return false;
                    }
                },
                //生成流程项
                GetContents: function () { //生成内容项，数据+时间节点容器
                    if (isArray(dataSource)) {
                        for (var i = 0; i < dataSource.length; i++) {
                            var dataObj = dataSource[i];
                            var nodeItemStrs = nodeItemStr;
                            var nodeDescStrs = nodeDescStrRight;
                            if (i % 2 != 0) {
                                nodeDescStrs = nodeDescStrLeft;
                            }
                            // nodeItemStr @0=workflowItem[i] @1=workflowItemPast @2=workflowItemBorderPast @3=pubItemLeft
                            // nodeDescStr @0=workflowDesc[i] @1=pubDescRight @2=workflowDescRightTd1 @3=rightPast @4=workflowDescRightTd2 @5=workflowItemPast
                            nodeItemStrs = nodeItemStrs.replace(/@0/g, "workflowItem" + i);
                            nodeItemStrs = nodeItemStrs.replace(/@4/g, "itemContent" + i); //table ID 用来遍历填充内容
                            nodeDescStrs = nodeDescStrs.replace(/@0/g, "workflowDesc" + i);
                            nodeDescStrs = nodeDescStrs.replace(/@6/g, "descTitle" + i);  //节点说明标题
                            nodeDescStrs = nodeDescStrs.replace(/@7/g, "descTime" + i); //节点说明时间
                            if (i % 2 == 0) {
                                nodeItemStrs = nodeItemStrs.replace(/@3/g, "pubItemLeft");
                                nodeDescStrs = nodeDescStrs.replace(/@1/g, "pubDescRight");
                                nodeDescStrs = nodeDescStrs.replace(/@2/g, "workflowDescRightTd1");
                                nodeDescStrs = nodeDescStrs.replace(/@4/g, "workflowDescRightTd2");

                                if (dataObj.Status == nodeStatus.Past) {  //过去时
                                    nodeDescStrs = nodeDescStrs.replace(/@3/g, "rightPast");
                                } else if (dataObj.Status == nodeStatus.Now) {
                                    nodeDescStrs = nodeDescStrs.replace(/@3/g, "rightNow");
                                } else {
                                    nodeDescStrs = nodeDescStrs.replace(/@3/g, "rightFuture");
                                }
                            } else {
                                nodeItemStrs = nodeItemStrs.replace(/@3/g, "pubItemRight");
                                nodeDescStrs = nodeDescStrs.replace(/@1/g, "pubDescLeft");
                                nodeDescStrs = nodeDescStrs.replace(/@2/g, "workflowDescLeftTd1");
                                nodeDescStrs = nodeDescStrs.replace(/@4/g, "workflowDescLeftTd2");
                                if (dataObj.Status == nodeStatus.Past) {  //过去时
                                    nodeDescStrs = nodeDescStrs.replace(/@3/g, "leftPast");
                                } else if (dataObj.Status == nodeStatus.Now) {
                                    nodeDescStrs = nodeDescStrs.replace(/@3/g, "leftNow");
                                } else {
                                    nodeDescStrs = nodeDescStrs.replace(/@3/g, "leftFuture");
                                }
                            }
                            if (dataObj.Status == nodeStatus.Past) {  //过去时
                                nodeItemStrs = nodeItemStrs.replace(/@1/g, "workflowItemPast");
                                nodeItemStrs = nodeItemStrs.replace(/@2/g, "workflowItemBorderPast");
                                nodeDescStrs = nodeDescStrs.replace(/@5/g, "workflowItemPast");
                            } else if (dataObj.Status == nodeStatus.Now) {
                                nodeItemStrs = nodeItemStrs.replace(/@1/g, "workflowItemNow");
                                nodeItemStrs = nodeItemStrs.replace(/@2/g, "workflowItemBorderNow");
                                nodeDescStrs = nodeDescStrs.replace(/@5/g, "workflowItemNow");
                            } else {
                                nodeItemStrs = nodeItemStrs.replace(/@1/g, "workflowItemFuture");
                                nodeItemStrs = nodeItemStrs.replace(/@2/g, "workflowItemBorderFuture");
                                nodeDescStrs = nodeDescStrs.replace(/@5/g, "workflowItemFuture");
                            }
                            box.append(nodeItemStrs); //节点项新增
                            box.append(nodeDescStrs); //节点说明新增
                            //生成内容
                            $("#descTitle" + i).text(dataObj.NodeTitle);
                            $("#descTime" + i).text(dataObj.NodeTime);
                            var itemDatas = dataObj.Data; //流程项数据
                            var toAppendStrTmp = '<tr class="workflowItemTr"><td class="workflowItemTd1"><i class="workflowItemIcon workflowItemPersonImg"></i></td>' +
                    '<td class="workflowItemTd2"><span class="workflowItemPersonName">@Name</span><span class="workflowItemDoing">@Action</span></td>' +
                    '<td class="workflowItemTd3">@IsEdit</td></tr>';
                            var toAppendStrs = ""; //待追加的内容
                            for (var j = 0; j < itemDatas.length; j++) {
                                var itemDataObj = itemDatas[j];
                                var toAppendStr = toAppendStrTmp;
                                toAppendStr = toAppendStr.replace("@Name", itemDataObj.UserName);
                                toAppendStr = toAppendStr.replace("@Action", itemDataObj.UserAction);
                                if (itemDataObj.IsEdit) {
                                    toAppendStr = toAppendStr.replace("@IsEdit", '<i class="workflowItemIcon workflowItemEditImg"></i>');
                                } else {
                                    toAppendStr = toAppendStr.replace("@IsEdit", '');
                                }
                                toAppendStrs += toAppendStr;
                                if (j != itemDatas.length - 1) {
                                    toAppendStrs += '<tr><td colspan="3" style="height: 10px;"></td></tr>';
                                }
                            }
                            $("#itemContent" + i).append(toAppendStrs);
                        }
                    } else {
                        return false;
                    }
                },
                //计算页面元素位置
                CacluElePosition: function () {
                    var totalItemHeight = 0; //流程项总高度
                    var totalLineHeight = 0; //流程线总高度
                    for (var i = 0; i < dataSource.length; i++) {
                        //先计算workflowItem的位置
                        var workflowItemHeight = $("#workflowItem" + i).height() + 28; //padding 和 border 的值
                        $("#workflowItem" + i).css("top", 20 + totalItemHeight);
                        totalItemHeight += workflowItemHeight + 20; //递增

                        //再计算流程线的高度
                        var preItemHeight = i == 0 ? 0 : $("#workflowItem" + (i - 1)).height() + 20; //上一个流程项高度 用来计算当前流程线高度 不算边框，否则会有4像素的偏差
                        var tmlineVHeight = i == 0 ? workflowItemHeight / 2 + 20 - 4 : preItemHeight / 2 + workflowItemHeight / 2 - 4 + 20;
                        $("#tmlineV" + i).height(tmlineVHeight);
                        totalLineHeight += tmlineVHeight;
                        //最后计算流程说明的位置
                        var temp = totalLineHeight + (i + 1) * 8 - 4;
                        var differential = $("#workflowDesc" + i).height() / 2;

                        $("#workflowDesc" + i).css("top", temp - differential);
                    }
                }
            }
            $Timeline.Init();
        }
    })
    $.fn.JTimeline.defaults = {
        dataSource: null,   //[{"UserName": "Gavin Hu", "UserAction": "Enter a project information", "IsEidt": true, "NodeTitle": "project information", "NodeTime": "2014-06-20", "Status": 1}]
        bProcessing: true,
        fnCallback: function () {

        }
    }
    function filter(options) { //插件私有函数  验证参数是否正确
        return !options || (options && typeof options === "object") ? true : false;  //如果不存在，返回真，存在并且为对象也返回真，其余返回假
    }
    function isArray(obj) {  //私有函数  验证参数是否为数组
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

})(jQuery);
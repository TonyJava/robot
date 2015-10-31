<div>
    <div class="panel panel-default">
        <!-- Default panel contents -->
        <div class="panel-body">
            <div class="col-md-2 pull-left">
                <select name="" chosen class="form-control" style="width:150px;height: 40px;" ng-model="toMe"
                        data-placeholder="接收的消息">
                    <option value="1" selected>接收的消息</option>
                    <option value="-1">发送的消息</option>
                </select>
            </div>

            <a href="" title="" class="btn btn-primary pull-right">发送站内信</a>
        </div>
    </div>
    <table class="table table-bordered table-hover table-striped">
        <thead>
        <tr class="info">
            <th class="col-md-1">

            </th>
            <th class="col-md-1 no-animate" ng-if="toMe == 1">发件人</th>
            <th class="col-md-1 no-animate" ng-if="toMe == -1">收件人</th>
            <th class="col-md-2">时间</th>
            <th>内容</th>
            <th class="col-md-1 text-center"></th>
        </tr>
        </thead>
        <tbody>
        <tr ng-repeat="item in messages" ng-show="!loading">
            <td class="text-center">
                <span ng-if="!item.read" class="text-primary no-animate"><i class="fa fa-circle"></i></span>
            </td>
            <th class="col-md-1 no-animate" ng-show="toMe == 1">[:item.sendername:]</th>
            <th class="col-md-1 no-animate" ng-show="toMe == -1">[:item.recipientname:]</th>
            <td>[:item.sendtime:]</td>
            <td>[:item.messagecontent:]</td>
            <td class="text-center">
                <a href="" class="btn btn-primary btn-sm" ng-click="read(item)">查看</a>
            </td>
        </tr>
        </tbody>
    </table>
</div>
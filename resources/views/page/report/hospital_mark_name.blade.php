﻿<div class="col-md-12">
    <div class="panel panel-default">
        <div class="panel-body">
            <h3 class="panel-title">
                医院Mark使用情况表
            </h3>
        </div>
        <form action="/report/hospital_mark_name" method="post" id="report-form" class="form-horizontal">
            <div class="row">
                <label style="margin:10px 0 0 20px;">时间：从</label>
                <div class="col-md-2">
                    <datepicker date-format="yyyy-MM-dd 00:00:00" date-set="[:SIns.cu_bat_data.production_date:]">
                        <input type="text" name="starttime" ng-model="cond.starttime" class="form-control">
                    </datepicker>
                </div>
                <label style="margin-top: 10px;">到</label>
                <div class="col-md-2">
                    <datepicker date-format="yyyy-MM-dd 00:00:00" date-set="[:SIns.cu_bat_data.production_date:]">
                        <input type="text" name="endtime" ng-model="cond.endtime" class="form-control">
                    </datepicker>
                </div>
            </div>

            <div class="row">

                <div class="form-group">
                    <label class="col-md-2 control-label" for="provinceid">省份id:</label>
                    <div class="col-md-2">
                        <input type="text" class="form-control" id="provinceid"  placeholder="" name="provinceid" ng-model="cond.provinceid" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-2 control-label" for="cityid">城市id:</label>
                    <div class="col-md-2">
                        <input type="text" class="form-control" id="cityid"  placeholder="" name="cityid" ng-model="cond.cityid" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-2 control-label" for="agencyid">代理商id:</label>
                    <div class="col-md-2">
                        <input type="text" class="form-control" id="agencyid"  placeholder="（可为空）" name="agencyid" ng-model="cond.agencyid" required>
                    </div>
                </div>
            </div>



            <div class="form-group">
                <button  class="btn btn-primary col-md-offset-4" type="button" ng-click="query()">查询</button>
            </div>
        </form>
        <div class="clearfix" id="report-result"></div>
    </div>
</div>




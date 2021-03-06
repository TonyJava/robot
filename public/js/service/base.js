;
(function ()
{
    'use strict';
    angular.module('base_app.service')
        .service('SBase',
        [
            '$http',
            //'$scope',
            //'h',
            function ($http
                      //, $scope
                      //, h
            )
            {
                var me = this;
                me._ = {};
                me._.lang = {};

                //$scope.h = h;


                me.init = function ()
                {
                    return $http.post(cook('init/front'))
                        .success(function (r)
                        {
                            me._.lang = r.d;
                            console.log('cBase._: ', me._);
                        })
                }

            }
        ])

        .service('SRobot',
        [
            'SBase',
            'h',
            '$filter',
            'H',
            'SHospital',
            'ngDialog',
            'SEmployee',
            'SAgency',
            '$q',
            function (SBase
                , h
                , $filter
                , H
                , SHospital
                , ngDialog
                , SEmployee
                , SAgency
                , $q)
            {
                var me = this;
                me.ins_name = 'robot';
                me.init = init;
                me.SEmployee = SEmployee;
                me.status_type = h.robot_status;
                me.refresh = refresh;
                me.change_page = change_page;
                me.popup_edit = popup_edit;
                me.popup_new = popup_new;
                me.h = h.ins_helper;
                me.cu = cu;
                me.d = d;
                me.current_page_data = null;
                //me.current_page = 1;
                me.total_items = null;
                me.items_per_page = 20;
                me.ins_name = 'robot';
                me.cond = {
                    relation: ['robotLeaseLog', 'employee', 'mark', 'robotLog', /*'hospital', 'agency'*/],
                    where: {},
                    where_has: {},
                };

                me.lease_type = [
                    {
                        id: -1,
                        name: '在库'
                    },
                    {
                        id: 1,
                        name: '出售'
                    },
                    {
                        id: 2,
                        name: '租赁'
                    },
                    {
                        id: 3,
                        name: '免费合作'
                    }];
                me.robot_status_type = [
                    {
                        id: -1,
                        name: '在库'
                    },
                    null,
                    {
                        id: 1,
                        name: '已售出'
                    },
                    {
                        id: 2,
                        name: '已租出'
                    },
                    {
                        id: 3,
                        name: '免费合作中'
                    }
                ];
                me.robot_action_type = [
                    {
                        id: 0,
                        name: '正常'
                    },
                    {
                        id: 1,
                        name: '维修'
                    },
                    {
                        id: 2,
                        name: '作废'
                    }
                ];

                me.robot_fix_type = [
                    {
                        id : 1,
                        name : 'USB数据导出损坏'
                    },
                    {
                        id : 2,
                        name : '客户报修'
                    },
                    {
                        id : 3,
                        name : '作废'
                    },
                    {
                        id : 4,
                        name : '维修完毕'
                    }
                ]

                me.status = get_status;

                // 根据数据信息，返回对应的状态
                me.getInfo = function(data){
                    
                }

                me.cu_ = function (data)
                {
                    if (!data) {
                        data = me.current_row;
                    };
                    data.write_data = 1;
                    var promise = H.p(cook(me.ins_name + '/cu_'), data);
                    promise.then(function (r)
                        {
                            if (r.data.status == 1)
                            {
                                ngDialog.closeAll();
                                me.refresh();
                            }
                        })
                    return promise;
                }

                me.deps = $q.all[SHospital.get_all_rec(),  SAgency.get_all_rec()];

                function popup_new()
                {
                    ngDialog.open({
                        templateUrl: shot('seg/' + me.ins_name + '_new_form')
                    })
                }

                me.prepare_current_row = function ()
                {
                    console.log('me.current_row: ', me.current_row);
                    console.log('me.current_row.robot_lease_log: ', me.current_row.robot_lease_log);
                    var r = $filter('orderBy')(me.current_row.robot_lease_log, 'id', true)
                    console.log('r[0]: ', r[0]);
                    //console.log('r[0].lease_started_at: ', r[0].lease_started_at);

                    if (r[0])
                    {
                        me.current_row.lease_type_id = r[0].lease_type_id;
                        me.current_row.agency_id = r[0].agency_id;
                        me.current_row.hospital_id = r[0].hospital_id;
                        me.current_row.lease_started_at = r[0].lease_started_at;
                        me.current_row.lease_ended_at = r[0].lease_ended_at;
                    }
                    else
                    {
                        me.current_row.lease_type_id = 1;
                        me.current_row.agency_id = 1;
                        me.current_row.hospital_id = 1;
                        me.current_row.lease_started_at = new Date();
                        me.current_row.lease_ended_at = new Date();
                    }

                    h.prepare_current_row.call(me);
                }
                function get_status(row)
                {
                    if (row.status == 0)
                        return '已冻结';
                    if (moment().isBetween(row.started_at, row.ended_at))
                        return '正常';
                    return '已过期';
                }

                function cu(d)
                {
                    return h.cu.apply(me, arguments);
                }

                function d(id)
                {
                    return H.p(cook(me.ins_name + '/d'), {id: id})
                        .then(function (r)
                        {
                            if (r.data.d)
                            {
                                me.refresh();
                            }
                        }, function ()
                        {
                        })
                }

                function popup_edit(row)
                {
                    console.log('row: ', row);

                    h.popup_form.call(me, row)
                }

                function refresh()
                {
                    // h.prepare_cond.call(me);
                    return H.p(cook(me.ins_name + '/nr'),
                        me.cond)
                        .then(function (r)
                        {
                            me.total_items = r.data.d.count;
                            me.current_page_data = r.data.d.main;
                            console.log('me.current_page_data: ', me.current_page_data);
                            return r;
                        })
                }

                function change_page(pagination)
                {
                    console.log('pagination: ', pagination);

                    me.cond.pagination = pagination;
                    me.refresh();
                }

                function init()
                {
                    me.cond = {
                        relation: ['robotLeaseLog', 'employee', 'mark', 'robotLog', /*'hospital', 'agency'*/],
                        where: {},
                        where_has: {},
                    };
                    //h.get_all_hospital()
                    //    .then(function(r)
                    //    {
                    //        me.all_hospital = r.data.d.main;
                    //    })
                    //me.refresh()
                }
            }
        ])

        .service('SMark',
        [
            'SBase',
            'h',
            '$filter',
            'H',
            'SHospital',
            'ngDialog',
            'SEmployee',
            'SAgency',
            '$q',
            function (SBase
                , h
                , $filter
                , H
                , SHospital
                , ngDialog
                , SEmployee
                , SAgency
                , $q)
            {
                var me = this;
                me.ins_name = 'mark';
                me.init = init;
                me.SEmployee = SEmployee;
                me.status_type = h.mark_status;
                me.refresh = refresh;
                me.change_page = change_page;
                me.popup_edit = popup_edit;
                me.popup_new = popup_new;
                me.h = h.ins_helper;
                me.cu = cu;
                me.d = d;
                me.current_page_data = null;
                me.include_archived = true;
                //me.current_page = 1;
                me.total_items = null;
                me.items_per_page = 20;
                me.cond = {
                    relation: [],
                    where: {},
                    where_has: {},
                };
                me.cu_bat_data = {};
                me.invalid_mark_list = [];
                me.marks_not_used = 0;
                me.selling_status_type =
                    [
                        {
                            id: 1,
                            name: '在库'
                        },
                        {
                            id: 2,
                            name: '已售'
                        }
                    ];

                me.status_type =
                    [
                        {
                            id: 1,
                            name: '未使用',
                        },
                        {
                            id: 2,
                            name: '已使用未绑定',
                        },
                        {
                            id: -2,
                            name: '已使用已绑定',
                        },
                        {
                            id: 3,
                            name: '损坏报废',
                        },
                        {
                            id: 4,
                            name: '损坏更换',
                        },
                    ];

                me.a_status_type =
                [
                    {
                        id: 1,
                        name: '未使用',
                    },
                    {
                        id: 2,
                        name: '已使用未扫码',
                    },
                    {
                        id: -2,
                        name: '已使用并扫码',
                    },
                    {
                        id: 3,
                        name: '损坏报废',
                    },
                    {
                        id: 4,
                        name: '损坏更换',
                    },
                ];

                me.popup_mark_bind = function ()
                {
                    ngDialog.open({
                        templateUrl: shot('seg/mark_bind_form')
                    })
                }

                me.popup_mark_update = function ()
                {
                    ngDialog.open({
                        templateUrl: shot('seg/mark_update_form')
                    })
                }

                me.popup_mark_unbind = function ()
                {
                    ngDialog.open({
                        templateUrl: shot('seg/mark_unbind_form')
                    })
                }

                me.status = get_status;

                me.cu_ = function ()
                {
                    H.p(cook(me.ins_name + '/cu_'), me.current_row)
                        .then(function (r)
                        {
                            if (r.data.status == 1)
                            {
                                ngDialog.closeAll();
                                me.refresh();
                            }
                        })
                }

                me.bat_mark = function(action, data){
                    return H.p(cook('mark/bat_mark'), {'action' : action, 'data' : data});
                }

                me.one = function(id){
                    return me.h.r(id, me, ['hospital', 'agency', 'doctor', 'robot']);
                }

                me.cu_bat = function ()
                {
                    H.p(cook('mark/bat_exists'), me.cu_bat_data.mark_list)
                        .then(function (r)
                        {
                            if (r.data.status == 0)
                            {
                                me.invalid_mark_list = r.data.d.additional_info;
                            }
                            else
                            {
                                H.p(cook('mark/bat_cu'), me.cu_bat_data)
                                    .then(function (r)
                                    {
                                        if (r.data.status == 1)
                                        {
                                            me.refresh();
                                            ngDialog.closeAll();
                                            me.cu_bat_data = {};
                                        }
                                        console.log('mark/bat_cu: ', r);
                                    })
                            }
                        })
                    console.log('me.cu_bat_data: ', me.cu_bat_data);
                }

                me.u = function ()
                {
                    me.cu_bat_data.only_update = 1;
                    H.p(cook('mark/bat_cu'), me.cu_bat_data)
                        .then(function (r)
                        {
                            if (r.data.status == 1)
                            {
                                me.refresh();
                                ngDialog.closeAll();
                                me.cu_bat_data = {};
                            }
                            console.log('mark/bat_cu: ', r);
                        })
                }

                me.deps = $q.all([SHospital.get_all_rec(), SAgency.get_all_rec()]);

                function popup_new()
                {
                    ngDialog.open({
                        templateUrl: shot('seg/' + me.ins_name + '_new_form')
                    })
                }

                me.prepare_current_row = function ()
                {
                    //console.log('me.current_row: ', me.current_row);
                    //console.log('me.current_row.mark_lease_log: ', me.current_row.mark_lease_log);
                    //var r = $filter('orderBy')(me.current_row.mark_lease_log, 'id', true)
                    //console.log('r[0]: ', r[0]);
                    ////console.log('r[0].lease_started_at: ', r[0].lease_started_at);
                    //
                    //if (r[0])
                    //{
                    //    me.current_row.lease_type_id = r[0].lease_type_id;
                    //    me.current_row.agency_id = r[0].agency_id;
                    //    me.current_row.hospital_id = r[0].hospital_id;
                    //    me.current_row.lease_started_at = r[0].lease_started_at;
                    //    me.current_row.lease_ended_at = r[0].lease_ended_at;
                    //}
                    //else
                    //{
                    //    me.current_row.lease_type_id = 1;
                    //    me.current_row.agency_id = 1;
                    //    me.current_row.hospital_id = 1;
                    //    me.current_row.lease_started_at = new Date();
                    //    me.current_row.lease_ended_at = new Date();
                    //}
                    //
                    //h.prepare_current_row.call(me);
                }
                function get_status(row)
                {
                    if (row.status == 0)
                        return '已冻结';
                    if (moment().isBetween(row.started_at, row.ended_at))
                        return 'OK';
                    return '已过期';
                }

                function cu(d)
                {
                    h.cu.apply(me, arguments);
                }

                function d(id)
                {
                    return H.p(cook(me.ins_name + '/d'), {id: id})
                        .then(function (r)
                        {
                            if (r.data.d)
                            {
                                me.refresh();
                            }
                        }, function ()
                        {
                        })
                }

                function popup_edit(row)
                {
                    console.log('row: ', row);

                    h.popup_form.call(me, row)
                }

                function refresh()
                {
                    me.marks_not_used = 0;
                    me.cond2 = h.prepare_cond(1, me.cond);

                    if (!me.include_archived)
                        me.cond2.where.archive_at = null;

                    return H.p(cook(me.ins_name + '/r_'),
                        me.cond2)
                        .then(function (r)
                        {
                           me.total_items = r.data.d.count;

                            me.current_page_data = r.data.d.main;
                            console.log('me.current_page_data: ', me.current_page_data);

                            var d = me.current_page_data;
                            
                            for (var i = 0; i < d.length; i++)
                            {
                                if (!d[i].used_at && !d[i].damaged_at && !d[i].archive_at)
                                    me.marks_not_used++
                            }
                            return r;
                        })
                }
                me.mark_checkout_history =  mark_checkout_history;
                function mark_checkout_history(){
                	return H.p(cook(me.ins_name + '/ck_mark_history'),me.cond2).then(function (r){
                                me.history_items = r.data.d.count;
                                me.history_page_data = r.data.d.main;
                            });
                }

                function change_page(pagination)
                {
                    console.log('pagination: ', pagination);

                    me.cond.pagination = pagination;
                    me.refresh();
                }

                function init()
                {
                    me.cond = {
                        relation: [],
                        where: {},
                        where_has: {},
                    };
                    //h.get_all_hospital()
                    //    .then(function(r)
                    //    {
                    //        me.all_hospital = r.data.d.main;
                    //    })
                    //me.refresh()
                }
            }
        ])

        .service('SEmployee',
        [
            'SBase',
            'h',
            'H',
            'SHospital',
            'ngDialog',
            'SAgency',
            function (SBase
                , h
                , H
                , SHospital
                , ngDialog
                , SAgency)
            {
                var me = this;
                me.current_row = {};
                me.ins_name = 'employee';
                me.init = init;
                me.status_type = h.robot_status;
                me.refresh = refresh;
                me.change_page = change_page;
                me.popup_edit = popup_edit;
                me.popup_new = popup_new;
                me.h = h.ins_helper;
                me.cu = cu;
                me.d = d;
                me.current_page_data = null;
                me.all = [];
                //me.current_page = 1;
                me.total_items = null;
                me.items_per_page = 20;
                me.cond = {
                    relation: [/*'robotLeaseLog', 'mark', 'robotLog', *//*'hospital', 'agency'*/],
                    where: {},
                    where_has: {},
                };

                me.r = function (cond)
                {
                    H.p(cook('employee/r'), cond)
                        .then(function (r)
                        {
                            me.all = r.data.d.main;
                            if (r.data.d.per_page) {
                                me.items_per_page = r.data.d.per_page;
                            };
                        })
                }

                SHospital.get_all_rec();
                SAgency.get_all_rec();

                function popup_new()
                {
                    ngDialog.open({
                        templateUrl: shot('seg/' + me.ins_name + '_new_form')
                    })
                }

                function cu(d)
                {
                    return h.cu.apply(me, arguments);
                }

                function d(id)
                {
                    return H.p(cook(me.ins_name + '/d'), {id: id})
                        .then(function (r)
                        {
                            if (r.data.d)
                            {
                                me.refresh();
                            }
                        }, function ()
                        {
                        })
                }

                function popup_edit(row)
                {
                    h.popup_form.call(me, row)
                }

                me.popup_reset_pass = function ()
                {
                    ngDialog.open({
                        templateUrl: shot('seg/reset_password'),
                        controller: 'CPageEmployee'
                    })
                }

                me.one = function(id){
                    var promise = H.p(cook(me.ins_name + '/r'), {id: id});
                    promise.then(function(res){
                        me.current_row = res.data.d.main[0];
                    })
                    return promise;
                }

                me.reset_password = function (d)
                {
                    if (d.password && d.id)
                    {
                        return me.cu(d);
                    }
                }

                function refresh()
                {
                    h.prepare_cond.call(me);
                    return H.p(cook(me.ins_name + '/r'),
                        me.cond)
                        .then(function (r)
                        {
                            me.total_items = r.data.d.count;
                            me.current_page_data = r.data.d.main;
                            console.log('me.current_page_data: ', me.current_page_data);

                            return r;
                        })
                }

                function change_page(pagination)
                {
                    console.log('pagination: ', pagination);

                    me.cond.pagination = pagination;
                    me.refresh();
                }

                me.refresh();

                function init()
                {
                    //h.get_all_hospital()
                    //    .then(function(r)
                    //    {
                    //        me.all_hospital = r.data.d.main;
                    //    })
                    me.cond = {
                        relation: [/*'robotLeaseLog', 'mark', 'robotLog', *//*'hospital', 'agency'*/],
                        where: {},
                        where_has: {},
                    };
                }
            }
        ])

        .service('SMe',
        [
            'SBase',
            'h',
            'H',
            function (SBase
                , h
                , H)
            {
                var me = this;
                me.id = 0;
                me.cu = cu;
                me.u = u;
                me.refresh = function ()
                {
                }
                me.change_password = change_password;
                me.ins_name = 'employee'
                me.init = function ()
                {
                    me.uid = SBase._.lang.uid;
                    console.log('me.uid: ', me.uid);
                }

                function change_password(row)
                {
                    H.p(cook(me.ins_name + '/change_password'), row)
                        .then(function (r)
                        {
                            if (r.data.status)
                            {
                                location.reload(true);
                            }
                        })
                }

                function u(d) {
                    h.u.apply(me, [d, me])
                        .then(function (r)
                        {
                        	me.errors = r.data.d.additional_info;
                            if (r.data.status)
                            {
                                location.reload(true);
                            }
                        })
                }

                function cu(d)
                {
                    h.cu.apply(me, arguments)
                        .then(function (r)
                        {
                            if (r.data.status)
                            {
                                location.reload(true);
                            }
                        })

                }
            }
        ])
})();
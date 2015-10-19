<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Session;
use App\Models\IRobot;

class IRobotLog extends BaseModel
{
    protected $guarded = ['id'];
    protected $ins_name = 'robot_log';

    public $createRule = [
        'robot_id' => 'required|exists:i_robot,id',
        'employee_id' => 'required|exists:i_employee,id'
    ];

    public function c($rq = null)
    {
        $rq = rqOnly(['action_type', 'memo', 'robot_id']);

        // 设置 id
        $rq['at'] = time();
        $rq['employee_id'] = Session::get('uid');

        if($rq['action_type'] == 2){
            // 更新状态
            IRobot::where('id', $rq['rid'])->update(['status'=>1]);
        }

        return parent::c($rq);
    }

    /**
     * 关联职员
     */
    public function employee()
    {
        return $this->belongsTo('App\Models\IEmployee', 'employee_id');
    }

    /**
     * 关联机器人
     */
    public function robot()
    {
        return $this->belongsTo('App\Models\IRobot', 'robot_id');
    }
}

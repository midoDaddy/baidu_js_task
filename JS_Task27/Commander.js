/*
* @Author: midoDaddy
* @Date:   2017-08-23 11:25:31
* @Last Modified by:   midoDaddy
* @Last Modified time: 2017-08-26 09:55:56
*/
var Commander = function(cfg) {
    this.cfg = {
        newOrderCon: $('#command-wrapper-new'),
        otherOrderCon: $('#command-wrapper-others'),
        receiver: null
    }
    this.shipArr = [];
    this.CFG = $.extend(this.cfg, cfg);
    this.init();
}

//发送命令
Commander.prototype = {

    constructor: Commander,

    //初始化
    init: function() {
        this.renderOrderBox();
        this.bindEvent();
    },
    

    //创建新的操作命令行
    renderOrderBox: function(id) {
        var html = '',
            shipArr = this.shipArr.sort();
        for (var i = 0; i < shipArr.length; i++) {
            html += '<div class="command-item" id="ship-' + shipArr[i] + '-commander">' +
                '<span class="command-item-label">对' + shipArr[i] + '号飞船下达命令：</span>' +
                '<div class="btn start">开始飞行</div>' +
                '<div class="btn stop">停止飞行</div>' +
                '<div class="btn destroy">销毁</div>' +
            '</div>'
        }
        this.CFG.otherOrderCon.html(html);
    },

    //发送信号
    send: function(msg) {
        console.log(this.adapter(msg))
        this.CFG.receiver.receive(this.adapter(msg));
    },
  
    //创建新飞船命令
    orderNew: function() {       
        var shipNo = 1,
            shipArr = this.shipArr;
        if (shipArr.length >= 4) {
            alert('飞船数量已达上限');
            return false;
        }
        for (var i = 1; i < 5; i++) {
            if (shipArr.indexOf(i) < 0) {
                shipNo = i;
                this.shipArr.push(i);
                break;
            }
        }
        this.renderOrderBox();
        this.getParam($('.power-system-select:checked').val());
        this.getParam($('.energy-system-select:checked').val());
        this.send({
            id: 'ship-' + shipNo,
            command: 'new',
            speed: this.speed,
            energyAddRate: this.energyAddRate,
            energyReduceRate: this.energyReduceRate
        });
    },

    //销毁飞船命令
    orderDestroy: function(e) {
        var self = this,
            $target = $(e.target),
            shipId = this.getShipId($target),
            shipNo = parseInt(shipId.replace('ship-', ''), 10),
            shipIndex = this.shipArr.indexOf(shipNo);
            this.shipArr.splice(shipIndex, 1);
        this.renderOrderBox();
        this.send({
            id: shipId,
            command: 'destroy'
        });
    },

    //获取命令行对应的飞船id
    getShipId: function($btn) {
        return $btn.parents('.command-item').attr('id').replace('-commander', '');
    },

    //获取配置参数
    getParam: function(value) {
        switch(value) {
            case 'power-system-1': 
                this.speed = 30;
                this.energyReduceRate = 0.05;
                break;
            case 'power-system-2': 
                this.speed = 50;
                this.energyReduceRate = 0.07;
                break;
            case 'power-system-3': 
                this.speed = 80;
                this.energyReduceRate = 0.09;
                break;
            case 'energy-system-1': 
                this.energyAddRate = 0.02;
                break;
            case 'energy-system-2': 
                this.energyAddRate = 0.03;
                break;
            case 'energy-system-3': 
                this.energyAddRate = 0.04;
                break;
        }
    },

    //将JSON数据转化为二进制格式
    adapter: function(data) {
        var msg = '';
        if (typeof data !== 'object') {
            return false;
        }
        switch(data.id) {
            case 'ship-1': msg += '0001';
                break;
            case 'ship-2': msg += '0010';
                break;
            case 'ship-3': msg += '0011';
                break;
            case 'ship-4': msg += '0100';
                break;
            default: msg += '0000';
                break;
        }
        switch(data.command) {
            case 'new': msg += '0001';
                break;
            case 'start': msg += '0010';
                break;
            case 'stop': msg += '0011';
                break;
            case 'destroy': msg += '0100';
                break;
            default: msg += '0000';
                break;
        }
        switch(data.speed) {
            case 30: msg += '0001';
                break;
            case 50: msg += '0010';
                break;
            case 80: msg += '0011';
                break;
            default: msg += '0000';
                break;
        }
        switch(data.energyReduceRate) {
            case 0.05: msg += '0001';
                break;
            case 0.07: msg += '0010';
                break;
            case 0.09: msg += '0011';
                break;
            default: msg += '0000';
                break;
        }
        switch(data.energyAddRate) {
            case 0.02: msg += '0001';
                break;
            case 0.03: msg += '0010';
                break;
            case 0.04: msg += '0011';
                break;
            default: msg += '0000';
                break;
        }
        return msg;
    },

    //命令按钮绑定事件
    bindEvent: function() {
        var self = this,
            otherOrderCon = this.CFG.otherOrderCon;
        otherOrderCon.on('click', '.start', function() {
            self.send({
                id: self.getShipId($(this)),
                command: 'start'
            });
        });
        otherOrderCon.on('click', '.stop', function() {
            self.send({
                id: self.getShipId($(this)),
                command: 'stop'
            });
        });
        otherOrderCon.on('click', '.destroy', self.orderDestroy.bind(self));
        this.CFG.newOrderCon.on('click', '.new', self.orderNew.bind(self));
    }
}









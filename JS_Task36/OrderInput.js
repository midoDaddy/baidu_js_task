/*
* @Author: 63431
* @Date:   2017-08-16 15:24:28
* @Last Modified by:   midoDaddy
* @Last Modified time: 2017-08-22 23:23:24
*/


//定义表单项构造函数
function OrderInput(cfg) {
    this.cfg = {
        inputBox: null,
        indexList: null,
        validOrder: {
            withNum: ['GO', 'TRA LEF', 'TRA TOP', 'TRA RIG', 'TRA BOT', 'MOV TOP', 'MOV LEF', 'MOV RIG', 'MOV BOT'],
            noNum: ['TUN LEF', 'TUN RIG', 'TUN BAK', 'BUILD']
        },
        errorClass: 'error',
        targetCar: null,
        targetWall: null,
    };
    this.CFG = extend(this.cfg, cfg);
    this.inputBox = this.CFG.inputBox;
    this.indexList = this.CFG.indexList;
    this.bindEvent(); 

}

OrderInput.prototype = {
    
    constructor: OrderInput, 
    
    //初始化car
    bindEvent: function() {
        this.inputBox.addEventListener('scroll', this.scrollIndexList.bind(this));
        this.inputBox.addEventListener('keyup', function(e) {
            var keyCode = e.keyCode;
            if (keyCode === 13 || keyCode === 8 || keyCode === 17) {
                this.renderIndexList();
            }
        }.bind(this));
    },

    //渲染输入框序号列表
    renderIndexList: function() {
        var cfg = this.CFG,
            html = '',
            length = this.inputBox.value.split('\n').length;
        for (var i = 1; i < length + 1; i++) {
            html += '<li class="order-index-item">' + i + '</li>';
        }
        this.indexList.innerHTML = html;
    },   

    //显示错误提示
    showErrorTip: function(index) {
        var indexItems = this.indexList.children;
        indexItems[index].className = this.cfg.errorClass;
    },

    //清除错误提示
    clearErrorTip: function() {
        var indexItems = this.indexList.children;
        for (var i = 0; i < indexItems.length; i++) {
            indexItems[i].className = '';
        }
    },

    //验证指令有效性
    checkOrder: function(value) {
        var cfg = this.CFG,
            replacedValue = value.replace(/\s[1-9]$/, ''),
            pattern = /^BRU\s#([0-9a-f]{3}){1,2}$/i,
            noNumFlag = cfg.validOrder.noNum.indexOf(value.toUpperCase()) > -1,
            withNumFlag = cfg.validOrder.withNum.indexOf(replacedValue.toUpperCase()) > -1;
        if (noNumFlag || withNumFlag || pattern.test(value)) {
            return true;
        } else {
            return false;
        }
    },

    //获取指令参数：类型与格数
    getOrderParam: function(order) {
        var orderCount = 1,
            orderType = order.replace(/\s[1-9]$/, '')
                        .replace(/\s#([0-9A-Fa-f]{3}){1,2}$/, '')
                        .toUpperCase();           
        if (/\s[1-9]$/.test(order)) {
            orderCount = parseInt(order.slice(-1), 10);
        } 
        return {
            type: orderType, 
            count: orderCount
        };
    },

    //根据指令执行相应函数
    runOrder: function(order) {
        var cfg = this.CFG,
            orderParam = this.getOrderParam(order),
            orderType =  orderParam.type,
            orderCount = orderParam.count;
        switch(orderType) {
            case 'GO': cfg.targetCar.goForward(orderCount);
                break;
            case 'TUN LEF': cfg.targetCar.turnLeft();
                break;
            case 'TUN RIG': cfg.targetCar.turnRight();
                break;
            case 'TUN BAK': cfg.targetCar.turnBack();
                break;
            case 'TRA LEF': cfg.targetCar.goLeft(orderCount);
                break;
            case 'TRA TOP': cfg.targetCar.goTop(orderCount);
                break;
            case 'TRA RIG': cfg.targetCar.goRight(orderCount);
                break;
            case 'TRA BOT': cfg.targetCar.goBottom(orderCount);
                break;
            case 'MOV TOP': cfg.targetCar.moveTop(orderCount);
                break;
            case 'MOV LEF': cfg.targetCar.moveLeft(orderCount);
                break;
            case 'MOV RIG': cfg.targetCar.moveRight(orderCount);
                break;
            case 'MOV BOT': cfg.targetCar.moveBottom(orderCount);
                break;
            case 'BUILD': cfg.targetWall.buildForwardWall();
                break;
            case 'BRU': cfg.targetWall.brushWall(order);
                break;
        }
    },

    //依次执行指令序列
    runOrderGroup: function() {
        var orderArr = this.inputBox.value.split('\n'),
            self = this;
        this.clearErrorTip();
        orderArr.forEach(function(item, index) {
            setTimeout(function(){
                self.checkOrder(item) ? self.runOrder(item) : self.showErrorTip(index);
            }, 1000*index);          
        })
    },

    //清除指令
    clearOrder: function() {
        this.inputBox.value = '';
        this.renderIndexList();
    },

    //序号列表与输入框同步滚动
    scrollIndexList: function() {
        this.indexList.style.top = -this.inputBox.scrollTop + 'px';
    },    
}
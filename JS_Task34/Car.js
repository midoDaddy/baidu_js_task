/*
* @Author: 63431
* @Date:   2017-08-16 15:24:28
* @Last Modified by:   63431
* @Last Modified time: 2017-08-19 00:31:09
*/

//合并对象
function extend(obj1, obj2) {
    var newObj = {};
    for (var item1 in obj1) {
        if (obj1.hasOwnProperty(item1)) {
            newObj[item1] = obj1[item1];
        }
    }
    for (var item2 in obj2) {
        if (obj2.hasOwnProperty(item2)) {
            newObj[item2] = obj2[item2];
        }
    }
    return newObj;
}

//定义表单项构造函数
function Car(cfg) {
    this.cfg = {
        container: null,
        className: 'car',
        startX: 1,
        startY: 1,
        startDeg: 0,
        errorTip: '已经到达边界，不能继续前进'
    };
    this.CFG = extend(this.cfg, cfg);
    this.init();   
}

Car.prototype = {
    
    constructor: Car, 
    
    //初始化car
    init: function() {
        this.createCar();
        this.setStart();
    },

    //创建car元素
    createCar: function() {
        var cfg = this.CFG;
        this.obj = document.createElement('div');
        this.obj.className = cfg.className;
        cfg.container.appendChild(this.obj)
    },

    //设置car的初始位置与角度
    setStart: function() {
        var cfg = this.CFG;
        this.obj.style.top = (cfg.startY - 1)*50 + 'px';
        this.obj.style.left = (cfg.startX - 1)*50 + 'px';
        this.obj.style.transform = 'rotate(' + cfg.startDeg + 'deg)';
    },

    //获取car的旋转角度
    getDeg: function() {
        return parseInt(this.obj.style.transform.replace('rotate(', ''), 10);
    },

    //向右旋转
    turnRight: function() {
        var deg = this.getDeg();
        this.obj.style.transform =  'rotate(' + (deg + 90) + 'deg)';
    },

    //向左旋转
    turnLeft: function() {
        var deg = this.getDeg();
        this.obj.style.transform =  'rotate(' + (deg - 90) + 'deg)';
    },

    //倒转
    turnBack: function() {
        var deg = this.getDeg();
        this.obj.style.transform =  'rotate(' + (deg + 180) + 'deg)';
    },

    //前进一格
    goForward: function() {
        var deg = this.getDeg();
        switch(deg % 360) {
            case 90:
            case -270: this.goRight();
                break;
            case 180:
            case -180: this.goBottom();
                break;
            case 270:
            case -90: this.goLeft();
                break;
            case 0:
            case -0: this.goTop();
                break;
        }
    },

    //向右移动一格
    goRight: function() {
        var left = parseInt(this.obj.style.left, 10);
        if (left >= 450) {
            alert(this.cfg.errorTip);
        } else {
            this.obj.style.left = (left + 50) + 'px';
        }
    },

    //向左移动一格
    goLeft: function() {
        var left = parseInt(this.obj.style.left, 10);
        if (left <= 0) {
            alert(this.cfg.errorTip);
        } else {
            this.obj.style.left = (left - 50) + 'px';
        }
    },

    //向上移动一格
    goTop: function() {
        var top = parseInt(this.obj.style.top, 10);
        if (top <= 0) {
            alert(this.cfg.errorTip);
        } else {
            this.obj.style.top = (top - 50) + 'px';
        }
    },

    //向下移动一格
    goBottom: function() {
        var top = parseInt(this.obj.style.top, 10);
        if (top >= 450) {
            alert(this.cfg.errorTip);
        } else {
            this.obj.style.top = (top + 50) + 'px';
        }
    },
    
    //以最少的角度旋转至目标方向
    turnDegTo: function(target1, target2) {
        var deg = this.getDeg();
        for (var i = -2; i < 2; i++) {
            var targetDeg = deg + 90*i;
            if (targetDeg % 360 === target1 || targetDeg % 360 === target2) {
                break;
            }
        }
        return targetDeg;
    },

    //转向左侧，并向左侧移动一格
    moveLeft: function() {
        var targetDeg = this.turnDegTo(-90, 270);
        this.obj.style.transform = 'rotate(' + targetDeg + 'deg)';
        this.goLeft();
    },

    //转向上方，并向上移动一格
    moveTop: function() {
        var targetDeg = this.turnDegTo(0, -0);
        this.obj.style.transform = 'rotate(' + targetDeg + 'deg)';
        this.goTop();
    },

    //转向右侧，并向右侧移动一格
    moveRight: function() {
        var targetDeg = this.turnDegTo(90, -270);
        this.obj.style.transform = 'rotate(' + targetDeg + 'deg)';
        this.goRight();
    },

    //转向下方，并向下移动一格
    moveBottom: function() {
        var targetDeg = this.turnDegTo(180, -180);
        this.obj.style.transform = 'rotate(' + targetDeg + 'deg)';
        this.goBottom();
    }
    
}
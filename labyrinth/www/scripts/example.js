
function begin() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    field();
    draw_blocks();
    startWatch();
 }
var state = {
        size:0,
        j: 0,
        table: [],
        statusSide: [],
        widthInBlock: 0,
        heghtInBlock: 0,
        str: 0,
        radius: 0,
        initX: 0,
        initY:0
}
//класс блок, содержащий 4 стороны
    function Block(top, right, bottom, left) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
//у каждой стороны координаты начала и координаты конца
    function Left(status, x1, y1, x2, y2) {
        this.status = status;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    function Right(status, x1, y1, x2, y2) {
        this.status = status;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    function Top(status, x1, y1, x2, y2) {
        this.status = status;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    function Bottom(status, x1, y1, x2, y2) {
        this.status = status;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
   

//создаёт стороны блока(собирает один блок)
    function sides(statuses, x, y, r) {
        state.table[state.j] = new Block(
            new Top(statuses[0], x, y, x + r, y),
            new Right(statuses[1], x + r, y, x + r, y + r),
            new Bottom(statuses[2], x, y + r, x + r, y + r),
            new Left(statuses[3], x, y, x, y + r));
        state.j++;
    }
//создаёт поле
    function field() {
        var count = 1;
        setInheritance(); 
        for (var i = 0; i < state.heghtInBlock; i++) {
            
            for (var j = 0; j < state.widthInBlock; j++) {
                sides(state.statusSide[count].split(','), state.initX, state.initY, state.radius);
                state.initX = state.initX + state.radius;
                count++;
            }
            state.initX = 0;
            state.initY = state.initY + state.radius;
            
        }        
    }
//задаётся наследование
    function setInheritance() {
        Left.prototype = Object.create(Block.prototype);
        Left.prototype.constructor = Left;
        Right.prototype = Object.create(Block.prototype);
        Right.prototype.constructor = Right;
        Top.prototype = Object.create(Block.prototype);
        Top.prototype.constructor = Top;
        Bottom.prototype = Object.create(Block.prototype);
        Bottom.prototype.constructor = Bottom;
        
    }
//строку переводит в тип boolean
    function convertor(str) {
        if (str === "true") {
            return true;
        } else {
            return false;
        }
       
    }
//проверка
function test(Ox, Oy) {
    var count=0;
    
    var falseStatus = [];
    currentBlock = state.table.filter(function (item, i, arr) {
        if (item.left.x1 < Ox && item.right.x2 > Ox && item.top.y1 < Oy && item.bottom.y2 > Oy) {
            return item;
        }
    });
 
    if (!convertor(currentBlock[0].left.status)) {
            count++;
        }
    if (!convertor(currentBlock[0].right.status)) {
            count++;
        }
    if (!convertor(currentBlock[0].top.status)) {
            count++;
        }
    if (!convertor(currentBlock[0].bottom.status)) {
            count++;
        }
        switch (count) {
            case 1: oneSide(currentBlock[0], Ox, Oy); break;
            case 2: twoSides(currentBlock[0], Ox, Oy); break;
            case 3: threeSides(currentBlock[0], Ox, Oy); break;
                default:
        }

   
}
//сделать шаг(координаты меняются и по x и по y)
function makeStep(Ox, Oy) {
    document.getElementById("picture").style.left =Ox + 'px';
    document.getElementById("picture").style.top = Oy + 'px';
}
//шаг только по х
function makeStepX(Ox) {
    document.getElementById("picture").style.left = Ox + 'px';    
}
//шаг только по у
function makeStepY(Oy) {
    document.getElementById("picture").style.top = Oy + 'px';
}

//если у блока только одна стена
function oneSide(falseStatus, Ox, Oy) {
    if (!convertor(falseStatus.bottom.status)) {
        if (Oy+state.size < falseStatus.bottom.y1) {
            makeStep(Ox, Oy)
        } else {
            makeStepX(Ox);
        }
    } else if (!convertor(falseStatus.top.status)) {
        if (Oy-10 > falseStatus.top.y1) {
            makeStep(Ox, Oy)
        } else {
            makeStepX(Ox);
        }
    } else if (!convertor(falseStatus.left.status)) {
        if (Ox - 10 > falseStatus.left.x1) {
            makeStep(Ox, Oy)
        } else {
            makeStepY(Oy);
        }
    } else {
        if (Ox + state.size < falseStatus.right.x1) {
            makeStep(Ox, Oy)
        } else {
            makeStepY(Oy);
        }
       
    }
}
//если у блока две стены
function twoSides(falseStatus, Ox, Oy) {
    if (!convertor(falseStatus.bottom.status) && !convertor(falseStatus.top.status)) {
        if (Oy + state.size < falseStatus.bottom.y1 && Oy - state.size/2 > falseStatus.top.y2) {
            makeStep(Ox, Oy);
        } else {           
                makeStepX(Ox);           
        }

    } else if (!convertor(falseStatus.left.status) && !convertor(falseStatus.right.status)) {
        if (Ox - state.size / 2 > falseStatus.left.x1 && Ox + state.size < falseStatus.right.x2) {
            makeStep(Ox, Oy);
        } else {            
            makeStepY(Oy);       
        }
    } else if (!convertor(falseStatus.left.status) && !convertor(falseStatus.top.status)) {
        if (Ox - state.size / 2 > falseStatus.left.x1 && Oy - state.size / 2 > falseStatus.top.y1) {
            makeStep(Ox, Oy);
        } else if (Ox - state.size / 2 > falseStatus.left.x1) {
            makeStepX(Ox);
        } else if (Oy - state.size / 2 > falseStatus.top.y11) {
            makeStepY(Oy);
        }
    } else if (!convertor(falseStatus.right.status) && !convertor(falseStatus.top.status)) {
        if (Ox + state.size < falseStatus.right.x1 && Oy - state.size / 2 > falseStatus.top.y1) {
            makeStep(Ox, Oy);
        } else if (Ox + state.size < falseStatus.right.x1) {
            makeStepX(Ox);
        } else if (Oy - state.size / 2 > falseStatus.top.y1) {
            makeStepY(Oy);
        }
    } else if (!convertor(falseStatus.left.status) && !convertor(falseStatus.bottom.status)) {
        if (Ox - state.size / 2 > falseStatus.left.x1 && Oy + state.size < falseStatus.bottom.y1) {
            makeStep(Ox, Oy);
        } else if (Ox - state.size / 2 > falseStatus.left.x1) {
            makeStepX(Ox);
        } else if (Oy + state.size < falseStatus.bottom.y1) {
            makeStepY(Oy);
        }
    } else if (!convertor(falseStatus.right.status) && !convertor(falseStatus.bottom.status)) {
        if (Ox + state.size < falseStatus.right.x1 && Oy + state.size < falseStatus.bottom.y1) {
            makeStep(Ox, Oy);
        } else if (Ox + state.size < falseStatus.right.x1) {
            makeStepX(Ox);
        } else if (Oy + state.size < falseStatus.bottom.y1) {
            makeStepY(Oy);
        }
      
    }
}
//если у блока три стены
function threeSides(falseStatus, Ox, Oy) {
    if (convertor(falseStatus.top.status)) {
        if (Oy + state.size < falseStatus.bottom.y1 && Ox - state.state.size / 2 > falseStatus.left.x1 && Ox + state.state.size < falseStatus.right.x1) {
            makeStep(Ox, Oy)
        } else if (Ox - state.size / 2 > falseStatus.left.x1 && Ox + state.size < falseStatus.right.x1) {
            makeStepX(Ox);
        } else if (Oy + state.size < falseStatus.bottom.y1) {
            makeStepY(Oy);
        } 
    } else if (convertor(falseStatus.bottom.status)) {
        if (Oy - state.size / 2 > falseStatus.top.y1 && Ox - state.size / 2 > falseStatus.left.x1 && Ox + state.size < falseStatus.right.x1) {
            makeStep(Ox, Oy)
        } else if (Ox - state.size / 2 > falseStatus.left.x1 && Ox + state.size < falseStatus.right.x1) {
            makeStepX(Ox);
        } else if (Oy - state.size / 2 > falseStatus.top.y1) {
            makeStepY(Oy);
        } 
    } else if (convertor(falseStatus.left.status)) {
        if (Oy - state.size / 2 > falseStatus.top.y1 && Oy + state.size < falseStatus.bottom.y1 && Ox + state.size < falseStatus.right.x1) {
            makeStep(Ox, Oy)
        } else if (Oy - state.size / 2 > falseStatus.top.y1 && Oy + state.size < falseStatus.bottom.y1) {
            makeStepY(Oy);
        } else if (Ox + state.size < falseStatus.right.x1) {
            makeStepX(Ox);
        }
    } else if (convertor(falseStatus.right.status)) {
        if (Oy - state.size / 2 > falseStatus.top.y1 && Oy + state.size < falseStatus.bottom.y1 && Ox - state.size / 2 > falseStatus.left.x1) {
            makeStep(Ox, Oy)
        } else if (Oy - state.size / 2 > falseStatus.top.y1 && Oy + state.size < falseStatus.bottom.y1 && Ox - state.size / 2) {
            makeStepY(Oy);
        } else if (Ox - state.size / 2 > falseStatus.left.x1) {
            makeStepX(Ox);
        }       
    }
}

function startWatch() {

    navigator.accelerometer.watchAcceleration(function (acceleration) {

        Ox = (document.getElementById("picture").offsetLeft - acceleration.x);
        Oy = (document.getElementById("picture").offsetTop + acceleration.y);

        if ((Ox > 6 && Ox < screen.width) && (Oy > (screen.height - screen.width) / 2 && Oy < screen.height - (screen.height - screen.width) / 2)) {
            document.getElementById("picture").style.position = 'absolute';
            test(Ox, Oy);
        }



    }, onerror, { frequency: 30 });
}



function onError() {
    alert('onError!');
};


//чтение и парсинг
function OnRequestStateChange() {
    if (request.readyState != 4)
        return;
    if (request.status != 200)
        return;
    state.str = request.responseText; 
    state.statusSide = state.str.split(/\r\n/);
    var temp = state.statusSide[0].split(',');
    state.heghtInBlock = temp[0]; state.widthInBlock = temp[1];
    state.radius = (screen.width-10 / state.widthInBlock) > (screen.height / state.heghtInBlock) ? (screen.width / state.widthInBlock) : (screen.height / state.heghtInBlock);
    state.initY = (screen.height - state.heghtInBlock * state.radius) / 2;
}
//загрузка с файла лабиринта
function load(){
    request = new XMLHttpRequest();
    request.open("GET", "json.txt", true);
    request.onreadystatechange = OnRequestStateChange;
    request.send(null);
}
//отрисовка
function draw_blocks() {
    var b_canvas = document.getElementById("b");
    var b_context = b_canvas.getContext("2d");
    var count = 0;
    state.initY = (screen.height - state.heghtInBlock * state.radius) / 2;
    state.initX = 0;

    /*var img = document.createElement('img');
    img.style.backgroundImage = "url('images/1.gif')";
    img.id = 'picture';
    img.style.position = 'absolute';
    img.style.left = 10 + 'px';
    img.style.right = 190 + 'px';
    document.body.appendChild(img);*/

    state.size = document.getElementById("picture").height - 5;
    document.getElementById("picture").style.position = 'absolute';
    document.getElementById("picture").style.left = 10 + 'px';
    document.getElementById("picture").style.top = 190 + 'px';
    b_context.strokeStyle = "white";
    b_context.lineWidth = 7;    
    state.initX = 0;    
    
    for (var i = 0; i < state.heghtInBlock; i++) {

        for (var j = 0; j < state.widthInBlock; j++) {
            if (!convertor(state.table[count].left.status)) {
                b_context.moveTo(state.initX, state.initY);
                b_context.lineTo(state.initX, state.initY + state.radius);
                
            }
            if (!convertor(state.table[count].right.status)) {
                b_context.moveTo(state.initX+state.radius, state.initY);
                b_context.lineTo(state.initX + state.radius, state.initY + state.radius);
               
            }
            if (!convertor(state.table[count].top.status)) {
                b_context.moveTo(state.initX, state.initY);
                b_context.lineTo(state.initX + state.radius, state.initY);
               
            }

            if (!convertor(state.table[count].bottom.status)) {
                b_context.moveTo(state.initX, state.initY+state.radius);
                b_context.lineTo(state.initX + state.radius, state.initY + state.radius);
                
            }
            state.initX = state.initX + state.radius;
            count++;
        }
        state.initX = 0;
        state.initY = state.initY + state.radius;

    }

    b_context.stroke();
    b_context.fill();
   
   

}
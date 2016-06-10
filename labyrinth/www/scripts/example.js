"use strict";
function begin() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    field();
    draw_blocks();
    startWatch();
}
var state = {
    watchID: false,
    ballSize: 0,
    request: 0,
    Ox: 0,
    Oy: 0,
    counterForBlocks: 0,
    table: [],
    statusSide: [],
    widthInBlock: 0,
    heghtInBlock: 0,
    str: 0,
    radius: 0,
    initX: 0,
    initY: 0,
    repeatGame: false
}


//класс блок, содержащий 4 стороны номеер блока
function Block(number, top, right, bottom, left) {
    this.number = number;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
}
//у каждой стороны координаты начала и координаты конца
function Side(status, x1, y1, x2, y2) {
    this.status = status;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}
//создаёт стороны блока(собирает один блок)
function sides(statuses, x, y, r) {
    state.table[state.counterForBlocks] = new Block(state.counterForBlocks,
        new Side(statuses.top, x, y, x + r, y),
        new Side(statuses.right, x + r, y, x + r, y + r),
        new Side(statuses.bottom, x, y + r, x + r, y + r),
        new Side(statuses.left, x, y, x, y + r));
    state.counterForBlocks++;
}
//создаёт поле
function field() {
    var count = 0;
    for (var i = 0; i < state.heghtInBlock; i++) {

        for (var j = 0; j < state.widthInBlock; j++) {
            sides(state.statusSide[count], state.initX, state.initY, state.radius);
            state.initX = state.initX + state.radius;
            count++;
        }
        state.initX = 0;
        state.initY = state.initY + state.radius;

    }
}
//победа при поподании в нужный блок
function win(block) {
    if (block == state.str.win) {
        return true;
    } else {
        return false;
    }
}
//проверка
function alertDismissed() {
    begin();
}
function test() {
    var count = 0;    
    var currentBlock = state.table.filter(function (item, i, arr) {
        if (item.left.x1 < state.Ox && item.right.x2 > state.Ox && item.top.y1 < state.Oy && item.bottom.y2 > state.Oy) {
            return item;
        }
    });
    if (win(currentBlock[0].number)) {
        if (state.watchID) {
            navigator.accelerometer.clearWatch(state.watchID);
            state.watchID = null;
        }
        window.alert = navigator.notification.alert(
            'Сыграть снова?',              // сообщение
            alertDismissed,         // пользоатель нажал кнопку
            'Приложение',           // Заголовок
            'ОК'                    // Надпись на кнопке
        );
    } else {

        if (!currentBlock[0].left.status) {
            count++;
        }
        if (!currentBlock[0].right.status) {
            count++;
        }
        if (!currentBlock[0].top.status) {
            count++;
        }
        if (!currentBlock[0].bottom.status) {
            count++;
        }
        switch (count) {
            case 1: oneSide(currentBlock[0]); break;
            case 2: twoSides(currentBlock[0]); break;
            case 3: threeSides(currentBlock[0]); break;
            default:
        }
    }

}
//сделать шаг(координаты меняются и по x и по y)
function makeStep() {
    document.getElementById("picture").style.left = state.Ox + 'px';
    document.getElementById("picture").style.top = state.Oy + 'px';
}
//шаг только по х
function makeStepX() {
    document.getElementById("picture").style.left = state.Ox + 'px';
}
//шаг только по у
function makeStepY() {
    document.getElementById("picture").style.top = state.Oy + 'px';
}

//если у блока только одна стена
function oneSide(falseStatus) {
    if (!falseStatus.bottom.status) {
        if (state.Oy + state.ballSize < falseStatus.bottom.y1) {
            makeStep()
        } else {
            makeStepX();
        }
    } else if (!falseStatus.top.status) {
        if (state.Oy - 10 > falseStatus.top.y1) {
            makeStep()
        } else {
            makeStepX();
        }
    } else if (!falseStatus.left.status) {
        if (state.Ox - 10 > falseStatus.left.x1) {
            makeStep()
        } else {
            makeStepY();
        }
    } else {
        if (state.Ox + state.ballSize < falseStatus.right.x1) {
            makeStep()
        } else {
            makeStepY();
        }

    }
}
//если у блока две стены
function twoSides(falseStatus) {
    if (!falseStatus.bottom.status && !falseStatus.top.status) {
        if (state.Oy + state.ballSize < falseStatus.bottom.y1 && state.Oy - state.ballSize / 2 > falseStatus.top.y2) {
            makeStep();
        } else {
            makeStepX();
        }

    } else if (!falseStatus.left.status && !falseStatus.right.status) {
        if (state.Ox - state.ballSize / 2 > falseStatus.left.x1 && state.Ox + state.ballSize < falseStatus.right.x2) {
            makeStep();
        } else {
            makeStepY();
        }
    } else if (!falseStatus.left.status && !falseStatus.top.status) {
        if (state.Ox - state.ballSize / 2 > falseStatus.left.x1 && state.Oy - state.ballSize / 2 > falseStatus.top.y1) {
            makeStep();
        } else if (state.Ox - state.ballSize / 2 > falseStatus.left.x1) {
            makeStepX();
        } else if (state.Oy - state.ballSize / 2 > falseStatus.top.y11) {
            makeStepY();
        }
    } else if (!falseStatus.right.status && !falseStatus.top.status) {
        if (state.Ox + state.ballSize < falseStatus.right.x1 && state.Oy - state.ballSize / 2 > falseStatus.top.y1) {
            makeStep();
        } else if (state.Ox + state.ballSize < falseStatus.right.x1) {
            makeStepX();
        } else if (state.Oy - state.ballSize / 2 > falseStatus.top.y1) {
            makeStepY();
        }
    } else if (!falseStatus.left.status && !falseStatus.bottom.status) {
        if (state.Ox - state.ballSize / 2 > falseStatus.left.x1 && state.Oy + state.ballSize < falseStatus.bottom.y1) {
            makeStep();
        } else if (state.Ox - state.ballSize / 2 > falseStatus.left.x1) {
            makeStepX();
        } else if (state.Oy + state.ballSize < falseStatus.bottom.y1) {
            makeStepY();
        }
    } else if (!falseStatus.right.status && !falseStatus.bottom.status) {
        if (state.Ox + state.ballSize < falseStatus.right.x1 && state.Oy + state.ballSize < falseStatus.bottom.y1) {
            makeStep();
        } else if (state.Ox + state.ballSize < falseStatus.right.x1) {
            makeStepX();
        } else if (state.Oy + state.ballSize < falseStatus.bottom.y1) {
            makeStepY();
        }

    }
}
//если у блока три стены
function threeSides(falseStatus) {
    if (falseStatus.top.status) {
        if (state.Oy + state.ballSize < falseStatus.bottom.y1 && state.Ox - state.state.ballSize / 2 > falseStatus.left.x1 && state.Ox + state.state.ballSize < falseStatus.right.x1) {
            makeStep()
        } else if (state.Ox - state.ballSize / 2 > falseStatus.left.x1 && state.Ox + state.ballSize < falseStatus.right.x1) {
            makeStepX();
        } else if (state.Oy + state.ballSize < falseStatus.bottom.y1) {
            makeStepY();
        }
    } else if (falseStatus.bottom.status) {
        if (state.Oy - state.ballSize / 2 > falseStatus.top.y1 && state.Ox - state.ballSize / 2 > falseStatus.left.x1 && state.Ox + state.ballSize < falseStatus.right.x1) {
            makeStep()
        } else if (state.Ox - state.ballSize / 2 > falseStatus.left.x1 && state.Ox + state.ballSize < falseStatus.right.x1) {
            makeStepX();
        } else if (state.Oy - state.ballSize / 2 > falseStatus.top.y1) {
            makeStepY();
        }
    } else if (falseStatus.left.status) {
        if (state.Oy - state.ballSize / 2 > falseStatus.top.y1 && state.Oy + state.ballSize < falseStatus.bottom.y1 && state.Ox + state.ballSize < falseStatus.right.x1) {
            makeStep()
        } else if (state.Oy - state.ballSize / 2 > falseStatus.top.y1 && state.Oy + state.ballSize < falseStatus.bottom.y1) {
            makeStepY();
        } else if (state.Ox + state.ballSize < falseStatus.right.x1) {
            makeStepX();
        }
    } else if (falseStatus.right.status) {
        if (state.Oy - state.ballSize / 2 > falseStatus.top.y1 && state.Oy + state.ballSize < falseStatus.bottom.y1 && state.Ox - state.ballSize / 2 > falseStatus.left.x1) {
            makeStep()
        } else if (state.Oy - state.ballSize / 2 > falseStatus.top.y1 && state.Oy + state.ballSize < falseStatus.bottom.y1 && state.Ox - state.ballSize / 2) {
            makeStepY();
        } else if (state.Ox - state.ballSize / 2 > falseStatus.left.x1) {
            makeStepX();
        }
    }
}

function startWatch() {
    state.watchID = navigator.accelerometer.watchAcceleration(function (acceleration) {
        state.Ox = (document.getElementById("picture").offsetLeft - acceleration.x);
        state.Oy = (document.getElementById("picture").offsetTop + acceleration.y);

        if ((state.Ox > 6 && state.Ox < screen.width) && (state.Oy > (screen.height - screen.width) / 2 && state.Oy < screen.height - (screen.height - screen.width) / 2)) {
            document.getElementById("picture").style.position = 'absolute';
            test();
        }
    }, onerror, { frequency: 30 });
}

function onError() {
    alert('onError!');
};


//чтение c json
function OnRequestStateChange() {
    if (state.request.readyState != 4)
        return;
    if (state.request.status != 200)
        return;
    if (state.request.readyState == 4) {
        state.str = eval('(' + state.request.responseText + ')');
    }
    state.statusSide = state.str.blocks;

    state.heghtInBlock = state.str.height; state.widthInBlock = state.str.width;
    state.radius = (screen.width - 10 / state.widthInBlock) > (screen.height / state.heghtInBlock) ? (screen.width / state.widthInBlock) : (screen.height / state.heghtInBlock);
    state.initY = (screen.height - state.heghtInBlock * state.radius) / 2;
}
//загрузка с файла лабиринта
function load() {
    state.request = new XMLHttpRequest();
    state.request.open("GET", "json/example.json", true);
    state.request.onreadystatechange = OnRequestStateChange;
    state.request.send(null);
}
//отрисовка
function draw_blocks() {
    if (!state.repeatGame) {
        var c = document.getElementById("play");
        c.parentNode.removeChild(c);
        state.repeatGame = true;
    }

    var b_canvas = document.getElementById("b");
    var b_context = b_canvas.getContext("2d");
    var count = 0;
    state.initY = (screen.height - state.heghtInBlock * state.radius) / 2+5;
    state.initX = 0;


    state.ballSize = document.getElementById("picture").height - 5;
    document.getElementById("picture").style.position = 'absolute';
    document.getElementById("picture").style.left = 10 + 'px';
    document.getElementById("picture").style.top = 190 + 'px';
    b_context.strokeStyle = "black";
    b_context.lineWidth = 7;
    state.initX = 0;

    for (var i = 0; i < state.heghtInBlock; i++) {

        for (var j = 0; j < state.widthInBlock; j++) {
            if (!state.table[count].left.status) {
                b_context.moveTo(state.initX, state.initY);
                b_context.lineTo(state.initX, state.initY + state.radius);
            }
            if (!state.table[count].right.status) {
                b_context.moveTo(state.initX + state.radius, state.initY);
                b_context.lineTo(state.initX + state.radius, state.initY + state.radius);
            }
            if (!state.table[count].top.status) {
                b_context.moveTo(state.initX, state.initY);
                b_context.lineTo(state.initX + state.radius, state.initY);
            }

            if (!state.table[count].bottom.status) {
                b_context.moveTo(state.initX, state.initY + state.radius);
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
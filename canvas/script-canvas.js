// Variables definition
let indexShape = 1;
let offsetX, offsetY;
let nbTable8 = 0;
let nbTable6 = 0; 
let nbTable4 = 0;
let nbTable2 = 0;
let nbChair = 0;
let nbArmchair = 0;
// DragNDropContainerShape
let dragNDropContainerWidth = 0;
let dragNDropContainerHeight = 0;
// data to store
let dataShapes = [];
// Drag and drop declaration
let isDragging = false;
let draggedShape = null;
const shapePlaceholder = document.getElementById('room-assets');

function createShape(type, index, attr) {
    const shape = document.createElement('div');
    shape.setAttribute('index', index);
    shape.className = 'shape ' + type;
    switch(type) {
        case 'table-8':
            shape.innerHTML = "<img src='assets/room-elements/table-8.svg' style='' alt='table'/>";
            shape.setAttribute('rotate', 0);
            nbTable8++;
            break;
        case 'table-6':
            shape.innerHTML = "<img src='assets/room-elements/table-6.svg' style='' alt='table'/>";
            shape.setAttribute('rotate', 0);
            nbTable6++;
            break;
        case 'table-4':
            shape.innerHTML = "<img src='assets/room-elements/table-4.svg' style='' alt='table'/>";
            shape.setAttribute('rotate', 0);
            nbTable4++;
            break;
        case 'table-2':
            shape.innerHTML = "<img src='assets/room-elements/table-2.svg' style='' alt='table'/>";
            shape.setAttribute('rotate', 0);
            nbTable2++;
            break;
        case 'chair':
            shape.setAttribute('rotate', 0);
            shape.innerHTML = "<img src='assets/room-elements/chair.svg' style='' alt='seat'/>";
            nbChair++;
            break;
        case 'armchair':
            shape.setAttribute('rotate', 0);
            shape.innerHTML = "<img src='assets/room-elements/armchair.svg' style='' alt='seat'/>";
            nbArmchair++;
            break;
        default:
            console.log(`Sorry, we are out of ${type}.`);
    }

    if (attr) {
        shape.style.top = attr.top + 'px';
        shape.style.left = attr.left + 'px';
    }

    shape.addEventListener('dragstart', handleDragStart);
    shape.addEventListener('dragend', handleDragEnd);
    shape.addEventListener('click', handleClick);

    shapePlaceholder.appendChild(shape);
}

function handleDragStart(e) {
    this.style.opacity = '0.4';
    isDragging = true;
    draggedShape = e.target.parentNode;
    offsetX = e.clientX - draggedShape.getBoundingClientRect().left;
    offsetY = e.clientY - draggedShape.getBoundingClientRect().top;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    draggedShape.style.left = newX + "px";
    draggedShape.style.top = newY + "px";
    isDragging = false;
    draggedShape = null;
}

function handleClick(e) {
    let nbRotate = this.getAttribute('rotate');
    let rotateValue =  checkDeg(Number(nbRotate)+1);
    this.setAttribute('rotate', rotateValue);
    this.style.transform = 'rotate('+checkRotate(rotateValue * 90)+'deg)';
}

function deleteShape(nbToDelete, cssClass) {
    let nbPositiveVal = nbToDelete+1;
    let shapesToDel = document.getElementsByClassName(cssClass);

    for (let i = 1; i < shapesToDel.length; i++) {
        if (i < nbPositiveVal) {
            shapesToDel[i].remove();
        }
    }
}

function initShapes() {
    const frame = localStorage.getItem("configframe");
    let thisContainerWidth = document.getElementById('room-config').offsetWidth;
    let thisContainerHeight = document.getElementById('room-config').offsetHeight;
    let previousSaving = JSON.parse(localStorage.getItem("shapesData"));
    let heightRatio, widthRatio;
    
    // if already saved values
    if (previousSaving && previousSaving.length > 0) {
        previousSaving.forEach(item => {
            initFrame(item.frame);
            heightRatio = thisContainerHeight / item.containerHeight;
            widthRatio = thisContainerWidth / item.containerWidth;

            createShape(item.type, item.id, {
                top: parseInt(item.top.replace('px', '')) * heightRatio,
                left: parseInt(item.left.replace('px', '')) * widthRatio
            });
        });
    } else {
        console.log(frame);
        initFrame(frame);
    }
}

function initInputs() {
    if (nbTable8 > 0) {
        document.getElementById('table-8').value = nbTable8;
    }
    if (nbTable6 > 0) {
        document.getElementById('table-6').value = nbTable6;
    }
    if (nbTable4 > 0) {
        document.getElementById('table-4').value = nbTable4;
    }
    if (nbTable2 > 0) {
        document.getElementById('table-2').value = nbTable2;
    }

    // bouton de creation des formes
    document.querySelectorAll('[id*=table-]').forEach(el => el.addEventListener('change', function (e) {
        let nbExistingTypeShapes = document.getElementsByClassName('shape '+this.id).length;
        let diff = e.target.value -  nbExistingTypeShapes;
            if ( diff > 0 ) {
            for (let i = 1; i < diff+1; i++) {
                let newIndex = nbExistingTypeShapes++;
                createShape(this.id, newIndex);
            }
        }
        else if (nbExistingTypeShapes > e.target.value) {
            deleteShape(nbExistingTypeShapes-e.target.value, 'shape '+this.id);
        }
    }));
}

function initFrame(frame) {
    console.log(frame);
    dragNDropContainerHeight = document.getElementById('canvas').offsetHeight;
    dragNDropContainerWidth = document.getElementById('canvas').offsetWidth;
    document.getElementById('canvas').classList.add(frame);
    //if frame = polygon
    if (frame === 'hexagon') {
        document.getElementsByClassName('canvas hexagon')[0].innerHTML = "<div class='hexagon-inner'></div>";
    }
}

const checkDeg = (n) => {
    if (n % 4 === 0) {
        return 0;
    } 
    return n;
};

const checkRotate = (n) => {
    if (n % 360 === 0) {
        return 0;
    } 
    return n;
};

document.addEventListener('DOMContentLoaded', () => {
    initShapes();
    initInputs();
});

document.getElementById('validateBtn').addEventListener('click', (event) => {
    const frame = localStorage.getItem('configframe');
    let shapeData = {};
    let positionedShapes = document.querySelectorAll('[class*=shape ]');
    localStorage.clear();

    for (let i = 0; i < positionedShapes.length; i++) {
        shapeData = {
            frame: frame,
            containerWidth: document.getElementById('room-config').offsetWidth,
            containerHeight: document.getElementById('room-config').offsetHeight,
            id: positionedShapes[i].getAttribute('index'),
            type: positionedShapes[i].className.replace('shape ',''),
            left: positionedShapes[i].style.left,
            top: positionedShapes[i].style.top,
          };
        dataShapes.push(shapeData);
    }

    const shapesDataJSON = JSON.stringify(dataShapes);
    localStorage.setItem("shapesData", shapesDataJSON);
    console.log("shapes data saved!");
});

document.getElementById('resetBtn').addEventListener('click', (event) => {
    localStorage.clear();
});

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

function createShape(type, index) {
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
    console.log('nbToDelete :',nbToDelete);
    let nbPositiveVal = nbToDelete+1;
    let shapesToDel = document.getElementsByClassName(cssClass);

    for (let i = 1; i < shapesToDel.length; i++) {
        if (i < nbPositiveVal) {
            console.log(i);
            shapesToDel[i].remove();
        }
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
    const frame = localStorage.getItem('configframe');
    const nbTableUser = localStorage.getItem('configtable');
    const nbSeatUser = localStorage.getItem('configseat');
    // set up values
    document.getElementById('canvas').classList.add(frame);
    document.getElementById('set-room').innerHTML = frame;
    document.getElementById('set-table').innerHTML = nbTableUser;
    document.getElementById('set-seat').innerHTML = nbSeatUser;
    dragNDropContainerHeight = document.getElementById('canvas').offsetHeight;
    dragNDropContainerWidth = document.getElementById('canvas').offsetWidth;

    //if frame = polygon
    if (frame === 'hexagon') {
        document.getElementsByClassName('canvas hexagon')[0].innerHTML = "<div class='hexagon-inner'></div>";
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


    document.getElementById('chair').addEventListener('change', (event) => {
        let diff = event.target.value - nbChair;
        if (nbChair < event.target.value) {
            for (let i = 1; i < diff+1; i++) {
                createShape('chair', nbChair);
            }
        } 
    });
    document.getElementById('armchair').addEventListener('change', (event) => {
        let diff = event.target.value - nbArmchair;
        if (nbArmchair < event.target.value) {
            for (let i = 1; i < diff+1; i++) {
                createShape('armchair', nbArmchair);
            }
        } 
    });
});

document.getElementById('validateBtn').addEventListener('click', (event) => {
    let positionedShapes = document.querySelectorAll('[class*=shape ]');
    
    for (let i = 0; i < positionedShapes.length; i++) {
        const shapeData = {
            frame: localStorage.getItem('configframe'),
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
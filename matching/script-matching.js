// Variables definition
let indexShape = 1;
let offsetX, offsetY;
let nbTable8 = 0;
let nbTable6 = 0; 
let nbTable4 = 0;
let nbTable2 = 0;
let nbChair = 0;
let nbArmchair = 0;
// data to store
let dataShapes = [];

const shapePlaceholder = document.getElementById('room-assets');
const previousSaving = JSON.parse(localStorage.getItem("shapesData"));

function createShape(type, index, attr) {
    const shape = document.createElement('div');
    shape.setAttribute('index', index);
    shape.className = 'shape ' + type;
    switch(type) {
        case 'table-8':
            shape.innerHTML = "<img src='assets/room-elements/table-8.svg' style='' alt='table 8 places'/>";
            shape.setAttribute('rotate', 0);
            shape.setAttribute('data-seats', 8);
            nbTable8++;
            break;
        case 'table-6':
            shape.innerHTML = "<img src='assets/room-elements/table-6.svg' style='' alt='table 6 places'/>";
            shape.setAttribute('rotate', 0);
            shape.setAttribute('data-seats', 6);
            nbTable6++;
            break;
        case 'table-4':
            shape.innerHTML = "<img src='assets/room-elements/table-4.svg' style='' alt='table 4 places'/>";
            shape.setAttribute('rotate', 0);
            shape.setAttribute('data-seats', 4);
            nbTable4++;
            break;
        case 'table-2':
            shape.innerHTML = "<img src='assets/room-elements/table-2.svg' style='' alt='table 2 places'/>";
            shape.setAttribute('rotate', 0);
            shape.setAttribute('data-seats', 2);
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

    shape.addEventListener('click', handleClick);

    shapePlaceholder.appendChild(shape);
}

function handleClick(e) {
    const index = this.getAttribute('index');
    let tableRefToDisplay = getPreviousIndex(index);
    let oldIndex = document.getElementById('table-oldValue');
    let nbSeats = this.getAttribute('data-seats');
    let tableRef = document.getElementById('table-ref');
    let tableMin = document.getElementById('table-from');
    let tableMax = document.getElementById('table-to');
    tableRef.disabled = false;
    tableMin.disabled = false;
    tableMax.disabled = false;
    oldIndex.value = this.getAttribute('index');
    tableRef.value = tableRefToDisplay;
    tableMin.value = getTableNumberMini(index, nbSeats);
    tableMax.value = getTableNumberMax(index, nbSeats);
}


function initShapes() {
    let thisContainerWidth = document.getElementById('room-config').offsetWidth;
    let thisContainerHeight = document.getElementById('room-config').offsetHeight;
    
    let heightRatio, widthRatio;
    
    if (previousSaving && previousSaving.length > 0) {
        previousSaving.forEach(item => {
            heightRatio = thisContainerHeight / item.containerHeight;
            widthRatio = thisContainerWidth / item.containerWidth;
            
            initFrame(item.frame);
            createShape(item.type, item.id, {
                top: parseInt(item.top.replace('px', '')) * heightRatio,
                left: parseInt(item.left.replace('px', '')) * widthRatio
            });
        });
    }
}

function initFrame(frame) {
    const canvas = document.getElementById('canvas');
    dragNDropContainerHeight = canvas.offsetHeight;
    dragNDropContainerWidth = canvas.offsetWidth;
    canvas.classList.add(frame);
    //if frame = polygon
    if (frame === 'hexagon') {
        document.getElementsByClassName('canvas hexagon')[0].innerHTML = "<div class='hexagon-inner'></div>";
    }
}

function getPreviousIndex(index) {
    let returnIndex = index;
    let previousIndex = previousSaving.find(element => element.id == returnIndex);

    return previousIndex.customerRef != undefined ? previousIndex.customerRef : index;
}

function getTableNumberMini(index, nbSeats) {
    let returnIndex = index;
    let objectSelected = previousSaving.find(element => element.id == returnIndex);

    return objectSelected.nbSeatsMini != undefined ? objectSelected.nbSeatsMini : nbSeats;
}

function getTableNumberMax(index, nbSeats) {
    let returnIndex = index;
    let objectSelected = previousSaving.find(element => element.id == returnIndex);

    return objectSelected.nbSeatsMax != undefined ? objectSelected.nbSeatsMax : nbSeats;
}

document.addEventListener('DOMContentLoaded', () => {
    initShapes();
    // initInputs();
});

document.getElementById('validateBtn').addEventListener('click', (event) => {
    const oldIndex = document.getElementById('table-oldValue');
    const customerRefEl = document.getElementById('table-ref');
    const nbSeatMiniEl = document.getElementById('table-from');
    const nbSeatsMaxEl = document.getElementById('table-to');
    let shapeValuetoChangeIndex = previousSaving.findIndex(element => element.id == oldIndex.value);
    previousSaving[shapeValuetoChangeIndex].customerRef = customerRefEl.value;
    previousSaving[shapeValuetoChangeIndex].nbSeatsMini = nbSeatMiniEl.value;
    previousSaving[shapeValuetoChangeIndex].nbSeatsMax = nbSeatsMaxEl.value;
    localStorage.clear();
    const shapesDataJSON = JSON.stringify(previousSaving);
    localStorage.setItem("shapesData", shapesDataJSON);
    console.log("shapes data saved!");
});

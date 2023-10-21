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


/**
 * Handles the drop event.
 *
 * @param {Event} e - The drop event.
 * @returns {void} This function does not return anything.
 */
function handleDrop(e) {
    e.preventDefault();
    if (!draggedShape) return console.warn('No shape is being dragged.');

    const { clientX, clientY } = e;
    const newX = clientX - offsetX;
    const newY = clientY - offsetY;

    Object.assign(draggedShape.style, {
        left: `${newX}px`,
        top: `${newY}px`,
    });
    
    isDragging = false;
    draggedShape = null;
}

/**
 * Handles the drag start event.
 *
 * @param {Object} e - The event object.
 * @return {undefined} No return value.
 */
function handleDragStart(e) {
    const { target } = e;
    draggedShape = target.parentNode;
    if (!draggedShape) {
        console.warn('No shape is being dragged.');
        return;
    }
    this.style.opacity = '0.4';
    isDragging = true;
    const { left, top } = draggedShape.getBoundingClientRect();
    offsetX = e.clientX - left;
    offsetY = e.clientY - top;
}

/**
 * Handles the end of a drag event.
 *
 * @param {Event} e - The drag event object.
 * @return {undefined} This function does not return anything.
 */
function handleDragEnd(e) {
    if (!draggedShape) {
        console.warn('No shape is being dragged.');
        return;
    }

    this.style.opacity = '1';
    const { offsetX, offsetY, clientX, clientY } = e;
    const newX = clientX - offsetX;
    const newY = clientY - offsetY;
    const style = draggedShape.style;
    style.left = `${newX}px`;
    style.top = `${newY}px`;
    style.position = 'fixed';
    draggedShape = null;
}

/**
 * Handles the click event.
 *
 * @param {Event} e - The click event object.
 * @return {void} This function does not return anything.
 */
function handleClick(e) {
    const nbRotate = Number(this.getAttribute('rotate'));
    const rotateValue = checkDeg(nbRotate + 1);
    this.setAttribute('rotate', rotateValue);
    this.style.transform = `rotate(${checkRotate(rotateValue * 90)}deg)`;
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

/**
 * Initializes the inputs for the page.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function initInputs() {
    const toggleConfig = document.getElementById('toggleConfig');
    const config = document.getElementById('config');
    const roomConfig = document.getElementById('room-config');
    const table8 = document.getElementById('table-8');
    const table6 = document.getElementById('table-6');
    const table4 = document.getElementById('table-4');
    const table2 = document.getElementById('table-2');

    toggleConfig.addEventListener('click', function (e) {
        config.style.display = this.checked ? 'block' : 'none';
        roomConfig.style.width = this.checked ? '80%' : '99%';
    });

    if (nbTable8 > 0) {
        table8.value = nbTable8;
    }
    if (nbTable6 > 0) {
        table6.value = nbTable6;
    }
    if (nbTable4 > 0) {
        table4.value = nbTable4;
    }
    if (nbTable2 > 0) {
        table2.value = nbTable2;
    }

    document.querySelectorAll('[id*=table-]').forEach(el => el.addEventListener('change', function (e) {
        const nbExistingTypeShapes = document.getElementsByClassName('shape ' + this.id).length;
        const diff = e.target.value - nbExistingTypeShapes;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                const newIndex = nbExistingTypeShapes + i;
                createShape(this.id, newIndex);
            }
        } else if (nbExistingTypeShapes > e.target.value) {
            deleteShape(nbExistingTypeShapes - e.target.value, 'shape ' + this.id);
        }
    }));
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
    initShapes('canvas');
    initInputs();
});

document.getElementById('validateBtn').addEventListener('click', (event) => {
    const frame = localStorage.getItem('configframe');
    localStorage.setItem("shapesData", jsonStringifyShapes(frame));
    console.log("shapes data saved!");
    window.location.href = './../matching/';
});

document.getElementById('resetBtn').addEventListener('click', (event) => {
    localStorage.clear();
    window.location.href = './../index.html';
});
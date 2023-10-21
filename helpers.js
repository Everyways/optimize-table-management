/**
 * Creates a shape element based on the provided parameters and adds it to the shapePlaceholder element.
 *
 * @param {string} from - The source of the shape creation. Can be 'canvas' or any other value.
 * @param {string} type - The type of shape to create. Can be 'table-8', 'table-6', 'table-4', 'table-2', 'chair', or 'armchair'.
 * @param {number} index - The index of the shape.
 * @param {object} attr - Additional attributes for the shape element.
 * @param {number} attr.top - The top position of the shape element.
 * @param {number} attr.left - The left position of the shape element.
 * @return {void}
 */
function createShape(from, type, index, attr) {
    const shape = document.createElement('div');
    shape.setAttribute('index', index);
    shape.className = `shape ${type}`;
    
    let imageSrc;
    let dataSeats;
    
    switch(type) {
        case 'table-8':
            imageSrc = 'assets/room-elements/table-8.svg';
            dataSeats = 8;
            break;
        case 'table-6':
            imageSrc = 'assets/room-elements/table-6.svg';
            dataSeats = 6;
            break;
        case 'table-4':
            imageSrc = 'assets/room-elements/table-4.svg';
            dataSeats = 4;
            break;
        case 'table-2':
            imageSrc = 'assets/room-elements/table-2.svg';
            dataSeats = 2;
            break;
        case 'chair':
            imageSrc = 'assets/room-elements/chair.svg';
            dataSeats = 1;
            break;
        case 'armchair':
            imageSrc = 'assets/room-elements/armchair.svg';
            break;
        default:
            console.log(`Sorry, we are out of ${type}.`);
    }
    
    shape.innerHTML = `<img src='${imageSrc}' style='' alt='table' />`;
    shape.setAttribute('rotate', 0);
    shape.setAttribute('data-seats', dataSeats);
    
    if (type === 'table-8') {
        nbTable8++;
    } else if (type === 'table-6') {
        nbTable6++;
    } else if (type === 'table-4') {
        nbTable4++;
    } else if (type === 'table-2') {
        nbTable2++;
    } else if (type === 'chair') {
        nbChair++;
    } else if (type === 'armchair') {
        nbArmchair++;
    }

    if (attr) {
        shape.style.top = `${attr.top}px`;
        shape.style.left = `${attr.left}px`;
        shape.style.position = 'fixed';
    }

    if (from === 'canvas') {
        shape.draggable = true;
        shape.addEventListener('dragstart', handleDragStart);
        shape.addEventListener('dragend', handleDragEnd);
    }
    
    shape.addEventListener('click', handleClick);

    shapePlaceholder.appendChild(shape);
}

/**
 * Generates a JSON string representation of the shapes in the given frame.
 *
 * @param {Object} frame - The frame object containing the shapes.
 * @return {string} A JSON string representing the shapes.
 */
function jsonStringifyShapes(frame) {
    if (!frame) {
        console.warn('No frame set.');
        return;
    }

    let shapeData = [];
    const container = document.getElementById('room-config');
    const positionedShapes = document.querySelectorAll('[class*=shape ]');

    for (let i = 0; i < positionedShapes.length; i++) {
        const positionedShape = positionedShapes[i];
        const id = positionedShape.getAttribute('index');
        const type = positionedShape.className.replace('shape ','');
        const left = positionedShape.style.left;
        const top = positionedShape.style.top;
        
        shapeData.push({
            frame: frame,
            containerWidth: container.offsetWidth,
            containerHeight: container.offsetHeight,
            id,
            type,
            left,
            top,
        });
    }

    return JSON.stringify(shapeData);
}

/**
 * Initializes the shapes based on previous saved data and the provided 'from' parameter.
 *
 * @param {type} from - description of the 'from' parameter
 * @return {type} description of the return value
 */
function initShapes(from) {
    const frame = localStorage.getItem('configframe');
    const roomConfig = document.getElementById('room-config');
    const canvas = document.getElementById('canvas');
    const previousSaving = JSON.parse(localStorage.getItem("shapesData"));

    let thisContainerWidth = roomConfig.offsetWidth;
    let thisContainerHeight = roomConfig.offsetHeight;
    let heightRatio, widthRatio;
    
    if (previousSaving && previousSaving.length > 0) {
        previousSaving.forEach(item => {
            heightRatio = thisContainerHeight / item.containerHeight;
            widthRatio = thisContainerWidth / item.containerWidth;
            initFrame(item.frame);
            createShape(from, item.type, item.id, {
                top: parseInt(item.top.replace('px', '')) * heightRatio,
                left: parseInt(item.left.replace('px', '')) * widthRatio
            });
        });
    }

    if(canvas.classList.contains('null')) {
        initFrame(frame);
    }
}

/**
 * Initializes the frame of the canvas.
 *
 * @param {string} frame - The class name of the frame to be initialized.
 * @return {void} This function does not return a value.
 */
function initFrame(frame) {
    const canvas = document.getElementById('canvas');
    dragNDropContainerHeight = canvas.offsetHeight;
    dragNDropContainerWidth = canvas.offsetWidth;
    canvas.classList.add(frame);
    if (frame === 'hexagon') {
        const hexagonInner = document.createElement('div');
        hexagonInner.className = 'hexagon-inner';
        document.querySelector('.canvas.hexagon').innerHTML = '';
        document.querySelector('.canvas.hexagon').appendChild(hexagonInner);
    }
}

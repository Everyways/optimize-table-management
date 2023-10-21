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


/**
 * Handles the click event.
 *
 * @param {Event} e - The click event.
 */
function handleClick(e) {
  const index = this.getAttribute('index');
  const tableRefToDisplay = getPreviousIndex(index);
  const oldIndex = document.getElementById('table-oldValue');
  const nbSeats = this.getAttribute('data-seats');
  const tableRef = document.getElementById('table-ref');
  const tableMin = document.getElementById('table-from');
  const tableMax = document.getElementById('table-to');

  tableRef.disabled = false;
  tableMin.disabled = false;
  tableMax.disabled = false;
  oldIndex.value = index;
  tableRef.value = tableRefToDisplay;
  tableMin.value = getTableNumberMini(index, nbSeats);
  tableMax.value = getTableNumberMax(index, nbSeats);
}

/**
 * Returns the previous index of an element in the `previousSaving` array based on the provided `index`.
 *
 * @param {number} index - The index of the element.
 * @return {number} The previous index of the element, or the provided index if it does not exist in the `previousSaving` array.
 */
function getPreviousIndex(index) {
    const previousIndex = previousSaving.find(element => element.id === index);

    return previousIndex?.customerRef ?? index;
}

/**
 * Returns the number of seats for a table.
 *
 * @param {number} index - The index of the table.
 * @param {number} nbSeats - The default number of seats for the table.
 * @return {number} - The number of seats for the table.
 */
function getTableNumberMini(index, nbSeats) {
    let returnIndex = index;
    let objectSelected = previousSaving.find(element => element.id == returnIndex);

    return objectSelected.nbSeatsMini != undefined ? objectSelected.nbSeatsMini : nbSeats;
}

/**
 * Retrieves the maximum number of seats for a table based on the given index.
 *
 * @param {number} index - The index of the table.
 * @param {number} nbSeats - The default number of seats for the table.
 * @return {number} The maximum number of seats for the table.
 */
function getTableNumberMax(index, nbSeats) {
    let returnIndex = index;
    let objectSelected = previousSaving.find(element => element.id == returnIndex);

    return objectSelected.nbSeatsMax != undefined ? objectSelected.nbSeatsMax : nbSeats;
}

document.addEventListener('DOMContentLoaded', () => {
    initShapes('matching');
    document.getElementById('toggleConfig').addEventListener('click', function (e) {
        if (this.checked) {
            document.getElementById('config').style.display = 'block';
            document.getElementById('room-config').style.width = '80%';
        } else {
            document.getElementById('config').style.display = 'none';
            document.getElementById('room-config').style.width = '99%';
        }
    });
});

document.getElementById('validateMatching').addEventListener('click', (event) => {
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

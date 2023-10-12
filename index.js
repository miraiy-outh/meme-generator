const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.querySelector('.image-input');
const addButton = document.querySelector('.add-text__button');
const textsContainer = document.querySelector('.texts__container');

let textId = 0; // ID текстового поля.
let changedImage = undefined;
let texts = []; // Массив с параметрами текстовых полей.

// Добавление объекта с полями по умолчанию.
function addTextObject(id) {
    texts.push({
        id: id,
        font: 'Arial',
        color: '#000000',
        size: 24,
        text: 'Введите текст',
        x: canvas.width / 2,
        y: canvas.height / 2
    })
}

// Отрисовка холста при изменении параметров.
function render() {
    console.log(texts)
    const image = new Image();
    image.src = changedImage.src;
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        texts.forEach((text) => {
            ctx.font = `${text.size}px ${text.font}`;
            ctx.fillStyle = text.color;
            ctx.fillText(text.text, text.x, text.y);
        });
    };
}

// Сохранение картинки.
const saveButton = document.querySelector('.save__button');
saveButton.addEventListener('click', saveCanvasAsImage);

function saveCanvasAsImage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'image.png';
    link.click();
}

// Перемещение текста по холсту.
let isDragging = false;
let dragStartX, dragStartY;
let selectedText = null;

// Получение позиции мыши.
function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

// Определение текста, на который нажали.
canvas.addEventListener('mousedown', function (event) {
    const mousePos = getMousePos(canvas, event);
    texts.forEach((text) => {
        ctx.font = `${text.size}px ${text.font}`;
        const textWidth = ctx.measureText(text.text).width;
        const textHeight = text.size;
        if (mousePos.x > text.x - textWidth && mousePos.x < text.x + textWidth &&
            mousePos.y > text.y - textHeight && mousePos.y < text.y + textHeight) {
            isDragging = true;
            dragStartX = mousePos.x;
            dragStartY = mousePos.y;
            selectedText = text;
        }
    });
});

// Перемещение текста.
canvas.addEventListener('mousemove', function (event) {
    if (isDragging) {
        const mousePos = getMousePos(canvas, event);
        const deltaX = mousePos.x - dragStartX;
        const deltaY = mousePos.y - dragStartY;
        selectedText.x += deltaX;
        selectedText.y += deltaY;
        dragStartX = mousePos.x;
        dragStartY = mousePos.y;
        render();
    }
});

canvas.addEventListener('mouseup', function (event) {
    isDragging = false;
});

// Изменение параметров текстового поля.
function changeFont(event) {
    let changedFont = event.target.value;
    let fontId = event.target.id[event.target.id.length - 1];
    texts[fontId].font = changedFont;
    render();
}

function changeColor(event) {
    let changedColor = event.target.value;
    let colorId = event.target.id[event.target.id.length - 1];
    texts[colorId].color = changedColor;
    render();
}

function changeSize(event) {
    let changedSize = event.target.value;
    let sizeId = event.target.id[event.target.id.length - 1];
    texts[sizeId].size = changedSize;
    render();
}

function changeText(event) {
    let changedText = event.target.value;
    let textId = event.target.id[event.target.id.length - 1];
    texts[textId].text = changedText;
    render();
}

// Добавление картинки на холст.
imageInput.addEventListener('change', function (event) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    texts.length = 0;
    textId = 0;
    while (textsContainer.firstChild) {
        textsContainer.firstChild.remove();
    }

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const image = new Image();
        image.src = event.target.result;
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            changedImage = image;
            render();
        };
    };
    reader.readAsDataURL(file);
});

// Добавление полей для изменения параметров текстового поля.
addButton.addEventListener('click', function (event) {
    const textItem = document.createElement('div');
    textItem.classList.add('text__item');

    const settingsContainer = document.createElement('div');
    settingsContainer.classList.add('settings__container');

    const fontLabel = document.createElement('p');
    fontLabel.textContent = 'Шрифт:';

    const select = document.createElement('select');
    select.classList.add('font-select');
    select.id = `select${textId}`;

    const option1 = document.createElement('option');
    option1.value = 'Arial';
    option1.textContent = 'Arial';
    option1.style.fontFamily = 'Arial';

    const option2 = document.createElement('option');
    option2.value = 'Impact';
    option2.textContent = 'Impact';
    option2.style.fontFamily = 'Impact';

    const option3 = document.createElement('option');
    option3.value = 'Lobster';
    option3.textContent = 'Lobster';
    option3.style.fontFamily = 'Lobster';

    const option4 = document.createElement('option');
    option4.value = 'Fixedsys';
    option4.textContent = 'Fixedsys';
    option4.style.fontFamily = 'Fixedsys';

    const option5 = document.createElement('option');
    option5.value = 'UniSans';
    option5.textContent = 'UniSans';
    option5.style.fontFamily = 'UniSans';

    const labelColor = document.createElement('label');
    labelColor.htmlFor = 'colorPicker';
    labelColor.textContent = 'Цвет:';

    const inputColor = document.createElement('input');
    inputColor.type = 'color';
    inputColor.classList.add('color-picker');
    inputColor.name = 'colorPicker';
    inputColor.id = `color${textId}`;

    const labelSize = document.createElement('label');
    labelSize.htmlFor = 'textSize';
    labelSize.textContent = 'Размер:';

    const inputSize = document.createElement('input');
    inputSize.type = 'text';
    inputSize.classList.add('text-size');
    inputSize.name = 'textSize';
    inputSize.id = `size${textId}`;

    const inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.classList.add('text');
    inputText.id = `text${textId}`;

    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);
    select.appendChild(option4);
    select.appendChild(option5);

    settingsContainer.appendChild(fontLabel);
    settingsContainer.appendChild(select);
    settingsContainer.appendChild(labelColor);
    settingsContainer.appendChild(inputColor);
    settingsContainer.appendChild(labelSize);
    settingsContainer.appendChild(inputSize);

    textItem.appendChild(settingsContainer);
    textItem.appendChild(inputText);
    textsContainer.appendChild(textItem);

    select.addEventListener('change', changeFont);
    inputColor.addEventListener('change', changeColor);
    inputSize.addEventListener('change', changeSize);
    inputText.addEventListener('change', changeText);

    addTextObject(textId);
    render();
    textId++;
});
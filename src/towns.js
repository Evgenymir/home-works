/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
const loadTowns = () => {
    return promiseCity = new Promise( (resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.responseType = 'json';

        xhr.addEventListener('load', () => {
            if(xhr.status >= 400) {
                loadingBlock.innerText = 'Не удалось загрузить города';
                button.style.display = 'block';

            } else {
                loadingBlock.innerHTML = '';
                filterBlock.style.display = 'block';

                resolve(xhr.response.sort((one, two) => {
                    if(one.name > two.name) {
                      return 1;
                    }

                    if(one.name < two.name) {
                      return -1;
                    }

                    return 0;
                }));
            }
        });

        xhr.send();
    });
};

const button = document.createElement("button");

button.innerText = "Повторить загрузку...";
button.style.marginTop = '10px';
button.style.display = 'none';
button.onclick = loadTowns;

homeworkContainer.appendChild(button);

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
const isMatching = (full, chunk) => {
    if(full.toLowerCase().indexOf(chunk.toLowerCase()) > -1) {
        return true;
    } else {
        return false;
    }
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let promiseCity;
let cities = [];


loadTowns()
    .then(result => {
        cities = result;
        loadingBlock.style.display = 'none';
        filterBlock.style.display = 'block';
    });

filterInput.addEventListener('keyup', function() {
    const documentFragment = document.createDocumentFragment();
    filterResult.innerHTML = '';

    if(filterInput.value == '') {
        return;
    }

    cities
        .map(item => item.name)
        .filter(city => isMatching(city, filterInput.value))
        .forEach(city => {
            const p = document.createElement('p');

            p.innerHTML = city;
            documentFragment.appendChild(p);
        });
    
    if (documentFragment.children.length) {
        filterResult.appendChild(documentFragment);
    }
});

export {
    loadTowns,
    isMatching
};

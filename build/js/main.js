const templatePartial = document.querySelector('#reviews-list');
Handlebars.registerPartial('reference',templatePartial.innerHTML);

// Получение координат пользователя
const userPosition = new Promise((resolve,reject) => {
    let currentPosition = [55.75302590638416, 37.62226466137695];

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
            currentPosition = [position.coords.latitude, position.coords.longitude];
            resolve(currentPosition);
        }, (error) => {reject(error)})
    } else {
        resolve(currentPosition);
    }
});

userPosition.then((position) => {
    let config = {
        center: position,
        zoom: 13
    };

    // Инициализация карты
    ymaps.ready(init);

    function init() {
        let myMap = new ymaps.Map('map', config),

            // Собственный балун, который всплывает при клике на карту и одиночную метку
            BalloonLayout = ymaps.templateLayoutFactory.createClass(
                `<div class="popup">
                    <div class="popup__close">
                        <div class="popup__close-line"></div>
                        <div class="popup__close-line"></div>
                    </div>
                    <div class="popup__header">
                        <div class="popup__header-text">
                            <p>{{properties.placemarkData.address|default: address}}</p>
                        </div>
                    </div>
                    
                    <div class="popup__body">
                        <div class="popup__reviews">
                            <ul class="popup__reviews-list">
                                {% include options.contentLayout %}
                            </ul>
                        </div>
                        <form class="form" action="" method="POST" enctype="multipart/form-data">
                            <div class="form__title">Ваш отзыв</div>
                            <div class="form__error">
                                Заполните все поля
                            </div>
                            <input type="text" name="name" placeholder="Ваше имя">
                            <input type="text" name="place" placeholder="Укажите место">
                            <textarea name="comment" placeholder="Поделитесь впечатлениями"></textarea>
                            <div class="form__button-wrap">
                                <button type="button" class="button form__button">Добавить</button>
                            </div>
                        </form>
                    </div>
                </div>`,{

                    // Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент
                    build(){
                        this.constructor.superclass.build.call(this);

                        let closeButton = document.querySelector('.popup__close'),
                            addButton = document.querySelector('.form__button');

                        // Добаляем прослушку кликов на кнопку "Добавить" отзыв и на кнопку закрытия баллуна
                        addButton.addEventListener('click', this.onAddReference.bind(this));
                        closeButton.addEventListener('click', this.onCloseBtnClick.bind(this));
                    },

                    // Удаляет содержимое макета из DOM и отписывает прослушку событий на кнопках баллуна
                    clear(){
                        let closeButton = document.querySelector('.popup__close'),
                            addButton = document.querySelector('.form__button');

                        addButton.removeEventListener('click', this.onAddReference);
                        closeButton.removeEventListener('click', this.onCloseBtnClick);
                        this.constructor.superclass.clear.call(this);
                    },

                    // Закрывает баллун при клике на крестик, кидая событие "userclose" на макете
                    onCloseBtnClick(e){
                        this.events.fire('userclose');
                    },

                    // Обработчик события нажатия на кнопку "Добавить" баллуна
                    onAddReference(e){
                        let name = document.querySelector('input[name=name]'),
                            place = document.querySelector('input[name=place]'),
                            text = document.querySelector('textarea[name=comment]'),
                            refList = document.querySelector('.popup__reviews-list'),
                            inputError = document.querySelector('.form__error');

                        e.preventDefault();

                        // Проверка полей формы
                        if (name.value && place.value && text.value){
                            inputError.classList.remove('error');
                            let template = Handlebars.compile(templatePartial.innerHTML),
                                ymapsElem =  refList.firstElementChild.firstElementChild,
                                coords = this.getData().properties? this.getData().properties.getAll().placemarkData.coords : this.getData().coords,
                                address = this.getData().properties? this.getData().properties.getAll().placemarkData.address : this.getData().address,
                                today = new Date(),
                                date, myPlacemark, placemarkData;

                            // Формируем представление даты и времени добавления отзыва
                            date = `${checkDateContent(today.getDate())}.${checkDateContent(today.getMonth() + 1)}.${today.getFullYear()}`;

                            // Формируем объект с значениями всех полей, датой и координатами
                            placemarkData = {
                                coords: coords,
                                address: address,
                                name: name.value,
                                place: place.value,
                                date: date,
                                reference: text.value
                            };

                            // Добавляем объект placemarkData в массив, где хранятся все отзывы
                            data.push(placemarkData);
                            //Очищаем поля
                            name.value = place.value = text.value = '';
                            // Добавляем вновь добавленный отзыв в поле для отзывов баллуна
                            if (ymapsElem.firstElementChild) {
                                ymapsElem.innerHTML += template(placemarkData);
                            } else {
                                ymapsElem.innerHTML = template(placemarkData);
                            }
                            // Прокручиваем вниз поле для отзывов баллуна к новому отзыву
                            refList.scrollTop = refList.scrollHeight;
                            // Создаем новый геообъект Placemark с данными из объекта placemarkData
                            myPlacemark = this.onCreatePlacemark.call(this,placemarkData);
                            // И записываем его в кластер
                            clusterer.add(myPlacemark);
                            // Выводим/добавляем кластер на карту
                            myMap.geoObjects.add(clusterer);
                        } else {
                            inputError.classList.add('error');
                        }
                    },

                    // Создание нового геообъекта типа "метка"
                    onCreatePlacemark(placemarkData) {
                        return new ymaps.Placemark(placemarkData.coords, {
                            placemarkData: placemarkData
                        }, {
                            iconLayout: 'default#image',
                            iconImageHref: '../img/mark.png',
                            iconImageSize: [44, 66],
                            iconImageOffset: [-25, -60],
                            balloonLayout: BalloonLayout,
                            balloonContentLayout: BalloonContentLayout,
                            balloonPanelMaxMapArea: 0
                        });
                    }
                }
            ),

            // Создание собственного макета для содержимого баллуна, вcплывающего при клике на карту и одиночную метку
            BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                `{% if properties.placemarkData %}
                <li class="popup__reviews-item">
                    <p class="popup__reviews-title">
                        <strong>{{properties.placemarkData.name}}</strong> 
                        {{properties.placemarkData.place}} 
                        <span>{{properties.placemarkData.date}}</span>
                    </p>
                    <p class="popup__reviews-text">
                        {{properties.placemarkData.reference}}
                    </p>
                </li>
                {% endif %}
                {% if content %}
                    {{content|raw}}
                {% endif %}`
            ),

            // Создание собственного макета содержимого баллуна, вплывающего при клике на кластеризатор
            customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                `<div class="clusterBalloon">
                    <div class="clusterBalloon__title">{{properties.placemarkData.place}}</div>
                    <a href="#" class="clusterBalloon__addressLink">{{properties.placemarkData.address}}</a>
                    <div class="clusterBalloon__body">{{properties.placemarkData.reference}}</div>
                    <div class="clusterBalloon__footer">{{properties.placemarkData.date}}</div>
                </div>`,
                {
                    build(){
                        this.constructor.superclass.build.call(this);
                        let link = document.querySelector('.clusterBalloon__addressLink');
                        // Слушаем клик по ссылке
                        link.addEventListener('click', this.onLinkClick.bind(this))
                    },

                    clear(){
                        let link = document.querySelector('.clusterBalloon__addressLink');
                        link.removeEventListener('click', this.onLinkClick);
                        this.constructor.superclass.clear.call(this);
                    },

                    // Обработчик события клика по ссылке адреса, где был размещен отзыв
                    onLinkClick(e){
                        let coords = this.getData().properties.getAll().placemarkData.coords,
                            source = document.querySelector("#referenceTemplate").innerHTML,
                            template = Handlebars.compile(source),
                            foundPlacemarks = [];

                        e.preventDefault();
                        // Находим все отзывы по адресу, по которому кликнули на ссылке
                        foundPlacemarks = data.filter((placemark) => {
                            return (coords[0] === placemark.coords[0] && coords[1] === placemark.coords[1])
                        });
                        // Открываем новый баллун со всеми отзывами по указанному адресу
                        myMap.balloon.open(coords,{
                            coords: coords,
                            address: foundPlacemarks[0].address,
                            content: template({list: foundPlacemarks})
                        },{
                            layout: BalloonLayout,
                            contentLayout: BalloonContentLayout
                        });
                        // Зарываем баллун кластеризатора
                        this.events.fire('userclose');
                    }
                }
            ),

            // Создание кластеризатора
            clusterer = new ymaps.Clusterer({
                preset: 'islands#invertedVioletClusterIcons',
                gridSize: 128,
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: true,
                // Используем макет "карусель"
                clusterBalloonContentLayout: "cluster#balloonCarousel",
                // Запрещаем зацикливание списка при постраничной навигации
                clusterBalloonCycling: false,
                // Настройка внешнего вида панели навигации. Элементами панели навигации будут маркеры
                clusterOpenBalloonOnClick: true,
                // Устанавливаем собственный макет
                clusterBalloonItemContentLayout: customItemContentLayout,
                // Устанавливаем режим открытия баллуна: баллун никогда не будет открываться в режиме панели
                clusterBalloonPanelMaxMapArea: 0
            }),

            // Правильный формат даты и времени
            checkDateContent = (source) => {
                return (source < 10)? '0'+ source : source.toString();
            },

            data = [];


        // Клик на карте
        myMap.events.add('click', (e) => {
            let coords = e.get('coords');

            ymaps.geocode(coords).then((res) => {
                let object = res.geoObjects.get(0),
                    address = object.properties.get('text');

                myMap.balloon.open(coords,{
                    coords: coords,
                    address: address,
                    content: 'Отзывов пока нет...'
                },{
                    layout: BalloonLayout,
                    contentLayout: BalloonContentLayout
                });
            });
        });
    }
}).catch((error) => {alert(error.message)}); // Ели есть ошибка, то выведем ее.

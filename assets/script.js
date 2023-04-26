var buttonEl = document.querySelector('button');
var cityInput = document.querySelector('input');
var searchCity = document.querySelector('ul');
var cityArray = [];

//search button
buttonEl.addEventListener('click', function (event) {
    event.preventDefault();

    var city = {
        name: cityInput.value
    };

    cityArray.push(city);

    localStorage.setItem('local-cityArray', JSON.stringify(cityArray));

    renderCity();
    console.log(cityInput.value);
    weatherFetch(cityInput.value);
});

//local storage
function getCity() {
    var storedCity = JSON.parse(localStorage.getItem('local-cityArray'));

    if (storedCity !== null) {
        cityArray = storedCity;
    } else {
        return;
    }
    renderCity();
}

getCity();

function renderCity() {
    searchCity.innerHTML = '';

    for (var i = 0; i < cityArray.length; i++) {
        var city = cityArray[i];

        var listEL = document.createElement('li');
        var aEl = document.createElement('a');
        aEl.textContent = city.name;
        searchCity.appendChild(listEL);
        listEL.appendChild(aEl);
        aEl.addEventListener('click', function(event){
            weatherFetch(this.innerHTML);
        });
    }

}

cityInput.addEventListener('click', function (event) {
    cityInput.value = '';
})

//fetch from api
function weatherFetch(cityName) {
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=6167295a2c379d9bdaca3c06a5ade77e`
    console.log(requestUrl);
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (coords) {
            var lat = coords[0].lat;
            var lon = coords[0].lon;
            var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6167295a2c379d9bdaca3c06a5ade77e`

            fetch(requestUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    console.log(data.city.name); 
                    console.log(data.list[0].dt_txt); 
                    console.log(data.list[0].weather[0].icon); 
                    console.log(data.list[0].main.temp); 
                    console.log(data.list[0].wind.speed);
                    console.log(data.list[0].main.humidity); 

                    var currentHeader = document.querySelector('.current h4');
                    currentHeader.textContent = data.city.name + ' ' + dayjs(data.list[0].dt_txt).format('M/DD/YYYY');

                    var currentIcon = document.querySelector('#icon');
                    currentIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.list[0].weather[0].icon + '@2x.png')
                    
                    var currentTemp = document.querySelector('.current .item1');
                    currentTemp.textContent = 'Temp: ' + ((data.list[0].main.temp - 273.15)*9/5+32).toFixed(2) + '°F';

                    var currentWind = document.querySelector('.current .item2');
                    currentWind.textContent = 'Wind: ' + data.list[0].wind.speed + ' ' + 'MPH';

                    var currentHumid = document.querySelector('.current .item3');
                    currentHumid.textContent = 'Humidity: ' + data.list[0].main.humidity + '%';
                    
                    var fiveDayForecast = [];

                    for (var i = 6; i < data.list.length; i += 8) {
                        fiveDayForecast.push(data.list[i]);
            
                    }
                    console.log(fiveDayForecast);
                })
        })

}
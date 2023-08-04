const timeEl=document.getElementById('time');
const dateEl=document.getElementById('date');
const currentWeatherItemsEl=document.getElementById('current-weather-items');
const timezone=document.getElementById('time-zone');
const countryEl=document.getElementById('country');
const weatherForecastEl=document.getElementById('weather-forecast');
const currentTempEl=document.getElementById('current-temp');

const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const months=['jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const API_KEY='824de0122f87b64b9f763e879ae25511';
setInterval(() => {
    const time=new Date();
    const month=time.getMonth();
    const date = time.getDate();
    const day =time.getDay();
    const hour=time.getHours();
    const hoursIn12HrFormat=hour >= 13 ? hour %12: hour
    const minutes=time.getMinutes();
    const ampm=hour >=12 ? 'Pm' : 'Am'
    
    timeEl.innerHTML = hoursIn12HrFormat + ':' + minutes+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML=days[day] + ',' + date+ ' ' + months[month]
}, 1000);

getWeatherData()
function getWeatherData ()  {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let{ latitude,longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=mrtric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })
}

function showWeatherData(data){
    let {humidity,pressure,sunrise,sunset,wind_speed}=data.current;

    currentWeatherItemsEl.innerHTML=  
    `<div class="weather-item">
    <div>Humidity</div>
<div>${humidity}</div>
</div>
<div class="weather-item">
    <div>Pressure</div>
<div>${pressure}</div>
</div>
<div class="weather-item">
    <div>Wind Speed</div>
<div>${wind_speed}</div>
</div>`;


let otherDayForcast = ''
data.daily.foreach((day,idx) =>{
    if(idx==0){
        currentTempEl.innerHTML`
        
        <img src=" https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
        <div class="temp">Night-${day.temp.night}&#176;C</div>
        <div class="temp">Day-${day.temp.day}&#176;C</div>
        </div>
        `
    }else{
        otherDayForcast +=`
        <div class="weather-forecast-item">
        <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
        <img src=" https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
    <div class="temp">Night-${day.temp.night}&#176;C</div>
    <div class="temp">Day-${day.temp.day}&#176;C</div>
    </div>
    `
    }
})

weatherForecastEl.innerHTML=otherDayForcast;
}
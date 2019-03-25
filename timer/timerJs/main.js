






const btns = document.querySelectorAll('[data-time]');
const input = document.querySelector('input');
const form = document.querySelector('form');
// Получаем кнопки и сабмит по классам и дата-атрибутам

const timer = (function() {/*Определяем общие переменные для нашего таймера*/
	let countDown,
		timerDisplay,
		endTime,
		alarmSound;

	function init(settings){/*Получаем настройки и определяем их. Это общий метод для запуска/инициализации модулей*/
		timerDisplay = document.querySelector(settings.timeLeftSelector);
		endTime = document.querySelector(settings.timeEndSelector);
		if(settings.alarmSound){/*Проверяем настройку звука*/
			alarmSound = new Audio(settings.alarmSound);
		} return this;
	};

	function start(sec){
		if(!timerDisplay || !endTime){
			return console.log('Please init module first')
		};
		if(!sec || typeof sec !== 'number'){
			return console.log('Please provide seconds')
		};
		clearInterval(countDown);
		alarmSound.pause();
		alarmSound.currentTime = 0;
		const now = Date.now();//Получили текущее воемя в милисекундах
		const then = now + sec * 1000;/*Получили время окончания таймера в секундах, прибавив
		 к текущей дате переданное значение и умножив на 1000 чтоб получить милисекунды*/
		displayTimeLeft(sec);
		displayEndTime(then);/*Передаем время окончания в функцию displayEndTime*/


		countDown = setInterval(() => {
			const secondLeft = Math.round((then - Date.now()) / 1000);
			if(secondLeft < 0){
				clearInterval(countDown);
				playSound();
				return
			}
			displayTimeLeft(secondLeft);
		}, 1000);
	};

	function displayTimeLeft(sec){
		const minutes = Math.floor(sec / 60);
		const remindeSeconds = sec % 60;
		const hour = Math.floor(minutes / 60);
		const remindminutes = minutes % 60;
		const days = Math.floor(hour / 24);
		const remindHour = hour % 24;
		const displayMinutes = `${remindHour}:${remindminutes}:${remindeSeconds < 10 ? 0 : ''}${remindeSeconds}`;
		if(sec > 86400){
			timerDisplay.textContent = `Дни:${days} ${remindHour}:${remindminutes}:${remindeSeconds < 10 ? 0 : ''}${remindeSeconds}`;
		}else if(sec > 3600){
				timerDisplay.textContent = `${hour}:${remindminutes}:${remindeSeconds < 10 ? 0 : ''}${remindeSeconds}`;
		}else {
				timerDisplay.textContent = `${minutes}:${remindeSeconds < 10 ? 0 : ''}${remindeSeconds}`;
		}
		
		document.title = displayMinutes;
		// timerDysplay.textContent = `${displayMinutes}`;	
	};

	function displayEndTime(timestamp){
		const date = new Date(timestamp);
		const hour = date.getHours();
		const minutes = date.getMinutes();
		endTime.textContent = `Be back at ${hour}:${minutes < 10 ? 0 : ''}${minutes}`;
	};

	function stop(){
		clearInterval(countDown);
		return timerDisplay.textContent = 'Timer was stopped';
	};

	function playSound(){
		alarmSound.play()
	};

	return{
		init,
		start,
		stop
	};
}());

timer.init({
	timeLeftSelector: '.display__time--left',
	timeEndSelector: '.display__time--end',
	alarmSound: 'audio/die-antwoord_-_baby-s-on-fire.mp3'

}).start();

function startTimer(e){
	e.preventDefault();/*Отменили стандартное событие (перезагрузку страницы) при сабмите*/
	const sec = parseInt(this.dataset.time);//Получили значение секунд с кнопки и привели его к числу 	
	const inpValue = parseInt(input.value * 60);//Вводим минуты, преобразуем их в секунды
	console.log(input.value);
	if(e.target == form){//проверили что при нажатие было на форме
		timer.start(inpValue);
	}else timer.start(sec);	
};

btns.forEach(btn => btn.addEventListener('click', startTimer));/*Обходим циклом for each все кнопки и вешаем на них событие*/
form.addEventListener('submit', startTimer);/*Вешаем слушатель событий ( по событию сабмит) на форму*/









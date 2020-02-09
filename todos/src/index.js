const render = {
	//  데이터 화면에 뿌려주는 함수
	pendingTasks() {
		const pendingTasks = localstorageF.get('PENDING');
		const pendingUlTag = document.querySelector('.pending');
		let resultStr = '';
		if (!pendingTasks) return;
		pendingTasks.forEach((elem) => {
			resultStr += `
        <li>
          ${elem.text}
          <button data-idx=${elem.idx} class="remove-btn">❌</button>
          <button data-idx=${elem.idx} class="finish-btn">✅</button>
        </li>
      `;
		});
		pendingUlTag.innerHTML = resultStr;
		createEvent.remove();
		createEvent.finish();
	},
	finishTasks() {
		const finishTasks = localstorageF.get('FINISH');
		const finishUlTag = document.querySelector('.finish');
		let resultStr = '';
		if (!finishTasks) return;
		finishTasks.forEach((elem) => {
			resultStr += `
        <li>
          ${elem.text}
          <button data-idx=${elem.idx} class="remove-btn">❌</button>
          <button data-idx=${elem.idx} class="topending-btn">⏮</button>
        </li>
      `;
		});
		finishUlTag.innerHTML = resultStr;
		createEvent.remove();
		createEvent.toPending();
	}
};

const createEvent = {
	//  이벤트 달아주는 함수
	remove() {
		const removeBtn = document.querySelectorAll('.remove-btn');
		if (!removeBtn.length) return;
		removeBtn.forEach((elem, index) => {
			elem.addEventListener('click', () => {
				handle.removeBtnFunc(elem.dataset.idx);
			});
		});
	},
	finish() {
		const finishBtn = document.querySelectorAll('.finish-btn');
		if (!finishBtn.length) return;
		finishBtn.forEach((elem) => {
			elem.addEventListener('click', () => {
				handle.finishBtnFunc(elem.dataset.idx);
			});
		});
	},
	toPending() {
		const toPendingBtn = document.querySelectorAll('.topending-btn');
		if (!toPendingBtn.length) return;
		toPendingBtn.forEach((elem) => {
			elem.addEventListener('click', () => {
				handle.toPendingBtnFunc(elem.dataset.idx);
			});
		});
	},
	addTask(val) {
		const obj = {};
		const pendingLs = localstorageF.get('PENDING');
		obj.idx = utils.makeId();
		obj.text = val;

		if (Array.isArray(pendingLs)) {
			pendingLs.push(obj);
			localstorageF.set('PENDING', pendingLs);
		} else {
			localstorageF.set('PENDING', [ obj ]);
		}
		input.value = '';
		render.pendingTasks();
	}
};

const localstorageF = {
	//  localstorage 접근 함수
	get(name) {
		if (!localStorage.getItem(name)) {
			return [];
		}
		return JSON.parse(localStorage.getItem(name));
	},
	set(name, value) {
		localStorage.setItem(name, JSON.stringify(value));
	}
};

const utils = {
	//  utils 관련 함수
	makeId() {
		return Date.now();
	}
};

const handle = {
	//  로직 함수
	removeBtnFunc(idx) {
		const pendingLs = localstorageF.get('PENDING');
		const result = pendingLs.filter((elem) => {
			return elem.idx !== parseInt(idx);
		});
		localstorageF.set('PENDING', result);
		render.pendingTasks();

		const finishLs = localstorageF.get('FINISH');
		const result1 = finishLs.filter((elem) => {
			return elem.idx !== parseInt(idx);
		});
		localstorageF.set('FINISH', result1);
		render.finishTasks();
	},
	finishBtnFunc(idx) {
		const pendingLs = localstorageF.get('PENDING');
		const finishLs = localstorageF.get('FINISH');
		const result = pendingLs.filter((elem) => {
			if (elem.idx == parseInt(idx)) {
				finishLs.push(elem);
			}
			return elem.idx !== parseInt(idx);
		});
		localstorageF.set('PENDING', result);
		localstorageF.set('FINISH', finishLs);
		render.pendingTasks();
		render.finishTasks();
	},
	toPendingBtnFunc(idx) {
		const pendingLs = localstorageF.get('PENDING');
		const finishLs = localstorageF.get('FINISH');
		const result = finishLs.filter((elem) => {
			if (elem.idx === parseInt(idx)) {
				pendingLs.push(elem);
			}
			return elem.idx !== parseInt(idx);
		});
		localstorageF.set('PENDING', pendingLs);
		localstorageF.set('FINISH', result);
		render.pendingTasks();
		render.finishTasks();
	}
};

const makeRandomNumber = (num) => {
	return Math.floor(Math.random() * num);
};

const img = document.createElement('img');
img.setAttribute('src', `images/${makeRandomNumber(3)}.jpg`);
img.setAttribute('class', 'images');
document.body.prepend(img);

render.pendingTasks();
render.finishTasks();

const input = document.querySelector('#input');
input.addEventListener('keyup', function(e) {
	if (e.code === 'Enter' && input.value) {
		createEvent.addTask(e.target.value);
	}
});

navigator.geolocation.getCurrentPosition((position) => {
	const { latitude, longitude } = position.coords;
	localstorageF.set('coords', position.coords);

	fetch(
		`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=344836c0c35f2b4d67c17010f505541b`
	)
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			const { name, weather } = res;
			const inputDom = document.querySelector('.location');
			inputDom.innerHTML = `<h3>${name} : ${weather[0].main}</h3>`;
		})
		.catch((e) => console.log('e--', e));
});

function makeClock() {
	const date = new Date();
	const clock = document.querySelector('.clock');
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	clock.innerHTML = `<h4>${hour} : ${minute} : ${second}<h4>`;
}
makeClock();
setInterval(makeClock, 1000);

const inputName = document.querySelector('.input-name');
const inputNameBtn = document.querySelector('.input-name-btn');
inputNameBtn.addEventListener('click', (e) => {
	const name = document.querySelector('.input-name').value;
	localstorageF.set('NAME', name);
	isNameExist();
});

function isNameExist() {
	if (localstorageF.get('NAME').length) {
		console.log('dskfjasdfka', localstorageF.get('NAME'));
		inputName.style.display = 'none';
		inputNameBtn.style.display = 'none';
		document.querySelector('.name').innerHTML = localstorageF.get('NAME');
	}
}

isNameExist();

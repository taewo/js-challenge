

// 어떤 함수의 종류가 있지?
// pending/finish를 보여주는 render 함수
// 버튼에 event를 붙히는 함수 - remove/ finish/ toPending
// LS에서 get/ set 하는 함수
// (utils) 생성ms생성하는 함수

const render = {  //  데이터 화면에 뿌려주는 함수
  pendingTasks() {
    const pendingTasks = localstorageF.get("PENDING");
    const pendingUlTag = document.querySelector(".pending");
    let resultStr = "";
    if (!pendingTasks) return;
    pendingTasks.forEach(elem => {
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
  },
  finishTasks() {

  }
}

const createEvent = { //  이벤트 달아주는 함수
  remove() {
    const removeBtn = document.querySelectorAll(".remove-btn");
    if (!removeBtn.length) return;
    removeBtn.forEach((elem, index) => {
      elem.addEventListener("click", () => {
        handle.removeBtnFunc(elem.dataset.idx)
      });
    });
  },
  finish() {
    const finishBtn = document.querySelectorAll('.finish-btn');
    if (!finishBtn.length) return;
    finishBtn.forEach((elem) => {
      elem.addEventListener('click', () => {
        handle.finishBtnFunc(elem.dataset.idx)
      })
    })
  },
  addTask(val) {
    const obj = {};
    const pendingLs = localstorageF.get('PENDING');
    obj.idx = utils.makeId();
    obj.text = val;
  
    if (Array.isArray(pendingLs)) {
      pendingLs.push(obj);
      localstorageF.set("PENDING", pendingLs);
    } else {
      localstorageF.set("PENDING", [obj]);
    }
    input.value = "";
    render.pendingTasks();
  }
}

const localstorageF = {  //  localstorage 접근 함수
  get(name) {
    return JSON.parse(localStorage.getItem(name));
  },
  set(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  }
}

const utils = { //  utils 관련 함수
  makeId() {
    return Date.now();
  }
}

const handle = {  //  로직 함수
  removeBtnFunc(idx) {
    const pendingLs = localstorageF.get('PENDING');
    const result = pendingLs.filter((elem) => {
      return elem.idx !== parseInt(idx)
    })
    localstorageF.set('PENDING', result);
    render.pendingTasks();
  },
  finishBtnFunc(idx) {
    const pendingLs = localstorageF.get('PENDING');
    const finishedLs = localstorageF.get('FINISHED');

    // TODO:  여기서 다시 
    const result = pendingLs.filter((elem) => {
      return elem.idx !== parseInt(idx)
    })
    localstorageF.set('PENDING', result);
  }
}

function showFinishedTasks() {}

// addTask
// finishTask
// pendingTask
// removeTask


render.pendingTasks();
showFinishedTasks();

const input = document.querySelector("#input");
input.addEventListener("keyup", function(e) {
  if (e.code === "Enter" && input.value) {
    console.log("enter", e.target.value);
    createEvent.addTask(e.target.value);
  }
});
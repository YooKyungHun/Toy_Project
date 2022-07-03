////////// 프론트(클라이언트) //////////


// console.log("hello js")

"use strict"
const socket = io();
console.log(socket) 
// 를 통해 app.js 에서의 socket 을 확인함.


// 메시지 발신
// 채널 id(이름): chatting 
// 내용: from front
// socket.emit("chatting", "from front")

// 메시지 수신
// data: 서버에서 보낸 내용을 data 라는 변수로 받음(네이밍 자유).
// socket.on("chatting", (data) => {
//   console.log(data)
// })


// index.html 의 DOM 선택
const nickname = document.querySelector("#nickname")
const list = document.querySelector("#list")
const chatList = document.querySelector(".chatting-list")
const chatInput = document.querySelector(".chatting-input")
const sendButton = document.querySelector(".send-button")
const displayContainer = document.querySelector(".display-container")

// 전송버튼 클릭시 메시지 전송
sendButton.addEventListener("click", () => {
    send()
})

// 엔터를 눌러도 메시지 전송
chatInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    send()
  }
})

// 메시지 전송함수
function send() {
  if (nickname.value == '') {
    alert('대화명을 입력하세요')
    return false
  }

  const param = {
    name: nickname.value,
    msg: chatInput.value
  }
  socket.emit("chatting", param)
  chatInput.value = ''
}




// 메시지 수신하여 스크린에 출력
// data: 서버에서 보낸 내용을 data 라는 변수로 받음(네이밍 자유).
socket.on("chatting", (data) => {
  console.log(data)

  list.value = data.userList

  // const li = document.createElement("li");
  // li.classList.add
  // li.innerText = `${data.name}님이 - ${data.msg}`;
  // chatList.appendChild(li)

  // const item = new LiModel(data.name, data.msg, data.time)
  const { name, msg, time } = data;
  const item = new LiModel(name, msg, time);

  item.makeLi()

  displayContainer.scrollTo(0, displayContainer.scrollHeight)
})

function LiModel(name, msg, time) {
  this.name = name;
  this.msg = msg;
  this.time = time;

  this.makeLi = ()=>{
    const li = document.createElement("li");

    // nickname input 과 프론트에서 수신된 메시지의 name(data.name) 이 같으면 sent, 다르면 received.
    li.classList.add(nickname.value === this.name ? "sent": "received")

    // index.html 에서 작성한 부분을 가져오되, 하드코딩 부분을 변수처리
    const dom = `<span class="profile">
      <span class="user">${this.name}</span>
      <img class="image" src="https://placeimg.com/50/50/any" alt="any">
      </span>
      <span class="message">${this.msg}</span>
      <span class="time">${this.time}</span>`;
    li.innerHTML = dom;
    chatList.appendChild(li)
  }
}





// 엔터를 눌러서 닉네임 전송
nickname.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    fnNickname();
  }
})

function fnNickname() {
  if (nickname.value.trim() == '') {
    alert('대화명을 등록하세요')

    return false
  }
  socket.emit('join', nickname.value.trim()); // 접속시 닉네임 전송
}

// 수신: 신규 참가자 접속
socket.on('join', (data) => {  // 수신
  console.log(data)
  list.value = data.userList
})

socket.on('joindisable', (data) => {  // 수신
  alert('이미 사용중인 대화명입니다.')
  list.value = data
})



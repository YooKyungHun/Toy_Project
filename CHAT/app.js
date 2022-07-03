////////// 서버 //////////


// require 를 사용하면 자동적으로 node_modules 를
// 가르키기 때문에 주소를 적지 않아도 됨.
const express = require('express')
const path = require("path")
// 여기서 사용하는 socket 은 웹소켓이기 때문에 http 를 통해서 이루어져야 함.
const http = require("http")
const app = express();
const server = http.createServer(app)
const socketIO = require("socket.io")
const moment = require("moment")
const io = socketIO(server)

// 서버가 보여줄 파일의 폴더 지정
// console.log(__dirname)
// 을 해보면 
// C:\Users\YooKyungHun\Desktop\CHAT 라는 현재 프로젝트의 위치가 나옴
app.use(express.static(path.join(__dirname, "src")))

// 포트지정
// process 환경에 지정된 port 를 사용함, 없다면 5000 port 사용.
const PORT = process.env.PORT || 5000;

// 서버 실행 명령
// app.listen(포트, 명령)
server.listen(PORT, () => console.log(`server is running ${PORT}`))




var userList = []

// connection 메서드를 사용해서, connection 이 이루어지면, 
// 연결에 대한 객체(정보 등 모든 것들) 를 socket 에 담음.
io.on("connection", (socket) => {
  // console.log('연결 성공')

  // chat.js 에서 보낸 메시지의 수신.
  // chatting: chat.js 에서의 채널 id(이름).
  // data: 클라이언트에서 보낸 내용을 data 라는 변수로 받음(네이밍 자유).
  socket.on("chatting", (data) => {
    console.log(data)
    // io.emit("chatting")
    // ES6 문법
    const { name, msg } = data;
    io.emit("chatting", {
      name,
      msg,
      time: moment(new Date()).format("h:mm A"),
      userList
    })
  })



















  // 유저입장
  socket.on('join', function(data){ // 수신
    console.log(data);

    var tempNickname = data;
    // 신규 참가자 유효성 검토(중복 대화명 제외)
    if (userList.includes(tempNickname)) {
      socket.emit('joindisable', userList)  // 송신
      return false
    }

    // 신규 참가자 -> 참가자 목록에 등록
    userList.push(tempNickname)

    socket.emit('join', { // 송신
      tempNickname,
      userList 
    });
  })






















})


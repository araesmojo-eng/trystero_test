import {joinRoom, selfId} from 'https://esm.run/trystero'

const byId = document.getElementById.bind(document)
const canvas = byId('canvas')
const peerInfo = byId('peer-info')
const noPeersCopy = peerInfo.innerText
const config = {appId: 'trystero-demo1'}
const cursors = {}
const fruits = [
  '🍏',
  '🍎',
  '🍐',
  '🍊',
  '🍋',
  '🍌',
  '🍉',
  '🍇',
  '🍓',
  '🫐',
  '🍈',
  '🍒',
  '🍑',
  '🥭',
  '🍍',
  '🥥',
  '🥝'
]

const peer_images = [
  'flapping_bird_92.gif',
  'flapping_bird_2_92.gif',
  'flapping_bird_3_92.gif',
  'flapping_bird_4_92.gif',
  'flapping_bird_5_92.gif',
  'flapping_bird_6_92.gif',
  'flapping_bird_7_92.gif',
  'flapping_bird_8_92.gif',
  'flapping_bird_9_92.gif',
  'flapping_bird_10_92.gif'
]

const randomFruit = () => Math.floor(Math.random() * fruits.length)

let mouseX = 0
let mouseY = 0
let room
let sendMove
let sendClick

init(51)
document.documentElement.className = 'ready'
addCursor(selfId, true)

addEventListener('pointermove', ({clientX, clientY}) => {
  mouseX = clientX / innerWidth
  mouseY = clientY / innerHeight
  moveCursor([mouseX, mouseY], selfId)
  if (room) {
    sendMove([mouseX, mouseY])
  }
})

addEventListener('click', () => {
  const payload = [randomFruit(), mouseX, mouseY]

  dropFruit(payload)
  if (room) {
    sendClick(payload)
  }
})

addEventListener('touchstart', e => {
  const x = e.touches[0].clientX / innerWidth
  const y = e.touches[0].clientY / innerHeight
  const payload = [randomFruit(), x, y]

  dropFruit(payload)
  moveCursor([x, y], selfId)

  if (room) {
    sendMove([x, y])
    sendClick(payload)
  }
})

function init(n) {
  let getMove
  let getClick

  room = joinRoom(config, 'room' + n)
  ;[sendMove, getMove] = room.makeAction('pointerMove')
  ;[sendClick, getClick] = room.makeAction('click')

  byId('room-num').innerText = 'room #' + n
  room.onPeerJoin(addCursor)
  room.onPeerLeave(removeCursor)
  getMove(moveCursor)
  getClick(dropFruit)
}

function moveCursor([x, y], id) {
  const el = cursors[id]

  if (el && typeof x === 'number' && typeof y === 'number') {
    el.style.left = x * innerWidth + 'px'
    el.style.top = y * innerHeight + 'px'
  }
}

// from: https://stackoverflow.com/a/29040784/10981777
function convertLetterToNumber(str) {
  const start = 96 // "a".charCodeAt(0) - 1
  const len = str.length;
  const out = [...str.toLowerCase()].reduce((out, char, pos) => {
      const val = char.charCodeAt(0) - start
      const pow = Math.pow(26, len - pos - 1);
      return out + val * pow
  }, 0)
  return out;
}

function addCursor(id, isSelf) {
  const el = document.createElement('div')
  const img = document.createElement('img')
  const txt = document.createElement('p')
  
  var id_letters = id.slice(0, 7).replace(/[^a-zA-Z]/g, '');
  var id_numbers = id.slice(0, 7).replace(/[^0-9]/g, '');
  
  var id_letter_part = id_letters.length > 0 ? convertLetterToNumber(id_letters) : 0;
  var id_number_part = id_numbers.length > 0 ? parseInt( id_numbers, 10 ) : 0;
  
  var id_long_number = id_letter_part + id_number_part;

  el.className = `cursor${isSelf ? ' self' : ''}`
  el.style.left = el.style.top = '-99px'
  
  var peer_image = peer_images[ id_long_number % 10 ];
  
  img.src = 'images/' + peer_image;
  txt.innerText = isSelf ? 'you\n' + id + '\n'+ id_letters + '\n'+ id_numbers + '\n'+ String(id_long_number) : id.slice(0, 4)
  el.appendChild(img)
  el.appendChild(txt)
  canvas.appendChild(el)
  cursors[id] = el

  if (!isSelf) {
    sendMove([Math.random() * 0.93, Math.random() * 0.93], id)
    updatePeerInfo()
  }

  return el
}

function removeCursor(id) {
  if (cursors[id]) {
    canvas.removeChild(cursors[id])
  }
  updatePeerInfo()
}

function updatePeerInfo() {
  const count = Object.keys(room.getPeers()).length
  peerInfo.innerHTML = count
    ? `Right now <em>${count}</em> other peer${
        count === 1 ? ' is' : 's are'
      } connected with you. Click to send them some fruit.`
    : noPeersCopy
}

function dropFruit([fruitIndex, x, y]) {
  const fruit = fruits[fruitIndex]
  if (!fruit || typeof x !== 'number' || typeof y !== 'number') {
    return
  }

  const el = document.createElement('div')
  el.className = 'fruit'
  el.innerText = fruit
  el.style.left = x * innerWidth + 'px'
  el.style.top = y * innerHeight + 'px'
  canvas.appendChild(el)
  setTimeout(() => canvas.removeChild(el), 3000)
}
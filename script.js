// PS! Replace this with your own channel ID
// If you use this channel ID your app will stop working in the future
const CLIENT_ID = 'BTrJnlEe04IrLdCA';

const drone = new ScaleDrone(CLIENT_ID, {
  data: { // Will be sent out as clientData via events
    name: getRandomName(),
    color: getRandomColor(),
  },
});

let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');

  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });

  room.on('members', m => {
    members = m;
    updateMembersDOM();
  });

  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();
  });

  room.on('member_leave', ({id}) => {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});

drone.on('close', event => {
  console.log('Connection was closed', event);
});

drone.on('error', error => {
  console.error(error);
});

function getRandomName() {
  const adjs = ["sus", "hidden", "amongus", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
  const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
  return (
    adjs[Math.floor(Math.random() * adjs.length)] +
    "_" +
    nouns[Math.floor(Math.random() * nouns.length)] +
    " " +
    adjs[Math.floor(Math.random() * adjs.length)]

  );
}

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

//------------- DOM STUFF

const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);

var messages = 0;
var count = 0;



if (sessionStorage.getItem('count', 3)) {  
  localStorage.setItem('count', count)
  document.getElementById("bodyy").style.visibility = "hidden";
  document.getElementById("teXT").style.visibility = "visible";
  console.log("banning...")
  delay(10000)
  sessionStorage.setItem('count', 0)
  count = 0;

  
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: "Sweared Too Much..."
  });
  
 }


function sendMessage() {
  const value = DOM.input.value;
  if (value === '') {
    messages = messages + 1;
    sessionStorage.setItem("messages-sent", messages)
    return;
  }
  if (value === "fu") {
    DOM.input.value = '';
    drone.publish({
      room: 'observable-room',
      message: "Hey! No Swearing!"
    });
   count = count + 1;
   console.log(count);
   sessionStorage.setItem('count', count)
   
   if (count == 3) {  
    localStorage.setItem('count', count)
    document.getElementById("bodyy").style.visibility = "hidden";
    document.getElementById("teXT").style.visibility = "visible";
    console.log("banning...")
    
    DOM.input.value = '';
    drone.publish({
      room: 'observable-room',
      message: "Sweared Too Much..."
    });
    return
   }
return
   
  }


  if (value === "s") {
    DOM.input.value = '';
    drone.publish({
      room: 'observable-room',
      message: "Hey! No Swearing!"
    });
   count = count + 1;
   console.log(count);
   sessionStorage.setItem('count', count)
   
   if (count == 3) {  
    localStorage.setItem('count', count)
    document.getElementById("bodyy").style.visibility = "hidden";
    document.getElementById("teXT").style.visibility = "visible";
    console.log("banning...")
    
    DOM.input.value = '';
    drone.publish({
      room: 'observable-room',
      message: "Sweared Too Much..."
    });
    return
   }
return
   
  }

  
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,
  });
}

function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = 'Users:';
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;
}

function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}

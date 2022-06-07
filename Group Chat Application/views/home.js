document.addEventListener('DOMContentLoaded', () => {
    //loading signedup users
    //loading & updating messages
    showMemberGroups();
    showAllMsg();
    setInterval( () => {
        updateMsg();
      } , 3000);
      //creating a chat group
      document.getElementById('create-group').addEventListener('click' , (e) => {
          e.preventDefault();
          showAvailableUsers();
      })
      //Send Message Button Functionality
      document.getElementById("sendMsg").addEventListener("click", (e) => {
      e.preventDefault();
        
      const message = document.getElementById("text-content").value;
      const token = localStorage.getItem('token');
      const msgdetails = {
          message: message, 
          token: token
      }
      saveMsg(msgdetails, token);
  })
  });
  async function sendMsgGroup(grpId){
          console.log('------------  trying to send group message ----------------')
          const message = document.getElementById("text-content").value;
          const token = localStorage.getItem('token');
          const msgdetails = {
              message: message, 
              token: token
          }
          try{
          const result = await axios.post(`http://localhost:3000/savemsg?id=${grpId}`, msgdetails, { headers: { "Authorization": token } })
            alert(result.data.message); 
            if(result.status === 201){   
                document.getElementById("text-content").value="";
            }else{
              console.log('Failed')
            }
          }catch{
            alert('Try Again');
          }
  }
  async function saveMsg(msgdetails, token){
        axios.post('http://localhost:3000/savemsg', msgdetails, { headers: { "Authorization": token } })
        .then((result) => {
          alert(result.data.message); 
          if(result.status === 201){   
              document.getElementById("text-content").value="";
          }else{
            console.log('Failed')
          }
        })
        .catch(error => {
              console.log(error);
        })
  }
  async function showAllMsg(){
      const token = localStorage.getItem('token');
      const dbmsgs = await axios.get('http://localhost:3000/getmsg' , { headers: { "Authorization": token } });
      const textsArr = dbmsgs.data.texts;
      let localTexts = [];
      if(textsArr.length < 10 && textsArr.length > 0){
      localStorage.setItem('lastMsg' , JSON.stringify(textsArr));
      }
      else if(textsArr.length > 10){
        
        const lastMsgSaved = textsArr.length;
        localTexts = textsArr.filter( (text) => text.msgid > (lastMsgSaved-10) );
        localStorage.setItem('lastMsg' , JSON.stringify(localTexts));
        console.log('inside show all' , localTexts.length);
      }
      const container = document.getElementById('chat-box');
      container.innerHTML = '<div class="chat-box" id="chat-box"></div>'
      localTexts.forEach( (elem) => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = `<div class="message secondary">
        ${elem.userName} :: ${elem.message}
        <div class="timestamp">02:11</div>
      </div>`
        
        container.appendChild(msgDiv);
      })
  }
  async function updateMsg(){
      const localArr = JSON.parse(localStorage.getItem('lastMsg'));
      const lastId = localArr[localArr.length-1].msgid+1;
      const token = localStorage.getItem('token');
      const dbmsgs = await axios.get(`http://localhost:3000/updatemsg?id=${lastId}` , { headers: { "Authorization": token } });
      const newArr = dbmsgs.data.texts;
      console.log('----- main call to ho ra hu --------- ');
      if(newArr.length === 0){
        return;
      }
      const textsArr = localArr.concat(newArr);
      console.log(textsArr);
      let localTexts = [];
      if(textsArr.length < 10 && textsArr.length > 0){
        localStorage.setItem('lastMsg' , JSON.stringify(textsArr));
        }
        else if(textsArr.length > 10){
          const lastMsgId = textsArr[textsArr.length-1].msgid;
          localTexts = textsArr.filter( (text) => text.msgid > (lastMsgId-10) );
          console.log('inside updateMsg ' ,localTexts.length);
          localStorage.setItem('lastMsg' , JSON.stringify(localTexts));
        }
      console.log('----- main update ho ra hu baar baar --------- ');
      const container = document.getElementById('chat-box');
      container.innerHTML = '<div class="chat-box" id="chat-box"></div>'
      localTexts.forEach( (elem) => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = `<div class="message secondary">
        ${elem.userName} :: ${elem.message}
        <div class="timestamp">02:11</div>
      </div>`
        
        container.appendChild(msgDiv);
        
      })
    
  }
  async function showMemberGroups() {
    console.log('------------------ fetching Member Groups------------');
    const token = localStorage.getItem('token');
    const dbout = await axios.get('http://localhost:3000/getGrps' , { headers: { "Authorization": token } });
    const dbgroups = dbout.data.memberOf;
    const groupContainer = document.getElementById('groups-list');
    groupContainer.innerHTML = ``;
    dbgroups.forEach( (group) => {
      const usrbtn = document.createElement('button');
      usrbtn.innerHTML = `<div class="group-list"><button class="usr-btn" id="${group.grpId}" onclick="showGroupMsgs(${group.grpId})"> ${group.grpName}</button></div>`;
      groupContainer.appendChild(usrbtn);
    })
  
  
  }
  
  async function showAvailableUsers(){
    const dbout = await axios.get('http://localhost:3000/getusers');
    const dbusers = dbout.data.dbusers;
    const userContainer = document.getElementById('myModal2');
    userContainer.innerHTML = `<div class="modal-content" id="myModal2">
    <span class="close">&times;</span>
    <input type="text" id="grpname" name="grpname" placeholder="Enter Name Of Your Group"><br>
  </div>`;
    
    dbusers.forEach( (user) => {
      const usrbtn = document.createElement('button');
      usrbtn.innerHTML = `<div class="grp-creation"><div>
      <label for="isAdmin">Admin Access ??</label>
      <select name="isAdmin" id="isAdmin_${user.id}">
        <option value="true">Yes</option>
        <option value="false" selected>No</option>
      </select>
    </div><div><button class="usr-btn" id="${user.id}" onclick="addToGrp(${user.id})"> ${user.name}</button></div></div>`;
      userContainer.appendChild(usrbtn);
    })
    //popup functionality
    {
    const modal = document.getElementById("myModal");
      
      // Get the button that opens the modal
      const btn = document.getElementById("create-group");
      
      // Get the <span> element that closes the modal
      const span = document.getElementsByClassName("close")[0];
      
      // When the user clicks the button, open the modal 
      btn.onclick = function() {
        modal.style.display = "block";
      }
      
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      }
      
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    }
  }
  async function addToGrp(uId){
    const groupName = document.getElementById('grpname').value;
    const isAdmin = document.getElementById(`isAdmin_${uId}`).value;
    if(groupName == ''){
      alert('Please give Name of Group, you want to create');
      return;
    }
    const groupDetails = {
      groupName, isAdmin , uId
    }
    const token = localStorage.getItem('token');
    const result = await axios.post('http://localhost:3000/createGrp', groupDetails, { headers: { "Authorization": token } })
    alert(result.data.message);
  }
  async function showGroupMsgs(grpId) {
      const token = localStorage.getItem('token');
      const dbmsgs = await axios.get(`http://localhost:3000/getmsg?id=${grpId} `, { headers: { "Authorization": token } });
      const textsArr = dbmsgs.data.texts;
      console.log(textsArr);
      const container = document.getElementById('chat-box');
      container.innerHTML = '<div class="chat-box" id="chat-box"></div>'
      textsArr.forEach( (elem) => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = `<div class="message secondary">
        ${elem.userName} :: ${elem.message}
        <div class="timestamp">02:11</div>
      </div>`
        
        container.appendChild(msgDiv);
  
      })
      document.getElementById("input-area").innerHTML = `<input type="text" name="" id="text-content" />
      <button id="sendMsgGroup" onclick="sendMsgGroup(${grpId})"><i class="fas fa-paper-plane"> SEND to Group </i></button>
      <button id="sendMsgGroup" onclick="sendMsgGroup(${grpId})"><i class="fas fa-paper-plane"> SEND to Group </i></button>`;
  
      const resultdb = await axios.get(`http://localhost:3000/getusers/?id=${grpId}`);
      const dbusers = resultdb.data.dbusers;
      const grpMemContainer = document.getElementById('Group-Members');
      grpMemContainer.innerHTML = `<ul id="Group-Members"></ul>`;
      dbusers.forEach( (user) => {
        const usrbtn = document.createElement('li');
        usrbtn.innerHTML = `<li class="member-btn" id="member-btn">${user.name} <button onclick="removeUser(${user.id} , ${grpId})"> X </button></li>`;
        grpMemContainer.appendChild(usrbtn);
      })
  }
  
  async function removeUser(uId , grpId){
    console.log(`------ we are deleting user from this group with userId = ${uId} from ${grpId} --------`)
    const token = localStorage.getItem('token');
    const result = await axios.post(`http://localhost:3000/removeuser` , {uId: uId , grpId: grpId} , { headers: { "Authorization": token } } )
    alert(result.data.message);
  } 
  
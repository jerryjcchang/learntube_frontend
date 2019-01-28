document.addEventListener('DOMContentLoaded', function() {
  window.onYouTubeIframeAPIReady = function() {
    console.log('ready to embed YT videos')

    // getAllVideos()
    initModalXButton()
    initYouTubePlayer()
  }

  function onPlayerReady(event) {
    isReady = true;
  }

  function videoLoaded (){
    if (isReady) {
        console.log("ready and play")
        poster.hide();
        video.show();

        $('body').trigger('fluidvideos');

        player.playVideo();
        clearInterval(interval);
    }
  }

  let loginForm = document.querySelector('.login-form')
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.querySelector('#inputUsername').value.toLowerCase()
    login(username)
  })

  let addVideoForm = document.querySelector('.addVid-form')
  addVideoForm.addEventListener('submit', function(e){
    e.preventDefault();
    postNewVideo();
    e.target.reset();
    document.getElementById('instructor').value = capitalizeString(welcomeDiv().dataset.name)
  })

  function capitalizeString(name){
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  let addNoteForm = document.querySelector('.note-form')
  addNoteForm.addEventListener('submit', function(e){
    e.preventDefault();
    addNewNote();
    e.target.reset();
  })

})

function welcomeDiv(){
  return document.querySelector('.welcome-div')
}

function modal(){
  return document.querySelector('#myModal')
}

function modalXButton(){
  return document.getElementsByClassName("close")[0]
}

function notesContentDiv(){
  return document.querySelector('.notes-content')
}

function initModalXButton(){
  modalXButton().addEventListener('click', handleXButton)
}

function clearNotes(){
  clearChildNodes(notesContentDiv())
}

function handleXButton(e){
  modal().style.display = "none"
  document.querySelector('.video-modal').src = ''
  clearNotes();
}

function vidNotesDiv(){
  return document.querySelector('.vid-notes-div')
}

function getAllVideos(){
  return fetch('http://localhost:3000/api/v1/videos')
  .then(r => r.json())
  // .then(videos => videos.forEach(video => renderVideoCard(video)))
}

function getUser(username) {
  return fetch('http://localhost:3000/api/v1/users')
  .then(r => r.json())
  .then(users => users.find(user => user.username.toLowerCase() === username))
}

function handleLogin(user){
  if (user){
    document.querySelector('.welcome-div').innerText = `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}`
    document.querySelector('.welcome-div').id = user.id
    document.querySelector('.welcome-div').dataset.status = user.status

    const closeModal = () => {
      $("#login-modal").removeClass("in");
      $(".modal-backdrop").remove();
      $("#login-modal").hide();
    }
    $('#invalid-user').hide() // hide bootstrap-alert after incorrect login
    if (user.status === 'instructor') {
      console.log('is instructor')
      document.getElementById('myVideoTab').classList.remove('show', 'active')
      document.getElementById('addVideoTab').classList.add('show', 'active')
      document.querySelector('.welcome-div').dataset.name = user.first_name.toLowerCase()
      document.getElementById('instructor').value = user.first_name
      closeModal();
      // renderUserLikedVideos(user);
      // myVideo()
      addVideo();
      mod()

     }
     else if (user.status === 'student'){
       console.log('is student')
       closeModal();
       myVideo();
       renderUserLikedVideos(user)
       mod()

     }
  }
  else {
    $('#invalid-user').show()
  }

}

function login(username){
  Promise.all([getUser(username), getAllVideos()])
  .then(r => {
    handleLogin(r[0])
    r[1].forEach(video => renderVideoCard(video))
  })
  .then(renderDeleteButton)
}

function renderVideoCard(video){
  // take each video, filter by Category
  // set tabId based on category
  // render video divs to category
  let modContainer = document.querySelector(`#${video.category.replace(/\s/g, '').toLowerCase()}Tab`);
    // debugger
    vidCard = document.createElement('div')
    vidCard.id = `vid-card-${video.id}`
    vidCard.classList.add('vid-preview-card', `${video.instructor.toLowerCase()}`)
    modContainer.appendChild(vidCard)
// COMMENT BACK IN TO ENABLE MODAL //
    vidCard.addEventListener('click', (e) => {
      handleCardClick(video)
    })
    modContainer.prepend(vidCard)

    vidImg = document.createElement('img')
    vidImg.src = `https://img.youtube.com/vi/${video.youtube_id}/1.jpg`
    vidCard.appendChild(vidImg)

    vidTitle = document.createElement('div')
    vidTitle.classList.add('vid-title')
    vidTitle.innerText = video.name
    vidCard.appendChild(vidTitle)

    vidDetails = document.createElement('p')
    vidDetails.innerText = `Instructor: ${video.instructor}`
    vidCard.appendChild(vidDetails)
    // debugger
    if (welcomeDiv().dataset.status === "student"){
    addBtn = document.createElement('button')
    addBtn.classList.add('vid-add-btn', 'btn')
    addBtn.id = `add-btn-${video.id}`
    addBtn.innerText = 'Add To My List'
    addBtn.addEventListener('click', function(e){
      e.stopPropagation()
      addToMyList(e)
    })
    vidCard.appendChild(addBtn)
    }
}

function addVideo(){
  document.querySelector('#myVideo').classList.remove('active', 'show')
  document.querySelector('#addVideo').classList.add('active', 'show')
  document.querySelector('#addVideo').classList.remove('d-none')
}

function myVideo(){
  document.querySelector('#myVideo').classList.remove('d-none')

  const vidDiv = document.querySelector('#myVideoTab')

  const myVid = document.createElement('h3')
  vidDiv.prepend(myVid)
}

function renderUserLikedVideos(user){
  clearChildNodes(document.querySelector('#myVideoTab'))
  user.videos.forEach(video => renderMyVideoCard(video))
}

function mod(){
  document.querySelector('#mod-1').classList.remove('d-none')
  document.querySelector('#mod1Tab').classList.remove('d-none')

  document.querySelector('#mod-2').classList.remove('d-none')
  document.querySelector('#mod2Tab').classList.remove('d-none')

  document.querySelector('#mod-3').classList.remove('d-none')
  document.querySelector('#mod3Tab').classList.remove('d-none')

  document.querySelector('#mod-4').classList.remove('d-none')
  document.querySelector('#mod4Tab').classList.remove('d-none')
}

function renderDeleteButton(){
  if (welcomeDiv().dataset.status === "instructor"){
      let cards = document.querySelectorAll(`.${welcomeDiv().dataset.name}`)
      cards.forEach((card) => {
        let deleteBtn = document.createElement('button')
          deleteBtn.classList.add('vid-del-btn', 'btn')
          deleteBtn.innerText = `Delete Video`
          deleteBtn.addEventListener('click', function(e){
          e.stopPropagation()
          handleDeleteButton(e)
        })
        card.appendChild(deleteBtn)
        deleteBtn.id = `del-btn-${parseId(deleteBtn.parentElement.id)}`
      })
    }
  // vidCard.appendChild(deleteBtn)
  // console.log('status = instructor')
}

function handleDeleteButton(event){
  let id = parseId(event.target.id)
  let data = {
    id: id
  }
  fetch(`http://localhost:3000/api/v1/videos/${id}`, {
    method: "DELETE"
  })
  .then(r => r.json())
  .then(deletedVideo => document.getElementById(`vid-card-${deletedVideo.id}`).remove())
}

function addToMyList(event){
  let id = parseId(event.target.id)
  let data = {'video_id': id}
  // debugger
  let userID = document.querySelector('.welcome-div').id
    // debugger
    fetch(`http://localhost:3000/api/v1/users/${userID}/videos/add`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(userVideo => {
      renderMyVideoCard(userVideo)
    })
}

function renderMyVideoCard(video){
  console.log(video)
  const myVidTab = document.querySelector('#myVideoTab')

      vidCard = document.createElement('div')
      vidCard.id = `my-vid-card-${video.id}`
      vidCard.classList.add('vid-preview-card')
      myVidTab.appendChild(vidCard)

      vidCard.addEventListener('click', (e) => {
        handleCardClick(video)
      })
      myVidTab.prepend(vidCard)

      vidImg = document.createElement('img')
      vidImg.src = `https://img.youtube.com/vi/${video.youtube_id}/1.jpg`
      vidCard.appendChild(vidImg)

      vidTitle = document.createElement('div')
      vidTitle.classList.add('vid-title')
      vidTitle.innerText = video.name
      vidCard.appendChild(vidTitle)

      vidDetails = document.createElement('p')
      vidDetails.innerText = `Instructor: ${video.instructor}`
      vidCard.appendChild(vidDetails)

      // vidAddBtn = document.createElement('div')
      // vidCard.appendChild(vidAddBtn)

      removeBtn = document.createElement('button')
      removeBtn.classList.add('vid-remove-btn','btn')
      removeBtn.id = `remove-btn-${video.id}`
      removeBtn.innerText = 'Remove'

      removeBtn.addEventListener('click', function(e){
        e.stopPropagation()
        removeFromMyList(e)
      })
      // vidAddBtn.appendChild(addBtn)
      vidCard.appendChild(removeBtn)
}

function removeFromMyList(event){
  let userId = document.querySelector('.welcome-div').id
  let videoId = parseId(event.target.id)
  let data = {
    user_id: userId,
    video_id: videoId
  }
  // debugger
  fetch(`http://localhost:3000/api/v1/users/${userId}/videos/remove`, {
    method: "DELETE",
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(id => document.querySelector(`#my-vid-card-${id}`).remove())
}

function parseYoutubeId(id){
  if(id.includes('&')){
    return id.split('&')[0].split('=')[1]
  } else if(id.includes('=')){
    return id.split('=')[1]
  } else if(id.includes('/')){
    return id.split('/')[3]
  } else{return id}
}

function postNewVideo(){
  // console.log(video)
  const vidName = document.getElementById('vidName').value
  const vidInstructor = document.getElementById('instructor').value
  const vidDescription = document.getElementById('inputDescription').value
  const vidYoutubeId = parseYoutubeId(document.getElementById('inputYoutube_id').value)
  const vidLength = document.getElementById('inputVideoLength').value
  const vidCategory = document.getElementById('inputCategory').value

    let data ={ name: vidName,
                description: vidDescription,
                instructor: vidInstructor,
                length: vidLength,
                category: vidCategory,
                youtube_id: vidYoutubeId}

  fetch('http://localhost:3000/api/v1/videos', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then((newVideo) => {
    renderVideoCard(newVideo)
    renderDeleteBtn(newVideo.id)
  })
}

function renderDeleteBtn(id){
  let deleteBtn = document.createElement('button')
    deleteBtn.classList.add('vid-del-btn', 'btn')
    deleteBtn.innerText = `Delete Video`
    deleteBtn.id = `del-btn-${id}`
    deleteBtn.addEventListener('click', function(e){
    e.stopPropagation()
    handleDeleteButton(e)
  })
  document.getElementById(`vid-card-${id}`).appendChild(deleteBtn)
}

function addNewNote(){
  //change int to float in the table
  let userId = document.querySelector('.welcome-div').id
  let videoId =  document.querySelector('#video-id').value
  let inputTime = document.getElementById('noteTime').value
  let inputContent = document.getElementById('noteContent').value

  let data = {
    'user_id': userId,
    'video_id': videoId,
    'timestamp': inputTime,
    'content': inputContent
  }

  fetch('http://localhost:3000/api/v1/notes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(newNote => {

    renderNote(newNote)
  })
}

// <div class="note-div">
// <header>20:15</header>
// <p class="note-text">This dude needs to go to a doctor</p>
// </div>

function renderNote(note){
  let notesContentDiv = document.querySelector('.notes-content')

  let noteDiv = document.createElement('div')
  noteDiv.id = `note-${note.id}`
  noteDiv.classList.add('note-div')


  let noteHeader = document.createElement('header')
  noteHeader.innerText = note.timestamp
  noteDiv.appendChild(noteHeader)

  let noteText = document.createElement('p')
  noteText.innerText = note.content
  noteText.classList.add('note-text')
  noteDiv.appendChild(noteText)

  notesContentDiv.prepend(noteDiv)
}

function getUserNotes(video) {
  console.log(video)
  const userId = welcomeDiv().id
  const videoId = video.id
  fetch(`http://localhost:3000/api/v1/notes/${userId}/${videoId}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
  })
  .then(res => res.json())
  .then(notes => {
    notes.forEach(note => renderNote(note))
  })
}

function handleCardClick(video){
  let modal = document.querySelector('#myModal')
  let modalContent = document.querySelector('.video-modal')
  modal.style.display = "block"
  modalContent.src = `http://www.youtube.com/embed/${video.youtube_id}`
  document.querySelector('.video-header').innerText = ` ${video.name} (${video.instructor})`
  document.querySelector('#video-id').value = video.id
  getUserNotes(video);

}

function clearChildNodes(node){
    while(node.firstChild){
      node.removeChild(node.firstChild)
    }
}

function initYouTubePlayer(){
  player = new YT.Player(document.querySelector('.video-modal'), {
    height: '60%',
    width: '85%',
    // videoId: '',
    events: {
      // 'onReady': onPlayerReady//,
      // 'onStateChange': onPlayerStateChange
    }
  })
}


function initNotesForm(){
  let notesForm = document.createElement('form')
  notes
  let notesInput = document.createElement('input')
}

function parseId(id){
    return id.split('-')[id.split('-').length-1]
}

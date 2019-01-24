document.addEventListener('DOMContentLoaded', function() {
  window.onYouTubeIframeAPIReady = function() {
    console.log('ready to embed YT videos')

    getAllVideos()
    initModalXButton()
    initYouTubePlayer()
  }

  function modal(){
    return document.querySelector('.modal')
  }

  function modalXButton(){
    return document.getElementsByClassName("close")[0]
  }

  function initModalXButton(){
    modalXButton().addEventListener('click', handleXButton)
  }

  function handleXButton(){
    modal().style.display = "none"
    document.querySelector('.modal-content').src = ''
  }

  function vidNotesDiv(){
    return document.querySelector('.vid-notes-div')
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
    const username = document.querySelector('#inputUsername').value
    login(username)
  })

  let addVideoForm = document.querySelector('.addVid-form')
  addVideoForm.addEventListener('submit', function(e){
    e.preventDefault();
    postNewVideo();
    e.target.reset();
  })

})

function getAllVideos(){
  return fetch('http://localhost:3000/api/v1/videos')
  .then(r => r.json())
  .then(videos => videos.forEach(video => renderVideoCard(video)))
}

function getUser(username) {
  return fetch('http://localhost:3000/api/v1/users')
  .then(r => r.json())
  .then(users => users.find(user => user.username === username))
}

function login(username){
  getUser(username).then(user => {
    document.querySelector('.welcome-div').innerText = `${user.first_name} ${user.last_name}`
    document.querySelector('.welcome-div').id = user.id
    const closeModal = () => {
      $("#login-modal").removeClass("in");
      $(".modal-backdrop").remove();
      $("#login-modal").hide();
    }


    if (user.status === 'instructor') {
      console.log('is instructor')
      renderUserLikedVideos(user)
      addVideo();
      closeModal();
    }
    else if (user.status === 'student'){
      console.log('is student')
      closeModal();
      renderUserLikedVideos(user)
    }
    else {
      // not a valid username
    }
  })
}

function renderUserLikedVideos(user){
  user.videos.forEach(video => renderUserVideo(video))
}



function renderVideoCard(video){
  // take each video, filter by Category
  // set tabId based on category
  // render video divs to category
  let modContainer = document.querySelector(`#${video.category.replace(/\s/g, '').toLowerCase()}Tab`);
    // debugger
    vidCard = document.createElement('div')
    vidCard.id = `vid-card-${video.id}`
    vidCard.classList.add('vid-preview-card')
    modContainer.appendChild(vidCard)
    vidCard.dataset.toggle = "modal"
// COMMENT BACK IN TO ENABLE MODAL //
    // vidCard.addEventListener('click', (e) => {
    //   handleCardClick(video)
    // }, true)
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

    vidAddBtn = document.createElement('div')
    vidCard.appendChild(vidAddBtn)

    addBtn = document.createElement('button')
    addBtn.classList.add('vid-add-btn')
    addBtn.id = `add-btn-${video.id}`
    addBtn.innerText = 'Add to my list'

    addBtn.addEventListener('click', addToMyList)
    vidAddBtn.appendChild(addBtn)
    console.log(video)
}

function addToMyList(event){
  event.preventDefault()
  let id = parseId(event.target.id)
  let data = {'video_id': id}
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
      // debugger
      renderUserVideo(userVideo);
    })
}

function renderUserVideo(userVideo){
  console.log(userVideo)
  const myVidTab = document.querySelector('#myVideoTab')

  const myVidDiv = document.createElement('div')
  myVidDiv.id = userVideo.id
  myVidDiv.classList.add(`my-vid-card`)
  myVidTab.appendChild(myVidDiv)

  const myVidName = document.createElement('h3')
  myVidName.innerText = userVideo.name
  myVidDiv.appendChild(myVidName)

}


function postNewVideo(){
  // console.log(video)
  const vidName = document.getElementById('vidName').value
  const vidInstructor = document.getElementById('instructor').value
  const vidDescription = document.getElementById('inputDescription').value
  const vidYoutubeId = document.getElementById('inputYoutube_id').value
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
  .then(newVideo => renderVideoCard(newVideo))
}

function addVideo(){
  document.querySelector('#addVideo').classList.remove('d-none')
}


function handleCardClick(video){
  let modal = document.querySelector('#myModal')
  let modalContent = document.querySelector('.video-modal')
  modal.style.display = "block"
  modalContent.src = `http://www.youtube.com/embed/${video.youtube_id}`
  document.querySelector('.video-header').innerText = `${video.name} (${video.instructor})`
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
      //'onStateChange': onPlayerStateChange
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

document.addEventListener('DOMContentLoaded', function() {
  window.onYouTubeIframeAPIReady = function() {
    console.log('ready to embed YT videos')

    getAllVideos()
    initModalXButton()
    initYouTubePlayer()
  }

  function modal(){
    return document.querySelector('#myModal')
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

  function modalContent(){
    return document.querySelector('.modal-content')
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

  // let loginBtn = document.querySelector('form')
  // loginBtn.addEventListener('submit',function(e){
  //    e.preventDefault();
  //   const username = document.querySelector('#login').value
  //   login(username)
  // })
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
    console.log(user)
    if (user.status === 'instructor') {
      console.log('is instructor')
      addVideo();
    }
    else if (user.status === 'student'){
      console.log('is student')
    }
    else {
      // not a valid username
    }
    document.querySelector('.login-form').reset()
  })
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
    vidCard.addEventListener('click', (e) => {
      handleCardClick(video)})
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

    // vidAddBtn = document.createElement('button')
    // vidAddBtn.classList.add('vid-add-btn')
    // vidAddBtn.id = `add-btn-${tabId.id}`
    // vidAddBtn.innerText = 'Add to my list'

    // vidAddBtn.addEventListener('click', function() {
    //   addToMyList();
    // })
    // vidCard.appendChild(vidAddBtn)

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
  let modalContent = document.querySelector('.modal-content')
  modal.style.display = "block"
  document.querySelector('.modal-content').src = `http://www.youtube.com/embed/${video.youtube_id}`
  document.querySelector('.video-header').innerText = `${video.name} (${video.instructor})`
}

function clearChildNodes(node){
    while(node.firstChild){
      node.removeChild(node.firstChild)
    }
}

function initYouTubePlayer(){
  player = new YT.Player(document.querySelector('.modal-content'), {
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

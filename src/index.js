document.addEventListener('DOMContentLoaded', function() {
  window.onYouTubeIframeAPIReady = function() {
    // console.log('ready to embed YT videos')

    getAllVideos().then(videos => {

      const mod1Videos = videos.filter(video => video.category === 'Mod 1')
      mod1Videos.forEach(video => renderVideo2(video, 'mod1Tab'))

      const mod2Videos = videos.filter(video => video.category === 'Mod 2')
      mod2Videos.forEach(video => renderVideo2(video, 'mod2Tab'))

      const mod3Videos = videos.filter(video => video.category === 'Mod 3')
      mod3Videos.forEach(video => renderVideo2(video, 'mod3Tab'))

      const mod4Videos = videos.filter(video => video.category === 'Mod 4')
      mod4Videos.forEach(video => renderVideo2(video, 'mod4Tab'))
    })

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




function renderVideo2(video, tabId){
  const modContainer = document.querySelector(`#${tabId}`);

    vidCard = document.createElement('div')
    vidCard.id = `vid-card-${video.id}`
    vidCard.classList.add('vid-preview-card')
    modContainer.appendChild(vidCard)
    vidCard.dataset.toggle = "modal"
    vidCard.addEventListener('click', (e) => {
      handleCardClick(video)})
    modContainer.appendChild(vidCard)

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

}


function postNewVideo(){
  // console.log(video)
  const vidName = document.getElementById('vidName').value
  const vidInstructor = document.getElementById('instructor').value
  const vidDescription = document.getElementById('inputDescription').value
  const vidYoutubeId = document.getElementById('inputYoutube_id').value
  const vidLength = document.getElementById('inputVideoLength').value
  const vidCatagory = document.getElementById('inputCetagory').value

    let data ={ name: vidName, description: vidDescription, instructor: vidInstructor,
              length: vidLength, category: vidCatagory, youtube_id: vidYoutubeId}

  fetch('http://localhost:3000/api/v1/videos', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(newVideo => {
    console.log(newVideo)
  })
}

function addVideo(){
  document.querySelector('#addVideo').classList.remove('d-none')
  // document.querySelector('#addVideoTab').innerHTML = `<label class="font-weight-bold tab-spacer"><h3>Add Video</h3></label>
  //             <form>
  //             <div class="form-row">
  //               <div class="form-group col-md-6">
  //                 <label for="inputVideoName">Video Name</label>
  //                 <input type="text" class="form-control" id="vidName" placeholder="Video name">
  //               </div>
  //               <div class="form-group col-md-6">
  //                 <label for="inputInstructor">Instructor</label>
  //                 <input type="text" class="form-control" id="instructor" placeholder="Instructor Name">
  //               </div>
  //             </div>
  //             <div class="form-group">
  //               <label for="inputAddress">Description</label>
  //               <input type="text" class="form-control" id="inputDescription" placeholder="Video deiscription">
  //             </div>
  //             <div class="form-row">
  //               <div class="form-group col-md-4">
  //                 <label for="inputCity">Video ID</label>
  //                 <input type="text" class="form-control" id="inputYoutube_id">
  //               </div>
  //               <div class="form-group col-md-4">
  //                 <label for="inputZip">Length</label>
  //                 <input type="text" class="form-control" id="inputVideoLength" placeholder="50 mins">
  //               </div>
  //               <div class="form-group col-md-4">
  //                 <label for="inputCetagory">Cetagory</label>
  //                 <select id="inputCetagory" class="form-control">
  //                   <option selected>Choose Cetagory</option>
  //                   <option>Mod 1</option>
  //                   <option>Mod 2</option>
  //                   <option>Mod 3</option>
  //                   <option>Mod 4</option>
  //                 </select>
  //               </div>
  //             </div>
  //             <button type="submit" class="btn btn-secondary">Create Video</button>
  //           </form>`
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


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
  loginForm.addEventListener('click', function(e){
    e.preventDefault();
    getAllUser();
    e.target.reset()
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

function getAllUser(){
   getAllVideos().then(videos => {
      videos.forEach(video =>{
        video.users.forEach(user => {
          // console.log(user)
          login(user)
        })
      })
    })
}

function login(user){
  // console.log(`${user.username}`) 
  const userInput = document.querySelector('#inputUsername').value
    if (userInput === `${user.username}` && user.status === 'Instructor'){
       console.log('Heyy')
       addVideo('addVideoTab')    
    }
    else if (userInput === `${user.username}` && user.status === 'Student'){
      console.log('hi')
    }
}


function renderVideo(video, tabId){
  console.log(video)
  const modContainer = document.querySelector(`#${tabId}`);
  vidCard = document.createElement('div')
  vidCard.id = `vid-card-${video.id}`
  vidCard.classList.add('vid-card', 'vid-center')
  modContainer.append(vidCard)
  // vidCard.addEventListener('hover', turnGrey)

  vidName = document.createElement('h3')
  vidName.innerText = `${video.name} (${video.instructor})`
  vidCard.appendChild(vidName)

  vidCardIFrame = document.createElement('div')
  vidCardIFrame.id = `vid-${video.id}`
  vidCard.appendChild(vidCardIFrame);

  player = new YT.Player(vidCardIFrame.id, {
    height: '445',
    width: '810',
    videoId: video.youtube_id,
    events: {
      // 'onReady': onPlayerReady//,
      //'onStateChange': onPlayerStateChange
    }
  });
}


function renderVideo2(video, tabId){
  const modContainer = document.querySelector(`#${tabId}`);

    vidCard = document.createElement('div')
    vidCard.id = `vid-card-${video.id}`
    vidCard.classList.add('vid-preview-card')
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
  document.querySelector('#addVideoTab').innerHTML = `<label class="font-weight-bold tab-spacer"><h3>Add Video</h3></label>
              <form>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputVideoName">Video Name</label>
                  <input type="text" class="form-control" id="vidName" placeholder="Video name">
                </div>
                <div class="form-group col-md-6">
                  <label for="inputInstructor">Instructor</label>
                  <input type="text" class="form-control" id="instructor" placeholder="Instructor Name">
                </div>
              </div>
              <div class="form-group">
                <label for="inputAddress">Description</label>
                <input type="text" class="form-control" id="inputDescription" placeholder="Video deiscription">
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label for="inputCity">Video ID</label>
                  <input type="text" class="form-control" id="inputYoutube_id">
                </div>
                <div class="form-group col-md-4">
                  <label for="inputZip">Length</label>
                  <input type="text" class="form-control" id="inputVideoLength" placeholder="50 mins">
                </div>
                <div class="form-group col-md-4">
                  <label for="inputCetagory">Cetagory</label>
                  <select id="inputCetagory" class="form-control">
                    <option selected>Choose Cetagory</option>
                    <option>Mod 1</option>
                    <option>Mod 2</option>
                    <option>Mod 3</option>
                    <option>Mod 4</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-secondary">Create Video</button>
            </form>`
}











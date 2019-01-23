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

})


function getAllVideos(){
  return fetch('http://localhost:3000/api/v1/videos')
  .then(r => r.json())
}

// function renderVideo(video, tabId){
//   console.log(video)
//   const modContainer = document.querySelector(`#${tabId}`);
//   vidCard = document.createElement('div')
//   vidCard.id = `vid-card-${video.id}`
//   vidCard.classList.add('vid-card', 'vid-center')
//   modContainer.append(vidCard)
//
//
//   vidName = document.createElement('h3')
//   vidName.innerText = `${video.name} (${video.instructor})`
//   vidCard.appendChild(vidName)
//
//   vidCardIFrame = document.createElement('div')
//   vidCardIFrame.id = `vid-${video.id}`
//   vidCard.appendChild(vidCardIFrame);
//
//   player = new YT.Player(vidCardIFrame.id, {
//     height: '445',
//     width: '810',
//     videoId: video.youtube_id,
//     events: {
//       // 'onReady': onPlayerReady//,
//       //'onStateChange': onPlayerStateChange
//     }
//   });
// }


function renderVideo2(video, tabId){
  const modContainer = document.querySelector(`#${tabId}`);

  vidCard = document.createElement('div')
  vidCard.id = `vid-card-${video.id}`
  vidCard.classList.add('vid-preview-card')
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

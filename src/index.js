document.addEventListener('DOMContentLoaded', function() {
  window.onYouTubeIframeAPIReady = function() {
    // console.log('ready to embed YT videos')
    getAllVideos().then(videos => {

      const mod1Videos = videos.filter(video => video.category === 'Mod 1')
      mod1Videos.forEach(video => renderVideo(video, 'mod1Tab'))

      const mod2Videos = videos.filter(video => video.category === 'Mod 2')
      mod2Videos.forEach(video => renderVideo(video, 'mod2Tab'))

      const mod3Videos = videos.filter(video => video.category === 'Mod 3')
      mod3Videos.forEach(video => renderVideo(video, 'mod3Tab'))

      const mod4Videos = videos.filter(video => video.category === 'Mod 4')
      mod4Videos.forEach(video => renderVideo(video, 'mod4Tab'))
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

})


function getAllVideos(){
  return fetch('http://localhost:3000/api/v1/videos')
  .then(r => r.json())
}

function renderVideo(video, tabId){
  console.log(video)
  const modContainer = document.querySelector(`#${tabId}`);
  vidCard = document.createElement('div')
  vidCard.id = `vid-card-${video.id}`
  vidCard.classList.add('vid-card', 'vid-center')
  modContainer.append(vidCard)
  
  vidName = document.createElement('h3')
  vidName.innerText = video.name
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


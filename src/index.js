document.addEventListener('DOMContentLoaded', function(){

// addHeader()
getAllVideos()

})

function body(){
  return document.body
}

function addHeader(){
  h1 = document.createElement('h1')
  h1.innerText = "Flatiron School LearnTube 1.0"
  document.body.appendChild(h1)
}

function getAllVideos(){
  fetch('http://localhost:3000/api/v1/videos')
  .then(r => r.json())
  .then(videos => {
    videos.forEach(video => renderVideo(video))
  })
}

function renderVideo(video){
  vidCard = document.createElement('div')
  vidCard.id = `vid-card-${video.id}`
  vidCard.classList.add('vid-card')

    vidName = document.createElement('h2')
    vidName.innerText = `${video.name} (${video.instructor})`
    vidCard.appendChild(vidName)

    vidFrame = document.createElement('iframe')
    vidFrame.classList.add('vid-frame')
    vidFrame.src = video.url
    vidFrame.align = "middle"
    vidCard.appendChild(vidFrame)
  body().appendChild(vidCard)
}


let apiData = document.getElementById('api-data');
let url = 'https://api.artic.edu/api/v1/artworks';

let postArray = [];

let num;
function getPosts(num) {
    let completeUrl = url + '?page=' + num;
    fetch(completeUrl)
        .then(res => res.json())
        .then(data => {
            let artInstChiApiJson = data.data;
            let thumbnailHtml = '';
            artInstChiApiJson.map(function (post, index) {
                let resultImgs = "https://www.artic.edu/iiif/2/" + post.image_id + "/full/843,/0/default.jpg";
                let postId = post.id;
                thumbnailHtml += `
                <div id="api-image-wrapper">
                <img  
                class="api-img-data"  id="api-img-data" 
                src="${resultImgs}" 
                alt="${post.title} ${post.date_end} ${post.artist_titles}" 
                name='${postId}'
                onclick="enlargeImage(${postId});">
                </div> 
                <div id="phone-screen-only"><p><em>${post.title}</em>, ${post.date_end}</p>${post.artist_titles}<p></p></div>      
                `;
                apiData.innerHTML = thumbnailHtml;
                postArray.push(post);
            });
        })
}

let detailTile = document.getElementById('detail-tile');
let hiddenDivHtml = '';
function enlargeImage(postIdEnlarge) {
    postArray.forEach(function (postArrayItem) {
        if (postArrayItem.id === postIdEnlarge) {
            let resultImgsPopup = "https://www.artic.edu/iiif/2/" + postArrayItem.image_id + "/full/843,/0/default.jpg";
            hiddenDivHtml += `
            <div id="close-popup">X</div>
            <div><img id="api-image-clicked" src="${resultImgsPopup}"></div>
            <div><p class="popupImageCaption"><em>${postArrayItem.title}</em>,${postArrayItem.date_end}</p></div>
                <div><p>${postArrayItem.artist_titles}</p></div>
             `;
            detailTile.innerHTML = hiddenDivHtml;
            detailTile.style.visibility = "visible";
            detailTile.style.overflow = "hidden";
            let closePopupButton = document.getElementById('close-popup');
            closePopupButton.addEventListener('click', function () {
                detailTile.style.visibility = "hidden";
                hiddenDivHtml = " ";

            })
        }
    })
}

let pageNext = document.getElementById('page-turn-next');
let pagePrev = document.getElementById('page-turn-prev');
let form = document.getElementById('submit-page-number');

let pageNumber = document.getElementById('pageNumber');

let pageNum = pageNumber.innerHTML;

const hidePrevButton = () => {
    return (pageNum > 1 ? pagePrev.style.display = " inline" : pagePrev.style.display = "none");
}

window.onload = getPosts(1), hidePrevButton();


let nextPage = () => {
    pageNum++;
    pageNumber.innerHTML = pageNum;
    getPosts(pageNum);
    hidePrevButton();
}

let prevPage = () => {
    pageNum--;
    pageNumber.innerHTML = pageNum;
    getPosts(pageNum);
    hidePrevButton();
}

let getPageNumber = (e) => {
    let pageNumberField = document.getElementById('number-field').value;
    e.preventDefault();
    let pageNum = pageNumberField;
    pageNumber.innerHTML = pageNum;
    getPosts(pageNum);
    hidePrevButton();
    form.reset();
}

pageNext.addEventListener('click', nextPage);
pagePrev.addEventListener('click', prevPage);
form.addEventListener('submit', getPageNumber);


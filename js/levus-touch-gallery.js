

const gallery = document.querySelector('.levus-touch-gallery');

const slider = gallery.querySelector('.slides');

// slides
const slides = gallery.querySelectorAll('.slide');

const images = gallery.querySelectorAll('img');

setMaxHeightSlider();

setOptionsThumbs();

window.addEventListener('resize', setMaxHeightSlider);









function setMaxHeightSlider(){
    const maxHeight = Math.max(...[...images].map(image => image.clientHeight));
    slider.style.height = `${maxHeight}px`;
}

function setOptionsThumbs(){
    // thumbs
    const thumbs = gallery.querySelector('.thumbs');

    const length = slides.length;

    thumbs.style.gridTemplateColumns = `repeat(${length * 2},1fr)`;

    thumbs.style.width = `${50 * length}%`;

    images.forEach(image => {
        const clone = image.cloneNode(true);
        thumbs.append(clone);
    });

}
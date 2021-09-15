// TODO: add all gallery
// TODO: fix thumbs animation

{
    const body = document.getElementsByTagName('body')[0];
    const gallery = document.querySelector('.levus-touch-gallery');

    // insert .thumbs div
    const thumbs = document.createElement('div');
    thumbs.className = 'thumbs';
    gallery.append(thumbs);

    // insert .dots ul
    const dots = document.createElement('ul');
    dots.className = 'dots';
    gallery.append(dots);

    // insert icon 'view'
    const icon = document.createElement('div');
    icon.className = 'icon';
    gallery.append(icon);

    setTimeout(() => {
        
        gallery.classList.add('load');
    }, 1000);

    const slider = gallery.querySelector('.slides');

    // slides (origin nodeList)
    let slides = gallery.querySelectorAll('.slides a');

    if(slides.length <= 7){

        for(let slide of slides){

            const clone = slide.cloneNode(true);
            slider.append(clone);
        }
    }

    // get new nodeList
    slides = gallery.querySelectorAll('.slides a');

    const images = gallery.querySelectorAll('img');

    const length = images.length;

    let drag = false;

    let flag = false;

    let shift = '';

    // start drag
    let start = 0;

    // finish drag
    let finish = 0;

    // array slides
    let elements = [];
    
    // fill array 
    for(let i = 0; i < length; i++){

        // last element -100
        if(i === slides.length-1){
            
            elements.push(-100);
            
        } else {
            
            elements.push(i * 100);
        }
    }

    // clone
    const origin = elements.slice(0);

    // create lightbox div
    const lightbox = document.createElement('div');
    lightbox.id = 'levus-lightbox';

    // temp container for lightbox elements 
    let insertData = '';

    // opacity current element
    let opacity = 0;

    // set maximum height of the slider
    setMaxHeightSlider();

    window.addEventListener('resize', setMaxHeightSlider);

    // first render thumbs img
    setThumbsAndDots();

    // first render
    render();

    for(let slide of slides){

        // disable drag image
        slide.addEventListener('dragstart', event => event.preventDefault());

        slide.addEventListener('pointerdown', scrollStart);
        slide.addEventListener('pointermove', scrollMove);
        slide.addEventListener('pointerup', scrollEnd);
        slide.addEventListener('pointercancel', scrollEnd);
        slide.addEventListener('pointerleave', scrollEnd);

        // disable click
        slide.addEventListener('click', clickSlide);
    }

    document.addEventListener('pointerdown', pointerDown);
    document.addEventListener('pointermove', pointerMove);
    document.addEventListener('pointerup', pointerUp);
    document.addEventListener('pointercancel', pointerUp);

    // get created img 
    const thumbsImg = gallery.querySelectorAll('.thumbs img');

    // click to thumbs img
    for(let i = 0; i < length; i++){

        thumbsImg[i].addEventListener('click', () => {
            clickThumb(i);
        });
    }

    // TODO: click icon -- open slide[id]
    gallery.addEventListener('click', event => {

        // click to icon -- for open lightbox
        if(event.target.classList.contains('icon')){

            slides = gallery.querySelectorAll('.slides a');

            for(let i = 0; i < length; i++){
                
                if(slides[i].style.opacity == 1){
                    opacity = 1;
                } else {
                    opacity = 0;
                }

                insertData += `
                    <picture style="transform:translateX(${elements[i]}%);opacity:${opacity}">
                        <img 
                            src="${slides[i].href}" 
                            alt="${slides[i].title}" 
                            draggable="false" 
                            class="levus-lightbox-picture">
                    </picture>`;
            }

            // prepared data to insert to body
            lightbox.innerHTML = insertData;

            // isert data to body
            body.append(lightbox);

            setTimeout(() => {
                
                lightbox.className = 'active';
            }, 60);
        }

        // click dot -- for scroll
        if(event.target.tagName === 'LI'){

            const lis = gallery.querySelectorAll('.dots li');

            const id = event.target.dataset.id;
            
            for(let i = 0; i < length; i++){

                lis[i].classList.remove('active');
                event.target.classList.add('active');
            }

            elements.length = 0;

            // clone
            elements = origin.slice(0);
    
            // assign
            const crop = elements.splice(0,length - id);
            elements.push(...crop);
    
            render();
        }
    });

    // close lightbox
    lightbox.addEventListener('click', event => {

        if(event.target.tagName === 'PICTURE'){

            closeLightbox();
        }
    });

    // close lightbox
    document.addEventListener('keydown', event => {

        // close lightbox
        if(event.key === 'Escape' || event.code === 'Escape'){

            closeLightbox();
        }

        // to left
        if(event.key === 'ArrowLeft' || event.code === 'ArrowLeft'){

            const first = elements.pop();
            elements.unshift(first);

            // if exists (if exists lightbox)
            document.querySelector('#levus-lightbox') && reloadLightbox();

            render();
        }

        // to right
        if(event.key === 'ArrowRight' || event.code === 'ArrowRight'){
            
            const last = elements.shift();
            elements.push(last);

            // if exists (if exists lightbox)
            document.querySelector('#levus-lightbox') && reloadLightbox();

            render();
        }

    });

    function setMaxHeightSlider(){
        const maxHeight = Math.max(...[...images].map(image => image.clientHeight));
        slider.style.height = `${maxHeight}px`;
    }

    function setThumbsAndDots(){

        // thumbs wrapper
        const thumbs = gallery.querySelector('.thumbs');
        
        // dots
        const dots = gallery.querySelector('.dots');

        // place thumbs small images
        for(let i = 0; i < length; i++){

            const thumb = document.createElement('img');
            thumb.src = images[i].dataset.thumb;
            thumbs.append(thumb);

            const li = document.createElement('li');
            li.dataset.id = i;
            dots.append(li);
        }
        
        const imgs = thumbs.querySelectorAll('img');

        // set first element class
        dots.querySelector('li').className = 'active';

        // set transform
        for(let i = 0; i < length; i++){
            
            imgs[i].style.transform = `translateX(${elements[i]}%)`; 
        }
    }

    function scrollStart(event){
        drag = true;

        // where it was pressed
        start = event.pageX;

        this.classList.add('grab');
    }

    function scrollMove(event){
        if(drag){

            // where it was moved
            finish = event.pageX;

            // if to left
            if(finish - start < 0){

                shift = finish - start;

                if(flag === false){

                    flag = true;
                }
            } 
            
            // if to right
            if(finish - start > 0) { 

                shift = Math.abs(start - finish);

                if(flag === false){

                    flag = true;
                }
            }

            this.style.transform = `translateX(${shift}px)`;

            // hide icon
            icon.classList.add('hide');
        }
    }

    function scrollEnd(){

        if(drag){

            // to right
            if(finish - start < 0){
                
                const first = elements.pop();
                elements.unshift(first);
            } 

            // to left
            if(finish - start > 0) {
                
                const last = elements.shift();
                elements.push(last);
            }

            render();

            // set null
            drag = false;

            // set null
            flag = false;

            this.classList.remove('grab');

            // show icon
            setTimeout(() => {
                
                icon.classList.remove('hide');
            }, 240);            
        }
    }

    // TODO: transform elements
    function render(){

        // thumbs images
        const thumbs = gallery.querySelectorAll('.thumbs img');

        // dots lis
        const lis = gallery.querySelectorAll('.dots li');

        for(let i = 0; i < length; i++){

            // set opacity slide img
            slides[i].style.opacity = 0;
            if(elements[i] === 0){

                slides[i].style.opacity = 1;
            }

            slides[i].style.transform = `translateX(${elements[i]}%)`;

            // temp var
            const thumb = thumbs[i];

            // set opacity for thumbs img
            thumb.style.opacity = 0;
            if(elements[i] >= 0 && elements[i] <= 500){

                thumb.style.opacity = 1;
            }

            // render thumbs images
            thumb.style.transform = `translateX(${elements[i]}%)`;

            // temp var
            const li = lis[i];

            // render dots li
            if(elements[i] === 0){

                li.className = 'active';

            } else {
                
                li.className = '';
            }
        }
    }

    // move item after click
    function clickThumb(id){

        // set null
        elements.length = 0;

        // clone
        // elements = [...origin];
        elements = origin.slice(0);

        // assign
        const crop = elements.splice(0,length - id);
        elements.push(...crop);

        render();
    }

    function clickSlide(event){

        event.preventDefault();   
    }

    // lightbox functions

    // close lightbox
    function closeLightbox(){

        setTimeout(() => {
    
            lightbox.classList.remove('active');
        }, 60);
    
        setTimeout(() => {
            
            lightbox.remove();
        }, 480); 

        // clear lightbox content
        insertData = '';
    }

    function pointerDown(event){

        if(event.target.classList.contains('levus-lightbox-picture')){

            flag = true;

            event.target.classList.add('touch');

            start = event.pageX;
        }
    }

    function pointerMove(event){

        if(event.target.classList.contains('levus-lightbox-picture')){

            const el = event.target.parentNode;

            if(flag === true){
            
                finish = event.pageX;

                // if to left
                if(finish - start < 0){

                    // shift = (finish - start) / 2;
                    shift = finish - start;
                } 
                
                // if to right
                if(finish - start > 0) { 

                    // shift = Math.abs(start - finish) / 2;
                    shift = Math.abs(start - finish);
                }

                el.style.transform = `translateX(${shift}%)`;
            }
        }
    }

    function pointerUp(event){

        if(flag === true){

            if(finish - start < 0){

                const first = elements.pop();
                elements.unshift(first);
            } 
            
            if(finish - start > 0) { 

                const last = elements.shift();
                elements.push(last);
            }

            event.target.classList.remove('touch');

            reloadLightbox();
        }

        flag = false;

        render();
    }

    function reloadLightbox(){

        // TODO: this all pictures!
        const newPictures = document.querySelectorAll('#levus-lightbox picture');

        for(let i = 0; i < length; i++){

            if(elements[i] === 0){

                opacity = 1;
            } else {
                
                opacity = 0;
            }

            newPictures[i].style.transform = `translateX(${elements[i]}%)`;
            newPictures[i].style.opacity = opacity;
        }
    }

    // TODO: add description 
}
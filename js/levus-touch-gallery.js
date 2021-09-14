// TODO: клікабельні тумбіки на десктопі (скрол), на мобільному крапки. велике фото має лайтбокс
// TODO: add all gallery
// TODO: fix thumbs animation
// TODO: thumbs crop image
// TODO: replace forEach with for-of

{
    const body = document.getElementsByTagName('body')[0];
    const gallery = document.querySelector('.levus-touch-gallery');

    // insert icon 'view'
    const icon = document.createElement('div');
    icon.className = 'icon';
    gallery.append(icon);

    setTimeout(() => {
        
        gallery.classList.add('load');
    }, 1000);

    const slider = gallery.querySelector('.slides');

    // slides
    let slides = gallery.querySelectorAll('.slide');

    if(slides.length <= 7){

        for(let slide of slides){

            const clone = slide.cloneNode(true);
            slider.append(clone);
        }
    }

    // get new nodeList
    slides = gallery.querySelectorAll('.slide');

    const images = gallery.querySelectorAll('img');

    const length = images.length;

    // мініатюри
    const miniImages = [];

    for(let i of images){

        miniImages.push(i.dataset.thumb);
    }

    // check dragable
    let drag = false;

    // check dragable (for move event)
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
    // const origin = [...elements];
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

    setThumbs();

    window.addEventListener('resize', setMaxHeightSlider);

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

    const thumbs = gallery.querySelectorAll('.thumbs img');

    // click to thumbs img
    for(let i = 0; i < length; i++){

        thumbs[i].addEventListener('click', () => {
            clickThumb(i);
        });
    }

    // TODO: click icon -- open slide[id]
    gallery.addEventListener('click', event => {

        // click to icon -- for open lightbox
        if(event.target.classList.contains('icon')){

            slides = gallery.querySelectorAll('.slide');

            for(let i = 0; i < length; i++){

                // active slide
                if(slides[i].style.opacity == 1){
                    
                    // <picture style="transform:translateX(${elements[i]}%);opacity:${opacity}">
                    insertData += `
                        <picture style="transform:translateX(${elements[i]}%);opacity:1">
                            <img 
                                src="${slides[i].href}" 
                                alt="${slides[i].title}" 
                                draggable="false" 
                                class="levus-lightbox-picture">
                        </picture>`;  

                    // prepared data to insert to body
                    lightbox.innerHTML = insertData;

                    // isert data to body
                    body.append(lightbox);

                    setTimeout(() => {
                        
                        lightbox.className = 'active';
                    }, 60);
                }

            }
        }

        // click dot -- for scroll
        if(event.target.tagName === 'LI'){

            const dots = gallery.querySelectorAll('.dots li');

            const id = event.target.dataset.id;
            
            for(let i = 0; i < length; i++){

                dots[i].classList.remove('active');
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
    });

    function setMaxHeightSlider(){
        const maxHeight = Math.max(...[...images].map(image => image.clientHeight));
        slider.style.height = `${maxHeight}px`;
    }

    function setThumbs(){

        // thumbs wrapper
        const thumbs = gallery.querySelector('.thumbs');
        
        // place thumbs small images
        for(let i = 0; i < length; i++){

            const thumb = document.createElement('img');
            thumb.src = images[i].dataset.thumb;
            thumbs.append(thumb);
        }

        const img = thumbs.querySelectorAll('img');

        // set transform
        for(let i = 0; i < length; i++){
            
            img[i].style.transform = `translateX(${elements[i]}%)`;
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

        // block for dots
        const dots = gallery.querySelector('.dots');

        // temp
        let li = '';
        let lis = '';

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

            // render dots li
            if(elements[i] === 0){

                // dots block
                li = `<li data-id="${i}" class="active"></li>`;

            } else {
                
                // dots block
                li = `<li data-id="${i}"></li>`;
            }

            lis += li;
        }

        dots.innerHTML = lis;
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

        // set default data
        // setTransition();
    }

}
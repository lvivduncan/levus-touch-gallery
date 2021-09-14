// TODO: клікабельні тумбіки на десктопі (скрол), на мобільному крапки. велике фото має лайтбокс
// TODO: add all gallery

{
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

        // TODO: add for 7 item
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            slider.append(clone);
        });
    }

    slides = gallery.querySelectorAll('.slide');

    const images = gallery.querySelectorAll('img');

    const length = images.length;

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
    slides.forEach((slide, index) => {

        // last element -100
        if(index === slides.length-1){
            
            elements.push(-100);
            
        } else {
            
            elements.push(index * 100);
        }
    });

    // clone
    // const origin = [...elements];
    const origin = elements.slice(0);

    // set maximum height of the slider
    setMaxHeightSlider();

    setOptionsThumbs();

    window.addEventListener('resize', setMaxHeightSlider);

    render();

    slides.forEach(slide => {

        // disable drag image
        slide.addEventListener('dragstart', event => event.preventDefault());
        slide.setAttribute('draggable',false);

        slide.addEventListener('pointerdown', scrollStart);
        slide.addEventListener('pointermove', scrollMove);
        slide.addEventListener('pointerup', scrollEnd);
        slide.addEventListener('pointercancel', scrollEnd);
        slide.addEventListener('pointerleave', scrollEnd);

        slide.addEventListener('click', clickSlide);
    });

    // click to thumbs img
    gallery.querySelectorAll('.thumbs img').forEach((image,index) => {
        image.addEventListener('click', () => {
            clickThumb(index);
        });
    });

    function setMaxHeightSlider(){
        const maxHeight = Math.max(...[...images].map(image => image.clientHeight));
        slider.style.height = `${maxHeight}px`;
    }

    function setOptionsThumbs(){

        // thumbs wrapper
        const thumbs = gallery.querySelector('.thumbs');
        
        // place thumbs images
        images.forEach(image => {

            const clone = image.cloneNode(true);
            thumbs.append(clone);
        });

        // set transition
        thumbs.querySelectorAll('img').forEach((image, index, array) => {

            array[index].style.transform = `translateX(${elements[index]}%)`;
        });
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

            console.log(start, finish)

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

    function render(){

        // thumbs images
        const thumbs = gallery.querySelectorAll('.thumbs img');

        slides.forEach((slide, index) => {

            // set opacity slide img
            slide.style.opacity = 0;
            if(elements[index] === 0){

                slide.style.opacity = 1;
            }

            slide.style.transform = `translateX(${elements[index]}%)`;

            // temp var
            const thumb = thumbs[index];

            // set opacity for thumbs img
            thumb.style.opacity = 0;
            if(elements[index] >= 0 && elements[index] <= 500){

                thumb.style.opacity = 1;
            }

            // render thumbs images
            thumb.style.transform = `translateX(${elements[index]}%)`;
        });
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

    // TODO: click icon -- open slide[id]
    // TODO: animation icon (hide before scroll)

    gallery.addEventListener('click', event => {

        if(event.target.classList.contains('icon')){

            console.log('icon click')
        }
    })

}

// TODO: to left, to right drag
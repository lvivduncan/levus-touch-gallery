// TODO: клікабельні тумбіки на десктопі (скрол), на мобільному крапки. велике фото має лайтбокс
// TODO: add all gallery

{
    const gallery = document.querySelector('.levus-touch-gallery');

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
    const elements = [];

    // fill array 
    slides.forEach((slide, index) => {

        elements.push(index * 100 - 100);
    });

    // set maximum height of the slider
    setMaxHeightSlider();

    setOptionsThumbs();

    window.addEventListener('resize', setMaxHeightSlider);

    render();

    slides.forEach(slide => {

        // disable drag image
        slide.querySelector('img').setAttribute('draggable',false);

        slide.addEventListener('touchstart', scrollStart, false);
        slide.addEventListener('touchmove', scrollMove, false);
        slide.addEventListener('touchend', scrollEnd, false);

        // click
        slide.addEventListener('mousedown', scrollStart, false);
        slide.addEventListener('mousemove', scrollMove, false);
        slide.addEventListener('mouseup', scrollEnd, false);
    });

    // click to thumbs img
    document.querySelectorAll('.thumbs img').forEach((image,index) => {
        image.addEventListener('click', () => {
            moveItem(index);
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

        // where they clicked
        start = event.pageX || event.touches[0].clientX;
    }

    function scrollMove(event){
        if(drag){

            // where they dragged
            finish = event.pageX || event.touches[0].clientX;

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
        }
    }

    function scrollEnd(){
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
    }

    function render(){

        // thumbs images
        const images = gallery.querySelectorAll('.thumbs img');

        slides.forEach((slide, index) => {

            // set opacity slide img
            slide.style.opacity = 0;
            if(elements[index] === 0){

                slide.style.opacity = 1;
            }

            slide.style.transform = `translateX(${elements[index]}%)`;

            const img = images[index];

            // set opacity for thumbs img
            img.style.opacity = 0;
            if(elements[index] >= 0 && elements[index] <= 500){

                img.style.opacity = 1;
            }

            // render thumbs images
            img.style.transform = `translateX(${elements[index]}%)`;
        });
    }

    // TODO: render 2 for thumbs + slides (moveItem)

    // move item in elements[]
    function moveItem(id){

        // const img = gallery.querySelectorAll('.thumbs img');

        console.log('id: ', id)

        // // // порівняти різницю між айді та транслейт!
        // for(let i = 1; i < id; i++){

        //     const first = elements.pop();
        //     elements.unshift(first);
        // }

        // for(let i = 1; i < id-1; i++){
        //     const last = elements.shift();
        //     elements.push(last);
        // }

        // показано від 1 до 5 items

        const first = elements.pop();
        if(id === 1){
            // 
        }
        if(id === 2){
            // const last = elements.shift();
            // elements.push(last);

            elements.unshift(first);
        }
        if(id === 3){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 4){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 5){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 6){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        /* if(id === 7){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 8){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 9){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 10){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 11){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 12){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 13){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        }
        if(id === 14){
            // const first = elements.pop();
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
            elements.unshift(first);
        } */




        // // re-render slides
        render();
    }

    // TODO: ширина блоку фіксована для десктопу 

}
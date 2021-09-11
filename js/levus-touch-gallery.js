// TODO: клікабельні тумбіки на десктопі (скрол), на мобільному крапки. велике фото має лайтбокс
// TODO: add all gallery

{
    const gallery = document.querySelector('.levus-touch-gallery');

            // // thumbs wrapper
            // const thumbs = gallery.querySelector('.thumbs');

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
    const elements = [];

    // fill array 
    slides.forEach((slide, index) => {
        
        // last element -100
        if(index === slides.length-1){
            
            elements.push(- 100);
            
        } else {
            
            elements.push(index * 100);
        }
    });

    // set maximum height of the slider
    setMaxHeightSlider();

    setOptionsThumbs();

    window.addEventListener('resize', setMaxHeightSlider);

    render();

    slides.forEach(slide => {

        // disable drag image
        slide.querySelector('img').setAttribute('draggable',false);

        slide.addEventListener('pointerdown', scrollStart);
        slide.addEventListener('pointermove', scrollMove);
        slide.addEventListener('pointerup', scrollEnd);
        slide.addEventListener('pointercancel', scrollEnd);
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

        // // thumbs wrapper
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

        this.classList.remove('grab');
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
            // test
            slide.dataset.id = index;

            // temp var
            const thumb = thumbs[index];

            // set opacity for thumbs img
            thumb.style.opacity = 0;
            if(elements[index] >= 0 && elements[index] <= 500){

                thumb.style.opacity = 1;
            }
            // test
            thumb.dataset.id = index;

            // render thumbs images
            thumb.style.transform = `translateX(${elements[index]}%)`;
        });
    }

    // TODO: render 2 for thumbs + slides (clickThumb)

    // move item in elements[]
    function clickThumb(id){

        console.log('id: ', id)

        // const s = gallery.querySelectorAll('.slide');
        // slides.forEach(slide => slide.style.color = 'red');
        slides.forEach(slide => {
            slide.style.transform = 'translateX(0)';
            slide.style.opacity = 0;
        });

        slides[id].style.opacity = 1;

        console.log(slides[id])

        // const length = gallery.querySelectorAll('img').length;

        // // test 1
        // if(id === 1){

        //     const shift = length - 1;
        //     const crop = elements.splice(0,shift);
        //     elements.push(...crop);

        //     console.log(elements, shift)
        // }

        // const shift = length - id;
        // const crop = elements.splice(0,shift);
        // elements.push(...crop);

        // console.log(elements, shift, length)
        
        // // зміна, якщо клікнуто не на 1 елемент
        // if(id !== 0){

        //     const crop = elements.splice(0, id-length);
        //     elements.push(...crop);
        // }



        // const img = gallery.querySelectorAll('.thumbs img');


        // // // порівняти різницю між айді та транслейт!
        // for(let i = 1; i < id; i++){

        //     const first = elements.pop();
        //     elements.unshift(first);
        // }

        // for(let i = 1; i < id-1; i++){
        //     const last = elements.shift();
        //     elements.push(last);
        // }




        // // re-render slides
        // render();
    }

    // TODO: ширина блоку фіксована для десктопу 

}
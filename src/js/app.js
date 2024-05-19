const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
}; 

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Валидация российского номер
function validateRuPhone(str) {
    return /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(
        str
    );
}

const lockPaddingElements = document.querySelector("header");

function lockBody() {
    let paddingValue = window.innerWidth - document.documentElement.clientWidth;
    if (lockPaddingElements && paddingValue) {
        lockPaddingElements.style.paddingRight = paddingValue + "px"
    }
    document.body.classList.add("_lock")
}

function unlockBody () {
    if (lockPaddingElements) {
        lockPaddingElements.style.paddingRight = ""
    }
    document.body.classList.remove("_lock")
}

function openPopup(popup = undefined) {
    if (popup) {
        lockBody();
        popup.classList.add("popup--open")

    } else {
        console.log("Give me a popup")
    }
}

function closePopup(popup) {
    popup.addEventListener("transitionend", e => {
        unlockBosdy()
    }, { once: true })
    popup.classList.remove("popup--open")
}


function initParallaxEffect(parallax) {
    const parallaxContainer = parallax.closest("[data-parallax]")

    const speed = parallaxContainer.dataset.speed || 0.05;

    const parallaxItemEls = parallaxContainer.querySelectorAll("[data-parallax-item]");

    function moveParallaxItem(el) {
        const distX = coordXPercent - prevPosX;
        const distY = coordYPercent - prevPosY;
        
        const xOffset = el.dataset.x;
        const yOffset = el.dataset.y;

        const xDir = parseInt(el.dataset.xdir) || 1;
        const yDir = parseInt(el.dataset.ydir) || 1;

        prevPosX = prevPosX + distX * speed;
        prevPosY = prevPosY + distY * speed;
        
        el.style.cssText = `transform: translate3d(${-prevPosX / 100 * xOffset * xDir}px, ${-prevPosY / 100 * yOffset * yDir}px, 0)`;
        
        requestAnimationFrame(() => moveParallaxItem(el))
    }
    
    let prevPosX = 0, prevPosY = 0;
    let coordXPercent = 0, coordYPercent = 0;

    Array.from(parallaxItemEls).forEach(parallaxItem => {
        
        moveParallaxItem(parallaxItem);
    })

    // listen on parallax or parallaxContainer
    parallax.addEventListener("mousemove", e => {
        const parallaxContainerClientRect = e.currentTarget.getBoundingClientRect();
        const parallaxContainerWidth = parallaxContainerClientRect.width;
        const parallaxContainerHeight = parallaxContainerClientRect.height;

        const coordX = e.clientX - parallaxContainerClientRect.left - parallaxContainerWidth / 2;
        const coordY = e.clientY - parallaxContainerClientRect.top - parallaxContainerHeight / 2;

        coordXPercent = coordX / parallaxContainerWidth * 100;
        coordYPercent = coordY / parallaxContainerHeight * 100;
    })
}

window.onload = function() {
    const headerEl = document.querySelector(".header");
    const dropdownEls = headerEl.querySelectorAll(".dropdown");
    const burgerMenuEl = headerEl.querySelector(".header__burger");
    const menuEl = headerEl.querySelector(".header__nav")

    document.documentElement.style.setProperty('--scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);        

    Array.from(dropdownEls).forEach(dropdownEl => {
        dropdownEl.addEventListener("click", e => {
            if (e.target.closest(".dropdown__header")) {
                dropdownEl.classList.toggle("dropdown--open")
            }

            if (e.target.closest(".dropdown__list-item")) {
                let dropdownItemEl = e.target.closest(".dropdown__list-item")
                let dropdownHeaderEl = e.currentTarget.querySelector(".dropdown__header")
                dropdownHeaderEl.value = dropdownItemEl.dataset.value
                dropdownHeaderEl.querySelector("span").innerHTML = dropdownItemEl.querySelector("span").innerHTML
                e.currentTarget.querySelector(".dropdown__list-item--selected").classList.remove("dropdown__list-item--selected")
                dropdownItemEl.classList.add("dropdown__list-item--selected")
                dropdownEl.classList.remove("dropdown--open")
            }
        })
    })
    
    burgerMenuEl.addEventListener("click", () => {
        if (burgerMenuEl.classList.contains("header__burger--open")) {
            unlockBody()
        } else {
            lockBody()
        }
        
        burgerMenuEl.classList.toggle("header__burger--open")
        menuEl.classList.toggle("header__nav--open")
    })

    // hero section
    const heroSection = document.querySelector(".hero")

    initParallaxEffect(heroSection.querySelector(".hero__container"))

    const tabEls = document.querySelectorAll(".tab");

    function calcTabLinePosition(tabEl, activeButton = null) {
        if (!activeButton) {
            activeButton = tabEl.querySelector(".tab__button--active")
        }
        tabEl.querySelector(".tab__line").style.cssText = `
            width: ${activeButton.offsetWidth}px;
            transform: translate3D(${activeButton.getBoundingClientRect().x - tabEl.getBoundingClientRect().x}px, 0, 0)
        `
    }

    Array.from(tabEls).forEach(tabEl => {
        calcTabLinePosition(tabEl);
        tabEl.addEventListener("click", e => {
            if (!e.target.closest(".tab__button"))  {
                return
            }

            if (e.target.closest(".tab__button--active")) {
                return
            }

            const currentButtonEl = e.target.closest(".tab__button");
            const currentTabPage = currentButtonEl.dataset.num;

            tabEl.querySelector(".tab__button--active").classList.remove("tab__button--active")
            currentButtonEl.classList.add("tab__button--active")
            
            tabEl.querySelector(".tab__page--active").classList.remove("tab__page--active")
            tabEl.querySelector(".tab__page--" + currentTabPage).classList.add("tab__page--active")
            
            calcTabLinePosition(tabEl,currentButtonEl)
        })
    })

    window.addEventListener("resize", () => {
        Array.from(tabEls).forEach(tabEl => calcTabLinePosition(tabEl))
    })

    // video section
    initParallaxEffect(document.querySelector(".video-section__video"))
    // reviews section
    initParallaxEffect(document.querySelector(".reviews"))
    
    const popupEl = document.querySelector(".popup");

    popupEl.addEventListener("click", e => {
        if (e.target.closest(".popup__close") || !e.target.closest(".popup__content")) {
            closePopup(popupEl);
        }
    })
    document.querySelector(".video-section__video").addEventListener("click", (e) => {
        openPopup(popupEl)
    })
    
    document.addEventListener("keydown", (e) => {
        if (e.which === 27) {
            closePopup(popupEl)
        }
    })

    new Swiper(".reviews .swiper", {
        spaceBetween: 10,
        slidesPerView: "auto",
        freeMode: true,
        slidesOffsetBefore: 10,
        slidesOffsetAfter: 10,
        breakpoints: {
            576: {
                spaceBetween: 20,
            }
        },
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        },
    })

    // Header
    // const headerEl = document.querySelector(".header");

    // const callback = function(entries, observer) {
    //     // элемент в видимой части экрана
    //     // в данном случае это headerEl
    //     if (entries[0].isIntersecting) {
    //         headerEl.classList.remove("header_scroll")
    //     } else {
    //         // элемент пропал с видимой части экрана
    //         headerEl.classList.add("header_scroll")
    //     }
    // }

    // const headerObserver = new IntersectionObserver(callback)
    // headerObserver.observe(headerEl)

    document.querySelectorAll("input[name='phone']").forEach(inputElement => {
        inputElement.addEventListener("keypress", (e) => {
            const length = e.target.value.length;
            if (e.charCode < 48 || e.charCode > 57 || length > 14) {
                e.preventDefault();
                return;
            }
    
            switch (length) {
                case 0: 
                    e.target.value = "8 " ;
                    break;
                case 5:
                case 9:
                case 12:
                    e.target.value += " ";
                    break;
                default:
                    break;
            }
        })
        inputElement.addEventListener("input", e => {e.target.value.length === 2 && (e.target.value = "")})
    })
}

setInterval( function() {
    const show = document.querySelector('strong[data-show]')
    const next = show.nextElementSibling || document.querySelector('strong:first-child')
    const up = document.querySelector('strong[data-up]')


    if (up) {
        up.removeAttribute('data-up')
    }

    show.removeAttribute('data-show')
    show.setAttribute('data-up', '')

    next.setAttribute('data-show', '')

}, 2000);
const toggleNavMenu = () => {
  var siteLinks = document.querySelector('#mobile_site_links')
  const isHidden = siteLinks.classList.contains('hidden')

  if (isHidden) {
    siteLinks.classList.remove('hidden')
  } else {
    siteLinks.classList.add('hidden')
  }
}

// custom events to be added to <popup>
const popupCloseEvent = new Event('close')
const popupClosingEvent = new Event('closing')
const popupClosedEvent = new Event('closed')
const popupOpeningEvent = new Event('opening')
const popupOpenedEvent = new Event('opened')
const popupRemovedEvent = new Event('removed')

// track opening
const popupAttrObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(async (mutation) => {
    if (mutation.attributeName === 'data-open') {
      const popup = mutation.target

      document.querySelector('html').classList.add('hide-scroll')

      const isOpen = popup.hasAttribute('data-open')
      if (!isOpen) return

      popup.removeAttribute('data-inert')

      // set focus
      const focusTarget = popup.querySelector('[autofocus]')
      focusTarget ? focusTarget.focus() : popup.querySelector('button').focus()

      popup.dispatchEvent(popupOpeningEvent)
      await animationsComplete(popup)
      popup.dispatchEvent(popupOpenedEvent)
    }
  })
})

// track deletion
const popupDeleteObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((removedNode) => {
      const isPopup = removedNode.classList.contains('popup-container')
      if (isPopup) {
        removedNode.removeEventListener('click', lightDismiss)
        removedNode.removeEventListener('close', popupClose)
        removedNode.addEventListener('closed', popupClosed)
        removedNode.dispatchEvent(popupRemovedEvent)
      }
    })
  })
})

// wait for all popup animations to complete their promises
const animationsComplete = (element) =>
  Promise.allSettled(
    element.getAnimations().map((animation) => animation.finished)
  )

// click outside the popup handler
const lightDismiss = ({ target: popup }) => {
  const isPopup = popup.classList.contains('popup-container')
  if (isPopup) {
    popup.close()
  }
}

const closePopup = ({ target: button }) => {
  const popup = button.closest('.popup-container')
  popup.close()
}

const popupClose = async ({ target: popup }) => {
  popup.setAttribute('data-inert', '')
  popup.dispatchEvent(popupClosingEvent)

  await animationsComplete(popup)

  popup.dispatchEvent(popupClosedEvent)
}

const popupClosed = async ({ target: popup }) => {
  popup.removeAttribute('data-inert')
  popup.setAttribute('data-closed', '')
  document.querySelector('html').classList.remove('hide-scroll')
}

const setupPopup = async (popup) => {
  popup.open = () => {
    popup.removeAttribute('data-closed')
    popup.setAttribute('data-open', '')
  }

  popup.close = async () => {
    popup.removeAttribute('data-open')
    popup.setAttribute('data-inert', '')
    popup.dispatchEvent(popupClosingEvent)

    await animationsComplete(popup)

    popup.dispatchEvent(popupClosedEvent)
  }

  popup.addEventListener('click', lightDismiss)
  popup.addEventListener('close', popup.close)
  popup.addEventListener('closed', popupClosed)

  popupAttrObserver.observe(popup, {
    attributes: true,
  })
  popupDeleteObserver.observe(document.body, {
    attributes: false,
    subtree: false,
    childList: true,
  })

  await animationsComplete(popup)
  popup.removeAttribute('loading')
}

document.querySelectorAll('.popup-container').forEach((popup) => {
  setupPopup(popup)
  popup.querySelector('.popup-close').addEventListener('click', closePopup)
})

window.addEventListener('visibilitychange', (e) => {
  e.preventDefault()
  if (document.hidden) {
    const newsletterPopup = document.querySelector('#popup-newsletter')
    newsletterPopup.open()
  }
})

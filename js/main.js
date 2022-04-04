const toggleNavMenu = () => {
  var siteLinks = document.querySelector('#mobile_site_links')
  const isHidden = siteLinks.classList.contains('hidden')

  if (isHidden) {
    siteLinks.classList.remove('hidden')
  } else {
    siteLinks.classList.add('hidden')
  }
}

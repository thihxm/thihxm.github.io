AFRAME.registerComponent('clicker', {
  init: function () {
    const cameraEl = document.querySelector('a-camera')
    const uiEl = document.querySelector('#ui')
    let position, cameraPos
    this.el.addEventListener('click', (e) => {
      position = this.el.object3D.position
      cameraPos = cameraEl.object3D.position
      const boxName = this.el.getAttribute('data-name')
      uiEl.textContent = `Você clicou em ${boxName}!`
    })
  },
})

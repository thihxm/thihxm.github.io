window.onload = () => {
  let testEntitiesAdded = false
  const el = document.querySelector('[gps-new-camera]')
  el.addEventListener('gps-camera-update-position', (e) => {
    if (!testEntitiesAdded) {
      // alert(
      //   `Initial position: ${e.detail.position.longitude} ${e.detail.position.latitude}`
      // )
      // Add four boxes to the north (red), south (yellow), west (blue)
      // and east (red) of the initial GPS position
      const properties = [
        {
          name: 'Vermelha',
          color: 'red',
          latDis: 0.001,
          lonDis: 0,
        },
        {
          name: 'Amarela',
          color: 'yellow',
          latDis: -0.001,
          lonDis: 0,
        },
        {
          name: 'Azul',
          color: 'blue',
          latDis: 0,
          lonDis: -0.001,
        },
        {
          name: 'Pedro',
          color: 'green',
          latDis: 0,
          lonDis: 0.001,
        },
      ]
      for (const prop of properties) {
        const entity = document.createElement('a-box')
        entity.setAttribute('scale', {
          x: 20,
          y: 20,
          z: 20,
        })
        entity.setAttribute('material', { color: prop.color })
        entity.setAttribute('data-name', prop.name)
        entity.setAttribute('gps-new-entity-place', {
          latitude: e.detail.position.latitude + prop.latDis,
          longitude: e.detail.position.longitude + prop.lonDis,
        })
        entity.setAttribute('clicker', {})
        document.querySelector('a-scene').appendChild(entity)
      }

      const text = document.createElement('a-text')
      text.setAttribute('value', 'Clique em mim!')
      text.setAttribute('scale', {
        x: 50,
        y: 50,
        z: 50,
      })
      text.object3D.position.set(0, 20, 0)
      text.setAttribute('gps-new-entity-place', {
        latitude: e.detail.position.latitude,
        longitude: e.detail.position.longitude + 0.0005,
      })
      text.setAttribute('look-at', '[gps-new-camera]')
      text.setAttribute('align', 'center')
      document.querySelector('a-scene').appendChild(text)

      const sound = document.createElement('a-sound')
      sound.setAttribute(
        'src',
        'https://cdn.aframe.io/basic-guide/audio/backgroundnoise.wav'
      )
      sound.setAttribute('autoplay', true)
      sound.setAttribute('loop', true)
      sound.setAttribute('gps-new-entity-place', {
        latitude: e.detail.position.latitude - 0.0005,
        longitude: e.detail.position.longitude,
      })
      sound.object3D.position.set(-3, 1, -4)
      document.querySelector('a-scene').appendChild(sound)

      testEntitiesAdded = true
    }
  })
}

const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const formualrio = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputChat')
const contenidoProtegido = document.querySelector('#contenidoProtegido')

firebase.auth().onAuthStateChanged(user => {
    console.log(user)
    if(user){
        botones.innerHTML = /*html*/`
        <button class="btn btn-outline-danger" id="btnCerrarSesion">Cerrar Sesión</button>
        `
        nombreUsuario.innerHTML = user.displayName
        cerrarSesion()

        formualrio.classList = 'input-group py-3 fixed-bottom container'

        contenidoChat(user)

    }else{
        botones.innerHTML = /*html*/`
        <button class="btn btn-outline-success mr-2" id="btnAcceder">Acceder</button>
        `
        iniciarSesion()
        nombreUsuario.innerHTML = "ChatW"
        formulario.classList = 'input-group py-3 fixed-bottom container d-none'

        contenidoProtegido.innerHTML = /*html*/ `
        <p class="text-center load mt-5">Debes iniciar Sesion</p>
        `
        
    }
})

const contenidoChat = (user) =>{
    formulario.addEventListener('submit', (e) => {
        e.preventDefault()

        if(!inputChat.value.trim()){
            return
        }

        firebase.firestore().collection('chatcol').add({
            texto:inputChat.value,
            uid:user.uid,
            fecha: Date.now()
        })
            .then(res => {console.log('mensaje guardado')})
            .catch(e => console.log(e))

        inputChat.value = ''
    })

    firebase.firestore().collection('chatcol').orderBy('fecha')
        .onSnapshot(query => {
            console.log(query)
            contenidoProtegido.innerHTML = ''
            query.forEach(doc => {
                console.log(doc.data())
                if(doc.data().uid === user.uid){
                    contenidoProtegido.innerHTML += `
                    <div class="d-flex justify-content-end">
                        <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
                    </div>
                    `
                }else{
                    contenidoProtegido.innerHTML += `

                    <div class="d-flex">
                        <span class="badge badge-pill badge-secondary">${doc.data().uid + ": "+doc.data().texto}</span>
                    </div>
                    `

                }
                contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight
            })
        })
}

const cerrarSesion = () =>{
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion')
    btnCerrarSesion.addEventListener('click',() => {
        firebase.auth().signOut()
    } )
}

const iniciarSesion = () => {
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => {
        try{
            const provider = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider)
        } catch{
            console.log(error)
        }

    })
}
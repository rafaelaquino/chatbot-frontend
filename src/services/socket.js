import { io } from 'socket.io-client'
import { ref } from 'vue'

class SocketService {
  constructor() {
    this.socket = null
    this.connected = ref(false)
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    this.socket.on('connect', () => {
      console.log('🔌 Conectado a Socket.IO')
      this.connected.value = true
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado de Socket.IO')
      this.connected.value = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión Socket.IO:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected.value = false
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket no conectado')
    }
  }

  subscribeToConversacion(numero) {
    this.emit('subscribe:conversacion', numero)
  }

  unsubscribeFromConversacion(numero) {
    this.emit('unsubscribe:conversacion', numero)
  }
}

export default new SocketService()
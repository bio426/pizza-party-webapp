import {ref} from "vue"

let showMapsModal = ref(false)

export default function(){

  function toogleMapsModal(){
    showMapsModal.value = !showMapsModal.value
  }

  return {
    showMapsModal,
    toogleMapsModal
  }
}
<template>
    <button 
    @click="handleClicked"
    class="text-2xl font-sants bg-purple-700 text-white px-2 py-1"
    >
    You clicked {{ times }} times
    </button>
</template>
    
<script setup >
import { ref } from 'vue';
const times = ref(0)
function handleClicked() {
    times.value++
}
</script>
    
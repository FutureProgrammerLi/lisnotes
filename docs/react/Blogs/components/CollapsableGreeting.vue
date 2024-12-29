<template>
    <details>
        <Greeting :person="person"/>
    </details>
</template>
    
<script setup>
import Greeting from './Greeting.vue'
const props = defineProps({
    person: {
        type: Object,
        default:{
            firstName:'Alice',
            birthYear:1970
        }
    }
})
</script>
    
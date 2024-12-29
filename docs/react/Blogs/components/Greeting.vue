<template>
    <p class="text-2xl font-sants text-purple-400 dark:text-purple-500">
        Hello <i>{{person.firstName}}</i>!
    </p>
</template>

<script setup>
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
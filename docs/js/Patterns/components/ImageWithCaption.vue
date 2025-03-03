<script setup>
defineProps({
    src: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: '',
        required: true
    }
})
</script>

<template>
    <div className="text-center">
        <img :src="src" :alt="caption"  className="mx-auto my-0"/>
        <span className="text-sm text-gray-500">{{ caption }}</span>
    </div>
</template>

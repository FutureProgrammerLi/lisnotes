<template>
    <section>
        <h1 class="text-3xl font-sans pb-2">Welcome</h1>
        <CollapsableGreeting :person="alice" />
        <CollapsableGreeting :person="bob" />
        <CollapsableGreeting :person="crystal" />
    </section>
</template>
    
<script setup>
import CollapsableGreeting from './CollapsableGreeting.vue';
const alice = {
    firstName: "Alice",
}
const bob = {
    firstName: "Bob",
}
const crystal = {
    firstName: "Crystal",
}
</script>
    
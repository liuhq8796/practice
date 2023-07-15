<template>
    <div><span>{{ msg }}</span></div>
</template>

<script>
export default {
    setup() {
        const msg = 'Hello World'

        return {
            msg
        }
    }
}
</script>
<script>
export default {
    name: 'App',
}
</script>

<template>
    <RouterView />
</template>

<style>
body {
    background-color: #2f2f2f;
    color: white;
}

h1 {
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
    color: #64BCA4;
}

h2 {
    font-weight: 700;
    font-size: 1.3rem;
}

.delete-all-button {
    background-color: rgb(249, 87, 87);
    color: rgb(64, 21, 21);

    border: 3px solid rgb(64, 21, 21);
    border-radius: 10px;

    font-weight: bold;

    padding: .5rem 1rem;
}
</style>

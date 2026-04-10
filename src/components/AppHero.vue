<script>
export default {
    name: 'AppHero',
    data() {
        return {
            product: '',
            price: '',
            items: [],
            visible: false,
            timer: null,
        }
    },
    mounted() {
        const products = localStorage.getItem('products');
        if (products) {
            this.items = JSON.parse(products);
        }
    },
    methods: {
        addProduct() {
            if (!this.product.trim() || this.price == 0) return;
            this.items.push({ product: this.product.trim(), price: this.price });
            localStorage.setItem('products', JSON.stringify(this.items));

            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.visible = true;
            this.timer = setTimeout(() => {
                this.visible = false;
            }, 2000);

            this.product = '';
            this.price = '';
        },
        clearStorage() {
            localStorage.removeItem('products');
            this.items = [];
        },
        removeProduct(index) {
            this.items.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(this.items));
        }
    }
}
</script>

<template>
    <section class="row m-2 my-4 py-5 m-md-4  py-md-5 position-relative">
        <div class="col-12">
            <div class="row justify-content-around gap-5 mb-5 pb-5">
                <form @submit.prevent="addProduct" class="col-12 col-md-6 d-flex flex-column align-items-center">
                    <div class="w-100 w-md-50 d-flex flex-column mb-4">
                        <label for="producto">Ingresá un producto a vender hoy</label>
                        <input type="text" id="producto" v-model="product" placeholder="Ej: Cerveza IPA"
                            class="form-control">
                    </div>
                    <div class="w-100 w-md-50 d-flex flex-column mb-4">
                        <label for="precio">Ingresá el precio (solo número)</label>
                        <input type="number" id="precio" v-model="price" placeholder="Ej: 4000" class="form-control">
                    </div>
                    <button type="submit" class="add-button">Agregar</button>
                </form>
                <div class="col-12 col-md-6">
                    <ul class="list-unstyled ">
                        <li v-for="(item, index) in items" :key="index" class="mb-4 list-item-box">
                            <p class="my-auto py-2 list-item-name">
                                {{ item.product }}
                            </p>
                            <p class="my-auto py-2 list-item-price">
                                $ {{ item.price }}
                            </p>
                            <button type="button" @click="removeProduct(index)" class="list-item-delete">
                                Eliminar
                            </button>
                        </li>
                    </ul>
                    <form v-if="items[0]" @submit.prevent="clearStorage" class="d-flex justify-content-center">
                        <button type="submit" class="delete-all-button">Borrar todo</button>
                    </form>
                </div>
            </div>
            <div class="row">
                <RouterLink :to="`/compras`" class="w-100 px-4 py-2 start-selling">Comenzar a vender</RouterLink>
            </div>
        </div>
        <transition name="fade">
            <div v-if="visible"
                class="position-absolute top-0 left-0 p-2 d-flex justify-content-between align-items-center notification-modal">
                <small class="m-0 p-0">
                    Producto agregado
                </small>
            </div>
        </transition>
    </section>
</template>

<style scoped>
.notification-modal {
    color: #003405;
    background-color: oklch(from currentColor calc(l + .5) c h);

    border: 2px solid currentColor;
    border-radius: 5px;
}

.fade-leave-active {
    transition: all .3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.notification-modal div button {
    background: none;
    border: none;
    color: currentColor;
}

.list-item-box {
    display: grid;
    grid-template-columns: 2fr repeat(2, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
}

.list-item-name {
    grid-area: 1 / 1 / 2 / 2;
}

.list-item-price {
    grid-area: 1 / 2 / 2 / 3;
}

.list-item-delete {
    grid-area: 1 / 3 / 2 / 4;
    background-color: transparent;
    border: 2px solid rgb(227, 134, 134);
    border-radius: 10px;
    color: rgb(227, 134, 134);
    font-weight: 500;
}

.add-button {
    border: 3px solid #33162c;
    border-radius: 10px;

    font-weight: bold;

    background-color: #bc6ca8;
    color: #33162c;

    padding: .5rem 1rem;
}

.start-selling {
    background-color: #64BCA4;
    color: #164129;

    border: 3px solid #164129;
    border-radius: 10px;

    font-weight: bold;
    text-decoration: none;
    text-align: center;
}
</style>
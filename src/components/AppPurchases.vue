<script>
export default {
    name: 'AppPurchases',
    data() {
        return {
            stock: [],
            paidWithCash: [],
            paidWithMercado: [],
            visible: false,
            timer: null,
        }
    },
    mounted() {
        const stock = localStorage.getItem('productos');
        if (stock) {
            this.stock = JSON.parse(stock);
        }
        const cashProducts = localStorage.getItem('cash');
        if (cashProducts) {
            this.paidWithCash = JSON.parse(cashProducts);
        }
        const mercadoProducts = localStorage.getItem('mercadoPago');
        if (mercadoProducts) {
            this.paidWithMercado = JSON.parse(mercadoProducts);
        }
    },
    methods: {
        withCash(item) {
            this.paidWithCash.push({ product: item.product, price: item.price });
            localStorage.setItem('cash', JSON.stringify(this.paidWithCash));

            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.visible = true;
            this.timer = setTimeout(() => {
                this.visible = false;
            }, 2000);
        },
        withMercado(item) {
            this.paidWithMercado.push({ product: item.product, price: item.price });
            localStorage.setItem('mercadoPago', JSON.stringify(this.paidWithMercado));

            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.visible = true;
            this.timer = setTimeout(() => {
                this.visible = false;
            }, 2000);
        }
    },
}
</script>

<template>
    <section class="m-2 my-4 pb-4 m-md-4 py-md-4 position-relative">
        <RouterLink :to="`/`" class="go-back">Volver</RouterLink>
        <div class="row m-2 mt-4">
            <ul class="list-unstyled col-12 col-md-8 mx-md-auto">
                <li v-for="(item, index) in stock" :key="index" class="row mb-5 align-items-md-center">
                    <div class="col-md-6 px-4 d-flex justify-content-between">
                        <p class="m-md-0">
                            <strong>{{ item.product }}</strong>
                        </p>
                        <p class="m-md-0">
                            $ {{ item.price }}
                        </p>
                    </div>
                    <div class="col-md-6 d-flex justify-content-between">
                        <form @submit.prevent="withCash(item)" class="w-50">
                            <button type="submit"
                                class="p-2 d-flex align-items-center justify-content-center cash-button">
                                <img src="@/assets/img/icon-cash.svg" alt="Ícono Efectivo" class="img img-fluid w-25">
                            </button>
                        </form>
                        <form @submit.prevent="withMercado(item)" class="w-50">
                            <button type="submit"
                                class="p-2 d-flex align-items-center justify-content-center mercado-button">
                                <img src="@/assets/img/icon-mercadopago.svg" alt="Ícono MercadoPago"
                                    class="img img-fluid w-25">
                            </button>
                        </form>
                    </div>
                </li>
            </ul>
        </div>
        <RouterLink :to="`/detalle`" class="end-shift">Finalizar turno</RouterLink>
        <transition name="fade">
            <div v-if="visible"
                class="w-100 position-absolute top-0 left-0 p-2 d-flex justify-content-between align-items-center notification-modal">
                <small class="m-0 p-0">
                    Producto comprado
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
    color: currentColor;

    border: none;
}

.go-back {
    border: 2px solid white;
    border-radius: 10px;

    padding: .2rem 1rem;
    margin: 1rem;

    text-decoration: none;
    color: white;
}

.cash-button {
    background-color: #66f485;

    border: 3px solid #164129;
    border-radius: 5px;

    height: 50px;
}

.mercado-button {
    background-color: #669cf4;

    border: 3px solid #164129;
    border-radius: 5px;

    height: 50px;
}

.end-shift {
    background-color: #bc6ca8;
    color: #33162c;

    text-decoration: none;
    font-weight: bold;

    border: 3px solid #33162c;
    border-radius: 10px;

    padding: .5rem 1rem;
}
</style>
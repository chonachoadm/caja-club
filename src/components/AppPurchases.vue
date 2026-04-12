<script>
export default {
    name: 'AppPurchases',
    data() {
        return {
            stock: [],
            order: [],
            orderTotal: 0,
            paidWithCash: [],
            paidWithMercado: [],
            visible: false,
            timer: null,
        }
    },
    mounted() {
        const stock = localStorage.getItem('products');
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
        addToOrder(item) {
            this.order.push({ product: item.product, price: item.price });
            this.orderTotal += item.price;
        },
        removeProduct(index) {
            this.orderTotal -= this.order[index].price;
            this.order.splice(index, 1);
        },
        withCash() {
            for (const item of this.order) {
                this.paidWithCash.push({ product: item.product, price: item.price });
            }
            localStorage.setItem('cash', JSON.stringify(this.paidWithCash));
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.visible = true;
            this.timer = setTimeout(() => {
                this.visible = false;
            }, 2000);
            this.order = [];
            this.orderTotal = 0;
        },
        withMercado() {
            for (const item of this.order) {
                this.paidWithMercado.push({ product: item.product, price: item.price });
            }
            localStorage.setItem('mercadoPago', JSON.stringify(this.paidWithMercado));
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.visible = true;
            this.timer = setTimeout(() => {
                this.visible = false;
            }, 2000);
            this.order = [];
            this.orderTotal = 0;
        },
    }
}
</script>

<template>
    <section class="m-2 my-4 pb-4 m-md-4 py-md-4 position-relative">
        <RouterLink :to="`/`" class="go-back">Volver</RouterLink>
        <div class="divider-grid">
            <div class="product-section">
                <h1>
                    Productos
                </h1>
                <ul class="list-unstyled item-list">
                    <li v-for="(item, index) in stock" :key="index" class="item" @click="addToOrder(item)">
                        <div>
                            <h2>
                                {{ item.product }}
                            </h2>
                            <p>
                                ${{ item.price }}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="order-section">
                <h3>
                    Pedido:
                </h3>
                <ul class="list-unstyled">
                    <li v-for="(item, index) in order" :key="index" class="py-3 order-list-item">
                        <div class="d-flex align-items-center justify-content-between">
                            <p class="m-0">
                                {{ item.product }}
                            </p>
                            <small>
                                $ {{ item.price }}
                            </small>
                            <button type="button" @click="removeProduct(index)" class="list-item-delete">
                                Eliminar
                            </button>
                        </div>
                    </li>
                </ul>
                <div>
                    <button type="button" class="btn payment-method-button" data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop">
                        Ir a pagar
                    </button>
                    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
                        tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h3 class="modal-title fs-5" id="staticBackdropLabel">Método de pago</h3>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <ul class="list-unstyled">
                                        <li v-for="(orderItem, index) in order" :key="index">
                                            <div class="w-50 w-md-25 d-flex justify-content-between align-items-center">
                                                <p class="m-0">
                                                    {{ orderItem.product }}
                                                </p>
                                                <small>
                                                    $ {{ orderItem.price }}
                                                </small>
                                            </div>
                                        </li>
                                    </ul>
                                    <p>
                                        <strong>Total: $ {{ orderTotal }}</strong>
                                    </p>
                                </div>
                                <div class="modal-footer payment-buttons">
                                    <form @submit.prevent="withCash(item)">
                                        <button type="submit" data-bs-dismiss="modal"
                                            class="p-2 d-flex align-items-center justify-content-center cash-button">
                                            <img src="@/assets/img/icon-cash.svg" alt="Ícono Efectivo"
                                                class="img img-fluid w-25">
                                        </button>
                                    </form>
                                    <form @submit.prevent="withMercado(item)">
                                        <button type="submit" data-bs-dismiss="modal"
                                            class="p-2 d-flex align-items-center justify-content-center mercado-button">
                                            <img src="@/assets/img/icon-mercadopago.svg" alt="Ícono MercadoPago"
                                                class="img img-fluid w-25">
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <RouterLink :to="`/detalle`" class="end-shift">Finalizar turno</RouterLink>
        <transition name="fade">
            <div v-if="visible"
                class="w-100 position-absolute top-0 left-0 p-2 d-flex justify-content-between align-items-center notification-modal">
                <small class="m-0 p-0">
                    Orden procesada correctamente
                </small>
            </div>
        </transition>
    </section>
    <div>

    </div>
</template>

<style scoped>
.divider-grid {
    display: grid;
    grid-template-columns: 3fr 1fr;
}

.product-section {
    border-right: 2px solid white;
}

.order-section {
    padding: 0 2em;
}

.item-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    text-align: center;
    padding: 0 3em;
}

.item {
    display: flex;
    justify-content: center;
    justify-self: center;
    align-items: center;
    border: 1px solid #64BCA4;
    border-radius: 10px;
    width: 30%;
    padding: 1em 8em;
    margin-top: 3em;
    transition: all .2s ease;
}

.item:hover {
    background-color: rgba(185, 255, 214, 0.2);
}

.order-list-item:not(:last-child) {
    border-bottom: 1px solid white;
}

.list-item-delete {
    grid-area: 1 / 3 / 2 / 4;
    background-color: transparent;
    border: 2px solid rgb(227, 134, 134);
    border-radius: 10px;
    color: rgb(227, 134, 134);
    font-weight: 500;
}

.payment-method-button {
    background-color: #64BCA4;
    color: #164129;

    border: 3px solid #164129;
    border-radius: 10px;

    font-weight: bold;
    text-decoration: none;
    text-align: center;
}

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


.payment-buttons {
    display: flex;
    justify-content: space-around;
}

form {
    width: 40%;
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

.go-back {
    border: 2px solid white;
    border-radius: 10px;

    padding: .2rem 1rem;
    margin: 1rem;

    text-decoration: none;
    color: white;
}

@media (width < 1400px) {
    .divider-grid {
        display: block;
        margin-block: 3em;
    }

    .product-section {
        border: none;
    }

    .item-list {
        padding: 0 1em;
    }

    .item {
        width: 30%;
        padding: 1em 5em;
        margin-top: 3em;
        transition: all .2s ease;
    }
}

@media (width <=900px) {
    .item-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0 1em;
    }

    .item {
        width: 40%;
        padding: 1em 4em;
        margin-top: 3em;
        margin-inline: 1em;
        transition: all .2s ease;
    }
}
</style>
<script>
export default {
    name: 'AppSpread',
    data() {
        return {
            totalProducts: [],
            productCount: {},
            paidWithCash: [],
            paidWithMercado: [],
            totalCash: 0,
            totalMercado: 0,
        }
    },
    mounted() {
        const totalProducts = localStorage.getItem('products');
        if (totalProducts) {
            this.totalProducts = JSON.parse(totalProducts);
        };
        const cashProducts = localStorage.getItem('cash');
        if (cashProducts) {
            this.paidWithCash = JSON.parse(cashProducts);
        };
        const mercadoProducts = localStorage.getItem('mercadoPago');
        if (mercadoProducts) {
            this.paidWithMercado = JSON.parse(mercadoProducts);
        };
        for (const item of this.paidWithCash) {
            this.totalCash += item.price
        };
        for (const item of this.paidWithMercado) {
            this.totalMercado += item.price
        };

        const allSales = [
            ...this.paidWithCash,
            ...this.paidWithMercado
        ];

        this.productCount = {};

        for (const product of allSales) {
            const key = product.product;
            if (this.productCount[key]) {
                this.productCount[key]++;
            } else {
                this.productCount[key] = 1;
            }
        }
        console.log(this.productCount);
    },
    methods: {
        clearSpread() {
            localStorage.removeItem('cash');
            localStorage.removeItem('mercadoPago');
            this.paidWithCash = [];
            this.paidWithMercado = [];
            this.totalCash = 0;
            this.totalMercado = 0;
        }
    }
}
</script>

<template>
    <section class="m-2 my-4 pb-4 m-md-4 p-md-4">
        <RouterLink :to="`/compras`" class="go-back">Seguir vendiendo</RouterLink>
        <div class="row m-2 mt-4">
            <div class="my-4">
                <h1 class="text-decoration-underline">
                    Ventas del día
                </h1>
            </div>
            <div class="d-flex justify-content-around align-items-center flex-wrap">
                <div v-for="(amount, product) in this.productCount" :key="product" class="d-flex flex-column align-items-center all-sales-box">
                    <h4>{{ product }}</h4>
                    <p>{{ amount }}</p>
                </div>
            </div>
            <div v-if="totalCash !== 0" class="my-4">
                <h2>
                    Efectivo:
                </h2>
                <ul class="list-unstyled m-0">
                    <li v-for="(item, index) in paidWithCash" :key="index" class="mx-4 d-flex justify-content-between spread-list-item">
                        <p class="my-2">
                            {{ item.product }}
                        </p>
                        <p class="my-2">
                            $ {{ item.price }}
                        </p>
                    </li>
                </ul>
                <p class="my-4 total-amount">Total: <strong>$ {{ totalCash }}</strong> en efectivo</p>
            </div>
            <div v-if="totalMercado !== 0" class="my-4">
                <h2>
                    MercadoPago:
                </h2>
                <ul class="list-unstyled m-0">
                    <li v-for="(item, index) in paidWithMercado" :key="index"
                        class="mx-4 d-flex justify-content-between spread-list-item">
                        <p class="my-2">
                            {{ item.product }}
                        </p>
                        <p class="my-2">
                            $ {{ item.price }}
                        </p>
                    </li>
                </ul>
                <p class="my-4 total-amount">Total: <strong>$ {{ totalMercado }}</strong> con MercadoPago</p>
            </div>
            <button type="button" class="delete-all-button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Vaciar el detallado
            </button>
        </div>
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title fs-5" id="exampleModalLabel">Estás segurx?</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Una vez vacío no se puede recuperar
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button @click="clearSpread" type="button" class="delete-all-button" data-bs-dismiss="modal">Sí,
                            eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.go-back {
    border: 2px solid white;
    border-radius: 10px;

    padding: .2rem 1rem;
    margin: 1rem;

    text-decoration: none;
    color: white;
}

.total-amount {
    font-size: 1.1rem;
    text-align: center;
}

.spread-list-item:not(:last-child) {
    border-bottom: 1px solid rgb(181, 181, 181);
}
.all-sales-box {
    width: 100px;
}
</style>
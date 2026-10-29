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
            wppNumber: '5491150202010',
            copyStatus: '',
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
        formatDateTime(value) {
            return new Intl.DateTimeFormat('es-AR', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(value));
        },
        formatDate(value = new Date()) {
            return new Intl.DateTimeFormat('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(new Date(value));
        },
        clearSpread() {
            localStorage.removeItem('cash');
            localStorage.removeItem('mercadoPago');
            this.paidWithCash = [];
            this.paidWithMercado = [];
            this.totalCash = 0;
            this.totalMercado = 0;
            this.totalProducts = [];
            this.productCount = {};
        },
        buildSalesMessage() {
            const productsMessage = Object.entries(this.productCount)
                .map(([product, amount]) => `- ${product}: ${amount}`)
                .join('\n');
            return `VENTAS ${this.formatDate()}\n\n${productsMessage}`;
        },
        async copySalesMessage() {
            try {
                await navigator.clipboard.writeText(this.buildSalesMessage());
                this.copyStatus = 'Copiado al portapapeles';
            } catch (error) {
                console.error('Could not copy sales message:', error);
                this.copyStatus = 'No se pudo copiar. Revisa los permisos del navegador.';
            }
        },
        sendViaWpp() {
            const message = this.buildSalesMessage();
            const url = `https://wa.me/${this.wppNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        },
    }
}
</script>

<template>
    <section class="m-2 my-4 pb-4 m-md-4 p-md-4">
        <RouterLink :to="`/compras`" class="go-back">Seguir vendiendo</RouterLink>
        <div class="row m-2 mt-4 flex-column">

            <div class="my-4">
                <h1 class="text-decoration-underline">
                    Ventas del día
                </h1>
            </div>
            <div v-if="totalProducts" class=" d-flex justify-content-around align-items-center flex-wrap">
                <div v-for="(amount, product) in productCount" :key="product"
                    class="d-flex flex-column align-items-center all-sales-box">
                    <h4>{{ product }}</h4>
                    <p>{{ amount }}</p>
                </div>
            </div>
            <div v-if="totalCash !== 0" class="my-4 col-8 mx-auto">
                <h2>
                    Efectivo:
                </h2>
                <ul class="list-unstyled">
                    <li v-for="(item, index) in paidWithCash" :key="index"
                        class=" d-flex justify-content-between spread-list-item">
                        <p class="my-2">
                            {{ item.product }}
                        </p>
                        <p class="my-2">
                            $ {{ item.price }}
                        </p>
                        <small v-if="item.time" class="my-2">
                            {{ formatDateTime(item.time) }}
                        </small>
                    </li>
                </ul>
                <p class="my-4 total-amount">Total: <strong>$ {{ totalCash }}</strong> en efectivo</p>
            </div>
            <div v-if="totalMercado !== 0" class="my-4 col-8 mx-auto">
                <h2>
                    MercadoPago:
                </h2>
                <ul class="list-unstyled m-0">
                    <li v-for="(item, index) in paidWithMercado" :key="index"
                        class="d-flex justify-content-between spread-list-item">
                        <p class="my-2">
                            {{ item.product }}
                        </p>
                        <p class="my-2">
                            $ {{ item.price }}
                        </p>
                        <small v-if="item.time" class="mt-2">
                            {{ formatDateTime(item.time) }}
                        </small>
                    </li>
                </ul>
                <p class="my-4 total-amount">Total: <strong>$ {{ totalMercado }}</strong> con MercadoPago</p>
            </div>
            <div class="col-6 mx-auto my-4">
                <div class="row justify-content-around">
                    <button type="button" class="col-4 send-via-wpp" data-bs-toggle="modal"
                        data-bs-target="#ShareSalesModal">
                        Compartir
                    </button>
                    <button type="button" class="col-4 delete-all-button" data-bs-toggle="modal"
                        data-bs-target="#DeleteAllModal">
                        Vaciar detallado
                    </button>
                </div>
            </div>
        </div>
        <div class="modal fade" id="DeleteAllModal" tabindex="-1" aria-labelledby="DeleteAllModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title fs-5" id="DeleteAllModalLabel">Estás segurx?</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Una vez vacío no se puede recuperar
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button @click="clearSpread" type="button" class="clear-spread" data-bs-dismiss="modal">Sí,
                            eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="ShareSalesModal" tabindex="-1" aria-labelledby="ShareSalesModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title fs-5" id="ShareSalesModalLabel">El mensaje se verá así</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="fw-bold mb-0">VENTAS {{ formatDate() }}</p>
                        <ul class="">
                            <li v-for="(amount, product) in productCount" :key="product">
                                {{ product }} {{ amount }}
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <small aria-live="polite">{{ copyStatus }}</small>
                        <div class=" d-flex gap-2">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button @click="copySalesMessage" type="button" class="copy-message">Copiar al
                                portapapeles</button>
                            <button @click="sendViaWpp" type="button" class="send-via-wpp"
                                data-bs-dismiss="modal">WhatsApp</button>
                        </div>
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
    min-width: 150px;
}

.send-via-wpp {
    background-color: #64BCA4;
    color: #164129;

    border: 1px solid #164129;
    border-radius: 8px;
    padding: .4rem 1rem;

    font-weight: bold;
    text-decoration: none;
    text-align: center;
}

.copy-message {
    background-color: whitesmoke;
    color: black;

    border: 1px solid black;
    border-radius: 8px;
    padding: .4rem 1rem;

    text-decoration: none;
    text-align: center;
}

.clear-spread {
    background-color: rgb(249, 87, 87);
    color: rgb(64, 21, 21);

    border: 1px solid rgb(64, 21, 21);
    border-radius: 8px;

    font-weight: bold;

    padding: .4rem 1rem;
}
</style>
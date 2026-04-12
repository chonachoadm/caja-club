import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AppSpread from './AppSpread.vue';

describe('AppSpread.vue', () => {
    let wrapper;

    // Mock localStorage
    const localStorageMock = (() => {
        let store = {};

        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => {
                store[key] = value.toString();
            },
            removeItem: (key) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            },
        };
    })();

    beforeEach(() => {
        global.localStorage = localStorageMock;
        localStorage.clear();
    });

    describe('mounted()', () => {
        it('should load paidWithCash from localStorage', () => {
            const cashData = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ];
            localStorage.setItem('cash', JSON.stringify(cashData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            expect(wrapper.vm.paidWithCash).toEqual(cashData);
        });

        it('should load paidWithMercado from localStorage', () => {
            const mercadoData = [
                { product: 'Product A', price: 100 },
                { product: 'Product C', price: 75 },
            ];
            localStorage.setItem('mercadoPago', JSON.stringify(mercadoData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            expect(wrapper.vm.paidWithMercado).toEqual(mercadoData);
        });

        it('should calculate totalCash correctly', () => {
            const cashData = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
                { product: 'Product A', price: 100 },
            ];
            localStorage.setItem('cash', JSON.stringify(cashData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            expect(wrapper.vm.totalCash).toBe(250);
        });

        it('should calculate totalMercado correctly', () => {
            const mercadoData = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 75 },
            ];
            localStorage.setItem('mercadoPago', JSON.stringify(mercadoData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            expect(wrapper.vm.totalMercado).toBe(175);
        });

        it('should count products correctly from all sales', () => {
            const cashData = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
                { product: 'Product A', price: 100 },
            ];
            const mercadoData = [
                { product: 'Product A', price: 100 },
                { product: 'Product C', price: 75 },
            ];
            localStorage.setItem('cash', JSON.stringify(cashData));
            localStorage.setItem('mercadoPago', JSON.stringify(mercadoData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            expect(wrapper.vm.productCount).toEqual({
                'Product A': 3,
                'Product B': 1,
                'Product C': 1,
            });
        });

        it('should handle empty localStorage gracefully', () => {
            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            expect(wrapper.vm.paidWithCash).toEqual([]);
            expect(wrapper.vm.paidWithMercado).toEqual([]);
            expect(wrapper.vm.totalCash).toBe(0);
            expect(wrapper.vm.totalMercado).toBe(0);
            expect(wrapper.vm.productCount).toEqual({});
        });

        it('should load products from localStorage', () => {
            const productsData = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ];
            localStorage.setItem('products', JSON.stringify(productsData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            expect(wrapper.vm.totalProducts).toEqual(productsData);
        });
    });

    describe('clearSpread()', () => {
        it('should remove cash from localStorage', () => {
            const cashData = [
                { product: 'Product A', price: 100 },
            ];
            localStorage.setItem('cash', JSON.stringify(cashData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            wrapper.vm.clearSpread();

            expect(localStorage.getItem('cash')).toBeNull();
        });

        it('should remove mercadoPago from localStorage', () => {
            const mercadoData = [
                { product: 'Product A', price: 100 },
            ];
            localStorage.setItem('mercadoPago', JSON.stringify(mercadoData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            wrapper.vm.clearSpread();

            expect(localStorage.getItem('mercadoPago')).toBeNull();
        });

        it('should clear all data arrays and totals', () => {
            const cashData = [
                { product: 'Product A', price: 100 },
            ];
            const mercadoData = [
                { product: 'Product B', price: 50 },
            ];
            localStorage.setItem('cash', JSON.stringify(cashData));
            localStorage.setItem('mercadoPago', JSON.stringify(mercadoData));

            wrapper = mount(AppSpread, {
                global: {
                    stubs: {
                        RouterLink: true,
                    },
                },
            });

            expect(wrapper.vm.paidWithCash.length).toBe(1);
            expect(wrapper.vm.paidWithMercado.length).toBe(1);
            expect(wrapper.vm.totalCash).toBe(100);
            expect(wrapper.vm.totalMercado).toBe(50);

            wrapper.vm.clearSpread();

            expect(wrapper.vm.paidWithCash).toEqual([]);
            expect(wrapper.vm.paidWithMercado).toEqual([]);
            expect(wrapper.vm.totalCash).toBe(0);
            expect(wrapper.vm.totalMercado).toBe(0);
            expect(wrapper.vm.totalProducts).toEqual([]);
            expect(wrapper.vm.productCount).toEqual({});
        });
    });
});

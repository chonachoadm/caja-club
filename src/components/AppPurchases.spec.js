import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AppPurchases from './AppPurchases.vue';

describe('AppPurchases.vue', () => {
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
        // Setup localStorage mock
        global.localStorage = localStorageMock;
        localStorage.clear();

        // Mount component with minimal stock
        wrapper = mount(AppPurchases, {
            global: {
                stubs: {
                    RouterLink: true,
                },
            },
        });

        // Initialize component data
        wrapper.vm.stock = [
            { product: 'Product A', price: 100 },
            { product: 'Product B', price: 50 },
        ];
        wrapper.vm.paidWithCash = [];
        wrapper.vm.paidWithMercado = [];
    });

    describe('withCash()', () => {
        it('should add all items from order to paidWithCash', async () => {
            wrapper.vm.order = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ];
            wrapper.vm.orderTotal = 150;

            wrapper.vm.withCash();

            expect(wrapper.vm.paidWithCash).toEqual([
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ]);
        });

        it('should save paidWithCash to localStorage with key "cash"', async () => {
            wrapper.vm.order = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ];

            wrapper.vm.withCash();

            const savedData = JSON.parse(localStorage.getItem('cash'));
            expect(savedData).toEqual([
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ]);
        });

        it('should clear the order after processing', async () => {
            wrapper.vm.order = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ];
            wrapper.vm.orderTotal = 150;

            wrapper.vm.withCash();

            expect(wrapper.vm.order).toEqual([]);
            expect(wrapper.vm.orderTotal).toBe(0);
        });

        it('should show notification temporarily', async () => {
            wrapper.vm.order = [{ product: 'Product A', price: 100 }];
            wrapper.vm.orderTotal = 100;

            wrapper.vm.withCash();

            expect(wrapper.vm.visible).toBe(true);

            // Wait for notification to hide
            await new Promise((resolve) => setTimeout(resolve, 2100));

            expect(wrapper.vm.visible).toBe(false);
        });

        it('should preserve existing paidWithCash items when adding new ones', async () => {
            wrapper.vm.paidWithCash = [
                { product: 'Existing Product', price: 75 },
            ];
            localStorage.setItem('cash', JSON.stringify(wrapper.vm.paidWithCash));

            wrapper.vm.order = [
                { product: 'Product A', price: 100 },
            ];
            wrapper.vm.orderTotal = 100;

            wrapper.vm.withCash();

            const savedData = JSON.parse(localStorage.getItem('cash'));
            expect(savedData).toEqual([
                { product: 'Existing Product', price: 75 },
                { product: 'Product A', price: 100 },
            ]);
        });
    });

    describe('withMercado()', () => {
        it('should add all items from order to paidWithMercado', async () => {
            wrapper.vm.order = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ];
            wrapper.vm.orderTotal = 150;

            wrapper.vm.withMercado();

            expect(wrapper.vm.paidWithMercado).toEqual([
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ]);
        });

        it('should save paidWithMercado to localStorage with key "mercadoPago"', async () => {
            wrapper.vm.order = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ];

            wrapper.vm.withMercado();

            const savedData = JSON.parse(
                localStorage.getItem('mercadoPago')
            );
            expect(savedData).toEqual([
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ]);
        });

        it('should clear the order after processing', async () => {
            wrapper.vm.order = [
                { product: 'Product A', price: 100 },
                { product: 'Product B', price: 50 },
            ];
            wrapper.vm.orderTotal = 150;

            wrapper.vm.withMercado();

            expect(wrapper.vm.order).toEqual([]);
            expect(wrapper.vm.orderTotal).toBe(0);
        });

        it('should show notification temporarily', async () => {
            wrapper.vm.order = [{ product: 'Product A', price: 100 }];
            wrapper.vm.orderTotal = 100;

            wrapper.vm.withMercado();

            expect(wrapper.vm.visible).toBe(true);

            // Wait for notification to hide
            await new Promise((resolve) => setTimeout(resolve, 2100));

            expect(wrapper.vm.visible).toBe(false);
        });

        it('should preserve existing paidWithMercado items when adding new ones', async () => {
            wrapper.vm.paidWithMercado = [
                { product: 'Existing Product', price: 75 },
            ];
            localStorage.setItem(
                'mercadoPago',
                JSON.stringify(wrapper.vm.paidWithMercado)
            );

            wrapper.vm.order = [
                { product: 'Product A', price: 100 },
            ];
            wrapper.vm.orderTotal = 100;

            wrapper.vm.withMercado();

            const savedData = JSON.parse(
                localStorage.getItem('mercadoPago')
            );
            expect(savedData).toEqual([
                { product: 'Existing Product', price: 75 },
                { product: 'Product A', price: 100 },
            ]);
        });
    });
});

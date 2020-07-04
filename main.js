Vue.component('product', {
    template: `
        <div class="product">
        <div class="product-image">
            <img :src="image" alt=""/> 
        </div>
        <div class="product-info">
            <h1> {{displayTitleIfonSale}}</h1>
            <p v-if="inStock"> In Stock </p>
            <p v-else :class="{ outOfStock: !inStock}"> Out of the stock
            </p>

            <ul>
                <li v-for="detail in details"> {{ detail }}</li>
            </ul>
            <div v-for="(variant,index) in variants"
                 :key="variant.variantId"
                 class="color-box"
                 :style="{backgroundColor: variant.variantColor}"
                 @mouseover="updateProduct(index)">
                <!--                <p v-on:mouseover="updateProduct(variant.variantImage)">{{ variant.variantColor }}</p>-->
            </div>

            <button v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton : !inStock}">
                <!-- we bind in the line above  the disabledButton class to the inStock property || so when inStock property is evaluated to false the classname disabledButton is set -->
                Add to Cart
            </button>
            <button v-on:click="removeFromCart"> Remove from Card</button>
            <div class="cart">
                <p>Cart ({{ cart }})</p>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            brand: 'Nike',
            product: 'Socks',
            selectedVariant: 0,
            link: 'www.google.com',
            inventory: 100,
            onSale: true,
            details: ["80% coton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0
                }
            ],
            cart: 0
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        removeFromCart: function () {
            if (this.cart !== 0) this.cart -= 1
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        displayTitleIfonSale() {
            if (this.onSale) return this.brand + ' ' + this.product
        }
    }
})
var app = new Vue({
    el: '#app',
    // data: {
    //     brand: 'Nike',
    //     product: 'Socks',
    //     selectedVariant: 0,
    //     link: 'www.google.com',
    //     inventory: 100,
    //     onSale: true,
    //     details: ["80% coton", "20% polyester", "Gender-neutral"],
    //     variants: [
    //         {
    //             variantId: 2234,
    //             variantColor: "green",
    //             variantImage: './assets/vmSocks-green-onWhite.jpg',
    //             variantQuantity: 10
    //         },
    //         {
    //             variantId: 2235,
    //             variantColor: "blue",
    //             variantImage: './assets/vmSocks-blue-onWhite.jpg',
    //             variantQuantity: 0
    //         }
    //     ],
    //     cart: 0
    // },
    // methods: {
    //     addToCart() {
    //         this.cart += 1
    //     },
    //     removeFromCart: function () {
    //         if (this.cart !== 0) this.cart -= 1
    //     },
    //     updateProduct(index) {
    //         this.selectedVariant = index
    //         console.log(index)
    //     }
    // },
    // computed: {
    //     title() {
    //         return this.brand + ' ' + this.product
    //     },
    //     image() {
    //         return this.variants[this.selectedVariant].variantImage
    //     },
    //     inStock() {
    //         return this.variants[this.selectedVariant].variantQuantity
    //     },
    //     displayTitleIfonSale() {
    //         if (this.onSale) return this.brand + ' ' + this.product
    //     }
    // }
})
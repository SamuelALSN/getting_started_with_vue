var eventBus = new Vue()
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
        <div class="product-image">
            <img :src="image" alt=""/> 
        </div>
        <div class="product-info">
            <h1> {{displayTitleIfonSale}}</h1>
            <p v-if="inStock"> In Stock </p>
            <p v-else :class="{ outOfStock: !inStock}"> Out of the stock</p>
                <product-details :details="details" :shipping="shipping"></product-details>
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
           <product-tabs :reviews="reviews"></product-tabs>
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
                    variantQuantity: 50
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart: function () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },
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
        },
        shipping() {
            if (this.premium) {
                return 'Free'
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-details', {
    props: {
        shipping:{
          required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
           <div>
            <ul>
              <span class="tab"
               v-for="(tab,index) in tabs"
               @click="selectedTab = tab"
               :class="{ activeTab: selectedTab === tab }">
               {{ tab }}
               </span>
            </ul>
           
           <div v-show="selectedTab ==='shipping'">
                <p> Shipping: {{ shipping }}</p>
           </div>
           <div v-show="selectedTab ==='Products details' ">
           <ul>
                <li v-for="detail in details"> {{ detail }}</li>
            </ul>
           </div>
           </div>
            `,

    data() {
        return {
            tabs: ['shipping', 'Products details'],
            selectedTab: 'shipping'
        }
    }
})

Vue.component('product-review', {
    template: `<form class="review-form" @submit.prevent="onSubmit">
     <p v-if="errors.length">
        <b> Please correct the following error(s)</b>
        <ul>
        <li v-for="error in errors"> {{ error }}</li>
</ul>
     </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p> Would you recomand this product ?</p>
         <div>
         <input type="radio" id="yes" value="yes" v-model="recommand"> 
         <label for="">Yes </label>
         <br>
          <input type="radio" id="no" value="no" v-model="recommand"> 
          <label for=""> No</label>
          <br>
          </div>  
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommand: null,
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommand) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommand: this.recommand
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommand = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.recommand) this.errors.push("Check the recommand radio group")
            }

        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }

    },
    template: `
           <div> 
           <ul>
           <span class="tab" 
                   v-for="(tab,index) in tabs" 
                   @click="selectedTab = tab"
                   :class="{ activeTab: selectedTab === tab }">
                   {{tab}}</span>
            </ul>
            <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length"> There are no revies yet.</p>
            <ul>
            <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating : {{review.rating }}</p>
            <p>{{ review.review }}</p>
            <p>Recommnd: {{ review.recommand }}</p>
            </li>
            </ul>
           </div>
           <div v-show="selectedTab === 'Make a Review '">
           <product-review></product-review>
            </div>
             
            </div>`,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review '],
            selectedTab: 'Reviews'
        }
    }
})
var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        deleteCart(id) {
            for (let i = this.cart.length - 1; i >= 0; i -= 1) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1)
                }
            }
        }
    }
})
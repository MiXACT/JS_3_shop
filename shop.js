class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    };

    setAvailable(status) {
        this.available = status;
    }
}


class GoodsList {
    #goods;

    constructor(goods, filter, sortPrice, sortDir) {
        this.#goods = goods;
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }

    get list() {
        function filterGoods(arr, key) {
            let regexp = new RegExp(`${key}`, 'i');
            // console.log(arr.filter(item => regexp.test(item.name)));
            return arr.filter(item => regexp.test(item.name));
        }

        function sortPrice(arr) {
            let sortedArr = arr.concat().sort((a, b) => a.price - b.price);
            return sortedArr;
        }

        if (!this.sortPrice) return filterGoods(this.#goods, this.filter);
        else if (this.sortDir) {
            // сортировка по возрастанию цены
            return sortPrice(filterGoods(this.#goods, this.filter));
        } else {
            // сортировка по убыванию цены
            return sortPrice(filterGoods(this.#goods, this.filter)).reverse();
        }
    }

    add(obj) {
        this.#goods.push(obj);
    }

    remove(id) {
        let pos = this.#goods.findIndex(item => item.id == id);
        if (pos >= 0) this.#goods.splice(pos, 1);
    }
}


class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }
}


class Basket {
    constructor(goods) {
        this.goods = goods;
    }

    get totalAmount() {
        function moneyOrder(item) {
            return item['price'] * item['amount'];
        }

        let finalPrice = this.goods.reduce((sum, current) => sum + moneyOrder(current), 0);
        return finalPrice;
    }

    get totalSum() {
        let goodsNumber = this.goods.reduce((sum, current) => sum + current['amount'], 0);
        return goodsNumber;
    }

    add(good, amount) {
        // поиск товара в корзине по id
        let cartPos = this.goods.findIndex(item => item['id'] == good['id']);
        
        // если товар НЕ найден
        if (cartPos === -1) {
            // создание экземпляра класса BasketGood
            const cartItem = new BasketGood(
                good['id'],
                good['name'],
                good['description'],
                good['sizes'],
                good['price'],
                good['available'],
                amount
            );
            // добавление товара в корзину
            this.goods.push(cartItem);
        } else {
            // если товар уже в корзине - увеличить его количество
            this.goods[cartPos]['amount'] += amount;
        }
    }

    remove(good, amount) {
        // поиск товара в корзине по id
        let cartPos = this.goods.findIndex(item => item['id'] == good['id']);

        // если товар найден уменьшается его кол-во
        if (cartPos >= 0) {
            this.goods[cartPos]['amount'] -= amount;
            if (this.goods[cartPos]['amount'] <= 0) {
                this.goods.splice(cartPos, 1);
            }
        }
    }

    clear() {
        this.goods.splice(0, this.goods.length);
    }

    removeUnavailable() {
        // если в массиве товаров статус доступнсти товара true товар сохраняется в новый массив (inStock)
        let inStock = this.goods.filter(item => item.available === true);
        this.goods = inStock;
    }
}

// создание экземпляров класса Good
const tshirt = new Good(1, 'T-shirt', 'Cotton, nylon', 'L', 100, true);
const trousers = new Good(2, 'Trousers', 'Denim', 'XL', 300, false);
const leotard = new Good(3, 'Leotard', 'Tight dress', 'M', 150, true);
const singlet = new Good(4, 'Singlet', 'White/Grey', 'L', 50, true);
const jumpsuit = new Good(5, 'Jumpsuit', 'Working dress', 'XXL', 500, true);
const coat = new Good(6, 'Coat', 'Raining coat', 'L', 200, false);

// создание экземпляра класса GoodsList
const store = new GoodsList([trousers, singlet, tshirt, coat], 'r', true, true);

// добавление товара (leotard) в каталог; удаление из каталога товаров с id 1 и 2
console.log(store.list);
store.add(leotard);
store.remove(1);
trousers.setAvailable(true);
console.log(store.list);

// создание экземпляров класса BasketGood
const cartItem1 = new BasketGood(1, 'T-shirt', 'Cotton, nylon', 'L', 100, true, 4);
const cartItem2 = new BasketGood(2, 'Trousers', 'Denim', 'XL', 300, false, 2);

// создание экземпляра класса Basket; вывод в консоль суммы и количества товара в корзине
const cart = new Basket([cartItem1, cartItem2]);
console.log(cart);
console.log('ИТОГО: ', cart.totalAmount, ', товаров в корзине, шт.:', cart.totalSum);

// добавление в корзину товаров tshirt (6 шт.) и coat (1 шт.)
console.log(cart);
cart.add(tshirt, 6);
cart.add(coat, 1);
console.log(cart);

// удаление из корзины tshirt (5 шт.) и coat (1 шт.)
cart.remove(tshirt, 5);
cart.remove(coat, 1);
console.log(cart);

// удаление из корзины товаров, недоступных для заказа (available === false)
cart.removeUnavailable();
console.log(cart);

// очистка корзины
cart.clear();
console.log(cart);

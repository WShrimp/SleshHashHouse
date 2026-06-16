// let count = 0;
// const button = document.getElementById('clickBtn');
// const counterSpan = document.getElementById('counter');

// button.addEventListener('click', function() {
//     count = count + 1;
//     counterSpan.innerText = count;
// });
// const item_button = document.getElementsByClassName('item-button')
// const upgrade_button = document.getElementsByClassName('upgrade-button')
const table = document.getElementById('table')
const plate = document.getElementById('plate')
const order = document.getElementById('order')
const money_display = document.getElementById('money');
const goal_display = document.getElementById('goal');
const day_display = document.getElementById('day');
const time_display = document.getElementById('time');
const customer_image = document.querySelector('.customer figure img');
const kitchen = document.querySelector('.kitchen .grid');
const menu = document.querySelector('.menu');
const again_button = document.getElementById('again-button');
const start_button = document.getElementById('start-button');
const wait_timer = document.getElementById('wait-timer');
const fail_container = document.querySelector('.fail-container');
const menu_container = document.querySelector('.menu-container')
const upgrade_container = document.querySelector('.upgrade-container')
const lives_display = document.getElementById('lives')
const score_display = document.getElementById('max-score')

const monster_images_count = 11
const human_images_count = 8
const monster_images = Array.from(
    {length: monster_images_count}, 
    (_, i) => `images/monster/${i+1}.png`
);
const human_images = Array.from(
    {length: human_images_count}, 
    (_, i) => `images/human/${i+1}.png`
);
const heart_image = 'images/heart.png'
// // upgradable
// let max_ingredients = 3
// // undone
// let money_multiplier = 1
// let animation_speed = 0.1
// let additional_customer_time = 0
// let additional_day_time = 0
// let faster_cooking_multiplier
// let starting_money = 100
// let click_power = 1

// savable
let day = 0
let money = 50 // also in reset btw
let customers_left = 1
let min_wait_time = 3
// let lives

// temporary
let day_min_time = 3
let timer
let ingredient_type = ``
let plate_given = false
let is_monster = true
let full_order = []
let full_plate = []
let score = 0

run_upgrades={
    'max_ingredients': {name: '+ 1 max ingredients', type: 'add', base_value: 3, value: 3, max: 3, level: 0},
    'money_multiplier': {name: 'more tips', type: 'multiply', base_value: 1.2, value: 1.2, max: 5, level: 0},
    'animation_speed': {name: 'faster animation speed', type: 'add', base_value: 1, value: 1, max: 1, level: 0},
    'additional_customer_time': {name: 'customer patience', type: 'add', base_value: 0, value: 0, max: 5, level: 0},
    'additional_day_time': {name: 'longer day time', type: 'multiply', base_value: 30, value: 30, max: 5, level: 0},
    'faster_cooking_multiplier': {name: 'faster cooking', type: 'multiply', baswe_value: 1.1, value: 1.1, max: 5, level: 0},
    'starting_money': {name: 'starting money', type: 'multiply', base_value: 50, value: 50, max: 5, level: 0},
    'click_power': {name: 'click power', type: 'multiply', base_value: 1.25, value: 1.2, max: 5, level: 0},
    'money': {name: 'money + 100', type: 'money', base_value: 100, value: 100, max: 500, level: 0},
    'lives': {name: 'lives + 1', type: 'lives', base_value: 3, value: 3, max: 500, level: 0},
}

ingredients_dictionary={ 
    "m-meat": { type: 'meat', is_monster: true, count: 0, difficulity: 40, initial_level: 0, level: 0, bits: 0},
    "h-meat": { type: 'meat', is_monster: false, count: 0, difficulity: 40, initial_level: 0, level: 0, bits: 0},
    "m-filling": { type : 'filling', is_monster: true, count: 0, difficulity: 70, initial_level: -1, level: -1, bits: 0},
    "h-filling": { type : 'filling', is_monster: false, count: 0, difficulity: 70, initial_level: -1, level: -1, bits: 0},
    "m-sauce": { type: 'sauce', is_monster: true, count: 0, difficulity: 100, initial_level: -1, level: -1, bits: 0},
    "h-sauce": { type: 'sauce', is_monster: false, count: 0, difficulity: 100, initial_level: -1, level: -1, bits: 0},
    "h-topping": { type: 'topping', is_monster: false, count: 0, difficulity: 200, initial_level: -1, level: -1, bits: 0},
    "m-topping": { type: 'topping', is_monster: true, count: 0, difficulity: 200, initial_level: -1, level: -1, bits: 0},
};

// img_ingredient = {
//     "m-meat": 1
// };

if (localStorage.getItem('score')) {
    score_display.innerText = 'MAX SCORE: DAY ' + localStorage.getItem('score')
    if (localStorage.getItem('score') == 'null') {
        score_display.innerText = 'MAX SCORE: DAY 0'
    } else {
        save_found()
    }
}

function save() {
    console.log('SAVING DATA')
    localStorage.setItem('run_upgrades', JSON.stringify(run_upgrades))
    localStorage.setItem('ingredients_dictionary', JSON.stringify(ingredients_dictionary))
    localStorage.setItem('day', day)
    localStorage.setItem('money', money)
    score = day
    if (localStorage.getItem('score') && localStorage.getItem('score') < score){
        localStorage.setItem('score', score)
        console.log('writing new score')
    }
    localStorage.setItem('score', score)
}

function load() {
    run_upgrades = JSON.parse(localStorage.getItem('run_upgrades'))
    ingredients_dictionary = JSON.parse(localStorage.getItem('ingredients_dictionary'))

    for (ingredient in ingredients_dictionary) {
        ingredients_dictionary[ingredient].count = 0
    }


    day = JSON.parse(localStorage.getItem('day'))
    money = JSON.parse(localStorage.getItem('money'))
}

function delete_data() {
    console.log('DELETING DATA')
    localStorage.removeItem('score')
    localStorage.removeItem('run_upgrades')
    localStorage.removeItem('ingredients_dictionary')
    localStorage.removeItem('day')
    localStorage.removeItem('money')
}

// get random upgrade
let get_random_upgrade  = function() {
    let keys = Object.keys(run_upgrades)
    let random_key = keys[Math.floor(Math.random() * keys.length)]
    if (run_upgrades[random_key].level >= run_upgrades[random_key].max) {return get_random_upgrade ()}
    return random_key
    get_random_upgrade ()

}


function load_buttons() {
    kitchen.innerHTML = ''
    for (let ingredient in ingredients_dictionary) {
        create_buttons(ingredient)
    }
}

function create_buttons(ingredient) {
    if (ingredients_dictionary[ingredient].level < 0) {
        // console.log(ingredient_type, ingredients_dictionary[ingredient].type)
        if (ingredient_type == ingredients_dictionary[ingredient].type) {return}
        // console.log("create buy button for ", ingredient_type)
        const buy = document.createElement('button')
        buy.id = `buy-${ingredient}`
        buy.className = 'item-button'
        ingredient_type = ingredients_dictionary[ingredient].type
        buy.textContent = '$' + calculate_buy_price(ingredient)
        buy.style.order = '10'
        kitchen.appendChild(buy)
        buy.addEventListener('click', function() {
            buy_ingredient(ingredient)
        })
        return
    }
    const item = document.createElement('div')
    item.className = 'item'
    // item.id = ingredient
    const item_button = document.createElement('button')
    item_button.className = 'item-button'
    item_button.id = ingredient
    const icon = document.createElement('img')
    icon.src = `images/ingredients-icons/${ingredient}.png`
    icon.className = 'item-icon'
    item_button.appendChild(icon)
    
    const upgrade_button = document.createElement('button')
    upgrade_button.className = 'upgrade-button'
    upgrade_button.id = `upgrade-${ingredient}`
    let cost = calculate_price(ingredient)
    upgrade_button.textContent = '$' + cost
    
    kitchen.appendChild(item)
    item.appendChild(item_button)
    item.appendChild(upgrade_button)

    item_button.addEventListener('click', function() {
        tap_ingredient(ingredient)
    })
    
    upgrade_button.addEventListener('click', function() {
        upgrade_ingredient(upgrade_button ,ingredient, cost)
    })
}


function buy_ingredient(ingredient) {
    if (money < calculate_buy_price(ingredient)) {return}
    money -= calculate_buy_price(ingredient)
    money_display.textContent = '$' + money
    const buy_button = document.getElementById(`buy-${ingredient}`)
    buy_button.remove()
    let purchasedType = ingredients_dictionary[ingredient].type
    for (let ingKey in ingredients_dictionary) {
        if (ingredients_dictionary[ingKey].type === purchasedType) {
            ingredients_dictionary[ingKey].level += 1
            create_buttons(ingKey)
        }
    }
}

// passive cooking
setInterval(() => {
    // console.log(".")
    for (let id in ingredients_dictionary) {
        if (ingredients_dictionary[id].level <= 0 || ingredients_dictionary[id].count >= run_upgrades['max_ingredients'].value) {continue}
        ingredients_dictionary[id].bits += 1 * Math.pow(1.3, ingredients_dictionary[id].level - 1)/2 * run_upgrades['faster_cooking_multiplier'].value;
        if (ingredients_dictionary[id].bits >= ingredients_dictionary[id].difficulity) {
            ingredients_dictionary[id].count += 1;
            ingredients_dictionary[id].bits -= ingredients_dictionary[id].difficulity;
            add_ingredient(id)
        }
        let gradient_stage = 100 * ingredients_dictionary[id].bits / ingredients_dictionary[id].difficulity
        const ingredient_button = document.getElementById(id)
        ingredient_button.style.background = `linear-gradient(to right, rgb(64, 50, 110) 0%, rgb(64, 50, 110) ${gradient_stage}%,rgb(96, 67, 127) ${gradient_stage}%, rgb(96, 67, 127) 100%)`
    }
}, 200);


function update_hearts() {
    lives.innerHTML = ""
    const heart = document.createElement('img')
    heart.src = 'images/heart.png'

    for (let i = 0; i < run_upgrades['lives'].value; i++) {
        const heart = document.createElement('img')
        heart.src = 'images/heart.png'
        heart.className = 'heart'
        // heart.id = 'heart'
        lives.appendChild(heart)
    }
    // lives.appendChild(heart)
}

function day_start(){
    save()
    update_hearts()
    money += run_upgrades['starting_money'].value * run_upgrades['starting_money'].level
    // money = 100000
    money_display.textContent = '$' + money
    let minutes = day_min_time
    let seconds = 0
    if (run_upgrades['additional_day_time'].level > 0){
        seconds = 0 + run_upgrades['additional_day_time'].value}
    day += 1
    score = day
    console.log(score)
    let day_goal = 100 * day
    goal_display.textContent = `Day Goal: ` + `$${day_goal}`
    customer_appear()
    day_display.textContent = `Day: ${day}`    
    
    timer = setInterval(() => {
        seconds -= 1
        while (seconds >= 60) {
            seconds -= 60
            minutes += 1
        }
        if (seconds < 0) {
            seconds = 59
            minutes -= 1
        }
        if (minutes < 0) {
            minutes = 0
            seconds = 0
            day_end()
        }
        time_display.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`  
    }, 1000);
}

function customer_appear() {
    console.log("customer_appear")    
    fill_order()
    customer_image.style.animation = 'slide-out-opacity ' + 0.6 / run_upgrades['animation_speed'].value + 's ease-in-out'
}
customer_image.addEventListener('animationend', function(e) {
    if (e.animationName == 'slide-out-opacity') {
        console.log("animation ended customer_image")        
        is_monster = Boolean(Math.round(Math.random()))
        console.log("is_monster: ", is_monster)
        let image_list = is_monster ? monster_images : human_images
        
        customer_image.src = image_list[Math.floor(Math.random( )*image_list.length)]
        
        const bun_plate = document.createElement('img')
        bun_plate.className = 'on-plate-bun'
        bun_plate.src = "images/ingredients-plate/plate.png"
        plate.appendChild(bun_plate)
        plate.style.animation = 'slide-in ' + 0.6 / run_upgrades['animation_speed'].value + 's ease-in-out'
        customer_image.style.animation = 'slide-in-opacity ' + 0.6 / Math.pow(run_upgrades['animation_speed'].value, 2) + 's ease-in-out'

        wait_timer.style.animation = 'slide-left ' + Math.max(min_wait_time, (20 - day) + run_upgrades['additional_customer_time'].value) + 's linear'
    }
})

wait_timer.addEventListener('animationend', function(e) {
    if (e.animationName == 'slide-left') {
        wait_timer.style.animation = ''
        give_plate(3)
    }
})

function fill_order() {
    order.style.animation = 'fade-out ' + 0.2 / run_upgrades['animation_speed'].value + 's ease-in-out'
}
order.addEventListener('animationend', function(e) {
    if (e.animationName == 'fade-out') {
        order.innerHTML = ""
        full_order = []
        console.log("ANIMATION ORDER END")
        const ingredients_avaliable = []
        for (let id in ingredients_dictionary){
            if (ingredients_dictionary[id].level >= 0) {
                ingredients_avaliable.push(id)
            }
        }
        const items_in_order = Math.min(Math.round(day*1.2 + Math.random()*2), 20)
            for (let i = 0; i < items_in_order; i++)  {
                const order_item = ingredients_avaliable[Math.floor(Math.random()*ingredients_avaliable.length)]
                const order_item_display = document.createElement('img')
                order_item_display.className = 'order-item-display'
                order_item_display.textContent = order_item
                let order_item_type = ingredients_dictionary[order_item].type
                order_item_display.src = `images/ingredients-order/${order_item_type}.png`
                order.appendChild(order_item_display)
                full_order.push(order_item)
            }
            order.style.animation = 'fade-in 0.2s ease-in-out'
    }
})
function tap_ingredient(ingredient) {
    if (ingredients_dictionary[ingredient].count >= run_upgrades['max_ingredients'].value) {return}
    ingredients_dictionary[ingredient].bits += 10 * run_upgrades['click_power'].value
    const ingredient_button = document.getElementById(ingredient)
    
    if (ingredients_dictionary[ingredient].bits >= ingredients_dictionary[ingredient].difficulity) {
        ingredients_dictionary[ingredient].count += 1;
        ingredients_dictionary[ingredient].bits -= ingredients_dictionary[ingredient].difficulity;
        add_ingredient(ingredient)
    }
    let gradient_stage = 100 * ingredients_dictionary[ingredient].bits / ingredients_dictionary[ingredient].difficulity
    ingredient_button.style.background = `linear-gradient(to right, rgb(64, 50, 110) 0%, rgb(64, 50, 110) ${gradient_stage}%,rgb(96, 67, 127) ${gradient_stage}%, rgb(96, 67, 127) 100%)`
}

function upgrade_ingredient(upgrade_button, ingredient, cost){
    if (money < cost) {return}
    money -= cost
    ingredients_dictionary[ingredient].level += 1
    cost = calculate_price(ingredient)
    money_display.textContent = '$' + money
    upgrade_button.textContent = '$' + cost
}

function calculate_price(ingredient) {
    return Math.round ((ingredients_dictionary[ingredient].difficulity * 1.7 + ingredients_dictionary[ingredient].level * 20)/5)
}
function calculate_buy_price(ingredient) {
    return Math.round(Math.pow(ingredients_dictionary[ingredient].difficulity, 1.3)/5)
}


// add_ingredient('m-meat')

function add_ingredient(ingredient) {
    console.log("Add ingredient ", ingredient);
    const tableRect = table.getBoundingClientRect();
    // console.log('top:', plateRect.top, 'bottom:', plateRect.bottom, 'left:', plateRect.left, 'right:', plateRect.right)
    const movable_item = document.createElement('div');
    movable_item.className = "ingredient_item"
    movable_item.style.top = tableRect.top + Math.random() * 240 + 'px'
    movable_item.style.left = Math.random() * 85 + '%'
    const img = document.createElement('img')
    img.src = `images/ingredients-table/${ingredient}.png`
    table.appendChild(movable_item)
    movable_item.appendChild(img)
    
    movable_item.addEventListener('touchmove', e => {
        e.preventDefault();
        let touch = e.targetTouches[0];
        movable_item.style.top = touch.clientY - 90 + 'px';
        movable_item.style.left = touch.clientX - 100 + 'px';
        table.appendChild(movable_item)
    }, false)
    movable_item.addEventListener('touchend', e => {
        const plateRect = plate.getBoundingClientRect();
        e.preventDefault();
        if (
            plateRect.top <= parseInt(movable_item.style.top) &&
            plateRect.bottom >= parseInt(movable_item.style.top) + 100 &&
            plateRect.left <= parseInt(movable_item.style.left) &&
            plateRect.right >= parseInt(movable_item.style.left)
        ) {
            console.log('on plate')
            place_on_plate(movable_item, ingredient)
            return
        }
        if (
            tableRect.top >= parseInt(movable_item.style.top) + 80 ||
            tableRect.bottom <= parseInt(movable_item.style.top) - 80 ||
            tableRect.left >= parseInt(movable_item.style.left) + 80 ||
            tableRect.right <= parseInt(movable_item.style.left) - 80
        ) {
            console.log('not on table')
            movable_item.style.animation = 'fall ' + 0.5 / run_upgrades['animation_speed'].value + 's ease-in-out'
            ingredients_dictionary[ingredient].count -= 1
            movable_item.addEventListener('animationend', e => {
                e.preventDefault();
                movable_item.remove()
            }, {once: true})
            return
        }
    })
}

function place_on_plate(movable_item, ingredient) {
    table.removeChild(movable_item)
    ingredients_dictionary[ingredient].count -= 1
    
    const ingredient_on_plate = document.createElement('img')
    ingredient_on_plate.src = `images/ingredients-plate/${ingredient}.png`
    ingredient_on_plate.className = 'on-plate'
    plate.appendChild(ingredient_on_plate)

    full_plate.push(ingredient)
    if (full_plate.length == full_order.length != 0) check_plate()
}

function check_plate() {
    plate_given = true
    console.log("Check plate")
    console.log("full_order: ", full_order)
    console.log("full_plate: ", full_plate)
    let correct = 0
    // let fail = 0
    for (let i = 0; i < full_order.length; i++){
        if (ingredients_dictionary[full_plate[i]].is_monster != is_monster) {
            if (is_monster) {
                console.log("It's a monster, no money")
                give_plate(1)
                return
            }
            else {
                console.log("It's not a monster, FAIL FAIL FAIL")
                give_plate(2)
                return
            }
        }
        if (ingredients_dictionary[full_order[i]].type == ingredients_dictionary[full_plate[i]].type) { 
            correct += 1
        }
        if (correct == full_order.length) {
            give_plate(0)
            return
        }
    }
    give_plate(3)
    // give_plate(0)
        // return
    // }
}

// 0 - correct, 1 - incorrect-money, 2 - fail, 3 - incorrect skip
function give_plate(fail) {
    // if (plate_given) {return}
    // let plate_given = true
    console.log("GIVE PLATE", fail)
    const bun_top = document.createElement('img')
    bun_top.className = 'on-plate'
    bun_top.src = `images/ingredients-plate/bun-top.png`
    plate.appendChild(bun_top)
    
    if (fail == 0) {
        console.log("Correct!")
        for (let i = 0; i < full_plate.length; i++) {
            money += Math.round((ingredients_dictionary[full_plate[i]].difficulity - 30) / 4 * run_upgrades['money_multiplier'].value)
            money_display.textContent = '$' + money.toString()
            // plate.removeChild(plate.children[i])
        }
    }
    if (fail == 1) {
        console.log("It's a monster, no money")
        money -= 10
        money_display.textContent = '$' + money.toString()
        if (money < 0) {
            lose()
        }
    }
    if (fail == 2) {
        console.log("It's not a monster, FAIL FAIL FAIL")

        
        let scream = document.createElement('h1')
        scream.textContent = "AAAAAAAAA!!!!!"
        scream.className = 'emote'
        document.body.appendChild(scream)
        setTimeout(() => {
            document.body.removeChild(scream)
        }, 1000);
        // lose()
        run_upgrades['lives'].value -= 1
        update_hearts()
        if (run_upgrades['lives'].value <= 0) {
            lose()
            return
        }
        // return
    }
    // if (fail == 3) {

    // }
    plate.style.animation = 'slide-out ' + 0.5 / run_upgrades['animation_speed'].value + 's ease-in-out'

    console.log("PLATE GIVEN")
    

}
plate.addEventListener('animationend', function(e) {
    if (e.animationName == 'slide-out') {
        plate.innerHTML = ""
        full_plate = []
        wait_timer.style.animation = ''
        plate_given = false
        customer_appear()
    }
})


function lose() {
    clearInterval(timer)
    console.log("FAIL")
    wait_timer.style.animation = ''
    
    setTimeout(() => {
        menu.style.display = 'flex'
        fail_container.style.display = 'flex'
    }, 2000);
}


function day_end() {
    let day_goal = 100 * day
    goal_display.textContent = `Day Goal:` + `$${day_goal}`
    if (money >= day_goal) {
        money -= day_goal
        // clearInterval(timer)
        reset(false)
        show_upgrades()
        // day_start()
    }
    else {
        lose()
    }
}

function show_upgrades() {
    menu.style.display = 'flex'
    upgrade_container.style.display = 'flex'
    for (let i = 0; i < 3; i++) {
        let run_upgrade = document.createElement('button')
        run_upgrade.className = 'run-upgrade-button'
        let random_upgrade  = get_random_upgrade ()
        run_upgrade.id = random_upgrade 
        run_upgrade.textContent = run_upgrades[random_upgrade].name
        upgrade_container.appendChild(run_upgrade)
        run_upgrade.addEventListener('click', function() {
            let upgrade_id = this.id
            choose_upgrade(upgrade_id)
        })
    }
}

function choose_upgrade (upgrade_id) {
    console.log(upgrade_id)
    run_upgrades[upgrade_id].level += 1
    menu.style.display = 'none'
    upgrade_container.style.display = 'none'
    upgrade_container.innerHTML = ''
    update_run_upgrades(upgrade_id)
    load_buttons()
    day_start()
}

function update_run_upgrades(upgrade_id) {
    // for (upgrade in run_upgrades) {
    if (run_upgrades[upgrade_id].type == 'add') {
        run_upgrades[upgrade_id].value += run_upgrades[upgrade_id].level
    }
    if (run_upgrades[upgrade_id].type == 'multiply') {
        run_upgrades[upgrade_id].value = run_upgrades[upgrade_id].base_value * run_upgrades[upgrade_id].level
    }
    if (run_upgrades[upgrade_id].type == 'money') {
        run_upgrades[upgrade_id].level -= 1
        money += run_upgrades[upgrade_id].value
    }
    if (run_upgrades[upgrade_id].type == 'lives') {
        run_upgrades[upgrade_id].level -= 1
        run_upgrades[upgrade_id].value += 1
    }
    console.log('run upgrade', upgrade_id, 'updated to', run_upgrades[upgrade_id].value)
}


function save_found() {
    // score_display.innerText = 'MAX SCORE: DAY ' + score
    menu.style.display = 'flex'
    menu_container.style.display = 'flex'
    const continue_button = document.createElement('button')
    continue_button.id = 'continue-button'
    continue_button.className = 'menu-button'
    continue_button.textContent = 'Continue'
    menu_container.appendChild(continue_button)
    continue_button.addEventListener('click', function() {
        menu.style.display = 'none'
        menu_container.style.display = 'none'
        load()
        load_buttons()
        day_start()
    })
    const delete_button = document.createElement('button')
    delete_button.id = 'delete-button'
    delete_button.className = 'menu-button'
    delete_button.textContent = 'True Reset (deletes data)'
    menu_container.appendChild(delete_button)
    delete_button.addEventListener('click', function() {
        delete_data()
        delete_button.remove()
        continue_button.remove()
    })
}

again_button.addEventListener('click', function() {
    menu.style.display = 'none'
    fail_container.style.display = 'none'
    reset(true)
    show_upgrades()
})
start_button.addEventListener('click', function() {
    menu.style.display = 'none'
    menu_container.style.display = 'none'
    reset(true)
    show_upgrades()
})

function reset(full) {
    if (full) {
        day = 0
        money = 50
        ingredient_type = ''
        kitchen.innerHTML = ''
        for (run_upgrade in run_upgrades) {
            run_upgrades[run_upgrade].level = 0
            run_upgrades[run_upgrade].value = run_upgrades[run_upgrade].base_value
        }
        for (ingredient in ingredients_dictionary) {
            ingredients_dictionary[ingredient].level = ingredients_dictionary[ingredient].initial_level
            ingredients_dictionary[ingredient].bits = 0
            ingredients_dictionary[ingredient].count = 0
        }
    }
    money_display.textContent = '$' + money.toString()
    plate.innerHTML = ""
    full_plate = []
    plate_given = false
    clearInterval(timer)
    wait_timer.style.animation = ''
}
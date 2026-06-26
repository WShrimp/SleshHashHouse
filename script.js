const table = document.getElementById('table')
const table_container = document.querySelector('.table-container')
const tray_container = document.querySelector('.tray-container')
const plate = document.getElementById('plate')
const order = document.getElementById('order')
const money_display = document.getElementById('money');
const money_gain_display = document.getElementById('money-gain')
const goal_display = document.getElementById('goal');
const day_goal_pay_button = document.getElementById('day-goal-pay')
const day_display = document.getElementById('day');
const time_display = document.getElementById('time');
const customer_image = document.querySelector('.customer figure img');
const kitchen = document.querySelector('.kitchen .grid');
const menu = document.querySelector('.menu');
const again_button = document.getElementById('again-button');
const start_button = document.getElementById('start-button');
const wait_timer = document.getElementById('wait-timer');
const fail_container = document.querySelector('.fail-container');
const play_container = document.querySelector('.play-container')
const play_subcontainer = document.querySelector('.play-subcontainer')
const upgrade_container = document.querySelector('.upgrade-container')
const lives_display = document.getElementById('lives')
const score_display = document.getElementById('max-score')
const fullscreen_button = document.getElementById('fullscreen-button')

const monster_images_count = 31
const human_images_count = 29
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
// let click_power = 1

// savable
let day = 0
let starting_money = 5000
let money = 50 // also in reset btw
let min_wait_time = 4
// let lives

// temporary
let day_goal = 0
let day_min_time = 3
let timer
let ingredient_type = ``
let plate_given = false
let is_monster = true
let full_order = []
let full_plate = []
let score = 0
let in_game = false
let last_heart


run_upgrades={
    'max_ingredients': {name: '+ 1 max ingredients', type: 'add', base_value: 3, starting_value: 3, value: 3, max: 3, level: 0},
    'money_multiplier': {name: 'more tips', type: 'multiply', base_value: 1.1, starting_value: 1.2, value: 1.2, max: 5, level: 0},
    'animation_speed': {name: 'faster animation speed', type: 'add', base_value: 1, starting_value: 1, value: 1, max: 1, level: 0},
    'additional_customer_time': {name: 'customer patience', type: 'multiply', base_value: 2, starting_value: 1, value: 0, max: 3, level: 0},
    'customer_demand': {name: 'less items in order', type: 'multiply', base_value: 1.2, starting_value: 1, value: 1, max: 5, level: 0},
    'additional_day_time': {name: 'longer day time', type: 'multiply', base_value: 30, starting_value: 0, value: 0, max: 4, level: 0},
    'faster_cooking_multiplier': {name: 'faster cooking', type: 'multiply', base_value: 1.1, starting_value: 1, value: 1, max: 5, level: 0},
    'starting_money': {name: 'starting money', type: 'multiply', base_value: 50, starting_value: 0, value: 0, max: 5, level: 0},
    'click_power': {name: 'click power', type: 'multiply', base_value: 1.25, starting_value: 1, value: 1, max: 5, level: 0},
    'money': {name: 'money + 50', type: 'money', base_value: 50, starting_value: 50, value: 50, max: 500, level: ' '},
    'lives': {name: 'lives + 1', type: 'add', base_value: 3, starting_value: 3, value: 3, max: 3, level: 3},
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

trays={
    'meat': {bought: false, price: 300},
    'filling': {bought: false, price: 600},
    'sauce': {bought: false, price: 1000},
    'topping': {bought: false, price: 2000},
}

// creatre_trays()

let tray_buy_button_exists = false
function creatre_trays() {
    tray_container.innerHTML = ''
    // let tray_buy_button_exists = false
    // tray_buy_button_exists = document.querySelector('.tray-buy-button') ?? false
    console.log('buy button exists: ', tray_buy_button_exists)
    for (let type in trays) {
        if (trays[type].bought == true) {
            console.log('creating tray for ', type)
            create_tray_type_buttons(type)
        } else {
            if (!tray_buy_button_exists) {
                console.log('creating buy tray button for ', type)
                create_tray_buy_button(type)
                tray_buy_button_exists = true
            }
        }
    }
    
}

function create_tray_buy_button(type) {
    tray_buy_button_exists = true
    const tray_buy_button = document.createElement('button')
    tray_buy_button.className = 'tray-buy-button'
    const tray_type_image = document.createElement('img')
    tray_type_image.src = 'images/ingredients-order/' + type + '.png'
    // tray_buy_button.style.backgroundImage = 'images/ingredients-order/' + type + '.png'
    tray_buy_button.textContent = '$' + trays[type].price
    
    // tray_buy_button.addEventListener('click')

    tray_container.appendChild(tray_buy_button)
    tray_buy_button.appendChild(tray_type_image)

    tray_buy_button.addEventListener('click', function(){
        if (money >= trays[type].price) {
            money -= trays[type].price
            money_display.textContent = '$' + money
            create_tray_type_buttons(type)
            tray_buy_button.remove()
        }
    })

}

function create_tray_type_buttons(type) {
    const tray_type_container = document.createElement('div')
    tray_type_container.className = 'tray-type-container'
    tray_container.appendChild(tray_type_container)

    for (let ingredient of getIngredientsByType(type)) {
        const ingredient_tray_container = document.createElement('div')
        ingredient_tray_container.className = 'tray-ingredient-container'
        tray_type_container.appendChild(ingredient_tray_container)

        const ingredient_tray_button = document.createElement('button')
        ingredient_tray_button.className = 'tray-ingredient-button'
        ingredient_tray_button.id = 'tray_' + ingredient
        ingredient_tray_container.appendChild(ingredient_tray_button)

        const ingredient_tray_image = document.createElement('img')
        ingredient_tray_image.id = 'tray-ingredient-image-' + ingredient
        ingredient_tray_image.src = 'images/ingredients-icons/' + ingredient + '.png'
        ingredient_tray_button.appendChild(ingredient_tray_image)

        const ingredient_holder_tray_container = document.createElement('div')
        ingredient_holder_tray_container.className = 'tray-ingredient-holder-container'
        ingredient_holder_tray_container.id = 'tray-ingredient-' + ingredient
        ingredient_tray_button.appendChild(ingredient_holder_tray_container)

        const ingredients_on_tray_count_display = document.createElement('div')
        ingredients_on_tray_count_display.className = 'ingredients-on-tray-count-display'
        ingredients_on_tray_count_display.id = 'tray-count-display-' + ingredient
        ingredients_on_tray_count_display.textContent = ingredients_dictionary[ingredient].count + '/' + run_upgrades['max_ingredients'].value
        ingredient_tray_button.appendChild(ingredients_on_tray_count_display)

        ingredient_tray_button.addEventListener('click',  function() {
            handle_tray_click(ingredient_holder_tray_container, ingredients_on_tray_count_display, ingredient_tray_image, ingredient)
        })
    }

    if(type == 'topping') {tray_set_full_width()}
    trays[type].bought = true

    if (type == 'topping') {return}

    if (type == 'meat') {type = 'filling'}
    else {if (type == 'filling') {type = 'sauce'}
    else {type = 'topping'}}
    console.log('next tray type: ', type)

    // let tray_buy_button_exists = document.querySelector('.tray-buy-button') ?? false
    // console.log('tray button exists: ', tray_buy_button_exists)
    // if (!tray_buy_button_exists){
        // console.log('button does not exists, creating fot type: ', type)
    if (trays[type].bought == false) {
        create_tray_buy_button(type)

    }
    // }
}

function handle_tray_click(ingredient_holder_tray_container, ingredients_on_tray_count_display, ingredient_tray_image, ingredient) {
    const tray_children = Array.from(ingredient_holder_tray_container.children);    
    if (tray_children.length <= 0 || ingredients_dictionary[ingredient].count <= 0) {return}

    console.log('tray_chilidren: ', tray_children)
    console.log('ingredient count: ', ingredients_dictionary[ingredient].count)
    const ingredient_tray = tray_children[tray_children.length - 1];
    // const ingredient_tray = tray_children[ingredients_dictionary[ingredient].count-1];
    
    // console.log('last child: ', ingredient_tray)

    // console.log('removing last chinld: ', ingredient_holder_tray_container.lastChild)
    place_on_plate(null, ingredient)


    // ingredient_tray.style.zIndex = 10
    // Получаем текущую позицию элемента
    const ingredient_tray_rect = ingredient_tray.getBoundingClientRect();
    const target_rect = plate.lastChild.getBoundingClientRect()
    // Нужная конечная позиция
    const targetX = target_rect.left + target_rect.width *0.5;
    const targetY = target_rect.top  + target_rect.height *0.5;

    // Вычисляем смещение
    const deltaX = targetX - (ingredient_tray_rect.left + ingredient_tray_rect.width * 0.5);
    const deltaY = targetY - (ingredient_tray_rect.top + ingredient_tray_rect.height * 0.8);
    // Применяем анимацию через CSS
    ingredient_tray.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
    ingredient_tray.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    ingredient_tray.style.opacity = '0';
    
    ingredient_tray.addEventListener('transitionend', function handler() {
        ingredient_tray.removeEventListener('transitionend', handler); // Убираем слушатель
        ingredient_tray.remove(); // Удаляем элемент
    });
    
    if (ingredients_dictionary[ingredient].count <= 0) {ingredient_tray_image.style.display = 'flex'}
    ingredients_on_tray_count_display.textContent = ingredients_dictionary[ingredient].count + '/' + run_upgrades['max_ingredients'].value
}

function tray_set_full_width() {
    document.documentElement.style.setProperty('--table-display', 'none');
    document.documentElement.style.setProperty('--tray-type-width', '100%');
}

function getUniqueTypes() {
    return [...new Set(Object.values(ingredients_dictionary).map(item => item.type))];
}
function getIngredientsByType(type) {
    return Object.keys(ingredients_dictionary).filter(key => 
        ingredients_dictionary[key].type === type
    );
}
function isTypeUnlocked(type) {
    const ingredients = getIngredientsByType(type);
    return ingredients.some(key => ingredients_dictionary[key].level >= 0);
}
function getAvailableIngredients() {
    return Object.keys(ingredients_dictionary).filter(key => 
        ingredients_dictionary[key].level >= 0
    );
}
function getTypeBuyIngredient(ingredient) {
    // console.log(ingredient, ", type: ", ingredients_dictionary[ingredient]?.type || null)
    return ingredients_dictionary[ingredient]?.type || null;
}

let resizeTimer
window.onresize = function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // console.log('RESZE')
        reset_table();
    }, 300);
}

window.scrollTo(0, 1);
window.addEventListener("load",function() {
    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});
fullscreen_button.addEventListener('click', toggleFullscreen)

// toggleFullscreen()
function toggleFullscreen() {
    const elem = document.documentElement; // или document.getElementById("root")
    // console.log('toggle fullscreen')
    if (!document.fullscreenElement) {
        // Вход в полноэкранный режим
        if (elem.requestFullscreen) {
            elem.requestFullscreen({ navigationUI: "hide" })
                .catch(err => {
                    // Если navigationUI не поддерживается
                    elem.requestFullscreen();
                });
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    } else {
        // Выход из полноэкранного режима
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    setTimeout(() => {
    // console.log('Привет через 3 секунды!');
    reset_table()
    }, 100);
}

function reset_table() {
    
    // console.log("reset table")
    // table_container.innerHTML = ''
    const trays_to_clear = document.getElementsByClassName('tray-ingredient-holder-container')
    // console.log('trays to clear: ', trays_to_clear)
    for (let element of trays_to_clear) {
        // console.log('clearing element: ', element)
        element.innerHTML = ''
    }
    // console.log('trays after clear?: ', trays_to_clear)
    table.innerHTML = ''
    // creatre_trays()
    for (let ingredient in ingredients_dictionary) {
        // let type = getTypeBuyIngredient(ingredient)
        // if (trays[type].bought == true){
        //     continue
        // }

        let ingredient_to_return = ingredients_dictionary[ingredient].count
        ingredients_dictionary[ingredient].count = 0
        // console.log('need to return', ingredient_to_return, ingredient)
        for (let i=0; i<ingredient_to_return; i++){
            // console.log('returning', ingredient)
            add_ingredient(ingredient)
        }
    }
}

if (localStorage.getItem('score')) {
    score_display.innerText = 'MAX SCORE: DAY ' + localStorage.getItem('score')
    if (localStorage.getItem('score') == 'null') {
        score_display.innerText = 'MAX SCORE: DAY 0'
    } else {
        save_found()
    }
}

function save() {
    // console.log('SAVING DATA')
    localStorage.setItem('run_upgrades', JSON.stringify(run_upgrades))
    localStorage.setItem('ingredients_dictionary', JSON.stringify(ingredients_dictionary))
    localStorage.setItem('trays', JSON.stringify(trays))
    localStorage.setItem('day', day)
    localStorage.setItem('money', money)
    score = day
    if (localStorage.getItem('score') && localStorage.getItem('score') < score){
        localStorage.setItem('score', score)
        // console.log('writing new score: ', score)
    }
}

function load() {
    run_upgrades = JSON.parse(localStorage.getItem('run_upgrades'))
    ingredients_dictionary = JSON.parse(localStorage.getItem('ingredients_dictionary'))
    trays = JSON.parse(localStorage.getItem('trays'))
    // console.log(ingredients_dictionary)
    // for (ingredient in ingredients_dictionary) {
    //     ingredients_dictionary[ingredient].count = 0
    // }
    update_ingredient_buttons_state()
    update_trays_buttons_state()
    day = JSON.parse(localStorage.getItem('day'))
    money = JSON.parse(localStorage.getItem('money'))
}

function delete_data() {
    // console.log('DELETING DATA')
    localStorage.removeItem('score')
    localStorage.removeItem('run_upgrades')
    localStorage.removeItem('ingredients_dictionary')
    localStorage.removeItem('day')
    localStorage.removeItem('money')
}

// get random upgrade
// let get_random_upgrade  = function() {
//     let keys = Object.keys(run_upgrades)
//     let random_key = keys[Math.floor(Math.random() * keys.length)]
//     if (run_upgrades[random_key].level >= run_upgrades[random_key].max) {return get_random_upgrade ()}
//     return random_key
//     get_random_upgrade ()

// }
function get_random_upgrades(count = 3) {
    // 1. Получаем все доступные апгрейды (где level < max)
    let available = Object.keys(run_upgrades).filter(key => 
        run_upgrades[key].level < run_upgrades[key].max
    );
    
    // 2. Если доступных меньше count, добиваем деньгами
    let result = [];
    let shuffled = [...available].sort(() => Math.random() - 0.5);
    
    // Берем уникальные апгрейды, сколько есть
    for (let i = 0; i < Math.min(shuffled.length, count); i++) {
        result.push(shuffled[i]);
    }
    
    // 3. Оставшиеся слоты заполняем 'money'
    while (result.length < count) {
        result.push('money');
    }
    
    return result;
}

function load_buttons() {
    kitchen.innerHTML = ''
    for (let type of getUniqueTypes()) {
        // console.log(type)
        if (isTypeUnlocked(type)) {
            create_ingredient_buttons(type)
        } else {
            create_buy_button(type)
        }
    }
}

const element = money_display;

// Создаём наблюдатель
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
            // console.log('Текст изменился! Новый текст:', element.textContent);
            update_buttons_state()

        }
    });
});

// Начинаем наблюдение
observer.observe(element, {
    characterData: true,   // следим за изменением текста
    childList: true,       // следим за добавлением/удалением дочерних узлов
    subtree: true          // следим за всеми потомками
});

function update_buttons_state() {
    let elements = document.getElementsByClassName('upgrade-button')
    // console.log('elements found: ', elements)
    for (let element of elements) {
        // console.log('element.id = ', element.id)
        let element_id = element.id.slice(8)
        // console.log('element id:', element_id)
        // console.log('price of upgrade: ', calculate_price(element_id))
        if (money < calculate_price(element_id)) {
            element.disabled = true
        } else {
            element.disabled = false
        }
    }
    
    elements = document.getElementsByClassName('buy-button')
    // console.log('buy elements found: ', elements)
    for (let element of elements) {
        // console.log('buy element.id = ', element.id)
        element_id = element.id.slice(4)
        // console.log('buy element id:', element_id)
        // console.log('price of buy: ', calculate_buy_price(element_id))
        if (money < calculate_buy_price(element_id)) {
            element.disabled = true
        } else {
            element.disabled = false
        }
    }

    let element = document.querySelector('.tray-buy-button')
    if (money < element.firstChild.textContent.slice(1)) {
        element.disabled = true
    } else {
    element.disabled = false
    }
    
    // element = day_goal_pay_button
    if (money < day_goal) {
        day_goal_pay_button.disabled = true
    } else {
        day_goal_pay_button.disabled = false
    }
}

function update_ingredient_buttons_state() {
    // console.log('update ingredients buttons')
    let elements = document.getElementsByClassName('ingredient-button')
    // console.log('elements: ', elements)
    for (let element of elements) {
        // console.log('element.id = ', element.id)
        // let element_id = element.id.slice(8)
        // console.log ('count: ', ingredients_dictionary[element.id].count )
        if (ingredients_dictionary[element.id].count >= run_upgrades['max_ingredients'].value) {
            element.disabled = true
        } else {
            element.disabled = false
        }
    }}
function update_trays_buttons_state() {
    let elements = document.getElementsByClassName('tray-ingredient-holder-container')
    // console.log('elements: ', elements)
    for (let element of elements) {
        // console.log('update trays buttons states for ', element)
        if (element.children) {
            element.disabled = false
        } else {
            element.disabled = true
        }
    }
}

function create_ingredient_buttons(type) {
    console.log('creating buttons for', type)
    const ingredient_type_column = document.createElement('div')
    ingredient_type_column.className = 'ingredient-type-column'
    kitchen.appendChild(ingredient_type_column)
    
    for (let ingredient of getIngredientsByType(type)) {
        
        const ingredient_buttons_row = document.createElement('div')
        ingredient_buttons_row.className = 'ingredient-buttons-row'
        ingredient_type_column.appendChild(ingredient_buttons_row)

        const ingredient_button = document.createElement('button')
        ingredient_button.className = 'ingredient-button'
        ingredient_button.id = ingredient
        ingredient_buttons_row.appendChild(ingredient_button)
        ingredient_button.addEventListener('click', function() {
            tap_ingredient(ingredient)
        })

        const upgrade_button_column = document.createElement('div')
        upgrade_button_column.className = 'upgrade-button-column'
        ingredient_buttons_row.appendChild(upgrade_button_column)
        // ingredient_buttons_row.textContent = 'x0'

        const upgrade_button = document.createElement('button')
        upgrade_button.className = 'upgrade-button'
        upgrade_button.id = `upgrade-${ingredient}`
        let cost = calculate_price(ingredient)
        upgrade_button.textContent = '$' + cost
        upgrade_button_column.appendChild(upgrade_button)
        
        const cook_image = document.createElement('img')
        cook_image.src = 'images/ingredients-icons/cook.png'
        upgrade_button_column.appendChild(cook_image)
        
        const upgrade_level = document.createElement('div')
        upgrade_level.className = 'upgrade-level'
        upgrade_level.textContent = 'x' + ingredients_dictionary[ingredient].level
        upgrade_button_column.appendChild(upgrade_level)
        
        upgrade_button.addEventListener('click', function() {
            upgrade_ingredient(upgrade_button, upgrade_level, ingredient, cost)
        })

        const ingredient_button_image = document.createElement('img')
        ingredient_button_image.src = 'images/ingredients-icons/' + ingredient + '.png'
        ingredient_button.appendChild(ingredient_button_image)
    }
}

function create_buy_button(type) {
    const buy_button_container = document.createElement('div')
    buy_button_container.className = 'buy-button-container'
    buy_button_container.id = `buy-${type}`
    buy_button_container.style.order = '10'
    kitchen.appendChild(buy_button_container)
    const buy_button = document.createElement('button')
    buy_button.id = `buy-${type}`
    buy_button.className = 'buy-button'
    buy_button.textContent = '$' + calculate_buy_price(type)
    buy_button.style.order = '10'
    
    buy_button_container.appendChild(buy_button)

    const buy_button_image = document.createElement('img')
    buy_button_image.src = 'images/ingredients-order/' + type + '.png'
    buy_button.appendChild(buy_button_image)

    buy_button.addEventListener('click', function() {
        buy_ingredient(type)
    })
}

function buy_ingredient(type) {
    if (money < calculate_buy_price(type)) {return}
    money -= calculate_buy_price(type)
    money_display.textContent = '$' + money
    // const buy_button = document.getElementById(`buy-${type}`)
    // buy_button.remove()
    for (let ingredient of getIngredientsByType(type)){
        ingredients_dictionary[ingredient].level += 1
    }
    const buy_button_container = document.getElementById(`buy-${type}`)
    buy_button_container.remove()
    create_ingredient_buttons(type)
}


// passive cooking
setInterval(() => {
    // console.log(".")
    if (!in_game) {return}
    for (let id in ingredients_dictionary) {
        if (ingredients_dictionary[id].level <= 0 || ingredients_dictionary[id].count >= run_upgrades['max_ingredients'].value) {continue}
        ingredients_dictionary[id].bits += 1 * Math.pow(1.3, ingredients_dictionary[id].level - 1)/2 * run_upgrades['faster_cooking_multiplier'].value;
        if (ingredients_dictionary[id].bits >= ingredients_dictionary[id].difficulity) {
            // ingredients_dictionary[id].count += 1;
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
        last_heart = heart
        lives.appendChild(heart)
    }
    // lives.appendChild(heart)
}

day_goal_pay_button.addEventListener('click', function() {
    // let day_goal = 100 * day
    if (money >= day_goal) {
        money -= day_goal
        day_goal = 0
        goal_display.textContent = `Day Goal Paid`
        day_goal_pay_button.style.display = 'none'
        money_display.textContent = '$' + money
    }
})

function day_start(){
    // console.log("Day Start")
    save()
    // console.log("update hearts to: ", run_upgrades['lives'].value)
    update_hearts()
    plate.style.display = 'flex'
    plate.innerHTML = ""

    const bun_plate = document.createElement('img')
    bun_plate.className = 'on-plate-bun'
    bun_plate.src = "images/ingredients-plate/plate.png"
    plate.appendChild(bun_plate)

    in_game = true
    money += run_upgrades['starting_money'].value
    money_display.textContent = '$' + money
    let minutes = day_min_time
    let seconds = 0
    if (run_upgrades['additional_day_time'].level > 0){
        seconds = 0 + run_upgrades['additional_day_time'].value}
    day += 1
    score = day
    day_goal = 100 * day
    day_goal_pay_button.style.display = 'flex'
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
        if (minutes == 0 && seconds == 5) {
            time_display.style.animation = 'flash 0.5s ease-in-out infinite'
        }
        if (minutes < 0) {
            minutes = 0
            seconds = 0
            time_display.style.animation = ''
            day_end()
        }
        time_display.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`  
    }, 1000);
}

function customer_appear() {
    // console.log("customer_appear")    
    if (!in_game) return;
    fill_order()
    customer_image.style.animation = 'slide-out-opacity ' + 0.6 / run_upgrades['animation_speed'].value + 's ease-in-out'
}
customer_image.addEventListener('animationend', function(e) {
    if (e.animationName == 'slide-out-opacity') {
        is_monster = Boolean(Math.round(Math.random()))
        // console.log("is_monster: ", is_monster)
        let image_list = is_monster ? monster_images : human_images
        
        customer_image.src = image_list[Math.floor(Math.random( )*image_list.length)]
        customer_image.style.display = 'none'
        
    }
})

customer_image.addEventListener('load', function(e) {
    if (!in_game) {
        in_game = true
        return
    }

    // customer_image.style.animation = 'slide-in-opacity ' + 0.6 / run_upgrades['animation_speed'].value + 's ease-in-out'
    // const bun_plate = document.createElement('img')
    // bun_plate.className = 'on-plate-bun'
    // bun_plate.src = "images/ingredients-plate/plate.png"
    // plate.appendChild(bun_plate)
    plate.style.display = 'flex'

    plate.style.animation = 'slide-in ' + 0.7 / run_upgrades['animation_speed'].value + 's ease-in-out'
    customer_image.style.animation = 'slide-in-opacity ' + 0.7 / Math.pow(run_upgrades['animation_speed'].value, 2) + 's ease-in-out'
    customer_image.style.display = 'block'
    wait_timer.style.animation = 'slide-left ' + Math.max(min_wait_time, (20 - day) + run_upgrades['additional_customer_time'].value) + 's linear'
})

wait_timer.addEventListener('animationend', function(e) {
    if (e.animationName == 'slide-left') {
        wait_timer.style.animation = ''
        give_plate(3)
    }
})

function fill_order() {
    order.style.animation = 'fade-out ' + 0.3 / run_upgrades['animation_speed'].value + 's ease-in-out'
}
order.addEventListener('animationend', function(e) {
    order.style.top = '0'
    if (e.animationName == 'fade-out') {
        order.innerHTML = ""
        full_order = []
        const ingredients_avaliable = []
        for (let id in ingredients_dictionary){
            if (ingredients_dictionary[id].level >= 0) {
                ingredients_avaliable.push(id)
            }
        }
        const items_in_order = Math.round(Math.max(1, Math.min(day*1.2 + Math.random()*2, 12) / run_upgrades['customer_demand'].value))
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
        // ingredients_dictionary[ingredient].count += 1;
        ingredients_dictionary[ingredient].bits -= ingredients_dictionary[ingredient].difficulity;
        add_ingredient(ingredient)
    }
    let gradient_stage = 100 * ingredients_dictionary[ingredient].bits / ingredients_dictionary[ingredient].difficulity
    ingredient_button.style.background = `linear-gradient(to right, rgb(64, 50, 110) 0%, rgb(64, 50, 110) ${gradient_stage}%,rgb(96, 67, 127) ${gradient_stage}%, rgb(96, 67, 127) 100%)`
}

function upgrade_ingredient(upgrade_button, upgrade_level, ingredient, cost){
    if (money < cost) {return}
    money -= cost
    ingredients_dictionary[ingredient].level += 1
    cost = calculate_price(ingredient)
    upgrade_level.textContent = 'x' + ingredients_dictionary[ingredient].level
    money_display.textContent = '$' + money
    upgrade_button.textContent = '$' + cost
}

function calculate_price(ingredient) {
    return Math.round ((ingredients_dictionary[ingredient].difficulity * 1.7 + ingredients_dictionary[ingredient].level * 20)/5)
}
function calculate_buy_price(type) {
    let ingredient = getIngredientsByType(type)[0]
    return Math.round(Math.pow(ingredients_dictionary[ingredient].difficulity, 1.3)/3)
}


// add_ingredient('m-meat')
// add ingredient on table
function add_ingredient(ingredient) {
    // console.log('adding ingredient on plate, ', ingredient)
    ingredients_dictionary[ingredient].count += 1;
    update_ingredient_buttons_state()

    const type = getTypeBuyIngredient(ingredient)

    // console.log('determened ingredient type: ', type)
    // console.log('tray for ingredient if bought: ', trays[type].bought)
    const tray_count_display = document.getElementById('tray-count-display-' + ingredient)

    if (trays[type].bought == true) {
        update_trays_buttons_state()
        // console.log('adding' + ingredient + 'on tray')
        const tray_ingredient = document.getElementById('tray-ingredient-' + ingredient)
        const img = document.createElement('img')
        img.src = `images/ingredients-table/${ingredient}.png`
        // tray_ingredient.prepend(img)
        tray_ingredient.appendChild(img)

        const tray_image = document.getElementById('tray-ingredient-image-' + ingredient)
        tray_image.style.display = 'none'
        tray_count_display.textContent = ingredients_dictionary[ingredient].count + '/' + run_upgrades['max_ingredients'].value
        return
    }

    const tableRect = table.getBoundingClientRect();
    const movable_item = document.createElement('div');
    movable_item.className = "ingredient_item"
    // console.log('putting ingredient ', ingredient, ' on plate: ', tableRect)
    movable_item.style.top = tableRect.top + Math.random() * tableRect.height * 0.67 + 'px'
    movable_item.style.left = tableRect.left + Math.random() * tableRect.width * 0.8 + 'px'
    // movable_item.style.left = Math.random() * 85 + '%'
    const img = document.createElement('img')
    img.src = `images/ingredients-table/${ingredient}.png`
    table.appendChild(movable_item)
    movable_item.appendChild(img)
    // ingredient_on_table.push(ingredient)
    // console.log(ingredient_on_table)
    const imgsize = img.clientHeight;
    
    movable_item.addEventListener('touchstart', e => {
        e.preventDefault();
        img.className = 'item-picked'
    }, false)
    movable_item.addEventListener('touchmove', e => {
        e.preventDefault();
        let touch = e.targetTouches[0];
        movable_item.style.top = touch.clientY - imgsize * 0.5 +'px';
        movable_item.style.left = touch.clientX - imgsize * 0.5 + 'px';
        table.appendChild(movable_item)
    }, false)
    movable_item.addEventListener('touchend', e => {
        const plateRect = plate.getBoundingClientRect();
        img.className = ''
        e.preventDefault();
        if (
            plateRect.top <= parseInt(movable_item.style.top) &&
            plateRect.bottom >= parseInt(movable_item.style.top) + imgsize * 0.5 &&
            plateRect.left <= parseInt(movable_item.style.left) &&
            plateRect.right >= parseInt(movable_item.style.left)
        ) {
            place_on_plate(movable_item, ingredient)
            return
        }
        if (
            tableRect.top >= parseInt(movable_item.style.top) + imgsize * 0.75 ||
            tableRect.bottom <= parseInt(movable_item.style.top) + imgsize * 0.5 ||
            tableRect.left >= parseInt(movable_item.style.left) + imgsize * 0.5 ||
            tableRect.right <= parseInt(movable_item.style.left) + imgsize * 0.5
        ) {
            ingredients_dictionary[ingredient].count -= 1
            if (trays[type].bought == true) {add_ingredient(ingredient)}
            movable_item.style.animation = 'fall ' + 0.5 / run_upgrades['animation_speed'].value + 's ease-in-out'
            // tray_count_display.textContent = ingredients_dictionary[ingredient].count + '/' + run_upgrades['max_ingredients'].value
            update_ingredient_buttons_state()

            movable_item.addEventListener('animationend', e => {
                e.preventDefault();
                movable_item.remove()
            }, {once: true})
            return
        }
    })
}

function place_on_plate(movable_item, ingredient) {
    movable_item && table.removeChild(movable_item)
    ingredients_dictionary[ingredient].count -= 1
    update_ingredient_buttons_state()
    update_trays_buttons_state()
    
    const ingredient_on_plate = document.createElement('img')
    ingredient_on_plate.src = `images/ingredients-plate/${ingredient}.png`
    ingredient_on_plate.className = 'on-plate'
    plate.appendChild(ingredient_on_plate)

    full_plate.push(ingredient)
    if (full_plate.length == full_order.length != 0) check_plate()
}

function check_plate() {
    plate_given = true
    let correct = 0
    // let fail = 0
    for (let i = 0; i < full_order.length; i++){
        if (ingredients_dictionary[full_plate[i]].is_monster != is_monster) {
            if (is_monster) {
                // console.log("It's a monster, no money")
                give_plate(1)
                return
            }
            else {
                // console.log("It's not a monster, FAIL FAIL FAIL")
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
    // console.log("GIVE PLATE", fail)
    const bun_top = document.createElement('img')
    bun_top.className = 'on-plate'
    bun_top.src = `images/ingredients-plate/bun-top.png`
    plate.appendChild(bun_top)
    let money_for_plate = 0
    let money_gain
    if (fail == 0) {
        show_emote('like')
        // console.log("Correct!")
        for (let i = 0; i < full_plate.length; i++) {
            money_for_plate += Math.round((ingredients_dictionary[full_plate[i]].difficulity - 20) / 4)
        }
        money_gain = Math.round(money_for_plate * run_upgrades['money_multiplier'].value)
        money += money_gain
        
        money_display.textContent = '$' + money.toString()
        
        money_gain_display.textContent = '+' + money_gain
        // money_display.appendChild(money_gain_display)
        // money_gain_display.style.opacity = '1'
        money_gain_display.style.animation = ''
        void money_gain_display.offsetHeight;
        money_gain_display.style.color = 'rgb(172, 206, 112)'
        money_gain_display.style.animation = 'slide-out-opacity 2s ease-in forwards'
    }
    if (fail == 1) {
        // console.log("It's a monster, no money")
        money_gain = Math.round(-10 * day * Math.random()*4)
        money += money_gain
        money_gain_display.textContent = money_gain
        money_gain_display.style.animation = ''
        void money_gain_display.offsetHeight;
        money_gain_display.style.color = 'rgb(204, 67, 105)'
        money_gain_display.style.animation = 'slide-out-opacity 2s ease-in forwards'
        show_emote('eww')
        money_display.textContent = '$' + money.toString()
        if (money < 0) {
            lose()
        }
    }
    if (fail == 2) {
        // console.log("It's not a monster, FAIL FAIL FAIL")

        
        show_emote('scream')
        // lose()
        run_upgrades['lives'].value -= 1
        // update_hearts()
        // console.log("staring animation on: ", last_heart)
        last_heart.style.animation = 'fall 0.8s ease-in-out'
        last_heart.addEventListener('animationend', function(e) {
            // console.log('animation finished on: ', last_heart)
            update_hearts()
        })  
        if (run_upgrades['lives'].value <= 0) {
            lose()
            return
        }
        // return
    }
    if (fail == 3) {
        show_emote('hmpf')
    }
    plate.style.animation = 'slide-out ' + 0.5 / run_upgrades['animation_speed'].value + 's ease-in-out'

    // console.log("PLATE GIVEN")
}

function show_emote(emote_name) {
    let emote = document.createElement('img')
    // scream.textContent = "AAAAAAAAA!!!!!"
    emote.className = 'emote'
    emote.src = 'images/emotes/' + emote_name + '.png'
    document.body.appendChild(emote)
    emote.style.animation = 'emote-fade 1.85s ease-in-out'
    setTimeout(() => {
        emote.remove()
    }, 1800);
}

// money_gain_display.addEventListener('animationend', function(e) {
//     money_gain_display.textContent = ''
// })

plate.addEventListener('animationend', function(e) {
    if (e.animationName == 'slide-out') {
        // plate.innerHTML = ""
        plate.querySelectorAll('.on-plate').forEach(el => el.remove());

        plate.style.display = 'none'

        full_plate = []
        wait_timer.style.animation = ''
        plate_given = false
        customer_appear()
    }
})


function lose() {
    in_game = false
    clearInterval(timer)
    // console.log("LOSE")
    wait_timer.style.animation = ''
    
    setTimeout(() => {
        menu.style.display = 'flex'
        fail_container.style.display = 'flex'
    }, 1000);
}


function day_end() {
    in_game = false
    // let day_goal = 100 * day
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
    let random_upgrades = get_random_upgrades(3)
    for (let i = 0; i < random_upgrades.length; i++) {
        let random_upgrade = random_upgrades[i]
        let run_upgrade_button = document.createElement('button')
        run_upgrade_button.className = 'run-upgrade-button'
        run_upgrade_button.id = random_upgrade
        run_upgrade_button.textContent = run_upgrades[random_upgrade].name
        // run_upgrade_button.textContent = '[' + run_upgrades[random_upgrade].level + '] — ' + run_upgrades[random_upgrade].name
        upgrade_container.appendChild(run_upgrade_button)
        if (run_upgrades[random_upgrade].type == 'add' || run_upgrades[random_upgrade].type == 'multiply') {
            // console.log("adding level display to: ", run_upgrades[random_upgrade].name)
            // console.log("type: ", run_upgrades[random_upgrade].type)
            let upgrade_level = document.createElement('div')
            upgrade_level.className = 'run-upgrade-level'
            upgrade_level.textContent = run_upgrades[random_upgrade].level + '/' + run_upgrades[random_upgrade].max
            run_upgrade_button.appendChild(upgrade_level)
        }
        run_upgrade_button.addEventListener('click', function() {
            let upgrade_id = this.id
            choose_upgrade(upgrade_id)
        })
    }
}

function choose_upgrade (upgrade_id) {
    // console.log(upgrade_id)
    run_upgrades[upgrade_id].level += 1
    menu.style.display = 'none'
    upgrade_container.style.display = 'none'
    let title = document.getElementById('upgrades')
    upgrade_container.replaceChildren(title);
    // upgrade_container.innerHTML = ''
    update_run_upgrades(upgrade_id)
    load_buttons()
    day_start()
    // creatre_trays()
}

function update_run_upgrades(upgrade_id) {
    // for (upgrade in run_upgrades) {
    // console.log('changing run upgrade', upgrade_id, 'from', run_upgrades[upgrade_id].value, 'level: ', run_upgrades[upgrade_id].level)
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
    // if (run_upgrades[upgrade_id].type == 'lives') {
    //     run_upgrades[upgrade_id].level -= 1
    //     run_upgrades[upgrade_id].value += 1
    // }
    // console.log('run upgrade', upgrade_id, 'updated to', run_upgrades[upgrade_id].value)
}


function save_found() {
    // score_display.innerText = 'MAX SCORE: DAY ' + score
    menu.style.display = 'flex'
    play_subcontainer.style.display = 'flex'
    const continue_button = document.createElement('button')
    continue_button.id = 'continue-button'
    continue_button.className = 'menu-button'
    let continue_day = JSON.parse(localStorage.getItem('day'))
    continue_button.textContent = 'Continue ' + ' Day ' + (continue_day + 1)
    play_subcontainer.appendChild(continue_button)
    continue_button.addEventListener('click', function() {
        console.log('continue button pressed')
        menu.style.display = 'none'
        play_subcontainer.style.display = 'none'
        play_container.style.display = 'none'

        load()
        load_buttons()
        creatre_trays()
        reset_table()
        day_start()
        // creatre_trays()
    })
}

again_button.addEventListener('click', function() {
    menu.style.display = 'none'
    fail_container.style.display = 'none'
    reset(true)
    show_upgrades()
})
start_button.addEventListener('click', function() {
    window.scrollTo(0, 1);
    menu.style.display = 'none'
    play_container.style.display = 'none'
    reset(true)
    show_upgrades()
})

function reset(full) {
    if (full) {
        day = 0
        money = starting_money
        ingredient_type = ''
        kitchen.innerHTML = ''
        table.innerHTML = ''
        // table_container.innerHTML = ''
        tray_buy_button_exists = false
        in_game = false
        plate_given = false
        full_order = []
        full_plate = []

        time_display.textContent = '0:00'
        // money_display.textContent = '$0'

        for (run_upgrade in run_upgrades) {
            run_upgrades[run_upgrade].level = 0
            run_upgrades[run_upgrade].value = run_upgrades[run_upgrade].starting_value
        }
        for (ingredient in ingredients_dictionary) {
            ingredients_dictionary[ingredient].level = ingredients_dictionary[ingredient].initial_level
            ingredients_dictionary[ingredient].bits = 0
            ingredients_dictionary[ingredient].count = 0
        }
        for (let type in trays) {
            trays[type].bought = false
        }
        creatre_trays()
        update_ingredient_buttons_state()
        update_trays_buttons_state()
    }
    money_display.textContent = '$' + money.toString()
    plate.innerHTML = ""
    full_plate = []
    plate_given = false
    clearInterval(timer)
    wait_timer.style.animation = ''
}
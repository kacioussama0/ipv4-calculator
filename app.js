let five = document.querySelector('#five');
let inputs = document.querySelectorAll('.ip');
let is_valid = false;
let btn = document.querySelector('.calc');
let reset = document.querySelector('.reset');
let Mask = document.querySelector('.mask span');
let addNetwork = document.querySelector('.add-network span');
let addBroadcast = document.querySelector('.add-broadcast span');



inputs.forEach(element => {
    element.onblur = function () {
        is_valid = validate(element,0,255)
    }
});

five.onblur = ()=> {
    is_valid = validate(five,0,32)
}




function validate(input,from,to) {
    if(!((input.value >= from) && (input.value <= to)) || input.value == '') {
        input.classList.add('is-invalid');
        return false;
    }

        input.classList.remove('is-invalid');
        return true;
}



btn.onclick = ()=> {

    inputs.forEach(element => {
            is_valid = validate(element,0,255)
    });
    
    is_valid = validate(five,0,32)

    if(is_valid) {
        Mask.innerHTML = mask(five.value);
        addNetwork.innerHTML = addressNet(
            [
                inputs[0].value,
                inputs[1].value,
                inputs[2].value,
                inputs[3].value,
            ],
            five.value
        )

        addBroadcast.innerHTML = addressBroad(
            [
                inputs[0].value,
                inputs[1].value,
                inputs[2].value,
                inputs[3].value,
            ],
            five.value
        )
    }

}

reset.onclick = ()=> {
    resetAll();
}

function mask(mask) {
    let result = [];
    let temp = '';
    let final = '';
    for(let i = 1 ; i <= 32 ; i++){
        (i <= mask) ? temp += 1  : temp += 0;
        if(i % 8 == 0) {
            result.push(temp);
            temp = '';
        }
    }

    result.forEach(element => {
        final += bin_dec(element) + ((i < 32) ?  '.' : '');
    })


    return final;
}


function bin_dec(num) {
    let result = 0;
    num = String(num).split("").reverse().join("");
    for(let i = 0 ; i < num.length ; i++) {
        result += Number(num[i]) * (2**i); 
    }

    return result;

}

function dec_bin(num) {

    let result = '';
    while(num > 0) {
        result += num % 2;
        num = Math.trunc((  num / 2));
    }

    return String(result).split('').reverse().join('');

}


function addressNet(address,m) {
    
    let Mask = mask(m).split('.').slice(0,4);
    let resultAdd = '';
    let temp = '';
    let resultMask = '';
    let finalResult = '';
    address.forEach(element => {
        resultAdd += dec_bin(element).padStart(8,'0');
    });

    Mask.forEach(element => {
        resultMask += dec_bin(element).padEnd(8,'0');
    
    })

    for(let i = 1 ; i <= 32 ; i++) {
        
        temp += resultAdd[i-1] & resultMask[i-1];

        if(i % 8 == 0) {
            finalResult += bin_dec(temp) + ((i < 32) ?  '.' : '');
            temp = '';
        }

    }

    return finalResult;

}

function resetAll() {
    five.value = '';
    inputs.forEach(element => {
        element.value = '';
        element.classList.remove('is-invalid');
    });
    is_valid = false;
    Mask.innerHTML = '0.0.0.0';    
    addBroadcast.innerHTML = '0.0.0.0';    
    addNetwork.innerHTML = '0.0.0.0';    

}

function addressBroad(address,m) {
    
    let Mask = mask(m).split('.').slice(0,4);
    let resultAdd = '';
    let temp = '';
    let resultMask = '';
    let finalResult = '';

    address.forEach(element => {
        resultAdd += dec_bin(element).padStart(8,'0');
    });

    Mask.forEach(element => {
        resultMask += dec_bin(element).padEnd(8,'0');
    
    })

    for(let i = 1 ; i <= 32 ; i++) {
        

        if(i > m) {
            temp+= 1; 
        }else {
            temp += resultAdd[i-1] & resultMask[i-1];
        }

        if(i % 8 == 0) {
            finalResult += bin_dec(temp) + ((i != 32) ?  '.' : '');
            temp = '';
        }

    }

    return finalResult;

}


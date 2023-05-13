function clickBtn(){
    // BOM의 navigator객체의 하위에 geolocation객체가 새로 추가되었음.
    window.navigator.geolocation.getCurrentPosition( function(position){ //OK
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            document.getElementById('target').innerHTML=lat+", "+lng;
    } ,
    function(error){ //error
        switch(error.code){
            case error.PERMISSION_DENIED:
                let str = "사용자 거부";
                break;
            case error.POSITION_UNAVAILABLE:
                str="지리정보 없음";
                break;
            case error.TIMEOUT:
                str="시간 초과";
                break;
            case error.UNKNOWN_ERROR:
                str="알수없는 에러";
                break;
        }
        document.getElementById('target').innerHTML=str;
    });
}

let id;

function clickBtn2(){
    id= navigator.geolocation.watchPosition(function(position){
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        document.getElementById('target').innerHTML=lat+", "+lng;
    });
}

function clickBtn3(){
    navigator.geolocation.clearPosition(id);
}
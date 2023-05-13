import * as Api from '/api.js'
// 문자열+숫자로 이루어진 랜덤 5글자 반환
export const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

// 이메일 형식인지 확인 (true 혹은 false 반환)
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// 숫자에 쉼표를 추가함. (10000 -> 10,000)
export const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
export const convertToNumber = (string) => {
  return parseInt(string.replace(/(,|개|원)/g, ''));
};

// ms만큼 기다리게 함.
export const wait = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

// document.querySelect
export const getElement = (selector)=>{
  return document.querySelector(selector)
}

export const getElementAll = (selector)=>{
  return document.querySelectorAll(selector)
}

export const createElement = (tag) => {
  return document.createElement(tag)
}

export const isAdmin = async() => {
		try{
      const admin = await Api.get('/api/isadmin')
      if(admin.isCorrect === 'ok'){
        return true;
      }
      else if(admin.isCorrect === 'false'){
        return false;
      }
  }catch(err){
    alert(err.message)
    localStorage.removeItem('token')
  }
}

export async function checkLoginAdmin() {
	try {
		if (!(await isAdmin())) {
			swal('관리자가 아닙니다.').then(() => {
				const url = location.href;
        const beforeURI = encodeURIComponent(url);
        location.href = `/login?beforeURI=${beforeURI}`;
			});
		}
	} catch (err) {
		swal(err.message).then(() => {
			const url = location.href;
			const beforeURI = encodeURIComponent(url);
			location.href = `/login?beforeURI=${beforeURI}`;
		});
	}
}
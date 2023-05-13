import { renderGnb } from '/renderGnb.js';
import * as Api from '/api.js';

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	renderGnb();
}

// navbar 데이터 가져오기
const searchForm = document.querySelector('.searchForm');
const getCategories = await Api.get('/api/categories');
const categories = document.querySelector('#nav-list');
// console.log(getCategories);

searchForm.addEventListener('submit', searchData);


async function searchData(e) {
		e.preventDefault();
	
		const searchInput = e.target.searchBar.value
		const query = encodeURIComponent(searchInput)
		location.href = `/search?searchInput=${query}`
}
Object.entries(getCategories).forEach(([key, value]) => {
	let itemList = '';

	for (let i of value) {
		itemList += `<a href="/products/${i}" class="collapse__sublink">${i}</a>`;
	}

	categories.innerHTML += `<div class="nav__link collapse">
  <a href="/products/${key}" class="nav_name">${key}</a>
  <ion-icon
  name="chevron-down-outline"
  class="collapse__link"
></ion-icon>
  <ul class="collapse__menu">
  	${itemList}
  </ul>
</div>`;
});

/* EXPANDER MENU */
const showMenu = (toggleId, categoryNavbarId) => {
	const toggle = document.getElementById(toggleId),
		categoryNavbar = document.getElementById(categoryNavbarId);

	if (toggle && categoryNavbar) {
		toggle.addEventListener('click', () => {
			categoryNavbar.classList.toggle('expander');
		});
	}
};

showMenu('nav-toggle', 'categoryNavbar');

/* LINK ACTIVE */
const linkColor = document.querySelectorAll('.nav__link');
function colorLink() {
	linkColor.forEach((l) => l.classList.remove('active'));
	this.classList.add('active');
}
linkColor.forEach((l) => l.addEventListener('click', colorLink));

/* COLLAPSE MENU */
const linkCollapse = document.getElementsByClassName('collapse__link');

for (let i = 0; i < linkCollapse.length; i++) {
	linkCollapse[i].addEventListener('click', function () {
		const collapseMenu = document.getElementsByClassName('collapse__menu');
		collapseMenu[i].classList.toggle('showCollapse');

		const rotate = document.getElementsByClassName('collapse__link');
		rotate[i].classList.toggle('rotate');
	});
}

const sidebarBtn = document.getElementsByClassName('sidebarBtn');

for (let i = 0; i < sidebarBtn.length; i++) {
	sidebarBtn[i].addEventListener('click', function () {
		sidebarBtn[0].classList.toggle('hidden-Toggle');
		sidebarBtn[1].classList.toggle('hidden-Toggle');
	});
}

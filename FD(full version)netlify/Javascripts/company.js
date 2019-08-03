if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', ready);
} else {
	ready();
}

function ready() {
	fetchItems();
	updateCartTotal();
	UpdateDate();

	var cancelButtons = document.getElementsByClassName('btn-cancelDelivery');
	for (var i = 0; i < cancelButtons.length; i++) {
		var cancelBtn = cancelButtons[i];
		cancelBtn.addEventListener('click', cancelDelivery);
	}
}

function fetchItems() {
	/******** Fetch items from local storage and add those items to UI shopping cart ***********/
	getScript('https://cdnjs.cloudflare.com/ajax/libs/barn/0.2.3/barn.min.js', function() {
		var barn = new Barn(localStorage);
		var name, price, img;
		if (localStorage.getItem('restaurant-condition') == 'checked') {
			document.getElementsByClassName('cart-total-price')[0].innerText =
				'MMK' + localStorage.getItem('total-foodprice-global');
			document.getElementsByClassName('badge')[0].innerText = ' ' + localStorage.getItem('quantityTotal-global');
		}

		for (var a = 0; a < localStorage.getItem('length1'); a++) {
			name = barn.rpop('foodname-global');
			price = barn.rpop('foodprice-global');
			img = barn.rpop('foodimg-global');

			barn.lpush('foodname-global', name);
			barn.lpush('foodprice-global', price);
			barn.lpush('foodimg-global', img);
			addItemToCart(name, price, img);
		}
	});
}

function getScript(url, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	// most browsers
	script.onload = callback;
	// IE 6 & 7
	script.onreadystatechange = function() {
		if (this.readyState == 'complete') {
			callback();
		}
	};
	document.getElementsByTagName('head')[0].appendChild(script);
}

function addItemToCart(title, price, imageSrc) {
	var cartRow = document.createElement('div');
	cartRow.classList.add('cart-row');

	var cartItems = document.getElementsByClassName('cart-items')[0];

	var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title" >${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input style = "cursor:not-allowed;"  class="cart-quantity-input quantity-control" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
		</div>`;
	cartRow.innerHTML = cartRowContents;
	cartItems.append(cartRow);
	cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItems);
	cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

function removeCartItems(event) {
	var buttonClicked = event.target;
	var container = buttonClicked.parentElement.parentElement;
	container.remove(); /******** Removing from UI ********/

	/****************** Removing the selected item from local stroage**********************/
	var title = container.getElementsByClassName('cart-item-title')[0].innerText;
	var price = container.getElementsByClassName('cart-price')[0].innerText;
	var imgSrc = container.getElementsByClassName('cart-item-image')[0].src;
	getScript('https://cdnjs.cloudflare.com/ajax/libs/barn/0.2.3/barn.min.js', function() {
		var barn = new Barn(localStorage);
		var dummyTitle, dummySrc, dummyPrice;
		for (var a = 0; a < localStorage.getItem('length1'); a++) {
			dummyTitle = barn.rpop('foodname-global');
			dummySrc = barn.rpop('foodimg-global');
			dummyPrice = barn.rpop('foodprice-global');

			if (title == dummyTitle && imgSrc == dummySrc && price == dummyPrice) {
				barn.lpush('removed-foodname', dummyTitle);
				barn.lpush('removed-foodprice', dummyPrice);
				barn.lpush('removed-foodimg', dummySrc);
				barn.lpush('removeDummyName', dummyTitle);

				showAlert(event); // show alert box with undo button and cancel button

				var dummyLength = localStorage.getItem('length1');
				dummyLength--;
				localStorage.setItem('length1', dummyLength);
			} else {
				barn.lpush('foodname-global', dummyTitle);
				barn.lpush('foodprice-global', dummyPrice);
				barn.lpush('foodimg-global', dummySrc);
			}
		}
	});

	updateCartTotal();
}

function cancelDelivery(event) {
	alert('Thank you for using our website');
	var buttonClicked = event.target;
	var container = buttonClicked.parentElement.parentElement;
	var body0 = container.getElementsByClassName('cart-items')[0];
	var body1 = container.getElementsByClassName('cart-items')[1];
	document.getElementsByClassName('cart-total-price')[0].innerText = 'MMK ' + 0;
	document.getElementsByClassName('badge')[0].innerText = 0;

	localStorage.clear();
	sessionStorage.clear();

	location.href = 'home.html';
	body0.remove();
	body1.remove();
}

function quantityChanged(event) {
	var input = event.target;
	if (isNaN(input.value) || input.value <= 0) {
		// Validating quantity input
		input.value = 1;
	}
	var buttonClicked = event.target;
	var container = buttonClicked.parentElement.parentElement;
	alert('Please change the quantity in checkout page');
	container.getElementsByClassName('cart-quantity-input')[0].value = 1;
	updateCartTotal();
}

function updateCartTotal() {
	var cartItemContainer = document.getElementsByClassName('cart-items')[0];
	var cartRows = cartItemContainer.getElementsByClassName('cart-row');
	var total = 0;
	var quantityTotal = 0;
	for (var i = 0; i < cartRows.length; i++) {
		var cartRow = cartRows[i];
		var priceElement = cartRow.getElementsByClassName('cart-price')[0];
		var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
		var price = parseFloat(priceElement.innerText.replace('MMK', ''));
		var quantity = quantityElement.value;
		total = total + price * quantity;
		quantityTotal++;
	}

	document.getElementsByClassName('badge')[0].innerText = ' ' + quantityTotal;
	total = Math.round(total * 100) / 100;
	document.getElementsByClassName('cart-total-price')[0].innerText = 'MMK' + total;
}

/****************** Pop Up Modal ************************/
var modal = document.getElementById('myModal');

function show_modal() {
	document.getElementById('myModal').style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
function close_modal() {
	document.getElementById('myModal').style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
};

/************************ When button is clicked , go to the top of page *****************************/

window.onscroll = function() {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById('myBtn').style.display = 'block';
	} else {
		document.getElementById('myBtn').style.display = 'none';
	}
}
function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

function ValidateLocation() {
	// validate if the user has enter his location
	if (sessionStorage.getItem('user-location') == null) {
		alert('Please enter your location first');
		location.href = 'home.html';
	} else {
		location.href = 'Menu/SeasonsBistro_Homemenu.html';
	}
}
function ValidateCart() {
	// Validate check out button , when user click check out button, show alert when there is no item in cart
	if (localStorage.getItem('quantityTotal-global') == null || localStorage.getItem('quantityTotal-global') == '0') {
		alert('Your cart is empty. \n Please add some food items before you check out.');
	} else if (localStorage.getItem('quantityTotal-global') >= 1) {
		if (sessionStorage.getItem('user-location') == null) {
			alert('Please enter your location first');
			location.href = 'home.html';
		} else {
			location.href = 'checkout.html';
			passDate();
		}
	}
}
function passDate() {
	// set tdy date in local storage
	var time = document.getElementById('target').value;
	sessionStorage.setItem('Delivery-Time', time);
	localStorage.setItem('dateChange', '1');
}
function UpdateDate() {
	// get date from local storage and set in caldendar
	var time = sessionStorage.getItem('Delivery-Time');
	document.getElementById('target').value = time;
}

/********* Show alert box when user clicked the remove buttona and add undo button to alert box ********/

var AlertBox = function(id, option) {
	this.show = function() {
		var alertArea = document.querySelector(id);
		var alertBox = document.createElement('DIV');
		var alertContent = document.createElement('DIV');
		var alertClose = document.createElement('A');
		var alertClass = this;

		var barn = new Barn(localStorage);
		var dummy = barn.lpop('removeDummyName');
		var buttonContent =
			`You have removed <span class = 'removeTxt'> ` +
			dummy +
			`</span>` +
			` <br><br>
	<button class = 'undoBtn'>Undo</button> <button class= 'cancelBtn' onclick = "alertClass.hide(alertBox);">Cancel</button>`;

		alertContent.classList.add('alert-content');

		alertContent.innerHTML = buttonContent;

		alertClose.classList.add('alert-close');
		alertClose.setAttribute('href', '#');
		alertBox.classList.add('alert-box');
		alertBox.appendChild(alertContent);
		if (!option.hideCloseButton || typeof option.hideCloseButton === 'undefined') {
			alertBox.appendChild(alertClose);
		}
		alertArea.appendChild(alertBox);
		alertClose.addEventListener('click', function(event) {
			event.preventDefault();
			alertClass.hide(alertBox);
		});
	};

	this.hide = function(alertBox) {
		alertBox.classList.add('hide');
		var disperseTimeout = setTimeout(function() {
			alertBox.parentNode.removeChild(alertBox);
			clearTimeout(disperseTimeout);
		}, 500);
	};
};

var alertPersistent = document.querySelector('#alertPersistent');
var alertHiddenClose = document.querySelector('#alertHiddenClose');

var alertbox = new AlertBox('#alert-area', {
	closeTime: 5000,
	persistent: false,
	hideCloseButton: false
});
var alertboxPersistent = new AlertBox('#alert-area', {
	closeTime: 5000,
	persistent: true,
	hideCloseButton: false
});
var alertNoClose = new AlertBox('#alert-area', {
	closeTime: 5000,
	persistent: false,
	hideCloseButton: true
});

function showAlert(event) {
	alertboxPersistent.show('');
	readyRemove();
}
function readyRemove() {
	getScript('https://cdnjs.cloudflare.com/ajax/libs/barn/0.2.3/barn.min.js', function() {
		var barn = new Barn(localStorage);
		removedLength = barn.llen('removed-foodname');
		localStorage.setItem('removedLength', removedLength);
	});

	// add event listener to cancel buttons
	var undoButtons = document.getElementsByClassName('undoBtn');
	for (var i = 0; i < undoButtons.length; i++) {
		var undo_btn = undoButtons[i];
		undo_btn.addEventListener('click', pushRemovedItems);
	}
	var cancelButtons = document.getElementsByClassName('cancelBtn');
	for (var i = 0; i < cancelButtons.length; i++) {
		var cancel_btn = cancelButtons[i];
		cancel_btn.addEventListener('click', removeAlertBox);
	}
}
function removeAlertBox(event) {
	var cancelBtn = event.target;
	var dummyLength = localStorage.getItem('removedLength');
	dummyLength--;
	localStorage.setItem('removedLength', dummyLength);
	var container = cancelBtn.parentElement.parentElement;
	container.remove();
}
function pushRemovedItems(event) {
	// add the removed items back to the shopping cart

	getScript('https://cdnjs.cloudflare.com/ajax/libs/barn/0.2.3/barn.min.js', function() {
		var barn = new Barn(localStorage);
		var dummyRemovedTitle, dummyRemovedSrc, dummyRemovedPrice, dummyLength;
		var undoBtn = event.target;
		var container = undoBtn.parentElement.parentElement;
		var selectedItem = container.getElementsByClassName('removeTxt')[0].innerText;
		container.remove();

		for (var x = 0; x < localStorage.getItem('removedLength'); x++) {
			dummyRemovedTitle = barn.rpop('removed-foodname');
			dummyRemovedPrice = barn.rpop('removed-foodprice');
			dummyRemovedSrc = barn.rpop('removed-foodimg');

			if (selectedItem == dummyRemovedTitle) {
				console.log('item matched');
				dummyLength = localStorage.getItem('removedLength');
				dummyLength--;
				localStorage.setItem('removedLength', dummyLength);

				barn.lpush('foodname-global', dummyRemovedTitle);
				barn.lpush('foodprice-global', dummyRemovedPrice);
				barn.lpush('foodimg-global', dummyRemovedSrc);
				addItemToCart(dummyRemovedTitle, dummyRemovedPrice, dummyRemovedSrc);
				updateCartTotal();

				break;
			} else {
				barn.lpush('removed-foodname', dummyRemovedTitle);
				barn.lpush('removed-foodprice', dummyRemovedPrice);
				barn.lpush('removed-foodimg', dummyRemovedSrc);
			}
		}
	});
}

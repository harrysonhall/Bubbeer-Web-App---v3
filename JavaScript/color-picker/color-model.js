export default function colorModel(container) {

	let isColorModelOpened = false;


	container.children["color-model"].addEventListener('click', (containerClick) => {

		// console.log('click')
		// if its opened
		// then do code to close it
		if(isColorModelOpened === true) {
			// Closing
			console.log('closing color model - color model click');
			renderColorModelClose(container);
			renderTargetColormodel(container, containerClick);
			isColorModelOpened = false;
		}

	

		// if its closed
		// then do code to open it
		else if(isColorModelOpened === false) {

			setTimeout(() => {

				document.addEventListener('click', (documentClick) => {

					if(isColorModelOpened === true) {
						// Closing
						console.log('closing color model - document click');
						renderColorModelClose(container);
						isColorModelOpened = false;
					}
					
				}, {once: true});

				// Opening
				console.log('opening color model');
				renderColorModelOpen(container);
				isColorModelOpened = true;

			},0);
		};
	});

	console.log(container.children)
};





function renderColorModelOpen(container) {

	// Render the Color Model Container
	Object.assign(container.children["color-model"].style, {
		'border': 'solid #C1C2C6 1px',
		'height': '64px',
		'left': '-16px',
		'width': '63px',
	});
	
	// Render the Color Model Text
	for(const colorModel of container.children["color-model"].children["color-model-wrapper"].children) {
		colorModel.style['padding-left'] = '18px'
	}
}




function renderColorModelClose(container) {
	
	// Render the Color Model Container
	Object.assign(container.children["color-model"].style, {
		'border': 'solid #c1c2c600 1px',
		'height': '22px',
		'left': '-3px',
		'width': '48px',
	});


	for(const colorModel of container.children["color-model"].children["color-model-wrapper"].children) {
		colorModel.style['padding-left'] = '5px'
	}
}







function renderTargetColormodel(container, event) {

	let colorModelWrapper = container.children["color-model"].children["color-model-wrapper"]

	if(event.target.dataset.type == 'color-model') {

		for(const colorModel of colorModelWrapper.children)		colorModel.style['color'] = '#C1C2C6';

		event.target.style['color'] = '#1691E6'

		switch(event.target.innerHTML) {

			case "Hex":  
							Object.assign(colorModelWrapper.style, {
								'top': '1px',
								'bottom': 'initial',
							}); 
							displayHexInput();
			break;


			case "RGB":  
							Object.assign(colorModelWrapper.style, {
								'top': 'initial',
								'bottom': 'initial',
							}); 
							displayRGBHSBInputs();
			break;


			case "HSB":  
							Object.assign(colorModelWrapper.style, {
								'top': 'initial',
								'bottom': '1px',
							}); 
							displayRGBHSBInputs();
			break;
		}
	}

	function displayRGBHSBInputs() {
		container.children["color-1/3"].style.display = "initial";
		container.children["color-2/3"].style.display = "initial";
		container.children["color-3/3"].style.display = "initial";

		container.children["color-full"].style.display = "none";
	}

	function displayHexInput() {
		container.children["color-1/3"].style.display = "none";
		container.children["color-2/3"].style.display = "none";
		container.children["color-3/3"].style.display = "none";

		container.children["color-full"].style.display = "initial";
	}
}
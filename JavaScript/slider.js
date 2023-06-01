console.log('slider.js loaded successfully')

const sliders = document.querySelectorAll('.slider');

for(const slider of sliders) {

	const computedSliderStyle = getComputedStyle(slider);

	const computedSliderThumbStyle = getComputedStyle(slider.children[1])

	const maxValue = (parseFloat(computedSliderStyle.width) - 15);


	// Initalize the Slider's Thumb Value
	slider.children[1].style.setProperty('left', `${maxValue}px`);
	// Initalize the Slider's Value (the blue bar)
	slider.children[0].style.setProperty('width', `${maxValue + 7.5}px`);


	slider.children[1].addEventListener('pointerdown', (downEvent) => {

		let move;

		document.addEventListener('pointermove', move = (moveEvent) => {

			setSliderThumbPosition(slider, maxValue, computedSliderStyle, moveEvent);

		});

		document.addEventListener('pointerup', () => {

			document.removeEventListener('pointermove', move);

			console.log('move removed')

		}, { once: true });
	})
}









function setSliderThumbPosition(slider, maxValue, computedSliderThumbStyle, moveEvent) {

	const sliderBounding = slider.getBoundingClientRect();

	const newSliderThumbPosition = Number(((moveEvent.clientX - parseFloat(sliderBounding.left)) - 7.5).toFixed(2))

			if(newSliderThumbPosition >= 0 && newSliderThumbPosition <= maxValue) {

				// Set the Slider Thumb's left postion
				slider.children[1].style.setProperty('left', `${newSliderThumbPosition}px`);
				// Set the Slider's Value's width 
				slider.children[0].style.setProperty('width', `${newSliderThumbPosition + 7.5}px`);
				

			} else if(newSliderThumbPosition < 0) {

				slider.children[1].style.setProperty('left', `${0}px`);

				slider.children[0].style.setProperty('width', `${0 + 7.5}px`);

			} else if(newSliderThumbPosition > maxValue) {

				slider.children[1].style.setProperty('left', `${maxValue}px`);

				slider.children[0].style.setProperty('width', `${maxValue + 7.5}px`);

			}

	const newPercentValue = ((parseFloat(computedSliderThumbStyle.left) / maxValue) * 100).toFixed(1);

	// Encode the new percentage value into the Slider DOM element as a custom data attribute titled 'value'
	slider.children[1].dataset.value = newPercentValue;
	
}
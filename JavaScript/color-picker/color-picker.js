import colorModel from "./color-model.js";
import renderColorModelValue from "./color-utility.js";


const colorPickerContainers = document.querySelectorAll('.color-picker-container');

const fillHue = {
	r: 255,
	g: 0,
	b: 0,
}


for(const container of colorPickerContainers) {

	colorModel(container);

	hue(container);

	color(container);

	alpha(container);
}






function color(container) {

	let coordinates = { x: 311, y: 0 }

	const canvas = container.children[0];
	const ctx = canvas.getContext("2d");
	const computedStyle = getComputedStyle(canvas);
	const boundingClientRect = canvas.getBoundingClientRect();
		boundingClientRect.reference = canvas;
		boundingClientRect.computedStyle = computedStyle;



	// Acccount for High DPI
	canvas.width = parseInt(computedStyle.width) * devicePixelRatio;
	canvas.height = parseInt(computedStyle.height) * devicePixelRatio;

	// ensure all drawing operations are scaled
	ctx.scale(devicePixelRatio, devicePixelRatio);




	function render() {

		ctx.fillStyle = "white";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		
		// // First, render the Hue
		const hueGradientLine = ctx.createLinearGradient(0, parseInt(computedStyle.height)/2, parseInt(computedStyle.width), parseInt(computedStyle.height)/2,);
			hueGradientLine.addColorStop(0, `rgba(${fillHue.r}, ${fillHue.g}, ${fillHue.b}, 0)`);
			hueGradientLine.addColorStop(0.01, `rgba(${fillHue.r}, ${fillHue.g}, ${fillHue.b}, 0)`);
			hueGradientLine.addColorStop(0.99, `rgba(${fillHue.r}, ${fillHue.g}, ${fillHue.b}, 1)`);
			hueGradientLine.addColorStop(1, `rgba(${fillHue.r}, ${fillHue.g}, ${fillHue.b}, 1)`);
		ctx.fillStyle = hueGradientLine;
		ctx.fillRect(0,0, canvas.width, canvas.height);


		// Second, render the Luminance
		const luminanceGradientLine = ctx.createLinearGradient(parseInt(computedStyle.width)/2, 0, parseInt(computedStyle.width)/2, parseInt(computedStyle.height));
			luminanceGradientLine.addColorStop(0, 'rgba(0,0,0,0)');
			luminanceGradientLine.addColorStop(0.01, 'rgba(0,0,0,0)');
			luminanceGradientLine.addColorStop(0.99, 'rgba(0,0,0,1)');
			luminanceGradientLine.addColorStop(1, 'rgba(0,0,0,1)');
		ctx.fillStyle = luminanceGradientLine;
		ctx.fillRect(0,0,canvas.width, canvas.height);


		// Third, render the canvas cursor
		const outsideStroke = new Path2D();
		outsideStroke.ellipse(coordinates.x/2, coordinates.y/2, 4.5, 4.5, 0, 0, Math.PI * 2);
		ctx.lineWidth = "3";
		ctx.strokeStyle = "#454545";
		ctx.stroke(outsideStroke);

		const insideStroke = new Path2D();
		insideStroke.ellipse(coordinates.x/2, coordinates.y/2, 4.5, 4.5, 0, 0, Math.PI * 2);
		ctx.lineWidth = "2.5";
		ctx.strokeStyle = "white";
		ctx.stroke(insideStroke);


		
		// Fourth, make value pubic by writing it to the container element, then call rerender for rendering it to color model input
		let pixelData = ctx.getImageData(coordinates.x, coordinates.y, 1, 1).data
		container.dataset.r = pixelData[0];
		container.dataset.g = pixelData[1];
		container.dataset.b = pixelData[2];
		console.log(container.dataset.r)
		renderColorModelValue(container);

	}

	render();
	







	let moveEventFunction;
	canvas.addEventListener('pointerdown', (downEvent) => {

		coordinates = getPointerCoordinatesOnCanvas(boundingClientRect, downEvent.clientX, downEvent.clientY);

		render();

		console.log(coordinates)

		document.addEventListener('pointermove', moveEventFunction = (moveEvent) => {

			coordinates = getPointerCoordinatesOnCanvas(boundingClientRect, moveEvent.clientX, moveEvent.clientY);

			render();
			
			console.log(coordinates)
		
			console.log('moving');
		})

		document.addEventListener('pointerup', () => {

			document.removeEventListener('pointermove', moveEventFunction);

			console.log('removed');

		}, { once:true })
	});






	canvas.addEventListener('hueChange', (e) => {

		console.log('hue is changing');

		render();
	})
};

















function hue(container) {

	let coordinates = { x: 12, y: 0 }

	const canvas = container.children[1];
	const ctx = canvas.getContext("2d");
	const computedStyle = getComputedStyle(canvas);
	const boundingClientRect = canvas.getBoundingClientRect();
		boundingClientRect.reference = canvas;
		boundingClientRect.computedStyle = computedStyle;

	// Acccount for High DPI
	canvas.width = parseInt(computedStyle.width) * devicePixelRatio;
	canvas.height = parseInt(computedStyle.height) * devicePixelRatio;

	// ensure all drawing operations are scaled
	ctx.scale(devicePixelRatio, devicePixelRatio);




	function render() {

		const hueGradientLine = ctx.createLinearGradient(parseInt(computedStyle.width)/2, 0, parseInt(computedStyle.width)/2, parseInt(computedStyle.height));

			hueGradientLine.addColorStop(0, 'rgb(255, 0, 0)');
			hueGradientLine.addColorStop(0.01, 'rgb(255, 0, 0)');

			hueGradientLine.addColorStop(1/6, 'rgb(255, 0, 255)');
			hueGradientLine.addColorStop(2/6, 'rgb(0, 0, 255)');
			hueGradientLine.addColorStop(3/6, 'rgb(0, 255, 255)');
			hueGradientLine.addColorStop(4/6, 'rgb(0, 255, 0)');
			hueGradientLine.addColorStop(5/6, 'rgb(255, 255, 0)');

			hueGradientLine.addColorStop(0.99, 'rgb(255, 0, 0)');
			hueGradientLine.addColorStop(1, 'rgb(255, 0, 0)');


		ctx.fillStyle = hueGradientLine;
		ctx.fillRect(0,0,canvas.width, canvas.height);



		
		const pixelData = ctx.getImageData(coordinates.x, coordinates.y, 1, 1).data;

	

		fillHue.r = pixelData[0];
		fillHue.g = pixelData[1];
		fillHue.b = pixelData[2];

		// Distpatch Event to Color Canvas and Alpha Canvas to update their colors
		container.children[0].dispatchEvent(new CustomEvent('hueChange'));
		container.children[2].dispatchEvent(new CustomEvent('hueChange'));





		ctx.lineWidth = "3";
		ctx.strokeStyle = "#454545";
		const outsideStroke = new Path2D();
		outsideStroke.ellipse(coordinates.x/2, coordinates.y/2, 4.5, 4.5, 0, 0, Math.PI * 2);
		ctx.stroke(outsideStroke);

		ctx.lineWidth = "2.5";
		ctx.strokeStyle = "white";
		const insideStroke = new Path2D();
		insideStroke.ellipse(coordinates.x/2, coordinates.y/2, 4.5, 4.5, 0, 0, Math.PI * 2);
		ctx.stroke(insideStroke);
	}

	render();




	let moveEventFunction;
	canvas.addEventListener('pointerdown', (downEvent) => {

		coordinates = getPointerCoordinatesOnCanvas(boundingClientRect, downEvent.clientX, downEvent.clientY);
		coordinates.x = 12;

		render();

		document.addEventListener('pointermove', moveEventFunction = (moveEvent) => {

			coordinates = getPointerCoordinatesOnCanvas(boundingClientRect, moveEvent.clientX, moveEvent.clientY);
			coordinates.x = 12;

			render();

			console.log('moving');
		})

		document.addEventListener('pointerup', () => {

			document.removeEventListener('pointermove', moveEventFunction);

			console.log('removed');

		}, { once:true })
	});

	
}












function alpha(container) {

	let coordinates = { x: 12, y: 0 }

	const canvas = container.children[2];
	const ctx = canvas.getContext("2d");
	const computedStyle = getComputedStyle(canvas);
	const boundingClientRect = canvas.getBoundingClientRect();
		boundingClientRect.reference = canvas;
		boundingClientRect.computedStyle = computedStyle;



	// Acccount for High DPI
	canvas.width = parseInt(computedStyle.width) * devicePixelRatio;
	canvas.height = parseInt(computedStyle.height) * devicePixelRatio;

	// ensure all drawing operations are scaled
	ctx.scale(devicePixelRatio, devicePixelRatio);


	function render() {


		// Render Transparent background pattern
		ctx.fillStyle = "rgb(200,200,200)"
		for(let y = 0; y <= 156; y = y + 8) { 
			ctx.fillRect(0,y,4,4);
			ctx.fillRect(8,y,4,4);
			ctx.fillRect(4,y+4,4,4);
		}

		ctx.fillStyle = "rgb(240,240,240)"
		for(let y = 0; y <= 156; y = y + 8) { 
			ctx.fillRect(0,y+4,4,4);
			ctx.fillRect(4,y,4,4);
			ctx.fillRect(8,y+4,4,4);
		}



		// Render Alpha Gradient
		const alphaGradientLine = ctx.createLinearGradient(parseInt(computedStyle.width)/2, 0, parseInt(computedStyle.width)/2, parseInt(computedStyle.height));
		alphaGradientLine.addColorStop(0, `rgba(${fillHue.r}, ${fillHue.g}, ${fillHue.b}, 1)`);
		alphaGradientLine.addColorStop(1, `rgba(${fillHue.r}, ${fillHue.g}, ${fillHue.b}, 0)`);

		ctx.fillStyle = alphaGradientLine;
		ctx.fillRect(0,0,canvas.width, canvas.height);



		// Render Canvas Cursor
		ctx.lineWidth = "3";
		ctx.strokeStyle = "#454545";
		const outsideStroke = new Path2D();
		outsideStroke.ellipse(coordinates.x/2, coordinates.y/2, 4.5, 4.5, 0, 0, Math.PI * 2);
		ctx.stroke(outsideStroke);

		ctx.lineWidth = "2.5";
		ctx.strokeStyle = "white";
		const insideStroke = new Path2D();
		insideStroke.ellipse(coordinates.x/2, coordinates.y/2, 4.5, 4.5, 0, 0, Math.PI * 2);
		ctx.stroke(insideStroke);
	}

	render();






	let moveEventFunction;
	canvas.addEventListener('pointerdown', (downEvent) => {

		coordinates = getPointerCoordinatesOnCanvas(boundingClientRect, downEvent.clientX, downEvent.clientY);
		coordinates.x = 12;

		render();

		document.addEventListener('pointermove', moveEventFunction = (moveEvent) => {

			coordinates = getPointerCoordinatesOnCanvas(boundingClientRect, moveEvent.clientX, moveEvent.clientY);
			coordinates.x = 12;

			render();
		
			console.log('moving');
		})

		document.addEventListener('pointerup', () => {

			document.removeEventListener('pointermove', moveEventFunction);

			console.log('removed');

		}, { once:true })
	});




	canvas.addEventListener('hueChange', (e) => {

		console.log('hue is changing');

		render();
	})
}














function getPointerCoordinatesOnCanvas(canvasBoundingClientRec, pointerX, pointerY) {

	let borderWidth = parseInt(canvasBoundingClientRec.computedStyle.borderWidth);

	let x = parseFloat(((pointerX - canvasBoundingClientRec.left).toFixed(1) - borderWidth).toFixed(1));
	let y = parseFloat(((pointerY - canvasBoundingClientRec.top).toFixed(1) - borderWidth).toFixed(1));

	let maxWidth = parseInt(canvasBoundingClientRec.computedStyle.width) - 0.5;
	let maxHeight = parseInt(canvasBoundingClientRec.computedStyle.height) - 0.5;

	
		if(x < 0) { 

			x = 0;

		} else if(x > maxWidth) {

				x = maxWidth;

			}


		if(y < 0) { 

			y = 0;

		} else if(y > maxHeight) {

				y = maxHeight;
			}


	x = parseFloat((Math.round(x * 2) / 2).toFixed(1)) * devicePixelRatio;
	y = parseFloat((Math.round(y * 2) / 2).toFixed(1)) * devicePixelRatio;



	return {x: x, y: y};
}









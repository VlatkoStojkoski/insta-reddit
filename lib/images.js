const sizeOf = require('image-size');
const getPixels = require('get-pixels');

const getFirstPixel = (input) =>
	new Promise(async (resolve, reject) => {
		getPixels(input, (err, pixels) => {
			if (err) return reject(err);

			resolve({
				r: pixels.get(0, 0, 0),
				g: pixels.get(0, 0, 1),
				b: pixels.get(0, 0, 2),
			}); // Return RGB object from channels 0, 1, 2 (r, g, b) of 0th column from 0th row
		});
	});

module.exports.padImage = async (input, output, padding = 80) => {
	try {
		const { width, height } = sizeOf(input);
		const size = Math.max(width, height),
			padX = parseInt((size + (padding || padding.x) - width) / 2),
			padY = parseInt((size + (padding || padding.y) - height) / 2); // Calculate paddings as squared image

		const bgColor = await getFirstPixel(input);

		const sharp = require('sharp');
		sharp.cache(false);

		const paddedBuffer = await sharp(input)
			.resize({
				background: {
					r: 255,
					g: 255,
					b: 255,
				},
			})
			.extend({
				top: padY,
				left: padX,
				bottom: padY,
				right: padX,
				background: bgColor,
			})
			.toBuffer(); // Get padded image as buffer

		return await sharp(paddedBuffer).toFile(output); // Save buffer as image to ouptut path
	} catch (error) {
		throw Error(error);
	}
};

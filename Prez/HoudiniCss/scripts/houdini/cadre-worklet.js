registerPaint('cadre', class {
	static get inputProperties() {
        return [
			'--cadre-color'
		];
    }
    paint(ctx, geom, properties) {
		console.log('cadre Paint !');
		const color = properties.get('--cadre-color');
		// Change the fill color.
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;

		const padding = 50;

		// Internal Border
        ctx.beginPath();
		ctx.moveTo(padding, padding);
		ctx.lineTo(geom.width - padding, padding);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(geom.width - padding, padding);
		ctx.lineTo(geom.width - padding, geom.height - padding);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(geom.width - padding, geom.height - padding);
		ctx.lineTo(padding, geom.height - padding);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(padding, geom.height - padding);
		ctx.lineTo(padding, padding);
		ctx.stroke();

		// Corner Left
		const paddingCurve = 30;
		const lengthLine = 120;
		const lengtShorthLine = 3;
		const distCurve = 17;
		const points = [
			{x: padding, y: paddingCurve}, // Point de départ
			{x: padding, y: 10}, // Point Première boucle
			{x: padding - 30, y: (paddingCurve - 10)}, // Point second Boucle
			{x: padding - 32, y: 10}, // Point pointe Boucle
			{x: padding - 25, y: 15}, // Point pointe Boucle
			{x: 10, y: padding}, // Point pointe Boucle
			{x: paddingCurve, y: padding}, // Point pointe Boucle
		]
		ctx.beginPath();
		ctx.moveTo(points[0].x + lengthLine + lengtShorthLine, points[0].y);
		ctx.lineTo(points[0].x + lengthLine + lengtShorthLine * 2 , points[0].y);
		ctx.moveTo(points[0].x + lengthLine + lengtShorthLine * 3, points[0].y);
		ctx.lineTo(points[0].x + lengthLine + lengtShorthLine * 3 + 1, points[0].y);
		ctx.moveTo(points[0].x, points[0].y);
		ctx.lineTo(points[0].x + lengthLine, points[0].y);
		ctx.moveTo(points[0].x, points[0].y);
		ctx.bezierCurveTo(
			points[0].x - distCurve, // x du décalage  point de départ
			points[0].y, // y du déclage de départ
			points[1].x - distCurve, // x du décalage d'arrivée
			points[1].y, // y du décalage du point d'arrivé
			points[1].x, // x du point d'arrivée
			points[1].y) // y du point d'arrivée
		ctx.moveTo(points[1].x, points[1].y);
		ctx.bezierCurveTo(
			points[1].x + distCurve - 7, // x du décalage  point de départ
			points[1].y + distCurve - 7, // y du déclage de départ
			points[2].x + distCurve - 7, // x du décalage d'arrivée
			points[2].y + distCurve - 7, // y du décalage du point d'arrivé
			points[2].x, // x du point d'arrivée
			points[2].y) // y du point d'arrivée
		ctx.moveTo(points[2].x, points[2].y);
		ctx.lineTo(points[3].x, points[3].y);
		ctx.moveTo(points[3].x, points[3].y);
		ctx.lineTo(points[4].x, points[4].y);
		ctx.moveTo(points[4].x, points[4].y);
		ctx.bezierCurveTo(
			points[4].x + distCurve - 7, // x du décalage  point de départ
			points[4].y + distCurve - 7, // y du déclage de départ
			points[5].x + distCurve - 7, // x du décalage d'arrivée
			points[5].y + distCurve - 7, // y du décalage du point d'arrivé
			points[5].x, // x du point d'arrivée
			points[5].y) // y du point d'arrivée
		ctx.moveTo(points[5].x, points[5].y);
		ctx.bezierCurveTo(
			points[5].x, // x du décalage  point de départ
			points[5].y - distCurve, // y du déclage de départ
			points[6].x, // x du décalage d'arrivée
			points[6].y - distCurve, // y du décalage du point d'arrivé
			points[6].x, // x du point d'arrivée
			points[6].y) // y du point d'arrivée
		ctx.moveTo(points[6].x, points[6].y);
		ctx.lineTo(points[6].x, points[6].y + lengthLine);
		ctx.moveTo(points[6].x, points[6].y + lengthLine + lengtShorthLine);
		ctx.lineTo(points[6].x, points[6].y + lengthLine  + lengtShorthLine * 2);
		ctx.moveTo(points[6].x, points[6].y + lengthLine + lengtShorthLine * 3);
		ctx.lineTo(points[6].x, points[6].y + lengthLine  + lengtShorthLine * 3 + 1);
		ctx.stroke();

		// Objectif : https://www.peanutgalleryfilms.com/

		// ctx.lineTo(0, geom.height);
		// ctx.lineTo(0, 0);
    }
});

registerPaint('cadre-img', class {
	static get inputProperties() {
        return [
			'--cadre-corner-1',
			'--cadre-corner-2',
			'--cadre-corner-3',
			'--cadre-corner-4'
		];
    }
    paint(ctx, geom, properties) {
		console.log('cadre Paint !');
		const corner1 = properties.get('--cadre-corner-1');
		const corner2 = properties.get('--cadre-corner-2');
		const corner3 = properties.get('--cadre-corner-3');
		const corner4 = properties.get('--cadre-corner-4');
		// Change the fill color.
		console.log(corner1.state);
		console.log(corner1);
        ctx.drawImage(corner1, 0, 0, 150, 150);
        ctx.drawImage(corner2, geom.width - 150, 0, 150, 150);
        ctx.drawImage(corner3, geom.width - 150,  geom.height - 150, 150, 150);
        ctx.drawImage(corner4, 0,  geom.height - 150, 150, 150);
        ctx.drawImage(corner1, 200, 200, geom.width, geom.height);
    }
});
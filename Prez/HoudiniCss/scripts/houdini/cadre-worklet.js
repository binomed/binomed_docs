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

		const paddingCurve = 30;
		const lengthLine = 120;
		const lengtShorthLine = 3;
		const distCurve = 17;
		const paddingTop = 10;

		this.conerLeft(ctx, padding, paddingCurve, lengthLine, lengtShorthLine, distCurve, paddingTop);

		// Objectif : https://www.peanutgalleryfilms.com/
		// Helper Bezier : http://blogs.sitepointstatic.com/examples/tech/canvas-curves/bezier-curve.html

	}

	conerLeft(ctx, padding, paddingCurve, lengthLine, lengtShorthLine, distCurve, paddingTop){

		// Corner Left
		const points = [
			{x: padding, y: paddingCurve}, // Point de départ
			{x: padding, y: 10}, // Point Première boucle
			{x: padding - 30, y: (paddingCurve - 10)}, // Point second Boucle
			{x: padding - 32, y: 10}, // Point pointe
			{x: padding - 25, y: 15}, // Point pointe deuxième
			{x: 10, y: padding}, // Point troisième Boucle
			{x: paddingCurve, y: padding}, // Point arrivée
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
		ctx.bezierCurveTo(
			points[1].x + distCurve - 7, // x du décalage  point de départ
			points[1].y + distCurve - 7, // y du déclage de départ
			points[2].x + distCurve - 7, // x du décalage d'arrivée
			points[2].y + distCurve - 7, // y du décalage du point d'arrivé
			points[2].x, // x du point d'arrivée
			points[2].y) // y du point d'arrivée
		ctx.lineTo(points[3].x, points[3].y);
		ctx.lineTo(points[4].x, points[4].y);
		ctx.bezierCurveTo(
			points[4].x + distCurve - 7, // x du décalage  point de départ
			points[4].y + distCurve - 7, // y du déclage de départ
			points[5].x + distCurve - 7, // x du décalage d'arrivée
			points[5].y + distCurve - 7, // y du décalage du point d'arrivé
			points[5].x, // x du point d'arrivée
			points[5].y) // y du point d'arrivée
		ctx.bezierCurveTo(
			points[5].x, // x du décalage  point de départ
			points[5].y - distCurve, // y du déclage de départ
			points[6].x, // x du décalage d'arrivée
			points[6].y - distCurve, // y du décalage du point d'arrivé
			points[6].x, // x du point d'arrivée
			points[6].y) // y du point d'arrivée
		ctx.lineTo(points[6].x, points[6].y + lengthLine);
		ctx.moveTo(points[6].x, points[6].y + lengthLine + lengtShorthLine);
		ctx.lineTo(points[6].x, points[6].y + lengthLine  + lengtShorthLine * 2);
		ctx.moveTo(points[6].x, points[6].y + lengthLine + lengtShorthLine * 3);
		ctx.lineTo(points[6].x, points[6].y + lengthLine  + lengtShorthLine * 3 + 1);
		ctx.stroke();

		// vaguelettes
		const pointsVaguelettes = [
			// Ligne
			{x: points[0].x + 30, y: points[0].y},
			{x: points[0].x + 10, y: points[1].y + 5},
			{x: points[0].x + 35, y: points[0].y},
			{x: points[0].x + 20, y: points[1].y + 10},
			// Colonne
			{x: points[6].x, y: points[6].y + 30},
			{x: points[5].x + 5, y: points[6].y + 10},
			{x: points[6].x, y: points[6].y + 35},
			{x: points[5].x + 10, y: points[6].y + 20},
		]
		ctx.beginPath();
		ctx.moveTo(pointsVaguelettes[0].x, pointsVaguelettes[0].y);
		ctx.bezierCurveTo(
			pointsVaguelettes[0].x - 12, // x du décalage  point de départ
			pointsVaguelettes[0].y, // y du déclage de départ
			pointsVaguelettes[1].x, // x du décalage d'arrivée
			pointsVaguelettes[1].y + 12, // y du décalage du point d'arrivé
			pointsVaguelettes[1].x, // x du point d'arrivée
			pointsVaguelettes[1].y) // y du point d'arrivée
		ctx.moveTo(pointsVaguelettes[2].x, pointsVaguelettes[2].y);
		ctx.bezierCurveTo(
			pointsVaguelettes[2].x - 8, // x du décalage  point de départ
			pointsVaguelettes[2].y, // y du déclage de départ
			pointsVaguelettes[3].x, // x du décalage d'arrivée
			pointsVaguelettes[3].y + 8, // y du décalage du point d'arrivé
			pointsVaguelettes[3].x, // x du point d'arrivée
			pointsVaguelettes[3].y) // y du point d'arrivée
		ctx.moveTo(pointsVaguelettes[4].x, pointsVaguelettes[4].y);
		ctx.bezierCurveTo(
			pointsVaguelettes[4].x, // x du décalage  point de départ
			pointsVaguelettes[4].y - 12 , // y du déclage de départ
			pointsVaguelettes[5].x + 12, // x du décalage d'arrivée
			pointsVaguelettes[5].y, // y du décalage du point d'arrivé
			pointsVaguelettes[5].x, // x du point d'arrivée
			pointsVaguelettes[5].y) // y du point d'arrivée
		ctx.moveTo(pointsVaguelettes[6].x, pointsVaguelettes[6].y);
		ctx.bezierCurveTo(
			pointsVaguelettes[6].x, // x du décalage  point de départ
			pointsVaguelettes[6].y -8 , // y du déclage de départ
			pointsVaguelettes[7].x + 8, // x du décalage d'arrivée
			pointsVaguelettes[7].y, // y du décalage du point d'arrivé
			pointsVaguelettes[7].x, // x du point d'arrivée
			pointsVaguelettes[7].y) // y du point d'arrivée
		ctx.stroke();

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
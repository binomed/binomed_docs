registerPaint('circle', class {
    static get inputProperties() {
        return ['--circle-color'];
    }

    static get inputArguments() { return ['<length>', '<color>']; }

    paint(ctx, geom, properties, args) {
        // Change the fill color.
        const color = properties.get('--circle-color').toString();
        ctx.fillStyle = color;

        // Hack due to lack of implementation
        const length = args.length === 2 ? +args[0].toString().replace(/\D/g,'') : 0;
        const colorBorder = args.length === 2 ? args[1].toString() : '#FFF';

        console.log('Args from circle Paint api',args);

        // Determine the center point and radius.
        const x = geom.width / 2;
        const y = geom.height / 2;
        const radiusBorder = Math.min(x, y);
        let radius = Math.min(x, y);
        if (args.length == 2){
            radius = Math.min((geom.width - length) / 2, (geom.height - length) / 2);

        }

        // Draw the circle \o/
        ctx.beginPath();
        if (args.length === 2) {
            ctx.fillStyle = colorBorder;
        }
        ctx.arc(x, y, radiusBorder, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
});
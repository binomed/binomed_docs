registerPaint('circle-from-css', class {
    static get inputProperties() {
        return ['--circle'];
    }

    paint(ctx, geom, properties, args) {
        eval(properties.get('--circle').toString())(ctx, geom, properties);
    }
});
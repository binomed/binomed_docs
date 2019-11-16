/**
 * Class that helps you to play with custom properties 
 * and turn them into JS Code that you execute
 * 
 * If your custom property is named --myVar, this will create a --computeMyVar
 * 
 */
export class HelperJsInCss{

    /**
     * 
     * @param {Element} element : The dom element where we find the custom property and where we apply the compute value
     * @param {string} customProperty : the complete name of custom property (with '--')
     * @param {boolean} loop : true if you want to watch the custom property
     * @param {string[]} args : the list of arguments you can pass to your function (arguments must be custom proerties)
     */
    constructor(element, customProperty, loop, args){
        this.element = element
        this.customProperty = customProperty
        this.lastValue = undefined
        this.loop = loop
        this.args = args
        if (loop){
            window.requestAnimationFrame(this.checkElements.bind(this))
        }else{
            this.checkElements()
        }
    }

    /**
     * Check the custom property and evaluate the script
     */
    checkElements(){


        const value = window.getComputedStyle(this.element).getPropertyValue(this.customProperty)
        const computeArguments = []
        if (this.args && this.args.length > 0){
            this.args.forEach(argumentProperty => {
                const argValue = window.getComputedStyle(this.element).getPropertyValue(argumentProperty)
                computeArguments.push(argValue)
            })
        }


        try{
            const evaluateValue = eval(value)(...computeArguments)
            if (this.lastValue === evaluateValue){
                if (this.loop){
                    window.requestAnimationFrame(this.checkElements.bind(this))
                }
                return;
            }

            this.lastValue = evaluateValue
            const computeName = `--compute${this.customProperty[2].toUpperCase()}${this.customProperty.substring(3)}`
            this.element.style.setProperty(computeName, evaluateValue)
        }catch(err){}

        if (this.loop){
            window.requestAnimationFrame(this.checkElements.bind(this))
        }
    }

}
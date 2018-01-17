'use strict';

export class ConsoleHelper {

    constructor() {
        console.log('Hello ConsoleHelper');
        Reveal.addEventListener('console', this.timer.bind(this));
        Reveal.addEventListener('profile', this.profile.bind(this));
        Reveal.addEventListener('table', this.table.bind(this));
        Reveal.addEventListener('group', this.group.bind(this));
        //Reveal.addEventListener('context', this.context.bind(this));
    }

    longTimeMethod() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    timer() {
        console.time('timerSample');
        this.longTimeMethod().then(_ => {
            console.timeEnd('timerSample');
        });
    }

    profile() {
        console.profile('profileSample');
        this.longTimeMethod().then(_ => {
            console.profileEnd('profileSample');
        });
    }

    table() {
        console.table([{
            a: 1,
            b: 2,
            c: 3
        }, {
            a: "foo",
            b: false,
            c: undefined
        }]);
        console.table([
            [1, 2, 3],
            [2, 3, 4]
        ]);

        function Person(firstName, lastName, age) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.age = age;
        }
        console.table({
            mother: new Person("Susan", "Doyle", 32),
            father: new Person("John", "Doyle", 33),
            daughter: new Person("Lily", "Doyle", 5),
        }, ["firstName", "lastName", "age"]);
    }

    group() {
        console.group('A group label');
        console.log('a log under the group');
        console.info('a second log');
        console.groupEnd()
    }

    context() {
        let logContext = console.context('addContext');
        let perfContext = console.context('perfContext');
        perfContext.info('Start to measure');
        perfContext.time('Measure');
        for (let count = 0; count < 100; count++) {
            logContext.info('Will log the first count %d', count);
        }
        perfContext.timeEnd('Measure');
        perfContext.info('End of measure!');
    }
}
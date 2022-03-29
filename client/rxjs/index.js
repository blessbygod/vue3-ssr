/**
 * @file rxjs的高级用法
 * @author Li Sen
 * @date 2022-03-27
 *
 */
define(["require", "exports", "rxjs"], function (require, exports, rxjs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 强制as HTMLInputElement，可以解决HTMLElement | null 不能作为fromEvent第一个参数的问题
    // 或者tsconfig => strict: false， 但是这样代价有点大
    let $button = document.querySelector('button');
    let button$ = $button;
    let click$ = (0, rxjs_1.fromEvent)(button$, 'click');
    let moves$ = (0, rxjs_1.fromEvent)(button$, 'mousemove');
    // concatWith，是等上面的流走完之后才能触发后续的操作
    let observable = click$.pipe(
    // throttleTime(200),
    (0, rxjs_1.scan)(count => count + 1, 0), (0, rxjs_1.take)(5), (0, rxjs_1.concatWith)(moves$.pipe((0, rxjs_1.map)(() => 'move'))));
    observable
        .subscribe({
        next(value) {
            console.log(`clicked ${value} times`);
        },
        error(err) {
            console.log(err);
        }
    });
    let subject = new rxjs_1.Subject();
    const obs$ = rxjs_1.ajax.ajax(`https://api.github.com/users?per_page=5`).pipe((0, rxjs_1.map)(userResponse => userResponse), (0, rxjs_1.catchError)(error => {
        console.log('error: ', error);
        return (0, rxjs_1.of)(error);
    }));
    obs$.subscribe({
        next(value) {
            console.log(value);
        }
    });
    // const timer1 = interval(1000).pipe(take(5));
    // const timer2 = interval(2000).pipe(take(1));
    // const timer3 = interval(500).pipe(take(1));
    // const concurrent = 5; // the argument
    // const merged = merge(timer1, timer2, timer3, concurrent);
    // merged.subscribe(x => console.log(x));
    (0, rxjs_1.of)(1, 2, 3, 4, 5, 6, 7, 8, 9).pipe((0, rxjs_1.takeLast)(5)).subscribe({
        next(value) {
            console.log(`take Last ${value} number!`);
        }
    });
});

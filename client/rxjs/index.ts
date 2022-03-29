/**
 * @file rxjs的高级用法
 * @author Li Sen
 * @date 2022-03-27
 *
 */

// from Event
import {
	merge,
	of,
	interval,
	fromEvent,
	map,
	scan,
	Subject,
	throttleTime,
	catchError,
	ajax,
	take,
	takeLast,
	concatWith
} from 'rxjs';
// 强制as HTMLInputElement，可以解决HTMLElement | null 不能作为fromEvent第一个参数的问题
// 或者tsconfig => strict: false， 但是这样代价有点大

let $button = document.querySelector('button');
let button$ = $button as HTMLInputElement;

let click$ = fromEvent(button$, 'click');
let moves$ = fromEvent(button$, 'mousemove');


// concatWith，是等上面的流走完之后才能触发后续的操作
let observable = click$.pipe(
	// throttleTime(200),
	scan(count => count + 1, 0),
	take(5),
	concatWith(
		moves$.pipe(
			map(() => 'move')
		)
	)
)
observable
	.subscribe({
		next(value) {
			console.log(`clicked ${value} times`)
		},
		error(err) {
			console.log(err)
		}
	})
let subject = new Subject();

const obs$ = ajax.ajax(`https://api.github.com/users?per_page=5`).pipe(
	map(userResponse => userResponse),
	catchError(error => {
		console.log('error: ', error);
		return of(error);
	})
);
obs$.subscribe({
	next(value: any) {
		console.log(value)
	}
});


// const timer1 = interval(1000).pipe(take(5));
// const timer2 = interval(2000).pipe(take(1));
// const timer3 = interval(500).pipe(take(1));
// const concurrent = 5; // the argument
// const merged = merge(timer1, timer2, timer3, concurrent);
// merged.subscribe(x => console.log(x));


of(1, 2, 3, 4, 5, 6, 7, 8, 9).pipe(
	takeLast(5)
).subscribe({
	next(value) {
		console.log(`take Last ${value} number!`)
	}
})


/**
 * @method testDeprecated
 * @param {string} -- first param is input string
 * @return {String} the return is called
 * @deprecated 2022-03-28 declare this deprecated
 */
function testDeprecated(testString: string): String {
	return new String(testString + ' test string called!');
}

testDeprecated('Li Sen test some function is deprecated!')
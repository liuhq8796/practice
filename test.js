import test from 'ava';
import { reactive } from './reactive.js';
import { effect } from './effect.js';


test('test', async t => {
    const ret = reactive({ num: 0})
    let val
    effect(() => {
        val = ret.num
    })
    t.is(val, 0)
    ret.num++
    t.is(val, 1)
    ret.num++
    t.is(val, 2)
})

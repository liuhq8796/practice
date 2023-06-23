import test from 'ava';
// import { effect, reactive, ref, computed } from '@vue/reactivity';
import { effect } from './effect.js';
import { reactive } from './reactive.js';
import { ref } from './ref.js';
import { computed } from './computed.js';


test('test reactive', async t => {
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

test('test ref', async t => {
    const ret = ref(0)
    let val
    effect(() => {
        val = ret.value
    })
    t.is(val, 0)
    ret.value++
    t.is(val, 1)
    ret.value++
    t.is(val, 2)

    const ret2 = ref({ num: 0})
    let val2
    effect(() => {
        val2 = ret2.value.num
    })
    t.is(val2, 0)
    ret2.value.num++
    t.is(val2, 1)
    ret2.value.num++
    t.is(val2, 2)
})

test('test computed', async t => {
    // computed 基本使用
    const ret = reactive({ count: 1 })
    const num = ref(2)
    const sum = computed(()=>num.value + ret.count)
    t.is(sum.value, 3)

    ret.count++
    t.is(sum.value, 4)
    num.value = 10
    t.is(sum.value, 12)

    // computed 属性修改
    const author = ref('Lucas Liu')
    const course = ref('How to use computed')
    const title = computed({
        get() {
            return author.value + ":" + course.value
        },
        set(val) {
            [author.value, course.value] = val.split(':')
        }
    })
    t.is(title.value, 'Lucas Liu:How to use computed')

    author.value = 'someone'
    course.value = 'something'
    t.is(title.value, 'someone:something')

    // 计算属性赋值
    title.value = 'Lucas Liu:How to use computed'
    t.is(author.value, 'Lucas Liu')
    t.is(course.value, 'How to use computed')
})

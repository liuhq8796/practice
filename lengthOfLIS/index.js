
/**
 * @param {number[]} nums
 * @return {number}
 */
const lengthOfLIS = function(nums) {
    let n = nums.length;
    if (n == 0) {
        return 0;
    }
    let dp = new Array(n).fill(1);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Math.max(...dp) 
}

lengthOfLIS([10,9,2,5,3,7,101,18]) // 4


/**
 * @param {number[]} nums
 * @return {number}
 */
const lengthOfLIS2 = function(nums) {
    let len = nums.length
    if (len <= 1) {
        return len
    }
    let arr = [nums[0]]
    for (let i = 0; i < len; i++) {
        // nums[i] 大于 arr 尾元素时，直接追加到后面，递增序列长度+1
        if (nums[i] > arr[arr.length - 1]) {
            arr.push(nums[i])
        } else {
            // 否则，查找递增子序列中第一个大于numsp[i]的元素 替换它
            // 递增序列，可以使用二分查找
            let left = 0
            let right = arr.length - 1
            while (left < right) {
                let mid = (left + right) >> 1
                if (arr[mid] < nums[i]) {
                    left = mid + 1
                } else {
                    right = mid
                }
            }
            arr[left] = nums[i]
        }
    }
    return arr.length
};

lengthOfLIS2([10,9,2,5,3,7,101,18]) // 4


// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr) {
    const p = arr.slice() //赋值一份arr
    const result = [0]
    let i, j, u, v, c
    const len = arr.length
    for (i = 0; i < len; i++) {
      const arrI = arr[i]
      if (arrI !== 0) {
        j = result[result.length - 1]
        if (arr[j] < arrI) {
          p[i] = j  // 存储在result最后一个索引的值
          result.push(i)
          continue
        }
        u = 0
        v = result.length - 1
          // 二分查找，查找比arrI小的节点，更新result的值
        while (u < v) {
          c = (u + v) >> 1
          if (arr[result[c]] < arrI) {
            u = c + 1
          } else {
            v = c
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1]
          }
          result[u] = i
        }
      }
    }
    u = result.length
    v = result[u - 1]
      // 查找数组p 找到最终的索引
    while (u-- > 0) {
      result[u] = v
      v = p[v]
    }
    return result
  }

    getSequence([10,9,2,5,3,7,101,18]) // [2, 3, 7, 18]
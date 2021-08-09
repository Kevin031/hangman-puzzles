/**
 * 目标：实现一个猜单词游戏模型
 * 猜测条件：(1)词典；(2)单词长度
 * 猜测过程：guess方法返回1个字母，response方法会接收到猜测结果，根据此结果，再次猜测下一个字母，直到猜出整个单词
 * 限制：最多猜测11次
 * 
 * 举例：要猜的单词：piggy
 * guess: i
 * response: _i___
 * 
 * guess: a
 * response: _i___
 * 
 * guess: g
 * response: _igg_
 * 
 * 以此类推。
 * 猜测结果会包含字母位置信息，未猜出的字母以下划线表示
 */
const { red, green, blue } = require('chalk')

/**
 * 游戏生成
 * @param {string[]} wordList 词典
 * @returns {object}
 */
function Machine(wordList) {
  return {
    /**
     * 玩家生成器
     * @param {number} wordLen 单词长度
     * @returns {object} 玩家对象
     */
    player: function (wordLen) {
      const player = {
        /**
         * 词典
         */
        wordList: wordList.filter(w => w.length === wordLen),

        /**
         * 猜过的字母
         */
        guessed: new Set(),

        /**
         * 猜测结果
         */
        result: Array(wordLen).fill('_').join(''),

        /**
         * 本轮猜测单词
         */
        letter: null,

        /**
         * 猜测单词内的字母
         * @returns {string}
         */
        guess: function () {
          // 获取当前猜测索引
          // let index = 0
          // for (let i in this.result) {
          //   if (this.result[i] === '_') {
          //     index = i
          //     break
          //   }
          // }
          // 获取字母排序
          let rankMap = {}
          // this.wordList
          //   .map(word => word[index])
          //   .forEach(letter => {
          //     if (!rankMap[letter]) {
          //       rankMap[letter] = 0
          //     }
          //     rankMap[letter]++
          //   })
          this.wordList.forEach(word => {
            word.split('').forEach(letter => {
              if (!rankMap[letter]) {
                rankMap[letter] = 0
              }
              rankMap[letter]++
            })
          })
          const rank = Object.keys(rankMap)
            .map(letter => ({ letter, time: rankMap[letter] }))
            .sort((a, b) => b.time - a.time)
          // console.log(rank)
          // console.log('rank', rank)
          const letterList = rank.map(item => item.letter)
          // 获取字母
          let _letter
          for (let letter of letterList) {
            if (this.guessed.has(letter)) continue
            _letter = letter
            break
          }
          // console.log('猜测:', _letter)
          this.guessed.add(_letter)
          this.letter = _letter

          return _letter
        },
        /**
         * 接收猜测结果
         * @param {string} result 猜测结果
         */
        response: function (result) {
          // console.log('结果:', result)
          // 猜错了
          if (this.result === result) {
            // 过滤掉当前猜错的字母
            // console.error(red('猜错了，过滤含有' + this.letter + '的单词'))
            this.wordList = this.wordList.filter(word => !word.includes(this.letter)) 
          }
          // 更新结果
          this.result = result
          // 更新词典
          this.wordList = this.wordList.filter(word => {
            return word.split('').every((letter, index) => {
              return result[index] === '_' || letter === result[index]
            })
          })
        }
      }
      return player
    }
  };
}
module.exports = Machine
